"use client";
/* ═══════════════════════════════════════════════════════════
   SOFTDOCS v5 — Design Tokens  (AdminLTE Modern · #324372)
═══════════════════════════════════════════════════════════ */
export const P    = "#324372";
export const PDk  = "#1e2a4a";
export const PLt  = "#4a5e96";
export const PXl  = "#eef1f8";
export const SB_BG  = "#1e2d3d";
export const SB_BG2 = "#263447";

export const SUC="#28a745";export const SUCL="#d4edda";export const SUCD="#155724";
export const DNG="#dc3545";export const DNGL="#f8d7da";export const DNGD="#721c24";
export const WRN="#ffc107";export const WRNL="#fff3cd";export const WRND="#856404";
export const INF="#17a2b8";export const INFL="#d1ecf1";export const INFD="#0c5460";
export const MUT="#6c757d";export const BD="#e3e6ea";export const BG="#f4f6f9";
export const WH="#ffffff";export const TXT="#212529";

export const R="6px";export const RSm="4px";export const RLg="10px";
export const SHADOW="0 1px 4px rgba(0,0,0,.08)";
export const SHADOW_M="0 4px 16px rgba(0,0,0,.10)";
export const SHADOW_L="0 8px 32px rgba(0,0,0,.14)";
export const TR="all .15s ease";

export const card=(x={})=>({background:WH,borderRadius:R,boxShadow:SHADOW,border:`1px solid ${BD}`,overflow:"hidden",...x});
export const inp=(x={})=>({width:"100%",border:`1px solid ${BD}`,borderRadius:RSm,padding:"8px 12px",fontSize:14,outline:"none",color:TXT,background:WH,transition:TR,boxSizing:"border-box",...x});
export const sel=(x={})=>inp(x);
export const lbl={fontSize:12,fontWeight:600,color:"#495057",marginBottom:4,display:"block",textTransform:"uppercase",letterSpacing:".05em"};
export const bdg=(bg,fg=WH,x={})=>({background:bg,color:fg,borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700,display:"inline-block",whiteSpace:"nowrap",...x});
export const TH={background:"#f8f9fc",color:"#495057",padding:"10px 14px",textAlign:"left",fontWeight:700,fontSize:11,textTransform:"uppercase",letterSpacing:".07em",borderBottom:`2px solid ${BD}`,whiteSpace:"nowrap"};
export const TD={padding:"11px 14px",borderBottom:`1px solid ${BD}`,verticalAlign:"middle",fontSize:13.5};

export const btn=(v="primary",sm=false,outline=false)=>{
  const MAP={primary:[P,WH],secondary:[PLt,WH],success:[SUC,WH],danger:[DNG,WH],warning:[WRN,TXT],light:["#f8f9fc",TXT],muted:[MUT,WH]};
  const [bg,fg]=MAP[v]||MAP.primary;
  return{background:outline?"transparent":bg,color:outline?bg:fg,border:`1px solid ${outline?bg:bg}`,borderRadius:RSm,padding:sm?"5px 12px":"8px 16px",fontSize:sm?12.5:13.5,fontWeight:600,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6,transition:TR,lineHeight:1.3,whiteSpace:"nowrap"};
};

export const STATUS={
  "REÇU":{bg:INFL,fg:INFD},"EN VALIDATION":{bg:WRNL,fg:WRND},"EN RETARD":{bg:DNGL,fg:DNGD},
  "VALIDÉ":{bg:SUCL,fg:SUCD},"REJETÉ":{bg:DNGL,fg:DNGD},"ARCHIVÉ":{bg:"#e2e3e5",fg:"#383d41"},
  "BON À PAYER":{bg:INFL,fg:INFD},"PAYÉ":{bg:SUCL,fg:SUCD},"CONFIDENTIEL":{bg:"#e9d8f5",fg:"#5e1d8a"},
  "EN ATTENTE":{bg:"#e9ecef",fg:MUT},"EN ATTENTE PAIEMENT":{bg:WRNL,fg:WRND},
  "Actif":{bg:SUCL,fg:SUCD},"Test":{bg:WRNL,fg:WRND},"CLÔTURÉ":{bg:"#e2e3e5",fg:"#383d41"},
};
