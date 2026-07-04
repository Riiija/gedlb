"use client";
import GestionUsersPortail from "../users/GestionUsersPortail";
import GestionProjetsPortail from "../params/GestionProjetsPortail";
import GestionLicencesPortail from "../params/GestionLicencesPortail";
import { useState, useEffect, useCallback } from "react";
import { useApp, BACKOFFICE_USERS } from "../../context/AppContext";
import { SOFTWELL_LOGO } from "../../lib/logoBase64";
import { useIsMobile } from "../../lib/useResponsive";

/* ─── App definitions ─────────────────────────────────── */
const I = {
  dash:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  upload:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
  inbox:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>,
  search:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  chart:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  folder:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  money:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0"/><path d="M6 12h.01M18 12h.01"/></svg>,
  bank:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>,
  download: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  tag:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  cog:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  users:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  map:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
  shield:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-5"/></svg>,
};

const APPS = [
  {
    id: "softdocs",
    name: "SoftDocs",
    tagline: "GED & Gestion Documentaire",
    color: "#2563eb",
    glow: "rgba(37,99,235,.45)",
    gradFrom: "#1e3a8a", gradTo: "#3b82f6",
    logo: "/softdocs-logo-final.png",
    shortcuts: [
      { label: "Tableau de bord",  view: "dashboard",    icon: I.dash   },
      { label: "Déposer un doc",   view: "depot",        icon: I.upload },
      { label: "Docs reçus",       view: "recus-f",      icon: I.inbox  },
      { label: "Suivi & Recherche",view: "suivi",        icon: I.search },
      { label: "États & Rapports", view: "etats",        icon: I.chart  },
      { label: "WorkFlow",         view: "param_types",  icon: I.folder },
    ],
  },
  {
    id: "epaiement",
    name: "Soft e-Payment",
    tagline: "Liquidations & Paiements Bancaires",
    color: "#7c3aed",
    glow: "rgba(124,58,237,.45)",
    gradFrom: "#4c1d95", gradTo: "#7c3aed",
    logo: "/softepayment-logo.png",
    shortcuts: [
      { label: "Tableau de bord",   view: "ep-dashboard",       icon: I.dash     },
      { label: "Liquidations",      view: "ep-liq",             icon: I.money    },
      { label: "Liste paiements",   view: "ep-liste-paiements", icon: I.bank     },
      { label: "Générer XML",       view: "ep-xml",             icon: I.download },
      { label: "Nature remise",     view: "ep-nature-remise",   icon: I.tag      },
      { label: "Balise XML",        view: "ep-balise-xml",      icon: I.cog      },
    ],
  },
  {
    id: "softlibrary",
    name: "Soft Library",
    tagline: "Archives Physiques & Courrier",
    color: "#0891b2",
    glow: "rgba(8,145,178,.45)",
    gradFrom: "#0c4a6e", gradTo: "#0369a1",
    logo: "/softlibrary.png",
    shortcuts: [
      { label: "Tableau de bord", view: "lib-dashboard", icon: I.dash   },
      { label: "Documents",       view: "lib-documents", icon: I.inbox  },
      { label: "Courrier",        view: "lib-courrier",  icon: I.inbox  },
      { label: "Cycle de vie",    view: "lib-cycle-vie", icon: I.chart  },
    ],
  },
  {
    id: "softsign",
    name: "SoftSign",
    tagline: "Signature & Validation Électronique",
    color: "#7c3aed",
    glow: "rgba(124,58,237,.45)",
    gradFrom: "#4c1d95", gradTo: "#7c3aed",
    logo: "/softsign.png",
    shortcuts: [
      { label: "Tableau de bord", view: "ss-dashboard",    icon: I.dash   },
      { label: "Documents",       view: "ss-tous-docs",    icon: I.folder },
      { label: "Validation",      view: "ss-validation",   icon: I.users  },
      { label: "Signature",       view: "ss-signature",    icon: I.upload },
      { label: "Devis",           view: "ss-devis-recus",  icon: I.chart  },
      { label: "Contrats",        view: "ss-contrats",     icon: I.inbox  },
    ],
  },
  {
    id: "softbudget",
    name: "SoftBudget",
    tagline: "Budgets & Engagements",
    color: "#0f766e",
    glow: "rgba(15,118,110,.42)",
    gradFrom: "#0f766e", gradTo: "#14b8a6",
    logo: "/softbudget-logo.svg",
    shortcuts: [
      { label: "Referentiel",     view: "budget-referentiel",  icon: I.folder },
      { label: "Tableau de bord", view: "budget-dashboard",    icon: I.dash   },
      { label: "Construction",    view: "budget-planning",     icon: I.money  },
      { label: "Engagements",     view: "budget-engagements",  icon: I.folder },
      { label: "Reporting",       view: "budget-reporting",    icon: I.chart  },
      { label: "Consolidation",   view: "budget-consolidation",icon: I.bank   },
    ],
  },
];

const COMMON_SA = [
  { label: "Utilisateurs",  view: "portal-users",   portal: true, icon: I.users },
  { label: "Projets & Sites",view: "portal-projets", portal: true, icon: I.map  },
  { label: "Gestion des licences",view: "portal-licenses", portal: true, icon: I.shield },
];

const PORTAL_META = {
  "portal-users": { title: "Gestion des utilisateurs", mobileTitle: "Utilisateurs", icon: "U" },
  "portal-projets": { title: "Projets & Sites", mobileTitle: "Projets & Sites", icon: "P" },
  "portal-licenses": { title: "Gestion des licences", mobileTitle: "Gestion des licences", icon: "L" },
};

function PortalContent({ page }) {
  if (page === "portal-users") return <GestionUsersPortail />;
  if (page === "portal-projets") return <GestionProjetsPortail />;
  if (page === "portal-licenses") return <GestionLicencesPortail />;
  return null;
}

/* ─── Orbital nodes ─── */
const ORBIT_NODES = [
  { a: 0,   r: 265, label: "Documents",    icon: "📄", color: "37,99,235"   },
  { a: 36,  r: 278, label: "Validation",   icon: "✅", color: "5,150,105"   },
  { a: 72,  r: 258, label: "Liquidation",  icon: "💰", color: "217,119,6"   },
  { a: 108, r: 272, label: "Paiements",    icon: "🏦", color: "124,58,237"  },
  { a: 144, r: 262, label: "Rapports",     icon: "📊", color: "8,145,178"   },
  { a: 180, r: 278, label: "Fournisseurs", icon: "🏢", color: "220,38,38"   },
  { a: 216, r: 258, label: "Projets",      icon: "🗂",  color: "101,163,13"  },
  { a: 252, r: 272, label: "Paramètres",   icon: "⚙️", color: "100,116,139" },
  { a: 288, r: 262, label: "Utilisateurs", icon: "👥", color: "192,38,211"  },
  { a: 324, r: 278, label: "Archives",     icon: "📚", color: "12,74,110"   },
];

/* ══════════════════════════════════════════════════════════════
   ██  MOBILE LAUNCHER
   ══════════════════════════════════════════════════════════════ */
const MOBILE_BUBBLES = [
  { icon:"📄", x:15, y:12, d:5,   s:44 },
  { icon:"✅", x:72, y:8,  d:7,   s:40 },
  { icon:"💰", x:42, y:5,  d:6,   s:38 },
  { icon:"🏦", x:85, y:22, d:8,   s:36 },
  { icon:"📊", x:8,  y:28, d:9,   s:34 },
  { icon:"🏢", x:58, y:30, d:6.5, s:36 },
  { icon:"⚙️", x:30, y:32, d:7.5, s:32 },
  { icon:"📚", x:45, y:18, d:6.5, s:38 },
];

function MobileLauncher({ authUser, userApps, openApp, setView, portalPage, setPortalPage }) {
  const _buUser = BACKOFFICE_USERS.find(u => u.id === authUser?.id);
  const isSA = (_buUser?.systemRole || authUser?.systemRole) === "superadmin";
  const [expandedApp, setExpandedApp] = useState(null);
  const [entered, setEntered] = useState(false);
  useEffect(() => { setTimeout(() => setEntered(true), 60); }, []);

  function goShortcut(appId, view) { openApp(appId); setView(view); }
  function logout() {
    try { localStorage.removeItem("softdocs_auth"); localStorage.removeItem("softdocs_currentApp"); } catch {}
    window.location.href = "/login";
  }

  if (portalPage) {
    const meta = PORTAL_META[portalPage] || PORTAL_META["portal-users"];
    return (
      <div style={{ position:"fixed", inset:0, zIndex:2000, display:"flex", flexDirection:"column", background:"#f8fafc", fontFamily:"'Plus Jakarta Sans','DM Sans',system-ui,sans-serif" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", background:"#fff", borderBottom:"1px solid #e2e8f0", boxShadow:"0 1px 4px rgba(0,0,0,.06)", flexShrink:0, paddingTop:"max(12px, env(safe-area-inset-top))" }}>
          <button onClick={() => setPortalPage(null)} style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"8px 14px", borderRadius:8, border:"1px solid #e2e8f0", background:"#fff", cursor:"pointer", fontSize:13, fontWeight:700, color:"#475569", fontFamily:"inherit" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>Retour
          </button>
          <span style={{ fontSize:14, fontWeight:800, color:"#0f172a", flex:1 }}>{meta.mobileTitle}</span>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"14px 12px", WebkitOverflowScrolling:"touch" }}>
          <PortalContent page={portalPage}/>
        </div>
      </div>
    );
  }

  const greetHour = new Date().getHours();
  const greet = greetHour < 12 ? "Bonjour" : greetHour < 18 ? "Bon après-midi" : "Bonsoir";

  return (
    <div style={{ height:"100dvh", display:"flex", flexDirection:"column", overflow:"hidden", background:"#f0f4ff", fontFamily:"'Plus Jakarta Sans','DM Sans',system-ui,sans-serif" }}>

      {/* Hero */}
      <div style={{ position:"relative", overflow:"hidden", flexShrink:0, background:"linear-gradient(160deg,#1e3a8a 0%,#2563eb 50%,#7c3aed 100%)", paddingTop:"max(12px, env(safe-area-inset-top))", paddingBottom:32 }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(circle at 80% 20%,rgba(124,58,237,.3),transparent 60%)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(circle at 20% 80%,rgba(6,182,212,.15),transparent 50%)", pointerEvents:"none" }}/>
        {MOBILE_BUBBLES.map((b,i)=>(
          <div key={i} style={{ position:"absolute", left:`${b.x}%`, top:`${b.y}%`, width:b.s, height:b.s, borderRadius:b.s*.3, background:"rgba(255,255,255,.10)", backdropFilter:"blur(6px)", border:"1px solid rgba(255,255,255,.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:b.s*.42, animation:`m-float ${b.d}s ease-in-out ${i*.4}s infinite alternate`, opacity:entered?.65:0, transition:`opacity .6s ease ${i*.08}s`, pointerEvents:"none", zIndex:1 }}>{b.icon}</div>
        ))}
        <div style={{ position:"relative", zIndex:10, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 16px 0", opacity:entered?1:0, transform:entered?"none":"translateY(-10px)", transition:"all .4s ease" }}>
          <img src="/softappli-logo.png" alt="SoftAppli" style={{ height:28, objectFit:"contain", filter:"brightness(10) drop-shadow(0 1px 4px rgba(0,0,0,.3))" }}/>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:7, padding:"5px 10px 5px 5px", borderRadius:20, background:"rgba(255,255,255,.15)", border:"1px solid rgba(255,255,255,.2)", backdropFilter:"blur(8px)" }}>
              <div style={{ width:26, height:26, borderRadius:"50%", background:"rgba(255,255,255,.25)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800, color:"#fff" }}>{authUser?.init||authUser?.nom?.charAt(0)||"U"}</div>
              <span style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,.95)", maxWidth:80, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{authUser?.nom?.split(" ")[0]||"User"}</span>
            </div>
            <button onClick={logout} style={{ width:34, height:34, borderRadius:"50%", border:"1px solid rgba(255,255,255,.2)", background:"rgba(255,255,255,.1)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"rgba(255,255,255,.8)", backdropFilter:"blur(8px)" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </div>
        <div style={{ position:"relative", zIndex:10, padding:"24px 20px 0", opacity:entered?1:0, transform:entered?"none":"translateY(16px)", transition:"all .5s ease .1s" }}>
          <div style={{ fontSize:13, color:"rgba(255,255,255,.6)", marginBottom:4, fontWeight:500 }}>{greet} 👋</div>
          <h1 style={{ fontSize:28, fontWeight:900, color:"#fff", letterSpacing:"-.8px", margin:0, lineHeight:1.15 }}>{authUser?.nom?.split(" ")[0]||"Bienvenue"}</h1>
          <p style={{ fontSize:13, color:"rgba(255,255,255,.5)", margin:"8px 0 0", lineHeight:1.4 }}>Sélectionnez une application</p>
        </div>
      </div>

      {/* Scrollable body */}
      <div style={{ flex:1, minHeight:0, overflowY:"auto", WebkitOverflowScrolling:"touch", paddingBottom:"max(20px, env(safe-area-inset-bottom))", marginTop:-16, position:"relative", zIndex:5 }}>
        <div style={{ padding:"0 16px", display:"flex", flexDirection:"column", gap:14 }}>
          {APPS.map((app, ai) => {
            const hasAccess = userApps.includes(app.id);
            const isExpanded = expandedApp === app.id;
            return (
              <div key={app.id} style={{ borderRadius:20, overflow:"hidden", background:"#fff", border:isExpanded?`2px solid ${app.color}40`:`1.5px solid ${hasAccess?"#dde6f5":"#e2e8f0"}`, boxShadow:isExpanded?`0 8px 30px ${app.color}15, 0 2px 8px rgba(0,0,0,.05)`:"0 2px 12px rgba(0,0,0,.04)", opacity:entered?(hasAccess?1:.4):0, transform:entered?"translateY(0)":"translateY(20px)", transition:`all .5s cubic-bezier(.22,1,.36,1) ${.15+ai*.1}s` }}>
                <div onClick={() => hasAccess && setExpandedApp(isExpanded?null:app.id)} style={{ background:`linear-gradient(135deg,${app.gradFrom},${app.gradTo})`, padding:"16px 18px", display:"flex", alignItems:"center", gap:14, cursor:hasAccess?"pointer":"not-allowed", position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", right:-15, top:-15, width:90, height:90, borderRadius:"50%", background:"rgba(255,255,255,.07)" }}/>
                  <div style={{ width:46, height:46, borderRadius:14, background:"rgba(255,255,255,.18)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, border:"1px solid rgba(255,255,255,.15)" }}>
                    <img src={app.logo} alt={app.name} style={{ height:30, objectFit:"contain", filter:"brightness(10)" }}/>
                  </div>
                  <div style={{ flex:1, minWidth:0, position:"relative", zIndex:1 }}>
                    <div style={{ fontSize:16, fontWeight:800, color:"#fff", letterSpacing:"-.2px" }}>{app.name}</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,.6)", marginTop:2 }}>{app.tagline}</div>
                  </div>
                  {hasAccess ? (
                    <div style={{ width:30, height:30, borderRadius:"50%", background:"rgba(255,255,255,.12)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transform:isExpanded?"rotate(180deg)":"rotate(0deg)", transition:"transform .3s ease" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                  ) : (
                    <div style={{ background:"rgba(0,0,0,.25)", borderRadius:10, padding:"3px 9px", fontSize:10, fontWeight:700, color:"rgba(255,255,255,.7)" }}>🔒</div>
                  )}
                </div>
                {hasAccess && (
                  <div style={{ maxHeight:isExpanded?600:0, overflow:"hidden", transition:"max-height .45s cubic-bezier(.22,1,.36,1)" }}>
                    <div style={{ padding:"14px 16px 6px" }}>
                      <button onClick={() => openApp(app.id)} style={{ width:"100%", padding:"13px", borderRadius:14, border:"none", cursor:"pointer", fontFamily:"inherit", background:`linear-gradient(135deg,${app.gradFrom},${app.gradTo})`, color:"#fff", fontSize:14, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", gap:8, boxShadow:`0 4px 16px ${app.color}30` }}>
                        Ouvrir {app.name}
                      </button>
                    </div>
                    <div style={{ padding:"10px 16px 18px", display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6 }}>
                      {app.shortcuts.map(s => (
                        <button key={s.view} onClick={() => goShortcut(app.id, s.view)} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, padding:"14px 6px 12px", borderRadius:16, border:"none", background:"transparent", cursor:"pointer", fontFamily:"inherit", WebkitTapHighlightColor:"transparent" }}>
                          <div style={{ width:50, height:50, borderRadius:14, background:`linear-gradient(145deg,${app.color}12,${app.color}06)`, border:`1.5px solid ${app.color}18`, display:"flex", alignItems:"center", justifyContent:"center", color:app.color }}>
                            <div style={{ width:22, height:22 }}>{s.icon}</div>
                          </div>
                          <span style={{ fontSize:10.5, fontWeight:600, color:"#475569", lineHeight:1.2, textAlign:"center", maxWidth:72, overflow:"hidden", textOverflow:"ellipsis", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>{s.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {isSA && (
          <div style={{ padding:"18px 16px 0", opacity:entered?1:0, transition:"all .5s ease .4s" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
              <div style={{ flex:1, height:1, background:"#d4d9e2" }}/>
              <span style={{ fontSize:10, fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".1em" }}>⚙️ Administration</span>
              <div style={{ flex:1, height:1, background:"#d4d9e2" }}/>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {COMMON_SA.map(s => (
                <button key={s.view} onClick={() => setPortalPage(s.view)} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, padding:"16px 12px", borderRadius:16, border:"1px solid #e2e8f0", background:"#fff", cursor:"pointer", fontFamily:"inherit", boxShadow:"0 2px 8px rgba(0,0,0,.04)" }}>
                  <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#eff6ff,#f5f3ff)", border:"1.5px solid #e2e8f0", display:"flex", alignItems:"center", justifyContent:"center", color:"#475569" }}>
                    <div style={{ width:18, height:18 }}>{s.icon}</div>
                  </div>
                  <span style={{ fontSize:11.5, fontWeight:700, color:"#334155", textAlign:"center" }}>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ padding:"30px 20px 16px", textAlign:"center", opacity:entered?1:0, transition:"opacity .5s ease .5s" }}>
          <img src={SOFTWELL_LOGO} alt="Softwell" style={{ height:24, objectFit:"contain", opacity:.45, marginBottom:6 }}/>
          <div style={{ fontSize:10, color:"#b0b8c8" }}>© 2026 SoftWell — SoftAppli Suite</div>
        </div>
      </div>

      <style>{`
        @keyframes m-float{0%{transform:translateY(0) scale(1)}100%{transform:translateY(-10px) scale(1.05)}}
        *{-webkit-font-smoothing:antialiased;-webkit-tap-highlight-color:transparent}
      `}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ██  DESKTOP — Sidebar + rAF orbital — THÈME CLAIR
   ══════════════════════════════════════════════════════════════ */

function GooeyItem({ label, view, icon, color, delay, entered, waveIn, active, onClick }) {
  const [hov, setHov] = useState(false);
  const lit = active || hov;
  const [vis, setVis] = useState(false);
  useEffect(() => {
    if (waveIn) { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }
    else setVis(false);
  }, [waveIn, delay]);
  const show = entered && (waveIn === undefined ? true : vis);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ position:"relative", display:"flex", alignItems:"center", gap:10, padding:"8px 12px 8px 10px", cursor:"pointer", userSelect:"none", borderRadius:10, opacity:show?1:0, transform:show?"translateX(0)":"translateX(-14px)", transition:"opacity .35s ease, transform .4s cubic-bezier(.22,1,.36,1)", background:lit?color+"14":"transparent" }}>
      <div style={{ width:16, height:16, flexShrink:0, color:lit?color:"#94a3b8", transition:"color .2s", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ width:16, height:16 }}>{icon}</div>
      </div>
      <span style={{ fontSize:12, fontWeight:lit?700:500, color:lit?color:"#64748b", transition:"color .2s", flex:1, whiteSpace:"nowrap" }}>{label}</span>
      {active && <div style={{ width:5, height:5, borderRadius:"50%", background:color, flexShrink:0 }}/>}
    </div>
  );
}

function GooeyGroup({ app, shortcuts, openApp, setView, activeView, startDelay, entered, isOpen, onToggle, disabled }) {
  const [hovHead, setHovHead] = useState(false);
  return (
    <div style={{ marginBottom:2 }}>
      <div onClick={() => !disabled && onToggle()} onMouseEnter={() => !disabled && setHovHead(true)} onMouseLeave={() => setHovHead(false)}
        style={{ display:"flex", alignItems:"center", gap:9, padding:"8px 12px 8px 10px", cursor:disabled?"not-allowed":"pointer", userSelect:"none", borderRadius:10, background:isOpen?app.color+"0f":hovHead?"rgba(0,0,0,.03)":"transparent", transition:"background .2s, opacity .4s ease, transform .45s cubic-bezier(.22,1,.36,1)", opacity:disabled?0.35:(entered?1:0), transform:entered?"translateX(0)":"translateX(-18px)", transitionDelay:`${startDelay-40}ms` }}>
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={isOpen?app.color:"#cbd5e1"} strokeWidth="2.8" strokeLinecap="round" style={{ flexShrink:0, transition:"transform .3s", transform:isOpen?"rotate(90deg)":"rotate(0deg)" }}><polyline points="9 18 15 12 9 6"/></svg>
        <img src={app.logo} alt={app.name} style={{ height:12, objectFit:"contain", flexShrink:0, opacity:isOpen?1:.5, transition:"opacity .2s" }}/>
        <span style={{ flex:1, fontSize:11.5, fontWeight:700, color:isOpen?app.color:hovHead?"#1e293b":"#475569", transition:"color .2s" }}>{app.name}</span>
        {disabled
          ? <span style={{ fontSize:9, fontWeight:700, color:"#ef4444", background:"#fef2f2", padding:"1px 7px", borderRadius:10 }}>🔒</span>
          : <span style={{ fontSize:9, fontWeight:800, color:isOpen?"#fff":app.color, background:isOpen?app.color:app.color+"18", padding:"1px 7px", borderRadius:10, transition:"background .2s, color .2s" }}>{shortcuts.length}</span>
        }
      </div>
      <div style={{ overflow:"hidden", maxHeight:isOpen?"500px":"0px", transition:"max-height .5s cubic-bezier(.22,1,.36,1)" }}>
        <div style={{ paddingLeft:6, paddingBottom:4, paddingTop:2 }}>
          {shortcuts.map((s, i) => (
            <GooeyItem key={s.view} label={s.label} view={s.view} icon={s.icon} color={app.color} delay={isOpen?i*50:0} waveIn={isOpen} entered={entered&&isOpen} active={activeView===s.view} onClick={() => { openApp(app.id); setView(s.view); }}/>
          ))}
        </div>
      </div>
    </div>
  );
}

function SidebarNav({ openApp, setView, goPortal, entered, authUser }) {
  const [active, setActive] = useState(null);
  const [openGroup, setOpenGroup] = useState(null);
  const _buUser = BACKOFFICE_USERS.find(u => u.id === authUser?.id);
  const isSA = (_buUser?.systemRole || authUser?.systemRole) === "superadmin";
  const userApps = authUser?.apps || [];
  function go(appId, view) { openApp(appId); setView(view); setActive(view); }
  return (
    <div>
      <div style={{ fontSize:9.5, fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".12em", padding:"0 10px 8px", display:"flex", alignItems:"center", gap:8, opacity:entered?1:0, transition:"opacity .4s ease 100ms" }}>
        <div style={{ width:14, height:2, borderRadius:1, background:"linear-gradient(90deg,#2563eb,#7c3aed)" }}/>Raccourcis
      </div>
      {APPS.map((app, gi) => {
        const hasAccess = userApps.includes(app.id);
        return (
          <GooeyGroup key={app.id} app={app} shortcuts={app.shortcuts} openApp={id=>id} setView={v=>go(app.id,v)} activeView={active} isOpen={openGroup===app.id} onToggle={() => setOpenGroup(p => p===app.id?null:app.id)} startDelay={150+gi*60} entered={entered} disabled={!hasAccess}/>
        );
      })}
      {isSA && (<>
        <div style={{ display:"flex", alignItems:"center", gap:8, margin:"10px 4px 6px", opacity:entered?1:0, transition:"opacity .4s ease 400ms" }}>
          <div style={{ flex:1, height:1, background:"#e2e8f0" }}/>
          <span style={{ fontSize:9, fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".1em", whiteSpace:"nowrap" }}>Super Admin</span>
          <div style={{ flex:1, height:1, background:"#e2e8f0" }}/>
        </div>
        {COMMON_SA.map((s, i) => (
          <GooeyItem key={s.view} label={s.label} view={s.view} icon={s.icon} color="#64748b" delay={450+i*50} entered={entered} active={active===s.view} onClick={() => { setActive(s.view); s.portal?goPortal(s.view):go(s.appId,s.view); }}/>
        ))}
      </>)}
    </div>
  );
}

/* ── App Card ── */
function AppCard({ app, onOpen, floatY, isHovered, onHover, onLeave, disabled }) {
  const offsetX = app.id==="softdocs" ? -135 : app.id==="epaiement" ? 135 : 0;
  const offsetY = app.id==="softlibrary" ? 160 : app.id==="softsign" ? -160 : 0;
  return (
    <button onClick={() => !disabled && onOpen(app.id)} onMouseEnter={onHover} onMouseLeave={onLeave}
      style={{
        position:"absolute", left:"50%", top:"50%", width:178, height:178,
        transform:`translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY+floatY}px))`,
        borderRadius:24,
        background: isHovered&&!disabled ? `linear-gradient(145deg,${app.gradFrom},${app.gradTo})` : "rgba(255,255,255,.95)",
        border: isHovered&&!disabled ? "none" : `1.5px solid ${disabled?"#e8eef5":"#dde6f5"}`,
        cursor: disabled ? "not-allowed" : "pointer",
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10,
        transition:"all .4s cubic-bezier(.22,1,.36,1)",
        backdropFilter:"blur(20px)",
        boxShadow: isHovered&&!disabled
          ? `0 0 50px ${app.glow}, 0 20px 60px rgba(0,0,0,.18), inset 0 1px 0 rgba(255,255,255,.3)`
          : "0 4px 24px rgba(37,99,235,.08), 0 1px 4px rgba(0,0,0,.04), inset 0 1px 0 #fff",
        fontFamily:"inherit", padding:0,
        zIndex: isHovered ? 10 : 5,
        scale: isHovered&&!disabled ? "1.08" : "1",
        opacity: disabled ? .45 : 1,
      }}>
      {isHovered&&!disabled && <div style={{ position:"absolute", inset:-2, borderRadius:26, border:`1.5px solid ${app.color}50`, pointerEvents:"none", animation:"ring-pulse .8s ease-in-out infinite alternate" }}/>}
      <div style={{ width:"85%", height:56, display:"flex", alignItems:"center", justifyContent:"center", transform:isHovered&&!disabled?"scale(1.07)":"scale(1)", transition:"transform .35s ease" }}>
        <img src={app.logo} alt={app.name} style={{ maxWidth:"100%", maxHeight:52, objectFit:"contain", filter:isHovered&&!disabled?"drop-shadow(0 2px 12px rgba(255,255,255,.4)) brightness(1.1)":"drop-shadow(0 1px 4px rgba(0,0,0,.12))", transition:"filter .3s" }}/>
      </div>
      <div style={{ fontSize:10, color:isHovered&&!disabled?"rgba(255,255,255,.7)":"#94a3b8", textAlign:"center", padding:"0 10px", lineHeight:1.3, transition:"color .3s" }}>
        {disabled?"Accès non autorisé":app.tagline}
      </div>
      {isHovered&&!disabled && <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,.95)", background:"rgba(255,255,255,.18)", borderRadius:12, padding:"4px 12px", letterSpacing:".05em", animation:"fadeIn .2s ease" }}>OUVRIR →</div>}
    </button>
  );
}

const STATIC_SUITE_MODULES = [
  { id:"softdocs",      appId:"softdocs",    name:"SoftDocs",       sub:"GED & documents",        logo:"/softdocs-logo-final.png", color:"#2563eb", angle:-90 },
  { id:"softsign",      appId:"softsign",    name:"SoftSign",       sub:"Signature electronique", logo:"/softsign.png",            color:"#7c3aed", angle:-50 },
  { id:"epaiement",     appId:"epaiement",   name:"Soft e-Payment", sub:"Paiements bancaires",    logo:"/softepayment-logo.png",   color:"#d97706", angle:-10 },
  { id:"softlibrary",   appId:"softlibrary", name:"SoftLibrary",    sub:"Archives & courrier",     logo:"/softlibrary.png",         color:"#059669", angle:30 },
  { id:"softbudget",    appId:"softbudget",  name:"SoftBudget",     sub:"Budgets & engagements",   logo:"/softbudget-logo.svg",     color:"#0f766e", angle:70 },
  { id:"softrh",                              name:"SoftRH",         sub:"Ressources humaines",     icon:I.users,                    color:"#0891b2", angle:110 },
  { id:"softcompta",                          name:"SoftCompta",     sub:"Comptabilite",            icon:I.bank,                     color:"#ef4444", angle:150 },
  { id:"softreports",                         name:"SoftRapports",   sub:"Analytics",               icon:I.chart,                    color:"#7c3aed", angle:190 },
  { id:"softstock",                           name:"SoftStock",      sub:"Stocks & inventaires",    icon:I.tag,                      color:"#d97706", angle:230 },
];

function StaticSuiteMap({ userApps, onOpen }) {
  const [hovered, setHovered] = useState(null);
  const width = 860;
  const height = 720;
  const centerX = width / 2;
  const centerY = height / 2;
  const moduleRadius = 272;
  const modules = STATIC_SUITE_MODULES.map((module) => {
    const radians = module.angle * Math.PI / 180;
    return {
      ...module,
      x: centerX + Math.cos(radians) * moduleRadius,
      y: centerY + Math.sin(radians) * moduleRadius,
    };
  });
  return (
    <div style={{ position:"relative", width:"min(860px, calc(100vw - 350px), calc((100vh - 150px) * 1.194))", aspectRatio:`${width} / ${height}`, flexShrink:0 }}>
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:1 }}>
        {[350,260,125].map((radius)=>(
          <circle key={radius} cx={centerX} cy={centerY} r={radius}
            fill="none" stroke="rgba(37,99,235,.16)" strokeWidth="1.5" strokeDasharray="4 6"/>
        ))}
        {modules.map((module)=>(
          <line key={module.id} x1={centerX} y1={centerY} x2={module.x} y2={module.y}
            stroke="rgba(37,99,235,.16)" strokeWidth="1.5" strokeDasharray="4 6"/>
        ))}
      </svg>
      {modules.map((module)=>{
        const implemented = !!module.appId;
        const allowed = !implemented || userApps.includes(module.appId);
        const hoveredNow = hovered===module.id;
        return (
          <button key={module.id}
            onClick={()=>implemented&&allowed&&onOpen(module.appId)}
            onMouseEnter={()=>setHovered(module.id)}
            onMouseLeave={()=>setHovered(null)}
            title={implemented?(allowed?`Ouvrir ${module.name}`:`Acces non autorise a ${module.name}`):`${module.name} - module bientot disponible`}
            style={{ position:"absolute", left:`${module.x/width*100}%`, top:`${module.y/height*100}%`, transform:`translate(-50%,-50%) ${hoveredNow?"scale(1.07) translateY(-3px)":""}`, width:"clamp(106px,8.2vw,124px)", minHeight:"clamp(96px,8vw,110px)", padding:"12px 8px", borderRadius:17, border:`1px solid ${hoveredNow?module.color+"55":"#e6e9f0"}`, background:"#fff", boxShadow:hoveredNow?`0 12px 25px ${module.color}1f,0 3px 8px rgba(15,23,42,.07)`:"0 3px 10px rgba(15,23,42,.045)", cursor:implemented&&allowed?"pointer":"default", opacity:allowed?1:.48, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:7, transition:"transform .22s ease,box-shadow .22s ease,border-color .22s ease", fontFamily:"inherit", zIndex:3 }}>
            <span style={{ width:38, height:38, borderRadius:11, background:`${module.color}10`, color:module.color, display:"flex", alignItems:"center", justifyContent:"center" }}>
              {module.logo?<img src={module.logo} alt="" style={{ maxWidth:28, maxHeight:28, objectFit:"contain" }}/>:<span style={{ width:19, height:19, display:"flex" }}>{module.icon}</span>}
            </span>
            <span style={{ fontSize:11.5, fontWeight:850, color:"#172033" }}>{module.name}</span>
            <span style={{ fontSize:9, color:"#8b95a7", lineHeight:1.25 }}>{module.sub}</span>
          </button>
        );
      })}
      <div style={{ position:"absolute", left:"50%", top:"50%", transform:"translate(-50%,-50%)", width:"clamp(150px,12vw,172px)", height:"clamp(150px,12vw,172px)", borderRadius:"50%", background:"#fff", border:"2.5px solid #3159df", boxShadow:"0 4px 16px rgba(37,99,235,.08)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", zIndex:5 }}>
        <img src="/softappli-logo.png" alt="SoftAppli" style={{ width:74, height:74, objectFit:"contain" }}/>
        <div style={{ color:"#3159d6", fontSize:12.5, fontWeight:900, marginTop:2 }}>SoftAppli</div>
        <div style={{ color:"#94a3b8", fontSize:8.5 }}>Plateforme centrale</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ██  MAIN COMPONENT
   ══════════════════════════════════════════════════════════════ */
export default function AppLauncher() {
  const { setCurrentApp, setView, authUser } = useApp();
  const isMobile = useIsMobile();
  const [portalPage, setPortalPage] = useState(null);
  const [entered, setEntered] = useState(false);
  const [hov, setHov] = useState(null);

  useEffect(() => { setTimeout(() => setEntered(true), 80); }, []);

  const userApps = authUser?.apps || [];

  const openApp = useCallback((id) => {
    if (!userApps.includes(id)) {
      const msg = document.createElement("div");
      msg.textContent = "🔒 Accès refusé — vous n'avez pas les droits sur cette application";
      Object.assign(msg.style, { position:"fixed", top:"24px", left:"50%", transform:"translateX(-50%)", background:"#1e293b", color:"#fff", padding:"12px 24px", borderRadius:"10px", fontSize:"13px", fontWeight:"700", zIndex:"99999", boxShadow:"0 4px 20px rgba(0,0,0,.3)", fontFamily:"inherit" });
      document.body.appendChild(msg);
      setTimeout(() => msg.remove(), 2800);
      return;
    }
    setCurrentApp(id);
    setView(id==="softdocs"?"dashboard":id==="softlibrary"?"lib-dashboard":id==="softsign"?"ss-dashboard":id==="softbudget"?"budget-dashboard":"ep-dashboard");
  }, [authUser, userApps]);

  if (isMobile) {
    return <MobileLauncher authUser={authUser} userApps={userApps} openApp={openApp} setView={setView} portalPage={portalPage} setPortalPage={setPortalPage}/>;
  }

  const t = 0;

  return (
    <div style={{
      minHeight:"100vh",
      background:"#f2f5fb",
      display:"flex", flexDirection:"column",
      fontFamily:"'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
      overflow:"hidden", position:"relative",
    }}>

      {/* ── Background décor ── */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
        {/* Top accent line */}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg,#1e3a8a,#2563eb,#7c3aed,#06b6d4)" }}/>
      </div>

      {/* ── Header ── */}
      <header style={{
        position:"relative", zIndex:10,
        background:"rgba(255,255,255,.85)", backdropFilter:"blur(20px)",
        borderBottom:"1px solid #e2e8f0",
        padding:"0 40px", height:62,
        display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0,
        opacity:entered?1:0, transform:entered?"none":"translateY(-12px)", transition:"all .55s ease",
        boxShadow:"0 1px 8px rgba(37,99,235,.06)",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <img src="/softappli-logo.png" alt="SoftAppli" style={{ height:38, objectFit:"contain", filter:"drop-shadow(0 2px 8px rgba(37,99,235,.2))" }}/>
          <div style={{ width:1, height:28, background:"#e2e8f0" }}/>
          <div>
            <div style={{ fontSize:10, fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".12em" }}>Plateforme</div>
            <div style={{ fontSize:12.5, fontWeight:700, color:"#334155" }}>Multi-applicative</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:9, padding:"6px 14px 6px 8px", borderRadius:24, background:"#f1f5f9", border:"1px solid #e2e8f0" }}>
            <div style={{ width:30, height:30, borderRadius:"50%", background:"linear-gradient(135deg,#1e3a8a,#3b82f6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:"#fff", flexShrink:0 }}>{authUser?.init||authUser?.nom?.charAt(0)||"U"}</div>
            <div>
              <div style={{ fontSize:12.5, fontWeight:700, color:"#0f172a", lineHeight:1 }}>{authUser?.nom||"Utilisateur"}</div>
              <div style={{ fontSize:10.5, color:"#94a3b8", marginTop:1 }}>{authUser?.role}</div>
            </div>
          </div>
          <button onClick={() => { try { localStorage.removeItem("softdocs_auth"); localStorage.removeItem("softdocs_currentApp"); } catch {} window.location.href="/login"; }}
            style={{ padding:"7px 15px", borderRadius:20, border:"1px solid #e2e8f0", background:"#fff", color:"#64748b", fontSize:12.5, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:6, fontFamily:"inherit", transition:"all .15s", boxShadow:"0 1px 3px rgba(0,0,0,.05)" }}
            onMouseEnter={e => { e.currentTarget.style.background="#fef2f2"; e.currentTarget.style.borderColor="#fca5a5"; e.currentTarget.style.color="#dc2626"; }}
            onMouseLeave={e => { e.currentTarget.style.background="#fff"; e.currentTarget.style.borderColor="#e2e8f0"; e.currentTarget.style.color="#64748b"; }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Déconnexion
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <div style={{ flex:1, display:"flex", position:"relative", zIndex:5, minHeight:0 }}>

        {/* Sidebar */}
        <aside style={{
          width:300, flexShrink:0,
          background:"rgba(255,255,255,.75)", borderRight:"1px solid #e8eef5",
          backdropFilter:"blur(12px)",
          display:"flex", flexDirection:"column", padding:"28px 16px 20px",
          opacity:entered?1:0, transform:entered?"none":"translateX(-20px)",
          transition:"all .6s cubic-bezier(.22,1,.36,1) .1s", overflow:"visible",
        }}>
          <div style={{ marginBottom:22 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"4px 12px", borderRadius:20, background:"linear-gradient(135deg,#eff6ff,#f5f3ff)", border:"1px solid #bfdbfe", marginBottom:14 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:"#22c55e", animation:"pulse-dot 2s ease infinite", display:"block" }}/>
              <span style={{ fontSize:10, fontWeight:800, color:"#1d4ed8", textTransform:"uppercase", letterSpacing:".1em" }}>Système actif</span>
            </div>
            <h2 style={{ fontSize:21, fontWeight:900, color:"#0f172a", letterSpacing:"-.4px", marginBottom:5, lineHeight:1.2 }}>
              Bonjour,{" "}
              <span style={{ background:"linear-gradient(135deg,#1e3a8a,#7c3aed)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                {authUser?.nom?.split(" ")[0]||"Bienvenue"}
              </span>
            </h2>
            <p style={{ fontSize:12, color:"#64748b", lineHeight:1.5, margin:0 }}>Sélectionnez une application ci-dessous.</p>
          </div>
          <div style={{ flex:1, overflow:"visible" }}>
            <SidebarNav openApp={openApp} setView={setView} goPortal={setPortalPage} entered={entered} authUser={authUser}/>
          </div>
          <div style={{ marginTop:16, display:"flex", justifyContent:"center", flexShrink:0 }}>
            <img src={SOFTWELL_LOGO} alt="Softwell" style={{ height:28, objectFit:"contain", opacity:.6 }}/>
          </div>
        </aside>

        {/* ── Orbital main area ── */}
        <main style={{
          flex:1, display:"flex", alignItems:"center", justifyContent:"center",
          position:"relative", overflow:"hidden",
          opacity:entered?1:0, transition:"opacity .8s ease .2s",
        }}>
          <StaticSuiteMap userApps={userApps} onOpen={openApp}/>
          <div style={{ display:"none" }}>

            {/* Orbit rings — rAF rotation */}
            {[
              { r:268, speed:22,  dir:1,  colorRgb:"37,99,235"  },
              { r:292, speed:-30, dir:-1, colorRgb:"124,58,237" },
            ].map((ring, i) => (
              <div key={i} style={{
                position:"absolute", left:"50%", top:"50%",
                width:ring.r*2, height:ring.r*2, borderRadius:"50%",
                border:`1px dashed rgba(${ring.colorRgb},.15)`,
                transform:`translate(-50%,-50%) rotate(${t*ring.dir*(360/ring.speed)}deg)`,
              }}>
                {/* Glowing dot on ring */}
                <div style={{
                  position:"absolute", top:0, left:"50%",
                  width:7, height:7, borderRadius:"50%",
                  background:`rgba(${ring.colorRgb},1)`,
                  transform:"translate(-50%,-50%)",
                  boxShadow:`0 0 10px rgba(${ring.colorRgb},.7), 0 0 20px rgba(${ring.colorRgb},.3)`,
                }}/>
              </div>
            ))}

            {/* Static rings */}
            <div style={{ position:"absolute", left:"50%", top:"50%", width:620, height:620, borderRadius:"50%", border:"1px solid rgba(37,99,235,.05)", transform:"translate(-50%,-50%)" }}/>
            <div style={{ position:"absolute", left:"50%", top:"50%", width:155, height:155, borderRadius:"50%", border:"1px solid rgba(37,99,235,.07)", transform:"translate(-50%,-50%)" }}/>

            {/* SVG connector lines */}
            <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }} viewBox="0 0 660 660">
              {ORBIT_NODES.map((item, i) => {
                const speed = 0.10 + i * 0.008;
                const angle = (item.a + t * speed * 28) * Math.PI / 180;
                const nx = 330 + Math.cos(angle) * item.r;
                const ny = 330 + Math.sin(angle) * item.r;
                return (
                  <line key={i} x1={nx} y1={ny} x2={330} y2={330}
                    stroke={`rgba(${item.color},.08)`}
                    strokeWidth="1" strokeDasharray="4 8"/>
                );
              })}
            </svg>

            {/* Orbiting nodes — rAF positions */}
            {ORBIT_NODES.map((item, i) => {
              const speed = 0.10 + i * 0.008;
              const angle = (item.a + t * speed * 28) * Math.PI / 180;
              const x = Math.cos(angle) * item.r;
              const y = Math.sin(angle) * item.r;
              return (
                <div key={i} style={{
                  position:"absolute", left:"50%", top:"50%",
                  transform:`translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  display:"flex", flexDirection:"column", alignItems:"center", gap:3,
                  zIndex:4, transition:"none",
                }}>
                  <div style={{
                    width:44, height:44, borderRadius:12,
                    background:"rgba(255,255,255,.95)",
                    border:`1.5px solid rgba(${item.color},.18)`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:18, backdropFilter:"blur(8px)",
                    boxShadow:`0 4px 16px rgba(${item.color},.12), 0 1px 4px rgba(0,0,0,.06)`,
                  }}>{item.icon}</div>
                  <span style={{ fontSize:8.5, color:"#94a3b8", whiteSpace:"nowrap", fontWeight:600, letterSpacing:".03em", background:"rgba(255,255,255,.8)", padding:"1px 5px", borderRadius:5 }}>{item.label}</span>
                </div>
              );
            })}

            {/* App Cards */}
            {APPS.map((app, i) => (
              <AppCard key={app.id} app={app} onOpen={openApp}
                floatY={Math.sin(t * .85 + i * Math.PI) * 7}
                isHovered={hov===app.id}
                onHover={() => setHov(app.id)}
                onLeave={() => setHov(null)}
                disabled={!userApps.includes(app.id)}
              />
            ))}

            {/* ── Center SoftAppli logo — glow, PAS de rotation ── */}
            <div style={{
              position:"absolute", left:"50%", top:"50%",
              transform:"translate(-50%,-50%)",
              display:"flex", alignItems:"center", justifyContent:"center",
              zIndex:8,
            }}>
              {/* Glow rings */}
              <div style={{ position:"absolute", width:160, height:160, borderRadius:"50%", background:"radial-gradient(circle,rgba(37,99,235,.12),transparent 70%)", animation:"center-pulse 3.5s ease-in-out infinite" }}/>
              <div style={{ position:"absolute", width:110, height:110, borderRadius:"50%", background:"radial-gradient(circle,rgba(37,99,235,.18),transparent 65%)", animation:"center-pulse 3.5s ease-in-out .4s infinite" }}/>
              {/* White card */}
              <div style={{
                position:"relative",
                width:74, height:74, borderRadius:20,
                background:"#ffffff",
                border:"1.5px solid #dde6f5",
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:"0 0 0 6px rgba(37,99,235,.06), 0 0 0 12px rgba(37,99,235,.03), 0 8px 32px rgba(37,99,235,.18), 0 2px 8px rgba(0,0,0,.08)",
              }}>
                <img src="/softappli-logo.png" alt="SoftAppli" style={{ width:50, height:50, objectFit:"contain", filter:"drop-shadow(0 2px 6px rgba(37,99,235,.25))" }}/>
              </div>
              {/* Label */}
              <div style={{ position:"absolute", top:"115%", marginTop:4, fontSize:9.5, fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".1em", whiteSpace:"nowrap" }}>SoftAppli</div>
            </div>

          </div>
        </main>
      </div>

      {/* ── Footer ── */}
      <footer style={{
        position:"relative", zIndex:10,
        borderTop:"1px solid #e8eef5", background:"rgba(255,255,255,.85)", backdropFilter:"blur(12px)",
        padding:"11px 40px",
        display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0,
        opacity:entered?1:0, transition:"opacity .5s ease .5s",
      }}>
        <div style={{ display:"flex", gap:28 }}>
          {[["Applications","5 actives"],["Environnement","Production"],["Éditeur","SoftWell Madagascar"]].map(([k,v]) => (
            <div key={k} style={{ fontSize:11.5, display:"flex", gap:6 }}>
              <span style={{ color:"#94a3b8" }}>{k}</span>
              <span style={{ color:"#334155", fontWeight:700 }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ fontSize:11, color:"#cbd5e1" }}>© 2026 SoftWell — SoftAppli Suite</div>
      </footer>

      {/* Portal overlay */}
      {portalPage && (
        <div style={{ position:"fixed", inset:0, zIndex:2000, display:"flex", flexDirection:"column", background:"#f8fafc", fontFamily:"'Plus Jakarta Sans','DM Sans',system-ui,sans-serif" }}>
          <div style={{ display:"flex", alignItems:"center", gap:14, padding:"16px 28px", background:"#fff", borderBottom:"1px solid #e2e8f0", boxShadow:"0 1px 4px rgba(0,0,0,.06)", flexShrink:0 }}>
            <button onClick={() => setPortalPage(null)} style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"7px 14px", borderRadius:8, border:"1px solid #e2e8f0", background:"#fff", cursor:"pointer", fontSize:12.5, fontWeight:700, color:"#475569", fontFamily:"inherit" }}
              onMouseEnter={e=>e.currentTarget.style.background="#f1f5f9"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>Retour
            </button>
            <div style={{ width:1, height:24, background:"#e2e8f0" }}/>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:28, height:28, borderRadius:7, background:"linear-gradient(135deg,#1e3a8a,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:12, fontWeight:900 }}>
                {(PORTAL_META[portalPage]||PORTAL_META["portal-users"]).icon}
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:800, color:"#0f172a" }}>{(PORTAL_META[portalPage]||PORTAL_META["portal-users"]).title}</div>
                <div style={{ fontSize:11, color:"#64748b" }}>Administration — SoftApplication</div>
              </div>
            </div>
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:"28px 32px" }}>
            <PortalContent page={portalPage}/>
          </div>
        </div>
      )}

      <style>{`
        @keyframes orb1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-50px,40px) scale(1.06)}}
        @keyframes orb2{0%,100%{transform:translate(0,0)}50%{transform:translate(40px,-30px)}}
        @keyframes orb3{0%,100%{transform:translate(0,0)}50%{transform:translate(-25px,25px)}}
        @keyframes pulse-dot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(1.2)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
        @keyframes ring-pulse{from{opacity:.5;transform:scale(1)}to{opacity:1;transform:scale(1.04)}}
        @keyframes center-pulse{0%,100%{transform:scale(1);opacity:.7}50%{transform:scale(1.15);opacity:1}}
        *{-webkit-font-smoothing:antialiased}
      `}</style>
    </div>
  );
}
