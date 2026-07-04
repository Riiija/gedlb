"use client";
import{useState}from"react";
import{useApp}from"../../context/AppContext";
import{card,btn,inp,lbl,MUT,P,BD,SUC,SUCL,SUCD,DNG,TR,WH,RSm}from"../../lib/theme";
import{fmtN}from"../../lib/utils";

const BAILLEURS=["Banque Mondiale","PNUD","BAD","FIDA","AFD","UE","USAID","Autre"];
const DEFAULT_SITES=["Antananarivo","Fianarantsoa","Toamasina","Toliara","Morondava","Mahajanga"];

function gid(p){return p+"-"+Date.now().toString(36).toUpperCase();}

/* ─── KPI card ─── */
function KPI({icon,val,label,color}){
  return(
    <div style={{...card(),padding:"14px 18px",borderLeft:"4px solid "+color}}>
      <div style={{fontSize:11,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".05em",marginBottom:5}}>
        {icon} {label}
      </div>
      <div style={{fontSize:22,fontWeight:900,color}}>{val}</div>
    </div>
  );
}

/* ─── Modal Projet ─── */
function ProjetModal({projet,allSites,onSave,onClose}){
  const[form,setForm]=useState({
    id:"",nom:"",bailleur:"",budget:"",sites:["Antananarivo"],actif:true,dateDebut:"",dateFin:"",
    ...(projet||{}),
    budget:String(projet?.budget||""),
  });
  const up=(k,v)=>setForm(p=>({...p,[k]:v}));

  function toggleSite(s){
    const sites=form.sites||[];
    up("sites",sites.includes(s)?sites.filter(x=>x!==s):[...sites,s]);
  }

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:9999,
      display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:WH,borderRadius:12,width:"100%",maxWidth:560,
        maxHeight:"90vh",overflowY:"auto",padding:28,boxShadow:"0 20px 60px rgba(0,0,0,.25)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <h3 style={{fontSize:15,fontWeight:800,color:"#212529",margin:0}}>
            {projet?"✏️ Modifier le projet":"➕ Nouveau projet"}
          </h3>
          <button onClick={onClose}
            style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:MUT}}>×</button>
        </div>

        <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr",gap:14}}>
          <div style={{gridColumn:"1/-1"}}>
            <div style={lbl}>Nom du projet *</div>
            <input value={form.nom||""} onChange={e=>up("nom",e.target.value)}
              style={{...inp({boxSizing:"border-box",width:"100%"})}} placeholder="Ex : PREA – Réhabilitation Écoles"/>
          </div>
          <div>
            <div style={lbl}>Bailleur</div>
            <select value={form.bailleur||""} onChange={e=>up("bailleur",e.target.value)}
              style={{...inp({boxSizing:"border-box",width:"100%",cursor:"pointer"})}}>
              <option value="">— Sélectionner —</option>
              {BAILLEURS.map(b=><option key={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <div style={lbl}>Budget (Ar)</div>
            <input type="number" value={form.budget||""} onChange={e=>up("budget",e.target.value)}
              style={{...inp({boxSizing:"border-box",width:"100%"})}} placeholder="Ex : 4 500 000 000"/>
          </div>
          <div>
            <div style={lbl}>Date de début</div>
            <input type="date" value={form.dateDebut||""} onChange={e=>up("dateDebut",e.target.value)}
              style={{...inp({boxSizing:"border-box",width:"100%"})}}/>
          </div>
          <div>
            <div style={lbl}>Date de fin</div>
            <input type="date" value={form.dateFin||""} onChange={e=>up("dateFin",e.target.value)}
              style={{...inp({boxSizing:"border-box",width:"100%"})}}/>
          </div>
          <div style={{gridColumn:"1/-1",display:"flex",alignItems:"center",gap:8}}>
            <input type="checkbox" id="actifCheck" checked={!!form.actif}
              onChange={e=>up("actif",e.target.checked)}
              style={{width:15,height:15,cursor:"pointer"}}/>
            <label htmlFor="actifCheck" style={{fontSize:13,cursor:"pointer",color:"#212529"}}>
              Projet actif
            </label>
          </div>
        </div>

        {/* Sites */}
        <div style={{marginTop:18}}>
          <div style={lbl}>Sites autorisés</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:6}}>
            {allSites.map(s=>{
              const checked=(form.sites||[]).includes(s);
              return(
                <label key={s}
                  style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",
                    padding:"5px 12px",border:"1px solid "+(checked?P:BD),borderRadius:20,
                    background:checked?"#eef1f8":"transparent",fontSize:12,
                    fontWeight:checked?700:400,color:checked?P:"#495057",transition:"all .12s"}}>
                  <input type="checkbox" checked={checked} onChange={()=>toggleSite(s)} style={{display:"none"}}/>
                  {checked&&<span style={{fontSize:10}}>✓</span>} {s}
                </label>
              );
            })}
          </div>
        </div>

        <div style={{display:"flex",gap:10,marginTop:24,justifyContent:"flex-end"}}>
          <button onClick={onClose} style={btn("light",true)}>Annuler</button>
          <button onClick={()=>{if(form.nom)onSave({...form,budget:parseFloat(form.budget||"0")||0,sites:form.sites||[]});}}
            style={{...btn("primary",true),opacity:form.nom?1:.5}}>
            {projet?"💾 Enregistrer":"➕ Créer le projet"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   EXPORT PRINCIPAL
═══════════════════════════════════════════════════════ */
export default function GestionProjetsPortail(){
  const{projets,setProjets,docs}=useApp();
  const[view,setView]=useState("projets"); // "projets" | "sites"
  const[modal,setModal]=useState(null);    // null | "new" | projet-object
  const[q,setQ]=useState("");

  /* ── Sites state (liste globale) ── */
  const[sites,setSites]=useState(DEFAULT_SITES);
  const[newSite,setNewSite]=useState("");
  const[editSite,setEditSite]=useState(null);  // {old, value}

  /* ── Projets filtrés ── */
  const filtered=projets.filter(p=>
    !q||p.nom.toLowerCase().includes(q.toLowerCase())
    ||p.bailleur?.toLowerCase().includes(q.toLowerCase())
  );

  function saveProjet(form){
    const proj={...form,sites:form.sites||[]};
    if(proj.id){
      setProjets(p=>p.map(x=>x.id===proj.id?proj:x));
    }else{
      setProjets(p=>[...p,{...proj,id:gid("PRJ")}]);
    }
    setModal(null);
  }

  function delProjet(id){
    if(window.confirm("Supprimer ce projet ?"))
      setProjets(p=>p.filter(x=>x.id!==id));
  }

  /* ── Site helpers ── */
  function addSite(){
    const s=newSite.trim();
    if(s&&!sites.includes(s)){setSites(p=>[...p,s]);}
    setNewSite("");
  }
  function renameSite(){
    const v=editSite.value.trim();
    if(!v)return;
    setSites(p=>p.map(s=>s===editSite.old?v:s));
    setProjets(p=>p.map(proj=>({...proj,sites:(proj.sites||[]).map(s=>s===editSite.old?v:s)})));
    setEditSite(null);
  }
  function delSite(s){
    if(!window.confirm(`Supprimer le site "${s}" ? Il sera retiré de tous les projets.`))return;
    setSites(p=>p.filter(x=>x!==s));
    setProjets(p=>p.map(proj=>({...proj,sites:(proj.sites||[]).filter(x=>x!==s)})));
  }

  const nbActifs=projets.filter(p=>p.actif).length;
  const budgetTotal=projets.reduce((s,p)=>s+(p.budget||0),0);

  return(
    <div style={{animation:"fadeIn .2s ease"}}>
      {/* ── Header ── */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <div>
          <h2 style={{fontSize:20,fontWeight:800,color:"#212529",marginBottom:2}}>
            Projets &amp; Sites
          </h2>
          <p style={{fontSize:13,color:MUT}}>
            Administration du référentiel — portail SoftApplication
          </p>
        </div>
        {view==="projets"&&(
          <button onClick={()=>setModal("new")}
            style={{...btn("primary"),display:"flex",alignItems:"center",gap:8}}>
            + Nouveau projet
          </button>
        )}
      </div>

      {/* ── Tabs ── */}
      <div style={{display:"flex",borderBottom:"2px solid "+BD,marginBottom:20}}>
        {[{id:"projets",label:"🗂 Projets"},{id:"sites",label:"📍 Sites"}].map(t=>(
          <button key={t.id} onClick={()=>setView(t.id)}
            style={{padding:"9px 20px",border:"none",background:"none",cursor:"pointer",
              fontFamily:"inherit",fontSize:13,fontWeight:view===t.id?700:500,
              color:view===t.id?P:MUT,
              borderBottom:"2px solid "+(view===t.id?P:"transparent"),
              marginBottom:-2,transition:"all .15s"}}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ════════ TAB PROJETS ════════ */}
      {view==="projets"&&(
        <>
          {/* KPIs */}
          <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"repeat(2,1fr)":"repeat(4,1fr)",gap:12,marginBottom:20}}>
            <KPI icon="🗂" val={projets.length}  label="Total projets"   color="#324372"/>
            <KPI icon="✅" val={nbActifs}         label="Actifs"          color={P}/>
            <KPI icon="💰" val={fmtN(budgetTotal)+" Ar"} label="Budget total" color="#d97706"/>
            <KPI icon="📄" val={docs.length}     label="Documents liés"  color="#059669"/>
          </div>

          {/* Recherche */}
          <div style={{...card(),padding:"10px 16px",marginBottom:14}}>
            <input value={q} onChange={e=>setQ(e.target.value)}
              placeholder="🔍 Rechercher par nom ou bailleur…"
              style={{...inp({fontSize:13,maxWidth:400})}}/>
          </div>

          {/* Grille projets */}
          {filtered.length===0?(
            <div style={{...card(),padding:40,textAlign:"center",color:MUT,fontSize:13}}>
              Aucun projet trouvé.
            </div>
          ):(
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:16}}>
              {filtered.map(proj=>{
                const nbDocs=docs.filter(d=>d.proj===proj.id).length;
                const depense=docs.filter(d=>d.proj===proj.id).reduce((s,d)=>s+(d.mtR||d.mt||0),0);
                const pct=proj.budget>0?Math.round(depense/proj.budget*100):0;
                return(
                  <div key={proj.id} style={{...card(),padding:20,position:"relative"}}>
                    {/* badge statut */}
                    <div style={{position:"absolute",top:14,right:14}}>
                      <span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:10,
                        background:proj.actif?SUCL:"#f0f0f0",color:proj.actif?SUCD:MUT}}>
                        {proj.actif?"✅ Actif":"⏸ Inactif"}
                      </span>
                    </div>

                    <div style={{marginBottom:12,paddingRight:72}}>
                      <div style={{fontSize:11,color:P,fontWeight:700,marginBottom:3}}>{proj.id}</div>
                      <div style={{fontSize:14,fontWeight:700,color:"#212529",lineHeight:1.3}}>{proj.nom}</div>
                      {proj.bailleur&&(
                        <div style={{fontSize:12,color:MUT,marginTop:3}}>
                          Bailleur : <b style={{color:"#495057"}}>{proj.bailleur}</b>
                        </div>
                      )}
                    </div>

                    {/* Budget bar */}
                    {proj.budget>0&&(
                      <div style={{marginBottom:12}}>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:3}}>
                          <span style={{color:MUT}}>Budget utilisé</span>
                          <span style={{fontWeight:700,color:"#212529"}}>{pct}% · {fmtN(depense)} Ar</span>
                        </div>
                        <div style={{background:"#e9ecef",borderRadius:4,height:5}}>
                          <div style={{width:`${Math.min(pct,100)}%`,height:"100%",borderRadius:4,
                            background:pct>90?"#dc3545":pct>70?"#f5a623":SUC,transition:"width .4s"}}/>
                        </div>
                        <div style={{fontSize:10,color:MUT,marginTop:2}}>Total : {fmtN(proj.budget)} Ar</div>
                      </div>
                    )}

                    {/* Sites chips */}
                    <div style={{marginBottom:12}}>
                      <div style={{fontSize:10,color:MUT,fontWeight:700,textTransform:"uppercase",marginBottom:5}}>
                        Sites ({proj.sites?.length||0})
                      </div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                        {(proj.sites||[]).map(s=>(
                          <span key={s} style={{fontSize:11,background:"#eef1f8",color:P,
                            padding:"2px 8px",borderRadius:3,fontWeight:500}}>{s}</span>
                        ))}
                        {(!proj.sites||proj.sites.length===0)&&(
                          <span style={{fontSize:11,color:MUT}}>Aucun site</span>
                        )}
                      </div>
                    </div>

                    {/* Dates + docs */}
                    <div style={{display:"flex",gap:14,paddingTop:10,borderTop:"1px solid "+BD,marginBottom:14}}>
                      <div style={{textAlign:"center"}}>
                        <div style={{fontSize:17,fontWeight:700,color:P}}>{nbDocs}</div>
                        <div style={{fontSize:9,color:MUT,textTransform:"uppercase"}}>Documents</div>
                      </div>
                      {proj.dateDebut&&(
                        <div>
                          <div style={{fontSize:11,fontWeight:600,color:"#212529"}}>{proj.dateDebut}</div>
                          <div style={{fontSize:9,color:MUT,textTransform:"uppercase"}}>Début</div>
                        </div>
                      )}
                      {proj.dateFin&&(
                        <div>
                          <div style={{fontSize:11,fontWeight:600,color:"#212529"}}>{proj.dateFin}</div>
                          <div style={{fontSize:9,color:MUT,textTransform:"uppercase"}}>Fin</div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div style={{display:"flex",gap:8}}>
                      <button onClick={()=>setModal(proj)}
                        style={{...btn("light",true),flex:1,fontSize:12,padding:"6px 12px"}}>
                        ✏️ Modifier
                      </button>
                      <button onClick={()=>delProjet(proj.id)}
                        style={{...btn("light",true),fontSize:12,padding:"6px 10px",
                          color:DNG,borderColor:"#fca5a5",background:"#fff5f5"}}>
                        🗑
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ════════ TAB SITES ════════ */}
      {view==="sites"&&(
        <>
          <div style={{...card(),padding:20,marginBottom:16}}>
            <h3 style={{fontSize:14,fontWeight:700,color:"#212529",marginBottom:12}}>
              📍 Référentiel des sites ({sites.length})
            </h3>

            {/* Ajouter */}
            <div style={{display:"flex",gap:8,marginBottom:16}}>
              <input value={newSite} onChange={e=>setNewSite(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&addSite()}
                placeholder="Nom du nouveau site…"
                style={{...inp({flex:1,maxWidth:320})}}/>
              <button onClick={addSite}
                style={{...btn("primary",true),whiteSpace:"nowrap"}}>
                + Ajouter
              </button>
            </div>

            {/* Liste des sites */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>
              {sites.map(s=>{
                const nbProjets=projets.filter(p=>(p.sites||[]).includes(s)).length;
                const isEditing=editSite?.old===s;
                return(
                  <div key={s}
                    style={{...card(),padding:"12px 14px",display:"flex",alignItems:"center",
                      gap:10,border:"1px solid "+BD}}>
                    <div style={{width:32,height:32,borderRadius:8,background:"#eef1f8",
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:16,flexShrink:0}}>
                      📍
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      {isEditing?(
                        <input value={editSite.value}
                          onChange={e=>setEditSite(x=>({...x,value:e.target.value}))}
                          onKeyDown={e=>e.key==="Enter"&&renameSite()}
                          style={{...inp({padding:"4px 8px",fontSize:13,width:"100%",boxSizing:"border-box"})}}
                          autoFocus/>
                      ):(
                        <>
                          <div style={{fontSize:13,fontWeight:600,color:"#212529",
                            overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s}</div>
                          <div style={{fontSize:11,color:MUT,marginTop:1}}>
                            {nbProjets} projet{nbProjets>1?"s":""}
                          </div>
                        </>
                      )}
                    </div>
                    <div style={{display:"flex",gap:5,flexShrink:0}}>
                      {isEditing?(
                        <>
                          <button onClick={renameSite}
                            style={{padding:"4px 10px",borderRadius:5,border:"none",
                              background:P,color:"#fff",cursor:"pointer",fontSize:11,
                              fontWeight:700,fontFamily:"inherit"}}>
                            ✓
                          </button>
                          <button onClick={()=>setEditSite(null)}
                            style={{padding:"4px 8px",borderRadius:5,border:"1px solid "+BD,
                              background:"#fff",cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>
                            ✕
                          </button>
                        </>
                      ):(
                        <>
                          <button onClick={()=>setEditSite({old:s,value:s})}
                            style={{padding:"4px 8px",borderRadius:5,border:"1px solid "+BD,
                              background:"#fff",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>
                            ✏️
                          </button>
                          <button onClick={()=>delSite(s)}
                            style={{padding:"4px 8px",borderRadius:5,border:"1px solid #fca5a5",
                              background:"#fff5f5",cursor:"pointer",fontSize:12,fontFamily:"inherit",color:DNG}}>
                            🗑
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {sites.length===0&&(
              <div style={{textAlign:"center",padding:"30px 0",color:MUT,fontSize:13}}>
                Aucun site configuré. Ajoutez-en un ci-dessus.
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Modal Projet ── */}
      {modal&&(
        <ProjetModal
          projet={modal==="new"?null:modal}
          allSites={sites}
          onSave={saveProjet}
          onClose={()=>setModal(null)}/>
      )}
    </div>
  );
}
