"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useParams } from "next/navigation";

type OfferItem = { id: string; title: string; description: string | null; quantity: number; unitPrice: number; totalPrice: number };
type ContractData = {
  id: string; contractNumber: string; offerNumber: string; offerToken: string;
  title: string; description: string | null; category: string; status: string; termsVersion: string;
  pricing: { netto: number; mwst: number; total: number };
  offerItems: OfferItem[];
  customer: { name: string; email: string; company: string | null };
};
type AlreadySignedData = { alreadySigned: true; signedAt: string; signedByName: string };
type FetchResult = ContractData | AlreadySignedData;
function isAlreadySigned(data: FetchResult): data is AlreadySignedData { return "alreadySigned" in data && data.alreadySigned === true; }

const fmt = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });

export default function VertragPage() {
  const { token } = useParams<{ token: string }>();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const hasDrawn = useRef(false);
  const [contract, setContract] = useState<ContractData | null>(null);
  const [alreadySigned, setAlreadySigned] = useState<AlreadySignedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);
  const [signError, setSignError] = useState("");

  useEffect(() => {
    if (!token) return;
    fetch(`/api/vertrag/${token}`)
      .then(async (res) => { if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Vertrag nicht gefunden"); } return res.json(); })
      .then((data: FetchResult) => { if (isAlreadySigned(data)) setAlreadySigned(data); else setContract(data); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0f2550";
    hasDrawn.current = false;
  }, []);

  const today = useMemo(() => new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }), []);

  const getCanvasCoords = useCallback((clientX: number, clientY: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: (clientX - rect.left) * (canvasRef.current.width / rect.width), y: (clientY - rect.top) * (canvasRef.current.height / rect.height) };
  }, []);

  function startDraw(cx: number, cy: number) { if (!canvasRef.current) return; drawing.current = true; const { x, y } = getCanvasCoords(cx, cy); const ctx = canvasRef.current.getContext("2d"); ctx?.beginPath(); ctx?.moveTo(x, y); }
  function moveDraw(cx: number, cy: number) { if (!drawing.current || !canvasRef.current) return; const { x, y } = getCanvasCoords(cx, cy); const ctx = canvasRef.current.getContext("2d"); ctx?.lineTo(x, y); ctx?.stroke(); hasDrawn.current = true; }
  function endDraw() { drawing.current = false; }
  function clearCanvas() { if (!canvasRef.current) return; const ctx = canvasRef.current.getContext("2d"); if (!ctx) return; ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height); hasDrawn.current = false; }

  const canSign = agreed && name.trim().length > 0;

  async function handleSign() {
    if (!canSign) return;
    if (!hasDrawn.current) { setSignError("Bitte zeichnen Sie Ihre Unterschrift im Feld unten."); return; }
    setSigning(true); setSignError("");
    try {
      const signatureDataUrl = canvasRef.current ? canvasRef.current.toDataURL("image/png") : null;
      const res = await fetch(`/api/vertrag/${token}/sign`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), agreed: true, signatureType: "DRAWN", signatureDataUrl }),
      });
      const data = await res.json();
      if (!res.ok) { setSignError(data.error || "Fehler beim Unterschreiben"); return; }
      setSigned(true);
    } catch { setSignError("Verbindungsfehler. Bitte versuchen Sie es erneut."); }
    finally { setSigning(false); }
  }

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 border-4 border-[#0d9ea0] border-t-transparent rounded-full mx-auto" />
        <p className="mt-4 text-slate-500 text-sm">Vertrag wird geladen...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-10 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Fehler</h2>
        <p className="text-slate-500">{error}</p>
      </div>
    </div>
  );

  if (alreadySigned) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-10 text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Bereits unterschrieben</h2>
        <p className="text-slate-500">Dieser Vertrag wurde am <strong>{new Date(alreadySigned.signedAt).toLocaleDateString("de-DE")}</strong> von <strong>{alreadySigned.signedByName}</strong> unterschrieben.</p>
      </div>
    </div>
  );

  if (signed) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-10 text-center">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-3">Vielen Dank!</h2>
        <p className="text-slate-500 text-lg mb-8">Ihr Vertrag wurde erfolgreich unterschrieben. Sie erhalten die Unterlagen per E-Mail.</p>
        {contract?.offerToken && (
          <a href={`/api/angebot/${contract.offerToken}/pdf`} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 bg-[#0d9ea0] text-white rounded-xl font-semibold hover:bg-[#0b8b8d] transition-all shadow-lg">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Angebot als PDF herunterladen
          </a>
        )}
      </div>
    </div>
  );

  if (!contract) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-6 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Contract Document */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* Header - Company Branding */}
          <div className="bg-[#0f2550] px-8 py-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0d9ea0]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#0d9ea0]/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#0d9ea0] rounded-xl flex items-center justify-center text-white font-bold text-lg">S</div>
                <div>
                  <h1 className="text-white font-bold text-lg">SEEL Transport & Reinigung</h1>
                  <p className="text-slate-400 text-xs">Berlin, Deutschland</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4 border border-white/20">
                <p className="text-[#0d9ea0] text-xs font-bold uppercase tracking-widest mb-1">Dienstleistungsvertrag</p>
                <h2 className="text-white text-xl font-bold">{contract.title}</h2>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-300">
                  <span>Vertrag: <strong className="text-white">{contract.contractNumber}</strong></span>
                  <span>Angebot: <strong className="text-white">{contract.offerNumber}</strong></span>
                  <span>Datum: <strong className="text-white">{today}</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Parties */}
          <div className="px-8 py-6 border-b border-slate-100">
            <h3 className="text-xs font-bold text-[#0d9ea0] uppercase tracking-widest mb-4">Vertragsparteien</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Auftragnehmer</p>
                <p className="font-bold text-slate-800">SEEL Transport & Reinigung</p>
                <p className="text-sm text-slate-500">Berlin, Deutschland</p>
                <p className="text-sm text-slate-500">info@seeltransport.de</p>
                <p className="text-sm text-slate-500">+49 172 8003410</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Auftraggeber</p>
                <p className="font-bold text-slate-800">{contract.customer.name}</p>
                {contract.customer.company && <p className="text-sm text-slate-500">{contract.customer.company}</p>}
                <p className="text-sm text-slate-500">{contract.customer.email}</p>
              </div>
            </div>
          </div>

          {/* Service Scope */}
          <div className="px-8 py-6 border-b border-slate-100">
            <h3 className="text-xs font-bold text-[#0d9ea0] uppercase tracking-widest mb-4">Leistungsumfang</h3>
            {contract.description && <p className="text-sm text-slate-600 mb-4">{contract.description}</p>}
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#0f2550] text-white">
                    <th className="text-left px-4 py-3 text-xs font-semibold">Position</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold">Menge</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold">Einzelpreis</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold">Gesamt</th>
                  </tr>
                </thead>
                <tbody>
                  {contract.offerItems.map((item, i) => (
                    <tr key={item.id} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-800">{item.title}</p>
                        {item.description && <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600">{item.quantity}</td>
                      <td className="px-4 py-3 text-right text-slate-600">{fmt.format(item.unitPrice)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-800">{fmt.format(item.totalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pricing Summary */}
            <div className="mt-4 ml-auto max-w-xs">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-500"><span>Netto</span><span>{fmt.format(contract.pricing.netto)}</span></div>
                <div className="flex justify-between text-slate-500"><span>MwSt. (19%)</span><span>{fmt.format(contract.pricing.mwst)}</span></div>
                <div className="flex justify-between pt-3 border-t border-slate-200 text-lg font-bold text-slate-800">
                  <span>Gesamt</span><span className="text-[#0d9ea0]">{fmt.format(contract.pricing.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="px-8 py-6 border-b border-slate-100">
            <h3 className="text-xs font-bold text-[#0d9ea0] uppercase tracking-widest mb-3">Vertragsbedingungen</h3>
            <div className="bg-slate-50 rounded-xl p-5 text-sm text-slate-600 leading-relaxed space-y-3">
              <p><strong>§1 Vertragsgegenstand:</strong> Der Auftragnehmer erbringt die im Leistungsumfang beschriebenen Dienstleistungen gemäß den vereinbarten Konditionen.</p>
              <p><strong>§2 Vergütung:</strong> Die Vergütung beträgt {fmt.format(contract.pricing.total)} (brutto inkl. 19% MwSt.). Die Zahlung erfolgt gemäß den vereinbarten Zahlungsbedingungen.</p>
              <p><strong>§3 AGB:</strong> Mit der Unterzeichnung akzeptiert der Auftraggeber die Allgemeinen Geschäftsbedingungen (AGB Version {contract.termsVersion}) der SEEL Transport & Reinigung.</p>
              <p><strong>§4 Stornierung:</strong> Stornierung bis 7 Tage vor Termin: 20% Gebühr. 3–6 Tage: 40%. 24–48 Stunden: 60%. Unter 24 Stunden: 80%.</p>
              <p><strong>§5 Haftung:</strong> Es gelten die gesetzlichen Haftungsregelungen. Der Auftragnehmer haftet für Schäden im Rahmen der gesetzlichen Bestimmungen.</p>
              <p><strong>§6 Schlussbestimmungen:</strong> Es gilt deutsches Recht. Änderungen bedürfen der Schriftform. Gerichtsstand ist Berlin.</p>
            </div>

            <label className="flex items-start gap-3 mt-5 cursor-pointer group">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-5 w-5 rounded-lg border-2 border-slate-300 text-[#0d9ea0] focus:ring-[#0d9ea0] cursor-pointer" />
              <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">
                Ich habe die Vertragsbedingungen und die <a href="/agb" target="_blank" className="text-[#0d9ea0] underline font-medium">AGB</a> gelesen und akzeptiere diese.
              </span>
            </label>
          </div>

          {/* Signature Section */}
          <div className="px-8 py-8">
            <h3 className="text-xs font-bold text-[#0d9ea0] uppercase tracking-widest mb-5">Digitale Unterschrift</h3>

            {/* Name Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Vollständiger Name des Unterzeichners</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Vor- und Nachname"
                className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 bg-white text-slate-800 text-lg placeholder:text-slate-300 focus:border-[#0d9ea0] focus:ring-4 focus:ring-[#0d9ea0]/10 outline-none transition-all" />
            </div>

            {/* Signature Canvas */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Unterschrift zeichnen</label>
              <div className="relative rounded-2xl border-2 border-dashed border-slate-300 bg-white p-1 hover:border-[#0d9ea0] transition-colors">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={250}
                  className="w-full rounded-xl cursor-crosshair touch-none"
                  style={{ aspectRatio: "800/250" }}
                  onMouseDown={(e) => startDraw(e.clientX, e.clientY)}
                  onMouseMove={(e) => moveDraw(e.clientX, e.clientY)}
                  onMouseUp={endDraw}
                  onMouseLeave={endDraw}
                  onTouchStart={(e) => { e.preventDefault(); startDraw(e.touches[0].clientX, e.touches[0].clientY); }}
                  onTouchMove={(e) => { e.preventDefault(); moveDraw(e.touches[0].clientX, e.touches[0].clientY); }}
                  onTouchEnd={(e) => { e.preventDefault(); endDraw(); }}
                />
                <div className="absolute bottom-4 left-5 right-5 border-b border-slate-200 pointer-events-none" />
                <p className="absolute bottom-6 left-5 text-[10px] text-slate-300 pointer-events-none">✕ Hier unterschreiben</p>
              </div>
              <div className="flex justify-between items-center mt-2">
                <button type="button" onClick={clearCanvas} className="text-sm text-slate-500 hover:text-red-500 font-medium transition-colors">
                  Unterschrift löschen
                </button>
                <span className="text-sm text-slate-400">Datum: {today}</span>
              </div>
            </div>

            {/* Error */}
            {signError && (
              <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                {signError}
              </div>
            )}

            {/* Sign Button */}
            <button onClick={handleSign} disabled={!canSign || signing}
              className="w-full py-5 rounded-2xl font-bold text-lg text-white bg-[#0d9ea0] hover:bg-[#0b8b8d] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xl shadow-[#0d9ea0]/25 flex items-center justify-center gap-3">
              {signing ? (
                <><div className="animate-spin h-5 w-5 border-3 border-white border-t-transparent rounded-full" /> Wird unterschrieben...</>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  Vertrag rechtsverbindlich unterschreiben
                </>
              )}
            </button>

            <p className="text-center text-xs text-slate-400 mt-3">
              Mit der Unterschrift bestätigen Sie die Richtigkeit Ihrer Angaben und akzeptieren die Vertragsbedingungen.
            </p>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-8 py-5 border-t border-slate-100">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <span>© {new Date().getFullYear()} SEEL Transport & Reinigung · Berlin</span>
              <div className="flex items-center gap-4">
                <span>info@seeltransport.de</span>
                <span>+49 172 8003410</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
