"use client";
import{useState}from"react";
import{Modal}from"../ui/Modal";
import{Badge,Avatar}from"../ui/Badge";
import{IC}from"../ui/Icons";
import{card,btn,inp,bdg,P,WH,BD,MUT,SUC,SUCL,SUCD,DNG,DNGL,DNGD,WRN,WRNL,WRND,R,RSm,TR}from"../../lib/theme";
import{fmtN,now}from"../../lib/utils";
import{useApp}from"../../context/AppContext";

const STEP_IC={VALIDÉ:IC.checkCircle,REJETÉ:IC.xCircle,"EN RETARD":IC.alertTri,"EN ATTENTE":IC.clock};
const STEP_COL={VALIDÉ:{bg:SUCL,fg:SUCD},REJETÉ:{bg:DNGL,fg:DNGD},"EN RETARD":{bg:WRNL,fg:WRND},"EN ATTENTE":{bg:"#e9ecef",fg:MUT}};

const TABS=[
  {k:"circuit",  label:"Circuit",     icon:IC.refresh},
  {k:"ocr",      label:"OCR",         icon:IC.robot},
  {k:"annexes",  label:"Annexes",     icon:IC.paperclip},
  {k:"historique",label:"Historique", icon:IC.scroll},
];

export function DocDetail({doc,onBack,onUpdate,ctx}){
  const{users}=useApp();
  const[tab,setTab]=useState("circuit");
  const[modal,setModal]=useState(null);
  const[comment,setComment]=useState("");
  const[rejCause,setRejCause]=useState("");
  const[editMt,setEditMt]=useState(false);
  const[newMt,setNewMt]=useState(String(doc.mtR||doc.mt||""));

  const nextEtape=doc.etapes?.find(e=>e.statut==="EN ATTENTE"||e.statut==="EN RETARD");
  const canValidate=!!nextEtape;
  const canBap=ctx==="envoyes"&&!doc.bap&&doc.st==="VALIDÉ"&&doc.etapes?.every(e=>e.statut==="VALIDÉ");
  const isRejected=doc.st==="REJETÉ";

  function validate(){
    if(!nextEtape)return;
    const ne=doc.etapes.map(e=>e.label===nextEtape.label?{...e,statut:"VALIDÉ",date:now(),comment,validBy:"U002"}:e);
    const allDone=ne.every(e=>e.statut==="VALIDÉ");
    onUpdate({...doc,etapes:ne,st:allDone?"VALIDÉ":"EN VALIDATION",comment});
    setModal(null);setComment("");
  }

  function reject(){
    if(!nextEtape)return;
    const ne=doc.etapes.map(e=>e.label===nextEtape.label?{...e,statut:"REJETÉ",date:now(),comment:rejCause,validBy:"U002"}:e);
    onUpdate({...doc,etapes:ne,st:"REJETÉ",motif:rejCause,refus:{etape:nextEtape.label,date:now(),cause:"Rejet",comment:rejCause}});
    setModal(null);setRejCause("");
  }

  function saveMt(){
    const v=parseFloat(newMt.replace(/\s/g,""));
    if(!isNaN(v))onUpdate({...doc,mtR:v});
    setEditMt(false);
  }

  return(
    <div style={{animation:"fadeIn .2s ease"}}>
      {/* Header */}
      <div style={{display:"flex",gap:12,marginBottom:16,alignItems:"flex-start",flexWrap:"wrap"}}>
        <button onClick={onBack} style={btn("light",true)}>
          <span style={{display:"flex",transform:"rotate(180deg)"}}>{IC.chev}</span> Retour
        </button>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
            <h2 style={{fontSize:18,fontWeight:700,color:"#212529"}}>{doc.id}</h2>
            <Badge s={doc.st}/>
            {doc.conf&&(
              <span style={{...bdg("#e9d8f5","#5e1d8a",{fontSize:11}),display:"inline-flex",alignItems:"center",gap:4}}>
                <span style={{display:"flex"}}>{IC.lockKey}</span> Confidentiel
              </span>
            )}
            {doc.bap&&(
              <span style={{...bdg(SUCL,SUCD,{fontSize:11}),display:"inline-flex",alignItems:"center",gap:4}}>
                <span style={{display:"flex"}}>{IC.checkCircle}</span> Bon à payer
              </span>
            )}
          </div>
          <div style={{fontSize:12,color:MUT,marginTop:4}}>{doc.type} · {doc.fourn||"—"} · {doc.site} · {doc.date}</div>
        </div>
        {/* Actions */}
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {canValidate&&!isRejected&&(
            <button onClick={()=>setModal("validate")} style={btn("success",true)}>
              <span style={{display:"flex"}}>{IC.chk}</span> Valider
            </button>
          )}
          {canValidate&&!isRejected&&(
            <button onClick={()=>setModal("reject")} style={btn("danger",true)}>
              <span style={{display:"flex"}}>{IC.x}</span> Rejeter
            </button>
          )}
          {canBap&&(
            <button onClick={()=>onUpdate({...doc,bap:true,st:"BON À PAYER"})} style={btn("primary",true)}>
              <span style={{display:"flex"}}>{IC.creditCard}</span> Bon à payer
            </button>
          )}
          {!doc.AR&&(
            <button onClick={()=>onUpdate({...doc,AR:true})} style={btn("light",true)}>
              <span style={{display:"flex"}}>{IC.send}</span> Émettre AR
            </button>
          )}
        </div>
      </div>

      {/* Summary cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:16}}>
        {/* Montant réel */}
        <div style={{...card(),padding:16}}>
          <div style={{fontSize:11,fontWeight:600,color:MUT,textTransform:"uppercase",marginBottom:6,display:"flex",alignItems:"center",gap:4}}>
            <span style={{display:"flex"}}>{IC.money}</span> Montant réel
          </div>
          {editMt?(
            <div style={{display:"flex",gap:6}}>
              <input value={newMt} onChange={e=>setNewMt(e.target.value)} style={{...inp({fontSize:13,padding:"6px 10px"}),flex:1}}/>
              <button onClick={saveMt} style={btn("success",true)}>{IC.chk}</button>
              <button onClick={()=>setEditMt(false)} style={btn("light",true)}>{IC.x}</button>
            </div>
          ):(
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:18,fontWeight:700,color:"#212529"}}>{fmtN(doc.mtR)}</span>
              <button onClick={()=>setEditMt(true)} style={{...btn("light",true),padding:"3px 8px"}}>
                <span style={{display:"flex"}}>{IC.edit}</span>
              </button>
            </div>
          )}
        </div>
        {/* Projet/Site */}
        <div style={{...card(),padding:16}}>
          <div style={{fontSize:11,fontWeight:600,color:MUT,textTransform:"uppercase",marginBottom:6,display:"flex",alignItems:"center",gap:4}}>
            <span style={{display:"flex"}}>{IC.map}</span> Projet / Site
          </div>
          <div style={{fontSize:14,fontWeight:600,color:"#212529"}}>{doc.proj||"—"}</div>
          <div style={{fontSize:12,color:MUT}}>{doc.site||"—"}</div>
        </div>
        {/* Score OCR */}
        <div style={{...card(),padding:16}}>
          <div style={{fontSize:11,fontWeight:600,color:MUT,textTransform:"uppercase",marginBottom:6,display:"flex",alignItems:"center",gap:4}}>
            <span style={{display:"flex"}}>{IC.robot}</span> Score OCR
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{flex:1,background:"#e9ecef",borderRadius:4,height:8}}>
              <div style={{width:`${doc.ocr}%`,height:"100%",background:doc.ocr>=85?"#28a745":doc.ocr>=70?"#ffc107":"#dc3545",borderRadius:4}}/>
            </div>
            <span style={{fontWeight:700,fontSize:15,color:"#212529"}}>{doc.ocr}%</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{...card()}}>
        <div style={{display:"flex",borderBottom:`1px solid ${BD}`,padding:"0 4px"}}>
          {TABS.map(t=>(
            <button key={t.k} onClick={()=>setTab(t.k)}
              style={{background:"none",border:"none",padding:"12px 16px",fontSize:13,cursor:"pointer",color:tab===t.k?P:MUT,fontWeight:tab===t.k?700:400,borderBottom:tab===t.k?`2px solid ${P}`:"2px solid transparent",transition:TR,display:"flex",alignItems:"center",gap:6}}>
              <span style={{display:"flex"}}>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        <div style={{padding:20}}>
          {/* CIRCUIT */}
          {tab==="circuit"&&(
            <div>
              {doc.etapes?.map((e,i)=>{
                const sc=STEP_COL[e.statut]||STEP_COL["EN ATTENTE"];
                const si=STEP_IC[e.statut]||IC.clock;
                return(
                  <div key={i} style={{display:"flex",gap:14,marginBottom:12}}>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                      <div style={{width:36,height:36,borderRadius:"50%",background:sc.bg,color:sc.fg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <span style={{display:"flex"}}>{si}</span>
                      </div>
                      {i<doc.etapes.length-1&&<div style={{width:2,flex:1,minHeight:12,background:BD,margin:"4px 0"}}/>}
                    </div>
                    <div style={{flex:1,paddingBottom:8}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                        <span style={{fontSize:13,fontWeight:600,color:"#212529"}}>{e.label}</span>
                        <Badge s={e.statut} sm/>
                      </div>
                      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:4}}>
                        {e.v?.map(uid=><Avatar key={uid} uid={uid} users={users} size={24}/>)}
                      </div>
                      {e.date&&(
                        <div style={{fontSize:11,color:MUT,display:"flex",alignItems:"center",gap:4}}>
                          <span style={{display:"flex"}}>{IC.calendar}</span>
                          {e.date}
                          {e.validBy&&<><span style={{margin:"0 4px"}}>·</span><Avatar uid={e.validBy} users={users} size={18}/></>}
                        </div>
                      )}
                      {e.comment&&(
                        <div style={{fontSize:12,color:"#495057",marginTop:4,background:"#f8f9fc",padding:"6px 10px",borderRadius:RSm}}>
                          {e.comment}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* OCR */}
          {tab==="ocr"&&doc.ch&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[["Numéro doc",doc.ch.numero],["Date doc",doc.ch.date_doc],["Emetteur",doc.ch.emetteur],["NIF",doc.ch.nif],["IBAN",doc.ch.iban],["HT",fmtN(parseFloat(doc.ch.ht))],["TVA",fmtN(parseFloat(doc.ch.tva))],["Total TTC",fmtN(parseFloat(doc.ch.total))]].map(([l,v])=>(
                <div key={l} style={{background:"#f8f9fc",borderRadius:RSm,padding:"10px 14px"}}>
                  <div style={{fontSize:11,color:MUT,fontWeight:600,textTransform:"uppercase",marginBottom:3}}>{l}</div>
                  <div style={{fontSize:13,fontWeight:600,color:"#212529"}}>{v||"—"}</div>
                </div>
              ))}
            </div>
          )}

          {/* ANNEXES */}
          {tab==="annexes"&&(
            <div>
              {(!doc.anx||doc.anx.length===0)&&(
                <div style={{textAlign:"center",color:MUT,padding:24}}>
                  <span style={{display:"flex",justifyContent:"center",marginBottom:8,opacity:.4}}>{IC.paperclip}</span>
                  Aucune annexe
                </div>
              )}
              {doc.anx?.map((a,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${BD}`}}>
                  <span style={{display:"flex",color:P}}>{IC.paperclip}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600,color:"#212529"}}>{a.nom}</div>
                    <div style={{fontSize:11,color:MUT}}>{a.type}{a.oblig?" · Obligatoire":""}</div>
                  </div>
                  <span style={{...bdg(a.ok?SUCL:"#e9ecef",a.ok?SUCD:MUT,{fontSize:11}),display:"inline-flex",alignItems:"center",gap:4}}>
                    <span style={{display:"flex"}}>{a.ok?IC.chk:IC.clock}</span>
                    {a.ok?"Fourni":"Manquant"}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* HISTORIQUE */}
          {tab==="historique"&&(
            <div>
              {doc.etapes?.filter(e=>e.statut!=="EN ATTENTE").map((e,i)=>{
                const sc=STEP_COL[e.statut]||STEP_COL["EN ATTENTE"];
                const si=STEP_IC[e.statut]||IC.clock;
                return(
                  <div key={i} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:`1px solid ${BD}`}}>
                    <div style={{width:32,height:32,borderRadius:"50%",background:sc.bg,color:sc.fg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <span style={{display:"flex"}}>{si}</span>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:600,color:"#212529"}}>{e.label}</div>
                      <div style={{fontSize:11,color:MUT,display:"flex",alignItems:"center",gap:4,marginTop:2}}>
                        <span style={{display:"flex"}}>{IC.calendar}</span>{e.date}
                      </div>
                      {e.comment&&<div style={{fontSize:12,color:"#495057",marginTop:4}}>{e.comment}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {modal==="validate"&&(
        <Modal title="Valider l'étape" onClose={()=>setModal(null)} w={480}
          footer={<>
            <button onClick={()=>setModal(null)} style={btn("light",true)}>Annuler</button>
            <button onClick={validate} style={btn("success",true)}>
              <span style={{display:"flex"}}>{IC.chk}</span> Confirmer
            </button>
          </>}>
          <div style={{marginBottom:12,fontSize:13,color:"#495057"}}>Étape : <b>{nextEtape?.label}</b></div>
          <label style={{fontSize:12,fontWeight:600,color:"#495057",display:"block",marginBottom:4}}>Commentaire</label>
          <textarea value={comment} onChange={e=>setComment(e.target.value)} rows={3}
            style={{...inp(),resize:"vertical",fontFamily:"inherit"}} placeholder="Commentaire optionnel…"/>
        </Modal>
      )}
      {modal==="reject"&&(
        <Modal title="Rejeter l'étape" onClose={()=>setModal(null)} w={480}
          footer={<>
            <button onClick={()=>setModal(null)} style={btn("light",true)}>Annuler</button>
            <button onClick={reject} style={btn("danger",true)}>
              <span style={{display:"flex"}}>{IC.x}</span> Confirmer rejet
            </button>
          </>}>
          <label style={{fontSize:12,fontWeight:600,color:"#495057",display:"block",marginBottom:4}}>Motif du rejet *</label>
          <textarea value={rejCause} onChange={e=>setRejCause(e.target.value)} rows={3}
            style={{...inp(),resize:"vertical",fontFamily:"inherit"}} placeholder="Décrivez le motif du rejet…"/>
        </Modal>
      )}
    </div>
  );
}
