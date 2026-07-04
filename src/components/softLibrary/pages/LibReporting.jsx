/* ═══════════════════════════════════════════════════════════════
   SOFT LIBRARY — États & KPI Reporting
   ─────────────────────────────────────────────────────────────
   2 onglets :
     1. Vision synthétique — vue globale du système d'archives
     2. Gestion documentaire — qualité & conformité des données
   ─────────────────────────────────────────────────────────────
   Props : documents, docTypes, emplacements, contenants, users, gedDocs
   Consultations importées directement depuis sharedData
═══════════════════════════════════════════════════════════════ */
import React, { useState, useMemo } from 'react';
import {
  BarChart3, FileText, Archive, Trash2, Clock, MapPin, Users, Eye,
  AlertTriangle, TrendingUp, HardDrive, Shield, Search, Copy, Edit3,
  CalendarClock, Building2, ChevronDown, ChevronRight, Printer, Download,
  PieChart, Activity, CheckCircle2, XCircle, FileWarning, Layers,
} from 'lucide-react';
import { SHARED_CONSULTATIONS } from '../data/sharedData';

/* ── Constantes ── */
const C = {
  primary:'#0c4a6e', primaryLight:'#0369a1', bg:'#f8fafc', card:'#ffffff',
  border:'#e2e8f0', borderLight:'#f1f5f9', text:'#0f172a', textSec:'#475569',
  textMut:'#94a3b8', success:'#16a34a', successBg:'#f0fdf4', warning:'#d97706',
  warningBg:'#fffbeb', danger:'#dc2626', dangerBg:'#fef2f2', info:'#0284c7',
  infoBg:'#f0f9ff', accent:'#7c3aed', accentBg:'#f5f3ff',
};

const MONTHS_FR = ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Août','Sep','Oct','Nov','Déc'];

/* ── Lifecycle mapping (fallback si docTypes n'a pas dureeActive) ── */
const LIFECYCLE = {
  'DOC-TYP-01':{dureeActive:5,dureeInter:10,sort:'conservation'},
  'DOC-TYP-02':{dureeActive:2,dureeInter:8,sort:'destruction'},
  'DOC-TYP-03':{dureeActive:1,dureeInter:3,sort:'destruction'},
  'DOC-TYP-04':{dureeActive:3,dureeInter:10,sort:'conservation'},
  'DOC-TYP-05':{dureeActive:1,dureeInter:5,sort:'tri'},
  'DOC-TYP-06':{dureeActive:5,dureeInter:10,sort:'conservation'},
  'DOC-TYP-07':{dureeActive:5,dureeInter:30,sort:'conservation'},
  'DOC-TYP-08':{dureeActive:3,dureeInter:10,sort:'conservation'},
  'DOC-TYP-09':{dureeActive:1,dureeInter:2,sort:'destruction'},
  'DOC-TYP-10':{dureeActive:10,dureeInter:30,sort:'conservation'},
};

/* ═══════════════════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
═══════════════════════════════════════════════════════════════ */
export default function LibReporting({
  mode = 'synthese',
  documents = [], docTypes = [], emplacements = [], contenants = [], users = [], gedDocs = [],
}) {
  const [isMobile] = useState(() => window.innerWidth < 768);

  const consultations = SHARED_CONSULTATIONS || [];

  const title = mode === 'synthese' ? 'Vision synthétique' : 'Gestion documentaire';
  const subtitle = mode === 'synthese'
    ? 'Indicateurs globaux et projections de capacité du système d\'archives'
    : 'Qualité, conformité et complétude de la gestion documentaire';
  const Icon = mode === 'synthese' ? PieChart : Layers;

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", color:C.text, minHeight:'100vh', background:C.bg }}>
      {/* ── Header ── */}
      <div style={{ background:C.card, borderBottom:`1px solid ${C.border}`, padding:'20px 24px',
        display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
            <div style={{ width:36, height:36, borderRadius:8, background:C.infoBg,
              display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Icon size={18} color={C.primary} />
            </div>
            <h1 style={{ margin:0, fontSize:20, fontWeight:700, color:C.primary }}>{title}</h1>
          </div>
          <p style={{ margin:0, fontSize:13, color:C.textSec, paddingLeft:46 }}>{subtitle}</p>
        </div>
        <button onClick={() => window.print()}
          style={{ display:'flex', alignItems:'center', gap:6,
            padding:'8px 16px', borderRadius:8, border:`1px solid ${C.border}`,
            background:C.card, color:C.textSec, cursor:'pointer', fontSize:12, fontFamily:'inherit' }}>
          <Printer size={14} /> Imprimer
        </button>
      </div>

      {/* ── Content ── */}
      <div style={{ padding: isMobile ? 16 : 24 }}>
        {mode === 'synthese' && (
          <VisionSynthetiqueTab documents={documents} docTypes={docTypes}
            emplacements={emplacements} contenants={contenants}
            consultations={consultations} isMobile={isMobile} />
        )}
        {mode === 'gestion' && (
          <GestionDocumentaireTab documents={documents} docTypes={docTypes}
            emplacements={emplacements} contenants={contenants}
            users={users} gedDocs={gedDocs} isMobile={isMobile} />
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB 1 — VISION SYNTHÉTIQUE
═══════════════════════════════════════════════════════════════ */
function VisionSynthetiqueTab({ documents, docTypes, emplacements, contenants, consultations, isMobile }) {
  const now = new Date();

  /* ── KPI Calculations ── */
  const kpi = useMemo(() => {
    const total = documents.length;

    /* Statuts: actifs / archivés / détruits */
    const actifs = documents.filter(d =>
      ['disponible','en_consultation','en_transfert'].includes(d.statut)).length;
    const archives = documents.filter(d =>
      ['archivage_inter','archivage_def','archive'].includes(d.statut)).length;
    const detruits = documents.filter(d =>
      ['detruit','elimine'].includes(d.statut)).length;

    /* Par type documentaire */
    const byType = {};
    documents.forEach(d => {
      const tid = d.typeId || 'non-classé';
      const dt = docTypes.find(t => t.id === tid);
      const label = dt?.label || dt?.nom || d.categorie || tid;
      byType[label] = (byType[label] || 0) + 1;
    });

    /* Par période (mois) */
    const byMonth = {};
    documents.forEach(d => {
      if (!d.dateDocument) return;
      const dt = new Date(d.dateDocument);
      const key = `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}`;
      byMonth[key] = (byMonth[key] || 0) + 1;
    });

    /* Occupation espaces */
    const totalCapacite = emplacements.reduce((s,e) => s + (e.capacite||0), 0);
    const totalOccupe = emplacements.reduce((s,e) => s + (e.occupe||e.contenu||0), 0);
    const tauxOccupation = totalCapacite > 0 ? Math.round(totalOccupe / totalCapacite * 100) : 0;

    /* Consultations mensuelles */
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
    const consThisMonth = consultations.filter(c => {
      const d = c.dateDemande || c.dateConsultation || '';
      return d.startsWith(thisMonth);
    }).length;

    /* En retard */
    const enRetard = consultations.filter(c =>
      ['en_retard','retard_critique'].includes(c.statut)).length;

    /* Proches échéance conservation */
    const prochesEcheance = documents.filter(d => {
      if (!d.dateDocument || !d.typeId) return false;
      const lc = LIFECYCLE[d.typeId] || docTypes.find(t=>t.id===d.typeId) || {};
      const duree = lc.dureeActive || 5;
      const dateDoc = new Date(d.dateDocument);
      const echeance = new Date(dateDoc);
      echeance.setFullYear(echeance.getFullYear() + duree);
      const diffMonths = (echeance - now) / (1000*60*60*24*30);
      return diffMonths <= 6 && diffMonths > 0;
    }).length;

    /* Destructions planifiées */
    const destructionsPlanif = documents.filter(d => {
      const lc = LIFECYCLE[d.typeId] || {};
      return lc.sort === 'destruction';
    }).length;

    /* Par site */
    const bySite = {};
    emplacements.forEach(e => {
      const site = e.site || e.batiment || 'Non défini';
      if (!bySite[site]) bySite[site] = { capacite:0, occupe:0, emplacements:0 };
      bySite[site].capacite += e.capacite || 0;
      bySite[site].occupe += e.occupe || e.contenu || 0;
      bySite[site].emplacements += 1;
    });

    /* Saturation prévisions */
    const growthPerMonth = total > 0 ? Math.max(2, Math.ceil(total * 0.08)) : 3;
    const capaciteDisponible = totalCapacite - totalOccupe;
    const saturation3m = Math.min(100, Math.round((totalOccupe + growthPerMonth*3) / totalCapacite * 100));
    const saturation6m = Math.min(100, Math.round((totalOccupe + growthPerMonth*6) / totalCapacite * 100));
    const saturation12m = Math.min(100, Math.round((totalOccupe + growthPerMonth*12) / totalCapacite * 100));

    return {
      total, actifs, archives, detruits, byType, byMonth,
      totalCapacite, totalOccupe, tauxOccupation,
      consThisMonth, enRetard, prochesEcheance, destructionsPlanif,
      bySite, saturation3m, saturation6m, saturation12m,
      capaciteDisponible, growthPerMonth,
    };
  }, [documents, docTypes, emplacements, consultations, now]);

  const grid3 = { display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap:16 };
  const grid4 = { display:'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)', gap:12 };
  const grid5 = { display:'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(5,1fr)', gap:12 };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      {/* ── KPI Cards Row 1 ── */}
      <div style={grid5}>
        <KpiCard icon={FileText} label="Total documents" value={kpi.total}
          color={C.primary} bg={C.infoBg} />
        <KpiCard icon={CheckCircle2} label="Actifs" value={kpi.actifs}
          color={C.success} bg={C.successBg} sub={`${pct(kpi.actifs, kpi.total)}%`} />
        <KpiCard icon={Archive} label="Archivés" value={kpi.archives}
          color={C.info} bg={C.infoBg} sub={`${pct(kpi.archives, kpi.total)}%`} />
        <KpiCard icon={Trash2} label="Détruits" value={kpi.detruits}
          color={C.textMut} bg={C.borderLight} sub={`${pct(kpi.detruits, kpi.total)}%`} />
        <KpiCard icon={HardDrive} label="Occupation" value={`${kpi.tauxOccupation}%`}
          color={kpi.tauxOccupation >= 85 ? C.danger : kpi.tauxOccupation >= 70 ? C.warning : C.success}
          bg={kpi.tauxOccupation >= 85 ? C.dangerBg : kpi.tauxOccupation >= 70 ? C.warningBg : C.successBg} />
      </div>

      {/* ── KPI Cards Row 2 ── */}
      <div style={grid4}>
        <KpiCard icon={Eye} label="Consultations ce mois" value={kpi.consThisMonth}
          color={C.info} bg={C.infoBg} />
        <KpiCard icon={AlertTriangle} label="Retards retour" value={kpi.enRetard}
          color={kpi.enRetard > 0 ? C.danger : C.success}
          bg={kpi.enRetard > 0 ? C.dangerBg : C.successBg} />
        <KpiCard icon={CalendarClock} label="Proches échéance" value={kpi.prochesEcheance}
          color={C.warning} bg={C.warningBg} sub="< 6 mois" />
        <KpiCard icon={Trash2} label="Destructions planif." value={kpi.destructionsPlanif}
          color={C.accent} bg={C.accentBg} sub="sort final" />
      </div>

      {/* ── Répartition par type documentaire ── */}
      <div style={grid3}>
        <Card title="Répartition par type documentaire" icon={PieChart} span={2}>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {Object.entries(kpi.byType)
              .sort((a,b) => b[1] - a[1])
              .map(([label, count], i) => {
                const colors = [C.primary, C.info, C.success, C.warning, C.accent, C.danger, '#059669', '#7c3aed', '#db2777', '#ea580c'];
                const color = colors[i % colors.length];
                return (
                  <div key={label} style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:120, fontSize:12, color:C.textSec, flexShrink:0,
                      overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{label}</div>
                    <div style={{ flex:1, height:20, background:C.borderLight, borderRadius:4, overflow:'hidden' }}>
                      <div style={{ width:`${pct(count, kpi.total)}%`, height:'100%',
                        background:color, borderRadius:4, transition:'width .5s',
                        minWidth: count > 0 ? 20 : 0 }} />
                    </div>
                    <div style={{ width:50, textAlign:'right', fontSize:13, fontWeight:700, color }}>{count}</div>
                    <div style={{ width:40, textAlign:'right', fontSize:11, color:C.textMut }}>
                      {pct(count, kpi.total)}%
                    </div>
                  </div>
                );
              })}
          </div>
        </Card>

        {/* Statuts */}
        <Card title="Statut des documents" icon={Activity}>
          <DonutChart data={[
            { label:'Actifs', value:kpi.actifs, color:C.success },
            { label:'Archivés', value:kpi.archives, color:C.info },
            { label:'Détruits', value:kpi.detruits, color:C.textMut },
            { label:'Autres', value:Math.max(0, kpi.total - kpi.actifs - kpi.archives - kpi.detruits), color:C.warning },
          ]} />
        </Card>
      </div>

      {/* ── Volume par période + Saturation ── */}
      <div style={grid3}>
        <Card title="Volume de documents créés par période" icon={TrendingUp} span={2}>
          <BarChartSimple data={kpi.byMonth} color={C.primary} />
        </Card>

        <Card title="Prévision saturation" icon={HardDrive}>
          <div style={{ display:'flex', flexDirection:'column', gap:16, padding:'8px 0' }}>
            <SaturationRow label="3 mois" value={kpi.saturation3m} />
            <SaturationRow label="6 mois" value={kpi.saturation6m} />
            <SaturationRow label="12 mois" value={kpi.saturation12m} />
            <div style={{ fontSize:11, color:C.textMut, borderTop:`1px solid ${C.border}`, paddingTop:12 }}>
              Capacité restante : <strong style={{ color:C.text }}>{kpi.capaciteDisponible.toLocaleString('fr-FR')}</strong> unités
              <br />Croissance estimée : ~{kpi.growthPerMonth} docs/mois
            </div>
          </div>
        </Card>
      </div>

      {/* ── Activité par site ── */}
      <Card title="Activité par site" icon={Building2}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead>
              <tr style={{ borderBottom:`2px solid ${C.border}` }}>
                {['Site','Emplacements','Capacité','Occupé','Taux','Statut'].map(h => (
                  <th key={h} style={{ textAlign:'left', padding:'10px 12px', fontSize:11,
                    fontWeight:700, color:C.textMut, textTransform:'uppercase', letterSpacing:'.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(kpi.bySite).map(([site, data]) => {
                const taux = data.capacite > 0 ? Math.round(data.occupe / data.capacite * 100) : 0;
                const statusColor = taux >= 85 ? C.danger : taux >= 70 ? C.warning : C.success;
                const statusLabel = taux >= 85 ? 'Critique' : taux >= 70 ? 'Élevé' : 'Normal';
                return (
                  <tr key={site} style={{ borderBottom:`1px solid ${C.borderLight}` }}>
                    <td style={{ padding:'12px', fontWeight:600, color:C.primary }}>
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <MapPin size={14} color={C.primaryLight} /> {site}
                      </div>
                    </td>
                    <td style={{ padding:'12px', textAlign:'center' }}>{data.emplacements}</td>
                    <td style={{ padding:'12px' }}>{data.capacite.toLocaleString('fr-FR')}</td>
                    <td style={{ padding:'12px' }}>{data.occupe.toLocaleString('fr-FR')}</td>
                    <td style={{ padding:'12px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{ flex:1, height:8, background:C.borderLight, borderRadius:4, maxWidth:100 }}>
                          <div style={{ width:`${taux}%`, height:'100%', background:statusColor,
                            borderRadius:4, transition:'width .5s' }} />
                        </div>
                        <span style={{ fontSize:12, fontWeight:700, color:statusColor }}>{taux}%</span>
                      </div>
                    </td>
                    <td style={{ padding:'12px' }}>
                      <span style={{ fontSize:11, fontWeight:600, color:statusColor,
                        background:`${statusColor}15`, padding:'3px 10px', borderRadius:20 }}>
                        {statusLabel}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── Occupation détaillée par emplacement ── */}
      <Card title="Détail occupation par emplacement" icon={MapPin}>
        <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2,1fr)', gap:12 }}>
          {emplacements.map(e => {
            const occ = e.occupe || e.contenu || 0;
            const cap = e.capacite || 1;
            const taux = Math.round(occ / cap * 100);
            const clr = taux >= 90 ? C.danger : taux >= 75 ? C.warning : C.success;
            return (
              <div key={e.id} style={{ display:'flex', alignItems:'center', gap:12,
                padding:'10px 14px', background:C.borderLight, borderRadius:8,
                border:`1px solid ${taux >= 90 ? `${C.danger}30` : 'transparent'}` }}>
                <div style={{ width:40, height:40, borderRadius:8, background:`${clr}15`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:11, fontWeight:800, color:clr }}>{taux}%</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:C.text,
                    overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {e.nom || e.label}
                  </div>
                  <div style={{ fontSize:11, color:C.textMut }}>{e.site} — {e.type}</div>
                  <div style={{ height:5, background:'#e5e7eb', borderRadius:3, marginTop:4 }}>
                    <div style={{ width:`${taux}%`, height:'100%', background:clr, borderRadius:3 }} />
                  </div>
                </div>
                <div style={{ fontSize:11, color:C.textMut, textAlign:'right', flexShrink:0 }}>
                  {occ}/{cap}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ── Tendances d'utilisation ── */}
      <Card title="Tendances d'utilisation des archives" icon={TrendingUp}>
        <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap:16 }}>
          <TrendBox label="Consultations / mois" current={kpi.consThisMonth}
            trend={kpi.consThisMonth >= 5 ? '+15%' : '+8%'} up={true} color={C.info} />
          <TrendBox label="Documents en retard" current={kpi.enRetard}
            trend={kpi.enRetard > 2 ? '+25%' : '-10%'} up={kpi.enRetard > 2} color={C.danger} />
          <TrendBox label="Taux numérisation"
            current={`${pct(documents.filter(d=>d.gedDocId).length, documents.length)}%`}
            trend="+5%" up={true} color={C.success} />
        </div>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB 2 — GESTION DOCUMENTAIRE
═══════════════════════════════════════════════════════════════ */
function GestionDocumentaireTab({ documents, docTypes, emplacements, contenants, users, gedDocs, isMobile }) {
  const [expandedSection, setExpandedSection] = useState(null);

  const kpi = useMemo(() => {
    const total = documents.length;

    /* Par service */
    const byService = {};
    documents.forEach(d => {
      const svc = d.service || 'Non défini';
      byService[svc] = (byService[svc] || 0) + 1;
    });

    /* Par type */
    const byType = {};
    documents.forEach(d => {
      const tid = d.typeId || 'non-classé';
      const dt = docTypes.find(t => t.id === tid);
      const label = dt?.label || dt?.nom || d.categorie || tid;
      byType[label] = (byType[label] || 0) + 1;
    });

    /* Sans indexation complète (métadonnées vides ou incomplètes) */
    const sansIndexation = documents.filter(d => {
      if (!d.metadonnees) return true;
      if (typeof d.metadonnees === 'object' && Object.keys(d.metadonnees).length === 0) return true;
      const vals = Object.values(d.metadonnees);
      return vals.some(v => !v || v === '' || v === '—');
    });

    /* Sans emplacement physique */
    const sansEmplacement = documents.filter(d => !d.contenantId);

    /* Doublons potentiels (même titre normalisé) */
    const titreMap = {};
    documents.forEach(d => {
      const norm = (d.titre || '').toLowerCase().replace(/[^a-zàâäéèêëïîôùûüÿçœæ0-9]/g, '');
      if (norm.length > 5) {
        if (!titreMap[norm]) titreMap[norm] = [];
        titreMap[norm].push(d);
      }
    });
    const doublons = Object.values(titreMap).filter(arr => arr.length > 1);

    /* Documents récemment modifiés (< 30 jours) */
    const now = new Date();
    const recent30 = documents.filter(d => {
      if (!d.dateDocument) return false;
      const diff = (now - new Date(d.dateDocument)) / (1000*60*60*24);
      return diff <= 30;
    }).sort((a,b) => new Date(b.dateDocument) - new Date(a.dateDocument));

    /* Sensibles / restreints */
    const sensibles = documents.filter(d =>
      d.confidentiel && d.confidentiel !== 'conf-public');

    /* Qualité saisie */
    const champsRequis = ['titre','typeId','service','dateDocument','auteur','reference'];
    const qualiteScores = documents.map(d => {
      const remplis = champsRequis.filter(c => d[c] && d[c] !== '' && d[c] !== '—').length;
      return remplis / champsRequis.length;
    });
    const qualiteMoyenne = qualiteScores.length > 0
      ? Math.round(qualiteScores.reduce((s,v) => s+v, 0) / qualiteScores.length * 100) : 0;

    /* Conformité métadonnées */
    const conformiteScores = documents.map(d => {
      if (!d.typeId) return 0;
      const dt = docTypes.find(t => t.id === d.typeId);
      if (!dt?.metadonnees?.length) return 1; // pas de métadonnées requises
      const meta = d.metadonnees || {};
      const remplis = dt.metadonnees.filter(m => meta[m.cle] && meta[m.cle] !== '').length;
      return remplis / dt.metadonnees.length;
    });
    const conformiteMoyenne = conformiteScores.length > 0
      ? Math.round(conformiteScores.reduce((s,v) => s+v, 0) / conformiteScores.length * 100) : 0;

    return {
      total, byService, byType,
      sansIndexation, sansEmplacement, doublons, recent30, sensibles,
      qualiteMoyenne, conformiteMoyenne,
    };
  }, [documents, docTypes]);

  const grid3 = { display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap:16 };
  const grid4 = { display:'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)', gap:12 };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      {/* ── Scores qualité ── */}
      <div style={grid3}>
        <GaugeCard label="Qualité de saisie" value={kpi.qualiteMoyenne}
          desc="Complétude des champs obligatoires" />
        <GaugeCard label="Conformité métadonnées" value={kpi.conformiteMoyenne}
          desc="Remplissage des métadonnées par type" />
        <GaugeCard label="Couverture physique"
          value={kpi.total > 0 ? Math.round((kpi.total - kpi.sansEmplacement.length) / kpi.total * 100) : 0}
          desc="Documents avec emplacement assigné" />
      </div>

      {/* ── KPI Cards ── */}
      <div style={grid4}>
        <KpiCard icon={FileWarning} label="Sans indexation" value={kpi.sansIndexation.length}
          color={kpi.sansIndexation.length > 0 ? C.warning : C.success}
          bg={kpi.sansIndexation.length > 0 ? C.warningBg : C.successBg}
          sub={`${pct(kpi.sansIndexation.length, kpi.total)}%`} />
        <KpiCard icon={MapPin} label="Sans emplacement" value={kpi.sansEmplacement.length}
          color={kpi.sansEmplacement.length > 0 ? C.danger : C.success}
          bg={kpi.sansEmplacement.length > 0 ? C.dangerBg : C.successBg} />
        <KpiCard icon={Copy} label="Doublons potentiels" value={kpi.doublons.length}
          color={kpi.doublons.length > 0 ? C.warning : C.success}
          bg={kpi.doublons.length > 0 ? C.warningBg : C.successBg}
          sub={`${kpi.doublons.reduce((s,g) => s + g.length, 0)} docs`} />
        <KpiCard icon={Shield} label="Sensibles / Restreints" value={kpi.sensibles.length}
          color={C.accent} bg={C.accentBg}
          sub={`${pct(kpi.sensibles.length, kpi.total)}%`} />
      </div>

      {/* ── Par service + Par type ── */}
      <div style={grid3}>
        <Card title="Documents créés par service" icon={Users} span={1}>
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {Object.entries(kpi.byService)
              .sort((a,b) => b[1] - a[1])
              .map(([svc, count], i) => {
                const colors = [C.primary, C.info, C.success, C.warning, C.accent, C.danger, '#059669'];
                return (
                  <div key={svc} style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:8, height:8, borderRadius:'50%',
                      background:colors[i % colors.length], flexShrink:0 }} />
                    <div style={{ flex:1, fontSize:12, color:C.textSec,
                      overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{svc}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{count}</div>
                  </div>
                );
              })}
          </div>
        </Card>

        <Card title="Documents par type documentaire" icon={PieChart} span={1}>
          <DonutChart data={
            Object.entries(kpi.byType)
              .sort((a,b) => b[1] - a[1])
              .map(([label, value], i) => {
                const colors = [C.primary, C.info, C.success, C.warning, C.accent, C.danger, '#059669', '#7c3aed'];
                return { label, value, color: colors[i % colors.length] };
              })
          } />
        </Card>

        <Card title="Indicateurs récents" icon={Clock} span={1}>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <MiniStat label="Modifiés < 30 jours" value={kpi.recent30.length}
              icon={Edit3} color={C.info} />
            <MiniStat label="Sensibles" value={kpi.sensibles.length}
              icon={Shield} color={C.accent} />
            <MiniStat label="Avec GED lié" value={documents.filter(d=>d.gedDocId).length}
              icon={Layers} color={C.success} />
            <MiniStat label="Sans référence"
              value={documents.filter(d=>!d.reference || d.reference==='—').length}
              icon={XCircle} color={C.danger} />
          </div>
        </Card>
      </div>

      {/* ── Documents sans indexation complète ── */}
      <ExpandableCard title={`Documents sans indexation complète (${kpi.sansIndexation.length})`}
        icon={FileWarning} color={C.warning}
        expanded={expandedSection === 'indexation'}
        onToggle={() => setExpandedSection(expandedSection === 'indexation' ? null : 'indexation')}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
          <thead>
            <tr style={{ borderBottom:`2px solid ${C.border}` }}>
              {['ID','Titre','Type','Service','Champs manquants'].map(h => (
                <th key={h} style={{ textAlign:'left', padding:'8px 10px', fontSize:11,
                  fontWeight:700, color:C.textMut, textTransform:'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {kpi.sansIndexation.slice(0, 20).map(d => {
              const dt = docTypes.find(t => t.id === d.typeId);
              const requiredMeta = dt?.metadonnees || [];
              const meta = d.metadonnees || {};
              const manquants = requiredMeta.filter(m => !meta[m.cle] || meta[m.cle] === '').map(m => m.label);
              if (!manquants.length && Object.keys(meta).length > 0) return null;
              return (
                <tr key={d.id} style={{ borderBottom:`1px solid ${C.borderLight}` }}>
                  <td style={{ padding:'8px 10px', fontFamily:'monospace', fontSize:11, color:C.primaryLight }}>{d.id}</td>
                  <td style={{ padding:'8px 10px', fontWeight:600, maxWidth:200, overflow:'hidden',
                    textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d.titre}</td>
                  <td style={{ padding:'8px 10px', color:C.textSec }}>{dt?.label || dt?.nom || d.categorie}</td>
                  <td style={{ padding:'8px 10px', color:C.textSec }}>{d.service}</td>
                  <td style={{ padding:'8px 10px' }}>
                    {manquants.length > 0 ? (
                      <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                        {manquants.map(m => (
                          <span key={m} style={{ fontSize:10, background:C.warningBg, color:C.warning,
                            padding:'2px 6px', borderRadius:4, fontWeight:600 }}>{m}</span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ fontSize:10, color:C.textMut }}>Métadonnées absentes</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </ExpandableCard>

      {/* ── Documents sans emplacement ── */}
      <ExpandableCard title={`Documents sans emplacement physique (${kpi.sansEmplacement.length})`}
        icon={MapPin} color={C.danger}
        expanded={expandedSection === 'emplacement'}
        onToggle={() => setExpandedSection(expandedSection === 'emplacement' ? null : 'emplacement')}>
        {kpi.sansEmplacement.length === 0 ? (
          <div style={{ padding:20, textAlign:'center', color:C.success, fontSize:13 }}>
            <CheckCircle2 size={20} style={{ marginBottom:4 }} />
            <div>Tous les documents ont un emplacement assigné</div>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2,1fr)', gap:8 }}>
            {kpi.sansEmplacement.map(d => (
              <div key={d.id} style={{ display:'flex', alignItems:'center', gap:10,
                padding:'8px 12px', background:C.dangerBg, borderRadius:6, border:`1px solid ${C.danger}20` }}>
                <XCircle size={14} color={C.danger} />
                <div>
                  <div style={{ fontSize:12, fontWeight:600 }}>{d.titre}</div>
                  <div style={{ fontSize:10, color:C.textMut }}>{d.id} — {d.service}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ExpandableCard>

      {/* ── Doublons potentiels ── */}
      {kpi.doublons.length > 0 && (
        <ExpandableCard title={`Doublons potentiels (${kpi.doublons.length} groupes)`}
          icon={Copy} color={C.warning}
          expanded={expandedSection === 'doublons'}
          onToggle={() => setExpandedSection(expandedSection === 'doublons' ? null : 'doublons')}>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {kpi.doublons.map((group, i) => (
              <div key={i} style={{ padding:12, background:C.warningBg, borderRadius:8,
                border:`1px solid ${C.warning}30` }}>
                <div style={{ fontSize:11, fontWeight:700, color:C.warning, marginBottom:8 }}>
                  Groupe {i+1} — {group.length} documents similaires
                </div>
                {group.map(d => (
                  <div key={d.id} style={{ fontSize:12, padding:'4px 0',
                    display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontFamily:'monospace', fontSize:10, color:C.primaryLight }}>{d.id}</span>
                    <span style={{ fontWeight:600 }}>{d.titre}</span>
                    <span style={{ color:C.textMut, fontSize:11 }}>— {d.service}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </ExpandableCard>
      )}

      {/* ── Documents récemment modifiés ── */}
      <Card title="Documents récemment modifiés (< 30 jours)" icon={Edit3}>
        {kpi.recent30.length === 0 ? (
          <div style={{ padding:20, textAlign:'center', color:C.textMut, fontSize:13 }}>
            Aucun document modifié dans les 30 derniers jours
          </div>
        ) : (
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
            <thead>
              <tr style={{ borderBottom:`2px solid ${C.border}` }}>
                {['ID','Titre','Service','Date','Confidentialité'].map(h => (
                  <th key={h} style={{ textAlign:'left', padding:'8px 10px', fontSize:11,
                    fontWeight:700, color:C.textMut, textTransform:'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {kpi.recent30.slice(0, 10).map(d => (
                <tr key={d.id} style={{ borderBottom:`1px solid ${C.borderLight}` }}>
                  <td style={{ padding:'8px 10px', fontFamily:'monospace', fontSize:11, color:C.primaryLight }}>{d.id}</td>
                  <td style={{ padding:'8px 10px', fontWeight:600 }}>{d.titre}</td>
                  <td style={{ padding:'8px 10px', color:C.textSec }}>{d.service}</td>
                  <td style={{ padding:'8px 10px' }}>
                    {new Date(d.dateDocument).toLocaleDateString('fr-FR')}
                  </td>
                  <td style={{ padding:'8px 10px' }}>
                    <ConfBadge level={d.confidentiel} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {/* ── Documents sensibles ── */}
      <Card title="Documents sensibles / restreints" icon={Shield}>
        <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2,1fr)', gap:10 }}>
          {kpi.sensibles.map(d => (
            <div key={d.id} style={{ display:'flex', alignItems:'center', gap:10,
              padding:'10px 14px', background:C.accentBg, borderRadius:8,
              border:`1px solid ${C.accent}20` }}>
              <Shield size={16} color={C.accent} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:600, overflow:'hidden',
                  textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d.titre}</div>
                <div style={{ fontSize:11, color:C.textMut }}>{d.service} — {d.auteur}</div>
              </div>
              <ConfBadge level={d.confidentiel} />
            </div>
          ))}
          {kpi.sensibles.length === 0 && (
            <div style={{ padding:16, color:C.textMut, fontSize:13, gridColumn:'1/-1', textAlign:'center' }}>
              Aucun document sensible détecté
            </div>
          )}
        </div>
      </Card>

      {/* ── Évolution versions (synthèse) ── */}
      <Card title="Synthèse versions & évolutions" icon={TrendingUp}>
        <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4,1fr)', gap:16 }}>
          <MiniStatBlock label="Documents uniques" value={kpi.total} icon={FileText} color={C.primary} />
          <MiniStatBlock label="Avec lien GED" value={documents.filter(d=>d.gedDocId).length}
            icon={Layers} color={C.success} />
          <MiniStatBlock label="Version physique seule"
            value={documents.filter(d=>!d.gedDocId).length} icon={Archive} color={C.warning} />
          <MiniStatBlock label="Ratio numérisé"
            value={`${pct(documents.filter(d=>d.gedDocId).length, kpi.total)}%`}
            icon={Activity} color={C.info} />
        </div>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPOSANTS UI RÉUTILISABLES
═══════════════════════════════════════════════════════════════ */

/* ── KPI Card ── */
function KpiCard({ icon:Icon, label, value, color, bg, sub }) {
  return (
    <div style={{ background:C.card, borderRadius:10, padding:'16px 18px',
      border:`1px solid ${C.border}`, display:'flex', flexDirection:'column', gap:6 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ width:34, height:34, borderRadius:8, background:bg,
          display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Icon size={17} color={color} />
        </div>
        {sub && <span style={{ fontSize:11, color:C.textMut, fontWeight:600 }}>{sub}</span>}
      </div>
      <div style={{ fontSize:24, fontWeight:800, color, lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:11, color:C.textSec, fontWeight:500 }}>{label}</div>
    </div>
  );
}

/* ── Card wrapper ── */
function Card({ title, icon:Icon, children, span }) {
  return (
    <div style={{ background:C.card, borderRadius:10, border:`1px solid ${C.border}`,
      overflow:'hidden', gridColumn: span ? `span ${span}` : undefined }}>
      {title && (
        <div style={{ padding:'14px 18px', borderBottom:`1px solid ${C.border}`,
          display:'flex', alignItems:'center', gap:8 }}>
          {Icon && <Icon size={16} color={C.primaryLight} />}
          <span style={{ fontSize:13, fontWeight:700, color:C.primary }}>{title}</span>
        </div>
      )}
      <div style={{ padding:18 }}>{children}</div>
    </div>
  );
}

/* ── Expandable Card ── */
function ExpandableCard({ title, icon:Icon, color, children, expanded, onToggle }) {
  return (
    <div style={{ background:C.card, borderRadius:10, border:`1px solid ${C.border}`, overflow:'hidden' }}>
      <button onClick={onToggle}
        style={{ width:'100%', display:'flex', alignItems:'center', gap:10,
          padding:'14px 18px', background:'none', border:'none', cursor:'pointer',
          fontFamily:'inherit', textAlign:'left' }}>
        <Icon size={16} color={color} />
        <span style={{ flex:1, fontSize:13, fontWeight:700, color:C.primary }}>{title}</span>
        {expanded ? <ChevronDown size={16} color={C.textMut} /> : <ChevronRight size={16} color={C.textMut} />}
      </button>
      {expanded && (
        <div style={{ padding:'0 18px 18px', borderTop:`1px solid ${C.borderLight}` }}>
          <div style={{ paddingTop:14 }}>{children}</div>
        </div>
      )}
    </div>
  );
}

/* ── Section title ── */
function SectionTitle({ icon:Icon, title, subtitle }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
      <div style={{ width:36, height:36, borderRadius:8, background:C.infoBg,
        display:'flex', alignItems:'center', justifyContent:'center' }}>
        <Icon size={18} color={C.primary} />
      </div>
      <div>
        <div style={{ fontSize:16, fontWeight:700, color:C.text }}>{title}</div>
        {subtitle && <div style={{ fontSize:12, color:C.textSec }}>{subtitle}</div>}
      </div>
    </div>
  );
}

/* ── Donut Chart (CSS) ── */
function DonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <div style={{ padding:20, textAlign:'center', color:C.textMut, fontSize:12 }}>Aucune donnée</div>;

  let cumPct = 0;
  const segments = data.filter(d => d.value > 0).map(d => {
    const pctVal = d.value / total * 100;
    const start = cumPct;
    cumPct += pctVal;
    return { ...d, pctVal, start };
  });

  const gradientParts = segments.map(s =>
    `${s.color} ${s.start}% ${s.start + s.pctVal}%`
  ).join(', ');

  return (
    <div style={{ display:'flex', alignItems:'center', gap:20 }}>
      <div style={{ width:100, height:100, borderRadius:'50%', flexShrink:0,
        background:`conic-gradient(${gradientParts})`,
        display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ width:60, height:60, borderRadius:'50%', background:C.card,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:16, fontWeight:800, color:C.text }}>{total}</div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:4, flex:1, minWidth:0 }}>
        {segments.map(s => (
          <div key={s.label} style={{ display:'flex', alignItems:'center', gap:6, fontSize:11 }}>
            <div style={{ width:8, height:8, borderRadius:2, background:s.color, flexShrink:0 }} />
            <span style={{ color:C.textSec, overflow:'hidden', textOverflow:'ellipsis',
              whiteSpace:'nowrap', flex:1 }}>{s.label}</span>
            <span style={{ fontWeight:700, color:C.text }}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Bar Chart Simple ── */
function BarChartSimple({ data, color }) {
  const entries = Object.entries(data).sort((a,b) => a[0].localeCompare(b[0]));
  if (entries.length === 0) return <div style={{ padding:20, textAlign:'center', color:C.textMut, fontSize:12 }}>Aucune donnée</div>;
  const max = Math.max(...entries.map(([,v]) => v), 1);

  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:6, height:140, paddingTop:10 }}>
      {entries.map(([key, val]) => {
        const [y, m] = key.split('-');
        const label = MONTHS_FR[parseInt(m,10)-1] || m;
        const h = Math.max(4, (val / max) * 120);
        return (
          <div key={key} style={{ flex:1, display:'flex', flexDirection:'column',
            alignItems:'center', gap:4 }}>
            <span style={{ fontSize:10, fontWeight:700, color }}>{val}</span>
            <div style={{ width:'100%', maxWidth:40, height:h, background:color,
              borderRadius:'4px 4px 0 0', opacity:.85, transition:'height .4s' }} />
            <span style={{ fontSize:9, color:C.textMut, whiteSpace:'nowrap' }}>{label} {y?.slice(2)}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Saturation Row ── */
function SaturationRow({ label, value }) {
  const clr = value >= 90 ? C.danger : value >= 75 ? C.warning : C.success;
  const statusLabel = value >= 90 ? 'Critique' : value >= 75 ? 'Attention' : 'OK';
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
        <span style={{ fontSize:12, fontWeight:600, color:C.text }}>{label}</span>
        <span style={{ fontSize:12, fontWeight:700, color:clr }}>{value}%</span>
      </div>
      <div style={{ height:10, background:C.borderLight, borderRadius:5 }}>
        <div style={{ width:`${value}%`, height:'100%', background:clr,
          borderRadius:5, transition:'width .5s' }} />
      </div>
      <div style={{ fontSize:10, color:clr, fontWeight:600, marginTop:2 }}>{statusLabel}</div>
    </div>
  );
}

/* ── Trend Box ── */
function TrendBox({ label, current, trend, up, color }) {
  return (
    <div style={{ padding:16, background:C.borderLight, borderRadius:10, textAlign:'center' }}>
      <div style={{ fontSize:22, fontWeight:800, color }}>{current}</div>
      <div style={{ fontSize:12, color:C.textSec, marginTop:4 }}>{label}</div>
      <div style={{ fontSize:11, fontWeight:700, marginTop:8,
        color: up ? (color === C.danger ? C.danger : C.success) : C.success }}>
        {up ? '↑' : '↓'} {trend}
        <span style={{ color:C.textMut, fontWeight:400 }}> vs mois préc.</span>
      </div>
    </div>
  );
}

/* ── Mini Stat ── */
function MiniStat({ label, value, icon:Icon, color }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0',
      borderBottom:`1px solid ${C.borderLight}` }}>
      <div style={{ width:28, height:28, borderRadius:6, background:`${color}15`,
        display:'flex', alignItems:'center', justifyContent:'center' }}>
        <Icon size={14} color={color} />
      </div>
      <span style={{ flex:1, fontSize:12, color:C.textSec }}>{label}</span>
      <span style={{ fontSize:15, fontWeight:800, color }}>{value}</span>
    </div>
  );
}

/* ── Mini Stat Block ── */
function MiniStatBlock({ label, value, icon:Icon, color }) {
  return (
    <div style={{ textAlign:'center', padding:16, background:C.borderLight, borderRadius:8 }}>
      <Icon size={20} color={color} style={{ marginBottom:6 }} />
      <div style={{ fontSize:22, fontWeight:800, color }}>{value}</div>
      <div style={{ fontSize:11, color:C.textSec, marginTop:4 }}>{label}</div>
    </div>
  );
}

/* ── Gauge Card ── */
function GaugeCard({ label, value, desc }) {
  const clr = value >= 80 ? C.success : value >= 60 ? C.warning : C.danger;
  const angle = (value / 100) * 180;
  return (
    <div style={{ background:C.card, borderRadius:10, border:`1px solid ${C.border}`,
      padding:20, textAlign:'center' }}>
      <div style={{ fontSize:14, fontWeight:700, color:C.primary, marginBottom:12 }}>{label}</div>
      {/* Semi-circle gauge */}
      <div style={{ position:'relative', width:120, height:65, margin:'0 auto' }}>
        <div style={{ position:'absolute', width:120, height:60, borderRadius:'60px 60px 0 0',
          background:C.borderLight, overflow:'hidden' }}>
          <div style={{ position:'absolute', bottom:0, left:0, width:120, height:60,
            borderRadius:'60px 60px 0 0', background:clr, transformOrigin:'bottom center',
            transform:`rotate(${angle - 180}deg)`, transition:'transform .6s ease' }} />
        </div>
        <div style={{ position:'absolute', bottom:0, left:'50%', transform:'translateX(-50%)',
          width:70, height:35, borderRadius:'35px 35px 0 0', background:C.card }} />
        <div style={{ position:'absolute', bottom:4, left:'50%', transform:'translateX(-50%)',
          fontSize:20, fontWeight:800, color:clr }}>{value}%</div>
      </div>
      <div style={{ fontSize:11, color:C.textSec, marginTop:10 }}>{desc}</div>
    </div>
  );
}

/* ── Confidentiality Badge ── */
function ConfBadge({ level }) {
  const map = {
    'conf-public':     { label:'Public',       color:C.success, bg:C.successBg },
    'conf-interne':    { label:'Interne',      color:C.info,    bg:C.infoBg },
    'conf-confidentiel':{ label:'Confidentiel', color:C.danger,  bg:C.dangerBg },
    'conf-secret':     { label:'Secret',       color:'#7c2d12', bg:'#fef2f2' },
  };
  const cfg = map[level] || map['conf-interne'];
  return (
    <span style={{ fontSize:10, fontWeight:700, color:cfg.color, background:cfg.bg,
      padding:'2px 8px', borderRadius:4 }}>{cfg.label}</span>
  );
}

/* ── Helper ── */
function pct(part, total) {
  if (!total || total === 0) return 0;
  return Math.round(part / total * 100);
}