import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "E-Mail und Passwort erforderlich" }, { status: 400 });
    };

const admin = await prisma.adminUser.findUnique({ where : { email } });

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
        return NextResponse.json({ success: true });
      } return NextResponse.json({ error: "Ungültige Anmeldedaten" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Ungültige Anmeldedaten" }, { status: 401 });
    }

    const session = await getSession();
    session.userId = admin.id;
    session.email = admin.email;
    session.name = admin.name;
    session.role = admin.role;
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Anmeldefehler" }, { status: 500 });
  }
}
