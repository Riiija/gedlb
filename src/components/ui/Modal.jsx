"use client";
import{P,WH,BD,R,RSm,SHADOW_L}from"../../lib/theme";
import{IC}from"./Icons";
export function Modal({title,children,onClose,w=640,footer}){
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(2px)"}}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:WH,borderRadius:R,boxShadow:SHADOW_L,width:"100%",maxWidth:w,maxHeight:"90vh",display:"flex",flexDirection:"column",animation:"fadeIn .2s ease"}}>
        {/* Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 20px",borderBottom:`1px solid ${BD}`,background:P,borderRadius:`${R} ${R} 0 0`}}>
          <span style={{color:WH,fontWeight:700,fontSize:14}}>{title}</span>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:RSm,color:WH,width:28,height:28,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.x}</button>
        </div>
        {/* Body */}
        <div style={{flex:1,overflowY:"auto",padding:20}}>{children}</div>
        {/* Footer */}
        {footer&&<div style={{padding:"12px 20px",borderTop:`1px solid ${BD}`,display:"flex",justifyContent:"flex-end",gap:8,background:"#f8f9fc",borderRadius:`0 0 ${R} ${R}`}}>{footer}</div>}
      </div>
    </div>
  );
}
