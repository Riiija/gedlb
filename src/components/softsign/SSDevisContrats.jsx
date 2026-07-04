"use client";
import { useState } from "react";
import { SS_DEVIS_STATUS, SS_CONTRACT_STATUS } from "./dataSS";

const ACCENT = "#4a90d9";
const ACC2   = "#7c3aed";
const ACC3   = "#059669";
const WH     = "#fff";
const BD     = "#e3e6ea";

function StatusBadge({ status, map }) {
  const s = map[status] || { label:status, color:"#64748b", bg:"#f1f5f9" };
  return <span style={{ fontSize:11, fontWeight:700, color:s.color, background:s.bg, padding:"3px 10px", borderRadius:20 }}>{s.label}</span>;
}

function fmt(n) { return Number(n).toLocaleString("fr-FR") + " MGA"; }

/* ═══ DEVIS ═══ */
export function SSDevis({ devis=[], setDevis, authUser }) {
  const [form, setForm]       = useState({ fournisseur:"", contact:"", objet:"", montant:"", notes:"", fileB64:null, fileName:"" });
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch]    = useState("");

  const filtered = devis.filter(d =>
    !search || d.fournisseur.toLowerCase().includes(search.toLowerCase()) || d.objet.toLowerCase().includes(search.toLowerCase())
  );

  const handleFile = (e) => {
    const f = e.target.files[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => setForm(p => ({ ...p, fileB64:ev.target.result, fileName:f.name }));
    reader.readAsDataURL(f);
  };

  const addDevis = () => {
    if (!form.fournisseur.trim() || !form.objet.trim()) return;
    const now = new Date();
    setDevis(p => [{
      id:`DV-${Date.now()}`, ref:`DV-${now.getFullYear()}-${String(p.length+1).padStart(3,"0")}`,
      fournisseur:form.fournisseur, contact:form.contact, objet:form.objet,
      montant:Number(form.montant)||0, devise:"MGA", status:"en_validation",
      date:now.toISOString().slice(0,10), echeance:"", notes:form.notes, fileB64:form.fileB64||null,
    }, ...p]);
    setForm({ fournisseur:"", contact:"", objet:"", montant:"", notes:"", fileB64:null, fileName:"" });
    setShowForm(false);
  };

  const accept  = (id) => setDevis(p => p.map(d => d.id===id ? {...d, status:"accepte"} : d));
  const refuse  = (id) => { const r=prompt("Motif du refus:"); if(r) setDevis(p => p.map(d => d.id===id ? {...d, status:"refuse", notes:(d.notes||"")+"\nRefus: "+r} : d)); };
  const del     = (id) => { if(confirm("Supprimer ce devis ?")) setDevis(p => p.filter(d => d.id!==id)); };

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans','DM Sans',system-ui,sans-serif" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
        <div>
          <h2 style={{ margin:0, fontSize:20, fontWeight:800, color:"#0f172a" }}>Devis fournisseurs</h2>
          <p style={{ margin:"3px 0 0", fontSize:12.5, color:"#64748b" }}>{devis.length} devis au total</p>
        </div>
        <button onClick={() => setShowForm(true)}
          style={{ padding:"9px 18px", borderRadius:9, border:"none", background:ACCENT, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
          + Dépôt de devis
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:"flex", gap:12, marginBottom:18 }}>
        {[
          { label:"Total", val:devis.length, c:"#334155" },
          { label:"En validation", val:devis.filter(d=>d.status==="en_validation").length, c:"#2563eb" },
          { label:"Acceptés", val:devis.filter(d=>d.status==="accepte").length, c:ACC3 },
          { label:"Refusés", val:devis.filter(d=>d.status==="refuse").length, c:"#dc2626" },
        ].map(s => (
          <div key={s.label} style={{ background:WH, border:`1px solid ${BD}`, borderRadius:9, padding:"12px 16px", flex:1 }}>
            <div style={{ fontSize:22, fontWeight:800, color:s.c }}>{s.val}</div>
            <div style={{ fontSize:12, color:"#64748b", marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Rechercher un devis…"
        style={{ padding:"8px 14px", borderRadius:8, border:`1px solid ${BD}`, fontSize:13, outline:"none", background:"#f8fafc", minWidth:240, fontFamily:"inherit", marginBottom:14 }}/>

      <div style={{ background:WH, border:`1px solid ${BD}`, borderRadius:10, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#f8fafc" }}>
              {["Réf.","Fournisseur","Objet","Montant","Statut","Date","Actions"].map(h => (
                <th key={h} style={{ padding:"10px 14px", fontSize:11, fontWeight:700, color:"#64748b", textAlign:"left", textTransform:"uppercase", letterSpacing:".06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(d => (
              <tr key={d.id} style={{ borderBottom:`1px solid ${BD}` }}>
                <td style={{ padding:"10px 14px", fontSize:12.5, fontWeight:600, color:"#1e293b" }}>{d.ref}</td>
                <td style={{ padding:"10px 14px" }}>
                  <div style={{ fontSize:12.5, fontWeight:600, color:"#334155" }}>{d.fournisseur}</div>
                  {d.contact && <div style={{ fontSize:11, color:"#94a3b8" }}>{d.contact}</div>}
                </td>
                <td style={{ padding:"10px 14px", fontSize:12.5, color:"#334155" }}>{d.objet}</td>
                <td style={{ padding:"10px 14px", fontSize:12.5, fontWeight:700, color:"#0f172a" }}>{fmt(d.montant)}</td>
                <td style={{ padding:"10px 14px" }}><StatusBadge status={d.status} map={SS_DEVIS_STATUS}/></td>
                <td style={{ padding:"10px 14px", fontSize:11.5, color:"#64748b" }}>{d.date}</td>
                <td style={{ padding:"10px 14px" }}>
                  <div style={{ display:"flex", gap:5 }}>
                    {d.status==="en_validation" && <>
                      <button onClick={()=>accept(d.id)} style={{ padding:"4px 9px", borderRadius:6, border:"none", background:"#ecfdf5", color:"#059669", fontSize:11.5, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>✓ Accepter</button>
                      <button onClick={()=>refuse(d.id)} style={{ padding:"4px 9px", borderRadius:6, border:"none", background:"#fef2f2", color:"#dc2626", fontSize:11.5, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>✕ Refuser</button>
                    </>}
                    <button onClick={()=>del(d.id)} style={{ padding:"4px 7px", borderRadius:6, border:`1px solid ${BD}`, background:WH, color:"#94a3b8", fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>🗑</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length===0 && <tr><td colSpan={7} style={{ padding:"32px", textAlign:"center", color:"#94a3b8", fontSize:13 }}>Aucun devis</td></tr>}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
          <div style={{ background:WH, borderRadius:12, width:"100%", maxWidth:480, boxShadow:"0 20px 60px rgba(0,0,0,.2)", maxHeight:"90vh", overflowY:"auto" }}>
            <div style={{ padding:"16px 20px", borderBottom:`1px solid ${BD}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <h3 style={{ margin:0, fontSize:15, fontWeight:700 }}>📄 Déposer un devis</h3>
              <button onClick={()=>setShowForm(false)} style={{ background:"none", border:"none", fontSize:18, cursor:"pointer", color:"#64748b" }}>✕</button>
            </div>
            <div style={{ padding:"20px", display:"grid", gap:12 }}>
              {[["Fournisseur *","fournisseur","text"],["Contact","contact","email"],["Objet *","objet","text"],["Montant (MGA)","montant","number"]].map(([l,k,t]) => (
                <div key={k}>
                  <label style={{ fontSize:12, fontWeight:600, color:"#334155", display:"block", marginBottom:4 }}>{l}</label>
                  <input type={t} value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))}
                    style={{ width:"100%", padding:"9px 12px", borderRadius:7, border:`1px solid ${BD}`, fontSize:13, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}/>
                </div>
              ))}
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:"#334155", display:"block", marginBottom:4 }}>Fichier devis (PDF)</label>
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleFile}
                  style={{ fontSize:12, fontFamily:"inherit" }}/>
                {form.fileName && <div style={{ fontSize:11, color:ACCENT, marginTop:4 }}>📎 {form.fileName}</div>}
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:"#334155", display:"block", marginBottom:4 }}>Notes</label>
                <textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}
                  style={{ width:"100%", padding:"9px 12px", borderRadius:7, border:`1px solid ${BD}`, fontSize:13, fontFamily:"inherit", outline:"none", resize:"vertical", minHeight:60, boxSizing:"border-box" }}/>
              </div>
            </div>
            <div style={{ padding:"12px 20px", borderTop:`1px solid ${BD}`, display:"flex", justifyContent:"flex-end", gap:10 }}>
              <button onClick={()=>setShowForm(false)} style={{ padding:"9px 16px", borderRadius:7, border:`1px solid ${BD}`, background:WH, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Annuler</button>
              <button onClick={addDevis} style={{ padding:"9px 16px", borderRadius:7, border:"none", background:ACCENT, color:WH, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Soumettre</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══ CONTRATS ═══ */
export function SSContrats({ contrats=[], setContrats, authUser }) {
  const [search, setSearch]   = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]       = useState({ title:"", partenaire:"", contact:"", montant:"", dateDebut:"", dateFin:"", notes:"" });

  const filtered = contrats.filter(c =>
    !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.partenaire.toLowerCase().includes(search.toLowerCase())
  );

  const addContrat = () => {
    if (!form.title.trim() || !form.partenaire.trim()) return;
    const now = new Date();
    setContrats(p => [{
      id:`CT-${Date.now()}`, ref:`CT-${now.getFullYear()}-${String(p.length+1).padStart(3,"0")}`,
      title:form.title, partenaire:form.partenaire, contact:form.contact,
      montant:Number(form.montant)||0, devise:"MGA", status:"a_signer",
      dateDebut:form.dateDebut, dateFin:form.dateFin, signers:[], signedBy:[], notes:form.notes, fileB64:null,
    }, ...p]);
    setForm({ title:"", partenaire:"", contact:"", montant:"", dateDebut:"", dateFin:"", notes:"" });
    setShowForm(false);
  };

  const sign = (id) => { if(confirm("Signer ce contrat ?")) setContrats(p => p.map(c => c.id===id ? {...c,status:"actif"} : c)); };
  const del  = (id) => { if(confirm("Supprimer ce contrat ?")) setContrats(p => p.filter(c => c.id!==id)); };

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans','DM Sans',system-ui,sans-serif" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
        <div>
          <h2 style={{ margin:0, fontSize:20, fontWeight:800, color:"#0f172a" }}>Contrats</h2>
          <p style={{ margin:"3px 0 0", fontSize:12.5, color:"#64748b" }}>{contrats.length} contrat(s)</p>
        </div>
        <button onClick={() => setShowForm(true)}
          style={{ padding:"9px 18px", borderRadius:9, border:"none", background:ACC2, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
          + Nouveau contrat
        </button>
      </div>

      <div style={{ display:"flex", gap:12, marginBottom:18 }}>
        {["actif","a_signer","en_cours","expire"].map(s => {
          const st = SS_CONTRACT_STATUS[s];
          const n  = contrats.filter(c => c.status===s).length;
          return (
            <div key={s} style={{ background:WH, border:`1px solid ${BD}`, borderRadius:9, padding:"12px 16px", flex:1 }}>
              <div style={{ fontSize:22, fontWeight:800, color:st.color }}>{n}</div>
              <div style={{ fontSize:12, color:"#64748b", marginTop:2 }}>{st.label}</div>
            </div>
          );
        })}
      </div>

      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Rechercher un contrat…"
        style={{ padding:"8px 14px", borderRadius:8, border:`1px solid ${BD}`, fontSize:13, outline:"none", background:"#f8fafc", minWidth:240, fontFamily:"inherit", marginBottom:14 }}/>

      <div style={{ background:WH, border:`1px solid ${BD}`, borderRadius:10, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#f8fafc" }}>
              {["Réf.","Titre","Partenaire","Montant","Période","Statut","Actions"].map(h => (
                <th key={h} style={{ padding:"10px 14px", fontSize:11, fontWeight:700, color:"#64748b", textAlign:"left", textTransform:"uppercase", letterSpacing:".06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} style={{ borderBottom:`1px solid ${BD}` }}>
                <td style={{ padding:"10px 14px", fontSize:12.5, fontWeight:600, color:"#1e293b" }}>{c.ref}</td>
                <td style={{ padding:"10px 14px", fontSize:12.5, color:"#334155", maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.title}</td>
                <td style={{ padding:"10px 14px" }}>
                  <div style={{ fontSize:12.5, fontWeight:600, color:"#334155" }}>{c.partenaire}</div>
                  {c.contact && <div style={{ fontSize:11, color:"#94a3b8" }}>{c.contact}</div>}
                </td>
                <td style={{ padding:"10px 14px", fontSize:12.5, fontWeight:700, color:"#0f172a" }}>{fmt(c.montant)}</td>
                <td style={{ padding:"10px 14px", fontSize:11.5, color:"#64748b" }}>
                  {c.dateDebut && c.dateFin ? `${c.dateDebut} → ${c.dateFin}` : "—"}
                </td>
                <td style={{ padding:"10px 14px" }}><StatusBadge status={c.status} map={SS_CONTRACT_STATUS}/></td>
                <td style={{ padding:"10px 14px" }}>
                  <div style={{ display:"flex", gap:5 }}>
                    {c.status==="a_signer" && (
                      <button onClick={()=>sign(c.id)} style={{ padding:"4px 9px", borderRadius:6, border:"none", background:"#eff6ff", color:ACCENT, fontSize:11.5, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>✍️ Signer</button>
                    )}
                    <button onClick={()=>del(c.id)} style={{ padding:"4px 7px", borderRadius:6, border:`1px solid ${BD}`, background:WH, color:"#94a3b8", fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>🗑</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length===0 && <tr><td colSpan={7} style={{ padding:"32px", textAlign:"center", color:"#94a3b8", fontSize:13 }}>Aucun contrat</td></tr>}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
          <div style={{ background:WH, borderRadius:12, width:"100%", maxWidth:480, boxShadow:"0 20px 60px rgba(0,0,0,.2)", maxHeight:"90vh", overflowY:"auto" }}>
            <div style={{ padding:"16px 20px", borderBottom:`1px solid ${BD}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <h3 style={{ margin:0, fontSize:15, fontWeight:700 }}>📑 Nouveau contrat</h3>
              <button onClick={()=>setShowForm(false)} style={{ background:"none", border:"none", fontSize:18, cursor:"pointer", color:"#64748b" }}>✕</button>
            </div>
            <div style={{ padding:"20px", display:"grid", gap:12 }}>
              {[["Titre *","title","text"],["Partenaire *","partenaire","text"],["Contact","contact","email"],["Montant (MGA)","montant","number"],["Date début","dateDebut","date"],["Date fin","dateFin","date"]].map(([l,k,t]) => (
                <div key={k}>
                  <label style={{ fontSize:12, fontWeight:600, color:"#334155", display:"block", marginBottom:4 }}>{l}</label>
                  <input type={t} value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))}
                    style={{ width:"100%", padding:"9px 12px", borderRadius:7, border:`1px solid ${BD}`, fontSize:13, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}/>
                </div>
              ))}
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:"#334155", display:"block", marginBottom:4 }}>Notes</label>
                <textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}
                  style={{ width:"100%", padding:"9px 12px", borderRadius:7, border:`1px solid ${BD}`, fontSize:13, fontFamily:"inherit", outline:"none", resize:"vertical", minHeight:60, boxSizing:"border-box" }}/>
              </div>
            </div>
            <div style={{ padding:"12px 20px", borderTop:`1px solid ${BD}`, display:"flex", justifyContent:"flex-end", gap:10 }}>
              <button onClick={()=>setShowForm(false)} style={{ padding:"9px 16px", borderRadius:7, border:`1px solid ${BD}`, background:WH, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Annuler</button>
              <button onClick={addContrat} style={{ padding:"9px 16px", borderRadius:7, border:"none", background:ACC2, color:WH, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Créer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
