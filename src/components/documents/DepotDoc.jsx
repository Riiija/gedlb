"use client";
import{useState}from"react";
import{OCRScanner}from"./OCRScanner";
import{Modal}from"../ui/Modal";
import{IC}from"../ui/Icons";
import{FG}from"../ui/FormGroup";
import{card,btn,inp,sel,lbl,bdg,P,WH,BD,BG,MUT,SUC,SUCL,SUCD,RSm,R,TR}from"../../lib/theme";
import{PROJETS,ALL_SITES,FOURNISSEURS,INIT_TYPES,filterDocsByMenu}from"../../lib/data";
import{gid,now,mkEtapes,fmtN}from"../../lib/utils";
import{useApp}from"../../context/AppContext";

const STEPS=["1. Scan OCR","2. Informations","3. Annexes","4. Confirmation"];

export function DepotDoc({onDeposit}){
  const{types,setView}=useApp();
  const[step,setStep]=useState(0);
  const[ocrData,setOcrData]=useState(null);
  const[f,setF]=useState({
    tid:"DT001",cat:"fournisseur",fid:"F001",proj:"",site:"",
    date:new Date().toISOString().slice(0,10),conf:false,
    exped:"Fournisseur",notes:"",mtR:"",montantReel:"",
  });
  const[anx,setAnx]=useState([]);
  const[done,setDone]=useState(false);

  const projSites=PROJETS.find(p=>p.id===f.proj)?.sites||ALL_SITES;
  const fourn=FOURNISSEURS.find(x=>x.id===f.fid)||FOURNISSEURS[0];
  const type=types.find(t=>t.id===f.tid)||types[0];

  const up=(k,v)=>setF(p=>({...p,[k]:v}));

  function finalizeDeposit(){
    const mt=parseFloat((f.mtR||ocrData?.total||"0").toString().replace(/\s/g,""))||0;
    const mtR=parseFloat((f.montantReel||f.mtR||ocrData?.total||"0").toString().replace(/\s/g,""))||0;
    const doc={
      id:gid("DOC"),type:type?.nom||"Facture",tid:f.tid,cat:f.cat,
      fourn:fourn.nom,fid:f.fid,proj:f.proj,site:f.site,
      mt,mtR:mtR||mt,date:f.date,st:"REÇU",conf:f.conf,
      ocr:ocrData?ocrData.score:0,motif:"",exped:f.exped,notes:f.notes,
      bap:false,cloture:false,AR:false,affP:false,linked:false,refus:null,
      ch:ocrData||{numero:"",date_doc:"",ht:"",tva:"",total:"",nif:"",iban:"",emetteur:fourn.nom,score:0},
      anx:[...anx],
      etapes:mkEtapes(type),
    };
    onDeposit(doc);
    setDone(true);
  }

  if(done)return(
    <div style={{...card(),padding:40,textAlign:"center",maxWidth:480,margin:"40px auto"}}>
      <div style={{display:"flex",justifyContent:"center",marginBottom:16,color:"#28a745"}}><svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
      <h3 style={{fontSize:18,fontWeight:700,color:"#212529",marginBottom:8}}>Document déposé avec succès</h3>
      <p style={{color:MUT,marginBottom:24,fontSize:13}}>Le document a été soumis au circuit de validation.</p>
      <div style={{display:"flex",gap:10,justifyContent:"center"}}>
        <button onClick={()=>{setStep(0);setDone(false);setOcrData(null);setF({tid:"DT001",cat:"fournisseur",fid:"F001",proj:"",site:"",date:new Date().toISOString().slice(0,10),conf:false,exped:"Fournisseur",notes:"",mtR:"",montantReel:""});}} style={btn("light",true)}>Nouveau dépôt</button>
        <button onClick={()=>setView("en-cours")} style={btn("primary",true)}>Voir les documents →</button>
      </div>
    </div>
  );

  return(
    <div style={{maxWidth:780,margin:"0 auto",animation:"fadeIn .2s ease"}}>
      <h2 style={{fontSize:18,fontWeight:700,color:"#212529",marginBottom:20}}>Déposer un document</h2>

      {/* Stepper */}
      <div style={{display:"flex",marginBottom:24,gap:0}}>
        {STEPS.map((s,i)=>(
          <div key={i} style={{flex:1,display:"flex",alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,flex:1}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:i<step?SUC:i===step?P:"#e9ecef",color:i<=step?"#fff":"#6c757d",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0}}>
                {i<step?"✓":i+1}
              </div>
              <span style={{fontSize:12.5,fontWeight:i===step?600:400,color:i===step?"#212529":i<step?SUC:"#6c757d",whiteSpace:"nowrap"}}>{s}</span>
            </div>
            {i<STEPS.length-1&&<div style={{flex:1,height:2,background:i<step?SUC:"#e9ecef",margin:"0 8px",minWidth:20}}/>}
          </div>
        ))}
      </div>

      <div style={{...card(),padding:24}}>
        {/* STEP 0: OCR */}
        {step===0&&<OCRScanner fid={f.fid} onDone={d=>{setOcrData(d);setStep(1);}} onSkip={()=>setStep(1)}/>}

        {/* STEP 1: Infos */}
        {step===1&&(
          <div>
            {ocrData&&(
              <div style={{background:"#f0f7ff",border:"1px solid #b3d4f5",borderRadius:RSm,padding:"10px 14px",marginBottom:16,fontSize:13,color:"#0c5460"}}>
                <span style={{display:"inline-flex",alignItems:"center",gap:6}}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> OCR terminé · Score {ocrData.score}% · Montant extrait : <b>{fmtN(parseFloat(ocrData.total))}</b></span>
              </div>
            )}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <FG label="Type de document" req><select value={f.tid} onChange={e=>up("tid",e.target.value)} style={sel()}>{types.map(t=><option key={t.id} value={t.id}>{t.icone} {t.nom}</option>)}</select></FG>
              <FG label="Catégorie"><select value={f.cat} onChange={e=>up("cat",e.target.value)} style={sel()}><option value="fournisseur">Fournisseur</option><option value="confidentiel">Confidentiel</option><option value="interne">Interne</option></select></FG>
              <FG label="Fournisseur" req><select value={f.fid} onChange={e=>up("fid",e.target.value)} style={sel()}>{FOURNISSEURS.map(f=><option key={f.id} value={f.id}>{f.nom}</option>)}</select></FG>
              <FG label="Date"><input type="date" value={f.date} onChange={e=>up("date",e.target.value)} style={inp()}/></FG>
              <FG label="Projet"><select value={f.proj} onChange={e=>{up("proj",e.target.value);up("site","");}} style={sel()}><option value="">— Sélectionner —</option>{PROJETS.map(p=><option key={p.id} value={p.id}>{p.nom}</option>)}</select></FG>
              <FG label="Site" req><select value={f.site} onChange={e=>up("site",e.target.value)} style={sel()}><option value="">— Sélectionner —</option>{projSites.map(s=><option key={s}>{s}</option>)}</select></FG>
              <FG label="Montant (OCR)"><input value={ocrData?.total||""} readOnly style={inp({background:"#f8f9fc",color:MUT})}/></FG>
              <FG label="Montant réel (si correction)"><input type="number" value={f.montantReel} onChange={e=>up("montantReel",e.target.value)} placeholder="Saisir si différent de l'OCR" style={inp()}/></FG>
              <FG label="Expéditeur"><select value={f.exped} onChange={e=>up("exped",e.target.value)} style={sel()}><option>Fournisseur</option><option>Interne</option><option>Courrier</option></select></FG>
              <FG label="Confidentiel"><label style={{display:"flex",alignItems:"center",gap:8,marginTop:6}}><input type="checkbox" checked={f.conf} onChange={e=>up("conf",e.target.checked)}/><span style={{fontSize:13}}>Marquer comme confidentiel</span></label></FG>
              <FG label="Notes" span={2}><textarea value={f.notes} onChange={e=>up("notes",e.target.value)} rows={2} style={{...inp(),resize:"vertical",fontFamily:"inherit"}}/></FG>
            </div>
            <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:8}}>
              <button onClick={()=>setStep(0)} style={btn("light",true)}>← Retour</button>
              <button onClick={()=>setStep(2)} disabled={!f.site} style={btn("primary",false,false)}>Suivant →</button>
            </div>
          </div>
        )}

        {/* STEP 2: Annexes */}
        {step===2&&(
          <div>
            <div style={{marginBottom:16,fontSize:13,color:"#495057"}}>Ajoutez les pièces jointes requises :</div>
            {["Bon de commande","Bordereau de livraison","Devis approuvé","Attestation"].map(a=>(
              <div key={a} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${BD}`}}>
                <input type="checkbox" checked={anx.some(x=>x.type===a)} onChange={e=>e.target.checked?setAnx(p=>[...p,{nom:a.replace(/\s/g,"_")+".pdf",type:a,oblig:false,ok:true}]):setAnx(p=>p.filter(x=>x.type!==a))}/>
                <span style={{fontSize:13,flex:1}}>{a}</span>
                {anx.some(x=>x.type===a)&&<span style={bdg("#d4edda",SUCD,{fontSize:11})}>✓ Ajouté</span>}
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:16}}>
              <button onClick={()=>setStep(1)} style={btn("light",true)}>← Retour</button>
              <button onClick={()=>setStep(3)} style={btn("primary")}>Suivant →</button>
            </div>
          </div>
        )}

        {/* STEP 3: Confirmation */}
        {step===3&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
              {[["Type",types.find(t=>t.id===f.tid)?.nom||"—"],["Fournisseur",fourn.nom],["Projet",PROJETS.find(p=>p.id===f.proj)?.nom||"—"],["Site",f.site||"—"],["Montant OCR",fmtN(parseFloat(ocrData?.total||"0"))],["Montant réel",f.montantReel?fmtN(parseFloat(f.montantReel)):"=  OCR"],["Confidentiel",f.conf?"Oui":"Non"],["Annexes",anx.length+" fichier(s)"]].map(([l,v])=>(
                <div key={l} style={{background:"#f8f9fc",borderRadius:RSm,padding:"10px 12px"}}>
                  <div style={{fontSize:11,color:MUT,fontWeight:600,textTransform:"uppercase",marginBottom:2}}>{l}</div>
                  <div style={{fontSize:13,fontWeight:600,color:"#212529"}}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
              <button onClick={()=>setStep(2)} style={btn("light",true)}>← Retour</button>
              <button onClick={finalizeDeposit} style={btn("success")}><span style={{display:"inline-flex",alignItems:"center",gap:6}}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Confirmer le dépôt</span></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
