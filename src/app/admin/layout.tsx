import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata } from "next";
import AdminShell from "./AdminShell";

export const metadata: Metadata = {
  title: "SEEL Admin",
  description: "SEEL Admin Panel",
  manifest: "/admin/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SEEL Admin",
  },
  icons: {
    apple: [{ url: "/icons/admin-180.png", sizes: "180x180", type: "image/png" }],
    icon: [
      { url: "/icons/admin-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/admin-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get("x-next-url") || "";
  const session = await getSession();

  if (!session.isLoggedIn && pathname !== "/admin/login") {
    redirect("/admin/login");
  }

  if (session.isLoggedIn && pathname === "/admin/login") {
    redirect("/admin");
  }

  if (!session.isLoggedIn) {
    return <>{children}</>;
  }

  return <AdminShell userName={session.name || "Admin"}>{children}</AdminShell>;
}
