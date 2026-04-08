"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Clock3, Mail, MapPin, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { useSiteContent } from "@/components/SiteContentProvider";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function whatsappUrl(number: string) {
  return `https://wa.me/${number}`;
}

export default function KontaktPage() {
  const { company, contact } = useSiteContent();
  const search = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [gdpr, setGdpr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const nextSubject = search.get("subject");
    if (nextSubject) setSubject(nextSubject);
  }, [search]);

  async function sendMessage() {
    if (!name.trim() || !EMAIL_REGEX.test(email.trim()) || !subject.trim() || !message.trim() || !gdpr) {
      setError("Bitte füllen Sie alle Pflichtfelder korrekt aus und bestätigen Sie den Datenschutz.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          subject,
          message,
          website: "",
          utm_source: search.get("utm_source") || "",
          utm_medium: search.get("utm_medium") || "",
          utm_campaign: search.get("utm_campaign") || "",
          referrer: typeof document !== "undefined" ? document.referrer : "",
          landing_page: typeof window !== "undefined" ? window.location.pathname : "",
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Nachricht konnte nicht gesendet werden.");
      }

      setSubmitted(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Nachricht konnte nicht gesendet werden.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="px-4 pb-14 pt-10 md:px-8">
      <div className="mx-auto max-w-[1200px]">
        <section className="overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,#081220_0%,#0B1628_48%,#152238_100%)] px-6 py-10 text-white md:px-10">
          <p className="font-ui text-xs uppercase tracking-[0.3em] text-brand-teal-light">Kontakt</p>
          <h1 className="mt-4 font-display text-4xl font-bold md:text-5xl">Direkte Anfrage statt unnötiger Umwege.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/80">
            Schreiben Sie uns für Umzug, Reinigung, Entrümpelung oder Festpreisanfragen. Wir melden uns strukturiert und zeitnah zurück.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`tel:${contact.primaryPhone}`} className="rounded-pill bg-brand-teal px-5 py-3 text-sm font-semibold text-white">
              {contact.primaryPhoneDisplay}
            </a>
            <a href={whatsappUrl(contact.whatsappNumber)} target="_blank" rel="noopener noreferrer" className="rounded-pill border border-white/15 px-5 py-3 text-sm font-semibold text-white">
              WhatsApp direkt
            </a>
          </div>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[380px_minmax(0,1fr)]">
          <div className="space-y-4">
            {[
              { icon: Phone, title: "Telefon", value: contact.primaryPhoneDisplay, href: `tel:${contact.primaryPhone}` },
              { icon: Mail, title: "E-Mail", value: contact.email, href: `mailto:${contact.email}` },
              { icon: MessageCircle, title: "WhatsApp", value: "Direktnachricht starten", href: whatsappUrl(contact.whatsappNumber), external: true },
              { icon: Clock3, title: "Öffnungszeiten", value: "Mo–So 07:00–20:00 · Notfälle 24/7" },
              { icon: MapPin, title: "Adresse", value: `${company.addressLine1}, ${company.addressLine2}, ${company.city}` },
            ].map((item) => {
              const Icon = item.icon;
              const card = (
                <div className="rounded-[24px] border border-border bg-white p-5 shadow-[var(--shadow-card)] dark:border-border-dark dark:bg-surface-dark-card">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-brand-teal/10 text-brand-teal">
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary dark:text-text-on-dark">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-text-body dark:text-text-on-dark-muted">{item.value}</p>
                    </div>
                  </div>
                </div>
              );

              return item.href ? (
                <a key={item.title} href={item.href} target={item.external ? "_blank" : undefined} rel={item.external ? "noopener noreferrer" : undefined}>
                  {card}
                </a>
              ) : (
                <div key={item.title}>{card}</div>
              );
            })}

            <div className="rounded-[24px] border border-border bg-white p-5 shadow-[var(--shadow-card)] dark:border-border-dark dark:bg-surface-dark-card">
              <div className="flex items-start gap-3">
                <ShieldCheck size={18} className="mt-1 text-brand-teal" />
                <div>
                  <p className="text-sm font-semibold text-text-primary dark:text-text-on-dark">Saubere Bearbeitung</p>
                  <p className="mt-2 text-sm leading-7 text-text-body dark:text-text-on-dark-muted">
                    Ihre Anfrage landet direkt bei {company.name}. Wir antworten mit klaren nächsten Schritten statt mit Standardbausteinen.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[30px] border border-border bg-white p-6 shadow-[var(--shadow-card)] dark:border-border-dark dark:bg-surface-dark-card md:p-8">
              {submitted ? (
                <div className="rounded-[24px] bg-brand-teal/8 p-8 text-center">
                  <h2 className="text-2xl font-bold text-text-primary dark:text-text-on-dark">Nachricht gesendet</h2>
                  <p className="mt-3 text-sm leading-7 text-text-body dark:text-text-on-dark-muted">
                    Vielen Dank. Wir melden uns schnellstmöglich bei Ihnen zurück.
                  </p>
                  <Link href="/" className="mt-5 inline-flex text-sm font-semibold text-brand-teal">
                    Zur Startseite
                  </Link>
                </div>
              ) : (
                <>
                  <p className="font-ui text-xs uppercase tracking-[0.28em] text-brand-teal">Kontaktformular</p>
                  <h2 className="mt-3 text-2xl font-bold text-text-primary dark:text-text-on-dark">Anfrage senden</h2>

                  {error ? (
                    <div className="mt-5 rounded-[20px] border border-status-error/20 bg-status-error/10 px-4 py-3 text-sm text-status-error">
                      {error}
                    </div>
                  ) : null}

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ihr Name" className="input-glass" />
                    <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="E-Mail" className="input-glass" />
                    <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Telefon" className="input-glass" />
                    <input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Betreff" className="input-glass" />
                  </div>

                  <textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={7} placeholder="Ihre Nachricht" className="input-glass mt-4 resize-none" />

                  <label className="mt-4 flex items-start gap-3 text-sm text-text-body dark:text-text-on-dark-muted">
                    <input type="checkbox" checked={gdpr} onChange={(event) => setGdpr(event.target.checked)} className="mt-1" />
                    <span>
                      Ich stimme der Verarbeitung meiner Daten gemäß der{" "}
                      <Link href="/datenschutz" className="font-semibold text-brand-teal">
                        Datenschutzerklärung
                      </Link>{" "}
                      zu.
                    </span>
                  </label>

                  <button type="button" onClick={sendMessage} disabled={loading} className="mt-6 rounded-pill bg-brand-teal px-6 py-3 text-sm font-semibold text-white disabled:opacity-50">
                    {loading ? "Wird gesendet..." : "Nachricht senden"}
                  </button>
                </>
              )}
            </div>

            <div className="overflow-hidden rounded-[30px] border border-border bg-white shadow-[var(--shadow-card)] dark:border-border-dark dark:bg-surface-dark-card">
              <iframe
                title="SEEL Transport Berlin Karte"
                src="https://www.google.com/maps?q=Forster%20Stra%C3%9Fe%205%2C%2012627%20Berlin&z=13&output=embed"
                className="h-[340px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
