"use client";
import{useState,useMemo}from"react";
import{Modal}from"../ui/Modal";
import{Avatar}from"../ui/Badge";
import{IC}from"../ui/Icons";
import{btn,inp,P,WH,BD,MUT,SUC,SUCL,SUCD,DNG,DNGL,RSm}from"../../lib/theme";
import{useApp}from"../../context/AppContext";
import{getActiveStep}from"../../lib/workflow";
import{fmtN}from"../../lib/utils";

/* ── Confirmation modale rejet ── */
export function ConfirmRejetModal({onConfirm,onCancel}){
  return(
    <div style={{position:"fixed",inset:0,zIndex:99999,background:"rgba(0,0,0,.6)",display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(3px)"}}>
      <div style={{background:WH,borderRadius:12,boxShadow:"0 20px 60px rgba(0,0,0,.3)",width:"100%",maxWidth:420,animation:"fadeIn .15s ease",overflow:"hidden"}}>
        <div style={{background:"#c0392b",padding:"14px 20px",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:"50%",background:"rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <span style={{color:"#fff",fontWeight:700,fontSize:14}}>Confirmer le rejet</span>
        </div>
        <div style={{padding:"20px 24px"}}>
          <p style={{fontSize:13.5,color:"#212529",marginBottom:8,fontWeight:600}}>Êtes-vous sûr de vouloir rejeter ce document ?</p>
          <p style={{fontSize:12.5,color:MUT}}>Cette action est irréversible. Le document passera en statut <b>Rejeté</b> et le fournisseur sera notifié.</p>
        </div>
        <div style={{padding:"12px 20px",borderTop:`1px solid ${BD}`,display:"flex",justifyContent:"flex-end",gap:10,background:"#f8f9fc"}}>
          <button onClick={onCancel} style={btn("light",true)}>Annuler</button>
          <button onClick={onConfirm} style={btn("danger")}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            Confirmer le rejet
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MODAL VALIDATION PRINCIPALE
══════════════════════════════════════════════════════════ */
export function ValidationModal({doc,onClose,onValidate}){
  const{users,planComptes,authUser}=useApp();
  const step=getActiveStep(doc);
  const stepIdx=doc.etapes?.indexOf(step)??-1;
  const nextStep=doc.etapes?.[stepIdx+1];

  const[montant,setMontant]=useState(String(doc.mtR||doc.mt||""));
  const[planCompte,setPlanCompte]=useState(doc.planCompte||"");
  const[comment,setComment]=useState("");
  const[activite,setActivite]=useState(doc.activite||"");
  const[selectedValideurs,setSelectedValideurs]=useState(nextStep?.v||[]);
  const[pcSearch,setPcSearch]=useState("");
  const[pcOpen,setPcOpen]=useState(false);

  // Valideurs disponibles pour l'étape suivante
  const nextStepValideurs=useMemo(()=>{
    if(!nextStep)return[];
    return users.filter(u=>nextStep.v?.includes(u.id));
  },[nextStep,users]);

  const selectedPc=useMemo(()=>
    (planComptes||[]).find(pc=>pc.id===planCompte)
  ,[planComptes,planCompte]);

  const filteredPcs=useMemo(()=>
    (planComptes||[]).filter(pc=>
      !pcSearch||pc.code.includes(pcSearch)||pc.libelle.toLowerCase().includes(pcSearch.toLowerCase())
    ).slice(0,8)
  ,[planComptes,pcSearch]);

  function toggleValideur(uid){
    setSelectedValideurs(p=>p.includes(uid)?p.filter(x=>x!==uid):[...p,uid]);
  }

  function confirm(){
    onValidate({
      comment,montant,planCompte,activite,
      valideursSuivants:selectedValideurs,
    });
  }

  const ACTIVITIES=["ACT-001","ACT-002","ACT-003","ACT-004","ACT-005"];

  return(
    <Modal title="Validation" onClose={onClose} w={680}
      footer={<>
        <button onClick={onClose} style={btn("light",true)}>Annuler</button>
        <button onClick={confirm} style={btn("success")}>
          <span style={{display:"flex"}}>{IC.chk}</span> Envoyer
        </button>
      </>}>

      {/* Current step info */}
      <div style={{background:"#f0f7ff",border:`1px solid #b8d4f7`,borderRadius:8,padding:"10px 14px",marginBottom:18,display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:32,height:32,borderRadius:"50%",background:P,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:12,fontWeight:700,flexShrink:0}}>
          {(stepIdx+1)}
        </div>
        <div>
          <div style={{fontSize:13,fontWeight:700,color:"#1a3a6a"}}>Étape : {step?.label}</div>
          <div style={{fontSize:11.5,color:"#4a7ab5"}}>Document : {doc.id} · {doc.type}</div>
        </div>
      </div>

      {/* Montant réel */}
      <div style={{marginBottom:16}}>
        <label style={{fontSize:11.5,fontWeight:700,color:"#495057",textTransform:"uppercase",letterSpacing:".06em",display:"block",marginBottom:5}}>
          Montant réel à payer :
        </label>
        <div style={{position:"relative"}}>
          <input value={montant} onChange={e=>setMontant(e.target.value.replace(/[^0-9.]/g,""))}
            placeholder="0" style={{...inp({fontSize:15,fontWeight:600,paddingRight:50})}}/>
          <span style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",fontSize:12,color:MUT,fontWeight:600}}>Ar</span>
        </div>
        {montant&&!isNaN(+montant)&&(
          <div style={{fontSize:11.5,color:MUT,marginTop:4}}>≈ {fmtN(+montant)} Ar</div>
        )}
      </div>

      {/* Plan de compte */}
      <div style={{marginBottom:16,position:"relative"}}>
        <label style={{fontSize:11.5,fontWeight:700,color:"#495057",textTransform:"uppercase",letterSpacing:".06em",display:"block",marginBottom:5}}>
          Plan de compte :
        </label>
        <div style={{border:`1px solid ${BD}`,borderRadius:6,overflow:"hidden"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:"#f8f9fc",borderBottom:pcOpen?`1px solid ${BD}`:"none",cursor:"pointer"}}
            onClick={()=>setPcOpen(p=>!p)}>
            {selectedPc
              ?<><span style={{fontWeight:700,color:P,fontFamily:"monospace"}}>{selectedPc.code}</span>
                <span style={{flex:1,fontSize:13,color:"#212529"}}>{selectedPc.libelle}</span>
                <button onClick={e=>{e.stopPropagation();setPlanCompte("");setPcSearch("");}}
                  style={{background:"none",border:"none",cursor:"pointer",color:MUT,display:"flex",padding:0}}>{IC.x}</button>
              </>
              :<><span style={{flex:1,color:MUT,fontSize:13}}>Sélectionner un compte…</span>
                <span style={{display:"flex",color:MUT,transform:pcOpen?"rotate(90deg)":"none",transition:"transform .2s"}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                </span>
              </>
            }
          </div>
          {pcOpen&&(
            <div>
              <div style={{padding:"8px 10px",borderBottom:`1px solid ${BD}`}}>
                <input value={pcSearch} onChange={e=>setPcSearch(e.target.value)}
                  placeholder="Code ou libellé…" autoFocus
                  style={{...inp({padding:"6px 10px",fontSize:12.5}),width:"100%",boxSizing:"border-box"}}/>
              </div>
              <div style={{maxHeight:200,overflowY:"auto"}}>
                {filteredPcs.map(pc=>(
                  <div key={pc.id} onClick={()=>{setPlanCompte(pc.id);setPcOpen(false);setPcSearch("");}}
                    style={{padding:"8px 12px",cursor:"pointer",display:"flex",gap:10,alignItems:"center",borderBottom:`1px solid ${BD}`}}
                    onMouseEnter={e=>e.currentTarget.style.background="#f0f4ff"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <span style={{fontWeight:700,color:P,fontFamily:"monospace",fontSize:12,minWidth:50}}>{pc.code}</span>
                    <span style={{fontSize:12.5,color:"#212529",flex:1}}>{pc.libelle}</span>
                    <span style={{fontSize:10.5,color:MUT,background:"#f0f0f0",padding:"1px 6px",borderRadius:10}}>{pc.categorie}</span>
                  </div>
                ))}
                {filteredPcs.length===0&&<div style={{padding:"12px",color:MUT,fontSize:12.5,textAlign:"center"}}>Aucun compte trouvé</div>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Activité */}
      <div style={{marginBottom:16}}>
        <label style={{fontSize:11.5,fontWeight:700,color:"#495057",textTransform:"uppercase",letterSpacing:".06em",display:"block",marginBottom:5}}>
          Activité :
        </label>
        <input value={activite} onChange={e=>setActivite(e.target.value)}
          placeholder="Recherche activité …" style={{...inp()}}
          list="activites-list"/>
        <datalist id="activites-list">
          {ACTIVITIES.map(a=><option key={a} value={a}/>)}
        </datalist>
      </div>

      {/* Commentaire */}
      <div style={{marginBottom:16}}>
        <label style={{fontSize:11.5,fontWeight:700,color:"#495057",textTransform:"uppercase",letterSpacing:".06em",display:"block",marginBottom:5}}>
          Commentaire :
        </label>
        <textarea value={comment} onChange={e=>setComment(e.target.value)} rows={4}
          style={{...inp(),resize:"vertical",fontFamily:"inherit",width:"100%",boxSizing:"border-box"}}
          placeholder="Commentaire optionnel…"/>
      </div>

      {/* Envoyer à + Checklists */}
      <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr",gap:12}}>

        {/* Valideurs étape suivante */}
        <div>
          <div style={{background:"#3db890",borderRadius:"6px 6px 0 0",padding:"8px 14px",display:"flex",alignItems:"center",gap:8}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span style={{color:"#fff",fontWeight:700,fontSize:13}}>Envoyer à</span>
          </div>
          <div style={{border:`1px solid ${BD}`,borderTop:"none",borderRadius:"0 0 6px 6px",overflow:"hidden"}}>
            {nextStepValideurs.length===0?(
              <div style={{padding:"14px",fontSize:12.5,color:MUT,textAlign:"center"}}>
                {nextStep?"Aucun valideur défini pour l'étape suivante":"Dernière étape"}
              </div>
            ):nextStepValideurs.map(u=>(
              <label key={u.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",cursor:"pointer",borderBottom:`1px solid ${BD}`,background:selectedValideurs.includes(u.id)?"#f0fff8":"transparent"}}
                onMouseEnter={e=>e.currentTarget.style.background=selectedValideurs.includes(u.id)?"#e8fdf2":"#f8f9fc"}
                onMouseLeave={e=>e.currentTarget.style.background=selectedValideurs.includes(u.id)?"#f0fff8":"transparent"}>
                <input type="checkbox" checked={selectedValideurs.includes(u.id)} onChange={()=>toggleValideur(u.id)}/>
                <div style={{width:28,height:28,borderRadius:"50%",background:P,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff",flexShrink:0}}>
                  {u.init}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12.5,fontWeight:600,color:"#212529",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.nom}</div>
                  <div style={{fontSize:10.5,color:MUT}}>{u.role}</div>
                </div>
              </label>
            ))}
          </div>
          {nextStep&&nextStepValideurs.length>0&&selectedValideurs.length===0&&(
            <div style={{fontSize:11,color:"#c0392b",marginTop:6}}>⚠ Cochez au moins un valideur</div>
          )}
        </div>

        {/* Checklists étape active */}
        <div>
          <div style={{background:"#3db890",borderRadius:"6px 6px 0 0",padding:"8px 14px",display:"flex",alignItems:"center",gap:8}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            <span style={{color:"#fff",fontWeight:700,fontSize:13}}>Checklists</span>
          </div>
          <div style={{border:`1px solid ${BD}`,borderTop:"none",borderRadius:"0 0 6px 6px"}}>
            {step?.checklists?.length>0?(
              <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}><table style={{width:"100%",minWidth:600,borderCollapse:"collapse",fontSize:12}}>
                <thead>
                  <tr style={{background:"#f8f9fc"}}>
                    <th style={{padding:"7px 10px",textAlign:"left",fontWeight:700,color:MUT,fontSize:11,borderBottom:`1px solid ${BD}`}}>Code</th>
                    <th style={{padding:"7px 10px",textAlign:"left",fontWeight:700,color:MUT,fontSize:11,borderBottom:`1px solid ${BD}`,flex:1}}>Libellé</th>
                    <th style={{padding:"7px 10px",textAlign:"center",fontWeight:700,color:MUT,fontSize:11,borderBottom:`1px solid ${BD}`}}>Oui</th>
                    <th style={{padding:"7px 10px",textAlign:"center",fontWeight:700,color:MUT,fontSize:11,borderBottom:`1px solid ${BD}`}}>Non</th>
                    <th style={{padding:"7px 10px",textAlign:"center",fontWeight:700,color:MUT,fontSize:11,borderBottom:`1px solid ${BD}`}}>N/A</th>
                  </tr>
                </thead>
                <tbody>
                  {step.checklists.map((cl,i)=>(
                    <tr key={i} style={{borderBottom:`1px solid ${BD}`}}>
                      <td style={{padding:"7px 10px",fontWeight:600,color:MUT}}>{cl.code}</td>
                      <td style={{padding:"7px 10px",color:"#212529"}}>{cl.label}</td>
                      <td style={{padding:"7px 10px",textAlign:"center"}}><input type="radio" name={`cl-${i}`} onChange={()=>{}}/></td>
                      <td style={{padding:"7px 10px",textAlign:"center"}}><input type="radio" name={`cl-${i}`} onChange={()=>{}}/></td>
                      <td style={{padding:"7px 10px",textAlign:"center"}}><input type="radio" name={`cl-${i}`} onChange={()=>{}}/></td>
                    </tr>
                  ))}
                </tbody>
              </table></div>
            ):(
              <div style={{padding:"14px",fontSize:12.5,color:MUT,textAlign:"center"}}>Aucune checklist pour cette étape</div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}