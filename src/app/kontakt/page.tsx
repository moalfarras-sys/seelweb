"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { CONTACT, whatsappDefaultUrl } from "@/config/contact";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type TrackingState = {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  referrer: string;
  landing_page: string;
};

export default function KontaktPage() {
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
      const res = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          website: honeypot,
          ...tracking,
        }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  const inputClasses =
    "w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-navy-800 outline-none transition focus:border-teal-500 dark:border-navy-700 dark:bg-navy-900 dark:text-white";

  return (
    <>
      <section className="gradient-navy py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-4 text-center md:px-8">
          <h1 className="text-4xl font-bold text-white md:text-5xl">Kontakt aufnehmen</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-silver-300">
            Schreiben Sie uns für Umzug, Reinigung, Entrümpelung oder Ihre Festpreisanfrage. Wir melden uns schnell und klar strukturiert zurück.
          </p>
        </div>
      </section>

      <section className="bg-white py-20 dark:bg-navy-950">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            {[
              { icon: Phone, title: "Telefon", value: CONTACT.PRIMARY_PHONE_DISPLAY, href: `tel:${CONTACT.PRIMARY_PHONE}` },
              { icon: Mail, title: "E-Mail", value: CONTACT.EMAIL, href: `mailto:${CONTACT.EMAIL}` },
              { icon: MapPin, title: "Standort", value: `${CONTACT.CITY}, ${CONTACT.COUNTRY}` },
              { icon: MessageCircle, title: "WhatsApp", value: "Direktnachricht starten", href: whatsappDefaultUrl(), external: true },
            ].map((item) => {
              const Icon = item.icon;
              const content = (
                <div className="rounded-[2rem] border border-gray-100 bg-gray-50/80 p-6 dark:border-navy-700/50 dark:bg-navy-800/60">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-300">
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy-800 dark:text-white">{item.title}</p>
                      <p className="mt-1 text-sm text-silver-600 dark:text-silver-300">{item.value}</p>
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
          </div>

          <div className="relative rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-navy-700/50 dark:bg-navy-900 md:p-8">
            {submitted ? (
              <div className="rounded-[2rem] bg-emerald-50 p-8 text-center dark:bg-emerald-500/10">
                <h2 className="text-2xl font-bold text-navy-800 dark:text-white">Nachricht gesendet</h2>
                <p className="mt-3 text-sm leading-7 text-silver-600 dark:text-silver-300">
                  Vielen Dank. Wir melden uns schnellstmöglich bei Ihnen zurück.
                </p>
                <Link href="/" className="mt-5 inline-flex text-sm font-semibold text-teal-600 transition hover:text-teal-500">
                  Zur Startseite
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {clientValidationError && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                    {clientValidationError}
                  </div>
                )}
                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                    Beim Senden ist ein Fehler aufgetreten...
                  </div>
                )}

                <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0" aria-hidden="true">
                  <label htmlFor="kontakt-website">Website</label>
                  <input
                    id="kontakt-website"
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(event) => setHoneypot(event.target.value)}
                  />
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

                <label className="flex items-start gap-3 text-sm text-silver-600 dark:text-silver-300">
                  <input type="checkbox" checked={gdpr} onChange={(event) => setGdpr(event.target.checked)} className="mt-1" />
                  <span>
                    Ich stimme der Verarbeitung meiner Daten gemäß der{" "}
                    <Link href="/datenschutz" className="font-semibold text-teal-600 transition hover:text-teal-500">
                      Datenschutzerklärung
                    </Link>{" "}
                    zu.
                  </span>
                </label>

                <button type="submit" disabled={loading || !gdpr} className="inline-flex items-center justify-center rounded-2xl bg-teal-500 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60">
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
