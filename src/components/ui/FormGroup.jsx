"use client";
import{DNG,lbl}from"../../lib/theme";
export function FG({label,children,req,span=1}){
  return(
    <div style={{gridColumn:`span ${span}`,marginBottom:12}}>
      <label style={lbl}>{label}{req&&<span style={{color:DNG}}> *</span>}</label>
      {children}
    </div>
  );
}
export function SecTitle({children,icon}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:8,fontSize:11,fontWeight:700,color:"#495057",textTransform:"uppercase",letterSpacing:".08em",marginBottom:14,paddingBottom:8,borderBottom:"2px solid #e3e6ea"}}>
      {icon&&<span style={{display:"flex"}}>{icon}</span>}{children}
    </div>
  );
}
