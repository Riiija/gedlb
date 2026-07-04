"use client";
import{useState}from"react";
import{IC}from"../ui/Icons";
import{Avatar}from"../ui/Badge";
import{card,bdg,BD,P,MUT,SUCL,SUCD,TR}from"../../lib/theme";
import{useApp}from"../../context/AppContext";

const CAT_IC={fournisseurs:IC.inbox,confidentiels:IC.lockKey,internes:IC.folder};
const cats=[
  {k:"fournisseurs", l:"Receveurs Fournisseurs",   desc:"Reçoivent les documents fournisseurs"},
  {k:"confidentiels",l:"Receveurs Confidentiels",  desc:"Reçoivent les documents confidentiels"},
  {k:"internes",     l:"Receveurs Internes",        desc:"Reçoivent les documents internes"},
];

function SearchInput({value,onChange}){
  return(
    <div style={{position:"relative",marginBottom:10}}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={MUT} strokeWidth="2" strokeLinecap="round"
        style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}>
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input value={value} onChange={e=>onChange(e.target.value)}
        placeholder="Rechercher un utilisateur…"
        style={{width:"100%",boxSizing:"border-box",padding:"6px 26px 6px 26px",border:"1px solid "+BD,borderRadius:6,fontSize:12,fontFamily:"inherit",background:"#f8f9fc",outline:"none"}}/>
      {value&&<span onClick={()=>onChange("")} style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",cursor:"pointer",color:MUT,fontSize:14,lineHeight:1}}>×</span>}
    </div>
  );
}

export default function ParamReceveurs(){
  const{recv,setRecv,users}=useApp();
  const[searches,setSearches]=useState({fournisseurs:"",confidentiels:"",internes:""});
  const toggle=(cat,uid)=>setRecv(p=>({...p,[cat]:p[cat].includes(uid)?p[cat].filter(x=>x!==uid):[...p[cat],uid]}));
  const activeCount=(cat)=>(recv[cat]||[]).length;

  return(
    <div style={{animation:"fadeIn .2s ease"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:8}}>
        <h2 style={{fontSize:17,fontWeight:700,color:"#212529",margin:0}}>Receveurs</h2>
        <span style={{fontSize:12,color:MUT}}>{users.length} utilisateurs · {cats.reduce((s,c)=>s+activeCount(c.k),0)} assignations</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14}}>
        {cats.map(cat=>{
          const q=searches[cat.k].toLowerCase();
          const filtered=users.filter(u=>!q||u.nom?.toLowerCase().includes(q)||u.role?.toLowerCase().includes(q));
          const active=activeCount(cat.k);
          const allSelected=filtered.length>0&&filtered.every(u=>(recv[cat.k]||[]).includes(u.id));
          return(
            <div key={cat.k} style={{...card(),padding:18,display:"flex",flexDirection:"column"}}>
              {/* Header */}
              <div style={{display:"flex",gap:10,marginBottom:10,alignItems:"center"}}>
                <div style={{width:38,height:38,borderRadius:6,background:"#eef1f8",display:"flex",alignItems:"center",justifyContent:"center",color:P,flexShrink:0}}>
                  <span style={{display:"flex"}}>{CAT_IC[cat.k]||IC.users}</span>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:700,color:"#212529"}}>{cat.l}</div>
                  <div style={{fontSize:11,color:MUT}}>{cat.desc}</div>
                </div>
                {active>0&&<span style={{flexShrink:0,fontSize:11,fontWeight:700,background:SUCL,color:SUCD,padding:"2px 8px",borderRadius:10}}>{active} actif{active>1?"s":""}</span>}
              </div>
              {/* Search */}
              <SearchInput value={searches[cat.k]} onChange={v=>setSearches(p=>({...p,[cat.k]:v}))}/>
              {/* List */}
              <div style={{overflowY:"auto",maxHeight:360}}>
                {filtered.length===0&&<div style={{textAlign:"center",padding:"18px 0",color:MUT,fontSize:12.5,fontStyle:"italic"}}>Aucun utilisateur trouvé</div>}
                {filtered.map(u=>{
                  const isActive=recv[cat.k]?.includes(u.id);
                  return(
                    <div key={u.id} onClick={()=>toggle(cat.k,u.id)}
                      style={{display:"flex",alignItems:"center",gap:10,padding:"8px 6px",borderTop:`1px solid ${BD}`,cursor:"pointer",borderRadius:4,transition:TR,background:isActive?"#f0f4ff":"transparent"}}
                      onMouseEnter={e=>e.currentTarget.style.background=isActive?"#e8eeff":"#f8f9fc"}
                      onMouseLeave={e=>e.currentTarget.style.background=isActive?"#f0f4ff":"transparent"}>
                      <Avatar uid={u.id} users={users} size={28}/>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:isActive?700:500,color:isActive?P:"#212529",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                          {q?u.nom?.split(new RegExp(`(${q})`,"gi")).map((part,i)=>
                            part.toLowerCase()===q?<mark key={i} style={{background:"#fef08a",borderRadius:2,padding:"0 1px"}}>{part}</mark>:part
                          ):u.nom}
                        </div>
                        <div style={{fontSize:11,color:MUT}}>{u.role}</div>
                      </div>
                      <span style={bdg(isActive?SUCL:"#e9ecef",isActive?SUCD:MUT,{fontSize:11})}>{isActive?"Actif":"—"}</span>
                    </div>
                  );
                })}
              </div>
              {/* Footer */}
              <div style={{marginTop:10,paddingTop:10,borderTop:`1px solid ${BD}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:11,color:MUT}}>{filtered.length} affiché{filtered.length>1?"s":""}</span>
                <button onClick={()=>{
                    const ids=filtered.map(u=>u.id);
                    setRecv(p=>({...p,[cat.k]:allSelected?p[cat.k].filter(id=>!ids.includes(id)):[...new Set([...(p[cat.k]||[]),...ids])]}));
                  }}
                  style={{fontSize:11,color:P,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:600,textDecoration:"underline"}}>
                  {allSelected?"Tout désélectionner":"Tout sélectionner"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
