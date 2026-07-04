"use client";
import{useState,useRef}from"react";
import{IC}from"../ui/Icons";
import{Badge}from"../ui/Badge";
import{ExportButtons}from"../ui/ExportButtons";
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
  const[typeF,setTypeF]=useState([]); // multi-select checkbox dropdown
  const[typeDropOpen,setTypeDropOpen]=useState(false);
  const tableRef=useRef(null);
  const{types}=useApp();

  const filtered=docs.filter(d=>{
    const sq=q.toLowerCase();
    return(!q||(d.id.toLowerCase().includes(sq)||(d.fourn||"").toLowerCase().includes(sq)||d.type.toLowerCase().includes(sq)||(d.site||"").toLowerCase().includes(sq)))
      &&(!statusF||d.st===statusF)
      &&(!siteF||d.site===siteF)
      &&(typeF.length===0||typeF.includes(d.type));
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
          <ExportButtons
            filename={title.toLowerCase().replace(/\s/g,"_")}
            title={title}
            tableRef={tableRef}
            headers={["ID","Type","Fournisseur","Projet","Site","Montant","Statut","Date","OCR%"]}
            rows={filtered.map(d=>[d.id,d.type,d.fourn||"",d.proj||"",d.site||"",d.mt,d.st,d.date,d.ocr+"%"])}
          />
        </div>

        {/* Filters */}
        <div style={{padding:"10px 20px",background:"#f8f9fc",borderBottom:`1px solid ${BD}`,display:"flex",gap:10,flexWrap:"wrap"}}>
          <div style={{position:"relative",flex:"1 1 200px"}}>
            <span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:"#adb5bd",display:"flex"}}>{IC.search}</span>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Référence, fournisseur, site…"
              style={{...inp({paddingLeft:32,fontSize:13})}}/>
          </div>
          {/* Type checkbox dropdown */}
          <div style={{position:"relative"}}>
            <button onClick={()=>setTypeDropOpen(p=>!p)}
              style={{...inp({width:"auto",fontSize:13,minWidth:160,display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,cursor:"pointer",userSelect:"none",padding:"0 12px"}),height:36}}>
              <span>{typeF.length>0?`Types (${typeF.length})`:"Tous types"}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points={typeDropOpen?"18 15 12 9 6 15":"6 9 12 15 18 9"}/></svg>
            </button>
            {typeDropOpen&&(
              <div style={{position:"absolute",top:"calc(100% + 4px)",left:0,zIndex:999,background:"#fff",border:"1px solid #dee2e6",borderRadius:8,boxShadow:"0 8px 24px rgba(0,0,0,.12)",minWidth:220,maxHeight:280,overflowY:"auto",padding:"6px 0"}}>
                <div style={{display:"flex",justifyContent:"space-between",padding:"4px 12px 8px",borderBottom:"1px solid #f0f0f0",marginBottom:4}}>
                  <span style={{fontSize:11,fontWeight:700,color:"#6c757d",textTransform:"uppercase"}}>Filtrer par type</span>
                  {typeF.length>0&&<button onClick={()=>setTypeF([])} style={{fontSize:11,color:"#1ecad3",background:"none",border:"none",cursor:"pointer",padding:0}}>Tout effacer</button>}
                </div>
                {[...new Set(docs.map(d=>d.type).filter(Boolean))].map(typ=>{
                  const checked=typeF.includes(typ);
                  return(
                    <label key={typ} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 14px",cursor:"pointer",background:checked?"#f0f4ff":"transparent",transition:"background .1s"}}
                      onMouseEnter={e=>{if(!checked)e.currentTarget.style.background="#f8f9fc";}}
                      onMouseLeave={e=>{if(!checked)e.currentTarget.style.background="transparent";}}>
                      <input type="checkbox" checked={checked} onChange={()=>setTypeF(p=>checked?p.filter(x=>x!==typ):[...p,typ])} style={{accentColor:"#1ecad3",width:14,height:14}}/>
                      <span style={{fontSize:13,color:"#212529",fontWeight:checked?600:400}}>{typ}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
          <select value={statusF} onChange={e=>setStatusF(e.target.value)} style={{...inp({width:"auto",fontSize:13,minWidth:150})}}>
            <option value="">Tous statuts</option>
            {statuses.map(s=><option key={s}>{s}</option>)}
          </select>
          <select value={siteF} onChange={e=>setSiteF(e.target.value)} style={{...inp({width:"auto",fontSize:13,minWidth:140})}}>
            <option value="">Tous sites</option>
            {sites.map(s=><option key={s}>{s}</option>)}
          </select>
          {(q||statusF||siteF||typeF.length>0)&&(
            <button onClick={()=>{setQ("");setStatusF("");setSiteF("");setTypeF([]);setTypeDropOpen(false);}} style={btn("light",true)}>
              <span style={{display:"flex"}}>{IC.x}</span> Effacer
            </button>
          )}
        </div>

        {/* Table */}
        <div style={{overflowX:"auto"}}>
          <table ref={tableRef} style={{width:"100%",borderCollapse:"collapse"}}>
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
