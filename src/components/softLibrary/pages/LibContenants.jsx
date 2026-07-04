/* ═══════════════════════════════════════════════════════════════
   SOFT LIBRARY — Contenants physiques (Gestion complète)
   
   User stories :
   ✓ Gestion multi-niveaux : dossier → chemise → boîte → carton
   ✓ Hiérarchie parent / enfant entre contenants
   ✓ Identification unique de chaque contenant
   ✓ Code-barres / QR par contenant
   ✓ Visualisation du contenu d'un contenant
   ✓ Historique des transferts de contenants
   ✓ Capacité maximale et taux de remplissage
   ✓ Scellage / fermeture logique d'un contenant
   ✓ Créer un contenant (gestionnaire)
   ✓ Associer des documents à un contenant (gestionnaire)
   ✓ Voir le contenu d'un contenant (utilisateur)
   ✓ Calculer le taux de remplissage (système)
   ✓ Déplacer un contenant (gestionnaire)
   ✓ Garder l'historique des mouvements (système)
   ✓ Sceller un contenant (gestionnaire)
   ✓ Responsive mobile / tablet / desktop
═══════════════════════════════════════════════════════════════ */
import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  Package, FolderOpen, Archive, Box, Boxes, Plus, Search,
  Eye, Edit3, Trash2, Save, X, Check, ChevronDown, ChevronRight,
  ChevronLeft, Lock, Unlock, Move, MapPin, History, Download,
  Filter, MoreVertical, QrCode, ScanLine, AlertTriangle, Clock,
  Tag, FileText, Hash, Copy, ArrowRight, Printer, RefreshCw,
  CornerDownRight, GripVertical, Layers, BarChart3, List,
  LayoutGrid, CheckCircle2, XCircle, Info, Link2, Unlink,
  Shield, Zap, ChevronUp,
} from 'lucide-react';
import { COLORS, FONT_FAMILY, getStatutUI } from '../theme';
import { Badge, Btn, Modal, Pagination, ProgressBar } from '../components/ui';
import { SHARED_CONT_MOUVEMENTS, SHARED_CONT_HISTORY } from '../data/sharedData';

/* ═══════════════════════════════════════════════════
   CONSTANTES
═══════════════════════════════════════════════════ */
const FF = FONT_FAMILY;
const inp = {
  width: '100%', padding: '9px 12px', borderRadius: 8,
  border: `1.5px solid ${COLORS.border}`, fontSize: 13,
  background: '#fff', outline: 'none', boxSizing: 'border-box',
  fontFamily: FF, transition: 'border-color .15s',
};
const lbl = { fontSize: 11, color: COLORS.textMut, marginBottom: 4, display: 'block', fontWeight: 600 };
const card = { background: '#fff', borderRadius: 12, border: `1px solid ${COLORS.border}`, overflow: 'hidden' };

/* Types de contenants */
const CONT_TYPES = [
  { id: 'dossier',  label: 'Dossier',   icon: FolderOpen, color: COLORS.info,    bg: COLORS.infoBg,     capDefault: 30,  emoji: '📁' },
  { id: 'chemise',  label: 'Chemise',   icon: FileText,   color: COLORS.success, bg: COLORS.successBg,  capDefault: 15,  emoji: '📂' },
  { id: 'boite',    label: 'Boîte',     icon: Box,        color: COLORS.warning, bg: COLORS.warningBg,  capDefault: 100, emoji: '📦' },
  { id: 'carton',   label: 'Carton',    icon: Boxes,      color: COLORS.accent,  bg: COLORS.accentLight,capDefault: 300, emoji: '🗃️' },
  { id: 'classeur', label: 'Classeur',  icon: Archive,    color: COLORS.purple,  bg: COLORS.purpleBg,   capDefault: 50,  emoji: '📒' },
  { id: 'lot',      label: 'Lot',       icon: Package,    color: COLORS.indigo,  bg: COLORS.indigoBg,   capDefault: 500, emoji: '📚' },
];

const CONT_STATUTS = {
  ouvert:   { label: 'Ouvert',   color: COLORS.success, bg: COLORS.successBg, icon: Unlock },
  ferme:    { label: 'Fermé',    color: COLORS.warning, bg: COLORS.warningBg, icon: Lock },
  scelle:   { label: 'Scellé',   color: COLORS.danger,  bg: COLORS.dangerBg,  icon: Shield },
  transit:  { label: 'En transit', color: COLORS.info,  bg: COLORS.infoBg,    icon: Move },
  archive:  { label: 'Archivé',  color: COLORS.purple,  bg: COLORS.purpleBg,  icon: Archive },
};

function getType(t) { return CONT_TYPES.find(c => c.id === t) || CONT_TYPES[0]; }
function getStatut(s) { return CONT_STATUTS[s] || CONT_STATUTS.ouvert; }
function fillPct(c) { return c.capacite > 0 ? Math.round((c.contenu / c.capacite) * 100) : 0; }
function fillColor(p) { return p >= 90 ? COLORS.danger : p >= 70 ? COLORS.warning : p >= 40 ? COLORS.info : COLORS.success; }

/* ═══════════════════════════════════════════════════
   ONGLETS
═══════════════════════════════════════════════════ */
const TABS = [
  { id: 'list',      label: 'Contenants',  icon: List },
  { id: 'tree',      label: 'Hiérarchie',  icon: Layers },
  { id: 'capacity',  label: 'Remplissage', icon: BarChart3 },
  { id: 'movements', label: 'Mouvements',  icon: History },
];

/* ═══════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
═══════════════════════════════════════════════════ */
export default function LibContenants({ documents = [], emplacements = [], contenants = [] }) {
  const data = contenants;
  const docs = documents;
  const empls = emplacements;

  /* ── Resolver: emplacementId → objet + nom lisible ── */
  const getEmpl = useCallback((id) => empls.find(e => e.id === id), [empls]);
  const emplName = useCallback((id) => {
    const e = empls.find(em => em.id === id);
    return e ? (e.label || e.nom || 'Non assigné') : 'Non assigné';
  }, [empls]);
  const emplPath = useCallback((id) => {
    const e = empls.find(em => em.id === id);
    if (!e) return '—';
    const site = e.site || e.batiment || '';
    const bat = e.batiment || '';
    const salle = e.salle || e.etage || '';
    const nom = e.label || e.nom || '';
    return `${site} › ${bat} › ${salle} › ${nom}`;
  }, [empls]);

  const [tab, setTab]             = useState('list');
  const [search, setSearch]       = useState('');
  const [typeF, setTypeF]         = useState('all');
  const [statutF, setStatutF]     = useState('all');
  const [viewMode, setViewMode]   = useState('table');
  const [page, setPage]           = useState(1);
  const [sortBy, setSortBy]       = useState('id');
  const [sortDir, setSortDir]     = useState('desc');

  // Modals
  const [showCreate, setShowCreate]   = useState(false);
  const [editCont, setEditCont]       = useState(null);
  const [showDetail, setShowDetail]   = useState(null);
  const [showQR, setShowQR]           = useState(null);
  const [showAssoc, setShowAssoc]     = useState(null);
  const [showMove, setShowMove]       = useState(null);
  const [showSeal, setShowSeal]       = useState(null);
  const [showHistory, setShowHistory] = useState(null);

  const [isMobile, setIsMobile] = useState(false);
  React.useEffect(() => {
    const ck = () => setIsMobile(window.innerWidth < 768);
    ck(); window.addEventListener('resize', ck);
    return () => window.removeEventListener('resize', ck);
  }, []);

  /* ── Filtrage + tri ── */
  const filtered = useMemo(() => {
    let r = data;
    if (search) { const s = search.toLowerCase(); r = r.filter(c => c.id.toLowerCase().includes(s) || c.label.toLowerCase().includes(s) || (c.codeBarres || '').toLowerCase().includes(s)); }
    if (typeF !== 'all') r = r.filter(c => c.type === typeF);
    if (statutF !== 'all') r = r.filter(c => c.statut === statutF);
    r = [...r].sort((a, b) => {
      let va = a[sortBy], vb = b[sortBy];
      if (sortBy === 'remplissage') { va = fillPct(a); vb = fillPct(b); }
      if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortDir === 'asc' ? (va || 0) - (vb || 0) : (vb || 0) - (va || 0);
    });
    return r;
  }, [data, search, typeF, statutF, sortBy, sortDir]);

  const perPage = isMobile ? 8 : 12;
  const totalPages = Math.ceil(filtered.length / perPage);
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  /* ── Stats ── */
  const stats = useMemo(() => {
    const total = data.length;
    const ouverts = data.filter(c => c.statut === 'ouvert').length;
    const scelles = data.filter(c => c.statut === 'scelle').length;
    const totalCap = data.reduce((s, c) => s + (c.capacite || 0), 0);
    const totalCont = data.reduce((s, c) => s + (c.contenu || 0), 0);
    const avgFill = totalCap > 0 ? Math.round((totalCont / totalCap) * 100) : 0;
    const alerts = data.filter(c => fillPct(c) >= 90).length;
    return { total, ouverts, scelles, avgFill, alerts, totalCap, totalCont };
  }, [data]);

  const toggleSort = (field) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortDir('desc'); }
  };

  /* ── Doc count per contenant ── */
  const docCount = useMemo(() => {
    const m = {};
    docs.forEach(d => { if (d.contenantId) m[d.contenantId] = (m[d.contenantId] || 0) + 1; });
    return m;
  }, [docs]);

  return (
    <div>
      {/* ── HEADER ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: isMobile ? 20 : 24, fontWeight: 700 }}>Contenants</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: COLORS.textMut }}>
            Gestion et traçabilité des contenants physiques
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {!isMobile && <Btn icon={Download} variant="outline" size="sm">Exporter</Btn>}
          <Btn icon={Plus} size="sm" onClick={() => { setEditCont(null); setShowCreate(true); }}>
            {isMobile ? 'Nouveau' : 'Nouveau contenant'}
          </Btn>
        </div>
      </div>

      {/* ── KPI ── */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fit,minmax(155px,1fr))', gap: isMobile ? 8 : 12, marginBottom: 18 }}>
        {[
          { icon: Package, label: 'Total', value: stats.total, color: COLORS.primary, bg: COLORS.primaryLighter },
          { icon: Unlock, label: 'Ouverts', value: stats.ouverts, color: COLORS.success, bg: COLORS.successBg },
          { icon: Shield, label: 'Scellés', value: stats.scelles, color: COLORS.danger, bg: COLORS.dangerBg },
          { icon: BarChart3, label: 'Remplissage moyen', value: `${stats.avgFill}%`, color: fillColor(stats.avgFill), bg: stats.avgFill >= 70 ? COLORS.warningBg : COLORS.successBg },
          { icon: AlertTriangle, label: 'Alertes (≥90%)', value: stats.alerts, color: stats.alerts > 0 ? COLORS.danger : COLORS.success, bg: stats.alerts > 0 ? COLORS.dangerBg : COLORS.successBg },
        ].map((k, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 10, padding: isMobile ? '10px 12px' : '14px 16px', border: `1px solid ${COLORS.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 10, color: COLORS.textMut, fontWeight: 500, marginBottom: 3 }}>{k.label}</div>
                <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700 }}>{k.value}</div>
              </div>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <k.icon size={14} color={k.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── TABS ── */}
      <div style={{ display: 'flex', gap: 3, marginBottom: 14, overflowX: 'auto', borderBottom: `2px solid ${COLORS.border}` }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              padding: isMobile ? '8px 10px' : '9px 16px', background: 'none', border: 'none',
              cursor: 'pointer', fontSize: 12, fontWeight: tab === t.id ? 700 : 500,
              color: tab === t.id ? COLORS.primary : COLORS.textMut, fontFamily: FF,
              borderBottom: tab === t.id ? `2.5px solid ${COLORS.primary}` : '2.5px solid transparent',
              marginBottom: -2, display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
            }}>
            <t.icon size={14} />{t.label}
          </button>
        ))}
      </div>

      {/* ── TAB: LIST ── */}
      {tab === 'list' && (
        <ContListTab
          data={pageData} filtered={filtered} allData={data} docCount={docCount}
          search={search} setSearch={setSearch}
          typeF={typeF} setTypeF={setTypeF}
          statutF={statutF} setStatutF={setStatutF}
          viewMode={viewMode} setViewMode={setViewMode}
          sortBy={sortBy} sortDir={sortDir} toggleSort={toggleSort}
          page={page} totalPages={totalPages} setPage={setPage}
          isMobile={isMobile} emplName={emplName}
          onView={setShowDetail} onEdit={c => { setEditCont(c); setShowCreate(true); }}
          onQR={setShowQR} onAssoc={setShowAssoc} onMove={setShowMove}
          onSeal={setShowSeal} onHistory={setShowHistory}
        />
      )}

      {/* ── TAB: TREE ── */}
      {tab === 'tree' && <ContTreeTab data={data} empls={empls} docs={docs} docCount={docCount} isMobile={isMobile} emplName={emplName} onView={setShowDetail} />}

      {/* ── TAB: CAPACITY ── */}
      {tab === 'capacity' && <ContCapacityTab data={data} isMobile={isMobile} />}

      {/* ── TAB: MOVEMENTS ── */}
      {tab === 'movements' && <ContMovementsTab isMobile={isMobile} />}

      {/* ═══ MODALS ═══ */}

      {/* Création / Édition */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)}
        title={editCont ? 'Modifier le contenant' : 'Nouveau contenant'} width={isMobile ? '95vw' : 580}>
        <ContForm cont={editCont} allData={data} empls={empls} isMobile={isMobile}
          onSave={d => { console.log('Save:', d); setShowCreate(false); }}
          onCancel={() => setShowCreate(false)} />
      </Modal>

      {/* Détail */}
      <Modal isOpen={!!showDetail} onClose={() => setShowDetail(null)}
        title="Détail du contenant" width={isMobile ? '95vw' : 660}>
        {showDetail && <ContDetail cont={showDetail} data={data} docs={docs} empls={empls}
          docCount={docCount} isMobile={isMobile} emplName={emplName} emplPath={emplPath}
          onQR={() => { setShowDetail(null); setShowQR(showDetail); }}
          onAssoc={() => { setShowDetail(null); setShowAssoc(showDetail); }}
          onMove={() => { setShowDetail(null); setShowMove(showDetail); }}
          onSeal={() => { setShowDetail(null); setShowSeal(showDetail); }}
          onHistory={() => { setShowDetail(null); setShowHistory(showDetail); }}
          onEdit={() => { setShowDetail(null); setEditCont(showDetail); setShowCreate(true); }}
        />}
      </Modal>

      {/* QR / Code-barres */}
      <Modal isOpen={!!showQR} onClose={() => setShowQR(null)}
        title="QR / Code-barres" width={isMobile ? '95vw' : 480}>
        {showQR && <ContQRPanel cont={showQR} isMobile={isMobile} />}
      </Modal>

      {/* Associer documents */}
      <Modal isOpen={!!showAssoc} onClose={() => setShowAssoc(null)}
        title="Associer des documents" width={isMobile ? '95vw' : 600}>
        {showAssoc && <ContAssocPanel cont={showAssoc} docs={docs} isMobile={isMobile}
          onSave={d => { console.log('Assoc:', d); setShowAssoc(null); }} />}
      </Modal>

      {/* Déplacer */}
      <Modal isOpen={!!showMove} onClose={() => setShowMove(null)}
        title="Déplacer le contenant" width={isMobile ? '95vw' : 520}>
        {showMove && <ContMovePanel cont={showMove} empls={empls} isMobile={isMobile} emplName={emplName}
          onSave={d => { console.log('Move:', d); setShowMove(null); }} />}
      </Modal>

      {/* Sceller */}
      <Modal isOpen={!!showSeal} onClose={() => setShowSeal(null)}
        title="Sceller / Fermer le contenant" width={isMobile ? '95vw' : 460}>
        {showSeal && <ContSealPanel cont={showSeal} isMobile={isMobile}
          onConfirm={s => { console.log('Seal:', s); setShowSeal(null); }} />}
      </Modal>

      {/* Historique */}
      <Modal isOpen={!!showHistory} onClose={() => setShowHistory(null)}
        title="Historique du contenant" width={isMobile ? '95vw' : 620}>
        {showHistory && <ContHistoryPanel cont={showHistory} isMobile={isMobile} />}
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB 1 — LISTE DES CONTENANTS
═══════════════════════════════════════════════════════════════ */
function ContListTab({
  data, filtered, allData, docCount, search, setSearch, typeF, setTypeF,
  statutF, setStatutF, viewMode, setViewMode, sortBy, sortDir, toggleSort,
  page, totalPages, setPage, isMobile, emplName,
  onView, onEdit, onQR, onAssoc, onMove, onSeal, onHistory,
}) {
  return (
    <div>
      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: isMobile ? '100%' : 200, maxWidth: isMobile ? '100%' : 320 }}>
          <Search size={14} color={COLORS.textMut} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Rechercher ID, label, code-barres..."
            style={{ ...inp, paddingLeft: 32, fontSize: 12, background: COLORS.surfaceAlt }} />
        </div>
        <select value={typeF} onChange={e => { setTypeF(e.target.value); setPage(1); }}
          style={{ ...inp, width: 'auto', fontSize: 12, padding: '7px 10px' }}>
          <option value="all">Tous types</option>
          {CONT_TYPES.map(t => <option key={t.id} value={t.id}>{t.emoji} {t.label}</option>)}
        </select>
        <select value={statutF} onChange={e => { setStatutF(e.target.value); setPage(1); }}
          style={{ ...inp, width: 'auto', fontSize: 12, padding: '7px 10px' }}>
          <option value="all">Tous statuts</option>
          {Object.entries(CONT_STATUTS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        {!isMobile && (
          <div style={{ display: 'flex', gap: 2 }}>
            {['table', 'grid'].map(v => (
              <button key={v} onClick={() => setViewMode(v)} style={{
                padding: 6, borderRadius: 6, border: `1px solid ${viewMode === v ? COLORS.primary : COLORS.borderLight}`,
                background: viewMode === v ? COLORS.primaryLighter : '#fff', cursor: 'pointer',
              }}>
                {v === 'table' ? <List size={14} color={viewMode === v ? COLORS.primary : COLORS.textMut} /> : <LayoutGrid size={14} color={viewMode === v ? COLORS.primary : COLORS.textMut} />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Table view */}
      {(viewMode === 'table' && !isMobile) ? (
        <div style={card}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: COLORS.surfaceAlt, borderBottom: `1.5px solid ${COLORS.border}` }}>
                  {[
                    { key: 'id', label: 'Réf.' },
                    { key: 'type', label: 'Type' },
                    { key: 'label', label: 'Libellé' },
                    { key: 'emplacement', label: 'Emplacement' },
                    { key: 'remplissage', label: 'Remplissage' },
                    { key: 'statut', label: 'Statut' },
                    { key: 'actions', label: '' },
                  ].map(col => (
                    <th key={col.key} onClick={() => col.key !== 'actions' && toggleSort(col.key)}
                      style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: COLORS.textMut, cursor: col.key !== 'actions' ? 'pointer' : 'default', whiteSpace: 'nowrap', userSelect: 'none' }}>
                      {col.label}
                      {sortBy === col.key && <span style={{ marginLeft: 3 }}>{sortDir === 'asc' ? '↑' : '↓'}</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map(c => {
                  const tp = getType(c.type);
                  const st = getStatut(c.statut);
                  const pct = fillPct(c);
                  const Icon = tp.icon;
                  return (
                    <tr key={c.id} onClick={() => onView(c)}
                      style={{ borderBottom: `1px solid ${COLORS.borderLight}`, cursor: 'pointer', transition: 'background .1s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fafbfc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontWeight: 600, fontSize: 12, color: COLORS.primaryLight }}>{c.id}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 26, height: 26, borderRadius: 6, background: tp.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon size={13} color={tp.color} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 600 }}>{tp.label}</span>
                        </div>
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{c.label}</div>
                        {c.parentId && <div style={{ fontSize: 10, color: COLORS.textMut }}>↳ {c.parentId}</div>}
                      </td>
                      <td style={{ padding: '10px 12px', fontSize: 12, color: COLORS.textSec }}>{emplName(c.emplacementId)}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 60 }}><ProgressBar percent={pct} height={5} /></div>
                          <span style={{ fontSize: 11, fontWeight: 600, color: fillColor(pct) }}>{pct}%</span>
                          <span style={{ fontSize: 10, color: COLORS.textMut }}>{c.contenu}/{c.capacite}</span>
                        </div>
                      </td>
                      <td style={{ padding: '10px 12px' }}><Badge label={st.label} color={st.color} bg={st.bg} /></td>
                      <td style={{ padding: '10px 8px' }} onClick={e => e.stopPropagation()}>
                        <ContActions cont={c} onView={onView} onEdit={onEdit} onQR={onQR}
                          onAssoc={onAssoc} onMove={onMove} onSeal={onSeal} onHistory={onHistory} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && <div style={{ padding: '10px 14px' }}><Pagination page={page} totalPages={totalPages} onPageChange={setPage} /></div>}
        </div>
      ) : (
        /* Grid / Mobile cards */
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill,minmax(300px,1fr))', gap: 12 }}>
            {data.map(c => <ContCard key={c.id} cont={c} docCount={docCount[c.id] || 0} isMobile={isMobile} emplName={emplName}
              onView={onView} onQR={onQR} onAssoc={onAssoc} onSeal={onSeal} />)}
          </div>
          {totalPages > 1 && <div style={{ marginTop: 14 }}><Pagination page={page} totalPages={totalPages} onPageChange={setPage} /></div>}
        </div>
      )}
    </div>
  );
}

/* ── Contenant Card ── */
function ContCard({ cont, docCount, isMobile, emplName, onView, onQR, onAssoc, onSeal }) {
  const tp = getType(cont.type);
  const st = getStatut(cont.statut);
  const pct = fillPct(cont);
  const Icon = tp.icon;
  const StIcon = st.icon;

  return (
    <div onClick={() => onView(cont)} style={{ ...card, cursor: 'pointer', transition: 'all .15s' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,.06)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
      <div style={{ padding: isMobile ? 12 : 14 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: tp.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={17} color={tp.color} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{cont.label}</div>
              <div style={{ fontSize: 10, color: COLORS.textMut, fontFamily: 'monospace' }}>{cont.id}</div>
            </div>
          </div>
          <Badge label={st.label} color={st.color} bg={st.bg} />
        </div>

        {/* Fill bar */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: COLORS.textSec, marginBottom: 4 }}>
            <span>{cont.contenu}/{cont.capacite} éléments</span>
            <span style={{ fontWeight: 700, color: fillColor(pct) }}>{pct}%</span>
          </div>
          <div style={{ height: 6, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: fillColor(pct), borderRadius: 3, transition: 'width .3s' }} />
          </div>
        </div>

        {/* Info row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: COLORS.textMut }}>
          {cont.emplacementId && <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><MapPin size={10} />{emplName(cont.emplacementId)}</span>}
          {cont.parentId && <span>↳ {cont.parentId}</span>}
          {docCount > 0 && <span>{docCount} doc{docCount > 1 ? 's' : ''}</span>}
        </div>

        {/* Quick actions */}
        <div style={{ display: 'flex', gap: 6, marginTop: 10, borderTop: `1px solid ${COLORS.borderLight}`, paddingTop: 10 }} onClick={e => e.stopPropagation()}>
          <MiniBtn icon={QrCode} label="QR" onClick={() => onQR(cont)} />
          <MiniBtn icon={Link2} label="Associer" onClick={() => onAssoc(cont)} />
          {cont.statut === 'ouvert' && <MiniBtn icon={Lock} label="Sceller" onClick={() => onSeal(cont)} />}
        </div>
      </div>
    </div>
  );
}

/* ── Actions dropdown ── */
function ContActions({ cont, onView, onEdit, onQR, onAssoc, onMove, onSeal, onHistory }) {
  const [open, setOpen] = useState(false);
  const items = [
    { icon: Eye, label: 'Voir détail', action: () => onView(cont) },
    { icon: Edit3, label: 'Modifier', action: () => onEdit(cont) },
    { icon: QrCode, label: 'QR / Code-barres', action: () => onQR(cont) },
    { icon: Link2, label: 'Associer documents', action: () => onAssoc(cont) },
    { icon: Move, label: 'Déplacer', action: () => onMove(cont) },
    ...(cont.statut === 'ouvert' ? [{ icon: Lock, label: 'Fermer', action: () => onSeal(cont) }] : []),
    ...(cont.statut === 'ouvert' || cont.statut === 'ferme' ? [{ icon: Shield, label: 'Sceller', action: () => onSeal(cont) }] : []),
    { icon: History, label: 'Historique', action: () => onHistory(cont) },
  ];
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
        <MoreVertical size={15} color={COLORS.textMut} />
      </button>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 999 }} onClick={() => setOpen(false)} />
          <div style={{ position: 'absolute', right: 0, top: '100%', background: '#fff', borderRadius: 10, border: `1px solid ${COLORS.border}`, boxShadow: '0 8px 24px rgba(0,0,0,.1)', zIndex: 1000, minWidth: 180, padding: 4 }}>
            {items.map((it, i) => (
              <button key={i} onClick={() => { it.action(); setOpen(false); }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: COLORS.textSec, borderRadius: 6, fontFamily: FF }}
                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <it.icon size={14} />{it.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB 2 — HIÉRARCHIE PARENT/ENFANT
═══════════════════════════════════════════════════════════════ */
function ContTreeTab({ data, empls, docs, docCount, isMobile, emplName, onView }) {
  const [expanded, setExpanded] = useState({});
  const [searchT, setSearchT] = useState('');
  const toggle = id => setExpanded(p => ({ ...p, [id]: !p[id] }));

  /* ── Build hybrid tree: Emplacement (root) → Contenants → Documents ── */
  const tree = useMemo(() => {
    /* Group emplacements by site → batiment → etage → salle */
    const siteMap = {};
    empls.forEach(e => {
      const site = e.site || e.batiment || 'Non classé';
      const bat = e.batiment || '—';
      if (!siteMap[site]) siteMap[site] = {};
      if (!siteMap[site][bat]) siteMap[site][bat] = {};
      const etg = e.etage || 'RDC';
      if (!siteMap[site][bat][etg]) siteMap[site][bat][etg] = [];
      siteMap[site][bat][etg].push(e);
    });

    /* Get root contenants for an emplacementId */
    const rootConts = (eid) => data.filter(c => c.emplacementId === eid && !c.parentId);
    const childConts = (pid) => data.filter(c => c.parentId === pid);
    const docsOf = (cid) => docs.filter(d => d.contenantId === cid);

    /* Build contenant subtree */
    const buildCont = (c) => {
      const kids = childConts(c.id);
      const cdocs = docsOf(c.id);
      return {
        id: c.id, label: c.label, nodeType: 'contenant', contenant: c,
        children: [
          ...kids.map(buildCont),
          ...cdocs.map(d => ({ id: d.id, label: d.titre, nodeType: 'document', document: d, children: [] })),
        ],
      };
    };

    /* Build emplacement tree */
    return Object.entries(siteMap).map(([site, bats]) => ({
      id: `site-${site}`, label: site, nodeType: 'site', children:
        Object.entries(bats).map(([bat, etages]) => ({
          id: `bat-${site}-${bat}`, label: bat, nodeType: 'batiment', children:
            Object.entries(etages).map(([etg, salles]) => ({
              id: `etg-${site}-${bat}-${etg}`, label: `Étage ${etg}`, nodeType: 'etage', children:
                salles.map(s => {
                  const rConts = rootConts(s.id);
                  const unassigned = docs.filter(d => !d.contenantId);
                  return {
                    id: s.id, label: `${s.nom} (${s.salle})`, nodeType: 'salle', emplacement: s,
                    children: [
                      ...rConts.map(buildCont),
                    ],
                  };
                }),
            })),
        })),
    }));
  }, [data, empls, docs]);

  /* ── Expand all IDs in tree ── */
  const getAllIds = (nodes) => {
    let ids = [];
    nodes.forEach(n => { ids.push(n.id); if (n.children?.length) ids = ids.concat(getAllIds(n.children)); });
    return ids;
  };
  const expandAll = () => { const a = {}; getAllIds(tree).forEach(id => { a[id] = true; }); setExpanded(a); };

  /* ── Search filter ── */
  const matchSearch = (node) => {
    if (!searchT) return true;
    const s = searchT.toLowerCase();
    if (node.label?.toLowerCase().includes(s)) return true;
    if (node.id?.toLowerCase().includes(s)) return true;
    if (node.children?.some(matchSearch)) return true;
    return false;
  };

  /* ── Node styles by type ── */
  const nodeStyle = (type) => {
    switch (type) {
      case 'site':      return { icon: MapPin,     color: COLORS.primary,  bg: COLORS.primaryLighter, tag: 'Site' };
      case 'batiment':  return { icon: Box,         color: COLORS.indigo,   bg: COLORS.indigoBg,       tag: 'Bâtiment' };
      case 'etage':     return { icon: Layers,      color: COLORS.purple,   bg: COLORS.purpleBg,       tag: 'Étage' };
      case 'salle':     return { icon: Archive,     color: COLORS.accent,   bg: COLORS.accentLight,    tag: 'Salle' };
      case 'contenant': return { icon: null,        color: null,            bg: null,                  tag: '' };
      case 'document':  return { icon: FileText,    color: COLORS.textMut,  bg: '#f1f5f9',             tag: 'Doc' };
      default:          return { icon: Package,     color: COLORS.textMut,  bg: '#f1f5f9',             tag: '' };
    }
  };

  /* ── Render a single tree node ── */
  const renderNode = (node, depth = 0) => {
    if (!matchSearch(node)) return null;
    const hasKids = node.children && node.children.length > 0;
    const isExp = expanded[node.id];
    const indent = isMobile ? (8 + depth * 14) : (14 + depth * 22);

    /* Contenant nodes use their own type style */
    let Icon, iconColor, iconBg, tagLabel;
    if (node.nodeType === 'contenant') {
      const tp = getType(node.contenant.type);
      Icon = tp.icon; iconColor = tp.color; iconBg = tp.bg;
      tagLabel = tp.label;
    } else {
      const ns = nodeStyle(node.nodeType);
      Icon = ns.icon; iconColor = ns.color; iconBg = ns.bg;
      tagLabel = ns.tag;
    }

    /* Capacity info for emplacements */
    const empl = node.emplacement;
    const cont = node.contenant;
    const doc = node.document;

    return (
      <div key={node.id}>
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: isMobile ? 5 : 8,
            padding: isMobile ? '7px 8px' : '8px 12px', paddingLeft: indent,
            borderBottom: `1px solid ${COLORS.borderLight}`,
            cursor: 'pointer', transition: 'background .1s',
            background: doc ? '#fefefe' : 'transparent',
          }}
          onMouseEnter={e => { if (!doc) e.currentTarget.style.background = '#f8fafc'; }}
          onMouseLeave={e => { if (!doc) e.currentTarget.style.background = doc ? '#fefefe' : 'transparent'; }}
          onClick={() => {
            if (cont) onView(cont);
            else if (hasKids) toggle(node.id);
          }}
        >
          {/* Expand / leaf marker */}
          {hasKids ? (
            <div style={{ width: 14, flexShrink: 0 }} onClick={e => { e.stopPropagation(); toggle(node.id); }}>
              {isExp ? <ChevronDown size={13} color={COLORS.textMut} /> : <ChevronRight size={13} color={COLORS.textMut} />}
            </div>
          ) : (
            <div style={{ width: 14, flexShrink: 0 }}>
              {doc ? <CornerDownRight size={10} color={COLORS.borderLight} /> : <div style={{ width: 6, height: 6, borderRadius: '50%', background: COLORS.borderLight, margin: '0 4px' }} />}
            </div>
          )}

          {/* Icon */}
          {Icon && (
            <div style={{
              width: isMobile ? 24 : 28, height: isMobile ? 24 : 28, borderRadius: 7,
              background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Icon size={isMobile ? 12 : 14} color={iconColor} />
            </div>
          )}

          {/* Label */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: doc ? 11 : (isMobile ? 12 : 13),
              fontWeight: doc ? 500 : 600,
              color: doc ? COLORS.textSec : COLORS.text,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {node.label}
            </div>
            {(cont || doc) && (
              <div style={{ fontSize: 10, color: COLORS.textMut, fontFamily: 'monospace' }}>{node.id}</div>
            )}
          </div>

          {/* Right side info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
            {/* Emplacement: show contenant count */}
            {empl && (
              <>
                <span style={{ fontSize: 10, color: COLORS.textMut }}>
                  {data.filter(c => c.emplacementId === empl.id && !c.parentId).length} cont.
                </span>
                <div style={{ width: isMobile ? 35 : 50 }}><ProgressBar percent={empl.capacite > 0 ? Math.round((empl.occupe / empl.capacite) * 100) : 0} height={4} /></div>
              </>
            )}

            {/* Contenant: fill bar + statut */}
            {cont && (
              <>
                <div style={{ width: isMobile ? 35 : 50 }}><ProgressBar percent={fillPct(cont)} height={4} /></div>
                <span style={{ fontSize: 10, fontWeight: 600, color: fillColor(fillPct(cont)), width: 26, textAlign: 'right' }}>{fillPct(cont)}%</span>
                <Badge label={getStatut(cont.statut).label} color={getStatut(cont.statut).color} bg={getStatut(cont.statut).bg} />
              </>
            )}

            {/* Document: statut */}
            {doc && doc.statut && (
              <Badge label={getStatutUI(doc.statut)?.label || doc.statut} color={getStatutUI(doc.statut)?.color || COLORS.textMut} bg={getStatutUI(doc.statut)?.bg || '#f1f5f9'} />
            )}

            {/* Tag */}
            {!cont && !doc && tagLabel && !isMobile && (
              <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: iconBg, color: iconColor, fontWeight: 600 }}>{tagLabel}</span>
            )}
          </div>
        </div>

        {/* Children */}
        {hasKids && isExp && node.children.map(ch => renderNode(ch, depth + 1))}
      </div>
    );
  };

  return (
    <div>
      {/* Controls */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: isMobile ? '100%' : 180, maxWidth: isMobile ? '100%' : 280 }}>
          <Search size={13} color={COLORS.textMut} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)' }} />
          <input value={searchT} onChange={e => setSearchT(e.target.value)}
            placeholder="Filtrer l'arbre..."
            style={{ ...inp, paddingLeft: 30, fontSize: 12, background: COLORS.surfaceAlt, padding: '7px 10px 7px 30px' }} />
        </div>
        <Btn variant="outline" size="sm" onClick={expandAll}>Tout ouvrir</Btn>
        <Btn variant="outline" size="sm" onClick={() => setExpanded({})}>Tout fermer</Btn>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: isMobile ? 5 : 10, marginBottom: 8, overflowX: 'auto', paddingBottom: 2 }}>
        {[
          { label: 'Site', color: COLORS.primary },
          { label: 'Bâtiment', color: COLORS.indigo },
          { label: 'Étage', color: COLORS.purple },
          { label: 'Salle', color: COLORS.accent },
          ...CONT_TYPES.map(t => ({ label: t.label, color: t.color })),
          { label: 'Document', color: COLORS.textMut },
        ].map((l, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: COLORS.textMut, whiteSpace: 'nowrap' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: l.color, flexShrink: 0 }} />{l.label}
          </div>
        ))}
      </div>

      {/* Info banner */}
      <div style={{ padding: '8px 12px', background: COLORS.infoBg, borderRadius: 8, marginBottom: 10, fontSize: 11, color: COLORS.info, display: 'flex', alignItems: 'center', gap: 6 }}>
        <Info size={13} />Vue unifiée : Emplacement physique → Contenants → Documents. Cliquez un contenant pour voir sa fiche.
      </div>

      {/* Tree */}
      <div style={card}>
        <div style={{ maxHeight: isMobile ? 'calc(100vh - 480px)' : 'calc(100vh - 420px)', overflowY: 'auto' }}>
          {tree.map(node => renderNode(node, 0))}
          {tree.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: COLORS.textMut }}>
              <Package size={32} strokeWidth={1.2} style={{ opacity: .3, marginBottom: 8 }} />
              <div style={{ fontSize: 13, fontWeight: 600 }}>Aucun emplacement</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB 3 — REMPLISSAGE / CAPACITÉ
═══════════════════════════════════════════════════════════════ */
function ContCapacityTab({ data, isMobile }) {
  const [sort, setSort] = useState('pct_desc');
  const sorted = useMemo(() => {
    const arr = data.map(c => ({ ...c, pct: fillPct(c) }));
    if (sort === 'pct_desc') arr.sort((a, b) => b.pct - a.pct);
    if (sort === 'pct_asc') arr.sort((a, b) => a.pct - b.pct);
    if (sort === 'name') arr.sort((a, b) => a.label.localeCompare(b.label));
    return arr;
  }, [data, sort]);

  const ranges = useMemo(() => ({
    crit: sorted.filter(c => c.pct >= 90),
    high: sorted.filter(c => c.pct >= 70 && c.pct < 90),
    mod: sorted.filter(c => c.pct >= 40 && c.pct < 70),
    low: sorted.filter(c => c.pct < 40),
  }), [sorted]);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: 10, marginBottom: 14 }}>
        {[
          { label: 'Critique ≥90%', v: ranges.crit.length, c: COLORS.danger, bg: COLORS.dangerBg },
          { label: 'Élevé 70-89%', v: ranges.high.length, c: COLORS.warning, bg: COLORS.warningBg },
          { label: 'Modéré 40-69%', v: ranges.mod.length, c: COLORS.info, bg: COLORS.infoBg },
          { label: 'Faible <40%', v: ranges.low.length, c: COLORS.success, bg: COLORS.successBg },
        ].map((r, i) => (
          <div key={i} style={{ padding: 12, borderRadius: 8, background: r.bg, border: `1px solid ${r.c}20`, textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: r.c }}>{r.v}</div>
            <div style={{ fontSize: 10, color: COLORS.textSec }}>{r.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
        <select value={sort} onChange={e => setSort(e.target.value)}
          style={{ ...inp, width: 'auto', fontSize: 12, padding: '6px 10px' }}>
          <option value="pct_desc">Remplissage ↓</option>
          <option value="pct_asc">Remplissage ↑</option>
          <option value="name">Nom A-Z</option>
        </select>
      </div>

      <div style={card}>
        {sorted.map((c, i) => {
          const tp = getType(c.type);
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 12, padding: isMobile ? '8px 10px' : '9px 14px', borderBottom: `1px solid ${COLORS.borderLight}` }}>
              <span style={{ fontSize: 16 }}>{tp.emoji}</span>
              <div style={{ width: isMobile ? 90 : 140, fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 0 }}>{c.label}</div>
              <div style={{ flex: 1, height: 18, background: '#f1f5f9', borderRadius: 5, overflow: 'hidden', position: 'relative' }}>
                <div style={{ width: `${c.pct}%`, height: '100%', background: fillColor(c.pct), borderRadius: 5, transition: 'width .3s', minWidth: c.pct > 0 ? 3 : 0 }} />
                {c.pct > 20 && <span style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', fontSize: 10, fontWeight: 700, color: c.pct > 50 ? '#fff' : COLORS.textSec }}>{c.contenu}/{c.capacite}</span>}
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: fillColor(c.pct), width: 36, textAlign: 'right', flexShrink: 0 }}>{c.pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB 4 — MOUVEMENTS
═══════════════════════════════════════════════════════════════ */
function ContMovementsTab({ isMobile }) {
  const [typeF, setTypeF] = useState('all');
  const types = { deplacement: { l: 'Déplacement', c: COLORS.info, bg: COLORS.infoBg, icon: Move }, creation: { l: 'Création', c: COLORS.success, bg: COLORS.successBg, icon: Plus }, scellage: { l: 'Scellage', c: COLORS.danger, bg: COLORS.dangerBg, icon: Shield }, association: { l: 'Association', c: COLORS.purple, bg: COLORS.purpleBg, icon: Link2 }, ouverture: { l: 'Ouverture', c: COLORS.warning, bg: COLORS.warningBg, icon: Unlock } };
  const mvts = SHARED_CONT_MOUVEMENTS;
  const filtered = typeF === 'all' ? mvts : mvts.filter(m => m.type === typeF);

  return (
    <div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 14, overflowX: 'auto' }}>
        {[{ id: 'all', label: 'Tous' }, ...Object.entries(types).map(([k, v]) => ({ id: k, label: v.l }))].map(f => (
          <button key={f.id} onClick={() => setTypeF(f.id)}
            style={{ padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, fontFamily: FF, background: typeF === f.id ? COLORS.primary : '#fff', color: typeF === f.id ? '#fff' : COLORS.textSec, border: `1.5px solid ${typeF === f.id ? COLORS.primary : COLORS.border}`, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {f.label}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {filtered.map((m, i) => {
          const tu = types[m.type] || types.deplacement;
          const Icon = tu.icon;
          return (
            <div key={i} style={{ display: 'flex', gap: isMobile ? 10 : 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 30, flexShrink: 0 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: tu.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}><Icon size={13} color={tu.c} /></div>
                {i < filtered.length - 1 && <div style={{ width: 2, flex: 1, background: COLORS.borderLight, minHeight: 8 }} />}
              </div>
              <div style={{ flex: 1, paddingBottom: 12 }}>
                <div style={{ padding: isMobile ? 10 : 12, background: '#fff', borderRadius: 8, border: `1px solid ${COLORS.borderLight}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3, flexWrap: 'wrap', gap: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{m.contenant}</span>
                    <Badge label={tu.l} color={tu.c} bg={tu.bg} />
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.textSec }}>{m.description}</div>
                  {m.de && m.vers && <div style={{ fontSize: 11, color: COLORS.textMut, marginTop: 3, display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}><MapPin size={10} />{m.de}<ArrowRight size={10} />{m.vers}</div>}
                  <div style={{ fontSize: 10, color: COLORS.textMut, marginTop: 4 }}>{m.date} {m.heure} • {m.auteur}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MODAL PANELS
═══════════════════════════════════════════════════════════════ */

/* ── Formulaire création / édition ── */
function ContForm({ cont, allData, empls, isMobile, onSave, onCancel }) {
  const [form, setForm] = useState({
    label: cont?.label || '', type: cont?.type || 'boite', parentId: cont?.parentId || '',
    capacite: cont?.capacite?.toString() || '100', emplacementId: cont?.emplacementId || '',
    codeBarres: cont?.codeBarres || '', description: cont?.description || '',
  });
  const [errors, setErrors] = useState({});
  const up = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: undefined })); };

  const handleSave = () => {
    const e = {};
    if (!form.label.trim()) e.label = 'Libellé requis';
    if (!form.capacite || parseInt(form.capacite) <= 0) e.capacite = 'Capacité invalide';
    setErrors(e);
    if (Object.keys(e).length) return;
    onSave({ ...form, id: cont?.id || `CNT-${Date.now()}`, capacite: parseInt(form.capacite), contenu: cont?.contenu || 0, statut: cont?.statut || 'ouvert' });
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
        <div style={{ gridColumn: '1/-1' }}>
          <label style={lbl}>Libellé *</label>
          <input value={form.label} onChange={e => up('label', e.target.value)} placeholder="Nom du contenant..."
            style={{ ...inp, ...(errors.label ? { borderColor: COLORS.danger } : {}) }} />
          {errors.label && <span style={{ fontSize: 11, color: COLORS.danger }}>{errors.label}</span>}
        </div>
        <div>
          <label style={lbl}>Type de contenant</label>
          <select value={form.type} onChange={e => up('type', e.target.value)} style={inp}>
            {CONT_TYPES.map(t => <option key={t.id} value={t.id}>{t.emoji} {t.label}</option>)}
          </select>
        </div>
        <div>
          <label style={lbl}>Contenant parent (optionnel)</label>
          <select value={form.parentId} onChange={e => up('parentId', e.target.value)} style={inp}>
            <option value="">— Aucun (racine) —</option>
            {allData.filter(c => c.id !== cont?.id).map(c => <option key={c.id} value={c.id}>{getType(c.type).emoji} {c.label} ({c.id})</option>)}
          </select>
        </div>
        <div>
          <label style={lbl}>Capacité maximale *</label>
          <input type="number" value={form.capacite} onChange={e => up('capacite', e.target.value)} min="1"
            style={{ ...inp, ...(errors.capacite ? { borderColor: COLORS.danger } : {}) }} />
        </div>
        <div>
          <label style={lbl}>Emplacement</label>
          <select value={form.emplacementId} onChange={e => up('emplacementId', e.target.value)} style={inp}>
            <option value="">— Non assigné —</option>
            {empls.map(e => <option key={e.id} value={e.id}>{e.batiment || e.site || ''} › {e.etage || e.salle || ''} — {e.label || e.nom || e.id}</option>)}
          </select>
        </div>
        <div>
          <label style={lbl}>Code-barres (auto-généré si vide)</label>
          <input value={form.codeBarres} onChange={e => up('codeBarres', e.target.value)} placeholder="Auto"
            style={{ ...inp, fontFamily: 'monospace' }} />
        </div>
        <div style={{ gridColumn: '1/-1' }}>
          <label style={lbl}>Description</label>
          <textarea value={form.description} onChange={e => up('description', e.target.value)} rows={2}
            placeholder="Description optionnelle..." style={{ ...inp, resize: 'vertical' }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16, paddingTop: 14, borderTop: `1px solid ${COLORS.border}` }}>
        <Btn variant="outline" size="sm" onClick={onCancel}>Annuler</Btn>
        <Btn size="sm" icon={Save} onClick={handleSave}>{cont ? 'Enregistrer' : 'Créer le contenant'}</Btn>
      </div>
    </div>
  );
}

/* ── Détail contenant ── */
function ContDetail({ cont, data, docs, empls, docCount, isMobile, emplName, emplPath, onQR, onAssoc, onMove, onSeal, onHistory, onEdit }) {
  const tp = getType(cont.type);
  const st = getStatut(cont.statut);
  const pct = fillPct(cont);
  const Icon = tp.icon;
  const StIcon = st.icon;
  const children = data.filter(c => c.parentId === cont.id);
  const parent = data.find(c => c.id === cont.parentId);
  const assocDocs = docs.filter(d => d.contenantId === cont.id);
  const [tab, setTab] = useState('info');

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: 10, background: tp.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={24} color={tp.color} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{cont.label}</div>
          <div style={{ fontSize: 12, color: COLORS.textMut, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{cont.id}</span>
            <Badge label={tp.label} color={tp.color} bg={tp.bg} />
            <Badge label={st.label} color={st.color} bg={st.bg} />
          </div>
        </div>
      </div>

      {/* Fill gauge */}
      <div style={{ padding: 14, background: fillColor(pct) + '10', borderRadius: 10, marginBottom: 14, border: `1px solid ${fillColor(pct)}25` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Taux de remplissage</span>
          <span style={{ fontSize: 20, fontWeight: 800, color: fillColor(pct) }}>{pct}%</span>
        </div>
        <div style={{ height: 10, background: '#fff', borderRadius: 5, overflow: 'hidden', marginBottom: 4 }}>
          <div style={{ width: `${pct}%`, height: '100%', background: fillColor(pct), borderRadius: 5, transition: 'width .5s' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: COLORS.textSec }}>
          <span>{cont.contenu} élément{cont.contenu > 1 ? 's' : ''}</span>
          <span>{cont.capacite - cont.contenu} place{cont.capacite - cont.contenu > 1 ? 's' : ''} restante{cont.capacite - cont.contenu > 1 ? 's' : ''}</span>
          <span>Max : {cont.capacite}</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 14, borderBottom: `1.5px solid ${COLORS.border}` }}>
        {['info', 'contenu', 'enfants'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '7px 14px', border: 'none', background: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: tab === t ? 700 : 500, fontFamily: FF,
            color: tab === t ? COLORS.primary : COLORS.textMut,
            borderBottom: tab === t ? `2px solid ${COLORS.primary}` : '2px solid transparent', marginBottom: -1.5,
          }}>
            {t === 'info' && 'Informations'}
            {t === 'contenu' && `Documents (${assocDocs.length})`}
            {t === 'enfants' && `Sous-contenants (${children.length})`}
          </button>
        ))}
      </div>

      {tab === 'info' && (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 10 }}>
          <InfoBlk label="Code-barres" value={cont.codeBarres || '—'} mono />
          <InfoBlk label="Emplacement" value={emplPath(cont.emplacementId)} />
          <InfoBlk label="Contenant parent" value={parent ? `${parent.label} (${parent.id})` : 'Aucun (racine)'} />
          <InfoBlk label="Date de création" value={cont.dateCreation || '—'} />
          {cont.description && <div style={{ gridColumn: '1/-1' }}><InfoBlk label="Description" value={cont.description} /></div>}
        </div>
      )}

      {tab === 'contenu' && (
        <div style={{ maxHeight: 280, overflowY: 'auto' }}>
          {assocDocs.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: COLORS.textMut }}>
              <FileText size={28} strokeWidth={1.2} style={{ opacity: .3, marginBottom: 6 }} />
              <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textSec }}>Aucun document associé</div>
            </div>
          ) : assocDocs.map(d => (
            <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderBottom: `1px solid ${COLORS.borderLight}` }}>
              <FileText size={14} color={COLORS.primaryLight} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.titre}</div>
                <div style={{ fontSize: 10, color: COLORS.textMut, fontFamily: 'monospace' }}>{d.id}</div>
              </div>
              <Badge label={getStatutUI(d.statut)?.label || d.statut} color={getStatutUI(d.statut)?.color || COLORS.textMut} bg={getStatutUI(d.statut)?.bg || COLORS.borderLight} />
            </div>
          ))}
        </div>
      )}

      {tab === 'enfants' && (
        <div style={{ maxHeight: 280, overflowY: 'auto' }}>
          {children.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: COLORS.textMut }}>
              <Package size={28} strokeWidth={1.2} style={{ opacity: .3, marginBottom: 6 }} />
              <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textSec }}>Aucun sous-contenant</div>
            </div>
          ) : children.map(ch => {
            const chTp = getType(ch.type);
            const chSt = getStatut(ch.statut);
            const chPct = fillPct(ch);
            return (
              <div key={ch.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderBottom: `1px solid ${COLORS.borderLight}` }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: chTp.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <chTp.icon size={12} color={chTp.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{ch.label}</div>
                  <div style={{ fontSize: 10, color: COLORS.textMut }}>{ch.id}</div>
                </div>
                <div style={{ width: 40 }}><ProgressBar percent={chPct} height={4} /></div>
                <span style={{ fontSize: 10, fontWeight: 600, color: fillColor(chPct) }}>{chPct}%</span>
                <Badge label={chSt.label} color={chSt.color} bg={chSt.bg} />
              </div>
            );
          })}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', borderTop: `1px solid ${COLORS.border}`, paddingTop: 14, marginTop: 14, flexWrap: 'wrap' }}>
        <Btn variant="outline" size="sm" icon={QrCode} onClick={onQR}>QR</Btn>
        <Btn variant="outline" size="sm" icon={Link2} onClick={onAssoc}>Associer</Btn>
        <Btn variant="outline" size="sm" icon={Move} onClick={onMove}>Déplacer</Btn>
        <Btn variant="outline" size="sm" icon={History} onClick={onHistory}>Historique</Btn>
        <Btn variant="outline" size="sm" icon={Edit3} onClick={onEdit}>Modifier</Btn>
        {(cont.statut === 'ouvert' || cont.statut === 'ferme') && (
          <Btn size="sm" icon={Shield} onClick={onSeal}>Sceller</Btn>
        )}
      </div>
    </div>
  );
}

/* ── QR / Code-barres ── */
function ContQRPanel({ cont, isMobile }) {
  const [codeType, setCodeType] = useState('qr');
  const code = cont.codeBarres || cont.id;

  const QR = ({ size = 140 }) => {
    const cells = 21, cs = size / cells;
    const h = (s => { let v = 0; for (let i = 0; i < s.length; i++) v = ((v << 5) - v + s.charCodeAt(i)) | 0; return Math.abs(v); })(code);
    const rects = [];
    for (let r = 0; r < cells; r++) for (let c = 0; c < cells; c++) {
      const inF = (r < 7 && c < 7) || (r < 7 && c >= cells - 7) || (r >= cells - 7 && c < 7);
      const fB = inF && (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4));
      const isD = !inF && ((h * (r * cells + c + 1)) % 3 !== 0);
      if (fB || isD) rects.push(<rect key={`${r}-${c}`} x={c * cs} y={r * cs} width={cs} height={cs} fill={COLORS.primary} rx={cs * .15} />);
    }
    return <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ background: '#fff', borderRadius: 6 }}>{rects}</svg>;
  };

  const BC = ({ w = 220, h = 60 }) => {
    const hv = (s => { let v = 0; for (let i = 0; i < s.length; i++) v = ((v << 5) - v + s.charCodeAt(i)) | 0; return Math.abs(v); })(code);
    const bars = [];
    for (let i = 0; i < 55; i++) { if ((hv * (i + 1)) % 3 !== 0) bars.push(<rect key={i} x={i * (w / 55)} y={0} width={(hv * (i + 1)) % 5 === 0 ? w / 55 * 1.4 : w / 55 * .7} height={h} fill={COLORS.text} />); }
    return <div style={{ textAlign: 'center' }}><svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>{bars}</svg><div style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600, letterSpacing: 2, marginTop: 4 }}>{code}</div></div>;
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 14, background: COLORS.surfaceAlt, borderRadius: 8, padding: 3 }}>
        {[{ id: 'qr', label: 'QR Code' }, { id: 'barcode', label: 'Code-barres' }].map(t => (
          <button key={t.id} onClick={() => setCodeType(t.id)} style={{ flex: 1, padding: '7px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', background: codeType === t.id ? '#fff' : 'transparent', boxShadow: codeType === t.id ? '0 1px 3px rgba(0,0,0,.1)' : 'none', fontWeight: codeType === t.id ? 700 : 500, fontSize: 12, fontFamily: FF, color: codeType === t.id ? COLORS.primary : COLORS.textMut }}>{t.label}</button>
        ))}
      </div>
      <div style={{ padding: 20, border: `2px dashed ${COLORS.border}`, borderRadius: 12, textAlign: 'center', marginBottom: 14 }}>
        {codeType === 'qr' ? <QR /> : <BC />}
        <div style={{ fontSize: 12, fontWeight: 600, marginTop: 8 }}>{cont.label}</div>
        <div style={{ fontSize: 11, color: COLORS.textMut }}>{getType(cont.type).label} • {cont.id}</div>
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Btn variant="outline" size="sm" icon={Download}>Télécharger</Btn>
        <Btn size="sm" icon={Printer}>Imprimer étiquette</Btn>
      </div>
    </div>
  );
}

/* ── Associer documents ── */
function ContAssocPanel({ cont, docs, isMobile, onSave }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(docs.filter(d => d.contenantId === cont.id).map(d => d.id));
  const toggle = id => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const available = useMemo(() => {
    let r = docs.filter(d => !d.contenantId || d.contenantId === cont.id);
    if (search) { const s = search.toLowerCase(); r = r.filter(d => d.titre?.toLowerCase().includes(s) || d.id?.toLowerCase().includes(s)); }
    return r;
  }, [docs, cont, search]);

  const remaining = cont.capacite - cont.contenu + docs.filter(d => d.contenantId === cont.id).length;

  return (
    <div>
      <div style={{ padding: 10, background: COLORS.infoBg, borderRadius: 8, marginBottom: 12, fontSize: 12, color: COLORS.info, display: 'flex', alignItems: 'center', gap: 6 }}>
        <Info size={14} />Capacité : {selected.length}/{cont.capacite} (max {remaining} sélectionnables)
      </div>
      <div style={{ position: 'relative', marginBottom: 10 }}>
        <Search size={14} color={COLORS.textMut} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un document..." style={{ ...inp, paddingLeft: 32, fontSize: 12 }} />
      </div>
      <div style={{ maxHeight: 300, overflowY: 'auto', border: `1px solid ${COLORS.borderLight}`, borderRadius: 8, marginBottom: 14 }}>
        {available.map(d => {
          const isSel = selected.includes(d.id);
          return (
            <div key={d.id} onClick={() => { if (!isSel && selected.length >= remaining) return; toggle(d.id); }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderBottom: `1px solid ${COLORS.borderLight}`, cursor: !isSel && selected.length >= remaining ? 'not-allowed' : 'pointer', opacity: !isSel && selected.length >= remaining ? .4 : 1, background: isSel ? COLORS.primaryLighter + '40' : 'transparent' }}>
              <input type="checkbox" checked={isSel} readOnly style={{ accentColor: COLORS.primary }} />
              <FileText size={13} color={COLORS.primaryLight} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.titre}</div>
                <div style={{ fontSize: 10, color: COLORS.textMut, fontFamily: 'monospace' }}>{d.id}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Btn variant="outline" size="sm" onClick={() => onSave(null)}>Annuler</Btn>
        <Btn size="sm" icon={Check} onClick={() => onSave(selected)}>Associer {selected.length} document{selected.length > 1 ? 's' : ''}</Btn>
      </div>
    </div>
  );
}

/* ── Déplacer contenant ── */
function ContMovePanel({ cont, empls, isMobile, emplName, onSave }) {
  const [dest, setDest] = useState('');
  const [motif, setMotif] = useState('');

  return (
    <div>
      <div style={{ padding: 12, background: COLORS.surfaceAlt, borderRadius: 8, marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 600 }}>{cont.label} <span style={{ color: COLORS.textMut }}>({cont.id})</span></div>
        <div style={{ fontSize: 11, color: COLORS.textMut }}>Emplacement actuel : {emplName(cont.emplacementId)}</div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={lbl}>Nouvel emplacement *</label>
        <select value={dest} onChange={e => setDest(e.target.value)} style={inp}>
          <option value="">— Choisir —</option>
          {empls.map(e => <option key={e.id} value={e.id}>{e.batiment || e.site || ''} › {e.etage || e.salle || ''} — {e.label || e.nom || e.id}</option>)}
        </select>
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={lbl}>Motif</label>
        <textarea value={motif} onChange={e => setMotif(e.target.value)} rows={2} placeholder="Raison du déplacement..." style={{ ...inp, resize: 'vertical' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: `1px solid ${COLORS.border}`, paddingTop: 14 }}>
        <Btn variant="outline" size="sm" onClick={() => onSave(null)}>Annuler</Btn>
        <Btn size="sm" icon={Move} disabled={!dest} onClick={() => onSave({ dest, motif })}>Déplacer</Btn>
      </div>
    </div>
  );
}

/* ── Sceller / Fermer ── */
function ContSealPanel({ cont, isMobile, onConfirm }) {
  const [action, setAction] = useState(cont.statut === 'ouvert' ? 'ferme' : 'scelle');
  const [motif, setMotif] = useState('');

  const actions = [
    ...(cont.statut === 'ouvert' ? [{ id: 'ferme', label: 'Fermer le contenant', desc: 'Aucune modification possible sans réouverture', icon: Lock, color: COLORS.warning, bg: COLORS.warningBg }] : []),
    ...(cont.statut !== 'scelle' ? [{ id: 'scelle', label: 'Sceller définitivement', desc: 'Le contenant ne pourra plus être ouvert ni modifié', icon: Shield, color: COLORS.danger, bg: COLORS.dangerBg }] : []),
  ];

  return (
    <div>
      {/* Current status */}
      <div style={{ padding: 10, background: COLORS.surfaceAlt, borderRadius: 8, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 16 }}>{getType(cont.type).emoji}</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{cont.label}</div>
          <div style={{ fontSize: 11, color: COLORS.textMut }}>Statut actuel : <Badge label={getStatut(cont.statut).label} color={getStatut(cont.statut).color} bg={getStatut(cont.statut).bg} /></div>
        </div>
      </div>

      {/* Action choice */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
        {actions.map(a => (
          <button key={a.id} onClick={() => setAction(a.id)} style={{
            padding: 12, borderRadius: 8, border: `2px solid ${action === a.id ? a.color : COLORS.border}`,
            background: action === a.id ? a.bg : '#fff', cursor: 'pointer', textAlign: 'left',
            display: 'flex', alignItems: 'center', gap: 10, fontFamily: FF,
          }}>
            <a.icon size={20} color={a.color} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: action === a.id ? a.color : COLORS.textSec }}>{a.label}</div>
              <div style={{ fontSize: 11, color: COLORS.textMut }}>{a.desc}</div>
            </div>
          </button>
        ))}
      </div>

      {action === 'scelle' && (
        <div style={{ padding: 10, background: COLORS.dangerBg, borderRadius: 8, marginBottom: 14, fontSize: 12, color: COLORS.danger, display: 'flex', alignItems: 'center', gap: 6 }}>
          <AlertTriangle size={14} />Action irréversible — Le contenant et son contenu seront verrouillés
        </div>
      )}

      <div style={{ marginBottom: 14 }}>
        <label style={lbl}>Motif *</label>
        <textarea value={motif} onChange={e => setMotif(e.target.value)} rows={2} placeholder="Raison de la fermeture / scellement..." style={{ ...inp, resize: 'vertical' }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: `1px solid ${COLORS.border}`, paddingTop: 14 }}>
        <Btn variant="outline" size="sm" onClick={() => onConfirm(null)}>Annuler</Btn>
        <Btn variant={action === 'scelle' ? 'danger' : 'primary'} size="sm" icon={action === 'scelle' ? Shield : Lock}
          disabled={!motif.trim()} onClick={() => onConfirm({ action, motif })}>
          {action === 'scelle' ? 'Sceller' : 'Fermer'}
        </Btn>
      </div>
    </div>
  );
}

/* ── Historique contenant ── */
function ContHistoryPanel({ cont, isMobile }) {
  const trail = SHARED_CONT_HISTORY[cont.id] || generateContHistory(cont);
  const types = { creation: { l: 'Création', c: COLORS.success, bg: COLORS.successBg, icon: Plus }, deplacement: { l: 'Déplacement', c: COLORS.info, bg: COLORS.infoBg, icon: Move }, association: { l: 'Association', c: COLORS.purple, bg: COLORS.purpleBg, icon: Link2 }, fermeture: { l: 'Fermeture', c: COLORS.warning, bg: COLORS.warningBg, icon: Lock }, scellage: { l: 'Scellage', c: COLORS.danger, bg: COLORS.dangerBg, icon: Shield }, ouverture: { l: 'Réouverture', c: COLORS.accent, bg: COLORS.accentLight, icon: Unlock } };

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: 12, background: COLORS.surfaceAlt, borderRadius: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 22 }}>{getType(cont.type).emoji}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{cont.label}</div>
          <div style={{ fontSize: 11, color: COLORS.textMut, fontFamily: 'monospace' }}>{cont.id}</div>
        </div>
        <Badge label={`${trail.length} événements`} color={COLORS.info} bg={COLORS.infoBg} />
      </div>
      <div style={{ maxHeight: isMobile ? 350 : 420, overflowY: 'auto' }}>
        {trail.map((e, i) => {
          const tu = types[e.type] || types.creation;
          const Icon = tu.icon;
          return (
            <div key={i} style={{ display: 'flex', gap: isMobile ? 10 : 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 28, flexShrink: 0 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: tu.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, border: i === 0 ? `2px solid ${tu.c}` : 'none' }}><Icon size={13} color={tu.c} /></div>
                {i < trail.length - 1 && <div style={{ width: 2, flex: 1, background: COLORS.borderLight, minHeight: 6 }} />}
              </div>
              <div style={{ flex: 1, paddingBottom: 10 }}>
                <div style={{ padding: isMobile ? 8 : 10, borderRadius: 8, background: i === 0 ? tu.bg : '#fff', border: `1px solid ${i === 0 ? tu.c + '30' : COLORS.borderLight}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3, flexWrap: 'wrap', gap: 4 }}>
                    <Badge label={tu.l} color={tu.c} bg={i === 0 ? '#fff' : tu.bg} />
                    <span style={{ fontSize: 10, color: COLORS.textMut }}>{e.date} {e.heure}</span>
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.textSec }}>{e.description}</div>
                  <div style={{ fontSize: 10, color: COLORS.textMut, marginTop: 3 }}>Par <strong>{e.auteur}</strong></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════ */
function MiniBtn({ icon: Icon, label, onClick }) {
  return (
    <button onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 6, border: `1px solid ${COLORS.borderLight}`, background: '#fff', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: COLORS.textSec, fontFamily: FF }}
      onMouseEnter={e => e.currentTarget.style.background = COLORS.surfaceAlt}
      onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
      <Icon size={12} />{label}
    </button>
  );
}

function InfoBlk({ label, value, mono }) {
  return (
    <div style={{ padding: 10, background: COLORS.surfaceAlt, borderRadius: 8 }}>
      <div style={{ fontSize: 10, color: COLORS.textMut, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 600, ...(mono ? { fontFamily: 'monospace' } : {}) }}>{value || '—'}</div>
    </div>
  );
}

function generateContHistory(cont) {
  return [
    { date: '2025-02-28', heure: '10:00', type: 'association', description: '3 documents ajoutés', auteur: 'M. Rakoto' },
    { date: '2025-02-20', heure: '14:30', type: 'deplacement', description: 'Déplacé vers nouvel emplacement', auteur: 'Admin Razafin.' },
    { date: '2025-02-05', heure: '09:00', type: 'creation', description: `Création du contenant ${cont.label}`, auteur: 'S. Nirina' },
  ];
}

