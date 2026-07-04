"use client";
import{useState}from"react";
import{useApp}from"../../context/AppContext";
import{card,bdg,btn,inp,MUT,P,WH,BD,SUCL,SUCD,DNGL,DNGD,BG,TR}from"../../lib/theme";
import{fmtN}from"../../lib/utils";
import{formatPaymentAmount,isPaymentInitiated}from"../../lib/epaiementPayments";

const G="#1a6b3c"; // E-paiement green

function KPI({label,value,sub,color,icon}){
  return(
    <div style={{...card(),padding:"18px 20px",borderLeft:"4px solid "+color}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
        <span style={{fontSize:18}}>{icon}</span>
        <span style={{fontSize:11,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".06em"}}>{label}</span>
      </div>
      <div style={{fontSize:26,fontWeight:900,color,lineHeight:1.1}}>{value}</div>
      {sub&&<div style={{fontSize:11.5,color:MUT,marginTop:3}}>{sub}</div>}
    </div>
  );
}

const STATUT_COLORS={"Générer":"#28a745","Non générer":"#6c757d","Annulé":"#dc3545","En cours":"#f5a623","PAYÉ":"#1ecad3"};

export default function EPaiementDashboard(){
  const{liq,projets,setView,epPaiements=[]}=useApp();
  const[filterSt,setFilterSt]=useState("");
  const[filterProj,setFilterProj]=useState("");
  const[q,setQ]=useState("");

  // Compute stats from liq
  const all=liq||[];
  const allImputations=all.flatMap(l=>(l.imputations||[]).map(imp=>({...imp,liqId:l.numero||l.id,liqRang:imp.id,site:l.site,st:l.st,fourn:imp.auxFourn,libelle:imp.libelle,mtLocale:imp.mtMGA||0,mtDevise:imp.mtUSD||0,mtRapport:imp.mtDevise||0})));

  const totalMt=allImputations.reduce((s,i)=>s+(i.mtLocale||0),0);
  const initiatedPayments=(epPaiements||[]).filter(isPaymentInitiated);
  const initiatedAmount=initiatedPayments.reduce((s,p)=>s+(p.mtLocale||0),0);
  const nbGeneres=all.filter(l=>l.st==="PAYÉ"||l.syncTompro).length;
  const nbEnCours=all.filter(l=>l.st!=="PAYÉ").length;
  const nbAnnules=all.filter(l=>l.st==="ANNULÉ").length;

  // Filter
  const filtered=allImputations.filter(imp=>{
    if(filterSt&&imp.st!==filterSt)return false;
    if(q&&!imp.liqId?.toLowerCase().includes(q.toLowerCase())&&!imp.fourn?.toLowerCase().includes(q.toLowerCase()))return false;
    return true;
  });

  const STATUTS=["Générer","Non générer","Annulé","PAYÉ"];

  return(
    <div style={{animation:"fadeIn .25s ease"}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <div>
          <h2 style={{fontSize:20,fontWeight:800,color:"#212529",marginBottom:2}}>Tableau de bord — Liquidations</h2>
          <p style={{fontSize:13,color:MUT}}>Suivi des liquidations et ordres de paiement</p>
        </div>
        <button onClick={()=>setView("ep-liq")}
          style={{...btn("primary"),background:G,borderColor:G,display:"flex",alignItems:"center",gap:8}}>
          + Nouvelle liquidation
        </button>
      </div>

      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"repeat(2,1fr)":"repeat(5,1fr)",gap:12,marginBottom:20}}>
        <KPI icon="CB" value={initiatedPayments.length} label="Paiements inities" color="#7c3aed" sub={formatPaymentAmount(initiatedAmount)}/>
        <KPI icon="📋" value={all.length} label="Total liquidations" color={G} sub="Toutes périodes"/>
        <KPI icon="✅" value={nbGeneres} label="Fichiers générés" color="#28a745" sub="Transmis banque"/>
        <KPI icon="⏳" value={nbEnCours} label="En cours" color="#f5a623" sub="À traiter"/>
        <KPI icon="💰" value={fmtN(totalMt)} label="Montant total (MGA)" color="#1ecad3" sub="Ar"/>
      </div>

      {/* Summary cards par statut */}
      <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"repeat(3,1fr)",gap:12,marginBottom:24}}>
        {STATUTS.slice(0,3).map(st=>{
          const nb=all.filter(l=>{
            if(st==="Générer") return l.syncTompro||l.st==="PAYÉ";
            if(st==="Non générer") return !l.syncTompro&&l.st!=="ANNULÉ"&&l.st!=="PAYÉ";
            if(st==="Annulé") return l.st==="ANNULÉ";
            return false;
          }).length;
          const mt=allImputations.filter(()=>true).reduce((s,i)=>s+(i.mtLocale||0),0);
          const c=st==="Générer"?"#28a745":st==="Annulé"?"#dc3545":"#6c757d";
          return(
            <div key={st} style={{...card(),padding:"16px 20px",display:"flex",alignItems:"center",gap:16}}>
              <div style={{width:44,height:44,borderRadius:10,background:c+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>
                {st==="Générer"?"✅":st==="Annulé"?"❌":"⏳"}
              </div>
              <div>
                <div style={{fontSize:22,fontWeight:900,color:c}}>{nb}</div>
                <div style={{fontSize:12,color:MUT,fontWeight:500}}>{st}</div>
              </div>
            </div>
          );
        })}
        <div style={{...card(),padding:"16px 20px",display:"flex",alignItems:"center",gap:16}}>
          <div style={{width:44,height:44,borderRadius:10,background:"#7c3aed18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:"#7c3aed",flexShrink:0}}>VP</div>
          <div>
            <div style={{fontSize:22,fontWeight:900,color:"#7c3aed"}}>{initiatedPayments.length}</div>
            <div style={{fontSize:12,color:MUT,fontWeight:500}}>Paiement initie</div>
          </div>
        </div>
      </div>

      {initiatedPayments.length>0&&(
        <div style={{...card(),padding:0,overflow:"hidden",marginBottom:16,borderLeft:"4px solid #7c3aed"}}>
          <div style={{padding:"10px 16px",background:"#f5f0ff",display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}>
            <span style={{fontSize:12,fontWeight:800,color:"#7c3aed",textTransform:"uppercase",letterSpacing:".08em"}}>Paiements mock inities</span>
            <span style={{fontSize:12,fontWeight:700,color:"#7c3aed"}}>{formatPaymentAmount(initiatedAmount)}</span>
          </div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead>
                <tr style={{background:"#fafbfc"}}>
                  {["Reference","Beneficiaire","Operateur","Montant","Statut","Date"].map(h=>(
                    <th key={h} style={{padding:"8px 12px",textAlign:h==="Montant"?"right":"left",fontSize:10,fontWeight:800,color:MUT,textTransform:"uppercase",borderBottom:"1px solid "+BD,whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {initiatedPayments.slice(0,5).map(p=>(
                  <tr key={p.id} style={{borderBottom:"1px solid #f0f2f5"}}>
                    <td style={{padding:"9px 12px",fontWeight:800,color:"#7c3aed"}}>{p.numLiq||p.id}</td>
                    <td style={{padding:"9px 12px",color:"#212529",maxWidth:260,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.fourn||"-"}</td>
                    <td style={{padding:"9px 12px",color:"#495057"}}>{p.utilisateur||p.beneficiaryOperator||"-"}</td>
                    <td style={{padding:"9px 12px",textAlign:"right",fontWeight:800,color:G}}>{formatPaymentAmount(p.mtLocale)}</td>
                    <td style={{padding:"9px 12px"}}><span style={{fontSize:11,fontWeight:800,color:"#7c3aed",background:"#f5f0ff",padding:"3px 9px",borderRadius:10}}>{p.statut}</span></td>
                    <td style={{padding:"9px 12px",color:MUT,whiteSpace:"nowrap"}}>{p.dateGen||"-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{...card(),padding:"14px 18px",marginBottom:14,display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
        <input placeholder="🔍 Rechercher N° liquidation, fournisseur…" value={q} onChange={e=>setQ(e.target.value)}
          style={{...inp({padding:"7px 12px",fontSize:12.5,flex:"1",minWidth:200})}}/>
        <select value={filterSt} onChange={e=>setFilterSt(e.target.value)} style={{...inp({padding:"7px 10px",fontSize:12.5,width:160})}}>
          <option value="">Tous statuts</option>
          {STATUTS.map(s=><option key={s}>{s}</option>)}
        </select>
        {(q||filterSt)&&<button onClick={()=>{setQ("");setFilterSt("");}} style={{...btn("light",true),padding:"6px 12px",fontSize:12}}>✕ Effacer</button>}
      </div>

      {/* RÉSULTATS Table */}
      <div style={{...card(),overflow:"hidden"}}>
        <div style={{background:G,padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{color:"#fff",fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em"}}>RÉSULTATS</span>
          <span style={{color:"rgba(255,255,255,.7)",fontSize:12}}>{filtered.length} ligne(s)</span>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead>
              <tr style={{background:"#f8f9fc"}}>
                {["#","N° Liquidation","Rang","Fournisseur","Libellé","Montant Locale","Montant Devise","Montant Rapport","Statut","Lien Documentaire","Détails"].map(h=>(
                  <th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:10.5,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".05em",borderBottom:"1px solid "+BD,whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0,30).map((imp,i)=>{
                const stColor=imp.syncTompro||imp.st==="PAYÉ"?"#28a745":imp.st==="ANNULÉ"?"#dc3545":"#6c757d";
                const stLabel=imp.syncTompro||imp.st==="PAYÉ"?"Générer":imp.st==="ANNULÉ"?"Annuler":"Non générer";
                return(
                  <tr key={i} style={{borderBottom:"1px solid #f0f2f5"}}
                    onMouseEnter={e=>e.currentTarget.style.background="#f8fff9"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{padding:"10px 12px",fontSize:12,color:MUT,fontWeight:700}}>{i+1}</td>
                    <td style={{padding:"10px 12px",fontSize:12,fontWeight:700,color:G}}>{imp.liqId}</td>
                    <td style={{padding:"10px 12px",fontSize:12,color:"#495057"}}>{imp.rang||"1"}</td>
                    <td style={{padding:"10px 12px",fontSize:12,color:"#212529",maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{imp.fourn||"—"}</td>
                    <td style={{padding:"10px 12px",fontSize:12,color:"#495057",maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{imp.libelle||"—"}</td>
                    <td style={{padding:"10px 12px",fontSize:12,fontWeight:600,color:"#212529"}}>{fmtN(imp.mtLocale)}</td>
                    <td style={{padding:"10px 12px",fontSize:12,color:"#495057"}}>{(imp.mtDevise||0).toFixed(2)}</td>
                    <td style={{padding:"10px 12px",fontSize:12,color:"#495057"}}>{(imp.mtRapport||0).toFixed(2)}</td>
                    <td style={{padding:"10px 12px"}}>
                      <span style={{fontSize:11,fontWeight:700,color:stColor,background:stColor+"15",padding:"3px 10px",borderRadius:10}}>{stLabel}</span>
                    </td>
                    <td style={{padding:"10px 12px",fontSize:11,color:"#1ecad3"}}>{imp.lienDoc||"—"}</td>
                    <td style={{padding:"10px 12px"}}>
                      <button style={{width:30,height:30,borderRadius:8,background:"#212529",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length===0&&<div style={{textAlign:"center",padding:"32px 0",color:MUT,fontSize:13}}>Aucune liquidation trouvée</div>}
        </div>
      </div>
    </div>
  );
}
