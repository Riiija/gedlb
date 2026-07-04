"use client";
import{useEffect,useState}from"react";
import{Sidebar}from"./Sidebar";
import{Topbar}from"./Topbar";
import{SidebarEP}from"../epaiement/SidebarEP";
import{useApp}from"../../context/AppContext";
import{DOC_MENUS,filterDocsByMenu}from"../../lib/data";
import AppLauncher from"../home/AppLauncher";
import{useIsMobile}from"../../lib/useResponsive";
import Dashboard from"../dashboard/Dashboard";
import DashboardStats from"../dashboard/DashboardStats";
import{DocList}from"../documents/DocList";
import{DocDetail}from"../documents/DocDetail";
import{DepotDoc}from"../documents/DepotDoc";
import{SuiviDoc}from"../documents/SuiviDoc";
import GestionUsers from"../users/GestionUsers";
import GestionUsersEP from"../users/GestionUsersEP";
import GestionUsersPortail from"../users/GestionUsersPortail";
import GestionProjetsPortail from"../params/GestionProjetsPortail";
import ParamTypes from"../params/ParamTypes";
import ParamReceveurs from"../params/ParamReceveurs";
import ChampsDynamiques from"../params/ChampsDynamiques";
import GestionPermissions from"../params/GestionPermissions";
import ConfigMail from"../params/ConfigMail";
import GestionProjets from"../params/GestionProjets";
import GestionFournisseurs from"../params/GestionFournisseurs";
import PlanComptes from"../params/PlanComptes";
import Etats from"../reporting/Etats";
import ChatBox from"../chat/ChatBox";
import{ParamCausesRefus}from"../params/ParamCausesRefus";
import ParamRelance from"../params/ParamRelance";
import EPaiementDashboard from"../epaiement/EPaiementDashboard";
import EPEtatsRapports from"../epaiement/EPEtatsRapports";
import ListePaiements from"../epaiement/ListePaiements";
import Liquidations from"../payments/Liquidations";
import PaiementsXML from"../payments/PaiementsXML";
import NatureRemise from"../epaiement/NatureRemise";
import BaliseXML from"../epaiement/BaliseXML";
import MappageXML from"../epaiement/MappageXML";
import{BG,P,WH,DNG,DNGL,BD,MUT}from"../../lib/theme";
import SoftLibraryBackoffice from"../softLibrary/SoftLibraryBackoffice";
import SoftSignShell from"../softsign/SoftSignShell";
import SoftBudgetShell from"../softBudget/SoftBudgetShell";
import SoftSignImport from"../documents/SoftSignImport";
const getCtx=id=>{
  if(id==="recus-f")return"recus-f";
  if(id==="courrier")return"courrier";
  if(id==="envoyes")return"envoyes";
  if(id==="refuses"||id==="r-com"||id==="c-ref")return"refuses";
  if(id==="confids"||id==="c-enc"||id==="c-arc"||id==="c-com")return"confids";
  return"en-cours";
};

function LoginGate(){
  if(typeof window!=="undefined"){window.location.href="/login";return null;}
  return<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f0f4fa"}}><div style={{fontSize:14,color:"#6c757d"}}>Redirection…</div></div>;
}

/* ─── SOFTDOCS SHELL ─── */
function SoftDocsShell(){
  const{view,setView,docs,addDoc,openDoc,selDoc,docCtx,updDoc,authUser,recv,resetAllData,sidebarOpen,setSidebarOpen}=useApp();
  const doReset=()=>{resetAllData&&resetAllData();setShowReset(false);};
  const[showReset,setShowReset]=useState(false);
  const isDocMenu=DOC_MENUS.some(m=>m.id===view);
  const userId=authUser?.id||null;
  const isMobile=useIsMobile();

  /* Auto-close sidebar on mobile when navigating */
  useEffect(()=>{if(isMobile)setSidebarOpen(false);},[view]);

  return(
    <div style={{display:"flex",height:"100vh",overflow:"hidden",background:BG,position:"relative"}}>
      {/* Mobile sidebar overlay */}
      {isMobile&&sidebarOpen&&(
        <div onClick={()=>setSidebarOpen(false)}
          style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:9998,animation:"fadeIn .2s ease"}}/>
      )}

      {/* Sidebar: overlay on mobile, inline on desktop */}
      <div style={{
        ...(isMobile?{
          position:"fixed",left:0,top:0,bottom:0,zIndex:9999,
          transform:sidebarOpen?"translateX(0)":"translateX(-100%)",
          transition:"transform .3s cubic-bezier(.22,1,.36,1)",
          boxShadow:sidebarOpen?"4px 0 24px rgba(0,0,0,.2)":"none",
        }:{}),
      }}>
        <Sidebar onReset={()=>setShowReset(true)}/>
      </div>

      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>
        <Topbar/>
        <main style={{flex:1,overflowY:"auto",padding:isMobile?12:20,WebkitOverflowScrolling:"touch"}}>
          {view==="dashboard"        && <Dashboard/>}
          {view==="dashboard_stats"  && <DashboardStats/>}
          {view==="depot"            && <DepotDoc onDeposit={addDoc}/>}
          {view==="suivi"            && <SuiviDoc/>}
          {view==="users"            && <GestionUsers/>}
          {view==="portal-users"     && <GestionUsersPortail/>}
          {view==="portal-projets"   && <GestionProjetsPortail/>}
          {view==="param_types"      && <ParamTypes/>}
          {view==="param_recv"       && <ParamReceveurs/>}
          {view==="champs_dyn"       && <ChampsDynamiques/>}
          {view==="permissions"      && <GestionPermissions/>}
          {view==="config_mail"      && <ConfigMail/>}
          {view==="plan_comptes"     && <PlanComptes/>}
          {view==="gestion_projets"  && <GestionProjets/>}
          {view==="gestion_fournisseurs"&&<GestionFournisseurs/>}
          {view==="causes_refus"     && <ParamCausesRefus/>}
          {view==="param_relance"    && <ParamRelance/>}
          {(view==="etats"||view==="r1"||view==="r2"||view==="r3"||view==="r4"||view==="r5"||view==="r6"||view==="r7"||view==="r8"||view==="r9"||view==="r10"||view==="r11"||view==="r12"||view==="r13") && <Etats/>}
          {view==="detail"&&selDoc&&(
            <DocDetail doc={selDoc}
              onBack={()=>{const back={"recus-f":"recus-f",courrier:"courrier",envoyes:"envoyes",refuses:"refuses","en-cours":"en-cours",recu:"recu",confids:"confids","c-enc":"confids","c-ref":"confids","c-arc":"confids","c-com":"confids","r-com":"refuses",communs:"communs"};setView(back[docCtx]||"en-cours");}}
              onUpdate={updDoc} ctx={docCtx}/>
          )}
          {view==="softsign-import" && <SoftSignImport/>}
          {isDocMenu&&(()=>{
            const m=DOC_MENUS.find(x=>x.id===view);
            const userDocs=filterDocsByMenu(docs,view,userId,recv);
            return<DocList title={m.label} iconKey={m.iconKey||"folder"} docs={userDocs} onSel={d=>openDoc(d,getCtx(view))}/>;
          })()}
        </main>
      </div>
      <ChatBox/>
      {showReset&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:99999,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
          <div style={{background:"#fff",borderRadius:12,maxWidth:420,width:"100%",overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,.3)"}}>
            <div style={{background:"#c0392b",padding:"14px 20px",display:"flex",alignItems:"center",gap:10}}>
              <span style={{color:"#fff",fontWeight:700,fontSize:14}}>Réinitialiser les données</span>
            </div>
            <div style={{padding:"20px 24px"}}>
              <p style={{fontSize:13.5,color:"#212529",marginBottom:8,fontWeight:600}}>Toutes les données seront remises à zéro.</p>
            </div>
            <div style={{padding:"12px 20px",borderTop:"1px solid #e3e6ea",display:"flex",justifyContent:"flex-end",gap:10,background:"#f8f9fc"}}>
              <button onClick={()=>setShowReset(false)} style={{padding:"8px 16px",borderRadius:6,border:"1px solid #e3e6ea",background:"#fff",cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>Annuler</button>
              <button onClick={doReset} style={{padding:"8px 16px",borderRadius:6,border:"none",background:"#c0392b",color:"#fff",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit"}}>↺ Réinitialiser</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── EPAIEMENT SHELL ─── */
function EPaiementShell(){
  const{view,setView,sidebarOpen,setSidebarOpen}=useApp();
  const isMobile=useIsMobile();

  useEffect(()=>{if(isMobile)setSidebarOpen(false);},[view]);

  return(
    <div style={{display:"flex",height:"100vh",overflow:"hidden",background:BG,position:"relative"}}>
      {isMobile&&sidebarOpen&&(
        <div onClick={()=>setSidebarOpen(false)}
          style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:9998,animation:"fadeIn .2s ease"}}/>
      )}
      <div style={{
        ...(isMobile?{
          position:"fixed",left:0,top:0,bottom:0,zIndex:9999,
          transform:sidebarOpen?"translateX(0)":"translateX(-100%)",
          transition:"transform .3s cubic-bezier(.22,1,.36,1)",
          boxShadow:sidebarOpen?"4px 0 24px rgba(0,0,0,.2)":"none",
        }:{}),
      }}>
        <SidebarEP/>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>
        <Topbar/>
        <main style={{flex:1,overflowY:"auto",padding:isMobile?12:20,WebkitOverflowScrolling:"touch"}}>
          {view==="ep-dashboard"       && <EPaiementDashboard/>}
          {view==="ep-liq"             && <Liquidations/>}
          {view==="ep-liste-paiements" && <ListePaiements/>}
          {view==="ep-xml"             && <PaiementsXML/>}
          {["ep-kpi","ep-r-liq","ep-r-gen","ep-r-pai","ep-r-four","ep-r-proj"].includes(view) && <EPEtatsRapports/>}
          {view==="ep-nature-remise"   && <NatureRemise/>}
          {view==="ep-balise-xml"      && <BaliseXML/>}
          {view==="ep-mappage-xml"     && <MappageXML/>}
          {view==="ep-users"           && <GestionUsersEP/>}
          {!["ep-dashboard","ep-liq","ep-liste-paiements","ep-xml","ep-nature-remise","ep-balise-xml","ep-mappage-xml","ep-users","ep-kpi","ep-r-liq","ep-r-gen","ep-r-pai","ep-r-four","ep-r-proj"].includes(view)&&<EPaiementDashboard/>}
        </main>
      </div>
      <ChatBox/>
    </div>
  );
}

/* ─── MAIN ORCHESTRATOR ─── */
export function AppShell(){
  const{authed,authChecked,currentApp}=useApp();
  if(!authChecked)return<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f0f4fa"}}><div style={{fontSize:13,color:"#6c757d"}}>Chargement…</div></div>;
  if(!authed)return<LoginGate/>;
  if(currentApp==="home")return<AppLauncher/>;
  if(currentApp==="softdocs")return<SoftDocsShell/>;
  if(currentApp==="epaiement")return<EPaiementShell/>;
  if (currentApp === "softlibrary") return <SoftLibraryBackoffice />;
  if (currentApp === "softsign")   return <SoftSignShell />;
  if (currentApp === "softbudget") return <SoftBudgetShell />;
  return<AppLauncher/>;
}
