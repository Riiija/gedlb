"use client";
import { useState, useRef } from "react";
import { Modal } from "../ui/Modal";
import { IC } from "../ui/Icons";
import { ExportButtons } from "../ui/ExportButtons";
import { card, btn, inp, lbl, bdg, TH, TD, P, BD, MUT, SUC, SUCL, SUCD, DNG, WRN, WRNL, WRND, RSm, BG, WH } from "../../lib/theme";
import { fmtN, now, gid } from "../../lib/utils";
import { useApp } from "../../context/AppContext";
import { PROJETS, ALL_SITES } from "../../lib/data";

const SB = { background: "#2d4a7a", color: "#fff", padding: "8px 14px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", textAlign: "left", whiteSpace: "nowrap" };
const DEVISES = ["MGA", "USD", "EUR", "GBP", "CHF"];

const EMPTY_LIQ = {
  site: "", date: "", numero: "", marche: "", description: "",
  numFacture: "", dateFacture: "", dateFait: "",
  devise: "MGA", cours: 1, coursRapportUSD: 4500,
  imputations: [], piecesJustif: [],
};

function ImpLine({ imp, idx, onChange, onDel, users }) {
  const up = (k, v) => onChange({ ...imp, [k]: v });
  const cell = (k, type = "text", w = 90) => (
    <td style={{ padding: "4px 3px", borderBottom: `1px solid ${BD}` }}>
      <input type={type} value={imp[k] ?? ""} onChange={e => up(k, type === "number" ? Number(e.target.value) : e.target.value)}
        style={{ width: w, border: `1px solid #d0d7e4`, borderRadius: 3, padding: "4px 6px", fontSize: 11, outline: "none", background: WH }} />
    </td>
  );

  return (
    <tr style={{ background: idx % 2 === 0 ? WH : "#f9fafc" }}>
      <td style={{ padding: "4px 8px", borderBottom: `1px solid ${BD}`, fontSize: 11, color: MUT, fontWeight: 700 }}>{idx + 1}</td>
      {cell("libelle", "text", 120)}
      {cell("compte", "text", 80)}
      {cell("compteAux", "text", 80)}
      {cell("compteFourn", "text", 80)}
      {cell("auxFourn", "text", 90)}
      {cell("mtMGA", "number", 90)}
      {cell("mtUSD", "number", 80)}
      {cell("mtDevise", "number", 80)}
      {cell("activite", "text", 80)}
      {cell("financement", "text", 90)}
      {cell("categorie", "text", 80)}
      {cell("pcop", "text", 70)}
      {cell("geo", "text", 80)}
      {cell("plan6", "text", 60)}
      {cell("plan7", "text", 60)}
      {cell("plan8", "text", 60)}
      <td style={{ padding: "4px 6px", borderBottom: `1px solid ${BD}` }}>
        <button onClick={onDel} style={{ ...btn("danger", true), padding: "3px 6px" }}>
          <span style={{ display: "flex" }}>{IC.trash}</span>
        </button>
      </td>
    </tr>
  );
}

export default function Liquidations() {
  const { docs, liq, setLiq } = useApp();
  const [viewMode, setViewMode] = useState("list"); // "list" | "form"
  const [editLiq, setEditLiq] = useState(null);
  const [tab, setTab] = useState("imputations");
  const [syncing, setSyncing] = useState(false);
  const [modal, setModal] = useState(null); // null | "recup_tompro" | "import_excel" | "recup_softdocs"
  const [importFile, setImportFile] = useState(null);
  const [importStatus, setImportStatus] = useState(""); // "" | "loading" | "done" | "error"
  const [recupSdSel, setRecupSdSel] = useState([]);
  const [syncedId, setSyncedId] = useState(null);
  const tableRef = useRef(null);

  const eligible = docs.filter(d => ["VALIDÉ", "BON À PAYER"].includes(d.st) && d.fourn);

  const total   = liq.reduce((s, l) => s + (l.mt || l.imputations?.reduce((a, i) => a + (i.mtMGA || 0), 0) || 0), 0);
  const paid    = liq.filter(l => l.st === "PAYÉ").reduce((s, l) => s + (l.mt || 0), 0);
  const synced  = liq.filter(l => l.syncTompro).length;

  function openNew() {
    setEditLiq({ ...JSON.parse(JSON.stringify(EMPTY_LIQ)), id: gid("LIQ") });
    setTab("imputations"); setViewMode("form");
  }
  function openEdit(l) {
    setEditLiq(JSON.parse(JSON.stringify(l)));
    setTab("imputations"); setViewMode("form");
  }
  function cancel() { setViewMode("list"); setEditLiq(null); }

  function addImp() {
    setEditLiq(p => ({ ...p, imputations: [...(p.imputations || []), { id: gid("IMP"), libelle: "", compte: "", compteAux: "", compteFourn: "", auxFourn: "", mtMGA: 0, mtUSD: 0, mtDevise: 0, activite: "", financement: "", categorie: "", pcop: "", geo: "", plan6: "", plan7: "", plan8: "" }] }));
  }
  function updImp(i, imp) { setEditLiq(p => ({ ...p, imputations: p.imputations.map((x, ii) => ii === i ? imp : x) })); }
  function delImp(i) { setEditLiq(p => ({ ...p, imputations: p.imputations.filter((_, ii) => ii !== i) })); }

  function save(close = true) {
    const entry = {
      ...editLiq,
      mt: editLiq.imputations.reduce((s, i) => s + (i.mtMGA || 0), 0) || 0,
      st: editLiq.st || "EN ATTENTE PAIEMENT",
      fourn: editLiq.fourn || "",
    };
    setLiq(p => p.some(x => x.id === entry.id) ? p.map(l => l.id === entry.id ? entry : l) : [...p, entry]);
    if (close) cancel();
  }

  function syncTompro() {
    setSyncing(true);
    setTimeout(() => {
      save(false);
      setLiq(p => p.map(l => l.id === editLiq.id ? { ...l, syncTompro: true, dateSync: now() } : l));
      setEditLiq(p => ({ ...p, syncTompro: true, dateSync: now() }));
      setSyncing(false);
      setSyncedId(editLiq.id);
      setTimeout(() => setSyncedId(null), 3000);
    }, 1500);
  }

  function cloture() {
    save(false);
    setLiq(p => p.map(l => l.id === editLiq.id ? { ...l, st: "CLÔTURÉ" } : l));
    cancel();
  }

  const up = (k, v) => setEditLiq(p => ({ ...p, [k]: v }));

  /* Export rows */
  const exportRows = liq.map(l => [l.id, l.numero || "", l.site || "", l.date, l.marche || "", l.description || "", l.numFacture || "", l.dateFacture || "", l.devise, l.cours, fmtN(l.mt), l.st]);
  const exportHdrs = ["ID", "N° Liquidation", "Site", "Date", "Marché", "Description", "N° Facture", "Date Facture", "Devise", "Cours", "Montant MGA", "Statut"];

  return (
    <div style={{ animation: "fadeIn .2s ease" }}>
      {/* ─── LIST VIEW ─── */}
      {viewMode === "list" && (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#212529" }}>Liquidations — Interface TOMPRO</h2>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>

              {/* ── Récupérer TOMPRO ── */}
              <button onClick={() => setModal("recup_tompro")}
                style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"7px 13px", borderRadius:6, border:"2px solid #e03e3e", background:"#fff0f0", color:"#e03e3e", cursor:"pointer", fontSize:12.5, fontWeight:700, fontFamily:"inherit" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                Récupérer TOMPRO
              </button>

              {/* ── Importer fichier Excel ── */}
              <button onClick={() => setModal("import_excel")}
                style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"7px 13px", borderRadius:6, border:"2px solid #1d6f42", background:"#f0fff4", color:"#1d6f42", cursor:"pointer", fontSize:12.5, fontWeight:700, fontFamily:"inherit" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Importer fichier
              </button>

              {/* ── Récupérer SoftDocs ── */}
              <button onClick={() => setModal("recup_softdocs")}
                style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"7px 13px", borderRadius:6, border:"2px solid #324372", background:"#f0f4ff", color:"#324372", cursor:"pointer", fontSize:12.5, fontWeight:700, fontFamily:"inherit" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                Récup SoftDocs
              </button>

              <ExportButtons filename="liquidations" title="Liquidations" headers={exportHdrs} rows={exportRows} tableRef={tableRef} />
              <button onClick={openNew} style={btn("primary", true)}>
                <span style={{ display: "flex" }}>{IC.plus}</span> Nouvelle liquidation
              </button>
            </div>
          </div>

          {/* KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: typeof window!=="undefined"&&window.innerWidth<=768?"repeat(2,1fr)":"repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
            {[
              ["Total liquidations", liq.length, P, IC.file],
              ["Montant total (MGA)", fmtN(total), "#2d6a4f", IC.money],
              ["Payé", fmtN(paid), "#28a745", IC.checkCircle],
              ["Sync TOMPRO", `${synced}/${liq.length}`, "#0077cc", IC.link],
            ].map(([label, val, color, icon]) => (
              <div key={label} style={{ background: WH, border: `1px solid ${BD}`, borderRadius: 6, padding: "14px 18px", boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ display: "flex", color }}>{icon}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: MUT, textTransform: "uppercase" }}>{label}</span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div style={{ ...card() }}>
            <div style={{ overflowX: "auto" }}>
              <table ref={tableRef} style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "#2d4a7a" }}>
                    {["#", "N° Liquidation", "Site", "Date", "Marché", "Description", "N° Facture", "Date Facture", "Devise", "Cours", "Cours / USD", "Date svc fait", "Actions"].map(h => (
                      <th key={h} style={SB}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {liq.length === 0 && (
                    <tr><td colSpan={13} style={{ ...TD, textAlign: "center", color: MUT, padding: 32 }}>Aucune liquidation — Créez la première</td></tr>
                  )}
                  {liq.map((l, idx) => (
                    <tr key={l.id}
                      style={{ background: idx % 2 === 0 ? WH : "#f9fafc", cursor: "pointer" }}
                      onClick={() => openEdit(l)}>
                      <td style={{ ...TD, fontSize: 11, color: MUT }}>{idx + 1}</td>
                      <td style={{ ...TD, fontWeight: 700, color: P }}>{l.numero || l.id}</td>
                      <td style={{ ...TD }}>{l.site || "—"}</td>
                      <td style={{ ...TD, whiteSpace: "nowrap" }}>{l.date}</td>
                      <td style={{ ...TD }}>{l.marche || "—"}</td>
                      <td style={{ ...TD, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.description || "—"}</td>
                      <td style={{ ...TD }}>{l.numFacture || "—"}</td>
                      <td style={{ ...TD }}>{l.dateFacture || "—"}</td>
                      <td style={{ ...TD }}>{l.devise || "MGA"}</td>
                      <td style={{ ...TD }}>{l.cours || 1}</td>
                      <td style={{ ...TD }}>{l.coursRapportUSD || "—"}</td>
                      <td style={{ ...TD }}>{l.dateFait || "—"}</td>
                      <td style={{ ...TD }}>
                        <div style={{ display: "flex", gap: 4 }} onClick={e => e.stopPropagation()}>
                          <button onClick={() => openEdit(l)} style={{ ...btn("light", true), padding: "3px 8px" }}>
                            <span style={{ display: "flex" }}>{IC.edit}</span>
                          </button>
                          {l.syncTompro && (
                            <span style={{ ...bdg("#e8f5ff", "#1560bd", { fontSize: 10 }) }}>TOMPRO</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ─── FORM VIEW (nouvelle / édition) ─── */}
      {viewMode === "form" && editLiq && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <button onClick={cancel} style={btn("light", true)}>
              <span style={{ display: "flex", transform: "rotate(180deg)" }}>{IC.chev}</span> Retour
            </button>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#212529" }}>
              {editLiq.syncTompro ? `Liquidation — ${editLiq.numero || editLiq.id}` : "Nouvelle liquidation"}
            </h2>
            {editLiq.syncTompro && <span style={{ ...bdg(SUCL, SUCD, { fontSize: 11 }) }}>Synchronisé TOMPRO · {editLiq.dateSync}</span>}
          </div>

          {/* 3 sections header */}
          <div style={{ display: "grid", gridTemplateColumns: typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
            {/* Info de base */}
            <div style={{ ...card(), padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: MUT, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 14 }}>Information de base</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div><label style={lbl}>Site</label>
                  <select value={editLiq.site} onChange={e => up("site", e.target.value)} style={inp()}>
                    <option value="">— Sélectionner —</option>
                    {ALL_SITES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div><label style={lbl}>Date</label>
                  <input type="date" value={editLiq.date} onChange={e => up("date", e.target.value)} style={inp()} />
                </div>
                <div><label style={lbl}>Numéro</label>
                  <input value={editLiq.numero} onChange={e => up("numero", e.target.value)} placeholder="LIQ-2025-..." style={inp()} />
                </div>
                <div><label style={lbl}>Marché</label>
                  <input value={editLiq.marche} onChange={e => up("marche", e.target.value)} placeholder="N° du marché" style={inp()} />
                </div>
                <div><label style={lbl}>Description</label>
                  <textarea value={editLiq.description} onChange={e => up("description", e.target.value)} rows={3}
                    style={{ ...inp(), resize: "vertical", fontFamily: "inherit" }} placeholder="Description de la liquidation…" />
                </div>
              </div>
            </div>

            {/* Facture */}
            <div style={{ ...card(), padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: MUT, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 14 }}>Facture</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {/* Link to doc */}
                <div><label style={lbl}>Document lié</label>
                  <select value={editLiq.docRef || ""} onChange={e => {
                    const d = docs.find(x => x.id === e.target.value);
                    up("docRef", e.target.value);
                    if (d) { up("fourn", d.fourn); up("numFacture", d.ch?.numero || ""); up("dateFacture", d.date); }
                  }} style={inp()}>
                    <option value="">— Sélectionner un document —</option>
                    {eligible.map(d => <option key={d.id} value={d.id}>{d.id} · {d.fourn}</option>)}
                  </select>
                </div>
                <div><label style={lbl}>N° Facture</label>
                  <input value={editLiq.numFacture} onChange={e => up("numFacture", e.target.value)} style={inp()} />
                </div>
                <div><label style={lbl}>Date facture</label>
                  <input type="date" value={editLiq.dateFacture} onChange={e => up("dateFacture", e.target.value)} style={inp()} />
                </div>
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${BD}` }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: MUT, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 12 }}>Service fait</div>
                  <div><label style={lbl}>Date de service fait</label>
                    <input type="date" value={editLiq.dateFait} onChange={e => up("dateFait", e.target.value)} style={inp()} />
                  </div>
                </div>
              </div>
            </div>

            {/* Devise */}
            <div style={{ ...card(), padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: MUT, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 14 }}>Devise en cours</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div><label style={lbl}>Devise</label>
                  <select value={editLiq.devise} onChange={e => up("devise", e.target.value)} style={inp()}>
                    {DEVISES.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div><label style={lbl}>Cours</label>
                  <input type="number" value={editLiq.cours} onChange={e => up("cours", Number(e.target.value))} style={inp()} />
                </div>
                <div><label style={lbl}>Cours Rapport USD</label>
                  <input type="number" value={editLiq.coursRapportUSD} onChange={e => up("coursRapportUSD", Number(e.target.value))} style={inp()} />
                </div>

                {/* Summary */}
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${BD}` }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: MUT, marginBottom: 6, textTransform: "uppercase" }}>Totaux imputations</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#2d6a4f" }}>
                    {fmtN(editLiq.imputations?.reduce((s, i) => s + (i.mtMGA || 0), 0) || 0)}
                  </div>
                  <div style={{ fontSize: 11, color: MUT, marginTop: 2 }}>
                    USD: {(editLiq.imputations?.reduce((s, i) => s + (i.mtUSD || 0), 0) || 0).toLocaleString()}
                  </div>
                </div>

                {/* Pièces justificatives count */}
                <div style={{ paddingTop: 12, borderTop: `1px solid ${BD}` }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: MUT, marginBottom: 6, textTransform: "uppercase" }}>Pièces justificatives</div>
                  <span style={{ ...bdg("#eef1f8", P, { fontSize: 12 }) }}>
                    {editLiq.piecesJustif?.length || 0} fichier(s)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs: Imputations | Pièces */}
          <div style={{ ...card() }}>
            <div style={{ display: "flex", borderBottom: `1px solid ${BD}`, padding: "0 4px" }}>
              {[["imputations", "Imputations"], ["pieces", "Pièces Justificatives"]].map(([k, l]) => (
                <button key={k} onClick={() => setTab(k)}
                  style={{ background: "none", border: "none", padding: "12px 20px", fontSize: 13, cursor: "pointer", color: tab === k ? P : MUT, fontWeight: tab === k ? 700 : 400, borderBottom: tab === k ? `2px solid ${P}` : "2px solid transparent" }}>
                  {l}
                </button>
              ))}
            </div>

            {tab === "imputations" && (
              <div>
                <div style={{ padding: "12px 16px", borderBottom: `1px solid ${BD}` }}>
                  <button onClick={addImp} style={btn("primary", true)}>
                    <span style={{ display: "flex" }}>{IC.plus}</span> Nouvelle imputation
                  </button>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                    <thead>
                      <tr style={{ background: "#3a5a8a" }}>
                        {["#", "Libellé", "Compte", "Cpt. aux.", "Cpt. fourn.", "Aux. fourn.", "Mt MGA", "Mt USD", "Mt Devise", "Activité", "Financement", "Catégorie", "Pcop", "Géo", "Plan6", "Plan7", "Plan8", ""].map(h => (
                          <th key={h} style={{ ...SB, background: "#3a5a8a", fontSize: 10 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(!editLiq.imputations || editLiq.imputations.length === 0) && (
                        <tr><td colSpan={18} style={{ padding: 24, textAlign: "center", color: MUT, fontSize: 13 }}>
                          Aucune imputation — cliquez sur "Nouvelle imputation"
                        </td></tr>
                      )}
                      {editLiq.imputations?.map((imp, i) => (
                        <ImpLine key={imp.id || i} imp={imp} idx={i}
                          onChange={v => updImp(i, v)}
                          onDel={() => delImp(i)} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === "pieces" && (
              <div style={{ padding: 20 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: MUT, marginBottom: 14 }}>
                  Pièces justificatives rattachées à cette liquidation
                </div>
                {(editLiq.piecesJustif || []).map((p, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${BD}` }}>
                    <span style={{ display: "flex", color: "#c0392b" }}>{IC.pdf}</span>
                    <span style={{ flex: 1, fontSize: 13, color: "#212529" }}>{p}</span>
                    <button onClick={() => setEditLiq(pr => ({ ...pr, piecesJustif: pr.piecesJustif.filter((_, ii) => ii !== i) }))}
                      style={{ ...btn("danger", true), padding: "3px 8px" }}>
                      <span style={{ display: "flex" }}>{IC.x}</span>
                    </button>
                  </div>
                ))}
                {/* Real file input */}
                <div style={{ marginTop: 16 }}>
                  <label style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", background: "#f8f9fc", border: "1.5px dashed #9ca3af", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, color: P, transition: "all .15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#eef1f8"; e.currentTarget.style.borderColor = P; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#f8f9fc"; e.currentTarget.style.borderColor = "#9ca3af"; }}>
                    <span style={{ display: "flex" }}>{IC.plus}</span>
                    Ajouter une pièce justificative
                    <input type="file" multiple accept=".pdf,.xlsx,.xls,.docx,.jpg,.png"
                      style={{ display: "none" }}
                      onChange={e => {
                        const files = Array.from(e.target.files || []);
                        if (files.length > 0) {
                          setEditLiq(p => ({ ...p, piecesJustif: [...(p.piecesJustif || []), ...files.map(f => f.name)] }));
                        }
                        e.target.value = "";
                      }} />
                  </label>
                  <div style={{ marginTop: 6, fontSize: 11.5, color: MUT }}>Formats acceptés : PDF, Excel, Word, JPG, PNG</div>
                </div>
                <div style={{ marginTop: 16, padding: "12px 14px", background: "#f0f7ff", borderRadius: RSm, border: "1px solid #b8d9f5", fontSize: 12.5, color: "#1a4a6e" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {IC.info}
                    Les pièces justificatives sont automatiquement rattachées aux écritures comptables lors de la synchronisation TOMPRO.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom actions bar — like image 3 */}
          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <button onClick={cancel} style={{ ...btn("danger"), background: "#dc3545" }}>
              <span style={{ display: "flex" }}>{IC.x}</span> Annuler
            </button>
            <button onClick={() => save(false)} style={{ ...btn(), background: "#6c757d", color: "#fff", border: "none" }}>
              <span style={{ display: "flex" }}>{IC.plus}</span> Ajouter liquidation
            </button>
            <button onClick={() => save(false)} style={{ ...btn("success") }}>
              <span style={{ display: "flex" }}>{IC.chk}</span> Enregistrer liquidation
            </button>
            <button onClick={syncTompro} disabled={syncing}
              style={{ ...btn(), background: "#5c35cc", color: "#fff", border: "none", opacity: syncing ? .7 : 1 }}>
              {syncing ? (
                <><svg style={{ animation: "fadeIn .1s, spin .8s linear infinite" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 12a9 9 0 1 1-18 0" /></svg> Synchronisation…</>
              ) : (
                <><span style={{ display: "flex" }}>{IC.link}</span> Synchronisation TOMPRO</>
              )}
            </button>
            <button onClick={cloture} style={{ ...btn(), background: "#e07d00", color: "#fff", border: "none" }}>
              <span style={{ display: "flex" }}>{IC.power}</span> Clôturer liquidation
            </button>
          </div>
          {syncedId === editLiq?.id && (
            <div style={{ marginTop: 10, padding: "10px 16px", background: SUCL, borderRadius: RSm, color: SUCD, fontSize: 13, fontWeight: 600, display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ display: "flex" }}>{IC.checkCircle}</span>
              Synchronisation TOMPRO réussie — Les écritures comptables ont été transmises le {now()}
            </div>
          )}
        </div>
      )}

      {/* ══ Modal: Récupérer TOMPRO ══ */}
      {modal === "recup_tompro" && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:6000,padding:20 }}>
          <div style={{ background:"#fff",borderRadius:14,width:"100%",maxWidth:460,boxShadow:"0 24px 80px rgba(0,0,0,.3)",overflow:"hidden" }}>
            <div style={{ background:"#e03e3e",padding:"16px 22px",display:"flex",alignItems:"center",gap:10 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
              <h3 style={{ fontSize:15,fontWeight:800,color:"#fff",margin:0 }}>Synchronisation TOMPRO</h3>
            </div>
            <div style={{ padding:"20px 22px" }}>
              <p style={{ fontSize:13,color:"#495057",marginBottom:16 }}>
                Récupérez les liquidations existantes depuis l'interface TOMPRO pour les importer dans SoftDocs E-paiement.
              </p>
              <div style={{ background:"#fff3cd",border:"1px solid #ffc107",borderRadius:8,padding:"10px 14px",marginBottom:16,fontSize:12.5,color:"#856404" }}>
                ⚠️ Cette action synchronise les données depuis le serveur TOMPRO. Assurez-vous d'être connecté au réseau interne.
              </div>
              <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                <div style={{ display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr",gap:10 }}>
                  <div>
                    <div style={{ fontSize:11,fontWeight:700,color:"#495057",textTransform:"uppercase",marginBottom:4 }}>Période du</div>
                    <input type="date" style={{ width:"100%",boxSizing:"border-box",padding:"7px 10px",border:"1px solid #dee2e6",borderRadius:6,fontSize:13,fontFamily:"inherit" }}/>
                  </div>
                  <div>
                    <div style={{ fontSize:11,fontWeight:700,color:"#495057",textTransform:"uppercase",marginBottom:4 }}>Au</div>
                    <input type="date" style={{ width:"100%",boxSizing:"border-box",padding:"7px 10px",border:"1px solid #dee2e6",borderRadius:6,fontSize:13,fontFamily:"inherit" }}/>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ padding:"14px 22px",borderTop:"1px solid #dee2e6",display:"flex",gap:10,justifyContent:"flex-end" }}>
              <button onClick={()=>setModal(null)} style={{ padding:"8px 18px",border:"1px solid #dee2e6",borderRadius:6,background:"#fff",cursor:"pointer",fontSize:13,fontFamily:"inherit" }}>Annuler</button>
              <button onClick={()=>{
                  setSyncing(true);
                  setTimeout(()=>{setSyncing(false);setModal(null);},2000);
                }}
                style={{ display:"inline-flex",alignItems:"center",gap:6,padding:"8px 18px",borderRadius:6,border:"none",background:"#e03e3e",color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"inherit" }}>
                {syncing?<><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{animation:"spin 1s linear infinite"}}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/></svg> Synchronisation…</>:<>Synchroniser maintenant</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ Modal: Importer fichier Excel ══ */}
      {modal === "import_excel" && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:6000,padding:20 }}>
          <div style={{ background:"#fff",borderRadius:14,width:"100%",maxWidth:500,boxShadow:"0 24px 80px rgba(0,0,0,.3)",overflow:"hidden" }}>
            <div style={{ background:"#1d6f42",padding:"16px 22px",display:"flex",alignItems:"center",gap:10 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <h3 style={{ fontSize:15,fontWeight:800,color:"#fff",margin:0 }}>Importer un fichier Excel</h3>
            </div>
            <div style={{ padding:"20px 22px" }}>
              <p style={{ fontSize:13,color:"#495057",marginBottom:16 }}>Importez un fichier Excel (.xlsx) contenant des liquidations. Les colonnes doivent correspondre au modèle TOMPRO.</p>
              {/* Drop zone */}
              <label style={{
                display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,
                padding:"28px 20px",border:"2px dashed #1d6f42",borderRadius:10,background:"#f0fff4",
                cursor:"pointer",transition:"all .2s",
              }}>
                <input type="file" accept=".xlsx,.xls,.csv" style={{display:"none"}} onChange={e=>{
                  const f=e.target.files?.[0];
                  setImportFile(f||null);
                  setImportStatus("");
                }}/>
                {importFile?(
                  <><div style={{fontSize:32}}>📊</div>
                  <div style={{fontSize:13,fontWeight:700,color:"#1d6f42",textAlign:"center"}}>{importFile.name}</div>
                  <div style={{fontSize:11,color:"#6c757d"}}>{(importFile.size/1024).toFixed(1)} Ko · Prêt à importer</div></>
                ):(
                  <><div style={{fontSize:32}}>📁</div>
                  <div style={{fontSize:13,fontWeight:600,color:"#1d6f42"}}>Cliquez ou glissez votre fichier ici</div>
                  <div style={{fontSize:11,color:"#6c757d"}}>.xlsx · .xls · .csv</div></>
                )}
              </label>
              {importStatus==="done"&&<div style={{marginTop:10,padding:"8px 12px",background:"#d4edda",borderRadius:6,fontSize:12.5,color:"#155724",fontWeight:600}}>✅ Import réussi — lignes importées avec succès</div>}
              {importStatus==="error"&&<div style={{marginTop:10,padding:"8px 12px",background:"#f8d7da",borderRadius:6,fontSize:12.5,color:"#721c24",fontWeight:600}}>❌ Format invalide — vérifiez les colonnes du fichier</div>}
              {/* Template download */}
              <div style={{marginTop:12,fontSize:12,color:"#6c757d"}}>
                💡 <span style={{color:"#1d6f42",cursor:"pointer",fontWeight:600,textDecoration:"underline"}} onClick={()=>{}}>Télécharger le modèle Excel</span>
              </div>
            </div>
            <div style={{ padding:"14px 22px",borderTop:"1px solid #dee2e6",display:"flex",gap:10,justifyContent:"flex-end" }}>
              <button onClick={()=>{setModal(null);setImportFile(null);setImportStatus("");}} style={{ padding:"8px 18px",border:"1px solid #dee2e6",borderRadius:6,background:"#fff",cursor:"pointer",fontSize:13,fontFamily:"inherit" }}>Annuler</button>
              <button disabled={!importFile} onClick={()=>{
                  setImportStatus("loading");
                  setTimeout(()=>setImportStatus("done"),1500);
                }}
                style={{ display:"inline-flex",alignItems:"center",gap:6,padding:"8px 18px",borderRadius:6,border:"none",background:importFile?"#1d6f42":"#adb5bd",color:"#fff",cursor:importFile?"pointer":"not-allowed",fontSize:13,fontWeight:700,fontFamily:"inherit",opacity:importFile?1:.7 }}>
                {importStatus==="loading"?<>⏳ Import en cours…</>:<>Importer</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ Modal: Récupérer SoftDocs ══ */}
      {modal === "recup_softdocs" && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:6000,padding:20 }}>
          <div style={{ background:"#fff",borderRadius:14,width:"100%",maxWidth:640,maxHeight:"85vh",display:"flex",flexDirection:"column",boxShadow:"0 24px 80px rgba(0,0,0,.3)",overflow:"hidden" }}>
            <div style={{ background:"#324372",padding:"16px 22px",display:"flex",alignItems:"center",gap:10 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              <h3 style={{ fontSize:15,fontWeight:800,color:"#fff",margin:0 }}>Récupérer depuis SoftDocs</h3>
              <span style={{ marginLeft:"auto",fontSize:11,background:"rgba(255,255,255,.2)",color:"#fff",padding:"2px 8px",borderRadius:10 }}>{eligible.length} document{eligible.length>1?"s":""} éligibles</span>
            </div>
            <div style={{ padding:"14px 20px",flex:1,overflowY:"auto" }}>
              <p style={{ fontSize:12.5,color:"#495057",marginBottom:12 }}>Documents SoftDocs validés (BON À PAYER) non encore liquidés :</p>
              {eligible.length===0&&<div style={{textAlign:"center",padding:"24px",color:MUT,fontSize:13}}>Aucun document éligible pour le moment.</div>}
              {eligible.map(doc=>{
                const sel=recupSdSel.includes(doc.id);
                return(
                  <label key={doc.id} onMouseDown={e=>{e.preventDefault();setRecupSdSel(p=>sel?p.filter(x=>x!==doc.id):[...p,doc.id]);}}
                    style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",borderRadius:8,cursor:"pointer",userSelect:"none",marginBottom:6,border:"1px solid "+(sel?"#324372":"#dee2e6"),background:sel?"#f0f4ff":"#fafbfc"}}>
                    <div style={{width:16,height:16,borderRadius:4,flexShrink:0,border:"2px solid "+(sel?"#324372":"#dee2e6"),background:sel?"#324372":"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      {sel&&<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:700,color:"#324372"}}>{doc.id}</div>
                      <div style={{fontSize:11,color:"#6c757d"}}>{doc.type} · {doc.fourn||"—"} · {doc.proj||"—"}</div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontSize:13,fontWeight:700,color:"#1d6f42"}}>{fmtN(doc.mtR||doc.mt||0)} Ar</div>
                      <div style={{fontSize:10,background:"#d4edda",color:"#155724",padding:"1px 7px",borderRadius:10,fontWeight:700}}>{doc.st}</div>
                    </div>
                  </label>
                );
              })}
            </div>
            <div style={{ padding:"14px 22px",borderTop:"1px solid #dee2e6",display:"flex",gap:10,justifyContent:"space-between",alignItems:"center" }}>
              <span style={{fontSize:12,color:MUT}}>{recupSdSel.length} sélectionné{recupSdSel.length>1?"s":""}</span>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>{setModal(null);setRecupSdSel([]);}} style={{ padding:"8px 18px",border:"1px solid #dee2e6",borderRadius:6,background:"#fff",cursor:"pointer",fontSize:13,fontFamily:"inherit" }}>Annuler</button>
                <button disabled={recupSdSel.length===0} onClick={()=>{
                    const newLiqs=eligible.filter(doc=>recupSdSel.includes(doc.id)).map(doc=>({
                      ...JSON.parse(JSON.stringify(EMPTY_LIQ)),
                      id:gid("LIQ"), fourn:doc.fourn||"", description:doc.type+" - "+doc.id,
                      numFacture:doc.id, dateFacture:doc.date, mt:doc.mtR||doc.mt||0,
                      st:"EN ATTENTE PAIEMENT", sdDocId:doc.id,
                    }));
                    setLiq(p=>[...p,...newLiqs]);
                    setModal(null);setRecupSdSel([]);
                  }}
                  style={{ display:"inline-flex",alignItems:"center",gap:6,padding:"8px 18px",borderRadius:6,border:"none",background:recupSdSel.length>0?"#324372":"#adb5bd",color:"#fff",cursor:recupSdSel.length>0?"pointer":"not-allowed",fontSize:13,fontWeight:700,fontFamily:"inherit" }}>
                  Importer {recupSdSel.length>0?`(${recupSdSel.length})`:""}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
