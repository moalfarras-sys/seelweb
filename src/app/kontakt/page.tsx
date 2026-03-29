"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, MapPin, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { useSiteContent } from "@/components/SiteContentProvider";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type TrackingState = {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  referrer: string;
  landing_page: string;
};

function buildWhatsappUrl(number: string) {
  return `https://wa.me/${number}`;
}

export default function KontaktPage() {
  const { company, contact } = useSiteContent();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [honeypot, setHoneypot] = useState("");
  const [tracking, setTracking] = useState<TrackingState>({
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    referrer: "",
    landing_page: "",
  });
  const [gdpr, setGdpr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [clientValidationError, setClientValidationError] = useState("");

  useEffect(() => {
    const subject = searchParams.get("subject");
    if (!subject) return;
    setForm((current) => ({ ...current, subject }));
  }, [searchParams]);

  useEffect(() => {
    setTracking({
      utm_source: searchParams.get("utm_source") ?? "",
      utm_medium: searchParams.get("utm_medium") ?? "",
      utm_campaign: searchParams.get("utm_campaign") ?? "",
      referrer: typeof document !== "undefined" ? document.referrer : "",
      landing_page: typeof window !== "undefined" ? window.location.pathname : "",
    });
  }, [searchParams]);

  function updateForm(patch: Partial<typeof form>) {
    setClientValidationError("");
    setForm((current) => ({ ...current, ...patch }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setClientValidationError("");
    setError(false);

    if (honeypot.trim()) return;
    if (!gdpr) return;

    const nameOk = form.name.trim().length > 0;
    const emailOk = form.email.trim().length > 0 && EMAIL_REGEX.test(form.email.trim());
    const subjectOk = form.subject.trim().length > 0;
    const messageOk = form.message.trim().length > 0;
    if (!nameOk || !emailOk || !subjectOk || !messageOk) {
      setClientValidationError("Bitte füllen Sie alle Pflichtfelder aus und geben Sie eine gültige E-Mail-Adresse ein.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          website: honeypot,
          ...tracking,
        }),
      });
      if (!response.ok) throw new Error("request_failed");
      setSubmitted(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  const inputClasses =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 dark:border-white/10 dark:bg-white/5 dark:text-white";

  return (
    <>
      <section className="gradient-navy py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-300">Kontakt</p>
              <h1 className="mt-4 text-4xl font-semibold text-white md:text-5xl">Direkte Anfrage statt unnötiger Umwege.</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/72">
                Schreiben Sie uns für Umzug, Reinigung, Entrümpelung oder Ihre Festpreisanfrage. Wir melden uns strukturiert und zeitnah zurück.
              </p>
            </div>
            <div className="glass rounded-[30px] p-6 text-white">
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { label: "Standort", value: `${company.city}, ${company.country}` },
                  { label: "Telefon", value: contact.primaryPhoneDisplay },
                  { label: "E-Mail", value: contact.email },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-white/55">{item.label}</p>
                    <p className="mt-2 text-sm font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            {[
              { icon: Phone, title: "Telefon", value: contact.primaryPhoneDisplay, href: `tel:${contact.primaryPhone}` },
              { icon: Mail, title: "E-Mail", value: contact.email, href: `mailto:${contact.email}` },
              { icon: MapPin, title: "Standort", value: `${company.city}, ${company.country}` },
              { icon: MessageCircle, title: "WhatsApp", value: "Direktnachricht starten", href: buildWhatsappUrl(contact.whatsappNumber), external: true },
            ].map((item) => {
              const Icon = item.icon;
              const content = (
                <div className="glass-card rounded-[28px] p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-600 dark:text-white/60">{item.value}</p>
                    </div>
                  </div>
                </div>
              );

              if (!item.href) return <div key={item.title}>{content}</div>;

              return (
                <a key={item.title} href={item.href} target={item.external ? "_blank" : undefined} rel={item.external ? "noopener noreferrer" : undefined}>
                  {content}
                </a>
              );
            })}

            <div className="glass-card rounded-[28px] p-6">
              <div className="flex items-start gap-3">
                <ShieldCheck size={18} className="mt-1 text-emerald-700 dark:text-emerald-300" />
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Klare Bearbeitung</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-white/60">
                    Ihre Anfrage landet direkt bei {company.name}. Pflichtangaben, Datenschutz und Rückmeldungen bleiben sauber strukturiert.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-strong rounded-[32px] p-6 md:p-8">
            {submitted ? (
              <div className="rounded-[28px] bg-emerald-50 p-8 text-center dark:bg-emerald-500/10">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Nachricht gesendet</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-white/60">
                  Vielen Dank. Wir melden uns schnellstmöglich bei Ihnen zurück.
                </p>
                <Link href="/" className="mt-5 inline-flex text-sm font-semibold text-emerald-700 transition hover:text-emerald-600">
                  Zur Startseite
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Kontaktformular</p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">Anfrage senden</h2>
                </div>

                {clientValidationError && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                    {clientValidationError}
                  </div>
                )}
                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                    Beim Senden ist ein Fehler aufgetreten.
                  </div>
                )}

                <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0" aria-hidden="true">
                  <label htmlFor="kontakt-website">Website</label>
                  <input id="kontakt-website" type="text" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <input required value={form.name} onChange={(event) => updateForm({ name: event.target.value })} placeholder="Ihr Name" className={inputClasses} />
                  <input required type="email" value={form.email} onChange={(event) => updateForm({ email: event.target.value })} placeholder="E-Mail" className={inputClasses} />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <input value={form.phone} onChange={(event) => updateForm({ phone: event.target.value })} placeholder="Telefon" className={inputClasses} />
                  <input required value={form.subject} onChange={(event) => updateForm({ subject: event.target.value })} placeholder="Betreff" className={inputClasses} />
                </div>
                <textarea required rows={6} value={form.message} onChange={(event) => updateForm({ message: event.target.value })} placeholder="Ihre Nachricht" className={`${inputClasses} resize-none`} />

                <label className="flex items-start gap-3 text-sm text-slate-600 dark:text-white/60">
                  <input type="checkbox" checked={gdpr} onChange={(event) => setGdpr(event.target.checked)} className="mt-1" />
                  <span>
                    Ich stimme der Verarbeitung meiner Daten gemäß der{" "}
                    <Link href="/datenschutz" className="font-semibold text-emerald-700 transition hover:text-emerald-600">
                      Datenschutzerklärung
                    </Link>{" "}
                    zu.
                  </span>
                </label>

                <button type="submit" disabled={loading || !gdpr} className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
                  {loading ? "Wird gesendet..." : "Nachricht senden"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
