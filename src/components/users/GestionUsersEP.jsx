"use client";
import{useState}from"react";
import{useApp,BACKOFFICE_USERS}from"../../context/AppContext";
import{PROJETS}from"../../lib/data";
import{card,btn,inp,lbl,MUT,P,WH,BD,SUC,SUCL,SUCD,DNG,TR}from"../../lib/theme";

const G="#1a6b3c";
const ROLES_EP=["ep-admin","ep-gestionnaire","ep-valideur","ep-consultation"];
const ROLES_EP_LABELS={"ep-admin":"Administrateur","ep-gestionnaire":"Gestionnaire","ep-valideur":"Valideur liquidations","ep-consultation":"Consultation uniquement"};
const ROLES_SYS=["superadmin","admin","standard","lecture seule"];

const NOTIF_EP=[
  {id:"notif_ep_liquidation",label:"Liquidation créée / modifiée"},
  {id:"notif_ep_paiement",   label:"Nouveau paiement enregistré"},
  {id:"notif_ep_xml",        label:"Fichier XML généré"},
  {id:"notif_ep_retard",     label:"Liquidation en retard de traitement"},
];

const EP_DROITS=[
  {k:"liquidations",l:"Gérer les liquidations",  d:"Créer, modifier, supprimer des liquidations",         src:"epRights"},
  {k:"paiements",   l:"Gérer les paiements",      d:"Accès et gestion de la liste des paiements",          src:"epRights"},
  {k:"genXml",      l:"Générer fichiers XML",      d:"Génération d'ordres bancaires XML",                   src:"epRights"},
  {k:"parametrage", l:"Paramétrage avancé",        d:"Balises XML et mappage banques",                      src:"epRights"},
  {k:"avance",      l:"Saisie avances",            d:"Créer et valider des avances financières",             src:"droits"},
  {k:"liquidation", l:"Saisie liquidations",       d:"Créer et finaliser des liquidations",                  src:"droits"},
];

const EMPTY={
  nom:"",role:"",email:"",password:"",systemRole:"standard",init:"",
  apps:["epaiement"],
  epRole:"ep-consultation",
  epRights:{liquidations:false,paiements:false,genXml:false,parametrage:false},
  epNotifs:[],
  droits:{},
  projets:[],
};

function avatarColor(id){
  const cols=["#1a6b3c","#7c3aed","#2563eb","#d97706","#dc2626","#0891b2"];
  return cols[(id?.charCodeAt(1)||0)%cols.length];
}

/* ─── Carte utilisateur ─── */
function UserCard({u,onEdit,onDel}){
  const initials=(u.init||u.nom?.split(" ").map(w=>w[0]).join("").slice(0,2)||"??").toUpperCase();
  return(
    <div style={{...card(),padding:"16px 18px",display:"flex",alignItems:"flex-start",gap:14,transition:TR}}
      onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,.10)"}
      onMouseLeave={e=>e.currentTarget.style.boxShadow=""}>
      <div style={{width:40,height:40,borderRadius:"50%",background:avatarColor(u.id),
        display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:"#fff",flexShrink:0}}>
        {initials}
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:14,fontWeight:700,color:"#212529",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
          {u.nom}
          {u.systemRole==="superadmin"&&<span style={{marginLeft:6,fontSize:10,background:"#f3e8ff",color:"#7c3aed",padding:"1px 7px",borderRadius:8,fontWeight:700}}>⭐ Super Admin</span>}
        </div>
        <div style={{fontSize:12,color:MUT,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.role||"—"} · {u.email}</div>
        <div style={{display:"flex",gap:5,marginTop:6,flexWrap:"wrap",alignItems:"center"}}>
          <span style={{fontSize:10.5,fontWeight:700,color:G,background:G+"15",padding:"2px 8px",borderRadius:10,border:"1px solid "+G+"30"}}>
            💳 {ROLES_EP_LABELS[u.epRole||"ep-consultation"]||u.epRole}
          </span>
          {(u.projets||[]).length>0&&(
            <span style={{fontSize:10.5,color:"#7c3aed",background:"#f3e8ff",padding:"2px 8px",borderRadius:10,fontWeight:600}}>
              🗂 {u.projets.length} projet{u.projets.length>1?"s":""}
            </span>
          )}
        </div>
      </div>
      <div style={{display:"flex",gap:6,flexShrink:0}}>
        <button onClick={()=>onEdit(u)} style={{padding:"5px 12px",borderRadius:6,border:"1px solid "+BD,background:"#fff",cursor:"pointer",fontSize:12,fontWeight:600,color:"#495057",fontFamily:"inherit"}}>✏️ Modifier</button>
        <button onClick={()=>onDel(u.id)} style={{padding:"5px 12px",borderRadius:6,border:"1px solid #fca5a5",background:"#fff5f5",cursor:"pointer",fontSize:12,fontWeight:600,color:DNG,fontFamily:"inherit"}}>🗑</button>
      </div>
    </div>
  );
}

/* ─── Modal ─── */
function UserModal({user,onSave,onClose}){
  const[form,setForm]=useState({...EMPTY,...(user||{})});
  const[tab,setTab]=useState("general");
  const up=(k,v)=>setForm(p=>({...p,[k]:v}));

  const TABS=[
    {id:"general",   label:"Général",         icon:"👤"},
    {id:"epaiement", label:"Soft E-paiement",  icon:"💳", color:G},
    {id:"projets",   label:"Projets & Sites",  icon:"🗂",  color:"#7c3aed"},
  ];

  /* projets helpers */
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
    if(cur&&cur.sites.length===proj.sites.length) setForm(p=>({...p,projets:userProjets.filter(pp=>pp.pid!==pid)}));
    else setForm(p=>({...p,projets:[...userProjets.filter(pp=>pp.pid!==pid),{pid,sites:proj.sites}]}));
  }

  const content={
    /* ── Général ── */
    general:(
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:12}}>
          <div>
            <div style={lbl}>Nom complet *</div>
            <input value={form.nom} onChange={e=>{up("nom",e.target.value);if(!user)up("init",e.target.value.split(" ").filter(Boolean).map(w=>w[0].toUpperCase()).join("").slice(0,2));}}
              style={{...inp({boxSizing:"border-box",width:"100%"})}} placeholder="Prénom Nom"/>
          </div>
          <div>
            <div style={lbl}>Initiales</div>
            <input value={form.init} onChange={e=>up("init",e.target.value.toUpperCase().slice(0,3))}
              style={{...inp({boxSizing:"border-box",width:70})}} maxLength={3}/>
          </div>
        </div>
        <div>
          <div style={lbl}>Fonction / Rôle affiché</div>
          <input value={form.role||""} onChange={e=>up("role",e.target.value)}
            style={{...inp({boxSizing:"border-box",width:"100%"})}} placeholder="ex: Gestionnaire Financier"/>
        </div>
        <div>
          <div style={lbl}>Email *</div>
          <input type="email" value={form.email||""} onChange={e=>up("email",e.target.value)}
            style={{...inp({boxSizing:"border-box",width:"100%"})}} placeholder="prenom@softwell.mg"/>
        </div>
        <div>
          <div style={lbl}>Mot de passe {user?"(laisser vide pour conserver)":""}</div>
          <input type="password" value={form.password||""} onChange={e=>up("password",e.target.value)}
            style={{...inp({boxSizing:"border-box",width:"100%"})}} placeholder={user?"••••••":"Nouveau mot de passe"}/>
        </div>
        <div>
          <div style={lbl}>Rôle système</div>
          <select value={form.systemRole||"standard"} onChange={e=>up("systemRole",e.target.value)}
            style={{...inp({boxSizing:"border-box",width:"100%",cursor:"pointer"})}}>
            {ROLES_SYS.map(r=><option key={r} value={r}>{r.charAt(0).toUpperCase()+r.slice(1)}</option>)}
          </select>
        </div>
        <div style={{background:G+"08",borderRadius:8,padding:"10px 14px",borderLeft:"3px solid "+G,fontSize:12.5,color:G,fontWeight:600}}>
          💳 Accès : Soft E-paiement
        </div>
      </div>
    ),

    /* ── Soft E-paiement ── */
    epaiement:(
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{background:G+"08",borderRadius:8,padding:"10px 14px",borderLeft:"3px solid "+G,fontSize:12.5,color:G,fontWeight:600}}>
          💳 Configuration Soft E-paiement
        </div>

        {/* Rôle */}
        <div>
          <div style={lbl}>Rôle E-paiement</div>
          <select value={form.epRole||"ep-consultation"} onChange={e=>up("epRole",e.target.value)}
            style={{...inp({boxSizing:"border-box",width:"100%",cursor:"pointer"})}}>
            {ROLES_EP.map(r=><option key={r} value={r}>{ROLES_EP_LABELS[r]}</option>)}
          </select>
          <div style={{fontSize:11.5,color:MUT,marginTop:4}}>
            {form.epRole==="ep-admin"       &&"Administration complète : liquidations, paiements, paramétrage"}
            {form.epRole==="ep-gestionnaire"&&"Création et gestion des liquidations et paiements"}
            {form.epRole==="ep-valideur"    &&"Validation des liquidations uniquement"}
            {form.epRole==="ep-consultation"&&"Consultation et rapports sans modification"}
          </div>
        </div>

        {/* Notifications */}
        <div>
          <div style={{fontSize:12,fontWeight:700,color:"#495057",marginBottom:8}}>Notifications par email</div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {NOTIF_EP.map(n=>(
              <label key={n.id} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",padding:"8px 12px",borderRadius:8,
                background:(form.epNotifs||[]).includes(n.id)?G+"08":"#f8f9fc",
                border:"1px solid "+((form.epNotifs||[]).includes(n.id)?G+"30":BD)}}>
                <input type="checkbox" checked={(form.epNotifs||[]).includes(n.id)}
                  onChange={()=>{const cur=form.epNotifs||[];up("epNotifs",cur.includes(n.id)?cur.filter(x=>x!==n.id):[...cur,n.id]);}}
                  style={{width:14,height:14,accentColor:G}}/>
                <span style={{fontSize:13,color:"#212529"}}>{n.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Droits */}
        <div>
          <div style={{background:G+"10",borderRadius:8,padding:"10px 14px",borderLeft:"3px solid "+G,fontSize:12.5,color:G,fontWeight:600,marginBottom:10}}>
            🔑 Droits Soft E-paiement
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:7}}>
            {EP_DROITS.map(d=>{
              const active=d.src==="epRights"?(form.epRights||{})[d.k]||false:(form.droits||{})[d.k]||false;
              function toggle(){
                if(d.src==="epRights") up("epRights",{...(form.epRights||{}),[d.k]:!active});
                else setForm(p=>({...p,droits:{...(p.droits||{}),[d.k]:!active}}));
              }
              return(
                <label key={d.k} style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer",padding:"10px 14px",borderRadius:8,
                  background:active?G+"08":"#f8f9fc",border:"1px solid "+(active?G+"40":"#dee2e6"),transition:"all .15s"}}>
                  <div style={{width:18,height:18,borderRadius:4,flexShrink:0,border:"2px solid "+(active?G:"#dee2e6"),background:active?G:"#fff",
                    display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}
                    onMouseDown={e=>{e.preventDefault();toggle();}}>
                    {active&&<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                  <div style={{flex:1}} onClick={toggle}>
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

    /* ── Projets & Sites ── */
    projets:(
      <div style={{display:"flex",flexDirection:"column",gap:18}}>
        <div style={{background:"#f3f0ff",borderRadius:8,padding:"10px 14px",borderLeft:"3px solid #7c3aed",fontSize:12.5,color:"#7c3aed",fontWeight:600}}>
          🗂 Accès aux projets et sites
        </div>
        {PROJETS.map(proj=>{
          const up2=userProjets.find(p=>p.pid===proj.id);
          const selectedSites=up2?.sites||[];
          const allSelected=selectedSites.length===proj.sites.length;
          return(
            <div key={proj.id} style={{border:"1px solid "+(selectedSites.length>0?"#7c3aed":"#dee2e6"),borderRadius:8,overflow:"hidden",background:selectedSites.length>0?"#f9f6ff":"#fff"}}>
              <label style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",cursor:"pointer",background:selectedSites.length>0?"#ede9fe":"#f8f9fc",borderBottom:"1px solid #dee2e6"}}>
                <input type="checkbox" checked={allSelected} onChange={()=>toggleAllSites(proj.id)} style={{width:15,height:15,accentColor:"#7c3aed"}}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700,color:selectedSites.length>0?"#7c3aed":"#212529"}}>{proj.nom}</div>
                  <div style={{fontSize:11,color:MUT}}>{proj.bailleur} — {proj.sites.length} sites</div>
                </div>
                <span style={{fontSize:11,fontWeight:700,color:"#7c3aed",background:"#ede9fe",padding:"2px 8px",borderRadius:10}}>{selectedSites.length}/{proj.sites.length}</span>
              </label>
              <div style={{padding:"10px 14px",display:"flex",flexWrap:"wrap",gap:7}}>
                {proj.sites.map(site=>{
                  const active=selectedSites.includes(site);
                  return(
                    <label key={site} onMouseDown={e=>{e.preventDefault();toggleSite(proj.id,site);}}
                      style={{display:"inline-flex",alignItems:"center",gap:6,padding:"5px 12px",borderRadius:20,cursor:"pointer",userSelect:"none",
                        border:"1.5px solid "+(active?"#7c3aed":"#dee2e6"),background:active?"#7c3aed":"#fff",
                        color:active?"#fff":"#495057",fontSize:12,fontWeight:active?600:400,transition:"all .15s"}}>
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
    ),
  };

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:5000,padding:20}}>
      <div style={{background:WH,borderRadius:16,width:"100%",maxWidth:620,maxHeight:"92vh",display:"flex",flexDirection:"column",boxShadow:"0 24px 80px rgba(0,0,0,.3)"}}>
        {/* Header */}
        <div style={{padding:"18px 24px",borderBottom:"1px solid "+BD,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:32,height:32,borderRadius:8,background:G,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>💳</div>
            <h3 style={{fontSize:16,fontWeight:800,color:"#212529",margin:0}}>{user?"Modifier l'utilisateur":"Nouvel utilisateur E-paiement"}</h3>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:MUT}}>×</button>
        </div>
        {/* Tabs */}
        <div style={{display:"flex",borderBottom:"1px solid "+BD,paddingLeft:24,flexShrink:0,overflowX:"auto",scrollbarWidth:"none"}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              style={{padding:"10px 18px",border:"none",background:"transparent",cursor:"pointer",fontFamily:"inherit",fontSize:13,
                fontWeight:tab===t.id?700:500,color:tab===t.id?(t.color||G):MUT,
                borderBottom:"2px solid "+(tab===t.id?(t.color||G):"transparent"),whiteSpace:"nowrap",transition:"all .15s"}}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
        {/* Body */}
        <div style={{flex:1,overflowY:"auto",padding:"20px 24px"}}>{content[tab]}</div>
        {/* Footer */}
        <div style={{padding:"14px 24px",borderTop:"1px solid "+BD,display:"flex",justifyContent:"flex-end",gap:10,flexShrink:0}}>
          <button onClick={onClose} style={{padding:"9px 20px",borderRadius:6,border:"1px solid "+BD,background:"#fff",cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>Annuler</button>
          <button onClick={()=>{if(form.nom&&form.email)onSave(form);}}
            style={{padding:"9px 20px",borderRadius:6,border:"none",background:G,color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"inherit",opacity:(form.nom&&form.email)?1:.5}}>
            {user?"Enregistrer":"Créer"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════ */
export default function GestionUsersEP(){
  const{users,setUsers}=useApp();
  const[modal,setModal]=useState(null);
  const[search,setSearch]=useState("");
  const[filterRole,setFilterRole]=useState("all");

  const base=BACKOFFICE_USERS.map(bu=>{const ov=(users||[]).find(u=>u.id===bu.id);return ov?{...bu,...ov}:bu;});
  const epUsers=base.filter(u=>(u.apps||[]).includes("epaiement")||u.systemRole==="superadmin");
  const filtered=epUsers.filter(u=>{
    if(search&&!u.nom?.toLowerCase().includes(search.toLowerCase())&&!u.email?.toLowerCase().includes(search.toLowerCase()))return false;
    if(filterRole!=="all"&&u.epRole!==filterRole)return false;
    return true;
  });

  function handleSave(form){
    if(!form.nom||!form.email)return;
    const withApp={...form,apps:[...(form.apps||[])].filter(a=>a!=="epaiement").concat(["epaiement"])};
    if(!modal||modal==="add") setUsers(p=>[...(p||[]),{...withApp,id:"U"+Date.now()}]);
    else setUsers(p=>(p||[]).map(u=>u.id===form.id?withApp:u));
    setModal(null);
  }
  function handleDel(id){if(window.confirm("Confirmer la suppression ?"))setUsers(p=>(p||[]).filter(u=>u.id!==id));}

  return(
    <div style={{animation:"fadeIn .25s ease"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <div>
          <h2 style={{fontSize:20,fontWeight:800,color:"#212529",marginBottom:2}}>Utilisateurs Soft E-paiement</h2>
          <p style={{fontSize:13,color:MUT}}>Gestion des accès et droits Soft E-paiement</p>
        </div>
        <button onClick={()=>setModal("add")} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"9px 18px",borderRadius:8,border:"none",background:G,color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"inherit"}}>+ Nouvel utilisateur</button>
      </div>

      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"repeat(2,1fr)":"repeat(4,1fr)",gap:12,marginBottom:20}}>
        {[
          {label:"Total",        val:epUsers.length,                                                               color:G,        icon:"💳"},
          {label:"Admins",       val:epUsers.filter(u=>u.epRole==="ep-admin"||u.systemRole==="superadmin").length, color:"#7c3aed",icon:"⭐"},
          {label:"Gestionnaires",val:epUsers.filter(u=>u.epRole==="ep-gestionnaire").length,                       color:"#2563eb",icon:"📋"},
          {label:"Consultation", val:epUsers.filter(u=>u.epRole==="ep-consultation").length,                       color:MUT,      icon:"👁"},
        ].map(({label,val,color,icon})=>(
          <div key={label} style={{...card(),padding:"14px 18px",borderLeft:"4px solid "+color}}>
            <div style={{fontSize:11,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".05em",marginBottom:5}}>{icon} {label}</div>
            <div style={{fontSize:22,fontWeight:900,color}}>{val}</div>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div style={{...card(),padding:"12px 16px",marginBottom:14,display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
        <input placeholder="🔍 Rechercher nom, email…" value={search} onChange={e=>setSearch(e.target.value)}
          style={{...inp({padding:"7px 12px",fontSize:12.5,flex:1,minWidth:180})}}/>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {[{id:"all",label:"Tous"},...ROLES_EP.map(r=>({id:r,label:ROLES_EP_LABELS[r]}))].map(f=>(
            <button key={f.id} onClick={()=>setFilterRole(f.id)}
              style={{padding:"5px 12px",borderRadius:6,border:"1px solid "+BD,background:filterRole===f.id?G:"#fff",
                color:filterRole===f.id?"#fff":"#495057",cursor:"pointer",fontSize:11.5,fontWeight:filterRole===f.id?700:500,fontFamily:"inherit"}}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Liste */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(360px,1fr))",gap:12}}>
        {filtered.map(u=><UserCard key={u.id} u={u} onEdit={u=>setModal(u)} onDel={handleDel}/>)}
        {filtered.length===0&&<div style={{gridColumn:"1/-1",textAlign:"center",padding:"40px 0",color:MUT,fontSize:13}}>Aucun utilisateur trouvé</div>}
      </div>

      {modal&&<UserModal user={modal==="add"?null:modal} onSave={handleSave} onClose={()=>setModal(null)}/>}
    </div>
  );
}