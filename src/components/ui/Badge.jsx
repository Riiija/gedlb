"use client";
import{STATUS,bdg,MUT}from"../../lib/theme";
export function Badge({s,sm}){
  const c=STATUS[s]||{bg:"#e9ecef",fg:MUT};
  return<span style={bdg(c.bg,c.fg,{fontSize:sm?10:11,padding:sm?"2px 8px":"2px 10px"})}>{s}</span>;
}
export function Avatar({uid,users,size=32}){
  const u=users?.find(x=>x.id===uid);
  if(!u)return<span style={{fontSize:12,color:MUT}}>{uid||"—"}</span>;
  return<span title={u.nom} style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:size,height:size,borderRadius:"50%",background:"#e8ecf8",color:"#324372",fontWeight:700,fontSize:size*0.36}}>{u.init}</span>;
}
