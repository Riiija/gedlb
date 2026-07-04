"use client";
import{useState,useRef,useMemo}from"react";
import{BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,PieChart,Pie,Cell,LineChart,Line,Legend,AreaChart,Area}from"recharts";
import{useApp}from"../../context/AppContext";
import{card,btn,bdg,inp,MUT,WH,BD,BG,SUCL,SUCD,DNG,TR}from"../../lib/theme";
import{fmtN}from"../../lib/utils";
import{formatPaymentAmount,isPaymentInitiated}from"../../lib/epaiementPayments";

const G="#1a6b3c";
const GLight="#e8f5ee";
const GDk="#0f4024";
const PURPLE="#7c3aed";
const PURPLEL="#f5f0ff";
const AMBER="#d97706";
const AMBERL="#fff8e6";
const CYAN="#0891b2";
const CYANL="#e0f7ff";
const RED="#dc3545";
const REDL="#fff0f0";

/* ── Shared helpers ── */
function KPICard({label,value,sub,color,icon,trend,onClick}){
  return(
    <div onClick={onClick} style={{...card(),padding:"18px 20px",borderLeft:"4px solid "+color,cursor:onClick?"pointer":"default",transition:TR}}
      onMouseEnter={e=>{if(onClick)e.currentTarget.style.transform="translateY(-2px)";}}
      onMouseLeave={e=>{e.currentTarget.style.transform="none";}}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:10}}>
        <div style={{width:36,height:36,borderRadius:8,background:color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{icon}</div>
        {trend!==undefined&&(
          <span style={{fontSize:11,fontWeight:700,color:trend>=0?"#1d6f42":"#dc3545",background:trend>=0?"#d4edda":"#f8d7da",padding:"2px 7px",borderRadius:10}}>
            {trend>=0?"▲":"▼"} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div style={{fontSize:11,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".06em",marginBottom:4}}>{label}</div>
      <div style={{fontSize:26,fontWeight:900,color,lineHeight:1.1,marginBottom:sub?4:0}}>{value}</div>
      {sub&&<div style={{fontSize:11.5,color:MUT}}>{sub}</div>}
    </div>
  );
}

function SectionTitle({title,subtitle,color=G}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
      <div style={{width:4,height:36,borderRadius:4,background:color,flexShrink:0}}/>
      <div>
        <div style={{fontSize:15,fontWeight:800,color:"#1e293b"}}>{title}</div>
        {subtitle&&<div style={{fontSize:11.5,color:MUT}}>{subtitle}</div>}
      </div>
    </div>
  );
}

const REPORTS=[
  {id:"ep-kpi",   num:1, icon:"📊", label:"Tableau de bord KPI",      sub:"Vue d'ensemble consolidée"},
  {id:"ep-r-liq", num:2, icon:"📋", label:"État des liquidations",     sub:"Suivi et détail par liquidation"},
  {id:"ep-r-gen", num:3, icon:"🏦", label:"État des générations",      sub:"Fichiers XML générés par banque"},
  {id:"ep-r-pai", num:4, icon:"💳", label:"État des paiements",        sub:"Ordres de paiement bancaires"},
  {id:"ep-r-four",num:5, icon:"🏢", label:"État par fournisseur",      sub:"Récapitulatif fournisseur"},
  {id:"ep-r-proj",num:6, icon:"🗂️", label:"État par projet / site",    sub:"Répartition géographique et projets"},
];

const REPORT_COLORS={
  "ep-kpi":G,"ep-r-liq":PURPLE,"ep-r-gen":CYAN,"ep-r-pai":AMBER,"ep-r-four":RED,"ep-r-proj":G
};

/* ─────────────────────────────────────
   ÉTAT 1: KPI DASHBOARD
───────────────────────────────────── */
function EtatKPI({liq}){
  const all=liq||[];
  const totalMt=all.reduce((s,l)=>s+(l.mt||0),0);
  const nbPayes=all.filter(l=>l.st==="PAYÉ").length;
  const nbEnCours=all.filter(l=>!["PAYÉ","CLÔTURÉ","ANNULÉ"].includes(l.st)).length;
  const nbClotures=all.filter(l=>l.st==="CLÔTURÉ").length;
  const nbSync=all.filter(l=>l.syncTompro).length;
  const mtPaye=all.filter(l=>l.st==="PAYÉ").reduce((s,l)=>s+(l.mt||0),0);
  const mtEnCours=all.filter(l=>!["PAYÉ","CLÔTURÉ","ANNULÉ"].includes(l.st)).reduce((s,l)=>s+(l.mt||0),0);

  // Monthly data
  const months=["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];
  const monthlyData=months.map((m,i)=>{
    const mLiq=all.filter(l=>{const d=new Date(l.date||"2026-01-01");return d.getMonth()===i;});
    return{name:m,liquidations:mLiq.length,montant:mLiq.reduce((s,l)=>s+(l.mt||0),0)/1000000};
  }).filter(m=>m.liquidations>0||m.montant>0);
  if(monthlyData.length===0)monthlyData.push({name:"Jan",liquidations:all.length,montant:totalMt/1000000});

  // Status pie
  const statData=[
    {name:"Payés",v:nbPayes,color:"#1d6f42"},
    {name:"En cours",v:nbEnCours,color:AMBER},
    {name:"Clôturés",v:nbClotures,color:CYAN},
    {name:"Autres",v:Math.max(0,all.length-nbPayes-nbEnCours-nbClotures),color:"#adb5bd"},
  ].filter(d=>d.v>0);

  // Devise breakdown
  const devises=[...new Set(all.map(l=>l.devise||"MGA"))];
  const deviseData=devises.map(d=>({name:d,v:all.filter(l=>(l.devise||"MGA")===d).length}));

  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      {/* KPI row */}
      <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"repeat(2,1fr)":"repeat(4,1fr)",gap:12}}>
        <KPICard label="Total liquidations" value={all.length} color={G} icon="📋" trend={12}/>
        <KPICard label="Montant total (MGA)" value={fmtN(totalMt)+" Ar"} sub={`${nbPayes} liquidations payées`} color={PURPLE} icon="💰" trend={8}/>
        <KPICard label="En cours" value={nbEnCours} sub={fmtN(mtEnCours)+" Ar"} color={AMBER} icon="⏳"/>
        <KPICard label="Sync TOMPRO" value={`${nbSync}/${all.length}`} sub={`${all.length>0?Math.round(nbSync/all.length*100):0}% synchronisés`} color={CYAN} icon="🔄" trend={5}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"repeat(2,1fr)":"repeat(4,1fr)",gap:12}}>
        <KPICard label="Montant payé" value={fmtN(mtPaye)+" Ar"} color="#1d6f42" icon="✅"/>
        <KPICard label="Montant en attente" value={fmtN(mtEnCours)+" Ar"} color={AMBER} icon="⏱️"/>
        <KPICard label="Liquidations clôturées" value={nbClotures} color={CYAN} icon="🏦"/>
        <KPICard label="Taux de paiement" value={(all.length>0?Math.round(nbPayes/all.length*100):0)+"%"} color={G} icon="📈" trend={3}/>
      </div>

      {/* Charts row */}
      <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"2fr 1fr",gap:16}}>
        {/* Monthly bar chart */}
        <div style={{...card(),padding:20}}>
          <div style={{fontSize:13,fontWeight:700,color:"#1e293b",marginBottom:4}}>Évolution mensuelle</div>
          <div style={{fontSize:11.5,color:MUT,marginBottom:16}}>Nombre de liquidations et montants par mois</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5"/>
              <XAxis dataKey="name" tick={{fontSize:11,fill:"#6c757d"}}/>
              <YAxis yAxisId="l" tick={{fontSize:11,fill:"#6c757d"}} allowDecimals={false}/>
              <YAxis yAxisId="r" orientation="right" tick={{fontSize:11,fill:"#6c757d"}} unit="MAr"/>
              <Tooltip contentStyle={{fontSize:12,borderRadius:6}}/>
              <Legend iconSize={9} wrapperStyle={{fontSize:11}}/>
              <Bar yAxisId="l" dataKey="liquidations" fill={G} radius={[3,3,0,0]} name="Liquidations"/>
              <Bar yAxisId="r" dataKey="montant" fill={PURPLE} radius={[3,3,0,0]} name="Montant (MAr)"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Status pie */}
        <div style={{...card(),padding:20}}>
          <div style={{fontSize:13,fontWeight:700,color:"#1e293b",marginBottom:4}}>Répartition par statut</div>
          <div style={{fontSize:11.5,color:MUT,marginBottom:8}}>Distribution des liquidations</div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={statData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="v" paddingAngle={3}>
                {statData.map((e,i)=><Cell key={i} fill={e.color}/>)}
              </Pie>
              <Tooltip contentStyle={{fontSize:11,borderRadius:6}} formatter={(v,n)=>[v+" liq.",n]}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{display:"flex",flexDirection:"column",gap:5,marginTop:6}}>
            {statData.map(d=>(
              <div key={d.name} style={{display:"flex",alignItems:"center",gap:8,fontSize:11.5}}>
                <div style={{width:10,height:10,borderRadius:2,background:d.color,flexShrink:0}}/>
                <span style={{flex:1,color:"#495057"}}>{d.name}</span>
                <span style={{fontWeight:700,color:"#212529"}}>{d.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Devise + Fournisseur top 5 */}
      <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr",gap:16}}>
        {/* Devise */}
        <div style={{...card(),padding:20}}>
          <div style={{fontSize:13,fontWeight:700,color:"#1e293b",marginBottom:12}}>Répartition par devise</div>
          {deviseData.map((d,i)=>(
            <div key={d.name} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:12,fontWeight:600,color:"#495057"}}>{d.name}</span>
                <span style={{fontSize:12,fontWeight:700,color:"#212529"}}>{d.v} liq.</span>
              </div>
              <div style={{height:6,background:"#f0f2f5",borderRadius:10}}>
                <div style={{height:6,borderRadius:10,background:[G,PURPLE,CYAN,AMBER][i%4],width:all.length>0?Math.round(d.v/all.length*100)+"%":"0%",transition:"width .5s"}}/>
              </div>
            </div>
          ))}
          {deviseData.length===0&&<div style={{color:MUT,fontSize:12,textAlign:"center",padding:"20px 0"}}>Aucune donnée</div>}
        </div>
        {/* Top fournisseurs */}
        <div style={{...card(),padding:20}}>
          <div style={{fontSize:13,fontWeight:700,color:"#1e293b",marginBottom:12}}>Top fournisseurs</div>
          {[...new Set(all.map(l=>l.fourn).filter(Boolean))].slice(0,5).map((f,i)=>{
            const cnt=all.filter(l=>l.fourn===f).length;
            const mt=all.filter(l=>l.fourn===f).reduce((s,l)=>s+(l.mt||0),0);
            return(
              <div key={f} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<4?"1px solid #f0f2f5":"none"}}>
                <div style={{width:22,height:22,borderRadius:6,background:[G,PURPLE,CYAN,AMBER,RED][i]+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:[G,PURPLE,CYAN,AMBER,RED][i],flexShrink:0}}>{i+1}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,fontWeight:600,color:"#212529",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f}</div>
                  <div style={{fontSize:11,color:MUT}}>{fmtN(mt)} Ar</div>
                </div>
                <span style={{fontSize:11,fontWeight:700,color:[G,PURPLE,CYAN,AMBER,RED][i],background:[G,PURPLE,CYAN,AMBER,RED][i]+"15",padding:"2px 7px",borderRadius:10}}>{cnt} liq.</span>
              </div>
            );
          })}
          {all.filter(l=>l.fourn).length===0&&<div style={{color:MUT,fontSize:12,textAlign:"center",padding:"20px 0"}}>Aucune donnée</div>}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   ÉTAT 2: Liquidations
───────────────────────────────────── */
function EtatLiquidations({liq}){
  const[q,setQ]=useState("");
  const[filterSt,setFilterSt]=useState("");
  const all=liq||[];
  const statuts=[...new Set(all.map(l=>l.st).filter(Boolean))];
  const filtered=all.filter(l=>{
    if(filterSt&&l.st!==filterSt)return false;
    if(q&&!l.id?.toLowerCase().includes(q.toLowerCase())&&!l.fourn?.toLowerCase().includes(q.toLowerCase())&&!(l.numero||"").toLowerCase().includes(q.toLowerCase()))return false;
    return true;
  });
  const total=filtered.reduce((s,l)=>s+(l.mt||0),0);

  const STATUT_C={"PAYÉ":"#1d6f42","CLÔTURÉ":CYAN,"EN ATTENTE PAIEMENT":AMBER,"ANNULÉ":RED};

  function exportCSV(){
    const bom="\uFEFF";
    const hdr=["N° Liquidation","Site","Date","Fournisseur","Description","Devise","Cours","Montant MGA","Statut","Sync TOMPRO"].join(";");
    const rows=filtered.map(l=>[l.numero||l.id,l.site||"",l.date||"",l.fourn||"",l.description||"",l.devise||"MGA",l.cours||1,l.mt||0,l.st||"",l.syncTompro?"OUI":"NON"].join(";")).join("\n");
    const blob=new Blob([bom+hdr+"\n"+rows],{type:"text/csv;charset=utf-8;"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download=`etat_liquidations_${new Date().toISOString().slice(0,10)}.csv`;a.click();
  }

  return(
    <div>
      {/* Summary KPIs */}
      <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"repeat(2,1fr)":"repeat(4,1fr)",gap:12,marginBottom:20}}>
        <KPICard label="Total" value={filtered.length} color={PURPLE} icon="📋"/>
        <KPICard label="Montant total" value={fmtN(total)+" Ar"} color={G} icon="💰"/>
        <KPICard label="Synchronisés TOMPRO" value={filtered.filter(l=>l.syncTompro).length} color={CYAN} icon="🔄"/>
        <KPICard label="Non payés" value={filtered.filter(l=>l.st!=="PAYÉ").length} color={AMBER} icon="⏳"/>
      </div>
      {/* Filters + table */}
      <div style={{...card(),padding:0,overflow:"hidden"}}>
        <div style={{padding:"14px 18px",background:PURPLE,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Rechercher…"
              style={{padding:"5px 10px",border:"none",borderRadius:5,fontSize:12,width:180,fontFamily:"inherit",outline:"none"}}/>
            <select value={filterSt} onChange={e=>setFilterSt(e.target.value)}
              style={{padding:"5px 10px",border:"none",borderRadius:5,fontSize:12,fontFamily:"inherit",cursor:"pointer"}}>
              <option value="">Tous les statuts</option>
              {statuts.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
            {(q||filterSt)&&<button onClick={()=>{setQ("");setFilterSt("");}} style={{background:"rgba(255,255,255,.2)",border:"none",borderRadius:4,color:"#fff",cursor:"pointer",padding:"5px 10px",fontSize:12}}>✕</button>}
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <span style={{color:"rgba(255,255,255,.7)",fontSize:12}}>{filtered.length} liquidation{filtered.length!==1?"s":""} · {fmtN(total)} Ar</span>
            <button onClick={exportCSV} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"5px 12px",borderRadius:5,border:"none",background:"#1d6f42",color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600}}>📥 Excel</button>
          </div>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead>
              <tr style={{background:"#f8f9fc"}}>
                {["#","N° Liquidation","Site","Date","Fournisseur","Description","Devise","Montant MGA","Statut","TOMPRO"].map(h=>(
                  <th key={h} style={{padding:"8px 10px",textAlign:"left",fontSize:10,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".04em",borderBottom:"1px solid "+BD,whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length===0&&<tr><td colSpan={10} style={{textAlign:"center",padding:"28px",color:MUT}}>Aucune liquidation trouvée</td></tr>}
              {filtered.map((l,i)=>(
                <tr key={l.id} style={{borderBottom:"1px solid #f0f2f5"}}
                  onMouseEnter={e=>e.currentTarget.style.background="#f8f9fc"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{padding:"9px 10px",color:MUT,fontWeight:700,fontSize:11}}>{i+1}</td>
                  <td style={{padding:"9px 10px",fontWeight:700,color:PURPLE}}>{l.numero||l.id}</td>
                  <td style={{padding:"9px 10px",color:"#495057"}}>{l.site||"—"}</td>
                  <td style={{padding:"9px 10px",whiteSpace:"nowrap",color:"#495057"}}>{l.date||"—"}</td>
                  <td style={{padding:"9px 10px",maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:"#212529"}}>{l.fourn||"—"}</td>
                  <td style={{padding:"9px 10px",maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:MUT}}>{l.description||"—"}</td>
                  <td style={{padding:"9px 10px",color:"#495057"}}>{l.devise||"MGA"}</td>
                  <td style={{padding:"9px 10px",fontWeight:700,color:G,textAlign:"right"}}>{fmtN(l.mt||0)} Ar</td>
                  <td style={{padding:"9px 10px"}}>
                    <span style={{fontSize:10.5,fontWeight:700,background:(STATUT_C[l.st]||"#adb5bd")+"20",color:STATUT_C[l.st]||"#6c757d",padding:"3px 8px",borderRadius:10,whiteSpace:"nowrap"}}>{l.st||"—"}</span>
                  </td>
                  <td style={{padding:"9px 10px",textAlign:"center"}}>
                    {l.syncTompro?<span style={{fontSize:10.5,background:"#e8f5ff",color:"#1560bd",fontWeight:700,padding:"2px 6px",borderRadius:6}}>✓</span>:<span style={{color:"#dee2e6",fontSize:12}}>—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
            {filtered.length>0&&(
              <tfoot>
                <tr style={{background:"#f0f4ff",borderTop:"2px solid "+PURPLE}}>
                  <td colSpan={7} style={{padding:"9px 10px",fontWeight:800,color:PURPLE,textTransform:"uppercase",fontSize:11}}>Total ({filtered.length})</td>
                  <td style={{padding:"9px 10px",fontWeight:800,color:G,textAlign:"right"}}>{fmtN(total)} Ar</td>
                  <td colSpan={2}/>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   ÉTAT 3: Générations XML
───────────────────────────────────── */
function EtatGenerations({liq}){
  const all=liq||[];
  const synced=all.filter(l=>l.syncTompro);
  const notSynced=all.filter(l=>!l.syncTompro&&l.st!=="ANNULÉ");
  const totalMtSync=synced.reduce((s,l)=>s+(l.mt||0),0);
  const tauxSync=all.length>0?Math.round(synced.length/all.length*100):0;

  const byDate=[...new Set(synced.map(l=>l.dateSync?.slice(0,10)||"").filter(Boolean))].sort();
  const timelineData=byDate.map(d=>({name:d.slice(5),sync:synced.filter(l=>(l.dateSync||"").startsWith(d)).length}));
  if(timelineData.length===0)timelineData.push({name:"—",sync:0});

  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"repeat(2,1fr)":"repeat(4,1fr)",gap:12,marginBottom:20}}>
        <KPICard label="Fichiers générés" value={synced.length} color={CYAN} icon="📤" trend={15}/>
        <KPICard label="Montant transmis" value={fmtN(totalMtSync)+" Ar"} color={G} icon="💸"/>
        <KPICard label="En attente génération" value={notSynced.length} color={AMBER} icon="⏳"/>
        <KPICard label="Taux de génération" value={tauxSync+"%"} color={tauxSync>70?G:AMBER} icon="📊"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:16,marginBottom:16}}>
        <div style={{...card(),padding:20}}>
          <div style={{fontSize:13,fontWeight:700,color:"#1e293b",marginBottom:12}}>Historique des synchronisations TOMPRO</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5"/>
              <XAxis dataKey="name" tick={{fontSize:10,fill:"#6c757d"}}/>
              <YAxis tick={{fontSize:10,fill:"#6c757d"}} allowDecimals={false}/>
              <Tooltip contentStyle={{fontSize:11,borderRadius:6}}/>
              <Area type="monotone" dataKey="sync" stroke={CYAN} fill={CYAN+"30"} strokeWidth={2} name="Synchronisations"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{...card(),padding:20}}>
          <div style={{fontSize:13,fontWeight:700,color:"#1e293b",marginBottom:12}}>Statut des transmissions</div>
          <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:8}}>
            {[
              {label:"Synchronisés TOMPRO",val:synced.length,color:G,icon:"✅"},
              {label:"En attente",val:notSynced.length,color:AMBER,icon:"⏳"},
              {label:"Annulés",val:all.filter(l=>l.st==="ANNULÉ").length,color:RED,icon:"❌"},
            ].map(row=>(
              <div key={row.label} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:8,background:row.color+"10",border:"1px solid "+row.color+"30"}}>
                <span style={{fontSize:18}}>{row.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:12.5,fontWeight:600,color:"#212529"}}>{row.label}</div>
                  <div style={{height:4,borderRadius:10,background:"#f0f2f5",marginTop:4}}>
                    <div style={{height:4,borderRadius:10,background:row.color,width:all.length>0?Math.round(row.val/all.length*100)+"%":"0%"}}/>
                  </div>
                </div>
                <span style={{fontSize:20,fontWeight:900,color:row.color}}>{row.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Liquidations non générées */}
      {notSynced.length>0&&(
        <div style={{...card(),padding:0,overflow:"hidden"}}>
          <div style={{background:AMBER,padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{color:"#fff",fontSize:12,fontWeight:700}}>⚠️ Liquidations en attente de génération ({notSynced.length})</span>
          </div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead><tr style={{background:"#fff8e6"}}>
                {["N° Liquidation","Date","Fournisseur","Montant MGA","Statut"].map(h=>(
                  <th key={h} style={{padding:"7px 10px",textAlign:"left",fontSize:10,fontWeight:700,color:AMBER,textTransform:"uppercase",borderBottom:"1px solid "+BD}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {notSynced.slice(0,10).map((l,i)=>(
                  <tr key={l.id} style={{borderBottom:"1px solid #f0f2f5"}}
                    onMouseEnter={e=>e.currentTarget.style.background="#fff8e6"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{padding:"8px 10px",fontWeight:700,color:PURPLE}}>{l.numero||l.id}</td>
                    <td style={{padding:"8px 10px",color:"#495057"}}>{l.date||"—"}</td>
                    <td style={{padding:"8px 10px",color:"#212529"}}>{l.fourn||"—"}</td>
                    <td style={{padding:"8px 10px",fontWeight:700,color:G,textAlign:"right"}}>{fmtN(l.mt||0)} Ar</td>
                    <td style={{padding:"8px 10px"}}><span style={{fontSize:10.5,background:AMBER+"20",color:AMBER,fontWeight:700,padding:"2px 7px",borderRadius:10}}>{l.st||"—"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────
   ÉTAT 4: Paiements
───────────────────────────────────── */
function EtatPaiements({liq,paiements=[]}){
  const all=liq||[];
  const initiatedPaiements=(paiements||[]).filter(isPaymentInitiated);
  const initiatedTotal=initiatedPaiements.reduce((s,p)=>s+(p.mtLocale||0),0);
  const payes=all.filter(l=>l.st==="PAYÉ");
  const enCours=all.filter(l=>!["PAYÉ","CLÔTURÉ","ANNULÉ"].includes(l.st));
  const totalPaye=payes.reduce((s,l)=>s+(l.mt||0),0);
  const totalEnCours=enCours.reduce((s,l)=>s+(l.mt||0),0);

  const devData=[...new Set(all.map(l=>l.devise||"MGA"))].map(d=>({
    name:d,
    total:all.filter(l=>(l.devise||"MGA")===d).reduce((s,l)=>s+(l.mt||0),0),
  }));

  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"repeat(2,1fr)":"repeat(5,1fr)",gap:12,marginBottom:20}}>
        <KPICard label="Paiements inities" value={initiatedPaiements.length} sub={formatPaymentAmount(initiatedTotal)} color="#7c3aed" icon="CB"/>
        <KPICard label="Montant payé" value={fmtN(totalPaye)+" Ar"} color={G} icon="✅" trend={20}/>
        <KPICard label="Payements effectués" value={payes.length} color={CYAN} icon="💳"/>
        <KPICard label="Montant en attente" value={fmtN(totalEnCours)+" Ar"} color={AMBER} icon="⏳"/>
        <KPICard label="En attente de paiement" value={enCours.length} color={RED} icon="📋"/>
      </div>
      {initiatedPaiements.length>0&&(
        <div style={{...card(),padding:0,overflow:"hidden",marginBottom:16,borderLeft:"4px solid #7c3aed"}}>
          <div style={{background:"#7c3aed",padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{color:"#fff",fontSize:12,fontWeight:800,textTransform:"uppercase",letterSpacing:".08em"}}>Ordres de paiement inities</span>
            <span style={{color:"rgba(255,255,255,.85)",fontSize:12}}>{initiatedPaiements.length} ordre(s)</span>
          </div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead>
                <tr style={{background:"#f8f9fc"}}>
                  {["#","Reference","Beneficiaire","Operateur","Montant","Statut","Date initiation"].map(h=>(
                    <th key={h} style={{padding:"8px 10px",textAlign:h==="Montant"?"right":"left",fontSize:10,fontWeight:800,color:MUT,textTransform:"uppercase",letterSpacing:".04em",borderBottom:"1px solid "+BD,whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {initiatedPaiements.map((p,i)=>(
                  <tr key={p.id} style={{borderBottom:"1px solid #f0f2f5"}}>
                    <td style={{padding:"9px 10px",color:MUT,fontWeight:700}}>{i+1}</td>
                    <td style={{padding:"9px 10px",fontWeight:800,color:"#7c3aed"}}>{p.numLiq||p.id}</td>
                    <td style={{padding:"9px 10px",color:"#212529",maxWidth:240,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.fourn||"-"}</td>
                    <td style={{padding:"9px 10px",color:"#495057"}}>{p.utilisateur||p.beneficiaryOperator||"-"}</td>
                    <td style={{padding:"9px 10px",fontWeight:800,color:G,textAlign:"right"}}>{formatPaymentAmount(p.mtLocale)}</td>
                    <td style={{padding:"9px 10px"}}><span style={{fontSize:10.5,fontWeight:800,background:"#f5f0ff",color:"#7c3aed",padding:"3px 8px",borderRadius:10}}>{p.statut}</span></td>
                    <td style={{padding:"9px 10px",color:MUT,whiteSpace:"nowrap"}}>{p.dateGen||"-"}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{background:"#f5f0ff",borderTop:"2px solid #7c3aed"}}>
                  <td colSpan={4} style={{padding:"9px 10px",fontWeight:800,color:"#7c3aed",textTransform:"uppercase",fontSize:11}}>Total initie</td>
                  <td style={{padding:"9px 10px",fontWeight:900,color:G,textAlign:"right"}}>{formatPaymentAmount(initiatedTotal)}</td>
                  <td colSpan={2}/>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr",gap:16,marginBottom:16}}>
        <div style={{...card(),padding:20}}>
          <div style={{fontSize:13,fontWeight:700,color:"#1e293b",marginBottom:12}}>Répartition par devise</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={devData} layout="vertical" barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" horizontal={false}/>
              <XAxis type="number" tick={{fontSize:10,fill:"#6c757d"}} tickFormatter={v=>fmtN(v).slice(0,6)}/>
              <YAxis type="category" dataKey="name" tick={{fontSize:11,fill:"#495057"}} width={40}/>
              <Tooltip contentStyle={{fontSize:11,borderRadius:6}} formatter={v=>[fmtN(v)+" Ar","Montant"]}/>
              <Bar dataKey="total" fill={G} radius={[0,4,4,0]} name="Montant"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{...card(),padding:20}}>
          <div style={{fontSize:13,fontWeight:700,color:"#1e293b",marginBottom:12}}>Synthèse des paiements</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {[
              {label:"Total liquidations",val:all.length,color:"#324372",pct:100},
              {label:"Payées",val:payes.length,color:G,pct:all.length>0?Math.round(payes.length/all.length*100):0},
              {label:"En cours",val:enCours.length,color:AMBER,pct:all.length>0?Math.round(enCours.length/all.length*100):0},
              {label:"Annulées",val:all.filter(l=>l.st==="ANNULÉ").length,color:RED,pct:all.length>0?Math.round(all.filter(l=>l.st==="ANNULÉ").length/all.length*100):0},
            ].map(row=>(
              <div key={row.label}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <span style={{fontSize:12,color:"#495057"}}>{row.label}</span>
                  <span style={{fontSize:12,fontWeight:700,color:row.color}}>{row.val} ({row.pct}%)</span>
                </div>
                <div style={{height:6,background:"#f0f2f5",borderRadius:10}}>
                  <div style={{height:6,borderRadius:10,background:row.color,width:row.pct+"%",transition:"width .5s"}}/>
                </div>
              </div>
            ))}
          </div>
          <div style={{marginTop:16,padding:"12px 14px",background:"#f0f4ff",borderRadius:8,border:"1px solid #c7d2fe"}}>
            <div style={{fontSize:11,color:"#4f46e5",fontWeight:700,textTransform:"uppercase",marginBottom:4}}>Montant total transmis</div>
            <div style={{fontSize:22,fontWeight:900,color:"#4f46e5"}}>{fmtN(totalPaye)} Ar</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   ÉTAT 5: Par Fournisseur
───────────────────────────────────── */
function EtatFournisseurs({liq}){
  const all=liq||[];
  const[q,setQ]=useState("");
  const fourns=[...new Set(all.map(l=>l.fourn).filter(Boolean))].filter(f=>!q||f.toLowerCase().includes(q.toLowerCase())).sort();
  const totalGlobal=all.reduce((s,l)=>s+(l.mt||0),0);
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"repeat(3,1fr)",gap:12,marginBottom:20}}>
        <KPICard label="Fournisseurs actifs" value={fourns.length} color={RED} icon="🏢"/>
        <KPICard label="Montant total" value={fmtN(totalGlobal)+" Ar"} color={G} icon="💰"/>
        <KPICard label="Moy. par fournisseur" value={fourns.length>0?fmtN(Math.round(totalGlobal/fourns.length))+" Ar":"—"} color={AMBER} icon="📊"/>
      </div>
      <div style={{...card(),padding:0,overflow:"hidden"}}>
        <div style={{background:RED,padding:"12px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{color:"#fff",fontSize:12,fontWeight:700}}>Récapitulatif par fournisseur</span>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Rechercher un fournisseur…"
            style={{padding:"5px 10px",border:"none",borderRadius:5,fontSize:12,width:200,fontFamily:"inherit",outline:"none"}}/>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr style={{background:"#f8f9fc"}}>
              {["#","Fournisseur","Nb liquidations","Montant total (Ar)","Payés","En cours","% Payé"].map(h=>(
                <th key={h} style={{padding:"8px 10px",textAlign:h.includes("Montant")||h.includes("%")||h.includes("Nb")?"right":"left",fontSize:10,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".04em",borderBottom:"1px solid "+BD}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {fourns.length===0&&<tr><td colSpan={7} style={{textAlign:"center",padding:"28px",color:MUT}}>Aucun fournisseur</td></tr>}
              {fourns.map((f,i)=>{
                const fLiq=all.filter(l=>l.fourn===f);
                const mt=fLiq.reduce((s,l)=>s+(l.mt||0),0);
                const nbPaye=fLiq.filter(l=>l.st==="PAYÉ").length;
                const nbEC=fLiq.filter(l=>!["PAYÉ","ANNULÉ"].includes(l.st)).length;
                const pct=fLiq.length>0?Math.round(nbPaye/fLiq.length*100):0;
                return(
                  <tr key={f} style={{borderBottom:"1px solid #f0f2f5"}}
                    onMouseEnter={e=>e.currentTarget.style.background="#fff5f5"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{padding:"9px 10px",color:MUT,fontWeight:700,fontSize:11}}>{i+1}</td>
                    <td style={{padding:"9px 10px",fontWeight:600,color:"#212529",maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f}</td>
                    <td style={{padding:"9px 10px",textAlign:"right",fontWeight:700,color:RED}}>{fLiq.length}</td>
                    <td style={{padding:"9px 10px",textAlign:"right",fontWeight:700,color:G}}>{fmtN(mt)} Ar</td>
                    <td style={{padding:"9px 10px",textAlign:"right",color:"#1d6f42",fontWeight:600}}>{nbPaye}</td>
                    <td style={{padding:"9px 10px",textAlign:"right",color:AMBER,fontWeight:600}}>{nbEC}</td>
                    <td style={{padding:"9px 10px",textAlign:"right"}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,justifyContent:"flex-end"}}>
                        <div style={{width:40,height:4,borderRadius:10,background:"#f0f2f5",overflow:"hidden"}}>
                          <div style={{height:4,background:pct>50?G:AMBER,width:pct+"%"}}/>
                        </div>
                        <span style={{fontSize:11,fontWeight:700,color:pct>50?G:AMBER}}>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {fourns.length>0&&(
              <tfoot><tr style={{background:"#fff0f0",borderTop:"2px solid "+RED}}>
                <td colSpan={2} style={{padding:"9px 10px",fontWeight:800,color:RED,textTransform:"uppercase",fontSize:11}}>Total</td>
                <td style={{padding:"9px 10px",textAlign:"right",fontWeight:800,color:RED}}>{all.length}</td>
                <td style={{padding:"9px 10px",textAlign:"right",fontWeight:800,color:G}}>{fmtN(totalGlobal)} Ar</td>
                <td style={{padding:"9px 10px",textAlign:"right",fontWeight:800,color:"#1d6f42"}}>{all.filter(l=>l.st==="PAYÉ").length}</td>
                <td style={{padding:"9px 10px",textAlign:"right",fontWeight:800,color:AMBER}}>{all.filter(l=>!["PAYÉ","ANNULÉ"].includes(l.st)).length}</td>
                <td/>
              </tr></tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   ÉTAT 6: Par Projet / Site
───────────────────────────────────── */
function EtatProjets({liq}){
  const all=liq||[];
  const projs=[...new Set(all.map(l=>l.proj).filter(Boolean))].sort();
  const sites=[...new Set(all.map(l=>l.site).filter(Boolean))].sort();
  const noProj=all.filter(l=>!l.proj);
  const totalGlobal=all.reduce((s,l)=>s+(l.mt||0),0);
  const siteData=sites.map(s=>({name:s,liquidations:all.filter(l=>l.site===s).length,montant:all.filter(l=>l.site===s).reduce((t,l)=>t+(l.mt||0),0)/1000000}));

  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"repeat(3,1fr)",gap:12,marginBottom:20}}>
        <KPICard label="Projets actifs" value={projs.length||sites.length} color={G} icon="🗂️"/>
        <KPICard label="Sites impliqués" value={sites.length} color={CYAN} icon="📍"/>
        <KPICard label="Montant total" value={fmtN(totalGlobal)+" Ar"} color={PURPLE} icon="💰"/>
      </div>
      {siteData.length>0&&(
        <div style={{...card(),padding:20,marginBottom:16}}>
          <div style={{fontSize:13,fontWeight:700,color:"#1e293b",marginBottom:12}}>Répartition par site</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={siteData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5"/>
              <XAxis dataKey="name" tick={{fontSize:11,fill:"#6c757d"}}/>
              <YAxis yAxisId="l" tick={{fontSize:11,fill:"#6c757d"}} allowDecimals={false}/>
              <YAxis yAxisId="r" orientation="right" tick={{fontSize:11,fill:"#6c757d"}} unit="MAr"/>
              <Tooltip contentStyle={{fontSize:12,borderRadius:6}}/>
              <Legend iconSize={9} wrapperStyle={{fontSize:11}}/>
              <Bar yAxisId="l" dataKey="liquidations" fill={G} radius={[3,3,0,0]} name="Liquidations"/>
              <Bar yAxisId="r" dataKey="montant" fill={PURPLE} radius={[3,3,0,0]} name="Montant (MAr)"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      <div style={{...card(),padding:0,overflow:"hidden"}}>
        <div style={{background:G,padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{color:"#fff",fontSize:12,fontWeight:700}}>Détail par site</span>
          <span style={{color:"rgba(255,255,255,.7)",fontSize:12}}>{sites.length} site{sites.length!==1?"s":""}</span>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr style={{background:"#f8f9fc"}}>
              {["Site","Nb liquidations","Montant total (Ar)","Payé","En cours"].map(h=>(
                <th key={h} style={{padding:"8px 10px",textAlign:h==="Site"?"left":"right",fontSize:10,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".04em",borderBottom:"1px solid "+BD}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {sites.length===0&&<tr><td colSpan={5} style={{textAlign:"center",padding:"28px",color:MUT}}>Aucune donnée de site disponible</td></tr>}
              {sites.map((s,i)=>{
                const sLiq=all.filter(l=>l.site===s);
                const mt=sLiq.reduce((t,l)=>t+(l.mt||0),0);
                const nbPaye=sLiq.filter(l=>l.st==="PAYÉ").length;
                const nbEC=sLiq.filter(l=>!["PAYÉ","ANNULÉ"].includes(l.st)).length;
                return(
                  <tr key={s} style={{borderBottom:"1px solid #f0f2f5"}}
                    onMouseEnter={e=>e.currentTarget.style.background="#f0fdf4"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{padding:"9px 10px",fontWeight:700,color:G}}>{s}</td>
                    <td style={{padding:"9px 10px",textAlign:"right",fontWeight:700,color:PURPLE}}>{sLiq.length}</td>
                    <td style={{padding:"9px 10px",textAlign:"right",fontWeight:700,color:G}}>{fmtN(mt)} Ar</td>
                    <td style={{padding:"9px 10px",textAlign:"right",color:"#1d6f42",fontWeight:600}}>{nbPaye}</td>
                    <td style={{padding:"9px 10px",textAlign:"right",color:AMBER,fontWeight:600}}>{nbEC}</td>
                  </tr>
                );
              })}
              {noProj.length>0&&(
                <tr style={{borderBottom:"1px solid #f0f2f5",background:"#fafbfc"}}>
                  <td style={{padding:"9px 10px",fontWeight:600,color:MUT,fontStyle:"italic"}}>Sans projet</td>
                  <td style={{padding:"9px 10px",textAlign:"right",color:MUT}}>{noProj.length}</td>
                  <td style={{padding:"9px 10px",textAlign:"right",color:MUT}}>{fmtN(noProj.reduce((s,l)=>s+(l.mt||0),0))} Ar</td>
                  <td colSpan={2}/>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────── */
export default function EPEtatsRapports(){
  const{liq,view,epPaiements=[]}=useApp();
  const activeId=REPORTS.find(r=>r.id===view)?.id||"ep-kpi";
  const cur=REPORTS.find(r=>r.id===activeId)||REPORTS[0];
  const color=REPORT_COLORS[activeId]||G;

  return(
    <div style={{animation:"fadeIn .2s ease"}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20,paddingBottom:16,borderBottom:"1px solid "+BD}}>
        <div style={{width:4,height:48,borderRadius:4,background:color,flexShrink:0}}/>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}>
            <span style={{fontSize:11,fontWeight:800,color,textTransform:"uppercase",letterSpacing:".1em",background:color+"15",padding:"2px 8px",borderRadius:10}}>
              {cur.icon} État {cur.num}
            </span>
          </div>
          <h2 style={{fontSize:20,fontWeight:800,color:"#1e293b",margin:0,letterSpacing:"-.3px"}}>{cur.label}</h2>
          <p style={{fontSize:12,color:MUT,margin:0}}>{cur.sub} · {(liq||[]).length} liquidations au total</p>
        </div>
      </div>

      {/* Report content */}
      {activeId==="ep-kpi"    && <EtatKPI liq={liq}/>}
      {activeId==="ep-r-liq"  && <EtatLiquidations liq={liq}/>}
      {activeId==="ep-r-gen"  && <EtatGenerations liq={liq}/>}
      {activeId==="ep-r-pai"  && <EtatPaiements liq={liq} paiements={epPaiements}/>}
      {activeId==="ep-r-four" && <EtatFournisseurs liq={liq}/>}
      {activeId==="ep-r-proj" && <EtatProjets liq={liq}/>}
    </div>
  );
}
