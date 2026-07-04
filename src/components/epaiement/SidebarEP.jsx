"use client";
import{useState}from"react";
import{useApp}from"../../context/AppContext";
import{useT}from"../../lib/i18n";
import{useIsMobile}from"../../lib/useResponsive";

const G="#1a6b3c";
const GDk="#0f4024";
const GBr="#143d22";
const BDG="rgba(255,255,255,.07)";
const BDR="rgba(255,255,255,.12)";
const ACT_BG="rgba(255,255,255,.13)";
const MUT_C="rgba(255,255,255,.45)";
const TXT_C="rgba(255,255,255,.85)";

function getMenu(t){return[
  {
    id:"ep-dashboard",label:t.epDashboard||"Tableau de bord",
    icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
    direct:true,
  },
  {
    id:"ep-liq",label:t.liquidations||"Liquidations",
    icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    direct:true,
  },
  {
    id:"ep-paiements",label:t.paiements.replace("XML","").trim()||"Paiements",
    icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
    children:[
      {id:"ep-liste-paiements",label:t.listePaiements||"Liste des paiements",icon:null},
      {id:"ep-xml",label:t.generationXML||"Génération fichier banque",icon:null},
    ],
  },
  {
    id:"ep-param",label:t.parametrageEP||"Paramétrage",
    icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    children:[
      {id:"ep-nature-remise",label:t.natureRemise||"Nature de remise",icon:null},
      {id:"ep-balise-xml",label:t.baliseXML||"Balise XML",icon:null},
      {id:"ep-mappage-xml",label:t.mappageXML||"Mappage XML — Banques",icon:null},
    ],
  },
  {
    id:"ep-etats",label:"États & Rapports",
    icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    children:[
      {id:"ep-kpi",    label:"Tableau de bord KPI",   icon:null},
      {id:"ep-r-liq",  label:"État liquidations",      icon:null},
      {id:"ep-r-gen",  label:"État générations",       icon:null},
      {id:"ep-r-pai",  label:"État paiements",         icon:null},
      {id:"ep-r-four", label:"État fournisseurs",      icon:null},
      {id:"ep-r-proj", label:"État projets & sites",   icon:null},
    ],
  },
  {id:"sep",type:"separator"},
  {
    id:"ep-users",label:t.utilisateurs||"Utilisateurs",
    icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    direct:true,viewId:"ep-users",
  },
];
}

export function SidebarEP(){
  const{view,setView,sidebarOpen,setSidebarOpen,setCurrentApp,lang}=useApp();
  const isMobile=useIsMobile();
  const t=useT(lang);
  const MENU=getMenu(t);
  const[open,setOpen]=useState({});

  function go(id){setView(id);if(isMobile)setSidebarOpen(false);}
  function toggle(id){setOpen(p=>({...p,[id]:!p[id]}));}
  const isActive=(id)=>view===id;
  const hasActive=(children)=>children?.some(c=>c.id===view);

  if(!sidebarOpen&&!isMobile)return(
    <div style={{width:54,background:"linear-gradient(180deg,"+GDk+" 0%,"+GBr+" 100%)",display:"flex",flexDirection:"column",alignItems:"center",paddingTop:12,gap:4,flexShrink:0,borderRight:"1px solid rgba(255,255,255,.08)"}}>
      {/* Logo collapsed */}
      <div style={{width:36,height:36,borderRadius:8,background:"rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:8,cursor:"pointer"}}
        onClick={()=>setSidebarOpen(true)}>
        <span style={{fontSize:14,fontWeight:900,color:"#fff"}}>EP</span>
      </div>
      {MENU.filter(m=>m.id!=="sep"&&m.icon).map(m=>(
        <button key={m.id} onClick={()=>m.direct?go(m.viewId||m.id):toggle(m.id)} title={m.label}
          style={{width:36,height:36,borderRadius:8,background:isActive(m.viewId||m.id)||hasActive(m.children)?ACT_BG:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:isActive(m.viewId||m.id)||hasActive(m.children)?"#fff":MUT_C,transition:"all .15s"}}>
          {m.icon}
        </button>
      ))}
    </div>
  );

  return(
    <div style={{width:isMobile?260:240,height:"100vh",background:"linear-gradient(180deg,"+GDk+" 0%,"+GBr+" 100%)",display:"flex",flexDirection:"column",flexShrink:0,borderRight:"1px solid rgba(255,255,255,.08)"}}>
      {/* Brand */}
      <div style={{padding:"14px 16px",borderBottom:"1px solid rgba(255,255,255,.08)",display:"flex",alignItems:"center",gap:10}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:12.5,fontWeight:800,color:"#fff",letterSpacing:"-.2px",lineHeight:1.1}}>Soft E-paiement</div>

        </div>
        {isMobile?<button onClick={()=>setSidebarOpen(false)} title="Fermer" style={{width:28,height:28,borderRadius:4,background:"transparent",border:"none",cursor:"pointer",color:"rgba(255,255,255,.6)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>:<button onClick={()=>setSidebarOpen(false)} title="Réduire" style={{width:24,height:24,borderRadius:4,background:"transparent",border:"none",cursor:"pointer",color:MUT_C,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>}
      </div>

      {/* Switch app button */}
      <button onClick={()=>setCurrentApp("home")}
        style={{margin:"10px 12px",padding:"8px 12px",borderRadius:8,background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.1)",cursor:"pointer",display:"flex",alignItems:"center",gap:8,color:TXT_C,fontFamily:"inherit",fontSize:12,fontWeight:600}}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        {t.deconnexion?lang==="en"?"Switch Application":"Changer d'application":"Changer d'application"}
      </button>

      {/* Nav */}
      <nav style={{flex:1,overflowY:"auto",padding:"6px 0",scrollbarWidth:"none",WebkitOverflowScrolling:"touch"}}>
        {MENU.map(m=>{
          if(m.type==="separator")return<div key="sep" style={{height:1,background:"rgba(255,255,255,.07)",margin:"8px 14px"}}/>;
          const act=isActive(m.viewId||m.id)||hasActive(m.children);
          const expanded=open[m.id]||hasActive(m.children);
          return(
            <div key={m.id}>
              <button onClick={()=>{if(m.direct)go(m.viewId||m.id);else toggle(m.id);}}
                style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"9px 16px",border:"none",background:act&&m.direct?ACT_BG:"transparent",borderRadius:"0 20px 20px 0",marginRight:8,cursor:"pointer",fontFamily:"inherit",color:act?TXT_C:MUT_C,transition:"all .15s",textAlign:"left"}}>
                <span style={{display:"flex",color:act?"rgba(255,255,255,.9)":"rgba(255,255,255,.4)",flexShrink:0}}>{m.icon}</span>
                <span style={{flex:1,fontSize:13,fontWeight:act?700:500,letterSpacing:"-.1px"}}>{m.label}</span>
                {m.children&&(
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{transform:expanded?"rotate(90deg)":"rotate(0deg)",transition:"transform .2s",flexShrink:0,color:MUT_C}}>
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                )}
              </button>
              {m.children&&expanded&&(
                <div style={{paddingLeft:16,marginBottom:4}}>
                  {m.children.map(c=>(
                    <button key={c.id} onClick={()=>go(c.id)}
                      style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"7px 12px 7px 20px",border:"none",background:isActive(c.id)?ACT_BG:"transparent",borderRadius:"0 16px 16px 0",cursor:"pointer",fontFamily:"inherit",color:isActive(c.id)?"#fff":MUT_C,fontSize:12.5,fontWeight:isActive(c.id)?600:400,transition:"all .15s",textAlign:"left"}}>
                      <span style={{width:5,height:5,borderRadius:"50%",background:isActive(c.id)?"#fff":MUT_C,flexShrink:0}}/>
                      {c.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{padding:"10px 12px",borderTop:"1px solid rgba(255,255,255,.07)"}}>
        <div style={{fontSize:10,color:"rgba(255,255,255,.2)",textAlign:"center"}}>Soft E-paiement v1.0</div>
      </div>
    </div>
  );
}
