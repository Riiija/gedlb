/* ═══════════════════════════════════════════════════════════════
   SOFT LIBRARY — Dashboard
═══════════════════════════════════════════════════════════════ */
import React, { useMemo } from 'react';
import {
  FileText, Eye, AlertTriangle, Mail, ExternalLink,
} from 'lucide-react';
import { COLORS } from '../theme';
import { LIB_STATUTS_UI, getStatutUI } from '../theme';
import { Badge, StatCard } from '../components/ui';

/**
 * @param {Object}   props
 * @param {Array}    props.documents      – LIB_DOCUMENTS from data.js
 * @param {Array}    props.emplacements   – LIB_EMPLACEMENTS from data.js
 * @param {Function} props.onNavigate     – (pageId) => void
 */
export default function LibDashboard({ documents = [], emplacements = [], onNavigate }) {
  /* ── Compteurs par statut ── */
  const statutCounts = useMemo(() => {
    const c = {};
    LIB_STATUTS_UI.forEach((s) => (c[s.id] = 0));
    documents.forEach((d) => {
      c[d.statut] = (c[d.statut] || 0) + 1;
    });
    return c;
  }, [documents]);

  /* ── Occupation par site ── */
  const siteOccupation = useMemo(() => {
    const map = {};
    emplacements.forEach((e) => {
      if (!map[e.site]) map[e.site] = { capacite: 0, occupe: 0 };
      map[e.site].capacite += e.capacite;
      map[e.site].occupe += e.occupe;
    });
    return Object.entries(map).map(([site, v]) => ({
      site,
      percent: v.capacite > 0 ? Math.round((v.occupe / v.capacite) * 100) : 0,
      color: COLORS.primary,
    }));
  }, [emplacements]);

  const enConsult = statutCounts['en_consultation'] || 0;
  const enRetard = documents.filter((d) => d.statut === 'en_traitement').length;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Tableau de bord</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: COLORS.textMut }}>
          Vue d'ensemble de vos archives et du courrier
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14, marginBottom: 28 }}>
        <StatCard icon={FileText} label="Documents actifs" value={documents.length} trend={8.2} color={COLORS.primary} bgColor={COLORS.primaryLighter} />
        <StatCard icon={Eye} label="En consultation" value={enConsult} color={COLORS.info} bgColor={COLORS.infoBg} />
        <StatCard icon={AlertTriangle} label="En traitement" value={enRetard} trend={-12} color={COLORS.danger} bgColor={COLORS.dangerBg} />
        <StatCard icon={Mail} label="Courrier en attente" value="—" color={COLORS.warning} bgColor={COLORS.warningBg} />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
        {/* Répartition par statut */}
        <div style={{ background: '#fff', borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600 }}>Répartition par statut</h3>
          {LIB_STATUTS_UI.map((s) => {
            const cnt = statutCounts[s.id] || 0;
            const pct = documents.length > 0 ? (cnt / documents.length) * 100 : 0;
            return (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <div style={{ width: 110, fontSize: 11, color: COLORS.textSec, textAlign: 'right', flexShrink: 0 }}>
                  {s.label}
                </div>
                <div style={{ flex: 1, height: 20, background: '#f1f5f9', borderRadius: 6, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: s.color, borderRadius: 6, minWidth: pct > 0 ? 16 : 0 }} />
                </div>
                <div style={{ width: 24, fontSize: 12, fontWeight: 600, textAlign: 'right' }}>{cnt}</div>
              </div>
            );
          })}
        </div>

        {/* Occupation rayonnages */}
        <div style={{ background: '#fff', borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600 }}>Occupation rayonnages</h3>
          {siteOccupation.map((s, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{s.site}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: s.percent > 80 ? COLORS.danger : s.color }}>{s.percent}%</span>
              </div>
              <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${s.percent}%`,
                    height: '100%',
                    background: s.percent > 80 ? `linear-gradient(90deg,${s.color},${COLORS.danger})` : s.color,
                    borderRadius: 4,
                  }}
                />
              </div>
            </div>
          ))}
          {siteOccupation.some((s) => s.percent > 80) && (
            <div style={{ marginTop: 16, padding: 10, background: COLORS.warningBg, borderRadius: 8, border: '1px solid #fde68a' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: COLORS.warning, fontWeight: 600 }}>
                <AlertTriangle size={14} />
                Un site est proche de la saturation
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Documents */}
      <div style={{ background: '#fff', borderRadius: 12, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Documents récents</h3>
          <span
            style={{ fontSize: 12, color: COLORS.primaryLight, cursor: 'pointer' }}
            onClick={() => onNavigate?.('documents')}
          >
            Voir tout →
          </span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: COLORS.surfaceAlt }}>
                {['Réf.', 'Titre', 'Type', 'Statut', 'Date'].map((h) => (
                  <th
                    key={h}
                    style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: COLORS.textSec, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {documents.slice(0, 8).map((d) => {
                const st = getStatutUI(d.statut);
                return (
                  <tr
                    key={d.id}
                    style={{ borderBottom: `1px solid ${COLORS.borderLight}`, cursor: 'pointer' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: COLORS.primaryLight, fontSize: 12, fontFamily: 'monospace' }}>{d.id}</td>
                    <td style={{ padding: '10px 14px', fontWeight: 500 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {d.titre}
                        {d.lienNumerique && <ExternalLink size={12} color={COLORS.info} />}
                      </div>
                    </td>
                    <td style={{ padding: '10px 14px', color: COLORS.textSec }}>{d.categorie}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <Badge label={st.label} color={st.color} bg={st.bg} />
                    </td>
                    <td style={{ padding: '10px 14px', color: COLORS.textMut, fontSize: 12 }}>{d.dateDocument}</td>
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
