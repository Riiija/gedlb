"use client";
import{useState}from"react";
import{Modal}from"../ui/Modal";
import{IC}from"../ui/Icons";
import{Avatar}from"../ui/Badge";
import{card,btn,inp,lbl,bdg,BD,P,MUT,SUCL,SUCD,RSm,TR}from"../../lib/theme";
import{useApp}from"../../context/AppContext";
import{gid}from"../../lib/utils";

/* Map typeKey → IC */
const typeIcon=(key)=>({
  facture:IC.fileText,truck:IC.truck,clipboard:IC.clipboard,barChart:IC.barChart,
}[key]||IC.file);

export default function ParamTypes(){
  const{types,setTypes,users}=useApp();
  const[modal,setModal]=useState(null);
  const[edit,setEdit]=useState(null);

  function openEdit(t){setEdit(JSON.parse(JSON.stringify(t)));setModal("edit");}
  function save(){
    setTypes(p=>edit.id&&p.some(x=>x.id===edit.id)?p.map(t=>t.id===edit.id?edit:t):[...p,{...edit,id:gid("DT")}]);
    setModal(null);
  }
  function addEtape(){setEdit(p=>({...p,etapes:[...(p.etapes||[]),{label:"Nouvelle étape",v:[]}]}));}
  function removeEtape(i){setEdit(p=>({...p,etapes:p.etapes.filter((_,ii)=>ii!==i)}));}
  function toggleV(ei,uid){
    setEdit(p=>({...p,etapes:p.etapes.map((e,i)=>i===ei?{...e,v:e.v?.includes(uid)?e.v.filter(x=>x!==uid):[...(e.v||[]),uid]}:e)}));
  }

  return(
    <div style={{animation:"fadeIn .2s ease"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <h2 style={{fontSize:17,fontWeight:700,color:"#212529"}}>Types de documents</h2>
        <button onClick={()=>{setEdit({id:"",nom:"",typeKey:"facture",conf:false,etapes:[]});setModal("edit");}} style={btn("primary",true)}>
          <span style={{display:"flex"}}>{IC.plus}</span> Nouveau type
        </button>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14}}>
        {types.map(t=>(
          <div key={t.id} style={{...card(),padding:18}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              <div style={{width:38,height:38,borderRadius:6,background:"#eef1f8",display:"flex",alignItems:"center",justifyContent:"center",color:P,flexShrink:0}}>
                <span style={{display:"flex"}}>{typeIcon(t.typeKey)}</span>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:700,color:"#212529"}}>{t.nom}</div>
                <div style={{fontSize:11,color:MUT}}>{t.id} · {t.etapes?.length||0} étapes</div>
              </div>
              {t.conf&&(
                <span style={{...bdg("#e9d8f5","#5e1d8a",{fontSize:10}),display:"inline-flex",alignItems:"center",gap:3}}>
                  <span style={{display:"flex"}}>{IC.lock}</span>
                </span>
              )}
              <button onClick={()=>openEdit(t)} style={btn("light",true)}>
                <span style={{display:"flex"}}>{IC.edit}</span>
              </button>
            </div>
            <div>
              {t.etapes?.map((e,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderTop:i===0?"none":`1px solid ${BD}`}}>
                  <span style={{width:18,height:18,borderRadius:"50%",background:"#eef1f8",color:P,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0}}>{i+1}</span>
                  <span style={{fontSize:12,flex:1,color:"#495057"}}>{e.label}</span>
                  <div style={{display:"flex",gap:2}}>{e.v?.map(uid=><Avatar key={uid} uid={uid} users={users} size={20}/>)}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {modal==="edit"&&edit&&(
        <Modal title={edit.id?"Modifier le type":"Nouveau type"} onClose={()=>setModal(null)} w={620}
          footer={<>
            <button onClick={()=>setModal(null)} style={btn("light",true)}>Annuler</button>
            <button onClick={save} style={btn("primary")}>
              <span style={{display:"flex"}}>{IC.chk}</span> Enregistrer
            </button>
          </>}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
            <div><label style={lbl}>Nom</label><input value={edit.nom||""} onChange={e=>setEdit(p=>({...p,nom:e.target.value}))} style={inp()}/></div>
            <div><label style={lbl}>Type d'icône</label>
              <select value={edit.typeKey||"facture"} onChange={e=>setEdit(p=>({...p,typeKey:e.target.value}))} style={inp()}>
                <option value="facture">Facture</option>
                <option value="truck">Bon de livraison</option>
                <option value="clipboard">Contrat</option>
                <option value="barChart">Rapport</option>
              </select>
            </div>
            <div style={{gridColumn:"span 2"}}>
              <label style={{display:"flex",gap:8,alignItems:"center",fontSize:13,cursor:"pointer"}}>
                <input type="checkbox" checked={!!edit.conf} onChange={e=>setEdit(p=>({...p,conf:e.target.checked}))}/>
                Marquer comme confidentiel
              </label>
            </div>
          </div>
          <div style={{marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{fontSize:12,fontWeight:700,color:"#495057",textTransform:"uppercase",letterSpacing:".06em"}}>Étapes de validation</span>
            <button onClick={addEtape} style={btn("light",true)}>
              <span style={{display:"flex"}}>{IC.plus}</span> Ajouter
            </button>
          </div>
          {edit.etapes?.map((e,i)=>(
            <div key={i} style={{border:`1px solid ${BD}`,borderRadius:RSm,padding:12,marginBottom:8}}>
              <div style={{display:"flex",gap:8,marginBottom:8}}>
                <input value={e.label} onChange={ev=>setEdit(p=>({...p,etapes:p.etapes.map((x,ii)=>ii===i?{...x,label:ev.target.value}:x)}))}
                  style={{...inp({flex:1})}} placeholder="Nom de l'étape"/>
                <button onClick={()=>removeEtape(i)} style={btn("danger",true)}>
                  <span style={{display:"flex"}}>{IC.trash}</span>
                </button>
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {users.map(u=>(
                  <label key={u.id} style={{display:"flex",gap:5,alignItems:"center",fontSize:12,cursor:"pointer",padding:"3px 8px",border:`1px solid ${BD}`,borderRadius:20,background:e.v?.includes(u.id)?"#eef1f8":"#fff"}}>
                    <input type="checkbox" checked={e.v?.includes(u.id)||false} onChange={()=>toggleV(i,u.id)} style={{display:"none"}}/>
                    <Avatar uid={u.id} users={users} size={18}/>
                    {u.nom.split(" ")[0]}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </Modal>
      )}
    </div>
  );
}
