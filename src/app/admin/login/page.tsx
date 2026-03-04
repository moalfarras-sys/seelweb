"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, Mail, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Anmeldefehler");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Netzwerkfehler. Bitte versuchen Sie es erneut.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image src="/images/logo.jpeg" alt="Seel Transport" width={64} height={64} className="h-16 w-16 rounded-xl" />
          </div>
          <h1 className="text-2xl font-bold text-white">SEEL Admin</h1>
          <p className="text-silver-400 text-sm mt-1">Melden Sie sich an, um fortzufahren</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-300 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-silver-200 mb-2">E-Mail</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-navy-800/60 border border-navy-600 rounded-xl text-white placeholder-silver-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                placeholder="admin@seeltransport.de"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-silver-200 mb-2">Passwort</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver-400" />
              <input type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-navy-800/60 border border-navy-600 rounded-xl text-white placeholder-silver-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                placeholder="Passwort eingeben"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-silver-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            ) : (
              <>Anmelden <ArrowRight size={18} /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
