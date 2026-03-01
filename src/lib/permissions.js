"use client";
/**
 * SoftDocs — Système de droits & permissions
 * 
 * Chaque permission est une clé booléenne.
 * Un profil (rôle) regroupe un ensemble de permissions.
 */

/* ══════════════════════════════════════════════════════════
   DÉFINITION DES PERMISSIONS
══════════════════════════════════════════════════════════ */
export const PERMISSION_GROUPS = [
  {
    id: "general",
    label: "Général",
    color: "#324372",
    perms: [
      { key: "langFr",       label: "Langue française",          desc: "Utiliser l'interface en français" },
      { key: "langEn",       label: "Langue anglaise",           desc: "Utiliser l'interface en anglais" },
      { key: "dashboard",    label: "Tableau de bord",           desc: "Accès au tableau de bord principal" },
      { key: "notifications",label: "Notifications",             desc: "Voir les alertes et retards" },
    ],
  },
  {
    id: "depot",
    label: "Dépôt de documents",
    color: "#1ecad3",
    perms: [
      { key: "depot",        label: "Déposer un document",       desc: "Accès au formulaire de dépôt" },
      { key: "depotConf",    label: "Déposer confidentiel",      desc: "Peut marquer un document confidentiel" },
      { key: "ocr",          label: "Correction OCR",            desc: "Peut corriger les données extraites par OCR" },
      { key: "suivi",        label: "Suivi document",            desc: "Rechercher et suivre un document" },
    ],
  },
  {
    id: "documents",
    label: "Consultation documents",
    color: "#4a90d9",
    perms: [
      { key: "docRecusFourn",  label: "Reçus fournisseurs",       desc: "Voir les docs reçus via portail fournisseur" },
      { key: "docCourrier",    label: "Service Courriers",         desc: "Voir les documents internes (backoffice)" },
      { key: "docConfidential",label: "Documents Confidentiels",  desc: "Voir les documents confidentiels" },
      { key: "docRecu",        label: "Reçu",                     desc: "Voir les docs au statut Reçu" },
      { key: "docEnCours",     label: "En Cours",                 desc: "Voir les docs en validation" },
      { key: "docEnvoyes",     label: "Envoyés / Validés",        desc: "Voir les docs validés / payés" },
      { key: "docRefuses",     label: "Refusés",                  desc: "Voir les docs rejetés" },
      { key: "docArchives",    label: "Archivés",                 desc: "Voir les docs archivés" },
      { key: "docCommuns",     label: "Documents Communs",        desc: "Voir tous les documents communs" },
    ],
  },
  {
    id: "validation",
    label: "Validation",
    color: "#28a745",
    perms: [
      { key: "valider",      label: "Valider un document",       desc: "Approuver une étape de validation" },
      { key: "rejeter",      label: "Rejeter un document",       desc: "Refuser une étape de validation" },
      { key: "validMulti",   label: "Validation multiple",       desc: "Valider plusieurs docs en même temps" },
      { key: "receveurFourn",label: "Receveur fournisseurs",     desc: "Peut traiter les dossiers fournisseurs" },
    ],
  },
  {
    id: "financier",
    label: "Financier",
    color: "#f5a623",
    perms: [
      { key: "liquidation",  label: "Liquidations",              desc: "Accès à la gestion des liquidations" },
      { key: "paiements",    label: "Paiements XML",             desc: "Générer des fichiers XML de paiement" },
      { key: "avance",       label: "Avances de démarrage",      desc: "Saisir et valider les avances" },
      { key: "bap",          label: "Bon à Payer",               desc: "Émettre un bon à payer" },
    ],
  },
  {
    id: "reporting",
    label: "États & Rapports",
    color: "#9b59b6",
    perms: [
      { key: "etatR1",  label: "Rapport 1 — Par projet",         desc: "Dossiers traités par projet" },
      { key: "etatR2",  label: "Rapport 2 — Historique",        desc: "Historique complet des documents" },
      { key: "etatR3",  label: "Rapport 3 — En instance/val",   desc: "En instance par validateur" },
      { key: "etatR4",  label: "Rapport 4 — En instance/pers",  desc: "Dossiers en instance par personne" },
      { key: "etatR5",  label: "Rapport 5 — En instance/date",  desc: "Dossiers en instance par date" },
      { key: "etatR6",  label: "Rapport 6 — Délai moyen",       desc: "Délai moyen de traitement" },
      { key: "etatR7",  label: "Rapport 7 — Détail archivés",   desc: "Détail traitement dossiers archivés" },
      { key: "etatR8",  label: "Rapport 8 — Retards/val",       desc: "Dossiers en retard par validateur" },
      { key: "etatR9",  label: "Rapport 9 — Rejetés",           desc: "Nombre de dossiers rejetés" },
      { key: "etatR10", label: "Rapport 10 — Liste refusés",    desc: "Liste détaillée des refusés" },
      { key: "etatR11", label: "Rapport 11 — Productivité",     desc: "Documents validés par utilisateur" },
      { key: "statsKpi",label: "Stats & KPIs",                  desc: "Tableau de bord statistiques" },
      { key: "exportDoc",label: "Export PDF/Excel",             desc: "Exporter les tableaux en PDF ou Excel" },
    ],
  },
  {
    id: "parametrage",
    label: "Paramétrage",
    color: "#e03e3e",
    perms: [
      { key: "paramTypes",   label: "Types de documents",        desc: "Gérer les types et circuits de validation" },
      { key: "paramReceveurs",label: "Receveurs",               desc: "Gérer les receveurs de documents" },
      { key: "paramChamps",  label: "Champs dynamiques",        desc: "Gérer les champs globaux" },
      { key: "paramUsers",   label: "Gestion utilisateurs",     desc: "Créer / modifier les comptes" },
      { key: "paramPerms",   label: "Droits & Rôles",           desc: "Gérer les permissions des utilisateurs" },
    ],
  },
];

/* Toutes les clés de permission */
export const ALL_PERM_KEYS = PERMISSION_GROUPS.flatMap(g=>g.perms.map(p=>p.key));

/* ══════════════════════════════════════════════════════════
   PROFILS PRÉDÉFINIS
══════════════════════════════════════════════════════════ */
const all = (keys) => Object.fromEntries(keys.map(k=>[k,true]));
const none = (keys) => Object.fromEntries(keys.map(k=>[k,false]));

export const PROFILES = {
  /* Super admin — tout */
  daf: {
    label:"DAF / Admin", color:"#e03e3e",
    perms: all(ALL_PERM_KEYS),
  },
  /* Responsable financier */
  financier: {
    label:"Resp. Financier", color:"#f5a623",
    perms: {
      langFr:true,langEn:true,dashboard:true,notifications:true,
      depot:true,depotConf:true,ocr:true,suivi:true,
      docRecusFourn:true,docCourrier:true,docConfidential:true,
      docRecu:true,docEnCours:true,docEnvoyes:true,docRefuses:true,docArchives:true,docCommuns:true,
      valider:true,rejeter:true,validMulti:true,receveurFourn:false,
      liquidation:true,paiements:true,avance:true,bap:true,
      etatR1:true,etatR2:true,etatR3:true,etatR4:true,etatR5:true,
      etatR6:true,etatR7:true,etatR8:true,etatR9:true,etatR10:true,etatR11:true,
      statsKpi:true,exportDoc:true,
      paramTypes:false,paramReceveurs:false,paramChamps:false,paramUsers:false,paramPerms:false,
    },
  },
  /* Chef de projet */
  chef: {
    label:"Chef de Projet", color:"#4a90d9",
    perms: {
      langFr:true,langEn:true,dashboard:true,notifications:true,
      depot:true,depotConf:false,ocr:true,suivi:true,
      docRecusFourn:true,docCourrier:true,docConfidential:false,
      docRecu:true,docEnCours:true,docEnvoyes:true,docRefuses:true,docArchives:true,docCommuns:true,
      valider:true,rejeter:true,validMulti:true,receveurFourn:false,
      liquidation:false,paiements:false,avance:false,bap:false,
      etatR1:true,etatR2:true,etatR3:true,etatR4:false,etatR5:true,
      etatR6:true,etatR7:false,etatR8:false,etatR9:true,etatR10:false,etatR11:false,
      statsKpi:true,exportDoc:true,
      paramTypes:false,paramReceveurs:false,paramChamps:false,paramUsers:false,paramPerms:false,
    },
  },
  /* Comptable */
  comptable: {
    label:"Comptable", color:"#28a745",
    perms: {
      langFr:true,langEn:false,dashboard:true,notifications:true,
      depot:true,depotConf:false,ocr:true,suivi:true,
      docRecusFourn:true,docCourrier:true,docConfidential:false,
      docRecu:true,docEnCours:true,docEnvoyes:true,docRefuses:false,docArchives:true,docCommuns:true,
      valider:true,rejeter:false,validMulti:false,receveurFourn:true,
      liquidation:true,paiements:false,avance:false,bap:false,
      etatR1:false,etatR2:true,etatR3:false,etatR4:false,etatR5:false,
      etatR6:false,etatR7:false,etatR8:false,etatR9:false,etatR10:false,etatR11:false,
      statsKpi:false,exportDoc:true,
      paramTypes:false,paramReceveurs:false,paramChamps:false,paramUsers:false,paramPerms:false,
    },
  },
  /* Gestionnaire docs */
  gestionnaire: {
    label:"Gestionnaire Docs", color:"#1ecad3",
    perms: {
      langFr:true,langEn:false,dashboard:true,notifications:true,
      depot:true,depotConf:false,ocr:true,suivi:true,
      docRecusFourn:true,docCourrier:true,docConfidential:false,
      docRecu:true,docEnCours:false,docEnvoyes:false,docRefuses:false,docArchives:false,docCommuns:true,
      valider:false,rejeter:false,validMulti:false,receveurFourn:true,
      liquidation:false,paiements:false,avance:false,bap:false,
      etatR1:false,etatR2:false,etatR3:false,etatR4:false,etatR5:false,
      etatR6:false,etatR7:false,etatR8:false,etatR9:false,etatR10:false,etatR11:false,
      statsKpi:false,exportDoc:false,
      paramTypes:false,paramReceveurs:false,paramChamps:false,paramUsers:false,paramPerms:false,
    },
  },
};

/* ══════════════════════════════════════════════════════════
   HELPER : vérifier une permission pour un utilisateur
══════════════════════════════════════════════════════════ */
export function hasPerm(user, key) {
  if (!user) return false;
  // Explicit permissions override profile
  if (user.permissions && typeof user.permissions[key] === "boolean") {
    return user.permissions[key];
  }
  // Fall back to old droits system for backward compat
  if (user.droits) {
    const map = {
      depot:"depot",depotConf:"docConf",ocr:"saisieOCR",
      liquidation:"liquidation",avance:"avance",validMulti:"validMulti",
      docConfidential:"docConf",docEnCours:"docEnCours",
    };
    if (map[key]) return !!user.droits[map[key]];
  }
  return true; // default allow if no permission defined
}

/* Default full permissions for a new user */
export const DEFAULT_PERMS = Object.fromEntries(ALL_PERM_KEYS.map(k=>[k,false]));
