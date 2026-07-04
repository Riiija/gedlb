/* ═══════════════════════════════════════════════════════════════
   SOFT LIBRARY — Mouvements & Plan de classement
   
   User stories :
   ✓ Déplacer un document dans une autre localisation
   ✓ Visualiser l'arborescence complète du classement
   ✓ Modifier la structure du plan de classement (admin)
   ✓ Affecter plusieurs documents à un même emplacement
   ✓ Voir l'historique des mouvements d'un document
   ✓ Responsive mobile / tablet / desktop
═══════════════════════════════════════════════════════════════ */
import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  Move, ArrowRight, ArrowUpDown, History, FileText, MapPin,
  ChevronDown, ChevronRight, ChevronLeft, Plus, Search, Eye,
  Edit3, Trash2, Save, X, Check, AlertTriangle, Clock,
  Filter, Download, RotateCcw, Layers, Building2, Archive,
  Package, Target, ScanLine, CheckCircle2, XCircle, Info,
  FolderTree, Grip, GripVertical, CornerDownRight, Copy,
  Warehouse, DoorOpen, ChevronsUpDown, Rows3, Hash,
  Users, Calendar, Tag, RefreshCw, List, LayoutGrid,
  ChevronUp, FolderPlus, FolderMinus, Pencil, Unlink,
  Link2, Box, Navigation, Zap, SquareStack,
} from 'lucide-react';
import { COLORS, FONT_FAMILY, getStatutUI, getConfUI } from '../theme';
import { Badge, Btn, Modal, Pagination, ProgressBar } from '../components/ui';

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

const MOVE_TYPES = [
  { id: 'deplacement',  label: 'Déplacement',         icon: Move,        color: COLORS.info,    bg: COLORS.infoBg },
  { id: 'transfert',    label: 'Transfert archives',   icon: Archive,     color: COLORS.purple,  bg: COLORS.purpleBg },
  { id: 'pret',         label: 'Prêt / Sortie',        icon: ArrowUpDown, color: COLORS.warning, bg: COLORS.warningBg },
  { id: 'retour',       label: 'Retour',               icon: RotateCcw,   color: COLORS.success, bg: COLORS.successBg },
  { id: 'affectation',  label: 'Affectation initiale', icon: Target,      color: COLORS.accent,  bg: COLORS.accentLight },
  { id: 'elimination',  label: 'Élimination',          icon: Trash2,      color: COLORS.danger,  bg: COLORS.dangerBg },
];

const HIERARCHY_LEVELS = [
  { id: 'site',      label: 'Site',      icon: Building2,     color: COLORS.primary },
  { id: 'batiment',  label: 'Bâtiment',  icon: Warehouse,     color: COLORS.info },
  { id: 'etage',     label: 'Étage',     icon: Layers,        color: COLORS.purple },
  { id: 'salle',     label: 'Salle',     icon: DoorOpen,      color: COLORS.warning },
  { id: 'rayonnage', label: 'Rayonnage', icon: Rows3,         color: COLORS.accent },
  { id: 'niveau',    label: 'Niveau',    icon: ChevronsUpDown,color: COLORS.success },
  { id: 'position',  label: 'Position',  icon: Target,        color: COLORS.indigo },
];

/* ═══════════════════════════════════════════════════
   TABS
═══════════════════════════════════════════════════ */
const TABS = [
  { id: 'move',      label: 'Déplacer',     icon: Move,       desc: 'Déplacer un ou plusieurs documents' },
  { id: 'tree',      label: 'Classement',   icon: FolderTree, desc: 'Arborescence du plan de classement' },
  { id: 'bulk',      label: 'Affectation',  icon: SquareStack, desc: 'Affecter en masse' },
  { id: 'history',   label: 'Historique',   icon: History,    desc: 'Journal des mouvements' },
  { id: 'structure', label: 'Structure',    icon: Edit3,      desc: 'Modifier le plan (admin)' },
];

/* ═══════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
═══════════════════════════════════════════════════ */
export default function LibMouvements({
  documents = [],
  emplacements = [],
  docTypes = [],
  auditLogs = [],
}) {
  const docs = documents;
  const empls = emplacements;
  const history = auditLogs.length > 0 ? auditLogs : DEMO_HISTORY;

  const [tab, setTab]         = useState('move');
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const ck = () => setIsMobile(window.innerWidth < 768);
    ck();
    window.addEventListener('resize', ck);
    return () => window.removeEventListener('resize', ck);
  }, []);

  /* ── Stats ── */
  const stats = useMemo(() => {
    const today = history.filter(h => h.date === '2025-02-28');
    const pending = docs.filter(d => d.statut === 'en_transfert' || d.statut === 'prete');
    return {
      todayMoves: today.length,
      pending: pending.length,
      totalHistory: history.length,
      locations: empls.length,
    };
  }, [docs, empls, history]);

  return (
    <div>
      {/* ── HEADER ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: isMobile ? 20 : 24, fontWeight: 700 }}>
            Mouvements & Classement
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: COLORS.textMut }}>
            Déplacements, affectations et plan de classement
          </p>
        </div>
        {!isMobile && (
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn icon={Download} variant="outline" size="sm">Exporter</Btn>
            <Btn icon={Move} size="sm" onClick={() => setTab('move')}>Nouveau déplacement</Btn>
          </div>
        )}
      </div>

      {/* ── KPI ── */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: isMobile ? 8 : 12, marginBottom: 20 }}>
        {[
          { icon: Move, label: "Mouvements aujourd'hui", value: stats.todayMoves, color: COLORS.primary, bg: COLORS.primaryLighter },
          { icon: Clock, label: 'En attente', value: stats.pending, color: COLORS.warning, bg: COLORS.warningBg },
          { icon: History, label: 'Total historique', value: stats.totalHistory, color: COLORS.info, bg: COLORS.infoBg },
          { icon: MapPin, label: 'Emplacements', value: stats.locations, color: COLORS.success, bg: COLORS.successBg },
        ].map((k, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 10, padding: isMobile ? '12px 14px' : '14px 18px', border: `1px solid ${COLORS.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 11, color: COLORS.textMut, marginBottom: 3, fontWeight: 500 }}>{k.label}</div>
                <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 700 }}>{k.value}</div>
              </div>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <k.icon size={16} color={k.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── TABS ── */}
      <div style={{ display: 'flex', gap: 3, marginBottom: 16, overflowX: 'auto', paddingBottom: 2, borderBottom: `2px solid ${COLORS.border}` }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              padding: isMobile ? '8px 12px' : '9px 18px',
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: tab === t.id ? 700 : 500,
              color: tab === t.id ? COLORS.primary : COLORS.textMut,
              borderBottom: tab === t.id ? `2.5px solid ${COLORS.primary}` : '2.5px solid transparent',
              marginBottom: -2, fontFamily: FF, display: 'flex', alignItems: 'center',
              gap: 6, whiteSpace: 'nowrap', transition: 'all .15s',
            }}>
            <t.icon size={15} />
            {t.label}
          </button>
        ))}
      </div>

      {/* ── TAB CONTENT ── */}
      {tab === 'move' && <MoveDocumentTab docs={docs} empls={empls} isMobile={isMobile} />}
      {tab === 'tree' && <ClassificationTreeTab empls={empls} docs={docs} isMobile={isMobile} />}
      {tab === 'bulk' && <BulkAssignTab docs={docs} empls={empls} isMobile={isMobile} />}
      {tab === 'history' && <HistoryTab history={history} docs={docs} empls={empls} isMobile={isMobile} />}
      {tab === 'structure' && <StructureEditorTab empls={empls} isMobile={isMobile} />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB 1 — DÉPLACER UN DOCUMENT
   US: "je peux déplacer un document dans une autre localisation"
═══════════════════════════════════════════════════════════════ */
function MoveDocumentTab({ docs, empls, isMobile }) {
  const [step, setStep]         = useState(1); // 1: select docs, 2: choose dest, 3: confirm
  const [selected, setSelected] = useState([]);
  const [search, setSearch]     = useState('');
  const [dest, setDest]         = useState('');
  const [moveType, setMoveType] = useState('deplacement');
  const [motif, setMotif]       = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const filtered = useMemo(() => {
    if (!search) return docs;
    const s = search.toLowerCase();
    return docs.filter(d =>
      d.titre?.toLowerCase().includes(s) ||
      d.id?.toLowerCase().includes(s) ||
      (d.cote || '').toLowerCase().includes(s)
    );
  }, [docs, search]);

  const toggleDoc = (id) => {
    setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  };
  const toggleAll = () => {
    if (selected.length === filtered.length) setSelected([]);
    else setSelected(filtered.map(d => d.id));
  };

  const selectedDocs = docs.filter(d => selected.includes(d.id));
  const destEmpl = empls.find(e => e.id === dest);

  const handleConfirm = () => {
    console.log('Move:', { documents: selected, destination: dest, moveType, motif });
    setConfirmed(true);
  };

  const reset = () => {
    setStep(1); setSelected([]); setSearch(''); setDest('');
    setMoveType('deplacement'); setMotif(''); setConfirmed(false);
  };

  if (confirmed) {
    return (
      <div style={{ textAlign: 'center', padding: isMobile ? 32 : 48 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: COLORS.successBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: `2px solid ${COLORS.success}` }}>
          <CheckCircle2 size={32} color={COLORS.success} />
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Déplacement enregistré</div>
        <div style={{ fontSize: 13, color: COLORS.textSec, marginBottom: 4 }}>
          {selected.length} document{selected.length > 1 ? 's' : ''} déplacé{selected.length > 1 ? 's' : ''} vers
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.primary, marginBottom: 20 }}>
          {destEmpl?.nom || dest}
        </div>
        <Btn icon={RotateCcw} onClick={reset}>Nouveau déplacement</Btn>
      </div>
    );
  }

  return (
    <div>
      {/* Stepper */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
        {[
          { n: 1, label: 'Sélectionner' },
          { n: 2, label: 'Destination' },
          { n: 3, label: 'Confirmer' },
        ].map((s, i) => (
          <React.Fragment key={s.n}>
            <button onClick={() => { if (s.n < step || (s.n === 2 && selected.length > 0) || (s.n === 3 && dest)) setStep(s.n); }}
              style={{
                flex: 1, padding: isMobile ? '8px 6px' : '10px 12px', borderRadius: 8,
                background: step === s.n ? COLORS.primary : step > s.n ? COLORS.primaryLighter : COLORS.surfaceAlt,
                color: step === s.n ? '#fff' : step > s.n ? COLORS.primary : COLORS.textMut,
                border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: FF,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
              <span style={{
                width: 22, height: 22, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700,
                background: step === s.n ? 'rgba(255,255,255,.2)' : step > s.n ? COLORS.primary : COLORS.borderLight,
                color: step === s.n || step > s.n ? '#fff' : COLORS.textMut,
              }}>{step > s.n ? '✓' : s.n}</span>
              {!isMobile && s.label}
            </button>
            {i < 2 && <div style={{ width: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronRight size={14} color={COLORS.textMut} />
            </div>}
          </React.Fragment>
        ))}
      </div>

      {/* STEP 1: Select documents */}
      {step === 1 && (
        <div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: isMobile ? '100%' : 220, maxWidth: isMobile ? '100%' : 360 }}>
              <Search size={15} color={COLORS.textMut} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher par titre, réf, cote..."
                style={{ ...inputStyle, paddingLeft: 36, background: COLORS.surfaceAlt }} />
            </div>
            <Badge label={`${selected.length} sélectionné${selected.length > 1 ? 's' : ''}`}
              color={selected.length > 0 ? COLORS.primary : COLORS.textMut}
              bg={selected.length > 0 ? COLORS.primaryLighter : COLORS.borderLight} />
          </div>

          <div style={cardStyle}>
            {/* Select all header */}
            <div style={{ padding: '10px 14px', borderBottom: `1px solid ${COLORS.border}`, background: COLORS.surfaceAlt, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Checkbox checked={selected.length === filtered.length && filtered.length > 0}
                indeterminate={selected.length > 0 && selected.length < filtered.length}
                onChange={toggleAll} />
              <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.textSec }}>
                {selected.length > 0 ? `${selected.length} / ${filtered.length}` : 'Tout sélectionner'}
              </span>
            </div>

            <div style={{ maxHeight: isMobile ? 360 : 420, overflowY: 'auto' }}>
              {filtered.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: COLORS.textMut }}>
                  <FileText size={32} strokeWidth={1.2} style={{ opacity: .3, marginBottom: 6 }} />
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Aucun document trouvé</div>
                </div>
              ) : filtered.map(d => {
                const isSel = selected.includes(d.id);
                const st = getStatutUI(d.statut);
                const empl = empls.find(e => e.id === d.emplacementId);
                return (
                  <div key={d.id} onClick={() => toggleDoc(d.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 12,
                      padding: isMobile ? '10px 12px' : '11px 14px',
                      borderBottom: `1px solid ${COLORS.borderLight}`,
                      cursor: 'pointer', background: isSel ? COLORS.primaryLighter + '40' : 'transparent',
                      transition: 'background .1s',
                    }}
                    onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = '#fafbfc'; }}
                    onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = 'transparent'; }}>
                    <Checkbox checked={isSel} onChange={() => toggleDoc(d.id)} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {d.titre}
                      </div>
                      <div style={{ fontSize: 11, color: COLORS.textMut, display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 2 }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{d.id}</span>
                        {!isMobile && <span>{d.service}</span>}
                        {empl && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                          <MapPin size={10} />{empl.nom}
                        </span>}
                      </div>
                    </div>
                    <Badge label={st.label} color={st.color} bg={st.bg} />
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
            <Btn size="sm" disabled={selected.length === 0} onClick={() => setStep(2)}>
              Suivant — Choisir la destination <ChevronRight size={14} />
            </Btn>
          </div>
        </div>
      )}

      {/* STEP 2: Choose destination */}
      {step === 2 && (
        <div>
          {/* Selected summary */}
          <div style={{ padding: 12, background: COLORS.primaryLighter, borderRadius: 10, marginBottom: 16, border: `1px solid ${COLORS.primary}20` }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.primary, marginBottom: 4 }}>
              {selected.length} document{selected.length > 1 ? 's' : ''} sélectionné{selected.length > 1 ? 's' : ''}
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {selectedDocs.slice(0, 5).map(d => (
                <span key={d.id} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: '#fff', color: COLORS.textSec, fontFamily: 'monospace' }}>
                  {d.id}
                </span>
              ))}
              {selectedDocs.length > 5 && <span style={{ fontSize: 11, color: COLORS.textMut }}>+{selectedDocs.length - 5} autres</span>}
            </div>
          </div>

          {/* Move type */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Type de mouvement</label>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3,1fr)', gap: 8 }}>
              {MOVE_TYPES.filter(t => t.id !== 'elimination').map(mt => {
                const isSel = moveType === mt.id;
                return (
                  <button key={mt.id} onClick={() => setMoveType(mt.id)}
                    style={{
                      padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
                      border: `2px solid ${isSel ? mt.color : COLORS.border}`,
                      background: isSel ? mt.bg : '#fff',
                      display: 'flex', alignItems: 'center', gap: 8,
                      fontFamily: FF, fontSize: 12, fontWeight: isSel ? 700 : 500,
                      color: isSel ? mt.color : COLORS.textSec, transition: 'all .15s',
                    }}>
                    <mt.icon size={16} />{mt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Destination */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Emplacement de destination *</label>
            <EmplacementPicker empls={empls} value={dest} onChange={setDest} isMobile={isMobile} />
          </div>

          {/* Motif */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Motif du déplacement</label>
            <textarea value={motif} onChange={e => setMotif(e.target.value)} rows={2}
              placeholder="Raison du déplacement..." style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
            <Btn variant="outline" size="sm" icon={ChevronLeft} onClick={() => setStep(1)}>Précédent</Btn>
            <Btn size="sm" disabled={!dest} onClick={() => setStep(3)}>
              Suivant — Confirmer <ChevronRight size={14} />
            </Btn>
          </div>
        </div>
      )}

      {/* STEP 3: Confirm */}
      {step === 3 && (
        <div>
          <div style={{ ...cardStyle, padding: isMobile ? 14 : 20, marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Récapitulatif du mouvement</div>

            {/* Move flow visual */}
            <div style={{ display: 'flex', alignItems: isMobile ? 'stretch' : 'center', gap: isMobile ? 10 : 16, marginBottom: 20, flexDirection: isMobile ? 'column' : 'row' }}>
              {/* Source */}
              <div style={{ flex: 1, padding: 14, background: COLORS.surfaceAlt, borderRadius: 10, border: `1px solid ${COLORS.borderLight}` }}>
                <div style={{ fontSize: 11, color: COLORS.textMut, marginBottom: 4 }}>Origine(s)</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>
                  {[...new Set(selectedDocs.map(d => {
                    const e = empls.find(em => em.id === d.emplacementId);
                    return e?.nom || 'Non assigné';
                  }))].join(', ')}
                </div>
              </div>

              {/* Arrow */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: COLORS.primaryLighter, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isMobile ? <ChevronDown size={20} color={COLORS.primary} /> : <ArrowRight size={20} color={COLORS.primary} />}
                </div>
              </div>

              {/* Destination */}
              <div style={{ flex: 1, padding: 14, background: COLORS.successBg, borderRadius: 10, border: `1px solid ${COLORS.success}30` }}>
                <div style={{ fontSize: 11, color: COLORS.textMut, marginBottom: 4 }}>Destination</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.success }}>
                  {destEmpl?.nom || dest}
                </div>
                {destEmpl && (
                  <div style={{ fontSize: 11, color: COLORS.textSec, marginTop: 2 }}>
                    {destEmpl.site} › {destEmpl.batiment} › {destEmpl.salle}
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
              <InfoBlock label="Type" value={MOVE_TYPES.find(m => m.id === moveType)?.label} />
              <InfoBlock label="Documents" value={`${selected.length} document${selected.length > 1 ? 's' : ''}`} />
              <InfoBlock label="Date" value={new Date().toLocaleDateString('fr-FR')} />
            </div>

            {motif && <InfoBlock label="Motif" value={motif} />}

            {/* Documents list */}
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.textSec, marginBottom: 8 }}>Documents concernés</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 200, overflowY: 'auto' }}>
                {selectedDocs.map(d => (
                  <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: COLORS.surfaceAlt, borderRadius: 6, fontSize: 12 }}>
                    <FileText size={13} color={COLORS.primaryLight} />
                    <span style={{ fontFamily: 'monospace', fontWeight: 600, color: COLORS.primaryLight, flexShrink: 0 }}>{d.id}</span>
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: COLORS.textSec }}>{d.titre}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Capacity check */}
          {destEmpl && destEmpl.capacite > 0 && (
            <CapacityCheck empl={destEmpl} addCount={selected.length} isMobile={isMobile} />
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
            <Btn variant="outline" size="sm" icon={ChevronLeft} onClick={() => setStep(2)}>Précédent</Btn>
            <Btn size="sm" icon={Check} onClick={handleConfirm}>
              Confirmer le déplacement
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB 2 — ARBORESCENCE DU PLAN DE CLASSEMENT
   US: "je peux visualiser l'arborescence complète du classement"
═══════════════════════════════════════════════════════════════ */
function ClassificationTreeTab({ empls, docs, isMobile }) {
  const [expanded, setExpanded]   = useState({});
  const [search, setSearch]       = useState('');
  const [showDocs, setShowDocs]   = useState(null); // empl id for doc list
  const [docHistModal, setDocHistModal] = useState(null); // doc for history

  const tree = useMemo(() => buildClassTree(empls), [empls]);
  const toggle = (id) => setExpanded(p => ({ ...p, [id]: !p[id] }));

  const expandAll = () => {
    const a = {};
    const walk = (nodes) => nodes.forEach(n => { a[n.id] = true; if (n.children) walk(n.children); });
    walk(tree);
    setExpanded(a);
  };

  // Docs per emplacement
  const docsMap = useMemo(() => {
    const m = {};
    docs.forEach(d => { if (d.emplacementId) { if (!m[d.emplacementId]) m[d.emplacementId] = []; m[d.emplacementId].push(d); } });
    return m;
  }, [docs]);

  const renderNode = (node, depth = 0) => {
    const hasChildren = node.children?.length > 0;
    const isExp = expanded[node.id];
    const lvl = HIERARCHY_LEVELS.find(h => h.id === node.level) || HIERARCHY_LEVELS[0];
    const Icon = lvl.icon;
    const docCount = docsMap[node.emplId]?.length || 0;
    const matchSearch = !search || node.label.toLowerCase().includes(search.toLowerCase());

    if (search && !matchSearch && !hasChildren) return null;

    return (
      <div key={node.id}>
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 8,
            padding: isMobile ? '8px 10px' : '9px 14px',
            paddingLeft: isMobile ? (10 + depth * 14) : (14 + depth * 22),
            borderBottom: `1px solid ${COLORS.borderLight}`,
            cursor: hasChildren ? 'pointer' : 'default',
            background: matchSearch && search ? COLORS.primaryLighter + '30' : 'transparent',
            transition: 'background .1s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
          onMouseLeave={e => e.currentTarget.style.background = matchSearch && search ? COLORS.primaryLighter + '30' : 'transparent'}
          onClick={() => hasChildren && toggle(node.id)}
        >
          {hasChildren ? (
            <div style={{ width: 16, flexShrink: 0 }}>
              {isExp ? <ChevronDown size={14} color={COLORS.textMut} /> : <ChevronRight size={14} color={COLORS.textMut} />}
            </div>
          ) : <div style={{ width: 16, flexShrink: 0 }}><CornerDownRight size={12} color={COLORS.borderLight} /></div>}

          <div style={{ width: isMobile ? 24 : 28, height: isMobile ? 24 : 28, borderRadius: 6, background: lvl.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={isMobile ? 12 : 14} color={lvl.color} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: isMobile ? 12 : 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
              {node.label}
            </span>
          </div>

          {node.capacite > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <div style={{ width: isMobile ? 40 : 60 }}>
                <ProgressBar percent={node.percent || 0} height={5} />
              </div>
              <span style={{ fontSize: 10, color: COLORS.textMut, width: 28, textAlign: 'right' }}>{node.percent || 0}%</span>
            </div>
          )}

          {docCount > 0 && (
            <button onClick={e => { e.stopPropagation(); setShowDocs(node.emplId); }}
              style={{ background: COLORS.primaryLighter, border: 'none', borderRadius: 12, padding: '2px 8px', cursor: 'pointer', fontSize: 11, fontWeight: 700, color: COLORS.primary, fontFamily: FF, flexShrink: 0 }}>
              {docCount} doc{docCount > 1 ? 's' : ''}
            </button>
          )}
        </div>
        {hasChildren && isExp && node.children.map(c => renderNode(c, depth + 1))}
      </div>
    );
  };

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: isMobile ? '100%' : 200, maxWidth: isMobile ? '100%' : 340 }}>
          <Search size={15} color={COLORS.textMut} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher dans l'arborescence..."
            style={{ ...inputStyle, paddingLeft: 36, background: COLORS.surfaceAlt }} />
        </div>
        <Btn variant="outline" size="sm" onClick={expandAll}>Tout ouvrir</Btn>
        <Btn variant="outline" size="sm" onClick={() => setExpanded({})}>Tout fermer</Btn>
      </div>

      {/* Hierarchy legend */}
      <div style={{ display: 'flex', gap: isMobile ? 6 : 12, marginBottom: 12, overflowX: 'auto', paddingBottom: 2 }}>
        {HIERARCHY_LEVELS.map(h => (
          <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: COLORS.textMut, whiteSpace: 'nowrap' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: h.color, flexShrink: 0 }} />{h.label}
          </div>
        ))}
      </div>

      {/* Tree */}
      <div style={cardStyle}>
        <div style={{ maxHeight: isMobile ? 'calc(100vh - 460px)' : 'calc(100vh - 400px)', overflowY: 'auto' }}>
          {tree.map(n => renderNode(n, 0))}
        </div>
      </div>

      {/* Modal: documents list for an emplacement */}
      <Modal isOpen={!!showDocs} onClose={() => setShowDocs(null)}
        title="Documents à cet emplacement" width={isMobile ? '95vw' : 600}>
        {showDocs && (
          <EmplDocsList
            docs={docsMap[showDocs] || []}
            isMobile={isMobile}
            onDocHistory={d => { setShowDocs(null); setDocHistModal(d); }}
          />
        )}
      </Modal>

      {/* Modal: document movement history */}
      <Modal isOpen={!!docHistModal} onClose={() => setDocHistModal(null)}
        title="Historique des mouvements" width={isMobile ? '95vw' : 620}>
        {docHistModal && <DocumentMovementHistory doc={docHistModal} isMobile={isMobile} />}
      </Modal>
    </div>
  );
}

/* ── Documents list for an emplacement ── */
function EmplDocsList({ docs, isMobile, onDocHistory }) {
  return (
    <div>
      <div style={{ fontSize: 13, color: COLORS.textSec, marginBottom: 12 }}>{docs.length} document{docs.length > 1 ? 's' : ''}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxHeight: 400, overflowY: 'auto' }}>
        {docs.map(d => {
          const st = getStatutUI(d.statut);
          return (
            <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 12, padding: '10px 12px', borderBottom: `1px solid ${COLORS.borderLight}` }}>
              <FileText size={16} color={COLORS.primaryLight} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.titre}</div>
                <div style={{ fontSize: 11, color: COLORS.textMut, fontFamily: 'monospace' }}>{d.id}</div>
              </div>
              <Badge label={st.label} color={st.color} bg={st.bg} />
              <button onClick={() => onDocHistory(d)} title="Historique"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <History size={15} color={COLORS.textMut} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB 3 — AFFECTATION EN MASSE
   US: "je peux affecter plusieurs documents à un même emplacement"
═══════════════════════════════════════════════════════════════ */
function BulkAssignTab({ docs, empls, isMobile }) {
  const [selected, setSelected]       = useState([]);
  const [search, setSearch]           = useState('');
  const [dest, setDest]               = useState('');
  const [filterUnassigned, setFilterUnassigned] = useState(false);
  const [done, setDone]               = useState(false);

  const filtered = useMemo(() => {
    let r = docs;
    if (filterUnassigned) r = r.filter(d => !d.emplacementId);
    if (search) {
      const s = search.toLowerCase();
      r = r.filter(d => d.titre?.toLowerCase().includes(s) || d.id?.toLowerCase().includes(s));
    }
    return r;
  }, [docs, search, filterUnassigned]);

  const toggleDoc = (id) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleAll = () => {
    if (selected.length === filtered.length) setSelected([]);
    else setSelected(filtered.map(d => d.id));
  };

  const destEmpl = empls.find(e => e.id === dest);

  const handleAssign = () => {
    console.log('Bulk assign:', { documents: selected, destination: dest });
    setDone(true);
  };

  if (done) {
    return (
      <div style={{ textAlign: 'center', padding: isMobile ? 32 : 48 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: COLORS.successBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <CheckCircle2 size={32} color={COLORS.success} />
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Affectation réussie</div>
        <div style={{ fontSize: 13, color: COLORS.textSec }}>
          {selected.length} document{selected.length > 1 ? 's' : ''} affecté{selected.length > 1 ? 's' : ''} à <strong>{destEmpl?.nom}</strong>
        </div>
        <div style={{ marginTop: 16 }}>
          <Btn icon={RotateCcw} onClick={() => { setSelected([]); setDest(''); setDone(false); }}>
            Nouvelle affectation
          </Btn>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 340px', gap: 16 }}>
      {/* Left: document selection */}
      <div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
            <Search size={15} color={COLORS.textMut} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher..." style={{ ...inputStyle, paddingLeft: 32, fontSize: 12 }} />
          </div>
          <label style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', color: COLORS.textSec, whiteSpace: 'nowrap' }}>
            <input type="checkbox" checked={filterUnassigned} onChange={e => setFilterUnassigned(e.target.checked)} />
            Non affectés seulement
          </label>
        </div>

        <div style={cardStyle}>
          <div style={{ padding: '8px 12px', borderBottom: `1px solid ${COLORS.border}`, background: COLORS.surfaceAlt, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Checkbox checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} />
            <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.textSec }}>{selected.length} sélectionné(s)</span>
          </div>
          <div style={{ maxHeight: isMobile ? 300 : 420, overflowY: 'auto' }}>
            {filtered.map(d => {
              const isSel = selected.includes(d.id);
              const empl = empls.find(e => e.id === d.emplacementId);
              return (
                <div key={d.id} onClick={() => toggleDoc(d.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
                    borderBottom: `1px solid ${COLORS.borderLight}`, cursor: 'pointer',
                    background: isSel ? COLORS.primaryLighter + '40' : 'transparent',
                  }}>
                  <Checkbox checked={isSel} onChange={() => toggleDoc(d.id)} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.titre}</div>
                    <div style={{ fontSize: 10, color: COLORS.textMut }}>
                      {d.id} {empl ? `• ${empl.nom}` : '• Non affecté'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: destination + confirm */}
      <div>
        <div style={{ ...cardStyle, padding: isMobile ? 14 : 16, position: isMobile ? 'static' : 'sticky', top: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <SquareStack size={18} color={COLORS.primary} />Affectation groupée
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Emplacement cible *</label>
            <EmplacementPicker empls={empls} value={dest} onChange={setDest} isMobile={isMobile} />
          </div>

          {destEmpl && destEmpl.capacite > 0 && (
            <CapacityCheck empl={destEmpl} addCount={selected.length} isMobile={isMobile} />
          )}

          <div style={{ padding: 12, background: COLORS.surfaceAlt, borderRadius: 8, marginBottom: 14 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.primary, textAlign: 'center' }}>{selected.length}</div>
            <div style={{ fontSize: 11, color: COLORS.textMut, textAlign: 'center' }}>document{selected.length > 1 ? 's' : ''} à affecter</div>
          </div>

          <Btn icon={Check} style={{ width: '100%' }} disabled={selected.length === 0 || !dest} onClick={handleAssign}>
            Affecter les documents
          </Btn>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB 4 — HISTORIQUE DES MOUVEMENTS
   US: "je peux voir l'historique des mouvements d'un document"
═══════════════════════════════════════════════════════════════ */
function HistoryTab({ history, docs, empls, isMobile }) {
  const [search, setSearch]   = useState('');
  const [typeF, setTypeF]     = useState('all');
  const [page, setPage]       = useState(1);
  const [docHistModal, setDocHistModal] = useState(null);
  const perPage = 15;

  const types = [...new Set(history.map(h => h.type))];

  const filtered = useMemo(() => {
    return history.filter(h => {
      const ms = !search ||
        h.document?.toLowerCase().includes(search.toLowerCase()) ||
        h.description?.toLowerCase().includes(search.toLowerCase()) ||
        h.auteur?.toLowerCase().includes(search.toLowerCase());
      const mt = typeF === 'all' || h.type === typeF;
      return ms && mt;
    });
  }, [history, search, typeF]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div>
      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: isMobile ? '100%' : 200, maxWidth: isMobile ? '100%' : 360 }}>
          <Search size={15} color={COLORS.textMut} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Rechercher par document, description, auteur..."
            style={{ ...inputStyle, paddingLeft: 36, background: COLORS.surfaceAlt }} />
        </div>
        <div style={{ display: 'flex', gap: 4, overflowX: 'auto' }}>
          {[{ id: 'all', label: 'Tous' }, ...MOVE_TYPES.map(t => ({ id: t.id, label: t.label }))].map(f => (
            <button key={f.id} onClick={() => { setTypeF(f.id); setPage(1); }}
              style={{
                padding: '6px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, fontFamily: FF,
                background: typeF === f.id ? COLORS.primary : '#fff',
                color: typeF === f.id ? '#fff' : COLORS.textSec,
                border: `1.5px solid ${typeF === f.id ? COLORS.primary : COLORS.border}`,
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: 10, background: COLORS.infoBg, borderRadius: 8, border: '1px solid #bfdbfe', marginBottom: 14 }}>
        <div style={{ fontSize: 12, color: COLORS.info, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Info size={14} />
          Cliquez sur un document pour voir son historique complet de mouvements
        </div>
      </div>

      {/* Timeline */}
      <div style={cardStyle}>
        {pageData.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: COLORS.textMut }}>
            <History size={40} strokeWidth={1.2} style={{ opacity: .3, marginBottom: 8 }} />
            <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.textSec }}>Aucun mouvement trouvé</div>
          </div>
        ) : pageData.map((m, i) => {
          const mt = MOVE_TYPES.find(t => t.id === m.type) || MOVE_TYPES[0];
          const Icon = mt.icon;
          return (
            <div key={i}
              style={{ display: 'flex', gap: isMobile ? 10 : 14, padding: isMobile ? '10px 12px' : '12px 16px', borderBottom: `1px solid ${COLORS.borderLight}`, cursor: 'pointer', transition: 'background .1s' }}
              onClick={() => { const doc = docs.find(d => d.id === m.document); if (doc) setDocHistModal(doc); }}
              onMouseEnter={e => e.currentTarget.style.background = '#fafbfc'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div style={{ width: isMobile ? 30 : 34, height: isMobile ? 30 : 34, borderRadius: 8, background: mt.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={isMobile ? 14 : 16} color={mt.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{m.document}</span>
                  <Badge label={mt.label} color={mt.color} bg={mt.bg} />
                </div>
                <div style={{ fontSize: 12, color: COLORS.textSec, marginTop: 2 }}>{m.description}</div>
                {m.de && m.vers && (
                  <div style={{ fontSize: 11, color: COLORS.textMut, marginTop: 3, display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                    <MapPin size={10} /> {m.de} <ArrowRight size={10} /> {m.vers}
                  </div>
                )}
                <div style={{ fontSize: 11, color: COLORS.textMut, marginTop: 3, display: 'flex', gap: 10 }}>
                  <span>{m.date} {m.heure}</span>
                  <span>Par {m.auteur}</span>
                </div>
              </div>
            </div>
          );
        })}
        {totalPages > 1 && (
          <div style={{ padding: '10px 14px' }}>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>

      {/* Modal: Document history */}
      <Modal isOpen={!!docHistModal} onClose={() => setDocHistModal(null)}
        title="Historique complet du document" width={isMobile ? '95vw' : 640}>
        {docHistModal && <DocumentMovementHistory doc={docHistModal} isMobile={isMobile} />}
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB 5 — ÉDITEUR DE STRUCTURE DU PLAN DE CLASSEMENT
   US: "je peux modifier la structure du plan de classement"
═══════════════════════════════════════════════════════════════ */
function StructureEditorTab({ empls, isMobile }) {
  const [tree, setTree]           = useState(() => buildClassTree(empls));
  const [expanded, setExpanded]   = useState({});
  const [editNode, setEditNode]   = useState(null);
  const [addChild, setAddChild]   = useState(null);  // parent node id + level
  const [showConfirm, setShowConfirm] = useState(null);

  const toggle = (id) => setExpanded(p => ({ ...p, [id]: !p[id] }));

  const expandAll = () => {
    const a = {};
    const walk = (nodes) => nodes.forEach(n => { a[n.id] = true; if (n.children) walk(n.children); });
    walk(tree);
    setExpanded(a);
  };

  /* ── Inline edit / rename ── */
  const handleRename = (nodeId, newLabel) => {
    const updateTree = (nodes) => nodes.map(n => ({
      ...n,
      label: n.id === nodeId ? newLabel : n.label,
      children: n.children ? updateTree(n.children) : undefined,
    }));
    setTree(updateTree(tree));
    setEditNode(null);
  };

  /* ── Add child ── */
  const handleAddChild = (parentId, childLabel, childLevel) => {
    const childId = `new-${Date.now()}`;
    const insert = (nodes) => nodes.map(n => {
      if (n.id === parentId) {
        return { ...n, children: [...(n.children || []), { id: childId, label: childLabel, level: childLevel, children: [] }] };
      }
      return { ...n, children: n.children ? insert(n.children) : undefined };
    });
    setTree(insert(tree));
    setExpanded(p => ({ ...p, [parentId]: true }));
    setAddChild(null);
  };

  /* ── Delete node ── */
  const handleDelete = (nodeId) => {
    const remove = (nodes) => nodes.filter(n => n.id !== nodeId).map(n => ({ ...n, children: n.children ? remove(n.children) : undefined }));
    setTree(remove(tree));
    setShowConfirm(null);
  };

  const renderEditNode = (node, depth = 0) => {
    const hasChildren = node.children?.length > 0;
    const isExp = expanded[node.id];
    const isEditing = editNode === node.id;
    const lvl = HIERARCHY_LEVELS.find(h => h.id === node.level) || HIERARCHY_LEVELS[0];
    const Icon = lvl.icon;
    const nextLevel = HIERARCHY_LEVELS[HIERARCHY_LEVELS.findIndex(h => h.id === node.level) + 1];

    return (
      <div key={node.id}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 8,
          padding: isMobile ? '7px 8px' : '8px 12px',
          paddingLeft: isMobile ? (8 + depth * 14) : (12 + depth * 22),
          borderBottom: `1px solid ${COLORS.borderLight}`,
          background: isEditing ? COLORS.warningBg : 'transparent',
        }}>
          {/* Expand */}
          <div style={{ width: 16, flexShrink: 0, cursor: hasChildren ? 'pointer' : 'default' }} onClick={() => hasChildren && toggle(node.id)}>
            {hasChildren ? (isExp ? <ChevronDown size={14} color={COLORS.textMut} /> : <ChevronRight size={14} color={COLORS.textMut} />)
              : <CornerDownRight size={12} color={COLORS.borderLight} />}
          </div>

          {/* Drag handle */}
          <GripVertical size={14} color={COLORS.borderLight} style={{ cursor: 'grab', flexShrink: 0 }} />

          {/* Icon */}
          <div style={{ width: 24, height: 24, borderRadius: 6, background: lvl.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={12} color={lvl.color} />
          </div>

          {/* Label / edit */}
          {isEditing ? (
            <InlineEdit
              initialValue={node.label}
              onSave={(v) => handleRename(node.id, v)}
              onCancel={() => setEditNode(null)}
            />
          ) : (
            <span style={{ flex: 1, fontSize: isMobile ? 12 : 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {node.label}
            </span>
          )}

          {/* Level tag */}
          <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: lvl.color + '15', color: lvl.color, fontWeight: 600, flexShrink: 0 }}>
            {lvl.label}
          </span>

          {/* Actions */}
          {!isEditing && (
            <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
              <TinyBtn icon={Pencil} title="Renommer" onClick={() => setEditNode(node.id)} />
              {nextLevel && (
                <TinyBtn icon={FolderPlus} title={`Ajouter ${nextLevel.label}`}
                  onClick={() => setAddChild({ parentId: node.id, level: nextLevel.id })} />
              )}
              <TinyBtn icon={Trash2} title="Supprimer" color={COLORS.danger}
                onClick={() => setShowConfirm(node)} />
            </div>
          )}
        </div>

        {/* Add child inline */}
        {addChild?.parentId === node.id && (
          <div style={{ padding: '8px 12px', paddingLeft: isMobile ? (8 + (depth + 1) * 14) : (12 + (depth + 1) * 22), background: COLORS.successBg, borderBottom: `1px solid ${COLORS.borderLight}`, display: 'flex', gap: 8, alignItems: 'center' }}>
            <FolderPlus size={14} color={COLORS.success} />
            <InlineEdit
              initialValue=""
              placeholder={`Nom du nouveau ${HIERARCHY_LEVELS.find(h => h.id === addChild.level)?.label || 'nœud'}...`}
              onSave={(v) => handleAddChild(node.id, v, addChild.level)}
              onCancel={() => setAddChild(null)}
              autoFocus
            />
          </div>
        )}

        {hasChildren && isExp && node.children.map(c => renderEditNode(c, depth + 1))}
      </div>
    );
  };

  return (
    <div>
      {/* Admin warning */}
      <div style={{ padding: 12, background: COLORS.warningBg, borderRadius: 8, border: '1px solid #fde68a', marginBottom: 14, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <AlertTriangle size={16} color={COLORS.warning} style={{ flexShrink: 0, marginTop: 1 }} />
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.warning }}>Mode administration</div>
          <div style={{ fontSize: 12, color: COLORS.textSec }}>
            Les modifications de la structure du plan de classement affectent l'ensemble du référentiel. Renommez, ajoutez ou supprimez des nœuds avec précaution.
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        <Btn variant="outline" size="sm" onClick={expandAll}>Tout ouvrir</Btn>
        <Btn variant="outline" size="sm" onClick={() => setExpanded({})}>Tout fermer</Btn>
        <Btn variant="outline" size="sm" icon={Plus}
          onClick={() => setAddChild({ parentId: null, level: 'site' })}>
          Ajouter un site
        </Btn>
        <div style={{ flex: 1 }} />
        <Btn size="sm" icon={Save} onClick={() => console.log('Save tree:', tree)}>
          Enregistrer les modifications
        </Btn>
      </div>

      {/* Editable tree */}
      <div style={cardStyle}>
        <div style={{ padding: '10px 14px', background: COLORS.surfaceAlt, borderBottom: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Edit3 size={15} color={COLORS.primary} />
          <span style={{ fontSize: 13, fontWeight: 600 }}>Structure du plan de classement</span>
          <span style={{ fontSize: 11, color: COLORS.textMut }}>— Cliquez sur ✏ pour renommer, + pour ajouter</span>
        </div>

        {/* Root-level add */}
        {addChild?.parentId === null && (
          <div style={{ padding: '8px 12px', background: COLORS.successBg, borderBottom: `1px solid ${COLORS.borderLight}`, display: 'flex', gap: 8, alignItems: 'center' }}>
            <Building2 size={14} color={COLORS.success} />
            <InlineEdit
              initialValue=""
              placeholder="Nom du nouveau site..."
              onSave={(v) => {
                setTree(prev => [...prev, { id: `site-${Date.now()}`, label: v, level: 'site', children: [] }]);
                setAddChild(null);
              }}
              onCancel={() => setAddChild(null)}
              autoFocus
            />
          </div>
        )}

        <div style={{ maxHeight: isMobile ? 'calc(100vh - 480px)' : 'calc(100vh - 420px)', overflowY: 'auto' }}>
          {tree.map(n => renderEditNode(n, 0))}
        </div>
      </div>

      {/* Delete confirmation */}
      <Modal isOpen={!!showConfirm} onClose={() => setShowConfirm(null)} title="Confirmer la suppression" width={isMobile ? '90vw' : 420}>
        {showConfirm && (
          <div>
            <div style={{ padding: 14, background: COLORS.dangerBg, borderRadius: 8, marginBottom: 16, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <AlertTriangle size={20} color={COLORS.danger} style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.danger }}>Supprimer « {showConfirm.label} » ?</div>
                <div style={{ fontSize: 12, color: COLORS.textSec, marginTop: 4 }}>
                  Cette action supprimera aussi tous les sous-nœuds. Les documents associés devront être réaffectés.
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Btn variant="outline" size="sm" onClick={() => setShowConfirm(null)}>Annuler</Btn>
              <Btn variant="danger" size="sm" icon={Trash2} onClick={() => handleDelete(showConfirm.id)}>Supprimer</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DOCUMENT MOVEMENT HISTORY (shared modal)
   US: "je peux voir l'historique des mouvements d'un document"
═══════════════════════════════════════════════════════════════ */
function DocumentMovementHistory({ doc, isMobile }) {
  const movements = DEMO_DOC_MOVEMENTS[doc.id] || generateDocHistory(doc);

  return (
    <div>
      {/* Doc header */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20, padding: 14, background: COLORS.surfaceAlt, borderRadius: 10 }}>
        <div style={{ width: 40, height: 40, borderRadius: 8, background: COLORS.primaryLighter, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <FileText size={20} color={COLORS.primary} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{doc.titre}</div>
          <div style={{ fontSize: 12, color: COLORS.textMut, fontFamily: 'monospace' }}>{doc.id}</div>
        </div>
        <Badge label={`${movements.length} mouvements`} color={COLORS.info} bg={COLORS.infoBg} />
      </div>

      {/* Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {movements.map((m, i) => {
          const mt = MOVE_TYPES.find(t => t.id === m.type) || MOVE_TYPES[0];
          const Icon = mt.icon;
          return (
            <div key={i} style={{ display: 'flex', gap: isMobile ? 10 : 14 }}>
              {/* Timeline */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 28, flexShrink: 0 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: mt.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, border: i === 0 ? `2px solid ${mt.color}` : 'none' }}>
                  <Icon size={13} color={mt.color} />
                </div>
                {i < movements.length - 1 && <div style={{ width: 2, flex: 1, background: COLORS.borderLight, minHeight: 8 }} />}
              </div>

              {/* Content */}
              <div style={{ flex: 1, paddingBottom: 14 }}>
                <div style={{
                  padding: isMobile ? 10 : 12, borderRadius: 8,
                  background: i === 0 ? mt.bg : '#fff',
                  border: `1px solid ${i === 0 ? mt.color + '30' : COLORS.borderLight}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, flexWrap: 'wrap', gap: 4 }}>
                    <Badge label={mt.label} color={mt.color} bg={i === 0 ? '#fff' : mt.bg} />
                    <span style={{ fontSize: 11, color: COLORS.textMut }}>{m.date} {m.heure}</span>
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.textSec, marginBottom: 3 }}>{m.description}</div>
                  {m.de && m.vers && (
                    <div style={{ fontSize: 11, color: COLORS.textMut, display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                      <MapPin size={10} />{m.de} <ArrowRight size={10} /> {m.vers}
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: COLORS.textMut, marginTop: 4 }}>
                    Par <strong>{m.auteur}</strong>
                    {m.motif && <span> — {m.motif}</span>}
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
   SHARED COMPONENTS
═══════════════════════════════════════════════════════════════ */

/* ── Checkbox ── */
function Checkbox({ checked, indeterminate, onChange }) {
  const ref = useRef(null);
  React.useEffect(() => { if (ref.current) ref.current.indeterminate = !!indeterminate; }, [indeterminate]);
  return (
    <input ref={ref} type="checkbox" checked={checked} onChange={onChange}
      style={{ width: 16, height: 16, cursor: 'pointer', accentColor: COLORS.primary, flexShrink: 0 }}
      onClick={e => e.stopPropagation()} />
  );
}

/* ── Emplacement Picker (select with capacity info) ── */
function EmplacementPicker({ empls, value, onChange, isMobile }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return empls;
    const s = search.toLowerCase();
    return empls.filter(e =>
      e.nom?.toLowerCase().includes(s) ||
      e.site?.toLowerCase().includes(s) ||
      e.salle?.toLowerCase().includes(s)
    );
  }, [empls, search]);

  const selected = empls.find(e => e.id === value);

  return (
    <div>
      {selected && (
        <div style={{ padding: 10, background: COLORS.successBg, borderRadius: 8, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `1px solid ${COLORS.success}30` }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.success }}>{selected.nom}</div>
            <div style={{ fontSize: 11, color: COLORS.textSec }}>{selected.site} › {selected.batiment} › {selected.salle}</div>
          </div>
          <button onClick={() => onChange('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <X size={14} color={COLORS.textMut} />
          </button>
        </div>
      )}

      {!selected && (
        <>
          <div style={{ position: 'relative', marginBottom: 6 }}>
            <Search size={14} color={COLORS.textMut} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un emplacement..."
              style={{ ...inputStyle, paddingLeft: 32, fontSize: 12 }} />
          </div>
          <div style={{ maxHeight: 200, overflowY: 'auto', border: `1px solid ${COLORS.borderLight}`, borderRadius: 8 }}>
            {filtered.map(e => {
              const pct = e.capacite > 0 ? Math.round((e.occupe / e.capacite) * 100) : 0;
              const full = pct >= 95;
              return (
                <div key={e.id} onClick={() => { if (!full) { onChange(e.id); setSearch(''); } }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
                    borderBottom: `1px solid ${COLORS.borderLight}`,
                    cursor: full ? 'not-allowed' : 'pointer', opacity: full ? 0.5 : 1,
                  }}
                  onMouseEnter={ev => { if (!full) ev.currentTarget.style.background = '#f8fafc'; }}
                  onMouseLeave={ev => ev.currentTarget.style.background = 'transparent'}>
                  <MapPin size={13} color={COLORS.primaryLight} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.nom}</div>
                    <div style={{ fontSize: 10, color: COLORS.textMut }}>{e.site} › {e.salle}</div>
                  </div>
                  <div style={{ width: 40 }}><ProgressBar percent={pct} height={4} /></div>
                  <span style={{ fontSize: 10, fontWeight: 600, color: pct >= 85 ? COLORS.danger : COLORS.textMut, width: 28, textAlign: 'right' }}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Capacity Check ── */
function CapacityCheck({ empl, addCount, isMobile }) {
  const current = empl.occupe || 0;
  const cap = empl.capacite || 0;
  const after = current + addCount;
  const afterPct = cap > 0 ? Math.round((after / cap) * 100) : 0;
  const overflow = after > cap;

  return (
    <div style={{
      padding: 12, borderRadius: 8, marginBottom: 14,
      background: overflow ? COLORS.dangerBg : afterPct >= 85 ? COLORS.warningBg : COLORS.surfaceAlt,
      border: `1px solid ${overflow ? COLORS.danger + '30' : afterPct >= 85 ? '#fde68a' : COLORS.borderLight}`,
    }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: overflow ? COLORS.danger : afterPct >= 85 ? COLORS.warning : COLORS.textSec, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
        {overflow ? <XCircle size={14} /> : afterPct >= 85 ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}
        {overflow ? 'Capacité dépassée !' : afterPct >= 85 ? 'Attention — Capacité presque atteinte' : 'Capacité suffisante'}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: COLORS.textSec, marginBottom: 4 }}>
        <span>Actuel: {current}/{cap}</span>
        <span>Après: {after}/{cap} ({afterPct}%)</span>
      </div>
      <div style={{ height: 8, background: '#fff', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{
          width: `${Math.min(afterPct, 100)}%`, height: '100%',
          background: overflow ? COLORS.danger : afterPct >= 85 ? COLORS.warning : COLORS.success,
          borderRadius: 4, transition: 'width .3s',
        }} />
      </div>
    </div>
  );
}

/* ── Inline Edit ── */
function InlineEdit({ initialValue, onSave, onCancel, placeholder, autoFocus }) {
  const [val, setVal] = useState(initialValue);
  const ref = useRef(null);
  React.useEffect(() => { if (autoFocus || true) ref.current?.focus(); }, []);

  const handleKey = (e) => {
    if (e.key === 'Enter' && val.trim()) onSave(val.trim());
    if (e.key === 'Escape') onCancel();
  };

  return (
    <div style={{ display: 'flex', gap: 4, flex: 1, alignItems: 'center' }}>
      <input ref={ref} value={val} onChange={e => setVal(e.target.value)} onKeyDown={handleKey}
        placeholder={placeholder}
        style={{ ...inputStyle, padding: '5px 8px', fontSize: 12, flex: 1, background: '#fff' }} />
      <button onClick={() => { if (val.trim()) onSave(val.trim()); }}
        style={{ background: COLORS.success, border: 'none', borderRadius: 4, padding: 4, cursor: 'pointer' }}>
        <Check size={12} color="#fff" />
      </button>
      <button onClick={onCancel}
        style={{ background: COLORS.borderLight, border: 'none', borderRadius: 4, padding: 4, cursor: 'pointer' }}>
        <X size={12} color={COLORS.textMut} />
      </button>
    </div>
  );
}

/* ── InfoBlock ── */
function InfoBlock({ label, value }) {
  return (
    <div style={{ padding: 10, background: COLORS.surfaceAlt, borderRadius: 8 }}>
      <div style={{ fontSize: 11, color: COLORS.textMut, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 600 }}>{value || '—'}</div>
    </div>
  );
}

/* ── TinyBtn ── */
function TinyBtn({ icon: Icon, title, onClick, color }) {
  return (
    <button onClick={onClick} title={title}
      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 3, borderRadius: 4, transition: 'background .1s' }}
      onMouseEnter={e => e.currentTarget.style.background = COLORS.borderLight}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      <Icon size={13} color={color || COLORS.textMut} />
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════ */

function buildClassTree(empls) {
  const siteMap = {};
  empls.forEach(e => {
    if (!siteMap[e.site]) siteMap[e.site] = {};
    if (!siteMap[e.site][e.batiment]) siteMap[e.site][e.batiment] = {};
    const etage = e.etage || 'RDC';
    if (!siteMap[e.site][e.batiment][etage]) siteMap[e.site][e.batiment][etage] = [];
    siteMap[e.site][e.batiment][etage].push(e);
  });

  return Object.entries(siteMap).map(([site, bats]) => ({
    id: `site-${site}`, label: site, level: 'site',
    children: Object.entries(bats).map(([bat, etages]) => ({
      id: `bat-${site}-${bat}`, label: bat, level: 'batiment',
      children: Object.entries(etages).map(([etage, salles]) => ({
        id: `etg-${site}-${bat}-${etage}`, label: `Étage ${etage}`, level: 'etage',
        children: salles.map(s => ({
          id: s.id, emplId: s.id, label: s.nom || s.salle, level: 'salle',
          capacite: s.capacite, occupe: s.occupe,
          percent: s.capacite > 0 ? Math.round((s.occupe / s.capacite) * 100) : 0,
          children: (s.rayonnages || []).map((r, ri) => ({
            id: `${s.id}-ray-${ri}`, label: r.nom || `Rayonnage ${ri + 1}`, level: 'rayonnage',
            capacite: r.capacite || 0, occupe: r.occupe || 0,
            percent: r.capacite > 0 ? Math.round((r.occupe / r.capacite) * 100) : 0,
            children: (r.niveaux || []).map((n, ni) => ({
              id: `${s.id}-ray-${ri}-niv-${ni}`, label: n.nom || `Niveau ${ni + 1}`, level: 'niveau',
            })),
          })),
        })),
      })),
    })),
  }));
}

function generateDocHistory(doc) {
  return [
    { date: '2025-02-28', heure: '10:30', type: 'deplacement', description: 'Déplacement vers salle Finance', de: 'Archives DG', vers: 'Salle Finances (S-201)', auteur: 'M. Rakoto' },
    { date: '2025-02-15', heure: '14:00', type: 'retour', description: 'Retour après consultation', de: 'Bureau DRH', vers: 'Archives DG (S-101)', auteur: 'R. Andria' },
    { date: '2025-02-10', heure: '09:15', type: 'pret', description: 'Prêt pour consultation service RH', de: 'Archives DG (S-101)', vers: 'Bureau DRH', auteur: 'R. Andria', motif: 'Vérification dossier' },
    { date: '2025-01-20', heure: '11:00', type: 'transfert', description: 'Transfert inter-services', de: 'Dépôt courrier (A-001)', vers: 'Archives DG (S-101)', auteur: 'Admin Razafin.' },
    { date: '2025-01-05', heure: '08:30', type: 'affectation', description: 'Affectation initiale', de: '', vers: 'Dépôt courrier (A-001)', auteur: 'S. Nirina', motif: 'Enregistrement initial' },
  ];
}

/* ═══════════════════════════════════════════════════════════════
   DONNÉES DÉMO
═══════════════════════════════════════════════════════════════ */
const DEMO_DOCS = [
  { id: 'DOC-2025-0142', titre: 'Contrat de prestation JIRAMA', service: 'Direction Générale', statut: 'disponible', confidentialite: 'conf-confidentiel', emplacementId: 'EMP-001', cote: 'A-001.12', typeId: 'TYPE-001' },
  { id: 'DOC-2025-0138', titre: 'Facture fournisseur Orange Madagascar', service: 'Finances', statut: 'en_traitement', confidentialite: 'conf-interne', emplacementId: 'EMP-003', cote: 'F-003.05' },
  { id: 'DOC-2025-0135', titre: 'Dossier client BNI Madagascar', service: 'Commercial', statut: 'disponible', confidentialite: 'conf-interne', emplacementId: 'EMP-001', cote: 'C-002.08' },
  { id: 'DOC-2025-0130', titre: 'Note de service — Congés 2025', service: 'Ressources Humaines', statut: 'disponible', confidentialite: 'conf-public', emplacementId: 'EMP-002', cote: 'N-001.01' },
  { id: 'DOC-2025-0125', titre: 'PV Conseil Administration Q4 2024', service: 'Direction Générale', statut: 'archivage_inter', confidentialite: 'conf-secret', emplacementId: 'EMP-006', cote: 'PV-004.12' },
  { id: 'DOC-2025-0120', titre: 'Contrat bail bureaux Ankorondrano', service: 'Juridique', statut: 'disponible', confidentialite: 'conf-confidentiel', emplacementId: 'EMP-005', cote: 'J-001.03' },
  { id: 'DOC-2025-0115', titre: 'Dossier embauche Rakoto M.', service: 'Ressources Humaines', statut: 'en_consultation', confidentialite: 'conf-confidentiel', emplacementId: 'EMP-002', cote: 'RH-012.01' },
  { id: 'DOC-2025-0110', titre: 'Rapport audit interne 2024', service: 'Direction Générale', statut: 'disponible', confidentialite: 'conf-confidentiel', emplacementId: 'EMP-001', cote: 'A-005.02' },
  { id: 'DOC-2025-0089', titre: 'Facture TELMA trimestre 3', service: 'Finances', statut: 'prete', confidentialite: 'conf-interne', emplacementId: null, cote: 'F-003.09' },
  { id: 'DOC-2024-0891', titre: 'Dossier projet GEZANI', service: 'Service Technique', statut: 'en_transfert', confidentialite: 'conf-interne', emplacementId: 'EMP-003', cote: 'T-008.01' },
  { id: 'DOC-2024-0456', titre: 'Convention partenariat USAID', service: 'Direction Générale', statut: 'disponible', confidentialite: 'conf-confidentiel', emplacementId: 'EMP-005', cote: 'J-002.15' },
  { id: 'DOC-2024-0312', titre: 'Archive comptable 2023', service: 'Finances', statut: 'archivage_def', confidentialite: 'conf-interne', emplacementId: 'EMP-007', cote: 'F-010.23' },
];

const DEMO_EMPLS = [
  { id: 'EMP-001', site: 'Siège Analakely', batiment: 'Bâtiment Principal', etage: '1', salle: 'S-101', nom: 'Archives courantes DG', capacite: 500, occupe: 423, rayonnages: [{ nom: 'Ray. A1', code: 'A1', capacite: 125, occupe: 118, niveaux: [{ nom: 'Niv. 1', code: 'A1-1' }] }] },
  { id: 'EMP-002', site: 'Siège Analakely', batiment: 'Bâtiment Principal', etage: '1', salle: 'S-102', nom: 'Archives RH', capacite: 300, occupe: 285 },
  { id: 'EMP-003', site: 'Siège Analakely', batiment: 'Bâtiment Principal', etage: '2', salle: 'S-201', nom: 'Salle Finances', capacite: 400, occupe: 245 },
  { id: 'EMP-004', site: 'Siège Analakely', batiment: 'Annexe', etage: 'RDC', salle: 'A-001', nom: 'Dépôt courrier', capacite: 200, occupe: 120 },
  { id: 'EMP-005', site: 'Siège Analakely', batiment: 'Annexe', etage: '1', salle: 'A-101', nom: 'Archives juridiques', capacite: 350, occupe: 190 },
  { id: 'EMP-006', site: 'Site Ankorondrano', batiment: 'Entrepôt Nord', etage: 'RDC', salle: 'N-001', nom: 'Archivage intermédiaire', capacite: 2000, occupe: 1450 },
  { id: 'EMP-007', site: 'Site Ankorondrano', batiment: 'Entrepôt Nord', etage: '1', salle: 'N-101', nom: 'Archives définitives', capacite: 1500, occupe: 980 },
  { id: 'EMP-008', site: 'Agence Tamatave', batiment: 'Bureau régional', etage: 'RDC', salle: 'T-001', nom: 'Archives locales', capacite: 250, occupe: 180 },
];

const DEMO_HISTORY = [
  { date: '2025-02-28', heure: '15:20', type: 'deplacement', document: 'DOC-2025-0142', description: 'Déplacement vers Archives DG', de: 'Dépôt courrier', vers: 'Archives courantes DG (S-101)', auteur: 'M. Rakoto' },
  { date: '2025-02-28', heure: '14:45', type: 'transfert', document: 'DOC-2024-0891', description: 'Transfert archivage intermédiaire', de: 'Salle Finances (S-201)', vers: 'Archivage intermédiaire (N-001)', auteur: 'Admin Razafin.' },
  { date: '2025-02-28', heure: '11:30', type: 'pret', document: 'DOC-2025-0089', description: 'Prêt pour consultation', de: 'Archives RH (S-102)', vers: 'Bureau DRH', auteur: 'R. Andria' },
  { date: '2025-02-28', heure: '09:00', type: 'affectation', document: 'DOC-2025-0142', description: 'Affectation initiale au dépôt courrier', de: '', vers: 'Dépôt courrier (A-001)', auteur: 'S. Nirina' },
  { date: '2025-02-27', heure: '16:30', type: 'retour', document: 'DOC-2025-0115', description: 'Retour de consultation RH', de: 'Bureau DRH', vers: 'Archives RH (S-102)', auteur: 'R. Andria' },
  { date: '2025-02-27', heure: '14:00', type: 'deplacement', document: 'DOC-2025-0110', description: 'Réorganisation rayonnage', de: 'Ray. A2 (S-101)', vers: 'Ray. A1 (S-101)', auteur: 'Admin Razafin.' },
  { date: '2025-02-27', heure: '10:15', type: 'transfert', document: 'LOT-2024-Q2', description: 'Transfert lot Q2 complet', de: 'Dépôt courrier (A-001)', vers: 'Archivage intermédiaire (N-001)', auteur: 'Admin Razafin.' },
  { date: '2025-02-26', heure: '15:45', type: 'elimination', document: 'ELIM-2025-002', description: 'Élimination 120 brouillons expirés', de: 'Archivage intermédiaire (N-001)', vers: 'Détruit', auteur: 'Admin Razafin.' },
  { date: '2025-02-26', heure: '14:00', type: 'deplacement', document: 'DOC-2024-0456', description: 'Déplacement vers archives juridiques', de: 'Archives DG (S-101)', vers: 'Archives juridiques (A-101)', auteur: 'M. Rakoto' },
  { date: '2025-02-26', heure: '09:30', type: 'affectation', document: 'DOC-2025-0135', description: 'Enregistrement nouveau dossier client', de: '', vers: 'Archives courantes DG (S-101)', auteur: 'S. Nirina' },
  { date: '2025-02-25', heure: '16:20', type: 'retour', document: 'DOC-2024-0456', description: 'Retour de consultation juridique', de: 'Bureau juridique', vers: 'Archives DG (S-101)', auteur: 'R. Andria' },
  { date: '2025-02-25', heure: '11:00', type: 'transfert', document: 'DOC-2024-0312', description: 'Passage en conservation définitive', de: 'Archivage intermédiaire', vers: 'Archives définitives (N-101)', auteur: 'Admin Razafin.' },
  { date: '2025-02-24', heure: '14:30', type: 'deplacement', document: 'DOC-2025-0130', description: 'Rangement note de service', de: 'Dépôt courrier (A-001)', vers: 'Archives RH (S-102)', auteur: 'S. Nirina' },
  { date: '2025-02-24', heure: '10:00', type: 'affectation', document: 'DOC-2025-0130', description: 'Réception courrier interne', de: '', vers: 'Dépôt courrier (A-001)', auteur: 'S. Nirina' },
];

const DEMO_DOC_MOVEMENTS = {
  'DOC-2025-0142': [
    { date: '2025-02-28', heure: '15:20', type: 'deplacement', description: 'Déplacement vers Archives DG', de: 'Dépôt courrier (A-001)', vers: 'Archives courantes DG (S-101)', auteur: 'M. Rakoto', motif: 'Classement définitif' },
    { date: '2025-02-28', heure: '09:00', type: 'affectation', description: 'Affectation initiale', de: '', vers: 'Dépôt courrier (A-001)', auteur: 'S. Nirina', motif: 'Enregistrement contrat' },
  ],
  'DOC-2025-0089': [
    { date: '2025-02-28', heure: '11:30', type: 'pret', description: 'Prêt pour consultation DRH', de: 'Archives RH (S-102)', vers: 'Bureau DRH', auteur: 'R. Andria', motif: 'Vérification facture' },
    { date: '2025-02-01', heure: '10:00', type: 'deplacement', description: 'Classement en salle RH', de: 'Salle Finances (S-201)', vers: 'Archives RH (S-102)', auteur: 'M. Rakoto' },
    { date: '2025-01-15', heure: '08:30', type: 'affectation', description: 'Affectation initiale', de: '', vers: 'Salle Finances (S-201)', auteur: 'S. Nirina' },
  ],
  'DOC-2024-0891': [
    { date: '2025-02-28', heure: '14:45', type: 'transfert', description: 'Transfert vers archivage intermédiaire', de: 'Salle Finances (S-201)', vers: 'Archivage intermédiaire (N-001)', auteur: 'Admin Razafin.', motif: 'Projet clôturé, DUA en cours' },
    { date: '2024-12-10', heure: '11:00', type: 'deplacement', description: 'Déplacement inter-services', de: 'Archives DG (S-101)', vers: 'Salle Finances (S-201)', auteur: 'M. Rakoto' },
    { date: '2024-06-15', heure: '09:00', type: 'retour', description: 'Retour de consultation', de: 'Bureau technique', vers: 'Archives DG (S-101)', auteur: 'R. Andria' },
    { date: '2024-05-20', heure: '14:30', type: 'pret', description: 'Prêt au service technique', de: 'Archives DG (S-101)', vers: 'Bureau technique', auteur: 'R. Andria', motif: 'Consultation projet GEZANI' },
    { date: '2024-03-01', heure: '08:00', type: 'affectation', description: 'Enregistrement initial du dossier projet', de: '', vers: 'Archives DG (S-101)', auteur: 'Admin Razafin.' },
  ],
};