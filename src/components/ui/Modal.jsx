"use client";
import{P,WH,BD,R,RSm,SHADOW_L}from"../../lib/theme";
import{IC}from"./Icons";
export function Modal({title,children,onClose,w=640,footer}){
  const isMob=typeof window!=="undefined"&&window.innerWidth<=768;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:9999,display:"flex",alignItems:isMob?"flex-end":"center",justifyContent:"center",padding:isMob?0:16,backdropFilter:"blur(2px)"}}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:WH,borderRadius:isMob?`${R} ${R} 0 0`:R,boxShadow:SHADOW_L,width:"100%",maxWidth:isMob?"100%":w,maxHeight:isMob?"92vh":"90vh",display:"flex",flexDirection:"column",animation:"fadeIn .2s ease"}}>
        {/* Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:isMob?"12px 14px":"14px 20px",borderBottom:`1px solid ${BD}`,background:P,borderRadius:isMob?`${R} ${R} 0 0`:`${R} ${R} 0 0`,flexShrink:0}}>
          <span style={{color:WH,fontWeight:700,fontSize:14}}>{title}</span>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:RSm,color:WH,width:32,height:32,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.x}</button>
        </div>
        {/* Body */}
        <div style={{flex:1,overflowY:"auto",padding:isMob?14:20,WebkitOverflowScrolling:"touch"}}>{children}</div>
        {/* Footer */}
        {footer&&<div style={{padding:isMob?"10px 14px":"12px 20px",borderTop:`1px solid ${BD}`,display:"flex",justifyContent:"flex-end",gap:8,background:"#f8f9fc",borderRadius:`0 0 ${R} ${R}`,flexShrink:0,flexWrap:"wrap"}}>{footer}</div>}
      </div>
    </div>
  );
}
