/* ═══════════════════════════════════════════════════════════════
   SOFT LIBRARY — Theme & Constants
   Thème centralisé pour le module SoftLibrary
═══════════════════════════════════════════════════════════════ */

export const COLORS = {
  primary:        '#0c4a6e',
  primaryLight:   '#0369a1',
  primaryLighter: '#e0f2fe',
  accent:         '#c2410c',
  accentLight:    '#fed7aa',
  surface:        '#fff',
  surfaceAlt:     '#f8fafc',
  border:         '#e2e8f0',
  borderLight:    '#f1f5f9',
  text:           '#0f172a',
  textSec:        '#475569',
  textMut:        '#94a3b8',
  success:        '#059669',
  successBg:      '#ecfdf5',
  warning:        '#d97706',
  warningBg:      '#fffbeb',
  danger:         '#dc2626',
  dangerBg:       '#fef2f2',
  info:           '#2563eb',
  infoBg:         '#eff6ff',
  purple:         '#7c3aed',
  purpleBg:       '#f5f3ff',
  indigo:         '#4f46e5',
  indigoBg:       '#eef2ff',
  pink:           '#db2777',
  pinkBg:         '#fdf2f8',
};

export const FONT_FAMILY = "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

export const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
  @keyframes modalIn {
    from { opacity: 0; transform: scale(.95) translateY(10px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%      { opacity: .4; }
  }
`;

/* ─── Statuts documents physiques ─── */
export const LIB_STATUTS_UI = [
  { id: 'disponible',       label: 'Disponible',           color: '#059669', bg: '#ecfdf5' },
  { id: 'en_consultation',  label: 'En consultation',      color: '#2563eb', bg: '#eff6ff' },
  { id: 'en_traitement',    label: 'En traitement',        color: '#d97706', bg: '#fffbeb' },
  { id: 'prete',            label: 'Prêté',                color: '#c2410c', bg: '#fed7aa' },
  { id: 'en_transfert',     label: 'En transfert',         color: '#7c3aed', bg: '#f5f3ff' },
  { id: 'archivage_inter',  label: 'Archivage interm.',    color: '#4f46e5', bg: '#eef2ff' },
  { id: 'archivage_def',    label: 'Archivage définitif',  color: '#475569', bg: '#f8fafc' },
  { id: 'en_restauration',  label: 'En restauration',      color: '#db2777', bg: '#fdf2f8' },
  { id: 'elimine',          label: 'Éliminé',              color: '#dc2626', bg: '#fef2f2' },
];

/* ─── Niveaux de confidentialité (UI) ─── */
export const CONF_UI = [
  { id: 'conf-public',       label: 'Public',        color: '#059669' },
  { id: 'conf-interne',      label: 'Interne',       color: '#2563eb' },
  { id: 'conf-confidentiel', label: 'Confidentiel',  color: '#d97706' },
  { id: 'conf-secret',       label: 'Secret',        color: '#dc2626' },
];

export function getStatutUI(statutId) {
  return LIB_STATUTS_UI.find(s => s.id === statutId) || { id: statutId, label: statutId, color: COLORS.textMut, bg: COLORS.borderLight };
}

export function getConfUI(confId) {
  return CONF_UI.find(c => c.id === confId) || { id: confId, label: confId, color: COLORS.textMut };
}
