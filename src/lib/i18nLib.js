"use client";
/* ═══════════════════════════════════════════════════════
   SoftLibrary — Internationalisation (FR / EN)
   ─────────────────────────────────────────────────────
   Usage :  import { useTLib } from '../data/i18nLib';
            const t = useTLib(lang);   // t.dashboard, t.documents …
═══════════════════════════════════════════════════════ */

export const LANGS = ["fr", "en"];

export const TLib = {
  fr: {
    /* ── App ── */
    appName: "SoftLibrary", appDesc: "Gestion des archives physiques",

    /* ── Navigation / Sidebar ── */
    dashboard: "Tableau de bord",
    secArchives: "Archives", secGestion: "Gestion", secPilotage: "Pilotage",
    documents: "Documents", contenants: "Contenants", emplacements: "Emplacements",
    mouvements: "Mouvements", consultations: "Consultations", courrier: "Courrier",
    inventaire: "Inventaire", cycleVie: "Cycle de vie", visionSynthetique: "Vision synthétique",
    gestionDocumentaire: "Gestion documentaire", integrationGED: "Intégration GED",
    secEquipements: "Équipements", equipementsMFP: "Multifonctions (MFP)",
    administration: "Administration",

    /* ── Topbar ── */
    recherchePlaceholder: "Rechercher document, référence…",
    langue: "Langue",
    notifications: "Notifications",
    deconnexion: "Déconnexion",
    retourAccueil: "← Accueil",

    /* ── Actions communes ── */
    nouveau: "Nouveau", ajouter: "Ajouter", modifier: "Modifier",
    supprimer: "Supprimer", enregistrer: "Enregistrer", annuler: "Annuler",
    fermer: "Fermer", retour: "Retour", confirmer: "Confirmer",
    valider: "Valider", rejeter: "Rejeter", rechercher: "Rechercher",
    filtrer: "Filtrer", reinitialiser: "Réinitialiser", imprimer: "Imprimer",
    telecharger: "Télécharger", exporter: "Exporter", exportPdf: "Exporter PDF",
    exportExcel: "Exporter Excel", copier: "Copier", coller: "Coller",
    tout: "Tout", aucun: "Aucun", voir: "Voir", ouvrir: "Ouvrir",
    appliquer: "Appliquer", sauvegarder: "Sauvegarder",
    oui: "Oui", non: "Non", ok: "OK",

    /* ── Tableau / Liste ── */
    reference: "Référence", titre: "Titre", type: "Type", categorie: "Catégorie",
    service: "Service", date: "Date", statut: "Statut", actions: "Actions",
    auteur: "Auteur", montant: "Montant", description: "Description",
    aucunResultat: "Aucun résultat", chargement: "Chargement…",
    totalDocs: "document(s) au total", filtresActifs: "filtre(s) actif(s)",
    lignesParPage: "Lignes par page", page: "Page", de: "de", sur: "sur",
    trierPar: "Trier par", recherche: "Recherche", filtres: "Filtres",
    colonnes: "Colonnes", vueTable: "Vue tableau", vueGrille: "Vue grille",

    /* ── Statuts documents ── */
    statDisponible: "Disponible", statEnConsultation: "En consultation",
    statEnTransfert: "En transfert", statArchive: "Archivé",
    statArchivageInter: "Archivage intermédiaire", statArchivageDef: "Archivage définitif",
    statDetruit: "Détruit", statElimine: "Éliminé",
    statEnRetard: "En retard", statRetardCritique: "Retard critique",
    statRetourne: "Retourné", statEnCours: "En cours",
    statValide: "Validé", statRefuse: "Refusé", statEnAttente: "En attente",
    statReserve: "Réservé", statValidationN1: "Validation N1",

    /* ── Confidentialité ── */
    confPublic: "Public", confInterne: "Interne",
    confConfidentiel: "Confidentiel", confSecret: "Secret",
    confidentialite: "Confidentialité",

    /* ── Documents (LibDocuments) ── */
    docPhysiques: "Documents physiques",
    creerDocument: "Créer un document",
    ficheDocument: "Fiche document",
    ongletInfo: "Informations", ongletMeta: "Métadonnées",
    ongletVersions: "Versions", ongletIndexation: "Indexation",
    ongletApercu: "Aperçu",
    cote: "Cote", codeBarres: "Code-barres", emetteur: "Émetteur",
    dateDocument: "Date document", serviceProducteur: "Service producteur",
    emplacement: "Emplacement", contenantPhysique: "Contenant physique",
    lienNumerique: "Lien numérique", nonNumerise: "Non numérisé",
    nonRange: "Non rangé dans un contenant",
    motsCles: "Mots-clés", aucunMotCle: "Aucun mot-clé",
    numClassement: "Numéro de classement",
    contenuOCR: "Contenu OCR extrait",
    etiquette: "Étiquette", historique: "Historique", versions: "Versions",
    metadonneesDyn: "Métadonnées dynamiques",
    aucuneMetadonnee: "Aucune métadonnée configurée pour ce type",
    champsManquants: "Champs manquants", metaAbsentes: "Métadonnées absentes",

    /* ── Aperçu PDF ── */
    apercuDoc: "Aperçu", genRenduPdf: "Génération du rendu PDF",
    chargApercu: "Chargement de l'aperçu…",
    zoom: "Zoom", reinitZoom: "Réinitialiser",
    contrat: "CONTRAT", facture: "FACTURE", noteService: "NOTE DE SERVICE",
    procesVerbal: "PROCÈS-VERBAL", correspondance: "CORRESPONDANCE",
    dossierClient: "DOSSIER CLIENT", dossierRH: "DOSSIER DU PERSONNEL",
    rapportAudit: "RAPPORT D'AUDIT", docTechnique: "DOCUMENT TECHNIQUE",
    registreOfficiel: "REGISTRE OFFICIEL",
    objetContrat: "Article 1 — Objet du contrat",
    dureeConditions: "Article 2 — Durée et conditions",
    obligationsParties: "Article 3 — Obligations des parties",
    pourSoftwell: "Pour Softwell Madagascar", pourCocontractant: "Pour le co-contractant",
    directeurGeneral: "Le Directeur Général",
    signatureCachet: "Signature et cachet",
    designation: "Désignation", quantite: "Qté", prixUnit: "P.U.", montantCol: "Montant",
    totalTTC: "TOTAL TTC", dateEmission: "Date d'émission",
    emetteurFact: "Émetteur", clientDest: "Client / Destinataire",
    fraisTraitement: "Frais de traitement",
    participants: "Participants", ordreDuJour: "Ordre du jour",
    deliberations: "Délibérations", resolutions: "Résolutions adoptées",
    presidentSeance: "Le Président", secretaireSeance: "Le Secrétaire de séance",
    nRef: "N/Réf", alAttentionDe: "À l'attention de", objet: "Objet",
    formulePolitesse: "Nous restons à votre entière disposition",
    piecesAuDossier: "Pièces au dossier", observations: "Observations",
    docConfidentiel: "⚠ Ce dossier est strictement confidentiel",
    resumeExecutif: "1. Résumé exécutif", constatsObs: "2. Constats et observations",
    recommandations: "3. Recommandations", conclusion: "4. Conclusion",
    contenuRegistre: "Contenu du registre", valeurLegale: "Ce document a valeur légale",
    dureeConservation: "Durée de conservation",

    /* ── Contenants (LibContenants) ── */
    gestionContenants: "Gestion des contenants",
    creerContenant: "Créer un contenant",
    typeContenant: "Type contenant",
    boite: "Boîte", carton: "Carton", dossier: "Dossier", classeur: "Classeur",
    capacite: "Capacité", contenu: "Contenu", remplissage: "Remplissage",
    ouvert: "Ouvert", ferme: "Fermé", scelle: "Scellé", transit: "Transit",
    contenantParent: "Contenant parent",
    documentsContenus: "Documents contenus",
    sousContenants: "Sous-contenants",

    /* ── Emplacements (LibEmplacements) ── */
    gestionEmplacements: "Gestion des emplacements",
    creerEmplacement: "Créer un emplacement",
    batiment: "Bâtiment", etage: "Étage", salle: "Salle", site: "Site",
    typeEmplacement: "Type emplacement",
    salleArchive: "Salle d'archive", armoire: "Armoire",
    classeurRotatif: "Classeur rotatif", compactus: "Compactus",
    occupation: "Occupation", capaciteRestante: "Capacité restante",

    /* ── Mouvements (LibMouvements) ── */
    journalMouvements: "Journal des mouvements",
    deplacement: "Déplacement", entree: "Entrée", sortie: "Sortie",
    affectation: "Affectation", retourMvt: "Retour",
    de: "De", vers: "Vers", parAuteur: "Par",

    /* ── Consultations (LibConsultations) ── */
    gestionConsultations: "Gestion des consultations",
    nouvelleDemande: "Nouvelle demande",
    demandeur: "Demandeur", dateConsultation: "Date consultation",
    dateRetourPrevue: "Date retour prévue", dateRetour: "Date retour",
    priorite: "Priorité", haute: "Haute", normale: "Normale", urgente: "Urgente",
    enRetardLabel: "En retard", joursRetard: "jour(s) de retard",
    retournee: "Retournée",

    /* ── Courrier (LibCourrier) ── */
    gestionCourrier: "Gestion du courrier",
    courrierEntrant: "Courrier entrant", courrierSortant: "Courrier sortant",
    courrierInterne: "Courrier interne",
    expediteur: "Expéditeur", destinataire: "Destinataire",
    dateReception: "Date réception", dateEnvoi: "Date envoi",
    nature: "Nature", prioriteCourrier: "Priorité",

    /* ── Inventaire (LibInventaire) ── */
    gestionInventaire: "Gestion de l'inventaire",
    campagneInventaire: "Campagne d'inventaire",
    theorieVsRealite: "Théorie vs réalité",
    correctionAnomalies: "Correction d'anomalies",
    rapportEcarts: "Rapport d'écarts",
    anomalies: "Anomalies", ecarts: "Écarts",
    docTrouve: "Trouvé", docManquant: "Manquant", docExcedent: "Excédentaire",

    /* ── Cycle de vie (LibCycleVie) ── */
    cycleDeVie: "Cycle de vie documentaire",
    dureeActiveLabel: "Durée active", dureeInterLabel: "Durée intermédiaire",
    sortFinal: "Sort final", conservation: "Conservation",
    destruction: "Destruction", tri: "Tri",
    echeance: "Échéance", procheEcheance: "Proche échéance",

    /* ── Intégration GED (LibIntegrationGED) ── */
    integrationGEDTitle: "Intégration GED",
    dashboardGED: "Dashboard", liaisonGED: "Liaison",
    numerisation: "Numérisation", incoherences: "Incohérences",
    rechercheUnifiee: "Recherche unifiée", versementNum: "Versement numérique",
    docLie: "Lié", docNonLie: "Non lié",

    /* ── Équipements MFP (LibMFP) ── */
    mfpTitle: "Équipements Multifonctions",
    mfpSubtitle: "Connexion, numérisation et indexation automatique",
    mfpDashboard: "Tableau de bord", mfpAppareils: "Appareils",
    mfpAssociations: "Associations", mfpBoiteScan: "Boîte de scan",
    mfpJournal: "Journal", mfpParams: "Paramètres",
    mfpEnLigne: "En ligne", mfpAttention: "Attention", mfpHorsLigne: "Hors ligne",
    mfpAjouterMFP: "Ajouter MFP", mfpTesterAjouter: "Tester & ajouter",
    mfpAppareilsConnectes: "Appareils connectés", mfpScansAujourdhui: "Scans aujourd'hui",
    mfpAValider: "À valider", mfpConfianceOCR: "Confiance OCR moy.",
    mfpEtatEquipements: "État des équipements", mfpDerniersScans: "Derniers scans reçus",
    mfpProtocole: "Protocole", mfpMarque: "Marque", mfpAdresseIP: "Adresse IP",
    mfpSite: "Site", mfpAuthentification: "Authentification", mfpPort: "Port",
    mfpNiveauxToner: "Niveaux toner", mfpPapier: "Papier",
    mfpFormatsSupp: "Formats supportés", mfpUtilisateursAssocies: "Utilisateurs associés",
    mfpDerniereErreur: "Dernière erreur", mfpNomAppareil: "Nom de l'appareil",
    mfpModeAuth: "Mode d'authentification", mfpCompteCopieur: "Compte copieur",
    mfpBadge: "Badge", mfpDernierScan: "Dernier scan", mfpTotalScans: "Total scans",
    mfpValiderCreerFiche: "Valider & créer fiche", mfpRejeter: "Rejeter",
    mfpMetadonneesOCR: "Métadonnées extraites (OCR)",
    mfpExtractionAuto: "Extraction automatique — Vérifiez et corrigez si nécessaire",
    mfpTypeDetecte: "Type détecté", mfpFournisseur: "Fournisseur / Émetteur",
    mfpReference: "Référence", mfpMontant: "Montant",
    mfpClassifSuggeree: "Classification suggérée",
    mfpJournalOps: "Journal des opérations", mfpEntrees: "entrées",
    mfpGeneral: "Général", mfpProtocoleSecurite: "Protocoles & Sécurité",
    mfpCompatibilite: "Compatibilité constructeurs", mfpCompatible: "Compatible",
    mfpIntervalPing: "Intervalle de ping (heartbeat)",
    mfpDossierReception: "Dossier de réception scan",
    mfpFormatDefaut: "Format scan par défaut", mfpResolutionDefaut: "Résolution par défaut",
    mfpOCRAuto: "OCR automatique", mfpRectoVersoDefaut: "Recto-verso par défaut",

    /* ── États & KPI (LibReporting) ── */
    etatsKpi: "États & KPI",
    totalDocuments: "Total documents", documentsActifs: "Actifs",
    documentsArchives: "Archivés", documentsDetruits: "Détruits",
    tauxOccupation: "Taux d'occupation",
    consultationsMois: "Consultations ce mois", retardsRetour: "Retards retour",
    prochesEcheance: "Proches échéance", destructionsPlanif: "Destructions planifiées",
    repartitionType: "Répartition par type documentaire",
    statutDocuments: "Statut des documents",
    volumeParPeriode: "Volume créé par période",
    previsionSaturation: "Prévision saturation",
    capaciteRestanteKpi: "Capacité restante",
    croissanceEstimee: "Croissance estimée",
    activiteParSite: "Activité par site",
    detailOccupation: "Détail occupation par emplacement",
    tendancesUtilisation: "Tendances d'utilisation des archives",
    vsMoisPrec: "vs mois préc.",
    tauxNumerisation: "Taux numérisation",
    qualiteSaisie: "Qualité de saisie", completudeChampsOblig: "Complétude des champs obligatoires",
    conformiteMeta: "Conformité métadonnées", remplissageMetaType: "Remplissage des métadonnées par type",
    couverturePhysique: "Couverture physique", docsAvecEmplacement: "Documents avec emplacement assigné",
    sansIndexation: "Sans indexation", sansEmplacement: "Sans emplacement",
    doublonsPotentiels: "Doublons potentiels", sensiblesRestreints: "Sensibles / Restreints",
    docsParService: "Documents créés par service", docsParType: "Documents par type documentaire",
    indicateursRecents: "Indicateurs récents", modifies30j: "Modifiés < 30 jours",
    avecGedLie: "Avec GED lié", sansReference: "Sans référence",
    sansIndexationComplete: "Documents sans indexation complète",
    sansEmplacementPhysique: "Documents sans emplacement physique",
    tousEmplacementAssigne: "Tous les documents ont un emplacement assigné",
    docsRecemmentModifies: "Documents récemment modifiés (< 30 jours)",
    aucunDocModifie: "Aucun document modifié dans les 30 derniers jours",
    docsSensibles: "Documents sensibles / restreints",
    aucunSensible: "Aucun document sensible détecté",
    syntheseVersions: "Synthèse versions & évolutions",
    docsUniques: "Documents uniques", versionPhysiqueSeule: "Version physique seule",
    ratioNumerise: "Ratio numérisé",
    groupeDoublons: "Groupe", docsSimilaires: "documents similaires",
    critique: "Critique", eleve: "Élevé", normal: "Normal", attention: "Attention",
    mois3: "3 mois", mois6: "6 mois", mois12: "12 mois",
    unites: "unités", docsMois: "docs/mois",

    /* ── Contenants KPI ── */
    tbContenants: "Tableau de bord contenants",
    contenantsDesc: "Boîtes, dossiers, cartons — stockage & logistique",
    parType: "Par type", pleins: "Pleins", partiels: "Partiellement remplis",
    vides: "Vides", tauxMoyenRemplissage: "Taux moyen remplissage",
    contenantsScelles: "Scellés", deplacesRecemment: "Déplacés récemment",
    nonLocalises: "Non localisés",
    optimisationStockage: "Optimisation du stockage",
    rotationContenants: "Rotation des contenants",
    anomaliesLogistiques: "Détection anomalies logistiques",

    /* ── Administration (LibAdmin) ── */
    admin: "Administration",
    parametrage: "Paramétrage", typesDocumentaires: "Types documentaires",
    planClassement: "Plan de classement", utilisateurs: "Utilisateurs",
    reglesConservation: "Règles de conservation", permissions: "Permissions",
    journalAudit: "Journal d'audit", sauvegardeRestauration: "Sauvegarde & restauration",
    importExport: "Import / Export", parametresGeneraux: "Paramètres généraux",

    /* ── Dashboard (LibDashboard) ── */
    bienvenue: "Bienvenue",
    aperçuGlobal: "Aperçu global de vos archives physiques",
    archivesRecentes: "Archives récentes",
    alertes: "Alertes",
    activiteRecente: "Activité récente",
    espaceStockage: "Espace de stockage",

    /* ── Commun dates / formatage ── */
    aujourdHui: "Aujourd'hui", hier: "Hier", cetteSemaine: "Cette semaine",
    ceMois: "Ce mois", dernierMois: "Dernier mois",
    jan:"Jan",fev:"Fév",mar:"Mar",avr:"Avr",mai:"Mai",juin:"Juin",
    juil:"Juil",aout:"Août",sep:"Sep",oct:"Oct",nov:"Nov",dec:"Déc",
    an: "an(s)", moisLabel: "mois", jour: "jour(s)",

    /* ── Messages ── */
    confirmSupprimer: "Êtes-vous sûr de vouloir supprimer ?",
    enregistreSucces: "Enregistré avec succès",
    modifieSucces: "Modifié avec succès",
    supprimeSucces: "Supprimé avec succès",
    erreurGeneral: "Une erreur est survenue",
    aucuneDonnee: "Aucune donnée",

    /* ── SidebarLib specific ── */
    softLibrary: "Soft Library",
    versionApp: "v2.0 · 2025",
    reduireSidebar: "Réduire",
  },

  en: {
    /* ── App ── */
    appName: "SoftLibrary", appDesc: "Physical archives management",

    /* ── Navigation / Sidebar ── */
    dashboard: "Dashboard",
    secArchives: "Archives", secGestion: "Management", secPilotage: "Monitoring",
    documents: "Documents", contenants: "Containers", emplacements: "Locations",
    mouvements: "Movements", consultations: "Consultations", courrier: "Mail",
    inventaire: "Inventory", cycleVie: "Lifecycle", visionSynthetique: "Overview",
    gestionDocumentaire: "Document management", integrationGED: "DMS Integration",
    secEquipements: "Equipment", equipementsMFP: "Multi-Function (MFP)",
    administration: "Administration",

    /* ── Topbar ── */
    recherchePlaceholder: "Search document, reference…",
    langue: "Language",
    notifications: "Notifications",
    deconnexion: "Logout",
    retourAccueil: "← Home",

    /* ── Common actions ── */
    nouveau: "New", ajouter: "Add", modifier: "Edit",
    supprimer: "Delete", enregistrer: "Save", annuler: "Cancel",
    fermer: "Close", retour: "Back", confirmer: "Confirm",
    valider: "Validate", rejeter: "Reject", rechercher: "Search",
    filtrer: "Filter", reinitialiser: "Reset", imprimer: "Print",
    telecharger: "Download", exporter: "Export", exportPdf: "Export PDF",
    exportExcel: "Export Excel", copier: "Copy", coller: "Paste",
    tout: "All", aucun: "None", voir: "View", ouvrir: "Open",
    appliquer: "Apply", sauvegarder: "Save",
    oui: "Yes", non: "No", ok: "OK",

    /* ── Table / List ── */
    reference: "Reference", titre: "Title", type: "Type", categorie: "Category",
    service: "Department", date: "Date", statut: "Status", actions: "Actions",
    auteur: "Author", montant: "Amount", description: "Description",
    aucunResultat: "No results", chargement: "Loading…",
    totalDocs: "total document(s)", filtresActifs: "active filter(s)",
    lignesParPage: "Rows per page", page: "Page", de: "of", sur: "of",
    trierPar: "Sort by", recherche: "Search", filtres: "Filters",
    colonnes: "Columns", vueTable: "Table view", vueGrille: "Grid view",

    /* ── Document statuses ── */
    statDisponible: "Available", statEnConsultation: "In consultation",
    statEnTransfert: "In transfer", statArchive: "Archived",
    statArchivageInter: "Intermediate archiving", statArchivageDef: "Final archiving",
    statDetruit: "Destroyed", statElimine: "Disposed",
    statEnRetard: "Overdue", statRetardCritique: "Critical delay",
    statRetourne: "Returned", statEnCours: "In progress",
    statValide: "Validated", statRefuse: "Rejected", statEnAttente: "Pending",
    statReserve: "Reserved", statValidationN1: "Level 1 validation",

    /* ── Confidentiality ── */
    confPublic: "Public", confInterne: "Internal",
    confConfidentiel: "Confidential", confSecret: "Secret",
    confidentialite: "Confidentiality",

    /* ── Documents (LibDocuments) ── */
    docPhysiques: "Physical documents",
    creerDocument: "Create document",
    ficheDocument: "Document details",
    ongletInfo: "Information", ongletMeta: "Metadata",
    ongletVersions: "Versions", ongletIndexation: "Indexing",
    ongletApercu: "Preview",
    cote: "Shelf mark", codeBarres: "Barcode", emetteur: "Issuer",
    dateDocument: "Document date", serviceProducteur: "Producing department",
    emplacement: "Location", contenantPhysique: "Physical container",
    lienNumerique: "Digital link", nonNumerise: "Not digitized",
    nonRange: "Not stored in a container",
    motsCles: "Keywords", aucunMotCle: "No keywords",
    numClassement: "Classification number",
    contenuOCR: "Extracted OCR content",
    etiquette: "Label", historique: "History", versions: "Versions",
    metadonneesDyn: "Dynamic metadata",
    aucuneMetadonnee: "No metadata configured for this type",
    champsManquants: "Missing fields", metaAbsentes: "Missing metadata",

    /* ── PDF Preview ── */
    apercuDoc: "Preview", genRenduPdf: "Generating PDF render",
    chargApercu: "Loading preview…",
    zoom: "Zoom", reinitZoom: "Reset",
    contrat: "CONTRACT", facture: "INVOICE", noteService: "INTERNAL MEMO",
    procesVerbal: "MINUTES", correspondance: "CORRESPONDENCE",
    dossierClient: "CLIENT FILE", dossierRH: "PERSONNEL FILE",
    rapportAudit: "AUDIT REPORT", docTechnique: "TECHNICAL DOCUMENT",
    registreOfficiel: "OFFICIAL REGISTER",
    objetContrat: "Article 1 — Purpose of the contract",
    dureeConditions: "Article 2 — Duration and terms",
    obligationsParties: "Article 3 — Obligations of the parties",
    pourSoftwell: "For Softwell Madagascar", pourCocontractant: "For the co-contractor",
    directeurGeneral: "General Manager",
    signatureCachet: "Signature and stamp",
    designation: "Description", quantite: "Qty", prixUnit: "Unit price", montantCol: "Amount",
    totalTTC: "TOTAL INCL. TAX", dateEmission: "Issue date",
    emetteurFact: "Issuer", clientDest: "Client / Recipient",
    fraisTraitement: "Processing fees",
    participants: "Participants", ordreDuJour: "Agenda",
    deliberations: "Deliberations", resolutions: "Resolutions adopted",
    presidentSeance: "Chairperson", secretaireSeance: "Secretary of the meeting",
    nRef: "Our Ref", alAttentionDe: "Attention", objet: "Subject",
    formulePolitesse: "We remain at your disposal",
    piecesAuDossier: "Documents on file", observations: "Observations",
    docConfidentiel: "⚠ This file is strictly confidential",
    resumeExecutif: "1. Executive summary", constatsObs: "2. Findings and observations",
    recommandations: "3. Recommendations", conclusion: "4. Conclusion",
    contenuRegistre: "Register contents", valeurLegale: "This document has legal standing",
    dureeConservation: "Retention period",

    /* ── Containers (LibContenants) ── */
    gestionContenants: "Container management",
    creerContenant: "Create container",
    typeContenant: "Container type",
    boite: "Box", carton: "Carton", dossier: "Folder", classeur: "Binder",
    capacite: "Capacity", contenu: "Content", remplissage: "Fill rate",
    ouvert: "Open", ferme: "Closed", scelle: "Sealed", transit: "In transit",
    contenantParent: "Parent container",
    documentsContenus: "Contained documents",
    sousContenants: "Sub-containers",

    /* ── Locations (LibEmplacements) ── */
    gestionEmplacements: "Location management",
    creerEmplacement: "Create location",
    batiment: "Building", etage: "Floor", salle: "Room", site: "Site",
    typeEmplacement: "Location type",
    salleArchive: "Archive room", armoire: "Cabinet",
    classeurRotatif: "Rotary filer", compactus: "Compactus",
    occupation: "Occupancy", capaciteRestante: "Remaining capacity",

    /* ── Movements (LibMouvements) ── */
    journalMouvements: "Movement log",
    deplacement: "Move", entree: "Entry", sortie: "Exit",
    affectation: "Assignment", retourMvt: "Return",
    parAuteur: "By",

    /* ── Consultations (LibConsultations) ── */
    gestionConsultations: "Consultation management",
    nouvelleDemande: "New request",
    demandeur: "Requester", dateConsultation: "Consultation date",
    dateRetourPrevue: "Expected return date", dateRetour: "Return date",
    priorite: "Priority", haute: "High", normale: "Normal", urgente: "Urgent",
    enRetardLabel: "Overdue", joursRetard: "day(s) overdue",
    retournee: "Returned",

    /* ── Mail (LibCourrier) ── */
    gestionCourrier: "Mail management",
    courrierEntrant: "Incoming mail", courrierSortant: "Outgoing mail",
    courrierInterne: "Internal mail",
    expediteur: "Sender", destinataire: "Recipient",
    dateReception: "Reception date", dateEnvoi: "Send date",
    nature: "Nature", prioriteCourrier: "Priority",

    /* ── Inventory (LibInventaire) ── */
    gestionInventaire: "Inventory management",
    campagneInventaire: "Inventory campaign",
    theorieVsRealite: "Theory vs reality",
    correctionAnomalies: "Anomaly correction",
    rapportEcarts: "Gap report",
    anomalies: "Anomalies", ecarts: "Gaps",
    docTrouve: "Found", docManquant: "Missing", docExcedent: "Surplus",

    /* ── Lifecycle (LibCycleVie) ── */
    cycleDeVie: "Document lifecycle",
    dureeActiveLabel: "Active period", dureeInterLabel: "Intermediate period",
    sortFinal: "Final disposition", conservation: "Retention",
    destruction: "Destruction", tri: "Sorting",
    echeance: "Deadline", procheEcheance: "Upcoming deadline",

    /* ── DMS Integration (LibIntegrationGED) ── */
    integrationGEDTitle: "DMS Integration",
    dashboardGED: "Dashboard", liaisonGED: "Linking",
    numerisation: "Digitization", incoherences: "Inconsistencies",
    rechercheUnifiee: "Unified search", versementNum: "Digital transfer",
    docLie: "Linked", docNonLie: "Not linked",

    /* ── Multi-Function Printers (LibMFP) ── */
    mfpTitle: "Multi-Function Printers",
    mfpSubtitle: "Connection, scanning & automatic indexing",
    mfpDashboard: "Dashboard", mfpAppareils: "Devices",
    mfpAssociations: "Associations", mfpBoiteScan: "Scan inbox",
    mfpJournal: "Log", mfpParams: "Settings",
    mfpEnLigne: "Online", mfpAttention: "Warning", mfpHorsLigne: "Offline",
    mfpAjouterMFP: "Add MFP", mfpTesterAjouter: "Test & add",
    mfpAppareilsConnectes: "Connected devices", mfpScansAujourdhui: "Scans today",
    mfpAValider: "Pending validation", mfpConfianceOCR: "Avg OCR confidence",
    mfpEtatEquipements: "Device status", mfpDerniersScans: "Recent scans",
    mfpProtocole: "Protocol", mfpMarque: "Brand", mfpAdresseIP: "IP Address",
    mfpSite: "Site", mfpAuthentification: "Authentication", mfpPort: "Port",
    mfpNiveauxToner: "Toner levels", mfpPapier: "Paper",
    mfpFormatsSupp: "Supported formats", mfpUtilisateursAssocies: "Associated users",
    mfpDerniereErreur: "Last error", mfpNomAppareil: "Device name",
    mfpModeAuth: "Authentication mode", mfpCompteCopieur: "Copier account",
    mfpBadge: "Badge", mfpDernierScan: "Last scan", mfpTotalScans: "Total scans",
    mfpValiderCreerFiche: "Validate & create record", mfpRejeter: "Reject",
    mfpMetadonneesOCR: "Extracted metadata (OCR)",
    mfpExtractionAuto: "Auto extraction — Review and correct if needed",
    mfpTypeDetecte: "Detected type", mfpFournisseur: "Supplier / Issuer",
    mfpReference: "Reference", mfpMontant: "Amount",
    mfpClassifSuggeree: "Suggested classification",
    mfpJournalOps: "Operations log", mfpEntrees: "entries",
    mfpGeneral: "General", mfpProtocoleSecurite: "Protocols & Security",
    mfpCompatibilite: "Manufacturer compatibility", mfpCompatible: "Compatible",
    mfpIntervalPing: "Ping interval (heartbeat)",
    mfpDossierReception: "Scan reception folder",
    mfpFormatDefaut: "Default scan format", mfpResolutionDefaut: "Default resolution",
    mfpOCRAuto: "Automatic OCR", mfpRectoVersoDefaut: "Default duplex",

    /* ── Reports & KPI (LibReporting) ── */
    etatsKpi: "Reports & KPIs",
    totalDocuments: "Total documents", documentsActifs: "Active",
    documentsArchives: "Archived", documentsDetruits: "Destroyed",
    tauxOccupation: "Occupancy rate",
    consultationsMois: "Consultations this month", retardsRetour: "Return delays",
    prochesEcheance: "Near deadline", destructionsPlanif: "Planned disposals",
    repartitionType: "Breakdown by document type",
    statutDocuments: "Document status",
    volumeParPeriode: "Volume created per period",
    previsionSaturation: "Saturation forecast",
    capaciteRestanteKpi: "Remaining capacity",
    croissanceEstimee: "Estimated growth",
    activiteParSite: "Activity by site",
    detailOccupation: "Occupancy detail by location",
    tendancesUtilisation: "Archives usage trends",
    vsMoisPrec: "vs prev. month",
    tauxNumerisation: "Digitization rate",
    qualiteSaisie: "Data quality", completudeChampsOblig: "Required field completeness",
    conformiteMeta: "Metadata compliance", remplissageMetaType: "Metadata fill rate by type",
    couverturePhysique: "Physical coverage", docsAvecEmplacement: "Documents with assigned location",
    sansIndexation: "Unindexed", sansEmplacement: "No location",
    doublonsPotentiels: "Potential duplicates", sensiblesRestreints: "Sensitive / Restricted",
    docsParService: "Documents created by department", docsParType: "Documents by type",
    indicateursRecents: "Recent indicators", modifies30j: "Modified < 30 days",
    avecGedLie: "With DMS link", sansReference: "No reference",
    sansIndexationComplete: "Documents without complete indexing",
    sansEmplacementPhysique: "Documents without physical location",
    tousEmplacementAssigne: "All documents have an assigned location",
    docsRecemmentModifies: "Recently modified documents (< 30 days)",
    aucunDocModifie: "No documents modified in the last 30 days",
    docsSensibles: "Sensitive / restricted documents",
    aucunSensible: "No sensitive documents detected",
    syntheseVersions: "Versions & evolution summary",
    docsUniques: "Unique documents", versionPhysiqueSeule: "Physical version only",
    ratioNumerise: "Digitized ratio",
    groupeDoublons: "Group", docsSimilaires: "similar documents",
    critique: "Critical", eleve: "High", normal: "Normal", attention: "Warning",
    mois3: "3 months", mois6: "6 months", mois12: "12 months",
    unites: "units", docsMois: "docs/month",

    /* ── Containers KPI ── */
    tbContenants: "Container dashboard",
    contenantsDesc: "Boxes, folders, cartons — storage & logistics",
    parType: "By type", pleins: "Full", partiels: "Partially filled",
    vides: "Empty", tauxMoyenRemplissage: "Avg. fill rate",
    contenantsScelles: "Sealed", deplacesRecemment: "Recently moved",
    nonLocalises: "Unlocated",
    optimisationStockage: "Storage optimization",
    rotationContenants: "Container rotation",
    anomaliesLogistiques: "Logistics anomaly detection",

    /* ── Administration (LibAdmin) ── */
    admin: "Administration",
    parametrage: "Settings", typesDocumentaires: "Document types",
    planClassement: "Classification plan", utilisateurs: "Users",
    reglesConservation: "Retention rules", permissions: "Permissions",
    journalAudit: "Audit log", sauvegardeRestauration: "Backup & restore",
    importExport: "Import / Export", parametresGeneraux: "General settings",

    /* ── Dashboard (LibDashboard) ── */
    bienvenue: "Welcome",
    aperçuGlobal: "Overview of your physical archives",
    archivesRecentes: "Recent archives",
    alertes: "Alerts",
    activiteRecente: "Recent activity",
    espaceStockage: "Storage space",

    /* ── Common dates / formatting ── */
    aujourdHui: "Today", hier: "Yesterday", cetteSemaine: "This week",
    ceMois: "This month", dernierMois: "Last month",
    jan:"Jan",fev:"Feb",mar:"Mar",avr:"Apr",mai:"May",juin:"Jun",
    juil:"Jul",aout:"Aug",sep:"Sep",oct:"Oct",nov:"Nov",dec:"Dec",
    an: "year(s)", moisLabel: "months", jour: "day(s)",

    /* ── Messages ── */
    confirmSupprimer: "Are you sure you want to delete?",
    enregistreSucces: "Saved successfully",
    modifieSucces: "Updated successfully",
    supprimeSucces: "Deleted successfully",
    erreurGeneral: "An error occurred",
    aucuneDonnee: "No data",

    /* ── SidebarLib specific ── */
    softLibrary: "Soft Library",
    versionApp: "v2.0 · 2025",
    reduireSidebar: "Collapse",
  },
};

/** Get translation for a key */
export function tlLib(lang, key) {
  return TLib[lang]?.[key] ?? TLib["fr"]?.[key] ?? key;
}

/** Get all translations for a language */
export function useTLib(lang) {
  return TLib[lang] || TLib["fr"];
}