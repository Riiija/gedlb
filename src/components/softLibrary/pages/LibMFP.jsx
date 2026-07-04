"use client";
/* ═══════════════════════════════════════════════════════════════
   SOFT LIBRARY — Connexion Équipements Multifonctions (MFP)
   ─────────────────────────────────────────────────────────────
   ✓ Connexion MFP réseau (IP / DNS) — Canon, Xerox, Ricoh
   ✓ Authentification utilisateur sur le copieur
   ✓ Association utilisateur SoftLibrary ↔ compte copieur
   ✓ Gestion multi-appareils multi-sites
   ✓ Supervision état des équipements
   ✓ Journal des opérations machine
   ✓ Boîte de réception scan → fiche documentaire auto
   ✓ Extraction automatique métadonnées (OCR)
   ✓ Validation / correction indexation
   Protocoles : Scan to API, WebDAV, SMB, FTP, REST
   ~1600 lignes
═══════════════════════════════════════════════════════════════ */
import React,{useState,useMemo,useEffect,useCallback}from"react";
import{COLORS as CO,FONT_FAMILY as FF}from"../theme";

/* ─── Local aliases ─── */
const C=CO;
const BD=C.border;const MUT=C.textMut;const TXT=C.text;const SEC=C.textSec;
const P=C.primary;const PL=C.primaryLight;const PLR=C.primaryLighter;
const SUC=C.success;const SUCB=C.successBg;const DNG=C.danger;const DNGB=C.dangerBg;
const WRN=C.warning;const WRNB=C.warningBg;const INF=C.info;const INFB=C.infoBg;
const PUR=C.purple;const PURB=C.purpleBg;

/* ─── Common helpers ─── */
const card=(extra={})=>({background:"#fff",borderRadius:10,border:`1px solid ${BD}`,overflow:"hidden",...extra});
const badge=(bg,fg,extra={})=>({display:"inline-flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:20,fontSize:10.5,fontWeight:700,background:bg,color:fg,whiteSpace:"nowrap",...extra});
const btnSm=(bg=P,fg="#fff")=>({display:"inline-flex",alignItems:"center",gap:5,padding:"7px 14px",borderRadius:7,border:"none",background:bg,color:fg,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:FF,transition:"all .15s"});
const inp=(extra={})=>({width:"100%",padding:"9px 12px",borderRadius:7,border:`1.5px solid ${BD}`,fontSize:13,fontFamily:FF,outline:"none",transition:"border-color .15s",...extra});
const isMobileW=()=>typeof window!=="undefined"&&window.innerWidth<768;

/* ═══════════════════════════════════════════════════════
   DONNÉES SIMULÉES — Équipements MFP
═══════════════════════════════════════════════════════ */
const MFP_DEVICES=[
  {id:"MFP-001",nom:"Canon iR-ADV C5560i III",marque:"Canon",modele:"iR-ADV C5560i III",
    ip:"192.168.1.50",dns:"canon-dg.softwell.local",mac:"00:1E:8F:A1:23:45",
    site:"Siège Analakely",emplacement:"Salle Archives DG — Étage 1",
    protocole:"Scan to API",port:443,ssl:true,firmware:"3.12.1 build 2024.11",
    statut:"en_ligne",dernierContact:"2025-02-28T15:42:00",
    compteurs:{scan:12847,copie:34521,impression:28903,couleur:8234},
    toner:{cyan:72,magenta:45,jaune:68,noir:31},papier:{a4:820,a3:145},
    capaciteScan:"100 feuilles/min",resolution:"600x600 dpi",recto_verso:true,
    ocr_embarque:true,formats:["PDF","PDF/A","TIFF","JPEG"],
    authMode:"LDAP",webdavUrl:"/webdav/scans",smbPath:"\\\\canon-dg\\scans",
    derniereErreur:null,uptime:"45j 12h",tempMoyenScan:3.2},
  {id:"MFP-002",nom:"Xerox VersaLink C7030",marque:"Xerox",modele:"VersaLink C7030",
    ip:"192.168.1.51",dns:"xerox-fin.softwell.local",mac:"00:23:7D:B2:45:67",
    site:"Siège Analakely",emplacement:"Local Comptabilité — Étage 2",
    protocole:"WebDAV",port:443,ssl:true,firmware:"78.51.11",
    statut:"en_ligne",dernierContact:"2025-02-28T15:40:00",
    compteurs:{scan:8432,copie:21345,impression:19876,couleur:5120},
    toner:{cyan:88,magenta:76,jaune:82,noir:54},papier:{a4:650,a3:80},
    capaciteScan:"80 feuilles/min",resolution:"600x600 dpi",recto_verso:true,
    ocr_embarque:true,formats:["PDF","PDF/A","TIFF","XPS"],
    authMode:"PIN",webdavUrl:"https://xerox-fin:443/webdav",smbPath:null,
    derniereErreur:null,uptime:"32j 8h",tempMoyenScan:4.1},
  {id:"MFP-003",nom:"Ricoh IM C6000",marque:"Ricoh",modele:"IM C6000",
    ip:"192.168.2.30",dns:"ricoh-rh.softwell.local",mac:"00:26:73:C3:78:9A",
    site:"Siège Analakely",emplacement:"Bureau RH — Étage 1",
    protocole:"SMB",port:445,ssl:false,firmware:"1.14.0",
    statut:"attention",dernierContact:"2025-02-28T14:55:00",
    compteurs:{scan:5621,copie:15432,impression:12890,couleur:3210},
    toner:{cyan:34,magenta:22,jaune:41,noir:15},papier:{a4:120,a3:0},
    capaciteScan:"60 feuilles/min",resolution:"300x300 dpi",recto_verso:true,
    ocr_embarque:false,formats:["PDF","TIFF"],
    authMode:"Carte NFC",webdavUrl:null,smbPath:"\\\\ricoh-rh\\scans",
    derniereErreur:"Toner noir bas (15%)",uptime:"18j 3h",tempMoyenScan:5.8},
  {id:"MFP-004",nom:"Canon iR-ADV 4545i",marque:"Canon",modele:"iR-ADV 4545i",
    ip:"192.168.3.10",dns:"canon-tam.softwell.local",mac:"00:1E:8F:D4:56:BC",
    site:"Agence Tamatave",emplacement:"Bureau régional — RDC",
    protocole:"FTP",port:21,ssl:false,firmware:"3.10.2 build 2024.06",
    statut:"en_ligne",dernierContact:"2025-02-28T15:38:00",
    compteurs:{scan:3245,copie:8976,impression:7654,couleur:1890},
    toner:{cyan:91,magenta:85,jaune:89,noir:67},papier:{a4:430,a3:60},
    capaciteScan:"45 feuilles/min",resolution:"600x600 dpi",recto_verso:true,
    ocr_embarque:false,formats:["PDF","TIFF","JPEG"],
    authMode:"Login/MdP",webdavUrl:null,smbPath:null,ftpPath:"ftp://canon-tam/scans",
    derniereErreur:null,uptime:"60j 22h",tempMoyenScan:6.4},
  {id:"MFP-005",nom:"Xerox AltaLink C8155",marque:"Xerox",modele:"AltaLink C8155",
    ip:"192.168.2.55",dns:"xerox-jur.softwell.local",mac:"00:23:7D:E5:89:DE",
    site:"Siège Analakely",emplacement:"Bureau Juridique — Annexe Ét. 1",
    protocole:"REST API",port:443,ssl:true,firmware:"101.12.64",
    statut:"hors_ligne",dernierContact:"2025-02-27T11:20:00",
    compteurs:{scan:6789,copie:12456,impression:10234,couleur:4567},
    toner:{cyan:55,magenta:48,jaune:60,noir:38},papier:{a4:0,a3:0},
    capaciteScan:"90 feuilles/min",resolution:"1200x1200 dpi",recto_verso:true,
    ocr_embarque:true,formats:["PDF","PDF/A","TIFF","JPEG","DOCX"],
    authMode:"LDAP + Badge",webdavUrl:null,smbPath:null,restEndpoint:"https://xerox-jur:443/api/v1/scan",
    derniereErreur:"Bourrage papier bac 2 — Plus de papier",uptime:"0j 0h",tempMoyenScan:2.8},
  {id:"MFP-006",nom:"Ricoh MP C3004",marque:"Ricoh",modele:"MP C3004",
    ip:"192.168.4.20",dns:"ricoh-ank.softwell.local",mac:"00:26:73:F6:AB:12",
    site:"Site Ankorondrano",emplacement:"Entrepôt Nord — Réserve Archives",
    protocole:"Scan to API",port:8443,ssl:true,firmware:"1.12.3",
    statut:"en_ligne",dernierContact:"2025-02-28T15:30:00",
    compteurs:{scan:2134,copie:6543,impression:5432,couleur:987},
    toner:{cyan:95,magenta:92,jaune:88,noir:81},papier:{a4:980,a3:200},
    capaciteScan:"30 feuilles/min",resolution:"300x300 dpi",recto_verso:false,
    ocr_embarque:false,formats:["PDF","TIFF"],
    authMode:"Login/MdP",webdavUrl:null,smbPath:"\\\\ricoh-ank\\scans",
    derniereErreur:null,uptime:"90j 4h",tempMoyenScan:8.2},
];

const USER_ASSOC=[
  {userId:"U001",nom:"Rakoto Jean-Baptiste",compteCopieur:"rjb.softwell",pin:"4521",badge:"NFC-0012",appareils:["MFP-001","MFP-002","MFP-005"],authMode:"LDAP",dernierScan:"2025-02-28T14:30:00",scansTotal:234},
  {userId:"U002",nom:"Randria Marie-Claire",compteCopieur:"rmc.softwell",pin:"7834",badge:"NFC-0045",appareils:["MFP-002","MFP-001"],authMode:"LDAP",dernierScan:"2025-02-28T11:15:00",scansTotal:187},
  {userId:"U003",nom:"Razafy Pierre",compteCopieur:"rp.daf",pin:"1290",badge:"NFC-0003",appareils:["MFP-001","MFP-002","MFP-005","MFP-004"],authMode:"LDAP + Badge",dernierScan:"2025-02-28T15:02:00",scansTotal:312},
  {userId:"U004",nom:"Rasoamanarivo Hanta",compteCopieur:"rh.compta",pin:"5678",badge:null,appareils:["MFP-002"],authMode:"PIN",dernierScan:"2025-02-27T16:45:00",scansTotal:145},
  {userId:"U005",nom:"Andriamananjara Lova",compteCopieur:"al.rh",pin:"9012",badge:"NFC-0078",appareils:["MFP-003"],authMode:"Carte NFC",dernierScan:"2025-02-28T09:20:00",scansTotal:89},
  {userId:"U006",nom:"Ratsimbazafy Noro",compteCopieur:"rn.jurid",pin:"3456",badge:"NFC-0091",appareils:["MFP-005","MFP-001"],authMode:"LDAP + Badge",dernierScan:"2025-02-26T10:10:00",scansTotal:201},
  {userId:"U007",nom:"Rajaonarivelo Fidy",compteCopieur:"rf.tech",pin:"7890",badge:null,appareils:["MFP-006","MFP-004"],authMode:"Login/MdP",dernierScan:"2025-02-28T13:50:00",scansTotal:67},
];

const SCAN_INBOX=[
  {id:"SCN-2025-0048",appareilId:"MFP-001",userId:"U003",date:"2025-02-28T15:42:00",pages:3,format:"PDF/A",taille:"2.4 MB",resolution:"600 dpi",recto_verso:true,
    statut:"a_valider",ocrConfiance:94,
    metaAuto:{type:"Facture",fournisseur:"JIRAMA",montant:"4.250.000 MGA",date:"25/02/2025",reference:"JIR-FACT-2025-0847",nif:"2001987654"},
    fichier:"scan_20250228_154200_rp.pdf",apercu:true},
  {id:"SCN-2025-0047",appareilId:"MFP-002",userId:"U002",date:"2025-02-28T11:15:00",pages:8,format:"PDF",taille:"5.1 MB",resolution:"600 dpi",recto_verso:true,
    statut:"a_valider",ocrConfiance:87,
    metaAuto:{type:"Contrat",fournisseur:"TELMA SA",montant:"12.300.000 MGA",date:"20/02/2025",reference:"TEL-CTR-2025-011"},
    fichier:"scan_20250228_111500_rmc.pdf",apercu:true},
  {id:"SCN-2025-0046",appareilId:"MFP-003",userId:"U005",date:"2025-02-28T09:20:00",pages:2,format:"TIFF",taille:"1.8 MB",resolution:"300 dpi",recto_verso:false,
    statut:"a_valider",ocrConfiance:72,
    metaAuto:{type:"Dossier RH",fournisseur:null,montant:null,date:"28/02/2025",reference:"DRH-EMB-2025-015"},
    fichier:"scan_20250228_092000_al.tiff",apercu:true},
  {id:"SCN-2025-0045",appareilId:"MFP-001",userId:"U001",date:"2025-02-28T08:45:00",pages:1,format:"PDF/A",taille:"0.8 MB",resolution:"600 dpi",recto_verso:false,
    statut:"valide",ocrConfiance:98,
    metaAuto:{type:"Correspondance",fournisseur:"Ministère Finances",date:"22/02/2025",reference:"MF/DGI/2025-198"},
    fichier:"scan_20250228_084500_rjb.pdf",apercu:true,docCree:"DOC-2025-0156"},
  {id:"SCN-2025-0044",appareilId:"MFP-004",userId:"U007",date:"2025-02-27T16:30:00",pages:12,format:"PDF",taille:"8.7 MB",resolution:"600 dpi",recto_verso:true,
    statut:"valide",ocrConfiance:91,
    metaAuto:{type:"Rapport audit",fournisseur:"Cabinet EY",date:"15/02/2025",reference:"EY-AUD-2025-Q1"},
    fichier:"scan_20250227_163000_rf.pdf",apercu:true,docCree:"DOC-2025-0155"},
  {id:"SCN-2025-0043",appareilId:"MFP-002",userId:"U004",date:"2025-02-27T14:20:00",pages:4,format:"PDF",taille:"3.2 MB",resolution:"600 dpi",recto_verso:true,
    statut:"rejete",ocrConfiance:35,
    metaAuto:{type:"Indéterminé",fournisseur:null,date:"27/02/2025",reference:null},
    fichier:"scan_20250227_142000_rh.pdf",apercu:true,motifRejet:"Scan illisible — qualité insuffisante"},
  {id:"SCN-2025-0042",appareilId:"MFP-006",userId:"U007",date:"2025-02-27T11:00:00",pages:6,format:"TIFF",taille:"4.5 MB",resolution:"300 dpi",recto_verso:false,
    statut:"en_cours",ocrConfiance:82,
    metaAuto:{type:"Plan technique",fournisseur:"Bureau d'études",date:"10/02/2025",reference:"BE-PLN-2025-003"},
    fichier:"scan_20250227_110000_rf.tiff",apercu:true},
  {id:"SCN-2025-0041",appareilId:"MFP-001",userId:"U003",date:"2025-02-27T09:15:00",pages:5,format:"PDF/A",taille:"3.8 MB",resolution:"600 dpi",recto_verso:true,
    statut:"valide",ocrConfiance:96,
    metaAuto:{type:"PV Conseil Admin.",fournisseur:null,date:"26/02/2025",reference:"CA-PV-2025-002"},
    fichier:"scan_20250227_091500_rp.pdf",apercu:true,docCree:"DOC-2025-0154"},
];

const OP_JOURNAL=[
  {date:"2025-02-28T15:42:00",appareil:"MFP-001",user:"Razafy Pierre",action:"Scan",detail:"3 pages → PDF/A, OCR 94%, auto-indexé Facture JIRAMA",statut:"success"},
  {date:"2025-02-28T15:30:00",appareil:"MFP-006",user:"Système",action:"Heartbeat",detail:"Ping OK — temps réponse 12ms",statut:"success"},
  {date:"2025-02-28T14:55:00",appareil:"MFP-003",user:"Système",action:"Alerte toner",detail:"Toner noir à 15% — commande recommandée",statut:"warning"},
  {date:"2025-02-28T11:15:00",appareil:"MFP-002",user:"Randria Marie-Claire",action:"Scan",detail:"8 pages → PDF, OCR 87%, Contrat TELMA",statut:"success"},
  {date:"2025-02-28T09:20:00",appareil:"MFP-003",user:"Andriamananjara Lova",action:"Scan",detail:"2 pages → TIFF, OCR 72%, Dossier RH",statut:"success"},
  {date:"2025-02-28T08:45:00",appareil:"MFP-001",user:"Rakoto Jean-Baptiste",action:"Scan",detail:"1 page → PDF/A, OCR 98%, Correspondance MF",statut:"success"},
  {date:"2025-02-27T16:30:00",appareil:"MFP-004",user:"Rajaonarivelo Fidy",action:"Scan",detail:"12 pages → PDF, OCR 91%, Rapport audit EY",statut:"success"},
  {date:"2025-02-27T14:20:00",appareil:"MFP-002",user:"Rasoamanarivo Hanta",action:"Scan",detail:"4 pages → PDF, OCR 35% — REJETÉ qualité",statut:"error"},
  {date:"2025-02-27T11:20:00",appareil:"MFP-005",user:"Système",action:"Perte connexion",detail:"Bourrage papier bac 2 — appareil hors ligne",statut:"error"},
  {date:"2025-02-27T11:00:00",appareil:"MFP-006",user:"Rajaonarivelo Fidy",action:"Scan",detail:"6 pages → TIFF, OCR 82%, Plan technique",statut:"success"},
  {date:"2025-02-27T09:15:00",appareil:"MFP-001",user:"Razafy Pierre",action:"Scan",detail:"5 pages → PDF/A, OCR 96%, PV CA",statut:"success"},
  {date:"2025-02-27T08:00:00",appareil:"MFP-001",user:"Système",action:"Heartbeat",detail:"Mise à jour firmware 3.12.1 — redémarrage OK",statut:"success"},
  {date:"2025-02-26T10:10:00",appareil:"MFP-005",user:"Ratsimbazafy Noro",action:"Scan",detail:"4 pages → PDF/A, OCR 93%, Bail juridique",statut:"success"},
  {date:"2025-02-26T08:00:00",appareil:"MFP-004",user:"Système",action:"Heartbeat",detail:"Synchronisation compteurs — OK",statut:"success"},
];

/* ─── SVG Icons (inline) ─── */
const I={
  printer:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  scan:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="12" x2="21" y2="12"/><polyline points="8 8 8 3"/><polyline points="16 8 16 3"/></svg>,
  wifi:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>,
  user:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  inbox:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>,
  log:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  cog:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  check:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  x:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  eye:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  link:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  alert:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  refresh:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  search:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  plus:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  file:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  zap:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
};

const MARQUE_COLORS={Canon:"#cc0000",Xerox:"#0072CE",Ricoh:"#e60012"};
const MARQUE_LOGOS={
  Canon:<div style={{width:32,height:32,borderRadius:7,background:"linear-gradient(135deg,#cc0000,#ff3333)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:10,fontWeight:900,letterSpacing:.5}}>C</div>,
  Xerox:<div style={{width:32,height:32,borderRadius:7,background:"linear-gradient(135deg,#0072CE,#00a0e0)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:10,fontWeight:900,letterSpacing:.5}}>X</div>,
  Ricoh:<div style={{width:32,height:32,borderRadius:7,background:"linear-gradient(135deg,#e60012,#ff4444)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:10,fontWeight:900,letterSpacing:.5}}>R</div>,
};

const STATUS_UI={en_ligne:{label:"En ligne",color:SUC,bg:SUCB,dot:"#22c55e"},attention:{label:"Attention",color:WRN,bg:WRNB,dot:"#f59e0b"},hors_ligne:{label:"Hors ligne",color:DNG,bg:DNGB,dot:"#ef4444"}};
const SCAN_STATUS={a_valider:{label:"À valider",color:WRN,bg:WRNB},valide:{label:"Validé",color:SUC,bg:SUCB},rejete:{label:"Rejeté",color:DNG,bg:DNGB},en_cours:{label:"En cours",color:INF,bg:INFB}};
const LOG_STATUS={success:{color:SUC,bg:SUCB},warning:{color:WRN,bg:WRNB},error:{color:DNG,bg:DNGB}};

const fmtDate=(d)=>{try{return new Date(d).toLocaleString("fr-FR",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"});}catch{return d||"—";}};
const fmtShort=(d)=>{try{return new Date(d).toLocaleString("fr-FR",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"});}catch{return d||"—";}};
const ago=(d)=>{if(!d)return"—";const diff=Date.now()-new Date(d).getTime();const m=Math.floor(diff/60000);if(m<60)return`il y a ${m}min`;const h=Math.floor(m/60);if(h<24)return`il y a ${h}h`;return`il y a ${Math.floor(h/24)}j`;};
const pct=(v,mx)=>mx>0?Math.round((v/mx)*100):0;

/* ─── Toner bar component ─── */
function TonerBar({label,value,color}){
  const bg=value<=20?"#fef2f2":value<=40?"#fffbeb":"#f0fdf4";
  const fg=value<=20?DNG:value<=40?WRN:SUC;
  return(
    <div style={{display:"flex",alignItems:"center",gap:6,fontSize:10}}>
      <div style={{width:8,height:8,borderRadius:2,background:color,flexShrink:0}}/>
      <span style={{width:14,color:MUT}}>{label}</span>
      <div style={{flex:1,height:6,background:"#f1f5f9",borderRadius:3,overflow:"hidden"}}>
        <div style={{width:`${value}%`,height:"100%",background:fg,borderRadius:3,transition:"width .4s"}}/>
      </div>
      <span style={{fontWeight:700,color:fg,minWidth:26,textAlign:"right"}}>{value}%</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TABS CONFIG
═══════════════════════════════════════════════════════ */
const TABS=[
  {id:"dashboard",label:"Tableau de bord",icon:I.printer},
  {id:"appareils",label:"Appareils",icon:I.wifi},
  {id:"associations",label:"Associations",icon:I.user},
  {id:"scans",label:"Boîte de scan",icon:I.inbox},
  {id:"journal",label:"Journal",icon:I.log},
  {id:"params",label:"Paramètres",icon:I.cog},
];

/* ═══════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════ */
export default function LibMFP({documents=[],users=[],emplacements=[],lang,t}){
  const[tab,setTab]=useState("dashboard");
  const[search,setSearch]=useState("");
  const[selectedDevice,setSelectedDevice]=useState(null);
  const[selectedScan,setSelectedScan]=useState(null);
  const[showAddDevice,setShowAddDevice]=useState(false);
  const[isMobile,setIsMobile]=useState(false);
  const[scanFilter,setScanFilter]=useState("all");

  useEffect(()=>{
    const check=()=>setIsMobile(window.innerWidth<768);
    check();window.addEventListener("resize",check);return()=>window.removeEventListener("resize",check);
  },[]);

  const fr=lang!=="en";
  const devices=MFP_DEVICES;
  const assocs=USER_ASSOC;
  const scans=SCAN_INBOX;
  const journal=OP_JOURNAL;

  /* KPIs */
  const enLigne=devices.filter(d=>d.statut==="en_ligne").length;
  const attention=devices.filter(d=>d.statut==="attention").length;
  const horsLigne=devices.filter(d=>d.statut==="hors_ligne").length;
  const totalScans=devices.reduce((s,d)=>s+d.compteurs.scan,0);
  const scansAValider=scans.filter(s=>s.statut==="a_valider").length;
  const scansValides=scans.filter(s=>s.statut==="valide").length;
  const avgOcr=Math.round(scans.reduce((s,sc)=>s+sc.ocrConfiance,0)/scans.length);

  /* ═══════════ TAB: DASHBOARD ═══════════ */
  const renderDashboard=()=>(
    <div>
      {/* KPI Cards */}
      <div style={{display:"grid",gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(4,1fr)",gap:12,marginBottom:20}}>
        {[
          {label:fr?"Appareils connectés":"Connected devices",value:`${enLigne}/${devices.length}`,sub:`${attention} attention · ${horsLigne} hors ligne`,color:SUC,bg:SUCB,icon:I.wifi},
          {label:fr?"Scans aujourd'hui":"Scans today",value:"14",sub:fr?`${totalScans.toLocaleString("fr-FR")} total cumulé`:`${totalScans.toLocaleString()} cumulative`,color:INF,bg:INFB,icon:I.scan},
          {label:fr?"À valider":"Pending validation",value:String(scansAValider),sub:fr?`${scansValides} validés ce mois`:`${scansValides} validated this month`,color:WRN,bg:WRNB,icon:I.inbox},
          {label:fr?"Confiance OCR moy.":"Avg OCR confidence",value:`${avgOcr}%`,sub:fr?"Extraction automatique":"Auto extraction",color:PUR,bg:PURB,icon:I.zap},
        ].map((k,i)=>(
          <div key={i} style={{...card(),padding:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
              <div style={{width:36,height:36,borderRadius:8,background:k.bg,display:"flex",alignItems:"center",justifyContent:"center",color:k.color}}>{k.icon}</div>
            </div>
            <div style={{fontSize:22,fontWeight:800,color:TXT}}>{k.value}</div>
            <div style={{fontSize:11,fontWeight:600,color:SEC,marginTop:2}}>{k.label}</div>
            <div style={{fontSize:10,color:MUT,marginTop:4}}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Device status grid */}
      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:16}}>
        {/* Left: Devices overview */}
        <div style={{...card()}}>
          <div style={{padding:"14px 16px",borderBottom:`1px solid ${BD}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <h3 style={{fontSize:13,fontWeight:700,color:TXT,margin:0}}>{fr?"État des équipements":"Device status"}</h3>
            <button onClick={()=>setTab("appareils")} style={{...btnSm("transparent",PL),padding:"4px 8px",fontSize:11}}>{fr?"Voir tout":"View all"}</button>
          </div>
          <div style={{padding:12}}>
            {devices.map(d=>{
              const st=STATUS_UI[d.statut];
              return(
                <div key={d.id} onClick={()=>{setSelectedDevice(d);setTab("appareils");}}
                  style={{display:"flex",alignItems:"center",gap:10,padding:"10px 8px",borderRadius:8,cursor:"pointer",marginBottom:2,transition:"background .12s"}}
                  onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  {MARQUE_LOGOS[d.marque]}
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,fontWeight:600,color:TXT,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.nom}</div>
                    <div style={{fontSize:10,color:MUT}}>{d.site} · {d.ip}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    <div style={{width:7,height:7,borderRadius:"50%",background:st.dot,boxShadow:`0 0 6px ${st.dot}44`}}/>
                    <span style={{fontSize:10,fontWeight:600,color:st.color}}>{st.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Recent scans */}
        <div style={{...card()}}>
          <div style={{padding:"14px 16px",borderBottom:`1px solid ${BD}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <h3 style={{fontSize:13,fontWeight:700,color:TXT,margin:0}}>{fr?"Derniers scans reçus":"Recent scans"}</h3>
            <button onClick={()=>setTab("scans")} style={{...btnSm("transparent",PL),padding:"4px 8px",fontSize:11}}>{fr?"Voir tout":"View all"}</button>
          </div>
          <div style={{padding:12}}>
            {scans.slice(0,5).map(s=>{
              const st=SCAN_STATUS[s.statut];
              const dev=devices.find(d=>d.id===s.appareilId);
              const usr=assocs.find(a=>a.userId===s.userId);
              return(
                <div key={s.id} onClick={()=>{setSelectedScan(s);setTab("scans");}}
                  style={{display:"flex",alignItems:"center",gap:10,padding:"10px 8px",borderRadius:8,cursor:"pointer",marginBottom:2,transition:"background .12s"}}
                  onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <div style={{width:32,height:32,borderRadius:7,background:s.ocrConfiance>=80?SUCB:s.ocrConfiance>=50?WRNB:DNGB,
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,
                    color:s.ocrConfiance>=80?SUC:s.ocrConfiance>=50?WRN:DNG}}>{s.ocrConfiance}%</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,fontWeight:600,color:TXT,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                      {s.metaAuto.type} {s.metaAuto.fournisseur?`— ${s.metaAuto.fournisseur}`:""}
                    </div>
                    <div style={{fontSize:10,color:MUT}}>{usr?.nom?.split(" ")[0]} · {s.pages}p · {fmtShort(s.date)}</div>
                  </div>
                  <span style={badge(st.bg,st.color)}>{st.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Protocole breakdown */}
      <div style={{...card(),marginTop:16,padding:16}}>
        <h3 style={{fontSize:13,fontWeight:700,color:TXT,margin:"0 0 12px"}}>{fr?"Répartition par protocole":"Protocol breakdown"}</h3>
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          {["Scan to API","WebDAV","SMB","FTP","REST API"].map(proto=>{
            const count=devices.filter(d=>d.protocole===proto).length;
            return count>0?(
              <div key={proto} style={{...badge(PLR,P),padding:"6px 14px",fontSize:11}}>
                <span style={{display:"flex"}}>{I.link}</span> {proto} ({count})
              </div>
            ):null;
          })}
        </div>
      </div>
    </div>
  );

  /* ═══════════ TAB: APPAREILS ═══════════ */
  const renderAppareils=()=>{
    const filtered=devices.filter(d=>{
      if(!search)return true;
      const q=search.toLowerCase();
      return d.nom.toLowerCase().includes(q)||d.ip.includes(q)||d.site.toLowerCase().includes(q)||d.marque.toLowerCase().includes(q);
    });

    return(
      <div>
        {/* Toolbar */}
        <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
          <div style={{position:"relative",flex:1,minWidth:200}}>
            <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",display:"flex",color:MUT}}>{I.search}</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={fr?"Rechercher appareil (nom, IP, site…)":"Search device (name, IP, site…)"}
              style={{...inp({paddingLeft:32})}}/>
          </div>
          <button onClick={()=>setShowAddDevice(true)} style={btnSm(P)}>
            <span style={{display:"flex"}}>{I.plus}</span> {fr?"Ajouter MFP":"Add MFP"}
          </button>
        </div>

        {selectedDevice?renderDeviceDetail():
        <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(2,1fr)",gap:14}}>
          {filtered.map(d=>{
            const st=STATUS_UI[d.statut];
            return(
              <div key={d.id} onClick={()=>setSelectedDevice(d)} style={{...card({cursor:"pointer",transition:"all .15s"})}}
                onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,.08)";e.currentTarget.style.borderColor=PL;}}
                onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor=BD;}}>
                <div style={{padding:16}}>
                  <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
                    {MARQUE_LOGOS[d.marque]}
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:700,color:TXT}}>{d.nom}</div>
                      <div style={{fontSize:11,color:MUT}}>{d.site} · <span style={{fontFamily:"monospace"}}>{d.ip}</span></div>
                    </div>
                    <span style={badge(st.bg,st.color)}>
                      <div style={{width:6,height:6,borderRadius:"50%",background:st.dot}}/>{st.label}
                    </span>
                  </div>

                  {/* Stats row */}
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
                    {[
                      {label:"Scans",val:d.compteurs.scan.toLocaleString("fr-FR")},
                      {label:"Protocole",val:d.protocole},
                      {label:"Auth",val:d.authMode},
                    ].map((s,i)=>(
                      <div key={i} style={{textAlign:"center"}}>
                        <div style={{fontSize:12,fontWeight:700,color:TXT}}>{s.val}</div>
                        <div style={{fontSize:9,color:MUT,textTransform:"uppercase"}}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Toner */}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
                    <TonerBar label="C" value={d.toner.cyan} color="#06b6d4"/>
                    <TonerBar label="M" value={d.toner.magenta} color="#ec4899"/>
                    <TonerBar label="Y" value={d.toner.jaune} color="#eab308"/>
                    <TonerBar label="K" value={d.toner.noir} color="#1e293b"/>
                  </div>

                  {/* Errors */}
                  {d.derniereErreur&&(
                    <div style={{marginTop:8,padding:"6px 10px",borderRadius:6,background:DNGB,fontSize:10,color:DNG,display:"flex",alignItems:"center",gap:5}}>
                      <span style={{display:"flex"}}>{I.alert}</span>{d.derniereErreur}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>}
      </div>
    );
  };

  /* ── Device Detail Panel ── */
  const renderDeviceDetail=()=>{
    const d=selectedDevice;if(!d)return null;
    const st=STATUS_UI[d.statut];
    const devAssocs=assocs.filter(a=>a.appareils.includes(d.id));
    const devScans=scans.filter(s=>s.appareilId===d.id);
    const devLogs=journal.filter(j=>j.appareil===d.id);
    return(
      <div style={{animation:"modalIn .2s ease"}}>
        <button onClick={()=>setSelectedDevice(null)} style={{...btnSm("#f1f5f9",SEC),marginBottom:14}}>
          ← {fr?"Retour liste":"Back to list"}
        </button>
        <div style={{...card(),padding:20}}>
          {/* Header */}
          <div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:16,flexWrap:"wrap"}}>
            <div style={{width:48,height:48,borderRadius:10,background:`linear-gradient(135deg,${MARQUE_COLORS[d.marque]},${MARQUE_COLORS[d.marque]}88)`,
              display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:16,fontWeight:900}}>{d.marque[0]}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                <h2 style={{fontSize:16,fontWeight:700,color:TXT,margin:0}}>{d.nom}</h2>
                <span style={badge(st.bg,st.color)}><div style={{width:6,height:6,borderRadius:"50%",background:st.dot}}/>{st.label}</span>
              </div>
              <div style={{fontSize:12,color:MUT,marginTop:2}}>{d.site} · {d.emplacement}</div>
            </div>
          </div>

          {/* Info grid */}
          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(3,1fr)",gap:12,marginBottom:16}}>
            {[
              {l:fr?"Adresse IP":"IP Address",v:d.ip,m:d.dns},{l:fr?"Protocole":"Protocol",v:d.protocole,m:`Port ${d.port} ${d.ssl?"(SSL)":""}`},
              {l:fr?"Authentification":"Authentication",v:d.authMode,m:d.badge||"—"},{l:"Firmware",v:d.firmware,m:`Uptime: ${d.uptime}`},
              {l:fr?"Résolution":"Resolution",v:d.resolution,m:d.recto_verso?fr?"Recto-verso":"Duplex":fr?"Recto seul":"Simplex"},
              {l:fr?"Vitesse scan":"Scan speed",v:d.capaciteScan,m:`${d.tempMoyenScan}s/page moy.`},
            ].map((f,i)=>(
              <div key={i} style={{padding:12,background:"#f8fafc",borderRadius:8}}>
                <div style={{fontSize:10,color:MUT,fontWeight:600,textTransform:"uppercase",marginBottom:3}}>{f.l}</div>
                <div style={{fontSize:13,fontWeight:600,color:TXT}}>{f.v}</div>
                <div style={{fontSize:10,color:MUT}}>{f.m}</div>
              </div>
            ))}
          </div>

          {/* Counters */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:16}}>
            {[{l:"Scans",v:d.compteurs.scan,c:INF},{l:"Copies",v:d.compteurs.copie,c:PUR},{l:"Impressions",v:d.compteurs.impression,c:P},{l:"Couleur",v:d.compteurs.couleur,c:WRN}].map((ct,i)=>(
              <div key={i} style={{textAlign:"center",padding:10,background:"#f8fafc",borderRadius:8}}>
                <div style={{fontSize:16,fontWeight:800,color:ct.c}}>{ct.v.toLocaleString("fr-FR")}</div>
                <div style={{fontSize:10,color:MUT}}>{ct.l}</div>
              </div>
            ))}
          </div>

          {/* Toner + Paper */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:SEC,textTransform:"uppercase",marginBottom:8}}>{fr?"Niveaux toner":"Toner levels"}</div>
              <div style={{display:"grid",gap:6}}>
                <TonerBar label="C" value={d.toner.cyan} color="#06b6d4"/>
                <TonerBar label="M" value={d.toner.magenta} color="#ec4899"/>
                <TonerBar label="Y" value={d.toner.jaune} color="#eab308"/>
                <TonerBar label="K" value={d.toner.noir} color="#1e293b"/>
              </div>
            </div>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:SEC,textTransform:"uppercase",marginBottom:8}}>{fr?"Papier":"Paper"}</div>
              <div style={{display:"grid",gap:8}}>
                <div style={{padding:10,background:"#f8fafc",borderRadius:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:12,fontWeight:600}}>A4</span>
                  <span style={{fontSize:14,fontWeight:800,color:d.papier.a4>200?SUC:d.papier.a4>50?WRN:DNG}}>{d.papier.a4} {fr?"feuilles":"sheets"}</span>
                </div>
                <div style={{padding:10,background:"#f8fafc",borderRadius:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:12,fontWeight:600}}>A3</span>
                  <span style={{fontSize:14,fontWeight:800,color:d.papier.a3>50?SUC:d.papier.a3>10?WRN:DNG}}>{d.papier.a3} {fr?"feuilles":"sheets"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Formats + Users */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:SEC,textTransform:"uppercase",marginBottom:8}}>{fr?"Formats supportés":"Supported formats"}</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {d.formats.map(f=><span key={f} style={badge(PLR,P)}>{f}</span>)}
              </div>
            </div>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:SEC,textTransform:"uppercase",marginBottom:8}}>{fr?"Utilisateurs associés":"Associated users"} ({devAssocs.length})</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {devAssocs.map(a=><span key={a.userId} style={badge("#f1f5f9",SEC)}>{I.user} {a.nom.split(" ")[0]}</span>)}
              </div>
            </div>
          </div>

          {d.derniereErreur&&(
            <div style={{marginTop:12,padding:"10px 14px",borderRadius:8,background:DNGB,border:`1px solid ${DNG}20`,display:"flex",alignItems:"center",gap:8}}>
              <span style={{display:"flex",color:DNG}}>{I.alert}</span>
              <div><div style={{fontSize:12,fontWeight:600,color:DNG}}>{fr?"Dernière erreur":"Last error"}</div><div style={{fontSize:11,color:SEC}}>{d.derniereErreur}</div></div>
            </div>
          )}
        </div>
      </div>
    );
  };

  /* ═══════════ TAB: ASSOCIATIONS ═══════════ */
  const renderAssociations=()=>(
    <div>
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
        <h3 style={{fontSize:14,fontWeight:700,color:TXT,margin:0}}>{fr?"Associations Utilisateur ↔ Copieur":"User ↔ Copier Associations"}</h3>
        <span style={badge(PLR,P)}>{assocs.length} {fr?"utilisateurs":"users"}</span>
      </div>
      <div style={{...card(),overflow:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead>
            <tr style={{background:"#f8fafc"}}>
              {[fr?"Utilisateur":"User",fr?"Compte copieur":"Copier account","PIN",fr?"Badge":"Badge",fr?"Appareils":"Devices","Auth",fr?"Dernier scan":"Last scan",fr?"Total scans":"Total scans"].map(h=>(
                <th key={h} style={{padding:"10px 12px",textAlign:"left",fontWeight:700,fontSize:10,color:MUT,textTransform:"uppercase",borderBottom:`2px solid ${BD}`,whiteSpace:"nowrap"}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {assocs.map((a,i)=>(
              <tr key={a.userId} style={{borderBottom:`1px solid ${BD}`}}
                onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{padding:"10px 12px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${P},${PL})`,
                      display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:10,fontWeight:700}}>
                      {a.nom.split(" ").map(n=>n[0]).join("").slice(0,2)}
                    </div>
                    <div><div style={{fontWeight:600,color:TXT}}>{a.nom}</div><div style={{fontSize:10,color:MUT}}>{a.userId}</div></div>
                  </div>
                </td>
                <td style={{padding:"10px 12px",fontFamily:"monospace",fontSize:11,color:SEC}}>{a.compteCopieur}</td>
                <td style={{padding:"10px 12px",fontFamily:"monospace",color:MUT}}>****</td>
                <td style={{padding:"10px 12px"}}>{a.badge?<span style={badge(PURB,PUR)}>{a.badge}</span>:<span style={{color:MUT}}>—</span>}</td>
                <td style={{padding:"10px 12px"}}>
                  <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                    {a.appareils.map(aid=>{const dev=devices.find(d=>d.id===aid);return(
                      <span key={aid} style={badge("#f1f5f9",SEC,{fontSize:9})}>{dev?.marque?.slice(0,3)||aid}</span>
                    );})}
                  </div>
                </td>
                <td style={{padding:"10px 12px"}}><span style={badge("#f1f5f9",SEC,{fontSize:10})}>{a.authMode}</span></td>
                <td style={{padding:"10px 12px",fontSize:11,color:MUT}}>{fmtShort(a.dernierScan)}</td>
                <td style={{padding:"10px 12px",fontWeight:700,color:TXT}}>{a.scansTotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  /* ═══════════ TAB: SCANS ═══════════ */
  const renderScans=()=>{
    const filteredScans=scans.filter(s=>scanFilter==="all"||s.statut===scanFilter);
    return(
      <div>
        <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
          <h3 style={{fontSize:14,fontWeight:700,color:TXT,margin:0,flex:1}}>{fr?"Boîte de réception scan":"Scan inbox"}</h3>
          {["all","a_valider","valide","en_cours","rejete"].map(f=>{
            const labels={all:fr?"Tous":"All",a_valider:fr?"À valider":"Pending",valide:fr?"Validés":"Validated",en_cours:fr?"En cours":"Processing",rejete:fr?"Rejetés":"Rejected"};
            const active=scanFilter===f;
            return <button key={f} onClick={()=>setScanFilter(f)} style={{...btnSm(active?P:"#f1f5f9",active?"#fff":SEC),fontSize:11}}>{labels[f]}</button>;
          })}
        </div>

        {selectedScan?renderScanDetail():
        <div style={{display:"grid",gap:10}}>
          {filteredScans.map(s=>{
            const st=SCAN_STATUS[s.statut];
            const dev=devices.find(d=>d.id===s.appareilId);
            const usr=assocs.find(a=>a.userId===s.userId);
            return(
              <div key={s.id} onClick={()=>setSelectedScan(s)}
                style={{...card({cursor:"pointer",transition:"all .15s",padding:16}),display:"flex",gap:14,alignItems:"flex-start",flexWrap:"wrap"}}
                onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,.06)";e.currentTarget.style.borderColor=PL;}}
                onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor=BD;}}>
                {/* OCR badge */}
                <div style={{width:44,height:44,borderRadius:10,
                  background:s.ocrConfiance>=80?SUCB:s.ocrConfiance>=50?WRNB:DNGB,
                  display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",flexShrink:0}}>
                  <div style={{fontSize:14,fontWeight:800,color:s.ocrConfiance>=80?SUC:s.ocrConfiance>=50?WRN:DNG}}>{s.ocrConfiance}%</div>
                  <div style={{fontSize:7,color:MUT}}>OCR</div>
                </div>
                {/* Content */}
                <div style={{flex:1,minWidth:200}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4,flexWrap:"wrap"}}>
                    <span style={{fontSize:13,fontWeight:700,color:TXT}}>{s.metaAuto.type}</span>
                    {s.metaAuto.fournisseur&&<span style={{fontSize:11,color:SEC}}>— {s.metaAuto.fournisseur}</span>}
                    <span style={badge(st.bg,st.color)}>{st.label}</span>
                  </div>
                  <div style={{fontSize:11,color:MUT,display:"flex",gap:10,flexWrap:"wrap"}}>
                    <span>{usr?.nom||s.userId}</span>
                    <span>·</span>
                    <span>{dev?.nom?.split(" ").slice(0,2).join(" ")||s.appareilId}</span>
                    <span>·</span>
                    <span>{s.pages}p · {s.format} · {s.taille}</span>
                    <span>·</span>
                    <span>{fmtShort(s.date)}</span>
                  </div>
                  {s.metaAuto.reference&&<div style={{fontSize:10,color:MUT,marginTop:3}}>Réf: <span style={{fontFamily:"monospace",color:SEC}}>{s.metaAuto.reference}</span></div>}
                  {s.metaAuto.montant&&<div style={{fontSize:10,color:MUT}}>Montant: <span style={{fontWeight:700,color:TXT}}>{s.metaAuto.montant}</span></div>}
                  {s.docCree&&<div style={{fontSize:10,color:SUC,marginTop:2}}>✓ Fiche créée : <span style={{fontWeight:600}}>{s.docCree}</span></div>}
                  {s.motifRejet&&<div style={{fontSize:10,color:DNG,marginTop:2}}>✗ {s.motifRejet}</div>}
                </div>
              </div>
            );
          })}
        </div>}
      </div>
    );
  };

  /* ── Scan Detail Panel ── */
  const renderScanDetail=()=>{
    const s=selectedScan;if(!s)return null;
    const st=SCAN_STATUS[s.statut];
    const dev=devices.find(d=>d.id===s.appareilId);
    const usr=assocs.find(a=>a.userId===s.userId);
    const meta=s.metaAuto;
    return(
      <div style={{animation:"modalIn .2s ease"}}>
        <button onClick={()=>setSelectedScan(null)} style={{...btnSm("#f1f5f9",SEC),marginBottom:14}}>
          ← {fr?"Retour":"Back"}
        </button>
        <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:16}}>
          {/* Left: Scan info */}
          <div style={{...card(),padding:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <h3 style={{fontSize:15,fontWeight:700,color:TXT,margin:0}}>{s.id}</h3>
              <span style={badge(st.bg,st.color,{padding:"4px 12px",fontSize:11})}>{st.label}</span>
            </div>
            <div style={{display:"grid",gap:8,marginBottom:16}}>
              {[
                {l:fr?"Appareil":"Device",v:dev?.nom||s.appareilId},{l:fr?"Utilisateur":"User",v:usr?.nom||s.userId},
                {l:"Date",v:fmtDate(s.date)},{l:"Pages",v:`${s.pages} page(s)`},
                {l:"Format",v:`${s.format} — ${s.resolution}`},{l:fr?"Taille":"Size",v:s.taille},
                {l:"Recto-verso",v:s.recto_verso?"Oui":"Non"},{l:fr?"Fichier":"File",v:s.fichier},
              ].map((f,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${BD}`}}>
                  <span style={{fontSize:11,color:MUT}}>{f.l}</span>
                  <span style={{fontSize:12,fontWeight:600,color:TXT}}>{f.v}</span>
                </div>
              ))}
            </div>

            {/* OCR gauge */}
            <div style={{padding:14,background:"#f8fafc",borderRadius:10,marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{fontSize:11,fontWeight:700,color:SEC}}>{fr?"Confiance OCR":"OCR Confidence"}</span>
                <span style={{fontSize:16,fontWeight:800,color:s.ocrConfiance>=80?SUC:s.ocrConfiance>=50?WRN:DNG}}>{s.ocrConfiance}%</span>
              </div>
              <div style={{height:8,background:"#e2e8f0",borderRadius:4,overflow:"hidden"}}>
                <div style={{width:`${s.ocrConfiance}%`,height:"100%",borderRadius:4,
                  background:s.ocrConfiance>=80?SUC:s.ocrConfiance>=50?WRN:DNG,transition:"width .4s"}}/>
              </div>
            </div>

            {s.statut==="a_valider"&&(
              <div style={{display:"flex",gap:8}}>
                <button style={{...btnSm(SUC),flex:1}}><span style={{display:"flex"}}>{I.check}</span> {fr?"Valider & créer fiche":"Validate & create record"}</button>
                <button style={{...btnSm(DNG),flex:1}}><span style={{display:"flex"}}>{I.x}</span> {fr?"Rejeter":"Reject"}</button>
              </div>
            )}
          </div>

          {/* Right: Auto-extracted metadata */}
          <div style={{...card(),padding:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <h3 style={{fontSize:14,fontWeight:700,color:TXT,margin:0}}>
                <span style={{display:"inline-flex",verticalAlign:"middle",marginRight:6,color:PUR}}>{I.zap}</span>
                {fr?"Métadonnées extraites (OCR)":"Extracted metadata (OCR)"}
              </h3>
            </div>
            <div style={{padding:12,background:PURB,borderRadius:8,border:`1px solid ${PUR}20`,marginBottom:16}}>
              <div style={{fontSize:10,color:PUR,fontWeight:600,marginBottom:6}}>{fr?"EXTRACTION AUTOMATIQUE — Vérifiez et corrigez si nécessaire":"AUTO EXTRACTION — Review and correct if needed"}</div>
            </div>

            <div style={{display:"grid",gap:10}}>
              {[
                {l:fr?"Type détecté":"Detected type",v:meta.type,conf:s.ocrConfiance>=80},
                {l:fr?"Fournisseur / Émetteur":"Supplier / Issuer",v:meta.fournisseur||"—",conf:!!meta.fournisseur},
                {l:fr?"Référence":"Reference",v:meta.reference||"—",conf:!!meta.reference},
                {l:"Date",v:meta.date||"—",conf:!!meta.date},
                {l:fr?"Montant":"Amount",v:meta.montant||"—",conf:!!meta.montant},
                {l:"NIF",v:meta.nif||"—",conf:!!meta.nif},
              ].map((f,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:"#f8fafc",borderRadius:8,border:`1px solid ${BD}`}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:10,color:MUT,marginBottom:2}}>{f.l}</div>
                    <input defaultValue={f.v} style={{...inp({border:"none",padding:0,background:"transparent",fontSize:13,fontWeight:600,color:TXT})}}/>
                  </div>
                  <div style={{width:20,height:20,borderRadius:"50%",
                    background:f.conf?SUCB:WRNB,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {f.conf?<span style={{color:SUC,display:"flex"}}>{I.check}</span>:<span style={{color:WRN,fontSize:10}}>?</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Suggested classification */}
            <div style={{marginTop:16,padding:14,background:INFB,borderRadius:8,border:`1px solid ${INF}20`}}>
              <div style={{fontSize:11,fontWeight:700,color:INF,marginBottom:6}}>{fr?"Classification suggérée":"Suggested classification"}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:11}}>
                <div><span style={{color:MUT}}>Service : </span><span style={{fontWeight:600}}>Comptabilité</span></div>
                <div><span style={{color:MUT}}>Confid. : </span><span style={{fontWeight:600}}>Interne</span></div>
                <div><span style={{color:MUT}}>Emplacement : </span><span style={{fontWeight:600}}>Local Comptabilité</span></div>
                <div><span style={{color:MUT}}>Contenant : </span><span style={{fontWeight:600}}>CNT-007</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ═══════════ TAB: JOURNAL ═══════════ */
  const renderJournal=()=>(
    <div>
      <div style={{display:"flex",gap:10,marginBottom:16,alignItems:"center",flexWrap:"wrap"}}>
        <h3 style={{fontSize:14,fontWeight:700,color:TXT,margin:0,flex:1}}>{fr?"Journal des opérations":"Operations log"}</h3>
        <span style={badge(PLR,P)}>{journal.length} {fr?"entrées":"entries"}</span>
      </div>
      <div style={{...card(),overflow:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead>
            <tr style={{background:"#f8fafc"}}>
              {["Date",fr?"Appareil":"Device",fr?"Utilisateur":"User","Action",fr?"Détail":"Detail",fr?"Statut":"Status"].map(h=>(
                <th key={h} style={{padding:"10px 12px",textAlign:"left",fontWeight:700,fontSize:10,color:MUT,textTransform:"uppercase",borderBottom:`2px solid ${BD}`,whiteSpace:"nowrap"}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {journal.map((j,i)=>{
              const ls=LOG_STATUS[j.statut];
              return(
                <tr key={i} style={{borderBottom:`1px solid ${BD}`}}
                  onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{padding:"10px 12px",fontSize:11,color:MUT,whiteSpace:"nowrap"}}>{fmtShort(j.date)}</td>
                  <td style={{padding:"10px 12px",fontWeight:600,color:TXT,whiteSpace:"nowrap"}}>{j.appareil}</td>
                  <td style={{padding:"10px 12px",color:SEC}}>{j.user}</td>
                  <td style={{padding:"10px 12px"}}><span style={badge(ls.bg,ls.color)}>{j.action}</span></td>
                  <td style={{padding:"10px 12px",fontSize:11,color:SEC,maxWidth:300}}>{j.detail}</td>
                  <td style={{padding:"10px 12px"}}><div style={{width:8,height:8,borderRadius:"50%",background:ls.color}}/></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  /* ═══════════ TAB: PARAMÈTRES ═══════════ */
  const renderParams=()=>(
    <div>
      <h3 style={{fontSize:14,fontWeight:700,color:TXT,margin:"0 0 16px"}}>{fr?"Paramètres MFP":"MFP Settings"}</h3>
      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:16}}>
        {/* General */}
        <div style={{...card(),padding:20}}>
          <h4 style={{fontSize:13,fontWeight:700,color:TXT,margin:"0 0 14px",display:"flex",alignItems:"center",gap:6}}>
            <span style={{display:"flex",color:P}}>{I.cog}</span> {fr?"Général":"General"}
          </h4>
          {[
            {l:fr?"Intervalle de ping (heartbeat)":"Ping interval (heartbeat)",v:"5 min",type:"select",opts:["1 min","2 min","5 min","10 min","30 min"]},
            {l:fr?"Dossier de réception scan":"Scan reception folder",v:"/softlibrary/scans/inbox",type:"text"},
            {l:fr?"Format scan par défaut":"Default scan format",v:"PDF/A",type:"select",opts:["PDF","PDF/A","TIFF","JPEG"]},
            {l:fr?"Résolution par défaut":"Default resolution",v:"600 dpi",type:"select",opts:["300 dpi","600 dpi","1200 dpi"]},
            {l:fr?"OCR automatique":"Automatic OCR",v:true,type:"toggle"},
            {l:fr?"Recto-verso par défaut":"Default duplex",v:true,type:"toggle"},
          ].map((p,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${BD}`}}>
              <span style={{fontSize:12,color:SEC}}>{p.l}</span>
              {p.type==="toggle"?(
                <div style={{width:40,height:22,borderRadius:11,background:p.v?SUC:"#d1d5db",cursor:"pointer",position:"relative",transition:"background .2s"}}>
                  <div style={{width:18,height:18,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:p.v?20:2,transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.2)"}}/>
                </div>
              ):p.type==="select"?(
                <select defaultValue={p.v} style={{padding:"4px 8px",borderRadius:6,border:`1px solid ${BD}`,fontSize:12,fontFamily:FF}}>
                  {p.opts.map(o=><option key={o} value={o}>{o}</option>)}
                </select>
              ):(
                <input defaultValue={p.v} style={{...inp({width:"auto",maxWidth:200,padding:"4px 8px",fontSize:12})}}/>
              )}
            </div>
          ))}
        </div>

        {/* Protocoles */}
        <div style={{...card(),padding:20}}>
          <h4 style={{fontSize:13,fontWeight:700,color:TXT,margin:"0 0 14px",display:"flex",alignItems:"center",gap:6}}>
            <span style={{display:"flex",color:P}}>{I.link}</span> {fr?"Protocoles & Sécurité":"Protocols & Security"}
          </h4>
          {[
            {proto:"Scan to API",port:"443",ssl:true,desc:fr?"Envoi REST direct vers SoftLibrary":"Direct REST push to SoftLibrary"},
            {proto:"WebDAV",port:"443",ssl:true,desc:fr?"Dépôt dans répertoire WebDAV partagé":"Deposit in shared WebDAV folder"},
            {proto:"SMB",port:"445",ssl:false,desc:fr?"Partage réseau Windows (CIFS)":"Windows network share (CIFS)"},
            {proto:"FTP",port:"21",ssl:false,desc:fr?"Transfert fichier (déconseillé en clair)":"File transfer (unencrypted not recommended)"},
            {proto:"REST API",port:"443",ssl:true,desc:fr?"API REST bidirectionnelle":"Bidirectional REST API"},
          ].map((p,i)=>(
            <div key={i} style={{padding:10,background:"#f8fafc",borderRadius:8,marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                <span style={{fontSize:12,fontWeight:700,color:TXT}}>{p.proto}</span>
                <div style={{display:"flex",gap:6}}>
                  <span style={badge(p.ssl?SUCB:WRNB,p.ssl?SUC:WRN,{fontSize:9})}>{p.ssl?"SSL/TLS":"Non chiffré"}</span>
                  <span style={badge("#f1f5f9",MUT,{fontSize:9})}>Port {p.port}</span>
                </div>
              </div>
              <div style={{fontSize:10,color:MUT}}>{p.desc}</div>
            </div>
          ))}

          <div style={{marginTop:16}}>
            <h4 style={{fontSize:12,fontWeight:700,color:TXT,marginBottom:8}}>{fr?"Compatibilité constructeurs":"Manufacturer compatibility"}</h4>
            <div style={{display:"flex",gap:10}}>
              {["Canon","Xerox","Ricoh"].map(m=>(
                <div key={m} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",borderRadius:8,border:`1px solid ${BD}`,background:"#fff"}}>
                  {MARQUE_LOGOS[m]}
                  <div>
                    <div style={{fontSize:12,fontWeight:700,color:TXT}}>{m}</div>
                    <div style={{fontSize:9,color:SUC}}>✓ {fr?"Compatible":"Compatible"}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /* ═══════════ RENDER ═══════════ */
  const renderContent=()=>{
    switch(tab){
      case"dashboard":return renderDashboard();
      case"appareils":return renderAppareils();
      case"associations":return renderAssociations();
      case"scans":return renderScans();
      case"journal":return renderJournal();
      case"params":return renderParams();
      default:return renderDashboard();
    }
  };

  return(
    <div style={{fontFamily:FF}}>
      {/* Page header */}
      <div style={{marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
          <div style={{width:36,height:36,borderRadius:9,background:`linear-gradient(135deg,${P},${PL})`,
            display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}>{I.printer}</div>
          <div>
            <h1 style={{fontSize:18,fontWeight:800,color:TXT,margin:0}}>
              {fr?"Équipements Multifonctions":"Multi-Function Printers"}
            </h1>
            <p style={{fontSize:12,color:MUT,margin:0}}>
              {fr?"Connexion, numérisation et indexation automatique":"Connection, scanning & automatic indexing"}
            </p>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{display:"flex",gap:2,marginBottom:20,overflowX:"auto",paddingBottom:2,borderBottom:`1px solid ${BD}`}}>
        {TABS.map(tb=>{
          const active=tab===tb.id;
          return(
            <button key={tb.id} onClick={()=>{setTab(tb.id);setSelectedDevice(null);setSelectedScan(null);}}
              style={{display:"flex",alignItems:"center",gap:6,padding:isMobile?"10px 12px":"10px 18px",
                border:"none",background:"none",cursor:"pointer",fontSize:12,fontWeight:active?700:500,
                color:active?P:MUT,borderBottom:active?`2px solid ${P}`:"2px solid transparent",
                transition:"all .15s",fontFamily:FF,whiteSpace:"nowrap",flexShrink:0}}>
              <span style={{display:"flex"}}>{tb.icon}</span>
              {!isMobile&&tb.label}
              {tb.id==="scans"&&scansAValider>0&&(
                <span style={{width:18,height:18,borderRadius:"50%",background:WRN,color:"#fff",
                  fontSize:10,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>{scansAValider}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{animation:"modalIn .15s ease"}} key={tab}>
        {renderContent()}
      </div>

      {/* Add device modal */}
      {showAddDevice&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:5000,padding:20}}
          onClick={()=>setShowAddDevice(false)}>
          <div style={{background:"#fff",borderRadius:14,width:"100%",maxWidth:520,padding:28,boxShadow:"0 20px 60px rgba(0,0,0,.25)",animation:"modalIn .2s ease"}}
            onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <h3 style={{fontSize:16,fontWeight:700,color:TXT,margin:0}}>{fr?"Ajouter un MFP":"Add MFP"}</h3>
              <button onClick={()=>setShowAddDevice(false)} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:MUT}}>×</button>
            </div>

            <div style={{display:"grid",gap:12}}>
              <div>
                <label style={{fontSize:11,fontWeight:600,color:SEC,display:"block",marginBottom:4}}>{fr?"Nom de l'appareil":"Device name"} *</label>
                <input placeholder="Canon iR-ADV C5560i III" style={inp()}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div>
                  <label style={{fontSize:11,fontWeight:600,color:SEC,display:"block",marginBottom:4}}>{fr?"Adresse IP":"IP Address"} *</label>
                  <input placeholder="192.168.1.50" style={inp()}/>
                </div>
                <div>
                  <label style={{fontSize:11,fontWeight:600,color:SEC,display:"block",marginBottom:4}}>DNS</label>
                  <input placeholder="canon-dg.softwell.local" style={inp()}/>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div>
                  <label style={{fontSize:11,fontWeight:600,color:SEC,display:"block",marginBottom:4}}>{fr?"Marque":"Brand"} *</label>
                  <select style={{...inp(),padding:"9px 8px"}}>
                    <option>Canon</option><option>Xerox</option><option>Ricoh</option><option>{fr?"Autre":"Other"}</option>
                  </select>
                </div>
                <div>
                  <label style={{fontSize:11,fontWeight:600,color:SEC,display:"block",marginBottom:4}}>{fr?"Protocole":"Protocol"} *</label>
                  <select style={{...inp(),padding:"9px 8px"}}>
                    <option>Scan to API</option><option>WebDAV</option><option>SMB</option><option>FTP</option><option>REST API</option>
                  </select>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div>
                  <label style={{fontSize:11,fontWeight:600,color:SEC,display:"block",marginBottom:4}}>{fr?"Site":"Site"} *</label>
                  <select style={{...inp(),padding:"9px 8px"}}>
                    <option>Siège Analakely</option><option>Site Ankorondrano</option><option>Agence Tamatave</option>
                  </select>
                </div>
                <div>
                  <label style={{fontSize:11,fontWeight:600,color:SEC,display:"block",marginBottom:4}}>Port</label>
                  <input placeholder="443" defaultValue="443" style={inp()}/>
                </div>
              </div>
              <div>
                <label style={{fontSize:11,fontWeight:600,color:SEC,display:"block",marginBottom:4}}>{fr?"Mode d'authentification":"Auth mode"}</label>
                <select style={{...inp(),padding:"9px 8px"}}>
                  <option>LDAP</option><option>PIN</option><option>Carte NFC</option><option>LDAP + Badge</option><option>Login/MdP</option>
                </select>
              </div>
            </div>

            <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:20}}>
              <button onClick={()=>setShowAddDevice(false)} style={btnSm("#f1f5f9",SEC)}>{fr?"Annuler":"Cancel"}</button>
              <button style={btnSm(P)}>
                <span style={{display:"flex"}}>{I.plus}</span> {fr?"Tester & ajouter":"Test & add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
