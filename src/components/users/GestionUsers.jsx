"use client";
import{useState}from"react";
import{Modal}from"../ui/Modal";
import{IC}from"../ui/Icons";
import{card,btn,inp,lbl,bdg,TH,TD,P,BD,MUT,SUCL,SUCD,RSm,TR}from"../../lib/theme";
import{PROJETS,ALL_SITES,DROITS_DEF}from"../../lib/data";
import{useApp}from"../../context/AppContext";

export default function GestionUsers(){
  const{users,setUsers}=useApp();
  const[modal,setModal]=useState(null);
  const[edit,setEdit]=useState({});

  function openEdit(u){setEdit(JSON.parse(JSON.stringify(u)));setModal("edit");}
  function save(){setUsers(p=>p.map(u=>u.id===edit.id?edit:u));setModal(null);}
  const toggleDroit=(k)=>setEdit(p=>({...p,droits:{...p.droits,[k]:!p.droits?.[k]}}));
  const toggleProj=(pid)=>{
    const has=edit.projets?.some(x=>x.pid===pid);
    setEdit(p=>({...p,projets:has?p.projets.filter(x=>x.pid!==pid):[...(p.projets||[]),{pid,sites:[]}]}));
  };
  const toggleSite=(pid,site)=>{
    setEdit(p=>({...p,projets:(p.projets||[]).map(x=>x.pid===pid?{...x,sites:x.sites.includes(site)?x.sites.filter(s=>s!==site):[...x.sites,site]}:x)}));
  };

  return(
    <div style={{animation:"fadeIn .2s ease"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <h2 style={{fontSize:17,fontWeight:700,color:"#212529"}}>Utilisateurs & Droits</h2>
        <button style={btn("primary",true)}>
          <span style={{display:"flex"}}>{IC.plus}</span> Nouvel utilisateur
        </button>
      </div>

      <div style={{...card()}}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead>
              <tr>{["Utilisateur","Rôle","Site","Projets","Droits actifs","Statut",""].map(h=><th key={h} style={TH}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {users.map(u=>(
                <tr key={u.id}
                  onMouseEnter={e=>e.currentTarget.style.background="#f8f9fc"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={TD}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:36,height:36,borderRadius:"50%",background:"#eef1f8",color:P,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12,flexShrink:0}}>{u.init}</div>
                      <div>
                        <div style={{fontWeight:600,fontSize:13,color:"#212529"}}>{u.nom}</div>
                        <div style={{fontSize:11,color:MUT}}>{u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{...TD,fontSize:12,color:"#495057"}}>{u.role}</td>
                  <td style={TD}><span style={{fontSize:11,background:"#eef1f8",color:P,padding:"2px 8px",borderRadius:3}}>{u.site}</span></td>
                  <td style={TD}>
                    <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
                      {u.projets?.slice(0,3).map(pa=><span key={pa.pid} style={bdg("#f0f2f5","#495057",{fontSize:10})}>{pa.pid}</span>)}
                      {(u.projets?.length||0)>3&&<span style={bdg("#f0f2f5",MUT,{fontSize:10})}>+{u.projets.length-3}</span>}
                    </div>
                  </td>
                  <td style={TD}>
                    <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
                      {Object.entries(u.droits||{}).filter(([,v])=>v).map(([k])=>(
                        <span key={k} style={bdg("#eef1f8",P,{fontSize:10})}>{DROITS_DEF.find(d=>d.k===k)?.l.split(" ").slice(0,2).join(" ")||k}</span>
                      ))}
                    </div>
                  </td>
                  <td style={TD}>
                    <span style={bdg(u.actif?SUCL:"#e9ecef",u.actif?SUCD:MUT,{fontSize:11})}>
                      {u.actif?"Actif":"Inactif"}
                    </span>
                  </td>
                  <td style={TD}>
                    <div style={{display:"flex",gap:6}}>
                      <button onClick={()=>openEdit(u)} style={btn("light",true)}><span style={{display:"flex"}}>{IC.edit}</span></button>
                      <button onClick={()=>setUsers(p=>p.map(x=>x.id===u.id?{...x,actif:!x.actif}:x))}
                        style={{...btn("light",true),color:u.actif?"#dc3545":"#28a745"}}>
                        <span style={{display:"flex"}}>{u.actif?IC.xCircle:IC.checkCircle}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal==="edit"&&edit&&(
        <Modal title={`Modifier — ${edit.nom}`} onClose={()=>setModal(null)} w={700}
          footer={<>
            <button onClick={()=>setModal(null)} style={btn("light",true)}>Annuler</button>
            <button onClick={save} style={btn("primary")}>
              <span style={{display:"flex"}}>{IC.chk}</span> Enregistrer
            </button>
          </>}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
            <div><label style={lbl}>Nom</label><input value={edit.nom||""} onChange={e=>setEdit(p=>({...p,nom:e.target.value}))} style={inp()}/></div>
            <div><label style={lbl}>Rôle</label><input value={edit.role||""} onChange={e=>setEdit(p=>({...p,role:e.target.value}))} style={inp()}/></div>
            <div><label style={lbl}>Site principal</label>
              <select value={edit.site||""} onChange={e=>setEdit(p=>({...p,site:e.target.value}))} style={inp()}>
                {ALL_SITES.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Droits */}
          <div style={{marginBottom:16}}>
            <div style={{fontSize:12,fontWeight:700,color:"#495057",textTransform:"uppercase",letterSpacing:".06em",marginBottom:10}}>Droits d'accès</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {DROITS_DEF.map(d=>(
                <label key={d.k} style={{display:"flex",gap:10,padding:"10px 12px",border:`1px solid ${BD}`,borderRadius:RSm,cursor:"pointer",background:edit.droits?.[d.k]?"#f0f4ff":"#fff",transition:TR}}>
                  <input type="checkbox" checked={!!edit.droits?.[d.k]} onChange={()=>toggleDroit(d.k)} style={{marginTop:2,flexShrink:0}}/>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:"#212529"}}>{d.l}</div>
                    <div style={{fontSize:11,color:MUT}}>{d.d}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Projets */}
          <div>
            <div style={{fontSize:12,fontWeight:700,color:"#495057",textTransform:"uppercase",letterSpacing:".06em",marginBottom:10}}>Projets autorisés</div>
            {PROJETS.map(p=>{
              const pa=edit.projets?.find(x=>x.pid===p.id);
              return(
                <div key={p.id} style={{border:`1px solid ${BD}`,borderRadius:RSm,overflow:"hidden",marginBottom:8}}>
                  <label style={{display:"flex",gap:10,alignItems:"center",padding:"10px 12px",cursor:"pointer",background:pa?"#f0f4ff":"#fff"}}>
                    <input type="checkbox" checked={!!pa} onChange={()=>toggleProj(p.id)}/>
                    <div>
                      <div style={{fontSize:13,fontWeight:600,color:"#212529"}}>{p.nom}</div>
                      <div style={{fontSize:11,color:MUT}}>{p.bailleur}</div>
                    </div>
                  </label>
                  {pa&&(
                    <div style={{padding:"8px 12px 12px 34px",background:"#f8f9fc",borderTop:`1px solid ${BD}`,display:"flex",gap:12,flexWrap:"wrap"}}>
                      {p.sites.map(s=>(
                        <label key={s} style={{display:"flex",gap:6,alignItems:"center",fontSize:12,cursor:"pointer"}}>
                          <input type="checkbox" checked={pa.sites.includes(s)} onChange={()=>toggleSite(p.id,s)}/>
                          {s}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Modal>
      )}
    </div>
  );
}
