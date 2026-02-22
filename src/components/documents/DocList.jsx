"use client";
import{useState}from"react";
import{IC}from"../ui/Icons";
import{Badge}from"../ui/Badge";
import{card,btn,inp,TH,TD,P,BD,MUT,WH}from"../../lib/theme";
import{fmtN}from"../../lib/utils";
import{useApp}from"../../context/AppContext";

/* Map type name → IC key */
const typeIconKey={
  "Facture":"fileText","Bon de livraison":"truck","Contrat":"clipboard","Rapport":"barChart",
};

export function DocList({title,iconKey="file",docs,onSel}){
  const[q,setQ]=useState("");
  const[statusF,setStatusF]=useState("");
  const[siteF,setSiteF]=useState("");
  const{types}=useApp();

  const filtered=docs.filter(d=>{
    const sq=q.toLowerCase();
    return(!q||(d.id.toLowerCase().includes(sq)||(d.fourn||"").toLowerCase().includes(sq)||d.type.toLowerCase().includes(sq)||(d.site||"").toLowerCase().includes(sq)))
      &&(!statusF||d.st===statusF)
      &&(!siteF||d.site===siteF);
  });

  const statuses=[...new Set(docs.map(d=>d.st))];
  const sites=[...new Set(docs.map(d=>d.site).filter(Boolean))];

  return(
    <div style={{animation:"fadeIn .2s ease"}}>
      <div style={{...card(),marginBottom:16,overflow:"visible"}}>
        {/* Header */}
        <div style={{padding:"14px 20px",borderBottom:`1px solid ${BD}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{display:"flex",color:P}}>{IC[iconKey]||IC.folder}</span>
            <div>
              <div style={{fontSize:15,fontWeight:700,color:"#212529"}}>{title}</div>
              <div style={{fontSize:12,color:MUT}}>{filtered.length} document{filtered.length!==1?"s":""}</div>
            </div>
          </div>
          <button style={btn("light",true)}>
            <span style={{display:"flex"}}>{IC.dl}</span> Exporter
          </button>
        </div>

        {/* Filters */}
        <div style={{padding:"10px 20px",background:"#f8f9fc",borderBottom:`1px solid ${BD}`,display:"flex",gap:10,flexWrap:"wrap"}}>
          <div style={{position:"relative",flex:"1 1 200px"}}>
            <span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:"#adb5bd",display:"flex"}}>{IC.search}</span>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Référence, fournisseur, site…"
              style={{...inp({paddingLeft:32,fontSize:13})}}/>
          </div>
          <select value={statusF} onChange={e=>setStatusF(e.target.value)} style={{...inp({width:"auto",fontSize:13,minWidth:160})}}>
            <option value="">Tous statuts</option>
            {statuses.map(s=><option key={s}>{s}</option>)}
          </select>
          <select value={siteF} onChange={e=>setSiteF(e.target.value)} style={{...inp({width:"auto",fontSize:13,minWidth:150})}}>
            <option value="">Tous sites</option>
            {sites.map(s=><option key={s}>{s}</option>)}
          </select>
          {(q||statusF||siteF)&&(
            <button onClick={()=>{setQ("");setStatusF("");setSiteF("");}} style={btn("light",true)}>
              <span style={{display:"flex"}}>{IC.x}</span> Effacer
            </button>
          )}
        </div>

        {/* Table */}
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead>
              <tr>{["Référence","Type","Fournisseur","Site","Montant","Statut","OCR","Date"].map(h=><th key={h} style={TH}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.length===0&&(
                <tr><td colSpan={8} style={{...TD,textAlign:"center",color:MUT,padding:32}}>
                  <span style={{display:"flex",justifyContent:"center",marginBottom:8,opacity:.4}}>{IC.emptyBox}</span>
                  <div style={{fontSize:13}}>Aucun document trouvé</div>
                </td></tr>
              )}
              {filtered.map(d=>{
                const ik=typeIconKey[d.type]||"file";
                return(
                  <tr key={d.id} onClick={()=>onSel(d)}
                    style={{cursor:"pointer",transition:"background .12s"}}
                    onMouseEnter={e=>e.currentTarget.style.background="#f8f9fc"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={TD}>
                      <div style={{fontWeight:600,color:P,fontSize:13}}>{d.id}</div>
                      <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:2}}>
                        {d.origin==="portail-fournisseur"&&(
                          <span style={{display:"inline-flex",alignItems:"center",gap:3,fontSize:10,background:"#e8f5ff",color:"#1560bd",padding:"1px 6px",borderRadius:3,fontWeight:600,border:"1px solid #b8d9f5"}}>
                            Portail web
                          </span>
                        )}
                        {d.conf&&<span style={{display:"inline-flex",alignItems:"center",gap:3,fontSize:10,color:"#5e1d8a"}}>
                          <span style={{display:"flex"}}>{IC.lock}</span> Confidentiel
                        </span>}
                      </div>
                    </td>
                    <td style={TD}>
                      <span style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:12,color:"#495057"}}>
                        <span style={{display:"flex",color:P}}>{IC[ik]||IC.file}</span>{d.type}
                      </span>
                    </td>
                    <td style={{...TD,fontSize:12}}>{d.fourn||<span style={{color:MUT}}>—</span>}</td>
                    <td style={TD}>
                      <span style={{fontSize:11,background:"#eef1f8",color:P,padding:"2px 8px",borderRadius:3,fontWeight:500}}>{d.site||"—"}</span>
                    </td>
                    <td style={{...TD,fontWeight:600,color:"#212529",whiteSpace:"nowrap"}}>{fmtN(d.mtR)}</td>
                    <td style={TD}><Badge s={d.st}/></td>
                    <td style={TD}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <div style={{flex:1,background:"#e9ecef",borderRadius:3,height:5,minWidth:50}}>
                          <div style={{width:`${d.ocr}%`,height:"100%",background:d.ocr>=85?"#28a745":d.ocr>=70?"#ffc107":"#dc3545",borderRadius:3}}/>
                        </div>
                        <span style={{fontSize:11,color:"#6c757d",whiteSpace:"nowrap"}}>{d.ocr}%</span>
                      </div>
                    </td>
                    <td style={{...TD,color:"#6c757d",fontSize:12,whiteSpace:"nowrap"}}>{d.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
