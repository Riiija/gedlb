"use client";
import{useState}from"react";
import{IC}from"../ui/Icons";
import{useApp}from"../../context/AppContext";
import{DOC_MENUS}from"../../lib/data";
import{P,WH,BD,DNG,DNGL,DNGD,bdg,btn,RSm,TR,MUT}from"../../lib/theme";
import{useT}from"../../lib/i18n";

const VIEW_LABELS_FR={
  dashboard:"Tableau de bord",depot:"Déposer un document",suivi:"Suivi document",
  detail:"Détail document",liq:"Liquidations",paiements:"Paiements XML",
  users:"Utilisateurs & droits",param_types:"Types de documents",param_recv:"Receveurs",
  champs_dyn:"Champs dynamiques globaux",etats:"États & Rapports",dashboard_stats:"Stats & KPIs",
  "ep-dashboard":"Tableau de bord","ep-liq":"Liquidations","ep-liste-paiements":"Liste des paiements",
  "ep-xml":"Génération fichier banque","ep-nature-remise":"Nature de remise",
  "ep-balise-xml":"Balise XML","ep-mappage-xml":"Mappage XML — Banques",
};
const VIEW_LABELS_EN={
  ...VIEW_LABELS_FR,
  dashboard:"Dashboard",depot:"Submit document",suivi:"Track document",
  detail:"Document detail",liq:"Liquidations",paiements:"XML Payments",
  users:"Users & rights",param_types:"Document types",param_recv:"Recipients",
  champs_dyn:"Dynamic fields",etats:"Reports",dashboard_stats:"Stats & KPIs",
  "ep-dashboard":"EP Dashboard","ep-liq":"Liquidations","ep-liste-paiements":"Payment List",
  "ep-xml":"Generate Bank File","ep-nature-remise":"Remittance Type",
  "ep-balise-xml":"XML Tags","ep-mappage-xml":"Bank Mapping",
};
// VIEW_LABELS resolved per lang below

const FLAG={fr:"🇫🇷",en:"🇬🇧"};
const LANG_LABEL={fr:"FR",en:"EN"};

function AppSwitcher({currentApp,setCurrentApp,setView}){
  const[open,setOpen]=useState(false);
  const apps=[
    {id:"softdocs",name:"SoftDocs",sub:"GED & Finances",color:"#324372",logo:"/softdocs-logo-final.png",icon:null},
    {id:"epaiement",name:"Soft e-Payment",sub:"Liquidations & Paiements",color:"#2a2d8f",logo:"/softepayment-logo.png",icon:null},
    {id:"softlibrary",name:"Soft Library",tagline:"Archives Physiques",color:"#0c4a6e",logo:"/softlibrary.png"},

  ];
  const cur=apps.find(a=>a.id===currentApp)||apps[0];
  return(
    <div style={{position:"relative",flexShrink:0}}>
      <button onClick={()=>setOpen(p=>!p)}
        style={{display:"inline-flex",alignItems:"center",gap:8,padding:"6px 12px",borderRadius:6,border:"1px solid #e3e6ea",background:"#f8f9fc",cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}
        onMouseEnter={e=>e.currentTarget.style.background="#eef1f8"}
        onMouseLeave={e=>e.currentTarget.style.background="#f8f9fc"}>
        {cur.id==="softdocs"
          ?<img src="/softdocs-logo-final.png" alt="SD" style={{height:18,objectFit:"contain",flexShrink:0}}/>
          :<span style={{display:"flex",color:cur.color}}>{cur.icon}</span>
        }
        <span style={{fontSize:12.5,fontWeight:700,color:cur.color}}>{cur.name}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#6c757d" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      {open&&(
        <div style={{position:"absolute",left:0,top:42,background:"#fff",border:"1px solid #e3e6ea",borderRadius:8,boxShadow:"0 8px 24px rgba(0,0,0,.12)",zIndex:9999,minWidth:220,overflow:"hidden"}}>
          <div style={{padding:"8px 14px",borderBottom:"1px solid #f0f2f5",fontSize:10.5,fontWeight:700,color:"#6c757d",textTransform:"uppercase",letterSpacing:".08em"}}>Changer d'application</div>
          {apps.map(a=>(
            <button key={a.id} onClick={()=>{setCurrentApp(a.id);setView(a.id==="softdocs"?"dashboard":"ep-dashboard");setOpen(false);}}
              style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"10px 14px",border:"none",background:currentApp===a.id?"#f0f7ff":"transparent",cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}
              onMouseEnter={e=>e.currentTarget.style.background=currentApp===a.id?"#e8f2ff":"#f8f9fc"}
              onMouseLeave={e=>e.currentTarget.style.background=currentApp===a.id?"#f0f7ff":"transparent"}>
              <div style={{width:32,height:32,borderRadius:8,background:"#f0f4ff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,padding:4}}>
                <img src={a.logo} alt={a.name} style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain"}}/>
              </div>
              <div><div style={{fontSize:13,fontWeight:700,color:"#212529"}}>{a.name}</div><div style={{fontSize:11,color:"#6c757d"}}>{a.sub}</div></div>
              {currentApp===a.id&&<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={a.color} strokeWidth="2.5" strokeLinecap="round" style={{marginLeft:"auto"}}><polyline points="20 6 9 17 4 12"/></svg>}
            </button>
          ))}
          <div style={{padding:"8px",borderTop:"1px solid #f0f2f5"}}>
            <button onClick={()=>{setCurrentApp("home");setOpen(false);}}
              style={{width:"100%",padding:"7px 10px",borderRadius:6,border:"none",background:"#f8f9fc",cursor:"pointer",fontSize:12,fontWeight:600,color:"#6c757d",fontFamily:"inherit"}}>
              ⊞ Accueil — toutes les applications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function Topbar(){
  const{view,setView,setSidebarOpen,sidebarOpen,docs,lang,changeLang,authUser,logout,currentApp,setCurrentApp}=useApp();
  const isEP=currentApp==="epaiement";
  const t=useT(lang);
  const VIEW_LABELS=lang==="en"?VIEW_LABELS_EN:VIEW_LABELS_FR;
  const[notifOpen,setNotifOpen]=useState(false);
  const[langOpen,setLangOpen]=useState(false);
  const retards=docs.filter(d=>d.st==="EN RETARD").length;

  const crumbs=[{l:t.dashboard,v:"dashboard"}];
  const docMenu=DOC_MENUS.find(m=>m.id===view);
  if(docMenu)     {crumbs.push({l:t.documents,v:null},{l:docMenu.label,v:null});}
  else if(view==="liq"||view==="paiements"){crumbs.push({l:t.financier,v:null},{l:VIEW_LABELS[view],v:null});}
  else if(["users","param_types","param_recv","champs_dyn"].includes(view)){crumbs.push({l:t.parametrage,v:null},{l:VIEW_LABELS[view]||t.champsDyn,v:null});}
  else if(view==="etats"||view==="dashboard_stats"){crumbs.push({l:t.etatsRapports,v:null},{l:VIEW_LABELS[view]||"Stats & KPIs",v:null});}
  else if(view==="ep-dashboard"){crumbs.push({l:"Soft e-Payment",v:null},{l:VIEW_LABELS["ep-dashboard"],v:null});}
  else if(view&&view.startsWith("ep-")){
    const sec=view.startsWith("ep-nature")||view.startsWith("ep-balise")||view.startsWith("ep-mappage")
      ?(lang==="en"?"EP Settings":t.parametrageEP||"Paramétrage")
      :view.startsWith("ep-liq")?"Liquidations"
      :"Paiements";
    crumbs.push({l:"Soft e-Payment",v:null},{l:sec,v:null},{l:VIEW_LABELS[view]||view,v:null});
  }
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

        {/* App Switcher */}
        <AppSwitcher currentApp={currentApp} setCurrentApp={setCurrentApp} setView={setView}/>

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

          {/* SoftDocs-only buttons */}
          {currentApp==="softdocs"&&(
            <button onClick={()=>setView("depot")} style={btn("primary",true)}>
              <span style={{display:"flex"}}>{IC.upload}</span> {lang==="en"?"Upload":"Déposer"}
            </button>
          )}
          {currentApp==="epaiement"&&(
            <button onClick={()=>setView("ep-liq")} style={{...btn("primary",true),background:"#1a6b3c",borderColor:"#1a6b3c"}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              Liquidations
            </button>
          )}

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

      </div>
    </header>
  );
}
