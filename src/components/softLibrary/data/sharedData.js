/* ═══════════════════════════════════════════════════════════════
   SOFT LIBRARY — Données partagées (Consultations, Courrier, Mouvements)
   ─────────────────────────────────────────────────────────────
   Architecture :
     SoftDocs (GED numérique) → INIT_DOCS (docs)       = documents numériques
     SoftLibrary (Archives)   → LIB_DOCUMENTS (libDocs) = documents physiques archivés

   Source de vérité documents : LIB_DOCUMENTS dans data.js → AppContext (libDocs)
   Liaison GED : gedDocId dans LIB_DOCUMENTS → INIT_DOCS (SoftDocs GED)
   
   ✓ Consultations, Courrier, Cycle de vie → tous liés aux LIB_DOCUMENTS
   ✓ Pas de copie/fallback — LIB_DOCUMENTS est la seule source
═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════
   TYPES DE DOCUMENTS (Cycle de vie)
═══════════════════════════════════════════════════ */
export const SHARED_DOC_TYPES = [
  { id:'DOC-TYP-01', label:'Contrats',          dureeActive:5, dureeInter:10, sort:'conservation', icon:'📄' },
  { id:'DOC-TYP-02', label:'Factures',           dureeActive:2, dureeInter:8,  sort:'destruction',  icon:'🧾' },
  { id:'DOC-TYP-03', label:'Notes de service',   dureeActive:1, dureeInter:3,  sort:'destruction',  icon:'📋' },
  { id:'DOC-TYP-04', label:'PV Conseil Admin.',  dureeActive:3, dureeInter:10, sort:'conservation', icon:'📝' },
  { id:'DOC-TYP-05', label:'Correspondance',     dureeActive:1, dureeInter:5,  sort:'tri',          icon:'✉️' },
  { id:'DOC-TYP-06', label:'Dossiers clients',   dureeActive:5, dureeInter:10, sort:'conservation', icon:'👥' },
  { id:'DOC-TYP-07', label:'Dossiers RH',        dureeActive:5, dureeInter:30, sort:'conservation', icon:'🗂️' },
  { id:'DOC-TYP-08', label:'Rapports audit',     dureeActive:3, dureeInter:10, sort:'conservation', icon:'📊' },
  { id:'DOC-TYP-09', label:'Plans & Techniques', dureeActive:10,dureeInter:20, sort:'conservation', icon:'📐' },
  { id:'DOC-TYP-10', label:'Registres légaux',   dureeActive:10,dureeInter:30, sort:'conservation', icon:'⚖️' },
];

/* ═══════════════════════════════════════════════════
   EMPLACEMENTS
═══════════════════════════════════════════════════ */
export const SHARED_EMPLACEMENTS = [
  { id:'EMP-001', site:'Siège Analakely', batiment:'Bâtiment Principal', etage:'1', salle:'S-101', nom:'Salle Archives DG',           label:'Salle Archives DG',           type:'salle_archive',     capacite:500, occupe:423, contenu:320, statut:'actif', typeRayonnage:'compactus',
    rayonnages:[
      { nom:'Ray. A1', code:'A1', capacite:125, occupe:118, niveaux:[{nom:'Niv. 1',code:'A1-1',capacite:25,occupe:24},{nom:'Niv. 2',code:'A1-2',capacite:25,occupe:23},{nom:'Niv. 3',code:'A1-3',capacite:25,occupe:22},{nom:'Niv. 4',code:'A1-4',capacite:25,occupe:25},{nom:'Niv. 5',code:'A1-5',capacite:25,occupe:24}] },
      { nom:'Ray. A2', code:'A2', capacite:125, occupe:110 },
      { nom:'Ray. B1', code:'B1', capacite:125, occupe:100 },
      { nom:'Ray. B2', code:'B2', capacite:125, occupe:95 },
    ] },
  { id:'EMP-002', site:'Siège Analakely', batiment:'Bâtiment Principal', etage:'1', salle:'S-102', nom:'Bureau RH — Dossiers actifs', label:'Bureau RH — Dossiers actifs', type:'armoire',           capacite:300, occupe:285, contenu:250, statut:'actif', typeRayonnage:'securise',
    rayonnages:[
      { nom:'Coffre A', code:'CA', capacite:100, occupe:98 },
      { nom:'Coffre B', code:'CB', capacite:100, occupe:95 },
      { nom:'Étagère C', code:'EC', capacite:100, occupe:92 },
    ] },
  { id:'EMP-003', site:'Siège Analakely', batiment:'Bâtiment Principal', etage:'2', salle:'S-201', nom:'Local Comptabilité',          label:'Local Comptabilité',          type:'salle_archive',     capacite:400, occupe:245, contenu:280, statut:'actif', typeRayonnage:'standard' },
  { id:'EMP-004', site:'Siège Analakely', batiment:'Annexe',             etage:'RDC',salle:'A-001', nom:'Secrétariat DG',              label:'Secrétariat DG',              type:'armoire',           capacite:200, occupe:120, contenu:65,  statut:'actif' },
  { id:'EMP-005', site:'Siège Analakely', batiment:'Annexe',             etage:'1', salle:'A-101', nom:'Bureau Juridique',             label:'Bureau Juridique',             type:'classeur_rotatif',  capacite:350, occupe:190, contenu:150, statut:'actif', typeRayonnage:'compactus' },
  { id:'EMP-006', site:'Site Ankorondrano',batiment:'Entrepôt Nord',     etage:'RDC',salle:'N-001', nom:'Réserve Archives Interméd.',   label:'Réserve Archives Interméd.',   type:'salle_archive',     capacite:2000,occupe:1450,contenu:1500,statut:'actif', typeRayonnage:'compactus',
    rayonnages:[
      { nom:'Travée 1', code:'T1', capacite:500, occupe:420 },
      { nom:'Travée 2', code:'T2', capacite:500, occupe:380 },
      { nom:'Travée 3', code:'T3', capacite:500, occupe:350 },
      { nom:'Travée 4', code:'T4', capacite:500, occupe:300 },
    ] },
  { id:'EMP-007', site:'Site Ankorondrano',batiment:'Entrepôt Nord',     etage:'1', salle:'N-101', nom:'Dépôt Archives Définitives',   label:'Dépôt Archives Définitives',   type:'depot',            capacite:1500,occupe:980, contenu:3200,statut:'actif' },
  { id:'EMP-008', site:'Siège Analakely',  batiment:'Bâtiment Principal', etage:'2', salle:'S-202', nom:'Coffre-fort DG',               label:'Coffre-fort DG',               type:'coffre',           capacite:50,  occupe:22,  contenu:22,  statut:'actif' },
  { id:'EMP-009', site:'Agence Tamatave',  batiment:'Bureau régional',   etage:'RDC',salle:'T-001', nom:'Bureau régional Tamatave',     label:'Bureau régional Tamatave',     type:'armoire',           capacite:250, occupe:180, contenu:180, statut:'actif' },
  { id:'EMP-010', site:'Siège Analakely',  batiment:'Bâtiment Principal', etage:'RDC',salle:'S-010', nom:'Salle numérisation',           label:'Salle numérisation',           type:'salle_technique',  capacite:50,  occupe:10,  contenu:10,  statut:'actif' },
];

/* ═══════════════════════════════════════════════════
   UTILISATEURS
═══════════════════════════════════════════════════ */
export const SHARED_USERS = [
  { id:'U001', nom:'Rakoto Jean-Baptiste',  service:'Direction Générale',   role:'Chef de Projet',    init:'RJ' },
  { id:'U002', nom:'Randria Marie-Claire',  service:'Finances',             role:'Resp. Financier',   init:'RM' },
  { id:'U003', nom:'Razafy Pierre',         service:'Direction Générale',   role:'DAF',               init:'RP' },
  { id:'U004', nom:'Rasoamanarivo Hanta',   service:'Finances',             role:'Comptable Senior',  init:'RH' },
  { id:'U005', nom:'Andriamananjara Lova',  service:'Ressources Humaines',  role:'Ordonnateur',       init:'AL' },
  { id:'U006', nom:'Ratsimbazafy Noro',     service:'Juridique',            role:'Gestionnaire Docs', init:'RN' },
  { id:'U007', nom:'Rajaonarivelo Fidy',    service:'Service Technique',    role:'Ingénieur',         init:'RF' },
];

/* ═══════════════════════════════════════════════════
   HELPERS: résolution de documents
═══════════════════════════════════════════════════ */

/** Résoudre le titre d'un document archive (via props = enrichedDocs du Backoffice) */
export function resolveDocTitre(docId, propsDocuments = []) {
  const fromProps = propsDocuments.find(d => d.id === docId);
  if (fromProps) return fromProps.titre || fromProps.id;
  return docId || '—';
}

/** Résoudre un document complet */
export function resolveDoc(docId, propsDocuments = []) {
  return propsDocuments.find(d => d.id === docId) || null;
}

/* ═══════════════════════════════════════════════════
   CONSULTATIONS (12 consultations — schéma complet)
   
   Statuts : brouillon, en_attente, validation_n1, validation_n2,
             approuvee, en_cours, en_retard, retard_critique,
             retournee, refusee, reservee, annulee
   Types   : consultation, interne, externe, numerisation
   Priorité: normale, haute, urgente
═══════════════════════════════════════════════════ */
export const SHARED_CONSULTATIONS = [

  /* ── Retournées (4) ── */
  { id:'CONS-2025-0001', docId:'LIB-2025-00007', demandeurId:'U001', demandeur:'Rakoto Jean-Baptiste', service:'Direction Générale',
    type:'consultation', priorite:'haute', dateConsultation:'2025-02-20', dateRetourPrevue:'2025-02-27', dateRetour:'2025-02-27',
    motif:'Vérification clauses prestation JIRAMA', statut:'retournee', observations:'RAS — clauses conformes',
    validations:[{niveau:1,type:'visa',valideur:'Razafy Pierre',statut:'approuve',date:'2025-02-20 09:00',commentaire:'OK — prioritaire'}],
    historique:[{date:'2025-02-20 08:30',action:'Demande créée',auteur:'Rakoto Jean-Baptiste'},{date:'2025-02-20 09:00',action:'Validée N1',auteur:'Razafy Pierre'},{date:'2025-02-20 10:00',action:'Sortie',auteur:'Ratsimbazafy Noro'},{date:'2025-02-27 14:00',action:'Retour confirmé',auteur:'Ratsimbazafy Noro'}] },

  { id:'CONS-2025-0003', docId:'LIB-2024-00002', demandeurId:'U003', demandeur:'Razafy Pierre', service:'Direction Générale',
    type:'consultation', priorite:'normale', dateConsultation:'2025-02-18', dateRetourPrevue:'2025-02-25', dateRetour:'2025-02-25',
    motif:'Préparation CA Q1 2025', statut:'retournee', observations:'Copie certifiée effectuée',
    validations:[{niveau:1,type:'visa',valideur:'Rakoto Jean-Baptiste',statut:'approuve',date:'2025-02-18 10:00',commentaire:''}],
    historique:[{date:'2025-02-18 09:00',action:'Demande créée',auteur:'Razafy Pierre'},{date:'2025-02-25 16:00',action:'Retour',auteur:'Ratsimbazafy Noro'}] },

  { id:'CONS-2025-0005', docId:'LIB-2025-00004', demandeurId:'U003', demandeur:'Razafy Pierre', service:'Direction Générale',
    type:'interne', priorite:'haute', dateConsultation:'2025-02-10', dateRetourPrevue:'2025-02-15', dateRetour:'2025-02-15',
    motif:'Suivi recommandations audit', statut:'retournee', observations:'5/8 recommandations implémentées',
    validations:[{niveau:1,type:'visa',valideur:'Rakoto Jean-Baptiste',statut:'approuve',date:'2025-02-10 08:30',commentaire:'Urgent — audit'}],
    historique:[{date:'2025-02-10 08:00',action:'Demande créée',auteur:'Razafy Pierre'},{date:'2025-02-15 17:00',action:'Retour',auteur:'Razafy Pierre'}] },

  { id:'CONS-2025-0007', docId:'LIB-2024-00001', demandeurId:'U001', demandeur:'Rakoto Jean-Baptiste', service:'Direction Générale',
    type:'consultation', priorite:'normale', dateConsultation:'2025-02-15', dateRetourPrevue:'2025-02-20', dateRetour:'2025-02-20',
    motif:'Bilan GEZANI pour rapport annuel', statut:'retournee', observations:'Données intégrées au rapport 2024',
    validations:[{niveau:1,type:'visa',valideur:'Razafy Pierre',statut:'approuve',date:'2025-02-15 09:00',commentaire:''}],
    historique:[{date:'2025-02-15 08:30',action:'Demande créée',auteur:'Rakoto Jean-Baptiste'},{date:'2025-02-20 11:00',action:'Retour',auteur:'Rakoto Jean-Baptiste'}] },

  /* ── En consultation / en cours (4) ── */
  { id:'CONS-2025-0002', docId:'LIB-2025-00006', demandeurId:'U002', demandeur:'Randria Marie-Claire', service:'Finances',
    type:'consultation', priorite:'haute', dateConsultation:'2025-02-22', dateRetourPrevue:'2025-03-01',
    motif:'Analyse dossier client BNI pour renouvellement', statut:'en_cours', observations:'Audit en cours — 3 pièces manquantes',
    dateSortie:'2025-02-22 14:00', detenteur:'Randria Marie-Claire', emplacementActuel:'Bureau Finances',
    validations:[{niveau:1,type:'visa',valideur:'Razafy Pierre',statut:'approuve',date:'2025-02-22 10:00',commentaire:'OK — dossier sensible'}],
    historique:[{date:'2025-02-22 09:30',action:'Demande créée',auteur:'Randria Marie-Claire'},{date:'2025-02-22 10:00',action:'Validée N1',auteur:'Razafy Pierre'},{date:'2025-02-22 14:00',action:'Sortie',auteur:'Ratsimbazafy Noro'}] },

  { id:'CONS-2025-0004', docId:'LIB-2024-00003', demandeurId:'U006', demandeur:'Ratsimbazafy Noro', service:'Juridique',
    type:'interne', priorite:'normale', dateConsultation:'2025-02-25', dateRetourPrevue:'2025-03-04',
    motif:'Révision bail — clause résiliation', statut:'en_cours', observations:'En attente avis juridique',
    dateSortie:'2025-02-25 11:00', detenteur:'Ratsimbazafy Noro', emplacementActuel:'Bureau Juridique',
    validations:[{niveau:1,type:'visa',valideur:'Razafy Pierre',statut:'approuve',date:'2025-02-25 09:00',commentaire:''}],
    historique:[{date:'2025-02-25 08:30',action:'Demande créée',auteur:'Ratsimbazafy Noro'},{date:'2025-02-25 11:00',action:'Sortie',auteur:'Ratsimbazafy Noro'}] },

  { id:'CONS-2025-0006', docId:'LIB-2025-00008', demandeurId:'U004', demandeur:'Rasoamanarivo Hanta', service:'Finances',
    type:'consultation', priorite:'urgente', dateConsultation:'2025-02-24', dateRetourPrevue:'2025-02-28',
    motif:'Rapprochement facture / bon commande', statut:'en_retard', observations:'Écart de 125.000 MGA identifié', joursRetard:2,
    dateSortie:'2025-02-24 15:00', detenteur:'Rasoamanarivo Hanta', emplacementActuel:'Bureau Comptabilité',
    validations:[{niveau:1,type:'visa',valideur:'Randria Marie-Claire',statut:'approuve',date:'2025-02-24 10:00',commentaire:'Urgent — contrôle fiscal'}],
    historique:[{date:'2025-02-24 09:00',action:'Demande créée',auteur:'Rasoamanarivo Hanta'},{date:'2025-02-24 15:00',action:'Sortie',auteur:'Ratsimbazafy Noro'}] },

  { id:'CONS-2025-0008', docId:'LIB-2025-00005', demandeurId:'U005', demandeur:'Andriamananjara Lova', service:'Ressources Humaines',
    type:'interne', priorite:'normale', dateConsultation:'2025-02-26', dateRetourPrevue:'2025-03-05',
    motif:'Vérification planning congés Service Technique', statut:'en_cours', observations:'',
    dateSortie:'2025-02-26 10:00', detenteur:'Andriamananjara Lova', emplacementActuel:'Bureau RH',
    validations:[{niveau:1,type:'visa',valideur:'Razafy Pierre',statut:'approuve',date:'2025-02-26 08:30',commentaire:''}],
    historique:[{date:'2025-02-26 08:00',action:'Demande créée',auteur:'Andriamananjara Lova'},{date:'2025-02-26 10:00',action:'Sortie',auteur:'Ratsimbazafy Noro'}] },

  /* ── En attente / validation (2) ── */
  { id:'CONS-2025-0009', docId:'LIB-2025-00004', demandeurId:'U001', demandeur:'Rakoto Jean-Baptiste', service:'Direction Générale',
    type:'externe', priorite:'haute', dateConsultation:'2025-02-28', dateRetourPrevue:'2025-03-10',
    motif:'Avancement convention Tamatave — envoi partenaire CCI', statut:'validation_n1', observations:'Convention en transit vers Tamatave',
    validations:[{niveau:1,type:'visa',valideur:'Razafy Pierre',statut:'en_attente',date:null}],
    historique:[{date:'2025-02-28 09:00',action:'Demande créée',auteur:'Rakoto Jean-Baptiste'}] },

  { id:'CONS-2025-0011', docId:'LIB-2024-00001', demandeurId:'U003', demandeur:'Razafy Pierre', service:'Direction Générale',
    type:'numerisation', priorite:'urgente', dateConsultation:'2025-02-28', dateRetourPrevue:'2025-03-02',
    motif:'Numérisation correspondance Ministère — réponse urgente', statut:'en_attente', observations:'Courrier réponse en préparation',
    validations:[{niveau:1,type:'visa',valideur:'Rakoto Jean-Baptiste',statut:'en_attente',date:null}],
    historique:[{date:'2025-02-28 11:00',action:'Demande créée',auteur:'Razafy Pierre'}] },

  /* ── Retourné (historique complet) ── */
  { id:'CONS-2025-0010', docId:'LIB-2025-00007', demandeurId:'U005', demandeur:'Andriamananjara Lova', service:'Ressources Humaines',
    type:'consultation', priorite:'normale', dateConsultation:'2025-02-12', dateRetourPrevue:'2025-02-14', dateRetour:'2025-02-14',
    motif:'Contrôle dossier embauche — pièces justificatives', statut:'retournee', observations:'Dossier complet — archivé',
    validations:[{niveau:1,type:'visa',valideur:'Razafy Pierre',statut:'approuve',date:'2025-02-12 08:00',commentaire:''}],
    historique:[{date:'2025-02-12 07:30',action:'Demande créée',auteur:'Andriamananjara Lova'},{date:'2025-02-14 16:00',action:'Retour',auteur:'Andriamananjara Lova'}] },

  /* ── Réservée (1) ── */
  { id:'CONS-2025-0012', docId:'LIB-2024-00003', demandeurId:'U007', demandeur:'Rajaonarivelo Fidy', service:'Service Technique',
    type:'consultation', priorite:'normale', dateConsultation:'2025-03-03', dateRetourPrevue:'2025-03-07',
    motif:'Vérification SLA maintenance IT — revue trimestrielle', statut:'reservee', observations:'Réservé pour revue Q1',
    validations:[{niveau:1,type:'visa',valideur:'Razafy Pierre',statut:'approuve',date:'2025-02-28 14:00',commentaire:'OK — planifié'}],
    historique:[{date:'2025-02-28 13:00',action:'Réservation créée',auteur:'Rajaonarivelo Fidy'},{date:'2025-02-28 14:00',action:'Approuvée',auteur:'Razafy Pierre'}] },
];

/* ═══════════════════════════════════════════════════
   COURRIERS (13 courriers → liés aux documents archives)
═══════════════════════════════════════════════════ */
export const SHARED_COURRIERS = [
  { id:'CE-2025-0001', type:'entrant', objet:'Relance facture énergie JIRAMA', nature:'Relance', expediteur:'JIRAMA', destinataire:'Direction Générale', refExterne:'JIR/REL/2025-001', priorite:'haute', statut:'traite', dateReception:'2025-02-28', dateDocument:'2025-02-25', service:'Comptabilité', affecteA:'Rasoamanarivo Hanta', contenantId:null, docId:'DOC-2025-0142', confidentiel:false, piecesJointes:['Relance_JIRAMA.pdf'], ocrDone:true, ocrData:{expediteur:'JIRAMA',date:'25/02/2025',ref:'JIR/REL/2025-001'}, validations:[{niveau:1,type:'visa',valideur:'Randria Marie-Claire',statut:'approuve',date:'2025-02-28 09:30',commentaire:'Vu'}], historique:[] },
  { id:'CE-2025-0002', type:'entrant', objet:'Facture télécom TELMA — Février 2025', nature:'Facture', expediteur:'TELMA SA', destinataire:'Service Finances', refExterne:'TEL-FACT-2025-002', priorite:'normale', statut:'en_traitement', dateReception:'2025-02-27', dateDocument:'2025-02-20', service:'Comptabilité', affecteA:'Rasoamanarivo Hanta', contenantId:null, docId:'DOC-2025-0138', confidentiel:false, piecesJointes:['Facture_TELMA.pdf'], ocrDone:true, ocrData:{montant:'12.300.000 MGA'}, validations:[], historique:[] },
  { id:'CE-2025-0003', type:'entrant', objet:'Demande situation contrat SME — Toliara', nature:'Demande', expediteur:'SME Construction', destinataire:'Direction Générale', refExterne:'SME/DEM/2025-003', priorite:'urgente', statut:'en_validation', dateReception:'2025-02-28', dateDocument:'2025-02-27', service:'Achats', affecteA:'Rakoto Jean-Baptiste', contenantId:null, docId:'DOC-2025-0105', confidentiel:true, piecesJointes:['Demande_SME.pdf'], ocrDone:true, ocrData:{}, validations:[], historique:[] },
  { id:'CS-2025-0001', type:'sortant', objet:'Transmission délibération CA — Budget 2025', nature:'Lettre', expediteur:'Direction Générale', destinataire:'Ministère des Finances', refExterne:null, priorite:'haute', statut:'signe', dateReception:null, dateDocument:'2025-02-26', dateEnvoi:'2025-02-27', service:'Direction', affecteA:'Razafy Pierre', contenantId:null, docId:'DOC-2025-0125', confidentiel:true, piecesJointes:['Delib_CA.pdf'], ocrDone:false, ocrData:null, validations:[], historique:[] },
  { id:'CS-2025-0002', type:'sortant', objet:'Commande fournitures — Mahajanga', nature:'Bon de commande', expediteur:'Administration', destinataire:'Fournisseur Local', refExterne:null, priorite:'normale', statut:'distribue', dateReception:null, dateDocument:'2025-02-24', dateEnvoi:'2025-02-25', service:'Administration', affecteA:'Andriamananjara Lova', contenantId:null, docId:'DOC-2025-0130', confidentiel:false, piecesJointes:['BC_Fournitures.pdf'], ocrDone:false, ocrData:null, validations:[], historique:[] },
  { id:'CS-2025-0003', type:'sortant', objet:'Renouvellement contrat ciment HOLCIM', nature:'Lettre', expediteur:'Achats', destinataire:'HOLCIM Madagascar', refExterne:null, priorite:'haute', statut:'en_validation', dateReception:null, dateDocument:'2025-02-28', dateEnvoi:null, service:'Achats', affecteA:'Ratsimbazafy Noro', contenantId:null, docId:'DOC-2025-0120', confidentiel:false, piecesJointes:['Renouvellement_HOLCIM.pdf'], ocrDone:false, ocrData:null, validations:[], historique:[] },
  { id:'CI-2025-0001', type:'interne', objet:'Note de service — Inventaire archives', nature:'Note', expediteur:'Direction Générale', destinataire:'Tous les services', refExterne:null, priorite:'haute', statut:'distribue', dateReception:null, dateDocument:'2025-02-20', dateEnvoi:'2025-02-20', service:'Direction', affecteA:'Ratsimbazafy Noro', contenantId:null, docId:null, confidentiel:false, piecesJointes:['Calendrier_inventaire.pdf'], ocrDone:false, ocrData:null, validations:[], historique:[] },
  { id:'CI-2025-0002', type:'interne', objet:'Rapport activité ST — Février', nature:'Rapport', expediteur:'Service Technique', destinataire:'Direction Générale', refExterne:null, priorite:'normale', statut:'enregistre', dateReception:'2025-02-28', dateDocument:'2025-02-28', service:'Service Technique', affecteA:'Rajaonarivelo Fidy', contenantId:null, docId:null, confidentiel:false, piecesJointes:['Rapport_ST.pdf'], ocrDone:false, ocrData:null, validations:[], historique:[] },
  { id:'CE-2025-0004', type:'entrant', objet:'Notification contrôle fiscal 2023', nature:'Notification', expediteur:'DGI', destinataire:'Direction Générale', refExterne:'DGI/CF/2025-0198', priorite:'urgente', statut:'en_traitement', dateReception:'2025-02-26', dateDocument:'2025-02-24', service:'Comptabilité', affecteA:'Randria Marie-Claire', contenantId:null, docId:'DOC-2025-0110', confidentiel:true, piecesJointes:['Avis_DGI.pdf'], ocrDone:true, ocrData:{}, validations:[], historique:[] },
  { id:'CE-2025-0005', type:'entrant', objet:'Invitation séminaire digitalisation', nature:'Invitation', expediteur:'Ministère Transformation Digitale', destinataire:'Direction Générale', refExterne:'MTD/SEM/2025-003', priorite:'normale', statut:'traite', dateReception:'2025-02-22', dateDocument:'2025-02-18', service:'IT', affecteA:'Rajaonarivelo Fidy', contenantId:null, docId:null, confidentiel:false, piecesJointes:['Programme_seminaire.pdf'], ocrDone:true, ocrData:{}, validations:[], historique:[] },
  { id:'CE-2025-0006', type:'entrant', objet:'Confirmation livraison mobilier Fianarantsoa', nature:'Avis', expediteur:'SME Construction', destinataire:'Logistique', refExterne:'SME/LIV/2025-012', priorite:'haute', statut:'en_validation', dateReception:'2025-02-28', dateDocument:'2025-02-27', service:'Logistique', affecteA:'Rajaonarivelo Fidy', contenantId:null, docId:'DOC-2025-0100', confidentiel:false, piecesJointes:['BL_mobilier.pdf'], ocrDone:true, ocrData:{}, validations:[], historique:[] },
  { id:'CS-2025-0004', type:'sortant', objet:'Transmission rapport T1 — Version signée', nature:'Lettre', expediteur:'Direction Générale', destinataire:'Bailleurs de fonds', refExterne:null, priorite:'haute', statut:'traite', dateReception:null, dateDocument:'2025-02-25', dateEnvoi:'2025-02-26', service:'Direction', affecteA:'Razafy Pierre', contenantId:null, docId:'DOC-2024-0891', confidentiel:false, piecesJointes:['Rapport_T1_signe.pdf'], ocrDone:false, ocrData:null, validations:[], historique:[] },
  { id:'CI-2025-0003', type:'interne', objet:'Demande matériel informatique — 3 postes', nature:'Demande', expediteur:'Comptabilité', destinataire:'IT', refExterne:null, priorite:'normale', statut:'en_validation', dateReception:'2025-02-27', dateDocument:'2025-02-27', service:'Comptabilité', affecteA:'Rasoamanarivo Hanta', contenantId:null, docId:null, confidentiel:false, piecesJointes:[], ocrDone:false, ocrData:null, validations:[], historique:[] },
];

/* ═══════════════════════════════════════════════════
   MOUVEMENTS CONTENANTS (historique des opérations)
═══════════════════════════════════════════════════ */
export const SHARED_CONT_MOUVEMENTS = [
  { date:'2025-02-28', heure:'15:00', type:'deplacement',  contenant:'CNT-010', description:'Expédition vers agence Tamatave',           de:'Archivage intermédiaire', vers:'Agence Tamatave',    auteur:'Razafy Pierre' },
  { date:'2025-02-28', heure:'11:30', type:'association',   contenant:'CNT-003', description:'2 documents ajoutés au dossier JIRAMA',     de:'',                        vers:'',                   auteur:'Rakoto Jean-Baptiste' },
  { date:'2025-02-27', heure:'16:00', type:'scellage',      contenant:'CNT-006', description:'Scellage boîte Paie 2024 (100/100)',        de:'',                        vers:'',                   auteur:'Razafy Pierre' },
  { date:'2025-02-27', heure:'14:30', type:'creation',      contenant:'CNT-012', description:'Création boîte Correspondance 2025',        de:'',                        vers:'',                   auteur:'Ratsimbazafy Noro' },
  { date:'2025-02-26', heure:'10:00', type:'deplacement',   contenant:'CNT-008', description:'Déplacement vers archives juridiques',      de:'Salle Finances',          vers:'Archives juridiques',auteur:'Rakoto Jean-Baptiste' },
  { date:'2025-02-25', heure:'09:30', type:'association',   contenant:'CNT-011', description:'5 factures ajoutées',                       de:'',                        vers:'',                   auteur:'Ratsimbazafy Noro' },
  { date:'2025-02-24', heure:'15:00', type:'ouverture',     contenant:'CNT-005', description:'Réouverture pour ajout dossier',             de:'',                        vers:'',                   auteur:'Razafy Pierre' },
  { date:'2025-02-23', heure:'11:00', type:'creation',      contenant:'CNT-011', description:'Création dossier Client BNI',               de:'',                        vers:'',                   auteur:'Rakoto Jean-Baptiste' },
];

/* ═══════════════════════════════════════════════════
   HISTORIQUE PAR CONTENANT (piste d'audit détaillée)
═══════════════════════════════════════════════════ */
export const SHARED_CONT_HISTORY = {
  'CNT-001': [
    { date:'2025-02-28', heure:'10:00', type:'association',  description:'3 documents ajoutés (audit, rapport, note)', auteur:'Rakoto Jean-Baptiste' },
    { date:'2025-02-15', heure:'14:00', type:'deplacement',  description:'Réorganisation rayonnage A1 → A2',           auteur:'Razafy Pierre' },
    { date:'2025-01-10', heure:'09:00', type:'association',  description:'Boîte CNT-002 ajoutée comme enfant',         auteur:'Ratsimbazafy Noro' },
    { date:'2024-01-15', heure:'08:00', type:'creation',     description:'Création du carton Archives DG 2024',        auteur:'Razafy Pierre' },
  ],
  'CNT-006': [
    { date:'2025-02-27', heure:'16:00', type:'scellage',     description:'Scellage définitif — 100/100 bulletins de paie', auteur:'Razafy Pierre' },
    { date:'2025-02-27', heure:'15:30', type:'fermeture',    description:'Fermeture préalable au scellage',                auteur:'Razafy Pierre' },
    { date:'2024-12-31', heure:'17:00', type:'association',  description:'Dernier bulletin de paie ajouté (100/100)',      auteur:'Ratsimbazafy Noro' },
    { date:'2024-06-15', heure:'08:00', type:'creation',     description:'Création boîte Paie 2024',                      auteur:'Razafy Pierre' },
  ],
  'CNT-003': [
    { date:'2025-02-28', heure:'11:30', type:'association',  description:'2 documents ajoutés (contrat JIRAMA)',      auteur:'Rakoto Jean-Baptiste' },
    { date:'2025-01-20', heure:'09:00', type:'association',  description:'Annexes contrat ajoutées',                  auteur:'Ratsimbazafy Noro' },
    { date:'2025-01-12', heure:'08:00', type:'creation',     description:'Création dossier Prestation JIRAMA',        auteur:'Rakoto Jean-Baptiste' },
  ],
  'CNT-010': [
    { date:'2025-02-28', heure:'15:00', type:'deplacement',  description:'Expédition vers agence Tamatave',          auteur:'Razafy Pierre' },
    { date:'2025-02-20', heure:'08:00', type:'creation',     description:'Création carton Transit Tamatave',         auteur:'Ratsimbazafy Noro' },
  ],
  'CNT-011': [
    { date:'2025-02-25', heure:'09:30', type:'association',  description:'5 factures fournisseurs ajoutées',         auteur:'Ratsimbazafy Noro' },
    { date:'2025-02-01', heure:'11:00', type:'creation',     description:'Création dossier Client BNI',             auteur:'Rakoto Jean-Baptiste' },
  ],
};