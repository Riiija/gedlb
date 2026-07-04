"use client";
import{useState}from"react";
import{useApp}from"../../context/AppContext";
import{card,btn,inp,BD,P,MUT,DNG,DNGL,DNGD,RSm,TR}from"../../lib/theme";
import{gid}from"../../lib/utils";
import{IC}from"../ui/Icons";

export function ParamCausesRefus(){
  const{causesRefus:causesRefusRaw,setCausesRefus}=useApp();
  const causesRefus=causesRefusRaw||[];
  const[editId,setEditId]=useState(null); // null | "new" | id
  const[editLabel,setEditLabel]=useState("");

  function startNew(){setEditId("new");setEditLabel("");}
  function startEdit(c){setEditId(c.id);setEditLabel(c.label);}
  function cancel(){setEditId(null);setEditLabel("");}

  function save(){
    const label=editLabel.trim();
    if(!label)return;
    if(editId==="new"){
      const id="CR"+String(Date.now()).slice(-4);
      setCausesRefus(p=>[...p,{id,label}]);
    }else{
      setCausesRefus(p=>p.map(c=>c.id===editId?{...c,label}:c));
    }
    cancel();
  }

  function remove(id){
    if(!confirm("Supprimer cette cause ?"))return;
    setCausesRefus(p=>p.filter(c=>c.id!==id));
  }

  return(
    <div style={{maxWidth:typeof window!=="undefined"&&window.innerWidth<=768?"95%":700,margin:"0 auto",padding:"24px 16px"}}>
      <div style={{marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <h2 style={{fontSize:18,fontWeight:800,color:"#212529",margin:0}}>Causes de refus</h2>
          <p style={{fontSize:12.5,color:MUT,margin:"4px 0 0"}}>Liste paramétrable des motifs de rejet disponibles dans l'interface de refus</p>
        </div>
        <button onClick={startNew} style={btn("primary",true)}>
          <span style={{display:"flex"}}>{IC.plus}</span> Ajouter
        </button>
      </div>

      {/* Add / edit form */}
      {editId&&(
        <div style={{...card(),padding:16,marginBottom:16,border:`2px solid ${P}`,borderRadius:RSm}}>
          <div style={{fontSize:12,fontWeight:700,color:P,marginBottom:8}}>
            {editId==="new"?"Nouvelle cause de refus":"Modifier la cause"}
          </div>
          <div style={{display:"flex",gap:8}}>
            <input value={editLabel} onChange={e=>setEditLabel(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter")save();if(e.key==="Escape")cancel();}}
              autoFocus placeholder="Ex: Facture non conforme"
              style={{...inp(),flex:1,fontSize:13}}/>
            <button onClick={save} disabled={!editLabel.trim()} style={{...btn("success",true),opacity:editLabel.trim()?1:.5}}>
              <span style={{display:"flex"}}>{IC.chk}</span> Enregistrer
            </button>
            <button onClick={cancel} style={btn("light",true)}>Annuler</button>
          </div>
        </div>
      )}

      {/* List */}
      <div style={{...card(),padding:0,overflow:"hidden"}}>
        {/* Header */}
        <div style={{display:"grid",gridTemplateColumns:"60px 1fr auto",gap:0,background:"#f8f9fc",borderBottom:`1px solid ${BD}`,padding:"8px 16px"}}>
          <div style={{fontSize:11,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".05em"}}>ID</div>
          <div style={{fontSize:11,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".05em"}}>Cause de refus</div>
          <div style={{fontSize:11,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".05em"}}>Actions</div>
        </div>
        {causesRefus.length===0&&(
          <div style={{textAlign:"center",padding:"32px 16px",color:MUT,fontSize:13}}>
            Aucune cause de refus configurée.<br/>
            <button onClick={startNew} style={{...btn("primary",true),marginTop:12}}>+ Ajouter la première</button>
          </div>
        )}
        {causesRefus.map((c,i)=>(
          <div key={c.id} style={{
            display:"grid",gridTemplateColumns:"60px 1fr auto",gap:0,
            padding:"10px 16px",borderBottom:i<causesRefus.length-1?`1px solid ${BD}`:"none",
            alignItems:"center",
            background:editId===c.id?"#eef1f8":"transparent",
            transition:TR,
          }}>
            <div style={{fontSize:11.5,fontWeight:600,color:MUT,fontFamily:"monospace"}}>{c.id}</div>
            <div style={{fontSize:13,fontWeight:600,color:"#212529"}}>{c.label}</div>
            <div style={{display:"flex",gap:6}}>
              <button onClick={()=>startEdit(c)} style={{...btn("light",true),padding:"3px 10px",fontSize:12}}>
                <span style={{display:"flex"}}>{IC.edit}</span> Modifier
              </button>
              <button onClick={()=>remove(c.id)} style={{...btn("danger",true),padding:"3px 10px",fontSize:12}}>
                <span style={{display:"flex"}}>{IC.trash}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{marginTop:12,fontSize:11.5,color:MUT,display:"flex",alignItems:"center",gap:5}}>
        <span style={{display:"flex"}}>{IC.alertTri}</span>
        Ces causes apparaissent comme options obligatoires dans la fenêtre de rejet d'un document.
      </div>
    </div>
  );
}
