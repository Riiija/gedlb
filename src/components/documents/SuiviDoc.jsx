"use client";
import{useState}from"react";
import{IC}from"../ui/Icons";
import{Badge}from"../ui/Badge";
import{card,btn,inp,bdg,P,BD,MUT,SUC,SUCL,SUCD,DNG,DNGL,WRN,WRNL,RSm}from"../../lib/theme";
import{fmtN}from"../../lib/utils";
import{useApp}from"../../context/AppContext";

export function SuiviDoc(){
  const{docs,openDoc}=useApp();
  const[ref,setRef]=useState("");
  const[result,setResult]=useState(null);
  const[searched,setSearched]=useState(false);

  function search(){
    setSearched(true);
    const q=ref.trim().toLowerCase();
    const d=docs.find(x=>x.id.toLowerCase()===q||x.ch?.numero?.toLowerCase()===q||(x.fourn||"").toLowerCase().includes(q));
    setResult(d||null);
  }

  return(
    <div style={{maxWidth:700,margin:"0 auto",animation:"fadeIn .2s ease"}}>
      <h2 style={{fontSize:18,fontWeight:700,color:"#212529",marginBottom:20}}>Suivi de document</h2>

      {/* Search */}
      <div style={{...card(),padding:24,marginBottom:20}}>
        <div style={{display:"flex",gap:10}}>
          <input value={ref} onChange={e=>setRef(e.target.value)} onKeyDown={e=>e.key==="Enter"&&search()}
            placeholder="Référence doc, N° facture, nom fournisseur…"
            style={{...inp({fontSize:14}),flex:1}}/>
          <button onClick={search} style={btn("primary")}>{IC.search} Rechercher</button>
        </div>
      </div>

      {/* Results */}
      {searched&&!result&&(
        <div style={{...card(),padding:32,textAlign:"center"}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:12,opacity:.35,color:P}}><span style={{display:"flex"}}>{IC.search}</span></div>
          <div style={{fontSize:14,color:MUT}}>Aucun document trouvé pour "<b>{ref}</b>"</div>
        </div>
      )}
      {result&&(
        <div style={{...card()}}>
          <div style={{padding:"16px 20px",borderBottom:`1px solid ${BD}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontSize:16,fontWeight:700,color:"#212529"}}>{result.id}</div>
              <div style={{fontSize:12,color:MUT}}>{result.type} · {result.fourn||"—"} · {result.date}</div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <Badge s={result.st}/>
              <button onClick={()=>openDoc(result,"en-cours")} style={btn("primary",true)}>{IC.eye} Détail</button>
            </div>
          </div>
          <div style={{padding:20}}>
            {/* Progress */}
            <div style={{marginBottom:20}}>
              <div style={{fontSize:12,fontWeight:700,color:"#495057",textTransform:"uppercase",letterSpacing:".06em",marginBottom:12}}>Circuit de validation</div>
              <div style={{display:"flex",gap:4}}>
                {result.etapes?.map((e,i)=>{
                  const col=e.statut==="VALIDÉ"?SUC:e.statut==="REJETÉ"?DNG:e.statut==="EN RETARD"?WRN:"#e9ecef";
                  return(
                    <div key={i} style={{flex:1,textAlign:"center"}}>
                      <div style={{height:6,background:col,borderRadius:3,marginBottom:6}}/>
                      <div style={{fontSize:10,color:"#6c757d",lineHeight:1.3}}>{e.label.split(" ").slice(0,2).join(" ")}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
              <div style={{background:"#f8f9fc",borderRadius:RSm,padding:"10px 12px"}}>
                <div style={{fontSize:10,color:MUT,textTransform:"uppercase",fontWeight:600,marginBottom:3}}>Montant</div>
                <div style={{fontSize:14,fontWeight:700,color:"#212529"}}>{fmtN(result.mtR)}</div>
              </div>
              <div style={{background:"#f8f9fc",borderRadius:RSm,padding:"10px 12px"}}>
                <div style={{fontSize:10,color:MUT,textTransform:"uppercase",fontWeight:600,marginBottom:3}}>Projet / Site</div>
                <div style={{fontSize:13,fontWeight:600,color:"#212529"}}>{result.proj||"—"}</div>
                <div style={{fontSize:11,color:MUT}}>{result.site}</div>
              </div>
              <div style={{background:"#f8f9fc",borderRadius:RSm,padding:"10px 12px"}}>
                <div style={{fontSize:10,color:MUT,textTransform:"uppercase",fontWeight:600,marginBottom:3}}>Score OCR</div>
                <div style={{fontSize:14,fontWeight:700,color:result.ocr>=85?SUC:result.ocr>=70?WRN:DNG}}>{result.ocr}%</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
