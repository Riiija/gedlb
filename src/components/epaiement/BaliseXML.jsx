"use client";
import{useState}from"react";
import{card,btn,inp,MUT,P,WH,BD,TR}from"../../lib/theme";

const G="#1a6b3c";

const INIT_SCHEMAS_XML=[
  {
    id:"SCH-001",banque:"BNI Madagascar",format:"ISO 20022 pain.001",
    tags:[
      {tag:"MsgId",label:"Identifiant message",exemple:"MSG-001",valeur:"MSG-${timestamp}"},
      {tag:"CreDtTm",label:"Date/heure création",exemple:"2026-01-16T10:00:00",valeur:"${datetime}"},
      {tag:"NbOfTxs",label:"Nombre de transactions",exemple:"5",valeur:"${count}"},
      {tag:"CtrlSum",label:"Somme de contrôle",exemple:"125000.00",valeur:"${total}"},
      {tag:"Nm",label:"Nom débiteur",exemple:"SOFTWELL MADAGASCAR",valeur:"SOFTWELL MADAGASCAR"},
      {tag:"IBAN",label:"IBAN débiteur",exemple:"MG4800010001234567890",valeur:"${debiteur_iban}"},
      {tag:"Ccy",label:"Devise",exemple:"MGA",valeur:"${devise}"},
      {tag:"NatureRemise",label:"Nature de la remise",exemple:"RLI",valeur:"${nature}"},
    ],
    actif:true,
  },
  {
    id:"SCH-002",banque:"BOA Madagascar",format:"SEPA credit transfer",
    tags:[
      {tag:"MsgId",label:"Identifiant message",exemple:"BOA-MSG-001",valeur:"BOA-${timestamp}"},
      {tag:"CreDtTm",label:"Date création",exemple:"2026-01-16",valeur:"${date}"},
      {tag:"NbOfTxs",label:"Nb transactions",exemple:"3",valeur:"${count}"},
      {tag:"Ccy",label:"Monnaie",exemple:"EUR",valeur:"EUR"},
      {tag:"Nm",label:"Nom",exemple:"SOFTWELL",valeur:"SOFTWELL MADAGASCAR"},
    ],
    actif:true,
  },
];

export default function BaliseXML(){
  const[schemas,setSchemas]=useState(INIT_SCHEMAS_XML);
  const[editing,setEditing]=useState(null); // {schemaId, tagIdx, tag}
  const[selSchema,setSelSchema]=useState(INIT_SCHEMAS_XML[0]?.id);
  const[addTagModal,setAddTagModal]=useState(false);
  const[newTag,setNewTag]=useState({tag:"",label:"",exemple:"",valeur:""});

  const schema=schemas.find(s=>s.id===selSchema);

  function updateTag(si,ti,field,val){
    setSchemas(p=>p.map(s=>s.id===si?{...s,tags:s.tags.map((t,i)=>i===ti?{...t,[field]:val}:t)}:s));
  }

  function addTag(){
    if(!newTag.tag.trim())return;
    setSchemas(p=>p.map(s=>s.id===selSchema?{...s,tags:[...s.tags,{...newTag}]}:s));
    setNewTag({tag:"",label:"",exemple:"",valeur:""});
    setAddTagModal(false);
  }

  function deleteTag(ti){
    setSchemas(p=>p.map(s=>s.id===selSchema?{...s,tags:s.tags.filter((_,i)=>i!==ti)}:s));
  }

  return(
    <div style={{animation:"fadeIn .25s ease"}}>
      <div style={{marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
          <span style={{fontSize:20}}>🏗️</span>
          <h2 style={{fontSize:20,fontWeight:800,color:"#212529"}}>Configuration Balises XML</h2>
        </div>
        <p style={{fontSize:13,color:MUT}}>Configurez le format ISO XML des schémas de paiement communiqués par votre banque.</p>
      </div>

      {/* Schema selector */}
      <div style={{display:"flex",gap:10,marginBottom:18,flexWrap:"wrap"}}>
        {schemas.map(s=>(
          <button key={s.id} onClick={()=>setSelSchema(s.id)}
            style={{padding:"9px 18px",borderRadius:8,border:"1px solid "+BD,background:selSchema===s.id?G:WH,color:selSchema===s.id?"#fff":"#212529",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit",transition:TR}}>
            {s.banque}
            <span style={{fontSize:10,marginLeft:8,opacity:.7}}>{s.format}</span>
          </button>
        ))}
        <button onClick={()=>{const id="SCH-"+(schemas.length+1).toString().padStart(3,"0");setSchemas(p=>[...p,{id,banque:"Nouvelle banque",format:"ISO 20022",tags:[],actif:true}]);setSelSchema(id);}}
          style={{padding:"9px 18px",borderRadius:8,border:"2px dashed "+BD,background:"transparent",color:MUT,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit"}}>
          + Ajouter un schéma
        </button>
      </div>

      {schema&&(
        <div style={{...card(),overflow:"hidden"}}>
          {/* Header */}
          <div style={{background:"linear-gradient(135deg,#212529,#343a40)",padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{color:"#fff",fontWeight:700,fontSize:15}}>{schema.banque}</div>
              <div style={{color:"rgba(255,255,255,.5)",fontSize:12}}>Format : {schema.format}</div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setAddTagModal(true)}
                style={{padding:"7px 14px",borderRadius:6,border:"none",background:G,color:"#fff",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit"}}>
                + Ajouter balise
              </button>
              <button onClick={()=>{
                const blob=new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n<!-- Schéma ${schema.banque} -->\n<Document>\n  <CstmrCdtTrfInitn>\n${schema.tags.map(t=>`    <!-- ${t.label} -->\n    <${t.tag}>${t.valeur}</${t.tag}>`).join("\n")}\n  </CstmrCdtTrfInitn>\n</Document>`],{type:"text/xml"});
                const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`schema_${schema.banque.replace(/ /g,"_")}.xml`;a.click();
              }} style={{padding:"7px 14px",borderRadius:6,border:"1px solid rgba(255,255,255,.2)",background:"rgba(255,255,255,.08)",color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>
                ⬇ Exporter XML
              </button>
            </div>
          </div>

          {/* Preview */}
          <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"2fr 1fr"}}>
            {/* Tags table */}
            <div style={{borderRight:"1px solid "+BD}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead>
                  <tr style={{background:"#f8f9fc"}}>
                    {["Balise XML","Libellé","Exemple","Valeur / Variable","Actions"].map(h=>(
                      <th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:10.5,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".05em",borderBottom:"1px solid "+BD}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {schema.tags.map((t,i)=>(
                    <tr key={i} style={{borderBottom:"1px solid #f0f2f5"}}
                      onMouseEnter={e=>e.currentTarget.style.background="#f8fff9"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <td style={{padding:"9px 14px"}}>
                        <code style={{fontSize:12,fontWeight:700,color:G,background:G+"10",padding:"2px 8px",borderRadius:4}}>&lt;{t.tag}&gt;</code>
                      </td>
                      <td style={{padding:"9px 14px",fontSize:12.5,color:"#212529"}}>{t.label}</td>
                      <td style={{padding:"9px 14px",fontSize:11,color:MUT,fontStyle:"italic"}}>{t.exemple}</td>
                      <td style={{padding:"9px 14px"}}>
                        <input value={t.valeur} onChange={e=>updateTag(schema.id,i,"valeur",e.target.value)}
                          style={{width:"100%",border:"1px solid "+BD,borderRadius:4,padding:"5px 8px",fontSize:12,outline:"none",fontFamily:"'Courier New',monospace"}}
                          onFocus={e=>e.target.style.borderColor=G} onBlur={e=>e.target.style.borderColor=BD}/>
                      </td>
                      <td style={{padding:"9px 14px"}}>
                        <button onClick={()=>deleteTag(i)} style={{width:28,height:28,borderRadius:6,background:"#fff0f0",border:"1px solid #f5c6c6",cursor:"pointer",color:"#dc3545",display:"flex",alignItems:"center",justifyContent:"center"}}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {schema.tags.length===0&&<div style={{padding:"28px 0",textAlign:"center",color:MUT,fontSize:13}}>Aucune balise configurée</div>}
            </div>

            {/* Preview XML */}
            <div style={{padding:16}}>
              <div style={{fontSize:11,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Aperçu XML</div>
              <pre style={{fontFamily:"'Courier New',monospace",fontSize:10.5,background:"#0d1117",color:"#e6edf3",borderRadius:8,padding:14,overflowX:"auto",lineHeight:1.6,margin:0}}>
{`<?xml version="1.0"?>
<Document>
 <CstmrCdtTrfInitn>
${schema.tags.map(t=>`   <${t.tag}>
     ${t.valeur}
   </${t.tag}>`).join("\n")}
 </CstmrCdtTrfInitn>
</Document>`}
              </pre>
              <div style={{marginTop:12}}>
                <div style={{fontSize:11,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".06em",marginBottom:8}}>Variables disponibles</div>
                {["${timestamp}","${datetime}","${date}","${count}","${total}","${nature}","${devise}","${debiteur_iban}"].map(v=>(
                  <div key={v} style={{fontSize:10.5,fontFamily:"'Courier New',monospace",color:G,padding:"2px 0"}}>{v}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add tag modal */}
      {addTagModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:5000,padding:20}}>
          <div style={{background:WH,borderRadius:12,width:"100%",maxWidth:440,boxShadow:"0 20px 60px rgba(0,0,0,.25)"}}>
            <div style={{padding:"18px 24px",borderBottom:"1px solid "+BD,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <h3 style={{fontSize:15,fontWeight:700,color:"#212529"}}>Ajouter une balise XML</h3>
              <button onClick={()=>setAddTagModal(false)} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:MUT}}>×</button>
            </div>
            <div style={{padding:"16px 24px",display:"flex",flexDirection:"column",gap:12}}>
              {[["tag","Balise XML (ex: MsgId)"],["label","Libellé"],["exemple","Exemple de valeur"],["valeur","Valeur / Variable"]].map(([k,l])=>(
                <div key={k}>
                  <div style={{fontSize:11.5,fontWeight:700,color:"#495057",marginBottom:5}}>{l}</div>
                  <input value={newTag[k]} onChange={e=>setNewTag(p=>({...p,[k]:e.target.value}))}
                    style={{width:"100%",border:"1px solid "+BD,borderRadius:6,padding:"8px 12px",fontSize:13,outline:"none",boxSizing:"border-box"}}
                    onFocus={e=>e.target.style.borderColor=G} onBlur={e=>e.target.style.borderColor=BD}/>
                </div>
              ))}
            </div>
            <div style={{padding:"14px 24px",borderTop:"1px solid "+BD,display:"flex",justifyContent:"flex-end",gap:10}}>
              <button onClick={()=>setAddTagModal(false)} style={{padding:"8px 16px",borderRadius:6,border:"1px solid "+BD,background:"#fff",cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>Annuler</button>
              <button onClick={addTag} style={{padding:"8px 16px",borderRadius:6,border:"none",background:G,color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"inherit"}}>Ajouter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
