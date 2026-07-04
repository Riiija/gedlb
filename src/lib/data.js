"use client";
/* ═══════════════════════════════════════════════════════════════
   SOFTAPPLICATION — Données centralisées
   SoftDocs + SoftPaiement + SoftLibrary
═══════════════════════════════════════════════════════════════ */

export const DOC_MENUS = [
  {id:"recus-f", label:"Reçus fournisseurs",      iconKey:"inbox"},
  {id:"courrier",label:"Service Courriers",        iconKey:"mail"},
  {id:"confids", label:"Documents Confidentiels",  iconKey:"lockKey"},
  {id:"recu",    label:"Reçu",     iconKey:"mailOpen"},
  {id:"envoyes", label:"Envoyés",  iconKey:"send"},
  {id:"archives",label:"Archivés", iconKey:"archive"},
  {id:"en-cours",label:"En Cours",           iconKey:"clock",   noConf:true},
  {id:"refuses", label:"Refusés",            iconKey:"xCircle", noConf:true},
  {id:"communs", label:"Documents Communs",  iconKey:"folder",  noConf:true},
  {id:"c-enc",   label:"Confidentiels en Cours",        iconKey:"lockKey", conf:true},
  {id:"c-ref",   label:"Confidentiels Refusés",         iconKey:"lockKey", conf:true},
  {id:"c-arc",   label:"Confidentiels Archivés",        iconKey:"lockKey", conf:true},
  {id:"c-com",   label:"Confidentiels Communs",         iconKey:"lockKey", conf:true},
  {id:"r-com",   label:"Documents Refusés Communs",     iconKey:"xCircle", noConf:true},
];

export const INIT_PROJETS=[
  {id:"PRJ-001",nom:"PREA – Réhabilitation Écoles",  bailleur:"Banque Mondiale",budget:4500000000,sites:["Antananarivo","Fianarantsoa","Toamasina"],actif:true,dateDebut:"01/01/2024",dateFin:"31/12/2026"},
  {id:"PRJ-002",nom:"GEZANI – Cyclones Victimes",     bailleur:"PNUD",           budget:1200000000,sites:["Toliara","Morondava"],actif:true,dateDebut:"01/03/2024",dateFin:"28/02/2026"},
  {id:"PRJ-003",nom:"PIVOT – Infrastructures Santé",  bailleur:"BAD",            budget:3800000000,sites:["Mahajanga","Antananarivo"],actif:true,dateDebut:"01/06/2023",dateFin:"31/05/2027"},
  {id:"PRJ-004",nom:"PADAP – Agriculture Durable",    bailleur:"FIDA",           budget:2100000000,sites:["Fianarantsoa","Toliara","Antananarivo"],actif:true,dateDebut:"01/09/2022",dateFin:"31/08/2025"},
];
export const PROJETS=INIT_PROJETS;

export const ALL_SITES=["Antananarivo","Fianarantsoa","Toamasina","Toliara","Morondava","Mahajanga"];

export const FOURNISSEURS=[
  {id:"F001",nom:"JIRAMA",            nif:"100 234 567",iban:"MG480001000123456789012",ville:"Antananarivo"},
  {id:"F002",nom:"KRAOMITA MALAGASY", nif:"100 876 543",iban:"MG480002000298765432109",ville:"Toamasina"},
  {id:"F003",nom:"HOLCIM Madagascar", nif:"100 654 321",iban:"MG480003000311223344556",ville:"Mahajanga"},
  {id:"F004",nom:"TELMA SA",          nif:"100 112 233",iban:"MG480004000477889900112",ville:"Antananarivo"},
  {id:"F005",nom:"SME Construction",  nif:"100 998 877",iban:"MG480005000533445566778",ville:"Fianarantsoa"},
];

export const INIT_FOURNISSEURS_COMPTES=[
  {id:"FC001",raisonSociale:"JIRAMA",nomContact:"Rabe Martin",email:"rabe@jirama.mg",telephone:"034 12 345 67",
   adresse1:"101 Rue Philibert Tsiranana",adresse2:"",ville:"Antananarivo",pays:"Madagascar",
   nif:"100 234 567",stat:"123456789",rc:"2001 B 00123",niu:"NIU-001-JIRAMA",
   banque:"BNI Madagascar",domiciliation:"Agence Analakely",codeBanque:"00001",codeGuichet:"01001",
   numCompte:"12345678901",cle:"23",swift:"BNMGMGMG",iban:"MG480001000123456789012",
   banque2:"",domiciliation2:"",codeBanque2:"",codeGuichet2:"",numCompte2:"",cle2:"",swift2:"",iban2:"",
   echeance:30,jourEcheance:1,specialites:"Énergie / Eau",nBad:"BAD-001",nAgrement:"AGR-2024-001",
   dateAgrement:"2025-12-31",actif:true,dateCreation:"15/01/2025",nbDocs:5},
  {id:"FC002",raisonSociale:"HOLCIM Madagascar",nomContact:"Rakoto Hery",email:"hery@holcim.mg",telephone:"033 98 765 43",
   adresse1:"Zone Industrielle Ankorondrano",adresse2:"",ville:"Mahajanga",pays:"Madagascar",
   nif:"100 654 321",stat:"987654321",rc:"2005 B 00456",niu:"NIU-002-HOLCIM",
   banque:"BOA Madagascar",domiciliation:"Agence Mahajanga",codeBanque:"00005",codeGuichet:"02001",
   numCompte:"98765432101",cle:"11",swift:"BOAGMGMG",iban:"MG480003000311223344556",
   banque2:"",domiciliation2:"",codeBanque2:"",codeGuichet2:"",numCompte2:"",cle2:"",swift2:"",iban2:"",
   echeance:45,jourEcheance:15,specialites:"BTP / Construction",nBad:"",nAgrement:"AGR-2024-002",
   dateAgrement:"2026-06-30",actif:true,dateCreation:"20/01/2025",nbDocs:3},
];

export const INIT_CAUSES_REFUS=[
  {id:"CR001",label:"Facture non conforme"},
  {id:"CR002",label:"Pièce manquante"},
  {id:"CR003",label:"Erreur de destination"},
  {id:"CR004",label:"Double soumission"},
  {id:"CR005",label:"Erreur de montant"},
  {id:"CR006",label:"Document illisible"},
  {id:"CR007",label:"Délai dépassé"},
  {id:"CR008",label:"Signature manquante"},
];

export const XML_NATURES=["Paiement facture fournisseur","Avance de démarrage","Remboursement frais","Paiement contrat marchés","Avance sur commande","Paiement prestation services","Paiement solde contrat"];

export const SERVICES_LIST = ["Comptabilité","Juridique","Achats","Logistique","Direction","Administration","RH","Gouvernance","IT","Communication"];

/* ═══════════════════════════════════════════════════════════════
   DROITS — Centralisés tous modules
═══════════════════════════════════════════════════════════════ */
export const DROITS_DEF=[
  /* ── SoftDocs ── */
  {k:"validMulti",  l:"Validation multiple étapes", d:"Peut valider plusieurs étapes du circuit", module:"softdocs"},
  {k:"saisieOCR",   l:"Correction montant OCR",     d:"Peut corriger le montant réel après OCR", module:"softdocs"},
  {k:"modifMontant",l:"Modifier montant réel",      d:"Peut modifier manuellement le montant réel à payer", module:"softdocs"},
  {k:"docCommun",   l:"Documents communs",           d:"Accès aux documents partagés entre services", module:"softdocs"},
  {k:"docConf",     l:"Documents confidentiels",     d:"Accès aux documents classifiés confidentiel", module:"softdocs"},
  {k:"docEnCours",  l:"Docs en cours d'autres",      d:"Voir les documents en cours traités par d'autres", module:"softdocs"},
  {k:"avance",      l:"Saisie avances",              d:"Créer et valider des avances financières", module:"softdocs"},
  {k:"liquidation", l:"Saisie liquidations",         d:"Créer et finaliser des liquidations", module:"softdocs"},
  {k:"relance",     l:"Relance traitement en retard",d:"Peut envoyer des relances par mail pour documents en retard", module:"softdocs"},
  /* ── SoftLibrary ── */
  {k:"lib_admin",       l:"Admin Library",           d:"Configuration référentiel, types, accès", module:"softlibrary"},
  {k:"lib_enregistrer", l:"Enregistrement documents",d:"Enregistrer de nouveaux documents physiques", module:"softlibrary"},
  {k:"lib_consulter",   l:"Consultation fiches",     d:"Consulter les fiches descriptives", module:"softlibrary"},
  {k:"lib_rechercher",  l:"Recherche avancée",       d:"Effectuer des recherches multicritères", module:"softlibrary"},
  {k:"lib_audit",       l:"Journal d'audit",         d:"Consulter le journal d'activités", module:"softlibrary"},
  /* ── SoftPaiement ── */
  {k:"pay_saisie",   l:"Saisie paiements",    d:"Créer des ordres de paiement", module:"softpaiement"},
  {k:"pay_valid",    l:"Validation paiements", d:"Valider les ordres de paiement", module:"softpaiement"},
  {k:"pay_exec",     l:"Exécution paiements",  d:"Exécuter les virements bancaires", module:"softpaiement"},
  {k:"pay_consult",  l:"Consultation paiements",d:"Consulter l'historique des paiements", module:"softpaiement"},
];

/* ═══════════════════════════════════════════════════════════════
   UTILISATEURS — Droits centralisés tous modules
═══════════════════════════════════════════════════════════════ */
export const INIT_USERS=[
  {id:"U001",nom:"Rakoto Jean-Baptiste",init:"RJ",role:"Chef de Projet",site:"Antananarivo",email:"rakoto@softdocs.mg",actif:true,
   droits:{
     /* SoftDocs */
     validMulti:true,saisieOCR:true,docCommun:true,docConf:false,docEnCours:true,avance:false,liquidation:false,relance:true,
     /* SoftLibrary */
     lib_admin:false,lib_enregistrer:false,lib_consulter:true,lib_rechercher:true,lib_audit:false,
     /* SoftPaiement */
     pay_saisie:false,pay_valid:false,pay_exec:false,pay_consult:true,
   },
   projets:[{pid:"PRJ-001",sites:["Antananarivo","Fianarantsoa"]},{pid:"PRJ-004",sites:["Fianarantsoa"]}]},
  {id:"U002",nom:"Randria Marie-Claire",init:"RM",role:"Resp. Financier",site:"Antananarivo",email:"randria@softdocs.mg",actif:true,
   droits:{
     validMulti:true,saisieOCR:true,modifMontant:true,docCommun:true,docConf:true,docEnCours:true,avance:true,liquidation:true,relance:true,
     lib_admin:false,lib_enregistrer:true,lib_consulter:true,lib_rechercher:true,lib_audit:true,
     pay_saisie:true,pay_valid:true,pay_exec:false,pay_consult:true,
   },
   projets:PROJETS.map(p=>({pid:p.id,sites:p.sites}))},
  {id:"U003",nom:"Razafy Pierre",init:"RP",role:"DAF",site:"Antananarivo",email:"razafy@softdocs.mg",actif:true,
   droits:{
     validMulti:true,saisieOCR:true,modifMontant:true,docCommun:true,docConf:true,docEnCours:true,avance:true,liquidation:true,relance:true,
     lib_admin:true,lib_enregistrer:true,lib_consulter:true,lib_rechercher:true,lib_audit:true,
     pay_saisie:true,pay_valid:true,pay_exec:true,pay_consult:true,
   },
   projets:PROJETS.map(p=>({pid:p.id,sites:p.sites}))},
  {id:"U004",nom:"Rasoamanarivo Hanta",init:"RH",role:"Comptable Senior",site:"Toliara",email:"hanta@softdocs.mg",actif:true,
   droits:{
     validMulti:false,saisieOCR:true,docCommun:true,docConf:false,docEnCours:true,avance:false,liquidation:true,relance:true,
     lib_admin:false,lib_enregistrer:true,lib_consulter:true,lib_rechercher:true,lib_audit:false,
     pay_saisie:true,pay_valid:false,pay_exec:false,pay_consult:true,
   },
   projets:[{pid:"PRJ-002",sites:["Toliara"]},{pid:"PRJ-004",sites:["Toliara"]}]},
  {id:"U005",nom:"Andriamananjara Lova",init:"AL",role:"Ordonnateur",site:"Antananarivo",email:"lova@softdocs.mg",actif:true,
   droits:{
     validMulti:true,saisieOCR:false,docCommun:true,docConf:true,docEnCours:true,avance:true,liquidation:true,relance:true,
     lib_admin:true,lib_enregistrer:true,lib_consulter:true,lib_rechercher:true,lib_audit:true,
     pay_saisie:false,pay_valid:true,pay_exec:true,pay_consult:true,
   },
   projets:PROJETS.map(p=>({pid:p.id,sites:p.sites.slice(0,1)}))},
  {id:"U006",nom:"Ratsimbazafy Noro",init:"RN",role:"Gestionnaire Docs",site:"Mahajanga",email:"noro@softdocs.mg",actif:true,
   droits:{
     validMulti:false,saisieOCR:true,docCommun:true,docConf:false,docEnCours:false,avance:false,liquidation:false,relance:true,
     lib_admin:false,lib_enregistrer:true,lib_consulter:true,lib_rechercher:true,lib_audit:false,
     pay_saisie:false,pay_valid:false,pay_exec:false,pay_consult:false,
   },
   projets:[{pid:"PRJ-003",sites:["Mahajanga"]}]},
];

/* INIT_TYPES — SoftDocs */
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

export const INIT_CHAMPS_DYN = [
  {id:"CD001",etiquette:"Référence marché",visInternes:true,visFourn:false,requis:false,type:"texte",items:[]},
  {id:"CD002",etiquette:"Devise",visInternes:true,visFourn:false,requis:false,type:"liste",items:["MGA","USD","EUR","GBP"]},
  {id:"CD003",etiquette:"Pièce jointe complémentaire",visInternes:true,visFourn:true,requis:false,type:"fichier",items:[]},
];

/* ═══════════════════════════════════════════════════════════════
   SOFTDOCS — Filtrage documents par menu
═══════════════════════════════════════════════════════════════ */
function _activeStep(doc){
  return doc.etapes?.find(e=>e.statut==="EN ATTENTE"||e.statut==="EN RETARD")||null;
}
const TERMINAL_ST=new Set(["PAYÉ","BON À PAYER","CLÔTURÉ","ARCHIVÉ","VALIDÉ"]);
function _allStepsValidated(doc){
  if(TERMINAL_ST.has(doc.st)) return true;
  if(!doc.etapes||doc.etapes.length===0)return false;
  return doc.etapes.every(e=>e.statut==="VALIDÉ");
}

export function canUserSeeDocInMenu(doc, menuId, userId, recv){
  if(!doc||!menuId)return false;
  if(!userId)return true;
  const origin=doc.origin||"backoffice";const isConf=!!doc.conf;const st=doc.st||"";
  const step=_activeStep(doc);const allV=doc.etapes?.flatMap(e=>e.vActifs||e.v||[])||[];
  const allDone=_allStepsValidated(doc);
  const isRF=!!recv?.fournisseurs?.includes(userId);const isRC=!!recv?.confidentiels?.includes(userId);
  const isRI=!!recv?.internes?.includes(userId);
  const isActV=step?(step.vActifs||step.v||[]).includes(userId):false;
  const isDep=doc.deposePar===userId;const isParticipant=allV.includes(userId)||isDep;
  const iHaveValidated=doc.etapes?.some(e=>e.validBy===userId&&e.statut==="VALIDÉ")||false;

  if(menuId==="recus-f"){const p=doc.AR===true&&!!doc.tid;return origin==="portail-fournisseur"&&!isConf&&st==="REÇU"&&!p;}
  if(menuId==="courrier"){const p=doc.AR===true&&!!doc.tid;return origin==="backoffice"&&!isConf&&st==="REÇU"&&!p;}
  if(menuId==="confids"){const p=doc.AR===true&&!!doc.tid;return isConf&&st==="REÇU"&&!p;}
  if(menuId==="recu"){const hasAR=doc.AR===true;const hasTid=!!doc.tid;if(st==="REÇU"){if(!hasAR||!hasTid)return false;if(isConf)return isRC;if(origin==="portail-fournisseur")return isRF;return isRI;}return isActV;}
  if(menuId==="envoyes")return isDep;
  if(menuId==="archives")return allDone&&!isConf&&iHaveValidated;
  if(menuId==="en-cours"){if(isConf)return false;if(st!=="EN VALIDATION"&&st!=="EN RETARD")return false;return isParticipant||isActV||isRF||isRI;}
  if(menuId==="refuses"){if(isConf)return false;if(st!=="REJETÉ")return false;if((doc.etapes||[]).some(e=>e.statut==="REDIRIGÉ"))return false;return isParticipant||isActV||isRF||isRI;}
  if(menuId==="communs")return !isConf&&allDone&&isParticipant;
  if(menuId==="c-enc"){if(!isConf)return false;if(st!=="EN VALIDATION"&&st!=="EN RETARD")return false;return isParticipant||isActV||isRC;}
  if(menuId==="c-ref"){if(!isConf)return false;if(st!=="REJETÉ")return false;return isParticipant||isActV||isRC;}
  if(menuId==="c-arc")return isConf&&allDone&&iHaveValidated;
  if(menuId==="c-com")return isConf&&allDone&&isParticipant;
  if(menuId==="r-com")return !isConf&&st==="REJETÉ"&&isParticipant;
  return false;
}
export const filterDocsByMenu=(docs,menuId,userId=null,recv=null)=>docs.filter(d=>canUserSeeDocInMenu(d,menuId,userId,recv));
export const getDocMenu=(doc)=>{if(doc.conf)return "confids";if((doc.origin||"backoffice")==="portail-fournisseur")return "recus-f";return "courrier";};

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
   anx:[],etapes:[
    {label:"Réception & Contrôle",duree:8,v:["U004"],statut:"VALIDÉ",date:"20/01/2025",comment:"Reçu",validBy:"U004",checklists:[{code:"01",label:"Quantités conformes",checked:true}]},
    {label:"Validation Logistique",duree:20,v:["U001","U006"],statut:"EN ATTENTE",date:"",comment:"",validBy:"",checklists:[]},
    {label:"Validation Financière",duree:16,v:["U002"],statut:"EN ATTENTE",date:"",comment:"",validBy:"",checklists:[{code:"01",label:"Imputation budgétaire",checked:false}]}]},
  {id:"DOC-2025-003",type:"Contrat",tid:"DT003",cat:"confidentiel",fourn:"SME Construction",fid:"F005",proj:"PRJ-002",site:"Toliara",mt:156000000,mtR:156000000,date:"18/01/2025",st:"EN VALIDATION",conf:true,ocr:94,motif:"",exped:"Interne",origin:"backoffice",notes:"Contrat travaux Toliara",bap:false,cloture:false,AR:false,affP:false,linked:false,refus:null,
   ch:{numero:"CTR-2025-0012",date_doc:"15/01/2025",ht:"130000000",tva:"26000000",total:"156000000",nif:"100 998 877",iban:"MG480005000533445566778",emetteur:"SME Construction",score:94},
   anx:[{nom:"ANNEXE_TECHNIQUE.pdf",type:"Annexe technique",ok:true}],etapes:[
    {label:"Réception & Contrôle",duree:24,v:["U002"],statut:"VALIDÉ",date:"18/01/2025",comment:"Dossier complet",validBy:"U002",checklists:[{code:"01",label:"Pièces complètes",checked:true}]},
    {label:"Validation Juridique",duree:48,v:["U003"],statut:"EN RETARD",date:"",comment:"",validBy:"",checklists:[{code:"01",label:"Clauses conformes",checked:false},{code:"02",label:"Visa juridique",checked:false}]},
    {label:"Approbation Ordonnateur",duree:24,v:["U005"],statut:"EN ATTENTE",date:"",comment:"",validBy:"",checklists:[]}]},
];

export const INIT_PLAN_COMPTES = [
  {id:"PC001",code:"60100",libelle:"Achats de matières premières",categorie:"Achats"},
  {id:"PC002",code:"60200",libelle:"Achats de produits finis",categorie:"Achats"},
  {id:"PC003",code:"60300",libelle:"Achats de carburants",categorie:"Achats"},
  {id:"PC004",code:"60600",libelle:"Achats non stockés — fournitures",categorie:"Achats"},
  {id:"PC005",code:"61100",libelle:"Sous-traitance générale",categorie:"Services"},
  {id:"PC006",code:"61200",libelle:"Redevances crédit-bail",categorie:"Services"},
  {id:"PC007",code:"62100",libelle:"Personnel extérieur",categorie:"Personnel"},
  {id:"PC008",code:"62300",libelle:"Publicité et communication",categorie:"Services"},
  {id:"PC009",code:"62400",libelle:"Transports et déplacements",categorie:"Services"},
  {id:"PC010",code:"62600",libelle:"Frais postaux et télécommunications",categorie:"Services"},
  {id:"PC011",code:"62700",libelle:"Services bancaires",categorie:"Finances"},
  {id:"PC012",code:"63000",libelle:"Impôts et taxes",categorie:"Fiscalité"},
  {id:"PC013",code:"64100",libelle:"Salaires et traitements",categorie:"Personnel"},
  {id:"PC014",code:"64500",libelle:"Charges sociales patronales",categorie:"Personnel"},
  {id:"PC015",code:"65100",libelle:"Redevances pour concessions",categorie:"Charges"},
  {id:"PC016",code:"66100",libelle:"Intérêts des emprunts",categorie:"Finances"},
  {id:"PC017",code:"67000",libelle:"Charges exceptionnelles",categorie:"Exceptionnel"},
  {id:"PC018",code:"70100",libelle:"Ventes de produits finis",categorie:"Produits"},
  {id:"PC019",code:"70600",libelle:"Prestations de services",categorie:"Produits"},
  {id:"PC020",code:"74000",libelle:"Subventions d'exploitation",categorie:"Produits"},
];

export const INIT_MAIL_CONFIG = {
  host:"smtp.example.com",port:587,ssl:false,tls:true,
  email:"notifications@softdocs.mg",alias:"SoftDocs GED",
  auth:true,username:"notifications@softdocs.mg",password:"",testEmail:"",
};

/* ═══════════════════════════════════════════════════════════════
   SOFT LIBRARY — Données documentaires
═══════════════════════════════════════════════════════════════ */

export const LIB_DOC_TYPES = [
  {id:"LDT-001",nom:"Facture originale",code:"FAC",categorie:"Comptabilité",duaAns:10,archivageDefinitif:false,actif:true,description:"Facture originale papier",champsObligatoires:["montant","devise","reference"]},
  {id:"LDT-002",nom:"Contrat signé",code:"CTR",categorie:"Juridique",duaAns:30,archivageDefinitif:true,actif:true,description:"Contrat original signé",champsObligatoires:["reference","emetteur"]},
  {id:"LDT-003",nom:"Bon de commande",code:"BDC",categorie:"Achats",duaAns:5,archivageDefinitif:false,actif:true,description:"Bon de commande validé",champsObligatoires:["montant","reference"]},
  {id:"LDT-004",nom:"PV de réception",code:"PVR",categorie:"Logistique",duaAns:5,archivageDefinitif:false,actif:true,description:"Procès-verbal de réception",champsObligatoires:["reference"]},
  {id:"LDT-005",nom:"Rapport d'activité",code:"RAP",categorie:"Direction",duaAns:10,archivageDefinitif:true,actif:true,description:"Rapport d'activité périodique",champsObligatoires:[]},
  {id:"LDT-006",nom:"Correspondance officielle",code:"COR",categorie:"Administration",duaAns:5,archivageDefinitif:false,actif:true,description:"Courrier officiel",champsObligatoires:["emetteur"]},
  {id:"LDT-007",nom:"Délibération",code:"DEL",categorie:"Gouvernance",duaAns:999,archivageDefinitif:true,actif:true,description:"Délibération du CA",champsObligatoires:["reference"]},
  {id:"LDT-008",nom:"Note de service",code:"NDS",categorie:"Administration",duaAns:3,archivageDefinitif:false,actif:true,description:"Note interne",champsObligatoires:["emetteur"]},
  {id:"LDT-009",nom:"Titre foncier",code:"TFO",categorie:"Juridique",duaAns:999,archivageDefinitif:true,actif:false,description:"Titre de propriété",champsObligatoires:["reference"]},
  {id:"LDT-010",nom:"Bulletin de paie",code:"BDP",categorie:"RH",duaAns:50,archivageDefinitif:true,actif:true,description:"Bulletin de salaire",champsObligatoires:["montant","devise"]},
];

export const LIB_CATEGORIES = ["Comptabilité","Juridique","Achats","Logistique","Direction","Administration","Gouvernance","RH"];

export const CONFIDENTIALITES = [
  {id:"conf-public",label:"Public",niveau:0,color:"green"},
  {id:"conf-interne",label:"Interne",niveau:1,color:"blue"},
  {id:"conf-confidentiel",label:"Confidentiel",niveau:2,color:"orange"},
  {id:"conf-secret",label:"Secret",niveau:3,color:"red"},
];

export const STATUTS = [
  {id:"disponible",label:"Disponible",color:"success"},
  {id:"en_consultation",label:"En consultation",color:"info"},
  {id:"en_traitement",label:"En traitement",color:"warning"},
  {id:"prete",label:"Prêté",color:"orange"},
  {id:"archivage_inter",label:"Archivage intermédiaire",color:"gray"},
  {id:"archivage_def",label:"Archivage définitif",color:"primary"},
  {id:"elimine",label:"Éliminé",color:"danger"},
];

export const LIB_EMPLACEMENTS = [
  {id:"EMP-001",nom:"Archives Centrales",site:"Antananarivo",batiment:"Siège",salle:"A-101",capacite:1200,occupe:856},
  {id:"EMP-002",nom:"Archives Comptabilité",site:"Antananarivo",batiment:"Annexe B",salle:"B-201",capacite:800,occupe:612},
  {id:"EMP-003",nom:"Salle Sécurisée",site:"Antananarivo",batiment:"Siège",salle:"S-001",capacite:400,occupe:145},
  {id:"EMP-004",nom:"Archives Fianarantsoa",site:"Fianarantsoa",batiment:"Bureau Régional",salle:"R-101",capacite:600,occupe:310},
  {id:"EMP-005",nom:"Archives Toamasina",site:"Toamasina",batiment:"Bureau Régional",salle:"R-101",capacite:400,occupe:280},
  {id:"EMP-006",nom:"Dépôt Externalisé",site:"Antananarivo",batiment:"SECREN",salle:"LOT-12",capacite:2000,occupe:1760},
];

export const LIB_DOCUMENTS = [
  {id:"LIB-2024-00001",titre:"Facture JIRAMA - Électricité Jan 2024",typeId:"LDT-001",categorie:"Comptabilité",confidentialite:"conf-interne",reference:"FAC-JIR-2024-001",emetteur:"JIRAMA",dateDocument:"2024-01-15",dateReception:"2024-01-18",dateEnregistrement:"2024-01-19",montant:48750000,devise:"MGA",service:"Comptabilité",site:"Antananarivo",projet:"PRJ-001",emplacementId:"EMP-002",cote:"COMPT-FAC-2024-001",codeBarres:"LIB2400001",statut:"disponible",description:"Facture mensuelle électricité siège",motsCles:["jirama","électricité","énergie"],lienNumerique:"DOC-2025-001",creePar:"U006",modifiePar:"U002",version:1,historique:[{date:"2024-01-19T09:00:00",action:"Création",userId:"U006",details:"Enregistrement initial"}]},
  {id:"LIB-2024-00002",titre:"Contrat HOLCIM - Fourniture ciment",typeId:"LDT-002",categorie:"Juridique",confidentialite:"conf-confidentiel",reference:"CTR-HOL-2024-001",emetteur:"HOLCIM Madagascar",dateDocument:"2024-02-01",dateReception:"2024-02-05",dateEnregistrement:"2024-02-06",montant:350000000,devise:"MGA",service:"Achats",site:"Antananarivo",projet:"PRJ-001",emplacementId:"EMP-003",cote:"JURID-CTR-2024-001",codeBarres:"LIB2400002",statut:"archivage_def",description:"Contrat cadre fourniture ciment",motsCles:["holcim","ciment","contrat"],lienNumerique:null,creePar:"U002",modifiePar:"U003",version:2,historique:[{date:"2024-02-06T10:00:00",action:"Création",userId:"U002",details:"Enregistrement initial"}]},
  {id:"LIB-2024-00003",titre:"BC - Mobilier bureau Fianarantsoa",typeId:"LDT-003",categorie:"Achats",confidentialite:"conf-interne",reference:"BDC-MOB-2024-003",emetteur:"SME Construction",dateDocument:"2024-03-10",dateReception:"2024-03-12",dateEnregistrement:"2024-03-12",montant:18500000,devise:"MGA",service:"Logistique",site:"Fianarantsoa",projet:"PRJ-004",emplacementId:"EMP-004",cote:"ACHAT-BDC-2024-001",codeBarres:"LIB2400003",statut:"disponible",description:"Bon de commande mobilier scolaire",motsCles:["mobilier","fianarantsoa"],lienNumerique:null,creePar:"U004",modifiePar:null,version:1,historique:[{date:"2024-03-12T08:30:00",action:"Création",userId:"U004",details:"Enregistrement initial"}]},
  {id:"LIB-2025-00004",titre:"Rapport d'activité T1 2024",typeId:"LDT-005",categorie:"Direction",confidentialite:"conf-confidentiel",reference:"RAP-T1-2024",emetteur:"Direction Générale",dateDocument:"2024-04-30",dateReception:"2024-05-02",dateEnregistrement:"2024-05-03",montant:null,devise:null,service:"Direction",site:"Antananarivo",projet:null,emplacementId:"EMP-003",cote:"DIREC-RAP-2024-001",codeBarres:"LIB2400005",statut:"en_consultation",description:"Rapport trimestriel Q1 2024",motsCles:["rapport","T1","2024"],lienNumerique:null,creePar:"U003",modifiePar:null,version:1,historique:[{date:"2024-05-03T10:00:00",action:"Création",userId:"U003",details:"Enregistrement initial"}]},
  {id:"LIB-2025-00005",titre:"Délibération CA - Budget 2025",typeId:"LDT-007",categorie:"Gouvernance",confidentialite:"conf-secret",reference:"DEL-CA-2024-003",emetteur:"Conseil d'Administration",dateDocument:"2024-06-20",dateReception:"2024-06-21",dateEnregistrement:"2024-06-22",montant:null,devise:null,service:"Direction",site:"Antananarivo",projet:null,emplacementId:"EMP-003",cote:"GOUV-DEL-2024-001",codeBarres:"LIB2400007",statut:"archivage_def",description:"Approbation budget prévisionnel 2025",motsCles:["CA","budget","2025"],lienNumerique:null,creePar:"U003",modifiePar:null,version:1,historique:[{date:"2024-06-22T10:00:00",action:"Création",userId:"U003",details:"Enregistrement initial"}]},
  {id:"LIB-2025-00006",titre:"Facture TELMA - Télécoms Fév 2025",typeId:"LDT-001",categorie:"Comptabilité",confidentialite:"conf-interne",reference:"FAC-TEL-2025-002",emetteur:"TELMA SA",dateDocument:"2025-02-01",dateReception:"2025-02-03",dateEnregistrement:"2025-02-04",montant:12300000,devise:"MGA",service:"Comptabilité",site:"Antananarivo",projet:"PRJ-003",emplacementId:"EMP-002",cote:"COMPT-FAC-2025-001",codeBarres:"LIB2500009",statut:"en_traitement",description:"Facture mensuelle télécommunications",motsCles:["telma","télécom"],lienNumerique:null,creePar:"U004",modifiePar:null,version:1,historique:[{date:"2025-02-04T09:00:00",action:"Création",userId:"U004",details:"Enregistrement initial"}]},
  {id:"LIB-2025-00007",titre:"Contrat SME - Réhabilitation Toliara",typeId:"LDT-002",categorie:"Juridique",confidentialite:"conf-confidentiel",reference:"CTR-SME-2025-001",emetteur:"SME Construction",dateDocument:"2025-01-20",dateReception:"2025-01-25",dateEnregistrement:"2025-01-26",montant:890000000,devise:"MGA",service:"Achats",site:"Toliara",projet:"PRJ-002",emplacementId:"EMP-003",cote:"JURID-CTR-2025-001",codeBarres:"LIB2500010",statut:"disponible",description:"Contrat travaux réhabilitation école",motsCles:["SME","construction","toliara"],lienNumerique:null,creePar:"U002",modifiePar:null,version:1,historique:[{date:"2025-01-26T10:00:00",action:"Création",userId:"U002",details:"Enregistrement initial"}]},
  {id:"LIB-2025-00008",titre:"BC - Fournitures Mahajanga",typeId:"LDT-003",categorie:"Achats",confidentialite:"conf-public",reference:"BDC-FBM-2025-001",emetteur:"Fournisseur Local",dateDocument:"2025-02-10",dateReception:"2025-02-12",dateEnregistrement:"2025-02-13",montant:4200000,devise:"MGA",service:"Administration",site:"Mahajanga",projet:"PRJ-003",emplacementId:"EMP-001",cote:"ACHAT-BDC-2025-001",codeBarres:"LIB2500012",statut:"disponible",description:"Bon de commande fournitures bureau",motsCles:["fournitures","mahajanga"],lienNumerique:null,creePar:"U006",modifiePar:null,version:1,historique:[{date:"2025-02-13T08:00:00",action:"Création",userId:"U006",details:"Enregistrement initial"}]},
];

export const LIB_REGLES_ACCES = [
  {id:"RA-001",serviceOuRole:"DAF",description:"Accès complet tous niveaux",niveauMax:3,categories:["*"]},
  {id:"RA-002",serviceOuRole:"Ordonnateur",description:"Accès complet tous niveaux",niveauMax:3,categories:["*"]},
  {id:"RA-003",serviceOuRole:"Resp. Financier",description:"Accès confidentiel périmètre financier",niveauMax:2,categories:["Comptabilité","Achats","Direction","Administration"]},
  {id:"RA-004",serviceOuRole:"Comptable Senior",description:"Accès interne documents comptables",niveauMax:1,categories:["Comptabilité","Achats","Logistique"]},
  {id:"RA-005",serviceOuRole:"Chef de Projet",description:"Accès interne documents projet",niveauMax:1,categories:["Logistique","Achats","Administration"]},
  {id:"RA-006",serviceOuRole:"Gestionnaire Docs",description:"Consultation toutes catégories niveau interne",niveauMax:1,categories:["*"]},
];

export const LIB_CHAMPS_CONFIG = [
  {id:"ch-titre",champ:"titre",label:"Titre du document",type:"texte",obligatoire:true,modifiable:true},
  {id:"ch-typeId",champ:"typeId",label:"Type documentaire",type:"liste",obligatoire:true,modifiable:false},
  {id:"ch-reference",champ:"reference",label:"Référence externe",type:"texte",obligatoire:false,modifiable:true},
  {id:"ch-emetteur",champ:"emetteur",label:"Émetteur",type:"texte",obligatoire:false,modifiable:true},
  {id:"ch-dateDocument",champ:"dateDocument",label:"Date du document",type:"date",obligatoire:true,modifiable:true},
  {id:"ch-dateReception",champ:"dateReception",label:"Date de réception",type:"date",obligatoire:true,modifiable:false},
  {id:"ch-montant",champ:"montant",label:"Montant",type:"nombre",obligatoire:false,modifiable:true},
  {id:"ch-devise",champ:"devise",label:"Devise",type:"liste",obligatoire:false,modifiable:true},
  {id:"ch-service",champ:"service",label:"Service concerné",type:"liste",obligatoire:true,modifiable:true},
  {id:"ch-site",champ:"site",label:"Site",type:"liste",obligatoire:true,modifiable:true},
  {id:"ch-projet",champ:"projet",label:"Projet",type:"liste",obligatoire:false,modifiable:true},
  {id:"ch-emplacementId",champ:"emplacementId",label:"Emplacement physique",type:"liste",obligatoire:true,modifiable:true},
  {id:"ch-confidentialite",champ:"confidentialite",label:"Confidentialité",type:"liste",obligatoire:true,modifiable:true},
  {id:"ch-description",champ:"description",label:"Description",type:"texte_long",obligatoire:false,modifiable:true},
];

export const LIB_AUDIT_LOG = [
  {id:"AUD-001",date:"2024-01-19T09:00:00",userId:"U006",action:"Création",cible:"LIB-2024-00001",details:"Facture JIRAMA"},
  {id:"AUD-002",date:"2024-02-06T10:00:00",userId:"U002",action:"Création",cible:"LIB-2024-00002",details:"Contrat HOLCIM"},
  {id:"AUD-003",date:"2025-01-26T10:00:00",userId:"U002",action:"Création",cible:"LIB-2025-00007",details:"Contrat SME Toliara"},
  {id:"AUD-004",date:"2025-02-04T09:00:00",userId:"U004",action:"Création",cible:"LIB-2025-00006",details:"Facture TELMA"},
  {id:"AUD-005",date:"2025-02-13T08:00:00",userId:"U006",action:"Création",cible:"LIB-2025-00008",details:"BC fournitures Mahajanga"},
];

/* ═══════════════════════════════════════════════════════════════
   FONCTIONS HELPERS LIBRARY
═══════════════════════════════════════════════════════════════ */
export function generateLibDocId(documents){
  const y=new Date().getFullYear();
  const n=documents.filter(d=>d.id.includes(`LIB-${y}`)).length+1;
  return `LIB-${y}-${String(n).padStart(5,'0')}`;
}
export function generateCodeBarres(documents){
  const y=String(new Date().getFullYear()).slice(2);
  return `LIB${y}${String(documents.length+1).padStart(5,'0')}`;
}
export function generateCote(categorie,typeCode,documents){
  const m={"Comptabilité":"COMPT","Juridique":"JURID","Achats":"ACHAT","Logistique":"LOGIS","Direction":"DIREC","Administration":"ADMIN","Gouvernance":"GOUV","RH":"RH"};
  const y=new Date().getFullYear();const c=m[categorie]||"DIVERS";
  const n=documents.filter(d=>d.cote&&d.cote.startsWith(`${c}-${typeCode}-${y}`)).length+1;
  return `${c}-${typeCode}-${y}-${String(n).padStart(3,'0')}`;
}



