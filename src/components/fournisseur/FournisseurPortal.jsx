"use client";
import { useState, useRef, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════
   CONSTANTS & TOKENS
═══════════════════════════════════════════════════════════ */
const P    = "#324372";
const P2   = "#253359";
const PL   = "#4a6ab0";
const PXL  = "#eef2fb";
const PXX  = "#f5f7fd";
const ACC  = "#1ecad3";   /* teal accent */
const WH   = "#ffffff";
const BG   = "#f0f4fa";
const BD   = "#dde3ef";
const MUT  = "#7b87a2";
const TXT  = "#1a2342";
const SUC  = "#0fa86c";
const ERR  = "#e03e3e";
const WRN  = "#e07d00";

const R    = "10px";
const RLG  = "16px";
const RXL  = "24px";

const SHADOW = "0 2px 12px rgba(50,67,114,.10)";
const SHADOW_LG = "0 8px 32px rgba(50,67,114,.15)";
const SHADOW_XL = "0 20px 60px rgba(50,67,114,.18)";

/* ── OCR messages ── */
const OCR_MSGS = [
  "Détection du format document…",
  "Reconnaissance des zones de texte…",
  "Extraction du numéro de document…",
  "Lecture des montants HT / TVA / TTC…",
  "Vérification du NIF fournisseur…",
  "Validation IBAN (algorithme Luhn)…",
  "Calcul du score de confiance OCR…",
  "Contrôle anti-doublon en cours…",
];

/* ── SVG Icons (inline, no deps) ── */
const SV = (d, sz = 18) => (
  <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"
    dangerouslySetInnerHTML={{ __html: d }} />
);

const Ic = {
  upload:   SV('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>'),
  file:     SV('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>'),
  check:    SV('<polyline points="20 6 9 17 4 12"/>'),
  checkC:   SV('<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'),
  eye:      SV('<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',16),
  eyeOff:   SV('<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>',16),
  user:     SV('<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'),
  mail:     SV('<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>'),
  phone:    SV('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>'),
  lock:     SV('<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',16),
  id:       SV('<rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="6" y1="15" x2="10" y2="15"/>'),
  barcode:  SV('<path d="M2 4v16M6 4v16M10 4v16M16 4v16M20 4v16M13 4v6M13 14v6"/>'),
  edit:     SV('<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',15),
  send:     SV('<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>'),
  x:        SV('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',16),
  plus:     SV('<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',16),
  arrow:    SV('<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>'),
  arrowL:   SV('<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>'),
  robot:    SV('<rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><line x1="12" y1="7" x2="12" y2="11"/><line x1="8" y1="15" x2="8" y2="15" strokeWidth="2.5"/><line x1="12" y1="15" x2="12" y2="15" strokeWidth="2.5"/><line x1="16" y1="15" x2="16" y2="15" strokeWidth="2.5"/>'),
  alert:    SV('<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',16),
  shield:   SV('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'),
  logout:   SV('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',16),
  building: SV('<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="3" x2="9" y2="21"/>'),
  pdf:      SV('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/>'),
  clock:    SV('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',16),
  paper:    SV('<path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/>'),
  info:     SV('<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',16),
};

/* ── localStorage helpers ── */
const LS_AUTH = "softdocs_fourn_auth";
const LS_DOCS = "softdocs_fourn_docs";

const lsGet = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

/* ── OCR simulation ── */
const ocrSim = (account) => {
  const ht    = Math.floor(20_000_000 + Math.random() * 90_000_000);
  const tva   = Math.floor(ht * 0.2);
  const score = Math.floor(72 + Math.random() * 26);
  return {
    numero:   `FAC-2025-${Math.floor(1000 + Math.random() * 8000)}`,
    date_doc: `${String(1 + Math.floor(Math.random() * 27)).padStart(2, "0")}/01/2025`,
    emetteur: account?.nom || "—",
    nif:      account?.nif || "—",
    iban:     "",
    ht:       String(ht),
    tva:      String(tva),
    total:    String(ht + tva),
    score,
  };
};

const fmtN = (v) =>
  v ? new Intl.NumberFormat("fr-MG").format(Number(v)) + " Ar" : "—";

const gid = () => `DOC-FOURN-${Date.now().toString().slice(-8)}`;

/* ═══════════════════════════════════════════════════════════
   STYLED HELPERS
═══════════════════════════════════════════════════════════ */
const inp = (extra = {}) => ({
  width: "100%",
  border: `1.5px solid ${BD}`,
  borderRadius: R,
  padding: "11px 14px",
  fontSize: 13.5,
  fontFamily: "inherit",
  outline: "none",
  background: WH,
  color: TXT,
  transition: "border-color .15s, box-shadow .15s",
  ...extra,
});

const btnP = (ghost = false) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: ghost ? "10px 20px" : "12px 24px",
  borderRadius: R,
  border: ghost ? `1.5px solid ${P}` : "none",
  background: ghost ? "transparent" : P,
  color: ghost ? P : WH,
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: "inherit",
  transition: "all .15s",
  letterSpacing: "-.2px",
});

const card = (extra = {}) => ({
  background: WH,
  borderRadius: RLG,
  border: `1px solid ${BD}`,
  boxShadow: SHADOW,
  ...extra,
});

/* ═══════════════════════════════════════════════════════════
   VALIDATION
═══════════════════════════════════════════════════════════ */
const validate = {
  nif:   (v) => /^\d{10}$/.test(v.replace(/\s/g, "")),
  stat:  (v) => /^.{17}$/.test(v.replace(/\s/g, "")),
  mail:  (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  phone: (v) => /^[0-9+\s\-()]{8,15}$/.test(v),
  nom:   (v) => v.trim().length >= 3,
};

/* ═══════════════════════════════════════════════════════════
   PROGRESS STEPPER
═══════════════════════════════════════════════════════════ */
function Stepper({ steps, current }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 32 }}>
      {steps.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: i < current ? SUC : i === current ? P : "#e8ecf5",
              color: i <= current ? WH : MUT,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 13,
              boxShadow: i === current ? `0 0 0 4px ${PXL}` : "none",
              transition: "all .3s",
            }}>
              {i < current ? <span style={{ display: "flex" }}>{Ic.check}</span> : i + 1}
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: i === current ? P : MUT, whiteSpace: "nowrap" }}>
              {s}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div style={{
              width: 80, height: 2,
              background: i < current ? SUC : "#e8ecf5",
              margin: "0 6px", marginBottom: 20,
              transition: "background .4s",
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   FIELD COMPONENT
═══════════════════════════════════════════════════════════ */
function Field({ label, icon, value, onChange, type = "text", placeholder, error, hint, required, maxLen, disabled, right }) {
  const [focused, setFocused] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  return (
    <div style={{ marginBottom: 4 }}>
      <label style={{
        display: "flex", alignItems: "center", gap: 6,
        fontSize: 12.5, fontWeight: 700, color: focused ? P : "#4a5568",
        marginBottom: 6, textTransform: "uppercase", letterSpacing: ".05em",
        transition: "color .15s",
      }}>
        {icon && <span style={{ display: "flex", color: focused ? P : MUT }}>{icon}</span>}
        {label}
        {required && <span style={{ color: ERR, fontSize: 13 }}>*</span>}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type={type === "password" && showPwd ? "text" : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLen}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            ...inp(),
            borderColor: error ? ERR : focused ? P : BD,
            boxShadow: focused ? `0 0 0 3px ${error ? ERR + "22" : PXL}` : "none",
            paddingRight: (type === "password" || right) ? 44 : 14,
            background: disabled ? "#f7f8fc" : WH,
            color: disabled ? MUT : TXT,
          }}
        />
        {type === "password" && (
          <button type="button"
            onClick={() => setShowPwd(p => !p)}
            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: MUT, display: "flex" }}>
            {showPwd ? Ic.eyeOff : Ic.eye}
          </button>
        )}
        {right && !type === "password" && (
          <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: MUT, display: "flex" }}>
            {right}
          </div>
        )}
      </div>
      {error && (
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 5, fontSize: 12, color: ERR }}>
          <span style={{ display: "flex" }}>{Ic.alert}</span> {error}
        </div>
      )}
      {hint && !error && (
        <div style={{ marginTop: 5, fontSize: 11.5, color: MUT }}>{hint}</div>
      )}
      {maxLen && (
        <div style={{ textAlign: "right", fontSize: 11, color: MUT, marginTop: 3 }}>
          {value.replace(/\s/g, "").length} / {maxLen}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCREEN 1 — AUTH (LOGIN / REGISTER)
═══════════════════════════════════════════════════════════ */
function AuthScreen({ onAuth }) {
  const [mode, setMode]       = useState("login"); // "login" | "register"
  const [form, setForm]       = useState({ nif: "", stat: "", nom: "", mail: "", phone: "" });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

  /* ── REGISTER submit ── */
  const handleRegister = () => {
    const e = {};
    if (!validate.nif(form.nif))   e.nif  = "NIF invalide — exactement 10 chiffres";
    if (!validate.stat(form.stat)) e.stat = "STAT invalide — exactement 17 caractères";
    if (!validate.mail(form.mail)) e.mail = "Adresse email invalide";
    if (!validate.phone(form.phone)) e.phone = "Numéro de téléphone invalide";
    if (!validate.nom(form.nom))   e.nom  = "Raison sociale obligatoire (min. 3 caractères)";
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    setTimeout(() => {
      const account = {
        nif:   form.nif.replace(/\s/g, ""),
        stat:  form.stat.replace(/\s/g, ""),
        nom:   form.nom.trim(),
        mail:  form.mail.trim(),
        phone: form.phone.trim(),
        createdAt: new Date().toISOString(),
      };
      lsSet(LS_AUTH, account);
      setLoading(false);
      onAuth(account);
    }, 900);
  };

  /* ── LOGIN submit ── */
  const handleLogin = () => {
    const e = {};
    if (!form.nif.trim()) e.nif = "NIF obligatoire";
    if (!form.stat.trim()) e.stat = "STAT obligatoire";
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    setTimeout(() => {
      const saved = lsGet(LS_AUTH);
      if (saved && saved.nif === form.nif.replace(/\s/g, "") && saved.stat === form.stat.replace(/\s/g, "")) {
        setLoading(false);
        onAuth(saved);
      } else {
        setLoading(false);
        setErrors({ nif: "NIF/STAT incorrect ou compte introuvable" });
      }
    }, 800);
  };

  return (
    <div style={{ animation: "fourn-up .4s ease both", display: "flex", flexDirection: "column", gap: 0 }}>

      {/* Toggle */}
      <div style={{
        display: "flex", background: "#eef2fb", borderRadius: "12px", padding: 4,
        marginBottom: 28, gap: 4,
      }}>
        {[
          { k: "login",    l: "Se connecter" },
          { k: "register", l: "Créer un compte" },
        ].map(t => (
          <button key={t.k} onClick={() => { setMode(t.k); setErrors({}); }}
            style={{
              flex: 1, padding: "10px 0", borderRadius: 9, border: "none",
              background: mode === t.k ? WH : "transparent",
              color: mode === t.k ? P : MUT,
              fontWeight: mode === t.k ? 700 : 500,
              fontSize: 13.5, cursor: "pointer", fontFamily: "inherit",
              boxShadow: mode === t.k ? "0 2px 8px rgba(50,67,114,.12)" : "none",
              transition: "all .2s",
            }}>
            {t.l}
          </button>
        ))}
      </div>

      {mode === "login" ? (
        /* ── LOGIN ── */
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="NIF (Numéro d'Identification Fiscal)" icon={Ic.id}
            value={form.nif} onChange={set("nif")} placeholder="Ex: 1234567890"
            error={errors.nif} hint="10 chiffres sans espace" required />
          <Field label="STAT (Numéro Statistique)" icon={Ic.barcode}
            value={form.stat} onChange={set("stat")} placeholder="17 caractères"
            error={errors.stat} hint="Numéro statistique à 17 caractères" required />

          <button onClick={handleLogin} disabled={loading}
            style={{ ...btnP(), width: "100%", justifyContent: "center", marginTop: 4, opacity: loading ? .7 : 1 }}>
            {loading ? (
              <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <svg style={{ animation: "fourn-spin .8s linear infinite" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M21 12a9 9 0 1 1-18 0" />
                </svg>
                Vérification…
              </span>
            ) : (
              <><span style={{ display: "flex" }}>{Ic.arrow}</span> Se connecter</>
            )}
          </button>

          <p style={{ textAlign: "center", fontSize: 12.5, color: MUT, marginTop: 4 }}>
            Pas encore de compte ?{" "}
            <button onClick={() => setMode("register")}
              style={{ color: P, fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontSize: 12.5, fontFamily: "inherit" }}>
              Créer un compte gratuit
            </button>
          </p>
        </div>
      ) : (
        /* ── REGISTER ── */
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Info banner */}
          <div style={{
            background: "#e8f5ff", border: "1px solid #b8d9f5", borderRadius: R,
            padding: "10px 14px", display: "flex", gap: 10, alignItems: "flex-start",
            fontSize: 12.5, color: "#1a4a6e",
          }}>
            <span style={{ display: "flex", flexShrink: 0, color: "#1a7ac2", marginTop: 1 }}>{Ic.info}</span>
            <span>Renseignez les informations légales de votre entreprise. Elles seront vérifiées à chaque dépôt de document.</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ gridColumn: "span 2" }}>
              <Field label="Raison sociale / Nom" icon={Ic.building}
                value={form.nom} onChange={set("nom")} placeholder="Ex: JIRAMA SA"
                error={errors.nom} required />
            </div>
            <Field label="NIF" icon={Ic.id}
              value={form.nif} onChange={set("nif")} placeholder="10 chiffres"
              error={errors.nif} hint="Ex: 1002345678" required maxLen={10} />
            <Field label="STAT" icon={Ic.barcode}
              value={form.stat} onChange={set("stat")} placeholder="17 caractères"
              error={errors.stat} hint="Ex: 1234567890123AB" required />
            <Field label="Email professionnel" icon={Ic.mail}
              value={form.mail} onChange={set("mail")} placeholder="contact@entreprise.mg"
              type="email" error={errors.mail} required />
            <Field label="Téléphone" icon={Ic.phone}
              value={form.phone} onChange={set("phone")} placeholder="+261 34 00 000 00"
              error={errors.phone} required />
          </div>

          <button onClick={handleRegister} disabled={loading}
            style={{ ...btnP(), width: "100%", justifyContent: "center", marginTop: 4, opacity: loading ? .7 : 1 }}>
            {loading ? (
              <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <svg style={{ animation: "fourn-spin .8s linear infinite" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M21 12a9 9 0 1 1-18 0" />
                </svg>
                Création du compte…
              </span>
            ) : (
              <><span style={{ display: "flex" }}>{Ic.plus}</span> Créer mon compte</>
            )}
          </button>

          <p style={{ textAlign: "center", fontSize: 12.5, color: MUT }}>
            Déjà inscrit ?{" "}
            <button onClick={() => setMode("login")}
              style={{ color: P, fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontSize: 12.5, fontFamily: "inherit" }}>
              Se connecter
            </button>
          </p>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCREEN 2 — UPLOAD + OCR + EDIT
═══════════════════════════════════════════════════════════ */
function UploadScreen({ account, onSubmit }) {
  /* OCR phases: "idle" | "upload" | "scanning" | "edit" */
  const [phase, setPhase]       = useState("idle");
  const [file, setFile]         = useState(null);
  const [drag, setDrag]         = useState(false);
  const [prog, setProg]         = useState(0);
  const [msgIdx, setMsgIdx]     = useState(0);
  const [ocrRaw, setOcrRaw]     = useState(null);
  const [fields, setFields]     = useState({});
  const [docType, setDocType]   = useState("Facture");
  const [notes, setNotes]       = useState("");
  const [submitting, setSub]    = useState(false);
  const [fieldErr, setFieldErr] = useState({});
  const fileRef = useRef();

  /* OCR scan ticker */
  useEffect(() => {
    if (phase !== "scanning") return;
    const t = setInterval(() => setMsgIdx(p => (p + 1) % OCR_MSGS.length), 520);
    return () => clearInterval(t);
  }, [phase]);

  /* Score color */
  const scoreColor = (s) => s >= 85 ? SUC : s >= 70 ? WRN : ERR;

  const startScan = (f) => {
    setFile(f);
    setPhase("scanning");
    setProg(0);
    const iv = setInterval(() => {
      setProg(p => {
        if (p >= 100) {
          clearInterval(iv);
          const data = ocrSim(account);
          setOcrRaw(data);
          setFields({ ...data });
          setPhase("edit");
          return 100;
        }
        return p + 2.5;
      });
    }, 60);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) startScan(f);
  }, [account]);

  const setField = (k) => (v) => setFields(p => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    const e = {};
    if (!fields.numero?.trim()) e.numero = "Champ obligatoire";
    if (!fields.total?.trim() || isNaN(Number(fields.total))) e.total = "Montant invalide";
    if (!fields.iban?.trim()) e.iban = "IBAN obligatoire";
    setFieldErr(e);
    if (Object.keys(e).length) return;

    setSub(true);
    setTimeout(() => {
      const now = new Date();
      const dateStr = now.toLocaleDateString("fr-MG") + " " + now.toLocaleTimeString("fr-MG", { hour: "2-digit", minute: "2-digit" });
      const dateOnlyStr = now.toLocaleDateString("fr-MG");

      const doc = {
        id:     gid(),
        type:   docType,
        tid:    docType === "Facture" ? "DT001" : docType === "Bon de livraison" ? "DT002" : docType === "Contrat" ? "DT003" : "DT004",
        cat:    "fournisseur",
        fourn:  account.nom,
        fid:    `F-${account.nif.slice(-4)}`,
        proj:   "",
        site:   "",
        mt:     Number(fields.total) || 0,
        mtR:    Number(fields.total) || 0,
        date:   dateOnlyStr,
        st:     "REÇU",
        conf:   false,
        ocr:    fields.score || 0,
        motif:  "",
        exped:  "Fournisseur",
        notes,
        bap:    false,
        cloture:false,
        AR:     false,
        affP:   true,
        linked: false,
        refus:  null,
        origin: "portail-fournisseur",
        ch:     {
          numero:   fields.numero,
          date_doc: fields.date_doc,
          ht:       fields.ht,
          tva:      fields.tva,
          total:    fields.total,
          nif:      fields.nif || account.nif,
          iban:     fields.iban,
          emetteur: fields.emetteur || account.nom,
          score:    fields.score || 0,
        },
        anx:    [],
        etapes: [
          { label: "Réception & Contrôle",   v: ["U004", "U006"], statut: "EN ATTENTE", date: "", comment: "", validBy: "" },
          { label: "Validation Technique",   v: ["U001"],         statut: "EN ATTENTE", date: "", comment: "", validBy: "" },
          { label: "Validation Financière",  v: ["U002", "U004"], statut: "EN ATTENTE", date: "", comment: "", validBy: "" },
          { label: "Approbation DAF",        v: ["U003"],         statut: "EN ATTENTE", date: "", comment: "", validBy: "" },
        ],
        _fourn: account,
        _submittedAt: now.toISOString(),
      };

      /* Persist for backoffice */
      const existing = lsGet(LS_DOCS) || [];
      lsSet(LS_DOCS, [...existing, doc]);

      setSub(false);
      onSubmit(doc);
    }, 1200);
  };

  /* ─── IDLE phase: landing upload zone ─── */
  if (phase === "idle" || phase === "upload") return (
    <div style={{ animation: "fourn-up .35s ease both" }}>
      <div style={{ marginBottom: 24, textAlign: "center" }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: TXT, marginBottom: 6 }}>
          Déposer un document
        </h2>
        <p style={{ color: MUT, fontSize: 14 }}>
          Glissez-déposez votre fichier ou cliquez pour parcourir. L'OCR extraira automatiquement les informations.
        </p>
      </div>

      {/* Big upload zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        style={{
          border: `2.5px dashed ${drag ? P : BD}`,
          borderRadius: RXL,
          padding: "56px 32px",
          textAlign: "center",
          background: drag ? PXX : "#fafbff",
          cursor: "pointer",
          transition: "all .2s",
          position: "relative",
          overflow: "hidden",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = P; e.currentTarget.style.background = PXX; }}
        onMouseLeave={e => { if (!drag) { e.currentTarget.style.borderColor = BD; e.currentTarget.style.background = "#fafbff"; } }}
      >
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: `${P}08` }} />
        <div style={{ position: "absolute", bottom: -30, left: -30, width: 120, height: 120, borderRadius: "50%", background: `${ACC}0a` }} />

        <div style={{ position: "relative" }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: `linear-gradient(135deg, ${P}18, ${ACC}22)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
            animation: drag ? "fourn-bounce .6s ease infinite" : "none",
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={P} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>

          <div style={{ fontSize: 17, fontWeight: 800, color: TXT, marginBottom: 8 }}>
            {drag ? "Relâchez pour analyser" : "Glissez votre document ici"}
          </div>
          <div style={{ fontSize: 13, color: MUT, marginBottom: 24 }}>
            Formats acceptés : PDF · DOCX · TIFF · JPEG · PNG — Taille max. 20 Mo
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}
              style={{ ...btnP(), fontSize: 14 }}>
              <span style={{ display: "flex" }}>{Ic.upload}</span>
              Parcourir les fichiers
            </button>
          </div>

          <input ref={fileRef} type="file"
            accept=".pdf,.docx,.tiff,.jpg,.jpeg,.png"
            style={{ display: "none" }}
            onChange={e => { const f = e.target.files[0]; if (f) startScan(f); }} />
        </div>
      </div>

      {/* Supported types */}
      <div style={{ display: "flex", gap: 10, marginTop: 16, justifyContent: "center", flexWrap: "wrap" }}>
        {["Facture", "Bon de livraison", "Contrat", "Rapport"].map(t => (
          <span key={t} style={{
            padding: "6px 14px", borderRadius: 20, fontSize: 12.5,
            background: PXL, color: P, fontWeight: 600, border: `1px solid ${BD}`,
          }}>
            {t}
          </span>
        ))}
      </div>

      {/* Security note */}
      <div style={{
        marginTop: 20, padding: "12px 16px", borderRadius: R,
        background: "#f0faf4", border: "1px solid #b7e4cc",
        display: "flex", gap: 10, alignItems: "center", fontSize: 12.5, color: "#1a6e3c",
      }}>
        <span style={{ display: "flex", flexShrink: 0 }}>{Ic.shield}</span>
        Transmission sécurisée SSL · Documents chiffrés en transit · Conformité RGPD
      </div>
    </div>
  );

  /* ─── SCANNING phase ─── */
  if (phase === "scanning") return (
    <div style={{ animation: "fourn-fade .3s ease both", textAlign: "center", padding: "20px 0" }}>
      {/* Animated document */}
      <div style={{
        position: "relative", width: 120, height: 150,
        margin: "0 auto 28px",
        borderRadius: 10,
        background: "linear-gradient(145deg, #1a2d5c, #324372)",
        boxShadow: "0 12px 40px rgba(50,67,114,.35)",
        overflow: "hidden",
      }}>
        {/* Lines decoration */}
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} style={{
            position: "absolute", left: 14, right: 14,
            height: 2, borderRadius: 2,
            background: "rgba(255,255,255,.15)",
            top: 30 + i * 22,
          }} />
        ))}
        {/* PDF icon */}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: .4 }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
        </div>
        {/* Scan laser */}
        <div style={{
          position: "absolute", left: 0, right: 0, height: 3,
          background: `linear-gradient(90deg, transparent, ${ACC}, transparent)`,
          animation: "fourn-scan 1.3s linear infinite",
          boxShadow: `0 0 14px 3px ${ACC}`,
        }} />
        {/* Filename */}
        <div style={{
          position: "absolute", bottom: 8, left: 8, right: 8,
          fontSize: 8, color: "rgba(255,255,255,.6)", textAlign: "center",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {file?.name}
        </div>
      </div>

      <h3 style={{ fontSize: 18, fontWeight: 800, color: TXT, marginBottom: 6 }}>
        Analyse OCR en cours…
      </h3>
      <p style={{
        fontSize: 13, color: MUT, marginBottom: 28,
        animation: "fourn-pulse 1.1s ease infinite", minHeight: 20,
      }}>
        {OCR_MSGS[msgIdx]}
      </p>

      {/* Progress bar */}
      <div style={{ maxWidth: 380, margin: "0 auto" }}>
        <div style={{ background: "#e8ecf5", borderRadius: 6, height: 10, overflow: "hidden", marginBottom: 8 }}>
          <div style={{
            height: "100%", width: `${prog}%`,
            background: `linear-gradient(90deg, ${P}, ${PL})`,
            borderRadius: 6,
            transition: "width .1s linear",
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: MUT }}>
          <span>Extraction en cours</span>
          <span style={{ fontWeight: 700, color: P }}>{Math.round(prog)}%</span>
        </div>
      </div>

      {/* Steps indicators */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 24, flexWrap: "wrap" }}>
        {["Lecture", "Extraction", "Validation", "Score"].map((s, i) => (
          <span key={s} style={{
            padding: "4px 12px", borderRadius: 20, fontSize: 11.5, fontWeight: 600,
            background: prog > i * 25 ? PXL : "#f0f2f8",
            color: prog > i * 25 ? P : MUT,
            transition: "all .3s",
          }}>
            {s}
          </span>
        ))}
      </div>
    </div>
  );

  /* ─── EDIT phase ─── */
  if (phase === "edit") return (
    <div style={{ animation: "fourn-up .35s ease both" }}>
      {/* OCR Result header */}
      <div style={{
        ...card({ marginBottom: 20 }),
        padding: "16px 20px",
        background: `linear-gradient(135deg, ${P}, ${PL})`,
        border: "none",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10,
            background: "rgba(255,255,255,.15)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <span style={{ display: "flex", color: WH }}>{Ic.robot}</span>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: WH }}>Données extraites par OCR</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)" }}>{file?.name}</div>
          </div>
        </div>
        <div style={{ textAlign: "center", flexShrink: 0 }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: WH, lineHeight: 1 }}>{fields.score}%</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,.7)" }}>Confiance</div>
        </div>
      </div>

      {/* Confidence pills */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { l: "Identification", v: 98 },
          { l: "Montants",       v: fields.score },
          { l: "Coordonnées",    v: 95 },
          { l: "Dates",          v: 93 },
        ].map(c => (
          <span key={c.l} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "5px 12px", borderRadius: 20, fontSize: 12,
            background: c.v >= 85 ? "#e8f7ef" : c.v >= 70 ? "#fff8e6" : "#ffeaea",
            color: c.v >= 85 ? SUC : c.v >= 70 ? WRN : ERR,
            fontWeight: 600, border: `1px solid ${c.v >= 85 ? "#b7e4cc" : c.v >= 70 ? "#f5d98a" : "#f5b8b8"}`,
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill={c.v >= 85 ? SUC : c.v >= 70 ? WRN : ERR}>
              <circle cx="12" cy="12" r="10"/>
            </svg>
            {c.l} — {c.v}%
          </span>
        ))}
      </div>

      {/* Edit notice */}
      <div style={{
        padding: "10px 14px", borderRadius: R,
        background: "#fffbe6", border: "1px solid #f5d98a",
        display: "flex", gap: 10, marginBottom: 20, fontSize: 12.5, color: "#7a5300",
      }}>
        <span style={{ display: "flex", flexShrink: 0 }}>{Ic.edit}</span>
        Vérifiez et corrigez les informations extraites avant l'envoi. Les champs marqués <span style={{ color: ERR, fontWeight: 700, margin: "0 3px" }}>*</span> sont obligatoires.
      </div>

      {/* Type document + notes */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#4a5568", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6, display: "block" }}>
            Type de document *
          </label>
          <select value={docType} onChange={e => setDocType(e.target.value)}
            style={{ ...inp(), cursor: "pointer" }}>
            <option>Facture</option>
            <option>Bon de livraison</option>
            <option>Contrat</option>
            <option>Rapport</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#4a5568", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6, display: "block" }}>
            Émetteur (auto-rempli)
          </label>
          <input value={account.nom} disabled style={{ ...inp(), background: "#f7f8fc", color: MUT, cursor: "not-allowed" }} />
        </div>
      </div>

      {/* Extracted fields grid */}
      <div style={{
        ...card(),
        padding: "20px",
        marginBottom: 14,
      }}>
        <div style={{
          fontSize: 11.5, fontWeight: 800, color: MUT, textTransform: "uppercase",
          letterSpacing: ".08em", marginBottom: 16,
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{ display: "flex" }}>{Ic.paper}</span> Données extraites du document
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <EditField label="Numéro de document *" value={fields.numero || ""} onChange={setField("numero")} error={fieldErr.numero} />
          <EditField label="Date du document"     value={fields.date_doc || ""} onChange={setField("date_doc")} />
          <EditField label="NIF fournisseur"       value={fields.nif || account.nif} onChange={setField("nif")} disabled />
          <EditField label="IBAN *"                value={fields.iban || ""} onChange={setField("iban")} placeholder="MG480001000…" error={fieldErr.iban} />
          <EditField label="Montant HT (Ar)"       value={fields.ht || ""} onChange={setField("ht")} type="number" />
          <EditField label="TVA (Ar)"              value={fields.tva || ""} onChange={setField("tva")} type="number" />
          <EditField label="Total TTC (Ar) *"      value={fields.total || ""} onChange={setField("total")} type="number" error={fieldErr.total}
            style={{ gridColumn: "span 2" }} />
        </div>
      </div>

      {/* Notes */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 12, fontWeight: 700, color: "#4a5568", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6, display: "block" }}>
          Notes / Observations
        </label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={3}
          placeholder="Informations complémentaires (optionnel)…"
          style={{ ...inp(), resize: "vertical", minHeight: 80 }}
        />
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
        <button onClick={() => { setPhase("idle"); setFile(null); setFields({}); }}
          style={{ ...btnP(true) }}>
          <span style={{ display: "flex" }}>{Ic.x}</span> Annuler
        </button>
        <button onClick={handleSubmit} disabled={submitting}
          style={{ ...btnP(), opacity: submitting ? .7 : 1, minWidth: 180, justifyContent: "center" }}>
          {submitting ? (
            <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <svg style={{ animation: "fourn-spin .8s linear infinite" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M21 12a9 9 0 1 1-18 0" />
              </svg>
              Envoi en cours…
            </span>
          ) : (
            <><span style={{ display: "flex" }}>{Ic.send}</span> Envoyer au back-office</>
          )}
        </button>
      </div>
    </div>
  );

  return null;
}

/* ─── small edit field ─── */
function EditField({ label, value, onChange, type = "text", placeholder, error, disabled, style: extraStyle }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={extraStyle}>
      <label style={{ fontSize: 11.5, fontWeight: 700, color: "#4a5568", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 5, display: "block" }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...inp({ padding: "9px 12px", fontSize: 13 }),
          borderColor: error ? ERR : focused ? P : BD,
          boxShadow: focused ? `0 0 0 3px ${PXL}` : "none",
          background: disabled ? "#f7f8fc" : WH,
          color: disabled ? MUT : TXT,
        }}
      />
      {error && <div style={{ fontSize: 11.5, color: ERR, marginTop: 3 }}>{error}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCREEN 3 — SUCCESS
═══════════════════════════════════════════════════════════ */
function SuccessScreen({ doc, account, onNewDoc, onLogout }) {
  return (
    <div style={{ animation: "fourn-up .45s ease both", textAlign: "center" }}>
      {/* Animated checkmark */}
      <div style={{
        width: 88, height: 88, borderRadius: "50%",
        background: `linear-gradient(135deg, #0fa86c22, #0fa86c44)`,
        border: `3px solid ${SUC}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 24px",
        animation: "fourn-success .5s cubic-bezier(.34,1.56,.64,1) both",
      }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={SUC} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>

      <h2 style={{ fontSize: 24, fontWeight: 900, color: TXT, marginBottom: 8 }}>
        Document envoyé avec succès !
      </h2>
      <p style={{ fontSize: 14, color: MUT, marginBottom: 28, maxWidth: 440, margin: "0 auto 28px" }}>
        Votre document a été transmis au service comptable. Vous recevrez une confirmation dès validation.
      </p>

      {/* Doc summary card */}
      <div style={{ ...card({ margin: "0 auto 24px", maxWidth: 440, textAlign: "left" }), padding: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: MUT, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 14 }}>
          Récapitulatif
        </div>
        {[
          ["Référence",  doc.id],
          ["Type",       doc.type],
          ["Fournisseur", account.nom],
          ["Montant TTC", fmtN(doc.mt)],
          ["Date dépôt",  doc.date],
          ["Score OCR",   `${doc.ocr}%`],
          ["Statut",      "REÇU — En attente de traitement"],
        ].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${BD}`, fontSize: 13 }}>
            <span style={{ color: MUT }}>{k}</span>
            <span style={{ fontWeight: 700, color: TXT, textAlign: "right", maxWidth: "60%" }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Timeline hint */}
      <div style={{ ...card({ margin: "0 auto 28px", maxWidth: 440 }), padding: "14px 20px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: MUT, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 12 }}>
          Prochaines étapes
        </div>
        {[
          { l: "Réception & Contrôle",  t: "1–2 jours ouvrables" },
          { l: "Validation Technique",  t: "2–3 jours ouvrables" },
          { l: "Validation Financière", t: "1–2 jours ouvrables" },
          { l: "Approbation DAF",       t: "1 jour ouvrable" },
        ].map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{
              width: 26, height: 26, borderRadius: "50%",
              background: i === 0 ? `${P}22` : "#f0f2f8",
              color: i === 0 ? P : MUT,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, flexShrink: 0,
            }}>{i + 1}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: TXT }}>{s.l}</div>
            </div>
            <div style={{ fontSize: 11.5, color: MUT, display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ display: "flex" }}>{Ic.clock}</span> {s.t}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <button onClick={onNewDoc} style={{ ...btnP(), gap: 8 }}>
          <span style={{ display: "flex" }}>{Ic.plus}</span> Nouveau document
        </button>
        <button onClick={onLogout} style={{ ...btnP(true), gap: 8 }}>
          <span style={{ display: "flex" }}>{Ic.logout}</span> Se déconnecter
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PORTAL SHELL
═══════════════════════════════════════════════════════════ */
export default function FournisseurPortal() {
  const [screen, setScreen]   = useState("auth");    // "auth" | "upload" | "success"
  const [account, setAccount] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);

  /* Check saved session */
  useEffect(() => {
    const saved = lsGet(LS_AUTH);
    if (saved?.nif) { setAccount(saved); setScreen("upload"); }
  }, []);

  const handleAuth    = (acc)  => { setAccount(acc); setScreen("upload"); };
  const handleSubmit  = (doc)  => { setLastDoc(doc); setScreen("success"); };
  const handleNewDoc  = ()     => setScreen("upload");
  const handleLogout  = ()     => {
    lsSet(LS_AUTH, null);
    localStorage.removeItem(LS_AUTH);
    setAccount(null);
    setScreen("auth");
  };

  const STEPS = ["Authentification", "Dépôt & OCR", "Confirmation"];
  const stepIdx = screen === "auth" ? 0 : screen === "upload" ? 1 : 2;

  return (
    <div className="fourn-root" style={{ minHeight: "100vh", background: BG, display: "flex", flexDirection: "column" }}>

      {/* ── TOP HEADER ── */}
      <header style={{
        background: `linear-gradient(135deg, ${P2} 0%, ${P} 60%, ${PL} 100%)`,
        boxShadow: "0 4px 24px rgba(50,67,114,.25)",
        flexShrink: 0,
      }}>
        {/* Top bar */}
        <div style={{ padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: "rgba(255,255,255,.15)",
              backdropFilter: "blur(4px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid rgba(255,255,255,.2)",
              flexShrink: 0,
            }}>
              <span style={{ color: WH, fontWeight: 900, fontSize: 15, letterSpacing: "-0.5px" }}>SD</span>
            </div>
            <div>
              <div style={{ color: WH, fontWeight: 800, fontSize: 16, letterSpacing: "-.3px" }}>SoftDocs</div>
              <div style={{ color: "rgba(255,255,255,.65)", fontSize: 11 }}>Portail Fournisseurs</div>
            </div>
          </div>

          {/* Right — account info or badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {account ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: WH, fontWeight: 700, fontSize: 13 }}>{account.nom}</div>
                  <div style={{ color: "rgba(255,255,255,.6)", fontSize: 11 }}>NIF: {account.nif}</div>
                </div>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: "rgba(255,255,255,.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: WH, fontWeight: 800, fontSize: 12,
                }}>
                  {account.nom.charAt(0).toUpperCase()}
                </div>
                <button onClick={handleLogout}
                  style={{ background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)", borderRadius: 8, padding: "7px 12px", color: "rgba(255,255,255,.8)", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontFamily: "inherit" }}>
                  <span style={{ display: "flex" }}>{Ic.logout}</span> Déconnexion
                </button>
              </div>
            ) : (
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "rgba(255,255,255,.12)", borderRadius: 8, padding: "6px 14px",
                fontSize: 12.5, color: "rgba(255,255,255,.85)", border: "1px solid rgba(255,255,255,.15)",
              }}>
                <span style={{ display: "flex" }}>{Ic.shield}</span>
                Espace sécurisé
              </div>
            )}
          </div>
        </div>

        {/* Subtitle band */}
        {screen !== "success" && (
          <div style={{ padding: "0 32px 16px" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: WH, marginBottom: 4, letterSpacing: "-.4px" }}>
              {screen === "auth" ? "Accès Portail Fournisseur" : "Déposer un document"}
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.65)" }}>
              {screen === "auth"
                ? "Connectez-vous ou créez un compte pour soumettre vos documents."
                : `Connecté en tant que ${account?.nom} · NIF ${account?.nif}`}
            </div>
          </div>
        )}
      </header>

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "32px 20px 60px" }}>
        <div style={{
          width: "100%",
          maxWidth: screen === "upload" ? 720 : 560,
          animation: "fourn-up .4s ease both",
        }}>

          {/* Stepper */}
          {screen !== "success" && <Stepper steps={STEPS} current={stepIdx} />}

          {/* Main card */}
          <div style={{ ...card({ boxShadow: SHADOW_XL }), padding: 32 }}>
            {screen === "auth" && <AuthScreen onAuth={handleAuth} />}
            {screen === "upload" && account && (
              <UploadScreen account={account} onSubmit={handleSubmit} />
            )}
            {screen === "success" && lastDoc && (
              <SuccessScreen
                doc={lastDoc}
                account={account}
                onNewDoc={handleNewDoc}
                onLogout={handleLogout}
              />
            )}
          </div>

          {/* Footer note */}
          <p style={{ textAlign: "center", fontSize: 12, color: "#9ba8c0", marginTop: 20 }}>
            © 2025 SoftDocs — Système de Gestion Électronique de Documents · Madagascar
          </p>
        </div>
      </main>
    </div>
  );
}
