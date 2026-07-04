"use client";
import{useState,useRef}from"react";
import{IC}from"../ui/Icons";
import{Modal}from"../ui/Modal";
import{card,btn,inp,bdg,P,WH,BD,MUT,SUC,SUCL,DNG,DNGL,RSm,TH,TD,TR}from"../../lib/theme";
import{useApp}from"../../context/AppContext";

const CATS=["Achats","Services","Personnel","Finances","Fiscalité","Produits","Charges","Exceptionnel","Autre"];

function PcForm({init={},onSave,onClose}){
  const[f,setF]=useState({code:init.code||"",libelle:init.libelle||"",categorie:init.categorie||"Achats"});
  const up=(k,v)=>setF(p=>({...p,[k]:v}));
  const ok=f.code.trim()&&f.libelle.trim();
  return(
    <Modal title={init.id?"Modifier le compte":"Nouveau compte"} onClose={onClose} w={480}
      footer={<>
        <button onClick={onClose} style={btn("light",true)}>Annuler</button>
        <button onClick={()=>ok&&onSave(f)} disabled={!ok} style={{...btn("primary"),opacity:ok?1:.5}}>
          <span style={{display:"flex"}}>{IC.chk}</span> {init.id?"Modifier":"Ajouter"}
        </button>
      </>}>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div>
          <label style={{fontSize:11.5,fontWeight:700,color:"#495057",textTransform:"uppercase",letterSpacing:".06em",display:"block",marginBottom:5}}>Code *</label>
          <input value={f.code} onChange={e=>up("code",e.target.value)} placeholder="60100" style={{...inp()}}/>
        </div>
        <div>
          <label style={{fontSize:11.5,fontWeight:700,color:"#495057",textTransform:"uppercase",letterSpacing:".06em",display:"block",marginBottom:5}}>Libellé *</label>
          <input value={f.libelle} onChange={e=>up("libelle",e.target.value)} placeholder="Achats de matières premières" style={{...inp()}}/>
        </div>
        <div>
          <label style={{fontSize:11.5,fontWeight:700,color:"#495057",textTransform:"uppercase",letterSpacing:".06em",display:"block",marginBottom:5}}>Catégorie</label>
          <select value={f.categorie} onChange={e=>up("categorie",e.target.value)} style={{...inp()}}>
            {CATS.map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
    </Modal>
  );
}

export default function PlanComptes(){
  const{planComptes,setPlanComptes}=useApp();
  const[modal,setModal]=useState(null); // null | "add" | {edit: pc}
  const[q,setQ]=useState("");
  const[catF,setCatF]=useState("Tous");
  const fileRef=useRef();

  const filtered=(planComptes||[]).filter(pc=>
    (catF==="Tous"||pc.categorie===catF)&&
    (!q||pc.code.includes(q)||pc.libelle.toLowerCase().includes(q.toLowerCase()))
  );

  function addPc(f){
    const id="PC"+Date.now();
    setPlanComptes(p=>[...p,{...f,id}]);
    setModal(null);
  }

  function editPc(f){
    setPlanComptes(p=>p.map(pc=>pc.id===modal.edit.id?{...pc,...f}:pc));
    setModal(null);
  }

  function deletePc(id){
    if(!confirm("Supprimer ce compte ?"))return;
    setPlanComptes(p=>p.filter(pc=>pc.id!==id));
  }

  function importCSV(e){
    const file=e.target.files[0];
    if(!file)return;
    const r=new FileReader();
    r.onload=ev=>{
      const lines=ev.target.result.split("\n").filter(Boolean).slice(1); // skip header
      const newPcs=lines.map(l=>{
        const[code,libelle,categorie=""]=l.split(",").map(s=>s.trim().replace(/^"|"$/g,""));
        if(!code||!libelle)return null;
        return{id:"PC"+Date.now()+Math.random(),code,libelle,categorie:categorie||"Autre"};
      }).filter(Boolean);
      setPlanComptes(p=>[...p,...newPcs]);
    };
    r.readAsText(file);
    e.target.value="";
  }

  function exportCSV(){
    const rows=["Code,Libellé,Catégorie",...(planComptes||[]).map(pc=>`${pc.code},"${pc.libelle}",${pc.categorie}`)];
    const blob=new Blob([rows.join("\n")],{type:"text/csv"});
    const a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download="plan_comptes.csv";
    a.click();
  }

  return(
    <div style={{animation:"fadeIn .2s ease"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div>
          <h2 style={{fontSize:17,fontWeight:700,color:"#212529",marginBottom:3}}>Plan de Comptes</h2>
          <p style={{fontSize:12.5,color:MUT}}>{(planComptes||[]).length} comptes · Importable depuis CSV ou application tierce</p>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Rechercher…" style={{...inp(),width:180}}/>
          <select value={catF} onChange={e=>setCatF(e.target.value)} style={{...inp(),width:140}}>
            <option>Tous</option>
            {CATS.map(c=><option key={c}>{c}</option>)}
          </select>
          <button onClick={()=>fileRef.current?.click()} style={btn("light",true)}>
            <span style={{display:"flex"}}>{IC.upload}</span> Import CSV
          </button>
          <input ref={fileRef} type="file" accept=".csv" style={{display:"none"}} onChange={importCSV}/>
          <button onClick={exportCSV} style={btn("light",true)}>
            <span style={{display:"flex"}}>{IC.download}</span> Export CSV
          </button>
          <button onClick={()=>setModal("add")} style={btn("primary")}>
            <span style={{display:"flex"}}>{IC.plus}</span> Nouveau
          </button>
        </div>
      </div>

      {/* CSV format info */}
      <div style={{...card(),padding:"10px 14px",marginBottom:14,background:"#f0f7ff",border:`1px solid #b8d4f7`}}>
        <div style={{fontSize:12,color:"#1a4a8a"}}>
          💡 <b>Format CSV :</b> <code>Code,Libellé,Catégorie</code> (sans entête ou avec entête ignorée)
          — Compatible avec exports Sage, EBP, QuickBooks. La synchronisation avec TOMPRO ou autre ERP peut être automatisée via API.
        </div>
      </div>

      <div style={{...card(),overflow:"hidden"}}>
        <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}><table style={{width:"100%",minWidth:600,borderCollapse:"collapse",fontSize:12.5}}>
          <thead>
            <tr>
              {["Code","Libellé","Catégorie",""].map(h=>(
                <th key={h} style={{background:"#2d4a7a",color:"#fff",padding:"9px 14px",fontWeight:700,fontSize:11,textTransform:"uppercase",letterSpacing:".07em",textAlign:"left"}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(pc=>(
              <tr key={pc.id} style={{borderBottom:`1px solid ${BD}`}}
                onMouseEnter={e=>e.currentTarget.style.background="#f8f9fc"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{padding:"9px 14px",fontWeight:700,color:P,fontFamily:"monospace",fontSize:13}}>{pc.code}</td>
                <td style={{padding:"9px 14px",color:"#212529"}}>{pc.libelle}</td>
                <td style={{padding:"9px 14px"}}>
                  <span style={{...bdg("#eef1f8",P,{fontSize:10.5})}}>{pc.categorie}</span>
                </td>
                <td style={{padding:"9px 14px",textAlign:"right"}}>
                  <div style={{display:"flex",gap:6,justifyContent:"flex-end"}}>
                    <button onClick={()=>setModal({edit:pc})} style={{...btn("light",true),padding:"3px 10px"}}>
                      <span style={{display:"flex"}}>{IC.edit}</span>
                    </button>
                    <button onClick={()=>deletePc(pc.id)} style={{...btn("danger",true),padding:"3px 10px"}}>
                      <span style={{display:"flex"}}>{IC.x}</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length===0&&(
              <tr><td colSpan={4} style={{textAlign:"center",padding:32,color:MUT}}>Aucun compte trouvé</td></tr>
            )}
          </tbody>
        </table></div>
      </div>

      {modal==="add"&&<PcForm onSave={addPc} onClose={()=>setModal(null)}/>}
      {modal?.edit&&<PcForm init={modal.edit} onSave={editPc} onClose={()=>setModal(null)}/>}
    </div>
  );
}