import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { ArrowRight, Check, Clock3, Home, Leaf, Sparkles, WandSparkles } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { buildFaqSchema } from "@/lib/seo";

const benefits = [
  {
    icon: Sparkles,
    title: "Gründlich im Detail",
    desc: "Bäder, Küchen, Oberflächen und Böden werden sauber strukturiert und sichtbar ordentlich bearbeitet.",
  },
  {
    icon: Leaf,
    title: "Schonend & modern",
    desc: "Professionelle Reinigungsmittel und ein ruhiger Ablauf für Wohnungen, Apartments und Übergabeobjekte.",
  },
  {
    icon: Clock3,
    title: "Flexibel buchbar",
    desc: "Einmalige Einsätze oder wiederkehrende Reinigung mit klaren Zeitfenstern und transparenter Kommunikation.",
  },
];

const features = [
  "Küche inklusive Arbeitsflächen und Fronten",
  "Badezimmer mit Armaturen, Fliesen und Spiegeln",
  "Staubwischen aller erreichbaren Flächen",
  "Staubsaugen und Wischen der Böden",
  "Innenreinigung stark genutzter Bereiche",
  "Fenster innen auf Wunsch",
  "Zusatzwünsche direkt in der Anfrage",
  "Geeignet für Wohnungen, Apartments und Häuser",
];

const faqs = [
  {
    q: "Wie oft kann ich eine Wohnungsreinigung buchen?",
    a: "Einmalig, wöchentlich, zweiwöchentlich oder in individuell abgestimmten Intervallen. Die Planung wird passend zu Ihrem Alltag aufgebaut.",
  },
  {
    q: "Bringen Sie Material mit?",
    a: "Ja. Wir arbeiten mit professionellem Equipment und abgestimmten Reinigungsmitteln, sofern nichts anderes mit Ihnen vereinbart wird.",
  },
  {
    q: "Wie wird der Preis kalkuliert?",
    a: "Die Wohnungsreinigung startet ab 34 €/Std. Der Richtwert richtet sich nach Flächengröße, Zustand und gewünschten Zusatzleistungen.",
  },
  {
    q: "Sind auch kurzfristige Termine möglich?",
    a: "Ja. Je nach Auslastung sind auch kurzfristige Einsätze in Berlin und Brandenburg möglich.",
  },
];

export default function WohnungsreinigungPage() {
  return (
    <>
      <Script id="wohnungsreinigung-faq-schema" type="application/ld+json">
        {JSON.stringify(buildFaqSchema(faqs.map((item) => ({ question: item.q, answer: item.a }))))}
      </Script>

      <section className="hero-led-section relative overflow-hidden px-4 pb-10 pt-28 md:px-8 md:pt-32">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#08111d_0%,#0f2136_48%,#0d3a42_100%)]" />
        <Image
          src="/images/cleaning-team-office.png"
          alt="SEEL Wohnungsreinigung in Berlin mit professionellem Team"
          fill
          className="object-cover opacity-22"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_20%,rgba(0,229,186,0.18),transparent_26%),linear-gradient(180deg,rgba(2,8,18,0.12)_0%,rgba(2,8,18,0.62)_100%)]" />
        <div className="hero-copy-flow relative z-10 mx-auto max-w-5xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] border border-white/12 bg-white/10 backdrop-blur-xl">
            <Home className="text-brand-teal-light" size={38} />
          </div>
          <p className="section-eyebrow mx-auto text-cyan-200/90">Wohnungsreinigung Berlin</p>
          <h1 className="hero-title-strong mx-auto max-w-4xl font-display text-4xl font-bold text-white md:text-6xl">
            Sauberkeit, die ruhig, modern und hochwertig wirkt.
          </h1>
          <p className="hero-body mx-auto max-w-3xl text-white/80">
            Für private Wohnungen, Apartments und Häuser in Berlin und Brandenburg mit klarer Terminstruktur, sichtbarer Qualität und einem Auftritt, der nicht nach Standardreinigung aussieht.
          </p>
          <div className="hero-metrics justify-center">
            <span className="hero-metric">Ab 34 €/Std.</span>
            <span className="hero-metric">Einmalig oder regelmäßig</span>
            <span className="hero-metric">Berlin & Umland</span>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/buchen?service=HOME_CLEANING" className="btn-primary-glass gap-2 px-8 py-4">
              Reinigung buchen <ArrowRight size={18} />
            </Link>
            <Link href="/kontakt?subject=Wohnungsreinigung%20Berlin" className="btn-secondary-glass px-8 py-4">
              Rückruf anfordern
            </Link>
          </div>
        </div>
      </section>

      <section className="section-spotlight section-padding">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="premium-panel-dark overflow-hidden p-0">
              <div className="relative h-full min-h-[320px]">
                <Image
                  src="/images/cleaning-team-staircase.png"
                  alt="Reinigungsteam von SEEL in einer Berliner Wohnanlage"
                  fill
                  className="image-cinematic object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,8,18,0.08)_0%,rgba(2,8,18,0.76)_100%)]" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-brand-gold">Wohnräume mit Ruhe</p>
                  <p className="mt-3 max-w-md text-2xl font-semibold text-white">
                    Klare Flächen und ein Erscheinungsbild, das sofort gepflegt wirkt.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-strong p-6 sm:p-7">
              <p className="section-eyebrow">Ihre Vorteile</p>
              <h2 className="section-title mt-4 text-3xl">Wohnungsreinigung mit Struktur statt Zufall.</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {benefits.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="glass-card p-5">
                      <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-brand-gold/14 text-brand-gold">
                        <Icon size={19} />
                      </div>
                      <p className="mt-4 text-base font-semibold text-text-primary dark:text-text-on-dark">{item.title}</p>
                      <p className="mt-2 text-sm leading-7 text-text-body dark:text-text-on-dark-muted">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-spotlight section-padding">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal>
            <h2 className="section-title mb-8 text-center text-2xl md:text-3xl">Typischer Leistungsumfang</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {features.map((feature) => (
                <div key={feature} className="glass-card flex items-start gap-3 p-4">
                  <Check size={18} className="mt-0.5 shrink-0 text-brand-teal" />
                  <span className="text-sm text-text-primary dark:text-text-on-dark">{feature}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-spotlight section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <ScrollReveal>
            <div className="glass-strong p-6 sm:p-8">
              <h2 className="section-title text-2xl">Flexible Preislogik für private Objekte</h2>
              <p className="mt-4 text-text-body dark:text-text-on-dark-muted">
                Die Wohnungsreinigung startet ab 34 €/Std. Dauer, Flächengröße und gewünschte Extras werden vorab sichtbar eingeordnet, damit Ihr Richtwert auch mobil schnell erfassbar bleibt.
              </p>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { icon: WandSparkles, label: "Abgestimmte Tiefenreinigung" },
                  { icon: Clock3, label: "Feste Zeitfenster" },
                  { icon: Leaf, label: "Schonender Ablauf" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="glass-card p-4 text-center">
                      <Icon className="mx-auto mb-2 text-brand-gold" size={22} />
                      <span className="text-sm font-medium text-text-primary dark:text-text-on-dark">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-spotlight section-padding">
        <div className="mx-auto max-w-3xl">
          <h2 className="section-title mb-8 text-center text-2xl">Häufige Fragen</h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details key={faq.q} className="glass-card group">
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-medium text-text-primary dark:text-text-on-dark">
                  {faq.q}
                  <span className="text-lg text-brand-teal transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-5 pb-4 text-sm leading-7 text-text-body dark:text-text-on-dark-muted">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spotlight pb-24">
        <div className="mx-auto max-w-4xl text-center">
          <ScrollReveal>
            <div className="premium-panel-dark px-8 py-10 sm:px-10 sm:py-12">
              <p className="section-eyebrow text-cyan-200/80">Jetzt anfragen</p>
              <h2 className="mt-4 text-3xl font-bold text-white">Für Wohnungen, die sichtbar gepflegt übergeben werden sollen.</h2>
              <p className="mx-auto mt-4 max-w-2xl text-white/72">
                Fragen Sie Ihre Reinigung direkt online an und erhalten Sie eine moderne, ruhige und klar strukturierte Anfrageführung.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Link href="/buchen?service=HOME_CLEANING" className="btn-primary-glass gap-2 px-10 py-4">
                  Jetzt Angebot anfordern <ArrowRight size={20} />
                </Link>
                <Link href="/kontakt" className="btn-secondary-glass px-10 py-4">
                  Kontakt aufnehmen
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
