"use client";
import{useState}from"react";
import{IC}from"../ui/Icons";
import{useApp}from"../../context/AppContext";
import{DOC_MENUS,filterDocsByMenu}from"../../lib/data";
import{bdg,TR,P}from"../../lib/theme";
import{useT}from"../../lib/i18n";
import{useIsMobile}from"../../lib/useResponsive";

const SB    ="rgb(26,38,52)";
const SB2   ="rgb(34,48,65)";
const BORDER="rgba(255,255,255,.07)";
const MUTED ="rgba(255,255,255,.38)";
const TEXT  ="rgba(255,255,255,.80)";
const ACCENT="#4a90d9";
const ACC2  ="#1ecad3";

const Ic=({k})=>{const el=IC[k];return el?<span style={{display:"flex",flexShrink:0,opacity:.75}}>{el}</span>:null;};

function Pill({n,color="#4a90d9"}){
  if(!n)return null;
  return(
    <span style={{background:`${color}22`,color,fontSize:10.5,fontWeight:700,padding:"2px 7px",borderRadius:10,minWidth:20,textAlign:"center",lineHeight:"16px"}}>
      {n}
    </span>
  );
}

function SectionDivider({label,color}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 16px 4px",marginTop:4}}>
      <span style={{fontSize:9,fontWeight:800,letterSpacing:".12em",textTransform:"uppercase",color:color||MUTED}}>{label}</span>
      <div style={{flex:1,height:"1px",background:BORDER}}/>
    </div>
  );
}

function NavItem({id,label,iconKey,count,indent=false,active,onClick,pillColor}){
  return(
    <button onClick={()=>onClick(id)}
      style={{
        width:"100%",display:"flex",alignItems:"center",gap:9,
        padding:`7px 16px 7px ${indent?36:16}px`,
        minHeight:40,
        background:active?"rgba(74,144,217,.15)":"transparent",
        border:"none",borderLeft:active?`3px solid ${ACCENT}`:"3px solid transparent",
        cursor:"pointer",color:active?ACCENT:TEXT,
        transition:"background .12s,color .12s",textAlign:"left",fontFamily:"inherit",
      }}
      onMouseEnter={e=>{if(!active)e.currentTarget.style.background="rgba(255,255,255,.04)";}}
      onMouseLeave={e=>{if(!active)e.currentTarget.style.background="transparent";}}
    >
      <Ic k={iconKey}/>
      <span style={{fontSize:12.5,fontWeight:active?600:400,flex:1,lineHeight:1.3}}>{label}</span>
      <Pill n={count} color={pillColor||ACCENT}/>
    </button>
  );
}

export function Sidebar({onReset}){
  const{view,setView,sidebarOpen,setSidebarOpen,docs,authUser,logout,lang,recv}=useApp();
  const t=useT(lang);
  const[openGroup,setOpenGroup]=useState(null);
  const userId=authUser?.id||null;
  const isMobile=useIsMobile();

  const go=(id)=>{setView(id);if(isMobile)setSidebarOpen(false);};
  const toggleGroup=id=>setOpenGroup(p=>p===id?null:id);
  const act=id=>view===id;
  const cnt=id=>filterDocsByMenu(docs,id,userId,recv).length;

  const DOC_ITEMS=[
    {type:"sep",label:t.depot+" / "+t.suivi,color:ACC2},
    {id:"recus-f",  label:t.recusFourn,      iconKey:"inbox",   count:cnt("recus-f"),  pillColor:ACC2},
    {id:"courrier", label:t.serviceCourrier,  iconKey:"mail",    count:cnt("courrier")},
    {id:"confids",  label:t.docsConf,         iconKey:"lockKey", count:cnt("confids"),  pillColor:"#9b59b6"},
    {type:"sep",label:"Statuts",color:MUTED},
    {id:"recu",     label:t.recu,            iconKey:"mailOpen",count:cnt("recu"),    pillColor:"#17a2b8"},
    {id:"envoyes",  label:t.envoyes,         iconKey:"send",    count:cnt("envoyes"), pillColor:"#28a745"},
    {id:"en-cours", label:t.enCours,         iconKey:"clock",   count:cnt("en-cours"),pillColor:"#f5a623"},
    {id:"refuses",  label:t.refuses,         iconKey:"xCircle", count:cnt("refuses"), pillColor:"#e03e3e"},
    {id:"archives", label:t.archives,        iconKey:"archive", count:cnt("archives"),pillColor:"#6c757d"},
    {id:"communs",  label:t.docsCommuns,     iconKey:"folder",  count:cnt("communs")},
    {type:"sep",label:"Via SoftSign",color:"#7c3aed"},
    {id:"softsign-import",label:"Documents SoftSign",iconKey:"fileText",pillColor:"#7c3aed"},
    {type:"sep",label:"Confidentiels",color:"#9b59b6"},
    {id:"c-enc",    label:t.confidEnCours,   iconKey:"lockKey", count:cnt("c-enc"),   pillColor:"#9b59b6"},
    {id:"c-ref",    label:t.confidRefuses,   iconKey:"lockKey", count:cnt("c-ref"),   pillColor:"#9b59b6"},
    {id:"c-arc",    label:t.confidArchives,  iconKey:"lockKey", count:cnt("c-arc"),   pillColor:"#9b59b6"},
    {id:"r-com",    label:t.refusesCommuns,  iconKey:"xCircle", count:cnt("r-com"),   pillColor:"#9b59b6"},
    {id:"c-com",    label:t.confidCommuns,   iconKey:"lockKey", count:cnt("c-com"),   pillColor:"#9b59b6"},
  ];

  const MAIN_NAV=[
    {id:"dashboard",    label:t.dashboard,    icon:"dash",    direct:true},
    {id:"depot",        label:t.depot,        icon:"upload",  direct:true},
    {id:"suivi",        label:t.suivi,        icon:"search",  direct:true},
    {id:"docs",         label:t.documents,    icon:"folder",  children:DOC_ITEMS},
    {id:"etats",        label:t.etatsRapports,icon:"barChart",children:[
      {id:"r1",  label:"Dossiers par projet",          iconKey:"folder",      etat:"r1"},
      {id:"r2",  label:"Historique documents",         iconKey:"scroll",      etat:"r2"},
      {id:"r3",  label:"En instance / validateur",     iconKey:"user",        etat:"r3"},
      {id:"r4",  label:"En instance / personne",       iconKey:"users",       etat:"r4"},
      {id:"r5",  label:"En instance / date",           iconKey:"clock",       etat:"r5"},
      {id:"r6",  label:"Délai moyen traitement",       iconKey:"refresh",     etat:"r6"},
      {id:"r7",  label:"Détail dossiers archivés",     iconKey:"archive",     etat:"r7"},
      {id:"r8",  label:"Retards / validateur",         iconKey:"alertTri",    etat:"r8"},
      {id:"r9",  label:"Dossiers rejetés",             iconKey:"xCircle",     etat:"r9"},
      {id:"r10", label:"Liste refusés",                iconKey:"fileText",    etat:"r10"},
      {id:"r11", label:"Validés / utilisateur",        iconKey:"checkCircle", etat:"r11"},
      {id:"r12", label:"Situation fin. par projets",    iconKey:"money",       etat:"r12"},
      {id:"r13", label:"Situation fin. par fournisseurs",iconKey:"money",       etat:"r13"},
      {id:"dashboard_stats",label:"Stats & KPIs",      iconKey:"barChart",    direct:true},
    ]},
    {id:"param", label:t.parametrage, icon:"cog", adminOnly:true, children:[
      {id:"users",       label:t.utilisateurs, iconKey:"users",    direct:true},
      {id:"param_types", label:"WorkFlow",      iconKey:"fileText", direct:true},
      {id:"param_recv",  label:t.receveurs,    iconKey:"mail",     direct:true},
      {id:"champs_dyn",  label:t.champsDyn,    iconKey:"edit",     direct:true},
      {id:"plan_comptes",label:"Plan de Comptes",iconKey:"folder",  direct:true},
      {id:"config_mail", label:"Config. Mail SMTP",iconKey:"mail",  direct:true},
      {id:"gestion_fournisseurs",label:"Gestion Fournisseurs",iconKey:"users",direct:true},
      {id:"causes_refus",label:"Causes de refus",iconKey:"xCircle",direct:true},
      {id:"param_relance",label:t.relanceMenu||"Relance",iconKey:"mail",direct:true,adminOnly:true},
    ]},
  ];

  /* Mobile: always show expanded sidebar (never collapsed mini) */
  const sidebarWidth=isMobile?260:(!sidebarOpen?54:236);

  if(!sidebarOpen&&!isMobile)return(
    <div style={{width:54,background:SB,display:"flex",flexDirection:"column",alignItems:"center",paddingTop:12,gap:4,flexShrink:0,borderRight:`1px solid ${BORDER}`}}>
      <div style={{width:42,height:42,borderRadius:10,background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.12)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:8}}>
        <img src="/softdocs-logo-final.png" alt="SD" style={{width:28,height:28,objectFit:"contain"}}/>
      </div>
      {MAIN_NAV.filter(n=>!n.adminOnly||(authUser?.systemRole==="admin"||authUser?.systemRole==="superadmin")).map(n=>(
        <button key={n.id} onClick={()=>n.direct?go(n.id):toggleGroup(n.id)} title={n.label}
          style={{width:34,height:34,borderRadius:8,background:act(n.id)?P:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:act(n.id)?"#fff":MUTED}}>
          <Ic k={n.icon}/>
        </button>
      ))}
    </div>
  );

  return(
    <div style={{width:sidebarWidth,background:SB,display:"flex",flexDirection:"column",flexShrink:0,overflowY:"auto",overflowX:"hidden",borderRight:`1px solid ${BORDER}`,height:"100vh",WebkitOverflowScrolling:"touch"}}>

      {/* ── Brand ── */}
      <div style={{padding:"14px 16px",borderBottom:`1px solid ${BORDER}`,display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
        <div style={{width:42,height:42,borderRadius:10,overflow:"hidden",flexShrink:0,
          display:"flex",alignItems:"center",justifyContent:"center"}}>
          <img src="/softdocs-logo-final.png" alt="SoftDocs"
            style={{width:44,height:44,objectFit:"contain"}}/>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{color:"#fff",fontWeight:800,fontSize:14,letterSpacing:"-.2px",lineHeight:1.1}}>SoftDocs</div>
          <div style={{color:MUTED,fontSize:10,marginTop:2}}>{t.appDesc}</div>
          <div style={{color:"rgba(255,255,255,0.45)",fontSize:9,marginTop:1,fontStyle:"italic",letterSpacing:".02em"}}>by Softwell</div>
        </div>
        {/* Close button on mobile */}
        {isMobile&&(
          <button onClick={()=>setSidebarOpen(false)}
            style={{background:"none",border:"none",color:"rgba(255,255,255,.6)",cursor:"pointer",display:"flex",padding:4}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        )}
      </div>

      {/* ── Nav ── */}
      <nav style={{flex:1,padding:"8px 0 12px",overflowY:"auto",WebkitOverflowScrolling:"touch"}}>
        {MAIN_NAV.filter(n=>!n.adminOnly||(authUser?.systemRole==="admin"||authUser?.systemRole==="superadmin")).map(n=>{
          if(n.direct)return(
            <NavItem key={n.id} id={n.id} label={n.label} iconKey={n.icon} active={act(n.id)} onClick={go}/>
          );
          const isOpen=openGroup===n.id;
          const anyChildActive=n.id==="docs"?DOC_ITEMS.filter(c=>c.id).some(c=>act(c.id)):n.children?.some(ch=>act(ch.etat||ch.id));
          return(
            <div key={n.id}>
              <button onClick={()=>toggleGroup(n.id)}
                style={{
                  width:"100%",display:"flex",alignItems:"center",gap:9,padding:"8px 16px",minHeight:40,
                  background:anyChildActive?"rgba(74,144,217,.08)":"transparent",
                  border:"none",borderLeft:anyChildActive?`3px solid ${ACCENT}44`:"3px solid transparent",
                  cursor:"pointer",color:anyChildActive?ACCENT:TEXT,transition:TR,textAlign:"left",fontFamily:"inherit",
                }}>
                <Ic k={n.icon}/>
                <span style={{fontSize:13,fontWeight:anyChildActive?600:500,flex:1}}>{n.label}</span>
                <span style={{display:"flex",color:MUTED,transform:isOpen?"rotate(90deg)":"none",transition:"transform .2s",opacity:.6}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                </span>
              </button>

              {isOpen&&(
                <div style={{background:"rgba(0,0,0,.12)",borderBottom:`1px solid ${BORDER}`}}>
                  {n.id==="docs"
                    ? DOC_ITEMS.map((item,i)=>
                        item.type==="sep"
                          ? <SectionDivider key={i} label={item.label} color={item.color}/>
                          : <NavItem key={item.id} id={item.id} label={item.label} iconKey={item.iconKey}
                              count={item.count} indent active={act(item.id)} onClick={go} pillColor={item.pillColor}/>
                      )
                    : n.children.filter(ch=>!ch.adminOnly||(authUser?.systemRole==="admin"||authUser?.systemRole==="superadmin")).map(ch=>(
                        <NavItem key={ch.id} id={ch.id} label={ch.label} iconKey={ch.iconKey}
                          indent
                          active={ch.etat?view===ch.id:act(ch.id)}
                          onClick={()=>go(ch.etat||ch.id)}/>
                      ))
                  }
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
