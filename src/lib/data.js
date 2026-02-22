"use client";
/* ═══════════════════════════════════════════════
   SOFTDOCS — Static / Initial Data
═══════════════════════════════════════════════ */

/* DOC_MENUS : icon est maintenant une clé IC.xxx (string) */
export const DOC_MENUS = [
  {id:"recus-f", label:"Reçus fournisseurs",     iconKey:"inbox",    ctx:"fournisseur",stFilter:["REÇU"]},
  {id:"courrier",label:"Service Courriers",       iconKey:"mail",     ctx:"fournisseur",stFilter:["REÇU","EN VALIDATION"]},
  {id:"confids", label:"Documents Confidentiels", iconKey:"lockKey",  conf:true},
  {id:"recu",    label:"Reçu",                   iconKey:"mailOpen", stFilter:["REÇU"]},
  {id:"en-cours",label:"En cours",               iconKey:"clock",    stFilter:["EN VALIDATION","EN RETARD"]},
  {id:"refuses", label:"Refusés",                iconKey:"xCircle",  stFilter:["REJETÉ"]},
  {id:"archives",label:"Archivés",               iconKey:"archive",  stFilter:["ARCHIVÉ"]},
  {id:"envoyes", label:"Envoyés",                iconKey:"send",     stFilter:["VALIDÉ","BON À PAYER","PAYÉ","CLÔTURÉ"]},
  {id:"communs", label:"Documents Communs",      iconKey:"folder",   noConf:true},
  {id:"c-enc",   label:"Confid. En cours",       iconKey:"lockKey",  conf:true,stFilter:["EN VALIDATION","EN RETARD"]},
  {id:"c-ref",   label:"Confid. Refusés",        iconKey:"lockKey",  conf:true,stFilter:["REJETÉ"]},
  {id:"c-arc",   label:"Confid. Archivés",       iconKey:"lockKey",  conf:true,stFilter:["ARCHIVÉ"]},
  {id:"r-com",   label:"Refusés Communs",        iconKey:"xCircle",  noConf:true,stFilter:["REJETÉ"]},
  {id:"c-com",   label:"Confid. Communs",        iconKey:"shield",   conf:true},
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
  {id:"U001",nom:"Rakoto Jean-Baptiste",init:"RJ",role:"Chef de Projet",site:"Antananarivo",actif:true,
   droits:{validMulti:true,saisieOCR:true,docCommun:true,docConf:false,docEnCours:true,avance:false,liquidation:false},
   projets:[{pid:"PRJ-001",sites:["Antananarivo","Fianarantsoa"]},{pid:"PRJ-004",sites:["Fianarantsoa"]}]},
  {id:"U002",nom:"Randria Marie-Claire",init:"RM",role:"Resp. Financier",site:"Antananarivo",actif:true,
   droits:{validMulti:true,saisieOCR:true,docCommun:true,docConf:true,docEnCours:true,avance:true,liquidation:true},
   projets:PROJETS.map(p=>({pid:p.id,sites:p.sites}))},
  {id:"U003",nom:"Razafy Pierre",init:"RP",role:"DAF",site:"Antananarivo",actif:true,
   droits:{validMulti:true,saisieOCR:true,docCommun:true,docConf:true,docEnCours:true,avance:true,liquidation:true},
   projets:PROJETS.map(p=>({pid:p.id,sites:p.sites}))},
  {id:"U004",nom:"Rasoamanarivo Hanta",init:"RH",role:"Comptable Senior",site:"Toliara",actif:true,
   droits:{validMulti:false,saisieOCR:true,docCommun:true,docConf:false,docEnCours:true,avance:false,liquidation:true},
   projets:[{pid:"PRJ-002",sites:["Toliara"]},{pid:"PRJ-004",sites:["Toliara"]}]},
  {id:"U005",nom:"Andriamananjara Lova",init:"AL",role:"Ordonnateur",site:"Antananarivo",actif:true,
   droits:{validMulti:true,saisieOCR:false,docCommun:true,docConf:true,docEnCours:true,avance:true,liquidation:true},
   projets:PROJETS.map(p=>({pid:p.id,sites:p.sites.slice(0,1)}))},
  {id:"U006",nom:"Ratsimbazafy Noro",init:"RN",role:"Gestionnaire Docs",site:"Mahajanga",actif:true,
   droits:{validMulti:false,saisieOCR:true,docCommun:true,docConf:false,docEnCours:false,avance:false,liquidation:false},
   projets:[{pid:"PRJ-003",sites:["Mahajanga"]}]},
];

export const INIT_TYPES=[
  {id:"DT001",nom:"Facture",         typeKey:"facture",  conf:false,etapes:[
    {label:"Réception & Contrôle",v:["U004","U006"]},
    {label:"Validation Technique",v:["U001"]},
    {label:"Validation Financière",v:["U002","U004"]},
    {label:"Approbation DAF",v:["U003"]}]},
  {id:"DT002",nom:"Bon de livraison",typeKey:"truck",    conf:false,etapes:[
    {label:"Réception & Contrôle",v:["U004"]},
    {label:"Validation Logistique",v:["U001","U006"]},
    {label:"Validation Financière",v:["U002"]}]},
  {id:"DT003",nom:"Contrat",         typeKey:"clipboard",conf:true,etapes:[
    {label:"Réception & Contrôle",v:["U002"]},
    {label:"Validation Juridique",v:["U003"]},
    {label:"Approbation Ordonnateur",v:["U005"]}]},
  {id:"DT004",nom:"Rapport",         typeKey:"barChart", conf:false,etapes:[
    {label:"Réception & Contrôle",v:["U006"]},
    {label:"Validation Technique",v:["U001","U003"]}]},
];

export const INIT_SCHEMAS=[
  {id:"SCH-001",nom:"BOA Madagascar – SEPA XML",banque:"Bank of Africa",format:"pain.001.001.03",version:"v3.2",statut:"Actif",charset:"UTF-8",natureRemise:"Paiement facture fournisseur",endpoint:"https://api.boa.mg/payments"},
  {id:"SCH-002",nom:"BNI Madagascar – MT101",   banque:"BNI Madagascar",format:"SWIFT MT101",    version:"v1.0",statut:"Actif",charset:"UTF-8",natureRemise:"Paiement contrat marchés",    endpoint:""},
];

export const INIT_RECV={fournisseurs:["U004","U006"],confidentiels:["U002","U003"],internes:["U001","U006"]};

export const INIT_LIQ=[
  {id:"LIQ-001",docRef:"DOC-2025-001",fourn:"JIRAMA",mt:48750000,type:"Paiement facture",st:"PAYÉ",date:"2025-01-22",banque:"BOA Madagascar",notes:"Facture énergie janvier"},
];

export const INIT_DOCS=[
  {id:"DOC-2025-001",type:"Facture",tid:"DT001",cat:"fournisseur",fourn:"JIRAMA",fid:"F001",proj:"PRJ-001",site:"Antananarivo",mt:48750000,mtR:48750000,date:"2025-01-15",st:"BON À PAYER",conf:false,ocr:94,motif:"",exped:"Fournisseur",notes:"",bap:true,cloture:false,AR:true,affP:true,linked:false,refus:null,
   ch:{numero:"FAC-2025-0147",date_doc:"15/01/2025",ht:"40625000",tva:"8125000",total:"48750000",nif:"100 234 567",iban:"MG480001000123456789012",emetteur:"JIRAMA",score:94},
   anx:[{nom:"BON_CMD.pdf",type:"Bon de commande",oblig:true,ok:true}],
   etapes:[{label:"Réception & Contrôle",v:["U004","U006"],statut:"VALIDÉ",date:"15/01/2025 10:15",comment:"Conforme",validBy:"U004"},{label:"Validation Technique",v:["U001"],statut:"VALIDÉ",date:"16/01/2025 09:00",comment:"Travaux conformes",validBy:"U001"},{label:"Validation Financière",v:["U002","U004"],statut:"VALIDÉ",date:"17/01/2025 11:30",comment:"Imputation OK",validBy:"U002"},{label:"Approbation DAF",v:["U003"],statut:"VALIDÉ",date:"18/01/2025 14:00",comment:"Approuvé",validBy:"U003"}]},
  {id:"DOC-2025-002",type:"Bon de livraison",tid:"DT002",cat:"fournisseur",fourn:"HOLCIM Madagascar",fid:"F003",proj:"PRJ-003",site:"Mahajanga",mt:125000000,mtR:125000000,date:"2025-01-18",st:"EN VALIDATION",conf:false,ocr:87,motif:"",exped:"Fournisseur",notes:"",bap:false,cloture:false,AR:true,affP:true,linked:false,refus:null,
   ch:{numero:"BL-2025-0089",date_doc:"18/01/2025",ht:"104166667",tva:"20833333",total:"125000000",nif:"100 654 321",iban:"MG480003000311223344556",emetteur:"HOLCIM Madagascar",score:87},
   anx:[{nom:"BON_CMD_002.pdf",type:"Bon de commande",oblig:true,ok:true}],
   etapes:[{label:"Réception & Contrôle",v:["U004"],statut:"VALIDÉ",date:"18/01/2025 09:00",comment:"OK",validBy:"U004"},{label:"Validation Logistique",v:["U001","U006"],statut:"EN ATTENTE",date:"",comment:"",validBy:""},{label:"Validation Financière",v:["U002"],statut:"EN ATTENTE",date:"",comment:"",validBy:""}]},
  {id:"DOC-2025-003",type:"Contrat",tid:"DT003",cat:"confidentiel",fourn:"KRAOMITA MALAGASY",fid:"F002",proj:"PRJ-002",site:"Toliara",mt:890000000,mtR:890000000,date:"2025-01-10",st:"EN VALIDATION",conf:true,ocr:91,motif:"",exped:"Fournisseur",notes:"",bap:false,cloture:false,AR:true,affP:true,linked:false,refus:null,
   ch:{numero:"CTR-2025-0012",date_doc:"10/01/2025",ht:"741666667",tva:"148333333",total:"890000000",nif:"100 876 543",iban:"MG480002000298765432109",emetteur:"KRAOMITA MALAGASY",score:91},
   anx:[{nom:"CDC.pdf",type:"Cahier des charges",oblig:true,ok:true}],
   etapes:[{label:"Réception & Contrôle",v:["U002"],statut:"VALIDÉ",date:"10/01/2025 10:00",comment:"",validBy:"U002"},{label:"Validation Juridique",v:["U003"],statut:"EN ATTENTE",date:"",comment:"",validBy:""},{label:"Approbation Ordonnateur",v:["U005"],statut:"EN ATTENTE",date:"",comment:"",validBy:""}]},
  {id:"DOC-2025-004",type:"Facture",tid:"DT001",cat:"fournisseur",fourn:"SME Construction",fid:"F005",proj:"PRJ-001",site:"Fianarantsoa",mt:62400000,mtR:62400000,date:"2025-01-20",st:"EN RETARD",conf:false,ocr:72,motif:"",exped:"Fournisseur",notes:"",bap:false,cloture:false,AR:true,affP:true,linked:false,refus:null,
   ch:{numero:"FAC-SME-0334",date_doc:"20/01/2025",ht:"52000000",tva:"10400000",total:"62400000",nif:"100 998 877",iban:"MG480005000533445566778",emetteur:"SME Construction",score:72},anx:[],
   etapes:[{label:"Réception & Contrôle",v:["U004","U006"],statut:"VALIDÉ",date:"20/01/2025 11:00",comment:"OCR 72%",validBy:"U006"},{label:"Validation Technique",v:["U001"],statut:"EN RETARD",date:"",comment:"Délai +3j",validBy:""},{label:"Validation Financière",v:["U002","U004"],statut:"EN ATTENTE",date:"",comment:"",validBy:""},{label:"Approbation DAF",v:["U003"],statut:"EN ATTENTE",date:"",comment:"",validBy:""}]},
  {id:"DOC-2025-005",type:"Facture",tid:"DT001",cat:"fournisseur",fourn:"TELMA SA",fid:"F004",proj:"",site:"Antananarivo",mt:33600000,mtR:33600000,date:"2025-01-22",st:"REÇU",conf:false,ocr:96,motif:"",exped:"Fournisseur",notes:"",bap:false,cloture:false,AR:false,affP:false,linked:false,refus:null,
   ch:{numero:"FAC-TELMA-0891",date_doc:"22/01/2025",ht:"28000000",tva:"5600000",total:"33600000",nif:"100 112 233",iban:"MG480004000477889900112",emetteur:"TELMA SA",score:96},anx:[],
   etapes:[{label:"Réception & Contrôle",v:["U004","U006"],statut:"EN ATTENTE",date:"",comment:"",validBy:""},{label:"Validation Technique",v:["U001"],statut:"EN ATTENTE",date:"",comment:"",validBy:""},{label:"Validation Financière",v:["U002","U004"],statut:"EN ATTENTE",date:"",comment:"",validBy:""},{label:"Approbation DAF",v:["U003"],statut:"EN ATTENTE",date:"",comment:"",validBy:""}]},
  {id:"DOC-2025-006",type:"Rapport",tid:"DT004",cat:"interne",fourn:"",fid:"",proj:"PRJ-004",site:"Fianarantsoa",mt:0,mtR:0,date:"2025-01-08",st:"REJETÉ",conf:false,ocr:55,motif:"Rapport incomplet – Section 3 manquante",exped:"Interne",notes:"",bap:false,cloture:false,AR:true,affP:true,linked:false,
   refus:{etape:"Validation Technique",date:"09/01/2025 14:00",cause:"Document incomplet",comment:"Section 3 manquante"},
   ch:{numero:"RPT-2025-0056",date_doc:"08/01/2025",ht:"0",tva:"0",total:"0",nif:"",iban:"",emetteur:"Service Technique PADAP",score:55},anx:[],
   etapes:[{label:"Réception & Contrôle",v:["U006"],statut:"VALIDÉ",date:"08/01/2025 09:00",comment:"Reçu",validBy:"U006"},{label:"Validation Technique",v:["U001","U003"],statut:"REJETÉ",date:"09/01/2025 14:00",comment:"Section 3 manquante",validBy:"U001"}]},
  {id:"DOC-2025-007",type:"Contrat",tid:"DT003",cat:"confidentiel",fourn:"JIRAMA",fid:"F001",proj:"PRJ-001",site:"Antananarivo",mt:580000000,mtR:580000000,date:"2025-01-12",st:"ARCHIVÉ",conf:true,ocr:93,motif:"",exped:"Fournisseur",notes:"",bap:false,cloture:false,AR:true,affP:true,linked:true,refus:null,
   ch:{numero:"CTR-2025-0009",date_doc:"12/01/2025",ht:"483333333",tva:"96666667",total:"580000000",nif:"100 234 567",iban:"MG480001000123456789012",emetteur:"JIRAMA",score:93},
   anx:[{nom:"OFFRE_TECH.pdf",type:"Offre technique",oblig:true,ok:true}],
   etapes:[{label:"Réception & Contrôle",v:["U002"],statut:"VALIDÉ",date:"12/01/2025 09:00",comment:"",validBy:"U002"},{label:"Validation Juridique",v:["U003"],statut:"VALIDÉ",date:"13/01/2025 11:00",comment:"Conforme",validBy:"U003"},{label:"Approbation Ordonnateur",v:["U005"],statut:"VALIDÉ",date:"14/01/2025 15:00",comment:"Approuvé",validBy:"U005"}]},
];

export const filterDocsByMenu=(docs,menuId)=>{
  const m=DOC_MENUS.find(x=>x.id===menuId);
  if(!m)return docs;
  let res=docs;
  if(m.conf)     res=res.filter(d=>d.conf);
  if(m.noConf)   res=res.filter(d=>!d.conf);
  if(m.ctx)      res=res.filter(d=>d.cat===m.ctx||d.exped===(m.ctx.charAt(0).toUpperCase()+m.ctx.slice(1)));
  if(m.stFilter) res=res.filter(d=>m.stFilter.includes(d.st));
  return res;
};
