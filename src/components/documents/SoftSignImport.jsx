"use client";
import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { extractTextFromPDF, pdfToCanvas, tesseractOCR, parseInvoiceText } from "./OCRScanner";

const COLLAB_KEY = "ss_collab_docs";
const lsGet = (k) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const getDocB64 = (doc) => doc?.b64 || doc?.fileB64 || null;
const getDocName = (doc) => doc?.name || doc?.title || "document";

function toIsoDate(value) {
  if (!value) return "";
  const raw = String(value).trim();
  let m = raw.match(/^(\d{4})[\/.-](\d{1,2})[\/.-](\d{1,2})$/);
  if (m) {
    const [, y, mm, dd] = m;
    return `${y}-${mm.padStart(2,"0")}-${dd.padStart(2,"0")}`;
  }
  m = raw.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})$/);
  if (m) {
    const [, dd, mm, yy] = m;
    const y = yy.length === 2 ? `20${yy}` : yy;
    return `${y}-${mm.padStart(2,"0")}-${dd.padStart(2,"0")}`;
  }
  return "";
}

const TYPE_INFO = {
  facture:      { label:"Facture",           icon:"🧾", color:"#dc2626" },
  devis:        { label:"Devis",             icon:"📄", color:"#2563eb" },
  bon_commande: { label:"Bon de commande",   icon:"📋", color:"#7c3aed" },
  contrat:      { label:"Contrat",           icon:"📑", color:"#059669" },
  note_frais:   { label:"Note de frais",     icon:"💰", color:"#d97706" },
  rapport:      { label:"Rapport / PV",      icon:"📊", color:"#0891b2" },
  bordereau:    { label:"Bordereau",         icon:"📦", color:"#64748b" },
  courrier:     { label:"Lettre / Courrier", icon:"✉️", color:"#8b5cf6" },
  autre:        { label:"Autre",             icon:"📁", color:"#94a3b8" },
};
const typeInfo = (t) => TYPE_INFO[t] || { label: t || "Autre", icon:"📁", color:"#94a3b8" };

const STATUS = {
  depose:     { l:"Déposé",     c:"#2563eb", bg:"#eff6ff" },
  en_attente: { l:"En attente", c:"#d97706", bg:"#fffbeb" },
  signe:      { l:"Signé",      c:"#059669", bg:"#ecfdf5" },
  valide:     { l:"Validé",     c:"#059669", bg:"#ecfdf5" },
  refuse:     { l:"Refusé",     c:"#dc2626", bg:"#fef2f2" },
};
const stInfo = (s) => STATUS[s] || STATUS.depose;

const WH  = "#fff";
const BD  = "#e3e6ea";
const ACC = "#7c3aed";

const OCR_FIELDS = [
  { k:"numero",   l:"N° Document / Facture",  full:true },
  { k:"date_doc", l:"Date du document" },
  { k:"emetteur", l:"Émetteur",               full:true },
  { k:"nif",      l:"NIF" },
  { k:"iban",     l:"IBAN / RIB",             full:true },
  { k:"ht",       l:"Montant HT (Ar)" },
  { k:"tva",      l:"TVA (Ar)" },
  { k:"total",    l:"Total TTC (Ar)" },
];

function b64ToFile(b64, name = "document.pdf") {
  if (!b64) return null;
  try {
    const parts = b64.split(",");
    const mime  = parts[0]?.split(":")?.[1]?.split(";")?.[0] || "application/pdf";
    const bytes = atob(parts[1]);
    const ab    = new ArrayBuffer(bytes.length);
    const ia    = new Uint8Array(ab);
    for (let i = 0; i < bytes.length; i++) ia[i] = bytes.charCodeAt(i);
    return new File([ab], name, { type: mime });
  } catch { return null; }
}

/* ══════════════════════════════════════════════════════════
   ImportWizard — OCR → review → import
══════════════════════════════════════════════════════════ */
function ImportWizard({ cd, types, docs, setDocs, authUser, onDone, onCancel }) {
  const [step,      setStep]      = useState("scanning"); // scanning | review | done
  const [prog,      setProg]      = useState(0);
  const [ocrStatus, setOcrStatus] = useState("Préparation de l'analyse…");
  const [ocrData,   setOcrData]   = useState(null);
  const [edited,    setEdited]    = useState({});
  const [docType,   setDocType]   = useState(cd.type || "facture");
  const [docDate,   setDocDate]   = useState(toIsoDate(cd.date) || new Date().toISOString().slice(0,10));
  const [createdId, setCreatedId] = useState(null);
  const [showRaw,   setShowRaw]   = useState(false);
  const [errMsg,    setErrMsg]    = useState("");

  useEffect(() => {
    if (!getDocB64(cd)) {
      const fallback = { numero:"", date_doc:"", emetteur: cd.uploadedByNom||cd.uploadedBy||"", nif:"", iban:"", ht:"0", tva:"0", total:"0", score:0, rawText:"" };
      setOcrData(fallback); setEdited(fallback); setStep("review");
      return;
    }
    runOCR();
  }, []);

  const runOCR = async () => {
    try {
      setProg(5); setOcrStatus("Chargement du document…");
      const file = b64ToFile(getDocB64(cd), getDocName(cd));
      if (!file) throw new Error("Impossible de lire le fichier");

      let text = "";
      const isPDF = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      const isImage = /^image\//i.test(file.type) || /\.(png|jpe?g|tiff?|bmp|webp)$/i.test(file.name);

      if (isPDF) {
        setProg(10); setOcrStatus("Extraction du texte PDF natif…");
        try { text = await extractTextFromPDF(file); } catch {}

        if (!text || text.replace(/\s/g,"").length < 50) {
          setProg(25); setOcrStatus("PDF scanné — conversion et OCR…");
          const canvas = await pdfToCanvas(file);
          setProg(30); setOcrStatus("Analyse Tesseract…");
          text = await tesseractOCR(canvas, (p) => {
            setProg(30 + Math.round(p * 0.6));
            setOcrStatus(`Reconnaissance… ${30 + Math.round(p * 0.6)}%`);
          });
        } else {
          setProg(70); setOcrStatus("Texte natif extrait ✓");
        }
      } else if (isImage) {
        text = await tesseractOCR(file, (p) => {
          setProg(10 + Math.round(p * 0.75));
          setOcrStatus(`OCR… ${10 + Math.round(p * 0.75)}%`);
        });
      } else {
        throw new Error("Format OCR non supporté. Utilisez PDF, PNG, JPG ou TIFF.");
      }

      setProg(90); setOcrStatus("Analyse intelligente des champs…");
      const parsed = parseInvoiceText(text);
      setOcrData(parsed);
      setEdited({ ...parsed });
      const parsedDate = toIsoDate(parsed.date_doc);
      if (parsedDate) setDocDate(parsedDate);
      setProg(100);
      setStep("review");
    } catch (e) {
      setErrMsg(e.message || "Erreur OCR");
      const fallback = { numero:"", date_doc:"", emetteur: cd.uploadedByNom||cd.uploadedBy||"", nif:"", iban:"", ht:"0", tva:"0", total:"0", score:0, rawText:"" };
      setOcrData(fallback); setEdited(fallback); setStep("review");
    }
  };

  const doImport = () => {
    const now  = new Date();
    const sdId = `SD-SS-${Date.now()}`;
    const matched = (types || []).find(t =>
      t.nom.toLowerCase().includes(docType?.toLowerCase() || "") ||
      (docType || "").toLowerCase().includes(t.nom.toLowerCase())
    );
    const etapes = (matched?.etapes || []).map(e => ({
      ...e, statut:"EN ATTENTE", vActifs: e.v || [],
    }));
    const ti = typeInfo(docType);

    const newDoc = {
      id:    sdId,
      type:  ti.label,
      tid:   matched?.id || null,
      fourn: edited.emetteur || cd.uploadedByNom || cd.uploadedBy,
      date:  docDate || now.toISOString().slice(0,10),
      mt:    parseInt(edited.total || "0") || 0,
      mtR:   0,
      st:    etapes.length > 0 ? "EN VALIDATION" : "EN ATTENTE",
      etapes,
      _ssCollabId: cd.id,
      fileB64:     getDocB64(cd),
      ch: {
        numero:   edited.numero   || cd.id.slice(-8).toUpperCase(),
        date_doc: edited.date_doc || docDate || "",
        emetteur: edited.emetteur || cd.uploadedByNom || cd.uploadedBy,
        nif:      edited.nif   || "",
        iban:     edited.iban  || "",
        ht:       edited.ht    || "0",
        tva:      edited.tva   || "0",
        total:    edited.total || "0",
      },
      ocr: ocrData?.score || 0,
      anx: [],
      historique: [{
        type:    "import",
        date:    now.toLocaleString("fr-FR"),
        par:     authUser?.nom || "Système",
        comment: `Importé depuis SoftSign${ocrData?.score ? ` (OCR ${ocrData.score}%)` : ""} — ${ti.label} par ${cd.uploadedByNom || cd.uploadedBy}`,
      }],
    };

    setDocs(p => [newDoc, ...p]);

    const all = lsGet(COLLAB_KEY) || [];
    lsSet(COLLAB_KEY, all.map(d => d.id === cd.id ? { ...d, _sdId: sdId, status:"en_attente" } : d));

    setCreatedId(sdId);
    setStep("done");
  };

  /* ── Scanning step ── */
  if (step === "scanning") return (
    <div style={{ fontFamily:"'Plus Jakarta Sans','DM Sans',system-ui,sans-serif", maxWidth:520, margin:"0 auto" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24 }}>
        <button onClick={onCancel}
          style={{ padding:"7px 14px", borderRadius:7, border:`1px solid ${BD}`, background:WH, fontSize:13, cursor:"pointer", fontFamily:"inherit", color:"#64748b", fontWeight:600 }}>
          ← Annuler
        </button>
        <div>
          <div style={{ fontSize:15, fontWeight:800, color:"#0f172a" }}>Analyse OCR du document</div>
          <div style={{ fontSize:12, color:"#64748b" }}>{getDocName(cd)}</div>
        </div>
      </div>
      <div style={{ textAlign:"center", padding:"40px 20px" }}>
        <div style={{ position:"relative", width:90, height:120, margin:"0 auto 24px", borderRadius:8, background:"#1e293b", overflow:"hidden", border:"2px solid #7c3aed44" }}>
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", color:"rgba(255,255,255,.2)", fontSize:36 }}>📄</div>
          <div style={{ position:"absolute", left:0, right:0, height:2, background:"linear-gradient(90deg,transparent,#7c3aed,#7c3aedcc,transparent)", animation:"ocrScan 1.6s ease-in-out infinite", boxShadow:"0 0 8px #7c3aed" }}/>
        </div>
        <div style={{ fontSize:15, fontWeight:700, color:"#7c3aed", marginBottom:8 }}>Analyse OCR en cours…</div>
        <div style={{ fontSize:12.5, color:"#64748b", marginBottom:20 }}>{ocrStatus}</div>
        <div style={{ maxWidth:300, margin:"0 auto" }}>
          <div style={{ background:"#e9ecef", borderRadius:4, height:8, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${prog}%`, background:"linear-gradient(90deg,#7c3aed,#4a90d9)", transition:"width .3s", borderRadius:4 }}/>
          </div>
          <div style={{ fontSize:11, color:"#64748b", marginTop:5 }}>{prog}%</div>
        </div>
        {errMsg && <div style={{ marginTop:12, fontSize:12, color:"#dc2626" }}>⚠ {errMsg} — passage en saisie manuelle…</div>}
      </div>
      <style>{`@keyframes ocrScan{0%{top:0}100%{top:100%}}`}</style>
    </div>
  );

  /* ── Review step ── */
  if (step === "review") {
    const sc    = ocrData?.score || 0;
    const qc    = sc >= 80 ? "#059669" : sc >= 50 ? "#d97706" : "#dc2626";
    const qcBg  = sc >= 80 ? "#ecfdf5" : sc >= 50 ? "#fffbeb" : "#fef2f2";
    const hasFile = !!getDocB64(cd);
    return (
      <div style={{ fontFamily:"'Plus Jakarta Sans','DM Sans',system-ui,sans-serif" }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
          <button onClick={onCancel}
            style={{ padding:"7px 14px", borderRadius:7, border:`1px solid ${BD}`, background:WH, fontSize:13, cursor:"pointer", fontFamily:"inherit", color:"#64748b", fontWeight:600 }}>
            ← Annuler
          </button>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15, fontWeight:800, color:"#0f172a" }}>📥 Importer dans SoftDocs</div>
            <div style={{ fontSize:12, color:"#64748b" }}>Vérifiez les données extraites avant d'importer</div>
          </div>
          {hasFile && (
            <div style={{ padding:"5px 12px", borderRadius:20, background:qcBg, border:`1px solid ${qc}30`, fontSize:12, fontWeight:700, color:qc }}>
              OCR {sc}%
            </div>
          )}
        </div>

        {/* Doc info strip */}
        <div style={{ background:"#f8fafc", border:`1px solid ${BD}`, borderRadius:10, padding:"12px 16px", marginBottom:16, display:"flex", flexWrap:"wrap", gap:14 }}>
          <div style={{ fontSize:12.5 }}><span style={{ color:"#64748b" }}>Document : </span><strong style={{ color:"#1e293b" }}>{getDocName(cd)}</strong></div>
          <div style={{ fontSize:12.5 }}><span style={{ color:"#64748b" }}>Déposé par : </span><strong style={{ color:"#1e293b" }}>{cd.uploadedByNom || cd.uploadedBy}</strong></div>
          <div style={{ fontSize:12.5 }}><span style={{ color:"#64748b" }}>Dépôt : </span><strong style={{ color:"#1e293b" }}>{cd.date ? new Date(cd.date).toLocaleDateString("fr-FR") : "—"}</strong></div>
          {!hasFile && <span style={{ fontSize:11, color:"#d97706", fontWeight:600 }}>⚠ Pas de fichier joint — saisie manuelle</span>}
        </div>

        {errMsg && (
          <div style={{ padding:"8px 14px", background:"#fffbeb", border:"1px solid #fef3c7", borderRadius:8, fontSize:12, color:"#92400e", marginBottom:14 }}>
            ⚠ OCR: {errMsg} — Complétez les champs manuellement.
          </div>
        )}

        {/* Type + Date */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
          <div>
            <label style={{ fontSize:11, fontWeight:700, color:"#374151", display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:".05em" }}>Type de document</label>
            <select value={docType} onChange={e => setDocType(e.target.value)}
              style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:`1px solid ${BD}`, fontSize:13, fontFamily:"inherit", outline:"none" }}>
              {Object.entries(TYPE_INFO).map(([k,v]) => (
                <option key={k} value={k}>{v.icon} {v.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize:11, fontWeight:700, color:"#374151", display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:".05em" }}>Date du document</label>
            <input type="date" value={docDate} onChange={e => setDocDate(e.target.value)}
              style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:`1px solid ${BD}`, fontSize:13, fontFamily:"inherit", outline:"none", boxSizing:"border-box" }}/>
          </div>
        </div>

        {/* OCR fields */}
        <div style={{ fontSize:11, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:".08em", marginBottom:8 }}>
          Données financières {hasFile ? `— OCR ${sc}%` : "— saisie manuelle"}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
          {OCR_FIELDS.map(({ k, l, full }) => {
            const detected = hasFile && ocrData?.[k] && ocrData[k].length > 1;
            return (
              <div key={k} style={{ gridColumn:full?"1/-1":"auto", background:detected?"#f0fdf4":"#f8fafc", borderRadius:7, padding:"9px 12px", border:`1px solid ${detected?"#bbf7d0":BD}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ fontSize:10, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:".04em" }}>{l}</span>
                  {hasFile && <span style={{ fontSize:9.5, fontWeight:700, color:detected?"#059669":"#94a3b8" }}>{detected?"✓ détecté":"— vide"}</span>}
                </div>
                <input value={edited[k] || ""} onChange={e => setEdited(p => ({ ...p, [k]: e.target.value }))}
                  placeholder={`Saisir ${l.toLowerCase()}…`}
                  style={{ width:"100%", border:`1px solid ${detected?"#d1fae5":"#e2e8f0"}`, borderRadius:5, padding:"5px 8px", fontSize:12.5, fontWeight:detected?600:400, background:"transparent", fontFamily:"inherit", boxSizing:"border-box", outline:"none", color:"#334155" }}/>
              </div>
            );
          })}
        </div>

        {/* Raw text toggle */}
        {ocrData?.rawText && (
          <div style={{ marginBottom:14 }}>
            <button onClick={() => setShowRaw(p => !p)}
              style={{ fontSize:11.5, color:"#64748b", background:"none", border:"none", cursor:"pointer", padding:"4px 0", fontFamily:"inherit", fontWeight:600 }}>
              {showRaw ? "▲ Cacher" : "▼ Voir"} le texte brut OCR
            </button>
            {showRaw && (
              <pre style={{ marginTop:6, padding:"10px 12px", background:"#1e293b", borderRadius:6, fontSize:10.5, color:"#94a3b8", maxHeight:150, overflowY:"auto", whiteSpace:"pre-wrap" }}>
                {ocrData.rawText}
              </pre>
            )}
          </div>
        )}

        <div style={{ fontSize:11.5, color:"#64748b", padding:"8px 12px", background:"#f8fafc", borderRadius:6, border:`1px solid ${BD}`, marginBottom:16 }}>
          💡 Vérifiez et corrigez les champs. Les montants alimenteront le suivi financier SoftDocs.
        </div>

        <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
          <button onClick={onCancel}
            style={{ padding:"10px 20px", borderRadius:8, border:`1px solid ${BD}`, background:WH, fontSize:13, cursor:"pointer", fontFamily:"inherit", fontWeight:600, color:"#64748b" }}>
            Annuler
          </button>
          <button onClick={doImport}
            style={{ padding:"10px 24px", borderRadius:8, border:"none", background:"linear-gradient(135deg,#1e3a5f,#2563eb)", color:WH, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
            📥 Importer dans SoftDocs →
          </button>
        </div>
      </div>
    );
  }

  /* ── Done step ── */
  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans','DM Sans',system-ui,sans-serif", textAlign:"center", padding:"56px 24px" }}>
      <div style={{ fontSize:72, marginBottom:16 }}>✅</div>
      <div style={{ fontSize:22, fontWeight:800, color:"#059669", marginBottom:8 }}>Document importé !</div>
      <div style={{ fontSize:13.5, color:"#64748b", maxWidth:420, margin:"0 auto 8px", lineHeight:1.6 }}>
        <strong>{getDocName(cd)}</strong> a été importé dans SoftDocs et suit maintenant le circuit de validation habituel.
      </div>
      <div style={{ fontSize:12, color:"#94a3b8", marginBottom:28 }}>
        Référence SoftDocs : <strong style={{ color:"#2563eb" }}>{createdId}</strong>
      </div>
      <button onClick={onDone}
        style={{ padding:"11px 28px", borderRadius:9, border:"none", background:"linear-gradient(135deg,#1e3a5f,#2563eb)", color:WH, fontSize:13.5, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
        Retour à la liste
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN: SoftSignImport — list view
══════════════════════════════════════════════════════════ */
export default function SoftSignImport() {
  const { docs, setDocs, authUser, types } = useApp();
  const [collabDocs,  setCollabDocs]  = useState([]);
  const [typeFilter,  setTypeFilter]  = useState("tous");
  const [search,      setSearch]      = useState("");
  const [importingDoc,setImportingDoc]= useState(null);

  const reload = () => setCollabDocs(lsGet(COLLAB_KEY) || []);
  useEffect(() => { reload(); }, []);

  /* Show wizard full-screen when a doc is being imported */
  if (importingDoc) return (
    <ImportWizard
      cd={importingDoc}
      types={types}
      docs={docs}
      setDocs={setDocs}
      authUser={authUser}
      onDone={() => { setImportingDoc(null); reload(); }}
      onCancel={() => setImportingDoc(null)}
    />
  );

  const usedTypes    = [...new Set(collabDocs.map(d => d.type || "autre").filter(Boolean))];
  const importedCount = collabDocs.filter(d => !!d._sdId).length;
  const pendingCount  = collabDocs.filter(d => !d._sdId).length;

  const filtered = collabDocs.filter(d => {
    if (typeFilter !== "tous" && (d.type || "autre") !== typeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!d.name?.toLowerCase().includes(q) && !(d.uploadedByNom||d.uploadedBy||"").toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans','DM Sans',system-ui,sans-serif" }}>

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <h2 style={{ margin:0, fontSize:20, fontWeight:800, color:"#0f172a" }}>✍️ Documents SoftSign</h2>
          <p style={{ margin:"4px 0 0", fontSize:12.5, color:"#64748b" }}>
            {collabDocs.length} document(s) déposé(s) · {pendingCount} en attente d'import · {importedCount} importé(s)
          </p>
        </div>
        <button onClick={reload}
          style={{ padding:"9px 16px", borderRadius:9, border:`1px solid ${BD}`, background:WH, fontSize:12.5, fontWeight:600, cursor:"pointer", fontFamily:"inherit", color:"#64748b" }}>
          ↻ Actualiser
        </button>
      </div>

      {/* KPI chips */}
      <div style={{ display:"flex", gap:10, marginBottom:18, flexWrap:"wrap" }}>
        {usedTypes.map(t => {
          const ti = typeInfo(t);
          const n  = collabDocs.filter(d => (d.type||"autre") === t).length;
          return (
            <div key={t} style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 14px", borderRadius:20, background:`${ti.color}10`, border:`1px solid ${ti.color}30` }}>
              <span>{ti.icon}</span>
              <span style={{ fontSize:12, fontWeight:700, color:ti.color }}>{ti.label}</span>
              <span style={{ fontSize:11, fontWeight:700, color:ti.color, background:`${ti.color}20`, padding:"1px 7px", borderRadius:20 }}>{n}</span>
            </div>
          );
        })}
        {usedTypes.length === 0 && (
          <span style={{ fontSize:12, color:"#94a3b8" }}>Aucun document déposé pour l'instant</span>
        )}
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:10, marginBottom:18, flexWrap:"wrap", alignItems:"center" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Rechercher nom, collaborateur…"
          style={{ padding:"8px 14px", borderRadius:8, border:`1px solid ${BD}`, fontSize:13, outline:"none", background:"#f8fafc", minWidth:220, fontFamily:"inherit" }}/>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {[{id:"tous", label:"Tous", count:collabDocs.length},
            ...usedTypes.map(t => ({ id:t, label:typeInfo(t).label, count:collabDocs.filter(d=>(d.type||"autre")===t).length }))
          ].map(f => (
            <button key={f.id} onClick={() => setTypeFilter(f.id)}
              style={{ padding:"6px 14px", borderRadius:20, fontSize:12.5, fontWeight:typeFilter===f.id?700:500, cursor:"pointer", fontFamily:"inherit",
                border:`1px solid ${typeFilter===f.id?ACC:BD}`,
                background: typeFilter===f.id ? ACC : WH,
                color: typeFilter===f.id ? WH : "#64748b" }}>
              {typeInfo(f.id)?.icon || ""} {f.label} <span style={{ fontWeight:700, marginLeft:2, opacity:.7 }}>({f.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div style={{ background:"#f8fafc", border:`2px dashed ${BD}`, borderRadius:12, padding:"48px 24px", textAlign:"center", color:"#94a3b8" }}>
          <div style={{ fontSize:48, marginBottom:12 }}>📭</div>
          <div style={{ fontSize:15, fontWeight:700 }}>Aucun document</div>
          <div style={{ fontSize:12.5, marginTop:6, maxWidth:380, margin:"6px auto 0" }}>
            Les collaborateurs déposent leurs documents via l'Espace Collaborateur SoftSign
          </div>
        </div>
      ) : (
        <div style={{ background:WH, border:`1px solid ${BD}`, borderRadius:12, overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#f8fafc" }}>
                {["Type","Document","Déposé par","Date","Statut SoftSign","Statut SoftDocs","Action"].map(h => (
                  <th key={h} style={{ padding:"10px 14px", fontSize:11, fontWeight:700, color:"#64748b", textAlign:"left", textTransform:"uppercase", letterSpacing:".05em", whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(cd => {
                const ti      = typeInfo(cd.type);
                const st      = stInfo(cd.status);
                const imported = !!cd._sdId;
                const sdDoc   = imported ? docs.find(d => d.id === cd._sdId) : null;
                return (
                  <tr key={cd.id} style={{ borderBottom:`1px solid ${BD}` }}
                    onMouseEnter={e => e.currentTarget.style.background="#f8faff"}
                    onMouseLeave={e => e.currentTarget.style.background="transparent"}>

                    <td style={{ padding:"10px 14px" }}>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11.5, fontWeight:700, color:ti.color, background:`${ti.color}12`, padding:"3px 10px", borderRadius:20 }}>
                        {ti.icon} {ti.label}
                      </span>
                    </td>

                    <td style={{ padding:"10px 14px", maxWidth:220 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:"#1e293b", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{cd.name}</div>
                      <div style={{ display:"flex", gap:6, marginTop:2 }}>
                        {cd.password && <span style={{ fontSize:10.5, color:"#d97706", fontWeight:600 }}>🔒 Protégé</span>}
                        {cd.status === "signe"  && <span style={{ fontSize:10.5, color:"#059669", fontWeight:600 }}>✍ Signé</span>}
                        {cd.status === "valide" && <span style={{ fontSize:10.5, color:"#059669", fontWeight:600 }}>✅ Validé</span>}
                        {cd.status === "refuse" && <span style={{ fontSize:10.5, color:"#dc2626", fontWeight:600 }}>❌ Refusé</span>}
                      </div>
                    </td>

                    <td style={{ padding:"10px 14px" }}>
                      <div style={{ fontSize:12.5, fontWeight:600, color:"#334155" }}>{cd.uploadedByNom || "—"}</div>
                      <div style={{ fontSize:11, color:"#94a3b8" }}>{cd.uploadedBy}</div>
                    </td>

                    <td style={{ padding:"10px 14px", fontSize:12, color:"#64748b", whiteSpace:"nowrap" }}>
                      {cd.date ? new Date(cd.date).toLocaleDateString("fr-FR") : "—"}
                    </td>

                    <td style={{ padding:"10px 14px" }}>
                      <span style={{ fontSize:11.5, fontWeight:700, color:st.c, background:st.bg, padding:"3px 10px", borderRadius:20 }}>{st.l}</span>
                    </td>

                    <td style={{ padding:"10px 14px" }}>
                      {sdDoc ? (
                        <div>
                          <div style={{ fontSize:11, fontWeight:700, color:"#059669" }}>✅ {sdDoc.st}</div>
                          <div style={{ fontSize:10.5, color:"#94a3b8" }}>{sdDoc.id}</div>
                        </div>
                      ) : (
                        <span style={{ fontSize:11.5, color:"#94a3b8" }}>—</span>
                      )}
                    </td>

                    <td style={{ padding:"10px 14px" }}>
                      {imported ? (
                        <span style={{ fontSize:12, color:"#059669", fontWeight:700, padding:"6px 12px", borderRadius:8, background:"#ecfdf5", border:"1px solid #bbf7d0", whiteSpace:"nowrap" }}>
                          ✓ Importé
                        </span>
                      ) : (
                        <button onClick={() => setImportingDoc(cd)}
                          style={{ padding:"8px 16px", borderRadius:8, border:"none", background:"linear-gradient(135deg,#1e3a5f,#2563eb)", color:WH, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>
                          📥 Importer
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
