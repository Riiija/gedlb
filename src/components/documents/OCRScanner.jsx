"use client";
import{useState,useRef,useEffect}from"react";
import{IC}from"../ui/Icons";
import{card,btn,inp,P,PXl,PLt,WH,BD,MUT,SUC,WRN,DNG,RSm,RLg,TR}from"../../lib/theme";
import{ocrSim,fmtN}from"../../lib/utils";

export function OCRScanner({fid,onDone,onSkip}){
  const[phase,setPhase]=useState("upload");
  const[prog,setProg]=useState(0);
  const[data,setData]=useState(null);
  const[fname,setFname]=useState("");
  const[editing,setEditing]=useState(false);
  const[edited,setEdited]=useState({});
  const fileRef=useRef();
  const[mi,setMi]=useState(0);
  const msgs=["Analyse format document...","Détection zones texte...","Extraction numéro...","Lecture montants HT/TVA/TTC...","Vérification NIF...","Validation IBAN (Luhn)...","Calcul score de confiance...","Contrôle anti-doublon..."];

  useEffect(()=>{
    if(phase==="scanning"){
      const t=setInterval(()=>setMi(p=>(p+1)%msgs.length),500);
      return()=>clearInterval(t);
    }
  },[phase]);

  const startScan=name=>{
    setFname(name);setPhase("scanning");setProg(0);
    const iv=setInterval(()=>setProg(p=>{
      if(p>=100){clearInterval(iv);const d=ocrSim(fid);setData(d);setEdited(d);setPhase("done");return 100;}
      return p+3;
    }),50);
  };

  const qc=s=>s>=85?SUC:s>=70?WRN:DNG;

  const FIELDS=[
    {k:"numero",l:"N° Document",c:98},{k:"date_doc",l:"Date document",c:95},{k:"emetteur",l:"Émetteur",c:94},
    {k:"nif",l:"NIF",c:97},{k:"ht",l:"Montant HT (Ar)",c:(data?.score||0)>=80?91:60},
    {k:"tva",l:"TVA 20%",c:(data?.score||0)>=80?88:52},{k:"total",l:"Total TTC",c:(data?.score||0)>=80?93:64},{k:"iban",l:"IBAN",c:96},
  ];

  if(phase==="upload")return(
    <div>
      <div onClick={()=>fileRef.current?.click()}
        style={{border:`2px dashed ${P}55`,borderRadius:RLg,padding:"36px 24px",textAlign:"center",background:"#f8f9fb",cursor:"pointer",transition:TR}}
        onMouseEnter={e=>{e.currentTarget.style.borderColor=P;e.currentTarget.style.background="#f0f4ff";}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor=`${P}55`;e.currentTarget.style.background="#f8f9fb";}}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:12,color:P,opacity:.6}}>
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="12" y1="12" x2="12" y2="18"/>
            <polyline points="9 15 12 18 15 15"/>
          </svg>
        </div>
        <div style={{fontWeight:700,fontSize:15,color:P,marginBottom:6}}>Glissez-déposez votre document</div>
        <div style={{fontSize:13,color:MUT,marginBottom:16}}>PDF · DOCX · TIFF · JPEG · PNG — Max 20 Mo</div>
        <button style={btn("primary")} onClick={e=>{e.stopPropagation();fileRef.current?.click();}}>
          <span style={{display:"flex"}}>{IC.upload}</span> Parcourir les fichiers
        </button>
        <input ref={fileRef} type="file" accept=".pdf,.docx,.tiff,.jpg,.jpeg,.png" style={{display:"none"}}
          onChange={e=>{const fl=e.target.files[0];if(fl)startScan(fl.name);}}/>
      </div>
      <div style={{textAlign:"right",marginTop:10}}>
        <button style={btn("light",true)} onClick={onSkip}>Saisie manuelle sans OCR →</button>
      </div>
    </div>
  );

  if(phase==="scanning")return(
    <div style={{textAlign:"center",padding:"32px 0"}}>
      {/* Animated scan box */}
      <div style={{position:"relative",width:110,height:140,margin:"0 auto 20px",borderRadius:6,background:"#1e293b",overflow:"hidden",border:`2px solid ${P}55`}}>
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(255,255,255,.3)"}}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
        </div>
        <div style={{position:"absolute",left:0,right:0,height:3,background:`linear-gradient(90deg,transparent,${P},transparent)`,animation:"scan 1.4s linear infinite",boxShadow:`0 0 12px ${P}`}}/>
      </div>
      <div style={{fontWeight:700,fontSize:15,color:P,marginBottom:6}}>Analyse OCR en cours…</div>
      <div style={{fontSize:12,color:MUT,marginBottom:20,animation:"pulse 1s ease infinite",minHeight:18}}>{msgs[mi]}</div>
      <div style={{maxWidth:360,margin:"0 auto"}}>
        <div style={{background:"#e9ecef",borderRadius:4,height:8,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${prog}%`,background:P,transition:"width .1s linear",borderRadius:4}}/>
        </div>
        <div style={{fontSize:12,color:MUT,marginTop:6}}>{prog}%</div>
      </div>
    </div>
  );

  if(phase==="done"&&data)return(
    <div>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:38,height:38,borderRadius:6,background:qc(data.score)+"22",display:"flex",alignItems:"center",justifyContent:"center",color:qc(data.score)}}>
            <span style={{display:"flex"}}>{IC.robot}</span>
          </div>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:"#212529"}}>OCR terminé — Score de confiance</div>
            <div style={{fontSize:11,color:MUT}}>{fname}</div>
          </div>
        </div>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:26,fontWeight:800,color:qc(data.score)}}>{data.score}%</div>
          <div style={{fontSize:10,color:MUT}}>Confiance</div>
        </div>
      </div>

      {/* Fields grid */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
        {FIELDS.map(f=>(
          <div key={f.k} style={{background:"#f8f9fc",borderRadius:4,padding:"10px 12px",border:`1px solid #e3e6ea`}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{fontSize:10,fontWeight:700,color:"#6c757d",textTransform:"uppercase"}}>{f.l}</span>
              <span style={{fontSize:10,fontWeight:700,color:qc(f.c)}}>{f.c}%</span>
            </div>
            {editing?(
              <input value={edited[f.k]||""} onChange={e=>setEdited(p=>({...p,[f.k]:e.target.value}))}
                style={{...inp({fontSize:12,padding:"4px 8px"})}}/>
            ):(
              <div style={{fontSize:13,fontWeight:600,color:"#212529"}}>{data[f.k]||"—"}</div>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
        {editing?(
          <>
            <button onClick={()=>{setData({...data,...edited});setEditing(false);}} style={btn("success",true)}>
              <span style={{display:"flex"}}>{IC.chk}</span> Enregistrer
            </button>
            <button onClick={()=>setEditing(false)} style={btn("light",true)}>Annuler</button>
          </>
        ):(
          <button onClick={()=>setEditing(true)} style={btn("light",true)}>
            <span style={{display:"flex"}}>{IC.edit}</span> Corriger les champs
          </button>
        )}
        <button onClick={()=>onDone(data)} style={btn("primary")}>Utiliser ces données →</button>
      </div>
    </div>
  );

  return null;
}
