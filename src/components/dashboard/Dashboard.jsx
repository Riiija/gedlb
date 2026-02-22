"use client";
import{BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,PieChart,Pie,Cell}from"recharts";
import{useApp}from"../../context/AppContext";
import{fmtN}from"../../lib/utils";
import{P,PLt,WH,BD,SUCL,SUCD,DNGL,DNGD,MUT,card,bdg,TR,SHADOW}from"../../lib/theme";
import{Badge}from"../ui/Badge";
import{IC}from"../ui/Icons";

function StatCard({icon,value,label,color,trend}){
  return(
    <div style={{...card(),padding:18,display:"flex",gap:14,alignItems:"flex-start"}}>
      <div style={{width:44,height:44,borderRadius:8,background:`${color}18`,display:"flex",alignItems:"center",justifyContent:"center",color,flexShrink:0}}>
        <span style={{display:"flex"}}>{icon}</span>
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:22,fontWeight:700,color:"#212529",lineHeight:1}}>{value}</div>
        <div style={{fontSize:12.5,color:MUT,marginTop:3}}>{label}</div>
      </div>
      {trend!==undefined&&(
        <span style={bdg(trend>0?SUCL:DNGL,trend>0?SUCD:DNGD,{fontSize:11})}>
          {trend>0?"+":""}{trend}%
        </span>
      )}
    </div>
  );
}

export default function Dashboard(){
  const{docs,setView,openDoc}=useApp();

  const total=docs.length;
  const enCours=docs.filter(d=>["EN VALIDATION","EN RETARD"].includes(d.st)).length;
  const valides=docs.filter(d=>["VALIDÉ","BON À PAYER","PAYÉ"].includes(d.st)).length;
  const retards=docs.filter(d=>d.st==="EN RETARD").length;
  const bap=docs.filter(d=>d.bap&&d.st==="BON À PAYER").length;
  const mtTotal=docs.reduce((s,d)=>s+(d.mtR||0),0);
  const mtBap=docs.filter(d=>d.bap).reduce((s,d)=>s+(d.mtR||0),0);

  const chartStatus=[
    {name:"Reçu",     v:docs.filter(d=>d.st==="REÇU").length,     color:"#17a2b8"},
    {name:"En cours", v:enCours,                                    color:"#ffc107"},
    {name:"Validé",   v:valides,                                    color:"#28a745"},
    {name:"Rejeté",   v:docs.filter(d=>d.st==="REJETÉ").length,    color:"#dc3545"},
    {name:"Archivé",  v:docs.filter(d=>d.st==="ARCHIVÉ").length,   color:"#6c757d"},
  ];

  const bySite=["Antananarivo","Fianarantsoa","Toamasina","Toliara","Mahajanga"]
    .map(s=>({name:s.slice(0,7),full:s,v:docs.filter(d=>d.site===s).length}))
    .filter(x=>x.v>0);

  const monthly=[
    {m:"Oct",reçus:3,validés:2,retards:0},{m:"Nov",reçus:4,validés:3,retards:1},
    {m:"Déc",reçus:5,validés:4,retards:1},{m:"Jan",reçus:total,validés:valides,retards},
  ];

  /* Icon size variant for stat cards */
  const ic24=(el)=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{el.props?.dangerouslySetInnerHTML?undefined:el.props?.children}</svg>;

  return(
    <div style={{animation:"fadeIn .25s ease"}}>
      {/* Row 1 — KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:16}}>
        <StatCard icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>} value={total} label="Total documents" color="#324372" trend={12}/>
        <StatCard icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>} value={enCours} label="En cours" color="#ffc107"/>
        <StatCard icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>} value={valides} label="Validés" color="#28a745" trend={8}/>
        <StatCard icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>} value={retards} label="En retard" color="#dc3545"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:18}}>
        <StatCard icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>} value={fmtN(mtTotal)} label="Montant total engagé" color="#4a5e96"/>
        <StatCard icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 22 7 2 7"/></svg>} value={bap} label="Bon à payer" color="#17a2b8"/>
        <StatCard icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>} value={fmtN(mtBap)} label="Montant à payer" color="#28a745"/>
      </div>

      {/* Charts */}
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14,marginBottom:16}}>
        <div style={{...card(),padding:20}}>
          <div style={{fontSize:13,fontWeight:700,color:"#212529",marginBottom:14}}>Évolution mensuelle</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthly} barSize={10}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
              <XAxis dataKey="m" tick={{fontSize:12,fill:"#6c757d"}}/>
              <YAxis tick={{fontSize:12,fill:"#6c757d"}} allowDecimals={false}/>
              <Tooltip contentStyle={{fontSize:12,borderRadius:4}}/>
              <Bar dataKey="reçus"   fill={P}    radius={[3,3,0,0]}/>
              <Bar dataKey="validés" fill="#28a745" radius={[3,3,0,0]}/>
              <Bar dataKey="retards" fill="#dc3545" radius={[3,3,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{...card(),padding:20}}>
          <div style={{fontSize:13,fontWeight:700,color:"#212529",marginBottom:12}}>Statuts</div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={chartStatus} cx="50%" cy="50%" innerRadius={36} outerRadius={60} dataKey="v" paddingAngle={2}>
                {chartStatus.map((e,i)=><Cell key={i} fill={e.color}/>)}
              </Pie>
              <Tooltip contentStyle={{fontSize:11,borderRadius:4}}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,marginTop:8}}>
            {chartStatus.map(e=>(
              <div key={e.name} style={{display:"flex",alignItems:"center",gap:5,fontSize:11}}>
                <span style={{width:8,height:8,borderRadius:"50%",background:e.color,flexShrink:0}}/>
                <span style={{color:"#6c757d"}}>{e.name}</span>
                <b style={{marginLeft:"auto",color:"#212529"}}>{e.v}</b>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {/* Site distribution */}
        <div style={{...card(),padding:20}}>
          <div style={{fontSize:13,fontWeight:700,color:"#212529",marginBottom:14}}>Répartition par site</div>
          <div>
            {bySite.map(s=>(
              <div key={s.name} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <span style={{fontSize:12,color:"#6c757d",width:70,flexShrink:0}}>{s.full.slice(0,8)}</span>
                <div style={{flex:1,background:"#e9ecef",borderRadius:3,height:8}}>
                  <div style={{width:`${(s.v/total)*100}%`,height:"100%",background:PLt,borderRadius:3}}/>
                </div>
                <span style={{fontSize:12,fontWeight:700,color:"#212529",width:20,textAlign:"right"}}>{s.v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent docs */}
        <div style={{...card(),padding:20}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
            <span style={{fontSize:13,fontWeight:700,color:"#212529"}}>Documents récents</span>
            <button onClick={()=>setView("en-cours")} style={{fontSize:12,color:P,background:"none",border:"none",cursor:"pointer",fontWeight:600}}>Voir tout →</button>
          </div>
          {docs.slice(-5).reverse().map(d=>{
            const typeIcon={Facture:IC.fileText,Contrat:IC.clipboard,"Bon de livraison":IC.truck,Rapport:IC.barChart}[d.type]||IC.file;
            return(
              <div key={d.id} onClick={()=>openDoc(d,"en-cours")}
                style={{display:"flex",alignItems:"center",gap:10,padding:"8px 6px",borderBottom:"1px solid #f0f2f5",cursor:"pointer",borderRadius:4,transition:TR}}
                onMouseEnter={e=>e.currentTarget.style.background="#f8f9fc"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <span style={{display:"flex",color:PLt,flexShrink:0}}>{typeIcon}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12.5,fontWeight:600,color:"#212529",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{d.id}</div>
                  <div style={{fontSize:11,color:"#6c757d"}}>{d.fourn||d.type} · {d.site}</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <Badge s={d.st} sm/>
                  <div style={{fontSize:11,color:"#6c757d",marginTop:2}}>{fmtN(d.mtR)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
