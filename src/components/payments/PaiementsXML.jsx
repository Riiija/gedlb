"use client";
import{useState}from"react";
import{Modal}from"../ui/Modal";
import{IC}from"../ui/Icons";
import{Badge}from"../ui/Badge";
import{card,btn,inp,sel,lbl,bdg,TH,TD,P,WH,BD,BG,MUT,SUC,SUCL,SUCD,DNG,RSm}from"../../lib/theme";
import{XML_NATURES}from"../../lib/data";
import{fmtN,now}from"../../lib/utils";
import{useApp}from"../../context/AppContext";

export default function PaiementsXML(){
  const{docs,schemas,setSchemas}=useApp();
  const[modal,setModal]=useState(null);
  const[selSchema,setSelSchema]=useState(schemas[0]?.id||"");
  const[editSchema,setEditSchema]=useState(null);
  const[selected,setSelected]=useState([]);

  const eligible=docs.filter(d=>d.bap&&d.st==="BON À PAYER");
  const schema=schemas.find(s=>s.id===selSchema)||schemas[0];
  const total=eligible.filter(d=>selected.includes(d.id)).reduce((s,d)=>s+(d.mtR||0),0);

  function toggleDoc(id){setSelected(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);}

  function generateXML(){
    const sel_docs=eligible.filter(d=>selected.includes(d.id));
    const xml=`<?xml version="1.0" encoding="UTF-8"?>\n<Document>\n  <CstmrCdtTrfInitn>\n    <GrpHdr>\n      <MsgId>MSG-${Date.now()}</MsgId>\n      <CreDtTm>${new Date().toISOString()}</CreDtTm>\n      <NbOfTxs>${sel_docs.length}</NbOfTxs>\n      <CtrlSum>${total/100}</CtrlSum>\n    </GrpHdr>\n${sel_docs.map(d=>`    <PmtInf>\n      <PmtInfId>${d.id}</PmtInfId>\n      <NatureRemise>${schema?.natureRemise||""}</NatureRemise>\n      <Amt Ccy="MGA">${d.mtR}</Amt>\n      <Cdtr><Nm>${d.fourn}</Nm></Cdtr>\n      <CdtrAcct><IBAN>${d.ch?.iban||""}</IBAN></CdtrAcct>\n    </PmtInf>`).join("\n")}\n  </CstmrCdtTrfInitn>\n</Document>`;
    const blob=new Blob([xml],{type:"text/xml"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`paiement_${Date.now()}.xml`;a.click();
    setModal(null);setSelected([]);
  }

  return(
    <div style={{animation:"fadeIn .2s ease"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <h2 style={{fontSize:17,fontWeight:700,color:"#212529"}}>Paiements XML</h2>
        <div style={{display:"flex",gap:8}}>
          <select value={selSchema} onChange={e=>setSelSchema(e.target.value)} style={{...inp({width:"auto",fontSize:13})}}>
            {schemas.map(s=><option key={s.id} value={s.id}>{s.nom}</option>)}
          </select>
          <button onClick={()=>{setEditSchema({...schema});setModal("schema");}} style={btn("light",true)}>{IC.edit} Schéma</button>
          {selected.length>0&&<button onClick={()=>setModal("confirm")} style={btn("primary")}>{IC.xml} Générer XML ({selected.length})</button>}
        </div>
      </div>

      {/* Schema info */}
      {schema&&(
        <div style={{...card(),padding:14,marginBottom:16,display:"flex",gap:16,alignItems:"center"}}>
          <span style={{display:"flex",color:P}}>{IC.bank}</span>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:700,color:"#212529"}}>{schema.nom}</div>
            <div style={{fontSize:11,color:MUT}}>{schema.format} · {schema.version} · Nature : {schema.natureRemise}</div>
          </div>
          <span style={bdg(SUCL,SUCD,{fontSize:11})}>{schema.statut}</span>
        </div>
      )}

      {/* Eligible docs */}
      <div style={{...card()}}>
        <div style={{padding:"12px 20px",borderBottom:`1px solid ${BD}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{fontSize:13,fontWeight:700,color:"#212529"}}>Documents éligibles au paiement</div>
          <span style={bdg("#eef1f8",P,{fontSize:11})}>{eligible.length} document{eligible.length!==1?"s":""}</span>
        </div>
        {eligible.length===0&&(
          <div style={{padding:40,textAlign:"center",color:MUT}}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:8,opacity:.35,color:P}}><span style={{display:"flex"}}>{IC.bank}</span></div>
            <div>Aucun document "Bon à payer" disponible</div>
            <div style={{fontSize:12,marginTop:4}}>Les documents doivent être validés et marqués "Bon à payer"</div>
          </div>
        )}
        {eligible.length>0&&(
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr>
                <th style={TH}><input type="checkbox" checked={selected.length===eligible.length} onChange={()=>setSelected(selected.length===eligible.length?[]:eligible.map(d=>d.id))}/></th>
                {["Référence","Fournisseur","Site","Montant","IBAN","Date"].map(h=><th key={h} style={TH}>{h}</th>)}
              </tr></thead>
              <tbody>
                {eligible.map(d=>(
                  <tr key={d.id}
                    onMouseEnter={e=>e.currentTarget.style.background="#f8f9fc"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                    style={{background:selected.includes(d.id)?"#f0f4ff":"transparent",transition:"background .12s"}}>
                    <td style={TD}><input type="checkbox" checked={selected.includes(d.id)} onChange={()=>toggleDoc(d.id)}/></td>
                    <td style={TD}><div style={{fontWeight:600,fontSize:13,color:P}}>{d.id}</div><div style={{fontSize:11,color:MUT}}>{d.type}</div></td>
                    <td style={TD}>{d.fourn}</td>
                    <td style={TD}><span style={{fontSize:11,background:"#eef1f8",color:P,padding:"2px 7px",borderRadius:3}}>{d.site}</span></td>
                    <td style={{...TD,fontWeight:700,color:"#212529",whiteSpace:"nowrap"}}>{fmtN(d.mtR)}</td>
                    <td style={{...TD,fontSize:11,fontFamily:"monospace",color:"#495057"}}>{d.ch?.iban||"—"}</td>
                    <td style={{...TD,fontSize:12,color:MUT}}>{d.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {selected.length>0&&(
              <div style={{padding:"12px 20px",borderTop:`1px solid ${BD}`,display:"flex",justifyContent:"space-between",alignItems:"center",background:"#f8f9fc"}}>
                <span style={{fontSize:13,color:MUT}}>{selected.length} sélectionné(s)</span>
                <span style={{fontSize:14,fontWeight:700,color:"#212529"}}>Total : {fmtN(total)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirm modal */}
      {modal==="confirm"&&(
        <Modal title="Confirmer la génération XML" onClose={()=>setModal(null)} w={520}
          footer={<><button onClick={()=>setModal(null)} style={btn("light",true)}>Annuler</button><button onClick={generateXML} style={btn("success")}>{IC.dl} Générer &amp; Télécharger</button></>}>
          <p style={{fontSize:13,color:"#495057",marginBottom:12}}>{selected.length} transaction(s) · Total : <b>{fmtN(total)}</b></p>
          <p style={{fontSize:12,color:MUT}}>Schéma : {schema?.nom} · Nature : {schema?.natureRemise}</p>
        </Modal>
      )}

      {/* Schema edit modal */}
      {modal==="schema"&&editSchema&&(
        <Modal title="Modifier le schéma" onClose={()=>setModal(null)} w={560}
          footer={<><button onClick={()=>setModal(null)} style={btn("light",true)}>Annuler</button><button onClick={()=>{setSchemas(p=>p.map(s=>s.id===editSchema.id?editSchema:s));setModal(null);}} style={btn("primary")}>{IC.chk} Enregistrer</button></>}>
          <div style={{display:"grid",gap:10}}>
            {[["Nom",  "nom"],["Banque","banque"],["Format","format"],["Endpoint","endpoint"]].map(([l,k])=>(
              <div key={k}><label style={lbl}>{l}</label><input value={editSchema[k]||""} onChange={e=>setEditSchema(p=>({...p,[k]:e.target.value}))} style={inp()}/></div>
            ))}
            <div><label style={lbl}>Nature de remise</label>
              <select value={editSchema.natureRemise||""} onChange={e=>setEditSchema(p=>({...p,natureRemise:e.target.value}))} style={inp()}>
                {XML_NATURES.map(n=><option key={n}>{n}</option>)}
              </select>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
