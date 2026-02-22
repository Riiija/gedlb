import { useState, useRef, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";

import {
  P, PDk, PLt, PXl, S, SDk, SXl,
  SUC, SUCL, SUCD, DNG, DNGL, DNGD,
  WRN, WRNL, WRND, INF, INFL, INFD,
  MUT, BD, BG, WH, TXT,
  SHADOW, SHADOW_M, SHADOW_L, R, RSm, RLg, TR,
  card, inp, sel, lbl, bdg, TH, TD, btn, STATUS,
  PROJETS, ALL_SITES, FOURNISSEURS, XML_NATURES,
  INIT_USERS, INIT_TYPES, INIT_SCHEMAS, INIT_RECV, INIT_DOCS,
  now, gid, fmtN, ocrSim,
  DOC_MENUS, filterDocsByMenu, getDocCtx, DROITS_DEF,
} from "../components/data";

import { IC, Bdg, Av, Modal, FG, SecTitle, CardHead, StatCard, FilterBar } from "../components/ui";

const mkEtapes = (dt) => (dt?.etapes || []).map(e => ({ ...e, statut:"EN ATTENTE", date:"", comment:"", validBy:"" }));

// ══════════════════════════════════════════════════════
// OCR SCANNER
// ══════════════════════════════════════════════════════
function OCRScanner({ fid, onDone, onSkip }) {
  const [phase, setPhase] = useState("upload");
  const [prog, setProg]   = useState(0);
  const [data, setData]   = useState(null);
  const [fname, setFname] = useState("");
  const [editing, setEd]  = useState(false);
  const [edited, setEd2]  = useState({});
  const fileRef = useRef();
  const msgs = ["Analyse format document...","Détection zones texte...","Extraction numéro...","Lecture montants HT/TVA/TTC...","Vérification NIF...","Validation IBAN (Luhn)...","Calcul score de confiance...","Contrôle anti-doublon..."];
  const [mi, setMi] = useState(0);

  useEffect(() => {
    if (phase === "scanning") {
      const t = setInterval(() => setMi(p => (p + 1) % msgs.length), 500);
      return () => clearInterval(t);
    }
  }, [phase]);

  const startScan = (name) => {
    setFname(name); setPhase("scanning"); setProg(0);
    const iv = setInterval(() => setProg(p => {
      if (p >= 100) { clearInterval(iv); const d = ocrSim(fid); setData(d); setEd2(d); setPhase("done"); return 100; }
      return p + 3;
    }), 50);
  };

  const qc = s => s >= 85 ? SUC : s >= 70 ? WRN : DNG;
  const FIELDS = [
    {k:"numero",l:"N° Document",c:98},{k:"date_doc",l:"Date document",c:95},
    {k:"emetteur",l:"Émetteur",c:94},{k:"nif",l:"NIF",c:97},
    {k:"ht",l:"Montant HT (Ar)",c:(data?.score||0)>=80?91:60},{k:"tva",l:"TVA 20% (Ar)",c:(data?.score||0)>=80?88:52},
    {k:"total",l:"Total TTC (Ar)",c:(data?.score||0)>=80?93:64},{k:"iban",l:"IBAN",c:96}
  ];

  return (
    <div>
      {phase === "upload" && (
        <div>
          <div onClick={() => fileRef.current?.click()} style={{ border:`2px dashed ${P}`, borderRadius:RLg, padding:"38px 24px", textAlign:"center", background:PXl, cursor:"pointer" }}>
            <div style={{ fontSize:52, marginBottom:12 }}>📄</div>
            <div style={{ fontWeight:700, fontSize:17, color:P, marginBottom:8 }}>Glissez-déposez votre document</div>
            <div style={{ fontSize:14, color:MUT, marginBottom:20 }}>PDF · DOCX · TIFF · JPEG · PNG — Max 20 Mo</div>
            <button style={btn("primary")} onClick={e=>{e.stopPropagation();fileRef.current?.click();}}>Parcourir les fichiers</button>
            <input ref={fileRef} type="file" accept=".pdf,.docx,.tiff,.jpg,.jpeg,.png" style={{display:"none"}} onChange={e=>{const fl=e.target.files[0];if(fl)startScan(fl.name);}}/>
          </div>
          <div style={{textAlign:"right",marginTop:12}}>
            <button style={btn("muted",true)} onClick={onSkip}>Saisie manuelle sans OCR →</button>
          </div>
        </div>
      )}

      {phase === "scanning" && (
        <div style={{textAlign:"center",padding:"32px 0"}}>
          <div style={{position:"relative",width:130,height:160,margin:"0 auto 24px",borderRadius:RSm,background:"#1e293b",overflow:"hidden",border:`2px solid ${PLt}`}}>
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:60}}>📄</div>
            <div style={{position:"absolute",left:0,right:0,height:4,background:`linear-gradient(90deg,transparent,${S},transparent)`,animation:"scan 1.4s linear infinite",boxShadow:`0 0 18px ${S}`}}/>
          </div>
          <div style={{fontWeight:700,fontSize:16,color:P,marginBottom:8}}>🤖 Analyse OCR en cours...</div>
          <div style={{fontSize:13,color:MUT,marginBottom:22,animation:"pulse-slow 1.5s ease infinite",minHeight:20}}>{msgs[mi]}</div>
          <div style={{maxWidth:400,margin:"0 auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:MUT,marginBottom:4}}><span>{prog}%</span><span style={{maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{fname}</span></div>
            <div style={{height:10,background:BD,borderRadius:5,overflow:"hidden"}}><div style={{height:"100%",background:`linear-gradient(90deg,${P},${PLt})`,width:`${prog}%`,borderRadius:5,transition:"width .05s"}}/></div>
          </div>
        </div>
      )}

      {phase === "done" && data && (
        <div style={{animation:"fadeIn .3s ease"}}>
          <div style={{background:data.score>=80?SUCL:WRNL,border:`1.5px solid ${data.score>=80?"#a3cfbb":"#ffe69c"}`,borderRadius:RSm,padding:"12px 18px",marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{fontWeight:600,fontSize:14,color:data.score>=80?SUCD:WRND}}>
              {data.score>=80?"✅ Extraction réussie — vérifiez les données":"⚠️ Score faible — vérification manuelle requise"}
            </span>
            <div style={{textAlign:"right"}}><div style={{fontSize:28,fontWeight:900,color:qc(data.score)}}>{data.score}%</div><div style={{fontSize:11,color:MUT}}>Score OCR</div></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
            {FIELDS.map(({k,l,c}) => {
              const low=c<75, med=c<88;
              return (
                <div key={k} style={{border:`1.5px solid ${low?DNG:med?WRN:BD}`,borderRadius:RSm,padding:"10px 14px",background:low?DNGL:med?WRNL:"#fafafa"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:11,color:MUT,fontWeight:700,textTransform:"uppercase"}}>{l}</span><span style={{fontSize:11,fontWeight:700,color:qc(c)}}>{c}%</span></div>
                  {editing
                    ? <input style={inp({padding:"5px 8px",fontSize:13})} value={edited[k]||""} onChange={e=>setEd2({...edited,[k]:e.target.value})}/>
                    : <div style={{fontSize:14,fontWeight:700}}>{data[k]||"—"}</div>}
                  <div style={{height:4,background:BD,borderRadius:2,marginTop:8}}><div style={{height:4,background:qc(c),width:`${c}%`,borderRadius:2}}/></div>
                </div>
              );
            })}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",gap:8}}>
              <button style={btn(editing?"success":"primary",true)} onClick={()=>{if(editing)setData(edited); setEd(!editing);}}>
                {IC.edit} {editing?"Sauvegarder corrections":"Corriger manuellement"}
              </button>
              <button style={btn("muted",true)} onClick={()=>{setPhase("upload");setData(null);setFname("");}}>{IC.rot} Rescanner</button>
            </div>
            <button style={btn("primary")} onClick={()=>onDone(editing?edited:data)}>Continuer → Informations</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════
// DEPOT DOCUMENT
// ══════════════════════════════════════════════════════
function DepotDoc({ onDeposit, types }) {
  const [step, setStep] = useState(1);
  const [ocr, setOcr]   = useState(null);
  const [form, setForm] = useState({tid:"DT001",fid:"F001",proj:"PRJ-001",site:"Antananarivo",conf:false,notes:"",exped:"Fournisseur",mtR:""});
  const [anx, setAnx]   = useState([]);
  const [done, setDone] = useState(null);

  const dt = types.find(d => d.id === form.tid) || types[0];
  const pSite = (PROJETS.find(p => p.id === form.proj) || PROJETS[0]).sites;

  const submit = () => {
    const f = FOURNISSEURS.find(x => x.id === form.fid);
    const mt = form.mtR ? parseInt(form.mtR) : parseInt(ocr?.total || 0);
    const d = {
      id: gid("DOC"), type: dt?.nom, tid: form.tid,
      cat: form.exped==="Interne"?"interne":form.conf?"confidentiel":"fournisseur",
      fourn: f?.nom||"", fid: form.fid, proj: form.proj, site: form.site, mt, mtR: mt,
      date: new Date().toISOString().slice(0,10), st:"REÇU", conf: form.conf,
      ocr: ocr?.score||0, motif:"", exped: form.exped, notes: form.notes,
      bap: false, cloture: false, AR: false, affP: !!form.proj, linked: false, refus: null,
      ch:{...ocr,total:String(mt)}, anx, etapes: mkEtapes(dt),
    };
    setDone(d); onDeposit(d); setStep(4);
  };

  const STEPS = ["Scan OCR","Informations","Annexes","Confirmation"];

  return (
    <div>
      {/* Stepper */}
      <div style={{...card(),padding:"18px 24px",marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center"}}>
          {STEPS.map((s,i) => (
            <div key={s} style={{display:"flex",alignItems:"center",flex:i<STEPS.length-1?1:"auto"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:34,height:34,borderRadius:"50%",background:step>i+1?SUC:step===i+1?P:BD,color:step>i+1||step===i+1?WH:MUT,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13,flexShrink:0}}>{step>i+1?IC.chk:i+1}</div>
                <span style={{fontSize:14,fontWeight:step===i+1?700:500,color:step===i+1?P:MUT}}>{s}</span>
              </div>
              {i<STEPS.length-1&&<div style={{flex:1,height:2,background:step>i+1?SUC:BD,margin:"0 14px"}}/>}
            </div>
          ))}
        </div>
      </div>

      {step===1&&(
        <div style={card()}>
          <CardHead title="🤖 Étape 1 — Scan & Analyse OCR"/>
          <div style={{padding:22}}>
            <div style={{...card({marginBottom:20}),border:`1px solid ${PXl}`,overflow:"visible"}}>
              <div style={{padding:"10px 16px",background:PXl}}><span style={{color:P,fontWeight:700,fontSize:13}}>Paramètres du document</span></div>
              <div style={{padding:16,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
                <FG label="Type de document" req>
                  <select style={sel()} value={form.tid} onChange={e=>setForm({...form,tid:e.target.value})}>
                    {types.map(t=><option key={t.id} value={t.id}>{t.nom}</option>)}
                  </select>
                </FG>
                <FG label="Fournisseur / Émetteur">
                  <select style={sel()} value={form.fid} onChange={e=>setForm({...form,fid:e.target.value})}>
                    <option value="">-- Sélectionner --</option>
                    {FOURNISSEURS.map(f=><option key={f.id} value={f.id}>{f.nom}</option>)}
                  </select>
                </FG>
                <FG label="Expéditeur">
                  <select style={sel()} value={form.exped} onChange={e=>setForm({...form,exped:e.target.value,conf:e.target.value==="Confidentiel"})}>
                    {["Fournisseur","Interne","Confidentiel"].map(t=><option key={t}>{t}</option>)}
                  </select>
                </FG>
              </div>
            </div>
            <OCRScanner fid={form.fid} onDone={d=>{setOcr(d);setStep(2);}} onSkip={()=>{setOcr({numero:"",date_doc:"",ht:"",tva:"",total:"",nif:"",iban:"",emetteur:"",score:0});setStep(2);}}/>
          </div>
        </div>
      )}

      {step===2&&(
        <div style={card()}>
          <CardHead title="📝 Étape 2 — Informations & Affectation"/>
          <div style={{padding:22}}>
            {ocr&&ocr.score>0&&<div style={{background:SUCL,border:`1.5px solid #a3cfbb`,borderRadius:RSm,padding:"10px 16px",marginBottom:20,fontSize:14,color:SUCD}}>✅ OCR réalisé (score {ocr.score}%) — {ocr.numero} · {ocr.emetteur}</div>}
            <div style={{background:WRNL,border:`1.5px solid ${WRN}`,borderRadius:RSm,padding:"10px 16px",marginBottom:20,fontSize:13,color:WRND}}>⚠️ <b>Chaque site d'un projet est isolé</b> — affectez correctement le projet et le site.</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <FG label="Projet *">
                <select style={sel()} value={form.proj} onChange={e=>setForm({...form,proj:e.target.value,site:""})}>
                  <option value="">-- Non affecté --</option>
                  {PROJETS.map(p=><option key={p.id} value={p.id}>{p.id} – {p.nom}</option>)}
                </select>
              </FG>
              <FG label="Site *">
                <select style={sel()} value={form.site} onChange={e=>setForm({...form,site:e.target.value})}>
                  <option value="">-- Sélectionner --</option>
                  {(form.proj?PROJETS.find(p=>p.id===form.proj)?.sites||[]:ALL_SITES).map(s=><option key={s}>{s}</option>)}
                </select>
              </FG>
              <FG label="Montant réel TTC (Ar)" span={2}>
                <input style={inp()} type="number" value={form.mtR} onChange={e=>setForm({...form,mtR:e.target.value})} placeholder={`OCR: ${ocr?.total||"0"} Ar — Saisir si inexact`}/>
              </FG>
              <FG label="Document confidentiel" span={2}>
                <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",padding:"10px 14px",borderRadius:RSm,border:`1.5px solid ${form.conf?P:BD}`,background:form.conf?PXl:WH}}>
                  <input type="checkbox" checked={form.conf} onChange={e=>setForm({...form,conf:e.target.checked})} style={{width:16,height:16,accentColor:P}}/>
                  <span style={{fontSize:14,fontWeight:600}}>{IC.lock} Circuit confidentiel</span>
                </label>
              </FG>
              <FG label="Notes" span={2}>
                <textarea style={{...inp(),height:75,resize:"vertical"}} value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Informations complémentaires..."/>
              </FG>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:22}}>
              <button style={btn("muted")} onClick={()=>setStep(1)}>← Retour OCR</button>
              <button style={btn("primary")} onClick={()=>setStep(3)}>Suivant → Annexes</button>
            </div>
          </div>
        </div>
      )}

      {step===3&&(
        <div style={card()}>
          <CardHead title="📎 Étape 3 — Pièces jointes"/>
          <div style={{padding:22}}>
            <div onClick={()=>setAnx(p=>[...p,{nom:`Annexe_${p.length+1}.pdf`,type:"Pièce jointe",oblig:false,ok:true}])} style={{border:`2px dashed ${P}`,borderRadius:RSm,padding:22,textAlign:"center",background:PXl,cursor:"pointer",marginBottom:16}}>
              <div style={{fontSize:28,marginBottom:6}}>📎</div>
              <span style={{fontSize:14,color:P,fontWeight:600}}>Cliquer pour ajouter une pièce jointe</span>
            </div>
            {anx.map((a,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",border:`1px solid ${BD}`,borderRadius:RSm,marginBottom:8,background:"#fafafa"}}>
                <span>📄 {a.nom}</span>
                <button style={btn("danger",true)} onClick={()=>setAnx(p=>p.filter((_,j)=>j!==i))}>{IC.trash}</button>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",marginTop:22}}>
              <button style={btn("muted")} onClick={()=>setStep(2)}>← Retour</button>
              <button style={btn("success")} onClick={submit}>{IC.chk} Confirmer le dépôt</button>
            </div>
          </div>
        </div>
      )}

      {step===4&&done&&(
        <div style={card()}>
          <CardHead title="✅ Document déposé avec succès" color={SUC}/>
          <div style={{padding:32,textAlign:"center"}}>
            <div style={{fontSize:60,marginBottom:16}}>🎉</div>
            <h2 style={{color:SUC,marginBottom:20,fontWeight:800}}>Document enregistré</h2>
            <div style={{background:SUCL,border:`1.5px solid #a3cfbb`,borderRadius:RSm,padding:20,maxWidth:480,margin:"0 auto 24px",textAlign:"left"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,fontSize:14}}>
                {[["Référence",done.id],["Type",done.type],["Projet",done.proj||"Non affecté"],["Site",done.site||"—"],["Montant",fmtN(done.mt)],["Score OCR",done.ocr+"%"]].map(([l,v])=>(
                  <div key={l}><span style={{color:MUT,fontWeight:600}}>{l}: </span><span style={{fontWeight:700,color:P}}>{v}</span></div>
                ))}
              </div>
            </div>
            <button style={btn("primary")} onClick={()=>{setStep(1);setOcr(null);setAnx([]);setDone(null);setForm({tid:"DT001",fid:"F001",proj:"PRJ-001",site:"Antananarivo",conf:false,notes:"",exped:"Fournisseur",mtR:""});}}>
              {IC.plus} Déposer un autre document
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════
// DOC DETAIL
// ══════════════════════════════════════════════════════
function DocDetail({ doc, onBack, onUpdate, ctx, users }) {
  const [tab, setTab]     = useState("circuit");
  const [mVal, setMVal]   = useState(false);
  const [mRej, setMRej]   = useState(false);
  const [mRed, setMRed]   = useState(false);
  const [mAR, setMAR]     = useState(false);
  const [mRP, setMRP]     = useState(false);
  const [cmt, setCmt]     = useState("");
  const [motif, setMotif] = useState("");
  const [nProj, setNProj] = useState(doc.proj);
  const [nSite, setNSite] = useState(doc.site);
  const [mtEdit, setMtE]  = useState(false);
  const [mtVal, setMtV]   = useState(String(doc.mtR||doc.mt));

  const curIdx = doc.etapes.findIndex(e=>e.statut==="EN ATTENTE"||e.statut==="EN RETARD");
  const SC = {VALIDÉ:SUC,REJETÉ:DNG,"EN ATTENTE":BD,"EN RETARD":DNG};

  const doVal = () => {
    const etapes = doc.etapes.map((e,i) => {
      if(i===curIdx) return{...e,statut:"VALIDÉ",date:now(),comment:cmt||"Validé",validBy:"U001"};
      if(i===curIdx+1) return{...e,statut:"EN ATTENTE"};
      return e;
    });
    const all = etapes.every(e=>e.statut==="VALIDÉ");
    onUpdate({...doc,etapes,st:all?"VALIDÉ":"EN VALIDATION"});
    setMVal(false); setCmt("");
  };
  const doRej = () => {
    if(!motif.trim()) return;
    const etapes = doc.etapes.map((e,i)=>i===curIdx?{...e,statut:"REJETÉ",date:now(),comment:motif,validBy:"U001"}:e);
    onUpdate({...doc,etapes,st:"REJETÉ",motif,refus:{etape:doc.etapes[curIdx]?.label,date:now(),cause:"Rejet valideur",comment:motif}});
    setMRej(false); setMotif("");
  };
  const doRed = () => {
    if(curIdx<=0) return;
    const etapes = doc.etapes.map((e,i)=>{if(i===curIdx-1)return{...e,statut:"EN ATTENTE",date:"",comment:cmt?`Redirigé: ${cmt}`:""};if(i===curIdx)return{...e,statut:"EN ATTENTE"};return e;});
    onUpdate({...doc,etapes,st:"EN VALIDATION"}); setMRed(false); setCmt("");
  };
  const doRP = () => { onUpdate({...doc,proj:nProj,site:nSite,affP:!!nProj}); setMRP(false); };
  const doMt = () => { onUpdate({...doc,mtR:parseInt(mtVal)||doc.mt}); setMtE(false); };
  const doBap = () => onUpdate({...doc,st:"BON À PAYER",bap:true});

  const TABS = [["circuit","🔀 Circuit"],["ocr","🤖 OCR"],["annexes","📎 Annexes"],["historique","📜 Historique"]];

  return (
    <div style={{animation:"fadeIn .25s ease"}}>
      <div style={card()}>
        <CardHead
          title={`${doc.type} — ${doc.fourn||doc.ch?.emetteur||"Interne"}${doc.conf?" 🔒":""}`}
          right={[<Bdg key="s" s={doc.st}/>, <button key="b" style={{...btn("light",true),fontSize:13}} onClick={onBack}>← Retour</button>]}
        />
        <div style={{padding:"16px 22px"}}>
          {doc.st==="EN RETARD"&&<div style={{background:DNGL,border:`1.5px solid ${DNG}`,borderRadius:RSm,padding:"10px 16px",marginBottom:14,fontSize:14,color:DNGD}}>⚠️ <b>Alerte retard</b> — Délai dépassé, escalade envoyée.</div>}
          {doc.st==="REJETÉ"&&doc.motif&&<div style={{background:DNGL,border:`1.5px solid ${DNG}`,borderRadius:RSm,padding:"10px 16px",marginBottom:14,fontSize:14,color:DNGD}}>❌ <b>Rejeté :</b> {doc.motif}</div>}
          {!doc.affP&&<div style={{background:WRNL,border:`1.5px solid ${WRN}`,borderRadius:RSm,padding:"10px 16px",marginBottom:14,fontSize:14,color:WRND}}>⚠️ Document non affecté — veuillez l'affecter à un projet/site.</div>}

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10,marginBottom:16}}>
            {[["ID",doc.id],["Projet",doc.proj||"—"],["Site",doc.site||"—"],["N°",doc.ch?.numero||"—"],["HT",fmtN(doc.ch?.ht)],["TVA",fmtN(doc.ch?.tva)],["TTC",fmtN(doc.mt)],["Montant réel",fmtN(doc.mtR||doc.mt)],["OCR",doc.ocr+"%"]].map(([l,v])=>(
              <div key={l} style={{background:BG,borderRadius:RSm,padding:"9px 12px",border:`1px solid ${BD}`}}>
                <div style={{fontSize:10,color:MUT,fontWeight:700,textTransform:"uppercase",marginBottom:4}}>{l}</div>
                <div style={{fontSize:12,fontWeight:700,color:P,wordBreak:"break-all"}}>{v}</div>
              </div>
            ))}
          </div>

          {mtEdit&&(
            <div style={{background:WRNL,border:`1.5px solid ${WRN}`,borderRadius:RSm,padding:"12px 16px",marginBottom:14}}>
              <div style={{fontSize:13,fontWeight:700,color:WRND,marginBottom:8}}>✏️ Correction montant réel</div>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <input style={{...inp(),maxWidth:260,fontWeight:700}} type="number" value={mtVal} onChange={e=>setMtV(e.target.value)}/>
                <button style={btn("success",true)} onClick={doMt}>{IC.chk} Valider</button>
                <button style={btn("muted",true)} onClick={()=>setMtE(false)}>{IC.x} Annuler</button>
              </div>
            </div>
          )}

          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {ctx==="recus-f"&&!doc.AR&&<button style={btn("success")} onClick={()=>setMAR(true)}>{IC.chk} Accuser réception</button>}
            {ctx==="recus-f"&&doc.AR&&<span style={{...bdg(SUCL,SUCD),padding:"8px 14px",fontSize:13}}>✅ AR émis</span>}
            {["recus-f","courrier","en-cours","recu"].includes(ctx)&&<button style={btn("primary",true)} onClick={()=>setMRP(true)}>{IC.rot} Réinitialiser projet/site</button>}
            {["en-cours","recu"].includes(ctx)&&curIdx>=0&&<>
              <button style={btn("success")} onClick={()=>setMVal(true)}>{IC.chk} Valider</button>
              <button style={btn("danger")} onClick={()=>setMRej(true)}>{IC.x} Rejeter</button>
              {curIdx>0&&<button style={btn("warning")} onClick={()=>setMRed(true)}>{IC.rot} Rediriger</button>}
            </>}
            {ctx==="envoyes"&&<>
              {doc.st==="VALIDÉ"&&!doc.bap&&<button style={btn("success")} onClick={doBap}>💚 Bon à payer</button>}
              {!doc.cloture&&<button style={btn("muted",true)} onClick={()=>onUpdate({...doc,cloture:true,st:"CLÔTURÉ"})}>🔒 Clôturer</button>}
            </>}
            <button style={btn("light",true)} onClick={()=>setMtE(!mtEdit)}>{IC.edit} Corriger montant</button>
          </div>
        </div>
      </div>

      <div style={{...card(),marginTop:16}}>
        <div style={{display:"flex",borderBottom:`1px solid ${BD}`,background:"#fafbfe"}}>
          {TABS.map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{padding:"12px 18px",border:"none",background:"none",cursor:"pointer",fontSize:13,fontWeight:tab===id?700:500,color:tab===id?P:MUT,borderBottom:tab===id?`3px solid ${P}`:"3px solid transparent",fontFamily:"inherit"}}>
              {label}
            </button>
          ))}
        </div>
        <div style={{padding:22}}>
          {tab==="circuit"&&(
            <div>
              <div style={{overflowX:"auto",marginBottom:18}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                  <thead><tr>{["#","Étape","Valideurs","Statut","Validé par","Date","Commentaire"].map(c=><th key={c} style={TH}>{c}</th>)}</tr></thead>
                  <tbody>{doc.etapes.map((e,i)=>(
                    <tr key={i} style={{background:e.statut==="VALIDÉ"?SUCL:e.statut==="REJETÉ"||e.statut==="EN RETARD"?DNGL:i===curIdx?WRNL:WH}}>
                      <td style={TD}><div style={{width:26,height:26,borderRadius:"50%",background:SC[e.statut]||BD,color:e.statut==="EN ATTENTE"?MUT:WH,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:11,margin:"auto"}}>{e.statut==="VALIDÉ"?IC.chk:e.statut==="REJETÉ"?IC.x:i+1}</div></td>
                      <td style={{...TD,fontWeight:600}}>{e.label}</td>
                      <td style={TD}><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{(e.v||[]).map(uid=><span key={uid} style={bdg(PXl,P,{fontSize:10})}>{users.find(u=>u.id===uid)?.init||uid}</span>)}</div></td>
                      <td style={TD}><Bdg s={e.statut==="EN ATTENTE"&&i===curIdx?"EN VALIDATION":e.statut} sm/></td>
                      <td style={TD}>{e.validBy?<Av uid={e.validBy} users={users} size={22}/>:<span style={{color:MUT}}>—</span>}</td>
                      <td style={{...TD,fontSize:11,color:MUT,whiteSpace:"nowrap"}}>{e.date||"—"}</td>
                      <td style={{...TD,fontSize:12,color:MUT,fontStyle:"italic"}}>{e.comment||"—"}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
              {doc.bap&&<div style={{background:INFL,border:`1.5px solid ${INF}`,borderRadius:RSm,padding:14,textAlign:"center"}}><b style={{color:INFD,fontSize:15}}>💚 Bon à payer — Génération XML disponible</b></div>}
            </div>
          )}

          {tab==="ocr"&&(
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
                <div><div style={{fontWeight:700,fontSize:15,color:P}}>Résultats OCR</div><div style={{fontSize:13,color:MUT,marginTop:2}}>Moteur Tesseract 5.x — {doc.date}</div></div>
                <div style={{textAlign:"right"}}><div style={{fontSize:32,fontWeight:900,color:doc.ocr>=85?SUC:doc.ocr>=70?WRN:DNG}}>{doc.ocr}%</div><div style={{fontSize:12,color:MUT}}>Score</div></div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {[["N° Document",doc.ch?.numero,98],["Date",doc.ch?.date_doc,95],["Émetteur",doc.ch?.emetteur,94],["NIF",doc.ch?.nif,97],["HT (Ar)",doc.ch?.ht,doc.ocr>=80?91:60],["TVA (Ar)",doc.ch?.tva,doc.ocr>=80?88:52],["Total TTC (Ar)",doc.ch?.total,doc.ocr>=80?93:64],["IBAN",doc.ch?.iban,96]].map(([l,v,c])=>(
                  <div key={l} style={{border:`1.5px solid ${c<75?DNG:c<88?WRN:BD}`,borderRadius:RSm,padding:"10px 14px",background:c<75?DNGL:c<88?WRNL:"#fafafa"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:10,fontWeight:700,color:MUT,textTransform:"uppercase"}}>{l}</span><span style={{fontSize:10,fontWeight:700,color:c<75?DNG:c<88?WRN:SUC}}>{c}%</span></div>
                    <div style={{fontSize:13,fontWeight:700}}>{v||"—"}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab==="annexes"&&(
            <div>
              <div style={{border:`1.5px solid ${S}`,borderRadius:RSm,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",background:SXl,marginBottom:10}}>
                <div><b style={{fontSize:14}}>{doc.ch?.numero||doc.id}.pdf</b><br/><span style={{fontSize:12,color:MUT}}>Document principal</span></div>
                <div style={{display:"flex",gap:6}}><button style={btn("primary",true)}>{IC.eye} Aperçu</button><button style={btn("muted",true)}>{IC.dl} DL</button></div>
              </div>
              {(doc.anx||[]).map((a,i)=>(
                <div key={i} style={{border:`1.5px solid ${a.ok?SUC:DNG}`,borderRadius:RSm,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",background:a.ok?SUCL:DNGL,marginBottom:8}}>
                  <div><b style={{fontSize:14}}>{a.nom}</b>{a.oblig&&<span style={bdg(DNGL,DNGD,{fontSize:10,marginLeft:8})}>Obligatoire</span>}<br/><span style={{fontSize:12,color:MUT}}>{a.type}</span></div>
                  {a.ok?<button style={btn("muted",true)}>{IC.dl}</button>:<button style={btn("primary",true)}>{IC.plus} Joindre</button>}
                </div>
              ))}
              {(doc.anx||[]).length===0&&<div style={{textAlign:"center",color:MUT,fontSize:13,padding:20}}>Aucune pièce jointe annexe</div>}
            </div>
          )}

          {tab==="historique"&&(
            <div>
              {[...doc.etapes.filter(e=>e.date),{label:"Dépôt initial",validBy:"",date:doc.date+" 08:00",statut:"REÇU",comment:"Document soumis via portail"}].reverse().map((e,i)=>(
                <div key={i} style={{display:"flex",gap:14,marginBottom:10}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:SC[e.statut]||S,flexShrink:0,marginTop:6}}/>
                  <div style={{flex:1,padding:"10px 16px",borderRadius:RSm,background:BG,border:`1px solid ${BD}`,fontSize:14}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div><b style={{color:P}}>{e.label}</b>{e.validBy&&<span style={{marginLeft:10}}><Av uid={e.validBy} users={users} size={22}/></span>}</div>
                      <div style={{display:"flex",alignItems:"center",gap:8}}><Bdg s={e.statut==="EN ATTENTE"?"REÇU":e.statut} sm/><span style={{fontSize:11,color:MUT,whiteSpace:"nowrap"}}>{e.date}</span></div>
                    </div>
                    {e.comment&&<div style={{fontSize:13,color:MUT,fontStyle:"italic",marginTop:4}}>"{e.comment}"</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {mVal&&<Modal title="✅ Confirmer la validation" onClose={()=>setMVal(false)} w={460} footer={<><button style={btn("muted")} onClick={()=>setMVal(false)}>Annuler</button><button style={btn("success")} onClick={doVal}>{IC.chk} Valider</button></>}>
        <p style={{marginBottom:14,fontSize:14}}>Valider : <b>{doc.etapes[curIdx]?.label}</b></p>
        <FG label="Commentaire"><textarea style={{...inp(),height:80}} value={cmt} onChange={e=>setCmt(e.target.value)} placeholder="Optionnel..."/></FG>
      </Modal>}
      {mRej&&<Modal title="❌ Rejeter le document" onClose={()=>setMRej(false)} w={460} footer={<><button style={btn("muted")} onClick={()=>setMRej(false)}>Annuler</button><button style={btn("danger")} onClick={doRej}>{IC.x} Confirmer</button></>}>
        <p style={{marginBottom:14,fontSize:14}}>Rejeter : <b>{doc.etapes[curIdx]?.label}</b></p>
        <FG label="Motif *"><textarea style={{...inp({height:80,borderColor:!motif.trim()?DNG:BD})}} value={motif} onChange={e=>setMotif(e.target.value)} placeholder="Motif obligatoire..."/></FG>
      </Modal>}
      {mRed&&<Modal title="↩ Rediriger" onClose={()=>setMRed(false)} w={460} footer={<><button style={btn("muted")} onClick={()=>setMRed(false)}>Annuler</button><button style={btn("warning")} onClick={doRed}>{IC.rot} Rediriger</button></>}>
        <p style={{marginBottom:14,fontSize:14}}>Retour à : <b>{doc.etapes[curIdx-1]?.label}</b></p>
        <FG label="Commentaire *"><textarea style={{...inp(),height:70}} value={cmt} onChange={e=>setCmt(e.target.value)} placeholder="Précisez la raison..."/></FG>
      </Modal>}
      {mAR&&<Modal title="📩 Accuser de réception" onClose={()=>setMAR(false)} w={440} footer={<><button style={btn("muted")} onClick={()=>setMAR(false)}>Annuler</button><button style={btn("success")} onClick={()=>{onUpdate({...doc,AR:true,st:"REÇU"});setMAR(false);}}>Émettre l'AR</button></>}>
        <p style={{fontSize:14}}>Émettre AR pour <b>{doc.id}</b> — {doc.fourn}?</p>
      </Modal>}
      {mRP&&<Modal title="🔄 Réinitialiser projet/site" onClose={()=>setMRP(false)} w={480} footer={<><button style={btn("muted")} onClick={()=>setMRP(false)}>Annuler</button><button style={btn("primary")} onClick={doRP}>{IC.chk} Appliquer</button></>}>
        <FG label="Projet"><select style={sel()} value={nProj} onChange={e=>{setNProj(e.target.value);setNSite("")}}><option value="">-- Non affecté --</option>{PROJETS.map(p=><option key={p.id} value={p.id}>{p.id} – {p.nom}</option>)}</select></FG>
        <FG label="Site"><select style={sel()} value={nSite} onChange={e=>setNSite(e.target.value)}><option value="">-- Sélectionner --</option>{(nProj?PROJETS.find(p=>p.id===nProj)?.sites||[]:ALL_SITES).map(s=><option key={s}>{s}</option>)}</select></FG>
        <div style={{background:WRNL,border:`1px solid ${WRN}`,borderRadius:RSm,padding:"10px 14px",fontSize:13,color:WRND}}>⚠️ Le changement restreindra l'accès aux agents du nouveau site.</div>
      </Modal>}
    </div>
  );
}

// ══════════════════════════════════════════════════════
// DOC LIST
// ══════════════════════════════════════════════════════
function DocList({ title, docs, onSel, types, icon="" }) {
  const [f, setF] = useState({s:"",p:"",si:"",t:"",ex:"",d:""});
  const list = docs.filter(d => {
    const q = f.s.toLowerCase();
    return (!q||(d.fourn||"").toLowerCase().includes(q)||d.id.toLowerCase().includes(q)||(d.ch?.numero||"").toLowerCase().includes(q))&&
      (!f.p||d.proj===f.p)&&(!f.si||d.site===f.si)&&(!f.t||d.type===f.t)&&(!f.ex||d.exped===f.ex)&&(!f.d||d.date===f.d);
  });

  return (
    <div style={card()}>
      <CardHead title={`${icon} ${title}`} right={[<span key="c" style={bdg("rgba(255,255,255,.2)")}>{list.length} doc{list.length!==1?"s":""}</span>]}/>
      <FilterBar f={f} setF={setF} types={types} PROJETS={PROJETS} ALL_SITES={ALL_SITES} inp={inp} sel={sel}/>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr>{["ID","Type","Fournisseur","Projet","Site","N°","Montant (Ar)","Date","OCR","Statut","Action"].map(c=><th key={c} style={TH}>{c}</th>)}</tr></thead>
          <tbody>
            {list.map((d,i)=>(
              <tr key={d.id} style={{background:i%2===0?WH:"#fafbfe",cursor:"pointer",transition:TR}}
                onMouseEnter={e=>e.currentTarget.style.background=PXl}
                onMouseLeave={e=>e.currentTarget.style.background=i%2===0?WH:"#fafbfe"}>
                <td style={TD}><code style={{fontSize:11,color:P,fontWeight:700}}>{d.id.slice(-10)}</code>{d.conf&&<span style={{marginLeft:4,color:"#5b21b6",display:"inline-flex"}}>{IC.lock}</span>}</td>
                <td style={TD}>{d.type}</td>
                <td style={{...TD,fontWeight:600}}>{d.fourn||d.ch?.emetteur||"—"}</td>
                <td style={{...TD,fontSize:11,color:MUT}}>{d.proj||"—"}</td>
                <td style={{...TD,fontSize:11}}>{d.site||"—"}</td>
                <td style={{...TD,fontFamily:"monospace",fontSize:11}}>{d.ch?.numero||"—"}</td>
                <td style={{...TD,fontWeight:700,textAlign:"right"}}>{d.mt?new Intl.NumberFormat("fr-MG").format(d.mt):"—"}</td>
                <td style={{...TD,fontSize:11}}>{d.date}</td>
                <td style={TD}><span style={{fontSize:12,fontWeight:700,color:d.ocr>=85?SUC:d.ocr>=70?WRN:DNG}}>{d.ocr}%</span></td>
                <td style={TD}><Bdg s={d.conf&&!["VALIDÉ","ARCHIVÉ","REJETÉ","BON À PAYER","CLÔTURÉ","PAYÉ"].includes(d.st)?"CONFIDENTIEL":d.st}/></td>
                <td style={TD}><button style={btn("primary",true)} onClick={()=>onSel(d)}>{IC.eye} Voir</button></td>
              </tr>
            ))}
            {list.length===0&&<tr><td colSpan={11} style={{...TD,textAlign:"center",padding:32,color:MUT}}>Aucun document trouvé</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════════════════
function Dashboard({ docs, users }) {
  const [f, setF] = useState({proj:"",site:"",exp:"",date:""});
  const fd = docs.filter(d=>(!f.proj||d.proj===f.proj)&&(!f.site||d.site===f.site)&&(!f.exp||d.exped===f.exp)&&(!f.date||d.date===f.date));

  const kpi = {
    total:fd.length,
    val:fd.filter(d=>["VALIDÉ","BON À PAYER","ARCHIVÉ"].includes(d.st)).length,
    enc:fd.filter(d=>["EN VALIDATION","EN RETARD"].includes(d.st)).length,
    ret:fd.filter(d=>d.st==="EN RETARD").length,
    rej:fd.filter(d=>d.st==="REJETÉ").length,
    arc:fd.filter(d=>d.st==="ARCHIVÉ").length,
  };
  const parProj  = PROJETS.map(p=>({name:p.id,val:fd.filter(d=>d.proj===p.id&&["VALIDÉ","BON À PAYER","ARCHIVÉ"].includes(d.st)).length,enc:fd.filter(d=>d.proj===p.id&&["EN VALIDATION","EN RETARD"].includes(d.st)).length}));
  const parSite  = ALL_SITES.map(s=>({name:s.slice(0,6),total:fd.filter(d=>d.site===s).length})).filter(x=>x.total>0);
  const parUser  = users.map(u=>({name:u.init,docs:fd.filter(d=>d.etapes.some(e=>e.validBy===u.id)).length+1}));
  const valInst  = users.map(u=>({name:u.init,n:fd.filter(d=>d.etapes.some(e=>(e.v||[]).includes(u.id)&&e.statut==="EN ATTENTE")).length})).filter(x=>x.n>0);
  const COLS     = [P, S, SUC, WRN, INF, "#8b5cf6"];

  return (
    <div>
      {/* Filters */}
      <div style={{...card(),marginBottom:20,padding:"16px 22px",overflow:"visible"}}>
        <div style={{fontSize:11,fontWeight:700,color:P,marginBottom:12,textTransform:"uppercase",letterSpacing:".05em"}}>🎛️ Filtres</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
          {[["Projet","proj",PROJETS.map(p=>({v:p.id,l:`${p.id} – ${p.nom.slice(0,20)}`}))],["Site","site",ALL_SITES.map(s=>({v:s,l:s}))],["Expéditeur","exp",[{v:"Fournisseur",l:"Fournisseur"},{v:"Interne",l:"Interne"},{v:"Confidentiel",l:"Confidentiel"}]]].map(([label,key,opts])=>(
            <div key={key}>
              <label style={lbl}>{label}</label>
              <select style={sel()} value={f[key]} onChange={e=>setF({...f,[key]:e.target.value})}>
                <option value="">Tous</option>
                {opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>
          ))}
          <div>
            <label style={lbl}>Date</label>
            <input type="date" style={inp()} value={f.date} onChange={e=>setF({...f,date:e.target.value})}/>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:12,marginBottom:20}}>
        <StatCard icon="📁" value={kpi.total} label="Total dossiers"  color={P}/>
        <StatCard icon="✅" value={kpi.val}   label="Validés"         color={SUC}/>
        <StatCard icon="⏳" value={kpi.enc}   label="En cours"        color={S}/>
        <StatCard icon="⚠️" value={kpi.ret}   label="En retard"       color={DNG}/>
        <StatCard icon="❌" value={kpi.rej}   label="Rejetés"         color={MUT}/>
        <StatCard icon="📦" value={kpi.arc}   label="Archivés"        color={MUT}/>
      </div>

      {/* Charts row 1 */}
      <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:16,marginBottom:16}}>
        <div style={card()}>
          <div style={{padding:"12px 18px",borderBottom:`1px solid ${BD}`,fontWeight:700,fontSize:14,color:P}}>Dossiers par projet</div>
          <div style={{padding:16}}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={parProj} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke={BD}/><XAxis dataKey="name" tick={{fontSize:11}}/><YAxis tick={{fontSize:11}}/>
                <Tooltip contentStyle={{borderRadius:RSm,fontSize:12}}/><Bar dataKey="val" fill={SUC} radius={[4,4,0,0]} name="Traités"/><Bar dataKey="enc" fill={S} radius={[4,4,0,0]} name="En cours"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div style={card()}>
          <div style={{padding:"12px 18px",borderBottom:`1px solid ${BD}`,fontWeight:700,fontSize:14,color:P}}>Répartition par site</div>
          <div style={{padding:12}}>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart><Pie data={parSite} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="total" nameKey="name">
                {parSite.map((_,i)=><Cell key={i} fill={COLS[i%COLS.length]}/>)}
              </Pie><Tooltip contentStyle={{borderRadius:RSm,fontSize:12}}/></PieChart>
            </ResponsiveContainer>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center"}}>
              {parSite.map((s,i)=><div key={s.name} style={{display:"flex",alignItems:"center",gap:4,fontSize:11}}><span style={{width:8,height:8,borderRadius:"50%",background:COLS[i%COLS.length],flexShrink:0}}/>{s.name}({s.total})</div>)}
            </div>
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div style={card()}>
          <div style={{padding:"12px 18px",borderBottom:`1px solid ${BD}`,fontWeight:700,fontSize:14,color:P}}>En instance par valideur</div>
          <div style={{padding:16}}>
            {valInst.length>0
              ? <ResponsiveContainer width="100%" height={160}><BarChart data={valInst} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke={BD}/><XAxis type="number" tick={{fontSize:10}}/><YAxis dataKey="name" type="category" tick={{fontSize:10}} width={30}/><Tooltip contentStyle={{borderRadius:RSm,fontSize:12}}/><Bar dataKey="n" fill={S} radius={[0,4,4,0]}/></BarChart></ResponsiveContainer>
              : <div style={{padding:24,textAlign:"center",color:SUC,fontWeight:600}}>✅ Aucun dossier en instance</div>}
          </div>
        </div>
        <div style={card()}>
          <div style={{padding:"12px 18px",borderBottom:`1px solid ${BD}`,fontWeight:700,fontSize:14,color:P}}>Dossiers par utilisateur</div>
          <div style={{padding:16}}>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={parUser}><CartesianGrid strokeDasharray="3 3" stroke={BD}/><XAxis dataKey="name" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}}/><Tooltip contentStyle={{borderRadius:RSm,fontSize:12}}/><Bar dataKey="docs" radius={[4,4,0,0]}>{parUser.map((_,i)=><Cell key={i} fill={COLS[i%COLS.length]}/>)}</Bar></BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// GESTION USERS (with sel fix)
// ══════════════════════════════════════════════════════
const BLANK_USER = {nom:"",email:"",role:"",site:"Antananarivo",actif:true,droits:{validMulti:false,saisieOCR:false,docCommun:true,docConf:false,docEnCours:true,avance:false,liquidation:false},projets:[]};

function GestionUsers({ users, setUsers }) {
  const [selected, setSelected] = useState(null);
  const [showF, setShowF]       = useState(false);
  const [editId, setEditId]     = useState(null);
  const [form, setForm]         = useState(BLANK_USER);

  const openEdit = (u) => { setEditId(u.id); setForm({...u}); setShowF(true); setSelected(null); };
  const toggleProj = (pid) => {
    const ex = form.projets.find(x=>x.pid===pid);
    setForm({...form, projets: ex ? form.projets.filter(x=>x.pid!==pid) : [...form.projets,{pid,sites:[]}]});
  };
  const toggleSite = (pid, s) => {
    setForm({...form, projets: form.projets.map(x => x.pid!==pid ? x : {...x, sites: x.sites.includes(s) ? x.sites.filter(v=>v!==s) : [...x.sites,s]})});
  };
  const save = () => {
    if(!form.nom.trim()||!form.email.trim()) return;
    if(editId) { setUsers(p=>p.map(u=>u.id===editId?{...u,...form}:u)); }
    else { setUsers(p=>[...p,{...form,id:gid("U"),init:form.nom.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}]); }
    setShowF(false); setEditId(null); setForm(BLANK_USER);
  };

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h2 style={{fontSize:20,fontWeight:800,color:P}}>👥 Gestion des utilisateurs & droits</h2>
        <button style={btn("primary")} onClick={()=>{setEditId(null);setForm(BLANK_USER);setShowF(true);setSelected(null);}}>{IC.plus} Nouvel utilisateur</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        {users.map(u=>(
          <div key={u.id} style={{...card(),padding:20,borderLeft:`4px solid ${u.actif?P:MUT}`,cursor:"pointer"}} onClick={()=>setSelected(selected?.id===u.id?null:u)}>
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
              <div style={{width:48,height:48,borderRadius:"50%",background:`linear-gradient(135deg,${P},${PLt})`,color:WH,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:16,flexShrink:0}}>{u.init}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:15}}>{u.nom}</div>
                <div style={{fontSize:12,color:MUT}}>{u.role} · {u.site}</div>
                <div style={{fontSize:12,color:MUT}}>{u.email}</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end"}}>
                <span style={bdg(u.actif?SUC:MUT)}>{u.actif?"Actif":"Inactif"}</span>
                <div style={{display:"flex",gap:4}}>
                  <button style={btn("primary",true)} onClick={e=>{e.stopPropagation();openEdit(u);}}>{IC.edit}</button>
                  <button style={btn(u.actif?"warning":"success",true)} onClick={e=>{e.stopPropagation();setUsers(p=>p.map(x=>x.id===u.id?{...x,actif:!x.actif}:x));}}>{u.actif?"⏸":"▶"}</button>
                </div>
              </div>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
              {Object.entries(u.droits).filter(([,v])=>v).map(([k])=>(
                <span key={k} style={bdg(PXl,P,{fontSize:10})}>{DROITS_DEF.find(d=>d.k===k)?.l||k}</span>
              ))}
            </div>
            {selected?.id===u.id&&(
              <div style={{marginTop:12,animation:"fadeIn .2s ease"}}>
                <SecTitle icon={IC.map}>Projets & sites autorisés</SecTitle>
                <div style={{display:"grid",gap:8}}>
                  {u.projets.map(pa=>{
                    const p=PROJETS.find(x=>x.id===pa.pid);
                    return <div key={pa.pid} style={{background:BG,borderRadius:RSm,padding:"9px 14px",border:`1px solid ${BD}`}}>
                      <div style={{fontWeight:600,fontSize:13,color:P,marginBottom:5}}>{pa.pid} – {p?.nom?.slice(0,30)}</div>
                      <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{pa.sites.map(s=><span key={s} style={bdg(PXl,P,{fontSize:11})}>{s}</span>)}</div>
                    </div>;
                  })}
                  {u.projets.length===0&&<div style={{fontSize:13,color:MUT}}>Aucun projet assigné</div>}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showF&&(
        <Modal title={editId?"✏️ Modifier utilisateur":"➕ Nouvel utilisateur"} onClose={()=>setShowF(false)} w={720}
          footer={<><button style={btn("muted")} onClick={()=>setShowF(false)}>Annuler</button><button style={btn("primary")} onClick={save}>{IC.chk} Enregistrer</button></>}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20}}>
            <FG label="Nom complet *"><input style={inp()} value={form.nom} onChange={e=>setForm({...form,nom:e.target.value})} placeholder="Prénom NOM"/></FG>
            <FG label="Email *"><input type="email" style={inp()} value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="nom@org.mg"/></FG>
            <FG label="Rôle / Fonction"><input style={inp()} value={form.role} onChange={e=>setForm({...form,role:e.target.value})} placeholder="Ex: Chef de Projet"/></FG>
            <FG label="Site principal">
              {/* FIXED: use sel() instead of sel */}
              <select style={sel()} value={form.site} onChange={e=>setForm({...form,site:e.target.value})}>
                {ALL_SITES.map(s=><option key={s}>{s}</option>)}
              </select>
            </FG>
            <FG label="Statut" span={2}>
              <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
                <input type="checkbox" checked={form.actif} onChange={e=>setForm({...form,actif:e.target.checked})} style={{width:16,height:16,accentColor:P}}/>
                <span style={{fontSize:14,fontWeight:600}}>Utilisateur actif</span>
              </label>
            </FG>
          </div>
          <SecTitle icon={IC.cog}>Droits et permissions</SecTitle>
          <div style={{display:"grid",gap:8,marginBottom:22}}>
            {DROITS_DEF.map(d=>(
              <label key={d.k} style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer",padding:"10px 14px",borderRadius:RSm,border:`1.5px solid ${form.droits[d.k]?P:BD}`,background:form.droits[d.k]?PXl:WH}}>
                <input type="checkbox" checked={!!form.droits[d.k]} onChange={e=>setForm({...form,droits:{...form.droits,[d.k]:e.target.checked}})} style={{width:16,height:16,accentColor:P,flexShrink:0}}/>
                <div><div style={{fontWeight:600,fontSize:14,color:form.droits[d.k]?P:TXT}}>{d.l}</div><div style={{fontSize:12,color:MUT}}>{d.d}</div></div>
              </label>
            ))}
          </div>
          <SecTitle icon={IC.map}>Projets et sites autorisés</SecTitle>
          <div style={{display:"grid",gap:10}}>
            {PROJETS.map(p=>{
              const a=form.projets.find(x=>x.pid===p.id);
              return <div key={p.id} style={{border:`1.5px solid ${a?P:BD}`,borderRadius:RSm,padding:"12px 16px",background:a?PXl:WH}}>
                <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",marginBottom:a?10:0}}>
                  <input type="checkbox" checked={!!a} onChange={()=>toggleProj(p.id)} style={{width:16,height:16,accentColor:P}}/>
                  <span style={{fontWeight:700,fontSize:14,color:P}}>{p.id} – {p.nom}</span>
                </label>
                {a&&<div style={{display:"flex",gap:6,flexWrap:"wrap",paddingLeft:26}}>
                  {p.sites.map(s=>(
                    <label key={s} style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",padding:"5px 12px",borderRadius:20,border:`1.5px solid ${a.sites.includes(s)?P:BD}`,background:a.sites.includes(s)?P:WH,color:a.sites.includes(s)?WH:TXT,fontSize:13,fontWeight:500}}>
                      <input type="checkbox" checked={a.sites.includes(s)} onChange={()=>toggleSite(p.id,s)} style={{display:"none"}}/>{s}
                    </label>
                  ))}
                </div>}
              </div>;
            })}
          </div>
        </Modal>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════
// PAIEMENTS XML
// ══════════════════════════════════════════════════════
function PaiementsXML({ docs, schemas, setSchemas }) {
  const [selSch, setSelSch]     = useState(schemas[0]?.id||"");
  const [selDocs, setSelDocs]   = useState([]);
  const [showXML, setShowXML]   = useState(false);
  const [showSchF, setShowSchF] = useState(false);
  const [editSch, setEditSch]   = useState(null);
  const [schForm, setSchForm]   = useState({nom:"",banque:"",format:"pain.001.001.03",version:"v1.0",statut:"Test",charset:"UTF-8",natureRemise:"Paiement facture fournisseur",endpoint:""});

  const eligible = docs.filter(d=>d.bap&&d.st==="BON À PAYER");
  const toggle   = id => setSelDocs(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const total    = selDocs.reduce((a,id)=>{const d=docs.find(x=>x.id===id);return a+(d?.mtR||d?.mt||0);},0);
  const sch      = schemas.find(s=>s.id===selSch);

  const genXML = () => {
    const txns = selDocs.map(id=>{
      const d = docs.find(x=>x.id===id);
      const ff = FOURNISSEURS.find(x=>x.id===d?.fid);
      return `    <CdtTrfTxInf>
      <PmtId><EndToEndId>${d?.id}</EndToEndId></PmtId>
      <Amt><InstdAmt Ccy="MGA">${d?.mtR||d?.mt}</InstdAmt></Amt>
      <Cdtr><Nm>${d?.fourn}</Nm></Cdtr>
      <CdtrAcct><Id><IBAN>${ff?.iban||"MG48XXXXXXXXXX"}</IBAN></Id></CdtrAcct>
      <RmtInf><Ustrd>${sch?.natureRemise} — REF: ${d?.ch?.numero} — Projet: ${d?.proj}</Ustrd></RmtInf>
    </CdtTrfTxInf>`;
    }).join("\n");
    return `<?xml version="1.0" encoding="${sch?.charset||"UTF-8"}"?>
<Document>
  <CstmrCdtTrfInitn>
    <GrpHdr>
      <MsgId>SOFTDOCS-${Date.now()}</MsgId>
      <CreDtTm>${new Date().toISOString()}</CreDtTm>
      <NbOfTxs>${selDocs.length}</NbOfTxs>
      <CtrlSum>${total}</CtrlSum>
    </GrpHdr>
    <PmtInf>
${txns}
    </PmtInf>
  </CstmrCdtTrfInitn>
</Document>`;
  };

  const saveSch = () => {
    if(editSch){setSchemas(p=>p.map(s=>s.id===editSch?{...s,...schForm}:s));}
    else{setSchemas(p=>[...p,{id:gid("SCH"),...schForm}]);}
    setShowSchF(false); setEditSch(null);
  };

  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
        <div style={card()}>
          <CardHead title="🔧 Schéma XML" right={[<button key="a" style={btn("light",true)} onClick={()=>{setEditSch(null);setSchForm({nom:"",banque:"",format:"pain.001.001.03",version:"v1.0",statut:"Test",charset:"UTF-8",natureRemise:"Paiement facture fournisseur",endpoint:""});setShowSchF(true);}}>{IC.plus} Nouveau</button>]}/>
          <div style={{padding:18}}>
            <FG label="Schéma de paiement">
              <select style={sel()} value={selSch} onChange={e=>setSelSch(e.target.value)}>
                {schemas.map(s=><option key={s.id} value={s.id}>{s.nom}</option>)}
              </select>
            </FG>
            {sch&&<div style={{background:PXl,borderRadius:RSm,padding:"12px 16px",fontSize:13}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                {[["Banque",sch.banque],["Format",sch.format],["Version",sch.version],["Charset",sch.charset],["Nature",sch.natureRemise],["Statut",sch.statut]].map(([l,v])=>(
                  <div key={l}><span style={{color:MUT,fontWeight:600}}>{l}: </span><b style={{color:P}}>{v}</b></div>
                ))}
              </div>
              <div style={{display:"flex",gap:6,marginTop:10}}>
                <button style={btn("primary",true)} onClick={()=>{setEditSch(sch.id);setSchForm({...sch});setShowSchF(true);}}>{IC.edit} Modifier</button>
              </div>
            </div>}
          </div>
        </div>
        <div style={card()}>
          <CardHead title="💰 Récapitulatif virement"/>
          <div style={{padding:22}}>
            <div style={{fontSize:15,lineHeight:2.2}}>
              <div>Transactions : <b style={{color:P,fontSize:20}}>{selDocs.length}</b></div>
              <div>Montant total : <b style={{color:P,fontSize:22,display:"block",lineHeight:1.4}}>{fmtN(total)}</b></div>
              <div>Nature : <b style={{color:S}}>{sch?.natureRemise||"—"}</b></div>
            </div>
            <div style={{display:"flex",gap:10,marginTop:18}}>
              <button style={{...btn("primary"),opacity:selDocs.length===0?.5:1}} disabled={selDocs.length===0} onClick={()=>setShowXML(true)}>{IC.xml} Générer XML</button>
            </div>
          </div>
        </div>
      </div>

      <div style={card()}>
        <CardHead title="💚 Documents BON À PAYER" right={[<span key="c" style={bdg("rgba(255,255,255,.2)")}>{eligible.length} éligible{eligible.length!==1?"s":""}</span>]}/>
        {eligible.length===0&&<div style={{padding:40,textAlign:"center",color:MUT}}>Aucun document "Bon à payer" disponible</div>}
        {eligible.length>0&&(
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead><tr>{["☑","Référence","Fournisseur","Type","Projet","Site","Montant","Statut"].map(c=><th key={c} style={TH}>{c}</th>)}</tr></thead>
              <tbody>{eligible.map((d,i)=>(
                <tr key={d.id} style={{background:selDocs.includes(d.id)?PXl:i%2===0?WH:"#fafbfe",cursor:"pointer"}} onClick={()=>toggle(d.id)}>
                  <td style={{...TD,textAlign:"center"}}><input type="checkbox" checked={selDocs.includes(d.id)} onChange={()=>toggle(d.id)} style={{width:16,height:16,accentColor:P}}/></td>
                  <td style={TD}><code style={{fontSize:11,color:P,fontWeight:700}}>{d.id.slice(-10)}</code></td>
                  <td style={{...TD,fontWeight:600}}>{d.fourn}</td>
                  <td style={TD}>{d.type}</td>
                  <td style={{...TD,fontSize:11}}>{d.proj||"—"}</td>
                  <td style={{...TD,fontSize:11}}>{d.site}</td>
                  <td style={{...TD,fontWeight:700,textAlign:"right"}}>{fmtN(d.mtR||d.mt)}</td>
                  <td style={TD}><Bdg s={d.st}/></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>

      {showXML&&<Modal title="📄 Aperçu XML" onClose={()=>setShowXML(false)} w={780} footer={<><button style={btn("muted")} onClick={()=>setShowXML(false)}>Fermer</button></>}>
        <div style={{background:"#1e293b",borderRadius:RSm,padding:18,overflowX:"auto"}}>
          <pre style={{color:"#9cdcfe",fontSize:11,margin:0,fontFamily:"'JetBrains Mono',monospace",whiteSpace:"pre-wrap",lineHeight:1.7}}>{genXML()}</pre>
        </div>
      </Modal>}

      {showSchF&&<Modal title={editSch?"✏️ Modifier schéma":"➕ Nouveau schéma XML"} onClose={()=>setShowSchF(false)} w={580} footer={<><button style={btn("muted")} onClick={()=>setShowSchF(false)}>Annuler</button><button style={btn("primary")} onClick={saveSch}>{IC.chk} Enregistrer</button></>}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <FG label="Nom *" span={2}><input style={inp()} value={schForm.nom} onChange={e=>setSchForm({...schForm,nom:e.target.value})}/></FG>
          <FG label="Banque *"><input style={inp()} value={schForm.banque} onChange={e=>setSchForm({...schForm,banque:e.target.value})}/></FG>
          <FG label="Format"><select style={sel()} value={schForm.format} onChange={e=>setSchForm({...schForm,format:e.target.value})}>{["pain.001.001.03","pain.001.001.09","SWIFT MT101","camt.052","camt.053"].map(f=><option key={f}>{f}</option>)}</select></FG>
          <FG label="Nature de remise" span={2}><select style={sel()} value={schForm.natureRemise} onChange={e=>setSchForm({...schForm,natureRemise:e.target.value})}>{XML_NATURES.map(n=><option key={n}>{n}</option>)}</select></FG>
          <FG label="Statut"><select style={sel()} value={schForm.statut} onChange={e=>setSchForm({...schForm,statut:e.target.value})}><option>Test</option><option>Actif</option></select></FG>
          <FG label="Version"><input style={inp()} value={schForm.version} onChange={e=>setSchForm({...schForm,version:e.target.value})}/></FG>
        </div>
      </Modal>}
    </div>
  );
}

// ══════════════════════════════════════════════════════
// PARAM TYPES
// ══════════════════════════════════════════════════════
function ParamTypes({ types, setTypes, users }) {
  const [selected, setSelected] = useState(null);
  const [showF, setShowF]       = useState(false);
  const [editId, setEditId]     = useState(null);
  const [form, setForm]         = useState({nom:"",icone:"📄",conf:false,etapes:[{label:"Réception & Contrôle",v:["U004"]}]});

  const addE  = () => setForm({...form,etapes:[...form.etapes,{label:"",v:[]}]});
  const remE  = i  => setForm({...form,etapes:form.etapes.filter((_,j)=>j!==i)});
  const togV  = (ei,uid) => {
    const e=[...form.etapes];const vs=[...e[ei].v];const ix=vs.indexOf(uid);
    if(ix>=0)vs.splice(ix,1);else vs.push(uid);e[ei]={...e[ei],v:vs};setForm({...form,etapes:e});
  };
  const save = () => {
    if(!form.nom.trim()) return;
    if(editId){setTypes(p=>p.map(t=>t.id===editId?{...t,...form}:t));}
    else{setTypes(p=>[...p,{id:gid("DT"),...form}]);}
    setShowF(false);setEditId(null);
  };

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h2 style={{fontSize:20,fontWeight:800,color:P}}>📋 Types de documents & Circuits</h2>
        <button style={btn("primary")} onClick={()=>{setEditId(null);setForm({nom:"",icone:"📄",conf:false,etapes:[{label:"Réception & Contrôle",v:["U004"]}]});setShowF(true);}}>{IC.plus} Nouveau type</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {types.map(dt=>(
          <div key={dt.id} style={{...card(),padding:20,borderTop:`4px solid ${dt.conf?"#5b21b6":P}`,cursor:"pointer"}} onClick={()=>setSelected(selected?.id===dt.id?null:dt)}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
              <div><div style={{fontWeight:700,fontSize:16}}>{dt.icone} {dt.nom}</div>{dt.conf&&<span style={bdg("#ede9fe","#5b21b6",{fontSize:11,marginTop:4,display:"inline-block"})}>{IC.lock} Confidentiel</span>}</div>
              <div style={{display:"flex",gap:6}}>
                <button style={btn("primary",true)} onClick={e=>{e.stopPropagation();setEditId(dt.id);setForm({nom:dt.nom,icone:dt.icone,conf:dt.conf,etapes:dt.etapes});setShowF(true);}}>{IC.edit}</button>
                <button style={btn("danger",true)} onClick={e=>{e.stopPropagation();setTypes(p=>p.filter(t=>t.id!==dt.id));}}>{IC.trash}</button>
              </div>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:5,alignItems:"center"}}>
              {dt.etapes.map((e,i)=><><span key={i} style={bdg(PXl,P,{fontSize:10})}>{i+1}. {e.label}</span>{i<dt.etapes.length-1&&<span key={`a${i}`} style={{color:MUT,fontSize:11}}>→</span>}</>)}
            </div>
            {selected?.id===dt.id&&(
              <div style={{marginTop:14,animation:"fadeIn .2s ease"}}>
                <SecTitle>Détail des étapes</SecTitle>
                {dt.etapes.map((e,i)=>(
                  <div key={i} style={{display:"flex",gap:12,marginBottom:8}}>
                    <div style={{width:28,height:28,borderRadius:"50%",background:P,color:WH,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12,flexShrink:0}}>{i+1}</div>
                    <div style={{flex:1,padding:"9px 14px",borderRadius:RSm,border:`1px solid ${BD}`,background:BG}}>
                      <b style={{fontSize:13}}>{e.label}</b>
                      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:6}}>{(e.v||[]).map(uid=><Av key={uid} uid={uid} users={users} size={22}/>)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {showF&&<Modal title={editId?"✏️ Modifier type":"➕ Nouveau type"} onClose={()=>setShowF(false)} w={720} footer={<><button style={btn("muted")} onClick={()=>setShowF(false)}>Annuler</button><button style={btn("primary")} onClick={save}>{IC.chk} Enregistrer</button></>}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:18}}>
          <FG label="Nom *"><input style={inp()} value={form.nom} onChange={e=>setForm({...form,nom:e.target.value})}/></FG>
          <FG label="Icône"><input style={inp()} value={form.icone} onChange={e=>setForm({...form,icone:e.target.value})}/></FG>
          <FG label="Circuit confidentiel" span={2}>
            <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
              <input type="checkbox" checked={form.conf} onChange={e=>setForm({...form,conf:e.target.checked})} style={{width:16,height:16,accentColor:P}}/>
              <span style={{fontSize:14,fontWeight:600}}>Accès restreint</span>
            </label>
          </FG>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <SecTitle icon={IC.cog}>Étapes du circuit</SecTitle>
          <button style={btn("primary",true)} onClick={addE}>{IC.plus} Ajouter étape</button>
        </div>
        {form.etapes.map((e,i)=>(
          <div key={i} style={{border:`1.5px solid ${BD}`,borderRadius:RSm,padding:16,marginBottom:12,background:BG}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <b style={{color:P,fontSize:13}}>Étape {i+1}</b>
              {i>0&&<button style={btn("danger",true)} onClick={()=>remE(i)}>{IC.trash}</button>}
            </div>
            <FG label="Libellé *"><input style={inp()} value={e.label} onChange={ev=>{const et=[...form.etapes];et[i]={...et[i],label:ev.target.value};setForm({...form,etapes:et});}}/></FG>
            <label style={{...lbl,marginBottom:10}}>Valideurs autorisés</label>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              {users.map(u=>(
                <label key={u.id} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",padding:"8px 12px",borderRadius:RSm,border:`1.5px solid ${(e.v||[]).includes(u.id)?P:BD}`,background:(e.v||[]).includes(u.id)?PXl:WH}}>
                  <input type="checkbox" checked={(e.v||[]).includes(u.id)} onChange={()=>togV(i,u.id)} style={{accentColor:P,flexShrink:0}}/>
                  <div style={{width:24,height:24,borderRadius:"50%",background:`linear-gradient(135deg,${P},${PLt})`,color:WH,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,flexShrink:0}}>{u.init}</div>
                  <span style={{fontSize:11,fontWeight:600}}>{u.nom}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </Modal>}
    </div>
  );
}

// ══════════════════════════════════════════════════════
// PARAM RECEVEURS
// ══════════════════════════════════════════════════════
function ParamReceveurs({ recv, setRecv, users }) {
  const toggle = (type,uid) => {const c=[...recv[type]];const ix=c.indexOf(uid);if(ix>=0)c.splice(ix,1);else c.push(uid);setRecv({...recv,[type]:c});};
  const CATS = [
    ["fournisseurs","📥 Receveurs Documents Fournisseurs","Agents qui traitent les documents fournisseurs.",P],
    ["confidentiels","🔒 Receveurs Documents Confidentiels","Agents habilités pour les circuits confidentiels.","#5b21b6"],
    ["internes","📨 Receveurs Documents Internes","Agents traitant les documents des services internes.",INF],
  ];
  return (
    <div>
      {CATS.map(([type,title,desc,color])=>(
        <div key={type} style={{...card(),marginBottom:16}}>
          <CardHead title={title} color={color}/>
          <div style={{padding:20}}>
            <p style={{fontSize:14,color:MUT,marginBottom:18}}>{desc}</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:10,marginBottom:16}}>
              {users.map(u=>{const ok=recv[type].includes(u.id);return(
                <label key={u.id} style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer",padding:"12px 14px",borderRadius:RSm,border:`1.5px solid ${ok?color:BD}`,background:ok?color+"12":WH}}>
                  <input type="checkbox" checked={ok} onChange={()=>toggle(type,u.id)} style={{width:16,height:16,accentColor:color}}/>
                  <div style={{width:34,height:34,borderRadius:"50%",background:ok?color:"#e2e8f0",color:ok?WH:MUT,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:11,flexShrink:0}}>{u.init}</div>
                  <div><div style={{fontWeight:600,fontSize:13,color:ok?color:TXT}}>{u.nom}</div><div style={{fontSize:11,color:MUT}}>{u.role}</div></div>
                </label>
              );})}
            </div>
            <div style={{background:BG,borderRadius:RSm,padding:"10px 14px",fontSize:13,border:`1px solid ${BD}`}}>
              <b>Receveurs ({recv[type].length}) :</b>{" "}
              {recv[type].length===0?"Aucun":recv[type].map(uid=><span key={uid} style={bdg(PXl,P,{marginLeft:6,fontSize:11})}>{users.find(u=>u.id===uid)?.nom||uid}</span>)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════
// LIQUIDATIONS
// ══════════════════════════════════════════════════════
function Liquidations({ docs, liq, setLiq }) {
  const [showF, setShowF] = useState(false);
  const [form, setForm]   = useState({docRef:"",type:"Paiement facture",banque:"BOA Madagascar",mt:"",notes:""});
  const eligible = docs.filter(d=>["VALIDÉ","BON À PAYER"].includes(d.st)&&!liq.find(l=>l.docRef===d.id));
  const sd = docs.find(d=>d.id===form.docRef);

  const create = () => {
    if(!form.docRef) return;
    const d=docs.find(x=>x.id===form.docRef); if(!d) return;
    setLiq(p=>[...p,{id:gid("LIQ"),docRef:form.docRef,fourn:d.fourn,mt:form.mt?parseInt(form.mt):d.mtR||d.mt,type:form.type,st:"EN ATTENTE PAIEMENT",date:new Date().toISOString().slice(0,10),banque:form.banque,notes:form.notes}]);
    setShowF(false);setForm({docRef:"",type:"Paiement facture",banque:"BOA Madagascar",mt:"",notes:""});
  };

  return (
    <div style={card()}>
      <CardHead title="💳 Gestion des Liquidations" right={[<button key="n" style={btn("light",true)} onClick={()=>setShowF(!showF)}>{IC.plus} Nouvelle liquidation</button>]}/>
      {showF&&(
        <div style={{padding:20,background:PXl,borderBottom:`1px solid ${BD}`}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
            <FG label="Document éligible" req>
              <select style={sel()} value={form.docRef} onChange={e=>setForm({...form,docRef:e.target.value})}>
                <option value="">-- Sélectionner --</option>
                {eligible.map(d=><option key={d.id} value={d.id}>{d.id.slice(-10)} — {d.fourn} — {fmtN(d.mtR||d.mt)}</option>)}
              </select>
            </FG>
            <FG label="Type">
              <select style={sel()} value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                {["Paiement facture","Avance de démarrage","Paiement contrat","Remboursement","Paiement prestation"].map(t=><option key={t}>{t}</option>)}
              </select>
            </FG>
            <FG label="Banque">
              <select style={sel()} value={form.banque} onChange={e=>setForm({...form,banque:e.target.value})}>
                {["BOA Madagascar","BNI Madagascar","MCB Madagascar","Société Générale"].map(b=><option key={b}>{b}</option>)}
              </select>
            </FG>
            <FG label={`Montant (laissez vide = ${sd?fmtN(sd.mtR||sd.mt):"—"})`} span={2}>
              <input style={inp()} type="number" value={form.mt} onChange={e=>setForm({...form,mt:e.target.value})}/>
            </FG>
            <FG label="Notes"><input style={inp()} value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></FG>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button style={btn("success")} onClick={create}>{IC.chk} Créer</button>
            <button style={btn("muted")} onClick={()=>setShowF(false)}>Annuler</button>
          </div>
        </div>
      )}
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr>{["Référence","Doc source","Fournisseur","Type","Montant","Banque","Date","Statut","Action"].map(c=><th key={c} style={TH}>{c}</th>)}</tr></thead>
          <tbody>
            {liq.map((l,i)=>(
              <tr key={l.id} style={{background:i%2===0?WH:"#fafbfe"}}>
                <td style={TD}><code style={{fontSize:11,color:P,fontWeight:700}}>{l.id.slice(-8)}</code></td>
                <td style={{...TD,fontSize:11,fontFamily:"monospace",color:S}}>{l.docRef.slice(-10)}</td>
                <td style={{...TD,fontWeight:600}}>{l.fourn}</td>
                <td style={{...TD,fontSize:12}}>{l.type}</td>
                <td style={{...TD,fontWeight:700,textAlign:"right"}}>{fmtN(l.mt)}</td>
                <td style={{...TD,fontSize:12}}>{l.banque}</td>
                <td style={{...TD,fontSize:11}}>{l.date}</td>
                <td style={TD}><Bdg s={l.st}/></td>
                <td style={TD}>{l.st==="EN ATTENTE PAIEMENT"&&<button style={btn("success",true)} onClick={()=>setLiq(p=>p.map(x=>x.id===l.id?{...x,st:"PAYÉ"}:x))}>{IC.chk} Payer</button>}</td>
              </tr>
            ))}
            {liq.length===0&&<tr><td colSpan={9} style={{...TD,textAlign:"center",padding:32,color:MUT}}>Aucune liquidation créée</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// SUIVI DOCUMENT
// ══════════════════════════════════════════════════════
function SuiviDoc({ docs }) {
  const [ref, setRef]       = useState("");
  const [found, setFound]   = useState(null);
  const [searched, setSrch] = useState(false);
  const SC = {VALIDÉ:SUC,REJETÉ:DNG,"EN ATTENTE":BD,"EN RETARD":DNG};

  const search = () => {
    setSrch(true);
    const d = docs.find(d=>d.id.toLowerCase()===ref.toLowerCase()||(d.ch?.numero||"").toLowerCase()===ref.toLowerCase());
    setFound(d||null);
  };
  const done  = found ? found.etapes.filter(e=>e.statut==="VALIDÉ").length : 0;
  const total = found ? found.etapes.length : 0;

  return (
    <div>
      <div style={{...card(),marginBottom:20,padding:24}}>
        <div style={{fontWeight:700,fontSize:17,color:P,marginBottom:6}}>🔍 Suivi de l'évolution d'un document</div>
        <div style={{fontSize:14,color:MUT,marginBottom:16}}>Entrez la référence SoftDocs ou le numéro du document</div>
        <div style={{display:"flex",gap:10,maxWidth:540}}>
          <input style={{...inp(),flex:1}} value={ref} onChange={e=>setRef(e.target.value)} placeholder="Ex: DOC-2025-001 ou FAC-2025-0147..." onKeyDown={e=>e.key==="Enter"&&search()}/>
          <button style={btn("primary")} onClick={search}>{IC.search} Rechercher</button>
        </div>
        <div style={{fontSize:12,color:MUT,marginTop:8}}>💡 Essayez : DOC-2025-001, DOC-2025-004, FAC-TELMA-0891</div>
      </div>
      {searched&&!found&&<div style={{...card(),padding:40,textAlign:"center"}}><div style={{fontSize:48,marginBottom:12}}>🔎</div><b style={{color:DNG,fontSize:16}}>Document introuvable</b></div>}
      {found&&(
        <div style={{...card(),animation:"fadeIn .3s ease"}}>
          <CardHead title={`${found.type} — ${found.fourn||"Interne"}`} right={[<Bdg key="s" s={found.st}/>]}/>
          <div style={{padding:22}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10,marginBottom:20}}>
              {[["Référence",found.id],["N° Doc",found.ch?.numero],["Projet",found.proj||"—"],["Site",found.site||"—"],["Montant",fmtN(found.mt)],["Date",found.date],["OCR",found.ocr+"%"]].map(([l,v])=>(
                <div key={l} style={{background:PXl,borderRadius:RSm,padding:"9px 12px"}}><div style={{fontSize:10,color:MUT,fontWeight:700,textTransform:"uppercase",marginBottom:3}}>{l}</div><div style={{fontSize:12,fontWeight:700,color:P,wordBreak:"break-all"}}>{v}</div></div>
              ))}
            </div>
            <div style={{marginBottom:20}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,fontWeight:600,marginBottom:6}}><span style={{color:P}}>Avancement</span><span style={{color:MUT}}>{done}/{total} — {total?Math.round(done/total*100):0}%</span></div>
              <div style={{height:10,background:BD,borderRadius:5,overflow:"hidden"}}><div style={{height:"100%",background:`linear-gradient(90deg,${P},${PLt})`,width:`${total?Math.round(done/total*100):0}%`,borderRadius:5}}/></div>
            </div>
            {found.etapes.map((e,i)=>(
              <div key={i} style={{display:"flex",gap:14,marginBottom:8}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:SC[e.statut]||S,color:e.statut==="EN ATTENTE"?MUT:WH,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:11,flexShrink:0}}>{e.statut==="VALIDÉ"?IC.chk:e.statut==="REJETÉ"?IC.x:i+1}</div>
                <div style={{flex:1,padding:"9px 14px",borderRadius:RSm,background:e.statut==="VALIDÉ"?SUCL:e.statut==="REJETÉ"?DNGL:BG,border:`1px solid ${BD}`,fontSize:13}}>
                  <div style={{display:"flex",justifyContent:"space-between"}}><b style={{color:P}}>{e.label}</b><Bdg s={e.statut} sm/></div>
                  {e.date&&<div style={{fontSize:11,color:MUT,marginTop:2}}>{e.date}</div>}
                  {e.comment&&e.statut!=="EN ATTENTE"&&<div style={{fontSize:12,color:MUT,fontStyle:"italic",marginTop:4}}>"{e.comment}"</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════
const VL = {
  dashboard:"Tableau de bord", depot:"Déposer un document", suivi:"Suivi document",
  detail:"Détail document", liq:"Liquidations", paiements:"Paiements XML",
  users:"Utilisateurs & droits", param_types:"Types de documents", param_recv:"Receveurs"
};
DOC_MENUS.forEach(m=>{ VL[m.id]=m.icon+" "+m.label; });

const NAV = [
  {id:"dashboard", label:"Tableau de bord", icon:IC.dash,    direct:true},
  {id:"depot",     label:"Déposer un doc",  icon:IC.upload,  direct:true},
  {id:"suivi",     label:"Suivi document",  icon:IC.search,  direct:true},
  {id:"documents", label:"Mes Documents",   icon:IC.folder,  children:DOC_MENUS},
  {id:"financier", label:"Financier",       icon:IC.money,   children:[{id:"liq",label:"Liquidations",icon:"💳",direct:true},{id:"paiements",label:"Paiements XML",icon:"🏦",direct:true}]},
  {id:"param",     label:"Paramétrage",     icon:IC.cog,     children:[{id:"users",label:"Utilisateurs & droits",icon:"👥",direct:true},{id:"param_types",label:"Types de documents",icon:"📋",direct:true},{id:"param_recv",label:"Receveurs",icon:"📨",direct:true}]},
];

export default function App() {
  const [docs, setDocs]       = useState(INIT_DOCS);
  const [users, setUsers]     = useState(INIT_USERS);
  const [types, setTypes]     = useState(INIT_TYPES);
  const [schemas, setSchemas] = useState(INIT_SCHEMAS);
  const [recv, setRecv]       = useState(INIT_RECV);
  const [liq, setLiq]         = useState([{id:"LIQ-001",docRef:"DOC-2025-001",fourn:"JIRAMA",mt:48750000,type:"Paiement facture",st:"PAYÉ",date:"2025-01-22",banque:"BOA Madagascar",notes:"Facture énergie janvier"}]);
  const [view, setView]       = useState("dashboard");
  const [selDoc, setSelDoc]   = useState(null);
  const [docCtx, setDocCtx]   = useState("en-cours");
  const [collapsed, setCol]   = useState(false);
  const [mobileOpen, setMob]  = useState(false);
  const [openNav, setOpenNav] = useState({documents:true,financier:false,param:false});
  const [notifOpen, setNO]    = useState(false);

  const addDoc = d  => setDocs(p=>[...p,d]);
  const updDoc = u  => { setDocs(p=>p.map(d=>d.id===u.id?u:d)); setSelDoc(u); };
  const openDoc = (d,ctx) => { setSelDoc(d); setDocCtx(ctx); setView("detail"); };

  const retards = docs.filter(d=>d.st==="EN RETARD").length;

  const renderContent = () => {
    if(view==="dashboard")   return <Dashboard docs={docs} users={users}/>;
    if(view==="depot")       return <DepotDoc onDeposit={addDoc} types={types}/>;
    if(view==="suivi")       return <SuiviDoc docs={docs}/>;
    if(view==="liq")         return <Liquidations docs={docs} liq={liq} setLiq={setLiq}/>;
    if(view==="paiements")   return <PaiementsXML docs={docs} schemas={schemas} setSchemas={setSchemas}/>;
    if(view==="users")       return <GestionUsers users={users} setUsers={setUsers}/>;
    if(view==="param_types") return <ParamTypes types={types} setTypes={setTypes} users={users}/>;
    if(view==="param_recv")  return <ParamReceveurs recv={recv} setRecv={setRecv} users={users}/>;
    if(view==="detail"&&selDoc) return <DocDetail doc={selDoc} onBack={()=>{const backs={["recus-f"]:"recus-f","courrier":"courrier","envoyes":"envoyes","refuses":"refuses","en-cours":"en-cours","recu":"recu"};setView(backs[docCtx]||"en-cours");}} onUpdate={updDoc} ctx={docCtx} users={users}/>;
    const m = DOC_MENUS.find(x=>x.id===view);
    if(m) return <DocList title={m.label} icon={m.icon} docs={filterDocsByMenu(docs,view)} onSel={d=>openDoc(d,getDocCtx(view))} types={types}/>;
    return null;
  };

  const Sidebar = ({ mobile=false }) => (
    <aside style={{
      width: mobile ? 280 : collapsed ? 58 : 260,
      background:"linear-gradient(180deg,#1c2741 0%,#324372 60%,#2b3a62 100%)",
      flexShrink:0, display:"flex", flexDirection:"column",
      transition:"width .22s ease", overflow:"hidden",
      boxShadow:"4px 0 24px rgba(20,29,48,.25)",
      ...(mobile ? {position:"fixed",inset:"0 auto 0 0",zIndex:100,width:280} : {})
    }}>
      {/* Logo */}
      <div style={{padding:"15px 13px",borderBottom:"1px solid rgba(255,255,255,.1)",display:"flex",alignItems:"center",gap:12,background:"rgba(0,0,0,.25)",flexShrink:0}}>
        <div style={{width:36,height:36,borderRadius:8,background:S,color:PDk,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:14,flexShrink:0}}>SD</div>
        {(!collapsed||mobile)&&<div><div style={{color:WH,fontWeight:800,fontSize:15,letterSpacing:"-.3px"}}>SoftDocs</div><div style={{color:S,fontSize:11}}>GED & Processus Financiers</div></div>}
      </div>

      {/* Nav */}
      <nav style={{flex:1,overflowY:"auto",padding:"8px 6px",scrollbarWidth:"thin"}}>
        {NAV.map(item=>(
          <div key={item.id}>
            <div className={`nav-item ${view===item.id?"active":""}`}
              onClick={()=>{ if(item.direct){setView(item.id);if(mobile)setMob(false);}else setOpenNav(p=>({...p,[item.id]:!p[item.id]})); }}
              style={{justifyContent:collapsed&&!mobile?"center":"flex-start"}}>
              <span style={{color:view===item.id?S:"rgba(255,255,255,.8)",flexShrink:0,display:"flex"}}>{item.icon}</span>
              {(!collapsed||mobile)&&<>
                <span style={{flex:1,fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>{item.label}</span>
                {item.children&&<span style={{fontSize:10,transform:openNav[item.id]?"rotate(90deg)":"none",transition:TR,display:"flex",color:"rgba(255,255,255,.4)"}}>{IC.chev}</span>}
              </>}
            </div>
            {(!collapsed||mobile)&&item.children&&openNav[item.id]&&(
              <div style={{background:"rgba(0,0,0,.22)"}}>
                {item.children.map(ch=>{
                  const active=view===ch.id;
                  const cnt=ch.id&&DOC_MENUS.find(m=>m.id===ch.id)?filterDocsByMenu(docs,ch.id).length:null;
                  return (
                    <div key={ch.id} className={`nav-subitem ${active?"active":""}`}
                      onClick={()=>{setView(ch.id);if(mobile)setMob(false);}}>
                      <span style={{fontSize:13,flexShrink:0}}>{ch.icon||"•"}</span>
                      <span style={{flex:1,whiteSpace:"nowrap"}}>{ch.label}</span>
                      {cnt!==null&&<span style={bdg("rgba(255,255,255,.15)",WH,{fontSize:10,padding:"1px 6px"})}>{cnt}</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User */}
      {(!collapsed||mobile)&&(
        <div style={{padding:"10px 13px",borderTop:"1px solid rgba(255,255,255,.1)",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <div style={{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${S},${SDk})`,color:PDk,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12,flexShrink:0}}>RL</div>
          <div style={{flex:1}}><div style={{color:WH,fontSize:12,fontWeight:600}}>Randria Lova</div><div style={{color:S,fontSize:11}}>Super Admin</div></div>
          <button style={{background:"none",border:"none",color:"rgba(255,255,255,.35)",cursor:"pointer",fontSize:15}}>⏻</button>
        </div>
      )}
    </aside>
  );

  return (
    <div style={{display:"flex",height:"100vh",overflow:"hidden",fontFamily:"'DM Sans',system-ui,sans-serif",background:BG,color:TXT}}>
      {/* Mobile overlay */}
      {mobileOpen&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:99}} onClick={()=>setMob(false)}/>}
      {mobileOpen&&<Sidebar mobile/>}

      {/* Desktop sidebar */}
      <div className="hide-mobile" style={{display:"flex"}}>
        <Sidebar/>
      </div>

      {/* Main */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {/* Topbar */}
        <header style={{background:"linear-gradient(90deg,#232f52 0%,#324372 60%,#3d5390 100%)",display:"flex",alignItems:"center",padding:"0 18px",height:56,flexShrink:0,boxShadow:"0 2px 10px rgba(36,54,103,.35)"}}>
          {/* Desktop collapse */}
          <button onClick={()=>setCol(!collapsed)} className="hide-mobile" style={{background:"rgba(255,255,255,.12)",border:"none",color:WH,width:34,height:34,borderRadius:RSm,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",marginRight:14}}>
            {IC.menu}
          </button>
          {/* Mobile menu */}
          <button onClick={()=>setMob(true)} className="show-mobile-only" style={{background:"rgba(255,255,255,.12)",border:"none",color:WH,width:34,height:34,borderRadius:RSm,cursor:"pointer",display:"none",alignItems:"center",justifyContent:"center",marginRight:14}}>
            {IC.menu}
          </button>

          <div style={{flex:1}}>
            <div style={{color:WH,fontWeight:700,fontSize:15}}>{VL[view]||"SoftDocs"}</div>
            <div style={{color:"rgba(255,255,255,.55)",fontSize:11}}>{new Date().toLocaleDateString("fr-MG",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</div>
          </div>

          <div style={{display:"flex",alignItems:"center",gap:10}}>
            {retards>0&&<div style={bdg(DNG,WH,{fontSize:11})}>⚠️ {retards} retard{retards>1?"s":""}</div>}
            <button style={btn("secondary",true)} onClick={()=>setView("depot")}>{IC.upload} Déposer</button>
            <div style={{position:"relative"}}>
              <button onClick={()=>setNO(!notifOpen)} style={{background:"rgba(255,255,255,.12)",border:"none",color:WH,width:36,height:36,borderRadius:RSm,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
                {IC.bell}<span style={{position:"absolute",top:6,right:6,width:8,height:8,background:DNG,borderRadius:"50%"}}/>
              </button>
              {notifOpen&&(
                <div style={{position:"absolute",right:0,top:44,width:300,background:WH,borderRadius:R,boxShadow:SHADOW_M,border:`1px solid ${BD}`,zIndex:999}}>
                  <div style={{padding:"10px 16px",borderBottom:`1px solid ${BD}`,display:"flex",justifyContent:"space-between"}}>
                    <b style={{fontSize:13,color:P}}>Notifications</b>
                    <button onClick={()=>setNO(false)} style={{background:"none",border:"none",cursor:"pointer",fontSize:14,display:"flex"}}>{IC.x}</button>
                  </div>
                  {[{m:"DOC-2025-004 — Délai dépassé",u:true,t:"2h"},{m:"Nouveau dépôt: TELMA SA reçu",u:false,t:"4h"},{m:"DOC-2025-003 en attente validation",u:false,t:"1j"}].map((n,i)=>(
                    <div key={i} style={{padding:"10px 16px",borderBottom:`1px solid ${BD}`,background:n.u?DNGL:WH,display:"flex",gap:10}}>
                      <span>{n.u?"⚠️":"🔔"}</span>
                      <div><div style={{fontSize:13}}>{n.m}</div><div style={{fontSize:11,color:MUT}}>Il y a {n.t}</div></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${S},${SDk})`,display:"flex",alignItems:"center",justifyContent:"center",color:PDk,fontWeight:700,fontSize:12}}>RL</div>
          </div>
        </header>

        {/* Breadcrumb */}
        <div style={{background:WH,borderBottom:`1px solid ${BD}`,padding:"7px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div style={{fontSize:12,color:MUT}}>
            <span style={{color:P,fontWeight:600,cursor:"pointer"}} onClick={()=>setView("dashboard")}>🏠 Accueil</span>
            <span style={{margin:"0 8px"}}>›</span>
            <span style={{color:TXT}}>{VL[view]||view}</span>
          </div>
          <div style={{display:"flex",gap:6}}>
            <span style={bdg(PXl,P,{fontSize:11})}>📁 {docs.length} documents</span>
            <span style={bdg(WRNL,WRND,{fontSize:11})}>⏳ {docs.filter(d=>["EN VALIDATION","EN RETARD"].includes(d.st)).length} en cours</span>
            {retards>0&&<span style={bdg(DNGL,DNGD,{fontSize:11})}>⚠️ {retards} en retard</span>}
          </div>
        </div>

        {/* Content */}
        <main style={{flex:1,overflowY:"auto",padding:"18px 20px"}}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
