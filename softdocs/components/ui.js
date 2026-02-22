import { STATUS, bdg, WH, MUT, P, PLt, BD, R, RSm, TR } from "./data";

// ─── Icons ───────────────────────────────────────────
export const IC = {
  dash:   <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  upload: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  search: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  folder: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  money:  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  cog:    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41M1 12h2M21 12h2M12 1v2M12 21v2"/></svg>,
  users:  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  bell:   <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  chk:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  x:      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  chev:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  lock:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  eye:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  edit:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash:  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6m4-6v6"/></svg>,
  plus:   <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  map:    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>,
  link:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  xml:    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="12" y1="2" x2="12" y2="22" strokeDasharray="3 3"/></svg>,
  menu:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  dl:     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  rot:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  send:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
};

// ─── Badge ───────────────────────────────────────────
export function Bdg({ s, sm }) {
  const c = STATUS[s] || { bg:"#f1f5f9", fg:MUT };
  return (
    <span style={bdg(c.bg, c.fg, { fontSize: sm ? 10 : 11, padding: sm ? "2px 7px" : "3px 10px" })}>
      {s}
    </span>
  );
}

// ─── Avatar ──────────────────────────────────────────
export function Av({ uid, users, size = 30 }) {
  const u = users.find(x => x.id === uid);
  if (!u) return <span style={{ fontSize: 12, color: MUT }}>{uid}</span>;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:7, fontSize:13 }}>
      <span style={{ width:size, height:size, borderRadius:"50%", background:`linear-gradient(135deg,${P},${PLt})`, color:WH, display:"inline-flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:size>26?11:10, flexShrink:0 }}>
        {u.init}
      </span>
      <span style={{ fontWeight:600 }}>{u.nom}</span>
    </span>
  );
}

// ─── Modal ───────────────────────────────────────────
export function Modal({ title, children, onClose, w = 640, footer }) {
  return (
    <div
      style={{ position:"fixed", inset:0, background:"rgba(15,23,42,.55)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:20, backdropFilter:"blur(3px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background:WH, borderRadius:16, width:"100%", maxWidth:w, maxHeight:"92vh", display:"flex", flexDirection:"column", boxShadow:"0 8px 24px rgba(20,29,48,.20), 0 16px 48px rgba(20,29,48,.12)", animation:"fadeIn .2s ease" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 22px", borderBottom:`1px solid ${BD}`, background:`linear-gradient(90deg,${P},${PLt})`, borderRadius:"16px 16px 0 0" }}>
          <span style={{ color:WH, fontWeight:700, fontSize:16 }}>{title}</span>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,.15)", border:"none", borderRadius:8, color:WH, width:30, height:30, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            {IC.x}
          </button>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:22 }}>{children}</div>
        {footer && (
          <div style={{ padding:"13px 22px", borderTop:`1px solid ${BD}`, display:"flex", justifyContent:"flex-end", gap:10, background:"#fafbfe", borderRadius:"0 0 16px 16px" }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Form Group ──────────────────────────────────────
export function FG({ label, children, req, span = 1 }) {
  return (
    <div style={{ gridColumn:`span ${span}`, marginBottom:14 }}>
      <label style={{ fontSize:11, fontWeight:700, color:"#475569", marginBottom:5, display:"block", textTransform:"uppercase", letterSpacing:".06em" }}>
        {label}{req && <span style={{ color:"#dc2626" }}> *</span>}
      </label>
      {children}
    </div>
  );
}

// ─── Section Title ───────────────────────────────────
export function SecTitle({ children, icon }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:11, fontWeight:700, color:P, textTransform:"uppercase", letterSpacing:".07em", marginBottom:14, paddingBottom:8, borderBottom:`2px solid #eef1f8` }}>
      {icon && <span style={{ color:P, display:"flex" }}>{icon}</span>}
      {children}
    </div>
  );
}

// ─── Card Header ─────────────────────────────────────
export function CardHead({ title, color = P, right }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 20px", background:`linear-gradient(90deg,${color},${color}cc)`, borderRadius:"12px 12px 0 0" }}>
      <span style={{ color:WH, fontWeight:700, fontSize:15 }}>{title}</span>
      {right && <div style={{ display:"flex", gap:8, alignItems:"center" }}>{right}</div>}
    </div>
  );
}

// ─── Stat Card ───────────────────────────────────────
export function StatCard({ icon, value, label, color = P, sub }) {
  return (
    <div style={{ background:WH, borderRadius:12, boxShadow:"0 1px 3px rgba(50,67,114,0.08), 0 4px 16px rgba(50,67,114,0.06)", border:"1px solid #e2e8f0", borderLeft:`4px solid ${color}`, padding:"16px 18px", display:"flex", alignItems:"center", gap:14, transition:TR }}>
      <div style={{ width:46, height:46, borderRadius:10, background:color+"18", display:"flex", alignItems:"center", justifyContent:"center", color, fontSize:20, flexShrink:0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize:10, fontWeight:700, color:MUT, textTransform:"uppercase", letterSpacing:".05em", marginBottom:3 }}>{label}</div>
        <div style={{ fontSize:24, fontWeight:900, color:"#1a2035", lineHeight:1 }}>{value}</div>
        {sub && <div style={{ fontSize:11, color:MUT, marginTop:2 }}>{sub}</div>}
      </div>
    </div>
  );
}

// ─── Filter Bar ──────────────────────────────────────
export function FilterBar({ f, setF, types, PROJETS, ALL_SITES, inp, sel }) {
  return (
    <div style={{ padding:"12px 18px", background:"#fafbfe", borderBottom:"1px solid #e2e8f0", display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 1fr", gap:10, alignItems:"end" }}>
      <div>
        <label style={{ fontSize:11, fontWeight:700, color:"#475569", marginBottom:5, display:"block", textTransform:"uppercase", letterSpacing:".06em" }}>Recherche</label>
        <input style={inp()} value={f.s} onChange={e=>setF({...f,s:e.target.value})} placeholder="ID, fournisseur, numéro..."/>
      </div>
      <div>
        <label style={{ fontSize:11, fontWeight:700, color:"#475569", marginBottom:5, display:"block", textTransform:"uppercase", letterSpacing:".06em" }}>Projet</label>
        <select style={sel()} value={f.p} onChange={e=>setF({...f,p:e.target.value})}>
          <option value="">Tous</option>
          {PROJETS.map(p=><option key={p.id} value={p.id}>{p.id}</option>)}
        </select>
      </div>
      <div>
        <label style={{ fontSize:11, fontWeight:700, color:"#475569", marginBottom:5, display:"block", textTransform:"uppercase", letterSpacing:".06em" }}>Site</label>
        <select style={sel()} value={f.si} onChange={e=>setF({...f,si:e.target.value})}>
          <option value="">Tous</option>
          {ALL_SITES.map(s=><option key={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label style={{ fontSize:11, fontWeight:700, color:"#475569", marginBottom:5, display:"block", textTransform:"uppercase", letterSpacing:".06em" }}>Type</label>
        <select style={sel()} value={f.t} onChange={e=>setF({...f,t:e.target.value})}>
          <option value="">Tous</option>
          {types.map(t=><option key={t.id} value={t.nom}>{t.nom}</option>)}
        </select>
      </div>
      <div>
        <label style={{ fontSize:11, fontWeight:700, color:"#475569", marginBottom:5, display:"block", textTransform:"uppercase", letterSpacing:".06em" }}>Expéditeur</label>
        <select style={sel()} value={f.ex} onChange={e=>setF({...f,ex:e.target.value})}>
          <option value="">Tous</option>
          {["Fournisseur","Interne","Confidentiel"].map(t=><option key={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label style={{ fontSize:11, fontWeight:700, color:"#475569", marginBottom:5, display:"block", textTransform:"uppercase", letterSpacing:".06em" }}>Date</label>
        <input type="date" style={inp()} value={f.d} onChange={e=>setF({...f,d:e.target.value})}/>
      </div>
    </div>
  );
}
