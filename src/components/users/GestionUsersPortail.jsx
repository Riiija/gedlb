"use client";
import{useState}from"react";
import{useApp,BACKOFFICE_USERS}from"../../context/AppContext";
import{card,btn,inp,lbl,MUT,P,WH,BD,SUC,DNG,TR}from"../../lib/theme";

const G="#1a6b3c";
const ALL_APPS=[
  {id:"softdocs",    label:"SoftDocs",        color:P,         icon:"📄"},
  {id:"epaiement",   label:"Soft E-paiement", color:G,         icon:"💳"},
  {id:"softlibrary", label:"SoftLibrary",      color:"#7c3aed", icon:"📚"},
  {id:"softsign",    label:"SoftSign",         color:"#4c1d95", icon:"✍️"},
];
const ROLES_SYS=["superadmin","admin","standard","lecture seule"];
const EMPTY={nom:"",role:"",email:"",password:"",systemRole:"standard",init:"",apps:[]};

function uid(){return"U"+Date.now().toString(36).toUpperCase();}

/* ─── Badge application ─── */
function AppBadge({id}){
  const a=ALL_APPS.find(x=>x.id===id);
  if(!a)return null;
  return(
    <span style={{fontSize:10.5,fontWeight:700,color:a.color,background:a.color+"15",
      padding:"2px 8px",borderRadius:10,border:"1px solid "+a.color+"30"}}>
      {a.icon} {a.label}
    </span>
  );
}

/* ─── Carte utilisateur ─── */
function UserCard({u,onEdit,onDel}){
  const initials=(u.init||u.nom?.split(" ").map(w=>w[0]).join("").slice(0,2)||"??").toUpperCase();
  const colors=["#3b82f6","#8b5cf6","#ec4899","#f59e0b","#10b981","#6366f1"];
  const bg=colors[(u.id?.charCodeAt(1)||0)%colors.length];
  return(
    <div style={{...card(),padding:"16px 18px",display:"flex",alignItems:"flex-start",gap:14,transition:TR}}
      onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,.10)"}
      onMouseLeave={e=>e.currentTarget.style.boxShadow=""}>
      {/* Avatar */}
      <div style={{width:40,height:40,borderRadius:"50%",background:bg,display:"flex",alignItems:"center",
        justifyContent:"center",fontSize:14,fontWeight:800,color:"#fff",flexShrink:0}}>
        {initials}
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:14,fontWeight:700,color:"#212529",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
          {u.nom}
          {u.systemRole==="superadmin"&&(
            <span style={{marginLeft:6,fontSize:10,background:"#f3e8ff",color:"#7c3aed",
              padding:"1px 7px",borderRadius:8,fontWeight:700}}>⭐ Super Admin</span>
          )}
        </div>
        <div style={{fontSize:12,color:MUT,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
          {u.role||"—"} · {u.email}
        </div>
        <div style={{display:"flex",gap:5,marginTop:6,flexWrap:"wrap"}}>
          {(u.apps||[]).map(a=><AppBadge key={a} id={a}/>)}
          {(u.apps||[]).length===0&&<span style={{fontSize:10.5,color:MUT}}>Aucun accès</span>}
        </div>
      </div>
      <div style={{display:"flex",gap:6,flexShrink:0}}>
        <button onClick={()=>onEdit(u)}
          style={{padding:"5px 12px",borderRadius:6,border:"1px solid "+BD,background:"#fff",
            cursor:"pointer",fontSize:12,fontWeight:600,color:"#495057",fontFamily:"inherit"}}>
          ✏️ Modifier
        </button>
        <button onClick={()=>onDel(u.id)}
          style={{padding:"5px 12px",borderRadius:6,border:"1px solid #fca5a5",background:"#fff5f5",
            cursor:"pointer",fontSize:12,fontWeight:600,color:DNG,fontFamily:"inherit"}}>
          🗑 Supprimer
        </button>
      </div>
    </div>
  );
}

/* ─── Modal créer / modifier ─── */
function UserModal({user,onSave,onClose}){
  const[form,setForm]=useState({...EMPTY,...(user||{})});
  const up=(k,v)=>setForm(p=>({...p,[k]:v}));

  function toggleApp(appId){
    const cur=form.apps||[];
    const next=cur.includes(appId)?cur.filter(a=>a!==appId):[...cur,appId];
    up("apps",next);
  }

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:9999,
      display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#fff",borderRadius:12,width:"100%",maxWidth:480,
        boxShadow:"0 20px 60px rgba(0,0,0,.2)",display:"flex",flexDirection:"column",
        maxHeight:"90vh"}}>
        {/* Header */}
        <div style={{padding:"18px 24px 0",display:"flex",alignItems:"center",
          justifyContent:"space-between",flexShrink:0}}>
          <h3 style={{fontSize:16,fontWeight:800,color:"#212529",margin:0}}>
            {user?"Modifier l'utilisateur":"Nouvel utilisateur"}
          </h3>
          <button onClick={onClose}
            style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:MUT,lineHeight:1}}>
            ×
          </button>
        </div>

        {/* Tab bar (Général uniquement) */}
        <div style={{borderBottom:"1px solid "+BD,paddingLeft:24,marginTop:8,flexShrink:0}}>
          <div style={{display:"inline-block",padding:"10px 18px",fontSize:13,fontWeight:700,
            color:P,borderBottom:"2px solid "+P}}>
            👤 Général
          </div>
        </div>

        {/* Body */}
        <div style={{flex:1,overflowY:"auto",padding:"20px 24px",display:"flex",flexDirection:"column",gap:14}}>

          {/* Nom + Initiales */}
          <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:12}}>
            <div>
              <div style={lbl}>Nom complet *</div>
              <input value={form.nom} onChange={e=>{
                up("nom",e.target.value);
                if(!user)up("init",e.target.value.split(" ").filter(Boolean).map(w=>w[0].toUpperCase()).join("").slice(0,2));
              }} style={{...inp({boxSizing:"border-box",width:"100%"})}} placeholder="Prénom Nom"/>
            </div>
            <div>
              <div style={lbl}>Initiales</div>
              <input value={form.init} onChange={e=>up("init",e.target.value.toUpperCase().slice(0,3))}
                style={{...inp({boxSizing:"border-box",width:70})}} maxLength={3}/>
            </div>
          </div>

          {/* Fonction */}
          <div>
            <div style={lbl}>Fonction / Rôle affiché</div>
            <input value={form.role} onChange={e=>up("role",e.target.value)}
              style={{...inp({boxSizing:"border-box",width:"100%"})}} placeholder="ex: Chef de Projet"/>
          </div>

          {/* Email */}
          <div>
            <div style={lbl}>Email *</div>
            <input type="email" value={form.email} onChange={e=>up("email",e.target.value)}
              style={{...inp({boxSizing:"border-box",width:"100%"})}} placeholder="prenom@softwell.mg"/>
          </div>

          {/* Mot de passe */}
          <div>
            <div style={lbl}>Mot de passe {user?"(laisser vide pour ne pas changer)":""}</div>
            <input type="password" value={form.password||""} onChange={e=>up("password",e.target.value)}
              style={{...inp({boxSizing:"border-box",width:"100%"})}} placeholder={user?"••••••":"Nouveau mot de passe"}/>
          </div>

          {/* Rôle système */}
          <div>
            <div style={lbl}>Rôle Système</div>
            <select value={form.systemRole} onChange={e=>up("systemRole",e.target.value)}
              style={{...inp({boxSizing:"border-box",width:"100%",cursor:"pointer"})}}>
              {ROLES_SYS.map(r=><option key={r} value={r}>{r.charAt(0).toUpperCase()+r.slice(1)}</option>)}
            </select>
          </div>

          {/* Accès aux applications */}
          <div>
            <div style={lbl}>Accès aux applications</div>
            <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr",gap:8,marginTop:4}}>
              {ALL_APPS.map(app=>{
                const active=(form.apps||[]).includes(app.id);
                return(
                  <label key={app.id}
                    style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",borderRadius:10,
                      border:"1px solid "+(active?app.color:BD),
                      background:active?app.color+"08":"#f8f9fc",cursor:"pointer",
                      transition:TR}}>
                    <input type="checkbox" checked={active} onChange={()=>toggleApp(app.id)}
                      style={{width:15,height:15,accentColor:app.color}}/>
                    <div>
                      <div style={{fontSize:13,fontWeight:700,color:active?app.color:"#495057"}}>
                        {app.icon} {app.label}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{padding:"14px 24px",borderTop:"1px solid "+BD,
          display:"flex",justifyContent:"flex-end",gap:10,flexShrink:0}}>
          <button onClick={onClose}
            style={{padding:"9px 20px",borderRadius:6,border:"1px solid "+BD,
              background:"#fff",cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>
            Annuler
          </button>
          <button onClick={()=>{if(form.nom&&form.email)onSave(form);}}
            style={{padding:"9px 20px",borderRadius:6,border:"none",background:P,
              color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"inherit",
              opacity:(form.nom&&form.email)?1:.5}}>
            {user?"Enregistrer":"Créer"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   EXPORT PRINCIPAL
═══════════════════════════════════════════════════════ */
export default function GestionUsersPortail(){
  const{users,setUsers}=useApp();
  const[modal,setModal]=useState(null);  // null | "add" | user-object
  const[search,setSearch]=useState("");
  const[filterApp,setFilterApp]=useState("all");

  /* Merge BACKOFFICE_USERS avec overrides */
  const all=BACKOFFICE_USERS.map(bu=>{
    const ov=(users||[]).find(u=>u.id===bu.id);
    return ov?{...bu,...ov}:bu;
  });

  const filtered=all.filter(u=>{
    if(search&&!u.nom?.toLowerCase().includes(search.toLowerCase())
      &&!u.email?.toLowerCase().includes(search.toLowerCase()))return false;
    if(filterApp!=="all"&&!(u.apps||[]).includes(filterApp))return false;
    return true;
  });

  function handleSave(form){
    if(!form.nom||!form.email)return;
    if(!modal||modal==="add"){
      setUsers(p=>[...(p||[]),{...form,id:uid()}]);
    }else{
      setUsers(p=>(p||[]).map(u=>u.id===form.id?{...u,...form}:u));
    }
    setModal(null);
  }

  function handleDel(id){
    if(window.confirm("Confirmer la suppression de cet utilisateur ?"))
      setUsers(p=>(p||[]).filter(u=>u.id!==id));
  }

  /* KPIs */
  const nbAll=all.length;
  const nbSd=all.filter(u=>(u.apps||[]).includes("softdocs")).length;
  const nbEp=all.filter(u=>(u.apps||[]).includes("epaiement")).length;
  const nbSl=all.filter(u=>(u.apps||[]).includes("softlibrary")).length;
  const nbSs=all.filter(u=>(u.apps||[]).includes("softsign")).length;

  return(
    <div style={{animation:"fadeIn .25s ease"}}>
      {/* ── Header ── */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <div>
          <h2 style={{fontSize:20,fontWeight:800,color:"#212529",marginBottom:2}}>Gestion des utilisateurs</h2>
          <p style={{fontSize:13,color:MUT}}>Administration des accès au portail SoftApplication</p>
        </div>
        <button onClick={()=>setModal("add")}
          style={{...btn("primary"),display:"flex",alignItems:"center",gap:8}}>
          + Nouvel utilisateur
        </button>
      </div>

      {/* ── KPIs ── */}
      <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"repeat(2,1fr)":"repeat(5,1fr)",gap:12,marginBottom:20}}>
        {[
          {label:"Total",       val:nbAll, color:"#324372", icon:"👥"},
          {label:"SoftDocs",    val:nbSd,  color:P,         icon:"📄"},
          {label:"E-paiement",  val:nbEp,  color:G,         icon:"💳"},
          {label:"SoftLibrary", val:nbSl,  color:"#7c3aed", icon:"📚"},
          {label:"SoftSign",    val:nbSs,  color:"#4c1d95", icon:"✍️"},
        ].map(({label,val,color,icon})=>(
          <div key={label} style={{...card(),padding:"14px 18px",borderLeft:"4px solid "+color}}>
            <div style={{fontSize:11,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".05em",marginBottom:5}}>
              {icon} {label}
            </div>
            <div style={{fontSize:22,fontWeight:900,color}}>{val}</div>
          </div>
        ))}
      </div>

      {/* ── Filtres ── */}
      <div style={{...card(),padding:"12px 16px",marginBottom:14,display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
        <input placeholder="🔍 Rechercher nom, email…" value={search}
          onChange={e=>setSearch(e.target.value)}
          style={{...inp({padding:"7px 12px",fontSize:12.5,flex:1,minWidth:180})}}/>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {[
            {id:"all",        label:"Tous"},
            {id:"softdocs",   label:"📄 SoftDocs"},
            {id:"epaiement",  label:"💳 E-paiement"},
            {id:"softlibrary",label:"📚 SoftLibrary"},
            {id:"softsign",   label:"✍️ SoftSign"},
          ].map(f=>(
            <button key={f.id} onClick={()=>setFilterApp(f.id)}
              style={{padding:"6px 14px",borderRadius:6,border:"1px solid "+BD,
                background:filterApp===f.id?P:"#fff",color:filterApp===f.id?"#fff":"#495057",
                cursor:"pointer",fontSize:12,fontWeight:filterApp===f.id?700:500,fontFamily:"inherit"}}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Liste ── */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(360px,1fr))",gap:12}}>
        {filtered.map(u=>(
          <UserCard key={u.id} u={u} onEdit={u=>setModal(u)} onDel={handleDel}/>
        ))}
        {filtered.length===0&&(
          <div style={{gridColumn:"1/-1",textAlign:"center",padding:"40px 0",color:MUT,fontSize:13}}>
            Aucun utilisateur trouvé
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {modal&&(
        <UserModal
          user={modal==="add"?null:modal}
          onSave={handleSave}
          onClose={()=>setModal(null)}/>
      )}
    </div>
  );
}
