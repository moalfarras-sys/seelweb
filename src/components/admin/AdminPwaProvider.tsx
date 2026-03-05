"use client";

import { useEffect, useState } from "react";

type DeferredPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export default function AdminPwaProvider() {
  const [deferredPrompt, setDeferredPrompt] = useState<DeferredPrompt | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/admin-sw.js", { scope: "/admin/" }).catch(() => {});
  }, []);

  useEffect(() => {
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as DeferredPrompt);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const triggerInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  if (installed || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[70] rounded-xl border border-teal-300/40 bg-teal-500 px-3 py-2 text-white shadow-lg">
      <button onClick={triggerInstall} className="text-sm font-semibold">
        Admin App installieren
      </button>
    </div>
  );
}
