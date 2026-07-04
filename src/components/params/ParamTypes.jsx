"use client";
import { useState, useRef } from "react";
import { Modal } from "../ui/Modal";
import { IC } from "../ui/Icons";
import { Avatar } from "../ui/Badge";
import { ExportButtons } from "../ui/ExportButtons";
import { card, btn, inp, lbl, bdg, BD, P, MUT, SUCL, SUCD, RSm, TR } from "../../lib/theme";
import { useApp } from "../../context/AppContext";
import { PROJETS, ALL_SITES } from "../../lib/data";
import { gid } from "../../lib/utils";


/* ── Phase (super-étape) options ── */
const PHASES = [
  { id:"depot",      label:"Dépôt",                icon:"📥", color:"#6c757d" },
  { id:"reception",  label:"Réception",             icon:"📬", color:"#0891b2" },
  { id:"validation", label:"En cours de validation",icon:"⏳", color:"#d97706" },
  { id:"valide",     label:"Validé / Bon à payer",  icon:"✅", color:"#16a34a" },
];

/* ── Validators multi-check dropdown ── */
function ValidDropdown({ users, selected, onToggle }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const count = selected?.length || 0;
  return (
    <div ref={ref} style={{ position:"relative" }}>
      <button type="button" onClick={()=>setOpen(p=>!p)}
        style={{
          display:"inline-flex", alignItems:"center", gap:7,
          padding:"6px 12px", borderRadius:6,
          border:`1px solid ${BD}`, background:"#fff",
          cursor:"pointer", fontFamily:"inherit", fontSize:12.5,
          color:count>0?"#212529":"#6c757d", fontWeight:600,
          minWidth:180, justifyContent:"space-between",
        }}>
        <span style={{display:"flex",alignItems:"center",gap:5}}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          {count>0?`${count} valideur${count>1?"s":""}  sélectionné${count>1?"s":""}` : "Sélectionner les validateurs"}
        </span>
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
          style={{transition:"transform .2s",transform:open?"rotate(180deg)":"rotate(0deg)",flexShrink:0}}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open&&(
        <>
          <div style={{position:"fixed",inset:0,zIndex:998}} onMouseDown={()=>setOpen(false)}/>
          <div style={{
            position:"absolute",left:0,top:38,zIndex:999,
            background:"#fff",border:`1px solid ${BD}`,borderRadius:8,
            boxShadow:"0 8px 24px rgba(0,0,0,.13)",
            minWidth:240,maxHeight:260,overflowY:"auto",
          }}>
            {users.map(u=>{
              const checked=selected?.includes(u.id)||false;
              return(
                <label key={u.id} onMouseDown={e=>{e.preventDefault();onToggle(u.id);}}
                  style={{
                    display:"flex",alignItems:"center",gap:10,
                    padding:"8px 12px",cursor:"pointer",
                    background:checked?"#eef1f8":"transparent",
                    borderBottom:`1px solid #f0f2f5`,
                    userSelect:"none",
                  }}>
                  <div style={{
                    width:16,height:16,borderRadius:4,flexShrink:0,
                    border:`2px solid ${checked?"#324372":BD}`,
                    background:checked?"#324372":"#fff",
                    display:"flex",alignItems:"center",justifyContent:"center",
                  }}>
                    {checked&&<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                  <span style={{
                    width:24,height:24,borderRadius:"50%",background:"#324372",
                    color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:9,fontWeight:800,flexShrink:0,
                  }}>{u.init||u.nom?.slice(0,2).toUpperCase()}</span>
                  <div>
                    <div style={{fontSize:12.5,fontWeight:600,color:"#212529"}}>{u.nom}</div>
                    <div style={{fontSize:10.5,color:"#6c757d"}}>{u.role}</div>
                  </div>
                </label>
              );
            })}
          </div>
        </>
      )}
      {/* Selected chips */}
      {count>0&&(
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:6}}>
          {(selected||[]).map(uid=>{
            const u=users.find(x=>x.id===uid);
            if(!u)return null;
            return(
              <span key={uid} style={{
                display:"inline-flex",alignItems:"center",gap:4,
                padding:"2px 8px 2px 6px",borderRadius:20,
                background:"#eef1f8",border:`1px solid #c9d3ea`,
                fontSize:11,fontWeight:600,color:"#324372",
              }}>
                <span style={{width:16,height:16,borderRadius:"50%",background:"#324372",color:"#fff",
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:800}}>
                  {u.init||u.nom?.slice(0,2).toUpperCase()}
                </span>
                {u.nom.split(" ")[0]}
                <span onMouseDown={e=>{e.preventDefault();onToggle(uid);}}
                  style={{cursor:"pointer",color:"#6c757d",marginLeft:1,lineHeight:1,fontWeight:700,fontSize:13}}>×</span>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Single step row ── */
function StepRow({ e, i, users, onLabel, onDuree, onPhase, onToggleV, onChecklist, onRemove, onToggleRequireSign }) {
  const phase = PHASES.find(p=>p.id===e.phase)||null;
  return (
    <div style={{ border:`1px solid ${BD}`, borderRadius:RSm, padding:14, marginBottom:8, background:"#fafbfc" }}>
      {/* Row 1: label + duree + checklist + delete */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 120px auto auto", gap:8, marginBottom:8, alignItems:"center" }}>
        <input value={e.label} onChange={onLabel}
          style={{...inp({padding:"7px 10px",fontSize:13})}} placeholder="Nom de l'étape"/>
        <div style={{position:"relative"}}>
          <input type="number" value={e.duree||""} onChange={onDuree}
            style={{...inp({padding:"7px 10px",fontSize:13,paddingRight:30})}} placeholder="24" min="1"/>
          <span style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",fontSize:10,color:MUT,pointerEvents:"none"}}>h</span>
        </div>
        <button type="button" onClick={onChecklist} style={{...btn("light",true),whiteSpace:"nowrap"}}>
          <span style={{display:"flex"}}>{IC.chk}</span>
          Checklists {e.checklists?.length>0&&`(${e.checklists.length})`}
        </button>
        <button type="button" onClick={onRemove} style={btn("danger",true)}>
          <span style={{display:"flex"}}>{IC.trash}</span>
        </button>
      </div>

      {/* Row 2: Phase (super-étape) */}
      <div style={{marginBottom:10}}>
        <div style={{fontSize:11,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".05em",marginBottom:5}}>Phase rattachée</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {PHASES.map(ph=>{
            const active=e.phase===ph.id;
            return(
              <button key={ph.id} type="button" onClick={()=>onPhase(ph.id)}
                style={{
                  display:"inline-flex",alignItems:"center",gap:5,
                  padding:"5px 12px",borderRadius:20,cursor:"pointer",
                  fontFamily:"inherit",fontSize:11.5,fontWeight:active?700:500,
                  border:`1.5px solid ${active?ph.color:BD}`,
                  background:active?ph.color+"18":"#fff",
                  color:active?ph.color:"#6c757d",
                  transition:"all .15s",
                }}>
                <span>{ph.icon}</span>{ph.label}
                {active&&<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={ph.color} strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 3: Validateurs dropdown */}
      <div style={{fontSize:11,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".05em",marginBottom:5}}>Validateurs</div>
      <ValidDropdown users={users} selected={e.v||[]} onToggle={onToggleV}/>

      {/* Row 4: Document à signer */}
      <label style={{display:"flex",alignItems:"center",gap:8,marginTop:10,padding:"8px 12px",
        background:e.requireSign?"#f5f3ff":"#fafbfc",
        border:"1px solid "+(e.requireSign?"#c4b5fd":"#e5e7eb"),
        borderRadius:7,cursor:"pointer",transition:"all .15s"}}>
        <input type="checkbox" checked={!!e.requireSign} onChange={onToggleRequireSign}
          style={{width:15,height:15,accentColor:"#7c3aed",cursor:"pointer"}}/>
        <div>
          <div style={{fontSize:12.5,fontWeight:e.requireSign?700:500,color:e.requireSign?"#4c1d95":"#6c757d"}}>
            ✍️ Document à signer
          </div>
          <div style={{fontSize:11,color:"#94a3b8",marginTop:1}}>
            Rattachement SoftSign requis à cette étape
          </div>
        </div>
      </label>

      {/* Checklists preview */}
      {e.checklists?.length>0&&(
        <div style={{marginTop:8,paddingTop:8,borderTop:`1px solid ${BD}`,display:"flex",gap:6,flexWrap:"wrap"}}>
          {e.checklists.map((cl,ci)=>(
            <span key={ci} style={{...bdg("#f0f7ff","#1560bd",{fontSize:10})}}>
              {cl.code}. {cl.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* Checklist modal for one étape */
function ChecklistModal({ checklists, onSave, onClose }) {
  const [list, setList] = useState(checklists.map(c => ({ ...c })));
  const [newCode, setNewCode] = useState("");
  const [newLabel, setNewLabel] = useState("");

  function add() {
    if (!newLabel.trim()) return;
    const code = newCode.trim() || String(list.length + 1).padStart(2, "0");
    setList(p => [...p, { code, label: newLabel.trim() }]);
    setNewCode(""); setNewLabel("");
  }

  return (
    <Modal title="Checklists de l'étape" onClose={onClose} w={520}
      footer={<>
        <button onClick={onClose} style={btn("light", true)}>Fermer</button>
        <button onClick={() => onSave(list)} style={btn("primary")}>
          <span style={{ display: "flex" }}>{IC.chk}</span> Enregistrer
        </button>
      </>}>
      <div style={{ marginBottom: 14 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ padding: "8px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: MUT, textTransform: "uppercase", borderBottom: `2px solid ${BD}` }}>Code</th>
              <th style={{ padding: "8px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: MUT, textTransform: "uppercase", borderBottom: `2px solid ${BD}` }}>Libellé</th>
              <th style={{ width: 60, borderBottom: `2px solid ${BD}` }} />
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr><td colSpan={3} style={{ padding: 20, textAlign: "center", color: MUT, fontSize: 13 }}>Aucun checklist</td></tr>
            )}
            {list.map((c, i) => (
              <tr key={i}>
                <td style={{ padding: "8px 12px", borderBottom: `1px solid ${BD}` }}>
                  <input value={c.code} onChange={e => setList(p => p.map((x, ii) => ii === i ? { ...x, code: e.target.value } : x))}
                    style={{ ...inp({ padding: "5px 8px", fontSize: 12, width: 60 }) }} />
                </td>
                <td style={{ padding: "8px 12px", borderBottom: `1px solid ${BD}` }}>
                  <input value={c.label} onChange={e => setList(p => p.map((x, ii) => ii === i ? { ...x, label: e.target.value } : x))}
                    style={{ ...inp({ padding: "5px 8px", fontSize: 12 }) }} />
                </td>
                <td style={{ padding: "8px 12px", borderBottom: `1px solid ${BD}` }}>
                  <button onClick={() => setList(p => p.filter((_, ii) => ii !== i))} style={{ ...btn("danger", true), padding: "3px 8px" }}>
                    <span style={{ display: "flex" }}>{IC.trash}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add new */}
      <div style={{ display: "flex", gap: 8, padding: "10px 0", borderTop: `1px solid ${BD}` }}>
        <input value={newCode} onChange={e => setNewCode(e.target.value)} placeholder="Code"
          style={{ ...inp({ width: 70, padding: "7px 10px", fontSize: 12 }) }} />
        <input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Libellé du checklist" onKeyDown={e => e.key === "Enter" && add()}
          style={{ ...inp({ flex: 1, padding: "7px 10px", fontSize: 12 }) }} />
        <button onClick={add} style={btn("primary", true)}>
          <span style={{ display: "flex" }}>{IC.plus}</span> Ajouter
        </button>
      </div>
    </Modal>
  );
}

export default function ParamTypes() {
  const { types, setTypes, users } = useApp();
  const [modal, setModal] = useState(null);
  const [edit, setEdit] = useState(null);
  const [checklistEtape, setChecklistEtape] = useState(null);
  const tableRef = useRef(null);

  function openEdit(t) { setEdit(JSON.parse(JSON.stringify(t))); setModal("edit"); }
  function openNew() {
    setEdit({ id: "", nom: "", conf: false, projets: [], sites: [], etapes: [] });
    setModal("edit");
  }
  function toggleActif(id){
    setTypes(p=>p.map(t=>t.id===id?{...t,actif:t.actif===false?true:false}:t));
  }

  function save() {
    setTypes(p => edit.id && p.some(x => x.id === edit.id)
      ? p.map(t => t.id === edit.id ? edit : t)
      : [...p, { ...edit, id: gid("DT") }]);
    setModal(null);
  }
  function addEtape() {
    setEdit(p => ({ ...p, etapes: [...(p.etapes || []), { label: "Nouvelle étape", duree: 24, v: [], checklists: [] }] }));
  }
  function removeEtape(i) { setEdit(p => ({ ...p, etapes: p.etapes.filter((_, ii) => ii !== i) })); }
  function toggleV(ei, uid) {
    setEdit(p => ({ ...p, etapes: p.etapes.map((e, i) => i === ei ? { ...e, v: e.v?.includes(uid) ? e.v.filter(x => x !== uid) : [...(e.v || []), uid] } : e) }));
  }
  function toggleRequireSign(ei) {
    setEdit(p => ({ ...p, etapes: p.etapes.map((e, i) => i === ei ? { ...e, requireSign: !e.requireSign } : e) }));
  }
  function toggleProjet(pid) {
    setEdit(p => ({ ...p, projets: p.projets?.includes(pid) ? p.projets.filter(x => x !== pid) : [...(p.projets || []), pid] }));
  }
  function toggleSite(s) {
    setEdit(p => ({ ...p, sites: p.sites?.includes(s) ? p.sites.filter(x => x !== s) : [...(p.sites || []), s] }));
  }
  function saveChecklist(etapeIdx, list) {
    setEdit(p => ({ ...p, etapes: p.etapes.map((e, i) => i === etapeIdx ? { ...e, checklists: list } : e) }));
    setChecklistEtape(null);
  }

  return (
    <div style={{ animation: "fadeIn .2s ease" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: "#212529" }}>WorkFlow</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <ExportButtons filename="types_documents" title="Types de documents"
            headers={["ID","Nom","Confidentiel","Projets","Sites","Nb étapes"]}
            rows={types.map(t=>[t.id,t.nom,t.conf?"Oui":"Non",(t.projets||[]).join(", "),(t.sites||[]).join(", "),t.etapes?.length||0])} />
          <button onClick={openNew} style={btn("primary", true)}>
            <span style={{ display: "flex" }}>{IC.plus}</span> Nouveau type
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 14 }}>
        {types.map(t => (
          <div key={t.id} style={{ ...card(), padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 6, background: "#eef1f8", display: "flex", alignItems: "center", justifyContent: "center", color: P, flexShrink: 0 }}>
                <span style={{ display: "flex" }}>{IC.fileText}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#212529" }}>{t.nom}</div>
                <div style={{ fontSize: 11, color: MUT }}>{t.id} · {t.etapes?.length || 0} étapes</div>
              </div>
              {t.actif===false&&<span style={{fontSize:10,fontWeight:700,color:"#6c757d",background:"#f0f2f5",padding:"2px 8px",borderRadius:10}}>Inactif</span>}
              {t.conf && (
                <span style={{ ...bdg("#e9d8f5", "#5e1d8a", { fontSize: 10 }), display: "inline-flex", alignItems: "center", gap: 3 }}>
                  <span style={{ display: "flex" }}>{IC.lock}</span> Conf.
                </span>
              )}
              {/* Active/inactive toggle */}
              <div onClick={()=>toggleActif(t.id)} title={t.actif===false?"Activé (cliquer pour désactiver)":"Désactiver"}
                style={{width:34,height:20,borderRadius:10,background:t.actif===false?"#9ca3af":"#16a34a",cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}>
                <div style={{position:"absolute",top:2,left:t.actif===false?2:16,width:16,height:16,borderRadius:"50%",background:"#fff",transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.2)"}}/>
              </div>
              <button onClick={() => openEdit(t)} style={btn("light", true)}>
                <span style={{ display: "flex" }}>{IC.edit}</span>
              </button>
            </div>

            {/* Étapes summary */}
            {t.etapes?.map((e, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderTop: i === 0 ? "none" : `1px solid ${BD}` }}>
                <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#eef1f8", color: P, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                <span style={{ fontSize: 12, flex: 1, color: "#495057" }}>{e.label}</span>
                <span style={{ fontSize: 11, color: MUT, whiteSpace: "nowrap" }}>{e.duree}h</span>
                {e.checklists?.length > 0 && (
                  <span style={{ ...bdg("#e8f5ff", "#1560bd", { fontSize: 10 }) }}>{e.checklists.length} check</span>
                )}
              </div>
            ))}

            {/* Projets */}
            {t.projets?.length > 0 && (
              <div style={{ marginTop: 10, paddingTop: 8, borderTop: `1px solid ${BD}`, display: "flex", gap: 4, flexWrap: "wrap" }}>
                {t.projets.map(pid => (
                  <span key={pid} style={{ ...bdg("#eef1f8", P, { fontSize: 10 }) }}>{pid}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {modal === "edit" && edit && (
        <Modal title={edit.id ? "Modifier le type" : "Nouveau type"} onClose={() => setModal(null)} w={720}
          footer={<>
            <button onClick={() => setModal(null)} style={btn("light", true)}>Annuler</button>
            <button onClick={save} style={btn("primary")}>
              <span style={{ display: "flex" }}>{IC.chk}</span> Enregistrer
            </button>
          </>}>
          {/* Basic info */}
          <div style={{ display: "grid", gridTemplateColumns: typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr", gap: 10, marginBottom: 20 }}>
            <div>
              <label style={lbl}>Nom</label>
              <input value={edit.nom || ""} onChange={e => setEdit(p => ({ ...p, nom: e.target.value }))} style={inp()} />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, cursor: "pointer" }}>
                <input type="checkbox" checked={!!edit.conf} onChange={e => setEdit(p => ({ ...p, conf: e.target.checked }))} />
                Document confidentiel
              </label>
            </div>
          </div>

          {/* Projets & Sites */}
          <div style={{ display: "grid", gridTemplateColumns: typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr", gap: 14, marginBottom: 20 }}>
            <div>
              <label style={{ ...lbl, marginBottom: 8 }}>Projets autorisés</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {PROJETS.map(p => (
                  <label key={p.id} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12.5, cursor: "pointer" }}>
                    <input type="checkbox" checked={edit.projets?.includes(p.id) || false} onChange={() => toggleProjet(p.id)} />
                    <div>
                      <div style={{ fontWeight: 600, color: "#212529" }}>{p.nom.slice(0, 30)}</div>
                      <div style={{ fontSize: 11, color: MUT }}>{p.bailleur}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label style={{ ...lbl, marginBottom: 8 }}>Sites autorisés</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {ALL_SITES.map(s => (
                  <label key={s} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12.5, cursor: "pointer" }}>
                    <input type="checkbox" checked={edit.sites?.includes(s) || false} onChange={() => toggleSite(s)} />
                    {s}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Étapes */}
          <div style={{ marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#495057", textTransform: "uppercase", letterSpacing: ".06em" }}>Étapes de validation</span>
            <button onClick={addEtape} style={btn("light", true)}>
              <span style={{ display: "flex" }}>{IC.plus}</span> Ajouter
            </button>
          </div>

          {edit.etapes?.map((e, i) => (
            <StepRow key={i} e={e} i={i}
              users={users}
              onLabel={ev=>setEdit(p=>({...p,etapes:p.etapes.map((x,ii)=>ii===i?{...x,label:ev.target.value}:x)}))}
              onDuree={ev=>setEdit(p=>({...p,etapes:p.etapes.map((x,ii)=>ii===i?{...x,duree:Number(ev.target.value)}:x)}))}
              onPhase={ph=>setEdit(p=>({...p,etapes:p.etapes.map((x,ii)=>ii===i?{...x,phase:ph}:x)}))}
              onToggleV={uid=>toggleV(i,uid)}
              onChecklist={()=>setChecklistEtape(i)}
              onRemove={()=>removeEtape(i)}
              onToggleRequireSign={()=>toggleRequireSign(i)}
            />
          ))}
        </Modal>
      )}

      {/* Checklist sub-modal */}
      {checklistEtape !== null && edit && (
        <ChecklistModal
          checklists={edit.etapes[checklistEtape]?.checklists || []}
          onSave={(list) => saveChecklist(checklistEtape, list)}
          onClose={() => setChecklistEtape(null)}
        />
      )}
    </div>
  );
}
