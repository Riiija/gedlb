"use client";
import{useState,useMemo}from"react";
import{IC}from"../ui/Icons";
import{ExportButtons}from"../ui/ExportButtons";
import{card,btn,inp,bdg,P,WH,BD,BG,MUT,SUC,SUCL,SUCD,DNG,DNGL,RSm,TR,TH,TD}from"../../lib/theme";
import{fmtN}from"../../lib/utils";
import{useIsMobile}from"../../lib/useResponsive";
import{useApp}from"../../context/AppContext";
import{useT}from"../../lib/i18n";
import{PROJETS,ALL_SITES}from"../../lib/data";

const ACCD="#1ecad3";
const WRN="#f5a623";
const WRNL="#fff8ec";

/* ── Filter Bar ─────────────────────────────────────────── */
function FilterBar({f,setF,users,t}){
  return(
    <div style={{...card(),padding:"14px 18px",marginBottom:16,display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end"}}>
      <Sel label={t.filtreProjet} value={f.proj} onChange={v=>setF(p=>({...p,proj:v}))}>
        <option value="">{t.tousProj}</option>
        {PROJETS.map(p=><option key={p.id} value={p.id}>{p.nom.slice(0,28)}</option>)}
      </Sel>
      <Sel label={t.filtreSite} value={f.site} onChange={v=>setF(p=>({...p,site:v}))}>
        <option value="">{t.tousSites}</option>
        {ALL_SITES.map(s=><option key={s}>{s}</option>)}
      </Sel>
      <Sel label={t.filtreExped} value={f.exped} onChange={v=>setF(p=>({...p,exped:v}))}>
        <option value="">{t.tousExped}</option>
        <option value="Fournisseur">{t.expFourn}</option>
        <option value="Interne">{t.expInterne}</option>
      </Sel>
      <Sel label={t.filtreValideur} value={f.valideur} onChange={v=>setF(p=>({...p,valideur:v}))}>
        <option value="">{t.tousValideurs}</option>
        {users.map(u=><option key={u.id} value={u.id}>{u.nom}</option>)}
      </Sel>
      <div>
        <div style={lbStyle}>{t.filtrePeriode}</div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <input type="date" value={f.dateFrom} onChange={e=>setF(p=>({...p,dateFrom:e.target.value}))} style={{...inp({padding:"7px 10px",fontSize:12,width:130})}}/>
          <span style={{color:MUT,fontSize:12}}>→</span>
          <input type="date" value={f.dateTo}   onChange={e=>setF(p=>({...p,dateTo:e.target.value}))}   style={{...inp({padding:"7px 10px",fontSize:12,width:130})}}/>
        </div>
      </div>
      <button onClick={()=>setF({proj:"",site:"",exped:"",valideur:"",dateFrom:"",dateTo:""})}
        style={{...btn("light",true),alignSelf:"flex-end"}}>
        <span style={{display:"flex"}}>{IC.x}</span> {t.reinitialiser}
      </button>
    </div>
  );
}
const lbStyle={fontSize:11,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".05em",marginBottom:4};
function Sel({label,value,onChange,children}){
  return(
    <div>
      <div style={lbStyle}>{label}</div>
      <select value={value} onChange={e=>onChange(e.target.value)} style={{...inp({padding:"7px 10px",fontSize:12,minWidth:140})}}>
        {children}
      </select>
    </div>
  );
}

/* ── KPI Card ─────────────────────────────────────────── */
function KPI({label,val,sub,color,icon,bgColor}){
  return(
    <div style={{background:WH,border:`1px solid ${BD}`,borderRadius:10,padding:"16px 20px",boxShadow:"0 2px 8px rgba(50,67,114,.07)",borderLeft:`4px solid ${color}`,background:bgColor||WH}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
        <span style={{display:"flex",color,fontSize:16}}>{icon}</span>
        <span style={{fontSize:11,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".06em"}}>{label}</span>
      </div>
      <div style={{fontSize:26,fontWeight:900,color}}>{val}</div>
      {sub&&<div style={{fontSize:11.5,color:MUT,marginTop:3}}>{sub}</div>}
    </div>
  );
}

/* ── Bar mini chart ─── */
function MiniBar({value,max,color}){
  const pct=max>0?(value/max)*100:0;
  return(
    <div style={{flex:1,height:6,background:"#e9ecef",borderRadius:3,overflow:"hidden"}}>
      <div style={{width:`${pct}%`,height:"100%",background:color,borderRadius:3,transition:"width .4s"}}/>
    </div>
  );
}

/* ── Section title ─── */
function STitle({icon,title,sub}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
      <span style={{display:"flex",color:P,fontSize:16}}>{icon}</span>
      <div>
        <div style={{fontSize:15,fontWeight:700,color:"#212529"}}>{title}</div>
        {sub&&<div style={{fontSize:11.5,color:MUT}}>{sub}</div>}
      </div>
    </div>
  );
}

/* ── Table wrapper ─── */
function StTable({cols,rows,empty="Aucune donnée"}){
  return(
    <div style={{overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
        <thead>
          <tr>{cols.map(c=><th key={c} style={{...{background:"#2d4a7a",color:"#fff",padding:"9px 12px",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",textAlign:"left",whiteSpace:"nowrap"}}}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length===0&&<tr><td colSpan={cols.length} style={{...TD,textAlign:"center",color:MUT,padding:24}}>{empty}</td></tr>}
          {rows.map((r,i)=>(
            <tr key={i} onMouseEnter={e=>e.currentTarget.style.background="#f8f9fc"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              {r.map((c,j)=><td key={j} style={TD}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const ST_COLOR={
  "REÇU":{bg:"#d1ecf1",fg:"#0c5460"},
  "EN VALIDATION":{bg:"#fff3cd",fg:"#856404"},
  "EN RETARD":{bg:"#f8d7da",fg:"#721c24"},
  "VALIDÉ":{bg:"#d4edda",fg:"#155724"},
  "REJETÉ":{bg:"#f8d7da",fg:"#721c24"},
  "BON À PAYER":{bg:"#cce5ff",fg:"#004085"},
  "PAYÉ":{bg:"#d4edda",fg:"#155724"},
  "ARCHIVÉ":{bg:"#e9ecef",fg:"#6c757d"},
};
function StBadge({st}){
  const c=ST_COLOR[st]||{bg:"#e9ecef",fg:"#6c757d"};
  return<span style={{background:c.bg,color:c.fg,padding:"2px 8px",borderRadius:12,fontSize:10,fontWeight:700}}>{st}</span>;
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
export default function DashboardStats(){
  const{docs,users,lang}=useApp();
  const t=useT(lang);
  const[f,setF]=useState({proj:"",site:"",exped:"",valideur:"",dateFrom:"",dateTo:""});
  const[activeTab,setActiveTab]=useState("overview");

  /* Apply filters */
  const filtered=useMemo(()=>{
    return docs.filter(d=>{
      if(f.proj && d.proj!==f.proj)return false;
      if(f.site && d.site!==f.site)return false;
      if(f.exped && d.exped!==f.exped)return false;
      if(f.valideur){
        const hasV=d.etapes?.some(e=>e.v?.includes(f.valideur)||e.validBy===f.valideur);
        if(!hasV)return false;
      }
      return true;
    });
  },[docs,f]);

  const total=filtered.length;
  const byStatus=useMemo(()=>{
    const m={};
    filtered.forEach(d=>{m[d.st]=(m[d.st]||0)+1;});
    return m;
  },[filtered]);

  const overdue=filtered.filter(d=>d.st==="EN RETARD").length;
  const inVal  =filtered.filter(d=>d.st==="EN VALIDATION").length;
  const recus  =filtered.filter(d=>d.st==="REÇU").length;
  const valides=filtered.filter(d=>["VALIDÉ","BON À PAYER","PAYÉ"].includes(d.st)).length;
  const rejetes=filtered.filter(d=>d.st==="REJETÉ").length;
  const totalMt=filtered.reduce((s,d)=>s+(d.mtR||d.mt||0),0);

  /* By project */
  const byProj=useMemo(()=>{
    const m={};
    filtered.forEach(d=>{
      const k=d.proj||"—";
      if(!m[k])m[k]={proj:k,total:0,valides:0,rejetes:0,enCours:0,mt:0};
      m[k].total++;m[k].mt+=(d.mtR||d.mt||0);
      if(["VALIDÉ","BON À PAYER","PAYÉ"].includes(d.st))m[k].valides++;
      else if(d.st==="REJETÉ")m[k].rejetes++;
      else m[k].enCours++;
    });
    return Object.values(m).sort((a,b)=>b.total-a.total);
  },[filtered]);

  /* By valideur */
  const byVal=useMemo(()=>{
    const m={};
    users.forEach(u=>{m[u.id]={user:u,enCours:0,valides:0,rejetes:0,retards:0};});
    filtered.forEach(d=>{
      d.etapes?.forEach(e=>{
        (e.v||[]).forEach(uid=>{
          if(!m[uid])return;
          if(e.statut==="EN ATTENTE"||e.statut==="EN RETARD")m[uid].enCours++;
          if(e.statut==="VALIDÉ")m[uid].valides++;
          if(e.statut==="REJETÉ")m[uid].rejetes++;
          if(e.statut==="EN RETARD")m[uid].retards++;
        });
      });
    });
    return Object.values(m).filter(x=>x.enCours+x.valides+x.rejetes>0).sort((a,b)=>b.enCours-a.enCours);
  },[filtered,users]);

  /* By expediteur */
  const byExped=useMemo(()=>{
    const m={};
    filtered.forEach(d=>{const k=d.exped||"—";if(!m[k])m[k]={exped:k,total:0,mt:0};m[k].total++;m[k].mt+=(d.mtR||d.mt||0);});
    return Object.values(m).sort((a,b)=>b.total-a.total);
  },[filtered]);

  /* By site */
  const bySite=useMemo(()=>{
    const m={};
    filtered.forEach(d=>{const k=d.site||"—";if(!m[k])m[k]={site:k,total:0,mt:0,retards:0};m[k].total++;m[k].mt+=(d.mtR||d.mt||0);if(d.st==="EN RETARD")m[k].retards++;});
    return Object.values(m).sort((a,b)=>b.total-a.total);
  },[filtered]);

  /* Recent 10 docs */
  const recentDocs=useMemo(()=>[...filtered].slice(-10).reverse(),[filtered]);

  /* Overdue docs */
  const overdueDocs=useMemo(()=>filtered.filter(d=>d.st==="EN RETARD"),[filtered]);

  /* Pending docs */
  const pendingDocs=useMemo(()=>filtered.filter(d=>["EN VALIDATION","EN RETARD","REÇU"].includes(d.st)),[filtered]);

  const activeFilters=Object.values(f).filter(Boolean).length;

  const TABS=[
    {id:"overview", label:lang==="en"?"Overview":"Vue d'ensemble",   icon:IC.dash},
    {id:"byproject",label:t.filtreProjet, icon:IC.folder},
    {id:"byval",    label:t.filtreValideur, icon:IC.users},
    {id:"bysite",   label:t.filtreSite,   icon:IC.building},
    {id:"pending",  label:lang==="en"?"Pending":"En instance",       icon:IC.clock},
    {id:"overdue",  label:lang==="en"?"Overdue":"En retard",         icon:IC.alertTri},
  ];

  return(
    <div style={{animation:"fadeIn .2s ease"}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div>
          <h2 style={{fontSize:18,fontWeight:700,color:"#212529",marginBottom:2}}>
            {lang==="en"?"Statistics & KPIs":"Statistiques & KPIs"}
          </h2>
          <p style={{fontSize:12.5,color:MUT}}>
            {total} {t.etatsDesc}
            {activeFilters>0&&<span style={{...bdg("#eef1f8",P,{fontSize:11,marginLeft:8})}}> {activeFilters} {t.etatsFiltre}</span>}
          </p>
        </div>
      </div>

      {/* Filters */}
      <FilterBar f={f} setF={setF} users={users} t={t}/>

      {/* Tabs */}
      <div style={{display:"flex",gap:4,marginBottom:16,overflowX:"auto",borderBottom:`1px solid ${BD}`,paddingBottom:0}}>
        {TABS.map(tab=>(
          <button key={tab.id} onClick={()=>setActiveTab(tab.id)}
            style={{display:"flex",alignItems:"center",gap:7,padding:"8px 14px",background:"transparent",border:"none",borderBottom:activeTab===tab.id?`2px solid ${P}`:"2px solid transparent",cursor:"pointer",color:activeTab===tab.id?P:MUT,fontWeight:activeTab===tab.id?700:400,fontSize:12.5,transition:TR,whiteSpace:"nowrap",fontFamily:"inherit",marginBottom:-1}}>
            <span style={{display:"flex"}}>{tab.icon}</span>{tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB: Overview ── */}
      {activeTab==="overview"&&(
        <div>
          {/* KPIs */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12,marginBottom:20}}>
            <KPI label={t.totalDossiers}   val={total}    sub={fmtN(totalMt)}  color={P}        icon={IC.folder}/>
            <KPI label={t.enAttente}       val={recus+inVal} sub={`${recus} ${t.recu} + ${inVal} en val.`} color="#f39c12" icon={IC.clock}/>
            <KPI label={t.enRetard}        val={overdue}  sub={overdue>0?`🚨 ${t.alerte}`:"✓ OK"} color={overdue>0?"#e03e3e":SUC} icon={IC.alertTri}/>
            <KPI label={t.traites}         val={valides}  sub={total>0?`${Math.round(valides/total*100)}%`:"-"} color={SUC} icon={IC.chk}/>
            <KPI label={t.totalRejet}      val={rejetes}  sub={total>0?`${Math.round(rejetes/total*100)}% ${t.tauxRejet}`:"—"} color="#e03e3e" icon={IC.x}/>
            <KPI label={t.montantTraite}   val={fmtN(filtered.filter(d=>["VALIDÉ","BON À PAYER","PAYÉ"].includes(d.st)).reduce((s,d)=>s+(d.mtR||d.mt||0),0))} color={ACCD} icon={IC.creditCard}/>
          </div>

          {/* Statuts breakdown */}
          <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr",gap:14,marginBottom:20}}>
            <div style={{...card(),padding:20}}>
              <STitle icon={IC.barChart} title={lang==="en"?"Document status":"Statuts des documents"}/>
              {Object.entries(byStatus).sort(([,a],[,b])=>b-a).map(([st,n])=>(
                <div key={st} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <StBadge st={st}/>
                  <MiniBar value={n} max={total} color={ST_COLOR[st]?.fg||MUT}/>
                  <span style={{fontSize:12,fontWeight:700,color:"#212529",minWidth:30,textAlign:"right"}}>{n}</span>
                  <span style={{fontSize:11,color:MUT}}>{total>0?`${Math.round(n/total*100)}%`:""}</span>
                </div>
              ))}
            </div>
            <div style={{...card(),padding:20}}>
              <STitle icon={IC.users} title={lang==="en"?"By sender type":"Par type d'expéditeur"}/>
              {byExped.map(x=>(
                <div key={x.exped} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <span style={{fontSize:12,fontWeight:600,minWidth:80,color:"#212529"}}>{x.exped}</span>
                  <MiniBar value={x.total} max={total} color={P}/>
                  <span style={{fontSize:12,fontWeight:700,minWidth:30,textAlign:"right"}}>{x.total}</span>
                  <span style={{fontSize:11,color:MUT}}>{fmtN(x.mt)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent docs */}
          <div style={{...card(),overflow:"hidden"}}>
            <div style={{padding:"14px 16px",borderBottom:`1px solid ${BD}`}}>
              <STitle icon={IC.clock} title={lang==="en"?"Recent documents":"Documents récents"}/>
            </div>
            <StTable
              cols={[t.reference,t.nomType,t.fournisseur,t.projet,t.statut,t.montant]}
              rows={recentDocs.map(d=>[
                <span style={{fontWeight:600,color:P}}>{d.id}</span>,
                d.type,
                d.fourn||"—",
                d.proj||"—",
                <StBadge st={d.st}/>,
                fmtN(d.mtR||d.mt)
              ])}
            />
          </div>
        </div>
      )}

      {/* ── TAB: By project ── */}
      {activeTab==="byproject"&&(
        <div style={{...card(),overflow:"hidden"}}>
          <div style={{padding:"14px 16px",borderBottom:`1px solid ${BD}`}}>
            <STitle icon={IC.folder} title={lang==="en"?"Documents by project":"Documents par projet"}
              sub={`${byProj.length} ${lang==="en"?"projects":"projets"}`}/>
          </div>
          <StTable
            cols={[t.projet,"Total",t.enCours+"",t.traites,t.totalRejet,t.montantTraite,t.tauxTraitement]}
            rows={byProj.map(r=>[
              <span style={{fontWeight:600}}>{r.proj}</span>,
              r.total,
              r.enCours,
              <span style={{color:SUC,fontWeight:600}}>{r.valides}</span>,
              <span style={{color:"#e03e3e"}}>{r.rejetes}</span>,
              fmtN(r.mt),
              <span style={{fontWeight:700}}>{r.total>0?`${Math.round(r.valides/r.total*100)}%`:"—"}</span>
            ])}
          />
        </div>
      )}

      {/* ── TAB: By valideur ── */}
      {activeTab==="byval"&&(
        <div style={{...card(),overflow:"hidden"}}>
          <div style={{padding:"14px 16px",borderBottom:`1px solid ${BD}`}}>
            <STitle icon={IC.users} title={lang==="en"?"Workload by validator":"Charge par valideur"}/>
          </div>
          <StTable
            cols={[t.filtreValideur,t.enInstance,t.traites,t.totalRejet,t.enRetard]}
            rows={byVal.map(r=>[
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:26,height:26,borderRadius:"50%",background:P,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff",flexShrink:0}}>{r.user.init}</div>
                <div>
                  <div style={{fontWeight:600,color:"#212529"}}>{r.user.nom}</div>
                  <div style={{fontSize:11,color:MUT}}>{r.user.role}</div>
                </div>
              </div>,
              r.enCours,
              <span style={{color:SUC,fontWeight:700}}>{r.valides}</span>,
              <span style={{color:"#e03e3e"}}>{r.rejetes}</span>,
              r.retards>0?<span style={{...bdg(DNGL,"#e03e3e",{fontSize:11})}}>{r.retards} 🚨</span>:"—"
            ])}
          />
        </div>
      )}

      {/* ── TAB: By site ── */}
      {activeTab==="bysite"&&(
        <div style={{...card(),overflow:"hidden"}}>
          <div style={{padding:"14px 16px",borderBottom:`1px solid ${BD}`}}>
            <STitle icon={IC.building} title={lang==="en"?"Documents by site":"Documents par site"}/>
          </div>
          <StTable
            cols={[t.filtreSite,"Total",t.enRetard,t.montantTraite]}
            rows={bySite.map(r=>[
              <span style={{fontWeight:600}}>{r.site}</span>,
              r.total,
              r.retards>0?<span style={{color:"#e03e3e",fontWeight:700}}>{r.retards}</span>:"—",
              fmtN(r.mt)
            ])}
          />
        </div>
      )}

      {/* ── TAB: Pending ── */}
      {activeTab==="pending"&&(
        <div style={{...card(),overflow:"hidden"}}>
          <div style={{padding:"14px 16px",borderBottom:`1px solid ${BD}`}}>
            <STitle icon={IC.clock} title={lang==="en"?"Pending documents":"Dossiers en instance"}
              sub={`${pendingDocs.length} ${lang==="en"?"documents":"documents"}`}/>
          </div>
          <StTable
            cols={[t.reference,t.nomType,t.fournisseur,t.site,t.projet,t.statut,t.montant]}
            rows={pendingDocs.map(d=>[
              <span style={{fontWeight:600,color:P}}>{d.id}</span>,
              d.type,d.fourn||"—",d.site||"—",d.proj||"—",
              <StBadge st={d.st}/>,fmtN(d.mtR||d.mt)
            ])}
          />
        </div>
      )}

      {/* ── TAB: Overdue ── */}
      {activeTab==="overdue"&&(
        <div>
          {overdueDocs.length===0?(
            <div style={{...card(),padding:40,textAlign:"center"}}>
              <div style={{fontSize:32,marginBottom:10}}>✅</div>
              <div style={{fontSize:15,fontWeight:600,color:SUC}}>{t.aucunRetard}</div>
            </div>
          ):(
            <div style={{...card(),overflow:"hidden"}}>
              <div style={{padding:"14px 16px",borderBottom:`1px solid ${BD}`,display:"flex",alignItems:"center",gap:8}}>
                <STitle icon={IC.alertTri} title={lang==="en"?"Overdue documents":"Documents en retard"}
                  sub={`${overdueDocs.length} ${t.alerte}`}/>
              </div>
              <StTable
                cols={[t.reference,t.nomType,t.fournisseur,t.site,t.filtreValideur,t.montant]}
                rows={overdueDocs.map(d=>{
                  const validator=d.etapes?.find(e=>e.statut==="EN ATTENTE"||e.statut==="EN RETARD");
                  return[
                    <span style={{fontWeight:600,color:"#e03e3e"}}>{d.id}</span>,
                    d.type,d.fourn||"—",d.site||"—",
                    validator?.label||"—",
                    fmtN(d.mtR||d.mt)
                  ];
                })}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
