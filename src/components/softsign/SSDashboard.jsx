"use client";
import { useMemo } from "react";
import { SS_DOC_STATUS, SS_DEVIS_STATUS, SS_CONTRACT_STATUS } from "./dataSS";

const ACCENT = "#4a90d9";
const ACC2   = "#7c3aed";
const ACC3   = "#059669";
const BG     = "#f4f6f9";
const WH     = "#fff";
const BD     = "#e3e6ea";

function StatCard({ label, value, icon, color, bg, sub, onClick }) {
  return (
    <div onClick={onClick}
      style={{ background:WH, border:`1px solid ${BD}`, borderRadius:10, padding:"18px 20px",
        cursor:onClick?"pointer":"default", transition:"box-shadow .15s", flex:1, minWidth:160 }}
      onMouseEnter={e=>{ if(onClick) e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,.08)"; }}
      onMouseLeave={e=>{ e.currentTarget.style.boxShadow="none"; }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10 }}>
        <div style={{ width:38, height:38, borderRadius:9, background:bg||`${color}12`, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontSize:18 }}>{icon}</span>
        </div>
      </div>
      <div style={{ fontSize:28, fontWeight:800, color, letterSpacing:"-.5px", lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:12.5, color:"#64748b", marginTop:4, fontWeight:500 }}>{label}</div>
      {sub && <div style={{ fontSize:11, color:color, marginTop:3, fontWeight:600 }}>{sub}</div>}
    </div>
  );
}

function RecentRow({ doc, onOpen }) {
  const st = SS_DOC_STATUS[doc.status] || { label:doc.status, color:"#64748b", bg:"#f1f5f9" };
  return (
    <tr onClick={() => onOpen(doc)}
      style={{ cursor:"pointer", borderBottom:`1px solid ${BD}` }}
      onMouseEnter={e=>e.currentTarget.style.background="#f8faff"}
      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
      <td style={{ padding:"10px 14px", fontSize:12.5, fontWeight:600, color:"#1e293b" }}>{doc.ref}</td>
      <td style={{ padding:"10px 14px", fontSize:12.5, color:"#334155", maxWidth:220, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{doc.title}</td>
      <td style={{ padding:"10px 14px" }}>
        <span style={{ fontSize:11, fontWeight:700, color:st.color, background:st.bg, padding:"3px 10px", borderRadius:20 }}>{st.label}</span>
      </td>
      <td style={{ padding:"10px 14px", fontSize:11.5, color:"#64748b" }}>{doc.date}</td>
      <td style={{ padding:"10px 14px", fontSize:11.5, color:"#64748b" }}>{doc.author}</td>
    </tr>
  );
}

export default function SSDashboard({ docs=[], devis=[], contrats=[], notifications=[], setView, setSelDoc }) {
  const enValidation = docs.filter(d => d.status === "en_validation").length;
  const signes       = docs.filter(d => d.status === "signe").length;
  const aSignerDoc   = docs.filter(d => d.status === "en_attente").length;
  const rejetes      = docs.filter(d => d.status === "rejete").length;
  const devisEnCours = devis.filter(d => d.status === "en_validation").length;
  const contratsAct  = contrats.filter(c => c.status === "actif").length;
  const contratsSign = contrats.filter(c => c.status === "a_signer").length;
  const nonLues      = notifications.filter(n => !n.lu).length;
  const recents      = [...docs].sort((a,b) => b.date.localeCompare(a.date)).slice(0, 6);

  const openDoc = (doc) => { setSelDoc(doc); setView("ss-tous-docs"); };

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans','DM Sans',system-ui,sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontSize:22, fontWeight:800, color:"#0f172a", letterSpacing:"-.4px", margin:0 }}>Tableau de bord</h1>
        <p style={{ fontSize:13, color:"#64748b", margin:"4px 0 0" }}>Vue d'ensemble — SoftSign</p>
      </div>

      {/* Alert banner */}
      {(enValidation + aSignerDoc + contratsSign) > 0 && (
        <div style={{ background:"linear-gradient(135deg,#7c3aed18,#4a90d918)", border:"1px solid #7c3aed30",
          borderRadius:10, padding:"12px 16px", marginBottom:20, display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:20 }}>⚡</span>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:"#4c1d95" }}>Actions requises</div>
            <div style={{ fontSize:12, color:"#5b21b6" }}>
              {enValidation > 0 && `${enValidation} document(s) en validation`}
              {aSignerDoc > 0 && ` · ${aSignerDoc} en attente de signature`}
              {contratsSign > 0 && ` · ${contratsSign} contrat(s) à signer`}
            </div>
          </div>
          <button onClick={() => setView("ss-validation")}
            style={{ marginLeft:"auto", padding:"7px 14px", borderRadius:8, border:"1px solid #7c3aed40",
              background:"#7c3aed", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
            Voir →
          </button>
        </div>
      )}

      {/* Stats */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:14, marginBottom:24 }}>
        <StatCard label="En validation"     value={enValidation} icon="📋" color="#2563eb"  onClick={() => setView("ss-en-validation")}/>
        <StatCard label="Mes signatures"    value={aSignerDoc}   icon="✍️" color={ACC2}      onClick={() => setView("ss-signature")}/>
        <StatCard label="Documents signés"  value={signes}       icon="✅" color={ACC3}      onClick={() => setView("ss-signes")}/>
        <StatCard label="Devis en cours"    value={devisEnCours} icon="📄" color="#d97706"   onClick={() => setView("ss-devis-en-val")}/>
        <StatCard label="Contrats actifs"   value={contratsAct}  icon="📑" color={ACCENT}    onClick={() => setView("ss-contrats-actifs")}/>
        <StatCard label="Contrats à signer" value={contratsSign} icon="🔏" color="#ef4444"   onClick={() => setView("ss-contrats-signer")} sub={contratsSign > 0 ? "Action requise" : ""}/>
      </div>

      {/* Two columns */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:18 }}>
        {/* Documents récents */}
        <div style={{ background:WH, border:`1px solid ${BD}`, borderRadius:10, overflow:"hidden" }}>
          <div style={{ padding:"14px 18px", borderBottom:`1px solid ${BD}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <h3 style={{ margin:0, fontSize:14, fontWeight:700, color:"#0f172a" }}>📄 Documents récents</h3>
            <button onClick={() => setView("ss-tous-docs")}
              style={{ background:"none", border:"none", color:ACCENT, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
              Voir tout →
            </button>
          </div>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:"#f8fafc" }}>
                  {["Réf.","Titre","Statut","Date","Auteur"].map(h => (
                    <th key={h} style={{ padding:"8px 14px", fontSize:11, fontWeight:700, color:"#64748b", textAlign:"left", textTransform:"uppercase", letterSpacing:".06em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recents.length === 0
                  ? <tr><td colSpan={5} style={{ padding:"24px", textAlign:"center", color:"#94a3b8", fontSize:13 }}>Aucun document</td></tr>
                  : recents.map(d => <RecentRow key={d.id} doc={d} onOpen={openDoc}/>)
                }
              </tbody>
            </table>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {/* Notifications */}
          <div style={{ background:WH, border:`1px solid ${BD}`, borderRadius:10, overflow:"hidden" }}>
            <div style={{ padding:"12px 16px", borderBottom:`1px solid ${BD}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <h3 style={{ margin:0, fontSize:13.5, fontWeight:700, color:"#0f172a" }}>🔔 Notifications</h3>
              {nonLues > 0 && <span style={{ fontSize:11, fontWeight:700, color:"#fff", background:ACC2, padding:"2px 8px", borderRadius:10 }}>{nonLues}</span>}
            </div>
            <div>
              {notifications.slice(0, 4).map(n => (
                <div key={n.id} style={{ padding:"10px 14px", borderBottom:`1px solid ${BD}`, background:n.lu?"transparent":"#f5f3ff", display:"flex", gap:10, alignItems:"flex-start" }}>
                  <span style={{ fontSize:16, flexShrink:0, marginTop:1 }}>
                    {n.type==="validation"?"📋":n.type==="signature"?"✍️":n.type==="alerte"?"⚠️":"ℹ️"}
                  </span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, color:"#1e293b", lineHeight:1.4 }}>{n.message}</div>
                    <div style={{ fontSize:10.5, color:"#94a3b8", marginTop:2 }}>{new Date(n.date).toLocaleDateString("fr-FR")}</div>
                  </div>
                  {!n.lu && <div style={{ width:7, height:7, borderRadius:"50%", background:ACC2, flexShrink:0, marginTop:4 }}/>}
                </div>
              ))}
              {notifications.length === 0 && <div style={{ padding:"20px", textAlign:"center", color:"#94a3b8", fontSize:12 }}>Aucune notification</div>}
            </div>
          </div>

          {/* Quick actions */}
          <div style={{ background:WH, border:`1px solid ${BD}`, borderRadius:10, padding:"14px 16px" }}>
            <h3 style={{ margin:"0 0 12px", fontSize:13.5, fontWeight:700, color:"#0f172a" }}>⚡ Actions rapides</h3>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {[
                { label:"Nouveau document", view:"ss-upload",       color:"#2563eb", icon:"📤" },
                { label:"Nouveau devis",    view:"ss-devis-recus",  color:"#d97706", icon:"📄" },
                { label:"Nouveau contrat",  view:"ss-contrats",     color:ACCENT,    icon:"📑" },
                { label:"Valider",          view:"ss-validation",   color:ACC2,      icon:"✅" },
              ].map(a => (
                <button key={a.view} onClick={() => setView(a.view)}
                  style={{ padding:"10px 8px", borderRadius:8, border:`1px solid ${a.color}25`,
                    background:`${a.color}08`, cursor:"pointer", textAlign:"center", fontFamily:"inherit" }}>
                  <div style={{ fontSize:18, marginBottom:4 }}>{a.icon}</div>
                  <div style={{ fontSize:11, fontWeight:600, color:a.color }}>{a.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
