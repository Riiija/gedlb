"use client";
import{FOURNISSEURS}from"./data";
export const now=()=>new Date().toLocaleDateString("fr-MG")+" "+new Date().toLocaleTimeString("fr-MG",{hour:"2-digit",minute:"2-digit"});
export const gid=p=>`${p}-${Date.now().toString().slice(-7)}`;
export const fmtN=v=>v?new Intl.NumberFormat("fr-MG").format(v)+" Ar":"—";
export const mkEtapes=dt=>(dt?.etapes||[]).map(e=>({...e,statut:"EN ATTENTE",date:"",comment:"",validBy:""}));
export const ocrSim=fid=>{
  const f=FOURNISSEURS.find(x=>x.id===fid)||FOURNISSEURS[0];
  const ht=Math.floor(20000000+Math.random()*80000000),tva=Math.floor(ht*.2),score=Math.floor(70+Math.random()*27);
  return{numero:`FAC-2025-${Math.floor(1000+Math.random()*8000)}`,date_doc:`${String(1+Math.floor(Math.random()*27)).padStart(2,"0")}/01/2025`,ht:String(ht),tva:String(tva),total:String(ht+tva),nif:f.nif,iban:f.iban,emetteur:f.nom,score};
};
