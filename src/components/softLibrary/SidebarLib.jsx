"use client";
import{useState}from"react";
import{useApp}from"../../context/AppContext";

const C={primary:'#ffffff',primaryLight:'#ffffff',primaryLighter:'rgba(255, 255, 255, 0.04)',accent:'#c2410c',border:'rgba(255, 255, 255, 0.07)',borderLight:'#f1f5f9',text:'#0f172a',textSec:'rgba(255, 255, 255, 0.8)',textMut:'rgba(255, 255, 255, 0.8)',surfaceAlt:'#f8fafc'};

/* ─── SVG Icons ─── */
const ICO={
  dash:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  docs:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  box:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  empl:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  consult:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>,
  mail:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>,
  cycle:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  chart:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  inv:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></svg>,
  ged:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/><path d="M7 8h2m2 0h2m2 0h2"/><path d="M7 11h10"/></svg>,
  move:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/></svg>,
  cog:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  home:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  chevL:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>,
  chevR:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>,
  chevD:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>,
  /* Section icons */
  archive:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5" rx="1"/><line x1="10" y1="12" x2="14" y2="12"/></svg>,
  tasks:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  pilot:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  logout:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  mfp:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  equip:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="6" width="20" height="12" rx="2"/><line x1="6" y1="10" x2="6" y2="14"/><line x1="10" y1="10" x2="10" y2="14"/><circle cx="17" cy="12" r="2"/></svg>,
};

/* ─── Navigation structure — label keys map to i18n ─── */
const NAV_LABEL_KEYS={
  "lib-dashboard":"dashboard","lib-documents":"documents","lib-contenants":"contenants",
  "lib-emplacements":"emplacements","lib-mouvements":"mouvements",
  "lib-consultations":"consultations","lib-courrier":"courrier","lib-inventaire":"inventaire",
  "lib-cycle-vie":"cycleVie","lib-etat-synthese":"visionSynthetique",
  "lib-etat-gestion":"gestionDocumentaire","lib-integration-ged":"integrationGED",
  "lib-admin":"administration","lib-mfp":"equipementsMFP",
};
const SEC_LABEL_KEYS={"Archives":"secArchives","Gestion":"secGestion","Pilotage":"secPilotage","Équipements":"secEquipements"};
const NAV=[
  { id:"lib-dashboard", labelKey:"dashboard", icon:ICO.dash },
  { sectionKey:"secArchives", section:"Archives", icon:ICO.archive, children:[
    { id:"lib-documents",    labelKey:"documents",    icon:ICO.docs },
    { id:"lib-contenants",   labelKey:"contenants",   icon:ICO.box },
    { id:"lib-emplacements", labelKey:"emplacements", icon:ICO.empl },
    { id:"lib-mouvements",   labelKey:"mouvements",   icon:ICO.move },
  ]},
  { sectionKey:"secGestion", section:"Gestion", icon:ICO.tasks, children:[
    { id:"lib-consultations", labelKey:"consultations", icon:ICO.consult },
    { id:"lib-courrier",      labelKey:"courrier",      icon:ICO.mail },
    { id:"lib-inventaire",    labelKey:"inventaire",    icon:ICO.inv },
  ]},
  { sectionKey:"secPilotage", section:"Pilotage", icon:ICO.pilot, children:[
    { id:"lib-cycle-vie",      labelKey:"cycleVie",            icon:ICO.cycle },
    { id:"lib-etat-synthese",  labelKey:"visionSynthetique",   icon:ICO.chart },
    { id:"lib-etat-gestion",   labelKey:"gestionDocumentaire", icon:ICO.docs },
    { id:"lib-integration-ged",labelKey:"integrationGED",      icon:ICO.ged },
  ]},
  { sectionKey:"secEquipements", section:"Équipements", icon:ICO.equip, children:[
    { id:"lib-mfp",            labelKey:"equipementsMFP",     icon:ICO.mfp },
  ]},
  { id:"lib-admin", labelKey:"administration", icon:ICO.cog },
];

export function SidebarLib({lang,t}){
  const{view,setView,setCurrentApp,authUser}=useApp();
  const[collapsed,setCollapsed]=useState(false);
  /* Auto-expand the section that contains the active view */
  const findSection=(v)=>{
    for(const n of NAV) if(n.children&&n.children.some(c=>c.id===v)) return n.section;
    return null;
  };
  const[openSections,setOpenSections]=useState(()=>{
    const init={Archives:true,Gestion:true,Pilotage:true};
    return init;
  });
  const toggleSection=(s)=>setOpenSections(p=>({...p,[s]:!p[s]}));
  const W=collapsed?64:240;

  function goHome(){setCurrentApp("home");setView("dashboard");}
  function logout(){
    try{localStorage.removeItem("softdocs_auth");localStorage.removeItem("softdocs_currentApp");}catch{}
    window.location.href="/login";
  }

  /* ── Render a single nav item ── */
  const renderItem=(m)=>{
    const act=view===m.id;
    return(
      <button key={m.id} onClick={()=>setView(m.id)} title={collapsed?(t?.[m.labelKey]||m.labelKey):undefined}
        style={{
          width:"100%",display:"flex",alignItems:"center",gap:10,
          padding:collapsed?"9px 0":"8px 12px",
          justifyContent:collapsed?"center":"flex-start",
          borderRadius:7,border:"none",cursor:"pointer",marginBottom:1,
          background:act?"rgba(255, 255, 255, 0.04)":"transparent",
          color:act?"rgb(74, 144, 217)":C.textSec,
          fontWeight:act?700:500,fontSize:12.5,
          fontFamily:"'DM Sans',sans-serif",transition:"all .12s",
        }}
        onMouseEnter={e=>{if(!act)e.currentTarget.style.background="rgba(255, 255, 255, 0.04)";}}
        onMouseLeave={e=>{if(!act)e.currentTarget.style.background=act?C.primaryLighter:"transparent";}}>
        <div style={{width:18,height:18,flexShrink:0}}>{m.icon}</div>
        {!collapsed&&<span>{t?.[m.labelKey]||m.labelKey}</span>}
      </button>
    );
  };

  /* ── Render a collapsible section ── */
  const renderSection=(sec)=>{
    const open=openSections[sec.section];
    const hasActive=sec.children.some(c=>view===c.id);
    return(
      <div key={sec.section} style={{marginBottom:2}}>
        <button onClick={()=>collapsed?null:toggleSection(sec.section)}
          title={collapsed?(t?.[sec.sectionKey]||sec.section):undefined}
          style={{
            width:"100%",display:"flex",alignItems:"center",gap:collapsed?0:8,
            padding:collapsed?"8px 0":"7px 10px",
            justifyContent:collapsed?"center":"flex-start",
            borderRadius:7,border:"none",cursor:collapsed?"default":"pointer",marginBottom:1,
            background:"transparent",
            color:hasActive?C.primary:C.textMut,
            fontWeight:600,fontSize:10.5,letterSpacing:.6,textTransform:"uppercase",
            fontFamily:"'DM Sans',sans-serif",transition:"all .12s",
          }}
          onMouseEnter={e=>{if(!collapsed)e.currentTarget.style.background="#f8fafc";}}
          onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}>
          {!collapsed&&<div style={{width:14,height:14,transition:"transform .2s",transform:open?"rotate(0)":"rotate(-90deg)"}}>{ICO.chevD}</div>}
          {collapsed?<div style={{width:18,height:18}}>{sec.icon}</div>:
          <span>{t?.[sec.sectionKey]||sec.section}</span>}
          {!collapsed&&hasActive&&<div style={{width:6,height:6,borderRadius:3,background:C.primaryLight,marginLeft:"auto"}}/>}
        </button>
        {/* Children */}
        {!collapsed&&(
          <div style={{
            overflow:"hidden",maxHeight:open?200:0,
            transition:"max-height .25s ease",
            paddingLeft:8,
          }}>
            {sec.children.map(m=>renderItem(m))}
          </div>
        )}
        {/* Collapsed tooltip children */}
        {collapsed&&(
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:1}}>
            {sec.children.map(m=>{
              const act=view===m.id;
              return(
                <button key={m.id} onClick={()=>setView(m.id)} title={t?.[m.labelKey]||m.labelKey}
                  style={{
                    width:36,height:32,borderRadius:6,border:"none",cursor:"pointer",
                    background:act?C.primaryLighter:"transparent",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    transition:"all .12s",
                  }}
                  onMouseEnter={e=>{if(!act)e.currentTarget.style.background="#f1f5f9";}}
                  onMouseLeave={e=>{if(!act)e.currentTarget.style.background=act?C.primaryLighter:"transparent";}}>
                  <div style={{width:15,height:15,color:act?C.primary:C.textMut}}>{m.icon}</div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return(
    <aside style={{
      width:W,height:"100vh",background:"rgb(26, 38, 52)",
      borderRight:`1px solid ${C.border}`,
      display:"flex",flexDirection:"column",
      fontFamily:"'DM Sans',-apple-system,sans-serif",
      transition:"width .25s ease",overflow:"hidden",flexShrink:0,zIndex:100,
    }}>

      {/* ── Header / Logo ── */}
      <div style={{padding:collapsed?"16px 14px":"16px 18px",borderBottom:`1px solid ${C.border}`,
        display:"flex",alignItems:"center",justifyContent:"space-between",minHeight:64}}>
        <div style={{display:"flex",alignItems:"center",gap:collapsed?0:10}}>
          <div style={{width:36,height:36,borderRadius:8,flexShrink:0,
            display:"flex",alignItems:"center",justifyContent:"center",
            }}>
            <img src="/softlibrary.png" alt="Soft Library" style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain",filter:"brightness(0) invert(1)"}}/>
          </div>
          {!collapsed&&(
            <div style={{lineHeight:1.1}}>
              <div style={{fontWeight:700,fontSize:15,color:C.primary,letterSpacing:-.5}}>
                Soft <span style={{color:C.accent}}>Library</span>
              </div>
              <div style={{fontSize:9,color:C.textMut,letterSpacing:1.5,textTransform:"uppercase",marginTop:1}}>
                Archives & Courrier
              </div>
            </div>
          )}
        </div>
        {!collapsed&&(
          <button onClick={()=>setCollapsed(true)}
            style={{background:"none",border:"none",cursor:"pointer",padding:4,display:"flex"}}>
            <div style={{width:18,height:18,color:C.textMut}}>{ICO.chevL}</div>
          </button>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav style={{flex:1,padding:"10px 8px",overflowY:"auto",overflowX:"hidden"}}>
        {/* Home button */}
        <button onClick={goHome} title={collapsed?(t?.retourAccueil||"Accueil"):""}
          style={{width:"100%",display:"flex",alignItems:"center",gap:10,
            padding:collapsed?"9px 0":"8px 12px",justifyContent:collapsed?"center":"flex-start",
            borderRadius:7,border:"none",cursor:"pointer",marginBottom:4,
            background:"transparent",color:C.textMut,fontSize:12,fontWeight:500,
            fontFamily:"'DM Sans',sans-serif",transition:"all .12s"}}
          onMouseEnter={e=>e.currentTarget.style.background="#f1f5f9"}
          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <div style={{width:18,height:18}}>{ICO.home}</div>
          {!collapsed&&<span>{t?.retourAccueil||"← Accueil"}</span>}
        </button>

        <div style={{height:1,background:C.border,margin:"4px 6px 8px"}}/>

        {NAV.map(n=>{
          if(n.section) return renderSection(n);
          return renderItem(n);
        })}
      </nav>

      {/* ── User info ── */}
      {!collapsed&&(
        <div style={{padding:"10px 14px",borderTop:`1px solid ${C.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <div style={{width:32,height:32,borderRadius:"50%",flexShrink:0,
              background:`linear-gradient(135deg,${C.primary},${C.primaryLight})`,
              display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{color:"#0f232f",fontSize:13,fontWeight:700}}>{authUser?.init||"U"}</span>
            </div>
            <div style={{flex:1,overflow:"hidden"}}>
              <div style={{fontSize:13,fontWeight:600,color:"#fff",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                {authUser?.nom||"Utilisateur"}
              </div>
              <div style={{fontSize:10,color:C.textMut}}>{authUser?.role||""}</div>
            </div>
          </div>
          <button onClick={logout}
            style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"8px 10px",
              borderRadius:8,border:"none",cursor:"pointer",background:"transparent",
              color:C.textMut,fontSize:12,fontWeight:500,fontFamily:"'DM Sans',sans-serif",
              transition:"all .12s"}}
            onMouseEnter={e=>{e.currentTarget.style.background="#fef2f2";e.currentTarget.style.color="#dc2626";}}
            onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=C.textMut;}}>
            <div style={{width:16,height:16}}>{ICO.logout}</div>
            <span>{t?.deconnexion||"Déconnexion"}</span>
          </button>
        </div>
      )}

      {collapsed&&(
        <div style={{padding:"12px 8px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"center"}}>
          <button onClick={()=>setCollapsed(false)}
            style={{background:"none",border:"none",cursor:"pointer",padding:4,display:"flex",color:C.textMut}}>
            <div style={{width:18,height:18}}>{ICO.chevR}</div>
          </button>
        </div>
      )}

      {!collapsed&&(
        <div style={{padding:"10px 16px",borderTop:`1px solid ${C.border}`,fontSize:10,color:C.textMut,textAlign:"center"}}>
          {t?.softLibrary||"Soft Library"} v1.0 • Intégré SoftAppli
        </div>
      )}
    </aside>
  );
}