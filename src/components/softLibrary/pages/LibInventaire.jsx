/* ═══════════════════════════════════════════════════════════════
   SOFT LIBRARY — Inventaire Physique
   
   Fonctionnalités :
   ✓ Lancement et gestion de campagnes d'inventaire
   ✓ Comparaison théorie (système) vs réalité (terrain)
   ✓ Correction des anomalies détectées
   ✓ Génération de rapport d'écarts (PDF-ready)
   ✓ Responsive mobile / tablet / desktop
   
   Données réelles utilisées :
   - documents (enrichedDocs = LIB_DOCUMENTS)
   - emplacements (SHARED_EMPLACEMENTS)
   - contenants (LIB_CONTENANTS)
═══════════════════════════════════════════════════════════════ */
import React, { useState, useMemo, useCallback } from 'react';
import {
  ClipboardCheck, ClipboardList, Plus, Play, Pause, CheckCircle2, XCircle,
  AlertTriangle, Search, Eye, Edit3, Trash2, Save, X, Check,
  ChevronRight, ChevronDown, ChevronLeft, Download, Printer, Filter,
  MapPin, Package, FileText, BarChart3, ArrowRight, RefreshCw,
  Clock, Calendar, Users, Building2, Activity, AlertCircle,
  TrendingUp, TrendingDown, Minus, Archive, ScanLine, CheckSquare,
  Square, Info, MoreHorizontal, ArrowUpDown, Layers,
} from 'lucide-react';
import { COLORS, FONT_FAMILY } from '../theme';
import { Badge, Btn, Modal } from '../components/ui';

const FF = FONT_FAMILY;
const inp = { width:'100%', padding:'9px 12px', borderRadius:8, border:`1.5px solid ${COLORS.border}`, fontSize:13, background:'#fff', outline:'none', boxSizing:'border-box', fontFamily:FF };
const lbl = { fontSize:11, color:COLORS.textMut, marginBottom:4, display:'block', fontWeight:600 };
const card = { background:'#fff', borderRadius:12, border:`1px solid ${COLORS.border}`, overflow:'hidden' };
const pill = (a) => ({ padding:'6px 14px', borderRadius:20, fontSize:12, fontWeight:600, border:'none', cursor:'pointer', fontFamily:FF, background:a?COLORS.primaryLighter:'transparent', color:a?COLORS.primaryLight:COLORS.textSec, transition:'all .15s' });

/* ═══════════════════════════════════════════════════
   GÉNÉRATEUR D'ANOMALIES RÉALISTES (basé sur données réelles)
═══════════════════════════════════════════════════ */
function buildCampaignData(documents, emplacements, contenants) {
  /* Regrouper les contenants par emplacement */
  const contByEmpl = {};
  contenants.forEach(c => {
    if (!c.emplacementId) return;
    if (!contByEmpl[c.emplacementId]) contByEmpl[c.emplacementId] = [];
    contByEmpl[c.emplacementId].push(c);
  });
  /* Regrouper les documents par contenant */
  const docByCont = {};
  documents.forEach(d => {
    const cid = d.contenantId;
    if (!cid) return;
    if (!docByCont[cid]) docByCont[cid] = [];
    docByCont[cid].push(d);
  });

  /* Anomalies réalistes pré-définies (liées aux vrais IDs) */
  const ANOMALIES_SEED = [
    { emplacementId:'EMP-001', type:'manquant',  severity:'haute', docId:'DOC-2025-0105', contId:'CNT-002', desc:'Convention Tamatave absente du carton — probablement sortie en consultation sans retour' },
    { emplacementId:'EMP-001', type:'mauvais_emplacement', severity:'moyenne', docId:'DOC-2025-0130', contId:'CNT-001', desc:'Note de service RH trouvée dans carton DG au lieu de EMP-002' },
    { emplacementId:'EMP-002', type:'endommage', severity:'haute', contId:'CNT-006', desc:'Boîte Paie 2024 — traces d\'humidité sur la tranche, 3 dossiers endommagés' },
    { emplacementId:'EMP-003', type:'excedentaire', severity:'basse', contId:'CNT-007', desc:'5 factures non enregistrées trouvées dans la boîte fournisseurs (doublons brouillon)' },
    { emplacementId:'EMP-003', type:'manquant', severity:'moyenne', docId:'DOC-2025-0135', contId:'CNT-011', desc:'Dossier client BNI en consultation non retourné — en cours chez Randria Marie-Claire' },
    { emplacementId:'EMP-005', type:'mauvais_emplacement', severity:'basse', contId:'CNT-008', desc:'Classeur Juridique 2024 déplacé sur étagère voisine — mauvais rayonnage' },
    { emplacementId:'EMP-006', type:'manquant', severity:'haute', desc:'2 cartons non identifiés au sol, pas de code-barres — origine inconnue' },
    { emplacementId:'EMP-006', type:'endommage', severity:'moyenne', desc:'Travée 3 — étiquettes décrochées sur 15 contenants, relabellisation nécessaire' },
    { emplacementId:'EMP-007', type:'excedentaire', severity:'basse', desc:'Lot archives définitives — 3 contenants non enregistrés (versement 2023 non soldé)' },
    { emplacementId:'EMP-009', type:'manquant', severity:'haute', contId:'CNT-010', desc:'Carton Transit Tamatave — 2 chemises manquantes par rapport au bordereau' },
  ];

  /* Construire les résultats par emplacement */
  return emplacements.map(e => {
    const conts = contByEmpl[e.id] || [];
    const theoContenants = conts.length;
    const theoDocs = conts.reduce((s, c) => s + c.contenu, 0);
    /* Simulation réaliste: ±0-3 d'écart sur les contenants, ±0-5 sur docs */
    const anomalies = ANOMALIES_SEED.filter(a => a.emplacementId === e.id);
    const ecartConts = anomalies.filter(a => a.type === 'manquant' && a.contId).length - anomalies.filter(a => a.type === 'excedentaire' && !a.docId).length;
    const ecartDocs = anomalies.filter(a => a.type === 'manquant' && a.docId).length * 1 + anomalies.filter(a => a.type === 'manquant' && !a.docId && !a.contId).length * 2;

    return {
      emplacementId: e.id,
      emplacement: e,
      theoContenants,
      reelContenants: Math.max(0, theoContenants - ecartConts + (anomalies.some(a=>a.type==='excedentaire')?1:0)),
      theoDocs,
      reelDocs: Math.max(0, theoDocs - ecartDocs + anomalies.filter(a=>a.type==='excedentaire').reduce((s,a)=>s+(a.docId?0:5),0)),
      anomalies: anomalies.map((a,i)=>({ ...a, id:`ANO-${e.id}-${String(i+1).padStart(2,'0')}`, statut:'ouvert', dateDetection:'2025-02-28', detectePar:'Ratsimbazafy Noro' })),
      statut: anomalies.length === 0 ? 'conforme' : anomalies.some(a=>a.severity==='haute') ? 'critique' : 'anomalie',
      inventorie: e.id !== 'EMP-010', /* EMP-010 (numérisation) pas encore fait */
    };
  });
}

/* ═══════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
═══════════════════════════════════════════════════ */
export default function LibInventaire({ documents = [], emplacements = [], contenants = [], users = [] }) {
  const [isMobile, setIsMobile] = useState(false);
  React.useEffect(() => { const c = () => setIsMobile(window.innerWidth < 768); c(); window.addEventListener('resize', c); return () => window.removeEventListener('resize', c); }, []);

  const [tab, setTab] = useState('campagnes');
  const [campaigns, setCampaigns] = useState(() => {
    const data = buildCampaignData(documents, emplacements, contenants);
    const allAnomalies = data.flatMap(d => d.anomalies);
    const inventories = data.filter(d => d.inventorie).length;
    return [
      {
        id:'INV-2025-001', nom:'Inventaire annuel Q1 2025', type:'complet',
        dateDebut:'2025-02-24', dateFin:null, statut:'en_cours',
        responsable:'Ratsimbazafy Noro', equipe:['Ratsimbazafy Noro','Rakoto Jean-Baptiste','Razafy Pierre'],
        sites:['Siège Analakely','Site Ankorondrano','Agence Tamatave'],
        emplacementsTotal:emplacements.length, emplacementsTraites:inventories,
        resultats: data,
        totalAnomalies: allAnomalies.length,
        anomaliesResolues: 0,
        progression: Math.round(inventories / emplacements.length * 100),
      },
      {
        id:'INV-2024-003', nom:'Inventaire semestriel S2 2024', type:'complet',
        dateDebut:'2024-09-15', dateFin:'2024-09-22', statut:'termine',
        responsable:'Razafy Pierre', equipe:['Razafy Pierre','Ratsimbazafy Noro'],
        sites:['Siège Analakely','Site Ankorondrano'],
        emplacementsTotal:8, emplacementsTraites:8,
        resultats:[],
        totalAnomalies:4, anomaliesResolues:4,
        progression:100,
      },
      {
        id:'INV-2024-002', nom:'Contrôle ciblé Coffre-fort', type:'cible',
        dateDebut:'2024-06-10', dateFin:'2024-06-10', statut:'termine',
        responsable:'Razafy Pierre', equipe:['Razafy Pierre'],
        sites:['Siège Analakely'],
        emplacementsTotal:1, emplacementsTraites:1,
        resultats:[], totalAnomalies:0, anomaliesResolues:0, progression:100,
      },
    ];
  });

  const [selCampaign, setSelCampaign] = useState(null);
  const [selEmpl, setSelEmpl] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [showReport, setShowReport] = useState(null);

  const activeCamp = campaigns.find(c => c.id === selCampaign);

  /* Correction d'anomalie */
  const resolveAnomaly = (campId, anoId, action) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id !== campId) return c;
      const newRes = c.resultats.map(r => ({
        ...r,
        anomalies: r.anomalies.map(a => a.id === anoId ? { ...a, statut: action, dateResolution: '2025-02-28', resoluPar: 'Razafy Pierre' } : a),
      }));
      const totalResolved = newRes.flatMap(r => r.anomalies).filter(a => a.statut !== 'ouvert').length;
      return { ...c, resultats: newRes, anomaliesResolues: totalResolved };
    }));
  };

  /* ── RAPPORT D'ÉCARTS ── */
  if (showReport) return <RapportEcarts campaign={showReport} isMobile={isMobile} onBack={() => setShowReport(null)} />;

  /* ── DÉTAIL EMPLACEMENT ── */
  if (selEmpl && activeCamp) {
    const res = activeCamp.resultats.find(r => r.emplacementId === selEmpl);
    if (!res) { setSelEmpl(null); return null; }
    return (
      <div>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
          <button onClick={() => setSelEmpl(null)} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:4, color:COLORS.primaryLight, fontSize:13, fontWeight:600, fontFamily:FF }}><ChevronLeft size={16} />Retour</button>
          <ChevronRight size={14} color={COLORS.textMut} />
          <span style={{ fontSize:13, fontWeight:600 }}>{res.emplacement.nom || res.emplacement.label}</span>
        </div>
        <EmplDetail result={res} campId={activeCamp.id} documents={documents} contenants={contenants} isMobile={isMobile} onResolve={resolveAnomaly} />
      </div>
    );
  }

  /* ── DÉTAIL CAMPAGNE ── */
  if (activeCamp) {
    return (
      <div>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
          <button onClick={() => setSelCampaign(null)} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:4, color:COLORS.primaryLight, fontSize:13, fontWeight:600, fontFamily:FF }}><ChevronLeft size={16} />Campagnes</button>
          <ChevronRight size={14} color={COLORS.textMut} />
          <span style={{ fontSize:13, fontWeight:600 }}>{activeCamp.nom}</span>
        </div>
        <CampaignDetail campaign={activeCamp} isMobile={isMobile} onSelectEmpl={setSelEmpl} onReport={() => setShowReport(activeCamp)} />
      </div>
    );
  }

  /* ── LISTE DES CAMPAGNES ── */
  const allAnomalies = campaigns[0]?.resultats?.flatMap(r => r.anomalies) || [];
  const openAno = allAnomalies.filter(a => a.statut === 'ouvert').length;
  const critAno = allAnomalies.filter(a => a.severity === 'haute' && a.statut === 'ouvert').length;

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ margin:0, fontSize:isMobile?20:24, fontWeight:700 }}>Inventaire physique</h1>
        <p style={{ margin:'4px 0 0', fontSize:13, color:COLORS.textMut }}>Campagnes d'inventaire, comparaison théorie / réalité, correction des anomalies</p>
      </div>

      {/* KPI */}
      <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr 1fr':'repeat(4,1fr)', gap:isMobile?10:14, marginBottom:24 }}>
        {[
          { label:'Campagne active', value:campaigns.filter(c=>c.statut==='en_cours').length, sub:`${campaigns[0]?.progression||0}% avancement`, color:'#2563eb', bg:'#eff6ff', icon:ClipboardList },
          { label:'Emplacements', value:`${campaigns[0]?.emplacementsTraites||0}/${emplacements.length}`, sub:'inventoriés', color:'#059669', bg:'#ecfdf5', icon:MapPin },
          { label:'Anomalies ouvertes', value:openAno, sub:`dont ${critAno} critique${critAno>1?'s':''}`, color:openAno>0?'#dc2626':'#059669', bg:openAno>0?'#fef2f2':'#ecfdf5', icon:AlertTriangle },
          { label:'Contenants scannés', value:contenants.length, sub:`${documents.length} documents`, color:'#7c3aed', bg:'#f5f3ff', icon:ScanLine },
        ].map((k,i) => (
          <div key={i} style={{ background:'#fff', borderRadius:12, padding:isMobile?14:'16px 18px', border:`1px solid ${COLORS.border}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div>
                <div style={{ fontSize:11, color:COLORS.textMut, marginBottom:4, fontWeight:500 }}>{k.label}</div>
                <div style={{ fontSize:isMobile?20:24, fontWeight:700, color:k.color }}>{k.value}</div>
                <div style={{ fontSize:11, color:COLORS.textMut, marginTop:2 }}>{k.sub}</div>
              </div>
              <div style={{ width:36, height:36, borderRadius:8, background:k.bg, display:'flex', alignItems:'center', justifyContent:'center' }}><k.icon size={18} color={k.color} /></div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
        {[{id:'campagnes',label:'Campagnes'},{id:'anomalies',label:`Anomalies (${openAno})`},{id:'historique',label:'Historique'}].map(t =>
          <button key={t.id} onClick={()=>setTab(t.id)} style={pill(tab===t.id)}>{t.label}</button>
        )}
        <div style={{ flex:1 }} />
        <Btn icon={Plus} label="Nouvelle campagne" onClick={()=>setShowNew(true)} />
      </div>

      {tab === 'campagnes' && (
        <div style={{ display:'grid', gap:12 }}>
          {campaigns.map(c => <CampaignCard key={c.id} campaign={c} isMobile={isMobile} onClick={() => setSelCampaign(c.id)} onReport={() => setShowReport(c)} />)}
        </div>
      )}

      {tab === 'anomalies' && <AnomaliesList anomalies={allAnomalies} campId={campaigns[0]?.id} isMobile={isMobile} documents={documents} onResolve={resolveAnomaly} />}

      {tab === 'historique' && (
        <div style={card}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
            <thead><tr style={{ background:COLORS.primaryLighter }}>{['Campagne','Type','Période','Emplacements','Anomalies','Statut'].map((h,i)=><th key={i} style={{ padding:'10px 14px', textAlign:'left', fontSize:11, fontWeight:700, color:COLORS.textSec }}>{h}</th>)}</tr></thead>
            <tbody>{campaigns.map(c => (
              <tr key={c.id} style={{ borderBottom:`1px solid ${COLORS.border}`, cursor:'pointer' }} onClick={()=>setSelCampaign(c.id)}>
                <td style={{ padding:'10px 14px' }}><div style={{ fontWeight:600 }}>{c.nom}</div><div style={{ fontSize:10, color:COLORS.textMut, fontFamily:'monospace' }}>{c.id}</div></td>
                <td style={{ padding:'10px 14px' }}><Badge label={c.type==='complet'?'Complet':'Ciblé'} color={c.type==='complet'?'#2563eb':'#7c3aed'} /></td>
                <td style={{ padding:'10px 14px', fontSize:11 }}>{c.dateDebut} → {c.dateFin||'en cours'}</td>
                <td style={{ padding:'10px 14px' }}>{c.emplacementsTraites}/{c.emplacementsTotal}</td>
                <td style={{ padding:'10px 14px' }}>{c.totalAnomalies} ({c.anomaliesResolues} résolues)</td>
                <td style={{ padding:'10px 14px' }}><Badge label={c.statut==='en_cours'?'En cours':c.statut==='termine'?'Terminé':'Planifié'} color={c.statut==='en_cours'?'#d97706':c.statut==='termine'?'#059669':'#2563eb'} /></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}

      {/* Modal nouvelle campagne */}
      {showNew && <NewCampaignModal emplacements={emplacements} isMobile={isMobile} onClose={()=>setShowNew(false)} onCreate={c => {
        setCampaigns(p => [c, ...p]);
        setShowNew(false);
        setSelCampaign(c.id);
      }} />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CAMPAIGN CARD
═══════════════════════════════════════════════════════════════ */
function CampaignCard({ campaign: c, isMobile, onClick, onReport }) {
  const pct = c.progression;
  const barColor = c.statut==='termine'?'#059669':pct>=70?'#2563eb':pct>=40?'#d97706':'#dc2626';
  return (
    <div style={{ ...card, padding:isMobile?14:20, cursor:'pointer' }} onClick={onClick}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
            <span style={{ fontSize:15, fontWeight:700 }}>{c.nom}</span>
            <Badge label={c.statut==='en_cours'?'En cours':c.statut==='termine'?'Terminé':'Planifié'} color={c.statut==='en_cours'?'#d97706':c.statut==='termine'?'#059669':'#2563eb'} />
            <Badge label={c.type==='complet'?'Complet':'Ciblé'} color={c.type==='complet'?'#2563eb':'#7c3aed'} />
          </div>
          <div style={{ fontSize:12, color:COLORS.textMut, marginTop:4 }}>
            <Calendar size={12} style={{ verticalAlign:'middle', marginRight:4 }} />{c.dateDebut} → {c.dateFin||'en cours'}
            <span style={{ margin:'0 8px' }}>•</span>
            <Users size={12} style={{ verticalAlign:'middle', marginRight:4 }} />{c.responsable}
          </div>
        </div>
        {c.statut !== 'termine' && c.totalAnomalies > 0 && (
          <Btn icon={BarChart3} label="Rapport" variant="ghost" size="sm" onClick={e=>{e.stopPropagation();onReport();}} />
        )}
      </div>
      {/* Progress */}
      <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr 1fr 1fr', gap:12, marginBottom:12 }}>
        <Kpi label="Progression" value={`${pct}%`} color={barColor} />
        <Kpi label="Emplacements" value={`${c.emplacementsTraites}/${c.emplacementsTotal}`} color="#2563eb" />
        <Kpi label="Anomalies" value={c.totalAnomalies} color={c.totalAnomalies>0?'#dc2626':'#059669'} />
        <Kpi label="Résolues" value={c.anomaliesResolues} color="#059669" />
      </div>
      <div style={{ height:6, background:'#e2e8f0', borderRadius:3 }}>
        <div style={{ width:`${pct}%`, height:'100%', background:barColor, borderRadius:3, transition:'width .5s ease' }} />
      </div>
      {/* Sites */}
      <div style={{ display:'flex', gap:6, marginTop:10, flexWrap:'wrap' }}>
        {c.sites.map(s => <span key={s} style={{ padding:'3px 10px', borderRadius:12, background:'#f1f5f9', fontSize:11, color:COLORS.textSec }}><Building2 size={10} style={{ verticalAlign:'middle', marginRight:3 }} />{s}</span>)}
      </div>
    </div>
  );
}

function Kpi({ label, value, color }) {
  return <div><div style={{ fontSize:10, color:COLORS.textMut }}>{label}</div><div style={{ fontSize:16, fontWeight:700, color }}>{value}</div></div>;
}

/* ═══════════════════════════════════════════════════════════════
   CAMPAIGN DETAIL — vue par emplacement
═══════════════════════════════════════════════════════════════ */
function CampaignDetail({ campaign: c, isMobile, onSelectEmpl, onReport }) {
  const [filterSt, setFilterSt] = useState('all');
  const results = c.resultats || [];
  const filtered = filterSt === 'all' ? results : results.filter(r => r.statut === filterSt);

  const counts = { conforme:0, anomalie:0, critique:0, nonFait:0 };
  results.forEach(r => { if (!r.inventorie) counts.nonFait++; else counts[r.statut] = (counts[r.statut]||0)+1; });

  return (
    <div>
      {/* KPI bar */}
      <div style={{ display:'grid', gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(5,1fr)', gap:10, marginBottom:20 }}>
        {[
          { label:'Conformes', value:counts.conforme, color:'#059669', bg:'#ecfdf5', icon:CheckCircle2 },
          { label:'Anomalies', value:counts.anomalie, color:'#d97706', bg:'#fffbeb', icon:AlertTriangle },
          { label:'Critiques', value:counts.critique, color:'#dc2626', bg:'#fef2f2', icon:XCircle },
          { label:'Non inventoriés', value:counts.nonFait, color:'#94a3b8', bg:'#f8fafc', icon:Clock },
          { label:'Progression', value:`${c.progression}%`, color:'#2563eb', bg:'#eff6ff', icon:BarChart3 },
        ].map((k,i) => (
          <div key={i} style={{ background:'#fff', borderRadius:10, padding:14, border:`1px solid ${COLORS.border}`, display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:k.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><k.icon size={16} color={k.color} /></div>
            <div><div style={{ fontSize:10, color:COLORS.textMut }}>{k.label}</div><div style={{ fontSize:18, fontWeight:700, color:k.color }}>{k.value}</div></div>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
        {[{id:'all',label:'Tous'},{id:'conforme',label:'Conformes'},{id:'anomalie',label:'Anomalies'},{id:'critique',label:'Critiques'}].map(f =>
          <button key={f.id} onClick={()=>setFilterSt(f.id)} style={pill(filterSt===f.id)}>{f.label}</button>
        )}
        <div style={{ flex:1 }} />
        <Btn icon={BarChart3} label="Rapport d'écarts" onClick={onReport} />
      </div>

      {/* Tableau emplacements */}
      <div style={{ ...card, overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12, minWidth:700 }}>
          <thead><tr style={{ background:COLORS.primaryLighter }}>
            {['Emplacement','Site','Contenants','Documents','Écart','Anomalies','Statut',''].map((h,i)=>
              <th key={i} style={{ padding:'10px 14px', textAlign:i>=2?'center':'left', fontSize:11, fontWeight:700, color:COLORS.textSec }}>{h}</th>
            )}
          </tr></thead>
          <tbody>{filtered.map(r => {
            const st = !r.inventorie ? { label:'En attente', color:'#94a3b8', bg:'#f8fafc' } :
                       r.statut==='conforme' ? { label:'Conforme', color:'#059669', bg:'#ecfdf5' } :
                       r.statut==='critique' ? { label:'Critique', color:'#dc2626', bg:'#fef2f2' } :
                       { label:'Anomalie', color:'#d97706', bg:'#fffbeb' };
            const ecartC = r.reelContenants - r.theoContenants;
            const ecartD = r.reelDocs - r.theoDocs;
            return (
              <tr key={r.emplacementId} style={{ borderBottom:`1px solid ${COLORS.border}`, cursor:'pointer', background:!r.inventorie?'#fafafa':'transparent' }}
                onClick={() => r.inventorie && onSelectEmpl(r.emplacementId)}>
                <td style={{ padding:'10px 14px' }}>
                  <div style={{ fontWeight:600, fontSize:13 }}>{r.emplacement.nom||r.emplacement.label}</div>
                  <div style={{ fontSize:10, color:COLORS.textMut, fontFamily:'monospace' }}>{r.emplacementId} • {r.emplacement.type}</div>
                </td>
                <td style={{ padding:'10px 14px', fontSize:11, color:COLORS.textSec }}>{r.emplacement.site}</td>
                <td style={{ padding:'10px 14px', textAlign:'center' }}>
                  <span style={{ fontWeight:600 }}>{r.theoContenants}</span>
                  <span style={{ color:COLORS.textMut }}> → </span>
                  <span style={{ fontWeight:700, color:ecartC===0?'#059669':ecartC>0?'#2563eb':'#dc2626' }}>{r.reelContenants}</span>
                </td>
                <td style={{ padding:'10px 14px', textAlign:'center' }}>
                  <span style={{ fontWeight:600 }}>{r.theoDocs}</span>
                  <span style={{ color:COLORS.textMut }}> → </span>
                  <span style={{ fontWeight:700, color:ecartD===0?'#059669':ecartD>0?'#2563eb':'#dc2626' }}>{r.reelDocs}</span>
                </td>
                <td style={{ padding:'10px 14px', textAlign:'center' }}>
                  <EcartBadge ecart={ecartC + ecartD} />
                </td>
                <td style={{ padding:'10px 14px', textAlign:'center' }}>
                  {r.anomalies.length > 0 ? <span style={{ fontWeight:700, color:'#dc2626' }}>{r.anomalies.length}</span> : <span style={{ color:'#059669' }}>0</span>}
                </td>
                <td style={{ padding:'10px 14px', textAlign:'center' }}>
                  <span style={{ padding:'4px 10px', borderRadius:12, fontSize:11, fontWeight:600, background:st.bg, color:st.color }}>{st.label}</span>
                </td>
                <td style={{ padding:'10px 14px' }}>
                  {r.inventorie && <ChevronRight size={14} color={COLORS.textMut} />}
                </td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>
    </div>
  );
}

function EcartBadge({ ecart }) {
  if (ecart === 0) return <span style={{ color:'#059669', fontWeight:700 }}>—</span>;
  const pos = ecart > 0;
  return <span style={{ fontWeight:700, color:pos?'#2563eb':'#dc2626', display:'inline-flex', alignItems:'center', gap:2 }}>
    {pos ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {pos?'+':''}{ecart}
  </span>;
}

/* ═══════════════════════════════════════════════════════════════
   DÉTAIL EMPLACEMENT — théorie vs réalité + anomalies
═══════════════════════════════════════════════════════════════ */
function EmplDetail({ result: r, campId, documents, contenants, isMobile, onResolve }) {
  const e = r.emplacement;
  const contsByEmpl = contenants.filter(c => c.emplacementId === e.id);
  const docsByEmpl = documents.filter(d => contsByEmpl.some(c => c.id === d.contenantId));

  return (
    <div>
      {/* Header emplacement */}
      <div style={{ ...card, padding:20, marginBottom:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
          <div>
            <h2 style={{ margin:0, fontSize:18, fontWeight:700 }}>{e.nom || e.label}</h2>
            <div style={{ fontSize:12, color:COLORS.textMut, marginTop:4 }}>{e.site} › {e.batiment} › Étage {e.etage} › {e.salle}</div>
          </div>
          <Badge label={r.statut==='conforme'?'Conforme':r.statut==='critique'?'Critique':'Anomalie'} color={r.statut==='conforme'?'#059669':r.statut==='critique'?'#dc2626':'#d97706'} />
        </div>
      </div>

      {/* Comparaison théorie / réalité */}
      <h3 style={{ fontSize:14, fontWeight:700, marginBottom:12 }}>Comparaison théorie / réalité</h3>
      <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap:14, marginBottom:20 }}>
        <CompareCard label="Contenants" theo={r.theoContenants} reel={r.reelContenants} icon={Package} />
        <CompareCard label="Documents" theo={r.theoDocs} reel={r.reelDocs} icon={FileText} />
      </div>

      {/* Contenants inventoriés */}
      <h3 style={{ fontSize:14, fontWeight:700, marginBottom:12 }}>Contenants dans cet emplacement ({contsByEmpl.length})</h3>
      <div style={{ ...card, marginBottom:20 }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
          <thead><tr style={{ background:'#f8fafc' }}>{['Contenant','Type','Statut','Capacité','Contenu','Code-barres'].map((h,i)=><th key={i} style={{ padding:'8px 14px', textAlign:'left', fontSize:11, fontWeight:700, color:COLORS.textSec }}>{h}</th>)}</tr></thead>
          <tbody>{contsByEmpl.map(c => (
            <tr key={c.id} style={{ borderBottom:`1px solid ${COLORS.border}` }}>
              <td style={{ padding:'8px 14px' }}><div style={{ fontWeight:600 }}>{c.label}</div><div style={{ fontSize:10, fontFamily:'monospace', color:COLORS.textMut }}>{c.id}</div></td>
              <td style={{ padding:'8px 14px' }}><Badge label={c.type} color="#475569" /></td>
              <td style={{ padding:'8px 14px' }}><Badge label={c.statut} color={c.statut==='ouvert'?'#059669':c.statut==='scelle'?'#7c3aed':c.statut==='ferme'?'#d97706':'#0891b2'} /></td>
              <td style={{ padding:'8px 14px' }}>{c.capacite}</td>
              <td style={{ padding:'8px 14px', fontWeight:600 }}>{c.contenu}</td>
              <td style={{ padding:'8px 14px', fontFamily:'monospace', fontSize:11, color:COLORS.textMut }}>{c.codeBarres}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      {/* Anomalies */}
      <h3 style={{ fontSize:14, fontWeight:700, marginBottom:12, display:'flex', alignItems:'center', gap:6 }}>
        <AlertTriangle size={16} color="#dc2626" /> Anomalies ({r.anomalies.length})
      </h3>
      {r.anomalies.length === 0 ? (
        <div style={{ ...card, padding:30, textAlign:'center', color:'#059669' }}><CheckCircle2 size={24} style={{ marginBottom:8 }} /><div style={{ fontWeight:600 }}>Aucune anomalie — emplacement conforme</div></div>
      ) : (
        <div style={{ display:'grid', gap:10 }}>
          {r.anomalies.map(a => <AnomalyCard key={a.id} anomaly={a} campId={campId} onResolve={onResolve} />)}
        </div>
      )}
    </div>
  );
}

function CompareCard({ label, theo, reel, icon: Icon }) {
  const ecart = reel - theo;
  const pct = theo > 0 ? Math.round(reel / theo * 100) : 100;
  return (
    <div style={{ ...card, padding:16 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}><Icon size={16} color={COLORS.primary} /><span style={{ fontSize:13, fontWeight:700 }}>{label}</span></div>
        <EcartBadge ecart={ecart} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, textAlign:'center' }}>
        <div style={{ padding:10, background:'#eff6ff', borderRadius:8 }}><div style={{ fontSize:10, color:'#1e40af' }}>Théorique</div><div style={{ fontSize:20, fontWeight:700, color:'#2563eb' }}>{theo}</div></div>
        <div style={{ padding:10, background:ecart===0?'#ecfdf5':ecart>0?'#eff6ff':'#fef2f2', borderRadius:8 }}><div style={{ fontSize:10, color:ecart===0?'#065f46':ecart>0?'#1e40af':'#991b1b' }}>Réel</div><div style={{ fontSize:20, fontWeight:700, color:ecart===0?'#059669':ecart>0?'#2563eb':'#dc2626' }}>{reel}</div></div>
        <div style={{ padding:10, background:'#f8fafc', borderRadius:8 }}><div style={{ fontSize:10, color:COLORS.textMut }}>Taux</div><div style={{ fontSize:20, fontWeight:700, color:pct===100?'#059669':pct>=95?'#d97706':'#dc2626' }}>{pct}%</div></div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ANOMALY CARD + LIST
═══════════════════════════════════════════════════════════════ */
function AnomalyCard({ anomaly: a, campId, onResolve }) {
  const ATYPE = { manquant:{ label:'Manquant', color:'#dc2626', bg:'#fef2f2', icon:XCircle }, excedentaire:{ label:'Excédentaire', color:'#2563eb', bg:'#eff6ff', icon:TrendingUp }, endommage:{ label:'Endommagé', color:'#d97706', bg:'#fffbeb', icon:AlertTriangle }, mauvais_emplacement:{ label:'Mauvais empl.', color:'#7c3aed', bg:'#f5f3ff', icon:MapPin } };
  const SEV = { haute:{ label:'Haute', color:'#dc2626' }, moyenne:{ label:'Moyenne', color:'#d97706' }, basse:{ label:'Basse', color:'#64748b' } };
  const at = ATYPE[a.type] || ATYPE.manquant;
  const sv = SEV[a.severity] || SEV.basse;
  const resolved = a.statut !== 'ouvert';

  return (
    <div style={{ ...card, padding:16, opacity:resolved?0.7:1, borderLeft:`4px solid ${at.color}` }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
          <span style={{ padding:'3px 10px', borderRadius:12, fontSize:11, fontWeight:600, background:at.bg, color:at.color, display:'inline-flex', alignItems:'center', gap:4 }}><at.icon size={12} />{at.label}</span>
          <span style={{ padding:'3px 8px', borderRadius:12, fontSize:11, fontWeight:600, color:sv.color, background:'#f8fafc' }}>⚡ {sv.label}</span>
          {resolved && <Badge label={a.statut==='corrige'?'Corrigé':a.statut==='accepte'?'Accepté':'Ignoré'} color="#059669" />}
        </div>
        <span style={{ fontSize:10, fontFamily:'monospace', color:COLORS.textMut }}>{a.id}</span>
      </div>
      <p style={{ margin:'0 0 8px', fontSize:13, color:COLORS.text, lineHeight:1.5 }}>{a.desc}</p>
      <div style={{ fontSize:11, color:COLORS.textMut }}>
        {a.docId && <span>Document : <strong style={{ fontFamily:'monospace' }}>{a.docId}</strong> • </span>}
        {a.contId && <span>Contenant : <strong style={{ fontFamily:'monospace' }}>{a.contId}</strong> • </span>}
        Détecté le {a.dateDetection} par {a.detectePar}
      </div>
      {!resolved && (
        <div style={{ display:'flex', gap:6, marginTop:10 }}>
          <Btn icon={Check} label="Corriger" size="sm" onClick={() => onResolve(campId, a.id, 'corrige')} />
          <Btn icon={CheckCircle2} label="Accepter" size="sm" variant="ghost" onClick={() => onResolve(campId, a.id, 'accepte')} />
          <Btn icon={X} label="Ignorer" size="sm" variant="ghost" onClick={() => onResolve(campId, a.id, 'ignore')} />
        </div>
      )}
      {resolved && a.dateResolution && <div style={{ fontSize:11, color:'#059669', marginTop:6 }}>Résolu le {a.dateResolution} par {a.resoluPar}</div>}
    </div>
  );
}

function AnomaliesList({ anomalies, campId, isMobile, documents, onResolve }) {
  const [filterType, setFilterType] = useState('all');
  const [filterSev, setFilterSev] = useState('all');
  const open = anomalies.filter(a => a.statut === 'ouvert');
  const resolved = anomalies.filter(a => a.statut !== 'ouvert');
  const filtered = (filterType === 'all' ? open : open.filter(a => a.type === filterType))
    .filter(a => filterSev === 'all' || a.severity === filterSev);

  return (
    <div>
      <div style={{ display:'flex', gap:8, marginBottom:14, flexWrap:'wrap' }}>
        <select value={filterType} onChange={e=>setFilterType(e.target.value)} style={{ ...inp, width:'auto', fontSize:12 }}>
          <option value="all">Tous types</option><option value="manquant">Manquants</option><option value="excedentaire">Excédentaires</option><option value="endommage">Endommagés</option><option value="mauvais_emplacement">Mauvais empl.</option>
        </select>
        <select value={filterSev} onChange={e=>setFilterSev(e.target.value)} style={{ ...inp, width:'auto', fontSize:12 }}>
          <option value="all">Toutes sévérités</option><option value="haute">Haute</option><option value="moyenne">Moyenne</option><option value="basse">Basse</option>
        </select>
        <span style={{ fontSize:12, color:COLORS.textMut, alignSelf:'center' }}>{filtered.length} anomalie{filtered.length>1?'s':''} ouverte{filtered.length>1?'s':''}</span>
      </div>
      <div style={{ display:'grid', gap:10 }}>
        {filtered.map(a => <AnomalyCard key={a.id} anomaly={a} campId={campId} onResolve={onResolve} />)}
        {filtered.length === 0 && <div style={{ ...card, padding:30, textAlign:'center', color:'#059669' }}><CheckCircle2 size={24} /><div style={{ marginTop:8, fontWeight:600 }}>Toutes les anomalies sont résolues</div></div>}
      </div>
      {resolved.length > 0 && (
        <div style={{ marginTop:20 }}>
          <h4 style={{ fontSize:13, fontWeight:700, color:COLORS.textMut, marginBottom:10 }}>Résolues ({resolved.length})</h4>
          <div style={{ display:'grid', gap:8 }}>{resolved.map(a => <AnomalyCard key={a.id} anomaly={a} campId={campId} onResolve={onResolve} />)}</div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   RAPPORT D'ÉCARTS
═══════════════════════════════════════════════════════════════ */
function RapportEcarts({ campaign: c, isMobile, onBack }) {
  const results = c.resultats || [];
  const allAno = results.flatMap(r => r.anomalies);
  const byType = {};
  allAno.forEach(a => { byType[a.type] = (byType[a.type]||0)+1; });
  const bySev = {};
  allAno.forEach(a => { bySev[a.severity] = (bySev[a.severity]||0)+1; });
  const byEmpl = results.filter(r => r.anomalies.length > 0);

  const totalTheoC = results.reduce((s,r)=>s+r.theoContenants,0);
  const totalReelC = results.reduce((s,r)=>s+r.reelContenants,0);
  const totalTheoD = results.reduce((s,r)=>s+r.theoDocs,0);
  const totalReelD = results.reduce((s,r)=>s+r.reelDocs,0);
  const tauxConf = results.length ? Math.round(results.filter(r=>r.statut==='conforme').length / results.filter(r=>r.inventorie).length * 100) : 0;

  const ATYPE_LABELS = { manquant:'Manquant', excedentaire:'Excédentaire', endommage:'Endommagé', mauvais_emplacement:'Mauvais empl.' };
  const ATYPE_COLORS = { manquant:'#dc2626', excedentaire:'#2563eb', endommage:'#d97706', mauvais_emplacement:'#7c3aed' };
  const SEV_COLORS = { haute:'#dc2626', moyenne:'#d97706', basse:'#64748b' };

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
        <button onClick={onBack} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:4, color:COLORS.primaryLight, fontSize:13, fontWeight:600, fontFamily:FF }}><ChevronLeft size={16} />Retour</button>
        <ChevronRight size={14} color={COLORS.textMut} />
        <span style={{ fontSize:13, fontWeight:600 }}>Rapport d'écarts</span>
      </div>

      {/* En-tête rapport */}
      <div style={{ ...card, padding:24, marginBottom:20 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12, marginBottom:16 }}>
          <div>
            <h2 style={{ margin:0, fontSize:20, fontWeight:700 }}>Rapport d'écarts — {c.nom}</h2>
            <div style={{ fontSize:12, color:COLORS.textMut, marginTop:4 }}>
              Campagne {c.id} • {c.dateDebut} → {c.dateFin||'en cours'} • Responsable : {c.responsable}
            </div>
          </div>
          <Btn icon={Printer} label="Imprimer" variant="ghost" onClick={()=>window.print()} />
        </div>

        {/* Synthèse globale */}
        <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr 1fr':'repeat(5,1fr)', gap:12 }}>
          {[
            { label:'Taux conformité', value:`${tauxConf}%`, color:tauxConf>=80?'#059669':tauxConf>=60?'#d97706':'#dc2626' },
            { label:'Contenants', value:`${totalTheoC} → ${totalReelC}`, color:totalTheoC===totalReelC?'#059669':'#dc2626' },
            { label:'Documents', value:`${totalTheoD} → ${totalReelD}`, color:totalTheoD===totalReelD?'#059669':'#dc2626' },
            { label:'Total anomalies', value:allAno.length, color:allAno.length>0?'#dc2626':'#059669' },
            { label:'Résolues', value:`${c.anomaliesResolues}/${allAno.length}`, color:'#7c3aed' },
          ].map((k,i) => (
            <div key={i} style={{ padding:14, background:'#f8fafc', borderRadius:8, textAlign:'center' }}>
              <div style={{ fontSize:10, color:COLORS.textMut, marginBottom:4 }}>{k.label}</div>
              <div style={{ fontSize:18, fontWeight:700, color:k.color }}>{k.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Répartition par type */}
      <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap:16, marginBottom:20 }}>
        <div style={{ ...card, padding:20 }}>
          <h4 style={{ margin:'0 0 14px', fontSize:14, fontWeight:700 }}>Anomalies par type</h4>
          {Object.entries(byType).map(([type, count]) => {
            const pct = allAno.length ? Math.round(count / allAno.length * 100) : 0;
            return (
              <div key={type} style={{ marginBottom:10 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <span style={{ fontSize:12, fontWeight:600 }}>{ATYPE_LABELS[type]||type}</span>
                  <span style={{ fontSize:12, fontWeight:700, color:ATYPE_COLORS[type] }}>{count} ({pct}%)</span>
                </div>
                <div style={{ height:8, background:'#e2e8f0', borderRadius:4 }}>
                  <div style={{ width:`${pct}%`, height:'100%', background:ATYPE_COLORS[type], borderRadius:4 }} />
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ ...card, padding:20 }}>
          <h4 style={{ margin:'0 0 14px', fontSize:14, fontWeight:700 }}>Anomalies par sévérité</h4>
          {Object.entries(bySev).sort((a,b)=>b[1]-a[1]).map(([sev, count]) => {
            const pct = allAno.length ? Math.round(count / allAno.length * 100) : 0;
            return (
              <div key={sev} style={{ marginBottom:10 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <span style={{ fontSize:12, fontWeight:600 }}>{sev.charAt(0).toUpperCase()+sev.slice(1)}</span>
                  <span style={{ fontSize:12, fontWeight:700, color:SEV_COLORS[sev] }}>{count} ({pct}%)</span>
                </div>
                <div style={{ height:8, background:'#e2e8f0', borderRadius:4 }}>
                  <div style={{ width:`${pct}%`, height:'100%', background:SEV_COLORS[sev], borderRadius:4 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Détail par emplacement */}
      <div style={{ ...card }}>
        <div style={{ padding:'14px 20px', borderBottom:`1px solid ${COLORS.border}`, fontWeight:700, fontSize:14 }}>Détail par emplacement</div>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
          <thead><tr style={{ background:'#f8fafc' }}>
            {['Emplacement','Site','Cont. théo.','Cont. réel','Docs théo.','Docs réel','Anomalies','Statut'].map((h,i)=>
              <th key={i} style={{ padding:'8px 14px', textAlign:i>=2?'center':'left', fontSize:11, fontWeight:700, color:COLORS.textSec }}>{h}</th>
            )}
          </tr></thead>
          <tbody>{results.filter(r=>r.inventorie).map(r => {
            const st = r.statut==='conforme'?{l:'✅ Conforme',c:'#059669'}:r.statut==='critique'?{l:'❌ Critique',c:'#dc2626'}:{l:'⚠️ Anomalie',c:'#d97706'};
            return (
              <tr key={r.emplacementId} style={{ borderBottom:`1px solid ${COLORS.border}` }}>
                <td style={{ padding:'8px 14px', fontWeight:600 }}>{r.emplacement.nom||r.emplacement.label}</td>
                <td style={{ padding:'8px 14px', color:COLORS.textMut }}>{r.emplacement.site}</td>
                <td style={{ padding:'8px 14px', textAlign:'center' }}>{r.theoContenants}</td>
                <td style={{ padding:'8px 14px', textAlign:'center', fontWeight:600, color:r.reelContenants!==r.theoContenants?'#dc2626':'inherit' }}>{r.reelContenants}</td>
                <td style={{ padding:'8px 14px', textAlign:'center' }}>{r.theoDocs}</td>
                <td style={{ padding:'8px 14px', textAlign:'center', fontWeight:600, color:r.reelDocs!==r.theoDocs?'#dc2626':'inherit' }}>{r.reelDocs}</td>
                <td style={{ padding:'8px 14px', textAlign:'center', fontWeight:700, color:r.anomalies.length?'#dc2626':'#059669' }}>{r.anomalies.length}</td>
                <td style={{ padding:'8px 14px', textAlign:'center', fontWeight:600, color:st.c }}>{st.l}</td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>

      {/* Liste des anomalies */}
      <div style={{ ...card, marginTop:16 }}>
        <div style={{ padding:'14px 20px', borderBottom:`1px solid ${COLORS.border}`, fontWeight:700, fontSize:14 }}>Liste complète des anomalies ({allAno.length})</div>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
          <thead><tr style={{ background:'#f8fafc' }}>{['Réf.','Emplacement','Type','Sévérité','Description','Statut'].map((h,i)=><th key={i} style={{ padding:'8px 14px', textAlign:'left', fontSize:11, fontWeight:700, color:COLORS.textSec }}>{h}</th>)}</tr></thead>
          <tbody>{allAno.map(a => (
            <tr key={a.id} style={{ borderBottom:`1px solid ${COLORS.border}` }}>
              <td style={{ padding:'8px 14px', fontFamily:'monospace', fontSize:11 }}>{a.id}</td>
              <td style={{ padding:'8px 14px' }}>{a.emplacementId}</td>
              <td style={{ padding:'8px 14px' }}><span style={{ color:ATYPE_COLORS[a.type], fontWeight:600 }}>{ATYPE_LABELS[a.type]}</span></td>
              <td style={{ padding:'8px 14px' }}><span style={{ color:SEV_COLORS[a.severity], fontWeight:600 }}>{a.severity}</span></td>
              <td style={{ padding:'8px 14px', maxWidth:300, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.desc}</td>
              <td style={{ padding:'8px 14px' }}><Badge label={a.statut==='ouvert'?'Ouvert':a.statut==='corrige'?'Corrigé':a.statut==='accepte'?'Accepté':'Ignoré'} color={a.statut==='ouvert'?'#dc2626':'#059669'} /></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NOUVELLE CAMPAGNE
═══════════════════════════════════════════════════════════════ */
function NewCampaignModal({ emplacements, isMobile, onClose, onCreate }) {
  const [form, setForm] = useState({ nom:'', type:'complet', responsable:'Ratsimbazafy Noro', sites:[], dateDebut:new Date().toISOString().slice(0,10) });
  const up = (k,v) => setForm(p=>({...p,[k]:v}));
  const allSites = [...new Set(emplacements.map(e => e.site))];

  return (
    <Modal title="Nouvelle campagne d'inventaire" onClose={onClose} width={560}>
      <div style={{ padding:20 }}>
        <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap:14, marginBottom:14 }}>
          <div style={{ gridColumn:'1/-1' }}><label style={lbl}>Nom de la campagne *</label><input value={form.nom} onChange={e=>up('nom',e.target.value)} style={inp} placeholder="Ex: Inventaire annuel Q1 2025" /></div>
          <div><label style={lbl}>Type</label><select value={form.type} onChange={e=>up('type',e.target.value)} style={inp}><option value="complet">Inventaire complet</option><option value="cible">Contrôle ciblé</option><option value="partiel">Inventaire partiel</option></select></div>
          <div><label style={lbl}>Date de début</label><input type="date" value={form.dateDebut} onChange={e=>up('dateDebut',e.target.value)} style={inp} /></div>
          <div><label style={lbl}>Responsable</label><select value={form.responsable} onChange={e=>up('responsable',e.target.value)} style={inp}>
            <option>Ratsimbazafy Noro</option><option>Razafy Pierre</option><option>Rakoto Jean-Baptiste</option>
          </select></div>
        </div>
        <div style={{ marginBottom:14 }}>
          <label style={lbl}>Sites à inventorier</label>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {allSites.map(s => {
              const sel = form.sites.includes(s);
              return <button key={s} onClick={()=>up('sites',sel?form.sites.filter(x=>x!==s):[...form.sites,s])} style={{ padding:'6px 14px', borderRadius:8, border:`2px solid ${sel?COLORS.primary:COLORS.border}`, background:sel?COLORS.primaryLighter:'#fff', cursor:'pointer', fontSize:12, fontWeight:sel?700:500, fontFamily:FF, color:sel?COLORS.primary:COLORS.text }}>
                <Building2 size={12} style={{ verticalAlign:'middle', marginRight:4 }} />{s}
              </button>;
            })}
          </div>
        </div>
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
          <Btn label="Annuler" variant="ghost" onClick={onClose} />
          <Btn icon={Play} label="Lancer la campagne" onClick={() => {
            if (!form.nom.trim()) return;
            const sites = form.sites.length ? form.sites : allSites;
            const emplsFiltered = emplacements.filter(e => sites.includes(e.site));
            onCreate({
              id:`INV-${new Date().getFullYear()}-${String(Math.floor(Math.random()*900)+100)}`,
              nom:form.nom, type:form.type, dateDebut:form.dateDebut, dateFin:null,
              statut:'en_cours', responsable:form.responsable, equipe:[form.responsable],
              sites, emplacementsTotal:emplsFiltered.length, emplacementsTraites:0,
              resultats:emplsFiltered.map(e=>({ emplacementId:e.id, emplacement:e, theoContenants:0, reelContenants:0, theoDocs:0, reelDocs:0, anomalies:[], statut:'conforme', inventorie:false })),
              totalAnomalies:0, anomaliesResolues:0, progression:0,
            });
          }} />
        </div>
      </div>
    </Modal>
  );
}