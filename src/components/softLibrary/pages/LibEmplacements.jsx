/* ═══════════════════════════════════════════════════════════════
   SOFT LIBRARY — Emplacements physiques (Gestion complète)
   
   Fonctionnalités :
   ✓ Plan de classement hiérarchique configurable
     site → bâtiment → étage → salle → rayonnage → niveau → position
   ✓ Multi-sites
   ✓ Visualisation arborescente interactive
   ✓ Plan graphique visuel (vue grille capacitaire)
   ✓ Suivi capacité en temps réel + taux d'occupation par zone
   ✓ Affectation automatique d'emplacement disponible
   ✓ Historique complet des mouvements physiques
   ✓ Inventaire par scan de zone
   ✓ CRUD emplacements (création nœuds à tous niveaux)
   ✓ Responsive mobile / tablet / desktop
═══════════════════════════════════════════════════════════════ */
import React, { useState, useMemo, useCallback } from 'react';
import {
  Building2, Layers, Archive, Package, Shield, FolderOpen,
  ChevronDown, ChevronRight, ChevronLeft, Plus, ScanLine,
  Edit3, Trash2, Save, X, Check, Search, Eye, MapPin,
  ArrowUpDown, AlertTriangle, Clock, Move, History,
  BarChart3, Grid3X3, List, Box, Maximize2, Minimize2,
  Target, Zap, RotateCcw, Download, Filter, RefreshCw,
  Map, LayoutGrid, Hash, Navigation, Warehouse, DoorOpen,
  Rows3, Grip, ChevronsUpDown, CheckCircle2, XCircle, Info,
  FileText, Boxes, Lock, Unlock,
} from 'lucide-react';
import { COLORS, FONT_FAMILY } from '../theme';
import { Badge, Btn, Modal, StatCard, ProgressBar } from '../components/ui';

/* ═══════════════════════════════════════════════════
   CONSTANTES
═══════════════════════════════════════════════════ */
const FF = FONT_FAMILY;
const inputStyle = {
  width: '100%', padding: '9px 12px', borderRadius: 8,
  border: `1.5px solid ${COLORS.border}`, fontSize: 13,
  background: '#fff', outline: 'none', boxSizing: 'border-box',
  fontFamily: FF, transition: 'border-color .15s',
};
const labelStyle = { fontSize: 11, color: COLORS.textMut, marginBottom: 4, display: 'block', fontWeight: 600 };
const cardStyle = { background: '#fff', borderRadius: 12, border: `1px solid ${COLORS.border}`, overflow: 'hidden' };

/* Niveaux hiérarchiques configurables */
const HIERARCHY_LEVELS = [
  { id: 'site',       label: 'Site',       icon: Building2,  color: COLORS.primary },
  { id: 'batiment',   label: 'Bâtiment',   icon: Warehouse,  color: COLORS.info },
  { id: 'etage',      label: 'Étage',      icon: Layers,     color: COLORS.purple },
  { id: 'salle',      label: 'Salle',      icon: DoorOpen,   color: COLORS.warning },
  { id: 'rayonnage',  label: 'Rayonnage',  icon: Rows3,      color: COLORS.accent },
  { id: 'niveau',     label: 'Niveau',     icon: ChevronsUpDown, color: COLORS.success },
  { id: 'position',   label: 'Position',   icon: Target,     color: COLORS.indigo },
  { id: 'contenant',  label: 'Contenant',  icon: Package,    color: '#b45309' },
  { id: 'document',   label: 'Document',   icon: FileText,   color: COLORS.textMut },
];

function getOccColor(pct) {
  if (pct >= 90) return COLORS.danger;
  if (pct >= 75) return COLORS.warning;
  if (pct >= 50) return COLORS.info;
  return COLORS.success;
}

function getOccBg(pct) {
  if (pct >= 90) return COLORS.dangerBg;
  if (pct >= 75) return COLORS.warningBg;
  if (pct >= 50) return COLORS.infoBg;
  return COLORS.successBg;
}

/* ═══════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
═══════════════════════════════════════════════════ */
export default function LibEmplacements({ emplacements = [], contenants = [], documents = [], onAdd }) {
  const data = emplacements;
  const conts = contenants;
  const docs = documents;

  const [view, setView]             = useState('tree');       // tree | plan | capacity | movements | inventory
  const [expanded, setExpanded]     = useState({});
  const [search, setSearch]         = useState('');
  const [siteF, setSiteF]          = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [createLevel, setCreateLevel] = useState(null);       // { parentPath, level }
  const [selNode, setSelNode]       = useState(null);
  const [showDetail, setShowDetail] = useState(null);
  const [showAutoAssign, setShowAutoAssign] = useState(false);
  const [showMovements, setShowMovements]   = useState(null);
  const [showScanInv, setShowScanInv]       = useState(false);
  const [isMobile, setIsMobile]     = useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ── Arborescence complète multi-niveaux ── */
  const tree = useMemo(() => buildTree(data, conts, docs), [data, conts, docs]);

  /* ── Stats globales ── */
  const stats = useMemo(() => {
    const sites = new Set(data.map(e => e.site));
    const batiments = new Set(data.map(e => `${e.site}|${e.batiment}`));
    const totalCap = data.reduce((s, e) => s + (e.capacite || 0), 0);
    const totalOcc = data.reduce((s, e) => s + (e.occupe || 0), 0);
    const occPct = totalCap > 0 ? Math.round((totalOcc / totalCap) * 100) : 0;
    const alertes = data.filter(e => e.capacite > 0 && (e.occupe / e.capacite) > 0.85).length;
    return { sites: sites.size, batiments: batiments.size, salles: data.length, totalCap, totalOcc, occPct, alertes };
  }, [data]);

  /* ── Sites uniques pour filtre ── */
  const sitesList = useMemo(() => [...new Set(data.map(e => e.site))], [data]);

  /* ── Filtrage arborescence ── */
  const filteredTree = useMemo(() => {
    if (!search && siteF === 'all') return tree;
    return tree.filter(site => {
      if (siteF !== 'all' && site.label !== siteF) return false;
      if (search) {
        const s = search.toLowerCase();
        return site.label.toLowerCase().includes(s) ||
          JSON.stringify(site).toLowerCase().includes(s);
      }
      return true;
    });
  }, [tree, search, siteF]);

  const toggle = (id) => setExpanded(p => ({ ...p, [id]: !p[id] }));
  const expandAll = () => {
    const all = {};
    const walk = (nodes) => nodes.forEach(n => { all[n.id] = true; if (n.children) walk(n.children); });
    walk(tree);
    setExpanded(all);
  };
  const collapseAll = () => setExpanded({});

  /* ── Views ── */
  const VIEWS = [
    { id: 'tree',      label: 'Arborescence', icon: List },
    { id: 'plan',      label: 'Plan graphique', icon: LayoutGrid },
    { id: 'capacity',  label: 'Capacité', icon: BarChart3 },
    { id: 'movements', label: 'Mouvements', icon: History },
    { id: 'inventory', label: 'Inventaire', icon: ScanLine },
  ];

  return (
    <div>
      {/* ── HEADER ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: isMobile ? 20 : 24, fontWeight: 700 }}>Emplacements physiques</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: COLORS.textMut }}>
            {stats.sites} site{stats.sites > 1 ? 's' : ''} • {stats.salles} zones • {stats.occPct}% occupé
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {!isMobile && <Btn icon={ScanLine} variant="outline" size="sm" onClick={() => setShowScanInv(true)}>Inventaire</Btn>}
          <Btn icon={Zap} variant="outline" size="sm" onClick={() => setShowAutoAssign(true)}>
            {isMobile ? 'Auto' : 'Affectation auto'}
          </Btn>
          <Btn icon={Plus} size="sm" onClick={() => { setCreateLevel({ parentPath: null, level: 0 }); setShowCreate(true); }}>
            {isMobile ? 'Ajouter' : 'Ajouter un emplacement'}
          </Btn>
        </div>
      </div>

      {/* ── KPI CARDS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fit,minmax(170px,1fr))', gap: isMobile ? 10 : 14, marginBottom: 20 }}>
        <KpiCard icon={Building2} label="Sites" value={stats.sites} color={COLORS.primary} bg={COLORS.primaryLighter} />
        <KpiCard icon={Warehouse} label="Bâtiments" value={stats.batiments} color={COLORS.info} bg={COLORS.infoBg} />
        <KpiCard icon={Layers} label="Zones" value={stats.salles} color={COLORS.success} bg={COLORS.successBg} />
        <KpiCard icon={Package} label="Capacité" value={stats.totalCap.toLocaleString('fr-FR')} color={COLORS.accent} bg={COLORS.accentLight} />
        <KpiCard icon={Archive} label="Occupé" value={`${stats.occPct}%`} color={getOccColor(stats.occPct)} bg={getOccBg(stats.occPct)} />
        {!isMobile && <KpiCard icon={AlertTriangle} label="Alertes" value={stats.alertes} color={stats.alertes > 0 ? COLORS.danger : COLORS.success} bg={stats.alertes > 0 ? COLORS.dangerBg : COLORS.successBg} />}
      </div>

      {/* ── VIEW TABS + FILTERS ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 2, overflowX: 'auto', paddingBottom: 2 }}>
          {VIEWS.map(v => (
            <button key={v.id} onClick={() => setView(v.id)}
              style={{
                padding: isMobile ? '7px 10px' : '8px 14px', borderRadius: 8,
                background: view === v.id ? COLORS.primary : 'transparent',
                color: view === v.id ? '#fff' : COLORS.textSec,
                border: view === v.id ? 'none' : `1px solid ${COLORS.borderLight}`,
                cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: FF,
                display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
              }}>
              <v.icon size={14} />{isMobile ? '' : v.label}
            </button>
          ))}
        </div>

        {/* Search + Site filter */}
        {(view === 'tree' || view === 'plan' || view === 'capacity') && (
          <div style={{ display: 'flex', gap: 8, flex: 1, justifyContent: 'flex-end', minWidth: 0, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', minWidth: isMobile ? '100%' : 200, maxWidth: 280 }}>
              <Search size={14} color={COLORS.textMut} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher..." style={{ ...inputStyle, paddingLeft: 32, fontSize: 12, padding: '7px 10px 7px 32px' }} />
            </div>
            {sitesList.length > 1 && (
              <select value={siteF} onChange={e => setSiteF(e.target.value)}
                style={{ ...inputStyle, width: 'auto', fontSize: 12, padding: '7px 10px' }}>
                <option value="all">Tous les sites</option>
                {sitesList.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            )}
          </div>
        )}
      </div>

      {/* ── VIEW CONTENT ── */}
      {view === 'tree' && (
        <TreeView
          tree={filteredTree}
          expanded={expanded}
          toggle={toggle}
          expandAll={expandAll}
          collapseAll={collapseAll}
          isMobile={isMobile}
          onSelect={setShowDetail}
          onCreate={(parentPath, level) => { setCreateLevel({ parentPath, level }); setShowCreate(true); }}
          onMovements={setShowMovements}
        />
      )}

      {view === 'plan' && (
        <GraphicalPlan
          data={data}
          tree={filteredTree}
          isMobile={isMobile}
          onSelect={setShowDetail}
        />
      )}

      {view === 'capacity' && (
        <CapacityView
          data={data}
          tree={filteredTree}
          isMobile={isMobile}
        />
      )}

      {view === 'movements' && (
        <MovementsView isMobile={isMobile} />
      )}

      {view === 'inventory' && (
        <InventoryView data={data} isMobile={isMobile} />
      )}

      {/* ── MODALS ── */}

      {/* Création emplacement */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)}
        title="Ajouter un emplacement" width={isMobile ? '95vw' : 560}>
        <CreateEmplacementForm
          level={createLevel}
          hierarchy={HIERARCHY_LEVELS}
          existingData={data}
          isMobile={isMobile}
          onSave={(d) => { console.log('Create:', d); setShowCreate(false); }}
          onCancel={() => setShowCreate(false)}
        />
      </Modal>

      {/* Détail emplacement */}
      <Modal isOpen={!!showDetail} onClose={() => setShowDetail(null)}
        title="Détail de l'emplacement" width={isMobile ? '95vw' : 620}>
        {showDetail && <EmplacementDetail node={showDetail} data={data} isMobile={isMobile}
          onMovements={() => { setShowDetail(null); setShowMovements(showDetail); }}
        />}
      </Modal>

      {/* Affectation automatique */}
      <Modal isOpen={showAutoAssign} onClose={() => setShowAutoAssign(false)}
        title="Affectation automatique" width={isMobile ? '95vw' : 520}>
        <AutoAssignPanel data={data} isMobile={isMobile}
          onClose={() => setShowAutoAssign(false)} />
      </Modal>

      {/* Mouvements d'un noeud */}
      <Modal isOpen={!!showMovements} onClose={() => setShowMovements(null)}
        title="Historique des mouvements" width={isMobile ? '95vw' : 640}>
        {showMovements && <NodeMovements node={showMovements} isMobile={isMobile} />}
      </Modal>

      {/* Inventaire scan */}
      <Modal isOpen={showScanInv} onClose={() => setShowScanInv(false)}
        title="Inventaire par scan de zone" width={isMobile ? '95vw' : 580}>
        <ScanInventoryPanel data={data} isMobile={isMobile}
          onClose={() => setShowScanInv(false)} />
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   1. ARBORESCENCE INTERACTIVE (TreeView)
═══════════════════════════════════════════════════════════════ */
function TreeView({ tree, expanded, toggle, expandAll, collapseAll, isMobile, onSelect, onCreate, onMovements }) {
  const renderNode = (node, depth = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expanded[node.id];
    const pct = node.percent || 0;
    const lvl = HIERARCHY_LEVELS.find(h => h.id === node.level) || HIERARCHY_LEVELS[0];
    const Icon = lvl.icon;
    const isDoc = node.level === 'document';
    const isCont = node.level === 'contenant';

    return (
      <div key={node.id}>
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 8,
            padding: isMobile ? (isDoc ? '5px 10px' : '9px 10px') : (isDoc ? '6px 14px' : '10px 14px'),
            paddingLeft: isMobile ? (10 + depth * 16) : (14 + depth * 24),
            borderBottom: `1px solid ${COLORS.borderLight}`,
            cursor: 'pointer', transition: 'background .1s',
            background: isDoc ? '#fefefe' : 'transparent',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
          onMouseLeave={e => e.currentTarget.style.background = isDoc ? '#fefefe' : 'transparent'}
          onClick={() => hasChildren ? toggle(node.id) : onSelect?.(node)}
        >
          {/* Expand arrow */}
          {hasChildren ? (
            <div style={{ width: 16, flexShrink: 0 }}>
              {isExpanded ? <ChevronDown size={14} color={COLORS.textMut} /> : <ChevronRight size={14} color={COLORS.textMut} />}
            </div>
          ) : <div style={{ width: 16, flexShrink: 0 }} />}

          {/* Icon */}
          <div style={{ width: isMobile ? (isDoc ? 22 : 28) : (isDoc ? 24 : 32), height: isMobile ? (isDoc ? 22 : 28) : (isDoc ? 24 : 32), borderRadius: isDoc ? 5 : 8, background: lvl.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={isMobile ? (isDoc ? 11 : 14) : (isDoc ? 12 : 16)} color={lvl.color} />
          </div>

          {/* Label */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: isDoc ? 500 : 600, fontSize: isDoc ? 11 : (isMobile ? 12 : 13), color: isDoc ? COLORS.textSec : COLORS.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {node.label}
            </div>
            {!isMobile && node.code && (
              <div style={{ fontSize: 10, color: COLORS.textMut, fontFamily: 'monospace' }}>{node.code}</div>
            )}
          </div>

          {/* Contenant: statut badge */}
          {isCont && node.contenant && (
            <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 4, fontWeight: 600, background: node.contenant.statut === 'scelle' ? '#fef2f2' : node.contenant.statut === 'ferme' ? '#fffbeb' : '#f0fdf4', color: node.contenant.statut === 'scelle' ? '#dc2626' : node.contenant.statut === 'ferme' ? '#d97706' : '#16a34a', flexShrink: 0 }}>
              {node.contenant.statut === 'scelle' ? '🔒 Scellé' : node.contenant.statut === 'ferme' ? '🔐 Fermé' : node.contenant.statut === 'transit' ? '🚚 Transit' : ''}
            </span>
          )}

          {/* Capacity bar (not for documents) */}
          {!isDoc && node.capacite > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 4 : 8, flexShrink: 0 }}>
              {!isMobile && (
                <span style={{ fontSize: 11, color: COLORS.textMut, whiteSpace: 'nowrap' }}>
                  {node.occupe || 0}/{node.capacite}
                </span>
              )}
              <div style={{ width: isMobile ? 50 : 80 }}>
                <ProgressBar percent={pct} height={6} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: getOccColor(pct), width: 32, textAlign: 'right' }}>
                {pct}%
              </span>
            </div>
          )}

          {/* Actions (not for documents) */}
          {!isMobile && !isDoc && (
            <div style={{ display: 'flex', gap: 2, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
              <SmallBtn icon={Eye} title="Détail" onClick={() => onSelect?.(node)} />
              {!isCont && <SmallBtn icon={Plus} title="Ajouter enfant" onClick={() => onCreate?.(node.id, (HIERARCHY_LEVELS.findIndex(h => h.id === node.level) + 1))} />}
              {!isCont && <SmallBtn icon={History} title="Mouvements" onClick={() => onMovements?.(node)} />}
            </div>
          )}
        </div>

        {/* Children */}
        {hasChildren && isExpanded && node.children.map(child => renderNode(child, depth + 1))}
      </div>
    );
  };

  return (
    <div style={cardStyle}>
      {/* Toolbar */}
      <div style={{ padding: isMobile ? '10px 12px' : '12px 20px', borderBottom: `1px solid ${COLORS.border}`, background: COLORS.surfaceAlt, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Arborescence</span>
          <Badge label={`${HIERARCHY_LEVELS.length} niveaux`} color={COLORS.primary} bg={COLORS.primaryLighter} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <MiniBtn label={isMobile ? '▼' : 'Tout ouvrir'} onClick={expandAll} />
          <MiniBtn label={isMobile ? '▲' : 'Tout fermer'} onClick={collapseAll} />
          <Legend />
        </div>
      </div>

      {/* Hierarchy legend */}
      {!isMobile && (
        <div style={{ padding: '8px 20px', borderBottom: `1px solid ${COLORS.borderLight}`, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {HIERARCHY_LEVELS.map(h => (
            <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: COLORS.textMut }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: h.color }} />
              {h.label}
            </div>
          ))}
        </div>
      )}

      {/* Tree */}
      <div style={{ maxHeight: isMobile ? 'calc(100vh - 420px)' : 'calc(100vh - 380px)', overflowY: 'auto' }}>
        {tree.length > 0 ? tree.map(node => renderNode(node, 0)) : (
          <div style={{ padding: 48, textAlign: 'center', color: COLORS.textMut }}>
            <MapPin size={40} strokeWidth={1.2} style={{ opacity: .3, marginBottom: 8 }} />
            <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.textSec }}>Aucun emplacement trouvé</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2. PLAN GRAPHIQUE (Grille visuelle capacitaire)
═══════════════════════════════════════════════════════════════ */
function GraphicalPlan({ data, tree, isMobile, onSelect }) {
  const [selectedSite, setSelectedSite] = useState(tree[0]?.label || '');
  const siteData = tree.find(t => t.label === selectedSite);

  return (
    <div>
      {/* Site selector */}
      {tree.length > 1 && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 14, overflowX: 'auto' }}>
          {tree.map(s => (
            <button key={s.id} onClick={() => setSelectedSite(s.label)}
              style={{
                padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, fontFamily: FF,
                background: selectedSite === s.label ? COLORS.primary : '#fff',
                color: selectedSite === s.label ? '#fff' : COLORS.textSec,
                border: `1.5px solid ${selectedSite === s.label ? COLORS.primary : COLORS.border}`,
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}>
              <Building2 size={13} style={{ marginRight: 4, verticalAlign: -2 }} />{s.label}
            </button>
          ))}
        </div>
      )}

      {siteData ? (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill,minmax(320px,1fr))', gap: 14 }}>
          {(siteData.children || []).map(bat => (
            <div key={bat.id} style={cardStyle}>
              {/* Bâtiment header */}
              <div style={{ padding: '12px 16px', background: COLORS.infoBg, borderBottom: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Warehouse size={16} color={COLORS.info} />
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{bat.label}</span>
                </div>
                <Badge label={`${bat.percent || 0}%`} color={getOccColor(bat.percent || 0)} bg={getOccBg(bat.percent || 0)} />
              </div>

              {/* Rooms grid */}
              <div style={{ padding: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(110px,1fr))', gap: 8 }}>
                  {getAllLeaves(bat).map(room => {
                    const pct = room.percent || 0;
                    return (
                      <div key={room.id} onClick={() => onSelect?.(room)}
                        style={{
                          padding: 10, borderRadius: 8, cursor: 'pointer',
                          background: getOccBg(pct),
                          border: `2px solid ${getOccColor(pct)}30`,
                          transition: 'all .15s', textAlign: 'center',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,.08)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: getOccColor(pct), marginBottom: 4 }}>
                          {room.label}
                        </div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: getOccColor(pct) }}>{pct}%</div>
                        <div style={{ fontSize: 10, color: COLORS.textMut, marginTop: 2 }}>
                          {room.occupe || 0}/{room.capacite || 0}
                        </div>
                        <div style={{ marginTop: 6, height: 4, background: `${getOccColor(pct)}25`, borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: getOccColor(pct), borderRadius: 2 }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: 48, color: COLORS.textMut }}>
          <Map size={40} strokeWidth={1.2} style={{ opacity: .3, marginBottom: 8 }} />
          <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.textSec }}>Aucun site sélectionné</div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. VUE CAPACITÉ (Taux d'occupation par zone)
═══════════════════════════════════════════════════════════════ */
function CapacityView({ data, tree, isMobile }) {
  const [sortBy, setSortBy] = useState('pct_desc'); // pct_desc, pct_asc, name

  const allLeaves = useMemo(() => {
    const leaves = [];
    const walk = (nodes) => nodes.forEach(n => {
      if (!n.children || n.children.length === 0) leaves.push(n);
      else walk(n.children);
    });
    walk(tree);
    return leaves.sort((a, b) => {
      if (sortBy === 'pct_desc') return (b.percent || 0) - (a.percent || 0);
      if (sortBy === 'pct_asc') return (a.percent || 0) - (b.percent || 0);
      return a.label.localeCompare(b.label);
    });
  }, [tree, sortBy]);

  // Occupation ranges
  const ranges = useMemo(() => ({
    critical: allLeaves.filter(n => (n.percent || 0) >= 90),
    high: allLeaves.filter(n => (n.percent || 0) >= 75 && (n.percent || 0) < 90),
    moderate: allLeaves.filter(n => (n.percent || 0) >= 50 && (n.percent || 0) < 75),
    low: allLeaves.filter(n => (n.percent || 0) < 50),
  }), [allLeaves]);

  return (
    <div>
      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'Critique (≥90%)', value: ranges.critical.length, color: COLORS.danger, bg: COLORS.dangerBg },
          { label: 'Élevé (75-89%)', value: ranges.high.length, color: COLORS.warning, bg: COLORS.warningBg },
          { label: 'Modéré (50-74%)', value: ranges.moderate.length, color: COLORS.info, bg: COLORS.infoBg },
          { label: 'Faible (<50%)', value: ranges.low.length, color: COLORS.success, bg: COLORS.successBg },
        ].map((r, i) => (
          <div key={i} style={{ padding: 14, borderRadius: 10, background: r.bg, border: `1px solid ${r.color}20`, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: r.color }}>{r.value}</div>
            <div style={{ fontSize: 11, color: COLORS.textSec, fontWeight: 500 }}>{r.label}</div>
          </div>
        ))}
      </div>

      {/* Sort */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>{allLeaves.length} zones</span>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          style={{ ...inputStyle, width: 'auto', fontSize: 12, padding: '6px 10px' }}>
          <option value="pct_desc">Occupation ↓</option>
          <option value="pct_asc">Occupation ↑</option>
          <option value="name">Nom A-Z</option>
        </select>
      </div>

      {/* Bars */}
      <div style={cardStyle}>
        {allLeaves.map((node, i) => {
          const pct = node.percent || 0;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 14, padding: isMobile ? '8px 10px' : '10px 16px', borderBottom: `1px solid ${COLORS.borderLight}` }}>
              <div style={{ width: isMobile ? 100 : 160, fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 0 }}>
                {node.label}
              </div>
              <div style={{ flex: 1, height: 20, background: '#f1f5f9', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: getOccColor(pct), borderRadius: 6, transition: 'width .3s ease', minWidth: pct > 0 ? 4 : 0 }} />
                {pct > 15 && (
                  <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 10, fontWeight: 700, color: pct > 50 ? '#fff' : COLORS.textSec }}>
                    {node.occupe || 0}/{node.capacite || 0}
                  </span>
                )}
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: getOccColor(pct), width: 40, textAlign: 'right', flexShrink: 0 }}>
                {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. HISTORIQUE DES MOUVEMENTS
═══════════════════════════════════════════════════════════════ */
function MovementsView({ isMobile }) {
  const [typeF, setTypeF] = useState('all');
  const movements = DEMO_MOVEMENTS;

  const filtered = typeF === 'all' ? movements : movements.filter(m => m.type === typeF);
  const types = [...new Set(movements.map(m => m.type))];

  const typeUI = {
    entree: { color: COLORS.success, bg: COLORS.successBg, icon: Plus, label: 'Entrée' },
    sortie: { color: COLORS.danger, bg: COLORS.dangerBg, icon: ArrowUpDown, label: 'Sortie' },
    transfert: { color: COLORS.info, bg: COLORS.infoBg, icon: Move, label: 'Transfert' },
    inventaire: { color: COLORS.warning, bg: COLORS.warningBg, icon: ScanLine, label: 'Inventaire' },
    elimination: { color: COLORS.textSec, bg: COLORS.borderLight, icon: Trash2, label: 'Élimination' },
  };

  return (
    <div>
      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        {[{ id: 'all', label: 'Tous' }, ...types.map(t => ({ id: t, label: typeUI[t]?.label || t }))].map(f => (
          <button key={f.id} onClick={() => setTypeF(f.id)}
            style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, fontFamily: FF,
              background: typeF === f.id ? COLORS.primary : '#fff',
              color: typeF === f.id ? '#fff' : COLORS.textSec,
              border: `1.5px solid ${typeF === f.id ? COLORS.primary : COLORS.border}`,
              cursor: 'pointer',
            }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {filtered.map((m, i) => {
          const tu = typeUI[m.type] || typeUI.entree;
          const Icon = tu.icon;
          return (
            <div key={i} style={{ display: 'flex', gap: isMobile ? 10 : 14, position: 'relative' }}>
              {/* Timeline dot */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 32, flexShrink: 0 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: tu.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                  <Icon size={14} color={tu.color} />
                </div>
                {i < filtered.length - 1 && <div style={{ width: 2, flex: 1, background: COLORS.borderLight, minHeight: 10 }} />}
              </div>

              {/* Content */}
              <div style={{ flex: 1, paddingBottom: 14 }}>
                <div style={{ padding: isMobile ? 10 : 14, background: '#fff', borderRadius: 10, border: `1px solid ${COLORS.borderLight}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, flexWrap: 'wrap', gap: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{m.document}</span>
                    <Badge label={tu.label} color={tu.color} bg={tu.bg} />
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.textSec, marginBottom: 4 }}>{m.description}</div>
                  {m.de && m.vers && (
                    <div style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, color: COLORS.textMut, flexWrap: 'wrap' }}>
                      <MapPin size={11} /> {m.de} <ChevronRight size={11} /> {m.vers}
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: COLORS.textMut, marginTop: 4, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <span>{m.date} {m.heure}</span>
                    <span>Par {m.auteur}</span>
                  </div>
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
   5. VUE INVENTAIRE
═══════════════════════════════════════════════════════════════ */
function InventoryView({ data, isMobile }) {
  const [selectedZone, setSelectedZone] = useState('');

  return (
    <div>
      <div style={{ ...cardStyle, padding: isMobile ? 14 : 20, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <ScanLine size={20} color={COLORS.primary} />
          <span style={{ fontWeight: 700, fontSize: 15 }}>Inventaire par zone</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
          <div>
            <label style={labelStyle}>Zone à inventorier</label>
            <select value={selectedZone} onChange={e => setSelectedZone(e.target.value)} style={inputStyle}>
              <option value="">— Sélectionner une zone —</option>
              {data.map(e => <option key={e.id} value={e.id}>{e.site} › {e.batiment} › {e.nom}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Mode de scan</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <Btn variant="outline" size="sm" icon={ScanLine} style={{ flex: 1 }}>Code-barres</Btn>
              <Btn variant="outline" size="sm" icon={Grid3X3} style={{ flex: 1 }}>QR Code</Btn>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated inventory results */}
      {selectedZone && (
        <div style={cardStyle}>
          <div style={{ padding: '12px 16px', background: COLORS.surfaceAlt, borderBottom: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600, fontSize: 13 }}>Résultat de l'inventaire</span>
            <Badge label="En cours" color={COLORS.warning} bg={COLORS.warningBg} />
          </div>
          <div style={{ padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
              {[
                { label: 'Attendus', value: 45, color: COLORS.primary },
                { label: 'Trouvés', value: 42, color: COLORS.success },
                { label: 'Manquants', value: 2, color: COLORS.danger },
                { label: 'Excédents', value: 1, color: COLORS.warning },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'center', padding: 12, background: COLORS.surfaceAlt, borderRadius: 8 }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: COLORS.textMut }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Scan list */}
            <div style={{ fontSize: 12 }}>
              {[
                { ref: 'DOC-2025-0089', status: 'ok', time: '14:32:15' },
                { ref: 'DOC-2025-0091', status: 'ok', time: '14:32:28' },
                { ref: 'DOC-2025-0093', status: 'missing', time: '—' },
                { ref: 'DOC-2024-0456', status: 'extra', time: '14:33:01' },
                { ref: 'DOC-2025-0095', status: 'ok', time: '14:33:12' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: `1px solid ${COLORS.borderLight}` }}>
                  {item.status === 'ok' && <CheckCircle2 size={16} color={COLORS.success} />}
                  {item.status === 'missing' && <XCircle size={16} color={COLORS.danger} />}
                  {item.status === 'extra' && <AlertTriangle size={16} color={COLORS.warning} />}
                  <span style={{ fontFamily: 'monospace', fontWeight: 600, color: COLORS.primaryLight }}>{item.ref}</span>
                  <span style={{ flex: 1 }} />
                  <span style={{ color: COLORS.textMut }}>{item.time}</span>
                  <Badge
                    label={item.status === 'ok' ? 'OK' : item.status === 'missing' ? 'Manquant' : 'Excédent'}
                    color={item.status === 'ok' ? COLORS.success : item.status === 'missing' ? COLORS.danger : COLORS.warning}
                    bg={item.status === 'ok' ? COLORS.successBg : item.status === 'missing' ? COLORS.dangerBg : COLORS.warningBg}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MODAL PANELS
═══════════════════════════════════════════════════════════════ */

/* ── Création emplacement ── */
function CreateEmplacementForm({ level, hierarchy, existingData, isMobile, onSave, onCancel }) {
  const levelIdx = level?.level || 0;
  const currentLevel = hierarchy[Math.min(levelIdx, hierarchy.length - 1)];

  const [form, setForm] = useState({
    nom: '',
    code: '',
    site: '',
    batiment: '',
    etage: '',
    salle: '',
    capacite: '',
    description: '',
    typeRayonnage: 'standard',
  });
  const [errors, setErrors] = useState({});

  const update = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: undefined })); };

  const sites = [...new Set(existingData.map(e => e.site))];
  const batiments = form.site ? [...new Set(existingData.filter(e => e.site === form.site).map(e => e.batiment))] : [];

  const handleSubmit = () => {
    const e = {};
    if (!form.nom.trim()) e.nom = 'Nom requis';
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    onSave({ ...form, capacite: form.capacite ? parseInt(form.capacite) : 0 });
  };

  return (
    <div>
      {/* Level indicator */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, overflowX: 'auto' }}>
        {hierarchy.map((h, i) => (
          <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{
              padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600,
              background: i === levelIdx ? h.color + '20' : COLORS.borderLight,
              color: i === levelIdx ? h.color : COLORS.textMut,
              border: i === levelIdx ? `1.5px solid ${h.color}` : '1.5px solid transparent',
            }}>
              {h.label}
            </div>
            {i < hierarchy.length - 1 && <ChevronRight size={12} color={COLORS.textMut} />}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
        <div style={{ gridColumn: '1/-1' }}>
          <label style={labelStyle}>Nom de l'emplacement *</label>
          <input value={form.nom} onChange={e => update('nom', e.target.value)}
            placeholder={`Nom du ${currentLevel.label.toLowerCase()}...`}
            style={{ ...inputStyle, ...(errors.nom ? { borderColor: COLORS.danger } : {}) }} />
          {errors.nom && <span style={{ fontSize: 11, color: COLORS.danger }}>{errors.nom}</span>}
        </div>

        <div>
          <label style={labelStyle}>Code / Référence</label>
          <input value={form.code} onChange={e => update('code', e.target.value)}
            placeholder="Ex: SITE-A, BAT-01, S-003..." style={{ ...inputStyle, fontFamily: 'monospace' }} />
        </div>

        {levelIdx >= 1 && (
          <div>
            <label style={labelStyle}>Site parent</label>
            <select value={form.site} onChange={e => update('site', e.target.value)} style={inputStyle}>
              <option value="">— Choisir un site —</option>
              {sites.map(s => <option key={s} value={s}>{s}</option>)}
              <option value="__new__">+ Nouveau site</option>
            </select>
          </div>
        )}

        {levelIdx >= 2 && (
          <div>
            <label style={labelStyle}>Bâtiment parent</label>
            <select value={form.batiment} onChange={e => update('batiment', e.target.value)} style={inputStyle}>
              <option value="">— Choisir —</option>
              {batiments.map(b => <option key={b} value={b}>{b}</option>)}
              <option value="__new__">+ Nouveau bâtiment</option>
            </select>
          </div>
        )}

        <div>
          <label style={labelStyle}>Capacité (unités)</label>
          <input type="number" value={form.capacite} onChange={e => update('capacite', e.target.value)}
            placeholder="0" min="0" style={inputStyle} />
        </div>

        {levelIdx >= 4 && (
          <div>
            <label style={labelStyle}>Type de rayonnage</label>
            <select value={form.typeRayonnage} onChange={e => update('typeRayonnage', e.target.value)} style={inputStyle}>
              {['standard', 'compactus', 'mobile', 'climatise', 'securise', 'coffre'].map(t =>
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              )}
            </select>
          </div>
        )}

        <div style={{ gridColumn: '1/-1' }}>
          <label style={labelStyle}>Description</label>
          <textarea value={form.description} onChange={e => update('description', e.target.value)}
            rows={2} placeholder="Description optionnelle..." style={{ ...inputStyle, resize: 'vertical' }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16, paddingTop: 14, borderTop: `1px solid ${COLORS.border}` }}>
        <Btn variant="outline" size="sm" onClick={onCancel}>Annuler</Btn>
        <Btn size="sm" icon={Save} onClick={handleSubmit}>Créer l'emplacement</Btn>
      </div>
    </div>
  );
}

/* ── Détail emplacement ── */
function EmplacementDetail({ node, data, isMobile, onMovements }) {
  const pct = node.percent || 0;
  const lvl = HIERARCHY_LEVELS.find(h => h.id === node.level) || HIERARCHY_LEVELS[0];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 20, alignItems: 'flex-start' }}>
        <div style={{ width: 48, height: 48, borderRadius: 10, background: lvl.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <lvl.icon size={24} color={lvl.color} />
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{node.label}</div>
          <div style={{ fontSize: 12, color: COLORS.textMut }}>
            {lvl.label} {node.code && <span style={{ fontFamily: 'monospace', marginLeft: 4 }}>({node.code})</span>}
          </div>
        </div>
      </div>

      {/* Capacity gauge */}
      {node.capacite > 0 && (
        <div style={{ padding: 16, background: getOccBg(pct), borderRadius: 10, marginBottom: 16, border: `1px solid ${getOccColor(pct)}20` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Taux d'occupation</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: getOccColor(pct) }}>{pct}%</span>
          </div>
          <div style={{ height: 10, background: '#fff', borderRadius: 6, overflow: 'hidden', marginBottom: 6 }}>
            <div style={{ width: `${pct}%`, height: '100%', background: getOccColor(pct), borderRadius: 6, transition: 'width .5s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: COLORS.textSec }}>
            <span>{node.occupe || 0} occupé(s)</span>
            <span>{(node.capacite || 0) - (node.occupe || 0)} disponible(s)</span>
            <span>Total: {node.capacite}</span>
          </div>
        </div>
      )}

      {/* Grid info */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12, marginBottom: 16 }}>
        {node.path && (
          <div style={{ gridColumn: '1/-1' }}>
            <div style={{ fontSize: 11, color: COLORS.textMut, marginBottom: 3 }}>Chemin complet</div>
            <div style={{ fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
              <Navigation size={13} color={COLORS.primaryLight} />
              {node.path || `${node.label}`}
            </div>
          </div>
        )}
        {node.typeRayonnage && (
          <div>
            <div style={{ fontSize: 11, color: COLORS.textMut, marginBottom: 3 }}>Type</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{node.typeRayonnage}</div>
          </div>
        )}
        <div>
          <div style={{ fontSize: 11, color: COLORS.textMut, marginBottom: 3 }}>Enfants</div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{node.children?.length || 0} sous-emplacements</div>
        </div>
      </div>

      {/* Alert */}
      {pct >= 85 && (
        <div style={{ padding: 12, background: COLORS.warningBg, borderRadius: 8, border: '1px solid #fde68a', marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.warning, display: 'flex', alignItems: 'center', gap: 6 }}>
            <AlertTriangle size={14} />Capacité proche de la saturation
          </div>
          <div style={{ fontSize: 12, color: COLORS.textSec, marginTop: 4 }}>
            Envisagez un transfert ou un réaménagement des documents vers des emplacements moins occupés.
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', borderTop: `1px solid ${COLORS.border}`, paddingTop: 14, flexWrap: 'wrap' }}>
        <Btn variant="outline" size="sm" icon={Edit3}>Modifier</Btn>
        <Btn variant="outline" size="sm" icon={History} onClick={onMovements}>Mouvements</Btn>
        <Btn variant="outline" size="sm" icon={ScanLine}>Inventaire</Btn>
        <Btn size="sm" icon={Plus}>Ajouter sous-emplacement</Btn>
      </div>
    </div>
  );
}

/* ── Affectation automatique ── */
function AutoAssignPanel({ data, isMobile, onClose }) {
  const [nbDocs, setNbDocs] = useState(1);
  const [constraint, setConstraint] = useState('nearest');
  const [result, setResult] = useState(null);

  const findBest = () => {
    const available = data
      .filter(e => e.capacite > 0 && e.occupe < e.capacite)
      .map(e => ({ ...e, free: e.capacite - e.occupe, pct: Math.round((e.occupe / e.capacite) * 100) }))
      .sort((a, b) => {
        if (constraint === 'emptiest') return a.pct - b.pct;
        if (constraint === 'nearest') return b.free - a.free;
        return a.pct - b.pct;
      });

    if (available.length === 0) {
      setResult({ success: false });
    } else {
      setResult({ success: true, emplacement: available[0], alternatives: available.slice(1, 4) });
    }
  };

  return (
    <div>
      <div style={{ padding: 12, background: COLORS.infoBg, borderRadius: 8, border: '1px solid #bfdbfe', marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.info, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Zap size={14} />Le système propose automatiquement l'emplacement le plus adapté
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>Nombre de documents</label>
          <input type="number" value={nbDocs} onChange={e => setNbDocs(e.target.value)} min="1" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Stratégie d'affectation</label>
          <select value={constraint} onChange={e => setConstraint(e.target.value)} style={inputStyle}>
            <option value="nearest">Plus de place disponible</option>
            <option value="emptiest">Zone la moins occupée</option>
            <option value="balanced">Équilibrer les zones</option>
          </select>
        </div>
      </div>

      <Btn icon={Zap} size="sm" onClick={findBest} style={{ marginBottom: 16 }}>Trouver un emplacement</Btn>

      {result && (
        <div style={{ marginTop: 12 }}>
          {result.success ? (
            <>
              {/* Best match */}
              <div style={{ padding: 14, background: COLORS.successBg, borderRadius: 10, border: `1px solid ${COLORS.success}30`, marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.success, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 size={16} />Emplacement recommandé
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{result.emplacement.nom}</div>
                <div style={{ fontSize: 12, color: COLORS.textSec }}>
                  {result.emplacement.site} › {result.emplacement.batiment} › {result.emplacement.salle}
                </div>
                <div style={{ fontSize: 12, color: COLORS.textSec, marginTop: 4 }}>
                  {result.emplacement.free} place(s) disponible(s) — Occupation: {result.emplacement.pct}%
                </div>
              </div>

              {/* Alternatives */}
              {result.alternatives.length > 0 && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.textSec, marginBottom: 8 }}>Alternatives</div>
                  {result.alternatives.map((alt, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: COLORS.surfaceAlt, borderRadius: 8, marginBottom: 6, border: `1px solid ${COLORS.borderLight}` }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{alt.nom}</div>
                        <div style={{ fontSize: 11, color: COLORS.textMut }}>{alt.site} › {alt.batiment}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: getOccColor(alt.pct) }}>{alt.pct}%</div>
                        <div style={{ fontSize: 10, color: COLORS.textMut }}>{alt.free} dispo</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div style={{ padding: 16, background: COLORS.dangerBg, borderRadius: 10, textAlign: 'center' }}>
              <XCircle size={24} color={COLORS.danger} style={{ marginBottom: 8 }} />
              <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.danger }}>Aucun emplacement disponible</div>
              <div style={{ fontSize: 12, color: COLORS.textSec, marginTop: 4 }}>Tous les emplacements sont saturés.</div>
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16, paddingTop: 14, borderTop: `1px solid ${COLORS.border}` }}>
        <Btn variant="outline" size="sm" onClick={onClose}>Fermer</Btn>
        {result?.success && <Btn size="sm" icon={Check} style={{ marginLeft: 8 }}>Affecter</Btn>}
      </div>
    </div>
  );
}

/* ── Mouvements d'un noeud ── */
function NodeMovements({ node, isMobile }) {
  const movements = DEMO_MOVEMENTS.filter(m =>
    m.de?.includes(node.label) || m.vers?.includes(node.label) || m.zone === node.label
  );
  const allMvts = movements.length > 0 ? movements : DEMO_MOVEMENTS.slice(0, 5);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{node.label}</div>
        <Badge label={`${allMvts.length} mouvement(s)`} color={COLORS.info} bg={COLORS.infoBg} />
      </div>
      {allMvts.map((m, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: `1px solid ${COLORS.borderLight}` }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: COLORS.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Move size={14} color={COLORS.primaryLight} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{m.document} — {m.description}</div>
            {m.de && m.vers && (
              <div style={{ fontSize: 11, color: COLORS.textMut, marginTop: 2 }}>{m.de} → {m.vers}</div>
            )}
            <div style={{ fontSize: 11, color: COLORS.textMut }}>{m.date} {m.heure} • {m.auteur}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Scan Inventory Panel ── */
function ScanInventoryPanel({ data, isMobile, onClose }) {
  const [zone, setZone] = useState('');
  const [scanning, setScanning] = useState(false);

  return (
    <div>
      <div style={{ padding: 12, background: COLORS.infoBg, borderRadius: 8, border: '1px solid #bfdbfe', marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.info, display: 'flex', alignItems: 'center', gap: 6 }}>
          <ScanLine size={14} />Scannez les codes-barres ou QR des documents dans une zone
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Zone à inventorier</label>
        <select value={zone} onChange={e => setZone(e.target.value)} style={inputStyle}>
          <option value="">— Sélectionner —</option>
          {data.map(e => <option key={e.id} value={e.id}>{e.site} › {e.batiment} › {e.nom} ({e.salle})</option>)}
        </select>
      </div>

      {zone && !scanning && (
        <Btn icon={ScanLine} onClick={() => setScanning(true)} style={{ marginBottom: 12 }}>
          Lancer l'inventaire
        </Btn>
      )}

      {scanning && (
        <div style={{ textAlign: 'center', padding: 32, background: COLORS.surfaceAlt, borderRadius: 10, marginBottom: 12 }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: COLORS.primaryLighter, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', animation: 'pulse 1.5s infinite' }}>
            <ScanLine size={28} color={COLORS.primary} />
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Scan en cours...</div>
          <div style={{ fontSize: 12, color: COLORS.textMut }}>Scannez les documents de la zone sélectionnée</div>
          <div style={{ marginTop: 16, fontSize: 24, fontWeight: 800, color: COLORS.primary }}>3 / 45</div>
          <div style={{ fontSize: 11, color: COLORS.textMut }}>documents scannés</div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: `1px solid ${COLORS.border}`, paddingTop: 14, gap: 8 }}>
        {scanning && <Btn variant="danger" size="sm" onClick={() => setScanning(false)}>Arrêter</Btn>}
        <Btn variant="outline" size="sm" onClick={onClose}>Fermer</Btn>
        {scanning && <Btn size="sm" icon={Download}>Exporter résultat</Btn>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HELPERS & MICRO-COMPOSANTS
═══════════════════════════════════════════════════════════════ */

function KpiCard({ icon: Icon, label, value, color, bg }) {
  return (
    <div style={{ background: '#fff', borderRadius: 10, padding: '14px 16px', border: `1px solid ${COLORS.border}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 11, color: COLORS.textMut, marginBottom: 4, fontWeight: 500 }}>{label}</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{value}</div>
        </div>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={16} color={color} />
        </div>
      </div>
    </div>
  );
}

function SmallBtn({ icon: Icon, title, onClick }) {
  return (
    <button onClick={onClick} title={title}
      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 4, transition: 'background .1s' }}
      onMouseEnter={e => e.currentTarget.style.background = COLORS.borderLight}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      <Icon size={14} color={COLORS.textMut} />
    </button>
  );
}

function MiniBtn({ label, onClick }) {
  return (
    <button onClick={onClick}
      style={{ background: '#fff', border: `1px solid ${COLORS.borderLight}`, borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer', color: COLORS.textSec, fontFamily: FF }}>
      {label}
    </button>
  );
}

function Legend() {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      {[
        { color: COLORS.success, label: '<50%' },
        { color: COLORS.info, label: '50-74%' },
        { color: COLORS.warning, label: '75-89%' },
        { color: COLORS.danger, label: '≥90%' },
      ].map(l => (
        <React.Fragment key={l.label}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: l.color }} />
          <span style={{ fontSize: 10, color: COLORS.textMut }}>{l.label}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

/* ── Build tree from flat data + contenants + documents ── */
function buildTree(data, contenants = [], documents = []) {
  const siteMap = {};
  data.forEach(e => {
    if (!siteMap[e.site]) siteMap[e.site] = {};
    if (!siteMap[e.site][e.batiment]) siteMap[e.site][e.batiment] = {};

    const etage = e.etage || 'RDC';
    if (!siteMap[e.site][e.batiment][etage]) siteMap[e.site][e.batiment][etage] = [];
    siteMap[e.site][e.batiment][etage].push(e);
  });

  /* Build contenant subtree recursively */
  const childConts = (pid) => contenants.filter(c => c.parentId === pid);
  const docsOf = (cid) => documents.filter(d => d.contenantId === cid);

  const buildContNode = (c) => {
    const kids = childConts(c.id);
    const cdocs = docsOf(c.id);
    const pct = c.capacite > 0 ? Math.round((c.contenu / c.capacite) * 100) : 0;
    return {
      id: c.id, label: c.label, level: 'contenant', code: c.codeBarres || c.id,
      capacite: c.capacite, occupe: c.contenu, percent: pct,
      contenant: c,
      children: [
        ...kids.map(buildContNode),
        ...cdocs.map(d => ({
          id: d.id, label: d.titre, level: 'document', code: d.id,
          document: d, children: [],
        })),
      ],
    };
  };

  /* Root contenants for a given emplacement */
  const rootConts = (eid) => contenants.filter(c => c.emplacementId === eid && !c.parentId);

  return Object.entries(siteMap).map(([site, bats]) => {
    const siteItems = data.filter(d => d.site === site);
    return {
      id: `site-${site}`, label: site, level: 'site', code: '',
      ...agg(siteItems),
      children: Object.entries(bats).map(([bat, etages]) => {
        const batItems = data.filter(d => d.site === site && d.batiment === bat);
        return {
          id: `bat-${site}-${bat}`, label: bat, level: 'batiment', code: '',
          ...agg(batItems),
          children: Object.entries(etages).map(([etage, salles]) => ({
            id: `etg-${site}-${bat}-${etage}`, label: `Étage ${etage}`, level: 'etage', code: etage,
            ...agg(salles),
            children: salles.map(s => ({
              id: s.id, label: s.nom || s.salle, level: 'salle', code: s.salle,
              capacite: s.capacite, occupe: s.occupe,
              percent: s.capacite > 0 ? Math.round((s.occupe / s.capacite) * 100) : 0,
              path: `${site} › ${bat} › ${etage} › ${s.salle}`,
              typeRayonnage: s.typeRayonnage || 'standard',
              children: [
                /* Physical: rayonnages → niveaux */
                ...(s.rayonnages || []).map((r, ri) => ({
                  id: `${s.id}-ray-${ri}`, label: r.nom || `Rayonnage ${ri + 1}`, level: 'rayonnage', code: r.code,
                  capacite: r.capacite || 0, occupe: r.occupe || 0,
                  percent: r.capacite > 0 ? Math.round((r.occupe / r.capacite) * 100) : 0,
                  children: (r.niveaux || []).map((n, ni) => ({
                    id: `${s.id}-ray-${ri}-niv-${ni}`, label: n.nom || `Niveau ${ni + 1}`, level: 'niveau', code: n.code,
                    capacite: n.capacite || 0, occupe: n.occupe || 0,
                    percent: n.capacite > 0 ? Math.round((n.occupe / n.capacite) * 100) : 0,
                    children: [],
                  })),
                })),
                /* Logical: contenants → sous-contenants → documents */
                ...rootConts(s.id).map(buildContNode),
              ],
            })),
          })),
        };
      }),
    };
  });
}

function agg(items) {
  const capacite = items.reduce((s, e) => s + (e.capacite || 0), 0);
  const occupe = items.reduce((s, e) => s + (e.occupe || 0), 0);
  return { capacite, occupe, percent: capacite > 0 ? Math.round((occupe / capacite) * 100) : 0 };
}

function getAllLeaves(node) {
  if (!node.children || node.children.length === 0) return [node];
  return node.children.flatMap(getAllLeaves);
}

/* ═══════════════════════════════════════════════════════════════
   DONNÉES DÉMO
═══════════════════════════════════════════════════════════════ */
const DEMO_EMPLACEMENTS = [
  { id: 'EMP-001', site: 'Siège Analakely', batiment: 'Bâtiment Principal', etage: '1', salle: 'S-101', nom: 'Archives courantes DG', capacite: 500, occupe: 423, typeRayonnage: 'compactus',
    rayonnages: [
      { nom: 'Ray. A1', code: 'A1', capacite: 125, occupe: 118, niveaux: [{ nom: 'Niv. 1', code: 'A1-1', capacite: 25, occupe: 24 }, { nom: 'Niv. 2', code: 'A1-2', capacite: 25, occupe: 23 }, { nom: 'Niv. 3', code: 'A1-3', capacite: 25, occupe: 22 }, { nom: 'Niv. 4', code: 'A1-4', capacite: 25, occupe: 25 }, { nom: 'Niv. 5', code: 'A1-5', capacite: 25, occupe: 24 }] },
      { nom: 'Ray. A2', code: 'A2', capacite: 125, occupe: 110, niveaux: [{ nom: 'Niv. 1', code: 'A2-1', capacite: 25, occupe: 22 }, { nom: 'Niv. 2', code: 'A2-2', capacite: 25, occupe: 23 }] },
      { nom: 'Ray. B1', code: 'B1', capacite: 125, occupe: 100 },
      { nom: 'Ray. B2', code: 'B2', capacite: 125, occupe: 95 },
    ] },
  { id: 'EMP-002', site: 'Siège Analakely', batiment: 'Bâtiment Principal', etage: '1', salle: 'S-102', nom: 'Archives RH', capacite: 300, occupe: 285, typeRayonnage: 'securise',
    rayonnages: [
      { nom: 'Coffre A', code: 'CA', capacite: 100, occupe: 98 },
      { nom: 'Coffre B', code: 'CB', capacite: 100, occupe: 95 },
      { nom: 'Étagère C', code: 'EC', capacite: 100, occupe: 92 },
    ] },
  { id: 'EMP-003', site: 'Siège Analakely', batiment: 'Bâtiment Principal', etage: '2', salle: 'S-201', nom: 'Salle Finances', capacite: 400, occupe: 245, typeRayonnage: 'standard' },
  { id: 'EMP-004', site: 'Siège Analakely', batiment: 'Annexe', etage: 'RDC', salle: 'A-001', nom: 'Dépôt courrier', capacite: 200, occupe: 120 },
  { id: 'EMP-005', site: 'Siège Analakely', batiment: 'Annexe', etage: '1', salle: 'A-101', nom: 'Archives juridiques', capacite: 350, occupe: 190, typeRayonnage: 'compactus' },
  { id: 'EMP-006', site: 'Site Ankorondrano', batiment: 'Entrepôt Nord', etage: 'RDC', salle: 'N-001', nom: 'Archivage intermédiaire', capacite: 2000, occupe: 1450, typeRayonnage: 'compactus',
    rayonnages: [
      { nom: 'Travée 1', code: 'T1', capacite: 500, occupe: 420 },
      { nom: 'Travée 2', code: 'T2', capacite: 500, occupe: 380 },
      { nom: 'Travée 3', code: 'T3', capacite: 500, occupe: 350 },
      { nom: 'Travée 4', code: 'T4', capacite: 500, occupe: 300 },
    ] },
  { id: 'EMP-007', site: 'Site Ankorondrano', batiment: 'Entrepôt Nord', etage: '1', salle: 'N-101', nom: 'Archives définitives', capacite: 1500, occupe: 980 },
  { id: 'EMP-008', site: 'Site Ankorondrano', batiment: 'Entrepôt Sud', etage: 'RDC', salle: 'S-001', nom: 'Stockage technique', capacite: 800, occupe: 320 },
  { id: 'EMP-009', site: 'Agence Tamatave', batiment: 'Bureau régional', etage: 'RDC', salle: 'T-001', nom: 'Archives locales', capacite: 250, occupe: 180 },
  { id: 'EMP-010', site: 'Agence Tamatave', batiment: 'Bureau régional', etage: '1', salle: 'T-101', nom: 'Salle courrier', capacite: 100, occupe: 42 },
];

const DEMO_MOVEMENTS = [
  { date: '2025-02-28', heure: '15:20', type: 'entree', document: 'DOC-2025-0142', description: 'Enregistrement nouveau contrat', de: '', vers: 'Archives courantes DG (S-101)', auteur: 'M. Rakoto', zone: 'Archives courantes DG' },
  { date: '2025-02-28', heure: '14:45', type: 'transfert', document: 'DOC-2024-0891', description: 'Transfert vers archivage intermédiaire', de: 'Salle Finances (S-201)', vers: 'Archivage intermédiaire (N-001)', auteur: 'Admin Razafin.', zone: 'Salle Finances' },
  { date: '2025-02-28', heure: '11:30', type: 'sortie', document: 'DOC-2025-0089', description: 'Prêt pour consultation', de: 'Archives RH (S-102)', vers: 'Bureau DRH', auteur: 'R. Andria', zone: 'Archives RH' },
  { date: '2025-02-27', heure: '16:00', type: 'inventaire', document: '—', description: 'Inventaire zone S-101 : 423/500 confirmés', de: '', vers: '', auteur: 'S. Nirina', zone: 'Archives courantes DG' },
  { date: '2025-02-27', heure: '14:30', type: 'entree', document: 'DOC-2025-0138', description: 'Réception facture fournisseur', de: '', vers: 'Salle Finances (S-201)', auteur: 'M. Rakoto', zone: 'Salle Finances' },
  { date: '2025-02-27', heure: '10:15', type: 'transfert', document: 'LOT-2024-Q2', description: 'Transfert lot archives Q2 2024', de: 'Dépôt courrier (A-001)', vers: 'Archivage intermédiaire (N-001)', auteur: 'Admin Razafin.', zone: 'Dépôt courrier' },
  { date: '2025-02-26', heure: '15:45', type: 'elimination', document: 'ELIM-2025-002', description: 'Élimination 120 brouillons (DUA expirée)', de: 'Archivage intermédiaire (N-001)', vers: 'Détruit', auteur: 'Admin Razafin.', zone: 'Archivage intermédiaire' },
  { date: '2025-02-26', heure: '09:30', type: 'entree', document: 'DOC-2025-0135', description: 'Nouveau dossier client', de: '', vers: 'Archives courantes DG (S-101)', auteur: 'S. Nirina', zone: 'Archives courantes DG' },
  { date: '2025-02-25', heure: '16:20', type: 'sortie', document: 'DOC-2024-0456', description: 'Retour de consultation', de: 'Bureau juridique', vers: 'Archives juridiques (A-101)', auteur: 'R. Andria', zone: 'Archives juridiques' },
  { date: '2025-02-25', heure: '11:00', type: 'transfert', document: 'DOC-2023-0312', description: 'Passage en conservation définitive', de: 'Archivage intermédiaire (N-001)', vers: 'Archives définitives (N-101)', auteur: 'Admin Razafin.', zone: 'Archives définitives' },
];

/* ── Contenants demo (lien emplacementId → EMP-xxx) ── */
const DEMO_CONTENANTS_EMI = [
  { id: 'CNT-001', label: 'Carton Archives DG 2024', type: 'carton', statut: 'ouvert', capacite: 300, contenu: 245, parentId: null, emplacementId: 'EMP-001', codeBarres: 'CNT001-2024-DG' },
  { id: 'CNT-002', label: 'Boîte Contrats Q1 2025', type: 'boite', statut: 'ouvert', capacite: 80, contenu: 52, parentId: 'CNT-001', emplacementId: 'EMP-001', codeBarres: 'CNT002-Q1-25' },
  { id: 'CNT-003', label: 'Dossier Prestation JIRAMA', type: 'dossier', statut: 'ouvert', capacite: 25, contenu: 18, parentId: 'CNT-002', emplacementId: 'EMP-001', codeBarres: 'CNT003-JIR' },
  { id: 'CNT-004', label: 'Chemise Annexes contrat', type: 'chemise', statut: 'ouvert', capacite: 10, contenu: 7, parentId: 'CNT-003', emplacementId: 'EMP-001', codeBarres: 'CNT004-ANN' },
  { id: 'CNT-005', label: 'Carton RH Dossiers actifs', type: 'carton', statut: 'ferme', capacite: 200, contenu: 198, parentId: null, emplacementId: 'EMP-002', codeBarres: 'CNT005-RH-ACT' },
  { id: 'CNT-006', label: 'Boîte Paie 2024', type: 'boite', statut: 'scelle', capacite: 100, contenu: 100, parentId: 'CNT-005', emplacementId: 'EMP-002', codeBarres: 'CNT006-PAIE24' },
  { id: 'CNT-007', label: 'Boîte Factures fournisseurs', type: 'boite', statut: 'ouvert', capacite: 120, contenu: 89, parentId: null, emplacementId: 'EMP-003', codeBarres: 'CNT007-FACT' },
  { id: 'CNT-008', label: 'Classeur Juridique 2024', type: 'classeur', statut: 'ouvert', capacite: 50, contenu: 42, parentId: null, emplacementId: 'EMP-005', codeBarres: 'CNT008-JUR24' },
  { id: 'CNT-009', label: 'Lot Archives définitives Q2', type: 'lot', statut: 'scelle', capacite: 500, contenu: 478, parentId: null, emplacementId: 'EMP-007', codeBarres: 'CNT009-DEF-Q2' },
  { id: 'CNT-010', label: 'Carton Transit Tamatave', type: 'carton', statut: 'transit', capacite: 250, contenu: 180, parentId: null, emplacementId: 'EMP-009', codeBarres: 'CNT010-TAM' },
  { id: 'CNT-011', label: 'Dossier Client BNI', type: 'dossier', statut: 'ouvert', capacite: 30, contenu: 12, parentId: 'CNT-007', emplacementId: 'EMP-003', codeBarres: 'CNT011-BNI' },
  { id: 'CNT-012', label: 'Boîte Correspondance 2025', type: 'boite', statut: 'ouvert', capacite: 60, contenu: 15, parentId: null, emplacementId: 'EMP-004', codeBarres: 'CNT012-COR25' },
];

/* ── Documents demo (lien contenantId → CNT-xxx) ── */
const DEMO_DOCS_EMI = [
  { id: 'DOC-2025-0142', titre: 'Contrat prestation JIRAMA', statut: 'disponible', contenantId: 'CNT-003' },
  { id: 'DOC-2025-0138', titre: 'Facture Orange Madagascar', statut: 'en_traitement', contenantId: 'CNT-007' },
  { id: 'DOC-2025-0135', titre: 'Dossier client BNI', statut: 'disponible', contenantId: 'CNT-011' },
  { id: 'DOC-2025-0130', titre: 'Note de service Congés', statut: 'disponible', contenantId: 'CNT-005' },
  { id: 'DOC-2025-0125', titre: 'PV CA Q4 2024', statut: 'archivage_inter', contenantId: 'CNT-009' },
  { id: 'DOC-2025-0120', titre: 'Contrat bail Ankorondrano', statut: 'disponible', contenantId: 'CNT-008' },
  { id: 'DOC-2025-0115', titre: 'Dossier embauche Rakoto', statut: 'en_consultation', contenantId: 'CNT-005' },
  { id: 'DOC-2025-0110', titre: 'Rapport audit 2024', statut: 'disponible', contenantId: 'CNT-001' },
];