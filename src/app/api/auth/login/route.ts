import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sealData } from "iron-session";
import { prisma } from "@/lib/db";
import { SessionData, sessionOptions } from "@/lib/auth";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;
const attempts = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: NextRequest) {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || "unknown";
  return req.ip || "unknown";
}

function canAttempt(ip: string) {
  const now = Date.now();
  const state = attempts.get(ip);
  if (!state || now > state.resetAt) {
    attempts.set(ip, { count: 0, resetAt: now + WINDOW_MS });
    return true;
  }
  return state.count < MAX_ATTEMPTS;
}

function recordFailure(ip: string) {
  const now = Date.now();
  const state = attempts.get(ip);
  if (!state || now > state.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  state.count += 1;
  attempts.set(ip, state);
}

function clearFailures(ip: string) {
  attempts.delete(ip);
}

async function createLoginResponse(session: SessionData) {
  const sealedSession = await sealData(session, {
    password: sessionOptions.password,
    ttl: sessionOptions.cookieOptions.maxAge,
  });
  const response = NextResponse.json({ success: true });
  response.cookies.set(sessionOptions.cookieName, sealedSession, sessionOptions.cookieOptions);
  return response;
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  try {
    if (!canAttempt(ip)) {
      return NextResponse.json(
        { error: "Zu viele Login-Versuche. Bitte später erneut versuchen." },
        { status: 429 }
      );
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "E-Mail und Passwort erforderlich" }, { status: 400 });
    }

    let admin = null;
    try {
      admin = await prisma.adminUser.findUnique({ where: { email } });
    } catch (dbErr) {
      console.warn("DB lookup failed, falling back to env auth:", (dbErr as Error).message);
    }

    if (!admin) {
      const envEmail = process.env.ADMIN_EMAIL;
      const envPass = process.env.ADMIN_PASSWORD;
      if (email === envEmail && password === envPass) {
        clearFailures(ip);
        return createLoginResponse({
          userId: "env-admin",
          email,
          name: "Administrator",
          role: "admin",
          isLoggedIn: true,
        });
      }
      recordFailure(ip);
      return NextResponse.json({ error: "Ungültige Anmeldedaten" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      recordFailure(ip);
      return NextResponse.json({ error: "Ungültige Anmeldedaten" }, { status: 401 });
    }

    clearFailures(ip);

    return createLoginResponse({
      userId: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      isLoggedIn: true,
    });
  } catch (err) {
    recordFailure(ip);
    console.error("Login error:", err);
    return NextResponse.json({ error: "Anmeldefehler" }, { status: 500 });
  }
}

