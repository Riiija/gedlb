"use client";
import{createContext,useContext,useState}from"react";
import{INIT_DOCS,INIT_USERS,INIT_TYPES,INIT_SCHEMAS,INIT_RECV,INIT_LIQ}from"../lib/data";

const AppCtx=createContext(null);

export function AppProvider({children}){
  const[docs,setDocs]=useState(INIT_DOCS);
  const[users,setUsers]=useState(INIT_USERS);
  const[types,setTypes]=useState(INIT_TYPES);
  const[schemas,setSchemas]=useState(INIT_SCHEMAS);
  const[recv,setRecv]=useState(INIT_RECV);
  const[liq,setLiq]=useState(INIT_LIQ);
  const[view,setView]=useState("dashboard");
  const[selDoc,setSelDoc]=useState(null);
  const[docCtx,setDocCtx]=useState("en-cours");
  const[sidebarOpen,setSidebarOpen]=useState(true);

  const addDoc=d=>setDocs(p=>[...p,d]);
  const updDoc=u=>{setDocs(p=>p.map(d=>d.id===u.id?u:d));setSelDoc(u);};
  const openDoc=(d,ctx)=>{setSelDoc(d);setDocCtx(ctx||"en-cours");setView("detail");};

  return(
    <AppCtx.Provider value={{docs,setDocs,users,setUsers,types,setTypes,schemas,setSchemas,recv,setRecv,liq,setLiq,view,setView,selDoc,setSelDoc,docCtx,setDocCtx,sidebarOpen,setSidebarOpen,addDoc,updDoc,openDoc}}>
      {children}
    </AppCtx.Provider>
  );
}
export const useApp=()=>useContext(AppCtx);
