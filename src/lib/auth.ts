import { getIronSession, IronSession } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  userId: string;
  email: string;
  name: string;
  role: string;
  isLoggedIn: boolean;
}

const sessionOptions = {
  password: process.env.NEXTAUTH_SECRET || "seel-transport-secret-key-change-in-production-2024-min32chars!!",
  cookieName: "seel-admin-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 8,
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
};

export async function isAuthenticated() : Promise<boolean> {
  const session = await getSession();
  return !!session.isLoggedIn;
}
