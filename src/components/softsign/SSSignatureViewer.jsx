"use client";
import { useState, useRef, useEffect, useCallback } from "react";

const lsGet = (k) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

const P   = "#4c1d95";
const P2  = "#7c3aed";
const WH  = "#fff";
const BD  = "#e3e6ea";
const BG  = "#f5f3ff";

const PDFJS_CDN    = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
const PDFJS_WORKER = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
const _sc = {};
function ssLoadScript(src) {
  if (!_sc[src]) {
    _sc[src] = new Promise((ok, fail) => {
      if (typeof window === "undefined") return fail();
      if (document.querySelector(`script[src="${src}"]`)) return ok();
      const s = document.createElement("script");
      s.src = src; s.onload = ok; s.onerror = fail;
      document.head.appendChild(s);
    });
  }
  return _sc[src];
}

function normalizeRect(a, b) {
  return { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), w: Math.abs(b.x - a.x), h: Math.abs(b.y - a.y) };
}

/* ── Password Gate ── */
function PasswordGate({ doc, onUnlock }) {
  const [input, setInput] = useState("");
  const [err, setErr]     = useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (input === doc.password) { onUnlock(); }
    else { setErr(true); setTimeout(() => setErr(false), 1800); }
  };
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(76,29,149,.96)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:99999, fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif" }}>
      <div style={{ background:WH, borderRadius:20, padding:"44px 40px", maxWidth:400, width:"90%", boxShadow:"0 32px 80px rgba(0,0,0,.35)" }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:44, marginBottom:12 }}>🔐</div>
          <div style={{ fontSize:19, fontWeight:800, color:"#0f172a" }}>Document protégé</div>
          <div style={{ fontSize:12.5, color:"#64748b", marginTop:6, lineHeight:1.5 }}>
            Saisissez le mot de passe pour accéder à<br/><strong style={{ color:"#1e293b" }}>{doc.name}</strong>
          </div>
        </div>
        <form onSubmit={submit}>
          <input value={input} onChange={e => setInput(e.target.value)} type="password"
            placeholder="Mot de passe" autoFocus
            style={{ width:"100%", padding:"12px 14px", borderRadius:9, border:`1.5px solid ${err?"#dc2626":BD}`, fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit", marginBottom:10, background:err?"#fef2f2":WH }}
            onFocus={e => e.target.style.borderColor=P2} onBlur={e => { if(!err) e.target.style.borderColor=BD; }}/>
          {err && <div style={{ fontSize:12, color:"#dc2626", marginBottom:10, fontWeight:600 }}>❌ Mot de passe incorrect</div>}
          <button type="submit"
            style={{ width:"100%", padding:"12px", borderRadius:9, border:"none", background:`linear-gradient(135deg,${P},${P2})`, color:WH, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
            Déverrouiller →
          </button>
        </form>
      </div>
    </div>
  );
}

/* ── Signature Pad ──
   onUpdate(dataUrl|null) fires on every stroke so the parent can mirror it live into the zone. */
function SignaturePad({ canvasRef, mode, typedName, setTypedName, isEmpty, setIsEmpty, onUpdate }) {
  const drawingRef = useRef(false);
  const lastPt     = useRef({ x: 0, y: 0 });
  const rafRef     = useRef(null);

  const initCanvas = useCallback(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d");
    ctx.fillStyle = WH; ctx.fillRect(0, 0, c.width, c.height);
    ctx.strokeStyle = "#1a1a1a"; ctx.lineWidth = 2.5;
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    onUpdate?.(null);
  }, [canvasRef, onUpdate]);

  useEffect(() => { initCanvas(); }, [initCanvas, mode]);

  const getPos = (e) => {
    const c = canvasRef.current; if (!c) return { x:0, y:0 };
    const rect = c.getBoundingClientRect();
    const sx = c.width / rect.width; const sy = c.height / rect.height;
    const src = e.touches ? e.touches[0] : e;
    return { x: (src.clientX - rect.left) * sx, y: (src.clientY - rect.top) * sy };
  };

  const pushUpdate = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const c = canvasRef.current; if (!c) return;
      onUpdate?.(c.toDataURL("image/png"));
    });
  }, [canvasRef, onUpdate]);

  const onDown = (e) => {
    e.preventDefault(); drawingRef.current = true;
    lastPt.current = getPos(e); setIsEmpty(false);
  };
  const onMove = (e) => {
    e.preventDefault(); if (!drawingRef.current) return;
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d");
    const pos = getPos(e);
    ctx.beginPath(); ctx.moveTo(lastPt.current.x, lastPt.current.y);
    ctx.lineTo(pos.x, pos.y); ctx.stroke();
    lastPt.current = pos;
    pushUpdate();
  };
  const onUp = (e) => {
    e.preventDefault(); drawingRef.current = false;
    pushUpdate();
  };

  if (mode === "type") {
    return (
      <div>
        <input value={typedName} onChange={e => { setTypedName(e.target.value); setIsEmpty(!e.target.value); }}
          placeholder="Tapez votre nom complet"
          style={{ width:"100%", padding:"9px 12px", borderRadius:7, border:`1px solid ${BD}`, fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:"inherit", marginBottom:10 }}
          onFocus={e => e.target.style.borderColor=P2} onBlur={e => e.target.style.borderColor=BD}/>
        <div style={{ height:90, background:"#fafafa", border:`1px solid ${BD}`, borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
          {typedName ? (
            <span style={{ fontFamily:"'Brush Script MT','Segoe Script',cursive", fontSize:"2.4rem", color:"#1a1a1a", padding:"0 12px" }}>{typedName}</span>
          ) : (
            <span style={{ fontSize:12, color:"#94a3b8" }}>Aperçu de la signature</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ position:"relative" }}>
      <canvas ref={canvasRef} width={280} height={120}
        style={{ width:"100%", display:"block", borderRadius:7, border:`1px solid ${BD}`, cursor:"crosshair", background:WH, touchAction:"none" }}
        onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
        onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}/>
      {isEmpty && (
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
          <span style={{ fontSize:12, color:"#94a3b8" }}>✏ Dessinez votre signature</span>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN: SSSignatureViewer
   ══════════════════════════════════════════════════════════ */
export default function SSSignatureViewer({ doc, onBack, currentUser, saveKey = "ss_collab_docs", onSaved }) {
  const [unlocked,  setUnlocked]  = useState(!doc.password);
  const [done,      setDone]      = useState(false);
  const [comment,   setComment]   = useState("");
  const [alreadySigned] = useState(() => {
    if (doc.status === "signe" || doc.status === "valide") return true;
    const all = lsGet(saveKey);
    if (!Array.isArray(all)) return false;
    const stored = all.find(d => d.id === doc.id);
    return stored?.status === "signe" || stored?.status === "valide";
  });
  const [validating,   setValidating]   = useState(false); // false | "rejecting"
  const [rejectReason, setRejectReason] = useState("");

  /* Zone drawing */
  const overlayRef  = useRef();
  const [drawStart, setDrawStart] = useState(null);
  const [drawCur,   setDrawCur]   = useState(null);
  const [zone,      setZone]      = useState(null);

  /* Signature */
  const sigCanvasRef  = useRef();
  const [sigMode,     setSigMode]    = useState("draw");
  const [typedName,   setTypedName]  = useState("");
  const [isEmpty,     setIsEmpty]    = useState(true);
  /* Live mirror of the signature into the zone */
  const [sigPreview,  setSigPreview] = useState(null); // data URL | null

  /* PDF.js canvas rendering */
  const canvasRef   = useRef(null);
  const pdfDocRef   = useRef(null);
  const pdfNatRef   = useRef({ w: 595, h: 842 });
  const renderIdRef = useRef(0);
  const [pageCount,  setPageCount]  = useState(1);
  const [curPage,    setCurPage]    = useState(1);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfLoaded,  setPdfLoaded]  = useState(false);

  useEffect(() => {
    if (!doc.b64) return;
    setPdfLoading(true); setPdfLoaded(false); pdfDocRef.current = null;
    let alive = true;
    (async () => {
      try {
        await ssLoadScript(PDFJS_CDN);
        const lib = window.pdfjsLib;
        lib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
        const raw = doc.b64.includes(",") ? doc.b64.split(",")[1] : doc.b64;
        const bin = atob(raw); const ua = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) ua[i] = bin.charCodeAt(i);
        const pdf = await lib.getDocument({ data: ua }).promise;
        if (!alive) return;
        pdfDocRef.current = pdf; setPageCount(pdf.numPages); setPdfLoaded(true);
      } catch(e) { console.error("PDF load:", e); }
      if (alive) setPdfLoading(false);
    })();
    return () => { alive = false; };
  }, [doc.b64]);

  useEffect(() => {
    if (!pdfLoaded) return;
    const id = ++renderIdRef.current;
    (async () => {
      try {
        const pdf = pdfDocRef.current; if (!pdf) return;
        const page = await pdf.getPage(curPage);
        if (id !== renderIdRef.current) return;
        const vp = page.getViewport({ scale: 1 });
        pdfNatRef.current = { w: vp.width, h: vp.height };
        const scale = 595 / vp.width;
        const scaled = page.getViewport({ scale });
        const cv = canvasRef.current; if (!cv || id !== renderIdRef.current) return;
        cv.width = Math.round(scaled.width); cv.height = Math.round(scaled.height);
        await page.render({ canvasContext: cv.getContext("2d"), viewport: scaled }).promise;
      } catch(e) { console.error("Page render:", e); }
    })();
  }, [pdfLoaded, curPage]);

  /* Zone helpers */
  const getRelPos = useCallback((e) => {
    const el = overlayRef.current; if (!el) return null;
    const rect = el.getBoundingClientRect();
    const src  = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  }, []);

  const onZoneDown = useCallback((e) => {
    e.preventDefault();
    const pos = getRelPos(e); if (!pos) return;
    setDrawStart(pos); setDrawCur(pos); setZone(null);
  }, [getRelPos]);

  const onZoneMove = useCallback((e) => {
    if (!drawStart) return; e.preventDefault();
    setDrawCur(getRelPos(e));
  }, [drawStart, getRelPos]);

  const onZoneUp = useCallback(() => {
    if (!drawStart || !drawCur) return;
    const nz = normalizeRect(drawStart, drawCur);
    if (nz.w > 20 && nz.h > 15) setZone(nz);
    setDrawStart(null); setDrawCur(null);
  }, [drawStart, drawCur]);

  /* Persist status change to localStorage */
  const saveStatus = (status, extra = {}) => {
    const all = lsGet(saveKey) || [];
    lsSet(saveKey, all.map(d => d.id === doc.id ? { ...d, status, ...extra } : d));
    onSaved?.();
  };

  /* Apply */
  const apply = () => {
    let sigB64;
    if (sigMode === "draw") {
      const c = sigCanvasRef.current; if (!c) return;
      sigB64 = c.toDataURL("image/png");
    } else {
      if (!typedName.trim()) return;
      const tc = document.createElement("canvas");
      tc.width = 280; tc.height = 120;
      const ctx = tc.getContext("2d");
      ctx.fillStyle = WH; ctx.fillRect(0, 0, 280, 120);
      ctx.font = "42px 'Brush Script MT','Segoe Script',cursive";
      ctx.fillStyle = "#1a1a1a"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(typedName, 140, 60);
      sigB64 = tc.toDataURL("image/png");
    }
    const allDocs = lsGet(saveKey) || [];
    const updated = allDocs.map(d => d.id === doc.id ? {
      ...d, status:"signe", signatureB64:sigB64,
      signedAt: new Date().toISOString(),
      signedBy: currentUser?.nom || currentUser?.email || "Administrateur",
      signatureZone: zone, signComment: comment,
    } : d);
    lsSet(saveKey, updated);
    onSaved?.();
    setDone(true);
  };

  if (!unlocked) return <PasswordGate doc={doc} onUnlock={() => setUnlocked(true)}/>;

  if (alreadySigned) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", gap:14, fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif", background:"#fafafa" }}>
      <div style={{ fontSize:72 }}>🔒</div>
      <div style={{ fontSize:20, fontWeight:800, color:"#64748b" }}>Document déjà signé</div>
      <div style={{ fontSize:13, color:"#94a3b8", textAlign:"center", maxWidth:340, lineHeight:1.6 }}>
        Ce document a déjà été signé et validé. Il ne peut plus être signé à nouveau.
      </div>
      <button onClick={onBack}
        style={{ padding:"10px 28px", borderRadius:9, border:"none", background:`linear-gradient(135deg,${P},${P2})`, color:WH, fontSize:13.5, fontWeight:700, cursor:"pointer", fontFamily:"inherit", marginTop:8 }}>
        ← Retour
      </button>
    </div>
  );

  if (done) {
    /* ── Rejection sub-screen ── */
    if (validating === "rejecting") return (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", gap:16, fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif", padding:"0 24px" }}>
        <div style={{ fontSize:64 }}>❌</div>
        <div style={{ fontSize:20, fontWeight:800, color:"#dc2626" }}>Refuser le document</div>
        <div style={{ width:"100%", maxWidth:420 }}>
          <label style={{ fontSize:12.5, fontWeight:700, color:"#374151", display:"block", marginBottom:6 }}>Motif du refus *</label>
          <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={4}
            placeholder="Décrivez la raison du refus…"
            style={{ width:"100%", padding:"10px 12px", borderRadius:9, border:"1px solid #fca5a5", fontSize:13, outline:"none", resize:"vertical", boxSizing:"border-box", fontFamily:"inherit" }}/>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={() => setValidating(false)}
            style={{ padding:"10px 24px", borderRadius:9, border:`1px solid ${BD}`, background:WH, color:"#64748b", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
            ← Annuler
          </button>
          <button onClick={() => { saveStatus("refuse", { rejectReason, refusedAt: new Date().toISOString() }); onBack?.(); }}
            disabled={!rejectReason.trim()}
            style={{ padding:"10px 24px", borderRadius:9, border:"none", fontSize:13, fontWeight:700, fontFamily:"inherit", cursor:rejectReason.trim()?"pointer":"not-allowed",
              background: rejectReason.trim() ? "#dc2626" : "#e2e8f0",
              color:       rejectReason.trim() ? WH        : "#94a3b8" }}>
            ❌ Confirmer le refus
          </button>
        </div>
      </div>
    );

    /* ── Done / validate screen ── */
    return (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", gap:14, fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif" }}>
        <div style={{ fontSize:72 }}>✅</div>
        <div style={{ fontSize:22, fontWeight:800, color:"#059669" }}>Signature appliquée !</div>
        <div style={{ fontSize:13.5, color:"#64748b", textAlign:"center", maxWidth:360, lineHeight:1.6 }}>
          Le document <strong>{doc.name}</strong> a été signé avec succès.<br/>
          <span style={{ fontSize:12 }}>Que souhaitez-vous faire ensuite ?</span>
        </div>
        <div style={{ display:"flex", gap:10, marginTop:6, flexWrap:"wrap", justifyContent:"center" }}>
          <button onClick={() => { saveStatus("valide", { validatedAt: new Date().toISOString() }); onBack?.(); }}
            style={{ padding:"11px 24px", borderRadius:9, border:"none", background:"#059669", color:WH, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
            ✅ Valider le document
          </button>
          <button onClick={() => setValidating("rejecting")}
            style={{ padding:"11px 24px", borderRadius:9, border:"1px solid #dc2626", background:"#fef2f2", color:"#dc2626", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
            ❌ Refuser
          </button>
          <button onClick={onBack}
            style={{ padding:"11px 24px", borderRadius:9, border:`1px solid ${BD}`, background:WH, color:"#64748b", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
            Retour au portail
          </button>
        </div>
      </div>
    );
  }

  const liveRect = drawStart && drawCur ? normalizeRect(drawStart, drawCur) : null;
  const canSign  = sigMode === "draw" ? !isEmpty : !!typedName.trim();

  /* What to show inside the zone as live preview */
  const showTypedInZone = sigMode === "type" && !!typedName;
  const showDrawInZone  = sigMode === "draw"  && !!sigPreview && !isEmpty;

  const clearDrawSig = () => {
    const c = sigCanvasRef.current; if (!c) return;
    const ctx = c.getContext("2d");
    ctx.fillStyle = WH; ctx.fillRect(0, 0, c.width, c.height);
    setIsEmpty(true); setSigPreview(null);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif" }}>

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 16px", background:WH, borderBottom:`1px solid ${BD}`, flexShrink:0, flexWrap:"wrap", rowGap:6 }}>
        <button onClick={onBack}
          style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"7px 14px", borderRadius:7, border:`1px solid ${BD}`, background:WH, cursor:"pointer", fontSize:13, fontWeight:600, color:"#475569", fontFamily:"inherit" }}
          onMouseEnter={e => e.currentTarget.style.background=BG} onMouseLeave={e => e.currentTarget.style.background=WH}>
          ← Retour
        </button>
        <div style={{ width:1, height:24, background:BD }}/>
        <div style={{ display:"flex", alignItems:"center", gap:9, minWidth:0 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:`linear-gradient(135deg,${P},${P2})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <img src="/softsign.png" alt="" style={{ height:18, filter:"brightness(10)", objectFit:"contain" }}/>
          </div>
          <div>
            <div style={{ fontSize:13.5, fontWeight:700, color:"#0f172a" }}>Signature électronique</div>
            <div style={{ fontSize:11, color:"#64748b", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:260 }}>{doc.name}</div>
          </div>
        </div>
        <div style={{ marginLeft:"auto", display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ fontSize:11, color:"#64748b" }}>Déposé par <strong>{doc.uploadedByNom || doc.uploadedBy}</strong></span>
          {doc.password && <span style={{ fontSize:10.5, color:"#059669", background:"#ecfdf5", border:"1px solid #bbf7d0", padding:"2px 8px", borderRadius:20, fontWeight:700 }}>🔐 Protégé</span>}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex:1, display:"flex", overflow:"hidden", minHeight:0 }}>

        {/* LEFT — PDF + zone overlay */}
        <div style={{ flex:1, overflow:"auto", background:"#525659", position:"relative" }}>

          {/* Banner */}
          <div style={{ position:"sticky", top:0, left:0, zIndex:30, background:"rgba(74,144,217,.92)", backdropFilter:"blur(4px)", padding:"7px 16px", display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
            <span style={{ fontSize:12, color:WH, fontWeight:600 }}>
              📐 Glissez sur le document pour définir la zone
            </span>
            {pageCount > 1 && (
              <div style={{ display:"flex", gap:3, alignItems:"center", background:"rgba(0,0,0,.28)", borderRadius:20, padding:"2px 10px" }}>
                <button onClick={() => setCurPage(p => Math.max(1, p - 1))} disabled={curPage <= 1}
                  style={{ background:"none", border:"none", color:WH, cursor:curPage<=1?"default":"pointer", fontSize:16, fontWeight:700, opacity:curPage<=1?.4:1, padding:"0 3px", lineHeight:1 }}>‹</button>
                <span style={{ fontSize:11, color:WH, fontWeight:700, whiteSpace:"nowrap" }}>p.{curPage} / {pageCount}</span>
                <button onClick={() => setCurPage(p => Math.min(pageCount, p + 1))} disabled={curPage >= pageCount}
                  style={{ background:"none", border:"none", color:WH, cursor:curPage>=pageCount?"default":"pointer", fontSize:16, fontWeight:700, opacity:curPage>=pageCount?.4:1, padding:"0 3px", lineHeight:1 }}>›</button>
              </div>
            )}
            {zone && (
              <button onClick={() => setZone(null)}
                style={{ marginLeft:"auto", fontSize:11, color:"rgba(255,255,255,.7)", background:"rgba(255,255,255,.15)", border:"none", borderRadius:6, padding:"3px 10px", cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}>
                ↺ Effacer zone
              </button>
            )}
          </div>

          {/* A4 PDF container */}
          <div style={{ position:"relative", width:595, margin:"20px auto", background:WH, boxShadow:"0 4px 20px rgba(0,0,0,.4)", minHeight:120 }}>

            <canvas ref={canvasRef} style={{ display:"block", width:"100%" }}/>
            {(pdfLoading || (!pdfLoaded && doc.b64)) && (
              <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:10, color:"#94a3b8", background:"rgba(255,255,255,.92)", zIndex:5, minHeight:120 }}>
                <div style={{ fontSize:34 }}>📄</div>
                <div style={{ fontSize:13 }}>Chargement du document…</div>
              </div>
            )}
            {!doc.b64 && (
              <div style={{ height:842, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12, color:"#94a3b8" }}>
                <div style={{ fontSize:48 }}>📄</div>
                <div style={{ fontSize:13 }}>Aucun PDF joint</div>
              </div>
            )}

            {/* Zone drawing overlay */}
            <div ref={overlayRef}
              style={{ position:"absolute", inset:0, cursor:"crosshair", zIndex:10, userSelect:"none" }}
              onMouseDown={onZoneDown} onMouseMove={onZoneMove} onMouseUp={onZoneUp} onMouseLeave={onZoneUp}
              onTouchStart={onZoneDown} onTouchMove={onZoneMove} onTouchEnd={onZoneUp}>

              {/* Live drag rect */}
              {liveRect && (
                <div style={{
                  position:"absolute", left:liveRect.x, top:liveRect.y, width:liveRect.w, height:liveRect.h,
                  border:"2px dashed #4a90d9", background:"rgba(74,144,217,.13)", pointerEvents:"none", boxSizing:"border-box",
                }}/>
              )}

              {/* Finalized zone + live signature preview inside */}
              {zone && !liveRect && (
                <div style={{
                  position:"absolute", left:zone.x, top:zone.y, width:zone.w, height:zone.h,
                  border:"2.5px solid #7c3aed", boxSizing:"border-box", pointerEvents:"none", zIndex:11,
                  background: (showTypedInZone || showDrawInZone) ? "rgba(255,255,255,.88)" : "rgba(124,58,237,.07)",
                  overflow:"hidden",
                }}>
                  {/* Label strip — only shown when no signature yet */}
                  {!showTypedInZone && !showDrawInZone && (
                    <div style={{
                      position:"absolute", top:0, left:0, right:0,
                      fontSize:10, fontWeight:700, color:WH,
                      background:"#7c3aed", padding:"2px 6px", textAlign:"center",
                    }}>
                      ✍ Zone de signature
                    </div>
                  )}

                  {/* Typed signature — rendered live with cursive font */}
                  {showTypedInZone && (
                    <div style={{
                      position:"absolute", inset:0,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontFamily:"'Brush Script MT','Segoe Script',cursive",
                      fontSize: Math.min(zone.h * 0.52, 46, zone.w * 0.18),
                      color:"#1a1a1a", padding:6, overflow:"hidden", lineHeight:1,
                    }}>
                      {typedName}
                    </div>
                  )}

                  {/* Drawn signature — rendered as image */}
                  {showDrawInZone && (
                    <img src={sigPreview} alt="signature"
                      style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"contain" }}/>
                  )}

                  {/* Corner handles */}
                  {[{t:0,l:0},{t:0,r:0},{b:0,l:0},{b:0,r:0}].map((pos,i) => (
                    <div key={i} style={{ position:"absolute", width:7, height:7, background:"#7c3aed", borderRadius:2, ...pos }}/>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div style={{ height:20 }}/>
        </div>

        {/* RIGHT — Signature panel */}
        <div style={{ width:300, flexShrink:0, background:WH, borderLeft:`1px solid ${BD}`, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          <div style={{ flex:1, overflowY:"auto", padding:16 }}>

            {/* Step indicator */}
            <div style={{ display:"flex", gap:6, marginBottom:14 }}>
              {[["1","Zone PDF",zone],["2","Signature",canSign]].map(([n,l,ok]) => (
                <div key={n} style={{ flex:1, display:"flex", alignItems:"center", gap:5, padding:"6px 8px", borderRadius:7, background:ok?"#ecfdf5":"#f8fafc", border:`1px solid ${ok?"#bbf7d0":BD}` }}>
                  <div style={{ width:18, height:18, borderRadius:"50%", background:ok?"#059669":"#e2e8f0", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <span style={{ fontSize:9, fontWeight:800, color:ok?WH:"#94a3b8" }}>{ok?"✓":n}</span>
                  </div>
                  <span style={{ fontSize:10.5, fontWeight:700, color:ok?"#059669":"#64748b" }}>{l}</span>
                </div>
              ))}
            </div>

            {/* Instructions */}
            <div style={{ background:"#f8faff", border:"1px solid #dde6f5", borderRadius:8, padding:"10px 12px", marginBottom:14, fontSize:11.5, color:"#334155", lineHeight:1.65 }}>
              <div style={{ fontWeight:700, marginBottom:4, color:"#1e293b" }}>📋 Instructions</div>
              <div>① Glissez sur le PDF pour définir la zone</div>
              <div>② Dessinez ou tapez — visible en direct sur le PDF</div>
              <div>③ Cliquez sur « Signer le document »</div>
            </div>

            {/* Mode tabs */}
            <div style={{ display:"flex", background:"#f1f5f9", borderRadius:8, padding:3, marginBottom:12 }}>
              {[["draw","✏ Dessiner"],["type","⌨ Taper"]].map(([m,l]) => (
                <button key={m} onClick={() => { setSigMode(m); setIsEmpty(true); setSigPreview(null); setTypedName(""); }}
                  style={{ flex:1, padding:"7px", borderRadius:6, border:"none", cursor:"pointer", fontFamily:"inherit", fontSize:12, fontWeight:700, transition:"all .15s",
                    background: sigMode===m ? WH : "transparent", color: sigMode===m ? P : "#64748b",
                    boxShadow: sigMode===m ? "0 1px 4px rgba(0,0,0,.1)" : "none" }}>
                  {l}
                </button>
              ))}
            </div>

            {/* Signature pad */}
            <SignaturePad canvasRef={sigCanvasRef} mode={sigMode}
              typedName={typedName} setTypedName={setTypedName}
              isEmpty={isEmpty} setIsEmpty={setIsEmpty}
              onUpdate={setSigPreview}/>

            {sigMode === "draw" && (
              <button onClick={clearDrawSig}
                style={{ width:"100%", marginTop:7, padding:"7px", borderRadius:7, border:`1px solid ${BD}`, background:"#f8f9fc", color:"#64748b", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
                ↺ Effacer la signature
              </button>
            )}

            {/* Comment */}
            <div style={{ marginTop:14 }}>
              <label style={{ fontSize:11.5, fontWeight:700, color:"#374151", display:"block", marginBottom:5 }}>Commentaire (optionnel)</label>
              <textarea value={comment} onChange={e => setComment(e.target.value)} rows={2} placeholder="Ajoutez un commentaire…"
                style={{ width:"100%", padding:"8px 10px", borderRadius:7, border:`1px solid ${BD}`, fontSize:12, outline:"none", resize:"vertical", boxSizing:"border-box", fontFamily:"inherit" }}
                onFocus={e => e.target.style.borderColor=P2} onBlur={e => e.target.style.borderColor=BD}/>
            </div>

            {/* Doc info */}
            <div style={{ marginTop:14, padding:"10px 12px", background:BG, borderRadius:8, fontSize:11.5, color:"#334155", lineHeight:1.8 }}>
              <div><strong>Fichier :</strong> {doc.name}</div>
              <div><strong>Pages :</strong> {pageCount} page{pageCount > 1 ? "s" : ""}</div>
              <div><strong>Déposé par :</strong> {doc.uploadedByNom || doc.uploadedBy}</div>
              <div><strong>Date :</strong> {new Date(doc.date).toLocaleDateString("fr-FR",{day:"2-digit",month:"long",year:"numeric"})}</div>
              <div><strong>Protection :</strong> {doc.password?"🔐 Oui":"Aucune"}</div>
            </div>

            {/* Zone info */}
            {zone ? (
              <div style={{ marginTop:10, padding:"8px 12px", background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:8, fontSize:11, color:"#059669", lineHeight:1.7 }}>
                ✓ Zone : x={Math.round(zone.x)}, y={Math.round(zone.y)}, {Math.round(zone.w)}×{Math.round(zone.h)} px
              </div>
            ) : (
              <div style={{ marginTop:10, padding:"8px 12px", background:"#fffbeb", border:"1px solid #fef3c7", borderRadius:8, fontSize:11, color:"#92400e" }}>
                ⚠ Glissez sur le PDF pour définir la zone (optionnel)
              </div>
            )}
          </div>

          {/* Apply */}
          <div style={{ padding:"14px 16px", borderTop:`1px solid ${BD}`, background:"#fafbfc", flexShrink:0 }}>
            <button onClick={apply} disabled={!canSign}
              style={{ width:"100%", padding:"13px", borderRadius:10, border:"none", fontSize:13.5, fontWeight:700, cursor:canSign?"pointer":"not-allowed", fontFamily:"inherit", transition:"all .2s",
                background: canSign ? `linear-gradient(135deg,${P},${P2})` : "#e2e8f0",
                color: canSign ? WH : "#94a3b8",
                boxShadow: canSign ? `0 4px 16px ${P2}40` : "none" }}>
              {canSign ? "✅ Signer le document" : "Dessinez votre signature d'abord"}
            </button>
            <button onClick={onBack}
              style={{ width:"100%", marginTop:8, padding:"8px", borderRadius:8, border:`1px solid ${BD}`, background:"transparent", color:"#64748b", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
