"use client";
import{useState,useEffect}from"react";
import{card,btn,inp,lbl,MUT,P,BD,WH,SUCL,SUCD,WRNL,WRND}from"../../lib/theme";
import{useApp}from"../../context/AppContext";
import{useT}from"../../lib/i18n";

const LS_KEY="softdocs_relance_template";

const DEFAULT_CC="";
const DEFAULT_OBJET="[SoftDocs] Relance — Validation en retard : {DOC_ID}";
const DEFAULT_MSG=`Bonjour,

Vous trouverez ci-joint les avances à justifier à ce jour.

Le document {DOC_ID} — {DOC_TYPE} de {FOURN} est en attente de votre validation depuis {JOURS_RETARD} jour(s).

Merci de traiter ce dossier dans les meilleurs délais.

Cordialement,
L'équipe SoftDocs`;

function Tag({text,desc}){
  return(
    <span title={desc} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:6,background:"#eff6ff",border:"1px solid #bfdbfe",fontSize:11,fontWeight:700,color:"#1d4ed8",cursor:"help",fontFamily:"monospace"}}>
      {text}
    </span>
  );
}

export default function ParamRelance(){
  const{lang,authUser}=useApp();
  const t=useT(lang);

  const[objet,setObjet]=useState(DEFAULT_OBJET);
  const[cc,setCC]=useState(DEFAULT_CC);
  const[msg,setMsg]=useState(DEFAULT_MSG);
  const[saved,setSaved]=useState(false);
  const[activeRelanceAuto,setActiveRelanceAuto]=useState(true);
  const[delaiJours,setDelaiJours]=useState(3);
  const[envoiCC,setEnvoiCC]=useState(true);

  // Load from localStorage
  useEffect(()=>{
    try{
      const d=JSON.parse(localStorage.getItem(LS_KEY)||"{}");
      if(d.objet)setObjet(d.objet);
      if(d.cc!==undefined)setCC(d.cc);
      if(d.msg)setMsg(d.msg);
      if(d.activeRelanceAuto!==undefined)setActiveRelanceAuto(d.activeRelanceAuto);
      if(d.delaiJours)setDelaiJours(d.delaiJours);
      if(d.envoiCC!==undefined)setEnvoiCC(d.envoiCC);
    }catch{}
  },[]);

  function save(){
    try{
      localStorage.setItem(LS_KEY,JSON.stringify({objet,cc,msg,activeRelanceAuto,delaiJours,envoiCC}));
    }catch{}
    setSaved(true);
    setTimeout(()=>setSaved(false),2500);
  }

  function reset(){
    setObjet(DEFAULT_OBJET);
    setCC(DEFAULT_CC);
    setMsg(DEFAULT_MSG);
    setActiveRelanceAuto(true);
    setDelaiJours(3);
    setEnvoiCC(true);
  }

  const isAdmin=authUser?.systemRole==="admin"||authUser?.systemRole==="superadmin";

  return(
    <div style={{animation:"fadeIn .2s ease",maxWidth:820}}>
      {/* Header */}
      <div style={{marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
          <div style={{width:36,height:36,borderRadius:8,background:"#fff7ed",border:"1px solid #fed7aa",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <div>
            <h2 style={{fontSize:18,fontWeight:800,color:"#1e293b",margin:0}}>{t.relanceTitle||"Modèle de relance"}</h2>
            <p style={{fontSize:12,color:MUT,margin:0}}>{t.relanceDesc||"Configurez le modèle d'email de relance automatique pour les validations en retard."}</p>
          </div>
        </div>
      </div>

      {/* Admin guard */}
      {!isAdmin&&(
        <div style={{...card(),padding:20,background:"#fff7ed",border:"1px solid #fed7aa",borderRadius:10,color:"#92400e",fontSize:13}}>
          ⚠️ Accès réservé aux administrateurs.
        </div>
      )}

      {isAdmin&&(
        <>
          {/* Auto-relance toggle card */}
          <div style={{...card(),padding:20,marginBottom:16}}>
            <div style={{fontWeight:700,fontSize:13,color:"#1e293b",marginBottom:14}}>⚙️ Paramètres de relance automatique</div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <label style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
                <div onClick={()=>setActiveRelanceAuto(p=>!p)} style={{width:40,height:22,borderRadius:11,background:activeRelanceAuto?"#16a34a":"#9ca3af",transition:"background .2s",position:"relative",flexShrink:0,cursor:"pointer"}}>
                  <div style={{position:"absolute",top:2,left:activeRelanceAuto?20:2,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.2)"}}/>
                </div>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:"#212529"}}>Relance automatique activée</div>
                  <div style={{fontSize:11,color:MUT}}>Envoie automatiquement un email aux valideurs en retard</div>
                </div>
              </label>
              <div style={{display:"flex",alignItems:"center",gap:12,paddingLeft:52}}>
                <span style={{fontSize:13,color:"#495057"}}>Déclencher après</span>
                <input type="number" value={delaiJours} onChange={e=>setDelaiJours(Math.max(1,parseInt(e.target.value)||1))}
                  style={{...inp({fontSize:13}),width:60,textAlign:"center"}} min={1} max={30}/>
                <span style={{fontSize:13,color:"#495057"}}>jour(s) de retard</span>
              </div>
              <label style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer",paddingLeft:52}}>
                <input type="checkbox" checked={envoiCC} onChange={e=>setEnvoiCC(e.target.checked)} style={{width:15,height:15,accentColor:P}}/>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:"#212529"}}>Envoyer une e-mail de relance en cas de retard du justificatif</div>
                  <div style={{fontSize:11,color:MUT}}>Les destinataires en CC recevront une copie</div>
                </div>
              </label>
            </div>
          </div>

          {/* CC field */}
          <div style={{...card(),padding:20,marginBottom:16}}>
            <div style={{fontWeight:700,fontSize:13,color:"#1e293b",marginBottom:14}}>📧 Modèle d'email</div>

            {/* CC row */}
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14,paddingBottom:14,borderBottom:`1px solid ${BD}`}}>
              <div style={{display:"flex",alignItems:"center",gap:4,minWidth:80}}>
                <input type="checkbox" checked={envoiCC} onChange={e=>setEnvoiCC(e.target.checked)} style={{width:14,height:14,accentColor:P}}/>
                <label style={{fontSize:12,fontWeight:600,color:"#495057",whiteSpace:"nowrap"}}>En copie</label>
              </div>
              <input value={cc} onChange={e=>setCC(e.target.value)}
                placeholder="email1@org.mg, email2@org.mg"
                style={{...inp({fontSize:12}),flex:1}}/>
            </div>

            {/* Objet */}
            <div style={{marginBottom:14}}>
              <label style={{...lbl,display:"block",marginBottom:4}}>Objet</label>
              <input value={objet} onChange={e=>setObjet(e.target.value)}
                style={{...inp({fontSize:13}),width:"100%",boxSizing:"border-box"}}/>
            </div>

            {/* Message */}
            <div style={{marginBottom:14}}>
              <label style={{...lbl,display:"block",marginBottom:4}}>Message</label>
              <textarea value={msg} onChange={e=>setMsg(e.target.value)}
                rows={10}
                style={{...inp({fontSize:13}),width:"100%",boxSizing:"border-box",resize:"vertical",fontFamily:"inherit",lineHeight:1.6}}/>
            </div>

            {/* Auto info banner */}
            <div style={{background:WRNL,border:`1px solid #f5d78b`,borderRadius:8,padding:"10px 14px",fontSize:12.5,color:WRND,marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {t.relanceAutoInfo||"Le premier mail de relance automatique sera envoyé à la date de fin de l'échéance."}
            </div>

            {/* Variables disponibles */}
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".06em",marginBottom:8}}>Variables disponibles</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                <Tag text="{DOC_ID}" desc="Référence du document"/>
                <Tag text="{DOC_TYPE}" desc="Type de document"/>
                <Tag text="{FOURN}" desc="Nom du fournisseur"/>
                <Tag text="{JOURS_RETARD}" desc="Nombre de jours de retard"/>
                <Tag text="{VALIDEUR}" desc="Nom du valideur concerné"/>
                <Tag text="{DATE_DEPOT}" desc="Date de dépôt du document"/>
                <Tag text="{PROJET}" desc="Nom du projet"/>
                <Tag text="{SITE}" desc="Site du document"/>
              </div>
            </div>

            {/* Buttons */}
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <button onClick={save}
                style={{display:"inline-flex",alignItems:"center",gap:6,padding:"9px 20px",borderRadius:8,border:"none",background:P,color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"inherit"}}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                {t.relanceSave||"Enregistrer le modèle"}
              </button>
              <button onClick={reset}
                style={{padding:"9px 16px",borderRadius:8,border:`1px solid ${BD}`,background:"#fff",cursor:"pointer",fontSize:13,color:MUT,fontFamily:"inherit"}}>
                Réinitialiser
              </button>
              {saved&&(
                <span style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:12.5,fontWeight:700,color:"#1d6f42",background:SUCL,padding:"5px 12px",borderRadius:8}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  {t.relanceSaved||"Modèle enregistré !"}
                </span>
              )}
            </div>
          </div>

          {/* Preview */}
          <div style={{...card(),padding:20}}>
            <div style={{fontWeight:700,fontSize:13,color:"#1e293b",marginBottom:12}}>👁 Aperçu de l'email</div>
            <div style={{border:`1px solid ${BD}`,borderRadius:8,overflow:"hidden"}}>
              <div style={{background:"#f8f9fc",padding:"10px 16px",borderBottom:`1px solid ${BD}`,fontSize:12}}>
                <div style={{marginBottom:4}}><span style={{fontWeight:700,color:MUT}}>Objet : </span><span style={{color:"#212529"}}>{objet.replace("{DOC_ID}","DOC-2025-042")}</span></div>
                {cc&&<div><span style={{fontWeight:700,color:MUT}}>CC : </span><span style={{color:"#212529"}}>{cc}</span></div>}
              </div>
              <div style={{padding:16,fontSize:13,color:"#212529",whiteSpace:"pre-wrap",lineHeight:1.7,background:"#fff"}}>
                {msg
                  .replace("{DOC_ID}","DOC-2025-042")
                  .replace("{DOC_TYPE}","Facture")
                  .replace("{FOURN}","RAMANANTSOA SA")
                  .replace("{JOURS_RETARD}","3")
                  .replace("{VALIDEUR}","Randria Marie-Claire")
                  .replace("{DATE_DEPOT}","15/01/2025")
                  .replace("{PROJET}","PROJET GEZANI")
                  .replace("{SITE}","Antananarivo")
                }
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
