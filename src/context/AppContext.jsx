"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { INIT_DOCS, INIT_USERS, INIT_TYPES, INIT_SCHEMAS, INIT_RECV, INIT_LIQ, INIT_CHAMPS_DYN } from "../lib/data";

const AppCtx = createContext(null);
const LS_FOURN_DOCS = "softdocs_fourn_docs";
const lsGet = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };

/* Demo backoffice users */
export const BACKOFFICE_USERS = [
  { id:"U001", nom:"Rakoto Jean-Baptiste",    role:"Chef de Projet",   init:"RJ", email:"rakoto@softdocs.mg",   password:"chef2025"  },
  { id:"U002", nom:"Randria Marie-Claire",    role:"Resp. Financier",  init:"RM", email:"randria@softdocs.mg",  password:"admin123"  },
  { id:"U003", nom:"Razafy Pierre",           role:"DAF",              init:"RP", email:"razafy@softdocs.mg",   password:"daf2025"   },
  { id:"U004", nom:"Rasoamanarivo Hanta",     role:"Comptable Senior", init:"RH", email:"hanta@softdocs.mg",    password:"compta2025"},
  { id:"U005", nom:"Andriamananjara Lova",    role:"Ordonnateur",      init:"AL", email:"lova@softdocs.mg",     password:"ordo2025"  },
  { id:"U006", nom:"Ratsimbazafy Noro",       role:"Gestionnaire Docs",init:"RN", email:"noro@softdocs.mg",     password:"gest2025"  },
];

export function AppProvider({ children }) {
  const [docs,        setDocs]        = useState(INIT_DOCS);
  const [users,       setUsers]       = useState(INIT_USERS);
  const [types,       setTypes]       = useState(INIT_TYPES);
  const [schemas,     setSchemas]     = useState(INIT_SCHEMAS);
  const [recv,        setRecv]        = useState(INIT_RECV);
  const [liq,         setLiq]         = useState(INIT_LIQ);
  const [champsDyn,   setChampsDyn]   = useState(INIT_CHAMPS_DYN);

  /* Persist champsDyn to localStorage for frontoffice portal */
  useEffect(()=>{
    try{localStorage.setItem("softdocs_champs_dyn",JSON.stringify(champsDyn));}catch{}
  },[champsDyn]);
  const [view,        setView]        = useState("dashboard");
  const [selDoc,      setSelDoc]      = useState(null);
  const [docCtx,      setDocCtx]      = useState("en-cours");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [authUser,    setAuthUser]    = useState(null);
  const [authed,      setAuthed]      = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [lang,        setLang]        = useState("fr");

  /* Restore session — runs once on mount */
  useEffect(() => {
    const saved = lsGet("softdocs_auth");
    if (saved) { setAuthUser(saved); setAuthed(true); }
    const savedLang = lsGet("softdocs_lang");
    if (savedLang && ["fr","en"].includes(savedLang)) setLang(savedLang);
    setAuthChecked(true);   // ← signal that we've checked localStorage
  }, []);

  /* Load fournisseur portal submissions */
  useEffect(() => {
    const fourn = lsGet(LS_FOURN_DOCS);
    if (Array.isArray(fourn) && fourn.length > 0) {
      setDocs(prev => {
        const ids = new Set(prev.map(d => d.id));
        return [...prev, ...fourn.filter(d => !ids.has(d.id))];
      });
    }
  }, []);

  /* Poll every 20s */
  useEffect(() => {
    const iv = setInterval(() => {
      const fourn = lsGet(LS_FOURN_DOCS);
      if (Array.isArray(fourn) && fourn.length > 0) {
        setDocs(prev => {
          const ids = new Set(prev.map(d => d.id));
          const nd = fourn.filter(d => !ids.has(d.id));
          return nd.length > 0 ? [...prev, ...nd] : prev;
        });
      }
    }, 20000);
    return () => clearInterval(iv);
  }, []);

  const addDoc  = (d) => {
    setDocs(p => {
      const nd=[...p,d];
      try{localStorage.setItem("softdocs_all_docs",JSON.stringify(nd));}catch{}
      return nd;
    });
  };
  const updDoc  = (u) => { setDocs(p => { const nd=p.map(d=>d.id===u.id?u:d); try{localStorage.setItem("softdocs_all_docs",JSON.stringify(nd));}catch{} return nd; }); setSelDoc(u); };
  const openDoc = (d, ctx) => { setSelDoc(d); setDocCtx(ctx || "en-cours"); setView("detail"); };

  const login = (user) => {
    try { localStorage.setItem("softdocs_auth", JSON.stringify(user)); } catch {}
    setAuthUser(user); setAuthed(true);
  };
  const logout = () => {
    try { localStorage.removeItem("softdocs_auth"); } catch {}
    setAuthUser(null); setAuthed(false); setView("dashboard");
  };

  const changeLang = (l) => {
    setLang(l);
    try { localStorage.setItem("softdocs_lang", JSON.stringify(l)); } catch {}
  };

  return (
    <AppCtx.Provider value={{
      docs, setDocs, users, setUsers, types, setTypes,
      schemas, setSchemas, recv, setRecv, liq, setLiq,
      champsDyn, setChampsDyn,
      view, setView, selDoc, setSelDoc, docCtx, setDocCtx,
      sidebarOpen, setSidebarOpen,
      authUser, authed, authChecked, login, logout,
      lang, changeLang,
      addDoc, updDoc, openDoc,
    }}>
      {children}
    </AppCtx.Provider>
  );
}

export const useApp = () => useContext(AppCtx);
