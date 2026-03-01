"use client";
/* ═══════════════════════════════════════════════════════
   SoftDocs — Internationalisation (FR / EN)
═══════════════════════════════════════════════════════ */

export const LANGS = ["fr", "en"];

export const T = {
  fr: {
    /* App */
    appName: "SoftDocs", appDesc: "GED & Finances",

    /* ── Navigation ── */
    dashboard: "Tableau de bord",
    depot: "Déposer un doc",
    suivi: "Suivi document",
    documents: "Mes Documents",
    financier: "Financier",
    liquidations: "Liquidations",
    paiements: "Paiements XML",
    parametrage: "Paramétrage",
    etatsRapports: "États & Rapports",
    utilisateurs: "Utilisateurs",
    typesDoc: "Types de documents",
    receveurs: "Receveurs",
    champsDyn: "Champs dynamiques",
    deconnexion: "Déconnexion",

    /* ── Doc menus ── */
    recusFourn: "Reçus fournisseurs",
    serviceCourrier: "Service Courriers",
    docsConf: "Documents Confidentiels",
    recu: "Reçu",
    enCours: "En cours",
    refuses: "Refusés",
    archives: "Archivés",
    envoyes: "Envoyés",
    docsCommuns: "Documents Communs",
    confidEnCours: "Confid. En cours",
    confidRefuses: "Confid. Refusés",
    confidArchives: "Confid. Archivés",
    refusesCommuns: "Refusés Communs",
    confidCommuns: "Confid. Communs",

    /* ── Actions ── */
    nouveau: "Nouveau", ajouter: "Ajouter", modifier: "Modifier",
    supprimer: "Supprimer", enregistrer: "Enregistrer", annuler: "Annuler",
    fermer: "Fermer", retour: "Retour", retourAccueil: "← Accueil",
    exporter: "Exporter", exportPdf: "Exporter PDF", exportExcel: "Exporter Excel",
    confirmer: "Confirmer", valider: "Valider", rejeter: "Rejeter",
    rechercher: "Rechercher", filtrer: "Filtrer", reinitialiser: "Réinitialiser",
    suivant: "Suivant →", precedent: "← Retour", reset: "Reset",
    imprimer: "Imprimer", telecharger: "Télécharger",

    /* ── Depot doc ── */
    deposerDoc: "Déposer un document",
    etape1: "1. Scan OCR",
    etape2: "2. Informations",
    etape3: "3. Annexes",
    etape4: "4. Confirmation",
    typeDocument: "Type de document",
    categorie: "Catégorie",
    fournisseur: "Fournisseur",
    date: "Date",
    projet: "Projet",
    site: "Site",
    montantOcr: "Montant (OCR)",
    montantReel: "Montant réel (si correction)",
    expediteur: "Expéditeur",
    confidentiel: "Confidentiel",
    marquerConf: "Marquer comme confidentiel",
    notes: "Notes",
    champsCompl: "Champs complémentaires",
    selectioner: "— Sélectionner —",
    piecesJointes: "Pièces jointes",
    ajouterPieces: "Ajoutez les pièces jointes requises :",
    ajoute: "✓ Ajouté",
    depotSucces: "Document déposé avec succès",
    depotMsg: "Le document a été soumis au circuit de validation.",
    nouveauDepot: "Nouveau dépôt",
    voirDocs: "Voir les documents →",

    /* ── Confirmation recapitulatif ── */
    confirmation: "Confirmation",
    type: "Type", montantOcrC: "Montant OCR", montantReelC: "Montant réel",
    annexes: "Annexes", fichiers: "fichier(s)",
    oui: "Oui", non: "Non", egal: "= OCR",
    confirmerDepot: "Confirmer le dépôt",

    /* ── OCR ── */
    ocrScore: "OCR terminé · Score",
    montantExtrait: "Montant extrait",

    /* ── Statuts ── */
    statRecu: "REÇU", statEnVal: "EN VALIDATION", statEnRetard: "EN RETARD",
    statValide: "VALIDÉ", statRejete: "REJETÉ", statBap: "BON À PAYER", statPaye: "PAYÉ",
    statArchive: "ARCHIVÉ", statCloture: "CLÔTURÉ",

    /* ── DocList / Table ── */
    reference: "Référence", nomType: "Type", montant: "Montant", statut: "Statut",
    actions: "Actions", score: "Score OCR", valideur: "Valideur", etape: "Étape",
    motif: "Motif", aucunDocument: "Aucun document", chargeDoc: "Chargement…",
    totalDocs: "document(s) au total", filtresActifs: "filtre(s) actif(s)",

    /* ── Liquidations ── */
    nouvelleLiq: "Nouvelle liquidation", modifierLiq: "Modifier la liquidation",
    imputations: "Imputations budgétaires", syncTompro: "Sync TOMPRO",
    piecesJustif: "Pièces justificatives", ajouterPiece: "Ajouter une pièce justificative",
    formatsAcceptes: "Formats acceptés : PDF, Excel, Word, JPG, PNG",
    totalImputation: "Total imputations", montantLiq: "Montant liquidation", balance: "Balance",

    /* ── Users ── */
    nom: "Nom", email: "Email", motDePasse: "Mot de passe",
    role: "Rôle", initiales: "Initiales", siteAffectation: "Site d'affectation",
    optionnelMdp: "Laisser vide pour conserver", maxInitiales: "3 caractères max.",
    nouvelUtilisateur: "Nouvel utilisateur", modifierUser: "Modifier l'utilisateur",

    /* ── Champs dynamiques ── */
    etiquette: "Étiquette (nom du champ)",
    visInternes: "Visible par les utilisateurs internes",
    visInternesSub: "Affiché uniquement lors du dépôt en back-office",
    visFourn: "Visible par les fournisseurs",
    visFournSub: "Disponible à la saisie sur le portail fournisseurs",
    requis: "Requis",
    requisSub: "Ce champ sera obligatoire à la saisie",
    typeChamp: "Type de champ",
    optionsDisp: "Options disponibles",
    nouvelleOption: "Nouvelle option…",
    champsDynTitle: "Champs dynamiques globaux",
    champsDynDesc: "Ces champs apparaissent systématiquement lors du dépôt de documents (back-office et/ou portail fournisseurs).",
    nouvcChamp: "Nouveau champ",
    modifChamp: "Modifier le champ",

    /* ── Types champs ── */
    typeTexte: "Texte libre", typeDate: "Date", typeCase: "Case à cocher",
    typeListe: "Liste déroulante", typeRadio: "Bouton radio", typeFichier: "Fichier (upload)",

    /* ── Topbar ── */
    recherchePlaceholder: "Rechercher document, référence…",
    portailFourn: "Portail fournisseurs ↗",
    uploadBtn: "Déposer",
    notifRetards: "en retard",
    notifEnCours: "en cours",
    notifications: "Notifications",
    langue: "Langue",

    /* ── Fournisseur landing ── */
    portailTitle: "Portail Fournisseurs",
    deposeTitle: "Déposer un document",
    deposeDesc: "Soumettez vos factures et documents directement en ligne.",
    suiviTitle: "Suivi de document",
    suiviDesc: "Suivez l'état de traitement de vos dossiers en temps réel.",
    backofficeTitle: "Se connecter",
    backofficeDesc: "Accès collaborateurs et gestionnaires.",
    commencer: "Commencer →",
    accesFourn: "Accès fournisseurs",
    accesBackoffice: "Accès back-office",

    /* ── Fournisseur Suivi ── */
    suiviSearch: "Recherche libre",
    suiviTitle2: "Suivez vos",
    suiviTitle3: "documents",
    suiviDesc2: "Entrez le numéro de référence, le nom du fournisseur ou le numéro de facture pour consulter l'état de traitement.",
    suiviPlaceholder: "Référence, N° facture, nom fournisseur…",
    suiviBtn: "Rechercher",
    suiviNotFound: "Aucun document trouvé",
    suiviNotFoundDesc: "Vérifiez la référence saisie. Si vous venez de soumettre un document, il peut prendre quelques instants pour apparaître.",
    suiviEtapesValidees: "étapes validées",
    suiviCliquer: "Cliquez pour voir le détail",
    suiviRealTime: "Suivi en temps réel",
    infoDocument: "Informations du document",
    circuitValidation: "Circuit de validation",
    traiteLe: "Traité le",
    par: "par",

    /* ── États & Rapports ── */
    etatsTitle: "États & Rapports",
    etatsDesc: "doc(s) dans la sélection",
    etatsFiltre: "filtre(s) actif(s)",
    selRapport: "Sélectionnez un rapport",
    rapportsDisp: "11 Rapports disponibles",
    filtreProjet: "Projet", filtreSite: "Site", filtreExped: "Type expéditeur",
    filtreValideur: "Valideur", filtrePeriode: "Période", filtreTous: "Tous",
    tousProj: "Tous les projets", tousSites: "Tous les sites",
    tousValideurs: "Tous les valideurs", tousExped: "Tous",
    expFourn: "Fournisseur", expInterne: "Interne",

    /* ── Rapport labels ── */
    r1Label: "Dossiers traités par projet", r1Sub: "Volume et taux de traitement",
    r2Label: "Historique des documents", r2Sub: "Journal complet des dossiers",
    r3Label: "En instance par validateur", r3Sub: "Charge de travail par agent",
    r4Label: "Dossiers en instance par personne", r4Sub: "Vue détaillée par assignation",
    r5Label: "Dossiers en instance par date", r5Sub: "Ancienneté des dossiers actifs",
    r6Label: "Délai moyen de traitement (archivés)", r6Sub: "Performance par projet",
    r7Label: "Détail traitement — dossiers archivés", r7Sub: "Audit complet",
    r8Label: "Dossiers en retard par validateur", r8Sub: "Alertes et escalade",
    r9Label: "Nombre de dossiers rejetés", r9Sub: "Taux de rejet par projet",
    r10Label: "Liste des dossiers refusés", r10Sub: "Motifs et responsables",
    r11Label: "Documents validés par utilisateur", r11Sub: "Productivité individuelle",

    /* ── Tableau KPIs ── */
    totalDossiers: "Total dossiers", traites: "Traités", enAttente: "En attente",
    tauxTraitement: "Taux traitement", montantTraite: "Montant traité",
    enInstance: "En instance", enRetard: "En retard", dansDelais: "Dans les délais",
    totalRejet: "Total rejetés", tauxRejet: "Taux de rejet", tauxRejetGlobal: "Taux de rejet global",
    totalValides: "Total validés", valeursActifs: "Valideurs actifs", montantValide: "Montant validé",
    partTotale: "Part totale", activiteRel: "Activité relative",
    delaiMoyen: "Délai moyen", joursEq: "Jours équivalents", delaiMin: "Délai min", delaiMax: "Délai max",
    nbRetards: "Nb retards", dossiersConc: "Dossiers concernés", alerte: "Alerte",
    nbEtapes: "Nb étapes", statFinal: "Statut final", clotureDate: "Date clôture",
    depotDate: "Date dépôt", durée: "Durée", anciennete: "Ancienneté",
    actionRequise: "Action requise", aucunRetard: "Aucun dossier en retard",
    bailleur: "Bailleur", codePrj: "Code",

    /* ── Params Types ── */
    nomType: "Nom du type", icone: "Icône", confType: "Confidentiel",
    projetsType: "Projets", sitesType: "Sites", nbEtapesType: "Nb étapes",

    /* ── Login ── */
    connexion: "Connexion", seConnecter: "Se connecter",
    identifiant: "Identifiant", motDePasse2: "Mot de passe",
    comptesDemo: "Comptes de démonstration",
    retourPortail: "← Retour au portail fournisseurs",
    gestionDoc: "Gestion documentaire & Finances",
    loginDesc: "Connectez-vous pour accéder à votre espace de travail",
    loginBtn: "Accéder au back-office →",
    loginError: "Identifiant ou mot de passe incorrect.",

    /* ── Misc ── */
    aucunDonnee: "Aucune donnée", loading: "Chargement…", erreur: "Erreur",
    selTous: "Tous", colonne: "Colonne", valeur: "Valeur",
    etatSection: "ÉTAT", sur: "Sur", enregistrements: "enregistrement(s)",
    oui: "Oui", non: "Non",
    rfEnCours: "Fourn. En cours", rfValides: "Fourn. Validés", rfRefuses: "Fourn. Refusés",
    check: "✓", confidRefuses: "Confid. Refusés",
  },

  en: {
    /* App */
    appName: "SoftDocs", appDesc: "DMS & Finance",

    /* ── Navigation ── */
    dashboard: "Dashboard",
    depot: "Submit document",
    suivi: "Track document",
    documents: "My Documents",
    financier: "Finance",
    liquidations: "Liquidations",
    paiements: "XML Payments",
    parametrage: "Settings",
    etatsRapports: "Reports & Analytics",
    utilisateurs: "Users",
    typesDoc: "Document types",
    receveurs: "Recipients",
    champsDyn: "Dynamic fields",
    deconnexion: "Sign out",

    /* ── Doc menus ── */
    recusFourn: "Supplier receipts",
    serviceCourrier: "Mail Service",
    docsConf: "Confidential Documents",
    recu: "Received",
    enCours: "In progress",
    refuses: "Rejected",
    archives: "Archived",
    envoyes: "Sent",
    docsCommuns: "Common Documents",
    confidEnCours: "Confid. In progress",
    confidRefuses: "Confid. Rejected",
    confidArchives: "Confid. Archived",
    refusesCommuns: "Common rejected",
    confidCommuns: "Confid. Common",

    /* ── Actions ── */
    nouveau: "New", ajouter: "Add", modifier: "Edit",
    supprimer: "Delete", enregistrer: "Save", annuler: "Cancel",
    fermer: "Close", retour: "Back", retourAccueil: "← Home",
    exporter: "Export", exportPdf: "Export PDF", exportExcel: "Export Excel",
    confirmer: "Confirm", valider: "Validate", rejeter: "Reject",
    rechercher: "Search", filtrer: "Filter", reinitialiser: "Reset",
    suivant: "Next →", precedent: "← Back", reset: "Reset",
    imprimer: "Print", telecharger: "Download",

    /* ── Depot doc ── */
    deposerDoc: "Submit a document",
    etape1: "1. OCR Scan", etape2: "2. Information", etape3: "3. Attachments", etape4: "4. Confirmation",
    typeDocument: "Document type", categorie: "Category",
    fournisseur: "Supplier", date: "Date", projet: "Project", site: "Site",
    montantOcr: "Amount (OCR)", montantReel: "Actual amount (if different)",
    expediteur: "Sender", confidentiel: "Confidential",
    marquerConf: "Mark as confidential", notes: "Notes",
    champsCompl: "Additional fields",
    selectioner: "— Select —",
    piecesJointes: "Attachments",
    ajouterPieces: "Add required attachments:",
    ajoute: "✓ Added",
    depotSucces: "Document submitted successfully",
    depotMsg: "The document has been submitted to the validation workflow.",
    nouveauDepot: "New submission",
    voirDocs: "View documents →",

    /* ── Confirmation ── */
    confirmation: "Confirmation",
    type: "Type", montantOcrC: "OCR Amount", montantReelC: "Actual amount",
    annexes: "Attachments", fichiers: "file(s)",
    oui: "Yes", non: "No", egal: "= OCR",
    confirmerDepot: "Confirm submission",

    /* ── OCR ── */
    ocrScore: "OCR done · Score",
    montantExtrait: "Extracted amount",

    /* ── Statuts ── */
    statRecu: "RECEIVED", statEnVal: "IN REVIEW", statEnRetard: "OVERDUE",
    statValide: "APPROVED", statRejete: "REJECTED", statBap: "READY TO PAY", statPaye: "PAID",
    statArchive: "ARCHIVED", statCloture: "CLOSED",

    /* ── DocList ── */
    reference: "Reference", nomType: "Type", montant: "Amount", statut: "Status",
    actions: "Actions", score: "OCR Score", valideur: "Validator", etape: "Step",
    motif: "Reason", aucunDocument: "No documents", chargeDoc: "Loading…",
    totalDocs: "document(s) total", filtresActifs: "active filter(s)",

    /* ── Liquidations ── */
    nouvelleLiq: "New liquidation", modifierLiq: "Edit liquidation",
    imputations: "Budget allocations", syncTompro: "Sync TOMPRO",
    piecesJustif: "Supporting documents", ajouterPiece: "Add a supporting document",
    formatsAcceptes: "Accepted formats: PDF, Excel, Word, JPG, PNG",
    totalImputation: "Total allocation", montantLiq: "Liquidation amount", balance: "Balance",

    /* ── Users ── */
    nom: "Name", email: "Email", motDePasse: "Password",
    role: "Role", initiales: "Initials", siteAffectation: "Assigned site",
    optionnelMdp: "Leave blank to keep current", maxInitiales: "3 characters max.",
    nouvelUtilisateur: "New user", modifierUser: "Edit user",

    /* ── Dynamic fields ── */
    etiquette: "Label (field name)",
    visInternes: "Visible to internal users",
    visInternesSub: "Displayed only during back-office upload",
    visFourn: "Visible to suppliers",
    visFournSub: "Available on the supplier portal upload page",
    requis: "Required",
    requisSub: "This field will be mandatory",
    typeChamp: "Field type",
    optionsDisp: "Available options",
    nouvelleOption: "New option…",
    champsDynTitle: "Global dynamic fields",
    champsDynDesc: "These fields appear automatically when uploading documents (back-office and/or supplier portal).",
    nouvcChamp: "New field",
    modifChamp: "Edit field",

    /* ── Field types ── */
    typeTexte: "Free text", typeDate: "Date", typeCase: "Checkbox",
    typeListe: "Dropdown list", typeRadio: "Radio button", typeFichier: "File upload",

    /* ── Topbar ── */
    recherchePlaceholder: "Search document, reference…",
    portailFourn: "Supplier Portal ↗",
    uploadBtn: "Upload",
    notifRetards: "overdue",
    notifEnCours: "in progress",
    notifications: "Notifications",
    langue: "Language",

    /* ── Fournisseur landing ── */
    portailTitle: "Supplier Portal",
    deposeTitle: "Submit a document",
    deposeDesc: "Submit your invoices and documents directly online.",
    suiviTitle: "Track document",
    suiviDesc: "Track the status of your files in real time.",
    backofficeTitle: "Sign in",
    backofficeDesc: "Staff and manager access.",
    commencer: "Get started →",
    accesFourn: "Supplier access",
    accesBackoffice: "Back-office access",

    /* ── Fournisseur Suivi ── */
    suiviSearch: "Free search",
    suiviTitle2: "Track your",
    suiviTitle3: "documents",
    suiviDesc2: "Enter the reference number, supplier name or invoice number to check the processing status of your file.",
    suiviPlaceholder: "Reference, invoice no., supplier name…",
    suiviBtn: "Search",
    suiviNotFound: "No document found",
    suiviNotFoundDesc: "Check the reference entered. If you just submitted a document, it may take a moment to appear.",
    suiviEtapesValidees: "steps approved",
    suiviCliquer: "Click to view details",
    suiviRealTime: "Real-time tracking",
    infoDocument: "Document information",
    circuitValidation: "Validation workflow",
    traiteLe: "Processed on",
    par: "by",

    /* ── Reports ── */
    etatsTitle: "Reports & Analytics",
    etatsDesc: "document(s) in selection",
    etatsFiltre: "active filter(s)",
    selRapport: "Select a report",
    rapportsDisp: "11 Reports available",
    filtreProjet: "Project", filtreSite: "Site", filtreExped: "Sender type",
    filtreValideur: "Validator", filtrePeriode: "Period", filtreTous: "All",
    tousProj: "All projects", tousSites: "All sites",
    tousValideurs: "All validators", tousExped: "All",
    expFourn: "Supplier", expInterne: "Internal",

    r1Label: "Processed files by project", r1Sub: "Volume and processing rate",
    r2Label: "Document history", r2Sub: "Complete file journal",
    r3Label: "Pending by validator", r3Sub: "Workload per agent",
    r4Label: "Pending files by person", r4Sub: "Detailed assignment view",
    r5Label: "Pending files by date", r5Sub: "Age of active files",
    r6Label: "Average processing time (archived)", r6Sub: "Performance by project",
    r7Label: "Processing detail — archived files", r7Sub: "Full audit",
    r8Label: "Overdue files by validator", r8Sub: "Alerts and escalation",
    r9Label: "Number of rejected files", r9Sub: "Rejection rate by project",
    r10Label: "List of refused files", r10Sub: "Reasons and responsible",
    r11Label: "Documents validated per user", r11Sub: "Individual productivity",

    totalDossiers: "Total files", traites: "Processed", enAttente: "Pending",
    tauxTraitement: "Processing rate", montantTraite: "Processed amount",
    enInstance: "Pending", enRetard: "Overdue", dansDelais: "On time",
    totalRejet: "Total rejected", tauxRejet: "Rejection rate", tauxRejetGlobal: "Global rejection rate",
    totalValides: "Total validated", valeursActifs: "Active validators", montantValide: "Validated amount",
    partTotale: "Total share", activiteRel: "Relative activity",
    delaiMoyen: "Avg. time", joursEq: "Equivalent days", delaiMin: "Min time", delaiMax: "Max time",
    nbRetards: "Overdue count", dossiersConc: "Concerned files", alerte: "Alert",
    nbEtapes: "Steps", statFinal: "Final status", clotureDate: "Closing date",
    depotDate: "Submission date", durée: "Duration", anciennete: "Age",
    actionRequise: "Action required", aucunRetard: "No overdue files",
    bailleur: "Donor", codePrj: "Code",

    nomType: "Type name", icone: "Icon", confType: "Confidential",
    projetsType: "Projects", sitesType: "Sites", nbEtapesType: "Steps count",

    connexion: "Login", seConnecter: "Sign in",
    identifiant: "Username", motDePasse2: "Password",
    comptesDemo: "Demo accounts",
    retourPortail: "← Back to supplier portal",
    gestionDoc: "Document Management & Finance",
    loginDesc: "Sign in to access your workspace",
    loginBtn: "Access back-office →",
    loginError: "Incorrect username or password.",

    aucunDonnee: "No data", loading: "Loading…", erreur: "Error",
    selTous: "All", colonne: "Column", valeur: "Value",
    etatSection: "REPORT", sur: "Of", enregistrements: "record(s)",
    oui: "Yes", non: "No",
    rfEnCours: "Suppl. In progress", rfValides: "Suppl. Approved", rfRefuses: "Suppl. Rejected",
    check: "✓", confidRefuses: "Confid. Rejected",
  },
};

/** Helper: get translation key for current language */
export function tl(lang, key) {
  return T[lang]?.[key] ?? T["fr"]?.[key] ?? key;
}

/** Quick alias: returns object with all keys for given lang */
export function useT(lang) {
  return T[lang] || T["fr"];
}
