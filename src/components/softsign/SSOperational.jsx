"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Edit3,
  Eye,
  FileArchive,
  FileImage,
  FileSpreadsheet,
  FileText as FileTextIcon,
  Grid2X2,
  MoreHorizontal,
  Plus,
  Save,
  Settings2,
  X,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { extractTextFromPDF, pdfToCanvas, tesseractOCR, parseInvoiceText } from "../documents/OCRScanner";
import {
  INIT_SS_DOCUMENTS_PRO,
  INIT_SS_WORKFLOWS_PRO,
  INIT_SS_EXTERNAL_ACCOUNTS,
  INIT_SS_SIGNATURES_PRO,
  INIT_SS_DELEGATIONS_PRO,
  SS_DOC_TYPES,
  getSoftSignDocumentTypes,
  SS_STATUS,
  SS_STEP_STATUS,
  SS_ALLOWED_FORMATS,
  SS_DEFAULT_OTP,
  SS_DEFAULT_LICENSE,
  SS_DEFAULT_GENERAL_SETTINGS,
  buildSoftSignReferenceFormat,
  getAction,
  getSoftSignAccept,
  getSoftSignAllowedFormatIds,
  isZoneRequired,
  isSoftSignFileAllowed,
  formatMoney,
  isoDate,
  initials,
  userName,
  getProjectName,
  getSitesForProject,
  suggestWorkflow,
  hydrateWorkflowSteps,
  createSoftSignDocument,
  formatSoftSignReference,
  normalizeSoftSignGeneralSettings,
  activeSteps,
  activeTaskForUser,
  isOverdue,
  daysLate,
  completeStep,
  rejectDocument,
  createAudit,
  addDocumentReminder,
  normalizeReminderConfig,
} from "./softsignCore";
import {
  applyExternalRequestToDocument,
  ExternalSignatureMailbox,
  ExternalSignatureRequestModal,
  ExternalSignatureStatusPanel,
  effectiveExternalStatus,
  getExternalSignatureRequests,
  getExternalRequestById,
  isExternalWorkflowBlocked,
  reactivateExternalSignature,
  remindExternalSignature,
} from "./ExternalSignature";
import { canAccessSoftSignView } from "./softsignAccess";

const ACC = "#6d3fd7";
const ACC2 = "#7c3aed";
const BLUE = "#2563eb";
const GREEN = "#059669";
const RED = "#dc2626";
const ORANGE = "#f59e0b";
const MUT = "var(--ss-muted, #64748b)";
const BD = "var(--ss-border, #e3e6ea)";
const BG = "var(--ss-bg, #f6f4fb)";
const WH = "var(--ss-card, #fff)";
const FONT = "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif";

const EXT_KEY = "externalAccounts";
const LEGACY_EXT_KEY = "ss_externalAccounts";
const DOCS_KEY = "ss_docs";

function readRaw(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeRaw(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function isFileUrlSource(source = "") {
  const value = String(source || "");
  return value.startsWith("/") || /^https?:\/\//i.test(value);
}

function filePreviewSrc(source = "") {
  const value = String(source || "");
  if (!value) return "";
  if (value.startsWith("data:") || isFileUrlSource(value)) return value;
  return `data:application/pdf;base64,${value}`;
}

function canInlinePreview(doc = {}) {
  const source = String(doc.fileB64 || "").toLowerCase();
  const name = String(doc.fileName || "").toLowerCase();
  return source.startsWith("data:application/pdf") || /\.pdf(?:$|\?)/.test(source) || name.endsWith(".pdf");
}

function downloadFileSource(source, filename = "document.pdf") {
  const href = filePreviewSrc(source);
  if (!href) return;
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function resolveSoftSignDocumentSource(doc = {}) {
  const directSource = doc.finalFileB64 || doc.signedFileB64 || doc.fileB64 || doc.fileUrl;
  if (directSource) return directSource;

  const searchKey = `${doc.ref || ""} ${doc.fileName || ""}`.toLowerCase();
  if (searchKey.includes("fact-2026-001") || searchKey.includes("fact 001")) {
    return "/softsign/samples/fact-001.pdf";
  }
  if (searchKey.includes("fact-2026-002") || searchKey.includes("fact 002")) {
    return "/softsign/samples/fact-002.pdf";
  }
  return "";
}

async function loadPdfDocument(lib, source) {
  const value = String(source || "");
  if (isFileUrlSource(value)) return lib.getDocument(value).promise;
  const raw = value.replace(/^data:[^;]+;base64,/, "");
  const bin = atob(raw);
  const ua = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) ua[i] = bin.charCodeAt(i);
  return lib.getDocument({ data: ua }).promise;
}

function Button({ children, onClick, tone = "light", disabled, type = "button", style }) {
  const palette = {
    primary: { bg: ACC2, fg: WH, border: ACC2 },
    blue: { bg: BLUE, fg: WH, border: BLUE },
    green: { bg: GREEN, fg: WH, border: GREEN },
    red: { bg: RED, fg: WH, border: RED },
    orange: { bg: ORANGE, fg: WH, border: ORANGE },
    light: { bg: WH, fg: "#334155", border: BD },
    ghost: { bg: "transparent", fg: ACC2, border: "transparent" },
  }[tone];
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        minHeight: 34,
        padding: "8px 14px",
        borderRadius: 8,
        border: `1px solid ${palette.border}`,
        background: disabled ? "#e2e8f0" : palette.bg,
        color: disabled ? "#94a3b8" : palette.fg,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: FONT,
        fontSize: 12.5,
        fontWeight: 750,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function Card({ children, style, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: WH,
        border: `1px solid ${BD}`,
        borderRadius: 10,
        boxShadow: "0 2px 10px rgba(15,23,42,.04)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Field({ label, required, children, full }) {
  return (
    <label style={{ display: "block", gridColumn: full ? "1 / -1" : undefined }}>
      <span style={{ display: "block", fontSize: 11.5, fontWeight: 800, color: "#334155", marginBottom: 5 }}>
        {label} {required && <span style={{ color: RED }}>*</span>}
      </span>
      {children}
    </label>
  );
}

const inputStyle = {
  width: "100%",
  height: 38,
  borderRadius: 8,
  border: `1px solid ${BD}`,
  padding: "0 11px",
  fontFamily: FONT,
  fontSize: 13,
  outline: "none",
  background: WH,
  boxSizing: "border-box",
};

function TextArea(props) {
  return (
    <textarea
      {...props}
      style={{
        ...inputStyle,
        height: "auto",
        minHeight: 72,
        resize: "vertical",
        paddingTop: 9,
        ...props.style,
      }}
    />
  );
}

function StatusBadge({ status }) {
  const st = SS_STATUS[status] || { label: status || "-", color: MUT, bg: "#f1f5f9" };
  return <span style={{ fontSize: 11, fontWeight: 800, color: st.color, background: st.bg, padding: "3px 9px", borderRadius: 20 }}>{st.label}</span>;
}

function StepBadge({ status }) {
  const st = SS_STEP_STATUS[status] || SS_STEP_STATUS.pending;
  return <span style={{ fontSize: 10.5, fontWeight: 800, color: st.color, background: st.bg, padding: "3px 9px", borderRadius: 20 }}>{st.label}</span>;
}

function ActionBadge({ action }) {
  const act = getAction(action);
  return <span style={{ fontSize: 11, fontWeight: 800, color: act.color, background: `${act.color}14`, padding: "3px 9px", borderRadius: 20 }}>{act.label}</span>;
}

function MiniAvatar({ name, color = ACC2 }) {
  return (
    <span style={{ width: 31, height: 31, borderRadius: 10, background: `${color}16`, color, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, flexShrink: 0 }}>
      {initials(name).toUpperCase()}
    </span>
  );
}

function ProgressStepper({ steps, current }) {
  return (
    <Card style={{ padding: "20px 26px", display: "grid", gridTemplateColumns: `repeat(${steps.length}, 1fr)`, gap: 16, alignItems: "center" }}>
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={s.title} style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: done ? "#10b981" : active ? ACC2 : WH, color: done || active ? WH : ACC2, border: `2px solid ${done ? "#10b981" : active ? `${ACC2}44` : "#c4b5fd"}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>
              {done ? "✓" : i + 1}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 850, color: "#0f172a" }}>{s.title}</div>
              <div style={{ fontSize: 11.5, color: "#94a3b8", lineHeight: 1.35 }}>{s.sub}</div>
            </div>
            {i < steps.length - 1 && <div style={{ height: 2, flex: 1, background: done ? "#10b981" : "#e5e7eb", marginLeft: 8 }} />}
          </div>
        );
      })}
    </Card>
  );
}

function Modal({ title, subtitle, onClose, children, footer, width = 760 }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.52)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: 18 }}>
      <div style={{ width: "100%", maxWidth: width, maxHeight: "92vh", overflow: "hidden", background: WH, borderRadius: 14, boxShadow: "0 24px 80px rgba(0,0,0,.24)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BD}`, display: "flex", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#0f172a" }}>{title}</div>
            {subtitle && <div style={{ fontSize: 12, color: MUT, marginTop: 2 }}>{subtitle}</div>}
          </div>
          <button onClick={onClose} style={{ border: "none", background: "transparent", cursor: "pointer", color: MUT, fontSize: 22 }}>×</button>
        </div>
        <div style={{ padding: 20, overflowY: "auto" }}>{children}</div>
        {footer && <div style={{ padding: "12px 20px", borderTop: `1px solid ${BD}`, background: "#fafafa", display: "flex", justifyContent: "flex-end", gap: 10 }}>{footer}</div>}
      </div>
    </div>
  );
}

function FileDrop({ fileName, onFile, accept = ".pdf,.png,.jpg,.jpeg", label }) {
  const ref = useRef(null);
  const [drag, setDrag] = useState(false);
  const isImageMode = accept && !accept.includes(".pdf");
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); if (e.dataTransfer.files?.[0]) onFile(e.dataTransfer.files[0]); }}
      onClick={() => ref.current?.click()}
      style={{ border: `2px dashed ${drag || fileName ? ACC2 : "#c4b5fd"}`, borderRadius: 12, minHeight: isImageMode ? 120 : 170, background: drag ? "#f5f3ff" : "#faf7ff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", textAlign: "center", padding: 22 }}
    >
      <input ref={ref} type="file" accept={accept} style={{ display: "none" }} onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
      {label ? label : (
        <>
          <div style={{ fontSize: 34, color: ACC2, marginBottom: 8 }}>{isImageMode ? "🖼" : "PDF"}</div>
          <div style={{ fontSize: 14, fontWeight: 850, color: "#0f172a" }}>{fileName || "Glissez votre fichier ici ou cliquez pour parcourir"}</div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 5 }}>{isImageMode ? "PNG, JPG · Fond transparent recommandé · Max 2 Mo" : "OCR automatique, PDF natif ou scanné, max recommandé 50 Mo"}</div>
        </>
      )}
    </div>
  );
}

async function runOcrForFile(file, setOcrStatus) {
  const isPDF = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  const isImage = /^image\//i.test(file.type) || /\.(png|jpe?g|tiff?|bmp|webp)$/i.test(file.name);
  let text = "";
  if (isPDF) {
    setOcrStatus("Extraction du texte PDF natif...");
    try {
      text = await extractTextFromPDF(file);
    } catch {
      text = "";
    }
    if (!text || text.replace(/\s/g, "").length < 40) {
      setOcrStatus("PDF scanne detecte - OCR Tesseract...");
      const canvas = await pdfToCanvas(file);
      text = await tesseractOCR(canvas);
    }
  } else if (isImage) {
    setOcrStatus("OCR image en cours...");
    text = await tesseractOCR(file);
  }
  return parseInvoiceText(text || "");
}

function getFilteredDocs(docs, view, authUser) {
  const userId = authUser?.id;
  if (view === "ss-docs-my" || view === "ss-tous-docs") return view === "ss-docs-my" ? docs.filter((d) => d.deposantId === userId || d.author === authUser?.nom) : docs;
  if (view === "ss-internes" || view === "ss-docs-internal") return docs.filter((d) => d.origin === "interne");
  if (view === "ss-externes" || view === "ss-docs-external") return docs.filter((d) => d.origin === "externe" || d.status === "en_attente_traitement");
  if (view === "ss-docs-to-treat" || view === "ss-validation" || view === "ss-signature") return docs.filter((d) => activeTaskForUser(d, userId) || activeSteps(d).length);
  if (view === "ss-docs-received") return docs.filter((d) => activeTaskForUser(d, userId) || (d.status === "en_cours" && activeSteps(d).length));
  if (view === "ss-docs-progress" || view === "ss-en-validation") return docs.filter((d) => ["en_cours", "en_attente_signature_externe", "signe_tiers"].includes(d.status));
  if (view === "ss-signes") return docs.filter((d) => d.status === "signe" || d.status === "termine" || d.status === "signe_tiers");
  if (view === "ss-rejetes") return docs.filter((d) => d.status === "rejete");
  if (view === "ss-archives") return docs.filter((d) => d.status === "archive" || d.status === "termine");
  return docs;
}

export default function SSOperational(props) {
  const app = useApp();
  const {
    view,
    setView,
    docs,
    setDocs,
    workflows,
    setWorkflows,
    notifs,
    setNotifs,
    externalAccounts,
    setExternalAccounts,
    signatures,
    setSignatures,
    delegations,
    setDelegations,
    otpConfig,
    setOtpConfig,
    license,
    setLicense,
    generalSettings,
    setGeneralSettings,
    audit,
    setAudit,
    userSettings = {},
    setUserSettings,
  } = props;
  const { authUser, users, setUsers, projets, docs: softDocs, setDocs: setSoftDocs } = app;
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [actionDoc, setActionDoc] = useState(null);
  const [extProcessDoc, setExtProcessDoc] = useState(null);
  const [emailPreviewDoc, setEmailPreviewDoc] = useState(null);

  const syncExternal = () => setExternalAccounts(readRaw(EXT_KEY, readRaw(LEGACY_EXT_KEY, externalAccounts || INIT_SS_EXTERNAL_ACCOUNTS)));
  const syncDocs = () => setDocs(readRaw(DOCS_KEY, docs || INIT_SS_DOCUMENTS_PRO));

  if (!canAccessSoftSignView(authUser, view)) {
    return (
      <div style={{ fontFamily: FONT, maxWidth: 620 }}>
        <Card style={{ padding: 24 }}>
          <h2 style={{ marginTop: 0 }}>Acces refuse</h2>
          <p style={{ color: MUT, lineHeight: 1.6 }}>Votre role ne permet pas d&apos;ouvrir cette fonctionnalite SoftSign.</p>
          <Button tone="primary" onClick={() => setView("ss-dashboard")}>Retour au tableau de bord</Button>
        </Card>
      </div>
    );
  }

  function handleDocSaved(updated) {
    setDocs((p) => p.map((d) => d.id === updated.id ? updated : d));
    setAudit((p) => [...(updated.audit || []).slice(-3), ...p].slice(0, 300));
    if (["termine", "signe"].includes(updated.status)) {
      const wf = workflows.find((w) => w.id === updated.workflowId);
      const lastStep = (updated.steps || []).slice().reverse().find((s) => s.status === "complete");
      if (wf?.autoSendToDeposant || lastStep?.sendToDeposant) {
        const sentAt = new Date().toISOString();
        setDocs((p) => p.map((d) => d.id === updated.id ? { ...d, emailSentAt: sentAt } : d));
        setAudit((p) => [createAudit("Système SoftSign", "email_envoye_deposant",
          `Email envoyé automatiquement à ${updated.deposantEmail || updated.deposantName || "le déposant"} — Document signé + Certificat de signature + Lien de consultation`), ...p].slice(0, 300));
        setNotifs((p) => [{
          id: `N-${Date.now()}`, type: "email", lu: false, date: sentAt,
          message: `✉ Email envoyé au déposant — ${updated.ref} finalisé · Document signé + Certificat`,
        }, ...p]);
        setEmailPreviewDoc({ ...updated, emailSentAt: sentAt });
      }
    }
  }

  if (view === "ss-depot" || view === "ss-upload") {
    return <DepositWizard {...{ docs, setDocs, workflows, setWorkflows, notifs, setNotifs, audit, setAudit, signatures, delegations, authUser, users, projets, setView, generalSettings }} />;
  }
  if (view === "ss-dashboard" || !view?.startsWith("ss-")) {
    return <DashboardView docs={docs} setView={setView} authUser={authUser} users={users} audit={audit} onAction={(doc) => setActionDoc(doc)} />;
  }
  if (view === "ss-docs-my") {
    return <UnifiedDocModule moduleId="ss-docs-my" docs={docs} setDocs={setDocs} authUser={authUser} users={users} workflows={workflows} projets={projets} signatures={signatures} otpConfig={otpConfig} externalAccounts={externalAccounts} onRefresh={syncDocs} setAudit={setAudit} setNotifs={setNotifs} />;
  }
  if (view === "ss-urgent") {
    return (
      <>
        <UrgentActionsView docs={docs} setDocs={setDocs} authUser={authUser} users={users} signatures={signatures} otpConfig={otpConfig}
          onSave={(updated) => { handleDocSaved(updated); }} setNotifs={setNotifs} setView={setView} />
        {actionDoc && <ActionModal doc={actionDoc} users={users} authUser={authUser} signatures={signatures} otpConfig={otpConfig} onClose={() => setActionDoc(null)} onSave={(updated) => { handleDocSaved(updated); setActionDoc(null); }} />}
        {emailPreviewDoc && <EmailPreviewModal doc={emailPreviewDoc} authUser={authUser} workflows={workflows} onClose={() => setEmailPreviewDoc(null)} />}
      </>
    );
  }
  if (view === "ss-docs-received") {
    return <UnifiedDocModule moduleId="ss-docs-received" docs={docs} setDocs={setDocs} authUser={authUser} users={users} workflows={workflows} projets={projets} signatures={signatures} otpConfig={otpConfig} externalAccounts={externalAccounts} onRefresh={syncDocs} setAudit={setAudit} setNotifs={setNotifs} />;
  }
  if (view === "ss-docs-progress") {
    return <UnifiedDocModule moduleId="ss-docs-progress" docs={docs} setDocs={setDocs} authUser={authUser} users={users} workflows={workflows} projets={projets} signatures={signatures} otpConfig={otpConfig} externalAccounts={externalAccounts} onRefresh={syncDocs} setAudit={setAudit} setNotifs={setNotifs} />;
  }
  if (view === "ss-rejetes") {
    return <UnifiedDocModule moduleId="ss-rejetes" docs={docs} setDocs={setDocs} authUser={authUser} users={users} workflows={workflows} projets={projets} signatures={signatures} otpConfig={otpConfig} externalAccounts={externalAccounts} onRefresh={syncDocs} setAudit={setAudit} setNotifs={setNotifs} />;
  }
  if (view === "ss-archives" || view === "ss-certificats") {
    return <UnifiedDocModule moduleId="ss-archives" docs={docs} setDocs={setDocs} authUser={authUser} users={users} workflows={workflows} projets={projets} signatures={signatures} otpConfig={otpConfig} externalAccounts={externalAccounts} delegations={delegations} onRefresh={syncDocs} setAudit={setAudit} setNotifs={setNotifs} />;
  }
  if (view === "ss-docs-external") {
    return <UnifiedDocModule moduleId="ss-docs-external" docs={docs} setDocs={setDocs} authUser={authUser} users={users} workflows={workflows} setWorkflows={setWorkflows} projets={projets} signatures={signatures} otpConfig={otpConfig} externalAccounts={externalAccounts} delegations={delegations} notifs={notifs} setNotifs={setNotifs} audit={audit} onRefresh={syncDocs} setAudit={setAudit} generalSettings={generalSettings} />;
  }
  if (["ss-tous-docs", "ss-internes", "ss-docs-internal", "ss-externes", "ss-docs-external", "ss-docs-to-treat", "ss-validation", "ss-signature", "ss-en-validation", "ss-signes"].includes(view)) {
    return (
      <>
        <DocumentsView docs={docs} setDocs={setDocs} view={view} authUser={authUser} users={users} workflows={workflows} delegations={delegations} onOpen={setSelectedDoc} onAction={setActionDoc} onProcess={setExtProcessDoc} onRefresh={syncDocs} userSettings={userSettings} />
        {selectedDoc && <DocumentDetailModal doc={selectedDoc} users={users} onClose={() => setSelectedDoc(null)} onAction={() => { setActionDoc(selectedDoc); setSelectedDoc(null); }} />}
        {actionDoc && <ActionModal doc={actionDoc} users={users} authUser={authUser} signatures={signatures} otpConfig={otpConfig} onClose={() => setActionDoc(null)} onSave={(updated) => { handleDocSaved(updated); setActionDoc(null); }} />}
        {extProcessDoc && (
          <ExternalDocumentProcessor
            doc={extProcessDoc}
            users={users}
            workflows={workflows}
            delegations={delegations}
            projets={projets}
            authUser={authUser}
            userSettings={userSettings}
            onClose={() => setExtProcessDoc(null)}
            onSave={(updated) => {
              setDocs((current) => {
                const next = current.map((doc) => doc.id === updated.id ? updated : doc);
                writeRaw(DOCS_KEY, next);
                return next;
              });
              setAudit(p => [...(updated.audit || []).slice(-3), ...p].slice(0, 300));
              if (updated.status === "en_cours") {
                setNotifs(p => [{
                  id: `N-${Date.now()}`, type: "workflow", lu: false, date: new Date().toISOString(),
                  message: `Document externe ${updated.ref} traité · Workflow « ${updated.workflowName} » lancé · Receveur : ${updated.receiverName}`,
                }, ...p]);
              }
              setExtProcessDoc(null);
            }}
          />
        )}
      </>
    );
  }
  if (view === "ss-search") return <UnifiedDocModule moduleId="ss-search" docs={docs} setDocs={setDocs} authUser={authUser} users={users} workflows={workflows} projets={projets} signatures={signatures} otpConfig={otpConfig} externalAccounts={externalAccounts} onRefresh={syncDocs} setAudit={setAudit} setNotifs={setNotifs} />;
  if (view === "ss-mailbox") return <ExternalSignatureMailbox />;
  if (view === "ss-rapports-validateurs") return <SituationValidateurView docs={docs} users={users} />;
  if (view === "ss-rapports-expediteurs") return <SituationExpediteurView docs={docs} users={users} />;
  if (view === "ss-rapports") return <ReportsView docs={docs} workflows={workflows} audit={audit} users={users} />;
  if (view === "ss-wf-modeles" || view === "ss-param-wf") return <WorkflowAdmin workflows={workflows} setWorkflows={setWorkflows} users={users} projets={projets} />;
  if (view === "ss-param-sign") return <SignaturesAdmin signatures={signatures} setSignatures={setSignatures} users={users} authUser={authUser} />;
  if (view === "ss-delegations") return <DelegationsAdmin delegations={delegations} setDelegations={setDelegations} users={users} projets={projets} workflows={workflows} audit={audit} setAudit={setAudit} setNotifs={setNotifs} authUser={authUser} />;
  if (view === "ss-portail" || view === "ss-external-accounts") return <ExternalAccountsAdmin accounts={externalAccounts} setAccounts={setExternalAccounts} onRefresh={syncExternal} setNotifs={setNotifs} />;
  if (view === "ss-param-general") return <GeneralSettingsAdmin settings={generalSettings} setSettings={setGeneralSettings} docs={docs} projets={projets} />;
  if (view === "ss-relances") return <RelancesView setView={setView} />;
  if (view === "ss-email-tpl") return <EmailTemplatesView setView={setView} />;
  if (view === "ss-personnalisation") return <PersonnalisationView setView={setView} />;
  if (view === "ss-param-otp") return <OtpAdmin config={otpConfig} setConfig={setOtpConfig} workflows={workflows} setWorkflows={setWorkflows} />;
  if (view === "ss-admin-user-new") {
    return <NouvelUtilisateurView projets={projets} users={users} setUsers={setUsers} setView={setView} license={license} />;
  }
  if (["ss-admin-users", "ss-roles", "ss-license", "ss-journaux"].includes(view)) {
    const defaultTab = { "ss-roles": "roles", "ss-license": "license", "ss-journaux": "journaux" }[view] || "users";
    return <AdminPanel defaultTab={defaultTab} users={users} setUsers={setUsers} userSettings={userSettings} setUserSettings={setUserSettings} license={license} setLicense={setLicense} projets={projets} docs={docs} audit={audit} setView={setView} />;
  }
  if (view === "ss-integr-softdocs") return <SoftDocsIntegration docs={docs} softDocs={softDocs} setSoftDocs={setSoftDocs} users={users} />;
  if (view === "ss-notif") return <NotificationsView notifs={notifs} setNotifs={setNotifs} setView={setView} />;
  return (
    <>
      <DashboardView docs={docs} setView={setView} authUser={authUser} users={users} audit={audit} onAction={(doc) => setActionDoc(doc)} />
      {emailPreviewDoc && <EmailPreviewModal doc={emailPreviewDoc} authUser={authUser} workflows={workflows} onClose={() => setEmailPreviewDoc(null)} />}
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MesDocumentsView — documents créés par l'utilisateur connecté
   ══════════════════════════════════════════════════════════════════ */
function MesDocumentsView({ docs, authUser, users, onOpen, onAction, onRefresh, extra }) {
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const statuses = ["all", "initie", "recu", "en_cours", "rejete", "termine", "archive"];
  const statusLabel = { all: "Tous", initie: "Initiés", recu: "Reçus", en_cours: "En cours", rejete: "Rejetés", termine: "Terminés", archive: "Archivés" };
  const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  const myDocs = docs.filter((d) => d.deposantId === authUser?.id || d.author === authUser?.nom || d.deposantName === authUser?.nom);
  const filtered = myDocs
    .filter((d) => status === "all" || d.status === status)
    .filter((d) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return [d.ref, d.title, d.workflowName, d.projectName].some((x) => String(x || "").toLowerCase().includes(q));
    });

  const counts = {};
  statuses.forEach((s) => { counts[s] = s === "all" ? myDocs.length : myDocs.filter((d) => d.status === s).length; });

  return (
    <div style={{ fontFamily: FONT }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>Mes documents</h2>
          <p style={{ margin: "4px 0 0", color: MUT, fontSize: 12.5 }}>{filtered.length} document(s)</p>
        </div>
        <Button onClick={onRefresh}>↺ Actualiser</Button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        {statuses.map((s) => (
          <button key={s} onClick={() => setStatus(s)}
            style={{ padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${s === status ? ACC2 : BD}`, background: s === status ? `${ACC2}14` : WH, color: s === status ? ACC2 : MUT, fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: FONT }}>
            {statusLabel[s]}{counts[s] > 0 && s !== "all" ? ` (${counts[s]})` : ""}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 14 }}>
        <input style={{ ...inputStyle, maxWidth: 340 }} placeholder="Rechercher par référence, titre, workflow..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f8f9fc" }}>
                {["Référence", "Titre", "Type", "Workflow", "Statut", "Date création", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 800, fontSize: 11.5, color: MUT, borderBottom: `1px solid ${BD}`, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: MUT }}>Aucun document trouvé</td></tr>
              )}
              {filtered.map((doc) => (
                <tr key={doc.id} style={{ borderBottom: `1px solid ${BD}`, cursor: "pointer" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#f5f3ff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = WH; }}>
                  <td style={{ padding: "10px 14px", fontWeight: 800, color: ACC2 }}>{doc.ref}</td>
                  <td style={{ padding: "10px 14px", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.title}</td>
                  <td style={{ padding: "10px 14px", whiteSpace: "nowrap", color: MUT }}>{SS_DOC_TYPES.find((t) => t.id === doc.type)?.label || doc.type || "—"}</td>
                  <td style={{ padding: "10px 14px", whiteSpace: "nowrap", color: MUT }}>{doc.workflowName || "—"}</td>
                  <td style={{ padding: "10px 14px" }}><StatusBadge status={doc.status} /></td>
                  <td style={{ padding: "10px 14px", color: MUT, whiteSpace: "nowrap" }}>{fmtDate(doc.createdAt || doc.dateDepot)}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Button onClick={() => onOpen(doc)}>Détail</Button>
                      {activeSteps(doc).length > 0 && <Button tone="primary" onClick={() => onAction(doc)}>Agir</Button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {extra}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   RecusView — Documents à traiter : A. Reçus
   ══════════════════════════════════════════════════════════════════ */
function RecusView({ docs, setDocs, authUser, users, signatures, otpConfig, onSave, onRefresh, setNotifs, emailPreviewModal }) {
  const [actionDoc, setActionDoc] = useState(null);
  const [detailDoc, setDetailDoc] = useState(null);
  const [histDoc, setHistDoc] = useState(null);
  const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }) : "—";

  const canActOnAny = authUser?.systemRole === "admin" || authUser?.systemRole === "superadmin";
  const canProcess = authUser?.systemRole !== "readonly";
  const received = docs.filter((d) => canProcess && (activeTaskForUser(d, authUser?.id) || (canActOnAny && d.status === "en_cours" && activeSteps(d).length)));

  return (
    <div style={{ fontFamily: FONT }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>Reçus — À traiter</h2>
          <p style={{ margin: "4px 0 0", color: MUT, fontSize: 12.5 }}>{received.length} document(s) en attente de votre action</p>
        </div>
        <Button onClick={onRefresh}>↺ Actualiser</Button>
      </div>

      <Card>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f8f9fc" }}>
                {["Référence", "Titre du document", "Action demandée", "Expéditeur", "Date limite", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 800, fontSize: 11.5, color: MUT, borderBottom: `1px solid ${BD}`, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {received.length === 0 && (
                <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: MUT }}>Aucun document à traiter pour le moment</td></tr>
              )}
              {received.map((doc) => {
                const task = activeTaskForUser(doc, authUser?.id) || (canActOnAny ? activeSteps(doc)[0] : null);
                const overdue = task && isOverdue(task);
                return (
                  <tr key={doc.id} style={{ borderBottom: `1px solid ${BD}`, background: overdue ? "#fef9f9" : WH }}>
                    <td style={{ padding: "10px 14px", fontWeight: 800, color: ACC2 }}>{doc.ref}</td>
                    <td style={{ padding: "10px 14px", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.title}</td>
                    <td style={{ padding: "10px 14px" }}>{task ? <ActionBadge action={task.action} /> : "—"}</td>
                    <td style={{ padding: "10px 14px", color: MUT }}>{doc.deposantName || doc.receiverName || "—"}</td>
                    <td style={{ padding: "10px 14px", color: overdue ? RED : MUT, fontWeight: overdue ? 800 : 400, whiteSpace: "nowrap" }}>
                      {task?.dueAt ? fmtDate(task.dueAt) : "—"}{overdue && " ⚠"}
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                        <Button tone="primary" onClick={() => setActionDoc(doc)}>Signer / Valider</Button>
                        <Button onClick={() => setDetailDoc(doc)}>Prévisualiser</Button>
                        <Button onClick={() => setHistDoc(doc)}>Historique</Button>
                        <Button onClick={() => {
                          const link = document.createElement("a");
                          link.href = filePreviewSrc(doc.fileB64);
                          link.download = `${doc.ref}.pdf`;
                          link.click();
                        }}>Télécharger</Button>
                        <Button onClick={() => setDetailDoc(doc)}>Suivi temps réel</Button>
                        <Button onClick={() => setDetailDoc(doc)}>Visualisation graphique</Button>
                        <Button tone="orange" onClick={() => {
                          const updated = { ...doc, audit: [...(doc.audit || []), createAudit(authUser?.nom, "relance", "Relance envoyée aux signataires")] };
                          onSave(updated);
                        }}>Relancer</Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {actionDoc && (
        <ActionModal
          doc={actionDoc}
          users={users}
          authUser={authUser}
          signatures={signatures}
          otpConfig={otpConfig}
          onClose={() => setActionDoc(null)}
          onSave={(updated) => { onSave(updated); setActionDoc(null); }}
        />
      )}
      {detailDoc && (
        <DocumentDetailModal doc={detailDoc} users={users} onClose={() => setDetailDoc(null)} onAction={() => { setActionDoc(detailDoc); setDetailDoc(null); }} />
      )}
      {histDoc && (
        <Modal title={`Historique — ${histDoc.ref}`} subtitle={histDoc.title} onClose={() => setHistDoc(null)} width={580}>
          <div>
            {(histDoc.audit || []).length === 0 && <p style={{ color: MUT, textAlign: "center", padding: 24 }}>Aucune entrée d'historique.</p>}
            {(histDoc.audit || []).map((a, i) => (
              <div key={i} style={{ padding: "10px 0", borderBottom: `1px solid ${BD}`, fontSize: 13 }}>
                <b style={{ color: "#0f172a" }}>{a.user}</b>
                <span style={{ marginLeft: 8, background: `${ACC2}14`, color: ACC2, fontSize: 10.5, fontWeight: 800, padding: "2px 8px", borderRadius: 10 }}>{a.action}</span>
                <div style={{ color: MUT, marginTop: 4 }}>{a.detail}</div>
                <div style={{ color: "#94a3b8", fontSize: 11.5, marginTop: 2 }}>{new Date(a.date).toLocaleString("fr-FR")}</div>
              </div>
            ))}
          </div>
        </Modal>
      )}
      {emailPreviewModal}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   EnCoursView — Documents à traiter : B. En cours
   ══════════════════════════════════════════════════════════════════ */
function EnCoursView({ docs, authUser, users, onOpen, extra }) {
  const enCours = docs.filter((d) => d.status === "en_cours");

  function daysLeft(step) {
    if (!step?.dueAt) return null;
    return Math.ceil((new Date(step.dueAt) - Date.now()) / 86400000);
  }

  return (
    <div style={{ fontFamily: FONT }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>Documents en cours</h2>
        <p style={{ margin: "4px 0 0", color: MUT, fontSize: 12.5 }}>{enCours.length} document(s) en cours de traitement</p>
      </div>

      <Card>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f8f9fc" }}>
                {["Référence", "Titre", "Progression workflow", "Étape actuelle", "Utilisateur actuel", "Délai restant", "Historique"].map((h) => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 800, fontSize: 11.5, color: MUT, borderBottom: `1px solid ${BD}`, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {enCours.length === 0 && (
                <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: MUT }}>Aucun document en cours</td></tr>
              )}
              {enCours.map((doc) => {
                const steps = doc.steps || [];
                const done = steps.filter((s) => s.status === "complete").length;
                const total = steps.length;
                const pct = total ? Math.round((done / total) * 100) : 0;
                const active = steps.find((s) => s.status === "active");
                const currentUser = active?.signers?.length ? userName(users, active.signers[0]) : "—";
                const dl = active ? daysLeft(active) : null;
                const overdue = dl !== null && dl < 0;
                return (
                  <tr key={doc.id} style={{ borderBottom: `1px solid ${BD}`, cursor: "pointer" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#f5f3ff"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = WH; }}
                    onClick={() => onOpen(doc)}>
                    <td style={{ padding: "10px 14px", fontWeight: 800, color: ACC2 }}>{doc.ref}</td>
                    <td style={{ padding: "10px 14px", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.title}</td>
                    <td style={{ padding: "10px 14px", minWidth: 160 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1, height: 8, borderRadius: 4, background: "#e5e7eb", overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: pct === 100 ? GREEN : ACC2, borderRadius: 4 }} />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 800, color: MUT, whiteSpace: "nowrap" }}>{done}/{total} étapes</span>
                      </div>
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      {active
                        ? <><ActionBadge action={active.action} /><div style={{ fontSize: 11, color: MUT, marginTop: 3 }}>{active.label}</div></>
                        : <span style={{ color: MUT }}>—</span>}
                    </td>
                    <td style={{ padding: "10px 14px", color: MUT }}>{currentUser}</td>
                    <td style={{ padding: "10px 14px", whiteSpace: "nowrap", color: overdue ? RED : dl !== null && dl <= 3 ? ORANGE : MUT, fontWeight: overdue || (dl !== null && dl <= 3) ? 800 : 400 }}>
                      {dl !== null ? (overdue ? `${Math.abs(dl)}j de retard ⚠` : `${dl}j restants`) : "—"}
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      <Button onClick={(e) => { e.stopPropagation(); onOpen(doc); }}>Voir détail</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
      {extra}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   RejetesView — Documents à traiter : C. Rejetés
   ══════════════════════════════════════════════════════════════════ */
function RejetesView({ docs, authUser, users, onOpen, extra }) {
  const rejetes = docs.filter((d) => d.status === "rejete");
  const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  return (
    <div style={{ fontFamily: FONT }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>Documents rejetés</h2>
        <p style={{ margin: "4px 0 0", color: MUT, fontSize: 12.5 }}>{rejetes.length} document(s) refusé(s)</p>
      </div>

      {rejetes.length === 0 ? (
        <Card style={{ padding: 48, textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
          <div style={{ fontWeight: 800, color: GREEN, fontSize: 16 }}>Aucun document rejeté</div>
          <div style={{ color: MUT, marginTop: 6, fontSize: 13 }}>Tous les documents ont été traités avec succès.</div>
        </Card>
      ) : (
        <Card>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#fef2f2" }}>
                  {["Référence", "Titre", "Motif de rejet", "Étape de rejet", "Utilisateur ayant rejeté", "Date rejet", "Actions"].map((h) => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 800, fontSize: 11.5, color: RED, borderBottom: `1px solid ${BD}`, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rejetes.map((doc) => {
                  const rejetEntry = (doc.audit || []).slice().reverse().find((a) => a.action === "rejet" || a.action === "rejection" || a.action === "rejet_document");
                  const rejetStep = (doc.steps || []).find((s) => s.status === "rejected");
                  return (
                    <tr key={doc.id} style={{ borderBottom: `1px solid ${BD}`, cursor: "pointer" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#fef2f2"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = WH; }}
                      onClick={() => onOpen(doc)}>
                      <td style={{ padding: "10px 14px", fontWeight: 800, color: RED }}>{doc.ref}</td>
                      <td style={{ padding: "10px 14px", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.title}</td>
                      <td style={{ padding: "10px 14px", color: "#7f1d1d", maxWidth: 220, fontStyle: "italic" }}>{doc.rejectReason || rejetEntry?.detail || "—"}</td>
                      <td style={{ padding: "10px 14px" }}>
                        {rejetStep
                          ? <><ActionBadge action={rejetStep.action} /><div style={{ fontSize: 11, color: MUT, marginTop: 2 }}>{rejetStep.label}</div></>
                          : <span style={{ color: MUT }}>{rejetEntry?.action || "—"}</span>}
                      </td>
                      <td style={{ padding: "10px 14px", color: MUT }}>{rejetEntry?.user || doc.rejectedBy || "—"}</td>
                      <td style={{ padding: "10px 14px", color: MUT, whiteSpace: "nowrap" }}>{fmtDate(rejetEntry?.date || doc.updatedAt)}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <Button onClick={(e) => { e.stopPropagation(); onOpen(doc); }}>Détail</Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      {extra}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ArchivesView — Documents à traiter : D. Archivés
   ══════════════════════════════════════════════════════════════════ */
function ArchivesView({ docs, authUser, users, onOpen, extra }) {
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [type, setType] = useState("all");
  const [histDoc, setHistDoc] = useState(null);

  const archives = docs.filter((d) => d.status === "archive" || d.status === "termine");
  const filtered = archives.filter((d) => {
    if (type !== "all" && d.type !== type) return false;
    if (from && d.createdAt && new Date(d.createdAt) < new Date(from)) return false;
    if (to && d.createdAt && new Date(d.createdAt) > new Date(to + "T23:59:59")) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return [d.ref, d.title, d.deposantName, d.workflowName, d.projectName].some((x) => String(x || "").toLowerCase().includes(q));
  });
  const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  function exportCSV() {
    const header = ["Référence", "Titre", "Type", "Workflow", "Déposant", "Date archivage", "Statut"];
    const rows = filtered.map((d) => [d.ref, d.title, d.type, d.workflowName || "", d.deposantName || "", fmtDate(d.archivedAt || d.updatedAt), d.status]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c || "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `archives_softsign_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  function showQR(doc) {
    const data = `SOFTSIGN|${doc.ref}|${doc.id}|${doc.status}|${doc.workflowName || ""}`;
    alert(`Vérification QR Code\n\nRéférence: ${doc.ref}\nStatut: ${doc.status}\nWorkflow: ${doc.workflowName || "—"}\nID: ${doc.id}\n\nData QR: ${data}`);
  }

  return (
    <div style={{ fontFamily: FONT }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>Archives</h2>
          <p style={{ margin: "4px 0 0", color: MUT, fontSize: 12.5 }}>{filtered.length} document(s) archivé(s)</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Button onClick={exportCSV}>⬇ Exporter CSV</Button>
        </div>
      </div>

      <Card style={{ padding: 14, marginBottom: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr auto", gap: 10, alignItems: "end" }}>
          <Field label="Recherche avancée">
            <input style={inputStyle} placeholder="Référence, titre, déposant..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </Field>
          <Field label="Type de document">
            <select style={inputStyle} value={type} onChange={(e) => setType(e.target.value)}>
              <option value="all">Tous les types</option>
              {SS_DOC_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <Field label="Du">
              <input style={inputStyle} type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </Field>
            <Field label="Au">
              <input style={inputStyle} type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </Field>
          </div>
          <button onClick={() => { setSearch(""); setFrom(""); setTo(""); setType("all"); }}
            style={{ height: 38, padding: "0 14px", borderRadius: 8, border: `1px solid ${BD}`, background: WH, cursor: "pointer", fontSize: 12.5, fontFamily: FONT, color: MUT }}>
            Réinitialiser
          </button>
        </div>
      </Card>

      <Card>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f8f9fc" }}>
                {["Référence", "Titre", "Type", "Workflow", "Déposant", "Date archivage", "Statut", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 800, fontSize: 11.5, color: MUT, borderBottom: `1px solid ${BD}`, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ padding: 40, textAlign: "center", color: MUT }}>Aucune archive correspondante</td></tr>
              )}
              {filtered.map((doc) => (
                <tr key={doc.id} style={{ borderBottom: `1px solid ${BD}`, cursor: "pointer" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#f8f9fc"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = WH; }}>
                  <td style={{ padding: "10px 14px", fontWeight: 800, color: ACC2 }}>{doc.ref}</td>
                  <td style={{ padding: "10px 14px", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.title}</td>
                  <td style={{ padding: "10px 14px", color: MUT, whiteSpace: "nowrap" }}>{SS_DOC_TYPES.find((t) => t.id === doc.type)?.label || doc.type || "—"}</td>
                  <td style={{ padding: "10px 14px", color: MUT, whiteSpace: "nowrap" }}>{doc.workflowName || "—"}</td>
                  <td style={{ padding: "10px 14px", color: MUT }}>{doc.deposantName || "—"}</td>
                  <td style={{ padding: "10px 14px", color: MUT, whiteSpace: "nowrap" }}>{fmtDate(doc.archivedAt || doc.updatedAt)}</td>
                  <td style={{ padding: "10px 14px" }}><StatusBadge status={doc.status} /></td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", gap: 5 }}>
                      <Button onClick={() => onOpen(doc)}>Détail</Button>
                      <Button onClick={() => setHistDoc(doc)}>Historique</Button>
                      <Button onClick={() => showQR(doc)}>QR</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {histDoc && (
        <Modal title={`Historique complet — ${histDoc.ref}`} subtitle={histDoc.title} onClose={() => setHistDoc(null)} width={660}>
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <Card style={{ padding: 12 }}>
                <div style={{ fontSize: 11.5, color: MUT, fontWeight: 700 }}>Référence</div>
                <div style={{ fontWeight: 800, marginTop: 2 }}>{histDoc.ref}</div>
              </Card>
              <Card style={{ padding: 12 }}>
                <div style={{ fontSize: 11.5, color: MUT, fontWeight: 700 }}>Workflow utilisé</div>
                <div style={{ fontWeight: 800, marginTop: 2 }}>{histDoc.workflowName || "—"}</div>
              </Card>
            </div>
            <h4 style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 800 }}>Étapes du workflow</h4>
            {(histDoc.steps || []).map((step, i) => (
              <div key={step.id || i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: `1px solid ${BD}` }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: step.status === "complete" ? "#dcfce7" : step.status === "rejected" ? "#fef2f2" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 900, color: step.status === "complete" ? GREEN : step.status === "rejected" ? RED : MUT }}>
                    {step.status === "complete" ? "✓" : step.status === "rejected" ? "✗" : i + 1}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 13 }}>{step.label}</div>
                  <div style={{ fontSize: 11.5, color: MUT, marginTop: 2 }}>
                    Action : {getAction(step.action).label} · Signataires : {(step.signers || []).map((id) => userName(users, id)).join(", ") || "—"}
                  </div>
                  <div style={{ marginTop: 4 }}><StepBadge status={step.status} /></div>
                </div>
              </div>
            ))}
            <h4 style={{ margin: "16px 0 10px", fontSize: 13, fontWeight: 800 }}>Journal d'audit</h4>
            {(histDoc.audit || []).length === 0 && <p style={{ color: MUT, fontSize: 12 }}>Aucune entrée.</p>}
            {(histDoc.audit || []).map((a, i) => (
              <div key={i} style={{ padding: "8px 0", borderTop: `1px solid ${BD}`, fontSize: 12 }}>
                <b>{a.user}</b>
                <span style={{ marginLeft: 8, background: `${ACC2}14`, color: ACC2, fontSize: 10.5, fontWeight: 800, padding: "2px 8px", borderRadius: 10 }}>{a.action}</span>
                <div style={{ color: MUT, marginTop: 3 }}>{a.detail}</div>
                <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 2 }}>{new Date(a.date).toLocaleString("fr-FR")}</div>
              </div>
            ))}
          </div>
        </Modal>
      )}
      {extra}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Certificate utilities
   ══════════════════════════════════════════════════════════════════ */

function buildCertData(doc, users = [], delegations = []) {
  const steps = doc.steps || [];
  const completedSteps = steps.filter((s) => s.status === "complete" || s.status === "done");

  const signatories = completedSteps.map((step) => {
    const completedById = step.completedBy || step.doneBy || step.signers?.[0];
    const user = users.find((u) => u.id === completedById || u.nom === completedById);
    const signedAt = step.completedAt || step.doneAt || step.updatedAt;

    const delegation = (delegations || []).find((d) => {
      if (d.delegueId !== completedById && d.delegue !== completedById) return false;
      if (!signedAt) return false;
      const t = new Date(signedAt).getTime();
      return new Date(d.from).getTime() <= t && new Date(d.to).getTime() >= t;
    });

    const delegant = delegation ? users.find((u) => u.id === (delegation.delegantId || delegation.delegant)) : null;

    return {
      name: user?.nom || completedById
        || (step.signers || []).map((id) => users.find((u) => u.id === id)?.nom || id).join(", ")
        || "—",
      role: user?.role || user?.fonction || "—",
      action: step.action,
      date: signedAt || doc.updatedAt,
      signatureMode: step.signatureMode || "",
      comment: step.comment || "",
      delegation: delegation && delegant ? {
        delegantName: delegant.nom,
        from: delegation.from,
        to: delegation.to,
        motif: delegation.motif || delegation.reason || "",
      } : null,
    };
  });

  const wfStartEntry = (doc.audit || []).find((a) =>
    a.action === "lancement_workflow" || a.action === "workflow_start" || a.action === "creation"
  );

  return {
    id: doc.certificate?.id || `CERT-${doc.id.slice(-8).toUpperCase()}`,
    generatedAt: doc.certificate?.generatedAt || doc.finalizedAt || doc.archivedAt || doc.updatedAt || new Date().toISOString(),
    docRef: doc.ref,
    docType: SS_DOC_TYPES.find((t) => t.id === doc.type)?.label || doc.type || "—",
    docTitle: doc.title,
    docProject: doc.projectName || doc.projectId || "—",
    docSite: doc.site || "—",
    docPages: doc.pages || "—",
    docCreatedAt: doc.createdAt || doc.dateDepot,
    wfName: doc.workflowName || "—",
    wfType: doc.origin === "externe" ? "Traitement document externe" : "Circuit de signature interne",
    wfStepsTotal: steps.length,
    wfStartedAt: doc.workflowStartedAt || wfStartEntry?.date,
    wfFinalizedAt: doc.finalizedAt || doc.certificate?.generatedAt || doc.archivedAt || doc.updatedAt,
    signatories,
    history: doc.audit || [],
    fileB64: doc.fileB64 || null,
    docStatus: doc.status,
  };
}

function openCertPDF(cert) {
  const f = (iso) => iso ? new Date(iso).toLocaleString("fr-FR") : "—";
  const fd = (iso) => iso ? new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }) : "—";
  const aLabel = { signature: "Signature", paraphe: "Paraphe", validation: "Validation", revision: "Révision" };
  const aColor = { signature: "#5b21b6", paraphe: "#92400e", validation: "#065f46", revision: "#1d4ed8" };
  const aBg = { signature: "#ede9fe", paraphe: "#fff7ed", validation: "#dcfce7", revision: "#dbeafe" };

  const sigRows = cert.signatories.length === 0
    ? `<tr><td colspan="5" style="text-align:center;color:#6b7280;padding:12px">Aucun signataire enregistré</td></tr>`
    : cert.signatories.map((s, i) => `
      <tr>
        <td style="text-align:center;font-weight:700">${i + 1}</td>
        <td><strong>${s.name}</strong>${s.role && s.role !== "—" ? `<br><span style="font-size:10px;color:#6b7280">${s.role}</span>` : ""}</td>
        <td><span style="background:${aBg[s.action] || "#f1f5f9"};color:${aColor[s.action] || "#4b5563"};padding:2px 8px;border-radius:10px;font-size:10px;font-weight:700">${aLabel[s.action] || s.action}</span></td>
        <td style="white-space:nowrap">${f(s.date)}</td>
        <td>${s.delegation
          ? `<div style="background:#faf5ff;border:1px solid #c4b5fd;border-radius:5px;padding:5px 8px;font-size:10px">Par délégation de <strong style="color:#4c1d95">${s.delegation.delegantName}</strong><br>Période : ${fd(s.delegation.from)} → ${fd(s.delegation.to)}${s.delegation.motif ? `<br>Motif : ${s.delegation.motif}` : ""}</div>`
          : (s.comment || "—")}</td>
      </tr>`).join("");

  const histRows = (cert.history || []).length === 0
    ? `<tr><td colspan="4" style="text-align:center;color:#6b7280;padding:12px">Aucune entrée</td></tr>`
    : cert.history.map((a) => `
      <tr>
        <td style="white-space:nowrap;font-size:10px">${f(a.date)}</td>
        <td>${a.user || "—"}</td>
        <td style="font-size:10px">${a.action}</td>
        <td style="font-size:10px;color:#4b5563">${a.detail || "—"}</td>
      </tr>`).join("");

  const html = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"><title>Certificat — ${cert.docRef}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Segoe UI',Arial,sans-serif;background:#f4f4f4;color:#1a1a2e;font-size:12px}
  .page{width:210mm;min-height:297mm;margin:0 auto;background:#fff;padding:13mm 15mm}
  .hdr{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #4c1d95;padding-bottom:14px;margin-bottom:15px}
  .logo{width:42px;height:42px;background:linear-gradient(135deg,#4c1d95,#7c3aed);border-radius:9px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:14px;flex-shrink:0}
  .brand-name{font-size:19px;font-weight:700;color:#4c1d95}
  .brand-sub{font-size:10px;color:#6b7280;margin-top:1px}
  .cert-ttl{text-align:right}
  .cert-ttl h1{font-size:14px;color:#4c1d95;font-weight:700;text-transform:uppercase;letter-spacing:.04em}
  .cert-id{font-size:10px;color:#9ca3af;margin-top:3px;font-family:monospace}
  .notice{background:#f0fdf4;border:1px solid #86efac;border-radius:6px;padding:8px 12px;font-size:10.5px;color:#065f46;margin-bottom:13px;display:flex;align-items:flex-start;gap:8px}
  .sec{margin-bottom:14px}
  .sec-ttl{font-size:10px;font-weight:700;color:#4c1d95;text-transform:uppercase;letter-spacing:.1em;border-left:3px solid #7c3aed;padding-left:7px;margin-bottom:8px}
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:4px 14px}
  .fl{padding:4px 0}.fl-lbl{font-size:9px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.06em}
  .fl-val{font-size:11.5px;color:#111827;margin-top:1px}
  table{width:100%;border-collapse:collapse}
  th{background:#f5f3ff;padding:6px 9px;text-align:left;font-weight:700;color:#4c1d95;border:1px solid #e5e7eb;font-size:9px;text-transform:uppercase;letter-spacing:.05em}
  td{padding:6px 9px;border:1px solid #e5e7eb;vertical-align:top;font-size:11px}
  tr:nth-child(even) td{background:#fafafa}
  .footer{margin-top:18px;padding-top:12px;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:flex-end}
  .seal{width:68px;height:68px;border:2px dashed #7c3aed;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:7.5px;font-weight:700;color:#7c3aed;text-align:center;line-height:1.4;padding:8px}
  .footer-txt{font-size:9px;color:#9ca3af;line-height:1.8}
  @media print{body{background:#fff}.page{margin:0;padding:10mm 12mm}}
</style></head><body>
<div class="page">
  <div class="hdr">
    <div style="display:flex;align-items:center;gap:10px">
      <div class="logo">SS</div>
      <div><div class="brand-name">SoftSign</div><div class="brand-sub">Signature Électronique · SOFTWELL Madagascar</div></div>
    </div>
    <div class="cert-ttl">
      <h1>Certificat de signature électronique</h1>
      <div class="cert-id">${cert.id} · Émis le ${f(cert.generatedAt)}</div>
    </div>
  </div>
  <div class="notice"><span>✓</span><span>Ce certificat atteste que le document <strong>${cert.docRef}</strong> a été signé/validé électroniquement via SoftSign conformément au workflow défini. Il constitue la preuve officielle des validations effectuées.</span></div>
  <div class="sec">
    <div class="sec-ttl">Informations du document</div>
    <div class="grid2">
      <div class="fl"><div class="fl-lbl">Référence</div><div class="fl-val">${cert.docRef}</div></div>
      <div class="fl"><div class="fl-lbl">Type de document</div><div class="fl-val">${cert.docType}</div></div>
      <div class="fl"><div class="fl-lbl">Titre</div><div class="fl-val">${cert.docTitle}</div></div>
      <div class="fl"><div class="fl-lbl">Projet / Site</div><div class="fl-val">${cert.docProject} / ${cert.docSite}</div></div>
      <div class="fl"><div class="fl-lbl">Nombre de pages</div><div class="fl-val">${cert.docPages}</div></div>
      <div class="fl"><div class="fl-lbl">Date de création</div><div class="fl-val">${fd(cert.docCreatedAt)}</div></div>
    </div>
  </div>
  <div class="sec">
    <div class="sec-ttl">Informations Workflow</div>
    <div class="grid2">
      <div class="fl"><div class="fl-lbl">Workflow utilisé</div><div class="fl-val">${cert.wfName}</div></div>
      <div class="fl"><div class="fl-lbl">Type</div><div class="fl-val">${cert.wfType}</div></div>
      <div class="fl"><div class="fl-lbl">Nombre d'étapes</div><div class="fl-val">${cert.wfStepsTotal} étape(s)</div></div>
      <div class="fl"><div class="fl-lbl">Date démarrage</div><div class="fl-val">${fd(cert.wfStartedAt)}</div></div>
      <div class="fl"><div class="fl-lbl">Date finalisation</div><div class="fl-val">${fd(cert.wfFinalizedAt)}</div></div>
    </div>
  </div>
  <div class="sec">
    <div class="sec-ttl">Signataires &amp; actions effectuées</div>
    <table><thead><tr><th>#</th><th>Signataire</th><th>Action</th><th>Date de signature</th><th>Remarque / Délégation</th></tr></thead>
    <tbody>${sigRows}</tbody></table>
  </div>
  <div class="sec">
    <div class="sec-ttl">Historique complet</div>
    <table><thead><tr><th>Date &amp; heure</th><th>Utilisateur</th><th>Action</th><th>Détail</th></tr></thead>
    <tbody>${histRows}</tbody></table>
  </div>
  <div class="footer">
    <div class="footer-txt">
      <div>Émetteur : SoftSign · SOFTWELL Madagascar</div>
      <div>Certificat n° : ${cert.id}</div>
      <div>Date d'émission : ${f(cert.generatedAt)}</div>
      <div>Ce document est généré automatiquement et ne nécessite pas de signature physique.</div>
    </div>
    <div class="seal">CERTIFICAT<br>OFFICIEL<br>SOFTSIGN</div>
  </div>
</div>
<script>setTimeout(function(){window.print();},400);</script>
</body></html>`;

  const win = window.open("", "_blank", "width=920,height=720,scrollbars=yes");
  if (win) { win.document.write(html); win.document.close(); }
}

/* ══════════════════════════════════════════════════════════════════
   CertificatePreviewModal — in-app certificate viewer
   ══════════════════════════════════════════════════════════════════ */
function CertificatePreviewModal({ cert, onClose, onPrint }) {
  const f = (iso) => iso ? new Date(iso).toLocaleString("fr-FR") : "—";
  const fd = (iso) => iso ? new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }) : "—";
  const aLabel = { signature: "Signature", paraphe: "Paraphe", validation: "Validation", revision: "Révision" };
  const aColor = { signature: "#5b21b6", paraphe: "#92400e", validation: "#065f46", revision: BLUE };
  const aBg = { signature: "#ede9fe", paraphe: "#fff7ed", validation: "#dcfce7", revision: "#dbeafe" };

  return (
    <Modal
      title="Certificat de signature électronique"
      subtitle={`${cert.id} · Émis le ${f(cert.generatedAt)}`}
      onClose={onClose}
      width={840}
      footer={
        <>
          <Button onClick={onClose}>Fermer</Button>
          <Button tone="primary" onClick={onPrint}>⬇ Télécharger PDF</Button>
        </>
      }
    >
      <div style={{ fontFamily: FONT }}>
        {/* Header gradient */}
        <div style={{ background: "linear-gradient(135deg,#4c1d95,#7c3aed)", borderRadius: 10, padding: "16px 20px", marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", color: WH, fontWeight: 900, fontSize: 16 }}>SS</div>
            <div>
              <div style={{ color: WH, fontWeight: 900, fontSize: 15 }}>SoftSign</div>
              <div style={{ color: "rgba(255,255,255,.62)", fontSize: 10.5 }}>Signature Électronique · SOFTWELL Madagascar</div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: WH, fontWeight: 800, fontSize: 12, textTransform: "uppercase", letterSpacing: ".04em" }}>Certificat de signature électronique</div>
            <div style={{ color: "rgba(255,255,255,.62)", fontSize: 11, marginTop: 3, fontFamily: "monospace" }}>{cert.id}</div>
          </div>
        </div>

        {/* Notice */}
        <Card style={{ padding: 11, marginBottom: 16, background: "#f0fdf4", border: "1px solid #86efac" }}>
          <div style={{ fontSize: 12, color: "#065f46" }}>
            ✓ Ce certificat atteste que le document <b>{cert.docRef}</b> a été signé/validé électroniquement via SoftSign conformément au workflow défini. Il constitue la preuve officielle des validations effectuées.
          </div>
        </Card>

        {/* 2-col info grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <Card style={{ padding: 14 }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, color: ACC2, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10, borderLeft: `3px solid ${ACC2}`, paddingLeft: 7 }}>Informations du document</div>
            {[
              ["Référence", cert.docRef],
              ["Type", cert.docType],
              ["Titre", cert.docTitle],
              ["Projet / Site", `${cert.docProject} / ${cert.docSite}`],
              ["Nombre de pages", cert.docPages],
              ["Date de création", fd(cert.docCreatedAt)],
            ].map(([lbl, val]) => (
              <div key={lbl} style={{ display: "flex", gap: 8, padding: "5px 0", borderBottom: `1px solid ${BD}` }}>
                <span style={{ fontSize: 11, color: MUT, minWidth: 100, fontWeight: 700, flexShrink: 0 }}>{lbl}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>{val || "—"}</span>
              </div>
            ))}
          </Card>
          <Card style={{ padding: 14 }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, color: ACC2, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10, borderLeft: `3px solid ${ACC2}`, paddingLeft: 7 }}>Informations Workflow</div>
            {[
              ["Workflow", cert.wfName],
              ["Type", cert.wfType],
              ["Étapes totales", `${cert.wfStepsTotal} étape(s)`],
              ["Date démarrage", fd(cert.wfStartedAt)],
              ["Date finalisation", fd(cert.wfFinalizedAt)],
            ].map(([lbl, val]) => (
              <div key={lbl} style={{ display: "flex", gap: 8, padding: "5px 0", borderBottom: `1px solid ${BD}` }}>
                <span style={{ fontSize: 11, color: MUT, minWidth: 100, fontWeight: 700, flexShrink: 0 }}>{lbl}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>{val || "—"}</span>
              </div>
            ))}
          </Card>
        </div>

        {/* Signatories */}
        <Card style={{ padding: 14, marginBottom: 14 }}>
          <div style={{ fontSize: 10.5, fontWeight: 800, color: ACC2, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 12, borderLeft: `3px solid ${ACC2}`, paddingLeft: 7 }}>Signataires &amp; actions effectuées</div>
          {cert.signatories.length === 0 ? (
            <p style={{ color: MUT, fontSize: 12 }}>Aucun signataire enregistré.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {cert.signatories.map((s, i) => (
                <div key={i} style={{ padding: "11px 13px", background: "#f8f9fc", borderRadius: 8, border: `1px solid ${BD}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <MiniAvatar name={s.name} color={aColor[s.action] || ACC2} />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 13 }}>{s.name}</div>
                        {s.role && s.role !== "—" && <div style={{ fontSize: 11, color: MUT }}>{s.role}</div>}
                        {s.signatureMode && <div style={{ fontSize: 10.5, color: MUT, marginTop: 1 }}>Mode : {s.signatureMode}</div>}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ background: aBg[s.action] || "#f1f5f9", color: aColor[s.action] || MUT, fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 12 }}>{aLabel[s.action] || s.action}</span>
                      <div style={{ color: MUT, fontSize: 11, marginTop: 5 }}>{f(s.date)}</div>
                    </div>
                  </div>
                  {s.delegation && (
                    <div style={{ marginTop: 9, padding: "8px 11px", background: "#faf5ff", border: "1px solid #c4b5fd", borderRadius: 6 }}>
                      <div style={{ fontWeight: 800, color: "#4c1d95", fontSize: 12, marginBottom: 3 }}>
                        🔗 Signé par {s.name} — par délégation de {s.delegation.delegantName}
                      </div>
                      <div style={{ fontSize: 11.5, color: MUT }}>Période de délégation : {fd(s.delegation.from)} → {fd(s.delegation.to)}</div>
                      {s.delegation.motif && <div style={{ fontSize: 11.5, color: MUT }}>Autorisation : {s.delegation.motif}</div>}
                    </div>
                  )}
                  {s.comment && <div style={{ marginTop: 6, fontSize: 11.5, color: MUT, fontStyle: "italic" }}>Commentaire : {s.comment}</div>}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Audit history */}
        <Card style={{ padding: 14 }}>
          <div style={{ fontSize: 10.5, fontWeight: 800, color: ACC2, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10, borderLeft: `3px solid ${ACC2}`, paddingLeft: 7 }}>Historique complet</div>
          {cert.history.length === 0 ? (
            <p style={{ color: MUT, fontSize: 12 }}>Aucune entrée d'audit.</p>
          ) : (
            <div style={{ maxHeight: 220, overflowY: "auto" }}>
              {cert.history.map((a, i) => (
                <div key={i} style={{ padding: "7px 0", borderBottom: `1px solid ${BD}`, fontSize: 12, display: "flex", gap: 10 }}>
                  <span style={{ color: "#94a3b8", fontSize: 10.5, whiteSpace: "nowrap", marginTop: 1, minWidth: 120 }}>{new Date(a.date).toLocaleString("fr-FR")}</span>
                  <div>
                    <b>{a.user}</b>
                    <span style={{ marginLeft: 6, background: `${ACC2}12`, color: ACC2, fontSize: 10, fontWeight: 800, padding: "1px 6px", borderRadius: 8 }}>{a.action}</span>
                    {a.detail && <div style={{ color: MUT, marginTop: 2 }}>{a.detail}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </Modal>
  );
}

/* ══════════════════════════════════════════════════════════════════
   CertificatsView — list of all available certificates
   ══════════════════════════════════════════════════════════════════ */
function CertificatsView({ docs, users, delegations, authUser }) {
  const [previewCert, setPreviewCert] = useState(null);
  const [auditDoc, setAuditDoc] = useState(null);
  const [search, setSearch] = useState("");

  const certDocs = docs.filter((d) => d.status === "termine" || d.status === "signe" || d.status === "archive");
  const filtered = certDocs.filter((d) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return [d.ref, d.title, d.workflowName, d.deposantName, d.projectName].some((x) => String(x || "").toLowerCase().includes(q));
  });
  const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  return (
    <div style={{ fontFamily: FONT }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>Certificats de signature</h2>
          <p style={{ margin: "4px 0 0", color: MUT, fontSize: 12.5 }}>
            {filtered.length} certificat(s) disponible(s) — générés automatiquement après finalisation du workflow
          </p>
        </div>
      </div>

      <Card style={{ padding: 14, marginBottom: 16, background: "#f5f3ff", border: `1px solid ${ACC2}33` }}>
        <div style={{ display: "flex", gap: 13, alignItems: "flex-start" }}>
          <div style={{ width: 38, height: 38, borderRadius: 9, background: `${ACC2}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18 }}>🔒</div>
          <div>
            <div style={{ fontWeight: 800, color: "#4c1d95", fontSize: 13, marginBottom: 4 }}>Certificat de signature électronique SoftSign</div>
            <div style={{ fontSize: 12, color: MUT, lineHeight: 1.6 }}>
              Après finalisation complète du workflow, le système génère automatiquement le document signé, le certificat de signature et le journal d'audit associé.
              Le certificat contient les informations du document, du workflow, les signataires, les délégations éventuelles et l'historique complet des actions.
            </div>
          </div>
        </div>
      </Card>

      <div style={{ marginBottom: 14 }}>
        <input style={{ ...inputStyle, maxWidth: 380 }} placeholder="Rechercher par référence, titre, workflow..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <Card style={{ padding: 52, textAlign: "center" }}>
          <div style={{ fontSize: 44, marginBottom: 14 }}>📋</div>
          <div style={{ fontWeight: 800, color: MUT, fontSize: 15 }}>Aucun certificat disponible</div>
          <div style={{ color: MUT, fontSize: 13, marginTop: 6 }}>Les certificats sont générés automatiquement après la finalisation complète d'un workflow.</div>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {filtered.map((doc) => {
            const steps = doc.steps || [];
            const done = steps.filter((s) => s.status === "complete");
            const fmtFinal = doc.finalizedAt || doc.updatedAt;
            const hasDelegation = done.some((s) => {
              const delId = s.completedBy || s.signers?.[0];
              return (delegations || []).some((d) => (d.delegueId === delId || d.delegue === delId));
            });

            return (
              <Card key={doc.id} style={{ padding: 0, overflow: "hidden" }}>
                {/* Card header */}
                <div style={{ background: "linear-gradient(135deg,#4c1d95,#7c3aed)", padding: "13px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 38, height: 38, borderRadius: 8, background: "rgba(255,255,255,.14)", display: "flex", alignItems: "center", justifyContent: "center", color: WH, fontWeight: 900, fontSize: 17 }}>📄</div>
                    <div>
                      <div style={{ color: WH, fontWeight: 900, fontSize: 14 }}>{doc.ref}</div>
                      <div style={{ color: "rgba(255,255,255,.68)", fontSize: 11.5, marginTop: 1 }}>{doc.title}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <StatusBadge status={doc.status} />
                    <div style={{ color: "rgba(255,255,255,.6)", fontSize: 10.5, marginTop: 4 }}>Finalisé le {fmtDate(fmtFinal)}</div>
                    {hasDelegation && (
                      <div style={{ marginTop: 4, background: "rgba(255,255,255,.18)", borderRadius: 10, padding: "2px 8px", fontSize: 10, color: WH, fontWeight: 700, display: "inline-block" }}>🔗 Délégation</div>
                    )}
                  </div>
                </div>

                {/* Card body */}
                <div style={{ padding: "14px 18px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 14 }}>
                    {[
                      ["Workflow", doc.workflowName || "—"],
                      ["Étapes complètes", `${done.length} / ${steps.length}`],
                      ["Signataires", `${done.filter((s) => isZoneRequired(s.action)).length} signataire(s)`],
                      ["Projet / Site", `${doc.projectName || "—"} / ${doc.site || "—"}`],
                    ].map(([lbl, val]) => (
                      <div key={lbl}>
                        <div style={{ fontSize: 10, color: MUT, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em" }}>{lbl}</div>
                        <div style={{ fontWeight: 800, fontSize: 13, marginTop: 3, color: "#0f172a" }}>{val}</div>
                      </div>
                    ))}
                  </div>

                  {/* Completed step pills */}
                  {done.length > 0 && (
                    <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 14 }}>
                      {done.map((step, i) => {
                        const signerName = step.completedBy
                          ? users.find((u) => u.id === step.completedBy)?.nom || step.completedBy
                          : (step.signers || []).map((id) => users.find((u) => u.id === id)?.nom || id).join(", ");
                        const isDeleg = (delegations || []).some((d) =>
                          d.delegueId === (step.completedBy || step.signers?.[0]) || d.delegue === (step.completedBy || step.signers?.[0])
                        );
                        return (
                          <div key={step.id || i} style={{ background: `${ACC2}0e`, border: `1px solid ${ACC2}28`, borderRadius: 20, padding: "4px 12px", fontSize: 11.5, display: "flex", gap: 7, alignItems: "center" }}>
                            <span style={{ fontWeight: 800, color: ACC2 }}>{signerName || "—"}</span>
                            <span style={{ color: BD }}>·</span>
                            <ActionBadge action={step.action} />
                            {isDeleg && <span style={{ fontSize: 10, color: "#6d28d9", fontWeight: 700 }}>🔗 délégué</span>}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8, paddingTop: 12, borderTop: `1px solid ${BD}`, flexWrap: "wrap" }}>
                    <Button tone="primary" onClick={() => setPreviewCert(buildCertData(doc, users, delegations))}>
                      🔏 Voir certificat
                    </Button>
                    <Button tone="blue" onClick={() => openCertPDF(buildCertData(doc, users, delegations))}>
                      ⬇ Télécharger certificat PDF
                    </Button>
                    {doc.fileB64 && (
                      <Button onClick={() => {
                        const a = document.createElement("a");
                        a.href = filePreviewSrc(doc.fileB64);
                        a.download = `${doc.ref}_signe.pdf`;
                        a.click();
                      }}>
                        ⬇ Télécharger document signé
                      </Button>
                    )}
                    <Button onClick={() => setAuditDoc(doc)}>📋 Voir journal d'audit</Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {previewCert && (
        <CertificatePreviewModal cert={previewCert} onClose={() => setPreviewCert(null)} onPrint={() => openCertPDF(previewCert)} />
      )}

      {auditDoc && (
        <Modal title={`Journal d'audit complet — ${auditDoc.ref}`} subtitle={auditDoc.title} onClose={() => setAuditDoc(null)} width={700}>
          <div>
            {(auditDoc.audit || []).length === 0 && <p style={{ color: MUT, textAlign: "center", padding: 32 }}>Aucune entrée d'audit enregistrée.</p>}
            {(auditDoc.audit || []).map((a, i) => (
              <div key={i} style={{ padding: "10px 0", borderBottom: `1px solid ${BD}`, fontSize: 13, display: "flex", gap: 12 }}>
                <span style={{ color: "#94a3b8", fontSize: 11, whiteSpace: "nowrap", marginTop: 1, minWidth: 120 }}>{new Date(a.date).toLocaleString("fr-FR")}</span>
                <div>
                  <b style={{ color: "#0f172a" }}>{a.user}</b>
                  <span style={{ marginLeft: 7, background: `${ACC2}14`, color: ACC2, fontSize: 10.5, fontWeight: 800, padding: "2px 8px", borderRadius: 10 }}>{a.action}</span>
                  <div style={{ color: MUT, marginTop: 4, fontSize: 12 }}>{a.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   EmailPreviewModal — simulated email sent to the deposant
   ══════════════════════════════════════════════════════════════════ */
function EmailPreviewModal({ doc, authUser, workflows, onClose }) {
  const wf = workflows.find((w) => w.id === doc.workflowId);
  const finalizeDate = doc.finalizedAt || doc.updatedAt || new Date().toISOString();
  const fd = (iso) => iso ? new Date(iso).toLocaleString("fr-FR") : "—";
  const deposantEmail = doc.deposantEmail || `${(doc.deposantName || "deposant").toLowerCase().replace(/\s+/g, ".")}@exemple.mg`;
  const consultLink = `https://softsign.softwell.mg/consulter/${doc.id}`;

  const completedSteps = (doc.steps || []).filter((s) => s.status === "complete");

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.6)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: 18 }}>
      <div style={{ width: "100%", maxWidth: 680, maxHeight: "92vh", overflow: "hidden", background: WH, borderRadius: 14, boxShadow: "0 24px 80px rgba(0,0,0,.28)", display: "flex", flexDirection: "column", fontFamily: FONT }}>
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg,#059669,#10b981)", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>✉</div>
            <div>
              <div style={{ color: WH, fontWeight: 900, fontSize: 14 }}>Email envoyé automatiquement</div>
              <div style={{ color: "rgba(255,255,255,.72)", fontSize: 11 }}>Le document a atteint le statut « {doc.status} » — envoi déclenché par le workflow</div>
            </div>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "rgba(255,255,255,.18)", color: WH, cursor: "pointer", width: 30, height: 30, borderRadius: "50%", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>

        {/* Email envelope metadata */}
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${BD}`, background: "#f8f9fc", fontSize: 12 }}>
          {[
            ["De", `SoftSign <noreply@softsign.softwell.mg>`],
            ["À", `${doc.deposantName || "Déposant"} <${deposantEmail}>`],
            ["Objet", `[SoftSign] Document ${doc.ref} finalisé et signé — ${doc.title}`],
            ["Date d'envoi", fd(doc.emailSentAt || finalizeDate)],
          ].map(([lbl, val]) => (
            <div key={lbl} style={{ display: "flex", gap: 8, padding: "4px 0", borderBottom: lbl === "Date d'envoi" ? "none" : `1px solid ${BD}` }}>
              <span style={{ minWidth: 72, color: MUT, fontWeight: 700 }}>{lbl} :</span>
              <span style={{ color: "#0f172a", fontWeight: lbl === "Objet" ? 700 : 400 }}>{val}</span>
            </div>
          ))}
          <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
            <div style={{ background: "#dcfce7", color: "#065f46", borderRadius: 20, padding: "3px 10px", fontSize: 10.5, fontWeight: 800 }}>📎 {doc.ref}_signe.pdf</div>
            <div style={{ background: "#ede9fe", color: "#5b21b6", borderRadius: 20, padding: "3px 10px", fontSize: 10.5, fontWeight: 800 }}>📎 {doc.ref}_certificat.pdf</div>
          </div>
        </div>

        {/* Email body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 20px" }}>
          <div style={{ maxWidth: 600, margin: "0 auto", paddingTop: 20 }}>
            {/* Email visual */}
            <div style={{ border: `1px solid ${BD}`, borderRadius: 10, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,.06)" }}>
              {/* Email header */}
              <div style={{ background: "linear-gradient(135deg,#4c1d95,#7c3aed)", padding: "22px 28px", textAlign: "center" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", color: WH, fontWeight: 900, fontSize: 14 }}>SS</div>
                  <div style={{ color: WH, fontWeight: 900, fontSize: 18 }}>SoftSign</div>
                </div>
                <div style={{ color: "rgba(255,255,255,.75)", fontSize: 11.5 }}>Signature Électronique · SOFTWELL Madagascar</div>
              </div>

              {/* Green status banner */}
              <div style={{ background: "#f0fdf4", padding: "18px 28px", borderBottom: `1px solid #bbf7d0`, textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 6 }}>✅</div>
                <div style={{ fontWeight: 900, fontSize: 17, color: "#065f46" }}>Document finalisé et signé</div>
                <div style={{ color: "#16a34a", fontSize: 12.5, marginTop: 4 }}>Finalisé le {fd(finalizeDate)}</div>
              </div>

              {/* Body content */}
              <div style={{ padding: "22px 28px", fontSize: 13.5, lineHeight: 1.75, color: "#1e293b" }}>
                <p>Bonjour <b>{doc.deposantName || "Madame / Monsieur"}</b>,</p>
                <p style={{ marginTop: 12 }}>
                  Nous avons le plaisir de vous informer que le document suivant a été <b>entièrement signé et validé</b> via SoftSign :
                </p>

                {/* Doc summary card */}
                <div style={{ background: "#f8f9fc", border: `1px solid ${BD}`, borderRadius: 10, padding: "14px 18px", margin: "16px 0" }}>
                  {[
                    ["📄 Référence", doc.ref],
                    ["Titre", doc.title],
                    ["Type", SS_DOC_TYPES.find((t) => t.id === doc.type)?.label || doc.type || "—"],
                    ["Workflow", doc.workflowName || "—"],
                    ["Projet / Site", `${doc.projectName || "—"} / ${doc.site || "—"}`],
                    ["Finalisation", fd(finalizeDate)],
                  ].map(([lbl, val]) => (
                    <div key={lbl} style={{ display: "flex", gap: 10, padding: "5px 0", borderBottom: `1px solid ${BD}`, fontSize: 12.5 }}>
                      <span style={{ minWidth: 110, color: MUT, fontWeight: 700 }}>{lbl}</span>
                      <span style={{ fontWeight: lbl.includes("Référence") ? 800 : 400, color: lbl.includes("Référence") ? ACC2 : "#0f172a" }}>{val}</span>
                    </div>
                  ))}
                </div>

                {/* Signatories */}
                {completedSteps.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <p style={{ fontWeight: 700, marginBottom: 8 }}>Signataires ayant validé ce document :</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {completedSteps.map((step, i) => (
                        <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "6px 12px", background: "#f0fdf4", borderRadius: 8, fontSize: 12.5 }}>
                          <span style={{ width: 22, height: 22, borderRadius: "50%", background: GREEN, color: WH, fontWeight: 900, fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✓</span>
                          <span style={{ fontWeight: 700 }}>{(step.signers || []).join(", ") || "—"}</span>
                          <span style={{ color: MUT }}>·</span>
                          <ActionBadge action={step.action} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attachments */}
                <div style={{ marginTop: 20, padding: "14px 18px", background: "#faf5ff", border: `1px solid ${ACC2}33`, borderRadius: 10 }}>
                  <p style={{ fontWeight: 800, color: "#4c1d95", marginBottom: 10, fontSize: 13 }}>Pièces jointes :</p>
                  {[
                    ["📄", `${doc.ref}_signe.pdf`, "Document signé"],
                    ["🔏", `${doc.ref}_certificat.pdf`, "Certificat de signature électronique"],
                  ].map(([icon, name, desc]) => (
                    <div key={name} style={{ display: "flex", gap: 10, alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${BD}`, fontSize: 12.5 }}>
                      <span>{icon}</span>
                      <span style={{ fontWeight: 700, color: ACC2 }}>{name}</span>
                      <span style={{ color: MUT }}>— {desc}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div style={{ textAlign: "center", margin: "22px 0" }}>
                  <div style={{ display: "inline-block", background: "linear-gradient(135deg,#4c1d95,#7c3aed)", color: WH, padding: "12px 28px", borderRadius: 10, fontWeight: 800, fontSize: 14, letterSpacing: ".02em" }}>
                    Consulter le document →
                  </div>
                  <div style={{ color: "#94a3b8", fontSize: 10.5, marginTop: 8 }}>Lien : {consultLink}</div>
                </div>

                <hr style={{ border: "none", borderTop: `1px solid ${BD}`, margin: "16px 0" }} />
                <p style={{ fontSize: 12, color: MUT, lineHeight: 1.6 }}>
                  Ce message est généré automatiquement par SoftSign à la finalisation du workflow.
                  Pour toute question, contactez votre correspondant SoftSign.<br />
                  <b>SOFTWELL Madagascar</b> · Antananarivo, Madagascar
                </p>
              </div>
            </div>

            {/* Info note */}
            {wf?.autoSendToDeposant && (
              <div style={{ marginTop: 14, padding: "10px 14px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, fontSize: 12, color: "#065f46" }}>
                ✓ Envoi automatique activé dans le workflow <b>« {wf.name} »</b> — option "Envoyer automatiquement le document signé au déposant".
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ padding: "12px 20px", borderTop: `1px solid ${BD}`, display: "flex", justifyContent: "flex-end", gap: 10, background: "#fafafa" }}>
          <Button onClick={onClose}>Fermer</Button>
          <Button tone="green" onClick={onClose}>✓ Compris</Button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   UrgentActionsView — Mes Actions urgentes
   ══════════════════════════════════════════════════════════════════ */
function UrgentActionsView({ docs, setDocs, authUser, users, signatures, otpConfig, onSave, setNotifs, setView }) {
  const [filter, setFilter] = useState("all");
  const [actionDoc, setActionDoc] = useState(null);

  const now = Date.now();
  const canActOnAny = authUser?.systemRole === "admin" || authUser?.systemRole === "superadmin";
  const canProcess = authUser?.systemRole !== "readonly";
  const actionableSteps = (doc) => !canProcess ? [] : canActOnAny
    ? activeSteps(doc)
    : activeSteps(doc).filter((step) => (step.signers || []).includes(authUser?.id));

  function getUrgencyInfo(step) {
    if (!step?.dueAt) return null;
    const diff = new Date(step.dueAt) - now;
    const hours = Math.floor(Math.abs(diff) / 3600000);
    const days = Math.floor(Math.abs(diff) / 86400000);
    if (diff < 0) return { late: true, days: days || 1, label: `${days || 1}j de retard`, color: RED, bg: "#fef2f2", priority: 3 };
    if (diff < 3600000 * 2) return { late: false, days: 0, label: `Expire dans ${hours}h`, color: RED, bg: "#fef2f2", priority: 2 };
    if (diff < 86400000) return { late: false, days: 0, label: "Expire aujourd'hui", color: ORANGE, bg: "#fffbeb", priority: 2 };
    if (diff < 2 * 86400000) return { late: false, days: 1, label: "Expire demain", color: ORANGE, bg: "#fffbeb", priority: 1 };
    return null;
  }

  const urgentDocs = useMemo(() => {
    return docs
      .filter((d) => actionableSteps(d).some((s) => getUrgencyInfo(s) !== null))
      .sort((a, b) => {
        const ua = getUrgencyInfo(actionableSteps(a).find((s) => getUrgencyInfo(s)));
        const ub = getUrgencyInfo(actionableSteps(b).find((s) => getUrgencyInfo(s)));
        return (ub?.priority || 0) - (ua?.priority || 0);
      });
  }, [docs, authUser?.id, canActOnAny]);

  const tabs = [
    { key: "all", label: "Toutes", count: urgentDocs.length },
    { key: "late", label: "En retard", count: urgentDocs.filter((d) => actionableSteps(d).some((s) => getUrgencyInfo(s)?.late)).length },
    { key: "today", label: "Expire aujourd'hui", count: urgentDocs.filter((d) => actionableSteps(d).some((s) => { const u = getUrgencyInfo(s); return u && !u.late && u.days === 0; })).length },
    { key: "tomorrow", label: "Expire demain", count: urgentDocs.filter((d) => actionableSteps(d).some((s) => { const u = getUrgencyInfo(s); return u && u.days === 1; })).length },
  ];

  const filtered = useMemo(() => {
    if (filter === "late") return urgentDocs.filter((d) => actionableSteps(d).some((s) => getUrgencyInfo(s)?.late));
    if (filter === "today") return urgentDocs.filter((d) => actionableSteps(d).some((s) => { const u = getUrgencyInfo(s); return u && !u.late && u.days === 0; }));
    if (filter === "tomorrow") return urgentDocs.filter((d) => actionableSteps(d).some((s) => { const u = getUrgencyInfo(s); return u && u.days === 1; }));
    return urgentDocs;
  }, [urgentDocs, filter]);

  const lateCount = tabs[1].count;
  const actionColors = { signature: ACC2, validation: BLUE, paraphe: ORANGE, notification: MUT };
  const actionBg = { signature: "#f5f3ff", validation: "#eff6ff", paraphe: "#fffbeb", notification: "#f8fafc" };
  const actionIcon = { signature: "✍", validation: "✓", paraphe: "✎", notification: "🔔" };
  const actionLabel = { signature: "Signer", validation: "Valider", paraphe: "Parapher", notification: "Accuser" };

  return (
    <div style={{ fontFamily: FONT, width: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18, gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg,#dc2626,#ef4444)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>⚡</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#0f172a", letterSpacing: "-.3px" }}>Mes Actions urgentes</div>
              <div style={{ fontSize: 12, color: MUT, marginTop: 1 }}>Documents en retard ou prioritaires à votre niveau</div>
            </div>
          </div>
        </div>
        <Button tone="light" onClick={() => setView("ss-docs-received")} style={{ flexShrink: 0 }}>Voir tous les reçus</Button>
      </div>

      {/* Alert banner */}
      {lateCount > 0 && (
        <div style={{ padding: "12px 16px", marginBottom: 16, borderRadius: 10, background: "#fef2f2", border: "2px solid #fecaca", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>🚨</span>
          <div style={{ flex: 1 }}>
            <b style={{ fontSize: 13.5, color: RED }}>
              {lateCount} document{lateCount > 1 ? "s" : ""} en retard à votre niveau
            </b>
            <div style={{ fontSize: 12, color: "#7f1d1d", marginTop: 2 }}>
              Ces documents dépassent leur délai de traitement. Veuillez agir immédiatement.
            </div>
          </div>
          <button onClick={() => setFilter("late")}
            style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: RED, color: WH, cursor: "pointer", fontSize: 12, fontWeight: 800, fontFamily: FONT, flexShrink: 0 }}>
            Voir les retards →
          </button>
        </div>
      )}

      {urgentDocs.length === 0 && (
        <div style={{ padding: "60px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>✅</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>Aucune action urgente</div>
          <div style={{ fontSize: 13, color: MUT, lineHeight: 1.6 }}>
            Tous vos documents sont dans les délais.<br />Continuez comme ça !
          </div>
        </div>
      )}

      {urgentDocs.length > 0 && (
        <Card style={{ overflow: "hidden" }}>
          {/* Filter tabs */}
          <div style={{ display: "flex", borderBottom: `1px solid ${BD}`, background: "#fafbfd", overflowX: "auto" }}>
            {tabs.map(({ key, label, count }) => (
              <button key={key} onClick={() => setFilter(key)} style={{
                padding: "11px 16px", border: "none", borderBottom: filter === key ? `2px solid ${RED}` : "2px solid transparent",
                background: "transparent", cursor: "pointer", fontFamily: FONT, fontSize: 12.5,
                fontWeight: filter === key ? 800 : 500, color: filter === key ? RED : MUT,
                display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap", flexShrink: 0,
              }}>
                {label}
                {count > 0 && (
                  <span style={{ fontSize: 11, fontWeight: 900, padding: "1px 7px", borderRadius: 20, background: filter === key ? `${RED}18` : "#f1f5f9", color: filter === key ? RED : MUT }}>
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Doc rows */}
          {filtered.length === 0 && (
            <div style={{ padding: "36px 20px", textAlign: "center", color: MUT, fontSize: 13 }}>
              Aucun document dans cette catégorie
            </div>
          )}

          {filtered.map((doc, di) => {
            const step = actionableSteps(doc)[0];
            const urg = getUrgencyInfo(step);
            const ac = step?.action;
            const acColor = actionColors[ac] || MUT;
            const acBg = actionBg[ac] || "#f8fafc";

            return (
              <div key={doc.id} style={{ display: "flex", alignItems: "stretch", borderBottom: di < filtered.length - 1 ? `1px solid ${BD}` : "none", background: urg?.late ? "#fff8f8" : WH }}>

                {/* Urgency indicator strip */}
                <div style={{ width: 5, background: urg?.late ? RED : urg?.priority >= 2 ? ORANGE : "#fbbf24", flexShrink: 0 }} />

                {/* Urgency badge */}
                <div style={{ width: 70, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "14px 8px", flexShrink: 0, borderRight: `1px solid ${BD}` }}>
                  <div style={{ width: 52, height: 52, borderRadius: 12, background: urg?.bg || "#fef2f2", border: `1px solid ${(urg?.color || RED)}33`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    {urg?.late ? (
                      <>
                        <div style={{ fontSize: 18, fontWeight: 950, color: urg.color, lineHeight: 1 }}>{urg.days}</div>
                        <div style={{ fontSize: 9, fontWeight: 800, color: urg.color, textTransform: "uppercase" }}>jours</div>
                      </>
                    ) : (
                      <div style={{ fontSize: 18, lineHeight: 1 }}>⏱</div>
                    )}
                  </div>
                  <div style={{ fontSize: 9.5, fontWeight: 800, color: urg?.color || RED, marginTop: 4, textAlign: "center", lineHeight: 1.2 }}>
                    {urg?.late ? "RETARD" : "URGENT"}
                  </div>
                </div>

                {/* Main content */}
                <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "14px 16px", gap: 14, minWidth: 0 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 14, fontWeight: 900, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 360 }}>{doc.title}</span>
                      <span style={{ fontSize: 11, fontWeight: 800, padding: "2px 9px", borderRadius: 20, background: acBg, color: acColor, border: `1px solid ${acColor}33`, display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                        {actionIcon[ac]} {getAction(ac).label}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: MUT, display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 700, color: ACC2 }}>{doc.ref}</span>
                      <span>{SS_DOC_TYPES.find((t) => t.id === doc.type)?.label || doc.type}</span>
                      {doc.projectName && <span>· {doc.projectName}</span>}
                      {doc.site && <span>· {doc.site}</span>}
                      {doc.amount && <span>· {formatMoney(doc.amount, doc.currency)}</span>}
                    </div>
                    <div style={{ fontSize: 11.5, color: MUT, marginTop: 5, display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ padding: "2px 8px", borderRadius: 6, background: "#f1f5f9", color: "#475569", fontWeight: 600 }}>
                        Étape {step?.order || 1} / {doc.steps?.length || "?"} — {step?.label || "—"}
                      </span>
                      {doc.deposantName && <span>Déposé par <b>{doc.deposantName}</b></span>}
                    </div>
                  </div>

                  {/* Right section */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: urg?.color || RED, display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: urg?.color || RED, display: "inline-block", animation: urg?.late ? "pulse 1s infinite" : "none" }} />
                      {urg?.label || "Urgent"}
                    </span>
                    {step?.dueAt && (
                      <span style={{ fontSize: 11, color: MUT }}>
                        Échéance : {new Date(step.dueAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    )}
                    <Button
                      tone={ac === "validation" ? "blue" : ac === "paraphe" ? "orange" : "primary"}
                      onClick={() => setActionDoc(doc)}
                      style={{ minWidth: 96 }}>
                      {actionLabel[ac] || "Traiter"}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Footer summary */}
          {filtered.length > 0 && (
            <div style={{ padding: "10px 18px", background: "#f8fafc", borderTop: `1px solid ${BD}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: MUT, fontWeight: 600 }}>
                {filtered.length} action{filtered.length > 1 ? "s" : ""} urgente{filtered.length > 1 ? "s" : ""}
                {lateCount > 0 && <span style={{ marginLeft: 8, color: RED, fontWeight: 800 }}>· {lateCount} en retard</span>}
              </span>
              <button onClick={() => setView("ss-docs-received")}
                style={{ border: 0, background: "transparent", color: ACC2, cursor: "pointer", fontWeight: 800, fontSize: 12, fontFamily: FONT }}>
                Voir tous les documents à traiter →
              </button>
            </div>
          )}
        </Card>
      )}

      {/* Action modal */}
      {actionDoc && (
        <ActionModal
          doc={actionDoc}
          users={users}
          authUser={authUser}
          signatures={signatures}
          otpConfig={otpConfig}
          onClose={() => setActionDoc(null)}
          onSave={(updated) => { onSave(updated); setActionDoc(null); }}
        />
      )}
    </div>
  );
}

function documentConcernsUser(doc, user) {
  if (!doc || !user) return false;
  return doc.deposantId === user.id ||
    doc.author === user.nom ||
    doc.deposantName === user.nom ||
    (doc.steps || []).some((step) => step.doneBy === user.id || (step.signers || []).includes(user.id));
}

function DashboardView(props) {
  const isAdmin = props.authUser?.systemRole === "admin" || props.authUser?.systemRole === "superadmin";
  return isAdmin ? <AdminDashboardView {...props} /> : <StandardDashboardView {...props} />;
}

function AdminDashboardView({ docs = [], setView, authUser, users = [], audit = [] }) {
  const [performanceTab, setPerformanceTab] = useState("table");
  const activeDocs = docs.filter((doc) => activeSteps(doc).length > 0);
  const lateDocs = activeDocs.filter((doc) => activeSteps(doc).some(isOverdue));
  const urgentDocs = activeDocs.filter((doc) => activeSteps(doc).some((step) => {
    const remaining = step.dueAt ? new Date(step.dueAt) - Date.now() : Infinity;
    return isOverdue(step) || remaining < 2 * 86400000;
  }));
  const stats = [
    { label: "Documents initiés", value: docs.length, color: ACC2, note: `${docs.filter((doc) => doc.origin === "externe").length} externes` },
    { label: "En cours", value: docs.filter((doc) => ["en_cours", "en_attente_traitement", "en_attente_signature_externe"].includes(doc.status)).length, color: BLUE, note: `${lateDocs.length} en retard` },
    { label: "Signés", value: docs.filter((doc) => ["signe", "termine", "archive"].includes(doc.status)).length, color: GREEN, note: "Circuit finalisé" },
    { label: "Rejetés", value: docs.filter((doc) => doc.status === "rejete").length, color: RED, note: "À corriger" },
    { label: "Archivés", value: docs.filter((doc) => ["archive", "termine"].includes(doc.status)).length, color: "#64748b", note: "Total cumulé" },
  ];
  const completedTotal = stats[2].value;
  const compliance = docs.length ? Math.round((completedTotal / docs.length) * 100) : 0;
  const softSignUsers = users.filter((user) => user.apps?.includes("softsign"));
  const perUser = softSignUsers.map((user) => {
    const doneSteps = docs.flatMap((doc) => (doc.steps || []).filter((step) => step.doneBy === user.id).map((step) => ({ doc, step })));
    const active = docs.filter((doc) => activeTaskForUser(doc, user.id)).length;
    const signed = doneSteps.filter(({ step }) => ["signature", "paraphe"].includes(step.action)).length;
    const delays = doneSteps.map(({ doc, step }) => {
      const start = new Date(doc.createdAt || doc.date || step.doneAt);
      const end = new Date(step.doneAt || start);
      return Math.max(0, (end - start) / 86400000);
    });
    const avgDelay = delays.length ? delays.reduce((sum, value) => sum + value, 0) / delays.length : 0;
    const score = Math.max(0, Math.min(100, Math.round((doneSteps.length * 12) + (signed * 8) - (active * 3))));
    return { ...user, treated: doneSteps.length, active, signed, avgDelay, score };
  }).sort((a, b) => b.treated - a.treated);
  const siteRows = [...docs.reduce((map, doc) => {
    const project = doc.projectName || "Projet non renseigné";
    const site = doc.site || "Site non renseigné";
    const key = `${project}::${site}`;
    const row = map.get(key) || { project, site, total: 0, signed: 0, rejected: 0, late: 0 };
    row.total += 1;
    if (["signe", "termine", "archive"].includes(doc.status)) row.signed += 1;
    if (doc.status === "rejete") row.rejected += 1;
    if (activeSteps(doc).some(isOverdue)) row.late += 1;
    map.set(key, row);
    return map;
  }, new Map()).values()].sort((a, b) => b.total - a.total);
  const statusRows = [
    { label: "Signés", value: stats[2].value, color: GREEN },
    { label: "En cours", value: stats[1].value, color: BLUE },
    { label: "Rejetés", value: stats[3].value, color: RED },
    { label: "Archivés", value: stats[4].value, color: "#94a3b8" },
  ];
  const statusTotal = statusRows.reduce((sum, item) => sum + item.value, 0) || 1;
  let statusOffset = 0;
  const donutGradient = statusRows.map((item) => {
    const start = statusOffset;
    statusOffset += (item.value / statusTotal) * 100;
    return `${item.color} ${start}% ${statusOffset}%`;
  }).join(", ");
  const monthlyRows = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - (5 - index));
    const monthDocs = docs.filter((doc) => {
      const createdAt = new Date(doc.createdAt || doc.date || 0);
      return createdAt.getMonth() === date.getMonth() && createdAt.getFullYear() === date.getFullYear();
    });
    return {
      label: date.toLocaleDateString("fr-FR", { month: "short" }),
      total: monthDocs.length,
    };
  });
  const maxMonthly = Math.max(1, ...monthlyRows.map((row) => row.total));
  const darkCard = { background: "#182235", border: "1px solid rgba(148,163,184,.16)", boxShadow: "none", color: "#e2e8f0" };

  return (
    <div style={{ fontFamily: FONT, width: "100%", background: "#101827", borderRadius: 14, padding: 18, boxSizing: "border-box", color: "#e2e8f0" }}>
      <div style={{ background: "linear-gradient(135deg,#172554,#312e81)", border: "1px solid rgba(129,140,248,.22)", borderRadius: 14, padding: "22px 26px", marginBottom: 18, color: WH, display: "flex", justifyContent: "space-between", gap: 18, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 23, fontWeight: 950 }}>Bonjour, {authUser?.nom || "Administrateur"}</div>
          <div style={{ marginTop: 6, color: "rgba(255,255,255,.76)", fontSize: 13 }}>Performance globale du projet · {urgentDocs.length} alerte(s) urgente(s) · {lateDocs.length} document(s) en retard</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
          <Button tone="primary" onClick={() => setView("ss-rapports")}>Exporter les statistiques</Button>
          <Button onClick={() => setView("ss-admin-users")}>Gérer les utilisateurs</Button>
          <Button onClick={() => setView("ss-param-general")}>Paramètres du projet</Button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14, marginBottom: 18 }}>
        {stats.map((stat) => (
          <Card key={stat.label} style={{ ...darkCard, padding: 17, borderTop: `4px solid ${stat.color}` }}>
            <div style={{ color: stat.color, fontSize: 30, fontWeight: 950 }}>{stat.value}</div>
            <div style={{ color: "#e2e8f0", fontSize: 12.5, fontWeight: 850 }}>{stat.label}</div>
            <div style={{ color: "#94a3b8", fontSize: 11.5, marginTop: 8 }}>{stat.note}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.5fr) minmax(280px,.7fr)", gap: 16, marginBottom: 16 }}>
        <Card style={{ ...darkCard, overflow: "hidden" }}>
          <div style={{ padding: "14px 17px", borderBottom: "1px solid rgba(148,163,184,.16)", display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <b style={{ fontSize: 14 }}>Performance par utilisateur</b>
            <div style={{ display: "flex", gap: 6 }}>
              {[["table", "Tableau"], ["graph", "Graphique"], ["radar", "Radar"]].map(([id, label]) => (
                <button key={id} onClick={() => setPerformanceTab(id)} style={{ border: "1px solid rgba(148,163,184,.22)", borderRadius: 6, padding: "4px 8px", background: performanceTab === id ? "#4f46e5" : "transparent", color: performanceTab === id ? WH : "#94a3b8", cursor: "pointer", fontFamily: FONT, fontSize: 11.5, fontWeight: 800 }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          {performanceTab === "table" && <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
              <thead><tr style={{ background: "rgba(15,23,42,.38)" }}>{["Utilisateur", "Traités", "Actions actives", "Signatures", "Délai moyen"].map((label) => <th key={label} style={{ padding: "10px 14px", color: "#94a3b8", textAlign: "left", fontSize: 10.5, textTransform: "uppercase" }}>{label}</th>)}</tr></thead>
              <tbody>{perUser.map((user) => (
                <tr key={user.id} style={{ borderTop: "1px solid rgba(148,163,184,.14)" }}>
                  <td style={{ padding: "11px 14px" }}><b>{user.nom}</b><div style={{ color: "#94a3b8", fontSize: 11 }}>{user.role}</div></td>
                  <td style={{ padding: "11px 14px", fontWeight: 900, color: ACC2 }}>{user.treated}</td>
                  <td style={{ padding: "11px 14px", fontWeight: 850, color: user.active ? ORANGE : "#94a3b8" }}>{user.active}</td>
                  <td style={{ padding: "11px 14px", fontWeight: 850, color: GREEN }}>{user.signed}</td>
                  <td style={{ padding: "11px 14px" }}>{user.avgDelay.toFixed(1)} j</td>
                </tr>
              ))}</tbody>
            </table>
          </div>}
          {performanceTab === "graph" && <div style={{ display: "grid", gap: 12, padding: 16 }}>
            {perUser.map((user) => <div key={user.id}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 12.5, marginBottom: 5 }}><b>{user.nom}</b><span style={{ color: "#a5b4fc" }}>{user.treated} action(s)</span></div>
              <div style={{ height: 8, background: "#0f172a", borderRadius: 99, overflow: "hidden" }}><div style={{ width: `${Math.max(3, user.score)}%`, height: "100%", background: "linear-gradient(90deg,#6366f1,#22d3ee)" }} /></div>
            </div>)}
          </div>}
          {performanceTab === "radar" && <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 12, padding: 16 }}>
            {perUser.map((user) => <div key={user.id} style={{ padding: 14, borderRadius: 10, border: "1px solid rgba(148,163,184,.16)", background: "rgba(15,23,42,.35)", textAlign: "center" }}>
              <div style={{ color: "#a5b4fc", fontSize: 26, fontWeight: 950 }}>{user.score}%</div>
              <b style={{ fontSize: 12 }}>{user.nom}</b>
              <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 5 }}>{user.signed} signature(s)</div>
            </div>)}
          </div>}
          {!perUser.length && <div style={{ padding: 18, color: "#94a3b8", fontSize: 12.5 }}>Aucun utilisateur SoftSign enregistré.</div>}
        </Card>

        <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
          <Card style={{ ...darkCard, padding: 17 }}>
            <div style={{ fontWeight: 850, fontSize: 13, marginBottom: 12 }}>Conformité globale</div>
            <div style={{ color: GREEN, fontSize: 36, fontWeight: 950 }}>{compliance}%</div>
            <div style={{ height: 8, borderRadius: 8, background: "#0f172a", overflow: "hidden", marginTop: 10 }}><div style={{ height: "100%", width: `${compliance}%`, background: GREEN }} /></div>
            <div style={{ color: "#94a3b8", fontSize: 11.5, marginTop: 8 }}>{completedTotal} document(s) finalisé(s) sur {docs.length}</div>
          </Card>
          <Card style={{ ...darkCard, overflow: "hidden" }}>
            <div style={{ padding: "13px 16px", borderBottom: "1px solid rgba(148,163,184,.16)" }}><b style={{ fontSize: 13 }}>Alertes & anomalies</b></div>
            {urgentDocs.slice(0, 5).map((doc) => <div key={doc.id} style={{ padding: "10px 16px", borderBottom: "1px solid rgba(148,163,184,.14)", display: "flex", gap: 8, fontSize: 12 }}><span style={{ color: RED }}>●</span><div><b>{doc.title}</b><div style={{ color: "#94a3b8", marginTop: 2 }}>{activeSteps(doc)[0]?.label || "Action requise"}</div></div></div>)}
            {!urgentDocs.length && <div style={{ padding: 16, color: "#94a3b8", fontSize: 12 }}>Aucune alerte urgente.</div>}
          </Card>
          <Card style={{ ...darkCard, padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 900, marginBottom: 11 }}>Administration</div>
            <div style={{ display: "grid", gap: 8 }}>
              <Button style={{ justifyContent: "flex-start" }} onClick={() => setView("ss-roles")}>Gestion des rôles</Button>
              <Button style={{ justifyContent: "flex-start" }} onClick={() => setView("ss-journaux")}>Journal d&apos;activité</Button>
            </div>
          </Card>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(300px,.85fr) minmax(0,1.15fr)", gap: 16 }}>
        <Card style={{ ...darkCard, overflow: "hidden" }}>
          <div style={{ padding: "14px 17px", borderBottom: "1px solid rgba(148,163,184,.16)" }}><b style={{ fontSize: 14 }}>Performance par projet / site</b></div>
          {siteRows.map((row) => (
            <div key={`${row.project}-${row.site}`} style={{ padding: "11px 16px", borderBottom: "1px solid rgba(148,163,184,.14)", display: "grid", gridTemplateColumns: "1fr auto", gap: 10 }}>
              <div><b style={{ fontSize: 12.5 }}>{row.project}</b><div style={{ color: "#94a3b8", fontSize: 11 }}>{row.site} · {row.total} document(s) · {row.late} retard(s)</div></div>
              <span style={{ color: row.rejected ? ORANGE : GREEN, fontSize: 12, fontWeight: 900 }}>{row.total ? Math.round((row.signed / row.total) * 100) : 0}% signés</span>
            </div>
          ))}
        </Card>
        <Card style={{ ...darkCard, overflow: "hidden" }}>
          <div style={{ padding: "14px 17px", borderBottom: "1px solid rgba(148,163,184,.16)" }}><b style={{ fontSize: 14 }}>Activité récente</b></div>
          {(audit || []).slice(0, 7).map((entry, index) => (
            <div key={`${entry.date}-${index}`} style={{ padding: "10px 16px", borderBottom: "1px solid rgba(148,163,184,.14)", display: "flex", justifyContent: "space-between", gap: 12, fontSize: 12 }}>
              <span><b>{entry.user}</b> · {entry.detail || entry.action}</span>
              <span style={{ color: "#94a3b8", whiteSpace: "nowrap" }}>{entry.date ? new Date(entry.date).toLocaleDateString("fr-FR") : "—"}</span>
            </div>
          ))}
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(240px,.55fr) minmax(320px,1.45fr)", gap: 16, marginTop: 16 }}>
        <Card style={{ ...darkCard, padding: 17 }}>
          <div style={{ fontWeight: 900, fontSize: 13, marginBottom: 14 }}>Répartition des statuts</div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: 128, height: 128, borderRadius: "50%", background: `conic-gradient(${donutGradient})`, display: "grid", placeItems: "center" }}>
              <div style={{ width: 78, height: 78, display: "grid", placeItems: "center", borderRadius: "50%", background: "#182235", color: GREEN, fontSize: 21, fontWeight: 950 }}>{compliance}%</div>
            </div>
          </div>
          <div style={{ display: "grid", gap: 7, marginTop: 15 }}>
            {statusRows.map((item) => <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: item.color }} /><span style={{ flex: 1, color: "#cbd5e1" }}>{item.label}</span><b>{item.value}</b></div>)}
          </div>
        </Card>
        <Card style={{ ...darkCard, padding: 17 }}>
          <div style={{ fontWeight: 900, fontSize: 13, marginBottom: 14 }}>Évolution mensuelle</div>
          <div style={{ display: "flex", alignItems: "end", gap: 10, height: 142 }}>
            {monthlyRows.map((row) => <div key={row.label} style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "end", gap: 5 }}>
              <div style={{ color: "#94a3b8", fontSize: 10.5 }}>{row.total}</div>
              <div style={{ width: "100%", maxWidth: 28, minHeight: 4, height: `${Math.max(4, (row.total / maxMonthly) * 100)}%`, borderRadius: "5px 5px 0 0", background: "linear-gradient(180deg,#818cf8,#4f46e5)" }} />
              <span style={{ color: "#94a3b8", fontSize: 10.5, textTransform: "capitalize" }}>{row.label}</span>
            </div>)}
          </div>
        </Card>
      </div>
    </div>
  );
}

function StandardDashboardView({ docs: allDocs = [], setView, authUser, audit: allAudit = [], onAction }) {
  const [taskTab, setTaskTab] = useState("all");
  const docs = allDocs.filter((doc) => documentConcernsUser(doc, authUser));
  const audit = allAudit.filter((entry) => entry.user === authUser?.nom || docs.some((doc) => String(entry.detail || "").includes(doc.ref)));

  const dayLabel = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const allTasks = docs.filter((d) => activeTaskForUser(d, authUser?.id));
  const tasksByAction = {
    all: allTasks,
    signature: allTasks.filter((d) => activeSteps(d).some((s) => s.action === "signature")),
    validation: allTasks.filter((d) => activeSteps(d).some((s) => s.action === "validation")),
    paraphe: allTasks.filter((d) => activeSteps(d).some((s) => s.action === "paraphe")),
  };
  const displayedTasks = tasksByAction[taskTab] || allTasks;

  const urgentDocs = allTasks.filter((d) => {
    const step = activeSteps(d)[0];
    if (!step) return false;
    const diff = step.dueAt ? new Date(step.dueAt) - Date.now() : Infinity;
    return isOverdue(step) || diff < 2 * 86400000;
  });
  const blockedDocs = allTasks
    .filter((d) => activeSteps(d).some(isOverdue))
    .sort((a, b) => daysLate(activeSteps(b).find(isOverdue)) - daysLate(activeSteps(a).find(isOverdue)));

  const stats = {
    initie: docs.filter((d) => ["initie", "en_cours"].includes(d.status)).length,
    enCours: docs.filter((d) => d.status === "en_cours").length,
    signes: docs.filter((d) => ["termine", "signe"].includes(d.status)).length,
    rejetes: docs.filter((d) => d.status === "rejete").length,
    archives: docs.filter((d) => ["archive", "termine"].includes(d.status)).length,
  };

  const chartData = Array.from({ length: 5 }, (_, index) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - (4 - index));
    const monthDocs = docs.filter((doc) => {
      const activityDate = new Date(doc.updatedAt || doc.archivedAt || doc.createdAt || doc.date || 0);
      return !Number.isNaN(activityDate.getTime()) && activityDate.getMonth() === date.getMonth() && activityDate.getFullYear() === date.getFullYear();
    });
    return {
      mois: date.toLocaleDateString("fr-FR", { month: "short" }),
      signes: monthDocs.filter((doc) => ["termine", "signe", "archive"].includes(doc.status)).length,
      rejetes: monthDocs.filter((doc) => doc.status === "rejete").length,
      current: index === 4,
    };
  });
  const maxChartVal = Math.max(1, ...chartData.flatMap((item) => [item.signes, item.rejetes]));

  const getDueInfo = (step) => {
    if (!step?.dueAt) return null;
    const diff = new Date(step.dueAt) - Date.now();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (diff < 0) return { label: `En retard ${Math.abs(days) || 1}j`, color: RED, dot: RED, urgent: true };
    if (hours < 24) return { label: `Expire dans ${hours}h`, color: RED, dot: RED, urgent: true };
    if (days === 1) return { label: "Expire demain", color: ORANGE, dot: ORANGE, urgent: true };
    return { label: `${days} jours restants`, color: MUT, dot: "#4ade80", urgent: false };
  };

  const getActionBtn = (action) => ({
    signature: { label: "Signer", tone: "primary" },
    validation: { label: "Valider", tone: "blue" },
    paraphe: { label: "Parapher", tone: "orange" },
    notification: { label: "Accuser", tone: "light" },
  }[action] || { label: "Traiter", tone: "light" });

  const actIcon = (action) => {
    if (["signe", "signature_completee", "signed", "signature_par_delegation"].includes(action)) return { el: "✓", bg: "#dcfce7", fg: "#16a34a" };
    if (["rejete", "rejected"].includes(action)) return { el: "✕", bg: "#fee2e2", fg: RED };
    if (["depot", "created"].includes(action)) return { el: "↑", bg: "#ede9fe", fg: ACC2 };
    if (["paraphe", "paraphe_appose"].includes(action)) return { el: "✎", bg: "#fef9c3", fg: "#a16207" };
    if (["delegation_appliquee", "creation_delegation"].includes(action)) return { el: "⇄", bg: "#f0f9ff", fg: BLUE };
    return { el: "•", bg: "#f1f5f9", fg: MUT };
  };

  const fmtRelTime = (iso) => {
    const diff = Date.now() - new Date(iso);
    const min = Math.floor(diff / 60000);
    if (min < 60) return `Il y a ${min} min`;
    const h = Math.floor(min / 60);
    if (h < 24) return `Il y a ${h}h${min % 60 ? ` ${min % 60}min` : ""}`;
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  const getStepTag = (step) => {
    const name = step?.assigneeName || step?.signers?.[0];
    if (!name) return null;
    const parts = String(name).trim().split(/\s+/);
    return parts.length > 1 ? parts.map((p) => p[0]).join("").toUpperCase().slice(0, 3) : String(name).slice(0, 3).toUpperCase();
  };

  const actionColors = { signature: ACC2, validation: BLUE, paraphe: ORANGE, notification: MUT };
  const actionBg = { signature: "#f5f3ff", validation: "#eff6ff", paraphe: "#fffbeb", notification: "#f8fafc" };
  const actionIcon = { signature: "✍", validation: "✓", paraphe: "✎", notification: "🔔" };

  return (
    <div style={{ fontFamily: FONT, width: "100%" }}>

      {/* ── Banner ── */}
      <div style={{ background: "linear-gradient(135deg,#5b21b6,#7c3aed)", borderRadius: 14, padding: "20px 26px", marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, color: WH }}>Bonjour, {authUser?.nom || "Utilisateur"} 👋</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.8)", marginTop: 4 }}>
            {dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1)} · Vous avez{" "}
            <b style={{ color: "#fde68a" }}>{allTasks.length} actions urgentes</b> en attente
            {blockedDocs.length > 0 && <> et <b style={{ color: "#fca5a5" }}>{blockedDocs.length} documents en retard</b></>}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
          <button onClick={() => setView("ss-depot")} style={{ padding: "10px 18px", borderRadius: 9, border: "1px solid rgba(255,255,255,.4)", background: "rgba(255,255,255,.14)", color: WH, cursor: "pointer", fontWeight: 800, fontSize: 13, fontFamily: FONT, display: "flex", alignItems: "center", gap: 7 }}>
            + Déposer un document
          </button>
          <button onClick={() => setView("ss-docs-received")} style={{ padding: "10px 18px", borderRadius: 9, border: "none", background: WH, color: ACC2, cursor: "pointer", fontWeight: 800, fontSize: 13, fontFamily: FONT, display: "flex", alignItems: "center", gap: 7 }}>
            ☰ Mes tâches
          </button>
        </div>
      </div>

      {/* ── 5 stat cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Initiés",  value: stats.initie,   color: ACC2,      icon: "✈", trend: "+4 ce mois",            trendColor: GREEN, up: true  },
          { label: "En cours", value: stats.enCours,  color: BLUE,      icon: "⟳", trend: `dont ${Math.min(urgentDocs.length, 3)} urgents`, trendColor: MUT,  up: null  },
          { label: "Signés",   value: stats.signes,   color: GREEN,     icon: "✍", trend: "+12 vs mois préc.",      trendColor: GREEN, up: true  },
          { label: "Rejetés",  value: stats.rejetes,  color: RED,       icon: "✕", trend: "-2 vs mois préc.",       trendColor: RED,   up: false },
          { label: "Archivés", value: stats.archives, color: "#94a3b8", icon: "▣", trend: "Total cumulé",           trendColor: MUT,  up: null  },
        ].map(({ label, value, color, icon, trend, trendColor, up }) => (
          <Card key={label} style={{ padding: "16px 18px", borderTop: `4px solid ${color}` }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 30, fontWeight: 950, color, lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "#475569", marginTop: 4 }}>{label}</div>
              </div>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, color, flexShrink: 0 }}>{icon}</div>
            </div>
            <div style={{ marginTop: 10, fontSize: 11.5, fontWeight: 700, color: trendColor, display: "flex", alignItems: "center", gap: 4 }}>
              {up === true && "↑ "}{up === false && "↓ "}{trend}
            </div>
          </Card>
        ))}
      </div>

      {/* ── Main 2-col ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 310px", gap: 18, marginBottom: 18 }}>

        {/* Documents à traiter */}
        <Card style={{ overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: `1px solid ${BD}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>📋</span>
              <b style={{ fontSize: 14, color: "#0f172a" }}>Documents à traiter</b>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 900, color: WH, background: ACC2, borderRadius: 20, padding: "2px 9px" }}>{allTasks.length}</span>
              <button onClick={() => setView("ss-docs-received")} style={{ border: 0, background: "transparent", color: ACC2, cursor: "pointer", fontWeight: 800, fontSize: 13, fontFamily: FONT }}>Tout voir →</button>
            </div>
          </div>
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: `1px solid ${BD}`, paddingLeft: 18, background: "#fafbfd" }}>
            {[
              { key: "all", label: "Tous", count: allTasks.length },
              { key: "signature", label: "Signature", count: tasksByAction.signature.length },
              { key: "validation", label: "Validation", count: tasksByAction.validation.length },
              { key: "paraphe", label: "Paraphe", count: tasksByAction.paraphe.length },
            ].map(({ key, label, count }) => (
              <button key={key} onClick={() => setTaskTab(key)} style={{
                padding: "10px 14px", border: "none", borderBottom: taskTab === key ? `2px solid ${ACC2}` : "2px solid transparent",
                background: "transparent", cursor: "pointer", fontFamily: FONT, fontSize: 12.5,
                fontWeight: taskTab === key ? 800 : 500, color: taskTab === key ? ACC2 : MUT,
                display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap",
              }}>
                {label}
                <span style={{ fontSize: 11, fontWeight: 900, padding: "1px 6px", borderRadius: 20, background: taskTab === key ? `${ACC2}18` : "#f1f5f9", color: taskTab === key ? ACC2 : MUT }}>{count}</span>
              </button>
            ))}
          </div>
          {/* Rows */}
          <div>
            {displayedTasks.slice(0, 6).map((doc) => {
              const step = activeSteps(doc)[0];
              const due = getDueInfo(step);
              const btn = getActionBtn(step?.action);
              const ac = step?.action;
              return (
                <div key={doc.id} style={{ padding: "12px 18px", borderBottom: `1px solid ${BD}`, display: "flex", alignItems: "center", gap: 12 }}>
                  <MiniAvatar name={doc.title} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 850, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.title}</div>
                    <div style={{ fontSize: 11.5, color: MUT, marginTop: 2 }}>
                      {SS_DOC_TYPES.find((t) => t.id === doc.type)?.label || doc.type}
                      {doc.amount ? ` · ${formatMoney(doc.amount, doc.currency)}` : ""}
                      {step ? ` · Étape ${step.order || 1} / ${doc.steps?.length || "?"}` : ""}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                    {step && (
                      <span style={{ fontSize: 11, fontWeight: 800, padding: "3px 9px", borderRadius: 20, background: actionBg[ac] || "#f8fafc", color: actionColors[ac] || MUT, border: `1px solid ${(actionColors[ac] || MUT)}33`, display: "flex", alignItems: "center", gap: 4 }}>
                        {actionIcon[ac]} {getAction(ac).label}
                      </span>
                    )}
                    {due && (
                      <span style={{ fontSize: 11, fontWeight: due.urgent ? 800 : 500, color: due.color, display: "flex", alignItems: "center", gap: 4 }}>
                        {due.urgent && <span style={{ width: 6, height: 6, borderRadius: "50%", background: due.color, display: "inline-block" }} />}
                        {due.label}
                      </span>
                    )}
                  </div>
                  <Button tone={btn.tone} onClick={() => onAction(doc)} style={{ flexShrink: 0 }}>{btn.label}</Button>
                </div>
              );
            })}
            {displayedTasks.length === 0 && (
              <div style={{ padding: "40px 20px", textAlign: "center", color: MUT, fontSize: 13 }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>✓</div>
                Aucun document à traiter pour ce filtre
              </div>
            )}
          </div>
        </Card>

        {/* Right col */}
        <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
          {/* Documents urgents */}
          <Card style={{ overflow: "hidden" }}>
            <div style={{ padding: "13px 16px", borderBottom: `1px solid ${BD}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ fontSize: 16 }}>🔴</span>
                <b style={{ fontSize: 13, color: "#0f172a" }}>Documents urgents</b>
              </div>
              <span style={{ fontSize: 11, fontWeight: 900, color: WH, background: RED, borderRadius: 20, padding: "2px 8px" }}>{urgentDocs.length}</span>
            </div>
            {urgentDocs.slice(0, 4).map((doc) => {
              const step = activeSteps(doc)[0];
              const due = getDueInfo(step);
              return (
                <div key={doc.id} onClick={() => onAction(doc)}
                  style={{ padding: "10px 16px", borderBottom: `1px solid ${BD}`, display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = WH)}>
                  <span style={{ width: 9, height: 9, borderRadius: "50%", background: due?.dot || ORANGE, flexShrink: 0, marginTop: 4 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 12.5, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.title}</div>
                    <div style={{ fontSize: 11, color: MUT, marginTop: 1 }}>{step?.label || getAction(step?.action).label} requise</div>
                  </div>
                  {due && <div style={{ fontSize: 11, fontWeight: 800, color: due.color, flexShrink: 0, whiteSpace: "nowrap" }}>{due.label}</div>}
                </div>
              );
            })}
            {urgentDocs.length === 0 && <div style={{ padding: "20px 16px", textAlign: "center", color: MUT, fontSize: 12.5 }}>Aucun document urgent</div>}
            {urgentDocs.length > 0 && (
              <div style={{ padding: "8px 16px", background: "#fffbeb", borderTop: `1px solid #fde68a` }}>
                <span style={{ fontSize: 11, color: "#a16207", fontWeight: 700 }}>🔔 Des relances automatiques ont été envoyées</span>
              </div>
            )}
          </Card>

          {/* Mes statistiques */}
          <Card style={{ padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
              <span style={{ fontSize: 16 }}>📊</span>
              <b style={{ fontSize: 13, color: "#0f172a" }}>Mes statistiques — {new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}</b>
            </div>
            {[
              { label: "Initiés",  value: stats.initie,   color: ACC2 },
              { label: "Signés",   value: stats.signes,   color: GREEN },
              { label: "En cours", value: stats.enCours,  color: BLUE },
              { label: "Rejetés",  value: stats.rejetes,  color: RED },
              { label: "Archivés", value: stats.archives, color: "#94a3b8" },
            ].map(({ label, value, color }) => {
              const maxV = Math.max(stats.archives, stats.signes, 1);
              return (
                <div key={label} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: "#374151", fontWeight: 600 }}>{label}</span>
                    <span style={{ fontSize: 12, fontWeight: 900, color }}>{value} docs</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 6, background: "#f1f5f9", overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 6, background: color, width: `${Math.max(4, (value / maxV) * 100)}%`, transition: "width .6s" }} />
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      </div>

      {/* ── Bottom 3-col ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18 }}>

        {/* Workflow bloqués */}
        <Card style={{ overflow: "hidden" }}>
          <div style={{ padding: "13px 18px", borderBottom: `1px solid ${BD}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ fontSize: 16 }}>⚠️</span>
              <b style={{ fontSize: 13, color: "#0f172a" }}>Workflow bloqués</b>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 900, color: ORANGE, background: "#fffbeb", border: `1px solid #fde68a`, borderRadius: 20, padding: "2px 8px" }}>{blockedDocs.length}</span>
              <button onClick={() => setView("ss-docs-received")} style={{ border: 0, background: "transparent", color: ACC2, cursor: "pointer", fontWeight: 800, fontSize: 12, fontFamily: FONT }}>Relancer →</button>
            </div>
          </div>
          {blockedDocs.slice(0, 4).map((doc) => {
            const step = activeSteps(doc).find(isOverdue);
            const days = daysLate(step);
            const dayColor = days >= 10 ? RED : days >= 7 ? ORANGE : "#ca8a04";
            const dayBg = days >= 10 ? "#fef2f2" : days >= 7 ? "#fffbeb" : "#fefce8";
            const tag = getStepTag(step);
            return (
              <div key={doc.id} style={{ padding: "12px 18px", borderBottom: `1px solid ${BD}`, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: dayBg, border: `1px solid ${dayColor}44`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 950, color: dayColor, lineHeight: 1 }}>{days}</div>
                  <div style={{ fontSize: 9, fontWeight: 800, color: dayColor, textTransform: "uppercase" }}>jours</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 800, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.title}</div>
                  <div style={{ fontSize: 11, color: MUT, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    Bloqué à : {step?.label} — {getAction(step?.action).label}
                  </div>
                </div>
                {tag && (
                  <div style={{ fontSize: 10.5, fontWeight: 900, color: "#1d4ed8", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 20, padding: "3px 8px", flexShrink: 0, display: "flex", alignItems: "center", gap: 4 }}>
                    👥 {tag}
                  </div>
                )}
              </div>
            );
          })}
          {blockedDocs.length === 0 && <div style={{ padding: "28px 18px", textAlign: "center", color: MUT, fontSize: 12.5 }}>✓ Aucun workflow bloqué</div>}
          {blockedDocs.length > 0 && (
            <div style={{ padding: "8px 18px", background: "#fffbeb", borderTop: `1px solid #fde68a` }}>
              <span style={{ fontSize: 11, color: "#a16207", fontWeight: 700 }}>🔔 {blockedDocs.length} relance{blockedDocs.length > 1 ? "s" : ""} automatique{blockedDocs.length > 1 ? "s" : ""} envoyée{blockedDocs.length > 1 ? "s" : ""} aujourd'hui</span>
            </div>
          )}
        </Card>

        {/* Activité récente */}
        <Card style={{ overflow: "hidden" }}>
          <div style={{ padding: "13px 18px", borderBottom: `1px solid ${BD}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ fontSize: 16 }}>🕐</span>
              <b style={{ fontSize: 13, color: "#0f172a" }}>Activité récente</b>
            </div>
            <button onClick={() => setView("ss-journaux")} style={{ border: 0, background: "transparent", color: ACC2, cursor: "pointer", fontWeight: 800, fontSize: 12, fontFamily: FONT }}>Voir journal →</button>
          </div>
          <div style={{ padding: "8px 18px" }}>
            {(audit || []).slice(0, 5).map((a, i) => {
              const ic = actIcon(a.action);
              const actionLabel = {
                signe: "a signé le document",
                signature_par_delegation: "a signé par délégation",
                rejete: "a rejeté avec motif",
                depot: "a déposé un nouveau document",
                paraphe_appose: "a apposé son paraphe",
                delegation_appliquee: "délégation appliquée",
                creation_delegation: "a créé une délégation",
              }[a.action] || a.action;
              const chip = a.detail ? a.detail.replace(/.*—\s*/, "").trim().slice(0, 35) : null;
              return (
                <div key={i} style={{ display: "flex", gap: 10, paddingBottom: 12, paddingTop: 4, borderBottom: i < Math.min((audit || []).length, 5) - 1 ? `1px solid ${BD}` : "none" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: ic.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: ic.fg, flexShrink: 0, marginTop: 2 }}>{ic.el}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, color: "#0f172a", lineHeight: 1.4 }}>
                      <b style={{ fontWeight: 800 }}>{a.user}</b>{" "}
                      <span style={{ color: "#475569" }}>{actionLabel}</span>
                    </div>
                    {chip && (
                      <div style={{ marginTop: 3, display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 11, background: "#f8fafc", border: `1px solid ${BD}`, borderRadius: 6, padding: "2px 7px", color: "#475569", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 180 }}>
                          📄 {chip}
                        </span>
                        <span style={{ fontSize: 11, color: MUT, flexShrink: 0 }}>{fmtRelTime(a.date)}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {(!audit || audit.length === 0) && <div style={{ padding: "20px 0", textAlign: "center", color: MUT, fontSize: 12.5 }}>Aucune activité récente</div>}
          </div>
        </Card>

        {/* Volume mensuel */}
        <Card style={{ overflow: "hidden" }}>
          <div style={{ padding: "13px 18px", borderBottom: `1px solid ${BD}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ fontSize: 16 }}>📈</span>
              <b style={{ fontSize: 13, color: "#0f172a" }}>Volume mensuel — {new Date().getFullYear()}</b>
            </div>
            <button onClick={() => setView("ss-rapports")} style={{ border: 0, background: "transparent", color: ACC2, cursor: "pointer", fontWeight: 800, fontSize: 12, fontFamily: FONT }}>Rapport →</button>
          </div>
          <div style={{ padding: "16px 18px" }}>
            {/* Bar chart */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 110, marginBottom: 10 }}>
              {chartData.map((d) => (
                <div key={d.mois} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end", gap: 0 }}>
                  <div style={{ width: "100%", display: "flex", gap: 2, alignItems: "flex-end", justifyContent: "center" }}>
                    <div style={{ flex: 1, background: d.current ? ACC2 : GREEN, borderRadius: "4px 4px 0 0", height: `${(d.signes / maxChartVal) * 100}%`, minHeight: 4 }} />
                    <div style={{ width: 6, background: RED, borderRadius: "4px 4px 0 0", height: `${(d.rejetes / maxChartVal) * 50}%`, minHeight: 2, opacity: 0.75 }} />
                  </div>
                  <div style={{ fontSize: 10.5, color: d.current ? ACC2 : MUT, fontWeight: d.current ? 900 : 500, marginTop: 4 }}>{d.mois}</div>
                </div>
              ))}
            </div>
            {/* Legend */}
            <div style={{ display: "flex", gap: 14, marginBottom: 14, flexWrap: "wrap" }}>
              {[{ color: GREEN, label: "Signés" }, { color: RED, label: "Rejetés" }, { color: ACC2, label: "Mois courant" }].map(({ color, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
                  <span style={{ fontSize: 11, color: MUT, fontWeight: 600 }}>{label}</span>
                </div>
              ))}
            </div>
            {/* KPIs */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, paddingTop: 12, borderTop: `1px solid ${BD}` }}>
              {[
                { value: stats.signes, label: "Signés / mois", color: GREEN },
                { value: "3.2j",       label: "Délai moyen",   color: BLUE  },
                { value: "91%",        label: "Taux validation",color: ACC2 },
              ].map(({ value, label, color }) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 950, color, lineHeight: 1 }}>{value}</div>
                  <div style={{ fontSize: 10.5, color: MUT, marginTop: 3, fontWeight: 600 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}

/* ── External document consultation modal ──────────────── */
function ExternalDocConsultModal({ doc, users, workflows, onClose, onProcess }) {
  const wf = workflows.find(w => w.id === doc.workflowId);
  const receiver = users.find(u => u.id === doc.receiverId);
  const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }) : "—";
  const fmtDateTime = (iso) => iso ? new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

  const conformiteMeta = {
    conforme:     { label: "Conforme",       color: GREEN,  bg: "#f0fdf4", icon: "✅" },
    reserves:     { label: "Avec réserves",  color: ORANGE, bg: "#fffbeb", icon: "⚠️" },
    non_conforme: { label: "Non conforme",   color: RED,    bg: "#fef2f2", icon: "❌" },
  };
  const conf = doc.conformite ? conformiteMeta[doc.conformite] : null;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.58)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 1060, maxHeight: "93vh", background: WH, borderRadius: 16, boxShadow: "0 28px 80px rgba(0,0,0,.26)", display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ padding: "16px 22px", borderBottom: `1px solid ${BD}`, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, background: "#fafbfd" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <b style={{ fontSize: 16, color: "#0f172a" }}>{doc.title || "Document sans titre"}</b>
                <StatusBadge status={doc.status} />
                {conf && <span style={{ fontSize: 11, fontWeight: 800, color: conf.color, background: conf.bg, borderRadius: 20, padding: "2px 9px", border: `1px solid ${conf.color}22` }}>{conf.icon} {conf.label}</span>}
              </div>
              <div style={{ fontSize: 12, color: MUT, marginTop: 4 }}>
                <b style={{ color: "#475569" }}>{doc.ref}</b>
                {doc.externalRef && <span style={{ marginLeft: 8, fontSize: 11, background: "#f5f3ff", color: ACC2, border: "1px solid #c4b5fd", borderRadius: 20, padding: "1px 8px", fontWeight: 800 }}>{doc.externalRef}</span>}
                <span style={{ marginLeft: 10 }}>Déposé le {fmtDateTime(doc.createdAt)}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "transparent", cursor: "pointer", color: MUT, fontSize: 24, lineHeight: 1, flexShrink: 0 }}>×</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: 22, background: "#f6f8fc" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 18, alignItems: "start" }}>

            {/* Left column — information panels */}
            <div style={{ display: "grid", gap: 14 }}>

              {/* 6 key fields */}
              <Card style={{ padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  </div>
                  <b style={{ fontSize: 14, color: "#0f172a" }}>Informations du document</b>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
                  {/* Référence */}
                  <div style={{ padding: "12px 14px", borderBottom: `1px solid #f1f5f9`, borderRight: `1px solid #f1f5f9` }}>
                    <div style={{ fontSize: 10.5, fontWeight: 800, color: MUT, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 5 }}>Référence</div>
                    <div style={{ fontSize: 14, fontWeight: 900, color: "#0f172a" }}>{doc.ref || "—"}</div>
                    <div style={{ fontSize: 11, color: MUT, marginTop: 2 }}>{SS_DOC_TYPES.find(t => t.id === doc.type)?.label || doc.type}</div>
                  </div>
                  {/* Titre */}
                  <div style={{ padding: "12px 14px", borderBottom: `1px solid #f1f5f9` }}>
                    <div style={{ fontSize: 10.5, fontWeight: 800, color: MUT, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 5 }}>Titre du document</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", lineHeight: 1.4 }}>{doc.title || "—"}</div>
                  </div>
                  {/* Expéditeur */}
                  <div style={{ padding: "12px 14px", borderBottom: `1px solid #f1f5f9`, borderRight: `1px solid #f1f5f9` }}>
                    <div style={{ fontSize: 10.5, fontWeight: 800, color: MUT, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 5 }}>Expéditeur</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>{doc.deposantName || "—"}</div>
                    {doc.sender && <div style={{ fontSize: 11, color: MUT, marginTop: 2 }}>{doc.sender}</div>}
                  </div>
                  {/* Projet / Site */}
                  <div style={{ padding: "12px 14px", borderBottom: `1px solid #f1f5f9` }}>
                    <div style={{ fontSize: 10.5, fontWeight: 800, color: MUT, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 5 }}>Projet / Site</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>{doc.projectName || doc.projectId || "—"}</div>
                    {doc.site && <div style={{ fontSize: 11, color: MUT, marginTop: 2 }}>📍 {doc.site}</div>}
                  </div>
                  {/* Montant */}
                  <div style={{ padding: "12px 14px", borderRight: `1px solid #f1f5f9` }}>
                    <div style={{ fontSize: 10.5, fontWeight: 800, color: MUT, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 5 }}>Montant</div>
                    {doc.amount
                      ? <>
                          <div style={{ fontSize: 14, fontWeight: 900, color: "#0f172a" }}>{formatMoney(doc.amount, doc.currency)} <span style={{ fontSize: 11, color: MUT }}>HT</span></div>
                          {doc.amountTtc && <div style={{ fontSize: 11.5, color: MUT, marginTop: 2 }}>{formatMoney(doc.amountTtc, doc.currency)} TTC</div>}
                        </>
                      : <div style={{ fontSize: 13, color: "#94a3b8" }}>Non renseigné</div>
                    }
                  </div>
                  {/* Date de dépôt */}
                  <div style={{ padding: "12px 14px" }}>
                    <div style={{ fontSize: 10.5, fontWeight: 800, color: MUT, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 5 }}>Date de dépôt</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>{fmtDate(doc.createdAt)}</div>
                    {doc.date && doc.date !== doc.createdAt?.slice(0, 10) && (
                      <div style={{ fontSize: 11, color: MUT, marginTop: 2 }}>Date doc. : {fmtDate(doc.date)}</div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Reception & traitement */}
              {(doc.receptionDate || doc.receiverName || doc.receptionNotes) && (
                <Card style={{ padding: 18, background: doc.conformite === "non_conforme" ? "#fef2f2" : doc.conformite === "reserves" ? "#fffbeb" : "#f0fdf4", border: `1px solid ${doc.conformite === "non_conforme" ? "#fecaca" : doc.conformite === "reserves" ? "#fde68a" : "#bbf7d0"}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 18 }}>{conf?.icon || "📥"}</span>
                    <b style={{ fontSize: 13.5 }}>Accusé de réception</b>
                    {conf && <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 800, color: conf.color }}>{conf.label}</span>}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {doc.receiverName && (
                      <div>
                        <div style={{ fontSize: 11, color: MUT, fontWeight: 700 }}>Receveur</div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>{doc.receiverName}</div>
                      </div>
                    )}
                    {doc.receptionDate && (
                      <div>
                        <div style={{ fontSize: 11, color: MUT, fontWeight: 700 }}>Date de réception</div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>{fmtDate(doc.receptionDate)}</div>
                      </div>
                    )}
                    {doc.processedBy && (
                      <div>
                        <div style={{ fontSize: 11, color: MUT, fontWeight: 700 }}>Traité par</div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>{doc.processedBy}</div>
                      </div>
                    )}
                    {doc.processedAt && (
                      <div>
                        <div style={{ fontSize: 11, color: MUT, fontWeight: 700 }}>Date de traitement</div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>{fmtDate(doc.processedAt)}</div>
                      </div>
                    )}
                  </div>
                  {doc.receptionNotes && (
                    <div style={{ marginTop: 12, padding: "10px 12px", background: "rgba(255,255,255,.7)", borderRadius: 8, fontSize: 12.5, color: "#334155", fontStyle: "italic", lineHeight: 1.5 }}>
                      "{doc.receptionNotes}"
                    </div>
                  )}
                </Card>
              )}

              {/* Workflow info */}
              <Card style={{ padding: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <span style={{ fontSize: 18 }}>⚡</span>
                  <b style={{ fontSize: 13.5 }}>Circuit de validation</b>
                  {doc.workflowName && <StatusBadge status={doc.status} />}
                </div>
                {doc.workflowName ? (
                  <>
                    <div style={{ marginBottom: 12, fontSize: 13, fontWeight: 800, color: ACC2 }}>{doc.workflowName}</div>
                    <div style={{ display: "grid", gap: 8 }}>
                      {(doc.steps || []).map((s, i) => (
                        <div key={s.id || i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, background: s.status === "active" ? "#eff6ff" : s.status === "done" ? "#f0fdf4" : "#f8fafc", border: `1px solid ${s.status === "active" ? "#bfdbfe" : s.status === "done" ? "#bbf7d0" : BD}` }}>
                          <div style={{ width: 26, height: 26, borderRadius: "50%", background: s.status === "done" ? GREEN : s.status === "active" ? BLUE : "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {s.status === "done"
                              ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                              : <span style={{ fontSize: 10, fontWeight: 900, color: s.status === "active" ? WH : MUT }}>{s.order}</span>}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 12.5, fontWeight: 800, color: "#0f172a" }}>{s.label}</div>
                            {s.doneByName && <div style={{ fontSize: 11, color: MUT }}>par {s.doneByName} · {fmtDate(s.doneAt)}</div>}
                          </div>
                          <ActionBadge action={s.action} />
                          <StepBadge status={s.status} />
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={{ color: "#94a3b8", fontSize: 12.5, padding: "10px 0" }}>
                    {doc.status === "en_attente_traitement"
                      ? "Ce document est en attente de traitement. Cliquez sur « Traiter » pour lancer le circuit."
                      : "Aucun workflow rattaché."}
                  </div>
                )}
              </Card>

              {/* Audit trail */}
              {(doc.audit || []).length > 0 && (
                <Card style={{ padding: 18 }}>
                  <b style={{ fontSize: 13.5, display: "block", marginBottom: 12 }}>🕐 Journal des événements</b>
                  <div style={{ display: "grid", gap: 0 }}>
                    {(doc.audit || []).slice(0, 10).map((a, i) => (
                      <div key={i} style={{ display: "flex", gap: 12, padding: "9px 0", borderTop: i > 0 ? `1px solid #f1f5f9` : undefined }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: i === 0 ? ACC2 : "#cbd5e1", marginTop: 5, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12.5, fontWeight: 700, color: "#0f172a" }}>{a.action}</div>
                          <div style={{ fontSize: 11.5, color: MUT }}>{a.user} · {fmtDateTime(a.date)}</div>
                          {a.detail && <div style={{ fontSize: 11.5, color: "#475569", marginTop: 2 }}>{a.detail}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Right column — PDF + annexes + meta */}
            <div style={{ display: "grid", gap: 14 }}>
              {/* PDF Preview */}
              {doc.fileB64 ? (
                <Card style={{ overflow: "hidden" }}>
                  <div style={{ padding: "11px 16px", borderBottom: `1px solid ${BD}`, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16 }}>📄</span>
                    <b style={{ fontSize: 13 }}>{doc.fileName || "Document PDF"}</b>
                    <span style={{ marginLeft: "auto", fontSize: 11, color: MUT }}>{doc.pages || 1} page(s)</span>
                  </div>
                  <ProcPdfMini fileB64={doc.fileB64} pages={doc.pages} />
                </Card>
              ) : (
                <Card style={{ padding: 20, textAlign: "center", color: "#94a3b8" }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>📄</div>
                  <div style={{ fontSize: 12.5 }}>Aperçu PDF non disponible</div>
                </Card>
              )}

              {/* Zones de signature */}
              {(doc.zones || []).length > 0 && (
                <Card style={{ padding: 16 }}>
                  <b style={{ fontSize: 13, display: "block", marginBottom: 10 }}>✍️ Zones configurées ({doc.zones.length})</b>
                  {doc.zones.map((z, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderTop: i > 0 ? `1px solid #f1f5f9` : undefined }}>
                      <ActionBadge action={z.action} />
                      <div style={{ flex: 1, fontSize: 12 }}>
                        <b>{userName(users, z.userId)}</b>
                        <div style={{ color: MUT, fontSize: 11 }}>Page {z.page} · {z.position}</div>
                      </div>
                    </div>
                  ))}
                </Card>
              )}

              {/* Annexes */}
              {(doc.annexes || []).length > 0 && (
                <Card style={{ padding: 16 }}>
                  <b style={{ fontSize: 13, display: "block", marginBottom: 10 }}>📎 Pièces jointes ({doc.annexes.length})</b>
                  {doc.annexes.map((a, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderTop: i > 0 ? `1px solid #f1f5f9` : undefined }}>
                      <span style={{ fontSize: 16 }}>📄</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.name}</div>
                        <div style={{ fontSize: 11, color: MUT }}>{Math.round((a.size || 0) / 1024)} Ko</div>
                      </div>
                    </div>
                  ))}
                </Card>
              )}

              {/* OCR data */}
              {doc.ocrData?.parsed && (
                <Card style={{ padding: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <span style={{ fontSize: 16 }}>🤖</span>
                    <b style={{ fontSize: 13 }}>Données OCR extraites</b>
                    {doc.ocrData.parsed.score != null && (
                      <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 800, color: doc.ocrData.parsed.score >= 70 ? GREEN : ORANGE, background: doc.ocrData.parsed.score >= 70 ? "#f0fdf4" : "#fffbeb", border: `1px solid ${doc.ocrData.parsed.score >= 70 ? "#bbf7d0" : "#fde68a"}`, borderRadius: 20, padding: "2px 8px" }}>
                        Score {doc.ocrData.parsed.score}%
                      </span>
                    )}
                  </div>
                  {[["Émetteur", doc.ocrData.parsed.emetteur], ["NIF", doc.ocrData.parsed.nif], ["Montant HT", doc.ocrData.parsed.ht], ["TVA", doc.ocrData.parsed.tva], ["Total TTC", doc.ocrData.parsed.total], ["IBAN", doc.ocrData.parsed.iban]].filter(([, v]) => v).map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderTop: `1px solid #f1f5f9`, fontSize: 12 }}>
                      <span style={{ color: MUT }}>{k}</span><b>{v}</b>
                    </div>
                  ))}
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 22px", borderTop: `1px solid ${BD}`, background: "#fafbfd", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexShrink: 0 }}>
          <div style={{ fontSize: 12, color: MUT }}>
            {doc.pages ? `${doc.pages} page(s) · ` : ""}{(doc.annexes || []).length} pièce(s) jointe(s) · Statut : <b style={{ color: "#0f172a" }}>{doc.status}</b>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Button onClick={onClose}>Fermer</Button>
            {doc.status === "en_attente_traitement" && (
              <Button tone="primary" onClick={() => { onClose(); onProcess?.(doc); }}
                style={{ background: `linear-gradient(135deg,${ACC},${ACC2})`, border: "none", color: WH, fontWeight: 900 }}>
                ▶ Traiter ce document
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentsView({ docs, setDocs, view, authUser, users, workflows = [], delegations = [], onOpen, onAction, onProcess, onRefresh, userSettings = {} }) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [consultDoc, setConsultDoc] = useState(null);
  const isExternalView = view === "ss-externes" || view === "ss-docs-external";

  // Auto-sync from localStorage when entering the external documents view
  useEffect(() => {
    if (isExternalView && onRefresh) onRefresh();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExternalView]);

  const filteredBase = getFilteredDocs(docs, view, authUser);
  const filtered = filteredBase.filter((d) => {
    if (type !== "all" && d.type !== type) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return [d.ref, d.title, d.deposantName, d.projectName, d.site].some((x) => String(x || "").toLowerCase().includes(q));
  });
  const launchWorkflow = (doc) => {
    const workflow = workflows.find((w) => w.id === doc.suggestedWorkflowId) || suggestWorkflow(workflows, doc);
    if (!workflow) return;
    const steps = hydrateWorkflowSteps(workflow, users, delegations, doc);
    setDocs((prev) => prev.map((item) => item.id === doc.id ? {
      ...item,
      status: "en_cours",
      workflowId: workflow.id,
      workflowName: workflow.name,
      steps,
      audit: [...(item.audit || []), createAudit(authUser?.nom || "Systeme", "lancement_workflow", `Workflow ${workflow.name} lance depuis la file de traitement`)],
    } : item));
  };
  const titleMap = {
    "ss-docs-my": "Mes documents",
    "ss-docs-internal": "Documents internes",
    "ss-internes": "Documents internes",
    "ss-docs-external": "Documents externes",
    "ss-externes": "Documents externes",
    "ss-docs-to-treat": "Documents a traiter",
    "ss-docs-received": "Reçus",
    "ss-docs-progress": "En cours",
    "ss-signes": "Documents signes",
    "ss-rejetes": "Documents rejetes",
    "ss-archives": "Documents archivés",
  };
  const receivers = isExternalView
    ? users.filter((u) => userSettings[u.id]?.receveurFourn !== undefined ? userSettings[u.id].receveurFourn : u.droits?.receveurFourn)
    : [];

  /* ── External-specific stats ── */
  const extStats = isExternalView ? {
    total:     filteredBase.length,
    attente:   filteredBase.filter(d => d.status === "en_attente_traitement").length,
    enCours:   filteredBase.filter(d => d.status === "en_cours").length,
    termine:   filteredBase.filter(d => ["signe","termine"].includes(d.status)).length,
    rejete:    filteredBase.filter(d => d.status === "rejete").length,
  } : null;

  const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  return (
    <div style={{ fontFamily: FONT }}>
      {/* Page header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>{titleMap[view] || "Documents SoftSign"}</h2>
          <p style={{ margin: "4px 0 0", color: MUT, fontSize: 12.5 }}>{filtered.length} document(s){search ? ` correspondant à "${search}"` : ""}</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Button onClick={onRefresh}>↺ Actualiser</Button>
          {!isExternalView && <Button tone="primary" onClick={() => setDocs((p) => p.map((d) => d.status === "termine" ? { ...d, status: "archive", archivedAt: new Date().toISOString(), updatedAt: new Date().toISOString(), audit: [...(d.audit || []), createAudit(authUser?.nom, "archivage", "Archivage manuel")] } : d))}>Archiver terminés</Button>}
        </div>
      </div>

      {/* External view — stat cards */}
      {isExternalView && extStats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 16 }}>
          {[
            ["Total reçus",        extStats.total,   ACC2,    "#f5f3ff"],
            ["En attente",         extStats.attente,  ORANGE, "#fffbeb"],
            ["En cours",          extStats.enCours,  BLUE,   "#eff6ff"],
            ["Traités / Signés",  extStats.termine,  GREEN,  "#f0fdf4"],
            ["Rejetés",           extStats.rejete,   RED,    "#fef2f2"],
          ].map(([label, val, col, bg]) => (
            <Card key={label} style={{ padding: "14px 16px", background: bg, border: `1px solid ${col}22` }}>
              <div style={{ fontSize: 26, fontWeight: 950, color: col }}>{val}</div>
              <div style={{ fontSize: 11.5, color: MUT, marginTop: 4, fontWeight: 700 }}>{label}</div>
            </Card>
          ))}
        </div>
      )}

      {/* Receivers info banner — only in external documents view */}
      {isExternalView && (
        <Card style={{ padding: 12, marginBottom: 14, background: receivers.length ? "#f0fdf4" : "#fffbeb", border: `1px solid ${receivers.length ? "#bbf7d0" : "#fde68a"}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18 }}>{receivers.length ? "📥" : "⚠"}</span>
            <div>
              <b style={{ fontSize: 12.5, color: receivers.length ? "#065f46" : "#92400e" }}>
                {receivers.length
                  ? `Receveurs configurés : ${receivers.map((u) => u.nom).join(", ")}`
                  : "Aucun receveur configuré — rendez-vous dans Paramètres › Utilisateurs & Rôles"}
              </b>
              <div style={{ fontSize: 11.5, color: MUT, marginTop: 1 }}>
                Les documents déposés via le portail fournisseur sont notifiés à ces utilisateurs.
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Search & filter bar */}
      <Card style={{ padding: 14, marginBottom: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder={isExternalView ? "Rechercher référence, titre, fournisseur, projet, site…" : "Rechercher référence, titre, projet, site…"}
          style={{ ...inputStyle, maxWidth: 400 }} />
        <select value={type} onChange={(e) => setType(e.target.value)} style={{ ...inputStyle, maxWidth: 210 }}>
          <option value="all">Tous les types</option>
          {SS_DOC_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
        </select>
      </Card>

      {/* ── EXTERNAL DOCUMENTS — specialized consultation table ── */}
      {isExternalView ? (
        <Card style={{ overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Référence", "Titre du document", "Expéditeur", "Projet / Site", "Montant", "Date de dépôt", "Statut", "Actions"].map((h) => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, color: MUT, textTransform: "uppercase", letterSpacing: ".05em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((doc) => {
                  const isPending = doc.status === "en_attente_traitement";
                  const step = activeSteps(doc)[0];
                  const conformiteColor = { conforme: GREEN, reserves: ORANGE, non_conforme: RED }[doc.conformite];
                  return (
                    <tr key={doc.id}
                      onClick={() => setConsultDoc(doc)}
                      style={{ borderTop: `1px solid ${BD}`, cursor: "pointer", transition: "background .12s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                      onMouseLeave={e => e.currentTarget.style.background = ""}>

                      {/* Référence */}
                      <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                        <b style={{ fontSize: 12.5, color: "#0f172a" }}>{doc.ref}</b>
                        <div style={{ fontSize: 10.5, color: MUT, marginTop: 2 }}>{SS_DOC_TYPES.find(t => t.id === doc.type)?.label || doc.type}</div>
                        {doc.externalRef && <div style={{ fontSize: 10, color: ACC2, marginTop: 2, fontWeight: 700 }}>{doc.externalRef}</div>}
                      </td>

                      {/* Titre */}
                      <td style={{ padding: "12px 14px", maxWidth: 260 }}>
                        <div style={{ fontWeight: 800, fontSize: 13, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.title || "—"}</div>
                        {doc.workflowName && <div style={{ fontSize: 11, color: ACC2, marginTop: 2 }}>⚡ {doc.workflowName}</div>}
                        {step && <div style={{ fontSize: 11, color: BLUE, marginTop: 2 }}>↳ {step.label}</div>}
                      </td>

                      {/* Expéditeur */}
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ fontWeight: 700, fontSize: 12.5, color: "#0f172a" }}>{doc.deposantName || "—"}</div>
                        {doc.sender && <div style={{ fontSize: 11, color: MUT, marginTop: 2 }}>{doc.sender}</div>}
                        {doc.receiverName && <div style={{ fontSize: 10.5, color: GREEN, marginTop: 3 }}>📥 {doc.receiverName}</div>}
                      </td>

                      {/* Projet / Site */}
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ fontWeight: 700, fontSize: 12.5, color: "#0f172a" }}>{doc.projectName || doc.projectId || "—"}</div>
                        {doc.site && <div style={{ fontSize: 11, color: MUT, marginTop: 2 }}>📍 {doc.site}</div>}
                      </td>

                      {/* Montant */}
                      <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                        {doc.amount
                          ? <><div style={{ fontWeight: 800, fontSize: 12.5, color: "#0f172a" }}>{formatMoney(doc.amount, doc.currency)}</div>
                              {doc.amountTtc && <div style={{ fontSize: 11, color: MUT, marginTop: 2 }}>TTC {formatMoney(doc.amountTtc, doc.currency)}</div>}</>
                          : <span style={{ color: "#94a3b8", fontSize: 12 }}>—</span>
                        }
                      </td>

                      {/* Date de dépôt */}
                      <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: "#0f172a" }}>{fmtDate(doc.createdAt)}</div>
                        {doc.receptionDate && <div style={{ fontSize: 11, color: GREEN, marginTop: 2 }}>✅ Reçu {fmtDate(doc.receptionDate)}</div>}
                        {conformiteColor && <div style={{ marginTop: 3, width: 8, height: 8, borderRadius: "50%", background: conformiteColor, display: "inline-block" }} />}
                      </td>

                      {/* Statut */}
                      <td style={{ padding: "12px 14px" }}>
                        <StatusBadge status={doc.status} />
                        {isPending && <div style={{ fontSize: 10.5, color: ORANGE, marginTop: 4, fontWeight: 800 }}>En attente de traitement</div>}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "12px 14px" }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <Button onClick={() => setConsultDoc(doc)} style={{ fontSize: 11.5, padding: "5px 12px" }}>
                            🔍 Consulter
                          </Button>
                          {isPending && (
                            <Button tone="primary" onClick={() => onProcess?.(doc)}
                              style={{ fontSize: 11.5, padding: "5px 12px", background: `linear-gradient(135deg,${ACC},${ACC2})`, border: "none", color: WH, fontWeight: 900 }}>
                              ▶ Traiter
                            </Button>
                          )}
                          {step && !isPending && (
                            <Button tone="blue" onClick={() => onAction(doc)} style={{ fontSize: 11.5, padding: "5px 12px" }}>
                              Voir action
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} style={{ padding: 48, textAlign: "center" }}>
                    <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
                    <div style={{ color: "#94a3b8", fontSize: 13 }}>Aucun document externe{search ? ` pour "${search}"` : ""}</div>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (

      /* ── STANDARD TABLE for all other doc views ── */
      <Card style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Reference", "Document", "Origine", "Workflow", "Etape actuelle", "Statut", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, color: MUT, textTransform: "uppercase", letterSpacing: ".05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => {
                const step = activeSteps(doc)[0];
                const mine = activeTaskForUser(doc, authUser?.id);
                return (
                  <tr key={doc.id} style={{ borderTop: `1px solid ${BD}` }}>
                    <td style={{ padding: "11px 14px" }}><b style={{ color: "#0f172a", fontSize: 12.5 }}>{doc.ref}</b><div style={{ color: "#94a3b8", fontSize: 11 }}>{doc.type}</div></td>
                    <td style={{ padding: "11px 14px", maxWidth: 300 }}><div style={{ fontWeight: 800, fontSize: 13 }}>{doc.title}</div><div style={{ fontSize: 11.5, color: MUT }}>{doc.projectName || doc.projectId} · {doc.site} · {formatMoney(doc.amount, doc.currency)}</div></td>
                    <td style={{ padding: "11px 14px", fontSize: 12.5 }}>{doc.origin === "externe" ? "Externe" : doc.origin === "softdocs" ? "SoftDocs" : "Interne"}<div style={{ color: "#94a3b8", fontSize: 11 }}>{doc.deposantName}</div></td>
                    <td style={{ padding: "11px 14px", fontSize: 12.5 }}>{doc.workflowName || "A rattacher"}</td>
                    <td style={{ padding: "11px 14px" }}>{step ? <><div style={{ fontSize: 12.5, fontWeight: 750 }}>{step.label}</div><ActionBadge action={step.action} /> {isOverdue(step) && <span style={{ marginLeft: 6, color: RED, fontSize: 11, fontWeight: 800 }}>Retard {daysLate(step)}j</span>}</> : <span style={{ color: "#94a3b8" }}>-</span>}</td>
                    <td style={{ padding: "11px 14px" }}><StatusBadge status={doc.status} /></td>
                    <td style={{ padding: "11px 14px" }}>
                      <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                        <Button onClick={() => onOpen(doc)}>Aperçu</Button>
                        {step && <Button tone={mine ? "primary" : "blue"} onClick={() => onAction(doc)}>{mine ? "Traiter" : "Voir action"}</Button>}
                        {!step && doc.status !== "en_attente_traitement" && doc.origin !== "externe" && <Button tone="primary" onClick={() => launchWorkflow(doc)}>Lancer workflow</Button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && <tr><td colSpan={7} style={{ padding: 38, textAlign: "center", color: "#94a3b8" }}>Aucun document</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
      )}

      {/* Consultation modal for external docs */}
      {consultDoc && (
        <ExternalDocConsultModal
          doc={consultDoc}
          users={users}
          workflows={workflows}
          onClose={() => setConsultDoc(null)}
          onProcess={(doc) => { setConsultDoc(null); onProcess?.(doc); }}
        />
      )}
    </div>
  );
}

function DocumentDetailModal({ doc, users, onClose, onAction }) {
  return (
    <Modal title={doc.title} subtitle={`${doc.ref} · ${doc.workflowName || "Sans workflow"}`} onClose={onClose} width={980}
      footer={<><Button onClick={onClose}>Fermer</Button>{activeSteps(doc).length > 0 && <Button tone="primary" onClick={onAction}>Traiter l'etape</Button>}</>}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 18 }}>
        <div style={{ display: "grid", gap: 12 }}>
          <Card style={{ padding: 16 }}>
            <h4 style={{ margin: "0 0 12px" }}>Informations document</h4>
            {[
              ["Reference", doc.ref],
              ["Type", doc.type],
              ["Origine", doc.origin],
              ["Projet", doc.projectName || doc.projectId],
              ["Site", doc.site],
              ["Montant", formatMoney(doc.amount, doc.currency)],
              ["Deposant", doc.deposantName],
              ["Statut", <StatusBadge key="s" status={doc.status} />],
            ].map(([k, v]) => <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "7px 0", borderBottom: `1px solid ${BD}`, fontSize: 12.5 }}><span style={{ color: MUT }}>{k}</span><b style={{ textAlign: "right" }}>{v}</b></div>)}
          </Card>
          <Card style={{ padding: 16 }}>
            <h4 style={{ margin: "0 0 12px" }}>Zones PDF configurees</h4>
            {(doc.zones || []).length === 0 ? <div style={{ color: "#94a3b8", fontSize: 12 }}>Aucune zone configuree</div> : doc.zones.map((z) => (
              <div key={z.id} style={{ border: `1px solid ${BD}`, borderRadius: 8, padding: 10, marginBottom: 8, fontSize: 12 }}>
                <ActionBadge action={z.action} /> <b style={{ marginLeft: 6 }}>{userName(users, z.userId)}</b>
                <div style={{ color: MUT, marginTop: 4 }}>{z.mode} · {z.position} · page {z.page}</div>
              </div>
            ))}
          </Card>
        </div>
        <Card style={{ padding: 16 }}>
          <h4 style={{ margin: "0 0 12px" }}>Progression workflow</h4>
          <div style={{ display: "grid", gap: 10 }}>
            {(doc.steps || []).map((s) => (
              <div key={s.id} style={{ display: "grid", gridTemplateColumns: "42px 1fr auto", gap: 10, alignItems: "center", padding: 12, border: `1px solid ${BD}`, borderRadius: 9, background: s.status === "active" ? "#eff6ff" : WH }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: s.status === "done" ? GREEN : s.status === "rejected" ? RED : s.status === "active" ? BLUE : "#e2e8f0", color: WH, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>{s.order}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 850 }}>{s.label}</div>
                  <div style={{ color: MUT, fontSize: 11.5 }}>{(s.signers || []).map((id) => userName(users, id)).join(", ")} {s.delegatedFromName ? `(par delegation de ${s.delegatedFromName})` : ""}</div>
                  {s.comment && <div style={{ color: "#475569", fontSize: 11.5, marginTop: 4 }}>{s.comment}</div>}
                </div>
                <div style={{ textAlign: "right" }}><ActionBadge action={s.action} /><div style={{ marginTop: 5 }}><StepBadge status={s.status} /></div></div>
              </div>
            ))}
          </div>
          <h4 style={{ margin: "18px 0 10px" }}>Journal audit</h4>
          {(doc.audit || []).map((a, i) => <div key={i} style={{ padding: "8px 0", borderTop: `1px solid ${BD}`, fontSize: 12 }}><b>{a.user}</b> · {a.action}<div style={{ color: MUT }}>{a.detail} · {new Date(a.date).toLocaleString("fr-FR")}</div></div>)}
        </Card>
      </div>
    </Modal>
  );
}

function OcrBadge() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 3, background: "#fff7ed", color: "#d97706", border: "1px solid #fed7aa", borderRadius: 5, fontSize: 10.5, fontWeight: 800, padding: "1px 6px", marginLeft: 6, verticalAlign: "middle" }}>
      — OCR
    </span>
  );
}

function AnnexeItem({ file, onRemove }) {
  const ext = file.name.split(".").pop().toUpperCase();
  const extColor = { PDF: "#ef4444", DOCX: "#2563eb", XLSX: "#059669", JPG: "#f59e0b", PNG: "#f59e0b" }[ext] || MUT;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: BG, borderRadius: 8, border: `1px solid ${BD}` }}>
      <span style={{ fontSize: 11, fontWeight: 900, color: extColor, background: `${extColor}18`, padding: "2px 6px", borderRadius: 4, minWidth: 34, textAlign: "center" }}>{ext}</span>
      <span style={{ flex: 1, fontSize: 12.5, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</span>
      <span style={{ fontSize: 11.5, color: MUT }}>{(file.size / 1024).toFixed(0)} Ko</span>
      <button onClick={onRemove} style={{ background: "none", border: "none", cursor: "pointer", color: RED, fontSize: 16, padding: "0 2px", lineHeight: 1 }}>×</button>
    </div>
  );
}

function DepositWizard({ docs, setDocs, workflows, setWorkflows, notifs, setNotifs, audit, setAudit, signatures, delegations, authUser, users, projets, setView, generalSettings, sourceDoc = null, onExit }) {
  const isExternalConsultation = !!sourceDoc;
  const minStep = isExternalConsultation ? 1 : 0;
  const [step, setStep] = useState(minStep);
  const [ocrStatus, setOcrStatus] = useState("");
  const [ocrProgress, setOcrProgress] = useState(0);
  const [infoTab, setInfoTab] = useState("ocr");
  const [draft, setDraft] = useState(() => ({
    ref: "",
    title: "",
    type: "",
    amount: "",
    amountTtc: "",
    currency: "MGA",
    date: isoDate(),
    delai: "",
    commentaire: "",
    projectId: projets?.[0]?.id || "",
    projectName: projets?.[0]?.nom || "",
    site: projets?.[0]?.sites?.[0] || "",
    priority: "normale",
    workflowId: "",
    zones: [],
    annexes: [],
    ...(sourceDoc ? {
      ref: sourceDoc.ref || "",
      title: sourceDoc.title || "",
      type: sourceDoc.type || "",
      amount: sourceDoc.amount || "",
      amountTtc: sourceDoc.amountTtc || "",
      currency: sourceDoc.currency || "MGA",
      date: sourceDoc.date || sourceDoc.createdAt?.slice(0, 10) || isoDate(),
      delai: sourceDoc.delai || sourceDoc.duree || "",
      commentaire: sourceDoc.commentaire || sourceDoc.receptionNotes || "",
      projectId: sourceDoc.projectId || projets?.[0]?.id || "",
      projectName: sourceDoc.projectName || getProjectName(projets, sourceDoc.projectId),
      site: sourceDoc.site || projets?.[0]?.sites?.[0] || "",
      priority: sourceDoc.priority || "normale",
      workflowId: sourceDoc.workflowId || "",
      zones: sourceDoc.zones || [],
      annexes: sourceDoc.annexes || [],
      fileName: sourceDoc.fileName || "",
      fileB64: resolveSoftSignDocumentSource(sourceDoc),
      pages: sourceDoc.pages || 1,
      ocrData: sourceDoc.ocrData || null,
    } : {}),
  }));

  const dynamicDocTypes = useMemo(() => getSoftSignDocumentTypes(generalSettings).filter((t) => t.active), [generalSettings]);
  const recommended = useMemo(() => suggestWorkflow(workflows, draft), [workflows, draft]);
  const selectedWorkflow = workflows.find((w) => w.id === (draft.workflowId || recommended?.id)) || recommended;
  const sites = getSitesForProject(projets, draft.projectId);
  const allowedFormatIds = useMemo(
    () => new Set(getSoftSignAllowedFormatIds(generalSettings, draft.projectId, draft.site)),
    [generalSettings, draft.projectId, draft.site]
  );
  const allowedAccept = getSoftSignAccept(generalSettings, draft.projectId, draft.site);
  const allowedFormatLabel = SS_ALLOWED_FORMATS
    .filter((format) => allowedFormatIds.has(format.id))
    .map((format) => format.label)
    .join(", ");

  useEffect(() => {
    if (!draft.workflowId && recommended?.id) setDraft((p) => ({ ...p, workflowId: recommended.id }));
  }, [recommended?.id]);

  useEffect(() => {
    if (!draft.type && dynamicDocTypes.length) setDraft((p) => ({ ...p, type: dynamicDocTypes[0].id }));
  }, [dynamicDocTypes]);

  const set = (key, value) => setDraft((p) => ({ ...p, [key]: value }));

  const handleFile = async (file) => {
    if (!isSoftSignFileAllowed(file, generalSettings, draft.projectId, draft.site)) {
      setOcrStatus(`Format non autorisé pour ce projet/site. Formats acceptés : ${allowedFormatLabel || "PDF"}.`);
      return;
    }
    setOcrProgress(10);
    setOcrStatus("Lecture du fichier...");
    const b64 = await toBase64(file);
    setDraft((p) => ({ ...p, fileName: file.name, fileB64: b64, title: p.title || file.name.replace(/\.[^.]+$/, "") }));
    setOcrProgress(40);
    try {
      const data = await runOcrForFile(file, (msg) => { setOcrStatus(msg); setOcrProgress((p) => Math.min(p + 20, 90)); });
      setDraft((p) => ({
        ...p,
        ocrData: data,
        ref: p.ref || data.numero || "",
        title: p.title || data.emetteur || file.name.replace(/\.[^.]+$/, ""),
        date: p.date || data.date_doc || isoDate(),
        amount: p.amount || data.ht || data.total || "",
        amountTtc: p.amountTtc || data.total || "",
      }));
      setOcrProgress(100);
      setOcrStatus(`OCR terminé - score ${data.score || 0}%`);
    } catch (e) {
      setOcrProgress(100);
      setOcrStatus(`OCR indisponible: ${e.message || "saisie manuelle"}`);
    }
  };

  const handleAnnexeFile = async (file) => {
    const fileB64 = await toBase64(file);
    setDraft((p) => ({ ...p, annexes: [...(p.annexes || []), { name: file.name, size: file.size, type: file.type, fileB64 }] }));
  };

  const startWorkflow = () => {
    const projectName = getProjectName(projets, draft.projectId);
    const typeToUse = draft.type || dynamicDocTypes[0]?.id || "contrat";
    if (sourceDoc) {
      const workflowChanged = sourceDoc.workflowId !== selectedWorkflow?.id;
      const shouldLaunch = sourceDoc.status === "en_attente_traitement" || !(sourceDoc.steps || []).length || workflowChanged;
      const steps = shouldLaunch ? hydrateWorkflowSteps(selectedWorkflow, users, delegations, { ...sourceDoc, ...draft, type: typeToUse, projectName }) : sourceDoc.steps;
      const updated = {
        ...sourceDoc,
        ...draft,
        type: typeToUse,
        projectName,
        workflowId: selectedWorkflow?.id || sourceDoc.workflowId || "",
        workflowName: selectedWorkflow?.name || sourceDoc.workflowName || "",
        status: shouldLaunch && selectedWorkflow ? "en_cours" : sourceDoc.status,
        steps,
        zones: draft.zones || [],
        annexes: draft.annexes || [],
        processedAt: new Date().toISOString(),
        processedBy: authUser?.nom || "",
        audit: [...(sourceDoc.audit || []), createAudit(authUser?.nom, shouldLaunch ? "lancement_workflow_externe" : "consultation_externe", shouldLaunch ? `Workflow « ${selectedWorkflow?.name || "Manuel"} » lancé depuis la consultation du dépôt externe` : "Consultation du dépôt externe enregistrée")],
      };
      setDocs((current) => current.map((doc) => doc.id === updated.id ? updated : doc));
      setAudit((current) => [updated.audit[updated.audit.length - 1], ...current]);
      setNotifs((current) => shouldLaunch ? [{ id: `N-${Date.now()}`, type: "workflow", message: `${updated.ref} · circuit externe ${updated.workflowName} lancé`, lu: false, date: new Date().toISOString(), docId: updated.id }, ...current] : current);
      onExit?.();
      return;
    }
    const doc = createSoftSignDocument({ draft: { ...draft, type: typeToUse, projectName }, workflow: selectedWorkflow, users, delegations, authUser, origin: "interne" });
    setDocs((p) => [doc, ...p]);
    setAudit((p) => [doc.audit[0], ...p]);
    setNotifs((p) => [{ id: `N-${Date.now()}`, type: "workflow", message: `${doc.ref} lancé dans le workflow ${doc.workflowName}`, lu: false, date: new Date().toISOString(), docId: doc.id }, ...p]);
    setView("ss-docs-my");
  };

  const requiredZoneSteps = (selectedWorkflow?.steps || []).filter((s) => isZoneRequired(s.action));
  const isOcr = infoTab === "ocr";
  const ocr = draft.ocrData || {};
  const currentDocType = dynamicDocTypes.find((t) => t.id === draft.type) || dynamicDocTypes[0];

  const STEPS = [
    { title: "Dépôt & OCR",      sub: "Upload du fichier" },
    { title: "Informations",      sub: "Métadonnées" },
    { title: "Annexes & Aperçu", sub: "Documents joints" },
    { title: "Type & Workflow",   sub: "Circuit de validation" },
    { title: "Zones de signature",sub: "Emplacement PDF" },
    { title: "Envoi",             sub: "Lancement du circuit" },
  ];

  return (
    <div style={{ fontFamily: FONT }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11.5, color: MUT, marginBottom: 4 }}>
          <span style={{ cursor: "pointer" }} onClick={() => setView("ss-dashboard")}>Tableau de bord</span>
          {" › "}<span style={{ cursor: "pointer" }} onClick={() => setView("ss-dashboard")}>SoftSign</span>
          {" › "}{isExternalConsultation ? "Consultation document externe" : "Dépôt interne"}
        </div>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 950 }}>{isExternalConsultation ? "Consultation du document externe" : "Dépôt de document"}</h2>
        <p style={{ margin: "4px 0 0", color: MUT, fontSize: 13 }}>{isExternalConsultation ? "Consultez les informations reçues, puis poursuivez le même circuit de traitement que pour un nouveau dépôt." : "Importez un PDF, vérifiez les données OCR, choisissez le workflow et configurez les zones."}</p>
      </div>

      <ProgressStepper current={step} steps={STEPS} />

      <div style={{ marginTop: 18 }}>
        {/* ── Step 0: Dépôt & OCR ── */}
        {step === 0 && (
          <Card style={{ padding: 22 }}>
            <h3 style={{ marginTop: 0, marginBottom: 16 }}>Import du document principal</h3>
            <FileDrop fileName={draft.fileName} onFile={handleFile} accept={allowedAccept} />

            {/* Filename bar */}
            {draft.fileName && (
              <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", background: "#f5f3ff", border: `1px solid ${ACC2}44`, borderRadius: 8 }}>
                <span style={{ fontSize: 18 }}>📄</span>
                <span style={{ fontWeight: 800, fontSize: 13.5, color: ACC2, flex: 1 }}>{draft.fileName}</span>
                {ocrProgress === 100 && <span style={{ fontSize: 11, color: GREEN, fontWeight: 700 }}>✓ Prêt</span>}
              </div>
            )}

            {/* OCR Progress */}
            {ocrProgress > 0 && ocrProgress < 100 && (
              <div style={{ marginTop: 10 }}>
                <div style={{ height: 6, background: BD, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${ocrProgress}%`, background: `linear-gradient(90deg,${ACC2},${BLUE})`, borderRadius: 4, transition: "width .4s ease" }} />
                </div>
              </div>
            )}
            {ocrProgress === 100 && (
              <div style={{ marginTop: 10 }}>
                <div style={{ height: 6, background: BD, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: "100%", background: RED, borderRadius: 4 }} />
                </div>
              </div>
            )}

            {ocrStatus && (
              <div style={{ marginTop: 8, padding: "7px 12px", background: ocrStatus.includes("score") ? "#f0fdf4" : "#eff6ff", color: ocrStatus.includes("score") ? GREEN : BLUE, borderRadius: 7, fontSize: 12.5, fontWeight: 700 }}>
                {ocrStatus}
              </div>
            )}

            <div style={{ marginTop: 10, color: MUT, fontSize: 12 }}>
              OCR automatique, PDF natif ou scanné, max recommandé 50 Mo
            </div>
          </Card>
        )}

        {/* ── Step 1: Informations ── */}
        {step === 1 && (
          <Card style={{ padding: 0, overflow: "hidden" }}>
            {/* Card header */}
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BD}`, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18 }}>🎯</span>
              <span style={{ fontWeight: 800, fontSize: 15 }}>Données du document</span>
            </div>

            {/* OCR / Manual tabs */}
            <div style={{ padding: "0 20px", borderBottom: `1px solid ${BD}`, display: "flex", gap: 0 }}>
              {[
                { id: "ocr", label: "— Données OCR extraites" },
                { id: "manual", label: "≡ Saisie manuelle" },
              ].map((t) => (
                <button key={t.id} onClick={() => setInfoTab(t.id)} style={{
                  padding: "11px 18px", border: "none", borderBottom: `2.5px solid ${infoTab === t.id ? ACC2 : "transparent"}`,
                  background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: infoTab === t.id ? 800 : 500,
                  color: infoTab === t.id ? ACC2 : MUT, fontFamily: FONT,
                }}>
                  {t.label}
                </button>
              ))}
            </div>

            <div style={{ padding: "20px" }}>
              {isExternalConsultation && (
                <div style={{ marginBottom: 16, padding: "11px 13px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, color: BLUE, fontSize: 12.5 }}>
                  Mode consultation : les informations reçues du portail fournisseur sont affichées en lecture seule.
                </div>
              )}
              {/* Title hint */}
              <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 900 }}>
                Informations du document
              </h3>
              <p style={{ margin: "0 0 18px", fontSize: 12.5, color: MUT }}>
                Vérifiez et complétez les informations {isOcr ? "extraites automatiquement par OCR" : "saisies manuellement"}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {/* N° référence interne */}
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: MUT, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 5 }}>
                    N° de référence interne {isOcr && ocr.numero && <OcrBadge />}
                  </label>
                  <input style={{ ...inputStyle, background: isOcr && ocr.numero ? "#fffbeb" : undefined, borderColor: isOcr && ocr.numero ? "#fbbf24" : undefined }}
                    value={draft.ref} onChange={(e) => set("ref", e.target.value)} placeholder="Ex: REF-2026-001" disabled={isExternalConsultation} />
                </div>

                {/* Date du document */}
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: MUT, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 5 }}>
                    Date du document {isOcr && ocr.date_doc && <OcrBadge />}
                  </label>
                  <input type="date" style={{ ...inputStyle, background: isOcr && ocr.date_doc ? "#fffbeb" : undefined, borderColor: isOcr && ocr.date_doc ? "#fbbf24" : undefined }}
                    value={draft.date} onChange={(e) => set("date", e.target.value)} disabled={isExternalConsultation} />
                </div>

                {/* Titre / Objet */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: MUT, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 5 }}>
                    Titre / Objet du document *
                  </label>
                  <input style={inputStyle} value={draft.title} onChange={(e) => set("title", e.target.value)} disabled={isExternalConsultation}
                    placeholder="Ex: Contrat de fourniture de matériels et équipements informatiques — Lot 1 DSI" />
                </div>

                {/* Montant HT */}
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: MUT, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 5 }}>
                    Montant HT (MGA) * {isOcr && (ocr.ht || ocr.total) && <OcrBadge />}
                  </label>
                  <input type="number" style={{ ...inputStyle, background: isOcr && (ocr.ht || ocr.total) ? "#fffbeb" : undefined, borderColor: isOcr && (ocr.ht || ocr.total) ? "#fbbf24" : undefined }}
                    value={draft.amount} onChange={(e) => set("amount", e.target.value)} disabled={isExternalConsultation} />
                </div>

                {/* Montant TTC */}
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: MUT, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 5 }}>
                    Montant TTC (MGA) {isOcr && ocr.total && <OcrBadge />}
                  </label>
                  <input type="number" style={{ ...inputStyle, background: isOcr && ocr.total ? "#fffbeb" : undefined, borderColor: isOcr && ocr.total ? "#fbbf24" : undefined }}
                    value={draft.amountTtc} onChange={(e) => set("amountTtc", e.target.value)} disabled={isExternalConsultation} />
                </div>

                {/* Devise */}
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: MUT, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 5 }}>Devise</label>
                  <select style={inputStyle} value={draft.currency} onChange={(e) => set("currency", e.target.value)} disabled={isExternalConsultation}>
                    <option value="MGA">MGA — Ariary malgache</option>
                    <option value="EUR">EUR — Euro</option>
                    <option value="USD">USD — Dollar américain</option>
                  </select>
                </div>

                {/* Délai / Durée */}
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: MUT, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 5 }}>Délai de validité / Durée</label>
                  <input style={inputStyle} value={draft.delai} onChange={(e) => set("delai", e.target.value)} disabled={isExternalConsultation}
                    placeholder="Ex: 12 mois à compter de la signature" />
                </div>

                {/* Projet */}
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: MUT, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 5 }}>Projet / Marché concerné *</label>
                  <select style={inputStyle} value={draft.projectId} disabled={isExternalConsultation} onChange={(e) => {
                    const p = projets.find((x) => x.id === e.target.value);
                    setDraft((old) => ({ ...old, projectId: e.target.value, projectName: p?.nom || "", site: p?.sites?.[0] || "" }));
                  }}>
                    {(projets || []).map((p) => <option key={p.id} value={p.id}>🎯 {p.nom}</option>)}
                  </select>
                </div>

                {/* Site */}
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: MUT, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 5 }}>Site / Direction destinataire *</label>
                  <select style={inputStyle} value={draft.site} onChange={(e) => set("site", e.target.value)} disabled={isExternalConsultation}>
                    {sites.map((s) => <option key={s} value={s}>📍 {s}</option>)}
                  </select>
                </div>

                {/* Commentaire */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: MUT, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 5 }}>Commentaire</label>
                  <textarea
                    rows={3}
                    style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}
                    value={draft.commentaire}
                    onChange={(e) => set("commentaire", e.target.value)}
                    disabled={isExternalConsultation}
                    placeholder="Observations ou informations complémentaires..."
                  />
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* ── Step 2: Annexes & Aperçu ── */}
        {step === 2 && (
          <div>
            <h3 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 900 }}>Annexes &amp; Aperçu</h3>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: MUT }}>Vérifiez l&apos;aperçu du document et ajoutez les pièces jointes si nécessaire</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 18, alignItems: "start" }}>
              {/* PDF preview */}
              <Card style={{ padding: 16, overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <span style={{ fontSize: 16 }}>📄</span>
                  <span style={{ fontWeight: 800, fontSize: 13.5, flex: 1 }}>{draft.fileName || "Document"}</span>
                  <span style={{ fontSize: 12, color: MUT }}>
                    {draft.fileB64 ? "1 page(s)" : "Aucun fichier"}
                  </span>
                </div>
                {draft.fileB64 ? (
                  <div style={{ background: "#374151", borderRadius: 8, overflow: "hidden", minHeight: 480, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <iframe
                      src={filePreviewSrc(draft.fileB64)}
                      style={{ width: "100%", height: 480, border: "none", display: "block" }}
                      title="Aperçu PDF"
                    />
                  </div>
                ) : (
                  <div style={{ background: "#f1f5f9", borderRadius: 8, minHeight: 320, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: MUT, gap: 8 }}>
                    <span style={{ fontSize: 40 }}>📋</span>
                    <span style={{ fontSize: 13 }}>Aucun document chargé</span>
                  </div>
                )}
              </Card>

              {/* Annexes panel */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Card style={{ padding: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <span style={{ fontSize: 15 }}>📎</span>
                    <span style={{ fontWeight: 800, fontSize: 14 }}>Documents joints ({(draft.annexes || []).length})</span>
                  </div>

                  {/* Upload zone */}
                  <label style={{
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    padding: "24px 16px", border: `2px dashed ${ACC2}55`, borderRadius: 10,
                    background: `${ACC2}06`, cursor: "pointer", marginBottom: 12,
                  }}>
                    <input type="file" style={{ display: "none" }} accept=".pdf,.jpg,.jpeg,.png,.docx,.xlsx"
                      onChange={(e) => { if (e.target.files?.[0]) handleAnnexeFile(e.target.files[0]); }} multiple />
                    <span style={{ fontSize: 22, marginBottom: 6 }}>📎</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: ACC2, marginBottom: 2 }}>Ajouter une pièce jointe</span>
                    <span style={{ fontSize: 11.5, color: MUT }}>PDF, images, Excel · Max 20 Mo</span>
                  </label>

                  {(draft.annexes || []).length === 0 ? (
                    <p style={{ textAlign: "center", color: MUT, fontSize: 12.5, margin: "10px 0" }}>Aucune pièce jointe</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {(draft.annexes || []).map((f, i) => (
                        <AnnexeItem key={i} file={f} onRemove={() => setDraft((p) => ({ ...p, annexes: p.annexes.filter((_, j) => j !== i) }))} />
                      ))}
                    </div>
                  )}
                </Card>

                <div style={{ padding: "12px 14px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 9, fontSize: 12.5, color: "#166534", lineHeight: 1.5 }}>
                  <b>📋 Rappel :</b> Les annexes sont transmises avec le document principal. Elles seront consultables par l&apos;équipe interne.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 3: Type & Workflow ── */}
        {step === 3 && (
          <div style={{ display: "grid", gap: 18 }}>
            <Card style={{ padding: 22 }}>
              <h3 style={{ marginTop: 0 }}>Type de document</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
                {dynamicDocTypes.map((t) => (
                  <button key={t.id} onClick={() => set("type", t.id)} style={{
                    padding: 18, borderRadius: 10, border: `2px solid ${draft.type === t.id ? ACC2 : BD}`,
                    background: draft.type === t.id ? "#f5f3ff" : WH, cursor: "pointer", fontFamily: FONT, textAlign: "left",
                  }}>
                    <div style={{ fontWeight: 900, color: draft.type === t.id ? ACC2 : `var(--ss-text,#1e293b)` }}>{t.label}</div>
                    {t.desc && <div style={{ color: MUT, fontSize: 12, marginTop: 6 }}>{t.desc}</div>}
                  </button>
                ))}
              </div>
            </Card>
            <Card style={{ padding: 22 }}>
              <h3 style={{ marginTop: 0 }}>Choix du workflow{" "}
                <span style={{ fontSize: 12, color: ACC2, background: "#f5f3ff", borderRadius: 20, padding: "2px 8px" }}>{currentDocType?.label}</span>
              </h3>
              {recommended && (
                <div style={{ padding: 12, background: "#eff6ff", color: BLUE, border: "1px solid #bfdbfe", borderRadius: 9, marginBottom: 14, fontSize: 13 }}>
                  Le système recommande <b>{recommended.name}</b> selon le type, le montant et les conditions définies.
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
                {workflows.filter((w) => !w.docTypes?.length || w.docTypes.includes(draft.type)).map((wf) => (
                  <button key={wf.id} onClick={() => set("workflowId", wf.id)} style={{
                    padding: 14, minHeight: 116, borderRadius: 10,
                    border: `2px solid ${(draft.workflowId || recommended?.id) === wf.id ? ACC2 : BD}`,
                    background: (draft.workflowId || recommended?.id) === wf.id ? "#f5f3ff" : WH,
                    cursor: "pointer", textAlign: "left", fontFamily: FONT,
                  }}>
                    {recommended?.id === wf.id && <span style={{ color: GREEN, background: "#dcfce7", borderRadius: 20, padding: "2px 8px", fontSize: 10, fontWeight: 900 }}>Recommandé</span>}
                    <div style={{ fontWeight: 900, marginTop: 6 }}>{wf.name}</div>
                    <div style={{ color: MUT, fontSize: 12, marginTop: 4 }}>{wf.desc}</div>
                    <div style={{ color: ACC2, marginTop: 8 }}>{Array.from({ length: Math.min(5, (wf.steps ?? []).length) }).map((_, i) => <span key={i}>●</span>)}</div>
                  </button>
                ))}
              </div>
            </Card>
            {selectedWorkflow && <WorkflowPreview workflow={selectedWorkflow} users={users} />}
          </div>
        )}

        {/* ── Step 4: Zones de signature ── */}
        {step === 4 && (
          <Card style={{ padding: 22 }}>
            <h3 style={{ marginTop: 0 }}>Configuration des zones PDF</h3>
            <div style={{ padding: 12, background: "#eff6ff", borderRadius: 9, color: BLUE, fontSize: 13, marginBottom: 14 }}>
              Les étapes Paraphe et Signature doivent avoir une zone PDF. Les validations ne nécessitent pas de zone.
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              {requiredZoneSteps.map((s) => {
                const z = draft.zones.find((x) => x.stepId === s.id);
                return <ZoneConfigurator key={s.id} step={s} users={users} zone={z} fileB64={draft.fileB64} onSave={(zone) => setDraft((p) => ({ ...p, zones: [...p.zones.filter((x) => x.stepId !== s.id), zone] }))} />;
              })}
              {requiredZoneSteps.length === 0 && <div style={{ color: MUT }}>Aucune zone requise pour ce workflow.</div>}
            </div>
          </Card>
        )}

        {/* ── Step 5: Envoi ── */}
        {step === 5 && (
          <Card style={{ padding: 22 }}>
            <h3 style={{ marginTop: 0 }}>Confirmation et lancement</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              <Card style={{ padding: 16 }}>
                <h4 style={{ marginTop: 0 }}>Document</h4>
                <div style={{ fontSize: 13, lineHeight: 1.9 }}>
                  <b>{draft.ref || "Sans référence"}</b><br />
                  {draft.title}<br />
                  {currentDocType?.label} · {formatMoney(draft.amount || draft.amountTtc, draft.currency)}<br />
                  {draft.projectName || getProjectName(projets, draft.projectId)} · {draft.site}<br />
                  {(draft.annexes || []).length > 0 && <span style={{ color: MUT, fontSize: 12 }}>{draft.annexes.length} pièce(s) jointe(s)</span>}
                </div>
                {draft.commentaire && (
                  <div style={{ marginTop: 10, padding: "8px 12px", background: BG, borderRadius: 7, fontSize: 12, color: MUT, fontStyle: "italic" }}>
                    💬 {draft.commentaire}
                  </div>
                )}
              </Card>
              <Card style={{ padding: 16 }}>
                <h4 style={{ marginTop: 0 }}>Workflow</h4>
                <div style={{ fontWeight: 900 }}>{selectedWorkflow?.name}</div>
                <div style={{ fontSize: 12, color: MUT, marginTop: 5 }}>{selectedWorkflow?.steps?.length || 0} étape(s), {requiredZoneSteps.length} zone(s) requise(s)</div>
                <div style={{ marginTop: 10 }}>{selectedWorkflow?.steps?.map((s) => <span key={s.id} style={{ marginRight: 6 }}><ActionBadge action={s.action} /></span>)}</div>
              </Card>
            </div>
          </Card>
        )}
      </div>

      <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between" }}>
        <Button tone="light" disabled={step === minStep} onClick={() => setStep((p) => Math.max(minStep, p - 1))}>← Retour</Button>
        {step < STEPS.length - 1
          ? <Button tone="primary" onClick={() => setStep((p) => Math.min(STEPS.length - 1, p + 1))}>Continuer →</Button>
          : <Button tone="primary" onClick={startWorkflow}>🚀 {isExternalConsultation ? (sourceDoc.status === "en_attente_traitement" ? "Valider et lancer le circuit" : "Enregistrer et fermer") : "Lancer le circuit"}</Button>
        }
      </div>
    </div>
  );
}

function WorkflowPreview({ workflow, users }) {
  return (
    <Card style={{ padding: 22 }}>
      <h3 style={{ marginTop: 0 }}>Etapes du workflow <span style={{ fontSize: 12, color: GREEN, background: "#dcfce7", borderRadius: 20, padding: "2px 8px" }}>{workflow.name} - {(workflow.steps ?? []).length} etapes</span></h3>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ background: "#f8fafc" }}>{["Etape", "Signataire / validateur", "Action", "Zone PDF requise", "Ordre", "OTP"].map((h) => <th key={h} style={{ padding: 10, textAlign: "left", fontSize: 11, color: MUT, textTransform: "uppercase" }}>{h}</th>)}</tr></thead>
          <tbody>
            {workflow.steps.map((s) => <tr key={s.id} style={{ borderTop: `1px solid ${BD}` }}>
              <td style={{ padding: 12, fontWeight: 850 }}>Etape {s.order}</td>
              <td style={{ padding: 12 }}>{(s.signers || []).map((id) => userName(users, id)).join(", ")}</td>
              <td style={{ padding: 12 }}><ActionBadge action={s.action} /></td>
              <td style={{ padding: 12, color: isZoneRequired(s.action) ? GREEN : "#94a3b8", fontWeight: 800 }}>{isZoneRequired(s.action) ? "Requis" : "Non requis"}</td>
              <td style={{ padding: 12 }}>{s.mode}</td>
              <td style={{ padding: 12 }}>{s.otpRequired ? "Oui" : "Non"}</td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

const ZPDFJS_CDN    = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
const ZPDFJS_WORKER = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
const _zsc = {};
function zLoadScript(src) {
  if (!_zsc[src]) {
    _zsc[src] = new Promise((ok, fail) => {
      if (typeof window === "undefined") return fail();
      if (document.querySelector(`script[src="${src}"]`)) return ok();
      const s = document.createElement("script");
      s.src = src; s.onload = ok; s.onerror = fail;
      document.head.appendChild(s);
    });
  }
  return _zsc[src];
}
function zNormRect(a, b) {
  return { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), w: Math.abs(b.x - a.x), h: Math.abs(b.y - a.y) };
}

function ZoneConfigurator({ step, users, zone, onSave, fileB64 }) {
  const color = getAction(step.action).color;
  const [local, setLocal] = useState(zone || {
    id: `Z-${step.id}`,
    stepId: step.id,
    userId: step.signers?.[0] || "",
    action: step.action,
    mode: step.action === "paraphe" ? "all" : "last",
    page: step.action === "paraphe" ? "all" : "last",
    position: step.action === "paraphe" ? "bas_gauche" : "bas_droite",
    x: step.action === "paraphe" ? 70 : 390,
    y: 760,
    w: step.action === "paraphe" ? 90 : 130,
    h: 42,
  });
  const positions = [
    ["haut_gauche", "Haut gauche"], ["haut_centre", "Haut centre"], ["haut_droite", "Haut droite"],
    ["bas_gauche", "Bas gauche"], ["bas_centre", "Bas centre"], ["bas_droite", "Bas droite"], ["personnalise", "Personnalise"],
  ];

  const canvasRef   = useRef(null);
  const overlayRef  = useRef(null);
  const pdfDocRef   = useRef(null);
  const pdfNatRef   = useRef({ w: 595, h: 842 });
  const renderIdRef = useRef(0);
  const [pageCount,  setPageCount]  = useState(1);
  const [curPage,    setCurPage]    = useState(1);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfLoaded,  setPdfLoaded]  = useState(false);
  const [drawStart,  setDrawStart]  = useState(null);
  const [drawCur,    setDrawCur]    = useState(null);

  /* Sync the displayed page whenever mode or pageCount changes */
  useEffect(() => {
    if (!pdfLoaded) return;
    if (local.mode === "last")     setCurPage(pageCount);
    else if (local.mode === "all") setCurPage(1);
    else if (local.mode === "specific") setCurPage(Math.max(1, Math.min(pageCount, Number(local.page) || 1)));
  }, [local.mode, pageCount, pdfLoaded]);

  useEffect(() => {
    if (!fileB64) return;
    setPdfLoading(true); setPdfLoaded(false); pdfDocRef.current = null;
    let alive = true;
    (async () => {
      try {
        await zLoadScript(ZPDFJS_CDN);
        const lib = window.pdfjsLib;
        lib.GlobalWorkerOptions.workerSrc = ZPDFJS_WORKER;
        const pdf = await loadPdfDocument(lib, fileB64);
        if (!alive) return;
        pdfDocRef.current = pdf; setPageCount(pdf.numPages); setPdfLoaded(true);
      } catch(e) { console.error("ZoneConf PDF:", e); }
      if (alive) setPdfLoading(false);
    })();
    return () => { alive = false; };
  }, [fileB64]);

  useEffect(() => {
    if (!pdfLoaded || !canvasRef.current) return;
    const id = ++renderIdRef.current;
    (async () => {
      try {
        const pdf = pdfDocRef.current; if (!pdf) return;
        const page = await pdf.getPage(curPage);
        if (id !== renderIdRef.current) return;
        const vp = page.getViewport({ scale: 1 });
        pdfNatRef.current = { w: vp.width, h: vp.height };
        const parent = canvasRef.current?.parentElement;
        const dispW = parent ? Math.max(parent.clientWidth - 4, 100) : 460;
        const scale = dispW / vp.width;
        const scaled = page.getViewport({ scale });
        const cv = canvasRef.current; if (!cv || id !== renderIdRef.current) return;
        cv.width = Math.round(scaled.width); cv.height = Math.round(scaled.height);
        await page.render({ canvasContext: cv.getContext("2d"), viewport: scaled }).promise;
      } catch(e) { console.error("ZoneConf render:", e); }
    })();
  }, [pdfLoaded, curPage]);

  const getRelPos = (e) => {
    const el = overlayRef.current; if (!el) return null;
    const rect = el.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  };
  const onDown = (e) => { e.preventDefault(); const p = getRelPos(e); if (p) { setDrawStart(p); setDrawCur(p); } };
  const onMove = (e) => { if (!drawStart) return; e.preventDefault(); setDrawCur(getRelPos(e)); };
  const onUp   = () => {
    if (!drawStart || !drawCur) return;
    const norm = zNormRect(drawStart, drawCur);
    if (norm.w > 10 && norm.h > 8) {
      const el = overlayRef.current; if (!el) return;
      const rect = el.getBoundingClientRect();
      const { w: natW, h: natH } = pdfNatRef.current;
      setLocal(p => ({
        ...p, position: "personnalise",
        x: Math.round(norm.x * natW / rect.width),
        y: Math.round(norm.y * natH / rect.height),
        w: Math.round(norm.w * natW / rect.width),
        h: Math.round(norm.h * natH / rect.height),
        page: String(curPage), mode: "specific",
      }));
    }
    setDrawStart(null); setDrawCur(null);
  };

  const liveRect = drawStart && drawCur ? zNormRect(drawStart, drawCur) : null;
  const { w: natW, h: natH } = pdfNatRef.current;
  const zonePercent = local.x != null ? {
    left:   `${(local.x / natW) * 100}%`,
    top:    `${(local.y / natH) * 100}%`,
    width:  `${(local.w / natW) * 100}%`,
    height: `${(local.h / natH) * 100}%`,
  } : null;

  return (
    <Card style={{ padding: 14, borderColor: zone ? "#bbf7d0" : "#fcd34d", background: zone ? "#f0fdf4" : "#fffbeb" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <MiniAvatar name={userName(users, local.userId)} color={color} />
        <div style={{ flex: 1 }}><b>{step.label}</b><div style={{ fontSize: 12, color: MUT }}>{userName(users, local.userId)}</div></div>
        <ActionBadge action={step.action} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 14 }}>
        <div style={{ display: "grid", gap: 10, alignContent: "start" }}>
          <select style={inputStyle} value={local.mode} onChange={(e) => {
            const m = e.target.value;
            setLocal((p) => ({ ...p, mode: m, page: m === "specific" ? String(curPage) : m }));
            if (m === "last")     setCurPage(pageCount);
            else if (m === "all") setCurPage(1);
          }}>
            <option value="specific">Page spécifique</option>
            <option value="last">Dernière page</option>
            <option value="all">Toutes les pages</option>
          </select>
          <select style={inputStyle} value={local.position} onChange={(e) => setLocal((p) => ({ ...p, position: e.target.value }))}>{positions.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select>
          {local.mode === "specific" && (
            <input style={inputStyle} type="number" min="1" max={pageCount} value={local.page} placeholder={`Page (1–${pageCount})`}
              onChange={(e) => { setLocal((p) => ({ ...p, page: e.target.value })); setCurPage(Math.max(1, Math.min(pageCount, Number(e.target.value) || 1))); }} />
          )}
          {local.mode === "all" && (
            <div style={{ fontSize: 11, color: MUT, padding: "5px 8px", background: "#eff6ff", borderRadius: 6, border: "1px solid #bfdbfe" }}>
              Aperçu : première page affiché. La zone sera appliquée à toutes les pages.
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <input style={inputStyle} type="number" value={local.w} onChange={(e) => setLocal((p) => ({ ...p, w: Number(e.target.value) }))} placeholder="Larg." />
            <input style={inputStyle} type="number" value={local.h} onChange={(e) => setLocal((p) => ({ ...p, h: Number(e.target.value) }))} placeholder="Haut." />
          </div>
          <div style={{ fontSize: 11, color: MUT, padding: "6px 10px", background: "#f8fafc", borderRadius: 6, border: `1px solid ${BD}` }}>
            {fileB64
              ? pdfLoading
                ? "⏳ Chargement du PDF…"
                : local.position === "personnalise"
                  ? `📄 ${pageCount} page(s) · Dessinez la zone →`
                  : `📄 ${pageCount} page(s) · Aperçu — page ${local.mode === "last" ? pageCount : local.mode === "all" ? 1 : (local.page || curPage)}`
              : "Aucun PDF encore importé"}
          </div>
          <Button tone="primary" onClick={() => onSave(local)}>✓ Enregistrer la zone</Button>
        </div>

        {/* PDF preview panel */}
        <div style={{ position: "relative", border: `1px solid ${BD}`, borderRadius: 10, overflow: "hidden", background: "#525659", cursor: fileB64 && local.position === "personnalise" ? "crosshair" : "default" }}>
          {/* Page navigation — only in "specific" mode */}
          {pageCount > 1 && pdfLoaded && local.mode === "specific" && (
            <div style={{ position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)", zIndex: 20, display: "flex", gap: 3, alignItems: "center", background: "rgba(0,0,0,.6)", borderRadius: 20, padding: "2px 10px" }}>
              <button onClick={() => { const p = Math.max(1, curPage - 1); setCurPage(p); setLocal(prev => ({ ...prev, page: String(p) })); }} disabled={curPage <= 1}
                style={{ background: "none", border: "none", color: "#fff", cursor: curPage <= 1 ? "default" : "pointer", fontSize: 16, fontWeight: 700, opacity: curPage <= 1 ? .35 : 1, padding: "0 2px" }}>‹</button>
              <span style={{ fontSize: 11, color: "#fff", fontWeight: 700 }}>{curPage}/{pageCount}</span>
              <button onClick={() => { const p = Math.min(pageCount, curPage + 1); setCurPage(p); setLocal(prev => ({ ...prev, page: String(p) })); }} disabled={curPage >= pageCount}
                style={{ background: "none", border: "none", color: "#fff", cursor: curPage >= pageCount ? "default" : "pointer", fontSize: 16, fontWeight: 700, opacity: curPage >= pageCount ? .35 : 1, padding: "0 2px" }}>›</button>
            </div>
          )}
          {/* Page mode label */}
          {pdfLoaded && local.mode !== "specific" && (
            <div style={{ position: "absolute", top: 6, right: 8, zIndex: 20, background: "rgba(0,0,0,.6)", borderRadius: 12, padding: "2px 9px", fontSize: 10.5, color: "#fff", fontWeight: 700 }}>
              {local.mode === "last" ? `Dernière page (${pageCount})` : `Toutes les pages — aperçu page 1`}
            </div>
          )}

          {fileB64 ? (
            <>
              <canvas ref={canvasRef} style={{ display: "block", width: "100%" }} />
              {pdfLoading && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(80,80,80,.8)", color: "#fff", fontSize: 13, gap: 8 }}>
                  ⏳ Chargement…
                </div>
              )}
              {/* Zone drawing overlay — active only for custom position */}
              <div ref={overlayRef} style={{ position: "absolute", inset: 0, cursor: local.position === "personnalise" ? "crosshair" : "default", userSelect: "none" }}
                onMouseDown={local.position === "personnalise" ? onDown : undefined}
                onMouseMove={local.position === "personnalise" ? onMove : undefined}
                onMouseUp={local.position === "personnalise" ? onUp : undefined}
                onMouseLeave={local.position === "personnalise" ? onUp : undefined}
                onTouchStart={local.position === "personnalise" ? onDown : undefined}
                onTouchMove={local.position === "personnalise" ? onMove : undefined}
                onTouchEnd={local.position === "personnalise" ? onUp : undefined}>
                {liveRect && (
                  <div style={{ position: "absolute", left: liveRect.x, top: liveRect.y, width: liveRect.w, height: liveRect.h,
                    border: "2px dashed #7c3aed", background: "rgba(124,58,237,.15)", boxSizing: "border-box", pointerEvents: "none" }} />
                )}
                {zonePercent && !liveRect && (
                  <div style={{ position: "absolute", ...zonePercent, border: `2px solid ${color}`, background: `${color}20`, borderRadius: 4, boxSizing: "border-box", pointerEvents: "none",
                    display: "flex", alignItems: "center", justifyContent: "center", color, fontSize: 10, fontWeight: 900, overflow: "hidden" }}>
                    {getAction(step.action).label}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Fallback static mockup when no PDF uploaded yet */
            <div style={{ height: 210, padding: 22, position: "relative" }}>
              <div style={{ height: 14, background: "#d1d5db", borderRadius: 3, width: "75%", marginBottom: 12 }} />
              {Array.from({ length: 7 }).map((_, i) => <div key={i} style={{ height: 8, background: "#e5e7eb", borderRadius: 3, width: `${85 - i * 6}%`, marginBottom: 8 }} />)}
              <div style={{ position: "absolute", left: `${(local.x || 80) / 5.95}px`, top: `${(local.y || 760) / 4.1 - 20}px`, width: Math.max(70, local.w), height: Math.max(34, local.h), border: `2px dashed ${color}`, background: `${color}14`, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", color, fontSize: 11, fontWeight: 900 }}>
                {getAction(step.action).label}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════
   EXTERNAL DOCUMENT PROCESSOR — 6-step treatment wizard
   Triggered from "Documents externes" for docs en_attente_traitement
══════════════════════════════════════════════════════════════ */
const PROC_STEPS = [
  { n: 1, title: "Accusé de réception",      icon: "📥", sub: "Confirmer la réception du document fournisseur" },
  { n: 2, title: "Vérification",             icon: "🔍", sub: "Contrôler et corriger les informations" },
  { n: 3, title: "Type de document",         icon: "📋", sub: "Classifier le document reçu" },
  { n: 4, title: "Rattachement workflow",    icon: "⚡", sub: "Choisir le circuit de validation" },
  { n: 5, title: "Zones signature/paraphe",  icon: "✍️",  sub: "Définir les emplacements sur le PDF" },
  { n: 6, title: "Validation & démarrage",  icon: "🚀", sub: "Lancer le circuit officiel" },
];

function ProcStepNav({ step }) {
  return (
    <div style={{ display: "flex", alignItems: "center", background: "#f8fafc", borderBottom: `1px solid ${BD}`, padding: "10px 20px", overflowX: "auto", gap: 0, flexShrink: 0 }}>
      {PROC_STEPS.map((s, i) => {
        const done = step > s.n; const active = step === s.n;
        return (
          <div key={s.n} style={{ display: "flex", alignItems: "center" }}>
            {i > 0 && <div style={{ width: 24, height: 2, background: done ? GREEN : BD, flexShrink: 0, margin: "0 4px" }} />}
            <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 10px", borderRadius: 8, background: active ? "#f5f3ff" : "transparent", border: active ? `1px solid #c4b5fd` : "1px solid transparent", whiteSpace: "nowrap" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: done ? GREEN : active ? ACC2 : "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {done
                  ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  : <span style={{ fontSize: 10, fontWeight: 900, color: active ? WH : MUT }}>{s.n}</span>}
              </div>
              <div>
                <div style={{ fontSize: 11.5, fontWeight: 800, color: active ? ACC2 : done ? GREEN : MUT }}>{s.title}</div>
                {active && <div style={{ fontSize: 10, color: MUT, marginTop: 1 }}>{s.sub}</div>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function InfoRow({ label, value, highlight, children }) {
  return (
    <div style={{ display: "flex", gap: 12, padding: "9px 0", borderBottom: `1px solid #f1f5f9`, alignItems: "center" }}>
      <span style={{ fontSize: 12, color: MUT, fontWeight: 700, width: 130, flexShrink: 0 }}>{label}</span>
      {children || <span style={{ fontSize: 12.5, color: highlight ? "#d97706" : "#0f172a", fontWeight: highlight ? 800 : 600, flex: 1 }}>{value || "—"}</span>}
    </div>
  );
}

function ProcPdfMini({ fileB64, pages }) {
  const canvasRef = useRef(null);
  const pdfRef    = useRef(null);
  const ridRef    = useRef(0);
  const [cur, setCur]   = useState(1);
  const [cnt, setCnt]   = useState(pages || 1);
  const [rdy, setRdy]   = useState(false);

  useEffect(() => {
    if (!fileB64) return;
    let alive = true;
    (async () => {
      try {
        await zLoadScript(ZPDFJS_CDN);
        const lib = window.pdfjsLib; lib.GlobalWorkerOptions.workerSrc = ZPDFJS_WORKER;
        const pdf = await loadPdfDocument(lib, fileB64);
        if (!alive) return; pdfRef.current = pdf; setCnt(pdf.numPages); setRdy(true);
      } catch {}
    })(); return () => { alive = false; };
  }, [fileB64]);

  useEffect(() => {
    if (!rdy || !canvasRef.current || !pdfRef.current) return;
    const id = ++ridRef.current;
    (async () => {
      try {
        const page = await pdfRef.current.getPage(cur); if (id !== ridRef.current) return;
        const vp = page.getViewport({ scale: 1 }); const scale = 380 / vp.width;
        const sc = page.getViewport({ scale }); const cv = canvasRef.current;
        if (!cv || id !== ridRef.current) return;
        cv.width = Math.round(sc.width); cv.height = Math.round(sc.height);
        await page.render({ canvasContext: cv.getContext("2d"), viewport: sc }).promise;
      } catch {}
    })();
  }, [rdy, cur]);

  return (
    <div style={{ background: "#525659", borderRadius: 10, overflow: "hidden", position: "relative" }}>
      {cnt > 1 && rdy && (
        <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", zIndex: 10, display: "flex", gap: 4, alignItems: "center", background: "rgba(0,0,0,.65)", borderRadius: 20, padding: "3px 10px" }}>
          <button onClick={() => setCur(p => Math.max(1, p - 1))} disabled={cur <= 1} style={{ background: "none", border: "none", color: "#fff", cursor: cur <= 1 ? "default" : "pointer", fontSize: 15, fontWeight: 700, opacity: cur <= 1 ? .35 : 1, padding: "0 2px" }}>‹</button>
          <span style={{ fontSize: 11, color: "#fff", fontWeight: 700 }}>{cur} / {cnt}</span>
          <button onClick={() => setCur(p => Math.min(cnt, p + 1))} disabled={cur >= cnt} style={{ background: "none", border: "none", color: "#fff", cursor: cur >= cnt ? "default" : "pointer", fontSize: 15, fontWeight: 700, opacity: cur >= cnt ? .35 : 1, padding: "0 2px" }}>›</button>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: "block", width: "100%" }} />
      {!rdy && (
        <div style={{ height: 260, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", flexDirection: "column", gap: 10 }}>
          <span style={{ fontSize: 32 }}>📄</span>
          <span style={{ fontSize: 12 }}>{fileB64 ? "Chargement du PDF…" : "Aucun fichier PDF"}</span>
        </div>
      )}
    </div>
  );
}

function ExternalDocumentProcessor({ doc, users, workflows, delegations, projets, authUser, userSettings = {}, onClose, onSave }) {
  const receivers = users.filter(u =>
    userSettings[u.id]?.receveurFourn !== undefined ? userSettings[u.id].receveurFourn : u.droits?.receveurFourn
  );
  const defaultReceiver = receivers.find(u => u.id === authUser?.id) || receivers[0];

  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState({
    // Step 1 — Reception
    receiverId:       defaultReceiver?.id || authUser?.id || "",
    receptionDate:    new Date().toISOString().slice(0, 10),
    receptionNotes:   "",
    conformite:       "conforme",
    // Step 2 — Info verification (editable copy of doc fields)
    ref:              doc.ref || "",
    date:             doc.date || doc.createdAt?.slice(0, 10) || "",
    title:            doc.title || "",
    amount:           doc.amount || "",
    amountTtc:        doc.amountTtc || "",
    currency:         doc.currency || "MGA",
    projectId:        doc.projectId || projets?.[0]?.id || "",
    site:             doc.site || projets?.[0]?.sites?.[0] || "",
    duree:            doc.duree || "",
    // Step 3 — Type
    type:             doc.type || "contrat",
    // Step 4 — Workflow
    workflowId:       doc.suggestedWorkflowId || "",
    // Step 5 — Zones
    zones:            doc.zones || [],
    // Step 6 — Options
    priority:         doc.priority || "normale",
    notifySupplier:   true,
    launchImmediately: true,
  });
  const set = (k, v) => setDraft(p => ({ ...p, [k]: v }));

  const recommended = useMemo(() => suggestWorkflow(workflows, draft), [workflows, draft.type, draft.amount, draft.projectId]);
  const selectedWf  = workflows.find(w => w.id === (draft.workflowId || recommended?.id)) || recommended;
  const sites       = getSitesForProject(projets, draft.projectId);
  const reqZones    = (selectedWf?.steps ?? []).filter(s => isZoneRequired(s.action));
  const zonesOk     = reqZones.every(s => draft.zones.find(z => z.stepId === s.id));
  const receiverUser = users.find(u => u.id === draft.receiverId);

  /* ── per-step validation ── */
  const canNext = [
    true,
    draft.receiverId && draft.receptionDate,
    draft.ref?.trim() && draft.title?.trim(),
    !!draft.type,
    true,
    true,
    true,
  ][step] ?? true;

  function handleLaunch() {
    const wf    = selectedWf;
    const steps = wf ? hydrateWorkflowSteps(wf, users, delegations, { ...doc, ...draft }) : [];
    const now   = new Date().toISOString();
    const audit = [
      createAudit(receiverUser?.nom || authUser?.nom, "accuse_reception",
        `Reçu le ${draft.receptionDate} · ${draft.conformite}${draft.receptionNotes ? " · " + draft.receptionNotes : ""}`),
      createAudit(authUser?.nom, "verification_externe",
        `Type: ${draft.type} · Montant HT: ${draft.amount || "—"} · Projet: ${getProjectName(projets, draft.projectId)}`),
      createAudit(authUser?.nom, "lancement_workflow",
        `Workflow « ${wf?.name || "Manuel"} » lancé · ${reqZones.length} zone(s) configurée(s)`),
    ];
    onSave({
      ...doc,
      ref:         draft.ref,
      date:        draft.date,
      title:       draft.title,
      type:        draft.type,
      amount:      draft.amount,
      amountTtc:   draft.amountTtc,
      currency:    draft.currency,
      projectId:   draft.projectId,
      projectName: getProjectName(projets, draft.projectId),
      site:        draft.site,
      duree:       draft.duree,
      priority:    draft.priority,
      status:      wf && draft.launchImmediately ? "en_cours" : "en_attente_traitement",
      workflowId:  wf?.id || "",
      workflowName: wf?.name || "",
      steps,
      zones:       draft.zones,
      receiverId:  draft.receiverId,
      receiverName: receiverUser?.nom || "",
      receptionDate: draft.receptionDate,
      receptionNotes: draft.receptionNotes,
      conformite:  draft.conformite,
      processedAt: now,
      processedBy: authUser?.nom || "",
      audit: [...(doc.audit || []), ...audit],
    });
  }

  /* ─────────────────── STEP RENDERS ─────────────────── */

  /* STEP 1 — Accusé de réception */
  const step1 = (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>
      {/* Left — Document fiche */}
      <div style={{ display: "grid", gap: 14 }}>
        <Card style={{ padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <div>
              <b style={{ fontSize: 14 }}>Document reçu du portail fournisseur</b>
              <div style={{ fontSize: 11.5, color: MUT, marginTop: 2 }}>Déposé le {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }) : "—"}</div>
            </div>
          </div>
          <InfoRow label="Référence"   value={doc.ref} />
          <InfoRow label="Titre"       value={doc.title} />
          <InfoRow label="Fournisseur" value={doc.deposantName} />
          <InfoRow label="Ref. externe" value={doc.externalRef} />
          <InfoRow label="Nb de pages" value={`${doc.pages || 1} page(s)`} />
          <InfoRow label="Montant HT"  value={doc.amount ? `${formatMoney(doc.amount, doc.currency)}` : "—"} />
          <InfoRow label="Projet"      value={doc.projectName || getProjectName(projets, doc.projectId)} />
          <InfoRow label="Site"        value={doc.site} />
          <InfoRow label="Statut actuel">
            <StatusBadge status={doc.status} />
          </InfoRow>
        </Card>

        {/* Annexes */}
        {(doc.annexes || []).length > 0 && (
          <Card style={{ padding: 16 }}>
            <b style={{ fontSize: 13, display: "block", marginBottom: 10 }}>Pièces jointes reçues ({doc.annexes.length})</b>
            {doc.annexes.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderTop: i > 0 ? `1px solid #f1f5f9` : undefined }}>
                <span style={{ fontSize: 16 }}>📄</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700 }}>{a.name}</div>
                  <div style={{ fontSize: 11, color: MUT }}>{Math.round((a.size || 0) / 1024)} Ko</div>
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>

      {/* Right — Reception form */}
      <div style={{ display: "grid", gap: 14 }}>
        <Card style={{ padding: 18 }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 14, color: "#0f172a" }}>📥 Formulaire d'accusé de réception</h3>

          <div style={{ display: "grid", gap: 14 }}>
            <Field label="Receveur désigné" required>
              <select style={inputStyle} value={draft.receiverId} onChange={e => set("receiverId", e.target.value)}>
                {receivers.length === 0
                  ? <option value={authUser?.id}>{authUser?.nom} (vous)</option>
                  : receivers.map(u => <option key={u.id} value={u.id}>{u.nom} — {u.email || u.role}</option>)
                }
              </select>
              {receivers.length === 0 && (
                <div style={{ marginTop: 6, fontSize: 11.5, color: ORANGE, padding: "6px 10px", background: "#fffbeb", border: `1px solid #fde68a`, borderRadius: 7 }}>
                  ⚠ Aucun receveur configuré — allez dans Paramètres › Utilisateurs & Rôles pour en désigner un.
                </div>
              )}
            </Field>

            <Field label="Date de réception" required>
              <input type="date" style={inputStyle} value={draft.receptionDate} onChange={e => set("receptionDate", e.target.value)} />
            </Field>

            <Field label="Conformité du document">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {[["conforme", "Conforme", GREEN, "#f0fdf4", "#bbf7d0"],
                  ["reserves", "Avec réserves", ORANGE, "#fffbeb", "#fde68a"],
                  ["non_conforme", "Non conforme", RED, "#fef2f2", "#fecaca"]].map(([id, label, col, bg, brd]) => (
                  <button key={id} onClick={() => set("conformite", id)}
                    style={{ padding: "10px 6px", borderRadius: 9, border: `2px solid ${draft.conformite === id ? col : BD}`, background: draft.conformite === id ? bg : WH, cursor: "pointer", fontFamily: FONT, textAlign: "center" }}>
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{id === "conforme" ? "✅" : id === "reserves" ? "⚠️" : "❌"}</div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: draft.conformite === id ? col : MUT }}>{label}</div>
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Remarques / observations">
              <TextArea value={draft.receptionNotes} onChange={e => set("receptionNotes", e.target.value)}
                placeholder="Indiquez ici toute observation sur la réception du document : qualité du scan, informations manquantes, etc." />
            </Field>
          </div>
        </Card>

        {/* Preview PDF mini */}
        {doc.fileB64 && (
          <Card style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "10px 14px", borderBottom: `1px solid ${BD}` }}>
              <b style={{ fontSize: 12.5 }}>📄 Aperçu du document</b>
            </div>
            <ProcPdfMini fileB64={doc.fileB64} pages={doc.pages} />
          </Card>
        )}
      </div>
    </div>
  );

  /* STEP 2 — Vérification des informations */
  const step2 = (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>
      <Card style={{ padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, padding: "10px 14px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 9 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span style={{ fontSize: 12.5, color: BLUE }}>Les champs en <b>fond ambré</b> ont été auto-remplis par OCR depuis le document fournisseur. Vérifiez et corrigez si nécessaire.</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Référence interne" required>
            <input style={{ ...inputStyle, background: doc.ocrData?.parsed?.numero ? "#fffbeb" : WH, border: `1px solid ${doc.ocrData?.parsed?.numero ? "#fde68a" : BD}` }}
              value={draft.ref} onChange={e => set("ref", e.target.value)} placeholder="Ex: CTR-NTIC-2025-047" />
          </Field>
          <Field label="Date du document" required>
            <input type="date" style={{ ...inputStyle, background: doc.ocrData?.parsed?.date_doc ? "#fffbeb" : WH, border: `1px solid ${doc.ocrData?.parsed?.date_doc ? "#fde68a" : BD}` }}
              value={draft.date} onChange={e => set("date", e.target.value)} />
          </Field>

          <Field label="Titre / objet *" required full>
            <input style={inputStyle} value={draft.title} onChange={e => set("title", e.target.value)}
              placeholder="Intitulé complet du document" />
          </Field>

          <Field label="Montant HT (MGA)">
            <input type="number" style={{ ...inputStyle, background: doc.ocrData?.parsed?.ht ? "#fffbeb" : WH, border: `1px solid ${doc.ocrData?.parsed?.ht ? "#fde68a" : BD}` }}
              value={draft.amount} onChange={e => set("amount", e.target.value)} />
          </Field>
          <Field label="Montant TTC (MGA)">
            <input type="number" style={{ ...inputStyle, background: doc.ocrData?.parsed?.total ? "#fffbeb" : WH, border: `1px solid ${doc.ocrData?.parsed?.total ? "#fde68a" : BD}` }}
              value={draft.amountTtc} onChange={e => set("amountTtc", e.target.value)} />
          </Field>

          <Field label="Devise">
            <select style={inputStyle} value={draft.currency} onChange={e => set("currency", e.target.value)}>
              <option value="MGA">MGA — Ariary malgache</option>
              <option value="EUR">EUR — Euro</option>
              <option value="USD">USD — Dollar américain</option>
            </select>
          </Field>
          <Field label="Délai / durée de validité">
            <input style={inputStyle} value={draft.duree} onChange={e => set("duree", e.target.value)} placeholder="Ex : 12 mois à compter de la signature" />
          </Field>

          <Field label="Projet / marché" required>
            <select style={inputStyle} value={draft.projectId}
              onChange={e => { const p = projets.find(x => x.id === e.target.value); setDraft(old => ({ ...old, projectId: e.target.value, site: p?.sites?.[0] || "" })); }}>
              {(projets || []).map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}
            </select>
          </Field>
          <Field label="Site / direction destinataire" required>
            <select style={inputStyle} value={draft.site} onChange={e => set("site", e.target.value)}>
              {sites.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>

          <Field label="Priorité">
            <select style={inputStyle} value={draft.priority} onChange={e => set("priority", e.target.value)}>
              <option value="basse">🔵 Basse</option>
              <option value="normale">🟡 Normale</option>
              <option value="haute">🔴 Haute</option>
            </select>
          </Field>
        </div>
      </Card>

      {/* Right — original OCR data from supplier */}
      <div style={{ display: "grid", gap: 14 }}>
        <Card style={{ padding: 16 }}>
          <b style={{ fontSize: 13, display: "block", marginBottom: 12, color: "#0f172a" }}>📋 Données originales fournisseur</b>
          {[
            ["Référence OCR", doc.ocrData?.parsed?.numero],
            ["Date OCR",      doc.ocrData?.parsed?.date_doc],
            ["Émetteur OCR",  doc.ocrData?.parsed?.emetteur],
            ["NIF",           doc.ocrData?.parsed?.nif],
            ["Montant HT",    doc.ocrData?.parsed?.ht],
            ["TVA",           doc.ocrData?.parsed?.tva],
            ["Total TTC",     doc.ocrData?.parsed?.total],
            ["IBAN",          doc.ocrData?.parsed?.iban],
            ["Score OCR",     doc.ocrData?.parsed?.score ? `${doc.ocrData.parsed.score}%` : null],
          ].map(([label, value]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid #f1f5f9`, fontSize: 12 }}>
              <span style={{ color: MUT }}>{label}</span>
              <b style={{ color: value ? "#0f172a" : "#cbd5e1" }}>{value || "—"}</b>
            </div>
          ))}
        </Card>

        {doc.fileB64 && (
          <Card style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "10px 14px", borderBottom: `1px solid ${BD}` }}>
              <b style={{ fontSize: 12.5 }}>Aperçu document</b>
            </div>
            <ProcPdfMini fileB64={doc.fileB64} pages={doc.pages} />
          </Card>
        )}
      </div>
    </div>
  );

  /* STEP 3 — Sélection du type de document */
  const step3 = (
    <div style={{ display: "grid", gap: 18 }}>
      <Card style={{ padding: 20 }}>
        <h3 style={{ margin: "0 0 6px", fontSize: 16 }}>Classifier le document</h3>
        <p style={{ margin: "0 0 18px", color: MUT, fontSize: 13 }}>Le type détermine le workflow recommandé et les règles de validation applicables.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
          {SS_DOC_TYPES.map(t => (
            <button key={t.id} onClick={() => { set("type", t.id); set("workflowId", ""); }}
              style={{ padding: "16px 12px", borderRadius: 12, border: `2px solid ${draft.type === t.id ? ACC2 : BD}`, background: draft.type === t.id ? "#f5f3ff" : WH, cursor: "pointer", fontFamily: FONT, textAlign: "left", transition: "all .15s" }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{
                { contrat: "📜", facture: "🧾", bon_commande: "🛒", avenant: "📝", rapport: "📊", devis: "💰", courrier: "✉️", autre: "📄" }[t.id] || "📄"
              }</div>
              <div style={{ fontWeight: 900, fontSize: 13, color: draft.type === t.id ? ACC2 : "#0f172a", marginBottom: 4 }}>{t.label}</div>
              <div style={{ color: "#94a3b8", fontSize: 11.5, lineHeight: 1.4 }}>{t.desc}</div>
              {draft.type === t.id && (
                <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 5 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={ACC2} strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <span style={{ fontSize: 11, fontWeight: 800, color: ACC2 }}>Sélectionné</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </Card>

      {/* Supplier stated type vs selected */}
      {doc.type && doc.type !== draft.type && (
        <Card style={{ padding: 14, background: "#fffbeb", border: `1px solid #fde68a` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>⚠️</span>
            <div style={{ fontSize: 12.5 }}>
              <b style={{ color: "#92400e" }}>Type modifié</b>
              <span style={{ color: MUT, marginLeft: 8 }}>Le fournisseur avait indiqué : <b>{SS_DOC_TYPES.find(t => t.id === doc.type)?.label || doc.type}</b> → vous avez sélectionné <b style={{ color: ACC2 }}>{SS_DOC_TYPES.find(t => t.id === draft.type)?.label}</b></span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );

  /* STEP 4 — Rattachement workflow */
  const step4 = (
    <div style={{ display: "grid", gap: 18 }}>
      {recommended && (
        <Card style={{ padding: 16, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>⚡</span>
            <div>
              <b style={{ color: BLUE }}>Workflow recommandé : {recommended.name}</b>
              <div style={{ color: MUT, fontSize: 12, marginTop: 2 }}>{recommended.desc} · {(recommended.steps ?? []).length} étape(s)</div>
            </div>
            <button onClick={() => set("workflowId", recommended.id)}
              style={{ marginLeft: "auto", padding: "7px 14px", borderRadius: 8, border: `1px solid ${BLUE}`, background: BLUE, color: WH, cursor: "pointer", fontFamily: FONT, fontSize: 12, fontWeight: 800 }}>
              Sélectionner
            </button>
          </div>
        </Card>
      )}

      {doc.suggestedWorkflowId && doc.suggestedWorkflowId !== recommended?.id && (
        <Card style={{ padding: 14, background: "#f5f3ff", border: "1px solid #c4b5fd" }}>
          <div style={{ fontSize: 12.5, color: ACC2 }}>
            <b>Suggestion fournisseur :</b> {workflows.find(w => w.id === doc.suggestedWorkflowId)?.name || doc.suggestedWorkflowName}
          </div>
        </Card>
      )}

      <Card style={{ padding: 20 }}>
        <h3 style={{ margin: "0 0 14px", fontSize: 15 }}>Choisir le circuit de validation</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: 12, marginBottom: 16 }}>
          {workflows.filter(w => w.active !== false && (!w.docTypes?.length || w.docTypes.includes(draft.type))).map(wf => {
            const sel = (draft.workflowId || recommended?.id) === wf.id;
            return (
              <button key={wf.id} onClick={() => set("workflowId", wf.id)}
                style={{ padding: 16, borderRadius: 12, border: `2px solid ${sel ? ACC2 : BD}`, background: sel ? "#f5f3ff" : WH, cursor: "pointer", fontFamily: FONT, textAlign: "left", position: "relative" }}>
                {recommended?.id === wf.id && <span style={{ position: "absolute", top: 8, right: 8, fontSize: 10, fontWeight: 900, color: GREEN, background: "#dcfce7", borderRadius: 20, padding: "2px 7px" }}>Recommandé</span>}
                <div style={{ fontWeight: 900, fontSize: 13, color: sel ? ACC2 : "#0f172a", marginBottom: 5 }}>{wf.name}</div>
                <div style={{ color: MUT, fontSize: 11.5, marginBottom: 8 }}>{wf.desc}</div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {(wf.steps ?? []).slice(0, 5).map(s => <ActionBadge key={s.id} action={s.action} />)}
                </div>
                <div style={{ marginTop: 8, fontSize: 11, color: MUT }}>{(wf.steps ?? []).length} étape(s)</div>
              </button>
            );
          })}
          <button onClick={() => set("workflowId", "__manual__")}
            style={{ padding: 16, borderRadius: 12, border: `2px solid ${draft.workflowId === "__manual__" ? ORANGE : BD}`, background: draft.workflowId === "__manual__" ? "#fffbeb" : WH, cursor: "pointer", fontFamily: FONT, textAlign: "left" }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>🖐</div>
            <div style={{ fontWeight: 900, fontSize: 13, color: draft.workflowId === "__manual__" ? ORANGE : "#0f172a" }}>Traitement manuel</div>
            <div style={{ color: MUT, fontSize: 11.5, marginTop: 4 }}>Aucun workflow — l'équipe affectera les actions manuellement</div>
          </button>
        </div>
      </Card>

      {selectedWf && draft.workflowId !== "__manual__" && <WorkflowPreview workflow={selectedWf} users={users} />}
    </div>
  );

  /* STEP 5 — Zones signature/paraphe */
  const step5 = (
    <div style={{ display: "grid", gap: 18 }}>
      {!doc.fileB64 && (
        <Card style={{ padding: 18, background: "#fffbeb", border: `1px solid #fde68a` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>⚠️</span>
            <div>
              <b style={{ color: "#92400e", display: "block" }}>Fichier PDF non disponible</b>
              <div style={{ color: MUT, fontSize: 12.5, marginTop: 2 }}>Le fournisseur n'a pas joint de fichier binaire (base64). Les zones peuvent être configurées manuellement avec les coordonnées ci-dessous.</div>
            </div>
          </div>
        </Card>
      )}

      {reqZones.length === 0 ? (
        <Card style={{ padding: 26, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
          <b style={{ fontSize: 15 }}>Aucune zone requise</b>
          <div style={{ color: MUT, fontSize: 13, marginTop: 6 }}>Le workflow sélectionné ne contient pas d'étape de signature ou de paraphe nécessitant une zone PDF.</div>
        </Card>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          <Card style={{ padding: "12px 18px", background: "#eff6ff", border: "1px solid #bfdbfe" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 16 }}>ℹ️</span>
              <span style={{ fontSize: 12.5, color: BLUE }}>
                <b>{reqZones.length} zone(s)</b> à définir. Dessinez directement sur le PDF ou utilisez les coordonnées numériques. <b style={{ color: zonesOk ? GREEN : ORANGE }}>{draft.zones.filter(z => reqZones.find(s => s.id === z.stepId)).length}/{reqZones.length} configurée(s).</b>
              </span>
            </div>
          </Card>
          {reqZones.map(s => {
            const z = draft.zones.find(x => x.stepId === s.id);
            return (
              <ZoneConfigurator key={s.id} step={s} users={users} zone={z} fileB64={doc.fileB64}
                onSave={zone => setDraft(p => ({ ...p, zones: [...p.zones.filter(x => x.stepId !== s.id), zone] }))} />
            );
          })}
        </div>
      )}
    </div>
  );

  /* STEP 6 — Validation & démarrage */
  const step6 = (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20, alignItems: "start" }}>
      {/* Summary */}
      <div style={{ display: "grid", gap: 14 }}>
        <Card style={{ padding: 18 }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 15 }}>📋 Récapitulatif du traitement</h3>

          <div style={{ marginBottom: 14, padding: "10px 14px", background: "#f8fafc", borderRadius: 9, border: `1px solid ${BD}` }}>
            <div style={{ fontSize: 11, color: MUT, fontWeight: 800, textTransform: "uppercase", marginBottom: 8 }}>Accusé de réception</div>
            <InfoRow label="Receveur"    value={receiverUser?.nom || "—"} />
            <InfoRow label="Date réception" value={draft.receptionDate ? new Date(draft.receptionDate).toLocaleDateString("fr-FR") : "—"} />
            <InfoRow label="Conformité">
              <span style={{ fontSize: 12.5, fontWeight: 800, color: { conforme: GREEN, reserves: ORANGE, non_conforme: RED }[draft.conformite] }}>
                {{ conforme: "✅ Conforme", reserves: "⚠️ Avec réserves", non_conforme: "❌ Non conforme" }[draft.conformite]}
              </span>
            </InfoRow>
            {draft.receptionNotes && <InfoRow label="Remarques" value={draft.receptionNotes} />}
          </div>

          <div style={{ marginBottom: 14, padding: "10px 14px", background: "#f8fafc", borderRadius: 9, border: `1px solid ${BD}` }}>
            <div style={{ fontSize: 11, color: MUT, fontWeight: 800, textTransform: "uppercase", marginBottom: 8 }}>Document</div>
            <InfoRow label="Référence"   value={draft.ref} />
            <InfoRow label="Titre"       value={draft.title} />
            <InfoRow label="Type">
              <span style={{ fontSize: 12.5 }}>{SS_DOC_TYPES.find(t => t.id === draft.type)?.label}</span>
            </InfoRow>
            <InfoRow label="Montant HT"  value={draft.amount  ? `${formatMoney(draft.amount,  draft.currency)}` : "—"} />
            <InfoRow label="Montant TTC" value={draft.amountTtc ? `${formatMoney(draft.amountTtc, draft.currency)}` : "—"} />
            <InfoRow label="Projet"      value={getProjectName(projets, draft.projectId)} />
            <InfoRow label="Site"        value={draft.site} />
            <InfoRow label="Priorité">
              <span style={{ fontSize: 12.5, fontWeight: 800, color: { haute: RED, normale: ORANGE, basse: MUT }[draft.priority] }}>
                {{ haute: "🔴 Haute", normale: "🟡 Normale", basse: "🔵 Basse" }[draft.priority]}
              </span>
            </InfoRow>
          </div>

          <div style={{ padding: "10px 14px", background: "#f8fafc", borderRadius: 9, border: `1px solid ${BD}` }}>
            <div style={{ fontSize: 11, color: MUT, fontWeight: 800, textTransform: "uppercase", marginBottom: 8 }}>Workflow & zones</div>
            <InfoRow label="Workflow"    value={selectedWf?.name || (draft.workflowId === "__manual__" ? "Manuel" : "Non sélectionné")} />
            <InfoRow label="Étapes"      value={selectedWf ? `${(selectedWf.steps ?? []).length} étape(s)` : "—"} />
            <InfoRow label="Zones config." value={`${draft.zones.filter(z => reqZones.find(s => s.id === z.stepId)).length} / ${reqZones.length}`} />
          </div>
        </Card>

        {/* Warnings */}
        {!zonesOk && reqZones.length > 0 && (
          <Card style={{ padding: 14, background: "#fffbeb", border: `1px solid #fde68a` }}>
            <b style={{ color: ORANGE, fontSize: 13 }}>⚠ Zones de signature incomplètes</b>
            <div style={{ color: MUT, fontSize: 12, marginTop: 4 }}>
              {reqZones.filter(s => !draft.zones.find(z => z.stepId === s.id)).map(s => s.label).join(", ")} — le workflow pourra quand même être lancé mais les zones devront être définies avant l'action.
            </div>
          </Card>
        )}
      </div>

      {/* Right panel — launch options + button */}
      <div style={{ display: "grid", gap: 14 }}>
        <Card style={{ padding: 18 }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 14 }}>Options de lancement</h3>

          <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 0", borderBottom: `1px solid #f1f5f9`, cursor: "pointer" }}>
            <input type="checkbox" checked={draft.launchImmediately} onChange={e => set("launchImmediately", e.target.checked)}
              style={{ width: 16, height: 16, accentColor: ACC2 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>Lancer le workflow immédiatement</div>
              <div style={{ fontSize: 11.5, color: MUT, marginTop: 2 }}>Notifie les acteurs et démarre les étapes en séquence</div>
            </div>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 0", cursor: "pointer" }}>
            <input type="checkbox" checked={draft.notifySupplier} onChange={e => set("notifySupplier", e.target.checked)}
              style={{ width: 16, height: 16, accentColor: ACC2 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>Notifier le fournisseur</div>
              <div style={{ fontSize: 11.5, color: MUT, marginTop: 2 }}>Envoie un accusé de réception à {doc.sender || doc.deposantName}</div>
            </div>
          </label>
        </Card>

        <Card style={{ padding: 18, border: `1px solid ${draft.launchImmediately ? "#bbf7d0" : BD}`, background: draft.launchImmediately ? "#f0fdf4" : WH }}>
          <div style={{ fontSize: 13, color: draft.launchImmediately ? "#065f46" : MUT, marginBottom: 14, lineHeight: 1.6 }}>
            {draft.launchImmediately
              ? `✅ Le document sera mis en statut « En cours » et le workflow « ${selectedWf?.name || "—"} » sera lancé.`
              : "⏸ Le document sera mis en attente sans lancer le circuit de validation."}
          </div>
          <button onClick={handleLaunch}
            style={{ width: "100%", padding: "13px 16px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${ACC}, ${ACC2})`, color: WH, fontFamily: FONT, fontSize: 14, fontWeight: 900, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            🚀 {draft.launchImmediately ? "Valider & Lancer le circuit" : "Valider sans lancer"}
          </button>
        </Card>

        {/* Fournisseur info */}
        <Card style={{ padding: 16, background: "#f8fafc" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: MUT, textTransform: "uppercase", marginBottom: 8 }}>Fournisseur</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>{doc.deposantName}</div>
          {doc.sender && <div style={{ fontSize: 12, color: MUT, marginTop: 3 }}>{doc.sender}</div>}
          {doc.externalRef && <div style={{ marginTop: 6 }}><span style={{ fontSize: 11, fontWeight: 800, background: "#f5f3ff", color: ACC2, border: "1px solid #c4b5fd", borderRadius: 20, padding: "2px 9px" }}>{doc.externalRef}</span></div>}
        </Card>
      </div>
    </div>
  );

  const stepContent = [null, step1, step2, step3, step4, step5, step6][step];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.65)", zIndex: 99999, display: "flex", flexDirection: "column" }}>
      <style>{`@keyframes epSpin { to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <div style={{ background: WH, borderBottom: `1px solid ${BD}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={ACC2} strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l2 2 4-4"/></svg>
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 15, color: "#0f172a" }}>Traitement du document externe</div>
              <div style={{ fontSize: 12, color: MUT }}>
                {doc.ref} · {doc.deposantName} · {PROC_STEPS[step - 1]?.title}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "transparent", cursor: "pointer", color: MUT, fontSize: 24, lineHeight: 1 }}>×</button>
        </div>
        <ProcStepNav step={step} />
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: "auto", padding: 20, background: "#f6f8fc" }}>
        <div style={{ width: "100%" }}>
          {/* Step title */}
          <div style={{ marginBottom: 18, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 26 }}>{PROC_STEPS[step - 1]?.icon}</span>
            <div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: "#0f172a" }}>{PROC_STEPS[step - 1]?.title}</h2>
              <p style={{ margin: "3px 0 0", color: MUT, fontSize: 13 }}>{PROC_STEPS[step - 1]?.sub}</p>
            </div>
          </div>
          {stepContent}
        </div>
      </div>

      {/* Footer navigation */}
      <div style={{ background: WH, borderTop: `1px solid ${BD}`, padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Button disabled={step <= 1} onClick={() => setStep(p => Math.max(1, p - 1))}>← Étape précédente</Button>
          <span style={{ fontSize: 12, color: MUT }}>Étape {step} / {PROC_STEPS.length}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {step < 6 ? (
            <Button tone="primary" disabled={!canNext} onClick={() => setStep(p => Math.min(6, p + 1))}>
              Étape suivante →
            </Button>
          ) : null /* Step 6 has its own submit button */}
        </div>
      </div>
    </div>
  );
}

function SignaturePad({ onChange }) {
  const ref = useRef(null);
  const drawing = useRef(false);
  const getPos = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  };
  const init = () => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
  };
  useEffect(init, []);
  const down = (e) => { e.preventDefault(); drawing.current = true; const p = getPos(e); const ctx = ref.current.getContext("2d"); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
  const move = (e) => { if (!drawing.current) return; e.preventDefault(); const p = getPos(e); const ctx = ref.current.getContext("2d"); ctx.lineTo(p.x, p.y); ctx.stroke(); onChange?.(ref.current.toDataURL("image/png")); };
  const up = () => { drawing.current = false; onChange?.(ref.current?.toDataURL("image/png")); };
  return <canvas ref={ref} width={320} height={130} onMouseDown={down} onMouseMove={move} onMouseUp={up} onMouseLeave={up} onTouchStart={down} onTouchMove={move} onTouchEnd={up} style={{ width: "100%", border: `1px solid ${BD}`, borderRadius: 8, background: WH, touchAction: "none" }} />;
}

function ActionModal({ doc, users, authUser, signatures, otpConfig, onClose, onSave }) {
  const canActOnAny = authUser?.systemRole === "admin" || authUser?.systemRole === "superadmin";
  const canProcess = authUser?.systemRole !== "readonly";
  const step = canProcess ? activeTaskForUser(doc, authUser?.id) || (canActOnAny ? activeSteps(doc)[0] : null) : null;
  const [comment, setComment] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const [mode, setMode] = useState("registered");
  const [typed, setTyped] = useState(authUser?.nom || "");
  const [drawn, setDrawn] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState("");
  const candidates = signatures.filter((s) => s.userId === authUser?.id && s.type === (step?.action === "paraphe" ? "paraphe" : "signature") && s.active);
  const defaultSig = candidates.find((s) => s.default && String(s.value || "").startsWith("data:")) || candidates.find((s) => s.default) || candidates[0];
  const [selectedSig, setSelectedSig] = useState(defaultSig?.id || "");
  if (!step) return null;
  const zone = (doc.zones || []).find((z) => z.stepId === step.id || z.action === step.action);
  const mustOtp = !!step.otpRequired;
  const sendOtp = () => {
    const len = Number(otpConfig?.length || 6);
    const code = otpConfig?.type === "alphanumeric" ? Math.random().toString(36).slice(2, 2 + len).toUpperCase() : String(Math.floor(Math.random() * 10 ** len)).padStart(len, "0");
    setOtpSent(code);
  };
  const canComplete = !mustOtp || (otpSent && otpCode === otpSent);
  const doComplete = () => {
    let value = "";
    if (mode === "registered") value = signatures.find((s) => s.id === selectedSig)?.value || "";
    if (mode === "text") value = typed;
    if (mode === "draw") value = drawn;
    onSave(completeStep(doc, step.id, { user: authUser, comment, signatureMode: mode, signatureValue: value, otpCode }));
  };
  const doReject = () => onSave(rejectDocument(doc, step.id, { user: authUser, reason: comment || "Rejet sans commentaire" }));
  return (
    <Modal title={`${getAction(step.action).label} - ${doc.ref}`} subtitle={doc.title} onClose={onClose} width={1040}
      footer={<><Button onClick={onClose}>Annuler</Button>{rejecting ? <Button tone="red" disabled={!canComplete} onClick={doReject}>Confirmer le rejet</Button> : <><Button tone="red" disabled={!canComplete} onClick={() => setRejecting(true)}>Rejeter</Button><Button tone="primary" disabled={!canComplete} onClick={doComplete}>Valider l'action</Button></>}</>}>
      <div style={{ display: "grid", gridTemplateColumns: "1.25fr .85fr", gap: 18 }}>
        <Card style={{ minHeight: 520, background: "#525659", padding: 22, display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
          <div style={{ width: 520, minHeight: 720, background: WH, boxShadow: "0 6px 24px rgba(0,0,0,.25)", position: "relative", padding: doc.fileB64&&canInlinePreview(doc)?0:44, overflow:"hidden" }}>
            {doc.fileB64&&canInlinePreview(doc) ? (
              <iframe src={filePreviewSrc(doc.fileB64)} title={`Aperçu de ${doc.fileName||doc.ref}`} style={{width:"100%",height:720,border:0,display:"block"}} />
            ) : <>
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <div style={{ fontFamily: "Georgia,serif", fontSize: 18, fontWeight: 900 }}>SOFTWELL MADAGASCAR</div>
                <div style={{ fontSize: 10, color: MUT }}>Document SoftSign - Aperçu généré</div>
              </div>
              <h3 style={{ textAlign: "center" }}>{doc.title}</h3>
              <p style={{ lineHeight: 1.75, color: "#334155" }}>Référence {doc.ref}. Projet {doc.projectName || doc.projectId}, site {doc.site}. Ce document suit le workflow {doc.workflowName} et nécessite l&apos;action courante ci-dessous.</p>
              <div style={{ marginTop: 28 }}>{Array.from({ length: 8 }).map((_, i) => <div key={i} style={{ height: 8, background: "#e5e7eb", width: `${85 - (i % 4) * 7}%`, borderRadius: 3, marginBottom: 10 }} />)}</div>
            </>}
            {zone && (
              <div style={{ position: "absolute", left: zone.position?.includes("droite") ? 335 : zone.position?.includes("centre") ? 205 : 70, bottom: zone.position?.startsWith("haut") ? undefined : 70, top: zone.position?.startsWith("haut") ? 145 : undefined, width: zone.w || 130, height: zone.h || 48, border: `2px dashed ${getAction(step.action).color}`, background: `${getAction(step.action).color}14`, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6, color: getAction(step.action).color, fontWeight: 900, fontSize: 12 }}>
                {getAction(step.action).label}
              </div>
            )}
          </div>
        </Card>
        <div style={{ display: "grid", gap: 14 }}>
          <Card style={{ padding: 16 }}>
            <h4 style={{ margin: "0 0 10px" }}>Action demandee</h4>
            <ActionBadge action={step.action} /> <StepBadge status={step.status} />
            <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.8 }}>
              <b>{step.label}</b><br />
              Signataires: {(step.signers || []).map((id) => userName(users, id)).join(", ")}<br />
              Zone PDF: {isZoneRequired(step.action) ? zone ? `${zone.mode} - ${zone.position}` : "A configurer" : "Non requise"}<br />
              Delai: {step.dueAt ? new Date(step.dueAt).toLocaleString("fr-FR") : "-"}
            </div>
          </Card>
          {!rejecting && (step.action === "signature" || step.action === "paraphe") && (
            <Card style={{ padding: 16 }}>
              <h4 style={{ margin: "0 0 10px" }}>Signature du document</h4>
              <div style={{ display: "flex", background: "#f1f5f9", borderRadius: 9, padding: 4, marginBottom: 12 }}>
                {[["registered", "Enregistree"], ["text", "Texte"], ["draw", "Dessinee"]].map(([id, label]) => <button key={id} onClick={() => setMode(id)} style={{ flex: 1, border: 0, background: mode === id ? WH : "transparent", borderRadius: 7, padding: 8, fontWeight: 800, color: mode === id ? ACC2 : MUT, cursor: "pointer" }}>{label}</button>)}
              </div>
              {mode === "registered" && <select style={inputStyle} value={selectedSig} onChange={(e) => setSelectedSig(e.target.value)}>{candidates.map((s) => <option key={s.id} value={s.id}>{signatureOptionLabel(s)}</option>)}</select>}
              {mode === "text" && <input style={inputStyle} value={typed} onChange={(e) => setTyped(e.target.value)} />}
              {mode === "draw" && <SignaturePad onChange={setDrawn} />}
            </Card>
          )}
          {mustOtp && (
            <Card style={{ padding: 16, borderColor: "#bfdbfe", background: "#eff6ff" }}>
              <h4 style={{ margin: "0 0 10px" }}>Authentification OTP requise</h4>
              <div style={{ display: "flex", gap: 8 }}>
                <Button tone="blue" onClick={sendOtp}>Generer / envoyer OTP</Button>
                <input style={inputStyle} value={otpCode} onChange={(e) => setOtpCode(e.target.value)} placeholder="Code OTP" />
              </div>
              {otpSent && <div style={{ marginTop: 8, color: BLUE, fontSize: 12, fontWeight: 800 }}>Code de test: {otpSent}</div>}
            </Card>
          )}
          <Card style={{ padding: 16 }}>
            <Field label={rejecting ? "Motif de rejet" : "Commentaire"}>
              <TextArea value={comment} onChange={(e) => setComment(e.target.value)} placeholder={rejecting ? "Indiquez le motif du rejet..." : "Ajouter un commentaire..."} />
            </Field>
          </Card>
        </div>
      </div>
    </Modal>
  );
}

function SearchView({ docs, users, onOpen }) {
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState({ type: "", status: "", project: "", site: "", signer: "", from: "", to: "" });
  const results = docs.filter((d) => {
    const hay = [d.ref, d.title, d.projectName, d.site, d.deposantName, d.workflowName, ...(d.steps || []).flatMap((s) => (s.signers || []).map((id) => userName(users, id)))].join(" ").toLowerCase();
    if (q && !hay.includes(q.toLowerCase())) return false;
    if (filters.type && d.type !== filters.type) return false;
    if (filters.status && d.status !== filters.status) return false;
    if (filters.site && d.site !== filters.site) return false;
    if (filters.signer && !(d.steps || []).some((s) => (s.signers || []).includes(filters.signer))) return false;
    return true;
  });
  return (
    <div style={{ fontFamily: FONT }}>
      <h2>Recherche avancee SoftSign</h2>
      <Card style={{ padding: 14, display: "grid", gridTemplateColumns: "2fr repeat(4,1fr)", gap: 10, marginBottom: 14 }}>
        <input style={inputStyle} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Reference, titre, expéditeur, signataire..." />
        <select style={inputStyle} value={filters.type} onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value }))}><option value="">Tous types</option>{SS_DOC_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}</select>
        <select style={inputStyle} value={filters.status} onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}><option value="">Tous statuts</option>{Object.entries(SS_STATUS).map(([id, st]) => <option key={id} value={id}>{st.label}</option>)}</select>
        <select style={inputStyle} value={filters.signer} onChange={(e) => setFilters((p) => ({ ...p, signer: e.target.value }))}><option value="">Tous signataires</option>{users.map((u) => <option key={u.id} value={u.id}>{u.nom}</option>)}</select>
        <Button onClick={() => setFilters({ type: "", status: "", project: "", site: "", signer: "", from: "", to: "" })}>Reinitialiser</Button>
      </Card>
      <DocumentsView docs={results} setDocs={() => {}} view="ss-tous-docs" authUser={{}} users={users} onOpen={onOpen} onAction={() => {}} onRefresh={() => {}} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   UNIFIED DOC MODULE — 7 sub-modules with consistent table + 4-tab detail
   ══════════════════════════════════════════════════════════════════ */

const MOD_COLS = {
  "ss-docs-my":       ["projet","site","reference","titre","type","workflow","dateCreation","statut"],
  "ss-docs-external": ["projet","site","reference","titre","expediteur","dateCreation"],
  "ss-docs-received": ["projet","site","reference","titre","expediteur","type","workflow","dateCreation","actionDemandee"],
  "ss-docs-progress": ["projet","site","reference","titre","expediteur","type","workflow","dateCreation","etapeActuelle"],
  "ss-rejetes":       ["projet","site","reference","titre","expediteur","type","workflow","dateCreation","dateRejet"],
  "ss-archives":      ["projet","site","reference","titre","expediteur","type","workflow","dateCreation","dateArchivage"],
  "ss-search":        ["projet","site","reference","titre","expediteur","type","workflow","dateCreation","statut"],
};
const MOD_TITLES = {
  "ss-docs-my":"Mes Documents","ss-docs-external":"Documents externes",
  "ss-docs-received":"Documents reçus","ss-docs-progress":"Documents en cours",
  "ss-rejetes":"Documents rejetés","ss-archives":"Documents archivés","ss-search":"Recherche avancée",
};
const COL_HDR = {
  projet:"PROJET",site:"SITE",reference:"RÉFÉRENCE",titre:"TITRE",expediteur:"EXPÉDITEUR",
  type:"TYPE",workflow:"WORKFLOW",dateCreation:"DATE CRÉATION",statut:"STATUT",
  actionDemandee:"ACTION DEMANDÉE",etapeActuelle:"ÉTAPE ACTUELLE",
  dateRejet:"DATE DE REJET",dateArchivage:"DATE D'ARCHIVAGE",
};

function fmtD(iso) { return iso ? new Date(iso).toLocaleDateString("fr-FR",{day:"2-digit",month:"2-digit",year:"numeric"}) : "—"; }

function getModuleDocs(moduleId, docs, authUser) {
  const uid = authUser?.id;
  const canActOnAny = authUser?.systemRole === "admin" || authUser?.systemRole === "superadmin";
  if (moduleId === "ss-docs-my")       return docs.filter(d => d.deposantId===uid||d.author===authUser?.nom||d.deposantName===authUser?.nom);
  if (moduleId === "ss-docs-external") return docs.filter(d => d.origin==="externe"||d.status==="en_attente_traitement");
  if (moduleId === "ss-docs-received") return docs.filter(d => activeTaskForUser(d,uid)||(canActOnAny&&["en_cours","en_attente_signature_externe","signe_tiers"].includes(d.status)&&activeSteps(d).length));
  if (moduleId === "ss-docs-progress") return docs.filter(d => ["en_cours","en_attente_signature_externe","signe_tiers"].includes(d.status));
  if (moduleId === "ss-rejetes")       return docs.filter(d => d.status==="rejete");
  if (moduleId === "ss-archives")      return docs.filter(d => d.status==="archive"||d.status==="termine");
  return docs;
}

function ColCell({ col, doc, users }) {
  const act = activeSteps(doc)[0];
  const overdue = act && isOverdue(act);
  switch(col) {
    case "projet":   return <td style={{padding:"10px 14px",fontSize:13,whiteSpace:"nowrap"}}>{doc.projectName||"—"}</td>;
    case "site":     return <td style={{padding:"10px 14px",fontSize:13,color:MUT,whiteSpace:"nowrap"}}>{doc.site||"—"}</td>;
    case "reference":return <td style={{padding:"10px 14px",fontWeight:800,color:ACC2,whiteSpace:"nowrap",fontSize:13}}>{doc.ref||"—"}</td>;
    case "titre":    return <td style={{padding:"10px 14px",maxWidth:220,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontSize:13}}>{doc.title||"—"}</td>;
    case "expediteur":return <td style={{padding:"10px 14px",fontSize:13,color:MUT}}>{doc.deposantName||doc.author||"—"}</td>;
    case "type":     return <td style={{padding:"10px 14px",fontSize:13,color:MUT,whiteSpace:"nowrap"}}>{SS_DOC_TYPES.find(t=>t.id===doc.type)?.label||doc.type||"—"}</td>;
    case "workflow": return <td style={{padding:"10px 14px",fontSize:13,color:MUT,whiteSpace:"nowrap"}}>{doc.workflowName||"—"}</td>;
    case "dateCreation": return <td style={{padding:"10px 14px",fontSize:13,color:MUT,whiteSpace:"nowrap"}}>{fmtD(doc.createdAt||doc.dateDepot)}</td>;
    case "statut":   return <td style={{padding:"10px 14px"}}><StatusBadge status={doc.status}/></td>;
    case "actionDemandee": {
      if (!act) return <td style={{padding:"10px 14px",color:MUT,fontSize:12}}>—</td>;
      return (
        <td style={{padding:"10px 14px"}}>
          <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
            <ActionBadge action={act.action}/>
            {overdue && <span style={{fontSize:10,fontWeight:900,color:RED,background:"#fef2f2",border:`1px solid ${RED}44`,borderRadius:12,padding:"1px 6px",display:"flex",alignItems:"center",gap:3}}>🔴 Urgent</span>}
          </div>
        </td>
      );
    }
    case "etapeActuelle": {
      const curStep = (doc.steps||[]).find(s=>s.status==="active");
      return <td style={{padding:"10px 14px",fontSize:12,color:BLUE,whiteSpace:"nowrap"}}>{curStep?`Étape ${curStep.order} : ${curStep.label}`:"—"}</td>;
    }
    case "dateRejet":    return <td style={{padding:"10px 14px",fontSize:13,color:RED,whiteSpace:"nowrap"}}>{fmtD(doc.rejectedAt||doc.updatedAt)}</td>;
    case "dateArchivage":return <td style={{padding:"10px 14px",fontSize:13,color:MUT,whiteSpace:"nowrap"}}>{fmtD(doc.archivedAt||doc.updatedAt)}</td>;
    default: return <td/>;
  }
}

function ExportDropdown({ docs, cols }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const exportExcel = async () => {
    const headers = cols.map(c => COL_HDR[c]||c);
    const rows = docs.map(d => cols.map(c => {
      if(c==="reference") return d.ref||"";
      if(c==="titre") return d.title||"";
      if(c==="projet") return d.projectName||"";
      if(c==="site") return d.site||"";
      if(c==="expediteur") return d.deposantName||d.author||"";
      if(c==="type") return SS_DOC_TYPES.find(t=>t.id===d.type)?.label||d.type||"";
      if(c==="workflow") return d.workflowName||"";
      if(c==="dateCreation") return fmtD(d.createdAt||d.dateDepot);
      if(c==="statut") return d.status||"";
      if(c==="dateRejet") return fmtD(d.rejectedAt||d.updatedAt);
      if(c==="dateArchivage") return fmtD(d.archivedAt||d.updatedAt);
      return "";
    }));
    const XLSX = await import("xlsx");
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([headers,...rows]);
    XLSX.utils.book_append_sheet(workbook,worksheet,"Documents");
    XLSX.writeFile(workbook,`softsign_export_${new Date().toISOString().slice(0,10)}.xlsx`);
    setOpen(false);
  };
  const exportPDF = () => { window.print(); setOpen(false); };
  return (
    <div ref={ref} style={{position:"relative"}}>
      <button onClick={()=>setOpen(p=>!p)} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:8,border:`1px solid ${BD}`,background:WH,cursor:"pointer",fontSize:12.5,fontWeight:700,color:`var(--ss-text,#1e293b)`,fontFamily:FONT}}>
        ⬆ Exporter <span style={{fontSize:10}}>▾</span>
      </button>
      {open && (
        <div style={{position:"absolute",right:0,top:"calc(100% + 4px)",background:WH,border:`1px solid ${BD}`,borderRadius:9,boxShadow:"0 6px 20px rgba(0,0,0,.1)",zIndex:200,minWidth:160,overflow:"hidden"}}>
          <button onClick={exportExcel} style={{width:"100%",padding:"10px 16px",border:"none",background:"transparent",cursor:"pointer",fontFamily:FONT,fontSize:13,textAlign:"left",display:"flex",alignItems:"center",gap:8,color:"#166534"}}>
            <span style={{fontSize:15}}>🟢</span> Excel (.xlsx)
          </button>
          <button onClick={exportPDF} style={{width:"100%",padding:"10px 16px",border:"none",background:"transparent",cursor:"pointer",fontFamily:FONT,fontSize:13,textAlign:"left",display:"flex",alignItems:"center",gap:8,color:RED,borderTop:`1px solid ${BD}`}}>
            <span style={{fontSize:15}}>🔴</span> PDF (.pdf)
          </button>
        </div>
      )}
    </div>
  );
}

function DocFilterBar({ search, onSearch, projets, proj, onProj, siteOpts, site, onSite, typeOpts, type, onType, statusOpts, statut, onStatut, from, onFrom, to, onTo, onRefresh, docs, cols }) {
  return (
    <div style={{background:WH,border:`1px solid ${BD}`,borderRadius:10,padding:"12px 16px",marginBottom:14,display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
      <div style={{position:"relative",flex:"1 1 200px",minWidth:160}}>
        <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:MUT,fontSize:14,pointerEvents:"none"}}>🔍</span>
        <input style={{...inputStyle,paddingLeft:32,width:"100%",boxSizing:"border-box"}} placeholder="Rechercher documents..." value={search} onChange={e=>onSearch(e.target.value)} />
      </div>
      <select style={{...inputStyle,flex:"0 1 160px"}} value={proj} onChange={e=>onProj(e.target.value)}>
        <option value="">Projet : [Tous]</option>
        {projets.map(p=><option key={p.id} value={p.id}>{p.nom}</option>)}
      </select>
      <select style={{...inputStyle,flex:"0 1 140px"}} value={site} onChange={e=>onSite(e.target.value)}>
        <option value="">Site : [Tous]</option>
        {siteOpts.map(s=><option key={s} value={s}>{s}</option>)}
      </select>
      {typeOpts.length>0 && (
        <select style={{...inputStyle,flex:"0 1 140px"}} value={type} onChange={e=>onType(e.target.value)}>
          <option value="">Type : [Tous]</option>
          {typeOpts.map(t=><option key={t.id} value={t.id}>{t.label}</option>)}
        </select>
      )}
      {statusOpts.length>0 && (
        <select style={{...inputStyle,flex:"0 1 140px"}} value={statut} onChange={e=>onStatut(e.target.value)}>
          <option value="">Statut : [Tous]</option>
          {statusOpts.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      )}
      <div style={{display:"flex",alignItems:"center",gap:6,flex:"0 1 200px"}}>
        <input type="date" style={{...inputStyle,flex:1}} value={from} onChange={e=>onFrom(e.target.value)} title="Période début" />
        <input type="date" style={{...inputStyle,flex:1}} value={to} onChange={e=>onTo(e.target.value)} title="Période fin" />
      </div>
      <button onClick={onRefresh} style={{display:"flex",alignItems:"center",gap:5,padding:"7px 14px",borderRadius:8,border:`1px solid ${BD}`,background:WH,cursor:"pointer",fontSize:12.5,fontWeight:700,color:`var(--ss-text,#1e293b)`,fontFamily:FONT,whiteSpace:"nowrap"}}>
        ↺ Actualiser
      </button>
      <ExportDropdown docs={docs} cols={cols} />
    </div>
  );
}

function DocListView({ moduleId, docs, users, projets, authUser, onSelect, onRefresh }) {
  const [search, setSearch] = useState("");
  const [proj, setProj] = useState("");
  const [site, setSite] = useState("");
  const [type, setType] = useState("");
  const [statut, setStatut] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sortCol, setSortCol] = useState("dateCreation");
  const [sortDir, setSortDir] = useState("desc");

  const cols = MOD_COLS[moduleId] || MOD_COLS["ss-search"];
  const baseDocs = moduleId === "ss-search" ? docs : getModuleDocs(moduleId, docs, authUser);

  const siteOpts = useMemo(() => [...new Set(baseDocs.map(d=>d.site).filter(Boolean))].sort(),[baseDocs]);
  const typeOpts = useMemo(() => SS_DOC_TYPES.filter(t=>baseDocs.some(d=>d.type===t.id)),[baseDocs]);
  const statusOpts = useMemo(() => Object.entries(SS_STATUS).filter(([id])=>baseDocs.some(d=>d.status===id)).map(([id,s])=>({id,label:s.label})),[baseDocs]);

  const filtered = useMemo(() => {
    let r = baseDocs;
    if(proj)   r = r.filter(d=>d.projectId===proj);
    if(site)   r = r.filter(d=>d.site===site);
    if(type)   r = r.filter(d=>d.type===type);
    if(statut) r = r.filter(d=>d.status===statut);
    if(from)   r = r.filter(d=>(d.createdAt||d.dateDepot)&&new Date(d.createdAt||d.dateDepot)>=new Date(from));
    if(to)     r = r.filter(d=>(d.createdAt||d.dateDepot)&&new Date(d.createdAt||d.dateDepot)<=new Date(to+"T23:59:59"));
    if(search) { const q=search.toLowerCase(); r=r.filter(d=>[d.ref,d.title,d.projectName,d.site,d.deposantName,d.workflowName].some(x=>String(x||"").toLowerCase().includes(q))); }
    if(sortCol==="dateCreation") {
      r=[...r].sort((a,b)=>{const da=new Date(a.createdAt||a.dateDepot||0),db=new Date(b.createdAt||b.dateDepot||0);return sortDir==="asc"?da-db:db-da;});
    }
    return r;
  },[baseDocs,proj,site,type,statut,from,to,search,sortCol,sortDir]);

  const toggleSort = (c) => { if(sortCol===c) setSortDir(d=>d==="asc"?"desc":"asc"); else{setSortCol(c);setSortDir("asc");} };

  return (
    <div style={{fontFamily:FONT}}>
      <div style={{marginBottom:16}}>
        <h2 style={{margin:0,fontSize:24,fontWeight:900,color:`var(--ss-text,#1e293b)`}}>{MOD_TITLES[moduleId]||"Documents"}</h2>
        <p style={{margin:"4px 0 0",color:MUT,fontSize:12.5}}>{filtered.length} document(s)</p>
      </div>
      <DocFilterBar
        search={search} onSearch={setSearch}
        projets={projets||[]} proj={proj} onProj={setProj}
        siteOpts={siteOpts} site={site} onSite={setSite}
        typeOpts={typeOpts} type={type} onType={setType}
        statusOpts={statusOpts} statut={statut} onStatut={setStatut}
        from={from} onFrom={setFrom} to={to} onTo={setTo}
        onRefresh={onRefresh} docs={filtered} cols={cols}
      />
      <Card style={{overflow:"hidden",padding:0}}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead>
              <tr style={{background:"#f8f9fc"}}>
                {cols.map(c=>(
                  <th key={c} onClick={["dateCreation","dateRejet","dateArchivage"].includes(c)?()=>toggleSort(c):undefined}
                    style={{padding:"10px 14px",textAlign:"left",fontWeight:800,fontSize:11,color:MUT,borderBottom:`1px solid ${BD}`,whiteSpace:"nowrap",cursor:["dateCreation","dateRejet","dateArchivage"].includes(c)?"pointer":"default",userSelect:"none"}}>
                    {COL_HDR[c]||c} {sortCol===c?(sortDir==="asc"?"↑":"↓"):""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length===0 && (
                <tr><td colSpan={cols.length} style={{padding:48,textAlign:"center",color:MUT,fontSize:13}}>Aucun document trouvé</td></tr>
              )}
              {filtered.map(doc=>(
                <tr key={doc.id} onClick={()=>onSelect(doc)}
                  style={{borderBottom:`1px solid ${BD}`,cursor:"pointer",transition:"background .1s"}}
                  onMouseEnter={e=>{e.currentTarget.style.background="#f5f3ff";}}
                  onMouseLeave={e=>{e.currentTarget.style.background=WH;}}>
                  {cols.map(c=><ColCell key={c} col={c} doc={doc} users={users}/>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ── 4-tab detail view ── */
function LegacyAISummaryModal({ onClose }) {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setSummary("Ce document est un contrat de prestation de services entre les parties signataires. Il définit les obligations réciproques, les modalités de paiement, les délais d'exécution et les conditions de résiliation. Le montant total convenu est conforme aux dispositions budgétaires approuvées. Aucune clause litigieuse identifiée. Document complet et bien structuré.");
      setLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.55)",zIndex:99999,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:WH,borderRadius:14,maxWidth:520,width:"100%",overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,.25)"}}>
        <div style={{padding:"14px 20px",background:`linear-gradient(135deg,${ACC2},${ACC})`,display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:18}}>✨</span>
          <span style={{color:"#fff",fontWeight:800,fontSize:15}}>Résumé IA du document</span>
          <button onClick={onClose} style={{marginLeft:"auto",background:"rgba(255,255,255,.2)",border:"none",color:"#fff",cursor:"pointer",width:26,height:26,borderRadius:"50%",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
        <div style={{padding:"20px 24px",minHeight:120}}>
          {loading ? (
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,padding:"20px 0",color:MUT}}>
              <div style={{fontSize:28,animation:"pulse 1s infinite"}}>🤖</div>
              <div style={{fontSize:13}}>Analyse du document en cours…</div>
              <div style={{width:"100%",height:4,background:BD,borderRadius:4,overflow:"hidden"}}>
                <div style={{height:"100%",width:"60%",background:`linear-gradient(90deg,${ACC2},${ACC})`,borderRadius:4,animation:"pulse 1.2s infinite"}}/>
              </div>
            </div>
          ) : (
            <p style={{fontSize:13.5,lineHeight:1.7,color:`var(--ss-text,#1e293b)`,margin:0}}>{summary}</p>
          )}
        </div>
        {!loading && (
          <div style={{padding:"12px 20px",borderTop:`1px solid ${BD}`,display:"flex",justifyContent:"flex-end"}}>
            <Button tone="primary" onClick={onClose}>Fermer</Button>
          </div>
        )}
      </div>
    </div>
  );
}

function DocumentSummaryModal({ doc, onClose }) {
  const steps = doc.steps || [];
  const completedSteps = steps.filter((step) => step.status === "done" || step.status === "complete").length;
  const activeStep = steps.find((step) => step.status === "active");
  const type = SS_DOC_TYPES.find((item) => item.id === doc.type)?.label || doc.type || "Document";
  const summary = [
    `${type} "${doc.title || doc.ref || "sans titre"}".`,
    `Reference: ${doc.ref || "-"}.`,
    `Projet: ${doc.projectName || doc.projectId || "-"}${doc.site ? `, site ${doc.site}` : ""}.`,
    `Workflow: ${doc.workflowName || "non attribue"} (${completedSteps}/${steps.length || 0} etape(s) terminee(s)).`,
    activeStep ? `Etape courante: ${activeStep.label || activeStep.action}.` : `Statut courant: ${doc.status || "-"}.`,
  ].join(" ");
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.55)",zIndex:99999,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:WH,borderRadius:14,maxWidth:520,width:"100%",overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,.25)"}}>
        <div style={{padding:"14px 20px",background:`linear-gradient(135deg,${ACC2},${ACC})`,display:"flex",alignItems:"center",gap:10}}>
          <span style={{color:"#fff",fontWeight:800,fontSize:15}}>Resume local du document</span>
          <button onClick={onClose} style={{marginLeft:"auto",background:"rgba(255,255,255,.2)",border:"none",color:"#fff",cursor:"pointer",width:26,height:26,borderRadius:"50%",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}}>x</button>
        </div>
        <div style={{padding:"20px 24px",minHeight:120}}>
          <p style={{fontSize:13.5,lineHeight:1.7,color:`var(--ss-text,#1e293b)`,margin:0}}>{summary}</p>
        </div>
        <div style={{padding:"12px 20px",borderTop:`1px solid ${BD}`,display:"flex",justifyContent:"flex-end"}}>
          <Button tone="primary" onClick={onClose}>Fermer</Button>
        </div>
      </div>
    </div>
  );
}

function DocTab1({ doc }) {
  const fields = [
    ["Projet", doc.projectName||doc.projectId||"—", "Site", doc.site||"—"],
    ["Référence", doc.ref||"—", "Titre", doc.title||"—"],
    ["Expéditeur", doc.deposantName||doc.author||"—", "Type", SS_DOC_TYPES.find(t=>t.id===doc.type)?.label||doc.type||"—"],
    ["Workflow", doc.workflowName||"—", "Date création", fmtD(doc.createdAt||doc.dateDepot)],
  ];
  return (
    <div style={{padding:"20px 0"}}>
      <Card style={{padding:20,marginBottom:0}}>
        {fields.map(([k1,v1,k2,v2],i)=>(
          <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:14}}>
            <div>
              <label style={{display:"block",fontSize:11,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".07em",marginBottom:4}}>{k1}</label>
              <div style={{...inputStyle,padding:"8px 12px",background:BG,color:`var(--ss-text,#1e293b)`,fontSize:13,pointerEvents:"none"}}>{v1}</div>
            </div>
            <div>
              <label style={{display:"block",fontSize:11,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".07em",marginBottom:4}}>{k2}</label>
              <div style={{...inputStyle,padding:"8px 12px",background:BG,color:`var(--ss-text,#1e293b)`,fontSize:13,pointerEvents:"none"}}>{v2}</div>
            </div>
          </div>
        ))}
        <div>
          <label style={{display:"block",fontSize:11,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".07em",marginBottom:4}}>Commentaires de l&apos;expéditeur</label>
          <div style={{...inputStyle,padding:"10px 12px",background:BG,minHeight:64,fontSize:13,color:doc.commentaire?`var(--ss-text,#1e293b)`:MUT,pointerEvents:"none",lineHeight:1.6}}>
            {doc.commentaire||"Aucun commentaire"}
          </div>
        </div>
      </Card>
    </div>
  );
}

function DocumentPreviewModal({ document, onClose }) {
  if (!document) return null;
  return (
    <Modal
      title={`Visualiser - ${document.label}`}
      subtitle="Aperçu du document PDF"
      width={1040}
      onClose={onClose}
      footer={<><Button onClick={onClose}>Fermer</Button><Button tone="blue" onClick={() => downloadFileSource(document.source, document.label)}>⬇ Télécharger</Button></>}
    >
      <iframe
        src={filePreviewSrc(document.source)}
        title={`Aperçu de ${document.label}`}
        style={{width:"100%",height:"70vh",border:0,borderRadius:8,background:"#525659"}}
      />
    </Modal>
  );
}

function DocTab2({ doc, users = [], delegations = [], isArchiveDetail = false }) {
  const [summaryFor, setSummaryFor] = useState(null);
  const [previewCert, setPreviewCert] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const showArchivedCertificate = isArchiveDetail && (doc.status==="archive"||doc.status==="termine");
  const annexes = doc.annexes||[];
  const versions = doc.audit ? doc.audit.filter(a=>a.action?.includes("depot")||a.action?.includes("upload")||a.action?.includes("soumission")) : [];
  const documentSource = resolveSoftSignDocumentSource(doc);
  const previewArchivedCertificate = () => setPreviewCert(buildCertData(doc, users, delegations));
  const downloadArchivedCertificate = () => openCertPDF(buildCertData(doc, users, delegations));
  const previewDocument = (label, source) => {
    if (source) setPreviewDoc({label, source});
  };
  const downloadDocument = (label, source) => {
    if (source) downloadFileSource(source, label);
  };
  const DocRow2 = ({label,sub,source})=>(
    <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:BG,borderRadius:9,border:`1px solid ${BD}`}}>
      <span style={{fontSize:18}}>📄</span>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:13,fontWeight:700,color:`var(--ss-text,#1e293b)`,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{label}</div>
        {sub&&<div style={{fontSize:11.5,color:MUT,marginTop:1}}>{sub}</div>}
      </div>
      <div style={{display:"flex",gap:6,flexShrink:0}}>
        <button onClick={()=>setSummaryFor(label)} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 12px",borderRadius:7,border:"none",background:`linear-gradient(135deg,${ACC2},${ACC})`,color:"#fff",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:FONT}}>✨ Résumer</button>
        <button disabled={!source} title={source?"Visualiser le document":"Aucun fichier PDF disponible"} onClick={()=>previewDocument(label,source)} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 12px",borderRadius:7,border:`1px solid ${BD}`,background:WH,color:source?`var(--ss-text,#1e293b)`:"#aab1bd",cursor:source?"pointer":"not-allowed",fontSize:12,fontWeight:700,fontFamily:FONT}}>👁 Visualiser</button>
        <button disabled={!source} title={source?"Télécharger le document":"Aucun fichier PDF disponible"} onClick={()=>downloadDocument(label,source)} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 12px",borderRadius:7,border:"none",background:source?BLUE:"#cbd5e1",color:"#fff",cursor:source?"pointer":"not-allowed",fontSize:12,fontWeight:700,fontFamily:FONT}}>⬇ Télécharger</button>
      </div>
    </div>
  );
  return (
    <div style={{padding:"20px 0",display:"flex",flexDirection:"column",gap:16}}>
      <div>
        <div style={{fontWeight:800,fontSize:14,marginBottom:10,color:`var(--ss-text,#1e293b)`}}>Documents</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <DocRow2 label={doc.fileName||"Document principal"} sub={doc.fileName||"Plan-Architectural-v1.pdf"} source={documentSource} />
          {annexes.length>0 && (
            <>
              <div style={{fontSize:13,fontWeight:700,color:MUT,marginTop:4,display:"flex",alignItems:"center",gap:6}}>📎 Annexes ({annexes.length})</div>
              {annexes.map((a,i)=><DocRow2 key={i} label={typeof a==="string"?a:a.name||`Annexe ${i+1}`} source={typeof a==="string"?"":a.fileB64||a.fileUrl||a.url||""} />)}
            </>
          )}
        </div>
      </div>
      {showArchivedCertificate && (
        <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10,padding:16}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <span style={{fontSize:22}}>🏆</span>
            <div>
              <div style={{fontWeight:800,fontSize:14,color:"#166534"}}>Document archivé — Validation complète</div>
              <div style={{fontSize:12,color:"#4ade80",marginTop:1}}>Ce document a été validé par tous les acteurs du workflow et est maintenant archivé.</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",background:WH,borderRadius:9,border:"1px solid #bbf7d0"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:18}}>🏅</span>
              <div>
                <div style={{fontWeight:700,fontSize:13,color:"#166534"}}>Certificat de signature</div>
                <div style={{fontSize:11.5,color:"#4ade80"}}>Preuve de signature officielle</div>
              </div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={previewArchivedCertificate} style={{display:"flex",alignItems:"center",gap:5,padding:"6px 14px",borderRadius:7,border:`1px solid ${GREEN}`,background:WH,color:GREEN,cursor:"pointer",fontSize:12.5,fontWeight:700,fontFamily:FONT}}>👁 Visualiser</button>
              <button onClick={downloadArchivedCertificate} style={{display:"flex",alignItems:"center",gap:5,padding:"6px 14px",borderRadius:7,border:"none",background:GREEN,color:"#fff",cursor:"pointer",fontSize:12.5,fontWeight:700,fontFamily:FONT}}>⬇ Télécharger</button>
            </div>
          </div>
        </div>
      )}
      {(versions.length>0 || showArchivedCertificate) && (
        <div>
          <div style={{fontWeight:800,fontSize:14,marginBottom:10,color:`var(--ss-text,#1e293b)`,display:"flex",alignItems:"center",gap:6}}>🕐 Historique des versions</div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {versions.slice(0,4).map((v,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 14px",border:`1px solid ${BD}`,borderRadius:8,background:WH}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600}}>Version Étape {i+1}</div>
                  <div style={{fontSize:11.5,color:MUT}}>{v.detail||"Soumission"}</div>
                </div>
                <span style={{fontSize:12,color:MUT}}>{fmtD(v.date)}</span>
                <div style={{display:"flex",gap:6}}>
                  <button disabled={!documentSource} title={documentSource?"Visualiser cette version":"Aucun fichier PDF disponible"} onClick={()=>previewDocument(`${doc.fileName||doc.title||"Document"} - version ${i+1}`,documentSource)} style={{padding:"4px 10px",borderRadius:6,border:`1px solid ${BD}`,background:WH,cursor:documentSource?"pointer":"not-allowed",fontSize:12,fontFamily:FONT,color:documentSource?MUT:"#aab1bd"}}>👁 Visualiser</button>
                  <button disabled={!documentSource} title={documentSource?"Télécharger cette version":"Aucun fichier PDF disponible"} onClick={()=>downloadDocument(`${doc.fileName||doc.title||"Document"} - version ${i+1}.pdf`,documentSource)} style={{padding:"4px 10px",borderRadius:6,border:"none",background:documentSource?"#374151":"#cbd5e1",color:"#fff",cursor:documentSource?"pointer":"not-allowed",fontSize:12,fontFamily:FONT}}>⬇ Télécharger</button>
                </div>
              </div>
            ))}
            {showArchivedCertificate && (
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"9px 14px",border:"1px solid #bbf7d0",borderRadius:8,background:"#f0fdf4"}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:800,color:"#166534"}}>Version finale du document signé</div>
                  <div style={{fontSize:11.5,color:"#4ade80"}}>Document final archivé après validation complète du workflow</div>
                </div>
                <span style={{fontSize:12,color:"#166534"}}>{fmtD(doc.archivedAt||doc.certificate?.generatedAt||doc.updatedAt)}</span>
                <div style={{display:"flex",gap:6}}>
                  <button disabled={!documentSource} title={documentSource?"Visualiser le document final":"Aucun fichier PDF disponible"} onClick={()=>previewDocument(doc.fileName||`${doc.title||"Document"} - version finale.pdf`,documentSource)} style={{padding:"4px 10px",borderRadius:6,border:"1px solid #bbf7d0",background:WH,cursor:documentSource?"pointer":"not-allowed",fontSize:12,fontFamily:FONT,color:documentSource?GREEN:"#aab1bd"}}>👁 Visualiser</button>
                  <button disabled={!documentSource} title={documentSource?"Télécharger le document final":"Aucun fichier PDF disponible"} onClick={()=>downloadDocument(doc.fileName||`${doc.title||"Document"} - version finale.pdf`,documentSource)} style={{padding:"4px 10px",borderRadius:6,border:"none",background:documentSource?GREEN:"#cbd5e1",color:"#fff",cursor:documentSource?"pointer":"not-allowed",fontSize:12,fontFamily:FONT}}>⬇ Télécharger</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {summaryFor && <DocumentSummaryModal doc={doc} onClose={()=>setSummaryFor(null)} />}
      {previewCert && <CertificatePreviewModal cert={previewCert} onClose={()=>setPreviewCert(null)} onPrint={()=>openCertPDF(previewCert)} />}
      {previewDoc && <DocumentPreviewModal document={previewDoc} onClose={()=>setPreviewDoc(null)} />}
    </div>
  );
}

function DocTab3({ doc, users }) {
  const steps = doc.steps||[];
  const externalRequest = getExternalRequestById(doc.externalSignature?.requestId);
  const externalDate = (value) => value ? new Date(value).toLocaleString("fr-FR") : "—";
  const getIcon = (status) => {
    if(status==="done")     return {icon:"✅",color:GREEN,bg:"#f0fdf4",border:"#bbf7d0"};
    if(status==="active")   return {icon:"🔄",color:BLUE,bg:"#eff6ff",border:"#bfdbfe"};
    if(status==="rejected") return {icon:"❌",color:RED,bg:"#fef2f2",border:"#fecaca"};
    return {icon:"○",color:MUT,bg:BG,border:BD};
  };
  return (
    <div style={{padding:"20px 0"}}>
      <div style={{fontWeight:800,fontSize:14,marginBottom:14,color:`var(--ss-text,#1e293b)`}}>Circuit de validation</div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {steps.length===0 && <div style={{color:MUT,fontSize:13,padding:20,textAlign:"center"}}>Aucune étape de workflow configurée</div>}
        {steps.map((s,i)=>{
          const {icon,color,bg,border}=getIcon(s.status);
          const isParallel = s.type==="parallele"||s.mode==="parallele";
          const signerNames = (s.signers||[]).map(id=>userName(users,id)).join(", ");
          const actionLabel = {validation:"Validation",paraphe:"Paraphe",signature:"Signature",revision:"Révision",archivage:"Archivage"}[s.action]||s.action;
          return (
            <div key={s.id} style={{background:bg,border:`1px solid ${border}`,borderRadius:10,padding:"14px 18px"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:s.comment?8:0}}>
                <span style={{fontSize:18,flexShrink:0}}>{icon}</span>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                    <span style={{fontWeight:800,fontSize:14,color:`var(--ss-text,#1e293b)`}}>Étape {s.order}</span>
                    {isParallel && <span style={{fontSize:10.5,fontWeight:800,color:ORANGE,background:"#fff7ed",border:`1px solid ${ORANGE}44`,borderRadius:12,padding:"1px 8px"}}>En parallèle</span>}
                    <span style={{marginLeft:"auto",fontSize:12,color,fontWeight:700}}>
                      {s.status==="done"&&s.completedAt?`Terminé le ${fmtD(s.completedAt)}`:s.status==="active"?"À traiter":s.status==="rejected"?"Rejeté":"En attente"}
                    </span>
                  </div>
                  <div style={{marginTop:4,display:"flex",gap:20,flexWrap:"wrap"}}>
                    <span style={{fontSize:12.5,color:MUT}}>Validateur : <b style={{color:`var(--ss-text,#1e293b)`}}>{signerNames||s.label||"—"}</b></span>
                    <span style={{fontSize:12.5,color:MUT}}>Type d&apos;action : <b style={{color:`var(--ss-text,#1e293b)`}}>{actionLabel}</b></span>
                  </div>
                </div>
              </div>
              {s.comment && (
                <div style={{marginTop:8,padding:"8px 12px",background:WH,borderRadius:7,border:`1px solid ${border}`,fontSize:12.5,color:MUT,lineHeight:1.5}}>
                  <span style={{fontWeight:600,color:`var(--ss-text,#1e293b)`}}>Commentaire :</span> {s.comment}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {externalRequest && (
        <div style={{marginTop:18,border:"1px solid #ddd6fe",borderRadius:10,background:"#faf7ff",padding:16}}>
          <div style={{fontSize:14,fontWeight:900,color:ACC2,marginBottom:12}}>Historique de la signature externe</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:"8px 18px",fontSize:12.5,color:MUT}}>
            {[
              ["Demande", externalRequest.id],
              ["Initiateur", externalRequest.initiatorName],
              ["Tiers", externalRequest.thirdPartyName],
              ["Adresse e-mail utilisée", externalRequest.email],
              ["Date et heure d'envoi", externalDate(externalRequest.createdAt)],
              ["Expiration du lien", externalDate(externalRequest.expiresAt)],
              ["Consultation", externalDate(externalRequest.consultationAt)],
              ["Signature", externalDate(externalRequest.signedAt)],
              ["Adresse IP / hôte", externalRequest.signerIp||externalRequest.proof?.ip||"—"],
              ["Relances", `${(externalRequest.reminders||[]).length}`],
              ["Réactivations", `${(externalRequest.reactivations||[]).length}`],
              ["Preuve de signature", externalRequest.proof ? `Conservée · ${externalRequest.proof.mode||"signature"}` : "En attente"],
            ].map(([label,value])=><div key={label} style={{padding:"7px 0",borderBottom:"1px solid #ede9fe"}}><div style={{fontSize:10.5,fontWeight:900,color:"#7c3aed",textTransform:"uppercase",letterSpacing:".04em"}}>{label}</div><div style={{marginTop:3,color:"#334155",fontWeight:650,wordBreak:"break-word"}}>{value||"—"}</div></div>)}
          </div>
          <div style={{marginTop:14,fontSize:12,fontWeight:900,color:"#475569"}}>Journal complet des actions</div>
          <div style={{marginTop:6,display:"grid",gap:5}}>
            {(externalRequest.actions||[]).slice().reverse().map((action)=><div key={action.id} style={{padding:"7px 9px",borderRadius:7,background:WH,border:"1px solid #ede9fe",fontSize:12,color:"#334155"}}><b>{action.label}</b><div style={{color:MUT,marginTop:2}}>{externalDate(action.at)} · {action.actor}{action.ip?` · ${action.ip}`:""}</div></div>)}
          </div>
        </div>
      )}
    </div>
  );
}

function DocTabHistory({ doc, users = [] }) {
  const externalRequest = getExternalRequestById(doc.externalSignature?.requestId);
  const reminders = [...new Map([
    ...(doc.reminders || []),
    ...(doc.steps || []).flatMap((step) => step.reminders || []),
    ...(externalRequest?.reminders || []).map((reminder, index) => ({
      id: reminder.id,
      number: reminder.number || index + 1,
      stepId: externalRequest.stepId,
      stepLabel: externalRequest.stepLabel,
      actor: reminder.by,
      sentAt: reminder.at,
      dueAt: externalRequest.expiresAt,
      automatic: !!reminder.automatic,
    })),
  ].map((item) => [item.id, item])).values()].sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
  const signatures = (doc.steps || []).filter((step) =>
    ["signature", "paraphe"].includes(step.action) && step.status === "done"
  );
  const auditEntries = [...(doc.audit || [])].sort((a, b) => new Date(b.date) - new Date(a.date));
  const externalDate = (value) => value ? new Date(value).toLocaleString("fr-FR") : "-";

  return (
    <div style={{padding:"20px 0",display:"grid",gap:16}}>
      <Card style={{padding:16}}>
        <div style={{fontWeight:900,fontSize:14,marginBottom:12,color:`var(--ss-text,#1e293b)`}}>Tracabilite des signatures et paraphes</div>
        {signatures.length===0 && !externalRequest?.proof && <div style={{color:MUT,fontSize:12.5}}>Aucune signature enregistree pour ce document.</div>}
        <div style={{display:"grid",gap:8}}>
          {signatures.map((step)=><div key={step.id} style={{padding:"10px 12px",border:`1px solid ${BD}`,borderRadius:8,background:"#f0fdf4",fontSize:12.5}}>
            <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}><ActionBadge action={step.action}/><b>{step.label}</b><span style={{marginLeft:"auto",color:GREEN,fontWeight:800}}>{externalDate(step.doneAt)}</span></div>
            <div style={{color:MUT,marginTop:5}}>Signe par <b style={{color:"#334155"}}>{step.doneByName||userName(users,step.doneBy)}</b> · mode {step.signatureMode||"enregistre"} · preuve conservee {step.otpRequired?`· OTP ${step.otpVerified?"valide":"non valide"}`:""}</div>
          </div>)}
          {externalRequest?.proof && <div style={{padding:"10px 12px",border:"1px solid #ddd6fe",borderRadius:8,background:"#faf7ff",fontSize:12.5}}>
            <b style={{color:ACC2}}>Signature externe conservee</b>
            <div style={{color:MUT,marginTop:5}}>{externalRequest.thirdPartyName} · {externalRequest.email} · {externalDate(externalRequest.signedAt)} · IP {externalRequest.proof.ip||externalRequest.signerIp||"-"} · OTP valide le {externalDate(externalRequest.proof.otpVerifiedAt)}</div>
          </div>}
        </div>
      </Card>

      <Card style={{padding:16}}>
        <div style={{fontWeight:900,fontSize:14,marginBottom:12,color:`var(--ss-text,#1e293b)`}}>Historique des relances</div>
        {reminders.length===0 && <div style={{color:MUT,fontSize:12.5}}>Aucune relance enregistree pour ce document.</div>}
        <div style={{display:"grid",gap:7}}>
          {reminders.map((reminder)=><div key={reminder.id} style={{padding:"9px 11px",border:`1px solid ${BD}`,borderRadius:8,background:"#fffbeb",fontSize:12.5}}>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><b style={{color:"#92400e"}}>{reminder.automatic?"Relance automatique":"Relance manuelle"} n.{reminder.number}</b><span style={{marginLeft:"auto",color:MUT}}>{externalDate(reminder.sentAt)}</span></div>
            <div style={{color:MUT,marginTop:4}}>{reminder.stepLabel} · {reminder.actor}{reminder.dueAt?` · echeance ${externalDate(reminder.dueAt)}`:""}</div>
          </div>)}
        </div>
      </Card>

      {externalRequest && (
        <Card style={{padding:16}}>
          <div style={{fontWeight:900,fontSize:14,marginBottom:12,color:ACC2}}>Journal de signature externe</div>
          <div style={{display:"grid",gap:6}}>
            {(externalRequest.actions||[]).slice().reverse().map((action)=><div key={action.id} style={{padding:"8px 10px",border:"1px solid #ede9fe",borderRadius:7,background:"#faf7ff",fontSize:12.5}}><b>{action.label}</b><div style={{color:MUT,marginTop:3}}>{externalDate(action.at)} · {action.actor}{action.ip?` · IP ${action.ip}`:""}</div></div>)}
          </div>
        </Card>
      )}

      <Card style={{padding:16}}>
        <div style={{fontWeight:900,fontSize:14,marginBottom:12,color:`var(--ss-text,#1e293b)`}}>Journal complet du document</div>
        {auditEntries.length===0 && <div style={{color:MUT,fontSize:12.5}}>Aucun evenement enregistre.</div>}
        {auditEntries.map((entry,index)=><div key={entry.externalActionId||entry.reminderId||`${entry.date}-${index}`} style={{padding:"9px 0",borderTop:index?`1px solid ${BD}`:"none",fontSize:12.5}}>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><b>{entry.action}</b><span style={{marginLeft:"auto",color:MUT}}>{externalDate(entry.date)}</span></div>
          <div style={{color:MUT,marginTop:3}}>{entry.user}{entry.ip?` · IP ${entry.ip}`:""} · {entry.detail}</div>
        </div>)}
      </Card>
    </div>
  );
}

function DocTab4({ doc, users, authUser, signatures, otpConfig, externalAccounts = [], setDocs, onSaved, setAudit, setNotifs }) {
  const [comment, setComment] = useState("");
  const [otpSent, setOtpSent] = useState("");
  const [otpVal, setOtpVal] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [sigType, setSigType] = useState("registered");
  const [selectedSigId, setSelectedSigId] = useState("");
  const [typedSignature, setTypedSignature] = useState(authUser?.nom||"");
  const [drawnSignature, setDrawnSignature] = useState("");
  const [showExternalModal, setShowExternalModal] = useState(false);
  const [externalRequest, setExternalRequest] = useState(() => getExternalRequestById(doc.externalSignature?.requestId));
  const isLocked = doc.status==="archive"||doc.status==="termine"||doc.status==="rejete";
  const canActOnAny = authUser?.systemRole === "admin" || authUser?.systemRole === "superadmin";
  const canProcess = authUser?.systemRole !== "readonly";
  const activeStep = canProcess ? activeTaskForUser(doc, authUser?.id) || (canActOnAny ? activeSteps(doc)[0] : null) : null;
  const actionLabel = {validation:"Validation",paraphe:"Paraphe",signature:"Signature",revision:"Révision",archivage:"Archivage"}[activeStep?.action]||activeStep?.action||"";
  const needsOtp = otpConfig?.enabled && (activeStep?.otp || activeStep?.otpRequired);
  const externalBlocked = isExternalWorkflowBlocked(externalRequest);
  const mySigs = (signatures||[]).filter(s=>s.userId===authUser?.id);
  const selectedSignatureId = selectedSigId||mySigs.find((signature)=>signature.default)?.id||mySigs[0]?.id||"";
  const signatureValue = sigType==="registered" ? mySigs.find((signature)=>signature.id===selectedSignatureId)?.value||"" : sigType==="text" ? typedSignature.trim() : drawnSignature;
  const signatureAction = ["signature","paraphe"].includes(activeStep?.action);
  const actionsDisabled = externalBlocked || (needsOtp && !otpVerified) || (signatureAction && !signatureValue);
  const reminderConfig = normalizeReminderConfig(readRaw("ss_relancesConfig", {}));
  const reminderCount = (activeStep?.reminders || []).length;
  const updateExternalRequest = (request) => {
    setExternalRequest(request);
    setDocs?.((previous) => previous.map((item) => item.id === doc.id ? applyExternalRequestToDocument(item, request) : item));
  };

  if(isLocked) {
    return (
      <div style={{padding:"40px 20px",textAlign:"center",color:MUT}}>
        <div style={{fontSize:40,marginBottom:12}}>{doc.status==="rejete"?"❌":"🗄️"}</div>
        <div style={{fontSize:15,fontWeight:800,color:`var(--ss-text,#1e293b)`,marginBottom:6}}>
          {doc.status==="rejete"?"Document rejeté":"Document archivé"}
        </div>
        <div style={{fontSize:13}}>Aucune action possible sur ce document.</div>
      </div>
    );
  }
  if(!activeStep) {
    return (
      <div style={{padding:"40px 20px",textAlign:"center",color:MUT}}>
        <div style={{fontSize:40,marginBottom:12}}>⏳</div>
        <div style={{fontSize:14,fontWeight:700,color:`var(--ss-text,#1e293b)`,marginBottom:6}}>Aucune action requise</div>
        <div style={{fontSize:13}}>Ce document est en attente de la prochaine étape.</div>
      </div>
    );
  }

  const handleValidate = () => {
    if(externalBlocked) { alert("Le workflow est bloque jusqu'a la signature du tiers."); return; }
    if(needsOtp && !otpVerified) { alert("Veuillez saisir et valider le code OTP."); return; }
    const updated = completeStep(doc, activeStep.id, { user: authUser, comment, otpCode: otpVal, signatureMode: signatureAction?sigType:"", signatureValue: signatureAction?signatureValue:"" });
    setDocs?.(prev=>prev.map(d=>d.id===doc.id?updated:d));
    const auditEntry = updated.audit?.[updated.audit.length-1];
    if(auditEntry) setAudit?.(current=>[auditEntry,...current].slice(0,300));
    onSaved?.();
  };
  const handleReject = () => {
    if(actionsDisabled) return;
    const reason = comment||prompt("Motif du rejet :");
    if(!reason) return;
    const updated = rejectDocument(doc, activeStep.id, {user:authUser,reason});
    setDocs?.(prev=>prev.map(d=>d.id===doc.id?updated:d));
    const auditEntry = updated.audit?.[updated.audit.length-1];
    if(auditEntry) setAudit?.(current=>[auditEntry,...current].slice(0,300));
    onSaved?.();
  };
  const handleReminder = () => {
    if(reminderCount>=reminderConfig.maxRelances) {
      alert(`Le nombre maximum de relances (${reminderConfig.maxRelances}) est atteint pour cette etape.`);
      return;
    }
    const updated = addDocumentReminder(doc,activeStep.id,{actor:authUser?.nom||"Utilisateur interne"});
    const reminder = updated.reminders?.[updated.reminders.length-1];
    const auditEntry = updated.audit?.[updated.audit.length-1];
    setDocs?.(prev=>prev.map(d=>d.id===doc.id?updated:d));
    if(auditEntry) setAudit?.(current=>[auditEntry,...current].slice(0,300));
    if(reminder) setNotifs?.(current=>[{id:`N-${reminder.id}`,type:"relance",docId:doc.id,lu:false,date:reminder.sentAt,message:`${doc.ref} - relance manuelle n.${reminder.number} pour ${activeStep.label}`,...(reminderConfig.lienDirect?{targetView:"ss-docs-received"}:{})},...current]);
    onSaved?.();
  };

  return (
    <div style={{padding:"16px 0",display:"grid",gridTemplateColumns:"1fr 380px",gap:16,alignItems:"start"}}>
      {/* PDF mock */}
      <div style={{background:"#374151",borderRadius:12,overflow:"hidden",minHeight:500,position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
        {doc.fileB64 && canInlinePreview(doc) ? (
          <iframe src={filePreviewSrc(doc.fileB64)} style={{width:"100%",height:500,border:"none",display:"block"}} title="Aperçu" />
        ) : (
          <div style={{padding:32,color:"#e2e8f0",textAlign:"center"}}>
            <div style={{fontFamily:"serif",fontSize:18,fontWeight:900,marginBottom:12,letterSpacing:1}}>SOFTWELL MADAGASCAR</div>
            <div style={{fontSize:12,color:"#9ca3af",marginBottom:20}}>Document SoftSign — Aperçu simulé</div>
            <div style={{fontWeight:800,fontSize:16,marginBottom:8}}>{doc.title||"Sans titre"}</div>
            <div style={{fontSize:12,color:"#9ca3af",marginBottom:20}}>Référence {doc.ref} · Projet {doc.projectName} — site {doc.site}.</div>
            {[...Array(7)].map((_,i)=><div key={i} style={{height:6,borderRadius:3,background:"#6b7280",marginBottom:10,width:`${82-i*7}%`,margin:"0 auto 10px"}}/>)}
          </div>
        )}
      </div>
      {/* Action panel */}
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <Card style={{padding:16}}>
          <div style={{fontWeight:800,fontSize:14,marginBottom:10,color:`var(--ss-text,#1e293b)`}}>Action demandée</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
            <ActionBadge action={activeStep.action}/>
            <span style={{fontSize:11,fontWeight:800,color:ORANGE,background:"#fff7ed",border:`1px solid ${ORANGE}44`,borderRadius:12,padding:"2px 8px"}}>À traiter</span>
          </div>
          <div style={{fontSize:13,lineHeight:1.8,color:MUT}}>
            <div><b style={{color:`var(--ss-text,#1e293b)`}}>{activeStep.label||`Étape ${activeStep.order}`}</b></div>
            <div>Signataires : {(activeStep.signers||[]).map(id=>userName(users,id)).join(", ")||"—"}</div>
            {activeStep.zoneMode && <div>Zone PDF : {activeStep.zoneMode} — {activeStep.position||"standard"}</div>}
            {activeStep.dueAt && <div>Délai : {new Date(activeStep.dueAt).toLocaleString("fr-FR")}</div>}
          </div>
          <div style={{marginTop:10}}>
            <label style={{display:"block",fontSize:11,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".07em",marginBottom:4}}>Commentaire</label>
            <textarea rows={2} style={{...inputStyle,resize:"none",lineHeight:1.5}} value={comment} onChange={e=>setComment(e.target.value)} placeholder="Observations..." />
          </div>
        </Card>
        {externalRequest && (
          <ExternalSignatureStatusPanel requestId={externalRequest.id} authUser={authUser} onRequestChange={updateExternalRequest} />
        )}
        {activeStep.allowExternalSignature && !externalRequest && (
          <Card style={{padding:16,background:"#faf7ff",border:"1px solid #ddd6fe"}}>
            <div style={{fontWeight:850,fontSize:13.5,color:ACC2}}>Signature externe autorisee pour cette etape</div>
            <div style={{fontSize:12,color:MUT,lineHeight:1.6,marginTop:5}}>Transmettez le document a un fournisseur valide. Le workflow sera bloque jusqu'a sa signature.</div>
            <button onClick={()=>setShowExternalModal(true)} style={{marginTop:11,padding:"8px 13px",borderRadius:8,border:"none",background:ACC2,color:"#fff",cursor:"pointer",fontFamily:FONT,fontWeight:800,fontSize:12.5}}>Envoyer pour signature externe</button>
          </Card>
        )}
        {["signature","paraphe"].includes(activeStep.action) && (
          <Card style={{padding:16}}>
            <div style={{fontWeight:800,fontSize:14,marginBottom:12,color:`var(--ss-text,#1e293b)`}}>Signature du document</div>
            <div style={{display:"flex",gap:0,marginBottom:12,border:`1px solid ${BD}`,borderRadius:8,overflow:"hidden"}}>
              {[["registered","Enregistrée"],["text","Texte"],["draw","Dessinée"]].map(([id,lbl])=>(
                <button key={id} onClick={()=>setSigType(id)} style={{flex:1,padding:"8px 6px",border:"none",borderRight:id!=="draw"?`1px solid ${BD}`:"none",background:sigType===id?`${ACC2}14`:WH,color:sigType===id?ACC2:`var(--ss-text,#1e293b)`,cursor:"pointer",fontSize:12.5,fontWeight:sigType===id?800:500,fontFamily:FONT}}>
                  {lbl}
                </button>
              ))}
            </div>
            {sigType==="registered" && (
              <select style={inputStyle} value={selectedSignatureId} onChange={(event)=>setSelectedSigId(event.target.value)}>
                <option value="">Sélectionner une signature</option>
                {mySigs.map(s=><option key={s.id} value={s.id}>{s.label||s.nom||"Signature"}</option>)}
                {mySigs.length===0 && <option disabled>— Aucune signature enregistrée —</option>}
              </select>
            )}
            {sigType==="text" && <input style={inputStyle} value={typedSignature} onChange={(event)=>setTypedSignature(event.target.value)} placeholder={`${authUser?.nom?.split(" ")[0]||"Nom"} — Texte`} />}
            {sigType==="draw" && <SignaturePad onChange={setDrawnSignature} />}
            {!signatureValue && <div style={{fontSize:11.5,color:ORANGE,marginTop:8}}>Sélectionnez ou saisissez une signature pour continuer.</div>}
          </Card>
        )}
        {needsOtp && !externalBlocked && (
          <Card style={{padding:16,background:"#eff6ff",border:"1px solid #bfdbfe"}}>
            <div style={{fontWeight:800,fontSize:14,marginBottom:10,color:BLUE}}>Authentification OTP requise</div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>{setOtpSent(String(Math.floor(Math.random()*1000000)).padStart(6,"0"));setOtpVal("");setOtpVerified(false);}} style={{padding:"8px 14px",borderRadius:8,border:"none",background:BLUE,color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:FONT,whiteSpace:"nowrap"}}>
                {otpSent?"✓ OTP envoyé":"Générer / envoyer OTP"}
              </button>
              <input style={{...inputStyle,flex:1}} placeholder="Code OTP" value={otpVal} onChange={e=>setOtpVal(e.target.value)} maxLength={6} />
              <button disabled={!otpSent||!otpVal} onClick={()=>setOtpVerified(otpVal===otpSent)} style={{padding:"8px 12px",borderRadius:8,border:"none",background:otpSent&&otpVal?GREEN:"#cbd5e1",color:"#fff",cursor:otpSent&&otpVal?"pointer":"not-allowed",fontSize:12.5,fontWeight:700,fontFamily:FONT}}>Verifier</button>
            </div>
            {otpSent && <div style={{fontSize:11.5,color:BLUE,marginTop:8}}>Code de demonstration : <b>{otpSent}</b>{otpVerified&&<span style={{color:GREEN}}> · Code valide</span>}</div>}
          </Card>
        )}
        <div style={{display:"flex",gap:8,justifyContent:"flex-end",paddingTop:4}}>
          {!externalRequest && <button onClick={handleReminder} style={{padding:"8px 16px",borderRadius:8,border:`1px solid ${ORANGE}`,background:"#fffbeb",color:"#92400e",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:FONT}}>Relancer ({reminderCount}/{reminderConfig.maxRelances})</button>}
          <Button tone="light" onClick={onSaved}>Annuler</Button>
          <button disabled={actionsDisabled} onClick={handleReject} style={{padding:"8px 16px",borderRadius:8,border:"none",background:actionsDisabled?"#cbd5e1":RED,color:"#fff",cursor:actionsDisabled?"not-allowed":"pointer",fontSize:13,fontWeight:700,fontFamily:FONT}}>Rejeter</button>
          <button disabled={actionsDisabled} onClick={handleValidate} style={{padding:"8px 16px",borderRadius:8,border:"none",background:actionsDisabled?"#cbd5e1":activeStep.action==="signature"?ACC2:GREEN,color:"#fff",cursor:actionsDisabled?"not-allowed":"pointer",fontSize:13,fontWeight:700,fontFamily:FONT}}>Valider l&apos;action</button>
        </div>
      </div>
      {showExternalModal && <ExternalSignatureRequestModal doc={doc} step={activeStep} externalAccounts={externalAccounts} authUser={authUser} onClose={()=>setShowExternalModal(false)} onCreated={updateExternalRequest} />}
    </div>
  );
}

function DocDetailView({ doc, docs, setDocs, users, authUser, signatures, otpConfig, externalAccounts, delegations, isArchiveDetail = false, onBack, setAudit, setNotifs }) {
  const [tab, setTab] = useState("details");
  const TABS = [
    {id:"details",label:"Détails"},
    {id:"documents",label:"Documents"},
    {id:"workflow",label:"Workflow"},
    {id:"history",label:"Historique"},
    {id:"actions",label:"Actions"},
  ];
  return (
    <div style={{fontFamily:FONT}}>
      <button onClick={onBack} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",color:MUT,fontSize:13,fontWeight:600,fontFamily:FONT,marginBottom:16,padding:0}}>
        ← Retour à la liste
      </button>
      <Card style={{padding:0,overflow:"hidden"}}>
        <div style={{padding:"16px 20px",borderBottom:`1px solid ${BD}`,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
          <span style={{fontWeight:900,fontSize:17,color:`var(--ss-text,#1e293b)`}}>{doc.ref||"—"}</span>
          <StatusBadge status={doc.status}/>
        </div>
        <div style={{display:"flex",gap:0,padding:"0 20px",borderBottom:`1px solid ${BD}`}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"11px 18px",border:"none",borderBottom:`2.5px solid ${tab===t.id?ACC2:"transparent"}`,background:"transparent",cursor:"pointer",fontSize:13,fontWeight:tab===t.id?800:500,color:tab===t.id?ACC2:MUT,fontFamily:FONT}}>
              {t.label}
            </button>
          ))}
        </div>
        <div style={{padding:"0 20px 20px"}}>
          {tab==="details"   && <DocTab1 doc={doc}/>}
          {tab==="documents" && <DocTab2 doc={doc} users={users} delegations={delegations} isArchiveDetail={isArchiveDetail}/>}
          {tab==="workflow"  && <DocTab3 doc={doc} users={users}/>}
          {tab==="history"   && <DocTabHistory doc={doc} users={users}/>}
          {tab==="actions"   && <DocTab4 doc={doc} users={users} authUser={authUser} signatures={signatures} otpConfig={otpConfig} externalAccounts={externalAccounts} setDocs={setDocs} onSaved={onBack} setAudit={setAudit} setNotifs={setNotifs}/>}
        </div>
      </Card>
    </div>
  );
}

/* ── Advanced Search Panel (2.8) ── */
function AdvancedSearchPanel({ docs, users, workflows, projets, onSearch, onCancel }) {
  const [savedSearch] = useState(() => readRaw("ss_savedSearch", {}));
  const [ref, setRef] = useState(savedSearch.ref||"");
  const [proj, setProj] = useState(savedSearch.proj||"");
  const [site, setSite] = useState(savedSearch.site||"");
  const [titleOp, setTitleOp] = useState(savedSearch.titleOp||"contient");
  const [titleVal, setTitleVal] = useState(savedSearch.titleVal||"");
  const [keywords, setKeywords] = useState(savedSearch.keywords||"");
  const [actors, setActors] = useState(Array.isArray(savedSearch.actors)&&savedSearch.actors.length?savedSearch.actors:[{role:"expediteur",userId:"",from:"",to:""}]);
  const [docType, setDocType] = useState(savedSearch.docType||"");
  const [wfId, setWfId] = useState(savedSearch.wfId||"");
  const [statuses, setStatuses] = useState({...{en_cours:true,termine:true,rejete:false,archive:false},...(savedSearch.statuses||{})});
  const [saved, setSaved] = useState(!!savedSearch.savedAt);
  const siteOpts = useMemo(()=>{
    const allSites = (projets||[]).flatMap(p=>p.sites||[]);
    return [...new Set(allSites)];
  },[projets]);

  const handleSearch = () => {
    let r = docs;
    if(ref) r = r.filter(d=>String(d.ref||"").toLowerCase().includes(ref.toLowerCase()));
    if(proj) r = r.filter(d=>d.projectId===proj);
    if(site) r = r.filter(d=>d.site===site);
    if(titleVal) {
      const q=titleVal.toLowerCase();
      if(titleOp==="contient") r=r.filter(d=>String(d.title||"").toLowerCase().includes(q));
      else if(titleOp==="commence") r=r.filter(d=>String(d.title||"").toLowerCase().startsWith(q));
      else r=r.filter(d=>String(d.title||"").toLowerCase()===q);
    }
    if(keywords) { const q=keywords.toLowerCase(); r=r.filter(d=>[d.title,d.ref,d.projectName,d.deposantName].some(x=>String(x||"").toLowerCase().includes(q))); }
    for(const actor of actors.filter(a=>a.userId)) {
      r=r.filter(d=>{
        const matchingSteps=(d.steps||[]).filter(s=>{
          if(actor.role==="valideur") return s.action==="validation"&&s.doneBy===actor.userId;
          if(actor.role==="signataire") return ["signature","paraphe"].includes(s.action)&&s.doneBy===actor.userId;
          if(actor.role==="traiter") return s.status==="active"&&(s.signers||[]).includes(actor.userId);
          return false;
        });
        const dates=actor.role==="expediteur"
          ? [d.createdAt,d.dateDepot].filter(Boolean)
          : matchingSteps.map(s=>s.completedAt||s.doneAt||s.dueAt).filter(Boolean);
        const matchesRole=actor.role==="expediteur"
          ? d.deposantId===actor.userId||d.authorId===actor.userId
          : matchingSteps.length>0;
        return matchesRole&&((!actor.from&&!actor.to)||dates.some(date=>(!actor.from||date>=actor.from)&&(!actor.to||date<=`${actor.to}T23:59:59`)));
      });
    }
    if(docType) r=r.filter(d=>d.type===docType);
    if(wfId) r=r.filter(d=>d.workflowId===wfId||d.workflowName===wfId);
    const activeStatuses=Object.entries(statuses).filter(([,v])=>v).map(([k])=>k);
    if(activeStatuses.length<4) r=r.filter(d=>activeStatuses.includes(d.status));
    onSearch(r);
  };
  const handleSaveSearch = () => {
    writeRaw("ss_savedSearch",{ref,proj,site,titleOp,titleVal,keywords,actors,docType,wfId,statuses,savedAt:new Date().toISOString()});
    setSaved(true);
  };
  const handleReset = () => { setRef(""); setProj(""); setSite(""); setTitleOp("contient"); setTitleVal(""); setKeywords(""); setActors([{role:"expediteur",userId:"",from:"",to:""}]); setDocType(""); setWfId(""); setStatuses({en_cours:true,termine:true,rejete:false,archive:false}); setSaved(false); };
  const Section=({title,children,defaultOpen=true})=>{
    const [open,setOpen]=useState(defaultOpen);
    return (
      <div style={{border:`1px solid ${BD}`,borderRadius:10,overflow:"hidden",marginBottom:12}}>
        <button onClick={()=>setOpen(p=>!p)} style={{width:"100%",padding:"12px 16px",display:"flex",alignItems:"center",gap:8,border:"none",background:WH,cursor:"pointer",fontFamily:FONT,textAlign:"left"}}>
          <span style={{fontSize:13}}>{open?"▾":"▸"}</span>
          <span style={{fontWeight:800,fontSize:13.5,color:`var(--ss-text,#1e293b)`}}>{title}</span>
        </button>
        {open&&<div style={{padding:"16px",borderTop:`1px solid ${BD}`,background:BG}}>{children}</div>}
      </div>
    );
  };
  const StatusChk=({id,label,color})=>(
    <label style={{display:"flex",alignItems:"center",gap:8,padding:"6px 12px",borderRadius:8,border:`1.5px solid ${statuses[id]?color:BD}`,background:statuses[id]?`${color}14`:WH,cursor:"pointer",fontSize:13,fontWeight:700,color:statuses[id]?color:`var(--ss-text,#1e293b)`}}>
      <input type="checkbox" checked={!!statuses[id]} onChange={e=>setStatuses(p=>({...p,[id]:e.target.checked}))} style={{accentColor:color}} />
      {label}
    </label>
  );
  return (
    <div style={{fontFamily:FONT,maxWidth:680}}>
      <div style={{marginBottom:20}}>
        <h2 style={{margin:0,fontSize:24,fontWeight:900,color:`var(--ss-text,#1e293b)`}}>Tableau de bord de recherche avancée</h2>
      </div>
      <Section title="Informations Générales">
        <div style={{display:"grid",gap:12}}>
          <div><label style={{display:"block",fontSize:11,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".07em",marginBottom:4}}>Référence</label><input style={inputStyle} value={ref} onChange={e=>setRef(e.target.value)} placeholder="DOC-2026-001" /></div>
          <div><label style={{display:"block",fontSize:11,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".07em",marginBottom:4}}>Projet</label>
            <select style={inputStyle} value={proj} onChange={e=>setProj(e.target.value)}>
              <option value="">Sélectionner un projet</option>
              {(projets||[]).map(p=><option key={p.id} value={p.id}>{p.nom}</option>)}
            </select>
          </div>
          <div><label style={{display:"block",fontSize:11,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".07em",marginBottom:4}}>Site</label>
            <select style={inputStyle} value={site} onChange={e=>setSite(e.target.value)}>
              <option value="">Sélectionner un site</option>
              {siteOpts.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </Section>
      <Section title="Critères Textuels & Contenu">
        <div style={{display:"grid",gap:12}}>
          <div><label style={{display:"block",fontSize:11,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".07em",marginBottom:4}}>Titre du document</label>
            <div style={{display:"flex",gap:8}}>
              <select style={{...inputStyle,flex:"0 1 150px"}} value={titleOp} onChange={e=>setTitleOp(e.target.value)}>
                <option value="contient">Contient</option>
                <option value="commence">Commence par</option>
                <option value="exact">Exact</option>
              </select>
              <input style={{...inputStyle,flex:1}} value={titleVal} onChange={e=>setTitleVal(e.target.value)} placeholder="Facture" />
            </div>
          </div>
          <div><label style={{display:"block",fontSize:11,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".07em",marginBottom:4}}>Contenu (Mots-clés)</label>
            <input style={inputStyle} value={keywords} onChange={e=>setKeywords(e.target.value)} placeholder="Rechercher dans le contenu..." />
          </div>
        </div>
      </Section>
      <Section title="Acteurs du Document">
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {actors.map((a,i)=>(
            <div key={i} style={{display:"grid",gridTemplateColumns:"160px 200px 1fr auto",gap:8,alignItems:"center"}}>
              <select style={inputStyle} value={a.role} onChange={e=>setActors(prev=>prev.map((x,j)=>j===i?{...x,role:e.target.value}:x))}>
                <option value="expediteur">Expéditeur :</option>
                <option value="valideur">Validé par :</option>
                <option value="signataire">Signé par :</option>
                <option value="traiter">À traiter par :</option>
              </select>
              <select style={inputStyle} value={a.userId} onChange={e=>setActors(prev=>prev.map((x,j)=>j===i?{...x,userId:e.target.value}:x))}>
                <option value="">Sélectionner un utilisateur...</option>
                {users.map(u=><option key={u.id} value={u.id}>{u.nom}</option>)}
              </select>
              <div style={{display:"flex",gap:4,alignItems:"center"}}>
                <span style={{fontSize:11,color:MUT,whiteSpace:"nowrap"}}>Entre le</span>
                <input type="date" style={{...inputStyle,flex:1}} value={a.from} onChange={e=>setActors(prev=>prev.map((x,j)=>j===i?{...x,from:e.target.value}:x))} />
                <span style={{fontSize:11,color:MUT,whiteSpace:"nowrap"}}>la</span>
                <input type="date" style={{...inputStyle,flex:1}} value={a.to} onChange={e=>setActors(prev=>prev.map((x,j)=>j===i?{...x,to:e.target.value}:x))} />
              </div>
              <button onClick={()=>setActors(prev=>prev.filter((_,j)=>j!==i))} style={{width:26,height:26,borderRadius:"50%",border:"none",background:"#fef2f2",color:RED,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FONT}}>×</button>
            </div>
          ))}
          <button onClick={()=>setActors(prev=>[...prev,{role:"expediteur",userId:"",from:"",to:""}])} style={{alignSelf:"flex-start",display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:8,border:`1px dashed ${ACC2}`,background:`${ACC2}08`,color:ACC2,cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:FONT}}>
            + Ajouter un acteur
          </button>
        </div>
      </Section>
      <Section title="Propriétés & Statuts">
        <div style={{display:"grid",gap:12}}>
          <div><label style={{display:"block",fontSize:11,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".07em",marginBottom:4}}>Type de document</label>
            <select style={{...inputStyle,maxWidth:260}} value={docType} onChange={e=>setDocType(e.target.value)}>
              <option value="">Sélectionner un type</option>
              {SS_DOC_TYPES.map(t=><option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </div>
          <div><label style={{display:"block",fontSize:11,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".07em",marginBottom:4}}>Workflow</label>
            <select style={{...inputStyle,maxWidth:260}} value={wfId} onChange={e=>setWfId(e.target.value)}>
              <option value="">Tous les workflows</option>
              {(workflows||[]).map(w=><option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </div>
          <div><label style={{display:"block",fontSize:11,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".07em",marginBottom:4}}>Statut</label>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <StatusChk id="en_cours" label="En cours" color={BLUE}/>
              <StatusChk id="termine" label="Validé" color={GREEN}/>
              <StatusChk id="rejete" label="Rejeté" color={RED}/>
              <StatusChk id="archive" label="Archivé" color={MUT}/>
            </div>
          </div>
        </div>
      </Section>
      <div style={{display:"flex",gap:10,justifyContent:"space-between",alignItems:"center",paddingTop:8,flexWrap:"wrap"}}>
        <div style={{display:"flex",gap:8}}>
          <button onClick={handleReset} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:8,border:`1px solid ${BD}`,background:WH,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:FONT,color:`var(--ss-text,#1e293b)`}}>
            ↺ Réinitialiser
          </button>
          <button onClick={handleSaveSearch} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:8,border:`1px solid ${ACC2}`,background:`${ACC2}0d`,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:FONT,color:ACC2}}>
            {saved?"✓ Sauvegardée":"🔖 Sauvegarder cette recherche"}
          </button>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={onCancel} style={{padding:"8px 16px",borderRadius:8,border:`1px solid ${BD}`,background:WH,cursor:"pointer",fontSize:13,fontFamily:FONT,color:MUT}}>
            × Annuler
          </button>
          <button onClick={handleSearch} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 20px",borderRadius:8,border:"none",background:ACC2,color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:FONT}}>
            🔍 Lancer la recherche
          </button>
        </div>
      </div>
    </div>
  );
}

function UnifiedDocModule({ moduleId, docs, setDocs, authUser, users, workflows, setWorkflows, projets, signatures, otpConfig, externalAccounts, delegations, notifs, setNotifs, audit, onRefresh, setAudit, generalSettings }) {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [showSearch, setShowSearch] = useState(moduleId === "ss-search");

  // Reset state when switching modules
  useEffect(() => { setSelectedDoc(null); setSearchResults(null); setShowSearch(moduleId==="ss-search"); }, [moduleId]);

  if(selectedDoc && moduleId==="ss-docs-external") {
    return <DepositWizard docs={docs} setDocs={setDocs} workflows={workflows} setWorkflows={setWorkflows} notifs={notifs} setNotifs={setNotifs} audit={audit} setAudit={setAudit} signatures={signatures} delegations={delegations} authUser={authUser} users={users} projets={projets} setView={() => setSelectedDoc(null)} generalSettings={generalSettings} sourceDoc={selectedDoc} onExit={() => setSelectedDoc(null)} />;
  }
  if(selectedDoc) {
    return <DocDetailView doc={selectedDoc} docs={docs} setDocs={setDocs} users={users} authUser={authUser} signatures={signatures} otpConfig={otpConfig} externalAccounts={externalAccounts} delegations={delegations} isArchiveDetail={moduleId==="ss-archives"} onBack={()=>setSelectedDoc(null)} setAudit={setAudit} setNotifs={setNotifs} />;
  }
  if(moduleId==="ss-search" && showSearch) {
    return <AdvancedSearchPanel docs={docs} users={users} workflows={workflows} projets={projets} onSearch={(r)=>{setSearchResults(r);setShowSearch(false);}} onCancel={()=>setShowSearch(false)} />;
  }
  const listDocs = moduleId==="ss-search" ? (searchResults||docs) : docs;
  return (
    <div>
      {moduleId==="ss-search" && !showSearch && (
        <div style={{marginBottom:12}}>
          <button onClick={()=>setShowSearch(true)} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:8,border:`1px solid ${ACC2}`,background:`${ACC2}0d`,color:ACC2,cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:FONT}}>
            ← Modifier la recherche
          </button>
        </div>
      )}
      <DocListView moduleId={moduleId} docs={listDocs} users={users} projets={projets||[]} authUser={authUser} onSelect={setSelectedDoc} onRefresh={onRefresh} />
    </div>
  );
}

/* ═══════════════════════════ WORKFLOW ADMIN ═══════════════════════════ */

const WF_ACTION_CONF = {
  revision:   { label: "Révision",   color: "#1d4ed8", bg: "#dbeafe", dot: "#2563eb" },
  validation: { label: "Validation", color: "#0e7490", bg: "#cffafe", dot: "#06b6d4" },
  paraphe:    { label: "Paraphe",    color: "#d97706", bg: "#fef3c7", dot: "#f59e0b" },
  signature:  { label: "Signature",  color: "#7c3aed", bg: "#ede9fe", dot: "#8b5cf6" },
  archivage:  { label: "Archivage",  color: "#475569", bg: "#f1f5f9", dot: "#64748b" },
};

function WFActionDot({ action, size = 8 }) {
  const c = WF_ACTION_CONF[action] || WF_ACTION_CONF.validation;
  return <span style={{ display: "inline-block", width: size, height: size, borderRadius: "50%", background: c.dot, flexShrink: 0 }} />;
}

function WorkflowFlowGraph({ steps }) {
  if (!steps?.length) return null;
  const sorted = [...steps].sort((a, b) => a.order - b.order);

  const groups = [];
  const visited = new Set();

  for (const step of sorted) {
    if (visited.has(step.id)) continue;
    const stepType = step.type || step.mode || "sequentielle";
    if (stepType === "parallele") {
      const siblings = sorted.filter((s) => {
        const sType = s.type || s.mode || "sequentielle";
        return sType === "parallele" && (s.parallelWith === step.id || s.id === step.parallelWith || s.parallelWith === step.parallelWith) && !visited.has(s.id);
      });
      const group = [step, ...siblings.filter((s) => s.id !== step.id)];
      group.forEach((s) => visited.add(s.id));
      groups.push({ type: "parallel", steps: group });
    } else {
      visited.add(step.id);
      groups.push({ type: "sequential", step });
    }
  }

  return (
    <div style={{ padding: "16px 18px", background: "#0f1117", borderRadius: 10, overflowX: "auto", marginTop: 14 }}>
      <div style={{ fontSize: 10.5, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 12 }}>Visualisation du circuit</div>
      <div style={{ display: "flex", alignItems: "center", gap: 0, minWidth: "max-content" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#475569" }} />
          <div style={{ fontSize: 10, color: "#64748b", marginTop: 4, whiteSpace: "nowrap" }}>Soumission</div>
        </div>
        {groups.map((group, gi) => (
          <div key={gi} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: 28, height: 2, background: "#334155" }} />
            {group.type === "sequential" ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ padding: "5px 12px", borderRadius: 6, background: `${WF_ACTION_CONF[group.step.action]?.dot || "#6d28d9"}22`, border: `1px solid ${WF_ACTION_CONF[group.step.action]?.dot || "#6d28d9"}55`, display: "flex", alignItems: "center", gap: 5 }}>
                  <WFActionDot action={group.step.action} />
                  <span style={{ fontSize: 11, color: "#e2e8f0", fontWeight: 700, whiteSpace: "nowrap" }}>{group.step.label}</span>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 4, position: "relative" }}>
                {group.steps.map((s, si) => (
                  <div key={s.id} style={{ display: "flex", alignItems: "center" }}>
                    {si > 0 && <div style={{ width: 16, height: 2, background: "#334155" }} />}
                    {si === 0 && <div style={{ width: 16, height: 2, background: "transparent" }} />}
                    <div style={{ padding: "4px 10px", borderRadius: 6, background: `${WF_ACTION_CONF[s.action]?.dot || "#6d28d9"}22`, border: `1px solid ${WF_ACTION_CONF[s.action]?.dot || "#6d28d9"}55`, display: "flex", alignItems: "center", gap: 5 }}>
                      <WFActionDot action={s.action} />
                      <span style={{ fontSize: 10.5, color: "#e2e8f0", fontWeight: 700, whiteSpace: "nowrap" }}>{s.label}</span>
                    </div>
                  </div>
                ))}
                <div style={{ position: "absolute", left: 16, top: 0, bottom: 0, width: 2, background: "#334155", zIndex: 0 }} />
              </div>
            )}
          </div>
        ))}
        <div style={{ width: 28, height: 2, background: "#334155" }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981" }} />
          <div style={{ fontSize: 10, color: "#64748b", marginTop: 4, whiteSpace: "nowrap" }}>Finalisé</div>
        </div>
      </div>
    </div>
  );
}

function WorkflowStepRow({ step, allSteps, users, onUpdate, onDelete }) {
  const [showPicker, setShowPicker] = useState(false);
  const stepType = step.type || step.mode || "sequentielle";
  const cfg = WF_ACTION_CONF[step.action] || WF_ACTION_CONF.validation;
  const otherSteps = allSteps.filter((s) => s.id !== step.id);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "36px 52px 1fr 1.5fr 200px 150px 180px 170px 170px 72px", gap: 10, alignItems: "start", padding: "12px 12px", background: WH, border: `1px solid ${BD}`, borderRadius: 9, position: "relative" }}>
      {/* Drag handle */}
      <div style={{ color: "#94a3b8", fontSize: 17, cursor: "grab", paddingTop: 9, textAlign: "center", userSelect: "none" }}>⠿⠿</div>

      {/* Order */}
      <input style={{ ...inputStyle, textAlign: "center", fontWeight: 900, fontSize: 14 }} type="number" min={1} value={step.order} onChange={(e) => onUpdate({ order: Number(e.target.value) })} />

      {/* Label */}
      <input style={inputStyle} value={step.label} placeholder="Intitulé de l'étape..." onChange={(e) => onUpdate({ label: e.target.value })} />

      {/* Signers multi-select */}
      <div style={{ position: "relative" }}>
        <div
          style={{ border: `1px solid ${BD}`, borderRadius: 8, padding: "5px 8px", minHeight: 38, background: WH, cursor: "pointer", display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center" }}
          onClick={() => setShowPicker(!showPicker)}
        >
          {(step.signers || []).map((id) => {
            const u = users.find((u) => u.id === id);
            return (
              <span key={id} style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#eff6ff", color: BLUE, borderRadius: 20, padding: "2px 9px", fontSize: 11.5, fontWeight: 700 }}>
                {u?.nom || id}
                <button onClick={(e) => { e.stopPropagation(); onUpdate({ signers: (step.signers || []).filter((s) => s !== id) }); }} style={{ border: "none", background: "transparent", cursor: "pointer", color: BLUE, padding: 0, fontSize: 14, lineHeight: 1 }}>×</button>
              </span>
            );
          })}
          <span style={{ color: ACC2, fontSize: 20, lineHeight: 1, paddingBottom: 1 }}>+</span>
        </div>
        {showPicker && (
          <div style={{ position: "absolute", top: "100%", left: 0, zIndex: 200, background: WH, border: `1px solid ${BD}`, borderRadius: 8, boxShadow: "0 6px 24px rgba(0,0,0,.12)", minWidth: 210, maxHeight: 210, overflowY: "auto" }}>
            {users.filter((u) => !(step.signers || []).includes(u.id)).map((u) => (
              <div key={u.id}
                onClick={() => { onUpdate({ signers: [...(step.signers || []), u.id] }); setShowPicker(false); }}
                style={{ padding: "9px 13px", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#f5f3ff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = WH; }}
              >
                <MiniAvatar name={u.nom} color={ACC2} />
                <div><div style={{ fontWeight: 700 }}>{u.nom}</div><div style={{ fontSize: 11, color: MUT }}>{u.role}</div></div>
              </div>
            ))}
            {users.every((u) => (step.signers || []).includes(u.id)) && (
              <div style={{ padding: "10px 13px", color: MUT, fontSize: 12 }}>Tous les utilisateurs ajoutés</div>
            )}
          </div>
        )}
      </div>

      {/* Action */}
      <div style={{ position: "relative" }}>
        <select style={{ ...inputStyle, paddingLeft: 26, color: cfg.color, fontWeight: 700 }} value={step.action} onChange={(e) => onUpdate({ action: e.target.value })}>
          {Object.entries(WF_ACTION_CONF).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
        </select>
        <WFActionDot action={step.action} size={9} />
        <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><WFActionDot action={step.action} size={9} /></span>
      </div>

      {/* Type */}
      <select style={inputStyle} value={stepType} onChange={(e) => onUpdate({ type: e.target.value, mode: e.target.value, parallelWith: e.target.value === "sequentielle" ? null : step.parallelWith })}>
        <option value="sequentielle">Séquentielle</option>
        <option value="parallele">Parallèle</option>
      </select>

      {/* Parallel step */}
      {stepType === "parallele" ? (
        <select style={inputStyle} value={step.parallelWith || ""} onChange={(e) => onUpdate({ parallelWith: e.target.value || null })}>
          <option value="">— Étape associée —</option>
          {otherSteps.map((s) => <option key={s.id} value={s.id}>Étape {s.order} : {s.label}</option>)}
        </select>
      ) : (
        <div style={{ height: 38, display: "flex", alignItems: "center", justifyContent: "center", color: "#cbd5e1", fontSize: 20 }}>—</div>
      )}

      {/* Duration */}
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <input style={{ ...inputStyle, flex: 1, minWidth: 0 }} type="number" min={1} value={step.durationDays} onChange={(e) => onUpdate({ durationDays: Number(e.target.value) })} />
        <span style={{ fontSize: 12, color: MUT, whiteSpace: "nowrap" }}>jour(s)</span>
      </div>

      {/* External signature */}
      <div style={{ height: 38, display: "flex", alignItems: "center", gap: 8 }}>
        <WfToggle checked={!!step.allowExternalSignature} onChange={(value) => onUpdate({ allowExternalSignature: value })} />
        <span style={{ color: step.allowExternalSignature ? ACC2 : MUT, fontSize: 11.5, fontWeight: 750, lineHeight: 1.25 }}>Autoriser signature externe</span>
      </div>

      {/* Row actions */}
      <div style={{ display: "flex", gap: 6 }}>
        <button
          title={`OTP ${step.otpRequired ? "activé" : "désactivé"}`}
          onClick={() => onUpdate({ otpRequired: !step.otpRequired })}
          style={{ width: 32, height: 32, border: `1px solid ${step.otpRequired ? ACC2 : BD}`, borderRadius: 7, background: step.otpRequired ? `${ACC2}12` : WH, cursor: "pointer", fontSize: 13, color: step.otpRequired ? ACC2 : MUT }}
        >🔑</button>
        <button
          onClick={onDelete}
          style={{ width: 32, height: 32, border: `1px solid #fca5a5`, borderRadius: 7, background: "#fef2f2", cursor: "pointer", color: RED, fontSize: 14 }}
        >🗑</button>
      </div>
    </div>
  );
}

const WF_TYPE_COLORS = { facture:"#7c3aed", contrat:"#059669", avenant:"#f59e0b", rapport:"#2563eb", protocole:"#0891b2", bon_commande:"#d97706", devis:"#dc2626", autre:"#64748b" };
const WF_TYPE_BG    = { facture:"#f5f3ff", contrat:"#f0fdf4", avenant:"#fffbeb", rapport:"#eff6ff", protocole:"#ecfeff", bon_commande:"#fffbeb", devis:"#fef2f2", autre:"#f8fafc" };

function formatWfCondition(c) {
  const FL = { amount:"Montant TTC", montant:"Montant TTC", devise:"Devise", currency:"Devise", site:"Site", type:"Type", pays:"Pays", country:"Pays", field:"Champ" };
  const OP = { ">":">","<":"<",">=":"≥","<=":"≤","=":"=","==":"=","!=":"≠","<>":"≠" };
  const fld = FL[c.field] || c.field;
  const op  = OP[c.op] || c.op;
  const val = typeof c.value === "number" ? c.value.toLocaleString("fr-FR") + " MGA" : String(c.value);
  return `${fld} ${op} ${val}`;
}

function WfToggle({ checked, onChange }) {
  return (
    <div onClick={() => onChange(!checked)} style={{ width: 42, height: 24, borderRadius: 12, background: checked ? ACC2 : "#cbd5e1", cursor: "pointer", position: "relative", transition: "background .18s", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 3, left: checked ? 21 : 3, width: 18, height: 18, borderRadius: "50%", background: WH, boxShadow: "0 1px 3px rgba(0,0,0,.25)", transition: "left .18s" }} />
    </div>
  );
}

function WorkflowAdmin({ workflows, setWorkflows, users, projets }) {
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatut, setFilterStatut] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [collapsed, setCollapsed] = useState({});
  const [viewingWf, setViewingWf] = useState(null);

  const mkStep = (order) => ({
    id: `S-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    order,
    label: order === 1 ? "Révision" : order === 2 ? "Validation" : "Signature",
    signers: [],
    action: order === 1 ? "revision" : order === 2 ? "validation" : "signature",
    type: "sequentielle",
    mode: "sequentielle",
    parallelWith: null,
    durationDays: order === 3 ? 5 : 2,
    otpRequired: false,
    allowExternalSignature: false,
    sendToDeposant: false,
  });

  const emptyDraft = () => ({
    id: `WF-${Date.now()}`,
    name: "Nouveau workflow",
    desc: "",
    entity: projets[0]?.nom || "Softwell Madagascar",
    site: "",
    docTypes: [],
    conditions: [],
    active: true,
    default: false,
    autoSendToDeposant: false,
    steps: [mkStep(1), mkStep(2), mkStep(3)],
  });

  const openNew = () => { setDraft(emptyDraft()); setEditing("new"); };
  const openEdit = (wf) => { setDraft(JSON.parse(JSON.stringify(wf))); setEditing(wf.id); };
  const save = () => {
    setWorkflows((p) => editing === "new" ? [draft, ...p] : p.map((w) => w.id === draft.id ? draft : w));
    setEditing(null);
    setDraft(null);
  };
  const cancel = () => { setEditing(null); setDraft(null); };

  /* ── Editor page ── */
  if (editing !== null && draft) {
    const set = (patch) => setDraft((p) => ({ ...p, ...patch }));
    const addStep = () => setDraft((p) => ({ ...p, steps: [...p.steps, mkStep(p.steps.length + 1)] }));
    const updateStep = (id, patch) => setDraft((p) => ({ ...p, steps: p.steps.map((s) => s.id === id ? { ...s, ...patch } : s) }));
    const deleteStep = (id) => setDraft((p) => ({ ...p, steps: p.steps.filter((s) => s.id !== id) }));
    const sortedSteps = [...draft.steps].sort((a, b) => a.order - b.order);
    const allSites = [...new Set(projets.flatMap((p) => p.sites || []))].filter(Boolean);
    const allEntities = [...new Set(projets.map((p) => p.nom || p.name).filter(Boolean))];

    const isNew = editing === "new";

    return (
      <div style={{ fontFamily: FONT }}>
        {/* Page header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 11.5, color: MUT, marginBottom: 4, cursor: "pointer" }} onClick={cancel}>
              ← Paramétrage — Workflows
            </div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>{isNew ? "Nouveau workflow" : `Modifier — ${draft.name}`}</h2>
            <p style={{ margin: "4px 0 0", color: MUT, fontSize: 12.5 }}>Créez et configurez les étapes et les règles d'un workflow.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Button onClick={cancel}>Annuler</Button>
            <Button tone="primary" onClick={save}>💾 Enregistrer</Button>
          </div>
        </div>

        {/* 3-col info section */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18, marginBottom: 20 }}>
          {/* Informations générales */}
          <Card style={{ padding: 18 }}>
            <div style={{ fontSize: 12.5, fontWeight: 800, marginBottom: 14, color: "#0f172a" }}>Informations générales</div>
            <div style={{ display: "grid", gap: 12 }}>
              <Field label="Entité" required>
                <select style={inputStyle} value={draft.entity} onChange={(e) => set({ entity: e.target.value })}>
                  {allEntities.length > 0
                    ? allEntities.map((e) => <option key={e} value={e}>{e}</option>)
                    : <option value="Softwell Madagascar">Softwell Madagascar</option>}
                </select>
              </Field>
              <Field label="Site" required>
                <select style={inputStyle} value={draft.site} onChange={(e) => set({ site: e.target.value })}>
                  <option value="">Tous les sites</option>
                  {allSites.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Nom du workflow" required>
                <input style={inputStyle} value={draft.name} placeholder="Ex : Workflow Contrat Fournisseur" onChange={(e) => set({ name: e.target.value })} />
              </Field>
              <Field label="Description">
                <TextArea value={draft.desc} placeholder="Description du workflow..." onChange={(e) => set({ desc: e.target.value })} style={{ minHeight: 72 }} />
              </Field>
            </div>
          </Card>

          {/* Types de document */}
          <Card style={{ padding: 18 }}>
            <div style={{ fontSize: 12.5, fontWeight: 800, marginBottom: 14, color: "#0f172a" }}>
              Types de document <span style={{ color: RED }}>*</span>
            </div>
            <div style={{ border: `1px solid ${BD}`, borderRadius: 8, padding: "8px 10px", minHeight: 90, background: WH }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
                {(draft.docTypes || []).map((tid) => {
                  const t = SS_DOC_TYPES.find((x) => x.id === tid);
                  return (
                    <span key={tid} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: `${ACC2}12`, color: ACC2, borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>
                      {t?.label || tid}
                      <button onClick={() => set({ docTypes: draft.docTypes.filter((x) => x !== tid) })} style={{ border: "none", background: "transparent", cursor: "pointer", color: ACC2, fontSize: 15, lineHeight: 1, padding: 0 }}>×</button>
                    </span>
                  );
                })}
              </div>
              <select style={{ ...inputStyle, border: "none", background: "transparent", paddingLeft: 0, fontSize: 12.5, color: MUT, height: 32 }} value=""
                onChange={(e) => { if (e.target.value && !(draft.docTypes || []).includes(e.target.value)) set({ docTypes: [...(draft.docTypes || []), e.target.value] }); }}>
                <option value="">+ Sélectionner un type de document...</option>
                {SS_DOC_TYPES.filter((t) => !(draft.docTypes || []).includes(t.id)).map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </div>
            <div style={{ fontSize: 11, color: MUT, marginTop: 8, lineHeight: 1.5 }}>
              Sélectionnez un ou plusieurs types de documents.<br />Un type peut avoir plusieurs workflows possibles.
            </div>
          </Card>

          {/* Conditions de sélection */}
          <Card style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: "#0f172a" }}>Conditions de sélection</div>
              <span style={{ fontSize: 10.5, color: MUT, background: "#f1f5f9", padding: "2px 7px", borderRadius: 10, fontWeight: 600 }}>optionnel</span>
              <span title="Les conditions permettent de sélectionner automatiquement ce workflow selon les caractéristiques du document." style={{ cursor: "help", color: MUT, fontSize: 14 }}>ⓘ</span>
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {(draft.conditions || []).map((c, i) => (
                <div key={i}>
                  {i > 0 && (
                    <div style={{ marginBottom: 6 }}>
                      <select style={{ ...inputStyle, width: 72, fontSize: 12, height: 28 }} value={c.join || "ET"}
                        onChange={(e) => setDraft((p) => ({ ...p, conditions: p.conditions.map((x, idx) => idx === i ? { ...x, join: e.target.value } : x) }))}>
                        <option>ET</option>
                        <option>OU</option>
                      </select>
                    </div>
                  )}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 72px 1fr 34px", gap: 6, alignItems: "center" }}>
                    <select style={{ ...inputStyle, fontSize: 12 }} value={c.field}
                      onChange={(e) => setDraft((p) => ({ ...p, conditions: p.conditions.map((x, idx) => idx === i ? { ...x, field: e.target.value } : x) }))}>
                      <option value="amount">Montant HT</option>
                      <option value="amountTtc">Montant TTC</option>
                      <option value="currency">Devise</option>
                      <option value="type">Type document</option>
                    </select>
                    <select style={{ ...inputStyle, fontSize: 12 }} value={c.op}
                      onChange={(e) => setDraft((p) => ({ ...p, conditions: p.conditions.map((x, idx) => idx === i ? { ...x, op: e.target.value } : x) }))}>
                      {[">", ">=", "<", "<=", "=", "!="].map((op) => <option key={op}>{op}</option>)}
                    </select>
                    <input style={{ ...inputStyle, fontSize: 12 }} value={c.value} placeholder="Valeur..."
                      onChange={(e) => setDraft((p) => ({ ...p, conditions: p.conditions.map((x, idx) => idx === i ? { ...x, value: e.target.value } : x) }))} />
                    <button onClick={() => setDraft((p) => ({ ...p, conditions: p.conditions.filter((_, idx) => idx !== i) }))}
                      style={{ width: 32, height: 38, border: `1px solid #fca5a5`, borderRadius: 7, background: "#fef2f2", color: RED, cursor: "pointer", fontSize: 15 }}>🗑</button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => setDraft((p) => ({ ...p, conditions: [...(p.conditions || []), { field: "amount", op: ">", value: "50000000", join: "ET" }] }))}
                style={{ padding: "7px 13px", borderRadius: 8, border: `1px dashed ${ACC2}`, background: `${ACC2}06`, color: ACC2, cursor: "pointer", fontSize: 12.5, fontWeight: 700, fontFamily: FONT, textAlign: "left" }}
              >
                + Ajouter une condition
              </button>
            </div>
          </Card>
        </div>

        {/* Steps section */}
        <Card style={{ padding: "18px 18px 16px", marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 900, marginBottom: 16 }}>Étapes du workflow</div>

          {/* Table header */}
          <div style={{ display: "grid", gridTemplateColumns: "36px 52px 1fr 1.5fr 200px 150px 180px 170px 170px 72px", gap: 10, padding: "7px 12px", background: "#f8f9fc", borderRadius: 8, marginBottom: 8, fontSize: 11, fontWeight: 800, color: MUT, textTransform: "uppercase", letterSpacing: ".04em" }}>
            {["", "Ordre", "Intitulé de l'étape", "Signataires", "Actions", "Type", "Étape parallèle", "Durée de traitement", "Signature externe", "Actions"].map((h) => (
              <div key={h}>{h}</div>
            ))}
          </div>

          <div style={{ display: "grid", gap: 7 }}>
            {sortedSteps.map((s) => (
              <WorkflowStepRow
                key={s.id}
                step={s}
                allSteps={sortedSteps}
                users={users}
                onUpdate={(patch) => updateStep(s.id, patch)}
                onDelete={() => deleteStep(s.id)}
              />
            ))}
          </div>

          <div style={{ marginTop: 12 }}>
            <button
              onClick={addStep}
              style={{ padding: "8px 16px", borderRadius: 8, border: `1px dashed ${ACC2}`, background: `${ACC2}06`, color: ACC2, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: FONT }}
            >
              + Ajouter une étape
            </button>
          </div>

          {/* Flow graph */}
          <WorkflowFlowGraph steps={draft.steps} />

          {/* Bottom legend + info */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 16, paddingTop: 16, borderTop: `1px solid ${BD}` }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 12.5, marginBottom: 10 }}>Légende des actions</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {Object.entries(WF_ACTION_CONF).map(([key, cfg]) => (
                  <div key={key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "#334155" }}>
                    <div style={{ width: 9, height: 9, borderRadius: "50%", background: cfg.dot }} />
                    {cfg.label}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ fontSize: 12, color: MUT, lineHeight: 1.65 }}>
              <div style={{ display: "flex", gap: 7, marginBottom: 5 }}>
                <span>🔄</span><span><b style={{ color: "#0f172a" }}>Séquentielle</b> : les étapes sont exécutées les unes après les autres.</span>
              </div>
              <div style={{ display: "flex", gap: 7 }}>
                <span>👥</span><span><b style={{ color: "#0f172a" }}>Parallèle</b> : plusieurs utilisateurs valident simultanément. Toutes doivent être terminées avant de passer à l'étape suivante.</span>
              </div>
            </div>
            <div style={{ padding: "11px 14px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 9, fontSize: 12, color: "#92400e", lineHeight: 1.6 }}>
              <div style={{ fontWeight: 800, marginBottom: 5 }}>ⓘ Informations</div>
              Les signataires seront sélectionnés lors de l'utilisation de ce workflow. Si une étape parallèle est rejetée, le workflow est bloqué immédiatement et le déposant est notifié.
            </div>
          </div>
        </Card>

        {/* Auto-send option */}
        <Card style={{ padding: 16, background: "#f5f3ff", border: `1px solid ${ACC2}33` }}>
          <label style={{ display: "flex", gap: 13, alignItems: "flex-start", cursor: "pointer" }}>
            <input type="checkbox" style={{ width: 17, height: 17, marginTop: 2, accentColor: ACC2, flexShrink: 0 }} checked={!!draft.autoSendToDeposant} onChange={(e) => set({ autoSendToDeposant: e.target.checked })} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 13, color: "#4c1d95" }}>Envoyer automatiquement le document signé au déposant (étape finale)</div>
              <div style={{ fontSize: 12, color: MUT, marginTop: 5, lineHeight: 1.55 }}>
                Après la validation finale du workflow, le système envoie automatiquement un email au déposant contenant :<br />
                <b>📄 Le document signé</b> · <b>🔏 Le certificat de signature électronique</b> · <b>🔗 Le lien de consultation</b>
              </div>
            </div>
          </label>
        </Card>
      </div>
    );
  }

  /* ── List view ── */
  const filteredWfs = workflows.filter(wf => {
    if (search && !wf.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType && !(wf.docTypes || []).includes(filterType)) return false;
    if (filterStatut === "actif" && !wf.active) return false;
    if (filterStatut === "inactif" && wf.active) return false;
    return true;
  });

  const totalWfs = filteredWfs.length;
  const totalPages = Math.max(1, Math.ceil(totalWfs / perPage));
  const pagedWfs = filteredWfs.slice((page - 1) * perPage, page * perPage);

  const activeTypes = filterType
    ? SS_DOC_TYPES.filter(t => t.id === filterType)
    : SS_DOC_TYPES.filter(t => pagedWfs.some(wf => (wf.docTypes || []).includes(t.id)));

  const toggleCollapse = (tid) => setCollapsed(p => ({ ...p, [tid]: !p[tid] }));
  const toggleActive = (id) => setWorkflows(p => p.map(w => w.id === id ? { ...w, active: !w.active } : w));
  const deleteWf = (wf) => { if (window.confirm(`Supprimer le workflow "${wf.name}" ?`)) setWorkflows(p => p.filter(w => w.id !== wf.id)); };

  const start = (page - 1) * perPage + 1;
  const end   = Math.min(page * perPage, totalWfs);

  return (
    <div style={{ fontFamily: FONT }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: 12, color: MUT, marginBottom: 14, display: "flex", alignItems: "center", gap: 5 }}>
        <span>Tableau de bord</span><span>›</span>
        <span>Workflow</span><span>›</span>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>Liste des workflows</span>
      </div>

      {/* Page header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#0f172a", letterSpacing: "-.3px" }}>Workflows</div>
          <div style={{ fontSize: 13, color: MUT, marginTop: 3 }}>Consultez et gérez les circuits de validation et de signature existants, regroupés par type de document.</div>
        </div>
        <Button tone="primary" onClick={openNew}>+ Nouveau workflow</Button>
      </div>

      {/* Filters */}
      <Card style={{ padding: "14px 18px", marginBottom: 18 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 12, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: MUT, fontSize: 15, pointerEvents: "none" }}>🔍</span>
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Rechercher un workflow..."
              style={{ ...inputStyle, paddingLeft: 36 }} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: MUT, marginBottom: 4 }}>Type de document</div>
            <select style={{ ...inputStyle, appearance: "auto", minWidth: 160 }} value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1); }}>
              <option value="">Tous</option>
              {SS_DOC_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: MUT, marginBottom: 4 }}>Statut</div>
            <select style={{ ...inputStyle, appearance: "auto", minWidth: 130 }} value={filterStatut} onChange={e => { setFilterStatut(e.target.value); setPage(1); }}>
              <option value="">Tous</option>
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
            </select>
          </div>
          <button onClick={() => { setSearch(""); setFilterType(""); setFilterStatut(""); setPage(1); }}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: `1px solid ${BD}`, background: WH, fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: FONT, color: "#374151", marginTop: 16 }}>
            ↺ Réinitialiser
          </button>
        </div>
      </Card>

      {/* Empty state */}
      {filteredWfs.length === 0 && (
        <Card style={{ padding: 52, textAlign: "center" }}>
          <div style={{ fontSize: 44, marginBottom: 14 }}>🔄</div>
          <div style={{ fontWeight: 800, color: MUT, fontSize: 15 }}>Aucun workflow trouvé</div>
          <div style={{ color: MUT, fontSize: 13, marginTop: 6 }}>Modifiez vos filtres ou créez un nouveau workflow.</div>
          <div style={{ marginTop: 16 }}><Button tone="primary" onClick={openNew}>+ Créer un workflow</Button></div>
        </Card>
      )}

      {/* Groups */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {activeTypes.map(docType => {
          const typeWfs = pagedWfs.filter(wf => (wf.docTypes || []).includes(docType.id));
          if (typeWfs.length === 0) return null;
          const isOpen = !collapsed[docType.id];
          const color  = WF_TYPE_COLORS[docType.id] || "#64748b";
          const bg     = WF_TYPE_BG[docType.id]     || "#f8fafc";

          return (
            <div key={docType.id} style={{ background: WH, border: `1px solid ${BD}`, borderRadius: 10, overflow: "hidden" }}>
              {/* Group header */}
              <div onClick={() => toggleCollapse(docType.id)}
                style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", background: WH, borderBottom: isOpen ? `1px solid ${BD}` : "none" }}
                onMouseEnter={e => e.currentTarget.style.background = "#fafbfd"}
                onMouseLeave={e => e.currentTarget.style.background = WH}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 18 }}>📄</span>
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>{docType.label}</div>
                <span style={{ fontSize: 11.5, fontWeight: 700, color, background: `${color}12`, border: `1px solid ${color}30`, borderRadius: 20, padding: "2px 10px" }}>
                  {typeWfs.length} workflow{typeWfs.length !== 1 ? "s" : ""}
                </span>
                <span style={{ marginLeft: "auto", color: MUT, fontSize: 18, lineHeight: 1 }}>{isOpen ? "∧" : "∨"}</span>
              </div>

              {/* Table */}
              {isOpen && (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc" }}>
                      {["WORKFLOW","CONDITIONS D'APPLICATION","DURÉE TOTALE ESTIMÉE","NOMBRE D'ÉTAPES","STATUT","ACTIONS"].map(h => (
                        <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10.5, fontWeight: 800, color: MUT, textTransform: "uppercase", letterSpacing: ".06em", borderBottom: `1px solid ${BD}`, whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {typeWfs.map((wf, idx) => {
                      const totalDays = (wf.steps || []).reduce((s, st) => s + (st.durationDays || 0), 0);
                      const nbSteps   = (wf.steps || []).length;
                      const conds     = wf.conditions || [];
                      return (
                        <tr key={wf.id} style={{ borderBottom: idx < typeWfs.length - 1 ? `1px solid ${BD}` : "none", background: idx % 2 === 0 ? WH : "#fafbfd" }}>
                          {/* Workflow */}
                          <td style={{ padding: "13px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                              <span style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>{wf.name}</span>
                              {wf.default && <span style={{ fontSize: 10.5, fontWeight: 800, color: ACC2, background: `${ACC2}12`, border: `1px solid ${ACC2}30`, borderRadius: 20, padding: "2px 8px" }}>Par défaut</span>}
                              {wf.autoSendToDeposant && <span style={{ fontSize: 10.5, fontWeight: 700, color: GREEN, background: "#dcfce7", border: "1px solid #bbf7d0", borderRadius: 20, padding: "2px 8px" }}>✉ Envoi auto</span>}
                            </div>
                          </td>
                          {/* Conditions */}
                          <td style={{ padding: "13px 16px" }}>
                            {conds.length === 0 ? (
                              <span style={{ fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>—</span>
                            ) : (
                              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                {conds.map((c, i) => (
                                  <span key={i} style={{ fontSize: 12, fontWeight: 600, background: `${ACC2}0e`, color: ACC2, border: `1px solid ${ACC2}25`, borderRadius: 6, padding: "3px 10px", display: "inline-block", whiteSpace: "nowrap" }}>
                                    {i > 0 && <span style={{ fontWeight: 800, marginRight: 4, color: "#7c3aed" }}>{c.join || "ET"}</span>}
                                    {formatWfCondition(c)}
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>
                          {/* Durée */}
                          <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#374151" }}>
                              <span style={{ fontSize: 15, color: MUT }}>⏱</span>
                              <span style={{ fontSize: 13, fontWeight: 600 }}>{totalDays} jour{totalDays !== 1 ? "s" : ""}</span>
                            </div>
                          </td>
                          {/* Nb étapes */}
                          <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ width: 26, height: 26, borderRadius: "50%", background: `${ACC2}14`, color: ACC2, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900 }}>{nbSteps}</span>
                              <span style={{ fontSize: 12.5, color: MUT }}>étapes</span>
                            </div>
                          </td>
                          {/* Statut */}
                          <td style={{ padding: "13px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ width: 8, height: 8, borderRadius: "50%", background: wf.active ? GREEN : "#94a3b8", display: "inline-block", flexShrink: 0 }} />
                              <span style={{ fontSize: 13, fontWeight: 600, color: wf.active ? "#0f172a" : MUT }}>{wf.active ? "Actif" : "Inactif"}</span>
                            </div>
                          </td>
                          {/* Actions */}
                          <td style={{ padding: "13px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <button onClick={() => setViewingWf(wf)} title="Visualiser"
                                style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${BD}`, background: WH, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: "#0891b2" }}>👁</button>
                              <button onClick={() => openEdit(wf)} title="Modifier"
                                style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${BD}`, background: WH, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: ACC2 }}>✏</button>
                              <WfToggle checked={wf.active} onChange={() => toggleActive(wf.id)} />
                              <button onClick={() => deleteWf(wf)} title="Supprimer"
                                style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #fecaca", background: "#fef2f2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: RED }}>🗑</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer: pagination */}
      {filteredWfs.length > 0 && (
        <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 4px", fontSize: 12.5, color: MUT }}>
          <span>Affichage {totalWfs > 0 ? start : 0} à {end} sur {totalWfs} workflow{totalWfs !== 1 ? "s" : ""}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <select value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}
                style={{ ...inputStyle, width: 64, height: 32, padding: "0 8px", fontSize: 12.5, appearance: "auto" }}>
                {[10,25,50].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <span>par page</span>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                style={{ width: 30, height: 30, borderRadius: 7, border: `1px solid ${BD}`, background: WH, cursor: page === 1 ? "default" : "pointer", opacity: page === 1 ? 0.4 : 1, fontSize: 14, fontFamily: FONT }}>‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  style={{ width: 30, height: 30, borderRadius: 7, border: `1px solid ${p === page ? ACC2 : BD}`, background: p === page ? ACC2 : WH, color: p === page ? WH : "#374151", cursor: "pointer", fontSize: 12.5, fontWeight: p === page ? 800 : 500, fontFamily: FONT }}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                style={{ width: 30, height: 30, borderRadius: 7, border: `1px solid ${BD}`, background: WH, cursor: page === totalPages ? "default" : "pointer", opacity: page === totalPages ? 0.4 : 1, fontSize: 14, fontFamily: FONT }}>›</button>
            </div>
          </div>
        </div>
      )}

      {/* View modal */}
      {viewingWf && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
          onClick={() => setViewingWf(null)}>
          <div style={{ background: WH, borderRadius: 12, width: "100%", maxWidth: 560, boxShadow: "0 20px 60px rgba(0,0,0,.25)", overflow: "hidden" }}
            onClick={e => e.stopPropagation()}>
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BD}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>{viewingWf.name}</div>
                <div style={{ fontSize: 12, color: MUT, marginTop: 2 }}>{viewingWf.desc}</div>
              </div>
              <button onClick={() => setViewingWf(null)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: MUT, lineHeight: 1 }}>✕</button>
            </div>
            <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Doc types */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: MUT, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 7 }}>Types de document</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {(viewingWf.docTypes || []).map(tid => {
                    const t = SS_DOC_TYPES.find(x => x.id === tid);
                    const c = WF_TYPE_COLORS[tid] || ACC2;
                    return <span key={tid} style={{ fontSize: 12, fontWeight: 700, color: c, background: `${c}12`, border: `1px solid ${c}30`, borderRadius: 20, padding: "3px 10px" }}>{t?.label || tid}</span>;
                  })}
                  {!(viewingWf.docTypes || []).length && <span style={{ color: MUT, fontSize: 12 }}>—</span>}
                </div>
              </div>
              {/* Conditions */}
              {(viewingWf.conditions || []).length > 0 && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: MUT, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 7 }}>Conditions d'application</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {viewingWf.conditions.map((c, i) => (
                      <span key={i} style={{ fontSize: 12.5, fontWeight: 600, color: ACC2, background: `${ACC2}0e`, border: `1px solid ${ACC2}25`, borderRadius: 7, padding: "5px 12px", display: "inline-block" }}>
                        {i > 0 && <b style={{ marginRight: 6 }}>{c.join || "ET"}</b>}{formatWfCondition(c)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {/* Steps */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: MUT, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 7 }}>
                  Étapes ({(viewingWf.steps || []).length}) — {(viewingWf.steps || []).reduce((s, st) => s + (st.durationDays || 0), 0)} jour(s) estimé(s)
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {[...(viewingWf.steps || [])].sort((a, b) => a.order - b.order).map((s, i) => {
                    const cfg = WF_ACTION_CONF[s.action] || WF_ACTION_CONF.validation;
                    return (
                      <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: `${cfg.dot}08`, border: `1px solid ${cfg.dot}20`, borderRadius: 8 }}>
                        <span style={{ width: 22, height: 22, borderRadius: "50%", background: `${cfg.dot}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: cfg.color, flexShrink: 0 }}>{i + 1}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{s.label}</div>
                          <div style={{ fontSize: 11, color: MUT }}>{cfg.color && <span style={{ color: cfg.color, fontWeight: 700 }}>{s.action}</span>} · {s.durationDays || 0}j</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div style={{ padding: "12px 20px", borderTop: `1px solid ${BD}`, display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <Button onClick={() => setViewingWf(null)}>Fermer</Button>
              <Button tone="primary" onClick={() => { openEdit(viewingWf); setViewingWf(null); }}>✏ Modifier</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SigAvatar({ name, userId }) {
  const COLORS = ["#6366f1","#7c3aed","#0891b2","#059669","#d97706","#dc2626","#0284c7","#7c3aed"];
  const idx = (userId || "").charCodeAt((userId||"").length - 1) % COLORS.length;
  const initials = (name || "?").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "50%", background: COLORS[idx], color: WH, fontWeight: 900, fontSize: 12.5, flexShrink: 0 }}>{initials}</span>
  );
}

function SigTypeBadge({ type }) {
  const isParaphe = type === "paraphe";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 10, fontSize: 12, fontWeight: 700, background: isParaphe ? "#fef3c7" : "#ede9fe", color: isParaphe ? "#d97706" : "#7c3aed" }}>
      <span style={{ fontSize: 13 }}>{isParaphe ? "✏" : "✍"}</span>
      {isParaphe ? "Paraphe" : "Signature"}
    </span>
  );
}

function SigModeBadge({ mode }) {
  const MAP = { dessin: { icon: "✏", label: "Dessin", color: "#475569" }, texte: { icon: "A", label: "Texte", color: "#475569" }, image: { icon: "🖼", label: "Image", color: "#475569" } };
  const m = MAP[mode] || MAP.texte;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", borderRadius: 8, fontSize: 12, fontWeight: 600, background: "#f1f5f9", color: m.color }}>
      <span style={{ fontSize: 11 }}>{m.icon}</span>{m.label}
    </span>
  );
}

function SignaturePreview({ sig, large, noLabel }) {
  if (!sig) return null;
  const h = large ? 110 : 38;
  const w = large ? "100%" : 150;
  const fs = large ? 34 : 20;
  if (sig.value?.startsWith("data:")) {
    return <img src={sig.value} alt="" style={{ width: w, height: h, objectFit: "contain", background: WH, border: `1px solid ${BD}`, borderRadius: 8 }} />;
  }
  return (
    <div style={{ width: w, height: h, border: `1px solid ${BD}`, background: "#fafafa", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Brush Script MT','Segoe Script','Dancing Script',cursive", fontSize: fs, color: "#1a1a2e", userSelect: "none", position: "relative" }}>
      {sig.value || sig.userName || "Aperçu"}
      {large && !noLabel && <span style={{ position: "absolute", bottom: 6, right: 10, fontSize: 10, color: "#94a3b8", fontFamily: FONT, fontStyle: "italic" }}>Rendu réel dans le document</span>}
    </div>
  );
}

function signatureOptionLabel(sig) {
  const type = sig?.type === "paraphe" ? "Paraphe" : "Signature";
  const mode = { dessin: "dessinee", texte: "texte", image: "image" }[sig?.mode] || sig?.mode || "";
  return `${type} ${mode}${sig?.default ? " par defaut" : ""}`;
}

function SigOptionToggle({ checked, onChange, label, desc }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${BD}` }}>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: "#0f172a" }}>{label}</div>
        <div style={{ fontSize: 12, color: MUT, marginTop: 2 }}>{desc}</div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        style={{ width: 46, height: 26, borderRadius: 13, border: "none", cursor: "pointer", background: checked ? ACC2 : "#cbd5e1", position: "relative", flexShrink: 0, transition: "background .2s" }}
      >
        <span style={{ position: "absolute", top: 3, left: checked ? 23 : 3, width: 20, height: 20, borderRadius: "50%", background: WH, transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
      </button>
    </div>
  );
}

function SignaturesAdmin({ signatures, setSignatures, users, authUser }) {
  const [show, setShow] = useState(false);
  const [draft, setDraft] = useState(null);
  const [selected, setSelected] = useState(() => signatures[0] || null);
  const [filterUser, setFilterUser] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  const emptyDraft = () => ({
    id: null,
    userId: authUser?.id || users[0]?.id || "",
    type: "signature",
    mode: "dessin",
    value: "",
    default: false,
    active: true,
    createdAt: new Date().toISOString(),
  });

  const open = (sig = null) => { setDraft(sig ? { ...sig } : emptyDraft()); setShow(true); };

  const save = () => {
    const u = users.find((x) => x.id === draft.userId);
    const sig = { ...draft, id: draft.id || `SIG-${Date.now()}`, userName: u?.nom || draft.userName || "", userRole: u?.role || draft.userRole || "", createdAt: draft.createdAt || new Date().toISOString() };
    setSignatures((p) => p.some((s) => s.id === sig.id) ? p.map((s) => s.id === sig.id ? sig : s) : [sig, ...p]);
    setSelected(sig);
    setShow(false);
  };

  const deleteSig = (id) => {
    setSignatures((p) => p.filter((s) => s.id !== id));
    if (selected?.id === id) setSelected(signatures.find((s) => s.id !== id) || null);
  };

  const filtered = signatures.filter((s) => {
    if (filterUser && s.userId !== filterUser) return false;
    if (filterType && s.type !== filterType) return false;
    if (filterStatus === "actif" && !s.active) return false;
    if (filterStatus === "inactif" && s.active) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div style={{ fontFamily: FONT }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: MUT }}>Paramétrage</span>
          <span style={{ color: MUT }}>›</span>
          <span style={{ fontSize: 11, color: MUT }}>Signature électronique</span>
        </div>
        <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 900, color: "#0f172a" }}>Paramétrage — Signature électronique</h2>
        <p style={{ margin: 0, color: MUT, fontSize: 12.5 }}>Configurez et gérez les signatures et paraphes de chaque utilisateur du portail SoftSign</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 18, alignItems: "start" }}>
        {/* Left: List */}
        <div>
          {/* Filters */}
          <Card style={{ padding: "14px 16px", marginBottom: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr auto", gap: 10, alignItems: "end" }}>
              <Field label="">
                <select style={{ ...inputStyle, display: "flex", alignItems: "center", gap: 8 }} value={filterUser} onChange={(e) => { setFilterUser(e.target.value); setPage(1); }}>
                  <option value="">Tous les utilisateurs</option>
                  {users.map((u) => <option key={u.id} value={u.id}>{u.nom} ({u.role})</option>)}
                </select>
              </Field>
              <Field label="">
                <select style={inputStyle} value={filterType} onChange={(e) => { setFilterType(e.target.value); setPage(1); }}>
                  <option value="">Tous les types</option>
                  <option value="signature">Signature</option>
                  <option value="paraphe">Paraphe</option>
                </select>
              </Field>
              <Field label="">
                <select style={inputStyle} value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}>
                  <option value="">Tous les statuts</option>
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                </select>
              </Field>
              <Button tone="primary" onClick={() => open()} style={{ whiteSpace: "nowrap" }}>+ Nouvelle configuration</Button>
            </div>
          </Card>

          {/* Table */}
          <Card style={{ overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: `1px solid ${BD}` }}>
                  {["Utilisateur", "Type", "Mode", "Aperçu", "Par défaut", "Création", "Statut", "Actions"].map((h) => (
                    <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 10.5, color: MUT, textTransform: "uppercase", letterSpacing: ".07em", fontWeight: 800, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 && <tr><td colSpan={8} style={{ padding: 24, textAlign: "center", color: MUT }}>Aucune configuration trouvée</td></tr>}
                {paged.map((s) => {
                  const u = users.find((x) => x.id === s.userId);
                  const isSel = selected?.id === s.id;
                  return (
                    <tr
                      key={s.id}
                      onClick={() => setSelected(s)}
                      style={{ borderTop: `1px solid ${BD}`, background: isSel ? "#f5f3ff" : WH, cursor: "pointer", transition: "background .1s" }}
                      onMouseEnter={(e) => { if (!isSel) e.currentTarget.style.background = "#fafafa"; }}
                      onMouseLeave={(e) => { if (!isSel) e.currentTarget.style.background = WH; }}
                    >
                      {/* Utilisateur */}
                      <td style={{ padding: "10px 12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                          {isSel && <span style={{ width: 6, height: 6, borderRadius: "50%", background: ACC2, flexShrink: 0 }} />}
                          <SigAvatar name={s.userName} userId={s.userId} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 13 }}>{s.userName || u?.nom}</div>
                            <div style={{ fontSize: 11, color: MUT }}>{s.userRole || u?.role}</div>
                          </div>
                        </div>
                      </td>
                      {/* Type */}
                      <td style={{ padding: "10px 12px" }}><SigTypeBadge type={s.type} /></td>
                      {/* Mode */}
                      <td style={{ padding: "10px 12px" }}><SigModeBadge mode={s.mode} /></td>
                      {/* Aperçu */}
                      <td style={{ padding: "10px 12px" }}><SignaturePreview sig={s} noLabel /></td>
                      {/* Par défaut */}
                      <td style={{ padding: "10px 12px", textAlign: "center" }}>
                        <span style={{ fontSize: 18, color: s.default ? "#f59e0b" : "#cbd5e1", cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); setSignatures((p) => p.map((x) => x.id === s.id ? { ...x, default: !x.default } : x)); }}>
                          {s.default ? "★" : "☆"}
                        </span>
                      </td>
                      {/* Création */}
                      <td style={{ padding: "10px 12px", fontSize: 12, color: MUT, whiteSpace: "nowrap" }}>
                        {s.createdAt ? new Date(s.createdAt).toLocaleDateString("fr-FR") : "-"}
                      </td>
                      {/* Statut */}
                      <td style={{ padding: "10px 12px" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 10, fontSize: 12, fontWeight: 700, background: s.active ? "#f0fdf4" : "#f8fafc", color: s.active ? GREEN : "#94a3b8", border: `1px solid ${s.active ? GREEN + "44" : "#e2e8f0"}` }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.active ? GREEN : "#94a3b8", display: "inline-block" }} />
                          {s.active ? "Actif" : "Inactif"}
                        </span>
                      </td>
                      {/* Actions */}
                      <td style={{ padding: "10px 12px" }}>
                        <div style={{ display: "flex", gap: 5 }}>
                          <button onClick={(e) => { e.stopPropagation(); open(s); }} title="Modifier" style={{ padding: "5px 8px", borderRadius: 6, border: `1px solid ${BD}`, background: WH, cursor: "pointer", color: ACC2, fontSize: 13 }}>✏</button>
                          <button onClick={(e) => { e.stopPropagation(); setSelected(s); }} title="Aperçu" style={{ padding: "5px 8px", borderRadius: 6, border: `1px solid ${BD}`, background: WH, cursor: "pointer", color: "#0891b2", fontSize: 13 }}>👁</button>
                          <button onClick={(e) => { e.stopPropagation(); deleteSig(s.id); }} title="Supprimer" style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid #fee2e2", background: "#fff5f5", cursor: "pointer", color: RED, fontSize: 13 }}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/* Pagination */}
            <div style={{ padding: "10px 16px", borderTop: `1px solid ${BD}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: MUT }}>{filtered.length} configuration{filtered.length !== 1 ? "s" : ""} · Page {page}/{totalPages}</span>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${BD}`, background: WH, cursor: page === 1 ? "default" : "pointer", opacity: page === 1 ? 0.4 : 1, fontSize: 13 }}>‹</button>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${BD}`, background: WH, cursor: page === totalPages ? "default" : "pointer", opacity: page === totalPages ? 0.4 : 1, fontSize: 13 }}>›</button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Preview panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, position: "sticky", top: 0 }}>
          <Card style={{ padding: 0, overflow: "hidden" }}>
            {/* Panel header */}
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${BD}`, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16, color: ACC2 }}>👁</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 13, color: "#0f172a" }}>Aperçu signature sélectionnée</div>
                {selected && <div style={{ fontSize: 11, color: MUT }}>{selected.userName} — {selected.type === "paraphe" ? "Paraphe" : "Signature"}</div>}
              </div>
            </div>

            {selected ? (
              <div style={{ padding: 16 }}>
                {/* Large preview */}
                <SignaturePreview sig={selected} large />

                {/* Metadata grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
                  {[
                    ["TYPE", <SigTypeBadge key="t" type={selected.type} />],
                    ["MODE", <SigModeBadge key="m" mode={selected.mode} />],
                    ["STATUT", <span key="s" style={{ color: selected.active ? GREEN : "#94a3b8", fontWeight: 800, fontSize: 12 }}>{selected.active ? "● Actif" : "● Inactif"}</span>],
                    ["PAR DÉFAUT", <span key="d" style={{ color: selected.default ? "#f59e0b" : MUT, fontWeight: 800, fontSize: 12 }}>{selected.default ? "★ Oui" : "☆ Non"}</span>],
                  ].map(([k, v]) => (
                    <div key={k} style={{ padding: "8px 10px", background: "#f8fafc", borderRadius: 7 }}>
                      <div style={{ fontSize: 9.5, color: MUT, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 }}>{k}</div>
                      <div>{v}</div>
                    </div>
                  ))}
                </div>

                {/* Date */}
                {selected.createdAt && (
                  <div style={{ padding: "8px 10px", background: "#f8fafc", borderRadius: 7, marginTop: 10 }}>
                    <div style={{ fontSize: 9.5, color: MUT, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 3 }}>DATE DE CRÉATION</div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>
                      📅 {new Date(selected.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} à {new Date(selected.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 14 }}>
                  <button onClick={() => open(selected)} style={{ padding: "8px", borderRadius: 7, border: `1px solid ${BD}`, background: WH, cursor: "pointer", fontSize: 12.5, fontWeight: 600, fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                    ✏ Modifier
                  </button>
                  <button
                    onClick={() => {
                      const w = window.open("", "_blank");
                      if (!w) return;
                      w.document.write(`<!DOCTYPE html><html><head><title>Aperçu signature</title><style>body{margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#f4f6f9;font-family:'Brush Script MT',cursive}</style></head><body><div style="background:white;padding:60px;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,.1);font-size:64px">${selected.value || selected.userName}</div></body></html>`);
                    }}
                    style={{ padding: "8px", borderRadius: 7, border: "none", background: ACC2, color: WH, cursor: "pointer", fontSize: 12.5, fontWeight: 700, fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}
                  >
                    ⤢ Agrandir
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ padding: 32, textAlign: "center", color: MUT, fontSize: 13 }}>Sélectionnez une configuration pour voir l'aperçu</div>
            )}
          </Card>

          {/* Contrôle de lisibilité */}
          {selected && (
            <Card style={{ padding: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
                <span style={{ fontSize: 16, color: GREEN }}>✅</span>
                <span style={{ fontWeight: 800, fontSize: 13, color: "#0f172a" }}>Contrôle de lisibilité</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { label: "Longueur du texte", ok: (selected.value || "").length >= 2, msg: (selected.value || "").length >= 2 ? "Suffisant" : "Trop court" },
                  { label: "Mode compatible PDF", ok: selected.mode !== "dessin", msg: selected.mode !== "dessin" ? "Compatible" : "Vérifier le rendu" },
                  { label: "Statut actif", ok: selected.active, msg: selected.active ? "Disponible" : "Inactif" },
                  { label: "Configuré par défaut", ok: selected.default, msg: selected.default ? "Oui" : "Non défini" },
                ].map(({ label, ok, msg }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
                    <span style={{ color: "#475569" }}>{label}</span>
                    <span style={{ fontWeight: 700, color: ok ? GREEN : ORANGE }}>{ok ? "✓" : "⚠"} {msg}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {show && draft && <SignatureEditorModal draft={draft} setDraft={setDraft} users={users} onClose={() => setShow(false)} onSave={save} />}
    </div>
  );
}

function SignatureEditorModal({ draft, setDraft, users, onClose, onSave }) {
  const handleImage = async (file) => {
    const value = await toBase64(file);
    setDraft((p) => ({ ...p, value }));
  };
  const u = users.find((x) => x.id === draft.userId);
  const previewSig = { ...draft, userName: u?.nom || draft.userName || "" };

  return (
    <Modal
      title={draft.id ? "Modifier la configuration" : "Nouvelle configuration de signature"}
      subtitle="Configurez les paramètres de la signature ou du paraphe"
      onClose={onClose}
      width={660}
      footer={
        <>
          <button onClick={onClose} style={{ padding: "10px 24px", borderRadius: 8, border: `1px solid ${BD}`, background: WH, cursor: "pointer", fontSize: 13.5, fontFamily: FONT, fontWeight: 600 }}>Annuler</button>
          <Button tone="primary" onClick={onSave} style={{ padding: "10px 24px", fontSize: 13.5 }}>💾 Enregistrer la configuration</Button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {/* Section: Utilisateur concerné */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 900, color: MUT, letterSpacing: ".1em", textTransform: "uppercase" }}>👤 Utilisateur concerné</span>
          </div>
          <hr style={{ border: "none", borderTop: `1px solid ${BD}`, margin: "0 0 14px" }} />
          <Field label="Sélectionner un utilisateur *">
            <select style={inputStyle} value={draft.userId} onChange={(e) => setDraft((p) => ({ ...p, userId: e.target.value }))}>
              {users.map((u) => <option key={u.id} value={u.id}>{u.nom} ({u.role})</option>)}
            </select>
          </Field>
        </div>

        {/* Section: Type de configuration */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 900, color: MUT, letterSpacing: ".1em", textTransform: "uppercase" }}>🏷 Type de configuration</span>
          </div>
          <hr style={{ border: "none", borderTop: `1px solid ${BD}`, margin: "0 0 14px" }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { id: "signature", label: "Signature", icon: "✍" },
              { id: "paraphe", label: "Paraphe", icon: "✏" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setDraft((p) => ({ ...p, type: t.id }))}
                style={{ padding: "18px 12px", borderRadius: 10, border: `2px solid ${draft.type === t.id ? ACC2 : BD}`, background: draft.type === t.id ? "#f5f3ff" : WH, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, transition: "all .15s", fontFamily: FONT }}
              >
                <span style={{ fontSize: 26 }}>{t.icon}</span>
                <span style={{ fontWeight: 800, fontSize: 14, color: draft.type === t.id ? ACC2 : "#374151" }}>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section: Mode de saisie */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 900, color: MUT, letterSpacing: ".1em", textTransform: "uppercase" }}>🎨 Mode de saisie</span>
          </div>
          <hr style={{ border: "none", borderTop: `1px solid ${BD}`, margin: "0 0 14px" }} />
          {/* Mode tabs */}
          <div style={{ display: "flex", background: "#f1f5f9", borderRadius: 10, padding: 4, marginBottom: 14 }}>
            {[{ id: "dessin", icon: "✏", label: "Dessin" }, { id: "texte", icon: "A", label: "Texte" }, { id: "image", icon: "🖼", label: "Image" }].map((m) => (
              <button
                key={m.id}
                onClick={() => setDraft((p) => ({ ...p, mode: m.id, value: m.id === "texte" ? (p.value || "") : "" }))}
                style={{ flex: 1, padding: "9px 4px", border: 0, borderRadius: 8, background: draft.mode === m.id ? WH : "transparent", color: draft.mode === m.id ? ACC2 : MUT, fontWeight: draft.mode === m.id ? 800 : 500, cursor: "pointer", fontSize: 13, fontFamily: FONT, boxShadow: draft.mode === m.id ? "0 1px 4px rgba(0,0,0,.1)" : "none", transition: "all .15s", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}
              >
                <span>{m.icon}</span> {m.label}
              </button>
            ))}
          </div>

          {/* Input area per mode */}
          {draft.mode === "texte" && (
            <input
              style={{ ...inputStyle, fontFamily: "'Brush Script MT',cursive", fontSize: 22, height: 52, textAlign: "center" }}
              placeholder="Votre signature en texte libre..."
              value={draft.value}
              onChange={(e) => setDraft((p) => ({ ...p, value: e.target.value }))}
            />
          )}
          {draft.mode === "image" && (
            <FileDrop
              fileName={draft.value?.startsWith("data:") ? "Image importée" : ""}
              onFile={handleImage}
              accept=".png,.jpg,.jpeg"
              label={<div style={{ textAlign: "center", color: MUT }}><div style={{ fontSize: 28, marginBottom: 6 }}>☁</div><div style={{ fontWeight: 600, fontSize: 13 }}>Glissez ou cliquez pour importer</div><div style={{ fontSize: 12, marginTop: 4 }}>PNG, JPG · Fond transparent recommandé · Max 2 Mo</div></div>}
            />
          )}
          {draft.mode === "dessin" && (
            <SignaturePad onChange={(value) => setDraft((p) => ({ ...p, value }))} />
          )}
        </div>

        {/* Section: Aperçu visuel */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 900, color: MUT, letterSpacing: ".1em", textTransform: "uppercase" }}>👁 Aperçu visuel — Rendu dans le document PDF</span>
          </div>
          <hr style={{ border: "none", borderTop: `1px solid ${BD}`, margin: "0 0 14px" }} />
          <div style={{ position: "relative" }}>
            <SignaturePreview sig={previewSig} large />
            <div style={{ textAlign: "right", marginTop: 6, fontSize: 11, color: MUT, fontStyle: "italic" }}>📄 Rendu simulé PDF</div>
          </div>
        </div>

        {/* Section: Options */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 900, color: MUT, letterSpacing: ".1em", textTransform: "uppercase" }}>⚙ Options</span>
          </div>
          <hr style={{ border: "none", borderTop: `1px solid ${BD}`, margin: "0 0 4px" }} />
          <SigOptionToggle
            checked={draft.default}
            onChange={(v) => setDraft((p) => ({ ...p, default: v }))}
            label="Signature par défaut"
            desc="Utilisée automatiquement lors des workflows de signature"
          />
          <SigOptionToggle
            checked={draft.active}
            onChange={(v) => setDraft((p) => ({ ...p, active: v }))}
            label="Statut actif"
            desc="La signature est disponible pour les circuits de validation"
          />
        </div>
      </div>
    </Modal>
  );
}

function DelAvatar({ name, color = ACC2 }) {
  const initials = (name || "?").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: "50%", background: color, color: WH, fontWeight: 900, fontSize: 12, flexShrink: 0 }}>{initials}</span>
  );
}

function isDelegActive(d) {
  if (!d.active) return false;
  const today = isoDate();
  return today >= d.startDate && today <= d.endDate;
}

function DelegationMultiSelect({ options, value = [], onChange, placeholder, disabled = false, emptyMessage = "Aucune option disponible", tone = "purple" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selectedOptions = value.map((id) => options.find((opt) => opt.id === id)).filter(Boolean);
  const chipStyle = tone === "green"
    ? { background: "#dcfce7", color: GREEN, border: "#bbf7d0" }
    : { background: `${ACC2}14`, color: ACC2, border: `${ACC2}2e` };

  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const toggle = (id) => {
    onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((p) => !p)}
        style={{
          ...inputStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          textAlign: "left",
          cursor: disabled ? "not-allowed" : "pointer",
          color: value.length ? "#334155" : "#94a3b8",
          background: disabled ? "#f8fafc" : WH,
        }}
      >
        <span>{value.length ? `${value.length} sélectionné(s)` : placeholder}</span>
        <span style={{ color: MUT, fontSize: 12 }}>∨</span>
      </button>
      {open && (
        <div style={{ position: "absolute", top: 42, left: 0, right: 0, zIndex: 250, background: WH, border: `1px solid ${BD}`, borderRadius: 8, boxShadow: "0 12px 30px rgba(15,23,42,.14)", maxHeight: 230, overflowY: "auto", padding: 6 }}>
          {options.length === 0 && <div style={{ padding: "10px 11px", color: MUT, fontSize: 12.5 }}>{emptyMessage}</div>}
          {options.map((opt) => {
            const checked = value.includes(opt.id);
            return (
              <label key={opt.id} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "8px 9px", borderRadius: 7, cursor: "pointer", background: checked ? `${ACC2}0d` : WH }}>
                <input type="checkbox" checked={checked} onChange={() => toggle(opt.id)} style={{ marginTop: 2, accentColor: ACC2, width: 14, height: 14 }} />
                <span>
                  <span style={{ display: "block", fontWeight: 750, fontSize: 12.5, color: "#334155" }}>{opt.label}</span>
                  {opt.meta && <span style={{ display: "block", fontSize: 11, color: MUT, marginTop: 2 }}>{opt.meta}</span>}
                </span>
              </label>
            );
          })}
        </div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, minHeight: 24, marginTop: 6 }}>
        {selectedOptions.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => toggle(opt.id)}
            style={{ display: "inline-flex", alignItems: "center", gap: 4, border: `1px solid ${chipStyle.border}`, borderRadius: 14, background: chipStyle.background, color: chipStyle.color, padding: "3px 9px", fontSize: 11.5, fontWeight: 800, cursor: "pointer", fontFamily: FONT }}
          >
            {opt.label}<span style={{ fontSize: 12, lineHeight: 1 }}>×</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function DelegationsAdmin({ delegations, setDelegations, users, projets, workflows = [], audit = [], setAudit, setNotifs, authUser }) {
  const today = isoDate();
  const allSites = [...new Set(projets.flatMap((p) => p.sites || []))].filter(Boolean);
  const ALL_DOC_TYPES = SS_DOC_TYPES;
  const docTypeOptions = ALL_DOC_TYPES.map((dt) => ({ id: dt.id, label: dt.label, meta: dt.desc }));
  const docTypeLabel = (id) => ALL_DOC_TYPES.find((dt) => dt.id === id)?.label || id;
  const workflowMatchesDocTypes = (workflow, docTypes = []) => {
    if (!workflow || workflow.active === false || !docTypes.length) return false;
    const wfDocTypes = workflow.docTypes || [];
    return !wfDocTypes.length || wfDocTypes.some((id) => docTypes.includes(id));
  };
  const compatibleWorkflowsFor = (docTypes = []) => workflows.filter((workflow) => workflowMatchesDocTypes(workflow, docTypes));
  const workflowLabel = (id, fallbackNames = []) => workflows.find((workflow) => workflow.id === id)?.name || fallbackNames.find(Boolean) || id;

  const emptyDraft = () => ({
    id: null,
    delegantId: users[0]?.id || "",
    delegataireId: users[1]?.id || users[0]?.id || "",
    startDate: today,
    endDate: today,
    actions: ["validation", "signature"],
    docTypes: [],
    workflowIds: [],
    site: "",
    projectId: "",
    active: true,
    comment: "",
    createdAt: new Date().toISOString(),
  });

  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);
  const [editId, setEditId] = useState(null);
  const [filters, setFilters] = useState({ statut: "", delegantId: "", delegataireId: "", from: "", to: "" });
  const availableWorkflows = compatibleWorkflowsFor(draft.docTypes || []);
  const workflowOptions = availableWorkflows.map((workflow) => ({
    id: workflow.id,
    label: workflow.name,
    meta: (workflow.docTypes || []).map(docTypeLabel).join(", ") || "Tous types",
  }));

  const openCreate = () => { setDraft(emptyDraft()); setEditId(null); setShowForm(true); };
  const openEdit = (d) => {
    const docTypes = Array.isArray(d.docTypes) ? d.docTypes : [];
    const rawWorkflowIds = Array.isArray(d.workflowIds) ? d.workflowIds : d.workflowId ? [d.workflowId] : [];
    const workflowIds = rawWorkflowIds.filter((id) => workflowMatchesDocTypes(workflows.find((workflow) => workflow.id === id), docTypes));
    setDraft({ ...emptyDraft(), ...d, docTypes, workflowIds });
    setEditId(d.id);
    setShowForm(true);
  };
  const cancelForm = () => { setShowForm(false); setEditId(null); };

  const setDocTypes = (docTypes) => setDraft((p) => ({
    ...p,
    docTypes,
    workflowIds: (p.workflowIds || []).filter((id) => workflowMatchesDocTypes(workflows.find((workflow) => workflow.id === id), docTypes)),
  }));
  const setWorkflowIds = (workflowIds) => setDraft((p) => ({ ...p, workflowIds }));
  const toggleAction = (a) => setDraft((p) => ({ ...p, actions: p.actions.includes(a) ? p.actions.filter((x) => x !== a) : [...p.actions, a] }));

  const save = () => {
    const delegant = users.find((u) => u.id === draft.delegantId);
    const delegataire = users.find((u) => u.id === draft.delegataireId);
    const workflowNames = (draft.workflowIds || []).map((id) => workflows.find((workflow) => workflow.id === id)?.name || id);
    const entry = { ...draft, workflowNames, delegantName: delegant?.nom || "", delegataireName: delegataire?.nom || "", delegantRole: delegant?.role || "", delegataireRole: delegataire?.role || "" };
    if (editId) {
      setDelegations((p) => p.map((d) => d.id === editId ? { ...entry, id: editId } : d));
    } else {
      const newDel = { ...entry, id: `DEL-${Date.now()}`, createdAt: new Date().toISOString() };
      setDelegations((p) => [newDel, ...p]);
      if (setAudit) setAudit((p) => [createAudit(authUser?.nom || "Système", "creation_delegation", `Délégation créée : ${delegant?.nom} → ${delegataire?.nom} (${draft.startDate} → ${draft.endDate})`), ...p].slice(0, 300));
      if (setNotifs) setNotifs((p) => [{ id: `N-${Date.now()}`, type: "delegation", lu: false, date: new Date().toISOString(), message: `Délégation créée : ${delegant?.nom} → ${delegataire?.nom}` }, ...p]);
    }
    setShowForm(false);
    setEditId(null);
  };

  const deleteDel = (id) => setDelegations((p) => p.filter((d) => d.id !== id));

  const resetFilters = () => setFilters({ statut: "", delegantId: "", delegataireId: "", from: "", to: "" });

  const filtered = delegations.filter((d) => {
    if (filters.statut === "actif" && !isDelegActive(d)) return false;
    if (filters.statut === "expire" && isDelegActive(d)) return false;
    if (filters.statut === "inactif" && d.active) return false;
    if (filters.delegantId && d.delegantId !== filters.delegantId) return false;
    if (filters.delegataireId && d.delegataireId !== filters.delegataireId) return false;
    if (filters.from && d.endDate < filters.from) return false;
    if (filters.to && d.startDate > filters.to) return false;
    return true;
  });

  const historyEntries = audit.filter((a) => ["creation_delegation", "delegation_appliquee", "signature_par_delegation", "email_delegation"].includes(a.action));

  const ACTION_COLORS = { validation: { color: "#2563eb", bg: "#dbeafe" }, signature: { color: "#7c3aed", bg: "#ede9fe" }, paraphe: { color: "#d97706", bg: "#fef3c7" }, revision: { color: "#0e7490", bg: "#cffafe" } };

  return (
    <div style={{ fontFamily: FONT, width: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#0f172a" }}>Délégation de signature</h2>
          <p style={{ margin: "4px 0 0", color: MUT, fontSize: 12.5 }}>La délégation permet à un utilisateur autorisé de transférer temporairement son pouvoir de validation/signature à une autre personne.</p>
        </div>
        <Button tone="primary" onClick={openCreate} style={{ flexShrink: 0 }}>+ Créer une délégation</Button>
      </div>

      {/* Creation / Edit Form */}
      {showForm && (
        <Card style={{ padding: 20, marginBottom: 20, border: `1.5px solid ${ACC2}22` }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 800, color: "#0f172a" }}>{editId ? "Modifier la délégation" : "Créer une délégation"}</h3>

          {/* Row 1: Délégant / Délégataire / Dates */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 160px 160px", gap: 14, marginBottom: 14 }}>
            <Field label="Délégant *">
              <select style={inputStyle} value={draft.delegantId} onChange={(e) => setDraft((p) => ({ ...p, delegantId: e.target.value }))}>
                {users.map((u) => <option key={u.id} value={u.id}>{u.nom}{u.role ? ` (${u.role})` : ""}</option>)}
              </select>
            </Field>
            <Field label="Délégataire *">
              <select style={inputStyle} value={draft.delegataireId} onChange={(e) => setDraft((p) => ({ ...p, delegataireId: e.target.value }))}>
                {users.filter((u) => u.id !== draft.delegantId).map((u) => <option key={u.id} value={u.id}>{u.nom}{u.role ? ` (${u.role})` : ""}</option>)}
              </select>
            </Field>
            <Field label="Date début *">
              <input type="date" style={inputStyle} value={draft.startDate} onChange={(e) => setDraft((p) => ({ ...p, startDate: e.target.value }))} />
            </Field>
            <Field label="Date fin *">
              <input type="date" style={inputStyle} value={draft.endDate} onChange={(e) => setDraft((p) => ({ ...p, endDate: e.target.value }))} />
            </Field>
          </div>

          <hr style={{ border: "none", borderTop: `1px solid ${BD}`, margin: "6px 0 14px" }} />

          {/* Row 2: DocTypes / Workflows / Actions */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 14, alignItems: "start" }}>
            <Field label="Type de document" required>
              <DelegationMultiSelect
                options={docTypeOptions}
                value={draft.docTypes || []}
                onChange={setDocTypes}
                placeholder="Sélectionner les types"
              />
            </Field>
            <Field label="Workflow" required>
              <DelegationMultiSelect
                options={workflowOptions}
                value={draft.workflowIds || []}
                onChange={setWorkflowIds}
                placeholder={draft.docTypes?.length ? "Sélectionner les workflows" : "Sélectionnez d'abord un type"}
                disabled={!draft.docTypes?.length}
                emptyMessage="Aucun workflow compatible avec les types sélectionnés"
                tone="green"
              />
            </Field>
            <Field label="Actions autorisées" required>
              <div style={{ minHeight: 92, border: `1px solid ${BD}`, borderRadius: 8, background: WH, padding: "8px 11px", display: "grid", gap: 6, alignContent: "start" }}>
                {["validation", "signature", "paraphe", "revision"].map((a) => (
                  <label key={a} style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer", fontSize: 12.5 }}>
                    <input type="checkbox" checked={draft.actions.includes(a)} onChange={() => toggleAction(a)} style={{ accentColor: ACC2, width: 14, height: 14 }} />
                    <span style={{ fontWeight: draft.actions.includes(a) ? 750 : 500, color: "#334155" }}>{getAction(a).label}</span>
                  </label>
                ))}
              </div>
            </Field>
          </div>

          {/* Row 3: Site / Projet */}
          <div style={{ display: "grid", gridTemplateColumns: "190px 240px 1fr", gap: 14, marginBottom: 14, alignItems: "start" }}>
            <Field label="Site" required>
              <select style={inputStyle} value={draft.site} onChange={(e) => setDraft((p) => ({ ...p, site: e.target.value }))}>
                <option value="">Siège Social</option>
                {allSites.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Projet (optionnel)">
              <select style={inputStyle} value={draft.projectId} onChange={(e) => setDraft((p) => ({ ...p, projectId: e.target.value }))}>
                <option value="">Tous les projets</option>
                {projets.map((p) => <option key={p.id} value={p.id}>{p.nom}</option>)}
              </select>
            </Field>
          </div>

          {/* Row 4: Commentaire */}
          <Field label="Commentaire (optionnel)">
            <textarea
              style={{ ...inputStyle, height: 72, resize: "vertical", fontFamily: FONT }}
              placeholder="Motif de la délégation..."
              value={draft.comment}
              onChange={(e) => setDraft((p) => ({ ...p, comment: e.target.value }))}
            />
          </Field>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
            <button onClick={cancelForm} style={{ padding: "8px 20px", borderRadius: 7, border: `1px solid ${BD}`, background: WH, cursor: "pointer", fontSize: 13, fontFamily: FONT }}>Annuler</button>
            <Button tone="primary" onClick={save} disabled={!draft.delegantId || !draft.delegataireId || !draft.startDate || !draft.endDate || draft.docTypes.length === 0 || draft.workflowIds.length === 0 || draft.actions.length === 0}>Enregistrer</Button>
          </div>
        </Card>
      )}

      {/* Existing Delegations */}
      <div style={{ marginBottom: 12 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: "0 0 12px" }}>Délégations existantes</h3>

        {/* Filter bar */}
        <Card style={{ padding: "12px 16px", marginBottom: 12, display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
          <Field label="Statut" style={{ minWidth: 120 }}>
            <select style={{ ...inputStyle, minWidth: 110 }} value={filters.statut} onChange={(e) => setFilters((p) => ({ ...p, statut: e.target.value }))}>
              <option value="">Tous</option>
              <option value="actif">Actif</option>
              <option value="expire">Expiré</option>
              <option value="inactif">Inactif</option>
            </select>
          </Field>
          <Field label="Délégant" style={{ minWidth: 150 }}>
            <select style={{ ...inputStyle, minWidth: 140 }} value={filters.delegantId} onChange={(e) => setFilters((p) => ({ ...p, delegantId: e.target.value }))}>
              <option value="">Tous</option>
              {users.map((u) => <option key={u.id} value={u.id}>{u.nom}</option>)}
            </select>
          </Field>
          <Field label="Délégataire" style={{ minWidth: 150 }}>
            <select style={{ ...inputStyle, minWidth: 140 }} value={filters.delegataireId} onChange={(e) => setFilters((p) => ({ ...p, delegataireId: e.target.value }))}>
              <option value="">Tous</option>
              {users.map((u) => <option key={u.id} value={u.id}>{u.nom}</option>)}
            </select>
          </Field>
          <Field label="Période — Du">
            <input type="date" style={{ ...inputStyle, minWidth: 130 }} value={filters.from} onChange={(e) => setFilters((p) => ({ ...p, from: e.target.value }))} />
          </Field>
          <div style={{ display: "flex", alignItems: "center", paddingBottom: 1, color: MUT, fontSize: 13 }}>→</div>
          <Field label="Au">
            <input type="date" style={{ ...inputStyle, minWidth: 130 }} value={filters.to} onChange={(e) => setFilters((p) => ({ ...p, to: e.target.value }))} />
          </Field>
          <button
            onClick={resetFilters}
            style={{ padding: "7px 14px", borderRadius: 7, border: `1px solid ${BD}`, background: WH, cursor: "pointer", fontSize: 12.5, fontFamily: FONT, color: MUT, display: "flex", alignItems: "center", gap: 5, marginBottom: 1 }}
          >
            ↺ Réinitialiser
          </button>
        </Card>

        {/* Table */}
        <Card style={{ overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Délégant", "Délégataire", "Période", "Actions autorisées", "Type document", "Workflow", "Statut", "Créé le", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 10.5, color: MUT, textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 800, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={9} style={{ padding: 24, textAlign: "center", color: MUT, fontSize: 13 }}>Aucune délégation trouvée</td></tr>
              )}
              {filtered.map((d) => {
                const isActive = isDelegActive(d);
                const isExpired = d.active && today > d.endDate;
                const statusLabel = isActive ? "Actif" : isExpired ? "Expiré" : "Inactif";
                const statusColor = isActive ? GREEN : isExpired ? ORANGE : "#94a3b8";
                const statusBg = isActive ? "#f0fdf4" : isExpired ? "#fffbeb" : "#f8fafc";
                const delegant = users.find((u) => u.id === d.delegantId);
                const delegataire = users.find((u) => u.id === d.delegataireId);
                return (
                  <tr key={d.id} style={{ borderTop: `1px solid ${BD}`, transition: "background .1s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#f8f9fc"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
                  >
                    {/* Délégant */}
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <DelAvatar name={d.delegantName} color="#6366f1" />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13 }}>{d.delegantName || delegant?.nom || d.delegantId}</div>
                          <div style={{ fontSize: 11, color: MUT }}>{d.delegantRole || delegant?.role || ""}</div>
                        </div>
                      </div>
                    </td>
                    {/* Délégataire */}
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <DelAvatar name={d.delegataireName} color={ACC2} />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13 }}>{d.delegataireName || delegataire?.nom || d.delegataireId}</div>
                          <div style={{ fontSize: 11, color: MUT }}>{d.delegataireRole || delegataire?.role || ""}</div>
                        </div>
                      </div>
                    </td>
                    {/* Période */}
                    <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5 }}>
                        <span style={{ fontWeight: 600 }}>{d.startDate?.slice(5).replace("-", "/")}</span>
                        <span style={{ color: MUT }}>→</span>
                        <span style={{ fontWeight: 600 }}>{d.endDate?.slice(5).replace("-", "/")}</span>
                      </div>
                    </td>
                    {/* Actions */}
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                        {(d.actions || []).map((a) => {
                          const ac = ACTION_COLORS[a] || { color: "#475569", bg: "#f1f5f9" };
                          return <span key={a} style={{ padding: "2px 9px", borderRadius: 10, fontSize: 11, fontWeight: 700, background: ac.bg, color: ac.color }}>{getAction(a).label}</span>;
                        })}
                      </div>
                    </td>
                    {/* Type document */}
                    <td style={{ padding: "10px 12px", fontSize: 12, color: "#475569", maxWidth: 160 }}>
                      {d.docTypes?.length ? d.docTypes.map(docTypeLabel).join(", ") : <span style={{ color: MUT, fontStyle: "italic" }}>Tous</span>}
                    </td>
                    {/* Workflow */}
                    <td style={{ padding: "10px 12px", maxWidth: 190 }}>
                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                        {d.workflowIds?.length
                          ? d.workflowIds.map((id, index) => <span key={id} style={{ padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 800, background: "#dcfce7", color: GREEN, border: "1px solid #bbf7d0" }}>{workflowLabel(id, [d.workflowNames?.[index]])}</span>)
                          : <span style={{ color: MUT, fontStyle: "italic", fontSize: 12 }}>Tous</span>}
                      </div>
                    </td>
                    {/* Statut */}
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: 10, fontSize: 11.5, fontWeight: 800, background: statusBg, color: statusColor, border: `1px solid ${statusColor}33` }}>{statusLabel}</span>
                    </td>
                    {/* Créé le */}
                    <td style={{ padding: "10px 12px", fontSize: 12, color: MUT, whiteSpace: "nowrap" }}>
                      <div>{d.createdAt ? new Date(d.createdAt).toLocaleDateString("fr-FR") : "-"}</div>
                      <div style={{ fontSize: 10.5 }}>{d.createdAt ? new Date(d.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : ""}</div>
                    </td>
                    {/* Actions */}
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => openEdit(d)} title="Modifier" style={{ padding: "5px 8px", borderRadius: 6, border: `1px solid ${BD}`, background: WH, cursor: "pointer", color: ACC2, fontSize: 13 }}>✏</button>
                        <button onClick={() => deleteDel(d.id)} title="Supprimer" style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid #fee2e2", background: "#fff5f5", cursor: "pointer", color: RED, fontSize: 13 }}>🗑</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Bottom: Info + Historique */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 8 }}>
        {/* Info box */}
        <div style={{ padding: 16, borderRadius: 10, background: "#f0f4ff", border: "1px solid #c7d2fe", display: "flex", gap: 12 }}>
          <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>ℹ</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 12.5, color: "#3730a3", marginBottom: 5 }}>Information</div>
            <div style={{ fontSize: 12, color: "#4338ca", lineHeight: 1.6 }}>
              Pendant la période de délégation, les tâches et demandes de validation/signature du délégant seront automatiquement affectées au délégataire.
              <br /><br />
              Le moteur de workflow vérifie à chaque étape :
              <ul style={{ margin: "6px 0 0", paddingLeft: 16, lineHeight: 1.7 }}>
                <li>Existence d'une délégation active pour l'utilisateur assigné</li>
                <li>Date actuelle comprise dans la période</li>
                <li>Action autorisée par la délégation</li>
                <li>Type de document et workflow compatibles avec la délégation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Historique d'utilisation */}
        <div style={{ padding: 16, borderRadius: 10, background: "#fffbeb", border: "1px solid #fde68a" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 16 }}>⏱</span>
            <span style={{ fontWeight: 800, fontSize: 12.5, color: "#92400e" }}>Historique d'utilisation</span>
          </div>
          {historyEntries.length === 0 && (
            <div style={{ fontSize: 12, color: "#b45309", fontStyle: "italic" }}>Aucune utilisation enregistrée</div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 200, overflowY: "auto" }}>
            {historyEntries.slice(0, 12).map((entry, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: i < historyEntries.length - 1 ? "1px dashed #fde68a" : "none" }}>
                <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>👁</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#78350f" }}>
                    {new Date(entry.date).toLocaleDateString("fr-FR")} {new Date(entry.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  <div style={{ fontSize: 12, color: "#92400e" }}>{entry.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function GeneralSettingsAdmin({ settings, setSettings, docs = [], projets = [] }) {
  const [draft, setDraft] = useState(() => normalizeSoftSignGeneralSettings(settings));
  const [activeTab, setActiveTab] = useState("reference");
  const [saved, setSaved] = useState(false);
  const [formatScope, setFormatScope] = useState({ projectId: "", site: "" });
  const [typeEditor, setTypeEditor] = useState(null);

  useEffect(() => {
    setDraft(normalizeSoftSignGeneralSettings(settings));
  }, [settings]);

  const update = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }));
  const referenceFormat = buildSoftSignReferenceFormat(draft);
  const nextSequence = Math.max(1, Number(draft.lastNumber || 0) + 1);
  const preview = formatSoftSignReference(referenceFormat, {
    site: draft.defaultSiteCode,
    type: "contrat",
    sequence: nextSequence,
    defaultSiteCode: draft.defaultSiteCode,
  });
  const scopedProjectId = formatScope.projectId || "";
  const scopedSite = formatScope.site || "";
  const activeFormatIds = new Set(getSoftSignAllowedFormatIds(draft, scopedProjectId, scopedSite));
  const allSites = useMemo(() => {
    if (formatScope.projectId) return getSitesForProject(projets, formatScope.projectId);
    return [...new Set((projets || []).flatMap((project) => project.sites || []))];
  }, [formatScope.projectId, projets]);

  function save() {
    const next = normalizeSoftSignGeneralSettings({
      ...draft,
      externalRefFormat: buildSoftSignReferenceFormat(draft),
      sequenceStart: Math.max(1, Number(draft.lastNumber || 0) + 1),
    });
    setSettings(next);
    setDraft(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  function cancel() {
    setDraft(normalizeSoftSignGeneralSettings(settings));
    setTypeEditor(null);
  }

  function toggleFormat(formatId) {
    const nextFormats = activeFormatIds.has(formatId)
      ? [...activeFormatIds].filter((id) => id !== formatId)
      : [...activeFormatIds, formatId];

    if (!scopedProjectId && !scopedSite) {
      update("allowedFormats", nextFormats);
      return;
    }

    setDraft((prev) => {
      const rules = Array.isArray(prev.formatRules) ? prev.formatRules : [];
      const idx = rules.findIndex((rule) => (rule.projectId || "") === scopedProjectId && (rule.site || "") === scopedSite);
      const scopedRule = { projectId: scopedProjectId, site: scopedSite, formats: nextFormats };
      return {
        ...prev,
        formatRules: idx >= 0
          ? rules.map((rule, i) => i === idx ? scopedRule : rule)
          : [...rules, scopedRule],
      };
    });
  }

  function openTypeEditor(type) {
    setTypeEditor(type ? { ...type } : { id: "", code: "", label: "", active: true });
  }

  function saveType() {
    const code = String(typeEditor?.code || "").trim().toUpperCase();
    const label = String(typeEditor?.label || "").trim();
    if (!code || !label) return;
    const id = typeEditor.id || label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") || `type_${Date.now()}`;
    setDraft((prev) => {
      const nextType = { id, code, label, active: typeEditor.active !== false };
      const exists = (prev.documentTypes || []).some((type) => type.id === id);
      return {
        ...prev,
        documentTypes: exists
          ? prev.documentTypes.map((type) => type.id === id ? nextType : type)
          : [...(prev.documentTypes || []), nextType],
      };
    });
    setTypeEditor(null);
  }

  function toggleTypeStatus(typeId) {
    setDraft((prev) => ({
      ...prev,
      documentTypes: (prev.documentTypes || []).map((type) => type.id === typeId ? { ...type, active: !type.active } : type),
    }));
  }

  const separatorOptions = [
    { value: "-", label: "- (tiret)" },
    { value: "/", label: "/ (slash)" },
    { value: "_", label: "_ (underscore)" },
  ];
  const tabs = [
    { id: "reference", label: "Reference document", icon: Settings2 },
    { id: "formats", label: "Formats autorises", icon: FileTextIcon },
    { id: "types", label: "Types de documents", icon: Grid2X2 },
  ];
  const formatIcon = {
    pdf: FileTextIcon,
    docx: FileTextIcon,
    xlsx: FileSpreadsheet,
    pptx: FileTextIcon,
    jpg_png: FileImage,
    zip: FileArchive,
    csv: FileSpreadsheet,
    txt: FileTextIcon,
    odt: FileTextIcon,
    tiff: FileImage,
  };
  const rowStyle = {
    display: "grid",
    gridTemplateColumns: "160px minmax(220px, 1fr)",
    gap: 16,
    alignItems: "center",
  };

  return (
    <div style={{ fontFamily: FONT, width: "100%", minHeight: "calc(100vh - 116px)", display: "flex", flexDirection: "column" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 5 }}>
          <Settings2 size={20} color={ACC2} />
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 950, color: "#1f1457" }}>Paramètres généraux</h2>
        </div>
        <p style={{ margin: 0, color: "#7c7f8e", fontSize: 13 }}>
          Configuration des références, formats autorisés et types de documents.
        </p>
      </div>

      <div style={{ display: "flex", gap: 22, borderBottom: "1px solid #ded7ef", marginBottom: 20, overflowX: "auto" }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                height: 44,
                padding: "0 20px",
                border: "none",
                borderBottom: `2px solid ${active ? ACC2 : "transparent"}`,
                background: "transparent",
                color: active ? ACC2 : "#7c7f8e",
                fontFamily: FONT,
                fontSize: 13,
                fontWeight: 850,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              <Icon size={15} strokeWidth={2.2} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {saved && (
        <div style={{ padding: "10px 14px", marginBottom: 14, borderRadius: 8, background: "#ecfdf5", color: "#047857", border: "1px solid #bbf7d0", fontSize: 12.5, fontWeight: 850 }}>
          Paramètres généraux enregistrés.
        </div>
      )}

      <div style={{ flex: 1 }}>
        {activeTab === "reference" && (
          <Card style={{ padding: "24px 26px", borderRadius: 12, boxShadow: "none" }}>
            <div style={{ display: "grid", gap: 16, maxWidth: 690 }}>
              <div style={rowStyle}>
                <span style={{ color: "#666977", fontSize: 13, fontWeight: 650 }}>Préfixe</span>
                <input
                  value={draft.referencePrefix}
                  onChange={(e) => update("referencePrefix", e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8))}
                  style={{ ...inputStyle, maxWidth: 270, color: "#31205f", fontWeight: 750 }}
                />
              </div>
              <div style={rowStyle}>
                <span style={{ color: "#666977", fontSize: 13, fontWeight: 650 }}>Séparateur</span>
                <select
                  value={draft.referenceSeparator}
                  onChange={(e) => update("referenceSeparator", e.target.value)}
                  style={{ ...inputStyle, maxWidth: 270 }}
                >
                  {separatorOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </div>
              <div style={rowStyle}>
                <span style={{ color: "#666977", fontSize: 13, fontWeight: 650 }}>Options</span>
                <div style={{ display: "grid", gap: 8 }}>
                  <label style={{ display: "inline-flex", alignItems: "center", gap: 9, color: "#31205f", fontSize: 13, fontWeight: 700 }}>
                    <input type="checkbox" checked={draft.referenceIncludeYear !== false} onChange={(e) => update("referenceIncludeYear", e.target.checked)} style={{ width: 15, height: 15, accentColor: ACC2 }} />
                    Inclure l'année
                  </label>
                  <label style={{ display: "inline-flex", alignItems: "center", gap: 9, color: "#31205f", fontSize: 13, fontWeight: 700 }}>
                    <input type="checkbox" checked={!!draft.referenceIncludeSite} onChange={(e) => update("referenceIncludeSite", e.target.checked)} style={{ width: 15, height: 15, accentColor: ACC2 }} />
                    Inclure le site
                  </label>
                </div>
              </div>
              <div style={rowStyle}>
                <span style={{ color: "#666977", fontSize: 13, fontWeight: 650 }}>Dernier numéro</span>
                <input
                  type="number"
                  min="0"
                  value={draft.lastNumber}
                  onChange={(e) => update("lastNumber", e.target.value)}
                  style={{ ...inputStyle, maxWidth: 94, color: "#31205f", fontWeight: 750 }}
                />
              </div>
              <div style={rowStyle}>
                <span style={{ color: "#666977", fontSize: 13, fontWeight: 650 }}>Aperçu</span>
                <div>
                  <div style={{ color: "#b2aebd", fontSize: 11.5, fontWeight: 750, marginBottom: 14 }}>La référence générée sera :</div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, minHeight: 28, padding: "5px 14px", borderRadius: 18, background: "#eee7ff", color: "#5f4ec5", fontSize: 12.5, fontWeight: 900 }}>
                    <Eye size={13} />
                    {preview}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {activeTab === "formats" && (
          <Card style={{ padding: "22px 20px", borderRadius: 12, boxShadow: "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 16 }}>
              <div style={{ color: "#9aa0ad", fontSize: 12.5, fontWeight: 700 }}>
                Cochez les formats acceptés pour les dépôts de documents sur ce projet.
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <select
                  value={formatScope.projectId}
                  onChange={(e) => setFormatScope({ projectId: e.target.value, site: "" })}
                  style={{ ...inputStyle, width: 230, height: 34, fontSize: 12.5 }}
                >
                  <option value="">Tous les projets</option>
                  {(projets || []).map((project) => <option key={project.id} value={project.id}>{project.nom}</option>)}
                </select>
                <select
                  value={formatScope.site}
                  onChange={(e) => setFormatScope((prev) => ({ ...prev, site: e.target.value }))}
                  style={{ ...inputStyle, width: 180, height: 34, fontSize: 12.5 }}
                >
                  <option value="">Tous les sites</option>
                  {allSites.map((site) => <option key={site} value={site}>{site}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {SS_ALLOWED_FORMATS.map((formatItem) => {
                const checked = activeFormatIds.has(formatItem.id);
                const Icon = formatIcon[formatItem.id] || FileTextIcon;
                return (
                  <button
                    type="button"
                    key={formatItem.id}
                    onClick={() => toggleFormat(formatItem.id)}
                    style={{
                      minHeight: 34,
                      padding: "0 12px",
                      borderRadius: 8,
                      border: `1.5px solid ${checked ? ACC2 : "#dfe2e8"}`,
                      background: checked ? "#f4efff" : WH,
                      color: checked ? "#5f37db" : "#4f5563",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      fontFamily: FONT,
                      fontSize: 12.5,
                      fontWeight: 820,
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ width: 14, height: 14, borderRadius: 3, border: `1.5px solid ${checked ? ACC2 : "#9ca3af"}`, background: checked ? ACC2 : WH, color: WH, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {checked && <Check size={11} strokeWidth={3} />}
                    </span>
                    <Icon size={14} strokeWidth={2} />
                    {formatItem.label}
                  </button>
                );
              })}
            </div>
          </Card>
        )}

        {activeTab === "types" && (
          <Card style={{ padding: "20px 22px", borderRadius: 12, boxShadow: "none" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#fbfaff" }}>
                    {["Code", "Libellé", "Statut", "Actions"].map((header) => (
                      <th key={header} style={{ padding: "10px 12px", textAlign: header === "Actions" ? "right" : "left", color: "#8a8d99", fontSize: 11.5, fontWeight: 900 }}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(draft.documentTypes || []).map((type) => (
                    <tr key={type.id} style={{ borderTop: "1px solid #eef0f4" }}>
                      <td style={{ padding: "12px" }}>
                        <span style={{ display: "inline-flex", minWidth: 32, justifyContent: "center", padding: "3px 7px", borderRadius: 4, background: "#f0ecff", color: "#6552d0", fontSize: 10.5, fontWeight: 900 }}>
                          {type.code}
                        </span>
                      </td>
                      <td style={{ padding: "12px", color: "#241a59", fontWeight: 700 }}>{type.label}</td>
                      <td style={{ padding: "12px" }}>
                        <button
                          type="button"
                          onClick={() => toggleTypeStatus(type.id)}
                          style={{
                            border: "none",
                            borderRadius: 18,
                            padding: "4px 11px",
                            background: type.active === false ? "#f1f0ed" : "#eaf6dc",
                            color: type.active === false ? "#817c72" : "#4a8b16",
                            fontFamily: FONT,
                            fontSize: 11.5,
                            fontWeight: 900,
                            cursor: "pointer",
                          }}
                        >
                          {type.active === false ? "Inactif" : "Actif"}
                        </button>
                      </td>
                      <td style={{ padding: "12px", textAlign: "right" }}>
                        <button type="button" onClick={() => openTypeEditor(type)} title="Modifier" style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #dfe2e8", background: WH, color: "#4f5563", cursor: "pointer", marginRight: 8 }}>
                          <Edit3 size={14} />
                        </button>
                        <button type="button" title="Plus d'actions" style={{ width: 28, height: 28, border: "none", background: "transparent", color: "#8a8d99", cursor: "pointer" }}>
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              type="button"
              onClick={() => openTypeEditor(null)}
              style={{ marginTop: 16, border: "none", background: "transparent", color: ACC2, display: "inline-flex", alignItems: "center", gap: 8, fontFamily: FONT, fontSize: 13, fontWeight: 800, cursor: "pointer" }}
            >
              <Plus size={15} />
              Ajouter un type de document
            </button>
          </Card>
        )}
      </div>

      <div style={{ position: "sticky", bottom: -20, margin: "24px -20px -20px", padding: "12px 20px", background: WH, borderTop: `1px solid ${BD}`, display: "flex", justifyContent: "flex-end", gap: 10 }}>
        <Button tone="light" onClick={cancel}>Annuler</Button>
        <Button tone="primary" onClick={save}><Save size={14} /> Enregistrer</Button>
      </div>

      {typeEditor && (
        <Modal
          title={typeEditor.id ? "Modifier le type de document" : "Ajouter un type de document"}
          onClose={() => setTypeEditor(null)}
          width={520}
          footer={(
            <>
              <Button tone="light" onClick={() => setTypeEditor(null)}><X size={14} /> Annuler</Button>
              <Button tone="primary" onClick={saveType}><Save size={14} /> Enregistrer</Button>
            </>
          )}
        >
          <div style={{ display: "grid", gap: 14 }}>
            <Field label="Code" required>
              <input
                style={inputStyle}
                value={typeEditor.code}
                onChange={(e) => setTypeEditor((prev) => ({ ...prev, code: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6) }))}
                placeholder="CTR"
              />
            </Field>
            <Field label="Libellé" required>
              <input
                style={inputStyle}
                value={typeEditor.label}
                onChange={(e) => setTypeEditor((prev) => ({ ...prev, label: e.target.value }))}
                placeholder="Contrat"
              />
            </Field>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 9, color: "#31205f", fontSize: 13, fontWeight: 800 }}>
              <input type="checkbox" checked={typeEditor.active !== false} onChange={(e) => setTypeEditor((prev) => ({ ...prev, active: e.target.checked }))} style={{ width: 15, height: 15, accentColor: ACC2 }} />
              Type actif
            </label>
          </div>
        </Modal>
      )}
    </div>
  );
}

function LegacyGeneralSettingsAdmin({ settings, setSettings, docs = [] }) {
  const [draft, setDraft] = useState(() => ({ ...SS_DEFAULT_GENERAL_SETTINGS, ...(settings || {}) }));
  const [saved, setSaved] = useState(false);
  const update = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }));
  const preview = formatSoftSignReference(draft.externalRefFormat, {
    site: draft.defaultSiteCode,
    type: "contrat",
    sequence: Math.max(1, Number(draft.sequenceStart || 1)),
    defaultSiteCode: draft.defaultSiteCode,
  });
  const hasSequence = /\{SEQ(3|4|5)?\}/.test(draft.externalRefFormat || "");

  function save() {
    const next = {
      ...SS_DEFAULT_GENERAL_SETTINGS,
      ...draft,
      sequenceStart: Math.max(1, Number(draft.sequenceStart || 1)),
    };
    setSettings(next);
    setDraft(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  function resetDefault() {
    setDraft({ ...SS_DEFAULT_GENERAL_SETTINGS });
  }

  return (
    <div style={{ fontFamily: FONT, width: "100%" }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:16, marginBottom:20 }}>
        <div>
          <h2 style={{ margin:0, fontSize:22, fontWeight:950, color:"#0f172a" }}>Paramètres généraux</h2>
          <p style={{ margin:"4px 0 0", color:MUT, fontSize:12.5 }}>
            Configurez la référence de suivi générée automatiquement pour les dépôts externes SoftSign.
          </p>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <Button tone="light" onClick={resetDefault}>Réinitialiser</Button>
          <Button tone="primary" onClick={save}>Enregistrer</Button>
        </div>
      </div>

      {saved && (
        <div style={{ padding:"10px 14px", marginBottom:16, borderRadius:9, background:"#ecfdf5", color:"#047857", border:"1px solid #bbf7d0", fontSize:12.5, fontWeight:800 }}>
          Paramètres généraux enregistrés.
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"1.2fr .8fr", gap:18, alignItems:"start" }}>
        <Card style={{ padding:20 }}>
          <div style={{ fontSize:14, fontWeight:900, color:"#0f172a", marginBottom:14 }}>Format des références externes</div>
          <div style={{ display:"grid", gap:14 }}>
            <Field label="Format de référence" required>
              <input
                value={draft.externalRefFormat}
                onChange={(e) => update("externalRefFormat", e.target.value)}
                style={{ ...inputStyle, fontWeight:700 }}
                placeholder="SSIGN-{YYYY}-{SITE}-{SEQ4}"
              />
            </Field>
            <Field label="Code site par défaut">
              <input
                value={draft.defaultSiteCode}
                onChange={(e) => update("defaultSiteCode", e.target.value.toUpperCase())}
                style={inputStyle}
                placeholder="TNR"
              />
            </Field>
            <Field label="Premier numéro de séquence">
              <input
                type="number"
                min="1"
                value={draft.sequenceStart}
                onChange={(e) => update("sequenceStart", e.target.value)}
                style={inputStyle}
              />
            </Field>
          </div>

          {!hasSequence && (
            <div style={{ marginTop:14, padding:"10px 12px", borderRadius:8, background:"#fffbeb", border:"1px solid #fde68a", color:"#92400e", fontSize:12.5, fontWeight:750 }}>
              Ajoutez un jeton de séquence comme {"{SEQ4}"} pour garantir l’unicité des références.
            </div>
          )}
        </Card>

        <Card style={{ padding:20 }}>
          <div style={{ fontSize:14, fontWeight:900, color:"#0f172a", marginBottom:14 }}>Aperçu</div>
          <div style={{ padding:"16px 18px", borderRadius:10, background:"#f5f3ff", border:"1px solid #ddd6fe", color:ACC2, fontSize:18, fontWeight:950, wordBreak:"break-word", marginBottom:14 }}>
            {preview}
          </div>
          <div style={{ fontSize:12.5, color:MUT, lineHeight:1.7 }}>
            Jetons disponibles : <b>{"{YYYY}"}</b>, <b>{"{YY}"}</b>, <b>{"{MM}"}</b>, <b>{"{DD}"}</b>, <b>{"{SITE}"}</b>, <b>{"{TYPE}"}</b>, <b>{"{SEQ}"}</b>, <b>{"{SEQ3}"}</b>, <b>{"{SEQ4}"}</b>, <b>{"{SEQ5}"}</b>.
          </div>
          <div style={{ marginTop:14, padding:"10px 12px", borderRadius:8, background:"#f8fafc", border:`1px solid ${BD}`, color:"#475569", fontSize:12.5 }}>
            Documents SoftSign existants pris en compte pour la prochaine séquence : <b>{docs.length}</b>.
          </div>
        </Card>
      </div>
    </div>
  );
}

function ExternalAccountsAdmin({ accounts, setAccounts, onRefresh, setNotifs }) {
  const [sel, setSel] = useState(accounts[0] || null);
  const update = (id, status, modules = ["softdocs", "softsign"]) => {
    const next = accounts.map((a) => {
      if (a.id !== id) return a;
      const moduleAccess = { ...(a.moduleAccess || {}) };
      modules.forEach((module) => { moduleAccess[module] = status; });
      return {
        ...a,
        status: modules.includes("softsign") ? status : a.status,
        moduleAccess,
        softDocsAccess: moduleAccess.softdocs,
        softSignAccess: moduleAccess.softsign,
      };
    });
    setAccounts(next);
    writeRaw(EXT_KEY, next);
    writeRaw(LEGACY_EXT_KEY, next);
    setSel((current) => current?.id === id ? next.find((a) => a.id === id) : current);
    setNotifs((p) => [{ id: `N-${Date.now()}`, type: "fournisseur", message: `Compte fournisseur ${id}: ${modules.join(" + ")} ${status}`, lu: false, date: new Date().toISOString() }, ...p]);
  };
  const counts = { pending: accounts.filter((a) => a.status === "en_attente").length, active: accounts.filter((a) => a.status === "actif").length, rejected: accounts.filter((a) => a.status === "rejete").length, complement: accounts.filter((a) => a.status === "complement").length };
  const bank = sel?.bankDetails || sel || {};
  return (
    <div style={{ fontFamily: FONT }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><div><h2 style={{ margin: 0 }}>Validation des comptes fournisseurs</h2><p style={{ color: MUT, margin: "4px 0 0" }}>Controlez les comptes crees depuis le portail externe SoftSign.</p></div><Button onClick={onRefresh}>Actualiser portail</Button></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 16 }}>{[["En attente", counts.pending, ACC2], ["Valides", counts.active, GREEN], ["Rejetes", counts.rejected, RED], ["Complements", counts.complement, ORANGE]].map(([l, v, c]) => <Card key={l} style={{ padding: 18 }}><div style={{ fontSize: 26, fontWeight: 950, color: c }}>{v}</div><div style={{ color: MUT, fontSize: 12 }}>{l}</div></Card>)}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr .8fr", gap: 18 }}>
        <Card style={{ overflow: "hidden" }}><table style={{ width: "100%", borderCollapse: "collapse" }}><thead><tr style={{ background: "#f8fafc" }}>{["Fournisseur", "Projet", "Contact", "Date inscription", "Statut", "Actions"].map((h) => <th key={h} style={{ padding: 10, textAlign: "left", fontSize: 11, color: MUT, textTransform: "uppercase" }}>{h}</th>)}</tr></thead><tbody>{accounts.map((a) => <tr key={a.id} style={{ borderTop: `1px solid ${BD}`, background: sel?.id === a.id ? "#f5f3ff" : WH }}><td style={{ padding: 12 }}><b>{a.raisonSociale}</b><div style={{ color: MUT, fontSize: 11 }}>{a.email}</div></td><td style={{ padding: 12 }}>{a.projectId}</td><td style={{ padding: 12 }}>{a.contactName}<div style={{ color: MUT, fontSize: 11 }}>{a.phone}</div></td><td style={{ padding: 12 }}>{new Date(a.createdAt).toLocaleDateString("fr-FR")}</td><td style={{ padding: 12 }}><StatusBadge status={a.status === "actif" ? "termine" : a.status === "rejete" ? "rejete" : "en_attente_traitement"} /></td><td style={{ padding: 12 }}><Button onClick={() => setSel(a)}>Voir</Button></td></tr>)}</tbody></table></Card>
        <Card style={{ padding: 18 }}>
          {sel ? <><h3>{sel.raisonSociale}</h3><div style={{ color: MUT, fontSize: 12, marginBottom: 12 }}>{sel.email}</div>{[["NIF / ID national", sel.nif], ["Telephone", sel.phone], ["Adresse", [sel.adresse, sel.ville, sel.pays].filter(Boolean).join(", ")], ["Projet", sel.projectId], ["Site", sel.site], ["Contact", sel.contactName], ["Acces SoftDocs", sel.moduleAccess?.softdocs || "en_attente"], ["Acces SoftSign", sel.moduleAccess?.softsign || sel.status || "en_attente"]].map(([k, v]) => <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "7px 0", borderBottom: `1px solid ${BD}`, fontSize: 12 }}><b>{k}</b><span style={{ textAlign: "right" }}>{v || "—"}</span></div>)}
            <div style={{ marginTop: 16, paddingTop: 12, borderTop: `2px solid ${BD}` }}>
              <div style={{ fontSize: 12.5, fontWeight: 900, marginBottom: 8 }}>Coordonnees bancaires</div>
              {[["Banque", bank.bankName], ["Domiciliation", bank.bankBranch], ["Code banque / guichet", [bank.bankCode, bank.branchCode].filter(Boolean).join(" / ")], ["Compte / cle RIB", [bank.accountNumber, bank.ribKey].filter(Boolean).join(" / ")], ["SWIFT", bank.swift], ["IBAN", bank.iban], ["Verification RIB", bank.ribVerified ? "Format verifie localement" : "Non verifie"]].map(([k, v]) => <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "7px 0", borderBottom: `1px solid ${BD}`, fontSize: 12 }}><b>{k}</b><span style={{ textAlign: "right", wordBreak: "break-word" }}>{v || "—"}</span></div>)}
            </div>
            <div style={{ display: "grid", gap: 8, marginTop: 16 }}>
              <Button tone="green" onClick={() => update(sel.id, "actif")}>Accepter SoftDocs + SoftSign</Button>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <Button onClick={() => update(sel.id, "actif", ["softdocs"])}>Autoriser SoftDocs</Button>
                <Button onClick={() => update(sel.id, "actif", ["softsign"])}>Autoriser SoftSign</Button>
              </div>
              <Button tone="orange" onClick={() => update(sel.id, "complement")}>Demander complement</Button>
              <Button tone="red" onClick={() => update(sel.id, "rejete")}>Rejeter le compte</Button>
            </div></> : <div style={{ color: "#94a3b8" }}>Selectionnez un compte</div>}
        </Card>
      </div>
    </div>
  );
}

function OtpToggle({ checked, onChange }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        position: "relative", width: 42, height: 24, borderRadius: 12, cursor: "pointer", flexShrink: 0,
        background: checked ? ACC2 : "#cbd5e1", transition: "background .18s",
      }}
    >
      <div style={{
        position: "absolute", top: 3, left: checked ? 21 : 3, width: 18, height: 18,
        borderRadius: "50%", background: WH, transition: "left .18s", boxShadow: "0 1px 4px rgba(0,0,0,.18)",
      }} />
    </div>
  );
}

function OtpAdmin({ config, setConfig, workflows, setWorkflows }) {
  const [expandedWf, setExpandedWf] = useState(null);
  const [saved, setSaved] = useState(false);

  const channels = config.channels || ["email"];
  const hasEmail = channels.includes("email") || channels.includes("email_sms");
  const hasSms = channels.includes("sms") || channels.includes("email_sms");

  function toggleChannel(ch) {
    let next;
    if (ch === "email") {
      const on = !hasEmail;
      if (on && hasSms) next = ["email_sms"];
      else if (on) next = ["email"];
      else next = hasSms ? ["sms"] : ["email"];
    } else {
      const on = !hasSms;
      if (on && hasEmail) next = ["email_sms"];
      else if (on) next = ["sms"];
      else next = hasEmail ? ["email"] : ["email"];
    }
    setConfig((p) => ({ ...p, channels: next }));
  }

  function saveConfig() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  const otpStepCount = workflows.reduce((acc, wf) => acc + (wf.steps || []).filter((s) => s.otpRequired).length, 0);

  return (
    <div style={{ fontFamily: FONT, width: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22, gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg,#4c1d95,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 20 }}>🔐</span>
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#0f172a", letterSpacing: "-.3px" }}>Signature OTP</div>
              <div style={{ fontSize: 12, color: MUT, marginTop: 1 }}>One-Time Password — authentification a usage unique</div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          {saved && (
            <span style={{ fontSize: 12, fontWeight: 700, color: GREEN, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 20, padding: "4px 12px" }}>
              ✓ Parametres sauvegardes
            </span>
          )}
          <Button tone="primary" onClick={saveConfig}>💾 Enregistrer</Button>
        </div>
      </div>

      {/* Activation globale */}
      <Card style={{ padding: "14px 18px", marginBottom: 16, background: config.enabled ? "#f5f3ff" : "#f8fafc", border: `1px solid ${config.enabled ? "#ddd6fe" : BD}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 22 }}>{config.enabled ? "🔒" : "🔓"}</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 13.5, color: config.enabled ? "#4c1d95" : "#374151" }}>
                Authentification OTP {config.enabled ? "activee" : "desactivee"}
              </div>
              <div style={{ fontSize: 12, color: MUT, marginTop: 2 }}>
                {config.enabled
                  ? "Le code OTP sera demande pour les etapes de signature marquees comme requises."
                  : "Aucun code OTP ne sera exige lors des signatures, meme si configure par workflow."}
              </div>
            </div>
          </div>
          <OtpToggle checked={!!config.enabled} onChange={(v) => setConfig((p) => ({ ...p, enabled: v }))} />
        </div>
      </Card>

      {/* Stats rapides */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Longueur code", value: config.length + " car.", icon: "🔢", color: ACC2 },
          { label: "Validite", value: config.ttlMinutes + " min", icon: "⏱", color: BLUE },
          { label: "Tentatives max", value: config.maxAttempts, icon: "🛡", color: ORANGE },
          { label: "Etapes OTP actives", value: otpStepCount, icon: "✅", color: GREEN },
        ].map(({ label, value, icon, color }) => (
          <Card key={label} style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{icon}</div>
            <div>
              <div style={{ fontSize: 19, fontWeight: 900, color: "#0f172a", lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 11, color: MUT, marginTop: 3 }}>{label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Parametrage code OTP */}
      <Card style={{ marginBottom: 16, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${BD}`, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>⚙️</span>
          <span style={{ fontWeight: 800, fontSize: 14, color: "#0f172a" }}>Parametrage du code OTP</span>
        </div>
        <div style={{ padding: 18, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {/* Longueur */}
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: MUT, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6 }}>Longueur du code</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={() => setConfig((p) => ({ ...p, length: Math.max(4, p.length - 1) }))}
                style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${BD}`, background: WH, cursor: "pointer", fontWeight: 900, fontSize: 18, color: "#374151", fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center" }}
              >−</button>
              <div style={{ flex: 1, textAlign: "center", fontSize: 22, fontWeight: 900, color: ACC2, fontVariantNumeric: "tabular-nums" }}>{config.length}</div>
              <button
                onClick={() => setConfig((p) => ({ ...p, length: Math.min(12, p.length + 1) }))}
                style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${BD}`, background: WH, cursor: "pointer", fontWeight: 900, fontSize: 18, color: "#374151", fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center" }}
              >+</button>
            </div>
            <div style={{ marginTop: 8, display: "flex", gap: 6, justifyContent: "center" }}>
              {[4, 5, 6, 8].map((n) => (
                <button key={n} onClick={() => setConfig((p) => ({ ...p, length: n }))}
                  style={{ padding: "3px 10px", borderRadius: 20, border: `1px solid ${config.length === n ? ACC2 : BD}`, background: config.length === n ? `${ACC2}18` : WH, color: config.length === n ? ACC2 : MUT, fontSize: 11.5, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Type */}
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: MUT, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6 }}>Type de code</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { value: "numeric", label: "Numerique", desc: "Chiffres uniquement — ex: 483921", icon: "🔢" },
                { value: "alphanumeric", label: "Alphanumerique", desc: "Lettres + chiffres — ex: A3K9Z1", icon: "🔡" },
              ].map(({ value, label, desc, icon }) => (
                <button key={value} onClick={() => setConfig((p) => ({ ...p, type: value }))}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 9,
                    border: `2px solid ${config.type === value ? ACC2 : BD}`,
                    background: config.type === value ? `${ACC2}10` : WH,
                    cursor: "pointer", textAlign: "left", fontFamily: FONT,
                  }}>
                  <span style={{ fontSize: 18 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: config.type === value ? 800 : 600, color: config.type === value ? ACC2 : "#374151" }}>{label}</div>
                    <div style={{ fontSize: 11, color: MUT }}>{desc}</div>
                  </div>
                  <div style={{ marginLeft: "auto", width: 16, height: 16, borderRadius: "50%", border: `2px solid ${config.type === value ? ACC2 : BD}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {config.type === value && <div style={{ width: 8, height: 8, borderRadius: "50%", background: ACC2 }} />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Apercu code */}
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: MUT, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6 }}>Apercu du code genere</div>
            <div style={{ background: "#0f172a", borderRadius: 12, padding: "20px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "#64748b", marginBottom: 8, letterSpacing: ".08em" }}>VOTRE CODE OTP</div>
              <div style={{ display: "flex", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
                {Array.from({ length: config.length }).map((_, i) => (
                  <div key={i} style={{ width: 32, height: 42, borderRadius: 8, background: "#1e293b", border: "1px solid #334155", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, color: "#a78bfa", fontFamily: "monospace" }}>
                    {config.type === "numeric" ? Math.floor(Math.random() * 10) : "ABCDE0123456789"[Math.floor(Math.random() * 16)]}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, fontSize: 11, color: "#475569" }}>Expire dans {config.ttlMinutes} min</div>
            </div>
          </div>
        </div>

        {/* Limites et delais */}
        <div style={{ padding: "0 18px 18px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {[
            {
              key: "ttlMinutes", label: "Duree de validite", unit: "minutes",
              min: 1, max: 60, desc: "Temps avant expiration du code",
              icon: "⏱", color: BLUE,
            },
            {
              key: "maxAttempts", label: "Tentatives max", unit: "essais",
              min: 1, max: 10, desc: "Blocage apres N echecs consecutifs",
              icon: "🛡", color: ORANGE,
            },
            {
              key: "maxGenerations", label: "Regenerations max", unit: "renvois",
              min: 1, max: 10, desc: "Limite de renvoi du code OTP",
              icon: "🔄", color: GREEN,
            },
          ].map(({ key, label, unit, min, max, desc, icon, color }) => (
            <div key={key} style={{ background: "#f8fafc", borderRadius: 10, padding: "14px 14px", border: `1px solid ${BD}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 16 }}>{icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 12.5, color: "#374151" }}>{label}</div>
                  <div style={{ fontSize: 11, color: MUT }}>{desc}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button onClick={() => setConfig((p) => ({ ...p, [key]: Math.max(min, p[key] - 1) }))}
                  style={{ width: 30, height: 30, borderRadius: 7, border: `1px solid ${BD}`, background: WH, cursor: "pointer", fontWeight: 900, fontSize: 16, color: "#374151", fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <span style={{ fontSize: 20, fontWeight: 900, color }}>{config[key]}</span>
                  <span style={{ fontSize: 11, color: MUT, marginLeft: 4 }}>{unit}</span>
                </div>
                <button onClick={() => setConfig((p) => ({ ...p, [key]: Math.min(max, p[key] + 1) }))}
                  style={{ width: 30, height: 30, borderRadius: 7, border: `1px solid ${BD}`, background: WH, cursor: "pointer", fontWeight: 900, fontSize: 16, color: "#374151", fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
              </div>
              <input type="range" min={min} max={max} value={config[key]}
                onChange={(e) => setConfig((p) => ({ ...p, [key]: Number(e.target.value) }))}
                style={{ width: "100%", marginTop: 10, accentColor: color }} />
            </div>
          ))}
        </div>

        {/* Canal d'envoi */}
        <div style={{ padding: "0 18px 18px" }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: MUT, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 10 }}>Canal d'envoi</div>
          <div style={{ display: "flex", gap: 12 }}>
            {[
              { ch: "email", label: "Email", icon: "📧", desc: "Envoi du code par courrier electronique" },
              { ch: "sms", label: "SMS", icon: "📱", desc: "Envoi du code par message texte" },
            ].map(({ ch, label, icon, desc }) => {
              const active = ch === "email" ? hasEmail : hasSms;
              return (
                <button key={ch} onClick={() => toggleChannel(ch)}
                  style={{
                    flex: 1, display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 10,
                    border: `2px solid ${active ? ACC2 : BD}`, background: active ? `${ACC2}10` : WH,
                    cursor: "pointer", textAlign: "left", fontFamily: FONT,
                  }}>
                  <span style={{ fontSize: 26 }}>{icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 13.5, color: active ? ACC2 : "#374151" }}>{label}</div>
                    <div style={{ fontSize: 11.5, color: MUT, marginTop: 2 }}>{desc}</div>
                  </div>
                  <OtpToggle checked={active} onChange={() => toggleChannel(ch)} />
                </button>
              );
            })}
          </div>
          {!hasEmail && !hasSms && (
            <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 8, background: "#fef2f2", border: "1px solid #fecaca", fontSize: 12, color: RED, fontWeight: 700 }}>
              ⚠ Veuillez selectionner au moins un canal d'envoi.
            </div>
          )}
          {hasEmail && hasSms && (
            <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 8, background: "#f0fdf4", border: "1px solid #bbf7d0", fontSize: 12, color: GREEN, fontWeight: 600 }}>
              ✓ Le code OTP sera envoye simultanement par Email et SMS.
            </div>
          )}
        </div>
      </Card>

      {/* Parametrage OTP par workflow */}
      <Card style={{ overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${BD}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>🔄</span>
            <span style={{ fontWeight: 800, fontSize: 14, color: "#0f172a" }}>OTP par etape de workflow</span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: MUT, background: "#f1f5f9", border: `1px solid ${BD}`, borderRadius: 20, padding: "3px 12px" }}>
            {otpStepCount} etape{otpStepCount !== 1 ? "s" : ""} avec OTP
          </span>
        </div>

        {workflows.length === 0 && (
          <div style={{ padding: "40px 20px", textAlign: "center", color: MUT, fontSize: 13 }}>
            Aucun workflow configure. Creez d'abord des modeles de workflow.
          </div>
        )}

        {workflows.map((wf, wi) => {
          const wfOtpCount = (wf.steps || []).filter((s) => s.otpRequired).length;
          const isOpen = expandedWf === wf.id;
          return (
            <div key={wf.id} style={{ borderBottom: wi < workflows.length - 1 ? `1px solid ${BD}` : "none" }}>
              {/* Workflow header */}
              <button
                onClick={() => setExpandedWf(isOpen ? null : wf.id)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", background: isOpen ? "#faf8ff" : WH, border: "none", cursor: "pointer", textAlign: "left", fontFamily: FONT, transition: "background .14s" }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: `${ACC2}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🔄</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 13.5, color: "#0f172a" }}>{wf.name}</div>
                  <div style={{ fontSize: 11.5, color: MUT, marginTop: 1 }}>{wf.steps?.length || 0} etape{wf.steps?.length !== 1 ? "s" : ""}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {wfOtpCount > 0 && (
                    <span style={{ fontSize: 11.5, fontWeight: 800, color: ACC2, background: `${ACC2}18`, border: `1px solid ${ACC2}44`, borderRadius: 20, padding: "3px 10px" }}>
                      {wfOtpCount} OTP
                    </span>
                  )}
                  <span style={{ color: MUT, fontSize: 18, transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform .18s", display: "inline-block" }}>›</span>
                </div>
              </button>

              {/* Steps */}
              {isOpen && (
                <div style={{ padding: "4px 18px 14px 18px", background: "#faf8ff" }}>
                  {(wf.steps || []).length === 0 && (
                    <div style={{ padding: "14px", textAlign: "center", color: MUT, fontSize: 12 }}>Aucune etape dans ce workflow.</div>
                  )}
                  {(wf.steps || []).map((step, si) => {
                    const action = getAction(step.action);
                    const actionColors = {
                      signature: { bg: "#dcfce7", color: "#15803d", border: "#bbf7d0" },
                      paraphe: { bg: "#dbeafe", color: "#1d4ed8", border: "#bfdbfe" },
                      validation: { bg: "#fef9c3", color: "#a16207", border: "#fde68a" },
                      notification: { bg: "#f1f5f9", color: "#475569", border: BD },
                    };
                    const ac = actionColors[step.action] || actionColors.notification;
                    return (
                      <div key={step.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, background: step.otpRequired ? "#f5f3ff" : WH, border: `1px solid ${step.otpRequired ? "#ddd6fe" : BD}`, marginBottom: si < wf.steps.length - 1 ? 8 : 0, transition: "background .14s,border .14s" }}>
                        {/* Step number */}
                        <div style={{ width: 26, height: 26, borderRadius: "50%", background: step.otpRequired ? ACC2 : "#e2e8f0", color: step.otpRequired ? WH : MUT, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11.5, fontWeight: 900, flexShrink: 0 }}>{si + 1}</div>
                        {/* Step info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>{step.label || `Etape ${si + 1}`}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                            <span style={{ fontSize: 10.5, fontWeight: 800, padding: "2px 8px", borderRadius: 20, background: ac.bg, color: ac.color, border: `1px solid ${ac.border}` }}>
                              {action?.label || step.action}
                            </span>
                            {step.assigneeName && (
                              <span style={{ fontSize: 11, color: MUT }}>→ {step.assigneeName}</span>
                            )}
                          </div>
                        </div>
                        {/* OTP toggle */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 12, fontWeight: step.otpRequired ? 800 : 500, color: step.otpRequired ? ACC2 : MUT }}>
                              {step.otpRequired ? "OTP requis" : "Sans OTP"}
                            </div>
                            <div style={{ fontSize: 10.5, color: MUT }}>
                              {step.otpRequired ? `Code ${config.length} car. · ${config.ttlMinutes} min` : "Signature directe"}
                            </div>
                          </div>
                          <OtpToggle
                            checked={!!step.otpRequired}
                            onChange={(v) =>
                              setWorkflows((p) =>
                                p.map((w) =>
                                  w.id === wf.id
                                    ? { ...w, steps: w.steps.map((x) => (x.id === step.id ? { ...x, otpRequired: v } : x)) }
                                    : w
                                )
                              )
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </Card>

      {/* Info box */}
      <div style={{ marginTop: 16, padding: "14px 16px", borderRadius: 10, background: "#eff6ff", border: "1px solid #bfdbfe", display: "flex", gap: 12 }}>
        <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>ℹ️</span>
        <div style={{ fontSize: 12.5, color: "#1e40af", lineHeight: 1.6 }}>
          <b>Comment fonctionne la signature OTP ?</b><br />
          Lorsqu'un signataire arrive sur une etape marquee <b>OTP requis</b>, un code a usage unique lui est envoye via le canal configure (Email / SMS). Il doit saisir ce code pour valider sa signature. Le code expire automatiquement apres <b>{config.ttlMinutes} minutes</b> et le compte est bloque apres <b>{config.maxAttempts} echecs</b>.
        </div>
      </div>
    </div>
  );
}

/* ─── Autorisations: constants ─── */
const SS_MENUS = [
  { id: "depot",         label: "Dépôt de documents",    icon: "📄" },
  { id: "mesDocuments",  label: "Mes documents",           icon: "📄" },
  { id: "tousDocuments", label: "Tous les documents",      icon: null, submenu: true, parentLabel: "Sous-menu de Mes documents" },
  { id: "signature",     label: "Signature & paraphe",     icon: "✏️" },
  { id: "delegations",   label: "Délégations",             icon: "📄" },
  { id: "rapports",      label: "Rapports & Statistiques", icon: "📄" },
];
const SS_ACTIONS = [
  { id: "creation",       label: "Création" },
  { id: "consultation",   label: "Consultation" },
  { id: "modification",   label: "Modification" },
  { id: "suppression",    label: "Suppression" },
  { id: "telechargement", label: "Téléchargement" },
];
const makeMenuPerms = (vals) => SS_MENUS.reduce((acc, m, i) => ({ ...acc, [m.id]: SS_ACTIONS.reduce((a2, ac, j) => ({ ...a2, [ac.id]: vals[i]?.[j] ?? false }), {}) }), {});
const SS_DEFAULT_ROLE_PERMS = {
  standard:   makeMenuPerms([[1,1,0,0,1],[0,1,0,0,1],[0,0,0,0,0],[0,1,0,0,1],[1,1,1,0,0],[0,1,0,0,1]]),
  admin:      makeMenuPerms([[1,1,1,1,1],[1,1,1,0,1],[0,1,0,0,1],[1,1,1,0,1],[1,1,1,1,0],[0,1,0,0,1]]),
  superadmin: makeMenuPerms([[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1]]),
  readonly:   makeMenuPerms([[0,1,0,0,1],[0,1,0,0,0],[0,1,0,0,0],[0,1,0,0,0],[0,1,0,0,0],[0,1,0,0,0]]),
};

function PermCheckbox({ checked, onChange }) {
  return (
    <div onClick={() => onChange(!checked)} style={{
      width: 20, height: 20, borderRadius: 5, border: `2px solid ${checked ? ACC2 : "#cbd5e1"}`,
      background: checked ? ACC2 : WH, cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
      transition: "all .15s", flexShrink: 0,
    }}>
      {checked && <span style={{ color: WH, fontSize: 12, fontWeight: 900, lineHeight: 1, userSelect: "none" }}>✓</span>}
    </div>
  );
}

function AutorisationsView({ role, perms, defaultPerms, onSave, onCancel }) {
  const [local, setLocal] = useState(() => JSON.parse(JSON.stringify(perms)));
  const [allEnabled, setAllEnabled] = useState(false);
  const [saveFlash, setSaveFlash] = useState(false);
  const [lastModified, setLastModified] = useState(null);

  function toggle(menuId, actionId) {
    setLocal(p => ({ ...p, [menuId]: { ...p[menuId], [actionId]: !p[menuId][actionId] } }));
  }
  function toggleFull(menuId, val) {
    setLocal(p => ({ ...p, [menuId]: SS_ACTIONS.reduce((a, ac) => ({ ...a, [ac.id]: val }), {}) }));
  }
  function isFullAccess(menuId) { return SS_ACTIONS.every(a => local[menuId]?.[a.id]); }
  function selectAll() {
    const all = {};
    SS_MENUS.forEach(m => { all[m.id] = SS_ACTIONS.reduce((a, ac) => ({ ...a, [ac.id]: true }), {}); });
    setLocal(all);
  }
  function reset() { setLocal(JSON.parse(JSON.stringify(defaultPerms))); setAllEnabled(false); }
  function handleToggleAll(val) {
    setAllEnabled(val);
    if (val) selectAll(); else reset();
  }
  function handleSave() {
    onSave(local);
    setLastModified(new Date());
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 2000);
  }

  const timeStr = lastModified
    ? `aujourd'hui à ${String(lastModified.getHours()).padStart(2,"0")}h${String(lastModified.getMinutes()).padStart(2,"0")}`
    : null;

  return (
    <div style={{ fontFamily: FONT, maxWidth: 1000, width: "100%" }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: 12, color: MUT, marginBottom: 14, display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{ cursor: "pointer", color: ACC2, fontWeight: 600 }} onClick={onCancel}>Tableau de bord</span>
        <span>›</span>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>Autorisations</span>
      </div>

      {/* Page header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#0f172a", letterSpacing: "-.3px" }}>Autorisations</div>
          <div style={{ fontSize: 13, color: MUT, marginTop: 3 }}>
            Configuration des droits d'accès aux menus et fonctionnalités pour le rôle {role.label}.
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {timeStr && <div style={{ fontSize: 12, color: MUT }}>Dernière modification : {timeStr}</div>}
          <span style={{ fontSize: 12.5, fontWeight: 800, padding: "5px 14px", borderRadius: 20, background: `${role.color}18`, color: role.color, border: `1px solid ${role.color}44` }}>
            Rôle : {role.label}
          </span>
        </div>
      </div>

      {/* Info banner */}
      <div style={{ padding: "11px 16px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 9, marginBottom: 18, display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, color: "#1d4ed8" }}>
        <span style={{ flexShrink: 0, fontWeight: 900, fontSize: 15, lineHeight: 1 }}>ℹ</span>
        Les modifications s'appliquent immédiatement à tous les utilisateurs {role.label}. Un journal d'audit est conservé.
      </div>

      {/* Matrice */}
      <Card style={{ overflow: "hidden", marginBottom: 16 }}>
        {/* Card header */}
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BD}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>Matrice des autorisations</div>
            <div style={{ fontSize: 12, color: MUT, marginTop: 2 }}>Cochez les actions autorisées par menu. « Accès complet » active automatiquement toutes les actions.</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button onClick={reset} style={{ padding: "7px 14px", borderRadius: 7, border: `1px solid ${BD}`, background: WH, fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: FONT, color: "#374151" }}>Réinitialiser</button>
            <button onClick={selectAll} style={{ padding: "7px 14px", borderRadius: 7, border: `1px solid ${BD}`, background: WH, fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: FONT, color: "#374151" }}>Tout sélectionner</button>
            <Button tone="primary" onClick={handleSave}>{saveFlash ? "✓ Enregistré" : "Enregistrer"}</Button>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={{ padding: "11px 20px", textAlign: "left", fontSize: 12, fontWeight: 800, color: ACC2, borderBottom: `1px solid ${BD}`, width: "28%" }}>
                  Menu / Fonctionnalité
                </th>
                {SS_ACTIONS.map(a => (
                  <th key={a.id} style={{ padding: "11px 14px", textAlign: "center", fontSize: 12, fontWeight: 800, color: ACC2, borderBottom: `1px solid ${BD}`, width: "12%" }}>
                    {a.label}
                  </th>
                ))}
                <th style={{ padding: "11px 14px", textAlign: "center", fontSize: 11.5, fontWeight: 900, borderBottom: `1px solid ${BD}`, width: "12%", background: ACC2, color: WH, lineHeight: 1.3 }}>
                  Accès<br />complet
                </th>
              </tr>
            </thead>
            <tbody>
              {SS_MENUS.map((menu, idx) => {
                const full = isFullAccess(menu.id);
                return (
                  <tr key={menu.id} style={{ borderBottom: `1px solid ${BD}`, background: idx % 2 === 0 ? WH : "#fafbfd" }}>
                    <td style={{ padding: "12px 20px" }}>
                      {menu.submenu ? (
                        <div style={{ paddingLeft: 18 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ color: MUT, fontSize: 12 }}>↳</span>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{menu.label}</span>
                          </div>
                          <div style={{ fontSize: 11, color: MUT, marginTop: 1, paddingLeft: 16 }}>{menu.parentLabel}</div>
                        </div>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                          <span style={{ fontSize: 16, opacity: 0.7 }}>{menu.icon}</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{menu.label}</span>
                        </div>
                      )}
                    </td>
                    {SS_ACTIONS.map(a => (
                      <td key={a.id} style={{ padding: "12px 14px", textAlign: "center" }}>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                          <PermCheckbox checked={!!local[menu.id]?.[a.id]} onChange={() => toggle(menu.id, a.id)} />
                        </div>
                      </td>
                    ))}
                    <td style={{ padding: "12px 14px", textAlign: "center", background: full ? `${ACC2}08` : "transparent" }}>
                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <PermCheckbox checked={full} onChange={v => toggleFull(menu.id, v)} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Activer toutes les permissions */}
        <div style={{ padding: "14px 20px", borderTop: `1px solid ${BD}`, background: allEnabled ? `${ACC2}06` : "#f8fafc", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 18, color: ACC2 }}>🔑</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: ACC2 }}>Activer toutes les permissions</div>
              <div style={{ fontSize: 11.5, color: MUT }}>Donne un accès complet à tous les menus pour le rôle {role.label}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <OtpToggle checked={allEnabled} onChange={handleToggleAll} />
            <span style={{ fontSize: 12.5, color: allEnabled ? ACC2 : MUT, fontWeight: 600 }}>
              {allEnabled ? "Activée" : "Désactivée"}
            </span>
          </div>
        </div>
      </Card>

      {/* Légende */}
      <div style={{ padding: "12px 18px", background: WH, border: `1px solid ${BD}`, borderRadius: 9, marginBottom: 20, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 20, fontSize: 12.5, color: "#374151" }}>
        <span style={{ fontWeight: 700 }}>Légende :</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 18, height: 18, borderRadius: 4, background: ACC2, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: WH, fontSize: 11, fontWeight: 900 }}>✓</span>
          </div>
          <span>Action autorisée</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 18, height: 18, borderRadius: 4, border: "2px solid #cbd5e1", background: WH }} />
          <span>Action non autorisée</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: MUT }}>
          <span>→</span>
          <span><b>Accès complet</b> : active Création, Consultation, Modification, Suppression, Téléchargement</span>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 16, borderTop: `1px solid ${BD}` }}>
        <Button tone="light" onClick={onCancel}>Annuler</Button>
        <Button tone="primary" onClick={handleSave}>{saveFlash ? "✓ Enregistré" : "Enregistrer"}</Button>
      </div>
    </div>
  );
}

/* ─── Relances ─── */
const LS_RELANCES = "ss_relancesConfig";
const DEFAULT_RELANCES = { delai: 2, frequence: 2, maxRelances: 5, notifInterne: true, lienDirect: true };
function loadRelances() { try { const v = localStorage.getItem(LS_RELANCES); return v ? { ...DEFAULT_RELANCES, ...JSON.parse(v) } : { ...DEFAULT_RELANCES }; } catch { return { ...DEFAULT_RELANCES }; } }
function saveRelances(cfg) { try { localStorage.setItem(LS_RELANCES, JSON.stringify(cfg)); } catch {} }

function ordinalRelance(n) { return n === 1 ? "1ère" : `${n}ème`; }

function RelancesCheckbox({ checked, onChange, label, desc }) {
  return (
    <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer", padding: "10px 0" }}>
      <div onClick={() => onChange(!checked)}
        style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${checked ? ACC2 : "#cbd5e1"}`, background: checked ? ACC2 : WH,
          flexShrink: 0, marginTop: 1, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all .15s" }}>
        {checked && <span style={{ color: WH, fontSize: 12, fontWeight: 900, lineHeight: 1 }}>✓</span>}
      </div>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}>{label}</div>
        <div style={{ fontSize: 12.5, color: MUT, marginTop: 2, lineHeight: 1.5 }}>{desc}</div>
      </div>
    </label>
  );
}

function RelancesView({ setView }) {
  const [form, setForm] = useState(loadRelances);
  const [original] = useState(loadRelances);
  const [saveFlash, setSaveFlash] = useState(false);
  const [externalRequests, setExternalRequests] = useState(getExternalSignatureRequests);
  const [historyRequest, setHistoryRequest] = useState(null);

  useEffect(() => {
    const sync = () => setExternalRequests(getExternalSignatureRequests());
    window.addEventListener("storage", sync);
    window.addEventListener("ss-external-signature-change", sync);
    const timer = window.setInterval(sync, 1200);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("ss-external-signature-change", sync);
      window.clearInterval(timer);
    };
  }, []);

  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }));

  function handleSave() {
    saveRelances(form);
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 2000);
  }

  function handleCancel() { setForm(original); }

  /* Timeline computation */
  const timeline = Array.from({ length: Math.max(1, Math.min(form.maxRelances, 10)) }, (_, i) => {
    const n = i + 1;
    if (n === 1) return { n, label: `${ordinalRelance(n)} relance`, dayText: `J - ${form.delai} jours`, highlight: false };
    const offset = (n - 1) * form.frequence;
    const isLast = n === form.maxRelances;
    return { n, label: `${ordinalRelance(n)} relance${isLast ? " (max)" : ""}`, dayText: offset === 0 ? "J" : `J + ${offset} jours`, highlight: isLast };
  });

  const numStyle = { width: 70, height: 40, borderRadius: 8, border: `1px solid ${BD}`, padding: "0 12px", fontFamily: FONT, fontSize: 18, fontWeight: 700, color: "#0f172a", outline: "none", background: WH, textAlign: "center" };
  const unitStyle = { padding: "0 14px", height: 40, borderRadius: 8, border: `1px solid ${BD}`, background: "#f8fafc", fontSize: 13, color: MUT, display: "flex", alignItems: "center", whiteSpace: "nowrap" };

  return (
    <div style={{ fontFamily: FONT, maxWidth: 980, width: "100%" }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: 12, color: MUT, marginBottom: 14, display: "flex", alignItems: "center", gap: 5 }}>
        <span>Tableau de bord</span><span>›</span>
        <span>Paramétrage</span><span>›</span>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>Relances</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#0f172a", letterSpacing: "-.3px" }}>Relances</div>
        <div style={{ fontSize: 13, color: MUT, marginTop: 3 }}>Configurez les règles de relance applicables aux circuits de validation et de signature.</div>
      </div>

      {/* Info banner */}
      <div style={{ padding: "13px 18px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, marginBottom: 22, display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: "#1d4ed8" }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ color: WH, fontWeight: 900, fontSize: 14, lineHeight: 1 }}>i</span>
        </div>
        Ces paramètres s'appliquent à toutes les relances automatiques envoyées aux responsables lorsque des actions sont en attente.
      </div>

      <Card style={{ padding: "18px 20px", marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>Gestion de l&apos;expiration et des relances externes</div>
        <div style={{ fontSize: 12.5, color: MUT, marginTop: 3, marginBottom: 14 }}>Ces demandes proviennent réellement des documents envoyés à des tiers depuis le workflow.</div>
        <div style={{ display: "grid", gap: 8 }}>
          {externalRequests.map((request) => {
            const status = effectiveExternalStatus(request);
            const statusMeta = {
              pending: ["En attente de signature", ORANGE, "#fffbeb"],
              otp_sent: ["OTP envoyé", BLUE, "#eff6ff"],
              otp_verified: ["OTP vérifié", BLUE, "#eff6ff"],
              expired: ["Lien expiré", RED, "#fef2f2"],
              reactivation_requested: ["Réactivation demandée", RED, "#fef2f2"],
              signed: ["Signé par le tiers", GREEN, "#ecfdf5"],
            }[status] || [status, MUT, "#f8fafc"];
            const updateRequest = (next) => {
              if (!next) return;
              setExternalRequests((current) => current.map((item) => item.id === next.id ? next : item));
            };
            return <div key={request.id} style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", padding: "11px 12px", border: `1px solid ${BD}`, borderRadius: 8, background: WH }}>
              <div style={{ flex: 1, minWidth: 260 }}>
                <div style={{ fontSize: 13, fontWeight: 850, color: "#0f172a" }}>{request.docRef} · {request.docTitle}</div>
                <div style={{ fontSize: 11.5, color: MUT, marginTop: 3 }}>{request.thirdPartyName} · {request.email} · Expiration : {new Date(request.expiresAt).toLocaleString("fr-FR")}</div>
              </div>
              <span style={{ padding: "4px 8px", borderRadius: 20, color: statusMeta[1], background: statusMeta[2], fontSize: 11, fontWeight: 850 }}>{statusMeta[0]}</span>
              <span style={{ color: MUT, fontSize: 11.5 }}>{(request.reminders||[]).length} relance(s)</span>
              {["pending","otp_sent","otp_verified"].includes(status) && <button onClick={() => updateRequest(remindExternalSignature(request.id,"Utilisateur interne"))} style={smallButton(BLUE)}>Relancer</button>}
              {["expired","reactivation_requested"].includes(status) && <button onClick={() => updateRequest(reactivateExternalSignature(request.id,"Utilisateur interne"))} style={smallButton(ACC2)}>Régénérer le lien</button>}
              <button onClick={() => setHistoryRequest(request)} style={smallButton("#475569")}>Historique</button>
            </div>;
          })}
          {!externalRequests.length && <div style={{ padding: 18, textAlign: "center", color: MUT, fontSize: 12.5 }}>Aucune demande de signature externe enregistrée.</div>}
        </div>
      </Card>

      {/* Configuration générale */}
      <Card style={{ padding: "22px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 22 }}>Configuration générale des relances</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>

          {/* Délai avant 1ère relance */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 18 }}>📅</span>
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 800, color: "#0f172a" }}>
                Délai avant 1ère relance <span style={{ color: ACC2, fontWeight: 900, fontSize: 14, cursor: "default" }} title="Nombre de jours avant l'échéance">ⓘ</span>
              </div>
            </div>
            <div style={{ fontSize: 12.5, color: MUT, lineHeight: 1.6, marginBottom: 14 }}>
              Nombre de jours avant la fin d'échéance à partir duquel la première relance est envoyée pour inviter le responsable à valider le document.
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <input type="number" min={0} max={365} value={form.delai} onChange={e => upd("delai", Math.max(0, Number(e.target.value)))} style={numStyle} />
              <div style={unitStyle}>jour(s) avant la fin d'échéance</div>
            </div>
            <div style={{ fontSize: 11.5, color: MUT, fontStyle: "italic" }}>Ex. : 2 = la relance sera envoyée 2 jours avant la fin d'échéance.</div>
          </div>

          {/* Fréquence des relances */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 18 }}>🔄</span>
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 800, color: "#0f172a" }}>
                Fréquence des relances <span style={{ color: ACC2, fontWeight: 900, fontSize: 14, cursor: "default" }} title="Intervalle entre chaque relance">ⓘ</span>
              </div>
            </div>
            <div style={{ fontSize: 12.5, color: MUT, lineHeight: 1.6, marginBottom: 14 }}>
              Intervalle de temps entre chaque relance tant que l'action n'a pas été effectuée.
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <input type="number" min={1} max={365} value={form.frequence} onChange={e => upd("frequence", Math.max(1, Number(e.target.value)))} style={numStyle} />
              <div style={unitStyle}>jour(s)</div>
            </div>
            <div style={{ fontSize: 11.5, color: MUT, fontStyle: "italic" }}>Ex. : 2 = une relance sera envoyée tous les 2 jours.</div>
          </div>

          {/* Nombre maximum de relances */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 18 }}>✉️</span>
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 800, color: "#0f172a" }}>
                Nombre maximum de relances <span style={{ color: ACC2, fontWeight: 900, fontSize: 14, cursor: "default" }} title="Nombre max de relances par action">ⓘ</span>
              </div>
            </div>
            <div style={{ fontSize: 12.5, color: MUT, lineHeight: 1.6, marginBottom: 14 }}>
              Nombre maximum de relances à envoyer pour une même action.
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <input type="number" min={1} max={20} value={form.maxRelances} onChange={e => upd("maxRelances", Math.max(1, Number(e.target.value)))} style={numStyle} />
              <div style={unitStyle}>relance(s)</div>
            </div>
            <div style={{ fontSize: 11.5, color: MUT, fontStyle: "italic" }}>Ex. : 5 = jusqu'à 5 relances seront envoyées.</div>
          </div>
        </div>
      </Card>

      {/* Paramètres complémentaires */}
      <Card style={{ padding: "22px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 14 }}>Paramètres complémentaires</div>
        <RelancesCheckbox
          checked={form.notifInterne}
          onChange={v => upd("notifInterne", v)}
          label="Envoyer une notification interne"
          desc="Une notification sera envoyée aux administrateurs lorsque le nombre maximum de relances est atteint."
        />
        <div style={{ height: 1, background: BD, margin: "4px 0" }} />
        <RelancesCheckbox
          checked={form.lienDirect}
          onChange={v => upd("lienDirect", v)}
          label="Inclure le lien direct vers le document dans les relances"
          desc="Le lien permet d'accéder directement au document en attente d'action."
        />

        {/* Aperçu du fonctionnement */}
        <div style={{ marginTop: 20, padding: "18px 20px", background: "#f8fafc", border: `1px solid ${BD}`, borderRadius: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: `${ACC2}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 17, color: ACC2 }}>👁</span>
            </div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 800, color: "#0f172a" }}>Aperçu du fonctionnement</div>
              <div style={{ fontSize: 12, color: MUT, marginTop: 1 }}>
                Exemple : avec un délai de {form.delai} jour(s) avant la fin d'échéance et une fréquence de {form.frequence} jour(s), les relances seront envoyées selon le calendrier suivant :
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div style={{ overflowX: "auto", paddingBottom: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 0, marginTop: 14, minWidth: "fit-content" }}>
              {/* Due date box */}
              <div style={{ textAlign: "center", flexShrink: 0 }}>
                <div style={{ padding: "8px 14px", borderRadius: 8, background: `${ACC2}14`, border: `1px solid ${ACC2}30`, minWidth: 100 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 800, color: ACC2 }}>Date d'échéance</div>
                  <div style={{ fontSize: 11, color: MUT, marginTop: 2 }}>(Fin d'échéance)</div>
                </div>
              </div>
              {/* Relances */}
              {timeline.map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "0 8px", color: "#94a3b8" }}>
                    <span style={{ fontSize: 16 }}>→</span>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ padding: "8px 14px", borderRadius: 8, background: t.highlight ? `${ACC2}18` : `${ACC2}08`, border: `1px solid ${t.highlight ? ACC2 + "50" : ACC2 + "20"}`, minWidth: 100 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 800, color: t.highlight ? ACC2 : "#374151" }}>{t.label}</div>
                      <div style={{ fontSize: 11, color: t.highlight ? ACC2 : MUT, marginTop: 2, fontWeight: t.highlight ? 700 : 400 }}>{t.dayText}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ fontSize: 12, color: MUT, marginTop: 14, fontStyle: "italic" }}>
            Après la {ordinalRelance(form.maxRelances)} relance, aucune nouvelle relance ne sera envoyée.
          </div>
        </div>
      </Card>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 16, borderTop: `1px solid ${BD}` }}>
        <Button tone="light" onClick={handleCancel}>Annuler</Button>
        <Button tone="primary" onClick={handleSave}>
          {saveFlash ? "✓ Paramètres enregistrés" : "📋 Enregistrer les paramètres"}
        </Button>
      </div>
      {historyRequest && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(15,23,42,.56)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ width: "min(720px,95vw)", maxHeight: "82vh", overflow: "auto", background: WH, borderRadius: 12, padding: 20 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}><b style={{ flex: 1 }}>Historique des relances · {historyRequest.docRef}</b><button onClick={() => setHistoryRequest(null)} style={{ border: 0, background: "#f1f5f9", borderRadius: "50%", width: 28, height: 28, cursor: "pointer" }}>×</button></div>
            {(historyRequest.actions||[]).slice().reverse().map((action)=><div key={action.id} style={{ padding: "9px 0", borderTop: `1px solid ${BD}`, fontSize: 12.5 }}><b>{action.label}</b><div style={{ color: MUT, marginTop: 3 }}>{new Date(action.at).toLocaleString("fr-FR")} · {action.actor}{action.ip?` · ${action.ip}`:""}</div></div>)}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PersonnalisationView — Personnalisation application SoftSign (5.9)
   ══════════════════════════════════════════════════════════════════ */
const LS_APP_CONFIG = "ss_appConfig";

const DEFAULT_APP_CONFIG = {
  entityType: "projet",
  entitySingulier: "Projet",
  entityPluriel: "Projets",
  logo: null,
  theme: "light",
};

const ENTITY_TYPES = [
  { id: "entreprise",   label: "Entreprise",   singulier: "Entreprise",   pluriel: "Entreprises",   icon: "🏢" },
  { id: "projet",       label: "Projet",        singulier: "Projet",       pluriel: "Projets",       icon: "📁" },
  { id: "groupe",       label: "Groupe",        singulier: "Groupe",       pluriel: "Groupes",       icon: "🏬" },
  { id: "filiale",      label: "Filiale",       singulier: "Filiale",      pluriel: "Filiales",      icon: "🔗" },
  { id: "organisation", label: "Organisation",  singulier: "Organisation", pluriel: "Organisations", icon: "⚙️" },
  { id: "direction",    label: "Direction",     singulier: "Direction",    pluriel: "Directions",    icon: "👤" },
  { id: "departement",  label: "Département",   singulier: "Département",  pluriel: "Départements",  icon: "📋" },
];

function loadAppConfig() {
  try {
    const v = localStorage.getItem(LS_APP_CONFIG);
    return v ? { ...DEFAULT_APP_CONFIG, ...JSON.parse(v) } : { ...DEFAULT_APP_CONFIG };
  } catch { return { ...DEFAULT_APP_CONFIG }; }
}

function saveAppConfig(cfg) {
  try {
    localStorage.setItem(LS_APP_CONFIG, JSON.stringify(cfg));
    window.dispatchEvent(new Event("ss-theme-change"));
  } catch {}
}

function PersonnalisationView({ setView }) {
  const [form, setForm] = useState(() => loadAppConfig());
  const [saved, setSaved] = useState(false);
  const logoInputRef = useRef(null);

  const selectedEntity = ENTITY_TYPES.find((e) => e.id === form.entityType) || ENTITY_TYPES[1];

  const handleEntitySelect = (et) => {
    setForm((f) => ({ ...f, entityType: et.id, entitySingulier: et.singulier, entityPluriel: et.pluriel }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm((f) => ({ ...f, logo: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    saveAppConfig(form);
    document.documentElement.setAttribute("data-theme", form.theme);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const SectionCard = ({ children }) => (
    <div style={{ background: WH, border: `1px solid ${BD}`, borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
      {children}
    </div>
  );

  const SectionHeader = ({ icon, title, subtitle }) => (
    <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BD}`, display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <div>
        <span style={{ fontSize: 14, fontWeight: 800, color: `var(--ss-text, #1e293b)` }}>{title}</span>
        {subtitle && <span style={{ fontSize: 13, color: MUT, fontStyle: "italic" }}> — {subtitle}</span>}
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: FONT, maxWidth: 820, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: MUT, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 6 }}>
          PARAMÉTRAGE · 5.9
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: `var(--ss-text, #1e293b)` }}>Personnalisation application</h1>
            <p style={{ margin: "6px 0 0", fontSize: 13.5, color: MUT, lineHeight: 1.5 }}>
              Configurez l&apos;identité visuelle et les libellés de votre application.
            </p>
          </div>
          <Button tone="primary" onClick={handleSave} style={{ flexShrink: 0 }}>
            {saved ? "✓ Enregistré" : "💾 Enregistrer"}
          </Button>
        </div>
      </div>

      {/* ── Section 1: Libellé d'entité ── */}
      <SectionCard>
        <SectionHeader icon="🏷️" title="Libellé d'entité" subtitle="propagé dans toute l'application" />
        <div style={{ padding: "20px" }}>
          <p style={{ fontSize: 13.5, color: MUT, marginBottom: 14 }}>Type d&apos;entité utilisé dans votre organisation</p>

          {/* Entity type chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
            {ENTITY_TYPES.map((et) => {
              const isSelected = form.entityType === et.id;
              return (
                <button
                  key={et.id}
                  onClick={() => handleEntitySelect(et)}
                  style={{
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "9px 18px", borderRadius: 24,
                    border: `2px solid ${isSelected ? ACC2 : BD}`,
                    background: isSelected ? ACC2 : WH,
                    color: isSelected ? "#fff" : `var(--ss-text, #1e293b)`,
                    cursor: "pointer", fontSize: 13.5, fontWeight: 700, fontFamily: FONT,
                    transition: "all .14s",
                  }}
                >
                  <span>{et.icon}</span>
                  {et.label}
                </button>
              );
            })}
          </div>

          {/* Singular / Plural inputs */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: MUT, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6 }}>
                Libellé singulier
              </label>
              <input
                style={{ ...inputStyle, width: "100%", boxSizing: "border-box", fontSize: 15, fontWeight: 700 }}
                value={form.entitySingulier}
                onChange={(e) => setForm((f) => ({ ...f, entitySingulier: e.target.value }))}
                placeholder="ex: Projet"
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: MUT, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6 }}>
                Libellé pluriel
              </label>
              <input
                style={{ ...inputStyle, width: "100%", boxSizing: "border-box", fontSize: 15, fontWeight: 700 }}
                value={form.entityPluriel}
                onChange={(e) => setForm((f) => ({ ...f, entityPluriel: e.target.value }))}
                placeholder="ex: Projets"
              />
            </div>
          </div>

          <div style={{ background: `${ACC2}0d`, border: `1px solid ${ACC2}33`, borderRadius: 8, padding: "10px 14px", fontSize: 12.5, color: MUT }}>
            Ce libellé remplacera le terme &quot;Projet&quot; partout dans l&apos;application : dépôt, documents, rapports, tableau de bord, recherche…
          </div>
        </div>
      </SectionCard>

      {/* ── Section 2: Logo ── */}
      <SectionCard>
        <SectionHeader icon="🖼️" title="Logo de l'application" subtitle="affiché dans l'en-tête et les e-mails" />
        <div style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            {/* Preview */}
            <div style={{
              width: 140, height: 80, borderRadius: 10, border: `2px dashed ${BD}`,
              background: BG, display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden", flexShrink: 0,
            }}>
              {form.logo ? (
                <img src={form.logo} alt="Logo" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
              ) : (
                <div style={{ textAlign: "center", color: MUT }}>
                  <div style={{ fontSize: 28 }}>🖼️</div>
                  <div style={{ fontSize: 11, marginTop: 4 }}>Aperçu logo</div>
                </div>
              )}
            </div>

            {/* Upload zone */}
            <div style={{ flex: 1, minWidth: 220 }}>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                style={{ display: "none" }}
                onChange={handleLogoChange}
              />
              <button
                onClick={() => logoInputRef.current?.click()}
                style={{
                  width: "100%", padding: "28px 20px", borderRadius: 10,
                  border: `2px dashed ${BD}`, background: BG,
                  cursor: "pointer", fontFamily: FONT, textAlign: "center",
                  color: MUT, fontSize: 13, transition: "border-color .14s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = ACC2}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = BD}
              >
                <div style={{ fontSize: 22, marginBottom: 6 }}>📤</div>
                <div style={{ fontWeight: 700, color: `var(--ss-text, #1e293b)`, marginBottom: 3 }}>Cliquez pour uploader un logo</div>
                <div style={{ fontSize: 12 }}>PNG, JPG, SVG ou WebP · Max 2 Mo</div>
              </button>
              {form.logo && (
                <button
                  onClick={() => setForm((f) => ({ ...f, logo: null }))}
                  style={{ marginTop: 8, fontSize: 12, color: RED, background: "none", border: "none", cursor: "pointer", fontFamily: FONT, padding: "2px 0" }}
                >
                  × Supprimer le logo
                </button>
              )}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ── Section 3: Thème ── */}
      <SectionCard>
        <SectionHeader icon="🎨" title="Thème de l'interface" subtitle="appliqué immédiatement à toute l'application" />
        <div style={{ padding: "20px" }}>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[
              {
                id: "light",
                label: "Mode clair",
                desc: "Interface claire, idéale en journée",
                preview: { bg: "#f6f4fb", card: "#fff", text: "#1e293b", accent: "#7c3aed", border: "#e3e6ea" },
              },
              {
                id: "dark",
                label: "Mode sombre",
                desc: "Interface sombre, réduit la fatigue visuelle",
                preview: { bg: "#0d1117", card: "#161b22", text: "#c9d1d9", accent: "#a78bfa", border: "#30363d" },
              },
            ].map((th) => {
              const isActive = form.theme === th.id;
              const p = th.preview;
              return (
                <button
                  key={th.id}
                  onClick={() => setForm((f) => ({ ...f, theme: th.id }))}
                  style={{
                    flex: 1, minWidth: 220, padding: 0, border: `2.5px solid ${isActive ? ACC2 : BD}`,
                    borderRadius: 12, background: "transparent", cursor: "pointer", fontFamily: FONT,
                    overflow: "hidden", textAlign: "left",
                    boxShadow: isActive ? `0 0 0 3px ${ACC2}22` : "none",
                    transition: "all .14s",
                  }}
                >
                  {/* Mini preview */}
                  <div style={{ background: p.bg, padding: 14, height: 100, position: "relative", overflow: "hidden" }}>
                    {/* Mini sidebar */}
                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 32, background: "#1a2638" }} />
                    {/* Mini cards */}
                    <div style={{ marginLeft: 40, display: "flex", flexDirection: "column", gap: 6 }}>
                      <div style={{ height: 12, borderRadius: 4, background: p.card, border: `1px solid ${p.border}`, width: "90%" }} />
                      <div style={{ height: 8, borderRadius: 4, background: p.card, border: `1px solid ${p.border}`, width: "70%" }} />
                      <div style={{ height: 18, borderRadius: 4, background: p.accent, width: 48, marginTop: 4 }} />
                    </div>
                    {isActive && (
                      <div style={{ position: "absolute", top: 8, right: 8, width: 22, height: 22, borderRadius: "50%", background: ACC2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#fff", fontWeight: 900 }}>
                        ✓
                      </div>
                    )}
                  </div>
                  {/* Label */}
                  <div style={{ padding: "12px 16px", background: WH, borderTop: `1px solid ${BD}` }}>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: isActive ? ACC2 : `var(--ss-text, #1e293b)`, marginBottom: 2 }}>{th.label}</div>
                    <div style={{ fontSize: 12, color: MUT }}>{th.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </SectionCard>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, paddingTop: 4 }}>
        <Button tone="light" onClick={() => { setForm(DEFAULT_APP_CONFIG); }}>↺ Réinitialiser</Button>
        <Button tone="primary" onClick={handleSave}>
          {saved ? "✓ Paramètres enregistrés" : "💾 Enregistrer les paramètres"}
        </Button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   EmailTemplatesView — Modèles e-mails SoftSign
   ══════════════════════════════════════════════════════════════════ */
const LS_EMAIL_TPL = "ss_emailTemplates";

const SS_EMAIL_DEFAULTS = [
  {
    id: "depot",
    label: "Dépôt document",
    subtitle: "Nouveau doc déposé",
    iconColor: BLUE,
    iconBg: "#eff6ff",
    expediteur: "SoftSign — ne pas répondre <noreply@softsign.mg>",
    objet: "[SoftSign] Nouveau document déposé : {{titre_document}}",
    corps: `Bonjour {{prenom_destinataire}},\n\nUn nouveau document vient d'être déposé sur la plateforme SoftSign et nécessite votre attention.\n\nTitre : {{titre_document}}\nType : {{type_document}}\nDéposé par : {{nom_expediteur}}\nDate de dépôt : {{date_depot}}\nProjet : {{nom_projet}}\n\nMerci de vous connecter à SoftSign pour traiter ce document.\n\n{{lien_acces}}\n\nCordialement,\nL'équipe SoftSign`,
    variables: ["prenom_destinataire", "titre_document", "type_document", "nom_expediteur", "date_depot", "nom_projet", "lien_acces"],
  },
  {
    id: "accuse",
    label: "Accusé de réception",
    subtitle: "Confirmation réception",
    iconColor: GREEN,
    iconBg: "#f0fdf4",
    expediteur: "SoftSign — ne pas répondre <noreply@softsign.mg>",
    objet: "[SoftSign] Accusé de réception : {{titre_document}}",
    corps: `Bonjour {{prenom_destinataire}},\n\nNous vous confirmons la bonne réception du document "{{titre_document}}".\n\nDate de réception : {{date_reception}}\nNuméro de référence : {{ref_document}}\n\nCordialement,\nL'équipe SoftSign`,
    variables: ["prenom_destinataire", "titre_document", "date_reception", "ref_document"],
  },
  {
    id: "validation",
    label: "Validation",
    subtitle: "Demande de validation",
    iconColor: BLUE,
    iconBg: "#eff6ff",
    expediteur: "SoftSign — ne pas répondre <noreply@softsign.mg>",
    objet: "[SoftSign] Demande de validation : {{titre_document}}",
    corps: `Bonjour {{prenom_destinataire}},\n\nVotre validation est requise pour le document "{{titre_document}}".\n\nDéposé par : {{nom_expediteur}}\nDate limite : {{date_echeance}}\n\nMerci de vous connecter à SoftSign pour valider ce document.\n\n{{lien_acces}}\n\nCordialement,\nL'équipe SoftSign`,
    variables: ["prenom_destinataire", "titre_document", "nom_expediteur", "date_echeance", "lien_acces"],
  },
  {
    id: "relance",
    label: "Relance",
    subtitle: "Action en attente",
    iconColor: ORANGE,
    iconBg: "#fffbeb",
    expediteur: "SoftSign — ne pas répondre <noreply@softsign.mg>",
    objet: "[SoftSign] Rappel — action requise : {{titre_document}}",
    corps: `Bonjour {{prenom_destinataire}},\n\nUne action de votre part est toujours en attente concernant le document "{{titre_document}}".\n\nRelance n° : {{numero_relance}}\nDate limite : {{date_echeance}}\n\nMerci de traiter ce document au plus vite.\n\n{{lien_acces}}\n\nCordialement,\nL'équipe SoftSign`,
    variables: ["prenom_destinataire", "titre_document", "numero_relance", "date_echeance", "lien_acces"],
  },
  {
    id: "otp",
    label: "OTP",
    subtitle: "Code de signature",
    iconColor: ACC2,
    iconBg: "#f5f3ff",
    expediteur: "SoftSign — ne pas répondre <noreply@softsign.mg>",
    objet: "[SoftSign] Votre code de signature : {{code_otp}}",
    corps: `Bonjour {{prenom_destinataire}},\n\nVotre code de signature à usage unique est :\n\n{{code_otp}}\n\nCe code est valable {{duree_validite}} minutes.\nNe le communiquez à personne.\n\nCordialement,\nL'équipe SoftSign`,
    variables: ["prenom_destinataire", "code_otp", "duree_validite"],
  },
  {
    id: "validation_finale",
    label: "Validation finale",
    subtitle: "Document signé",
    iconColor: GREEN,
    iconBg: "#f0fdf4",
    expediteur: "SoftSign — ne pas répondre <noreply@softsign.mg>",
    objet: "[SoftSign] Document signé : {{titre_document}}",
    corps: `Bonjour {{prenom_destinataire}},\n\nLe document "{{titre_document}}" a été signé et validé par toutes les parties.\n\nDate de signature : {{date_signature}}\nSigné par : {{signataires}}\n\nVous pouvez télécharger le document signé via le lien ci-dessous.\n\n{{lien_acces}}\n\nCordialement,\nL'équipe SoftSign`,
    variables: ["prenom_destinataire", "titre_document", "date_signature", "signataires", "lien_acces"],
  },
  {
    id: "rejet",
    label: "Rejet",
    subtitle: "Document rejeté",
    iconColor: RED,
    iconBg: "#fef2f2",
    expediteur: "SoftSign — ne pas répondre <noreply@softsign.mg>",
    objet: "[SoftSign] Document rejeté : {{titre_document}}",
    corps: `Bonjour {{prenom_destinataire}},\n\nLe document "{{titre_document}}" a été rejeté.\n\nMotif du rejet : {{motif_rejet}}\nRejeté par : {{nom_validateur}}\nDate : {{date_rejet}}\n\nMerci de corriger le document et de le soumettre à nouveau.\n\n{{lien_acces}}\n\nCordialement,\nL'équipe SoftSign`,
    variables: ["prenom_destinataire", "titre_document", "motif_rejet", "nom_validateur", "date_rejet", "lien_acces"],
  },
];

function loadEmailTemplates() {
  try {
    const stored = localStorage.getItem(LS_EMAIL_TPL);
    if (!stored) return SS_EMAIL_DEFAULTS.map((t) => ({ ...t }));
    const parsed = JSON.parse(stored);
    return SS_EMAIL_DEFAULTS.map((def) => {
      const saved = parsed.find((p) => p.id === def.id);
      return saved ? { ...def, expediteur: saved.expediteur, objet: saved.objet, corps: saved.corps } : { ...def };
    });
  } catch { return SS_EMAIL_DEFAULTS.map((t) => ({ ...t })); }
}

function saveEmailTemplates(templates) {
  try {
    localStorage.setItem(LS_EMAIL_TPL, JSON.stringify(templates.map(({ id, expediteur, objet, corps }) => ({ id, expediteur, objet, corps }))));
  } catch {}
}

function renderEmailPreview(corps, objet) {
  const highlight = (text) =>
    text.replace(/\{\{(\w+)\}\}/g, (_, v) =>
      `<mark style="background:#ede9fe;color:#6d28d9;padding:1px 5px;border-radius:4px;font-family:monospace;font-size:12px">{{${v}}}</mark>`
    );
  const lines = corps.split("\n");
  return lines.map((line, i) => `<p key="${i}" style="margin:0 0 6px">${highlight(line) || "&nbsp;"}</p>`).join("");
}

function EmailTemplatesView({ setView }) {
  const [templates, setTemplates] = useState(() => loadEmailTemplates());
  const [selectedId, setSelectedId] = useState("depot");
  const [tab, setTab] = useState("edition");
  const [saved, setSaved] = useState(false);
  const bodyRef = useRef(null);

  const tpl = templates.find((t) => t.id === selectedId) || templates[0];

  const updateTpl = (field, value) => {
    setTemplates((prev) => prev.map((t) => t.id === selectedId ? { ...t, [field]: value } : t));
  };

  const handleSave = () => {
    saveEmailTemplates(templates);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    const def = SS_EMAIL_DEFAULTS.find((d) => d.id === selectedId);
    if (!def) return;
    setTemplates((prev) => prev.map((t) => t.id === selectedId ? { ...t, expediteur: def.expediteur, objet: def.objet, corps: def.corps } : t));
  };

  const insertVariable = (varName) => {
    const tag = `{{${varName}}}`;
    const el = bodyRef.current;
    if (!el) { updateTpl("corps", tpl.corps + tag); return; }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const newVal = tpl.corps.slice(0, start) + tag + tpl.corps.slice(end);
    updateTpl("corps", newVal);
    setTimeout(() => { el.focus(); el.setSelectionRange(start + tag.length, start + tag.length); }, 0);
  };

  const applyFormat = (prefix, suffix = prefix) => {
    const el = bodyRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const sel = tpl.corps.slice(start, end);
    const newVal = tpl.corps.slice(0, start) + prefix + sel + suffix + tpl.corps.slice(end);
    updateTpl("corps", newVal);
    setTimeout(() => { el.focus(); el.setSelectionRange(start + prefix.length, end + prefix.length); }, 0);
  };

  const insertLine = () => {
    const el = bodyRef.current;
    if (!el) return;
    const pos = el.selectionStart;
    const newVal = tpl.corps.slice(0, pos) + "\n────────────────────────────────\n" + tpl.corps.slice(pos);
    updateTpl("corps", newVal);
  };

  const iconStyles = {
    depot:            { bg: "#eff6ff", color: BLUE },
    accuse:           { bg: "#f0fdf4", color: GREEN },
    validation:       { bg: "#eff6ff", color: BLUE },
    relance:          { bg: "#fffbeb", color: ORANGE },
    otp:              { bg: "#f5f3ff", color: ACC2 },
    validation_finale:{ bg: "#f0fdf4", color: GREEN },
    rejet:            { bg: "#fef2f2", color: RED },
  };

  const emojiMap = { depot: "📤", accuse: "✅", validation: "🔄", relance: "🔔", otp: "🔑", validation_finale: "✅", rejet: "❌" };

  return (
    <div style={{ fontFamily: FONT, display: "flex", gap: 0, height: "calc(100vh - 80px)", overflow: "hidden" }}>

      {/* Left panel — template list */}
      <div style={{ width: 232, flexShrink: 0, background: WH, borderRight: `1px solid ${BD}`, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "14px 16px 10px", borderBottom: `1px solid ${BD}` }}>
          <div style={{ fontSize: 9.5, fontWeight: 900, letterSpacing: ".1em", textTransform: "uppercase", color: MUT }}>
            {templates.length} MODÈLES
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {templates.map((t) => {
            const isActive = t.id === selectedId;
            const ic = iconStyles[t.id] || { bg: "#f5f5f5", color: MUT };
            return (
              <button
                key={t.id}
                onClick={() => { setSelectedId(t.id); setTab("edition"); }}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 16px", border: "none", borderLeft: isActive ? `3px solid ${ACC2}` : "3px solid transparent",
                  background: isActive ? `${ACC2}0d` : "transparent", cursor: "pointer", textAlign: "left",
                  borderBottom: `1px solid ${BD}`, fontFamily: FONT,
                }}
              >
                <div style={{ width: 34, height: 34, borderRadius: 8, background: ic.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16 }}>
                  {emojiMap[t.id]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: isActive ? 800 : 600, color: isActive ? ACC2 : "#1e293b", lineHeight: 1.3 }}>{t.label}</div>
                  <div style={{ fontSize: 11, color: MUT, marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.subtitle}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right panel — editor */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#f8f9fc" }}>

        {/* Header */}
        <div style={{ padding: "14px 24px", background: WH, borderBottom: `1px solid ${BD}`, display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: (iconStyles[tpl.id] || {}).bg || "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
            {emojiMap[tpl.id]}
          </div>
          <div style={{ fontSize: 17, fontWeight: 900, color: "#1e293b", flex: 1 }}>{tpl.label}</div>
          <button
            onClick={() => setTab(tab === "apercu" ? "edition" : "apercu")}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 7, border: `1px solid ${BD}`, background: WH, cursor: "pointer", fontSize: 12.5, fontWeight: 700, color: MUT, fontFamily: FONT }}
          >
            👁 Aperçu
          </button>
          <Button tone="primary" onClick={handleSave}>
            {saved ? "✓ Enregistré" : "💾 Enregistrer"}
          </Button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", background: WH, borderBottom: `1px solid ${BD}`, flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 0 }}>
            {["edition", "apercu"].map((t) => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "10px 18px", border: "none", borderBottom: `2.5px solid ${tab === t ? ACC2 : "transparent"}`,
                background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: tab === t ? 800 : 500,
                color: tab === t ? ACC2 : MUT, fontFamily: FONT, textTransform: "capitalize",
              }}>
                {t === "edition" ? "Édition" : "Aperçu"}
              </button>
            ))}
          </div>
          {tab === "edition" && (
            <span style={{ fontSize: 11.5, color: MUT, fontStyle: "italic" }}>Cliquez sur une variable pour l&apos;insérer dans le corps</span>
          )}
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>

          {tab === "edition" ? (
            <>
              {/* Expéditeur */}
              <div style={{ background: WH, border: `1px solid ${BD}`, borderRadius: 10, overflow: "hidden" }}>
                <div style={{ padding: "10px 16px 6px", borderBottom: `1px solid ${BD}` }}>
                  <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: ".1em", textTransform: "uppercase", color: MUT }}>Expéditeur affiché</span>
                </div>
                <div style={{ padding: "10px 16px 14px" }}>
                  <input
                    style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }}
                    value={tpl.expediteur}
                    onChange={(e) => updateTpl("expediteur", e.target.value)}
                  />
                </div>
              </div>

              {/* Objet */}
              <div style={{ background: WH, border: `1px solid ${BD}`, borderRadius: 10, overflow: "hidden" }}>
                <div style={{ padding: "10px 16px 6px", borderBottom: `1px solid ${BD}` }}>
                  <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: ".1em", textTransform: "uppercase", color: MUT }}>Objet de l&apos;e-mail</span>
                </div>
                <div style={{ padding: "10px 16px 14px" }}>
                  <input
                    style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }}
                    value={tpl.objet}
                    onChange={(e) => updateTpl("objet", e.target.value)}
                  />
                </div>
              </div>

              {/* Corps */}
              <div style={{ background: WH, border: `1px solid ${BD}`, borderRadius: 10, overflow: "hidden", flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "10px 16px 6px", borderBottom: `1px solid ${BD}` }}>
                  <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: ".1em", textTransform: "uppercase", color: MUT }}>Corps du message</span>
                </div>
                {/* Mini toolbar */}
                <div style={{ display: "flex", gap: 6, padding: "8px 16px", borderBottom: `1px solid ${BD}`, flexWrap: "wrap" }}>
                  {[
                    { label: "G", title: "Gras", action: () => applyFormat("**") },
                    { label: "I", title: "Italique", action: () => applyFormat("_") },
                    { label: "S", title: "Barré", action: () => applyFormat("~~") },
                    { label: "— Ligne", title: "Insérer une ligne de séparation", action: insertLine },
                  ].map((btn) => (
                    <button key={btn.label} onClick={btn.action} title={btn.title} style={{
                      padding: "4px 10px", border: `1px solid ${BD}`, borderRadius: 5,
                      background: WH, cursor: "pointer", fontSize: 12.5, fontWeight: 700,
                      color: "#374151", fontFamily: FONT,
                    }}>
                      {btn.label}
                    </button>
                  ))}
                </div>
                <textarea
                  ref={bodyRef}
                  value={tpl.corps}
                  onChange={(e) => updateTpl("corps", e.target.value)}
                  style={{
                    flex: 1, minHeight: 280, border: "none", outline: "none", resize: "none",
                    padding: "14px 16px", fontFamily: "monospace", fontSize: 13, lineHeight: 1.7,
                    color: "#1e293b", background: "transparent",
                  }}
                />
              </div>

              {/* Variables */}
              <div style={{ background: WH, border: `1px solid ${BD}`, borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: ".1em", textTransform: "uppercase", color: MUT, marginBottom: 10 }}>
                  Variables disponibles
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {tpl.variables.map((v) => (
                    <button
                      key={v}
                      onClick={() => insertVariable(v)}
                      title={`Insérer {{${v}}}`}
                      style={{
                        padding: "4px 10px", borderRadius: 6, border: `1px solid ${ACC2}44`,
                        background: `${ACC2}0d`, color: ACC2, fontSize: 12, fontWeight: 700,
                        cursor: "pointer", fontFamily: "monospace",
                      }}
                    >
                      {`{{${v}}}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 4 }}>
                <Button tone="light" onClick={handleReset}>↺ Réinitialiser</Button>
                <Button tone="primary" onClick={handleSave}>
                  {saved ? "✓ Modifications enregistrées" : "💾 Enregistrer les modifications"}
                </Button>
              </div>
            </>
          ) : (
            /* ── APERÇU ── */
            <div style={{ background: WH, border: `1px solid ${BD}`, borderRadius: 10, overflow: "hidden", flex: 1 }}>
              <div style={{ background: "#f3f4f6", padding: "10px 20px", borderBottom: `1px solid ${BD}`, display: "flex", gap: 20, flexWrap: "wrap" }}>
                <span style={{ fontSize: 12.5, color: MUT }}><strong style={{ color: "#374151" }}>De :</strong> {tpl.expediteur}</span>
                <span style={{ fontSize: 12.5, color: MUT }}><strong style={{ color: "#374151" }}>Objet :</strong> <span dangerouslySetInnerHTML={{ __html: tpl.objet.replace(/\{\{(\w+)\}\}/g, (_, v) => `<mark style="background:#ede9fe;color:#6d28d9;padding:1px 4px;border-radius:3px;font-family:monospace;font-size:11px">{{${v}}}</mark>`) }} /></span>
              </div>
              <div style={{ padding: "20px 24px", fontFamily: "Georgia,serif", fontSize: 14, lineHeight: 1.8, color: "#1e293b" }}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: tpl.corps
                      .replace(/\{\{(\w+)\}\}/g, (_, v) => `<mark style="background:#ede9fe;color:#6d28d9;padding:2px 6px;border-radius:4px;font-family:monospace;font-size:12px">{{${v}}}</mark>`)
                      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                      .replace(/_(.+?)_/g, "<em>$1</em>")
                      .replace(/~~(.+?)~~/g, "<del>$1</del>")
                      .split("\n")
                      .map((line) => line ? `<p style="margin:0 0 6px">${line}</p>` : `<p style="margin:0 0 6px">&nbsp;</p>`)
                      .join(""),
                  }}
                />
              </div>
              <div style={{ borderTop: `1px solid ${BD}`, padding: "10px 24px", background: "#f9fafb", fontSize: 11, color: MUT, textAlign: "center" }}>
                Les variables en <mark style={{ background: "#ede9fe", color: "#6d28d9", padding: "1px 5px", borderRadius: 3, fontFamily: "monospace" }}>{"{{accolades}}"}</mark> seront remplacées par les valeurs réelles lors de l&apos;envoi.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NouvelUtilisateurView({ projets, users = [], setUsers, setView, license = {} }) {
  const [form, setForm] = useState({
    nom: "", email: "", telephone: "", fonction: "",
    username: "", password: "", role: "standard", statut: "actif",
    site: "", projet: "", receveur: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  function pwdStrength(pwd) {
    if (!pwd) return null;
    const score = [/[A-Z]/, /[a-z]/, /[0-9]/, /[^A-Za-z0-9]/].filter(r => r.test(pwd)).length;
    if (pwd.length >= 12 && score >= 4) return { label: "Élevée", color: GREEN, pct: 100 };
    if (pwd.length >= 8 && score >= 2) return { label: "Moyenne", color: ORANGE, pct: 66 };
    return { label: "Faible", color: RED, pct: 33 };
  }

  const ROLE_DESCS = {
    superadmin: "Super Admin : possède tous les droits d'administration de la plateforme.",
    admin: "Admin : gère les utilisateurs et les paramètres au niveau de son périmètre.",
    standard: "Standard : accès lecture/écriture aux documents assignés, sans droits d'administration.",
    readonly: "Lecture seule : accès consultatif uniquement, sans possibilité de modification.",
  };

  const allSites = [...new Set((projets || []).flatMap(p => p.sites || []))].sort();
  const str = pwdStrength(form.password);

  function handleSubmit() {
    if (license.quotaBlock && users.length >= Number(license.userQuota || 0)) {
      alert(`Quota utilisateurs atteint (${license.userQuota}). Augmentez la limite avant de creer un utilisateur.`);
      return;
    }
    const errs = {};
    if (!form.nom.trim()) errs.nom = true;
    if (!form.email.trim()) errs.email = true;
    if (!form.username.trim()) errs.username = true;
    if (!form.password.trim()) errs.password = true;
    if (!form.site) errs.site = true;
    if (!form.projet) errs.projet = true;
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const ROLE_LABELS = { superadmin: "Super Admin", admin: "Admin", standard: "Standard", readonly: "Lecture seule" };
    const newUser = {
      id: `U${Date.now()}`,
      nom: form.nom.trim(),
      init: form.nom.trim().split(" ").map(w => w[0] || "").join("").slice(0, 2).toUpperCase(),
      role: ROLE_LABELS[form.role] || "Standard",
      systemRole: form.role,
      site: form.site,
      email: form.email.trim(),
      telephone: form.telephone,
      fonction: form.fonction,
      username: form.username.trim(),
      actif: form.statut === "actif",
      droits: { receveurFourn: form.receveur },
      projets: form.projet ? [{ pid: form.projet, sites: [form.site].filter(Boolean) }] : [],
    };
    setUsers(p => [...p, newUser]);
    setView("ss-admin-users");
  }

  const inp = (extra = {}) => ({ ...inputStyle, ...extra });
  const section = { background: WH, border: `1px solid ${BD}`, borderRadius: 10, overflow: "hidden", marginBottom: 16 };
  const secHead = { padding: "14px 20px", borderBottom: `2px solid ${ACC2}`, fontSize: 14, fontWeight: 800, color: "#0f172a" };
  const secBody = { padding: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 24px" };

  return (
    <div style={{ fontFamily: FONT, maxWidth: 960, width: "100%" }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: 12, color: MUT, marginBottom: 14, display: "flex", alignItems: "center", gap: 5 }}>
        <span>Tableau de bord</span><span>›</span>
        <span>SoftSign</span><span>›</span>
        <span style={{ cursor: "pointer", color: ACC2, fontWeight: 600 }} onClick={() => setView("ss-admin-users")}>Utilisateurs</span>
        <span>›</span>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>Nouvel utilisateur</span>
      </div>

      {/* Page header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#0f172a", letterSpacing: "-.3px" }}>Nouvel utilisateur</div>
          <div style={{ fontSize: 13, color: MUT, marginTop: 3 }}>Créez un nouveau compte utilisateur et définissez ses droits d'accès à la plateforme.</div>
        </div>
        <Button tone="primary" onClick={handleSubmit}>Créer l'utilisateur</Button>
      </div>

      {/* Informations personnelles */}
      <div style={section}>
        <div style={secHead}>Informations personnelles</div>
        <div style={secBody}>
          <Field label="Nom complet" required>
            <input style={inp({ borderColor: errors.nom ? RED : BD })} value={form.nom} onChange={e => setForm(p => ({ ...p, nom: e.target.value }))} placeholder="Ex : Jean Rakoto" />
          </Field>
          <Field label="Email" required>
            <div style={{ position: "relative" }}>
              <input type="email" style={inp({ paddingRight: 36, borderColor: errors.email ? RED : BD })} value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="Ex : jean.rakoto@example.com" />
              <span style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", color: MUT, fontSize: 15, pointerEvents: "none" }}>@</span>
            </div>
          </Field>
          <Field label={<>Téléphone <span style={{ fontSize: 11, color: MUT, fontWeight: 400 }}>(facultatif)</span></>}>
            <input style={inp()} value={form.telephone} onChange={e => setForm(p => ({ ...p, telephone: e.target.value }))} placeholder="Ex : +261 34 00 000 00" />
          </Field>
          <Field label="Fonction">
            <input style={inp()} value={form.fonction} onChange={e => setForm(p => ({ ...p, fonction: e.target.value }))} placeholder="Ex : Directeur Financier" />
          </Field>
        </div>
      </div>

      {/* Compte & sécurité */}
      <div style={section}>
        <div style={secHead}>Compte &amp; sécurité</div>
        <div style={secBody}>
          <Field label="Nom d'utilisateur" required>
            <input style={inp({ borderColor: errors.username ? RED : BD })} value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} placeholder="Ex : jrakoto" />
          </Field>
          <Field label="Mot de passe" required>
            <div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  style={inp({ paddingRight: 38, borderColor: str ? str.color : errors.password ? RED : BD, borderBottomLeftRadius: str ? 0 : 8, borderBottomRightRadius: str ? 0 : 8 })}
                  value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="••••••••••••"
                />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: MUT, padding: 2, lineHeight: 1 }}>
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
              {str && (
                <>
                  <div style={{ height: 3, background: "#e2e8f0", borderRadius: "0 0 4px 4px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${str.pct}%`, background: str.color, transition: "width .3s,background .3s" }} />
                  </div>
                  <div style={{ fontSize: 11.5, color: str.color, fontWeight: 700, marginTop: 4 }}>Robustesse : {str.label}</div>
                </>
              )}
            </div>
          </Field>
          <div>
            <Field label="Rôle" required>
              <select style={inp({ appearance: "auto" })} value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
                <option value="standard">Standard</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
                <option value="readonly">Lecture seule</option>
              </select>
            </Field>
            <div style={{ marginTop: 7, padding: "9px 13px", background: "#f8fafc", borderRadius: 7, border: `1px solid ${BD}`, fontSize: 12, color: "#475569", lineHeight: 1.5 }}>
              {ROLE_DESCS[form.role]}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: "#334155", marginBottom: 8 }}>Statut</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" onClick={() => setForm(p => ({ ...p, statut: "actif" }))}
                style={{ padding: "7px 18px", borderRadius: 20, border: `2px solid ${form.statut === "actif" ? GREEN : BD}`, background: form.statut === "actif" ? "#f0fdf4" : WH, color: form.statut === "actif" ? GREEN : MUT, fontSize: 13, fontWeight: form.statut === "actif" ? 800 : 500, cursor: "pointer", fontFamily: FONT, display: "flex", alignItems: "center", gap: 6 }}>
                {form.statut === "actif" && <span style={{ width: 8, height: 8, borderRadius: "50%", background: GREEN, display: "inline-block" }} />}
                Actif
              </button>
              <button type="button" onClick={() => setForm(p => ({ ...p, statut: "inactif" }))}
                style={{ padding: "7px 18px", borderRadius: 20, border: `2px solid ${form.statut === "inactif" ? "#94a3b8" : BD}`, background: WH, color: form.statut === "inactif" ? "#374151" : MUT, fontSize: 13, fontWeight: form.statut === "inactif" ? 700 : 500, cursor: "pointer", fontFamily: FONT }}>
                Inactif
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Affectation */}
      <div style={section}>
        <div style={secHead}>Affectation</div>
        <div style={secBody}>
          <Field label="Site" required>
            <select style={inp({ appearance: "auto", borderColor: errors.site ? RED : BD })} value={form.site} onChange={e => setForm(p => ({ ...p, site: e.target.value }))}>
              <option value="">Sélectionner un site...</option>
              {allSites.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Projet" required>
            <select style={inp({ appearance: "auto", borderColor: errors.projet ? RED : BD })} value={form.projet} onChange={e => setForm(p => ({ ...p, projet: e.target.value }))}>
              <option value="">Sélectionner un projet...</option>
              {(projets || []).map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}
            </select>
          </Field>
        </div>
      </div>

      {/* Droits documentaires */}
      <div style={section}>
        <div style={secHead}>Droits documentaires</div>
        <div style={{ padding: "20px" }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: "#334155", marginBottom: 12 }}>Receveur de documents</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <OtpToggle checked={form.receveur} onChange={v => setForm(p => ({ ...p, receveur: v }))} />
            <span style={{ fontSize: 13, color: form.receveur ? "#065f46" : MUT }}>
              {form.receveur ? "Activé — cet utilisateur peut recevoir des documents en tant que destinataire." : "Désactivé — cet utilisateur ne recevra pas de documents."}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 16, borderTop: `1px solid ${BD}` }}>
        <Button tone="light" onClick={() => setView("ss-admin-users")}>Annuler</Button>
        <Button tone="primary" onClick={handleSubmit}>Créer l'utilisateur</Button>
      </div>
    </div>
  );
}

function AdminPanel({ defaultTab = "users", users, setUsers, userSettings = {}, setUserSettings, license, setLicense, projets, docs, audit, setView }) {
  const [tab, setTab] = useState(defaultTab);
  const [saved, setSaved] = useState(false);
  const [licenseDraft, setLicenseDraft] = useState(() => ({ ...license }));
  const [searchUser, setSearchUser] = useState("");
  const [selectedRoleForPerms, setSelectedRoleForPerms] = useState(null);
  const [rolePerms, setRolePerms] = useState(() => {
    try { const v = localStorage.getItem("ss_rolePerms"); return v ? JSON.parse(v) : JSON.parse(JSON.stringify(SS_DEFAULT_ROLE_PERMS)); } catch { return JSON.parse(JSON.stringify(SS_DEFAULT_ROLE_PERMS)); }
  });
  useEffect(() => {
    try {
      localStorage.setItem("ss_rolePerms", JSON.stringify(rolePerms));
      window.dispatchEvent(new CustomEvent("ss-role-perms-change"));
    } catch {}
  }, [rolePerms]);
  useEffect(() => setLicenseDraft({ ...license }), [license]);

  const usedSites = [...new Set(projets.flatMap((p) => p.sites || []))].length;

  function isReceiver(u) {
    if (userSettings[u.id]?.receveurFourn !== undefined) return userSettings[u.id].receveurFourn;
    return u.droits?.receveurFourn || false;
  }
  function toggleReceiver(u) {
    setUserSettings((p) => ({ ...p, [u.id]: { ...(p[u.id] || {}), receveurFourn: !isReceiver(u) } }));
  }

  const expiryStr = licenseDraft.expiration || "";
  const expiryDate = expiryStr ? new Date(expiryStr.split("/").reverse().join("-")) : null;
  const daysLeft = expiryDate ? Math.ceil((expiryDate - Date.now()) / 86400000) : null;
  const licActive = !expiryDate || daysLeft > 0;

  const ROLES_DEF = [
    {
      id: "superadmin", label: "Super Admin", color: ACC2, bg: "#f5f3ff",
      desc: "Possède tous les droits d'administration de la plateforme.",
      perms: ["Gestion complète de l'application", "Création et gestion des administrateurs", "Définition du nombre d'utilisateurs autorisés", "Définition des projets et sites autorisés", "Paramétrage global du système", "Suivi des licences et quotas"],
    },
    {
      id: "admin", label: "Admin", color: BLUE, bg: "#eff6ff",
      desc: "Gère les utilisateurs et les paramètres au niveau de son périmètre d'administration.",
      perms: ["Gestion des utilisateurs de son périmètre", "Configuration des workflows", "Gestion des signatures et délégations", "Accès aux rapports et journaux", "Paramétrage des notifications"],
    },
    {
      id: "standard", label: "Standard", color: GREEN, bg: "#f0fdf4",
      desc: "Utilise les fonctionnalités opérationnelles de l'application.",
      perms: ["Dépôt et signature de documents", "Validation selon workflow assigné", "Consultation de ses propres documents", "Gestion de ses délégations", "Réception de notifications"],
    },
    {
      id: "readonly", label: "Lecture seule", color: "#94a3b8", bg: "#f8fafc",
      desc: "Permet un accès consultatif sans possibilité de modification.",
      perms: ["Consultation des documents (lecture seule)", "Visualisation des workflows", "Accès aux rapports en lecture"],
    },
  ];

  function getRoleMeta(roleId) {
    return { superadmin: { label: "Super Admin", color: ACC2 }, admin: { label: "Admin", color: BLUE }, standard: { label: "Standard", color: GREEN }, readonly: { label: "Lecture seule", color: "#94a3b8" } }[roleId] || { label: roleId || "—", color: MUT };
  }

  const TABS = [
    { key: "users", label: "Utilisateurs" },
    { key: "roles", label: "Rôles" },
    { key: "params", label: "Paramètres" },
    { key: "license", label: "Licences & quotas" },
    { key: "journaux", label: "Journaux" },
  ];
  const tabTitles = { users: "Utilisateurs", roles: "Rôles & permissions", params: "Paramètres", license: "Licences & quotas", journaux: "Journaux système" };

  const filteredUsers = users.filter((u) =>
    !searchUser || u.nom?.toLowerCase().includes(searchUser.toLowerCase()) || u.email?.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div style={{ fontFamily: FONT, width: "100%" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", letterSpacing: "-.3px" }}>Administration</div>
        <div style={{ fontSize: 13, color: MUT, marginTop: 2 }}>Paramétrage de la plateforme SoftSign — {tabTitles[tab]}</div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: `2px solid ${BD}`, marginBottom: 24 }}>
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding: "10px 20px", border: "none", borderBottom: tab === key ? `2px solid ${ACC2}` : "2px solid transparent",
            marginBottom: -2, background: "transparent", cursor: "pointer", fontFamily: FONT,
            fontSize: 13.5, fontWeight: tab === key ? 800 : 500, color: tab === key ? ACC2 : "#64748b",
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab: Utilisateurs ── */}
      {tab === "users" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, maxWidth: 360, background: WH, border: `1px solid ${BD}`, borderRadius: 9, padding: "8px 12px" }}>
              <span style={{ color: MUT }}>🔍</span>
              <input value={searchUser} onChange={(e) => setSearchUser(e.target.value)} placeholder="Rechercher un utilisateur..." style={{ border: "none", outline: "none", fontSize: 13, fontFamily: FONT, flex: 1, color: "#374151" }} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <span style={{ padding: "8px 14px", background: "#f8fafc", border: `1px solid ${BD}`, borderRadius: 8, fontSize: 12.5, fontWeight: 700, color: MUT }}>{users.length} utilisateur{users.length !== 1 ? "s" : ""}</span>
              <Button tone="primary" onClick={() => setView("ss-admin-user-new")}>+ Nouvel utilisateur</Button>
            </div>
          </div>
          {(() => {
            const receivers = users.filter(isReceiver);
            return (
              <div style={{ padding: "12px 16px", marginBottom: 14, borderRadius: 10, background: receivers.length ? "#f0fdf4" : "#fffbeb", border: `1px solid ${receivers.length ? "#bbf7d0" : "#fde68a"}`, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 18 }}>{receivers.length ? "📥" : "⚠️"}</span>
                <div>
                  <b style={{ fontSize: 13, color: receivers.length ? "#065f46" : "#92400e" }}>
                    {receivers.length ? `${receivers.length} receveur(s) de documents externes configuré(s)` : "Aucun receveur de documents externes défini"}
                  </b>
                  <div style={{ fontSize: 12, color: MUT, marginTop: 1 }}>
                    {receivers.length ? receivers.map((u) => u.nom).join(", ") : "Cochez au moins un utilisateur pour recevoir les dépôts du portail fournisseur."}
                  </div>
                </div>
              </div>
            );
          })()}
          <Card style={{ overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Utilisateur", "Email", "Rôle", "Receveur documents", "Statut", "Actions"].map((h) => (
                    <th key={h} style={{ padding: "11px 14px", textAlign: "left", color: MUT, fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".05em", borderBottom: `1px solid ${BD}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u, i) => {
                  const recv = isReceiver(u);
                  const rm = getRoleMeta(u.systemRole || u.role);
                  const actif = u.actif !== false;
                  return (
                    <tr key={u.id} style={{ borderTop: `1px solid ${BD}`, background: i % 2 === 0 ? WH : "#fafbfd" }}>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <MiniAvatar name={u.nom} />
                          <div>
                            <div style={{ fontWeight: 800, fontSize: 13, color: "#0f172a" }}>{u.nom}</div>
                            {recv && <span style={{ fontSize: 10, fontWeight: 800, color: GREEN, background: "#dcfce7", border: "1px solid #bbf7d0", borderRadius: 20, padding: "1px 7px" }}>Receveur</span>}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 12.5, color: MUT }}>{u.email}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{ fontSize: 11.5, fontWeight: 800, padding: "3px 10px", borderRadius: 20, background: `${rm.color}18`, color: rm.color, border: `1px solid ${rm.color}33` }}>{rm.label}</span>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                          <OtpToggle checked={recv} onChange={() => toggleReceiver(u)} />
                          <span style={{ fontSize: 12, color: recv ? GREEN : MUT, fontWeight: recv ? 700 : 400 }}>{recv ? "Oui" : "Non"}</span>
                        </label>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{ fontSize: 11.5, fontWeight: 800, padding: "3px 10px", borderRadius: 20, background: actif ? "#f0fdf4" : "#fef2f2", color: actif ? GREEN : RED, border: `1px solid ${actif ? "#bbf7d0" : "#fecaca"}` }}>
                          {actif ? "Actif" : "Inactif"}
                        </span>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${BD}`, background: WH, cursor: "pointer", fontSize: 11.5, fontWeight: 700, color: "#475569", fontFamily: FONT }}>Modifier</button>
                          <button style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${actif ? "#fecaca" : "#bbf7d0"}`, background: actif ? "#fef2f2" : "#f0fdf4", cursor: "pointer", fontSize: 11.5, fontWeight: 700, color: actif ? RED : GREEN, fontFamily: FONT }}>
                            {actif ? "Désactiver" : "Activer"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredUsers.length === 0 && <div style={{ padding: "30px", textAlign: "center", color: MUT, fontSize: 13 }}>Aucun utilisateur trouvé</div>}
          </Card>
        </div>
      )}

      {/* ── Tab: Rôles ── */}
      {tab === "roles" && !selectedRoleForPerms && (
        <div>
          <div style={{ marginBottom: 16, fontSize: 13, color: MUT, lineHeight: 1.6 }}>
            SoftSign dispose de <b style={{ color: "#374151" }}>quatre niveaux de rôles</b> permettant de gérer les accès et les fonctionnalités selon les responsabilités de chaque utilisateur.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            {ROLES_DEF.map((role) => (
              <Card key={role.id} style={{ overflow: "hidden", borderTop: `4px solid ${role.color}` }}>
                <div style={{ padding: "16px 20px", background: role.bg }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 11.5, fontWeight: 900, padding: "3px 10px", borderRadius: 20, background: `${role.color}22`, color: role.color, border: `1px solid ${role.color}44` }}>{role.label}</span>
                    <span style={{ fontSize: 11.5, color: role.color, fontWeight: 700 }}>
                      {users.filter((u) => (u.systemRole || u.role) === role.id).length} utilisateur(s)
                    </span>
                  </div>
                  <div style={{ fontSize: 12.5, color: "#475569", lineHeight: 1.5 }}>{role.desc}</div>
                </div>
                <div style={{ padding: "14px 20px" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: MUT, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 10 }}>Permissions</div>
                  {role.perms.map((p, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: i < role.perms.length - 1 ? `1px solid ${BD}` : "none" }}>
                      <span style={{ width: 17, height: 17, borderRadius: "50%", background: `${role.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 10, color: role.color, fontWeight: 900 }}>✓</span>
                      <span style={{ fontSize: 12.5, color: "#374151" }}>{p}</span>
                    </div>
                  ))}
                </div>
                <div style={{ padding: "12px 20px", borderTop: `1px solid ${BD}`, display: "flex", justifyContent: "flex-end" }}>
                  <button onClick={() => setSelectedRoleForPerms(role.id)}
                    style={{ padding: "7px 14px", borderRadius: 7, border: `1px solid ${role.color}44`, background: `${role.color}0d`, color: role.color, fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: FONT, display: "flex", alignItems: "center", gap: 6 }}>
                    ⚙ Configurer les autorisations
                  </button>
                </div>
              </Card>
            ))}
          </div>
          <Card style={{ padding: "14px 18px", background: "#f5f3ff", border: `1px solid #ddd6fe`, display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>ℹ️</span>
            <div style={{ fontSize: 12.5, color: "#5b21b6", lineHeight: 1.6 }}>
              <b>Attribution des rôles :</b> Les rôles sont attribués par le Super Admin ou un Admin dans l'onglet <b>Utilisateurs</b>. Un utilisateur ne peut avoir qu'un seul rôle actif. La modification d'un rôle prend effet immédiatement après enregistrement.
            </div>
          </Card>
        </div>
      )}

      {tab === "roles" && selectedRoleForPerms && (() => {
        const roleMeta = ROLES_DEF.find(r => r.id === selectedRoleForPerms);
        if (!roleMeta) return null;
        const perms = rolePerms[selectedRoleForPerms] || JSON.parse(JSON.stringify(SS_DEFAULT_ROLE_PERMS[selectedRoleForPerms] || SS_DEFAULT_ROLE_PERMS.standard));
        const defPerms = SS_DEFAULT_ROLE_PERMS[selectedRoleForPerms] || SS_DEFAULT_ROLE_PERMS.standard;
        return (
          <AutorisationsView
            role={roleMeta}
            perms={perms}
            defaultPerms={defPerms}
            onSave={(updated) => {
              setRolePerms(p => ({ ...p, [selectedRoleForPerms]: updated }));
            }}
            onCancel={() => setSelectedRoleForPerms(null)}
          />
        );
      })()}

      {/* ── Tab: Paramètres ── */}
      {tab === "params" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { icon: "🔐", label: "Paramètres OTP", desc: "Configuration du code à usage unique pour la signature électronique", view: "ss-param-otp" },
            { icon: "🔄", label: "Paramètres Workflow", desc: "Éditeur des modèles de workflow et étapes de validation", view: "ss-wf-modeles" },
            { icon: "✍", label: "Signatures & paraphes", desc: "Configuration des signatures manuscrites et paraphes", view: "ss-param-sign" },
            { icon: "🔔", label: "Notifications", desc: "Paramétrage des alertes, rappels et relances automatiques", view: "ss-relances" },
            { icon: "🔗", label: "Intégration SoftDocs", desc: "Liaison entre SoftSign et le module documentaire SoftDocs", view: "ss-integr-softdocs" },
          ].map(({ icon, label, desc, view: targetView }) => (
            <Card key={label} onClick={() => setView(targetView)} style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#faf8ff")}
              onMouseLeave={(e) => (e.currentTarget.style.background = WH)}>
              <div style={{ width: 42, height: 42, borderRadius: 11, background: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: "#0f172a" }}>{label}</div>
                <div style={{ fontSize: 12.5, color: MUT, marginTop: 2 }}>{desc}</div>
              </div>
              <span style={{ color: MUT, fontSize: 22, fontWeight: 300 }}>›</span>
            </Card>
          ))}
        </div>
      )}

      {/* ── Tab: Licences & quotas ── */}
      {tab === "license" && (
        <div>
          {/* 3 quota cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 20 }}>
            {[
              { label: "Utilisateurs", used: users.length, quota: licenseDraft.userQuota, color: ACC2 },
              { label: "Projets", used: projets.length, quota: licenseDraft.projectQuota, color: GREEN },
              { label: "Sites", used: usedSites, quota: licenseDraft.siteQuota, color: ORANGE },
            ].map(({ label, used, quota, color }) => {
              const slots = quota - used;
              return (
                <Card key={label} style={{ padding: "18px 20px" }}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: MUT, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8 }}>{label}</div>
                  <div style={{ fontSize: 28, fontWeight: 950, color, lineHeight: 1 }}>
                    {used} <span style={{ fontSize: 18, color: "#94a3b8", fontWeight: 500 }}>/ {quota}</span>
                  </div>
                  <div style={{ marginTop: 10, height: 6, borderRadius: 6, background: "#f1f5f9", overflow: "hidden" }}>
                    <div style={{ width: `${Math.min(100, (used / Math.max(quota, 1)) * 100)}%`, height: "100%", background: color, borderRadius: 6 }} />
                  </div>
                  <div style={{ marginTop: 8, fontSize: 12, color: slots <= 1 ? RED : slots <= 3 ? ORANGE : MUT, fontWeight: 600 }}>
                    {slots <= 0 ? "Quota atteint" : `${slots} slot${slots !== 1 ? "s" : ""} disponible${slots !== 1 ? "s" : ""}`}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Informations de licence */}
          <Card style={{ marginBottom: 16, overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: `1px solid ${BD}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <b style={{ fontSize: 14, color: "#0f172a" }}>Informations de licence</b>
              <span style={{ fontSize: 11.5, fontWeight: 900, padding: "4px 14px", borderRadius: 20, background: licActive ? "#f0fdf4" : "#fef2f2", color: licActive ? GREEN : RED, border: `1px solid ${licActive ? "#bbf7d0" : "#fecaca"}` }}>
                {licActive ? "Active" : "Expirée"}
              </span>
            </div>
            <div style={{ padding: "0 20px" }}>
              {[
                { label: "Numéro de licence", value: licenseDraft.number },
                { label: "Type", value: licenseDraft.type },
                { label: "Titulaire", value: licenseDraft.holder },
                { label: "Activation", value: licenseDraft.activation },
                { label: "Expiration", value: licenseDraft.expiration, extra: daysLeft !== null && daysLeft > 0 ? `${daysLeft} jours` : null, extraColor: daysLeft < 30 ? RED : ORANGE },
                { label: "Support", value: licenseDraft.support },
              ].map(({ label, value, extra, extraColor }, i) => (
                <div key={label} style={{ padding: "16px 0", borderBottom: i < 5 ? `1px solid #f1f5f9` : "none", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: MUT, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 5 }}>{label}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <b style={{ fontSize: 14, color: "#0f172a" }}>{value || "—"}</b>
                      {extra && <span style={{ fontSize: 11.5, fontWeight: 800, padding: "2px 9px", borderRadius: 20, background: `${extraColor}18`, color: extraColor, border: `1px solid ${extraColor}44` }}>{extra}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Définition des quotas */}
          <Card style={{ overflow: "hidden", marginBottom: 20 }}>
            <div style={{ padding: "14px 20px", borderBottom: `1px solid ${BD}` }}>
              <b style={{ fontSize: 14, color: "#0f172a" }}>Définition des quotas autorisés</b>
            </div>
            <div style={{ padding: "0 20px" }}>
              {[
                { key: "userQuota", label: "Nombre d'utilisateurs autorisés", used: users.length },
                { key: "projectQuota", label: "Nombre de projets autorisés", used: projets.length },
                { key: "siteQuota", label: "Nombre de sites autorisés", used: usedSites },
              ].map(({ key, label, used }, i) => (
                <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: `1px solid ${BD}` }}>
                  <span style={{ fontSize: 13, color: "#374151" }}>{label}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ fontSize: 12, color: MUT, fontWeight: 600 }}>utilisé : {used}</span>
                    <div style={{ display: "flex" }}>
                      <button onClick={() => setLicenseDraft((p) => ({ ...p, [key]: Math.max(used, p[key] - 1) }))}
                        style={{ width: 32, height: 32, borderRadius: "8px 0 0 8px", border: `1px solid ${BD}`, borderRight: "none", background: WH, cursor: "pointer", fontWeight: 900, fontSize: 18, color: "#374151", fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                      <input type="number" value={licenseDraft[key]}
                        onChange={(e) => setLicenseDraft((p) => ({ ...p, [key]: Math.max(used, Number(e.target.value)) }))}
                        style={{ width: 60, height: 32, border: `1px solid ${BD}`, borderRadius: 0, textAlign: "center", fontWeight: 900, fontSize: 15, fontFamily: FONT, outline: "none", color: "#0f172a" }} />
                      <button onClick={() => setLicenseDraft((p) => ({ ...p, [key]: p[key] + 1 }))}
                        style={{ width: 32, height: 32, borderRadius: "0 8px 8px 0", border: `1px solid ${BD}`, borderLeft: "none", background: WH, cursor: "pointer", fontWeight: 900, fontSize: 18, color: "#374151", fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                    </div>
                  </div>
                </div>
              ))}
              {[
                { key: "quotaAlert", label: "Alerte quota à 80%", desc: "Envoi d'une alerte lorsque le quota atteint 80%" },
                { key: "quotaBlock", label: "Blocage automatique si quota dépassé", desc: "Empêche l'ajout de nouveaux éléments au-delà du quota" },
              ].map(({ key, label, desc }, i) => (
                <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderTop: i === 0 ? "none" : `1px solid ${BD}` }}>
                  <div>
                    <div style={{ fontSize: 13, color: "#374151" }}>{label}</div>
                    <div style={{ fontSize: 11.5, color: MUT, marginTop: 2 }}>{desc}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <OtpToggle checked={!!licenseDraft[key]} onChange={(v) => setLicenseDraft((p) => ({ ...p, [key]: v }))} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: licenseDraft[key] ? ACC2 : MUT, minWidth: 56 }}>
                      {licenseDraft[key] ? "Activé" : "Désactivé"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Bottom actions */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button onClick={() => { setLicenseDraft({ ...license }); setSaved(false); }} style={{ padding: "10px 20px", borderRadius: 9, border: `1px solid ${BD}`, background: WH, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: FONT, color: "#374151" }}>Annuler</button>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {saved && <span style={{ fontSize: 12, fontWeight: 700, color: GREEN, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 20, padding: "5px 14px" }}>✓ Enregistré</span>}
              <button onClick={() => setView("ss-rapports")} style={{ padding: "10px 20px", borderRadius: 9, border: `1px solid ${BD}`, background: WH, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: FONT, color: "#374151", display: "flex", alignItems: "center", gap: 6 }}>Rapport ↗</button>
              <button onClick={() => { setLicense({ ...licenseDraft }); setSaved(true); setTimeout(() => setSaved(false), 2200); }}
                style={{ padding: "10px 24px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#4c1d95,#7c3aed)", color: WH, cursor: "pointer", fontSize: 13, fontWeight: 800, fontFamily: FONT }}>
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Journaux ── */}
      {tab === "journaux" && <AuditView docs={docs} audit={audit} users={users} />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5.1 – Situation par validateur
   ═══════════════════════════════════════════════════════════════ */

function retardIndicator(dueAt, doneAt) {
  if (!dueAt) return { label: "—", color: MUT };
  const ref = doneAt ? new Date(doneAt) : new Date();
  const due = new Date(dueAt);
  const diff = due - ref; // ms remaining (negative = late)
  if (diff < 0) return { label: "🔴 En retard", color: RED };
  if (diff < 2 * 86400000) return { label: "🟠 Proche délai", color: ORANGE };
  return { label: "🟢 Dans les délais", color: GREEN };
}

function fmtDays(ms) {
  if (ms == null || isNaN(ms)) return "—";
  const d = Math.round(Math.abs(ms) / 86400000 * 10) / 10;
  return `${d}j`;
}

function buildValidatorMap(docs, users) {
  const map = {};
  const ensure = (uid, name) => {
    if (!map[uid]) map[uid] = { id: uid, name: name || uid, enInstance: [], traites: [], rejetes: [] };
  };
  docs.forEach((doc) => {
    (doc.steps || []).forEach((step) => {
      const signers = step.signers || [];
      signers.forEach((uid) => {
        const u = (users || []).find((x) => x.id === uid);
        const name = u ? (u.nom || u.name || u.prenom || uid) : (step.doneByName || uid);
        ensure(uid, name);
        const entry = {
          doc,
          step,
          project: doc.projectName || doc.projectId || "—",
          site: doc.site || "—",
          ref: doc.ref,
          title: doc.title,
          type: doc.origin === "externe" ? "Externe" : "Interne",
          expediteur: doc.deposantName || doc.author || "—",
        };
        if (step.status === "active") {
          map[uid].enInstance.push(entry);
        } else if (step.status === "done") {
          map[uid].traites.push(entry);
        } else if (step.status === "rejected") {
          map[uid].rejetes.push({ ...entry, motif: doc.rejection?.reason || step.rejectReason || "—", dateRejet: step.doneAt || doc.rejection?.date });
        }
      });
    });
  });
  return Object.values(map);
}

function avgDelayDays(traites) {
  const vals = traites
    .filter((e) => e.step.dueAt && e.step.doneAt)
    .map((e) => {
      const planned = e.step.durationDays || 1;
      const actual = (new Date(e.step.doneAt) - (new Date(e.step.dueAt) - planned * 86400000)) / 86400000;
      return actual;
    });
  if (!vals.length) return null;
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
}

function ValidateurDetailModal({ validator, onClose }) {
  const [tab, setTab] = useState("instance");
  const TABS = [
    { id: "instance", label: "En instance", count: validator.enInstance.length, color: ORANGE },
    { id: "traites", label: "Traités", count: validator.traites.length, color: GREEN },
    { id: "rejetes", label: "Rejetés", count: validator.rejetes.length, color: RED },
  ];

  const thStyle = { padding: "9px 12px", textAlign: "left", fontSize: 11, fontWeight: 800, color: MUT, textTransform: "uppercase", letterSpacing: ".06em", whiteSpace: "nowrap", background: "var(--ss-card2,#f8f9fc)", borderBottom: `1px solid ${BD}` };
  const tdStyle = { padding: "9px 12px", fontSize: 12.5, color: "var(--ss-text,#1e293b)", borderBottom: `1px solid ${BD}`, verticalAlign: "middle" };

  const inst = validator.enInstance;
  const trait = validator.traites;
  const rej = validator.rejetes;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: WH, borderRadius: 14, width: "min(900px,100%)", maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,.2)" }}>
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BD}`, display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: `${ACC2}22`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, color: ACC2, flexShrink: 0 }}>
            {initials(validator.name)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: "var(--ss-text,#1e293b)" }}>{validator.name}</div>
            <div style={{ fontSize: 11.5, color: MUT }}>Détail des validations</div>
          </div>
          <button onClick={onClose} style={{ border: `1px solid ${BD}`, background: WH, borderRadius: 8, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: MUT }}>✕</button>
        </div>

        {/* KPI row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, padding: "14px 20px", borderBottom: `1px solid ${BD}`, flexShrink: 0 }}>
          {TABS.map((t) => (
            <div key={t.id} style={{ textAlign: "center", padding: 12, borderRadius: 10, background: `${t.color}10`, border: `1px solid ${t.color}30` }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: t.color }}>{t.count}</div>
              <div style={{ fontSize: 11.5, color: MUT, marginTop: 2 }}>{t.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, padding: "10px 20px 0", flexShrink: 0, borderBottom: `1px solid ${BD}` }}>
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "7px 14px", borderRadius: "8px 8px 0 0", border: `1px solid ${tab === t.id ? BD : "transparent"}`, borderBottom: tab === t.id ? `2px solid ${t.color}` : "none", background: tab === t.id ? WH : "transparent", fontFamily: FONT, fontSize: 12.5, fontWeight: 750, color: tab === t.id ? t.color : MUT, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              {t.label}
              <span style={{ background: `${t.color}22`, color: t.color, borderRadius: 10, padding: "1px 7px", fontSize: 11, fontWeight: 900 }}>{t.count}</span>
            </button>
          ))}
        </div>

        {/* Filters placeholder */}
        <div style={{ padding: "8px 20px", borderBottom: `1px solid ${BD}`, flexShrink: 0 }}>
          <button style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, border: `1px solid ${BD}`, background: WH, fontSize: 12, color: MUT, cursor: "default", fontFamily: FONT }}>▽ Filtres</button>
        </div>

        {/* Table */}
        <div style={{ flex: 1, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 750 }}>
            <thead>
              {tab === "instance" && (
                <tr>{["Projet","Site","Référence","Titre","Type","Expéditeur","Durée prévue","Délai restant","Retard"].map((h) => <th key={h} style={thStyle}>{h}</th>)}</tr>
              )}
              {tab === "traites" && (
                <tr>{["Projet","Site","Référence","Titre","Type","Expéditeur","Durée prévue","Durée réelle","Date validation","Retard"].map((h) => <th key={h} style={thStyle}>{h}</th>)}</tr>
              )}
              {tab === "rejetes" && (
                <tr>{["Projet","Site","Référence","Titre","Type","Expéditeur","Date de rejet","Motif de rejet"].map((h) => <th key={h} style={thStyle}>{h}</th>)}</tr>
              )}
            </thead>
            <tbody>
              {tab === "instance" && inst.map((e, i) => {
                const ind = retardIndicator(e.step.dueAt, null);
                const remaining = e.step.dueAt ? new Date(e.step.dueAt) - Date.now() : null;
                return (
                  <tr key={i} style={{ background: i % 2 ? "var(--ss-card2,#f8f9fc)" : WH }}>
                    <td style={tdStyle}><span style={{ background: `${ACC2}18`, color: ACC2, borderRadius: 5, padding: "2px 7px", fontSize: 11, fontWeight: 700 }}>{e.project}</span></td>
                    <td style={tdStyle}>{e.site}</td>
                    <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 11, color: MUT }}>{e.ref}</td>
                    <td style={{ ...tdStyle, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.title}</td>
                    <td style={tdStyle}><span style={{ background: e.type === "Externe" ? `${ORANGE}18` : `${BLUE}18`, color: e.type === "Externe" ? ORANGE : BLUE, borderRadius: 5, padding: "2px 7px", fontSize: 11, fontWeight: 700 }}>{e.type}</span></td>
                    <td style={tdStyle}>{e.expediteur}</td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>{e.step.durationDays ? `${e.step.durationDays}j` : "—"}</td>
                    <td style={{ ...tdStyle, textAlign: "center", fontWeight: 700, color: remaining != null ? (remaining < 0 ? RED : remaining < 2 * 86400000 ? ORANGE : GREEN) : MUT }}>
                      {remaining != null ? (remaining < 0 ? `−${fmtDays(-remaining)}` : fmtDays(remaining)) : "—"}
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 700, color: ind.color, whiteSpace: "nowrap" }}>{ind.label}</td>
                  </tr>
                );
              })}
              {tab === "traites" && trait.map((e, i) => {
                const ind = e.step.dueAt && e.step.doneAt ? retardIndicator(e.step.dueAt, e.step.doneAt) : { label: "—", color: MUT };
                const actualMs = e.step.doneAt && e.step.dueAt
                  ? new Date(e.step.doneAt) - (new Date(e.step.dueAt) - (e.step.durationDays || 1) * 86400000)
                  : null;
                return (
                  <tr key={i} style={{ background: i % 2 ? "var(--ss-card2,#f8f9fc)" : WH }}>
                    <td style={tdStyle}><span style={{ background: `${ACC2}18`, color: ACC2, borderRadius: 5, padding: "2px 7px", fontSize: 11, fontWeight: 700 }}>{e.project}</span></td>
                    <td style={tdStyle}>{e.site}</td>
                    <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 11, color: MUT }}>{e.ref}</td>
                    <td style={{ ...tdStyle, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.title}</td>
                    <td style={tdStyle}><span style={{ background: e.type === "Externe" ? `${ORANGE}18` : `${BLUE}18`, color: e.type === "Externe" ? ORANGE : BLUE, borderRadius: 5, padding: "2px 7px", fontSize: 11, fontWeight: 700 }}>{e.type}</span></td>
                    <td style={tdStyle}>{e.expediteur}</td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>{e.step.durationDays ? `${e.step.durationDays}j` : "—"}</td>
                    <td style={{ ...tdStyle, textAlign: "center", fontWeight: 700 }}>{actualMs != null ? fmtDays(actualMs) : "—"}</td>
                    <td style={tdStyle}>{e.step.doneAt ? new Date(e.step.doneAt).toLocaleDateString("fr-FR") : "—"}</td>
                    <td style={{ ...tdStyle, fontWeight: 700, color: ind.color, whiteSpace: "nowrap" }}>{ind.label}</td>
                  </tr>
                );
              })}
              {tab === "rejetes" && rej.map((e, i) => (
                <tr key={i} style={{ background: i % 2 ? "var(--ss-card2,#f8f9fc)" : WH }}>
                  <td style={tdStyle}><span style={{ background: `${ACC2}18`, color: ACC2, borderRadius: 5, padding: "2px 7px", fontSize: 11, fontWeight: 700 }}>{e.project}</span></td>
                  <td style={tdStyle}>{e.site}</td>
                  <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 11, color: MUT }}>{e.ref}</td>
                  <td style={{ ...tdStyle, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.title}</td>
                  <td style={tdStyle}><span style={{ background: e.type === "Externe" ? `${ORANGE}18` : `${BLUE}18`, color: e.type === "Externe" ? ORANGE : BLUE, borderRadius: 5, padding: "2px 7px", fontSize: 11, fontWeight: 700 }}>{e.type}</span></td>
                  <td style={tdStyle}>{e.expediteur}</td>
                  <td style={tdStyle}>{e.dateRejet ? new Date(e.dateRejet).toLocaleDateString("fr-FR") : "—"}</td>
                  <td style={{ ...tdStyle, color: RED, maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.motif}</td>
                </tr>
              ))}
              {((tab === "instance" && !inst.length) || (tab === "traites" && !trait.length) || (tab === "rejetes" && !rej.length)) && (
                <tr><td colSpan={10} style={{ padding: 32, textAlign: "center", color: MUT, fontSize: 13 }}>Aucune donnée</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        <div style={{ padding: "8px 20px", borderTop: `1px solid ${BD}`, fontSize: 12, color: MUT, flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>{tab === "instance" ? inst.length : tab === "traites" ? trait.length : rej.length} résultat(s)</span>
        </div>
      </div>
    </div>
  );
}

function SituationValidateurView({ docs, users }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const validators = useMemo(() => buildValidatorMap(docs, users), [docs, users]);

  const totInst = validators.reduce((s, v) => s + v.enInstance.length, 0);
  const totTrait = validators.reduce((s, v) => s + v.traites.length, 0);
  const totRej = validators.reduce((s, v) => s + v.rejetes.length, 0);
  const allDelays = validators.flatMap((v) => {
    const avg = avgDelayDays(v.traites);
    return avg != null ? [avg] : [];
  });
  const globalAvg = allDelays.length ? Math.round(allDelays.reduce((a, b) => a + b, 0) / allDelays.length * 10) / 10 : null;

  const filtered = validators
    .filter((v) => !search || v.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const retardA = a.enInstance.filter((e) => e.step.dueAt && new Date(e.step.dueAt) < Date.now()).length;
      const retardB = b.enInstance.filter((e) => e.step.dueAt && new Date(e.step.dueAt) < Date.now()).length;
      return retardB - retardA;
    });

  const kpis = [
    { label: "En instance", value: totInst, color: ORANGE, bg: `${ORANGE}18`, icon: "⏱" },
    { label: "Traités", value: totTrait, color: GREEN, bg: `${GREEN}14`, icon: "✓" },
    { label: "Rejetés", value: totRej, color: RED, bg: `${RED}14`, icon: "✕" },
    { label: "Délai moyen", value: globalAvg != null ? `${globalAvg}j` : "—", color: BLUE, bg: `${BLUE}14`, icon: "∿" },
  ];

  return (
    <div style={{ fontFamily: FONT }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: "var(--ss-text,#1e293b)" }}>Situation par validateur</h2>
        <p style={{ margin: "4px 0 0", color: MUT, fontSize: 12.5 }}>
          Suivi de la charge de travail et de la performance de chaque validateur en temps réel.
        </p>
      </div>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        {kpis.map((k) => (
          <Card key={k.label} style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: k.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{k.icon}</div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 950, color: k.color, lineHeight: 1.1 }}>{k.value}</div>
              <div style={{ fontSize: 12, color: MUT, marginTop: 2 }}>{k.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* List card */}
      <Card style={{ overflow: "hidden" }}>
        {/* Toolbar */}
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${BD}`, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ position: "relative", flex: 1, maxWidth: 340 }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: MUT, fontSize: 14, pointerEvents: "none" }}>⌕</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un validateur..."
              style={{ width: "100%", padding: "8px 10px 8px 30px", borderRadius: 8, border: `1px solid ${BD}`, background: "var(--ss-input,#fff)", color: "var(--ss-text,#1e293b)", fontSize: 13, fontFamily: FONT, outline: "none" }}
            />
          </div>
          <span style={{ fontSize: 12, color: MUT, marginLeft: "auto" }}>≡↓ Trié par dossiers en retard</span>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--ss-card2,#f8f9fc)" }}>
                {["Validateur", "En instance", "Traités", "Rejetés", "Délai moyen", ""].map((h) => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: h === "En instance" || h === "Traités" || h === "Rejetés" || h === "Délai moyen" ? "center" : "left", fontSize: 11, fontWeight: 800, color: MUT, textTransform: "uppercase", letterSpacing: ".06em", borderBottom: `1px solid ${BD}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ padding: 32, textAlign: "center", color: MUT }}>Aucun validateur trouvé</td></tr>
              )}
              {filtered.map((v, i) => {
                const avg = avgDelayDays(v.traites);
                const retardCount = v.enInstance.filter((e) => e.step.dueAt && new Date(e.step.dueAt) < Date.now()).length;
                return (
                  <tr
                    key={v.id}
                    onClick={() => setSelected(v)}
                    style={{ borderTop: `1px solid ${BD}`, cursor: "pointer", transition: "background .1s" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "var(--ss-card2,#f8f9fc)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${ACC2}22`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13, color: ACC2, flexShrink: 0 }}>
                          {initials(v.name)}
                        </div>
                        <span style={{ fontWeight: 700, fontSize: 13.5, color: "var(--ss-text,#1e293b)" }}>{v.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                      {v.enInstance.length > 0 ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: `${ORANGE}18`, color: ORANGE, borderRadius: 20, padding: "4px 10px", fontWeight: 700, fontSize: 12.5 }}>
                          ⏱ {v.enInstance.length}
                          {retardCount > 0 && <span style={{ background: RED, color: "#fff", borderRadius: 10, fontSize: 10, padding: "1px 5px", fontWeight: 900 }}>!{retardCount}</span>}
                        </span>
                      ) : <span style={{ color: MUT }}>—</span>}
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                      {v.traites.length > 0 ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: `${GREEN}18`, color: GREEN, borderRadius: 20, padding: "4px 10px", fontWeight: 700, fontSize: 12.5 }}>
                          ✓ {v.traites.length}
                        </span>
                      ) : <span style={{ color: MUT }}>—</span>}
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                      {v.rejetes.length > 0 ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: `${RED}18`, color: RED, borderRadius: 20, padding: "4px 10px", fontWeight: 700, fontSize: 12.5 }}>
                          ✕ {v.rejetes.length}
                        </span>
                      ) : <span style={{ color: MUT }}>—</span>}
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--ss-text,#1e293b)", fontWeight: 700, fontSize: 13 }}>
                        ≡ {avg != null ? `${avg}j` : "—"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                      <span style={{ color: MUT, fontSize: 16 }}>›</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {selected && <ValidateurDetailModal validator={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5.2 – Situation par expéditeur
   ═══════════════════════════════════════════════════════════════ */

function buildExpediteurMap(docs, users) {
  const map = {};
  docs.forEach((doc) => {
    const key = doc.deposantName || doc.author || "Inconnu";
    if (!map[key]) map[key] = { name: key, enCours: [], valides: [], rejetes: [] };
    const row = {
      doc,
      project: doc.projectName || doc.projectId || "—",
      site: doc.site || "—",
      ref: doc.ref,
      title: doc.title,
      type: doc.origin === "externe" ? "Externe" : "Interne",
      expediteur: key,
      createdAt: doc.createdAt,
    };
    const st = doc.status;
    if (st === "en_cours" || st === "en_attente_traitement" || st === "initie" || st === "recu") {
      // active validator = first active step's first signer resolved name
      const activeStep = (doc.steps || []).find((s) => s.status === "active");
      let validateurEnCours = "—";
      if (activeStep) {
        const uid = activeStep.signers?.[0];
        const u = uid ? (users || []).find((x) => x.id === uid) : null;
        validateurEnCours = u ? (u.nom || u.name || u.prenom || uid) : (activeStep.doneByName || uid || "—");
      }
      // planned duration = sum of all step durations
      const dureePrevue = (doc.steps || []).reduce((s, st) => s + (st.durationDays || 0), 0);
      map[key].enCours.push({ ...row, activeStep, validateurEnCours, dureePrevue });
    } else if (st === "termine" || st === "signe") {
      const dureePrevue = (doc.steps || []).reduce((s, st) => s + (st.durationDays || 0), 0);
      const lastDone = [...(doc.steps || [])].reverse().find((s) => s.status === "done");
      const dateValidation = doc.certificate?.generatedAt || lastDone?.doneAt || null;
      const dureeReelle = doc.createdAt && dateValidation
        ? Math.round((new Date(dateValidation) - new Date(doc.createdAt)) / 86400000 * 10) / 10
        : null;
      map[key].valides.push({ ...row, dureePrevue, dureeReelle, dateValidation });
    } else if (st === "rejete") {
      map[key].rejetes.push({
        ...row,
        dateRejet: doc.rejection?.date || null,
        motif: doc.rejection?.reason || "—",
      });
    }
  });
  return Object.values(map);
}

function ExpediteurDetailModal({ expediteur, onClose }) {
  const [tab, setTab] = useState("enCours");
  const TABS = [
    { id: "enCours",  label: "En cours",  count: expediteur.enCours.length,  color: ORANGE },
    { id: "valides",  label: "Validés",   count: expediteur.valides.length,   color: GREEN  },
    { id: "rejetes",  label: "Rejetés",   count: expediteur.rejetes.length,   color: RED    },
  ];

  const thStyle = { padding: "9px 12px", textAlign: "left", fontSize: 11, fontWeight: 800, color: MUT, textTransform: "uppercase", letterSpacing: ".06em", whiteSpace: "nowrap", background: "var(--ss-card2,#f8f9fc)", borderBottom: `1px solid ${BD}` };
  const tdStyle = { padding: "9px 12px", fontSize: 12.5, color: "var(--ss-text,#1e293b)", borderBottom: `1px solid ${BD}`, verticalAlign: "middle" };

  const projBadge = (proj) => (
    <span style={{ background: `${ACC2}18`, color: ACC2, borderRadius: 5, padding: "2px 7px", fontSize: 11, fontWeight: 700 }}>{proj}</span>
  );
  const typeBadge = (t) => (
    <span style={{ background: t === "Externe" ? `${ORANGE}18` : `${BLUE}18`, color: t === "Externe" ? ORANGE : BLUE, borderRadius: 5, padding: "2px 7px", fontSize: 11, fontWeight: 700 }}>{t}</span>
  );

  const rows = expediteur[tab];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: WH, borderRadius: 14, width: "min(940px,100%)", maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,.2)" }}>

        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BD}`, display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: `${BLUE}22`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, color: BLUE, flexShrink: 0 }}>
            {initials(expediteur.name)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: "var(--ss-text,#1e293b)" }}>{expediteur.name}</div>
            <div style={{ fontSize: 11.5, color: MUT }}>Détail des documents déposés</div>
          </div>
          <button onClick={onClose} style={{ border: `1px solid ${BD}`, background: WH, borderRadius: 8, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: MUT }}>✕</button>
        </div>

        {/* KPI row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, padding: "14px 20px", borderBottom: `1px solid ${BD}`, flexShrink: 0 }}>
          {TABS.map((t) => (
            <div key={t.id} style={{ textAlign: "center", padding: 12, borderRadius: 10, background: `${t.color}10`, border: `1px solid ${t.color}30` }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: t.color }}>{t.count}</div>
              <div style={{ fontSize: 11.5, color: MUT, marginTop: 2 }}>{t.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, padding: "10px 20px 0", flexShrink: 0, borderBottom: `1px solid ${BD}` }}>
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "7px 14px", borderRadius: "8px 8px 0 0", border: `1px solid ${tab === t.id ? BD : "transparent"}`, borderBottom: tab === t.id ? `2px solid ${t.color}` : "none", background: tab === t.id ? WH : "transparent", fontFamily: FONT, fontSize: 12.5, fontWeight: 750, color: tab === t.id ? t.color : MUT, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              {t.label}
              <span style={{ background: `${t.color}22`, color: t.color, borderRadius: 10, padding: "1px 7px", fontSize: 11, fontWeight: 900 }}>{t.count}</span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{ flex: 1, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 780 }}>
            <thead>
              {tab === "enCours" && (
                <tr>{["Projet","Site","Référence","Titre","Type","Validateur en cours","Durée prévue","Délai restant","Retard"].map((h) => <th key={h} style={thStyle}>{h}</th>)}</tr>
              )}
              {tab === "valides" && (
                <tr>{["Projet","Site","Référence","Titre","Type","Durée prévue","Durée réelle","Date validation","Retard"].map((h) => <th key={h} style={thStyle}>{h}</th>)}</tr>
              )}
              {tab === "rejetes" && (
                <tr>{["Projet","Site","Référence","Titre","Type","Expéditeur","Date de rejet","Motif de rejet"].map((h) => <th key={h} style={thStyle}>{h}</th>)}</tr>
              )}
            </thead>
            <tbody>
              {tab === "enCours" && rows.map((e, i) => {
                const dueAt = e.activeStep?.dueAt;
                const remaining = dueAt ? new Date(dueAt) - Date.now() : null;
                const ind = retardIndicator(dueAt, null);
                return (
                  <tr key={i} style={{ background: i % 2 ? "var(--ss-card2,#f8f9fc)" : WH }}>
                    <td style={tdStyle}>{projBadge(e.project)}</td>
                    <td style={tdStyle}>{e.site}</td>
                    <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 11, color: MUT }}>{e.ref}</td>
                    <td style={{ ...tdStyle, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.title}</td>
                    <td style={tdStyle}>{typeBadge(e.type)}</td>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{e.validateurEnCours}</td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>{e.dureePrevue ? `${e.dureePrevue}j` : "—"}</td>
                    <td style={{ ...tdStyle, textAlign: "center", fontWeight: 700, color: remaining != null ? (remaining < 0 ? RED : remaining < 2 * 86400000 ? ORANGE : GREEN) : MUT }}>
                      {remaining != null ? (remaining < 0 ? `−${fmtDays(-remaining)}` : fmtDays(remaining)) : "—"}
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 700, color: ind.color, whiteSpace: "nowrap" }}>{ind.label}</td>
                  </tr>
                );
              })}

              {tab === "valides" && rows.map((e, i) => {
                const dureePlanMs = e.dureePrevue ? e.dureePrevue * 86400000 : null;
                const dureeReelleMs = e.dureeReelle != null ? e.dureeReelle * 86400000 : null;
                const ind = dureePlanMs && dureeReelleMs
                  ? retardIndicator(
                      new Date(e.createdAt).getTime() + dureePlanMs,
                      e.dateValidation ? new Date(e.dateValidation).getTime() : Date.now()
                    )
                  : { label: "🟢 Dans les délais", color: GREEN };
                return (
                  <tr key={i} style={{ background: i % 2 ? "var(--ss-card2,#f8f9fc)" : WH }}>
                    <td style={tdStyle}>{projBadge(e.project)}</td>
                    <td style={tdStyle}>{e.site}</td>
                    <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 11, color: MUT }}>{e.ref}</td>
                    <td style={{ ...tdStyle, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.title}</td>
                    <td style={tdStyle}>{typeBadge(e.type)}</td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>{e.dureePrevue ? `${e.dureePrevue}j` : "—"}</td>
                    <td style={{ ...tdStyle, textAlign: "center", fontWeight: 700, color: e.dureeReelle != null && e.dureePrevue && e.dureeReelle > e.dureePrevue ? RED : GREEN }}>
                      {e.dureeReelle != null ? `${e.dureeReelle}j` : "—"}
                    </td>
                    <td style={tdStyle}>{e.dateValidation ? new Date(e.dateValidation).toLocaleDateString("fr-FR") : "—"}</td>
                    <td style={{ ...tdStyle, fontWeight: 700, color: ind.color, whiteSpace: "nowrap" }}>{ind.label}</td>
                  </tr>
                );
              })}

              {tab === "rejetes" && rows.map((e, i) => (
                <tr key={i} style={{ background: i % 2 ? "var(--ss-card2,#f8f9fc)" : WH }}>
                  <td style={tdStyle}>{projBadge(e.project)}</td>
                  <td style={tdStyle}>{e.site}</td>
                  <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 11, color: MUT }}>{e.ref}</td>
                  <td style={{ ...tdStyle, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.title}</td>
                  <td style={tdStyle}>{typeBadge(e.type)}</td>
                  <td style={tdStyle}>{e.expediteur}</td>
                  <td style={tdStyle}>{e.dateRejet ? new Date(e.dateRejet).toLocaleDateString("fr-FR") : "—"}</td>
                  <td style={{ ...tdStyle, color: RED, maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.motif}</td>
                </tr>
              ))}

              {!rows.length && (
                <tr><td colSpan={10} style={{ padding: 32, textAlign: "center", color: MUT, fontSize: 13 }}>Aucune donnée</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{ padding: "8px 20px", borderTop: `1px solid ${BD}`, fontSize: 12, color: MUT, flexShrink: 0 }}>
          {rows.length} résultat(s)
        </div>
      </div>
    </div>
  );
}

function SituationExpediteurView({ docs, users }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const expediteurs = useMemo(() => buildExpediteurMap(docs, users), [docs, users]);

  const totTotal = expediteurs.reduce((s, e) => s + e.enCours.length + e.valides.length + e.rejetes.length, 0);
  const totCours = expediteurs.reduce((s, e) => s + e.enCours.length, 0);
  const totVal   = expediteurs.reduce((s, e) => s + e.valides.length, 0);
  const totRej   = expediteurs.reduce((s, e) => s + e.rejetes.length, 0);

  const filtered = expediteurs
    .filter((e) => !search || e.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (b.enCours.length + b.valides.length + b.rejetes.length) - (a.enCours.length + a.valides.length + a.rejetes.length));

  const kpis = [
    { label: "Total déposés",   value: totTotal, color: ACC2,   bg: `${ACC2}14`,   icon: "📄" },
    { label: "En cours",        value: totCours, color: ORANGE, bg: `${ORANGE}14`, icon: "⏳" },
    { label: "Validés (signés)", value: totVal,  color: GREEN,  bg: `${GREEN}14`,  icon: "✓"  },
    { label: "Rejetés",         value: totRej,  color: RED,    bg: `${RED}14`,    icon: "✕"  },
  ];

  const thStyle = { padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 800, color: MUT, textTransform: "uppercase", letterSpacing: ".06em", borderBottom: `1px solid ${BD}`, background: "var(--ss-card2,#f8f9fc)" };

  return (
    <div style={{ fontFamily: FONT }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: "var(--ss-text,#1e293b)" }}>Situation par expéditeur</h2>
        <p style={{ margin: "4px 0 0", color: MUT, fontSize: 12.5 }}>
          Suivi des documents déposés par chaque expéditeur, avec le détail des dossiers en cours, validés et rejetés.
        </p>
      </div>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        {kpis.map((k) => (
          <Card key={k.label} style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: k.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{k.icon}</div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 950, color: k.color, lineHeight: 1.1 }}>{k.value}</div>
              <div style={{ fontSize: 12, color: MUT, marginTop: 2 }}>{k.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* List card */}
      <Card style={{ overflow: "hidden" }}>
        {/* Toolbar */}
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${BD}`, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ position: "relative", flex: 1, maxWidth: 340 }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: MUT, fontSize: 14, pointerEvents: "none" }}>⌕</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un expéditeur..."
              style={{ width: "100%", padding: "8px 10px 8px 30px", borderRadius: 8, border: `1px solid ${BD}`, background: "var(--ss-input,#fff)", color: "var(--ss-text,#1e293b)", fontSize: 13, fontFamily: FONT, outline: "none" }}
            />
          </div>
          <span style={{ fontSize: 12, color: MUT, marginLeft: "auto" }}>≡↓ Trié par volume</span>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Expéditeur", "Total déposés", "En cours", "Validés", "Rejetés", ""].map((h) => (
                  <th key={h} style={{ ...thStyle, textAlign: h === "Expéditeur" || h === "" ? "left" : "center" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ padding: 32, textAlign: "center", color: MUT }}>Aucun expéditeur trouvé</td></tr>
              )}
              {filtered.map((e, i) => {
                const total = e.enCours.length + e.valides.length + e.rejetes.length;
                return (
                  <tr
                    key={e.name}
                    onClick={() => setSelected(e)}
                    style={{ borderTop: `1px solid ${BD}`, cursor: "pointer", transition: "background .1s" }}
                    onMouseEnter={(ev) => ev.currentTarget.style.background = "var(--ss-card2,#f8f9fc)"}
                    onMouseLeave={(ev) => ev.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${BLUE}22`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13, color: BLUE, flexShrink: 0 }}>
                          {initials(e.name)}
                        </div>
                        <span style={{ fontWeight: 700, fontSize: 13.5, color: "var(--ss-text,#1e293b)" }}>{e.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                      <span style={{ fontWeight: 800, fontSize: 15, color: "var(--ss-text,#1e293b)" }}>{total}</span>
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                      {e.enCours.length > 0
                        ? <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: `${ORANGE}18`, color: ORANGE, borderRadius: 20, padding: "4px 10px", fontWeight: 700, fontSize: 12.5 }}>⏳ {e.enCours.length}</span>
                        : <span style={{ color: MUT }}>—</span>}
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                      {e.valides.length > 0
                        ? <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: `${GREEN}18`, color: GREEN, borderRadius: 20, padding: "4px 10px", fontWeight: 700, fontSize: 12.5 }}>✓ {e.valides.length}</span>
                        : <span style={{ color: MUT }}>—</span>}
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                      {e.rejetes.length > 0
                        ? <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: `${RED}18`, color: RED, borderRadius: 20, padding: "4px 10px", fontWeight: 700, fontSize: 12.5 }}>✕ {e.rejetes.length}</span>
                        : <span style={{ color: MUT }}>—</span>}
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                      <span style={{ color: MUT, fontSize: 16 }}>›</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {selected && <ExpediteurDetailModal expediteur={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Reports main view – tabbed sub-modules
   ═══════════════════════════════════════════════════════════════ */
function ReportsView({ docs, workflows, audit, users }) {
  const [subTab, setSubTab] = useState("validateurs");
  const byType = SS_DOC_TYPES.map((t) => ({ label: t.label, count: docs.filter((d) => d.type === t.id).length }));

  const SUB_TABS = [
    { id: "validateurs", label: "5.1 Situation par validateur" },
    { id: "expediteurs", label: "5.2 Situation par expéditeur" },
    { id: "general",     label: "Vue générale" },
  ];

  return (
    <div style={{ fontFamily: FONT }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, color: "var(--ss-text,#1e293b)", marginBottom: 14 }}>Rapports & statistiques</h2>
        <div style={{ display: "flex", gap: 4, borderBottom: `2px solid ${BD}`, paddingBottom: 0 }}>
          {SUB_TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setSubTab(t.id)}
              style={{ padding: "8px 18px", border: "none", borderBottom: subTab === t.id ? `2px solid ${ACC2}` : "2px solid transparent", marginBottom: -2, background: "transparent", fontFamily: FONT, fontSize: 13, fontWeight: subTab === t.id ? 800 : 500, color: subTab === t.id ? ACC2 : MUT, cursor: "pointer", borderRadius: "6px 6px 0 0" }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {subTab === "validateurs" && <SituationValidateurView docs={docs} users={users} />}
      {subTab === "expediteurs" && <SituationExpediteurView docs={docs} users={users} />}

      {subTab === "general" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 16 }}>
            {[["Documents", docs.length, ACC2], ["Signés", docs.filter((d) => d.status === "termine").length, GREEN], ["Rejetés", docs.filter((d) => d.status === "rejete").length, RED], ["Workflows actifs", workflows.filter((w) => w.active).length, BLUE]].map(([l, v, c]) => (
              <Card key={l} style={{ padding: 18 }}>
                <div style={{ fontSize: 28, fontWeight: 950, color: c }}>{v}</div>
                <div style={{ color: MUT }}>{l}</div>
              </Card>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <Card style={{ padding: 18 }}>
              <h3 style={{ marginBottom: 12 }}>Documents par type</h3>
              {byType.map((x) => (
                <div key={x.label} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}><b>{x.label}</b><span>{x.count}</span></div>
                  <div style={{ height: 7, background: "#f1f5f9", borderRadius: 8 }}><div style={{ width: `${docs.length ? x.count / docs.length * 100 : 0}%`, background: ACC2, height: "100%", borderRadius: 8 }} /></div>
                </div>
              ))}
            </Card>
            <Card style={{ padding: 18 }}>
              <h3 style={{ marginBottom: 12 }}>Activité récente</h3>
              {(audit || []).slice(0, 10).map((a, i) => (
                <div key={i} style={{ padding: "8px 0", borderTop: `1px solid ${BD}`, fontSize: 12 }}>
                  <b>{a.user}</b> · {a.action}
                  <div style={{ color: MUT }}>{new Date(a.date).toLocaleString("fr-FR")}</div>
                </div>
              ))}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

async function exportCertificate(doc, users) {
  const { default: jsPDF } = await import("jspdf");
  const QRCode = await import("qrcode");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  pdf.setFontSize(18);
  pdf.text("Certificat de signature electronique", 14, 18);
  pdf.setFontSize(10);
  const lines = [
    `Reference: ${doc.ref}`,
    `Titre: ${doc.title}`,
    `Type: ${doc.type}`,
    `Projet: ${doc.projectName || doc.projectId}`,
    `Site: ${doc.site}`,
    `Workflow: ${doc.workflowName}`,
    `Date creation: ${doc.createdAt}`,
    `Date finalisation: ${doc.certificate?.generatedAt || ""}`,
    `Nombre de pages: ${doc.pages || 1}`,
  ];
  lines.forEach((line, i) => pdf.text(line, 14, 32 + i * 6));
  pdf.text("Signataires et actions", 14, 92);
  (doc.steps || []).forEach((s, i) => pdf.text(`${i + 1}. ${getAction(s.action).label} - ${s.label} - ${s.doneByName || userName(users, s.signers?.[0])} - ${s.doneAt || "-"}`, 14, 102 + i * 6));
  pdf.text("Historique complet", 14, 142);
  (doc.audit || []).slice(0, 12).forEach((a, i) => pdf.text(`${new Date(a.date).toLocaleString("fr-FR")} - ${a.user} - ${a.action} - ${a.detail}`, 14, 152 + i * 5));
  const qr = await QRCode.toDataURL(doc.certificate?.qr || `${doc.ref}|${doc.id}`);
  pdf.addImage(qr, "PNG", 155, 20, 35, 35);
  pdf.save(`${doc.ref}-certificat.pdf`);
}

function AuditView({ docs, audit, users }) {
  const merged = [...(audit || []), ...docs.flatMap((d) => (d.audit || []).map((a) => ({ ...a, docRef: d.ref })))].sort((a, b) => new Date(b.date) - new Date(a.date));
  return (
    <div style={{ fontFamily: FONT }}>
      <h2>Audit & historiques</h2>
      <Card style={{ overflow: "hidden", marginBottom: 16 }}><table style={{ width: "100%", borderCollapse: "collapse" }}><thead><tr style={{ background: "#f8fafc" }}>{["Date", "Utilisateur", "Action", "Document", "Detail"].map((h) => <th key={h} style={{ padding: 10, textAlign: "left", color: MUT, fontSize: 11, textTransform: "uppercase" }}>{h}</th>)}</tr></thead><tbody>{merged.slice(0, 80).map((a, i) => <tr key={i} style={{ borderTop: `1px solid ${BD}` }}><td style={{ padding: 10 }}>{new Date(a.date).toLocaleString("fr-FR")}</td><td style={{ padding: 10 }}>{a.user}</td><td style={{ padding: 10 }}>{a.action}</td><td style={{ padding: 10 }}>{a.docRef || "-"}</td><td style={{ padding: 10 }}>{a.detail}</td></tr>)}</tbody></table></Card>
      <h3>Certificats disponibles</h3>
      <div style={{ display: "grid", gap: 10 }}>{docs.filter((d) => d.certificate).map((doc) => <Card key={doc.id} style={{ padding: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}><div><b>{doc.ref}</b><div style={{ color: MUT, fontSize: 12 }}>{doc.title} · {doc.certificate.id}</div></div><Button tone="primary" onClick={() => exportCertificate(doc, users)}>Telecharger certificat PDF</Button></Card>)}</div>
    </div>
  );
}

function SoftDocsIntegration({ docs, softDocs, setSoftDocs, users }) {
  const signed = docs.filter((d) => d.status === "termine" || d.status === "signe");
  const [selectedSS, setSelectedSS] = useState(signed[0]?.id || "");
  const [selectedSD, setSelectedSD] = useState(softDocs[0]?.id || "");
  const attach = () => {
    const ss = signed.find((d) => d.id === selectedSS);
    if (!ss) return;
    setSoftDocs((p) => p.map((d) => d.id === selectedSD ? { ...d, softSignAttachment: { id: ss.id, ref: ss.ref, status: ss.status, certificateId: ss.certificate?.id, signedAt: ss.certificate?.generatedAt, audit: ss.audit }, anx: [...(d.anx || []), { nom: `${ss.ref}-signe.pdf`, type: "Document signe SoftSign", ok: true }] } : d));
  };
  return (
    <div style={{ fontFamily: FONT }}>
      <h2>Integration SoftDocs</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <Card style={{ padding: 18 }}><h3>SoftSign vers SoftDocs</h3><Field label="Document signe SoftSign"><select style={inputStyle} value={selectedSS} onChange={(e) => setSelectedSS(e.target.value)}>{signed.map((d) => <option key={d.id} value={d.id}>{d.ref} - {d.title}</option>)}</select></Field><br /><Field label="Dossier SoftDocs cible"><select style={inputStyle} value={selectedSD} onChange={(e) => setSelectedSD(e.target.value)}>{softDocs.map((d) => <option key={d.id} value={d.id}>{d.id} - {d.type}</option>)}</select></Field><br /><Button tone="primary" onClick={attach}>Rattacher le document signe</Button></Card>
        <Card style={{ padding: 18 }}><h3>Documents signes recherchables</h3>{signed.slice(0, 8).map((d) => <div key={d.id} style={{ padding: "9px 0", borderTop: `1px solid ${BD}` }}><b>{d.ref}</b><div style={{ color: MUT, fontSize: 12 }}>{d.projectName || d.projectId} · {d.site} · {d.workflowName}</div></div>)}</Card>
      </div>
    </div>
  );
}

function NotificationsView({ notifs, setNotifs, setView }) {
  return (
    <div style={{ fontFamily: FONT }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><h2>Notifications</h2><Button onClick={() => setNotifs((p) => p.map((n) => ({ ...n, lu: true })))}>Tout marquer lu</Button></div>
      <div style={{ display: "grid", gap: 10 }}>{notifs.map((n) => <Card key={n.id} style={{ padding: 14, background: n.lu ? WH : "#f5f3ff", display: "flex", justifyContent: "space-between", gap: 12 }}><div><b>{n.message}</b><div style={{ color: MUT, fontSize: 12 }}>{new Date(n.date).toLocaleString("fr-FR")}</div></div><div style={{ display: "flex", gap: 8 }}>{n.targetView&&<Button tone="primary" onClick={() => setView(n.targetView)}>Ouvrir</Button>}<Button onClick={() => setNotifs((p) => p.filter((x) => x.id !== n.id))}>Supprimer</Button></div></Card>)}</div>
    </div>
  );
}

export function ensureSoftSignSeeds(value, fallback) {
  if (!Array.isArray(value)) return fallback;
  if (!Array.isArray(fallback) || fallback.length === 0) return value;
  const seedById = new Map(fallback.filter((item) => item?.id).map((item) => [item.id, item]));
  const mergedExisting = value.map((item) => {
    const seed = item?.id ? seedById.get(item.id) : null;
    if (!seed) return item;
    const merged = { ...seed, ...item };
    if (!merged.fileName && seed.fileName) merged.fileName = seed.fileName;
    if (!merged.fileB64 && seed.fileB64) merged.fileB64 = seed.fileB64;
    if (Array.isArray(item.docTypes) && Array.isArray(seed.docTypes)) {
      merged.docTypes = [...new Set([...item.docTypes, ...seed.docTypes])];
    }
    if (Array.isArray(item.steps) && Array.isArray(seed.steps)) {
      const seedSteps = new Map(seed.steps.filter((step) => step?.id).map((step) => [step.id, step]));
      merged.steps = item.steps.map((step) => ({ ...(seedSteps.get(step.id) || {}), ...step }));
    }
    return merged;
  });
  return mergedExisting;
}

export const SOFTSIGN_DEFAULTS = {
  docs: INIT_SS_DOCUMENTS_PRO,
  workflows: INIT_SS_WORKFLOWS_PRO,
  externalAccounts: INIT_SS_EXTERNAL_ACCOUNTS,
  signatures: INIT_SS_SIGNATURES_PRO,
  delegations: INIT_SS_DELEGATIONS_PRO,
  otpConfig: SS_DEFAULT_OTP,
  license: SS_DEFAULT_LICENSE,
  generalSettings: SS_DEFAULT_GENERAL_SETTINGS,
};
