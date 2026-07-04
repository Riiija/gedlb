/* ═══════════════════════════════════════════════════════════════
   SOFT LIBRARY — Module principal
   Layout avec sidebar, header, et navigation
   
   Usage :
   import SoftLibrary from './softlibrary';
   <SoftLibrary user={currentUser} />
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

/* ── Import données centralisées ──
   Adaptez le chemin selon votre structure projet
   import { LIB_DOCUMENTS, LIB_DOC_TYPES, LIB_EMPLACEMENTS, ... } from '../data';
*/
import {
  LIB_DOCUMENTS,
  LIB_DOC_TYPES,
  LIB_EMPLACEMENTS,
  LIB_AUDIT_LOG,
  INIT_USERS,
} from '../data';

/* ═══════════════════════════════════════════
   Menu de navigation
═══════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════
   Composant Principal
═══════════════════════════════════════════ */
export default function SoftLibrary({ user }) {
  const [page, setPage]           = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);

  const currentMenu = MENU_ITEMS.find((m) => m.id === page);

  /* ── Rendu page active ── */
  const renderPage = () => {
    const common = {
      documents: LIB_DOCUMENTS,
      docTypes: LIB_DOC_TYPES,
      emplacements: LIB_EMPLACEMENTS,
      users: INIT_USERS,
    };

    switch (page) {
      case 'dashboard':
        return <LibDashboard {...common} onNavigate={setPage} />;
      case 'documents':
        return <LibDocuments {...common} />;
      case 'contenants':
        return <LibContenants />;
      case 'emplacements':
        return <LibEmplacements emplacements={LIB_EMPLACEMENTS} />;
      case 'mouvements':
        return <LibMouvements {...common} auditLogs={LIB_AUDIT_LOG} />;
      case 'consultations':
        return <LibConsultations users={INIT_USERS} />;
      case 'courrier':
        return <LibCourrier />;
      case 'cycle-vie':
        return <LibCycleVie documents={LIB_DOCUMENTS} docTypes={LIB_DOC_TYPES} />;
      case 'reporting':
        return <LibReporting documents={LIB_DOCUMENTS} emplacements={LIB_EMPLACEMENTS} />;
      case 'administration':
        return <LibAdmin docTypes={LIB_DOC_TYPES} auditLogs={LIB_AUDIT_LOG} />;
      default:
        return <LibDashboard {...common} onNavigate={setPage} />;
    }
  };

  const initials = user?.init || user?.nom?.split(' ').map((n) => n[0]).join('').slice(0, 2) || 'AE';

  return (
    <div style={{ fontFamily: FONT_FAMILY, background: COLORS.surfaceAlt, minHeight: '100vh', color: COLORS.text }}>
      <style>{GLOBAL_STYLES}</style>

      {/* ═══ Sidebar ═══ */}
      <aside
        style={{
          width: collapsed ? 64 : 240,
          height: '100vh',
          background: '#fff',
          borderRight: `1px solid ${COLORS.border}`,
          position: 'fixed', left: 0, top: 0,
          display: 'flex', flexDirection: 'column',
          transition: 'width .25s ease',
          zIndex: 100, overflow: 'hidden',
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: collapsed ? '16px 14px' : '16px 18px',
            borderBottom: `1px solid ${COLORS.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            minHeight: 64,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 10 }}>
            <div
              style={{
                width: 36, height: 36, borderRadius: 8,
                background: 'linear-gradient(135deg,#0c4a6e,#0369a1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(12,74,110,.3)', flexShrink: 0,
              }}
            >
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 18, letterSpacing: -1 }}>S</span>
            </div>
            {!collapsed && (
              <div style={{ lineHeight: 1.1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.primary, letterSpacing: -0.5 }}>
                  Soft <span style={{ color: COLORS.accent }}>Library</span>
                </div>
                <div style={{ fontSize: 9, color: COLORS.textMut, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 1 }}>
                  Archives & Courrier
                </div>
              </div>
            )}
          </div>
          {!collapsed && (
            <button onClick={() => setCollapsed(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <ChevronLeft size={18} color={COLORS.textMut} />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
          {MENU_ITEMS.map((m) => {
            const active = page === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setPage(m.id)}
                title={collapsed ? m.label : undefined}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: collapsed ? '10px 0' : '10px 12px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  borderRadius: 8, border: 'none', cursor: 'pointer', marginBottom: 2,
                  background: active ? COLORS.primaryLighter : 'transparent',
                  color: active ? COLORS.primary : COLORS.textSec,
                  fontWeight: active ? 700 : 500, fontSize: 13,
                  fontFamily: FONT_FAMILY, transition: 'all .12s',
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = '#f1f5f9'; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <m.icon size={19} strokeWidth={active ? 2.2 : 1.8} />
                {!collapsed && <span>{m.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div style={{ padding: '12px 16px', borderTop: `1px solid ${COLORS.border}`, fontSize: 10, color: COLORS.textMut, textAlign: 'center' }}>
            Soft Library v1.0 • Intégré SoftDocs
          </div>
        )}
      </aside>

      {/* ═══ Main ═══ */}
      <div style={{ marginLeft: collapsed ? 64 : 240, transition: 'margin-left .25s ease' }}>
        {/* Header */}
        <header
          style={{
            height: 56, background: '#fff',
            borderBottom: `1px solid ${COLORS.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 24px', position: 'sticky', top: 0, zIndex: 50,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {collapsed && (
              <button onClick={() => setCollapsed(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <Menu size={20} color={COLORS.textSec} />
              </button>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: COLORS.textMut }}>
              <Home size={14} />
              <span>Soft Library</span>
              <ChevronRight size={12} />
              <span style={{ color: COLORS.text, fontWeight: 600 }}>{currentMenu?.label}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <Bell size={20} color={COLORS.textSec} style={{ cursor: 'pointer' }} />
              <span style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: '50%', background: COLORS.danger, border: '2px solid #fff' }} />
            </div>
            <div style={{ width: 1, height: 24, background: COLORS.border }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <div
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: `linear-gradient(135deg,${COLORS.primary},${COLORS.primaryLight})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>{initials}</span>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.nom || 'Admin'}</div>
                <div style={{ fontSize: 10, color: COLORS.textMut }}>{user?.role || 'Administrateur'}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ padding: 24, maxWidth: 1400, margin: '0 auto' }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
