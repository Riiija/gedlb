"use client";
/* ═══════════════════════════════════════════════════════════════
   SOFTDOCS — Static / Initial Data
═══════════════════════════════════════════════════════════════ */

export const DOC_MENUS = [
  /* ── Les 3 buckets d'origine ── */
  {id:"recus-f", label:"Reçus fournisseurs",     iconKey:"inbox",    originFilter:"portail-fournisseur"},
  {id:"courrier",label:"Service Courriers",       iconKey:"mail",     originFilter:"backoffice", noConf:true},
  {id:"confids", label:"Documents Confidentiels", iconKey:"lockKey",  conf:true},
  /* ── Vues transversales par statut (tous non-conf) ── */
  {id:"recu",    label:"Reçu",                   iconKey:"mailOpen", stFilter:["REÇU"],    noSpecial:true},
  {id:"envoyes", label:"Envoyés",                iconKey:"send",     stFilter:["VALIDÉ","BON À PAYER","PAYÉ","CLÔTURÉ"], noSpecial:true},
  {id:"en-cours",label:"En Cours",               iconKey:"clock",    stFilter:["EN VALIDATION","EN RETARD"], noSpecial:true},
  {id:"refuses", label:"Refusés",                iconKey:"xCircle",  stFilter:["REJETÉ"],  noSpecial:true},
  {id:"archives",label:"Archivés",               iconKey:"archive",  stFilter:["ARCHIVÉ"], noSpecial:true},
  {id:"communs", label:"Documents Communs",      iconKey:"folder",   noConf:true},
  /* ── Vues confidentielles ── */
  {id:"c-enc",   label:"Confidentiels en Cours", iconKey:"lockKey",  conf:true, stFilter:["EN VALIDATION","EN RETARD"]},
  {id:"c-ref",   label:"Confidentiels Refusés",  iconKey:"lockKey",  conf:true, stFilter:["REJETÉ"]},
  {id:"c-arc",   label:"Confidentiels Archivés", iconKey:"lockKey",  conf:true, stFilter:["ARCHIVÉ"]},
  {id:"r-com",   label:"Documents Refusés Communs", iconKey:"xCircle", noConf:true, stFilter:["REJETÉ"]},
  {id:"c-com",   label:"Documents Confidentiels Communs", iconKey:"lockKey", conf:true},
];

export const PROJETS = [
  {id:"PRJ-001",nom:"PREA – Réhabilitation Écoles",  bailleur:"Banque Mondiale",budget:4500000000,sites:["Antananarivo","Fianarantsoa","Toamasina"]},
  {id:"PRJ-002",nom:"GEZANI – Cyclones Victimes",     bailleur:"PNUD",           budget:1200000000,sites:["Toliara","Morondava"]},
  {id:"PRJ-003",nom:"PIVOT – Infrastructures Santé",  bailleur:"BAD",            budget:3800000000,sites:["Mahajanga","Antananarivo"]},
  {id:"PRJ-004",nom:"PADAP – Agriculture Durable",    bailleur:"FIDA",           budget:2100000000,sites:["Fianarantsoa","Toliara","Antananarivo"]},
];

export const ALL_SITES=["Antananarivo","Fianarantsoa","Toamasina","Toliara","Morondava","Mahajanga"];

export const FOURNISSEURS=[
  {id:"F001",nom:"JIRAMA",            nif:"100 234 567",iban:"MG480001000123456789012",ville:"Antananarivo"},
  {id:"F002",nom:"KRAOMITA MALAGASY", nif:"100 876 543",iban:"MG480002000298765432109",ville:"Toamasina"},
  {id:"F003",nom:"HOLCIM Madagascar", nif:"100 654 321",iban:"MG480003000311223344556",ville:"Mahajanga"},
  {id:"F004",nom:"TELMA SA",          nif:"100 112 233",iban:"MG480004000477889900112",ville:"Antananarivo"},
  {id:"F005",nom:"SME Construction",  nif:"100 998 877",iban:"MG480005000533445566778",ville:"Fianarantsoa"},
];

export const XML_NATURES=["Paiement facture fournisseur","Avance de démarrage","Remboursement frais","Paiement contrat marchés","Avance sur commande","Paiement prestation services","Paiement solde contrat"];

export const DROITS_DEF=[
  {k:"validMulti",  l:"Validation multiple étapes", d:"Peut valider plusieurs étapes du circuit"},
  {k:"saisieOCR",   l:"Correction montant OCR",     d:"Peut corriger le montant réel après OCR"},
  {k:"docCommun",   l:"Documents communs",           d:"Accès aux documents partagés entre services"},
  {k:"docConf",     l:"Documents confidentiels",     d:"Accès aux documents classifiés confidentiel"},
  {k:"docEnCours",  l:"Docs en cours d'autres",      d:"Voir les documents en cours traités par d'autres"},
  {k:"avance",      l:"Saisie avances",              d:"Créer et valider des avances financières"},
  {k:"liquidation", l:"Saisie liquidations",         d:"Créer et finaliser des liquidations"},
];

export const INIT_USERS=[
  {id:"U001",nom:"Rakoto Jean-Baptiste",init:"RJ",role:"Chef de Projet",site:"Antananarivo",email:"rakoto@softdocs.mg",actif:true,
   droits:{validMulti:true,saisieOCR:true,docCommun:true,docConf:false,docEnCours:true,avance:false,liquidation:false},
   projets:[{pid:"PRJ-001",sites:["Antananarivo","Fianarantsoa"]},{pid:"PRJ-004",sites:["Fianarantsoa"]}]},
  {id:"U002",nom:"Randria Marie-Claire",init:"RM",role:"Resp. Financier",site:"Antananarivo",email:"randria@softdocs.mg",actif:true,
   droits:{validMulti:true,saisieOCR:true,docCommun:true,docConf:true,docEnCours:true,avance:true,liquidation:true},
   projets:PROJETS.map(p=>({pid:p.id,sites:p.sites}))},
  {id:"U003",nom:"Razafy Pierre",init:"RP",role:"DAF",site:"Antananarivo",email:"razafy@softdocs.mg",actif:true,
   droits:{validMulti:true,saisieOCR:true,docCommun:true,docConf:true,docEnCours:true,avance:true,liquidation:true},
   projets:PROJETS.map(p=>({pid:p.id,sites:p.sites}))},
  {id:"U004",nom:"Rasoamanarivo Hanta",init:"RH",role:"Comptable Senior",site:"Toliara",email:"hanta@softdocs.mg",actif:true,
   droits:{validMulti:false,saisieOCR:true,docCommun:true,docConf:false,docEnCours:true,avance:false,liquidation:true},
   projets:[{pid:"PRJ-002",sites:["Toliara"]},{pid:"PRJ-004",sites:["Toliara"]}]},
  {id:"U005",nom:"Andriamananjara Lova",init:"AL",role:"Ordonnateur",site:"Antananarivo",email:"lova@softdocs.mg",actif:true,
   droits:{validMulti:true,saisieOCR:false,docCommun:true,docConf:true,docEnCours:true,avance:true,liquidation:true},
   projets:PROJETS.map(p=>({pid:p.id,sites:p.sites.slice(0,1)}))},
  {id:"U006",nom:"Ratsimbazafy Noro",init:"RN",role:"Gestionnaire Docs",site:"Mahajanga",email:"noro@softdocs.mg",actif:true,
   droits:{validMulti:false,saisieOCR:true,docCommun:true,docConf:false,docEnCours:false,avance:false,liquidation:false},
   projets:[{pid:"PRJ-003",sites:["Mahajanga"]}]},
];

/* INIT_TYPES — sans icone, avec durée et checklists par étape */
export const INIT_TYPES=[
  {id:"DT001",nom:"Facture",conf:false,
   projets:["PRJ-001","PRJ-002","PRJ-003","PRJ-004"],sites:ALL_SITES,
   etapes:[
    {label:"Réception & Contrôle",duree:24,v:["U004","U006"],checklists:[{code:"01",label:"Vérification montant"},{code:"02",label:"Conformité NIF"}]},
    {label:"Validation Technique",duree:48,v:["U001"],checklists:[{code:"01",label:"Contrôle technique"}]},
    {label:"Validation Financière",duree:24,v:["U002","U004"],checklists:[{code:"01",label:"Imputation budgétaire"},{code:"02",label:"Visa comptable"}]},
    {label:"Approbation DAF",duree:20,v:["U003"],checklists:[{code:"01",label:"Approbation finale"}]}]},
  {id:"DT002",nom:"Bon de livraison",conf:false,
   projets:["PRJ-001","PRJ-003"],sites:["Antananarivo","Mahajanga","Toamasina"],
   etapes:[
    {label:"Réception & Contrôle",duree:8,v:["U004"],checklists:[{code:"01",label:"Quantités conformes"}]},
    {label:"Validation Logistique",duree:20,v:["U001","U006"],checklists:[]},
    {label:"Validation Financière",duree:16,v:["U002"],checklists:[{code:"01",label:"Imputation budgétaire"}]}]},
  {id:"DT003",nom:"Contrat",conf:true,
   projets:["PRJ-002","PRJ-004"],sites:ALL_SITES,
   etapes:[
    {label:"Réception & Contrôle",duree:24,v:["U002"],checklists:[{code:"01",label:"Pièces complètes"}]},
    {label:"Validation Juridique",duree:48,v:["U003"],checklists:[{code:"01",label:"Clauses conformes"},{code:"02",label:"Visa juridique"}]},
    {label:"Approbation Ordonnateur",duree:24,v:["U005"],checklists:[]}]},
  {id:"DT004",nom:"Rapport",conf:false,
   projets:["PRJ-004"],sites:["Fianarantsoa","Antananarivo"],
   etapes:[
    {label:"Réception & Contrôle",duree:8,v:["U006"],checklists:[]},
    {label:"Validation Technique",duree:24,v:["U001","U003"],checklists:[{code:"01",label:"Contenu complet"}]}]},
];

export const INIT_SCHEMAS=[
  {id:"SCH-001",nom:"BOA Madagascar – SEPA XML",banque:"Bank of Africa",format:"pain.001.001.03",version:"v3.2",statut:"Actif",charset:"UTF-8",natureRemise:"Paiement facture fournisseur",endpoint:"https://api.boa.mg/payments"},
  {id:"SCH-002",nom:"BNI Madagascar – MT101",   banque:"BNI Madagascar",format:"SWIFT MT101",    version:"v1.0",statut:"Actif",charset:"UTF-8",natureRemise:"Paiement contrat marchés",    endpoint:""},
];

export const INIT_RECV={fournisseurs:["U004","U006"],confidentiels:["U002","U003"],internes:["U001","U006"]};

export const INIT_LIQ=[
  {id:"LIQ-001",
   site:"Antananarivo",date:"2025-01-22",numero:"LIQ-2025-001",marche:"MRC-001",description:"Facture énergie JIRAMA janvier",
   numFacture:"FAC-2025-0147",dateFacture:"2025-01-15",dateFait:"2025-01-20",
   devise:"MGA",cours:1,coursRapportUSD:4500,
   st:"PAYÉ",syncTompro:true,dateSync:"2025-01-23",
   imputations:[
     {id:"IMP-001",libelle:"Fournitures énergie",compte:"60100",compteAux:"",compteFourn:"F001",auxFourn:"JIRAMA",
      mtMGA:48750000,mtUSD:10833,mtDevise:48750000,activite:"ACT-001",financement:"FIN-001",categorie:"CAT-A",
      pcop:"PCOP-01",geo:"Antananarivo",plan6:"",plan7:"",plan8:""}
   ],
   piecesJustif:["FACTURE_JIRAMA.pdf","BON_COMMANDE.pdf"],
   docRef:"DOC-2025-001",fourn:"JIRAMA",mt:48750000,datePay:"22/01/2025 14:00",banque:"BOA Madagascar"},
];

/* Champs dynamiques globaux initiaux */
export const INIT_CHAMPS_DYN = [
  {id:"CD001",etiquette:"Référence marché",visInternes:true,visFourn:false,requis:false,type:"texte",items:[]},
  {id:"CD002",etiquette:"Devise",visInternes:true,visFourn:false,requis:false,type:"liste",items:["MGA","USD","EUR","GBP"]},
  {id:"CD003",etiquette:"Pièce jointe complémentaire",visInternes:true,visFourn:true,requis:false,type:"fichier",items:[]},
];

export const filterDocsByMenu=(docs,menuId)=>{
  const m=DOC_MENUS.find(x=>x.id===menuId);
  if(!m)return docs;
  let res=docs;
  if(m.conf)         res=res.filter(d=>d.conf);         // confid menus: only conf docs
  if(m.noConf)       res=res.filter(d=>!d.conf);        // exclude conf docs
  if(m.noSpecial)    res=res.filter(d=>!d.conf);        // transversal menus: exclude conf
  if(m.originFilter) res=res.filter(d=>(d.origin||"backoffice")===m.originFilter);
  if(m.stFilter)     res=res.filter(d=>m.stFilter.includes(d.st));
  return res;
};

/* Routing logique de depot */
export const getDocMenu=(doc)=>{
  if(doc.conf) return "confids";
  if((doc.origin||"backoffice")==="portail-fournisseur") return "recus-f";
  return "courrier";
};

export const INIT_DOCS = [
  {id:"DOC-2025-001",type:"Facture",tid:"DT001",cat:"fournisseur",fourn:"JIRAMA",fid:"F001",proj:"PRJ-001",site:"Antananarivo",mt:48750000,mtR:48750000,date:"22/01/2025",st:"PAYÉ",conf:false,ocr:92,motif:"",exped:"Fournisseur",origin:"portail-fournisseur",notes:"Facture énergie janvier",bap:true,cloture:false,AR:true,affP:true,linked:false,refus:null,
   ch:{numero:"FAC-2025-0147",date_doc:"15/01/2025",ht:"40625000",tva:"8125000",total:"48750000",nif:"100 234 567",iban:"MG480001000123456789012",emetteur:"JIRAMA",score:92},
   anx:[{nom:"BC_2025_001.pdf",type:"Bon de commande",ok:true}],
   etapes:[
    {label:"Réception & Contrôle",duree:24,v:["U004","U006"],statut:"VALIDÉ",date:"22/01/2025",comment:"Reçu et contrôlé",validBy:"U004",checklists:[{code:"01",label:"Vérification montant",checked:true},{code:"02",label:"Conformité NIF",checked:true}]},
    {label:"Validation Technique",duree:48,v:["U001"],statut:"VALIDÉ",date:"23/01/2025",comment:"OK technique",validBy:"U001",checklists:[{code:"01",label:"Contrôle technique",checked:true}]},
    {label:"Validation Financière",duree:24,v:["U002","U004"],statut:"VALIDÉ",date:"24/01/2025",comment:"Validé",validBy:"U002",checklists:[{code:"01",label:"Imputation budgétaire",checked:true},{code:"02",label:"Visa comptable",checked:true}]},
    {label:"Approbation DAF",duree:20,v:["U003"],statut:"VALIDÉ",date:"24/01/2025",comment:"Approuvé",validBy:"U003",checklists:[{code:"01",label:"Approbation finale",checked:true}]}]},
  {id:"DOC-2025-002",type:"Bon de livraison",tid:"DT002",cat:"fournisseur",fourn:"HOLCIM Madagascar",fid:"F003",proj:"PRJ-001",site:"Toamasina",mt:23100000,mtR:23100000,date:"20/01/2025",st:"EN VALIDATION",conf:false,ocr:87,motif:"",exped:"Fournisseur",origin:"portail-fournisseur",notes:"",bap:false,cloture:false,AR:false,affP:false,linked:false,refus:null,
   ch:{numero:"BL-2025-0088",date_doc:"19/01/2025",ht:"19250000",tva:"3850000",total:"23100000",nif:"100 654 321",iban:"MG480003000311223344556",emetteur:"HOLCIM Madagascar",score:87},
   anx:[],
   etapes:[
    {label:"Réception & Contrôle",duree:8,v:["U004"],statut:"VALIDÉ",date:"20/01/2025",comment:"Reçu",validBy:"U004",checklists:[{code:"01",label:"Quantités conformes",checked:true}]},
    {label:"Validation Logistique",duree:20,v:["U001","U006"],statut:"EN ATTENTE",date:"",comment:"",validBy:"",checklists:[]},
    {label:"Validation Financière",duree:16,v:["U002"],statut:"EN ATTENTE",date:"",comment:"",validBy:"",checklists:[{code:"01",label:"Imputation budgétaire",checked:false}]}]},
  {id:"DOC-2025-003",type:"Contrat",tid:"DT003",cat:"confidentiel",fourn:"SME Construction",fid:"F005",proj:"PRJ-002",site:"Toliara",mt:156000000,mtR:156000000,date:"18/01/2025",st:"EN VALIDATION",conf:true,ocr:94,motif:"",exped:"Interne",origin:"backoffice",notes:"Contrat travaux Toliara",bap:false,cloture:false,AR:false,affP:false,linked:false,refus:null,
   ch:{numero:"CTR-2025-0012",date_doc:"15/01/2025",ht:"130000000",tva:"26000000",total:"156000000",nif:"100 998 877",iban:"MG480005000533445566778",emetteur:"SME Construction",score:94},
   anx:[{nom:"ANNEXE_TECHNIQUE.pdf",type:"Annexe technique",ok:true}],
   etapes:[
    {label:"Réception & Contrôle",duree:24,v:["U002"],statut:"VALIDÉ",date:"18/01/2025",comment:"Dossier complet",validBy:"U002",checklists:[{code:"01",label:"Pièces complètes",checked:true}]},
    {label:"Validation Juridique",duree:48,v:["U003"],statut:"EN RETARD",date:"",comment:"",validBy:"",checklists:[{code:"01",label:"Clauses conformes",checked:false},{code:"02",label:"Visa juridique",checked:false}]},
    {label:"Approbation Ordonnateur",duree:24,v:["U005"],statut:"EN ATTENTE",date:"",comment:"",validBy:"",checklists:[]}]},
  {id:"DOC-2025-004",type:"Facture",tid:"DT001",cat:"fournisseur",fourn:"TELMA SA",fid:"F004",proj:"PRJ-003",site:"Mahajanga",mt:12850000,mtR:12850000,date:"15/01/2025",st:"REÇU",conf:false,ocr:78,motif:"",exped:"Fournisseur",origin:"portail-fournisseur",notes:"",bap:false,cloture:false,AR:false,affP:false,linked:false,refus:null,
   ch:{numero:"FAC-2025-0215",date_doc:"12/01/2025",ht:"10708333",tva:"2141667",total:"12850000",nif:"100 112 233",iban:"MG480004000477889900112",emetteur:"TELMA SA",score:78},
   anx:[],
   etapes:[
    {label:"Réception & Contrôle",duree:24,v:["U004","U006"],statut:"EN ATTENTE",date:"",comment:"",validBy:"",checklists:[{code:"01",label:"Vérification montant",checked:false},{code:"02",label:"Conformité NIF",checked:false}]},
    {label:"Validation Technique",duree:48,v:["U001"],statut:"EN ATTENTE",date:"",comment:"",validBy:"",checklists:[]},
    {label:"Validation Financière",duree:24,v:["U002","U004"],statut:"EN ATTENTE",date:"",comment:"",validBy:"",checklists:[]},
    {label:"Approbation DAF",duree:20,v:["U003"],statut:"EN ATTENTE",date:"",comment:"",validBy:"",checklists:[]}]},
  {id:"DOC-2025-005",type:"Rapport",tid:"DT004",cat:"fournisseur",fourn:"KRAOMITA MALAGASY",fid:"F002",proj:"PRJ-004",site:"Fianarantsoa",mt:5500000,mtR:5500000,date:"10/01/2025",st:"REJETÉ",conf:false,ocr:65,motif:"Rapport incomplet — manque sections 3 et 4",exped:"Fournisseur",origin:"portail-fournisseur",notes:"",bap:false,cloture:false,AR:false,affP:false,linked:false,refus:"Rapport incomplet",
   ch:{numero:"RPT-2025-0031",date_doc:"08/01/2025",ht:"4583333",tva:"916667",total:"5500000",nif:"100 876 543",iban:"MG480002000298765432109",emetteur:"KRAOMITA MALAGASY",score:65},
   anx:[],
   etapes:[
    {label:"Réception & Contrôle",duree:8,v:["U006"],statut:"VALIDÉ",date:"10/01/2025",comment:"Reçu",validBy:"U006",checklists:[]},
    {label:"Validation Technique",duree:24,v:["U001","U003"],statut:"REJETÉ",date:"13/01/2025",comment:"Rapport incomplet",validBy:"U001",checklists:[{code:"01",label:"Contenu complet",checked:false}]}]},
  {id:"DOC-2025-006",type:"Facture",tid:"DT001",cat:"fournisseur",fourn:"JIRAMA",fid:"F001",proj:"PRJ-002",site:"Morondava",mt:7200000,mtR:7200000,date:"08/01/2025",st:"BON À PAYER",conf:false,ocr:96,motif:"",exped:"Fournisseur",origin:"portail-fournisseur",notes:"",bap:true,cloture:false,AR:true,affP:true,linked:false,refus:null,
   ch:{numero:"FAC-2025-0089",date_doc:"05/01/2025",ht:"6000000",tva:"1200000",total:"7200000",nif:"100 234 567",iban:"MG480001000123456789012",emetteur:"JIRAMA",score:96},
   anx:[{nom:"BDL_JAN.pdf",type:"Bon de livraison",ok:true},{nom:"PV_RECEPTION.pdf",type:"PV Réception",ok:true}],
   etapes:[
    {label:"Réception & Contrôle",duree:24,v:["U004","U006"],statut:"VALIDÉ",date:"08/01/2025",comment:"OK",validBy:"U004",checklists:[{code:"01",label:"Vérification montant",checked:true},{code:"02",label:"Conformité NIF",checked:true}]},
    {label:"Validation Technique",duree:48,v:["U001"],statut:"VALIDÉ",date:"09/01/2025",comment:"OK",validBy:"U001",checklists:[]},
    {label:"Validation Financière",duree:24,v:["U002","U004"],statut:"VALIDÉ",date:"10/01/2025",comment:"Approuvé",validBy:"U002",checklists:[]},
    {label:"Approbation DAF",duree:20,v:["U003"],statut:"VALIDÉ",date:"11/01/2025",comment:"BAP accordé",validBy:"U003",checklists:[]}]},
];
