"use client";
import{useEffect}from"react";
import{Sidebar}from"./Sidebar";
import{Topbar}from"./Topbar";
import{useApp}from"../../context/AppContext";
import{DOC_MENUS,filterDocsByMenu}from"../../lib/data";
import Dashboard from"../dashboard/Dashboard";
import DashboardStats from"../dashboard/DashboardStats";
import{DocList}from"../documents/DocList";
import{DocDetail}from"../documents/DocDetail";
import{DepotDoc}from"../documents/DepotDoc";
import{SuiviDoc}from"../documents/SuiviDoc";
import GestionUsers from"../users/GestionUsers";
import PaiementsXML from"../payments/PaiementsXML";
import Liquidations from"../payments/Liquidations";
import ParamTypes from"../params/ParamTypes";
import ParamReceveurs from"../params/ParamReceveurs";
import ChampsDynamiques from"../params/ChampsDynamiques";
import GestionPermissions from"../params/GestionPermissions";
import Etats from"../reporting/Etats";
import{BG,P,WH}from"../../lib/theme";

const getCtx=id=>{
  if(id==="recus-f")return"recus-f";
  if(id==="courrier")return"courrier";
  if(id==="envoyes")return"envoyes";
  if(id==="refuses"||id==="r-com"||id==="c-ref")return"refuses";
  if(id==="confids"||id==="c-enc"||id==="c-arc"||id==="c-com")return"confids";
  return"en-cours";
};

/* Login redirect gate for backoffice */
function LoginGate(){
  /* Redirect to standalone login page */
  if(typeof window!=="undefined"){
    window.location.href="/login";
    return null;
  }
  return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f0f4fa"}}>
      <div style={{fontSize:14,color:"#6c757d"}}>Redirection…</div>
    </div>
  );
}

export function AppShell(){
  const{view,setView,docs,addDoc,openDoc,selDoc,docCtx,updDoc,authed,authChecked}=useApp();
  const isDocMenu=DOC_MENUS.some(m=>m.id===view);

  /* Still reading localStorage — show neutral loader, never redirect yet */
  if(!authChecked)return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f0f4fa"}}>
      <div style={{fontSize:13,color:"#6c757d"}}>Chargement…</div>
    </div>
  );

  if(!authed)return<LoginGate/>;

  return(
    <div style={{display:"flex",height:"100vh",overflow:"hidden",background:BG}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>
        <Topbar/>
        <main style={{flex:1,overflowY:"auto",padding:20}}>
          {view==="dashboard"   && <Dashboard/>}
          {view==="dashboard_stats" && <DashboardStats/>}
          {view==="depot"       && <DepotDoc onDeposit={addDoc}/>}
          {view==="suivi"       && <SuiviDoc/>}
          {view==="liq"         && <Liquidations/>}
          {view==="paiements"   && <PaiementsXML/>}
          {view==="users"       && <GestionUsers/>}
          {view==="param_types" && <ParamTypes/>}
          {view==="param_recv"  && <ParamReceveurs/>}
          {view==="champs_dyn"  && <ChampsDynamiques/>}
          {view==="permissions" && <GestionPermissions/>}
          {view==="etats"       && <Etats/>}
          {view==="detail"&&selDoc&&(
            <DocDetail
              doc={selDoc}
              onBack={()=>{
                const back={"recus-f":"recus-f",courrier:"courrier",envoyes:"envoyes",refuses:"refuses","en-cours":"en-cours",recu:"recu",confids:"confids","c-enc":"confids","c-ref":"confids","c-arc":"confids","c-com":"confids","r-com":"refuses",communs:"communs"};
                setView(back[docCtx]||"en-cours");
              }}
              onUpdate={updDoc}
              ctx={docCtx}
            />
          )}
          {isDocMenu&&(()=>{
            const m=DOC_MENUS.find(x=>x.id===view);
            return(
              <DocList
                title={m.label}
                iconKey={m.iconKey||"folder"}
                docs={filterDocsByMenu(docs,view)}
                onSel={d=>openDoc(d,getCtx(view))}
              />
            );
          })()}
        </main>
      </div>
    </div>
  );
}
