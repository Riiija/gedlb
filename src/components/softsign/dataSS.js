/* ═══════════════════════════════════════════════
   SOFTSIGN — Initial data (mock / localStorage seed)
═══════════════════════════════════════════════ */

export const INIT_SS_DOCUMENTS = [
  { id:'SS-001', ref:'SS-DOC-2026-001', title:'Contrat fournisseur TELMA SA', type:'contrat', status:'en_validation', date:'2026-05-10', author:'Admin', authorId:'U000', signers:['U001','U003'], signedBy:[], priority:'haute', pages:3, comments:'Renouvellement annuel', password:null, fileB64:null },
  { id:'SS-002', ref:'SS-DOC-2026-002', title:'Devis travaux Bâtiment A', type:'devis', status:'signe', date:'2026-05-08', author:'Rakoto Jean-Baptiste', authorId:'U001', signers:['U002'], signedBy:['U002'], priority:'normale', pages:2, comments:'', password:null, fileB64:null },
  { id:'SS-003', ref:'SS-DOC-2026-003', title:'Note de service RH — Avril 2026', type:'interne', status:'en_attente', date:'2026-05-05', author:'Razafy Pierre', authorId:'U003', signers:['U001','U002','U003'], signedBy:[], priority:'basse', pages:1, comments:'Politique congés', password:null, fileB64:null },
  { id:'SS-004', ref:'SS-DOC-2026-004', title:'Bon de commande matériel IT', type:'autre', status:'rejete', date:'2026-05-01', author:'Randria Marie-Claire', authorId:'U002', signers:['U003'], signedBy:[], priority:'normale', pages:4, comments:'Budget dépassé', password:null, fileB64:null },
  { id:'SS-005', ref:'SS-DOC-2026-005', title:'Convention partenariat ONG Fanantenana', type:'contrat', status:'archive', date:'2026-04-28', author:'Admin', authorId:'U000', signers:['U001'], signedBy:['U001'], priority:'haute', pages:8, comments:'Archivé dans Softdocs', password:null, fileB64:null },
  { id:'SS-006', ref:'SS-DOC-2026-006', title:'Procédure qualité ISO 9001', type:'interne', status:'en_validation', date:'2026-04-22', author:'Rakoto Jean-Baptiste', authorId:'U001', signers:['U000','U003'], signedBy:['U000'], priority:'haute', pages:12, comments:'Révision annuelle', password:null, fileB64:null },
  { id:'SS-007', ref:'SS-DOC-2026-007', title:'Devis maintenance réseau', type:'devis', status:'en_attente', date:'2026-04-18', author:'Admin', authorId:'U000', signers:['U002','U003'], signedBy:[], priority:'normale', pages:2, comments:'', password:null, fileB64:null },
];

export const INIT_SS_DEVIS = [
  { id:'DV-001', ref:'DV-2026-001', fournisseur:'TELMA SA', contact:'rakoto@telma.mg', montant:4500000, devise:'MGA', objet:'Fournitures bureau Q2', status:'en_validation', date:'2026-05-12', echeance:'2026-05-20', notes:'Comparer avec DV-003', fileB64:null },
  { id:'DV-002', ref:'DV-2026-002', fournisseur:'Orange Madagascar', contact:'info@orange.mg', montant:1200000, devise:'MGA', objet:'Services télécom mensuel', status:'accepte', date:'2026-05-10', echeance:'2026-05-18', notes:'', fileB64:null },
  { id:'DV-003', ref:'DV-2026-003', fournisseur:'Canal+ Madagascar', contact:'b2b@canalmg.mg', montant:890000, devise:'MGA', objet:'Abonnements TV bureaux', status:'refuse', date:'2026-05-08', echeance:'2026-05-16', notes:'Prix trop élevé', fileB64:null },
  { id:'DV-004', ref:'DV-2026-004', fournisseur:'IT Solutions SARL', contact:'it@solutions.mg', montant:6750000, devise:'MGA', objet:'Maintenance parc informatique', status:'en_validation', date:'2026-05-06', echeance:'2026-05-14', notes:'Inclure les serveurs', fileB64:null },
  { id:'DV-005', ref:'DV-2026-005', fournisseur:'BTP Construction SA', contact:'contact@btp.mg', montant:25000000, devise:'MGA', objet:'Réfection toiture bâtiment B', status:'accepte', date:'2026-04-30', echeance:'2026-05-10', notes:'', fileB64:null },
];

export const INIT_SS_CONTRATS = [
  { id:'CT-001', ref:'CT-2026-001', title:'Contrat maintenance informatique', partenaire:'IT Solutions SARL', contact:'it@solutions.mg', montant:8500000, devise:'MGA', status:'actif', dateDebut:'2026-01-01', dateFin:'2026-12-31', signers:['U001','U003'], signedBy:['U001','U003'], notes:'Renouvellement automatique', fileB64:null },
  { id:'CT-002', ref:'CT-2026-002', title:'Bail locaux commerciaux Centre-Ville', partenaire:'Immobilier Tana SA', contact:'bail@immotana.mg', montant:15000000, devise:'MGA', status:'a_signer', dateDebut:'2026-06-01', dateFin:'2027-05-31', signers:['U003'], signedBy:[], notes:'En attente signature bailleur', fileB64:null },
  { id:'CT-003', ref:'CT-2025-012', title:'Contrat nettoyage bâtiment admin', partenaire:'Clean Pro SARL', contact:'admin@cleanpro.mg', montant:2400000, devise:'MGA', status:'expire', dateDebut:'2025-01-01', dateFin:'2025-12-31', signers:['U001'], signedBy:['U001'], notes:'À renouveler', fileB64:null },
  { id:'CT-004', ref:'CT-2026-003', title:'Convention formation RH', partenaire:'Academy Pro Madagascar', contact:'contact@academypro.mg', montant:4200000, devise:'MGA', status:'en_cours', dateDebut:'2026-03-01', dateFin:'2026-08-31', signers:['U002','U003'], signedBy:['U002'], notes:'Module leadership en cours', fileB64:null },
];

export const INIT_SS_FOURNISSEURS = [
  { id:'F-001', nom:'TELMA SA', secteur:'Télécoms', contact:'rakoto@telma.mg', tel:'+261 20 22 000 01', statut:'actif', docs:3, devis:2, contrats:1, dateEntree:'2024-01-15' },
  { id:'F-002', nom:'Orange Madagascar', secteur:'Télécoms', contact:'info@orange.mg', tel:'+261 20 22 000 02', statut:'actif', docs:2, devis:1, contrats:0, dateEntree:'2024-03-10' },
  { id:'F-003', nom:'IT Solutions SARL', secteur:'Informatique', contact:'it@solutions.mg', tel:'+261 20 22 000 03', statut:'actif', docs:5, devis:1, contrats:1, dateEntree:'2023-06-01' },
  { id:'F-004', nom:'BTP Construction SA', secteur:'BTP', contact:'contact@btp.mg', tel:'+261 20 22 000 04', statut:'actif', docs:1, devis:1, contrats:0, dateEntree:'2025-02-20' },
  { id:'F-005', nom:'Clean Pro SARL', secteur:'Services', contact:'admin@cleanpro.mg', tel:'+261 20 22 000 05', statut:'inactif', docs:2, devis:0, contrats:1, dateEntree:'2023-01-10' },
];

export const INIT_SS_WORKFLOWS = [
  { id:'WF-001', nom:'Workflow standard devis', type:'devis', etapes:['Réception & vérification','Validation achats','Validation budgétaire','Signature approbation','Archivage Softdocs'], actif:true, dureeMax:5, nbUtilise:12 },
  { id:'WF-002', nom:'Workflow contrat externe', type:'contrat', etapes:['Import contrat','Validation juridique','Validation direction','Signature interne','Signature externe','Archivage'], actif:true, dureeMax:10, nbUtilise:8 },
  { id:'WF-003', nom:'Workflow documents internes', type:'interne', etapes:['Création brouillon','Visa chef de service','Validation direction','Signature électronique','Diffusion & archivage'], actif:true, dureeMax:3, nbUtilise:24 },
  { id:'WF-004', nom:'Workflow documents RH', type:'interne', etapes:['Création RH','Validation manager','Signature RH','Signature salarié','Classement dossier'], actif:false, dureeMax:7, nbUtilise:4 },
];

export const INIT_SS_NOTIFICATIONS = [
  { id:'N-001', type:'validation', message:'Le document SS-DOC-2026-001 nécessite votre validation', lu:false, date:'2026-05-14T09:30:00', docId:'SS-001' },
  { id:'N-002', type:'signature', message:'Contrat CT-2026-002 en attente de signature', lu:false, date:'2026-05-13T14:15:00', docId:'CT-002' },
  { id:'N-003', type:'info', message:'Devis DV-2026-001 soumis par TELMA SA', lu:true, date:'2026-05-12T11:00:00', docId:'DV-001' },
  { id:'N-004', type:'alerte', message:'Le devis DV-2026-004 expire dans 3 jours', lu:false, date:'2026-05-11T08:00:00', docId:'DV-004' },
  { id:'N-005', type:'info', message:'Signature de U002 apposée sur SS-DOC-2026-002', lu:true, date:'2026-05-09T16:45:00', docId:'SS-002' },
];

/* ─── Helper: status display config ─── */
export const SS_DOC_STATUS = {
  en_attente:    { label:'En attente',    color:'#d97706', bg:'#fffbeb' },
  en_validation: { label:'En validation', color:'#2563eb', bg:'#eff6ff' },
  signe:         { label:'Signé',         color:'#059669', bg:'#ecfdf5' },
  rejete:        { label:'Rejeté',        color:'#dc2626', bg:'#fef2f2' },
  archive:       { label:'Archivé',       color:'#475569', bg:'#f8fafc' },
  brouillon:     { label:'Brouillon',     color:'#7c3aed', bg:'#f5f3ff' },
};

export const SS_CONTRACT_STATUS = {
  actif:    { label:'Actif',      color:'#059669', bg:'#ecfdf5' },
  a_signer: { label:'À signer',   color:'#2563eb', bg:'#eff6ff' },
  en_cours: { label:'En cours',   color:'#d97706', bg:'#fffbeb' },
  expire:   { label:'Expiré',     color:'#dc2626', bg:'#fef2f2' },
  resilie:  { label:'Résilié',    color:'#475569', bg:'#f8fafc' },
};

export const SS_DEVIS_STATUS = {
  en_validation: { label:'En validation', color:'#2563eb', bg:'#eff6ff' },
  accepte:       { label:'Accepté',       color:'#059669', bg:'#ecfdf5' },
  refuse:        { label:'Refusé',        color:'#dc2626', bg:'#fef2f2' },
  expire:        { label:'Expiré',        color:'#475569', bg:'#f8fafc' },
  brouillon:     { label:'Brouillon',     color:'#7c3aed', bg:'#f5f3ff' },
};
