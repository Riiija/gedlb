"use client";
import{useState,useEffect,useRef}from"react";
import{Modal}from"../ui/Modal";
import{Badge,Avatar}from"../ui/Badge";
import{IC}from"../ui/Icons";
import{card,btn,inp,bdg,P,WH,BD,MUT,SUC,SUCL,SUCD,DNG,DNGL,DNGD,WRN,WRNL,WRND,R,RSm,TR}from"../../lib/theme";
import{fmtN,now}from"../../lib/utils";
import{useApp}from"../../context/AppContext";
import{ValidationModal,ConfirmRejetModal}from"./ValidationModal";
import{RedirectionModal}from"./RedirectionModal";
import{getActiveStep,actionValider,actionRejeter,actionRediriger}from"../../lib/workflow";
import SSSignatureViewer from"../softsign/SSSignatureViewer";
import{INIT_SS_DELEGATIONS_PRO,INIT_SS_WORKFLOWS_PRO,SS_DOC_TYPES,createSoftSignDocument,suggestWorkflow}from"../softsign/softsignCore";

const STEP_IC={VALIDÉ:IC.checkCircle,REJETÉ:IC.xCircle,"EN RETARD":IC.alertTri,"EN ATTENTE":IC.clock};
const STEP_COL={VALIDÉ:{bg:SUCL,fg:SUCD},REJETÉ:{bg:DNGL,fg:DNGD},"EN RETARD":{bg:WRNL,fg:WRND},"EN ATTENTE":{bg:"#e9ecef",fg:MUT}};

const TABS=[
  {k:"circuit",   label:"Circuit",     icon:IC.refresh},
  {k:"ocr",       label:"OCR",         icon:IC.robot},
  {k:"annexes",   label:"Annexes",     icon:IC.paperclip},
  {k:"historique",label:"Historique",  icon:IC.scroll},
  {k:"apercu",    label:"Aperçu",      icon:IC.file},
];
/* ═══════════════════════════════════════════════════════════════
   APERÇU DOCUMENT — Prévisualisation PDF intelligente
   ─────────────────────────────────────────────────────────────
   Templates : Facture, Bon de commande, Contrat, Note de frais,
               Bordereau, Rapport/PV, Avenant, Générique
   Lazy loading + zoom + OCR data overlay
═══════════════════════════════════════════════════════════════ */
function DocPreviewPanel({doc}){
  const[zoom,setZoom]=useState(1);
  const[loaded,setLoaded]=useState(false);
  const ref=useRef(null);

  /* Lazy loading effect */
  useEffect(()=>{
    setLoaded(false);
    const t=setTimeout(()=>setLoaded(true),350+Math.random()*300);
    return()=>clearTimeout(t);
  },[doc?.id]);

  const formatDate=(d)=>{
    if(!d)return"—";
    try{return new Date(d).toLocaleDateString("fr-FR",{day:"2-digit",month:"long",year:"numeric"});}
    catch{return d;}
  };

  const ch=doc.ch||{};
  const isConf=!!doc.conf;
  const mt=doc.mtR||doc.mt||0;

  /* ── Template detection ── */
  const getTemplate=()=>{
    const t=(doc.type||"").toLowerCase();
    if(t.includes("facture"))return"facture";
    if(t.includes("bon de commande")||t.includes("bc "))return"bc";
    if(t.includes("note de frais")||t.includes("note frais"))return"frais";
    if(t.includes("bordereau")||t.includes("livraison"))return"bordereau";
    if(t.includes("contrat")||t.includes("convention")||t.includes("marché"))return"contrat";
    if(t.includes("avenant"))return"avenant";
    if(t.includes("rapport")||t.includes("pv ")||t.includes("procès"))return"rapport";
    if(t.includes("devis")||t.includes("proforma"))return"devis";
    if(t.includes("lettre")||t.includes("correspond"))return"courrier";
    if(t.includes("ordonnance")||t.includes("mandat"))return"mandat";
    return"generique";
  };
  const template=getTemplate();

  /* ── Shared styles ── */
  const PAGE={
    width:"100%",maxWidth:680,margin:"0 auto",
    background:"#fff",borderRadius:3,position:"relative",
    boxShadow:"0 2px 20px rgba(0,0,0,.12), 0 0 1px rgba(0,0,0,.15)",
    padding:48,fontFamily:"'Times New Roman','Georgia',serif",
    color:"#1a1a1a",lineHeight:1.6,fontSize:13,
    minHeight:860,
    transform:`scale(${zoom})`,transformOrigin:"top center",
    transition:"transform .2s",
  };
  const HR={border:"none",borderTop:"1.5px solid #1a1a1a",margin:"14px 0"};
  const HR_L={border:"none",borderTop:"1px solid #ccc",margin:"12px 0"};
  const HDR={textAlign:"center",marginBottom:24};
  const COMPANY={fontSize:18,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",margin:0,fontFamily:"'Georgia',serif"};
  const SUB={fontSize:10,color:"#666",margin:"2px 0 0",letterSpacing:.5};
  const DTITLE={fontSize:16,fontWeight:700,textTransform:"uppercase",textAlign:"center",margin:"18px 0 8px",letterSpacing:1};
  const LBL={fontSize:11,color:"#666",marginBottom:1};
  const VAL={fontSize:13,fontWeight:500};
  const FROW={display:"flex",justifyContent:"space-between",marginBottom:6,flexWrap:"wrap",gap:4};
  const SEC_T={fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:.5,borderBottom:"1px solid #999",paddingBottom:3,marginBottom:10,marginTop:18};
  const BODY={fontSize:12,lineHeight:1.7,textAlign:"justify",color:"#333"};
  const GRAYB={background:"#f5f5f5",padding:"10px 14px",borderRadius:3,marginBottom:8};

  const lorem=(n=4)=>(
    <div style={BODY}>{Array.from({length:n}).map((_,i)=>(
      <div key={i} style={{height:10,background:"#e8e8e8",borderRadius:2,marginBottom:6,width:`${85+Math.sin(i*2.3)*15}%`}}/>
    ))}</div>
  );

  const companyHeader=()=>(
    <div style={HDR}>
      <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:12,marginBottom:6}}>
        <div style={{width:36,height:36,borderRadius:"50%",border:"2px solid #1a1a1a",
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,fontFamily:"Arial,sans-serif"}}>SW</div>
        <div>
          <p style={COMPANY}>SOFTWELL MADAGASCAR</p>
          <p style={SUB}>Société de Services & Solutions Informatiques</p>
        </div>
      </div>
      <p style={{fontSize:9,color:"#888",margin:0}}>
        Lot IVG 12 Bis, Analakely — Antananarivo 101 — Madagascar — Tél: +261 20 22 123 45
      </p>
    </div>
  );

  const watermark=()=>isConf?(
    <div style={{position:"absolute",top:"40%",left:"50%",transform:"translate(-50%,-50%) rotate(-35deg)",
      fontSize:52,fontWeight:900,color:"rgba(220,38,38,.07)",letterSpacing:8,
      textTransform:"uppercase",pointerEvents:"none",whiteSpace:"nowrap",fontFamily:"Arial,sans-serif"}}>CONFIDENTIEL</div>
  ):null;

  const footer=(page=1)=>(
    <div style={{position:"absolute",bottom:24,left:0,right:0,textAlign:"center",fontSize:9,color:"#999",fontFamily:"Arial,sans-serif"}}>
      <hr style={{border:"none",borderTop:".5px solid #ddd",margin:"0 48px 6px"}}/>
      {doc.id} — {doc.type} — Page {page}/1
    </div>
  );

  const bapStamp=()=>doc.bap?(
    <div style={{position:"absolute",top:80,right:40,transform:"rotate(12deg)",
      border:"4px solid #16a34a",borderRadius:8,padding:"6px 16px",opacity:.6}}>
      <div style={{fontFamily:"Arial,sans-serif",fontWeight:900,fontSize:16,color:"#16a34a",letterSpacing:2}}>BON À PAYER</div>
      <div style={{fontFamily:"Arial,sans-serif",fontSize:8,color:"#16a34a",textAlign:"center"}}>{formatDate(doc.date)}</div>
    </div>
  ):null;

  const rejetStamp=()=>doc.st==="REJETÉ"?(
    <div style={{position:"absolute",top:80,right:40,transform:"rotate(-8deg)",
      border:"4px solid #dc2626",borderRadius:8,padding:"6px 16px",opacity:.5}}>
      <div style={{fontFamily:"Arial,sans-serif",fontWeight:900,fontSize:16,color:"#dc2626",letterSpacing:2}}>REJETÉ</div>
    </div>
  ):null;

  const MetaRow=({label,value:v})=>v?(<div style={FROW}><span style={LBL}>{label} :</span><span style={VAL}>{v}</span></div>):null;

  /* ═══════════ TEMPLATES ═══════════ */

  /* ── FACTURE ── */
  const renderFacture=()=>(
    <div style={PAGE}>
      {watermark()}{bapStamp()}{rejetStamp()}
      {companyHeader()}
      <hr style={HR}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14,flexWrap:"wrap",gap:12}}>
        <div>
          <div style={{fontSize:22,fontWeight:800,letterSpacing:2,fontFamily:"Arial"}}>FACTURE</div>
          <div style={{fontSize:11,color:"#666",marginTop:2}}>N° {ch.numero||doc.id}</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={LBL}>Date d'émission</div>
          <div style={{fontSize:14,fontWeight:700}}>{formatDate(ch.date_doc||doc.date)}</div>
        </div>
      </div>

      <div style={{display:"flex",gap:20,marginBottom:20,flexWrap:"wrap"}}>
        <div style={{...GRAYB,flex:1,minWidth:180}}>
          <div style={{fontSize:10,fontWeight:700,color:"#888",textTransform:"uppercase",marginBottom:4}}>Émetteur / Fournisseur</div>
          <div style={{fontSize:12,fontWeight:600}}>{ch.emetteur||doc.fourn||"—"}</div>
          {ch.nif&&<div style={{fontSize:10,color:"#666",marginTop:2}}>NIF : {ch.nif}</div>}
          {ch.iban&&<div style={{fontSize:10,color:"#666"}}>IBAN : {ch.iban}</div>}
        </div>
        <div style={{...GRAYB,flex:1,minWidth:180}}>
          <div style={{fontSize:10,fontWeight:700,color:"#888",textTransform:"uppercase",marginBottom:4}}>Destinataire</div>
          <div style={{fontSize:12,fontWeight:600}}>Softwell Madagascar</div>
          <div style={{fontSize:10,color:"#666"}}>Site : {doc.site||"—"}</div>
          {doc.proj&&<div style={{fontSize:10,color:"#666"}}>Projet : {doc.proj}</div>}
        </div>
      </div>

      {/* Tableau facture */}
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:11,marginTop:10}}>
        <thead>
          <tr style={{background:"#1a1a1a",color:"#fff"}}>
            <th style={{padding:"8px 10px",textAlign:"left",fontWeight:600}}>Désignation</th>
            <th style={{padding:"8px 10px",textAlign:"center",fontWeight:600,width:50}}>Qté</th>
            <th style={{padding:"8px 10px",textAlign:"right",fontWeight:600,width:100}}>P.U. (MGA)</th>
            <th style={{padding:"8px 10px",textAlign:"right",fontWeight:600,width:110}}>Montant (MGA)</th>
          </tr>
        </thead>
        <tbody>
          {[
            {desc:`${doc.type||"Prestation"} — ${doc.fourn||"Fournisseur"}`,qty:1,pu:mt,total:mt},
            {desc:"Frais de traitement administratif",qty:1,pu:Math.round(mt*0.05)||50000,total:Math.round(mt*0.05)||50000},
          ].map((l,i)=>(
            <tr key={i} style={{borderBottom:"1px solid #eee"}}>
              <td style={{padding:"8px 10px"}}>{l.desc}</td>
              <td style={{padding:"8px 10px",textAlign:"center"}}>{l.qty}</td>
              <td style={{padding:"8px 10px",textAlign:"right",fontFamily:"Courier New,monospace"}}>{l.pu?.toLocaleString?.("fr-FR")}</td>
              <td style={{padding:"8px 10px",textAlign:"right",fontFamily:"Courier New,monospace",fontWeight:600}}>{l.total?.toLocaleString?.("fr-FR")}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          {ch.ht&&<tr><td colSpan={3} style={{padding:"6px 10px",textAlign:"right",fontSize:11,color:"#666"}}>HT :</td>
            <td style={{padding:"6px 10px",textAlign:"right",fontFamily:"monospace"}}>{fmtN(parseFloat(ch.ht))}</td></tr>}
          {ch.tva&&<tr><td colSpan={3} style={{padding:"6px 10px",textAlign:"right",fontSize:11,color:"#666"}}>TVA (20%) :</td>
            <td style={{padding:"6px 10px",textAlign:"right",fontFamily:"monospace"}}>{fmtN(parseFloat(ch.tva))}</td></tr>}
          <tr style={{borderTop:"2px solid #1a1a1a"}}>
            <td colSpan={3} style={{padding:"10px",textAlign:"right",fontWeight:700,fontSize:12}}>TOTAL TTC :</td>
            <td style={{padding:"10px",textAlign:"right",fontWeight:800,fontSize:14,fontFamily:"Courier New,monospace"}}>
              {ch.total?fmtN(parseFloat(ch.total)):fmtN(mt)} MGA
            </td>
          </tr>
        </tfoot>
      </table>

      <div style={{marginTop:24,fontSize:10,color:"#888"}}>
        Arrêtée la présente facture à la somme indiquée ci-dessus.
      </div>
      <div style={{marginTop:30,textAlign:"right"}}>
        <div style={LBL}>Signature et cachet</div>
        <div style={{width:140,borderBottom:"1px solid #999",marginTop:36,display:"inline-block"}}/>
      </div>
      {footer()}
    </div>
  );

  /* ── BON DE COMMANDE ── */
  const renderBC=()=>(
    <div style={PAGE}>
      {watermark()}{bapStamp()}{rejetStamp()}
      {companyHeader()}
      <hr style={HR}/>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:8}}>
        <div>
          <div style={{fontSize:20,fontWeight:800,letterSpacing:2,fontFamily:"Arial",color:"#1a4a8a"}}>BON DE COMMANDE</div>
          <div style={{fontSize:11,color:"#666",marginTop:2}}>N° {doc.id}</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={LBL}>Date</div>
          <div style={VAL}>{formatDate(doc.date)}</div>
        </div>
      </div>

      <div style={{display:"flex",gap:16,marginBottom:20,flexWrap:"wrap"}}>
        <div style={{...GRAYB,flex:1,minWidth:180,borderLeft:"3px solid #1a4a8a"}}>
          <div style={{fontSize:10,fontWeight:700,color:"#888",textTransform:"uppercase",marginBottom:4}}>Donneur d'ordre</div>
          <div style={{fontSize:12,fontWeight:600}}>Softwell Madagascar</div>
          <div style={{fontSize:10,color:"#666"}}>Site : {doc.site||"Siège"}</div>
          {doc.proj&&<div style={{fontSize:10,color:"#666"}}>Projet : {doc.proj}</div>}
        </div>
        <div style={{...GRAYB,flex:1,minWidth:180,borderLeft:"3px solid #e67e22"}}>
          <div style={{fontSize:10,fontWeight:700,color:"#888",textTransform:"uppercase",marginBottom:4}}>Fournisseur</div>
          <div style={{fontSize:12,fontWeight:600}}>{doc.fourn||"—"}</div>
          <div style={{fontSize:10,color:"#666"}}>Réf. commande : {ch.numero||doc.id}</div>
        </div>
      </div>

      <div style={SEC_T}>Articles commandés</div>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
        <thead><tr style={{background:"#1a4a8a",color:"#fff"}}>
          <th style={{padding:"8px 10px",textAlign:"left",fontWeight:600}}>Désignation</th>
          <th style={{padding:"8px 10px",textAlign:"center",width:60}}>Qté</th>
          <th style={{padding:"8px 10px",textAlign:"right",width:100}}>P.U.</th>
          <th style={{padding:"8px 10px",textAlign:"right",width:110}}>Total</th>
        </tr></thead>
        <tbody>
          {Array.from({length:3}).map((_,i)=>(
            <tr key={i} style={{borderBottom:"1px solid #eee"}}>
              <td style={{padding:"8px 10px"}}>{i===0?`${doc.type} — Lot principal`:i===1?"Fournitures associées":"Transport et manutention"}</td>
              <td style={{padding:"8px 10px",textAlign:"center"}}>{[1,5,1][i]}</td>
              <td style={{padding:"8px 10px",textAlign:"right",fontFamily:"monospace"}}>{fmtN(Math.round(mt*(i===0?.8:i===1?.12:.08)))}</td>
              <td style={{padding:"8px 10px",textAlign:"right",fontFamily:"monospace",fontWeight:600}}>{fmtN(Math.round(mt*(i===0?.8:i===1?.12:.08)))}</td>
            </tr>
          ))}
        </tbody>
        <tfoot><tr style={{borderTop:"2px solid #1a4a8a"}}>
          <td colSpan={3} style={{padding:"10px",textAlign:"right",fontWeight:700}}>TOTAL TTC :</td>
          <td style={{padding:"10px",textAlign:"right",fontWeight:800,fontSize:14,fontFamily:"monospace"}}>{fmtN(mt)} MGA</td>
        </tr></tfoot>
      </table>

      <div style={{marginTop:20}}><div style={SEC_T}>Conditions</div>{lorem(3)}</div>

      <div style={{marginTop:30,display:"flex",justifyContent:"space-between"}}>
        <div style={{textAlign:"center"}}><div style={LBL}>Le demandeur</div><div style={{width:130,borderBottom:"1px solid #999",marginTop:36,marginBottom:4}}/></div>
        <div style={{textAlign:"center"}}><div style={LBL}>Visa DAF</div><div style={{width:130,borderBottom:"1px solid #999",marginTop:36,marginBottom:4}}/></div>
        <div style={{textAlign:"center"}}><div style={LBL}>Le Directeur Général</div><div style={{width:130,borderBottom:"1px solid #999",marginTop:36,marginBottom:4}}/></div>
      </div>
      {footer()}
    </div>
  );

  /* ── CONTRAT ── */
  const renderContrat=()=>(
    <div style={PAGE}>
      {watermark()}{rejetStamp()}
      {companyHeader()}
      <hr style={HR}/>
      <div style={DTITLE}>CONTRAT</div>
      <div style={{textAlign:"center",fontSize:13,fontWeight:600,marginBottom:16,color:"#333"}}>{doc.type} — {doc.fourn||"Prestataire"}</div>
      <hr style={HR_L}/>
      <MetaRow label="Référence" value={doc.id}/>
      <MetaRow label="Date" value={formatDate(doc.date)}/>
      <MetaRow label="Fournisseur / Co-contractant" value={doc.fourn}/>
      <MetaRow label="Site" value={doc.site}/>
      <MetaRow label="Montant contractuel" value={mt?`${fmtN(mt)} MGA`:null}/>
      {doc.proj&&<MetaRow label="Projet" value={doc.proj}/>}
      {doc.planCompte&&<MetaRow label="Imputation comptable" value={doc.planCompte}/>}

      <div style={SEC_T}>Article 1 — Objet</div>
      <p style={BODY}>Le présent contrat a pour objet de définir les conditions dans lesquelles <strong>{doc.fourn||"le prestataire"}</strong> s'engage
        à fournir les prestations relatives à <em>{doc.type?.toLowerCase()}</em>, conformément aux conditions ci-après définies.</p>
      {lorem(3)}
      <div style={SEC_T}>Article 2 — Durée et conditions financières</div>
      {lorem(4)}
      <div style={SEC_T}>Article 3 — Obligations des parties</div>
      {lorem(3)}

      <div style={{marginTop:30,display:"flex",justifyContent:"space-between"}}>
        <div style={{textAlign:"center"}}><div style={LBL}>Pour Softwell Madagascar</div><div style={{width:140,borderBottom:"1px solid #999",marginTop:40,marginBottom:4}}/><div style={{fontSize:11}}>Le Directeur Général</div></div>
        <div style={{textAlign:"center"}}><div style={LBL}>Pour {doc.fourn||"le co-contractant"}</div><div style={{width:140,borderBottom:"1px solid #999",marginTop:40,marginBottom:4}}/><div style={{fontSize:11}}>Le représentant légal</div></div>
      </div>
      {footer()}
    </div>
  );

  /* ── NOTE DE FRAIS ── */
  const renderFrais=()=>(
    <div style={PAGE}>
      {watermark()}{bapStamp()}{rejetStamp()}
      {companyHeader()}
      <hr style={HR}/>
      <div style={{...DTITLE,fontSize:15,border:"2px solid #1a1a1a",padding:"8px 16px",display:"inline-block",margin:"14px auto",textAlign:"center"}}>NOTE DE FRAIS</div>
      <div style={{textAlign:"center",fontSize:11,color:"#666",marginBottom:16}}>N° {doc.id} — {formatDate(doc.date)}</div>
      <MetaRow label="Bénéficiaire" value={doc.fourn||"Employé"}/>
      <MetaRow label="Service" value={doc.site}/>
      {doc.proj&&<MetaRow label="Projet / Mission" value={doc.proj}/>}
      <hr style={HR_L}/>

      <table style={{width:"100%",borderCollapse:"collapse",fontSize:11,marginTop:8}}>
        <thead><tr style={{background:"#f5f5f5",borderBottom:"2px solid #1a1a1a"}}>
          <th style={{padding:"8px 10px",textAlign:"left"}}>Date</th>
          <th style={{padding:"8px 10px",textAlign:"left"}}>Libellé</th>
          <th style={{padding:"8px 10px",textAlign:"right"}}>Montant (MGA)</th>
        </tr></thead>
        <tbody>
          {["Transport","Hébergement","Restauration","Divers"].map((l,i)=>(
            <tr key={i} style={{borderBottom:"1px solid #eee"}}>
              <td style={{padding:"7px 10px"}}>{formatDate(doc.date)}</td>
              <td style={{padding:"7px 10px"}}>{l}</td>
              <td style={{padding:"7px 10px",textAlign:"right",fontFamily:"monospace"}}>{fmtN(Math.round(mt*(i===0?.4:i===1?.3:i===2?.2:.1)))}</td>
            </tr>
          ))}
        </tbody>
        <tfoot><tr style={{borderTop:"2px solid #1a1a1a"}}>
          <td colSpan={2} style={{padding:"10px",textAlign:"right",fontWeight:700}}>TOTAL :</td>
          <td style={{padding:"10px",textAlign:"right",fontWeight:800,fontSize:14,fontFamily:"monospace"}}>{fmtN(mt)} MGA</td>
        </tr></tfoot>
      </table>

      <div style={{marginTop:20,display:"flex",gap:40}}>
        <div style={{textAlign:"center"}}><div style={LBL}>Le demandeur</div><div style={{width:130,borderBottom:"1px solid #999",marginTop:36}}/></div>
        <div style={{textAlign:"center"}}><div style={LBL}>Validation N+1</div><div style={{width:130,borderBottom:"1px solid #999",marginTop:36}}/></div>
        <div style={{textAlign:"center"}}><div style={LBL}>Visa DAF</div><div style={{width:130,borderBottom:"1px solid #999",marginTop:36}}/></div>
      </div>
      {footer()}
    </div>
  );

  /* ── BORDEREAU DE LIVRAISON ── */
  const renderBordereau=()=>(
    <div style={PAGE}>
      {watermark()}{rejetStamp()}
      {companyHeader()}
      <hr style={HR}/>
      <div style={{...DTITLE,color:"#2e7d32"}}>BORDEREAU DE LIVRAISON</div>
      <div style={{textAlign:"center",fontSize:11,color:"#666",marginBottom:16}}>N° {doc.id} — {formatDate(doc.date)}</div>
      <div style={{display:"flex",gap:16,marginBottom:16,flexWrap:"wrap"}}>
        <div style={{...GRAYB,flex:1,borderLeft:"3px solid #2e7d32"}}><div style={{fontSize:10,fontWeight:700,color:"#888",textTransform:"uppercase",marginBottom:4}}>Expéditeur</div><div style={{fontSize:12,fontWeight:600}}>{doc.fourn||"—"}</div></div>
        <div style={{...GRAYB,flex:1,borderLeft:"3px solid #1565c0"}}><div style={{fontSize:10,fontWeight:700,color:"#888",textTransform:"uppercase",marginBottom:4}}>Destinataire</div><div style={{fontSize:12,fontWeight:600}}>Softwell — {doc.site||"Siège"}</div></div>
      </div>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
        <thead><tr style={{background:"#2e7d32",color:"#fff"}}><th style={{padding:"8px 10px",textAlign:"left"}}>Désignation</th><th style={{padding:"8px 10px",textAlign:"center",width:60}}>Qté</th><th style={{padding:"8px 10px",textAlign:"center",width:80}}>État</th></tr></thead>
        <tbody>{["Lot principal — matériel","Accessoires et consommables","Documentation technique"].map((l,i)=>(
          <tr key={i} style={{borderBottom:"1px solid #eee"}}><td style={{padding:"8px 10px"}}>{l}</td><td style={{padding:"8px 10px",textAlign:"center"}}>{[1,5,2][i]}</td><td style={{padding:"8px 10px",textAlign:"center",color:"#2e7d32",fontWeight:600}}>✓ Conforme</td></tr>
        ))}</tbody>
      </table>
      <div style={{marginTop:16,...GRAYB,fontSize:11}}><strong>Observations :</strong> Livraison conforme au bon de commande. Aucune réserve.</div>
      <div style={{marginTop:30,display:"flex",justifyContent:"space-between"}}>
        <div style={{textAlign:"center"}}><div style={LBL}>Le livreur</div><div style={{width:130,borderBottom:"1px solid #999",marginTop:36}}/></div>
        <div style={{textAlign:"center"}}><div style={LBL}>Le réceptionnaire</div><div style={{width:130,borderBottom:"1px solid #999",marginTop:36}}/></div>
      </div>
      {footer()}
    </div>
  );

  /* ── RAPPORT / PV ── */
  const renderRapport=()=>(
    <div style={PAGE}>
      {watermark()}{rejetStamp()}
      {companyHeader()}
      <hr style={HR}/>
      <div style={DTITLE}>{doc.type?.toUpperCase()||"RAPPORT"}</div>
      <div style={{textAlign:"center",fontSize:12,fontWeight:600,marginBottom:4}}>{doc.fourn||doc.type}</div>
      <div style={{textAlign:"center",fontSize:11,color:"#666",marginBottom:16}}>Réf. {doc.id} — {formatDate(doc.date)} — {doc.site||"Siège"}</div>
      <hr style={HR_L}/>
      <div style={SEC_T}>1. Contexte</div>
      <p style={BODY}>Le présent rapport fait suite aux travaux réalisés dans le cadre de <strong>{doc.type?.toLowerCase()}</strong>{doc.proj?` pour le projet ${doc.proj}`:""}, sous la responsabilité de la direction de {doc.site||"Softwell Madagascar"}.</p>
      {lorem(3)}
      <div style={SEC_T}>2. Constatations</div>{lorem(4)}
      <div style={SEC_T}>3. Recommandations</div>{lorem(3)}
      <div style={SEC_T}>4. Conclusion</div>{lorem(2)}
      <div style={{marginTop:30,textAlign:"right"}}><div style={LBL}>Le rapporteur</div><div style={{width:140,borderBottom:"1px solid #999",marginTop:36,display:"inline-block"}}/></div>
      {footer()}
    </div>
  );

  /* ── DEVIS / PROFORMA ── */
  const renderDevis=()=>(
    <div style={PAGE}>
      {watermark()}{rejetStamp()}
      {companyHeader()}
      <hr style={HR}/>
      <div style={{...DTITLE,color:"#7c3aed"}}>DEVIS / PROFORMA</div>
      <div style={{textAlign:"center",fontSize:11,color:"#666",marginBottom:16}}>N° {doc.id} — {formatDate(doc.date)}</div>
      <MetaRow label="Client / Destinataire" value={doc.fourn||"—"}/>
      <MetaRow label="Projet" value={doc.proj||"—"}/>
      <MetaRow label="Validité" value="30 jours"/>
      <hr style={HR_L}/>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:11,marginTop:8}}>
        <thead><tr style={{background:"#7c3aed",color:"#fff"}}>
          <th style={{padding:"8px 10px",textAlign:"left"}}>Prestation</th>
          <th style={{padding:"8px 10px",textAlign:"right",width:110}}>Montant (MGA)</th>
        </tr></thead>
        <tbody>{["Prestation principale","Accompagnement technique","Support & maintenance"].map((l,i)=>(
          <tr key={i} style={{borderBottom:"1px solid #eee"}}>
            <td style={{padding:"8px 10px"}}>{l}</td>
            <td style={{padding:"8px 10px",textAlign:"right",fontFamily:"monospace"}}>{fmtN(Math.round(mt*(i===0?.65:i===1?.25:.1)))}</td>
          </tr>
        ))}</tbody>
        <tfoot><tr style={{borderTop:"2px solid #7c3aed"}}>
          <td style={{padding:"10px",textAlign:"right",fontWeight:700}}>TOTAL TTC :</td>
          <td style={{padding:"10px",textAlign:"right",fontWeight:800,fontSize:14,fontFamily:"monospace"}}>{fmtN(mt)} MGA</td>
        </tr></tfoot>
      </table>
      <div style={{marginTop:24,fontSize:10,color:"#888"}}>Ce devis est valable 30 jours à compter de sa date d'émission.</div>
      <div style={{marginTop:30,display:"flex",justifyContent:"space-between"}}>
        <div style={{textAlign:"center"}}><div style={LBL}>Pour Softwell</div><div style={{width:130,borderBottom:"1px solid #999",marginTop:36}}/></div>
        <div style={{textAlign:"center"}}><div style={LBL}>Bon pour accord</div><div style={{width:130,borderBottom:"1px solid #999",marginTop:36}}/></div>
      </div>
      {footer()}
    </div>
  );

  /* ── AVENANT ── */
  const renderAvenant=()=>(
    <div style={PAGE}>
      {watermark()}{rejetStamp()}
      {companyHeader()}
      <hr style={HR}/>
      <div style={DTITLE}>AVENANT</div>
      <div style={{textAlign:"center",fontSize:12,color:"#555",marginBottom:16}}>Au contrat N° {doc.id} — {doc.fourn||"—"}</div>
      <hr style={HR_L}/>
      <MetaRow label="Date de l'avenant" value={formatDate(doc.date)}/>
      <MetaRow label="Fournisseur / Partenaire" value={doc.fourn}/>
      <MetaRow label="Montant révisé" value={mt?`${fmtN(mt)} MGA`:null}/>
      <div style={SEC_T}>Objet de l'avenant</div>
      <p style={BODY}>Le présent avenant modifie les conditions du contrat initial afin de prendre en compte les évolutions suivantes :</p>
      {lorem(4)}
      <div style={SEC_T}>Nouvelles dispositions</div>{lorem(3)}
      <div style={{marginTop:30,display:"flex",justifyContent:"space-between"}}>
        <div style={{textAlign:"center"}}><div style={LBL}>Pour Softwell Madagascar</div><div style={{width:140,borderBottom:"1px solid #999",marginTop:40}}/></div>
        <div style={{textAlign:"center"}}><div style={LBL}>Pour {doc.fourn||"le partenaire"}</div><div style={{width:140,borderBottom:"1px solid #999",marginTop:40}}/></div>
      </div>
      {footer()}
    </div>
  );

  /* ── COURRIER / LETTRE ── */
  const renderCourrier=()=>(
    <div style={PAGE}>
      {watermark()}{rejetStamp()}
      {companyHeader()}
      <hr style={HR}/>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:12,flexWrap:"wrap",gap:8}}>
        <div style={{fontSize:11,color:"#666"}}>Réf : {doc.id}</div>
        <div style={{fontSize:11,color:"#666"}}>Antananarivo, le {formatDate(doc.date)}</div>
      </div>
      <div style={{marginBottom:16,textAlign:"right"}}>
        <div style={LBL}>À l'attention de</div>
        <div style={{fontSize:13,fontWeight:600}}>{doc.fourn||"Monsieur le Directeur"}</div>
      </div>
      <div style={{marginBottom:16}}>
        <span style={LBL}>Objet :</span> <span style={{fontWeight:700,marginLeft:8}}>{doc.type}</span>
      </div>
      <hr style={HR_L}/>
      <p style={{...BODY,marginBottom:8}}>Monsieur,</p>
      <p style={BODY}>Nous avons l'honneur de porter à votre connaissance les éléments relatifs à <strong>{doc.type?.toLowerCase()}</strong>{doc.proj?`, dans le cadre du projet ${doc.proj}`:""}, dont les détails figurent ci-après.</p>
      {lorem(5)}
      <p style={{...BODY,marginTop:12}}>Dans l'attente de votre retour, nous vous prions d'agréer, Monsieur, l'expression de nos salutations distinguées.</p>
      <div style={{marginTop:30,textAlign:"right"}}>
        <div style={{fontSize:12}}>Le Directeur Général</div>
        <div style={{fontSize:12,fontStyle:"italic",marginTop:30,fontWeight:600}}>Softwell Madagascar</div>
      </div>
      {footer()}
    </div>
  );

  /* ── MANDAT / ORDONNANCE ── */
  const renderMandat=()=>(
    <div style={PAGE}>
      {watermark()}{bapStamp()}{rejetStamp()}
      {companyHeader()}
      <hr style={HR}/>
      <div style={{...DTITLE,color:"#b45309"}}>MANDAT DE PAIEMENT</div>
      <div style={{textAlign:"center",fontSize:11,color:"#666",marginBottom:16}}>N° {doc.id} — {formatDate(doc.date)}</div>
      <div style={{...GRAYB,border:"1px solid #f59e0b",borderLeft:"4px solid #f59e0b",marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
          <div><div style={LBL}>Bénéficiaire</div><div style={{fontSize:13,fontWeight:700}}>{doc.fourn||"—"}</div></div>
          <div style={{textAlign:"right"}}><div style={LBL}>Montant</div><div style={{fontSize:18,fontWeight:800,fontFamily:"monospace",color:"#b45309"}}>{fmtN(mt)} MGA</div></div>
        </div>
      </div>
      <MetaRow label="Site" value={doc.site}/>
      <MetaRow label="Projet" value={doc.proj}/>
      {doc.planCompte&&<MetaRow label="Compte d'imputation" value={doc.planCompte}/>}
      <div style={SEC_T}>Motif du paiement</div>{lorem(3)}
      <div style={{marginTop:30,display:"flex",justifyContent:"space-between"}}>
        <div style={{textAlign:"center"}}><div style={LBL}>L'ordonnateur</div><div style={{width:130,borderBottom:"1px solid #999",marginTop:36}}/></div>
        <div style={{textAlign:"center"}}><div style={LBL}>Le comptable</div><div style={{width:130,borderBottom:"1px solid #999",marginTop:36}}/></div>
        <div style={{textAlign:"center"}}><div style={LBL}>Le payeur</div><div style={{width:130,borderBottom:"1px solid #999",marginTop:36}}/></div>
      </div>
      {footer()}
    </div>
  );

  /* ── GÉNÉRIQUE ── */
  const renderGenerique=()=>(
    <div style={PAGE}>
      {watermark()}{bapStamp()}{rejetStamp()}
      {companyHeader()}
      <hr style={HR}/>
      <div style={DTITLE}>{(doc.type||"DOCUMENT").toUpperCase()}</div>
      <div style={{textAlign:"center",fontSize:11,color:"#666",marginBottom:16}}>Réf. {doc.id} — {formatDate(doc.date)}</div>
      <hr style={HR_L}/>
      <MetaRow label="Fournisseur / Tiers" value={doc.fourn}/>
      <MetaRow label="Site" value={doc.site}/>
      {doc.proj&&<MetaRow label="Projet" value={doc.proj}/>}
      {mt>0&&<MetaRow label="Montant" value={`${fmtN(mt)} MGA`}/>}
      {doc.planCompte&&<MetaRow label="Imputation" value={doc.planCompte}/>}
      <div style={SEC_T}>Contenu</div>{lorem(5)}
      <div style={SEC_T}>Observations</div>{lorem(3)}
      <div style={{marginTop:30,textAlign:"right"}}><div style={LBL}>Signature</div><div style={{width:140,borderBottom:"1px solid #999",marginTop:36,display:"inline-block"}}/></div>
      {footer()}
    </div>
  );

  const templates={facture:renderFacture,bc:renderBC,contrat:renderContrat,frais:renderFrais,
    bordereau:renderBordereau,rapport:renderRapport,devis:renderDevis,avenant:renderAvenant,
    courrier:renderCourrier,mandat:renderMandat,generique:renderGenerique};
  const renderContent=templates[template]||renderGenerique;

  /* ── Skeleton loader ── */
  if(!loaded)return(
    <div style={{padding:20}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
        <div style={{width:16,height:16,borderRadius:"50%",border:`3px solid ${BD}`,borderTopColor:P,animation:"spin .8s linear infinite"}}/>
        <span style={{fontSize:12,color:MUT}}>Chargement de l'aperçu…</span>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}`}</style>
      <div style={{maxWidth:680,margin:"0 auto"}}>
        {[200,160,180,140,120,100].map((w,i)=>(
          <div key={i} style={{height:14,borderRadius:4,marginBottom:10,width:`${w/2}%`,
            background:"linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)",
            backgroundSize:"400px 100%",animation:"shimmer 1.5s infinite"}}/>
        ))}
      </div>
    </div>
  );

  return(
    <div style={{padding:0}}>
      {/* Toolbar */}
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0 12px",flexWrap:"wrap"}}>
        <div style={{display:"flex",alignItems:"center",gap:4,background:"#f1f5f9",borderRadius:6,padding:"4px 6px",border:`1px solid ${BD}`}}>
          <button onClick={()=>setZoom(z=>Math.max(.5,z-.1))}
            style={{width:28,height:28,border:"none",background:"none",cursor:"pointer",fontSize:16,fontWeight:700,color:MUT,fontFamily:"monospace",borderRadius:4}}
            onMouseEnter={e=>e.currentTarget.style.background="#e2e8f0"}
            onMouseLeave={e=>e.currentTarget.style.background="none"}>−</button>
          <span style={{fontSize:11,fontWeight:600,color:"#212529",minWidth:40,textAlign:"center"}}>{Math.round(zoom*100)}%</span>
          <button onClick={()=>setZoom(z=>Math.min(1.5,z+.1))}
            style={{width:28,height:28,border:"none",background:"none",cursor:"pointer",fontSize:16,fontWeight:700,color:MUT,fontFamily:"monospace",borderRadius:4}}
            onMouseEnter={e=>e.currentTarget.style.background="#e2e8f0"}
            onMouseLeave={e=>e.currentTarget.style.background="none"}>+</button>
        </div>
        <button onClick={()=>setZoom(1)} style={{fontSize:11,color:P,background:"none",border:"none",cursor:"pointer",fontWeight:600}}>Réinitialiser</button>
        <div style={{flex:1}}/>
        <div style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:MUT}}>
          <span style={{display:"flex"}}>{IC.file}</span>
          <span>Aperçu — {doc.type||"Document"}</span>
        </div>
        {/* Annexes count badge */}
        {doc.anx?.length>0&&(
          <span style={{fontSize:10,background:SUCL,color:SUCD,padding:"2px 8px",borderRadius:10,fontWeight:600}}>
            {doc.anx.length} annexe(s) jointe(s)
          </span>
        )}
      </div>

      {/* Paper */}
      <div ref={ref} style={{background:"#e8e8e8",borderRadius:8,padding:24,overflow:"auto",maxHeight:700}}>
        {renderContent()}
      </div>

      {/* Annexes preview strip */}
      {doc.anx?.length>0&&(
        <div style={{marginTop:12}}>
          <div style={{fontSize:11,fontWeight:700,color:MUT,textTransform:"uppercase",marginBottom:6}}>Pièces jointes</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {doc.anx.map((a,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",
                borderRadius:6,border:`1px solid ${BD}`,background:"#fff",fontSize:11}}>
                <span style={{display:"flex",color:a.ok?SUCD:DNG}}>{a.ok?IC.chk:IC.clock}</span>
                <span style={{fontWeight:600,color:"#212529"}}>{a.nom}</span>
                <span style={{color:MUT}}>{a.typeLabel||a.type}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SOFTSIGN ATTACH — Rattachement document collaborateur + Signature
══════════════════════════════════════════════════════════════ */
const COLLAB_SS_KEY="ss_collab_docs";
const SOFTSIGN_DOCS_KEY="ss_docs";
const SOFTSIGN_WORKFLOWS_KEY="ss_workflows";
const SOFTSIGN_DELEGATIONS_KEY="ss_delegations";
const COLLAB_STATUS={depose:{l:"Déposé",c:"#64748b"},en_attente:{l:"En attente",c:"#d97706"},signe:{l:"Signé",c:"#059669"},refuse:{l:"Refusé",c:"#dc2626"}};
const ssRead=(key,fb)=>{try{const v=localStorage.getItem(key);return v?JSON.parse(v):fb;}catch{return fb;}};
const ssWrite=(key,val)=>{try{localStorage.setItem(key,JSON.stringify(val));}catch{}};
const SS_SIGNED_STATUSES=new Set(["signe","termine","signed","signature_completee"]);
const isSsDoneStep=(s)=>["complete","done"].includes(s?.status);
const isSoftSignAnnexe=(a)=>a?.type==="document_signe_softsign"||!!a?.softSignId;
const ssSafeFileName=(v)=>String(v||"document_softsign").trim().replace(/[^\w.-]+/g,"_").replace(/^_+|_+$/g,"")||"document_softsign";
const ssHtmlEscape=(v)=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const ssUserName=(users,id)=>users?.find(u=>u.id===id)?.nom||id||"";
function ssLastSigner(ssDoc,users=[]){
  const done=(ssDoc?.steps||[]).filter(isSsDoneStep);
  if(!done.length)return ssDoc?.signedByName||ssDoc?.signedBy||"—";
  const last=done[done.length-1];
  if(last.completedBy)return ssUserName(users,last.completedBy)||last.completedBy;
  if(last.doneByName)return last.doneByName;
  if(last.doneBy)return ssUserName(users,last.doneBy)||last.doneBy;
  return(last.signers||[]).map(id=>ssUserName(users,id)||id).filter(Boolean).join(", ")||"—";
}
function ssSignerNames(ssDoc,users=[]){
  const names=new Set();
  (ssDoc?.steps||[]).forEach((step)=>{
    if(step.completedBy)names.add(ssUserName(users,step.completedBy)||step.completedBy);
    if(step.doneByName)names.add(step.doneByName);
    if(step.doneBy)names.add(ssUserName(users,step.doneBy)||step.doneBy);
    (step.signers||[]).forEach(id=>names.add(ssUserName(users,id)||id));
  });
  const signedBy=ssDoc?.signedBy;
  if(Array.isArray(signedBy))signedBy.forEach(id=>names.add(ssUserName(users,id)||id));
  else if(signedBy)names.add(String(signedBy));
  return[...names].filter(Boolean);
}
function ssSignDateIso(ssDoc){
  const done=(ssDoc?.steps||[]).filter(isSsDoneStep);
  const last=done[done.length-1];
  return last?.completedAt||last?.doneAt||ssDoc?.signedAt||ssDoc?.certificate?.generatedAt||ssDoc?.updatedAt||ssDoc?.createdAt||"";
}
function ssSignDateLabel(ssDoc){
  const iso=ssSignDateIso(ssDoc);
  if(!iso)return"—";
  try{return new Date(iso).toLocaleDateString("fr-FR");}catch{return"—";}
}
function ssDataUrlFromDoc(ssDoc){
  const raw=ssDoc?.signedFileB64||ssDoc?.fileSignedB64||ssDoc?.fileB64||ssDoc?.b64||"";
  if(!raw)return"";
  const value=String(raw);
  if(value.startsWith("data:"))return value;
  return`data:application/pdf;base64,${value.replace(/^data:[^;]+;base64,/,"")}`;
}
function ssDataUrlMime(url){
  return String(url||"").match(/^data:([^;,]+)/)?.[1]||"application/octet-stream";
}
function ssDataUrlSize(url){
  const b64=String(url||"").includes("base64,")?String(url).split("base64,")[1]:"";
  if(!b64)return"SoftSign";
  const bytes=Math.max(0,Math.ceil((b64.length*3)/4));
  return bytes>=1048576?`${(bytes/1048576).toFixed(1)} Mo`:`${Math.max(1,Math.round(bytes/1024))} Ko`;
}
function buildSoftSignSignedPayload(ssDoc,users=[]){
  const base=ssSafeFileName(ssDoc?.ref||ssDoc?.title||ssDoc?.id);
  const dataUrl=ssDataUrlFromDoc(ssDoc);
  if(dataUrl){
    const sourceExt=String(ssDoc?.fileName||"").split(".").pop();
    const ext=(sourceExt&&sourceExt!==ssDoc?.fileName?sourceExt:"pdf").replace(/[^a-z0-9]/gi,"")||"pdf";
    return{name:`${base}_signe.${ext}`,url:dataUrl,mime:ssDataUrlMime(dataUrl),size:ssDataUrlSize(dataUrl),source:"softsign_file"};
  }
  const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${ssHtmlEscape(ssDoc?.ref||"Document signe SoftSign")}</title>
<style>body{font-family:Arial,sans-serif;margin:40px;color:#111827}.box{border:1px solid #ddd6fe;border-radius:12px;padding:24px;background:#fafafa}.brand{color:#6d28d9;font-weight:800}.row{margin:10px 0}.label{font-size:11px;color:#64748b;text-transform:uppercase;font-weight:700}.val{font-size:15px;font-weight:700}</style></head><body>
<div class="box"><div class="brand">SoftSign - Document signe</div>
<h1>${ssHtmlEscape(ssDoc?.title||"Document SoftSign")}</h1>
<div class="row"><div class="label">Reference</div><div class="val">${ssHtmlEscape(ssDoc?.ref||"—")}</div></div>
<div class="row"><div class="label">Statut</div><div class="val">${ssHtmlEscape(ssDoc?.status||"—")}</div></div>
<div class="row"><div class="label">Signe par</div><div class="val">${ssHtmlEscape(ssLastSigner(ssDoc,users))}</div></div>
<div class="row"><div class="label">Date de signature</div><div class="val">${ssHtmlEscape(ssSignDateLabel(ssDoc))}</div></div>
<div class="row"><div class="label">Workflow</div><div class="val">${ssHtmlEscape(ssDoc?.workflowName||"—")}</div></div>
<p>Document genere localement pour la demonstration SoftDocs/SoftSign, en attendant un fichier binaire signe disponible dans SoftSign.</p>
</div></body></html>`;
  return{name:`${base}_signe.html`,url:`data:text/html;charset=utf-8,${encodeURIComponent(html)}`,mime:"text/html",size:"Synthese SoftSign",source:"generated_summary"};
}
function createSoftSignSignedAnnexe(ssDoc,users=[]){
  const payload=buildSoftSignSignedPayload(ssDoc,users);
  return{
    id:`ANX-SS-${ssDoc?.id||Date.now()}`,
    nom:payload.name,
    name:payload.name,
    type:"document_signe_softsign",
    typeLabel:"Document signé SoftSign",
    ok:true,
    url:payload.url,
    mime:payload.mime,
    taille:payload.size,
    size:payload.size,
    date:new Date().toISOString(),
    softSignId:ssDoc?.id,
    softSignRef:ssDoc?.ref,
    softSignStatus:ssDoc?.status,
    softSignSignDate:ssSignDateLabel(ssDoc),
    softSignSigner:ssLastSigner(ssDoc,users),
    softSignWorkflow:ssDoc?.workflowName||"—",
    softSignAudit:ssDoc?.audit||[],
    softSignSteps:ssDoc?.steps||[],
    hasCertificate:true,
    title:ssDoc?.title,
    type_doc:ssDoc?.type,
    projectName:ssDoc?.projectName,
    site:ssDoc?.site,
    downloadedAt:new Date().toISOString(),
    downloadSource:payload.source,
  };
}
function upsertSoftSignAnnexe(list,annexe){
  const arr=Array.isArray(list)?list:[];
  if(arr.some(a=>isSoftSignAnnexe(a)&&a.softSignId===annexe.softSignId)){
    return arr.map(a=>isSoftSignAnnexe(a)&&a.softSignId===annexe.softSignId?{...a,...annexe,id:a.id||annexe.id}:a);
  }
  return[...arr,annexe];
}
function softSignStoredIds(doc){
  return new Set([
    ...(doc?.softSignAttached||[]),
    ...(doc?.annexes||[]).filter(isSoftSignAnnexe).map(a=>a.softSignId),
    ...(doc?.anx||[]).filter(isSoftSignAnnexe).map(a=>a.softSignId),
  ].filter(Boolean));
}
function syncSoftSignSignedDoc(doc,ssDoc,users=[]){
  const annexe=createSoftSignSignedAnnexe(ssDoc,users);
  const attached=[...new Set([...softSignStoredIds(doc),ssDoc?.id].filter(Boolean))];
  const alreadyHistory=(doc?.historique||[]).some(h=>h.type==="softsign_download"&&h.softSignId===ssDoc?.id);
  const syncHistory={
    type:"softsign_download",
    softSignId:ssDoc?.id,
    date:new Date().toLocaleString("fr-FR"),
    par:"SoftSign",
    comment:`Document signé ${ssDoc?.ref||""} téléchargé depuis SoftSign et ajouté aux annexes GED.`,
  };
  return{
    annexe,
    doc:{
      ...doc,
      annexes:upsertSoftSignAnnexe(doc?.annexes,annexe),
      anx:upsertSoftSignAnnexe(doc?.anx,annexe),
      softSignAttached:attached,
      softSignStatus:ssDoc?.status||doc?.softSignStatus,
      softSignLocked:doc?.softSignRef===ssDoc?.id?false:doc?.softSignLocked,
      softSignSyncedAt:new Date().toISOString(),
      historique:alreadyHistory?(doc?.historique||[]):[...(doc?.historique||[]),syncHistory],
    },
  };
}
function downloadSoftSignAnnexe(annexe){
  if(typeof document==="undefined"||!annexe?.url)return;
  const link=document.createElement("a");
  link.href=annexe.url;
  link.download=annexe.nom||annexe.name||"document_softsign";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/* ── 4-step wizard: SoftDocs → SoftSign ── */
function SendToSoftSignWizard({doc,onClose,onSend}){
  const{authUser,users,projets}=useApp();
  const FONT_SS="'Plus Jakarta Sans',system-ui,sans-serif";
  const P_SS="#7c3aed";
  const BD_SS="#e2e8f0";
  const STEPS=["Paramètres","Configuration des zones","Prévisualisation","Confirmation"];
  const ZONE_COLORS={signature:{border:"#16a34a",bg:"#f0fdf4",text:"#15803d"},paraphe:{border:"#2563eb",bg:"#eff6ff",text:"#1d4ed8"}};

  const[step,setStep]=useState(1);
  const[docType,setDocType]=useState(()=>{
    const t=(doc.type||"").toLowerCase();
    if(t.includes("contrat"))return"contrat";
    if(t.includes("facture"))return"facture";
    if(t.includes("bon")&&t.includes("commande"))return"bon_commande";
    if(t.includes("devis"))return"devis";
    return"contrat";
  });
  const[selWfId,setSelWfId]=useState("");
  const[zones,setZones]=useState([]);
  const[sending,setSending]=useState(false);
  const[sent,setSent]=useState(false);

  const allWfs=ssRead(SOFTSIGN_WORKFLOWS_KEY,INIT_SS_WORKFLOWS_PRO);
  const compatWfs=allWfs.filter(wf=>wf.active!==false&&(!wf.docTypes?.length||wf.docTypes.includes(docType)));
  const selWf=compatWfs.find(wf=>wf.id===selWfId)||compatWfs[0];

  useEffect(()=>{setSelWfId(compatWfs[0]?.id||"");},[docType]);
  useEffect(()=>{
    if(!selWf){setZones([]);return;}
    setZones((selWf.steps||[]).filter(s=>["signature","paraphe"].includes(s.action)).map((s,i)=>({
      id:`Z-${s.id}-${i}`,stepId:s.id,action:s.action,label:s.label,
      signerName:(s.signers||[]).map(id=>users.find(u=>u.id===id)?.nom||id).join(", ")||"—",
      page:s.action==="paraphe"?"Toutes les pages":"Dernière page",
      position:i%2===0?"Bas gauche":"Bas droite",x:i%2===0?8:58,y:72,width:32,
    })));
  },[selWf?.id]);

  const proj=projets?.find(p=>p.id===(doc.proj||doc.projectId))||projets?.[0];
  const info={
    ref:doc.ch?.numero||doc.id,projet:proj?.nom||doc.proj||"—",site:doc.site||"—",
    montant:fmtN(doc.mtR||doc.mt||0),expediteur:doc.fourn||"—",auteur:authUser?.nom||"—",
    date:doc.ch?.date_doc||doc.date||"—",annexes:doc.annexes?.length||0,
  };

  function doSend(){
    setSending(true);
    const draft={type:docType,ref:info.ref,title:doc.notes||doc.type||`Document ${doc.id}`,
      amount:doc.mtR||doc.mt||0,amountTtc:doc.mtR||doc.mt||0,currency:doc.ch?.devise||"MGA",
      date:info.date,projectId:proj?.id||"",projectName:proj?.nom||"",site:doc.site||proj?.sites?.[0]||"",
      fileName:`${doc.id}.pdf`,ocrData:doc.ch?{...doc.ch,score:doc.ocr,source:"softdocs"}:null,
      softDocsRef:doc.id,zones};
    const allSs=ssRead(SOFTSIGN_DOCS_KEY,[]);
    const newDoc=createSoftSignDocument({draft,workflow:selWf,users:users||[],delegations:ssRead(SOFTSIGN_DELEGATIONS_KEY,INIT_SS_DELEGATIONS_PRO),authUser,origin:"softdocs"});
    const enriched={...newDoc,sourceSoftDocs:doc.id,softDocsRef:doc.id,
      status:selWf?"en_cours":"en_attente_traitement",
      audit:[...(newDoc.audit||[]),{date:new Date().toISOString(),user:authUser?.nom||"SoftDocs",action:"integration_softdocs",detail:`Envoyé depuis SoftDocs — ${info.ref} — Workflow: ${selWf?.name||"—"}`}]};
    ssWrite(SOFTSIGN_DOCS_KEY,[enriched,...allSs]);
    setSending(false);setSent(true);
    onSend(enriched);
  }

  const docTypes=SS_DOC_TYPES;
  const canNext=step===1?(!!docType&&!!selWf):true;

  function ZonePreview({zones,small}){
    return(
      <div style={{background:"#e8e8e8",borderRadius:8,padding:small?8:12}}>
        <div style={{background:"#fff",borderRadius:4,boxShadow:"0 2px 8px rgba(0,0,0,.12)",aspectRatio:"0.707",position:"relative",padding:small?"16px 14px":"24px 20px",overflow:"hidden"}}>
          <div style={{textAlign:"center",marginBottom:small?6:10}}>
            <div style={{fontSize:small?7:9,fontWeight:900,letterSpacing:".1em",color:"#1e3a5f"}}>SOFTWELL MADAGASCAR</div>
            <div style={{fontSize:small?5:7,color:"#64748b"}}>Société de Services & Solutions Informatiques</div>
            <div style={{height:1,background:"#e2e8f0",margin:`${small?4:6}px 0`}}/>
          </div>
          <div style={{textAlign:"center",fontSize:small?8:11,fontWeight:900,marginBottom:4}}>{(doc.type||"DOCUMENT").toUpperCase()}</div>
          <div style={{textAlign:"center",fontSize:small?6:8,color:"#94a3b8",marginBottom:8}}>Réf. {info.ref}</div>
          {Array.from({length:small?6:10},(_,i)=><div key={i} style={{height:4,background:"#f1f5f9",borderRadius:2,marginBottom:3,width:`${65+(i*7)%30}%`}}/>)}
          {zones.map(z=>{
            const zc=ZONE_COLORS[z.action]||ZONE_COLORS.signature;
            const px=z.position?.includes("gauche")?5:z.position?.includes("centre")?34:57;
            const py=z.position?.includes("Haut")?5:74;
            return(
              <div key={z.id} style={{position:"absolute",left:`${px}%`,top:`${py}%`,width:"32%",padding:"3px 5px",border:`1.5px dashed ${zc.border}`,background:zc.bg,borderRadius:4}}>
                <div style={{fontSize:6.5,fontWeight:800,color:zc.text}}>{z.label}</div>
                <div style={{fontSize:5.5,color:zc.text,opacity:.8}}>{z.signerName}</div>
                <div style={{fontSize:5,color:zc.text,opacity:.7}}>{z.page} — {z.position}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:99999,display:"flex",alignItems:"center",justifyContent:"center",padding:16,fontFamily:FONT_SS}}>
      <div style={{background:"#fff",borderRadius:14,width:"100%",maxWidth:920,maxHeight:"94vh",display:"flex",flexDirection:"column",boxShadow:"0 24px 72px rgba(0,0,0,.22)",overflow:"hidden"}}>
        {/* Header */}
        <div style={{padding:"16px 24px",borderBottom:`1px solid ${BD_SS}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:38,height:38,borderRadius:10,background:"linear-gradient(135deg,#4c1d95,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>✍</div>
            <div>
              <div style={{fontWeight:800,fontSize:15,color:"#0f172a"}}>Envoyer pour signature SoftSign</div>
              <div style={{fontSize:12,color:"#64748b",marginTop:1}}>Complétez les paramètres de signature avant génération du document dans SoftSign.</div>
            </div>
          </div>
          <button onClick={onClose} style={{width:30,height:30,borderRadius:"50%",border:"none",background:"#f1f5f9",cursor:"pointer",fontSize:16,color:"#475569"}}>×</button>
        </div>

        {/* Step bar */}
        <div style={{padding:"12px 24px",borderBottom:`1px solid ${BD_SS}`,display:"flex",alignItems:"center"}}>
          {STEPS.map((s,i)=>{
            const n=i+1;const isActive=step===n;const isDone=step>n;
            return(
              <div key={n} style={{display:"flex",alignItems:"center",flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:7,flexShrink:0}}>
                  <div style={{width:26,height:26,borderRadius:"50%",border:`2px solid ${isActive?P_SS:isDone?"#16a34a":"#cbd5e1"}`,background:isActive?P_SS:isDone?"#16a34a":"transparent",color:isActive||isDone?"#fff":"#94a3b8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800}}>
                    {isDone?"✓":n}
                  </div>
                  <span style={{fontSize:12,fontWeight:isActive?700:400,color:isActive?P_SS:isDone?"#16a34a":"#94a3b8",whiteSpace:"nowrap"}}>{s}</span>
                </div>
                {i<STEPS.length-1&&<div style={{flex:1,height:1,background:isDone?"#16a34a":"#e2e8f0",margin:"0 10px"}}/>}
              </div>
            );
          })}
        </div>

        {/* Content */}
        <div style={{flex:1,overflowY:"auto",padding:24}}>

          {/* STEP 1: Paramètres */}
          {step===1&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
              <div>
                <div style={{fontSize:11,fontWeight:800,color:P_SS,textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Informations du document (SoftDocs)</div>
                <div style={{background:"#f8fafc",borderRadius:10,overflow:"hidden",border:`1px solid ${BD_SS}`,marginBottom:20}}>
                  {[["Référence document",info.ref],["Projet",info.projet],["Site",info.site],["Montant réel",`${info.montant} Ar`],["Expéditeur",<b key="e" style={{color:"#4c1d95"}}>{info.expediteur}</b>],["Auteur (généré par)",<b key="a" style={{color:"#4c1d95"}}>{info.auteur}</b>],["Date du document",info.date],["Pièces jointes",info.annexes>0?<span key="p" style={{padding:"2px 8px",background:"#ede9fe",color:P_SS,borderRadius:10,fontSize:11,fontWeight:700}}>{info.annexes} annexe{info.annexes>1?"s":""} jointe{info.annexes>1?"s":""}</span>:"—"]].map(([k,v])=>(
                    <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 14px",borderBottom:`1px solid ${BD_SS}`,fontSize:12.5}}>
                      <span style={{color:"#64748b"}}>{k}</span>
                      <span style={{fontWeight:600,color:"#1e293b",textAlign:"right"}}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{fontSize:11,fontWeight:800,color:P_SS,textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Paramètres SoftSign</div>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <label>
                    <div style={{fontSize:11.5,fontWeight:700,color:"#374151",marginBottom:5}}>Type de document *</div>
                    <select value={docType} onChange={e=>setDocType(e.target.value)} style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`1px solid ${BD_SS}`,fontSize:13,fontFamily:FONT_SS,background:"#fff"}}>
                      <option value="">Sélectionner un type de document</option>
                      {docTypes.map(t=><option key={t.id} value={t.id}>{t.label}</option>)}
                    </select>
                  </label>
                  <label>
                    <div style={{fontSize:11.5,fontWeight:700,color:"#374151",marginBottom:5}}>Workflow SoftSign *</div>
                    <select value={selWfId||selWf?.id||""} onChange={e=>setSelWfId(e.target.value)} style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`1px solid ${BD_SS}`,fontSize:13,fontFamily:FONT_SS,background:"#fff"}}>
                      <option value="">Sélectionner un workflow compatible</option>
                      {compatWfs.map(wf=><option key={wf.id} value={wf.id}>{wf.name}</option>)}
                    </select>
                    <div style={{fontSize:11,color:"#94a3b8",marginTop:4}}>Les workflows affichés dépendent du type de document sélectionné.</div>
                  </label>
                </div>
              </div>
              <div>
                <div style={{fontSize:11,fontWeight:800,color:P_SS,textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Aperçu du document</div>
                <div style={{border:`1px solid ${BD_SS}`,borderRadius:10,overflow:"hidden"}}>
                  <div style={{padding:"8px 12px",borderBottom:`1px solid ${BD_SS}`,display:"flex",alignItems:"center",gap:8,background:"#f8fafc",fontSize:12}}>
                    <span style={{color:"#475569"}}>Page 1</span>
                    <span style={{color:"#94a3b8"}}>‹ ›</span>
                    <div style={{flex:1}}/>
                    <span style={{color:"#475569"}}>— 100% +</span>
                    <span style={{color:"#475569",fontSize:11}}>Afficher les zones</span>
                    <div style={{width:30,height:16,borderRadius:8,background:P_SS,display:"flex",alignItems:"center",justifyContent:"flex-end",padding:"2px 3px"}}><div style={{width:12,height:12,borderRadius:"50%",background:"#fff"}}/></div>
                  </div>
                  <div style={{padding:12,background:"#e8e8e8"}}>
                    <ZonePreview zones={zones}/>
                    {zones.length>0&&<div style={{marginTop:8,fontSize:11,color:"#64748b"}}>ℹ Vous pourrez ajuster, déplacer ou supprimer les zones dans l'étape suivante.</div>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Configuration des zones */}
          {step===2&&(
            <div>
              <div style={{fontSize:13,fontWeight:700,color:"#0f172a",marginBottom:16}}>Configuration des zones de signature</div>
              {zones.length===0?(
                <div style={{textAlign:"center",padding:40,color:"#94a3b8"}}>
                  <div style={{fontSize:36,marginBottom:8}}>📄</div>
                  <div style={{fontWeight:600}}>Aucune zone de signature/paraphe dans ce workflow</div>
                </div>
              ):(
                <div style={{display:"grid",gridTemplateColumns:"1fr 1.3fr",gap:20}}>
                  <div>
                    <div style={{fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:".07em",marginBottom:10}}>Zones configurées ({zones.length})</div>
                    {zones.map((z,i)=>{
                      const zc=ZONE_COLORS[z.action]||ZONE_COLORS.signature;
                      return(
                        <div key={z.id} style={{padding:"12px 14px",border:`1.5px solid ${zc.border}`,borderRadius:10,background:zc.bg,marginBottom:10}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                            <span style={{fontWeight:800,fontSize:13,color:zc.text}}>{z.action==="paraphe"?"✏":"✍"} {z.label}</span>
                            <span style={{fontSize:10.5,fontWeight:700,color:zc.text,background:"#fff",padding:"2px 8px",borderRadius:8,border:`1px solid ${zc.border}`}}>{z.action}</span>
                          </div>
                          <div style={{fontSize:12,color:"#475569",marginBottom:8}}>Signataire : <b>{z.signerName}</b></div>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                            <label style={{fontSize:11.5}}>
                              <div style={{color:"#64748b",marginBottom:3}}>Page</div>
                              <select value={z.page} onChange={e=>setZones(p=>p.map((x,xi)=>xi===i?{...x,page:e.target.value}:x))} style={{width:"100%",padding:"6px 8px",borderRadius:6,border:`1px solid ${BD_SS}`,fontSize:11.5,fontFamily:FONT_SS}}>
                                {["Toutes les pages","Première page","Dernière page","Page spécifique"].map(v=><option key={v}>{v}</option>)}
                              </select>
                            </label>
                            <label style={{fontSize:11.5}}>
                              <div style={{color:"#64748b",marginBottom:3}}>Position</div>
                              <select value={z.position} onChange={e=>setZones(p=>p.map((x,xi)=>xi===i?{...x,position:e.target.value}:x))} style={{width:"100%",padding:"6px 8px",borderRadius:6,border:`1px solid ${BD_SS}`,fontSize:11.5,fontFamily:FONT_SS}}>
                                {["Bas gauche","Bas droite","Bas centre","Haut droite","Personnalisée"].map(v=><option key={v}>{v}</option>)}
                              </select>
                            </label>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div>
                    <div style={{fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:".07em",marginBottom:10}}>Aperçu du positionnement</div>
                    <ZonePreview zones={zones}/>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Prévisualisation */}
          {step===3&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1.5fr",gap:24}}>
              <div>
                <div style={{fontSize:11,fontWeight:800,color:P_SS,textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Récapitulatif</div>
                <div style={{background:"#f5f3ff",border:"1px solid #ddd6fe",borderRadius:10,padding:16,marginBottom:14}}>
                  {[["Référence",info.ref],["Type SoftSign",docTypes.find(t=>t.id===docType)?.label||docType],["Workflow",selWf?.name||"—"],["Étapes",`${(selWf?.steps||[]).length} étape(s)`],["Zones",`${zones.length} zone(s) configurée(s)`]].map(([k,v])=>(
                    <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #ede9fe",fontSize:12.5}}>
                      <span style={{color:"#6d28d9"}}>{k}</span>
                      <span style={{fontWeight:700,color:"#1e293b"}}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:10,padding:14,fontSize:12,color:"#92400e"}}>
                  ⚠ Après l'envoi, le document SoftDocs sera verrouillé en attente du workflow de signature SoftSign.
                </div>
              </div>
              <div>
                <div style={{fontSize:11,fontWeight:800,color:P_SS,textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Document avec zones de signature</div>
                <ZonePreview zones={zones}/>
              </div>
            </div>
          )}

          {/* STEP 4: Confirmation */}
          {step===4&&(
            <div style={{textAlign:"center",padding:"20px 40px"}}>
              {sent?(
                <>
                  <div style={{width:72,height:72,borderRadius:"50%",background:"#f0fdf4",border:"3px solid #16a34a",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:32,marginBottom:16}}>✓</div>
                  <div style={{fontSize:20,fontWeight:900,color:"#15803d",marginBottom:8}}>Document envoyé vers SoftSign !</div>
                  <div style={{fontSize:13,color:"#64748b",maxWidth:420,margin:"0 auto 24px"}}>
                    Le document <b>{info.ref}</b> a été créé dans SoftSign avec le workflow <b>{selWf?.name}</b>. Le document SoftDocs est maintenant verrouillé.
                  </div>
                  <button onClick={onClose} style={{padding:"10px 28px",borderRadius:8,border:"none",background:P_SS,color:"#fff",fontWeight:700,fontSize:13.5,cursor:"pointer",fontFamily:FONT_SS}}>Fermer</button>
                </>
              ):(
                <>
                  <div style={{fontSize:17,fontWeight:800,color:"#0f172a",marginBottom:8}}>Confirmer l'envoi pour signature</div>
                  <div style={{fontSize:13,color:"#64748b",maxWidth:440,margin:"0 auto 20px"}}>
                    Le document <b>{info.ref}</b> sera envoyé vers SoftSign avec le workflow <b>{selWf?.name||"—"}</b>. Le document SoftDocs sera verrouillé jusqu'à la finalisation.
                  </div>
                  <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:10,padding:16,marginBottom:24,textAlign:"left",maxWidth:380,margin:"0 auto 24px"}}>
                    {[["Type",docTypes.find(t=>t.id===docType)?.label||docType],["Workflow",selWf?.name||"—"],["Zones",`${zones.length} configurée(s)`],["Étapes",`${(selWf?.steps||[]).length}`]].map(([k,v])=>(
                      <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",fontSize:13}}><span style={{color:"#64748b"}}>{k}</span><span style={{fontWeight:700}}>{v}</span></div>
                    ))}
                  </div>
                  <button onClick={doSend} disabled={sending||!selWf} style={{padding:"11px 32px",borderRadius:8,border:"none",background:sending?"#cbd5e1":"linear-gradient(135deg,#4c1d95,#7c3aed)",color:"#fff",fontWeight:800,fontSize:14,cursor:sending?"not-allowed":"pointer",fontFamily:FONT_SS}}>
                    {sending?"Envoi en cours...":"✍ Générer dans SoftSign"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer nav */}
        {!sent&&(
          <div style={{padding:"14px 24px",borderTop:`1px solid ${BD_SS}`,display:"flex",justifyContent:"space-between"}}>
            <button onClick={step>1?()=>setStep(s=>s-1):onClose} style={{padding:"9px 20px",borderRadius:8,border:`1px solid ${BD_SS}`,background:"#fff",cursor:"pointer",fontSize:13,fontFamily:FONT_SS}}>
              {step===1?"Annuler":"← Précédent"}
            </button>
            <button onClick={()=>step<4?setStep(s=>s+1):doSend()} disabled={!canNext||(step===4&&(!selWf||sending))}
              style={{padding:"9px 24px",borderRadius:8,border:"none",background:(!canNext)?"#cbd5e1":P_SS,color:"#fff",fontWeight:700,fontSize:13,cursor:!canNext?"not-allowed":"pointer",fontFamily:FONT_SS}}>
              {step<4?"Suivant →":"✍ Générer dans SoftSign"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── SoftSign status tab when doc is linked ── */
function SoftSignStatusPanel({doc,softSignDoc,onUpdate}){
  const{users}=useApp();
  const P_SS="#7c3aed";
  const BD_SS="#e2e8f0";
  const FONT_SS="'Plus Jakarta Sans',system-ui,sans-serif";
  const statusMap={
    en_cours:{label:"En cours de signature",color:"#2563eb",bg:"#eff6ff"},
    en_attente_traitement:{label:"En attente de traitement",color:"#d97706",bg:"#fffbeb"},
    signe:{label:"Signé",color:"#16a34a",bg:"#f0fdf4"},
    termine:{label:"Terminé",color:"#059669",bg:"#ecfdf5"},
    rejete:{label:"Rejeté",color:"#dc2626",bg:"#fef2f2"},
  };
  const st=statusMap[softSignDoc?.status]||statusMap.en_cours;
  const isFinished=SS_SIGNED_STATUSES.has(softSignDoc?.status);
  const isStored=softSignDoc?.id?softSignStoredIds(doc).has(softSignDoc.id):false;

  function downloadSignedDoc(){
    const synced=syncSoftSignSignedDoc(doc,softSignDoc,users);
    downloadSoftSignAnnexe(synced.annexe);
    onUpdate(synced.doc);
  }

  useEffect(()=>{
    if(!isFinished||!softSignDoc?.id)return;
    const statusSynced=doc.softSignStatus===softSignDoc.status&&!doc.softSignLocked;
    if(isStored&&statusSynced)return;
    onUpdate(syncSoftSignSignedDoc(doc,softSignDoc,users).doc);
  },[isFinished,isStored,softSignDoc,doc,users,onUpdate]);

  return(
    <div style={{fontFamily:FONT_SS}}>
      {/* Status banner */}
      <div style={{display:"flex",alignItems:"center",gap:14,padding:16,background:"linear-gradient(135deg,#f5f3ff,#ede9fe)",border:"1px solid #ddd6fe",borderRadius:12,marginBottom:18}}>
        <div style={{width:44,height:44,borderRadius:12,background:"linear-gradient(135deg,#4c1d95,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:22}}>✍</div>
        <div style={{flex:1}}>
          <div style={{fontWeight:800,fontSize:14,color:"#0f172a"}}>SoftSign — Signature électronique</div>
          <div style={{fontSize:12,color:"#6d28d9",marginTop:2}}>Workflow : {softSignDoc?.workflowName||"—"} · Réf. SoftSign : {softSignDoc?.ref||"—"}</div>
        </div>
        <span style={{padding:"5px 14px",borderRadius:20,fontSize:12.5,fontWeight:800,background:st.bg,color:st.color,border:`1px solid ${st.color}33`}}>{st.label}</span>
      </div>

      {/* Info grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:18}}>
        {[["PDF signé",isFinished?"Disponible":"En attente"],["Statut",softSignDoc?.status||"—"],["Date d'envoi",softSignDoc?.createdAt?new Date(softSignDoc.createdAt).toLocaleDateString("fr-FR"):"—"],["Étapes",`${(softSignDoc?.steps||[]).filter(isSsDoneStep).length}/${(softSignDoc?.steps||[]).length}`]].map(([k,v])=>(
          <div key={k} style={{padding:"10px 14px",background:"#f8fafc",borderRadius:9,border:`1px solid ${BD_SS}`}}>
            <div style={{fontSize:10,color:"#64748b",fontWeight:700,textTransform:"uppercase",letterSpacing:".05em",marginBottom:3}}>{k}</div>
            <div style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>{v}</div>
          </div>
        ))}
      </div>

      {/* Signed doc download */}
      {isFinished&&(
        <div style={{padding:14,background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10,display:"flex",alignItems:"center",gap:12,marginBottom:18}}>
          <span style={{fontSize:28}}>📄</span>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:13}}>{softSignDoc?.ref}_signé.pdf</div>
            <div style={{fontSize:11.5,color:"#64748b",marginTop:2}}>Document signé — généré automatiquement par SoftSign</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {isStored&&<span style={{padding:"4px 10px",borderRadius:20,fontSize:11,fontWeight:800,background:"#ecfdf5",color:"#15803d",border:"1px solid #bbf7d0"}}>Stocké GED</span>}
            <button onClick={downloadSignedDoc} style={{padding:"7px 14px",borderRadius:7,border:"none",background:"#16a34a",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:FONT_SS}}>↓ Télécharger</button>
          </div>
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        {/* Workflow steps */}
        <div>
          <div style={{fontSize:11,fontWeight:800,color:"#64748b",textTransform:"uppercase",letterSpacing:".07em",marginBottom:10}}>Étapes du workflow</div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {(softSignDoc?.steps||[]).map((s,i)=>{
              const isDone=isSsDoneStep(s);const isAct=s.status==="active";
              return(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",background:isDone?"#f0fdf4":isAct?"#f5f3ff":"#f8fafc",border:`1px solid ${isDone?"#bbf7d0":isAct?"#ddd6fe":"#e2e8f0"}`,borderRadius:8}}>
                  <div style={{width:24,height:24,borderRadius:"50%",background:isDone?"#16a34a":isAct?P_SS:"#cbd5e1",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900}}>
                    {isDone?"✓":isAct?"→":i+1}
                  </div>
                  <div style={{flex:1,fontSize:12.5,fontWeight:isDone||isAct?700:400,color:isDone?"#15803d":isAct?"#4c1d95":"#64748b"}}>{s.label||`Étape ${i+1}`}</div>
                  <span style={{fontSize:11,fontWeight:700,color:isDone?"#16a34a":isAct?P_SS:"#94a3b8"}}>{isDone?"Complété":isAct?"En cours":"En attente"}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Signataires + Historique */}
        <div>
          <div style={{fontSize:11,fontWeight:800,color:"#64748b",textTransform:"uppercase",letterSpacing:".07em",marginBottom:10}}>
            {isFinished?"Signataires":"Historique"}
          </div>
          <div style={{maxHeight:240,overflowY:"auto",display:"flex",flexDirection:"column",gap:6}}>
            {(softSignDoc?.audit||[]).slice(0,10).map((a,i)=>(
              <div key={i} style={{display:"flex",gap:10,padding:"7px 0",borderBottom:"1px solid #f1f5f9"}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:P_SS,marginTop:5,flexShrink:0}}/>
                <div>
                  <div style={{fontSize:12,fontWeight:600,color:"#0f172a"}}>{a.action}</div>
                  <div style={{fontSize:11,color:"#64748b"}}>{a.user} · {a.date?new Date(a.date).toLocaleString("fr-FR"):"—"}</div>
                  {a.detail&&<div style={{fontSize:11,color:"#64748b",fontStyle:"italic"}}>{a.detail}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Cas 2: Search signed SoftSign docs → attach to SoftDocs ── */
function SoftSignSearchAttachPanel({doc,onUpdate}){
  const{users}=useApp();
  const FONT_SS="'Plus Jakarta Sans',system-ui,sans-serif";
  const P_SS="#7c3aed";
  const BD_SS="#e2e8f0";

  const emptyF={ref:"",projet:"",site:"",type:"",workflow:"",titre:"",signataire:"",dateFrom:"",dateTo:"",montant:""};
  const[filters,setFilters]=useState(emptyF);
  const[showFilters,setShowFilters]=useState(true);
  const[preview,setPreview]=useState(null);
  const[attached,setAttached]=useState(()=>softSignStoredIds(doc));
  useEffect(()=>{setAttached(softSignStoredIds(doc));},[doc.softSignAttached,doc.annexes,doc.anx]);

  // Load signed docs from SoftSign localStorage
  const allSsDocs=ssRead(SOFTSIGN_DOCS_KEY,[]);
  const signedDocs=allSsDocs.filter(d=>SS_SIGNED_STATUSES.has(d.status));
  const uniq=(arr)=>[...new Set(arr.map(v=>String(v||"").trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"fr"));
  const refOptions=uniq(signedDocs.map(d=>d.ref));
  const titleOptions=uniq(signedDocs.map(d=>d.title));
  const typeOptions=SS_DOC_TYPES.filter(t=>signedDocs.some(d=>d.type===t.id));
  const workflowOptions=uniq(signedDocs.filter(d=>!filters.type||d.type===filters.type).map(d=>d.workflowName));
  const signerOptions=uniq(signedDocs.flatMap(d=>ssSignerNames(d,users)));
  const projectOptions=uniq(signedDocs.map(d=>d.projectName||d.projectId));
  const siteOptions=uniq(signedDocs.filter(d=>!filters.projet||(d.projectName||d.projectId)===filters.projet).map(d=>d.site));

  function getLastSigner(ssDoc){
    return ssLastSigner(ssDoc,users);
  }
  function getSignDate(ssDoc){
    return ssSignDateLabel(ssDoc);
  }

  const filtered=signedDocs.filter(d=>{
    if(filters.ref&&d.ref!==filters.ref)return false;
    if(filters.titre&&d.title!==filters.titre)return false;
    if(filters.type&&d.type!==filters.type)return false;
    if(filters.workflow&&d.workflowName!==filters.workflow)return false;
    if(filters.projet&&(d.projectName||d.projectId)!==filters.projet)return false;
    if(filters.site&&d.site!==filters.site)return false;
    if(filters.signataire&&!ssSignerNames(d,users).includes(filters.signataire))return false;
    if(filters.montant&&String(d.amount||"").indexOf(filters.montant)<0)return false;
    const signIso=ssSignDateIso(d);
    const signTime=signIso?new Date(signIso).getTime():0;
    if(filters.dateFrom&&(!signTime||signTime<new Date(filters.dateFrom).getTime()))return false;
    if(filters.dateTo&&(!signTime||signTime>new Date(`${filters.dateTo}T23:59:59`).getTime()))return false;
    return true;
  });
  const hasFilters=Object.values(filters).some(v=>v!=="");

  function openCert(ssDoc){
    const lastSigner=getLastSigner(ssDoc);
    const signDate=getSignDate(ssDoc);
    const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Certificat de signature</title>
<style>body{margin:0;font-family:'Segoe UI',sans-serif;background:#f4f6f9}
.page{width:794px;min-height:1123px;margin:0 auto;background:#fff;padding:48px 56px;box-sizing:border-box}
.hdr{background:linear-gradient(135deg,#1a1a2e,#16213e);padding:28px 32px;border-radius:10px;color:#fff;margin-bottom:28px;display:flex;justify-content:space-between;align-items:center}
.logo{font-size:22px;font-weight:900;letter-spacing:-.5px}
.sub{font-size:11px;opacity:.7;margin-top:4px}
.seal{width:56px;height:56px;border-radius:50%;border:3px solid rgba(255,255,255,.4);display:flex;align-items:center;justify-content:center;font-size:22px}
h2{font-size:13px;font-weight:800;color:#4c1d95;text-transform:uppercase;letter-spacing:.08em;margin:24px 0 12px;padding-bottom:6px;border-bottom:2px solid #ede9fe}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.cell{padding:12px 14px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0}
.clabel{font-size:10px;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}
.cval{font-size:13px;font-weight:700;color:#0f172a}
table{width:100%;border-collapse:collapse;margin-top:6px}
th{padding:8px 10px;background:#f5f3ff;text-align:left;font-size:11px;color:#6d28d9;text-transform:uppercase;letter-spacing:.06em}
td{padding:9px 10px;border-bottom:1px solid #f1f5f9;font-size:12px}
.foot{margin-top:32px;padding:16px;background:#f5f3ff;border-radius:8px;text-align:center;font-size:11px;color:#6d28d9}
@media print{body{background:#fff}.page{margin:0;padding:40px 48px}}
</style></head><body><div class="page">
<div class="hdr"><div><div class="logo">✍ SoftSign</div><div class="sub">Certificat de signature électronique</div></div><div class="seal">📜</div></div>
<h2>Informations du document</h2>
<div class="grid">
  <div class="cell"><div class="clabel">Référence</div><div class="cval">${ssDoc.ref||"—"}</div></div>
  <div class="cell"><div class="clabel">Type</div><div class="cval">${ssDoc.type||"—"}</div></div>
  <div class="cell"><div class="clabel">Titre</div><div class="cval">${ssDoc.title||"—"}</div></div>
  <div class="cell"><div class="clabel">Projet</div><div class="cval">${ssDoc.projectName||ssDoc.projectId||"—"}</div></div>
  <div class="cell"><div class="clabel">Site</div><div class="cval">${ssDoc.site||"—"}</div></div>
  <div class="cell"><div class="clabel">Statut</div><div class="cval" style="color:#059669">✓ ${ssDoc.status}</div></div>
</div>
<h2>Workflow de signature</h2>
<div class="grid">
  <div class="cell"><div class="clabel">Workflow</div><div class="cval">${ssDoc.workflowName||"—"}</div></div>
  <div class="cell"><div class="clabel">Dernière signature</div><div class="cval">${signDate}</div></div>
</div>
<h2>Signataires</h2>
<table><thead><tr><th>Étape</th><th>Signataire</th><th>Action</th><th>Date</th><th>Statut</th></tr></thead><tbody>
${(ssDoc.steps||[]).map(s=>`<tr><td>${s.label||"—"}</td><td>${s.doneByName||((s.signers||[]).map(id=>users.find(u=>u.id===id)?.nom||id).join(", ")||"—")}</td><td>${s.action||"—"}</td><td>${s.completedAt||s.doneAt?new Date(s.completedAt||s.doneAt).toLocaleDateString("fr-FR"):"—"}</td><td style="color:${isSsDoneStep(s)?"#059669":"#d97706"}">${isSsDoneStep(s)?"✓ Complété":"En attente"}</td></tr>`).join("")}
</tbody></table>
<h2>Journal d'audit</h2>
<table><thead><tr><th>Date</th><th>Utilisateur</th><th>Action</th><th>Détail</th></tr></thead><tbody>
${(ssDoc.audit||[]).slice(0,15).map(a=>`<tr><td>${a.date?new Date(a.date).toLocaleString("fr-FR"):"—"}</td><td>${a.user||"—"}</td><td>${a.action||"—"}</td><td>${a.detail||"—"}</td></tr>`).join("")}
</tbody></table>
<div class="foot">Ce certificat a été généré automatiquement par SoftSign · ${new Date().toLocaleString("fr-FR")} · ID: ${ssDoc.id}</div>
</div></body></html>`;
    const w=window.open("","_blank");
    if(w){w.document.write(html);w.document.close();setTimeout(()=>w.print(),400);}
  }

  function attachDoc(ssDoc){
    const synced=syncSoftSignSignedDoc(doc,ssDoc,users);
    onUpdate(synced.doc);
    setAttached(softSignStoredIds(synced.doc));
  }
  function annexeToSoftSignDoc(a){
    return{id:a.softSignId,ref:a.softSignRef,status:a.softSignStatus,type:a.type_doc,title:a.title,projectName:a.projectName,site:a.site,workflowName:a.softSignWorkflow,steps:a.softSignSteps,audit:a.softSignAudit};
  }
  function getAttachedAnnexe(ssDoc){
    return[...(doc.annexes||[]),...(doc.anx||[])].find(a=>isSoftSignAnnexe(a)&&a.softSignId===ssDoc?.id);
  }

  const inpS={padding:"8px 10px",border:`1px solid ${BD_SS}`,borderRadius:7,fontSize:12.5,fontFamily:FONT_SS,background:"#fff",width:"100%",boxSizing:"border-box"};
  const StatusChip=({status})=>{
    const m={signe:{l:"Signé",c:"#15803d",bg:"#f0fdf4"},termine:{l:"Terminé",c:"#059669",bg:"#ecfdf5"}};
    const s=m[status]||{l:status,c:"#475569",bg:"#f8fafc"};
    return<span style={{padding:"2px 9px",borderRadius:10,fontSize:11,fontWeight:700,background:s.bg,color:s.c,border:`1px solid ${s.c}33`}}>{s.l}</span>;
  };

  return(
    <div style={{fontFamily:FONT_SS}}>
      {/* Section header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <div>
          <div style={{fontSize:14,fontWeight:800,color:"#0f172a"}}>Documents signés SoftSign</div>
          <div style={{fontSize:12,color:"#64748b",marginTop:2}}>Recherchez et rattachez un document déjà signé électroniquement à ce dossier SoftDocs.</div>
        </div>
        <button onClick={()=>setShowFilters(f=>!f)} style={{padding:"7px 14px",borderRadius:7,border:`1px solid ${BD_SS}`,background:showFilters?"#f5f3ff":"#fff",color:showFilters?P_SS:"#475569",fontSize:12.5,fontWeight:600,cursor:"pointer",fontFamily:FONT_SS,display:"flex",alignItems:"center",gap:6}}>
          🔍 {showFilters?"Masquer":"Recherche avancée"}{hasFilters&&<span style={{width:7,height:7,borderRadius:"50%",background:P_SS,display:"inline-block"}}/>}
        </button>
      </div>

      {/* Search filters */}
      {showFilters&&(
        <div style={{background:"#f8fafc",border:`1px solid ${BD_SS}`,borderRadius:10,padding:16,marginBottom:16}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:10}}>
            <div><div style={{fontSize:11,fontWeight:700,color:"#64748b",marginBottom:4}}>Référence</div>
              <select style={inpS} value={filters.ref} onChange={e=>setFilters(p=>({...p,ref:e.target.value}))}>
                <option value="">Toutes les références</option>
                {refOptions.map(v=><option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div><div style={{fontSize:11,fontWeight:700,color:"#64748b",marginBottom:4}}>Titre</div>
              <select style={inpS} value={filters.titre} onChange={e=>setFilters(p=>({...p,titre:e.target.value}))}>
                <option value="">Tous les titres</option>
                {titleOptions.map(v=><option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div><div style={{fontSize:11,fontWeight:700,color:"#64748b",marginBottom:4}}>Type</div>
              <select style={inpS} value={filters.type} onChange={e=>setFilters(p=>({...p,type:e.target.value,workflow:""}))}>
                <option value="">Tous</option>
                {typeOptions.map(t=><option key={t.id} value={t.id}>{t.label}</option>)}
                {typeOptions.length===0&&SS_DOC_TYPES.map(t=><option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </div>
            <div><div style={{fontSize:11,fontWeight:700,color:"#64748b",marginBottom:4}}>Projet</div>
              <select style={inpS} value={filters.projet} onChange={e=>setFilters(p=>({...p,projet:e.target.value,site:""}))}>
                <option value="">Tous les projets</option>
                {projectOptions.map(v=><option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div><div style={{fontSize:11,fontWeight:700,color:"#64748b",marginBottom:4}}>Site</div>
              <select style={inpS} value={filters.site} onChange={e=>setFilters(p=>({...p,site:e.target.value}))}>
                <option value="">Tous les sites</option>
                {siteOptions.map(v=><option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10}}>
            <div><div style={{fontSize:11,fontWeight:700,color:"#64748b",marginBottom:4}}>Workflow</div>
              <select style={inpS} value={filters.workflow} onChange={e=>setFilters(p=>({...p,workflow:e.target.value}))}>
                <option value="">Tous les workflows</option>
                {workflowOptions.map(v=><option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div><div style={{fontSize:11,fontWeight:700,color:"#64748b",marginBottom:4}}>Signataire</div>
              <select style={inpS} value={filters.signataire} onChange={e=>setFilters(p=>({...p,signataire:e.target.value}))}>
                <option value="">Tous les signataires</option>
                {signerOptions.map(v=><option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div><div style={{fontSize:11,fontWeight:700,color:"#64748b",marginBottom:4}}>Date début</div><input type="date" style={inpS} value={filters.dateFrom} onChange={e=>setFilters(p=>({...p,dateFrom:e.target.value}))}/></div>
            <div><div style={{fontSize:11,fontWeight:700,color:"#64748b",marginBottom:4}}>Date fin</div><input type="date" style={inpS} value={filters.dateTo} onChange={e=>setFilters(p=>({...p,dateTo:e.target.value}))}/></div>
            <div><div style={{fontSize:11,fontWeight:700,color:"#64748b",marginBottom:4}}>Montant</div><input style={inpS} placeholder="Ex : 500000" value={filters.montant} onChange={e=>setFilters(p=>({...p,montant:e.target.value}))}/></div>
          </div>
          <div style={{display:"flex",justifyContent:"flex-end",marginTop:10}}>
            <button onClick={()=>setFilters(emptyF)} style={{padding:"6px 14px",borderRadius:7,border:`1px solid ${BD_SS}`,background:"#fff",cursor:"pointer",fontSize:12,fontFamily:FONT_SS,color:"#64748b"}}>↺ Réinitialiser</button>
          </div>
        </div>
      )}

      {/* Results table */}
      <div style={{border:`1px solid ${BD_SS}`,borderRadius:10,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontFamily:FONT_SS}}>
          <thead>
            <tr style={{background:"#f8fafc",borderBottom:`1px solid ${BD_SS}`}}>
              {["Référence","Projet","Site","Titre","Signé par (dernière étape)","Date de signature","Statut","Actions"].map(h=>(
                <th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:10.5,color:"#64748b",textTransform:"uppercase",letterSpacing:".06em",fontWeight:800,whiteSpace:"nowrap"}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length===0&&(
              <tr><td colSpan={8} style={{padding:32,textAlign:"center",color:"#94a3b8"}}>
                <div style={{fontSize:32,marginBottom:8}}>📂</div>
                <div style={{fontWeight:600,fontSize:13}}>{hasFilters?"Aucun document ne correspond aux critères":"Aucun document signé disponible dans SoftSign"}</div>
                <div style={{fontSize:12,marginTop:4}}>Les documents doivent être au statut « Signé » ou « Terminé » dans SoftSign.</div>
              </td></tr>
            )}
            {filtered.map(ssDoc=>{
              const isAttached=attached.has(ssDoc.id);
              return(
                <tr key={ssDoc.id} style={{borderTop:`1px solid ${BD_SS}`,transition:"background .1s"}}
                  onMouseEnter={e=>{e.currentTarget.style.background="#fafafa";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="";}}
                >
                  <td style={{padding:"10px 12px"}}>
                    <div style={{fontWeight:700,fontSize:12.5,color:"#0f172a"}}>{ssDoc.ref}</div>
                    <div style={{fontSize:10.5,color:"#94a3b8"}}>{ssDoc.type}</div>
                  </td>
                  <td style={{padding:"10px 12px",fontSize:12.5,color:"#374151"}}>{ssDoc.projectName||ssDoc.projectId||"—"}</td>
                  <td style={{padding:"10px 12px",fontSize:12.5,color:"#374151"}}>{ssDoc.site||"—"}</td>
                  <td style={{padding:"10px 12px",fontSize:12.5,color:"#374151",maxWidth:180}}>
                    <div style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ssDoc.title||"—"}</div>
                    <div style={{fontSize:10.5,color:"#94a3b8"}}>{ssDoc.workflowName||"—"}</div>
                  </td>
                  <td style={{padding:"10px 12px"}}>
                    <div style={{fontWeight:600,fontSize:12.5}}>{getLastSigner(ssDoc)}</div>
                  </td>
                  <td style={{padding:"10px 12px",fontSize:12,color:"#374151",whiteSpace:"nowrap"}}>{getSignDate(ssDoc)}</td>
                  <td style={{padding:"10px 12px"}}><StatusChip status={ssDoc.status}/></td>
                  <td style={{padding:"10px 12px"}}>
                    <div style={{display:"flex",gap:5,flexWrap:"nowrap"}}>
                      {/* Aperçu */}
                      <button onClick={()=>setPreview(ssDoc)} title="Aperçu" style={{padding:"5px 9px",borderRadius:6,border:`1px solid ${BD_SS}`,background:"#fff",cursor:"pointer",fontSize:11.5,fontWeight:600,color:"#475569",fontFamily:FONT_SS,whiteSpace:"nowrap"}}>👁 Aperçu</button>
                      {/* Télécharger cert */}
                      <button onClick={()=>openCert(ssDoc)} title="Certificat PDF" style={{padding:"5px 9px",borderRadius:6,border:`1px solid ${BD_SS}`,background:"#fff",cursor:"pointer",fontSize:11.5,fontWeight:600,color:P_SS,fontFamily:FONT_SS,whiteSpace:"nowrap"}}>📜 Certificat</button>
                      {/* Rattacher */}
                      {isAttached?(
                        <span style={{padding:"5px 9px",borderRadius:6,background:"#f0fdf4",border:"1px solid #bbf7d0",fontSize:11.5,fontWeight:700,color:"#15803d",whiteSpace:"nowrap"}}>✓ Rattaché</span>
                      ):(
                        <button onClick={()=>attachDoc(ssDoc)} title="Rattacher aux annexes SoftDocs" style={{padding:"5px 9px",borderRadius:6,border:"none",background:"linear-gradient(135deg,#4c1d95,#7c3aed)",color:"#fff",cursor:"pointer",fontSize:11.5,fontWeight:700,fontFamily:FONT_SS,whiteSpace:"nowrap"}}>⊕ Rattacher</button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{padding:"8px 14px",borderTop:`1px solid ${BD_SS}`,fontSize:11.5,color:"#94a3b8",background:"#fafafa"}}>
          {filtered.length} document{filtered.length!==1?"s":""} signé{filtered.length!==1?"s":""} · {attached.size} rattaché{attached.size!==1?"s":""}
        </div>
      </div>

      {/* Attached annexes from SoftSign */}
      {(doc.annexes||[]).filter(isSoftSignAnnexe).length>0&&(
        <div style={{marginTop:16}}>
          <div style={{fontSize:11,fontWeight:800,color:"#64748b",textTransform:"uppercase",letterSpacing:".07em",marginBottom:10}}>Documents signés SoftSign rattachés à ce dossier</div>
          {(doc.annexes||[]).filter(isSoftSignAnnexe).map(a=>(
            <div key={a.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:"#f5f3ff",border:"1px solid #ddd6fe",borderRadius:10,marginBottom:8}}>
              <span style={{fontSize:24,flexShrink:0}}>📄</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:700,fontSize:13,color:"#0f172a"}}>{a.name||a.nom}</div>
                <div style={{fontSize:11.5,color:"#6d28d9",marginTop:2}}>
                  Signé par <b>{a.softSignSigner}</b> · {a.softSignSignDate} · Workflow : {a.softSignWorkflow}
                </div>
                <div style={{fontSize:11,color:"#94a3b8",marginTop:1}}>ID SoftSign : {a.softSignId} · Réf. : {a.softSignRef}</div>
              </div>
              <div style={{display:"flex",gap:6,flexShrink:0}}>
                <span style={{padding:"3px 10px",borderRadius:10,fontSize:11,fontWeight:700,background:"#f0fdf4",color:"#15803d",border:"1px solid #bbf7d0"}}>✓ Signé</span>
                <button onClick={()=>setPreview(annexeToSoftSignDoc(a))}
                  style={{padding:"4px 10px",borderRadius:7,border:`1px solid ${BD_SS}`,background:"#fff",cursor:"pointer",fontSize:11.5,fontWeight:700,color:"#475569",fontFamily:FONT_SS}}>👁 Consulter</button>
                <button onClick={()=>downloadSoftSignAnnexe(a)}
                  style={{padding:"4px 10px",borderRadius:7,border:`1px solid #bbf7d0`,background:"#fff",cursor:"pointer",fontSize:11.5,fontWeight:700,color:"#15803d",fontFamily:FONT_SS}}>↓ Télécharger</button>
                {a.hasCertificate&&(
                  <button onClick={()=>openCert(annexeToSoftSignDoc(a))}
                    style={{padding:"4px 10px",borderRadius:7,border:`1px solid #ddd6fe`,background:"#fff",cursor:"pointer",fontSize:11.5,fontWeight:700,color:P_SS,fontFamily:FONT_SS}}>📜 Certificat</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview modal */}
      {preview&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:99999,display:"flex",alignItems:"center",justifyContent:"center",padding:16,fontFamily:FONT_SS}}>
          <div style={{background:"#fff",borderRadius:14,width:"100%",maxWidth:740,maxHeight:"90vh",display:"flex",flexDirection:"column",boxShadow:"0 24px 72px rgba(0,0,0,.22)",overflow:"hidden"}}>
            <div style={{padding:"14px 20px",borderBottom:`1px solid ${BD_SS}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontWeight:800,fontSize:14}}>{preview.ref} — {preview.title}</div>
                <div style={{fontSize:11.5,color:"#64748b",marginTop:2}}>Workflow : {preview.workflowName} · Statut : {preview.status}</div>
              </div>
              <button onClick={()=>setPreview(null)} style={{width:28,height:28,borderRadius:"50%",border:"none",background:"#f1f5f9",cursor:"pointer",fontSize:16}}>×</button>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:20}}>
              {/* Doc summary */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:18}}>
                {[["Référence",preview.ref],["Projet",preview.projectName||"—"],["Site",preview.site||"—"],["Type",preview.type||"—"],["Montant",preview.amount?`${fmtN(preview.amount)} Ar`:"—"],["Date création",preview.createdAt?new Date(preview.createdAt).toLocaleDateString("fr-FR"):"—"]].map(([k,v])=>(
                  <div key={k} style={{padding:"10px 12px",background:"#f8fafc",borderRadius:8,border:`1px solid ${BD_SS}`}}>
                    <div style={{fontSize:10,color:"#64748b",fontWeight:700,textTransform:"uppercase",marginBottom:3}}>{k}</div>
                    <div style={{fontSize:13,fontWeight:700}}>{v}</div>
                  </div>
                ))}
              </div>
              {/* Steps */}
              <div style={{fontSize:11,fontWeight:800,color:"#64748b",textTransform:"uppercase",letterSpacing:".07em",marginBottom:8}}>Étapes de signature</div>
              <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:18}}>
                {(preview.steps||[]).map((s,i)=>{
                  const isDone=isSsDoneStep(s);const isAct=s.status==="active";
                  return(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",background:isDone?"#f0fdf4":isAct?"#f5f3ff":"#f8fafc",border:`1px solid ${isDone?"#bbf7d0":isAct?"#ddd6fe":"#e2e8f0"}`,borderRadius:8}}>
                      <div style={{width:22,height:22,borderRadius:"50%",background:isDone?"#16a34a":isAct?P_SS:"#cbd5e1",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900}}>{isDone?"✓":i+1}</div>
                      <div style={{flex:1,fontSize:12.5,fontWeight:isDone?700:400,color:isDone?"#15803d":"#374151"}}>{s.label}</div>
                      <span style={{fontSize:11,color:isDone?"#16a34a":isAct?P_SS:"#94a3b8",fontWeight:700}}>{isDone?"Complété":isAct?"En cours":"En attente"}</span>
                    </div>
                  );
                })}
              </div>
              {/* Audit */}
              <div style={{fontSize:11,fontWeight:800,color:"#64748b",textTransform:"uppercase",letterSpacing:".07em",marginBottom:8}}>Historique</div>
              {(preview.audit||[]).slice(0,8).map((a,i)=>(
                <div key={i} style={{display:"flex",gap:10,padding:"6px 0",borderBottom:"1px solid #f1f5f9",fontSize:12}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:P_SS,marginTop:5,flexShrink:0}}/>
                  <div><b>{a.action}</b> · {a.user} · <span style={{color:"#94a3b8"}}>{a.date?new Date(a.date).toLocaleString("fr-FR"):"—"}</span></div>
                </div>
              ))}
            </div>
            <div style={{padding:"12px 20px",borderTop:`1px solid ${BD_SS}`,display:"flex",justifyContent:"space-between"}}>
              <button onClick={()=>{openCert(preview);}} style={{padding:"8px 16px",borderRadius:7,border:`1px solid ${BD_SS}`,background:"#fff",cursor:"pointer",fontSize:13,fontFamily:FONT_SS,color:P_SS,fontWeight:600}}>📜 Télécharger certificat</button>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setPreview(null)} style={{padding:"8px 16px",borderRadius:7,border:`1px solid ${BD_SS}`,background:"#fff",cursor:"pointer",fontSize:13,fontFamily:FONT_SS}}>Fermer</button>
                {attached.has(preview.id)?(
                  <button onClick={()=>downloadSoftSignAnnexe(getAttachedAnnexe(preview)||createSoftSignSignedAnnexe(preview,users))} style={{padding:"8px 18px",borderRadius:7,border:"none",background:"#16a34a",color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:FONT_SS}}>↓ Télécharger</button>
                ):(
                  <button onClick={()=>{attachDoc(preview);setPreview(null);}} style={{padding:"8px 18px",borderRadius:7,border:"none",background:"linear-gradient(135deg,#4c1d95,#7c3aed)",color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:FONT_SS}}>⊕ Rattacher ce document</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Smart tab: shows Case1 status + Case2 search ── */
function SoftSignTabContent({doc,onUpdate,setSigningDoc}){
  const[ssDocs]=useState(()=>ssRead(SOFTSIGN_DOCS_KEY,[]));
  const linkedDoc=doc.softSignRef?ssDocs.find(d=>d.id===doc.softSignRef):null;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      {linkedDoc&&(
        <div>
          <div style={{fontSize:11,fontWeight:800,color:"#64748b",textTransform:"uppercase",letterSpacing:".07em",marginBottom:12}}>Statut envoi SoftSign (Cas 1)</div>
          <SoftSignStatusPanel doc={doc} softSignDoc={linkedDoc} onUpdate={onUpdate}/>
          <div style={{height:1,background:"#e2e8f0",margin:"20px 0"}}/>
        </div>
      )}
      <SoftSignSearchAttachPanel doc={doc} onUpdate={onUpdate}/>
      {!linkedDoc&&(
        <div>
          <div style={{height:1,background:"#e2e8f0",margin:"4px 0 16px"}}/>
          <SoftSignAttachPanel doc={doc} onUpdate={onUpdate} setSigningDoc={setSigningDoc}/>
        </div>
      )}
    </div>
  );
}

function SoftSignAttachPanel({doc,onUpdate,setSigningDoc}){
  const{authUser,users,projets}=useApp();
  const[collabDocs,setCollabDocs]=useState([]);
  const[softDocs,setSoftDocs]=useState([]);
  const[sendType,setSendType]=useState("contrat");
  const[autoStart,setAutoStart]=useState(true);
  const[sending,setSending]=useState(false);
  const reload=()=>{
    try{const v=localStorage.getItem(COLLAB_SS_KEY);setCollabDocs(v?JSON.parse(v):[]);}catch{setCollabDocs([]);}
    try{const v=localStorage.getItem(SOFTSIGN_DOCS_KEY);setSoftDocs(v?JSON.parse(v):[]);}catch{setSoftDocs([]);}
  };
  useEffect(()=>{reload();},[]);

  const linkedDoc=doc.softSignRef?collabDocs.find(d=>d.id===doc.softSignRef):null;
  const linkedSoftDoc=doc.softSignRef?softDocs.find(d=>d.id===doc.softSignRef):null;
  const available=collabDocs.filter(d=>d.status!=="signe");
  const ssCandidates=softDocs.filter(d=>!["termine","signe"].includes(d.status));

  const link=(cd)=>{onUpdate({...doc,softSignRef:cd.id});};
  const linkSoftDoc=(sd)=>{onUpdate({...doc,softSignRef:sd.id,softSignStatus:sd.status});};
  const unlink=()=>{onUpdate({...doc,softSignRef:null});};
  const readJson=(key,fallback)=>{try{const v=localStorage.getItem(key);return v?JSON.parse(v):fallback;}catch{return fallback;}};
  const writeJson=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));}catch{}};
  const project=projets?.find(p=>p.id===(doc.proj||doc.projectId))||projets?.[0];
  const draftForSoftSign={
    type:sendType,
    ref:doc.ch?.numero||doc.id,
    title:doc.notes||doc.type||`Document ${doc.id}`,
    amount:doc.mtR||doc.mt||0,
    amountTtc:doc.mtR||doc.mt||0,
    currency:doc.ch?.devise||"MGA",
    date:doc.ch?.date_doc||new Date().toISOString().slice(0,10),
    projectId:doc.proj||project?.id||"",
    projectName:project?.nom||"",
    site:doc.site||project?.sites?.[0]||"",
    fileName:`${doc.id}.pdf`,
    ocrData:doc.ch?{...doc.ch,score:doc.ocr,source:"softdocs"}:null,
    softDocsRef:doc.id,
  };
  const suggestedWorkflow=suggestWorkflow(readJson(SOFTSIGN_WORKFLOWS_KEY,INIT_SS_WORKFLOWS_PRO),draftForSoftSign);

  function sendToSoftSign(){
    setSending(true);
    const workflows=readJson(SOFTSIGN_WORKFLOWS_KEY,INIT_SS_WORKFLOWS_PRO);
    const workflow=autoStart?suggestWorkflow(workflows,draftForSoftSign):null;
    const allSoftSignDocs=readJson(SOFTSIGN_DOCS_KEY,[]);
    const newDoc=createSoftSignDocument({
      draft:draftForSoftSign,
      workflow,
      users:users||[],
      delegations:readJson(SOFTSIGN_DELEGATIONS_KEY,INIT_SS_DELEGATIONS_PRO),
      authUser,
      origin:"softdocs",
    });
    const enriched={...newDoc,sourceSoftDocs:doc.id,status:workflow?"en_cours":"en_attente_traitement",audit:[...(newDoc.audit||[]),{date:new Date().toISOString(),user:authUser?.nom||"SoftDocs",action:"integration_softdocs",detail:`Document GED ${doc.id} envoye vers SoftSign`}]};
    writeJson(SOFTSIGN_DOCS_KEY,[enriched,...allSoftSignDocs]);
    onUpdate({...doc,softSignRef:enriched.id,softSignStatus:enriched.status});
    setSoftDocs([enriched,...allSoftSignDocs]);
    setSending(false);
  }

  const ss={color:"#4c1d95"};
  const BD2="#e3e6ea";

  return(
    <div style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <div>
          <div style={{fontSize:15,fontWeight:800,color:"#0f172a"}}>✍️ Rattachement SoftSign</div>
          <div style={{fontSize:12,color:"#64748b",marginTop:3}}>
            Liez ce document SoftDocs à un fichier déposé dans l'espace collaborateur SoftSign pour signature électronique
          </div>
        </div>
        <button onClick={reload}
          style={{padding:"7px 12px",borderRadius:7,border:`1px solid ${BD2}`,background:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"#64748b"}}>
          ↻ Actualiser
        </button>
      </div>

      {/* SoftDocs -> SoftSign */}
      <div style={{background:"#f5f3ff",border:"1px solid #ddd6fe",borderRadius:10,padding:16,marginBottom:18}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,marginBottom:12}}>
          <div>
            <div style={{fontSize:14,fontWeight:800,color:"#4c1d95"}}>Envoyer pour signature SoftSign</div>
            <div style={{fontSize:12,color:"#6b21a8",marginTop:3}}>
              Le document GED sera cree dans SoftSign avec metadonnees OCR, projet, site, workflow suggere et journal d'audit.
            </div>
          </div>
          {linkedSoftDoc&&<span style={{fontSize:11,fontWeight:800,color:"#059669",background:"#ecfdf5",padding:"4px 10px",borderRadius:20}}>Deja envoye</span>}
        </div>
        {linkedSoftDoc?(
          <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:12,alignItems:"center",background:"#fff",border:`1px solid ${BD2}`,borderRadius:9,padding:12}}>
            <div>
              <div style={{fontSize:13,fontWeight:800,color:"#0f172a"}}>{linkedSoftDoc.ref} - {linkedSoftDoc.title}</div>
              <div style={{fontSize:11.5,color:"#64748b",marginTop:3}}>
                Workflow: {linkedSoftDoc.workflowName||"A rattacher"} · Statut: {linkedSoftDoc.status}
              </div>
            </div>
            <button onClick={()=>setSigningDoc({...linkedSoftDoc,_saveKey:SOFTSIGN_DOCS_KEY})}
              style={{padding:"8px 14px",borderRadius:8,border:"none",background:"#7c3aed",color:"#fff",fontSize:12,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>
              Ouvrir
            </button>
          </div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr auto",gap:10,alignItems:"end"}}>
            <label>
              <span style={{display:"block",fontSize:11,fontWeight:800,color:"#4c1d95",marginBottom:5}}>Type SoftSign</span>
              <select value={sendType} onChange={e=>setSendType(e.target.value)}
                style={{width:"100%",padding:"9px 10px",borderRadius:8,border:`1px solid ${BD2}`,background:"#fff",fontSize:12.5,fontFamily:"inherit"}}>
                {SS_DOC_TYPES.map(t=><option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </label>
            <label style={{fontSize:12,color:"#4c1d95",fontWeight:700,display:"flex",alignItems:"center",gap:8,paddingBottom:9}}>
              <input type="checkbox" checked={autoStart} onChange={e=>setAutoStart(e.target.checked)}/>
              Lancer le workflow suggere ({suggestedWorkflow?.name||"aucun"})
            </label>
            <button onClick={sendToSoftSign} disabled={sending}
              style={{padding:"10px 16px",borderRadius:8,border:"none",background:sending?"#cbd5e1":"#7c3aed",color:"#fff",fontSize:12.5,fontWeight:800,cursor:sending?"not-allowed":"pointer",fontFamily:"inherit"}}>
              {sending?"Envoi...":"Envoyer"}
            </button>
          </div>
        )}
      </div>

      {/* Linked doc */}
      {linkedDoc?(
        <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10,padding:16,marginBottom:18}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
            <span style={{fontSize:26}}>📄</span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:14,fontWeight:700,color:"#0f172a",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{linkedDoc.name}</div>
              <div style={{fontSize:11.5,color:"#64748b",marginTop:2}}>
                Déposé par <b>{linkedDoc.uploadedByNom||linkedDoc.uploadedBy}</b> · {linkedDoc.date?new Date(linkedDoc.date).toLocaleDateString("fr-FR"):"—"}
              </div>
            </div>
            <span style={{fontSize:11,fontWeight:700,color:(COLLAB_STATUS[linkedDoc.status]||COLLAB_STATUS.depose).c,background:"#f8fafc",padding:"3px 10px",borderRadius:20,border:`1px solid ${BD2}`,whiteSpace:"nowrap"}}>
              {(COLLAB_STATUS[linkedDoc.status]||COLLAB_STATUS.depose).l}
            </span>
          </div>
          {linkedDoc.password&&(
            <div style={{fontSize:12,color:"#d97706",marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
              🔒 Ce document est protégé par mot de passe — il sera demandé à l'ouverture
            </div>
          )}
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setSigningDoc(linkedDoc)}
              style={{padding:"10px 20px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#4c1d95,#7c3aed)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
              ✍️ Ouvrir la signature
            </button>
            <button onClick={unlink}
              style={{padding:"10px 14px",borderRadius:8,border:`1px solid ${BD2}`,background:"#fff",fontSize:12.5,cursor:"pointer",color:"#64748b",fontFamily:"inherit"}}>
              ✕ Délier
            </button>
          </div>
        </div>
      ):!linkedSoftDoc&&(
        <div style={{background:"#fffbeb",border:"1px solid #fef3c7",borderRadius:8,padding:"10px 14px",marginBottom:16,fontSize:12,color:"#92400e",display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:16}}>⚠️</span>
          <span>Aucun document SoftSign lié. Sélectionnez un document ci-dessous pour le rattacher à ce dossier.</span>
        </div>
      )}

      {/* Collab docs list to pick from */}
      {!linkedDoc&&!linkedSoftDoc&&(
        <div>
          <div style={{fontSize:11,fontWeight:700,color:"#475569",marginBottom:10,textTransform:"uppercase",letterSpacing:".06em",display:"flex",alignItems:"center",gap:8}}>
            Documents disponibles
            <span style={{fontSize:12,fontWeight:700,color:"#7c3aed",background:"#f5f3ff",padding:"1px 8px",borderRadius:20,textTransform:"none",letterSpacing:0}}>
              {available.length}
            </span>
          </div>
          {available.length===0?(
            <div style={{textAlign:"center",padding:"32px 0",color:"#94a3b8",background:"#f8fafc",borderRadius:10,border:`2px dashed ${BD2}`}}>
              <div style={{fontSize:36,marginBottom:8}}>📂</div>
              <div style={{fontSize:13,fontWeight:600}}>Aucun document disponible</div>
              <div style={{fontSize:12,marginTop:4}}>Les collaborateurs peuvent déposer des documents via l'espace SoftSign</div>
            </div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {available.map(cd=>{
                const st=COLLAB_STATUS[cd.status]||COLLAB_STATUS.depose;
                return(
                  <div key={cd.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:"#fff",border:`1px solid ${BD2}`,borderRadius:9}}>
                    <span style={{fontSize:22,flexShrink:0}}>📄</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:600,color:"#1e293b",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cd.name}</div>
                      <div style={{fontSize:11,color:"#64748b",marginTop:2,display:"flex",alignItems:"center",gap:6}}>
                        <span>{cd.uploadedByNom||cd.uploadedBy}</span>
                        <span>·</span>
                        <span>{cd.date?new Date(cd.date).toLocaleDateString("fr-FR"):"—"}</span>
                        {cd.password&&<span style={{color:"#d97706",fontWeight:600}}>🔒</span>}
                      </div>
                    </div>
                    <span style={{fontSize:11,fontWeight:700,color:st.c,whiteSpace:"nowrap"}}>{st.l}</span>
                    <button onClick={()=>link(cd)}
                      style={{padding:"7px 16px",borderRadius:7,border:"none",background:"#7c3aed",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>
                      Lier
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      {!linkedDoc&&!linkedSoftDoc&&ssCandidates.length>0&&(
        <div style={{marginTop:18}}>
          <div style={{fontSize:11,fontWeight:700,color:"#475569",marginBottom:10,textTransform:"uppercase",letterSpacing:".06em"}}>
            Documents SoftSign operationnels
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {ssCandidates.slice(0,6).map(sd=>(
              <div key={sd.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:"#fff",border:`1px solid ${BD2}`,borderRadius:9}}>
                <span style={{fontSize:22,flexShrink:0}}>📄</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#1e293b",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{sd.ref} - {sd.title}</div>
                  <div style={{fontSize:11,color:"#64748b",marginTop:2}}>{sd.workflowName||"A rattacher"} · {sd.status}</div>
                </div>
                <button onClick={()=>linkSoftDoc(sd)}
                  style={{padding:"7px 16px",borderRadius:7,border:"none",background:"#7c3aed",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>
                  Lier
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function DocDetail({doc,onBack,onUpdate,ctx}){
  const{users,authUser,types,causesRefus,setView,setDocCtx}=useApp();
  const[tab,setTab]=useState("circuit");
  const[modal,setModal]=useState(null); // null | "validate" | "reject" | "reject-confirm" | "redirect"
  const[rejetComment,setRejetComment]=useState("");
  const[rejetCauses,setRejetCauses]=useState([]);
  const[causesOpen,setCausesOpen]=useState(false);
  const[editMt,setEditMt]=useState(false);
  const[newMt,setNewMt]=useState(String(doc.mtR||doc.mt||""));
  const[affectTypeModal,setAffectTypeModal]=useState(false);
  const[selectedTid,setSelectedTid]=useState(doc.tid||"");
  const[copyOk,setCopyOk]=useState(false);
  const[transferOk,setTransferOk]=useState(false);
  const[relanceOk,setRelanceOk]=useState(false);
  const[signingDoc,setSigningDoc]=useState(null);
  const[ssWizard,setSsWizard]=useState(false);

  const nextEtape=getActiveStep(doc);
  const SIGN_ICON=<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>;
  const displayTabs=[...TABS,{k:"softsign",label:"Signature SoftSign",icon:SIGN_ICON}];
  const stepIdx=doc.etapes?.indexOf(nextEtape)??-1;
  const canValidate=!!nextEtape;
  const canRedirect=canValidate&&stepIdx>0;
  const canBap=ctx==="envoyes"&&!doc.bap&&doc.st==="VALIDÉ"&&doc.etapes?.every(e=>e.statut==="VALIDÉ");
  const isRejected=doc.st==="REJETÉ";
  const isRedirected=doc.st==="REDIRIGÉ"||(doc.etapes||[]).some(e=>e.statut==="REDIRIGÉ");
  /* Doc verrouillé en attente workflow SoftSign → toutes actions désactivées */
  const isInSoftSign=!!(doc.softSignLocked||doc.softSignStatus==="en_signature_softsign");
  /* Droit modification montant */
  const canModifMontant=!!(authUser?.droits?.modifMontant);
  /* Retour: docs réception (recus-f, courrier, confids) → AR + Affecter type seulement */
  const RECEPTION_CTXS=["recus-f","courrier","confids"];
  const isReceptionCtx=RECEPTION_CTXS.includes(ctx);
  const userId=authUser?.id||"U002";

  /* ── Valider ── */
  function handleValidate(params){
    const updated=actionValider(doc,userId,params);
    onUpdate(updated);
    setModal(null);
  }

  /* ── Rejeter (après confirmation) ── */
  function handleRejet(){
    if(!rejetComment.trim()||rejetCauses.length===0)return;
    const comment=rejetCauses.map(id=>(causesRefus||[]).find(c=>c.id===id)?.label||id).join(', ')+(rejetComment.trim()?` — ${rejetComment.trim()}`:'');
    const updated=actionRejeter(doc,userId,{comment,causes:rejetCauses});
    onUpdate(updated);
    setModal(null);
    setRejetComment("");
  }

  /* ── Rediriger ── */
  function handleRedirect(params){
    const updated=actionRediriger(doc,userId,params);
    onUpdate(updated);
    setModal(null);
  }

  /* ── Copier lien détail du document ── */
  function copyLink(){
    const url=window.location.origin+"?doc="+doc.id;
    navigator.clipboard?.writeText(url).then(()=>{setCopyOk(true);setTimeout(()=>setCopyOk(false),2000);});
  }

  /* ── Transférer vers Tom²Pro (insertion simulée) ── */
  function transferToTompro(){
    const payload={ref:doc.id,type:doc.type,montant:doc.mtR||doc.mt,fournisseur:doc.fourn,date:doc.date,statut:doc.st,lien:window.location.origin+"?doc="+doc.id};
    console.log("[Tom²Pro] Transfert →",payload);
    // En production : fetch("/api/tompro/link", {method:"POST", body:JSON.stringify(payload)})
    setTransferOk(true);setTimeout(()=>setTransferOk(false),2500);
  }

  /* ── Envoyer vers SoftSign ── */
  function handleSendToSoftSign(ssDoc){
    onUpdate({...doc,softSignRef:ssDoc.id,softSignStatus:"en_signature_softsign",softSignLocked:true,softSignSentAt:new Date().toISOString()});
    setSsWizard(false);
  }

  /* ── Affecter un type de document (workflow) ── */
  /* Le doc quitte les 3 menus réception → passe EN VALIDATION → menu "En cours" */
  function affectType(){
    if(!selectedTid)return;
    const typ=types.find(t=>t.id===selectedTid);
    if(!typ)return;
    /* Créer les étapes à partir du type sélectionné */
    const etapes=(typ.etapes||[]).map(e=>({
      ...e,
      statut:"EN ATTENTE",
      vActifs:e.v||[],
    }));
    const updated={...doc,tid:selectedTid,type:typ.nom,etapes,st:"EN VALIDATION"};
    onUpdate(updated);
    setAffectTypeModal(false);
    /* Naviguer vers En Cours */
    if(isReceptionCtx){
      setDocCtx(doc.conf?"c-enc":"en-cours");
      setView(doc.conf?"c-enc":"en-cours");
    }
  }

  function saveMt(){
    const v=parseFloat(newMt.replace(/\s/g,""));
    if(!isNaN(v))onUpdate({...doc,mtR:v});
    setEditMt(false);
  }

  /* ── Relancer ── */
  function sendRelance(){
    const hl=doc.historique||[];
    const etapeRetard=doc.etapes?.find(e=>e.statut==="EN RETARD");
    const valideurs=(etapeRetard?.v||[]).map(id=>{
      const u=users.find(x=>x.id===id);
      return u?u.nom:id;
    }).join(", ")||"—";
    const entry={
      type:"relance",
      date:now(),
      par:authUser?.nom||"?",
      etape:etapeRetard?.label||"—",
      valideurs,
      comment:"Mail de relance envoyé — Étape : "+(etapeRetard?.label||"—"),
    };
    onUpdate({...doc,historique:[...hl,entry],lastRelance:now()});
    setRelanceOk(true);
    setTimeout(()=>setRelanceOk(false),3500);
  }

  /* ── Detect retard: active step exists and has exceeded its deadline ── */
  const isRetard=doc.etapes?.some(e=>e.statut==="EN RETARD");
  const canRelance=isRetard;

  return(
    <div style={{animation:"fadeIn .2s ease"}}>
      {/* Header */}
      <div style={{display:"flex",gap:12,marginBottom:16,alignItems:"flex-start",flexWrap:"wrap"}}>
        <button onClick={onBack} style={btn("light",true)}>
          <span style={{display:"flex",transform:"rotate(180deg)"}}>{IC.chev}</span> Retour
        </button>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
            <h2 style={{fontSize:18,fontWeight:700,color:"#212529"}}>{doc.id}</h2>
            <Badge s={doc.st}/>
            {isRedirected&&doc.st!=="REDIRIGÉ"&&(
              <span style={{...bdg("#fff8e6","#856404",{fontSize:11}),display:"inline-flex",alignItems:"center",gap:4}}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>
                Redirigé
              </span>
            )}
            {doc.conf&&(
              <span style={{...bdg("#e9d8f5","#5e1d8a",{fontSize:11}),display:"inline-flex",alignItems:"center",gap:4}}>
                <span style={{display:"flex"}}>{IC.lockKey}</span> Confidentiel
              </span>
            )}
            {doc.bap&&(
              <span style={{...bdg(SUCL,SUCD,{fontSize:11}),display:"inline-flex",alignItems:"center",gap:4}}>
                <span style={{display:"flex"}}>{IC.checkCircle}</span> Bon à payer
              </span>
            )}
            {isInSoftSign&&(
              <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:20,background:"#ede9fe",border:"1px solid #a78bfa",color:"#6d28d9",fontSize:11,fontWeight:700}}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                En validation SoftSign
              </span>
            )}
          </div>
          <div style={{fontSize:12,color:MUT,marginTop:4}}>{doc.type} · {doc.fourn||"—"} · {doc.site} · {doc.date}</div>
        </div>

        {/* Actions */}
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {isInSoftSign&&(
            <span style={{display:"inline-flex",alignItems:"center",gap:7,padding:"7px 14px",borderRadius:7,background:"#f1f0fe",border:"1px solid #c4b5fd",color:"#7c3aed",fontSize:12.5,fontWeight:700,opacity:.85}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Document verrouillé — en cours de signature SoftSign
            </span>
          )}
          {!isInSoftSign&&canValidate&&!isRejected&&!isReceptionCtx&&(
            <button onClick={()=>setModal("validate")} style={btn("success",true)}>
              <span style={{display:"flex"}}>{IC.chk}</span> Valider
            </button>
          )}
          {!isInSoftSign&&canRedirect&&!isRejected&&!isReceptionCtx&&(
            <button onClick={()=>setModal("redirect")}
              style={{...btn("light",true),borderColor:"#f5a623",color:"#856404",background:"#fff8e6"}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>
              Rediriger
            </button>
          )}
          {!isInSoftSign&&canValidate&&!isRejected&&!isReceptionCtx&&(
            <button onClick={()=>setModal("reject")} style={btn("danger",true)}>
              <span style={{display:"flex"}}>{IC.x}</span> Rejeter
            </button>
          )}
          {/* ── Relancer : visible dès qu'il y a une étape EN RETARD ── */}
          {!isInSoftSign&&canRelance&&(
            relanceOk
              ?<span style={{display:"inline-flex",alignItems:"center",gap:6,padding:"6px 14px",borderRadius:7,background:"#dcfce7",border:"1px solid #86efac",color:"#15803d",fontSize:12.5,fontWeight:700}}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                Mail envoyé !
              </span>
              :<button onClick={sendRelance}
                style={{display:"inline-flex",alignItems:"center",gap:6,
                  padding:"6px 14px",borderRadius:7,
                  border:"none",
                  background:"linear-gradient(135deg,#ea580c,#f97316)",
                  color:"#fff",cursor:"pointer",fontSize:12.5,fontWeight:700,
                  fontFamily:"inherit",
                  boxShadow:"0 2px 8px rgba(234,88,12,.35)",
                  transition:"all .15s"}}
                onMouseEnter={e=>{e.currentTarget.style.opacity=".88";e.currentTarget.style.transform="translateY(-1px)";}}
                onMouseLeave={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.transform="none";}}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                ✉ Relancer
              </button>
          )}
          {canBap&&(
            <button onClick={()=>onUpdate({...doc,bap:true,st:"BON À PAYER"})} style={btn("primary",true)}>
              <span style={{display:"flex"}}>{IC.creditCard}</span> Bon à payer
            </button>
          )}
          {/* ── Boutons réception : AR → Affecter type de document ── */}
          {isReceptionCtx&&(
            <>
              {!doc.AR&&(
                <button onClick={()=>onUpdate({...doc,AR:true,st:"REÇU"})} style={{...btn("light",true),background:"#e8f5e9",borderColor:"#81c784",color:"#2e7d32"}}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Accuser réception (AR)
                </button>
              )}
              {doc.AR&&(
                <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"5px 10px",borderRadius:6,background:"#e8f5e9",border:"1px solid #81c784",color:"#2e7d32",fontSize:12,fontWeight:600}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  AR effectué
                </span>
              )}
              {!doc.tid&&doc.AR&&(
                <button onClick={()=>setAffectTypeModal(true)} style={{...btn("light",true),background:"#fff8e6",borderColor:"#f5a623",color:"#856404"}}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  Affecter un type de document
                </button>
              )}
            </>
          )}
          {!isReceptionCtx&&!doc.AR&&(doc.st==="REÇU"||(doc.st!=="REJETÉ"&&!(doc.etapes?.length>0)))&&(
            <button onClick={()=>onUpdate({...doc,AR:true,st:"REÇU"})} style={{...btn("light",true),background:"#e8f5e9",borderColor:"#81c784",color:"#2e7d32"}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              Accuser réception (AR)
            </button>
          )}
          {!isReceptionCtx&&doc.AR&&!doc.tid&&(
            <button onClick={()=>setAffectTypeModal(true)} style={{...btn("light",true),background:"#fff8e6",borderColor:"#f5a623",color:"#856404"}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              Affecter un type
            </button>
          )}        </div>
      </div>

      {/* ── Boutons Copier lien / Tom²Pro ── */}
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
        <button onClick={copyLink}
          style={{display:"inline-flex",alignItems:"center",gap:8,padding:"9px 18px",borderRadius:8,border:"none",
            background:copyOk?"#0fa86c":"#1ecad3",color:"#fff",fontWeight:600,fontSize:13,cursor:"pointer",transition:"background .2s"}}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          {copyOk?"✓ Lien copié !":"Copier le lien"}
        </button>
        <button onClick={transferToTompro}
          style={{display:"inline-flex",alignItems:"center",gap:8,padding:"9px 18px",borderRadius:8,border:"none",
            background:transferOk?"#0fa86c":"#1ecad3",color:"#fff",fontWeight:600,fontSize:13,cursor:"pointer",transition:"background .2s"}}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          {transferOk?"✓ Transféré !":"Transférer le lien vers Tom²Pro"}
        </button>
        {!doc.softSignLocked&&(
          <button onClick={()=>setSsWizard(true)}
            style={{display:"inline-flex",alignItems:"center",gap:8,padding:"9px 18px",borderRadius:8,border:"none",
              background:"linear-gradient(135deg,#4c1d95,#7c3aed)",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",
              boxShadow:"0 2px 10px rgba(124,58,237,.35)",transition:"all .15s"}}
            onMouseEnter={e=>{e.currentTarget.style.opacity=".9";e.currentTarget.style.transform="translateY(-1px)";}}
            onMouseLeave={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.transform="none";}}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            Envoyer pour signature SoftSign
          </button>
        )}
        {doc.softSignLocked&&(
          <span style={{display:"inline-flex",alignItems:"center",gap:7,padding:"9px 16px",borderRadius:8,background:"#f5f3ff",border:"1px solid #ddd6fe",color:"#4c1d95",fontSize:13,fontWeight:700}}>
            🔒 En signature SoftSign
          </span>
        )}
      </div>

      {/* Summary cards */}
      <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"repeat(3,1fr)",gap:12,marginBottom:16}}>
        <div style={{...card(),padding:16}}>
          <div style={{fontSize:11,fontWeight:600,color:MUT,textTransform:"uppercase",marginBottom:6,display:"flex",alignItems:"center",gap:4}}>
            <span style={{display:"flex"}}>{IC.money}</span> Montant réel
          </div>
          {editMt?(
            <div style={{display:"flex",gap:6}}>
              <input value={newMt} onChange={e=>setNewMt(e.target.value)} style={{...inp({fontSize:13,padding:"6px 10px"}),flex:1}}/>
              <button onClick={saveMt} style={btn("success",true)}>{IC.chk}</button>
              <button onClick={()=>setEditMt(false)} style={btn("light",true)}>{IC.x}</button>
            </div>
          ):(
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:18,fontWeight:700,color:"#212529"}}>{fmtN(doc.mtR)}</span>
              {canModifMontant&&(
                <button onClick={()=>setEditMt(true)} style={{...btn("light",true),padding:"3px 8px"}}
                  title="Modifier le montant réel">
                  <span style={{display:"flex"}}>{IC.edit}</span>
                </button>
              )}
              {!canModifMontant&&(
                <span title="Modification non autorisée" style={{display:"flex",alignItems:"center",padding:"3px 7px",borderRadius:4,background:"#f0f0f0",cursor:"not-allowed"}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#adb5bd" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
              )}
            </div>
          )}
          {doc.planCompte&&<div style={{fontSize:11,color:MUT,marginTop:4}}>Compte : <b>{doc.planCompte}</b></div>}
        </div>
        <div style={{...card(),padding:16}}>
          <div style={{fontSize:11,fontWeight:600,color:MUT,textTransform:"uppercase",marginBottom:6,display:"flex",alignItems:"center",gap:4}}>
            <span style={{display:"flex"}}>{IC.map}</span> Projet / Site
          </div>
          <div style={{fontSize:14,fontWeight:600,color:"#212529"}}>{doc.proj||"—"}</div>
          <div style={{fontSize:12,color:MUT}}>{doc.site||"—"}</div>
        </div>
        <div style={{...card(),padding:16}}>
          <div style={{fontSize:11,fontWeight:600,color:MUT,textTransform:"uppercase",marginBottom:6,display:"flex",alignItems:"center",gap:4}}>
            <span style={{display:"flex"}}>{IC.robot}</span> Score OCR
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{flex:1,background:"#e9ecef",borderRadius:4,height:8}}>
              <div style={{width:`${doc.ocr||0}%`,height:"100%",background:doc.ocr>=85?"#28a745":doc.ocr>=70?"#ffc107":"#dc3545",borderRadius:4}}/>
            </div>
            <span style={{fontWeight:700,fontSize:15,color:"#212529"}}>{doc.ocr||0}%</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{...card()}}>
        <div style={{display:"flex",borderBottom:`1px solid ${BD}`,padding:"0 4px"}}>
          {displayTabs.map(t=>(
            <button key={t.k} onClick={()=>setTab(t.k)}
              style={{background:"none",border:"none",padding:"12px 16px",fontSize:13,cursor:"pointer",color:tab===t.k?P:MUT,fontWeight:tab===t.k?700:400,borderBottom:tab===t.k?`2px solid ${P}`:"2px solid transparent",transition:TR,display:"flex",alignItems:"center",gap:6}}>
              <span style={{display:"flex"}}>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        <div style={{padding:20}}>
          {/* APERÇU */}
          {tab==="apercu"&&<DocPreviewPanel doc={doc}/>}
          {/* CIRCUIT */}
          {tab==="circuit"&&(
            <div>
              {/* Redirections */}
              {doc.historique?.filter(h=>h.type==="redirection").map((h,i)=>(
                <div key={i} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:`1px solid ${BD}`}}>
                  <div style={{width:32,height:32,borderRadius:"50%",background:"#fff8e6",color:"#d97706",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600,color:"#212529"}}>Redirection</div>
                    <div style={{fontSize:11,color:MUT,display:"flex",alignItems:"center",gap:4,marginTop:2}}>
                      <span style={{display:"flex"}}>{IC.calendar}</span>{h.date}
                      {h.de&&<span style={{marginLeft:8,color:"#495057"}}>· De {h.de} → {h.vers}</span>}
                    </div>
                    {h.comment&&<div style={{fontSize:12,color:"#495057",marginTop:4,fontStyle:"italic"}}>"{h.comment}"</div>}
                  </div>
                </div>
              ))}
              {/* Étapes traitées uniquement (en cours / dernièrement validées) */}
              {(doc.etapes||[]).filter(e=>e.statut!=="EN ATTENTE").length===0&&(
                <div style={{textAlign:"center",padding:"24px 0",color:MUT,fontSize:13}}>Aucune étape traitée pour ce document</div>
              )}
              {doc.etapes?.filter(e=>e.statut!=="EN ATTENTE").map((e,i)=>{
                const sc=STEP_COL[e.statut]||STEP_COL["EN ATTENTE"];
                const si=STEP_IC[e.statut]||IC.clock;
                const valideur=users.find(u=>u.id===e.validBy);
                return(
                  <div key={i} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:`1px solid ${BD}`}}>
                    <div style={{width:32,height:32,borderRadius:"50%",background:sc.bg,color:sc.fg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <span style={{display:"flex"}}>{si}</span>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:600,color:"#212529"}}>{e.label}</div>
                      <div style={{fontSize:11,color:MUT,display:"flex",alignItems:"center",gap:4,marginTop:2}}>
                        <span style={{display:"flex"}}>{IC.calendar}</span>{e.date}
                        {valideur&&<span style={{marginLeft:8,color:"#495057"}}>· {valideur.nom} ({valideur.role})</span>}
                      </div>
                      {e.comment&&<div style={{fontSize:12,color:"#495057",marginTop:4,fontStyle:"italic"}}>"{e.comment}"</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* OCR */}
          {tab==="ocr"&&doc.ch&&(
            <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr",gap:10}}>
              {[["Numéro doc",doc.ch.numero],["Date doc",doc.ch.date_doc],["Emetteur",doc.ch.emetteur],["NIF",doc.ch.nif],["IBAN",doc.ch.iban],["HT",fmtN(parseFloat(doc.ch.ht))],["TVA",fmtN(parseFloat(doc.ch.tva))],["Total TTC",fmtN(parseFloat(doc.ch.total))]].map(([l,v])=>(
                <div key={l} style={{background:"#f8f9fc",borderRadius:RSm,padding:"10px 14px"}}>
                  <div style={{fontSize:11,color:MUT,fontWeight:600,textTransform:"uppercase",marginBottom:3}}>{l}</div>
                  <div style={{fontSize:13,fontWeight:600,color:"#212529"}}>{v||"—"}</div>
                </div>
              ))}
            </div>
          )}

          {/* ANNEXES */}
          {tab==="annexes"&&(
            <div>
              {(!doc.anx||doc.anx.length===0)&&(
                <div style={{textAlign:"center",color:MUT,padding:24}}>
                  <span style={{display:"flex",justifyContent:"center",marginBottom:8,opacity:.4}}>{IC.paperclip}</span>Aucune annexe
                </div>
              )}
              {doc.anx?.map((a,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:`1px solid ${BD}`}}>
                  <div style={{width:36,height:36,borderRadius:8,background:a.ok?"#fff0f0":"#f8f9fc",border:"1px solid "+(a.ok?"#fca5a5":"#dee2e6"),display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={a.ok?"#dc2626":"#6c757d"} strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:600,color:"#212529",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.nom}</div>
                    <div style={{fontSize:11,color:MUT}}>{a.typeLabel||a.type||"PDF"}{a.oblig?" · Obligatoire":""}{a.taille?" · "+a.taille:""}</div>
                  </div>
                  <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
                    <span style={{...bdg(a.ok?SUCL:"#e9ecef",a.ok?SUCD:MUT,{fontSize:10.5}),display:"inline-flex",alignItems:"center",gap:4}}>
                      <span style={{display:"flex"}}>{a.ok?IC.chk:IC.clock}</span>{a.ok?"Fourni":"Manquant"}
                    </span>
                    {a.ok&&a.url&&(
                      <button onClick={()=>window.open(a.url,"_blank")}
                        style={{display:"inline-flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:5,border:"1px solid #b3d4f5",background:"#eff6ff",color:"#1d4ed8",cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:"inherit"}}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        Voir
                      </button>
                    )}
                    {a.ok&&(
                      <button onClick={()=>{const link=document.createElement("a");link.href=a.url||"#";link.download=a.nom||"annexe";link.click();}}
                        style={{display:"inline-flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:5,border:"1px solid #bbf7d0",background:"#f0fdf4",color:"#15803d",cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:"inherit"}}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        Télécharger
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* HISTORIQUE */}
          {tab==="historique"&&(()=>{
            const etapes=doc.etapes||[];
            const ExportBtns=()=>(
              <div style={{display:"flex",gap:8,marginBottom:14,justifyContent:"flex-end"}}>
                <button onClick={()=>exportHistoriquePDF({doc,users})}
                  style={{display:"flex",alignItems:"center",gap:6,padding:"6px 14px",background:"#c0392b",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
                  Exporter PDF
                </button>
                <button onClick={()=>exportHistoriqueExcel({doc,users})}
                  style={{display:"flex",alignItems:"center",gap:6,padding:"6px 14px",background:"#1d6f42",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
                  Exporter Excel
                </button>
              </div>
            );
            if(etapes.length===0)return(
              <div><ExportBtns/><div style={{textAlign:"center",padding:"32px 0",color:MUT,fontSize:13}}>Aucune étape de circuit définie</div></div>
            );
            /* Helper: résoudre un userId → "ROLE : nom" */
            const uLabel=id=>{
              const u=users.find(x=>x.id===id);
              if(!u)return id||"—";
              return `${u.role||u.systemRole||"TECH"} : ${u.login||u.nom}`;
            };
            /* Couleur statut en-tête */
            const hCol={VALIDÉ:"#c6efce","EN ATTENTE":"#fff","EN RETARD":"#ffeb9c",REJETÉ:"#ffc7ce","REDIRIGÉ":"#ffeb9c"};
            const hFg={VALIDÉ:"#276221","EN ATTENTE":"#212529","EN RETARD":"#9c5700",REJETÉ:"#9c0006","REDIRIGÉ":"#9c5700"};
            /* Lignes */
            const ROWS=[
              {key:"circuit",  label:"Liste des validateurs circuit"},
              {key:"potentiels",label:"Liste des validateurs potentiels"},
              {key:"valideur", label:"Validateur"},
              {key:"date",     label:"Date de validation"},
              {key:"comment",  label:"Commentaire de validation"},
              {key:"checklist",label:"Check-List"},
            ];
            const LBL_BG="#c6efce"; // vert clair comme la capture
            const LBL_FG="#276221";
            const cellBorder=`1px solid #b8d4b8`;
            const cellStyle={padding:"8px 10px",fontSize:11.5,color:"#212529",verticalAlign:"top",borderRight:cellBorder,borderBottom:cellBorder};
            return(
              <div>
              <ExportBtns/>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,border:cellBorder}}>
                  <thead>
                    <tr>
                      <th style={{...cellStyle,background:LBL_BG,color:LBL_FG,fontWeight:700,minWidth:180,textAlign:"left",borderBottom:cellBorder}}>
                        Liste des étapes
                      </th>
                      {etapes.map((e,i)=>(
                        <th key={i} style={{...cellStyle,background:hCol[e.statut]||"#fff",color:hFg[e.statut]||"#212529",fontWeight:700,textAlign:"center",minWidth:160}}>
                          Etape {i+1} : {e.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ROWS.map(row=>(
                      <tr key={row.key}>
                        <td style={{...cellStyle,background:LBL_BG,color:LBL_FG,fontWeight:600}}>
                          {row.label}
                        </td>
                        {etapes.map((e,i)=>{
                          let cell=null;
                          if(row.key==="circuit"){
                            /* Validateurs du circuit définis (v[]) */
                            const vs=(e.v||[]);
                            cell=vs.length>0
                              ?<div style={{display:"flex",flexDirection:"column",gap:3}}>
                                {vs.map((id,j)=><span key={j} style={{fontSize:11}}>{uLabel(id)}</span>)}
                              </div>
                              :<span style={{color:MUT}}>—</span>;
                          } else if(row.key==="potentiels"){
                            /* Validateurs potentiels = vActifs si définis, sinon v[] */
                            const vp=(e.vActifs||e.v||[]);
                            cell=vp.length>0
                              ?<div style={{display:"flex",flexDirection:"column",gap:3}}>
                                {vp.map((id,j)=><span key={j} style={{fontSize:11}}>{uLabel(id)}</span>)}
                              </div>
                              :<span style={{color:MUT}}>—</span>;
                          } else if(row.key==="valideur"){
                            cell=e.validBy?<span>{uLabel(e.validBy)}</span>:<span style={{color:MUT}}>—</span>;
                          } else if(row.key==="date"){
                            cell=e.date?<span>{e.date}</span>:<span style={{color:MUT}}>—</span>;
                          } else if(row.key==="comment"){
                            cell=e.comment?<span style={{fontStyle:"italic"}}>"{e.comment}"</span>:<span style={{color:MUT}}>—</span>;
                          } else if(row.key==="checklist"){
                            const cls=e.checklists||[];
                            cell=cls.length>0
                              ?<div style={{display:"flex",flexDirection:"column",gap:3}}>
                                {cls.map((c,j)=>(
                                  <div key={j} style={{display:"flex",alignItems:"center",gap:5}}>
                                    <span style={{color:c.checked?"#276221":"#9c0006",fontWeight:700,fontSize:13}}>
                                      {c.checked?"✓":"✗"}
                                    </span>
                                    <span style={{fontSize:11,color:c.checked?"#276221":"#9c0006"}}>{c.label}</span>
                                  </div>
                                ))}
                              </div>
                              :<span style={{color:MUT}}>—</span>;
                          }
                          return(
                            <td key={i} style={{...cellStyle,background:"#fff",textAlign:"left",verticalAlign:"top"}}>
                              {cell}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* ── Entrées de relance dans l'historique ── */}
              {(doc.historique||[]).filter(h=>h.type==="relance").length>0&&(
                <div style={{marginTop:16}}>
                  <div style={{fontSize:11,fontWeight:800,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".08em",marginBottom:8,display:"flex",alignItems:"center",gap:6}}>
                    <div style={{width:12,height:2,borderRadius:1,background:"#ea580c"}}/>
                    Relances envoyées ({(doc.historique||[]).filter(h=>h.type==="relance").length})
                  </div>
                  {(doc.historique||[]).filter(h=>h.type==="relance").map((h,i)=>(
                    <div key={i} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:`1px solid ${BD}`,alignItems:"flex-start"}}>
                      <div style={{width:30,height:30,borderRadius:8,background:"#fff7ed",border:"1px solid #fed7aa",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2.2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:12.5,fontWeight:700,color:"#ea580c"}}>Mail de relance envoyé</div>
                        {h.etape&&<div style={{fontSize:11.5,color:"#212529",marginTop:2}}>Étape relancée : <b>{h.etape}</b></div>}
                        <div style={{fontSize:11,color:MUT,marginTop:2,display:"flex",alignItems:"center",gap:4}}>
                          <span style={{display:"flex"}}>{IC.calendar}</span>{h.date}
                          <span style={{marginLeft:6}}>· Par <b>{h.par}</b></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            );
          })()}
          {/* SOFTSIGN RATTACHEMENT / STATUT */}
          {tab==="softsign"&&<SoftSignTabContent doc={doc} onUpdate={onUpdate} setSigningDoc={setSigningDoc}/>}
        </div>
      </div>

      {/* SSSignatureViewer overlay */}
      {signingDoc&&(
        <div style={{position:"fixed",inset:0,zIndex:99990,background:"#fff"}}>
          <SSSignatureViewer
            doc={signingDoc}
            onBack={()=>setSigningDoc(null)}
            currentUser={authUser}
            saveKey={signingDoc._saveKey||COLLAB_SS_KEY}
            onSaved={()=>setSigningDoc(null)}
          />
        </div>
      )}

      {/* Wizard: Envoyer pour signature SoftSign */}
      {ssWizard&&<SendToSoftSignWizard doc={doc} onClose={()=>setSsWizard(false)} onSend={handleSendToSoftSign}/>}

      {/* ── MODALS ── */}
      {modal==="validate"&&(
        <ValidationModal doc={doc} onClose={()=>setModal(null)} onValidate={handleValidate}/>
      )}

      {/* Rejet : saisie du motif */}
      {modal==="reject"&&(
        <Modal title="Rejeter le document" onClose={()=>{setModal(null);setRejetCauses([]);setCausesOpen(false);}} w={500}
          footer={<>
            <button onClick={()=>{setModal(null);setRejetCauses([]);}} style={btn("light",true)}>Annuler</button>
            <button onClick={()=>(rejetCauses.length>0&&rejetComment.trim())&&setModal("reject-confirm")}
              disabled={rejetCauses.length===0||!rejetComment.trim()} style={{...btn("danger"),opacity:(rejetCauses.length>0&&rejetComment.trim())?1:.5}}>
              <span style={{display:"flex"}}>{IC.x}</span> Continuer
            </button>
          </>}>
          <div style={{background:DNGL,border:`1px solid #f5c6cb`,borderRadius:RSm,padding:"10px 14px",marginBottom:14,fontSize:12.5,color:"#721c24"}}>
            ⚠️ Le rejet est irréversible. Le document sera marqué comme refusé.
          </div>

          {/* Causes multi-check dropdown */}
          <label style={{fontSize:11.5,fontWeight:700,color:"#495057",textTransform:"uppercase",letterSpacing:".06em",display:"block",marginBottom:6}}>
            Cause(s) de refus * <span style={{color:DNG}}>(obligatoire)</span>
          </label>
          <div style={{position:"relative",marginBottom:12}}>
            <button type="button" onClick={()=>setCausesOpen(p=>!p)}
              style={{
                width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",
                padding:"8px 12px",border:`1.5px solid ${rejetCauses.length===0?"#f5c6cb":BD}`,
                borderRadius:RSm,background:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:13,
                color:rejetCauses.length>0?"#212529":"#6c757d",
              }}>
              <span>{rejetCauses.length>0?`${rejetCauses.length} cause${rejetCauses.length>1?"s":""} sélectionnée${rejetCauses.length>1?"s":""}`:"Sélectionner les causes…"}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                style={{flexShrink:0,transition:"transform .2s",transform:causesOpen?"rotate(180deg)":"none"}}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {causesOpen&&(
              <>
                <div style={{position:"fixed",inset:0,zIndex:998}} onMouseDown={()=>setCausesOpen(false)}/>
                <div style={{
                  position:"absolute",left:0,right:0,top:42,zIndex:999,
                  background:"#fff",border:`1px solid ${BD}`,borderRadius:RSm,
                  boxShadow:"0 8px 24px rgba(0,0,0,.13)",maxHeight:220,overflowY:"auto",
                }}>
                  {(causesRefus||[]).map(cause=>{
                    const checked=rejetCauses.includes(cause.id);
                    return(
                      <label key={cause.id} onMouseDown={e=>{e.preventDefault();setRejetCauses(p=>checked?p.filter(x=>x!==cause.id):[...p,cause.id]);}}
                        style={{
                          display:"flex",alignItems:"center",gap:10,
                          padding:"9px 14px",cursor:"pointer",userSelect:"none",
                          background:checked?"#fff8e6":"transparent",
                          borderBottom:`1px solid #f0f2f5`,
                        }}>
                        <div style={{width:16,height:16,borderRadius:4,flexShrink:0,border:`2px solid ${checked?"#dc3545":BD}`,background:checked?"#dc3545":"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>
                          {checked&&<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                        </div>
                        <span style={{fontSize:13,fontWeight:checked?600:400,color:checked?"#dc3545":"#212529"}}>{cause.label}</span>
                      </label>
                    );
                  })}
                </div>
              </>
            )}
          </div>
          {/* Selected chips */}
          {rejetCauses.length>0&&(
            <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>
              {rejetCauses.map(id=>{
                const cause=(causesRefus||[]).find(c=>c.id===id);
                return cause?(
                  <span key={id} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 8px",borderRadius:20,background:"#fff3cd",border:"1px solid #ffc107",fontSize:11.5,fontWeight:600,color:"#856404"}}>
                    {cause.label}
                    <span onMouseDown={e=>{e.preventDefault();setRejetCauses(p=>p.filter(x=>x!==id));}} style={{cursor:"pointer",marginLeft:2,fontWeight:700}}>×</span>
                  </span>
                ):null;
              })}
            </div>
          )}
          {rejetCauses.length===0&&<div style={{fontSize:11,color:DNG,marginBottom:10}}>Au moins une cause est obligatoire</div>}

          {/* Comment */}
          <label style={{fontSize:11.5,fontWeight:700,color:"#495057",textTransform:"uppercase",letterSpacing:".06em",display:"block",marginBottom:5}}>
            Commentaire * <span style={{color:DNG}}>(obligatoire)</span>
          </label>
          <textarea value={rejetComment} onChange={e=>setRejetComment(e.target.value)} rows={3}
            style={{...inp({borderColor:!rejetComment.trim()?"#f5c6cb":BD}),resize:"vertical",fontFamily:"inherit",width:"100%",boxSizing:"border-box"}}
            placeholder="Précisez le motif du rejet…"/>
          {!rejetComment.trim()&&<div style={{fontSize:11,color:DNG,marginTop:4}}>Ce champ est obligatoire</div>}
        </Modal>
      )}

      {/* Confirmation rejet */}
      {modal==="reject-confirm"&&(
        <ConfirmRejetModal
          onConfirm={handleRejet}
          onCancel={()=>setModal("reject")}
        />
      )}

      {modal==="redirect"&&(
        <RedirectionModal doc={doc} onClose={()=>setModal(null)} onRedirect={handleRedirect}/>
      )}

      {/* ── Modal Affecter Type ── */}
      {affectTypeModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:5000,padding:20}}>
          <div style={{background:"#fff",borderRadius:12,width:"100%",maxWidth:480,padding:28,boxShadow:"0 20px 60px rgba(0,0,0,.25)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <h3 style={{fontSize:15,fontWeight:700,color:"#212529"}}>Affecter un type de document</h3>
              <button onClick={()=>setAffectTypeModal(false)} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:"#6c757d"}}>×</button>
            </div>
            <div style={{marginBottom:8,fontSize:12,color:"#6c757d"}}>Document : <b style={{color:"#212529"}}>{doc.id}</b> · {doc.fourn}</div>
            <div style={{background:"#fffbeb",border:"1px solid #fcd34d",borderRadius:6,padding:"8px 12px",marginBottom:16,fontSize:12,color:"#92400e"}}>
              ⚠️ L'affectation du type lancera le circuit de validation. Le document quittera ce menu.
            </div>
            <div style={{marginBottom:16}}>
              <label style={{fontSize:12,fontWeight:600,color:"#495057",display:"block",marginBottom:6}}>Sélectionner le type *</label>
              <select value={selectedTid} onChange={e=>setSelectedTid(e.target.value)}
                style={{width:"100%",height:38,border:"1px solid #dee2e6",borderRadius:6,padding:"0 10px",fontSize:13,outline:"none",cursor:"pointer"}}>
                <option value="">— Choisir un type —</option>
                {types.filter(t=>t.actif!==false).map(t=>(
                  <option key={t.id} value={t.id}>{t.icone||"📄"} {t.nom}</option>
                ))}
              </select>
            </div>
            {selectedTid&&types.find(t=>t.id===selectedTid)&&(
              <div style={{background:"#f0f7ff",border:"1px solid #b3d4f5",borderRadius:6,padding:"10px 14px",marginBottom:16,fontSize:12}}>
                <div style={{fontWeight:700,marginBottom:4,color:"#212529"}}>{types.find(t=>t.id===selectedTid)?.nom}</div>
                <div style={{color:"#6c757d"}}>
                  {(types.find(t=>t.id===selectedTid)?.etapes||[]).length} étape(s) de validation
                  {types.find(t=>t.id===selectedTid)?.etapes?.length>0&&
                    <span> · {types.find(t=>t.id===selectedTid)?.etapes.map(e=>e.label).join(" → ")}</span>
                  }
                </div>
              </div>
            )}
            <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
              <button onClick={()=>setAffectTypeModal(false)}
                style={{padding:"8px 18px",border:"1px solid #dee2e6",borderRadius:6,background:"#f8f9fa",cursor:"pointer",fontSize:13,fontWeight:600}}>
                Annuler
              </button>
              <button onClick={affectType} disabled={!selectedTid}
                style={{padding:"8px 18px",border:"none",borderRadius:6,background:selectedTid?"#f5a623":"#e9ecef",color:selectedTid?"#fff":"#6c757d",cursor:selectedTid?"pointer":"not-allowed",fontSize:13,fontWeight:700}}>
                ✓ Affecter ce type
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
