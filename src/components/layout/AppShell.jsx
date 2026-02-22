"use client";
import{Sidebar}from"./Sidebar";
import{Topbar}from"./Topbar";
import{useApp}from"../../context/AppContext";
import{DOC_MENUS,filterDocsByMenu}from"../../lib/data";
import Dashboard from"../dashboard/Dashboard";
import{DocList}from"../documents/DocList";
import{DocDetail}from"../documents/DocDetail";
import{DepotDoc}from"../documents/DepotDoc";
import{SuiviDoc}from"../documents/SuiviDoc";
import GestionUsers from"../users/GestionUsers";
import PaiementsXML from"../payments/PaiementsXML";
import Liquidations from"../payments/Liquidations";
import ParamTypes from"../params/ParamTypes";
import ParamReceveurs from"../params/ParamReceveurs";
import{BG}from"../../lib/theme";

const getCtx=id=>{
  if(id==="recus-f")return"recus-f";
  if(id==="courrier")return"courrier";
  if(id==="envoyes")return"envoyes";
  if(id==="refuses"||id==="r-com"||id==="c-ref")return"refuses";
  return"en-cours";
};

export function AppShell(){
  const{view,setView,docs,addDoc,openDoc,selDoc,docCtx,updDoc}=useApp();
  const isDocMenu=DOC_MENUS.some(m=>m.id===view);

  return(
    <div style={{display:"flex",height:"100vh",overflow:"hidden",background:BG}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>
        <Topbar/>
        <main style={{flex:1,overflowY:"auto",padding:20}}>
          {view==="dashboard"   && <Dashboard/>}
          {view==="depot"       && <DepotDoc onDeposit={addDoc}/>}
          {view==="suivi"       && <SuiviDoc/>}
          {view==="liq"         && <Liquidations/>}
          {view==="paiements"   && <PaiementsXML/>}
          {view==="users"       && <GestionUsers/>}
          {view==="param_types" && <ParamTypes/>}
          {view==="param_recv"  && <ParamReceveurs/>}
          {view==="detail"&&selDoc&&(
            <DocDetail
              doc={selDoc}
              onBack={()=>{
                const back={"recus-f":"recus-f",courrier:"courrier",envoyes:"envoyes",refuses:"refuses","en-cours":"en-cours",recu:"recu"};
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
