/* ═══════════════════════════════════════════════════════════════
   SOFT LIBRARY — Intégration GED numérique (SoftDocs)

   ✓ Tableau de bord liaison physique ↔ numérique
   ✓ Liaison / déliaison manuelle persistante (localStorage)
   ✓ Workflow de numérisation (file d'attente → scan → QC → lié)
   ✓ Détection d'incohérences (orphelins, divergences)
   ✓ Recherche unifiée cross-système
   ✓ Versement numérique en masse

   Persistance :
     - Les liens créés/supprimés manuellement sont stockés dans localStorage
       sous la clé "softlib_ged_links" (Map physDocId → gedDocId | null)
     - null = déliaison explicite (écrase un gedDocId venant des props)
     - Seule la suppression du localStorage réinitialise les liaisons manuelles
     - Les liaisons issues des props restent visibles si non écrasées
═══════════════════════════════════════════════════════════════ */
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  Link2, Link2Off, Search, Eye, AlertTriangle, CheckCircle2,
  FileText, Monitor, Package, MapPin, ChevronRight, ChevronLeft,
  ChevronDown, ArrowRight, ArrowLeftRight, Download, Upload,
  Clock, Play, Pause, Check, X, Filter, ScanLine, Layers,
  RefreshCw, Printer, BarChart3, AlertCircle, Zap, ExternalLink,
  Inbox, ListChecks, Globe, Database, Plus, Minus, Info,
} from 'lucide-react';
import { COLORS, FONT_FAMILY } from '../theme';
import { Badge, Btn, Modal } from '../components/ui';

const FF = FONT_FAMILY;
const inp = { width: '100%', padding: '9px 12px', borderRadius: 8, border: `1.5px solid ${COLORS.border}`, fontSize: 13, background: '#fff', outline: 'none', boxSizing: 'border-box', fontFamily: FF };
const card = { background: '#fff', borderRadius: 12, border: `1px solid ${COLORS.border}`, overflow: 'hidden' };
const pill = (a) => ({ padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: FF, background: a ? COLORS.primaryLighter : 'transparent', color: a ? COLORS.primaryLight : COLORS.textSec, transition: 'all .15s' });

/* ═══════════════════════════════════════════════════
   LOCAL MODAL
   Modal natif — overlay fixe + scroll interne.
   Remplace le Modal de ../components/ui qui ne s'affiche pas.
   Fermeture : croix, clic overlay, ou Escape.
═══════════════════════════════════════════════════ */
function LocalModal({ title, onClose, width = 560, children }) {
  // Fermeture au clavier Escape
  React.useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Bloquer le scroll du body
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(15,23,42,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
        backdropFilter: 'blur(2px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 14,
          width: '100%', maxWidth: width,
          maxHeight: '90vh', overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,.25)',
          fontFamily: FF,
          animation: 'modalIn .18s ease',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 20px', borderBottom: `1px solid ${COLORS.border}`,
          position: 'sticky', top: 0, background: '#fff', zIndex: 1, borderRadius: '14px 14px 0 0',
        }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>{title}</span>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex', color: COLORS.textMut }}
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
      <style>{`@keyframes modalIn { from { opacity:0; transform:scale(.96) translateY(8px); } to { opacity:1; transform:none; } }`}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ACTION BTN LOCAL
   Bouton natif autonome — ne dépend pas du Btn de ui/
   Garantit que onClick est toujours déclenché.
   variant : 'primary' | 'ghost' | 'danger'
═══════════════════════════════════════════════════ */
function ActionBtn({ label, icon: Icon, onClick, variant = 'primary', disabled = false, title }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '5px 10px', borderRadius: 7, fontSize: 12, fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: FF,
    border: 'none', outline: 'none', transition: 'all .15s',
    opacity: disabled ? 0.45 : 1,
  };
  const styles = {
    primary: { background: COLORS.primaryLight || '#2563eb', color: '#fff' },
    ghost:   { background: 'transparent', color: COLORS.textSec || '#64748b', border: `1px solid ${COLORS.border}` },
    danger:  { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' },
  };
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={e => { e.stopPropagation(); if (!disabled && onClick) onClick(e); }}
      style={{ ...base, ...styles[variant] }}
    >
      {Icon && <Icon size={13} />}
      {label}
    </button>
  );
}

/* ═══════════════════════════════════════════════════
   STORAGE KEY
═══════════════════════════════════════════════════ */
const LS_KEY = 'softlib_ged_links';

/* ═══════════════════════════════════════════════════
   HOOK — persistance localStorage des liens manuels
   Structure stockée : { [physDocId]: gedDocId | null }
     • gedDocId (string) → liaison explicite vers ce doc GED
     • null              → déliaison explicite (écrase prop)
═══════════════════════════════════════════════════ */
function useLinks() {
  const [links, setLinksState] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  /* Écrit l'objet final dans localStorage (toujours un objet, jamais un updater fn) */
  const save = useCallback((next) => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)); }
    catch (e) { console.warn('LibIntegrationGED: localStorage indisponible', e); }
  }, []);

  /** Créer ou remplacer un lien physDoc → gedDoc */
  const link = useCallback((physDocId, gedDocId) => {
    setLinksState(prev => {
      const next = { ...prev, [physDocId]: gedDocId };
      save(next);
      return next;
    });
  }, [save]);

  /** Déliaison explicite — null écrase le gedDocId venant des props */
  const unlink = useCallback((physDocId) => {
    setLinksState(prev => {
      const next = { ...prev, [physDocId]: null };
      save(next);
      return next;
    });
  }, [save]);

  /** Retire l'entrée locale (restitue le comportement des props) */
  const reset = useCallback((physDocId) => {
    setLinksState(prev => {
      const next = { ...prev };
      delete next[physDocId];
      save(next);
      return next;
    });
  }, [save]);

  return { links, link, unlink, reset };
}

/* ═══════════════════════════════════════════════════
   HOOK — toast notifications légères
═══════════════════════════════════════════════════ */
function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3200);
  }, []);
  return { toasts, show };
}

function ToastContainer({ toasts }) {
  if (!toasts.length) return null;
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          padding: '12px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600, fontFamily: FF,
          background: t.type === 'success' ? '#059669' : t.type === 'error' ? '#dc2626' : '#2563eb',
          color: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,.18)',
          animation: 'slideInRight .25s ease',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {t.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {t.message}
        </div>
      ))}
      <style>{`@keyframes slideInRight { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }`}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
═══════════════════════════════════════════════════ */
export default function LibIntegrationGED({ documents = [], gedDocs = [], emplacements = [], contenants = [], users = [] }) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const c = () => setIsMobile(window.innerWidth < 768);
    c();
    window.addEventListener('resize', c);
    return () => window.removeEventListener('resize', c);
  }, []);

  const [tab, setTab] = useState('dashboard');
  const [showLinkModal, setShowLinkModal] = useState(null); // doc physique à lier
  const [showRelinkModal, setShowRelinkModal] = useState(null); // doc avec lien cassé à recorriger

  /* ── Persistance des liens ── */
  const { links, link, unlink, reset } = useLinks();
  const { toasts, show: showToast } = useToast();

  /**
   * enrichedDocuments : fusion des documents props + liens localStorage
   * Règle de priorité :
   *   1. Si links[d.id] === null   → déliaison explicite
   *   2. Si links[d.id] est string → liaison manuelle (écrase prop)
   *   3. Sinon                     → conserve les props (gedDocId + gedDoc)
   */
  const enrichedDocuments = useMemo(() => {
    return documents.map(d => {
      if (d.id in links) {
        const overrideId = links[d.id];
        if (overrideId === null) {
          // Déliaison explicite
          return { ...d, gedDocId: null, gedDoc: null, _linkSource: 'manual_unlinked' };
        }
        const gedDoc = gedDocs.find(g => g.id === overrideId) || null;
        return { ...d, gedDocId: overrideId, gedDoc, _linkSource: 'manual' };
      }
      // Lien issu des props : enrichir gedDoc si absent
      if (d.gedDocId && !d.gedDoc) {
        const gedDoc = gedDocs.find(g => g.id === d.gedDocId) || null;
        return { ...d, gedDoc, _linkSource: gedDoc ? 'prop' : 'broken_prop' };
      }
      return { ...d, _linkSource: d.gedDocId ? 'prop' : 'none' };
    });
  }, [documents, gedDocs, links]);

  /* ── Handlers exposés aux enfants ── */
  const handleLink = useCallback((physDocId, gedDocId) => {
    link(physDocId, gedDocId);
    const doc = documents.find(d => d.id === physDocId);
    const ged = gedDocs.find(g => g.id === gedDocId);
    showToast(`✓ Lié : ${doc?.titre || physDocId} → ${ged?.titre || gedDocId}`);
    setShowLinkModal(null);
    setShowRelinkModal(null);
  }, [link, documents, gedDocs, showToast]);

  const handleUnlink = useCallback((physDocId) => {
    const doc = enrichedDocuments.find(d => d.id === physDocId);
    unlink(physDocId);
    showToast(`Délié : ${doc?.titre || physDocId}`, 'info');
  }, [unlink, enrichedDocuments, showToast]);

  /* ── Analyses croisées ── */
  const analysis = useMemo(() => {
    const linked = enrichedDocuments.filter(d => d.gedDocId && d.gedDoc);
    const unlinkedDocs = enrichedDocuments.filter(d => !d.gedDocId);
    const brokenLink = enrichedDocuments.filter(d => d.gedDocId && !d.gedDoc);
    const linkedGedIds = new Set(enrichedDocuments.filter(d => d.gedDocId).map(d => d.gedDocId));
    const orphanGed = gedDocs.filter(g => !linkedGedIds.has(g.id));

    const divergences = linked.filter(d => {
      const g = d.gedDoc;
      if (!g) return false;
      const titleDiff = g.titre && d.titre && g.titre.toLowerCase().replace(/\s+/g, '') !== d.titre.toLowerCase().replace(/\s+/g, '');
      const serviceDiff = g.service && d.service && g.service !== d.service;
      return titleDiff || serviceDiff;
    }).map(d => ({
      physDoc: d,
      gedDoc: d.gedDoc,
      issues: [
        ...(d.gedDoc.titre && d.titre && d.gedDoc.titre.toLowerCase().replace(/\s+/g, '') !== d.titre.toLowerCase().replace(/\s+/g, '') ? [{ field: 'titre', phys: d.titre, ged: d.gedDoc.titre }] : []),
        ...(d.gedDoc.service && d.service && d.gedDoc.service !== d.service ? [{ field: 'service', phys: d.service, ged: d.gedDoc.service }] : []),
      ],
    }));

    const byEmpl = {};
    emplacements.forEach(e => { byEmpl[e.id] = { empl: e, total: 0, linked: 0 }; });
    enrichedDocuments.forEach(d => {
      const contenant = contenants.find(c => c.id === d.contenantId);
      const eid = contenant?.emplacementId || 'unknown';
      if (byEmpl[eid]) { byEmpl[eid].total++; if (d.gedDocId && d.gedDoc) byEmpl[eid].linked++; }
    });

    const queue = unlinkedDocs.map((d, i) => ({
      ...d,
      priorite: d.confidentialite === 'confidentiel' ? 3 : d.categorie === 'PV' ? 2 : d.categorie === 'Contrat' ? 2 : 1,
      queueStatut: i < 2 ? 'en_cours' : i < 4 ? 'controle' : 'en_attente',
      operateur: i < 4 ? (users[i % users.length]?.nom || 'Non assigné') : null,
    }));

    return { linked, unlinked: unlinkedDocs, brokenLink, orphanGed, divergences, byEmpl: Object.values(byEmpl), queue };
  }, [enrichedDocuments, gedDocs, emplacements, contenants, users]);

  const totalDocs = enrichedDocuments.length;
  const tauxNum = totalDocs > 0 ? Math.round(analysis.linked.length / totalDocs * 100) : 0;

  const TABS = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'liaison', label: 'Liaison', icon: Link2 },
    { id: 'numerisation', label: 'Numérisation', icon: ScanLine },
    { id: 'incoherences', label: `Incohérences (${analysis.brokenLink.length + analysis.divergences.length})`, icon: AlertTriangle },
    { id: 'recherche', label: 'Recherche unifiée', icon: Search },
    { id: 'versement', label: 'Versement', icon: Upload },
  ];

  return (
    <div>
      <ToastContainer toasts={toasts} />

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: isMobile ? 20 : 24, fontWeight: 700 }}>Intégration GED — SoftDocs</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: COLORS.textMut }}>Liaison archives physiques ↔ documents numériques SoftDocs</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap', overflowX: 'auto', paddingBottom: 4 }}>
        {TABS.map(t =>
          <button key={t.id} onClick={() => setTab(t.id)} style={{ ...pill(tab === t.id), display: 'inline-flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
            <t.icon size={14} />{t.label}
          </button>
        )}
      </div>

      {tab === 'dashboard' && <DashboardTab analysis={analysis} tauxNum={tauxNum} totalDocs={totalDocs} gedDocs={gedDocs} isMobile={isMobile} onTab={setTab} />}
      {tab === 'liaison' && (
        <LiaisonTab
          documents={enrichedDocuments}
          gedDocs={gedDocs}
          analysis={analysis}
          isMobile={isMobile}
          onLink={setShowLinkModal}
          onUnlink={handleUnlink}
          onRelink={setShowRelinkModal}
        />
      )}
      {tab === 'numerisation' && <NumerisationTab queue={analysis.queue} emplacements={emplacements} isMobile={isMobile} />}
      {tab === 'incoherences' && (
        <IncoherencesTab
          analysis={analysis}
          isMobile={isMobile}
          onRelink={setShowRelinkModal}
          onUnlink={handleUnlink}
        />
      )}
      {tab === 'recherche' && <RechercheTab documents={enrichedDocuments} gedDocs={gedDocs} isMobile={isMobile} />}
      {tab === 'versement' && <VersementTab documents={enrichedDocuments} analysis={analysis} isMobile={isMobile} />}

      {/* Modal liaison (nouveau lien) */}
      {showLinkModal && (
        <LinkModal
          doc={showLinkModal}
          gedDocs={gedDocs}
          documents={enrichedDocuments}
          isMobile={isMobile}
          onClose={() => setShowLinkModal(null)}
          onConfirm={(gedDocId) => handleLink(showLinkModal.id, gedDocId)}
        />
      )}

      {/* Modal re-liaison (lien cassé) */}
      {showRelinkModal && (
        <LinkModal
          doc={showRelinkModal}
          gedDocs={gedDocs}
          documents={enrichedDocuments}
          isMobile={isMobile}
          onClose={() => setShowRelinkModal(null)}
          onConfirm={(gedDocId) => handleLink(showRelinkModal.id, gedDocId)}
          isRelink
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DASHBOARD TAB
═══════════════════════════════════════════════════════════════ */
function DashboardTab({ analysis, tauxNum, totalDocs, gedDocs, isMobile, onTab }) {
  const a = analysis;
  return (
    <div>
      {/* KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(5,1fr)', gap: isMobile ? 10 : 14, marginBottom: 24 }}>
        {[
          { label: 'Taux numérisation', value: `${tauxNum}%`, sub: `${a.linked.length}/${totalDocs} liés`, color: tauxNum >= 70 ? '#059669' : tauxNum >= 40 ? '#d97706' : '#dc2626', bg: '#ecfdf5', icon: BarChart3 },
          { label: 'Liés', value: a.linked.length, sub: 'physique ↔ GED', color: '#059669', bg: '#ecfdf5', icon: Link2 },
          { label: 'Non liés', value: a.unlinked.length, sub: 'à numériser', color: '#d97706', bg: '#fffbeb', icon: Link2Off },
          { label: 'Orphelins GED', value: a.orphanGed.length, sub: 'sans archive physique', color: '#7c3aed', bg: '#f5f3ff', icon: Monitor },
          { label: 'Incohérences', value: a.brokenLink.length + a.divergences.length, sub: `${a.brokenLink.length} liens cassés`, color: a.brokenLink.length > 0 ? '#dc2626' : '#64748b', bg: '#fef2f2', icon: AlertTriangle },
        ].map((k, i) => (
          <div key={i} style={{ ...card, padding: isMobile ? 14 : 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 11, color: COLORS.textMut, marginBottom: 4, fontWeight: 500 }}>{k.label}</div>
                <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 700, color: k.color }}>{k.value}</div>
                <div style={{ fontSize: 11, color: COLORS.textMut, marginTop: 2 }}>{k.sub}</div>
              </div>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><k.icon size={18} color={k.color} /></div>
            </div>
          </div>
        ))}
      </div>

      {/* Jauge globale */}
      <div style={{ ...card, padding: 20, marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700 }}>Progression de la numérisation</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
          <div style={{ flex: 1, height: 16, background: '#e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ width: `${tauxNum}%`, height: '100%', background: `linear-gradient(90deg,#059669,#10b981)`, borderRadius: 8, transition: 'width .5s ease' }} />
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, color: tauxNum >= 70 ? '#059669' : '#d97706' }}>{tauxNum}%</span>
        </div>
        <div style={{ display: 'flex', gap: 24, fontSize: 12 }}>
          <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: '#059669', marginRight: 6, verticalAlign: 'middle' }} />Liés ({a.linked.length})</span>
          <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: '#d97706', marginRight: 6, verticalAlign: 'middle' }} />Non liés ({a.unlinked.length})</span>
          <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: '#dc2626', marginRight: 6, verticalAlign: 'middle' }} />Liens cassés ({a.brokenLink.length})</span>
        </div>
      </div>

      {/* Taux par emplacement + actions */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
        <div style={{ ...card, padding: 20 }}>
          <h4 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700 }}>Numérisation par emplacement</h4>
          {a.byEmpl.filter(e => e.total > 0).sort((a, b) => b.total - a.total).map(e => {
            const pct = e.total > 0 ? Math.round(e.linked / e.total * 100) : 0;
            return (
              <div key={e.empl.id} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{e.empl.nom || e.empl.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: pct >= 70 ? '#059669' : pct >= 40 ? '#d97706' : '#dc2626' }}>{e.linked}/{e.total} ({pct}%)</span>
                </div>
                <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3 }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: pct >= 70 ? '#059669' : pct >= 40 ? '#d97706' : '#dc2626', borderRadius: 3 }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions rapides */}
        <div style={{ ...card, padding: 20 }}>
          <h4 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700 }}>Actions rapides</h4>
          <div style={{ display: 'grid', gap: 10 }}>
            {[
              { label: 'Lier les documents', sub: `${a.unlinked.length} en attente de liaison`, icon: Link2, color: '#2563eb', onClick: () => onTab('liaison') },
              { label: 'File de numérisation', sub: `${a.queue.filter(q => q.queueStatut === 'en_attente').length} en attente de scan`, icon: ScanLine, color: '#d97706', onClick: () => onTab('numerisation') },
              { label: 'Corriger incohérences', sub: `${a.brokenLink.length + a.divergences.length} à traiter`, icon: AlertTriangle, color: '#dc2626', onClick: () => onTab('incoherences') },
              { label: 'Versement numérique', sub: 'Créer un lot de numérisation', icon: Upload, color: '#7c3aed', onClick: () => onTab('versement') },
            ].map((act, i) => (
              <button key={i} onClick={act.onClick} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, borderRadius: 10, border: `1px solid ${COLORS.border}`, background: '#fff', cursor: 'pointer', textAlign: 'left', fontFamily: FF, width: '100%', transition: 'all .15s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = act.color}
                onMouseLeave={e => e.currentTarget.style.borderColor = COLORS.border}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: `${act.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><act.icon size={18} color={act.color} /></div>
                <div><div style={{ fontSize: 13, fontWeight: 600 }}>{act.label}</div><div style={{ fontSize: 11, color: COLORS.textMut }}>{act.sub}</div></div>
                <ChevronRight size={16} color={COLORS.textMut} style={{ marginLeft: 'auto' }} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LIAISON TAB — vue split physique ↔ numérique
   Props supplémentaires :
     onLink(doc)        → ouvre LinkModal (nouveau lien)
     onUnlink(physDocId) → déliaison
     onRelink(doc)      → ouvre LinkModal en mode re-liaison
═══════════════════════════════════════════════════════════════ */
function LiaisonTab({ documents, gedDocs, analysis, isMobile, onLink, onUnlink, onRelink }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [confirmUnlink, setConfirmUnlink] = useState(null); // doc à délier

  const filtered = useMemo(() => {
    let list = documents;
    if (filter === 'linked') list = analysis.linked;
    else if (filter === 'unlinked') list = analysis.unlinked;
    else if (filter === 'broken') list = analysis.brokenLink;
    if (search) list = list.filter(d =>
      (d.titre || '').toLowerCase().includes(search.toLowerCase()) ||
      d.id.toLowerCase().includes(search.toLowerCase())
    );
    return list;
  }, [documents, analysis, filter, search]);

  /* Badge source du lien */
  const LinkSourceBadge = ({ source }) => {
    if (source === 'manual') return <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#eff6ff', color: '#2563eb', marginLeft: 4 }}>MANUEL</span>;
    if (source === 'prop') return <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#f0fdf4', color: '#059669', marginLeft: 4 }}>AUTO</span>;
    return null;
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        {[
          { id: 'all', label: `Tous (${documents.length})` },
          { id: 'linked', label: `Liés (${analysis.linked.length})` },
          { id: 'unlinked', label: `Non liés (${analysis.unlinked.length})` },
          { id: 'broken', label: `Liens cassés (${analysis.brokenLink.length})` },
        ].map(f =>
          <button key={f.id} onClick={() => setFilter(f.id)} style={pill(filter === f.id)}>{f.label}</button>
        )}
        <div style={{ flex: 1 }} />
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: COLORS.textMut }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." style={{ ...inp, paddingLeft: 30, width: isMobile ? '100%' : 220 }} />
        </div>
      </div>

      <div style={{ ...card }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 800 }}>
            <thead>
              <tr style={{ background: COLORS.primaryLighter }}>
                {['Doc physique', 'Titre', 'Service', '', 'Doc GED lié', 'Statut GED', 'Actions'].map((h, i) =>
                  <th key={i} style={{ padding: '10px 14px', textAlign: i === 3 ? 'center' : 'left', fontSize: 11, fontWeight: 700, color: COLORS.textSec, whiteSpace: 'nowrap' }}>{h}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 50).map(d => {
                const hasGed = !!(d.gedDocId && d.gedDoc);
                const broken = !!(d.gedDocId && !d.gedDoc);
                return (
                  <tr key={d.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    {/* Doc physique */}
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: 11, color: COLORS.primaryLight }}>{d.id}</div>
                    </td>
                    {/* Titre */}
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{d.titre}</div>
                      <div style={{ fontSize: 10, color: COLORS.textMut }}>{d.categorie}</div>
                    </td>
                    {/* Service */}
                    <td style={{ padding: '10px 14px', fontSize: 11, color: COLORS.textSec }}>{d.service}</td>
                    {/* Icône statut lien */}
                    <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                      {hasGed
                        ? <Link2 size={16} color="#059669" title="Document lié" />
                        : broken
                          ? <AlertCircle size={16} color="#dc2626" title="Lien cassé" />
                          : <Link2Off size={16} color="#94a3b8" title="Non lié" />
                      }
                    </td>
                    {/* Doc GED */}
                    <td style={{ padding: '10px 14px' }}>
                      {hasGed ? (
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: 11, color: '#7c3aed' }}>{d.gedDocId}</span>
                            <LinkSourceBadge source={d._linkSource} />
                          </div>
                          <div style={{ fontSize: 11, color: COLORS.textSec, marginTop: 2 }}>{d.gedDoc.titre}</div>
                        </div>
                      ) : broken ? (
                        <div style={{ color: '#dc2626', fontSize: 11, fontWeight: 600 }}>⚠ {d.gedDocId} — introuvable</div>
                      ) : (
                        <span style={{ fontSize: 11, color: COLORS.textMut, fontStyle: 'italic' }}>Non lié</span>
                      )}
                    </td>
                    {/* Statut GED */}
                    <td style={{ padding: '10px 14px' }}>
                      {hasGed && d.gedDoc.statut && <Badge label={d.gedDoc.statut} color="#059669" />}
                    </td>
                    {/* Actions */}
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'nowrap' }}>
                        {!hasGed && !broken && (
                          <ActionBtn icon={Link2} label="Lier" variant="primary" onClick={() => onLink(d)} />
                        )}
                        {hasGed && (
                          <>
                            <ActionBtn icon={RefreshCw} label="Changer" variant="ghost" onClick={() => onRelink(d)} title="Changer le document GED lié" />
                            <ActionBtn icon={Link2Off} label="Délier" variant="ghost" onClick={() => setConfirmUnlink(d)} />
                          </>
                        )}
                        {broken && (
                          <ActionBtn icon={Link2} label="Re-lier" variant="danger" onClick={() => onRelink(d)} />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length > 50 && (
          <div style={{ padding: 12, textAlign: 'center', fontSize: 12, color: COLORS.textMut }}>
            {filtered.length - 50} documents supplémentaires non affichés
          </div>
        )}
        {filtered.length === 0 && (
          <div style={{ padding: 32, textAlign: 'center', color: COLORS.textMut, fontSize: 13 }}>
            Aucun document correspondant au filtre
          </div>
        )}
      </div>

      {/* Orphelins GED */}
      {analysis.orphanGed.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Monitor size={16} color="#7c3aed" />Documents GED orphelins ({analysis.orphanGed.length})
          </h3>
          <div style={{ ...card }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: '#f5f3ff' }}>
                    {['Réf GED', 'Titre', 'Type', 'Service', 'Statut'].map((h, i) =>
                      <th key={i} style={{ padding: '8px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: COLORS.textSec }}>{h}</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {analysis.orphanGed.slice(0, 15).map(g => (
                    <tr key={g.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                      <td style={{ padding: '8px 14px', fontFamily: 'monospace', fontSize: 11, color: '#7c3aed', fontWeight: 600 }}>{g.id}</td>
                      <td style={{ padding: '8px 14px', fontWeight: 500 }}>{g.titre}</td>
                      <td style={{ padding: '8px 14px', color: COLORS.textSec }}>{g.type || g.categorie || '—'}</td>
                      <td style={{ padding: '8px 14px', color: COLORS.textSec }}>{g.service || '—'}</td>
                      <td style={{ padding: '8px 14px' }}>{g.statut && <Badge label={g.statut} color="#475569" />}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation déliaison */}
      {confirmUnlink && (
        <LocalModal title="Confirmer la déliaison" onClose={() => setConfirmUnlink(null)} width={480}>
          <div style={{ padding: 24 }}>
            <div style={{ background: '#fef2f2', borderRadius: 8, padding: 16, marginBottom: 20, border: '1px solid #fecaca' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <AlertTriangle size={18} color="#dc2626" style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>Délier ce document ?</div>
                  <div style={{ fontSize: 12, color: COLORS.textSec }}>
                    <strong>{confirmUnlink.titre}</strong> sera délié de <strong>{confirmUnlink.gedDocId}</strong>.
                    <br />Cette action est réversible via le bouton "Lier".
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <ActionBtn label="Annuler" variant="ghost" onClick={() => setConfirmUnlink(null)} />
              <ActionBtn
                icon={Link2Off}
                label="Confirmer la déliaison"
                variant="danger"
                onClick={() => { onUnlink(confirmUnlink.id); setConfirmUnlink(null); }}
              />
            </div>
          </div>
        </LocalModal>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NUMÉRISATION TAB — file d'attente
═══════════════════════════════════════════════════════════════ */
function NumerisationTab({ queue, emplacements, isMobile }) {
  const [filterSt, setFilterSt] = useState('all');
  const PRIO = { 3: { label: 'Urgent', color: '#dc2626' }, 2: { label: 'Haute', color: '#d97706' }, 1: { label: 'Normale', color: '#64748b' } };
  const QST = {
    en_attente: { label: 'En attente', color: '#94a3b8', bg: '#f8fafc' },
    en_cours: { label: 'En cours scan', color: '#2563eb', bg: '#eff6ff' },
    controle: { label: 'Contrôle qualité', color: '#d97706', bg: '#fffbeb' },
  };

  const counts = { en_attente: 0, en_cours: 0, controle: 0 };
  queue.forEach(q => { counts[q.queueStatut] = (counts[q.queueStatut] || 0) + 1; });
  const filtered = filterSt === 'all' ? queue : queue.filter(q => q.queueStatut === filterSt);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: "File d'attente", count: counts.en_attente, color: '#94a3b8', icon: Inbox },
          { label: 'En cours de scan', count: counts.en_cours, color: '#2563eb', icon: ScanLine },
          { label: 'Contrôle qualité', count: counts.controle, color: '#d97706', icon: ListChecks },
          { label: 'Terminés / Liés', count: 0, color: '#059669', icon: CheckCircle2 },
        ].map((s, i) => (
          <div key={i} style={{ ...card, padding: 16, borderLeft: `4px solid ${s.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <s.icon size={16} color={s.color} />
              <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.textSec }}>{s.label}</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.count}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {[{ id: 'all', label: 'Tous' }, { id: 'en_attente', label: 'En attente' }, { id: 'en_cours', label: 'En cours' }, { id: 'controle', label: 'Contrôle QC' }].map(f =>
          <button key={f.id} onClick={() => setFilterSt(f.id)} style={pill(filterSt === f.id)}>{f.label}</button>
        )}
      </div>

      <div style={{ ...card }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 700 }}>
            <thead>
              <tr style={{ background: COLORS.primaryLighter }}>
                {['Document', 'Catégorie', 'Service', 'Priorité', 'Statut', 'Opérateur'].map((h, i) =>
                  <th key={i} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: COLORS.textSec }}>{h}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => {
                const p = PRIO[d.priorite] || PRIO[1];
                const st = QST[d.queueStatut] || QST.en_attente;
                return (
                  <tr key={d.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ fontWeight: 600 }}>{d.titre}</div>
                      <div style={{ fontSize: 10, fontFamily: 'monospace', color: COLORS.textMut }}>{d.id}</div>
                    </td>
                    <td style={{ padding: '10px 14px', color: COLORS.textSec }}>{d.categorie}</td>
                    <td style={{ padding: '10px 14px', color: COLORS.textSec }}>{d.service}</td>
                    <td style={{ padding: '10px 14px' }}><span style={{ fontWeight: 600, color: p.color }}>⚡ {p.label}</span></td>
                    <td style={{ padding: '10px 14px' }}><span style={{ padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: st.bg, color: st.color }}>{st.label}</span></td>
                    <td style={{ padding: '10px 14px', fontSize: 11 }}>{d.operateur || <span style={{ color: COLORS.textMut, fontStyle: 'italic' }}>Non assigné</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   INCOHÉRENCES TAB
═══════════════════════════════════════════════════════════════ */
function IncoherencesTab({ analysis, isMobile, onRelink, onUnlink }) {
  const a = analysis;
  return (
    <div>
      {/* Liens cassés */}
      <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
        <AlertCircle size={16} color="#dc2626" />Liens cassés ({a.brokenLink.length})
      </h3>
      {a.brokenLink.length === 0 ? (
        <div style={{ ...card, padding: 30, textAlign: 'center', color: '#059669', marginBottom: 20 }}>
          <CheckCircle2 size={24} />
          <div style={{ marginTop: 8, fontWeight: 600 }}>Aucun lien cassé</div>
        </div>
      ) : (
        <div style={{ ...card, marginBottom: 20 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: '#fef2f2' }}>
                  {['Doc physique', 'Titre', 'gedDocId attendu', 'Actions'].map((h, i) =>
                    <th key={i} style={{ padding: '8px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: COLORS.textSec }}>{h}</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {a.brokenLink.map(d => (
                  <tr key={d.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    <td style={{ padding: '8px 14px', fontFamily: 'monospace', fontWeight: 600, color: COLORS.primaryLight }}>{d.id}</td>
                    <td style={{ padding: '8px 14px', fontWeight: 500 }}>{d.titre}</td>
                    <td style={{ padding: '8px 14px', fontFamily: 'monospace', color: '#dc2626' }}>{d.gedDocId}</td>
                    <td style={{ padding: '8px 14px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <ActionBtn icon={Link2} label="Re-lier" variant="primary" onClick={() => onRelink(d)} />
                        <ActionBtn icon={X} label="Supprimer lien" variant="ghost" onClick={() => onUnlink(d.id)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Divergences métadonnées */}
      <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
        <ArrowLeftRight size={16} color="#d97706" />Divergences métadonnées ({a.divergences.length})
      </h3>
      {a.divergences.length === 0 ? (
        <div style={{ ...card, padding: 30, textAlign: 'center', color: '#059669' }}>
          <CheckCircle2 size={24} />
          <div style={{ marginTop: 8, fontWeight: 600 }}>Aucune divergence détectée</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {a.divergences.map((dv, i) => (
            <div key={i} style={{ ...card, padding: 16, borderLeft: '4px solid #d97706' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600, color: COLORS.primaryLight }}>{dv.physDoc.id}</span>
                  <span style={{ color: COLORS.textMut, margin: '0 8px' }}>↔</span>
                  <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600, color: '#7c3aed' }}>{dv.gedDoc.id}</span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Btn icon={ArrowRight} label="Sync → GED" size="sm" variant="ghost" />
                  <Btn icon={ChevronLeft} label="Sync ← GED" size="sm" variant="ghost" />
                </div>
              </div>
              <table style={{ width: '100%', fontSize: 12 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '4px 8px', color: COLORS.textMut, fontSize: 11 }}>Champ</th>
                    <th style={{ textAlign: 'left', padding: '4px 8px', color: COLORS.textMut, fontSize: 11 }}>Archive physique</th>
                    <th style={{ textAlign: 'left', padding: '4px 8px', color: COLORS.textMut, fontSize: 11 }}>Document GED</th>
                  </tr>
                </thead>
                <tbody>
                  {dv.issues.map((is, j) => (
                    <tr key={j}>
                      <td style={{ padding: '4px 8px', fontWeight: 600, textTransform: 'capitalize' }}>{is.field}</td>
                      <td style={{ padding: '4px 8px', background: '#fef2f2', borderRadius: 4 }}>{is.phys}</td>
                      <td style={{ padding: '4px 8px', background: '#eff6ff', borderRadius: 4 }}>{is.ged}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   RECHERCHE UNIFIÉE
═══════════════════════════════════════════════════════════════ */
function RechercheTab({ documents, gedDocs, isMobile }) {
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState('all');

  const results = useMemo(() => {
    if (!query || query.length < 2) return { phys: [], ged: [] };
    const q = query.toLowerCase();
    const phys = documents.filter(d =>
      (d.titre || '').toLowerCase().includes(q) ||
      d.id.toLowerCase().includes(q) ||
      (d.service || '').toLowerCase().includes(q) ||
      (d.categorie || '').toLowerCase().includes(q)
    );
    const ged = gedDocs.filter(g =>
      (g.titre || '').toLowerCase().includes(q) ||
      g.id.toLowerCase().includes(q) ||
      (g.service || '').toLowerCase().includes(q) ||
      (g.type || '').toLowerCase().includes(q)
    );
    return { phys, ged };
  }, [query, documents, gedDocs]);

  const showPhys = scope === 'all' || scope === 'phys';
  const showGed = scope === 'all' || scope === 'ged';
  const total = (showPhys ? results.phys.length : 0) + (showGed ? results.ged.length : 0);

  return (
    <div>
      <div style={{ ...card, padding: 20, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 11, color: COLORS.textMut }} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Rechercher dans les deux systèmes..." style={{ ...inp, paddingLeft: 36, fontSize: 14 }} autoFocus />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[{ id: 'all', label: 'Tous', icon: Globe }, { id: 'phys', label: 'Physique', icon: FileText }, { id: 'ged', label: 'GED', icon: Monitor }].map(s =>
              <button key={s.id} onClick={() => setScope(s.id)} style={{ ...pill(scope === s.id), display: 'inline-flex', alignItems: 'center', gap: 4 }}><s.icon size={13} />{s.label}</button>
            )}
          </div>
        </div>
        {query.length >= 2 && <div style={{ marginTop: 10, fontSize: 12, color: COLORS.textMut }}>{total} résultat{total > 1 ? 's' : ''} trouvé{total > 1 ? 's' : ''}</div>}
      </div>

      {query.length >= 2 && (
        <div style={{ display: 'grid', gridTemplateColumns: (!isMobile && scope === 'all') ? '1fr 1fr' : '1fr', gap: 16 }}>
          {showPhys && (
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <FileText size={14} color={COLORS.primary} />Archives physiques ({results.phys.length})
              </h4>
              <div style={{ ...card }}>
                {results.phys.slice(0, 15).map(d => (
                  <div key={d.id} style={{ padding: '10px 14px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FileText size={16} color={COLORS.primaryLight} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{d.titre}</div>
                      <div style={{ fontSize: 11, color: COLORS.textMut }}>{d.id} • {d.categorie} • {d.service}</div>
                    </div>
                    {d.gedDoc ? <Link2 size={14} color="#059669" title="Lié à GED" /> : <Link2Off size={14} color="#94a3b8" title="Non lié" />}
                  </div>
                ))}
                {results.phys.length === 0 && <div style={{ padding: 20, textAlign: 'center', color: COLORS.textMut, fontSize: 12 }}>Aucun résultat</div>}
              </div>
            </div>
          )}

          {showGed && (
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Monitor size={14} color="#7c3aed" />Documents GED ({results.ged.length})
              </h4>
              <div style={{ ...card }}>
                {results.ged.slice(0, 15).map(g => {
                  const hasPhys = documents.some(d => d.gedDocId === g.id);
                  return (
                    <div key={g.id} style={{ padding: '10px 14px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Monitor size={16} color="#7c3aed" />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{g.titre}</div>
                        <div style={{ fontSize: 11, color: COLORS.textMut }}>{g.id} • {g.type || g.categorie || '—'} • {g.service || '—'}</div>
                      </div>
                      {hasPhys
                        ? <Link2 size={14} color="#059669" title="Lié à physique" />
                        : <span style={{ fontSize: 10, color: '#7c3aed', fontWeight: 600 }}>GED only</span>
                      }
                    </div>
                  );
                })}
                {results.ged.length === 0 && <div style={{ padding: 20, textAlign: 'center', color: COLORS.textMut, fontSize: 12 }}>Aucun résultat</div>}
              </div>
            </div>
          )}
        </div>
      )}

      {query.length < 2 && (
        <div style={{ ...card, padding: 40, textAlign: 'center' }}>
          <Search size={32} color={COLORS.textMut} style={{ marginBottom: 12 }} />
          <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.textSec }}>Recherche cross-système</div>
          <div style={{ fontSize: 12, color: COLORS.textMut, marginTop: 4 }}>
            Tapez au moins 2 caractères pour rechercher dans les archives physiques et la GED SoftDocs simultanément
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   VERSEMENT NUMÉRIQUE
═══════════════════════════════════════════════════════════════ */
function VersementTab({ documents, analysis, isMobile }) {
  const [selected, setSelected] = useState(new Set());
  const [showBordereau, setShowBordereau] = useState(false);
  const unlinked = analysis.unlinked;

  const toggle = (id) => setSelected(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => setSelected(p => p.size === unlinked.length ? new Set() : new Set(unlinked.map(d => d.id)));

  return (
    <div>
      <div style={{ ...card, padding: 20, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Versement numérique en masse</h3>
            <div style={{ fontSize: 12, color: COLORS.textMut, marginTop: 4 }}>Sélectionnez les documents physiques à envoyer pour numérisation dans SoftDocs</div>
          </div>
          <Btn icon={Upload} label={`Créer versement (${selected.size})`} disabled={selected.size === 0} onClick={() => setShowBordereau(true)} />
        </div>
      </div>

      <div style={{ ...card }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 600 }}>
            <thead>
              <tr style={{ background: COLORS.primaryLighter }}>
                <th style={{ padding: '10px 14px', textAlign: 'left', width: 40 }}>
                  <input type="checkbox" checked={selected.size === unlinked.length && unlinked.length > 0} onChange={toggleAll} />
                </th>
                {['Réf', 'Titre', 'Catégorie', 'Service', 'Date', 'Conf.'].map((h, i) =>
                  <th key={i} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: COLORS.textSec }}>{h}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {unlinked.map(d => (
                <tr key={d.id} style={{ borderBottom: `1px solid ${COLORS.border}`, background: selected.has(d.id) ? '#eff6ff' : 'transparent' }}>
                  <td style={{ padding: '10px 14px' }}><input type="checkbox" checked={selected.has(d.id)} onChange={() => toggle(d.id)} /></td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: 11, fontWeight: 600, color: COLORS.primaryLight }}>{d.id}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 500 }}>{d.titre}</td>
                  <td style={{ padding: '10px 14px', color: COLORS.textSec }}>{d.categorie}</td>
                  <td style={{ padding: '10px 14px', color: COLORS.textSec }}>{d.service}</td>
                  <td style={{ padding: '10px 14px', fontSize: 11 }}>{d.dateDocument}</td>
                  <td style={{ padding: '10px 14px' }}>{d.confidentialite && <Badge label={d.confidentialite} color={d.confidentialite === 'confidentiel' ? '#dc2626' : '#64748b'} />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {unlinked.length === 0 && (
          <div style={{ padding: 30, textAlign: 'center', color: '#059669' }}>
            <CheckCircle2 size={24} />
            <div style={{ marginTop: 8, fontWeight: 600 }}>Tous les documents sont déjà liés à la GED</div>
          </div>
        )}
      </div>

      {showBordereau && (
        <LocalModal title="Bordereau de versement numérique" onClose={() => setShowBordereau(false)} width={600}>
          <div style={{ padding: 20 }}>
            <div style={{ background: '#f8fafc', borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><span style={{ fontSize: 11, color: COLORS.textMut }}>N° Bordereau</span><div style={{ fontWeight: 700, fontFamily: 'monospace' }}>BV-NUM-{new Date().toISOString().slice(0, 10).replace(/-/g, '')}</div></div>
                <div><span style={{ fontSize: 11, color: COLORS.textMut }}>Date</span><div style={{ fontWeight: 600 }}>{new Date().toLocaleDateString('fr-FR')}</div></div>
                <div><span style={{ fontSize: 11, color: COLORS.textMut }}>Documents</span><div style={{ fontWeight: 700, fontSize: 18, color: COLORS.primary }}>{selected.size}</div></div>
                <div><span style={{ fontSize: 11, color: COLORS.textMut }}>Destination</span><div style={{ fontWeight: 600 }}>Salle numérisation (EMP-010)</div></div>
              </div>
            </div>
            <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 16 }}>
              {[...selected].map(id => {
                const d = documents.find(x => x.id === id);
                return d ? (
                  <div key={id} style={{ padding: '6px 0', borderBottom: `1px solid ${COLORS.border}`, fontSize: 12, display: 'flex', gap: 8 }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 600, color: COLORS.primaryLight }}>{d.id}</span>
                    <span>{d.titre}</span>
                  </div>
                ) : null;
              })}
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <Btn label="Annuler" variant="ghost" onClick={() => setShowBordereau(false)} />
              <Btn icon={Printer} label="Imprimer bordereau" variant="ghost" onClick={() => window.print()} />
              <Btn icon={Upload} label="Confirmer versement" onClick={() => {
                alert(`Versement créé : ${selected.size} documents envoyés en numérisation`);
                setShowBordereau(false);
                setSelected(new Set());
              }} />
            </div>
          </div>
        </LocalModal>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LINK MODAL — lier un document physique à un doc GED
   Props :
     doc        : document physique (avec titre, id, categorie, service)
     gedDocs    : tous les docs GED disponibles
     documents  : tous les docs physiques (pour exclure les GED déjà pris)
     onConfirm(gedDocId) : callback appelé avec l'id GED sélectionné
     isRelink   : true si on re-lie un lien cassé ou on change
═══════════════════════════════════════════════════════════════ */
function LinkModal({ doc, gedDocs, documents, isMobile, onClose, onConfirm, isRelink = false }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null); // gedDocId pré-sélectionné

  // GED déjà pris par d'autres docs (sauf le doc en cours)
  const linkedGedIds = useMemo(() => {
    return new Set(
      documents
        .filter(d => d.gedDocId && d.id !== doc.id)
        .map(d => d.gedDocId)
    );
  }, [documents, doc.id]);

  const available = useMemo(() => {
    return gedDocs
      .filter(g => !linkedGedIds.has(g.id))
      .filter(g =>
        !search ||
        (g.titre || '').toLowerCase().includes(search.toLowerCase()) ||
        g.id.toLowerCase().includes(search.toLowerCase()) ||
        (g.service || '').toLowerCase().includes(search.toLowerCase()) ||
        (g.type || '').toLowerCase().includes(search.toLowerCase())
      );
  }, [gedDocs, linkedGedIds, search]);

  const selectedGed = selected ? gedDocs.find(g => g.id === selected) : null;

  return (
    <LocalModal
      title={isRelink ? `Re-lier : ${doc.titre}` : `Lier à SoftDocs : ${doc.titre}`}
      onClose={onClose}
      width={640}
    >
      <div style={{ padding: 20 }}>

        {/* Infos doc physique */}
        <div style={{ background: '#f8fafc', borderRadius: 10, padding: 14, marginBottom: 16, border: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: 10, color: COLORS.textMut, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Archive physique</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FileText size={20} color={COLORS.primaryLight} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{doc.titre}</div>
              <div style={{ fontSize: 11, color: COLORS.textMut, marginTop: 2 }}>
                {doc.id} • {doc.categorie} • {doc.service}
                {doc.gedDocId && <span style={{ marginLeft: 8, color: '#d97706' }}>⚠ Actuellement lié à : {doc.gedDocId}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Flèche */}
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <ArrowRight size={20} color={COLORS.textMut} style={{ transform: 'rotate(90deg)' }} />
        </div>

        {/* Prévisualisation sélection */}
        {selectedGed && (
          <div style={{ background: '#f0fdf4', borderRadius: 10, padding: 14, marginBottom: 14, border: '1.5px solid #86efac' }}>
            <div style={{ fontSize: 10, color: '#059669', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Document GED sélectionné</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Monitor size={20} color="#7c3aed" />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{selectedGed.titre}</div>
                <div style={{ fontSize: 11, color: COLORS.textMut, marginTop: 2 }}>
                  {selectedGed.id} • {selectedGed.type || selectedGed.categorie || '—'} • {selectedGed.service || '—'}
                </div>
              </div>
              <button onClick={() => setSelected(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: COLORS.textMut, padding: 4 }}>
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Recherche */}
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: 11, color: COLORS.textMut }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher dans SoftDocs (titre, réf, service, type)..."
            style={{ ...inp, paddingLeft: 32 }}
            autoFocus
          />
        </div>

        {/* Liste GED */}
        <div style={{ maxHeight: 280, overflowY: 'auto', border: `1px solid ${COLORS.border}`, borderRadius: 10, marginBottom: 16 }}>
          {available.length === 0 && (
            <div style={{ padding: 24, textAlign: 'center', color: COLORS.textMut, fontSize: 12 }}>
              {gedDocs.length === 0
                ? 'Aucun document GED chargé dans le système'
                : 'Aucun document GED disponible correspondant à la recherche'
              }
            </div>
          )}
          {available.slice(0, 30).map(g => {
            const isSel = selected === g.id;
            return (
              <div
                key={g.id}
                onClick={() => setSelected(isSel ? null : g.id)}
                style={{
                  padding: '11px 14px',
                  borderBottom: `1px solid ${COLORS.border}`,
                  display: 'flex', alignItems: 'center', gap: 10,
                  cursor: 'pointer',
                  background: isSel ? '#f0fdf4' : 'transparent',
                  transition: 'background .1s',
                }}
                onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = '#f8fafc'; }}
                onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = 'transparent'; }}
              >
                {/* Checkbox visuel */}
                <div style={{
                  width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                  border: `2px solid ${isSel ? '#059669' : COLORS.border}`,
                  background: isSel ? '#059669' : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {isSel && <Check size={11} color="#fff" strokeWidth={3} />}
                </div>

                <Monitor size={16} color="#7c3aed" style={{ flexShrink: 0 }} />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.titre}</div>
                  <div style={{ fontSize: 11, color: COLORS.textMut, marginTop: 1 }}>
                    {g.id} • {g.type || g.categorie || '—'} • {g.service || '—'}
                  </div>
                </div>

                {g.statut && <Badge label={g.statut} color="#475569" />}
              </div>
            );
          })}
          {available.length > 30 && (
            <div style={{ padding: 10, textAlign: 'center', fontSize: 11, color: COLORS.textMut }}>
              {available.length - 30} résultats supplémentaires — affinez la recherche
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', borderTop: `1px solid ${COLORS.border}`, paddingTop: 16 }}>
          <ActionBtn label="Annuler" variant="ghost" onClick={onClose} />
          <ActionBtn
            icon={Link2}
            label={isRelink ? 'Confirmer la re-liaison' : 'Confirmer la liaison'}
            variant="primary"
            disabled={!selected}
            onClick={() => selected && onConfirm(selected)}
          />
        </div>
      </div>
    </LocalModal>
  );
}