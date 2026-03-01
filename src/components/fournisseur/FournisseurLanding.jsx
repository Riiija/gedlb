"use client";
import { useT } from "../../lib/i18n";
import React, { useState } from "react";
import { FournisseurPortal } from "./FournisseurPortal";
import { FournisseurSuivi }  from "./FournisseurSuivi";

const P   = "#324372";
const P2  = "#1e2a4a";
const PL  = "#4a6ab0";
const ACC = "#1ecad3";
const WH  = "#ffffff";
const BD  = "rgba(255,255,255,.18)";

/* ── Floating animated shapes ── */
function Shapes() {
  return (
    <>
      <div style={{ position:"absolute",top:-120,right:-80,width:500,height:500,borderRadius:"50%",background:`${ACC}0f`,animation:"fourn-up 8s ease-in-out infinite alternate",pointerEvents:"none" }}/>
      <div style={{ position:"absolute",bottom:-100,left:-80,width:400,height:400,borderRadius:"50%",background:`${WH}06`,animation:"fourn-up 6s ease-in-out infinite alternate-reverse",pointerEvents:"none" }}/>
      <div style={{ position:"absolute",top:"35%",left:"8%",width:180,height:180,borderRadius:"50%",background:`${WH}04`,pointerEvents:"none" }}/>
      {/* Grid dots */}
      <div style={{ position:"absolute",inset:0,backgroundImage:`radial-gradient(${WH}18 1px,transparent 1px)`,backgroundSize:"40px 40px",pointerEvents:"none" }}/>
    </>
  );
}

/* ── Action card ── */
function ActionCard({ icon, title, desc, color, onClick, delay }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? WH : "rgba(255,255,255,.07)",
        border: `1.5px solid ${hovered ? WH : "rgba(255,255,255,.2)"}`,
        borderRadius: 20,
        padding: "36px 28px",
        cursor: "pointer",
        textAlign: "center",
        transition: "all .22s ease",
        animation: `fourn-up .5s ease ${delay}ms both`,
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? "0 20px 50px rgba(0,0,0,.18)" : "0 4px 12px rgba(0,0,0,.1)",
        fontFamily: "inherit",
        flex: 1,
        minWidth: 220,
        maxWidth: 300,
      }}>
      {/* Icon circle */}
      <div style={{
        width: 72, height: 72, borderRadius: "50%",
        background: hovered ? `${color}18` : "rgba(255,255,255,.12)",
        border: `2px solid ${hovered ? color : "rgba(255,255,255,.2)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 20px",
        transition: "all .22s",
      }}>
        <span style={{ color: hovered ? color : WH, transition: "color .22s", fontSize: 28 }}>{icon}</span>
      </div>

      <div style={{
        fontSize: 18, fontWeight: 800,
        color: hovered ? P : WH,
        marginBottom: 10, letterSpacing: "-.3px",
        transition: "color .22s",
      }}>
        {title}
      </div>
      <div style={{
        fontSize: 13.5,
        color: hovered ? "#4a5568" : "rgba(255,255,255,.65)",
        lineHeight: 1.5,
        transition: "color .22s",
      }}>
        {desc}
      </div>

      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        marginTop: 20, fontSize: 13, fontWeight: 700,
        color: hovered ? color : "rgba(255,255,255,.7)",
        transition: "color .22s",
      }}>
        Commencer
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      </div>
    </button>
  );
}

/* ── Feature badge ── */
function Badge({ text }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "5px 12px", borderRadius: 20,
      background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)",
      fontSize: 12, color: "rgba(255,255,255,.8)", fontWeight: 500,
    }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      {text}
    </span>
  );
}

/* ═══════════════════════════════════════════════
   MAIN LANDING
═══════════════════════════════════════════════ */
export default function FournisseurLanding() {
  const [lang, setLang] = React.useState(() => {
    if (typeof window === "undefined") return "fr";
    return localStorage.getItem("softdocs_lang") || "fr";
  });
  const t = useT(lang);
  const [view, setView] = useState("home");

  if (view === "upload") return <FournisseurPortal onBack={() => setView("home")} />;
  if (view === "suivi")  return <FournisseurSuivi  onBack={() => setView("home")} lang={lang} />;

  return (
    <div style={{
      minHeight: "100vh",
      fontFamily: "'Plus Jakarta Sans','Inter',system-ui,sans-serif",
      background: `linear-gradient(160deg, ${P2} 0%, ${P} 50%, ${PL} 100%)`,
      display: "flex", flexDirection: "column",
      position: "relative", overflow: "hidden",
    }}>
      <Shapes />

      {/* ── HEADER ── */}
      <header style={{
        padding: "18px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid rgba(255,255,255,.08)",
        position: "relative", zIndex: 10,
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 10,
            background: WH,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px rgba(0,0,0,.2)", flexShrink: 0,
          }}>
            <img src="/softdocs-logo.png" alt="SoftDocs" style={{ width: 34, height: 34, objectFit: "contain" }} />
          </div>
          <div>
            <div style={{ color: WH, fontWeight: 800, fontSize: 17, letterSpacing: "-.3px" }}>SoftDocs</div>
            <div style={{ color: "rgba(255,255,255,.55)", fontSize: 11 }}>{t.portailTitle}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "6px 14px", borderRadius: 20,
            background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)",
            fontSize: 12.5, color: "rgba(255,255,255,.8)",
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Espace sécurisé SSL
          </span>
        </div>
      </header>

      {/* ── HERO ── */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "60px 24px 80px",
        position: "relative", zIndex: 10,
      }}>
        {/* Label */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "8px 18px", borderRadius: 24,
          background: "rgba(30,202,211,.15)", border: "1px solid rgba(30,202,211,.3)",
          color: ACC, fontSize: 12.5, fontWeight: 700,
          marginBottom: 24, letterSpacing: ".05em", textTransform: "uppercase",
          animation: "fourn-up .4s ease both",
        }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: ACC, animation: "fourn-pulse 2s ease infinite" }} />
          Plateforme active — Madagascar
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: "clamp(32px, 5vw, 52px)",
          fontWeight: 900, color: WH,
          textAlign: "center", lineHeight: 1.12,
          letterSpacing: "-.04em", marginBottom: 18,
          maxWidth: 700,
          animation: "fourn-up .4s .08s ease both",
        }}>
          Votre espace{" "}
          <span style={{
            background: `linear-gradient(90deg, ${ACC}, #7dd3fc)`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            fournisseur
          </span>
        </h1>

        <p style={{
          fontSize: 16, color: "rgba(255,255,255,.68)", textAlign: "center",
          maxWidth: 520, lineHeight: 1.6, marginBottom: 48,
          animation: "fourn-up .4s .15s ease both",
        }}>
          Déposez, suivez et gérez vos documents en toute sécurité. Accédez au tableau de bord complet via votre compte interne.
        </p>

        {/* ── 3 ACTION CARDS ── */}
        <div style={{
          display: "flex", gap: 20, flexWrap: "wrap",
          justifyContent: "center", width: "100%", maxWidth: 960,
          marginBottom: 52,
        }}>
          <ActionCard
            delay={180}
            icon={
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            }
            title="{t.deposeTitle}"
            desc="Créez un compte et soumettez vos factures, bons de livraison et contrats avec extraction OCR automatique."
            color="#1ecad3"
            onClick={() => setView("upload")}
          />
          <ActionCard
            delay={260}
            icon={
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            }
            title="Suivi document"
            desc="Consultez en temps réel le statut de traitement de vos documents soumis et l'avancement des validations."
            color="#7dd3fc"
            onClick={() => setView("suivi")}
          />
          <ActionCard
            delay={340}
            icon={
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            }
            title="{t.backofficeTitle}"
            desc="Accédez au tableau de bord complet SoftDocs avec votre compte utilisateur interne."
            color="#a78bfa"
            onClick={() => { window.location.href = "/login"; }}
          />
        </div>

        {/* Feature badges */}
        <div style={{
          display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center",
          animation: "fourn-up .4s .4s ease both",
        }}>
          <Badge text="Transmission SSL chiffrée" />
          <Badge text="OCR automatique" />
          <Badge text="Suivi en temps réel" />
          <Badge text="Conformité RGPD" />
          <Badge text="Archivage numérique" />
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{
        padding: "18px 40px",
        borderTop: "1px solid rgba(255,255,255,.08)",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", zIndex: 10,
        flexShrink: 0,
      }}>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,.4)", textAlign: "center" }}>
          © 2025 SoftDocs — Système de Gestion Électronique de Documents · Madagascar
        </p>
      </footer>

      <style>{`
        @keyframes fourn-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fourn-pulse {
          0%,100% { opacity:1; }
          50% { opacity:.3; }
        }
        @keyframes fourn-scan {
          0%   { top: -6px; }
          100% { top: calc(100% + 6px); }
        }
        @keyframes fourn-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fourn-success {
          0%   { transform: scale(.6) rotate(-8deg); opacity:0; }
          70%  { transform: scale(1.08) rotate(1deg); }
          100% { transform: scale(1) rotate(0); opacity:1; }
        }
        @keyframes fourn-bounce {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
