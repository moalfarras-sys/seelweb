import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

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

    const admin = await prisma.adminUser.findUnique({ where: { email } });

    if (!admin) {
      const envEmail = process.env.ADMIN_EMAIL;
      const envPass = process.env.ADMIN_PASSWORD;
      if (email === envEmail && password === envPass) {
        const session = await getSession();
        session.userId = "env-admin";
        session.email = email;
        session.name = "Administrator";
        session.role = "admin";
        session.isLoggedIn = true;
        await session.save();
        clearFailures(ip);
        return NextResponse.json({ success: true });
      }
      recordFailure(ip);
      return NextResponse.json({ error: "Ungültige Anmeldedaten" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      recordFailure(ip);
      return NextResponse.json({ error: "Ungültige Anmeldedaten" }, { status: 401 });
    }

    const session = await getSession();
    session.userId = admin.id;
    session.email = admin.email;
    session.name = admin.name;
    session.role = admin.role;
    session.isLoggedIn = true;
    await session.save();
    clearFailures(ip);

    return NextResponse.json({ success: true });
  } catch (err) {
    recordFailure(ip);
    console.error("Login error:", err);
    return NextResponse.json({ error: "Anmeldefehler" }, { status: 500 });
  }
}

