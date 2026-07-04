"use client";
import{useState,useEffect,useMemo}from"react";
import{useApp}from"../../context/AppContext";
import{useIsMobile}from"../../lib/useResponsive";
import{SidebarLib}from"./SidebarLib";
import ChatBox from"../chat/ChatBox";
import{GLOBAL_STYLES}from"./theme";
import{useTLib}from "../../lib/i18nLib";

import LibDashboard     from"./pages/LibDashboard";
import LibDocuments     from"./pages/LibDocuments";
import LibEmplacements  from"./pages/LibEmplacements";
import LibConsultations from"./pages/LibConsultations";
import LibCourrier      from"./pages/LibCourrier";
import LibCycleVie      from"./pages/LibCycleVie";
import LibContenants    from"./pages/LibContenants";
import LibReporting     from"./pages/LibReporting";
import LibAdmin         from"./pages/LibAdmin";
import ChatBoxLib from "./ChatBoxLib";
import LibInventaire    from"./pages/LibInventaire";
import LibIntegrationGED from"./pages/LibIntegrationGED";
import LibMouvements    from"./pages/LibMouvements";
import LibMFP           from"./pages/LibMFP";
import{SHARED_DOC_TYPES,SHARED_EMPLACEMENTS}from"./data/sharedData";

const C={primary:'#0c4a6e',primaryLight:'#0369a1',border:'#e2e8f0',text:'#0f172a',textSec:'#475569',textMut:'#94a3b8',surfaceAlt:'#f8fafc',danger:'#dc2626'};

const PAGE_LABEL_KEYS={
  "lib-dashboard":"dashboard","lib-documents":"documents","lib-contenants":"contenants",
  "lib-emplacements":"emplacements","lib-mouvements":"mouvements","lib-consultations":"consultations",
  "lib-courrier":"courrier","lib-cycle-vie":"cycleVie","lib-etat-synthese":"visionSynthetique",
  "lib-etat-gestion":"gestionDocumentaire","lib-inventaire":"inventaire",
  "lib-integration-ged":"integrationGED","lib-admin":"administration",
};
function getPageLabel(view,t){return t[PAGE_LABEL_KEYS[view]]||t.dashboard;}

/* ── App definitions for switcher ── */
const APPS_LIST=[
 {id:"softdocs",name:"SoftDocs",sub:"GED & Finances",color:"#324372",logo:"/softdocs-logo-final.png",icon:null},
    {id:"epaiement",name:"Soft e-Payment",sub:"Liquidations & Paiements",color:"#2a2d8f",logo:"/softepayment-logo.png",icon:null},
    {id:"softlibrary",name:"Soft Library",tagline:"Archives Physiques",color:"#0c4a6e",logo:"/softlibrary.png"},
    {id:"softbudget",name:"SoftBudget",tagline:"Budgets & Engagements",color:"#0f766e",logo:"/softbudget-logo.svg"},];

/* ── Topbar spécifique SoftLibrary (blanc, breadcrumb, bell, user, lang, app-switcher) ── */
function TopbarLib({authUser,onMenuToggle,isMobile,lang,changeLang,t,pageLabel}){
  const{setCurrentApp,setView}=useApp();
  const[langOpen,setLangOpen]=useState(false);
  const[appOpen,setAppOpen]=useState(false);
  const currentAppDef=APPS_LIST.find(a=>a.id==="softlibrary");

  const switchApp=(appId)=>{
    setAppOpen(false);
    if(appId==="home"){setCurrentApp("home");setView("dashboard");return;}
    setCurrentApp(appId);
    setView(appId==="softdocs"?"dashboard":appId==="softlibrary"?"lib-dashboard":appId==="softbudget"?"budget-dashboard":"ep-dashboard");
  };

  return(
    <header style={{height:56,background:"#fff",borderBottom:`1px solid ${C.border}`,
      display:"flex",alignItems:"center",justifyContent:"space-between",
      padding:"0 24px",position:"sticky",top:0,zIndex:50,flexShrink:0,
      fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        {isMobile&&(
          <button onClick={onMenuToggle} style={{background:"none",border:"none",cursor:"pointer",padding:4,display:"flex"}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.textSec} strokeWidth="2" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        )}

        {/* ── App Switcher ── */}
        <div style={{position:"relative"}}>
          <button onClick={()=>setAppOpen(p=>!p)}
            style={{display:"inline-flex",alignItems:"center",gap:4,padding:"5px 8px",borderRadius:6,border:"1px solid #e3e6ea",background:"#f8f9fc",cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}
            onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div style={{width:30,height:30,
              display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
             <img src={currentAppDef.logo} alt="SD" style={{height:16,objectFit:"contain",flexShrink:0}}/>
            </div>
            {!isMobile&&(
              <div style={{textAlign:"left"}}>
                <div style={{fontSize:14,fontWeight:700,color:C.text,lineHeight:1.2}}>Soft Library</div>
                <div style={{fontSize:10,color:C.textMut,lineHeight:1.2}}>by Softwell</div>
              </div>
            )}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.textMut} strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>

          {appOpen&&(
            <>
              <div onClick={()=>setAppOpen(false)} style={{position:"fixed",inset:0,zIndex:98}}/>
              <div style={{position:"absolute",top:"calc(100% + 6px)",left:0,background:"#fff",
                borderRadius:12,border:`1px solid ${C.border}`,
                boxShadow:"0 8px 32px rgba(0,0,0,.12), 0 2px 8px rgba(0,0,0,.06)",
                zIndex:99,overflow:"hidden",minWidth:280,padding:"6px 0"}}>

                {/* Header */}
                <div style={{padding:"10px 16px 8px",fontSize:11,fontWeight:700,color:C.textMut,
                  textTransform:"uppercase",letterSpacing:.8}}>
                  {lang==="en"?"SWITCH APPLICATION":"CHANGER D'APPLICATION"}
                </div>

                {/* App items */}
                {APPS_LIST.map(app=>{
                  const isCurrent=app.id==="softlibrary";
                  return(
                    <button key={app.id} onClick={()=>switchApp(app.id)}
                      style={{width:"100%",display:"flex",alignItems:"center",gap:12,
                        padding:"10px 16px",border:"none",cursor:"pointer",
                        background:isCurrent?"#f0f9ff":"#fff",
                        fontFamily:"'DM Sans',sans-serif",textAlign:"left",
                        transition:"all .1s"}}
                      onMouseEnter={e=>{if(!isCurrent)e.currentTarget.style.background="#f8fafc";}}
                      onMouseLeave={e=>{e.currentTarget.style.background=isCurrent?"#f0f9ff":"#fff";}}>
                      <div style={{width:36,height:36,borderRadius:8,
                        background:`${app.color}10`,border:`1.5px solid ${app.color}20`,
                        display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <img src={app.logo} alt={app.name} style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain"}}/>
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:600,color:C.text}}>{app.name}</div>
                        <div style={{fontSize:11,color:C.textMut}}>{app.tagline}</div>
                      </div>
                      {isCurrent&&(
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      )}
                    </button>
                  );
                })}

                {/* Separator + Home */}
                <div style={{height:1,background:C.border,margin:"6px 12px"}}/>
                <button onClick={()=>switchApp("home")}
                  style={{width:"100%",display:"flex",alignItems:"center",gap:10,
                    padding:"10px 16px",border:"none",cursor:"pointer",background:"#fff",
                    fontFamily:"'DM Sans',sans-serif",fontSize:13,color:C.textSec,fontWeight:500,
                    transition:"all .1s"}}
                  onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"}
                  onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
                  <div style={{width:36,height:36,borderRadius:8,background:"#f1f5f9",
                    display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.textSec} strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                  </div>
                  <span>{lang==="en"?"Home — all applications":"Accueil — toutes les applications"}</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Breadcrumb separator + page label */}
        {!isMobile&&(
          <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:C.textMut}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            <span style={{color:C.text,fontWeight:600}}>{pageLabel}</span>
          </div>
        )}
      </div>

      <div style={{display:"flex",alignItems:"center",gap:12}}>
        {/* Language dropdown */}
        <div style={{position:"relative"}}>
          <button onClick={()=>setLangOpen(p=>!p)}
            style={{display:"flex",alignItems:"center",gap:5,padding:"5px 10px",
              borderRadius:6,border:`1px solid ${C.border}`,background:"#fff",
              cursor:"pointer",fontSize:12,fontWeight:600,color:C.textSec,
              fontFamily:"'DM Sans',sans-serif"}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            {lang==="fr"?"FR":"EN"}
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          {langOpen&&(
            <>
              <div onClick={()=>setLangOpen(false)} style={{position:"fixed",inset:0,zIndex:98}}/>
              <div style={{position:"absolute",top:"calc(100% + 4px)",right:0,background:"#fff",
                borderRadius:8,border:`1px solid ${C.border}`,boxShadow:"0 4px 16px rgba(0,0,0,.1)",
                zIndex:99,overflow:"hidden",minWidth:120}}>
                {[{code:"fr",label:"Français",flag:"🇫🇷"},{code:"en",label:"English",flag:"🇬🇧"}].map(l=>(
                  <button key={l.code} onClick={()=>{changeLang(l.code);setLangOpen(false);}}
                    style={{width:"100%",display:"flex",alignItems:"center",gap:8,
                      padding:"9px 14px",border:"none",cursor:"pointer",fontSize:12,
                      background:lang===l.code?"#f0f9ff":"#fff",
                      color:lang===l.code?C.primary:C.text,
                      fontWeight:lang===l.code?700:500,
                      fontFamily:"'DM Sans',sans-serif",textAlign:"left"}}
                    onMouseEnter={e=>{if(lang!==l.code)e.currentTarget.style.background="#f8fafc";}}
                    onMouseLeave={e=>{e.currentTarget.style.background=lang===l.code?"#f0f9ff":"#fff";}}>
                    <span style={{fontSize:16}}>{l.flag}</span>
                    <span>{l.label}</span>
                    {lang===l.code&&<span style={{marginLeft:"auto",color:C.primary,fontSize:13}}>✓</span>}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        {/* Bell */}
        <div style={{position:"relative",cursor:"pointer"}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.textSec} strokeWidth="1.8" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <span style={{position:"absolute",top:-2,right:-2,width:8,height:8,borderRadius:"50%",background:C.danger,border:"2px solid #fff"}}/>
        </div>
        <div style={{width:1,height:24,background:C.border}}/>
        {/* User */}
        <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
          <div style={{width:32,height:32,borderRadius:"50%",
            background:`linear-gradient(135deg,${C.primary},${C.primaryLight})`,
            display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{color:"#fff",fontSize:13,fontWeight:700}}>{authUser?.init||"U"}</span>
          </div>
          {!isMobile&&(
            <div>
              <div style={{fontSize:13,fontWeight:600,color:C.text}}>{authUser?.nom?.split(" ")[0]||"Admin"}</div>
              <div style={{fontSize:10,color:C.textMut}}>{authUser?.role||""}</div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default function SoftLibraryBackoffice(){
  const{view,setView,docs,users,authUser,sidebarOpen,setSidebarOpen,
    libDocs,libDocTypes,libEmplacements,libContenants,libAuditLog,
    lang,changeLang}=useApp();
  const isMobile=useIsMobile();
  const t=useTLib(lang||"fr");

  useEffect(()=>{if(isMobile)setSidebarOpen(false);},[view]);

  /* ── libDocs = LIB_DOCUMENTS (source de vérité archives physiques) ── */
  const docTypes=libDocTypes?.length?libDocTypes:SHARED_DOC_TYPES;
  const empls=libEmplacements?.length?libEmplacements:SHARED_EMPLACEMENTS;

  /* ── Enrichir les documents avec contenantId + lien GED (gedDoc) ── */
  const CONT_ASSIGN=['CNT-003','CNT-007','CNT-011','CNT-005','CNT-009','CNT-008','CNT-005','CNT-001','CNT-010','CNT-002','CNT-012','CNT-004'];
  const enrichedDocs=useMemo(()=>{
    const gedMap=new Map((docs||[]).map(d=>[d.id,d]));
    return (libDocs||[]).map((d,i)=>{
      /* contenantId */
      let doc=d;
      if(libContenants?.length){
        const validIds=new Set(libContenants.map(c=>c.id));
        if(!d.contenantId||!validIds.has(d.contenantId)){
          const cid=i<CONT_ASSIGN.length?CONT_ASSIGN[i]:null;
          if(cid&&validIds.has(cid))doc={...doc,contenantId:cid};
        }
      }
      /* Lien GED: enrichir avec le document numérique de SoftDocs */
      if(doc.gedDocId&&gedMap.has(doc.gedDocId)){
        doc={...doc,gedDoc:gedMap.get(doc.gedDocId)};
      }
      return doc;
    });
  },[libDocs,libContenants,docs]);

  const conts=libContenants||[];
  const common={documents:enrichedDocs,docTypes:docTypes,emplacements:empls,contenants:conts,users,gedDocs:docs,lang,t};
  const navigate=(p)=>setView(`lib-${p}`);

  const renderPage=()=>{
    switch(view){
      case"lib-dashboard":     return<LibDashboard {...common} onNavigate={navigate}/>;
      case"lib-documents":     return<LibDocuments {...common}/>;
      case"lib-emplacements":  return<LibEmplacements emplacements={empls} contenants={conts} documents={enrichedDocs} lang={lang} t={t}/>;
      case"lib-mouvements":    return<LibMouvements {...common} auditLogs={libAuditLog}/>;
      case"lib-consultations": return<LibConsultations documents={enrichedDocs} users={users} contenants={conts} emplacements={empls} lang={lang} t={t}/>;
      case"lib-courrier":      return<LibCourrier {...common}/>;
      case"lib-cycle-vie":     return<LibCycleVie documents={enrichedDocs} docTypes={docTypes} lang={lang} t={t}/>;
      case"lib-contenants":    return<LibContenants documents={enrichedDocs} emplacements={empls} contenants={conts} lang={lang} t={t}/>;
      case"lib-etat-synthese": return<LibReporting mode="synthese" {...common}/>;
      case"lib-etat-gestion":  return<LibReporting mode="gestion" {...common}/>;
      case"lib-inventaire":    return<LibInventaire documents={enrichedDocs} emplacements={empls} contenants={conts} users={users} lang={lang} t={t}/>;
      case"lib-integration-ged":return<LibIntegrationGED documents={enrichedDocs} gedDocs={docs} emplacements={empls} contenants={conts} users={users} lang={lang} t={t}/>;
      case"lib-admin":         return<LibAdmin docTypes={docTypes} auditLogs={libAuditLog} users={users} documents={enrichedDocs} emplacements={empls} contenants={conts} gedDocs={docs} lang={lang} t={t}/>;
       case"lib-mfp":           return<LibMFP documents={enrichedDocs} users={users} emplacements={empls} lang={lang} t={t}/>;
      default:                 return<LibDashboard {...common} onNavigate={navigate}/>;
    }
  };

  return(
    <div style={{display:"flex",height:"100vh",overflow:"hidden",
      background:C.surfaceAlt,fontFamily:"'DM Sans',-apple-system,sans-serif",
      color:C.text,position:"relative"}}>
      <style>{GLOBAL_STYLES}</style>

      {/* Mobile overlay */}
      {isMobile&&sidebarOpen&&(
        <div onClick={()=>setSidebarOpen(false)}
          style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:9998,animation:"fadeIn .2s ease"}}/>
      )}

      {/* Sidebar */}
      <div style={{
        ...(isMobile?{
          position:"fixed",left:0,top:0,bottom:0,zIndex:9999,
          transform:sidebarOpen?"translateX(0)":"translateX(-100%)",
          transition:"transform .3s cubic-bezier(.22,1,.36,1)",
          boxShadow:sidebarOpen?"4px 0 24px rgba(0,0,0,.2)":"none",
        }:{}),
      }}>
        <SidebarLib lang={lang||"fr"} t={t}/>
      </div>

      {/* Main */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>
        <TopbarLib authUser={authUser} isMobile={isMobile} onMenuToggle={()=>setSidebarOpen(p=>!p)}
          lang={lang||"fr"} changeLang={changeLang} t={t} pageLabel={getPageLabel(view,t)}/>
        <main style={{flex:1,overflowY:"auto",padding:isMobile?12:24,maxWidth:1400,
          width:"100%",margin:"0 auto",WebkitOverflowScrolling:"touch"}}>
          {renderPage()}
        </main>
      </div>

       <ChatBoxLib documents={enrichedDocs} contenants={conts} emplacements={empls} users={users} lang={lang||"fr"}/>
    </div>
  );
}
