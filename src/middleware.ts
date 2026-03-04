import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-next-url", pathname);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  if (pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get("seel-admin-session");
    if (!sessionCookie?.value) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-next-url", pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|manifest.json|sw.js).*)"],
};
