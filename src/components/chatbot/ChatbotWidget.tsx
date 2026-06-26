"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { ChatMessage, LeadData, BotAction } from "@/lib/chatbot/types";
import { escapeHtml, CONTACT_INFO, PRICES } from "@/lib/chatbot/knowledge";

const GREETING_ACTIONS: BotAction[] = [
  { label: "💶 Preise", url: "/preise", variant: "secondary" },
  { label: "📝 Jetzt buchen", url: "/buchen", variant: "primary" },
  { label: "🚀 Expressumzug", url: "__EXPRESS__", variant: "secondary" },
  { label: "🧹 Reinigung", url: "__REINIGUNG__", variant: "secondary" },
  { label: "🗑️ Entrümpelung", url: "__ENTRUEMPELUNG__", variant: "secondary" },
  { label: "📞 Kontakt", url: "__KONTAKT__", variant: "secondary" },
];

const LEAD_FLOW: { field: keyof LeadData; q: string }[] = [
  { field: "name", q: "Wie ist Ihr Name?" },
  { field: "phone", q: "Vielen Dank! Wie lautet Ihre Telefonnummer?" },
  { field: "email", q: "Ihre E-Mail-Adresse? Falls nicht vorhanden, schreiben Sie bitte \u201ekeine\u201c." },
  { field: "service", q: "Welche Leistung benötigen Sie? Zum Beispiel Umzug, Reinigung oder Entrümpelung." },
  { field: "date", q: "Wann soll der Einsatz stattfinden? Bitte nennen Sie Ihr Wunschdatum." },
];

function formatMessage(text: string): string {
  const safe = escapeHtml(text);
  return safe
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br/>");
}

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 4, padding: "2px 0" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="seel-dot"
          style={{ animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </div>
  );
}

function ActionButtons({ actions, onAction }: { actions: BotAction[]; onAction: (value: string) => void }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
      {actions.map((action, i) => {
        const isExternal = action.url.startsWith("http") || action.url.startsWith("/") || action.url.startsWith("mailto:") || action.url.startsWith("tel:");

        if (isExternal && !action.url.startsWith("__")) {
          return (
            <a
              key={i}
              href={action.url}
              target={action.url.startsWith("http") ? "_blank" : undefined}
              rel={action.url.startsWith("http") ? "noopener noreferrer" : undefined}
              className="seel-action-btn"
              data-variant={action.variant}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "7px 14px",
                borderRadius: 10,
                border: "1.5px solid",
                borderColor: action.variant === "primary" ? "#0f3460" : action.variant === "whatsapp" ? "#25d366" : "#e2e8f0",
                background: action.variant === "primary" ? "#0f3460" : action.variant === "whatsapp" ? "#25d366" : "#ffffff",
                color: action.variant === "primary" || action.variant === "whatsapp" ? "#ffffff" : "#0f3460",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "inherit",
                textDecoration: "none",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {action.label}
              {(action.url.startsWith("http") || action.url.startsWith("/")) && !action.url.startsWith("/buchen") && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
                  <path d="M7 17L17 7" /><path d="M7 7h10v10" />
                </svg>
              )}
            </a>
          );
        }

        return (
          <button
            key={i}
            className="seel-action-btn"
            data-variant={action.variant}
            onClick={() => onAction(action.url)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "7px 14px",
              borderRadius: 10,
              border: "1.5px solid",
              borderColor: action.variant === "primary" ? "#0f3460" : action.variant === "whatsapp" ? "#25d366" : "#e2e8f0",
              background: action.variant === "primary" ? "#0f3460" : action.variant === "whatsapp" ? "#25d366" : "#ffffff",
              color: action.variant === "primary" || action.variant === "whatsapp" ? "#ffffff" : "#0f3460",
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "inherit",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {action.label}
          </button>
        );
      })}
    </div>
  );
}

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<ChatMessage[]>([
    {
      id: "init",
      role: "bot",
      time: new Date(),
      text:
        "👋 Hallo! Ich bin der SEEL Assistent.\n\nWie kann ich Ihnen helfen? Wählen Sie eine Option oder schreiben Sie direkt.",
      actions: GREETING_ACTIONS,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [leadStep, setLeadStep] = useState(-1);
  const [leadData, setLeadData] = useState<Partial<LeadData>>({});
  const [unread, setUnread] = useState(0);

  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      window.setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);

  const addBot = useCallback(
    (text: string, actions?: BotAction[], delay = 450) => {
      setLoading(true);

      window.setTimeout(() => {
        setLoading(false);
        setMsgs((previous) => [
          ...previous,
          {
            id: `${Date.now()}-${Math.random()}`,
            role: "bot" as const,
            time: new Date(),
            text,
            actions: actions && actions.length > 0 ? actions : undefined,
          },
        ]);

        if (!open) {
          setUnread((value) => value + 1);
        }
      }, delay);
    },
    [open]
  );

  const sendLead = useCallback(async (data: Partial<LeadData>) => {
    try {
      await fetch("/api/chatbot/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch {
      // فشل الإرسال - الزبون لسه يشوف تأكيد بالواجهة
    }
  }, []);

  const addUserMessage = useCallback((text: string) => {
    setMsgs((previous) => [
      ...previous,
      {
        id: `${Date.now()}-${Math.random()}`,
        role: "user" as const,
        time: new Date(),
        text,
      },
    ]);
  }, []);

  const handleActionClick = useCallback(
    (url: string) => {
      if (url === "__LEAD__") {
        setLeadStep(0);
        setLeadData({});
        addBot(
          "Gerne bereiten wir ein kostenloses Angebot vor.\n\n" + LEAD_FLOW[0].q,
          undefined,
          250
        );
        return;
      }

      if (url === "__EXPRESS__") {
        addUserMessage("Ich brauche einen Expressumzug");
        addBot(
          `⚡ **Expressumzug** – ${PRICES.expressumzug}\n\nFür kurzfristige oder eilige Umzüge. Bitte nennen Sie uns Termin, Abholort und Zielort.`,
          [
            { label: "🚀 Jetzt buchen", url: "/buchen", variant: "primary" },
            { label: "💬 WhatsApp (schnell)", url: CONTACT_INFO.whatsappLink, variant: "whatsapp" },
            { label: "📞 Sofort anrufen", url: CONTACT_INFO.phoneLink, variant: "secondary" },
          ]
        );
        return;
      }

      if (url === "__REINIGUNG__") {
        addUserMessage("Ich brauche eine Reinigung");
        addBot(
          `🧹 **Reinigung & Endreinigung** – ab 34 €/Std.\n\nProfessionelle Reinigung für Wohnungen, Häuser, Büros und Übergaben. Ideal vor Wohnungsabgabe oder nach einem Umzug.`,
          [
            { label: "📋 Reinigung buchen", url: "/buchen", variant: "primary" },
            { label: "🏠 Wohnungsreinigung", url: "/leistungen/wohnungsreinigung", variant: "secondary" },
            { label: "🏢 Büroreinigung", url: "/leistungen/bueroreinigung", variant: "secondary" },
            { label: "💬 WhatsApp", url: CONTACT_INFO.whatsappLink, variant: "whatsapp" },
          ]
        );
        return;
      }

      if (url === "__ENTRUEMPELUNG__") {
        addUserMessage("Entrümpelung anfragen");
        addBot(
          `🗑️ **Entrümpelung & Entsorgung** – ab 59 €/Std.\n\nWir übernehmen Entrümpelungen von Wohnungen, Kellern, Dachböden und Gewerbeflächen inklusive fachgerechter Entsorgung.`,
          [
            { label: "📋 Entrümpelung anfragen", url: "/buchen", variant: "primary" },
            { label: "🏠 Mehr erfahren", url: "/leistungen/entruempelung", variant: "secondary" },
            { label: "💬 WhatsApp", url: CONTACT_INFO.whatsappLink, variant: "whatsapp" },
          ]
        );
        return;
      }

      if (url === "__KONTAKT__") {
        addUserMessage("Ich möchte Sie kontaktieren");
        addBot(
          `📞 **Kontaktdaten – SEEL Transport & Reinigung**\n\nWir sind 24/7 erreichbar:\n\n• 📞 ${CONTACT_INFO.phone}\n• 📞 ${CONTACT_INFO.phone2}\n• ✉️ ${CONTACT_INFO.email}`,
          [
            { label: "💬 WhatsApp", url: CONTACT_INFO.whatsappLink, variant: "whatsapp" },
            { label: "📞 Anrufen", url: CONTACT_INFO.phoneLink, variant: "secondary" },
            { label: "✉️ E-Mail", url: CONTACT_INFO.emailLink, variant: "secondary" },
            { label: "📋 Kontaktseite", url: "/kontakt", variant: "secondary" },
          ]
        );
        return;
      }
    },
    [addBot, addUserMessage]
  );

  const handleSend = useCallback(
    async (raw?: string) => {
      const text = (raw ?? input).trim();

      if (!text || loading) {
        return;
      }

      setInput("");

      if (text === "__LEAD__") {
        handleActionClick(text);
        return;
      }

      addUserMessage(text);

      if (/rückruf|rueckruf|zurückgerufen|anrufen|telefon/i.test(text)) {
        addBot(
          `📞 **Rückruf anfordern**\n\nGerne melden wir uns persönlich bei Ihnen!\n\n• 📞 ${CONTACT_INFO.phone} – 24/7\n• 📞 ${CONTACT_INFO.phone2}\n• ✉️ ${CONTACT_INFO.email}`,
          [
            { label: "📞 Jetzt anrufen", url: CONTACT_INFO.phoneLink, variant: "primary" },
            { label: "💬 WhatsApp", url: CONTACT_INFO.whatsappLink, variant: "whatsapp" },
            { label: "✉️ E-Mail", url: CONTACT_INFO.emailLink, variant: "secondary" },
          ]
        );
        return;
      }

      if (leadStep >= 0) {
        const field = LEAD_FLOW[leadStep].field;
        const newData = { ...leadData, [field]: text };
        const nextStep = leadStep + 1;

        setLeadData(newData);

        if (nextStep < LEAD_FLOW.length) {
          setLeadStep(nextStep);
          addBot(LEAD_FLOW[nextStep].q);
        } else {
          setLeadStep(-1);
          await sendLead(newData);

          addBot(
            `✅ **Vielen Dank${newData.name ? `, ${newData.name}` : ""}!**\n\nIhre Anfrage wurde aufgenommen. Wir melden uns schnellstmöglich persönlich bei Ihnen.\n\nTeam SEEL 🚛`,
            [
              { label: "💬 WhatsApp", url: CONTACT_INFO.whatsappLink, variant: "whatsapp" },
              { label: "📞 Anrufen", url: CONTACT_INFO.phoneLink, variant: "secondary" },
              { label: "✉️ E-Mail", url: CONTACT_INFO.emailLink, variant: "secondary" },
            ]
          );
        }

        return;
      }

      try {
        const response = await fetch("/api/chatbot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text }),
        });

        const data = await response.json();

        addBot(
          data.answer ?? "Danke für Ihre Anfrage.",
          data.actions as BotAction[] | undefined
        );
      } catch {
        addBot(
          "Entschuldigung, es gab einen kurzen Fehler. Bitte versuchen Sie es erneut."
        );
      }
    },
    [
      input,
      loading,
      leadStep,
      leadData,
      addBot,
      addUserMessage,
      sendLead,
      handleActionClick,
    ]
  );

  const isLeadMode = leadStep >= 0;
  const showQuick = !isLeadMode && msgs.length <= 2;

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <>
      <style>{`
        .seel-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: #94a3b8;
          animation: seelBounce 1.2s ease infinite;
        }

        @keyframes seelBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }

        @keyframes seelSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .seel-window {
          animation: seelSlideUp 0.22s ease;
        }

        .seel-scroll::-webkit-scrollbar {
          width: 3px;
        }

        .seel-scroll::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 4px;
        }

        .seel-quick-action:hover {
          background: #0f3460 !important;
          color: #ffffff !important;
          border-color: #0f3460 !important;
        }

        .seel-action-btn:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }

        .seel-action-btn:active {
          transform: translateY(0);
        }

        @media (max-width: 768px) {
          .seel-chat-window {
            right: 8px !important;
            bottom: 8px !important;
            width: calc(100vw - 16px) !important;
            height: min(580px, calc(100vh - 64px)) !important;
            max-height: calc(100vh - 64px) !important;
            border-radius: 18px !important;
          }

          .seel-chat-bubble {
            right: 14px !important;
            bottom: 14px !important;
            width: 54px !important;
            height: 54px !important;
          }
        }

        @media (max-width: 480px) {
          .seel-chat-window {
            right: 6px !important;
            bottom: 6px !important;
            width: calc(100vw - 12px) !important;
            height: min(560px, calc(100vh - 48px)) !important;
            max-height: calc(100vh - 48px) !important;
            border-radius: 14px !important;
          }

          .seel-chat-bubble {
            right: 12px !important;
            bottom: 12px !important;
            width: 52px !important;
            height: 52px !important;
          }
        }

        @media (max-width: 480px) and (orientation: landscape) {
          .seel-chat-window {
            height: min(480px, calc(100vh - 24px)) !important;
            max-height: calc(100vh - 24px) !important;
          }
        }
      `}</style>

      {!open && (
        <button
          className="seel-chat-bubble"
          onClick={() => setOpen(true)}
          aria-label="Chat öffnen"
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 55,
            width: 60,
            height: 60,
            borderRadius: "999px",
            background: "linear-gradient(135deg, #0f3460 0%, #1a6b8a 100%)",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 8px 32px rgba(15,52,96,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>

          {unread > 0 && (
            <span
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                background: "#e74c3c",
                color: "#ffffff",
                borderRadius: "999px",
                width: 20,
                height: 20,
                fontSize: 11,
                fontWeight: 700,
                border: "2px solid #ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {unread}
            </span>
          )}
        </button>
      )}

      {open && (
        <div
          className="seel-window seel-chat-window"
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 55,
            width: 380,
            maxWidth: "calc(100vw - 32px)",
            height: 600,
            maxHeight: "calc(100vh - 96px)",
            borderRadius: 22,
            boxShadow:
              "0 32px 80px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            background: "#f8fafc",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background:
                "linear-gradient(135deg, #0f3460 0%, #1a6b8a 100%)",
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: "999px",
                background: "rgba(255,255,255,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              🚛
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ color: "#ffffff", fontWeight: 700, fontSize: 15 }}>
                SEEL Assistent
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.72)",
                  fontSize: 11.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "999px",
                    background: "#2ecc71",
                    display: "inline-block",
                  }}
                />
                Online – antwortet sofort
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              aria-label="Chat schließen"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "rgba(255,255,255,0.72)",
                padding: 4,
                lineHeight: 0,
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div
            className="seel-scroll"
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "14px 14px 6px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {msgs.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  flexDirection: msg.role === "user" ? "row-reverse" : "column",
                  alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                  gap: 7,
                }}
              >
                {msg.role === "bot" && (
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 7, width: "100%" }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "999px",
                        background: "linear-gradient(135deg,#0f3460,#1a6b8a)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                        flexShrink: 0,
                      }}
                    >
                      🚛
                    </div>
                    <div style={{ maxWidth: "calc(100% - 40px)", minWidth: 0 }}>
                      <div
                        style={{
                          padding: "10px 14px",
                          borderRadius: "4px 18px 18px 18px",
                          background: "#ffffff",
                          color: "#1e293b",
                          fontSize: 13.5,
                          lineHeight: 1.56,
                          boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                          wordBreak: "break-word",
                        }}
                        dangerouslySetInnerHTML={{
                          __html: formatMessage(msg.text),
                        }}
                      />
                      {msg.actions && msg.actions.length > 0 && (
                        <ActionButtons actions={msg.actions} onAction={handleActionClick} />
                      )}
                      <div
                        style={{
                          fontSize: 10,
                          color: "#b0bec5",
                          marginTop: 3,
                        }}
                      >
                        {formatTime(msg.time)}
                      </div>
                    </div>
                  </div>
                )}

                {msg.role === "user" && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                    <div
                      style={{
                        maxWidth: "80%",
                        padding: "10px 14px",
                        borderRadius: "18px 18px 4px 18px",
                        background: "linear-gradient(135deg,#0f3460,#1a6b8a)",
                        color: "#ffffff",
                        fontSize: 13.5,
                        lineHeight: 1.56,
                        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                        wordBreak: "break-word",
                      }}
                    >
                      {msg.text}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#b0bec5",
                        marginTop: 3,
                      }}
                    >
                      {formatTime(msg.time)}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "999px",
                    background: "linear-gradient(135deg,#0f3460,#1a6b8a)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  🚛
                </div>

                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: "4px 18px 18px 18px",
                    background: "#ffffff",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                  }}
                >
                  <TypingDots />
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>

          {showQuick && (
            <div
              style={{
                padding: "4px 12px 8px",
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                flexShrink: 0,
              }}
            >
              {GREETING_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  className="seel-quick-action"
                  onClick={() => handleActionClick(action.url)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 20,
                    border: "1.5px solid #e2e8f0",
                    background: "#ffffff",
                    cursor: "pointer",
                    fontSize: 12,
                    color: "#0f3460",
                    fontWeight: 600,
                    transition: "all 0.15s",
                    whiteSpace: "nowrap",
                    fontFamily: "inherit",
                  }}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          <div
            style={{
              padding: "10px 12px 14px",
              borderTop: "1px solid #e8edf2",
              background: "#ffffff",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                background: "#f1f5f9",
                borderRadius: 26,
                padding: "5px 5px 5px 16px",
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) {
                    handleSend();
                  }
                }}
                placeholder={isLeadMode ? "Antwort eingeben..." : "Schreiben Sie uns..."}
                aria-label="Nachricht eingeben"
                style={{
                  flex: 1,
                  border: "none",
                  background: "none",
                  fontSize: 13.5,
                  color: "#1e293b",
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />

              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                aria-label="Senden"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "999px",
                  background:
                    input.trim() && !loading
                      ? "linear-gradient(135deg,#0f3460,#1a6b8a)"
                      : "#e8edf2",
                  border: "none",
                  cursor: input.trim() && !loading ? "pointer" : "default",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.2s",
                  flexShrink: 0,
                }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={input.trim() && !loading ? "#ffffff" : "#94a3b8"}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>

            <p
              style={{
                textAlign: "center",
                fontSize: 10,
                color: "#cbd5e1",
                marginTop: 5,
                marginBottom: 0,
              }}
            >
              SEEL Transport &amp; Reinigung · Berlin
            </p>
          </div>
        </div>
      )}
    </>
  );
}
