"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Euro,
  Users,
  BarChart3,
  FileText,
  LogOut,
  Menu,
  X,
  Settings,
  Calculator,
  BriefcaseBusiness,
  HeartPulse,
  ChevronRight,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AdminPwaProvider from "@/components/admin/AdminPwaProvider";
import AdminThemeToggle from "@/components/admin/AdminThemeToggle";

const sidebarLinks = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard", group: "main" },
  { href: "/admin/buchungen", icon: CalendarDays, label: "Buchungen", group: "main" },
  { href: "/admin/angebote", icon: BriefcaseBusiness, label: "Angebote", group: "main" },
  { href: "/admin/kunden", icon: Users, label: "Kunden", group: "main" },
  { href: "/admin/rechnungen", icon: FileText, label: "Rechnungen", group: "finance" },
  { href: "/admin/buchhaltung", icon: Calculator, label: "Buchhaltung", group: "finance" },
  { href: "/admin/preise", icon: Euro, label: "Preise", group: "finance" },
  { href: "/admin/preisregeln", icon: Euro, label: "Preisregeln", group: "finance" },
  { href: "/admin/berichte", icon: BarChart3, label: "Berichte", group: "finance" },
  { href: "/admin/einstellungen", icon: Settings, label: "Einstellungen", group: "system" },
  { href: "/admin/gesundheit", icon: HeartPulse, label: "Systemstatus", group: "system" },
];

const groups = [
  { key: "main", label: "Verwaltung" },
  { key: "finance", label: "Finanzen" },
  { key: "system", label: "System" },
];

export default function AdminShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100/80 via-cyan-50/70 to-blue-100/70 dark:from-[#060f20] dark:via-[#08152b] dark:to-[#050b16] flex">
      <AdminPwaProvider />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:translate-x-0 lg:static flex flex-col",
          "bg-white/88 dark:bg-[#030810]/96 backdrop-blur-2xl border-r border-sky-200/60 dark:border-white/5 shadow-xl shadow-sky-900/5 dark:shadow-black/30",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-sky-200/60 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-teal-500/30 shadow-lg">
              <Image src="/images/logo.jpeg" alt="Seel" width={40} height={40} className="object-cover w-full h-full" />
            </div>
            <div>
              <p className="text-navy-900 dark:text-white font-bold text-sm tracking-wide">SEEL Admin</p>
              <p className="text-teal-700/80 dark:text-teal-400/70 text-xs truncate max-w-[110px]">{userName}</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-navy-500 hover:text-navy-800 dark:text-white/40 dark:hover:text-white transition-colors"
            aria-label="Schliessen"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {groups.map((group) => {
            const links = sidebarLinks.filter((l) => l.group === group.key);
            return (
              <div key={group.key}>
                <p className="text-[10px] font-bold text-slate-400 dark:text-white/25 uppercase tracking-widest px-3 mb-2">
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {links.map((link) => {
                    const Icon = link.icon;
                    const active = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                          active
                            ? "bg-teal-500/15 text-teal-700 dark:text-teal-400 shadow-sm"
                            : "text-slate-600 dark:text-white/50 hover:bg-sky-100/70 dark:hover:bg-white/5 hover:text-navy-900 dark:hover:text-white/90"
                        )}
                      >
                        <Icon
                          size={18}
                          className={cn(
                            "transition-colors",
                            active
                              ? "text-teal-600 dark:text-teal-400"
                              : "text-slate-400 dark:text-white/40 group-hover:text-navy-700 dark:group-hover:text-white/70"
                          )}
                        />
                        <span className="flex-1">{link.label}</span>
                        {active && <ChevronRight size={14} className="text-teal-600/70 dark:text-teal-400/60" />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-sky-200/60 dark:border-white/5">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-white/40 hover:bg-sky-100/70 dark:hover:bg-white/5 hover:text-navy-800 dark:hover:text-white/80 transition-all mb-1"
          >
            <svg className="w-[18px] h-[18px] text-slate-400 dark:text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Zur Website
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-white/40 hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400 transition-all w-full"
          >
            <LogOut size={18} />
            Abmelden
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="bg-white/82 dark:bg-navy-900/80 backdrop-blur-xl border-b border-sky-200/60 dark:border-white/5 px-4 md:px-8 py-3.5 flex items-center gap-4 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-navy-800 transition-colors"
            aria-label="Menue oeffnen"
          >
            <Menu size={20} className="text-navy-800 dark:text-white" />
          </button>

          <div className="hidden md:flex items-center gap-2 text-sm text-silver-500 dark:text-silver-400">
            <span className="font-medium text-navy-800 dark:text-white">Admin</span>
            {pathname !== "/admin" && (
              <>
                <ChevronRight size={14} />
                <span className="capitalize text-teal-600 dark:text-teal-400">{pathname.split("/").pop()?.replace("-", " ")}</span>
              </>
            )}
          </div>

          <div className="flex-1" />

          <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-navy-800 text-silver-500 dark:text-silver-400 hover:text-navy-800 dark:hover:text-white transition-colors relative">
            <Bell size={18} />
          </button>

          <AdminThemeToggle />

          <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200 dark:border-white/10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-navy-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
              {userName[0]?.toUpperCase()}
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-semibold text-navy-800 dark:text-white leading-none">{userName}</p>
              <p className="text-[10px] text-silver-400 mt-0.5">Administrator</p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
