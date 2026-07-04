/* ═══════════════════════════════════════════════════════════════
   SOFT LIBRARY — Composants UI partagés
   Badge, Button, StatCard, Modal
═══════════════════════════════════════════════════════════════ */
import React from 'react';
import { X, TrendingUp } from 'lucide-react';
import { COLORS, FONT_FAMILY } from '../theme';

/* ─── Badge ─── */
export const Badge = ({ label, color, bg }) => (
  <span
    style={{
      padding: '3px 10px',
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 600,
      color,
      background: bg,
      display: 'inline-flex',
      whiteSpace: 'nowrap',
    }}
  >
    {label}
  </span>
);

/* ─── Button ─── */
const VARIANTS = {
  primary: { background: COLORS.primary, color: '#fff', border: 'none' },
  accent:  { background: COLORS.accent, color: '#fff', border: 'none' },
  outline: { background: 'transparent', color: COLORS.primary, border: `1.5px solid ${COLORS.border}` },
  ghost:   { background: 'transparent', color: COLORS.textSec, border: 'none' },
  danger:  { background: COLORS.danger, color: '#fff', border: 'none' },
  success: { background: COLORS.success, color: '#fff', border: 'none' },
};

const SIZES = {
  sm: { padding: '6px 12px', fontSize: 12 },
  md: { padding: '8px 16px', fontSize: 13 },
};

export const Btn = ({
  children,
  variant = 'primary',
  icon: Icon,
  onClick,
  style: extraStyle,
  disabled,
  size = 'md',
  type = 'button',
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    style={{
      ...VARIANTS[variant],
      ...SIZES[size],
      borderRadius: 8,
      fontWeight: 600,
      cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      transition: 'all .15s',
      fontFamily: FONT_FAMILY,
      opacity: disabled ? 0.5 : 1,
      ...extraStyle,
    }}
  >
    {Icon && <Icon size={size === 'sm' ? 14 : 16} />}
    {children}
  </button>
);

/* ─── Stat Card ─── */
export const StatCard = ({ icon: Icon, label, value, trend, color, bgColor }) => (
  <div
    style={{
      background: '#fff',
      borderRadius: 12,
      padding: '18px 20px',
      border: `1px solid ${COLORS.border}`,
      transition: 'all .2s',
      cursor: 'default',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.06)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'none';
      e.currentTarget.style.boxShadow = 'none';
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontSize: 12, color: COLORS.textMut, marginBottom: 6, fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: COLORS.text }}>{value}</div>
        {trend != null && (
          <div
            style={{
              fontSize: 11,
              marginTop: 6,
              color: trend > 0 ? COLORS.success : COLORS.danger,
              display: 'flex',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <TrendingUp size={12} style={{ transform: trend < 0 ? 'rotate(180deg)' : 'none' }} />
            {Math.abs(trend)}% vs mois dernier
          </div>
        )}
      </div>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: bgColor || '#f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={20} color={color || COLORS.textSec} />
      </div>
    </div>
  </div>
);

/* ─── Modal ─── */
export const Modal = ({ isOpen, onClose, title, children, width = 560 }) => {
  if (!isOpen) return null;
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(15,23,42,.4)',
          backdropFilter: 'blur(4px)',
        }}
      />
      <div
        style={{
          position: 'relative',
          background: '#fff',
          borderRadius: 16,
          width: '100%',
          maxWidth: width,
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 64px rgba(0,0,0,.15)',
          animation: 'modalIn .2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: '18px 24px',
            borderBottom: `1px solid ${COLORS.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{title}</h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          >
            <X size={20} color={COLORS.textMut} />
          </button>
        </div>
        <div style={{ padding: 24, overflowY: 'auto', flex: 1 }}>{children}</div>
      </div>
    </div>
  );
};

/* ─── DataTable : Tableau réutilisable ─── */
export const DataTable = ({ columns, data, onRowClick, emptyMessage = 'Aucune donnée' }) => (
  <div style={{ background: '#fff', borderRadius: 12, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: COLORS.surfaceAlt }}>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  padding: '11px 14px',
                  textAlign: 'left',
                  fontWeight: 600,
                  color: COLORS.textSec,
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  whiteSpace: 'nowrap',
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{ padding: 40, textAlign: 'center', color: COLORS.textMut }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={row.id || idx}
                style={{ borderBottom: `1px solid ${COLORS.borderLight}`, cursor: onRowClick ? 'pointer' : 'default' }}
                onClick={() => onRowClick?.(row)}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#fafbfc')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {columns.map((col) => (
                  <td key={col.key} style={{ padding: '11px 14px', ...col.cellStyle }}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

/* ─── Pagination ─── */
export const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div
      style={{
        padding: '12px 20px',
        borderTop: `1px solid ${COLORS.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#fff',
        borderRadius: '0 0 12px 12px',
      }}
    >
      <span style={{ fontSize: 12, color: COLORS.textMut }}>
        Page {page}/{totalPages}
      </span>
      <div style={{ display: 'flex', gap: 4 }}>
        <Btn variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={page === 1}>
          Préc.
        </Btn>
        <Btn variant="outline" size="sm" onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
          Suiv.
        </Btn>
      </div>
    </div>
  );
};

/* ─── SearchBar ─── */
export const SearchBar = ({ value, onChange, placeholder = 'Rechercher...', maxWidth = 380 }) => {
  const SearchIcon = require('lucide-react').Search;
  return (
    <div style={{ position: 'relative', flex: 1, maxWidth }}>
      <SearchIcon
        size={16}
        color={COLORS.textMut}
        style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '9px 12px 9px 38px',
          borderRadius: 8,
          border: `1.5px solid ${COLORS.border}`,
          fontSize: 13,
          background: COLORS.surfaceAlt,
          outline: 'none',
          boxSizing: 'border-box',
          fontFamily: FONT_FAMILY,
        }}
      />
    </div>
  );
};

/* ─── ProgressBar ─── */
export const ProgressBar = ({ percent, height = 8, showLabel = false }) => {
  const barColor =
    percent > 80 ? COLORS.danger : percent > 60 ? COLORS.warning : COLORS.success;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div
        style={{
          flex: 1,
          height,
          background: '#f1f5f9',
          borderRadius: height / 2,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: '100%',
            background: percent > 80 ? `linear-gradient(90deg, ${COLORS.warning}, ${barColor})` : barColor,
            borderRadius: height / 2,
          }}
        />
      </div>
      {showLabel && (
        <span style={{ fontSize: 11, fontWeight: 600, color: percent > 80 ? COLORS.danger : COLORS.textSec, minWidth: 35, textAlign: 'right' }}>
          {percent}%
        </span>
      )}
    </div>
  );
};
