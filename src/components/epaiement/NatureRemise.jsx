"use client";
import{useState}from"react";
import{useApp}from"../../context/AppContext";
import{card,btn,MUT,P,WH,BD,TR}from"../../lib/theme";

const G="#1a6b3c";
const ALL_NATURES=["RLI","TRF","COC","CDE","CDP","MAD","CCD","ZFI","VRT","CHQ","PRE","VIR"];

const INIT_NATURE_CONFIG={
  PACT:["RLI","TRF","COC","CDP","MAD","CCD"],
  FIDFSR:["RLI","TRF","COC","CDE","CDP","MAD","CCD"],
};

export default function NatureRemise(){
  const{projets}=useApp();
  const[configs,setConfigs]=useState(()=>{
    try{const s=localStorage.getItem("ep_natureRemise");return s?JSON.parse(s):INIT_NATURE_CONFIG;}catch{return INIT_NATURE_CONFIG;}
  });
  const[modal,setModal]=useState(null); // {proj, selected}
  const[search,setSearch]=useState("");

  function openEdit(projId){
    setModal({proj:projId,selected:[...(configs[projId]||[])]});
  }

  function toggleNature(n){
    setModal(p=>({...p,selected:p.selected.includes(n)?p.selected.filter(x=>x!==n):[...p.selected,n]}));
  }

  function save(){
    const nc={...configs,[modal.proj]:modal.selected};
    setConfigs(nc);
    try{localStorage.setItem("ep_natureRemise",JSON.stringify(nc));}catch{}
    setModal(null);
  }

  const allProjets=[...(projets||[]).map(p=>p.id),...Object.keys(configs)].filter((v,i,a)=>a.indexOf(v)===i);
  const filtered=allProjets.filter(p=>!search||p.toLowerCase().includes(search.toLowerCase()));

  return(
    <div style={{animation:"fadeIn .25s ease"}}>
      <div style={{marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
          <span style={{fontSize:20}}>⚙️</span>
          <h2 style={{fontSize:20,fontWeight:800,color:"#212529"}}>Configuration des natures de remise</h2>
        </div>
        <p style={{fontSize:13,color:MUT}}>Définissez les natures de remise autorisées par projet pour la génération des fichiers bancaires.</p>
      </div>

      {/* Search */}
      <div style={{marginBottom:16}}>
        <input placeholder="🔍 Rechercher un projet…" value={search} onChange={e=>setSearch(e.target.value)}
          style={{width:"100%",maxWidth:380,border:"1px solid "+BD,borderRadius:6,padding:"9px 14px",fontSize:13,outline:"none"}}/>
      </div>

      {/* Cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14}}>
        {filtered.map(projId=>{
          const natures=configs[projId]||[];
          return(
            <div key={projId} style={{...card(),padding:20}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:12}}>
                <div>
                  <div style={{fontSize:14,fontWeight:800,color:"#212529",marginBottom:4}}>{projId}</div>
                  <div style={{fontSize:11.5,color:G,fontWeight:600}}>
                    Natures actuelles : {natures.length>0?natures.join(", "):<span style={{color:MUT,fontStyle:"italic"}}>Aucune configurée</span>}
                  </div>
                </div>
                <button onClick={()=>openEdit(projId)} style={{width:36,height:36,borderRadius:8,background:"#212529",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
              </div>
              {natures.length>0&&(
                <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                  {natures.map(n=>(
                    <span key={n} style={{fontSize:11,fontWeight:700,background:G+"15",color:G,padding:"3px 10px",borderRadius:12,border:"1px solid "+G+"30"}}>{n}</span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {/* Add new project config */}
        <button onClick={()=>setModal({proj:"NOUVEAU",selected:[],isNew:true})}
          style={{...card(),padding:20,border:"2px dashed "+BD,background:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,color:MUT,fontSize:13,fontWeight:600,fontFamily:"inherit",minHeight:100}}>
          <span style={{fontSize:20}}>+</span> Ajouter un projet
        </button>
      </div>

      {/* Edit Modal */}
      {modal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:5000,padding:20}}>
          <div style={{background:WH,borderRadius:16,width:"100%",maxWidth:480,boxShadow:"0 20px 60px rgba(0,0,0,.3)"}}>
            <div style={{padding:"20px 24px",borderBottom:"1px solid "+BD,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div>
                <h3 style={{fontSize:16,fontWeight:800,color:"#212529",marginBottom:2}}>Natures de remises disponibles</h3>
                <p style={{fontSize:12,color:MUT}}>Projet : <b style={{color:G}}>{modal.proj}</b></p>
              </div>
              <button onClick={()=>setModal(null)} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:MUT}}>×</button>
            </div>
            <div style={{padding:"16px 24px"}}>
              {/* Tout cocher / décocher */}
              <div style={{display:"flex",gap:10,marginBottom:16}}>
                <button onClick={()=>setModal(p=>({...p,selected:[...ALL_NATURES]}))}
                  style={{padding:"7px 16px",borderRadius:8,border:"1px solid "+BD,background:"#fff",cursor:"pointer",fontSize:12.5,fontWeight:600,fontFamily:"inherit"}}>
                  Tout cocher
                </button>
                <button onClick={()=>setModal(p=>({...p,selected:[]}))}
                  style={{padding:"7px 16px",borderRadius:8,border:"none",background:"#f5c400",cursor:"pointer",fontSize:12.5,fontWeight:700,fontFamily:"inherit"}}>
                  Tout décocher
                </button>
              </div>
              {/* Checkboxes - 2 columns */}
              <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr",gap:10}}>
                {ALL_NATURES.map(n=>(
                  <label key={n} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",padding:"6px 4px",borderRadius:6,
                    background:modal.selected.includes(n)?"#f0fff4":"transparent"}}
                    onMouseEnter={e=>e.currentTarget.style.background=modal.selected.includes(n)?"#e6f7ec":"#f8f9fc"}
                    onMouseLeave={e=>e.currentTarget.style.background=modal.selected.includes(n)?"#f0fff4":"transparent"}>
                    <input type="checkbox" checked={modal.selected.includes(n)} onChange={()=>toggleNature(n)}
                      style={{width:16,height:16,accentColor:G}}/>
                    <span style={{fontSize:13,fontWeight:600,color:"#212529"}}>{n}</span>
                  </label>
                ))}
              </div>
            </div>
            <div style={{padding:"16px 24px",borderTop:"1px solid "+BD,display:"flex",justifyContent:"flex-end"}}>
              <button onClick={save}
                style={{padding:"10px 24px",borderRadius:8,border:"none",background:"#212529",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
