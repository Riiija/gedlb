"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { completeStep, normalizeReminderConfig } from "./softsignCore";

const ACC = "#7c3aed";
const ACC_DARK = "#5b21b6";
const BLUE = "#2563eb";
const GREEN = "#059669";
const RED = "#dc2626";
const ORANGE = "#d97706";
const MUT = "#64748b";
const BD = "#e2e8f0";
const BG = "#f8fafc";
const WH = "#fff";
const FONT = "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif";

const REQUESTS_KEY = "ss_externalSignatureRequests";
const MAILS_KEY = "ss_externalMailbox";
const DOCS_KEY = "ss_docs";
const NOTIFS_KEY = "ss_notifs";
const STORE_EVENT = "ss-external-signature-change";

function readStore(key, fallback = []) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(STORE_EVENT, { detail: { key } }));
  } catch {}
}

function randomHex(bytes = 24) {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const values = new Uint8Array(bytes);
    crypto.getRandomValues(values);
    return Array.from(values, (value) => value.toString(16).padStart(2, "0")).join("");
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
}

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

function addDays(days, from = new Date()) {
  const value = new Date(from);
  value.setDate(value.getDate() + Math.max(1, Number(days || 1)));
  return value.toISOString();
}

function formatDate(value) {
  return value ? new Date(value).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" }) : "-";
}

function linkFor(token) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/signature-externe/${token}`;
}

function documentSource(doc = {}) {
  return doc.finalFileB64 || doc.signedFileB64 || doc.fileB64 || doc.fileUrl || "";
}

function requestFileSource(request = {}) {
  if (!request) return "";
  if (request.fileSource) return request.fileSource;
  const doc = readStore(DOCS_KEY, []).find((item) => item.id === request.docId);
  return documentSource(doc);
}

function previewSource(source = "") {
  const value = String(source || "");
  if (!value) return "";
  if (value.startsWith("data:") || value.startsWith("/") || /^https?:\/\//i.test(value)) return value;
  return `data:application/pdf;base64,${value}`;
}

function storableFileReference(source = "") {
  const value = String(source || "");
  return value.startsWith("/") || /^https?:\/\//i.test(value) ? value : "";
}

function downloadSource(source, filename = "document.pdf") {
  const href = previewSource(source);
  if (!href) return;
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function currentClientAddress() {
  if (typeof window === "undefined") return "navigateur-local";
  return window.location.hostname || "navigateur-local";
}

function appendAction(request, type, label, actor = "Systeme SoftSign", extra = {}) {
  return {
    ...request,
    actions: [
      ...(request.actions || []),
      { id: makeId("ACT"), at: new Date().toISOString(), type, label, actor, ...extra },
    ],
  };
}

function externalAuditEntries(doc, request, status) {
  const audit = doc.audit || [];
  const existingActionIds = new Set(audit.map((entry) => entry.externalActionId).filter(Boolean));
  const actionEntries = (request.actions || [])
    .filter((action) => !existingActionIds.has(action.id))
    .map((action) => ({
      date: action.at,
      user: action.actor,
      action: `signature_externe_${action.type}`,
      detail: action.label,
      requestId: request.id,
      externalActionId: action.id,
      ip: action.ip || "",
    }));
  const externalStatusId = `${request.id}:${status}`;
  const statusEntry = audit.some((entry) => entry.externalStatusId === externalStatusId) ? [] : [{
    date: new Date().toISOString(),
    user: "Systeme SoftSign",
    action: status === "signed" ? "signature_externe_reintegree" : "signature_externe_mise_a_jour",
    detail: status === "signed"
      ? `Document signe par le tiers ${request.thirdPartyName} et reintegre dans le workflow.`
      : `Demande de signature externe ${request.id} - statut ${status}.`,
    requestId: request.id,
    externalStatusId,
  }];
  return [...audit, ...actionEntries, ...statusEntry];
}

function storeRequest(request) {
  const requests = readStore(REQUESTS_KEY, []);
  writeStore(REQUESTS_KEY, requests.some((item) => item.id === request.id)
    ? requests.map((item) => item.id === request.id ? request : item)
    : [request, ...requests]);
  return request;
}

function pushMail(mail) {
  const saved = { id: makeId("MAIL"), sentAt: new Date().toISOString(), read: false, ...mail };
  writeStore(MAILS_KEY, [saved, ...readStore(MAILS_KEY, [])]);
  return saved;
}

function pushNotification(message, type = "signature_externe", docId = "", extra = {}) {
  const saved = { id: makeId("N"), type, message, docId, lu: false, date: new Date().toISOString(), ...extra };
  writeStore(NOTIFS_KEY, [saved, ...readStore(NOTIFS_KEY, [])]);
  return saved;
}

export function externalSignatureSummary(request) {
  if (!request) return null;
  return {
    requestId: request.id,
    token: request.token,
    status: effectiveExternalStatus(request),
    thirdPartyId: request.thirdPartyId,
    thirdPartyName: request.thirdPartyName,
    email: request.email,
    createdAt: request.createdAt,
    expiresAt: request.expiresAt,
    signedAt: request.signedAt || "",
    consultationAt: request.consultationAt || "",
    validityDays: request.validityDays,
  };
}

export function applyExternalRequestToDocument(doc, request) {
  const status = effectiveExternalStatus(request);
  const audit = externalAuditEntries(doc, request, status);
  let nextDoc = {
    ...doc,
    status: status === "cancelled" ? doc.status : status === "signed" ? "signe_tiers" : "en_attente_signature_externe",
    workflowBlocked: status !== "signed" && status !== "cancelled",
    externalSignature: externalSignatureSummary(request),
    signedFileB64: status === "signed" ? storableFileReference(requestFileSource(request)) || doc.signedFileB64 : doc.signedFileB64,
    signatureProof: status === "signed" ? request.proof : doc.signatureProof,
    updatedAt: new Date().toISOString(),
    audit,
  };
  const targetStep = (nextDoc.steps || []).find((step) => step.id === request.stepId);
  if (status === "signed" && targetStep && targetStep.status !== "done") {
    nextDoc = completeStep(nextDoc, request.stepId, {
      user: { id: request.thirdPartyId, nom: request.thirdPartyName },
      comment: "Signature externe validee et reintegree automatiquement.",
      signatureMode: `externe_${request.proof?.mode || "signature"}`,
      signatureValue: request.proof?.value || "",
      otpCode: request.proof?.otpVerifiedAt || "otp-externe-valide",
    });
    if (nextDoc.status === "en_cours") nextDoc.status = "signe_tiers";
    nextDoc.workflowBlocked = false;
    nextDoc.externalSignature = externalSignatureSummary(request);
    nextDoc.signedFileB64 = storableFileReference(requestFileSource(request)) || nextDoc.signedFileB64;
    nextDoc.signatureProof = request.proof;
  }
  return nextDoc;
}

function syncDocumentFromRequest(request) {
  const docs = readStore(DOCS_KEY, []);
  if (!Array.isArray(docs)) return;
  writeStore(DOCS_KEY, docs.map((doc) => doc.id === request.docId ? applyExternalRequestToDocument(doc, request) : doc));
}

export function effectiveExternalStatus(request) {
  if (!request) return "";
  if (request.status === "signed" || request.status === "cancelled") return request.status;
  if (request.expiresAt && new Date(request.expiresAt).getTime() < Date.now()) return "expired";
  return request.status || "pending";
}

export function isExternalWorkflowBlocked(request) {
  return !!request && !["signed", "cancelled"].includes(effectiveExternalStatus(request));
}

export function getExternalRequestById(id) {
  if (!id || typeof window === "undefined") return null;
  return readStore(REQUESTS_KEY, []).find((item) => item.id === id) || null;
}

export function getExternalRequestByToken(token) {
  if (!token || typeof window === "undefined") return null;
  return readStore(REQUESTS_KEY, []).find((item) => item.token === token) || null;
}

export function getExternalSignatureRequests() {
  if (typeof window === "undefined") return [];
  return readStore(REQUESTS_KEY, []);
}

function signatureMail(request, type = "signature_request") {
  const reminder = type === "signature_reminder";
  const reactivated = type === "signature_reactivated";
  return pushMail({
    type,
    requestId: request.id,
    to: request.email,
    from: "noreply@softsign.mg",
    subject: reminder
      ? `[Relance SoftSign] Signature attendue - ${request.docRef}`
      : reactivated
        ? `[SoftSign] Nouveau lien securise - ${request.docRef}`
        : `[SoftSign] Demande de signature - ${request.docRef}`,
    preview: `${request.docRef} - ${request.docTitle}`,
    attachment: request.fileName || `${request.docRef}.pdf`,
    attachmentSource: storableFileReference(requestFileSource(request)),
    data: {
      docRef: request.docRef,
      docTitle: request.docTitle,
      message: request.message,
      expiresAt: request.expiresAt,
      secureUrl: linkFor(request.token),
      thirdPartyName: request.thirdPartyName,
      type,
    },
  });
}

export function createExternalSignatureRequest({ doc, step, thirdParty, email, message, validityDays, zone, initiator }) {
  const createdAt = new Date().toISOString();
  let request = {
    id: makeId("EXTSIG"),
    token: randomHex(28),
    docId: doc.id,
    docRef: doc.ref,
    docTitle: doc.title,
    fileName: doc.fileName || `${doc.ref}.pdf`,
    fileSource: storableFileReference(documentSource(doc)),
    stepId: step.id,
    stepLabel: step.label,
    thirdPartyId: thirdParty.id,
    thirdPartyName: thirdParty.raisonSociale || thirdParty.contactName || thirdParty.login,
    taxId: thirdParty.nif || thirdParty.identifiantFiscal || "-",
    email,
    message,
    validityDays: Number(validityDays),
    createdAt,
    expiresAt: addDays(validityDays, createdAt),
    status: "pending",
    initiatorId: initiator?.id || "",
    initiatorName: initiator?.nom || "Utilisateur interne",
    zone,
    reminders: [],
    reactivations: [],
    actions: [],
  };
  request = appendAction(request, "created", "Demande de signature externe generee", request.initiatorName);
  request = appendAction(request, "email_sent", `Email initial envoye a ${email}`, "Systeme SoftSign");
  storeRequest(request);
  signatureMail(request);
  pushNotification(`Demande de signature externe envoyee a ${request.thirdPartyName} - ${request.docRef}`, "signature_externe", doc.id);
  syncDocumentFromRequest(request);
  return request;
}

export function remindExternalSignature(requestId, actor = "Utilisateur interne") {
  const current = getExternalRequestById(requestId);
  if (!current || !["pending", "otp_sent", "otp_verified"].includes(effectiveExternalStatus(current))) return current;
  const settings = normalizeReminderConfig(readStore("ss_relancesConfig", {}));
  if ((current.reminders || []).length >= Math.max(1, Number(settings.maxRelances || 5))) return current;
  const reminder = { id: makeId("REL"), at: new Date().toISOString(), by: actor };
  let next = { ...current, reminders: [...(current.reminders || []), reminder] };
  next = appendAction(next, "reminder_sent", `Relance envoyee a ${next.email}`, actor);
  storeRequest(next);
  signatureMail(next, "signature_reminder");
  syncDocumentFromRequest(next);
  pushNotification(`Relance envoyee pour ${next.docRef}`, "relance", next.docId, settings.lienDirect ? { targetView: "ss-relances" } : {});
  return next;
}

export function applyAutomaticExternalSignatureReminders(config = {}, now = new Date()) {
  if (typeof window === "undefined") return [];
  const settings = normalizeReminderConfig(config);
  const currentTime = new Date(now).getTime();
  const updated = [];

  for (const request of readStore(REQUESTS_KEY, [])) {
    if (!["pending", "otp_sent", "otp_verified"].includes(effectiveExternalStatus(request))) continue;
    const dueTime = new Date(request.expiresAt).getTime();
    if (!Number.isFinite(dueTime)) continue;

    let next = request;
    for (let index = 0; index < settings.maxRelances; index += 1) {
      if ((next.reminders || []).length >= settings.maxRelances) break;
      const reminderTime = dueTime - settings.delai * 86400000 + index * settings.frequence * 86400000;
      if (reminderTime > currentTime) break;
      const reminderId = `REL-AUTO-${request.id}-${index + 1}`;
      if ((next.reminders || []).some((item) => item.id === reminderId)) continue;
      const reminder = { id: reminderId, at: new Date().toISOString(), by: "Systeme SoftSign", automatic: true, number: index + 1 };
      next = { ...next, reminders: [...(next.reminders || []), reminder] };
      next = appendAction(next, "reminder_sent", `Relance automatique envoyee a ${next.email}`, "Systeme SoftSign", { reminderId, automatic: true });
      signatureMail(next, "signature_reminder");
      if (settings.notifInterne) pushNotification(`Relance automatique envoyee pour ${next.docRef}`, "relance", next.docId, settings.lienDirect ? { targetView: "ss-relances" } : {});
    }
    if (next !== request) {
      storeRequest(next);
      syncDocumentFromRequest(next);
      updated.push(next);
    }
  }
  return updated;
}

export function requestExternalReactivation(token) {
  const current = getExternalRequestByToken(token);
  if (!current) return null;
  let next = { ...current, status: "reactivation_requested", reactivationRequestedAt: new Date().toISOString() };
  next = appendAction(next, "reactivation_requested", "Le tiers demande la reactivation du lien", current.thirdPartyName);
  storeRequest(next);
  syncDocumentFromRequest(next);
  pushNotification(`${current.thirdPartyName} demande la reactivation du lien - ${current.docRef}`, "reactivation", current.docId);
  pushMail({
    type: "reactivation_requested",
    requestId: current.id,
    to: current.initiatorName,
    from: current.email,
    subject: `[SoftSign] Reactivation demandee - ${current.docRef}`,
    preview: `${current.thirdPartyName} demande un nouveau lien`,
    data: { docRef: current.docRef, docTitle: current.docTitle, thirdPartyName: current.thirdPartyName },
  });
  return next;
}

export function reactivateExternalSignature(requestId, actor = "Utilisateur interne") {
  const current = getExternalRequestById(requestId);
  if (!current) return null;
  const reactivation = { id: makeId("REA"), at: new Date().toISOString(), by: actor, previousToken: current.token };
  let next = {
    ...current,
    token: randomHex(28),
    status: "pending",
    expiresAt: addDays(current.validityDays || 1),
    otp: null,
    reactivationRequestedAt: "",
    reactivations: [...(current.reactivations || []), reactivation],
  };
  next = appendAction(next, "reactivated", "Nouveau lien securise genere", actor);
  next = appendAction(next, "email_sent", `Nouveau lien envoye a ${next.email}`, "Systeme SoftSign");
  storeRequest(next);
  signatureMail(next, "signature_reactivated");
  syncDocumentFromRequest(next);
  pushNotification(`Lien regenere et renvoye a ${next.thirdPartyName} - ${next.docRef}`, "reactivation", next.docId);
  return next;
}

export function generateExternalOtp(token) {
  const current = getExternalRequestByToken(token);
  if (!current || ["signed", "cancelled", "expired"].includes(effectiveExternalStatus(current))) return null;
  const code = String(Math.floor(Math.random() * 1000000)).padStart(6, "0");
  const sentAt = new Date().toISOString();
  const signerIp = currentClientAddress();
  let next = {
    ...current,
    status: "otp_sent",
    consultationAt: current.consultationAt || sentAt,
    otp: { code, sentAt, expiresAt: new Date(Date.now() + 5 * 60000).toISOString(), verifiedAt: "", attempts: 0 },
  };
  next = appendAction(next, "consulted", "Lien securise consulte par le tiers", current.thirdPartyName, { ip: signerIp });
  next = appendAction(next, "otp_sent", `OTP envoye a ${current.email}`, "Systeme SoftSign");
  storeRequest(next);
  syncDocumentFromRequest(next);
  pushMail({
    type: "otp",
    requestId: current.id,
    to: current.email,
    from: "noreply@softsign.mg",
    subject: `[SoftSign] Code OTP de signature - ${current.docRef}`,
    preview: "Votre code de verification a usage unique",
    data: { code, expiresAt: next.otp.expiresAt, docRef: current.docRef, docTitle: current.docTitle },
  });
  return next;
}

export function verifyExternalOtp(token, code) {
  const current = getExternalRequestByToken(token);
  if (!current?.otp) return { ok: false, error: "Aucun code OTP actif." };
  if (new Date(current.otp.expiresAt).getTime() < Date.now()) return { ok: false, error: "Le code OTP a expire. Demandez un nouveau code." };
  if (String(code).trim() !== current.otp.code) {
    let next = { ...current, otp: { ...current.otp, attempts: Number(current.otp.attempts || 0) + 1 } };
    next = appendAction(next, "otp_failed", "Tentative OTP incorrecte", current.thirdPartyName, { ip: currentClientAddress() });
    storeRequest(next);
    syncDocumentFromRequest(next);
    return { ok: false, error: "Code OTP incorrect." };
  }
  let next = { ...current, status: "otp_verified", otp: { ...current.otp, verifiedAt: new Date().toISOString() } };
  next = appendAction(next, "otp_verified", "Authentification OTP validee", current.thirdPartyName, { ip: currentClientAddress() });
  storeRequest(next);
  syncDocumentFromRequest(next);
  return { ok: true, request: next };
}

export function completeExternalSignature(token, proof) {
  const current = getExternalRequestByToken(token);
  if (!current || !current.otp?.verifiedAt || ["signed", "expired"].includes(effectiveExternalStatus(current))) return null;
  const signedAt = new Date().toISOString();
  const signerIp = currentClientAddress();
  let next = {
    ...current,
    status: "signed",
    signedAt,
    signerIp,
    proof: { ...proof, signedAt, ip: signerIp, otpVerifiedAt: current.otp.verifiedAt },
  };
  next = appendAction(next, "signed", "Document signe par le tiers et preuve enregistree", current.thirdPartyName, { ip: next.signerIp });
  next = appendAction(next, "reintegrated", "Document signe reintegre automatiquement dans le workflow", "Systeme SoftSign");
  storeRequest(next);
  syncDocumentFromRequest(next);
  pushNotification(`Document signe par ${next.thirdPartyName} et reintegre - ${next.docRef}`, "signature_externe_terminee", next.docId);
  pushMail({
    type: "signed_confirmation",
    requestId: next.id,
    to: next.initiatorName,
    from: "noreply@softsign.mg",
    subject: `[SoftSign] Document signe par le tiers - ${next.docRef}`,
    preview: `${next.thirdPartyName} a signe le document`,
    data: { docRef: next.docRef, docTitle: next.docTitle, thirdPartyName: next.thirdPartyName, signedAt },
  });
  return next;
}

function useExternalStore(key) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const sync = () => setItems(readStore(key, []));
    sync();
    window.addEventListener(STORE_EVENT, sync);
    window.addEventListener("storage", sync);
    const timer = window.setInterval(sync, 1200);
    return () => {
      window.removeEventListener(STORE_EVENT, sync);
      window.removeEventListener("storage", sync);
      window.clearInterval(timer);
    };
  }, [key]);
  return items;
}

function ToggleTabs({ active, setActive, items }) {
  return (
    <div style={{ display: "flex", gap: 20, borderBottom: `1px solid ${BD}`, padding: "0 20px" }}>
      {items.map((item, index) => (
        <button key={item.id} onClick={() => setActive(item.id)}
          style={{ border: "none", borderBottom: `2px solid ${active === item.id ? ACC : "transparent"}`, background: "transparent", color: active === item.id ? ACC : MUT, padding: "12px 0", fontFamily: FONT, fontWeight: 800, fontSize: 12.5, cursor: "pointer" }}>
          <span style={{ display: "inline-flex", width: 19, height: 19, borderRadius: "50%", alignItems: "center", justifyContent: "center", marginRight: 7, background: active === item.id ? ACC : "#e2e8f0", color: WH, fontSize: 10 }}>{index + 1}</span>
          {item.label}
        </button>
      ))}
    </div>
  );
}

const inputStyle = { width: "100%", border: `1px solid ${BD}`, borderRadius: 7, background: WH, padding: "9px 11px", fontFamily: FONT, fontSize: 12.5, color: "#1e293b", outline: "none", boxSizing: "border-box" };

export function ExternalSignatureRequestModal({ doc, step, externalAccounts = [], authUser, onClose, onCreated }) {
  const validAccounts = externalAccounts.filter((account) => account.status === "actif");
  const source = documentSource(doc);
  const [tab, setTab] = useState("third-party");
  const [form, setForm] = useState({
    thirdPartyId: validAccounts[0]?.id || "",
    email: validAccounts[0]?.email || "",
    message: "Bonjour,\n\nMerci de bien vouloir signer ce document dans les meilleurs delais.\nN'hesitez pas a nous contacter pour toute question.",
    validityDays: 2,
    page: 1,
    x: 320,
    y: 580,
    width: 200,
    height: 60,
  });
  const party = validAccounts.find((account) => account.id === form.thirdPartyId);
  const set = (patch) => setForm((current) => ({ ...current, ...patch }));
  const canGenerate = !!party && /\S+@\S+\.\S+/.test(form.email) && Number(form.validityDays) > 0;
  const generate = () => {
    if (!canGenerate) return;
    const request = createExternalSignatureRequest({
      doc,
      step,
      thirdParty: party,
      email: form.email,
      message: form.message,
      validityDays: form.validityDays,
      initiator: authUser,
      zone: { page: Number(form.page), x: Number(form.x), y: Number(form.y), width: Number(form.width), height: Number(form.height), type: "signature" },
    });
    onCreated?.(request);
    onClose?.();
  };
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(15,23,42,.58)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, fontFamily: FONT }}>
      <div style={{ width: "min(980px,96vw)", maxHeight: "92vh", background: WH, borderRadius: 13, overflow: "hidden", boxShadow: "0 24px 80px rgba(15,23,42,.32)", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "15px 20px", borderBottom: `1px solid ${BD}` }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: ACC, color: WH, display: "flex", alignItems: "center", justifyContent: "center" }}>✉</div>
          <div style={{ flex: 1, fontWeight: 900, color: "#172033" }}>Envoyer pour signature externe</div>
          <button onClick={onClose} style={{ border: "none", background: "#f1f5f9", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", color: MUT }}>×</button>
        </div>
        <ToggleTabs active={tab} setActive={setTab} items={[{ id: "third-party", label: "Selection du tiers" }, { id: "zone", label: "Configuration zone de signature" }]} />
        <div style={{ padding: 20, overflowY: "auto" }}>
          {tab === "third-party" ? (
            <div style={{ display: "grid", gap: 13 }}>
              <label>
                <span style={{ display: "block", fontSize: 11, fontWeight: 900, color: MUT, marginBottom: 5 }}>SELECTIONNER UN TIERS *</span>
                <select style={inputStyle} value={form.thirdPartyId} onChange={(event) => {
                  const selected = validAccounts.find((account) => account.id === event.target.value);
                  set({ thirdPartyId: event.target.value, email: selected?.email || "" });
                }}>
                  <option value="">Selectionner un fournisseur valide...</option>
                  {validAccounts.map((account) => <option key={account.id} value={account.id}>{account.raisonSociale} - {account.nif || "NIF non renseigne"}</option>)}
                </select>
              </label>
              {validAccounts.length === 0 && <div style={{ padding: 12, background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, color: "#92400e", fontSize: 12 }}>Aucun tiers valide disponible. Validez d'abord un fournisseur dans l'administration.</div>}
              {party && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.3fr", gap: 10, padding: 12, border: `1px solid ${BD}`, borderRadius: 8, background: "#faf7ff" }}>
                  {[["Raison sociale", party.raisonSociale], ["Identifiant fiscal", party.nif || "-"], ["Adresse mail principale", party.email]].map(([label, value]) => (
                    <div key={label}><div style={{ color: MUT, fontWeight: 900, fontSize: 10 }}>{label.toUpperCase()}</div><div style={{ fontWeight: 750, fontSize: 12, color: "#334155", marginTop: 4 }}>{value}</div></div>
                  ))}
                </div>
              )}
              <label>
                <span style={{ display: "block", fontSize: 11, fontWeight: 900, color: MUT, marginBottom: 5 }}>ADRESSE E-MAIL *</span>
                <input style={inputStyle} value={form.email} onChange={(event) => set({ email: event.target.value })} />
              </label>
              <label>
                <span style={{ display: "block", fontSize: 11, fontWeight: 900, color: MUT, marginBottom: 5 }}>MESSAGE PERSONNALISE</span>
                <textarea style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} value={form.message} onChange={(event) => set({ message: event.target.value })} />
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 12, alignItems: "end" }}>
                <label>
                  <span style={{ display: "block", fontSize: 11, fontWeight: 900, color: MUT, marginBottom: 5 }}>DELAI MAXIMAL DE SIGNATURE (JOURS) *</span>
                  <input type="number" min={1} style={inputStyle} value={form.validityDays} onChange={(event) => set({ validityDays: event.target.value })} />
                </label>
                <div style={{ color: GREEN, fontSize: 12, fontWeight: 750, paddingBottom: 9 }}>Date d'expiration calculee : {formatDate(addDays(form.validityDays))}</div>
              </div>
              <div style={{ padding: 11, borderRadius: 8, background: "#fffbeb", border: "1px solid #fde68a", color: "#92400e", fontSize: 12 }}>Le workflow sera bloque jusqu'a la reception du document signe. Les actions internes reprendront apres reintegration automatique.</div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16 }}>
              <div>
                <div style={{ fontWeight: 900, fontSize: 12, color: MUT, marginBottom: 9 }}>PREVISUALISATION DU DOCUMENT</div>
                <div style={{ minHeight: 500, padding: 24, background: "#273047", borderRadius: 8, display: "flex", justifyContent: "center" }}>
                  <div style={{ width: 390, minHeight: 455, background: WH, borderRadius: 3, position: "relative", overflow: "hidden", boxShadow: "0 4px 18px rgba(0,0,0,.24)" }}>
                    {source
                      ? <iframe src={previewSource(source)} title={`Apercu de ${doc.fileName || doc.title}`} style={{ width: "100%", height: 455, border: 0, display: "block" }} />
                      : <div style={{ padding: "28px 26px" }}>{[68, 85, 72, 92, 78, 58, 88, 66, 78, 52].map((width, index) => <div key={index} style={{ height: index < 4 ? 7 : 4, width: `${width}%`, marginBottom: index < 4 ? 11 : 8, background: index < 4 ? "#d7dce5" : "#e9edf2", borderRadius: 3 }} />)}</div>}
                    <div style={{ position: "absolute", left: `${Math.min(74, Math.max(6, Number(form.x) / 7))}%`, top: `${Math.min(80, Math.max(8, Number(form.y) / 9))}%`, transform: "translate(-25%,-50%)", width: Math.max(100, Number(form.width) / 1.7), height: Math.max(42, Number(form.height) / 1.3), border: `2px dashed ${ACC}`, background: "#f5f3ffee", color: ACC, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900 }}>ZONE DE SIGNATURE</div>
                  </div>
                </div>
              </div>
              <div style={{ display: "grid", alignContent: "start", gap: 12 }}>
                <div style={{ padding: 14, border: `1px solid ${BD}`, borderRadius: 8 }}>
                  <div style={{ fontWeight: 900, fontSize: 12, color: "#334155", marginBottom: 12 }}>POSITION DE LA ZONE</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {[["Position X", "x"], ["Position Y", "y"], ["Largeur", "width"], ["Hauteur", "height"]].map(([label, key]) => <label key={key}><span style={{ display: "block", color: MUT, fontSize: 10, marginBottom: 4 }}>{label}</span><input type="number" style={inputStyle} value={form[key]} onChange={(event) => set({ [key]: event.target.value })} /></label>)}
                  </div>
                </div>
                <div style={{ padding: 14, border: `1px solid ${BD}`, borderRadius: 8 }}>
                  <div style={{ fontWeight: 900, fontSize: 12, color: "#334155", marginBottom: 8 }}>PAGE CIBLE</div>
                  <input type="number" min={1} max={doc.pages || 1} style={inputStyle} value={form.page} onChange={(event) => set({ page: event.target.value })} />
                </div>
                <div style={{ padding: 14, border: `1px solid #ddd6fe`, borderRadius: 8, background: "#faf7ff" }}>
                  <div style={{ fontWeight: 900, fontSize: 12, color: ACC }}>SIGNATAIRE</div>
                  <div style={{ fontSize: 12.5, fontWeight: 850, marginTop: 8 }}>{party?.raisonSociale || "Aucun tiers selectionne"}</div>
                  <div style={{ color: MUT, fontSize: 11.5, marginTop: 4 }}>{form.email || "-"}</div>
                  <div style={{ color: MUT, fontSize: 11.5, marginTop: 4 }}>Delai : {form.validityDays || "-"} jour(s)</div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "12px 20px", borderTop: `1px solid ${BD}`, background: BG }}>
          <button onClick={onClose} style={{ border: `1px solid ${BD}`, borderRadius: 7, background: WH, padding: "8px 15px", cursor: "pointer", fontFamily: FONT }}>Annuler</button>
          {tab === "third-party"
            ? <button onClick={() => setTab("zone")} disabled={!canGenerate} style={{ border: "none", borderRadius: 7, background: canGenerate ? ACC : "#cbd5e1", color: WH, padding: "8px 15px", cursor: canGenerate ? "pointer" : "not-allowed", fontFamily: FONT, fontWeight: 800 }}>Suivant : Configuration zone ›</button>
            : <button onClick={generate} disabled={!canGenerate} style={{ border: "none", borderRadius: 7, background: canGenerate ? GREEN : "#cbd5e1", color: WH, padding: "8px 15px", cursor: canGenerate ? "pointer" : "not-allowed", fontFamily: FONT, fontWeight: 800 }}>✓ Generer le document a signer</button>}
        </div>
      </div>
    </div>
  );
}

const STATUS_CONF = {
  pending: ["En attente de signature externe", ORANGE, "#fffbeb"],
  otp_sent: ["OTP envoye au tiers", BLUE, "#eff6ff"],
  otp_verified: ["Acces tiers authentifie", BLUE, "#eff6ff"],
  expired: ["Lien expire", RED, "#fef2f2"],
  reactivation_requested: ["Reactivation demandee", RED, "#fef2f2"],
  signed: ["Signe par le tiers", GREEN, "#ecfdf5"],
};

export function ExternalSignatureStatusPanel({ requestId, authUser, onRequestChange }) {
  const [request, setRequest] = useState(() => getExternalRequestById(requestId));
  const [historyOpen, setHistoryOpen] = useState(false);
  const refresh = () => setRequest(getExternalRequestById(requestId));
  useEffect(() => {
    refresh();
    window.addEventListener(STORE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(STORE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [requestId]);
  if (!request) return null;
  const status = effectiveExternalStatus(request);
  const conf = STATUS_CONF[status] || STATUS_CONF.pending;
  const change = (next) => {
    if (!next) return;
    setRequest(next);
    onRequestChange?.(next);
  };
  return (
    <>
      <div style={{ border: `1px solid ${conf[1]}44`, borderRadius: 10, padding: 14, background: conf[2], fontFamily: FONT }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
          <div>
            <div style={{ color: conf[1], fontWeight: 900, fontSize: 13 }}>{conf[0]}</div>
            <div style={{ color: MUT, fontSize: 11.5, marginTop: 5 }}>{request.thirdPartyName} · {request.email}</div>
            <div style={{ color: MUT, fontSize: 11.5, marginTop: 3 }}>Lien valable jusqu'au {formatDate(request.expiresAt)}</div>
            {request.signedAt && <div style={{ color: GREEN, fontSize: 11.5, marginTop: 3 }}>Signe le {formatDate(request.signedAt)} · IP {request.signerIp}</div>}
          </div>
          <span style={{ borderRadius: 20, background: WH, color: conf[1], padding: "4px 9px", fontWeight: 900, fontSize: 10.5 }}>{status}</span>
        </div>
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 12 }}>
          {["pending", "otp_sent", "otp_verified"].includes(status) && <button onClick={() => change(remindExternalSignature(request.id, authUser?.nom))} style={smallButton(BLUE)}>Relancer</button>}
          {["expired", "reactivation_requested"].includes(status) && <button onClick={() => change(reactivateExternalSignature(request.id, authUser?.nom))} style={smallButton(ACC)}>Regenerer le lien et renvoyer l'email</button>}
          <button onClick={() => setHistoryOpen(true)} style={smallButton("#475569")}>Historique des relances</button>
        </div>
      </div>
      {historyOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(15,23,42,.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ width: "min(700px,95vw)", maxHeight: "82vh", overflow: "auto", background: WH, borderRadius: 12, padding: 20, fontFamily: FONT }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}><b style={{ flex: 1 }}>Historique et tracabilite - {request.docRef}</b><button onClick={() => setHistoryOpen(false)} style={{ border: "none", background: "transparent", fontSize: 22, cursor: "pointer" }}>×</button></div>
            {(request.actions || []).slice().reverse().map((action) => <div key={action.id} style={{ padding: "10px 0", borderTop: `1px solid ${BD}`, fontSize: 12.5 }}><b>{action.label}</b><div style={{ color: MUT, marginTop: 3 }}>{formatDate(action.at)} · {action.actor}{action.ip ? ` · IP ${action.ip}` : ""}</div></div>)}
            {request.proof && <div style={{ padding: 12, marginTop: 12, borderRadius: 8, background: "#ecfdf5", color: "#065f46", fontSize: 12 }}><b>Preuve de signature conservee</b><div style={{ marginTop: 4 }}>OTP valide le {formatDate(request.proof.otpVerifiedAt)} · IP {request.proof.ip}</div></div>}
          </div>
        </div>
      )}
    </>
  );
}

function smallButton(color) {
  return { border: `1px solid ${color}`, borderRadius: 7, background: WH, color, padding: "6px 10px", cursor: "pointer", fontFamily: FONT, fontSize: 11.5, fontWeight: 800 };
}

function EmailBody({ mail }) {
  const data = mail.data || {};
  if (mail.type === "otp") return (
    <div>
      <h2 style={{ color: "#172033" }}>Code de verification SoftSign</h2>
      <p>Un acces securise au document <b>{data.docRef}</b> vient d'etre demande.</p>
      <div style={{ margin: "24px 0", padding: 18, borderRadius: 10, textAlign: "center", background: "#f5f3ff", border: "1px solid #ddd6fe", color: ACC_DARK, fontSize: 30, letterSpacing: 8, fontWeight: 950 }}>{data.code}</div>
      <p style={{ color: MUT }}>Ce code est a usage unique et expire le {formatDate(data.expiresAt)}.</p>
    </div>
  );
  if (mail.type === "reactivation_requested") return (
    <div><h2>Reactivation demandee</h2><p><b>{data.thirdPartyName}</b> demande un nouveau lien pour signer <b>{data.docRef}</b>.</p><p>Ouvrez le detail du document dans SoftSign pour regenerer le lien et renvoyer l'email.</p></div>
  );
  if (mail.type === "signed_confirmation") return (
    <div><h2 style={{ color: GREEN }}>Document signe par le tiers</h2><p><b>{data.thirdPartyName}</b> a signe <b>{data.docRef}</b>.</p><p>Le document signe a ete reintegre automatiquement au workflow le {formatDate(data.signedAt)}.</p></div>
  );
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 14, borderBottom: `2px solid ${ACC}` }}>
        <img src="/softsign.png" alt="SoftSign" style={{ height: 34 }} />
        <div><div style={{ fontSize: 19, fontWeight: 950, color: ACC_DARK }}>SoftSign</div><div style={{ color: MUT, fontSize: 10 }}>by Softwell</div></div>
        <div style={{ marginLeft: "auto", color: MUT, fontSize: 10, textAlign: "right" }}>Ceci est un email automatique.<br />Merci de ne pas y repondre.</div>
      </div>
      <p>Bonjour,</p>
      <p>Vous etes invite a signer un document de maniere electronique. Merci de consulter le document et d'apposer votre signature.</p>
      <div style={{ border: `1px solid ${BD}`, borderRadius: 9, padding: 14, margin: "16px 0", background: BG }}>
        <div style={{ display: "grid", gap: 7, fontSize: 12.5 }}>
          <div><b>Reference du document :</b> <span style={{ color: ACC }}>{data.docRef}</span></div>
          <div><b>Titre du document :</b> {data.docTitle}</div>
          <div><b>Piece jointe :</b> {mail.attachment}</div>
        </div>
      </div>
      {data.message && <div style={{ padding: 14, borderRadius: 9, background: "#faf7ff", border: "1px solid #ede9fe", fontSize: 12.5, whiteSpace: "pre-line" }}><b style={{ color: ACC }}>Message de l'emetteur</b><div style={{ marginTop: 7 }}>{data.message}</div></div>}
      <div style={{ margin: "15px 0", padding: 14, borderRadius: 9, background: "#eff6ff", border: "1px solid #dbeafe", fontSize: 12.5 }}><b style={{ color: BLUE }}>Delai maximal de traitement : {formatDate(data.expiresAt)}</b><div style={{ marginTop: 4, color: MUT }}>Passe ce delai, le lien expirera et une nouvelle demande pourra etre envoyee.</div></div>
      <div style={{ textAlign: "center", margin: "20px 0 4px" }}><a href={data.secureUrl} target="_blank" rel="noreferrer" style={{ display: "inline-block", borderRadius: 7, padding: "10px 24px", color: WH, background: ACC, textDecoration: "none", fontWeight: 850, fontSize: 12.5 }}>Signer le document</a><div style={{ marginTop: 8, color: ACC, fontSize: 10 }}>(Lien securise unique)</div></div>
    </div>
  );
}

export function ExternalSignatureMailbox({ recipientEmail = "", title = "Boite de reception", emptyMessage = "Les emails de signature et les codes OTP apparaitront ici." }) {
  const allMails = useExternalStore(MAILS_KEY);
  const mails = useMemo(() => {
    const recipient = String(recipientEmail || "").trim().toLowerCase();
    return recipient ? allMails.filter((mail) => String(mail.to || "").trim().toLowerCase() === recipient) : allMails;
  }, [allMails, recipientEmail]);
  const [selectedId, setSelectedId] = useState("");
  const [previewAttachment, setPreviewAttachment] = useState(null);
  const selected = mails.find((mail) => mail.id === selectedId) || mails[0];
  const selectedAttachmentSource = selected?.attachmentSource || requestFileSource(getExternalRequestById(selected?.requestId));
  useEffect(() => {
    if (!selectedId && mails[0]) setSelectedId(mails[0].id);
  }, [mails, selectedId]);
  const choose = (mail) => {
    setSelectedId(mail.id);
    if (!mail.read) writeStore(MAILS_KEY, allMails.map((item) => item.id === mail.id ? { ...item, read: true } : item));
  };
  return (
    <div style={{ height: "calc(100vh - 105px)", minHeight: 560, border: `1px solid ${BD}`, background: WH, borderRadius: 11, overflow: "hidden", display: "grid", gridTemplateColumns: "330px 1fr", fontFamily: FONT }}>
      <div style={{ borderRight: `1px solid ${BD}`, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div style={{ padding: "16px 17px", borderBottom: `1px solid ${BD}` }}><div style={{ fontSize: 19, fontWeight: 950, color: "#172033" }}>{title}</div><div style={{ color: MUT, fontSize: 11.5, marginTop: 3 }}>{mails.length} email(s) simule(s)</div></div>
        <div style={{ overflowY: "auto" }}>
          {mails.map((mail) => <button key={mail.id} onClick={() => choose(mail)} style={{ width: "100%", border: "none", borderBottom: `1px solid ${BD}`, borderLeft: `3px solid ${selected?.id === mail.id ? ACC : "transparent"}`, background: selected?.id === mail.id ? "#faf7ff" : WH, padding: "13px 14px", textAlign: "left", cursor: "pointer", fontFamily: FONT }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}><span style={{ color: mail.read ? MUT : ACC, fontWeight: 950, fontSize: 12 }}>{mail.from}</span>{!mail.read && <span style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: ACC }} />}</div>
            <div style={{ color: "#1e293b", fontWeight: mail.read ? 700 : 900, fontSize: 12.5, marginTop: 5, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{mail.subject}</div>
            <div style={{ color: MUT, fontSize: 11, marginTop: 5 }}>{formatDate(mail.sentAt)}</div>
          </button>)}
          {!mails.length && <div style={{ padding: 30, color: MUT, textAlign: "center", fontSize: 12.5 }}>{emptyMessage}</div>}
        </div>
      </div>
      <div style={{ minWidth: 0, overflowY: "auto", background: "#f8fafc", padding: 20 }}>
        {selected ? (
          <div style={{ maxWidth: 720, margin: "0 auto", background: WH, border: `1px solid ${BD}`, borderRadius: 9, padding: 22, boxShadow: "0 5px 18px rgba(15,23,42,.05)" }}>
            <div style={{ borderBottom: `1px solid ${BD}`, paddingBottom: 13, marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 950, color: "#172033" }}>{selected.subject}</div>
              <div style={{ display: "flex", gap: 12, color: MUT, fontSize: 11.5, marginTop: 7 }}><span>De : {selected.from}</span><span>A : {selected.to}</span><span>{formatDate(selected.sentAt)}</span></div>
              {selected.attachment && <div style={{ marginTop: 10, display: "flex", gap: 7, alignItems: "center", flexWrap: "wrap" }}><span style={{ display: "inline-flex", gap: 6, padding: "6px 9px", borderRadius: 7, color: BLUE, background: "#eff6ff", fontSize: 11.5, fontWeight: 800 }}>📎 {selected.attachment}</span>{selectedAttachmentSource && <><button onClick={() => setPreviewAttachment({ source: selectedAttachmentSource, filename: selected.attachment })} style={smallButton(BLUE)}>Visualiser</button><button onClick={() => downloadSource(selectedAttachmentSource, selected.attachment)} style={smallButton(GREEN)}>Telecharger</button></>}</div>}
            </div>
            <EmailBody mail={selected} />
          </div>
        ) : <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center", color: MUT }}>Selectionnez un email.</div>}
      </div>
      {previewAttachment && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(15,23,42,.64)" }}>
          <div style={{ width: "min(1080px,96vw)", height: "min(820px,92vh)", display: "flex", flexDirection: "column", borderRadius: 12, overflow: "hidden", background: WH, boxShadow: "0 24px 80px rgba(15,23,42,.32)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderBottom: `1px solid ${BD}` }}><b style={{ flex: 1 }}>{previewAttachment.filename}</b><button onClick={() => downloadSource(previewAttachment.source, previewAttachment.filename)} style={smallButton(GREEN)}>Telecharger</button><button onClick={() => setPreviewAttachment(null)} style={{ border: "none", background: "#f1f5f9", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", fontSize: 20 }}>×</button></div>
            <iframe src={previewSource(previewAttachment.source)} title={`Apercu de ${previewAttachment.filename}`} style={{ flex: 1, width: "100%", border: 0, background: "#525659" }} />
          </div>
        </div>
      )}
    </div>
  );
}

function SignatureCanvas({ onChange }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = WH;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2.7;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#172033";
  }, []);
  const point = (event) => {
    const canvas = canvasRef.current;
    const box = canvas.getBoundingClientRect();
    const source = event.touches?.[0] || event;
    return { x: (source.clientX - box.left) * canvas.width / box.width, y: (source.clientY - box.top) * canvas.height / box.height };
  };
  const down = (event) => { event.preventDefault(); drawing.current = true; const value = point(event); const ctx = canvasRef.current.getContext("2d"); ctx.beginPath(); ctx.moveTo(value.x, value.y); };
  const move = (event) => { if (!drawing.current) return; event.preventDefault(); const value = point(event); const ctx = canvasRef.current.getContext("2d"); ctx.lineTo(value.x, value.y); ctx.stroke(); onChange(canvasRef.current.toDataURL("image/png")); };
  const up = () => { drawing.current = false; onChange(canvasRef.current?.toDataURL("image/png") || ""); };
  return <canvas ref={canvasRef} width={360} height={140} onMouseDown={down} onMouseMove={move} onMouseUp={up} onMouseLeave={up} onTouchStart={down} onTouchMove={move} onTouchEnd={up} style={{ width: "100%", border: `2px dashed #c4b5fd`, borderRadius: 8, background: WH, touchAction: "none", cursor: "crosshair" }} />;
}

export function ExternalSignaturePortal({ token }) {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [signatureMode, setSignatureMode] = useState("draw");
  const [signatureValue, setSignatureValue] = useState("");
  const [signed, setSigned] = useState(false);
  const [reactivationSent, setReactivationSent] = useState(false);
  useEffect(() => {
    const found = getExternalRequestByToken(token);
    if (!found) {
      setLoading(false);
      return;
    }
    const status = effectiveExternalStatus(found);
    if (!["signed", "expired", "reactivation_requested"].includes(status)) {
      const withOtp = generateExternalOtp(token);
      setRequest(withOtp || found);
    } else {
      setRequest(found);
      setSigned(status === "signed");
    }
    setLoading(false);
  }, [token]);
  const status = effectiveExternalStatus(request);
  const source = requestFileSource(request);
  const verify = () => {
    const result = verifyExternalOtp(token, otpValue);
    if (!result.ok) {
      setOtpError(result.error);
      return;
    }
    setRequest(result.request);
    setAuthenticated(true);
    setOtpError("");
  };
  const resendOtp = () => {
    const next = generateExternalOtp(token);
    if (next) setRequest(next);
    setOtpValue("");
    setOtpError("");
  };
  const sign = () => {
    if (!signatureValue) return;
    const next = completeExternalSignature(token, { mode: signatureMode, value: signatureValue });
    if (next) {
      setRequest(next);
      setSigned(true);
    }
  };
  if (loading) return <PortalFrame><div style={{ padding: 60, textAlign: "center" }}>Chargement du lien securise...</div></PortalFrame>;
  if (!request) return <PortalFrame><InfoState title="Lien invalide" text="Ce lien de signature n'existe pas ou n'est plus disponible." color={RED} /></PortalFrame>;
  if (status === "expired" || status === "reactivation_requested") return (
    <PortalFrame request={request}>
      <InfoState title="Ce lien a expire" text="Le delai maximal de signature est depasse. Vous pouvez demander a l'emetteur de generer un nouveau lien securise." color={RED}>
        <button disabled={reactivationSent || status === "reactivation_requested"} onClick={() => { requestExternalReactivation(token); setReactivationSent(true); }} style={{ ...portalButton(ACC), opacity: reactivationSent || status === "reactivation_requested" ? .55 : 1 }}>
          {reactivationSent || status === "reactivation_requested" ? "Demande de reactivation envoyee" : "Demander la reactivation du lien"}
        </button>
      </InfoState>
    </PortalFrame>
  );
  if (signed || status === "signed") return <PortalFrame request={request}><InfoState title="Document signe avec succes" text="Votre signature a ete enregistree. Le document a ete reintegre automatiquement dans le workflow SoftSign." color={GREEN} /></PortalFrame>;
  if (!authenticated) return (
    <PortalFrame request={request}>
      <div style={{ maxWidth: 560, margin: "42px auto", padding: 24, border: `1px solid ${BD}`, borderRadius: 12, background: WH, boxShadow: "0 10px 30px rgba(15,23,42,.06)" }}>
        <h2 style={{ margin: 0, color: "#172033" }}>Verification OTP requise</h2>
        <p style={{ color: MUT, lineHeight: 1.6 }}>Un code a usage unique vient d'etre envoye a <b>{request.email}</b>. Consultez la boite mail de demonstration SoftSign.</p>
        <div style={{ display: "flex", gap: 8 }}><input style={{ ...inputStyle, fontSize: 17, letterSpacing: 4 }} value={otpValue} onChange={(event) => setOtpValue(event.target.value)} placeholder="Code OTP" maxLength={6} /><button onClick={verify} style={portalButton(BLUE)}>Verifier le code</button></div>
        {otpError && <div style={{ color: RED, fontSize: 12, marginTop: 9 }}>{otpError}</div>}
        <button onClick={resendOtp} style={{ border: "none", background: "transparent", color: BLUE, fontFamily: FONT, fontWeight: 750, fontSize: 12, cursor: "pointer", marginTop: 14 }}>Renvoyer le code OTP</button>
      </div>
    </PortalFrame>
  );
  return (
    <PortalFrame request={request}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 310px", gap: 16, padding: 18, maxWidth: 1260, margin: "0 auto" }}>
        <div style={{ minHeight: 560, background: "#273047", borderRadius: 9, display: "flex", justifyContent: "center", padding: 20 }}>
          <div style={{ width: "100%", minHeight: 680, background: WH, position: "relative", overflow: "hidden", boxShadow: "0 5px 22px rgba(0,0,0,.24)" }}>
            {source
              ? <iframe src={previewSource(source)} title={`Document a signer - ${request.docRef}`} style={{ width: "100%", height: 680, border: 0, display: "block" }} />
              : <div style={{ padding: 42 }}><div style={{ fontFamily: "Georgia,serif", fontWeight: 950, textAlign: "center", fontSize: 18 }}>SOFTWELL MADAGASCAR</div><h3 style={{ marginTop: 32, textAlign: "center" }}>{request.docTitle}</h3><p style={{ color: MUT, lineHeight: 1.8 }}>Reference {request.docRef}. Veuillez consulter le document puis apposer votre signature dans la zone prevue.</p></div>}
            <div style={{ position: "absolute", right: 36, bottom: 50, width: Math.max(145, Number(request.zone?.width || 190)), height: Math.max(54, Number(request.zone?.height || 70)), border: `2px dashed ${ACC}`, background: "#faf7ffee", color: ACC, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 11 }}>ZONE DE SIGNATURE</div>
          </div>
        </div>
        <div style={{ display: "grid", alignContent: "start", gap: 12 }}>
          <div style={{ padding: 14, border: `1px solid ${BD}`, borderRadius: 9, background: WH }}><b>Informations du signataire</b><div style={{ color: MUT, fontSize: 12, lineHeight: 1.8, marginTop: 8 }}>Nom / Raison sociale<br /><b style={{ color: "#334155" }}>{request.thirdPartyName}</b><br />Email<br /><b style={{ color: "#334155" }}>{request.email}</b><br />NIF<br /><b style={{ color: "#334155" }}>{request.taxId}</b></div></div>
          <div style={{ padding: 14, border: `1px solid ${BD}`, borderRadius: 9, background: WH }}>
            <b>Methode de signature</b>
            <div style={{ display: "flex", gap: 0, border: `1px solid ${BD}`, borderRadius: 7, overflow: "hidden", margin: "10px 0" }}>
              {[["draw", "Dessiner"], ["image", "Importer"]].map(([id, label]) => <button key={id} onClick={() => { setSignatureMode(id); setSignatureValue(""); }} style={{ flex: 1, border: "none", padding: "8px 4px", background: signatureMode === id ? ACC : WH, color: signatureMode === id ? WH : MUT, cursor: "pointer", fontFamily: FONT, fontWeight: 800 }}>{label}</button>)}
            </div>
            {signatureMode === "draw" ? <SignatureCanvas onChange={setSignatureValue} /> : <label style={{ minHeight: 110, border: `2px dashed #c4b5fd`, borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: MUT, textAlign: "center", cursor: "pointer", fontSize: 12 }}><input type="file" accept=".png,.jpg,.jpeg" style={{ display: "none" }} onChange={(event) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => setSignatureValue(reader.result); reader.readAsDataURL(file); }} />Importer une image de signature<br /><small>PNG ou JPEG · max recommande 2 Mo</small></label>}
            {signatureValue && <img src={signatureValue} alt="Apercu signature" style={{ width: "100%", maxHeight: 85, objectFit: "contain", border: `1px solid ${BD}`, borderRadius: 7, marginTop: 10 }} />}
          </div>
          <button disabled={!signatureValue} onClick={sign} style={{ ...portalButton(GREEN), opacity: signatureValue ? 1 : .5, width: "100%" }}>Valider la signature</button>
        </div>
      </div>
    </PortalFrame>
  );
}

function PortalFrame({ request, children }) {
  return (
    <div style={{ minHeight: "100vh", background: "#f6f7fb", color: "#172033", fontFamily: FONT }}>
      <header style={{ minHeight: 70, padding: "12px 24px", display: "flex", alignItems: "center", gap: 15, background: WH, borderBottom: `1px solid ${BD}` }}>
        <img src="/softsign.png" alt="SoftSign" style={{ height: 40 }} />
        {request && <><div style={{ width: 1, height: 35, background: BD }} /><div style={{ fontSize: 12.5, lineHeight: 1.7 }}><b>Reference :</b> {request.docRef}<br /><b>Titre :</b> {request.docTitle}</div><div style={{ marginLeft: "auto", color: ACC, background: "#f5f3ff", borderRadius: 8, padding: "9px 13px", fontWeight: 800, fontSize: 12 }}>Lien securise SoftSign</div></>}
      </header>
      {children}
    </div>
  );
}

function InfoState({ title, text, color, children }) {
  return <div style={{ maxWidth: 600, margin: "70px auto", padding: 30, textAlign: "center", border: `1px solid ${color}44`, borderRadius: 13, background: WH, boxShadow: "0 12px 35px rgba(15,23,42,.07)" }}><div style={{ width: 58, height: 58, margin: "0 auto 14px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: `${color}14`, color, fontSize: 28, fontWeight: 950 }}>✓</div><h2 style={{ color, marginBottom: 10 }}>{title}</h2><p style={{ color: MUT, lineHeight: 1.7 }}>{text}</p>{children && <div style={{ marginTop: 18 }}>{children}</div>}</div>;
}

function portalButton(color) {
  return { border: "none", borderRadius: 7, background: color, color: WH, padding: "10px 14px", cursor: "pointer", fontFamily: FONT, fontWeight: 850, whiteSpace: "nowrap" };
}
