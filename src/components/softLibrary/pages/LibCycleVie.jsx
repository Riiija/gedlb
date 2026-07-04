/* ═══════════════════════════════════════════════════════════════
   SOFT LIBRARY — Cycle de Vie Documentaire (Records Lifecycle)
   ─────────────────────────────────────────────────────────────
   ✓ Paramétrage DUA (durée d'utilité administrative)
   ✓ Règles de conservation par type documentaire
   ✓ Calendrier de conservation automatisé
   ✓ Archivage intermédiaire / définitif
   ✓ Gel légal (legal hold)
   ✓ Proposition automatique de destruction
   ✓ Workflow d'autorisation d'élimination
   ✓ Génération bordereaux réglementaires
   ✓ Traçabilité des destructions
   ✓ Certificat de destruction
   ✓ Journal d'audit complet
   ✓ Statistiques & tableau de bord
   ✓ Responsive mobile / tablet / desktop
═══════════════════════════════════════════════════════════════ */
import React, { useState, useMemo, useCallback } from 'react';
import {
  Plus, FileText, Archive, BookOpen, Trash2, ChevronRight, Eye, Edit3, X, Check,
  Clock, Save, AlertTriangle, Download, History, Lock,
  Calendar, User, Building2, RefreshCw, CheckCircle2, XCircle, Info,
  Package, Shield, Send, ArrowRight, Bell, BarChart3, UserCheck,
  AlertCircle, Printer, Tag, Inbox, PieChart,
  Layers, Zap, FolderOpen, Scale, FileCheck,
  Stamp, Search, ShieldAlert, ScrollText,
} from 'lucide-react';
import { COLORS, FONT_FAMILY, getStatutUI } from '../theme';
import { Badge, Btn, Modal, Pagination, SearchBar } from '../components/ui';

const FF = FONT_FAMILY;
const labelStyle = { fontSize: 11, fontWeight: 600, color: COLORS.textMut, marginBottom: 4, display: 'block' };
const inputStyle = { width: '100%', padding: '8px 12px', border: `1.5px solid ${COLORS.border}`, borderRadius: 8, fontSize: 13, fontFamily: FF, color: COLORS.text, background: '#fff', outline: 'none', boxSizing: 'border-box' };

/* snowflake-like icon via Lock + custom */
const Snowflake = (props) => <Lock {...props} />;

/* ═══════════════════════════════════════════════════
   CONSTANTES
═══════════════════════════════════════════════════ */
const PHASES = {
  actif:          { label: 'Actif',          color: '#059669', bg: '#ecfdf5', icon: FileText, order: 0 },
  intermediaire:  { label: 'Intermédiaire',  color: '#d97706', bg: '#fffbeb', icon: Archive, order: 1 },
  definitif:      { label: 'Définitif',      color: '#4f46e5', bg: '#eef2ff', icon: BookOpen, order: 2 },
  gel_legal:      { label: 'Gel légal',      color: '#0891b2', bg: '#ecfeff', icon: Lock, order: 3 },
  elimination:    { label: 'Élimination',    color: '#dc2626', bg: '#fef2f2', icon: Trash2, order: 4 },
};

const SORT_FINALS = [
  { id: 'conservation', label: 'Conservation définitive', icon: BookOpen, color: '#4f46e5' },
  { id: 'destruction', label: 'Destruction', icon: Trash2, color: '#dc2626' },
  { id: 'tri', label: 'Tri (décision ultérieure)', icon: Scale, color: '#d97706' },
];
const getSortFinal = id => SORT_FINALS.find(s => s.id === id) || SORT_FINALS[2];

const ELIM_STATUTS = {
  proposition:   { label: 'Proposition',    color: '#64748b', bg: '#f1f5f9', icon: FileText },
  en_validation: { label: 'En validation',  color: '#d97706', bg: '#fffbeb', icon: Clock },
  approuvee:     { label: 'Approuvée',      color: '#059669', bg: '#ecfdf5', icon: CheckCircle2 },
  refusee:       { label: 'Refusée',        color: '#dc2626', bg: '#fef2f2', icon: XCircle },
  executee:      { label: 'Exécutée',       color: '#475569', bg: '#f8fafc', icon: Trash2 },
  certifiee:     { label: 'Certifiée',      color: '#4f46e5', bg: '#eef2ff', icon: FileCheck },
};
const getElimSt = id => ELIM_STATUTS[id] || { label: id, color: '#94a3b8', bg: '#f8fafc', icon: Info };

const SERVICES = ['Direction Générale','Finances','Ressources Humaines','Juridique','Service Technique','Communication','Informatique','Logistique'];
const TODAY = '2025-02-28';

/* ═══════════════════════════════════════════════════
   DONNÉES DÉMO — RÈGLES DUA
═══════════════════════════════════════════════════ */
const DEMO_REGLES = [
  { id:'REG-001', typeId:'DOC-TYP-01', typeName:'Contrats', duaAns:10, phaseActive:2, phaseInter:5, phaseDef:3, sortFinal:'conservation', fondement:'Code civil Art. 2224', observations:'Conservation intégrale au-delà DUA pour valeur historique', actif:true },
  { id:'REG-002', typeId:'DOC-TYP-02', typeName:'Factures', duaAns:10, phaseActive:2, phaseInter:8, phaseDef:0, sortFinal:'destruction', fondement:'Code de commerce Art. L.123-22', observations:'Destruction après DUA sauf contrôle fiscal en cours', actif:true },
  { id:'REG-003', typeId:'DOC-TYP-03', typeName:'Notes de service', duaAns:5, phaseActive:1, phaseInter:4, phaseDef:0, sortFinal:'destruction', fondement:'Politique interne RH-2023-04', observations:'', actif:true },
  { id:'REG-004', typeId:'DOC-TYP-04', typeName:'PV Conseil Admin.', duaAns:999, phaseActive:2, phaseInter:5, phaseDef:992, sortFinal:'conservation', fondement:'Code de commerce Art. L.225-25', observations:'Conservation permanente', actif:true },
  { id:'REG-005', typeId:'DOC-TYP-05', typeName:'Correspondance', duaAns:5, phaseActive:1, phaseInter:4, phaseDef:0, sortFinal:'tri', fondement:'Politique archives DIR-2024-01', observations:'Tri sélectif : conserver stratégique, éliminer courant', actif:true },
  { id:'REG-006', typeId:'DOC-TYP-06', typeName:'Dossiers clients', duaAns:10, phaseActive:3, phaseInter:7, phaseDef:0, sortFinal:'destruction', fondement:'Loi RGPD / données personnelles', observations:'Anonymisation obligatoire avant destruction', actif:true },
  { id:'REG-007', typeId:'DOC-TYP-07', typeName:'Dossiers RH', duaAns:50, phaseActive:5, phaseInter:45, phaseDef:0, sortFinal:'tri', fondement:'Code du travail — prescription cinquantenaire', observations:'Conserver contrats et bulletins, éliminer demandes de congé', actif:true },
  { id:'REG-008', typeId:'DOC-TYP-08', typeName:'Rapports audit', duaAns:10, phaseActive:2, phaseInter:8, phaseDef:0, sortFinal:'conservation', fondement:'Normes ISA / Contrôle Interne', observations:'Conservation définitive sur décision DAF', actif:true },
  { id:'REG-009', typeId:'DOC-TYP-09', typeName:'Brouillons / Drafts', duaAns:1, phaseActive:1, phaseInter:0, phaseDef:0, sortFinal:'destruction', fondement:'Politique interne', observations:'Destruction auto après validation version finale', actif:true },
  { id:'REG-010', typeId:'DOC-TYP-10', typeName:'Documents fiscaux', duaAns:10, phaseActive:2, phaseInter:8, phaseDef:0, sortFinal:'destruction', fondement:'Code Général des Impôts Art. L.169', observations:'Conservation 10 ans minimum', actif:true },
];

/* ═══════════════════════════════════════════════════
   DONNÉES DÉMO — ÉLIMINATIONS
═══════════════════════════════════════════════════ */
const DEMO_ELIMINATIONS = [
  { id:'ELIM-2025-001', titre:'Notes de service 2019', typeDoc:'Notes de service', regle:'REG-003', nbDocs:45, volumeMl:12, service:'Direction Générale', statut:'en_validation', dateProposition:'2025-02-15', dateEcheanceDUA:'2024-12-31', motif:'DUA de 5 ans atteinte — documents de 2019', proposePar:'Ratsimbazafy Noro',
    validations:[{niveau:1,valideur:'Razafy Pierre',role:'DAF',statut:'approuve',date:'2025-02-16 10:00',commentaire:'Conforme au calendrier'},{niveau:2,valideur:'Archives nationales',role:'Visa réglementaire',statut:'en_attente',date:null}],
    historique:[{date:'2025-02-15 09:00',action:'Proposition créée',auteur:'Système',detail:'Détection automatique — DUA atteinte'},{date:'2025-02-15 09:05',action:'Bordereau généré',auteur:'Système',detail:'BRD-2025-001'},{date:'2025-02-16 10:00',action:'Visé N1',auteur:'Razafy Pierre',detail:'Conforme'}] },
  { id:'ELIM-2025-002', titre:'Brouillons et drafts 2023-2024', typeDoc:'Brouillons / Drafts', regle:'REG-009', nbDocs:120, volumeMl:3, service:'Tous services', statut:'approuvee', dateProposition:'2025-02-10', dateEcheanceDUA:'2025-01-31', motif:'DUA de 1 an atteinte — brouillons obsolètes', proposePar:'Ratsimbazafy Noro',
    validations:[{niveau:1,valideur:'Razafy Pierre',role:'DAF',statut:'approuve',date:'2025-02-11 14:00',commentaire:'Approuvé'}],
    historique:[{date:'2025-02-10 08:00',action:'Proposition créée',auteur:'Système',detail:'Détection automatique'},{date:'2025-02-11 14:00',action:'Approuvé N1',auteur:'Razafy Pierre',detail:''}] },
  { id:'ELIM-2025-003', titre:'Correspondance courante 2018-2019', typeDoc:'Correspondance', regle:'REG-005', nbDocs:78, volumeMl:18, service:'Direction Générale', statut:'proposition', dateProposition:'2025-02-28', dateEcheanceDUA:'2024-06-30', motif:'DUA de 5 ans atteinte — tri sélectif recommandé', proposePar:'Système',
    validations:[], historique:[{date:'2025-02-28 06:00',action:'Proposition automatique',auteur:'Système',detail:'78 documents identifiés par le calendrier'}] },
  { id:'ELIM-2024-010', titre:'Factures fournisseurs 2013', typeDoc:'Factures', regle:'REG-002', nbDocs:234, volumeMl:45, service:'Finances', statut:'certifiee', dateProposition:'2024-09-15', dateEcheanceDUA:'2024-01-01', dateDestruction:'2024-11-20', motif:'DUA de 10 ans atteinte', proposePar:'Ratsimbazafy Noro', certificat:{ref:'CERT-2024-003',date:'2024-11-20',methode:'Broyage confidentiel',prestataire:'SecuriDoc Madagascar',temoin:'Razafy Pierre',poids:'12.5 kg'},
    validations:[{niveau:1,valideur:'Randria Marie-Claire',role:'Resp. Financier',statut:'approuve',date:'2024-09-20 09:00',commentaire:'Aucun contentieux'},{niveau:2,valideur:'Razafy Pierre',role:'DAF',statut:'approuve',date:'2024-09-22 16:00',commentaire:'Destruction autorisée'}],
    historique:[{date:'2024-09-15 08:00',action:'Proposition créée',auteur:'Système',detail:'DUA atteinte'},{date:'2024-09-20 09:00',action:'Visé N1',auteur:'Randria Marie-Claire',detail:''},{date:'2024-09-22 16:00',action:'Approuvé N2',auteur:'Razafy Pierre',detail:''},{date:'2024-10-15 10:00',action:'Bordereau signé',auteur:'Razafy Pierre',detail:'BRD-2024-010'},{date:'2024-11-20 14:00',action:'🗑️ Destruction exécutée',auteur:'SecuriDoc Madagascar',detail:'Broyage — 12.5 kg — témoin: Razafy Pierre'},{date:'2024-11-20 16:00',action:'📜 Certificat émis',auteur:'Système',detail:'CERT-2024-003'}] },
  { id:'ELIM-2024-008', titre:'Correspondance 2017', typeDoc:'Correspondance', regle:'REG-005', nbDocs:56, volumeMl:14, service:'Juridique', statut:'executee', dateProposition:'2024-06-01', dateEcheanceDUA:'2023-12-31', dateDestruction:'2024-08-15', motif:'DUA de 5 ans atteinte', proposePar:'Ratsimbazafy Noro',
    validations:[{niveau:1,valideur:'Ratsimbazafy Noro',role:'Gestionnaire',statut:'approuve',date:'2024-06-05 10:00',commentaire:'Tri effectué'},{niveau:2,valideur:'Razafy Pierre',role:'DAF',statut:'approuve',date:'2024-06-10 16:00',commentaire:''}],
    historique:[{date:'2024-06-01 08:00',action:'Proposition créée',auteur:'Ratsimbazafy Noro',detail:''},{date:'2024-06-05 10:00',action:'Visé N1',auteur:'Ratsimbazafy Noro',detail:'Tri effectué'},{date:'2024-06-10 16:00',action:'Approuvé N2',auteur:'Razafy Pierre',detail:''},{date:'2024-08-15 10:00',action:'🗑️ Destruction exécutée',auteur:'Service interne',detail:'Broyage interne'}] },
  { id:'ELIM-2025-004', titre:'Dossiers clients clôturés 2014', typeDoc:'Dossiers clients', regle:'REG-006', nbDocs:32, volumeMl:25, service:'Finances', statut:'refusee', dateProposition:'2025-01-20', dateEcheanceDUA:'2025-01-01', motif:'DUA de 10 ans atteinte', proposePar:'Système', motifRefus:'Contentieux en cours BNI — gel légal requis',
    validations:[{niveau:1,valideur:'Randria Marie-Claire',role:'Resp. Financier',statut:'refuse',date:'2025-01-25 11:00',commentaire:'Contentieux en cours — gel légal requis'}],
    historique:[{date:'2025-01-20 06:00',action:'Proposition automatique',auteur:'Système',detail:''},{date:'2025-01-25 11:00',action:'❌ Refusée',auteur:'Randria Marie-Claire',detail:'Contentieux en cours'}] },
];

/* ═══════════════════════════════════════════════════
   DONNÉES DÉMO — GELS LÉGAUX
═══════════════════════════════════════════════════ */
const DEMO_GELS = [
  { id:'GEL-2025-001', titre:'Litige BNI — Dossiers clients', motif:'Contentieux commercial BNI c/ Société — Tribunal de commerce Antananarivo', refJuridique:'TCA-2025-0342', demandePar:'Ratsimbazafy Noro', service:'Juridique', dateDebut:'2025-01-25', dateFin:null, actif:true, nbDocs:8, typeDocs:'Dossiers clients', scope:'Tous documents liés au client BNI depuis 2018', historique:[{date:'2025-01-25 11:30',action:'Gel activé',auteur:'Ratsimbazafy Noro',detail:'Suite refus ELIM-2025-004'},{date:'2025-01-25 11:35',action:'🔒 8 documents gelés',auteur:'Système',detail:'Blocage destruction + transfert'}] },
  { id:'GEL-2024-003', titre:'Contrôle fiscal DGI 2023', motif:'Notification de contrôle fiscal — exercice 2023', refJuridique:'DGI/CF/2025-0198', demandePar:'Randria Marie-Claire', service:'Finances', dateDebut:'2024-11-01', dateFin:null, actif:true, nbDocs:45, typeDocs:'Documents fiscaux, Factures', scope:'Documents comptables exercice 2023', historique:[{date:'2024-11-01 09:00',action:'Gel activé',auteur:'Randria Marie-Claire',detail:'Contrôle fiscal DGI notifié'},{date:'2024-11-01 09:10',action:'🔒 45 documents gelés',auteur:'Système',detail:''}] },
  { id:'GEL-2024-001', titre:'Audit interne — Archives DG', motif:'Audit interne exercice 2024 — conservation préventive', refJuridique:'AI-2024-INT', demandePar:'Razafy Pierre', service:'Direction Générale', dateDebut:'2024-03-01', dateFin:'2024-12-31', actif:false, nbDocs:22, typeDocs:'Rapports audit, PV CA', scope:'Rapports et PV période 2020-2024', historique:[{date:'2024-03-01 08:00',action:'Gel activé',auteur:'Razafy Pierre',detail:'Audit interne'},{date:'2024-12-31 23:59',action:'🔓 Gel levé',auteur:'Système',detail:'Audit terminé'}] },
];

/* ═══════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
═══════════════════════════════════════════════════ */
export default function LibCycleVie({ documents = [], docTypes = [] }) {
  const [tab, setTab] = useState('dashboard');
  const [regles, setRegles] = useState(DEMO_REGLES);
  const [eliminations, setEliminations] = useState(DEMO_ELIMINATIONS);
  const [gels, setGels] = useState(DEMO_GELS);
  const [showDetail, setShowDetail] = useState(null);
  const [showRegle, setShowRegle] = useState(null);
  const [showGel, setShowGel] = useState(null);
  const [showNewElim, setShowNewElim] = useState(false);
  const [showNewGel, setShowNewGel] = useState(false);
  const [showValidation, setShowValidation] = useState(null);
  const [showCertificat, setShowCertificat] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => { const c = () => setIsMobile(window.innerWidth < 768); c(); window.addEventListener('resize', c); return () => window.removeEventListener('resize', c); }, []);

  /* ── Document phase mapping ── */
  const docPhases = useMemo(() => {
    const p = { actif: 0, intermediaire: 0, definitif: 0, gel_legal: 0, elimination: 0, total: 0 };
    p.gel_legal = gels.filter(g => g.actif).reduce((a, g) => a + g.nbDocs, 0);
    documents.forEach(d => {
      p.total++;
      if (['disponible','en_consultation','en_traitement','prete'].includes(d.statut)) p.actif++;
      else if (d.statut === 'archivage_inter') p.intermediaire++;
      else if (d.statut === 'archivage_def') p.definitif++;
      else if (d.statut === 'elimine') p.elimination++;
    });
    return p;
  }, [documents, gels]);

  /* ── Calendrier conservation ── */
  const echeances = useMemo(() => {
    const res = [];
    regles.filter(r => r.actif && r.sortFinal === 'destruction').forEach(r => {
      documents.forEach(d => {
        if (d.dateDocument) {
          const yr = parseInt(d.dateDocument.slice(0, 4));
          const ech = yr + r.duaAns;
          const reste = ech - 2025;
          if (reste <= 2 && (d.typeId === r.typeId || (d.categorie && r.typeName.toLowerCase().includes((d.categorie||'').toLowerCase())))) {
            res.push({ doc: d, regle: r, echeance: ech, reste, urgent: reste <= 0 });
          }
        }
      });
    });
    return res.sort((a, b) => a.echeance - b.echeance).slice(0, 20);
  }, [documents, regles]);

  const counts = useMemo(() => ({
    regles: regles.filter(r => r.actif).length,
    pending: eliminations.filter(e => ['proposition','en_validation'].includes(e.statut)).length,
    gels: gels.filter(g => g.actif).length,
    echeances: echeances.filter(e => e.urgent).length,
  }), [regles, eliminations, gels, echeances]);

  /* ── Actions ── */
  const handleValidateElim = useCallback((elimId, niveau, decision, comment) => {
    setEliminations(prev => prev.map(e => {
      if (e.id !== elimId) return e;
      const upd = { ...e, validations: [...(e.validations||[])] };
      const vIdx = upd.validations.findIndex(v => v.niveau === niveau && v.statut === 'en_attente');
      if (vIdx >= 0) upd.validations[vIdx] = { ...upd.validations[vIdx], statut: decision === 'refuse' ? 'refuse' : 'approuve', date: new Date().toISOString().replace('T',' ').slice(0,16), commentaire: comment };
      if (decision === 'refuse') { upd.statut = 'refusee'; upd.motifRefus = comment; }
      else { const np = upd.validations.find(v => v.statut === 'en_attente'); if (!np) upd.statut = 'approuvee'; }
      upd.historique = [...(upd.historique||[]), { date: new Date().toISOString().replace('T',' ').slice(0,16), action: decision === 'refuse' ? `❌ Refusée N${niveau}` : `✓ Approuvé N${niveau}`, auteur: 'Vous', detail: comment || '' }];
      return upd;
    }));
    setShowValidation(null);
  }, []);

  const handleExecute = useCallback((elimId) => {
    setEliminations(prev => prev.map(e => {
      if (e.id !== elimId) return e;
      const now = new Date().toISOString().replace('T',' ').slice(0,16);
      return { ...e, statut:'executee', dateDestruction: now.slice(0,10), historique:[...(e.historique||[]),{date:now,action:'🗑️ Destruction exécutée',auteur:'Vous',detail:'Destruction physique confirmée'}] };
    }));
  }, []);

  const handleCertify = useCallback((elimId) => {
    setEliminations(prev => prev.map(e => {
      if (e.id !== elimId) return e;
      const now = new Date().toISOString().replace('T',' ').slice(0,16);
      const cert = { ref:`CERT-2025-${String(Date.now()).slice(-3)}`, date:now.slice(0,10), methode:'Broyage confidentiel', prestataire:'Service archives', temoin:'DAF', poids:`${(e.volumeMl*0.3).toFixed(1)} kg` };
      return { ...e, statut:'certifiee', certificat:cert, historique:[...(e.historique||[]),{date:now,action:'📜 Certificat émis',auteur:'Vous',detail:cert.ref}] };
    }));
  }, []);

  const handleLeverGel = useCallback((gelId) => {
    setGels(prev => prev.map(g => g.id !== gelId ? g : { ...g, actif:false, dateFin:TODAY, historique:[...(g.historique||[]),{date:new Date().toISOString().replace('T',' ').slice(0,16),action:'🔓 Gel levé',auteur:'Vous',detail:'Levée manuelle'}] }));
  }, []);

  const TABS = [
    { id:'dashboard', label:'Tableau de bord', icon: BarChart3 },
    { id:'regles', label:'Règles DUA', icon: Scale, count: counts.regles },
    { id:'calendrier', label:'Calendrier', icon: Calendar, count: counts.echeances, danger: counts.echeances > 0 },
    { id:'eliminations', label:'Éliminations', icon: Trash2, count: counts.pending },
    { id:'gels', label:'Gels légaux', icon: Lock, count: counts.gels },
    { id:'audit', label:'Audit', icon: History },
  ];

  return (
    <div style={{ fontFamily: FF }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ margin:0, fontSize:isMobile?20:24, fontWeight:700 }}>Cycle de Vie Documentaire</h1>
          <p style={{ margin:'4px 0 0', fontSize:13, color:COLORS.textMut }}>Conservation, archivage, gel légal et élimination réglementaire</p>
        </div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {!isMobile && <Btn icon={Download} variant="outline" size="sm">Exporter</Btn>}
          <Btn icon={Lock} variant="outline" size="sm" onClick={() => setShowNewGel(true)}>Gel légal</Btn>
          <Btn icon={Plus} size="sm" onClick={() => setShowNewElim(true)}>Proposition élimination</Btn>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:2, marginBottom:16, borderBottom:`2px solid ${COLORS.border}`, overflowX:'auto' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setPage(1); }} style={{
            padding:isMobile?'8px 10px':'9px 16px', background:'none', border:'none', cursor:'pointer',
            fontSize:isMobile?11:12, fontWeight:tab===t.id?700:500, whiteSpace:'nowrap',
            color:t.danger?'#dc2626':tab===t.id?COLORS.primary:COLORS.textMut,
            borderBottom:tab===t.id?`2px solid ${t.danger?'#dc2626':COLORS.primary}`:'2px solid transparent',
            marginBottom:-2, fontFamily:FF, display:'flex', alignItems:'center', gap:5,
          }}>
            <t.icon size={13} />{!isMobile && t.label}
            {t.count != null && <span style={{ fontSize:10, padding:'1px 6px', borderRadius:10, fontWeight:700, background:t.danger?'#fef2f2':tab===t.id?COLORS.primaryLighter:'#f1f5f9', color:t.danger?'#dc2626':tab===t.id?COLORS.primary:COLORS.textMut }}>{t.count}</span>}
          </button>
        ))}
      </div>

      {tab === 'dashboard' && <DashboardPanel docPhases={docPhases} regles={regles} eliminations={eliminations} gels={gels} echeances={echeances} isMobile={isMobile} onTabChange={setTab} />}
      {tab === 'regles' && <ReglesPanel regles={regles} isMobile={isMobile} onEdit={setShowRegle} />}
      {tab === 'calendrier' && <CalendrierPanel echeances={echeances} regles={regles} isMobile={isMobile} />}
      {tab === 'eliminations' && <EliminationsPanel eliminations={eliminations} search={search} setSearch={setSearch} isMobile={isMobile} page={page} setPage={setPage} onView={setShowDetail} onValidate={setShowValidation} onExecute={handleExecute} onCertify={handleCertify} onShowCert={setShowCertificat} />}
      {tab === 'gels' && <GelsPanel gels={gels} isMobile={isMobile} onView={setShowGel} onLever={handleLeverGel} />}
      {tab === 'audit' && <AuditPanel eliminations={eliminations} gels={gels} />}

      {/* MODALS */}
      <Modal isOpen={!!showDetail} onClose={() => setShowDetail(null)} title="Détail élimination" width={isMobile?'95vw':720}>
        {showDetail && <ElimDetail elim={showDetail} isMobile={isMobile} onValidate={() => { setShowDetail(null); setShowValidation(showDetail); }} onExecute={handleExecute} onCertify={handleCertify} onShowCert={setShowCertificat} />}
      </Modal>
      <Modal isOpen={!!showValidation} onClose={() => setShowValidation(null)} title="Validation" width={isMobile?'95vw':520}>
        {showValidation && <ValidationPanel elim={showValidation} onValidate={handleValidateElim} onCancel={() => setShowValidation(null)} />}
      </Modal>
      <Modal isOpen={!!showCertificat} onClose={() => setShowCertificat(null)} title="Certificat de destruction" width={isMobile?'95vw':560}>
        {showCertificat && <CertificatPanel elim={showCertificat} />}
      </Modal>
      <Modal isOpen={!!showRegle} onClose={() => setShowRegle(null)} title="Règle de conservation" width={isMobile?'95vw':580}>
        {showRegle && <RegleDetail regle={showRegle} onSave={upd => { setRegles(prev => prev.map(r => r.id === upd.id ? upd : r)); setShowRegle(null); }} />}
      </Modal>
      <Modal isOpen={!!showGel} onClose={() => setShowGel(null)} title="Gel légal" width={isMobile?'95vw':640}>
        {showGel && <GelDetail gel={showGel} onLever={handleLeverGel} />}
      </Modal>
      <Modal isOpen={showNewElim} onClose={() => setShowNewElim(false)} title="Nouvelle proposition d'élimination" width={isMobile?'95vw':640}>
        <NewElimForm regles={regles} isMobile={isMobile} onSave={e => { setEliminations(prev => [e,...prev]); setShowNewElim(false); }} onCancel={() => setShowNewElim(false)} />
      </Modal>
      <Modal isOpen={showNewGel} onClose={() => setShowNewGel(false)} title="Nouveau gel légal" width={isMobile?'95vw':580}>
        <NewGelForm isMobile={isMobile} onSave={g => { setGels(prev => [g,...prev]); setShowNewGel(false); }} onCancel={() => setShowNewGel(false)} />
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════════════ DASHBOARD ═══════════════════════════════════════════════════ */
function DashboardPanel({ docPhases, regles, eliminations, gels, echeances, isMobile, onTabChange }) {
  const activeGels = gels.filter(g => g.actif);
  const pendingElims = eliminations.filter(e => ['proposition','en_validation'].includes(e.statut));
  const totalDestroyed = eliminations.filter(e => ['executee','certifiee'].includes(e.statut)).reduce((a, e) => a + e.nbDocs, 0);
  const urgentEch = echeances.filter(e => e.urgent);

  return (
    <div>
      {/* Phase Diagram */}
      <div style={{ background:'#fff', borderRadius:12, border:`1px solid ${COLORS.border}`, padding:isMobile?16:24, marginBottom:20 }}>
        <div style={{ fontSize:11, fontWeight:600, color:COLORS.textMut, marginBottom:16, textTransform:'uppercase', letterSpacing:.5 }}>Répartition par phase du cycle de vie</div>
        <div style={{ display:'flex', justifyContent:'space-around', alignItems:'center', flexWrap:'wrap', gap:isMobile?12:8 }}>
          {Object.entries(PHASES).map(([id, ph], i) => {
            const count = docPhases[id] || 0;
            const pct = docPhases.total > 0 ? Math.round((count / docPhases.total) * 100) : 0;
            return (
              <React.Fragment key={id}>
                {i > 0 && !isMobile && <ChevronRight size={18} color={COLORS.textMut} style={{ marginTop:-20, flexShrink:0 }} />}
                <div style={{ textAlign:'center', minWidth:isMobile?70:80 }}>
                  <div style={{ width:isMobile?48:56, height:isMobile?48:56, borderRadius:'50%', background:ph.bg, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 8px', border:`2.5px solid ${ph.color}`, position:'relative' }}>
                    <ph.icon size={isMobile?20:24} color={ph.color} />
                    {id === 'gel_legal' && activeGels.length > 0 && <span style={{ position:'absolute', top:-4, right:-4, width:16, height:16, borderRadius:'50%', background:'#dc2626', color:'#fff', fontSize:9, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #fff' }}>{activeGels.length}</span>}
                  </div>
                  <div style={{ fontSize:12, fontWeight:700 }}>{ph.label}</div>
                  <div style={{ fontSize:22, fontWeight:800, color:ph.color }}>{count}</div>
                  <div style={{ fontSize:10, color:COLORS.textMut }}>{pct}%</div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
        {docPhases.total > 0 && (
          <div style={{ marginTop:16, height:8, background:'#f1f5f9', borderRadius:4, overflow:'hidden', display:'flex' }}>
            {Object.entries(PHASES).map(([id, ph]) => { const pct = (docPhases[id]||0)/docPhases.total*100; return pct > 0 ? <div key={id} style={{ width:`${pct}%`, height:'100%', background:ph.color }} title={`${ph.label}: ${docPhases[id]}`} /> : null; })}
          </div>
        )}
      </div>

      {/* KPI */}
      <div style={{ display:'grid', gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(4,1fr)', gap:12, marginBottom:20 }}>
        <KPI icon={Scale} label="Règles DUA actives" value={regles.filter(r => r.actif).length} color="#0c4a6e" bg="#f0f9ff" />
        <KPI icon={AlertCircle} label="Échéances DUA" value={urgentEch.length} color="#dc2626" bg="#fef2f2" sub="à traiter" pulse={urgentEch.length > 0} />
        <KPI icon={Lock} label="Gels actifs" value={activeGels.length} color="#0891b2" bg="#ecfeff" sub={`${activeGels.reduce((a,g) => a+g.nbDocs, 0)} docs gelés`} />
        <KPI icon={Trash2} label="Documents détruits" value={totalDestroyed} color="#475569" bg="#f8fafc" sub="total cumulé" />
      </div>

      {urgentEch.length > 0 && (
        <div style={{ padding:'10px 16px', background:'#fef2f2', border:'1.5px solid #fecaca', borderRadius:10, marginBottom:16, display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
          <AlertTriangle size={16} color="#dc2626" />
          <span style={{ fontSize:13, fontWeight:600, color:'#dc2626' }}>{urgentEch.length} document{urgentEch.length>1?'s':''} ont dépassé leur DUA</span>
          <button onClick={() => onTabChange('calendrier')} style={{ marginLeft:'auto', fontSize:12, fontWeight:600, color:'#dc2626', background:'#fff', border:'1px solid #fecaca', borderRadius:6, padding:'4px 12px', cursor:'pointer', fontFamily:FF }}>Voir →</button>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap:16 }}>
        <div style={{ background:'#fff', borderRadius:12, border:`1px solid ${COLORS.border}`, padding:20 }}>
          <div style={{ fontSize:13, fontWeight:700, marginBottom:14, display:'flex', alignItems:'center', gap:6 }}><Trash2 size={14} color={COLORS.primary} />Éliminations en cours ({pendingElims.length})</div>
          {pendingElims.length === 0 ? <div style={{ padding:24, textAlign:'center', color:COLORS.textMut, fontSize:12 }}>Aucune proposition en attente</div>
            : pendingElims.map(e => { const st = getElimSt(e.statut); return (
              <div key={e.id} onClick={() => onTabChange('eliminations')} style={{ padding:'10px 12px', borderRadius:8, marginBottom:8, background:COLORS.surfaceAlt, border:`1px solid ${COLORS.border}`, cursor:'pointer' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                  <span style={{ fontWeight:600, fontSize:12, fontFamily:'monospace', color:COLORS.primaryLight }}>{e.id}</span>
                  <Badge label={st.label} color={st.color} bg={st.bg} />
                </div>
                <div style={{ fontSize:13, fontWeight:600 }}>{e.titre}</div>
                <div style={{ fontSize:11, color:COLORS.textMut, marginTop:2 }}>{e.nbDocs} docs • {e.volumeMl} ml</div>
              </div>); })}
        </div>
        <div style={{ background:'#fff', borderRadius:12, border:`1px solid ${COLORS.border}`, padding:20 }}>
          <div style={{ fontSize:13, fontWeight:700, marginBottom:14, display:'flex', alignItems:'center', gap:6 }}><Lock size={14} color="#0891b2" />Gels légaux actifs ({activeGels.length})</div>
          {activeGels.length === 0 ? <div style={{ padding:24, textAlign:'center', color:COLORS.textMut, fontSize:12 }}>Aucun gel actif</div>
            : activeGels.map(g => (
              <div key={g.id} onClick={() => onTabChange('gels')} style={{ padding:'10px 12px', borderRadius:8, marginBottom:8, background:'#ecfeff', border:'1px solid #a5f3fc', cursor:'pointer' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                  <span style={{ fontWeight:600, fontSize:12, fontFamily:'monospace', color:'#0891b2' }}>{g.id}</span>
                  <Badge label="Actif" color="#0891b2" bg="#ecfeff" />
                </div>
                <div style={{ fontSize:13, fontWeight:600 }}>{g.titre}</div>
                <div style={{ fontSize:11, color:COLORS.textMut, marginTop:2 }}>🔒 {g.nbDocs} docs • Depuis {g.dateDebut}</div>
              </div>))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════ RÈGLES DUA ═══════════════════════════════════════════════════ */
function ReglesPanel({ regles, isMobile, onEdit }) {
  return (<div>
    <div style={{ padding:'10px 14px', background:'#eff6ff', borderRadius:10, border:'1px solid #bfdbfe', marginBottom:16 }}>
      <div style={{ fontSize:12, fontWeight:700, color:'#2563eb', display:'flex', alignItems:'center', gap:5 }}><Info size={13} />Durée d'Utilité Administrative (DUA)</div>
      <div style={{ fontSize:11, color:'#1e40af', marginTop:4, lineHeight:1.6 }}>La DUA détermine la durée de conservation légale de chaque type documentaire : phase active (accès courant), phase intermédiaire (accès restreint), puis sort final.</div>
    </div>
    <div style={{ background:'#fff', borderRadius:12, border:`1px solid ${COLORS.border}`, overflow:'hidden' }}>
      {isMobile ? regles.map(r => <RegleCard key={r.id} regle={r} onEdit={() => onEdit(r)} />) : (
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead><tr style={{ background:COLORS.surfaceAlt }}>
            {['Type documentaire','DUA','Active','Interméd.','Définitif','Sort final','Fondement',''].map(h => (
              <th key={h} style={{ padding:'10px 12px', textAlign:'left', fontWeight:600, color:COLORS.textSec, fontSize:10, textTransform:'uppercase', letterSpacing:.5 }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>{regles.map(r => { const sf = getSortFinal(r.sortFinal); return (
            <tr key={r.id} style={{ borderBottom:`1px solid ${COLORS.borderLight}` }} onMouseEnter={e => e.currentTarget.style.background='#f8fafc'} onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              <td style={{ padding:'10px 12px' }}><div style={{ fontWeight:600 }}>{r.typeName}</div><div style={{ fontSize:10, color:COLORS.textMut, fontFamily:'monospace' }}>{r.id}</div></td>
              <td style={{ padding:'10px 12px' }}><span style={{ fontSize:16, fontWeight:800, color:r.duaAns>=999?'#4f46e5':r.duaAns<=5?'#dc2626':COLORS.text }}>{r.duaAns>=999?'∞':`${r.duaAns} ans`}</span></td>
              <td style={{ padding:'10px 12px' }}><PhaseBar v={r.phaseActive} t={r.duaAns} c="#059669" l={`${r.phaseActive}a`} /></td>
              <td style={{ padding:'10px 12px' }}><PhaseBar v={r.phaseInter} t={r.duaAns} c="#d97706" l={`${r.phaseInter}a`} /></td>
              <td style={{ padding:'10px 12px' }}><PhaseBar v={r.phaseDef} t={r.duaAns} c="#4f46e5" l={r.phaseDef>=990?'∞':`${r.phaseDef}a`} /></td>
              <td style={{ padding:'10px 12px' }}><Badge label={sf.label} color={sf.color} bg={sf.color+'15'} /></td>
              <td style={{ padding:'10px 12px', fontSize:11, color:COLORS.textMut, maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.fondement}</td>
              <td style={{ padding:'10px 12px' }}><ActBtn icon={Eye} tip="Détail" onClick={() => onEdit(r)} /></td>
            </tr>); })}</tbody>
        </table>)}
    </div>
  </div>);
}

function PhaseBar({ v, t, c, l }) { const pct = t > 0 && t < 999 ? Math.min(100, (v/t)*100) : v > 0 ? 30 : 0; return (<div style={{ display:'flex', alignItems:'center', gap:6 }}><div style={{ width:50, height:6, background:'#f1f5f9', borderRadius:3, overflow:'hidden' }}><div style={{ width:`${pct}%`, height:'100%', background:c, borderRadius:3 }} /></div><span style={{ fontSize:11, fontWeight:600, color:c }}>{l}</span></div>); }

function RegleCard({ regle: r, onEdit }) { const sf = getSortFinal(r.sortFinal); return (<div onClick={onEdit} style={{ padding:14, borderBottom:`1px solid ${COLORS.borderLight}`, cursor:'pointer' }}><div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}><div style={{ fontWeight:700, fontSize:14 }}>{r.typeName}</div><span style={{ fontSize:16, fontWeight:800, color:r.duaAns>=999?'#4f46e5':COLORS.text }}>{r.duaAns>=999?'∞':`${r.duaAns}a`}</span></div><div style={{ display:'flex', gap:6, flexWrap:'wrap', fontSize:11, color:COLORS.textMut }}><span style={{ color:'#059669', fontWeight:600 }}>Active: {r.phaseActive}a</span><span>•</span><span style={{ color:'#d97706', fontWeight:600 }}>Inter: {r.phaseInter}a</span><span>•</span><Badge label={sf.label} color={sf.color} bg={sf.color+'15'} /></div><div style={{ fontSize:10, color:COLORS.textMut, marginTop:4 }}>{r.fondement}</div></div>); }

/* ═══════════════════════════════════════════════════ CALENDRIER ═══════════════════════════════════════════════════ */
function CalendrierPanel({ echeances, regles, isMobile }) {
  const urgent = echeances.filter(e => e.urgent), upcoming = echeances.filter(e => !e.urgent);
  return (<div>
    <div style={{ padding:'10px 14px', background:'#fffbeb', borderRadius:10, border:'1px solid #fde68a', marginBottom:16 }}>
      <div style={{ fontSize:12, fontWeight:700, color:'#d97706', display:'flex', alignItems:'center', gap:5 }}><Calendar size={13} />Calendrier de conservation automatisé</div>
      <div style={{ fontSize:11, color:'#92400e', marginTop:4 }}>Détection automatique des documents ayant atteint ou approchant leur DUA.</div>
    </div>
    {urgent.length > 0 && (<div style={{ marginBottom:20 }}>
      <div style={{ fontSize:13, fontWeight:700, color:'#dc2626', display:'flex', alignItems:'center', gap:6, marginBottom:10 }}><AlertTriangle size={14} />DUA dépassée — Action requise ({urgent.length})</div>
      <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'repeat(2,1fr)', gap:8 }}>{urgent.map((e,i) => <EchCard key={i} ech={e} />)}</div>
    </div>)}
    <div style={{ fontSize:13, fontWeight:700, display:'flex', alignItems:'center', gap:6, marginBottom:10 }}><Clock size={14} color={COLORS.primary} />Échéances à venir ({upcoming.length})</div>
    {upcoming.length === 0 ? <div style={{ padding:32, textAlign:'center', color:COLORS.textMut, fontSize:12 }}>Aucune échéance dans les 2 prochaines années</div>
      : <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'repeat(2,1fr)', gap:8 }}>{upcoming.map((e,i) => <EchCard key={i} ech={e} />)}</div>}
    <div style={{ marginTop:20, padding:16, background:'#fff', borderRadius:12, border:`1px solid ${COLORS.border}` }}>
      <div style={{ fontSize:13, fontWeight:700, marginBottom:14, display:'flex', alignItems:'center', gap:6 }}><PieChart size={14} color={COLORS.primary} />Sort final prévu par règle</div>
      <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>{SORT_FINALS.map(sf => { const count = regles.filter(r => r.sortFinal === sf.id && r.actif).length; return (<div key={sf.id} style={{ display:'flex', alignItems:'center', gap:8 }}><div style={{ width:10, height:10, borderRadius:3, background:sf.color }} /><span style={{ fontSize:12, fontWeight:600 }}>{sf.label}</span><span style={{ fontSize:14, fontWeight:800, color:sf.color }}>{count}</span></div>); })}</div>
    </div>
  </div>);
}

function EchCard({ ech }) {
  const color = ech.urgent?'#dc2626':ech.reste<=1?'#d97706':'#059669'; const bg = ech.urgent?'#fef2f2':ech.reste<=1?'#fffbeb':'#ecfdf5'; const sf = getSortFinal(ech.regle.sortFinal);
  return (<div style={{ padding:'10px 14px', background:bg, borderRadius:10, border:`1.5px solid ${color}30` }}>
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
      <span style={{ fontSize:12, fontWeight:700, fontFamily:'monospace', color }}>{ech.doc.id||'—'}</span>
      <span style={{ fontSize:10, padding:'2px 8px', borderRadius:6, fontWeight:700, background:color+'15', color }}>{ech.urgent?`DÉPASSÉ (${Math.abs(ech.reste)}a)`:`${ech.reste} an${ech.reste>1?'s':''}`}</span>
    </div>
    <div style={{ fontSize:13, fontWeight:600 }}>{ech.doc.titre||ech.doc.id}</div>
    <div style={{ fontSize:11, color:COLORS.textMut, marginTop:4, display:'flex', gap:8, flexWrap:'wrap' }}><span>DUA: {ech.regle.duaAns}a</span><span>•</span><span>Éch: {ech.echeance}</span><span>•</span><Badge label={sf.label} color={sf.color} bg={sf.color+'15'} /></div>
  </div>);
}

/* ═══════════════════════════════════════════════════ ÉLIMINATIONS ═══════════════════════════════════════════════════ */
function EliminationsPanel({ eliminations, search, setSearch, isMobile, page, setPage, onView, onValidate, onExecute, onCertify, onShowCert }) {
  const filtered = useMemo(() => { let r = [...eliminations]; if (search) { const s = search.toLowerCase(); r = r.filter(e => e.id.toLowerCase().includes(s)||e.titre.toLowerCase().includes(s)||e.typeDoc.toLowerCase().includes(s)); } return r.sort((a,b) => (b.dateProposition||'').localeCompare(a.dateProposition||'')); }, [eliminations, search]);
  const perPage = isMobile?6:8, totalPages = Math.max(1, Math.ceil(filtered.length/perPage)), paged = filtered.slice((page-1)*perPage, page*perPage);

  return (<div>
    <div style={{ display:'flex', gap:8, marginBottom:14, alignItems:'center', flexWrap:'wrap' }}>
      <SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Rechercher..." maxWidth={isMobile?'100%':260} />
      <span style={{ fontSize:12, color:COLORS.textMut, marginLeft:'auto' }}>{filtered.length} proposition{filtered.length!==1?'s':''}</span>
    </div>
    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
      {paged.map(e => { const st = getElimSt(e.statut); return (
        <div key={e.id} onClick={() => onView(e)} style={{ padding:14, background:'#fff', borderRadius:12, border:`1.5px solid ${COLORS.border}`, cursor:'pointer', borderLeft:`4px solid ${st.color}` }} onMouseEnter={ev => ev.currentTarget.style.background='#f8fafc'} onMouseLeave={ev => ev.currentTarget.style.background='#fff'}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
            <div><span style={{ fontSize:11, fontFamily:'monospace', fontWeight:600, color:COLORS.primaryLight }}>{e.id}</span><div style={{ fontSize:14, fontWeight:700, marginTop:2 }}>{e.titre}</div></div>
            <Badge label={st.label} color={st.color} bg={st.bg} />
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap', fontSize:12, color:COLORS.textMut }}>
            <span>{e.nbDocs} docs</span><span>•</span><span>{e.volumeMl} ml</span><span>•</span><span>{e.service}</span><span>•</span><span>{e.dateProposition}</span>
            {e.certificat && <span style={{ color:'#4f46e5', fontWeight:600, cursor:'pointer' }} onClick={ev => { ev.stopPropagation(); onShowCert(e); }}>📜 {e.certificat.ref}</span>}
          </div>
          <div style={{ display:'flex', gap:4, marginTop:8, justifyContent:'flex-end' }} onClick={ev => ev.stopPropagation()}>
            {e.statut === 'en_validation' && <Btn icon={Stamp} size="sm" onClick={() => onValidate(e)}>Valider</Btn>}
            {e.statut === 'approuvee' && <Btn icon={Trash2} size="sm" variant="danger" onClick={() => onExecute(e.id)}>Détruire</Btn>}
            {e.statut === 'executee' && <Btn icon={FileCheck} size="sm" onClick={() => onCertify(e.id)}>Certifier</Btn>}
          </div>
        </div>); })}
      {paged.length === 0 && <div style={{ padding:48, textAlign:'center', color:COLORS.textMut }}><Trash2 size={28} strokeWidth={1.2} style={{ opacity:.3, marginBottom:8 }} /><div style={{ fontSize:13, fontWeight:600 }}>Aucune proposition</div></div>}
    </div>
    <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
  </div>);
}

/* ═══════════════════════════════════════════════════ GELS LÉGAUX ═══════════════════════════════════════════════════ */
function GelsPanel({ gels, isMobile, onView, onLever }) {
  const actifs = gels.filter(g => g.actif), inactifs = gels.filter(g => !g.actif);
  return (<div>
    <div style={{ padding:'10px 14px', background:'#ecfeff', borderRadius:10, border:'1px solid #a5f3fc', marginBottom:16 }}>
      <div style={{ fontSize:12, fontWeight:700, color:'#0891b2', display:'flex', alignItems:'center', gap:5 }}><ShieldAlert size={13} />Gel légal (Legal Hold)</div>
      <div style={{ fontSize:11, color:'#155e75', marginTop:4 }}>Suspend toute destruction ou transfert de documents impliqués dans un contentieux, audit ou procédure juridique.</div>
    </div>
    {actifs.length > 0 && (<div style={{ marginBottom:20 }}>
      <div style={{ fontSize:13, fontWeight:700, color:'#0891b2', display:'flex', alignItems:'center', gap:6, marginBottom:10 }}><Lock size={14} />Gels actifs ({actifs.length})</div>
      {actifs.map(g => <GelCard key={g.id} gel={g} onView={() => onView(g)} onLever={() => onLever(g.id)} />)}
    </div>)}
    {inactifs.length > 0 && (<div>
      <div style={{ fontSize:13, fontWeight:700, color:COLORS.textMut, display:'flex', alignItems:'center', gap:6, marginBottom:10 }}><History size={14} />Historique ({inactifs.length})</div>
      {inactifs.map(g => <GelCard key={g.id} gel={g} onView={() => onView(g)} />)}
    </div>)}
    {gels.length === 0 && <div style={{ padding:48, textAlign:'center', color:COLORS.textMut }}><Lock size={28} strokeWidth={1.2} style={{ opacity:.3, marginBottom:8 }} /><div style={{ fontSize:13, fontWeight:600 }}>Aucun gel enregistré</div></div>}
  </div>);
}

function GelCard({ gel: g, onView, onLever }) {
  return (<div onClick={onView} style={{ padding:14, background:g.actif?'#ecfeff':'#f8fafc', borderRadius:12, border:`1.5px solid ${g.actif?'#a5f3fc':COLORS.border}`, marginBottom:8, cursor:'pointer', borderLeft:`4px solid ${g.actif?'#0891b2':'#94a3b8'}` }}>
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
      <div><span style={{ fontSize:11, fontFamily:'monospace', fontWeight:600, color:g.actif?'#0891b2':COLORS.textMut }}>{g.id}</span><div style={{ fontSize:14, fontWeight:700, marginTop:2 }}>{g.titre}</div></div>
      <Badge label={g.actif?'🔒 Actif':'🔓 Levé'} color={g.actif?'#0891b2':'#94a3b8'} bg={g.actif?'#ecfeff':'#f8fafc'} />
    </div>
    <div style={{ fontSize:12, color:COLORS.textSec, marginBottom:4 }}>{g.motif}</div>
    <div style={{ display:'flex', gap:8, alignItems:'center', fontSize:11, color:COLORS.textMut, flexWrap:'wrap' }}>
      <span>🔒 {g.nbDocs} docs</span><span>•</span><span>Ref: {g.refJuridique}</span><span>•</span><span>Depuis: {g.dateDebut}</span>
      {g.dateFin && <><span>•</span><span>Fin: {g.dateFin}</span></>}
    </div>
    {g.actif && onLever && <div style={{ marginTop:8, display:'flex', justifyContent:'flex-end' }} onClick={ev => ev.stopPropagation()}><Btn icon={Lock} variant="outline" size="sm" onClick={onLever}>Lever le gel</Btn></div>}
  </div>);
}

/* ═══════════════════════════════════════════════════ AUDIT ═══════════════════════════════════════════════════ */
function AuditPanel({ eliminations, gels }) {
  const all = useMemo(() => {
    const ev = [];
    eliminations.forEach(e => (e.historique||[]).forEach(h => ev.push({...h, source:'elim', ref:e.id, titre:e.titre})));
    gels.forEach(g => (g.historique||[]).forEach(h => ev.push({...h, source:'gel', ref:g.id, titre:g.titre})));
    return ev.sort((a,b) => (b.date||'').localeCompare(a.date||''));
  }, [eliminations, gels]);

  return (<div>
    <div style={{ fontSize:11, fontWeight:600, color:COLORS.textMut, marginBottom:12, textTransform:'uppercase', letterSpacing:.5, display:'flex', alignItems:'center', gap:4 }}><History size={12} />Journal d'audit — {all.length} événements</div>
    <div style={{ maxHeight:600, overflowY:'auto', background:'#fff', borderRadius:12, border:`1px solid ${COLORS.border}`, padding:16 }}>
      {all.map((h,i) => { const isDest = h.action.includes('🗑️'); const isCert = h.action.includes('📜'); const isGel = h.source === 'gel'; const isSys = h.auteur === 'Système';
        const dot = isDest?'#dc2626':isCert?'#4f46e5':isGel?'#0891b2':isSys?'#d97706':COLORS.primaryLight;
        return (<div key={i} style={{ display:'flex', gap:10, padding:'9px 0', borderBottom:i<all.length-1?`1px solid ${COLORS.borderLight}`:'none' }}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}><div style={{ width:8, height:8, borderRadius:'50%', background:dot, flexShrink:0 }} />{i<all.length-1 && <div style={{ width:1, flex:1, background:COLORS.borderLight }} />}</div>
          <div style={{ flex:1, paddingBottom:4 }}><div style={{ fontSize:12, fontWeight:600, color:isDest?'#dc2626':isCert?'#4f46e5':COLORS.text }}>{h.action}</div><div style={{ fontSize:10, color:COLORS.textMut, display:'flex', gap:8, marginTop:2 }}><span>{h.date}</span><span style={{ fontWeight:600, color:isSys?'#d97706':COLORS.textSec }}>{h.auteur}</span><span style={{ fontFamily:'monospace', color:isGel?'#0891b2':COLORS.primaryLight }}>{h.ref}</span></div>{h.detail && <div style={{ fontSize:11, color:COLORS.textSec, marginTop:2, padding:'4px 8px', background:COLORS.surfaceAlt, borderRadius:4 }}>{h.detail}</div>}</div>
        </div>); })}
    </div>
  </div>);
}

/* ═══════════════════════════════════════════════════ DETAIL ÉLIM ═══════════════════════════════════════════════════ */
function ElimDetail({ elim: e, isMobile, onValidate, onExecute, onCertify, onShowCert }) {
  const [dtab, setDtab] = useState('info'); const st = getElimSt(e.statut);
  const wfSteps = useMemo(() => {
    const s = [{label:'Proposition',done:true,date:e.dateProposition}];
    (e.validations||[]).forEach(v => s.push({label:v.role.includes('Archives')?'Visa rég.':`Valid. N${v.niveau}`,done:v.statut!=='en_attente',refused:v.statut==='refuse',date:v.date}));
    if (e.statut!=='refusee') { s.push({label:'Bordereau',done:['approuvee','executee','certifiee'].includes(e.statut)}); s.push({label:'Destruction',done:['executee','certifiee'].includes(e.statut),date:e.dateDestruction}); s.push({label:'Certificat',done:e.statut==='certifiee'}); }
    return s;
  }, [e]);

  return (<div>
    <div style={{ display:'flex', gap:12, alignItems:'flex-start', marginBottom:14 }}>
      <div style={{ width:44, height:44, borderRadius:10, background:st.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{React.createElement(st.icon, {size:20,color:st.color})}</div>
      <div style={{ flex:1 }}><div style={{ fontSize:16, fontWeight:700 }}>{e.titre}</div><div style={{ fontSize:11, color:COLORS.textMut, display:'flex', gap:6, alignItems:'center', flexWrap:'wrap', marginTop:2 }}><span style={{ fontFamily:'monospace', fontWeight:600 }}>{e.id}</span><Badge label={st.label} color={st.color} bg={st.bg} /></div></div>
    </div>
    {/* Stepper */}
    <div style={{ padding:'12px 14px', background:COLORS.surfaceAlt, borderRadius:10, marginBottom:14, overflowX:'auto' }}>
      <div style={{ display:'flex', alignItems:'center', gap:0, minWidth:'fit-content' }}>
        {wfSteps.map((s,i) => (<React.Fragment key={i}>{i>0 && <div style={{ width:24, height:2, background:s.done?(s.refused?'#fecaca':'#86efac'):COLORS.border, flexShrink:0 }} />}<div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, flexShrink:0 }}><div style={{ width:26, height:26, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background:s.refused?'#fef2f2':s.done?'#ecfdf5':'#f8fafc', border:`2px solid ${s.refused?'#dc2626':s.done?'#059669':COLORS.border}` }}>{s.refused?<X size={12} color="#dc2626" />:s.done?<Check size={12} color="#059669" />:<Clock size={12} color={COLORS.textMut} />}</div><span style={{ fontSize:9, fontWeight:600, color:s.done?COLORS.text:COLORS.textMut, whiteSpace:'nowrap' }}>{s.label}</span></div></React.Fragment>))}
      </div>
    </div>
    {/* Tabs */}
    <div style={{ display:'flex', gap:2, marginBottom:14, borderBottom:`1.5px solid ${COLORS.border}` }}>
      {[{id:'info',label:'Informations',icon:Info},{id:'validations',label:`Validations (${(e.validations||[]).length})`,icon:Stamp},{id:'audit',label:`Audit (${(e.historique||[]).length})`,icon:History}].map(t => (
        <button key={t.id} onClick={() => setDtab(t.id)} style={{ padding:'7px 14px', border:'none', background:'none', cursor:'pointer', fontSize:12, fontWeight:dtab===t.id?700:500, fontFamily:FF, color:dtab===t.id?COLORS.primary:COLORS.textMut, borderBottom:dtab===t.id?`2px solid ${COLORS.primary}`:'2px solid transparent', marginBottom:-1.5, display:'flex', alignItems:'center', gap:4 }}><t.icon size={13} />{t.label}</button>
      ))}
    </div>
    {dtab === 'info' && (<div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap:10, marginBottom:14 }}>
      <InfoBlk label="Type documentaire" value={e.typeDoc} /><InfoBlk label="Règle" value={e.regle} mono />
      <InfoBlk label="Nb documents" value={e.nbDocs} /><InfoBlk label="Volume" value={`${e.volumeMl} ml`} />
      <InfoBlk label="Service" value={e.service} /><InfoBlk label="Proposé par" value={e.proposePar} />
      <InfoBlk label="Date proposition" value={e.dateProposition} /><InfoBlk label="Échéance DUA" value={e.dateEcheanceDUA} />
      <InfoBlk label="Motif" value={e.motif} span />{e.motifRefus && <InfoBlk label="Motif de refus" value={e.motifRefus} span accent />}
      {e.dateDestruction && <InfoBlk label="Date destruction" value={e.dateDestruction} />}
      {e.certificat && <div style={{ gridColumn:'1/-1', padding:'10px 14px', background:'#eef2ff', borderRadius:10, border:'1px solid #c7d2fe', display:'flex', alignItems:'center', gap:10, cursor:'pointer' }} onClick={() => onShowCert(e)}><FileCheck size={16} color="#4f46e5" /><div style={{ flex:1 }}><div style={{ fontSize:10, fontWeight:600, color:'#4f46e5', textTransform:'uppercase' }}>Certificat de destruction</div><div style={{ fontSize:13, fontWeight:600 }}>{e.certificat.ref}</div></div></div>}
    </div>)}
    {dtab === 'validations' && <div style={{ marginBottom:14 }}>{(e.validations||[]).map((v,i) => (
      <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderBottom:`1px solid ${COLORS.borderLight}` }}>
        <div style={{ width:30, height:30, borderRadius:'50%', background:v.statut==='approuve'?'#ecfdf5':v.statut==='refuse'?'#fef2f2':'#fffbeb', border:`2px solid ${v.statut==='approuve'?'#059669':v.statut==='refuse'?'#dc2626':'#d97706'}`, display:'flex', alignItems:'center', justifyContent:'center' }}>{v.statut==='approuve'?<Check size={14} color="#059669" />:v.statut==='refuse'?<X size={14} color="#dc2626" />:<Clock size={14} color="#d97706" />}</div>
        <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:600 }}>N{v.niveau} — {v.valideur} ({v.role})</div><div style={{ fontSize:11, color:COLORS.textMut }}>{v.statut==='approuve'?'✓ Approuvé':v.statut==='refuse'?'✗ Refusé':'⏳ En attente'}{v.date&&` — ${v.date}`}</div>{v.commentaire && <div style={{ fontSize:11, color:COLORS.textSec, fontStyle:'italic', marginTop:2 }}>"{v.commentaire}"</div>}</div>
      </div>))}</div>}
    {dtab === 'audit' && <div style={{ marginBottom:14, maxHeight:300, overflowY:'auto' }}>{(e.historique||[]).map((h,i) => { const isDest=h.action.includes('🗑️'); const isCert=h.action.includes('📜'); return (
      <div key={i} style={{ display:'flex', gap:10, padding:'9px 0', borderBottom:i<e.historique.length-1?`1px solid ${COLORS.borderLight}`:'none' }}>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}><div style={{ width:8, height:8, borderRadius:'50%', background:isDest?'#dc2626':isCert?'#4f46e5':COLORS.primaryLight, flexShrink:0 }} />{i<e.historique.length-1 && <div style={{ width:1, flex:1, background:COLORS.borderLight }} />}</div>
        <div style={{ flex:1, paddingBottom:4 }}><div style={{ fontSize:12, fontWeight:600, color:isDest?'#dc2626':isCert?'#4f46e5':COLORS.text }}>{h.action}</div><div style={{ fontSize:10, color:COLORS.textMut, display:'flex', gap:8, marginTop:2 }}><span>{h.date}</span><span style={{ fontWeight:600 }}>{h.auteur}</span></div>{h.detail && <div style={{ fontSize:11, color:COLORS.textSec, marginTop:2, padding:'4px 8px', background:COLORS.surfaceAlt, borderRadius:4 }}>{h.detail}</div>}</div>
      </div>); })}</div>}
    {/* Actions */}
    <div style={{ display:'flex', gap:8, justifyContent:'flex-end', borderTop:`1px solid ${COLORS.border}`, paddingTop:12, flexWrap:'wrap' }}>
      {e.statut==='en_validation' && <Btn icon={Stamp} size="sm" onClick={onValidate}>Valider</Btn>}
      {e.statut==='approuvee' && <Btn icon={Trash2} size="sm" variant="danger" onClick={() => onExecute(e.id)}>Exécuter</Btn>}
      {e.statut==='executee' && <Btn icon={FileCheck} size="sm" onClick={() => onCertify(e.id)}>Certifier</Btn>}
      {e.certificat && <Btn icon={Printer} variant="outline" size="sm" onClick={() => onShowCert(e)}>Certificat</Btn>}
      <Btn icon={ScrollText} variant="outline" size="sm">Bordereau</Btn>
      <Btn icon={Printer} variant="outline" size="sm">Imprimer</Btn>
    </div>
  </div>);
}

/* ═══════════════════════════════════════════════════ CERTIFICAT ═══════════════════════════════════════════════════ */
function CertificatPanel({ elim }) {
  if (!elim?.certificat) return <div style={{ padding:20, textAlign:'center', color:COLORS.textMut }}>Aucun certificat</div>;
  const c = elim.certificat;
  return (<div>
    <div style={{ padding:20, background:'#fff', borderRadius:12, border:'2px solid #4f46e5', position:'relative' }}>
      <div style={{ position:'absolute', top:12, right:12, width:48, height:48, borderRadius:'50%', background:'#eef2ff', display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #4f46e5' }}><FileCheck size={22} color="#4f46e5" /></div>
      <div style={{ fontSize:9, fontWeight:600, color:'#4f46e5', textTransform:'uppercase', letterSpacing:1.5, marginBottom:4 }}>Certificat de Destruction</div>
      <div style={{ fontSize:20, fontWeight:800, fontFamily:'monospace', color:'#4f46e5', marginBottom:16 }}>{c.ref}</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
        <CF l="Réf. élimination" v={elim.id} /><CF l="Date destruction" v={c.date} />
        <CF l="Type documentaire" v={elim.typeDoc} /><CF l="Nb documents" v={elim.nbDocs} />
        <CF l="Volume" v={`${elim.volumeMl} ml — ${c.poids}`} /><CF l="Service" v={elim.service} />
        <CF l="Méthode" v={c.methode} /><CF l="Prestataire" v={c.prestataire} /><CF l="Témoin" v={c.temoin} />
      </div>
      <div style={{ borderTop:'2px dashed #c7d2fe', paddingTop:12, marginTop:12 }}>
        <div style={{ fontSize:11, color:COLORS.textMut, lineHeight:1.6 }}>
          Je soussigné, <strong>{c.temoin}</strong>, certifie que les <strong>{elim.nbDocs} documents</strong> du bordereau <strong>{elim.id}</strong> ont été détruits par <strong>{c.methode.toLowerCase()}</strong> le <strong>{c.date}</strong> par <strong>{c.prestataire}</strong>, conformément aux règles de conservation.
        </div>
      </div>
    </div>
    <div style={{ display:'flex', gap:8, justifyContent:'flex-end', marginTop:12 }}><Btn icon={Printer} variant="outline" size="sm">Imprimer</Btn><Btn icon={Download} variant="outline" size="sm">PDF</Btn></div>
  </div>);
}
function CF({ l, v }) { return (<div><div style={{ fontSize:9, fontWeight:600, color:COLORS.textMut, textTransform:'uppercase', letterSpacing:.3, marginBottom:2 }}>{l}</div><div style={{ fontSize:13, fontWeight:600 }}>{v||'—'}</div></div>); }

/* ═══════════════════════════════════════════════════ VALIDATION ═══════════════════════════════════════════════════ */
function ValidationPanel({ elim, onValidate, onCancel }) {
  const [comment, setComment] = useState('');
  const pending = (elim.validations||[]).find(v => v.statut === 'en_attente');
  if (!pending) return <div style={{ padding:20, textAlign:'center', color:COLORS.textMut }}>Aucune validation en attente</div>;
  return (<div>
    <div style={{ padding:14, background:COLORS.surfaceAlt, borderRadius:10, marginBottom:16 }}>
      <div style={{ fontSize:14, fontWeight:700 }}>{elim.titre}</div>
      <div style={{ fontSize:12, color:COLORS.textMut, marginTop:4 }}>{elim.nbDocs} documents • {elim.volumeMl} ml • {elim.typeDoc}</div>
      <div style={{ fontSize:12, color:COLORS.textSec, marginTop:4 }}>Motif : {elim.motif}</div>
    </div>
    <div style={{ padding:14, background:'#fffbeb', borderRadius:10, marginBottom:16, border:'1px solid #fde68a' }}>
      <div style={{ fontSize:12, fontWeight:700, color:'#d97706', display:'flex', alignItems:'center', gap:6 }}><Shield size={14} />Validation N{pending.niveau} — {pending.role}</div>
      <div style={{ fontSize:12, color:COLORS.textSec, marginTop:4 }}>Valideur : {pending.valideur}</div>
    </div>
    <div style={{ marginBottom:16 }}><label style={labelStyle}>Commentaire</label><textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} placeholder="Commentaire..." style={{ ...inputStyle, resize:'vertical' }} /></div>
    <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
      <Btn variant="outline" size="sm" onClick={onCancel}>Annuler</Btn>
      <Btn variant="danger" icon={XCircle} size="sm" onClick={() => onValidate(elim.id, pending.niveau, 'refuse', comment)}>Refuser</Btn>
      <Btn variant="success" icon={CheckCircle2} size="sm" onClick={() => onValidate(elim.id, pending.niveau, 'approuve', comment)}>Approuver</Btn>
    </div>
  </div>);
}

/* ═══════════════════════════════════════════════════ RÈGLE DETAIL ═══════════════════════════════════════════════════ */
function RegleDetail({ regle: r, onSave }) {
  const [form, setForm] = useState({...r});
  const up = (k,v) => setForm(p => ({...p, [k]:v}));
  return (<div>
    <div style={{ padding:14, background:COLORS.surfaceAlt, borderRadius:10, marginBottom:16 }}><div style={{ fontSize:16, fontWeight:700 }}>{r.typeName}</div><div style={{ fontSize:11, fontFamily:'monospace', color:COLORS.textMut }}>{r.id}</div></div>
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
      <div><label style={labelStyle}>DUA (années)</label><input type="number" value={form.duaAns} onChange={e => up('duaAns', parseInt(e.target.value)||0)} style={inputStyle} /></div>
      <div><label style={labelStyle}>Sort final</label><select value={form.sortFinal} onChange={e => up('sortFinal', e.target.value)} style={inputStyle}>{SORT_FINALS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}</select></div>
      <div><label style={labelStyle}>Phase active (ans)</label><input type="number" value={form.phaseActive} onChange={e => up('phaseActive', parseInt(e.target.value)||0)} style={inputStyle} /></div>
      <div><label style={labelStyle}>Phase interméd. (ans)</label><input type="number" value={form.phaseInter} onChange={e => up('phaseInter', parseInt(e.target.value)||0)} style={inputStyle} /></div>
      <div><label style={labelStyle}>Phase définitive (ans)</label><input type="number" value={form.phaseDef} onChange={e => up('phaseDef', parseInt(e.target.value)||0)} style={inputStyle} /></div>
      <div><label style={labelStyle}>Actif</label><label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:13 }}><input type="checkbox" checked={form.actif} onChange={e => up('actif', e.target.checked)} />Règle active</label></div>
      <div style={{ gridColumn:'1/-1' }}><label style={labelStyle}>Fondement juridique</label><input value={form.fondement} onChange={e => up('fondement', e.target.value)} style={inputStyle} /></div>
      <div style={{ gridColumn:'1/-1' }}><label style={labelStyle}>Observations</label><textarea value={form.observations} onChange={e => up('observations', e.target.value)} rows={2} style={{ ...inputStyle, resize:'vertical' }} /></div>
    </div>
    {/* Timeline DUA */}
    <div style={{ padding:14, background:'#f0f9ff', borderRadius:10, border:'1px solid #bae6fd', marginBottom:16 }}>
      <div style={{ fontSize:10, fontWeight:600, color:'#0369a1', textTransform:'uppercase', marginBottom:8 }}>Ligne de temps DUA</div>
      <div style={{ display:'flex', alignItems:'center', gap:0, height:28 }}>
        {form.phaseActive > 0 && <div style={{ flex:form.phaseActive, height:'100%', background:'#059669', borderRadius:'6px 0 0 6px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#fff', minWidth:40 }}>{form.phaseActive}a</div>}
        {form.phaseInter > 0 && <div style={{ flex:form.phaseInter, height:'100%', background:'#d97706', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#fff', minWidth:40 }}>{form.phaseInter}a</div>}
        {form.phaseDef > 0 && form.phaseDef < 990 && <div style={{ flex:form.phaseDef, height:'100%', background:'#4f46e5', borderRadius:'0 6px 6px 0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#fff', minWidth:40 }}>{form.phaseDef}a</div>}
        {form.phaseDef >= 990 && <div style={{ flex:3, height:'100%', background:'#4f46e5', borderRadius:'0 6px 6px 0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#fff', minWidth:40 }}>∞</div>}
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', marginTop:4, fontSize:9, color:COLORS.textMut }}><span>Création</span><span>→ Sort final: {getSortFinal(form.sortFinal).label}</span></div>
    </div>
    <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}><Btn icon={Save} size="sm" onClick={() => onSave(form)}>Enregistrer</Btn></div>
  </div>);
}

/* ═══════════════════════════════════════════════════ GEL DETAIL ═══════════════════════════════════════════════════ */
function GelDetail({ gel: g, onLever }) {
  return (<div>
    <div style={{ display:'flex', gap:12, alignItems:'flex-start', marginBottom:14 }}>
      <div style={{ width:44, height:44, borderRadius:10, background:g.actif?'#ecfeff':'#f8fafc', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, border:`2px solid ${g.actif?'#0891b2':'#94a3b8'}` }}><Lock size={20} color={g.actif?'#0891b2':'#94a3b8'} /></div>
      <div style={{ flex:1 }}><div style={{ fontSize:16, fontWeight:700 }}>{g.titre}</div><div style={{ fontSize:11, color:COLORS.textMut, display:'flex', gap:6, alignItems:'center', flexWrap:'wrap', marginTop:2 }}><span style={{ fontFamily:'monospace', fontWeight:600 }}>{g.id}</span><Badge label={g.actif?'🔒 Actif':'🔓 Levé'} color={g.actif?'#0891b2':'#94a3b8'} bg={g.actif?'#ecfeff':'#f8fafc'} /></div></div>
    </div>
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
      <InfoBlk label="Motif" value={g.motif} span /><InfoBlk label="Référence juridique" value={g.refJuridique} mono />
      <InfoBlk label="Demandé par" value={g.demandePar} /><InfoBlk label="Service" value={g.service} />
      <InfoBlk label="Date début" value={g.dateDebut} /><InfoBlk label="Date fin" value={g.dateFin||'Indéterminée'} />
      <InfoBlk label="Documents gelés" value={`🔒 ${g.nbDocs}`} /><InfoBlk label="Types" value={g.typeDocs} />
      <InfoBlk label="Périmètre" value={g.scope} span />
    </div>
    <div style={{ fontSize:11, fontWeight:600, color:COLORS.textMut, marginBottom:8, textTransform:'uppercase', display:'flex', alignItems:'center', gap:4 }}><History size={11} />Historique</div>
    <div style={{ marginBottom:14, maxHeight:200, overflowY:'auto' }}>
      {(g.historique||[]).map((h,i) => (<div key={i} style={{ display:'flex', gap:10, padding:'8px 0', borderBottom:i<g.historique.length-1?`1px solid ${COLORS.borderLight}`:'none' }}><div style={{ width:8, height:8, borderRadius:'50%', background:'#0891b2', flexShrink:0, marginTop:4 }} /><div><div style={{ fontSize:12, fontWeight:600 }}>{h.action}</div><div style={{ fontSize:10, color:COLORS.textMut }}>{h.date} — {h.auteur}</div>{h.detail && <div style={{ fontSize:11, color:COLORS.textSec, marginTop:2 }}>{h.detail}</div>}</div></div>))}
    </div>
    {g.actif && <div style={{ display:'flex', gap:8, justifyContent:'flex-end', borderTop:`1px solid ${COLORS.border}`, paddingTop:12 }}><Btn icon={Lock} variant="outline" size="sm" onClick={() => onLever(g.id)}>Lever le gel</Btn></div>}
  </div>);
}

/* ═══════════════════════════════════════════════════ NEW ELIM ═══════════════════════════════════════════════════ */
function NewElimForm({ regles, isMobile, onSave, onCancel }) {
  const [form, setForm] = useState({ titre:'', regle:'', typeDoc:'', nbDocs:'', volumeMl:'', service:'Direction Générale', motif:'', niveaux:1, valideur1:'', role1:'DAF', valideur2:'', role2:'Archives nationales' });
  const [errors, setErrors] = useState({});
  const up = (k,v) => { setForm(p => ({...p,[k]:v})); setErrors(p => ({...p,[k]:undefined})); };
  const handleRegle = (id) => { const r = regles.find(rr => rr.id===id); if(r) up('typeDoc', r.typeName); up('regle', id); };
  const validate = () => { const e={}; if(!form.titre.trim()) e.titre='Requis'; if(!form.nbDocs) e.nbDocs='Requis'; if(!form.motif.trim()) e.motif='Requis'; setErrors(e); return !Object.keys(e).length; };
  const submit = () => { if(!validate()) return; const vals=[]; if(form.valideur1) vals.push({niveau:1,valideur:form.valideur1,role:form.role1,statut:'en_attente',date:null}); if(form.niveaux>=2&&form.valideur2) vals.push({niveau:2,valideur:form.valideur2,role:form.role2,statut:'en_attente',date:null});
    onSave({ id:`ELIM-2025-${String(Date.now()).slice(-3)}`, titre:form.titre, typeDoc:form.typeDoc, regle:form.regle||null, nbDocs:parseInt(form.nbDocs)||0, volumeMl:parseInt(form.volumeMl)||0, service:form.service, statut:vals.length?'en_validation':'proposition', dateProposition:TODAY, dateEcheanceDUA:null, motif:form.motif, proposePar:'Vous', validations:vals, historique:[{date:new Date().toISOString().replace('T',' ').slice(0,16),action:'Proposition créée',auteur:'Vous',detail:form.motif}] }); };
  return (<div>
    <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap:12, marginBottom:16 }}>
      <div style={{ gridColumn:'1/-1' }}><label style={labelStyle}>Titre *</label><input value={form.titre} onChange={e => up('titre', e.target.value)} placeholder="Ex: Notes de service 2019" style={{...inputStyle, borderColor:errors.titre?'#dc2626':COLORS.border}} /></div>
      <div><label style={labelStyle}>Règle applicable</label><select value={form.regle} onChange={e => handleRegle(e.target.value)} style={inputStyle}><option value="">— Sélectionner —</option>{regles.filter(r => r.actif).map(r => <option key={r.id} value={r.id}>{r.typeName} (DUA {r.duaAns}a)</option>)}</select></div>
      <div><label style={labelStyle}>Type documentaire</label><input value={form.typeDoc} onChange={e => up('typeDoc', e.target.value)} style={inputStyle} /></div>
      <div><label style={labelStyle}>Nb documents *</label><input type="number" value={form.nbDocs} onChange={e => up('nbDocs', e.target.value)} style={{...inputStyle, borderColor:errors.nbDocs?'#dc2626':COLORS.border}} /></div>
      <div><label style={labelStyle}>Volume (ml)</label><input type="number" value={form.volumeMl} onChange={e => up('volumeMl', e.target.value)} style={inputStyle} /></div>
      <div><label style={labelStyle}>Service</label><select value={form.service} onChange={e => up('service', e.target.value)} style={inputStyle}>{SERVICES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
      <div><label style={labelStyle}>Niveaux validation</label><select value={form.niveaux} onChange={e => up('niveaux', parseInt(e.target.value))} style={inputStyle}><option value={0}>Aucun</option><option value={1}>1 niveau</option><option value={2}>2 niveaux</option></select></div>
      <div style={{ gridColumn:'1/-1' }}><label style={labelStyle}>Motif *</label><textarea value={form.motif} onChange={e => up('motif', e.target.value)} rows={2} style={{...inputStyle, resize:'vertical', borderColor:errors.motif?'#dc2626':COLORS.border}} /></div>
      {form.niveaux>=1 && <><div><label style={labelStyle}>Valideur N1</label><input value={form.valideur1} onChange={e => up('valideur1', e.target.value)} style={inputStyle} /></div><div><label style={labelStyle}>Rôle N1</label><input value={form.role1} onChange={e => up('role1', e.target.value)} style={inputStyle} /></div></>}
      {form.niveaux>=2 && <><div><label style={labelStyle}>Valideur N2</label><input value={form.valideur2} onChange={e => up('valideur2', e.target.value)} style={inputStyle} /></div><div><label style={labelStyle}>Rôle N2</label><input value={form.role2} onChange={e => up('role2', e.target.value)} style={inputStyle} /></div></>}
    </div>
    <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}><Btn variant="outline" size="sm" onClick={onCancel}>Annuler</Btn><Btn icon={Save} size="sm" onClick={submit}>Soumettre</Btn></div>
  </div>);
}

/* ═══════════════════════════════════════════════════ NEW GEL ═══════════════════════════════════════════════════ */
function NewGelForm({ isMobile, onSave, onCancel }) {
  const [form, setForm] = useState({ titre:'', motif:'', refJuridique:'', demandePar:'', service:'Juridique', nbDocs:'', typeDocs:'', scope:'' });
  const [errors, setErrors] = useState({});
  const up = (k,v) => { setForm(p => ({...p,[k]:v})); setErrors(p => ({...p,[k]:undefined})); };
  const validate = () => { const e={}; if(!form.titre.trim()) e.titre='Requis'; if(!form.motif.trim()) e.motif='Requis'; if(!form.refJuridique.trim()) e.refJuridique='Requis'; setErrors(e); return !Object.keys(e).length; };
  const submit = () => { if(!validate()) return; onSave({ id:`GEL-2025-${String(Date.now()).slice(-3)}`, titre:form.titre, motif:form.motif, refJuridique:form.refJuridique, demandePar:form.demandePar||'Vous', service:form.service, dateDebut:TODAY, dateFin:null, actif:true, nbDocs:parseInt(form.nbDocs)||0, typeDocs:form.typeDocs, scope:form.scope, historique:[{date:new Date().toISOString().replace('T',' ').slice(0,16),action:'Gel activé',auteur:'Vous',detail:form.motif},{date:new Date().toISOString().replace('T',' ').slice(0,16),action:`🔒 ${form.nbDocs||0} documents gelés`,auteur:'Système',detail:''}] }); };
  return (<div>
    <div style={{ padding:'10px 14px', background:'#ecfeff', borderRadius:10, border:'1px solid #a5f3fc', marginBottom:16 }}>
      <div style={{ fontSize:12, fontWeight:700, color:'#0891b2', display:'flex', alignItems:'center', gap:5 }}><ShieldAlert size={13} />Le gel bloque toute destruction ou transfert.</div>
    </div>
    <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap:12, marginBottom:16 }}>
      <div style={{ gridColumn:'1/-1' }}><label style={labelStyle}>Titre *</label><input value={form.titre} onChange={e => up('titre', e.target.value)} placeholder="Ex: Litige client X" style={{...inputStyle, borderColor:errors.titre?'#dc2626':COLORS.border}} /></div>
      <div style={{ gridColumn:'1/-1' }}><label style={labelStyle}>Motif juridique *</label><textarea value={form.motif} onChange={e => up('motif', e.target.value)} rows={2} placeholder="Contentieux ou procédure..." style={{...inputStyle, resize:'vertical', borderColor:errors.motif?'#dc2626':COLORS.border}} /></div>
      <div><label style={labelStyle}>Réf. juridique *</label><input value={form.refJuridique} onChange={e => up('refJuridique', e.target.value)} placeholder="TCA-2025-0342" style={{...inputStyle, borderColor:errors.refJuridique?'#dc2626':COLORS.border}} /></div>
      <div><label style={labelStyle}>Service</label><select value={form.service} onChange={e => up('service', e.target.value)} style={inputStyle}>{SERVICES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
      <div><label style={labelStyle}>Demandé par</label><input value={form.demandePar} onChange={e => up('demandePar', e.target.value)} style={inputStyle} /></div>
      <div><label style={labelStyle}>Nb documents</label><input type="number" value={form.nbDocs} onChange={e => up('nbDocs', e.target.value)} style={inputStyle} /></div>
      <div><label style={labelStyle}>Types docs</label><input value={form.typeDocs} onChange={e => up('typeDocs', e.target.value)} placeholder="Contrats, Factures" style={inputStyle} /></div>
      <div><label style={labelStyle}>Périmètre</label><input value={form.scope} onChange={e => up('scope', e.target.value)} placeholder="Documents depuis 2020" style={inputStyle} /></div>
    </div>
    <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}><Btn variant="outline" size="sm" onClick={onCancel}>Annuler</Btn><Btn icon={Lock} size="sm" onClick={submit}>Activer le gel</Btn></div>
  </div>);
}

/* ═══════════════════════════════════════════════════ HELPERS ═══════════════════════════════════════════════════ */
function KPI({ icon:Icon, label, value, color, bg, sub, pulse }) {
  return (<div style={{ padding:'14px 16px', background:bg, borderRadius:12, border:`1.5px solid ${color}18`, display:'flex', alignItems:'center', gap:12 }}>
    <div style={{ width:38, height:38, borderRadius:10, background:color+'15', display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
      <Icon size={18} color={color} />{pulse && <span style={{ position:'absolute', top:-2, right:-2, width:10, height:10, borderRadius:'50%', background:'#dc2626', border:'2px solid #fff' }} />}
    </div>
    <div><div style={{ fontSize:22, fontWeight:800, color }}>{value}</div><div style={{ fontSize:11, color:COLORS.textMut, fontWeight:500 }}>{label}</div>{sub && <div style={{ fontSize:10, color:COLORS.textMut }}>{sub}</div>}</div>
  </div>);
}

function ActBtn({ icon:Icon, tip, color=COLORS.textMut, onClick }) {
  return (<button onClick={onClick} title={tip} style={{ width:28, height:28, borderRadius:6, border:`1px solid ${COLORS.borderLight}`, background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}
    onMouseEnter={e => { e.currentTarget.style.background=COLORS.surfaceAlt; e.currentTarget.style.borderColor=color; }} onMouseLeave={e => { e.currentTarget.style.background='#fff'; e.currentTarget.style.borderColor=COLORS.borderLight; }}>
    <Icon size={13} color={color} /></button>);
}

function InfoBlk({ label, value, mono, accent, span }) {
  return (<div style={span?{gridColumn:'1/-1'}:{}}><div style={{ fontSize:10, color:COLORS.textMut, marginBottom:2, fontWeight:600, textTransform:'uppercase', letterSpacing:.3 }}>{label}</div><div style={{ fontSize:13, fontWeight:600, fontFamily:mono?'monospace':FF, color:accent?'#dc2626':COLORS.text }}>{value||'—'}</div></div>);
}