"use client";
import{useState,useEffect,useRef,useCallback}from"react";
import{IC}from"../ui/Icons";
import{useApp}from"../../context/AppContext";
import{DOC_MENUS}from"../../lib/data";
import{P,WH,BD,DNG,DNGL,DNGD,bdg,btn,RSm,TR,MUT}from"../../lib/theme";
import{useT}from"../../lib/i18n";
import{useIsMobile}from"../../lib/useResponsive";

/* ── helpers ── */
function lsRead(key){try{const v=localStorage.getItem(key);return v?JSON.parse(v):null;}catch{return null;}}

function Highlight({text,q}){
  if(!q||!text)return<>{text||""}</>;
  const s=String(text);const lo=s.toLowerCase();const qi=q.toLowerCase();
  const idx=lo.indexOf(qi);
  if(idx===-1)return<>{s}</>;
  return<>{s.slice(0,idx)}<mark style={{background:"#fde68a",color:"#92400e",padding:0,borderRadius:2,fontWeight:800}}>{s.slice(idx,idx+q.length)}</mark>{s.slice(idx+q.length)}</>;
}

const SS_STATUS_META={
  en_cours:{label:"En cours",color:"#2563eb",bg:"#eff6ff"},
  signe:{label:"Signé",color:"#059669",bg:"#ecfdf5"},
  termine:{label:"Terminé",color:"#059669",bg:"#ecfdf5"},
  rejete:{label:"Rejeté",color:"#dc2626",bg:"#fef2f2"},
  archive:{label:"Archivé",color:"#94a3b8",bg:"#f1f5f9"},
  initie:{label:"Initié",color:"#6d3fd7",bg:"#f5f3ff"},
  recu:{label:"Reçu",color:"#f59e0b",bg:"#fffbeb"},
  en_attente_traitement:{label:"Reçu",color:"#f59e0b",bg:"#fffbeb"},
  en_attente_signature_externe:{label:"Signature externe attendue",color:"#d97706",bg:"#fffbeb"},
  signe_tiers:{label:"Signé par le tiers",color:"#059669",bg:"#ecfdf5"},
};
const SS_DOC_TYPES_MAP={contrat:"Contrat",bon_commande:"Bon de commande",devis:"Devis",facture:"Facture",avenant:"Avenant",protocole:"Protocole",marche_public:"Marché public",convention:"Convention",accord_cadre:"Accord-cadre",autre:"Autre"};

function GlobalSearchOverlay({open,onClose,setView,setCurrentApp}){
  const {docs:sdDocs=[],users=[]}=useApp();
  const [q,setQ]=useState("");
  const [activeIdx,setActiveIdx]=useState(0);
  const inputRef=useRef(null);
  const listRef=useRef(null);

  /* reset on open */
  useEffect(()=>{if(open){setQ("");setActiveIdx(0);setTimeout(()=>inputRef.current?.focus(),40);}}, [open]);

  /* close on Escape */
  useEffect(()=>{
    if(!open)return;
    const handler=(e)=>{if(e.key==="Escape")onClose();};
    window.addEventListener("keydown",handler);
    return()=>window.removeEventListener("keydown",handler);
  },[open,onClose]);

  /* build result groups */
  const groups=useCallback(()=>{
    const qi=q.trim().toLowerCase();
    const match=(s)=>!qi||String(s||"").toLowerCase().includes(qi);

    /* SoftSign docs */
    const ssDocs=lsRead("ss_docs")||[];
    const ssMatched=ssDocs.filter(d=>match(d.ref)||match(d.title)||match(d.projectName)||match(d.site)||match(d.deposantName)||match(SS_DOC_TYPES_MAP[d.type]));

    /* SoftSign workflows */
    const ssWfs=lsRead("ss_workflows")||[];
    const ssWfMatched=ssWfs.filter(w=>match(w.name)||match(w.description));

    /* SoftSign delegations */
    const ssDeleg=lsRead("ss_delegations")||[];
    const ssDelegMatched=ssDeleg.filter(d=>match(d.delegantName)||match(d.delegataireName)||match(d.comment));

    /* SoftDocs docs */
    const sdMatched=sdDocs.filter(d=>match(d.num)||match(d.fournisseur)||match(d.type)||match(d.ref));

    /* Users */
    const usersMatched=users.filter(u=>match(u.nom)||match(u.email)||match(u.role)||match(u.systemRole));

    return[
      {key:"ss-docs",label:"Documents SoftSign",icon:"📄",color:"#6d3fd7",items:ssMatched.slice(0,6),type:"ss-doc"},
      {key:"sd-docs",label:"Documents SoftDocs",icon:"🗂",color:"#324372",items:sdMatched.slice(0,4),type:"sd-doc"},
      {key:"users",label:"Utilisateurs",icon:"👥",color:"#2563eb",items:usersMatched.slice(0,4),type:"user"},
      {key:"workflows",label:"Workflows SoftSign",icon:"🔄",color:"#059669",items:ssWfMatched.slice(0,3),type:"workflow"},
      {key:"delegations",label:"Délégations",icon:"🤝",color:"#f59e0b",items:ssDelegMatched.slice(0,3),type:"delegation"},
    ].filter(g=>g.items.length>0);
  },[q,sdDocs,users]);

  const grps=groups();
  const flatItems=grps.flatMap(g=>g.items.map(item=>({...item,_type:g.type,_color:g.color})));
  const total=flatItems.length;

  /* keyboard navigation */
  useEffect(()=>{
    if(!open)return;
    const handler=(e)=>{
      if(e.key==="ArrowDown"){e.preventDefault();setActiveIdx(p=>Math.min(p+1,total-1));}
      else if(e.key==="ArrowUp"){e.preventDefault();setActiveIdx(p=>Math.max(p-1,0));}
      else if(e.key==="Enter"&&total>0){activateItem(flatItems[activeIdx]);}
    };
    window.addEventListener("keydown",handler);
    return()=>window.removeEventListener("keydown",handler);
  },[open,activeIdx,flatItems,total]);

  useEffect(()=>setActiveIdx(0),[q]);

  /* scroll active into view */
  useEffect(()=>{
    if(!listRef.current)return;
    const el=listRef.current.querySelector("[data-active='true']");
    el?.scrollIntoView({block:"nearest"});
  },[activeIdx]);

  function activateItem(item){
    if(!item)return;
    if(item._type==="ss-doc"){setCurrentApp("softsign");setView("ss-docs-my");}
    else if(item._type==="sd-doc"){setCurrentApp("softdocs");setView("suivi");}
    else if(item._type==="user"){setCurrentApp("softsign");setView("ss-admin-users");}
    else if(item._type==="workflow"){setCurrentApp("softsign");setView("ss-wf-modeles");}
    else if(item._type==="delegation"){setCurrentApp("softsign");setView("ss-delegations");}
    onClose();
  }

  let flatIdx=0;

  if(!open)return null;

  return(
    <div style={{position:"fixed",inset:0,zIndex:99999,display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:80,paddingLeft:16,paddingRight:16}}
      onClick={(e)=>{if(e.target===e.currentTarget)onClose();}}>
      {/* Backdrop */}
      <div style={{position:"absolute",inset:0,background:"rgba(15,23,42,.55)",backdropFilter:"blur(4px)"}}/>

      {/* Panel */}
      <div style={{position:"relative",width:"100%",maxWidth:680,background:WH,borderRadius:16,boxShadow:"0 32px 80px rgba(0,0,0,.28)",overflow:"hidden",maxHeight:"calc(100vh - 120px)",display:"flex",flexDirection:"column"}}>

        {/* Search input */}
        <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 18px",borderBottom:`1px solid ${BD}`,flexShrink:0}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            ref={inputRef}
            value={q}
            onChange={e=>{setQ(e.target.value);}}
            placeholder="Rechercher documents, utilisateurs, workflows, délégations…"
            style={{flex:1,border:"none",outline:"none",fontSize:16,fontFamily:"'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",color:"#0f172a",background:"transparent"}}
          />
          {q&&<button onClick={()=>setQ("")} style={{border:"none",background:"#f1f5f9",borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:12,fontWeight:700,color:"#64748b",fontFamily:"inherit"}}>✕</button>}
          <kbd style={{padding:"3px 8px",borderRadius:6,border:`1px solid ${BD}`,background:"#f8fafc",fontSize:11,fontWeight:700,color:"#64748b",fontFamily:"inherit",flexShrink:0}}>Esc</kbd>
        </div>

        {/* Results */}
        <div ref={listRef} style={{flex:1,overflowY:"auto",padding:"8px 0"}}>
          {q.trim()===("")&&(
            <div style={{padding:"32px 20px",textAlign:"center"}}>
              <div style={{fontSize:36,marginBottom:10}}>🔍</div>
              <div style={{fontSize:14,fontWeight:700,color:"#374151",marginBottom:6}}>Recherche globale</div>
              <div style={{fontSize:13,color:"#94a3b8",lineHeight:1.6}}>
                Tapez pour chercher dans les documents SoftSign & SoftDocs,<br/>les utilisateurs, les workflows, les délégations…
              </div>
              <div style={{display:"flex",justifyContent:"center",gap:10,marginTop:18,flexWrap:"wrap"}}>
                {["SS-2025","Contrat","Rakoto","Validation"].map(s=>(
                  <button key={s} onClick={()=>setQ(s)} style={{padding:"5px 12px",borderRadius:20,border:`1px solid ${BD}`,background:"#f8fafc",cursor:"pointer",fontSize:12,fontWeight:700,color:"#475569",fontFamily:"inherit"}}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {q.trim()!==("")&&total===0&&(
            <div style={{padding:"40px 20px",textAlign:"center"}}>
              <div style={{fontSize:36,marginBottom:10}}>🙁</div>
              <div style={{fontSize:14,fontWeight:700,color:"#374151",marginBottom:4}}>Aucun résultat pour « {q} »</div>
              <div style={{fontSize:13,color:"#94a3b8"}}>Essayez un autre terme ou vérifiez l'orthographe.</div>
            </div>
          )}

          {grps.map(group=>(
            <div key={group.key}>
              {/* Group header */}
              <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 18px 4px",position:"sticky",top:0,background:WH,zIndex:1}}>
                <span style={{fontSize:14}}>{group.icon}</span>
                <span style={{fontSize:11,fontWeight:900,letterSpacing:".1em",textTransform:"uppercase",color:"#94a3b8"}}>{group.label}</span>
                <span style={{fontSize:11,fontWeight:800,color:group.color,background:`${group.color}14`,border:`1px solid ${group.color}33`,borderRadius:20,padding:"1px 7px"}}>{group.items.length}</span>
                <div style={{flex:1,height:1,background:BD,marginLeft:4}}/>
              </div>

              {/* Items */}
              {group.items.map(item=>{
                const idx=flatIdx++;
                const isActive=idx===activeIdx;

                /* ── SoftSign doc ── */
                if(group.type==="ss-doc"){
                  const st=SS_STATUS_META[item.status]||{label:item.status,color:"#94a3b8",bg:"#f1f5f9"};
                  return(
                    <button key={item.id} data-active={isActive} onClick={()=>activateItem({...item,_type:"ss-doc"})}
                      style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"10px 18px",border:"none",background:isActive?"#f5f3ff":WH,cursor:"pointer",textAlign:"left",fontFamily:"inherit",transition:"background .1s"}}
                      onMouseEnter={e=>{e.currentTarget.style.background="#f5f3ff";setActiveIdx(idx);}}
                      onMouseLeave={e=>{e.currentTarget.style.background=isActive?"#f5f3ff":WH;}}>
                      <div style={{width:36,height:36,borderRadius:9,background:`${group.color}14`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:18}}>📄</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:800,color:"#0f172a",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                          <Highlight text={item.title} q={q}/>
                        </div>
                        <div style={{fontSize:11.5,color:"#64748b",marginTop:2,display:"flex",gap:8,flexWrap:"wrap"}}>
                          <span style={{fontWeight:700,color:group.color}}><Highlight text={item.ref} q={q}/></span>
                          {item.projectName&&<span><Highlight text={item.projectName} q={q}/></span>}
                          {item.site&&<span>{item.site}</span>}
                          {item.deposantName&&<span>par <Highlight text={item.deposantName} q={q}/></span>}
                        </div>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
                        <span style={{fontSize:11,fontWeight:800,padding:"2px 9px",borderRadius:20,background:st.bg,color:st.color}}>{st.label}</span>
                        {item.type&&<span style={{fontSize:10.5,color:"#94a3b8"}}>{SS_DOC_TYPES_MAP[item.type]||item.type}</span>}
                      </div>
                    </button>
                  );
                }

                /* ── SoftDocs doc ── */
                if(group.type==="sd-doc"){
                  return(
                    <button key={item.id} data-active={isActive} onClick={()=>activateItem({...item,_type:"sd-doc"})}
                      style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"10px 18px",border:"none",background:isActive?"#eff6ff":WH,cursor:"pointer",textAlign:"left",fontFamily:"inherit",transition:"background .1s"}}
                      onMouseEnter={e=>{e.currentTarget.style.background="#eff6ff";setActiveIdx(idx);}}
                      onMouseLeave={e=>{e.currentTarget.style.background=isActive?"#eff6ff":WH;}}>
                      <div style={{width:36,height:36,borderRadius:9,background:"#dbeafe",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:18}}>🗂</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:800,color:"#0f172a",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                          <Highlight text={item.fournisseur||item.ref||item.num} q={q}/>
                        </div>
                        <div style={{fontSize:11.5,color:"#64748b",marginTop:2}}>
                          {item.num&&<><span style={{fontWeight:700,color:"#2563eb"}}><Highlight text={item.num} q={q}/></span>&nbsp;·&nbsp;</>}
                          <Highlight text={item.type} q={q}/>
                          {item.montant&&<>&nbsp;·&nbsp;{item.montant}</>}
                        </div>
                      </div>
                      <span style={{fontSize:11,fontWeight:800,padding:"2px 9px",borderRadius:20,background:item.st==="EN RETARD"?"#fef2f2":item.st==="VALIDE"?"#ecfdf5":"#f8fafc",color:item.st==="EN RETARD"?"#dc2626":item.st==="VALIDE"?"#059669":"#94a3b8"}}>
                        {item.st||"—"}
                      </span>
                    </button>
                  );
                }

                /* ── User ── */
                if(group.type==="user"){
                  const roleColors={superadmin:"#6d3fd7",admin:"#2563eb",standard:"#059669",readonly:"#94a3b8"};
                  const roleMeta={superadmin:"Super Admin",admin:"Admin",standard:"Standard",readonly:"Lecture seule"};
                  const roleId=item.systemRole||item.role||"standard";
                  const rc=roleColors[roleId]||"#64748b";
                  const initials=item.nom?.split(" ").map(p=>p[0]).join("").slice(0,2).toUpperCase()||"?";
                  return(
                    <button key={item.id} data-active={isActive} onClick={()=>activateItem({...item,_type:"user"})}
                      style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"10px 18px",border:"none",background:isActive?"#eff6ff":WH,cursor:"pointer",textAlign:"left",fontFamily:"inherit",transition:"background .1s"}}
                      onMouseEnter={e=>{e.currentTarget.style.background="#eff6ff";setActiveIdx(idx);}}
                      onMouseLeave={e=>{e.currentTarget.style.background=isActive?"#eff6ff":WH;}}>
                      <div style={{width:36,height:36,borderRadius:"50%",background:`${rc}22`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:13,fontWeight:900,color:rc}}>{initials}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:800,color:"#0f172a"}}><Highlight text={item.nom} q={q}/></div>
                        <div style={{fontSize:11.5,color:"#64748b",marginTop:2}}><Highlight text={item.email} q={q}/></div>
                      </div>
                      <span style={{fontSize:11,fontWeight:800,padding:"2px 9px",borderRadius:20,background:`${rc}14`,color:rc,border:`1px solid ${rc}33`}}>{roleMeta[roleId]||roleId}</span>
                    </button>
                  );
                }

                /* ── Workflow ── */
                if(group.type==="workflow"){
                  return(
                    <button key={item.id} data-active={isActive} onClick={()=>activateItem({...item,_type:"workflow"})}
                      style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"10px 18px",border:"none",background:isActive?"#f0fdf4":WH,cursor:"pointer",textAlign:"left",fontFamily:"inherit",transition:"background .1s"}}
                      onMouseEnter={e=>{e.currentTarget.style.background="#f0fdf4";setActiveIdx(idx);}}
                      onMouseLeave={e=>{e.currentTarget.style.background=isActive?"#f0fdf4":WH;}}>
                      <div style={{width:36,height:36,borderRadius:9,background:"#dcfce7",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:18}}>🔄</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:800,color:"#0f172a"}}><Highlight text={item.name} q={q}/></div>
                        <div style={{fontSize:11.5,color:"#64748b",marginTop:2}}>{item.steps?.length||0} étapes{item.description?` · ${item.description}`:""}</div>
                      </div>
                      <span style={{fontSize:11,fontWeight:800,padding:"2px 9px",borderRadius:20,background:item.active?"#dcfce7":"#f1f5f9",color:item.active?"#059669":"#94a3b8"}}>{item.active?"Actif":"Inactif"}</span>
                    </button>
                  );
                }

                /* ── Delegation ── */
                if(group.type==="delegation"){
                  const today=new Date().toISOString().slice(0,10);
                  const active=item.active&&item.startDate<=today&&item.endDate>=today;
                  return(
                    <button key={item.id} data-active={isActive} onClick={()=>activateItem({...item,_type:"delegation"})}
                      style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"10px 18px",border:"none",background:isActive?"#fffbeb":WH,cursor:"pointer",textAlign:"left",fontFamily:"inherit",transition:"background .1s"}}
                      onMouseEnter={e=>{e.currentTarget.style.background="#fffbeb";setActiveIdx(idx);}}
                      onMouseLeave={e=>{e.currentTarget.style.background=isActive?"#fffbeb":WH;}}>
                      <div style={{width:36,height:36,borderRadius:9,background:"#fef3c7",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:18}}>🤝</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:800,color:"#0f172a",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                          <Highlight text={item.delegantName} q={q}/> → <Highlight text={item.delegataireName} q={q}/>
                        </div>
                        <div style={{fontSize:11.5,color:"#64748b",marginTop:2}}>{item.startDate} — {item.endDate}{item.comment?` · ${item.comment}`:""}</div>
                      </div>
                      <span style={{fontSize:11,fontWeight:800,padding:"2px 9px",borderRadius:20,background:active?"#dcfce7":"#f1f5f9",color:active?"#059669":"#94a3b8"}}>{active?"Actif":"Inactif"}</span>
                    </button>
                  );
                }
                return null;
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{padding:"10px 18px",borderTop:`1px solid ${BD}`,background:"#f8fafc",display:"flex",alignItems:"center",gap:16,flexShrink:0}}>
          <div style={{display:"flex",gap:10,fontSize:11,color:"#94a3b8"}}>
            {[["↑↓","Naviguer"],["↵","Ouvrir"],["Esc","Fermer"]].map(([k,l])=>(
              <span key={k} style={{display:"flex",alignItems:"center",gap:4}}>
                <kbd style={{padding:"2px 6px",borderRadius:4,border:`1px solid #e2e8f0`,background:WH,fontSize:10,fontWeight:700,color:"#475569"}}>{k}</kbd>
                {l}
              </span>
            ))}
          </div>
          {total>0&&<span style={{marginLeft:"auto",fontSize:11.5,fontWeight:700,color:"#64748b"}}>{total} résultat{total>1?"s":""}</span>}
        </div>
      </div>
    </div>
  );
}

const VIEW_LABELS_FR={
  dashboard:"Tableau de bord",depot:"Déposer un document",suivi:"Suivi document",
  detail:"Détail document",liq:"Liquidations",paiements:"Paiements XML",
  users:"Utilisateurs & droits",param_types:"Types de documents",param_recv:"Receveurs",
  champs_dyn:"Champs dynamiques globaux",etats:"États & Rapports",dashboard_stats:"Stats & KPIs",
  "ep-dashboard":"Tableau de bord","ep-liq":"Liquidations","ep-liste-paiements":"Liste des paiements",
  "ep-xml":"Génération fichier banque","ep-nature-remise":"Nature de remise",
  "ep-balise-xml":"Balise XML","ep-mappage-xml":"Mappage XML — Banques",
  "ss-dashboard":"Tableau de bord","ss-depot":"Depot interne","ss-docs-my":"Mes documents",
  "ss-docs-to-treat":"Documents a traiter","ss-docs-received":"Documents recus",
  "ss-docs-progress":"Documents en cours","ss-docs-internal":"Documents internes",
  "ss-docs-external":"Documents externes","ss-search":"Recherche globale","ss-license":"Licence & quotas",
  "ss-tous-docs":"Tous les documents","ss-internes":"Documents internes",
  "ss-externes":"Documents externes","ss-en-validation":"En validation","ss-signes":"Documents signés",
  "ss-rejetes":"Documents rejetés","ss-archives":"Documents archivés","ss-certificats":"Documents archivés","ss-signature":"À signer",
  "ss-devis-recus":"Devis reçus","ss-devis-en-val":"Devis en validation","ss-contrats":"Contrats",
  "ss-validation":"Validation","ss-mailbox":"Boite de reception","ss-wf-modeles":"Workflow","ss-portail":"Validation fournisseurs","ss-external-accounts":"Validation fournisseurs",
  "ss-notif":"Notifications","ss-rapports":"Rapports & statistiques","ss-rapports-validateurs":"Situation par validateur","ss-rapports-expediteurs":"Situation par expéditeur","ss-admin-users":"Utilisateurs",
  "ss-roles":"Roles & permissions","ss-param-sign":"Signatures & paraphes",
  "ss-param-otp":"Parametres OTP","ss-param-wf":"Parametres workflows",
  "ss-journaux":"Audit & journaux","ss-delegations":"Delegations",
  "ss-integr-softdocs":"Integration Softdocs","ss-upload":"Déposer un document",
  "softsign-import":"Documents SoftSign",
  "budget-dashboard":"Tableau de bord","budget-budgets":"Budgets",
  "budget-engagements":"Engagements","budget-depenses":"Depenses",
  "budget-validations":"Validations","budget-alertes":"Alertes & controle",
  "budget-parametrage":"Parametrage","budget-referentiel":"Referentiel PDF",
  "budget-planning":"Construction budget","budget-workflow":"Workflow avance",
  "budget-reporting":"Reporting","budget-projects":"Projets & CAPEX",
  "budget-integrations":"Integrations","budget-security":"Securite & acces",
  "budget-forecast":"Prevision IA","budget-consolidation":"Consolidation",
  "budget-admin":"Admin entreprise",
};
const VIEW_LABELS_EN={
  ...VIEW_LABELS_FR,
  dashboard:"Dashboard",depot:"Submit document",suivi:"Track document",
  detail:"Document detail",liq:"Liquidations",paiements:"XML Payments",
  users:"Users & rights",param_types:"Document types",param_recv:"Recipients",
  champs_dyn:"Dynamic fields",etats:"Reports",dashboard_stats:"Stats & KPIs",
  "ep-dashboard":"EP Dashboard","ep-liq":"Liquidations","ep-liste-paiements":"Payment List",
  "ep-xml":"Generate Bank File","ep-nature-remise":"Remittance Type",
  "ep-balise-xml":"XML Tags","ep-mappage-xml":"Bank Mapping",
};

const FLAG={fr:"🇫🇷",en:"🇬🇧"};
const LANG_LABEL={fr:"FR",en:"EN"};

function AppSwitcher({currentApp,setCurrentApp,setView,compact}){
  const[open,setOpen]=useState(false);
  const defaultView=(appId)=>appId==="softdocs"?"dashboard":appId==="softlibrary"?"lib-dashboard":appId==="softsign"?"ss-dashboard":appId==="softbudget"?"budget-dashboard":"ep-dashboard";
  const apps=[
    {id:"softdocs",  name:"SoftDocs",       sub:"GED & Finances",          color:"#324372",logo:"/softdocs-logo-final.png"},
    {id:"epaiement", name:"Soft e-Payment", sub:"Liquidations & Paiements",color:"#2a2d8f",logo:"/softepayment-logo.png"},
    {id:"softlibrary",name:"Soft Library",  sub:"Archives Physiques",      color:"#0c4a6e",logo:"/softlibrary.png"},
    {id:"softsign",  name:"SoftSign",       sub:"Signature & Validation",  color:"#4c1d95",logo:"/softsign.png"},
    {id:"softbudget",name:"SoftBudget",     sub:"Budgets & Engagements",   color:"#0f766e",logo:"/softbudget-logo.svg"},
  ];
  const cur=apps.find(a=>a.id===currentApp)||apps[0];
  return(
    <div style={{position:"relative",flexShrink:0}}>
      <button onClick={()=>setOpen(p=>!p)}
        style={{display:"inline-flex",alignItems:"center",gap:compact?4:8,padding:compact?"5px 8px":"6px 12px",borderRadius:6,border:"1px solid #e3e6ea",background:"#f8f9fc",cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}
        onMouseEnter={e=>e.currentTarget.style.background="#eef1f8"}
        onMouseLeave={e=>e.currentTarget.style.background="#f8f9fc"}>
        <img src={cur.logo} alt="SD" style={{height:compact?16:18,objectFit:"contain",flexShrink:0}}/>
        {!compact&&(
          <div style={{lineHeight:1.1}}>
            <span style={{fontSize:12.5,fontWeight:700,color:cur.color,display:"block"}}>{cur.name}</span>
            <span style={{fontSize:8.5,color:"#94a3b8",fontStyle:"italic"}}>by Softwell</span>
          </div>
        )}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#6c757d" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      {open&&(
        <div style={{position:"absolute",left:0,top:42,background:"#fff",border:"1px solid #e3e6ea",borderRadius:8,boxShadow:"0 8px 24px rgba(0,0,0,.12)",zIndex:9999,minWidth:220,overflow:"hidden"}}>
          <div style={{padding:"8px 14px",borderBottom:"1px solid #f0f2f5",fontSize:10.5,fontWeight:700,color:"#6c757d",textTransform:"uppercase",letterSpacing:".08em"}}>Changer d'application</div>
          {apps.map(a=>(
            <button key={a.id} onClick={()=>{setCurrentApp(a.id);setView(defaultView(a.id));setOpen(false);}}
              style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"10px 14px",border:"none",background:currentApp===a.id?"#f0f7ff":"transparent",cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}
              onMouseEnter={e=>e.currentTarget.style.background=currentApp===a.id?"#e8f2ff":"#f8f9fc"}
              onMouseLeave={e=>e.currentTarget.style.background=currentApp===a.id?"#f0f7ff":"transparent"}>
              <div style={{width:32,height:32,borderRadius:8,background:"#f0f4ff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,padding:4}}>
                <img src={a.logo} alt={a.name} style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain"}}/>
              </div>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:"#212529"}}>{a.name}</div>
                <div style={{fontSize:10,color:"#6c757d"}}>{a.sub}</div>
              </div>
              {currentApp===a.id&&<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={a.color} strokeWidth="2.5" strokeLinecap="round" style={{marginLeft:"auto"}}><polyline points="20 6 9 17 4 12"/></svg>}
            </button>
          ))}
          <div style={{padding:"8px",borderTop:"1px solid #f0f2f5"}}>
            <button onClick={()=>{setCurrentApp("home");setOpen(false);}}
              style={{width:"100%",padding:"7px 10px",borderRadius:6,border:"none",background:"#f8f9fc",cursor:"pointer",fontSize:12,fontWeight:600,color:"#6c757d",fontFamily:"inherit"}}>
              ⊞ Accueil — toutes les applications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function Topbar(){
  const{view,setView,setSidebarOpen,sidebarOpen,docs,lang,changeLang,authUser,logout,currentApp,setCurrentApp}=useApp();
  const isEP=currentApp==="epaiement";
  const t=useT(lang);
  const VIEW_LABELS=lang==="en"?VIEW_LABELS_EN:VIEW_LABELS_FR;
  const[notifOpen,setNotifOpen]=useState(false);
  const[langOpen,setLangOpen]=useState(false);
  const[mobileSearch,setMobileSearch]=useState(false);
  const[searchOpen,setSearchOpen]=useState(false);
  const retards=docs.filter(d=>d.st==="EN RETARD").length;
  const isMobile=useIsMobile();

  /* Ctrl+K / Cmd+K shortcut */
  useEffect(()=>{
    const handler=(e)=>{if((e.ctrlKey||e.metaKey)&&e.key==="k"){e.preventDefault();setSearchOpen(true);}};
    window.addEventListener("keydown",handler);
    return()=>window.removeEventListener("keydown",handler);
  },[]);

  const crumbs=[{l:t.dashboard,v:"dashboard"}];
  const docMenu=DOC_MENUS.find(m=>m.id===view);
  if(docMenu)     {crumbs.push({l:t.documents,v:null},{l:docMenu.label,v:null});}
  else if(view==="liq"||view==="paiements"){crumbs.push({l:t.financier,v:null},{l:VIEW_LABELS[view],v:null});}
  else if(["users","param_types","param_recv","champs_dyn"].includes(view)){crumbs.push({l:t.parametrage,v:null},{l:VIEW_LABELS[view]||t.champsDyn,v:null});}
  else if(view==="etats"||view==="dashboard_stats"){crumbs.push({l:t.etatsRapports,v:null},{l:VIEW_LABELS[view]||"Stats & KPIs",v:null});}
  else if(view==="ep-dashboard"){crumbs.push({l:"Soft e-Payment",v:null},{l:VIEW_LABELS["ep-dashboard"],v:null});}
  else if(view&&view.startsWith("ep-")){
    const sec=view.startsWith("ep-nature")||view.startsWith("ep-balise")||view.startsWith("ep-mappage")
      ?(lang==="en"?"EP Settings":t.parametrageEP||"Paramétrage")
      :view.startsWith("ep-liq")?"Liquidations"
      :"Paiements";
    crumbs.push({l:"Soft e-Payment",v:null},{l:sec,v:null},{l:VIEW_LABELS[view]||view,v:null});
  }
  else if(view&&view.startsWith("ss-")){crumbs.push({l:"SoftSign",v:null},{l:VIEW_LABELS[view]||view,v:null});}
  else if(view&&view.startsWith("budget-")){crumbs.push({l:"SoftBudget",v:null},{l:VIEW_LABELS[view]||view,v:null});}
  else if(view!=="dashboard"){crumbs.push({l:VIEW_LABELS[view]||view,v:null});}

  return(
    <header>
      {/* Top navbar */}
      <div style={{background:WH,borderBottom:`1px solid ${BD}`,height:isMobile?50:56,display:"flex",alignItems:"center",padding:isMobile?"0 10px":"0 20px",gap:isMobile?6:12,flexShrink:0,boxShadow:"0 1px 0 rgba(0,0,0,.05)"}}>
        {/* Sidebar toggle */}
        <button onClick={()=>setSidebarOpen(!sidebarOpen)}
          style={{background:"none",border:"none",color:MUT,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",width:36,height:36,borderRadius:4,transition:TR,flexShrink:0}}
          onMouseEnter={e=>e.currentTarget.style.background="#f0f2f5"}
          onMouseLeave={e=>e.currentTarget.style.background="none"}>
          <span style={{display:"flex"}}>{IC.menu}</span>
        </button>

        {/* App Switcher */}
        <AppSwitcher currentApp={currentApp} setCurrentApp={setCurrentApp} setView={setView} compact={isMobile}/>

        {/* Global search trigger */}
        {!isMobile&&(
          <button onClick={()=>setSearchOpen(true)}
            style={{flex:1,maxWidth:340,display:"flex",alignItems:"center",gap:8,padding:"7px 12px 7px 12px",border:"1px solid #e3e6ea",borderRadius:20,background:"#f8f9fc",cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}
            onMouseEnter={e=>{e.currentTarget.style.background="#eef1f8";e.currentTarget.style.borderColor="#c5ccd6";}}
            onMouseLeave={e=>{e.currentTarget.style.background="#f8f9fc";e.currentTarget.style.borderColor="#e3e6ea";}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#adb5bd" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <span style={{fontSize:13,color:"#adb5bd",flex:1}}>{lang==="en"?"Search…":"Rechercher…"}</span>
            <kbd style={{fontSize:10.5,fontWeight:700,color:"#94a3b8",background:WH,border:"1px solid #e3e6ea",borderRadius:5,padding:"1px 6px",fontFamily:"inherit",flexShrink:0}}>Ctrl K</kbd>
          </button>
        )}
        {isMobile&&<div style={{flex:1}}/>}

        <div style={{display:"flex",alignItems:"center",gap:isMobile?4:8,marginLeft:isMobile?0:"auto",flexShrink:0}}>
          {/* Mobile search toggle */}
          {isMobile&&(
            <button onClick={()=>setSearchOpen(true)}
              style={{background:"#f8f9fc",border:`1px solid ${BD}`,width:34,height:34,borderRadius:RSm,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:MUT}}>
              <span style={{display:"flex"}}>{IC.search}</span>
            </button>
          )}

          {/* Retards alert - compact on mobile */}
          {retards>0&&(
            <span style={{...bdg(DNGL,DNGD,{fontSize:isMobile?10:12}),display:"inline-flex",alignItems:"center",gap:4,padding:isMobile?"2px 6px":undefined}}>
              <span style={{display:"flex"}}>{IC.alertTri}</span> {retards}{!isMobile&&(retards>1?" retards":" retard")}
            </span>
          )}

          {/* Language toggle */}
          <div style={{position:"relative"}}>
            <button onClick={()=>setLangOpen(p=>!p)}
              style={{display:"inline-flex",alignItems:"center",gap:isMobile?3:5,padding:isMobile?"5px 8px":"6px 12px",borderRadius:RSm,border:`1px solid ${BD}`,background:"#f8f9fc",cursor:"pointer",fontSize:12.5,fontWeight:700,color:P,fontFamily:"inherit",transition:TR}}
              onMouseEnter={e=>e.currentTarget.style.background="#eef1f8"}
              onMouseLeave={e=>{if(!langOpen)e.currentTarget.style.background="#f8f9fc";}}>
              <span style={{fontSize:15}}>{FLAG[lang]}</span>{!isMobile&&LANG_LABEL[lang]}
            </button>
            {langOpen&&(
              <div style={{position:"absolute",right:0,top:38,background:WH,border:`1px solid ${BD}`,borderRadius:6,boxShadow:"0 4px 16px rgba(0,0,0,.1)",zIndex:999,overflow:"hidden",minWidth:120}}>
                {["fr","en"].map(l=>(
                  <button key={l} onClick={()=>{changeLang(l);setLangOpen(false);}}
                    style={{display:"flex",alignItems:"center",gap:8,padding:"9px 14px",background:lang===l?"#eef1f8":"transparent",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:lang===l?700:400,color:lang===l?P:"#495057",width:"100%",textAlign:"left"}}>
                    <span style={{fontSize:16}}>{FLAG[l]}</span>
                    {l==="fr"?"Français":"English"}
                    {lang===l&&<span style={{marginLeft:"auto",display:"flex",color:P}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div style={{position:"relative"}}>
            <button onClick={()=>setNotifOpen(!notifOpen)}
              style={{background:"#f8f9fc",border:`1px solid ${BD}`,color:MUT,width:34,height:34,borderRadius:RSm,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
              <span style={{display:"flex"}}>{IC.bell}</span>
              <span style={{position:"absolute",top:8,right:8,width:7,height:7,background:DNG,borderRadius:"50%"}}/>
            </button>
            {notifOpen&&(
              <div style={{position:"absolute",right:isMobile?-40:0,top:42,width:isMobile?290:320,background:WH,borderRadius:6,boxShadow:"0 8px 24px rgba(0,0,0,.12)",border:`1px solid ${BD}`,zIndex:999}}>
                <div style={{padding:"10px 16px",borderBottom:`1px solid ${BD}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <b style={{fontSize:13,color:"#212529"}}>{lang==="en"?"Notifications":"Notifications"}</b>
                  <button onClick={()=>setNotifOpen(false)} style={{background:"none",border:"none",cursor:"pointer",color:MUT,display:"flex"}}>{IC.x}</button>
                </div>
                {[
                  {m:"DOC-2025-004 — Délai dépassé, escalade envoyée",warn:true,t:"2h"},
                  {m:"Nouveau dépôt: TELMA SA reçu",warn:false,t:"4h"},
                  {m:"DOC-2025-003 en attente validation",warn:false,t:"1j"},
                ].map((n,i)=>(
                  <div key={i} style={{padding:"10px 16px",borderBottom:`1px solid ${BD}`,background:n.warn?"#fff8f8":WH,display:"flex",gap:10,alignItems:"flex-start"}}>
                    <span style={{display:"flex",color:n.warn?DNG:P,marginTop:2}}>{n.warn?IC.alertTri:IC.bell}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,color:"#212529",wordBreak:"break-word"}}>{n.m}</div>
                      <div style={{fontSize:11,color:MUT}}>Il y a {n.t}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Auth user + logout - compact on mobile */}
          {!isMobile&&(
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{display:"flex",alignItems:"center",gap:8,padding:"5px 10px",borderRadius:RSm,border:`1px solid ${BD}`,transition:TR}}
                onMouseEnter={e=>e.currentTarget.style.background="#f8f9fc"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div style={{width:28,height:28,borderRadius:"50%",background:P,color:WH,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:11}}>
                  {authUser?.init||"?"}
                </div>
                <div style={{lineHeight:1.2}}>
                  <div style={{fontSize:12,fontWeight:600,color:"#212529",maxWidth:110,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{authUser?.nom||"Admin"}</div>
                  <div style={{fontSize:10.5,color:MUT}}>{authUser?.role||"Admin"}</div>
                </div>
              </div>
              <button onClick={logout} title={lang==="en"?"Sign out":"Déconnexion"}
                style={{background:"none",border:`1px solid ${BD}`,borderRadius:RSm,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:MUT,transition:TR}}
                onMouseEnter={e=>{e.currentTarget.style.background="#fff0f0";e.currentTarget.style.color="#dc3545";e.currentTarget.style.borderColor="#dc3545";}}
                onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color=MUT;e.currentTarget.style.borderColor=BD;}}>
                {IC.logout}
              </button>
            </div>
          )}
          {isMobile&&(
            <button onClick={logout} title="Déconnexion"
              style={{background:"none",border:`1px solid ${BD}`,borderRadius:RSm,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:MUT}}>
              {IC.logout}
            </button>
          )}
        </div>
      </div>

      {/* Global search overlay */}
      <GlobalSearchOverlay open={searchOpen} onClose={()=>setSearchOpen(false)} setView={setView} setCurrentApp={setCurrentApp}/>

      {/* Breadcrumb - simplified on mobile */}
      <div style={{background:"#f8f9fc",borderBottom:`1px solid ${BD}`,padding:isMobile?"6px 12px":"7px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0,overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
        <div style={{display:"flex",alignItems:"center",gap:6,fontSize:isMobile?11:12.5,color:MUT,whiteSpace:"nowrap"}}>
          {(isMobile?crumbs.slice(-2):crumbs).map((c,i)=>(
            <span key={i} style={{display:"flex",alignItems:"center",gap:6}}>
              {i>0&&<span style={{color:"#ced4da"}}>›</span>}
              {c.v?(
                <span style={{display:"inline-flex",alignItems:"center",gap:4,color:P,cursor:"pointer",fontWeight:500}} onClick={()=>setView(c.v)}>
                  {i===0&&<span style={{display:"flex"}}>{IC.home}</span>} {c.l}
                </span>
              ):(
                <span style={{color:"#495057"}}>{c.l}</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
