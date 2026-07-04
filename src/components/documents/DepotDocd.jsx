"use client";
import{useState,useRef}from"react";
import{OCRScanner}from"./OCRScanner";
import{IC}from"../ui/Icons";
import{FG}from"../ui/FormGroup";
import{card,btn,inp,sel,lbl,P,WH,BD,MUT,SUC,SUCL,SUCD,RSm}from"../../lib/theme";
import{PROJETS,ALL_SITES}from"../../lib/data";
import{gid,now,mkEtapes,fmtN}from"../../lib/utils";
import{useApp}from"../../context/AppContext";
import{useT}from"../../lib/i18n";

const MAX_FILE_MB=10;

export function DepotDoc({onDeposit}){
  const{types,setView,champsDyn=[],lang,authUser,projets}=useApp();
  const t=useT(lang);
  const STEPS=[t.etape1,t.etape2,t.etape3,t.etape4];
  const[step,setStep]=useState(0);
  const[ocrData,setOcrData]=useState(null);

  const isFourn=authUser?.type==="fournisseur";
  const autoEmetteur=isFourn?(authUser?.raisonSociale||authUser?.nom||"Fournisseur"):(authUser?.nom||"Interne");
  const autoCat=isFourn?"fournisseur":"interne";
  const autoOrigin=isFourn?"portail-fournisseur":"backoffice";

  const[f,setF]=useState({proj:"",site:"",date:new Date().toISOString().slice(0,10),conf:false,notes:"",montantReel:""});
  const[anx,setAnx]=useState([]);
  const[done,setDone]=useState(false);
  const[dynVals,setDynVals]=useState({});
  const[dynFiles,setDynFiles]=useState({}); // files per dynamic field id
  const[fileError,setFileError]=useState("");
  const fileRef=useRef();
  const setDyn=(id,v)=>setDynVals(p=>({...p,[id]:v}));
  const addDynFiles=(id,newFiles)=>{
    const arr=Array.from(newFiles).filter(fi=>fi.size<=MAX_FILE_MB*1024*1024);
    setDynFiles(p=>({...p,[id]:[...(p[id]||[]),...arr.map(fi=>({nom:fi.name,type:fi.name.split('.').pop().toUpperCase(),size:(fi.size/1024/1024).toFixed(2)+'Mo'}))]}));
  };
  const removeDynFile=(id,idx)=>setDynFiles(p=>({...p,[id]:(p[id]||[]).filter((_,i)=>i!==idx)}));
  const internalFields=champsDyn.filter(ch=>ch.visInternes&&!isFourn);
  const projList=projets||PROJETS;
  const projSites=projList.find(p=>p.id===f.proj)?.sites||ALL_SITES;
  const up=(k,v)=>setF(p=>({...p,[k]:v}));

  function handleFiles(e){
    setFileError("");
    const files=Array.from(e.target.files||[]);
    const overSize=files.filter(fi=>fi.size>MAX_FILE_MB*1024*1024);
    if(overSize.length>0){setFileError(`Fichier(s) trop volumineux: ${overSize.map(fi=>fi.name).join(", ")} (max ${MAX_FILE_MB} Mo)`);return;}
    setAnx(p=>[...p,...files.map(fi=>({nom:fi.name,type:fi.name.split(".").pop().toUpperCase(),size:(fi.size/1024/1024).toFixed(2)+"Mo",ok:true}))]);
    e.target.value="";
  }

  function finalizeDeposit(){
    const mt=parseFloat((ocrData?.total||"0").replace(/\s/g,""))||0;
    const mtR=parseFloat((f.montantReel||ocrData?.total||"0").replace?.(/\s/g,"")||"0")||mt;
    const doc={
      id:gid("DOC"),type:"À définir",tid:null,cat:autoCat,
      fourn:autoEmetteur,fid:authUser?.fournId||null,
      proj:f.proj,site:f.site,mt,mtR:mtR||mt,
      date:f.date,st:"REÇU",conf:f.conf,
      ocr:ocrData?ocrData.score:0,motif:"",
      exped:isFourn?"Fournisseur":"Interne",
      notes:f.notes,bap:false,cloture:false,AR:false,affP:false,linked:false,refus:null,
      deposePar:authUser?.id||null,
      ch:ocrData||{numero:"",date_doc:"",ht:"",tva:"",total:"",nif:"",iban:"",emetteur:autoEmetteur,score:0},
      anx:[...anx],origin:autoOrigin,champsDyn:dynVals,champsDynFiles:dynFiles,
      etapes:[],
    };
    onDeposit(doc);
    setDone(true);
  }

  if(done)return(
    <div style={{...card(),padding:40,textAlign:"center",maxWidth:480,margin:"40px auto"}}>
      <div style={{display:"flex",justifyContent:"center",marginBottom:16,color:SUC}}>
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      </div>
      <h3 style={{fontSize:18,fontWeight:700,color:"#212529",marginBottom:8}}>{t.depotSucces}</h3>
      <p style={{color:MUT,marginBottom:6,fontSize:13}}>{t.depotMsg}</p>
      <p style={{color:"#f5a623",fontSize:12,marginBottom:24}}>⚠️ Le type de document sera défini par le receveur après accusé de réception.</p>
      <div style={{display:"flex",gap:10,justifyContent:"center"}}>
        <button onClick={()=>{setStep(0);setDone(false);setOcrData(null);setF({proj:"",site:"",date:new Date().toISOString().slice(0,10),conf:false,notes:"",montantReel:""});setAnx([]);}} style={btn("light",true)}>{t.nouveauDepot}</button>
        <button onClick={()=>setView("recu")} style={btn("primary",true)}>{t.voirDocs}</button>
      </div>
    </div>
  );

  return(
    <div style={{maxWidth:780,margin:"0 auto",animation:"fadeIn .2s ease"}}>
      <h2 style={{fontSize:18,fontWeight:700,color:"#212529",marginBottom:20}}>{t.deposerDoc}</h2>
      {/* Stepper */}
      <div style={{display:"flex",marginBottom:24}}>
        {STEPS.map((s,i)=>(
          <div key={i} style={{flex:1,display:"flex",alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,flex:1}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:i<step?SUC:i===step?P:"#e9ecef",color:i<=step?"#fff":"#6c757d",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0}}>{i<step?"✓":i+1}</div>
              <span style={{fontSize:12.5,fontWeight:i===step?600:400,color:i===step?"#212529":i<step?SUC:"#6c757d",whiteSpace:"nowrap"}}>{s}</span>
            </div>
            {i<STEPS.length-1&&<div style={{flex:1,height:2,background:i<step?SUC:"#e9ecef",margin:"0 8px",minWidth:20}}/>}
          </div>
        ))}
      </div>

      <div style={{...card(),padding:24}}>
        {/* STEP 0: OCR */}
        {step===0&&<OCRScanner fid={null} onDone={d=>{setOcrData(d);setStep(1);}} onSkip={()=>setStep(1)}/>}

        {/* STEP 1: Infos */}
        {step===1&&(
          <div>
            {ocrData&&(
              <div style={{background:"#f0f7ff",border:"1px solid #b3d4f5",borderRadius:RSm,padding:"10px 14px",marginBottom:16,fontSize:13,color:"#0c5460"}}>
                ✓ OCR terminé · Score {ocrData.score}% · Montant extrait : <b>{fmtN(parseFloat(ocrData.total))}</b>
              </div>
            )}
            {/* Émetteur auto */}
            <div style={{background:"#f0f7ff",border:"1px solid #b3d4f5",borderRadius:RSm,padding:"10px 14px",marginBottom:16,fontSize:13,display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:17}}>👤</span>
              <div>
                <b style={{color:"#212529"}}>{autoEmetteur}</b>
                <span style={{color:MUT,marginLeft:8,fontSize:12}}>{isFourn?"Fournisseur · Portail web":"Utilisateur interne · Backoffice"}</span>
              </div>
            </div>
            <div style={{background:"#fffbeb",border:"1px solid #fcd34d",borderRadius:RSm,padding:"8px 14px",marginBottom:16,fontSize:12,color:"#92400e"}}>
              ℹ️ Le <b>type de document</b> sera affecté après accusé de réception par le receveur.
            </div>
            <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr",gap:12}}>
              <FG label={t.date}><input type="date" value={f.date} onChange={e=>up("date",e.target.value)} style={inp()}/></FG>
              <FG label={t.site+" *"}><select value={f.site} onChange={e=>up("site",e.target.value)} style={inp({padding:"0 10px"})}>
                <option value="">{t.selectioner}</option>{projSites.map(s=><option key={s}>{s}</option>)}
              </select></FG>
              <FG label={t.projet}><select value={f.proj} onChange={e=>{up("proj",e.target.value);up("site","");}} style={inp({padding:"0 10px"})}>
                <option value="">{t.selectioner}</option>{projList.map(p=><option key={p.id} value={p.id}>{p.nom}</option>)}
              </select></FG>
              <FG label={t.montantOcr}><input value={ocrData?.total||""} readOnly style={inp({background:"#f8f9fc",color:MUT})}/></FG>
              <FG label={t.montantReel}><input type="number" value={f.montantReel} onChange={e=>up("montantReel",e.target.value)} placeholder="Saisir si différent de l'OCR" style={inp()}/></FG>
              <FG label={t.confidentiel}><label style={{display:"flex",alignItems:"center",gap:8,marginTop:6,cursor:"pointer"}}>
                <input type="checkbox" checked={f.conf} onChange={e=>up("conf",e.target.checked)}/><span style={{fontSize:13}}>{t.marquerConf}</span>
              </label></FG>
              <FG label={t.notes} span={2}><textarea value={f.notes} onChange={e=>up("notes",e.target.value)} rows={2} style={{...inp(),resize:"vertical",fontFamily:"inherit"}}/></FG>
            </div>
            {internalFields.length>0&&(
              <div style={{marginTop:16,paddingTop:16,borderTop:`1px solid ${BD}`}}>
                <div style={{fontSize:12,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".06em",marginBottom:12}}>{t.champsCompl}</div>
                <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr",gap:12}}>
                  {internalFields.map(ch=>(
                    <FG key={ch.id} label={ch.etiquette+(ch.requis?" *":"")} span={ch.type==="fichier"||ch.type==="texte"?2:1}>
                      {ch.type==="texte"&&<input value={dynVals[ch.id]||""} onChange={e=>setDyn(ch.id,e.target.value)} style={inp()}/>}
                      {ch.type==="date"&&<input type="date" value={dynVals[ch.id]||""} onChange={e=>setDyn(ch.id,e.target.value)} style={inp()}/>}
                      {ch.type==="case"&&<label style={{display:"flex",gap:8,alignItems:"center",marginTop:6}}><input type="checkbox" checked={!!dynVals[ch.id]} onChange={e=>setDyn(ch.id,e.target.checked)}/><span style={{fontSize:13}}>{ch.etiquette}</span></label>}
                      {ch.type==="liste"&&<select value={dynVals[ch.id]||""} onChange={e=>setDyn(ch.id,e.target.value)} style={inp({padding:"0 10px"})}><option value="">— Sélectionner —</option>{(ch.items||[]).map(it=><option key={it}>{it}</option>)}</select>}
                      {ch.type==="fichier"&&(
                        <div style={{marginTop:4}}>
                          <label style={{display:"flex",alignItems:"center",gap:8,padding:"9px 14px",border:"1.5px dashed #a5b4fc",borderRadius:8,cursor:"pointer",background:"#f5f3ff",color:"#6d28d9",fontSize:12.5,fontWeight:600,width:"fit-content"}}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                            Ajouter des fichiers
                            <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.odt,.ods" style={{display:"none"}} onChange={e=>addDynFiles(ch.id,e.target.files)}/>
                          </label>
                          {(dynFiles[ch.id]||[]).length===0&&<div style={{fontSize:11,color:"#94a3b8",marginTop:6}}>Aucun fichier ajouté</div>}
                          <div style={{marginTop:6,display:"flex",flexDirection:"column",gap:4}}>
                            {(dynFiles[ch.id]||[]).map((fi,idx)=>(
                              <div key={idx} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 10px",background:"#f0fdf4",border:"1px solid #86efac",borderRadius:6,fontSize:12}}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{fi.nom}</span>
                                <span style={{color:"#94a3b8",fontSize:10}}>{fi.size}</span>
                                <button onClick={()=>removeDynFile(ch.id,idx)} style={{background:"none",border:"none",cursor:"pointer",color:"#ef4444",display:"flex",padding:2,borderRadius:4}} type="button">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </FG>
                  ))}
                </div>
              </div>
            )}
            <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:16}}>
              <button onClick={()=>setStep(0)} style={btn("light",true)}>{t.precedent}</button>
              <button onClick={()=>setStep(2)} disabled={!f.site} style={btn("primary",false,false)}>{t.suivant}</button>
            </div>
          </div>
        )}

        {/* STEP 2: Pièces jointes multi */}
        {step===2&&(
          <div>
            <div style={{marginBottom:12,fontSize:14,fontWeight:600,color:"#212529"}}>📎 Pièces jointes</div>
            <p style={{fontSize:12,color:MUT,marginBottom:16}}>Ajoutez autant de pièces que nécessaire. Maximum <b>{MAX_FILE_MB} Mo par fichier</b>.</p>
            <div onClick={()=>fileRef.current?.click()}
              style={{border:`2px dashed ${BD}`,borderRadius:RSm,padding:"28px 16px",textAlign:"center",cursor:"pointer",transition:"all .15s",marginBottom:16}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=P;e.currentTarget.style.background="#f0f4ff";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=BD;e.currentTarget.style.background="transparent";}}>
              <div style={{color:P,display:"flex",justifyContent:"center",marginBottom:8}}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              </div>
              <div style={{fontSize:13,fontWeight:600,color:"#212529"}}>+ Ajouter des fichiers</div>
              <div style={{fontSize:11,color:MUT,marginTop:4}}>PDF, JPEG, PNG, DOCX, XLSX… · Max {MAX_FILE_MB} Mo/fichier</div>
            </div>
            <input ref={fileRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.odt,.ods" style={{display:"none"}} onChange={handleFiles}/>
            {fileError&&<div style={{background:"#fff5f5",border:"1px solid #fca5a5",borderRadius:RSm,padding:"8px 12px",marginBottom:12,fontSize:12,color:"#dc2626"}}>⚠️ {fileError}</div>}
            {anx.map((a,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",background:"#f8f9fc",borderRadius:RSm,marginBottom:6,border:`1px solid ${BD}`}}>
                <span style={{color:SUC,display:"flex",flexShrink:0}}>📄</span>
                <span style={{flex:1,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.nom}</span>
                <span style={{fontSize:11,color:MUT,flexShrink:0}}>{a.size}</span>
                <button onClick={()=>setAnx(p=>p.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:"#dc3545",cursor:"pointer",padding:"2px 6px"}}>✕</button>
              </div>
            ))}
            {anx.length===0&&<div style={{textAlign:"center",padding:"8px 0",color:MUT,fontSize:13}}>Aucune pièce ajoutée (optionnel)</div>}
            <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:16}}>
              <button onClick={()=>setStep(1)} style={btn("light",true)}>{t.precedent}</button>
              <button onClick={()=>setStep(3)} style={btn("primary")}>{t.suivant}</button>
            </div>
          </div>
        )}

        {/* STEP 3: Confirmation */}
        {step===3&&(
          <div>
            <div style={{background:"#fffbeb",border:"1px solid #fcd34d",borderRadius:RSm,padding:"10px 14px",marginBottom:16,fontSize:13,color:"#92400e"}}>
              ⚠️ <b>Type de document</b> : sera affecté par le receveur après accusé de réception
            </div>
            <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr",gap:10,marginBottom:20}}>
              {[["Émetteur",autoEmetteur],["Catégorie",isFourn?"Fournisseur":"Interne"],["Projet",projList.find(p=>p.id===f.proj)?.nom||"—"],["Site",f.site||"—"],["Montant OCR",fmtN(parseFloat(ocrData?.total||"0"))],["Montant réel",f.montantReel?fmtN(parseFloat(f.montantReel)):"= OCR"],["Confidentiel",f.conf?"Oui 🔒":"Non"],["Pièces",anx.length+" fichier(s)"]].map(([l,v])=>(
                <div key={l} style={{background:"#f8f9fc",borderRadius:RSm,padding:"10px 12px"}}>
                  <div style={{fontSize:11,color:MUT,fontWeight:600,textTransform:"uppercase",marginBottom:2}}>{l}</div>
                  <div style={{fontSize:13,fontWeight:600,color:"#212529"}}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
              <button onClick={()=>setStep(2)} style={btn("light",true)}>{t.precedent}</button>
              <button onClick={finalizeDeposit} style={btn("success")}>
                <span style={{display:"inline-flex",alignItems:"center",gap:6}}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>{t.confirmerDepot}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
