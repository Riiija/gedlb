"use client";
/**
 * SoftDocs — Moteur de workflow de validation
 * 
 * LOGIQUE COMPLÈTE :
 * Étape 0 : Réception — visible uniquement aux receveurs paramétrés
 * Étapes 1..N : En validation — visible aux valideurs de l'étape active
 * Fin : Commun / Confidentiel commun
 * Rejeté : Refusé / Confidentiel refusé
 *
 * Vues personnelles :
 * "Reçu"    = docs où JE suis valideur de l'étape actuelle (EN ATTENTE ou EN RETARD)
 * "Archivé" = docs complètement validés ET j'ai participé à la validation
 * "Envoyé"  = docs que J'AI déposés (origin = mon ID)
 */

/* Étape active d'un doc (première non-VALIDÉ non-REJETÉ) */
export function getActiveStep(doc){
  return doc.etapes?.find(e=>e.statut==="EN ATTENTE"||e.statut==="EN RETARD")||null;
}

/* Étapes précédentes (pour redirection) */
export function getPrevSteps(doc){
  const active=getActiveStep(doc);
  if(!active)return[];
  const idx=doc.etapes.indexOf(active);
  return doc.etapes.slice(0,idx);
}

/* Est-ce que userId est valideur de l'étape active ? */
export function isValideurActif(doc,userId){
  const step=getActiveStep(doc);
  if(!step)return false;
  // Valideurs effectifs = intersection type.etapes[i].v ET etape.valideurs_actifs (si défini)
  const valideurs=step.vActifs||step.v||[];
  return valideurs.includes(userId);
}

/* Est-ce que userId est receveur du doc ? */
export function isReceveur(doc,userId,recv){
  if(doc.origin==="portail-fournisseur") return recv?.fournisseurs?.includes(userId);
  if(doc.conf)                           return recv?.confidentiels?.includes(userId);
  return recv?.internes?.includes(userId);
}

/* Le doc est-il à l'étape 0 (réception) ? */
export function isEtape0(doc){
  return doc.st==="REÇU";
}

/* Visibilité d'un doc pour un user donné */
export function canUserSeeDoc(doc,userId,recv){
  if(!doc||!userId)return false;
  // Étape 0 : seulement les receveurs
  if(isEtape0(doc)) return isReceveur(doc,userId,recv);
  // Rejeté ou terminé : tous les participants
  const allValideurs=doc.etapes?.flatMap(e=>e.v||[])||[];
  if(doc.st==="REJETÉ"||doc.st==="VALIDÉ"||doc.st==="ARCHIVÉ"||doc.st==="BON À PAYER"||doc.st==="PAYÉ")
    return allValideurs.includes(userId)||isReceveur(doc,userId,recv);
  // En validation : valideur de l'étape active
  return isValideurActif(doc,userId)||allValideurs.includes(userId);
}

/* ── Filtres de vue personnelle ── */
export function filterByView(docs,userId,recv,viewId){
  switch(viewId){
    case "recu":
      // Docs où JE suis valideur de l'étape active
      return docs.filter(d=>isValideurActif(d,userId)&&(d.st==="EN VALIDATION"||d.st==="EN RETARD"));
    case "archives":
      // Docs complètement validés où j'ai participé
      return docs.filter(d=>(d.st==="VALIDÉ"||d.st==="BON À PAYER"||d.st==="PAYÉ"||d.st==="ARCHIVÉ")
        &&d.etapes?.some(e=>(e.v||[]).includes(userId)));
    case "envoyes":
      // Docs que j'ai déposés
      return docs.filter(d=>d.deposePar===userId||(d.st==="VALIDÉ"||d.st==="BON À PAYER"||d.st==="PAYÉ"));
    case "en-cours":
      return docs.filter(d=>!d.conf&&(d.st==="EN VALIDATION"||d.st==="EN RETARD"));
    case "refuses":
      return docs.filter(d=>!d.conf&&d.st==="REJETÉ");
    case "communs":
      return docs.filter(d=>!d.conf&&(d.st==="VALIDÉ"||d.st==="BON À PAYER"||d.st==="PAYÉ"||d.st==="ARCHIVÉ"));
    case "c-enc":
      return docs.filter(d=>d.conf&&(d.st==="EN VALIDATION"||d.st==="EN RETARD"));
    case "c-ref":
      return docs.filter(d=>d.conf&&d.st==="REJETÉ");
    case "c-com":
      return docs.filter(d=>d.conf&&(d.st==="VALIDÉ"||d.st==="BON À PAYER"||d.st==="PAYÉ"||d.st==="ARCHIVÉ"));
    default:
      return docs;
  }
}

/* ── Actions workflow ── */

/** Valider l'étape active */
export function actionValider(doc,userId,{comment="",montant,planCompte,valideursSuivants}={}){
  const step=getActiveStep(doc);
  if(!step)return doc;

  const idx=doc.etapes.indexOf(step);
  const newEtapes=doc.etapes.map((e,i)=>{
    if(i!==idx)return e;
    return{...e,statut:"VALIDÉ",date:new Date().toLocaleDateString("fr-FR"),comment,validBy:userId};
  });

  // Vérifier si toutes les étapes sont validées
  const allDone=newEtapes.every(e=>e.statut==="VALIDÉ");

  // Si une prochaine étape existe, activer ses valideurs
  const nextStep=newEtapes[idx+1];
  if(nextStep&&valideursSuivants&&valideursSuivants.length>0){
    newEtapes[idx+1]={...nextStep,vActifs:valideursSuivants};
  }

  return{
    ...doc,
    etapes:newEtapes,
    st:allDone?"VALIDÉ":"EN VALIDATION",
    ...(montant?{mtR:parseFloat(montant)}:{}),
    ...(planCompte?{planCompte}:{}),
  };
}

/** Rejeter l'étape active */
export function actionRejeter(doc,userId,{comment=""}={}){
  const step=getActiveStep(doc);
  if(!step)return doc;
  const idx=doc.etapes.indexOf(step);
  const newEtapes=doc.etapes.map((e,i)=>
    i===idx?{...e,statut:"REJETÉ",date:new Date().toLocaleDateString("fr-FR"),comment,validBy:userId}:e
  );
  return{
    ...doc,etapes:newEtapes,st:"REJETÉ",motif:comment,
    refus:{etape:step.label,date:new Date().toLocaleDateString("fr-FR"),cause:"Rejet",comment}
  };
}

/** Rediriger vers une étape précédente */
export function actionRediriger(doc,userId,{etapeIdx,comment="",valideurs=[]}={}){
  const step=getActiveStep(doc);
  if(!step)return doc;
  const activeIdx=doc.etapes.indexOf(step);

  const newEtapes=doc.etapes.map((e,i)=>{
    if(i===activeIdx){
      // Étape actuelle marquée comme redirigée
      return{...e,statut:"REDIRIGÉ",date:new Date().toLocaleDateString("fr-FR"),
        comment:`↩ Redirigé vers "${doc.etapes[etapeIdx]?.label}" — ${comment}`,validBy:userId};
    }
    if(i===etapeIdx){
      // Étape cible remise EN ATTENTE avec valideurs choisis
      return{...e,statut:"EN ATTENTE",date:null,comment:null,validBy:null,
        vActifs:valideurs.length>0?valideurs:e.v};
    }
    // Les étapes entre les deux remises à vide
    if(i>etapeIdx&&i<activeIdx){
      return{...e,statut:"EN ATTENTE",date:null,comment:null,validBy:null,vActifs:e.v};
    }
    return e;
  });

  return{...doc,etapes:newEtapes,st:"EN VALIDATION",
    historique:[...(doc.historique||[]),
      {type:"redirection",de:step.label,vers:doc.etapes[etapeIdx]?.label,
       par:userId,date:new Date().toLocaleDateString("fr-FR"),comment}]};
}
