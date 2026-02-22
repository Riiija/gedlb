// ═══════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════
export const P    = "#324372";
export const PDk  = "#1c2741";
export const PLt  = "#3d5390";
export const PXl  = "#eef1f8";
export const S    = "#ADA660";
export const SDk  = "#938d4e";
export const SXl  = "#faf8e8";
export const SUC  = "#16a34a";
export const SUCL = "#dcfce7";
export const SUCD = "#14532d";
export const DNG  = "#dc2626";
export const DNGL = "#fee2e2";
export const DNGD = "#7f1d1d";
export const WRN  = "#d97706";
export const WRNL = "#fef3c7";
export const WRND = "#78350f";
export const INF  = "#0891b2";
export const INFL = "#cffafe";
export const INFD = "#164e63";
export const MUT  = "#64748b";
export const BD   = "#e2e8f0";
export const BG   = "#f4f6fb";
export const WH   = "#ffffff";
export const TXT  = "#1a2035";

export const SHADOW   = "0 1px 3px rgba(50,67,114,0.08), 0 4px 16px rgba(50,67,114,0.06)";
export const SHADOW_M = "0 4px 12px rgba(50,67,114,0.12), 0 8px 32px rgba(50,67,114,0.10)";
export const SHADOW_L = "0 8px 24px rgba(20,29,48,0.20), 0 16px 48px rgba(20,29,48,0.12)";
export const R    = "12px";
export const RSm  = "8px";
export const RLg  = "16px";
export const TR   = "all .15s ease";

// ═══════════════════════════════════════════════════
// STYLE HELPERS
// ═══════════════════════════════════════════════════
export const card  = (x={}) => ({ background:WH, borderRadius:R, boxShadow:SHADOW, border:`1px solid ${BD}`, overflow:"hidden", ...x });
export const inp   = (x={}) => ({ width:"100%", border:`1.5px solid ${BD}`, borderRadius:RSm, padding:"9px 14px", fontSize:14, outline:"none", color:TXT, background:WH, transition:TR, boxSizing:"border-box", fontFamily:"inherit", ...x });
export const sel   = (x={}) => inp(x);
export const lbl   = { fontSize:11, fontWeight:700, color:"#475569", marginBottom:5, display:"block", textTransform:"uppercase", letterSpacing:".06em" };
export const bdg   = (bg, fg=WH, x={}) => ({ background:bg, color:fg, borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700, display:"inline-block", whiteSpace:"nowrap", ...x });
export const TH    = { background:"#f8fafc", color:"#334155", padding:"10px 14px", textAlign:"left", fontWeight:700, fontSize:11, textTransform:"uppercase", letterSpacing:".05em", borderBottom:`2px solid ${BD}`, whiteSpace:"nowrap" };
export const TD    = { padding:"11px 14px", borderBottom:`1px solid #f1f5f9`, verticalAlign:"middle", fontSize:13 };

export const btn = (v="primary", sm=false, outline=false) => {
  const MAP = {
    primary: [P, WH],
    secondary: [S, WH],
    success: [SUC, WH],
    danger: [DNG, WH],
    warning: [WRN, WH],
    muted: [MUT, WH],
    light: ["#f1f5f9", "#334155"],
  };
  const [bg, fg] = MAP[v] || MAP.primary;
  return {
    background: outline ? "transparent" : bg,
    color: outline ? bg : fg,
    border: `2px solid ${bg}`,
    borderRadius: RSm,
    padding: sm ? "5px 12px" : "8px 18px",
    fontSize: sm ? 12 : 14,
    fontWeight: 600,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    transition: TR,
    lineHeight: 1.3,
    whiteSpace: "nowrap",
    fontFamily: "inherit",
  };
};

export const STATUS = {
  "REÇU":           { bg:INFL,  fg:INFD  },
  "EN VALIDATION":  { bg:WRNL,  fg:WRND  },
  "EN RETARD":      { bg:DNGL,  fg:DNGD  },
  "VALIDÉ":         { bg:SUCL,  fg:SUCD  },
  "REJETÉ":         { bg:DNGL,  fg:DNGD  },
  "ARCHIVÉ":        { bg:"#f1f5f9", fg:"#475569" },
  "BON À PAYER":    { bg:INFL,  fg:INFD  },
  "PAYÉ":           { bg:SUCL,  fg:SUCD  },
  "CONFIDENTIEL":   { bg:"#ede9fe", fg:"#5b21b6" },
  "EN ATTENTE":     { bg:"#f1f5f9", fg:MUT },
  "EN ATTENTE PAIEMENT": { bg:WRNL, fg:WRND },
  "Actif":          { bg:SUCL,  fg:SUCD  },
  "Test":           { bg:WRNL,  fg:WRND  },
  "CLÔTURÉ":        { bg:"#f1f5f9", fg:"#475569" },
};

// ═══════════════════════════════════════════════════
// STATIC DATA
// ═══════════════════════════════════════════════════
export const PROJETS = [
  { id:"PRJ-001", nom:"PREA – Réhabilitation Écoles",    bailleur:"Banque Mondiale", budget:4500000000, sites:["Antananarivo","Fianarantsoa","Toamasina"] },
  { id:"PRJ-002", nom:"GEZANI – Cyclones Victimes",       bailleur:"PNUD",           budget:1200000000, sites:["Toliara","Morondava"] },
  { id:"PRJ-003", nom:"PIVOT – Infrastructures Santé",    bailleur:"BAD",            budget:3800000000, sites:["Mahajanga","Antananarivo"] },
  { id:"PRJ-004", nom:"PADAP – Agriculture Durable",      bailleur:"FIDA",           budget:2100000000, sites:["Fianarantsoa","Toliara","Antananarivo"] },
];

export const ALL_SITES = ["Antananarivo","Fianarantsoa","Toamasina","Toliara","Morondava","Mahajanga"];

export const FOURNISSEURS = [
  { id:"F001", nom:"JIRAMA",             nif:"100 234 567", iban:"MG480001000123456789012",    ville:"Antananarivo" },
  { id:"F002", nom:"KRAOMITA MALAGASY",  nif:"100 876 543", iban:"MG480002000298765432109",    ville:"Toamasina"    },
  { id:"F003", nom:"HOLCIM Madagascar",  nif:"100 654 321", iban:"MG480003000311223344556",    ville:"Mahajanga"    },
  { id:"F004", nom:"TELMA SA",           nif:"100 112 233", iban:"MG480004000477889900112",    ville:"Antananarivo" },
  { id:"F005", nom:"SME Construction",   nif:"100 998 877", iban:"MG480005000533445566778",    ville:"Fianarantsoa" },
];

export const XML_NATURES = [
  "Paiement facture fournisseur","Avance de démarrage","Remboursement frais",
  "Paiement contrat marchés","Avance sur commande","Paiement prestation services","Paiement solde contrat"
];

export const INIT_USERS = [
  { id:"U001", nom:"Rakoto Jean-Baptiste",   init:"RJ", role:"Chef de Projet",    site:"Antananarivo", actif:true, email:"rakoto@proj.mg",
    droits:{ validMulti:true,  saisieOCR:true,  docCommun:true,  docConf:false, docEnCours:true,  avance:false, liquidation:false },
    projets:[{pid:"PRJ-001",sites:["Antananarivo","Fianarantsoa"]},{pid:"PRJ-004",sites:["Fianarantsoa"]}] },
  { id:"U002", nom:"Randria Marie-Claire",   init:"RM", role:"Resp. Financier",   site:"Antananarivo", actif:true, email:"randria@proj.mg",
    droits:{ validMulti:true,  saisieOCR:true,  docCommun:true,  docConf:true,  docEnCours:true,  avance:true,  liquidation:true  },
    projets:PROJETS.map(p=>({pid:p.id,sites:p.sites})) },
  { id:"U003", nom:"Razafy Pierre",          init:"RP", role:"DAF",               site:"Antananarivo", actif:true, email:"razafy@proj.mg",
    droits:{ validMulti:true,  saisieOCR:true,  docCommun:true,  docConf:true,  docEnCours:true,  avance:true,  liquidation:true  },
    projets:PROJETS.map(p=>({pid:p.id,sites:p.sites})) },
  { id:"U004", nom:"Rasoamanarivo Hanta",    init:"RH", role:"Comptable Senior",  site:"Toliara",      actif:true, email:"hanta@proj.mg",
    droits:{ validMulti:false, saisieOCR:true,  docCommun:true,  docConf:false, docEnCours:true,  avance:false, liquidation:true  },
    projets:[{pid:"PRJ-002",sites:["Toliara"]},{pid:"PRJ-004",sites:["Toliara"]}] },
  { id:"U005", nom:"Andriamananjara Lova",   init:"AL", role:"Ordonnateur",       site:"Antananarivo", actif:true, email:"lova@proj.mg",
    droits:{ validMulti:true,  saisieOCR:false, docCommun:true,  docConf:true,  docEnCours:true,  avance:true,  liquidation:true  },
    projets:PROJETS.map(p=>({pid:p.id,sites:p.sites.slice(0,1)})) },
  { id:"U006", nom:"Ratsimbazafy Noro",      init:"RN", role:"Gestionnaire Docs", site:"Mahajanga",    actif:true, email:"noro@proj.mg",
    droits:{ validMulti:false, saisieOCR:true,  docCommun:true,  docConf:false, docEnCours:false, avance:false, liquidation:false },
    projets:[{pid:"PRJ-003",sites:["Mahajanga"]}] },
];

export const INIT_TYPES = [
  { id:"DT001", nom:"Facture",         icone:"📄", conf:false, etapes:[{label:"Réception & Contrôle",v:["U004","U006"]},{label:"Validation Technique",v:["U001"]},{label:"Validation Financière",v:["U002","U004"]},{label:"Approbation DAF",v:["U003"]}] },
  { id:"DT002", nom:"Bon de livraison",icone:"🚚", conf:false, etapes:[{label:"Réception & Contrôle",v:["U004"]},{label:"Validation Logistique",v:["U001","U006"]},{label:"Validation Financière",v:["U002"]}] },
  { id:"DT003", nom:"Contrat",         icone:"📋", conf:true,  etapes:[{label:"Réception & Contrôle",v:["U002"]},{label:"Validation Juridique",v:["U003"]},{label:"Approbation Ordonnateur",v:["U005"]}] },
  { id:"DT004", nom:"Rapport",         icone:"📊", conf:false, etapes:[{label:"Réception & Contrôle",v:["U006"]},{label:"Validation Technique",v:["U001","U003"]}] },
];

export const INIT_SCHEMAS = [
  { id:"SCH-001", nom:"BOA Madagascar – SEPA XML", banque:"Bank of Africa",  format:"pain.001.001.03", version:"v3.2", statut:"Actif", charset:"UTF-8", natureRemise:"Paiement facture fournisseur", endpoint:"https://api.boa.mg/payments" },
  { id:"SCH-002", nom:"BNI Madagascar – MT101",    banque:"BNI Madagascar",  format:"SWIFT MT101",     version:"v1.0", statut:"Actif", charset:"UTF-8", natureRemise:"Paiement contrat marchés",     endpoint:"" },
];

export const INIT_RECV = { fournisseurs:["U004","U006"], confidentiels:["U002","U003"], internes:["U001","U006"] };

const mkEtapes = (dt) => (dt?.etapes||[]).map(e=>({...e, statut:"EN ATTENTE", date:"", comment:"", validBy:""}));

export const INIT_DOCS = [
  { id:"DOC-2025-001",type:"Facture",tid:"DT001",cat:"fournisseur",fourn:"JIRAMA",fid:"F001",proj:"PRJ-001",site:"Antananarivo",mt:48750000,mtR:48750000,date:"2025-01-15",st:"BON À PAYER",conf:false,ocr:94,motif:"",exped:"Fournisseur",notes:"",bap:true,cloture:false,AR:true,affP:true,linked:false,refus:null,
    ch:{numero:"FAC-2025-0147",date_doc:"15/01/2025",ht:"40625000",tva:"8125000",total:"48750000",nif:"100 234 567",iban:"MG480001000123456789012",emetteur:"JIRAMA",score:94},anx:[{nom:"BON_CMD.pdf",type:"Bon de commande",oblig:true,ok:true}],
    etapes:[{label:"Réception & Contrôle",v:["U004","U006"],statut:"VALIDÉ",date:"15/01/2025 10:15",comment:"Conforme",validBy:"U004"},{label:"Validation Technique",v:["U001"],statut:"VALIDÉ",date:"16/01/2025 09:00",comment:"Travaux conformes",validBy:"U001"},{label:"Validation Financière",v:["U002","U004"],statut:"VALIDÉ",date:"17/01/2025 11:30",comment:"Imputation OK",validBy:"U002"},{label:"Approbation DAF",v:["U003"],statut:"VALIDÉ",date:"18/01/2025 14:00",comment:"Approuvé",validBy:"U003"}] },
  { id:"DOC-2025-002",type:"Bon de livraison",tid:"DT002",cat:"fournisseur",fourn:"HOLCIM Madagascar",fid:"F003",proj:"PRJ-003",site:"Mahajanga",mt:125000000,mtR:125000000,date:"2025-01-18",st:"EN VALIDATION",conf:false,ocr:87,motif:"",exped:"Fournisseur",notes:"",bap:false,cloture:false,AR:true,affP:true,linked:false,refus:null,
    ch:{numero:"BL-2025-0089",date_doc:"18/01/2025",ht:"104166667",tva:"20833333",total:"125000000",nif:"100 654 321",iban:"MG480003000311223344556",emetteur:"HOLCIM Madagascar",score:87},anx:[{nom:"BON_CMD_002.pdf",type:"Bon de commande",oblig:true,ok:true}],
    etapes:[{label:"Réception & Contrôle",v:["U004"],statut:"VALIDÉ",date:"18/01/2025 09:00",comment:"OK",validBy:"U004"},{label:"Validation Logistique",v:["U001","U006"],statut:"EN ATTENTE",date:"",comment:"",validBy:""},{label:"Validation Financière",v:["U002"],statut:"EN ATTENTE",date:"",comment:"",validBy:""}] },
  { id:"DOC-2025-003",type:"Contrat",tid:"DT003",cat:"confidentiel",fourn:"KRAOMITA MALAGASY",fid:"F002",proj:"PRJ-002",site:"Toliara",mt:890000000,mtR:890000000,date:"2025-01-10",st:"EN VALIDATION",conf:true,ocr:91,motif:"",exped:"Fournisseur",notes:"",bap:false,cloture:false,AR:true,affP:true,linked:false,refus:null,
    ch:{numero:"CTR-2025-0012",date_doc:"10/01/2025",ht:"741666667",tva:"148333333",total:"890000000",nif:"100 876 543",iban:"MG480002000298765432109",emetteur:"KRAOMITA MALAGASY",score:91},anx:[{nom:"CDC.pdf",type:"Cahier des charges",oblig:true,ok:true}],
    etapes:[{label:"Réception & Contrôle",v:["U002"],statut:"VALIDÉ",date:"10/01/2025 10:00",comment:"Circuit conf.",validBy:"U002"},{label:"Validation Juridique",v:["U003"],statut:"EN ATTENTE",date:"",comment:"",validBy:""},{label:"Approbation Ordonnateur",v:["U005"],statut:"EN ATTENTE",date:"",comment:"",validBy:""}] },
  { id:"DOC-2025-004",type:"Facture",tid:"DT001",cat:"fournisseur",fourn:"SME Construction",fid:"F005",proj:"PRJ-001",site:"Fianarantsoa",mt:62400000,mtR:62400000,date:"2025-01-20",st:"EN RETARD",conf:false,ocr:72,motif:"",exped:"Fournisseur",notes:"",bap:false,cloture:false,AR:true,affP:true,linked:false,refus:null,
    ch:{numero:"FAC-SME-0334",date_doc:"20/01/2025",ht:"52000000",tva:"10400000",total:"62400000",nif:"100 998 877",iban:"MG480005000533445566778",emetteur:"SME Construction",score:72},anx:[],
    etapes:[{label:"Réception & Contrôle",v:["U004","U006"],statut:"VALIDÉ",date:"20/01/2025 11:00",comment:"OCR 72%",validBy:"U006"},{label:"Validation Technique",v:["U001"],statut:"EN RETARD",date:"",comment:"Délai +3j",validBy:""},{label:"Validation Financière",v:["U002","U004"],statut:"EN ATTENTE",date:"",comment:"",validBy:""},{label:"Approbation DAF",v:["U003"],statut:"EN ATTENTE",date:"",comment:"",validBy:""}] },
  { id:"DOC-2025-005",type:"Facture",tid:"DT001",cat:"fournisseur",fourn:"TELMA SA",fid:"F004",proj:"",site:"Antananarivo",mt:33600000,mtR:33600000,date:"2025-01-22",st:"REÇU",conf:false,ocr:96,motif:"",exped:"Fournisseur",notes:"",bap:false,cloture:false,AR:false,affP:false,linked:false,refus:null,
    ch:{numero:"FAC-TELMA-0891",date_doc:"22/01/2025",ht:"28000000",tva:"5600000",total:"33600000",nif:"100 112 233",iban:"MG480004000477889900112",emetteur:"TELMA SA",score:96},anx:[],
    etapes:[{label:"Réception & Contrôle",v:["U004","U006"],statut:"EN ATTENTE",date:"",comment:"",validBy:""},{label:"Validation Technique",v:["U001"],statut:"EN ATTENTE",date:"",comment:"",validBy:""},{label:"Validation Financière",v:["U002","U004"],statut:"EN ATTENTE",date:"",comment:"",validBy:""},{label:"Approbation DAF",v:["U003"],statut:"EN ATTENTE",date:"",comment:"",validBy:""}] },
  { id:"DOC-2025-006",type:"Rapport",tid:"DT004",cat:"interne",fourn:"",fid:"",proj:"PRJ-004",site:"Fianarantsoa",mt:0,mtR:0,date:"2025-01-08",st:"REJETÉ",conf:false,ocr:55,motif:"Rapport incomplet — Section 3 manquante",exped:"Interne",notes:"",bap:false,cloture:false,AR:true,affP:true,linked:false,
    refus:{etape:"Validation Technique",date:"09/01/2025 14:00",cause:"Document incomplet",comment:"Section 3 manquante"},
    ch:{numero:"RPT-2025-0056",date_doc:"08/01/2025",ht:"0",tva:"0",total:"0",nif:"",iban:"",emetteur:"Service Technique PADAP",score:55},anx:[],
    etapes:[{label:"Réception & Contrôle",v:["U006"],statut:"VALIDÉ",date:"08/01/2025 09:00",comment:"Reçu",validBy:"U006"},{label:"Validation Technique",v:["U001","U003"],statut:"REJETÉ",date:"09/01/2025 14:00",comment:"Section 3 manquante",validBy:"U001"}] },
  { id:"DOC-2025-007",type:"Contrat",tid:"DT003",cat:"confidentiel",fourn:"JIRAMA",fid:"F001",proj:"PRJ-001",site:"Antananarivo",mt:580000000,mtR:580000000,date:"2025-01-12",st:"ARCHIVÉ",conf:true,ocr:93,motif:"",exped:"Fournisseur",notes:"",bap:false,cloture:false,AR:true,affP:true,linked:true,refus:null,
    ch:{numero:"CTR-2025-0009",date_doc:"12/01/2025",ht:"483333333",tva:"96666667",total:"580000000",nif:"100 234 567",iban:"MG480001000123456789012",emetteur:"JIRAMA",score:93},anx:[{nom:"OFFRE_TECH.pdf",type:"Offre technique",oblig:true,ok:true}],
    etapes:[{label:"Réception & Contrôle",v:["U002"],statut:"VALIDÉ",date:"12/01/2025 09:00",comment:"",validBy:"U002"},{label:"Validation Juridique",v:["U003"],statut:"VALIDÉ",date:"13/01/2025 11:00",comment:"Conforme",validBy:"U003"},{label:"Approbation Ordonnateur",v:["U005"],statut:"VALIDÉ",date:"14/01/2025 15:00",comment:"Approuvé",validBy:"U005"}] },
];

// ═══════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════
export const now  = () => new Date().toLocaleDateString("fr-MG")+" "+new Date().toLocaleTimeString("fr-MG",{hour:"2-digit",minute:"2-digit"});
export const gid  = (p) => `${p}-${Date.now().toString().slice(-7)}`;
export const fmtN = (v) => v ? new Intl.NumberFormat("fr-MG").format(v)+" Ar" : "—";
export const mkEtapesFromType = mkEtapes;

export const ocrSim = (fid) => {
  const f = FOURNISSEURS.find(x=>x.id===fid) || FOURNISSEURS[0];
  const ht = Math.floor(20000000+Math.random()*80000000);
  const tva = Math.floor(ht*.2);
  const score = Math.floor(70+Math.random()*27);
  return { numero:`FAC-2025-${Math.floor(1000+Math.random()*8000)}`, date_doc:`${String(1+Math.floor(Math.random()*27)).padStart(2,"0")}/01/2025`, ht:String(ht), tva:String(tva), total:String(ht+tva), nif:f.nif, iban:f.iban, emetteur:f.nom, score };
};

export const DOC_MENUS = [
  {id:"recus-f", label:"Reçus fournisseurs",     icon:"📥"},
  {id:"courrier",label:"Service Courriers",       icon:"📬"},
  {id:"confids", label:"Documents Confidentiels", icon:"🔒", conf:true},
  {id:"recu",    label:"Reçu",                   icon:"📨", stFilter:["REÇU"]},
  {id:"en-cours",label:"En cours",               icon:"⏳", stFilter:["EN VALIDATION","EN RETARD"]},
  {id:"refuses", label:"Refusés",                icon:"❌", stFilter:["REJETÉ"]},
  {id:"archives",label:"Archivés",               icon:"📦", stFilter:["ARCHIVÉ"]},
  {id:"envoyes", label:"Envoyés",                icon:"📤", stFilter:["VALIDÉ","BON À PAYER","PAYÉ","CLÔTURÉ"]},
  {id:"communs", label:"Documents Communs",      icon:"📁", noConf:true},
  {id:"c-enc",   label:"Confid. En cours",       icon:"🔐", conf:true, stFilter:["EN VALIDATION","EN RETARD"]},
  {id:"c-ref",   label:"Confid. Refusés",        icon:"🔐", conf:true, stFilter:["REJETÉ"]},
  {id:"c-arc",   label:"Confid. Archivés",       icon:"🔐", conf:true, stFilter:["ARCHIVÉ"]},
  {id:"r-com",   label:"Refusés Communs",        icon:"📁", noConf:true, stFilter:["REJETÉ"]},
  {id:"c-com",   label:"Confid. Communs",        icon:"🔐", conf:true},
];

export const filterDocsByMenu = (docs, menuId) => {
  const m = DOC_MENUS.find(x=>x.id===menuId);
  if (!m) return docs;
  let res = docs;
  if (m.conf) res = res.filter(d=>d.conf);
  if (m.noConf) res = res.filter(d=>!d.conf);
  if (menuId==="recus-f") res = res.filter(d=>d.cat==="fournisseur"&&["REÇU"].includes(d.st));
  if (menuId==="courrier") res = res.filter(d=>d.cat==="fournisseur"&&["REÇU","EN VALIDATION"].includes(d.st));
  if (m.stFilter && menuId!=="recus-f" && menuId!=="courrier") res = res.filter(d=>m.stFilter.includes(d.st));
  return res;
};

export const getDocCtx = (menuId) => {
  if (menuId==="recus-f") return "recus-f";
  if (menuId==="courrier") return "courrier";
  if (menuId==="envoyes") return "envoyes";
  if (menuId==="refuses"||menuId==="r-com"||menuId==="c-ref") return "refuses";
  return "en-cours";
};

export const DROITS_DEF = [
  {k:"validMulti",  l:"Validation multiple étapes",    d:"Peut valider plusieurs étapes successives"},
  {k:"saisieOCR",   l:"Correction montant réel (OCR)", d:"Peut corriger le montant si l'OCR est inexact"},
  {k:"docCommun",   l:"Accès documents communs",       d:"Consultation des documents non confidentiels"},
  {k:"docConf",     l:"Accès documents confidentiels", d:"Accès aux circuits confidentiels restreints"},
  {k:"docEnCours",  l:"Accès documents en cours",      d:"Consultation des dossiers en cours de validation"},
  {k:"avance",      l:"Saisie avances de fonds",       d:"Création de demandes d'avance"},
  {k:"liquidation", l:"Saisie liquidations",           d:"Création et gestion des liquidations"},
];
