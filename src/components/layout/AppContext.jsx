"use client";
import{createContext,useContext,useState,useEffect,useCallback}from"react";
import{
  INIT_DOCS,INIT_USERS,INIT_TYPES,INIT_SCHEMAS,INIT_RECV,INIT_LIQ,INIT_CHAMPS_DYN,
  INIT_PLAN_COMPTES,INIT_MAIL_CONFIG,INIT_PROJETS,INIT_FOURNISSEURS_COMPTES,INIT_CAUSES_REFUS
}from"../lib/data";

const AppCtx=createContext(null);

/* ── localStorage helpers ── */
const LS="softdocs_";
const lsGet=(k)=>{try{const v=localStorage.getItem(LS+k);return v?JSON.parse(v):null;}catch{return null;}};
const lsSet=(k,v)=>{try{localStorage.setItem(LS+k,JSON.stringify(v));}catch{}};
const lsDel=(k)=>{try{localStorage.removeItem(LS+k);}catch{}};

/* ── All persisted keys ── */
const KEYS=["docs","users","types","schemas","recv","liq","champsDyn","planComptes","mailConfig","projets","fournComptes","causesRefus"];

export const BACKOFFICE_USERS=[
  {id:"U000",nom:"Administrateur Global", role:"Super Admin",       systemRole:"superadmin",init:"AG",email:"admin@softwell.mg",    password:"admin@2025", apps:["softdocs","epaiement"]},
  {id:"U001",nom:"Rakoto Jean-Baptiste",  role:"Chef de Projet",    systemRole:"standard",  init:"RJ",email:"rakoto@softdocs.mg",   password:"chef2025",   apps:["softdocs"]},
  {id:"U002",nom:"Randria Marie-Claire",  role:"Resp. Financier",   systemRole:"admin",     init:"RM",email:"randria@softdocs.mg",  password:"admin123",   apps:["softdocs","epaiement"]},
  {id:"U003",nom:"Razafy Pierre",         role:"DAF",               systemRole:"superadmin",init:"RP",email:"razafy@softdocs.mg",   password:"daf2025",    apps:["softdocs","epaiement"]},
  {id:"U004",nom:"Rasoamanarivo Hanta",   role:"Comptable Senior",  systemRole:"standard",  init:"RH",email:"hanta@softdocs.mg",   password:"compta2025", apps:["softdocs","epaiement"]},
  {id:"U005",nom:"Andriamananjara Lova",  role:"Ordonnateur",       systemRole:"admin",     init:"AL",email:"lova@softdocs.mg",    password:"ordo2025",   apps:["softdocs","epaiement"]},
  {id:"U006",nom:"Ratsimbazafy Noro",     role:"Gestionnaire Docs", systemRole:"standard",  init:"RN",email:"noro@softdocs.mg",    password:"gest2025",   apps:["softdocs"]},
];

export function AppProvider({children}){
  /* ── State (initialized from localStorage or initial data) ── */
  const[docs,          setDocs]          =useState(()=>lsGet("docs")||INIT_DOCS);
  const[users,         setUsers]         =useState(()=>lsGet("users")||INIT_USERS);
  const[types,         setTypes]         =useState(()=>lsGet("types")||INIT_TYPES);
  const[schemas,       setSchemas]       =useState(()=>lsGet("schemas")||INIT_SCHEMAS);
  const[recv,          setRecv]          =useState(()=>lsGet("recv")||INIT_RECV);
  const[liq,           setLiq]           =useState(()=>lsGet("liq")||INIT_LIQ);
  const[champsDyn,     setChampsDyn]     =useState(()=>lsGet("champsDyn")||INIT_CHAMPS_DYN);
  const[planComptes,   setPlanComptes]   =useState(()=>lsGet("planComptes")||INIT_PLAN_COMPTES);
  const[mailConfig,    setMailConfig]    =useState(()=>lsGet("mailConfig")||INIT_MAIL_CONFIG);
  const[projets,       setProjets]       =useState(()=>lsGet("projets")||INIT_PROJETS);
  const[fournComptes,  setFournComptes]  =useState(()=>lsGet("fournComptes")||INIT_FOURNISSEURS_COMPTES);
  const[causesRefus,   setCausesRefus]   =useState(()=>lsGet("causesRefus")||INIT_CAUSES_REFUS);

  /* ── UI state ── */
  const[view,        setView]        =useState("dashboard");
  const[selDoc,      setSelDoc]      =useState(null);
  const[docCtx,      setDocCtx]      =useState("en-cours");
  const[sidebarOpen, setSidebarOpen] =useState(true);
  const[authUser,    setAuthUser]    =useState(null);
  const[authed,      setAuthed]      =useState(false);
  const[authChecked, setAuthChecked] =useState(false);
  const[lang,        setLang]        =useState("fr");
  const[etatReport,  setEtatReport]  =useState("r1");
  const[currentApp,  setCurrentApp]  =useState(()=>{
    try{return localStorage.getItem("softdocs_currentApp")||"home";}catch{return"home";}
  });

  /* ── Persistence: auto-save all data state to localStorage ── */
  useEffect(()=>{try{localStorage.setItem("softdocs_currentApp",currentApp);}catch{};},[currentApp]);
  useEffect(()=>{lsSet("docs",docs);},[docs]);
  useEffect(()=>{lsSet("users",users);},[users]);
  useEffect(()=>{lsSet("types",types);},[types]);
  useEffect(()=>{lsSet("schemas",schemas);},[schemas]);
  useEffect(()=>{lsSet("recv",recv);},[recv]);
  useEffect(()=>{lsSet("liq",liq);},[liq]);
  useEffect(()=>{lsSet("champsDyn",champsDyn);},[champsDyn]);
  useEffect(()=>{lsSet("planComptes",planComptes);},[planComptes]);
  useEffect(()=>{lsSet("mailConfig",mailConfig);},[mailConfig]);
  useEffect(()=>{lsSet("projets",projets);},[projets]);
  useEffect(()=>{lsSet("fournComptes",fournComptes);},[fournComptes]);
  useEffect(()=>{lsSet("causesRefus",causesRefus);},[causesRefus]);

  /* ── Auth restore ── */
  useEffect(()=>{
    const saved=lsGet("auth");
    if(saved){
      /* Fusionner avec BACKOFFICE_USERS pour avoir systemRole toujours à jour */
      const fresh=BACKOFFICE_USERS.find(u=>u.id===saved.id);
      setAuthUser(fresh?{...saved,systemRole:fresh.systemRole,apps:fresh.apps}:saved);
      setAuthed(true);
    }
    const savedLang=lsGet("lang");
    if(savedLang&&["fr","en"].includes(savedLang))setLang(savedLang);
    setAuthChecked(true);
  },[]);

  /* ── RESET — wipe all data back to initial ── */
  const resetAllData=useCallback(()=>{
    KEYS.forEach(k=>lsDel(k));
    setDocs(INIT_DOCS);
    setUsers(INIT_USERS);
    setTypes(INIT_TYPES);
    setSchemas(INIT_SCHEMAS);
    setRecv(INIT_RECV);
    setLiq(INIT_LIQ);
    setChampsDyn(INIT_CHAMPS_DYN);
    setPlanComptes(INIT_PLAN_COMPTES);
    setMailConfig(INIT_MAIL_CONFIG);
    setProjets(INIT_PROJETS);
    setFournComptes(INIT_FOURNISSEURS_COMPTES);
    setView("dashboard");
    setSelDoc(null);
  },[]);

  /* ── Fournisseur docs on mount (merge) ── */
  useEffect(()=>{
    const fourn=lsGet("fourn_docs");
    if(fourn?.length){
      setDocs(p=>{
        const ids=new Set(p.map(d=>d.id));
        return[...p,...fourn.filter(d=>!ids.has(d.id))];
      });
    }
  },[]);

  /* ── Doc helpers ── */
  const addDoc=(d)=>{
    setDocs(p=>{
      const nd=[d,...p];
      lsSet("all_docs",nd);
      return nd;
    });
  };

  const updDoc=(u)=>{
    setDocs(p=>{
      const nd=p.map(d=>d.id===u.id?u:d);
      lsSet("all_docs",nd);
      return nd;
    });
    setSelDoc(u);
  };

  const openDoc=(doc,ctx)=>{setSelDoc(doc);setDocCtx(ctx);setView("detail");};

  /* ── Auth ── */
  const login=(user)=>{setAuthUser(user);setAuthed(true);lsSet("auth",user);};
  const logout=()=>{setAuthUser(null);setAuthed(false);lsDel("auth");};

  /* ── Language ── */
  const changeLang=(l)=>{setLang(l);lsSet("lang",l);};

  return(
    <AppCtx.Provider value={{
      docs,setDocs,users,setUsers,types,setTypes,
      schemas,setSchemas,recv,setRecv,liq,setLiq,
      champsDyn,setChampsDyn,planComptes,setPlanComptes,
      mailConfig,setMailConfig,
      projets,setProjets,
      fournComptes,setFournComptes,
      causesRefus,setCausesRefus,
      resetAllData,
      view,setView,selDoc,setSelDoc,docCtx,setDocCtx,currentApp,setCurrentApp,etatReport,setEtatReport,
      sidebarOpen,setSidebarOpen,
      authUser,authed,authChecked,login,logout,
      lang,changeLang,
      addDoc,updDoc,openDoc,
    }}>
      {children}
    </AppCtx.Provider>
  );
}

export const useApp=()=>{const c=useContext(AppCtx);if(!c)throw new Error("useApp outside AppProvider");return c;};