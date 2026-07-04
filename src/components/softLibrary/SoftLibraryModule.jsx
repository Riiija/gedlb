/* ═══════════════════════════════════════════════════════════════
   SOFT LIBRARY — Module principal (Props-only version)
   
   Cette version reçoit toutes les données via props,
   pour une intégration flexible dans n'importe quel projet.
   
   Usage :
   import SoftLibrary from './softlibrary/SoftLibraryModule';
   import { LIB_DOCUMENTS, LIB_DOC_TYPES, LIB_EMPLACEMENTS, LIB_AUDIT_LOG, INIT_USERS } from './data';
   
   <SoftLibrary
     user={currentUser}
     documents={LIB_DOCUMENTS}
     docTypes={LIB_DOC_TYPES}
     emplacements={LIB_EMPLACEMENTS}
     auditLogs={LIB_AUDIT_LOG}
     users={INIT_USERS}
   />
═══════════════════════════════════════════════════════════════ */
import React, { useState } from 'react';
import {
  LayoutDashboard, FileText, Package, MapPin, ClipboardList,
  Mail, RefreshCw, BarChart3, Settings, ChevronLeft, ChevronRight,
  Home, Menu, Bell, Move,
} from 'lucide-react';
import { COLORS, FONT_FAMILY, GLOBAL_STYLES } from './theme';
import {
  LibDashboard, LibDocuments, LibEmplacements, LibConsultations,
  LibCourrier, LibCycleVie, LibContenants, LibMouvements, LibReporting, LibAdmin,
} from './pages';

const MENU_ITEMS = [
  { id: 'dashboard',      label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'documents',      label: 'Documents',       icon: FileText },
  { id: 'contenants',     label: 'Contenants',      icon: Package },
  { id: 'emplacements',   label: 'Emplacements',    icon: MapPin },
  { id: 'mouvements',     label: 'Mouvements',      icon: Move },
  { id: 'consultations',  label: 'Consultations',   icon: ClipboardList },
  { id: 'courrier',       label: 'Courrier',         icon: Mail },
  { id: 'cycle-vie',      label: 'Cycle de vie',     icon: RefreshCw },
  { id: 'reporting',      label: 'Reporting',        icon: BarChart3 },
  { id: 'administration', label: 'Administration',   icon: Settings },
];

/**
 * @param {Object} props
 * @param {Object} props.user          – Utilisateur connecté { nom, role, init }
 * @param {Array}  props.documents     – LIB_DOCUMENTS from data.js
 * @param {Array}  props.docTypes      – LIB_DOC_TYPES from data.js
 * @param {Array}  props.emplacements  – LIB_EMPLACEMENTS from data.js
 * @param {Array}  props.auditLogs     – LIB_AUDIT_LOG from data.js
 * @param {Array}  props.users         – INIT_USERS from data.js
 * @param {Array}  props.courriers     – Array of courrier items (optional)
 * @param {Array}  props.consultations – Array of consultation items (optional)
 * @param {string} props.defaultPage   – Page initiale (default: 'dashboard')
 * @param {boolean} props.embedded     – Si true, pas de sidebar (mode intégré)
 */
export default function SoftLibraryModule({
  user,
  documents = [],
  docTypes = [],
  emplacements = [],
  auditLogs = [],
  users = [],
  courriers = [],
  consultations = [],
  defaultPage = 'dashboard',
  embedded = false,
}) {
  const [page, setPage]           = useState(defaultPage);
  const [collapsed, setCollapsed] = useState(false);

  const currentMenu = MENU_ITEMS.find((m) => m.id === page);

  const renderPage = () => {
    const common = { documents, docTypes, emplacements, users };
    switch (page) {
      case 'dashboard':      return <LibDashboard {...common} onNavigate={setPage} />;
      case 'documents':      return <LibDocuments {...common} />;
      case 'contenants':     return <LibContenants />;
      case 'emplacements':   return <LibEmplacements emplacements={emplacements} />;
      case 'mouvements':     return <LibMouvements documents={documents} emplacements={emplacements} docTypes={docTypes} auditLogs={auditLogs} />;
      case 'consultations':  return <LibConsultations consultations={consultations} users={users} />;
      case 'courrier':       return <LibCourrier courriers={courriers} />;
      case 'cycle-vie':      return <LibCycleVie documents={documents} docTypes={docTypes} />;
      case 'reporting':      return <LibReporting documents={documents} emplacements={emplacements} />;
      case 'administration': return <LibAdmin docTypes={docTypes} auditLogs={auditLogs} />;
      default:               return <LibDashboard {...common} onNavigate={setPage} />;
    }
  };

  const initials = user?.init || user?.nom?.split(' ').map((n) => n[0]).join('').slice(0, 2) || 'AE';

  /* ── Mode embedded : pas de sidebar ── */
  if (embedded) {
    return (
      <div style={{ fontFamily: FONT_FAMILY, color: COLORS.text }}>
        <style>{GLOBAL_STYLES}</style>
        {/* Tab nav pour mode embedded */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, overflowX: 'auto', borderBottom: `2px solid ${COLORS.border}` }}>
          {MENU_ITEMS.map((m) => {
            const active = page === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setPage(m.id)}
                style={{
                  padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: active ? 700 : 500, whiteSpace: 'nowrap',
                  color: active ? COLORS.primary : COLORS.textMut,
                  borderBottom: active ? `2px solid ${COLORS.primary}` : '2px solid transparent',
                  marginBottom: -2, fontFamily: FONT_FAMILY,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                <m.icon size={16} />
                {m.label}
              </button>
            );
          })}
        </div>
        {renderPage()}
      </div>
    );
  }

  /* ── Mode standalone avec sidebar ── */
  return (
    <div style={{ fontFamily: FONT_FAMILY, background: COLORS.surfaceAlt, minHeight: '100vh', color: COLORS.text }}>
      <style>{GLOBAL_STYLES}</style>

      {/* Sidebar */}
      <aside
        style={{
          width: collapsed ? 64 : 240, height: '100vh', background: '#fff',
          borderRight: `1px solid ${COLORS.border}`,
          position: 'fixed', left: 0, top: 0,
          display: 'flex', flexDirection: 'column',
          transition: 'width .25s ease', zIndex: 100, overflow: 'hidden',
        }}
      >
        <div style={{ padding: collapsed ? '16px 14px' : '16px 18px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg,#0c4a6e,#0369a1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(12,74,110,.3)', flexShrink: 0 }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 18, letterSpacing: -1 }}>S</span>
            </div>
            {!collapsed && (
              <div style={{ lineHeight: 1.1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.primary, letterSpacing: -0.5 }}>Soft <span style={{ color: COLORS.accent }}>Library</span></div>
                <div style={{ fontSize: 9, color: COLORS.textMut, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 1 }}>Archives & Courrier</div>
              </div>
            )}
          </div>
          {!collapsed && <button onClick={() => setCollapsed(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><ChevronLeft size={18} color={COLORS.textMut} /></button>}
        </div>
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
          {MENU_ITEMS.map((m) => {
            const active = page === m.id;
            return (
              <button key={m.id} onClick={() => setPage(m.id)} title={collapsed ? m.label : undefined}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: collapsed ? '10px 0' : '10px 12px', justifyContent: collapsed ? 'center' : 'flex-start', borderRadius: 8, border: 'none', cursor: 'pointer', marginBottom: 2, background: active ? COLORS.primaryLighter : 'transparent', color: active ? COLORS.primary : COLORS.textSec, fontWeight: active ? 700 : 500, fontSize: 13, fontFamily: FONT_FAMILY, transition: 'all .12s' }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = '#f1f5f9'; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
                <m.icon size={19} strokeWidth={active ? 2.2 : 1.8} />
                {!collapsed && <span>{m.label}</span>}
              </button>
            );
          })}
        </nav>
        {!collapsed && <div style={{ padding: '12px 16px', borderTop: `1px solid ${COLORS.border}`, fontSize: 10, color: COLORS.textMut, textAlign: 'center' }}>Soft Library v1.0 • Intégré SoftDocs</div>}
      </aside>

      {/* Main */}
      <div style={{ marginLeft: collapsed ? 64 : 240, transition: 'margin-left .25s ease' }}>
        <header style={{ height: 56, background: '#fff', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {collapsed && <button onClick={() => setCollapsed(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Menu size={20} color={COLORS.textSec} /></button>}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: COLORS.textMut }}>
              <Home size={14} /><span>Soft Library</span><ChevronRight size={12} /><span style={{ color: COLORS.text, fontWeight: 600 }}>{currentMenu?.label}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative' }}><Bell size={20} color={COLORS.textSec} style={{ cursor: 'pointer' }} /><span style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: '50%', background: COLORS.danger, border: '2px solid #fff' }} /></div>
            <div style={{ width: 1, height: 24, background: COLORS.border }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg,${COLORS.primary},${COLORS.primaryLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>{initials}</span></div>
              <div><div style={{ fontSize: 13, fontWeight: 600 }}>{user?.nom || 'Admin'}</div><div style={{ fontSize: 10, color: COLORS.textMut }}>{user?.role || 'Administrateur'}</div></div>
            </div>
          </div>
        </header>
        <main style={{ padding: 24, maxWidth: 1400, margin: '0 auto' }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
