"use client";
import{useState}from"react";
import{IC}from"../ui/Icons";
import{useApp}from"../../context/AppContext";
import{DOC_MENUS}from"../../lib/data";
import{P,WH,BD,DNG,DNGL,DNGD,bdg,btn,RSm,TR,MUT}from"../../lib/theme";

const VIEW_LABELS={
  dashboard:"Tableau de bord",depot:"Déposer un document",suivi:"Suivi document",
  detail:"Détail document",liq:"Liquidations",paiements:"Paiements XML",
  users:"Utilisateurs & droits",param_types:"Types de documents",param_recv:"Receveurs",
};
DOC_MENUS.forEach(m=>{VIEW_LABELS[m.id]=m.label;});

export function Topbar(){
  const{view,setView,setSidebarOpen,sidebarOpen,docs}=useApp();
  const[notifOpen,setNotifOpen]=useState(false);
  const retards=docs.filter(d=>d.st==="EN RETARD").length;

  const crumbs=[{l:"Accueil",v:"dashboard"}];
  const docMenu=DOC_MENUS.find(m=>m.id===view);
  if(docMenu)     {crumbs.push({l:"Documents",v:null},{l:docMenu.label,v:null});}
  else if(view==="liq"||view==="paiements"){crumbs.push({l:"Financier",v:null},{l:VIEW_LABELS[view],v:null});}
  else if(["users","param_types","param_recv"].includes(view)){crumbs.push({l:"Paramétrage",v:null},{l:VIEW_LABELS[view],v:null});}
  else if(view!=="dashboard"){crumbs.push({l:VIEW_LABELS[view]||view,v:null});}

  return(
    <header>
      {/* Top navbar */}
      <div style={{background:WH,borderBottom:`1px solid ${BD}`,height:56,display:"flex",alignItems:"center",padding:"0 20px",gap:16,flexShrink:0,boxShadow:"0 1px 0 rgba(0,0,0,.05)"}}>
        {/* Sidebar toggle */}
        <button onClick={()=>setSidebarOpen(!sidebarOpen)}
          style={{background:"none",border:"none",color:MUT,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",width:32,height:32,borderRadius:4,transition:TR}}
          onMouseEnter={e=>e.currentTarget.style.background="#f0f2f5"}
          onMouseLeave={e=>e.currentTarget.style.background="none"}>
          <span style={{display:"flex"}}>{IC.menu}</span>
        </button>

        {/* Search */}
        <div style={{flex:1,maxWidth:360}}>
          <div style={{position:"relative"}}>
            <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#adb5bd",display:"flex"}}>{IC.search}</span>
            <input placeholder="Rechercher document, référence…"
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

          {/* Quick deposit */}
          <button onClick={()=>setView("depot")} style={btn("primary",true)}>
            <span style={{display:"flex"}}>{IC.upload}</span> Déposer
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
                  <b style={{fontSize:13,color:"#212529"}}>Notifications</b>
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

          {/* User avatar */}
          <div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",borderRadius:RSm,cursor:"pointer",border:`1px solid ${BD}`,transition:TR}}
            onMouseEnter={e=>e.currentTarget.style.background="#f8f9fc"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div style={{width:28,height:28,borderRadius:"50%",background:P,color:WH,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:11}}>RL</div>
            <div style={{lineHeight:1.2}}>
              <div style={{fontSize:12.5,fontWeight:600,color:"#212529"}}>Randria Lova</div>
              <div style={{fontSize:11,color:MUT}}>Super Admin</div>
            </div>
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
            <span style={{display:"flex"}}>{IC.file}</span> {docs.length} documents
          </span>
          <span style={{...bdg("#fff3cd","#856404",{fontSize:11}),display:"inline-flex",alignItems:"center",gap:4}}>
            <span style={{display:"flex"}}>{IC.clock}</span> {docs.filter(d=>["EN VALIDATION","EN RETARD"].includes(d.st)).length} en cours
          </span>
          {retards>0&&(
            <span style={{...bdg("#f8d7da","#721c24",{fontSize:11}),display:"inline-flex",alignItems:"center",gap:4}}>
              <span style={{display:"flex"}}>{IC.alertTri}</span> {retards} en retard
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
