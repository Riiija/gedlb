/* ═══════════════════════════════════════════════════════════════
   SOFT LIBRARY — Gestion des Consultations & Circulation
   ─────────────────────────────────────────────────────────────
   ✓ Demande de consultation en ligne
   ✓ Workflow de validation multi-niveau configurable
   ✓ Gestion des priorités (normale / haute / urgente)
   ✓ Gestion des réservations
   ✓ Mouvement physique — Scan sortie / retour
   ✓ Gestion des prêts internes / externes
   ✓ Suivi du détenteur actuel + date retour prévue
   ✓ Relances automatiques + blocage retard critique
   ✓ Journal d'audit complet + statistiques d'utilisation
   ✓ Responsive mobile / tablet / desktop
═══════════════════════════════════════════════════════════════ */
import React, { useState, useMemo, useCallback } from 'react';
import {
  Plus, Search, Eye, Edit3, X, Check, ChevronDown, ChevronRight,
  Clock, FileText, Save, AlertTriangle, Filter, Download,
  History, Lock, ScanLine, Calendar, User, Building2,
  ChevronUp, RefreshCw, CheckCircle2, XCircle, Info,
  Package, Shield, Send, ArrowRight, ArrowLeft, Bell,
  BarChart3, BookOpen, UserCheck, Users, Clipboard,
  Timer, AlertCircle, Ban, RotateCcw, ExternalLink,
  Printer, QrCode, Zap, Tag, MapPin, Inbox, ChevronLeft,
  TrendingUp, TrendingDown, Minus, MoreVertical, PieChart,
  Activity, Layers, Copy, Archive,
} from 'lucide-react';
import { COLORS, FONT_FAMILY, getStatutUI } from '../theme';
import { Badge, Btn, Modal, Pagination, SearchBar } from '../components/ui';
import { SHARED_CONSULTATIONS, SHARED_USERS, resolveDocTitre } from '../data/sharedData';

const FF = FONT_FAMILY;
const labelStyle = { fontSize: 11, fontWeight: 600, color: COLORS.textMut, marginBottom: 4, display: 'block' };
const inputStyle = { width: '100%', padding: '8px 12px', border: `1.5px solid ${COLORS.border}`, borderRadius: 8, fontSize: 13, fontFamily: FF, color: COLORS.text, background: '#fff', outline: 'none', boxSizing: 'border-box' };

const CONS_STATUTS = {
  brouillon:      { label: 'Brouillon',        color: '#64748b', bg: '#f1f5f9', icon: Edit3 },
  en_attente:     { label: 'En attente',       color: '#d97706', bg: '#fffbeb', icon: Clock },
  validation_n1:  { label: 'Valid. N1',         color: '#7c3aed', bg: '#f5f3ff', icon: UserCheck },
  validation_n2:  { label: 'Valid. N2',         color: '#4f46e5', bg: '#eef2ff', icon: Shield },
  approuvee:      { label: 'Approuvée',         color: '#059669', bg: '#ecfdf5', icon: CheckCircle2 },
  refusee:        { label: 'Refusée',           color: '#dc2626', bg: '#fef2f2', icon: XCircle },
  en_cours:       { label: 'En consultation',   color: '#2563eb', bg: '#eff6ff', icon: BookOpen },
  en_retard:      { label: 'En retard',         color: '#dc2626', bg: '#fef2f2', icon: AlertCircle },
  retard_critique:{ label: 'Retard critique',   color: '#991b1b', bg: '#fef2f2', icon: Ban },
  retournee:      { label: 'Retournée',         color: '#475569', bg: '#f8fafc', icon: ArrowLeft },
  reservee:       { label: 'Réservée',          color: '#0891b2', bg: '#ecfeff', icon: Calendar },
  annulee:        { label: 'Annulée',           color: '#94a3b8', bg: '#f8fafc', icon: X },
};
const getSt = (id) => CONS_STATUTS[id] || { label: id, color: '#94a3b8', bg: '#f8fafc', icon: Info };

const PRIOS = {
  normale: { label: 'Normale', color: '#64748b', dot: '#94a3b8' },
  haute:   { label: 'Haute',   color: '#d97706', dot: '#f59e0b' },
  urgente: { label: 'Urgente', color: '#dc2626', dot: '#ef4444' },
};

const PRET_TYPES = {
  consultation: { label: 'Consultation', color: '#2563eb', bg: '#eff6ff', icon: Eye },
  interne:      { label: 'Prêt interne', color: '#059669', bg: '#ecfdf5', icon: Users },
  externe:      { label: 'Prêt externe', color: '#d97706', bg: '#fffbeb', icon: ExternalLink },
  numerisation: { label: 'Numérisation', color: '#7c3aed', bg: '#f5f3ff', icon: ScanLine },
};

/* Consultations et utilisateurs importés depuis sharedData.js (source de vérité) */

/* ═══════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
═══════════════════════════════════════════════════ */
export default function LibConsultations({ documents = [], users = [], contenants = [], emplacements = [] }) {
  const usrs = users.length > 0 ? users : SHARED_USERS;
  /* Enrichir les consultations avec le vrai titre du document (source de vérité: documents prop) */
  const [data, setData] = useState(() => SHARED_CONSULTATIONS.map(c => ({...c, docTitre: resolveDocTitre(c.docId, documents)})));
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('toutes');
  const [showNew, setShowNew] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [showScan, setShowScan] = useState(false);
  const [showValidation, setShowValidation] = useState(null);
  const [filterPrio, setFilterPrio] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [page, setPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check(); window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ── Compteurs par onglet ── */
  const counts = useMemo(() => {
    const c = { toutes: data.length, en_attente: 0, en_cours: 0, retard: 0, reservations: 0, historique: 0 };
    data.forEach(d => {
      if (['en_attente', 'validation_n1', 'validation_n2', 'approuvee'].includes(d.statut)) c.en_attente++;
      if (d.statut === 'en_cours') c.en_cours++;
      if (['en_retard', 'retard_critique'].includes(d.statut)) c.retard++;
      if (d.statut === 'reservee') c.reservations++;
      if (['retournee', 'refusee', 'annulee'].includes(d.statut)) c.historique++;
    });
    return c;
  }, [data]);

  /* ── Filtrage ── */
  const filtered = useMemo(() => {
    let r = [...data];
    if (tab === 'en_attente') r = r.filter(d => ['en_attente', 'validation_n1', 'validation_n2', 'approuvee'].includes(d.statut));
    else if (tab === 'en_cours') r = r.filter(d => d.statut === 'en_cours');
    else if (tab === 'retard') r = r.filter(d => ['en_retard', 'retard_critique'].includes(d.statut));
    else if (tab === 'reservations') r = r.filter(d => d.statut === 'reservee');
    else if (tab === 'historique') r = r.filter(d => ['retournee', 'refusee', 'annulee'].includes(d.statut));
    if (filterPrio !== 'all') r = r.filter(d => d.priorite === filterPrio);
    if (filterType !== 'all') r = r.filter(d => d.type === filterType);
    if (search) { const s = search.toLowerCase(); r = r.filter(d => d.id.toLowerCase().includes(s) || d.docTitre.toLowerCase().includes(s) || d.demandeur.toLowerCase().includes(s) || d.docId.toLowerCase().includes(s)); }
    return r;
  }, [data, tab, search, filterPrio, filterType]);

  const perPage = isMobile ? 8 : 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const enCours = data.filter(d => d.statut === 'en_cours').length;
  const retards = data.filter(d => ['en_retard', 'retard_critique'].includes(d.statut)).length;
  const pending = data.filter(d => ['en_attente', 'validation_n1', 'validation_n2'].includes(d.statut)).length;
  const returned = data.filter(d => d.statut === 'retournee').length;

  /* ── Actions ── */
  const handleValidate = useCallback((consId, niveau, decision, comment) => {
    setData(prev => prev.map(c => {
      if (c.id !== consId) return c;
      const upd = { ...c, validations: [...c.validations] };
      const vIdx = upd.validations.findIndex(v => v.niveau === niveau);
      if (vIdx >= 0) upd.validations[vIdx] = { ...upd.validations[vIdx], statut: decision, date: new Date().toISOString().replace('T', ' ').slice(0, 16), commentaire: comment };
      if (decision === 'refuse') { upd.statut = 'refusee'; upd.motifRefus = comment; }
      else { const np = upd.validations.find(v => v.statut === 'en_attente'); upd.statut = np ? `validation_n${np.niveau}` : 'approuvee'; }
      upd.historique = [...(upd.historique || []), { date: new Date().toISOString().replace('T', ' ').slice(0, 16), action: decision === 'refuse' ? `Refusé N${niveau}` : `Validé N${niveau}`, auteur: 'Vous', detail: comment || '' }];
      return upd;
    }));
    setShowValidation(null);
  }, []);

  const handleSortie = useCallback((consId) => {
    setData(prev => prev.map(c => {
      if (c.id !== consId) return c;
      return { ...c, statut: 'en_cours', dateSortie: new Date().toISOString().replace('T', ' ').slice(0, 16), detenteur: c.demandeur, emplacementActuel: `Bureau ${c.service}`,
        historique: [...(c.historique || []), { date: new Date().toISOString().replace('T', ' ').slice(0, 16), action: 'Sortie enregistrée', auteur: 'Vous', detail: 'Scan code-barres — document remis' }] };
    }));
  }, []);

  const handleRetour = useCallback((consId) => {
    setData(prev => prev.map(c => {
      if (c.id !== consId) return c;
      return { ...c, statut: 'retournee', dateRetourEffective: new Date().toISOString().replace('T', ' ').slice(0, 16), detenteur: null, emplacementActuel: null,
        historique: [...(c.historique || []), { date: new Date().toISOString().replace('T', ' ').slice(0, 16), action: 'Retour enregistré', auteur: 'Vous', detail: 'Scan retour — document en bon état' }] };
    }));
  }, []);

  const handleAnnuler = useCallback((consId) => {
    setData(prev => prev.map(c => c.id !== consId ? c : { ...c, statut: 'annulee', historique: [...(c.historique || []), { date: new Date().toISOString().replace('T', ' ').slice(0, 16), action: 'Demande annulée', auteur: 'Vous', detail: '' }] }));
  }, []);

  const TABS = [
    { id: 'toutes', label: 'Toutes', count: counts.toutes, icon: Inbox },
    { id: 'en_attente', label: 'Validation', count: counts.en_attente, icon: Clock },
    { id: 'en_cours', label: 'En cours', count: counts.en_cours, icon: BookOpen },
    { id: 'retard', label: 'Retards', count: counts.retard, icon: AlertCircle, danger: counts.retard > 0 },
    { id: 'reservations', label: 'Réservations', count: counts.reservations, icon: Calendar },
    { id: 'historique', label: 'Historique', count: counts.historique, icon: History },
    { id: 'stats', label: 'Statistiques', count: null, icon: BarChart3 },
  ];

  const isStatsTab = tab === 'stats';

  return (
    <div style={{ fontFamily: FF }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: isMobile ? 20 : 24, fontWeight: 700 }}>Consultations & Circulation</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: COLORS.textMut }}>Demandes, prêts, validation et suivi des documents physiques</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {!isMobile && <Btn icon={ScanLine} variant="outline" size="sm" onClick={() => setShowScan(true)}>Scan</Btn>}
          {!isMobile && <Btn icon={Download} variant="outline" size="sm">Exporter</Btn>}
          <Btn icon={Plus} size="sm" onClick={() => setShowNew(true)}>Nouvelle demande</Btn>
        </div>
      </div>

      {/* KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? 8 : 12, marginBottom: 20 }}>
        <KPI icon={Clock} label="En attente" value={pending} color="#d97706" bg="#fffbeb" />
        <KPI icon={BookOpen} label="En cours" value={enCours} color="#2563eb" bg="#eff6ff" />
        <KPI icon={AlertCircle} label="En retard" value={retards} color="#dc2626" bg="#fef2f2" pulse={retards > 0} />
        <KPI icon={CheckCircle2} label="Retournées" value={returned} color="#059669" bg="#ecfdf5" />
      </div>

      {/* Alerte retards */}
      {retards > 0 && (
        <div style={{ padding: '10px 16px', background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: 10, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <AlertTriangle size={16} color="#dc2626" />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#dc2626' }}>{retards} document{retards > 1 ? 's' : ''} en retard</span>
          <span style={{ fontSize: 12, color: '#991b1b' }}>dont {data.filter(d => d.statut === 'retard_critique').length} en retard critique</span>
          <button onClick={() => setTab('retard')} style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 600, color: '#dc2626', background: '#fff', border: '1px solid #fecaca', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontFamily: FF }}>Voir les retards →</button>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 16, borderBottom: `2px solid ${COLORS.border}`, overflowX: 'auto' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setPage(1); }} style={{
            padding: isMobile ? '8px 10px' : '9px 16px', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: isMobile ? 11 : 12, fontWeight: tab === t.id ? 700 : 500, whiteSpace: 'nowrap',
            color: t.danger ? '#dc2626' : tab === t.id ? COLORS.primary : COLORS.textMut,
            borderBottom: tab === t.id ? `2px solid ${t.danger ? '#dc2626' : COLORS.primary}` : '2px solid transparent',
            marginBottom: -2, fontFamily: FF, display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <t.icon size={13} />{!isMobile && t.label}
            {t.count !== null && <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 10, fontWeight: 700,
              background: t.danger ? '#fef2f2' : tab === t.id ? COLORS.primaryLighter : '#f1f5f9',
              color: t.danger ? '#dc2626' : tab === t.id ? COLORS.primary : COLORS.textMut }}>{t.count}</span>}
          </button>
        ))}
      </div>

      {isStatsTab ? <StatsPanel data={data} isMobile={isMobile} /> : (
        <>
          {/* Toolbar */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
            <SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Rechercher..." maxWidth={isMobile ? '100%' : 260} />
            {!isMobile && (<>
              <select value={filterPrio} onChange={e => { setFilterPrio(e.target.value); setPage(1); }} style={{ ...inputStyle, width: 'auto', padding: '6px 10px', fontSize: 12 }}>
                <option value="all">Priorité: Toutes</option>
                {Object.entries(PRIOS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <select value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1); }} style={{ ...inputStyle, width: 'auto', padding: '6px 10px', fontSize: 12 }}>
                <option value="all">Type: Tous</option>
                {Object.entries(PRET_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </>)}
            <span style={{ fontSize: 12, color: COLORS.textMut, marginLeft: 'auto' }}>{filtered.length} résultat{filtered.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Liste */}
          {isMobile ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {paged.map(c => <ConsCard key={c.id} cons={c} onView={() => setShowDetail(c)} onValidate={() => setShowValidation(c)} onSortie={() => handleSortie(c.id)} onRetour={() => handleRetour(c.id)} />)}
              {paged.length === 0 && <div style={{ padding: 48, textAlign: 'center', color: COLORS.textMut }}><Inbox size={28} style={{ opacity: .3, marginBottom: 8 }} /><div style={{ fontSize: 13, fontWeight: 600 }}>Aucune consultation</div></div>}
            </div>
          ) : (
            <div style={{ background: '#fff', borderRadius: 12, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead><tr style={{ background: COLORS.surfaceAlt }}>
                  {['Réf.','Document','Demandeur','Type','Priorité','Statut','Retour prévu','Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: COLORS.textSec, fontSize: 10, textTransform: 'uppercase', letterSpacing: .5 }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {paged.map(c => {
                    const st = getSt(c.statut), pr = PRIOS[c.priorite] || PRIOS.normale, pt = PRET_TYPES[c.type] || PRET_TYPES.consultation;
                    const isLate = ['en_retard', 'retard_critique'].includes(c.statut);
                    return (
                      <tr key={c.id} style={{ borderBottom: `1px solid ${COLORS.borderLight}`, background: isLate ? '#fef2f208' : undefined }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = isLate ? '#fef2f208' : 'transparent'}>
                        <td style={{ padding: '10px 12px', fontWeight: 600, color: COLORS.primaryLight, fontSize: 11, fontFamily: 'monospace' }}>{c.id}</td>
                        <td style={{ padding: '10px 12px' }}><div style={{ fontWeight: 600, fontSize: 12, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.docTitre}</div><div style={{ fontSize: 10, color: COLORS.textMut, fontFamily: 'monospace' }}>{c.docId}</div></td>
                        <td style={{ padding: '10px 12px' }}><div style={{ fontWeight: 500, fontSize: 12 }}>{c.demandeur}</div><div style={{ fontSize: 10, color: COLORS.textMut }}>{c.service}</div></td>
                        <td style={{ padding: '10px 12px' }}><Badge label={pt.label} color={pt.color} bg={pt.bg} /></td>
                        <td style={{ padding: '10px 12px' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: pr.dot }} /><span style={{ fontSize: 12, fontWeight: 600, color: pr.color }}>{pr.label}</span></span></td>
                        <td style={{ padding: '10px 12px' }}><Badge label={st.label} color={st.color} bg={st.bg} />{c.joursRetard > 0 && <div style={{ fontSize: 10, color: '#dc2626', fontWeight: 700, marginTop: 2 }}>+{c.joursRetard}j</div>}</td>
                        <td style={{ padding: '10px 12px', fontSize: 12, color: isLate ? '#dc2626' : COLORS.textSec, fontWeight: isLate ? 700 : 400 }}>{c.dateRetourPrevue || '—'}</td>
                        <td style={{ padding: '10px 12px' }}><div style={{ display: 'flex', gap: 4 }}>
                          <ActionBtn icon={Eye} tip="Détail" onClick={() => setShowDetail(c)} />
                          {['en_attente','validation_n1','validation_n2'].includes(c.statut) && <ActionBtn icon={CheckCircle2} tip="Valider" color="#059669" onClick={() => setShowValidation(c)} />}
                          {c.statut === 'approuvee' && <ActionBtn icon={ArrowRight} tip="Sortie" color="#2563eb" onClick={() => handleSortie(c.id)} />}
                          {['en_cours','en_retard','retard_critique'].includes(c.statut) && <ActionBtn icon={ArrowLeft} tip="Retour" color="#7c3aed" onClick={() => handleRetour(c.id)} />}
                        </div></td>
                      </tr>
                    );
                  })}
                  {paged.length === 0 && <tr><td colSpan={8} style={{ padding: 48, textAlign: 'center', color: COLORS.textMut }}><Inbox size={32} strokeWidth={1.2} style={{ opacity: .3, marginBottom: 8 }} /><div style={{ fontSize: 13, fontWeight: 600 }}>Aucune consultation trouvée</div></td></tr>}
                </tbody>
              </table>
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <Modal isOpen={!!showDetail} onClose={() => setShowDetail(null)} title="Détail de la consultation" width={isMobile ? '95vw' : 720}>
        {showDetail && <ConsDetail cons={showDetail} data={data} isMobile={isMobile} onValidate={c => { setShowDetail(null); setShowValidation(c); }} onSortie={handleSortie} onRetour={handleRetour} onAnnuler={handleAnnuler} />}
      </Modal>
      <Modal isOpen={!!showValidation} onClose={() => setShowValidation(null)} title="Validation de la demande" width={isMobile ? '95vw' : 520}>
        {showValidation && <ValidationPanel cons={showValidation} isMobile={isMobile} onValidate={handleValidate} onCancel={() => setShowValidation(null)} />}
      </Modal>
      <Modal isOpen={showNew} onClose={() => setShowNew(false)} title="Nouvelle demande de consultation" width={isMobile ? '95vw' : 640}>
        <NewConsForm documents={documents} users={usrs} isMobile={isMobile} onSave={nc => { setData(prev => [nc, ...prev]); setShowNew(false); }} onCancel={() => setShowNew(false)} />
      </Modal>
      <Modal isOpen={showScan} onClose={() => setShowScan(false)} title="Scanner un document" width={isMobile ? '95vw' : 480}>
        <ScanPanel data={data} isMobile={isMobile} onSortie={handleSortie} onRetour={handleRetour} onClose={() => setShowScan(false)} />
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   KPI CARD
═══════════════════════════════════════════════════ */
function KPI({ icon: Icon, label, value, color, bg, pulse }) {
  return (
    <div style={{ padding: '14px 16px', background: bg, borderRadius: 12, border: `1.5px solid ${color}18`, display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <Icon size={18} color={color} />
        {pulse && <span style={{ position: 'absolute', top: -2, right: -2, width: 10, height: 10, borderRadius: '50%', background: '#dc2626', border: '2px solid #fff' }} />}
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
        <div style={{ fontSize: 11, color: COLORS.textMut, fontWeight: 500 }}>{label}</div>
      </div>
    </div>
  );
}

function ActionBtn({ icon: Icon, tip, color = COLORS.textMut, onClick }) {
  return (
    <button onClick={onClick} title={tip}
      style={{ width: 28, height: 28, borderRadius: 6, border: `1px solid ${COLORS.borderLight}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onMouseEnter={e => { e.currentTarget.style.background = COLORS.surfaceAlt; e.currentTarget.style.borderColor = color; }}
      onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = COLORS.borderLight; }}>
      <Icon size={13} color={color} />
    </button>
  );
}

/* ═══════════════════════════════════════════════════
   CARD MOBILE
═══════════════════════════════════════════════════ */
function ConsCard({ cons: c, onView, onValidate, onSortie, onRetour }) {
  const st = getSt(c.statut), pr = PRIOS[c.priorite] || PRIOS.normale, pt = PRET_TYPES[c.type] || PRET_TYPES.consultation;
  const isLate = ['en_retard', 'retard_critique'].includes(c.statut);
  return (
    <div onClick={onView} style={{ padding: 14, background: isLate ? '#fef2f2' : '#fff', borderRadius: 12, border: `1.5px solid ${isLate ? '#fecaca' : COLORS.border}`, cursor: 'pointer' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div><span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 600, color: COLORS.primaryLight }}>{c.id}</span><div style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>{c.docTitre}</div></div>
        <Badge label={st.label} color={st.color} bg={st.bg} />
      </div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, color: COLORS.textSec }}>{c.demandeur}</span>
        <span style={{ width: 3, height: 3, borderRadius: '50%', background: COLORS.textMut }} />
        <Badge label={pt.label} color={pt.color} bg={pt.bg} />
        <span style={{ width: 3, height: 3, borderRadius: '50%', background: COLORS.textMut }} />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: pr.dot }} /><span style={{ fontSize: 11, fontWeight: 600, color: pr.color }}>{pr.label}</span></span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: isLate ? '#dc2626' : COLORS.textMut }}><Calendar size={10} style={{ marginRight: 3 }} />Retour: {c.dateRetourPrevue} {c.joursRetard ? <strong> (+{c.joursRetard}j)</strong> : ''}</span>
        <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
          {['en_attente','validation_n1','validation_n2'].includes(c.statut) && <ActionBtn icon={CheckCircle2} tip="Valider" color="#059669" onClick={onValidate} />}
          {c.statut === 'approuvee' && <ActionBtn icon={ArrowRight} tip="Sortie" color="#2563eb" onClick={onSortie} />}
          {['en_cours','en_retard','retard_critique'].includes(c.statut) && <ActionBtn icon={ArrowLeft} tip="Retour" color="#7c3aed" onClick={onRetour} />}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   DÉTAIL CONSULTATION (workflow + relances + audit)
═══════════════════════════════════════════════════ */
function ConsDetail({ cons: c, data, isMobile, onValidate, onSortie, onRetour, onAnnuler }) {
  const [tab, setTab] = useState('info');
  const st = getSt(c.statut), pr = PRIOS[c.priorite] || PRIOS.normale, pt = PRET_TYPES[c.type] || PRET_TYPES.consultation;
  const isLate = ['en_retard', 'retard_critique'].includes(c.statut);
  const otherCons = data.filter(d => d.docId === c.docId && d.id !== c.id);

  const wfSteps = useMemo(() => {
    const steps = [{ label: 'Demande', done: true, date: c.dateDemande }];
    (c.validations || []).forEach(v => { steps.push({ label: `Valid. N${v.niveau}`, done: v.statut !== 'en_attente', refused: v.statut === 'refuse', date: v.date, valideur: v.valideur }); });
    if (c.statut !== 'refusee') {
      steps.push({ label: 'Approbation', done: ['approuvee','en_cours','en_retard','retard_critique','retournee'].includes(c.statut) });
      steps.push({ label: 'Sortie', done: !!c.dateSortie, date: c.dateSortie });
      steps.push({ label: 'Retour', done: c.statut === 'retournee', date: c.dateRetourEffective });
    }
    return steps;
  }, [c]);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: st.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {React.createElement(st.icon, { size: 20, color: st.color })}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{c.docTitre}</div>
          <div style={{ fontSize: 11, color: COLORS.textMut, display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', marginTop: 2 }}>
            <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{c.id}</span>
            <Badge label={st.label} color={st.color} bg={st.bg} />
            <Badge label={pt.label} color={pt.color} bg={pt.bg} />
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: pr.dot }} /><span style={{ fontSize: 11, fontWeight: 600, color: pr.color }}>{pr.label}</span></span>
          </div>
        </div>
      </div>

      {/* Blocage */}
      {c.bloque && (
        <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: 10, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Ban size={16} color="#dc2626" />
          <div><div style={{ fontSize: 12, fontWeight: 700, color: '#dc2626' }}>⛔ Utilisateur bloqué</div><div style={{ fontSize: 11, color: '#991b1b' }}>{c.motifBlocage}</div></div>
        </div>
      )}

      {/* Workflow stepper */}
      <div style={{ padding: '12px 14px', background: COLORS.surfaceAlt, borderRadius: 10, marginBottom: 14, overflowX: 'auto' }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: COLORS.textMut, marginBottom: 8, textTransform: 'uppercase', letterSpacing: .5 }}>Workflow de validation</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, minWidth: 'fit-content' }}>
          {wfSteps.map((s, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div style={{ width: 24, height: 2, background: s.done ? (s.refused ? '#fecaca' : '#86efac') : COLORS.border, flexShrink: 0 }} />}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: s.refused ? '#fef2f2' : s.done ? '#ecfdf5' : '#f8fafc', border: `2px solid ${s.refused ? '#dc2626' : s.done ? '#059669' : COLORS.border}` }}>
                  {s.refused ? <X size={12} color="#dc2626" /> : s.done ? <Check size={12} color="#059669" /> : <Clock size={12} color={COLORS.textMut} />}
                </div>
                <span style={{ fontSize: 9, fontWeight: 600, color: s.done ? COLORS.text : COLORS.textMut, whiteSpace: 'nowrap' }}>{s.label}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 14, borderBottom: `1.5px solid ${COLORS.border}`, overflowX: 'auto' }}>
        {[
          { id: 'info', label: 'Informations', icon: Info },
          { id: 'validations', label: 'Validations', icon: UserCheck },
          { id: 'alertes', label: `Relances (${(c.alertes||[]).length})`, icon: Bell },
          { id: 'audit', label: `Audit (${(c.historique||[]).length})`, icon: History },
          { id: 'autres', label: `Lié (${otherCons.length})`, icon: Layers },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '7px 14px', border: 'none', background: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: tab === t.id ? 700 : 500, fontFamily: FF, whiteSpace: 'nowrap',
            color: tab === t.id ? COLORS.primary : COLORS.textMut,
            borderBottom: tab === t.id ? `2px solid ${COLORS.primary}` : '2px solid transparent', marginBottom: -1.5,
            display: 'flex', alignItems: 'center', gap: 4,
          }}><t.icon size={13} />{t.label}</button>
        ))}
      </div>

      {/* TAB: Info */}
      {tab === 'info' && (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 10, marginBottom: 14 }}>
          <InfoBlk label="Document" value={`${c.docTitre} (${c.docId})`} />
          <InfoBlk label="Demandeur" value={`${c.demandeur} — ${c.service}`} />
          <InfoBlk label="Date demande" value={c.dateDemande} />
          <InfoBlk label="Retour prévu" value={c.dateRetourPrevue} accent={isLate} />
          <InfoBlk label="Motif" value={c.motif} span />
          {c.detenteur && <InfoBlk label="Détenteur actuel" value={c.detenteur} />}
          {c.emplacementActuel && <InfoBlk label="Emplacement actuel" value={c.emplacementActuel} />}
          {c.dateSortie && <InfoBlk label="Date sortie" value={c.dateSortie} />}
          {c.dateRetourEffective && <InfoBlk label="Date retour effectif" value={c.dateRetourEffective} />}
          {c.joursRetard > 0 && <InfoBlk label="Jours de retard" value={`${c.joursRetard} jour${c.joursRetard > 1 ? 's' : ''}`} accent />}
          {c.dateReservation && <InfoBlk label="Date réservation" value={c.dateReservation} />}
          {c.motifRefus && <InfoBlk label="Motif de refus" value={c.motifRefus} span accent />}
        </div>
      )}

      {/* TAB: Validations */}
      {tab === 'validations' && (
        <div style={{ marginBottom: 14 }}>
          {(c.validations||[]).length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: COLORS.textMut }}><Shield size={24} strokeWidth={1.2} style={{ opacity: .3, marginBottom: 6 }} /><div style={{ fontSize: 13 }}>Aucune validation requise</div></div>
          ) : (c.validations||[]).map((v, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderBottom: `1px solid ${COLORS.borderLight}` }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%',
                background: v.statut === 'approuve' ? '#ecfdf5' : v.statut === 'refuse' ? '#fef2f2' : '#fffbeb',
                border: `2px solid ${v.statut === 'approuve' ? '#059669' : v.statut === 'refuse' ? '#dc2626' : '#d97706'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {v.statut === 'approuve' ? <Check size={14} color="#059669" /> : v.statut === 'refuse' ? <X size={14} color="#dc2626" /> : <Clock size={14} color="#d97706" />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Niveau {v.niveau} — {v.valideur}</div>
                <div style={{ fontSize: 11, color: COLORS.textMut }}>{v.statut === 'approuve' ? '✓ Approuvé' : v.statut === 'refuse' ? '✗ Refusé' : '⏳ En attente'}{v.date && ` — ${v.date}`}</div>
                {v.commentaire && <div style={{ fontSize: 11, color: COLORS.textSec, fontStyle: 'italic', marginTop: 2 }}>"{v.commentaire}"</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB: Alertes & Relances automatiques */}
      {tab === 'alertes' && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ padding: 10, background: '#eff6ff', borderRadius: 8, border: '1px solid #bfdbfe', marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', display: 'flex', alignItems: 'center', gap: 5 }}><Zap size={12} />Configuration des relances automatiques</div>
            <div style={{ fontSize: 11, color: '#1e40af', marginTop: 4, lineHeight: 1.6 }}>
              • J+1 après date retour : 1ère relance email au détenteur<br/>
              • J+4 : 2ème relance + copie responsable service<br/>
              • J+7 : Escalade hiérarchique (responsable + DAF)<br/>
              • J+14 : Blocage automatique — nouvelles demandes interdites
            </div>
          </div>
          {(c.alertes||[]).length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: COLORS.textMut }}><Bell size={24} strokeWidth={1.2} style={{ opacity: .3, marginBottom: 6 }} /><div style={{ fontSize: 13 }}>Aucune alerte émise</div></div>
          ) : (c.alertes||[]).map((a, i) => {
            const AS = { rappel: { color: '#2563eb', bg: '#eff6ff', icon: Bell, label: 'Rappel' }, relance: { color: '#d97706', bg: '#fffbeb', icon: Send, label: 'Relance' }, escalade: { color: '#dc2626', bg: '#fef2f2', icon: AlertTriangle, label: 'Escalade' }, blocage: { color: '#991b1b', bg: '#fef2f2', icon: Ban, label: 'Blocage' } };
            const as = AS[a.type] || AS.rappel; const AIcon = as.icon;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', borderRadius: 8, marginBottom: 6, background: as.bg, border: `1px solid ${as.color}20` }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: as.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><AIcon size={13} color={as.color} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: 12, fontWeight: 700, color: as.color }}>{as.label}</span><span style={{ fontSize: 10, color: COLORS.textMut }}>{a.date}</span></div>
                  <div style={{ fontSize: 12, color: COLORS.textSec, marginTop: 2 }}>{a.message}</div>
                  {a.envoyeA && <div style={{ fontSize: 10, color: COLORS.textMut, marginTop: 3 }}>📩 Envoyé à : {a.envoyeA}</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB: Journal d'audit complet */}
      {tab === 'audit' && (
        <div style={{ marginBottom: 14, maxHeight: 340, overflowY: 'auto' }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: COLORS.textMut, marginBottom: 8, textTransform: 'uppercase', letterSpacing: .5, display: 'flex', alignItems: 'center', gap: 4 }}><History size={11} />Journal d'audit complet</div>
          {(c.historique||[]).map((h, i) => {
            const isSys = h.auteur === 'Système'; const isRel = h.action.includes('Relance') || h.action.includes('Escalade') || h.action.includes('Blocage');
            return (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '9px 0', borderBottom: i < c.historique.length - 1 ? `1px solid ${COLORS.borderLight}` : 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: isRel ? '#dc2626' : isSys ? '#d97706' : COLORS.primaryLight, flexShrink: 0 }} />
                  {i < c.historique.length - 1 && <div style={{ width: 1, flex: 1, background: COLORS.borderLight }} />}
                </div>
                <div style={{ flex: 1, paddingBottom: 4 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: isRel ? '#dc2626' : COLORS.text }}>{h.action}</div>
                  <div style={{ fontSize: 10, color: COLORS.textMut, display: 'flex', gap: 8, marginTop: 2 }}><span>{h.date}</span><span style={{ fontWeight: 600, color: isSys ? '#d97706' : COLORS.textSec }}>{h.auteur}</span></div>
                  {h.detail && <div style={{ fontSize: 11, color: COLORS.textSec, marginTop: 2, padding: '4px 8px', background: COLORS.surfaceAlt, borderRadius: 4 }}>{h.detail}</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB: Autres consultations du même document */}
      {tab === 'autres' && (
        <div style={{ marginBottom: 14 }}>
          {otherCons.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: COLORS.textMut }}><FileText size={24} strokeWidth={1.2} style={{ opacity: .3, marginBottom: 6 }} /><div style={{ fontSize: 13 }}>Aucune autre consultation pour ce document</div></div>
          ) : otherCons.map(oc => {
            const ocSt = getSt(oc.statut);
            return (
              <div key={oc.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderBottom: `1px solid ${COLORS.borderLight}` }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: ocSt.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{React.createElement(ocSt.icon, { size: 14, color: ocSt.color })}</div>
                <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 600 }}>{oc.demandeur} — <span style={{ fontFamily: 'monospace', fontSize: 11 }}>{oc.id}</span></div><div style={{ fontSize: 10, color: COLORS.textMut }}>{oc.dateDemande} • {oc.motif}</div></div>
                <Badge label={ocSt.label} color={ocSt.color} bg={ocSt.bg} />
              </div>
            );
          })}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', borderTop: `1px solid ${COLORS.border}`, paddingTop: 12, flexWrap: 'wrap' }}>
        {['en_attente','validation_n1','validation_n2'].includes(c.statut) && <Btn icon={CheckCircle2} size="sm" onClick={() => onValidate(c)}>Valider</Btn>}
        {c.statut === 'approuvee' && <Btn icon={ArrowRight} size="sm" onClick={() => onSortie(c.id)}>Enregistrer sortie</Btn>}
        {['en_cours','en_retard','retard_critique'].includes(c.statut) && <Btn icon={ArrowLeft} size="sm" onClick={() => onRetour(c.id)}>Enregistrer retour</Btn>}
        {!['retournee','refusee','annulee'].includes(c.statut) && <Btn variant="outline" icon={X} size="sm" onClick={() => onAnnuler(c.id)}>Annuler</Btn>}
        <Btn icon={Printer} variant="outline" size="sm">Imprimer</Btn>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   VALIDATION PANEL
═══════════════════════════════════════════════════ */
function ValidationPanel({ cons, isMobile, onValidate, onCancel }) {
  const [comment, setComment] = useState('');
  const pending = (cons.validations || []).find(v => v.statut === 'en_attente');
  if (!pending) return <div style={{ padding: 20, textAlign: 'center', color: COLORS.textMut }}>Aucune validation en attente</div>;
  const pr = PRIOS[cons.priorite] || PRIOS.normale;

  return (
    <div>
      <div style={{ padding: 14, background: COLORS.surfaceAlt, borderRadius: 10, marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>{cons.docTitre}</div>
        <div style={{ fontSize: 12, color: COLORS.textMut, marginTop: 4 }}>Demandé par <strong>{cons.demandeur}</strong> ({cons.service}) — Priorité <span style={{ color: pr.color, fontWeight: 600 }}>{pr.label}</span></div>
        <div style={{ fontSize: 12, color: COLORS.textSec, marginTop: 4 }}>Motif : {cons.motif}</div>
      </div>
      <div style={{ padding: 14, background: '#f5f3ff', borderRadius: 10, marginBottom: 16, border: '1px solid #ddd6fe' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#7c3aed', display: 'flex', alignItems: 'center', gap: 6 }}><Shield size={14} />Validation Niveau {pending.niveau}</div>
        <div style={{ fontSize: 12, color: COLORS.textSec, marginTop: 4 }}>Valideur : {pending.valideur}</div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Commentaire (optionnel)</label>
        <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} placeholder="Ajouter un commentaire..." style={{ ...inputStyle, resize: 'vertical' }} />
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Btn variant="outline" size="sm" onClick={onCancel}>Annuler</Btn>
        <Btn variant="danger" icon={XCircle} size="sm" onClick={() => onValidate(cons.id, pending.niveau, 'refuse', comment)}>Refuser</Btn>
        <Btn variant="success" icon={CheckCircle2} size="sm" onClick={() => onValidate(cons.id, pending.niveau, 'approuve', comment)}>Approuver</Btn>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   NOUVELLE DEMANDE DE CONSULTATION
═══════════════════════════════════════════════════ */
function NewConsForm({ documents, users, isMobile, onSave, onCancel }) {
  const [form, setForm] = useState({ docId: '', motif: '', priorite: 'normale', type: 'interne', dateRetourPrevue: '', niveauxValidation: 1, valideurN1: '', valideurN2: '' });
  const [errors, setErrors] = useState({});
  const up = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: undefined })); };

  const validate = () => {
    const e = {};
    if (!form.docId) e.docId = 'Document requis';
    if (!form.motif.trim()) e.motif = 'Motif requis';
    if (!form.dateRetourPrevue) e.dateRetourPrevue = 'Date requise';
    if (!form.valideurN1) e.valideurN1 = 'Valideur N1 requis';
    if (form.niveauxValidation >= 2 && !form.valideurN2) e.valideurN2 = 'Valideur N2 requis';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const doc = documents.find(d => d.id === form.docId);
    const v1 = users.find(u => u.id === form.valideurN1);
    const vals = [{ niveau: 1, valideur: v1?.nom || form.valideurN1, statut: 'en_attente', date: null }];
    if (form.niveauxValidation >= 2 && form.valideurN2) {
      const v2 = users.find(u => u.id === form.valideurN2);
      vals.push({ niveau: 2, valideur: v2?.nom || form.valideurN2, statut: 'en_attente', date: null });
    }
    onSave({
      id: `CONS-${String(Date.now()).slice(-4)}`, docId: form.docId, docTitre: doc?.titre || doc?.id || form.docId,
      demandeurId: 'U001', demandeur: 'Vous', service: 'Direction Générale', type: form.type, priorite: form.priorite, motif: form.motif,
      statut: 'en_attente', dateDemande: new Date().toISOString().slice(0, 10), dateRetourPrevue: form.dateRetourPrevue,
      validations: vals, alertes: [],
      historique: [{ date: new Date().toISOString().replace('T', ' ').slice(0, 16), action: 'Demande créée', auteur: 'Vous', detail: `Priorité ${form.priorite}` }],
    });
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div style={{ gridColumn: '1/-1' }}>
          <label style={labelStyle}>Document demandé *</label>
          <select value={form.docId} onChange={e => up('docId', e.target.value)} style={{ ...inputStyle, borderColor: errors.docId ? '#dc2626' : COLORS.border }}>
            <option value="">— Sélectionner un document —</option>
            {documents.map(d => <option key={d.id} value={d.id}>{d.titre || d.id} ({d.id})</option>)}
          </select>
          {errors.docId && <span style={{ fontSize: 11, color: '#dc2626' }}>{errors.docId}</span>}
        </div>
        <div style={{ gridColumn: '1/-1' }}>
          <label style={labelStyle}>Motif de la demande *</label>
          <textarea value={form.motif} onChange={e => up('motif', e.target.value)} rows={2} placeholder="Expliquer la raison de la consultation..." style={{ ...inputStyle, resize: 'vertical', borderColor: errors.motif ? '#dc2626' : COLORS.border }} />
          {errors.motif && <span style={{ fontSize: 11, color: '#dc2626' }}>{errors.motif}</span>}
        </div>
        <div>
          <label style={labelStyle}>Type de prêt</label>
          <select value={form.type} onChange={e => up('type', e.target.value)} style={inputStyle}>
            {Object.entries(PRET_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Priorité</label>
          <select value={form.priorite} onChange={e => up('priorite', e.target.value)} style={inputStyle}>
            {Object.entries(PRIOS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Date de retour prévue *</label>
          <input type="date" value={form.dateRetourPrevue} onChange={e => up('dateRetourPrevue', e.target.value)} style={{ ...inputStyle, borderColor: errors.dateRetourPrevue ? '#dc2626' : COLORS.border }} />
          {errors.dateRetourPrevue && <span style={{ fontSize: 11, color: '#dc2626' }}>{errors.dateRetourPrevue}</span>}
        </div>
        <div>
          <label style={labelStyle}>Niveaux de validation</label>
          <select value={form.niveauxValidation} onChange={e => up('niveauxValidation', parseInt(e.target.value))} style={inputStyle}>
            <option value={1}>1 niveau</option><option value={2}>2 niveaux</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Valideur Niveau 1 *</label>
          <select value={form.valideurN1} onChange={e => up('valideurN1', e.target.value)} style={{ ...inputStyle, borderColor: errors.valideurN1 ? '#dc2626' : COLORS.border }}>
            <option value="">— Choisir —</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.nom} ({u.role})</option>)}
          </select>
          {errors.valideurN1 && <span style={{ fontSize: 11, color: '#dc2626' }}>{errors.valideurN1}</span>}
        </div>
        {form.niveauxValidation >= 2 && (
          <div>
            <label style={labelStyle}>Valideur Niveau 2 *</label>
            <select value={form.valideurN2} onChange={e => up('valideurN2', e.target.value)} style={{ ...inputStyle, borderColor: errors.valideurN2 ? '#dc2626' : COLORS.border }}>
              <option value="">— Choisir —</option>
              {users.filter(u => u.id !== form.valideurN1).map(u => <option key={u.id} value={u.id}>{u.nom} ({u.role})</option>)}
            </select>
            {errors.valideurN2 && <span style={{ fontSize: 11, color: '#dc2626' }}>{errors.valideurN2}</span>}
          </div>
        )}
      </div>
      <div style={{ padding: 12, background: '#eff6ff', borderRadius: 10, border: '1px solid #bfdbfe', marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#2563eb', display: 'flex', alignItems: 'center', gap: 6 }}><Info size={14} />Workflow de validation</div>
        <div style={{ fontSize: 11, color: '#1e40af', marginTop: 4 }}>
          Votre demande sera soumise à {form.niveauxValidation} niveau{form.niveauxValidation > 1 ? 'x' : ''} de validation.
          {form.type === 'externe' && ' Les prêts externes nécessitent une validation supplémentaire.'}
          {form.priorite === 'urgente' && ' La priorité urgente déclenche des notifications immédiates.'}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Btn variant="outline" size="sm" onClick={onCancel}>Annuler</Btn>
        <Btn icon={Send} size="sm" onClick={handleSubmit}>Soumettre la demande</Btn>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SCAN PANEL — Sortie / Retour par code-barres
═══════════════════════════════════════════════════ */
function ScanPanel({ data, isMobile, onSortie, onRetour, onClose }) {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState('auto');

  const handleScan = () => {
    if (!code.trim()) return;
    const found = data.find(c => c.id === code.trim().toUpperCase() || c.docId === code.trim().toUpperCase());
    setResult(found || 'not_found');
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[{ id: 'auto', label: 'Auto', icon: Zap }, { id: 'sortie', label: 'Sortie', icon: ArrowRight }, { id: 'retour', label: 'Retour', icon: ArrowLeft }].map(m => (
          <button key={m.id} onClick={() => setMode(m.id)} style={{
            flex: 1, padding: '10px 12px', borderRadius: 8, border: `1.5px solid ${mode === m.id ? COLORS.primary : COLORS.border}`,
            background: mode === m.id ? COLORS.primaryLighter : '#fff', cursor: 'pointer', fontFamily: FF,
            fontSize: 12, fontWeight: mode === m.id ? 700 : 500, color: mode === m.id ? COLORS.primary : COLORS.textMut,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}><m.icon size={14} />{m.label}</button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <ScanLine size={16} color={COLORS.textMut} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input value={code} onChange={e => setCode(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleScan()}
            placeholder="Scanner ou saisir CONS-xxxx / DOC-xxxx" style={{ ...inputStyle, paddingLeft: 36 }} autoFocus />
        </div>
        <Btn size="sm" onClick={handleScan}>Valider</Btn>
      </div>
      {result === 'not_found' && (
        <div style={{ padding: 20, textAlign: 'center', background: '#fef2f2', borderRadius: 10, border: '1px solid #fecaca' }}>
          <XCircle size={28} color="#dc2626" style={{ marginBottom: 6 }} />
          <div style={{ fontSize: 14, fontWeight: 700, color: '#dc2626' }}>Code non trouvé</div>
          <div style={{ fontSize: 12, color: '#991b1b' }}>Vérifiez le code et réessayez</div>
        </div>
      )}
      {result && result !== 'not_found' && (() => {
        const c = result, st = getSt(c.statut);
        const canSortie = c.statut === 'approuvee' && (mode === 'auto' || mode === 'sortie');
        const canRetour = ['en_cours','en_retard','retard_critique'].includes(c.statut) && (mode === 'auto' || mode === 'retour');
        return (
          <div style={{ padding: 16, background: COLORS.surfaceAlt, borderRadius: 10, border: `1px solid ${COLORS.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div><div style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 600, color: COLORS.primaryLight }}>{c.id}</div><div style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>{c.docTitre}</div><div style={{ fontSize: 12, color: COLORS.textSec, marginTop: 2 }}>{c.demandeur} — {c.service}</div></div>
              <Badge label={st.label} color={st.color} bg={st.bg} />
            </div>
            {c.detenteur && <div style={{ fontSize: 12, color: COLORS.textSec, marginBottom: 8, padding: '6px 10px', background: '#fff', borderRadius: 6, border: `1px solid ${COLORS.borderLight}` }}>📍 Détenteur : <strong>{c.detenteur}</strong> — {c.emplacementActuel}</div>}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              {canSortie && <Btn icon={ArrowRight} size="sm" onClick={() => { onSortie(c.id); setResult(null); setCode(''); }}>Enregistrer sortie</Btn>}
              {canRetour && <Btn icon={ArrowLeft} size="sm" onClick={() => { onRetour(c.id); setResult(null); setCode(''); }}>Enregistrer retour</Btn>}
              {!canSortie && !canRetour && <div style={{ fontSize: 12, color: COLORS.textMut, fontStyle: 'italic' }}>Aucune action disponible pour ce statut</div>}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   STATISTIQUES D'UTILISATION DES DOCUMENTS
═══════════════════════════════════════════════════ */
function StatsPanel({ data, isMobile }) {
  const stats = useMemo(() => {
    const total = data.length;
    const byStatut = {}, byType = {}, byPrio = {}, byService = {}, byDemandeur = {};
    let totalRetard = 0, totalJoursRetard = 0, completed = 0, onTime = 0;
    const durations = [];

    data.forEach(d => {
      byStatut[d.statut] = (byStatut[d.statut] || 0) + 1;
      byType[d.type] = (byType[d.type] || 0) + 1;
      byPrio[d.priorite] = (byPrio[d.priorite] || 0) + 1;
      byService[d.service] = (byService[d.service] || 0) + 1;
      byDemandeur[d.demandeur] = (byDemandeur[d.demandeur] || 0) + 1;
      if (['en_retard','retard_critique'].includes(d.statut)) { totalRetard++; totalJoursRetard += (d.joursRetard || 0); }
      if (d.statut === 'retournee') {
        completed++;
        if (d.dateRetourEffective && d.dateRetourPrevue && d.dateRetourEffective <= d.dateRetourPrevue + 'T23:59') onTime++;
        if (d.dateSortie && d.dateRetourEffective) { const diff = (new Date(d.dateRetourEffective) - new Date(d.dateSortie)) / 86400000; if (diff > 0) durations.push(diff); }
      }
    });
    const avgDuration = durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;
    const topDemandeurs = Object.entries(byDemandeur).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const topServices = Object.entries(byService).sort((a, b) => b[1] - a[1]);
    return { total, byStatut, byType, byPrio, topDemandeurs, topServices, totalRetard, totalJoursRetard, completed, onTime, avgDuration };
  }, [data]);

  const StatCard = ({ label, value, sub, color, bg, icon: Icon }) => (
    <div style={{ padding: 16, background: bg || COLORS.surfaceAlt, borderRadius: 12, border: `1.5px solid ${color || COLORS.border}20` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 800, color: color || COLORS.text }}>{value}</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.textSec, marginTop: 2 }}>{label}</div>
          {sub && <div style={{ fontSize: 11, color: COLORS.textMut, marginTop: 4 }}>{sub}</div>}
        </div>
        {Icon && <div style={{ width: 36, height: 36, borderRadius: 8, background: (color||COLORS.primary)+'12', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={18} color={color||COLORS.primary} /></div>}
      </div>
    </div>
  );

  const BarRow = ({ label, value, max, color }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
      <span style={{ fontSize: 12, fontWeight: 500, width: isMobile ? 100 : 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 18, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${max > 0 ? (value/max)*100 : 0}%`, height: '100%', background: color || COLORS.primary, borderRadius: 4, transition: 'width .4s', minWidth: value > 0 ? 16 : 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 6 }}>
          {value > 0 && <span style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>{value}</span>}
        </div>
      </div>
    </div>
  );

  const maxSvc = Math.max(...stats.topServices.map(s => s[1]), 1);
  const maxDem = Math.max(...stats.topDemandeurs.map(s => s[1]), 1);

  return (
    <div>
      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        <StatCard label="Total consultations" value={stats.total} icon={Clipboard} color="#0c4a6e" bg="#f0f9ff" />
        <StatCard label="Taux retour à temps" value={stats.completed > 0 ? Math.round((stats.onTime/stats.completed)*100)+'%' : '—'} sub={`${stats.onTime} / ${stats.completed} retournés`} icon={CheckCircle2} color="#059669" bg="#ecfdf5" />
        <StatCard label="Durée moy. consultation" value={stats.avgDuration > 0 ? `${stats.avgDuration}j` : '—'} sub="Sortie → Retour" icon={Timer} color="#2563eb" bg="#eff6ff" />
        <StatCard label="Retards en cours" value={stats.totalRetard} sub={stats.totalJoursRetard > 0 ? `Cumul : ${stats.totalJoursRetard} jours` : ''} icon={AlertCircle} color="#dc2626" bg="#fef2f2" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
        {/* Par statut */}
        <div style={{ padding: 16, background: '#fff', borderRadius: 12, border: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}><PieChart size={14} color={COLORS.primary} />Répartition par statut</div>
          {Object.entries(stats.byStatut).sort((a,b)=>b[1]-a[1]).map(([k,v]) => { const s = getSt(k); return <BarRow key={k} label={s.label} value={v} max={stats.total} color={s.color} />; })}
        </div>

        {/* Par type + priorité */}
        <div style={{ padding: 16, background: '#fff', borderRadius: 12, border: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}><Layers size={14} color={COLORS.primary} />Par type de prêt</div>
          {Object.entries(stats.byType).sort((a,b)=>b[1]-a[1]).map(([k,v]) => { const p = PRET_TYPES[k]||{}; return <BarRow key={k} label={p.label||k} value={v} max={stats.total} color={p.color} />; })}
          <div style={{ marginTop: 14, borderTop: `1px solid ${COLORS.borderLight}`, paddingTop: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMut, marginBottom: 6 }}>Par priorité</div>
            {Object.entries(stats.byPrio).sort((a,b)=>b[1]-a[1]).map(([k,v]) => { const p = PRIOS[k]||{}; return <BarRow key={k} label={p.label||k} value={v} max={stats.total} color={p.dot||COLORS.textMut} />; })}
          </div>
        </div>

        {/* Par service */}
        <div style={{ padding: 16, background: '#fff', borderRadius: 12, border: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}><Building2 size={14} color={COLORS.primary} />Par service</div>
          {stats.topServices.map(([k,v]) => <BarRow key={k} label={k} value={v} max={maxSvc} color="#0369a1" />)}
        </div>

        {/* Top demandeurs */}
        <div style={{ padding: 16, background: '#fff', borderRadius: 12, border: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}><Users size={14} color={COLORS.primary} />Top demandeurs</div>
          {stats.topDemandeurs.map(([k,v], i) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < stats.topDemandeurs.length-1 ? `1px solid ${COLORS.borderLight}` : 'none' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: `hsl(${i*60},60%,92%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: `hsl(${i*60},50%,40%)`, flexShrink: 0 }}>
                {k.split(' ').map(w=>w[0]).slice(0,2).join('')}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{k}</div></div>
              <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.primary }}>{v}</div>
              <div style={{ width: 40 }}><div style={{ height: 4, background: '#f1f5f9', borderRadius: 2 }}><div style={{ width: `${(v/maxDem)*100}%`, height: '100%', background: COLORS.primary, borderRadius: 2 }} /></div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════ */
function InfoBlk({ label, value, mono, accent, span }) {
  return (
    <div style={span ? { gridColumn: '1/-1' } : {}}>
      <div style={{ fontSize: 10, color: COLORS.textMut, marginBottom: 2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .3 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 600, fontFamily: mono ? 'monospace' : FF, color: accent ? '#dc2626' : COLORS.text }}>{value || '—'}</div>
    </div>
  );
}