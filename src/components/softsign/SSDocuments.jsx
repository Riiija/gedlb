"use client";
import { useState, useRef, useEffect } from "react";
import { SS_DOC_STATUS } from "./dataSS";

const ACCENT      = "#4a90d9";
const ACC2        = "#7c3aed";
const WH          = "#fff";
const BD          = "#e3e6ea";
const COLLAB_KEY  = "ss_collab_docs";

const lsGetCollab = () => { try { const v = localStorage.getItem(COLLAB_KEY); return v ? JSON.parse(v) : []; } catch { return []; } };

/* Combined type label map — covers internal SS types + collab doc types */
const TYPE_LABELS = {
  tous:"Tous", contrat:"Contrats", devis:"Devis", interne:"Internes", autre:"Autres",
  facture:"Factures", bon_commande:"Bons de commande", note_frais:"Notes de frais",
  rapport:"Rapports / PV", bordereau:"Bordereaux", courrier:"Courrier",
};

/* Map collab status to SS status space so filters work uniformly */
const COLLAB_STATUS_MAP = { depose:"en_attente", en_attente:"en_attente", signe:"signe", refuse:"rejete" };

/* Normalize a collab doc to look like an SS doc for display */
function normalizeCollab(c) {
  return {
    ...c,
    _collab:    true,
    _saveKey:   COLLAB_KEY,
    ref:        `COL-${c.id.slice(-6).toUpperCase()}`,
    title:      c.name,
    type:       c.type || "autre",
    status:     COLLAB_STATUS_MAP[c.status] || "en_attente",
    _origStatus:c.status,
    priority:   "normale",
    author:     c.uploadedByNom || c.uploadedBy || "Collaborateur",
    authorId:   c.uploadedBy || "",
    pages:      1,
    fileB64:    c.b64,
    signers:    [],
    signedBy:   [],
    comments:   "",
  };
}

/* Normalize an internal SS doc for SSSignatureViewer */
function normalizeForViewer(doc) {
  return {
    ...doc,
    name:          doc.title,
    b64:           doc.fileB64,
    uploadedBy:    doc.authorId || "",
    uploadedByNom: doc.author   || "",
    _saveKey:      "ss_docs",
  };
}

function FileUploadZone({ onFile }) {
  const ref = useRef();
  const [drag, setDrag] = useState(false);
  return (
    <div onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)}
      onDrop={e=>{e.preventDefault();setDrag(false);const f=e.dataTransfer.files[0];if(f)onFile(f);}}
      onClick={()=>ref.current.click()}
      style={{ border:`2px dashed ${drag?ACCENT:BD}`, borderRadius:10, padding:"32px 20px",
        textAlign:"center", cursor:"pointer", background:drag?"#eff6ff":"#f8fafc", transition:"all .2s" }}>
      <input ref={ref} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg" style={{display:"none"}}
        onChange={e=>{if(e.target.files[0])onFile(e.target.files[0]);}}/>
      <div style={{ fontSize:32, marginBottom:10 }}>📁</div>
      <div style={{ fontSize:13.5, fontWeight:700, color:"#334155" }}>Glissez un fichier ici</div>
      <div style={{ fontSize:12, color:"#64748b", marginTop:4 }}>ou cliquez pour parcourir (PDF, Word, Excel, Images)</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const s = SS_DOC_STATUS[status] || { label:status, color:"#64748b", bg:"#f1f5f9" };
  return <span style={{ fontSize:11, fontWeight:700, color:s.color, background:s.bg, padding:"3px 10px", borderRadius:20 }}>{s.label}</span>;
}

function PriorityBadge({ priority }) {
  const cfg = { haute:{c:"#dc2626",bg:"#fef2f2",l:"Haute"}, normale:{c:"#d97706",bg:"#fffbeb",l:"Normale"}, basse:{c:"#059669",bg:"#ecfdf5",l:"Basse"} };
  const s = cfg[priority] || cfg.normale;
  return <span style={{ fontSize:10, fontWeight:700, color:s.c, background:s.bg, padding:"2px 8px", borderRadius:20 }}>{s.l}</span>;
}

function DocRow({ doc, onOpen, onDelete, isAdmin }) {
  return (
    <tr style={{ borderBottom:`1px solid ${BD}`, cursor:"pointer" }}
      onMouseEnter={e=>e.currentTarget.style.background="#f8faff"}
      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
      <td onClick={()=>onOpen(doc)} style={{ padding:"10px 14px" }}>
        <div style={{ fontSize:12.5, fontWeight:600, color:"#1e293b" }}>{doc.ref}</div>
        <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:2 }}>
          <span style={{ fontSize:10.5, color:"#94a3b8" }}>{doc.type}</span>
          {doc._collab && (
            <span style={{ fontSize:10, fontWeight:700, color:ACC2, background:"#f5f3ff", padding:"1px 7px", borderRadius:20 }}>
              Collaborateur
            </span>
          )}
        </div>
      </td>
      <td onClick={()=>onOpen(doc)} style={{ padding:"10px 14px", maxWidth:240 }}>
        <div style={{ fontSize:12.5, color:"#334155", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{doc.title}</div>
        {doc.fileB64 && <span style={{ fontSize:10, color:ACCENT, fontWeight:600 }}>📎 Fichier joint</span>}
        {doc.password && <span style={{ fontSize:10, color:"#d97706", fontWeight:600, marginLeft:6 }}>🔒 Protégé</span>}
      </td>
      <td onClick={()=>onOpen(doc)} style={{ padding:"10px 14px" }}><StatusBadge status={doc.status}/></td>
      <td onClick={()=>onOpen(doc)} style={{ padding:"10px 14px" }}><PriorityBadge priority={doc.priority}/></td>
      <td onClick={()=>onOpen(doc)} style={{ padding:"10px 14px", fontSize:11.5, color:"#64748b" }}>{doc.author}</td>
      <td onClick={()=>onOpen(doc)} style={{ padding:"10px 14px", fontSize:11.5, color:"#64748b" }}>
        {doc.date ? new Date(doc.date).toLocaleDateString("fr-FR") : "—"}
      </td>
      <td style={{ padding:"10px 14px" }}>
        <div style={{ display:"flex", gap:6 }}>
          <button onClick={e=>{e.stopPropagation();onOpen(doc);}}
            style={{ padding:"4px 10px", borderRadius:6, border:`1px solid ${BD}`, background:WH, fontSize:11.5, cursor:"pointer", fontFamily:"inherit", color:ACC2, fontWeight:700 }}>
            ✍ Signer
          </button>
          {isAdmin && !doc._collab && (
            <button onClick={e=>{e.stopPropagation();onDelete(doc.id);}}
              style={{ padding:"4px 8px", borderRadius:6, border:"1px solid #fca5a5", background:"#fef2f2", fontSize:11.5, cursor:"pointer", color:"#dc2626", fontWeight:600, fontFamily:"inherit" }}>✕</button>
          )}
        </div>
      </td>
    </tr>
  );
}

export default function SSDocuments({ docs=[], setDocs, filterStatus, authUser, onSignDoc }) {
  const [search,     setSearch]     = useState("");
  const [typeF,      setTypeF]      = useState("tous");
  const [collabDocs, setCollabDocs] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [form,       setForm]       = useState({ title:"", type:"contrat", priority:"normale", comments:"", password:"", fileB64:null, fileName:"" });
  const isAdmin = authUser?.systemRole === "superadmin" || authUser?.systemRole === "admin";

  /* Load collab docs on mount */
  useEffect(() => { setCollabDocs(lsGetCollab().map(normalizeCollab)); }, []);

  /* Merge internal docs + collab docs, then apply filters */
  const all = [...docs, ...collabDocs];
  const filtered = all.filter(d => {
    if (filterStatus && d.status !== filterStatus) return false;
    if (typeF !== "tous" && d.type !== typeF) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!d.title?.toLowerCase().includes(q) && !d.ref?.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => setForm(f => ({ ...f, fileB64:e.target.result, fileName:file.name }));
    reader.readAsDataURL(file);
  };

  const addDoc = () => {
    if (!form.title.trim()) return;
    const now = new Date();
    const newDoc = {
      id:`SS-${Date.now()}`,
      ref:`SS-DOC-${now.getFullYear()}-${String(docs.length+1).padStart(3,"0")}`,
      title:form.title, type:form.type, status:"en_attente", priority:form.priority,
      date:now.toISOString().slice(0,10), author:authUser?.nom||"Utilisateur",
      authorId:authUser?.id||"U000", signers:[], signedBy:[],
      comments:form.comments, password:form.password||null, fileB64:form.fileB64||null, pages:1,
    };
    setDocs(p => [newDoc, ...p]);
    setForm({ title:"", type:"contrat", priority:"normale", comments:"", password:"", fileB64:null, fileName:"" });
    setShowUpload(false);
  };

  const deleteDoc = (id) => { if (confirm("Supprimer ce document ?")) setDocs(p => p.filter(d => d.id !== id)); };

  /* Open a doc → SSSignatureViewer via parent callback */
  const openDoc = (doc) => {
    if (!onSignDoc) return;
    if (doc._collab) {
      /* Collab doc: pass original format (has b64, name, uploadedBy…) */
      const original = lsGetCollab().find(c => c.id === doc.id) || doc;
      onSignDoc(original, COLLAB_KEY);
    } else {
      /* Internal doc: normalize to SSSignatureViewer format */
      onSignDoc(normalizeForViewer(doc), "ss_docs");
    }
  };

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans','DM Sans',system-ui,sans-serif" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
        <div>
          <h2 style={{ margin:0, fontSize:20, fontWeight:800, color:"#0f172a" }}>Documents</h2>
          <p style={{ margin:"3px 0 0", fontSize:12.5, color:"#64748b" }}>
            {filtered.length} document(s) — {collabDocs.length} collaborateur(s)
          </p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={() => setCollabDocs(lsGetCollab().map(normalizeCollab))}
            style={{ padding:"9px 14px", borderRadius:9, border:`1px solid ${BD}`, background:WH, fontSize:12.5, fontWeight:600, cursor:"pointer", fontFamily:"inherit", color:"#64748b" }}>
            ↻ Actualiser
          </button>
          <button onClick={() => setShowUpload(true)}
            style={{ padding:"9px 18px", borderRadius:9, border:"none", background:ACC2, color:WH, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
            + Nouveau document
          </button>
        </div>
      </div>

      {/* Filters */}
      {(() => {
        const usedTypes = [...new Set(all.map(d => d.type || "autre"))];
        const dynTypes = [
          { id:"tous", label:"Tous" },
          ...usedTypes.map(id => ({ id, label: TYPE_LABELS[id] || id })),
        ];
        return (
          <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Rechercher…"
              style={{ padding:"8px 14px", borderRadius:8, border:`1px solid ${BD}`, fontSize:13, outline:"none", background:"#f8fafc", minWidth:220, fontFamily:"inherit" }}/>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {dynTypes.map(t => (
                <button key={t.id} onClick={() => setTypeF(t.id)}
                  style={{ padding:"7px 14px", borderRadius:8, border:`1px solid ${typeF===t.id?ACCENT:BD}`,
                    background:typeF===t.id?"#eff6ff":WH, color:typeF===t.id?ACCENT:"#64748b",
                    fontSize:12.5, fontWeight:typeF===t.id?700:400, cursor:"pointer", fontFamily:"inherit" }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Upload modal */}
      {showUpload && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
          <div style={{ background:WH, borderRadius:12, width:"100%", maxWidth:520, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 20px 60px rgba(0,0,0,.2)" }}>
            <div style={{ padding:"16px 20px", borderBottom:`1px solid ${BD}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <h3 style={{ margin:0, fontSize:15, fontWeight:700, color:"#0f172a" }}>📤 Nouveau document</h3>
              <button onClick={()=>setShowUpload(false)} style={{ background:"none", border:"none", fontSize:18, cursor:"pointer", color:"#64748b" }}>✕</button>
            </div>
            <div style={{ padding:"20px" }}>
              <FileUploadZone onFile={handleFile}/>
              {form.fileName && <div style={{ marginTop:8, fontSize:12, color:ACCENT, fontWeight:600 }}>📎 {form.fileName}</div>}
              <div style={{ display:"grid", gap:12, marginTop:16 }}>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:"#334155", display:"block", marginBottom:4 }}>Titre *</label>
                  <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Titre du document"
                    style={{ width:"100%", padding:"9px 12px", borderRadius:7, border:`1px solid ${BD}`, fontSize:13, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}/>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  <div>
                    <label style={{ fontSize:12, fontWeight:600, color:"#334155", display:"block", marginBottom:4 }}>Type</label>
                    <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}
                      style={{ width:"100%", padding:"9px 12px", borderRadius:7, border:`1px solid ${BD}`, fontSize:13, fontFamily:"inherit", outline:"none" }}>
                      <option value="contrat">Contrat</option><option value="devis">Devis</option>
                      <option value="interne">Document interne</option><option value="autre">Autre</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize:12, fontWeight:600, color:"#334155", display:"block", marginBottom:4 }}>Priorité</label>
                    <select value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value}))}
                      style={{ width:"100%", padding:"9px 12px", borderRadius:7, border:`1px solid ${BD}`, fontSize:13, fontFamily:"inherit", outline:"none" }}>
                      <option value="basse">Basse</option><option value="normale">Normale</option><option value="haute">Haute</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:"#334155", display:"block", marginBottom:4 }}>Commentaires</label>
                  <textarea value={form.comments} onChange={e=>setForm(f=>({...f,comments:e.target.value}))} placeholder="Notes, contexte…"
                    style={{ width:"100%", padding:"9px 12px", borderRadius:7, border:`1px solid ${BD}`, fontSize:13, fontFamily:"inherit", outline:"none", resize:"vertical", minHeight:60, boxSizing:"border-box" }}/>
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:"#334155", display:"block", marginBottom:4 }}>🔒 Mot de passe (optionnel)</label>
                  <input type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} placeholder="Laisser vide si aucune protection"
                    style={{ width:"100%", padding:"9px 12px", borderRadius:7, border:`1px solid ${BD}`, fontSize:13, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}/>
                </div>
              </div>
            </div>
            <div style={{ padding:"12px 20px", borderTop:`1px solid ${BD}`, display:"flex", justifyContent:"flex-end", gap:10 }}>
              <button onClick={()=>setShowUpload(false)}
                style={{ padding:"9px 18px", borderRadius:7, border:`1px solid ${BD}`, background:WH, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Annuler</button>
              <button onClick={addDoc}
                style={{ padding:"9px 18px", borderRadius:7, border:"none", background:ACC2, color:WH, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ background:WH, border:`1px solid ${BD}`, borderRadius:10, overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#f8fafc" }}>
                {["Référence","Titre","Statut","Priorité","Auteur","Date","Actions"].map(h => (
                  <th key={h} style={{ padding:"10px 14px", fontSize:11, fontWeight:700, color:"#64748b", textAlign:"left", textTransform:"uppercase", letterSpacing:".06em", whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={7} style={{ padding:"32px", textAlign:"center", color:"#94a3b8", fontSize:14 }}>Aucun document trouvé</td></tr>
                : filtered.map(d => <DocRow key={d.id} doc={d} onOpen={openDoc} onDelete={deleteDoc} isAdmin={isAdmin}/>)
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
