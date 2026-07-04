"use client";
import{createContext,useContext,useState,useEffect,useCallback}from"react";
import{
  INIT_DOCS,INIT_USERS,INIT_TYPES,INIT_SCHEMAS,INIT_RECV,INIT_LIQ,INIT_CHAMPS_DYN,
  INIT_PLAN_COMPTES,INIT_MAIL_CONFIG,INIT_PROJETS,INIT_FOURNISSEURS_COMPTES,INIT_CAUSES_REFUS,
  LIB_DOCUMENTS,LIB_DOC_TYPES,LIB_EMPLACEMENTS,LIB_AUDIT_LOG
}from"../lib/data";
import{INIT_EP_PAIEMENTS}from"../lib/epaiementPayments";
import{DEFAULT_LICENSE_CONFIG,cloneLicenseConfig,normalizeLicenseConfig}from"../lib/licenses";

const AppCtx=createContext(null);

/* ── Contenants physiques (liaison emplacementId → EMP-xxx) ── */
const LIB_CONTENANTS=[
  {id:'CNT-001',label:'Carton Archives DG 2024',type:'carton',statut:'ouvert',capacite:300,contenu:245,parentId:null,emplacementId:'EMP-001',codeBarres:'CNT001-2024-DG',dateCreation:'2024-01-15',description:'Carton principal Direction Générale 2024'},
  {id:'CNT-002',label:'Boîte Contrats Q1 2025',type:'boite',statut:'ouvert',capacite:80,contenu:52,parentId:'CNT-001',emplacementId:'EMP-001',codeBarres:'CNT002-Q1-25',dateCreation:'2025-01-10'},
  {id:'CNT-003',label:'Dossier Prestation JIRAMA',type:'dossier',statut:'ouvert',capacite:25,contenu:18,parentId:'CNT-002',emplacementId:'EMP-001',codeBarres:'CNT003-JIR',dateCreation:'2025-01-12'},
  {id:'CNT-004',label:'Chemise Annexes contrat',type:'chemise',statut:'ouvert',capacite:10,contenu:7,parentId:'CNT-003',emplacementId:'EMP-001',codeBarres:'CNT004-ANN',dateCreation:'2025-01-12'},
  {id:'CNT-005',label:'Carton RH Dossiers actifs',type:'carton',statut:'ferme',capacite:200,contenu:198,parentId:null,emplacementId:'EMP-002',codeBarres:'CNT005-RH-ACT',dateCreation:'2024-03-01'},
  {id:'CNT-006',label:'Boîte Paie 2024',type:'boite',statut:'scelle',capacite:100,contenu:100,parentId:'CNT-005',emplacementId:'EMP-002',codeBarres:'CNT006-PAIE24',dateCreation:'2024-06-15'},
  {id:'CNT-007',label:'Boîte Factures fournisseurs',type:'boite',statut:'ouvert',capacite:120,contenu:89,parentId:null,emplacementId:'EMP-003',codeBarres:'CNT007-FACT',dateCreation:'2025-01-05'},
  {id:'CNT-008',label:'Classeur Juridique 2024',type:'classeur',statut:'ouvert',capacite:50,contenu:42,parentId:null,emplacementId:'EMP-005',codeBarres:'CNT008-JUR24',dateCreation:'2024-02-01'},
  {id:'CNT-009',label:'Lot Archives définitives Q2',type:'lot',statut:'scelle',capacite:500,contenu:478,parentId:null,emplacementId:'EMP-007',codeBarres:'CNT009-DEF-Q2',dateCreation:'2024-09-01'},
  {id:'CNT-010',label:'Carton Transit Tamatave',type:'carton',statut:'transit',capacite:250,contenu:180,parentId:null,emplacementId:'EMP-009',codeBarres:'CNT010-TAM',dateCreation:'2025-02-20'},
  {id:'CNT-011',label:'Dossier Client BNI',type:'dossier',statut:'ouvert',capacite:30,contenu:12,parentId:'CNT-007',emplacementId:'EMP-003',codeBarres:'CNT011-BNI',dateCreation:'2025-02-01'},
  {id:'CNT-012',label:'Boîte Correspondance 2025',type:'boite',statut:'ouvert',capacite:60,contenu:15,parentId:null,emplacementId:'EMP-004',codeBarres:'CNT012-COR25',dateCreation:'2025-01-02'},
];

const LS="softdocs_";
const lsGet=(k)=>{try{const v=localStorage.getItem(LS+k);return v?JSON.parse(v):null;}catch{return null;}};
const lsSet=(k,v)=>{try{localStorage.setItem(LS+k,JSON.stringify(v));}catch{}};
const lsDel=(k)=>{try{localStorage.removeItem(LS+k);}catch{}};

const KEYS=["docs","users","types","schemas","recv","liq","epPaiements","champsDyn","planComptes","mailConfig","projets","fournComptes","causesRefus","libDocs","licenseConfig"];

export const BACKOFFICE_USERS=[
  {id:"U000",nom:"Administrateur Global", role:"Super Admin",       systemRole:"superadmin",init:"AG",email:"admin@softwell.mg",    password:"admin@2025", apps:["softdocs","epaiement","softlibrary","softsign","softbudget"]},
  {id:"U001",nom:"Rakoto Jean-Baptiste",  role:"Chef de Projet",    systemRole:"standard",  init:"RJ",email:"rakoto@softdocs.mg",   password:"chef2025",   apps:["softdocs","softlibrary","softsign","softbudget"]},
  {id:"U002",nom:"Randria Marie-Claire",  role:"Resp. Financier",   systemRole:"admin",     init:"RM",email:"randria@softdocs.mg",  password:"admin123",   apps:["softdocs","epaiement","softlibrary","softsign","softbudget"]},
  {id:"U003",nom:"Razafy Pierre",         role:"DAF",               systemRole:"superadmin",init:"RP",email:"razafy@softdocs.mg",   password:"daf2025",    apps:["softdocs","epaiement","softlibrary","softsign","softbudget"]},
  {id:"U004",nom:"Rasoamanarivo Hanta",   role:"Comptable Senior",  systemRole:"standard",  init:"RH",email:"hanta@softdocs.mg",   password:"compta2025", apps:["softdocs","epaiement","softlibrary","softbudget"]},
  {id:"U005",nom:"Andriamananjara Lova",  role:"Ordonnateur",       systemRole:"admin",     init:"AL",email:"lova@softdocs.mg",    password:"ordo2025",   apps:["softdocs","epaiement","softlibrary","softsign","softbudget"]},
  {id:"U006",nom:"Ratsimbazafy Noro",     role:"Gestionnaire Docs", systemRole:"standard",  init:"RN",email:"noro@softdocs.mg",    password:"gest2025",   apps:["softdocs","softlibrary","softbudget"]},
];

export function AppProvider({children}){
  /* ── SoftDocs (GED numérique) ── */
  const[docs,          setDocs]          =useState(()=>lsGet("docs")||INIT_DOCS);
  const[users,         setUsers]         =useState(()=>lsGet("users")||INIT_USERS);
  const[types,         setTypes]         =useState(()=>lsGet("types")||INIT_TYPES);
  const[schemas,       setSchemas]       =useState(()=>lsGet("schemas")||INIT_SCHEMAS);
  const[recv,          setRecv]          =useState(()=>lsGet("recv")||INIT_RECV);
  const[liq,           setLiq]           =useState(()=>lsGet("liq")||INIT_LIQ);
  const[epPaiements,   setEpPaiements]   =useState(()=>lsGet("epPaiements")||INIT_EP_PAIEMENTS);
  const[champsDyn,     setChampsDyn]     =useState(()=>lsGet("champsDyn")||INIT_CHAMPS_DYN);
  const[planComptes,   setPlanComptes]   =useState(()=>lsGet("planComptes")||INIT_PLAN_COMPTES);
  const[mailConfig,    setMailConfig]    =useState(()=>lsGet("mailConfig")||INIT_MAIL_CONFIG);
  const[projets,       setProjets]       =useState(()=>lsGet("projets")||INIT_PROJETS);
  const[fournComptes,  setFournComptes]  =useState(()=>lsGet("fournComptes")||INIT_FOURNISSEURS_COMPTES);
  const[causesRefus,   setCausesRefus]   =useState(()=>lsGet("causesRefus")||INIT_CAUSES_REFUS);
  const[licenseConfig, setLicenseConfig] =useState(()=>normalizeLicenseConfig(lsGet("licenseConfig")));

  /* ── SoftLibrary (Archives physiques) ── */
  const[libDocs,       setLibDocs]       =useState(()=>lsGet("libDocs")||LIB_DOCUMENTS);
  const[libContenants]=useState(LIB_CONTENANTS);

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

  /* ── Persistence ── */
  useEffect(()=>{try{localStorage.setItem("softdocs_currentApp",currentApp);}catch{};},[currentApp]);
  useEffect(()=>{lsSet("docs",docs);},[docs]);
  useEffect(()=>{lsSet("users",users);},[users]);
  useEffect(()=>{lsSet("types",types);},[types]);
  useEffect(()=>{lsSet("schemas",schemas);},[schemas]);
  useEffect(()=>{lsSet("recv",recv);},[recv]);
  useEffect(()=>{lsSet("liq",liq);},[liq]);
  useEffect(()=>{lsSet("epPaiements",epPaiements);},[epPaiements]);
  useEffect(()=>{lsSet("champsDyn",champsDyn);},[champsDyn]);
  useEffect(()=>{lsSet("planComptes",planComptes);},[planComptes]);
  useEffect(()=>{lsSet("mailConfig",mailConfig);},[mailConfig]);
  useEffect(()=>{lsSet("projets",projets);},[projets]);
  useEffect(()=>{lsSet("fournComptes",fournComptes);},[fournComptes]);
  useEffect(()=>{lsSet("causesRefus",causesRefus);},[causesRefus]);
  useEffect(()=>{lsSet("libDocs",libDocs);},[libDocs]);
  useEffect(()=>{lsSet("licenseConfig",licenseConfig);},[licenseConfig]);

  /* ── Auth restore ── */
  useEffect(()=>{
    const saved=lsGet("auth");
    if(saved){
      const fresh=BACKOFFICE_USERS.find(u=>u.id===saved.id);
      const normalized=fresh?{...saved,...fresh}:saved;
      setAuthUser(normalized);setAuthed(true);lsSet("auth",normalized);
    }
    const savedLang=lsGet("lang");
    if(savedLang&&["fr","en"].includes(savedLang))setLang(savedLang);
    setAuthChecked(true);
  },[]);

  /* ── RESET ── */
  const resetAllData=useCallback(()=>{
    KEYS.forEach(k=>lsDel(k));
    setDocs(INIT_DOCS);
    setUsers(INIT_USERS);
    setTypes(INIT_TYPES);
    setSchemas(INIT_SCHEMAS);
    setRecv(INIT_RECV);
    setLiq(INIT_LIQ);
    setEpPaiements(INIT_EP_PAIEMENTS);
    setChampsDyn(INIT_CHAMPS_DYN);
    setPlanComptes(INIT_PLAN_COMPTES);
    setMailConfig(INIT_MAIL_CONFIG);
    setProjets(INIT_PROJETS);
    setFournComptes(INIT_FOURNISSEURS_COMPTES);
    setCausesRefus(INIT_CAUSES_REFUS);
    setLibDocs(LIB_DOCUMENTS);
    setLicenseConfig(cloneLicenseConfig(DEFAULT_LICENSE_CONFIG));
    setView("dashboard");
    setSelDoc(null);
  },[]);

  /* ── Fournisseur docs on mount ── */
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
  const addDoc=(d)=>{setDocs(p=>{const nd=[d,...p];lsSet("all_docs",nd);return nd;});};
  const updDoc=(u)=>{setDocs(p=>{const nd=p.map(d=>d.id===u.id?u:d);lsSet("all_docs",nd);return nd;});setSelDoc(u);};
  const openDoc=(doc,ctx)=>{setSelDoc(doc);setDocCtx(ctx);setView("detail");};

  /* ── Auth ── */
  const login=(user)=>{setAuthUser(user);setAuthed(true);lsSet("auth",user);};
  const logout=()=>{setAuthUser(null);setAuthed(false);lsDel("auth");};

  /* ── Language ── */
  const changeLang=(l)=>{setLang(l);lsSet("lang",l);};

  return(
    <AppCtx.Provider value={{
      /* SoftDocs (GED) */
      docs,setDocs,users,setUsers,types,setTypes,
      schemas,setSchemas,recv,setRecv,liq,setLiq,epPaiements,setEpPaiements,
      champsDyn,setChampsDyn,planComptes,setPlanComptes,
      mailConfig,setMailConfig,
      projets,setProjets,
      fournComptes,setFournComptes,
      causesRefus,setCausesRefus,
      licenseConfig,setLicenseConfig,
      /* SoftLibrary (Archives) */
      libDocs,setLibDocs,libContenants,
      libDocTypes:LIB_DOC_TYPES,
      libEmplacements:LIB_EMPLACEMENTS,
      libAuditLog:LIB_AUDIT_LOG,
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
