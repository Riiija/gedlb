"use client";
import{useState,useMemo}from"react";
import{Modal}from"../ui/Modal";
import{IC}from"../ui/Icons";
import{btn,inp,P,BD,MUT,DNG,RSm}from"../../lib/theme";
import{useApp}from"../../context/AppContext";
import{getActiveStep,getPrevSteps}from"../../lib/workflow";

export function RedirectionModal({doc,onClose,onRedirect}){
  const{users}=useApp();
  const step=getActiveStep(doc);
  const activeIdx=doc.etapes?.indexOf(step)??-1;
  const prevSteps=getPrevSteps(doc);

  const[targetIdx,setTargetIdx]=useState(prevSteps.length>0?doc.etapes.indexOf(prevSteps[prevSteps.length-1]):-1);
  const[comment,setComment]=useState("");
  const[selectedValideurs,setSelectedValideurs]=useState([]);

  const targetStep=doc.etapes?.[targetIdx];
  const targetValideurs=useMemo(()=>{
    if(!targetStep)return[];
    return users.filter(u=>(targetStep.v||[]).includes(u.id));
  },[targetStep,users]);

  // Reset valideurs when target changes
  function selectTarget(idx){
    setTargetIdx(idx);
    setSelectedValideurs(doc.etapes?.[idx]?.v||[]);
  }

  function toggleV(uid){
    setSelectedValideurs(p=>p.includes(uid)?p.filter(x=>x!==uid):[...p,uid]);
  }

  const canSubmit=targetIdx>=0&&comment.trim()&&selectedValideurs.length>0;

  return(
    <Modal title="↩ Redirection d'étape" onClose={onClose} w={600}
      footer={<>
        <button onClick={onClose} style={btn("light",true)}>Annuler</button>
        <button onClick={()=>canSubmit&&onRedirect({etapeIdx:targetIdx,comment,valideurs:selectedValideurs})}
          disabled={!canSubmit} style={{...btn("warning"),opacity:canSubmit?1:.5}}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>
          Rediriger
        </button>
      </>}>

      {/* Info */}
      <div style={{background:"#fff8e6",border:`1px solid #f5d78b`,borderRadius:8,padding:"10px 14px",marginBottom:18,fontSize:12.5,color:"#7d5700"}}>
        <b>Étape actuelle :</b> {step?.label} (étape {activeIdx+1}/{doc.etapes?.length})
        <br/>Le document sera renvoyé à une étape précédente pour corrections.
      </div>

      {/* Étape cible */}
      <div style={{marginBottom:16}}>
        <label style={{fontSize:11.5,fontWeight:700,color:"#495057",textTransform:"uppercase",letterSpacing:".06em",display:"block",marginBottom:8}}>
          Étape de retour *
        </label>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {prevSteps.map((e,_)=>{
            const idx=doc.etapes.indexOf(e);
            const isSelected=targetIdx===idx;
            return(
              <label key={idx} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",border:`2px solid ${isSelected?"#f5a623":BD}`,borderRadius:8,cursor:"pointer",background:isSelected?"#fff8e6":"#fff",transition:"all .12s"}}>
                <input type="radio" name="target-step" checked={isSelected} onChange={()=>selectTarget(idx)}/>
                <div style={{width:28,height:28,borderRadius:"50%",background:isSelected?"#f5a623":"#e9ecef",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:isSelected?"#fff":"#6c757d",flexShrink:0}}>
                  {idx+1}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600,color:"#212529"}}>{e.label}</div>
                  <div style={{fontSize:11,color:MUT}}>{(e.v||[]).length} valideur(s) défini(s)</div>
                </div>
              </label>
            );
          })}
          {prevSteps.length===0&&(
            <div style={{padding:"12px",color:MUT,fontSize:12.5,textAlign:"center"}}>
              Ce document est à la première étape — impossible de rediriger.
            </div>
          )}
        </div>
      </div>

      {/* Valideurs pour l'étape cible */}
      {targetStep&&targetValideurs.length>0&&(
        <div style={{marginBottom:16}}>
          <label style={{fontSize:11.5,fontWeight:700,color:"#495057",textTransform:"uppercase",letterSpacing:".06em",display:"block",marginBottom:8}}>
            Valideurs autorisés à l'étape {targetIdx+1} *
          </label>
          <div style={{border:`1px solid ${BD}`,borderRadius:8,overflow:"hidden"}}>
            {targetValideurs.map(u=>(
              <label key={u.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 14px",cursor:"pointer",background:selectedValideurs.includes(u.id)?"#f0fff8":"#fff",borderBottom:`1px solid ${BD}`}}
                onMouseEnter={e=>e.currentTarget.style.background=selectedValideurs.includes(u.id)?"#e8fdf2":"#f8f9fc"}
                onMouseLeave={e=>e.currentTarget.style.background=selectedValideurs.includes(u.id)?"#f0fff8":"#fff"}>
                <input type="checkbox" checked={selectedValideurs.includes(u.id)} onChange={()=>toggleV(u.id)}/>
                <div style={{width:28,height:28,borderRadius:"50%",background:P,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff",flexShrink:0}}>
                  {u.init}
                </div>
                <div>
                  <div style={{fontSize:12.5,fontWeight:600,color:"#212529"}}>{u.nom}</div>
                  <div style={{fontSize:11,color:MUT}}>{u.role}</div>
                </div>
              </label>
            ))}
          </div>
          {selectedValideurs.length===0&&<div style={{fontSize:11,color:DNG,marginTop:5}}>⚠ Sélectionnez au moins un valideur</div>}
        </div>
      )}

      {/* Commentaire obligatoire */}
      <div>
        <label style={{fontSize:11.5,fontWeight:700,color:"#495057",textTransform:"uppercase",letterSpacing:".06em",display:"block",marginBottom:5}}>
          Motif de la redirection * <span style={{color:DNG}}>(obligatoire)</span>
        </label>
        <textarea value={comment} onChange={e=>setComment(e.target.value)} rows={3}
          style={{...inp(),resize:"vertical",fontFamily:"inherit",width:"100%",boxSizing:"border-box",borderColor:!comment.trim()?"#f5c6cb":BD}}
          placeholder="Expliquez pourquoi ce document doit être redirigé…"/>
        {!comment.trim()&&<div style={{fontSize:11,color:DNG,marginTop:4}}>Ce champ est obligatoire</div>}
      </div>
    </Modal>
  );
}
