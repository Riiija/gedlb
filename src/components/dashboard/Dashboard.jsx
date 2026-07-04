"use client";
import{useState}from"react";
import{BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,PieChart,Pie,Cell,LineChart,Line,Legend}from"recharts";
import{useApp}from"../../context/AppContext";
import{fmtN}from"../../lib/utils";
import{P,PLt,WH,BD,SUCL,SUCD,DNGL,DNGD,MUT,card,bdg,TR}from"../../lib/theme";
import{Badge}from"../ui/Badge";
import{useIsMobile}from"../../lib/useResponsive";
import{IC}from"../ui/Icons";

const COLORS=["#324372","#1ecad3","#28a745","#f5a623","#dc3545","#6c757d","#a855f7","#0ea5e9"];
const ST_COL={"REÇU":"#17a2b8","EN VALIDATION":"#f5a623","VALIDÉ":"#28a745","REJETÉ":"#dc3545","BON À PAYER":"#1ecad3","PAYÉ":"#0ea5e9","EN RETARD":"#e11d48","ARCHIVÉ":"#6c757d"};

function KPI({label,value,sub,color,icon}){
  return(
    <div style={{...card(),padding:"18px 20px",borderLeft:"4px solid "+color}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
        <span style={{display:"flex",color,width:20}}>{IC[icon]||IC.file}</span>
        <span style={{fontSize:11,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".06em"}}>{label}</span>
      </div>
      <div style={{fontSize:24,fontWeight:900,color,lineHeight:1.1}}>{value}</div>
      {sub&&<div style={{fontSize:11.5,color:MUT,marginTop:3}}>{sub}</div>}
    </div>
  );
}

function Bar100({label,val,max,color}){
  const pct=max>0?Math.round(val/max*100):0;
  return(
    <div style={{marginBottom:10}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
        <span style={{fontSize:12,color:"#495057",fontWeight:500}}>{label}</span>
        <span style={{fontSize:12,fontWeight:700,color:"#212529"}}>{val} <span style={{color:MUT}}>({pct}%)</span></span>
      </div>
      <div style={{background:"#e9ecef",borderRadius:4,height:6}}>
        <div style={{width:pct+"%",height:"100%",background:color||P,borderRadius:4}}/>
      </div>
    </div>
  );
}

function Sh({title,sub}){
  return(
    <div style={{marginBottom:14}}>
      <div style={{fontSize:13,fontWeight:700,color:"#212529"}}>{title}</div>
      {sub&&<div style={{fontSize:11.5,color:MUT,marginTop:2}}>{sub}</div>}
    </div>
  );
}

/* ─── TAB PILOTAGE ─── */

/* ─── Relances Feed ─── */
function RelancesFeed({docs,onOpen}){
  // Collect all relance entries across all docs
  const entries=[];
  (docs||[]).forEach(doc=>{
    (doc.historique||[]).forEach(h=>{
      if(h.type==="relance"){
        entries.push({...h,doc});
      }
    });
  });
  entries.sort((a,b)=>new Date(b.date)-new Date(a.date));
  const latest=entries.slice(0,8);
  if(latest.length===0)return(
    <div style={{textAlign:"center",padding:"20px 0",color:"#94a3b8",fontSize:12}}>
      <div style={{fontSize:20,marginBottom:6}}>📭</div>
      Aucune relance envoyée
    </div>
  );
  return(
    <div>
      {latest.map((e,i)=>(
        <div key={i} onClick={()=>onOpen&&onOpen(e.doc,"en-cours")}
          style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 4px",borderBottom:"1px solid #f0f2f5",cursor:"pointer",borderRadius:4}}
          onMouseEnter={ev=>ev.currentTarget.style.background="#fff8f0"}
          onMouseLeave={ev=>ev.currentTarget.style.background="transparent"}>
          {/* Icon */}
          <div style={{width:30,height:30,borderRadius:8,background:"#fff7ed",border:"1px solid #fed7aa",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2.2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
              <span style={{fontSize:12,fontWeight:700,color:"#212529",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.doc?.id||"—"}</span>
              <span style={{fontSize:10,background:"#fff7ed",color:"#ea580c",padding:"1px 7px",borderRadius:8,fontWeight:700,flexShrink:0}}>Relancé</span>
            </div>
            <div style={{fontSize:11,color:"#64748b",marginTop:2}}>Étape : <b>{e.etape||"—"}</b></div>
            <div style={{fontSize:10.5,color:"#94a3b8",marginTop:1}}>Par {e.par} · {e.date}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TabPilotage({docs,setView,openDoc}){
  const total=docs.length;
  const enCours=docs.filter(d=>["EN VALIDATION","EN RETARD"].includes(d.st)).length;
  const valides=docs.filter(d=>["VALIDÉ","BON À PAYER","PAYÉ"].includes(d.st)).length;
  const retards=docs.filter(d=>d.st==="EN RETARD").length;
  const bap=docs.filter(d=>d.bap&&d.st==="BON À PAYER").length;
  const mtTotal=docs.reduce((s,d)=>s+(d.mtR||0),0);
  const mtBap=docs.filter(d=>d.bap).reduce((s,d)=>s+(d.mtR||0),0);
  const stData=["REÇU","EN VALIDATION","VALIDÉ","REJETÉ","BON À PAYER","PAYÉ","EN RETARD"].map(s=>({name:s,v:docs.filter(d=>d.st===s).length,color:ST_COL[s]})).filter(x=>x.v>0);
  const bySite=[...new Set(docs.map(d=>d.site).filter(Boolean))].map(s=>({name:s,v:docs.filter(d=>d.site===s).length})).sort((a,b)=>b.v-a.v);
  const byType=[...new Set(docs.map(d=>d.type))].map(t=>({name:t,v:docs.filter(d=>d.type===t).length})).sort((a,b)=>b.v-a.v).slice(0,7);
  const monthly=[{m:"Oct",r:3,v:2,e:0},{m:"Nov",r:4,v:3,e:1},{m:"Déc",r:5,v:4,e:1},{m:"Jan",r:total,v:valides,e:retards}];
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"repeat(2,1fr)":"repeat(4,1fr)",gap:12,marginBottom:12}}>
        <KPI icon="file" value={total} label="Total documents" color="#324372" sub="+12% ce mois"/>
        <KPI icon="clock" value={enCours} label="En cours" color="#f5a623"/>
        <KPI icon="checkCircle" value={valides} label="Validés" color="#28a745" sub="+8%"/>
        <KPI icon="alertTri" value={retards} label="En retard" color="#dc3545"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"repeat(3,1fr)",gap:12,marginBottom:14}}>
        <KPI icon="creditCard" value={bap} label="Bon à payer" color="#1ecad3"/>
        <KPI icon="money" value={fmtN(mtTotal)} label="Montant total engagé" color="#4a5e96" sub="Ar"/>
        <KPI icon="money" value={fmtN(mtBap)} label="Montant à payer" color="#28a745" sub="Ar"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"2fr 1fr",gap:14,marginBottom:14}}>
        <div style={{...card(),padding:20}}>
          <Sh title="Évolution mensuelle" sub="Reçus / Validés / Retards"/>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={monthly} barSize={12}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
              <XAxis dataKey="m" tick={{fontSize:12,fill:"#6c757d"}}/>
              <YAxis tick={{fontSize:12,fill:"#6c757d"}} allowDecimals={false}/>
              <Tooltip contentStyle={{fontSize:12,borderRadius:6}}/>
              <Legend iconSize={9} wrapperStyle={{fontSize:11}}/>
              <Bar dataKey="r" fill={P} radius={[3,3,0,0]} name="Reçus"/>
              <Bar dataKey="v" fill="#28a745" radius={[3,3,0,0]} name="Validés"/>
              <Bar dataKey="e" fill="#dc3545" radius={[3,3,0,0]} name="Retards"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{...card(),padding:20}}>
          <Sh title="Statuts"/>
          <ResponsiveContainer width="100%" height={120}><PieChart><Pie data={stData} cx="50%" cy="50%" innerRadius={28} outerRadius={50} dataKey="v" paddingAngle={2}>{stData.map((e,i)=><Cell key={i} fill={e.color}/>)}</Pie><Tooltip contentStyle={{fontSize:11}}/></PieChart></ResponsiveContainer>
          <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr",gap:3,marginTop:6}}>
            {stData.map(e=><div key={e.name} style={{display:"flex",alignItems:"center",gap:4,fontSize:10.5}}><span style={{width:6,height:6,borderRadius:"50%",background:e.color,flexShrink:0}}/><span style={{color:MUT,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.name}</span><b style={{marginLeft:"auto",color:"#212529"}}>{e.v}</b></div>)}
          </div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr 1fr",gap:14,marginBottom:14}}>
        <div style={{...card(),padding:20}}><Sh title="Par site"/>{bySite.map(s=><Bar100 key={s.name} label={s.name} val={s.v} max={Math.max(...bySite.map(x=>x.v))} color={PLt}/>)}</div>
        <div style={{...card(),padding:20}}><Sh title="Par type de document"/>{byType.map((t,i)=><Bar100 key={t.name} label={t.name} val={t.v} max={Math.max(...byType.map(x=>x.v))} color={COLORS[i%COLORS.length]}/>)}</div>
        <div style={{...card(),padding:20}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <span style={{fontSize:13,fontWeight:700,color:"#212529"}}>Récents</span>
            <button onClick={()=>setView("en-cours")} style={{fontSize:11.5,color:P,background:"none",border:"none",cursor:"pointer",fontWeight:600}}>Voir tout →</button>
          </div>
          {docs.slice(-6).reverse().map(d=>(
            <div key={d.id} onClick={()=>openDoc(d,"en-cours")} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 4px",borderBottom:"1px solid #f0f2f5",cursor:"pointer",borderRadius:4}} onMouseEnter={e=>e.currentTarget.style.background="#f8f9fc"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:600,color:"#212529",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.id}</div><div style={{fontSize:10.5,color:MUT}}>{d.fourn||d.type}</div></div>
              <Badge s={d.st} sm/>
            </div>
          ))}
        </div>
      </div>
      {/* ── Relances ── */}
      <div style={{...card(),padding:20}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:28,height:28,borderRadius:7,background:"#fff7ed",border:"1px solid #fed7aa",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2.2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
            <span style={{fontSize:13,fontWeight:700,color:"#212529"}}>Relances envoyées</span>
            {(()=>{const n=docs.flatMap(d=>(d.historique||[]).filter(h=>h.type==="relance")).length;return n>0?<span style={{fontSize:10,background:"#fff7ed",color:"#ea580c",padding:"1px 8px",borderRadius:10,fontWeight:800}}>{n}</span>:null;})()}
          </div>
        </div>
        <RelancesFeed docs={docs} onOpen={openDoc}/>
      </div>
    </div>
  );
}

/* ─── TAB WORKFLOW ─── */

/* ── Excel CSV export helper ── */
function exportCSV(rows, headers, filename) {
  const esc = v => '"' + String(v ?? "").replace(/"/g, '""') + '"';
  const lines = [headers.map(esc).join(","), ...rows.map(r => r.map(esc).join(","))];
  const blob = new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

/* ── WorkflowTable: Documents en attente avec filtre/recherche/export ── */
function WorkflowTable({ actifs }) {
  const [search, setSearch] = useState("");
  const [filterSt, setFilterSt] = useState("");
  const STATUTS = [...new Set(actifs.map(d => d.st).filter(Boolean))];

  const filtered = actifs.filter(d => {
    const q = search.toLowerCase();
    const matchSearch = !q || d.id?.toLowerCase().includes(q) || d.type?.toLowerCase().includes(q) || (d.fourn || "").toLowerCase().includes(q);
    const matchSt = !filterSt || d.st === filterSt;
    return matchSearch && matchSt;
  });

  function doExport() {
    const headers = ["Référence", "Type", "Fournisseur", "Étape en attente", "Statut"];
    const rows = filtered.map(d => {
      const step = (d.etapes || []).find(e => e.statut === "EN ATTENTE");
      return [d.id, d.type, d.fourn || "", step?.label || "", d.st];
    });
    exportCSV(rows, headers, "workflow_" + new Date().toISOString().slice(0, 10) + ".csv");
  }

  return (
    <div style={{ ...card(), padding: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#212529" }}>Documents en attente de validation</div>
          <div style={{ fontSize: 11.5, color: MUT }}>{filtered.length} / {actifs.length} documents avec circuit actif</div>
        </div>
        <button onClick={doExport}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 6, background: "#1d6f42", color: "#fff", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
          Exporter Excel
        </button>
      </div>

      {/* Filter bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={MUT} strokeWidth="2" strokeLinecap="round"
            style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher référence, type, fournisseur…"
            style={{ width: "100%", padding: "7px 10px 7px 30px", border: "1px solid " + BD, borderRadius: 6, fontSize: 12.5, fontFamily: "inherit", boxSizing: "border-box", outline: "none" }}/>
        </div>
        <select value={filterSt} onChange={e => setFilterSt(e.target.value)}
          style={{ padding: "7px 10px", border: "1px solid " + BD, borderRadius: 6, fontSize: 12.5, fontFamily: "inherit", background: "#fff", minWidth: 140 }}>
          <option value="">Tous les statuts</option>
          {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {(search || filterSt) && (
          <button onClick={() => { setSearch(""); setFilterSt(""); }}
            style={{ padding: "7px 12px", border: "1px solid " + BD, borderRadius: 6, background: "#fff", cursor: "pointer", fontSize: 12, color: MUT, fontFamily: "inherit" }}>
            ✕ Réinitialiser
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8f9fc" }}>
              {["Référence", "Type", "Fournisseur", "Étape en attente", "Statut"].map(h => (
                <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: MUT, textTransform: "uppercase", letterSpacing: ".04em", borderBottom: "1px solid " + BD }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: "20px 0", color: MUT, fontSize: 13 }}>Aucun document trouvé</td></tr>
            )}
            {filtered.map(d => {
              const step = (d.etapes || []).find(e => e.statut === "EN ATTENTE");
              return (
                <tr key={d.id} style={{ borderBottom: "1px solid #f0f2f5" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8f9fc"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "9px 12px", fontSize: 12, fontWeight: 600, color: P }}>{d.id}</td>
                  <td style={{ padding: "9px 12px", fontSize: 12, color: "#495057" }}>{d.type}</td>
                  <td style={{ padding: "9px 12px", fontSize: 12, color: "#495057" }}>{d.fourn || "—"}</td>
                  <td style={{ padding: "9px 12px", fontSize: 12, color: "#212529" }}>{step?.label || "—"}</td>
                  <td style={{ padding: "9px 12px" }}><Badge s={d.st} sm /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── FournisseurTable: tableau récap fournisseurs avec filtre/recherche/export ── */
function FournisseurTable({ byF }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("total");

  const filtered = byF
    .filter(f => !search || f.nom.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b[sortKey] - a[sortKey]);

  function doExport() {
    const headers = ["Fournisseur", "Nb docs", "Montant total (Ar)", "Validés", "Rejetés", "Taux valid. (%)"];
    const rows = filtered.map(f => {
      const taux = f.total > 0 ? Math.round(f.valide / f.total * 100) : 0;
      return [f.nom, f.total, f.mt, f.valide, f.rejete, taux];
    });
    exportCSV(rows, headers, "fournisseurs_" + new Date().toISOString().slice(0, 10) + ".csv");
  }

  return (
    <div style={{ ...card(), padding: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#212529" }}>Tableau récapitulatif fournisseurs</div>
          <div style={{ fontSize: 11.5, color: MUT }}>{filtered.length} fournisseur{filtered.length > 1 ? "s" : ""}</div>
        </div>
        <button onClick={doExport}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 6, background: "#1d6f42", color: "#fff", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
          Exporter Excel
        </button>
      </div>

      {/* Filter bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={MUT} strokeWidth="2" strokeLinecap="round"
            style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un fournisseur…"
            style={{ width: "100%", padding: "7px 10px 7px 30px", border: "1px solid " + BD, borderRadius: 6, fontSize: 12.5, fontFamily: "inherit", boxSizing: "border-box", outline: "none" }}/>
        </div>
        <select value={sortKey} onChange={e => setSortKey(e.target.value)}
          style={{ padding: "7px 10px", border: "1px solid " + BD, borderRadius: 6, fontSize: 12.5, fontFamily: "inherit", background: "#fff" }}>
          <option value="total">Trier par nb docs</option>
          <option value="mt">Trier par montant</option>
          <option value="valide">Trier par validés</option>
          <option value="rejete">Trier par rejetés</option>
        </select>
        {search && (
          <button onClick={() => setSearch("")}
            style={{ padding: "7px 12px", border: "1px solid " + BD, borderRadius: 6, background: "#fff", cursor: "pointer", fontSize: 12, color: MUT, fontFamily: "inherit" }}>
            ✕ Effacer
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8f9fc" }}>
              {["Fournisseur", "Nb docs", "Montant total", "Validés", "Rejetés", "Taux valid."].map(h => (
                <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: MUT, textTransform: "uppercase", letterSpacing: ".04em", borderBottom: "1px solid " + BD }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: "20px 0", color: MUT, fontSize: 13 }}>Aucun fournisseur trouvé</td></tr>
            )}
            {filtered.map(f => {
              const taux = f.total > 0 ? Math.round(f.valide / f.total * 100) : 0;
              return (
                <tr key={f.nom} style={{ borderBottom: "1px solid #f0f2f5" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8f9fc"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "9px 12px", fontSize: 12.5, fontWeight: 600, color: "#212529" }}>{f.nom}</td>
                  <td style={{ padding: "9px 12px", fontSize: 12, color: "#495057" }}>{f.total}</td>
                  <td style={{ padding: "9px 12px", fontSize: 12, color: "#495057" }}>{fmtN(f.mt)} Ar</td>
                  <td style={{ padding: "9px 12px" }}><span style={{ ...bdg(SUCL, SUCD, { fontSize: 11 }), padding: "2px 8px" }}>{f.valide}</span></td>
                  <td style={{ padding: "9px 12px" }}>{f.rejete > 0 ? <span style={{ ...bdg(DNGL, DNGD, { fontSize: 11 }), padding: "2px 8px" }}>{f.rejete}</span> : <span style={{ color: MUT }}>—</span>}</td>
                  <td style={{ padding: "9px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ flex: 1, background: "#e9ecef", height: 5, borderRadius: 3, minWidth: 40 }}>
                        <div style={{ width: taux + "%", height: "100%", background: taux > 70 ? "#28a745" : taux > 40 ? "#f5a623" : "#dc3545", borderRadius: 3 }}/>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: taux > 70 ? "#28a745" : taux > 40 ? "#f5a623" : "#dc3545", flexShrink: 0 }}>{taux}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TabWorkflow({docs,users}){
  const actifs=docs.filter(d=>d.etapes?.some(e=>e.statut==="EN ATTENTE"));
  const rejetes=docs.filter(d=>d.st==="REJETÉ").length;
  const valCom=docs.filter(d=>d.st==="VALIDÉ").length;
  const retards=docs.filter(d=>d.st==="EN RETARD").length;
  const allSteps=docs.flatMap(d=>(d.etapes||[]).map(e=>({...e})));
  const byStep=[...new Set(allSteps.map(e=>e.label))].map(lbl=>{
    const g=allSteps.filter(e=>e.label===lbl);
    return{label:lbl,total:g.length,attente:g.filter(e=>e.statut==="EN ATTENTE").length,valide:g.filter(e=>e.statut==="VALIDÉ").length,rejete:g.filter(e=>e.statut==="REJETÉ").length};
  }).sort((a,b)=>b.total-a.total);
  const byVal=(users||[]).map(u=>{
    const vD=docs.filter(d=>(d.etapes||[]).some(e=>e.v?.includes(u.id)));
    const vOk=docs.filter(d=>(d.etapes||[]).some(e=>e.v?.includes(u.id)&&e.statut==="VALIDÉ"));
    return{id:u.id,nom:u.nom,init:u.init,total:vD.length,done:vOk.length};
  }).filter(u=>u.total>0).sort((a,b)=>b.total-a.total);
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"repeat(2,1fr)":"repeat(4,1fr)",gap:12,marginBottom:14}}>
        <KPI icon="refresh" value={actifs.length} label="Circuits actifs" color="#f5a623"/>
        <KPI icon="checkCircle" value={valCom} label="Validés complets" color="#28a745"/>
        <KPI icon="xCircle" value={rejetes} label="Rejetés" color="#dc3545"/>
        <KPI icon="alertTri" value={retards} label="En retard" color="#e11d48"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr",gap:14,marginBottom:14}}>
        <div style={{...card(),padding:20}}>
          <Sh title="Étapes de validation" sub="Répartition par étape"/>
          {byStep.length===0?<div style={{color:MUT,fontSize:12,textAlign:"center",padding:"20px 0"}}>Aucun circuit</div>:byStep.map(s=>(
            <div key={s.label} style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                <span style={{fontSize:12.5,fontWeight:600,color:"#212529"}}>{s.label}</span>
                <div style={{display:"flex",gap:5}}>
                  <span style={{...bdg(SUCL,SUCD,{fontSize:10}),padding:"1px 7px"}}>{s.valide} ✓</span>
                  {s.attente>0&&<span style={{fontSize:10,background:"#fff8e6",color:"#d97706",padding:"1px 7px",borderRadius:8,fontWeight:700}}>{s.attente} ⏳</span>}
                  {s.rejete>0&&<span style={{...bdg(DNGL,DNGD,{fontSize:10}),padding:"1px 7px"}}>{s.rejete} ✗</span>}
                </div>
              </div>
              <div style={{display:"flex",gap:2,height:6,borderRadius:3,overflow:"hidden"}}>
                <div style={{flex:s.valide||0,background:"#28a745"}}/>
                <div style={{flex:s.attente||0,background:"#f5a623"}}/>
                {s.rejete>0&&<div style={{flex:s.rejete,background:"#dc3545"}}/>}
              </div>
            </div>
          ))}
        </div>
        <div style={{...card(),padding:20}}>
          <Sh title="Charge des valideurs"/>
          {byVal.length===0?<div style={{color:MUT,fontSize:12,textAlign:"center",padding:"20px 0"}}>Aucune donnée</div>:byVal.map(u=>(
            <div key={u.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:P,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff",flexShrink:0}}>{u.init||u.nom?.charAt(0)}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:600,color:"#212529",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.nom}</div>
                <div style={{background:"#e9ecef",height:5,borderRadius:3,marginTop:3}}><div style={{width:Math.max(5,(u.done/Math.max(u.total,1)*100))+"%",height:"100%",background:"#28a745",borderRadius:3}}/></div>
              </div>
              <span style={{fontSize:12,fontWeight:700,color:"#212529",flexShrink:0}}>{u.done}/{u.total}</span>
            </div>
          ))}
        </div>
      </div>
      {/* ── Relances dans le workflow ── */}
      {(()=>{
        const allRelances=docs.flatMap(d=>(d.historique||[]).filter(h=>h.type==="relance").map(h=>({...h,doc:d}))).sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,6);
        if(allRelances.length===0)return null;
        return(
          <div style={{...card(),padding:20,marginBottom:14}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
              <div style={{width:28,height:28,borderRadius:7,background:"#fff7ed",border:"1px solid #fed7aa",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2.2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <span style={{fontSize:13,fontWeight:700,color:"#212529"}}>Dernières relances de validation</span>
              <span style={{fontSize:10,background:"#fff7ed",color:"#ea580c",padding:"1px 8px",borderRadius:10,fontWeight:800}}>{allRelances.length}</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"repeat(3,1fr)",gap:8}}>
              {allRelances.map((e,i)=>(
                <div key={i} style={{background:"#fff8f0",border:"1px solid #fed7aa",borderRadius:8,padding:"10px 12px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                    <span style={{fontSize:12,fontWeight:700,color:"#212529"}}>{e.doc?.id||"—"}</span>
                    <span style={{fontSize:9.5,background:"#ea580c",color:"#fff",padding:"1px 6px",borderRadius:6,fontWeight:700}}>Relancé</span>
                  </div>
                  <div style={{fontSize:11,color:"#64748b"}}>Étape : <b>{e.etape||"—"}</b></div>
                  <div style={{fontSize:10.5,color:"#94a3b8",marginTop:3}}>Par {e.par} · {e.date}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
      <WorkflowTable actifs={actifs}/>
    </div>
  );
}

/* ─── TAB FOURNISSEURS ─── */
function TabFournisseurs({docs}){
  const fourn=[...new Set(docs.map(d=>d.fourn).filter(Boolean))];
  const byF=fourn.map(f=>({nom:f,total:docs.filter(d=>d.fourn===f).length,mt:docs.filter(d=>d.fourn===f).reduce((s,d)=>s+(d.mtR||0),0),valide:docs.filter(d=>d.fourn===f&&["VALIDÉ","BON À PAYER","PAYÉ"].includes(d.st)).length,rejete:docs.filter(d=>d.fourn===f&&d.st==="REJETÉ").length})).sort((a,b)=>b.total-a.total);
  const byType=[...new Set(docs.map(d=>d.type).filter(Boolean))].map(t=>({name:t,mt:docs.filter(d=>d.type===t).reduce((s,d)=>s+(d.mtR||0),0)})).sort((a,b)=>b.mt-a.mt).slice(0,7);
  const byProj=[...new Set(docs.map(d=>d.proj).filter(Boolean))].map(p=>({name:p,mt:docs.filter(d=>d.proj===p).reduce((s,d)=>s+(d.mtR||0),0)})).sort((a,b)=>b.mt-a.mt).slice(0,7);
  const totalMt=docs.filter(d=>d.fourn).reduce((s,d)=>s+(d.mtR||0),0);
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"repeat(2,1fr)":"repeat(4,1fr)",gap:12,marginBottom:14}}>
        <KPI icon="users" value={fourn.length} label="Fournisseurs actifs" color="#324372"/>
        <KPI icon="file" value={docs.filter(d=>d.fourn).length} label="Documents soumis" color="#1ecad3"/>
        <KPI icon="money" value={fmtN(totalMt)} label="Montant total" color="#28a745" sub="Ar"/>
        <KPI icon="checkCircle" value={byF.reduce((s,f)=>s+f.valide,0)} label="Docs validés" color="#f5a623"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr",gap:14,marginBottom:14}}>
        <div style={{...card(),padding:20}}>
          <Sh title="Top fournisseurs — Nb documents"/>
          {byF.slice(0,7).map((f,i)=>(
            <div key={f.nom} style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <span style={{fontSize:11,fontWeight:700,color:MUT,width:18,textAlign:"right",flexShrink:0}}>#{i+1}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12.5,fontWeight:600,color:"#212529",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.nom}</div>
                <div style={{background:"#e9ecef",height:5,borderRadius:3,marginTop:3}}><div style={{width:(f.total/Math.max(...byF.map(x=>x.total))*100)+"%",height:"100%",background:COLORS[i%COLORS.length],borderRadius:3}}/></div>
              </div>
              <span style={{fontSize:12,fontWeight:700,color:"#212529",flexShrink:0}}>{f.total}</span>
            </div>
          ))}
        </div>
        <div style={{...card(),padding:20}}>
          <Sh title="Top fournisseurs — Montant engagé"/>
          {[...byF].sort((a,b)=>b.mt-a.mt).slice(0,7).map((f,i)=>(
            <div key={f.nom} style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <span style={{fontSize:11,fontWeight:700,color:MUT,width:18,textAlign:"right",flexShrink:0}}>#{i+1}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12.5,fontWeight:600,color:"#212529",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.nom}</div>
                <div style={{fontSize:11,color:MUT}}>{fmtN(f.mt)} Ar</div>
              </div>
              <div style={{display:"flex",gap:3,flexShrink:0}}>
                <span style={{...bdg(SUCL,SUCD,{fontSize:10}),padding:"1px 6px"}}>{f.valide}✓</span>
                {f.rejete>0&&<span style={{...bdg(DNGL,DNGD,{fontSize:10}),padding:"1px 6px"}}>{f.rejete}✗</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <FournisseurTable byF={byF}/>
      <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr",gap:14}}>
        <div style={{...card(),padding:20}}><Sh title="Montants par type de document"/>{byType.map((t,i)=><Bar100 key={t.name} label={t.name} val={fmtN(t.mt)} max={Math.max(...byType.map(x=>x.mt))||1} color={COLORS[i%COLORS.length]}/>)}</div>
        <div style={{...card(),padding:20}}><Sh title="Montants par projet"/>{byProj.length===0?<div style={{color:MUT,fontSize:12,textAlign:"center",padding:"20px 0"}}>Aucun projet renseigné</div>:byProj.map((p,i)=><Bar100 key={p.name} label={p.name} val={fmtN(p.mt)} max={Math.max(...byProj.map(x=>x.mt))||1} color={COLORS[i%COLORS.length]}/>)}</div>
      </div>
    </div>
  );
}

/* ─── TAB FINANCIER ─── */
function TabFinancier({docs}){
  const paid=docs.filter(d=>["PAYÉ","BON À PAYER"].includes(d.st));
  const totalMt=docs.reduce((s,d)=>s+(d.mtR||0),0);
  const paidMt=paid.reduce((s,d)=>s+(d.mtR||0),0);
  const enCoursMt=docs.filter(d=>d.st==="EN VALIDATION"||d.st==="EN RETARD").reduce((s,d)=>s+(d.mtR||0),0);
  const rejeteMt=docs.filter(d=>d.st==="REJETÉ").reduce((s,d)=>s+(d.mtR||0),0);
  const recuMt=docs.filter(d=>d.st==="REÇU").reduce((s,d)=>s+(d.mtR||0),0);

  const byMonth=[];
  docs.forEach(d=>{
    if(!d.date)return;
    const parts=d.date.split("/");
    const m=parts.length===3?`${parts[1]}/${parts[2]}`:"?";
    let entry=byMonth.find(e=>e.name===m);
    if(!entry){entry={name:m,mt:0,nb:0};byMonth.push(entry);}
    entry.mt+=(d.mtR||0); entry.nb++;
  });
  byMonth.sort((a,b)=>a.name.localeCompare(b.name));

  const bySt=[
    {name:"Payé / BAP",mt:paidMt,color:"#28a745"},
    {name:"En cours",mt:enCoursMt,color:"#f5a623"},
    {name:"Reçu",mt:recuMt,color:"#0ea5e9"},
    {name:"Rejeté",mt:rejeteMt,color:"#dc3545"},
  ].filter(s=>s.mt>0);

  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"repeat(2,1fr)":"repeat(4,1fr)",gap:12,marginBottom:14}}>
        <KPI icon="money" value={fmtN(totalMt)} label="Montant total" color="#324372" sub="Ar"/>
        <KPI icon="checkCircle" value={fmtN(paidMt)} label="Payé / BAP" color="#28a745" sub="Ar"/>
        <KPI icon="clock" value={fmtN(enCoursMt)} label="En cours" color="#f5a623" sub="Ar"/>
        <KPI icon="xCircle" value={fmtN(rejeteMt)} label="Rejeté" color="#dc3545" sub="Ar"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr",gap:14,marginBottom:14}}>
        <div style={{...card(),padding:20}}>
          <Sh title="Répartition par statut"/>
          {bySt.map((s,i)=><Bar100 key={s.name} label={s.name} val={fmtN(s.mt)} max={Math.max(...bySt.map(x=>x.mt))||1} color={s.color}/>)}
        </div>
        <div style={{...card(),padding:20}}>
          <Sh title="Évolution mensuelle"/>
          {byMonth.length===0
            ?<div style={{color:MUT,fontSize:12,textAlign:"center",padding:"20px 0"}}>Aucune donnée</div>
            :byMonth.map((m,i)=><Bar100 key={m.name} label={m.name} val={fmtN(m.mt)} max={Math.max(...byMonth.map(x=>x.mt))||1} color={COLORS[i%COLORS.length]}/>)
          }
        </div>
      </div>
      {/* Top 10 docs par montant */}
      <div style={{...card(),padding:20}}>
        <Sh title="Top documents par montant"/>
        <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{background:"#f8f9fa"}}>
            {["#","Document","Type","Fournisseur","Statut","Montant"].map(h=><th key={h} style={{padding:"8px 10px",textAlign:"left",fontWeight:700,color:MUT,borderBottom:"2px solid #dee2e6"}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {[...docs].sort((a,b)=>(b.mtR||0)-(a.mtR||0)).slice(0,10).map((d,i)=>(
              <tr key={d.id} style={{borderBottom:"1px solid #f0f0f0"}}>
                <td style={{padding:"7px 10px",color:MUT,fontWeight:700}}>#{i+1}</td>
                <td style={{padding:"7px 10px",fontWeight:600,color:"#212529"}}>{d.id}</td>
                <td style={{padding:"7px 10px",color:"#495057"}}>{d.type||"—"}</td>
                <td style={{padding:"7px 10px",color:"#495057"}}>{d.fourn||"—"}</td>
                <td style={{padding:"7px 10px"}}><span style={{...bdg(d.st==="REJETÉ"?DNGL:d.st==="EN VALIDATION"?"#fff8e6":SUCL,d.st==="REJETÉ"?DNGD:d.st==="EN VALIDATION"?"#856404":SUCD,{fontSize:10}),padding:"2px 8px"}}>{d.st}</span></td>
                <td style={{padding:"7px 10px",fontWeight:700,color:"#212529",textAlign:"right"}}>{fmtN(d.mtR||0)} Ar</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

/* ─── TAB PROJETS ─── */
function TabProjet({docs,projets}){
  const byP=(projets||[]).map(p=>{
    const pd=docs.filter(d=>d.proj===p.id);
    const mt=pd.reduce((s,d)=>s+(d.mtR||0),0);
    const pct=p.budget>0?Math.round(mt/p.budget*100):0;
    return{...p,pd,mt,pct,valide:pd.filter(d=>["VALIDÉ","BON À PAYER","PAYÉ"].includes(d.st)).length,fourns:[...new Set(pd.map(d=>d.fourn).filter(Boolean))],nbDocs:pd.length};
  });
  const chartData=byP.map(p=>({name:p.nom.slice(0,12),docs:p.nbDocs,mt:Math.round(p.mt/1e6)}));
  const totalBudget=(projets||[]).reduce((s,p)=>s+(p.budget||0),0);
  const totalEng=byP.reduce((s,p)=>s+p.mt,0);
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"repeat(2,1fr)":"repeat(4,1fr)",gap:12,marginBottom:14}}>
        <KPI icon="building" value={(projets||[]).length} label="Total projets" color="#324372" sub={(projets||[]).filter(p=>p.actif).length+" actifs"}/>
        <KPI icon="file" value={docs.filter(d=>d.proj).length} label="Docs rattachés" color="#1ecad3"/>
        <KPI icon="money" value={fmtN(totalBudget)} label="Budget total" color="#28a745" sub="Ar"/>
        <KPI icon="money" value={(totalBudget>0?Math.round(totalEng/totalBudget*100):0)+"%"} label="Budget utilisé" color="#f5a623"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"2fr 1fr",gap:14,marginBottom:14}}>
        <div style={{...card(),padding:20}}>
          <Sh title="Documents et montants par projet"/>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barSize={14}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/><XAxis dataKey="name" tick={{fontSize:11,fill:"#6c757d"}}/><YAxis yAxisId="l" tick={{fontSize:11,fill:"#6c757d"}} allowDecimals={false}/><YAxis yAxisId="r" orientation="right" tick={{fontSize:11,fill:"#6c757d"}} unit="M"/><Tooltip contentStyle={{fontSize:12,borderRadius:6}}/><Legend iconSize={9} wrapperStyle={{fontSize:11}}/><Bar yAxisId="l" dataKey="docs" fill={P} radius={[3,3,0,0]} name="Documents"/><Bar yAxisId="r" dataKey="mt" fill="#1ecad3" radius={[3,3,0,0]} name="Montant (MAr)"/></BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{...card(),padding:20}}>
          <Sh title="Utilisation budgétaire"/>
          {byP.map((p,i)=>(
            <div key={p.id} style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontSize:11.5,fontWeight:600,color:"#212529",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{p.nom.slice(0,22)}</span>
                <span style={{fontSize:11,fontWeight:700,color:p.pct>90?"#dc3545":p.pct>70?"#f5a623":"#28a745",flexShrink:0,marginLeft:6}}>{p.pct}%</span>
              </div>
              <div style={{background:"#e9ecef",height:6,borderRadius:3}}><div style={{width:Math.min(p.pct,100)+"%",height:"100%",background:p.pct>90?"#dc3545":p.pct>70?"#f5a623":"#28a745",borderRadius:3}}/></div>
              <div style={{fontSize:10.5,color:MUT,marginTop:2}}>{fmtN(p.mt)} / {fmtN(p.budget)} Ar</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:12}}>
        {byP.map((p,i)=>(
          <div key={p.id} style={{...card(),padding:18,borderTop:"3px solid "+COLORS[i%COLORS.length]}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div><div style={{fontSize:13,fontWeight:700,color:"#212529"}}>{p.nom}</div><div style={{fontSize:11,color:MUT,marginTop:2}}>{p.bailleur} · {p.dateDebut} → {p.dateFin}</div></div>
              <span style={{...bdg(p.actif?SUCL:"#e9ecef",p.actif?SUCD:MUT,{fontSize:10}),padding:"2px 8px",flexShrink:0}}>{p.actif?"Actif":"Inactif"}</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr 1fr",gap:8,marginBottom:10}}>
              {[["Docs",p.nbDocs,P],["Validés",p.valide,"#28a745"],["Fournisseurs",p.fourns.length,"#1ecad3"]].map(([l,v,c])=>(
                <div key={l} style={{background:"#f8f9fc",borderRadius:6,padding:"8px",textAlign:"center"}}>
                  <div style={{fontSize:16,fontWeight:800,color:c}}>{v}</div>
                  <div style={{fontSize:10,color:MUT}}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{marginBottom:4}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:11,color:MUT}}>Budget utilisé</span><span style={{fontSize:11,fontWeight:700,color:p.pct>90?"#dc3545":p.pct>70?"#f5a623":"#28a745"}}>{p.pct}%</span></div>
              <div style={{background:"#e9ecef",height:5,borderRadius:3}}><div style={{width:Math.min(p.pct,100)+"%",height:"100%",background:p.pct>90?"#dc3545":p.pct>70?"#f5a623":"#28a745",borderRadius:3}}/></div>
            </div>
            <div style={{fontSize:11,color:MUT}}>{fmtN(p.mt)} / {fmtN(p.budget)} Ar</div>
            {p.sites?.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:8}}>{p.sites.map(s=><span key={s} style={{fontSize:10,background:"#eef1f8",color:P,padding:"2px 7px",borderRadius:10,fontWeight:600}}>{s.slice(0,6)}</span>)}</div>}
          </div>
        ))}
        {byP.length===0&&<div style={{color:MUT,fontSize:13,textAlign:"center",padding:"32px 0",gridColumn:"1/-1"}}>Aucun projet configuré</div>}
      </div>
    </div>
  );
}

/* ─── MAIN ─── */
const TAB_ICONS={
  pilotage: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  workflow: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  fourn:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  financier:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  projet:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="3" x2="9" y2="21"/></svg>,
};
const TAB_LABELS={pilotage:"TB Pilotage",workflow:"TB Workflow",fourn:"TB Fournisseurs",financier:"TB Financier",projet:"TB Projets"};

export default function Dashboard(){
  const{docs,setView,openDoc,users,projets,fournComptes}=useApp();
  const[tab,setTab]=useState("pilotage");
  return(
    <div style={{animation:"fadeIn .25s ease"}}>
      {/* Tab bar */}
      <div style={{...card(),padding:"0 6px",marginBottom:16,display:"flex",gap:2,overflowX:"auto",WebkitOverflowScrolling:"touch",flexShrink:0}}>
        {Object.entries(TAB_LABELS).map(([id,label])=>{
          const act=tab===id;
          return(
            <button key={id} onClick={()=>setTab(id)}
              style={{display:"inline-flex",alignItems:"center",gap:7,padding:"13px 18px",border:"none",borderRadius:6,cursor:"pointer",fontWeight:act?700:500,fontSize:12.5,fontFamily:"inherit",background:act?"#eef2ff":"transparent",color:act?P:MUT,borderBottom:act?"2.5px solid "+P:"2.5px solid transparent",transition:"all .15s",flexShrink:0,whiteSpace:"nowrap"}}
              onMouseEnter={e=>{if(!act){e.currentTarget.style.background="#f8f9fc";e.currentTarget.style.color="#495057";}}}
              onMouseLeave={e=>{if(!act){e.currentTarget.style.background="transparent";e.currentTarget.style.color=MUT;}}}>
              <span style={{display:"flex",opacity:act?1:.65}}>{TAB_ICONS[id]}</span>
              {label}
            </button>
          );
        })}
      </div>
      {tab==="pilotage"  && <TabPilotage  docs={docs} setView={setView} openDoc={openDoc}/>}
      {tab==="workflow"  && <TabWorkflow  docs={docs} users={users||[]}/>}
      {tab==="fourn"     && <TabFournisseurs docs={docs}/>}
      {tab==="financier" && <TabFinancier docs={docs}/>}
      {tab==="projet"    && <TabProjet    docs={docs} projets={projets||[]}/>}
    </div>
  );
}