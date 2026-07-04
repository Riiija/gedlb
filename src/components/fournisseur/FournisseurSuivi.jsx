"use client";
import { useState, useEffect } from "react";
import { useT } from "../../lib/i18n";

const P   = "#324372";
const P2  = "#1e2a4a";
const PL  = "#4a6ab0";
const ACC = "#1ecad3";
const WH  = "#ffffff";
const BG  = "#f0f4fa";
const BD  = "#dde3ef";
const MUT = "#7b87a2";
const TXT = "#1a2342";
const SUC = "#0fa86c";
const ERR = "#e03e3e";

const LS_FOURN_DOCS = "softdocs_fourn_docs";
const LS_ALL_DOCS   = "softdocs_all_docs";
const lsGet = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };

function getAllDocs(){
  // Merge backoffice docs (if exported to LS) + fournisseur portal submissions
  const fourn = lsGet(LS_FOURN_DOCS) || [];
  const all   = lsGet(LS_ALL_DOCS)   || [];
  // Deduplicate by id
  const byId = new Map();
  [...all,...fourn].forEach(d => byId.set(d.id, d));
  return Array.from(byId.values());
}
const fmtN = (v) => v ? new Intl.NumberFormat("fr-MG").format(Number(v)) + " Ar" : "—";

const STEP_COL = {
  "VALIDÉ":     { bg: "#d4edda", fg: "#155724" },
  "REJETÉ":     { bg: "#f8d7da", fg: "#721c24" },
  "EN RETARD":  { bg: "#fff3cd", fg: "#856404" },
  "EN ATTENTE": { bg: "#e9ecef", fg: "#6c757d" },
};
const statusColor = {
  "REÇU":          { bg: "#d1ecf1", fg: "#0c5460" },
  "EN VALIDATION": { bg: "#fff3cd", fg: "#856404" },
  "EN RETARD":     { bg: "#f8d7da", fg: "#721c24" },
  "VALIDÉ":        { bg: "#d4edda", fg: "#155724" },
  "REJETÉ":        { bg: "#f8d7da", fg: "#721c24" },
  "BON À PAYER":   { bg: "#d1ecf1", fg: "#0c5460" },
  "PAYÉ":          { bg: "#d4edda", fg: "#155724" },
};
function DocBadge({ st }) {
  const c = statusColor[st] || { bg: "#e9ecef", fg: "#6c757d" };
  return <span style={{ background: c.bg, color: c.fg, padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 700 }}>{st}</span>;
}

export function FournisseurSuivi({ onBack, lang = "fr" }) {
  const t = useT(lang);
  const [ref, setRef] = useState("");
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [selDoc, setSelDoc] = useState(null);
  const [allDocs, setAllDocs] = useState([]);

  useEffect(() => {
    const docs = getAllDocs();
    setAllDocs(docs);
  }, []);

  function search() {
    setSearched(true);
    const q = ref.trim().toLowerCase();
    if (!q) { setResult(null); return; }
    const docs = getAllDocs();
    const d = docs.find(x =>
      x.id?.toLowerCase() === q ||
      x.ch?.numero?.toLowerCase().includes(q) ||
      (x.fourn || "").toLowerCase().includes(q) ||
      (x._fourn?.nom || "").toLowerCase().includes(q)
    );
    setResult(d || null);
  }

  /* ── Detail view ── */
  if (selDoc) return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "'Plus Jakarta Sans','Inter',system-ui,sans-serif" }}>
      <div style={{ background: `linear-gradient(135deg, ${P2}, ${P})`, height: 56, padding: "0 24px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 4px 16px rgba(0,0,0,.15)" }}>
        <button onClick={() => setSelDoc(null)}
          style={{ background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.2)", color: WH, borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
          ← Retour
        </button>
        <img src="/softdocs-logo-final.png" alt="SoftDocs" style={{ height: 34, filter: "brightness(0) invert(1) drop-shadow(0 1px 4px rgba(255,255,255,.2))" }} />
        <span style={{ color: WH, fontWeight: 700, fontSize: 14, flex: 1 }}>{selDoc.id} — {selDoc.type}</span>
        <DocBadge st={selDoc.st} />
      </div>

      <div style={{ maxWidth: 760, margin: "28px auto", padding: "0 20px" }}>
        <div style={{ background: WH, borderRadius: 12, border: `1px solid ${BD}`, padding: 22, marginBottom: 16, boxShadow: "0 2px 12px rgba(50,67,114,.07)" }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: MUT, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 14 }}>Informations du document</div>
          <div style={{ display: "grid", gridTemplateColumns: typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr", gap: 10 }}>
            {[
              ["Référence", selDoc.id], ["Type", selDoc.type],
              ["Fournisseur", selDoc.fourn || selDoc._fourn?.nom || "—"],
              ["Montant TTC", fmtN(selDoc.mt)],
              ["Date dépôt", selDoc.date], ["Score OCR", `${selDoc.ocr || 0}%`],
              ["Projet", selDoc.proj || "—"], ["Site", selDoc.site || "—"],
            ].map(([k, v]) => (
              <div key={k} style={{ padding: "10px 14px", background: "#f8f9fc", borderRadius: 8 }}>
                <div style={{ fontSize: 10.5, color: MUT, fontWeight: 700, textTransform: "uppercase", marginBottom: 3 }}>{k}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: TXT }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: WH, borderRadius: 12, border: `1px solid ${BD}`, padding: 22, boxShadow: "0 2px 12px rgba(50,67,114,.07)" }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: MUT, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 18 }}>Circuit de validation</div>
          {selDoc.etapes?.map((e, i) => {
            const c = STEP_COL[e.statut] || STEP_COL["EN ATTENTE"];
            return (
              <div key={i} style={{ display: "flex", gap: 14, marginBottom: 14 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: c.bg, color: c.fg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, flexShrink: 0, border: `2px solid ${c.fg}30` }}>
                    {e.statut === "VALIDÉ" ? "✓" : e.statut === "REJETÉ" ? "✗" : i + 1}
                  </div>
                  {i < selDoc.etapes.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 12, background: BD, margin: "4px 0" }} />}
                </div>
                <div style={{ flex: 1, paddingBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: TXT }}>{e.label}</span>
                    <span style={{ background: c.bg, color: c.fg, padding: "2px 10px", borderRadius: 12, fontSize: 11, fontWeight: 700 }}>{e.statut}</span>
                    {e.duree && <span style={{ fontSize: 11, color: MUT }}>⏱ {e.duree}h</span>}
                  </div>
                  {e.date && <div style={{ fontSize: 11.5, color: MUT }}>{t.traiteLe} {e.date}{e.validBy ? ` par ${e.validBy}` : ""}</div>}
                  {e.comment && <div style={{ fontSize: 12.5, color: "#495057", marginTop: 6, background: "#f8f9fc", padding: "8px 12px", borderRadius: 6 }}>{e.comment}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  /* ── Main search page ── */
  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg, ${P2}, ${P}, ${PL})`, fontFamily: "'Plus Jakarta Sans','Inter',system-ui,sans-serif", display: "flex", flexDirection: "column" }}>
      {/* Grid dots bg */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: `radial-gradient(rgba(255,255,255,.1) 1px, transparent 1px)`, backgroundSize: "36px 36px", pointerEvents: "none" }} />

      {/* Header */}
      <header style={{ padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,.1)", flexShrink: 0, position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={onBack}
            style={{ background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)", color: WH, borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontFamily: "inherit", fontSize: 12.5, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
            {t.retourAccueil}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: WH, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src="/softdocs-logo-final.png" alt="SoftDocs" style={{ width: 34, objectFit: "contain", filter: "brightness(0) invert(1)" }} />
            </div>
            <div>
              <div style={{ color: WH, fontWeight: 800, fontSize: 14.5 }}>SoftDocs</div>
              <div style={{ color: "rgba(255,255,255,.55)", fontSize: 10 }}>Suivi de document</div>
            </div>
          </div>
        </div>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 20, background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)", fontSize: 12, color: "rgba(255,255,255,.8)" }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: ACC, animation: "fourn-pulse 2s ease infinite" }} />
          {t.suiviRealTime}
        </span>
      </header>

      {/* Search area */}
      <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "48px 24px 40px", position: "relative", zIndex: 2 }}>
        <div style={{ width: "100%", maxWidth: 680 }}>
          {/* Title */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 20, background: "rgba(30,202,211,.15)", border: "1px solid rgba(30,202,211,.3)", color: ACC, fontSize: 12, fontWeight: 700, marginBottom: 18, letterSpacing: ".05em", textTransform: "uppercase" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              {t.suiviSearch}
            </div>
            <h1 style={{ fontSize: 34, fontWeight: 900, color: WH, letterSpacing: "-.04em", marginBottom: 10 }}>
              Suivez vos <span style={{ background: `linear-gradient(90deg, ${ACC}, #7dd3fc)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>documents</span>
            </h1>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,.65)", maxWidth: 480, margin: "0 auto", lineHeight: 1.6 }}>
              Entrez le numéro de référence, le nom du fournisseur ou le numéro de facture pour consulter l'état de traitement de votre dossier.
            </p>
          </div>

          {/* Search box */}
          <div style={{ background: "rgba(255,255,255,.95)", borderRadius: 16, padding: 6, display: "flex", gap: 6, boxShadow: "0 24px 60px rgba(0,0,0,.2)", marginBottom: 24 }}>
            <input
              value={ref}
              onChange={e => setRef(e.target.value)}
              onKeyDown={e => e.key === "Enter" && search()}
              placeholder="{t.suiviPlaceholder}"
              style={{ flex: 1, border: "none", outline: "none", padding: "14px 18px", fontSize: 14.5, background: "transparent", color: TXT, fontFamily: "inherit" }}
            />
            <button onClick={search}
              style={{ background: P, color: WH, border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              Rechercher
            </button>
          </div>

          {/* Result */}
          {searched && !result && (
            <div style={{ background: "rgba(255,255,255,.1)", borderRadius: 14, padding: "28px 24px", textAlign: "center", border: "1px solid rgba(255,255,255,.15)" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
              <div style={{ color: WH, fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{t.suiviNotFound}</div>
              <p style={{ color: "rgba(255,255,255,.6)", fontSize: 13, maxWidth: 360, margin: "0 auto" }}>
                {t.suiviNotFoundDesc}
              </p>
            </div>
          )}

          {result && (
            <div onClick={() => setSelDoc(result)}
              style={{ background: WH, borderRadius: 14, padding: "20px 24px", cursor: "pointer", boxShadow: "0 12px 40px rgba(0,0,0,.15)", transition: "transform .15s", animation: "fourn-up .3s ease" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "none"}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: "#eef1f8", display: "flex", alignItems: "center", justifyContent: "center", color: P, fontWeight: 900, fontSize: 18, flexShrink: 0 }}>
                  {result.type?.charAt(0) || "D"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: TXT }}>{result.id}</span>
                    <DocBadge st={result.st} />
                  </div>
                  <div style={{ fontSize: 13, color: MUT }}>{result.type} · {result.fourn || result._fourn?.nom || "—"} · {result.date}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#2d6a4f", marginBottom: 4 }}>{fmtN(result.mt)}</div>
                  <div style={{ color: MUT, display: "flex", justifyContent: "flex-end" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${BD}` }}>
                <div style={{ display: "flex", gap: 4 }}>
                  {result.etapes?.map((e, i) => {
                    const c = STEP_COL[e.statut] || STEP_COL["EN ATTENTE"];
                    return (
                      <div key={i} style={{ flex: 1, height: 5, borderRadius: 3, background: c.bg, border: `1px solid ${c.fg}40`, title: e.label }} title={e.label} />
                    );
                  })}
                </div>
                <div style={{ fontSize: 11, color: MUT, marginTop: 6 }}>
                  {result.etapes?.filter(e => e.statut === "VALIDÉ").length || 0} / {result.etapes?.length || 0} {t.suiviEtapesValidees} — {t.suiviCliquer}
                </div>
              </div>
            </div>
          )}

          {/* Recent public docs hint */}
          {!searched && allDocs.length > 0 && (
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "rgba(255,255,255,.5)", fontSize: 12 }}>
                {allDocs.length} document(s) disponible(s) dans le système
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fourn-up { from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none} }
        @keyframes fourn-pulse { 0%,100%{opacity:1}50%{opacity:.3} }
      `}</style>
    </div>
  );
}
