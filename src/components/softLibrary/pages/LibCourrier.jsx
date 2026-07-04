/* ═══════════════════════════════════════════════════════════════
   SOFT LIBRARY — Gestion du Courrier & Flux Entrants
   ─────────────────────────────────────────────────────────────
   ✓ Enregistrement courrier entrant / sortant / interne
   ✓ Numérotation automatique chronologique
   ✓ Scan & capture documentaire (simulation)
   ✓ OCR pour indexation automatique
   ✓ Reconnaissance de champs (expéditeur, date, référence…)
   ✓ Circuit de validation / visa / signature multi-niveau
   ✓ Rattachement à un dossier physique ou contenant
   ✓ Suivi du traitement du courrier
   ✓ Journal d'audit complet
   ✓ Statistiques et tableau de bord
   ✓ Responsive mobile / tablet / desktop
═══════════════════════════════════════════════════════════════ */
import React, { useState, useMemo, useCallback } from 'react';
import {
  Plus, Search, Eye, Edit3, X, Check, ChevronDown, ChevronRight,
  Clock, FileText, Save, AlertTriangle, Filter, Download,
  History, Lock, ScanLine, Calendar, User, Building2,
  RefreshCw, CheckCircle2, XCircle, Info,
  Package, Shield, Send, ArrowRight, ArrowLeft, Bell,
  BarChart3, BookOpen, UserCheck, Users, Clipboard,
  AlertCircle, RotateCcw, ExternalLink,
  Printer, QrCode, Tag, MapPin, Inbox, ChevronLeft,
  TrendingUp, Minus, MoreVertical, PieChart,
  Activity, Layers, Copy, Archive, ArrowRightLeft,
  Mail, Paperclip, Stamp, PenTool, Hash, Link2,
  FolderOpen, Zap, Upload, Image, Type, Scan,
} from 'lucide-react';
import { COLORS, FONT_FAMILY } from '../theme';
import { Badge, Btn, Modal, Pagination, SearchBar } from '../components/ui';
import { SHARED_COURRIERS, SHARED_USERS } from '../data/sharedData';

const FF = FONT_FAMILY;
const labelStyle = { fontSize: 11, fontWeight: 600, color: COLORS.textMut, marginBottom: 4, display: 'block' };
const inputStyle = { width: '100%', padding: '8px 12px', border: `1.5px solid ${COLORS.border}`, borderRadius: 8, fontSize: 13, fontFamily: FF, color: COLORS.text, background: '#fff', outline: 'none', boxSizing: 'border-box' };

/* ═══════════════════════════════════════════════════
   CONSTANTES
═══════════════════════════════════════════════════ */
const TYPES_COURRIER = {
  entrant: { label: 'Entrant', color: '#2563eb', bg: '#eff6ff', icon: Inbox, prefix: 'CE' },
  sortant: { label: 'Sortant', color: '#059669', bg: '#ecfdf5', icon: Send, prefix: 'CS' },
  interne: { label: 'Interne', color: '#7c3aed', bg: '#f5f3ff', icon: ArrowRightLeft, prefix: 'CI' },
};

const STATUTS_COURRIER = {
  brouillon:      { label: 'Brouillon',      color: '#64748b', bg: '#f1f5f9', icon: Edit3 },
  enregistre:     { label: 'Enregistré',     color: '#2563eb', bg: '#eff6ff', icon: Inbox },
  en_validation:  { label: 'En validation',  color: '#d97706', bg: '#fffbeb', icon: Clock },
  vise:           { label: 'Visé',           color: '#7c3aed', bg: '#f5f3ff', icon: Stamp },
  signe:          { label: 'Signé',          color: '#4f46e5', bg: '#eef2ff', icon: PenTool },
  distribue:      { label: 'Distribué',      color: '#0891b2', bg: '#ecfeff', icon: Send },
  en_traitement:  { label: 'En traitement',  color: '#c2410c', bg: '#fff7ed', icon: RefreshCw },
  traite:         { label: 'Traité',         color: '#059669', bg: '#ecfdf5', icon: CheckCircle2 },
  archive:        { label: 'Archivé',        color: '#475569', bg: '#f8fafc', icon: Archive },
  rejete:         { label: 'Rejeté',         color: '#dc2626', bg: '#fef2f2', icon: XCircle },
};
const getSt = (id) => STATUTS_COURRIER[id] || { label: id, color: '#94a3b8', bg: '#f8fafc', icon: Info };

const PRIOS = {
  normale: { label: 'Normale', color: '#64748b', dot: '#94a3b8' },
  haute:   { label: 'Haute',   color: '#d97706', dot: '#f59e0b' },
  urgente: { label: 'Urgente', color: '#dc2626', dot: '#ef4444' },
};

const NATURES = ['Lettre','Note','Circulaire','Rapport','PV','Facture','Contrat','Décision','Arrêté','Convocation','Demande','Réclamation','Invitation','Notification','Avis'];
const SERVICES = ['Direction Générale','Finances','Ressources Humaines','Juridique','Service Technique','Communication','Informatique','Logistique'];

/* ═══════════════════════════════════════════════════
   DONNÉES DE DÉMO
═══════════════════════════════════════════════════ */
/* Courriers centralisés dans sharedData.js */

/* Users centralisés dans sharedData.js */

/* ═══════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
═══════════════════════════════════════════════════ */
export default function LibCourrier({ documents = [], users = [], contenants = [], emplacements = [] }) {
  const usrs = users.length > 0 ? users : SHARED_USERS;
  const [data, setData] = useState(SHARED_COURRIERS);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('tous');
  const [showNew, setShowNew] = useState(null);
  const [showDetail, setShowDetail] = useState(null);
  const [showScan, setShowScan] = useState(false);
  const [showValidation, setShowValidation] = useState(null);
  const [filterPrio, setFilterPrio] = useState('all');
  const [filterStatut, setFilterStatut] = useState('all');
  const [page, setPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check(); window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const counts = useMemo(() => {
    const c = { tous: data.length, entrant: 0, sortant: 0, interne: 0, en_attente: 0, traite: 0 };
    data.forEach(d => { c[d.type]++; if (['en_validation','enregistre'].includes(d.statut)) c.en_attente++; if (['traite','archive'].includes(d.statut)) c.traite++; });
    return c;
  }, [data]);

  const filtered = useMemo(() => {
    let r = [...data];
    if (['entrant','sortant','interne'].includes(tab)) r = r.filter(d => d.type === tab);
    else if (tab === 'en_attente') r = r.filter(d => ['en_validation','enregistre'].includes(d.statut));
    else if (tab === 'traite') r = r.filter(d => ['traite','archive'].includes(d.statut));
    else if (tab === 'stats') return r;
    if (filterPrio !== 'all') r = r.filter(d => d.priorite === filterPrio);
    if (filterStatut !== 'all') r = r.filter(d => d.statut === filterStatut);
    if (search) { const s = search.toLowerCase(); r = r.filter(d => d.id.toLowerCase().includes(s)||d.objet.toLowerCase().includes(s)||d.expediteur.toLowerCase().includes(s)||(d.destinataire||'').toLowerCase().includes(s)||(d.refExterne||'').toLowerCase().includes(s)); }
    return r.sort((a,b) => (b.dateReception||b.dateDocument||'').localeCompare(a.dateReception||a.dateDocument||''));
  }, [data, tab, search, filterPrio, filterStatut]);

  const perPage = isMobile ? 8 : 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = tab === 'stats' ? filtered : filtered.slice((page-1)*perPage, page*perPage);

  const entrantsAuj = data.filter(d => d.type==='entrant' && d.dateReception==='2025-02-28').length;
  const pending = data.filter(d => ['en_validation','enregistre'].includes(d.statut)).length;
  const urgents = data.filter(d => d.priorite==='urgente' && !['traite','archive','rejete'].includes(d.statut)).length;
  const traitesTotal = data.filter(d => d.statut==='traite').length;

  const nextNum = useCallback((type) => {
    const pref = TYPES_COURRIER[type]?.prefix||'CR';
    const n = data.filter(d => d.type===type).length + 1;
    return `${pref}-2025-${String(n).padStart(4,'0')}`;
  }, [data]);

  const handleValidate = useCallback((courrierId, niveau, decision, comment) => {
    setData(prev => prev.map(c => {
      if (c.id !== courrierId) return c;
      const upd = { ...c, validations:[...(c.validations||[])] };
      const vIdx = upd.validations.findIndex(v => v.niveau===niveau && v.statut==='en_attente');
      if (vIdx>=0) upd.validations[vIdx] = { ...upd.validations[vIdx], statut: decision==='refuse'?'refuse':'approuve', date: new Date().toISOString().replace('T',' ').slice(0,16), commentaire: comment };
      if (decision==='refuse') upd.statut='rejete';
      else { const np = upd.validations.find(v => v.statut==='en_attente'); if (!np) { upd.statut = upd.validations.some(v => v.type==='signature') ? 'signe' : 'vise'; } }
      const actLabel = decision==='refuse' ? `Rejeté N${niveau}` : upd.validations[vIdx]?.type==='signature' ? `Signé N${niveau}` : `Visé N${niveau}`;
      upd.historique = [...(upd.historique||[]), { date:new Date().toISOString().replace('T',' ').slice(0,16), action:actLabel, auteur:'Vous', detail:comment||'' }];
      return upd;
    }));
    setShowValidation(null);
  }, []);

  const handleDistribuer = useCallback((id) => { setData(prev => prev.map(c => c.id!==id?c:{...c, statut:'distribue', historique:[...(c.historique||[]),{date:new Date().toISOString().replace('T',' ').slice(0,16),action:'Distribué',auteur:'Vous',detail:`Distribué à ${c.affecteA||c.destinataire}`}]})); }, []);
  const handleTraiter = useCallback((id) => { setData(prev => prev.map(c => c.id!==id?c:{...c, statut:'traite', historique:[...(c.historique||[]),{date:new Date().toISOString().replace('T',' ').slice(0,16),action:'Traité',auteur:'Vous',detail:'Courrier traité et clôturé'}]})); }, []);
  const handleArchiver = useCallback((id) => { setData(prev => prev.map(c => c.id!==id?c:{...c, statut:'archive', historique:[...(c.historique||[]),{date:new Date().toISOString().replace('T',' ').slice(0,16),action:'Archivé',auteur:'Vous',detail:''}]})); }, []);
  const handleNewCourrier = useCallback((courrier) => { setData(prev => [courrier,...prev]); setShowNew(null); }, []);

  const TABS = [
    { id:'tous', label:'Tous', count:counts.tous, icon:Mail },
    { id:'entrant', label:'Entrant', count:counts.entrant, icon:Inbox },
    { id:'sortant', label:'Sortant', count:counts.sortant, icon:Send },
    { id:'interne', label:'Interne', count:counts.interne, icon:ArrowRightLeft },
    { id:'en_attente', label:'En attente', count:counts.en_attente, icon:Clock },
    { id:'traite', label:'Traités', count:counts.traite, icon:CheckCircle2 },
    { id:'stats', label:'Statistiques', count:null, icon:BarChart3 },
  ];

  return (
    <div style={{ fontFamily:FF }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20, flexWrap:'wrap', gap:12 }}>
        <div><h1 style={{ margin:0, fontSize:isMobile?20:24, fontWeight:700 }}>Courrier & Flux Entrants</h1><p style={{ margin:'4px 0 0', fontSize:13, color:COLORS.textMut }}>Enregistrement, validation, distribution et suivi du courrier</p></div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {!isMobile && <Btn icon={ScanLine} variant="outline" size="sm" onClick={() => setShowScan(true)}>Scan & OCR</Btn>}
          {!isMobile && <Btn icon={Download} variant="outline" size="sm">Exporter</Btn>}
          <NewCourrierDropdown onSelect={t => setShowNew(t)} />
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(4,1fr)', gap:isMobile?8:12, marginBottom:20 }}>
        <KPI icon={Inbox} label="Reçus aujourd'hui" value={entrantsAuj} color="#2563eb" bg="#eff6ff" />
        <KPI icon={Clock} label="En attente" value={pending} color="#d97706" bg="#fffbeb" />
        <KPI icon={AlertCircle} label="Urgents actifs" value={urgents} color="#dc2626" bg="#fef2f2" pulse={urgents>0} />
        <KPI icon={CheckCircle2} label="Traités" value={traitesTotal} color="#059669" bg="#ecfdf5" />
      </div>

      {urgents > 0 && (
        <div style={{ padding:'10px 16px', background:'#fef2f2', border:'1.5px solid #fecaca', borderRadius:10, marginBottom:16, display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
          <AlertTriangle size={16} color="#dc2626" />
          <span style={{ fontSize:13, fontWeight:600, color:'#dc2626' }}>{urgents} courrier{urgents>1?'s':''} urgent{urgents>1?'s':''} en attente</span>
          <button onClick={() => { setFilterPrio('urgente'); setTab('tous'); }} style={{ marginLeft:'auto', fontSize:12, fontWeight:600, color:'#dc2626', background:'#fff', border:'1px solid #fecaca', borderRadius:6, padding:'4px 12px', cursor:'pointer', fontFamily:FF }}>Voir →</button>
        </div>
      )}

      <div style={{ display:'flex', gap:2, marginBottom:16, borderBottom:`2px solid ${COLORS.border}`, overflowX:'auto' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setPage(1); setFilterPrio('all'); setFilterStatut('all'); }} style={{
            padding:isMobile?'8px 10px':'9px 16px', background:'none', border:'none', cursor:'pointer',
            fontSize:isMobile?11:12, fontWeight:tab===t.id?700:500, whiteSpace:'nowrap',
            color:tab===t.id?COLORS.primary:COLORS.textMut,
            borderBottom:tab===t.id?`2px solid ${COLORS.primary}`:'2px solid transparent',
            marginBottom:-2, fontFamily:FF, display:'flex', alignItems:'center', gap:5,
          }}><t.icon size={13} />{!isMobile&&t.label}
            {t.count!==null && <span style={{ fontSize:10, padding:'1px 6px', borderRadius:10, fontWeight:700, background:tab===t.id?COLORS.primaryLighter:'#f1f5f9', color:tab===t.id?COLORS.primary:COLORS.textMut }}>{t.count}</span>}
          </button>
        ))}
      </div>

      {tab==='stats' ? <StatsPanel data={data} isMobile={isMobile} /> : (<>
        <div style={{ display:'flex', gap:8, marginBottom:14, flexWrap:'wrap', alignItems:'center' }}>
          <SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Réf, objet, expéditeur..." maxWidth={isMobile?'100%':260} />
          {!isMobile && (<>
            <select value={filterPrio} onChange={e => { setFilterPrio(e.target.value); setPage(1); }} style={{ ...inputStyle, width:'auto', padding:'6px 10px', fontSize:12 }}>
              <option value="all">Priorité: Toutes</option>
              {Object.entries(PRIOS).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <select value={filterStatut} onChange={e => { setFilterStatut(e.target.value); setPage(1); }} style={{ ...inputStyle, width:'auto', padding:'6px 10px', fontSize:12 }}>
              <option value="all">Statut: Tous</option>
              {Object.entries(STATUTS_COURRIER).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </>)}
          <span style={{ fontSize:12, color:COLORS.textMut, marginLeft:'auto' }}>{filtered.length} résultat{filtered.length!==1?'s':''}</span>
        </div>

        {isMobile ? (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {paged.map(c => <CourrierCard key={c.id} courrier={c} onView={() => setShowDetail(c)} />)}
            {paged.length===0 && <EmptyState />}
          </div>
        ) : (
          <div style={{ background:'#fff', borderRadius:12, border:`1px solid ${COLORS.border}`, overflow:'hidden' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead><tr style={{ background:COLORS.surfaceAlt }}>
                {['N°','Type','Objet','Expéditeur / Dest.','Priorité','Statut','Date','Actions'].map(h => (
                  <th key={h} style={{ padding:'10px 12px', textAlign:'left', fontWeight:600, color:COLORS.textSec, fontSize:10, textTransform:'uppercase', letterSpacing:.5 }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {paged.map(c => <CourrierRow key={c.id} courrier={c} onView={() => setShowDetail(c)} onValidate={() => setShowValidation(c)} onDistribuer={() => handleDistribuer(c.id)} onTraiter={() => handleTraiter(c.id)} />)}
                {paged.length===0 && <tr><td colSpan={8}><EmptyState /></td></tr>}
              </tbody>
            </table>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </>)}

      <Modal isOpen={!!showDetail} onClose={() => setShowDetail(null)} title="Détail du courrier" width={isMobile?'95vw':740}>
        {showDetail && <CourrierDetail courrier={showDetail} data={data} documents={documents} contenants={contenants} isMobile={isMobile} onValidate={c => { setShowDetail(null); setShowValidation(c); }} onDistribuer={handleDistribuer} onTraiter={handleTraiter} onArchiver={handleArchiver} />}
      </Modal>
      <Modal isOpen={!!showValidation} onClose={() => setShowValidation(null)} title="Validation / Visa / Signature" width={isMobile?'95vw':520}>
        {showValidation && <ValidationPanel courrier={showValidation} isMobile={isMobile} onValidate={handleValidate} onCancel={() => setShowValidation(null)} />}
      </Modal>
      <Modal isOpen={!!showNew} onClose={() => setShowNew(null)} title={`Nouveau courrier ${showNew||''}`} width={isMobile?'95vw':680}>
        {showNew && <NewCourrierForm type={showNew} documents={documents} contenants={contenants} users={usrs} isMobile={isMobile} nextNum={nextNum(showNew)} onSave={handleNewCourrier} onCancel={() => setShowNew(null)} />}
      </Modal>
      <Modal isOpen={showScan} onClose={() => setShowScan(false)} title="Scan & OCR — Capture documentaire" width={isMobile?'95vw':560}>
        <ScanOCRPanel data={data} isMobile={isMobile} nextNum={nextNum('entrant')} onRegister={c => { handleNewCourrier(c); setShowScan(false); }} onClose={() => setShowScan(false)} />
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════════════ KPI ═══════════════════════════════════════════════════ */
function KPI({ icon:Icon, label, value, color, bg, pulse }) {
  return (<div style={{ padding:'14px 16px', background:bg, borderRadius:12, border:`1.5px solid ${color}18`, display:'flex', alignItems:'center', gap:12 }}>
    <div style={{ width:38, height:38, borderRadius:10, background:color+'15', display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
      <Icon size={18} color={color} />{pulse && <span style={{ position:'absolute', top:-2, right:-2, width:10, height:10, borderRadius:'50%', background:'#dc2626', border:'2px solid #fff' }} />}
    </div>
    <div><div style={{ fontSize:22, fontWeight:800, color }}>{value}</div><div style={{ fontSize:11, color:COLORS.textMut, fontWeight:500 }}>{label}</div></div>
  </div>);
}
function ActionBtn({ icon:Icon, tip, color=COLORS.textMut, onClick }) {
  return (<button onClick={onClick} title={tip} style={{ width:28, height:28, borderRadius:6, border:`1px solid ${COLORS.borderLight}`, background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}
    onMouseEnter={e => { e.currentTarget.style.background=COLORS.surfaceAlt; e.currentTarget.style.borderColor=color; }}
    onMouseLeave={e => { e.currentTarget.style.background='#fff'; e.currentTarget.style.borderColor=COLORS.borderLight; }}>
    <Icon size={13} color={color} /></button>);
}
function EmptyState() { return (<div style={{ padding:48, textAlign:'center', color:COLORS.textMut }}><Mail size={32} strokeWidth={1.2} style={{ opacity:.3, marginBottom:8 }} /><div style={{ fontSize:13, fontWeight:600 }}>Aucun courrier trouvé</div></div>); }

/* ═══════════════════════════════════════════════════ DROPDOWN NOUVEAU ═══════════════════════════════════════════════════ */
function NewCourrierDropdown({ onSelect }) {
  const [open, setOpen] = useState(false);
  return (<div style={{ position:'relative' }}>
    <Btn icon={Plus} size="sm" onClick={() => setOpen(!open)}>Enregistrer</Btn>
    {open && (<><div onClick={() => setOpen(false)} style={{ position:'fixed', inset:0, zIndex:99 }} />
      <div style={{ position:'absolute', right:0, top:'100%', marginTop:4, background:'#fff', borderRadius:10, border:`1.5px solid ${COLORS.border}`, boxShadow:'0 8px 30px rgba(0,0,0,.12)', zIndex:100, overflow:'hidden', minWidth:200 }}>
        {Object.entries(TYPES_COURRIER).map(([k,v]) => { const TI=v.icon; return (
          <button key={k} onClick={() => { onSelect(k); setOpen(false); }} style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'10px 14px', border:'none', background:'none', cursor:'pointer', fontFamily:FF, fontSize:13, fontWeight:500, color:COLORS.text, textAlign:'left' }}
            onMouseEnter={e => e.currentTarget.style.background=COLORS.surfaceAlt} onMouseLeave={e => e.currentTarget.style.background='transparent'}>
            <div style={{ width:28, height:28, borderRadius:6, background:v.bg, display:'flex', alignItems:'center', justifyContent:'center' }}><TI size={14} color={v.color} /></div>
            Courrier {v.label.toLowerCase()}
          </button>); })}
      </div></>)}
  </div>);
}

/* ═══════════════════════════════════════════════════ TABLE ROW ═══════════════════════════════════════════════════ */
function CourrierRow({ courrier:c, onView, onValidate, onDistribuer, onTraiter }) {
  const st=getSt(c.statut), pr=PRIOS[c.priorite]||PRIOS.normale, tc=TYPES_COURRIER[c.type]||TYPES_COURRIER.entrant; const TI=tc.icon;
  return (<tr style={{ borderBottom:`1px solid ${COLORS.borderLight}` }}
    onMouseEnter={e => e.currentTarget.style.background='#f8fafc'} onMouseLeave={e => e.currentTarget.style.background='transparent'}>
    <td style={{ padding:'10px 12px' }}><div style={{ fontWeight:600, fontSize:11, fontFamily:'monospace', color:COLORS.primaryLight }}>{c.id}</div>{c.confidentiel && <Lock size={10} color="#dc2626" style={{ marginTop:2 }} />}</td>
    <td style={{ padding:'10px 12px' }}><div style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'2px 8px', borderRadius:6, background:tc.bg }}><TI size={11} color={tc.color} /><span style={{ fontSize:11, fontWeight:600, color:tc.color }}>{tc.label}</span></div></td>
    <td style={{ padding:'10px 12px', maxWidth:220 }}>
      <div style={{ fontWeight:600, fontSize:12, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.objet}</div>
      <div style={{ fontSize:10, color:COLORS.textMut, display:'flex', alignItems:'center', gap:4 }}>
        <span>{c.nature}</span>
        {c.ocrDone && <><span style={{ width:3, height:3, borderRadius:'50%', background:COLORS.textMut, display:'inline-block' }} /><span style={{ color:'#059669', fontWeight:600 }}>OCR ✓</span></>}
        {(c.piecesJointes?.length||0)>0 && <><span style={{ width:3, height:3, borderRadius:'50%', background:COLORS.textMut, display:'inline-block' }} /><Paperclip size={9} /><span>{c.piecesJointes.length}</span></>}
      </div>
    </td>
    <td style={{ padding:'10px 12px' }}><div style={{ fontWeight:500, fontSize:12 }}>{c.type==='sortant'?c.destinataire:c.expediteur}</div>{c.refExterne && <div style={{ fontSize:10, color:COLORS.textMut, fontFamily:'monospace' }}>{c.refExterne}</div>}</td>
    <td style={{ padding:'10px 12px' }}><span style={{ display:'inline-flex', alignItems:'center', gap:4 }}><span style={{ width:7, height:7, borderRadius:'50%', background:pr.dot }} /><span style={{ fontSize:12, fontWeight:600, color:pr.color }}>{pr.label}</span></span></td>
    <td style={{ padding:'10px 12px' }}><Badge label={st.label} color={st.color} bg={st.bg} /></td>
    <td style={{ padding:'10px 12px', fontSize:12, color:COLORS.textSec }}>{c.dateReception||c.dateDocument}</td>
    <td style={{ padding:'10px 12px' }}><div style={{ display:'flex', gap:4 }}>
      <ActionBtn icon={Eye} tip="Détail" onClick={onView} />
      {c.statut==='en_validation' && <ActionBtn icon={Stamp} tip="Valider" color="#7c3aed" onClick={onValidate} />}
      {['vise','signe'].includes(c.statut) && <ActionBtn icon={Send} tip="Distribuer" color="#0891b2" onClick={onDistribuer} />}
      {['distribue','en_traitement'].includes(c.statut) && <ActionBtn icon={CheckCircle2} tip="Traiter" color="#059669" onClick={onTraiter} />}
    </div></td>
  </tr>);
}

/* ═══════════════════════════════════════════════════ MOBILE CARD ═══════════════════════════════════════════════════ */
function CourrierCard({ courrier:c, onView }) {
  const st=getSt(c.statut), tc=TYPES_COURRIER[c.type]||TYPES_COURRIER.entrant; const TI=tc.icon;
  return (<div onClick={onView} style={{ padding:14, background:'#fff', borderRadius:12, border:`1.5px solid ${COLORS.border}`, cursor:'pointer', borderLeft:`4px solid ${tc.color}` }}>
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
      <div style={{ display:'flex', gap:6, alignItems:'center' }}><span style={{ fontSize:11, fontFamily:'monospace', fontWeight:600, color:COLORS.primaryLight }}>{c.id}</span>{c.confidentiel && <Lock size={10} color="#dc2626" />}{c.priorite==='urgente' && <Badge label="URGENT" color="#dc2626" bg="#fef2f2" />}</div>
      <Badge label={st.label} color={st.color} bg={st.bg} />
    </div>
    <div style={{ fontSize:14, fontWeight:700, marginBottom:4 }}>{c.objet}</div>
    <div style={{ display:'flex', gap:6, alignItems:'center', fontSize:12, color:COLORS.textMut, flexWrap:'wrap' }}>
      <div style={{ display:'inline-flex', alignItems:'center', gap:3 }}><TI size={11} color={tc.color} /><span style={{ fontWeight:600, color:tc.color }}>{tc.label}</span></div>
      <span>•</span><span>{c.type==='sortant'?c.destinataire:c.expediteur}</span><span>•</span><span>{c.dateReception||c.dateDocument}</span>
      {c.ocrDone && <><span>•</span><span style={{ color:'#059669', fontWeight:600 }}>OCR ✓</span></>}
    </div>
  </div>);
}

/* ═══════════════════════════════════════════════════ DÉTAIL ═══════════════════════════════════════════════════ */
function CourrierDetail({ courrier:c, data, documents, contenants, isMobile, onValidate, onDistribuer, onTraiter, onArchiver }) {
  const [tab, setTab] = useState('info');
  const st=getSt(c.statut), pr=PRIOS[c.priorite]||PRIOS.normale, tc=TYPES_COURRIER[c.type]||TYPES_COURRIER.entrant; const TI=tc.icon;
  const linkedDoc = c.docId ? documents.find(d => d.id===c.docId) : null;
  const linkedCont = c.contenantId ? contenants.find(ct => ct.id===c.contenantId) : null;

  const wfSteps = useMemo(() => {
    const steps = [{ label: c.type==='entrant'?'Réception':'Création', done:true, date:c.dateReception||c.dateDocument }];
    if (c.ocrDone) steps.push({ label:'OCR', done:true, special:true });
    (c.validations||[]).forEach(v => { steps.push({ label:`${v.type==='signature'?'Sign.':'Visa'} N${v.niveau}`, done:v.statut!=='en_attente', refused:v.statut==='refuse', date:v.date }); });
    if (c.statut!=='rejete') { steps.push({ label:'Distribution', done:['distribue','en_traitement','traite','archive'].includes(c.statut) }); steps.push({ label:'Traitement', done:['traite','archive'].includes(c.statut) }); }
    return steps;
  }, [c]);

  const DTABS = [
    { id:'info', label:'Informations', icon:Info },
    { id:'ocr', label:'OCR', icon:ScanLine, hidden:!c.ocrDone },
    { id:'validations', label:`Visa/Signature (${(c.validations||[]).length})`, icon:Stamp },
    { id:'pieces', label:`Pièces (${(c.piecesJointes||[]).length})`, icon:Paperclip },
    { id:'audit', label:`Audit (${(c.historique||[]).length})`, icon:History },
  ].filter(t => !t.hidden);

  return (<div>
    {/* Header */}
    <div style={{ display:'flex', gap:12, alignItems:'flex-start', marginBottom:14 }}>
      <div style={{ width:44, height:44, borderRadius:10, background:tc.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><TI size={20} color={tc.color} /></div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:16, fontWeight:700 }}>{c.objet}</div>
        <div style={{ fontSize:11, color:COLORS.textMut, display:'flex', gap:6, alignItems:'center', flexWrap:'wrap', marginTop:2 }}>
          <span style={{ fontFamily:'monospace', fontWeight:600 }}>{c.id}</span>
          <Badge label={tc.label} color={tc.color} bg={tc.bg} /><Badge label={st.label} color={st.color} bg={st.bg} />
          <span style={{ display:'inline-flex', alignItems:'center', gap:3 }}><span style={{ width:6, height:6, borderRadius:'50%', background:pr.dot }} /><span style={{ fontSize:11, fontWeight:600, color:pr.color }}>{pr.label}</span></span>
          {c.confidentiel && <Badge label="🔒 Confidentiel" color="#dc2626" bg="#fef2f2" />}
        </div>
      </div>
    </div>

    {/* Workflow stepper */}
    <div style={{ padding:'12px 14px', background:COLORS.surfaceAlt, borderRadius:10, marginBottom:14, overflowX:'auto' }}>
      <div style={{ fontSize:10, fontWeight:600, color:COLORS.textMut, marginBottom:8, textTransform:'uppercase', letterSpacing:.5 }}>Circuit de traitement</div>
      <div style={{ display:'flex', alignItems:'center', gap:0, minWidth:'fit-content' }}>
        {wfSteps.map((s,i) => (<React.Fragment key={i}>
          {i>0 && <div style={{ width:24, height:2, background:s.done?(s.refused?'#fecaca':'#86efac'):COLORS.border, flexShrink:0 }} />}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, flexShrink:0 }}>
            <div style={{ width:26, height:26, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
              background:s.special?'#f5f3ff':s.refused?'#fef2f2':s.done?'#ecfdf5':'#f8fafc',
              border:`2px solid ${s.special?'#7c3aed':s.refused?'#dc2626':s.done?'#059669':COLORS.border}` }}>
              {s.special ? <ScanLine size={11} color="#7c3aed" /> : s.refused ? <X size={12} color="#dc2626" /> : s.done ? <Check size={12} color="#059669" /> : <Clock size={12} color={COLORS.textMut} />}
            </div>
            <span style={{ fontSize:9, fontWeight:600, color:s.done?COLORS.text:COLORS.textMut, whiteSpace:'nowrap' }}>{s.label}</span>
          </div>
        </React.Fragment>))}
      </div>
    </div>

    {/* Tabs */}
    <div style={{ display:'flex', gap:2, marginBottom:14, borderBottom:`1.5px solid ${COLORS.border}`, overflowX:'auto' }}>
      {DTABS.map(t => (<button key={t.id} onClick={() => setTab(t.id)} style={{
        padding:'7px 14px', border:'none', background:'none', cursor:'pointer',
        fontSize:12, fontWeight:tab===t.id?700:500, fontFamily:FF, whiteSpace:'nowrap',
        color:tab===t.id?COLORS.primary:COLORS.textMut,
        borderBottom:tab===t.id?`2px solid ${COLORS.primary}`:'2px solid transparent', marginBottom:-1.5,
        display:'flex', alignItems:'center', gap:4,
      }}><t.icon size={13} />{t.label}</button>))}
    </div>

    {/* TAB: Info */}
    {tab==='info' && (<div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap:10, marginBottom:14 }}>
      <InfoBlk label="Nature" value={c.nature} />
      <InfoBlk label={c.type==='sortant'?'Destinataire':'Expéditeur'} value={c.type==='sortant'?c.destinataire:c.expediteur} />
      {c.refExterne && <InfoBlk label="Référence externe" value={c.refExterne} mono />}
      <InfoBlk label="Date document" value={c.dateDocument} />
      {c.dateReception && <InfoBlk label="Date réception" value={c.dateReception} />}
      {c.dateEnvoi && <InfoBlk label="Date envoi" value={c.dateEnvoi} />}
      <InfoBlk label="Service" value={c.service} />
      {c.affecteA && <InfoBlk label="Affecté à" value={c.affecteA} />}
      {linkedDoc && (<div style={{ gridColumn:'1/-1', padding:'10px 14px', background:'#eff6ff', borderRadius:10, border:'1px solid #bfdbfe', display:'flex', alignItems:'center', gap:10 }}>
        <FileText size={16} color="#2563eb" /><div style={{ flex:1 }}><div style={{ fontSize:10, fontWeight:600, color:'#2563eb', textTransform:'uppercase' }}>Document rattaché</div><div style={{ fontSize:13, fontWeight:600 }}>{linkedDoc.titre||linkedDoc.id}</div><div style={{ fontSize:10, color:COLORS.textMut, fontFamily:'monospace' }}>{linkedDoc.id}</div></div><Link2 size={14} color="#2563eb" />
      </div>)}
      {linkedCont && (<div style={{ gridColumn:'1/-1', padding:'10px 14px', background:'#fffbeb', borderRadius:10, border:'1px solid #fde68a', display:'flex', alignItems:'center', gap:10 }}>
        <Package size={16} color="#d97706" /><div style={{ flex:1 }}><div style={{ fontSize:10, fontWeight:600, color:'#d97706', textTransform:'uppercase' }}>Contenant physique</div><div style={{ fontSize:13, fontWeight:600 }}>{linkedCont.label}</div><div style={{ fontSize:10, color:COLORS.textMut, fontFamily:'monospace' }}>{linkedCont.id}</div></div><FolderOpen size={14} color="#d97706" />
      </div>)}
    </div>)}

    {/* TAB: OCR */}
    {tab==='ocr' && c.ocrData && (<div style={{ marginBottom:14 }}>
      <div style={{ padding:14, background:'#f5f3ff', borderRadius:10, border:'1px solid #ddd6fe', marginBottom:14 }}>
        <div style={{ fontSize:12, fontWeight:700, color:'#7c3aed', display:'flex', alignItems:'center', gap:6, marginBottom:10 }}><ScanLine size={14} />Résultat OCR — Reconnaissance automatique</div>
        <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap:10 }}>
          {c.ocrData.expediteur && <OcrField label="Expéditeur" value={c.ocrData.expediteur} icon={User} confidence={95} />}
          {c.ocrData.date && <OcrField label="Date" value={c.ocrData.date} icon={Calendar} confidence={98} />}
          {c.ocrData.ref && <OcrField label="Référence" value={c.ocrData.ref} icon={Hash} confidence={92} />}
          {c.ocrData.objet && <OcrField label="Objet" value={c.ocrData.objet} icon={Type} confidence={87} />}
          {c.ocrData.montant && <OcrField label="Montant" value={c.ocrData.montant} icon={Tag} confidence={90} />}
        </div>
      </div>
      <div style={{ padding:'10px 14px', background:COLORS.surfaceAlt, borderRadius:8, border:`1px solid ${COLORS.border}` }}>
        <div style={{ fontSize:11, fontWeight:600, color:COLORS.textMut, display:'flex', alignItems:'center', gap:4 }}><Zap size={11} />OCR appliqué automatiquement au scan</div>
        <div style={{ fontSize:11, color:COLORS.textSec, marginTop:4 }}>Les champs reconnus ont été pré-remplis. Vérifiez et corrigez si nécessaire.</div>
      </div>
    </div>)}

    {/* TAB: Validations */}
    {tab==='validations' && (<div style={{ marginBottom:14 }}>
      {(c.validations||[]).length===0 ? (<div style={{ padding:32, textAlign:'center', color:COLORS.textMut }}><Shield size={24} strokeWidth={1.2} style={{ opacity:.3, marginBottom:6 }} /><div style={{ fontSize:13 }}>Aucune validation requise</div></div>)
      : (c.validations||[]).map((v,i) => (
        <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', borderBottom:`1px solid ${COLORS.borderLight}` }}>
          <div style={{ width:36, height:36, borderRadius:'50%', background:v.statut==='approuve'?'#ecfdf5':v.statut==='refuse'?'#fef2f2':'#fffbeb', border:`2px solid ${v.statut==='approuve'?'#059669':v.statut==='refuse'?'#dc2626':'#d97706'}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
            {v.statut==='approuve' ? (v.type==='signature'?<PenTool size={15} color="#059669" />:<Stamp size={15} color="#059669" />) : v.statut==='refuse' ? <X size={15} color="#dc2626" /> : <Clock size={15} color="#d97706" />}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:600 }}>{v.type==='signature'?'✍️ Signature':'📋 Visa'} N{v.niveau} — {v.valideur}</div>
            <div style={{ fontSize:11, color:COLORS.textMut }}>{v.statut==='approuve'?(v.type==='signature'?'✓ Signé':'✓ Visé'):v.statut==='refuse'?'✗ Rejeté':'⏳ En attente'}{v.date&&` — ${v.date}`}</div>
            {v.commentaire && <div style={{ fontSize:11, color:COLORS.textSec, fontStyle:'italic', marginTop:2 }}>"{v.commentaire}"</div>}
          </div>
        </div>))}
    </div>)}

    {/* TAB: Pièces jointes */}
    {tab==='pieces' && (<div style={{ marginBottom:14 }}>
      {(c.piecesJointes||[]).length===0 ? (<div style={{ padding:32, textAlign:'center', color:COLORS.textMut }}><Paperclip size={24} strokeWidth={1.2} style={{ opacity:.3, marginBottom:6 }} /><div style={{ fontSize:13 }}>Aucune pièce jointe</div></div>)
      : (c.piecesJointes||[]).map((pj,i) => { const ext=pj.split('.').pop().toLowerCase(); const isPdf=ext==='pdf'; const isImg=['jpg','jpeg','png','gif'].includes(ext);
        return (<div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderBottom:`1px solid ${COLORS.borderLight}` }}>
          <div style={{ width:36, height:36, borderRadius:8, background:isPdf?'#fef2f2':isImg?'#eff6ff':'#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center' }}>
            {isPdf ? <FileText size={16} color="#dc2626" /> : isImg ? <Image size={16} color="#2563eb" /> : <Paperclip size={16} color={COLORS.textMut} />}
          </div>
          <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:600 }}>{pj}</div><div style={{ fontSize:10, color:COLORS.textMut }}>{ext.toUpperCase()}</div></div>
          <ActionBtn icon={Download} tip="Télécharger" color={COLORS.primaryLight} />
        </div>); })}
    </div>)}

    {/* TAB: Audit */}
    {tab==='audit' && (<div style={{ marginBottom:14, maxHeight:340, overflowY:'auto' }}>
      <div style={{ fontSize:10, fontWeight:600, color:COLORS.textMut, marginBottom:8, textTransform:'uppercase', letterSpacing:.5, display:'flex', alignItems:'center', gap:4 }}><History size={11} />Journal d'audit complet</div>
      {(c.historique||[]).map((h,i) => { const isSys=h.auteur==='Système'; const isOcr=h.action.includes('OCR');
        return (<div key={i} style={{ display:'flex', gap:10, padding:'9px 0', borderBottom:i<c.historique.length-1?`1px solid ${COLORS.borderLight}`:'none' }}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:isOcr?'#7c3aed':isSys?'#d97706':COLORS.primaryLight, flexShrink:0 }} />
            {i<c.historique.length-1 && <div style={{ width:1, flex:1, background:COLORS.borderLight }} />}
          </div>
          <div style={{ flex:1, paddingBottom:4 }}>
            <div style={{ fontSize:12, fontWeight:600, color:isOcr?'#7c3aed':COLORS.text }}>{h.action}</div>
            <div style={{ fontSize:10, color:COLORS.textMut, display:'flex', gap:8, marginTop:2 }}><span>{h.date}</span><span style={{ fontWeight:600, color:isSys?'#d97706':COLORS.textSec }}>{h.auteur}</span></div>
            {h.detail && <div style={{ fontSize:11, color:COLORS.textSec, marginTop:2, padding:'4px 8px', background:COLORS.surfaceAlt, borderRadius:4 }}>{h.detail}</div>}
          </div>
        </div>); })}
    </div>)}

    {/* Actions */}
    <div style={{ display:'flex', gap:8, justifyContent:'flex-end', borderTop:`1px solid ${COLORS.border}`, paddingTop:12, flexWrap:'wrap' }}>
      {c.statut==='en_validation' && <Btn icon={Stamp} size="sm" onClick={() => onValidate(c)}>Viser / Signer</Btn>}
      {['vise','signe'].includes(c.statut) && <Btn icon={Send} size="sm" onClick={() => onDistribuer(c.id)}>Distribuer</Btn>}
      {['distribue','en_traitement'].includes(c.statut) && <Btn icon={CheckCircle2} size="sm" onClick={() => onTraiter(c.id)}>Marquer traité</Btn>}
      {c.statut==='traite' && <Btn icon={Archive} variant="outline" size="sm" onClick={() => onArchiver(c.id)}>Archiver</Btn>}
      <Btn icon={Printer} variant="outline" size="sm">Imprimer</Btn>
    </div>
  </div>);
}

/* ═══════════════════════════════════════════════════ OCR FIELD ═══════════════════════════════════════════════════ */
function OcrField({ label, value, icon:Icon, confidence }) {
  const color = confidence>=90?'#059669':confidence>=70?'#d97706':'#dc2626';
  return (<div style={{ padding:'10px 12px', background:'#fff', borderRadius:8, border:`1px solid ${COLORS.border}` }}>
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
      <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:10, fontWeight:600, color:COLORS.textMut }}><Icon size={10} />{label}</div>
      <span style={{ fontSize:9, fontWeight:700, color, padding:'1px 6px', borderRadius:4, background:color+'15' }}>{confidence}%</span>
    </div>
    <div style={{ fontSize:13, fontWeight:600, color:COLORS.text }}>{value}</div>
  </div>);
}

/* ═══════════════════════════════════════════════════ VALIDATION PANEL ═══════════════════════════════════════════════════ */
function ValidationPanel({ courrier, isMobile, onValidate, onCancel }) {
  const [comment, setComment] = useState('');
  const pending = (courrier.validations||[]).find(v => v.statut==='en_attente');
  if (!pending) return <div style={{ padding:20, textAlign:'center', color:COLORS.textMut }}>Aucune validation en attente</div>;
  const pr=PRIOS[courrier.priorite]||PRIOS.normale; const isSig=pending.type==='signature';
  return (<div>
    <div style={{ padding:14, background:COLORS.surfaceAlt, borderRadius:10, marginBottom:16 }}>
      <div style={{ fontSize:14, fontWeight:700 }}>{courrier.objet}</div>
      <div style={{ fontSize:12, color:COLORS.textMut, marginTop:4 }}>{courrier.type==='sortant'?`Vers : ${courrier.destinataire}`:`De : ${courrier.expediteur}`} — Priorité <span style={{ color:pr.color, fontWeight:600 }}>{pr.label}</span></div>
      <div style={{ fontSize:11, color:COLORS.textMut, fontFamily:'monospace', marginTop:4 }}>{courrier.id}</div>
    </div>
    <div style={{ padding:14, background:isSig?'#eef2ff':'#f5f3ff', borderRadius:10, marginBottom:16, border:`1px solid ${isSig?'#c7d2fe':'#ddd6fe'}` }}>
      <div style={{ fontSize:12, fontWeight:700, color:isSig?'#4f46e5':'#7c3aed', display:'flex', alignItems:'center', gap:6 }}>{isSig?<PenTool size={14} />:<Stamp size={14} />}{isSig?'Signature':'Visa'} Niveau {pending.niveau}</div>
      <div style={{ fontSize:12, color:COLORS.textSec, marginTop:4 }}>Valideur : {pending.valideur}</div>
    </div>
    <div style={{ marginBottom:16 }}><label style={labelStyle}>Commentaire (optionnel)</label><textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} placeholder="Ajouter un commentaire..." style={{ ...inputStyle, resize:'vertical' }} /></div>
    <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
      <Btn variant="outline" size="sm" onClick={onCancel}>Annuler</Btn>
      <Btn variant="danger" icon={XCircle} size="sm" onClick={() => onValidate(courrier.id,pending.niveau,'refuse',comment)}>Rejeter</Btn>
      <Btn variant="success" icon={isSig?PenTool:Stamp} size="sm" onClick={() => onValidate(courrier.id,pending.niveau,'approuve',comment)}>{isSig?'Signer':'Viser'}</Btn>
    </div>
  </div>);
}

/* ═══════════════════════════════════════════════════ NEW COURRIER FORM ═══════════════════════════════════════════════════ */
function NewCourrierForm({ type, documents, contenants, users, isMobile, nextNum, onSave, onCancel }) {
  const tc=TYPES_COURRIER[type]||TYPES_COURRIER.entrant; const isE=type==='entrant';
  const [form, setForm] = useState({ objet:'', nature:'Lettre', expediteur:'', destinataire:'', refExterne:'', priorite:'normale', service:'Direction Générale', affecteA:'', dateDocument:new Date().toISOString().slice(0,10), confidentiel:false, contenantId:'', docId:'', niveauxValidation:1, valideurN1:'', typeV1:'visa', valideurN2:'', typeV2:'signature' });
  const [errors, setErrors] = useState({});
  const up = (k,v) => { setForm(p => ({...p,[k]:v})); setErrors(p => ({...p,[k]:undefined})); };
  const validate = () => { const e={}; if(!form.objet.trim()) e.objet='Objet requis'; if(isE&&!form.expediteur.trim()) e.expediteur='Expéditeur requis'; if(!isE&&!form.destinataire.trim()) e.destinataire='Destinataire requis'; if(!form.dateDocument) e.dateDocument='Date requise'; setErrors(e); return !Object.keys(e).length; };
  const handleSubmit = () => {
    if(!validate()) return;
    const vals=[]; if(form.valideurN1){ const u=users.find(u=>u.id===form.valideurN1); vals.push({niveau:1,type:form.typeV1,valideur:u?.nom||form.valideurN1,statut:'en_attente',date:null}); }
    if(form.niveauxValidation>=2&&form.valideurN2){ const u=users.find(u=>u.id===form.valideurN2); vals.push({niveau:2,type:form.typeV2,valideur:u?.nom||form.valideurN2,statut:'en_attente',date:null}); }
    onSave({ id:nextNum, type, objet:form.objet, nature:form.nature, expediteur:isE?form.expediteur:form.service, destinataire:isE?form.service:form.destinataire, refExterne:form.refExterne||null, priorite:form.priorite, statut:vals.length?'en_validation':'enregistre', dateReception:isE?new Date().toISOString().slice(0,10):null, dateDocument:form.dateDocument, dateEnvoi:null, service:form.service, affecteA:form.affecteA?(users.find(u=>u.id===form.affecteA)?.nom||form.affecteA):null, contenantId:form.contenantId||null, docId:form.docId||null, confidentiel:form.confidentiel, piecesJointes:[], ocrDone:false, ocrData:null, validations:vals, historique:[{date:new Date().toISOString().replace('T',' ').slice(0,16),action:isE?'Réception enregistrée':'Brouillon créé',auteur:'Vous',detail:`Numérotation auto : ${nextNum}`}] });
  };
  return (<div>
    <div style={{ padding:'10px 14px', background:tc.bg, borderRadius:10, border:`1.5px solid ${tc.color}30`, marginBottom:16, display:'flex', alignItems:'center', gap:10 }}>
      <Hash size={16} color={tc.color} /><div><div style={{ fontSize:10, fontWeight:600, color:tc.color, textTransform:'uppercase' }}>Numéro automatique</div><div style={{ fontSize:16, fontWeight:800, fontFamily:'monospace', color:tc.color }}>{nextNum}</div></div>
    </div>
    <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap:12, marginBottom:16 }}>
      <div style={{ gridColumn:'1/-1' }}><label style={labelStyle}>Objet *</label><input value={form.objet} onChange={e=>up('objet',e.target.value)} placeholder="Objet du courrier..." style={{...inputStyle,borderColor:errors.objet?'#dc2626':COLORS.border}} />{errors.objet&&<span style={{fontSize:11,color:'#dc2626'}}>{errors.objet}</span>}</div>
      <div><label style={labelStyle}>Nature</label><select value={form.nature} onChange={e=>up('nature',e.target.value)} style={inputStyle}>{NATURES.map(n=><option key={n} value={n}>{n}</option>)}</select></div>
      <div><label style={labelStyle}>Priorité</label><select value={form.priorite} onChange={e=>up('priorite',e.target.value)} style={inputStyle}>{Object.entries(PRIOS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select></div>
      {isE ? (<div><label style={labelStyle}>Expéditeur *</label><input value={form.expediteur} onChange={e=>up('expediteur',e.target.value)} placeholder="Nom de l'expéditeur" style={{...inputStyle,borderColor:errors.expediteur?'#dc2626':COLORS.border}} />{errors.expediteur&&<span style={{fontSize:11,color:'#dc2626'}}>{errors.expediteur}</span>}</div>)
        : (<div><label style={labelStyle}>Destinataire *</label><input value={form.destinataire} onChange={e=>up('destinataire',e.target.value)} placeholder="Destinataire" style={{...inputStyle,borderColor:errors.destinataire?'#dc2626':COLORS.border}} />{errors.destinataire&&<span style={{fontSize:11,color:'#dc2626'}}>{errors.destinataire}</span>}</div>)}
      <div><label style={labelStyle}>Référence externe</label><input value={form.refExterne} onChange={e=>up('refExterne',e.target.value)} placeholder="Réf. du correspondant" style={inputStyle} /></div>
      <div><label style={labelStyle}>Date document *</label><input type="date" value={form.dateDocument} onChange={e=>up('dateDocument',e.target.value)} style={{...inputStyle,borderColor:errors.dateDocument?'#dc2626':COLORS.border}} /></div>
      <div><label style={labelStyle}>Service affecté</label><select value={form.service} onChange={e=>up('service',e.target.value)} style={inputStyle}>{SERVICES.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
      <div><label style={labelStyle}>Affecté à</label><select value={form.affecteA} onChange={e=>up('affecteA',e.target.value)} style={inputStyle}><option value="">— Agent responsable —</option>{users.map(u=><option key={u.id} value={u.id}>{u.nom} ({u.role})</option>)}</select></div>
      <div><label style={labelStyle}>Confidentiel</label><label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:13}}><input type="checkbox" checked={form.confidentiel} onChange={e=>up('confidentiel',e.target.checked)} />Accès restreint</label></div>
    </div>
    {/* Rattachement */}
    <div style={{ padding:14, background:COLORS.surfaceAlt, borderRadius:10, border:`1px solid ${COLORS.border}`, marginBottom:16 }}>
      <div style={{ fontSize:11, fontWeight:700, color:COLORS.textSec, marginBottom:10, display:'flex', alignItems:'center', gap:5 }}><Link2 size={12} />Rattachement (optionnel)</div>
      <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap:10 }}>
        <div><label style={labelStyle}>Document existant</label><select value={form.docId} onChange={e=>up('docId',e.target.value)} style={inputStyle}><option value="">— Aucun —</option>{documents.map(d=><option key={d.id} value={d.id}>{d.titre||d.id} ({d.id})</option>)}</select></div>
        <div><label style={labelStyle}>Contenant physique</label><select value={form.contenantId} onChange={e=>up('contenantId',e.target.value)} style={inputStyle}><option value="">— Aucun —</option>{contenants.filter(c=>c.statut==='ouvert').map(c=><option key={c.id} value={c.id}>📦 {c.label} ({c.id})</option>)}</select></div>
      </div>
    </div>
    {/* Circuit validation */}
    <div style={{ padding:14, background:'#f5f3ff', borderRadius:10, border:'1px solid #ddd6fe', marginBottom:16 }}>
      <div style={{ fontSize:11, fontWeight:700, color:'#7c3aed', marginBottom:10, display:'flex', alignItems:'center', gap:5 }}><Shield size={12} />Circuit de validation</div>
      <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap:10 }}>
        <div><label style={labelStyle}>Niveaux</label><select value={form.niveauxValidation} onChange={e=>up('niveauxValidation',parseInt(e.target.value))} style={inputStyle}><option value={0}>Aucun</option><option value={1}>1 niveau</option><option value={2}>2 niveaux</option></select></div>
        {form.niveauxValidation>=1&&(<><div><label style={labelStyle}>Type N1</label><select value={form.typeV1} onChange={e=>up('typeV1',e.target.value)} style={inputStyle}><option value="visa">Visa</option><option value="signature">Signature</option></select></div>
        <div><label style={labelStyle}>Valideur N1</label><select value={form.valideurN1} onChange={e=>up('valideurN1',e.target.value)} style={inputStyle}><option value="">— Choisir —</option>{users.map(u=><option key={u.id} value={u.id}>{u.nom} ({u.role})</option>)}</select></div></>)}
        {form.niveauxValidation>=2&&(<><div><label style={labelStyle}>Type N2</label><select value={form.typeV2} onChange={e=>up('typeV2',e.target.value)} style={inputStyle}><option value="visa">Visa</option><option value="signature">Signature</option></select></div>
        <div><label style={labelStyle}>Valideur N2</label><select value={form.valideurN2} onChange={e=>up('valideurN2',e.target.value)} style={inputStyle}><option value="">— Choisir —</option>{users.filter(u=>u.id!==form.valideurN1).map(u=><option key={u.id} value={u.id}>{u.nom} ({u.role})</option>)}</select></div></>)}
      </div>
    </div>
    <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}><Btn variant="outline" size="sm" onClick={onCancel}>Annuler</Btn><Btn icon={Save} size="sm" onClick={handleSubmit}>Enregistrer</Btn></div>
  </div>);
}

/* ═══════════════════════════════════════════════════ SCAN & OCR PANEL ═══════════════════════════════════════════════════ */
function ScanOCRPanel({ data, isMobile, nextNum, onRegister, onClose }) {
  const [step, setStep] = useState('scan');
  const [scanning, setScanning] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [form, setForm] = useState({ objet:'', expediteur:'', refExterne:'', dateDocument:'', nature:'Lettre', priorite:'normale', service:'Direction Générale' });

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      const mock = { expediteur:'Banque Centrale de Madagascar', date:'2025-02-27', ref:'BCM/DG/2025-156', objet:'Notification réglementaire — nouvelles dispositions KYC', confidence:{expediteur:94,date:97,ref:91,objet:85} };
      setOcrResult(mock);
      setForm({ objet:mock.objet, expediteur:mock.expediteur, refExterne:mock.ref, dateDocument:mock.date, nature:'Notification', priorite:'haute', service:'Direction Générale' });
      setStep('ocr');
    }, 2000);
  };

  const handleConfirm = () => {
    onRegister({ id:nextNum, type:'entrant', objet:form.objet, nature:form.nature, expediteur:form.expediteur, destinataire:form.service, refExterne:form.refExterne, priorite:form.priorite, statut:'enregistre', dateReception:new Date().toISOString().slice(0,10), dateDocument:form.dateDocument, dateEnvoi:null, service:form.service, affecteA:null, contenantId:null, docId:null, confidentiel:false, piecesJointes:['scan_courrier.pdf'], ocrDone:true, ocrData:{expediteur:form.expediteur,date:form.dateDocument,ref:form.refExterne,objet:form.objet}, validations:[], historique:[{date:new Date().toISOString().replace('T',' ').slice(0,16),action:'Scan & réception',auteur:'Vous',detail:'Courrier scanné'},{date:new Date().toISOString().replace('T',' ').slice(0,16),action:'OCR terminé',auteur:'Système',detail:'Champs reconnus automatiquement'}] });
  };

  return (<div>
    {step==='scan' && (<div style={{ textAlign:'center', padding:20 }}>
      <div style={{ width:100, height:100, borderRadius:20, background:scanning?'#f5f3ff':COLORS.surfaceAlt, border:`3px dashed ${scanning?'#7c3aed':COLORS.border}`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', transition:'all .3s' }}>
        {scanning ? <div style={{ animation:'pulse 1.2s infinite' }}><ScanLine size={40} color="#7c3aed" /></div> : <Upload size={40} color={COLORS.textMut} />}
      </div>
      {scanning ? (<div><div style={{ fontSize:16, fontWeight:700, color:'#7c3aed', marginBottom:6 }}>Scan en cours...</div><div style={{ fontSize:12, color:COLORS.textMut }}>Numérisation et analyse OCR du document</div><div style={{ marginTop:16, height:4, background:'#f1f5f9', borderRadius:2, overflow:'hidden' }}><div style={{ width:'60%', height:'100%', background:'linear-gradient(90deg,#7c3aed,#4f46e5)', borderRadius:2, animation:'pulse 1s infinite' }} /></div></div>)
      : (<div><div style={{ fontSize:16, fontWeight:700, marginBottom:6 }}>Scanner un courrier</div><div style={{ fontSize:12, color:COLORS.textMut, marginBottom:20 }}>Placez le document sur le scanner ou sélectionnez un fichier</div>
        <div style={{ display:'flex', gap:10, justifyContent:'center' }}><Btn icon={ScanLine} size="sm" onClick={handleScan}>Lancer le scan</Btn><Btn icon={Upload} variant="outline" size="sm" onClick={handleScan}>Importer fichier</Btn></div></div>)}
    </div>)}

    {step==='ocr' && ocrResult && (<div>
      <div style={{ padding:14, background:'#ecfdf5', borderRadius:10, border:'1px solid #86efac', marginBottom:16, display:'flex', alignItems:'center', gap:10 }}>
        <CheckCircle2 size={20} color="#059669" /><div><div style={{ fontSize:13, fontWeight:700, color:'#059669' }}>OCR terminé — Champs reconnus</div><div style={{ fontSize:11, color:'#065f46' }}>Vérifiez et corrigez les champs pré-remplis</div></div>
      </div>
      <div style={{ padding:'10px 14px', background:'#f5f3ff', borderRadius:10, border:'1px solid #ddd6fe', marginBottom:14 }}>
        <div style={{ fontSize:10, fontWeight:600, color:'#7c3aed', marginBottom:8, textTransform:'uppercase', display:'flex', alignItems:'center', gap:4 }}><Zap size={10} />Données extraites par OCR</div>
        <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap:8 }}>
          {ocrResult.expediteur && <OcrField label="Expéditeur" value={ocrResult.expediteur} icon={User} confidence={ocrResult.confidence.expediteur} />}
          {ocrResult.date && <OcrField label="Date" value={ocrResult.date} icon={Calendar} confidence={ocrResult.confidence.date} />}
          {ocrResult.ref && <OcrField label="Référence" value={ocrResult.ref} icon={Hash} confidence={ocrResult.confidence.ref} />}
          {ocrResult.objet && <OcrField label="Objet" value={ocrResult.objet} icon={Type} confidence={ocrResult.confidence.objet} />}
        </div>
      </div>
      <div style={{ fontSize:11, fontWeight:600, color:COLORS.textSec, marginBottom:10, display:'flex', alignItems:'center', gap:4 }}><Edit3 size={11} />Confirmer / corriger</div>
      <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap:10, marginBottom:16 }}>
        <div style={{ gridColumn:'1/-1' }}><label style={labelStyle}>Objet</label><input value={form.objet} onChange={e=>setForm(p=>({...p,objet:e.target.value}))} style={inputStyle} /></div>
        <div><label style={labelStyle}>Expéditeur</label><input value={form.expediteur} onChange={e=>setForm(p=>({...p,expediteur:e.target.value}))} style={inputStyle} /></div>
        <div><label style={labelStyle}>Référence</label><input value={form.refExterne} onChange={e=>setForm(p=>({...p,refExterne:e.target.value}))} style={inputStyle} /></div>
        <div><label style={labelStyle}>Date document</label><input type="date" value={form.dateDocument} onChange={e=>setForm(p=>({...p,dateDocument:e.target.value}))} style={inputStyle} /></div>
        <div><label style={labelStyle}>Nature</label><select value={form.nature} onChange={e=>setForm(p=>({...p,nature:e.target.value}))} style={inputStyle}>{NATURES.map(n=><option key={n} value={n}>{n}</option>)}</select></div>
        <div><label style={labelStyle}>Priorité</label><select value={form.priorite} onChange={e=>setForm(p=>({...p,priorite:e.target.value}))} style={inputStyle}>{Object.entries(PRIOS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select></div>
        <div><label style={labelStyle}>Service</label><select value={form.service} onChange={e=>setForm(p=>({...p,service:e.target.value}))} style={inputStyle}>{SERVICES.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
      </div>
      <div style={{ padding:'10px 14px', background:'#eff6ff', borderRadius:10, border:'1px solid #bfdbfe', marginBottom:16 }}><div style={{ fontSize:11, fontWeight:600, color:'#2563eb', display:'flex', alignItems:'center', gap:4 }}><Hash size={11} />Numéro : <span style={{ fontFamily:'monospace', fontWeight:800 }}>{nextNum}</span></div></div>
      <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}><Btn variant="outline" size="sm" onClick={() => { setStep('scan'); setOcrResult(null); }}>Rescanner</Btn><Btn icon={Save} size="sm" onClick={handleConfirm}>Enregistrer le courrier</Btn></div>
    </div>)}
  </div>);
}

/* ═══════════════════════════════════════════════════ STATISTIQUES ═══════════════════════════════════════════════════ */
function StatsPanel({ data, isMobile }) {
  const stats = useMemo(() => {
    const total=data.length, byType={}, byStatut={}, byPrio={}, byService={}, byNature={}; let withOcr=0, withAttach=0, confidentiel=0;
    data.forEach(d => { byType[d.type]=(byType[d.type]||0)+1; byStatut[d.statut]=(byStatut[d.statut]||0)+1; byPrio[d.priorite]=(byPrio[d.priorite]||0)+1; byService[d.service]=(byService[d.service]||0)+1; byNature[d.nature]=(byNature[d.nature]||0)+1; if(d.ocrDone)withOcr++; if((d.piecesJointes||[]).length)withAttach++; if(d.confidentiel)confidentiel++; });
    const traites=data.filter(d=>d.statut==='traite').length, enAttente=data.filter(d=>['en_validation','enregistre'].includes(d.statut)).length;
    return { total, byType, byStatut, byPrio, topServices:Object.entries(byService).sort((a,b)=>b[1]-a[1]), topNatures:Object.entries(byNature).sort((a,b)=>b[1]-a[1]).slice(0,6), traites, enAttente, withOcr, withAttach, confidentiel };
  }, [data]);

  const BarRow = ({label,value,max,color}) => (<div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
    <span style={{fontSize:12,fontWeight:500,width:isMobile?100:140,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',flexShrink:0}}>{label}</span>
    <div style={{flex:1,height:18,background:'#f1f5f9',borderRadius:4,overflow:'hidden'}}><div style={{width:`${max>0?(value/max)*100:0}%`,height:'100%',background:color||COLORS.primary,borderRadius:4,transition:'width .4s',minWidth:value>0?16:0,display:'flex',alignItems:'center',justifyContent:'flex-end',paddingRight:6}}>{value>0&&<span style={{fontSize:10,fontWeight:700,color:'#fff'}}>{value}</span>}</div></div>
  </div>);

  const SC = ({label,value,sub,color,bg,icon:Icon}) => (<div style={{padding:16,background:bg||COLORS.surfaceAlt,borderRadius:12,border:`1.5px solid ${color||COLORS.border}20`}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}><div><div style={{fontSize:28,fontWeight:800,color:color||COLORS.text}}>{value}</div><div style={{fontSize:12,fontWeight:600,color:COLORS.textSec,marginTop:2}}>{label}</div>{sub&&<div style={{fontSize:11,color:COLORS.textMut,marginTop:4}}>{sub}</div>}</div>
    {Icon&&<div style={{width:36,height:36,borderRadius:8,background:(color||COLORS.primary)+'12',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon size={18} color={color||COLORS.primary} /></div>}</div>
  </div>);

  return (<div>
    <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(4,1fr)',gap:12,marginBottom:24}}>
      <SC label="Total courriers" value={stats.total} icon={Mail} color="#0c4a6e" bg="#f0f9ff" />
      <SC label="Taux traitement" value={stats.total>0?Math.round((stats.traites/stats.total)*100)+'%':'—'} sub={`${stats.traites} / ${stats.total}`} icon={CheckCircle2} color="#059669" bg="#ecfdf5" />
      <SC label="OCR appliqué" value={stats.withOcr} sub={`${stats.total>0?Math.round((stats.withOcr/stats.total)*100):0}% du total`} icon={ScanLine} color="#7c3aed" bg="#f5f3ff" />
      <SC label="En attente" value={stats.enAttente} icon={Clock} color="#d97706" bg="#fffbeb" />
    </div>
    <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:20}}>
      <div style={{padding:16,background:'#fff',borderRadius:12,border:`1px solid ${COLORS.border}`}}>
        <div style={{fontSize:13,fontWeight:700,marginBottom:14,display:'flex',alignItems:'center',gap:6}}><Layers size={14} color={COLORS.primary} />Par type</div>
        {Object.entries(stats.byType).sort((a,b)=>b[1]-a[1]).map(([k,v]) => { const t=TYPES_COURRIER[k]||{}; return <BarRow key={k} label={t.label||k} value={v} max={stats.total} color={t.color} />; })}
      </div>
      <div style={{padding:16,background:'#fff',borderRadius:12,border:`1px solid ${COLORS.border}`}}>
        <div style={{fontSize:13,fontWeight:700,marginBottom:14,display:'flex',alignItems:'center',gap:6}}><PieChart size={14} color={COLORS.primary} />Par statut</div>
        {Object.entries(stats.byStatut).sort((a,b)=>b[1]-a[1]).map(([k,v]) => { const s=getSt(k); return <BarRow key={k} label={s.label} value={v} max={stats.total} color={s.color} />; })}
      </div>
      <div style={{padding:16,background:'#fff',borderRadius:12,border:`1px solid ${COLORS.border}`}}>
        <div style={{fontSize:13,fontWeight:700,marginBottom:14,display:'flex',alignItems:'center',gap:6}}><Building2 size={14} color={COLORS.primary} />Par service</div>
        {stats.topServices.map(([k,v]) => <BarRow key={k} label={k} value={v} max={Math.max(...stats.topServices.map(s=>s[1]),1)} color="#0369a1" />)}
      </div>
      <div style={{padding:16,background:'#fff',borderRadius:12,border:`1px solid ${COLORS.border}`}}>
        <div style={{fontSize:13,fontWeight:700,marginBottom:14,display:'flex',alignItems:'center',gap:6}}><Tag size={14} color={COLORS.primary} />Par nature</div>
        {stats.topNatures.map(([k,v]) => <BarRow key={k} label={k} value={v} max={Math.max(...stats.topNatures.map(s=>s[1]),1)} color="#7c3aed" />)}
        <div style={{marginTop:10,padding:'8px 12px',background:COLORS.surfaceAlt,borderRadius:6,display:'flex',gap:12,flexWrap:'wrap',fontSize:11,color:COLORS.textMut}}>
          <span>📎 Avec PJ : <strong>{stats.withAttach}</strong></span><span>🔒 Confidentiel : <strong>{stats.confidentiel}</strong></span>
        </div>
      </div>
    </div>
  </div>);
}

/* ═══════════════════════════════════════════════════ HELPERS ═══════════════════════════════════════════════════ */
function InfoBlk({ label, value, mono, accent, span }) {
  return (<div style={span?{gridColumn:'1/-1'}:{}}><div style={{fontSize:10,color:COLORS.textMut,marginBottom:2,fontWeight:600,textTransform:'uppercase',letterSpacing:.3}}>{label}</div><div style={{fontSize:13,fontWeight:600,fontFamily:mono?'monospace':FF,color:accent?'#dc2626':COLORS.text}}>{value||'—'}</div></div>);
}