"use client";
import{useState,useRef,useCallback}from"react";
import{IC}from"../ui/Icons";
import{btn,inp,P,WH,BD,MUT,SUC,SUCL,WRN,WRNL,DNG,DNGL,RSm,RLg,TR}from"../../lib/theme";

/* ══════════════════════════════════════════════════════════
   OCR RÉEL — Tesseract.js (gratuit, open-source)
   + PDF.js pour extraction texte natif
   Chargés depuis CDN, zéro installation, zéro API key
══════════════════════════════════════════════════════════ */

/* ── Charger un script CDN (une seule fois) ── */
function loadScript(src){
  return new Promise((res,rej)=>{
    if(document.querySelector(`script[src="${src}"]`)){res();return;}
    const s=document.createElement("script");
    s.src=src;s.onload=res;s.onerror=rej;
    document.head.appendChild(s);
  });
}

/* ── Extraire le texte brut d'un PDF natif via PDF.js ── */
async function extractTextFromPDF(file){
  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js");
  const pdfjsLib=window.pdfjsLib;
  pdfjsLib.GlobalWorkerOptions.workerSrc=
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  const ab=await file.arrayBuffer();
  const pdf=await pdfjsLib.getDocument({data:ab}).promise;
  let text="";
  for(let i=1;i<=Math.min(pdf.numPages,5);i++){
    const pg=await pdf.getPage(i);
    const tc=await pg.getTextContent();
    text+=tc.items.map(x=>x.str).join(" ")+"\n";
  }
  return text.trim();
}

/* ── Rendre la 1ère page PDF en canvas → image pour Tesseract ── */
async function pdfToCanvas(file){
  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js");
  const pdfjsLib=window.pdfjsLib;
  pdfjsLib.GlobalWorkerOptions.workerSrc=
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  const ab=await file.arrayBuffer();
  const pdf=await pdfjsLib.getDocument({data:ab}).promise;
  const pg=await pdf.getPage(1);
  const vp=pg.getViewport({scale:2.5});
  const cv=document.createElement("canvas");
  cv.width=vp.width;cv.height=vp.height;
  await pg.render({canvasContext:cv.getContext("2d"),viewport:vp}).promise;
  return cv;
}

/* ── OCR image avec Tesseract.js ── */
async function tesseractOCR(source, onProgress){
  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/5.0.4/tesseract.min.js");
  const worker=await Tesseract.createWorker(["fra","eng"],1,{
    logger: m=>{
      if(m.status==="recognizing text"&&onProgress)
        onProgress(Math.round(m.progress*100));
    }
  });
  const{data:{text}}=await worker.recognize(source);
  await worker.terminate();
  return text;
}

/* ══════════════════════════════════════════════════════════
   PARSEUR INTELLIGENT — extrait les champs d'une facture
   à partir du texte brut OCR ou PDF
══════════════════════════════════════════════════════════ */
function parseInvoiceText(raw){
  const t=raw.replace(/\r\n/g,"\n");
  const lines=t.split("\n").map(l=>l.trim()).filter(Boolean);
  const norm=t.toLowerCase();

  /* ── Helpers ── */
  const find=(patterns)=>{
    for(const pat of patterns){
      const m=t.match(pat);
      if(m&&m[1])return m[1].trim();
    }
    return "";
  };
  const findNum=(patterns)=>{
    for(const pat of patterns){
      const m=t.match(pat);
      if(m&&m[1]){
        const n=m[1].replace(/[\s.,]/g,"").replace(/[^0-9]/g,"");
        if(n.length>2)return n;
      }
    }
    return "";
  };

  /* ── N° Facture ── */
  const numero=find([
    /(?:facture|invoice|fact\.?|n°|no\.?)\s*[:#]?\s*([A-Z0-9][A-Z0-9\/\-\.]{2,20})/i,
    /([A-Z]{2,5}[-\/]\d{4}[-\/]\d{2,6})/,
    /([A-Z]{2,5}\d{4,10})/,
    /(?:réf|ref|référence)[.:\s]*([A-Z0-9\-\/]{4,20})/i,
  ]);

  /* ── Date ── */
  const date_doc=find([
    /(?:date|le)\s*[:\s]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
    /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4})/,
    /(\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})/,
  ]).replace(/(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})/,"$3/$2/$1"); // normalise YYYY→DD/MM/YYYY

  /* ── Émetteur — premier bloc de texte en haut ── */
  const emetteur=(()=>{
    // Cherche SARL, SA, EURL, SAS, ou lignes d'en-tête
    const co=find([
      /^(.{3,50}(?:SARL|S\.A\.R\.L|SAS|S\.A\.S|EURL|SA|LLC|Ltd|Inc|Cie)\.?)/im,
      /(?:émetteur|fournisseur|vendeur|de\s*:|from\s*:)\s*(.{3,60})/i,
      /^([A-ZÀÂÄÉÈÊËÏÎÔÙÛÜ][A-Za-zÀ-ÿ\s&,.']{3,50})$/m,
    ]);
    if(co)return co;
    // Fallback: première ligne non-vide non-numérique
    return lines.find(l=>l.length>3&&l.length<60&&!/^\d/.test(l)&&!/facture|invoice|n°|ref/i.test(l))||"";
  })();

  /* ── NIF (Madagascar: 7 chiffres ou format XXX XXX XXX) ── */
  const nif=find([
    /nif\s*[:#]?\s*([\d\s]{7,15})/i,
    /num[eé]ro\s+(?:fiscal|contribuable|identification)\s*[:#]?\s*([\d\s]{7,15})/i,
    /identifiant\s+fiscal\s*[:#]?\s*([\d\s]{7,15})/i,
  ]).replace(/\s/g,"");

  /* ── IBAN / RIB ── */
  const iban=find([
    /iban\s*[:#]?\s*([A-Z]{2}\s*\d{2}[\s\d]{10,32})/i,
    /rib\s*[:#]?\s*([\d\s]{15,30})/i,
    /compte\s*[:#]?\s*([A-Z0-9\s]{10,34})/i,
    /([A-Z]{2}\d{2}[A-Z0-9]{4,}\d{7,}[A-Z0-9]{0,10})/,
  ]).replace(/\s/g,"");

  /* ── Montants ── */
  // On cherche HT, TVA, TTC dans cet ordre
  const htRaw=findNum([
    /(?:montant\s*)?(?:hors[\s-]*taxe[s]?|h\.t\.?)\s*[:\s]*([0-9][0-9\s.,]{2,18})/i,
    /(?:base\s*(?:ht|tva)|sous[\s-]*total)\s*[:\s]*([0-9][0-9\s.,]{2,18})/i,
    /ht\s*[:\s]*([0-9][0-9\s.,]{2,18})/i,
  ]);
  const tvaRaw=findNum([
    /(?:tva|t\.v\.a\.)\s*(?:\d{1,2}\s*%\s*)?[:\s]*([0-9][0-9\s.,]{2,18})/i,
    /(?:taxe[s]?|vat)\s*[:\s]*([0-9][0-9\s.,]{2,18})/i,
  ]);
  const totalRaw=findNum([
    /(?:total\s*)?(?:ttc|toutes\s*taxes\s*comprises|t\.t\.c\.)\s*[:\s]*([0-9][0-9\s.,]{2,18})/i,
    /(?:montant\s*)?total\s*[:\s]*([0-9][0-9\s.,]{2,18})/i,
    /(?:net\s*à\s*payer|à\s*payer)\s*[:\s]*([0-9][0-9\s.,]{2,18})/i,
    /(?:total\s*general|grand\s*total)\s*[:\s]*([0-9][0-9\s.,]{2,18})/i,
  ]);

  /* Si on a TTC mais pas HT, essayer de retrouver */
  let ht=htRaw,tva=tvaRaw,total=totalRaw;
  if(total&&!ht&&!tva){
    // total probablement TTC, essayer ratio 20%
    const ttcN=parseInt(total);
    if(ttcN>0){
      ht=String(Math.round(ttcN/1.2));
      tva=String(ttcN-parseInt(ht));
    }
  }
  if(ht&&tva&&!total)total=String(parseInt(ht)+parseInt(tva));
  if(ht&&total&&!tva)tva=String(parseInt(total)-parseInt(ht));

  /* ── Score de confiance ── */
  const fields={numero,date_doc,emetteur,nif,ht,tva,total,iban};
  const weights={numero:15,date_doc:15,emetteur:10,nif:10,ht:15,tva:10,total:20,iban:5};
  let score=0;
  for(const[k,v]of Object.entries(fields)){
    if(v&&v.length>1)score+=weights[k]||5;
  }

  return{...fields, score, rawText:raw};
}

/* ══════════════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
══════════════════════════════════════════════════════════ */
export function OCRScanner({fid,onDone,onSkip}){
  const[phase,setPhase]=useState("upload"); // upload | loading | scanning | done | error
  const[prog,setProg]=useState(0);
  const[status,setStatus]=useState("");
  const[data,setData]=useState(null);
  const[edited,setEdited]=useState({});
  const[fname,setFname]=useState("");
  const[rawText,setRawText]=useState("");
  const[showRaw,setShowRaw]=useState(false);
  const[errMsg,setErrMsg]=useState("");
  const fileRef=useRef();

  const qc=s=>s>=80?SUC:s>=55?WRN:DNG;
  const qcBg=s=>s>=80?SUCL:s>=55?WRNL:DNGL;

  const processFile=useCallback(async(file)=>{
    setFname(file.name);
    setPhase("loading");
    setProg(5);
    setStatus("Chargement des moteurs OCR…");

    try{
      let text="";
      const isPDF=file.type==="application/pdf"||file.name.toLowerCase().endsWith(".pdf");
      const isImage=/image\//i.test(file.type)||/\.(png|jpg|jpeg|tiff|tif|bmp|webp)$/i.test(file.name);

      if(isPDF){
        /* Étape 1 : tenter extraction texte natif */
        setStatus("Extraction du texte PDF natif…");
        setProg(15);
        try{
          text=await extractTextFromPDF(file);
        }catch(e){
          text="";
        }

        /* Si texte insuffisant → rendre en image et OCR */
        if(!text||text.replace(/\s/g,"").length<50){
          setStatus("PDF scanné détecté — conversion en image…");
          setProg(25);
          const canvas=await pdfToCanvas(file);
          setStatus("Analyse OCR (Tesseract.js)…");
          setProg(30);
          text=await tesseractOCR(canvas,(p)=>{
            setProg(30+Math.round(p*0.6));
            setStatus(`Reconnaissance caractères… ${30+Math.round(p*0.6)}%`);
          });
        }else{
          setProg(70);
          setStatus("Texte PDF extrait avec succès ✓");
        }
      }else if(isImage){
        setStatus("Chargement Tesseract.js (français + anglais)…");
        setProg(10);
        text=await tesseractOCR(file,(p)=>{
          setProg(10+Math.round(p*0.75));
          setStatus(`Reconnaissance caractères… ${10+Math.round(p*0.75)}%`);
        });
      }else{
        throw new Error("Format non supporté. Utilisez PDF, PNG, JPG, TIFF.");
      }

      if(!text||text.replace(/\s/g,"").length<10){
        throw new Error("Aucun texte détecté. Vérifiez que le document est lisible.");
      }

      setStatus("Analyse intelligente des champs…");
      setProg(90);
      setRawText(text);

      const parsed=parseInvoiceText(text);
      setData(parsed);
      setEdited(parsed);
      setProg(100);
      setPhase("done");

    }catch(e){
      setErrMsg(e.message||"Erreur OCR inattendue.");
      setPhase("error");
    }
  },[]);

  const onFile=e=>{const f=e.target.files[0];if(f)processFile(f);};
  const onDrop=e=>{
    e.preventDefault();
    const f=e.dataTransfer.files[0];
    if(f)processFile(f);
  };

  /* ─── PHASE UPLOAD ─── */
  if(phase==="upload")return(
    <div>
      <div
        onDrop={onDrop} onDragOver={e=>e.preventDefault()}
        onClick={()=>fileRef.current?.click()}
        style={{border:`2px dashed ${P}55`,borderRadius:RLg,padding:"36px 24px",textAlign:"center",background:"#f8f9fb",cursor:"pointer",transition:TR}}
        onMouseEnter={e=>{e.currentTarget.style.borderColor=P;e.currentTarget.style.background="#f0f4ff";}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor=`${P}55`;e.currentTarget.style.background="#f8f9fb";}}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:14,color:P,opacity:.65}}>
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="12" y1="12" x2="12" y2="18"/>
            <polyline points="9 15 12 18 15 15"/>
          </svg>
        </div>
        <div style={{fontWeight:700,fontSize:15,color:P,marginBottom:6}}>Glissez-déposez votre document</div>
        <div style={{fontSize:12.5,color:MUT,marginBottom:18}}>
          PDF natif ou scanné · JPEG · PNG · TIFF<br/>
          <span style={{color:"#28a745",fontWeight:600}}>✓ OCR réel — Tesseract.js + PDF.js — 100% gratuit</span>
        </div>
        <button style={btn("primary")} onClick={e=>{e.stopPropagation();fileRef.current?.click();}}>
          <span style={{display:"flex"}}>{IC.upload}</span> Parcourir les fichiers
        </button>
        <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.tiff,.tif,.bmp,.webp" style={{display:"none"}} onChange={onFile}/>
      </div>
      <div style={{marginTop:12,padding:"10px 14px",background:"#f8f9fc",borderRadius:6,border:`1px solid ${BD}`}}>
        <div style={{fontSize:11.5,fontWeight:700,color:MUT,marginBottom:4}}>MOTEURS OCR UTILISÉS</div>
        <div style={{fontSize:12,color:"#495057",lineHeight:1.7}}>
          📄 <b>PDF.js</b> — extraction texte natif sur PDF générés informatiquement<br/>
          🔍 <b>Tesseract.js v5</b> — reconnaissance optique pour images et PDFs scannés (FR + EN)<br/>
          🧠 <b>Parseur regex</b> — extraction intelligente : N° facture, date, HT/TVA/TTC, NIF, IBAN
        </div>
      </div>
      <div style={{textAlign:"right",marginTop:10}}>
        <button style={btn("light",true)} onClick={onSkip}>Saisie manuelle sans OCR →</button>
      </div>
    </div>
  );

  /* ─── PHASE LOADING / SCANNING ─── */
  if(phase==="loading"||phase==="scanning")return(
    <div style={{textAlign:"center",padding:"28px 0"}}>
      <div style={{position:"relative",width:100,height:130,margin:"0 auto 20px",borderRadius:8,background:"#1e293b",overflow:"hidden",border:`2px solid ${P}44`}}>
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(255,255,255,.25)"}}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
        </div>
        <div style={{position:"absolute",left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${P},${P}cc,transparent)`,animation:"scan 1.6s ease-in-out infinite",boxShadow:`0 0 10px ${P},0 0 20px ${P}66`}}/>
        {/* grid lines */}
        {[30,60,90].map(y=>(
          <div key={y} style={{position:"absolute",top:`${y}%`,left:8,right:8,height:"1px",background:"rgba(255,255,255,.06)"}}/>
        ))}
      </div>
      <div style={{fontWeight:700,fontSize:15,color:P,marginBottom:8}}>Analyse OCR en cours…</div>
      <div style={{fontSize:12.5,color:MUT,marginBottom:20,minHeight:18}}>{status}</div>
      <div style={{maxWidth:340,margin:"0 auto"}}>
        <div style={{background:"#e9ecef",borderRadius:4,height:8,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${prog}%`,background:`linear-gradient(90deg,${P},#1ecad3)`,transition:"width .3s",borderRadius:4}}/>
        </div>
        <div style={{fontSize:11,color:MUT,marginTop:6}}>{prog}%</div>
      </div>
      <div style={{marginTop:16,fontSize:11.5,color:MUT}}>
        ⏱ Première utilisation : téléchargement Tesseract (~2 Mo) — attendre quelques secondes
      </div>
      <style>{`
        @keyframes scan{0%{top:0%}100%{top:100%}}
      `}</style>
    </div>
  );

  /* ─── PHASE ERROR ─── */
  if(phase==="error")return(
    <div style={{textAlign:"center",padding:"28px 0"}}>
      <div style={{fontSize:40,marginBottom:12}}>⚠️</div>
      <div style={{fontWeight:700,fontSize:15,color:DNG,marginBottom:8}}>Erreur d'analyse OCR</div>
      <div style={{fontSize:13,color:MUT,marginBottom:20}}>{errMsg}</div>
      <div style={{display:"flex",gap:8,justifyContent:"center"}}>
        <button style={btn("primary")} onClick={()=>{setPhase("upload");setErrMsg("");}}>
          Réessayer avec un autre fichier
        </button>
        <button style={btn("light",true)} onClick={onSkip}>Saisie manuelle</button>
      </div>
    </div>
  );

  /* ─── PHASE DONE ─── */
  if(phase==="done"&&data){
    const sc=data.score;
    const FIELDS=[
      {k:"numero",     l:"N° Facture / Document", full:true},
      {k:"date_doc",   l:"Date du document"},
      {k:"emetteur",   l:"Émetteur",              full:true},
      {k:"nif",        l:"NIF"},
      {k:"iban",       l:"IBAN / RIB",             full:true},
      {k:"ht",         l:"Montant HT (Ar)"},
      {k:"tva",        l:"TVA"},
      {k:"total",      l:"Total TTC (Ar)"},
    ];

    return(
      <div>
        {/* Score header */}
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16,padding:"12px 16px",background:qcBg(sc),borderRadius:8,border:`1px solid ${qc(sc)}33`}}>
          <div style={{width:52,height:52,borderRadius:"50%",background:qc(sc)+"22",border:`2px solid ${qc(sc)}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <span style={{fontSize:16,fontWeight:800,color:qc(sc),lineHeight:1}}>{sc}%</span>
            <span style={{fontSize:8,color:qc(sc),letterSpacing:".05em"}}>SCORE</span>
          </div>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:13.5,color:"#212529"}}>
              {sc>=80?"✅ Extraction réussie":sc>=55?"⚠️ Extraction partielle":"❌ Résultats faibles — vérifiez"}
            </div>
            <div style={{fontSize:12,color:MUT,marginTop:2}}>{fname}</div>
            <div style={{fontSize:11.5,color:MUT}}>
              {sc>=80?"Tous les champs principaux ont été détectés.":
               sc>=55?"Certains champs n'ont pas pu être extraits — vérifiez et corrigez.":
               "Le document est peut-être de mauvaise qualité ou dans un format inhabituel."}
            </div>
          </div>
          <button onClick={()=>setShowRaw(p=>!p)}
            style={{padding:"5px 10px",borderRadius:6,border:`1px solid ${BD}`,background:"#fff",fontSize:11,cursor:"pointer",color:MUT,fontFamily:"inherit",flexShrink:0}}>
            {showRaw?"Cacher":"Voir texte brut"}
          </button>
        </div>

        {/* Raw text */}
        {showRaw&&(
          <div style={{marginBottom:14,padding:"10px 12px",background:"#1e293b",borderRadius:6,maxHeight:180,overflowY:"auto"}}>
            <div style={{fontSize:10,fontWeight:700,color:"#64748b",marginBottom:6,textTransform:"uppercase",letterSpacing:".08em"}}>Texte brut extrait par OCR</div>
            <pre style={{fontSize:10.5,color:"#94a3b8",whiteSpace:"pre-wrap",margin:0,lineHeight:1.6}}>{rawText}</pre>
          </div>
        )}

        {/* Fields grid */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
          {FIELDS.map(({k,l,full})=>{
            const val=edited[k]||"";
            const detected=data[k]&&data[k].length>1;
            return(
              <div key={k} style={{gridColumn:full?"1/-1":"auto",background:detected?"#f0fff4":"#fff8f8",borderRadius:6,padding:"9px 12px",border:`1px solid ${detected?"#b8dfc9":"#f5c6c6"}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                  <span style={{fontSize:10,fontWeight:700,color:"#6c757d",textTransform:"uppercase",letterSpacing:".05em"}}>{l}</span>
                  <span style={{fontSize:9.5,fontWeight:700,color:detected?"#28a745":"#dc3545"}}>
                    {detected?"✓ détecté":"— non trouvé"}
                  </span>
                </div>
                <input
                  value={val}
                  onChange={e=>setEdited(p=>({...p,[k]:e.target.value}))}
                  placeholder={`Saisir ${l.toLowerCase()}…`}
                  style={{
                    width:"100%",border:`1px solid ${detected?"#ced4da":"#f5c6c6"}`,borderRadius:4,
                    padding:"5px 8px",fontSize:12.5,fontWeight:detected?600:400,
                    background:"transparent",fontFamily:"inherit",boxSizing:"border-box",outline:"none",
                    color:detected?"#212529":"#6c757d"
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Info */}
        <div style={{fontSize:11.5,color:MUT,marginBottom:12,padding:"8px 12px",background:"#f8f9fc",borderRadius:6,border:`1px solid ${BD}`}}>
          💡 Tous les champs sont modifiables. Corrigez les erreurs avant de valider.
        </div>

        {/* Actions */}
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <button onClick={()=>{setPhase("upload");setData(null);setEdited({});}} style={btn("light",true)}>
            ↩ Nouveau fichier
          </button>
          <button onClick={()=>onSkip()} style={btn("light",true)}>
            Saisie manuelle
          </button>
          <button onClick={()=>onDone({...edited,score:sc})} style={btn("primary")}>
            <span style={{display:"flex"}}>{IC.chk}</span> Utiliser ces données →
          </button>
        </div>
      </div>
    );
  }

  return null;
}
