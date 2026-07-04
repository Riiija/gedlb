"use client";
import { useState } from "react";
import { SS_DOC_STATUS } from "./dataSS";

const ACCENT = "#4a90d9";
const ACC2   = "#7c3aed";
const ACC3   = "#059669";
const WH     = "#fff";
const BD     = "#e3e6ea";

/* ═══ VALIDATION PARAPHEUR ═══ */
export function SSValidation({ docs=[], setDocs, authUser }) {
  const [selDoc, setSelDoc] = useState(null);
  const [comment, setComment] = useState("");

  const toValidate = docs.filter(d => d.status === "en_validation" || d.status === "en_attente");
  const approved   = docs.filter(d => d.status === "signe");
  const rejected   = docs.filter(d => d.status === "rejete");

  const approve = (doc) => {
    setDocs(p => p.map(d => d.id===doc.id ? {...d, status:"signe", comments:(d.comments||"")+(comment?"\nApprouvé: "+comment:"")} : d));
    setSelDoc(null); setComment("");
  };
  const reject = (doc) => {
    const reason = comment || prompt("Motif du rejet:");
    if (!reason) return;
    setDocs(p => p.map(d => d.id===doc.id ? {...d, status:"rejete", comments:(d.comments||"")+"\nRejeté: "+reason} : d));
    setSelDoc(null); setComment("");
  };

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans','DM Sans',system-ui,sans-serif" }}>
      <div style={{ marginBottom:20 }}>
        <h2 style={{ margin:0, fontSize:20, fontWeight:800, color:"#0f172a" }}>Parapheur — Validation</h2>
        <p style={{ margin:"4px 0 0", fontSize:12.5, color:"#64748b" }}>{toValidate.length} document(s) en attente de votre validation</p>
      </div>

      <div style={{ display:"flex", gap:12, marginBottom:20 }}>
        {[{l:"À valider",v:toValidate.length,c:"#d97706"},{l:"Approuvés",v:approved.length,c:ACC3},{l:"Rejetés",v:rejected.length,c:"#dc2626"}].map(s => (
          <div key={s.l} style={{ background:WH, border:`1px solid ${BD}`, borderRadius:9, padding:"14px 18px", flex:1 }}>
            <div style={{ fontSize:26, fontWeight:800, color:s.c }}>{s.v}</div>
            <div style={{ fontSize:12, color:"#64748b", marginTop:2 }}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 360px", gap:18 }}>
        {/* List */}
        <div style={{ background:WH, border:`1px solid ${BD}`, borderRadius:10, overflow:"hidden" }}>
          <div style={{ padding:"12px 16px", borderBottom:`1px solid ${BD}`, fontSize:13.5, fontWeight:700, color:"#0f172a" }}>📋 Documents à valider</div>
          {toValidate.length === 0
            ? <div style={{ padding:"40px", textAlign:"center", color:"#94a3b8", fontSize:14 }}>✅ Aucun document en attente</div>
            : toValidate.map(doc => {
              const st = SS_DOC_STATUS[doc.status];
              return (
                <div key={doc.id} onClick={() => { setSelDoc(doc); setComment(""); }}
                  style={{ padding:"14px 16px", borderBottom:`1px solid ${BD}`, cursor:"pointer",
                    background:selDoc?.id===doc.id?"#f5f3ff":"transparent" }}
                  onMouseEnter={e=>{ if(selDoc?.id!==doc.id) e.currentTarget.style.background="#f8fafc"; }}
                  onMouseLeave={e=>{ if(selDoc?.id!==doc.id) e.currentTarget.style.background="transparent"; }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12.5, fontWeight:700, color:"#1e293b" }}>{doc.ref}</div>
                      <div style={{ fontSize:12.5, color:"#334155", marginTop:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{doc.title}</div>
                      <div style={{ fontSize:11, color:"#94a3b8", marginTop:2 }}>{doc.author} · {doc.date}</div>
                    </div>
                    <span style={{ fontSize:11, fontWeight:700, color:st?.color, background:st?.bg, padding:"3px 10px", borderRadius:20, flexShrink:0, marginLeft:10 }}>{st?.label}</span>
                  </div>
                </div>
              );
            })
          }
        </div>

        {/* Action panel */}
        {selDoc ? (
          <div style={{ background:WH, border:`1px solid ${BD}`, borderRadius:10, padding:"18px" }}>
            <h4 style={{ margin:"0 0 14px", fontSize:13.5, fontWeight:700, color:"#0f172a" }}>Actions — {selDoc.ref}</h4>
            <div style={{ fontSize:13, color:"#334155", marginBottom:4 }}>{selDoc.title}</div>
            <div style={{ fontSize:11, color:"#64748b", marginBottom:16 }}>{selDoc.author} · {selDoc.date}</div>

            {selDoc.comments && (
              <div style={{ background:"#f8fafc", borderRadius:8, padding:"10px 12px", fontSize:12.5, color:"#334155", marginBottom:14 }}>
                💬 {selDoc.comments}
              </div>
            )}

            <div style={{ marginBottom:12 }}>
              <label style={{ fontSize:12, fontWeight:600, color:"#334155", display:"block", marginBottom:4 }}>Commentaire (optionnel)</label>
              <textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Ajouter un commentaire…"
                style={{ width:"100%", padding:"9px 12px", borderRadius:7, border:`1px solid ${BD}`, fontSize:13, fontFamily:"inherit", outline:"none", resize:"vertical", minHeight:70, boxSizing:"border-box" }}/>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <button onClick={() => approve(selDoc)}
                style={{ padding:"11px", borderRadius:8, border:"none", background:ACC3, color:WH, fontSize:13.5, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                ✅ Approuver le document
              </button>
              <button onClick={() => reject(selDoc)}
                style={{ padding:"11px", borderRadius:8, border:"1px solid #fca5a5", background:"#fef2f2", color:"#dc2626", fontSize:13.5, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                ✕ Rejeter
              </button>
              <button onClick={() => setSelDoc(null)}
                style={{ padding:"9px", borderRadius:8, border:`1px solid ${BD}`, background:WH, color:"#64748b", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
                Fermer
              </button>
            </div>
          </div>
        ) : (
          <div style={{ background:"#f8fafc", border:`2px dashed ${BD}`, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", minHeight:200 }}>
            <div style={{ textAlign:"center", color:"#94a3b8" }}>
              <div style={{ fontSize:36, marginBottom:8 }}>📋</div>
              <div style={{ fontSize:13 }}>Sélectionnez un document à valider</div>
            </div>
          </div>
        )}
      </div>

      {/* Historique */}
      {(approved.length > 0 || rejected.length > 0) && (
        <div style={{ marginTop:20, background:WH, border:`1px solid ${BD}`, borderRadius:10, overflow:"hidden" }}>
          <div style={{ padding:"12px 16px", borderBottom:`1px solid ${BD}`, fontSize:13.5, fontWeight:700, color:"#0f172a" }}>📜 Historique des validations</div>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#f8fafc" }}>
                {["Référence","Titre","Décision","Auteur","Date"].map(h => (
                  <th key={h} style={{ padding:"8px 14px", fontSize:11, fontWeight:700, color:"#64748b", textAlign:"left", textTransform:"uppercase", letterSpacing:".06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...approved, ...rejected].map(doc => {
                const st = SS_DOC_STATUS[doc.status];
                return (
                  <tr key={doc.id} style={{ borderBottom:`1px solid ${BD}` }}>
                    <td style={{ padding:"9px 14px", fontSize:12.5, fontWeight:600, color:"#1e293b" }}>{doc.ref}</td>
                    <td style={{ padding:"9px 14px", fontSize:12.5, color:"#334155" }}>{doc.title}</td>
                    <td style={{ padding:"9px 14px" }}><span style={{ fontSize:11, fontWeight:700, color:st?.color, background:st?.bg, padding:"3px 10px", borderRadius:20 }}>{st?.label}</span></td>
                    <td style={{ padding:"9px 14px", fontSize:11.5, color:"#64748b" }}>{doc.author}</td>
                    <td style={{ padding:"9px 14px", fontSize:11.5, color:"#64748b" }}>{doc.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ═══ WORKFLOW ═══ */
export function SSWorkflow({ workflows=[], setWorkflows }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState({ nom:"", type:"devis", dureeMax:5 });
  const [editEtapes, setEditEtapes] = useState(null);

  const addWF = () => {
    if (!form.nom.trim()) return;
    setWorkflows(p => [{
      id:`WF-${Date.now()}`, nom:form.nom, type:form.type,
      etapes:["Étape 1","Étape 2","Approbation finale"], dureeMax:Number(form.dureeMax)||5, actif:true, nbUtilise:0,
    }, ...p]);
    setForm({ nom:"", type:"devis", dureeMax:5 });
    setShowForm(false);
  };

  const toggle = (id) => setWorkflows(p => p.map(w => w.id===id ? {...w,actif:!w.actif} : w));
  const del    = (id) => { if(confirm("Supprimer ce workflow ?")) setWorkflows(p => p.filter(w => w.id!==id)); };

  const TYPE_COLORS = { devis:"#d97706", contrat:ACC2, interne:ACCENT };

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans','DM Sans',system-ui,sans-serif" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <h2 style={{ margin:0, fontSize:20, fontWeight:800, color:"#0f172a" }}>Workflows</h2>
          <p style={{ margin:"3px 0 0", fontSize:12.5, color:"#64748b" }}>Gestion des circuits de validation</p>
        </div>
        <button onClick={() => setShowForm(true)}
          style={{ padding:"9px 18px", borderRadius:9, border:"none", background:ACCENT, color:WH, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
          + Nouveau workflow
        </button>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {workflows.map(wf => (
          <div key={wf.id} style={{ background:WH, border:`1px solid ${BD}`, borderRadius:10, overflow:"hidden" }}>
            <div style={{ padding:"14px 18px", display:"flex", alignItems:"center", gap:14, borderBottom:`1px solid ${BD}` }}>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:14, fontWeight:700, color:"#0f172a" }}>{wf.nom}</span>
                  <span style={{ fontSize:11, fontWeight:700, color:TYPE_COLORS[wf.type]||"#64748b", background:`${TYPE_COLORS[wf.type]||"#64748b"}15`, padding:"2px 9px", borderRadius:20 }}>{wf.type}</span>
                  <span style={{ fontSize:11, fontWeight:700, color:wf.actif?ACC3:"#94a3b8", background:wf.actif?"#ecfdf5":"#f1f5f9", padding:"2px 9px", borderRadius:20 }}>{wf.actif?"Actif":"Inactif"}</span>
                </div>
                <div style={{ fontSize:12, color:"#64748b", marginTop:2 }}>Délai max: {wf.dureeMax}j · Utilisé {wf.nbUtilise} fois</div>
              </div>
              <div style={{ display:"flex", gap:6 }}>
                <button onClick={() => toggle(wf.id)}
                  style={{ padding:"6px 12px", borderRadius:7, border:`1px solid ${BD}`, background:WH, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit", color:wf.actif?"#d97706":ACC3 }}>
                  {wf.actif?"Désactiver":"Activer"}
                </button>
                <button onClick={() => del(wf.id)}
                  style={{ padding:"6px 10px", borderRadius:7, border:"1px solid #fca5a5", background:"#fef2f2", fontSize:12, cursor:"pointer", color:"#dc2626", fontFamily:"inherit" }}>🗑</button>
              </div>
            </div>
            <div style={{ padding:"12px 18px", display:"flex", alignItems:"center", gap:0, overflowX:"auto" }}>
              {wf.etapes.map((e,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", flexShrink:0 }}>
                  <div style={{ padding:"5px 12px", borderRadius:20, background:`${ACCENT}15`, border:`1px solid ${ACCENT}30`, fontSize:11.5, fontWeight:600, color:ACCENT, whiteSpace:"nowrap" }}>
                    {i+1}. {e}
                  </div>
                  {i < wf.etapes.length-1 && <div style={{ margin:"0 6px", color:"#cbd5e1", fontSize:16 }}>→</div>}
                </div>
              ))}
            </div>
          </div>
        ))}
        {workflows.length === 0 && (
          <div style={{ background:"#f8fafc", border:`2px dashed ${BD}`, borderRadius:10, padding:"40px", textAlign:"center", color:"#94a3b8" }}>
            <div style={{ fontSize:36, marginBottom:8 }}>🔄</div>
            <div style={{ fontSize:14, fontWeight:600 }}>Aucun workflow défini</div>
          </div>
        )}
      </div>

      {showForm && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
          <div style={{ background:WH, borderRadius:12, width:"100%", maxWidth:420, boxShadow:"0 20px 60px rgba(0,0,0,.2)" }}>
            <div style={{ padding:"16px 20px", borderBottom:`1px solid ${BD}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <h3 style={{ margin:0, fontSize:15, fontWeight:700 }}>🔄 Nouveau workflow</h3>
              <button onClick={()=>setShowForm(false)} style={{ background:"none", border:"none", fontSize:18, cursor:"pointer", color:"#64748b" }}>✕</button>
            </div>
            <div style={{ padding:"20px", display:"grid", gap:12 }}>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:"#334155", display:"block", marginBottom:4 }}>Nom *</label>
                <input value={form.nom} onChange={e=>setForm(p=>({...p,nom:e.target.value}))}
                  style={{ width:"100%", padding:"9px 12px", borderRadius:7, border:`1px solid ${BD}`, fontSize:13, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}/>
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:"#334155", display:"block", marginBottom:4 }}>Type</label>
                <select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))}
                  style={{ width:"100%", padding:"9px 12px", borderRadius:7, border:`1px solid ${BD}`, fontSize:13, fontFamily:"inherit", outline:"none" }}>
                  <option value="devis">Devis</option><option value="contrat">Contrat</option>
                  <option value="interne">Document interne</option><option value="autre">Autre</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:"#334155", display:"block", marginBottom:4 }}>Délai max (jours)</label>
                <input type="number" value={form.dureeMax} onChange={e=>setForm(p=>({...p,dureeMax:e.target.value}))} min={1}
                  style={{ width:"100%", padding:"9px 12px", borderRadius:7, border:`1px solid ${BD}`, fontSize:13, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}/>
              </div>
            </div>
            <div style={{ padding:"12px 20px", borderTop:`1px solid ${BD}`, display:"flex", justifyContent:"flex-end", gap:10 }}>
              <button onClick={()=>setShowForm(false)} style={{ padding:"9px 16px", borderRadius:7, border:`1px solid ${BD}`, background:WH, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Annuler</button>
              <button onClick={addWF} style={{ padding:"9px 16px", borderRadius:7, border:"none", background:ACCENT, color:WH, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Créer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
