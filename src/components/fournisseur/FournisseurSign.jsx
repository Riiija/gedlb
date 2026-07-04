"use client";

import { useEffect, useRef, useState } from "react";
import { INIT_PROJETS, INIT_USERS } from "../../lib/data";
import {
  INIT_SS_DELEGATIONS_PRO, INIT_SS_EXTERNAL_ACCOUNTS,
  SS_ALLOWED_FORMATS, SS_DEFAULT_GENERAL_SETTINGS, SS_DOC_TYPES,
  createAudit, createSoftSignDocument, getSoftSignAccept, getSoftSignAllowedFormatIds,
  isSoftSignFileAllowed, nextSoftSignReference, normalizeSoftSignGeneralSettings,
} from "../softsign/softsignCore";
import { ExternalSignatureMailbox } from "../softsign/ExternalSignature";
import { extractTextFromPDF, pdfToCanvas, tesseractOCR, parseInvoiceText, loadScript } from "../documents/OCRScanner";

/* ── Constants ─────────────────────────────────────── */
const ACC   = "#6d3fd7"; const ACC2  = "#7c3aed"; const WH = "#fff";
const BD    = "#e3e6ea"; const BG    = "#f6f4fb"; const MUT = "#64748b";
const RED   = "#dc2626"; const GREEN = "#059669"; const ORANGE = "#d97706";
const FONT  = "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif";
const OCR_BG = "#fffbeb"; const OCR_BD = "#fde68a"; const OCR_C = "#d97706";
const PDFJS_WORKER = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

const ACCOUNTS_KEY    = "externalAccounts";
const LEGACY_ACCOUNTS_KEY = "ss_externalAccounts";
const SOFTDOCS_AUTH_KEY = "softdocs_fourn_auth";
const DOCS_KEY        = "ss_docs";
const NOTIFS_KEY      = "ss_notifs";
const GENERAL_SETTINGS_KEY = "generalSettings";
const SOFTSIGN_GENERAL_SETTINGS_KEY = "ss_generalSettings";
const DELEGATIONS_KEY = "ss_delegations";
const SESSION_KEY     = "ss_external_session";
const PORTAL_SESSION_KEY = "fournisseur_portal_session";
const DRAFT_KEY       = "ss_ext_draft";
const SOFTSIGN_PENDING_MESSAGE = "Votre accès au module Signature est en attente de validation par l’administrateur";

/* ── Storage helpers ────────────────────────────────── */
const read  = (k, fb) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } };
const write = (k, v)  => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

function readGeneralSettings() {
  return normalizeSoftSignGeneralSettings({
    ...SS_DEFAULT_GENERAL_SETTINGS,
    ...read(GENERAL_SETTINGS_KEY, {}),
    ...read(SOFTSIGN_GENERAL_SETTINGS_KEY, {}),
  });
}

/* ── Utils ─────────────────────────────────────────── */
function toBase64(file) {
  return new Promise((ok, fail) => { const r = new FileReader(); r.onload = () => ok(r.result); r.onerror = fail; r.readAsDataURL(file); });
}
function normalizeText(value) {
  return String(value || "").trim().replace(/\s+/g, " ").toLowerCase();
}
function normalizeIdentifier(value) {
  return String(value || "").trim().replace(/[\s\-./]/g, "").toLowerCase();
}
function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}
function sourceList(value) {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}
function normalizeAccount(a) {
  const raisonSociale = a.raisonSociale || a.nom || a.login || "";
  const email = a.email || a.mail || "";
  const identifier = a.identificationFiscale || a.identification || a.nif || a.cin || "";
  const softsignStatus = a.moduleAccess?.softsign || a.softSignAccess || a.status || "en_attente";
  return {
    ...a,
    id: a.id || `EXT-${normalizeIdentifier(raisonSociale).slice(0, 8) || Date.now()}`,
    raisonSociale,
    nom: a.nom || raisonSociale,
    login: raisonSociale,
    email,
    mail: a.mail || email,
    nif: identifier,
    identificationFiscale: identifier,
    contactName: a.contactName || [a.contactFirstName, a.contactLastName].filter(Boolean).join(" ") || raisonSociale,
    status: softsignStatus,
    moduleAccess: {
      softdocs: a.moduleAccess?.softdocs || a.softDocsAccess || "en_attente",
      softsign: softsignStatus,
    },
    password: a.password || "",
  };
}
function accountKey(account) {
  const id = normalizeIdentifier(account.identificationFiscale || account.nif || account.cin);
  return `${normalizeText(account.raisonSociale || account.nom)}::${id}`;
}
function mergeAccounts(...sources) {
  const byKey = new Map();
  sources.flat().filter(Boolean).map(normalizeAccount).forEach((account) => {
    const key = accountKey(account);
    const prev = byKey.get(key);
    if (!prev) {
      byKey.set(key, account);
      return;
    }
    const nextStatus = prev.status === "actif" && account.status === "en_attente" ? prev.status : account.status;
    byKey.set(key, {
      ...prev,
      ...account,
      status: nextStatus,
      moduleAccess: {
        ...prev.moduleAccess,
        ...account.moduleAccess,
        softsign: nextStatus,
      },
    });
  });
  return [...byKey.values()];
}
function writeAccounts(accounts) {
  write(ACCOUNTS_KEY, accounts);
  write(LEGACY_ACCOUNTS_KEY, accounts);
}
function getAccounts() {
  const softdocsAccounts = read(SOFTDOCS_AUTH_KEY, null);
  const legacyAccounts = read(LEGACY_ACCOUNTS_KEY, null);
  const storedAccounts = read(ACCOUNTS_KEY, null);
  const hasStoredAccounts = softdocsAccounts !== null || legacyAccounts !== null || storedAccounts !== null;
  const accounts = mergeAccounts(
    hasStoredAccounts ? [] : INIT_SS_EXTERNAL_ACCOUNTS,
    sourceList(softdocsAccounts),
    sourceList(legacyAccounts),
    sourceList(storedAccounts)
  );
  writeAccounts(accounts);
  return accounts;
}
function findAccountByIdentity(raisonSociale, identification) {
  const rs = normalizeText(raisonSociale);
  const id = normalizeIdentifier(identification);
  return getAccounts().find((account) =>
    normalizeText(account.raisonSociale || account.nom) === rs &&
    normalizeIdentifier(account.identificationFiscale || account.nif || account.cin) === id
  );
}
function resolveAccount(account) {
  return findAccountByIdentity(account?.raisonSociale || account?.nom, account?.identificationFiscale || account?.nif || account?.cin) || normalizeAccount(account || {});
}
function isSoftSignActive(account) {
  return (account?.moduleAccess?.softsign || account?.softSignAccess || account?.status) === "actif";
}
function fmtDateISO(ddmmyyyy) {
  const m = String(ddmmyyyy || "").match(/(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})/);
  if (!m) return "";
  const y = m[3].length === 2 ? "20" + m[3] : m[3];
  return `${y}-${String(m[2]).padStart(2, "0")}-${String(m[1]).padStart(2, "0")}`;
}
function genRef()      { return `EXT-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`; }
function genFournRef() { return `FOURN-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 99999)).padStart(5, "0")}`; }
function fmtNum(n)     { return n ? new Intl.NumberFormat("fr-FR").format(Number(n)) : "—"; }

/* ── Shared UI atoms ────────────────────────────────── */
function OcrBadge() {
  return <span style={{ display:"inline-flex", alignItems:"center", gap:3, fontSize:10, fontWeight:800, color:OCR_C, background:OCR_BG, border:`1px solid ${OCR_BD}`, borderRadius:20, padding:"1px 7px", marginLeft:6, verticalAlign:"middle" }}>✏ OCR</span>;
}
function Field({ label, children, full, ocr }) {
  return (
    <label style={{ display:"block", gridColumn: full ? "1 / -1" : undefined }}>
      <span style={{ display:"block", fontSize:11.5, color:"#334155", fontWeight:800, marginBottom:5 }}>{label}{ocr && <OcrBadge />}</span>
      {children}
    </label>
  );
}
function stdInput(ocr = false, extra = {}) {
  return { style: { width:"100%", minHeight:38, borderRadius:8, border:`1px solid ${ocr ? OCR_BD : BD}`, padding:"0 11px", fontFamily:FONT, fontSize:13, outline:"none", background: ocr ? OCR_BG : WH, boxSizing:"border-box", ...extra } };
}
function Btn({ children, onClick, disabled, tone = "primary", type = "button", style: sx }) {
  const [bg, col, br] = ({ primary:[ACC2,WH,ACC2], light:[WH,"#334155",BD], green:[GREEN,WH,GREEN], ghost:["transparent",MUT,BD] })[tone] || [ACC2,WH,ACC2];
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      style={{ minHeight:38, borderRadius:8, border:`1px solid ${disabled?"#e2e8f0":br}`, background:disabled?"#e2e8f0":bg, color:disabled?"#94a3b8":col, fontFamily:FONT, fontSize:13, fontWeight:800, padding:"8px 16px", cursor:disabled?"not-allowed":"pointer", display:"inline-flex", alignItems:"center", gap:7, ...sx }}>
      {children}
    </button>
  );
}
function StatusBadge({ status }) {
  const map = {
    actif:{ label:"Actif", color:GREEN, bg:"#ecfdf5" }, en_attente:{ label:"En attente", color:ORANGE, bg:"#fffbeb" },
    en_attente_traitement:{ label:"En attente traitement", color:ORANGE, bg:"#fffbeb" },
    en_cours:{ label:"En workflow", color:"#2563eb", bg:"#eff6ff" },
    termine:{ label:"Signé", color:GREEN, bg:"#ecfdf5" }, signe:{ label:"Signé", color:GREEN, bg:"#ecfdf5" },
    rejete:{ label:"Rejeté", color:RED, bg:"#fef2f2" },
  }[status] || { label:status||"-", color:MUT, bg:"#f1f5f9" };
  return <span style={{ color:map.color, background:map.bg, borderRadius:20, padding:"3px 9px", fontSize:11, fontWeight:800 }}>{map.label}</span>;
}

/* ── Step top breadcrumb ─────────────────────────────── */
function StepNav({ step }) {
  const steps = [[1,"Dépôt — Upload & OCR"],[2,"Dépôt — Informations"],[3,"Annexes & Aperçu"],[4,"Confirmation"]];
  return (
    <div style={{ background:WH, borderBottom:`1px solid ${BD}`, display:"flex", alignItems:"center", padding:"0 20px", overflowX:"auto" }}>
      {steps.map(([n, label], i) => {
        const done = step > n; const active = step === n;
        return (
          <div key={n} style={{ display:"flex", alignItems:"center" }}>
            {i > 0 && <div style={{ width:28, height:1, background: done ? ACC2 : BD, margin:"0 2px", flexShrink:0 }} />}
            <div style={{ display:"flex", alignItems:"center", gap:6, padding:"11px 8px", borderBottom: active ? `2.5px solid ${ACC2}` : "2.5px solid transparent", whiteSpace:"nowrap" }}>
              <div style={{ width:21, height:21, borderRadius:"50%", background:done||active?ACC2:"#f1f5f9", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                {done
                  ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  : <span style={{ fontSize:10, fontWeight:900, color:active?WH:MUT }}>{n}</span>}
              </div>
              <span style={{ fontSize:12, fontWeight:700, color:active?ACC2:done?"#475569":MUT }}>{label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Green account banner ──────────────────────────── */
function AccountBanner({ account, onLogout, fournRef }) {
  return (
    <div style={{ background:"#ecfdf5", borderBottom:`1px solid #bbf7d0`, padding:"10px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:14, flexWrap:"wrap" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:28, height:28, borderRadius:"50%", background:GREEN, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div>
          <div style={{ fontWeight:800, fontSize:13.5, color:"#065f46" }}>Compte actif — {account.raisonSociale}</div>
          <div style={{ fontSize:11.5, color:"#059669" }}>Connecté en tant que {account.contactName || account.raisonSociale}{account.poste ? ` · ${account.poste}` : ""}</div>
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <span style={{ fontSize:12, fontWeight:800, color:"#6d28d9", background:"#f5f3ff", border:"1px solid #c4b5fd", borderRadius:7, padding:"4px 12px" }}>{fournRef}</span>
        <button onClick={onLogout} style={{ background:"transparent", border:`1px solid #bbf7d0`, borderRadius:7, color:"#065f46", fontSize:11.5, fontWeight:700, padding:"5px 12px", cursor:"pointer", fontFamily:FONT }}>Déconnexion</button>
      </div>
    </div>
  );
}

function SupplierNav({ view, setView }) {
  const items = [
    ["mailbox", "Boite de reception", "Emails de signature et codes OTP"],
    ["deposit", "Nouveau depot", "Transmettre un document"],
  ];
  return (
    <div style={{ background:"#1f2f58", padding:"10px 24px", display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", borderBottom:"1px solid rgba(255,255,255,.1)" }}>
      <div style={{ color:WH, fontWeight:900, fontSize:14, marginRight:12 }}>SoftSign Fournisseur</div>
      {items.map(([id,label,subtitle]) => <button key={id} onClick={()=>setView(id)} style={{ border:`1px solid ${view===id?"#c4b5fd":"rgba(255,255,255,.18)"}`, borderRadius:8, padding:"8px 12px", background:view===id?"#6d3fd7":"rgba(255,255,255,.07)", color:WH, cursor:"pointer", fontFamily:FONT, textAlign:"left" }}><div style={{ fontWeight:850, fontSize:12.5 }}>{label}</div><div style={{ opacity:.7, fontSize:10.5, marginTop:2 }}>{subtitle}</div></button>)}
    </div>
  );
}

/* ── Horizontal step progress ──────────────────────── */
function Progress({ step }) {
  const steps = [["Import & OCR","Document principal"],["Informations","Détails du document"],["Annexes & Aperçu","Documents joints"],["Envoi","Confirmation"]];
  return (
    <div style={{ background:WH, border:`1px solid ${BD}`, borderRadius:12, padding:"16px 20px", marginBottom:20, display:"flex", alignItems:"flex-start" }}>
      {steps.map(([title, sub], i) => {
        const n = i + 1; const done = step > n; const active = step === n;
        return (
          <div key={n} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center" }}>
            <div style={{ display:"flex", alignItems:"center", width:"100%", marginBottom:10 }}>
              {i > 0 && <div style={{ flex:1, height:2, background:done?GREEN:"#e5e7eb", marginRight:6 }}/>}
              <div style={{ width:32, height:32, borderRadius:"50%", background:done?GREEN:active?ACC2:"#f1f5f9", border:`2px solid ${done?GREEN:active?ACC2:"#e5e7eb"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                {done
                  ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  : <span style={{ fontSize:12, fontWeight:900, color:active?WH:MUT }}>{n}</span>}
              </div>
              {i < steps.length-1 && <div style={{ flex:1, height:2, background:done?GREEN:"#e5e7eb", marginLeft:6 }}/>}
            </div>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:12, fontWeight:800, color:active?ACC2:done?"#059669":MUT }}>{title}</div>
              <div style={{ fontSize:10.5, color:"#94a3b8", marginTop:2 }}>{sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Sticky bottom bar ─────────────────────────────── */
function BottomBar({ onDraft, onNext, nextLabel, nextDisabled }) {
  return (
    <div style={{ position:"sticky", bottom:0, background:WH, borderTop:`1px solid ${BD}`, padding:"12px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", zIndex:20 }}>
      <Btn tone="ghost" onClick={onDraft}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
        Enregistrer brouillon
      </Btn>
      <Btn onClick={onNext} disabled={nextDisabled}>→ {nextLabel}</Btn>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   STEP 1 — Upload & OCR
═══════════════════════════════════════════════════════ */
function Step1Upload({ draft, setDraft, onNext }) {
  const fileRef = useRef(null);
  const [phase, setPhase] = useState("idle"); // idle | loading | ocr | done | error
  const [prog, setProg]   = useState(0);
  const [status, setStatus] = useState("");
  const [dragging, setDragging] = useState(false);
  const generalSettings = readGeneralSettings();
  const allowedFormatIds = new Set(getSoftSignAllowedFormatIds(generalSettings, draft.projectId, draft.site));
  const accept = getSoftSignAccept(generalSettings, draft.projectId, draft.site);
  const acceptedFormats = SS_ALLOWED_FORMATS
    .filter(format => allowedFormatIds.has(format.id))
    .map(format => format.label);

  async function processFile(file) {
    if (!isSoftSignFileAllowed(file, generalSettings, draft.projectId, draft.site)) {
      setPhase("error");
      setStatus(`Format non autorisé. Formats acceptés : ${acceptedFormats.join(", ") || "PDF"}.`);
      return;
    }
    if (file.size > 50 * 1024 * 1024) { setPhase("error"); setStatus("Fichier trop volumineux (max 50 Mo)."); return; }
    setPhase("loading"); setStatus("Lecture du fichier…"); setProg(10);
    try {
      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      const isImage = /^image\//i.test(file.type) || /\.(png|jpe?g|tiff?)$/i.test(file.name);
      let pages = 1;
      let text = "";

      if (isPdf) {
        // Load PDF.js + count pages
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js");
        const lib = window.pdfjsLib;
        lib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
        const ab  = await file.arrayBuffer();
        const pdfDoc = await lib.getDocument({ data: new Uint8Array(ab) }).promise;
        pages = pdfDoc.numPages;
        setProg(25); setStatus("Extraction du texte natif...");
        // Native text extraction (fast)
        try { text = await extractTextFromPDF(file); } catch {}
        setProg(50);
      }

      if (isPdf && text.length < 80) {
        setPhase("ocr"); setStatus("Analyse OCR en cours...");
        try {
          const canvas = await pdfToCanvas(file);
          text = await tesseractOCR(canvas, (p) => setProg(50 + Math.round(p * 0.42)));
        } catch {}
      } else if (isImage) {
        setPhase("ocr"); setStatus("Analyse OCR image en cours...");
        try { text = await tesseractOCR(file, (p) => setProg(30 + Math.round(p * 0.55))); } catch {}
      } else {
        setProg(75); setStatus("Fichier joint. OCR non disponible pour ce format.");
      }
      setProg(94); setStatus("Traitement des données…");
      const parsed   = parseInvoiceText(text);
      const fileB64  = await toBase64(file);
      setDraft(p => ({
        ...p, file, fileB64, fileName: file.name, pages,
        ref:       p.ref       || parsed.numero  || genRef(),
        date:      p.date      || fmtDateISO(parsed.date_doc) || new Date().toISOString().slice(0, 10),
        amount:    p.amount    || parsed.ht    || "",
        amountTtc: p.amountTtc || parsed.total || "",
        ocrData: { text, parsed, confidence: parsed.score, source: "portail_externe" },
        ocrFields: { ref: !!parsed.numero, date: !!parsed.date_doc, amount: !!parsed.ht, amountTtc: !!parsed.total },
      }));
      setProg(100); setPhase("done"); setStatus("Analyse terminée ✓");
      setTimeout(onNext, 700);
    } catch(e) {
      console.error(e); setPhase("error"); setStatus("Erreur lors de l'analyse. Vous pouvez compléter les informations manuellement.");
    }
  }

  const onDrop = (e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files?.[0]; if (f) processFile(f); };

  return (
    <div>
      <h2 style={{ margin:"0 0 4px", color:"#0f172a", fontSize:22, fontWeight:900 }}>Nouveau dépôt de document</h2>
      <p style={{ color:MUT, fontSize:13.5, marginTop:4, marginBottom:20 }}>Importez votre document et renseignez les informations requises pour lancer le circuit de validation</p>
      <Progress step={1} />
      <div style={{ background:WH, border:`1px solid ${BD}`, borderRadius:12, padding:22 }}>
        {/* Card header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:9, background:"#eff6ff", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <b style={{ fontSize:15, color:"#0f172a" }}>Import du document principal</b>
          </div>
          <span style={{ fontSize:11.5, fontWeight:800, color:ACC2, background:"#f5f3ff", border:"1px solid #ddd6fe", borderRadius:6, padding:"3px 10px" }}>Formats configurés</span>
        </div>

        {/* Idle drop zone */}
        {phase === "idle" && (
          <div onClick={() => fileRef.current?.click()}
            onDrop={onDrop} onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
            style={{ border:`2px dashed ${dragging?ACC2:"#c4b5fd"}`, background:dragging?"#f5f3ff":BG, borderRadius:12, padding:"44px 24px", textAlign:"center", cursor:"pointer", transition:"all .2s" }}>
            <input ref={fileRef} type="file" accept={accept} style={{ display:"none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); e.target.value = ""; }} />
            <div style={{ margin:"0 auto 14px", width:56, height:56, color:ACC2 }}>
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 12 15 15"/>
              </svg>
            </div>
            <div style={{ fontSize:15, fontWeight:800, color:"#0f172a" }}>Glissez votre document ici ou cliquez pour parcourir</div>
            <div style={{ color:MUT, fontSize:12.5, marginTop:6 }}>Les PDF et images sont analysés automatiquement par OCR</div>
            <div style={{ display:"flex", gap:8, justifyContent:"center", marginTop:16, flexWrap:"wrap" }}>
              {[acceptedFormats.join(", ") || "PDF", "Max 50 Mo", "Non protégé par mot de passe"].map(t => (
                <span key={t} style={{ fontSize:11.5, color:MUT, background:WH, border:`1px solid ${BD}`, borderRadius:20, padding:"4px 12px" }}>{t}</span>
              ))}
            </div>
          </div>
        )}

        {/* Progress */}
        {(phase==="loading"||phase==="ocr") && (
          <div style={{ textAlign:"center", padding:"44px 24px" }}>
            <div style={{ width:58, height:58, margin:"0 auto 16px" }}>
              <svg width="58" height="58" viewBox="0 0 24 24" fill="none" stroke={ACC2} strokeWidth="1.5" strokeLinecap="round" style={{ animation:"fs-spin 1s linear infinite" }}>
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>
              </svg>
            </div>
            <div style={{ fontSize:14.5, fontWeight:700, color:"#0f172a", marginBottom:10 }}>
              {phase==="ocr" ? "Analyse OCR en cours…" : "Lecture du PDF…"}
            </div>
            <div style={{ maxWidth:340, margin:"0 auto 10px", background:"#f1f5f9", borderRadius:20, overflow:"hidden", height:8 }}>
              <div style={{ height:"100%", background:`linear-gradient(90deg,${ACC},${ACC2})`, width:`${prog}%`, transition:"width .35s ease", borderRadius:20 }}/>
            </div>
            <div style={{ color:MUT, fontSize:12.5 }}>{status}</div>
          </div>
        )}

        {/* Done */}
        {phase==="done" && (
          <div style={{ textAlign:"center", padding:"44px 24px" }}>
            <div style={{ width:60, height:60, borderRadius:"50%", background:"#ecfdf5", border:`2px solid ${GREEN}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div style={{ fontSize:15, fontWeight:800, color:GREEN }}>Analyse terminée</div>
            <div style={{ color:MUT, fontSize:12.5, marginTop:6 }}>{status} — Redirection…</div>
          </div>
        )}

        {/* Error */}
        {phase==="error" && (
          <div style={{ padding:20, background:"#fef2f2", border:`1px solid #fecaca`, borderRadius:10, textAlign:"center" }}>
            <div style={{ color:RED, fontWeight:800, marginBottom:10 }}>⚠ {status}</div>
            <Btn tone="light" onClick={() => { setPhase("idle"); setStatus(""); }}>↺ Réessayer</Btn>
            <span style={{ margin:"0 10px", color:MUT, fontSize:12 }}>ou</span>
            <Btn tone="primary" onClick={onNext}>Compléter manuellement →</Btn>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   STEP 2 — Informations
═══════════════════════════════════════════════════════ */
function Step2Info({ draft, setDraft, onNext, onBack }) {
  const [tab, setTab] = useState("ocr");
  const set = (k, v) => setDraft(p => ({ ...p, [k]: v }));
  const ocr = draft.ocrFields || {};
  const project = INIT_PROJETS.find(p => p.id === draft.projectId) || INIT_PROJETS[0];
  const canNext = draft.ref?.trim() && draft.title?.trim() && draft.type;

  return (
    <div>
      <h2 style={{ margin:"0 0 4px", color:"#0f172a", fontSize:22, fontWeight:900 }}>Informations du document</h2>
      <p style={{ color:MUT, fontSize:13.5, marginTop:4, marginBottom:20 }}>Vérifiez et complétez les informations extraites automatiquement par OCR</p>
      <Progress step={2} />

      <div style={{ background:WH, border:`1px solid ${BD}`, borderRadius:12, padding:22 }}>
        {/* Section header */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
          <div style={{ width:34, height:34, borderRadius:9, background:OCR_BG, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🤖</div>
          <b style={{ fontSize:15, color:"#0f172a" }}>Données du document</b>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", borderBottom:`1px solid ${BD}`, marginBottom:22 }}>
          {[["ocr","✏ Données OCR extraites"],["manual","≡ Saisie manuelle"]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              style={{ padding:"9px 18px", border:"none", background:"transparent", cursor:"pointer", fontFamily:FONT, fontSize:12.5, fontWeight:700, color:tab===id?ACC2:MUT, borderBottom:tab===id?`2.5px solid ${ACC2}`:"2.5px solid transparent", marginBottom:-1 }}>
              {label}
            </button>
          ))}
        </div>

        {/* Fields grid */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
          <Field label="N° de référence interne" ocr={ocr.ref}>
            <input {...stdInput(ocr.ref)} value={draft.ref} onChange={e => set("ref", e.target.value)} placeholder="Ex: CTR-NTIC-2025-047" />
          </Field>
          <Field label="Date du document" ocr={ocr.date}>
            <input type="date" {...stdInput(ocr.date)} value={draft.date} onChange={e => set("date", e.target.value)} />
          </Field>

          <Field label="Titre / Objet du document *" ocr={ocr.title} full>
            <input {...stdInput(ocr.title)} value={draft.title} onChange={e => set("title", e.target.value)}
              placeholder="Ex: Contrat de fourniture de matériels et équipements informatiques — Lot 1 DSI" />
          </Field>

          <Field label="Type de document *">
            <select {...stdInput(false)} value={draft.type} onChange={e => set("type", e.target.value)}>
              {SS_DOC_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </Field>
          <Field label="Montant HT (MGA) *" ocr={ocr.amount}>
            <input type="number" {...stdInput(ocr.amount)} value={draft.amount} onChange={e => set("amount", e.target.value)} placeholder="185000000" />
          </Field>
          <Field label="Montant TTC (MGA)" ocr={ocr.amountTtc}>
            <input type="number" {...stdInput(ocr.amountTtc)} value={draft.amountTtc} onChange={e => set("amountTtc", e.target.value)} placeholder="222000000" />
          </Field>

          <Field label="Devise">
            <select {...stdInput(false)} value={draft.currency} onChange={e => set("currency", e.target.value)}>
              <option value="MGA">MGA — Ariary malgache</option>
              <option value="EUR">EUR — Euro</option>
              <option value="USD">USD — Dollar américain</option>
            </select>
          </Field>
          <Field label="Délai de validité / Durée" ocr={ocr.duree}>
            <input {...stdInput(ocr.duree)} value={draft.duree||""} onChange={e => set("duree", e.target.value)} placeholder="Ex: 12 mois à compter de la signature" />
          </Field>

          <Field label="Projet / Marché concerné *">
            <div style={{ position:"relative" }}>
              <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:14, pointerEvents:"none" }}>👤</span>
              <select {...stdInput(false, { paddingLeft:32 })} value={draft.projectId}
                onChange={e => { const p = INIT_PROJETS.find(x => x.id === e.target.value); setDraft(prev => ({ ...prev, projectId: e.target.value, site: p?.sites?.[0] || "" })); }}>
                {INIT_PROJETS.map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}
              </select>
            </div>
          </Field>
          <Field label="Site / Direction destinataire *">
            <div style={{ position:"relative" }}>
              <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:14, pointerEvents:"none" }}>📍</span>
              <select {...stdInput(false, { paddingLeft:32 })} value={draft.site} onChange={e => set("site", e.target.value)}>
                {(project?.sites || []).map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </Field>
        </div>

        {!canNext && (
          <div style={{ marginTop:16, padding:"8px 14px", background:"#fffbeb", border:`1px solid ${OCR_BD}`, borderRadius:8, fontSize:12, color:ORANGE }}>
            ⚠ Référence, titre et type de document sont requis pour continuer.
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   STEP 3 — Annexes & Aperçu
═══════════════════════════════════════════════════════ */
function PdfPreview({ fileB64, pages }) {
  const canvasRef   = useRef(null);
  const pdfDocRef   = useRef(null);
  const renderIdRef = useRef(0);
  const [curPage, setCurPage] = useState(1);
  const [pageCount, setPageCount] = useState(pages || 1);
  const [loaded, setLoaded]   = useState(false);

  useEffect(() => {
    if (!fileB64) return;
    let alive = true;
    (async () => {
      try {
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js");
        const lib = window.pdfjsLib;
        lib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
        const raw = fileB64.includes(",") ? fileB64.split(",")[1] : fileB64;
        const bin = atob(raw); const ua = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) ua[i] = bin.charCodeAt(i);
        const pdf = await lib.getDocument({ data: ua }).promise;
        if (!alive) return;
        pdfDocRef.current = pdf; setPageCount(pdf.numPages); setLoaded(true);
      } catch(e) { console.error("Preview:", e); }
    })();
    return () => { alive = false; };
  }, [fileB64]);

  useEffect(() => {
    if (!loaded || !pdfDocRef.current || !canvasRef.current) return;
    const id = ++renderIdRef.current;
    (async () => {
      try {
        const page = await pdfDocRef.current.getPage(curPage);
        if (id !== renderIdRef.current) return;
        const vp = page.getViewport({ scale: 1 });
        const scale = Math.min(500 / vp.width, 1.5);
        const sc = page.getViewport({ scale });
        const cv = canvasRef.current; if (!cv || id !== renderIdRef.current) return;
        cv.width = Math.round(sc.width); cv.height = Math.round(sc.height);
        await page.render({ canvasContext: cv.getContext("2d"), viewport: sc }).promise;
      } catch {}
    })();
  }, [loaded, curPage]);

  return (
    <div style={{ background:"#525659", borderRadius:10, overflow:"hidden", position:"relative" }}>
      {pageCount > 1 && loaded && (
        <div style={{ position:"absolute", top:8, left:"50%", transform:"translateX(-50%)", zIndex:10, display:"flex", gap:4, alignItems:"center", background:"rgba(0,0,0,.6)", borderRadius:20, padding:"3px 10px" }}>
          <button onClick={() => setCurPage(p => Math.max(1,p-1))} disabled={curPage<=1}
            style={{ background:"none", border:"none", color:"#fff", cursor:curPage<=1?"default":"pointer", fontSize:16, fontWeight:700, opacity:curPage<=1?.35:1, padding:"0 2px" }}>‹</button>
          <span style={{ fontSize:11, color:"#fff", fontWeight:700, whiteSpace:"nowrap" }}>{curPage} / {pageCount}</span>
          <button onClick={() => setCurPage(p => Math.min(pageCount,p+1))} disabled={curPage>=pageCount}
            style={{ background:"none", border:"none", color:"#fff", cursor:curPage>=pageCount?"default":"pointer", fontSize:16, fontWeight:700, opacity:curPage>=pageCount?.35:1, padding:"0 2px" }}>›</button>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display:"block", width:"100%", maxWidth:520, margin:"0 auto" }} />
      {!loaded && (
        <div style={{ height:300, display:"flex", alignItems:"center", justifyContent:"center", color:"#94a3b8", flexDirection:"column", gap:10 }}>
          <div style={{ fontSize:36 }}>📄</div>
          <div style={{ fontSize:13 }}>{fileB64 ? "Chargement…" : "Aucun PDF"}</div>
        </div>
      )}
    </div>
  );
}

function Step3Annexes({ draft, setDraft, onNext, onBack }) {
  const annexeRef = useRef(null);
  const set = (k, v) => setDraft(p => ({ ...p, [k]: v }));

  async function addAnnexe(file) {
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) return;
    const b64 = await toBase64(file);
    setDraft(p => ({ ...p, annexes: [...(p.annexes || []), { name: file.name, b64, size: file.size, type: file.type }] }));
  }
  function removeAnnexe(i) {
    setDraft(p => ({ ...p, annexes: (p.annexes || []).filter((_, idx) => idx !== i) }));
  }

  return (
    <div>
      <h2 style={{ margin:"0 0 4px", color:"#0f172a", fontSize:22, fontWeight:900 }}>Annexes & Aperçu</h2>
      <p style={{ color:MUT, fontSize:13.5, marginTop:4, marginBottom:20 }}>Vérifiez l'aperçu du document et ajoutez les pièces jointes si nécessaire</p>
      <Progress step={3} />

      <div style={{ display:"grid", gridTemplateColumns:"1fr 380px", gap:18, alignItems:"start" }}>
        {/* PDF Preview */}
        <div style={{ background:WH, border:`1px solid ${BD}`, borderRadius:12, overflow:"hidden" }}>
          <div style={{ padding:"14px 18px", borderBottom:`1px solid ${BD}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:16 }}>📄</span>
              <b style={{ fontSize:13.5, color:"#0f172a" }}>{draft.fileName || "Document"}</b>
            </div>
            <span style={{ fontSize:11.5, color:MUT }}>{draft.pages || 1} page(s)</span>
          </div>
          <PdfPreview fileB64={draft.fileB64} pages={draft.pages} />
        </div>

        {/* Annexes panel */}
        <div style={{ background:WH, border:`1px solid ${BD}`, borderRadius:12, padding:18 }}>
          <h3 style={{ margin:"0 0 14px", fontSize:14, color:"#0f172a" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ verticalAlign:"middle", marginRight:6 }}><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
            Documents joints ({(draft.annexes||[]).length})
          </h3>

          <div onClick={() => annexeRef.current?.click()}
            style={{ border:`2px dashed #c4b5fd`, background:BG, borderRadius:10, padding:"20px 16px", textAlign:"center", cursor:"pointer", marginBottom:16 }}>
            <input ref={annexeRef} type="file" accept=".pdf,.png,.jpg,.jpeg,.xlsx,.docx" style={{ display:"none" }} onChange={e => { addAnnexe(e.target.files?.[0]); e.target.value=""; }} />
            <div style={{ fontSize:22, marginBottom:6 }}>📎</div>
            <div style={{ fontSize:12.5, fontWeight:700, color:ACC2 }}>Ajouter une pièce jointe</div>
            <div style={{ fontSize:11, color:MUT, marginTop:4 }}>PDF, images, Excel · Max 20 Mo</div>
          </div>

          {(draft.annexes||[]).length === 0 ? (
            <div style={{ color:"#94a3b8", fontSize:12.5, textAlign:"center", padding:"10px 0" }}>Aucune pièce jointe</div>
          ) : (
            <div style={{ display:"grid", gap:8 }}>
              {(draft.annexes||[]).map((a, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 11px", background:"#f8fafc", border:`1px solid ${BD}`, borderRadius:8 }}>
                  <span style={{ fontSize:16 }}>📄</span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12.5, fontWeight:700, color:"#0f172a", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{a.name}</div>
                    <div style={{ fontSize:10.5, color:MUT }}>{Math.round(a.size/1024)} Ko</div>
                  </div>
                  <button onClick={() => removeAnnexe(i)} style={{ background:"none", border:"none", color:"#94a3b8", cursor:"pointer", fontSize:16, lineHeight:1, padding:"2px 4px" }}>×</button>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop:18, padding:"12px 14px", background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:9, fontSize:11.5, color:"#065f46", lineHeight:1.6 }}>
            <b>📋 Rappel :</b> Les annexes sont transmises avec le document principal. Elles seront consultables par l'équipe interne.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   STEP 4 — Confirmation & envoi
═══════════════════════════════════════════════════════ */
function Step4Confirm({ draft, account, onBack, fournRef }) {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [docRef, setDocRef] = useState("");
  const [sentDoc, setSentDoc] = useState(null);

  const project = INIT_PROJETS.find(p => p.id === draft.projectId);

  async function submit() {
    if (submitting) return;
    setSubmitting(true);
    try {
      const delegations = read(DELEGATIONS_KEY, INIT_SS_DELEGATIONS_PRO);
      const existingDocs = read(DOCS_KEY, []);
      const generalSettings = readGeneralSettings();
      const trackingRef = nextSoftSignReference(generalSettings, existingDocs, {
        site: draft.site,
        type: draft.type,
        date: new Date().toISOString(),
      });
      const softDoc = createSoftSignDocument({
        draft: { ...draft, ref: trackingRef, projectName: project?.nom || "", deposantId: account.id, deposantName: account.raisonSociale, sender: account.email, pages: draft.pages || 1 },
        workflow: null,
        users: INIT_USERS, delegations, authUser: { id: account.id, nom: account.raisonSociale }, origin: "externe",
      });
      const doc = {
        ...softDoc,
        status: "en_attente_traitement",
        suggestedWorkflowId: "",
        suggestedWorkflowName: "",
        trackingRef,
        externalRef: fournRef,
        annexes: draft.annexes || [],
        audit: [createAudit(account.raisonSociale, "depot_externe", `Dépôt via portail fournisseur — référence ${trackingRef}`), ...(softDoc.audit||[]).slice(1)],
      };
      write(DOCS_KEY, [doc, ...existingDocs]);
      writeAccounts(getAccounts().map(a => a.id === account.id ? {...a, docs: Number(a.docs||0)+1} : a));
      write(NOTIFS_KEY, [{ id:`N-${Date.now()}`, message:`Document externe reçu: ${doc.ref} — ${account.raisonSociale}`, date:new Date().toISOString(), lu:false }, ...read(NOTIFS_KEY,[])]);
      try { localStorage.removeItem(DRAFT_KEY); } catch {}
      setDocRef(doc.ref);
      setSentDoc(doc);
      setSent(true);
    } finally { setSubmitting(false); }
  }

  if (sent) {
    const summaryRows = [
      ["Référence", docRef],
      ["Titre", sentDoc?.title || draft.title || "—"],
      ["Fournisseur", account.raisonSociale || account.nom || "—"],
      ["Date de dépôt", new Date(sentDoc?.createdAt || Date.now()).toLocaleDateString("fr-FR")],
      ["Statut", "Reçu — En attente de traitement"],
    ];

    return (
      <div style={{ textAlign:"center", padding:"54px 20px" }}>
        <div style={{ width:78, height:78, borderRadius:"50%", background:"#ecfdf5", border:`3px solid ${GREEN}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 22px" }}>
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 style={{ color:"#0f172a", margin:"0 0 8px", fontSize:24, fontWeight:950 }}>Dépôt terminé</h2>
        <div style={{ color:MUT, fontSize:13.5, maxWidth:460, margin:"0 auto 22px", lineHeight:1.7 }}>
          Votre document a été enregistré avec succès. La référence ci-dessous permet d’assurer son suivi.
        </div>

        <div style={{ background:"#f8fafc", border:`1px solid ${BD}`, borderRadius:14, padding:18, maxWidth:560, margin:"0 auto 24px", textAlign:"left" }}>
          <div style={{ fontSize:11.5, fontWeight:900, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".08em", marginBottom:10 }}>Résumé</div>
          {summaryRows.map(([label, value]) => (
            <div key={label} style={{ display:"flex", justifyContent:"space-between", gap:16, padding:"9px 0", borderBottom: label === "Statut" ? "none" : `1px solid ${BD}`, fontSize:13 }}>
              <span style={{ color:MUT, fontWeight:700 }}>{label}</span>
              <span style={{ color: label === "Statut" ? GREEN : "#0f172a", fontWeight:900, textAlign:"right", maxWidth:"65%", wordBreak:"break-word" }}>{value}</span>
            </div>
          ))}
        </div>

        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
          <Btn onClick={() => window.location.reload()} style={{ padding:"11px 18px" }}>+ Nouveau document</Btn>
          <Btn tone="light" onClick={() => window.location.reload()} style={{ padding:"11px 18px" }}>Fermer</Btn>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ margin:"0 0 4px", color:"#0f172a", fontSize:22, fontWeight:900 }}>Confirmation & envoi</h2>
      <p style={{ color:MUT, fontSize:13.5, marginTop:4, marginBottom:20 }}>Vérifiez le récapitulatif avant de soumettre votre document</p>
      <Progress step={4} />

      <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:18, alignItems:"start" }}>
        {/* Summary */}
        <div style={{ background:WH, border:`1px solid ${BD}`, borderRadius:12, padding:22 }}>
          <h3 style={{ margin:"0 0 16px", color:"#0f172a", fontSize:15 }}>📋 Récapitulatif du document</h3>
          <div style={{ display:"grid", gap:10 }}>
            {[
              ["Référence",    draft.ref],
              ["Date",         draft.date ? new Date(draft.date).toLocaleDateString("fr-FR",{day:"2-digit",month:"long",year:"numeric"}) : "—"],
              ["Titre",        draft.title],
              ["Type",         SS_DOC_TYPES.find(t => t.id === draft.type)?.label || draft.type],
              ["Montant HT",   draft.amount    ? `${fmtNum(draft.amount)} ${draft.currency}`    : "—"],
              ["Montant TTC",  draft.amountTtc ? `${fmtNum(draft.amountTtc)} ${draft.currency}` : "—"],
              ["Durée",        draft.duree || "—"],
              ["Projet",       project?.nom || "—"],
              ["Site",         draft.site || "—"],
              ["Pièces jointes", `${(draft.annexes||[]).length} fichier(s)`],
              ["Pages",        `${draft.pages || 1} page(s)`],
            ].map(([label, val]) => (
              <div key={label} style={{ display:"flex", gap:10, padding:"8px 0", borderBottom:`1px solid #f1f5f9` }}>
                <span style={{ fontSize:12.5, color:MUT, fontWeight:700, width:130, flexShrink:0 }}>{label}</span>
                <span style={{ fontSize:12.5, color:"#0f172a", fontWeight:600, flex:1 }}>{val || "—"}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div style={{ display:"grid", gap:16, alignContent:"start" }}>
          <div style={{ background:WH, border:`1px solid ${BD}`, borderRadius:12, padding:18 }}>
            <div style={{ fontSize:12.5, color:MUT, marginBottom:14, lineHeight:1.6 }}>
              En soumettant ce document, vous certifiez que les informations fournies sont exactes et complètes.
            </div>
            <Btn onClick={submit} disabled={submitting} style={{ width:"100%", justifyContent:"center", padding:"12px 16px" }}>
              {submitting
                ? <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation:"fs-spin 1s linear infinite" }}><path d="M21 12a9 9 0 1 1-9-9"/></svg> Envoi…</>
                : <>✅ Soumettre le document</>}
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   DEPOSIT WIZARD — orchestrateur des 4 étapes
═══════════════════════════════════════════════════════ */
function AuthField({ label, value, onChange, type = "text", placeholder }) {
  return (
    <label style={{ display:"block" }}>
      <span style={{ display:"block", color:"rgba(255,255,255,.72)", fontSize:12, fontWeight:800, marginBottom:7 }}>
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width:"100%",
          boxSizing:"border-box",
          minHeight:42,
          borderRadius:8,
          border:"1px solid rgba(255,255,255,.16)",
          background:"rgba(255,255,255,.11)",
          color:WH,
          outline:"none",
          padding:"0 14px",
          fontFamily:FONT,
          fontSize:14,
          fontWeight:700,
          boxShadow:"inset 0 1px 0 rgba(255,255,255,.08)",
        }}
      />
    </label>
  );
}

function AuthNotice({ notice }) {
  if (!notice) return null;
  const isError = notice.tone === "error";
  return (
    <div style={{
      marginTop:16,
      borderRadius:8,
      padding:"11px 13px",
      border:`1px solid ${isError ? "rgba(248,113,113,.45)" : "rgba(45,212,191,.45)"}`,
      background:isError ? "rgba(127,29,29,.22)" : "rgba(20,184,166,.16)",
      color:isError ? "#fecaca" : "#bdfcf3",
      fontSize:12.5,
      fontWeight:800,
      lineHeight:1.45,
    }}>
      {notice.text}
    </div>
  );
}

function AuthDots({ active }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:24 }}>
      {[0, 1, 2].map((dot) => (
        <span key={dot} style={{
          width:dot === active ? 20 : 7,
          height:7,
          borderRadius:999,
          background:dot === active ? "#14e3c8" : "rgba(255,255,255,.2)",
          transition:"all .18s",
        }} />
      ))}
    </div>
  );
}

function AuthPage({ onAuth }) {
  const [tab, setTab] = useState("register");
  const [form, setForm] = useState({ raisonSociale:"", identification:"", email:"" });
  const [notice, setNotice] = useState(null);
  const isRegister = tab === "register";
  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  function switchTab(next) {
    setTab(next);
    setNotice(null);
  }

  function baseError(requireEmail) {
    if (!form.raisonSociale.trim()) return "La raison sociale est obligatoire.";
    if (!form.identification.trim()) return "L’identification fiscale / CIN est obligatoire.";
    if (requireEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return "L’email professionnel est obligatoire.";
    return "";
  }

  function register(e) {
    e.preventDefault();
    const error = baseError(true);
    if (error) { setNotice({ tone:"error", text:error }); return; }

    const existing = findAccountByIdentity(form.raisonSociale, form.identification);
    if (existing) {
      write(PORTAL_SESSION_KEY, existing);
      setNotice({
        tone:isSoftSignActive(existing) ? "info" : "pending",
        text:isSoftSignActive(existing)
          ? "Ce compte fournisseur existe déjà. Vous pouvez vous connecter avec la raison sociale et l’identification fiscale / CIN."
          : SOFTSIGN_PENDING_MESSAGE,
      });
      return;
    }

    const account = normalizeAccount({
      id:`EXT-${Date.now()}`,
      raisonSociale:form.raisonSociale.trim(),
      login:form.raisonSociale.trim(),
      email:form.email.trim(),
      mail:form.email.trim(),
      nif:form.identification.trim(),
      identificationFiscale:form.identification.trim(),
      status:"en_attente",
      moduleAccess:{ softdocs:"en_attente", softsign:"en_attente" },
      createdAt:new Date().toISOString(),
      docs:0,
    });
    writeAccounts([account, ...getAccounts()]);
    write(PORTAL_SESSION_KEY, account);
    write(NOTIFS_KEY, [
      { id:`N-${Date.now()}`, type:"fournisseur", message:`Nouveau compte fournisseur SoftSign à valider : ${account.raisonSociale}`, date:new Date().toISOString(), lu:false },
      ...read(NOTIFS_KEY, []),
    ]);
    setNotice({ tone:"pending", text:SOFTSIGN_PENDING_MESSAGE });
  }

  function login(e) {
    e.preventDefault();
    const error = baseError(false);
    if (error) { setNotice({ tone:"error", text:error }); return; }

    const account = findAccountByIdentity(form.raisonSociale, form.identification);
    if (!account) {
      setNotice({ tone:"error", text:"Compte fournisseur introuvable. Vérifiez la raison sociale et l’identification fiscale / CIN." });
      return;
    }
    write(PORTAL_SESSION_KEY, account);
    if (!isSoftSignActive(account)) {
      setNotice({ tone:"pending", text:SOFTSIGN_PENDING_MESSAGE });
      return;
    }
    onAuth(account);
  }

  return (
    <div style={{
      height:"100vh",
      overflowY:"auto",
      background:"linear-gradient(145deg,#172856 0%,#18305e 55%,#13244b 100%)",
      fontFamily:FONT,
      color:WH,
      boxSizing:"border-box",
    }}>
      <div style={{ width:"100%", maxWidth:440, margin:"0 auto", padding:"28px 16px", boxSizing:"border-box", display:"flex", flexDirection:"column", alignItems:"center" }}>
        <img src="/softappli-logo.png" alt="Soft APPLI" style={{ width:112, height:"auto", objectFit:"contain", marginBottom:10 }} />
        <div style={{ color:"rgba(255,255,255,.62)", fontSize:12.5, fontWeight:700, marginBottom:30 }}>
          Portail Fournisseurs
        </div>
        <div style={{
          width:"100%",
          background:"rgba(255,255,255,.08)",
          border:"1px solid rgba(255,255,255,.12)",
          borderRadius:16,
          boxShadow:"0 24px 70px rgba(0,0,0,.22)",
          padding:"32px 30px",
          boxSizing:"border-box",
          backdropFilter:"blur(12px)",
        }}>
          <AuthDots active={isRegister ? 0 : 1} />
          <h1 style={{ margin:"0 0 8px", textAlign:"center", fontSize:24, lineHeight:1.15, fontWeight:900 }}>
            {isRegister ? "Créer votre compte" : "Se connecter"}
          </h1>
          <p style={{ margin:"0 auto 30px", color:"rgba(255,255,255,.58)", fontSize:13, fontWeight:700, lineHeight:1.55, textAlign:"center", maxWidth:330 }}>
            {isRegister
              ? "Votre compte unique vous donne accès aux modules SoftDocs et SoftSign"
              : "Utilisez vos identifiants fournisseur pour accéder à votre espace"}
          </p>

          <form onSubmit={isRegister ? register : login} style={{ display:"grid", gap:17 }}>
            <AuthField
              label="Raison sociale"
              value={form.raisonSociale}
              onChange={set("raisonSociale")}
              placeholder={isRegister ? "SARL Construct Madagascar" : "Entrez votre raison sociale"}
            />
            <AuthField
              label="Identification fiscale / CIN"
              value={form.identification}
              onChange={set("identification")}
              placeholder={isRegister ? "101-234-567-89" : "Entrez votre NIF ou CIN"}
            />
            {isRegister && (
              <AuthField
                label="Email professionnel"
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="votre@email.com"
              />
            )}

            <button type="submit" style={{
              width:"100%",
              minHeight:44,
              border:0,
              borderRadius:8,
              background:"linear-gradient(90deg,#12c8aa 0%,#07a9d6 100%)",
              color:WH,
              fontFamily:FONT,
              fontSize:15,
              fontWeight:900,
              cursor:"pointer",
              marginTop:8,
              boxShadow:"0 10px 22px rgba(5,169,214,.18)",
            }}>
              {isRegister ? "Créer mon compte →" : "Se connecter →"}
            </button>
          </form>

          <AuthNotice notice={notice} />
          <div style={{
            marginTop:18,
            paddingTop:isRegister ? 0 : 20,
            borderTop:isRegister ? "none" : "1px solid rgba(255,255,255,.08)",
            textAlign:"center",
            color:"rgba(255,255,255,.5)",
            fontSize:12.5,
            fontWeight:800,
          }}>
            {isRegister ? "Déjà un compte ? " : "Pas encore de compte ? "}
            <button type="button" onClick={() => switchTab(isRegister ? "login" : "register")} style={{
              border:0,
              background:"transparent",
              color:"#14e3c8",
              fontFamily:FONT,
              fontSize:12.5,
              fontWeight:900,
              cursor:"pointer",
              padding:0,
            }}>
              {isRegister ? "Se connecter" : "Créer un compte"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DepositWizard({ account, onLogout }) {
  const [portalView, setPortalView] = useState("mailbox");
  const [step, setStep] = useState(1);
  const [fournRef] = useState(genFournRef);
  const [draft, setDraft] = useState(() => {
    const initial = {
      file: null, fileB64: null, fileName: "", pages: 1,
      ocrData: null, ocrFields: {},
      ref: "", date: new Date().toISOString().slice(0, 10), title: "",
      type: "contrat", amount: "", amountTtc: "", currency: "MGA", duree: "",
      projectId: account.projectId || INIT_PROJETS[0]?.id || "",
      site: account.site || INIT_PROJETS[0]?.sites?.[0] || "",
      annexes: [],
    };
    const saved = read(DRAFT_KEY, null);
    return saved?.accountId === account.id && saved.draft ? { ...initial, ...saved.draft, file: null } : initial;
  });
  const set = (k, v) => setDraft(p => ({ ...p, [k]: v }));

  const STEP_LABELS = ["Continuer — Informations","Continuer — Annexes & Aperçu","Continuer — Confirmation","Soumettre le document"];
  const nextLabel   = step < 4 ? STEP_LABELS[step - 1] : STEP_LABELS[3];
  const nextDisabled = step === 1 ? !draft.fileB64 : step === 2 ? !draft.ref?.trim() || !draft.title?.trim() : false;

  function saveDraft() {
    write(DRAFT_KEY, { accountId: account.id, savedAt: new Date().toISOString(), draft: { ...draft, file: null } });
    alert("Brouillon sauvegardé localement.");
  }

  return (
    <div style={{ minHeight:"100vh", background:BG, fontFamily:FONT, display:"flex", flexDirection:"column" }}>
      <style>{`@keyframes fs-spin { to { transform: rotate(360deg); } }`}</style>

      <SupplierNav view={portalView} setView={setPortalView} />

      {/* Top breadcrumb nav */}
      {portalView === "deposit" && <StepNav step={step} />}

      {/* Account banner */}
      <AccountBanner account={account} onLogout={onLogout} fournRef={fournRef} />

      {/* Main content */}
      <main style={{ flex:1, maxWidth:1100, width:"100%", margin:"0 auto", padding:"24px 20px 0" }}>
        {portalView === "mailbox" && <ExternalSignatureMailbox recipientEmail={account.email} title="Boite de reception SoftSign" emptyMessage="Aucune demande de signature n'est disponible pour ce compte fournisseur." />}
        {portalView === "deposit" && step === 1 && <Step1Upload draft={draft} setDraft={setDraft} onNext={() => setStep(2)} />}
        {portalView === "deposit" && step === 2 && <Step2Info   draft={draft} setDraft={setDraft} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
        {portalView === "deposit" && step === 3 && <Step3Annexes draft={draft} setDraft={setDraft} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
        {portalView === "deposit" && step === 4 && <Step4Confirm draft={draft} account={account} onBack={() => setStep(3)} fournRef={fournRef} />}
      </main>

      {/* Sticky bottom bar (hidden on step 4 done) */}
      {portalView === "deposit" && step < 4 && (
        <BottomBar
          onDraft={saveDraft}
          onNext={() => setStep(s => Math.min(4, s + 1))}
          nextLabel={nextLabel}
          nextDisabled={nextDisabled}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ROOT — Auth gate
═══════════════════════════════════════════════════════ */
export default function FournisseurSign({ initialAccount = null, onBack }) {
  const [account, setAccount] = useState(() => {
    const saved = read(SESSION_KEY, null) || initialAccount || read(PORTAL_SESSION_KEY, null);
    if (!saved) return null;
    const fresh = resolveAccount(saved);
    return isSoftSignActive(fresh) ? fresh : null;
  });

  useEffect(() => {
    if (!account) return;
    write(SESSION_KEY, account);
  }, [account]);

  useEffect(() => {
    const saved = read(SESSION_KEY, null);
    if (saved && !account) {
      try { localStorage.removeItem(SESSION_KEY); } catch {}
    }
  }, [account]);

  function handleAuth(a) {
    const normalized = normalizeAccount(a);
    write(SESSION_KEY, normalized);
    write(PORTAL_SESSION_KEY, normalized);
    setAccount(normalized);
  }
  function handleLogout() {
    try { localStorage.removeItem(SESSION_KEY); localStorage.removeItem(PORTAL_SESSION_KEY); } catch {}
    setAccount(null);
    onBack?.();
  }

  if (!account) return <AuthPage onAuth={handleAuth} />;
  return <DepositWizard account={account} onLogout={handleLogout} />;
}
