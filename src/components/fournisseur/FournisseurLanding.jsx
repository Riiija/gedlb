"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useT } from "../../lib/i18n";
import { FournisseurPortal } from "./FournisseurPortal";
import { FournisseurSuivi } from "./FournisseurSuivi";
import FournisseurSign from "./FournisseurSign";

const NAVY = "#172856";
const NAVY_2 = "#13244b";
const CYAN = "#14d7c3";
const BLUE = "#5aa7ff";
const PURPLE = "#8b5cf6";
const WHITE = "#ffffff";
const MUTED = "rgba(255,255,255,.58)";

const SOFTDOCS_AUTH_KEY = "softdocs_fourn_auth";
const SOFTSIGN_SESSION_KEY = "ss_external_session";
const PORTAL_SESSION_KEY = "fournisseur_portal_session";
const EXTERNAL_ACCOUNTS_KEY = "externalAccounts";
const LEGACY_EXTERNAL_ACCOUNTS_KEY = "ss_externalAccounts";

const PENDING_MESSAGES = {
  softdocs: "Votre accès au module SoftDocs est en attente de validation par l’administrateur",
  softsign: "Votre accès au module Signature est en attente de validation par l’administrateur",
};

const PORTAL_COPY = {
  fr: {
    secure: "Connexion sécurisée",
    choose: "Choisissez votre module",
    chooseDesc: "Sélectionnez l’application à laquelle vous souhaitez accéder",
    docsDesc: "Dépôt et validation de documents GED — gestion électronique centralisée de vos fichiers",
    signDesc: "Envoyez et signez vos documents électroniquement en toute sécurité",
    trackTitle: "Suivi de document",
    trackDesc: "Consultez en temps réel le statut et l’avancement des validations de vos documents",
    start: "Commencer",
    access: "Accéder",
    consult: "Consulter",
    collaborative: "Espace collaboratif",
    collaborativeDesc: "Espace réservé aux tiers pour la soumission et le suivi de documents",
    backoffice: "Se connecter",
    logout: "Déconnexion",
    french: "Français",
    english: "English",
  },
  en: {
    secure: "Secure connection",
    choose: "Choose your module",
    chooseDesc: "Select the application you want to access",
    docsDesc: "Upload and validate DMS documents with centralized electronic file management",
    signDesc: "Send and sign your documents electronically and securely",
    trackTitle: "Document tracking",
    trackDesc: "Check the real-time status and validation progress of your documents",
    start: "Start",
    access: "Access",
    consult: "View",
    collaborative: "Collaborative workspace",
    collaborativeDesc: "Workspace reserved for third parties to submit and track documents",
    backoffice: "Sign in",
    logout: "Sign out",
    french: "Français",
    english: "English",
  },
};

function readJSON(key, fallback = null) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function normalizeText(value) {
  return String(value || "").trim().replace(/\s+/g, " ").toLowerCase();
}

function normalizeIdentifier(value) {
  return String(value || "").trim().replace(/[\s\-./]/g, "").toLowerCase();
}

function asList(value) {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

function normalizeAccount(account, source = "") {
  if (!account) return null;

  const name = account.raisonSociale || account.nom || account.login || "";
  const id = account.identificationFiscale || account.identification || account.nif || account.cin || "";
  const softsignStatus = account.moduleAccess?.softsign || account.softSignAccess || account.status || "en_attente";
  const softdocsStatus = account.moduleAccess?.softdocs || account.softDocsAccess || (source === "softdocs" ? "actif" : "en_attente");

  return {
    ...account,
    source,
    raisonSociale: name,
    nom: account.nom || name,
    identificationFiscale: id,
    nif: account.nif || id,
    status: softsignStatus,
    moduleAccess: {
      softdocs: softdocsStatus,
      softsign: softsignStatus,
    },
  };
}

function accountKey(account) {
  return `${normalizeText(account?.raisonSociale || account?.nom)}::${normalizeIdentifier(account?.identificationFiscale || account?.nif || account?.cin)}`;
}

function mergeAccount(base, ...candidates) {
  let merged = normalizeAccount(base);
  const key = accountKey(merged);

  candidates.flat().filter(Boolean).map((item) => normalizeAccount(item)).forEach((candidate) => {
    if (!merged) {
      merged = candidate;
      return;
    }
    if (key && accountKey(candidate) !== key) return;

    const nextSoftdocs = candidate.moduleAccess?.softdocs || merged.moduleAccess?.softdocs;
    const nextSoftsign =
      merged.moduleAccess?.softsign === "actif" && candidate.moduleAccess?.softsign === "en_attente"
        ? "actif"
        : candidate.moduleAccess?.softsign || merged.moduleAccess?.softsign;

    merged = {
      ...merged,
      ...candidate,
      moduleAccess: {
        softdocs: nextSoftdocs,
        softsign: nextSoftsign,
      },
      status: nextSoftsign,
    };
  });

  return merged;
}

function getStoredSupplier() {
  const portal = normalizeAccount(readJSON(PORTAL_SESSION_KEY), "portal");
  const softsign = normalizeAccount(readJSON(SOFTSIGN_SESSION_KEY), "softsign");
  const softdocs = normalizeAccount(readJSON(SOFTDOCS_AUTH_KEY), "softdocs");
  const base = portal || softsign || softdocs;
  if (!base) return null;

  const accounts = [
    ...asList(readJSON(EXTERNAL_ACCOUNTS_KEY, [])),
    ...asList(readJSON(LEGACY_EXTERNAL_ACCOUNTS_KEY, [])),
  ];

  return mergeAccount(base, softdocs, softsign, accounts);
}

function persistPortalAccount(account) {
  const normalized = normalizeAccount(account, "portal");
  const byKey = new Map();
  [
    ...asList(readJSON(EXTERNAL_ACCOUNTS_KEY, [])),
    ...asList(readJSON(LEGACY_EXTERNAL_ACCOUNTS_KEY, [])),
    normalized,
  ].filter(Boolean).map((item) => normalizeAccount(item)).forEach((item) => {
    const key = accountKey(item);
    const previous = byKey.get(key);
    byKey.set(key, previous ? mergeAccount(previous, item) : item);
  });
  const accounts = [...byKey.values()];
  writeJSON(EXTERNAL_ACCOUNTS_KEY, accounts);
  writeJSON(LEGACY_EXTERNAL_ACCOUNTS_KEY, accounts);
  writeJSON(PORTAL_SESSION_KEY, normalized);
  return normalized;
}

function findPortalAccount(raisonSociale, identification) {
  const expectedName = normalizeText(raisonSociale);
  const expectedId = normalizeIdentifier(identification);
  return [
    ...asList(readJSON(EXTERNAL_ACCOUNTS_KEY, [])),
    ...asList(readJSON(LEGACY_EXTERNAL_ACCOUNTS_KEY, [])),
    readJSON(SOFTDOCS_AUTH_KEY),
    readJSON(SOFTSIGN_SESSION_KEY),
  ].filter(Boolean).map((item) => normalizeAccount(item)).find((item) =>
    normalizeText(item.raisonSociale || item.nom) === expectedName &&
    normalizeIdentifier(item.identificationFiscale || item.nif || item.cin) === expectedId
  );
}

function initials(name) {
  const parts = String(name || "Fournisseur").trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "FO";
}

function isActive(status) {
  return status === "actif" || status === "active" || status === true;
}

function statusLabel(active) {
  return active ? "• Accès validé" : "⏳ En attente";
}

function StatusPill({ active }) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: 26,
      padding: "0 14px",
      borderRadius: 8,
      background: active ? "rgba(20,215,195,.16)" : "rgba(245,158,11,.14)",
      border: `1px solid ${active ? "rgba(20,215,195,.32)" : "rgba(245,158,11,.26)"}`,
      color: active ? CYAN : "#fbbf24",
      fontSize: 12,
      fontWeight: 900,
    }}>
      {statusLabel(active)}
    </span>
  );
}

function IconBox({ type, active, color }) {
  const common = { width: 29, height: 29, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" };
  return (
    <div style={{
      width: 56,
      height: 56,
      borderRadius: 14,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 18px",
      color: active ? color : "rgba(255,255,255,.35)",
      background: active ? `${color}20` : "rgba(255,255,255,.06)",
    }}>
      {type === "docs" && (
        <svg {...common}><path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z"/><polyline points="14 2 14 7 19 7"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>
      )}
      {type === "sign" && (
        <svg {...common}><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>
      )}
      {type === "track" && (
        <svg {...common}><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 16 14"/><path d="M8 12h1"/></svg>
      )}
    </div>
  );
}

function ModuleCard({ type, title, description, color, active, actionLabel, onOpen, onBlocked, isMobile, showStatus = true }) {
  const [hovered, setHovered] = useState(false);
  const canHover = active && hovered;

  return (
    <button
      type="button"
      aria-disabled={!active}
      onClick={() => active ? onOpen() : onBlocked()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        minHeight: isMobile ? 238 : 296,
        borderRadius: 18,
        border: `1.5px solid ${active ? "rgba(20,215,195,.38)" : "rgba(255,255,255,.12)"}`,
        background: active ? "rgba(20,95,132,.24)" : "rgba(255,255,255,.055)",
        boxShadow: canHover ? "0 18px 46px rgba(0,0,0,.2)" : "none",
        color: active ? WHITE : "rgba(255,255,255,.46)",
        cursor: active ? "pointer" : "not-allowed",
        fontFamily: "inherit",
        padding: "30px 28px",
        textAlign: "center",
        opacity: active ? 1 : .58,
        transform: canHover ? "translateY(-3px)" : "none",
        transition: "all .18s ease",
      }}
    >
      <IconBox type={type} active={active} color={color} />
      <div style={{ fontSize: 18, fontWeight: 950, marginBottom: 12, letterSpacing: "-.2px" }}>
        {title}
      </div>
      <p style={{
        minHeight: 58,
        margin: "0 auto 16px",
        color: active ? "rgba(255,255,255,.62)" : "rgba(255,255,255,.42)",
        fontSize: 13.5,
        lineHeight: 1.45,
        maxWidth: 230,
      }}>
        {description}
      </p>
      {showStatus && <StatusPill active={active} />}
      {active && (
        <div style={{ marginTop: 18, color, fontSize: 14, fontWeight: 950 }}>
          {actionLabel} →
        </div>
      )}
    </button>
  );
}

function Notice({ message }) {
  if (!message) return null;
  return (
    <div style={{
      width: "100%",
      maxWidth: 870,
      display: "flex",
      alignItems: "flex-start",
      gap: 12,
      padding: "18px 20px",
      borderRadius: 12,
      border: "1px solid rgba(245,158,11,.38)",
      background: "rgba(245,158,11,.095)",
      color: "rgba(255,255,255,.78)",
      fontSize: 13.5,
      fontWeight: 750,
      lineHeight: 1.55,
      boxSizing: "border-box",
      animation: "fourn-up .25s ease both",
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
        <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
      <span><b style={{ color: "#fbbf24" }}>Accès en attente</b> — {message}. Vous serez notifié par email dès l’activation.</span>
    </div>
  );
}

function Flag({ lang }) {
  return (
    <span style={{ display: "flex", alignItems: "center", borderRadius: 2, overflow: "hidden", flexShrink: 0 }}>
      {lang === "fr" ? (
        <svg width="20" height="14" viewBox="0 0 20 14" xmlns="http://www.w3.org/2000/svg">
          <rect width="20" height="14" rx="2" fill="#fff" />
          <rect width="7" height="14" fill="#002395" />
          <rect x="13" width="7" height="14" fill="#ED2939" />
        </svg>
      ) : (
        <svg width="20" height="14" viewBox="0 0 20 14" xmlns="http://www.w3.org/2000/svg">
          <rect width="20" height="14" rx="2" fill="#012169" />
          <path d="M0 0l20 14M20 0L0 14" stroke="#fff" strokeWidth="2.5" />
          <path d="M0 0l20 14M20 0L0 14" stroke="#C8102E" strokeWidth="1.4" />
          <path d="M10 0v14M0 7h20" stroke="#fff" strokeWidth="4" />
          <path d="M10 0v14M0 7h20" stroke="#C8102E" strokeWidth="2.4" />
        </svg>
      )}
    </span>
  );
}

function PortalTopbar({ lang, langOpen, setLangOpen, onChangeLang, onLogin, onLogout, supplier, isMobile, copy, t }) {
  const langs = [
    { code: "fr", label: copy.french },
    { code: "en", label: copy.english },
  ];

  return (
    <div style={{
      width: "100%",
      maxWidth: 1120,
      display: "flex",
      justifyContent: isMobile ? "center" : "flex-end",
      alignItems: "center",
      gap: 10,
      flexWrap: "wrap",
      position: "relative",
      zIndex: 3,
      marginBottom: isMobile ? 20 : 28,
    }}>
      <span style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        minHeight: 34,
        padding: "0 14px",
        borderRadius: 999,
        background: "rgba(255,255,255,.1)",
        border: "1px solid rgba(255,255,255,.2)",
        color: "rgba(255,255,255,.84)",
        fontSize: 12.5,
        fontWeight: 800,
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        {copy.secure}
      </span>

      <div style={{ position: "relative" }}>
        <button
          type="button"
          aria-label={`${t.langue}: ${lang.toUpperCase()}`}
          onClick={() => setLangOpen((value) => !value)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            minHeight: 34,
            padding: "0 13px",
            borderRadius: 999,
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 12.5,
            fontWeight: 850,
            background: "rgba(255,255,255,.12)",
            border: "1px solid rgba(255,255,255,.28)",
            color: WHITE,
          }}
        >
          <Flag lang={lang} />
          {lang.toUpperCase()}
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" style={{ transition: "transform .18s", transform: langOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {langOpen && (
          <>
            <div style={{ position: "fixed", inset: 0, zIndex: 8 }} onClick={() => setLangOpen(false)} />
            <div style={{
              position: "absolute",
              right: 0,
              top: 42,
              minWidth: 148,
              overflow: "hidden",
              zIndex: 9,
              background: WHITE,
              border: "1px solid #e2e8f0",
              borderRadius: 10,
              boxShadow: "0 12px 30px rgba(0,0,0,.2)",
            }}>
              {langs.map((item) => (
                <button
                  type="button"
                  key={item.code}
                  onClick={() => {
                    onChangeLang(item.code);
                    setLangOpen(false);
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    padding: "10px 14px",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: 13,
                    fontWeight: lang === item.code ? 800 : 500,
                    textAlign: "left",
                    background: lang === item.code ? "#eff6ff" : "transparent",
                    color: lang === item.code ? "#1d4ed8" : "#374151",
                  }}
                >
                  <Flag lang={item.code} />
                  {item.label}
                  {lang === item.code && (
                    <svg style={{ marginLeft: "auto" }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <button
        type="button"
        onClick={supplier ? onLogout : onLogin}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          minHeight: 34,
          padding: "0 16px",
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,.36)",
          background: WHITE,
          color: NAVY,
          cursor: "pointer",
          fontFamily: "inherit",
          fontSize: 12.5,
          fontWeight: 950,
          boxShadow: "0 10px 24px rgba(0,0,0,.14)",
        }}
      >
        {supplier ? copy.logout : copy.backoffice}
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1={supplier ? "19" : "5"} y1="12" x2={supplier ? "5" : "19"} y2="12" />
          <polyline points={supplier ? "12 5 5 12 12 19" : "12 5 19 12 12 19"} />
        </svg>
      </button>
    </div>
  );
}

function SupplierWelcome({ copy, onAccess, onBackoffice }) {
  return (
    <main style={{ height: "100vh", overflowY: "auto", WebkitOverflowScrolling: "touch", background: "linear-gradient(145deg,#1d3575,#233f91)", color: WHITE, fontFamily: "'Plus Jakarta Sans','Inter',system-ui,sans-serif", display: "flex", flexDirection: "column" }}>
      <header style={{ height: 74, borderBottom: "1px solid rgba(255,255,255,.16)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 max(20px, calc((100vw - 1160px) / 2))", boxSizing: "border-box", background: "rgba(17,38,90,.18)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/softappli-logo.png" alt="Soft Appli" style={{ width: 42, height: 42, objectFit: "contain" }} />
          <b style={{ fontSize: 18 }}>Soft Appli</b>
        </div>
        <button onClick={onBackoffice} style={{ border: "none", borderRadius: 10, background: WHITE, color: "#1e3a8a", padding: "11px 22px", fontFamily: "inherit", fontWeight: 850, cursor: "pointer" }}>
          {copy.backoffice}
        </button>
      </header>
      <section style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ width: "100%", maxWidth: 540, padding: "44px 44px 40px", borderRadius: 22, background: WHITE, color: "#1e3a8a", textAlign: "center", boxSizing: "border-box", boxShadow: "0 22px 58px rgba(0,0,0,.16)" }}>
          <div style={{ width: 112, height: 112, margin: "0 auto 24px", borderRadius: 18, background: "linear-gradient(135deg,#10c9e5,#049bc5)", color: WHITE, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 20px rgba(4,155,197,.24)" }}>
            <svg width="68" height="68" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h1 style={{ margin: "0 0 24px", fontSize: 32 }}>{copy.collaborative}</h1>
          <button onClick={onAccess} style={{ width: "100%", border: "none", borderRadius: 10, background: "#25429b", color: WHITE, padding: "16px 18px", fontFamily: "inherit", fontWeight: 900, fontSize: 15, cursor: "pointer" }}>
            {copy.access} &nbsp; →
          </button>
          <p style={{ margin: "24px 0 0", color: "#475569", fontSize: 13.5 }}>{copy.collaborativeDesc}</p>
        </div>
      </section>
      <footer style={{ padding: "0 20px 32px", textAlign: "center", color: "#22d3ee", fontSize: 12 }}>© 2026 SoftDocs — Système de Gestion Électronique de Documents</footer>
    </main>
  );
}

function CollaborativeAuthScreen({ copy, onAuthenticated, onBack }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    raisonSociale: "",
    identificationFiscale: "",
    email: "",
    phone: "",
    adresse: "",
    ville: "Antananarivo",
    pays: "Madagascar",
    bankName: "",
    bankBranch: "",
    bankCode: "",
    branchCode: "",
    accountNumber: "",
    ribKey: "",
    swift: "",
    iban: "",
  });
  const [error, setError] = useState("");
  const [ribStatus, setRibStatus] = useState(null);
  const bankKeys = ["bankName", "bankBranch", "bankCode", "branchCode", "accountNumber", "ribKey", "swift", "iban"];
  const set = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
    if (bankKeys.includes(key)) setRibStatus(null);
  };

  function login(event) {
    event.preventDefault();
    const account = findPortalAccount(form.raisonSociale, form.identificationFiscale);
    if (!account) {
      setError("Compte introuvable. Vérifiez la raison sociale et l’identification fiscale.");
      return;
    }
    setError("");
    onAuthenticated(persistPortalAccount(account));
  }

  function register(event) {
    event.preventDefault();
    if (!form.raisonSociale.trim() || !form.identificationFiscale.trim() || !form.email.trim() || !form.phone.trim()) {
      setError("Renseignez les champs obligatoires avant de créer le compte.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("Renseignez une adresse e-mail professionnelle valide.");
      return;
    }
    const ribIdentity = [form.bankCode, form.branchCode, form.accountNumber, form.ribKey];
    if (ribIdentity.some((value) => value.trim()) && !ribIdentity.every((value) => value.trim())) {
      setError("Complétez le code banque, le guichet, le numéro de compte et la clé RIB.");
      return;
    }
    const existing = findPortalAccount(form.raisonSociale, form.identificationFiscale);
    if (existing) {
      setError("Ce compte existe déjà. Utilisez l’onglet Se connecter.");
      return;
    }
    const bankDetails = {
      bankName: form.bankName.trim(),
      bankBranch: form.bankBranch.trim(),
      bankCode: form.bankCode.trim(),
      branchCode: form.branchCode.trim(),
      accountNumber: form.accountNumber.trim(),
      ribKey: form.ribKey.trim(),
      swift: form.swift.trim(),
      iban: form.iban.trim(),
      ribVerified: ribStatus?.tone === "success",
      ribVerifiedAt: ribStatus?.tone === "success" ? new Date().toISOString() : "",
    };
    const account = persistPortalAccount({
      id: `EXT-${Date.now()}`,
      raisonSociale: form.raisonSociale.trim(),
      nom: form.raisonSociale.trim(),
      identificationFiscale: form.identificationFiscale.trim(),
      nif: form.identificationFiscale.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      adresse: form.adresse.trim(),
      ville: form.ville.trim(),
      pays: form.pays,
      ...bankDetails,
      bankDetails,
      contactName: form.raisonSociale.trim(),
      createdAt: new Date().toISOString(),
      status: "en_attente",
      moduleAccess: { softdocs: "en_attente", softsign: "en_attente" },
    });
    setError("");
    onAuthenticated(account);
  }

  function verifyRib() {
    const bankCode = form.bankCode.replace(/\s/g, "");
    const branchCode = form.branchCode.replace(/\s/g, "");
    const accountNumber = form.accountNumber.replace(/\s/g, "");
    const ribKey = form.ribKey.replace(/\s/g, "");
    if (!/^\d{5}$/.test(bankCode) || !/^\d{5}$/.test(branchCode) || !/^\d{8,16}$/.test(accountNumber) || !/^\d{2}$/.test(ribKey)) {
      setRibStatus({ tone: "error", text: "RIB incomplet : utilisez 5 chiffres pour la banque, 5 pour le guichet, 8 à 16 pour le compte et 2 pour la clé." });
      return;
    }
    setRibStatus({ tone: "success", text: "Format RIB vérifié localement." });
  }

  const input = { width: "100%", boxSizing: "border-box", border: "1px solid #cbd5e1", borderRadius: 8, padding: "11px 12px", fontFamily: "inherit", fontSize: 13, outline: "none" };
  const field = (label, key, placeholder, required = false, type = "text") => (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ color: "#475569", fontSize: 11.5, fontWeight: 850, textTransform: "uppercase" }}>{label}{required ? " *" : ""}</span>
      <input type={type} style={input} value={form[key]} onChange={set(key)} placeholder={placeholder} required={required} />
    </label>
  );
  const section = (label) => (
    <div style={{ gridColumn: "1 / -1", color: "#334155", fontSize: 12, fontWeight: 900, borderBottom: "1px solid #dbe3ef", paddingBottom: 7, marginTop: 6 }}>
      {label}
    </div>
  );

  return (
    <main style={{
      height: "100vh",
      overflowY: "auto",
      WebkitOverflowScrolling: "touch",
      background: "#f1f5fb",
      fontFamily: "'Plus Jakarta Sans','Inter',system-ui,sans-serif",
      padding: "clamp(20px, 4vw, 34px) clamp(12px, 4vw, 18px) 60px",
      boxSizing: "border-box",
    }}>
      <div style={{ maxWidth: 620, margin: "0 auto" }}>
        <button onClick={onBack} style={{ border: "none", background: "transparent", color: "#25429b", fontFamily: "inherit", cursor: "pointer", fontWeight: 800, marginBottom: 16 }}>← Retour à l’accueil</button>
        <form onSubmit={mode === "login" ? login : register} style={{ background: WHITE, border: "1px solid #dbe3ef", borderRadius: 14, padding: 24, boxShadow: "0 10px 32px rgba(30,64,175,.08)" }}>
          <div style={{ display: "flex", padding: 4, borderRadius: 9, background: "#eef2f8", marginBottom: 22 }}>
            {[["login", "Se connecter"], ["register", "Créer un compte"]].map(([id, label]) => (
              <button type="button" key={id} onClick={() => { setMode(id); setError(""); }} style={{ flex: 1, border: "none", borderRadius: 7, padding: "10px", background: mode === id ? WHITE : "transparent", color: mode === id ? "#25429b" : "#64748b", fontFamily: "inherit", fontWeight: 850, cursor: "pointer", boxShadow: mode === id ? "0 2px 6px rgba(15,23,42,.1)" : "none" }}>{label}</button>
            ))}
          </div>
          {error && <div style={{ padding: "10px 12px", borderRadius: 8, background: "#fef2f2", color: "#b91c1c", fontSize: 12.5, marginBottom: 16 }}>{error}</div>}
          {mode === "register" && (
            <div style={{ padding: "10px 12px", borderRadius: 8, background: "#eff6ff", border: "1px solid #bfdbfe", color: "#2563eb", fontSize: 12.5, lineHeight: 1.45, marginBottom: 16 }}>
              Renseignez les informations légales de votre entreprise. Elles seront vérifiées à chaque dépôt de document.
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: mode === "register" ? "1fr 1fr" : "1fr", gap: 14 }}>
            {mode === "register" && section("Identification")}
            <div style={{ gridColumn: "1 / -1" }}>{field("Raison sociale / nom", "raisonSociale", "Ex: JIRAMA SA", true)}</div>
            <div style={{ gridColumn: "1 / -1" }}>{field("Identification fiscale ou National ID", "identificationFiscale", "Ex: FR-123456789 (NIF) ou 1234567890 (ID National)", true)}</div>
            {mode === "register" && <>
              {field("Email professionnel", "email", "contact@entreprise.mg", true, "email")}
              {field("Téléphone", "phone", "+261 34 00 000 00", true, "tel")}
              {section("Adresse")}
              <div style={{ gridColumn: "1 / -1" }}>{field("Adresse", "adresse", "Numéro, rue, quartier...")}</div>
              {field("Ville", "ville", "Antananarivo")}
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ color: "#475569", fontSize: 11.5, fontWeight: 850, textTransform: "uppercase" }}>Pays</span>
                <select style={input} value={form.pays} onChange={set("pays")}><option>Madagascar</option><option>France</option><option>Autre</option></select>
              </label>
              {section("Coordonnées bancaires")}
              <div style={{ gridColumn: "1 / -1" }}>{field("Nom de la banque", "bankName", "Ex: BNI Madagascar, BOA, BFV-SG...")}</div>
              <div style={{ gridColumn: "1 / -1" }}>{field("Domiciliation", "bankBranch", "Agence Analakely...")}</div>
              <div style={{ gridColumn: "1 / -1", display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 10, alignItems: "end" }}>
                {field("Code banque", "bankCode", "00001")}
                {field("Guichet", "branchCode", "01001")}
                <button type="button" onClick={verifyRib} style={{ minHeight: 41, border: "none", borderRadius: 8, padding: "0 16px", background: "#e6f7f5", color: "#0f766e", fontFamily: "inherit", fontSize: 12, fontWeight: 900, cursor: "pointer", whiteSpace: "nowrap" }}>
                  ✓ Vérifier RIB
                </button>
              </div>
              <div style={{ gridColumn: "1 / -1", display: "grid", gridTemplateColumns: "1fr 110px", gap: 10 }}>
                {field("N° de compte bancaire", "accountNumber", "12345678901")}
                {field("Clé", "ribKey", "00")}
              </div>
              {ribStatus && (
                <div style={{ gridColumn: "1 / -1", padding: "9px 11px", borderRadius: 8, background: ribStatus.tone === "success" ? "#f0fdf4" : "#fef2f2", border: `1px solid ${ribStatus.tone === "success" ? "#bbf7d0" : "#fecaca"}`, color: ribStatus.tone === "success" ? "#166534" : "#b91c1c", fontSize: 12 }}>
                  {ribStatus.text}
                </div>
              )}
              <div style={{ gridColumn: "1 / -1" }}>{field("Code SWIFT", "swift", "XXXXMGGM")}</div>
              <div style={{ gridColumn: "1 / -1" }}>{field("IBAN", "iban", "MG48 0001 0001 2345 6789 012")}</div>
            </>}
          </div>
          <button type="submit" style={{ width: "100%", marginTop: 22, border: "none", borderRadius: 8, padding: "12px", background: "#314a84", color: WHITE, fontFamily: "inherit", fontWeight: 900, cursor: "pointer" }}>
            {mode === "login" ? "→ Se connecter" : "+ Créer mon compte"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function FournisseurLanding() {
  const [lang, setLang] = useState("fr");
  const [langOpen, setLangOpen] = useState(false);
  const [view, setView] = useState("welcome");
  const [isMobile, setIsMobile] = useState(false);
  const [supplier, setSupplier] = useState(null);
  const [notice, setNotice] = useState("");
  const t = useT(lang);
  const copy = PORTAL_COPY[lang] || PORTAL_COPY.fr;

  useEffect(() => {
    try {
      const saved = localStorage.getItem("softdocs_lang");
      if (saved === "fr" || saved === "en") setLang(saved);
    } catch {}
  }, []);

  function changeLang(nextLang) {
    setLang(nextLang);
    try {
      localStorage.setItem("softdocs_lang", nextLang);
    } catch {}
  }

  function openBackofficeLogin() {
    window.location.href = "/login";
  }

  function logoutSupplier() {
    try {
      [PORTAL_SESSION_KEY, SOFTSIGN_SESSION_KEY, SOFTDOCS_AUTH_KEY].forEach((key) => localStorage.removeItem(key));
    } catch {}
    setSupplier(null);
    setNotice("");
    setView("welcome");
  }

  function authenticateSupplier(account) {
    setSupplier(account);
    setView("home");
  }

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const account = getStoredSupplier();
    setSupplier(account);
  }, [view]);

  useEffect(() => {
    const account = getStoredSupplier();
    if (account) {
      setSupplier(account);
      setView("home");
    }
  }, []);

  const access = useMemo(() => {
    const softdocs = supplier ? supplier.moduleAccess?.softdocs : "en_attente";
    const softsign = supplier ? supplier.moduleAccess?.softsign || supplier.status : "en_attente";
    return {
      softdocs: isActive(softdocs),
      softsign: isActive(softsign),
    };
  }, [supplier]);

  useEffect(() => {
    if (!supplier) {
      setNotice("");
      return;
    }
    if (!access.softsign) setNotice(PENDING_MESSAGES.softsign);
    else if (!access.softdocs) setNotice(PENDING_MESSAGES.softdocs);
    else setNotice("");
  }, [access.softdocs, access.softsign, supplier]);

  if (view === "welcome") return <SupplierWelcome copy={copy} onAccess={() => setView("auth")} onBackoffice={openBackofficeLogin} />;
  if (view === "auth") return <CollaborativeAuthScreen copy={copy} onAuthenticated={authenticateSupplier} onBack={() => setView("welcome")} />;
  if (view === "upload") return <FournisseurPortal onBack={() => setView("home")} lang={lang} />;
  if (view === "suivi") return <FournisseurSuivi onBack={() => setView("home")} lang={lang} />;
  if (view === "ss-collab") return <FournisseurSign initialAccount={supplier} onBack={() => setView("home")} />;

  const supplierName = supplier?.raisonSociale || supplier?.nom || "";
  const showSupplier = Boolean(supplierName);

  return (
    <>
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          min-height: 100%;
          overflow-x: hidden;
          background: ${NAVY_2};
        }
        @keyframes fourn-up {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fourn-pulse {
          0%,100% { opacity: 1; }
          50% { opacity: .38; }
        }
      `}</style>

      <main style={{
        height: "100vh",
        overflowY: "auto",
        overflowX: "hidden",
        WebkitOverflowScrolling: "touch",
        background: `linear-gradient(150deg, ${NAVY} 0%, #1a3567 55%, ${NAVY_2} 100%)`,
        color: WHITE,
        fontFamily: "'Plus Jakarta Sans','Inter',system-ui,sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxSizing: "border-box",
        padding: isMobile ? "20px 14px 40px" : "44px 32px 58px",
        position: "relative",
      }}>
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(rgba(255,255,255,.08) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
          opacity: .35,
          pointerEvents: "none",
        }} />

        <PortalTopbar
          lang={lang}
          langOpen={langOpen}
          setLangOpen={setLangOpen}
          onChangeLang={changeLang}
          onLogin={openBackofficeLogin}
          onLogout={logoutSupplier}
          supplier={supplier}
          isMobile={isMobile}
          copy={copy}
          t={t}
        />

        <section style={{ width: "100%", maxWidth: 1120, position: "relative", zIndex: 1, display: "flex", flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <img src="/softappli-logo.png" alt="Soft APPLI" style={{ width: isMobile ? 104 : 128, height: "auto", objectFit: "contain", marginBottom: 10 }} />
          <div style={{ color: "rgba(255,255,255,.6)", fontSize: 12.5, fontWeight: 750, marginBottom: 20 }}>
            {t.portailTitle}
          </div>

          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            color: CYAN,
            background: "rgba(20,215,195,.13)",
            border: "1px solid rgba(20,215,195,.32)",
            borderRadius: 999,
            padding: "7px 18px",
            fontSize: 12,
            fontWeight: 950,
            textTransform: "uppercase",
            marginBottom: 26,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: CYAN, animation: "fourn-pulse 1.8s ease infinite" }} />
            {t.plateformeActive}
          </div>

          {showSupplier && (
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 11,
              padding: "8px 18px 8px 8px",
              borderRadius: 999,
              background: "rgba(255,255,255,.13)",
              border: "1px solid rgba(255,255,255,.17)",
              boxShadow: "0 8px 28px rgba(0,0,0,.18)",
              marginBottom: 30,
            }}>
              <span style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg,#13d3be,#08a4d8)",
                color: WHITE,
                fontSize: 12,
                fontWeight: 950,
              }}>
                {initials(supplierName)}
              </span>
              <span style={{ color: WHITE, fontSize: 13.5, fontWeight: 900 }}>{supplierName}</span>
            </div>
          )}

          <h1 style={{
            margin: "0 0 10px",
            fontSize: isMobile ? 26 : 30,
            lineHeight: 1.12,
            letterSpacing: "-.3px",
            textAlign: "center",
            fontWeight: 950,
          }}>
            {copy.choose}
          </h1>
          <p style={{ margin: "0 0 32px", color: MUTED, fontSize: 13.5, fontWeight: 700, textAlign: "center" }}>
            {copy.chooseDesc}
          </p>

          <div style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))",
            gap: isMobile ? 16 : 20,
            maxWidth: 870,
            marginBottom: 18,
          }}>
            <ModuleCard
              type="docs"
              title="SoftDocs"
              description={copy.docsDesc}
              color={BLUE}
              active={access.softdocs}
              actionLabel={copy.start}
              isMobile={isMobile}
              onOpen={() => setView("upload")}
              onBlocked={() => setNotice(PENDING_MESSAGES.softdocs)}
            />
            <ModuleCard
              type="sign"
              title="SoftSign"
              description={copy.signDesc}
              color={PURPLE}
              active={access.softsign}
              actionLabel={copy.access}
              isMobile={isMobile}
              onOpen={() => setView("ss-collab")}
              onBlocked={() => setNotice(PENDING_MESSAGES.softsign)}
            />
            <ModuleCard
              type="track"
              title={copy.trackTitle}
              description={copy.trackDesc}
              color={CYAN}
              active
              showStatus={false}
              actionLabel={copy.consult}
              isMobile={isMobile}
              onOpen={() => setView("suivi")}
              onBlocked={() => {}}
            />
          </div>

          <Notice message={notice} />
        </section>
      </main>
    </>
  );
}
