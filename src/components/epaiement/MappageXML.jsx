"use client";
import{useState}from"react";
import{card,btn,inp,MUT,P,WH,BD,TR,SUCL,SUCD}from"../../lib/theme";

const G="#1a6b3c";

const BANKS_LIST=["BNI Madagascar","BOA Madagascar","BFV-SG","MCB","BMOI","Société Générale","BM Madagascar"];
const INIT_SCHEMAS=[{id:"SCH-001",banque:"BNI Madagascar",format:"ISO 20022 pain.001"},{id:"SCH-002",banque:"BOA Madagascar",format:"SEPA credit transfer"}];

const INIT_MAPPING=[
  {id:"MAP-001",banqueId:"BNI Madagascar",schemaId:"SCH-001",compteDebit:"0001234567890",devise:"MGA",actif:true},
  {id:"MAP-002",banqueId:"BOA Madagascar",schemaId:"SCH-002",compteDebit:"FR76 1234 5678 9012 3456",devise:"EUR",actif:true},
];

export default function MappageXML(){
  const[mappings,setMappings]=useState(INIT_MAPPING);
  const[modal,setModal]=useState(null);
  const[form,setForm]=useState({banqueId:"",schemaId:"",compteDebit:"",devise:"MGA",actif:true});
  const[editId,setEditId]=useState(null);

  function openAdd(){
    setForm({banqueId:BANKS_LIST[0],schemaId:INIT_SCHEMAS[0]?.id||"",compteDebit:"",devise:"MGA",actif:true});
    setEditId(null);
    setModal("form");
  }

  function openEdit(m){
    setForm({banqueId:m.banqueId,schemaId:m.schemaId,compteDebit:m.compteDebit,devise:m.devise,actif:m.actif});
    setEditId(m.id);
    setModal("form");
  }

  function save(){
    if(!form.banqueId||!form.schemaId)return;
    if(editId){
      setMappings(p=>p.map(m=>m.id===editId?{...m,...form}:m));
    }else{
      setMappings(p=>[...p,{id:"MAP-"+(p.length+1).toString().padStart(3,"0"),...form}]);
    }
    setModal(null);
  }

  function del(id){setMappings(p=>p.filter(m=>m.id!==id));}

  function toggleActif(id){setMappings(p=>p.map(m=>m.id===id?{...m,actif:!m.actif}:m));}

  const usedBanks=new Set(mappings.map(m=>m.banqueId));
  const unusedBanks=BANKS_LIST.filter(b=>!usedBanks.has(b));

  return(
    <div style={{animation:"fadeIn .25s ease"}}>
      <div style={{marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
          <span style={{fontSize:20}}>🔗</span>
          <h2 style={{fontSize:20,fontWeight:800,color:"#212529"}}>Mappage Fichier XML — Banques</h2>
        </div>
        <p style={{fontSize:13,color:MUT}}>Associez chaque banque à son schéma XML de paiement et configurez le compte débiteur.</p>
      </div>

      {/* Stats row */}
      <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"repeat(2,1fr)":"repeat(4,1fr)",gap:12,marginBottom:20}}>
        {[
          {label:"Banques configurées",val:mappings.length,color:G,icon:"🏦"},
          {label:"Actifs",val:mappings.filter(m=>m.actif).length,color:"#28a745",icon:"✅"},
          {label:"Inactifs",val:mappings.filter(m=>!m.actif).length,color:"#6c757d",icon:"⏸"},
          {label:"Non configurés",val:unusedBanks.length,color:"#f5a623",icon:"⚠️"},
        ].map(({label,val,color,icon})=>(
          <div key={label} style={{...card(),padding:"16px 20px",borderLeft:"4px solid "+color}}>
            <div style={{fontSize:11,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".05em",marginBottom:6}}>{icon} {label}</div>
            <div style={{fontSize:24,fontWeight:900,color}}>{val}</div>
          </div>
        ))}
      </div>

      {/* Action bar */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{fontSize:12.5,color:MUT}}>
          {unusedBanks.length>0&&<span style={{color:"#f5a623",fontWeight:600}}>⚠ {unusedBanks.length} banque(s) sans mappage : {unusedBanks.join(", ")}</span>}
          {unusedBanks.length===0&&<span style={{color:"#28a745",fontWeight:600}}>✓ Toutes les banques sont configurées</span>}
        </div>
        <button onClick={openAdd}
          style={{...btn("primary"),background:G,borderColor:G,display:"flex",alignItems:"center",gap:8}}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Ajouter un mappage
        </button>
      </div>

      {/* Mapping cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(420px,1fr))",gap:14}}>
        {mappings.map(m=>{
          const schema=INIT_SCHEMAS.find(s=>s.id===m.schemaId);
          return(
            <div key={m.id} style={{...card(),padding:0,overflow:"hidden",opacity:m.actif?1:.65}}>
              {/* Card header */}
              <div style={{background:m.actif?`linear-gradient(135deg,#212529,#343a40)`:"#6c757d",padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:40,height:40,borderRadius:10,background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🏦</div>
                  <div>
                    <div style={{fontSize:14,fontWeight:800,color:"#fff"}}>{m.banqueId}</div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,.55)",marginTop:1}}>ID : {m.id}</div>
                  </div>
                </div>
                <div style={{display:"flex",gap:6}}>
                  <button onClick={()=>toggleActif(m.id)}
                    style={{padding:"5px 12px",borderRadius:14,border:"1px solid rgba(255,255,255,.25)",background:m.actif?"rgba(40,167,69,.3)":"rgba(108,117,125,.3)",color:"#fff",cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:"inherit"}}>
                    {m.actif?"Actif":"Inactif"}
                  </button>
                </div>
              </div>
              {/* Card body */}
              <div style={{padding:"16px 18px"}}>
                <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr",gap:12,marginBottom:14}}>
                  <div>
                    <div style={{fontSize:10.5,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".06em",marginBottom:4}}>Schéma XML</div>
                    <div style={{fontSize:13,fontWeight:700,color:G}}>{schema?.format||m.schemaId}</div>
                  </div>
                  <div>
                    <div style={{fontSize:10.5,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".06em",marginBottom:4}}>Devise</div>
                    <div style={{fontSize:13,fontWeight:700,color:"#212529"}}>{m.devise}</div>
                  </div>
                  <div style={{gridColumn:"1/-1"}}>
                    <div style={{fontSize:10.5,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".06em",marginBottom:4}}>Compte débiteur</div>
                    <code style={{fontSize:12.5,fontWeight:700,color:"#212529",background:"#f0f0f0",padding:"4px 10px",borderRadius:5,display:"inline-block"}}>{m.compteDebit||"—"}</code>
                  </div>
                </div>
                <div style={{display:"flex",justifyContent:"flex-end",gap:8,borderTop:"1px solid "+BD,paddingTop:12}}>
                  <button onClick={()=>openEdit(m)}
                    style={{padding:"6px 14px",borderRadius:6,border:"1px solid "+BD,background:"#fff",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit",display:"flex",alignItems:"center",gap:6}}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Modifier
                  </button>
                  <button onClick={()=>del(m.id)}
                    style={{padding:"6px 14px",borderRadius:6,border:"1px solid #f5c6c6",background:"#fff0f0",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit",color:"#dc3545",display:"flex",alignItems:"center",gap:6}}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty slot */}
        <button onClick={openAdd}
          style={{...card(),padding:24,border:"2px dashed "+BD,background:"transparent",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,color:MUT,fontSize:13,fontWeight:600,fontFamily:"inherit",minHeight:180}}>
          <span style={{fontSize:28}}>🏦</span>
          <span>+ Associer une banque</span>
        </button>
      </div>

      {/* Form modal */}
      {modal==="form"&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:5000,padding:20}}>
          <div style={{background:WH,borderRadius:14,width:"100%",maxWidth:460,boxShadow:"0 20px 60px rgba(0,0,0,.25)"}}>
            <div style={{padding:"18px 24px",borderBottom:"1px solid "+BD,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <h3 style={{fontSize:16,fontWeight:700,color:"#212529"}}>{editId?"Modifier":"Nouveau"} mappage banque</h3>
              <button onClick={()=>setModal(null)} style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:MUT}}>×</button>
            </div>
            <div style={{padding:"20px 24px",display:"flex",flexDirection:"column",gap:14}}>
              <div>
                <div style={{fontSize:11.5,fontWeight:700,color:"#495057",marginBottom:6,textTransform:"uppercase",letterSpacing:".05em"}}>Banque</div>
                <select value={form.banqueId} onChange={e=>setForm(p=>({...p,banqueId:e.target.value}))}
                  style={{width:"100%",border:"1px solid "+BD,borderRadius:6,padding:"9px 12px",fontSize:13,outline:"none",boxSizing:"border-box",background:WH}}
                  onFocus={e=>e.target.style.borderColor=G} onBlur={e=>e.target.style.borderColor=BD}>
                  {BANKS_LIST.map(b=><option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <div style={{fontSize:11.5,fontWeight:700,color:"#495057",marginBottom:6,textTransform:"uppercase",letterSpacing:".05em"}}>Schéma XML</div>
                <select value={form.schemaId} onChange={e=>setForm(p=>({...p,schemaId:e.target.value}))}
                  style={{width:"100%",border:"1px solid "+BD,borderRadius:6,padding:"9px 12px",fontSize:13,outline:"none",boxSizing:"border-box",background:WH}}
                  onFocus={e=>e.target.style.borderColor=G} onBlur={e=>e.target.style.borderColor=BD}>
                  {INIT_SCHEMAS.map(s=><option key={s.id} value={s.id}>{s.banque} — {s.format}</option>)}
                </select>
              </div>
              <div>
                <div style={{fontSize:11.5,fontWeight:700,color:"#495057",marginBottom:6,textTransform:"uppercase",letterSpacing:".05em"}}>Compte débiteur (IBAN / RIB)</div>
                <input value={form.compteDebit} onChange={e=>setForm(p=>({...p,compteDebit:e.target.value}))}
                  placeholder="ex: MG48 0001 0001 2345 6789 012"
                  style={{width:"100%",border:"1px solid "+BD,borderRadius:6,padding:"9px 12px",fontSize:13,outline:"none",boxSizing:"border-box",fontFamily:"'Courier New',monospace"}}
                  onFocus={e=>e.target.style.borderColor=G} onBlur={e=>e.target.style.borderColor=BD}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr",gap:12}}>
                <div>
                  <div style={{fontSize:11.5,fontWeight:700,color:"#495057",marginBottom:6,textTransform:"uppercase",letterSpacing:".05em"}}>Devise</div>
                  <select value={form.devise} onChange={e=>setForm(p=>({...p,devise:e.target.value}))}
                    style={{width:"100%",border:"1px solid "+BD,borderRadius:6,padding:"9px 12px",fontSize:13,outline:"none",background:WH}}
                    onFocus={e=>e.target.style.borderColor=G} onBlur={e=>e.target.style.borderColor=BD}>
                    {["MGA","EUR","USD","GBP","CHF"].map(d=><option key={d}>{d}</option>)}
                  </select>
                </div>
                <div style={{display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
                  <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",padding:"8px 0"}}>
                    <input type="checkbox" checked={form.actif} onChange={e=>setForm(p=>({...p,actif:e.target.checked}))} style={{width:16,height:16,accentColor:G}}/>
                    <span style={{fontSize:13,fontWeight:600,color:"#212529"}}>Actif</span>
                  </label>
                </div>
              </div>
            </div>
            <div style={{padding:"14px 24px",borderTop:"1px solid "+BD,display:"flex",justifyContent:"flex-end",gap:10}}>
              <button onClick={()=>setModal(null)} style={{padding:"8px 18px",borderRadius:6,border:"1px solid "+BD,background:"#fff",cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>Annuler</button>
              <button onClick={save} style={{padding:"8px 18px",borderRadius:6,border:"none",background:G,color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"inherit"}}>
                {editId?"Enregistrer":"Créer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
