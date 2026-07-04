"use client";
import{useState,useRef}from"react";
import{card,btn,inp,TH,TD,P,BD,MUT,SUC,SUCL,SUCD,RSm,WH,DNG,DNGL}from"../../lib/theme";
import{useApp}from"../../context/AppContext";
import{fmtN,gid}from"../../lib/utils";

const PAYS_LIST=["Madagascar","France","Maurice","Comores","Réunion","Autre"];
const SPECIALITES=["BTP / Construction","Énergie / Eau","IT / Télécoms","Santé / Pharmacie","Fournitures de bureau","Logistique / Transport","Conseil / Formation","Agriculture / Élevage","Autre"];

/* ── Blank RIB ── */
const BLANK_RIB=()=>({id:gid(),banque:"",domiciliation:"",codeBanque:"",codeGuichet:"",numCompte:"",cle:"",swift:"",iban:""});

/* ── RIB form (single bank account) ── */
function RIBForm({val,onChange}){
  const u=(k,v)=>onChange({...val,[k]:v});
  return(
    <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr",gap:10}}>
      <div style={{gridColumn:"1/-1"}}><FL>Nom de la banque</FL><input value={val.banque||""} onChange={e=>u("banque",e.target.value)} style={inp({fontSize:13})}/></div>
      <div style={{gridColumn:"1/-1"}}><FL>Domiciliation</FL><input value={val.domiciliation||""} onChange={e=>u("domiciliation",e.target.value)} style={inp({fontSize:13})}/></div>
      <div><FL>Code Banque</FL><input value={val.codeBanque||""} onChange={e=>u("codeBanque",e.target.value)} style={inp({fontSize:13})} placeholder="00001"/></div>
      <div><FL>Code Guichet</FL><input value={val.codeGuichet||""} onChange={e=>u("codeGuichet",e.target.value)} style={inp({fontSize:13})} placeholder="01001"/></div>
      <div><FL>N° de compte</FL><input value={val.numCompte||""} onChange={e=>u("numCompte",e.target.value)} style={inp({fontSize:13})}/></div>
      <div><FL>Clé</FL><input value={val.cle||""} onChange={e=>u("cle",e.target.value)} style={inp({fontSize:13})} placeholder="23" maxLength={2}/></div>
      <div><FL>Code SWIFT</FL><input value={val.swift||""} onChange={e=>u("swift",e.target.value)} style={inp({fontSize:13})} placeholder="XXXXMGMG"/></div>
      <div><FL>IBAN</FL><input value={val.iban||""} onChange={e=>u("iban",e.target.value)} style={inp({fontSize:13})} placeholder="MG48…"/></div>
    </div>
  );
}

/* ── Multi-bank tabs component ── */
function BankTabs({comptes,onChange}){
  const[activeTab,setActiveTab]=useState(0);
  const banks=comptes&&comptes.length>0?comptes:[BLANK_RIB()];
  
  function addBank(){
    const next=[...banks,BLANK_RIB()];
    onChange(next);
    setActiveTab(next.length-1);
  }
  function removeBank(idx){
    if(banks.length<=1)return;
    const next=banks.filter((_,i)=>i!==idx);
    onChange(next);
    setActiveTab(Math.min(activeTab,next.length-1));
  }
  function updateBank(idx,val){
    const next=banks.map((b,i)=>i===idx?val:b);
    onChange(next);
  }

  return(
    <div>
      {/* Tab headers */}
      <div style={{display:"flex",gap:0,borderBottom:"1px solid "+BD,marginBottom:16}}>
        {banks.map((b,i)=>(
          <div key={b.id||i} style={{display:"flex",alignItems:"center",gap:4,padding:"8px 14px",borderBottom:`2px solid ${activeTab===i?P:"transparent"}`,cursor:"pointer",background:activeTab===i?"#f0f7ff":"transparent"}}
            onClick={()=>setActiveTab(i)}>
            <span style={{fontSize:12.5,fontWeight:activeTab===i?700:500,color:activeTab===i?P:"#495057"}}>
              🏦 {b.banque||`Compte ${i+1}`}
            </span>
            {banks.length>1&&(
              <span onClick={e=>{e.stopPropagation();removeBank(i);}}
                style={{marginLeft:4,fontSize:13,color:"#adb5bd",cursor:"pointer",lineHeight:1,fontWeight:700}}
                title="Supprimer ce compte">×</span>
            )}
          </div>
        ))}
        <button onClick={addBank}
          style={{padding:"8px 12px",border:"none",background:"transparent",cursor:"pointer",fontSize:12,color:P,fontWeight:600,fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}}
          title="Ajouter un compte bancaire">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Ajouter compte
        </button>
      </div>
      {/* Active tab content */}
      <RIBForm val={banks[activeTab]||BLANK_RIB()} onChange={v=>updateBank(activeTab,v)}/>
    </div>
  );
}

/* ── Export helper ── */
function exportCSV(rows,filename){
  if(!rows.length)return;
  const headers=Object.keys(rows[0]);
  const csv=[headers.join(";"),...rows.map(r=>headers.map(h=>{const v=r[h]||"";return typeof v==="object"?JSON.stringify(v):`"${String(v).replace(/"/g,'""')}"`;}).join(";"))].join("\n");
  const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=filename;a.click();
}

export default function GestionFournisseurs(){
  const{fournComptes,setFournComptes,docs}=useApp();
  const[modal,setModal]=useState(null);
  const[edit,setEdit]=useState({});
  const[selFourn,setSelFourn]=useState(null);
  const[q,setQ]=useState("");
  const fileRef=useRef();

  const up=(k,v)=>setEdit(p=>({...p,[k]:v}));

  function openNew(){
    setEdit({id:"",raisonSociale:"",nomContact:"",email:"",telephone:"",
      adresse1:"",adresse2:"",ville:"",pays:"Madagascar",
      nif:"",stat:"",rc:"",niu:"",nBad:"",nAgrement:"",dateAgrement:"",specialites:"",
      comptesBank:[BLANK_RIB()],
      echeance:30,jourEcheance:1,actif:true});
    setModal("edit");
  }

  function openEdit(f){
    const old=f;
    let comptesBank=old.comptesBank;
    if(!comptesBank||!comptesBank.length){
      const rb=BLANK_RIB();
      rb.banque=old.banque||"";rb.domiciliation=old.domiciliation||"";
      rb.codeBanque=old.codeBanque||"";rb.codeGuichet=old.codeGuichet||"";
      rb.numCompte=old.numCompte||"";rb.cle=old.cle||"";
      rb.swift=old.swift||"";rb.iban=old.iban||"";
      const rb2=BLANK_RIB();
      rb2.banque=old.banque2||"";rb2.iban=old.iban2||"";
      comptesBank=(rb.banque||rb.iban)?[rb,...(rb2.banque||rb2.iban?[rb2]:[])]:[BLANK_RIB()];
    }
    setEdit({...f,comptesBank});
    setModal("edit");
  }

  function save(){
    if(!edit.raisonSociale){alert("La raison sociale est requise.");return;}
    const saved={...edit};
    if(edit.id){
      setFournComptes(p=>p.map(x=>x.id===edit.id?saved:x));
    }else{
      setFournComptes(p=>[{...saved,id:"FC"+Date.now().toString(36).toUpperCase(),dateCreation:new Date().toLocaleDateString("fr-FR"),nbDocs:0,actif:true},...p]);
    }
    setModal(null);
  }

  function del(id){
    if(!confirm("Supprimer ce fournisseur ?"))return;
    setFournComptes(p=>p.filter(x=>x.id!==id));
  }

  function doExport(){
    const rows=fournComptes.map(f=>({
      ID:f.id,RaisonSociale:f.raisonSociale,Contact:f.nomContact||"",Email:f.email||"",
      Telephone:f.telephone||"",Adresse:f.adresse1||"",Ville:f.ville||"",Pays:f.pays||"",
      NIF:f.nif||"",STAT:f.stat||"",RC:f.rc||"",NIU:f.niu||"",
      Specialites:f.specialites||"",Actif:f.actif?"Oui":"Non",
      DateCreation:f.dateCreation||"",
      Banque1:(f.comptesBank||[])[0]?.banque||f.banque||"",
      IBAN1:(f.comptesBank||[])[0]?.iban||f.iban||"",
      Banque2:(f.comptesBank||[])[1]?.banque||f.banque2||"",
      IBAN2:(f.comptesBank||[])[1]?.iban||f.iban2||"",
    }));
    exportCSV(rows,"fournisseurs_export.csv");
  }

  function doImport(e){
    const file=e.target.files?.[0];if(!file)return;
    const reader=new FileReader();
    reader.onload=ev=>{
      const lines=ev.target.result.split("\n").filter(Boolean);
      if(lines.length<2)return;
      const headers=lines[0].split(";").map(h=>h.replace(/^"|"$/g,"").trim());
      const newF=lines.slice(1).map(line=>{
        const vals=line.split(";").map(v=>v.replace(/^"|"$/g,"").trim());
        const row={};headers.forEach((h,i)=>row[h]=vals[i]||"");
        return{
          id:"FC"+Date.now().toString(36).toUpperCase()+Math.random().toString(36).slice(2,5),
          raisonSociale:row.RaisonSociale||row.raisonSociale||"",
          nomContact:row.Contact||row.nomContact||"",
          email:row.Email||row.email||"",
          telephone:row.Telephone||"",
          adresse1:row.Adresse||row.adresse1||"",
          ville:row.Ville||"",pays:row.Pays||"Madagascar",
          nif:row.NIF||"",stat:row.STAT||"",rc:row.RC||"",niu:row.NIU||"",
          specialites:row.Specialites||"",actif:row.Actif!=="Non",
          dateCreation:new Date().toLocaleDateString("fr-FR"),nbDocs:0,
          comptesBank:[{...BLANK_RIB(),banque:row.Banque1||"",iban:row.IBAN1||""},
                       ...(row.Banque2||row.IBAN2?[{...BLANK_RIB(),banque:row.Banque2||"",iban:row.IBAN2||""}]:[])],
        };
      }).filter(f=>f.raisonSociale);
      if(newF.length){setFournComptes(p=>[...p,...newF]);alert(`${newF.length} fournisseur(s) importé(s).`);}
    };
    reader.readAsText(file,"utf-8");
    e.target.value="";
  }

  const filtered=fournComptes.filter(f=>!q||f.raisonSociale.toLowerCase().includes(q.toLowerCase())||f.email?.toLowerCase().includes(q.toLowerCase())||f.nif?.includes(q));

  /* ── Fournisseur detail ── */
  if(selFourn){
    const fourn=selFourn;
    const fDocs=docs.filter(d=>d.fourn===fourn.raisonSociale||(d.fid&&d.fid===fourn.id));
    const banks=fourn.comptesBank?.length?fourn.comptesBank:
      [{banque:fourn.banque,domiciliation:fourn.domiciliation,codeBanque:fourn.codeBanque,
        codeGuichet:fourn.codeGuichet,numCompte:fourn.numCompte,cle:fourn.cle,
        swift:fourn.swift,iban:fourn.iban}];
    const[bankTab,setBankTab]=useState(0);

    return(
      <div style={{animation:"fadeIn .2s ease"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <button onClick={()=>setSelFourn(null)} style={{...btn("light",true),padding:"6px 14px",fontSize:12}}>← Retour</button>
          <h2 style={{fontSize:16,fontWeight:700,color:"#212529"}}>{fourn.raisonSociale}</h2>
          <span style={{fontSize:10,padding:"3px 8px",borderRadius:10,background:fourn.actif?SUCL:"#f8f9fc",color:fourn.actif?SUCD:MUT,fontWeight:700}}>{fourn.actif?"Actif":"Inactif"}</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr",gap:16,marginBottom:16}}>
          <div style={{...card(),padding:20,gridColumn:"1/-1"}}>
            <div style={{fontSize:13,fontWeight:700,color:P,marginBottom:14,paddingBottom:8,borderBottom:`1px solid ${BD}`}}>📋 Identification</div>
            <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"repeat(3,1fr)",gap:12}}>
              {[["Raison Sociale",fourn.raisonSociale],["Contact",fourn.nomContact||"—"],["Email",fourn.email||"—"],["Téléphone",fourn.telephone||"—"],["N.I.F.",fourn.nif||"—"],["Statistique",fourn.stat||"—"],["R.C.",fourn.rc||"—"],["N.I.U.",fourn.niu||"—"],["N° BAD",fourn.nBad||"—"],["N° Agrément",fourn.nAgrement||"—"],["Validité Agrément",fourn.dateAgrement||"—"],["Spécialités",fourn.specialites||"—"]].map(([l,v])=>(
                <div key={l} style={{background:"#f8f9fc",borderRadius:RSm,padding:"8px 10px"}}>
                  <div style={{fontSize:10,color:MUT,fontWeight:700,textTransform:"uppercase",marginBottom:2}}>{l}</div>
                  <div style={{fontSize:12,fontWeight:600,color:"#212529"}}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{...card(),padding:20}}>
            <div style={{fontSize:13,fontWeight:700,color:P,marginBottom:14,paddingBottom:8,borderBottom:`1px solid ${BD}`}}>📍 Adresse</div>
            <div style={{fontSize:13,color:"#212529",lineHeight:1.8}}>{fourn.adresse1||"—"}{fourn.adresse2?<><br/>{fourn.adresse2}</>:""}<br/>{fourn.ville||""}{fourn.pays?<> — {fourn.pays}</>:""}</div>
          </div>
          <div style={{...card(),padding:20}}>
            <div style={{fontSize:13,fontWeight:700,color:P,marginBottom:14,paddingBottom:8,borderBottom:`1px solid ${BD}`}}>🏦 Coordonnées Bancaires ({banks.length} compte{banks.length>1?"s":""})</div>
            <div style={{display:"flex",gap:0,borderBottom:"1px solid "+BD,marginBottom:12}}>
              {banks.map((b,i)=>(
                <button key={i} onClick={()=>setBankTab(i)}
                  style={{padding:"6px 14px",border:"none",background:"transparent",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:bankTab===i?700:400,color:bankTab===i?P:"#495057",borderBottom:`2px solid ${bankTab===i?P:"transparent"}`,transition:"all .15s"}}>
                  🏦 {b.banque||`Compte ${i+1}`}
                </button>
              ))}
            </div>
            {banks[bankTab]&&(
              <div style={{fontSize:12,lineHeight:2,color:"#212529"}}>
                <div><b>Banque :</b> {banks[bankTab].banque||"—"}</div>
                <div><b>Domiciliation :</b> {banks[bankTab].domiciliation||"—"}</div>
                <div><b>Code Banque/Guichet :</b> {banks[bankTab].codeBanque||"—"} / {banks[bankTab].codeGuichet||"—"}</div>
                <div><b>N° Compte :</b> {banks[bankTab].numCompte||"—"} — Clé {banks[bankTab].cle||"—"}</div>
                <div><b>SWIFT :</b> {banks[bankTab].swift||"—"}</div>
                <div style={{fontWeight:700,color:P}}><b>IBAN :</b> {banks[bankTab].iban||"—"}</div>
              </div>
            )}
          </div>
        </div>
        <div style={{...card(),padding:20}}>
          <div style={{fontSize:13,fontWeight:700,color:P,marginBottom:14,paddingBottom:8,borderBottom:`1px solid ${BD}`}}>📄 Documents soumis ({fDocs.length})</div>
          {fDocs.length===0?<div style={{color:MUT,fontSize:13,textAlign:"center",padding:"16px 0"}}>Aucun document soumis</div>:(
            <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}><table style={{width:"100%",minWidth:600,borderCollapse:"collapse"}}>
              <thead><tr>{["Référence","Type","Montant","Statut","Date"].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
              <tbody>{fDocs.map(d=>(
                <tr key={d.id} style={{borderBottom:`1px solid ${BD}`}}>
                  <td style={{...TD,fontWeight:700,color:P,fontSize:12}}>{d.id}</td>
                  <td style={{...TD,fontSize:12}}>{d.type}</td>
                  <td style={{...TD,fontSize:12,fontWeight:600}}>{fmtN(d.mtR||d.mt)}</td>
                  <td style={{...TD,fontSize:11}}><span style={{padding:"2px 8px",borderRadius:10,background:"#eef1f8",color:P}}>{d.st}</span></td>
                  <td style={{...TD,fontSize:12,color:MUT}}>{d.date}</td>
                </tr>
              ))}</tbody>
            </table></div>
          )}
        </div>
      </div>
    );
  }

  return(
    <div style={{animation:"fadeIn .2s ease"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:10}}>
        <div>
          <h2 style={{fontSize:17,fontWeight:700,color:"#212529",marginBottom:2}}>Gestion des Fournisseurs</h2>
          <p style={{fontSize:12,color:MUT}}>{fournComptes.length} fournisseur(s) enregistré(s)</p>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <input ref={fileRef} type="file" accept=".csv" style={{display:"none"}} onChange={doImport}/>
          <button onClick={()=>fileRef.current?.click()}
            style={{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:7,border:"1px solid #b3d4f5",background:"#eff6ff",color:"#1d4ed8",cursor:"pointer",fontSize:12.5,fontWeight:600,fontFamily:"inherit"}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Importer CSV
          </button>
          <button onClick={doExport}
            style={{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:7,border:"1px solid #bbf7d0",background:"#f0fdf4",color:"#15803d",cursor:"pointer",fontSize:12.5,fontWeight:600,fontFamily:"inherit"}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Exporter CSV
          </button>
          <button onClick={openNew} style={btn("primary",true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nouveau fournisseur
          </button>
        </div>
      </div>

      <div style={{...card(),marginBottom:16,padding:"10px 16px"}}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Rechercher par raison sociale, email, NIF…" style={{...inp(),fontSize:13,maxWidth:400}}/>
      </div>

      <div style={{...card()}}>
        <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}><table style={{width:"100%",minWidth:600,borderCollapse:"collapse"}}>
          <thead>
            <tr>{["Fournisseur","Email","NIF","Spécialités","Comptes","Docs","Statut",""].map(h=><th key={h} style={TH}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map(f=>{
              const nbDocs=docs.filter(d=>d.fourn===f.raisonSociale).length;
              const nbBanks=(f.comptesBank?.length)||(f.banque?1:0)||0;
              return(
                <tr key={f.id} style={{borderBottom:`1px solid ${BD}`,cursor:"pointer",transition:"background .12s"}}
                  onMouseEnter={e=>e.currentTarget.style.background="#f8f9fc"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={TD} onClick={()=>setSelFourn(f)}>
                    <div style={{fontWeight:700,fontSize:13,color:"#212529"}}>{f.raisonSociale}</div>
                    <div style={{fontSize:11,color:MUT}}>{f.ville}</div>
                  </td>
                  <td style={{...TD,fontSize:12,color:MUT}}>{f.email||"—"}</td>
                  <td style={{...TD,fontSize:12,fontFamily:"monospace"}}>{f.nif||"—"}</td>
                  <td style={{...TD,fontSize:11,color:"#495057"}}>{f.specialites||"—"}</td>
                  <td style={{...TD,textAlign:"center"}}>
                    {nbBanks>0?<span style={{fontSize:11,fontWeight:700,color:P,background:"#eef1f8",padding:"2px 8px",borderRadius:10}}>🏦 {nbBanks}</span>:<span style={{color:MUT,fontSize:11}}>—</span>}
                  </td>
                  <td style={{...TD,textAlign:"center"}}>
                    <span style={{fontWeight:700,color:P,fontSize:14}}>{nbDocs}</span>
                  </td>
                  <td style={TD}>
                    <span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:10,background:f.actif?SUCL:"#f8f9fc",color:f.actif?SUCD:MUT}}>{f.actif?"Actif":"Inactif"}</span>
                  </td>
                  <td style={{...TD,textAlign:"right"}}>
                    <div style={{display:"flex",gap:6,justifyContent:"flex-end"}}>
                      <button onClick={e=>{e.stopPropagation();setSelFourn(f);}} style={{...btn("light",true),fontSize:11,padding:"4px 10px"}}>Détail</button>
                      <button onClick={e=>{e.stopPropagation();openEdit(f);}} style={{...btn("light",true),fontSize:11,padding:"4px 10px"}}>✏️</button>
                      <button onClick={e=>{e.stopPropagation();del(f.id);}} style={{...btn("light",true),fontSize:11,padding:"4px 10px",color:"#dc3545"}}
                        onMouseEnter={e=>{e.currentTarget.style.background="#fff5f5";}}
                        onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}>🗑</button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length===0&&<tr><td colSpan={8} style={{...TD,textAlign:"center",color:MUT,padding:32}}>Aucun fournisseur trouvé</td></tr>}
          </tbody>
        </table></div>
      </div>

      {/* Modal édition */}
      {modal==="edit"&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:5000,padding:20}}>
          <div style={{background:WH,borderRadius:12,width:"100%",maxWidth:780,maxHeight:"92vh",overflowY:"auto",padding:28,boxShadow:"0 20px 60px rgba(0,0,0,.25)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <h3 style={{fontSize:15,fontWeight:700,color:"#212529"}}>{edit.id?"Modifier le fournisseur":"Nouveau fournisseur"}</h3>
              <button onClick={()=>setModal(null)} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:MUT}}>×</button>
            </div>

            <Sec title="Saisie">
              <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr",gap:12}}>
                <F label="Raison Sociale / Nom *"><input value={edit.raisonSociale||""} onChange={e=>up("raisonSociale",e.target.value)} style={inp({fontSize:13})}/></F>
                <F label="Nom du contact"><input value={edit.nomContact||""} onChange={e=>up("nomContact",e.target.value)} style={inp({fontSize:13})}/></F>
                <F label="Actif"><label style={{display:"flex",gap:8,alignItems:"center",marginTop:6}}><input type="checkbox" checked={!!edit.actif} onChange={e=>up("actif",e.target.checked)}/><span style={{fontSize:13}}>Fournisseur actif</span></label></F>
              </div>
            </Sec>

            <Sec title="Adresse">
              <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr",gap:12}}>
                <F label="1ère ligne d'adresse" span={2}><input value={edit.adresse1||""} onChange={e=>up("adresse1",e.target.value)} style={inp({fontSize:13})}/></F>
                <F label="2ème ligne"><input value={edit.adresse2||""} onChange={e=>up("adresse2",e.target.value)} style={inp({fontSize:13})}/></F>
                <F label="Ville"><input value={edit.ville||""} onChange={e=>up("ville",e.target.value)} style={inp({fontSize:13})}/></F>
                <F label="Pays"><select value={edit.pays||"Madagascar"} onChange={e=>up("pays",e.target.value)} style={inp({fontSize:13,padding:"0 10px"})}>{PAYS_LIST.map(p=><option key={p}>{p}</option>)}</select></F>
                <F label="Téléphone"><input value={edit.telephone||""} onChange={e=>up("telephone",e.target.value)} style={inp({fontSize:13})}/></F>
                <F label="Email"><input type="email" value={edit.email||""} onChange={e=>up("email",e.target.value)} style={inp({fontSize:13})}/></F>
              </div>
            </Sec>

            <Sec title="Identification fiscale & autres">
              <div style={{display:"grid",gridTemplateColumns:typeof window!=="undefined"&&window.innerWidth<=768?"1fr":"1fr 1fr",gap:12}}>
                <F label="N.I.F."><input value={edit.nif||""} onChange={e=>up("nif",e.target.value)} style={inp({fontSize:13})}/></F>
                <F label="N° Statistique"><input value={edit.stat||""} onChange={e=>up("stat",e.target.value)} style={inp({fontSize:13})}/></F>
                <F label="R.C."><input value={edit.rc||""} onChange={e=>up("rc",e.target.value)} style={inp({fontSize:13})}/></F>
                <F label="N.I.U."><input value={edit.niu||""} onChange={e=>up("niu",e.target.value)} style={inp({fontSize:13})}/></F>
                <F label="N° BAD"><input value={edit.nBad||""} onChange={e=>up("nBad",e.target.value)} style={inp({fontSize:13})}/></F>
                <F label="N° Agrément"><input value={edit.nAgrement||""} onChange={e=>up("nAgrement",e.target.value)} style={inp({fontSize:13})}/></F>
                <F label="Validité agrément"><input type="date" value={edit.dateAgrement||""} onChange={e=>up("dateAgrement",e.target.value)} style={inp({fontSize:13})}/></F>
                <F label="Spécialités"><select value={edit.specialites||""} onChange={e=>up("specialites",e.target.value)} style={inp({fontSize:13,padding:"0 10px"})}><option value="">—</option>{SPECIALITES.map(s=><option key={s}>{s}</option>)}</select></F>
              </div>
            </Sec>

            <Sec title={`Coordonnées Bancaires (${(edit.comptesBank||[BLANK_RIB()]).length} compte${(edit.comptesBank||[]).length>1?"s":""})`}>
              <BankTabs comptes={edit.comptesBank||[BLANK_RIB()]} onChange={v=>up("comptesBank",v)}/>
            </Sec>

            <Sec title="Échéances">
              <div style={{display:"flex",alignItems:"center",gap:10,fontSize:13,color:"#212529"}}>
                <span>Échéance de paiement</span>
                <input type="number" value={edit.echeance||30} onChange={e=>up("echeance",parseInt(e.target.value)||0)} style={{...inp({fontSize:13}),width:70}} min={0}/>
                <span>jours le</span>
                <input type="number" value={edit.jourEcheance||1} onChange={e=>up("jourEcheance",parseInt(e.target.value)||1)} style={{...inp({fontSize:13}),width:60}} min={1} max={31}/>
                <span style={{color:MUT,fontSize:12}}>(ex : 30 jours sur le 1)</span>
              </div>
            </Sec>

            <div style={{display:"flex",gap:10,marginTop:24,justifyContent:"flex-end"}}>
              <button onClick={()=>setModal(null)} style={btn("light",true)}>Annuler</button>
              <button onClick={save} style={btn("primary",true)}>{edit.id?"💾 Enregistrer":"➕ Créer"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Sec({title,children}){return(<div style={{marginBottom:20}}><div style={{fontSize:13,fontWeight:700,color:P,marginBottom:12,paddingBottom:8,borderBottom:`1px solid ${BD}`}}>{title}</div>{children}</div>);}
function F({label,children,span}){return(<div style={span?{gridColumn:"1/-1"}:{}}><label style={{fontSize:11,color:MUT,fontWeight:600,display:"block",marginBottom:3}}>{label}</label>{children}</div>);}
function FL({children}){return<label style={{fontSize:11,color:MUT,fontWeight:600,display:"block",marginBottom:3}}>{children}</label>;}