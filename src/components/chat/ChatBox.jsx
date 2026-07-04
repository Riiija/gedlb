"use client";
import{useState,useRef,useEffect,useMemo,useCallback}from"react";
import{fmtN}from"../../lib/utils";
import{useApp}from"../../context/AppContext";
import{useIsMobile}from"../../lib/useResponsive";
import{P,WH,BD,MUT}from"../../lib/theme";

/* ══════════════════════════════════════════════════════════
   MOTEUR NLP — Analyse sémantique multi-intentions
   Traite le langage naturel français/anglais sur les données internes
══════════════════════════════════════════════════════════ */

/* ── Normalisation texte ── */
const norm = t => t.toLowerCase()
  .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
  .replace(/['']/g,"'");

/* ── Détecteurs d'intention ── */
const has = (t,...words) => words.some(w => t.includes(w));
const hasAll = (t,...words) => words.every(w => t.includes(w));

/* ── Formateurs ── */
const fmtDoc = d => `**${d.id}** — ${d.type} — ${d.fourn||"—"} — ${fmtN(d.mtR||d.mt||0)} Ar — ${d.st}`;
const fmtShort = d => `• ${fmtDoc(d)}`;
const today = () => new Date().toLocaleDateString("fr-FR");
const thisMonth = () => {const d=new Date();return`${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;};

/* ── Chercher un doc par ID ou terme ── */
function findDoc(docs, q){
  const uq=q.toUpperCase();
  return docs.find(d=>d.id===uq||d.id.includes(uq));
}

/* ── Chercher plusieurs docs par terme ── */
function searchDocs(docs, term){
  const t=norm(term);
  return docs.filter(d=>
    norm(d.id).includes(t)||
    norm(d.fourn||"").includes(t)||
    norm(d.type||"").includes(t)||
    norm(d.site||"").includes(t)||
    norm(d.proj||"").includes(t)||
    norm(d.st||"").includes(t)
  );
}

/* ── Extraire un ID de document ── */
function extractDocId(q){
  return q.match(/DOC-\d{4}-\d{3,}/i)?.[0]?.toUpperCase()||null;
}

/* ── Extraire un montant ── */
function extractAmount(q){
  const m=q.match(/(\d[\d\s.,]*)\s*(ar|mga|ariary)?/i);
  if(m) return parseFloat(m[1].replace(/[\s,]/g,""));
  return null;
}

/* ══════════════════════════════════════════════════════════
   MOTEUR PRINCIPAL — retourne une réponse structurée
══════════════════════════════════════════════════════════ */
function nlpEngine(rawQ, ctx){
  const{docs, users, liq, types, recv, authUser, currentApp="softdocs"} = ctx;
  const isEP = currentApp==="epaiement";
  const isSd = !isEP;
  const q = norm(rawQ);
  const docId = extractDocId(rawQ);
  const me = authUser;

  /* ─────────────────────────────────────────────
     BLOC 0 : CONTEXT SWITCH — E-paiement
  ───────────────────────────────────────────────*/
  if(isEP){
    const allLiq=liq||[];
    const paid=allLiq.filter(l=>l.st==="PAYÉ"||l.syncTompro).length;
    const pending=allLiq.filter(l=>l.st!=="PAYÉ"&&!l.syncTompro).length;
    const totalMt=allLiq.flatMap(l=>l.imputations||[]).reduce((s,i)=>s+(i.mtMGA||0),0);

    if(has(q,"aide","help","exemple","quoi"))
      return{text:`🏦 **Assistant Soft E-paiement**\n\nExemples de questions :\n• "Combien de liquidations ?"\n• "Total des montants"\n• "Liquidations en cours"\n• "Liquidations payées"\n• "Statistiques générales"`};

    if(has(q,"stat","bilan","résumé","resume","general","vue d"))
      return{text:`📊 **Bilan E-paiement :**\n• Total liquidations : **${allLiq.length}**\n• Payées / générées : **${paid}**\n• En cours : **${pending}**\n• Montant total : **${fmtN(totalMt)} MGA**`};

    if(has(q,"liquid","liq","liquidation","decaissement")){
      if(has(q,"payé","paye","genere","généré","transmis"))
        return{text:`✅ **Liquidations payées/générées : ${paid}**\n${allLiq.filter(l=>l.st==="PAYÉ"||l.syncTompro).slice(0,8).map(l=>`• ${l.numero||l.id} — ${l.description||"—"} — **${l.st||"PAYÉ"}**`).join("\n")}`};
      if(has(q,"cours","attente","pending","non","pas encore"))
        return{text:`⏳ **Liquidations en cours : ${pending}**\n${allLiq.filter(l=>l.st!=="PAYÉ").slice(0,8).map(l=>`• ${l.numero||l.id} — ${l.description||"—"} — **${l.st||"EN COURS"}**`).join("\n")}`};
      return{text:`💳 **${allLiq.length} liquidation(s) :**\n${allLiq.slice(0,10).map(l=>`• ${l.numero||l.id} — ${l.description||l.site||"—"} — **${l.st||"—"}**`).join("\n")}${allLiq.length>10?`\n… et ${allLiq.length-10} autres`:""}`};
    }

    if(has(q,"montant","total","somme","argent","budget"))
      return{text:`💰 **Montants E-paiement :**\n• Total engagé : **${fmtN(totalMt)} MGA**\n• Liquidations payées : ${paid}\n• En cours : ${pending}`};

    if(has(q,"site","antananarivo","fianarantsoa","mahajanga")){
      const sites=[...new Set(allLiq.map(l=>l.site).filter(Boolean))];
      return{text:`🗺️ **Répartition par site :**\n${sites.map(s=>{const n=allLiq.filter(l=>l.site===s).length;return`• ${s} : ${n} liquidation(s)`;}).join("\n")}`};
    }

    return{text:`💡 Posez-moi des questions sur les liquidations, montants ou paiements.\nTapez **aide** pour voir les exemples.`};
  }

  /* ─────────────────────────────────────────────
     BLOC 1 : SITUATION / DÉTAIL D'UN DOCUMENT
  ───────────────────────────────────────────────*/
  if(docId || (has(q,"situation","statut","etat","detail","info","suivi","circuit","validation","historique") && has(q,"doc","document","facture","contrat","bon","rapport"))){
    const id = docId || extractDocId(rawQ);
    if(!id) return{text:"🔍 Précisez l'identifiant du document (ex: DOC-2025-001)"};
    const doc = findDoc(docs, id);
    if(!doc) return{text:`❌ Document **${id}** introuvable dans la base.`};

    const step = doc.etapes?.find(e=>e.statut==="EN ATTENTE"||e.statut==="EN RETARD");
    const done = doc.etapes?.filter(e=>e.statut==="VALIDÉ").length||0;
    const total = doc.etapes?.length||0;
    const pct = total>0?Math.round(done/total*100):0;
    const valideurs = step?(step.vActifs||step.v||[]).map(uid=>users.find(u=>u.id===uid)?.nom||uid):[];

    let txt = `📄 **${doc.id}** — ${doc.type}\n`;
    txt += `• Fournisseur : ${doc.fourn||"—"}\n`;
    txt += `• Projet : ${doc.proj||"—"} | Site : ${doc.site||"—"}\n`;
    txt += `• Montant : **${fmtN(doc.mtR||doc.mt||0)} Ar**\n`;
    txt += `• Statut : **${doc.st}**${doc.conf?" 🔒":""}\n`;
    txt += `• Circuit : ${done}/${total} étapes (${pct}%)\n`;
    if(step) txt += `• Étape active : **${step.label}**\n`;
    if(valideurs.length) txt += `• Valideurs : ${valideurs.join(", ")}\n`;
    if(doc.motif) txt += `• Motif rejet : _${doc.motif}_\n`;
    if(doc.ch?.numero) txt += `• N° facture OCR : ${doc.ch.numero}\n`;
    if(doc.planCompte) txt += `• Plan de compte : ${doc.planCompte}\n`;
    if(doc.ocr) txt += `• Score OCR : ${doc.ocr}%`;
    return{text:txt};
  }

  /* ─────────────────────────────────────────────
     BLOC 2 : DOCUMENTS D'UN FOURNISSEUR
  ───────────────────────────────────────────────*/
  if(has(q,"fournisseur","fourn","jirama","holcim","telma","kraomita","smec","sme")){
    const names=["jirama","holcim","telma","kraomita","sme","smec","bni","boa","orange"];
    const name=names.find(n=>q.includes(n))||
      (q.match(/fournisseur\s+([\w\s]+)/)?.[1]||"").trim();
    const lst=name?docs.filter(d=>norm(d.fourn||"").includes(name)):docs.filter(d=>d.fourn);
    if(lst.length===0) return{text:`❌ Aucun document trouvé pour "${name}"`};
    return{text:`👥 **Documents — ${name.toUpperCase()} (${lst.length}) :**\n${lst.slice(0,8).map(fmtShort).join("\n")}${lst.length>8?`\n… et ${lst.length-8} autres`:""}`};
  }

  /* ─────────────────────────────────────────────
     BLOC 3 : DOCUMENTS PAR STATUT
  ───────────────────────────────────────────────*/
  if(has(q,"valide","valides","valider","validé","validés","approuve")){
    if(has(q,"aujourd","ce jour","ajourd","today","journee")){
      const lst=docs.filter(d=>d.etapes?.some(e=>e.date===today()&&e.statut==="VALIDÉ"));
      return{text:lst.length===0?"✅ Aucun document validé aujourd'hui.":
        `✅ **${lst.length} validé(s) aujourd'hui :**\n${lst.map(fmtShort).join("\n")}`};
    }
    if(has(q,"mois","month","mensuel")){
      const m=thisMonth();
      const lst=docs.filter(d=>d.etapes?.some(e=>e.date?.includes(m)&&e.statut==="VALIDÉ"));
      return{text:lst.length===0?`✅ Aucun document validé en ${m}.`:
        `✅ **${lst.length} validé(s) ce mois (${m}) :**\n${lst.map(fmtShort).join("\n")}`};
    }
    const lst=docs.filter(d=>d.st==="VALIDÉ"||d.st==="BON À PAYER"||d.st==="PAYÉ");
    return{text:`✅ **${lst.length} document(s) validé(s)/terminé(s) :**\n${lst.map(fmtShort).join("\n")}`};
  }

  if(has(q,"rejet","rejete","refuse","refus","rejeté","refusé")){
    const lst=docs.filter(d=>d.st==="REJETÉ");
    if(lst.length===0) return{text:"✅ Aucun document rejeté."};
    let txt=`❌ **${lst.length} rejeté(s) :**\n`;
    lst.forEach(d=>{txt+=`• **${d.id}** — ${d.fourn||"—"} — ${fmtN(d.mtR||d.mt||0)} Ar\n  ↳ Motif: _${d.motif||"non précisé"}_\n`;});
    return{text:txt};
  }

  if(has(q,"retard","en retard","late","overdue","depassement")){
    const lst=docs.filter(d=>d.st==="EN RETARD");
    return{text:lst.length===0?"✅ Aucun document en retard.":
      `⚠️ **${lst.length} en retard :**\n${lst.map(fmtShort).join("\n")}`};
  }

  if(has(q,"en cours","encours","validation","instance","attente")){
    const lst=docs.filter(d=>d.st==="EN VALIDATION"||d.st==="EN RETARD");
    return{text:lst.length===0?"✅ Aucun document en cours.":
      `🔄 **${lst.length} en cours :**\n${lst.map(fmtShort).join("\n")}`};
  }

  if(has(q,"recu","recus","reçu","reception","nouveau","nouve")){
    const lst=docs.filter(d=>d.st==="REÇU");
    return{text:lst.length===0?"📥 Aucun document à valider.":
      `📥 **${lst.length} nouveau(x) à valider :**\n${lst.map(fmtShort).join("\n")}`};
  }

  if(has(q,"archive","archives","archivé","cloture","termine","fini")){
    const lst=docs.filter(d=>d.st==="ARCHIVÉ"||d.st==="CLÔTURÉ");
    return{text:lst.length===0?"📦 Aucun document archivé.":
      `📦 **${lst.length} archivé(s) :**\n${lst.map(fmtShort).join("\n")}`};
  }

  if(has(q,"paye","payé","paiement","bap","bon a payer")){
    const lst=docs.filter(d=>d.st==="PAYÉ"||d.st==="BON À PAYER");
    return{text:lst.length===0?"💳 Aucun document payé.":
      `💳 **${lst.length} payé(s)/BAP :**\n${lst.map(fmtShort).join("\n")}`};
  }

  if(has(q,"confidentiel","confidentiels","confid")){
    const lst=docs.filter(d=>d.conf);
    return{text:lst.length===0?"🔒 Aucun document confidentiel.":
      `🔒 **${lst.length} confidentiel(s) :**\n${lst.map(fmtShort).join("\n")}`};
  }

  /* ─────────────────────────────────────────────
     BLOC 4 : MONTANTS & FINANCES
  ───────────────────────────────────────────────*/
  if(has(q,"montant","total","somme","valeur","finance","financier","budget")){
    if(has(q,"moyen","moyenne","average")){
      const moy=docs.length?docs.reduce((s,d)=>s+(d.mtR||d.mt||0),0)/docs.length:0;
      return{text:`📊 Montant moyen par document : **${fmtN(Math.round(moy))} Ar**`};
    }
    if(has(q,"max","maximum","plus grand","plus eleve","plus cher")){
      const d=[...docs].sort((a,b)=>(b.mtR||b.mt||0)-(a.mtR||a.mt||0))[0];
      return{text:d?`💰 Document le plus élevé : **${d.id}** — **${fmtN(d.mtR||d.mt)} Ar** (${d.fourn||"—"})`:"Aucun document."};
    }
    if(has(q,"min","minimum","plus petit","plus bas","moins cher")){
      const lst=docs.filter(d=>(d.mtR||d.mt||0)>0);
      const d=[...lst].sort((a,b)=>(a.mtR||a.mt||0)-(b.mtR||b.mt||0))[0];
      return{text:d?`💰 Document le moins élevé : **${d.id}** — **${fmtN(d.mtR||d.mt)} Ar** (${d.fourn||"—"})`:"Aucun document."};
    }
    const total=docs.reduce((s,d)=>s+(d.mtR||d.mt||0),0);
    const valide=docs.filter(d=>["VALIDÉ","BON À PAYER","PAYÉ"].includes(d.st)).reduce((s,d)=>s+(d.mtR||d.mt||0),0);
    const enCours=docs.filter(d=>["EN VALIDATION","EN RETARD"].includes(d.st)).reduce((s,d)=>s+(d.mtR||d.mt||0),0);
    return{text:`💰 **Synthèse financière**\n• Total (${docs.length} docs) : **${fmtN(total)} Ar**\n• Traité (validé/payé) : **${fmtN(valide)} Ar**\n• En cours : **${fmtN(enCours)} Ar**\n• Montant moyen : **${fmtN(Math.round(total/(docs.length||1)))} Ar**`};
  }

  /* ─────────────────────────────────────────────
     BLOC 5 : STATISTIQUES & DASHBOARD
  ───────────────────────────────────────────────*/
  if(has(q,"stat","kpi","tableau de bord","dashboard","bilan","resume","synthese","rapport","reporting")){
    const byStatus={};
    docs.forEach(d=>{byStatus[d.st]=(byStatus[d.st]||0)+1;});
    const byType={};
    docs.forEach(d=>{byType[d.type]=(byType[d.type]||0)+1;});
    const total=docs.reduce((s,d)=>s+(d.mtR||d.mt||0),0);
    const ocrMoy=docs.filter(d=>d.ocr).reduce((s,d,_,a)=>s+d.ocr/(a.length||1),0);
    let txt=`📊 **Tableau de bord — ${docs.length} documents**\n\n`;
    txt+=`**Par statut :**\n${Object.entries(byStatus).map(([s,n])=>`• ${s} : ${n}`).join("\n")}\n\n`;
    txt+=`**Par type :**\n${Object.entries(byType).map(([t,n])=>`• ${t} : ${n}`).join("\n")}\n\n`;
    txt+=`**Finances :** ${fmtN(total)} Ar total\n`;
    txt+=`**Score OCR moyen :** ${Math.round(ocrMoy)}%`;
    return{text:txt};
  }

  /* ─────────────────────────────────────────────
     BLOC 6 : PAR PROJET
  ───────────────────────────────────────────────*/
  if(has(q,"projet","project","prj","prea","gezani","pivot","padap")){
    const projs=["prea","gezani","pivot","padap","prj-001","prj-002","prj-003","prj-004"];
    const found=projs.find(p=>q.includes(p));
    if(found){
      const lst=docs.filter(d=>norm(d.proj||"").includes(found)||norm(d.proj||"").includes(found.replace("prj-","prj-")));
      if(lst.length===0) return{text:`❌ Aucun document pour le projet "${found.toUpperCase()}".`};
      const total=lst.reduce((s,d)=>s+(d.mtR||d.mt||0),0);
      return{text:`📁 **Projet ${found.toUpperCase()} — ${lst.length} document(s)**\nMontant total : ${fmtN(total)} Ar\n${lst.map(fmtShort).join("\n")}`};
    }
    // Liste tous les projets
    const byProj={};
    docs.forEach(d=>{if(d.proj)byProj[d.proj]=(byProj[d.proj]||0)+1;});
    return{text:`📁 **Documents par projet :**\n${Object.entries(byProj).map(([p,n])=>`• ${p} : ${n} doc(s)`).join("\n")}`};
  }

  /* ─────────────────────────────────────────────
     BLOC 7 : PAR SITE
  ───────────────────────────────────────────────*/
  if(has(q,"site","antananarivo","mahajanga","toamasina","fianarantsoa","toliara","morondava","tana","tamatave")){
    const sites=["antananarivo","mahajanga","toamasina","fianarantsoa","toliara","morondava","tana"];
    const found=sites.find(s=>q.includes(s));
    if(found){
      const mapped=found==="tana"?"antananarivo":found;
      const lst=docs.filter(d=>norm(d.site||"").includes(mapped));
      const total=lst.reduce((s,d)=>s+(d.mtR||d.mt||0),0);
      return{text:`📍 **${found.charAt(0).toUpperCase()+found.slice(1)} — ${lst.length} document(s)**\nMontant : ${fmtN(total)} Ar\n${lst.map(fmtShort).join("\n")}`};
    }
    const bySite={};
    docs.forEach(d=>{if(d.site)bySite[d.site]=(bySite[d.site]||0)+1;});
    return{text:`📍 **Par site :**\n${Object.entries(bySite).map(([s,n])=>`• ${s} : ${n}`).join("\n")}`};
  }

  /* ─────────────────────────────────────────────
     BLOC 8 : UTILISATEURS & VALIDEURS
  ───────────────────────────────────────────────*/
  if(has(q,"utilisateur","user","valideur","agent","personnel","equipe","team","qui","receveur")){
    if(has(q,"qui peut","qui a acces","acces","receveur")){
      const fournRec=(recv?.fournisseurs||[]).map(uid=>users.find(u=>u.id===uid)?.nom||uid);
      const confRec=(recv?.confidentiels||[]).map(uid=>users.find(u=>u.id===uid)?.nom||uid);
      const intRec=(recv?.internes||[]).map(uid=>users.find(u=>u.id===uid)?.nom||uid);
      return{text:`👥 **Receveurs paramétrés**\n• Fournisseurs : ${fournRec.join(", ")||"—"}\n• Confidentiels : ${confRec.join(", ")||"—"}\n• Internes : ${intRec.join(", ")||"—"}`};
    }
    const active=users.filter(u=>u.actif!==false);
    return{text:`👤 **${active.length} utilisateurs actifs :**\n${active.map(u=>`• ${u.nom} — ${u.role} — ${u.email||u.site||"—"}`).join("\n")}`};
  }

  /* ─────────────────────────────────────────────
     BLOC 9 : LIQUIDATIONS
  ───────────────────────────────────────────────*/
  if(has(q,"liquid","liquidation","liq","decaissement")){
    const total=liq.reduce((s,l)=>s+(l.mt||0),0);
    return{text:`💳 **${liq.length} liquidation(s) — ${fmtN(total)} Ar**\n${liq.map(l=>`• ${l.id} — ${l.fourn||"—"} — ${fmtN(l.mt)} Ar — **${l.st}**`).join("\n")}`};
  }

  /* ─────────────────────────────────────────────
     BLOC 10 : RECHERCHE LIBRE
  ───────────────────────────────────────────────*/
  if(has(q,"cherche","recherche","trouve","trouver","search","find","liste","lister","affiche","show")){
    // Extraire le terme de recherche
    const term=rawQ.replace(/cherche[rz]?|recherche[rz]?|trouve[rz]?|liste[rz]?|affiche[rz]?|find|search|les?|des?|document[s]?|facture[s]?|contrat[s]?/gi,"").trim();
    if(term.length>1){
      const lst=searchDocs(docs,term);
      if(lst.length===0) return{text:`🔍 Aucun document trouvé pour "${term}"`};
      return{text:`🔍 **${lst.length} résultat(s) pour "${term}" :**\n${lst.slice(0,8).map(fmtShort).join("\n")}${lst.length>8?`\n… et ${lst.length-8} autres.`:""}`};
    }
  }

  /* ─────────────────────────────────────────────
     BLOC 11 : COMPARAISONS & CLASSEMENTS
  ───────────────────────────────────────────────*/
  if(has(q,"top","classe","ranking","premier","meilleur","plus grand","plus eleve")){
    const n=parseInt(q.match(/\d+/)?.[0])||5;
    const sorted=[...docs].sort((a,b)=>(b.mtR||b.mt||0)-(a.mtR||a.mt||0)).slice(0,n);
    return{text:`🏆 **Top ${n} par montant :**\n${sorted.map((d,i)=>`${i+1}. ${fmtDoc(d)}`).join("\n")}`};
  }

  /* ─────────────────────────────────────────────
     BLOC 12 : MES DOCUMENTS (vue perso)
  ───────────────────────────────────────────────*/
  if(has(q,"mes documents","mes docs","moi","mon","ma liste","je suis","je dois","a valider","pour moi")){
    if(!me) return{text:"🔐 Connectez-vous pour voir vos documents personnels."};
    const myDocs=docs.filter(d=>{
      const step=d.etapes?.find(e=>e.statut==="EN ATTENTE"||e.statut==="EN RETARD");
      return step&&(step.vActifs||step.v||[]).includes(me.id);
    });
    const myValidated=docs.filter(d=>d.etapes?.some(e=>e.validBy===me.id&&e.statut==="VALIDÉ"));
    let txt=`👤 **${me.nom} — Votre tableau**\n`;
    txt+=`• À valider : **${myDocs.length} document(s)**\n`;
    if(myDocs.length>0) txt+=myDocs.map(d=>`  ↳ ${d.id} — ${d.type} — ${fmtN(d.mtR||d.mt)} Ar`).join("\n")+"\n";
    txt+=`• Validés par vous : ${myValidated.length}`;
    return{text:txt};
  }

  /* ─────────────────────────────────────────────
     BLOC 13 : AIDE
  ───────────────────────────────────────────────*/
  if(has(q,"aide","help","?","quoi","comment","que peux","que peut","capacite","fonctionnalit","exemple")){
    return{text:`🤖 **Exemples de questions :**\n\n**📄 Documents :**\n• "Situation du DOC-2025-001"\n• "Mes documents à valider"\n• "Documents en retard"\n• "Liste des documents refusés avec motifs"\n• "Top 5 des montants les plus élevés"\n\n**💰 Finances :**\n• "Montant total des documents"\n• "Synthèse financière"\n• "Montant moyen"\n\n**🔍 Recherche :**\n• "Chercher JIRAMA"\n• "Documents du projet PREA"\n• "Documents site Mahajanga"\n• "Documents validés ce mois"\n\n**👥 Équipe :**\n• "Qui sont les receveurs ?"\n• "Liste des utilisateurs"\n• "Liquidations"\n\nTapez votre question en langage naturel !`};
  }

  /* ─────────────────────────────────────────────
     BLOC 14 : SALUTATIONS
  ───────────────────────────────────────────────*/
  if(has(q,"bonjour","bonsoir","salut","hello","hi","hey","coucou","yo")){
    const h=new Date().getHours();
    const greet=h<12?"Bonjour":h<18?"Bonjour":"Bonsoir";
    return{text:`${greet}${me?` **${me.nom.split(" ")[0]}**`:""}! 👋 Je suis l'assistant SoftDocs.\nJe peux répondre à des questions sur vos documents, validations, montants, statistiques…\nTapez **aide** pour voir les exemples.`};
  }

  /* ─────────────────────────────────────────────
     BLOC 15 : FALLBACK INTELLIGENT
  ───────────────────────────────────────────────*/
  // Essai de recherche libre comme dernier recours
  if(rawQ.trim().length>2){
    const results=searchDocs(docs,rawQ.trim());
    if(results.length>0){
      return{text:`🔍 J'ai trouvé **${results.length} document(s)** correspondant à "${rawQ.trim()}" :\n${results.slice(0,5).map(fmtShort).join("\n")}${results.length>5?`\n…et ${results.length-5} autres`:""}`};
    }
  }

  return{text:`🤔 Je n'ai pas bien compris. Essayez une formulation différente ou tapez **aide** pour voir les exemples.\n\nVous pouvez me demander : statut d'un document, documents en retard, montant total, statistiques, recherche par fournisseur/projet/site…`};
}

/* ── Renderer markdown simple ── */
function MsgContent({text,isUser}){
  const lines=text.split("\n");
  return(
    <div style={{fontSize:12.5,lineHeight:1.7,wordBreak:"break-word"}}>
      {lines.map((line,i)=>{
        const parts=line.split(/\*\*(.+?)\*\*/g);
        const rich=parts.map((p,j)=>j%2===1?<b key={j}>{p}</b>:
          p.split(/_(.*?)_/g).map((pp,jj)=>jj%2===1?<em key={jj} style={{color:isUser?"rgba(255,255,255,.8)":MUT}}>{pp}</em>:pp)
        );
        return(
          <div key={i} style={{marginBottom:lines.length>1&&i<lines.length-1?1:0}}>
            {rich}
          </div>
        );
      })}
    </div>
  );
}

const SD_SUGGESTIONS=["Mes documents à valider","Documents en retard","Montant total","Statistiques générales","Documents refusés","Top 5 montants","Qui sont les receveurs ?"];
const EP_SUGGESTIONS=["Combien de liquidations ?","Total des montants","Liquidations en cours","Liquidations payées","Répartition par site","Statistiques générales"];

export default function ChatBox(){
  const appCtx=useApp();
  const{docs,users,liq,types,recv,authUser,currentApp}=appCtx;
  const[open,setOpen]=useState(false);
  const[msgs,setMsgs]=useState([
    {role:"bot",text:currentApp==="epaiement"
      ?"🏦 Bonjour ! Je suis votre assistant **Soft E-paiement**.\nPosez-moi des questions sur les liquidations, paiements ou montants.\nTapez **aide** pour voir les exemples."
      :"👋 Bonjour ! Je suis votre assistant **SoftDocs**.\nPosez-moi des questions sur vos documents, validations ou fournisseurs.\nTapez **aide** pour voir les exemples."}
  ]);
  const[input,setInput]=useState("");
  const[loading,setLoading]=useState(false);
  const endRef=useRef();
  const inputRef=useRef();

  useEffect(()=>{
    if(open)endRef.current?.scrollIntoView({behavior:"smooth"});
  },[msgs,open]);

  useEffect(()=>{
    if(open)setTimeout(()=>inputRef.current?.focus(),120);
  },[open]);

  const send=useCallback((text)=>{
    const q=(text||input).trim();
    if(!q||loading)return;
    setInput("");
    setMsgs(p=>[...p,{role:"user",text:q}]);
    setLoading(true);
    setTimeout(()=>{
      try{
        const{text:ans}=nlpEngine(q,{docs,users,liq,types,recv,authUser,currentApp});
        setMsgs(p=>[...p,{role:"bot",text:ans}]);
      }catch{
        setMsgs(p=>[...p,{role:"bot",text:"❌ Une erreur s'est produite. Réessayez."}]);
      }
      setLoading(false);
    },200+Math.random()*200);
  },[input,loading,docs,users,liq,types,recv,authUser,currentApp]);

  const onKey=e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}};

  const unread=open?0:Math.max(0,msgs.filter(m=>m.role==="bot").length-1);

  return(
    <>
      {/* ── Floating button ── */}
      <button onClick={()=>setOpen(p=>!p)}
        title={open?"Fermer l'assistant":`Ouvrir l'assistant ${currentApp==="epaiement"?"E-paiement":"SoftDocs"}`}
        style={{position:"fixed",bottom:24,right:24,width:54,height:54,borderRadius:"50%",
          background:open?"#c0392b":currentApp==="epaiement"?"#1a6b3c":P,border:"none",cursor:"pointer",
          display:"flex",alignItems:"center",justifyContent:"center",
          boxShadow:"0 4px 20px rgba(0,0,0,.3)",zIndex:10000,transition:"all .2s",color:"#fff"}}>
        {open
          ?<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          :<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        }
        {!open&&unread>0&&(
          <div style={{position:"absolute",top:-3,right:-3,width:18,height:18,borderRadius:"50%",background:"#e03e3e",fontSize:9,fontWeight:800,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid #fff"}}>
            {unread>9?"9+":unread}
          </div>
        )}
      </button>

      {/* ── Chat window ── */}
      {open&&(
        <div style={{position:"fixed",bottom:90,right:24,width:typeof window!=="undefined"&&window.innerWidth<=768?window.innerWidth-20:380,height:520,background:WH,
          borderRadius:16,boxShadow:"0 12px 50px rgba(0,0,0,.2)",
          display:"flex",flexDirection:"column",zIndex:10000,overflow:"hidden",
          animation:"slideUp .2s ease",border:`1px solid ${BD}`}}>

          {/* Header */}
          <div style={{background:"rgb(26,38,52)",padding:"12px 16px",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:P,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:`0 0 0 3px ${P}44`}}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round">
                <rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/>
                <line x1="12" y1="7" x2="12" y2="11"/>
                <line x1="8" y1="15" x2="8" y2="15" strokeWidth="2.5"/>
                <line x1="16" y1="15" x2="16" y2="15" strokeWidth="2.5"/>
              </svg>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:13.5,fontWeight:700,color:"#fff"}}>{currentApp==="epaiement"?"E-paiement IA":"SoftDocs IA"}</div>
              <div style={{fontSize:10.5,color:"rgba(255,255,255,.5)",display:"flex",alignItems:"center",gap:4}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:"#2ecc71",flexShrink:0}}/>
                {currentApp==="epaiement"?`Assistant liquidations · ${(liq||[]).length} liquidation(s)`:`Assistant documentaire · ${docs.length} docs`}
              </div>
            </div>
            <button onClick={()=>setMsgs([{role:"bot",text:"Nouvelle conversation. Comment puis-je vous aider ?"}])}
              title="Effacer la conversation"
              style={{background:"rgba(255,255,255,.1)",border:"none",borderRadius:6,color:"rgba(255,255,255,.6)",
                padding:"4px 10px",cursor:"pointer",fontSize:11,fontFamily:"inherit",transition:"background .15s"}}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.2)"}
              onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.1)"}>
              Effacer
            </button>
          </div>

          {/* Messages */}
          <div style={{flex:1,overflowY:"auto",padding:"14px 12px",display:"flex",flexDirection:"column",gap:12,
            background:"#f7f8fc"}}>
            {msgs.map((m,i)=>(
              <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",alignItems:"flex-end",gap:7}}>
                {m.role==="bot"&&(
                  <div style={{width:26,height:26,borderRadius:"50%",background:P,
                    display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginBottom:2}}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                      <rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/>
                      <line x1="12" y1="7" x2="12" y2="11"/>
                    </svg>
                  </div>
                )}
                <div style={{
                  maxWidth:"82%",padding:"9px 13px",
                  borderRadius:m.role==="user"?"14px 14px 3px 14px":"14px 14px 14px 3px",
                  background:m.role==="user"?P:"#fff",
                  color:m.role==="user"?"#fff":"#212529",
                  boxShadow:"0 1px 4px rgba(0,0,0,.08)",
                  border:m.role==="bot"?`1px solid ${BD}`:"none",
                }}>
                  <MsgContent text={m.text} isUser={m.role==="user"}/>
                  <div style={{fontSize:9.5,marginTop:4,opacity:.5,textAlign:m.role==="user"?"right":"left"}}>
                    {new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}
                  </div>
                </div>
              </div>
            ))}
            {loading&&(
              <div style={{display:"flex",gap:7,alignItems:"flex-end"}}>
                <div style={{width:26,height:26,borderRadius:"50%",background:P,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><line x1="12" y1="7" x2="12" y2="11"/>
                  </svg>
                </div>
                <div style={{padding:"10px 16px",background:"#fff",borderRadius:"14px 14px 14px 3px",
                  display:"flex",gap:5,alignItems:"center",border:`1px solid ${BD}`,boxShadow:"0 1px 4px rgba(0,0,0,.08)"}}>
                  {[0,1,2].map(i=>(
                    <div key={i} style={{width:7,height:7,borderRadius:"50%",background:P,
                      animation:`bounce .9s ${i*.18}s ease-in-out infinite`}}/>
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef}/>
          </div>

          {/* Quick suggestions (affiché seulement au début) */}
          {msgs.length<=2&&!loading&&(
            <div style={{padding:"8px 12px",background:"#f7f8fc",borderTop:`1px solid ${BD}`,flexShrink:0}}>
              <div style={{fontSize:10.5,color:MUT,marginBottom:5,fontWeight:600,textTransform:"uppercase",letterSpacing:".06em"}}>Suggestions</div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                {(currentApp==="epaiement"?EP_SUGGESTIONS:SD_SUGGESTIONS).map(s=>(
                  <button key={s} onClick={()=>send(s)}
                    style={{padding:"4px 10px",borderRadius:14,border:`1px solid ${BD}`,background:"#fff",
                      fontSize:11,cursor:"pointer",color:"#495057",fontFamily:"inherit",whiteSpace:"nowrap",
                      transition:"all .12s"}}
                    onMouseEnter={e=>{e.currentTarget.style.background="#f0f4ff";e.currentTarget.style.borderColor=P;e.currentTarget.style.color=P;}}
                    onMouseLeave={e=>{e.currentTarget.style.background="#fff";e.currentTarget.style.borderColor=BD;e.currentTarget.style.color="#495057";}}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div style={{padding:"10px 12px",borderTop:`1px solid ${BD}`,display:"flex",gap:8,
            alignItems:"flex-end",background:"#fff",flexShrink:0}}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Posez votre question…"
              rows={1}
              style={{flex:1,border:`1px solid ${BD}`,borderRadius:10,padding:"8px 12px",
                fontSize:13,fontFamily:"inherit",resize:"none",outline:"none",
                lineHeight:1.5,maxHeight:90,overflowY:"auto",transition:"border-color .15s"}}
              onFocus={e=>e.target.style.borderColor=P}
              onBlur={e=>e.target.style.borderColor=BD}
            />
            <button
              onClick={()=>send()}
              disabled={!input.trim()||loading}
              title="Envoyer (Entrée)"
              style={{width:38,height:38,borderRadius:"50%",
                background:input.trim()&&!loading?P:"#e9ecef",
                border:"none",cursor:input.trim()&&!loading?"pointer":"not-allowed",
                display:"flex",alignItems:"center",justifyContent:"center",
                color:input.trim()&&!loading?"#fff":MUT,flexShrink:0,
                transition:"all .15s",boxShadow:input.trim()&&!loading?`0 2px 8px ${P}55`:"none"}}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
          <div style={{textAlign:"center",fontSize:9.5,color:MUT,padding:"4px 0 6px",background:"#fff",borderTop:`1px solid ${BD}`}}>
            Données internes uniquement · Aucune IA externe
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
      `}</style>
    </>
  );
}
