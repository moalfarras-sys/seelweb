import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import AdminShell from "./AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get("x-next-url") || "";
  const session = await getSession();

  if (!session.isLoggedIn && pathname !== "/admin/login") {
    redirect("/admin/login");
  }

  if (!session.isLoggedIn) {
    return <>{children}</>;
  }

  return <AdminShell userName={session.name || "Admin"}>{children}</AdminShell>;
}
