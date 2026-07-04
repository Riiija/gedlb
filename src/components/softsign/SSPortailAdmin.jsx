"use client";
import { useState, useEffect } from "react";

const ACCENT = "#4a90d9";
const ACC2   = "#7c3aed";
const ACC3   = "#059669";
const WH     = "#fff";
const BD     = "#e3e6ea";

const COLLAB_KEY = "ss_collab_docs";
const lsGetCollab = () => { try { const v = localStorage.getItem(COLLAB_KEY); return v ? JSON.parse(v) : []; } catch { return []; } };

const STATUS_LABELS = {
  depose:      { l:"Déposé",        c:"#64748b", bg:"#f1f5f9" },
  en_attente:  { l:"En attente",    c:"#d97706", bg:"#fffbeb" },
  signe:       { l:"Signé",         c:"#059669", bg:"#ecfdf5" },
  refuse:      { l:"Refusé",        c:"#dc2626", bg:"#fef2f2" },
};

/* ═══ PORTAIL FOURNISSEURS ═══ */
export function SSPortailFournisseurs({ fournisseurs=[], setFournisseurs, docs=[], devis=[], contrats=[], onSignDoc }) {
  const [search, setSearch]   = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]       = useState({ nom:"", secteur:"", contact:"", tel:"" });
  const [sel, setSel]         = useState(null);
  const [collabDocs, setCollabDocs] = useState([]);
  const [collabTab, setCollabTab]   = useState("all");

  useEffect(() => { setCollabDocs(lsGetCollab()); }, []);

  const filtered = fournisseurs.filter(f =>
    !search || f.nom.toLowerCase().includes(search.toLowerCase()) || f.secteur.toLowerCase().includes(search.toLowerCase())
  );

  const add = () => {
    if (!form.nom.trim()) return;
    setFournisseurs(p => [{
      id:`F-${Date.now()}`, nom:form.nom, secteur:form.secteur, contact:form.contact, tel:form.tel,
      statut:"actif", docs:0, devis:0, contrats:0, dateEntree:new Date().toISOString().slice(0,10),
    }, ...p]);
    setForm({ nom:"", secteur:"", contact:"", tel:"" });
    setShowForm(false);
  };

  const del = (id) => { if (confirm("Supprimer ce fournisseur ?")) setFournisseurs(p => p.filter(f => f.id!==id)); };
  const toggle = (id) => setFournisseurs(p => p.map(f => f.id===id ? {...f, statut:f.statut==="actif"?"inactif":"actif"} : f));

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans','DM Sans',system-ui,sans-serif" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
        <div>
          <h2 style={{ margin:0, fontSize:20, fontWeight:800, color:"#0f172a" }}>Portail Fournisseurs</h2>
          <p style={{ margin:"3px 0 0", fontSize:12.5, color:"#64748b" }}>{fournisseurs.filter(f=>f.statut==="actif").length} fournisseur(s) actif(s)</p>
        </div>
        <button onClick={()=>setShowForm(true)}
          style={{ padding:"9px 18px", borderRadius:9, border:"none", background:ACCENT, color:WH, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
          + Nouveau fournisseur
        </button>
      </div>

      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Rechercher un fournisseur…"
        style={{ padding:"8px 14px", borderRadius:8, border:`1px solid ${BD}`, fontSize:13, outline:"none", background:"#f8fafc", minWidth:240, fontFamily:"inherit", marginBottom:14 }}/>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:14 }}>
        {filtered.map(f => (
          <div key={f.id} style={{ background:WH, border:`1px solid ${BD}`, borderRadius:10, padding:"16px 18px" }}>
            <div style={{ display:"flex", alignItems:"flex-start", gap:12, marginBottom:12 }}>
              <div style={{ width:42, height:42, borderRadius:10, background:`${ACCENT}15`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>🏢</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:14, fontWeight:700, color:"#0f172a" }}>{f.nom}</div>
                <div style={{ fontSize:12, color:"#64748b" }}>{f.secteur}</div>
              </div>
              <span style={{ fontSize:10.5, fontWeight:700, color:f.statut==="actif"?ACC3:"#94a3b8", background:f.statut==="actif"?"#ecfdf5":"#f1f5f9", padding:"2px 8px", borderRadius:20 }}>
                {f.statut==="actif"?"Actif":"Inactif"}
              </span>
            </div>
            <div style={{ fontSize:12, color:"#64748b", marginBottom:4 }}>📧 {f.contact}</div>
            <div style={{ fontSize:12, color:"#64748b", marginBottom:12 }}>📞 {f.tel}</div>
            <div style={{ display:"flex", gap:10, padding:"10px 0", borderTop:`1px solid ${BD}`, borderBottom:`1px solid ${BD}`, marginBottom:12 }}>
              {[["📄",f.docs,"docs"],["📋",f.devis,"devis"],["📑",f.contrats,"contrats"]].map(([icon,val,label]) => (
                <div key={label} style={{ flex:1, textAlign:"center" }}>
                  <div style={{ fontSize:16, fontWeight:800, color:"#334155" }}>{icon} {val}</div>
                  <div style={{ fontSize:10.5, color:"#94a3b8" }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:6 }}>
              <button onClick={()=>toggle(f.id)}
                style={{ flex:1, padding:"6px", borderRadius:7, border:`1px solid ${BD}`, background:WH, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit", color:"#64748b" }}>
                {f.statut==="actif"?"Désactiver":"Activer"}
              </button>
              <button onClick={()=>del(f.id)}
                style={{ padding:"6px 10px", borderRadius:7, border:"1px solid #fca5a5", background:"#fef2f2", fontSize:12, cursor:"pointer", color:"#dc2626", fontFamily:"inherit" }}>🗑</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn:"1/-1", background:"#f8fafc", border:`2px dashed ${BD}`, borderRadius:10, padding:"40px", textAlign:"center", color:"#94a3b8" }}>
            <div style={{ fontSize:36, marginBottom:8 }}>🏢</div>
            <div style={{ fontSize:14, fontWeight:600 }}>Aucun fournisseur</div>
          </div>
        )}
      </div>

      {showForm && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
          <div style={{ background:WH, borderRadius:12, width:"100%", maxWidth:420, boxShadow:"0 20px 60px rgba(0,0,0,.2)" }}>
            <div style={{ padding:"16px 20px", borderBottom:`1px solid ${BD}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <h3 style={{ margin:0, fontSize:15, fontWeight:700 }}>🏢 Nouveau fournisseur</h3>
              <button onClick={()=>setShowForm(false)} style={{ background:"none", border:"none", fontSize:18, cursor:"pointer", color:"#64748b" }}>✕</button>
            </div>
            <div style={{ padding:"20px", display:"grid", gap:12 }}>
              {[["Nom *","nom","text"],["Secteur","secteur","text"],["Email contact","contact","email"],["Téléphone","tel","tel"]].map(([l,k,t]) => (
                <div key={k}>
                  <label style={{ fontSize:12, fontWeight:600, color:"#334155", display:"block", marginBottom:4 }}>{l}</label>
                  <input type={t} value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))}
                    style={{ width:"100%", padding:"9px 12px", borderRadius:7, border:`1px solid ${BD}`, fontSize:13, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}/>
                </div>
              ))}
            </div>
            <div style={{ padding:"12px 20px", borderTop:`1px solid ${BD}`, display:"flex", justifyContent:"flex-end", gap:10 }}>
              <button onClick={()=>setShowForm(false)} style={{ padding:"9px 16px", borderRadius:7, border:`1px solid ${BD}`, background:WH, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Annuler</button>
              <button onClick={add} style={{ padding:"9px 16px", borderRadius:7, border:"none", background:ACCENT, color:WH, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Ajouter</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Documents Collaborateurs à signer ─── */}
      <div style={{ marginTop:32 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
          <div>
            <h3 style={{ margin:0, fontSize:16, fontWeight:800, color:"#0f172a" }}>
              ✍️ Documents collaborateurs à signer
            </h3>
            <p style={{ margin:"3px 0 0", fontSize:12, color:"#64748b" }}>
              {collabDocs.length} document(s) déposé(s) par les collaborateurs externes
            </p>
          </div>
          <button onClick={() => setCollabDocs(lsGetCollab())}
            style={{ padding:"7px 14px", borderRadius:8, border:`1px solid ${BD}`, background:WH, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit", color:"#64748b" }}>
            ↻ Actualiser
          </button>
        </div>

        {/* Filter tabs */}
        <div style={{ display:"flex", gap:4, background:"#f1f5f9", borderRadius:9, padding:4, marginBottom:14, width:"fit-content" }}>
          {[["all","Tous"],["en_attente","En attente"],["signe","Signés"],["refuse","Refusés"]].map(([v,l]) => (
            <button key={v} onClick={()=>setCollabTab(v)}
              style={{ padding:"6px 14px", borderRadius:7, border:"none", background:collabTab===v?WH:"transparent",
                fontSize:12.5, fontWeight:collabTab===v?700:500, color:collabTab===v?"#0f172a":"#64748b",
                cursor:"pointer", fontFamily:"inherit", boxShadow:collabTab===v?"0 1px 4px rgba(0,0,0,.08)":"none", transition:"all .15s" }}>
              {l}
              {v!=="all"&&<span style={{ marginLeft:5, fontSize:11, fontWeight:700,
                color:v==="en_attente"?"#d97706":v==="signe"?"#059669":"#dc2626" }}>
                ({collabDocs.filter(d=>d.status===v).length})
              </span>}
            </button>
          ))}
        </div>

        {/* Docs table */}
        <div style={{ background:WH, border:`1px solid ${BD}`, borderRadius:10, overflow:"hidden" }}>
          {collabDocs.length === 0 ? (
            <div style={{ padding:"40px", textAlign:"center", color:"#94a3b8" }}>
              <div style={{ fontSize:36, marginBottom:8 }}>📂</div>
              <div style={{ fontSize:14, fontWeight:600 }}>Aucun document déposé par les collaborateurs</div>
              <div style={{ fontSize:12, marginTop:4 }}>Les documents déposés via l'espace collaborateur apparaîtront ici</div>
            </div>
          ) : (
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:"#f8fafc" }}>
                  {["Document","Déposé par","Date","Type","Statut","Actions"].map(h => (
                    <th key={h} style={{ padding:"9px 14px", fontSize:11, fontWeight:700, color:"#64748b",
                      textAlign:"left", textTransform:"uppercase", letterSpacing:".06em", whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {collabDocs.filter(d => collabTab==="all" || d.status===collabTab).map(doc => {
                  const st = STATUS_LABELS[doc.status] || STATUS_LABELS.depose;
                  const hasPass = !!doc.password;
                  return (
                    <tr key={doc.id} style={{ borderBottom:`1px solid ${BD}` }}>
                      <td style={{ padding:"10px 14px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <span style={{ fontSize:18 }}>📄</span>
                          <div>
                            <div style={{ fontSize:13, fontWeight:600, color:"#1e293b", maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                              {doc.name}
                            </div>
                            {hasPass && (
                              <div style={{ fontSize:11, color:"#d97706", display:"flex", alignItems:"center", gap:3, marginTop:1 }}>
                                🔒 <span>Protégé par mot de passe</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:"10px 14px" }}>
                        <div style={{ fontSize:12.5, color:"#1e293b", fontWeight:500 }}>{doc.uploadedByNom || "—"}</div>
                        <div style={{ fontSize:11, color:"#94a3b8" }}>{doc.uploadedBy || ""}</div>
                      </td>
                      <td style={{ padding:"10px 14px", fontSize:12, color:"#64748b", whiteSpace:"nowrap" }}>
                        {doc.date ? new Date(doc.date).toLocaleDateString("fr-FR") : "—"}
                      </td>
                      <td style={{ padding:"10px 14px" }}>
                        <span style={{ fontSize:11.5, color:"#475569", background:"#f1f5f9", padding:"2px 8px", borderRadius:20, fontWeight:500 }}>
                          {doc.type || "PDF"}
                        </span>
                      </td>
                      <td style={{ padding:"10px 14px" }}>
                        <span style={{ fontSize:11.5, fontWeight:700, color:st.c, background:st.bg, padding:"3px 10px", borderRadius:20 }}>
                          {st.l}
                        </span>
                      </td>
                      <td style={{ padding:"10px 14px" }}>
                        <div style={{ display:"flex", gap:6 }}>
                          {doc.status !== "signe" && onSignDoc && (
                            <button onClick={() => onSignDoc(doc)}
                              style={{ padding:"6px 12px", borderRadius:7, border:"none", background:ACC2, color:WH,
                                fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>
                              ✍️ Signer
                            </button>
                          )}
                          {doc.status === "signe" && (
                            <span style={{ fontSize:12, color:ACC3, fontWeight:600, padding:"6px 0" }}>✅ Signé</span>
                          )}
                          {doc.b64 && (
                            <a href={`data:application/pdf;base64,${doc.b64.replace(/^data:[^,]+,/,"")}`}
                              download={doc.name}
                              style={{ padding:"6px 12px", borderRadius:7, border:`1px solid ${BD}`, background:WH,
                                fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit", color:"#475569",
                                textDecoration:"none", display:"inline-flex", alignItems:"center", gap:4 }}>
                              ⬇ Télécharger
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══ RAPPORTS ═══ */
export function SSRapports({ docs=[], devis=[], contrats=[], workflows=[] }) {
  const stats = {
    totalDocs:      docs.length,
    signes:         docs.filter(d=>d.status==="signe").length,
    rejetes:        docs.filter(d=>d.status==="rejete").length,
    enValidation:   docs.filter(d=>d.status==="en_validation").length,
    totalDevis:     devis.length,
    devisAcceptes:  devis.filter(d=>d.status==="accepte").length,
    totalContrats:  contrats.length,
    contratsActifs: contrats.filter(c=>c.status==="actif").length,
  };

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans','DM Sans',system-ui,sans-serif" }}>
      <div style={{ marginBottom:20 }}>
        <h2 style={{ margin:0, fontSize:20, fontWeight:800, color:"#0f172a" }}>Rapports & Statistiques</h2>
        <p style={{ margin:"4px 0 0", fontSize:12.5, color:"#64748b" }}>Synthèse de l'activité SoftSign</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
        {[
          { l:"Total documents",  v:stats.totalDocs,    c:"#334155",  icon:"📄" },
          { l:"Signés",           v:stats.signes,       c:ACC3,       icon:"✅" },
          { l:"En validation",    v:stats.enValidation, c:"#2563eb",  icon:"📋" },
          { l:"Rejetés",          v:stats.rejetes,      c:"#dc2626",  icon:"✕" },
        ].map(s => (
          <div key={s.l} style={{ background:WH, border:`1px solid ${BD}`, borderRadius:10, padding:"16px 18px" }}>
            <div style={{ fontSize:24, marginBottom:4 }}>{s.icon}</div>
            <div style={{ fontSize:26, fontWeight:800, color:s.c }}>{s.v}</div>
            <div style={{ fontSize:12, color:"#64748b", marginTop:2 }}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
        {/* Devis stats */}
        <div style={{ background:WH, border:`1px solid ${BD}`, borderRadius:10, padding:"18px" }}>
          <h4 style={{ margin:"0 0 14px", fontSize:14, fontWeight:700, color:"#0f172a" }}>📄 Devis</h4>
          {[
            { l:"Total devis",    v:stats.totalDevis,   c:"#334155" },
            { l:"Acceptés",       v:stats.devisAcceptes, c:ACC3 },
            { l:"Refusés",        v:devis.filter(d=>d.status==="refuse").length, c:"#dc2626" },
            { l:"En validation",  v:devis.filter(d=>d.status==="en_validation").length, c:"#2563eb" },
          ].map(s => (
            <div key={s.l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:`1px solid ${BD}` }}>
              <span style={{ fontSize:13, color:"#475569" }}>{s.l}</span>
              <span style={{ fontSize:18, fontWeight:800, color:s.c }}>{s.v}</span>
            </div>
          ))}
        </div>

        {/* Contrats stats */}
        <div style={{ background:WH, border:`1px solid ${BD}`, borderRadius:10, padding:"18px" }}>
          <h4 style={{ margin:"0 0 14px", fontSize:14, fontWeight:700, color:"#0f172a" }}>📑 Contrats</h4>
          {[
            { l:"Total contrats",  v:stats.totalContrats,   c:"#334155" },
            { l:"Actifs",          v:stats.contratsActifs,   c:ACC3 },
            { l:"À signer",        v:contrats.filter(c=>c.status==="a_signer").length, c:"#2563eb" },
            { l:"Expirés",         v:contrats.filter(c=>c.status==="expire").length, c:"#dc2626" },
          ].map(s => (
            <div key={s.l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:`1px solid ${BD}` }}>
              <span style={{ fontSize:13, color:"#475569" }}>{s.l}</span>
              <span style={{ fontSize:18, fontWeight:800, color:s.c }}>{s.v}</span>
            </div>
          ))}
        </div>

        {/* Workflows */}
        <div style={{ background:WH, border:`1px solid ${BD}`, borderRadius:10, padding:"18px" }}>
          <h4 style={{ margin:"0 0 14px", fontSize:14, fontWeight:700, color:"#0f172a" }}>🔄 Workflows actifs</h4>
          {workflows.filter(w=>w.actif).map(wf => (
            <div key={wf.id} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${BD}` }}>
              <span style={{ fontSize:12.5, color:"#475569" }}>{wf.nom}</span>
              <span style={{ fontSize:12.5, fontWeight:700, color:ACCENT }}>{wf.nbUtilise}x</span>
            </div>
          ))}
          {workflows.filter(w=>w.actif).length===0 && <div style={{ color:"#94a3b8", fontSize:13, textAlign:"center", padding:16 }}>Aucun workflow actif</div>}
        </div>

        {/* Documents par type */}
        <div style={{ background:WH, border:`1px solid ${BD}`, borderRadius:10, padding:"18px" }}>
          <h4 style={{ margin:"0 0 14px", fontSize:14, fontWeight:700, color:"#0f172a" }}>📊 Documents par type</h4>
          {["contrat","devis","interne","autre"].map(type => {
            const n = docs.filter(d=>d.type===type).length;
            const pct = stats.totalDocs > 0 ? Math.round(n/stats.totalDocs*100) : 0;
            return (
              <div key={type} style={{ marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:12.5, color:"#475569", marginBottom:4 }}>
                  <span style={{ textTransform:"capitalize" }}>{type}</span>
                  <span style={{ fontWeight:700 }}>{n} ({pct}%)</span>
                </div>
                <div style={{ height:6, background:"#f1f5f9", borderRadius:3 }}>
                  <div style={{ height:"100%", borderRadius:3, background:type==="contrat"?ACC2:type==="devis"?"#d97706":type==="interne"?ACCENT:ACC3, width:`${pct}%`, transition:"width .5s ease" }}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop:18, background:WH, border:`1px solid ${BD}`, borderRadius:10, padding:"16px 18px", display:"flex", gap:12 }}>
        {[["📊 Excel","#059669"],["📄 PDF","#dc2626"]].map(([l,c]) => (
          <button key={l} onClick={()=>alert("Export "+l+" — Fonctionnalité à venir")}
            style={{ padding:"9px 18px", borderRadius:8, border:`1px solid ${BD}`, background:`${c}10`, color:c, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
            {l}
          </button>
        ))}
        <span style={{ fontSize:12, color:"#94a3b8", alignSelf:"center" }}>Export des données de rapport</span>
      </div>
    </div>
  );
}

/* ═══ ADMINISTRATION ═══ */
export function SSAdmin({ docs=[], fournisseurs=[], workflows=[], authUser }) {
  const [tab, setTab] = useState("users");
  const USERS = [
    { id:"U000", nom:"Administrateur Global", role:"Super Admin", init:"AG", email:"admin@softwell.mg", actif:true },
    { id:"U001", nom:"Rakoto Jean-Baptiste", role:"Chef de Projet", init:"RJ", email:"rakoto@softdocs.mg", actif:true },
    { id:"U002", nom:"Randria Marie-Claire", role:"Resp. Financier", init:"RM", email:"randria@softdocs.mg", actif:true },
    { id:"U003", nom:"Razafy Pierre", role:"DAF", init:"RP", email:"razafy@softdocs.mg", actif:true },
  ];
  const ROLES = [
    { nom:"Administrateur", permissions:["Tous les droits"], color:ACC2 },
    { nom:"Validateur", permissions:["Valider documents","Rejeter documents","Déléguer"], color:ACCENT },
    { nom:"Signataire", permissions:["Signer documents","Consulter documents"], color:ACC3 },
    { nom:"Utilisateur interne", permissions:["Créer documents","Soumettre devis","Consulter"], color:"#d97706" },
    { nom:"Fournisseur externe", permissions:["Déposer devis","Consulter statuts"], color:"#64748b" },
  ];

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans','DM Sans',system-ui,sans-serif" }}>
      <div style={{ marginBottom:20 }}>
        <h2 style={{ margin:0, fontSize:20, fontWeight:800, color:"#0f172a" }}>Administration</h2>
        <p style={{ margin:"4px 0 0", fontSize:12.5, color:"#64748b" }}>Paramétrage de la plateforme SoftSign</p>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:4, background:"#f1f5f9", borderRadius:10, padding:4, marginBottom:20, width:"fit-content" }}>
        {[["users","👥 Utilisateurs"],["roles","🔑 Rôles"],["param","⚙️ Paramètres"],["journal","📜 Journaux"]].map(([id,label]) => (
          <button key={id} onClick={()=>setTab(id)}
            style={{ padding:"8px 16px", borderRadius:8, border:"none", background:tab===id?WH:"transparent", fontSize:13, fontWeight:tab===id?700:500,
              color:tab===id?"#0f172a":"#64748b", cursor:"pointer", fontFamily:"inherit", boxShadow:tab===id?"0 1px 4px rgba(0,0,0,.08)":"none", transition:"all .15s" }}>
            {label}
          </button>
        ))}
      </div>

      {tab === "users" && (
        <div style={{ background:WH, border:`1px solid ${BD}`, borderRadius:10, overflow:"hidden" }}>
          <div style={{ padding:"12px 16px", borderBottom:`1px solid ${BD}`, fontSize:13.5, fontWeight:700, color:"#0f172a" }}>👥 Utilisateurs SoftSign</div>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr style={{ background:"#f8fafc" }}>
              {["Utilisateur","Email","Rôle","Statut"].map(h => (
                <th key={h} style={{ padding:"9px 14px", fontSize:11, fontWeight:700, color:"#64748b", textAlign:"left", textTransform:"uppercase", letterSpacing:".06em" }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {USERS.map(u => (
                <tr key={u.id} style={{ borderBottom:`1px solid ${BD}` }}>
                  <td style={{ padding:"10px 14px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:32, height:32, borderRadius:"50%", background:`${ACCENT}20`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:ACCENT }}>{u.init}</div>
                      <div><div style={{ fontSize:13, fontWeight:600, color:"#1e293b" }}>{u.nom}</div></div>
                    </div>
                  </td>
                  <td style={{ padding:"10px 14px", fontSize:12.5, color:"#64748b" }}>{u.email}</td>
                  <td style={{ padding:"10px 14px", fontSize:12.5, color:"#334155" }}>{u.role}</td>
                  <td style={{ padding:"10px 14px" }}>
                    <span style={{ fontSize:11, fontWeight:700, color:u.actif?ACC3:"#94a3b8", background:u.actif?"#ecfdf5":"#f1f5f9", padding:"3px 10px", borderRadius:20 }}>{u.actif?"Actif":"Inactif"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "roles" && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {ROLES.map(r => (
            <div key={r.nom} style={{ background:WH, border:`1px solid ${BD}`, borderRadius:10, padding:"14px 18px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                <span style={{ fontSize:13, fontWeight:700, color:r.color }}>{r.nom}</span>
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {r.permissions.map(p => (
                  <span key={p} style={{ fontSize:11.5, color:r.color, background:`${r.color}12`, padding:"3px 10px", borderRadius:20, fontWeight:500 }}>{p}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "param" && (
        <div style={{ display:"grid", gap:14 }}>
          {[
            { titre:"Paramètres signature", items:[["Algorithme de signature","SHA-256 + RSA-2048"],["OTP","Email + SMS (optionnel)"],["Durée de validité token","24 heures"],["Horodatage","Activé (RFC 3161)"]] },
            { titre:"Paramètres notifications", items:[["Email","Activé (SMTP SES)"],["SMS","Optionnel"],["Relances automatiques","Activé — tous les 2 jours"],["Alertes retard","Activé — J+3"]] },
          ].map(section => (
            <div key={section.titre} style={{ background:WH, border:`1px solid ${BD}`, borderRadius:10, overflow:"hidden" }}>
              <div style={{ padding:"12px 16px", borderBottom:`1px solid ${BD}`, fontSize:13.5, fontWeight:700, color:"#0f172a" }}>⚙️ {section.titre}</div>
              <div style={{ padding:"12px 0" }}>
                {section.items.map(([k,v]) => (
                  <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"8px 16px", borderBottom:`1px solid ${BD}` }}>
                    <span style={{ fontSize:13, color:"#475569" }}>{k}</span>
                    <span style={{ fontSize:13, fontWeight:700, color:"#0f172a" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "journal" && (
        <div style={{ background:WH, border:`1px solid ${BD}`, borderRadius:10, overflow:"hidden" }}>
          <div style={{ padding:"12px 16px", borderBottom:`1px solid ${BD}`, fontSize:13.5, fontWeight:700, color:"#0f172a" }}>📜 Journaux système</div>
          {[
            { ts:"2026-05-15 09:14:22", user:"Admin", action:"Connexion", ip:"192.168.1.10", ok:true },
            { ts:"2026-05-15 09:30:04", user:"Rakoto J.", action:"Signature SS-DOC-2026-001", ip:"192.168.1.22", ok:true },
            { ts:"2026-05-15 10:02:11", user:"Randria M.", action:"Validation devis DV-2026-001", ip:"192.168.1.18", ok:true },
            { ts:"2026-05-14 16:45:30", user:"Admin", action:"Suppression document SS-004", ip:"192.168.1.10", ok:false },
            { ts:"2026-05-14 14:20:00", user:"Razafy P.", action:"Création contrat CT-2026-003", ip:"192.168.1.5", ok:true },
          ].map((l,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 16px", borderBottom:`1px solid ${BD}`, background:l.ok?"transparent":"#fef9f9" }}>
              <span style={{ fontSize:14 }}>{l.ok?"✅":"⚠️"}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12.5, color:"#0f172a", fontWeight:500 }}>{l.user} — <b>{l.action}</b></div>
                <div style={{ fontSize:11, color:"#94a3b8", marginTop:1 }}>{l.ts} · IP: {l.ip}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══ NOTIFICATIONS ═══ */
export function SSNotifications({ notifications=[], setNotifications }) {
  const markAll = () => setNotifications(p => p.map(n => ({...n, lu:true})));
  const markOne = (id) => setNotifications(p => p.map(n => n.id===id ? {...n,lu:true} : n));
  const del     = (id) => setNotifications(p => p.filter(n => n.id!==id));
  const nonLues = notifications.filter(n=>!n.lu).length;

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans','DM Sans',system-ui,sans-serif" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <h2 style={{ margin:0, fontSize:20, fontWeight:800, color:"#0f172a" }}>Notifications</h2>
          <p style={{ margin:"4px 0 0", fontSize:12.5, color:"#64748b" }}>{nonLues} non lue(s)</p>
        </div>
        {nonLues > 0 && (
          <button onClick={markAll}
            style={{ padding:"8px 16px", borderRadius:8, border:`1px solid ${BD}`, background:WH, fontSize:12.5, fontWeight:600, cursor:"pointer", fontFamily:"inherit", color:"#64748b" }}>
            Tout marquer lu
          </button>
        )}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {notifications.map(n => (
          <div key={n.id} style={{ background:n.lu?WH:"#f5f3ff", border:`1px solid ${n.lu?BD:ACC2+"40"}`, borderRadius:10, padding:"14px 16px", display:"flex", gap:12, alignItems:"flex-start" }}>
            <span style={{ fontSize:20, flexShrink:0 }}>
              {n.type==="validation"?"📋":n.type==="signature"?"✍️":n.type==="alerte"?"⚠️":"ℹ️"}
            </span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:n.lu?400:600, color:"#1e293b" }}>{n.message}</div>
              <div style={{ fontSize:11.5, color:"#94a3b8", marginTop:3 }}>{new Date(n.date).toLocaleString("fr-FR")}</div>
            </div>
            <div style={{ display:"flex", gap:6, flexShrink:0 }}>
              {!n.lu && <button onClick={()=>markOne(n.id)} style={{ padding:"4px 8px", borderRadius:6, border:`1px solid ${BD}`, background:WH, fontSize:11.5, cursor:"pointer", fontFamily:"inherit", color:"#64748b" }}>✓ Lu</button>}
              <button onClick={()=>del(n.id)} style={{ padding:"4px 7px", borderRadius:6, border:"1px solid #fca5a5", background:"#fef2f2", fontSize:11.5, cursor:"pointer", color:"#dc2626", fontFamily:"inherit" }}>✕</button>
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
          <div style={{ background:"#f8fafc", border:`2px dashed ${BD}`, borderRadius:10, padding:"40px", textAlign:"center", color:"#94a3b8" }}>
            <div style={{ fontSize:36, marginBottom:8 }}>🔔</div>
            <div style={{ fontSize:14, fontWeight:600 }}>Aucune notification</div>
          </div>
        )}
      </div>
    </div>
  );
}
