"use client";
import { useState, useRef, useMemo } from "react";
import { IC } from "../ui/Icons";
import { ExportButtons } from "../ui/ExportButtons";
import { card, btn, inp, lbl, bdg, P, WH, BD, BG, MUT, SUCL, SUCD, DNG, RSm, TR, TH, TD } from "../../lib/theme";
import { fmtN } from "../../lib/utils";
import { useApp } from "../../context/AppContext";
import { useT } from "../../lib/i18n";
import { PROJETS, ALL_SITES } from "../../lib/data";

const SB = { background: "#2d4a7a", color: "#fff", padding: "9px 12px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", textAlign: "left", whiteSpace: "nowrap" };

/* ── Filter Bar ── */
function FilterBar({ f, setF, users, t }) {
  return (
    <div style={{ ...card(), padding: "14px 18px", marginBottom: 16, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: MUT, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 4 }}>{t.filtreProjet}</div>
        <select value={f.proj} onChange={e => setF(p => ({ ...p, proj: e.target.value }))} style={{ ...inp({ padding: "7px 10px", fontSize: 12, minWidth: 160 }) }}>
          <option value="">{t.tousProj}</option>
          {PROJETS.map(p => <option key={p.id} value={p.id}>{p.nom.slice(0, 28)}</option>)}
        </select>
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: MUT, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 4 }}>{t.filtreSite}</div>
        <select value={f.site} onChange={e => setF(p => ({ ...p, site: e.target.value }))} style={{ ...inp({ padding: "7px 10px", fontSize: 12, minWidth: 140 }) }}>
          <option value="">{t.tousSites}</option>
          {ALL_SITES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: MUT, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 4 }}>{t.filtreExped}</div>
        <select value={f.exped} onChange={e => setF(p => ({ ...p, exped: e.target.value }))} style={{ ...inp({ padding: "7px 10px", fontSize: 12, minWidth: 130 }) }}>
          <option value="">{t.tousExped}</option>
          <option value="Fournisseur">{t.expFourn}</option>
          <option value="Interne">{t.expInterne}</option>
        </select>
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: MUT, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 4 }}>{t.filtreValideur}</div>
        <select value={f.valideur} onChange={e => setF(p => ({ ...p, valideur: e.target.value }))} style={{ ...inp({ padding: "7px 10px", fontSize: 12, minWidth: 160 }) }}>
          <option value="">{t.tousValideurs}</option>
          {users.map(u => <option key={u.id} value={u.id}>{u.nom}</option>)}
        </select>
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: MUT, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 4 }}>{t.filtrePeriode}</div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <input type="date" value={f.dateFrom} onChange={e => setF(p => ({ ...p, dateFrom: e.target.value }))} style={{ ...inp({ padding: "7px 10px", fontSize: 12, width: 130 }) }} />
          <span style={{ color: MUT, fontSize: 12 }}>→</span>
          <input type="date" value={f.dateTo} onChange={e => setF(p => ({ ...p, dateTo: e.target.value }))} style={{ ...inp({ padding: "7px 10px", fontSize: 12, width: 130 }) }} />
        </div>
      </div>
      <button onClick={() => setF({ proj: "", site: "", exped: "", valideur: "", dateFrom: "", dateTo: "" })}
        style={{ ...btn("light", true), alignSelf: "flex-end" }}>
        <span style={{ display: "flex" }}>{IC.x}</span> Reset
      </button>
    </div>
  );
}

/* ── KPI Card ── */
function KPI({ label, val, sub, color, icon }) {
  return (
    <div style={{ background: WH, border: `1px solid ${BD}`, borderRadius: 10, padding: "16px 20px", boxShadow: "0 2px 8px rgba(50,67,114,.07)", borderLeft: `4px solid ${color}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ display: "flex", color, fontSize: 16 }}>{icon}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: MUT, textTransform: "uppercase", letterSpacing: ".06em" }}>{label}</span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 900, color }}>{val}</div>
      {sub && <div style={{ fontSize: 11.5, color: MUT, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

function EtatTable({ tableRef, cols, rows, emptyMsg = "Aucune donnée" }) {
  return (
    <div style={{ ...card(), overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}>
        <table ref={tableRef} style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#2d4a7a" }}>
              {cols.map(h => <th key={h} style={SB}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={cols.length} style={{ ...TD, textAlign: "center", color: MUT, padding: 32 }}>{emptyMsg}</td></tr>
            )}
            {rows.map((row, ri) => (
              <tr key={ri}
                style={{ background: ri % 2 === 0 ? WH : "#f9fafc" }}
                onMouseEnter={e => e.currentTarget.style.background = "#eef3ff"}
                onMouseLeave={e => e.currentTarget.style.background = ri % 2 === 0 ? WH : "#f9fafc"}>
                {row.map((cell, ci) => (
                  <td key={ci} style={{ ...TD, fontSize: 12 }}>{cell ?? "—"}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── STATUS BADGE ── */
const ST_COLORS = {
  "VALIDÉ":{ bg:"#d4edda",fg:"#155724" },"PAYÉ":{ bg:"#d4edda",fg:"#155724" },"BON À PAYER":{ bg:"#d1ecf1",fg:"#0c5460" },
  "REJETÉ":{ bg:"#f8d7da",fg:"#721c24" },"EN RETARD":{ bg:"#fff3cd",fg:"#856404" },"EN VALIDATION":{ bg:"#fff3cd",fg:"#856404" },"REÇU":{ bg:"#d1ecf1",fg:"#0c5460" },
};
const StBdg = ({ st }) => { const c=ST_COLORS[st]||{bg:"#e9ecef",fg:"#6c757d"}; return <span style={{background:c.bg,color:c.fg,padding:"2px 8px",borderRadius:10,fontSize:10,fontWeight:700,whiteSpace:"nowrap"}}>{st}</span>; };

/* ══════ RAPPORT 1: Dossiers traités par projet ══════ */
function R1({ docs, tableRef }) {
  const rows = PROJETS.map(p => {
    const pd = docs.filter(d => d.proj === p.id);
    const traites = pd.filter(d => ["VALIDÉ","PAYÉ","BON À PAYER","CLÔTURÉ","ARCHIVÉ"].includes(d.st));
    if (!pd.length) return null;
    const tx = pd.length > 0 ? ((traites.length/pd.length)*100).toFixed(0) : 0;
    return [p.id, p.nom.slice(0,34), p.bailleur, pd.length, traites.length, pd.length-traites.length, `${tx}%`, fmtN(traites.reduce((s,d)=>s+(d.mt||0),0))];
  }).filter(Boolean);
  const kpiTotal = docs.length;
  const kpiTraites = docs.filter(d => ["VALIDÉ","PAYÉ","BON À PAYER","CLÔTURÉ","ARCHIVÉ"].includes(d.st)).length;
  return <>
    <div style={{ display:"grid", gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"repeat(3,1fr)", gap:12, marginBottom:16 }}>
      <KPI label="Total dossiers" val={kpiTotal} color={P} icon={IC.file} />
      <KPI label="Traités" val={kpiTraites} color="#28a745" icon={IC.checkCircle} sub={`${kpiTotal>0?((kpiTraites/kpiTotal)*100).toFixed(0):0}% du total`} />
      <KPI label="En attente" val={kpiTotal-kpiTraites} color="#e07d00" icon={IC.clock} />
    </div>
    <EtatTable tableRef={tableRef} cols={["Code","Projet","Bailleur","Total","Traités","En attente","Taux traitement","Montant traité"]} rows={rows} />
  </>;
}

/* ══════ RAPPORT 2: Historique des documents ══════ */
function R2({ docs, tableRef }) {
  const sorted = [...docs].sort((a,b)=>(b.date||"").localeCompare(a.date||""));
  const rows = sorted.map(d => [d.id, d.type, d.fourn||"—", d.exped||"—", d.date, d.proj||"—", d.site||"—", <StBdg st={d.st}/>, fmtN(d.mt)]);
  return <EtatTable tableRef={tableRef} cols={["Référence","Type","Fournisseur","Expéditeur","Date","Projet","Site","Statut","Montant"]} rows={rows} />;
}

/* ══════ RAPPORT 3: En instance par validateur ══════ */
function R3({ docs, users, tableRef }) {
  const enCours = docs.filter(d => ["EN VALIDATION","EN RETARD","REÇU"].includes(d.st));
  const rows = users.map(u => {
    const assigned = enCours.filter(d => d.etapes?.some(e => (e.v||[]).includes(u.id) && !["VALIDÉ","REJETÉ"].includes(e.statut)));
    const retards = assigned.filter(d => d.st==="EN RETARD");
    if (!assigned.length) return null;
    return [u.nom, u.role, u.site, assigned.length, retards.length, assigned.length-retards.length,
      <span style={{color:retards.length>0?"#dc3545":"#28a745",fontWeight:700}}>{retards.length>0?"🔴 "+retards.length+" en retard":"🟢 OK"}</span>];
  }).filter(Boolean);
  return <>
    <div style={{ display:"grid", gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"repeat(2,1fr)", gap:12, marginBottom:16 }}>
      <KPI label="Total en instance" val={enCours.length} color="#e07d00" icon={IC.clock} />
      <KPI label="En retard" val={docs.filter(d=>d.st==="EN RETARD").length} color="#dc3545" icon={IC.alertTri} />
    </div>
    <EtatTable tableRef={tableRef} cols={["Validateur","Rôle","Site","En instance","En retard","Dans les délais","Statut"]} rows={rows} emptyMsg="Aucun dossier en instance" />
  </>;
}

/* ══════ RAPPORT 4: Dossiers en instance par personne ══════ */
function R4({ docs, users, tableRef }) {
  const rows = [];
  docs.filter(d=>["EN VALIDATION","EN RETARD","REÇU"].includes(d.st)).forEach(d => {
    const actif = d.etapes?.find(e=>!["VALIDÉ","REJETÉ"].includes(e.statut));
    if (!actif) return;
    (actif.v||[]).forEach(uid => {
      const u = users.find(x=>x.id===uid);
      if (u) rows.push([u.nom, d.id, d.type, d.fourn||"—", d.date, actif.label, <StBdg st={actif.statut}/>, `${actif.duree||"—"}h`]);
    });
  });
  return <EtatTable tableRef={tableRef} cols={["Assigné à","Dossier","Type","Fournisseur","Date dépôt","Étape","Statut étape","Délai"]} rows={rows} emptyMsg="Aucun dossier en instance" />;
}

/* ══════ RAPPORT 5: Dossiers en instance par date ══════ */
function R5({ docs, tableRef }) {
  const enCours = [...docs.filter(d=>["EN VALIDATION","EN RETARD","REÇU"].includes(d.st))].sort((a,b)=>(a.date||"").localeCompare(b.date||""));
  const rows = enCours.map(d => {
    const etape = d.etapes?.find(e=>!["VALIDÉ","REJETÉ"].includes(e.statut));
    let ancj = "—";
    try { const parts=(d.date||"").split("/"); if(parts.length===3){const dd=new Date(`${parts[2]}-${parts[1]}-${parts[0]}`); ancj=Math.floor((Date.now()-dd.getTime())/86400000);} } catch {}
    const color = typeof ancj==="number" ? (ancj>7?"#dc3545":ancj>3?"#e07d00":"#28a745") : MUT;
    return [d.id, d.type, d.fourn||"—", d.date, etape?.label||"—", <StBdg st={d.st}/>,
      <span style={{color,fontWeight:700}}>{typeof ancj==="number"?`${ancj}j`:ancj}</span>];
  });
  return <EtatTable tableRef={tableRef} cols={["Dossier","Type","Fournisseur","Date dépôt","Étape en cours","Statut","Ancienneté"]} rows={rows} />;
}

/* ══════ RAPPORT 6: Délai moyen par projet ══════ */
function R6({ docs, tableRef }) {
  const archived = docs.filter(d=>["VALIDÉ","PAYÉ","BON À PAYER","ARCHIVÉ","CLÔTURÉ"].includes(d.st));
  const rows = PROJETS.map(p => {
    const pd = archived.filter(d=>d.proj===p.id);
    if (!pd.length) return null;
    const totalH = pd.reduce((s,d)=>s+(d.etapes?.reduce((es,e)=>es+(e.duree||0),0)||0),0);
    const avgH = Math.round(totalH/pd.length);
    const minH = Math.min(...pd.map(d=>d.etapes?.reduce((s,e)=>s+(e.duree||0),0)||0));
    const maxH = Math.max(...pd.map(d=>d.etapes?.reduce((s,e)=>s+(e.duree||0),0)||0));
    return [p.nom.slice(0,30), pd.length, `${avgH}h`, `${Math.ceil(avgH/8)}j`, `${minH}h`, `${maxH}h`, fmtN(pd.reduce((s,d)=>s+(d.mt||0),0))];
  }).filter(Boolean);
  return <EtatTable tableRef={tableRef} cols={["Projet","Dossiers archivés","Délai moyen","Jours équivalents","Délai min","Délai max","Montant total"]} rows={rows} />;
}

/* ══════ RAPPORT 7: Détail traitement archivés ══════ */
function R7({ docs, users, tableRef }) {
  const archived = docs.filter(d=>["VALIDÉ","PAYÉ","BON À PAYER","ARCHIVÉ","CLÔTURÉ"].includes(d.st));
  const rows = archived.map(d => {
    const totalH = d.etapes?.reduce((s,e)=>s+(e.duree||0),0)||0;
    const lastE = [...(d.etapes||[])].reverse().find(e=>e.validBy);
    const valideurs = [...new Set((d.etapes||[]).map(e=>e.validBy).filter(Boolean))].map(uid=>users.find(u=>u.id===uid)?.nom?.split(" ").slice(-1)[0]||uid).join(", ");
    return [d.id, d.type, d.fourn||"—", d.date, lastE?.date||"—", `${totalH}h`, valideurs||"—", d.etapes?.length||0, fmtN(d.mt), <StBdg st={d.st}/>];
  });
  return <EtatTable tableRef={tableRef} cols={["Dossier","Type","Fournisseur","Dépôt","Clôture","Durée","Valideurs","Nb étapes","Montant","Statut"]} rows={rows} />;
}

/* ══════ RAPPORT 8: En retard par validateur ══════ */
function R8({ docs, users, tableRef }) {
  const retards = docs.filter(d=>d.st==="EN RETARD");
  const rows = users.map(u => {
    const myR = retards.filter(d=>d.etapes?.some(e=>(e.v||[]).includes(u.id)&&e.statut==="EN RETARD"));
    if (!myR.length) return null;
    return [u.nom, u.role, myR.length, myR.map(d=>d.id).slice(0,3).join(", ")+(myR.length>3?`…+${myR.length-3}`:""),
      fmtN(myR.reduce((s,d)=>s+(d.mt||0),0)),
      <span style={{background:"#fdf2f2",color:"#c0392b",padding:"2px 10px",borderRadius:10,fontSize:11,fontWeight:700}}>⚠ Action requise</span>];
  }).filter(Boolean);
  return <>
    {retards.length===0
      ? <div style={{...card(),padding:40,textAlign:"center",color:MUT}}>🎉 Aucun dossier en retard</div>
      : <>
        <div style={{...card(),padding:"12px 16px",marginBottom:12,background:"#fff8f0",border:"1px solid #ffd8a8"}}>
          <span style={{fontSize:13,fontWeight:600,color:"#b84a00"}}>⚠ {retards.length} dossier(s) en retard — Actions requises des valideurs concernés</span>
        </div>
        <EtatTable tableRef={tableRef} cols={["Validateur","Rôle","Nb retards","Dossiers","Montant engagé","Alerte"]} rows={rows} emptyMsg="Aucun retard" />
      </>}
  </>;
}

/* ══════ RAPPORT 9: Nombre de dossiers rejetés ══════ */
function R9({ docs, tableRef }) {
  const rejetes = docs.filter(d=>d.st==="REJETÉ");
  const tx = docs.length>0?((rejetes.length/docs.length)*100).toFixed(1):0;
  const rows = PROJETS.map(p => {
    const pd = docs.filter(d=>d.proj===p.id);
    const pR = pd.filter(d=>d.st==="REJETÉ");
    if (!pd.length) return null;
    return [p.nom.slice(0,32), pd.length, pR.length, pd.length>0?`${((pR.length/pd.length)*100).toFixed(1)}%`:"0%",
      pR.length>0?<span style={{color:"#dc3545",fontWeight:700}}>⚠</span>:"🟢"];
  }).filter(Boolean);
  return <>
    <div style={{ display:"grid", gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"repeat(3,1fr)", gap:12, marginBottom:16 }}>
      <KPI label="Total rejetés" val={rejetes.length} color="#dc3545" icon={IC.xCircle} />
      <KPI label="Taux de rejet" val={`${tx}%`} color="#e07d00" icon={IC.alertTri} sub={`Sur ${docs.length} dossiers`} />
      <KPI label="Par type" val={[...new Set(rejetes.map(d=>d.type))].length+" type(s)"} color={P} icon={IC.fileText} />
    </div>
    <EtatTable tableRef={tableRef} cols={["Projet","Total","Rejetés","Taux rejet","Alerte"]} rows={rows} />
  </>;
}

/* ══════ RAPPORT 10: Liste des dossiers refusés ══════ */
function R10({ docs, users, tableRef }) {
  const rejetes = docs.filter(d=>d.st==="REJETÉ");
  const rows = rejetes.map(d => {
    const etapeR = d.etapes?.find(e=>e.statut==="REJETÉ");
    const by = users.find(u=>u.id===etapeR?.validBy);
    return [d.id, d.type, d.fourn||"—", d.exped||"—", d.date, etapeR?.label||"—", by?.nom||"—", d.motif||d.refus||etapeR?.comment||"—", fmtN(d.mt)];
  });
  return <EtatTable tableRef={tableRef} cols={["Dossier","Type","Fournisseur","Expéditeur","Date","Étape refus","Refusé par","Motif","Montant"]} rows={rows} emptyMsg="Aucun dossier refusé" />;
}

/* ══════ RAPPORT 11: Validés par utilisateur ══════ */
function R11({ docs, users, tableRef }) {
  const valides = docs.filter(d=>["VALIDÉ","PAYÉ","BON À PAYER","CLÔTURÉ"].includes(d.st));
  const maxVal = Math.max(1, ...users.map(u=>valides.filter(d=>d.etapes?.some(e=>e.validBy===u.id&&e.statut==="VALIDÉ")).length));
  const rows = users.map(u => {
    const myVal = valides.filter(d=>d.etapes?.some(e=>e.validBy===u.id&&e.statut==="VALIDÉ"));
    if (!myVal.length) return null;
    const mt = myVal.reduce((s,d)=>s+(d.mt||0),0);
    const pct = Math.round((myVal.length/maxVal)*100);
    return [u.nom, u.role, u.site, myVal.length,
      <div style={{background:"#eef3ff",borderRadius:5,height:10,width:"100%",overflow:"hidden",minWidth:80}}>
        <div style={{background:P,height:"100%",width:`${pct}%`,borderRadius:5}}/>
      </div>,
      fmtN(mt), `${((myVal.length/valides.length)*100).toFixed(1)}%`
    ];
  }).filter(Boolean).sort((a,b)=>(b[3]-a[3]));
  return <>
    <div style={{ display:"grid", gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"repeat(3,1fr)", gap:12, marginBottom:16 }}>
      <KPI label="Total validés" val={valides.length} color="#28a745" icon={IC.checkCircle} />
      <KPI label="Valideurs actifs" val={rows.length} color={P} icon={IC.users} />
      <KPI label="Montant validé" val={fmtN(valides.reduce((s,d)=>s+(d.mt||0),0))} color="#2d6a4f" icon={IC.money} sub="Total" />
    </div>
    <EtatTable tableRef={tableRef} cols={["Utilisateur","Rôle","Site","Nb validés","Activité","Montant validé","Part totale"]} rows={rows} emptyMsg="Aucune validation" />
  </>;
}


/* ══════════════════════════════════════════════
   R12 — Situation financière par projets
══════════════════════════════════════════════ */
function R12({ docs, tableRef }) {
  const PRJS = [...new Set(docs.map(d => d.proj).filter(Boolean))].sort();
  const SITES_BY_PROJ = {};
  PRJS.forEach(p => {
    SITES_BY_PROJ[p] = [...new Set(docs.filter(d => d.proj === p).map(d => d.site).filter(Boolean))].sort();
  });

  function getMt(p, s, filter) {
    return docs.filter(d => d.proj === p && d.site === s && filter(d)).reduce((sum, d) => sum + (d.mtR || d.mt || 0), 0);
  }
  function getTotalMt(filter) {
    return docs.filter(filter).reduce((sum, d) => sum + (d.mtR || d.mt || 0), 0);
  }

  /* Word-style table constants */
  const TBL = { width:"100%", borderCollapse:"collapse", border:"2px solid #000", fontSize:12, fontFamily:"'Segoe UI','Calibri',Arial,sans-serif" };
  const TH_C = { border:"1px solid #000", padding:"7px 10px", background:"#d9d9d9", fontWeight:700, textAlign:"center", textTransform:"uppercase", fontSize:11, letterSpacing:".03em", verticalAlign:"middle" };
  const TH_L = { ...TH_C, textAlign:"left" };
  const TD_L = { border:"1px solid #000", padding:"7px 10px", textAlign:"left", verticalAlign:"middle", fontWeight:600 };
  const TD_R = { border:"1px solid #000", padding:"7px 10px", textAlign:"right", verticalAlign:"middle" };
  const TD_TOTAL_L = { ...TD_L, background:"#f2f2f2", fontWeight:800, textTransform:"uppercase" };
  const TD_TOTAL_R = { ...TD_R, background:"#f2f2f2", fontWeight:800 };

  return (
    <div style={{ ...card(), padding:20 }}>
      <div style={{ overflowX:"auto" }}>
        <table ref={tableRef} style={TBL}>
          <thead>
            <tr>
              <th style={{ ...TH_L, width:"18%" }}>Projet</th>
              <th style={{ ...TH_L, width:"18%" }}>Site</th>
              <th style={TH_C}>Montant document<br/>reçu</th>
              <th style={TH_C}>Montant document<br/>en cours</th>
              <th style={TH_C}>Montant documents<br/>refusé</th>
              <th style={TH_C}>Montant<br/>validé</th>
            </tr>
          </thead>
          <tbody>
            {PRJS.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign:"center", padding:"24px", color:MUT, border:"1px solid #000" }}>Aucune donnée disponible</td></tr>
            )}
            {PRJS.map((proj) => {
              const sites = SITES_BY_PROJ[proj] || [];
              return sites.map((site, si) => (
                <tr key={proj + site}>
                  {si === 0 && (
                    <td rowSpan={sites.length} style={{ ...TD_L, verticalAlign:"middle", borderRight:"2px solid #000" }}>
                      {proj}
                    </td>
                  )}
                  <td style={TD_L}>{site}</td>
                  <td style={TD_R}>{getMt(proj, site, () => true) > 0 ? fmtN(getMt(proj, site, () => true)) + " Ar" : ""}</td>
                  <td style={TD_R}>{getMt(proj, site, d => d.st === "EN VALIDATION") > 0 ? fmtN(getMt(proj, site, d => d.st === "EN VALIDATION")) + " Ar" : ""}</td>
                  <td style={TD_R}>{getMt(proj, site, d => d.st === "REJETÉ") > 0 ? fmtN(getMt(proj, site, d => d.st === "REJETÉ")) + " Ar" : ""}</td>
                  <td style={TD_R}>{getMt(proj, site, d => ["VALIDÉ","BON À PAYER","PAYÉ"].includes(d.st)) > 0 ? fmtN(getMt(proj, site, d => ["VALIDÉ","BON À PAYER","PAYÉ"].includes(d.st))) + " Ar" : ""}</td>
                </tr>
              ));
            })}
            {PRJS.length > 0 && (
              <tr>
                <td colSpan={2} style={{ ...TD_TOTAL_L, borderRight:"2px solid #000" }}>Total général</td>
                <td style={TD_TOTAL_R}>{fmtN(getTotalMt(() => true))} Ar</td>
                <td style={TD_TOTAL_R}>{fmtN(getTotalMt(d => d.st === "EN VALIDATION"))} Ar</td>
                <td style={TD_TOTAL_R}>{fmtN(getTotalMt(d => d.st === "REJETÉ"))} Ar</td>
                <td style={TD_TOTAL_R}>{fmtN(getTotalMt(d => ["VALIDÉ","BON À PAYER","PAYÉ"].includes(d.st)))} Ar</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   R13 — Situation financière par fournisseurs
══════════════════════════════════════════════ */
function R13({ docs, tableRef }) {
  const FOURNS = [...new Set(docs.map(d => d.fourn).filter(Boolean))].sort();

  function getRows(fourn) {
    const fDocs = docs.filter(d => d.fourn === fourn);
    const projets = [...new Set(fDocs.map(d => d.proj).filter(Boolean))].sort();
    const rows = [];
    projets.forEach(proj => {
      const pDocs = fDocs.filter(d => d.proj === proj);
      const sites = [...new Set(pDocs.map(d => d.site).filter(Boolean))].sort();
      sites.forEach(site => rows.push({ proj, site }));
    });
    return rows;
  }
  function getProjRows(fourn, proj, allRows) { return allRows.filter(r => r.proj === proj); }

  function getMt(fourn, proj, site, filter) {
    return docs.filter(d => d.fourn === fourn && d.proj === proj && d.site === site && filter(d)).reduce((sum, d) => sum + (d.mtR || d.mt || 0), 0);
  }
  function getTotalMt(filter) {
    return docs.filter(filter).reduce((sum, d) => sum + (d.mtR || d.mt || 0), 0);
  }

  const TBL = { width:"100%", borderCollapse:"collapse", border:"2px solid #000", fontSize:12, fontFamily:"'Segoe UI','Calibri',Arial,sans-serif" };
  const TH_C = { border:"1px solid #000", padding:"7px 10px", background:"#d9d9d9", fontWeight:700, textAlign:"center", textTransform:"uppercase", fontSize:11, letterSpacing:".03em", verticalAlign:"middle" };
  const TH_L = { ...TH_C, textAlign:"left" };
  const TD_L = { border:"1px solid #000", padding:"7px 10px", textAlign:"left", verticalAlign:"middle", fontWeight:600 };
  const TD_R = { border:"1px solid #000", padding:"7px 10px", textAlign:"right", verticalAlign:"middle" };
  const TD_TOTAL_L = { ...TD_L, background:"#f2f2f2", fontWeight:800, textTransform:"uppercase" };
  const TD_TOTAL_R = { ...TD_R, background:"#f2f2f2", fontWeight:800 };

  return (
    <div style={{ ...card(), padding:20 }}>
      <div style={{ overflowX:"auto" }}>
        <table ref={tableRef} style={TBL}>
          <thead>
            <tr>
              <th style={{ ...TH_L, width:"16%" }}>Fournisseurs</th>
              <th style={{ ...TH_L, width:"15%" }}>Projet</th>
              <th style={{ ...TH_L, width:"14%" }}>Site</th>
              <th style={TH_C}>Montant document<br/>reçu</th>
              <th style={TH_C}>Montant document<br/>en cours</th>
              <th style={{ ...TH_C }}>Montant documents<br/>refusé</th>
              <th style={TH_C}>Montant<br/>validé</th>
            </tr>
          </thead>
          <tbody>
            {FOURNS.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign:"center", padding:"24px", color:MUT, border:"1px solid #000" }}>Aucune donnée disponible</td></tr>
            )}
            {FOURNS.map((fourn) => {
              const rows = getRows(fourn);
              if (rows.length === 0) return null;
              const projets = [...new Set(rows.map(r => r.proj))];
              return rows.map((row, ri) => {
                const projRows = getProjRows(fourn, row.proj, rows);
                const projFirstIdx = rows.findIndex(r => r.proj === row.proj);
                const isFirstOfProj = rows.indexOf(row) === projFirstIdx;
                return (
                  <tr key={fourn + row.proj + row.site}>
                    {ri === 0 && (
                      <td rowSpan={rows.length} style={{ ...TD_L, verticalAlign:"middle", borderRight:"2px solid #000" }}>
                        {fourn}
                      </td>
                    )}
                    {isFirstOfProj && (
                      <td rowSpan={projRows.length} style={{ ...TD_L, verticalAlign:"middle", borderRight:"1px solid #000" }}>
                        {row.proj}
                      </td>
                    )}
                    <td style={TD_L}>{row.site}</td>
                    <td style={TD_R}>{getMt(fourn, row.proj, row.site, () => true) > 0 ? fmtN(getMt(fourn, row.proj, row.site, () => true)) + " Ar" : ""}</td>
                    <td style={TD_R}>{getMt(fourn, row.proj, row.site, d => d.st === "EN VALIDATION") > 0 ? fmtN(getMt(fourn, row.proj, row.site, d => d.st === "EN VALIDATION")) + " Ar" : ""}</td>
                    <td style={TD_R}>{getMt(fourn, row.proj, row.site, d => d.st === "REJETÉ") > 0 ? fmtN(getMt(fourn, row.proj, row.site, d => d.st === "REJETÉ")) + " Ar" : ""}</td>
                    <td style={TD_R}>{getMt(fourn, row.proj, row.site, d => ["VALIDÉ","BON À PAYER","PAYÉ"].includes(d.st)) > 0 ? fmtN(getMt(fourn, row.proj, row.site, d => ["VALIDÉ","BON À PAYER","PAYÉ"].includes(d.st))) + " Ar" : ""}</td>
                  </tr>
                );
              });
            })}
            {FOURNS.length > 0 && (
              <tr>
                <td colSpan={3} style={{ ...TD_TOTAL_L, borderRight:"2px solid #000" }}>Total général</td>
                <td style={TD_TOTAL_R}>{fmtN(getTotalMt(() => true))} Ar</td>
                <td style={TD_TOTAL_R}>{fmtN(getTotalMt(d => d.st === "EN VALIDATION"))} Ar</td>
                <td style={TD_TOTAL_R}>{fmtN(getTotalMt(d => d.st === "REJETÉ"))} Ar</td>
                <td style={TD_TOTAL_R}>{fmtN(getTotalMt(d => ["VALIDÉ","BON À PAYER","PAYÉ"].includes(d.st)))} Ar</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


/* ══════════════════════════════════════════════
   11 REPORTS CONFIG
══════════════════════════════════════════════ */
function useReports(t) {
  return [
    { id:"r1",  num:1,  label:t.r1Label,  icon:"📊", sub:t.r1Sub },
    { id:"r2",  num:2,  label:t.r2Label,  icon:"📋", sub:t.r2Sub },
    { id:"r3",  num:3,  label:t.r3Label,  icon:"👤", sub:t.r3Sub },
    { id:"r4",  num:4,  label:t.r4Label,  icon:"📌", sub:t.r4Sub },
    { id:"r5",  num:5,  label:t.r5Label,  icon:"📅", sub:t.r5Sub },
    { id:"r6",  num:6,  label:t.r6Label,  icon:"⏱",  sub:t.r6Sub },
    { id:"r7",  num:7,  label:t.r7Label,  icon:"🗂",  sub:t.r7Sub },
    { id:"r8",  num:8,  label:t.r8Label,  icon:"⚠️",  sub:t.r8Sub },
    { id:"r9",  num:9,  label:t.r9Label,  icon:"❌", sub:t.r9Sub },
    { id:"r10", num:10, label:t.r10Label, icon:"🚫", sub:t.r10Sub },
    { id:"r11", num:11, label:t.r11Label, icon:"✅", sub:t.r11Sub },
    { id:"r12", num:12, label:t.r12Label, icon:"💰", sub:t.r12Sub },
    { id:"r13", num:13, label:t.r13Label, icon:"🏢", sub:t.r13Sub },
  ];
}

/* ══════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════ */
export default function Etats() {
  const { docs, users, lang, view } = useApp();
  const t = useT(lang);
  /* Use view directly — sidebar sets view to r1..r11 */
  const active = ["r1","r2","r3","r4","r5","r6","r7","r8","r9","r10","r11","r12","r13"].includes(view) ? view : "r1";
  const [f, setF] = useState({ proj:"", site:"", exped:"", valideur:"", dateFrom:"", dateTo:"" });
  const tableRef = useRef(null);

  const filtered = useMemo(() => {
    let res = docs;
    if (f.proj)    res = res.filter(d => d.proj === f.proj);
    if (f.site)    res = res.filter(d => d.site === f.site);
    if (f.exped)   res = res.filter(d => d.exped === f.exped);
    if (f.valideur) res = res.filter(d => d.etapes?.some(e => (e.v||[]).includes(f.valideur)));
    return res;
  }, [docs, f]);

  const REPORTS = useReports(t);
  const cur = REPORTS.find(r => r.id === active) || REPORTS[0];
  const activeFilters = Object.values(f).filter(Boolean).length;

  /* Color & icon map per report */
  const REPORT_STYLE = {
    r1:{color:"#2563eb",icon:"barChart"},r2:{color:"#475569",icon:"scroll"},
    r3:{color:"#7c3aed",icon:"user"},   r4:{color:"#7c3aed",icon:"users"},
    r5:{color:"#f5a623",icon:"clock"},  r6:{color:"#0fa86c",icon:"refresh"},
    r7:{color:"#64748b",icon:"archive"},r8:{color:"#e03e3e",icon:"alertTri"},
    r9:{color:"#e03e3e",icon:"xCircle"},r10:{color:"#b91c1c",icon:"fileText"},
    r11:{color:"#0fa86c",icon:"checkCircle"},
    r12:{color:"#1d6f42",icon:"money"},
    r13:{color:"#0891b2",icon:"money"},
  };
  const rs = REPORT_STYLE[active] || {color:"#324372",icon:"barChart"};

  return (
    <div style={{ animation:"fadeIn .2s ease" }}>
      {/* ── Page header ── */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18, flexWrap:"wrap", gap:8 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          {/* Color accent bar */}
          <div style={{ width:4, height:48, borderRadius:4, background:rs.color, flexShrink:0 }}/>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
              <span style={{ display:"flex", color:rs.color }}>{IC[rs.icon]}</span>
              <span style={{ fontSize:10, fontWeight:800, color:rs.color, textTransform:"uppercase", letterSpacing:".1em", background:rs.color+"15", padding:"2px 8px", borderRadius:10 }}>
                État {cur?.num}
              </span>
            </div>
            <h2 style={{ fontSize:20, fontWeight:800, color:"#1e293b", margin:0, letterSpacing:"-.3px" }}>{cur?.label}</h2>
            <p style={{ fontSize:12, color:MUT, margin:0 }}>{cur?.sub} · {filtered.length} {t.enregistrements} · {activeFilters} filtre{activeFilters>1?"s":""} actif{activeFilters>1?"s":""}</p>
          </div>
        </div>
        <ExportButtons filename={`etat_${active}`} title={cur?.label||"Rapport"} tableRef={tableRef}
          headers={["Référence","Type","Fournisseur","Date","Projet","Site","Statut","Montant"]}
          rows={filtered.map(d=>[d.id,d.type,d.fourn||"—",d.date,d.proj||"—",d.site||"—",d.st,fmtN(d.mt)])} />
      </div>

      {/* ── Filters ── */}
      <FilterBar f={f} setF={setF} users={users} t={t}/>

      {/* ── Report content — full width ── */}
      {active==="r1"  && <R1  docs={filtered} tableRef={tableRef} />}
      {active==="r2"  && <R2  docs={filtered} tableRef={tableRef} />}
      {active==="r3"  && <R3  docs={filtered} users={users} tableRef={tableRef} />}
      {active==="r4"  && <R4  docs={filtered} users={users} tableRef={tableRef} />}
      {active==="r5"  && <R5  docs={filtered} tableRef={tableRef} />}
      {active==="r6"  && <R6  docs={filtered} tableRef={tableRef} />}
      {active==="r7"  && <R7  docs={filtered} users={users} tableRef={tableRef} />}
      {active==="r8"  && <R8  docs={filtered} users={users} tableRef={tableRef} />}
      {active==="r9"  && <R9  docs={filtered} tableRef={tableRef} />}
      {active==="r10" && <R10 docs={filtered} users={users} tableRef={tableRef} />}
      {active==="r11" && <R11 docs={filtered} users={users} tableRef={tableRef} />}
      {active==="r12" && <R12 docs={filtered} tableRef={tableRef} />}
      {active==="r13" && <R13 docs={filtered} tableRef={tableRef} />}
    </div>
  );
}
