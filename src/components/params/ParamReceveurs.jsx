"use client";
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

export default function ParamReceveurs(){
  const{recv,setRecv,users}=useApp();
  const toggle=(cat,uid)=>setRecv(p=>({...p,[cat]:p[cat].includes(uid)?p[cat].filter(x=>x!==uid):[...p[cat],uid]}));

  return(
    <div style={{animation:"fadeIn .2s ease"}}>
      <h2 style={{fontSize:17,fontWeight:700,color:"#212529",marginBottom:16}}>Receveurs</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14}}>
        {cats.map(cat=>(
          <div key={cat.k} style={{...card(),padding:18}}>
            <div style={{display:"flex",gap:10,marginBottom:14,alignItems:"center"}}>
              <div style={{width:38,height:38,borderRadius:6,background:"#eef1f8",display:"flex",alignItems:"center",justifyContent:"center",color:P,flexShrink:0}}>
                <span style={{display:"flex"}}>{CAT_IC[cat.k]||IC.users}</span>
              </div>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:"#212529"}}>{cat.l}</div>
                <div style={{fontSize:11,color:MUT}}>{cat.desc}</div>
              </div>
            </div>
            <div>
              {users.map(u=>{
                const active=recv[cat.k]?.includes(u.id);
                return(
                  <div key={u.id} onClick={()=>toggle(cat.k,u.id)}
                    style={{display:"flex",alignItems:"center",gap:10,padding:"8px 6px",borderTop:`1px solid ${BD}`,cursor:"pointer",borderRadius:4,transition:TR}}
                    onMouseEnter={e=>e.currentTarget.style.background="#f8f9fc"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <Avatar uid={u.id} users={users} size={28}/>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:500,color:"#212529"}}>{u.nom}</div>
                      <div style={{fontSize:11,color:MUT}}>{u.role}</div>
                    </div>
                    <span style={bdg(active?SUCL:"#e9ecef",active?SUCD:MUT,{fontSize:11})}>
                      {active?"Actif":"—"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
