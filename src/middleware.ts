import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = (request.headers.get("host")?.split(":")[0] ?? request.nextUrl.hostname).toLowerCase();
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const protocol = forwardedProto ?? request.nextUrl.protocol.replace(":", "");
  const isProduction = process.env.NODE_ENV === "production";
  const isCanonicalHost = hostname === "seeltransport.de";
  const isWwwHost = hostname === "www.seeltransport.de";

  if (isProduction && (isWwwHost || (isCanonicalHost && protocol !== "https"))) {
    const canonicalUrl = request.nextUrl.clone();
    canonicalUrl.protocol = "https:";
    canonicalUrl.hostname = "seeltransport.de";
    canonicalUrl.port = "";
    return NextResponse.redirect(canonicalUrl, 301);
  }

  if (pathname.startsWith("/2024/") || pathname === "/2024" || pathname.startsWith("/2025/") || pathname === "/2025") {
    return NextResponse.redirect(new URL("/", request.url), 301);
  }

  if (pathname !== "/" && pathname.endsWith("/")) {
    const normalizedUrl = request.nextUrl.clone();
    normalizedUrl.pathname = pathname.replace(/\/+$/, "");
    return NextResponse.redirect(normalizedUrl, 301);
  }

  if (
    pathname === "/admin/manifest.webmanifest" ||
    pathname === "/admin/offline" ||
    pathname === "/admin-sw.js"
  ) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-next-url", pathname);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

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
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|icons|uploads|fonts|manifest.json|sw.js|admin-sw.js|sitemap.xml|robots.txt).*)"],
};
