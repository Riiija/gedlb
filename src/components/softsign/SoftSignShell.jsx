"use client";

import { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";
import { useIsMobile } from "../../lib/useResponsive";
import { SidebarSS } from "./SidebarSS";
import { Topbar } from "../layout/Topbar";
import SSOperational, { SOFTSIGN_DEFAULTS, ensureSoftSignSeeds } from "./SSOperational";
import { INIT_SS_NOTIFICATIONS } from "./dataSS";
import { applyAutomaticDocumentReminders, SS_DEFAULT_REMINDERS } from "./softsignCore";
import { applyAutomaticExternalSignatureReminders } from "./ExternalSignature";

const LS = "ss_";
const lsGet = (key) => {
  try {
    const value = localStorage.getItem(LS + key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};
const lsSet = (key, value) => {
  try {
    localStorage.setItem(LS + key, JSON.stringify(value));
  } catch {}
};
const lsDel = (key) => {
  try {
    localStorage.removeItem(LS + key);
  } catch {}
};

const BG = "#f4f6f9";
const WH = "#fff";
const BD = "#e3e6ea";

const clone = (value) => JSON.parse(JSON.stringify(value));

function activeStepCount(doc) {
  return (doc.steps || []).filter((step) => step.status === "active").length;
}

export default function SoftSignShell() {
  const { view, setView, authUser, sidebarOpen, setSidebarOpen } = useApp();
  const isMobile = useIsMobile();

  const [ssDocs, setSsDocs] = useState(() => ensureSoftSignSeeds(lsGet("docs"), clone(SOFTSIGN_DEFAULTS.docs)));
  const [ssWorkflows, setSsWorkflows] = useState(() => {
    const stored = lsGet("workflows");
    // Migrate old format (etapes/nom/actif) → drop and use defaults
    if (Array.isArray(stored) && stored.length && stored[0].steps === undefined) {
      lsDel("workflows");
      return clone(SOFTSIGN_DEFAULTS.workflows);
    }
    return ensureSoftSignSeeds(stored, clone(SOFTSIGN_DEFAULTS.workflows));
  });
  const [ssNotifs, setSsNotifs] = useState(() => ensureSoftSignSeeds(lsGet("notifs"), clone(INIT_SS_NOTIFICATIONS)));
  const [ssExternalAccounts, setSsExternalAccounts] = useState(() => ensureSoftSignSeeds(lsGet("externalAccounts"), clone(SOFTSIGN_DEFAULTS.externalAccounts)));
  const [ssSignatures, setSsSignatures] = useState(() => ensureSoftSignSeeds(lsGet("signatures"), clone(SOFTSIGN_DEFAULTS.signatures)));
  const [ssDelegations, setSsDelegations] = useState(() => ensureSoftSignSeeds(lsGet("delegations"), clone(SOFTSIGN_DEFAULTS.delegations)));
  const [ssOtpConfig, setSsOtpConfig] = useState(() => lsGet("otpConfig") || clone(SOFTSIGN_DEFAULTS.otpConfig));
  const [ssLicense, setSsLicense] = useState(() => lsGet("license") || clone(SOFTSIGN_DEFAULTS.license));
  const [ssGeneralSettings, setSsGeneralSettings] = useState(() => lsGet("generalSettings") || clone(SOFTSIGN_DEFAULTS.generalSettings));
  const [ssAudit, setSsAudit] = useState(() => lsGet("audit") || [
    { date: "2026-05-21T09:15:00", user: "Système SoftSign", action: "signature_par_delegation", detail: "Signé par Randria Marie-Claire (par délégation de Razafy Pierre) — Document : Contrat Maintenance Climatisation" },
    { date: "2026-05-20T14:30:00", user: "Système SoftSign", action: "delegation_appliquee", detail: "Tâche de validation affectée à Andriamananjara Lova (délégation DEL-002 de Razafy Pierre)" },
    { date: "2026-05-19T16:42:00", user: "Rakoto Jean-Baptiste", action: "creation_delegation", detail: "Délégation créée : Rakoto Jean-Baptiste → Razafy Pierre (2026-05-20 → 2026-06-20)" },
  ]);
  const [ssUserSettings, setSsUserSettings] = useState(() => lsGet("userSettings") || {});
  const [reminderTick, setReminderTick] = useState(0);
  const [showReset, setShowReset] = useState(false);

  /* ── Theme: apply on mount and whenever appConfig changes ── */
  useEffect(() => {
    const applyTheme = () => {
      try {
        const cfg = localStorage.getItem("ss_appConfig");
        const theme = cfg ? JSON.parse(cfg).theme || "light" : "light";
        document.documentElement.setAttribute("data-theme", theme);
      } catch {
        document.documentElement.setAttribute("data-theme", "light");
      }
    };
    applyTheme();
    const handler = () => applyTheme();
    window.addEventListener("ss-theme-change", handler);
    return () => window.removeEventListener("ss-theme-change", handler);
  }, []);

  useEffect(() => lsSet("docs", ssDocs), [ssDocs]);
  useEffect(() => lsSet("workflows", ssWorkflows), [ssWorkflows]);
  useEffect(() => lsSet("notifs", ssNotifs), [ssNotifs]);
  useEffect(() => lsSet("externalAccounts", ssExternalAccounts), [ssExternalAccounts]);
  useEffect(() => lsSet("signatures", ssSignatures), [ssSignatures]);
  useEffect(() => lsSet("delegations", ssDelegations), [ssDelegations]);
  useEffect(() => lsSet("otpConfig", ssOtpConfig), [ssOtpConfig]);
  useEffect(() => lsSet("license", ssLicense), [ssLicense]);
  useEffect(() => lsSet("generalSettings", ssGeneralSettings), [ssGeneralSettings]);
  useEffect(() => lsSet("audit", ssAudit), [ssAudit]);
  useEffect(() => lsSet("userSettings", ssUserSettings), [ssUserSettings]);

  useEffect(() => {
    const refreshExternalState = () => {
      setSsDocs(ensureSoftSignSeeds(lsGet("docs"), clone(SOFTSIGN_DEFAULTS.docs)));
      setSsNotifs(ensureSoftSignSeeds(lsGet("notifs"), clone(INIT_SS_NOTIFICATIONS)));
    };
    window.addEventListener("storage", refreshExternalState);
    window.addEventListener("ss-external-signature-change", refreshExternalState);
    return () => {
      window.removeEventListener("storage", refreshExternalState);
      window.removeEventListener("ss-external-signature-change", refreshExternalState);
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setReminderTick((tick) => tick + 1), 60000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let reminderConfig = SS_DEFAULT_REMINDERS;
    try {
      const saved = localStorage.getItem("ss_relancesConfig");
      if (saved) reminderConfig = { ...reminderConfig, ...JSON.parse(saved) };
    } catch {}
    applyAutomaticExternalSignatureReminders(reminderConfig);
    const result = applyAutomaticDocumentReminders(ssDocs, reminderConfig);
    if (!result.changed) return;
    setSsDocs(result.docs);
    setSsNotifs((current) => {
      const existing = new Set(current.map((item) => item.id));
      return [...result.notifications.filter((item) => !existing.has(item.id)), ...current];
    });
    setSsAudit((current) => {
      const existing = new Set(current.map((item) => item.reminderId).filter(Boolean));
      return [...result.audit.filter((item) => !existing.has(item.reminderId)), ...current].slice(0, 300);
    });
  }, [reminderTick, ssDocs]);

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [view, isMobile, setSidebarOpen]);

  const doReset = () => {
    setSsDocs(clone(SOFTSIGN_DEFAULTS.docs));
    setSsWorkflows(clone(SOFTSIGN_DEFAULTS.workflows));
    setSsNotifs(clone(INIT_SS_NOTIFICATIONS));
    setSsExternalAccounts(clone(SOFTSIGN_DEFAULTS.externalAccounts));
    setSsSignatures(clone(SOFTSIGN_DEFAULTS.signatures));
    setSsDelegations(clone(SOFTSIGN_DEFAULTS.delegations));
    setSsOtpConfig(clone(SOFTSIGN_DEFAULTS.otpConfig));
    setSsLicense(clone(SOFTSIGN_DEFAULTS.license));
    setSsGeneralSettings(clone(SOFTSIGN_DEFAULTS.generalSettings));
    setSsAudit([]);
    setSsUserSettings({});
    ["docs", "workflows", "notifs", "externalAccounts", "signatures", "delegations", "otpConfig", "license", "generalSettings", "audit", "userSettings"].forEach(lsDel);
    try {
      localStorage.removeItem("ss_externalSignatureRequests");
      localStorage.removeItem("ss_externalMailbox");
      localStorage.removeItem("ss_relancesConfig");
      localStorage.removeItem("ss_emailTemplates");
      localStorage.removeItem("ss_appConfig");
      localStorage.removeItem("ss_rolePerms");
      localStorage.removeItem("ss_savedSearch");
    } catch {}
    setShowReset(false);
  };

  const counts = {
    totalDocs: ssDocs.length,
    internes: ssDocs.filter((doc) => doc.origin === "interne").length,
    externes: ssDocs.filter((doc) => doc.origin === "externe").length,
    enCours: ssDocs.filter((doc) => ["en_cours", "en_attente_signature_externe", "signe_tiers"].includes(doc.status)).length,
    signes: ssDocs.filter((doc) => doc.status === "signe" || doc.status === "termine" || doc.status === "signe_tiers").length,
    rejetes: ssDocs.filter((doc) => doc.status === "rejete").length,
    archives: ssDocs.filter((doc) => doc.status === "archive" || doc.status === "termine").length,
    aTraiter: ssDocs.filter((doc) => activeStepCount(doc)).length,
    aValider: ssDocs.filter((doc) => (doc.steps || []).some((step) => step.status === "active" && step.action === "validation")).length,
    aSignerCount: ssDocs.filter((doc) => (doc.steps || []).some((step) => step.status === "active" && ["signature", "paraphe"].includes(step.action))).length,
    recus: ssDocs.filter((doc) => doc.status === "recu" || doc.status === "en_attente_traitement").length,
    extAttente: ssDocs.filter((doc) => doc.origin === "externe" && doc.status === "en_attente_traitement").length,
    alertes: ssDocs.filter((doc) => ["en_cours", "en_attente_traitement"].includes(doc.status)).length,
    fournisseurs: ssExternalAccounts.length,
    comptesAttente: ssExternalAccounts.filter((account) => account.status === "en_attente").length,
    notifNonLues: ssNotifs.filter((notif) => !notif.lu).length,
    certificats: ssDocs.filter((doc) => doc.status === "termine" || doc.status === "signe").length,
    urgentActions: ssDocs.filter((doc) => (doc.steps || []).some((step) => {
      if (step.status !== "active") return false;
      const diff = step.dueAt ? new Date(step.dueAt) - Date.now() : Infinity;
      return diff < 0 || diff < 2 * 86400000;
    })).length,
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--ss-bg, #f4f6f9)", position: "relative" }}>
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 9998 }}
        />
      )}

      <div
        style={
          isMobile
            ? {
                position: "fixed",
                left: 0,
                top: 0,
                bottom: 0,
                zIndex: 9999,
                transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
                transition: "transform .3s cubic-bezier(.22,1,.36,1)",
                boxShadow: sidebarOpen ? "4px 0 24px rgba(0,0,0,.2)" : "none",
              }
            : {}
        }
      >
        <SidebarSS view={view} setView={setView} counts={counts} onReset={() => setShowReset(true)} authUser={authUser} />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <Topbar />
        <main style={{ flex: 1, overflowY: "auto", padding: isMobile ? 12 : 20, WebkitOverflowScrolling: "touch" }}>
          <SSOperational
            view={view}
            setView={setView}
            docs={ssDocs}
            setDocs={setSsDocs}
            workflows={ssWorkflows}
            setWorkflows={setSsWorkflows}
            notifs={ssNotifs}
            setNotifs={setSsNotifs}
            externalAccounts={ssExternalAccounts}
            setExternalAccounts={setSsExternalAccounts}
            signatures={ssSignatures}
            setSignatures={setSsSignatures}
            delegations={ssDelegations}
            setDelegations={setSsDelegations}
            otpConfig={ssOtpConfig}
            setOtpConfig={setSsOtpConfig}
            license={ssLicense}
            setLicense={setSsLicense}
            generalSettings={ssGeneralSettings}
            setGeneralSettings={setSsGeneralSettings}
            audit={ssAudit}
            setAudit={setSsAudit}
            userSettings={ssUserSettings}
            setUserSettings={setSsUserSettings}
          />
        </main>
      </div>

      {showReset && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: WH, borderRadius: 12, maxWidth: 420, width: "100%", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,.3)" }}>
            <div style={{ background: "#c0392b", padding: "14px 20px" }}>
              <span style={{ color: WH, fontWeight: 700, fontSize: 14 }}>Reinitialiser les donnees SoftSign</span>
            </div>
            <div style={{ padding: "20px 24px" }}>
              <p style={{ fontSize: 13.5, color: "#212529", marginBottom: 8, fontWeight: 600 }}>Toutes les donnees SoftSign seront remises a zero.</p>
              <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>Cette action est irreversible.</p>
            </div>
            <div style={{ padding: "12px 20px", borderTop: `1px solid ${BD}`, display: "flex", justifyContent: "flex-end", gap: 10, background: "#f8f9fc" }}>
              <button
                onClick={() => setShowReset(false)}
                style={{ padding: "8px 16px", borderRadius: 6, border: `1px solid ${BD}`, background: WH, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}
              >
                Annuler
              </button>
              <button
                onClick={doReset}
                style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: "#c0392b", color: WH, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit" }}
              >
                Reinitialiser
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
