"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BACKOFFICE_USERS } from "../../context/AppContext";

export default function BackofficeLogin() {
  const router = useRouter();
  const [email,   setEmail]   = useState("");
  const [pwd,     setPwd]     = useState("");
  const [err,     setErr]     = useState("");
  const [show,    setShow]    = useState(false);
  const [loading, setLoading] = useState(false);

  function handleLogin(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    setTimeout(() => {
      const u = BACKOFFICE_USERS.find(u =>
        u.email?.toLowerCase() === email.toLowerCase().trim() && u.password === pwd
      );
      if (u) {
       if (u) {
  try {
    localStorage.setItem("softdocs_auth", JSON.stringify(u));
    localStorage.setItem("softdocs_currentApp", "home"); 
  } catch {}
  router.push("/backoffice");
}
      } else {
        setErr("Adresse email ou mot de passe incorrect.");
      }
      setLoading(false);
    }, 600);
  }

  const ACT  = "#324372";
  const inp  = {width:"100%",border:"1.5px solid #e3e6ea",borderRadius:7,padding:"11px 14px",fontSize:13.5,outline:"none",fontFamily:"inherit",boxSizing:"border-box"};

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(145deg,#0d1b2e 0%,#0f2544 40%,#0d1e35 70%,#091528 100%)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Plus Jakarta Sans','Inter',system-ui,sans-serif"}}>
      {/* Background grid */}
      <div style={{position:"fixed",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)",backgroundSize:"48px 48px",pointerEvents:"none"}}/>
      {/* Orbs */}
      <div style={{position:"fixed",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(50,67,114,.25) 0%,transparent 70%)",top:-150,right:-150,pointerEvents:"none"}}/>
      <div style={{position:"fixed",width:350,height:350,borderRadius:"50%",background:"radial-gradient(circle,rgba(30,202,211,.12) 0%,transparent 70%)",bottom:-80,left:100,pointerEvents:"none"}}/>

      <div style={{width:"100%",maxWidth:420,padding:"0 20px",position:"relative",zIndex:10}}>
        {/* Brand header */}
        <div style={{textAlign:"center",marginBottom:28}}>
          {/* Temporary logo - replace with your logo */}
                    <img src="/softappli-logo.png" alt="SoftAppli" style={{height:typeof window!=="undefined"&&window.innerWidth<=768?56:72,objectFit:"contain",margin:"0 auto 14px",display:"block",filter:"drop-shadow(0 4px 16px rgba(30,58,138,.2))"}}/>
          <div style={{fontSize:22,fontWeight:900,color:"#fff",letterSpacing:"-.4px",marginBottom:4}}>Soft Applications</div>
          <div style={{color:"rgba(255,255,255,.45)",fontSize:12.5}}>Plateforme multi-applicative</div>
        </div>

        <form onSubmit={handleLogin} style={{background:"#fff",borderRadius:16,padding:typeof window!=="undefined"&&window.innerWidth<=768?"20px 18px":"28px 32px",boxShadow:"0 24px 60px rgba(0,0,0,.35)"}}>
          <h2 style={{fontSize:18,fontWeight:800,color:"#212529",marginBottom:3}}>Connexion</h2>
          <p style={{fontSize:12.5,color:"#6c757d",marginBottom:22}}>Accédez à votre espace de travail</p>

          {err&&(
            <div style={{background:"#fdf2f2",border:"1px solid #f5b8b8",borderRadius:6,padding:"10px 14px",marginBottom:14,fontSize:13,color:"#c0392b",display:"flex",gap:8,alignItems:"center"}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {err}
            </div>
          )}

          <div style={{marginBottom:14}}>
            <label style={{fontSize:11.5,fontWeight:700,color:"#4a5568",textTransform:"uppercase",letterSpacing:".05em",marginBottom:6,display:"block"}}>Adresse email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
              placeholder="prenom@softwell.mg" style={inp}
              onFocus={e=>e.target.style.borderColor=ACT} onBlur={e=>e.target.style.borderColor="#e3e6ea"}
              autoComplete="username" required/>
          </div>

          <div style={{marginBottom:22}}>
            <label style={{fontSize:11.5,fontWeight:700,color:"#4a5568",textTransform:"uppercase",letterSpacing:".05em",marginBottom:6,display:"block"}}>Mot de passe</label>
            <div style={{position:"relative"}}>
              <input type={show?"text":"password"} value={pwd} onChange={e=>setPwd(e.target.value)}
                placeholder="••••••••" style={{...inp,paddingRight:42}}
                onFocus={e=>e.target.style.borderColor=ACT} onBlur={e=>e.target.style.borderColor="#e3e6ea"}
                autoComplete="current-password" required/>
              <button type="button" onClick={()=>setShow(p=>!p)}
                style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#6c757d",display:"flex"}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  {show
                    ?<><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
                    :<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                  }
                </svg>
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading||!email||!pwd}
            style={{width:"100%",padding:"12px",background:loading||!email||!pwd?"#8fa3c5":ACT,color:"#fff",border:"none",borderRadius:8,fontSize:14,fontWeight:700,cursor:loading||!email||!pwd?"not-allowed":"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"background .15s"}}>
            {loading
              ?<><svg style={{animation:"spin .8s linear infinite"}} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 12a9 9 0 1 1-18 0"/></svg>Connexion…</>
              :<>Se connecter →</>
            }
          </button>
        </form>

        <div style={{display:"flex",justifyContent:"center",gap:20,marginTop:18}}>
          <a href="/" style={{display:"inline-flex",alignItems:"center",gap:6,
            color:"rgba(255,255,255,.55)",textDecoration:"none",fontSize:12.5,fontWeight:500,
            padding:"7px 14px",borderRadius:20,border:"1px solid rgba(255,255,255,.12)",
            background:"rgba(255,255,255,.04)",transition:"all .2s"}}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.1)";e.currentTarget.style.color="#fff";}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.04)";e.currentTarget.style.color="rgba(255,255,255,.55)";}}>
            ← Portail fournisseurs
          </a>
          <a href="https://softdocs.mg" style={{display:"inline-flex",alignItems:"center",gap:6,
            color:"rgba(255,255,255,.35)",textDecoration:"none",fontSize:12.5,padding:"7px 14px",borderRadius:20}}>
            Aide & Contact
          </a>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}
