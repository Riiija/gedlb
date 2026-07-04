"use client";
import{useState}from"react";
import{useApp,BACKOFFICE_USERS}from"../../context/AppContext";
import{PROJETS,ALL_SITES,DROITS_DEF}from"../../lib/data";
import{card,btn,inp,lbl,MUT,P,WH,BD,SUC,DNG,TR,BG}from"../../lib/theme";

const G="#1a6b3c";

const ROLES_SD=["superadmin","admin","standard","lecture seule"];
const ROLES_EP=["ep-admin","ep-gestionnaire","ep-valideur","ep-consultation"];
const ROLES_EP_LABELS={"ep-admin":"Administrateur","ep-gestionnaire":"Gestionnaire","ep-valideur":"Valideur liquidations","ep-consultation":"Consultation uniquement"};

const ALL_APPS=[{id:"softdocs",label:"SoftDocs",color:P,icon:"📄"},{id:"epaiement",label:"Soft E-paiement",color:G,icon:"💳"}];

const NOTIF_OPTS=[
  {id:"notif_nouveau_doc",label:"Nouveau document reçu"},
  {id:"notif_validation",label:"Document en attente de validation"},
  {id:"notif_retard",label:"Document en retard"},
  {id:"notif_bap",label:"Bon à payer validé"},
  {id:"notif_rejet",label:"Document rejeté"},
];

const EMPTY_USER={nom:"",role:"",email:"",password:"",systemRole:"standard",init:"",apps:[],sdRole:"standard",sdNotifs:["notif_nouveau_doc"],epRole:"ep-consultation",epRights:{liquidations:false,paiements:false,genXml:false,parametrage:false}};

function AppBadge({id}){
  const app=ALL_APPS.find(a=>a.id===id);
  if(!app)return null;
  return <span style={{fontSize:10.5,fontWeight:700,color:app.color,background:app.color+"15",padding:"2px 8px",borderRadius:10,border:"1px solid "+app.color+"30"}}>{app.icon} {app.label}</span>;
}

function UserCard({u,onEdit,onDel}){
  const hasSd=(u.apps||[]).includes("softdocs"),hasEp=(u.apps||[]).includes("epaiement");
  return(
    <div style={{...card(),padding:0,overflow:"hidden"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 18px",borderBottom:"1px solid "+BD}}>
        <div style={{width:42,height:42,borderRadius:10,background:P,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:800,color:"#fff",flexShrink:0}}>{u.init||u.nom?.charAt(0)||"?"}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:14,fontWeight:700,color:"#212529",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.nom}</div>
          <div style={{fontSize:12,color:MUT}}>{u.email}</div>
        </div>
        <div style={{display:"flex",gap:6,flexShrink:0}}>
          <button onClick={()=>onEdit(u)} style={{padding:"5px 12px",borderRadius:5,border:"1px solid "+BD,background:"#fff",cursor:"pointer",fontSize:11.5,fontFamily:"inherit"}}>Modifier</button>
          {u.id!=="U000"&&<button onClick={()=>onDel(u.id)} style={{padding:"5px 10px",borderRadius:5,border:"1px solid #f5c6c6",background:"#fff0f0",color:DNG,cursor:"pointer",fontSize:11.5}}>✕</button>}
        </div>
      </div>
      <div style={{padding:"12px 18px",display:"flex",gap:12,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{flex:1,display:"flex",gap:5,flexWrap:"wrap"}}>
          {hasSd&&<AppBadge id="softdocs"/>}
          {hasEp&&<AppBadge id="epaiement"/>}
          {!hasSd&&!hasEp&&<span style={{fontSize:11,color:MUT,fontStyle:"italic"}}>Aucune application</span>}
        </div>
        {u.systemRole==="superadmin"&&<span style={{fontSize:10.5,color:"#9b59b6",fontWeight:700,background:"#f0e6ff",padding:"2px 8px",borderRadius:10}}>⭐ Super Admin</span>}
        {u.systemRole==="admin"&&<span style={{fontSize:10.5,color:P,fontWeight:700,background:P+"15",padding:"2px 8px",borderRadius:10}}>Admin</span>}
        {u.systemRole==="standard"&&<span style={{fontSize:10.5,color:MUT,background:"#f0f2f5",padding:"2px 8px",borderRadius:10}}>Standard</span>}
      </div>
    </div>
  );
}

function UserModal({user,onSave,onClose,appContext="all"}){
  const[form,setForm]=useState({...EMPTY_USER,...(user||{})});
  const[tab,setTab]=useState("general");
  const up=(k,v)=>setForm(p=>({...p,[k]:v}));
  const hasSd=(form.apps||[]).includes("softdocs"),hasEp=(form.apps||[]).includes("epaiement");

  function toggleApp(appId){
    const cur=form.apps||[];
    const next=cur.includes(appId)?cur.filter(a=>a!==appId):[...cur,appId];
    up("apps",next);
  }

  const TABS=[
    {id:"general",label:"Général",icon:"👤"},
    ...(hasSd&&(appContext==="all"||appContext==="softdocs")?[{id:"softdocs",label:"SoftDocs",icon:"📄",color:P}]:[]),
    ...(hasEp&&(appContext==="all"||appContext==="epaiement")?[{id:"epaiement",label:"E-paiement",icon:"💳",color:G}]:[]),
    ...(hasSd&&(appContext==="all"||appContext==="softdocs")?[{id:"projets_droits",label:"Projets & Sites",icon:"🗂",color:"#7c3aed"}]:[]),
  ];

  const content={
    general:(
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:12}}>
          <div>
            <div style={lbl}>Nom complet *</div>
            <input value={form.nom} onChange={e=>up("nom",e.target.value)} style={{...inp({boxSizing:"border-box"})}} placeholder="Prénom Nom"/>
          </div>
          <div>
            <div style={lbl}>Initiales</div>
            <input value={form.init} onChange={e=>up("init",e.target.value.toUpperCase().slice(0,3))} style={{...inp({boxSizing:"border-box",width:70})}} maxLength={3}/>
          </div>
        </div>
        <div>
          <div style={lbl}>Fonction / Rôle affiché</div>
          <input value={form.role} onChange={e=>up("role",e.target.value)} style={{...inp({boxSizing:"border-box"})}} placeholder="ex: Chef de Projet"/>
        </div>
        <div>
          <div style={lbl}>Email *</div>
          <input type="email" value={form.email} onChange={e=>up("email",e.target.value)} style={{...inp({boxSizing:"border-box"})}} placeholder="prenom@softwell.mg"/>
        </div>
        <div>
          <div style={lbl}>Mot de passe {user?"(laisser vide pour conserver)":""}</div>
          <input type="password" value={form.password} onChange={e=>up("password",e.target.value)} style={{...inp({boxSizing:"border-box"})}}/>
        </div>
        <div>
          <div style={lbl}>Rôle système</div>
          <select value={form.systemRole} onChange={e=>up("systemRole",e.target.value)} style={{...inp({boxSizing:"border-box"})}}>
            {ROLES_SD.map(r=><option key={r} value={r}>{r}</option>)}
          </select>
        </div>
       
      </div>
    ),
    softdocs:(
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{background:P+"08",borderRadius:8,padding:"10px 14px",borderLeft:"3px solid "+P,fontSize:12.5,color:P,fontWeight:600}}>📄 Configuration des droits SoftDocs</div>
        <div>
          <div style={lbl}>Rôle SoftDocs</div>
          <select value={form.sdRole||"standard"} onChange={e=>up("sdRole",e.target.value)} style={{...inp({boxSizing:"border-box"})}}>
            {ROLES_SD.map(r=><option key={r} value={r}>{r.charAt(0).toUpperCase()+r.slice(1)}</option>)}
          </select>
          <div style={{fontSize:11.5,color:MUT,marginTop:4}}>
            {form.sdRole==="superadmin"&&"Accès total + paramétrage système"}
            {form.sdRole==="admin"&&"Accès total + gestion des utilisateurs"}
            {form.sdRole==="standard"&&"Dépôt, validation selon circuit"}
            {form.sdRole==="lecture seule"&&"Consultation uniquement"}
          </div>
        </div>
        <div>
          <div style={{fontSize:12,fontWeight:700,color:"#495057",marginBottom:10}}>Notifications par email</div>
          <div style={{display:"flex",flexDirection:"column",gap:7}}>
            {NOTIF_OPTS.map(n=>(
              <label key={n.id} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",padding:"8px 12px",borderRadius:8,background:(form.sdNotifs||[]).includes(n.id)?"#f0f4ff":"#f8f9fc",border:"1px solid "+((form.sdNotifs||[]).includes(n.id)?P+"30":BD)}}>
                <input type="checkbox" checked={(form.sdNotifs||[]).includes(n.id)} onChange={()=>{const cur=form.sdNotifs||[];up("sdNotifs",cur.includes(n.id)?cur.filter(x=>x!==n.id):[...cur,n.id]);}} style={{width:14,height:14,accentColor:P}}/>
                <span style={{fontSize:13,color:"#212529"}}>{n.label}</span>
              </label>
            ))}
          </div>
        </div>
        {/* ── Droits SoftDocs ── */}
        <div>
          <div style={{background:"#fff3cd",borderRadius:8,padding:"10px 14px",borderLeft:"3px solid #f5a623",fontSize:12.5,color:"#856404",fontWeight:600,marginBottom:10}}>🔑 Droits SoftDocs</div>
          <div style={{display:"flex",flexDirection:"column",gap:7}}>
            {(()=>{
              const droits=form.droits||{};
              function toggleDroit(k){setForm(p=>({...p,droits:{...(p.droits||{}),[k]:!(p.droits||{})[k]}}));}
              // Droits SoftDocs : tout sauf avance et liquidation (réservés E-paiement)
              const SD_DROITS=[
                {k:"relance",     l:"Relance traitement en retard",   d:"Peut envoyer des mails de relance pour les documents en retard de validation",color:"#f97316"},
                ...(DROITS_DEF||[]).filter(d=>d.k!=="avance"&&d.k!=="liquidation"),
              ];
              return SD_DROITS.map(d=>{
                const active=droits[d.k]||false;
                const col=d.color||"#f5a623";
                return(
                  <label key={d.k} style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer",padding:"10px 14px",borderRadius:8,background:active?col+"12":"#f8f9fc",border:"1px solid "+(active?col+"50":"#dee2e6"),transition:"all .15s"}}>
                    <div style={{width:18,height:18,borderRadius:4,flexShrink:0,border:"2px solid "+(active?col:"#dee2e6"),background:active?col:"#fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}
                      onMouseDown={e=>{e.preventDefault();toggleDroit(d.k);}}>
                      {active&&<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                    <div style={{flex:1}} onClick={()=>toggleDroit(d.k)}>
                      <div style={{fontSize:13,fontWeight:active?700:500,color:active?col:"#212529"}}>{d.l}</div>
                      <div style={{fontSize:11,color:"#6c757d"}}>{d.d}</div>
                    </div>
                    {active&&<span style={{fontSize:10,background:col,color:"#fff",padding:"2px 8px",borderRadius:10,fontWeight:700}}>Activé</span>}
                  </label>
                );
              });
            })()}
          </div>
        </div>
      </div>
    ),
    epaiement:(
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{background:G+"08",borderRadius:8,padding:"10px 14px",borderLeft:"3px solid "+G,fontSize:12.5,color:G,fontWeight:600}}>💳 Configuration des droits Soft E-paiement</div>
        <div>
          <div style={lbl}>Rôle E-paiement</div>
          <select value={form.epRole||"ep-consultation"} onChange={e=>up("epRole",e.target.value)} style={{...inp({boxSizing:"border-box"})}}>
            {ROLES_EP.map(r=><option key={r} value={r}>{ROLES_EP_LABELS[r]}</option>)}
          </select>
          <div style={{fontSize:11.5,color:MUT,marginTop:4}}>
            {form.epRole==="ep-admin"&&"Administration complète : liquidations, paiements, paramétrage"}
            {form.epRole==="ep-gestionnaire"&&"Création et gestion des liquidations et paiements"}
            {form.epRole==="ep-valideur"&&"Validation des liquidations uniquement"}
            {form.epRole==="ep-consultation"&&"Consultation et rapports sans modification"}
          </div>
        </div>
        <div>
          <div style={{fontSize:12,fontWeight:700,color:"#495057",marginBottom:10}}>Droits spécifiques</div>
          <div style={{display:"flex",flexDirection:"column",gap:7}}>
            {[
              {key:"liquidations",label:"Gérer les liquidations",desc:"Créer, modifier, supprimer"},
              {key:"paiements",label:"Gérer les paiements",desc:"Accès liste paiements"},
              {key:"genXml",label:"Générer fichiers XML",desc:"Génération ordres bancaires"},
              {key:"parametrage",label:"Paramétrage avancé",desc:"Balises XML et mappage banques"},
            ].map(({key,label,desc})=>(
              <label key={key} style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer",padding:"10px 14px",borderRadius:8,background:(form.epRights||{})[key]?G+"08":"#f8f9fc",border:"1px solid "+((form.epRights||{})[key]?G+"30":BD)}}>
                <input type="checkbox" checked={(form.epRights||{})[key]||false} onChange={()=>up("epRights",{...(form.epRights||{}),[key]:!(form.epRights||{})[key]})} style={{width:14,height:14,accentColor:G}}/>
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:(form.epRights||{})[key]?G:"#212529"}}>{label}</div><div style={{fontSize:11,color:MUT}}>{desc}</div></div>
              </label>
            ))}
          </div>
        </div>
        {/* ── Droits liés à E-paiement (avances & liquidations) ── */}
        <div>
          <div style={{background:G+"10",borderRadius:8,padding:"10px 14px",borderLeft:"3px solid "+G,fontSize:12.5,color:G,fontWeight:600,marginBottom:10}}>📋 Droits avances &amp; liquidations</div>
          <div style={{display:"flex",flexDirection:"column",gap:7}}>
            {[
              {k:"avance",     l:"Saisie avances",     d:"Créer et valider des avances financières"},
              {k:"liquidation",l:"Saisie liquidations", d:"Créer et finaliser des liquidations"},
            ].map(d=>{
              const droits=form.droits||{};
              const active=droits[d.k]||false;
              return(
                <label key={d.k} style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer",padding:"10px 14px",borderRadius:8,background:active?G+"08":"#f8f9fc",border:"1px solid "+(active?G+"40":"#dee2e6"),transition:"all .15s"}}>
                  <div style={{width:18,height:18,borderRadius:4,flexShrink:0,border:"2px solid "+(active?G:"#dee2e6"),background:active?G:"#fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}
                    onMouseDown={e=>{e.preventDefault();setForm(p=>({...p,droits:{...(p.droits||{}),[d.k]:!active}}));}}>
                    {active&&<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                  <div style={{flex:1}} onClick={()=>setForm(p=>({...p,droits:{...(p.droits||{}),[d.k]:!active}}))}>
                    <div style={{fontSize:13,fontWeight:active?700:500,color:active?G:"#212529"}}>{d.l}</div>
                    <div style={{fontSize:11,color:MUT}}>{d.d}</div>
                  </div>
                  {active&&<span style={{fontSize:10,background:G,color:"#fff",padding:"2px 8px",borderRadius:10,fontWeight:700}}>Activé</span>}
                </label>
              );
            })}
          </div>
        </div>
      </div>
    ),
    projets_droits:(()=>{
      const userProjets=form.projets||[];
      function toggleSite(pid,site){
        const cur=userProjets.find(p=>p.pid===pid);
        if(!cur){setForm(p=>({...p,projets:[...userProjets,{pid,sites:[site]}]}));return;}
        const sites=cur.sites.includes(site)?cur.sites.filter(s=>s!==site):[...cur.sites,site];
        if(sites.length===0){setForm(p=>({...p,projets:userProjets.filter(pp=>pp.pid!==pid)}));return;}
        setForm(p=>({...p,projets:userProjets.map(pp=>pp.pid===pid?{...pp,sites}:pp)}));
      }
      function toggleAllSites(pid){
        const cur=userProjets.find(p=>p.pid===pid);
        const proj=PROJETS.find(p=>p.id===pid);
        if(!proj)return;
        if(cur&&cur.sites.length===proj.sites.length){setForm(p=>({...p,projets:userProjets.filter(pp=>pp.pid!==pid)}));}
        else{setForm(p=>({...p,projets:[...userProjets.filter(pp=>pp.pid!==pid),{pid,sites:proj.sites}]}));}
      }
      const droits=form.droits||{};
      function toggleDroit(k){setForm(p=>({...p,droits:{...(p.droits||{}),[k]:!(p.droits||{})[k]}}));}
      return(
        <div style={{display:"flex",flexDirection:"column",gap:18}}>
          {/* Projets & Sites */}
          <div style={{background:"#f3f0ff",borderRadius:8,padding:"10px 14px",borderLeft:"3px solid #7c3aed",fontSize:12.5,color:"#7c3aed",fontWeight:600}}>🗂 Projets & Sites</div>
          {PROJETS.map(proj=>{
            const up=userProjets.find(p=>p.pid===proj.id);
            const selectedSites=up?.sites||[];
            const allSelected=selectedSites.length===proj.sites.length;
            return(
              <div key={proj.id} style={{border:"1px solid "+(selectedSites.length>0?"#7c3aed":"#dee2e6"),borderRadius:8,overflow:"hidden",background:selectedSites.length>0?"#f9f6ff":"#fff"}}>
                <label style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",cursor:"pointer",background:selectedSites.length>0?"#ede9fe":"#f8f9fc",borderBottom:"1px solid #dee2e6"}}>
                  <input type="checkbox" checked={allSelected} onChange={()=>toggleAllSites(proj.id)} style={{width:15,height:15,accentColor:"#7c3aed"}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:700,color:selectedSites.length>0?"#7c3aed":"#212529"}}>{proj.nom}</div>
                    <div style={{fontSize:11,color:"#6c757d"}}>{proj.bailleur} — {proj.sites.length} sites</div>
                  </div>
                  <span style={{fontSize:11,fontWeight:700,color:"#7c3aed",background:"#ede9fe",padding:"2px 8px",borderRadius:10}}>{selectedSites.length}/{proj.sites.length}</span>
                </label>
                <div style={{padding:"10px 14px",display:"flex",flexWrap:"wrap",gap:7}}>
                  {proj.sites.map(site=>{
                    const active=selectedSites.includes(site);
                    return(
                      <label key={site} onMouseDown={e=>{e.preventDefault();toggleSite(proj.id,site);}} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"5px 12px",borderRadius:20,cursor:"pointer",userSelect:"none",border:"1.5px solid "+(active?"#7c3aed":"#dee2e6"),background:active?"#7c3aed":"#fff",color:active?"#fff":"#495057",fontSize:12,fontWeight:active?600:400,transition:"all .15s"}}>
                        <input type="checkbox" checked={active} onChange={()=>toggleSite(proj.id,site)} style={{display:"none"}}/>
                        {active&&<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                        {site}
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}

        </div>
      );
    })(),
  };

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:5000,padding:20}}>
      <div style={{background:WH,borderRadius:16,width:"100%",maxWidth:typeof window!=="undefined"&&window.innerWidth<=768?"95%":600,maxHeight:"90vh",display:"flex",flexDirection:"column",boxShadow:"0 24px 80px rgba(0,0,0,.3)"}}>
        <div style={{padding:"18px 24px",borderBottom:"1px solid "+BD,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <h3 style={{fontSize:16,fontWeight:800,color:"#212529"}}>{user?"Modifier l'utilisateur":"Nouvel utilisateur"}</h3>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:MUT}}>×</button>
        </div>
        <div style={{display:"flex",borderBottom:"1px solid "+BD,paddingLeft:24,flexShrink:0,overflowX:"auto",scrollbarWidth:"none"}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              style={{padding:"10px 18px",border:"none",background:"transparent",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:tab===t.id?700:500,color:tab===t.id?(t.color||P):MUT,borderBottom:"2px solid "+(tab===t.id?(t.color||P):"transparent"),whiteSpace:"nowrap",transition:"all .15s"}}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"20px 24px"}}>{content[tab]}</div>
        <div style={{padding:"14px 24px",borderTop:"1px solid "+BD,display:"flex",justifyContent:"flex-end",gap:10,flexShrink:0}}>
          <button onClick={onClose} style={{padding:"9px 20px",borderRadius:6,border:"1px solid "+BD,background:"#fff",cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>Annuler</button>
          <button onClick={()=>onSave(form)} style={{padding:"9px 20px",borderRadius:6,border:"none",background:P,color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"inherit"}}>
            {user?"Enregistrer":"Créer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GestionUsers(){
  const{users,setUsers,currentApp}=useApp();
  const[modal,setModal]=useState(null);
  const[search,setSearch]=useState("");
  const[filterApp,setFilterApp]=useState("all");

  const _displayAll=BACKOFFICE_USERS.map(bu=>{
    const ov=(users||[]).find(u=>u.id===bu.id);
    return ov?{...bu,...ov}:bu;
  });

  const displayUsers=_displayAll.filter(u=>
    currentApp==="epaiement"
      ?(u.apps||[]).includes("epaiement")
      :(u.apps||[]).includes("softdocs")||u.systemRole==="superadmin"
  );
  const filtered=displayUsers.filter(u=>{
    if(search&&!u.nom?.toLowerCase().includes(search.toLowerCase())&&!u.email?.toLowerCase().includes(search.toLowerCase()))return false;
    if(filterApp!=="all"&&!(u.apps||[]).includes(filterApp))return false;
    return true;
  });

  function handleSave(form){
    if(!form.nom||!form.email)return;
    if(!modal||modal==="add"){
      setUsers(p=>[...(p||[]),{...form,id:"U"+Date.now()}]);
    }else{
      setUsers(p=>(p||[]).map(u=>u.id===form.id?form:u));
    }
    setModal(null);
  }

  return(
    <div style={{animation:"fadeIn .25s ease"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <div><h2 style={{fontSize:20,fontWeight:800,color:"#212529",marginBottom:2}}>Gestion des utilisateurs</h2><p style={{fontSize:13,color:MUT}}>Gérez les accès et droits par application</p></div>
        <button onClick={()=>setModal("add")} style={{...btn("primary"),display:"flex",alignItems:"center",gap:8}}>+ Nouvel utilisateur</button>
      </div>

      <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"repeat(2,1fr)":"repeat(4,1fr)",gap:12,marginBottom:20}}>
        {[
          {label:"Utilisateurs",val:displayUsers.length,color:P,icon:"👥"},
          {label:"SoftDocs",val:displayUsers.filter(u=>(u.apps||[]).includes("softdocs")).length,color:P,icon:"📄"},
          {label:"E-paiement",val:displayUsers.filter(u=>(u.apps||[]).includes("epaiement")).length,color:G,icon:"💳"},
          {label:"Super Admins",val:displayUsers.filter(u=>u.systemRole==="superadmin").length,color:"#9b59b6",icon:"⭐"},
        ].map(({label,val,color,icon})=>(
          <div key={label} style={{...card(),padding:"14px 18px",borderLeft:"4px solid "+color}}>
            <div style={{fontSize:11,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".05em",marginBottom:5}}>{icon} {label}</div>
            <div style={{fontSize:22,fontWeight:900,color}}>{val}</div>
          </div>
        ))}
      </div>

      <div style={{...card(),padding:"12px 16px",marginBottom:14,display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
        <input placeholder="🔍 Rechercher nom, email…" value={search} onChange={e=>setSearch(e.target.value)} style={{...inp({padding:"7px 12px",fontSize:12.5,flex:1,minWidth:200})}}/>
        <div style={{display:"flex",gap:6}}>
          {[{id:"all",label:"Tous"},{id:"softdocs",label:"📄 SoftDocs"},{id:"epaiement",label:"💳 E-paiement"}].map(f=>(
            <button key={f.id} onClick={()=>setFilterApp(f.id)}
              style={{padding:"6px 14px",borderRadius:6,border:"1px solid "+BD,background:filterApp===f.id?P:"#fff",color:filterApp===f.id?"#fff":"#495057",cursor:"pointer",fontSize:12,fontWeight:filterApp===f.id?700:500,fontFamily:"inherit"}}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(360px,1fr))",gap:12}}>
        {filtered.map(u=><UserCard key={u.id} u={u} onEdit={setModal} onDel={(id)=>setUsers(p=>(p||[]).filter(u=>u.id!==id))}/>)}
        {filtered.length===0&&<div style={{gridColumn:"1/-1",textAlign:"center",padding:"40px 0",color:MUT}}>Aucun utilisateur trouvé</div>}
      </div>

      {modal&&<UserModal user={modal==="add"?null:modal} onSave={handleSave} onClose={()=>setModal(null)} appContext={currentApp==="epaiement"?"epaiement":currentApp==="softdocs"?"softdocs":"all"}/>}
    </div>
  );
}