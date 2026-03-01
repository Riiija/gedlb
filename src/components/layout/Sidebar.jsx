"use client";
import{useState}from"react";
import{IC}from"../ui/Icons";
import{useApp}from"../../context/AppContext";
import{DOC_MENUS,filterDocsByMenu}from"../../lib/data";
import{bdg,TR,P}from"../../lib/theme";
import{useT}from"../../lib/i18n";

const SB    ="rgb(26,38,52)";
const SB2   ="rgb(34,48,65)";
const BORDER="rgba(255,255,255,.07)";
const MUTED ="rgba(255,255,255,.38)";
const TEXT  ="rgba(255,255,255,.80)";
const ACCENT="#4a90d9";
const ACC2  ="#1ecad3";

const Ic=({k})=>{const el=IC[k];return el?<span style={{display:"flex",flexShrink:0,opacity:.75}}>{el}</span>:null;};

const cnt=(docs,id)=>filterDocsByMenu(docs,id).length;

/* ─── Badge pill ─── */
function Pill({n,color="#4a90d9"}){
  if(!n)return null;
  return(
    <span style={{background:`${color}22`,color,fontSize:10.5,fontWeight:700,padding:"2px 7px",borderRadius:10,minWidth:20,textAlign:"center",lineHeight:"16px"}}>
      {n}
    </span>
  );
}

/* ─── Section header inside nav ─── */
function SectionDivider({label,color}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 16px 4px",marginTop:4}}>
      <span style={{fontSize:9,fontWeight:800,letterSpacing:".12em",textTransform:"uppercase",color:color||MUTED}}>{label}</span>
      <div style={{flex:1,height:"1px",background:BORDER}}/>
    </div>
  );
}

/* ─── Nav leaf button ─── */
function NavItem({id,label,iconKey,count,indent=false,active,onClick,pillColor}){
  return(
    <button onClick={()=>onClick(id)}
      style={{
        width:"100%",display:"flex",alignItems:"center",gap:9,
        padding:`7px 16px 7px ${indent?36:16}px`,
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

export function Sidebar(){
  const{view,setView,sidebarOpen,docs,authUser,logout,lang}=useApp();
  const t=useT(lang);
  const[open,setOpen]=useState({docs:true,financier:false,etats:false,param:false});

  const go=id=>setView(id);
  const toggle=id=>setOpen(p=>({...p,[id]:!p[id]}));
  const act=id=>view===id;

  /* Grouped menus matching screenshot */
  const DOC_ITEMS=[
    /* 3 buckets */
    {type:"sep",label:t.depot+" / "+t.suivi,color:ACC2},
    {id:"recus-f",  label:t.recusFourn,      iconKey:"inbox",   count:cnt(docs,"recus-f"),  pillColor:ACC2},
    {id:"courrier", label:t.serviceCourrier,  iconKey:"mail",    count:cnt(docs,"courrier")},
    {id:"confids",  label:t.docsConf,         iconKey:"lockKey", count:cnt(docs,"confids"),  pillColor:"#9b59b6"},
    /* Status views */
    {type:"sep",label:"Statuts",color:MUTED},
    {id:"recu",     label:t.recu,            iconKey:"mailOpen",count:cnt(docs,"recu"),    pillColor:"#17a2b8"},
    {id:"envoyes",  label:t.envoyes,         iconKey:"send",    count:cnt(docs,"envoyes"), pillColor:"#28a745"},
    {id:"en-cours", label:t.enCours,         iconKey:"clock",   count:cnt(docs,"en-cours"),pillColor:"#f5a623"},
    {id:"refuses",  label:t.refuses,         iconKey:"xCircle", count:cnt(docs,"refuses"), pillColor:"#e03e3e"},
    {id:"archives", label:t.archives,        iconKey:"archive", count:cnt(docs,"archives"),pillColor:"#6c757d"},
    {id:"communs",  label:t.docsCommuns,     iconKey:"folder",  count:cnt(docs,"communs")},
    /* Confid sub-menus */
    {type:"sep",label:"Confidentiels",color:"#9b59b6"},
    {id:"c-enc",    label:t.confidEnCours,   iconKey:"lockKey", count:cnt(docs,"c-enc"),   pillColor:"#9b59b6"},
    {id:"c-ref",    label:t.confidRefuses,   iconKey:"lockKey", count:cnt(docs,"c-ref"),   pillColor:"#9b59b6"},
    {id:"c-arc",    label:t.confidArchives,  iconKey:"lockKey", count:cnt(docs,"c-arc"),   pillColor:"#9b59b6"},
    {id:"r-com",    label:t.refusesCommuns,  iconKey:"xCircle", count:cnt(docs,"r-com"),   pillColor:"#9b59b6"},
    {id:"c-com",    label:t.confidCommuns,   iconKey:"lockKey", count:cnt(docs,"c-com"),   pillColor:"#9b59b6"},
  ];

  const MAIN_NAV=[
    {id:"dashboard",    label:t.dashboard,    icon:"dash",    direct:true},
    {id:"depot",        label:t.depot,        icon:"upload",  direct:true},
    {id:"suivi",        label:t.suivi,        icon:"search",  direct:true},
    {id:"docs",         label:t.documents,    icon:"folder",  children:DOC_ITEMS},
    {id:"financier",    label:t.financier,    icon:"money",   children:[
      {id:"liq",        label:t.liquidations, iconKey:"creditCard", direct:true},
      {id:"paiements",  label:t.paiements,    iconKey:"bank",      direct:true},
    ]},
    {id:"etats",        label:t.etatsRapports,icon:"barChart",children:[
      {id:"etats",          label:t.etatsRapports,       iconKey:"barChart",direct:true},
      {id:"dashboard_stats",label:"Stats & KPIs",         iconKey:"dash",    direct:true},
    ]},
    {id:"param",        label:t.parametrage,  icon:"cog",     children:[
      {id:"users",       label:t.utilisateurs, iconKey:"users",    direct:true},
      {id:"param_types", label:t.typesDoc,     iconKey:"fileText", direct:true},
      {id:"param_recv",  label:t.receveurs,    iconKey:"mail",     direct:true},
      {id:"champs_dyn",  label:t.champsDyn,    iconKey:"edit",     direct:true},
      {id:"permissions", label:"Droits & Rôles",iconKey:"lockKey",  direct:true},
    ]},
  ];

  if(!sidebarOpen)return(
    <div style={{width:54,background:SB,display:"flex",flexDirection:"column",alignItems:"center",paddingTop:12,gap:4,flexShrink:0,borderRight:`1px solid ${BORDER}`}}>
      <div style={{width:32,height:32,borderRadius:8,background:P,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:8}}>
        <span style={{color:"#fff",fontWeight:900,fontSize:12}}>SD</span>
      </div>
      {MAIN_NAV.map(n=>(
        <button key={n.id} onClick={()=>n.direct?go(n.id):toggle(n.id)} title={n.label}
          style={{width:34,height:34,borderRadius:8,background:act(n.id)?P:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:act(n.id)?"#fff":MUTED}}>
          <Ic k={n.icon}/>
        </button>
      ))}
    </div>
  );

  return(
    <div style={{width:236,background:SB,display:"flex",flexDirection:"column",flexShrink:0,overflowY:"auto",overflowX:"hidden",borderRight:`1px solid ${BORDER}`}}>

      {/* ── Brand ── */}
      <div style={{padding:"14px 16px",borderBottom:`1px solid ${BORDER}`,display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
        <div style={{width:34,height:34,borderRadius:8,overflow:"hidden",flexShrink:0,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <img src="/softdocs-logo.png" alt="SoftDocs" style={{width:30,height:30,objectFit:"contain"}}/>
        </div>
        <div>
          <div style={{color:"#fff",fontWeight:800,fontSize:14,letterSpacing:"-.2px",lineHeight:1.1}}>SoftDocs</div>
          <div style={{color:MUTED,fontSize:10,marginTop:2}}>{t.appDesc}</div>
        </div>
      </div>

      {/* ── Auth user card ── */}
      {authUser&&(
        <div style={{margin:"10px 10px 0",background:SB2,borderRadius:8,padding:"8px 10px",display:"flex",alignItems:"center",gap:8,border:`1px solid ${BORDER}`}}>
          <div style={{width:30,height:30,borderRadius:"50%",background:P,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff",flexShrink:0}}>
            {authUser.init||authUser.nom?.charAt(0)}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:12,fontWeight:600,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{authUser.nom}</div>
            <div style={{fontSize:10,color:MUTED,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{authUser.role}</div>
          </div>
          <button onClick={logout} title={t.deconnexion}
            style={{background:"none",border:"none",cursor:"pointer",color:MUTED,display:"flex",padding:4,borderRadius:6,flexShrink:0}}
            onMouseEnter={e=>e.currentTarget.style.color="#fff"}
            onMouseLeave={e=>e.currentTarget.style.color=MUTED}>
            {IC.logout}
          </button>
        </div>
      )}

      {/* ── Nav ── */}
      <nav style={{flex:1,padding:"8px 0 12px",overflowY:"auto"}}>
        {MAIN_NAV.map(n=>{
          if(n.direct)return(
            <NavItem key={n.id} id={n.id} label={n.label} iconKey={n.icon} active={act(n.id)} onClick={go}/>
          );
          const isOpen=open[n.id];
          const anyChildActive=n.id==="docs"?DOC_ITEMS.filter(c=>c.id).some(c=>act(c.id)):n.children?.some(c=>act(c.id));
          return(
            <div key={n.id}>
              <button onClick={()=>toggle(n.id)}
                style={{
                  width:"100%",display:"flex",alignItems:"center",gap:9,padding:"8px 16px",
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
                    : n.children.map(c=>(
                        <NavItem key={c.id} id={c.id} label={c.label} iconKey={c.iconKey}
                          indent active={act(c.id)} onClick={go}/>
                      ))
                  }
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* ── Bottom logout ── */}
      <div style={{padding:"8px 10px 12px",borderTop:`1px solid ${BORDER}`,flexShrink:0}}>
        <button onClick={logout}
          style={{width:"100%",display:"flex",alignItems:"center",gap:9,padding:"8px 10px",background:"transparent",border:`1px solid ${BORDER}`,borderRadius:8,cursor:"pointer",color:MUTED,transition:TR,fontFamily:"inherit"}}
          onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.05)";e.currentTarget.style.color="#fff";}}
          onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=MUTED;}}>
          <span style={{display:"flex"}}>{IC.logout}</span>
          <span style={{fontSize:12.5}}>{t.deconnexion}</span>
        </button>
      </div>
    </div>
  );
}
