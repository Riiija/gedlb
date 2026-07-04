/* ═══════════════════════════════════════════════════════════════
   SOFT LIBRARY — Administration & Paramétrage (Complet)
   
   Sections :
   1.  Types documentaires          — CRUD types + métadonnées + DUA
   2.  Workflows                    — Circuits de validation configurables
   3.  Métadonnées dynamiques       — Champs custom par type
   4.  Générateur de formulaires    — Builder visuel
   5.  Règles de numérotation       — Patterns auto-numérotation
   6.  Plans de classement          — Arborescence hiérarchique
   7.  Multi-langues                — FR / EN
   8.  Multi-sites                  — Gestion des sites physiques
   9.  Sauvegarde & restauration    — Backup / restore config
   10. Import / Export massif       — CSV, JSON, Excel
   11. Accès & Rôles                — Habilitations par service/rôle
   12. Conservation (DUA)           — Durées de conservation par type
   13. Journal d'audit              — Historique modifications
═══════════════════════════════════════════════════════════════ */
import React, { useState, useMemo, useCallback } from 'react';
import {
  Tag, ArrowUpDown, Users, Shield, MapPin, Clock, Activity, Archive,
  ChevronRight, ChevronDown, ChevronLeft, Plus, Edit3, Trash2, Save,
  X, Check, AlertTriangle, Eye, EyeOff, Settings, FileText, Layers,
  Lock, Unlock, RotateCcw, Search, Copy, Download, Filter, Zap,
  Calendar, Hash, Building2, User, Briefcase, ToggleLeft, ToggleRight,
  Info, BookOpen, RefreshCw, SlidersHorizontal, Database, History,
  Upload, Globe, FolderTree, FormInput, MoreVertical,
  GripVertical, ArrowRight, Move, BarChart3,
  CheckCircle2, XCircle, FolderOpen, Server, HardDrive,
  CloudUpload, CloudDownload,
} from 'lucide-react';
import { COLORS, FONT_FAMILY } from '../theme';
import { Badge, Btn, Modal } from '../components/ui';

const FF = FONT_FAMILY;
const inp = { width:'100%', padding:'9px 12px', borderRadius:8, border:`1.5px solid ${COLORS.border}`, fontSize:13, background:'#fff', outline:'none', boxSizing:'border-box', fontFamily:FF, transition:'border-color .15s' };
const lbl = { fontSize:11, color:COLORS.textMut, marginBottom:4, display:'block', fontWeight:600 };
const card = { background:'#fff', borderRadius:12, border:`1px solid ${COLORS.border}`, overflow:'hidden' };
const pill = (a) => ({ padding:'6px 14px', borderRadius:20, fontSize:12, fontWeight:600, border:'none', cursor:'pointer', fontFamily:FF, background:a?COLORS.primaryLighter:'transparent', color:a?COLORS.primaryLight:COLORS.textSec, transition:'all .15s' });

const META_TYPES = [
  { id:'text', label:'Texte', icon:'Aa' },{ id:'number', label:'Nombre', icon:'#' },{ id:'date', label:'Date', icon:'📅' },
  { id:'select', label:'Liste déroulante', icon:'▼' },{ id:'textarea', label:'Texte long', icon:'¶' },{ id:'boolean', label:'Oui/Non', icon:'☑' },
  { id:'file', label:'Fichier', icon:'📎' },{ id:'email', label:'Email', icon:'@' },
];
const SORT_FINALS = [{ id:'conservation', label:'Conservation définitive' },{ id:'destruction', label:'Destruction' },{ id:'tri', label:'Tri (décision ultérieure)' }];
const DEFAULT_ROLES = [
  { id:'admin', label:'Administrateur', desc:'Accès complet' },
  { id:'gestionnaire', label:'Gestionnaire archives', desc:'CRUD documents + emplacements' },
  { id:'agent_courrier', label:'Agent courrier', desc:'Gestion courrier' },
  { id:'consultant', label:'Consultant', desc:'Consultation lecture seule' },
  { id:'auditeur', label:'Auditeur', desc:'Audit + reporting' },
];
const PERMISSIONS = [
  { id:'lib_admin', label:'Administration', icon:Settings },{ id:'lib_enregistrer', label:'Enregistrer', icon:Plus },
  { id:'lib_modifier', label:'Modifier', icon:Edit3 },{ id:'lib_supprimer', label:'Supprimer', icon:Trash2 },
  { id:'lib_consulter', label:'Consulter', icon:Eye },{ id:'lib_rechercher', label:'Recherche', icon:Search },
  { id:'lib_courrier', label:'Courrier', icon:FileText },{ id:'lib_reporting', label:'Reporting', icon:BarChart3 },
  { id:'lib_audit', label:'Audit', icon:Activity },{ id:'lib_export', label:'Export', icon:Download },
];

const ADMIN_SECTIONS = [
  { id:'types',        icon:Tag,            label:'Types documentaires',       desc:'Créer et configurer les types' },
  { id:'workflows',    icon:ArrowUpDown,    label:'Paramétrage des workflows', desc:'Circuits de validation' },
  { id:'metadata',     icon:SlidersHorizontal, label:'Métadonnées dynamiques', desc:'Champs personnalisés par type' },
  { id:'formgen',      icon:FormInput,      label:'Générateur de formulaires', desc:'Builder visuel de formulaires' },
  { id:'numbering',    icon:Hash,           label:'Règles de numérotation',    desc:'Patterns auto-numérotation' },
  { id:'classement',   icon:FolderTree,     label:'Plans de classement',       desc:'Arborescence hiérarchique' },
  { id:'lang',         icon:Globe,          label:'Gestion multi-langues',     desc:'FR / EN' },
  { id:'sites',        icon:Building2,      label:'Gestion multi-sites',       desc:'Sites physiques' },
  { id:'backup',       icon:Database,       label:'Sauvegarde & restauration', desc:'Backup / restore' },
  { id:'importexport', icon:Upload,         label:'Import / Export massif',    desc:'CSV, JSON, Excel' },
  { id:'access',       icon:Shield,         label:'Accès & Rôles',             desc:'Habilitations par service/rôle' },
  { id:'conservation', icon:Clock,          label:'Conservation (DUA)',         desc:'Durées de conservation' },
  { id:'audit',        icon:Activity,       label:'Journal d\'audit',          desc:'Historique modifications' },
];

/* ═══════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
═══════════════════════════════════════════════════ */
export default function LibAdmin({ docTypes = [], auditLogs = [], users = [], documents = [], emplacements = [], contenants = [], gedDocs = [] }) {
  const [activeSection, setActiveSection] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  React.useEffect(() => { const c = () => setIsMobile(window.innerWidth < 768); c(); window.addEventListener('resize', c); return () => window.removeEventListener('resize', c); }, []);

  if (activeSection) {
    const sec = ADMIN_SECTIONS.find(s => s.id === activeSection);
    return (
      <div>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
          <button onClick={() => setActiveSection(null)} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:4, color:COLORS.primaryLight, fontSize:13, fontWeight:600, fontFamily:FF }}><ChevronLeft size={16} /> Administration</button>
          <ChevronRight size={14} color={COLORS.textMut} />
          <span style={{ fontSize:13, fontWeight:600 }}>{sec?.label}</span>
        </div>
        {activeSection === 'types' && <DocTypesManager docTypes={docTypes} isMobile={isMobile} />}
        {activeSection === 'workflows' && <WorkflowManager isMobile={isMobile} />}
        {activeSection === 'metadata' && <MetadataManager docTypes={docTypes} isMobile={isMobile} />}
        {activeSection === 'formgen' && <FormGenerator isMobile={isMobile} />}
        {activeSection === 'numbering' && <NumberingRules isMobile={isMobile} />}
        {activeSection === 'classement' && <ClassificationPlan isMobile={isMobile} />}
        {activeSection === 'lang' && <LanguageManager isMobile={isMobile} />}
        {activeSection === 'sites' && <SiteManager emplacements={emplacements} isMobile={isMobile} />}
        {activeSection === 'backup' && <BackupManager documents={documents} isMobile={isMobile} />}
        {activeSection === 'importexport' && <ImportExportManager documents={documents} isMobile={isMobile} />}
        {activeSection === 'access' && <AccessManager users={users} isMobile={isMobile} />}
        {activeSection === 'conservation' && <ConservationManager docTypes={docTypes} isMobile={isMobile} />}
        {activeSection === 'audit' && <AuditLogViewer auditLogs={auditLogs} isMobile={isMobile} />}
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ margin:0, fontSize:isMobile?20:24, fontWeight:700 }}>Administration</h1>
        <p style={{ margin:'4px 0 0', fontSize:13, color:COLORS.textMut }}>Paramétrage et configuration du module archives</p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr 1fr':'repeat(4,1fr)', gap:isMobile?10:14, marginBottom:24 }}>
        {[
          { label:'Types actifs', value:docTypes.filter(t => t.actif !== false).length || '—', color:COLORS.primary, bg:COLORS.primaryLighter, icon:Tag },
          { label:'Rôles définis', value:DEFAULT_ROLES.length, color:'#2563eb', bg:'#eff6ff', icon:Shield },
          { label:'Événements audit', value:auditLogs.length || '—', color:'#d97706', bg:'#fffbeb', icon:Activity },
          { label:'Documents', value:documents.length || '—', color:'#059669', bg:'#ecfdf5', icon:FileText },
        ].map((k,i) => (
          <div key={i} style={{ background:'#fff', borderRadius:12, padding:isMobile?14:'16px 18px', border:`1px solid ${COLORS.border}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div><div style={{ fontSize:11, color:COLORS.textMut, marginBottom:4, fontWeight:500 }}>{k.label}</div><div style={{ fontSize:isMobile?20:24, fontWeight:700 }}>{k.value}</div></div>
              <div style={{ width:36, height:36, borderRadius:8, background:k.bg, display:'flex', alignItems:'center', justifyContent:'center' }}><k.icon size={18} color={k.color} /></div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'repeat(3,1fr)', gap:12 }}>
        {ADMIN_SECTIONS.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            style={{ ...card, padding:'18px 20px', cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', gap:14, transition:'all .15s', fontFamily:FF }}>
            <div style={{ width:42, height:42, borderRadius:10, background:COLORS.primaryLighter, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><s.icon size={20} color={COLORS.primaryLight} /></div>
            <div style={{ flex:1 }}><div style={{ fontSize:14, fontWeight:700, color:COLORS.text }}>{s.label}</div><div style={{ fontSize:11, color:COLORS.textMut, marginTop:2 }}>{s.desc}</div></div>
            <ChevronRight size={16} color={COLORS.textMut} />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   1. TYPES DOCUMENTAIRES
═══════════════════════════════════════════════════════════════ */
function DocTypesManager({ docTypes: initialTypes, isMobile }) {
  const [types, setTypes] = useState(initialTypes.length > 0 ? initialTypes : [
    { id:'DOC-TYP-01', label:'Contrats', dureeActive:5, dureeInter:10, sort:'conservation', icon:'📄', actif:true, metadonnees:[{nom:'montant',type:'number',requis:true},{nom:'parties',type:'text',requis:true},{nom:'duree',type:'text'}] },
    { id:'DOC-TYP-02', label:'Factures', dureeActive:2, dureeInter:8, sort:'destruction', icon:'🧾', actif:true, metadonnees:[{nom:'montant',type:'number',requis:true},{nom:'fournisseur',type:'text',requis:true}] },
    { id:'DOC-TYP-03', label:'Notes de service', dureeActive:1, dureeInter:3, sort:'destruction', icon:'📋', actif:true, metadonnees:[] },
    { id:'DOC-TYP-04', label:'PV Conseil Admin.', dureeActive:3, dureeInter:10, sort:'conservation', icon:'📝', actif:true, metadonnees:[{nom:'session',type:'text'},{nom:'participants',type:'number'}] },
    { id:'DOC-TYP-05', label:'Correspondance', dureeActive:1, dureeInter:5, sort:'tri', icon:'✉️', actif:true, metadonnees:[] },
  ]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [showMeta, setShowMeta] = useState(null);
  const filtered = types.filter(t => !search || t.label.toLowerCase().includes(search.toLowerCase()));

  if (editing) return <DocTypeForm type={editing === 'new' ? null : editing} isMobile={isMobile} onSave={t => { if (editing === 'new') setTypes(p => [...p, { ...t, id:`DOC-TYP-${String(p.length+1).padStart(2,'0')}` }]); else setTypes(p => p.map(x => x.id === t.id ? t : x)); setEditing(null); }} onCancel={() => setEditing(null)} />;
  if (showMeta) return <MetaConfigInline type={showMeta} isMobile={isMobile} onSave={t => { setTypes(p => p.map(x => x.id === t.id ? t : x)); setShowMeta(null); }} onCancel={() => setShowMeta(null)} />;

  return (
    <div>
      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        <div style={{ flex:1, minWidth:200, position:'relative' }}><Search size={15} style={{ position:'absolute', left:10, top:11, color:COLORS.textMut }} /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher un type..." style={{ ...inp, paddingLeft:32 }} /></div>
        <Btn icon={Plus} label="Nouveau type" onClick={() => setEditing('new')} />
      </div>
      <div style={card}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead><tr style={{ background:COLORS.primaryLighter }}>{['','Libellé','DUA Active','DUA Interméd.','Sort final','Métadonnées','Statut',''].map((h,i)=><th key={i} style={{ padding:'10px 14px', textAlign:'left', fontSize:11, fontWeight:700, color:COLORS.textSec }}>{h}</th>)}</tr></thead>
          <tbody>{filtered.map(t => (
            <tr key={t.id} style={{ borderBottom:`1px solid ${COLORS.border}` }}>
              <td style={{ padding:'10px 14px', fontSize:18 }}>{t.icon}</td>
              <td style={{ padding:'10px 14px' }}><div style={{ fontWeight:600 }}>{t.label}</div><div style={{ fontSize:10, color:COLORS.textMut, fontFamily:'monospace' }}>{t.id}</div></td>
              <td style={{ padding:'10px 14px' }}>{t.dureeActive} ans</td>
              <td style={{ padding:'10px 14px' }}>{t.dureeInter} ans</td>
              <td style={{ padding:'10px 14px' }}><Badge label={SORT_FINALS.find(s=>s.id===t.sort)?.label||t.sort} color={t.sort==='conservation'?'#059669':t.sort==='destruction'?'#dc2626':'#d97706'} /></td>
              <td style={{ padding:'10px 14px' }}><button onClick={()=>setShowMeta(t)} style={{ background:'none', border:'none', cursor:'pointer', color:COLORS.primaryLight, fontSize:12, fontWeight:600, fontFamily:FF }}>{(t.metadonnees||[]).length} champs →</button></td>
              <td style={{ padding:'10px 14px' }}><Badge label={t.actif!==false?'Actif':'Inactif'} color={t.actif!==false?'#059669':'#94a3b8'} /></td>
              <td style={{ padding:'10px 14px', textAlign:'right' }}>
                <IcoBtn icon={Edit3} color={COLORS.primaryLight} title="Modifier" onClick={()=>setEditing(t)} />
                <IcoBtn icon={t.actif!==false?EyeOff:Eye} color="#d97706" title={t.actif!==false?'Désactiver':'Activer'} onClick={()=>setTypes(p=>p.map(x=>x.id===t.id?{...x,actif:!x.actif}:x))} />
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

function DocTypeForm({ type, isMobile, onSave, onCancel }) {
  const [f, setF] = useState(type || { label:'', icon:'📄', dureeActive:3, dureeInter:10, sort:'conservation', actif:true, metadonnees:[] });
  const up = (k,v) => setF(p=>({...p,[k]:v}));
  return (
    <div style={{ ...card, padding:24 }}>
      <h3 style={{ margin:'0 0 20px', fontSize:16 }}>{type ? 'Modifier le type' : 'Nouveau type documentaire'}</h3>
      <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap:14 }}>
        <div><label style={lbl}>Libellé *</label><input value={f.label} onChange={e=>up('label',e.target.value)} style={inp} placeholder="Ex: Contrats" /></div>
        <div><label style={lbl}>Icône</label><input value={f.icon} onChange={e=>up('icon',e.target.value)} style={inp} /></div>
        <div><label style={lbl}>DUA Active (années)</label><input type="number" value={f.dureeActive} onChange={e=>up('dureeActive',+e.target.value)} style={inp} /></div>
        <div><label style={lbl}>DUA Intermédiaire (années)</label><input type="number" value={f.dureeInter} onChange={e=>up('dureeInter',+e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Sort final</label><select value={f.sort} onChange={e=>up('sort',e.target.value)} style={inp}>{SORT_FINALS.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select></div>
      </div>
      <div style={{ display:'flex', gap:10, marginTop:20, justifyContent:'flex-end' }}>
        <Btn label="Annuler" variant="ghost" onClick={onCancel} />
        <Btn icon={Save} label="Enregistrer" onClick={()=>{ if(f.label.trim()) onSave(f); }} />
      </div>
    </div>
  );
}

function MetaConfigInline({ type, isMobile, onSave, onCancel }) {
  const [meta, setMeta] = useState(type.metadonnees || []);
  const add = () => setMeta(p=>[...p,{nom:'',type:'text',requis:false}]);
  const upd = (i,k,v) => setMeta(p=>p.map((m,j)=>j===i?{...m,[k]:v}:m));
  const del = (i) => setMeta(p=>p.filter((_,j)=>j!==i));
  return (
    <div style={{ ...card, padding:24 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <div><h3 style={{ margin:0, fontSize:16 }}>Métadonnées — {type.icon} {type.label}</h3></div>
        <Btn icon={Plus} label="Ajouter champ" size="sm" onClick={add} />
      </div>
      {meta.length === 0 && <div style={{ padding:40, textAlign:'center', color:COLORS.textMut, fontSize:13 }}>Aucun champ — cliquez "Ajouter champ"</div>}
      {meta.map((m,i) => (
        <div key={i} style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'2fr 1fr 80px 40px', gap:10, marginBottom:10, alignItems:'end' }}>
          <div><label style={lbl}>Nom</label><input value={m.nom} onChange={e=>upd(i,'nom',e.target.value)} style={inp} /></div>
          <div><label style={lbl}>Type</label><select value={m.type} onChange={e=>upd(i,'type',e.target.value)} style={inp}>{META_TYPES.map(t=><option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}</select></div>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}><input type="checkbox" checked={m.requis} onChange={e=>upd(i,'requis',e.target.checked)} /><span style={{ fontSize:11 }}>Requis</span></div>
          <IcoBtn icon={Trash2} color="#dc2626" title="Supprimer" onClick={()=>del(i)} />
        </div>
      ))}
      <div style={{ display:'flex', gap:10, marginTop:20, justifyContent:'flex-end' }}>
        <Btn label="Annuler" variant="ghost" onClick={onCancel} />
        <Btn icon={Save} label="Enregistrer" onClick={()=>onSave({...type, metadonnees:meta})} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2. WORKFLOWS
═══════════════════════════════════════════════════════════════ */
function WorkflowManager({ isMobile }) {
  const [workflows, setWorkflows] = useState([
    { id:'WF-001', nom:'Circuit standard', description:'Visa N1 + Signature DG', actif:true, declencheur:'Consultation document confidentiel',
      etapes:[{ ordre:1, type:'visa', role:'gestionnaire', label:'Visa gestionnaire', delai:2 },{ ordre:2, type:'signature', role:'admin', label:'Signature DG', delai:3 }] },
    { id:'WF-002', nom:'Élimination archives', description:'Triple validation avant destruction', actif:true, declencheur:'Demande d\'élimination',
      etapes:[{ ordre:1, type:'visa', role:'gestionnaire', label:'Visa archiviste', delai:5 },{ ordre:2, type:'visa', role:'auditeur', label:'Avis auditeur', delai:5 },{ ordre:3, type:'signature', role:'admin', label:'Autorisation DG', delai:3 }] },
    { id:'WF-003', nom:'Prêt externe', description:'Autorisation pour sortie hors site', actif:true, declencheur:'Demande de prêt externe',
      etapes:[{ ordre:1, type:'visa', role:'gestionnaire', label:'Vérification disponibilité', delai:1 },{ ordre:2, type:'signature', role:'admin', label:'Autorisation direction', delai:2 }] },
    { id:'WF-004', nom:'Transfert inter-sites', description:'Validation pour transfert entre sites', actif:false, declencheur:'Demande de transfert',
      etapes:[{ ordre:1, type:'visa', role:'gestionnaire', label:'Visa site source', delai:2 },{ ordre:2, type:'visa', role:'gestionnaire', label:'Accusé site destination', delai:3 }] },
  ]);
  const [editing, setEditing] = useState(null);
  const SC = { visa:'#7c3aed', signature:'#059669', validation:'#2563eb', notification:'#d97706' };

  if (editing) {
    const isNew = editing === 'new';
    const wf = isNew ? { id:`WF-${String(workflows.length+1).padStart(3,'0')}`, nom:'', description:'', actif:true, declencheur:'', etapes:[] } : editing;
    return <WfEditor wf={wf} isMobile={isMobile} onSave={w => { setWorkflows(p => isNew ? [...p, w] : p.map(x => x.id === w.id ? w : x)); setEditing(null); }} onCancel={() => setEditing(null)} />;
  }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:10 }}>
        <p style={{ margin:0, fontSize:13, color:COLORS.textMut }}>{workflows.length} workflow{workflows.length>1?'s':''} configuré{workflows.length>1?'s':''}</p>
        <Btn icon={Plus} label="Nouveau workflow" onClick={() => setEditing('new')} />
      </div>
      {workflows.map(wf => (
        <div key={wf.id} style={{ ...card, marginBottom:12, padding:isMobile?14:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}><span style={{ fontSize:14, fontWeight:700 }}>{wf.nom}</span><Badge label={wf.actif?'Actif':'Inactif'} color={wf.actif?'#059669':'#94a3b8'} /></div>
              <div style={{ fontSize:12, color:COLORS.textMut, marginTop:4 }}>{wf.description}</div>
              <div style={{ fontSize:11, color:COLORS.textSec, marginTop:6 }}>Déclencheur : <strong>{wf.declencheur}</strong></div>
            </div>
            <div style={{ display:'flex', gap:4 }}>
              <IcoBtn icon={Edit3} color={COLORS.primaryLight} title="Modifier" onClick={() => setEditing(wf)} />
              <IcoBtn icon={wf.actif?EyeOff:Eye} color="#d97706" title={wf.actif?'Désactiver':'Activer'} onClick={() => setWorkflows(p => p.map(x => x.id === wf.id ? {...x, actif:!x.actif} : x))} />
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:0, marginTop:14, overflowX:'auto', paddingBottom:4 }}>
            {wf.etapes.map((e,i) => (
              <React.Fragment key={i}>
                {i > 0 && <ArrowRight size={16} color={COLORS.textMut} style={{ flexShrink:0, margin:'0 4px' }} />}
                <div style={{ padding:'8px 14px', borderRadius:8, background:`${SC[e.type]||COLORS.primary}12`, border:`1.5px solid ${SC[e.type]||COLORS.primary}30`, flexShrink:0 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:SC[e.type]||COLORS.primary }}>{e.label}</div>
                  <div style={{ fontSize:10, color:COLORS.textMut, marginTop:2 }}>{e.type} • {e.delai}j • {e.role}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function WfEditor({ wf: initial, isMobile, onSave, onCancel }) {
  const [wf, setWf] = useState({...initial});
  const up = (k,v) => setWf(p=>({...p,[k]:v}));
  const addStep = () => up('etapes', [...wf.etapes, { ordre:wf.etapes.length+1, type:'visa', role:'gestionnaire', label:'', delai:2 }]);
  const updStep = (i,k,v) => up('etapes', wf.etapes.map((e,j)=>j===i?{...e,[k]:v}:e));
  const delStep = (i) => up('etapes', wf.etapes.filter((_,j)=>j!==i).map((e,j)=>({...e,ordre:j+1})));
  return (
    <div style={{ ...card, padding:24 }}>
      <h3 style={{ margin:'0 0 20px' }}>{initial.nom ? 'Modifier le workflow' : 'Nouveau workflow'}</h3>
      <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap:14, marginBottom:20 }}>
        <div><label style={lbl}>Nom *</label><input value={wf.nom} onChange={e=>up('nom',e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Déclencheur</label><input value={wf.declencheur} onChange={e=>up('declencheur',e.target.value)} style={inp} /></div>
        <div style={{ gridColumn:isMobile?'1':'1/3' }}><label style={lbl}>Description</label><input value={wf.description} onChange={e=>up('description',e.target.value)} style={inp} /></div>
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}><h4 style={{ margin:0, fontSize:14 }}>Étapes ({wf.etapes.length})</h4><Btn icon={Plus} label="Ajouter étape" size="sm" onClick={addStep} /></div>
      {wf.etapes.map((e,i) => (
        <div key={i} style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'40px 2fr 1fr 1fr 80px 40px', gap:10, marginBottom:10, alignItems:'end', padding:12, background:i%2?'#f8fafc':'#fff', borderRadius:8 }}>
          <div style={{ textAlign:'center', fontWeight:700, fontSize:16, color:COLORS.textMut }}>{e.ordre}</div>
          <div><label style={lbl}>Libellé</label><input value={e.label} onChange={v=>updStep(i,'label',v.target.value)} style={inp} /></div>
          <div><label style={lbl}>Type</label><select value={e.type} onChange={v=>updStep(i,'type',v.target.value)} style={inp}><option value="visa">Visa</option><option value="signature">Signature</option><option value="validation">Validation</option><option value="notification">Notification</option></select></div>
          <div><label style={lbl}>Rôle</label><select value={e.role} onChange={v=>updStep(i,'role',v.target.value)} style={inp}>{DEFAULT_ROLES.map(r=><option key={r.id} value={r.id}>{r.label}</option>)}</select></div>
          <div><label style={lbl}>Délai (j)</label><input type="number" value={e.delai} onChange={v=>updStep(i,'delai',+v.target.value)} style={inp} /></div>
          <IcoBtn icon={Trash2} color="#dc2626" title="Supprimer" onClick={()=>delStep(i)} />
        </div>
      ))}
      <div style={{ display:'flex', gap:10, marginTop:20, justifyContent:'flex-end' }}>
        <Btn label="Annuler" variant="ghost" onClick={onCancel} />
        <Btn icon={Save} label="Enregistrer" onClick={()=>{ if(wf.nom.trim()) onSave(wf); }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. MÉTADONNÉES DYNAMIQUES (vue globale)
═══════════════════════════════════════════════════════════════ */
function MetadataManager({ docTypes, isMobile }) {
  const [selType, setSelType] = useState(docTypes[0]?.id || null);
  const type = docTypes.find(t => t.id === selType);
  const allMeta = docTypes.flatMap(t => (t.metadonnees||[]).map(m=>({...m, typeLabel:t.label, typeId:t.id})));
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'250px 1fr', gap:16 }}>
        <div style={card}>
          <div style={{ padding:'12px 16px', borderBottom:`1px solid ${COLORS.border}`, fontSize:12, fontWeight:700, color:COLORS.textSec }}>TYPES ({docTypes.length})</div>
          {docTypes.map(t => (
            <div key={t.id} onClick={()=>setSelType(t.id)} style={{ padding:'10px 16px', cursor:'pointer', background:t.id===selType?COLORS.primaryLighter:'transparent', borderBottom:`1px solid ${COLORS.border}` }}>
              <div style={{ fontSize:13, fontWeight:t.id===selType?700:500 }}>{t.icon} {t.label}</div>
              <div style={{ fontSize:11, color:COLORS.textMut }}>{(t.metadonnees||[]).length} champ{(t.metadonnees||[]).length>1?'s':''}</div>
            </div>
          ))}
        </div>
        <div style={card}>
          {type ? (<div style={{ padding:20 }}>
            <h3 style={{ margin:'0 0 16px', fontSize:15 }}>Métadonnées — {type.icon} {type.label}</h3>
            {(type.metadonnees||[]).length === 0 && <div style={{ padding:30, textAlign:'center', color:COLORS.textMut }}>Aucun champ configuré</div>}
            {(type.metadonnees||[]).map((m,i) => (
              <div key={i} style={{ padding:'10px 14px', background:'#f8fafc', borderRadius:8, display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                <div><span style={{ fontWeight:600, fontSize:13 }}>{m.nom}</span><span style={{ marginLeft:8, fontSize:11, color:COLORS.textMut }}>{META_TYPES.find(t=>t.id===m.type)?.label||m.type}</span></div>
                {m.requis && <Badge label="Requis" color="#dc2626" />}
              </div>
            ))}
          </div>) : <div style={{ padding:40, textAlign:'center', color:COLORS.textMut }}>Sélectionnez un type</div>}
        </div>
      </div>
      <div style={{ ...card, marginTop:16 }}>
        <div style={{ padding:'12px 16px', borderBottom:`1px solid ${COLORS.border}`, fontSize:12, fontWeight:700, color:COLORS.textSec }}>VUE GLOBALE — {allMeta.length} champs</div>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}><thead><tr style={{ background:'#f8fafc' }}>{['Champ','Type','Requis','Type doc.'].map((h,i)=><th key={i} style={{ padding:'8px 14px', textAlign:'left', fontSize:11, fontWeight:700, color:COLORS.textSec }}>{h}</th>)}</tr></thead>
        <tbody>{allMeta.map((m,i)=>(<tr key={i} style={{ borderBottom:`1px solid ${COLORS.border}` }}><td style={{ padding:'8px 14px', fontWeight:600 }}>{m.nom}</td><td style={{ padding:'8px 14px' }}>{META_TYPES.find(t=>t.id===m.type)?.label||m.type}</td><td style={{ padding:'8px 14px' }}>{m.requis?<Check size={14} color="#059669"/>:<X size={14} color="#94a3b8"/>}</td><td style={{ padding:'8px 14px', color:COLORS.textMut }}>{m.typeLabel}</td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. GÉNÉRATEUR DE FORMULAIRES
═══════════════════════════════════════════════════════════════ */
function FormGenerator({ isMobile }) {
  const [forms, setForms] = useState([
    { id:'FORM-001', nom:'Fiche d\'enregistrement standard', type:'enregistrement', actif:true, champs:[
      {id:'f1',label:'Titre du document',type:'text',requis:true,largeur:'full'},{id:'f2',label:'Type documentaire',type:'select',requis:true,largeur:'half',options:'Contrats,Factures,Notes,PV,Correspondance'},
      {id:'f3',label:'Date du document',type:'date',requis:true,largeur:'half'},{id:'f4',label:'Service émetteur',type:'select',requis:true,largeur:'half',options:'Direction,Finances,RH,Juridique,IT'},
      {id:'f5',label:'Référence',type:'text',requis:false,largeur:'half'},{id:'f6',label:'Auteur',type:'text',requis:true,largeur:'half'},
      {id:'f7',label:'Confidentiel',type:'boolean',requis:false,largeur:'half'},{id:'f8',label:'Observations',type:'textarea',requis:false,largeur:'full'},
    ]},
    { id:'FORM-002', nom:'Demande de consultation', type:'consultation', actif:true, champs:[
      {id:'c1',label:'Document demandé',type:'select',requis:true,largeur:'full'},{id:'c2',label:'Motif',type:'textarea',requis:true,largeur:'full'},
      {id:'c3',label:'Date retour prévue',type:'date',requis:true,largeur:'half'},{id:'c4',label:'Priorité',type:'select',requis:true,largeur:'half',options:'Normale,Haute,Urgente'},
    ]},
    { id:'FORM-003', nom:'Bordereau de versement', type:'versement', actif:true, champs:[
      {id:'v1',label:'Service versant',type:'select',requis:true,largeur:'half',options:'Direction,Finances,RH,Juridique'},{id:'v2',label:'Nombre de boîtes',type:'number',requis:true,largeur:'half'},
      {id:'v3',label:'Dates extrêmes',type:'text',requis:true,largeur:'full'},{id:'v4',label:'Métrage linéaire',type:'number',requis:false,largeur:'half'},
    ]},
  ]);
  const [preview, setPreview] = useState(null);

  if (preview) {
    return (
      <div style={{ ...card, padding:24 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}><h3 style={{ margin:0 }}>Aperçu — {preview.nom}</h3><Btn label="Fermer" variant="ghost" icon={X} onClick={()=>setPreview(null)} /></div>
        <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap:14, padding:20, background:'#f8fafc', borderRadius:12 }}>
          {preview.champs.map(c => (
            <div key={c.id} style={{ gridColumn:c.largeur==='full'?'1/-1':undefined }}>
              <label style={lbl}>{c.label} {c.requis && <span style={{ color:'#dc2626' }}>*</span>}</label>
              {c.type==='textarea'?<textarea style={{...inp,minHeight:80}} disabled placeholder={c.label}/>:c.type==='boolean'?<div style={{ display:'flex', alignItems:'center', gap:8 }}><input type="checkbox" disabled /><span style={{ fontSize:13 }}>{c.label}</span></div>:c.type==='select'?<select style={inp} disabled><option>— Choisir —</option>{(c.options||'').split(',').map(o=><option key={o}>{o.trim()}</option>)}</select>:<input style={inp} disabled placeholder={c.label} type={c.type==='number'?'number':c.type==='date'?'date':'text'} />}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
        <p style={{ margin:0, fontSize:13, color:COLORS.textMut }}>{forms.length} formulaire{forms.length>1?'s':''} configuré{forms.length>1?'s':''}</p>
        <Btn icon={Plus} label="Nouveau formulaire" onClick={()=>setForms(p=>[...p,{id:`FORM-${String(p.length+1).padStart(3,'0')}`,nom:'Nouveau formulaire',type:'enregistrement',actif:true,champs:[]}])} />
      </div>
      {forms.map(f => (
        <div key={f.id} style={{ ...card, marginBottom:12, padding:isMobile?14:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div><div style={{ fontSize:14, fontWeight:700 }}>{f.nom}</div><div style={{ fontSize:11, color:COLORS.textMut, marginTop:2 }}>{f.champs.length} champs • Type: {f.type} • <span style={{ fontFamily:'monospace' }}>{f.id}</span></div></div>
            <div style={{ display:'flex', gap:4 }}>
              <IcoBtn icon={Eye} color="#2563eb" title="Aperçu" onClick={()=>setPreview(f)} />
              <IcoBtn icon={Copy} color={COLORS.textSec} title="Dupliquer" onClick={()=>setForms(p=>[...p,{...f,id:`FORM-${String(p.length+1).padStart(3,'0')}`,nom:`${f.nom} (copie)`}])} />
            </div>
          </div>
          <div style={{ display:'flex', gap:6, marginTop:10, flexWrap:'wrap' }}>
            {f.champs.slice(0,6).map(c => <span key={c.id} style={{ padding:'3px 10px', borderRadius:12, background:'#f1f5f9', fontSize:11, color:COLORS.textSec }}>{c.label}</span>)}
            {f.champs.length > 6 && <span style={{ padding:'3px 10px', borderRadius:12, background:COLORS.primaryLighter, fontSize:11, color:COLORS.primaryLight, fontWeight:600 }}>+{f.champs.length-6}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5. RÈGLES DE NUMÉROTATION
═══════════════════════════════════════════════════════════════ */
function NumberingRules({ isMobile }) {
  const [rules, setRules] = useState([
    { id:'NUM-001', nom:'Documents archives', pattern:'{TYPE}-{YYYY}-{NNNNN}', compteur:142, actif:true, exemple:'DOC-2025-00142' },
    { id:'NUM-002', nom:'Consultations', pattern:'CONS-{YYYY}-{NNNN}', compteur:12, actif:true, exemple:'CONS-2025-0012' },
    { id:'NUM-003', nom:'Courriers entrants', pattern:'CE-{YYYY}-{NNNN}', compteur:6, actif:true, exemple:'CE-2025-0006' },
    { id:'NUM-004', nom:'Courriers sortants', pattern:'CS-{YYYY}-{NNNN}', compteur:4, actif:true, exemple:'CS-2025-0004' },
    { id:'NUM-005', nom:'Contenants', pattern:'CNT-{NNN}', compteur:12, actif:true, exemple:'CNT-012' },
    { id:'NUM-006', nom:'Bordereaux versement', pattern:'BV-{YYYY}-{MM}-{NNN}', compteur:0, actif:false, exemple:'BV-2025-03-001' },
  ]);
  const [editing, setEditing] = useState(null);
  const TOKENS = ['{YYYY}','{YY}','{MM}','{DD}','{NNNNN}','{NNNN}','{NNN}','{TYPE}','{SITE}','{SERVICE}'];

  const makePreview = (p,c) => p.replace('{YYYY}','2025').replace('{YY}','25').replace('{MM}','03').replace('{DD}','01').replace('{NNNNN}',String(c+1).padStart(5,'0')).replace('{NNNN}',String(c+1).padStart(4,'0')).replace('{NNN}',String(c+1).padStart(3,'0')).replace('{TYPE}','DOC').replace('{SITE}','SIEGE').replace('{SERVICE}','DG');

  if (editing) {
    const isNew = editing === 'new';
    const r0 = isNew ? { id:`NUM-${String(rules.length+1).padStart(3,'0')}`, nom:'', pattern:'', compteur:0, actif:true, exemple:'' } : editing;
    const [r, setR] = [useState(r0)[0], useState(r0)[1]];
    // inline editor
    return (
      <div style={{ ...card, padding:24 }}>
        <h3 style={{ margin:'0 0 20px' }}>{isNew?'Nouvelle règle':'Modifier'}</h3>
        <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap:14, marginBottom:14 }}>
          <div><label style={lbl}>Nom *</label><input value={r.nom} onChange={e=>setR(p=>({...p,nom:e.target.value}))} style={inp} /></div>
          <div><label style={lbl}>Pattern *</label><input value={r.pattern} onChange={e=>setR(p=>({...p,pattern:e.target.value}))} style={{...inp,fontFamily:'monospace'}} /></div>
          <div><label style={lbl}>Compteur</label><input type="number" value={r.compteur} onChange={e=>setR(p=>({...p,compteur:+e.target.value}))} style={inp} /></div>
        </div>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:14 }}>
          {TOKENS.map(t=><button key={t} onClick={()=>setR(p=>({...p,pattern:p.pattern+t}))} style={{ padding:'4px 10px', borderRadius:6, border:`1px solid ${COLORS.border}`, background:'#f8fafc', fontSize:11, fontFamily:'monospace', cursor:'pointer', color:COLORS.primaryLight, fontWeight:600 }}>{t}</button>)}
        </div>
        <div style={{ padding:12, background:'#ecfdf5', borderRadius:8, marginBottom:16 }}><span style={{ fontSize:11, color:'#065f46' }}>Aperçu : </span><span style={{ fontFamily:'monospace', fontWeight:700, color:'#059669', fontSize:14 }}>{makePreview(r.pattern,r.compteur)}</span></div>
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
          <Btn label="Annuler" variant="ghost" onClick={()=>setEditing(null)} />
          <Btn icon={Save} label="Enregistrer" onClick={()=>{ if(r.nom.trim()&&r.pattern.trim()) { const saved={...r,exemple:makePreview(r.pattern,r.compteur)}; setRules(p=>isNew?[...p,saved]:p.map(x=>x.id===saved.id?saved:x)); setEditing(null); } }} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:8 }}>
        <p style={{ margin:0, fontSize:12, color:COLORS.textMut }}>Variables : {TOKENS.join('  ')}</p>
        <Btn icon={Plus} label="Nouvelle règle" onClick={()=>setEditing('new')} />
      </div>
      <div style={card}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead><tr style={{ background:COLORS.primaryLighter }}>{['Nom','Pattern','Compteur','Exemple','Statut',''].map((h,i)=><th key={i} style={{ padding:'10px 14px', textAlign:'left', fontSize:11, fontWeight:700, color:COLORS.textSec }}>{h}</th>)}</tr></thead>
          <tbody>{rules.map(r => (
            <tr key={r.id} style={{ borderBottom:`1px solid ${COLORS.border}` }}>
              <td style={{ padding:'10px 14px', fontWeight:600 }}>{r.nom}</td>
              <td style={{ padding:'10px 14px', fontFamily:'monospace', fontSize:12, color:COLORS.primaryLight, fontWeight:600 }}>{r.pattern}</td>
              <td style={{ padding:'10px 14px', fontFamily:'monospace' }}>{r.compteur}</td>
              <td style={{ padding:'10px 14px', fontFamily:'monospace', fontSize:12, color:'#059669' }}>{r.exemple}</td>
              <td style={{ padding:'10px 14px' }}><Badge label={r.actif?'Actif':'Inactif'} color={r.actif?'#059669':'#94a3b8'} /></td>
              <td style={{ padding:'10px 14px', textAlign:'right' }}>
                <IcoBtn icon={Edit3} color={COLORS.primaryLight} title="Modifier" onClick={()=>setEditing(r)} />
                <IcoBtn icon={RotateCcw} color="#d97706" title="RAZ compteur" onClick={()=>setRules(p=>p.map(x=>x.id===r.id?{...x,compteur:0}:x))} />
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   6. PLANS DE CLASSEMENT
═══════════════════════════════════════════════════════════════ */
function ClassificationPlan({ isMobile }) {
  const [plan] = useState([
    { id:'CL-01', code:'01', label:'Direction Générale', children:[
      { id:'CL-01-01', code:'01.01', label:'PV et délibérations', children:[] },
      { id:'CL-01-02', code:'01.02', label:'Correspondance officielle', children:[
        { id:'CL-01-02-01', code:'01.02.01', label:'Ministères', children:[] },
        { id:'CL-01-02-02', code:'01.02.02', label:'Partenaires', children:[] },
      ]},
      { id:'CL-01-03', code:'01.03', label:'Rapports annuels', children:[] },
    ]},
    { id:'CL-02', code:'02', label:'Finances & Comptabilité', children:[
      { id:'CL-02-01', code:'02.01', label:'Factures fournisseurs', children:[] },
      { id:'CL-02-02', code:'02.02', label:'Factures clients', children:[] },
      { id:'CL-02-03', code:'02.03', label:'Relevés bancaires', children:[] },
      { id:'CL-02-04', code:'02.04', label:'Déclarations fiscales', children:[] },
    ]},
    { id:'CL-03', code:'03', label:'Ressources Humaines', children:[
      { id:'CL-03-01', code:'03.01', label:'Dossiers du personnel', children:[] },
      { id:'CL-03-02', code:'03.02', label:'Paie', children:[] },
      { id:'CL-03-03', code:'03.03', label:'Formation', children:[] },
    ]},
    { id:'CL-04', code:'04', label:'Juridique', children:[
      { id:'CL-04-01', code:'04.01', label:'Contrats', children:[] },
      { id:'CL-04-02', code:'04.02', label:'Contentieux', children:[] },
    ]},
    { id:'CL-05', code:'05', label:'Technique & IT', children:[
      { id:'CL-05-01', code:'05.01', label:'Maintenance', children:[] },
      { id:'CL-05-02', code:'05.02', label:'Projets', children:[] },
    ]},
  ]);
  const [expanded, setExpanded] = useState({'CL-01':true,'CL-02':true});
  const toggle = id => setExpanded(p=>({...p,[id]:!p[id]}));
  const countAll = (n) => 1 + (n.children||[]).reduce((s,c) => s + countAll(c), 0);
  const totalNodes = plan.reduce((s,n) => s + countAll(n), 0);

  const renderNode = (node, depth = 0) => (
    <div key={node.id}>
      <div onClick={()=>node.children?.length && toggle(node.id)}
        style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 12px', paddingLeft:12+depth*24, cursor:node.children?.length?'pointer':'default', borderBottom:`1px solid ${COLORS.border}`, background:depth===0?'#f8fafc':'transparent' }}>
        {node.children?.length > 0 ? (expanded[node.id] ? <ChevronDown size={14} color={COLORS.textMut} /> : <ChevronRight size={14} color={COLORS.textMut} />) : <div style={{ width:14 }} />}
        <span style={{ fontFamily:'monospace', fontSize:11, color:COLORS.primaryLight, fontWeight:700, minWidth:60 }}>{node.code}</span>
        <FolderOpen size={14} color={depth===0?COLORS.primary:COLORS.textSec} />
        <span style={{ fontSize:13, fontWeight:depth===0?700:500 }}>{node.label}</span>
        {node.children?.length > 0 && <span style={{ fontSize:10, color:COLORS.textMut, marginLeft:'auto' }}>{node.children.length}</span>}
      </div>
      {expanded[node.id] && node.children?.map(c => renderNode(c, depth + 1))}
    </div>
  );

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
        <p style={{ margin:0, fontSize:13, color:COLORS.textMut }}>{plan.length} rubriques • {totalNodes} entrées</p>
        <Btn icon={Download} label="Exporter" variant="ghost" size="sm" />
      </div>
      <div style={card}>
        <div style={{ padding:'10px 16px', borderBottom:`1px solid ${COLORS.border}`, display:'flex', gap:10, background:COLORS.primaryLighter }}>
          <button onClick={()=>setExpanded(plan.reduce((a,n)=>({...a,[n.id]:true}),{}))} style={{ background:'none', border:'none', cursor:'pointer', fontSize:11, color:COLORS.primaryLight, fontWeight:600, fontFamily:FF }}>Tout déplier</button>
          <button onClick={()=>setExpanded({})} style={{ background:'none', border:'none', cursor:'pointer', fontSize:11, color:COLORS.textMut, fontFamily:FF }}>Tout replier</button>
        </div>
        {plan.map(n => renderNode(n, 0))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   7. MULTI-LANGUES (FR / EN)
═══════════════════════════════════════════════════════════════ */
function LanguageManager({ isMobile }) {
  const [lang, setLang] = useState('fr');
  const [translations, setTranslations] = useState([
    {key:'documents',fr:'Documents',en:'Documents'},{key:'contenants',fr:'Contenants',en:'Containers'},{key:'emplacements',fr:'Emplacements',en:'Locations'},
    {key:'consultations',fr:'Consultations',en:'Consultations'},{key:'courrier',fr:'Courrier',en:'Mail'},{key:'cycle_vie',fr:'Cycle de vie',en:'Lifecycle'},
    {key:'mouvements',fr:'Mouvements',en:'Movements'},{key:'reporting',fr:'Reporting',en:'Reporting'},{key:'administration',fr:'Administration',en:'Administration'},
    {key:'rechercher',fr:'Rechercher...',en:'Search...'},{key:'nouveau',fr:'Nouveau',en:'New'},{key:'modifier',fr:'Modifier',en:'Edit'},
    {key:'supprimer',fr:'Supprimer',en:'Delete'},{key:'enregistrer',fr:'Enregistrer',en:'Save'},{key:'annuler',fr:'Annuler',en:'Cancel'},
    {key:'statut',fr:'Statut',en:'Status'},{key:'disponible',fr:'Disponible',en:'Available'},{key:'en_consultation',fr:'En consultation',en:'Being consulted'},
    {key:'archivage_inter',fr:'Archivage intermédiaire',en:'Intermediate storage'},{key:'en_transfert',fr:'En transfert',en:'In transit'},
    {key:'confidentiel',fr:'Confidentiel',en:'Confidential'},{key:'titre',fr:'Titre',en:'Title'},{key:'service',fr:'Service',en:'Department'},
    {key:'auteur',fr:'Auteur',en:'Author'},{key:'date_document',fr:'Date du document',en:'Document date'},{key:'reference',fr:'Référence',en:'Reference'},
    {key:'priorite',fr:'Priorité',en:'Priority'},{key:'retour_prevu',fr:'Retour prévu',en:'Expected return'},{key:'demandeur',fr:'Demandeur',en:'Requester'},
    {key:'tableau_bord',fr:'Tableau de bord',en:'Dashboard'},{key:'detail',fr:'Détail',en:'Detail'},
  ]);
  const [search, setSearch] = useState('');
  const upd = (i,field,val) => setTranslations(p=>p.map((t,j)=>j===i?{...t,[field]:val}:t));
  const filtered = translations.filter(t => !search || t.key.includes(search.toLowerCase()) || t.fr.toLowerCase().includes(search.toLowerCase()) || t.en.toLowerCase().includes(search.toLowerCase()));
  const completionEn = Math.round(translations.filter(t=>t.en?.trim()).length / translations.length * 100);

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr 1fr', gap:14, marginBottom:20 }}>
        <div style={{ ...card, padding:16, textAlign:'center' }}>
          <div style={{ fontSize:11, color:COLORS.textMut, marginBottom:8 }}>Langue active</div>
          <div style={{ display:'flex', gap:8, justifyContent:'center' }}>
            {[{id:'fr',label:'🇫🇷 Français'},{id:'en',label:'🇬🇧 English'}].map(l=>(
              <button key={l.id} onClick={()=>setLang(l.id)} style={{ padding:'8px 16px', borderRadius:8, border:`2px solid ${lang===l.id?COLORS.primary:COLORS.border}`, background:lang===l.id?COLORS.primaryLighter:'#fff', cursor:'pointer', fontWeight:lang===l.id?700:500, fontSize:13, fontFamily:FF, color:lang===l.id?COLORS.primary:COLORS.text }}>{l.label}</button>
            ))}
          </div>
        </div>
        <div style={{ ...card, padding:16, textAlign:'center' }}><div style={{ fontSize:11, color:COLORS.textMut, marginBottom:4 }}>Clés de traduction</div><div style={{ fontSize:24, fontWeight:700 }}>{translations.length}</div></div>
        <div style={{ ...card, padding:16, textAlign:'center' }}><div style={{ fontSize:11, color:COLORS.textMut, marginBottom:4 }}>Couverture EN</div><div style={{ fontSize:24, fontWeight:700, color:completionEn===100?'#059669':'#d97706' }}>{completionEn}%</div></div>
      </div>
      <div style={{ display:'flex', gap:10, marginBottom:12 }}>
        <div style={{ flex:1, position:'relative' }}><Search size={15} style={{ position:'absolute', left:10, top:11, color:COLORS.textMut }} /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Filtrer..." style={{ ...inp, paddingLeft:32 }} /></div>
        <Btn icon={Plus} label="Ajouter clé" size="sm" onClick={()=>setTranslations(p=>[...p,{key:'nouvelle_cle',fr:'',en:''}])} />
        <Btn icon={Download} label="Exporter JSON" variant="ghost" size="sm" />
      </div>
      <div style={card}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
          <thead><tr style={{ background:COLORS.primaryLighter }}>{['Clé','🇫🇷 Français','🇬🇧 English',''].map((h,i)=><th key={i} style={{ padding:'10px 14px', textAlign:'left', fontSize:11, fontWeight:700, color:COLORS.textSec }}>{h}</th>)}</tr></thead>
          <tbody>{filtered.map((t,i) => (
            <tr key={t.key+i} style={{ borderBottom:`1px solid ${COLORS.border}` }}>
              <td style={{ padding:'6px 14px', fontFamily:'monospace', fontSize:11, color:COLORS.primaryLight, fontWeight:600 }}>{t.key}</td>
              <td style={{ padding:'6px 14px' }}><input value={t.fr} onChange={e=>upd(translations.indexOf(t),'fr',e.target.value)} style={{...inp,padding:'6px 10px',fontSize:12}} /></td>
              <td style={{ padding:'6px 14px' }}><input value={t.en} onChange={e=>upd(translations.indexOf(t),'en',e.target.value)} style={{...inp,padding:'6px 10px',fontSize:12,borderColor:!t.en?'#fbbf24':COLORS.border}} /></td>
              <td style={{ padding:'6px 14px' }}><IcoBtn icon={Trash2} color="#dc2626" title="Supprimer" onClick={()=>setTranslations(p=>p.filter(x=>x!==t))} /></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   8. MULTI-SITES
═══════════════════════════════════════════════════════════════ */
function SiteManager({ emplacements, isMobile }) {
  const [sites, setSites] = useState([
    { id:'SITE-001', nom:'Siège Analakely', ville:'Antananarivo', adresse:'Lot IVG 123 Analakely', tel:'+261 20 22 456 78', responsable:'Razafy Pierre', actif:true, emplacements:6, capacite:3750, occupe:2928 },
    { id:'SITE-002', nom:'Site Ankorondrano', ville:'Antananarivo', adresse:'Immeuble Ankorondrano, Bloc B', tel:'+261 20 22 789 01', responsable:'Rakoto Jean-Baptiste', actif:true, emplacements:3, capacite:4300, occupe:2750 },
    { id:'SITE-003', nom:'Agence Tamatave', ville:'Toamasina', adresse:'Boulevard Joffre 45', tel:'+261 20 53 321 00', responsable:'Rajaonarivelo Fidy', actif:true, emplacements:2, capacite:350, occupe:222 },
    { id:'SITE-004', nom:'Bureau Fianarantsoa', ville:'Fianarantsoa', adresse:'Rue du Commerce 12', tel:'', responsable:'—', actif:false, emplacements:0, capacite:0, occupe:0 },
  ]);
  const [editing, setEditing] = useState(null);

  if (editing) {
    const isNew = editing === 'new';
    const s0 = isNew ? { id:`SITE-${String(sites.length+1).padStart(3,'0')}`, nom:'', ville:'', adresse:'', tel:'', responsable:'', actif:true, emplacements:0, capacite:0, occupe:0 } : editing;
    const [s, setS] = [useState(s0)[0], useState(s0)[1]];
    return (
      <div style={{ ...card, padding:24 }}>
        <h3 style={{ margin:'0 0 20px' }}>{isNew?'Nouveau site':'Modifier le site'}</h3>
        <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap:14 }}>
          <div><label style={lbl}>Nom *</label><input value={s.nom} onChange={e=>setS(p=>({...p,nom:e.target.value}))} style={inp} /></div>
          <div><label style={lbl}>Ville</label><input value={s.ville} onChange={e=>setS(p=>({...p,ville:e.target.value}))} style={inp} /></div>
          <div><label style={lbl}>Adresse</label><input value={s.adresse} onChange={e=>setS(p=>({...p,adresse:e.target.value}))} style={inp} /></div>
          <div><label style={lbl}>Téléphone</label><input value={s.tel} onChange={e=>setS(p=>({...p,tel:e.target.value}))} style={inp} /></div>
          <div><label style={lbl}>Responsable</label><input value={s.responsable} onChange={e=>setS(p=>({...p,responsable:e.target.value}))} style={inp} /></div>
          <div style={{ display:'flex', alignItems:'end', gap:8 }}><input type="checkbox" checked={s.actif} onChange={e=>setS(p=>({...p,actif:e.target.checked}))} /><span style={{ fontSize:13 }}>Site actif</span></div>
        </div>
        <div style={{ display:'flex', gap:10, marginTop:20, justifyContent:'flex-end' }}>
          <Btn label="Annuler" variant="ghost" onClick={()=>setEditing(null)} />
          <Btn icon={Save} label="Enregistrer" onClick={()=>{ if(s.nom.trim()) { setSites(p=>isNew?[...p,s]:p.map(x=>x.id===s.id?s:x)); setEditing(null); } }} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
        <p style={{ margin:0, fontSize:13, color:COLORS.textMut }}>{sites.filter(s=>s.actif).length} site{sites.filter(s=>s.actif).length>1?'s':''} actif{sites.filter(s=>s.actif).length>1?'s':''}</p>
        <Btn icon={Plus} label="Nouveau site" onClick={()=>setEditing('new')} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap:14 }}>
        {sites.map(s => {
          const pct = s.capacite ? Math.round(s.occupe / s.capacite * 100) : 0;
          return (
            <div key={s.id} style={{ ...card, padding:20, opacity:s.actif?1:0.6 }}>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}><Building2 size={16} color={COLORS.primary} /><span style={{ fontSize:15, fontWeight:700 }}>{s.nom}</span><Badge label={s.actif?'Actif':'Inactif'} color={s.actif?'#059669':'#94a3b8'} /></div>
                  <div style={{ fontSize:12, color:COLORS.textMut, marginTop:4 }}>{s.ville} — {s.adresse}</div>
                </div>
                <IcoBtn icon={Edit3} color={COLORS.primaryLight} title="Modifier" onClick={()=>setEditing(s)} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginTop:14 }}>
                <div><div style={{ fontSize:10, color:COLORS.textMut }}>Emplacements</div><div style={{ fontSize:16, fontWeight:700 }}>{s.emplacements}</div></div>
                <div><div style={{ fontSize:10, color:COLORS.textMut }}>Responsable</div><div style={{ fontSize:12, fontWeight:600 }}>{s.responsable}</div></div>
                <div><div style={{ fontSize:10, color:COLORS.textMut }}>Remplissage</div><div style={{ fontSize:16, fontWeight:700, color:pct>=90?'#dc2626':pct>=70?'#d97706':'#059669' }}>{pct}%</div></div>
              </div>
              <div style={{ marginTop:10, height:6, background:'#e2e8f0', borderRadius:3 }}><div style={{ width:`${pct}%`, height:'100%', background:pct>=90?'#dc2626':pct>=70?'#d97706':'#059669', borderRadius:3, transition:'width .3s' }} /></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   9. SAUVEGARDE & RESTAURATION
═══════════════════════════════════════════════════════════════ */
function BackupManager({ documents, isMobile }) {
  const [backups, setBackups] = useState([
    { id:'BK-001', date:'2025-02-28 18:00', type:'auto', taille:'2.4 Mo', elements:{documents:12,contenants:12,emplacements:10,consultations:12} },
    { id:'BK-002', date:'2025-02-21 18:00', type:'auto', taille:'2.3 Mo', elements:{documents:11,contenants:12,emplacements:10,consultations:10} },
    { id:'BK-003', date:'2025-02-15 10:30', type:'manuel', taille:'2.1 Mo', elements:{documents:10,contenants:10,emplacements:10,consultations:8} },
  ]);
  const [autoConfig, setAutoConfig] = useState({ enabled:true, frequence:'hebdomadaire', heure:'18:00', retention:30 });
  const [restoring, setRestoring] = useState(null);

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap:16, marginBottom:20 }}>
        <div style={{ ...card, padding:20 }}>
          <h4 style={{ margin:'0 0 14px', fontSize:14 }}><Server size={16} style={{ verticalAlign:'middle', marginRight:6 }} />Sauvegarde automatique</h4>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
            <button onClick={()=>setAutoConfig(p=>({...p,enabled:!p.enabled}))} style={{ background:'none', border:'none', cursor:'pointer' }}>
              {autoConfig.enabled ? <ToggleRight size={28} color="#059669" /> : <ToggleLeft size={28} color="#94a3b8" />}
            </button>
            <span style={{ fontSize:13, fontWeight:600, color:autoConfig.enabled?'#059669':'#94a3b8' }}>{autoConfig.enabled?'Activée':'Désactivée'}</span>
          </div>
          <div style={{ display:'grid', gap:10 }}>
            <div><label style={lbl}>Fréquence</label><select value={autoConfig.frequence} onChange={e=>setAutoConfig(p=>({...p,frequence:e.target.value}))} style={inp}><option value="quotidienne">Quotidienne</option><option value="hebdomadaire">Hebdomadaire</option><option value="mensuelle">Mensuelle</option></select></div>
            <div><label style={lbl}>Heure</label><input type="time" value={autoConfig.heure} onChange={e=>setAutoConfig(p=>({...p,heure:e.target.value}))} style={inp} /></div>
            <div><label style={lbl}>Rétention (jours)</label><input type="number" value={autoConfig.retention} onChange={e=>setAutoConfig(p=>({...p,retention:+e.target.value}))} style={inp} /></div>
          </div>
        </div>
        <div style={{ ...card, padding:20 }}>
          <h4 style={{ margin:'0 0 14px', fontSize:14 }}><HardDrive size={16} style={{ verticalAlign:'middle', marginRight:6 }} />Actions</h4>
          <div style={{ display:'grid', gap:10 }}>
            <button onClick={()=>{const now=new Date().toISOString().replace('T',' ').slice(0,16);setBackups(p=>[{id:`BK-${String(p.length+1).padStart(3,'0')}`,date:now,type:'manuel',taille:'2.5 Mo',elements:{documents:documents.length,contenants:12,emplacements:10,consultations:12}},...p]);}} style={{ ...card, padding:14, cursor:'pointer', display:'flex', alignItems:'center', gap:12, border:`2px dashed ${COLORS.primary}`, background:COLORS.primaryLighter }}>
              <CloudUpload size={24} color={COLORS.primary} />
              <div style={{ textAlign:'left' }}><div style={{ fontSize:13, fontWeight:700, color:COLORS.primary }}>Sauvegarder maintenant</div><div style={{ fontSize:11, color:COLORS.textMut }}>Créer un backup manuel</div></div>
            </button>
            <button onClick={()=>setRestoring(backups[0])} style={{ ...card, padding:14, cursor:'pointer', display:'flex', alignItems:'center', gap:12, border:`2px dashed #d97706`, background:'#fffbeb' }}>
              <CloudDownload size={24} color="#d97706" />
              <div style={{ textAlign:'left' }}><div style={{ fontSize:13, fontWeight:700, color:'#92400e' }}>Restaurer</div><div style={{ fontSize:11, color:COLORS.textMut }}>Depuis une sauvegarde</div></div>
            </button>
          </div>
        </div>
      </div>
      <div style={card}>
        <div style={{ padding:'12px 16px', borderBottom:`1px solid ${COLORS.border}`, fontSize:12, fontWeight:700, color:COLORS.textSec }}>HISTORIQUE ({backups.length})</div>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
          <thead><tr style={{ background:'#f8fafc' }}>{['Date','Type','Taille','Éléments','Statut',''].map((h,i)=><th key={i} style={{ padding:'8px 14px', textAlign:'left', fontSize:11, fontWeight:700, color:COLORS.textSec }}>{h}</th>)}</tr></thead>
          <tbody>{backups.map(b => (
            <tr key={b.id} style={{ borderBottom:`1px solid ${COLORS.border}` }}>
              <td style={{ padding:'8px 14px', fontWeight:600 }}>{b.date}</td>
              <td style={{ padding:'8px 14px' }}><Badge label={b.type==='auto'?'Auto':'Manuel'} color={b.type==='auto'?'#2563eb':'#7c3aed'} /></td>
              <td style={{ padding:'8px 14px' }}>{b.taille}</td>
              <td style={{ padding:'8px 14px', fontSize:11 }}>{Object.entries(b.elements).map(([k,v])=>`${v} ${k}`).join(' • ')}</td>
              <td style={{ padding:'8px 14px' }}><Badge label="OK" color="#059669" /></td>
              <td style={{ padding:'8px 14px', textAlign:'right' }}><IcoBtn icon={Download} color={COLORS.primaryLight} title="Télécharger" /><IcoBtn icon={RotateCcw} color="#d97706" title="Restaurer" onClick={()=>setRestoring(b)} /></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {restoring && <Modal title="Confirmer la restauration" onClose={()=>setRestoring(null)} width={480}>
        <div style={{ padding:20 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:14, background:'#fef2f2', borderRadius:8, marginBottom:16 }}><AlertTriangle size={20} color="#dc2626" /><span style={{ fontSize:13, color:'#991b1b' }}>Cette action écrasera les données actuelles</span></div>
          <p style={{ fontSize:13, color:COLORS.textSec }}>Restaurer du <strong>{restoring.date}</strong> ({restoring.taille}) ?</p>
          <div style={{ display:'flex', gap:10, marginTop:20, justifyContent:'flex-end' }}><Btn label="Annuler" variant="ghost" onClick={()=>setRestoring(null)} /><Btn icon={RotateCcw} label="Restaurer" onClick={()=>setRestoring(null)} /></div>
        </div>
      </Modal>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   10. IMPORT / EXPORT MASSIF
═══════════════════════════════════════════════════════════════ */
function ImportExportManager({ documents, isMobile }) {
  const [tab, setTab] = useState('export');
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportScope, setExportScope] = useState('documents');
  const [importFile, setImportFile] = useState(null);
  const [history, setHistory] = useState([
    { date:'2025-02-15 14:30', type:'import', format:'CSV', lignes:45, scope:'documents' },
    { date:'2025-02-10 09:00', type:'export', format:'Excel', lignes:12, scope:'documents' },
    { date:'2025-01-28 16:00', type:'export', format:'JSON', lignes:150, scope:'tout' },
  ]);
  const SCOPES = [{id:'documents',label:'Documents',count:documents.length},{id:'consultations',label:'Consultations',count:12},{id:'courriers',label:'Courriers',count:13},{id:'emplacements',label:'Emplacements',count:10},{id:'contenants',label:'Contenants',count:12},{id:'tout',label:'Tout',count:'—'}];

  return (
    <div>
      <div style={{ display:'flex', gap:8, marginBottom:20 }}>{['export','import'].map(t => <button key={t} onClick={()=>setTab(t)} style={pill(tab===t)}>{t==='export'?'📤 Export':'📥 Import'}</button>)}</div>
      {tab === 'export' ? (
        <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap:16 }}>
          <div style={{ ...card, padding:20 }}>
            <h4 style={{ margin:'0 0 14px', fontSize:14 }}>Configuration</h4>
            <div style={{ marginBottom:14 }}><label style={lbl}>Format</label>
              <div style={{ display:'flex', gap:8 }}>{['csv','json','excel'].map(f => (
                <button key={f} onClick={()=>setExportFormat(f)} style={{ flex:1, padding:10, borderRadius:8, border:`2px solid ${exportFormat===f?COLORS.primary:COLORS.border}`, background:exportFormat===f?COLORS.primaryLighter:'#fff', cursor:'pointer', textAlign:'center', fontFamily:FF }}>
                  <div style={{ fontSize:18 }}>{f==='csv'?'📊':f==='json'?'{ }':'📗'}</div><div style={{ fontSize:12, fontWeight:exportFormat===f?700:500, marginTop:4 }}>{f.toUpperCase()}</div>
                </button>
              ))}</div>
            </div>
            <div style={{ marginBottom:14 }}><label style={lbl}>Périmètre</label><select value={exportScope} onChange={e=>setExportScope(e.target.value)} style={inp}>{SCOPES.map(s=><option key={s.id} value={s.id}>{s.label} ({s.count})</option>)}</select></div>
            <Btn icon={Download} label={`Exporter en ${exportFormat.toUpperCase()}`} onClick={()=>{const now=new Date().toISOString().replace('T',' ').slice(0,16);setHistory(p=>[{date:now,type:'export',format:exportFormat.toUpperCase(),lignes:documents.length,scope:exportScope},...p]);}} style={{ width:'100%' }} />
          </div>
          <div style={{ ...card, padding:20 }}>
            <h4 style={{ margin:'0 0 14px', fontSize:14 }}>Aperçu</h4>
            <div style={{ background:'#f8fafc', borderRadius:8, padding:14, fontSize:12, fontFamily:'monospace', maxHeight:250, overflow:'auto', whiteSpace:'pre' }}>
              {exportFormat==='json' ? JSON.stringify(documents.slice(0,2).map(d=>({id:d.id,titre:d.titre,categorie:d.categorie,service:d.service,statut:d.statut})),null,2) :
               `id;titre;categorie;service;statut;dateDocument\n${documents.slice(0,5).map(d=>`${d.id};${d.titre};${d.categorie||''};${d.service};${d.statut};${d.dateDocument}`).join('\n')}`}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap:16 }}>
          <div style={{ ...card, padding:20 }}>
            <h4 style={{ margin:'0 0 14px', fontSize:14 }}>Importer</h4>
            <div style={{ padding:40, border:`2px dashed ${COLORS.border}`, borderRadius:12, textAlign:'center', background:'#f8fafc', cursor:'pointer' }} onClick={()=>document.getElementById('imp-f')?.click()}>
              <Upload size={32} color={COLORS.textMut} /><div style={{ fontSize:13, fontWeight:600, marginTop:8 }}>Glisser-déposer ou cliquer</div><div style={{ fontSize:11, color:COLORS.textMut, marginTop:4 }}>CSV, JSON, Excel (.xlsx)</div>
              <input id="imp-f" type="file" accept=".csv,.json,.xlsx" style={{ display:'none' }} onChange={e => setImportFile(e.target.files?.[0]?.name || null)} />
            </div>
            {importFile && <div style={{ marginTop:14, padding:12, background:'#ecfdf5', borderRadius:8 }}>
              <div style={{ fontSize:13, fontWeight:600, color:'#059669' }}>Fichier : {importFile}</div>
              <Btn icon={Upload} label="Importer" size="sm" onClick={()=>{setHistory(p=>[{date:new Date().toISOString().replace('T',' ').slice(0,16),type:'import',format:importFile.split('.').pop().toUpperCase(),lignes:0,scope:'documents'},...p]);setImportFile(null);}} style={{ marginTop:8 }} />
            </div>}
          </div>
          <div style={{ ...card, padding:20 }}>
            <h4 style={{ margin:'0 0 14px', fontSize:14 }}>Options</h4>
            {['Ignorer les doublons (même ID)','Mettre à jour si existant','Valider le format avant import','Générer un rapport d\'import'].map((o,i) => (
              <label key={i} style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, cursor:'pointer', marginBottom:8 }}><input type="checkbox" defaultChecked={i!==1} />{o}</label>
            ))}
          </div>
        </div>
      )}
      <div style={{ ...card, marginTop:16 }}>
        <div style={{ padding:'12px 16px', borderBottom:`1px solid ${COLORS.border}`, fontSize:12, fontWeight:700, color:COLORS.textSec }}>HISTORIQUE</div>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
          <thead><tr style={{ background:'#f8fafc' }}>{['Date','Action','Format','Périmètre','Lignes'].map((h,i)=><th key={i} style={{ padding:'8px 14px', textAlign:'left', fontSize:11, fontWeight:700, color:COLORS.textSec }}>{h}</th>)}</tr></thead>
          <tbody>{history.map((h,i) => (<tr key={i} style={{ borderBottom:`1px solid ${COLORS.border}` }}><td style={{ padding:'8px 14px' }}>{h.date}</td><td style={{ padding:'8px 14px' }}><Badge label={h.type==='import'?'📥 Import':'📤 Export'} color={h.type==='import'?'#2563eb':'#059669'} /></td><td style={{ padding:'8px 14px', fontFamily:'monospace' }}>{h.format}</td><td style={{ padding:'8px 14px' }}>{h.scope}</td><td style={{ padding:'8px 14px' }}>{h.lignes}</td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   11. ACCÈS & RÔLES
═══════════════════════════════════════════════════════════════ */
function AccessManager({ users, isMobile }) {
  const [permsMap, setPermsMap] = useState({
    admin:PERMISSIONS.map(p=>p.id), gestionnaire:['lib_enregistrer','lib_modifier','lib_consulter','lib_rechercher','lib_courrier','lib_export'],
    agent_courrier:['lib_consulter','lib_courrier'], consultant:['lib_consulter','lib_rechercher'], auditeur:['lib_consulter','lib_rechercher','lib_reporting','lib_audit'],
  });
  const togglePerm = (r,p) => setPermsMap(prev => { const cur = prev[r]||[]; return {...prev, [r]: cur.includes(p) ? cur.filter(x=>x!==p) : [...cur, p] }; });

  return (
    <div>
      <div style={{ marginBottom:16 }}><p style={{ margin:0, fontSize:13, color:COLORS.textMut }}>Matrice des permissions par rôle</p></div>
      <div style={{ ...card, overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12, minWidth:700 }}>
          <thead><tr style={{ background:COLORS.primaryLighter }}>
            <th style={{ padding:'10px 14px', textAlign:'left', fontSize:11, fontWeight:700, color:COLORS.textSec, position:'sticky', left:0, background:COLORS.primaryLighter }}>Permission</th>
            {DEFAULT_ROLES.map(r=><th key={r.id} style={{ padding:'10px 14px', textAlign:'center', fontSize:11, fontWeight:700, color:COLORS.textSec }}>{r.label}</th>)}
          </tr></thead>
          <tbody>{PERMISSIONS.map(p => (
            <tr key={p.id} style={{ borderBottom:`1px solid ${COLORS.border}` }}>
              <td style={{ padding:'10px 14px', fontWeight:500, position:'sticky', left:0, background:'#fff' }}><div style={{ display:'flex', alignItems:'center', gap:6 }}><p.icon size={14} color={COLORS.textSec} />{p.label}</div></td>
              {DEFAULT_ROLES.map(r => { const has = (permsMap[r.id]||[]).includes(p.id); return (
                <td key={r.id} style={{ padding:'10px 14px', textAlign:'center' }}>
                  <button onClick={()=>togglePerm(r.id,p.id)} style={{ width:28, height:28, borderRadius:6, border:`1.5px solid ${has?'#059669':COLORS.border}`, background:has?'#ecfdf5':'#fff', cursor:'pointer', display:'inline-flex', alignItems:'center', justifyContent:'center' }}>
                    {has && <Check size={14} color="#059669" strokeWidth={3} />}
                  </button>
                </td>
              ); })}
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   12. CONSERVATION (DUA)
═══════════════════════════════════════════════════════════════ */
function ConservationManager({ docTypes, isMobile }) {
  const types = docTypes.length > 0 ? docTypes : [];
  return (
    <div>
      <div style={{ marginBottom:16 }}><p style={{ margin:0, fontSize:13, color:COLORS.textMut }}>Durées d'Utilité Administrative par type</p></div>
      <div style={card}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead><tr style={{ background:COLORS.primaryLighter }}>{['Type','DUA Active','DUA Interméd.','Total','Sort final',''].map((h,i)=><th key={i} style={{ padding:'10px 14px', textAlign:'left', fontSize:11, fontWeight:700, color:COLORS.textSec }}>{h}</th>)}</tr></thead>
          <tbody>{types.map(t => {
            const total = (t.dureeActive||0)+(t.dureeInter||0);
            return (<tr key={t.id} style={{ borderBottom:`1px solid ${COLORS.border}` }}>
              <td style={{ padding:'10px 14px', fontWeight:600 }}>{t.icon} {t.label}</td>
              <td style={{ padding:'10px 14px' }}>{t.dureeActive} ans</td>
              <td style={{ padding:'10px 14px' }}>{t.dureeInter} ans</td>
              <td style={{ padding:'10px 14px', fontWeight:700 }}>{total} ans</td>
              <td style={{ padding:'10px 14px' }}><Badge label={SORT_FINALS.find(s=>s.id===t.sort)?.label||'—'} color={t.sort==='conservation'?'#059669':t.sort==='destruction'?'#dc2626':'#d97706'} /></td>
              <td style={{ padding:'10px 14px' }}><div style={{ width:100, height:6, background:'#e2e8f0', borderRadius:3 }}><div style={{ width:`${Math.min(100,((t.dureeActive||0)/total)*100)}%`, height:'100%', background:COLORS.primary, borderRadius:3 }} /></div></td>
            </tr>);
          })}</tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   13. JOURNAL D'AUDIT
═══════════════════════════════════════════════════════════════ */
function AuditLogViewer({ auditLogs: initial, isMobile }) {
  const logs = initial.length > 0 ? initial : [
    { id:'AUD-001', date:'2025-02-28 17:45', action:'Modification type doc.', detail:'DOC-TYP-01 — DUA modifiée: 3→5 ans', auteur:'Razafy Pierre', module:'Administration' },
    { id:'AUD-002', date:'2025-02-28 15:30', action:'Création contenant', detail:'CNT-012 — Boîte Correspondance 2025', auteur:'Ratsimbazafy Noro', module:'Contenants' },
    { id:'AUD-003', date:'2025-02-28 11:00', action:'Consultation document', detail:'DOC-2025-0135 — Dossier client BNI', auteur:'Randria Marie-Claire', module:'Consultations' },
    { id:'AUD-004', date:'2025-02-27 16:00', action:'Scellage contenant', detail:'CNT-006 — Boîte Paie 2024', auteur:'Razafy Pierre', module:'Contenants' },
    { id:'AUD-005', date:'2025-02-27 14:30', action:'Enregistrement doc.', detail:'DOC-2025-0095 — Correspondance Ministère', auteur:'Rakoto Jean-Baptiste', module:'Documents' },
    { id:'AUD-006', date:'2025-02-26 10:00', action:'Transfert contenant', detail:'CNT-008 — vers archives juridiques', auteur:'Rakoto Jean-Baptiste', module:'Contenants' },
    { id:'AUD-007', date:'2025-02-25 09:30', action:'Validation consultation', detail:'CONS-2025-0004 — Approuvée', auteur:'Razafy Pierre', module:'Consultations' },
    { id:'AUD-008', date:'2025-02-24 15:00', action:'Sortie document', detail:'DOC-2025-0138 — Prêté à Comptabilité', auteur:'Ratsimbazafy Noro', module:'Consultations' },
    { id:'AUD-009', date:'2025-02-22 14:00', action:'Sauvegarde manuelle', detail:'Backup complet — 2.3 Mo', auteur:'Razafy Pierre', module:'Administration' },
    { id:'AUD-010', date:'2025-02-20 10:00', action:'Import données', detail:'45 documents importés depuis CSV', auteur:'Rakoto Jean-Baptiste', module:'Import/Export' },
  ];
  const [search, setSearch] = useState('');
  const [moduleF, setModuleF] = useState('all');
  const modules = [...new Set(logs.map(l => l.module))];
  const filtered = logs.filter(l => { if (moduleF !== 'all' && l.module !== moduleF) return false; if (search) { const s = search.toLowerCase(); return l.action.toLowerCase().includes(s) || l.detail.toLowerCase().includes(s) || l.auteur.toLowerCase().includes(s); } return true; });
  const AC = { 'Modification':'#d97706', 'Création':'#059669', 'Consultation':'#2563eb', 'Scellage':'#7c3aed', 'Enregistrement':'#059669', 'Transfert':'#0891b2', 'Validation':'#059669', 'Sortie':'#dc2626', 'Sauvegarde':'#4f46e5', 'Import':'#0891b2' };
  const gc = (a) => Object.entries(AC).find(([k]) => a.includes(k))?.[1] || COLORS.textSec;

  return (
    <div>
      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        <div style={{ flex:1, minWidth:200, position:'relative' }}><Search size={15} style={{ position:'absolute', left:10, top:11, color:COLORS.textMut }} /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher..." style={{ ...inp, paddingLeft:32 }} /></div>
        <select value={moduleF} onChange={e=>setModuleF(e.target.value)} style={{ ...inp, width:'auto' }}><option value="all">Tous modules</option>{modules.map(m => <option key={m} value={m}>{m}</option>)}</select>
      </div>
      <div style={card}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
          <thead><tr style={{ background:COLORS.primaryLighter }}>{['Date','Action','Détail','Auteur','Module'].map((h,i)=><th key={i} style={{ padding:'10px 14px', textAlign:'left', fontSize:11, fontWeight:700, color:COLORS.textSec }}>{h}</th>)}</tr></thead>
          <tbody>{filtered.map(l => (
            <tr key={l.id} style={{ borderBottom:`1px solid ${COLORS.border}` }}>
              <td style={{ padding:'10px 14px', fontFamily:'monospace', fontSize:11, whiteSpace:'nowrap' }}>{l.date}</td>
              <td style={{ padding:'10px 14px' }}><span style={{ fontWeight:600, color:gc(l.action) }}>{l.action}</span></td>
              <td style={{ padding:'10px 14px', color:COLORS.textSec, maxWidth:300, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{l.detail}</td>
              <td style={{ padding:'10px 14px', fontWeight:500 }}>{l.auteur}</td>
              <td style={{ padding:'10px 14px' }}><Badge label={l.module} color={COLORS.textSec} /></td>
            </tr>
          ))}</tbody>
        </table>
        {filtered.length === 0 && <div style={{ padding:40, textAlign:'center', color:COLORS.textMut }}>Aucun événement trouvé</div>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   UTILITAIRE
═══════════════════════════════════════════════════════════════ */
function IcoBtn({ icon: Icon, color, title, onClick }) {
  return (
    <button onClick={onClick} title={title}
      style={{ width:30, height:30, borderRadius:6, border:'none', background:'transparent', cursor:'pointer', display:'inline-flex', alignItems:'center', justifyContent:'center', transition:'background .15s' }}
      onMouseEnter={e => e.currentTarget.style.background='#f1f5f9'} onMouseLeave={e => e.currentTarget.style.background='transparent'}>
      <Icon size={15} color={color} />
    </button>
  );
}
