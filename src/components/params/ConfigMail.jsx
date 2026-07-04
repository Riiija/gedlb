"use client";
import{useState}from"react";
import{IC}from"../ui/Icons";
import{card,btn,inp,lbl,P,WH,BD,MUT,SUC,SUCL,DNG,DNGL,RSm,TR}from"../../lib/theme";
import{useApp}from"../../context/AppContext";
import{useT}from"../../lib/i18n";

export default function ConfigMail(){
  const{mailConfig,setMailConfig,lang}=useApp();
  const t=useT(lang);
  const[f,setF]=useState(mailConfig||{host:"",port:587,ssl:false,tls:true,email:"",alias:"SoftDocs GED",auth:true,username:"",password:"",testEmail:""});
  const[saved,setSaved]=useState(false);
  const[testing,setTesting]=useState(false);
  const[testResult,setTestResult]=useState(null);
  const[showPwd,setShowPwd]=useState(false);

  const up=(k,v)=>setF(p=>({...p,[k]:v}));

  function save(){
    setMailConfig(f);
    setSaved(true);
    setTimeout(()=>setSaved(false),2500);
  }

  function testMail(){
    setTesting(true);setTestResult(null);
    // Simulation — en production, appeler une API Next.js /api/test-mail
    setTimeout(()=>{
      const ok=f.host&&f.email&&f.port;
      setTestResult(ok?"success":"error");
      setTesting(false);
    },1800);
  }

  const FG=({label,children,req})=>(
    <div style={{marginBottom:16}}>
      <label style={{fontSize:11.5,fontWeight:700,color:"#495057",textTransform:"uppercase",letterSpacing:".06em",display:"block",marginBottom:5}}>
        {label}{req&&<span style={{color:DNG,marginLeft:3}}>*</span>}
      </label>
      {children}
    </div>
  );

  return(
    <div style={{maxWidth:720,animation:"fadeIn .2s ease"}}>
      <div style={{marginBottom:20}}>
        <h2 style={{fontSize:17,fontWeight:700,color:"#212529",marginBottom:3}}>Configuration SMTP</h2>
        <p style={{fontSize:12.5,color:MUT}}>Paramétrez le serveur mail pour l'envoi des notifications (alertes, validations, rejets).</p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr",gap:16}}>

        {/* Serveur */}
        <div style={{...card(),padding:20,gridColumn:"1/-1"}}>
          <div style={{fontSize:13,fontWeight:700,color:P,marginBottom:14,display:"flex",alignItems:"center",gap:6}}>
            <span style={{display:"flex"}}>{IC.mail}</span> Serveur SMTP
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr auto auto",gap:10,alignItems:"end"}}>
            <FG label="Hôte SMTP" req>
              <input value={f.host} onChange={e=>up("host",e.target.value)}
                placeholder="smtp.gmail.com" style={{...inp()}}/>
            </FG>
            <FG label="Port">
              <input type="number" value={f.port} onChange={e=>up("port",+e.target.value)}
                style={{...inp({width:90})}}/>
            </FG>
            <div style={{display:"flex",flexDirection:"column",gap:6,paddingBottom:4}}>
              <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:13}}>
                <input type="checkbox" checked={f.tls} onChange={e=>up("tls",e.target.checked)}/>
                <span>STARTTLS</span>
              </label>
              <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:13}}>
                <input type="checkbox" checked={f.ssl} onChange={e=>up("ssl",e.target.checked)}/>
                <span>SSL/TLS</span>
              </label>
            </div>
          </div>
          <div style={{fontSize:11.5,color:MUT,background:"#f8f9fc",padding:"8px 12px",borderRadius:RSm,marginTop:4}}>
            💡 Ports courants : 587 (STARTTLS), 465 (SSL), 25 (non sécurisé)
          </div>
        </div>

        {/* Expéditeur */}
        <div style={{...card(),padding:20}}>
          <div style={{fontSize:13,fontWeight:700,color:P,marginBottom:14,display:"flex",alignItems:"center",gap:6}}>
            <span style={{display:"flex"}}>{IC.mail}</span> Expéditeur
          </div>
          <FG label="Adresse email" req>
            <input type="email" value={f.email} onChange={e=>up("email",e.target.value)}
              placeholder="notifications@softdocs.mg" style={{...inp()}}/>
          </FG>
          <FG label="Alias (nom affiché)">
            <input value={f.alias} onChange={e=>up("alias",e.target.value)}
              placeholder="SoftDocs GED" style={{...inp()}}/>
          </FG>
        </div>

        {/* Authentification */}
        <div style={{...card(),padding:20}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:700,color:P,display:"flex",alignItems:"center",gap:6}}>
              <span style={{display:"flex"}}>{IC.lockKey}</span> Authentification
            </div>
            <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:13}}>
              <input type="checkbox" checked={f.auth} onChange={e=>up("auth",e.target.checked)}/>
              <span style={{fontWeight:600}}>Activée</span>
            </label>
          </div>
          {f.auth&&(
            <>
              <FG label="Nom d'utilisateur">
                <input value={f.username} onChange={e=>up("username",e.target.value)}
                  placeholder="user@domain.com" style={{...inp()}}/>
              </FG>
              <FG label="Mot de passe">
                <div style={{position:"relative"}}>
                  <input type={showPwd?"text":"password"} value={f.password} onChange={e=>up("password",e.target.value)}
                    placeholder="••••••••" style={{...inp({paddingRight:38})}}/>
                  <button type="button" onClick={()=>setShowPwd(p=>!p)}
                    style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:MUT,display:"flex"}}>
                    {showPwd
                      ?<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      :<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </FG>
            </>
          )}
        </div>

        {/* Test */}
        <div style={{...card(),padding:20,gridColumn:"1/-1"}}>
          <div style={{fontSize:13,fontWeight:700,color:P,marginBottom:14,display:"flex",alignItems:"center",gap:6}}>
            <span style={{display:"flex"}}>{IC.send}</span> Test de connexion
          </div>
          <div style={{display:"flex",gap:10,alignItems:"flex-end"}}>
            <div style={{flex:1}}>
              <label style={{fontSize:11.5,fontWeight:700,color:"#495057",textTransform:"uppercase",letterSpacing:".06em",display:"block",marginBottom:5}}>
                Email de test
              </label>
              <input type="email" value={f.testEmail} onChange={e=>up("testEmail",e.target.value)}
                placeholder="destinataire@test.com" style={{...inp()}}/>
            </div>
            <button onClick={testMail} disabled={testing||!f.host||!f.email}
              style={{...btn("primary",true),opacity:testing||!f.host||!f.email?.5:1}}>
              {testing?<><svg style={{animation:"spin .8s linear infinite"}} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 12a9 9 0 1 1-18 0"/></svg> Test…</>:<><span style={{display:"flex"}}>{IC.send}</span> Envoyer test</>}
            </button>
          </div>
          {testResult&&(
            <div style={{marginTop:12,padding:"10px 14px",borderRadius:RSm,
              background:testResult==="success"?SUCL:DNGL,
              color:testResult==="success"?"#155724":"#721c24",
              border:`1px solid ${testResult==="success"?"#c3e6cb":"#f5c6cb"}`,
              fontSize:13,fontWeight:600,display:"flex",alignItems:"center",gap:8}}>
              {testResult==="success"?"✅ Email de test envoyé avec succès !":"❌ Échec de connexion — vérifiez l'hôte, port et identifiants."}
            </div>
          )}
        </div>
      </div>

      <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:20}}>
        {saved&&<span style={{fontSize:13,color:SUC,fontWeight:600,alignSelf:"center"}}>✓ Enregistré</span>}
        <button onClick={save} style={btn("primary")}>
          <span style={{display:"flex"}}>{IC.chk}</span> Enregistrer la configuration
        </button>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}
