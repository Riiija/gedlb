"use client";
import{useState}from"react";
import{card,btn,inp,TH,TD,P,BD,MUT,SUC,SUCL,SUCD,RSm,WH}from"../../lib/theme";
import{useApp}from"../../context/AppContext";
import{fmtN}from"../../lib/utils";

const ALL_SITES_DEFAULT=["Antananarivo","Fianarantsoa","Toamasina","Toliara","Morondava","Mahajanga"];
const BAILLEURS=["Banque Mondiale","PNUD","BAD","FIDA","AFD","UE","USAID","Autre"];

function gid(p){return p+"-"+Date.now().toString(36).toUpperCase();}

export default function GestionProjets(){
  const{projets,setProjets,docs}=useApp();
  const[modal,setModal]=useState(null);
  const[edit,setEdit]=useState({});
  const[q,setQ]=useState("");

  const up=(k,v)=>setEdit(p=>({...p,[k]:v}));

  function toggleSite(s){
    const sites=edit.sites||[];
    up("sites",sites.includes(s)?sites.filter(x=>x!==s):[...sites,s]);
  }

  function openNew(){
    setEdit({id:"",nom:"",bailleur:"",budget:"",sites:["Antananarivo"],actif:true,dateDebut:"",dateFin:""});
    setModal("edit");
  }
  function openEdit(p){setEdit({...p,budget:String(p.budget||"")});setModal("edit");}

  function save(){
    const proj={...edit,budget:parseFloat(edit.budget||"0")||0,sites:edit.sites||[]};
    if(!proj.nom){alert("Le nom du projet est requis.");return;}
    if(proj.id){
      setProjets(p=>p.map(x=>x.id===proj.id?proj:x));
    }else{
      proj.id=gid("PRJ");
      setProjets(p=>[...p,proj]);
    }
    setModal(null);
  }

  function del(id){
    if(!confirm("Supprimer ce projet ?"))return;
    setProjets(p=>p.filter(x=>x.id!==id));
  }

  const filtered=projets.filter(p=>!q||p.nom.toLowerCase().includes(q.toLowerCase())||p.bailleur?.toLowerCase().includes(q.toLowerCase()));

  return(
    <div style={{animation:"fadeIn .2s ease"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <div>
          <h2 style={{fontSize:17,fontWeight:700,color:"#212529",marginBottom:2}}>Gestion des Projets & Sites</h2>
          <p style={{fontSize:12,color:MUT}}>{projets.length} projet(s) configuré(s)</p>
        </div>
        <button onClick={openNew} style={btn("primary",true)}>
          <span style={{display:"inline-flex",alignItems:"center",gap:6}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nouveau projet
          </span>
        </button>
      </div>

      {/* Recherche */}
      <div style={{...card(),marginBottom:16,padding:"10px 16px"}}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Rechercher par nom ou bailleur…" style={{...inp(),fontSize:13,maxWidth:380}}/>
      </div>

      {/* Liste */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(360px,1fr))",gap:16}}>
        {filtered.map(proj=>{
          const nbDocs=docs.filter(d=>d.proj===proj.id).length;
          const budgetUtilise=docs.filter(d=>d.proj===proj.id).reduce((s,d)=>s+(d.mtR||d.mt||0),0);
          const pct=proj.budget>0?Math.round(budgetUtilise/proj.budget*100):0;
          return(
            <div key={proj.id} style={{...card(),padding:20,position:"relative"}}>
              {/* Statut */}
              <div style={{position:"absolute",top:16,right:16}}>
                <span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:10,background:proj.actif?SUCL:"#f8f9fc",color:proj.actif?SUCD:MUT}}>
                  {proj.actif?"Actif":"Inactif"}
                </span>
              </div>
              {/* Header */}
              <div style={{marginBottom:12}}>
                <div style={{fontSize:12,color:P,fontWeight:700,marginBottom:4}}>{proj.id}</div>
                <div style={{fontSize:15,fontWeight:700,color:"#212529",paddingRight:60,lineHeight:1.3}}>{proj.nom}</div>
                {proj.bailleur&&<div style={{fontSize:12,color:MUT,marginTop:4}}>Bailleur : <b style={{color:"#495057"}}>{proj.bailleur}</b></div>}
              </div>

              {/* Budget */}
              {proj.budget>0&&(
                <div style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}>
                    <span style={{color:MUT}}>Budget utilisé</span>
                    <span style={{fontWeight:600,color:"#212529"}}>{pct}% ({fmtN(budgetUtilise)} Ar)</span>
                  </div>
                  <div style={{background:"#e9ecef",borderRadius:4,height:6}}>
                    <div style={{width:`${Math.min(pct,100)}%`,height:"100%",background:pct>90?"#dc3545":pct>70?"#f5a623":SUC,borderRadius:4,transition:"width .4s"}}/>
                  </div>
                  <div style={{fontSize:11,color:MUT,marginTop:2}}>Total : {fmtN(proj.budget)} Ar</div>
                </div>
              )}

              {/* Sites */}
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11,color:MUT,fontWeight:600,textTransform:"uppercase",marginBottom:6}}>Sites ({proj.sites?.length||0})</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                  {(proj.sites||[]).map(s=>(
                    <span key={s} style={{fontSize:11,background:"#eef1f8",color:P,padding:"2px 8px",borderRadius:3,fontWeight:500}}>{s}</span>
                  ))}
                  {(!proj.sites||proj.sites.length===0)&&<span style={{color:MUT,fontSize:11}}>Aucun site</span>}
                </div>
              </div>

              {/* Stats */}
              <div style={{display:"flex",gap:16,marginBottom:14,paddingTop:10,borderTop:`1px solid ${BD}`}}>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:18,fontWeight:700,color:P}}>{nbDocs}</div>
                  <div style={{fontSize:10,color:MUT,textTransform:"uppercase"}}>Documents</div>
                </div>
                {proj.dateDebut&&(
                  <div style={{textAlign:"center"}}>
                    <div style={{fontSize:12,fontWeight:600,color:"#212529"}}>{proj.dateDebut}</div>
                    <div style={{fontSize:10,color:MUT,textTransform:"uppercase"}}>Début</div>
                  </div>
                )}
                {proj.dateFin&&(
                  <div style={{textAlign:"center"}}>
                    <div style={{fontSize:12,fontWeight:600,color:"#212529"}}>{proj.dateFin}</div>
                    <div style={{fontSize:10,color:MUT,textTransform:"uppercase"}}>Fin</div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>openEdit(proj)} style={{...btn("light",true),flex:1,fontSize:12,padding:"6px 12px"}}>
                  ✏️ Modifier
                </button>
                <button onClick={()=>del(proj.id)} style={{...btn("light",true),fontSize:12,padding:"6px 10px",color:"#dc3545",borderColor:"#dc3545"}}
                  onMouseEnter={e=>{e.currentTarget.style.background="#fff5f5";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}>
                  🗑
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length===0&&(
        <div style={{...card(),padding:40,textAlign:"center",color:MUT,fontSize:13}}>
          Aucun projet trouvé.
        </div>
      )}

      {/* Modal édition */}
      {modal==="edit"&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:5000,padding:20}}>
          <div style={{background:WH,borderRadius:12,width:"100%",maxWidth:560,maxHeight:"90vh",overflowY:"auto",padding:28,boxShadow:"0 20px 60px rgba(0,0,0,.25)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <h3 style={{fontSize:15,fontWeight:700,color:"#212529"}}>{edit.id?"Modifier le projet":"Nouveau projet"}</h3>
              <button onClick={()=>setModal(null)} style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:MUT,padding:"0 4px"}}>×</button>
            </div>

            <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr",gap:14}}>
              <div style={{gridColumn:"1/-1"}}>
                <label style={{fontSize:12,fontWeight:600,color:"#495057",display:"block",marginBottom:4}}>Nom du projet *</label>
                <input value={edit.nom||""} onChange={e=>up("nom",e.target.value)} style={inp()} placeholder="Ex: PREA – Réhabilitation Écoles"/>
              </div>
              <div>
                <label style={{fontSize:12,fontWeight:600,color:"#495057",display:"block",marginBottom:4}}>Bailleur</label>
                <select value={edit.bailleur||""} onChange={e=>up("bailleur",e.target.value)} style={inp({padding:"0 10px"})}>
                  <option value="">— Sélectionner —</option>
                  {BAILLEURS.map(b=><option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:12,fontWeight:600,color:"#495057",display:"block",marginBottom:4}}>Budget (Ar)</label>
                <input type="number" value={edit.budget||""} onChange={e=>up("budget",e.target.value)} style={inp()} placeholder="Ex: 4500000000"/>
              </div>
              <div>
                <label style={{fontSize:12,fontWeight:600,color:"#495057",display:"block",marginBottom:4}}>Date de début</label>
                <input type="date" value={edit.dateDebut||""} onChange={e=>up("dateDebut",e.target.value)} style={inp()}/>
              </div>
              <div>
                <label style={{fontSize:12,fontWeight:600,color:"#495057",display:"block",marginBottom:4}}>Date de fin</label>
                <input type="date" value={edit.dateFin||""} onChange={e=>up("dateFin",e.target.value)} style={inp()}/>
              </div>
              <div style={{gridColumn:"1/-1",display:"flex",alignItems:"center",gap:8}}>
                <input type="checkbox" id="actifCk" checked={!!edit.actif} onChange={e=>up("actif",e.target.checked)}/>
                <label htmlFor="actifCk" style={{fontSize:13,cursor:"pointer",color:"#212529"}}>Projet actif</label>
              </div>
            </div>

            {/* Sites */}
            <div style={{marginTop:18}}>
              <label style={{fontSize:12,fontWeight:600,color:"#495057",display:"block",marginBottom:8}}>Sites autorisés</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {ALL_SITES_DEFAULT.map(s=>{
                  const checked=(edit.sites||[]).includes(s);
                  return(
                    <label key={s} style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",
                      padding:"6px 12px",border:`1px solid ${checked?P:BD}`,borderRadius:20,background:checked?"#eef1f8":"transparent",
                      fontSize:12,fontWeight:checked?600:400,color:checked?P:"#495057",transition:"all .12s"}}>
                      <input type="checkbox" checked={checked} onChange={()=>toggleSite(s)} style={{display:"none"}}/>
                      {checked&&<span>✓</span>} {s}
                    </label>
                  );
                })}
              </div>
            </div>

            <div style={{display:"flex",gap:10,marginTop:24,justifyContent:"flex-end"}}>
              <button onClick={()=>setModal(null)} style={btn("light",true)}>Annuler</button>
              <button onClick={save} style={btn("primary",true)}>
                {edit.id?"💾 Enregistrer":"➕ Créer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
