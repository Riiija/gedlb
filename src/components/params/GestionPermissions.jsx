"use client";
import{useState,useMemo}from"react";
import{IC}from"../ui/Icons";
import{Modal}from"../ui/Modal";
import{card,btn,inp,lbl,bdg,P,WH,BD,BG,MUT,SUCL,SUCD,DNG,DNGL,RSm,TR,TH,TD}from"../../lib/theme";
import{useApp}from"../../context/AppContext";
import{useT}from"../../lib/i18n";
import{PERMISSION_GROUPS,ALL_PERM_KEYS,PROFILES,DEFAULT_PERMS,hasPerm}from"../../lib/permissions";

/* ── Toggle switch ── */
function Toggle({checked,onChange,disabled}){
  return(
    <div onClick={disabled?undefined:onChange}
      style={{width:38,height:20,borderRadius:10,background:checked?"#28a745":"#dee2e6",cursor:disabled?"not-allowed":"pointer",transition:"background .2s",position:"relative",flexShrink:0,opacity:disabled?.4:1}}>
      <div style={{width:16,height:16,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:checked?20:2,transition:"left .2s",boxShadow:"0 1px 4px rgba(0,0,0,.25)"}}/>
    </div>
  );
}

/* ── Permission badge ── */
function PermBadge({ok}){
  if(ok)return<span style={{...bdg(SUCL,"#155724",{fontSize:10})}}>✓ Oui</span>;
  return<span style={{...bdg("#e9ecef",MUT,{fontSize:10})}}>— Non</span>;
}

/* ── User row in table ── */
function UserRow({user,onClick}){
  const p=user.permissions||{};
  return(
    <tr onMouseEnter={e=>e.currentTarget.style.background="#f8f9fc"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
      <td style={TD}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:"50%",background:P,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff",flexShrink:0}}>
            {user.init}
          </div>
          <div>
            <div style={{fontWeight:600,fontSize:13,color:"#212529"}}>{user.nom}</div>
            <div style={{fontSize:11,color:MUT}}>{user.email}</div>
          </div>
        </div>
      </td>
      <td style={TD}><span style={{...bdg("#eef1f8",P,{fontSize:11})}}>{user.role}</span></td>
      <td style={TD}><PermBadge ok={hasPerm(user,"depot")}/></td>
      <td style={TD}><PermBadge ok={hasPerm(user,"docConfidential")}/></td>
      <td style={TD}><PermBadge ok={hasPerm(user,"liquidation")}/></td>
      <td style={TD}><PermBadge ok={hasPerm(user,"statsKpi")}/></td>
      <td style={TD}><PermBadge ok={hasPerm(user,"paramUsers")}/></td>
      <td style={TD}>
        <button onClick={()=>onClick(user)} style={btn("primary",true)}>
          <span style={{display:"flex"}}>{IC.edit}</span> Droits
        </button>
      </td>
    </tr>
  );
}

/* ══════════════════════════════════════════════════════════
   MODAL DROITS UTILISATEUR
══════════════════════════════════════════════════════════ */
function PermModal({user,onSave,onClose}){
  const [perms,setPerms]=useState(()=>{
    // Merge default + existing permissions
    const base={...DEFAULT_PERMS};
    // Try to fill from user.permissions or droits
    ALL_PERM_KEYS.forEach(k=>{base[k]=hasPerm(user,k);});
    if(user.permissions)Object.assign(base,user.permissions);
    return base;
  });
  const [activeGroup,setActiveGroup]=useState(PERMISSION_GROUPS[0].id);

  function applyProfile(profileKey){
    const p=PROFILES[profileKey];
    if(p)setPerms({...DEFAULT_PERMS,...p.perms});
  }

  function togglePerm(key){setPerms(pr=>({...pr,[key]:!pr[key]}));}

  const grpCount=(gid)=>{
    const g=PERMISSION_GROUPS.find(x=>x.id===gid);
    return g?g.perms.filter(p=>perms[p.key]).length:0;
  };

  const currentGroup=PERMISSION_GROUPS.find(g=>g.id===activeGroup);

  return(
    <Modal title={`Droits — ${user.nom}`} onClose={onClose} w={720}
      footer={<>
        <button onClick={onClose} style={btn("light",true)}>Annuler</button>
        <button onClick={()=>onSave({...user,permissions:perms})} style={btn("primary")}>
          <span style={{display:"flex"}}>{IC.chk}</span> Enregistrer les droits
        </button>
      </>}>

      {/* Profils rapides */}
      <div style={{marginBottom:16}}>
        <div style={{fontSize:11,fontWeight:700,color:MUT,textTransform:"uppercase",letterSpacing:".08em",marginBottom:8}}>Appliquer un profil prédéfini</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {Object.entries(PROFILES).map(([k,p])=>(
            <button key={k} onClick={()=>applyProfile(k)}
              style={{padding:"5px 12px",borderRadius:16,border:`1.5px solid ${p.color}`,background:"transparent",color:p.color,fontSize:12,fontWeight:600,cursor:"pointer",transition:"all .15s",fontFamily:"inherit"}}
              onMouseEnter={e=>{e.currentTarget.style.background=p.color;e.currentTarget.style.color="#fff";}}
              onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=p.color;}}>
              {p.label}
            </button>
          ))}
          <button onClick={()=>setPerms(Object.fromEntries(ALL_PERM_KEYS.map(k=>[k,false])))}
            style={{padding:"5px 12px",borderRadius:16,border:`1.5px solid #e03e3e`,background:"transparent",color:"#e03e3e",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}
            onMouseEnter={e=>{e.currentTarget.style.background="#e03e3e";e.currentTarget.style.color="#fff";}}
            onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#e03e3e";}}>
            Tout retirer
          </button>
          <button onClick={()=>setPerms(Object.fromEntries(ALL_PERM_KEYS.map(k=>[k,true])))}
            style={{padding:"5px 12px",borderRadius:16,border:`1.5px solid #28a745`,background:"transparent",color:"#28a745",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}
            onMouseEnter={e=>{e.currentTarget.style.background="#28a745";e.currentTarget.style.color="#fff";}}
            onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#28a745";}}>
            Tout accorder
          </button>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"180px 1fr",gap:12,height:380}}>
        {/* Left tab list */}
        <div style={{background:"#f8f9fc",borderRadius:8,border:`1px solid ${BD}`,overflow:"hidden"}}>
          {PERMISSION_GROUPS.map(g=>{
            const n=grpCount(g.id);
            const total=g.perms.length;
            const isActive=activeGroup===g.id;
            return(
              <button key={g.id} onClick={()=>setActiveGroup(g.id)}
                style={{width:"100%",padding:"10px 12px",background:isActive?"#fff":"transparent",border:"none",borderLeft:isActive?`3px solid ${g.color}`:"3px solid transparent",cursor:"pointer",textAlign:"left",fontFamily:"inherit",display:"flex",flexDirection:"column",gap:2,borderBottom:`1px solid ${BD}`}}>
                <span style={{fontSize:12.5,fontWeight:isActive?700:500,color:isActive?g.color:"#212529"}}>{g.label}</span>
                <div style={{display:"flex",alignItems:"center",gap:4}}>
                  <div style={{flex:1,height:3,background:"#e9ecef",borderRadius:2,overflow:"hidden"}}>
                    <div style={{width:`${total>0?n/total*100:0}%`,height:"100%",background:g.color,borderRadius:2}}/>
                  </div>
                  <span style={{fontSize:10,color:MUT,whiteSpace:"nowrap"}}>{n}/{total}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right permission list */}
        <div style={{overflowY:"auto",paddingRight:4}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
            <div style={{width:10,height:10,borderRadius:2,background:currentGroup?.color}}/>
            <span style={{fontSize:13,fontWeight:700,color:"#212529"}}>{currentGroup?.label}</span>
          </div>
          {currentGroup?.perms.map(p=>(
            <div key={p.key}
              style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",borderRadius:8,background:perms[p.key]?"#f0fff4":"#fff",border:`1px solid ${perms[p.key]?"#b8dfc9":BD}`,marginBottom:6,cursor:"pointer",transition:"all .12s"}}
              onClick={()=>togglePerm(p.key)}>
              <Toggle checked={!!perms[p.key]} onChange={()=>togglePerm(p.key)}/>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,color:"#212529"}}>{p.label}</div>
                <div style={{fontSize:11.5,color:MUT,marginTop:1}}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
export default function GestionPermissions(){
  const{users,setUsers,lang}=useApp();
  const t=useT(lang);
  const[editUser,setEditUser]=useState(null);
  const[q,setQ]=useState("");

  const filtered=useMemo(()=>
    users.filter(u=>!q||u.nom.toLowerCase().includes(q.toLowerCase())||u.email.toLowerCase().includes(q.toLowerCase()))
  ,[users,q]);

  function savePerms(updatedUser){
    setUsers(prev=>prev.map(u=>u.id===updatedUser.id?updatedUser:u));
    setEditUser(null);
  }

  return(
    <div style={{animation:"fadeIn .2s ease"}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div>
          <h2 style={{fontSize:17,fontWeight:700,color:"#212529",marginBottom:3}}>Droits & Rôles</h2>
          <p style={{fontSize:12.5,color:MUT}}>Gérez les permissions de chaque utilisateur sur toutes les fonctionnalités.</p>
        </div>
        <input value={q} onChange={e=>setQ(e.target.value)}
          placeholder="Rechercher un utilisateur…" style={{...inp(),width:220}}/>
      </div>

      {/* Summary cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10,marginBottom:16}}>
        {Object.entries(PROFILES).map(([k,p])=>{
          const count=users.filter(u=>{
            const pKey=PERMISSION_GROUPS.flatMap(g=>g.perms).find(x=>x.key==="paramPerms");
            return false; // placeholder
          }).length;
          return(
            <div key={k} style={{background:WH,border:`1.5px solid ${p.color}22`,borderRadius:8,padding:"10px 14px",borderLeft:`4px solid ${p.color}`}}>
              <div style={{fontSize:11,fontWeight:700,color:p.color,textTransform:"uppercase",letterSpacing:".06em"}}>{p.label}</div>
              <div style={{fontSize:11,color:MUT,marginTop:2}}>Profil prédéfini</div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div style={{...card(),overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead>
            <tr>
              {["Utilisateur","Rôle","Dépôt","Confidentiel","Liquidation","Stats","Paramétrage",""].map(h=>(
                <th key={h} style={{background:"#2d4a7a",color:"#fff",padding:"9px 12px",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",textAlign:"left",whiteSpace:"nowrap"}}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(u=>(
              <UserRow key={u.id} user={u} onClick={setEditUser}/>
            ))}
            {filtered.length===0&&(
              <tr><td colSpan={8} style={{...TD,textAlign:"center",color:MUT,padding:32}}>Aucun utilisateur</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editUser&&(
        <PermModal user={editUser} onSave={savePerms} onClose={()=>setEditUser(null)}/>
      )}
    </div>
  );
}
