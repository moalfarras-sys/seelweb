import { getIronSession, IronSession } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  userId: string;
  email: string;
  name: string;
  role: string;
  isLoggedIn: boolean;
}

function resolveSessionPassword(): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (secret && secret.length >= 32) return secret;
  // Fail fast in production: never seal admin sessions with a known/weak secret.
  if (process.env.NODE_ENV === "production") {
    throw new Error("NEXTAUTH_SECRET must be set to a value of at least 32 characters in production.");
  }
  // Development-only placeholder (clearly not for production use).
  return "dev-only-insecure-session-secret-change-me-please";
}

export const sessionOptions = {
  // Getter so the production fail-fast triggers at request time, not at build/module load.
  get password() {
    return resolveSessionPassword();
  },
  cookieName: "seel-admin-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 8,
    path: "/",
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
