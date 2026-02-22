"use client";
import{useState}from"react";
import{IC}from"../ui/Icons";
import{useApp}from"../../context/AppContext";
import{DOC_MENUS,filterDocsByMenu}from"../../lib/data";
import{bdg,TR,P}from"../../lib/theme";

const SB="#1e2d3d";
const SB2="#263447";
const SB_HOVER="rgba(255,255,255,.06)";
const SB_TEXT="rgba(255,255,255,.78)";
const SB_MUTED="rgba(255,255,255,.42)";
const ACCENT="#4a90d9";

/* Helper: render icon from IC key or direct JSX */
const Ic=({k,fallback})=>{
  if(!k)return fallback||null;
  const el=IC[k];
  if(!el)return fallback||null;
  return<span style={{display:"flex",flexShrink:0}}>{el}</span>;
};

const NAV_ITEMS=(docs)=>[
  {id:"dashboard",label:"Tableau de bord",icon:"dash",   direct:true},
  {id:"depot",    label:"Déposer un doc", icon:"upload",  direct:true},
  {id:"suivi",    label:"Suivi document", icon:"search",  direct:true},
  {id:"documents",label:"Mes Documents",  icon:"folder",  children:DOC_MENUS.map(m=>({...m,iconKey:m.iconKey,count:filterDocsByMenu(docs,m.id).length}))},
  {id:"financier",label:"Financier",      icon:"money",   children:[
    {id:"liq",       label:"Liquidations",   iconKey:"creditCard",direct:true},
    {id:"paiements", label:"Paiements XML",  iconKey:"bank",      direct:true},
  ]},
  {id:"param",    label:"Paramétrage",    icon:"cog",     children:[
    {id:"users",       label:"Utilisateurs",       iconKey:"users",     direct:true},
    {id:"param_types", label:"Types de documents", iconKey:"fileText",  direct:true},
    {id:"param_recv",  label:"Receveurs",          iconKey:"mail",      direct:true},
  ]},
];

export function Sidebar(){
  const{view,setView,sidebarOpen,docs}=useApp();
  const[open,setOpen]=useState({documents:true,financier:false,param:false});

  return(
    <aside style={{width:sidebarOpen?256:0,minWidth:sidebarOpen?256:0,background:SB,display:"flex",flexDirection:"column",transition:"width .2s ease,min-width .2s ease",overflow:"hidden",flexShrink:0,borderRight:"1px solid rgba(0,0,0,.3)"}}>
      {/* Brand */}
      <div style={{padding:"0 16px",height:56,display:"flex",alignItems:"center",gap:12,background:SB2,flexShrink:0,borderBottom:"1px solid rgba(0,0,0,.25)"}}>
        <div style={{width:34,height:34,borderRadius:6,background:P,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 2px 8px rgba(0,0,0,.3)"}}>
          <span style={{color:"#fff",fontWeight:800,fontSize:13,letterSpacing:"-0.5px"}}>SD</span>
        </div>
        <div>
          <div style={{color:"#fff",fontWeight:700,fontSize:14.5,letterSpacing:"-.2px",whiteSpace:"nowrap"}}>SoftDocs</div>
          <div style={{color:SB_MUTED,fontSize:10.5,whiteSpace:"nowrap"}}>GED & Processus Financiers</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{flex:1,overflowY:"auto",padding:"8px 0",scrollbarWidth:"thin"}}>
        <div style={{padding:"10px 16px 4px",fontSize:10,fontWeight:700,color:SB_MUTED,textTransform:"uppercase",letterSpacing:".1em"}}>Navigation</div>

        {NAV_ITEMS(docs).map(item=>{
          const active=item.direct?view===item.id:(item.children&&item.children.some(c=>view===c.id));
          return(
            <div key={item.id}>
              <div
                onClick={()=>item.direct?setView(item.id):setOpen(p=>({...p,[item.id]:!p[item.id]}))}
                style={{display:"flex",alignItems:"center",gap:10,padding:"9px 16px",cursor:"pointer",color:active?ACCENT:SB_TEXT,background:active?"rgba(255,255,255,.12)":"transparent",borderLeft:active?`3px solid ${ACCENT}`:"3px solid transparent",transition:TR}}
                onMouseEnter={e=>{if(!active){e.currentTarget.style.background=SB_HOVER;e.currentTarget.style.color="#fff";}}}
                onMouseLeave={e=>{if(!active){e.currentTarget.style.background="transparent";e.currentTarget.style.color=SB_TEXT;}}}>
                <span style={{display:"flex",color:active?ACCENT:SB_MUTED,flexShrink:0}}>{IC[item.icon]}</span>
                <span style={{flex:1,fontSize:13.5,fontWeight:active?600:400,whiteSpace:"nowrap"}}>{item.label}</span>
                {item.children&&<span style={{fontSize:10,display:"flex",color:SB_MUTED,transform:open[item.id]?"rotate(90deg)":"none",transition:TR}}>{IC.chev}</span>}
              </div>
              {item.children&&open[item.id]&&(
                <div style={{background:"rgba(0,0,0,.15)"}}>
                  {item.children.map(ch=>{
                    const ca=view===ch.id;
                    return(
                      <div key={ch.id} onClick={()=>setView(ch.id)}
                        style={{display:"flex",alignItems:"center",gap:10,padding:"7px 16px 7px 36px",cursor:"pointer",color:ca?ACCENT:SB_TEXT,background:ca?"rgba(74,144,217,.15)":"transparent",borderLeft:ca?`3px solid ${ACCENT}`:"3px solid transparent",fontSize:13,transition:TR}}
                        onMouseEnter={e=>{if(!ca){e.currentTarget.style.background=SB_HOVER;e.currentTarget.style.color="#fff";}}}
                        onMouseLeave={e=>{if(!ca){e.currentTarget.style.background="transparent";e.currentTarget.style.color=SB_TEXT;}}}>
                        <span style={{display:"flex",color:ca?ACCENT:SB_MUTED,flexShrink:0}}>{IC[ch.iconKey]||IC.file}</span>
                        <span style={{flex:1,fontWeight:ca?600:400,whiteSpace:"nowrap"}}>{ch.label}</span>
                        {ch.count>0&&<span style={bdg("rgba(255,255,255,.14)","rgba(255,255,255,.8)",{fontSize:10,padding:"1px 7px"})}>{ch.count}</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User */}
      <div style={{padding:"10px 16px",borderTop:"1px solid rgba(255,255,255,.08)",display:"flex",alignItems:"center",gap:10,background:SB2,flexShrink:0}}>
        <div style={{width:32,height:32,borderRadius:"50%",background:P,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:11,flexShrink:0}}>RL</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{color:"#fff",fontSize:12.5,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>Randria Lova</div>
          <div style={{color:SB_MUTED,fontSize:11,whiteSpace:"nowrap"}}>Super Admin</div>
        </div>
        <button style={{background:"none",border:"none",color:SB_MUTED,cursor:"pointer",display:"flex",alignItems:"center",padding:4}}
          title="Déconnexion">
          <span style={{display:"flex"}}>{IC.power}</span>
        </button>
      </div>
    </aside>
  );
}
