/* ═══════════════════════════════════════════════════════════════
   SOFT LIBRARY — Documents physiques (Gestion documentaire complète)
   
   Fonctionnalités :
   ✓ Création / enregistrement de documents physiques
   ✓ Référentiel documentaire centralisé multi-services
   ✓ Types documentaires configurables (métadonnées dynamiques)
   ✓ Indexation multi-critères personnalisable
   ✓ Recherche avancée (booléenne, multicritère, plein texte OCR)
   ✓ Gestion des versions physiques
   ✓ Gestion des statuts documentaires (actif, archivé, prêté, détruit…)
   ✓ Responsive mobile / tablet / desktop
═══════════════════════════════════════════════════════════════ */
import React, { useState, useMemo, useCallback , useEffect } from 'react';
import {
  Plus, QrCode, Download, Search, Layers, LayoutDashboard,
  MoreVertical, ExternalLink, MapPin, Printer, Edit3, Eye,
  X, Check, ChevronDown, ChevronRight, ChevronLeft, Filter,
  Copy, Trash2, Clock, Tag, FileText, Save, AlertTriangle,
  ArrowUpDown, SlidersHorizontal, RotateCcw, History, Lock,
  Unlock, Archive, Upload, ScanLine, Hash, Calendar, User,
  Building2, Briefcase, ChevronUp, RefreshCw, Link2, Zap, CheckCircle2,
  Package, Box, Shield,
} from 'lucide-react';
import { COLORS, FONT_FAMILY, getStatutUI, getConfUI, LIB_STATUTS_UI, CONF_UI } from '../theme';
import { Badge, Btn, Modal, Pagination, SearchBar } from '../components/ui';

/* ═══════════════════════════════════════════════════
   CONSTANTES
═══════════════════════════════════════════════════ */
const FF = FONT_FAMILY;
const SERVICES = [
  'Direction Générale', 'Ressources Humaines', 'Finances',
  'Service Technique', 'Juridique', 'Communication', 'Informatique',
  'Logistique', 'Commercial',
];

const SEARCH_OPERATORS = [
  { id: 'contains', label: 'Contient' },
  { id: 'exact', label: 'Exact' },
  { id: 'starts', label: 'Commence par' },
  { id: 'not', label: 'Ne contient pas' },
];

const STATUS_TRANSITIONS = {
  disponible:      ['en_consultation', 'en_traitement', 'prete', 'archivage_inter', 'en_transfert'],
  en_consultation: ['disponible', 'en_traitement'],
  en_traitement:   ['disponible', 'en_consultation'],
  prete:           ['disponible', 'en_restauration'],
  en_transfert:    ['disponible', 'archivage_inter', 'archivage_def'],
  archivage_inter: ['disponible', 'archivage_def', 'elimine'],
  archivage_def:   ['en_restauration', 'elimine'],
  en_restauration: ['disponible', 'archivage_def'],
  elimine:         [],
};

/* ═══════════════════════════════════════════════════
   STYLES HELPERS
═══════════════════════════════════════════════════ */
const inputStyle = {
  width: '100%', padding: '9px 12px', borderRadius: 8,
  border: `1.5px solid ${COLORS.border}`, fontSize: 13,
  background: '#fff', outline: 'none', boxSizing: 'border-box',
  fontFamily: FF, transition: 'border-color .15s',
};
const labelStyle = { fontSize: 11, color: COLORS.textMut, marginBottom: 4, display: 'block', fontWeight: 600 };
const cardStyle = {
  background: '#fff', borderRadius: 12,
  border: `1px solid ${COLORS.border}`, overflow: 'hidden',
};

/* ═══════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
═══════════════════════════════════════════════════ */
export default function LibDocuments({ documents = [], docTypes = [], emplacements = [], contenants = [], users = [] }) {
  // ── State principal ──
  const [search, setSearch]           = useState('');
  const [statusF, setStatusF]         = useState('all');
  const [serviceF, setServiceF]       = useState('all');
  const [confF, setConfF]             = useState('all');
  const [typeF, setTypeF]             = useState('all');
  const [viewMode, setViewMode]       = useState('table');
  const [selDoc, setSelDoc]           = useState(null);
  const [page, setPage]               = useState(1);
  const [showCreate, setShowCreate]   = useState(false);
  const [editDoc, setEditDoc]         = useState(null);
  const [showAdvSearch, setShowAdvSearch] = useState(false);
  const [showVersions, setShowVersions]  = useState(null);
  const [showStatus, setShowStatus]      = useState(null);
  const [showQR, setShowQR]              = useState(null);
  const [showScan, setShowScan]          = useState(false);
  const [showAudit, setShowAudit]        = useState(null);
  const [showContDetail, setShowContDetail] = useState(null);
  const [sortField, setSortField]        = useState('dateDocument');
  const [sortDir, setSortDir]            = useState('desc');
  const [isMobile, setIsMobile]          = useState(false);

  // ── Responsive ──
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ── Advanced search state ──
  const [advCriteria, setAdvCriteria] = useState([
    { field: 'titre', operator: 'contains', value: '' },
  ]);
  const [ocrSearch, setOcrSearch] = useState('');
  const [dateFrom, setDateFrom]  = useState('');
  const [dateTo, setDateTo]      = useState('');

  const perPage = isMobile ? 8 : 12;

  /* ── Filtrage + Tri ── */
  const filtered = useMemo(() => {
    let result = documents.filter((d) => {
      // Simple search
      const ms = !search ||
        d.titre?.toLowerCase().includes(search.toLowerCase()) ||
        d.id?.toLowerCase().includes(search.toLowerCase()) ||
        (d.reference || '').toLowerCase().includes(search.toLowerCase()) ||
        (d.cote || '').toLowerCase().includes(search.toLowerCase()) ||
        (d.emetteur || '').toLowerCase().includes(search.toLowerCase());
      const mst = statusF === 'all' || d.statut === statusF;
      const msv = serviceF === 'all' || d.service === serviceF;
      const mcf = confF === 'all' || d.confidentialite === confF;
      const mtp = typeF === 'all' || d.typeId === typeF;
      return ms && mst && msv && mcf && mtp;
    });

    // Advanced criteria
    if (showAdvSearch) {
      advCriteria.forEach(c => {
        if (!c.value) return;
        const val = c.value.toLowerCase();
        result = result.filter(d => {
          const fieldVal = (d[c.field] || '').toString().toLowerCase();
          switch (c.operator) {
            case 'exact': return fieldVal === val;
            case 'starts': return fieldVal.startsWith(val);
            case 'not': return !fieldVal.includes(val);
            default: return fieldVal.includes(val);
          }
        });
      });
      // OCR / plein texte
      if (ocrSearch) {
        const ocr = ocrSearch.toLowerCase();
        result = result.filter(d =>
          (d.ocrText || '').toLowerCase().includes(ocr) ||
          (d.description || '').toLowerCase().includes(ocr) ||
          (d.motsCles || []).some(m => m.toLowerCase().includes(ocr))
        );
      }
      // Date range
      if (dateFrom) result = result.filter(d => d.dateDocument >= dateFrom);
      if (dateTo) result = result.filter(d => d.dateDocument <= dateTo);
    }

    // Sort
    result.sort((a, b) => {
      const va = (a[sortField] || '').toString();
      const vb = (b[sortField] || '').toString();
      return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    });

    return result;
  }, [documents, search, statusF, serviceF, confF, typeF, showAdvSearch, advCriteria, ocrSearch, dateFrom, dateTo, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  /* ── Helpers ── */
  const getEmpl = (id) => emplacements.find(e => e.id === id);
  const getDocType = (id) => docTypes.find(t => t.id === id);
  const getCont = (id) => contenants.find(c => c.id === id);
  const getContPath = (cont) => {
    if (!cont) return '';
    const parts = [cont.label];
    let p = cont.parentId;
    while (p) { const pc = contenants.find(c => c.id === p); if (pc) { parts.unshift(pc.label); p = pc.parentId; } else break; }
    return parts.join(' › ');
  };
  const uniqueServices = useMemo(() => [...new Set(documents.map(d => d.service).filter(Boolean))], [documents]);
  const toggleSort = (f) => { if (sortField === f) setSortDir(d => d === 'asc' ? 'desc' : 'asc'); else { setSortField(f); setSortDir('asc'); } };

  const resetFilters = () => {
    setSearch(''); setStatusF('all'); setServiceF('all'); setConfF('all'); setTypeF('all');
    setAdvCriteria([{ field: 'titre', operator: 'contains', value: '' }]);
    setOcrSearch(''); setDateFrom(''); setDateTo('');
    setPage(1);
  };

  const hasActiveFilters = statusF !== 'all' || serviceF !== 'all' || confF !== 'all' || typeF !== 'all' || search || ocrSearch || dateFrom || dateTo;

  /* ═══════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════ */
  return (
    <div>
      {/* ── HEADER ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: isMobile ? 20 : 24, fontWeight: 700 }}>Documents physiques</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: COLORS.textMut }}>
            {filtered.length} document{filtered.length > 1 ? 's' : ''} {hasActiveFilters ? '(filtré)' : ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {!isMobile && <Btn icon={QrCode} variant="outline" size="sm" onClick={() => setShowScan(true)}>Scanner</Btn>}
          {!isMobile && <Btn icon={Download} variant="outline" size="sm">Exporter</Btn>}
          <Btn icon={Plus} size="sm" onClick={() => { setEditDoc(null); setShowCreate(true); }}>
            {isMobile ? 'Nouveau' : 'Nouveau document'}
          </Btn>
        </div>
      </div>

      {/* ── TOOLBAR ── */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: isMobile ? '100%' : 200, maxWidth: isMobile ? '100%' : 340 }}>
          <Search size={16} color={COLORS.textMut} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Rechercher par titre, réf, cote, émetteur..."
            style={{ ...inputStyle, paddingLeft: 38, background: COLORS.surfaceAlt }}
          />
        </div>

        {!isMobile && (
          <>
            <SelectFilter value={statusF} onChange={v => { setStatusF(v); setPage(1); }}
              options={[{ id: 'all', label: 'Tous statuts' }, ...LIB_STATUTS_UI.map(s => ({ id: s.id, label: s.label }))]} />
            <SelectFilter value={serviceF} onChange={v => { setServiceF(v); setPage(1); }}
              options={[{ id: 'all', label: 'Tous services' }, ...uniqueServices.map(s => ({ id: s, label: s }))]} />
          </>
        )}

        <button
          onClick={() => setShowAdvSearch(p => !p)}
          style={{
            ...inputStyle, width: 'auto', display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', cursor: 'pointer',
            background: showAdvSearch ? COLORS.primaryLighter : '#fff',
            color: showAdvSearch ? COLORS.primary : COLORS.textSec,
            fontWeight: 600, border: `1.5px solid ${showAdvSearch ? COLORS.primary : COLORS.border}`,
          }}
        >
          <SlidersHorizontal size={15} />
          {!isMobile && (showAdvSearch ? 'Masquer' : 'Recherche avancée')}
        </button>

        {hasActiveFilters && (
          <button onClick={resetFilters} style={{ ...inputStyle, width: 'auto', padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: COLORS.danger, fontWeight: 600, background: COLORS.dangerBg, border: `1.5px solid #fecaca` }}>
            <RotateCcw size={14} />{!isMobile && 'Réinitialiser'}
          </button>
        )}

        {!isMobile && (
          <div style={{ display: 'flex', border: `1.5px solid ${COLORS.border}`, borderRadius: 8, overflow: 'hidden', marginLeft: 'auto' }}>
            {[{ m: 'table', i: Layers }, { m: 'grid', i: LayoutDashboard }].map(v => (
              <button key={v.m} onClick={() => setViewMode(v.m)}
                style={{ padding: '7px 12px', background: viewMode === v.m ? COLORS.primary : '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <v.i size={16} color={viewMode === v.m ? '#fff' : COLORS.textMut} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── MOBILE FILTERS ── */}
      {isMobile && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, overflowX: 'auto', paddingBottom: 4 }}>
          <SelectFilter value={statusF} onChange={v => { setStatusF(v); setPage(1); }}
            options={[{ id: 'all', label: 'Statut' }, ...LIB_STATUTS_UI.map(s => ({ id: s.id, label: s.label }))]} />
          <SelectFilter value={serviceF} onChange={v => { setServiceF(v); setPage(1); }}
            options={[{ id: 'all', label: 'Service' }, ...uniqueServices.map(s => ({ id: s, label: s }))]} />
          <SelectFilter value={confF} onChange={v => { setConfF(v); setPage(1); }}
            options={[{ id: 'all', label: 'Conf.' }, ...CONF_UI.map(c => ({ id: c.id, label: c.label }))]} />
          {docTypes.length > 0 && (
            <SelectFilter value={typeF} onChange={v => { setTypeF(v); setPage(1); }}
              options={[{ id: 'all', label: 'Type' }, ...docTypes.map(t => ({ id: t.id, label: t.nom }))]} />
          )}
        </div>
      )}

      {/* ── ADVANCED SEARCH PANEL ── */}
      {showAdvSearch && (
        <AdvancedSearchPanel
          criteria={advCriteria}
          setCriteria={setAdvCriteria}
          ocrSearch={ocrSearch}
          setOcrSearch={setOcrSearch}
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
          confF={confF}
          setConfF={setConfF}
          typeF={typeF}
          setTypeF={setTypeF}
          docTypes={docTypes}
          isMobile={isMobile}
          onSearch={() => setPage(1)}
        />
      )}

      {/* ── TABLE VIEW ── */}
      {(viewMode === 'table' && !isMobile) ? (
        <div style={cardStyle}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: COLORS.surfaceAlt }}>
                  {[
                    { key: 'id', label: 'Réf.', w: 110 },
                    { key: 'titre', label: 'Titre' },
                    { key: 'categorie', label: 'Type/Cat.' },
                    { key: 'service', label: 'Service' },
                    { key: 'statut', label: 'Statut' },
                    { key: 'confidentialite', label: 'Conf.' },
                    { key: 'dateDocument', label: 'Date' },
                    { key: '_actions', label: '' },
                  ].map(h => (
                    <th key={h.key}
                      onClick={() => h.key !== '_actions' && toggleSort(h.key)}
                      style={{
                        padding: '11px 14px', textAlign: 'left', fontWeight: 600,
                        color: COLORS.textSec, fontSize: 11, textTransform: 'uppercase',
                        letterSpacing: .5, whiteSpace: 'nowrap', cursor: h.key !== '_actions' ? 'pointer' : 'default',
                        width: h.w || 'auto', userSelect: 'none',
                      }}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        {h.label}
                        {sortField === h.key && <ArrowUpDown size={12} color={COLORS.primary} style={{ transform: sortDir === 'desc' ? 'scaleY(-1)' : 'none' }} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageData.length === 0 ? (
                  <tr><td colSpan={8} style={{ padding: 48, textAlign: 'center', color: COLORS.textMut }}>
                    <FileText size={40} strokeWidth={1.2} style={{ marginBottom: 8, opacity: .35 }} />
                    <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.textSec }}>Aucun document trouvé</div>
                    <div style={{ fontSize: 12, marginTop: 4 }}>Modifiez vos filtres ou créez un nouveau document</div>
                  </td></tr>
                ) : pageData.map(d => {
                  const st = getStatutUI(d.statut);
                  const conf = getConfUI(d.confidentialite);
                  return (
                    <tr key={d.id}
                      style={{ borderBottom: `1px solid ${COLORS.borderLight}`, cursor: 'pointer' }}
                      onClick={() => setSelDoc(d)}
                      onMouseEnter={e => e.currentTarget.style.background = '#fafbfc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '11px 14px', fontWeight: 600, color: COLORS.primaryLight, fontSize: 12, fontFamily: 'monospace' }}>{d.id}</td>
                      <td style={{ padding: '11px 14px', fontWeight: 500, maxWidth: 260 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {d.titre}
                          {d.lienNumerique && <ExternalLink size={12} color={COLORS.info} />}
                          {d.versions?.length > 1 && <span style={{ fontSize: 10, color: COLORS.textMut, background: COLORS.borderLight, borderRadius: 4, padding: '1px 5px' }}>v{d.versions.length}</span>}
                        </div>
                      </td>
                      <td style={{ padding: '11px 14px', color: COLORS.textSec, fontSize: 12 }}>{d.categorie}</td>
                      <td style={{ padding: '11px 14px', fontSize: 12, color: COLORS.textSec }}>{d.service}</td>
                      <td style={{ padding: '11px 14px' }}><Badge label={st.label} color={st.color} bg={st.bg} /></td>
                      <td style={{ padding: '11px 14px' }}><Badge label={conf.label} color={conf.color} bg={conf.color + '15'} /></td>
                      <td style={{ padding: '11px 14px', color: COLORS.textMut, fontSize: 12 }}>{d.dateDocument}</td>
                      <td style={{ padding: '11px 14px' }}>
                        <ActionMenu doc={d} onView={() => setSelDoc(d)} onEdit={() => { setEditDoc(d); setShowCreate(true); }} onVersions={() => setShowVersions(d)} onStatus={() => setShowStatus(d)} onQR={() => setShowQR(d)} onAudit={() => setShowAudit(d)} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      ) : (
        /* ── GRID / MOBILE CARD VIEW ── */
        <>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill,minmax(280px,1fr))', gap: isMobile ? 10 : 14 }}>
            {pageData.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 48, color: COLORS.textMut }}>
                <FileText size={40} strokeWidth={1.2} style={{ marginBottom: 8, opacity: .35 }} />
                <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.textSec }}>Aucun document trouvé</div>
              </div>
            ) : pageData.map(d => (
              <DocCard key={d.id} doc={d} isMobile={isMobile} onClick={() => setSelDoc(d)} onEdit={() => { setEditDoc(d); setShowCreate(true); }} />
            ))}
          </div>
          {totalPages > 1 && <div style={{ marginTop: 16 }}><Pagination page={page} totalPages={totalPages} onPageChange={setPage} /></div>}
        </>
      )}

      {/* ── MODALS ── */}

      {/* Fiche documentaire */}
      <Modal isOpen={!!selDoc} onClose={() => setSelDoc(null)} title="Fiche documentaire" width={isMobile ? '95vw' : 720}>
        {selDoc && (
          <DocDetail
            doc={selDoc}
            getEmpl={getEmpl}
            getDocType={getDocType}
            getCont={getCont}
            getContPath={getContPath}
            contenants={contenants}
            isMobile={isMobile}
            onEdit={() => { setSelDoc(null); setEditDoc(selDoc); setShowCreate(true); }}
            onVersions={() => { setSelDoc(null); setShowVersions(selDoc); }}
            onStatus={() => { setSelDoc(null); setShowStatus(selDoc); }}
            onQR={() => { setSelDoc(null); setShowQR(selDoc); }}
            onAudit={() => { setSelDoc(null); setShowAudit(selDoc); }}
            onOpenContenant={(c) => { setSelDoc(null); setShowContDetail(c); }}
          />
        )}
      </Modal>

      {/* Création / Modification */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title={editDoc ? 'Modifier le document' : 'Nouveau document'} width={isMobile ? '95vw' : 740}>
        <DocForm
          doc={editDoc}
          docTypes={docTypes}
          emplacements={emplacements}
          contenants={contenants}
          services={uniqueServices.length > 0 ? uniqueServices : SERVICES}
          isMobile={isMobile}
          onSave={(data) => { console.log('Save:', data); setShowCreate(false); }}
          onCancel={() => setShowCreate(false)}
        />
      </Modal>

      {/* Gestion des versions */}
      <Modal isOpen={!!showVersions} onClose={() => setShowVersions(null)} title="Historique des versions" width={isMobile ? '95vw' : 620}>
        {showVersions && <VersionsPanel doc={showVersions} isMobile={isMobile} />}
      </Modal>

      {/* Gestion des statuts */}
      <Modal isOpen={!!showStatus} onClose={() => setShowStatus(null)} title="Gestion du statut" width={isMobile ? '95vw' : 520}>
        {showStatus && <StatusPanel doc={showStatus} isMobile={isMobile} onClose={() => setShowStatus(null)} />}
      </Modal>

      {/* QR / Code-barres / Étiquette */}
      <Modal isOpen={!!showQR} onClose={() => setShowQR(null)} title="QR Code / Étiquette" width={isMobile ? '95vw' : 520}>
        {showQR && <QRLabelPanel doc={showQR} isMobile={isMobile} />}
      </Modal>

      {/* Scan accès rapide */}
      <Modal isOpen={showScan} onClose={() => setShowScan(false)} title="Scanner un document" width={isMobile ? '95vw' : 480}>
        <ScanAccessPanel docs={documents} isMobile={isMobile} onOpenDoc={(d) => { setShowScan(false); setSelDoc(d); }} />
      </Modal>

      {/* Historique complet des modifications */}
      <Modal isOpen={!!showAudit} onClose={() => setShowAudit(null)} title="Historique des modifications" width={isMobile ? '95vw' : 640}>
        {showAudit && <AuditHistoryPanel doc={showAudit} isMobile={isMobile} />}
      </Modal>

      {/* Détail contenant (inline depuis DocDetail) */}
      <Modal isOpen={!!showContDetail} onClose={() => setShowContDetail(null)} title="Détail du contenant" width={isMobile ? '95vw' : 620}>
        {showContDetail && <InlineContDetail
          cont={showContDetail}
          contenants={contenants}
          documents={documents}
          emplacements={emplacements}
          getEmpl={getEmpl}
          isMobile={isMobile}
        />}
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SOUS-COMPOSANTS
═══════════════════════════════════════════════════ */

/* ── Select Filter ── */
function SelectFilter({ value, onChange, options }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ padding: '8px 12px', borderRadius: 8, border: `1.5px solid ${COLORS.border}`, fontSize: 12, background: '#fff', fontFamily: FF, minWidth: 0, flexShrink: 0 }}>
      {options.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
    </select>
  );
}

/* ── Action Menu (3 dots) ── */
function ActionMenu({ doc, onView, onEdit, onVersions, onStatus, onQR, onAudit }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
      <button onClick={() => setOpen(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
        <MoreVertical size={16} color={COLORS.textMut} />
      </button>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 999 }} onClick={() => setOpen(false)} />
          <div style={{ position: 'absolute', right: 0, top: '100%', background: '#fff', borderRadius: 10, border: `1px solid ${COLORS.border}`, boxShadow: '0 8px 24px rgba(0,0,0,.1)', zIndex: 1000, minWidth: 180, padding: 4, animation: 'modalIn .15s ease' }}>
            {[
              { icon: Eye, label: 'Voir la fiche', action: onView },
              { icon: Edit3, label: 'Modifier', action: onEdit },
              { icon: History, label: 'Versions', action: onVersions },
              { icon: RefreshCw, label: 'Changer statut', action: onStatus },
              { icon: Printer, label: 'Imprimer étiquette', action: onQR },
              { icon: QrCode, label: 'QR / Code-barres', action: onQR },
              { icon: Clock, label: 'Historique modifications', action: onAudit },
              { icon: Copy, label: 'Dupliquer', action: () => {} },
            ].map((item, i) => (
              <button key={i} onClick={() => { item.action(); setOpen(false); }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: COLORS.textSec, borderRadius: 6, fontFamily: FF }}
                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <item.icon size={15} />{item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ── DocCard (Grid/Mobile) ── */
function DocCard({ doc, isMobile, onClick, onEdit }) {
  const st = getStatutUI(doc.statut);
  const conf = getConfUI(doc.confidentialite);
  return (
    <div onClick={onClick}
      style={{ background: '#fff', borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: isMobile ? 14 : 16, cursor: 'pointer', transition: 'all .15s' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,.06)'; e.currentTarget.style.borderColor = COLORS.primaryLight; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = COLORS.border; }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.primaryLight, fontFamily: 'monospace' }}>{doc.id}</span>
        <Badge label={st.label} color={st.color} bg={st.bg} />
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{doc.titre}</div>
      <div style={{ fontSize: 12, color: COLORS.textSec, marginBottom: 8 }}>{doc.categorie} • {doc.service}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: COLORS.textMut }}>{doc.dateDocument}</span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {doc.versions?.length > 1 && <span style={{ fontSize: 10, color: COLORS.textMut, background: COLORS.borderLight, borderRadius: 4, padding: '1px 5px' }}>v{doc.versions.length}</span>}
          <Badge label={conf.label} color={conf.color} bg={conf.color + '15'} />
        </div>
      </div>
      {/* Mots-clés */}
      {doc.motsCles?.length > 0 && (
        <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
          {doc.motsCles.slice(0, 3).map((m, i) => (
            <span key={i} style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: COLORS.borderLight, color: COLORS.textSec }}>{m}</span>
          ))}
          {doc.motsCles.length > 3 && <span style={{ fontSize: 10, color: COLORS.textMut }}>+{doc.motsCles.length - 3}</span>}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   RECHERCHE AVANCÉE
═══════════════════════════════════════════════════ */
function AdvancedSearchPanel({ criteria, setCriteria, ocrSearch, setOcrSearch, dateFrom, setDateFrom, dateTo, setDateTo, confF, setConfF, typeF, setTypeF, docTypes, isMobile, onSearch }) {
  const fields = [
    { id: 'titre', label: 'Titre' }, { id: 'id', label: 'Référence' },
    { id: 'cote', label: 'Cote' }, { id: 'emetteur', label: 'Émetteur' },
    { id: 'categorie', label: 'Catégorie' }, { id: 'service', label: 'Service' },
    { id: 'description', label: 'Description' },
  ];

  const addCriterion = () => setCriteria(p => [...p, { field: 'titre', operator: 'contains', value: '' }]);
  const removeCriterion = (i) => setCriteria(p => p.filter((_, idx) => idx !== i));
  const updateCriterion = (i, key, val) => setCriteria(p => p.map((c, idx) => idx === i ? { ...c, [key]: val } : c));

  return (
    <div style={{ ...cardStyle, padding: isMobile ? 14 : 20, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <SlidersHorizontal size={18} color={COLORS.primary} />
        <span style={{ fontWeight: 700, fontSize: 14 }}>Recherche avancée</span>
      </div>

      {/* Critères dynamiques */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Critères multicritères (booléen ET)</label>
        {criteria.map((c, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
            <select value={c.field} onChange={e => updateCriterion(i, 'field', e.target.value)}
              style={{ ...inputStyle, width: isMobile ? '100%' : 140, flex: isMobile ? '1 1 100%' : 'none' }}>
              {fields.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
            </select>
            <select value={c.operator} onChange={e => updateCriterion(i, 'operator', e.target.value)}
              style={{ ...inputStyle, width: isMobile ? '48%' : 130 }}>
              {SEARCH_OPERATORS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
            <div style={{ flex: 1, display: 'flex', gap: 6, minWidth: isMobile ? '48%' : 0 }}>
              <input value={c.value} onChange={e => updateCriterion(i, 'value', e.target.value)}
                placeholder="Valeur..." style={inputStyle} />
              {criteria.length > 1 && (
                <button onClick={() => removeCriterion(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, flexShrink: 0 }}>
                  <X size={16} color={COLORS.danger} />
                </button>
              )}
            </div>
          </div>
        ))}
        <button onClick={addCriterion}
          style={{ background: 'none', border: `1px dashed ${COLORS.border}`, cursor: 'pointer', padding: '6px 14px', borderRadius: 8, fontSize: 12, color: COLORS.primaryLight, fontWeight: 600, fontFamily: FF, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Plus size={14} /> Ajouter un critère
        </button>
      </div>

      {/* OCR / Plein texte + Dates + Conf + Type */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
        <div>
          <label style={labelStyle}><ScanLine size={12} style={{ marginRight: 4 }} />Plein texte / OCR</label>
          <input value={ocrSearch} onChange={e => setOcrSearch(e.target.value)}
            placeholder="Rechercher dans le contenu OCR, description, mots-clés..."
            style={inputStyle} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div>
            <label style={labelStyle}><Calendar size={12} style={{ marginRight: 4 }} />Date du</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}><Calendar size={12} style={{ marginRight: 4 }} />Date au</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={inputStyle} />
          </div>
        </div>

        {!isMobile && (
          <>
            <div>
              <label style={labelStyle}>Confidentialité</label>
              <select value={confF} onChange={e => setConfF(e.target.value)} style={inputStyle}>
                <option value="all">Toutes</option>
                {CONF_UI.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            {docTypes.length > 0 && (
              <div>
                <label style={labelStyle}>Type documentaire</label>
                <select value={typeF} onChange={e => setTypeF(e.target.value)} style={inputStyle}>
                  <option value="all">Tous</option>
                  {docTypes.map(t => <option key={t.id} value={t.id}>{t.nom}</option>)}
                </select>
              </div>
            )}
          </>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14, gap: 8 }}>
        <Btn variant="outline" size="sm" icon={RotateCcw} onClick={() => {
          setCriteria([{ field: 'titre', operator: 'contains', value: '' }]);
          setOcrSearch(''); setDateFrom(''); setDateTo('');
        }}>Effacer</Btn>
        <Btn size="sm" icon={Search} onClick={onSearch}>Rechercher</Btn>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   FICHE DOCUMENTAIRE (Detail)
═══════════════════════════════════════════════════ */
function DocDetail({ doc, getEmpl, getDocType, getCont, getContPath, contenants, isMobile, onEdit, onVersions, onStatus, onQR, onAudit, onOpenContenant }) {
  const st = getStatutUI(doc.statut);
  const conf = getConfUI(doc.confidentialite);
  const emp = getEmpl?.(doc.emplacementId);
  const dt = getDocType?.(doc.typeId);
  const cont = getCont?.(doc.contenantId);
  const contPath = cont ? getContPath?.(cont) : null;
  const contEmpl = cont ? getEmpl?.(cont.emplacementId) : null;
  const [tab, setTab] = useState('info');

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, borderBottom: `2px solid ${COLORS.border}`, overflowX: 'auto' }}>
        {[
          { id: 'info', label: 'Informations', icon: FileText },
          { id: 'meta', label: 'Métadonnées', icon: Tag },
          { id: 'versions', label: `Versions${doc.versions ? ` (${doc.versions.length})` : ''}`, icon: History },
          { id: 'index', label: 'Indexation', icon: Hash },
          { id: 'apercu', label: 'Aperçu', icon: Eye },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              padding: isMobile ? '8px 12px' : '8px 16px', background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: tab === t.id ? 700 : 500, whiteSpace: 'nowrap',
              color: tab === t.id ? COLORS.primary : COLORS.textMut,
              borderBottom: tab === t.id ? `2px solid ${COLORS.primary}` : '2px solid transparent',
              marginBottom: -2, fontFamily: FF, display: 'flex', alignItems: 'center', gap: 5,
            }}>
            <t.icon size={14} />{t.label}
          </button>
        ))}
      </div>

     
      {/* Tab: Info */}
      {tab === 'info' && (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14, marginBottom: 20 }}>
          <Field label="Référence" value={doc.id} mono accent />
          <Field label="Cote" value={doc.cote} mono />
          <div style={{ gridColumn: '1/-1' }}><Field label="Titre" value={doc.titre} large /></div>
          <Field label="Type" value={dt?.nom || doc.typeId} />
          <Field label="Catégorie" value={doc.categorie} />
          <Field label="Service" value={doc.service} />
          <Field label="Date document" value={doc.dateDocument} />
          {doc.montant != null && <Field label="Montant" value={`${doc.montant?.toLocaleString('fr-FR')} ${doc.devise || ''}`} />}
          <Field label="Émetteur" value={doc.emetteur} />
          <div style={{ gridColumn: '1/-1' }}>
            <div style={{ fontSize: 11, color: COLORS.textMut, marginBottom: 3 }}>Emplacement</div>
            <div style={{ fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={14} color={COLORS.primaryLight} />
              {emp ? `${emp.nom} › ${emp.batiment} › ${emp.salle}` : doc.emplacementId || '—'}
            </div>
          </div>

          {/* ── Contenant physique (clickable) ── */}
          <div style={{ gridColumn: '1/-1' }}>
            <div style={{ fontSize: 11, color: COLORS.textMut, marginBottom: 5 }}>Contenant physique</div>
            {cont ? (
              <div
                onClick={() => onOpenContenant?.(cont)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                  background: '#fffbeb', border: '1.5px solid #fbbf2420', borderRadius: 10,
                  cursor: 'pointer', transition: 'all .15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(245,158,11,.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#fbbf2420'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ width: 34, height: 34, borderRadius: 8, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Package size={17} color="#d97706" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cont.label}</div>
                  <div style={{ fontSize: 10, color: COLORS.textMut }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{cont.id}</span>
                    {contPath && contPath !== cont.label && <span> • {contPath}</span>}
                  </div>
                  {contEmpl && <div style={{ fontSize: 10, color: COLORS.textMut, display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}><MapPin size={9} />{contEmpl.nom} › {contEmpl.salle}</div>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
                  <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, fontWeight: 600,
                    background: cont.statut === 'scelle' ? '#fef2f2' : cont.statut === 'ferme' ? '#fffbeb' : '#f0fdf4',
                    color: cont.statut === 'scelle' ? '#dc2626' : cont.statut === 'ferme' ? '#d97706' : '#16a34a',
                  }}>
                    {cont.statut === 'scelle' ? '🔒 Scellé' : cont.statut === 'ferme' ? '🔐 Fermé' : cont.statut === 'transit' ? '🚚 Transit' : '📦 Ouvert'}
                  </span>
                  <span style={{ fontSize: 10, color: COLORS.textMut }}>{cont.contenu}/{cont.capacite}</span>
                </div>
                <ChevronRight size={14} color={COLORS.textMut} />
              </div>
            ) : (
              <div style={{ fontSize: 13, color: COLORS.textMut, fontStyle: 'italic' }}>— Non rangé dans un contenant</div>
            )}
          </div>
          <div>
            <div style={{ fontSize: 11, color: COLORS.textMut, marginBottom: 3 }}>Statut</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Badge label={st.label} color={st.color} bg={st.bg} />
              <button onClick={onStatus} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.primaryLight, fontSize: 11, fontWeight: 600, fontFamily: FF }}>Modifier →</button>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: COLORS.textMut, marginBottom: 3 }}>Confidentialité</div>
            <Badge label={conf.label} color={conf.color} bg={conf.color + '15'} />
          </div>
          <Field label="Code-barres" value={doc.codeBarres} mono />
          <div>
            <div style={{ fontSize: 11, color: COLORS.textMut, marginBottom: 3 }}>Lien numérique</div>
            <div style={{ fontSize: 13, color: doc.lienNumerique ? COLORS.info : COLORS.textMut }}>
              {doc.lienNumerique ? `✓ Lié à ${doc.lienNumerique}` : '— Non numérisé'}
            </div>
          </div>
          {doc.description && <div style={{ gridColumn: '1/-1' }}><Field label="Description" value={doc.description} /></div>}
        </div>
      )}

      {/* Tab: Métadonnées dynamiques */}
      {tab === 'meta' && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ padding: 14, background: COLORS.infoBg, borderRadius: 8, border: '1px solid #bfdbfe', marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.info, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Zap size={14} />Métadonnées dynamiques — Type : {dt?.nom || doc.typeId || '—'}
            </div>
          </div>
          {dt?.metadonnees?.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
              {dt.metadonnees.map((m, i) => (
                <div key={i} style={{ padding: 10, background: COLORS.surfaceAlt, borderRadius: 8, border: `1px solid ${COLORS.borderLight}` }}>
                  <div style={{ fontSize: 11, color: COLORS.textMut, marginBottom: 2 }}>{m.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{doc.metadonnees?.[m.cle] || '—'}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 32, color: COLORS.textMut }}>
              <Tag size={32} strokeWidth={1.2} style={{ opacity: .3, marginBottom: 8 }} />
              <div style={{ fontSize: 13 }}>Aucune métadonnée configurée pour ce type</div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Versions */}
      {tab === 'versions' && <VersionsPanel doc={doc} isMobile={isMobile} embedded />}

      {/* Tab: Indexation */}
      {tab === 'index' && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
            <div>
              <label style={labelStyle}>Mots-clés</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {(doc.motsCles || []).length > 0 ? doc.motsCles.map((m, i) => (
                  <span key={i} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 16, background: COLORS.primaryLighter, color: COLORS.primary, fontWeight: 500 }}>{m}</span>
                )) : <span style={{ fontSize: 12, color: COLORS.textMut }}>Aucun mot-clé</span>}
              </div>
            </div>
            <div>
              <label style={labelStyle}>Numéro de classement</label>
              <div style={{ fontSize: 14, fontWeight: 600, fontFamily: 'monospace' }}>{doc.cote || '—'}</div>
            </div>
            <div>
              <label style={labelStyle}>Contenant</label>
              {cont ? (
                <div onClick={() => onOpenContenant?.(cont)}
                  style={{ fontSize: 13, fontWeight: 600, color: '#d97706', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}>
                  <Package size={13} />{cont.label} <span style={{ fontWeight: 400, fontSize: 11, color: COLORS.textMut }}>({cont.id})</span>
                </div>
              ) : (
                <div style={{ fontSize: 13, fontWeight: 500, color: COLORS.textMut }}>—</div>
              )}
            </div>
            <div>
              <label style={labelStyle}>Service producteur</label>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{doc.service || '—'}</div>
            </div>
            {doc.ocrText && (
              <div style={{ gridColumn: '1/-1' }}>
                <label style={labelStyle}><ScanLine size={12} style={{ marginRight: 4 }} />Contenu OCR extrait</label>
                <div style={{ fontSize: 12, color: COLORS.textSec, padding: 10, background: COLORS.surfaceAlt, borderRadius: 8, border: `1px solid ${COLORS.borderLight}`, maxHeight: 120, overflowY: 'auto', lineHeight: 1.5 }}>
                  {doc.ocrText}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
       {/* Tab: Aperçu PDF */}
      {tab === 'apercu' && <LazyPreview doc={doc} docType={dt} isMobile={isMobile} />}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', borderTop: `1px solid ${COLORS.border}`, paddingTop: 14, flexWrap: 'wrap' }}>
        <Btn variant="outline" icon={Printer} size="sm" onClick={onQR}>Étiquette</Btn>
        <Btn variant="outline" icon={QrCode} size="sm" onClick={onQR}>QR</Btn>
        <Btn variant="outline" icon={Clock} size="sm" onClick={onAudit}>Historique</Btn>
        <Btn variant="outline" icon={Edit3} size="sm" onClick={onEdit}>Modifier</Btn>
        <Btn variant="outline" icon={History} size="sm" onClick={onVersions}>Versions</Btn>
        <Btn icon={RefreshCw} size="sm" onClick={onStatus}>Statut</Btn>
      </div>

      
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   APERÇU DOCUMENT — Rendu PDF réaliste
   ─────────────────────────────────────────────────
   Génère un aperçu visuel type PDF basé sur les
   données réelles de chaque document, avec template
   adapté au type documentaire.
═══════════════════════════════════════════════════ */
function LazyPreview({ doc, docType, isMobile }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(false);
    const t = setTimeout(() => setReady(true), 900 + Math.random() * 600);
    return () => clearTimeout(t);
  }, [doc?.id]);

  if (!ready) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: 48, gap: 16 }}>
      <div style={{ width: 36, height: 36, border: `3px solid ${COLORS.border}`,
        borderTopColor: COLORS.primary, borderRadius: '50%',
        animation: 'ldSpin .7s linear infinite' }} />
      <div style={{ fontSize: 13, color: COLORS.textSec, fontWeight: 500 }}>
        Chargement de l'aperçu…
      </div>
      <div style={{ fontSize: 11, color: COLORS.textMut }}>
        Génération du rendu PDF — {doc.id}
      </div>
      <style>{`@keyframes ldSpin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return <DocPreviewPanel doc={doc} docType={docType} isMobile={isMobile} />;
}
function DocPreviewPanel({ doc, docType, isMobile }) {
  const [zoom, setZoom] = useState(1);

  const formatDate = (d) => {
    if (!d) return '—';
    try { return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }); }
    catch { return d; }
  };

  const meta = doc.metadonnees || {};
  const typeLabel = docType?.label || docType?.nom || doc.categorie || '';
  const typeId = doc.typeId || '';
  const isConfidential = doc.confidentiel && doc.confidentiel !== 'conf-public';

  /* Template selector based on typeId */
  const getTemplate = () => {
    /* DOC-TYP-01 = Contrats */
    if (typeId === 'DOC-TYP-01' || typeLabel.toLowerCase().includes('contrat')) return 'contrat';
    /* DOC-TYP-02 = Factures */
    if (typeId === 'DOC-TYP-02' || typeLabel.toLowerCase().includes('facture')) return 'facture';
    /* DOC-TYP-03 = Notes de service */
    if (typeId === 'DOC-TYP-03' || typeLabel.toLowerCase().includes('note')) return 'note';
    /* DOC-TYP-04 = PV Conseil Admin */
    if (typeId === 'DOC-TYP-04' || typeLabel.toLowerCase().includes('pv') || typeLabel.toLowerCase().includes('conseil')) return 'pv';
    /* DOC-TYP-05 = Correspondance */
    if (typeId === 'DOC-TYP-05' || typeLabel.toLowerCase().includes('correspond')) return 'courrier';
    /* DOC-TYP-06 = Dossiers clients */
    if (typeId === 'DOC-TYP-06' || typeLabel.toLowerCase().includes('client')) return 'dossier';
    /* DOC-TYP-07 = Dossiers RH */
    if (typeId === 'DOC-TYP-07' || typeLabel.toLowerCase().includes('rh') || typeLabel.toLowerCase().includes('ressource')) return 'rh';
    /* DOC-TYP-08 = Rapports audit */
    if (typeId === 'DOC-TYP-08' || typeLabel.toLowerCase().includes('audit') || typeLabel.toLowerCase().includes('rapport')) return 'rapport';
    /* DOC-TYP-09 = Plans & Techniques */
    if (typeId === 'DOC-TYP-09' || typeLabel.toLowerCase().includes('plan') || typeLabel.toLowerCase().includes('technique')) return 'technique';
    /* DOC-TYP-10 = Registres légaux */
    if (typeId === 'DOC-TYP-10' || typeLabel.toLowerCase().includes('registre') || typeLabel.toLowerCase().includes('fiscal')) return 'registre';
    return 'generique';
  };

  const template = getTemplate();

  /* ── Shared styles ── */
  const PAGE = {
    width: '100%', maxWidth: 680, margin: '0 auto',
    background: '#fff', borderRadius: 3, position: 'relative',
    boxShadow: '0 2px 20px rgba(0,0,0,.12), 0 0 1px rgba(0,0,0,.15)',
    padding: isMobile ? 28 : 48, fontFamily: "'Times New Roman', 'Georgia', serif",
    color: '#1a1a1a', lineHeight: 1.6, fontSize: 13,
    minHeight: isMobile ? 600 : 860,
    transform: `scale(${zoom})`, transformOrigin: 'top center',
    transition: 'transform .2s',
  };
  const HR = { border: 'none', borderTop: '1.5px solid #1a1a1a', margin: '14px 0' };
  const HR_LIGHT = { border: 'none', borderTop: '1px solid #ccc', margin: '12px 0' };
  const HEADER_BLOCK = { textAlign: 'center', marginBottom: 24 };
  const COMPANY = { fontSize: 18, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', margin: 0, fontFamily: "'Georgia', serif" };
  const SUBTITLE = { fontSize: 10, color: '#666', margin: '2px 0 0', letterSpacing: 0.5 };
  const DOC_TITLE = { fontSize: 16, fontWeight: 700, textTransform: 'uppercase', textAlign: 'center', margin: '18px 0 8px', letterSpacing: 1 };
  const LABEL = { fontSize: 11, color: '#666', marginBottom: 1 };
  const VALUE = { fontSize: 13, fontWeight: 500 };
  const FIELD_ROW = { display: 'flex', justifyContent: 'space-between', marginBottom: 6, flexWrap: 'wrap', gap: 4 };
  const SECTION_TITLE = { fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid #999', paddingBottom: 3, marginBottom: 10, marginTop: 18 };
  const BODY_TEXT = { fontSize: 12, lineHeight: 1.7, textAlign: 'justify', color: '#333' };
  const GRAY_BLOCK = { background: '#f5f5f5', padding: '10px 14px', borderRadius: 3, marginBottom: 8 };

  /* ── Simulated text content per template ── */
  const renderLoremBlock = (lines = 4) => (
    <div style={BODY_TEXT}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} style={{ height: 10, background: '#e8e8e8', borderRadius: 2, marginBottom: 6,
          width: `${85 + Math.sin(i * 2.3) * 15}%` }} />
      ))}
    </div>
  );

  /* ── Company header (shared) ── */
  const renderCompanyHeader = () => (
    <div style={HEADER_BLOCK}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid #1a1a1a',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800,
          fontFamily: 'Arial, sans-serif' }}>SW</div>
        <div>
          <p style={COMPANY}>SOFTWELL MADAGASCAR</p>
          <p style={SUBTITLE}>Société de Services & Solutions Informatiques</p>
        </div>
      </div>
      <p style={{ fontSize: 9, color: '#888', margin: 0 }}>
        Lot IVG 12 Bis, Analakely — Antananarivo 101 — Madagascar — Tél: +261 20 22 123 45
      </p>
    </div>
  );

  /* ── Confidential watermark ── */
  const renderWatermark = () => isConfidential ? (
    <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%) rotate(-35deg)',
      fontSize: 52, fontWeight: 900, color: 'rgba(220,38,38,.07)', letterSpacing: 8,
      textTransform: 'uppercase', pointerEvents: 'none', whiteSpace: 'nowrap',
      fontFamily: 'Arial, sans-serif' }}>CONFIDENTIEL</div>
  ) : null;

  /* ── Footer page number ── */
  const renderFooter = (page = 1) => (
    <div style={{ position: 'absolute', bottom: isMobile ? 16 : 24, left: 0, right: 0,
      textAlign: 'center', fontSize: 9, color: '#999', fontFamily: 'Arial, sans-serif' }}>
      <hr style={{ border: 'none', borderTop: '0.5px solid #ddd', margin: '0 48px 6px' }} />
      {doc.id} — {typeLabel} — Page {page}/1
    </div>
  );

  /* ── Metadata row helper ── */
  const MetaRow = ({ label, value: val }) => val ? (
    <div style={FIELD_ROW}>
      <span style={LABEL}>{label} :</span>
      <span style={VALUE}>{val}</span>
    </div>
  ) : null;

  /* ═══════════════════════════════════════════════════
     TEMPLATES
  ═══════════════════════════════════════════════════ */

  /* ── CONTRAT ── */
  const renderContrat = () => (
    <div style={PAGE}>
      {renderWatermark()}
      {renderCompanyHeader()}
      <hr style={HR} />
      <div style={DOC_TITLE}>CONTRAT</div>
      <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 600, marginBottom: 16, color: '#333' }}>
        {doc.titre}
      </div>
      <hr style={HR_LIGHT} />
      <div style={FIELD_ROW}>
        <div><span style={LABEL}>Référence :</span> <span style={{ fontFamily: 'Courier New, monospace', fontWeight: 600 }}>{doc.reference || doc.id}</span></div>
        <div><span style={LABEL}>Date :</span> <span style={VALUE}>{formatDate(doc.dateDocument)}</span></div>
      </div>
      <div style={FIELD_ROW}>
        <div><span style={LABEL}>Service :</span> <span style={VALUE}>{doc.service}</span></div>
        <div><span style={LABEL}>Rédacteur :</span> <span style={VALUE}>{doc.auteur || doc.emetteur || '—'}</span></div>
      </div>
      {meta.cocontractant && <MetaRow label="Co-contractant" value={meta.cocontractant} />}
      {meta.montant && <MetaRow label="Montant" value={meta.montant} />}
      {meta.dureeContrat && <MetaRow label="Durée" value={meta.dureeContrat} />}
      {doc.montant != null && <MetaRow label="Valeur contractuelle" value={`${doc.montant?.toLocaleString?.('fr-FR') || doc.montant} ${doc.devise || 'MGA'}`} />}

      <div style={SECTION_TITLE}>Article 1 — Objet du contrat</div>
      <p style={BODY_TEXT}>
        Le présent contrat a pour objet de définir les conditions dans lesquelles les parties s'engagent
        mutuellement concernant <strong>{doc.titre?.toLowerCase()}</strong>, conformément aux dispositions
        en vigueur au sein de <em>Softwell Madagascar</em>.
      </p>
      {renderLoremBlock(3)}

      <div style={SECTION_TITLE}>Article 2 — Durée et conditions</div>
      {renderLoremBlock(4)}

      <div style={SECTION_TITLE}>Article 3 — Obligations des parties</div>
      {renderLoremBlock(3)}

      <div style={{ marginTop: 30, display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={LABEL}>Pour Softwell Madagascar</div>
          <div style={{ width: 140, borderBottom: '1px solid #999', marginTop: 40, marginBottom: 4 }} />
          <div style={{ fontSize: 11 }}>Le Directeur Général</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={LABEL}>Pour le co-contractant</div>
          <div style={{ width: 140, borderBottom: '1px solid #999', marginTop: 40, marginBottom: 4 }} />
          <div style={{ fontSize: 11 }}>{meta.cocontractant || 'Le représentant légal'}</div>
        </div>
      </div>
      {renderFooter()}
    </div>
  );

  /* ── FACTURE ── */
  const renderFacture = () => (
    <div style={PAGE}>
      {renderWatermark()}
      {renderCompanyHeader()}
      <hr style={HR} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 2, fontFamily: 'Arial' }}>FACTURE</div>
          <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>N° {doc.reference || doc.id}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={LABEL}>Date d'émission</div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{formatDate(doc.dateDocument)}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ ...GRAY_BLOCK, flex: 1, minWidth: 180 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#888', textTransform: 'uppercase', marginBottom: 4 }}>Émetteur</div>
          <div style={{ fontSize: 12, fontWeight: 600 }}>{doc.emetteur || 'Softwell Madagascar'}</div>
          <div style={{ fontSize: 10, color: '#666' }}>Lot IVG 12 Bis, Analakely<br />Antananarivo 101</div>
          <div style={{ fontSize: 10, color: '#666', marginTop: 2 }}>NIF: 2001234567 — STAT: 62012 11 2020 0 00456</div>
        </div>
        <div style={{ ...GRAY_BLOCK, flex: 1, minWidth: 180 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#888', textTransform: 'uppercase', marginBottom: 4 }}>Client / Destinataire</div>
          <div style={{ fontSize: 12, fontWeight: 600 }}>{meta.fournisseur || meta.client || doc.service || '—'}</div>
          <div style={{ fontSize: 10, color: '#666' }}>Service : {doc.service}</div>
        </div>
      </div>

      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{doc.titre}</div>

      {/* Simulated line items */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, marginTop: 10 }}>
        <thead>
          <tr style={{ background: '#1a1a1a', color: '#fff' }}>
            <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600 }}>Désignation</th>
            <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, width: 50 }}>Qté</th>
            <th style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600, width: 90 }}>P.U. (MGA)</th>
            <th style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600, width: 100 }}>Montant (MGA)</th>
          </tr>
        </thead>
        <tbody>
          {[
            { desc: doc.titre, qty: 1, pu: doc.montant || 2500000, total: doc.montant || 2500000 },
            { desc: 'Frais de traitement', qty: 1, pu: 150000, total: 150000 },
          ].map((l, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px 10px' }}>{l.desc}</td>
              <td style={{ padding: '8px 10px', textAlign: 'center' }}>{l.qty}</td>
              <td style={{ padding: '8px 10px', textAlign: 'right', fontFamily: 'Courier New, monospace' }}>{l.pu?.toLocaleString?.('fr-FR')}</td>
              <td style={{ padding: '8px 10px', textAlign: 'right', fontFamily: 'Courier New, monospace', fontWeight: 600 }}>{l.total?.toLocaleString?.('fr-FR')}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ borderTop: '2px solid #1a1a1a' }}>
            <td colSpan={3} style={{ padding: '10px', textAlign: 'right', fontWeight: 700, fontSize: 12 }}>TOTAL TTC :</td>
            <td style={{ padding: '10px', textAlign: 'right', fontWeight: 800, fontSize: 14, fontFamily: 'Courier New, monospace' }}>
              {((doc.montant || 2500000) + 150000).toLocaleString('fr-FR')} MGA
            </td>
          </tr>
        </tfoot>
      </table>

      <div style={{ marginTop: 24, fontSize: 10, color: '#888' }}>
        Arrêtée la présente facture à la somme de : <em>{doc.titre}</em>
      </div>
      <div style={{ marginTop: 30, textAlign: 'right' }}>
        <div style={LABEL}>Signature et cachet</div>
        <div style={{ width: 140, borderBottom: '1px solid #999', marginTop: 36, display: 'inline-block' }} />
      </div>
      {renderFooter()}
    </div>
  );

  /* ── NOTE DE SERVICE ── */
  const renderNote = () => (
    <div style={PAGE}>
      {renderWatermark()}
      {renderCompanyHeader()}
      <hr style={HR} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontSize: 11, color: '#666' }}>Réf : {doc.reference || doc.id}</div>
        <div style={{ fontSize: 11, color: '#666' }}>Antananarivo, le {formatDate(doc.dateDocument)}</div>
      </div>
      <div style={{ ...DOC_TITLE, fontSize: 15, border: '2px solid #1a1a1a', padding: '8px 16px', display: 'inline-block', margin: '14px auto', textAlign: 'center' }}>
        NOTE DE SERVICE
      </div>
      <div style={{ textAlign: 'center', fontSize: 12, fontStyle: 'italic', marginBottom: 16, color: '#555' }}>
        N° {doc.reference || doc.id}
      </div>

      <div style={{ marginBottom: 10 }}>
        <span style={LABEL}>De :</span> <span style={{ ...VALUE, marginLeft: 8 }}>{doc.emetteur || doc.auteur || 'La Direction Générale'}</span>
      </div>
      <div style={{ marginBottom: 10 }}>
        <span style={LABEL}>À :</span> <span style={{ ...VALUE, marginLeft: 8 }}>{doc.service ? `Tout le personnel — ${doc.service}` : 'Ensemble du personnel'}</span>
      </div>
      <div style={{ marginBottom: 16 }}>
        <span style={LABEL}>Objet :</span> <span style={{ ...VALUE, fontWeight: 700, marginLeft: 8 }}>{doc.titre}</span>
      </div>
      <hr style={HR_LIGHT} />

      <p style={BODY_TEXT}>
        Il est porté à la connaissance de l'ensemble du personnel que la Direction Générale a décidé
        de procéder aux dispositions suivantes concernant <strong>{doc.titre?.toLowerCase()}</strong>.
      </p>
      <p style={BODY_TEXT}>
        Les modalités d'application sont définies ci-après et entrent en vigueur à compter
        de la date de publication de la présente note.
      </p>
      {renderLoremBlock(5)}
      <p style={{ ...BODY_TEXT, marginTop: 14 }}>
        Le non-respect de ces dispositions sera passible de sanctions conformément au règlement intérieur en vigueur.
      </p>

      <div style={{ marginTop: 30, textAlign: 'right' }}>
        <div style={{ fontSize: 12 }}>Le Directeur Général</div>
        <div style={{ fontSize: 12, fontStyle: 'italic', marginTop: 30, fontWeight: 600 }}>{doc.auteur || 'Rakoto Jean-Baptiste'}</div>
      </div>
      {renderFooter()}
    </div>
  );

  /* ── PV CONSEIL ADMINISTRATION ── */
  const renderPV = () => (
    <div style={PAGE}>
      {renderWatermark()}
      {renderCompanyHeader()}
      <hr style={HR} />
      <div style={DOC_TITLE}>PROCÈS-VERBAL</div>
      <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
        {doc.titre}
      </div>
      <div style={{ textAlign: 'center', fontSize: 11, color: '#666', marginBottom: 16 }}>
        Séance du {formatDate(doc.dateDocument)} — Réf. {doc.reference || doc.id}
      </div>
      <hr style={HR_LIGHT} />

      <div style={SECTION_TITLE}>Participants</div>
      <div style={GRAY_BLOCK}>
        {['Rakoto Jean-Baptiste (Président)', 'Randria Marie-Claire (Secrétaire de séance)', 'Razafy Pierre (Membre)',
          'Rasoamanarivo Hanta (Membre)', 'Andriamananjara Lova (Membre)'].map((p, i) => (
          <div key={i} style={{ fontSize: 11, padding: '2px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#333', display: 'inline-block' }} />
            {p}
          </div>
        ))}
      </div>

      <div style={SECTION_TITLE}>Ordre du jour</div>
      <div style={{ fontSize: 12, marginBottom: 12 }}>
        <div>1. {doc.titre}</div>
        <div>2. Questions diverses</div>
      </div>

      <div style={SECTION_TITLE}>Délibérations</div>
      <p style={BODY_TEXT}>
        Le Président ouvre la séance à 09h00 et constate que le quorum est atteint.
        Il soumet à l'approbation de l'assemblée l'ordre du jour portant sur
        « <em>{doc.titre?.toLowerCase()}</em> ».
      </p>
      {renderLoremBlock(4)}

      <div style={SECTION_TITLE}>Résolutions adoptées</div>
      {renderLoremBlock(3)}

      <p style={{ ...BODY_TEXT, marginTop: 14 }}>
        Plus rien n'étant à l'ordre du jour, la séance est levée à 11h30.
      </p>

      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={LABEL}>Le Président</div>
          <div style={{ width: 130, borderBottom: '1px solid #999', marginTop: 36, marginBottom: 4 }} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={LABEL}>Le Secrétaire de séance</div>
          <div style={{ width: 130, borderBottom: '1px solid #999', marginTop: 36, marginBottom: 4 }} />
        </div>
      </div>
      {renderFooter()}
    </div>
  );

  /* ── CORRESPONDANCE / COURRIER ── */
  const renderCourrier = () => (
    <div style={PAGE}>
      {renderWatermark()}
      {renderCompanyHeader()}
      <hr style={HR} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={LABEL}>N/Réf : {doc.reference || doc.id}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12 }}>Antananarivo, le {formatDate(doc.dateDocument)}</div>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ ...LABEL, marginBottom: 4 }}>À l'attention de :</div>
        <div style={{ fontSize: 13, fontWeight: 600, paddingLeft: 16 }}>{meta.destinataire || doc.service || '—'}</div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 700 }}>Objet : {doc.titre}</div>
      </div>

      <p style={BODY_TEXT}>Madame, Monsieur,</p>
      <p style={BODY_TEXT}>
        Nous avons l'honneur de porter à votre connaissance les éléments relatifs
        à « <em>{doc.titre?.toLowerCase()}</em> », faisant suite à nos échanges précédents.
      </p>
      {renderLoremBlock(4)}
      <p style={BODY_TEXT}>
        Nous restons à votre entière disposition pour tout complément d'information
        et vous prions d'agréer, Madame, Monsieur, l'expression de nos salutations distinguées.
      </p>

      <div style={{ marginTop: 28, textAlign: 'right' }}>
        <div style={{ fontSize: 12 }}>{doc.auteur || doc.emetteur || 'La Direction'}</div>
        <div style={{ fontSize: 11, color: '#666' }}>{doc.service}</div>
        <div style={{ width: 130, borderBottom: '1px solid #999', marginTop: 32, marginLeft: 'auto' }} />
      </div>
      {renderFooter()}
    </div>
  );

  /* ── DOSSIER CLIENT ── */
  const renderDossier = () => (
    <div style={{ ...PAGE, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      {renderWatermark()}
      <div style={{ border: '3px solid #1a1a1a', padding: '40px 32px', width: '75%', maxWidth: 380 }}>
        <div style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#888', marginBottom: 12 }}>SOFTWELL MADAGASCAR</div>
        <hr style={HR} />
        <div style={{ fontSize: 18, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, margin: '16px 0 8px' }}>
          DOSSIER CLIENT
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#333', margin: '14px 0' }}>{doc.titre}</div>
        <hr style={HR_LIGHT} />
        <div style={{ fontSize: 11, margin: '10px 0' }}>
          <div><span style={LABEL}>Référence :</span> {doc.reference || doc.id}</div>
          <div><span style={LABEL}>Service :</span> {doc.service}</div>
          <div><span style={LABEL}>Date d'ouverture :</span> {formatDate(doc.dateDocument)}</div>
          {meta.client && <div><span style={LABEL}>Client :</span> {meta.client}</div>}
          {meta.secteur && <div><span style={LABEL}>Secteur :</span> {meta.secteur}</div>}
        </div>
        <hr style={HR_LIGHT} />
        <div style={{ fontSize: 10, color: '#999' }}>
          {isConfidential ? '⚠ DOCUMENT CONFIDENTIEL — Accès restreint' : 'Document interne — Usage professionnel'}
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: isMobile ? 20 : 32, fontSize: 10, color: '#bbb' }}>
        Archives physiques — {doc.id} — {typeLabel}
      </div>
    </div>
  );

  /* ── DOSSIER RH ── */
  const renderRH = () => (
    <div style={PAGE}>
      {renderWatermark()}
      {renderCompanyHeader()}
      <hr style={HR} />
      <div style={{ ...DOC_TITLE, color: '#1a1a1a' }}>DOSSIER DU PERSONNEL</div>
      <div style={{ textAlign: 'center', fontSize: 12, marginBottom: 16, color: '#666' }}>
        Réf. {doc.reference || doc.id}
      </div>
      <div style={{ border: '1px solid #ccc', borderRadius: 4, padding: 16, marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 12 }}>
          <div><span style={LABEL}>Nom complet :</span><br /><span style={VALUE}>{doc.titre}</span></div>
          <div><span style={LABEL}>Service :</span><br /><span style={VALUE}>{doc.service}</span></div>
          <div><span style={LABEL}>Date dossier :</span><br /><span style={VALUE}>{formatDate(doc.dateDocument)}</span></div>
          <div><span style={LABEL}>Responsable :</span><br /><span style={VALUE}>{doc.auteur || '—'}</span></div>
          {meta.matricule && <div><span style={LABEL}>Matricule :</span><br /><span style={VALUE}>{meta.matricule}</span></div>}
          {meta.poste && <div><span style={LABEL}>Poste :</span><br /><span style={VALUE}>{meta.poste}</span></div>}
        </div>
      </div>
      <div style={SECTION_TITLE}>Pièces au dossier</div>
      <div style={{ fontSize: 11 }}>
        {['Contrat de travail', 'Fiche de poste', 'Attestations de diplômes', 'Certificats de travail antérieurs', 'Pièce d\'identité (copie)', 'Photo d\'identité'].map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 0' }}>
            <div style={{ width: 12, height: 12, border: '1.5px solid #555', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8 }}>
              {i < 3 ? '✓' : ''}
            </div>
            {p}
          </div>
        ))}
      </div>
      <div style={SECTION_TITLE}>Observations</div>
      {renderLoremBlock(3)}
      <div style={{ fontSize: 9, color: '#999', marginTop: 20, textAlign: 'center' }}>
        ⚠ Ce dossier est strictement confidentiel. Toute consultation doit être enregistrée.
      </div>
      {renderFooter()}
    </div>
  );

  /* ── RAPPORT AUDIT ── */
  const renderRapport = () => (
    <div style={PAGE}>
      {renderWatermark()}
      {renderCompanyHeader()}
      <hr style={HR} />
      <div style={{ ...DOC_TITLE, fontSize: 14 }}>RAPPORT D'AUDIT</div>
      <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 600, marginBottom: 4, color: '#333' }}>{doc.titre}</div>
      <div style={{ textAlign: 'center', fontSize: 11, color: '#666', marginBottom: 16 }}>
        Réf. {doc.reference || doc.id} — {formatDate(doc.dateDocument)}
      </div>
      <hr style={HR_LIGHT} />
      <MetaRow label="Service audité" value={doc.service} />
      <MetaRow label="Auditeur" value={doc.auteur || 'Équipe d\'audit interne'} />
      {meta.periode && <MetaRow label="Période couverte" value={meta.periode} />}
      {meta.scope && <MetaRow label="Périmètre" value={meta.scope} />}

      <div style={SECTION_TITLE}>1. Résumé exécutif</div>
      <p style={BODY_TEXT}>
        Le présent rapport rend compte des travaux d'audit réalisés portant sur
        « <em>{doc.titre?.toLowerCase()}</em> ». L'audit a été conduit conformément aux normes et
        procédures en vigueur au sein de Softwell Madagascar.
      </p>

      <div style={SECTION_TITLE}>2. Constats et observations</div>
      {renderLoremBlock(4)}

      <div style={SECTION_TITLE}>3. Recommandations</div>
      {['Mise en conformité des procédures internes', 'Renforcement des contrôles de gestion', 'Formation du personnel concerné'].map((r, i) => (
        <div key={i} style={{ fontSize: 12, padding: '4px 0', display: 'flex', gap: 8 }}>
          <span style={{ fontWeight: 700, color: '#666' }}>{i + 1}.</span> {r}
        </div>
      ))}

      <div style={SECTION_TITLE}>4. Conclusion</div>
      {renderLoremBlock(3)}
      {renderFooter()}
    </div>
  );

  /* ── TECHNIQUE / PLANS ── */
  const renderTechnique = () => (
    <div style={PAGE}>
      {renderWatermark()}
      {renderCompanyHeader()}
      <hr style={HR} />
      <div style={DOC_TITLE}>DOCUMENT TECHNIQUE</div>
      <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 600, marginBottom: 16, color: '#333' }}>{doc.titre}</div>
      <hr style={HR_LIGHT} />
      <MetaRow label="Référence" value={doc.reference || doc.id} />
      <MetaRow label="Date" value={formatDate(doc.dateDocument)} />
      <MetaRow label="Service" value={doc.service} />
      <MetaRow label="Auteur" value={doc.auteur} />

      <div style={SECTION_TITLE}>Description technique</div>
      {renderLoremBlock(4)}

      {/* Simulated technical drawing area */}
      <div style={{ border: '1px dashed #bbb', padding: 20, margin: '16px 0', textAlign: 'center', minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
        <div style={{ color: '#bbb', fontFamily: 'Arial, sans-serif', fontSize: 12 }}>
          [ Plan technique / Schéma — voir document physique original ]
        </div>
      </div>

      <div style={SECTION_TITLE}>Spécifications</div>
      {renderLoremBlock(3)}
      {renderFooter()}
    </div>
  );

  /* ── REGISTRE LÉGAL ── */
  const renderRegistre = () => (
    <div style={PAGE}>
      {renderWatermark()}
      {renderCompanyHeader()}
      <hr style={HR} />
      <div style={{ ...DOC_TITLE, border: '2px double #1a1a1a', padding: '8px 16px', display: 'inline-block', margin: '12px auto 16px', textAlign: 'center' }}>
        REGISTRE OFFICIEL
      </div>
      <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 600, marginBottom: 4, color: '#333' }}>{doc.titre}</div>
      <div style={{ textAlign: 'center', fontSize: 11, color: '#666', marginBottom: 16 }}>
        {doc.reference || doc.id} — {formatDate(doc.dateDocument)}
      </div>
      <hr style={HR_LIGHT} />

      <MetaRow label="Nature" value={typeLabel} />
      <MetaRow label="Service responsable" value={doc.service} />
      <MetaRow label="Période de couverture" value={meta.exercice || meta.periode || formatDate(doc.dateDocument)} />

      <div style={SECTION_TITLE}>Contenu du registre</div>
      {renderLoremBlock(5)}

      <div style={{ ...GRAY_BLOCK, marginTop: 16, fontSize: 10, textAlign: 'center', color: '#666' }}>
        Ce document a valeur légale et doit être conservé conformément à la réglementation en vigueur.
        <br />Durée de conservation : {docType?.dureeActive || 10} ans (active) + {docType?.dureeInter || 30} ans (intermédiaire)
      </div>
      {renderFooter()}
    </div>
  );

  /* ── GÉNÉRIQUE (fallback) ── */
  const renderGenerique = () => (
    <div style={PAGE}>
      {renderWatermark()}
      {renderCompanyHeader()}
      <hr style={HR} />
      <div style={DOC_TITLE}>{typeLabel.toUpperCase() || 'DOCUMENT'}</div>
      <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 600, marginBottom: 16, color: '#333' }}>{doc.titre}</div>
      <hr style={HR_LIGHT} />
      <MetaRow label="Référence" value={doc.reference || doc.id} />
      <MetaRow label="Date" value={formatDate(doc.dateDocument)} />
      <MetaRow label="Service" value={doc.service} />
      <MetaRow label="Auteur" value={doc.auteur || doc.emetteur} />
      {doc.montant != null && <MetaRow label="Montant" value={`${doc.montant?.toLocaleString?.('fr-FR') || doc.montant} ${doc.devise || 'MGA'}`} />}
      {Object.entries(meta).map(([k, v]) => v ? <MetaRow key={k} label={k} value={String(v)} /> : null)}
      <div style={SECTION_TITLE}>Contenu</div>
      {renderLoremBlock(6)}
      {doc.description && (
        <>
          <div style={SECTION_TITLE}>Description</div>
          <p style={BODY_TEXT}>{doc.description}</p>
        </>
      )}
      {renderFooter()}
    </div>
  );

  /* ── Template map ── */
  const templates = {
    contrat: renderContrat, facture: renderFacture, note: renderNote, pv: renderPV,
    courrier: renderCourrier, dossier: renderDossier, rh: renderRH, rapport: renderRapport,
    technique: renderTechnique, registre: renderRegistre, generique: renderGenerique,
  };
  const renderContent = templates[template] || renderGenerique;

  return (
    <div style={{ marginBottom: 20 }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: COLORS.surfaceAlt || '#f1f5f9',
          borderRadius: 6, padding: '4px 6px', border: `1px solid ${COLORS.border}` }}>
          <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
            style={{ width: 28, height: 28, border: 'none', background: 'none', cursor: 'pointer',
              fontSize: 16, fontWeight: 700, color: COLORS.textSec, fontFamily: 'monospace', borderRadius: 4 }}
            onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}>−</button>
          <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.text, minWidth: 40, textAlign: 'center' }}>
            {Math.round(zoom * 100)}%
          </span>
          <button onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}
            style={{ width: 28, height: 28, border: 'none', background: 'none', cursor: 'pointer',
              fontSize: 16, fontWeight: 700, color: COLORS.textSec, fontFamily: 'monospace', borderRadius: 4 }}
            onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}>+</button>
        </div>
        <button onClick={() => setZoom(1)}
          style={{ fontSize: 11, color: COLORS.primaryLight, background: 'none', border: 'none',
            cursor: 'pointer', fontFamily: FF, fontWeight: 600 }}>
          Réinitialiser
        </button>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: COLORS.textMut }}>
          <FileText size={13} />
          <span>Aperçu — {typeLabel || 'Document'}</span>
        </div>
      </div>

      {/* Paper */}
      <div style={{ background: '#e8e8e8', borderRadius: 8, padding: isMobile ? 12 : 24,
        overflow: 'auto', maxHeight: isMobile ? 500 : 700 }}>
        {renderContent()}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   FORMULAIRE CRÉATION / MODIFICATION
═══════════════════════════════════════════════════ */
function DocForm({ doc, docTypes, emplacements, contenants = [], services, isMobile, onSave, onCancel }) {
  const isEdit = !!doc;
  const [form, setForm] = useState({
    titre: doc?.titre || '',
    typeId: doc?.typeId || (docTypes[0]?.id || ''),
    categorie: doc?.categorie || '',
    service: doc?.service || services[0] || '',
    confidentialite: doc?.confidentialite || 'conf-interne',
    emplacementId: doc?.emplacementId || '',
    emetteur: doc?.emetteur || '',
    dateDocument: doc?.dateDocument || new Date().toISOString().slice(0, 10),
    cote: doc?.cote || '',
    contenantId: doc?.contenantId || '',
    description: doc?.description || '',
    montant: doc?.montant || '',
    devise: doc?.devise || 'MGA',
    motsCles: (doc?.motsCles || []).join(', '),
    lienNumerique: doc?.lienNumerique || '',
    metadonnees: doc?.metadonnees || {},
  });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);

  const selectedType = docTypes.find(t => t.id === form.typeId);
  const update = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: undefined })); };
  const updateMeta = (cle, v) => setForm(p => ({ ...p, metadonnees: { ...p.metadonnees, [cle]: v } }));

  const validate = () => {
    const e = {};
    if (!form.titre.trim()) e.titre = 'Titre requis';
    if (!form.service) e.service = 'Service requis';
    if (!form.dateDocument) e.dateDocument = 'Date requise';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) { setStep(1); return; }
    onSave({
      ...form,
      motsCles: form.motsCles.split(',').map(m => m.trim()).filter(Boolean),
      montant: form.montant ? parseFloat(form.montant) : undefined,
    });
  };

  const totalSteps = 3;

  return (
    <div>
      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
        {[
          { n: 1, label: 'Informations' },
          { n: 2, label: 'Métadonnées' },
          { n: 3, label: 'Indexation' },
        ].map(s => (
          <button key={s.n} onClick={() => setStep(s.n)}
            style={{
              flex: 1, padding: '10px 8px', borderRadius: 8,
              background: step === s.n ? COLORS.primary : step > s.n ? COLORS.primaryLighter : COLORS.surfaceAlt,
              color: step === s.n ? '#fff' : step > s.n ? COLORS.primary : COLORS.textMut,
              border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: FF,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
            <span style={{ width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, background: step === s.n ? 'rgba(255,255,255,.2)' : step > s.n ? COLORS.primary : COLORS.borderLight, color: step === s.n ? '#fff' : step > s.n ? '#fff' : COLORS.textMut }}>{step > s.n ? '✓' : s.n}</span>
            {!isMobile && s.label}
          </button>
        ))}
      </div>

      {/* Step 1: Informations principales */}
      {step === 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
          <div style={{ gridColumn: '1/-1' }}>
            <label style={labelStyle}>Titre *</label>
            <input value={form.titre} onChange={e => update('titre', e.target.value)}
              placeholder="Titre du document..." style={{ ...inputStyle, ...(errors.titre ? { borderColor: COLORS.danger } : {}) }} />
            {errors.titre && <span style={{ fontSize: 11, color: COLORS.danger }}>{errors.titre}</span>}
          </div>
          {docTypes.length > 0 && (
            <div>
              <label style={labelStyle}>Type documentaire</label>
              <select value={form.typeId} onChange={e => update('typeId', e.target.value)} style={inputStyle}>
                {docTypes.map(t => <option key={t.id} value={t.id}>{t.nom}</option>)}
              </select>
            </div>
          )}
          <div>
            <label style={labelStyle}>Catégorie</label>
            <input value={form.categorie} onChange={e => update('categorie', e.target.value)}
              placeholder="Ex: Facture, Contrat..." style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Service *</label>
            <select value={form.service} onChange={e => update('service', e.target.value)}
              style={{ ...inputStyle, ...(errors.service ? { borderColor: COLORS.danger } : {}) }}>
              <option value="">— Choisir —</option>
              {services.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Confidentialité</label>
            <select value={form.confidentialite} onChange={e => update('confidentialite', e.target.value)} style={inputStyle}>
              {CONF_UI.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Date du document *</label>
            <input type="date" value={form.dateDocument} onChange={e => update('dateDocument', e.target.value)}
              style={{ ...inputStyle, ...(errors.dateDocument ? { borderColor: COLORS.danger } : {}) }} />
          </div>
          <div>
            <label style={labelStyle}>Émetteur</label>
            <input value={form.emetteur} onChange={e => update('emetteur', e.target.value)}
              placeholder="Organisme ou personne..." style={inputStyle} />
          </div>
          {emplacements.length > 0 && (
            <div>
              <label style={labelStyle}>Emplacement</label>
              <select value={form.emplacementId} onChange={e => update('emplacementId', e.target.value)} style={inputStyle}>
                <option value="">— Sélectionner —</option>
                {emplacements.map(e => <option key={e.id} value={e.id}>{e.nom} › {e.salle}</option>)}
              </select>
            </div>
          )}
          <div>
            <label style={labelStyle}>Contenant</label>
            <select value={form.contenantId} onChange={e => update('contenantId', e.target.value)} style={inputStyle}>
              <option value="">— Aucun —</option>
              {contenants.filter(c => c.statut === 'ouvert').map(c => <option key={c.id} value={c.id}>📦 {c.label} ({c.id}) — {c.contenu}/{c.capacite}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <label style={labelStyle}>Description</label>
            <textarea value={form.description} onChange={e => update('description', e.target.value)}
              placeholder="Description du document..." rows={3}
              style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div>
            <label style={labelStyle}>Montant</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="number" value={form.montant} onChange={e => update('montant', e.target.value)}
                placeholder="0" style={{ ...inputStyle, flex: 1 }} />
              <select value={form.devise} onChange={e => update('devise', e.target.value)}
                style={{ ...inputStyle, width: 80 }}>
                {['MGA', 'EUR', 'USD'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Lien numérique (SoftDocs)</label>
            <input value={form.lienNumerique} onChange={e => update('lienNumerique', e.target.value)}
              placeholder="DOC-XXXXX" style={inputStyle} />
          </div>
        </div>
      )}

      {/* Step 2: Métadonnées dynamiques */}
      {step === 2 && (
        <div>
          {selectedType?.metadonnees?.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
              {selectedType.metadonnees.map((m, i) => (
                <div key={i}>
                  <label style={labelStyle}>{m.label} {m.requis && '*'}</label>
                  {m.type === 'select' ? (
                    <select value={form.metadonnees[m.cle] || ''} onChange={e => updateMeta(m.cle, e.target.value)} style={inputStyle}>
                      <option value="">— Choisir —</option>
                      {(m.options || []).map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : m.type === 'textarea' ? (
                    <textarea value={form.metadonnees[m.cle] || ''} onChange={e => updateMeta(m.cle, e.target.value)}
                      rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                  ) : m.type === 'date' ? (
                    <input type="date" value={form.metadonnees[m.cle] || ''} onChange={e => updateMeta(m.cle, e.target.value)} style={inputStyle} />
                  ) : m.type === 'number' ? (
                    <input type="number" value={form.metadonnees[m.cle] || ''} onChange={e => updateMeta(m.cle, e.target.value)} style={inputStyle} />
                  ) : (
                    <input value={form.metadonnees[m.cle] || ''} onChange={e => updateMeta(m.cle, e.target.value)}
                      placeholder={m.placeholder || ''} style={inputStyle} />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 40, color: COLORS.textMut }}>
              <Tag size={36} strokeWidth={1.2} style={{ opacity: .3, marginBottom: 8 }} />
              <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.textSec }}>Aucune métadonnée dynamique</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>
                {docTypes.length > 0 ? `Le type "${selectedType?.nom || '—'}" n'a pas de champs supplémentaires.` : 'Configurez les types documentaires dans l\'Administration.'}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Indexation & mots-clés */}
      {step === 3 && (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
          <div style={{ gridColumn: '1/-1' }}>
            <label style={labelStyle}>Mots-clés (séparés par des virgules)</label>
            <input value={form.motsCles} onChange={e => update('motsCles', e.target.value)}
              placeholder="facture, fournisseur, paiement, 2025..." style={inputStyle} />
            {form.motsCles && (
              <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
                {form.motsCles.split(',').map(m => m.trim()).filter(Boolean).map((m, i) => (
                  <span key={i} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 12, background: COLORS.primaryLighter, color: COLORS.primary, fontWeight: 500 }}>{m}</span>
                ))}
              </div>
            )}
          </div>
          <div>
            <label style={labelStyle}>Cote / Référence classement</label>
            <input value={form.cote} onChange={e => update('cote', e.target.value)}
              placeholder="Ex: A-001.02" style={{ ...inputStyle, fontFamily: 'monospace' }} />
          </div>
          <div>
            <label style={labelStyle}>Contenant physique</label>
            <select value={form.contenantId} onChange={e => update('contenantId', e.target.value)} style={inputStyle}>
              <option value="">— Aucun —</option>
              {contenants.filter(c => c.statut === 'ouvert').map(c => <option key={c.id} value={c.id}>📦 {c.label} ({c.id})</option>)}
            </select>
          </div>
          <div style={{ gridColumn: '1/-1', padding: 14, background: COLORS.warningBg, borderRadius: 8, border: '1px solid #fde68a' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.warning, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <AlertTriangle size={14} />Conseil d'indexation
            </div>
            <div style={{ fontSize: 12, color: COLORS.textSec, lineHeight: 1.5 }}>
              Ajoutez des mots-clés pertinents pour faciliter la recherche. Incluez le type de document, le nom de l'interlocuteur, les dates-clés et le sujet principal.
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, paddingTop: 14, borderTop: `1px solid ${COLORS.border}` }}>
        <div>
          {step > 1 && <Btn variant="outline" size="sm" icon={ChevronLeft} onClick={() => setStep(s => s - 1)}>Précédent</Btn>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn variant="outline" size="sm" onClick={onCancel}>Annuler</Btn>
          {step < totalSteps ? (
            <Btn size="sm" onClick={() => { if (step === 1 && !validate()) return; setStep(s => s + 1); }}>
              Suivant <ChevronRight size={14} />
            </Btn>
          ) : (
            <Btn size="sm" icon={Save} onClick={handleSubmit}>
              {isEdit ? 'Enregistrer' : 'Créer le document'}
            </Btn>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   GESTION DES VERSIONS
═══════════════════════════════════════════════════ */
function VersionsPanel({ doc, isMobile, embedded }) {
  const versions = doc.versions || [
    { numero: 1, date: doc.dateDocument || '2025-01-15', auteur: 'Système', action: 'Création initiale', empl: doc.emplacementId },
  ];

  return (
    <div>
      {!embedded && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{doc.titre}</div>
            <div style={{ fontSize: 12, color: COLORS.textMut }}>{doc.id} — {versions.length} version(s)</div>
          </div>
          <Btn icon={Plus} size="sm">Nouvelle version</Btn>
        </div>
      )}
      {embedded && <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}><Btn icon={Plus} size="sm">Nouvelle version</Btn></div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {versions.map((v, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, position: 'relative' }}>
            {/* Timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 24, flexShrink: 0 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: i === 0 ? COLORS.primary : COLORS.borderLight, border: `2px solid ${i === 0 ? COLORS.primary : COLORS.border}`, zIndex: 1 }} />
              {i < versions.length - 1 && <div style={{ width: 2, flex: 1, background: COLORS.borderLight }} />}
            </div>
            {/* Content */}
            <div style={{ flex: 1, paddingBottom: 16 }}>
              <div style={{ background: i === 0 ? COLORS.primaryLighter : COLORS.surfaceAlt, borderRadius: 10, padding: isMobile ? 12 : 14, border: `1px solid ${i === 0 ? COLORS.primary + '30' : COLORS.borderLight}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, flexWrap: 'wrap', gap: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: i === 0 ? COLORS.primary : COLORS.text }}>
                    Version {v.numero} {i === 0 && '(Actuelle)'}
                  </span>
                  <span style={{ fontSize: 11, color: COLORS.textMut }}>{v.date}</span>
                </div>
                <div style={{ fontSize: 12, color: COLORS.textSec, marginBottom: 2 }}>{v.action}</div>
                <div style={{ fontSize: 11, color: COLORS.textMut }}>Par {v.auteur}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   GESTION DES STATUTS
═══════════════════════════════════════════════════ */
function StatusPanel({ doc, isMobile, onClose }) {
  const currentSt = getStatutUI(doc.statut);
  const transitions = STATUS_TRANSITIONS[doc.statut] || [];
  const [selected, setSelected] = useState('');
  const [motif, setMotif] = useState('');

  return (
    <div>
      {/* Current status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: COLORS.surfaceAlt, borderRadius: 10, marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 11, color: COLORS.textMut, marginBottom: 3 }}>Statut actuel</div>
          <Badge label={currentSt.label} color={currentSt.color} bg={currentSt.bg} />
        </div>
        <ChevronRight size={20} color={COLORS.textMut} />
        <div>
          <div style={{ fontSize: 11, color: COLORS.textMut, marginBottom: 3 }}>Nouveau statut</div>
          {selected ? <Badge label={getStatutUI(selected).label} color={getStatutUI(selected).color} bg={getStatutUI(selected).bg} /> :
            <span style={{ fontSize: 12, color: COLORS.textMut }}>— Choisir —</span>}
        </div>
      </div>

      {/* Transitions possibles */}
      {transitions.length > 0 ? (
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Transitions disponibles</label>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 8 }}>
            {transitions.map(t => {
              const st = getStatutUI(t);
              const isSelected = selected === t;
              return (
                <button key={t} onClick={() => setSelected(t)}
                  style={{
                    padding: '10px 14px', borderRadius: 8, cursor: 'pointer',
                    border: `2px solid ${isSelected ? st.color : COLORS.border}`,
                    background: isSelected ? st.bg : '#fff',
                    display: 'flex', alignItems: 'center', gap: 8,
                    fontFamily: FF, fontSize: 13, fontWeight: isSelected ? 700 : 500,
                    color: isSelected ? st.color : COLORS.textSec,
                    transition: 'all .15s',
                  }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: st.color }} />
                  {st.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: 24, background: COLORS.dangerBg, borderRadius: 8, marginBottom: 16 }}>
          <Lock size={24} color={COLORS.danger} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.danger }}>Aucune transition disponible</div>
          <div style={{ fontSize: 12, color: COLORS.textMut, marginTop: 4 }}>Ce document est dans un état final</div>
        </div>
      )}

      {/* Motif */}
      {transitions.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Motif du changement</label>
          <textarea value={motif} onChange={e => setMotif(e.target.value)} rows={3}
            placeholder="Indiquez la raison du changement de statut..."
            style={{ ...inputStyle, resize: 'vertical' }} />
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', borderTop: `1px solid ${COLORS.border}`, paddingTop: 14 }}>
        <Btn variant="outline" size="sm" onClick={onClose}>Annuler</Btn>
        <Btn size="sm" icon={Check} disabled={!selected}
          onClick={() => { console.log('Status change:', doc.id, selected, motif); onClose(); }}>
          Valider le changement
        </Btn>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MICRO-COMPOSANTS
═══════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════
   QR CODE / CODE-BARRES / ÉTIQUETTE
═══════════════════════════════════════════════════ */
function QRLabelPanel({ doc, isMobile }) {
  const [labelFormat, setLabelFormat] = useState('standard');
  const [codeType, setCodeType] = useState('qr'); // qr | barcode
  const [printed, setPrinted] = useState(false);

  /* SVG QR code (stylised placeholder) */
  const QRCodeSVG = ({ value, size = 160 }) => {
    const cells = 21;
    const cellSize = size / cells;
    // Deterministic pattern from string hash
    const hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0; return Math.abs(h); };
    const h = hash(value || 'DOC');
    const grid = [];
    for (let r = 0; r < cells; r++) {
      for (let c = 0; c < cells; c++) {
        // Finder patterns (3 corners)
        const inFinder = (r < 7 && c < 7) || (r < 7 && c >= cells - 7) || (r >= cells - 7 && c < 7);
        const finderBorder = inFinder && (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4) || (r < 7 && (c === 0 || c === 6)) || (c < 7 && (r === 0 || r === 6)));
        const finderCenter = inFinder && r >= 2 && r <= 4 && c >= 2 && c <= 4;
        // Data zone
        const isData = !inFinder && ((h * (r * cells + c + 1)) % 3 !== 0);
        if (finderBorder || finderCenter || isData) {
          grid.push(<rect key={`${r}-${c}`} x={c * cellSize} y={r * cellSize} width={cellSize} height={cellSize} fill={COLORS.primary} rx={cellSize * 0.15} />);
        }
      }
    }
    return <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ background: '#fff', borderRadius: 8 }}>{grid}</svg>;
  };

  /* SVG Barcode (Code 128 style) */
  const BarcodeSVG = ({ value, width = 240, height = 70 }) => {
    const bars = [];
    const hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0; return Math.abs(h); };
    const h = hash(value || 'DOC');
    const numBars = 60;
    const barW = width / numBars;
    for (let i = 0; i < numBars; i++) {
      const thick = (h * (i + 1)) % 5 === 0;
      const show = (h * (i + 1)) % 3 !== 0;
      if (show) {
        bars.push(<rect key={i} x={i * barW} y={0} width={thick ? barW * 1.5 : barW * 0.8} height={height} fill={COLORS.text} />);
      }
    }
    return (
      <div style={{ textAlign: 'center' }}>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>{bars}</svg>
        <div style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 600, letterSpacing: 2, marginTop: 4, color: COLORS.text }}>{value}</div>
      </div>
    );
  };

  const FORMATS = [
    { id: 'standard', label: 'Standard (70×35mm)', w: 280, h: 140 },
    { id: 'small', label: 'Petit (50×25mm)', w: 200, h: 100 },
    { id: 'large', label: 'Grand (100×50mm)', w: 400, h: 200 },
  ];
  const fmt = FORMATS.find(f => f.id === labelFormat);

  return (
    <div>
      {/* Code type toggle */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: COLORS.surfaceAlt, borderRadius: 8, padding: 3 }}>
        {[{ id: 'qr', label: 'QR Code', icon: QrCode }, { id: 'barcode', label: 'Code-barres', icon: ScanLine }].map(t => (
          <button key={t.id} onClick={() => setCodeType(t.id)}
            style={{
              flex: 1, padding: '8px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
              background: codeType === t.id ? '#fff' : 'transparent',
              boxShadow: codeType === t.id ? '0 1px 3px rgba(0,0,0,.1)' : 'none',
              fontWeight: codeType === t.id ? 700 : 500, fontSize: 12, fontFamily: FF,
              color: codeType === t.id ? COLORS.primary : COLORS.textMut,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
            <t.icon size={14} />{t.label}
          </button>
        ))}
      </div>

      {/* Code preview */}
      <div style={{ padding: 20, background: '#fff', border: `2px dashed ${COLORS.border}`, borderRadius: 12, textAlign: 'center', marginBottom: 16 }}>
        {codeType === 'qr' ? (
          <QRCodeSVG value={doc.codeBarres || doc.id} size={isMobile ? 140 : 160} />
        ) : (
          <BarcodeSVG value={doc.codeBarres || doc.id} width={isMobile ? 200 : 240} />
        )}
        <div style={{ fontSize: 11, color: COLORS.textMut, marginTop: 8 }}>
          {doc.codeBarres || doc.id}
        </div>
      </div>

      {/* Label preview */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <label style={labelStyle}>Aperçu étiquette</label>
          <select value={labelFormat} onChange={e => setLabelFormat(e.target.value)}
            style={{ ...inputStyle, width: 'auto', fontSize: 11, padding: '4px 8px' }}>
            {FORMATS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
          </select>
        </div>

        <div style={{
          width: '100%', maxWidth: fmt.w, margin: '0 auto',
          padding: 14, border: `1.5px solid ${COLORS.border}`, borderRadius: 6,
          background: '#fff', display: 'flex', gap: 12, alignItems: 'center',
          boxShadow: '0 1px 4px rgba(0,0,0,.06)',
        }}>
          {/* Mini code */}
          <div style={{ flexShrink: 0 }}>
            {codeType === 'qr'
              ? <QRCodeSVG value={doc.codeBarres || doc.id} size={labelFormat === 'small' ? 40 : 56} />
              : <BarcodeSVG value={doc.codeBarres || doc.id} width={labelFormat === 'small' ? 60 : 80} height={30} />
            }
          </div>
          {/* Label info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: labelFormat === 'small' ? 9 : 11, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {doc.titre}
            </div>
            <div style={{ fontSize: labelFormat === 'small' ? 8 : 10, color: COLORS.textMut, fontFamily: 'monospace' }}>
              {doc.cote || doc.id}
            </div>
            <div style={{ fontSize: labelFormat === 'small' ? 7 : 9, color: COLORS.textMut, marginTop: 2 }}>
              {doc.service} • {doc.dateDocument || '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', borderTop: `1px solid ${COLORS.border}`, paddingTop: 14, flexWrap: 'wrap' }}>
        <Btn variant="outline" size="sm" icon={Download}>
          Télécharger {codeType === 'qr' ? 'QR' : 'code-barres'}
        </Btn>
        <Btn variant="outline" size="sm" icon={Copy}>Copier le code</Btn>
        <Btn size="sm" icon={Printer} onClick={() => setPrinted(true)}>
          {printed ? '✓ Envoyé à l\'imprimante' : 'Imprimer l\'étiquette'}
        </Btn>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SCAN ACCÈS RAPIDE
═══════════════════════════════════════════════════ */
function ScanAccessPanel({ docs, isMobile, onOpenDoc }) {
  const [mode, setMode] = useState('manual'); // manual | camera
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);    // { found: bool, doc }
  const [scanning, setScanning] = useState(false);
  const [history, setHistory] = useState([]);

  const doSearch = (code) => {
    const c = code.trim().toUpperCase();
    if (!c) return;
    const doc = docs.find(d =>
      d.id?.toUpperCase() === c ||
      (d.codeBarres || '').toUpperCase() === c ||
      (d.cote || '').toUpperCase() === c
    );
    const entry = { code: c, found: !!doc, doc, time: new Date().toLocaleTimeString('fr-FR') };
    setResult(entry);
    setHistory(p => [entry, ...p].slice(0, 10));
  };

  const handleKey = (e) => { if (e.key === 'Enter') doSearch(input); };

  return (
    <div>
      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: COLORS.surfaceAlt, borderRadius: 8, padding: 3 }}>
        {[
          { id: 'manual', label: 'Saisie manuelle', icon: Hash },
          { id: 'camera', label: 'Scanner caméra', icon: ScanLine },
        ].map(m => (
          <button key={m.id} onClick={() => { setMode(m.id); setResult(null); }}
            style={{
              flex: 1, padding: '8px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
              background: mode === m.id ? '#fff' : 'transparent',
              boxShadow: mode === m.id ? '0 1px 3px rgba(0,0,0,.1)' : 'none',
              fontWeight: mode === m.id ? 700 : 500, fontSize: 12, fontFamily: FF,
              color: mode === m.id ? COLORS.primary : COLORS.textMut,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
            <m.icon size={14} />{m.label}
          </button>
        ))}
      </div>

      {/* Manual input */}
      {mode === 'manual' && (
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Code-barres, QR, référence ou cote</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
              placeholder="Scanner ou saisir le code..."
              autoFocus
              style={{ ...inputStyle, flex: 1, fontFamily: 'monospace', fontSize: 14, padding: '11px 14px' }} />
            <Btn size="sm" icon={Search} onClick={() => doSearch(input)}>Chercher</Btn>
          </div>
        </div>
      )}

      {/* Camera mode */}
      {mode === 'camera' && (
        <div style={{ textAlign: 'center', padding: 24, background: '#111', borderRadius: 10, marginBottom: 16, position: 'relative' }}>
          {!scanning ? (
            <>
              <ScanLine size={40} color="#fff" style={{ opacity: .4, marginBottom: 10 }} />
              <div style={{ fontSize: 13, color: '#ccc', marginBottom: 12 }}>Activez la caméra pour scanner</div>
              <Btn size="sm" icon={ScanLine} onClick={() => setScanning(true)}>Activer le scanner</Btn>
            </>
          ) : (
            <>
              {/* Simulated camera view */}
              <div style={{ width: '100%', height: 180, background: 'linear-gradient(135deg,#1a1a2e,#16213e)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                {/* Scan crosshair */}
                <div style={{ width: 140, height: 140, border: '2px solid rgba(255,255,255,.3)', borderRadius: 12, position: 'relative' }}>
                  <div style={{ position: 'absolute', top: -1, left: -1, width: 20, height: 20, borderTop: `3px solid ${COLORS.primary}`, borderLeft: `3px solid ${COLORS.primary}`, borderRadius: '4px 0 0 0' }} />
                  <div style={{ position: 'absolute', top: -1, right: -1, width: 20, height: 20, borderTop: `3px solid ${COLORS.primary}`, borderRight: `3px solid ${COLORS.primary}`, borderRadius: '0 4px 0 0' }} />
                  <div style={{ position: 'absolute', bottom: -1, left: -1, width: 20, height: 20, borderBottom: `3px solid ${COLORS.primary}`, borderLeft: `3px solid ${COLORS.primary}`, borderRadius: '0 0 0 4px' }} />
                  <div style={{ position: 'absolute', bottom: -1, right: -1, width: 20, height: 20, borderBottom: `3px solid ${COLORS.primary}`, borderRight: `3px solid ${COLORS.primary}`, borderRadius: '0 0 4px 0' }} />
                  {/* Scanning line animation */}
                  <div style={{ position: 'absolute', top: '50%', left: 8, right: 8, height: 2, background: `linear-gradient(90deg, transparent, ${COLORS.primary}, transparent)`, animation: 'pulse 1.5s infinite' }} />
                </div>
              </div>
              <div style={{ marginTop: 10, display: 'flex', gap: 8, justifyContent: 'center' }}>
                <Btn variant="outline" size="sm" onClick={() => setScanning(false)}>Arrêter</Btn>
                <Btn size="sm" icon={Zap} onClick={() => {
                  setScanning(false);
                  const randomDoc = docs[Math.floor(Math.random() * docs.length)];
                  if (randomDoc) { setInput(randomDoc.id); doSearch(randomDoc.id); }
                }}>Simuler un scan</Btn>
              </div>
            </>
          )}
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{
          padding: 14, borderRadius: 10, marginBottom: 14,
          background: result.found ? COLORS.successBg : COLORS.dangerBg,
          border: `1.5px solid ${result.found ? COLORS.success + '40' : COLORS.danger + '40'}`,
        }}>
          {result.found ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <CheckCircle2 size={18} color={COLORS.success} />
                <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.success }}>Document trouvé</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{result.doc.titre}</div>
              <div style={{ fontSize: 12, color: COLORS.textSec, marginBottom: 8 }}>
                {result.doc.id} • {result.doc.service} • {result.doc.cote || '—'}
              </div>
              <Btn size="sm" icon={Eye} onClick={() => onOpenDoc(result.doc)}>Ouvrir la fiche</Btn>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={18} color={COLORS.danger} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.danger }}>Aucun document trouvé</div>
                <div style={{ fontSize: 12, color: COLORS.textSec }}>Code « {result.code} » non reconnu</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Scan history */}
      {history.length > 0 && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.textSec, marginBottom: 6 }}>
            Historique des scans ({history.length})
          </div>
          <div style={{ maxHeight: 160, overflowY: 'auto' }}>
            {history.map((h, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderBottom: `1px solid ${COLORS.borderLight}`, fontSize: 12 }}>
                {h.found ? <CheckCircle2 size={13} color={COLORS.success} /> : <X size={13} color={COLORS.danger} />}
                <span style={{ fontFamily: 'monospace', fontWeight: 600, color: h.found ? COLORS.primary : COLORS.textMut }}>{h.code}</span>
                <span style={{ flex: 1 }} />
                {h.found && (
                  <button onClick={() => onOpenDoc(h.doc)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.primaryLight, fontSize: 11, fontWeight: 600, fontFamily: FF }}>
                    Ouvrir →
                  </button>
                )}
                <span style={{ color: COLORS.textMut, fontSize: 10 }}>{h.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   HISTORIQUE COMPLET DES MODIFICATIONS
═══════════════════════════════════════════════════ */
function AuditHistoryPanel({ doc, isMobile }) {
  const [filterType, setFilterType] = useState('all');

  // Generate realistic audit trail for this document
  const trail = useMemo(() => {
    const base = [
      { date: '2025-02-28 15:30', type: 'modification', user: 'M. Rakoto', field: 'statut', oldVal: 'en_traitement', newVal: 'disponible', detail: 'Changement de statut après traitement' },
      { date: '2025-02-28 14:20', type: 'consultation', user: 'R. Andria', field: null, oldVal: null, newVal: null, detail: 'Consultation de la fiche documentaire' },
      { date: '2025-02-27 10:45', type: 'modification', user: 'Admin Razafin.', field: 'emplacementId', oldVal: 'Dépôt courrier (A-001)', newVal: 'Archives DG (S-101)', detail: 'Déplacement physique du document' },
      { date: '2025-02-26 16:00', type: 'modification', user: 'M. Rakoto', field: 'motsCles', oldVal: '["contrat"]', newVal: '["contrat","prestation","2025"]', detail: 'Ajout de mots-clés d\'indexation' },
      { date: '2025-02-25 09:15', type: 'modification', user: 'S. Nirina', field: 'description', oldVal: '(vide)', newVal: 'Contrat de prestation signé...', detail: 'Ajout de la description' },
      { date: '2025-02-24 11:00', type: 'modification', user: 'Admin Razafin.', field: 'confidentialite', oldVal: 'conf-interne', newVal: 'conf-confidentiel', detail: 'Reclassification de confidentialité' },
      { date: '2025-02-20 14:30', type: 'version', user: 'M. Rakoto', field: 'version', oldVal: 'v1', newVal: 'v2', detail: 'Nouvelle version physique ajoutée (2 pages)' },
      { date: '2025-02-15 08:00', type: 'impression', user: 'S. Nirina', field: null, oldVal: null, newVal: null, detail: 'Impression d\'étiquette code-barres' },
      { date: '2025-02-10 09:30', type: 'creation', user: 'S. Nirina', field: null, oldVal: null, newVal: null, detail: `Création du document — ${doc.titre}` },
    ];
    return base;
  }, [doc]);

  const AUDIT_TYPES = [
    { id: 'all',           label: 'Tous' },
    { id: 'creation',      label: 'Création',      color: COLORS.success, bg: COLORS.successBg, icon: Plus },
    { id: 'modification',  label: 'Modification',  color: COLORS.info,    bg: COLORS.infoBg,    icon: Edit3 },
    { id: 'consultation',  label: 'Consultation',  color: COLORS.purple,  bg: COLORS.purpleBg,  icon: Eye },
    { id: 'version',       label: 'Version',       color: COLORS.warning, bg: COLORS.warningBg, icon: Layers },
    { id: 'impression',    label: 'Impression',    color: COLORS.accent,  bg: COLORS.accentLight, icon: Printer },
  ];

  const filtered = filterType === 'all' ? trail : trail.filter(t => t.type === filterType);

  return (
    <div>
      {/* Doc header */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: 12, background: COLORS.surfaceAlt, borderRadius: 10, marginBottom: 16 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: COLORS.primaryLighter, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <FileText size={18} color={COLORS.primary} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.titre}</div>
          <div style={{ fontSize: 11, color: COLORS.textMut, fontFamily: 'monospace' }}>{doc.id}</div>
        </div>
        <Badge label={`${trail.length} entrées`} color={COLORS.info} bg={COLORS.infoBg} />
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 14, overflowX: 'auto', paddingBottom: 2 }}>
        {AUDIT_TYPES.map(t => (
          <button key={t.id} onClick={() => setFilterType(t.id)}
            style={{
              padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, fontFamily: FF,
              background: filterType === t.id ? COLORS.primary : '#fff',
              color: filterType === t.id ? '#fff' : COLORS.textSec,
              border: `1.5px solid ${filterType === t.id ? COLORS.primary : COLORS.border}`,
              cursor: 'pointer', whiteSpace: 'nowrap',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div style={{ maxHeight: isMobile ? 380 : 450, overflowY: 'auto' }}>
        {filtered.map((entry, i) => {
          const at = AUDIT_TYPES.find(t => t.id === entry.type) || AUDIT_TYPES[1];
          const Icon = at.icon || Edit3;
          return (
            <div key={i} style={{ display: 'flex', gap: isMobile ? 10 : 12 }}>
              {/* Dot + line */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 28, flexShrink: 0 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, background: at.bg, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', zIndex: 1,
                  border: i === 0 ? `2px solid ${at.color}` : 'none',
                }}>
                  <Icon size={13} color={at.color} />
                </div>
                {i < filtered.length - 1 && <div style={{ width: 2, flex: 1, background: COLORS.borderLight, minHeight: 6 }} />}
              </div>

              {/* Content */}
              <div style={{ flex: 1, paddingBottom: 12 }}>
                <div style={{
                  padding: isMobile ? 10 : 12, borderRadius: 8,
                  background: i === 0 ? at.bg : '#fff',
                  border: `1px solid ${i === 0 ? at.color + '30' : COLORS.borderLight}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, flexWrap: 'wrap', gap: 4 }}>
                    <Badge label={at.label} color={at.color} bg={i === 0 ? '#fff' : at.bg} />
                    <span style={{ fontSize: 10, color: COLORS.textMut }}>{entry.date}</span>
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.textSec }}>{entry.detail}</div>

                  {/* Diff for modifications */}
                  {entry.field && entry.oldVal && (
                    <div style={{ marginTop: 8, padding: 8, background: COLORS.surfaceAlt, borderRadius: 6, fontSize: 11 }}>
                      <div style={{ color: COLORS.textMut, marginBottom: 4 }}>
                        Champ : <strong style={{ color: COLORS.textSec }}>{entry.field}</strong>
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ padding: '2px 8px', background: COLORS.dangerBg, color: COLORS.danger, borderRadius: 4, fontFamily: 'monospace', textDecoration: 'line-through', maxWidth: '40%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {entry.oldVal}
                        </span>
                        <ArrowUpDown size={12} color={COLORS.textMut} style={{ transform: 'rotate(90deg)' }} />
                        <span style={{ padding: '2px 8px', background: COLORS.successBg, color: COLORS.success, borderRadius: 4, fontFamily: 'monospace', maxWidth: '40%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {entry.newVal}
                        </span>
                      </div>
                    </div>
                  )}

                  <div style={{ fontSize: 11, color: COLORS.textMut, marginTop: 6 }}>
                    Par <strong>{entry.user}</strong>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Export */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: `1px solid ${COLORS.border}`, paddingTop: 12, marginTop: 8 }}>
        <Btn variant="outline" size="sm" icon={Download}>Exporter l'historique</Btn>
      </div>
    </div>
  );
}

function Field({ label, value, mono, accent, large }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: COLORS.textMut, marginBottom: 3 }}>{label}</div>
      <div style={{
        fontSize: large ? 16 : 14,
        fontWeight: large ? 700 : mono ? 700 : 500,
        fontFamily: mono ? 'monospace' : undefined,
        color: accent ? COLORS.primaryLight : undefined,
        lineHeight: 1.4,
      }}>
        {value || '—'}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   INLINE CONTENANT DETAIL (from DocDetail click)
   Shows contenant info + documents inside it
═══════════════════════════════════════════════════════════════ */
function InlineContDetail({ cont, contenants, documents, emplacements, getEmpl, isMobile }) {
  const emp = getEmpl?.(cont.emplacementId);
  const children = contenants.filter(c => c.parentId === cont.id);
  const parent = contenants.find(c => c.id === cont.parentId);
  const assocDocs = documents.filter(d => d.contenantId === cont.id);
  const pct = cont.capacite > 0 ? Math.round((cont.contenu / cont.capacite) * 100) : 0;
  const fillC = pct >= 90 ? '#ef4444' : pct >= 70 ? '#f59e0b' : pct >= 40 ? '#3b82f6' : '#22c55e';
  const [tab, setTab] = useState('docs');

  /* Build full path */
  const pathParts = [cont.label];
  let pid = cont.parentId;
  while (pid) { const pc = contenants.find(c => c.id === pid); if (pc) { pathParts.unshift(pc.label); pid = pc.parentId; } else break; }

  const CONT_ICONS = { dossier: '📁', chemise: '📂', boite: '📦', carton: '🗃️', classeur: '📒', lot: '📚' };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 22 }}>
          {CONT_ICONS[cont.type] || '📦'}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 700 }}>{cont.label}</div>
          <div style={{ fontSize: 11, color: COLORS.textMut, display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{cont.id}</span>
            <Badge label={cont.type} color="#d97706" bg="#fef3c7" />
            <Badge
              label={cont.statut === 'scelle' ? '🔒 Scellé' : cont.statut === 'ferme' ? '🔐 Fermé' : cont.statut === 'transit' ? '🚚 Transit' : '📦 Ouvert'}
              color={cont.statut === 'scelle' ? '#dc2626' : cont.statut === 'ferme' ? '#d97706' : '#16a34a'}
              bg={cont.statut === 'scelle' ? '#fef2f2' : cont.statut === 'ferme' ? '#fffbeb' : '#f0fdf4'}
            />
          </div>
        </div>
      </div>

      {/* Path */}
      {pathParts.length > 1 && (
        <div style={{ fontSize: 11, color: COLORS.textMut, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
          <Layers size={11} />Hiérarchie : {pathParts.join(' › ')}
        </div>
      )}

      {/* Fill gauge */}
      <div style={{ padding: 12, background: fillC + '10', borderRadius: 10, marginBottom: 14, border: `1px solid ${fillC}25` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: 12, fontWeight: 600 }}>Taux de remplissage</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: fillC }}>{pct}%</span>
        </div>
        <div style={{ height: 8, background: '#fff', borderRadius: 4, overflow: 'hidden', marginBottom: 3 }}>
          <div style={{ width: `${pct}%`, height: '100%', background: fillC, borderRadius: 4, transition: 'width .5s' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: COLORS.textSec }}>
          <span>{cont.contenu} / {cont.capacite}</span>
          <span>{cont.capacite - cont.contenu} places restantes</span>
        </div>
      </div>

      {/* Info row */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 8, marginBottom: 14 }}>
        <div style={{ padding: 10, background: COLORS.surfaceAlt, borderRadius: 8 }}>
          <div style={{ fontSize: 10, color: COLORS.textMut, marginBottom: 2 }}>Emplacement</div>
          <div style={{ fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={11} color={COLORS.primaryLight} />
            {emp ? `${emp.nom} › ${emp.salle}` : '—'}
          </div>
        </div>
        <div style={{ padding: 10, background: COLORS.surfaceAlt, borderRadius: 8 }}>
          <div style={{ fontSize: 10, color: COLORS.textMut, marginBottom: 2 }}>Parent</div>
          <div style={{ fontSize: 12, fontWeight: 600 }}>{parent ? `${CONT_ICONS[parent.type] || '📦'} ${parent.label}` : '— Racine —'}</div>
        </div>
        <div style={{ padding: 10, background: COLORS.surfaceAlt, borderRadius: 8 }}>
          <div style={{ fontSize: 10, color: COLORS.textMut, marginBottom: 2 }}>Code-barres</div>
          <div style={{ fontSize: 12, fontWeight: 600, fontFamily: 'monospace' }}>{cont.codeBarres || cont.id}</div>
        </div>
        <div style={{ padding: 10, background: COLORS.surfaceAlt, borderRadius: 8 }}>
          <div style={{ fontSize: 10, color: COLORS.textMut, marginBottom: 2 }}>Créé le</div>
          <div style={{ fontSize: 12, fontWeight: 600 }}>{cont.dateCreation || '—'}</div>
        </div>
      </div>

      {/* Tabs: Documents / Sous-contenants */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 12, borderBottom: `1.5px solid ${COLORS.border}` }}>
        {[
          { id: 'docs', label: `Documents (${assocDocs.length})` },
          { id: 'children', label: `Sous-contenants (${children.length})` },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '7px 14px', border: 'none', background: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: tab === t.id ? 700 : 500, fontFamily: FF,
            color: tab === t.id ? COLORS.primary : COLORS.textMut,
            borderBottom: tab === t.id ? `2px solid ${COLORS.primary}` : '2px solid transparent',
            marginBottom: -1.5,
          }}>{t.label}</button>
        ))}
      </div>

      {/* Tab: Documents */}
      {tab === 'docs' && (
        <div style={{ maxHeight: isMobile ? 240 : 300, overflowY: 'auto' }}>
          {assocDocs.length === 0 ? (
            <div style={{ padding: 28, textAlign: 'center', color: COLORS.textMut }}>
              <FileText size={24} strokeWidth={1.2} style={{ opacity: .3, marginBottom: 6 }} />
              <div style={{ fontSize: 12 }}>Aucun document dans ce contenant</div>
            </div>
          ) : assocDocs.map(d => {
            const dst = getStatutUI(d.statut);
            return (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderBottom: `1px solid ${COLORS.borderLight}` }}>
                <FileText size={14} color={COLORS.primaryLight} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.titre}</div>
                  <div style={{ fontSize: 10, color: COLORS.textMut }}>
                    <span style={{ fontFamily: 'monospace' }}>{d.id}</span>
                    {d.cote && <span> • {d.cote}</span>}
                    {d.service && <span> • {d.service}</span>}
                  </div>
                </div>
                {dst && <Badge label={dst.label} color={dst.color} bg={dst.bg} />}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: Sous-contenants */}
      {tab === 'children' && (
        <div style={{ maxHeight: isMobile ? 240 : 300, overflowY: 'auto' }}>
          {children.length === 0 ? (
            <div style={{ padding: 28, textAlign: 'center', color: COLORS.textMut }}>
              <Package size={24} strokeWidth={1.2} style={{ opacity: .3, marginBottom: 6 }} />
              <div style={{ fontSize: 12 }}>Aucun sous-contenant</div>
            </div>
          ) : children.map(ch => {
            const chPct = ch.capacite > 0 ? Math.round((ch.contenu / ch.capacite) * 100) : 0;
            const chDocs = documents.filter(d => d.contenantId === ch.id);
            return (
              <div key={ch.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderBottom: `1px solid ${COLORS.borderLight}` }}>
                <span style={{ fontSize: 16 }}>{CONT_ICONS[ch.type] || '📦'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{ch.label}</div>
                  <div style={{ fontSize: 10, color: COLORS.textMut }}>{ch.id} • {chDocs.length} doc{chDocs.length > 1 ? 's' : ''}</div>
                </div>
                <div style={{ width: 40 }}>
                  <div style={{ height: 4, background: '#f1f5f9', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${chPct}%`, height: '100%', background: chPct >= 90 ? '#ef4444' : chPct >= 70 ? '#f59e0b' : '#22c55e', borderRadius: 2 }} />
                  </div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 600, color: COLORS.textSec }}>{chPct}%</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}