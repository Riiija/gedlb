"use client";

export const SOFT_BUDGET_STORAGE_KEY = "softbudget.state.v1";

export const RESERVING_STATUSES = ["en_attente_validation", "approuve", "emis", "receptionne"];

export const STATUS_META = {
  brouillon: { label: "Brouillon", color: "#64748b", bg: "#f1f5f9" },
  en_attente_validation: { label: "En attente validation", color: "#b45309", bg: "#fffbeb" },
  approuve: { label: "Approuve", color: "#047857", bg: "#ecfdf5" },
  emis: { label: "Emis", color: "#2563eb", bg: "#eff6ff" },
  receptionne: { label: "Receptionne", color: "#0f766e", bg: "#ecfdf5" },
  facture: { label: "Facture", color: "#4f46e5", bg: "#eef2ff" },
  cloture: { label: "Cloture", color: "#475569", bg: "#f8fafc" },
  annule: { label: "Annule", color: "#dc2626", bg: "#fef2f2" },
  refuse: { label: "Refuse", color: "#b91c1c", bg: "#fee2e2" },
};

export const VALIDATION_STATUS_META = {
  en_attente: { label: "En attente", color: "#b45309", bg: "#fffbeb" },
  approuvee: { label: "Approuvee", color: "#047857", bg: "#ecfdf5" },
  refusee: { label: "Refusee", color: "#b91c1c", bg: "#fee2e2" },
};

export const LINE_STATUS_META = {
  active: { label: "Active", color: "#047857", bg: "#ecfdf5" },
  gelee: { label: "Gelee", color: "#475569", bg: "#f1f5f9" },
};

export function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function nowIso() {
  return new Date().toISOString();
}

export function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function formatMoney(value) {
  const n = Number(value || 0);
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatPercent(value) {
  return `${Number(value || 0).toFixed(1).replace(".", ",")} %`;
}

export function numberValue(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function withStamp(entity, date = nowIso()) {
  return { ...entity, createdAt: date, updatedAt: date };
}

function indexBy(items) {
  return Object.fromEntries((items || []).map((item) => [item.id, item]));
}

function sum(items, selector = (item) => item) {
  return (items || []).reduce((total, item) => total + numberValue(selector(item)), 0);
}

export function createSoftBudgetSeed() {
  const t = "2026-06-14T09:00:00.000Z";
  const exercices = [
    withStamp({ id: "EX-2026", annee: 2026, statut: "ouvert", dateDebut: "2026-01-01", dateFin: "2026-12-31" }, t),
  ];

  const axes = [
    ["AX-DEP-IT", "departement", "IT", "Informatique"],
    ["AX-DEP-MKT", "departement", "MKT", "Marketing"],
    ["AX-DEP-RH", "departement", "RH", "Ressources humaines"],
    ["AX-DEP-PRD", "departement", "PRD", "Production"],
    ["AX-DEP-RD", "departement", "RD", "Recherche & developpement"],
    ["AX-DEP-LOG", "departement", "LOG", "Logistique"],
    ["AX-PRJ-ERP", "projet", "ERP26", "Transformation ERP"],
    ["AX-PRJ-DATA", "projet", "DATA", "Plateforme data"],
    ["AX-PRJ-USINE", "projet", "CAPEX-U", "Modernisation usine"],
  ].map(([id, type, code, libelle]) => withStamp({ id, type, code, libelle, parentId: null }, t));

  const budgets = [
    withStamp({ id: "BUD-2026-FONC", exerciceId: "EX-2026", libelle: "Budget de fonctionnement 2026", type: "initial" }, t),
  ];

  const line = (id, libelle, dep, project, nature, initial, revise, statut = "active") =>
    withStamp({
      id,
      budgetId: "BUD-2026-FONC",
      libelle,
      axeDepartementId: dep,
      axeProjetId: project,
      nature,
      montantInitial: initial,
      montantRevise: revise,
      statut,
    }, t);

  const lignes = [
    line("LB-001", "Cloud, licences et support", "AX-DEP-IT", null, "OPEX", 50000, null),
    line("LB-002", "Prestations marketing externes", "AX-DEP-MKT", null, "OPEX", 35000, null),
    line("LB-003", "Formation et developpement RH", "AX-DEP-RH", null, "OPEX", 18000, null),
    line("LB-004", "Maintenance equipements usine", "AX-DEP-PRD", "AX-PRJ-USINE", "OPEX", 60000, null),
    line("LB-005", "Projet ERP - licences et integrateur", "AX-DEP-IT", "AX-PRJ-ERP", "CAPEX", 120000, null),
    line("LB-006", "Prototypes et equipements R&D", "AX-DEP-RD", null, "CAPEX", 42000, null),
    line("LB-007", "Transport et logistique", "AX-DEP-LOG", null, "OPEX", 28000, null),
    line("LB-008", "Recrutement cadres", "AX-DEP-RH", null, "OPEX", 22000, null),
    line("LB-009", "Securite sites", "AX-DEP-PRD", null, "OPEX", 30000, null, "gelee"),
    line("LB-010", "Plateforme data", "AX-DEP-IT", "AX-PRJ-DATA", "CAPEX", 75000, 82000),
    line("LB-011", "Fournitures administratives", "AX-DEP-LOG", null, "OPEX", 12000, null),
    line("LB-012", "Energie production", "AX-DEP-PRD", null, "OPEX", 90000, null),
    line("LB-013", "Communication institutionnelle", "AX-DEP-MKT", null, "OPEX", 25000, null),
    line("LB-014", "Entretien flotte vehicules", "AX-DEP-LOG", null, "OPEX", 40000, null),
  ];

  const fournisseurs = [
    ["FOU-001", "Cloud Mada Services", "CLD", "IT"],
    ["FOU-002", "Agence Baobab Media", "BAO", "Marketing"],
    ["FOU-003", "Cabinet Ravinala Conseil", "RAV", "Conseil"],
    ["FOU-004", "MecaPro Industrie", "MEC", "Maintenance"],
    ["FOU-005", "ERP Integration Group", "ERP", "Logiciel"],
    ["FOU-006", "Energie Plus", "ENP", "Energie"],
    ["FOU-007", "LogisTrans", "LOG", "Transport"],
  ].map(([id, raisonSociale, code, categorie]) => withStamp({ id, raisonSociale, code, categorie }, t));

  const eng = (id, ligneId, type, fournisseurId, objet, montant, date, statut, extra = {}) =>
    withStamp({ id, ligneId, type, fournisseurId, objet, montant, date, statut, derogation: false, justification: "", dateEcheance: null, ...extra }, t);

  const engagements = [
    eng("ENG-001", "LB-001", "BC", "FOU-001", "Hebergement cloud annuel", 18000, "2026-02-10", "receptionne", { dateEcheance: "2026-05-15" }),
    eng("ENG-002", "LB-002", "BC", "FOU-002", "Campagne acquisition Q2", 7000, "2026-04-03", "emis", { dateEcheance: "2026-06-05" }),
    eng("ENG-003", "LB-004", "contrat", "FOU-004", "Maintenance presses ligne A", 26000, "2026-05-22", "en_attente_validation", { dateEcheance: "2026-07-20" }),
    eng("ENG-004", "LB-005", "contrat", "FOU-005", "Lot integrateur ERP", 60000, "2026-01-18", "receptionne", { dateEcheance: "2026-09-30" }),
    eng("ENG-005", "LB-006", "BC", "FOU-003", "Prototype capteurs IoT", 19000, "2026-03-12", "approuve", { dateEcheance: "2026-07-01" }),
    eng("ENG-006", "LB-008", "contrat", "FOU-003", "Mission recrutement direction achats", 5000, "2026-04-16", "emis", { dateEcheance: "2026-05-28" }),
    eng("ENG-007", "LB-012", "convention", "FOU-006", "Contrat energie secours", 11000, "2026-05-30", "en_attente_validation", { dateEcheance: "2026-07-15" }),
    eng("ENG-008", "LB-014", "BC", "FOU-007", "Entretien flotte S1", 10000, "2026-02-28", "approuve", { dateEcheance: "2026-06-30" }),
    eng("ENG-009", "LB-013", "BC", "FOU-002", "Sponsoring salon regional", 8000, "2026-01-20", "cloture", { dateEcheance: "2026-03-15" }),
    eng("ENG-010", "LB-003", "BC", "FOU-003", "Formation managers", 8000, "2026-02-05", "facture", { dateEcheance: "2026-04-05" }),
    eng("ENG-011", "LB-009", "BC", "FOU-004", "Audit securite site nord", 15000, "2026-03-02", "annule", { dateEcheance: "2026-04-30" }),
  ];

  const dep = (id, ligneId, engagementId, fournisseurId, montant, date, type, pieceJointe = "") =>
    withStamp({ id, ligneId, engagementId, fournisseurId, montant, date, type, pieceJointe }, t);

  const depenses = [
    dep("DEP-001", "LB-001", "ENG-001", "FOU-001", 6000, "2026-03-01", "facture", "FACT-CLOUD-031"),
    dep("DEP-002", "LB-001", null, "FOU-001", 22000, "2026-04-20", "facture", "FACT-LIC-042"),
    dep("DEP-003", "LB-002", null, "FOU-002", 30000, "2026-05-03", "facture", "FACT-MKT-050"),
    dep("DEP-004", "LB-003", "ENG-010", "FOU-003", 8000, "2026-04-02", "facture", "FACT-FORM-044"),
    dep("DEP-005", "LB-004", null, "FOU-004", 32000, "2026-03-22", "facture", "FACT-MAINT-033"),
    dep("DEP-006", "LB-005", "ENG-004", "FOU-005", 15000, "2026-02-28", "facture", "FACT-ERP-028"),
    dep("DEP-007", "LB-005", null, "FOU-005", 35000, "2026-05-09", "facture", "FACT-ERP-DIR"),
    dep("DEP-008", "LB-006", null, "FOU-003", 20000, "2026-04-15", "facture", "FACT-RD-041"),
    dep("DEP-009", "LB-008", null, "FOU-003", 19000, "2026-05-11", "facture", "FACT-RH-051"),
    dep("DEP-010", "LB-009", null, "FOU-004", 10000, "2026-01-30", "facture", "FACT-SEC-013"),
    dep("DEP-011", "LB-010", null, "FOU-001", 12000, "2026-05-17", "facture", "FACT-DATA-051"),
    dep("DEP-012", "LB-011", null, "FOU-007", 4000, "2026-02-17", "facture", "FACT-ADM-021"),
    dep("DEP-013", "LB-011", null, "FOU-007", -500, "2026-03-10", "avoir", "AV-ADM-031"),
    dep("DEP-014", "LB-012", null, "FOU-006", 68000, "2026-05-25", "facture", "FACT-ENE-052"),
    dep("DEP-015", "LB-014", null, "FOU-007", 15000, "2026-04-29", "facture", "FACT-FLT-042"),
  ];

  const validations = [
    withStamp({ id: "VAL-001", engagementId: "ENG-003", motifDeclenchement: "seuil_montant", statut: "en_attente", valideur: "DAF", commentaire: "", dateDecision: null }, t),
    withStamp({ id: "VAL-002", engagementId: "ENG-007", motifDeclenchement: "seuil_montant", statut: "en_attente", valideur: "DAF", commentaire: "", dateDecision: null }, t),
  ];

  const periodes = [
    "2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06",
    "2026-07", "2026-08", "2026-09", "2026-10", "2026-11", "2026-12",
  ].map((mois, index) => withStamp({ id: `PER-${index + 1}`, exerciceId: "EX-2026", mois, statut: index < 5 ? "clos" : "ouvert", poidsPrevision: index < 6 ? 1 : 1.08 }, t));

  const budgetVersions = [
    withStamp({ id: "BV-001", budgetId: "BUD-2026-FONC", nom: "Initial vote CA", type: "initial", statut: "approuve", montantTotal: 654000, auteur: "Daniella", date: "2025-12-18", commentaire: "Version votee par le comite budget." }, t),
    withStamp({ id: "BV-002", budgetId: "BUD-2026-FONC", nom: "Reforecast S1", type: "rolling_forecast", statut: "en_preparation", montantTotal: 681500, auteur: "Daniella", date: "2026-06-10", commentaire: "Hypothese energie +8 %, CAPEX data revise." }, t),
    withStamp({ id: "BV-003", budgetId: "BUD-2026-FONC", nom: "Scenario tension fournisseurs", type: "scenario", statut: "simule", montantTotal: 703200, auteur: "Marc", date: "2026-06-12", commentaire: "Stress test achats critiques." }, t),
  ];

  const budgetScenarios = [
    withStamp({ id: "SCN-001", nom: "Nominal", hypothese: "Activite conforme au budget", impact: 0, statut: "reference", probabilite: 60 }, t),
    withStamp({ id: "SCN-002", nom: "Optimiste", hypothese: "Report de deux achats CAPEX", impact: -32500, statut: "simule", probabilite: 20 }, t),
    withStamp({ id: "SCN-003", nom: "Pessimiste", hypothese: "Energie +12 % et sous-traitance +7 %", impact: 49200, statut: "a_arbitrer", probabilite: 20 }, t),
  ];

  const budgetWorkflowItems = [
    withStamp({ id: "BWF-001", objet: "Budget marketing revise", demandeur: "Marc", montant: 12000, statut: "en_validation", etape: "DAF", echeance: "2026-06-20" }, t),
    withStamp({ id: "BWF-002", objet: "Virement RH vers Production", demandeur: "Daniella", montant: 6500, statut: "retour_demandeur", etape: "Controle interne", echeance: "2026-06-18" }, t),
  ];

  const revisionRequests = [
    withStamp({ id: "REV-001", ligneSourceId: "LB-013", ligneCibleId: "LB-002", montant: 5000, motif: "Renforcer la campagne Q3", statut: "en_attente", demandeur: "Marketing", date: "2026-06-08" }, t),
    withStamp({ id: "REV-002", ligneSourceId: "LB-011", ligneCibleId: "LB-012", montant: 3500, motif: "Hausse tarif energie", statut: "approuvee", demandeur: "Production", date: "2026-05-29" }, t),
  ];

  const approvalRules = [
    withStamp({ id: "APR-001", libelle: "OPEX standard", departement: "Tous", nature: "OPEX", seuilMin: 0, seuilMax: 9999, circuit: "Responsable budget", slaHeures: 24, actif: true }, t),
    withStamp({ id: "APR-002", libelle: "Engagement DAF", departement: "Tous", nature: "OPEX/CAPEX", seuilMin: 10000, seuilMax: 49999, circuit: "DAF", slaHeures: 48, actif: true }, t),
    withStamp({ id: "APR-003", libelle: "Comite investissement", departement: "CAPEX", nature: "CAPEX", seuilMin: 50000, seuilMax: 999999, circuit: "DAF + DG + Comite", slaHeures: 96, actif: true }, t),
  ];

  const delegations = [
    withStamp({ id: "DEL-001", delegant: "Razafy Pierre", delegataire: "Randria Marie-Claire", role: "DAF", dateDebut: "2026-06-12", dateFin: "2026-06-21", actif: true }, t),
    withStamp({ id: "DEL-002", delegant: "Daniella", delegataire: "Marc", role: "Controle budget IT", dateDebut: "2026-06-01", dateFin: "2026-06-30", actif: true }, t),
  ];

  const provisions = [
    withStamp({ id: "PROV-001", engagementId: "ENG-004", libelle: "Provision integrateur ERP S1", montant: 12000, statut: "calculee", dateReprise: "2026-07-31" }, t),
    withStamp({ id: "PROV-002", engagementId: "ENG-003", libelle: "Provision maintenance presses", montant: 8000, statut: "a_comptabiliser", dateReprise: "2026-08-31" }, t),
  ];

  const expenseImports = [
    withStamp({ id: "IMP-001", source: "ERP comptabilite", fichier: "FEC_2026_05.csv", lignes: 142, statut: "importe", ecarts: 3, date: "2026-06-01" }, t),
    withStamp({ id: "IMP-002", source: "Notes de frais RH", fichier: "NDF_MAI.xlsx", lignes: 38, statut: "a_controler", ecarts: 5, date: "2026-06-05" }, t),
  ];

  const reports = [
    withStamp({ id: "RPT-001", nom: "Budget vs realise par departement", frequence: "Mensuel", destinataires: "DAF, DG", statut: "pret", derniereGeneration: "2026-06-10" }, t),
    withStamp({ id: "RPT-002", nom: "Engagements ouverts et provisions", frequence: "Hebdomadaire", destinataires: "Controle gestion", statut: "planifie", derniereGeneration: "2026-06-07" }, t),
    withStamp({ id: "RPT-003", nom: "Rapport CAPEX comite direction", frequence: "Trimestriel", destinataires: "Comite investissement", statut: "brouillon", derniereGeneration: null }, t),
  ];

  const alertRules = [
    withStamp({ id: "ALR-001", nom: "Alerte 80 % consommation", canal: "In-app + email", destinataires: "Responsable budget", actif: true, seuil: 80 }, t),
    withStamp({ id: "ALR-002", nom: "Blocage depassement 100 %", canal: "In-app", destinataires: "Demandeur + DAF", actif: true, seuil: 100 }, t),
    withStamp({ id: "ALR-003", nom: "Engagement non receptionne", canal: "Email hebdo", destinataires: "Achats", actif: true, seuil: 0 }, t),
  ];

  const projects = [
    withStamp({ id: "PRJ-001", code: "ERP26", nom: "Transformation ERP", sponsor: "DAF", budget: 120000, realise: 50000, avancement: 42, statut: "en_cours", prochaineJalon: "UAT finance", dateJalon: "2026-07-15" }, t),
    withStamp({ id: "PRJ-002", code: "DATA", nom: "Plateforme data", sponsor: "DSI", budget: 82000, realise: 12000, avancement: 18, statut: "risque", prochaineJalon: "Architecture cible", dateJalon: "2026-06-30" }, t),
    withStamp({ id: "PRJ-003", code: "CAPEX-U", nom: "Modernisation usine", sponsor: "Production", budget: 60000, realise: 32000, avancement: 55, statut: "en_cours", prochaineJalon: "Reception ligne A", dateJalon: "2026-08-10" }, t),
  ];

  const capexAssets = [
    withStamp({ id: "CAP-001", projetId: "PRJ-001", libelle: "Licences ERP core", montant: 42000, miseEnService: "2026-10-01", dureeAmortissement: 5, statut: "commande" }, t),
    withStamp({ id: "CAP-002", projetId: "PRJ-003", libelle: "Presse hydraulique ligne A", montant: 58000, miseEnService: "2026-09-15", dureeAmortissement: 8, statut: "en_reception" }, t),
  ];

  const integrations = [
    withStamp({ id: "INT-001", nom: "SAP FI/CO", type: "ERP", statut: "connecte", derniereSync: "2026-06-14T08:30:00", flux: "Budgets, ecritures, fournisseurs", erreurs: 0 }, t),
    withStamp({ id: "INT-002", nom: "Odoo Achats", type: "Achats", statut: "a_configurer", derniereSync: null, flux: "Bons de commande", erreurs: 0 }, t),
    withStamp({ id: "INT-003", nom: "SFTP Comptabilite", type: "Fichier plat", statut: "alerte", derniereSync: "2026-06-12T22:00:00", flux: "Factures et paiements", erreurs: 2 }, t),
  ];

  const apiEvents = [
    withStamp({ id: "API-001", event: "budget.line.updated", cible: "PowerBI webhook", statut: "livre", date: "2026-06-14T08:35:00" }, t),
    withStamp({ id: "API-002", event: "commitment.approved", cible: "ERP achats", statut: "en_retry", date: "2026-06-13T16:12:00" }, t),
  ];

  const roles = [
    withStamp({ id: "ROLE-001", nom: "Lecteur direction", droits: ["lecture_reporting", "lecture_consolidation"], sod: "OK" }, t),
    withStamp({ id: "ROLE-002", nom: "Saisisseur budget", droits: ["creation_ligne", "demande_revision"], sod: "OK" }, t),
    withStamp({ id: "ROLE-003", nom: "Valideur DAF", droits: ["validation_engagement", "derogation", "revision"], sod: "A surveiller" }, t),
    withStamp({ id: "ROLE-004", nom: "Admin systeme", droits: ["parametrage", "securite", "integrations"], sod: "Critique" }, t),
  ];

  const securityUsers = [
    withStamp({ id: "SEC-U001", nom: "Daniella", roleId: "ROLE-002", departement: "Finance", statut: "actif", dernierAcces: "2026-06-14T08:00:00" }, t),
    withStamp({ id: "SEC-U002", nom: "Sylvie", roleId: "ROLE-003", departement: "Direction", statut: "actif", dernierAcces: "2026-06-13T17:40:00" }, t),
    withStamp({ id: "SEC-U003", nom: "Marc", roleId: "ROLE-002", departement: "Marketing", statut: "temporaire", dernierAcces: "2026-06-14T09:20:00" }, t),
  ];

  const accessReviews = [
    withStamp({ id: "REVACC-001", perimetre: "DAF & controle gestion", statut: "en_cours", couverture: 78, echeance: "2026-06-25" }, t),
    withStamp({ id: "REVACC-002", perimetre: "Admins integrations", statut: "a_lancer", couverture: 0, echeance: "2026-07-05" }, t),
  ];

  const forecastRuns = [
    withStamp({ id: "FRC-001", nom: "Atterrissage juin 2026", horizon: "12 mois", methode: "Tendance + engagements", budget: 654000, prevision: 689400, risque: "moyen", statut: "calcule", date: "2026-06-14" }, t),
    withStamp({ id: "FRC-002", nom: "Stress energie", horizon: "6 mois", methode: "Scenario inflation", budget: 654000, prevision: 706200, risque: "eleve", statut: "a_arbitrer", date: "2026-06-12" }, t),
  ];

  const groupEntities = [
    withStamp({ id: "ENT-001", code: "MG-HQ", nom: "Holding Madagascar", devise: "EUR", budget: 654000, realise: 295500, contribution: 62 }, t),
    withStamp({ id: "ENT-002", code: "MG-NORD", nom: "Filiale Nord", devise: "MGA", budget: 210000, realise: 98000, contribution: 21 }, t),
    withStamp({ id: "ENT-003", code: "MG-EST", nom: "Filiale Est", devise: "MGA", budget: 165000, realise: 74000, contribution: 17 }, t),
  ];

  const consolidationPackages = [
    withStamp({ id: "CONS-001", nom: "Conso budget groupe S1", statut: "en_collecte", entitesRecues: 2, entitesAttendues: 3, ecarts: 4, dateCloture: "2026-06-30" }, t),
    withStamp({ id: "CONS-002", nom: "Retraitements IFRS CAPEX", statut: "a_revoir", entitesRecues: 3, entitesAttendues: 3, ecarts: 2, dateCloture: "2026-07-10" }, t),
  ];

  const adminTasks = [
    withStamp({ id: "ADM-001", tache: "Revue modele import Excel budget", priorite: "haute", statut: "en_cours", responsable: "Admin" }, t),
    withStamp({ id: "ADM-002", tache: "Parametrer notifications email DAF", priorite: "moyenne", statut: "a_faire", responsable: "IT" }, t),
    withStamp({ id: "ADM-003", tache: "Exporter documentation API Swagger", priorite: "basse", statut: "pret", responsable: "IT" }, t),
  ];

  const parametres = {
    seuilAlerte: 80,
    seuilDepassement: 100,
    seuilCritique: 110,
    seuilValidationMontant: 10000,
    modeControle: "souple",
    exerciceCourantId: "EX-2026",
  };

  const journal = [
    withStamp({ id: "AUD-001", acteur: "Systeme demo", action: "seed", entite: "softbudget", entiteId: "EX-2026", details: "Jeu de donnees demo initialise", horodatage: t }, t),
    withStamp({ id: "AUD-002", acteur: "Daniella", action: "gel_ligne", entite: "ligne", entiteId: "LB-009", details: "Ligne Securite sites gelee pour arbitrage", horodatage: "2026-05-20T13:20:00.000Z" }, t),
  ];

  return {
    exercices, budgets, lignes, axes, fournisseurs, engagements, depenses, validations,
    periodes, budgetVersions, budgetScenarios, budgetWorkflowItems, revisionRequests,
    approvalRules, delegations, provisions, expenseImports, reports, alertRules,
    projects, capexAssets, integrations, apiEvents, roles, securityUsers, accessReviews,
    forecastRuns, groupEntities, consolidationPackages, adminTasks,
    parametres, journal,
  };
}

export function normalizeSoftBudgetState(raw) {
  const seed = createSoftBudgetSeed();
  if (!raw || typeof raw !== "object") return seed;
  return {
    exercices: Array.isArray(raw.exercices) ? raw.exercices : seed.exercices,
    budgets: Array.isArray(raw.budgets) ? raw.budgets : seed.budgets,
    lignes: Array.isArray(raw.lignes) ? raw.lignes : seed.lignes,
    axes: Array.isArray(raw.axes) ? raw.axes : seed.axes,
    fournisseurs: Array.isArray(raw.fournisseurs) ? raw.fournisseurs : seed.fournisseurs,
    engagements: Array.isArray(raw.engagements) ? raw.engagements : seed.engagements,
    depenses: Array.isArray(raw.depenses) ? raw.depenses : seed.depenses,
    validations: Array.isArray(raw.validations) ? raw.validations : seed.validations,
    periodes: Array.isArray(raw.periodes) ? raw.periodes : seed.periodes,
    budgetVersions: Array.isArray(raw.budgetVersions) ? raw.budgetVersions : seed.budgetVersions,
    budgetScenarios: Array.isArray(raw.budgetScenarios) ? raw.budgetScenarios : seed.budgetScenarios,
    budgetWorkflowItems: Array.isArray(raw.budgetWorkflowItems) ? raw.budgetWorkflowItems : seed.budgetWorkflowItems,
    revisionRequests: Array.isArray(raw.revisionRequests) ? raw.revisionRequests : seed.revisionRequests,
    approvalRules: Array.isArray(raw.approvalRules) ? raw.approvalRules : seed.approvalRules,
    delegations: Array.isArray(raw.delegations) ? raw.delegations : seed.delegations,
    provisions: Array.isArray(raw.provisions) ? raw.provisions : seed.provisions,
    expenseImports: Array.isArray(raw.expenseImports) ? raw.expenseImports : seed.expenseImports,
    reports: Array.isArray(raw.reports) ? raw.reports : seed.reports,
    alertRules: Array.isArray(raw.alertRules) ? raw.alertRules : seed.alertRules,
    projects: Array.isArray(raw.projects) ? raw.projects : seed.projects,
    capexAssets: Array.isArray(raw.capexAssets) ? raw.capexAssets : seed.capexAssets,
    integrations: Array.isArray(raw.integrations) ? raw.integrations : seed.integrations,
    apiEvents: Array.isArray(raw.apiEvents) ? raw.apiEvents : seed.apiEvents,
    roles: Array.isArray(raw.roles) ? raw.roles : seed.roles,
    securityUsers: Array.isArray(raw.securityUsers) ? raw.securityUsers : seed.securityUsers,
    accessReviews: Array.isArray(raw.accessReviews) ? raw.accessReviews : seed.accessReviews,
    forecastRuns: Array.isArray(raw.forecastRuns) ? raw.forecastRuns : seed.forecastRuns,
    groupEntities: Array.isArray(raw.groupEntities) ? raw.groupEntities : seed.groupEntities,
    consolidationPackages: Array.isArray(raw.consolidationPackages) ? raw.consolidationPackages : seed.consolidationPackages,
    adminTasks: Array.isArray(raw.adminTasks) ? raw.adminTasks : seed.adminTasks,
    parametres: { ...seed.parametres, ...(raw.parametres || {}) },
    journal: Array.isArray(raw.journal) ? raw.journal : seed.journal,
  };
}

export function getLineBudget(line) {
  return numberValue(line?.montantRevise ?? line?.montantInitial);
}

export function getHealth(rate, params) {
  if (rate >= numberValue(params.seuilCritique || 110)) return { key: "critique", label: "Critique", color: "#b91c1c", bg: "#fee2e2" };
  if (rate >= numberValue(params.seuilDepassement || 100)) return { key: "depassement", label: "Depassement", color: "#dc2626", bg: "#fef2f2" };
  if (rate >= numberValue(params.seuilAlerte || 80)) return { key: "vigilance", label: "Vigilance", color: "#b45309", bg: "#fffbeb" };
  return { key: "sain", label: "Sain", color: "#047857", bg: "#ecfdf5" };
}

export function deriveSoftBudget(rawState) {
  const state = normalizeSoftBudgetState(rawState);
  const axesById = indexBy(state.axes);
  const fournisseursById = indexBy(state.fournisseurs);
  const lignesByIdRaw = indexBy(state.lignes);
  const depensesByEngagement = state.depenses.reduce((acc, depense) => {
    if (!depense.engagementId) return acc;
    if (!acc[depense.engagementId]) acc[depense.engagementId] = [];
    acc[depense.engagementId].push(depense);
    return acc;
  }, {});

  const engagements = state.engagements.map((engagement) => {
    const relatedDepenses = depensesByEngagement[engagement.id] || [];
    const facture = sum(relatedDepenses, (depense) => depense.montant);
    const reliquat = Math.max(0, numberValue(engagement.montant) - facture);
    const line = lignesByIdRaw[engagement.ligneId];
    const fournisseur = fournisseursById[engagement.fournisseurId];
    return {
      ...engagement,
      facture,
      reliquat,
      reservant: RESERVING_STATUSES.includes(engagement.statut),
      ligneLabel: line?.libelle || "Ligne inconnue",
      fournisseurLabel: fournisseur?.raisonSociale || "Fournisseur inconnu",
      surFacture: facture > numberValue(engagement.montant),
    };
  });

  const engagementsByLine = engagements.reduce((acc, engagement) => {
    if (!acc[engagement.ligneId]) acc[engagement.ligneId] = [];
    acc[engagement.ligneId].push(engagement);
    return acc;
  }, {});

  const depensesByLine = state.depenses.reduce((acc, depense) => {
    if (!acc[depense.ligneId]) acc[depense.ligneId] = [];
    acc[depense.ligneId].push(depense);
    return acc;
  }, {});

  const lignes = state.lignes.map((line) => {
    const budget = getLineBudget(line);
    const lineEngagements = engagementsByLine[line.id] || [];
    const lineDepenses = depensesByLine[line.id] || [];
    const engage = sum(lineEngagements.filter((engagement) => engagement.reservant), (engagement) => engagement.reliquat);
    const realise = sum(lineDepenses, (depense) => depense.montant);
    const disponible = budget - engage - realise;
    const taux = budget > 0 ? ((engage + realise) / budget) * 100 : 0;
    const departement = axesById[line.axeDepartementId];
    const projet = axesById[line.axeProjetId];
    return {
      ...line,
      budget,
      engage,
      realise,
      disponible,
      taux,
      health: getHealth(taux, state.parametres),
      departementLabel: departement?.libelle || "-",
      departementCode: departement?.code || "-",
      projetLabel: projet?.libelle || "-",
      engagementCount: lineEngagements.length,
      depenseCount: lineDepenses.length,
      hasActivity: lineEngagements.length > 0 || lineDepenses.length > 0,
    };
  });

  const lignesById = indexBy(lignes);
  const enrichedDepenses = state.depenses.map((depense) => {
    const line = lignesById[depense.ligneId];
    const engagement = engagements.find((item) => item.id === depense.engagementId);
    const fournisseur = fournisseursById[depense.fournisseurId];
    return {
      ...depense,
      ligneLabel: line?.libelle || "Ligne inconnue",
      engagementLabel: engagement?.objet || "",
      fournisseurLabel: fournisseur?.raisonSociale || "Fournisseur inconnu",
      horsEngagement: !depense.engagementId,
    };
  });

  const totals = {
    budget: sum(lignes, (line) => line.budget),
    engage: sum(lignes, (line) => line.engage),
    realise: sum(lignes, (line) => line.realise),
    disponible: sum(lignes, (line) => line.disponible),
  };
  totals.taux = totals.budget > 0 ? ((totals.engage + totals.realise) / totals.budget) * 100 : 0;
  totals.health = getHealth(totals.taux, state.parametres);

  const departments = state.axes.filter((axis) => axis.type === "departement");
  const byDepartment = departments.map((dept) => {
    const deptLines = lignes.filter((line) => line.axeDepartementId === dept.id);
    return {
      id: dept.id,
      name: dept.code,
      label: dept.libelle,
      budget: sum(deptLines, (line) => line.budget),
      engage: sum(deptLines, (line) => line.engage),
      realise: sum(deptLines, (line) => line.realise),
    };
  });

  const byNature = ["CAPEX", "OPEX"].map((nature) => {
    const natureLines = lignes.filter((line) => line.nature === nature);
    return {
      name: nature,
      value: sum(natureLines, (line) => line.realise),
      budget: sum(natureLines, (line) => line.budget),
    };
  });

  const validations = state.validations.map((validation) => {
    const engagement = engagements.find((item) => item.id === validation.engagementId);
    const line = engagement ? lignesById[engagement.ligneId] : null;
    return {
      ...validation,
      engagement,
      line,
      statusMeta: VALIDATION_STATUS_META[validation.statut] || VALIDATION_STATUS_META.en_attente,
    };
  });

  const today = todayIso();
  const alerts = [];
  lignes.forEach((line) => {
    if (line.taux >= numberValue(state.parametres.seuilAlerte)) {
      alerts.push({
        id: `AL-LINE-${line.id}`,
        type: line.taux >= numberValue(state.parametres.seuilDepassement) ? "depassement" : "vigilance",
        severity: line.taux >= numberValue(state.parametres.seuilCritique) ? 3 : line.taux >= numberValue(state.parametres.seuilDepassement) ? 2 : 1,
        title: `${line.libelle} - ${line.health.label}`,
        detail: `Consommation ${formatPercent(line.taux)} pour un budget de ${formatMoney(line.budget)}.`,
        lineId: line.id,
        color: line.health.color,
      });
    }
  });
  engagements.forEach((engagement) => {
    if (engagement.dateEcheance && engagement.dateEcheance < today && ["emis", "approuve"].includes(engagement.statut)) {
      alerts.push({
        id: `AL-DUE-${engagement.id}`,
        type: "delai",
        severity: 2,
        title: `Engagement en retard - ${engagement.objet}`,
        detail: `Echeance ${engagement.dateEcheance}, aucune reception constatee.`,
        engagementId: engagement.id,
        color: "#b45309",
      });
    }
    if (engagement.surFacture) {
      alerts.push({
        id: `AL-OVER-${engagement.id}`,
        type: "sur_facturation",
        severity: 3,
        title: `Sur-facturation - ${engagement.objet}`,
        detail: `${formatMoney(engagement.facture)} factures pour ${formatMoney(engagement.montant)} engages.`,
        engagementId: engagement.id,
        color: "#dc2626",
      });
    }
  });
  enrichedDepenses.filter((depense) => depense.horsEngagement && depense.type !== "avoir").slice(0, 8).forEach((depense) => {
    alerts.push({
      id: `AL-DIRECT-${depense.id}`,
      type: "hors_engagement",
      severity: 1,
      title: `Depense directe - ${depense.fournisseurLabel}`,
      detail: `${formatMoney(depense.montant)} imputes sans engagement sur ${depense.ligneLabel}.`,
      depenseId: depense.id,
      color: "#2563eb",
    });
  });

  alerts.sort((a, b) => b.severity - a.severity || a.title.localeCompare(b.title));

  return {
    ...state,
    axesById,
    fournisseursById,
    lignes,
    lignesById,
    engagements,
    depenses: enrichedDepenses,
    validations,
    totals,
    byDepartment,
    byNature,
    alerts,
    pendingValidationCount: validations.filter((validation) => validation.statut === "en_attente").length,
  };
}

export function addAudit(state, acteur, action, entite, entiteId, details) {
  const date = nowIso();
  const entry = withStamp({
    id: uid("AUD"),
    acteur: acteur || "Utilisateur",
    action,
    entite,
    entiteId,
    details,
    horodatage: date,
  }, date);
  return { ...state, journal: [entry, ...(state.journal || [])].slice(0, 300) };
}

export function evaluateEngagementProjection(state, lineId, amount) {
  const derived = deriveSoftBudget(state);
  const line = derived.lignesById[lineId];
  const montant = numberValue(amount);
  if (!line) {
    return { level: "blocked", message: "Choisissez une ligne budgetaire.", projection: 0, line: null };
  }
  if (line.statut === "gelee") {
    return { level: "blocked", message: "Cette ligne est gelee : aucun nouvel engagement possible.", projection: line.taux, line };
  }
  if (montant <= 0) {
    return { level: "neutral", message: "Saisissez un montant pour lancer le controle.", projection: line.taux, line };
  }
  const projection = line.budget > 0 ? ((line.realise + line.engage + montant) / line.budget) * 100 : 0;
  if (projection > numberValue(derived.parametres.seuilDepassement)) {
    if (derived.parametres.modeControle === "strict") {
      return {
        level: "blocked",
        message: `Mode strict : projection a ${formatPercent(projection)}, derogation DAF obligatoire.`,
        projection,
        line,
      };
    }
    return {
      level: "warning",
      message: `Mode souple : projection a ${formatPercent(projection)}, justification obligatoire.`,
      projection,
      line,
    };
  }
  return {
    level: "ok",
    message: `Controle OK : projection a ${formatPercent(projection)}.`,
    projection,
    line,
  };
}

export function shouldRouteValidation(state, amount, derogation) {
  return Boolean(derogation) || numberValue(amount) >= numberValue(state.parametres?.seuilValidationMontant || 10000);
}
