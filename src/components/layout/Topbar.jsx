"use client";
import{useState}from"react";
import{IC}from"../ui/Icons";
import{useApp}from"../../context/AppContext";
import{DOC_MENUS}from"../../lib/data";
import{P,WH,BD,DNG,DNGL,DNGD,bdg,btn,RSm,TR,MUT}from"../../lib/theme";
import{useT}from"../../lib/i18n";

const VIEW_LABELS={
  dashboard:"Tableau de bord",depot:"Déposer un document",suivi:"Suivi document",
  detail:"Détail document",liq:"Liquidations",paiements:"Paiements XML",
  users:"Utilisateurs & droits",param_types:"Types de documents",param_recv:"Receveurs",
  champs_dyn:"Champs dynamiques globaux",etats:"États & Rapports",dashboard_stats:"Stats & KPIs",
};
DOC_MENUS.forEach(m=>{VIEW_LABELS[m.id]=m.label;});

const FLAG={fr:"🇫🇷",en:"🇬🇧"};
const LANG_LABEL={fr:"FR",en:"EN"};

export function Topbar(){
  const{view,setView,setSidebarOpen,sidebarOpen,docs,lang,changeLang,authUser,logout}=useApp();
  const t=useT(lang);
  const[notifOpen,setNotifOpen]=useState(false);
  const[langOpen,setLangOpen]=useState(false);
  const retards=docs.filter(d=>d.st==="EN RETARD").length;

  const crumbs=[{l:t.dashboard,v:"dashboard"}];
  const docMenu=DOC_MENUS.find(m=>m.id===view);
  if(docMenu)     {crumbs.push({l:t.documents,v:null},{l:docMenu.label,v:null});}
  else if(view==="liq"||view==="paiements"){crumbs.push({l:t.financier,v:null},{l:VIEW_LABELS[view],v:null});}
  else if(["users","param_types","param_recv","champs_dyn"].includes(view)){crumbs.push({l:t.parametrage,v:null},{l:VIEW_LABELS[view]||t.champsDyn,v:null});}
  else if(view==="etats"||view==="dashboard_stats"){crumbs.push({l:t.etatsRapports,v:null},{l:VIEW_LABELS[view]||"Stats & KPIs",v:null});}
  else if(view!=="dashboard"){crumbs.push({l:VIEW_LABELS[view]||view,v:null});}

  return(
    <header>
      {/* Top navbar */}
      <div style={{background:WH,borderBottom:`1px solid ${BD}`,height:56,display:"flex",alignItems:"center",padding:"0 20px",gap:12,flexShrink:0,boxShadow:"0 1px 0 rgba(0,0,0,.05)"}}>
        {/* Sidebar toggle */}
        <button onClick={()=>setSidebarOpen(!sidebarOpen)}
          style={{background:"none",border:"none",color:MUT,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",width:32,height:32,borderRadius:4,transition:TR}}
          onMouseEnter={e=>e.currentTarget.style.background="#f0f2f5"}
          onMouseLeave={e=>e.currentTarget.style.background="none"}>
          <span style={{display:"flex"}}>{IC.menu}</span>
        </button>

        {/* Search */}
        <div style={{flex:1,maxWidth:340}}>
          <div style={{position:"relative"}}>
            <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#adb5bd",display:"flex"}}>{IC.search}</span>
            <input placeholder={lang==="en"?"Search document, reference…":"Rechercher document, référence…"}
              style={{width:"100%",border:"1px solid #e3e6ea",borderRadius:20,padding:"7px 12px 7px 34px",fontSize:13,outline:"none",background:"#f8f9fc",color:"#495057"}}/>
          </div>
        </div>

        <div style={{display:"flex",alignItems:"center",gap:8,marginLeft:"auto"}}>
          {/* Retards alert */}
          {retards>0&&(
            <span style={{...bdg(DNGL,DNGD,{fontSize:12}),display:"inline-flex",alignItems:"center",gap:4}}>
              <span style={{display:"flex"}}>{IC.alertTri}</span> {retards} retard{retards>1?"s":""}
            </span>
          )}

          {/* Language toggle */}
          <div style={{position:"relative"}}>
            <button onClick={()=>setLangOpen(p=>!p)}
              style={{display:"inline-flex",alignItems:"center",gap:5,padding:"6px 12px",borderRadius:RSm,border:`1px solid ${BD}`,background:"#f8f9fc",cursor:"pointer",fontSize:12.5,fontWeight:700,color:P,fontFamily:"inherit",transition:TR}}
              onMouseEnter={e=>e.currentTarget.style.background="#eef1f8"}
              onMouseLeave={e=>{if(!langOpen)e.currentTarget.style.background="#f8f9fc";}}>
              <span style={{fontSize:15}}>{FLAG[lang]}</span> {LANG_LABEL[lang]}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft:1}}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {langOpen&&(
              <div style={{position:"absolute",right:0,top:38,background:WH,border:`1px solid ${BD}`,borderRadius:6,boxShadow:"0 4px 16px rgba(0,0,0,.1)",zIndex:999,overflow:"hidden",minWidth:120}}>
                {["fr","en"].map(l=>(
                  <button key={l} onClick={()=>{changeLang(l);setLangOpen(false);}}
                    style={{display:"flex",alignItems:"center",gap:8,padding:"9px 14px",background:lang===l?"#eef1f8":"transparent",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:lang===l?700:400,color:lang===l?P:"#495057",width:"100%",textAlign:"left"}}>
                    <span style={{fontSize:16}}>{FLAG[l]}</span>
                    {l==="fr"?"Français":"English"}
                    {lang===l&&<span style={{marginLeft:"auto",display:"flex",color:P}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Supplier portal link */}
          <a href="/fournisseur" target="_blank" rel="noopener noreferrer"
            style={{display:"inline-flex",alignItems:"center",gap:6,padding:"7px 13px",borderRadius:RSm,border:`1px solid ${BD}`,background:"#f8f9fc",color:MUT,fontSize:12,fontWeight:600,textDecoration:"none",transition:TR,whiteSpace:"nowrap"}}
            onMouseEnter={e=>{e.currentTarget.style.background="#eef1f8";e.currentTarget.style.color=P;e.currentTarget.style.borderColor=P+"88";}}
            onMouseLeave={e=>{e.currentTarget.style.background="#f8f9fc";e.currentTarget.style.color=MUT;e.currentTarget.style.borderColor=BD;}}>
            <span style={{display:"flex"}}>{IC.building}</span> {lang==="en"?"Supplier Portal ↗":"Portail fournisseurs ↗"}
          </a>

          {/* Quick deposit */}
          <button onClick={()=>setView("depot")} style={btn("primary",true)}>
            <span style={{display:"flex"}}>{IC.upload}</span> {lang==="en"?"Upload":"Déposer"}
          </button>

          {/* Notifications */}
          <div style={{position:"relative"}}>
            <button onClick={()=>setNotifOpen(!notifOpen)}
              style={{background:"#f8f9fc",border:`1px solid ${BD}`,color:MUT,width:36,height:36,borderRadius:RSm,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
              <span style={{display:"flex"}}>{IC.bell}</span>
              <span style={{position:"absolute",top:8,right:8,width:7,height:7,background:DNG,borderRadius:"50%"}}/>
            </button>
            {notifOpen&&(
              <div style={{position:"absolute",right:0,top:42,width:320,background:WH,borderRadius:6,boxShadow:"0 8px 24px rgba(0,0,0,.12)",border:`1px solid ${BD}`,zIndex:999}}>
                <div style={{padding:"10px 16px",borderBottom:`1px solid ${BD}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <b style={{fontSize:13,color:"#212529"}}>{lang==="en"?"Notifications":"Notifications"}</b>
                  <button onClick={()=>setNotifOpen(false)} style={{background:"none",border:"none",cursor:"pointer",color:MUT,display:"flex"}}>{IC.x}</button>
                </div>
                {[
                  {m:"DOC-2025-004 — Délai dépassé, escalade envoyée",warn:true,t:"2h"},
                  {m:"Nouveau dépôt: TELMA SA reçu",warn:false,t:"4h"},
                  {m:"DOC-2025-003 en attente validation",warn:false,t:"1j"},
                ].map((n,i)=>(
                  <div key={i} style={{padding:"10px 16px",borderBottom:`1px solid ${BD}`,background:n.warn?"#fff8f8":WH,display:"flex",gap:10,alignItems:"flex-start"}}>
                    <span style={{display:"flex",color:n.warn?DNG:P,marginTop:2}}>{n.warn?IC.alertTri:IC.bell}</span>
                    <div>
                      <div style={{fontSize:13,color:"#212529"}}>{n.m}</div>
                      <div style={{fontSize:11,color:MUT}}>Il y a {n.t}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Auth user + logout */}
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <div style={{display:"flex",alignItems:"center",gap:8,padding:"5px 10px",borderRadius:RSm,border:`1px solid ${BD}`,transition:TR}}
              onMouseEnter={e=>e.currentTarget.style.background="#f8f9fc"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{width:28,height:28,borderRadius:"50%",background:P,color:WH,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:11}}>
                {authUser?.init||"?"}
              </div>
              <div style={{lineHeight:1.2}}>
                <div style={{fontSize:12,fontWeight:600,color:"#212529",maxWidth:110,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{authUser?.nom||"Admin"}</div>
                <div style={{fontSize:10.5,color:MUT}}>{authUser?.role||"Admin"}</div>
              </div>
            </div>
            <button onClick={logout} title={lang==="en"?"Sign out":"Déconnexion"}
              style={{background:"none",border:`1px solid ${BD}`,borderRadius:RSm,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:MUT,transition:TR}}
              onMouseEnter={e=>{e.currentTarget.style.background="#fff0f0";e.currentTarget.style.color="#dc3545";e.currentTarget.style.borderColor="#dc3545";}}
              onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color=MUT;e.currentTarget.style.borderColor=BD;}}>
              {IC.logout}
            </button>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={{background:"#f8f9fc",borderBottom:`1px solid ${BD}`,padding:"7px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12.5,color:MUT}}>
          {crumbs.map((c,i)=>(
            <span key={i} style={{display:"flex",alignItems:"center",gap:6}}>
              {i>0&&<span style={{color:"#ced4da"}}>›</span>}
              {c.v?(
                <span style={{display:"inline-flex",alignItems:"center",gap:4,color:P,cursor:"pointer",fontWeight:500}} onClick={()=>setView(c.v)}>
                  {i===0&&<span style={{display:"flex"}}>{IC.home}</span>} {c.l}
                </span>
              ):(
                <span style={{color:"#495057"}}>{c.l}</span>
              )}
            </span>
          ))}
        </div>
        <div style={{display:"flex",gap:6}}>
          <span style={{...bdg("#eef1f8",P,{fontSize:11}),display:"inline-flex",alignItems:"center",gap:4}}>
            <span style={{display:"flex"}}>{IC.file}</span> {docs.length} docs
          </span>
          <span style={{...bdg("ffffffcd","#856404",{fontSize:11}),display:"inline-flex",alignItems:"center",gap:4,background:"#fff3cd"}}>
            <span style={{display:"flex"}}>{IC.clock}</span> {docs.filter(d=>["EN VALIDATION","EN RETARD"].includes(d.st)).length} {lang==="en"?"in progress":"en cours"}
          </span>
          {retards>0&&(
            <span style={{...bdg("#f8d7da","#721c24",{fontSize:11}),display:"inline-flex",alignItems:"center",gap:4}}>
              <span style={{display:"flex"}}>{IC.alertTri}</span> {retards} {lang==="en"?"overdue":"en retard"}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
