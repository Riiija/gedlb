"use client";
/* ═══════════════════════════════════════════════════════════════
   SOFT LIBRARY — ChatBox IA Contextuel
   ─────────────────────────────────────────────────────────────
   Assistant intelligent intégré aux données archives :
   ✓ Recherche documents, contenants, emplacements
   ✓ KPI et statistiques temps réel
   ✓ Consultations en cours / en retard
   ✓ Courrier entrant/sortant
   ✓ Suggestions contextuelles intelligentes
   ✓ Bilingue FR/EN
═══════════════════════════════════════════════════════════════ */
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { SHARED_CONSULTATIONS, SHARED_COURRIERS, SHARED_EMPLACEMENTS, SHARED_DOC_TYPES, SHARED_CONT_MOUVEMENTS } from './data/sharedData';

const FF = "'DM Sans','Inter',sans-serif";
const C = {
  primary: '#0c4a6e', primaryLight: '#0284c7', primaryLighter: '#e0f2fe',
  accent: '#f59e0b', danger: '#dc2626', success: '#16a34a', info: '#2563eb',
  text: '#0f172a', textSec: '#475569', textMut: '#94a3b8',
  border: '#e2e8f0', surface: '#f8fafc', bg: '#ffffff',
};

/* ═══════════════════════════════════════════
   MOTEUR D'ANALYSE — Traitement des requêtes
═══════════════════════════════════════════ */
function createEngine(documents, contenants, emplacements, users, consultations, courriers, lang) {
  const docs = documents || [];
  const conts = contenants || [];
  const empls = emplacements || SHARED_EMPLACEMENTS;
  const consults = consultations || SHARED_CONSULTATIONS;
  const mails = courriers || SHARED_COURRIERS;
  const docTypes = SHARED_DOC_TYPES;
  const mouvements = SHARED_CONT_MOUVEMENTS;
  const fr = lang !== 'en';

  /* ── Helpers ── */
  const getEmpl = (id) => empls.find(e => e.id === id);
  const getCont = (id) => conts.find(c => c.id === id);
  const getDocType = (id) => docTypes.find(t => t.id === id);
  const fmtN = (n) => n?.toLocaleString?.('fr-FR') ?? n;

  /* ── KPI Calculator ── */
  const kpi = () => {
    const actifs = docs.filter(d => d.statut === 'disponible' || d.statut === 'en_consultation').length;
    const archives = docs.filter(d => d.statut?.includes?.('archiv')).length;
    const detruits = docs.filter(d => d.statut === 'detruit' || d.statut === 'elimine').length;
    const totalCap = empls.reduce((s, e) => s + (e.capacite || 0), 0);
    const totalOcc = empls.reduce((s, e) => s + (e.occupe || 0), 0);
    const tauxOcc = totalCap > 0 ? ((totalOcc / totalCap) * 100).toFixed(1) : 0;
    const consEnCours = consults.filter(c => ['en_cours', 'en_retard', 'retard_critique'].includes(c.statut)).length;
    const consRetard = consults.filter(c => c.statut === 'en_retard' || c.statut === 'retard_critique').length;
    const contsScelles = conts.filter(c => c.statut === 'scelle').length;
    const contsTransit = conts.filter(c => c.statut === 'transit').length;
    const mailsEnAttente = mails.filter(m => ['en_traitement', 'en_validation', 'enregistre'].includes(m.statut)).length;
    const mailsUrgents = mails.filter(m => m.priorite === 'urgente').length;
    return { total: docs.length, actifs, archives, detruits, totalCap, totalOcc, tauxOcc,
      consEnCours, consRetard, contsScelles, contsTransit, totalConts: conts.length,
      mailsEnAttente, mailsUrgents, totalMails: mails.length };
  };

  /* ── Document search ── */
  const searchDocs = (query) => {
    const q = query.toLowerCase().trim();
    return docs.filter(d =>
      d.id?.toLowerCase().includes(q) ||
      d.titre?.toLowerCase().includes(q) ||
      d.cote?.toLowerCase().includes(q) ||
      d.service?.toLowerCase().includes(q) ||
      d.categorie?.toLowerCase().includes(q) ||
      d.emetteur?.toLowerCase().includes(q) ||
      (d.motsCles || []).some(m => m.toLowerCase().includes(q))
    ).slice(0, 8);
  };

  /* ── Contenant search ── */
  const searchConts = (query) => {
    const q = query.toLowerCase().trim();
    return conts.filter(c =>
      c.id?.toLowerCase().includes(q) ||
      c.label?.toLowerCase().includes(q) ||
      c.type?.toLowerCase().includes(q)
    ).slice(0, 6);
  };

  /* ── Emplacement search ── */
  const searchEmpls = (query) => {
    const q = query.toLowerCase().trim();
    return empls.filter(e =>
      e.id?.toLowerCase().includes(q) ||
      e.nom?.toLowerCase().includes(q) ||
      e.site?.toLowerCase().includes(q) ||
      e.batiment?.toLowerCase().includes(q) ||
      e.salle?.toLowerCase().includes(q)
    ).slice(0, 6);
  };

  /* ── Intent detection ── */
  const detect = (input) => {
    const q = input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

    /* Greetings */
    if (/^(bonjour|salut|hello|hi |hey|bonsoir|coucou)/.test(q)) return { intent: 'greeting' };

    /* Thanks */
    if (/^(merci|thanks|thank you|excellent|parfait|super|genial)/.test(q)) return { intent: 'thanks' };

    /* Help */
    if (/^(aide|help|comment|quoi faire|que peux|what can|commande)/.test(q)) return { intent: 'help' };

    /* KPI / Dashboard */
    if (/kpi|tableau de bord|dashboard|statistique|stats|resume|overview|synthese|bilan|etat/.test(q))
      return { intent: 'kpi' };

    /* Specific document search by ID */
    if (/doc-\d{4}-\d{3,4}/i.test(input))
      return { intent: 'doc_detail', id: input.match(/DOC-\d{4}-\d{3,4}/i)?.[0]?.toUpperCase() };

    /* Specific contenant search by ID */
    if (/cnt-\d{3}/i.test(input))
      return { intent: 'cont_detail', id: input.match(/CNT-\d{3}/i)?.[0]?.toUpperCase() };

    /* Emplacements */
    if (/emplacement|locali|salle|batiment|stockage|capacite|occupation|location|building|room|where|ou se trouve/.test(q))
      return { intent: 'emplacements', query: q };

    /* Contenants */
    if (/contenant|boite|carton|dossier|classeur|container|box|scelle|sealed|transit/.test(q))
      return { intent: 'contenants', query: q };

    /* Consultations */
    if (/consultation|retard|overdue|en cours|pret|emprunte|borrow|delay|retour/.test(q))
      return { intent: 'consultations' };

    /* Courrier */
    if (/courrier|mail|correspondance|entrant|sortant|interne|incoming|outgoing|lettre|facture.*entrant/.test(q))
      return { intent: 'courrier' };

    /* Mouvements */
    if (/mouvement|deplacement|move|transfer|historique mouv|dernier mouv|recent mouv|activite recente/.test(q))
      return { intent: 'mouvements' };

    /* Types documentaires */
    if (/type.*document|cycle.*vie|conservation|destruction|retention|duree.*active|sort.*final/.test(q))
      return { intent: 'types_doc' };

    /* Alertes */
    if (/alert|alerte|urgent|warning|probleme|anomalie|issue|danger|critique/.test(q))
      return { intent: 'alertes' };

    /* Search */
    if (/cherch|search|trouv|find|ou est|where is|localise/.test(q)) {
      const terms = q.replace(/cherch\w*|search|trouv\w*|find|ou est|where is|localis\w*/g, '').trim();
      return { intent: 'search', query: terms };
    }

    /* Occupation / saturation */
    if (/saturat|plein|full|presque|quasi|rempli|capacite rest|reste|disponib/.test(q))
      return { intent: 'saturation' };

    /* Fallback search */
    if (q.length > 2) return { intent: 'search', query: q };

    return { intent: 'unknown' };
  };

  /* ── Response generator ── */
  const respond = (input) => {
    const { intent, id, query } = detect(input);

    switch (intent) {
      case 'greeting': return {
        text: fr
          ? `Bonjour ! 👋 Je suis l'assistant **SoftLibrary**. Je connais vos **${docs.length} documents**, **${conts.length} contenants** et **${empls.length} emplacements**.\n\nPosez-moi n'importe quelle question sur vos archives !`
          : `Hello! 👋 I'm the **SoftLibrary** assistant. I know your **${docs.length} documents**, **${conts.length} containers** and **${empls.length} locations**.\n\nAsk me anything about your archives!`,
        suggestions: fr
          ? ['📊 Tableau de bord', '🔍 Consultations en retard', '📦 Contenants scellés', '⚠️ Alertes']
          : ['📊 Dashboard', '🔍 Overdue consultations', '📦 Sealed containers', '⚠️ Alerts'],
      };

      case 'thanks': return {
        text: fr ? "Avec plaisir ! N'hésitez pas si vous avez d'autres questions. 😊" : "You're welcome! Feel free to ask more questions. 😊",
      };

      case 'help': return {
        text: fr
          ? `Je peux vous aider avec :\n\n• **Recherche** — Tapez un ID (DOC-2025-0142) ou un mot-clé\n• **KPI** — "tableau de bord", "statistiques"\n• **Consultations** — "retards", "consultations en cours"\n• **Contenants** — "contenants scellés", "CNT-006"\n• **Emplacements** — "occupation", "saturation"\n• **Courrier** — "courrier entrant", "urgents"\n• **Mouvements** — "derniers mouvements"\n• **Alertes** — "alertes", "problèmes"\n• **Types** — "cycle de vie", "conservation"`
          : `I can help you with:\n\n• **Search** — Type an ID (DOC-2025-0142) or keyword\n• **KPIs** — "dashboard", "statistics"\n• **Consultations** — "overdue", "in progress"\n• **Containers** — "sealed containers", "CNT-006"\n• **Locations** — "occupancy", "saturation"\n• **Mail** — "incoming mail", "urgent"\n• **Movements** — "recent movements"\n• **Alerts** — "alerts", "issues"\n• **Types** — "lifecycle", "retention"`,
        suggestions: fr
          ? ['📊 KPI', '⚠️ Alertes', '📍 Occupation', '📬 Courrier']
          : ['📊 KPIs', '⚠️ Alerts', '📍 Occupancy', '📬 Mail'],
      };

      case 'kpi': {
        const k = kpi();
        return {
          text: fr
            ? `## 📊 Tableau de bord SoftLibrary\n\n| Indicateur | Valeur |\n|---|---|\n| Documents totaux | **${k.total}** |\n| Actifs / En consultation | **${k.actifs}** |\n| Archivés | **${k.archives}** |\n| Taux d'occupation | **${k.tauxOcc}%** (${fmtN(k.totalOcc)}/${fmtN(k.totalCap)}) |\n| Consultations en cours | **${k.consEnCours}** dont **${k.consRetard}** en retard |\n| Contenants | **${k.totalConts}** (${k.contsScelles} scellés, ${k.contsTransit} en transit) |\n| Courrier en attente | **${k.mailsEnAttente}** dont **${k.mailsUrgents}** urgents |`
            : `## 📊 SoftLibrary Dashboard\n\n| Indicator | Value |\n|---|---|\n| Total documents | **${k.total}** |\n| Active / In consultation | **${k.actifs}** |\n| Archived | **${k.archives}** |\n| Occupancy rate | **${k.tauxOcc}%** (${fmtN(k.totalOcc)}/${fmtN(k.totalCap)}) |\n| Ongoing consultations | **${k.consEnCours}** with **${k.consRetard}** overdue |\n| Containers | **${k.totalConts}** (${k.contsScelles} sealed, ${k.contsTransit} in transit) |\n| Pending mail | **${k.mailsEnAttente}** with **${k.mailsUrgents}** urgent |`,
          suggestions: fr
            ? ['📍 Détail occupation', '🔴 Retards', '📦 Contenants', '📬 Courrier']
            : ['📍 Occupancy detail', '🔴 Overdue', '📦 Containers', '📬 Mail'],
        };
      }

      case 'doc_detail': {
        const doc = docs.find(d => d.id === id);
        if (!doc) return { text: fr ? `❌ Document **${id}** non trouvé dans les ${docs.length} documents.` : `❌ Document **${id}** not found in ${docs.length} documents.` };
        const empl = getEmpl(doc.emplacementId);
        const cont = getCont(doc.contenantId);
        const dt = getDocType(doc.typeId);
        return {
          text: fr
            ? `## 📄 ${doc.titre}\n\n| Champ | Valeur |\n|---|---|\n| Référence | \`${doc.id}\` |\n| Cote | ${doc.cote || '—'} |\n| Type | ${dt?.label || doc.typeId || '—'} |\n| Service | ${doc.service || '—'} |\n| Date | ${doc.dateDocument || '—'} |\n| Statut | **${doc.statut}** |\n| Confidentialité | ${doc.confidentialite || '—'} |\n| Emplacement | ${empl ? `${empl.nom} (${empl.salle})` : '—'} |\n| Contenant | ${cont ? `${cont.label} (${cont.id})` : '—'} |\n| Montant | ${doc.montant ? fmtN(doc.montant) + ' ' + (doc.devise || 'MGA') : '—'} |${doc.lienNumerique ? `\n| Lien GED | ✅ ${doc.lienNumerique} |` : ''}`
            : `## 📄 ${doc.titre}\n\n| Field | Value |\n|---|---|\n| Reference | \`${doc.id}\` |\n| Shelf mark | ${doc.cote || '—'} |\n| Type | ${dt?.label || doc.typeId || '—'} |\n| Department | ${doc.service || '—'} |\n| Date | ${doc.dateDocument || '—'} |\n| Status | **${doc.statut}** |\n| Confidentiality | ${doc.confidentialite || '—'} |\n| Location | ${empl ? `${empl.nom} (${empl.salle})` : '—'} |\n| Container | ${cont ? `${cont.label} (${cont.id})` : '—'} |\n| Amount | ${doc.montant ? fmtN(doc.montant) + ' ' + (doc.devise || 'MGA') : '—'} |${doc.lienNumerique ? `\n| DMS Link | ✅ ${doc.lienNumerique} |` : ''}`,
        };
      }

      case 'cont_detail': {
        const ct = conts.find(c => c.id === id);
        if (!ct) return { text: fr ? `❌ Contenant **${id}** non trouvé.` : `❌ Container **${id}** not found.` };
        const empl = getEmpl(ct.emplacementId);
        const parent = ct.parentId ? getCont(ct.parentId) : null;
        const children = conts.filter(c => c.parentId === ct.id);
        const docsIn = docs.filter(d => d.contenantId === ct.id);
        const pct = ct.capacite > 0 ? ((ct.contenu / ct.capacite) * 100).toFixed(0) : 0;
        return {
          text: fr
            ? `## 📦 ${ct.label}\n\n| Champ | Valeur |\n|---|---|\n| ID | \`${ct.id}\` |\n| Type | ${ct.type} |\n| Statut | **${ct.statut}** |\n| Remplissage | **${ct.contenu}/${ct.capacite}** (${pct}%) |\n| Emplacement | ${empl ? empl.nom : '—'} |\n| Parent | ${parent ? parent.label : '— (racine)'} |\n| Sous-contenants | ${children.length > 0 ? children.map(c => c.label).join(', ') : 'Aucun'} |\n| Documents | ${docsIn.length} document(s) |`
            : `## 📦 ${ct.label}\n\n| Field | Value |\n|---|---|\n| ID | \`${ct.id}\` |\n| Type | ${ct.type} |\n| Status | **${ct.statut}** |\n| Fill rate | **${ct.contenu}/${ct.capacite}** (${pct}%) |\n| Location | ${empl ? empl.nom : '—'} |\n| Parent | ${parent ? parent.label : '— (root)'} |\n| Sub-containers | ${children.length > 0 ? children.map(c => c.label).join(', ') : 'None'} |\n| Documents | ${docsIn.length} document(s) |`,
        };
      }

      case 'consultations': {
        const enCours = consults.filter(c => ['en_cours', 'en_retard', 'retard_critique'].includes(c.statut));
        const retards = consults.filter(c => c.statut === 'en_retard' || c.statut === 'retard_critique');
        const attente = consults.filter(c => ['en_attente', 'validation_n1'].includes(c.statut));
        let text = fr ? `## 📋 Consultations\n\n` : `## 📋 Consultations\n\n`;
        if (retards.length > 0) {
          text += fr ? `### 🔴 En retard (${retards.length})\n\n` : `### 🔴 Overdue (${retards.length})\n\n`;
          retards.forEach(c => {
            const doc = docs.find(d => d.id === c.docId);
            text += `• **${c.docId}** — ${doc?.titre || c.motif}\n  → ${c.demandeur} · ${fr ? 'Retour prévu' : 'Expected'}: ${c.dateRetourPrevue}${c.joursRetard ? ` (**${c.joursRetard}j ${fr ? 'retard' : 'late'}**)` : ''}\n\n`;
          });
        }
        if (enCours.length > 0) {
          text += fr ? `### 🟡 En cours (${enCours.length})\n\n` : `### 🟡 In progress (${enCours.length})\n\n`;
          enCours.filter(c => c.statut === 'en_cours').forEach(c => {
            const doc = docs.find(d => d.id === c.docId);
            text += `• **${c.docId}** — ${doc?.titre || c.motif}\n  → ${c.demandeur} · ${fr ? 'Retour' : 'Return'}: ${c.dateRetourPrevue}\n\n`;
          });
        }
        if (attente.length > 0) {
          text += fr ? `### ⏳ En attente (${attente.length})\n\n` : `### ⏳ Pending (${attente.length})\n\n`;
          attente.forEach(c => {
            text += `• **${c.docId}** — ${c.motif} (${c.demandeur})\n\n`;
          });
        }
        return { text, suggestions: retards.map(r => r.docId).slice(0, 3) };
      }

      case 'courrier': {
        const entrant = mails.filter(m => m.type === 'entrant');
        const sortant = mails.filter(m => m.type === 'sortant');
        const interne = mails.filter(m => m.type === 'interne');
        const urgents = mails.filter(m => m.priorite === 'urgente');
        let text = fr
          ? `## 📬 Courrier\n\n**${mails.length}** courriers au total : **${entrant.length}** entrants, **${sortant.length}** sortants, **${interne.length}** internes\n\n`
          : `## 📬 Mail\n\n**${mails.length}** total: **${entrant.length}** incoming, **${sortant.length}** outgoing, **${interne.length}** internal\n\n`;
        if (urgents.length > 0) {
          text += fr ? `### 🚨 Urgents\n\n` : `### 🚨 Urgent\n\n`;
          urgents.forEach(m => { text += `• **${m.id}** — ${m.objet}\n  → ${m.expediteur} → ${m.destinataire} · ${m.statut}\n\n`; });
        }
        const pending = mails.filter(m => ['en_traitement', 'en_validation'].includes(m.statut));
        if (pending.length > 0) {
          text += fr ? `### ⏳ En traitement\n\n` : `### ⏳ In progress\n\n`;
          pending.forEach(m => { text += `• **${m.id}** — ${m.objet} (${m.affecteA})\n\n`; });
        }
        return { text };
      }

      case 'mouvements': {
        const mvts = mouvements.slice(0, 8);
        let text = fr ? `## 🔄 Derniers mouvements\n\n` : `## 🔄 Recent movements\n\n`;
        mvts.forEach(m => {
          const emoji = m.type === 'deplacement' ? '📍' : m.type === 'association' ? '📎' : m.type === 'scellage' ? '🔒' : m.type === 'creation' ? '🆕' : m.type === 'ouverture' ? '📂' : '📋';
          text += `• ${emoji} **${m.date} ${m.heure}** — ${m.description}\n  → ${m.contenant} · ${m.auteur}${m.de ? ` (${m.de} → ${m.vers})` : ''}\n\n`;
        });
        return { text };
      }

      case 'emplacements': {
        let text = fr ? `## 📍 Emplacements\n\n| Emplacement | Site | Occupation | Taux |\n|---|---|---|---|\n` : `## 📍 Locations\n\n| Location | Site | Occupancy | Rate |\n|---|---|---|---|\n`;
        empls.forEach(e => {
          const pct = e.capacite > 0 ? ((e.occupe / e.capacite) * 100).toFixed(0) : 0;
          const bar = pct >= 90 ? '🔴' : pct >= 70 ? '🟡' : '🟢';
          text += `| ${e.nom} | ${e.site} | ${e.occupe}/${e.capacite} | ${bar} **${pct}%** |\n`;
        });
        return { text, suggestions: fr ? ['🔴 Saturés', '📊 KPI', '📦 Contenants'] : ['🔴 Saturated', '📊 KPIs', '📦 Containers'] };
      }

      case 'contenants': {
        const byType = {};
        conts.forEach(c => { byType[c.type] = (byType[c.type] || 0) + 1; });
        const scelles = conts.filter(c => c.statut === 'scelle');
        const transit = conts.filter(c => c.statut === 'transit');
        let text = fr
          ? `## 📦 Contenants (${conts.length})\n\n**Par type** : ${Object.entries(byType).map(([t, n]) => `${t} (${n})`).join(', ')}\n\n`
          : `## 📦 Containers (${conts.length})\n\n**By type**: ${Object.entries(byType).map(([t, n]) => `${t} (${n})`).join(', ')}\n\n`;
        if (scelles.length) {
          text += fr ? `### 🔒 Scellés (${scelles.length})\n\n` : `### 🔒 Sealed (${scelles.length})\n\n`;
          scelles.forEach(c => { text += `• **${c.id}** — ${c.label} (${c.contenu}/${c.capacite})\n`; });
          text += '\n';
        }
        if (transit.length) {
          text += fr ? `### 🚚 En transit (${transit.length})\n\n` : `### 🚚 In transit (${transit.length})\n\n`;
          transit.forEach(c => { const e = getEmpl(c.emplacementId); text += `• **${c.id}** — ${c.label} → ${e?.nom || '?'}\n`; });
          text += '\n';
        }
        const lowFill = conts.filter(c => c.statut === 'ouvert' && c.capacite > 0 && (c.contenu / c.capacite) < 0.3);
        if (lowFill.length) {
          text += fr ? `### 💡 Peu remplis (<30%)\n\n` : `### 💡 Under-filled (<30%)\n\n`;
          lowFill.forEach(c => { text += `• **${c.id}** — ${c.label}: ${c.contenu}/${c.capacite} (${((c.contenu / c.capacite) * 100).toFixed(0)}%)\n`; });
        }
        return { text };
      }

      case 'types_doc': {
        let text = fr ? `## 📁 Types documentaires & Cycle de vie\n\n| Type | Durée active | Intermédiaire | Sort final |\n|---|---|---|---|\n` : `## 📁 Document types & Lifecycle\n\n| Type | Active period | Intermediate | Final disposition |\n|---|---|---|---|\n`;
        docTypes.forEach(t => {
          text += `| ${t.icon} ${t.label} | ${t.dureeActive} ${fr ? 'ans' : 'yrs'} | ${t.dureeInter} ${fr ? 'ans' : 'yrs'} | ${t.sort} |\n`;
        });
        return { text };
      }

      case 'alertes': {
        const retards = consults.filter(c => c.statut === 'en_retard' || c.statut === 'retard_critique');
        const satures = empls.filter(e => e.capacite > 0 && (e.occupe / e.capacite) > 0.9);
        const urgentMails = mails.filter(m => m.priorite === 'urgente' && m.statut !== 'traite');
        let text = fr ? `## ⚠️ Alertes actives\n\n` : `## ⚠️ Active alerts\n\n`;
        if (retards.length) {
          text += `### 🔴 ${fr ? 'Retards consultation' : 'Consultation delays'} (${retards.length})\n\n`;
          retards.forEach(c => { text += `• **${c.docId}** — ${c.demandeur} (${c.dateRetourPrevue})\n`; });
          text += '\n';
        }
        if (satures.length) {
          text += `### 🟠 ${fr ? 'Emplacements saturés (>90%)' : 'Saturated locations (>90%)'} (${satures.length})\n\n`;
          satures.forEach(e => { text += `• **${e.nom}** — ${e.occupe}/${e.capacite} (${((e.occupe / e.capacite) * 100).toFixed(0)}%)\n`; });
          text += '\n';
        }
        if (urgentMails.length) {
          text += `### 🚨 ${fr ? 'Courrier urgent non traité' : 'Unprocessed urgent mail'} (${urgentMails.length})\n\n`;
          urgentMails.forEach(m => { text += `• **${m.id}** — ${m.objet}\n`; });
          text += '\n';
        }
        if (!retards.length && !satures.length && !urgentMails.length) {
          text += fr ? "✅ Aucune alerte critique détectée !" : "✅ No critical alerts detected!";
        }
        return { text };
      }

      case 'saturation': {
        const sorted = [...empls].sort((a, b) => (b.occupe / b.capacite) - (a.occupe / a.capacite));
        let text = fr ? `## 📍 Occupation des emplacements\n\n` : `## 📍 Location occupancy\n\n`;
        sorted.forEach(e => {
          const pct = e.capacite > 0 ? ((e.occupe / e.capacite) * 100) : 0;
          const bar = '█'.repeat(Math.round(pct / 10)) + '░'.repeat(10 - Math.round(pct / 10));
          const icon = pct >= 90 ? '🔴' : pct >= 70 ? '🟡' : '🟢';
          text += `${icon} **${e.nom}** — ${bar} ${pct.toFixed(0)}% (${fr ? 'reste' : 'left'}: ${e.capacite - e.occupe})\n\n`;
        });
        return { text };
      }

      case 'search': {
        const results = searchDocs(query);
        const cResults = searchConts(query);
        const eResults = searchEmpls(query);
        if (!results.length && !cResults.length && !eResults.length) {
          return { text: fr ? `🔍 Aucun résultat pour « **${query}** ». Essayez un ID (DOC-2025-0142), un titre ou un mot-clé.` : `🔍 No results for "**${query}**". Try an ID (DOC-2025-0142), title or keyword.` };
        }
        let text = fr ? `## 🔍 Résultats pour « ${query} »\n\n` : `## 🔍 Results for "${query}"\n\n`;
        if (results.length) {
          text += fr ? `### 📄 Documents (${results.length})\n\n` : `### 📄 Documents (${results.length})\n\n`;
          results.forEach(d => { text += `• \`${d.id}\` — **${d.titre}** · ${d.service} · ${d.statut}\n`; });
          text += '\n';
        }
        if (cResults.length) {
          text += fr ? `### 📦 Contenants (${cResults.length})\n\n` : `### 📦 Containers (${cResults.length})\n\n`;
          cResults.forEach(c => { text += `• \`${c.id}\` — **${c.label}** · ${c.type} · ${c.statut}\n`; });
          text += '\n';
        }
        if (eResults.length) {
          text += fr ? `### 📍 Emplacements (${eResults.length})\n\n` : `### 📍 Locations (${eResults.length})\n\n`;
          eResults.forEach(e => { text += `• \`${e.id}\` — **${e.nom}** · ${e.site} · ${e.occupe}/${e.capacite}\n`; });
        }
        return { text, suggestions: results.slice(0, 3).map(d => d.id) };
      }

      default: return {
        text: fr
          ? `🤔 Je n'ai pas bien compris. Essayez :\n• Un **ID** de document (DOC-2025-0142)\n• Un **mot-clé** (JIRAMA, facture, RH…)\n• Une **commande** (KPI, alertes, retards…)`
          : `🤔 I didn't quite understand. Try:\n• A document **ID** (DOC-2025-0142)\n• A **keyword** (JIRAMA, invoice, HR…)\n• A **command** (KPIs, alerts, overdue…)`,
        suggestions: fr ? ['📊 KPI', '⚠️ Alertes', '🔍 Aide'] : ['📊 KPIs', '⚠️ Alerts', '🔍 Help'],
      };
    }
  };

  return { respond, kpi };
}

/* ═══════════════════════════════════════════
   MINI MARKDOWN RENDERER
═══════════════════════════════════════════ */
function MiniMD({ text }) {
  if (!text) return null;
  const lines = text.split('\n');
  const elements = [];
  let tableRows = [];
  let inTable = false;

  const renderInline = (str) => {
    const parts = [];
    let remaining = str;
    let key = 0;
    while (remaining) {
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      const codeMatch = remaining.match(/`(.+?)`/);
      const emMatch = remaining.match(/_(.+?)_/);
      const matches = [boldMatch, codeMatch, emMatch].filter(Boolean).sort((a, b) => a.index - b.index);
      if (!matches.length) { parts.push(remaining); break; }
      const first = matches[0];
      if (first.index > 0) parts.push(remaining.slice(0, first.index));
      if (first === boldMatch) parts.push(<strong key={key++} style={{ fontWeight: 700 }}>{first[1]}</strong>);
      else if (first === codeMatch) parts.push(<code key={key++} style={{ background: '#f1f5f9', padding: '1px 5px', borderRadius: 3, fontSize: '0.9em', fontFamily: 'Courier New, monospace' }}>{first[1]}</code>);
      else parts.push(<em key={key++}>{first[1]}</em>);
      remaining = remaining.slice(first.index + first[0].length);
    }
    return parts;
  };

  const flushTable = () => {
    if (!tableRows.length) return;
    const header = tableRows[0];
    const body = tableRows.slice(2); // skip separator
    elements.push(
      <div key={`t-${elements.length}`} style={{ overflowX: 'auto', marginBottom: 10 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5 }}>
          <thead>
            <tr>{header.map((h, i) => <th key={i} style={{ padding: '6px 8px', textAlign: 'left', borderBottom: `2px solid ${C.border}`, fontWeight: 700, color: C.textSec, fontSize: 10.5, whiteSpace: 'nowrap' }}>{renderInline(h.trim())}</th>)}</tr>
          </thead>
          <tbody>
            {body.map((row, ri) => (
              <tr key={ri} style={{ borderBottom: `1px solid ${C.border}` }}>
                {row.map((cell, ci) => <td key={ci} style={{ padding: '5px 8px', fontSize: 11.5 }}>{renderInline(cell.trim())}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
    inTable = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('|')) {
      const cells = line.split('|').slice(1, -1);
      if (cells.every(c => /^[\s-:]+$/.test(c))) { tableRows.push(cells); inTable = true; continue; }
      tableRows.push(cells);
      inTable = true;
      continue;
    }
    if (inTable) flushTable();
    if (line.startsWith('## ')) elements.push(<h3 key={i} style={{ fontSize: 14, fontWeight: 700, margin: '4px 0 8px', color: C.text }}>{renderInline(line.slice(3))}</h3>);
    else if (line.startsWith('### ')) elements.push(<h4 key={i} style={{ fontSize: 12.5, fontWeight: 700, margin: '10px 0 4px', color: C.primary }}>{renderInline(line.slice(4))}</h4>);
    else if (line.startsWith('• ')) elements.push(<div key={i} style={{ paddingLeft: 8, marginBottom: 2, fontSize: 12, lineHeight: 1.6 }}>{renderInline(line)}</div>);
    else if (line.trim() === '') elements.push(<div key={i} style={{ height: 4 }} />);
    else elements.push(<div key={i} style={{ fontSize: 12, lineHeight: 1.6 }}>{renderInline(line)}</div>);
  }
  if (inTable) flushTable();
  return <>{elements}</>;
}

/* ═══════════════════════════════════════════
   CHATBOX COMPONENT
═══════════════════════════════════════════ */
export default function ChatBoxLib({ documents, contenants, emplacements, users, lang }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [pulse, setPulse] = useState(true);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const fr = lang !== 'en';

  const engine = useMemo(() =>
    createEngine(documents, contenants, emplacements, users, SHARED_CONSULTATIONS, SHARED_COURRIERS, lang),
    [documents, contenants, emplacements, users, lang]
  );

  /* Initial message */
  useEffect(() => {
    if (msgs.length === 0) {
      const k = engine.kpi();
      setMsgs([{
        from: 'bot', ts: Date.now(),
        text: fr
          ? `👋 Bonjour ! Je suis **LibAssist**, votre assistant archives.\n\nJe connais **${k.total} documents**, **${k.totalConts} contenants** et **${k.totalMails} courriers**.\n\n${k.consRetard > 0 ? `⚠️ **${k.consRetard} consultation(s) en retard** nécessitent votre attention.\n\n` : ''}Comment puis-je vous aider ?`
          : `👋 Hello! I'm **LibAssist**, your archives assistant.\n\nI know **${k.total} documents**, **${k.totalConts} containers** and **${k.totalMails} mail items**.\n\n${k.consRetard > 0 ? `⚠️ **${k.consRetard} overdue consultation(s)** need your attention.\n\n` : ''}How can I help?`,
        suggestions: fr
          ? ['📊 Tableau de bord', '⚠️ Alertes', '📋 Consultations', '📬 Courrier']
          : ['📊 Dashboard', '⚠️ Alerts', '📋 Consultations', '📬 Mail'],
      }]);
    }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, typing]);

  useEffect(() => {
    if (open) { setPulse(false); inputRef.current?.focus(); }
  }, [open]);

  const send = useCallback((text) => {
    if (!text?.trim()) return;
    const userMsg = { from: 'user', text: text.trim(), ts: Date.now() };
    setMsgs(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const res = engine.respond(text.trim());
      setMsgs(prev => [...prev, { from: 'bot', ts: Date.now(), ...res }]);
      setTyping(false);
    }, 400 + Math.random() * 800);
  }, [engine]);

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } };

  /* ── Styles ── */
  const bubbleBtn = {
    position: 'fixed', bottom: 24, right: 24, zIndex: 999,
    width: 56, height: 56, borderRadius: '50%',
    background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`,
    border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(12,74,110,.35)',
    transition: 'transform .2s, box-shadow .2s',
  };

  return (
    <>
      {/* Pulse animation */}
      <style>{`
        @keyframes chatPulse { 0%,100%{box-shadow:0 4px 20px rgba(12,74,110,.35)} 50%{box-shadow:0 4px 30px rgba(12,74,110,.55),0 0 0 8px rgba(12,74,110,.12)} }
        @keyframes chatSlideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes typingDot { 0%,80%,100%{opacity:.3;transform:scale(.8)} 40%{opacity:1;transform:scale(1)} }
      `}</style>

      {/* ── Chat Window ── */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 90, right: 24, zIndex: 1000,
          width: 420, maxWidth: 'calc(100vw - 32px)', height: 560, maxHeight: 'calc(100vh - 120px)',
          background: '#fff', borderRadius: 16, overflow: 'hidden',
          boxShadow: '0 12px 48px rgba(0,0,0,.15), 0 2px 8px rgba(0,0,0,.08)',
          border: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column',
          animation: 'chatSlideUp .25s ease-out',
          fontFamily: FF,
        }}>
          {/* Header */}
          <div style={{
            padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
            background: `linear-gradient(135deg, ${C.primary}, #0e7490)`, color: '#fff',
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
            }}>📚</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>LibAssist</div>
              <div style={{ fontSize: 10, opacity: .8 }}>
                {fr ? 'Assistant intelligent SoftLibrary' : 'SoftLibrary intelligent assistant'}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80' }} />
              <span style={{ fontSize: 10, opacity: .7 }}>{fr ? 'En ligne' : 'Online'}</span>
            </div>
            <button onClick={() => setOpen(false)}
              style={{ background: 'rgba(255,255,255,.12)', border: 'none', borderRadius: 8,
                width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: '#fff', fontSize: 16, transition: 'background .15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.25)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.12)'}>
              ✕
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} style={{
            flex: 1, overflowY: 'auto', padding: '14px 14px 8px',
            background: '#f8fafc',
          }}>
            {msgs.map((m, i) => (
              <div key={i} style={{
                display: 'flex', flexDirection: 'column',
                alignItems: m.from === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: 10, animation: 'chatSlideUp .2s ease-out',
              }}>
                {m.from === 'bot' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6,
                      background: `linear-gradient(135deg,${C.primary},#0e7490)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, color: '#fff' }}>📚</div>
                    <span style={{ fontSize: 10, color: C.textMut, fontWeight: 600 }}>LibAssist</span>
                  </div>
                )}
                <div style={{
                  maxWidth: '90%', padding: m.from === 'user' ? '10px 14px' : '12px 14px',
                  borderRadius: m.from === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: m.from === 'user'
                    ? `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`
                    : '#fff',
                  color: m.from === 'user' ? '#fff' : C.text,
                  fontSize: 12.5, lineHeight: 1.5,
                  boxShadow: m.from === 'user' ? 'none' : '0 1px 4px rgba(0,0,0,.06)',
                  border: m.from === 'user' ? 'none' : `1px solid ${C.border}`,
                }}>
                  {m.from === 'user' ? m.text : <MiniMD text={m.text} />}
                </div>
                {/* Suggestions */}
                {m.suggestions && m.from === 'bot' && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 6 }}>
                    {m.suggestions.map((s, j) => (
                      <button key={j} onClick={() => send(s)}
                        style={{
                          padding: '5px 10px', borderRadius: 16, fontSize: 11, fontWeight: 600,
                          background: C.primaryLighter, color: C.primary,
                          border: `1px solid ${C.primary}20`, cursor: 'pointer',
                          fontFamily: FF, transition: 'all .12s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = C.primary; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = C.primaryLighter; e.currentTarget.style.color = C.primary; }}>
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {/* Typing indicator */}
            {typing && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, animation: 'chatSlideUp .2s' }}>
                <div style={{ width: 22, height: 22, borderRadius: 6,
                  background: `linear-gradient(135deg,${C.primary},#0e7490)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff' }}>📚</div>
                <div style={{ background: '#fff', padding: '10px 16px', borderRadius: '14px 14px 14px 4px',
                  border: `1px solid ${C.border}`, display: 'flex', gap: 4, alignItems: 'center' }}>
                  {[0, 1, 2].map(d => (
                    <div key={d} style={{
                      width: 7, height: 7, borderRadius: '50%', background: C.textMut,
                      animation: `typingDot 1.2s infinite ${d * 0.2}s`,
                    }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{
            padding: '10px 14px', borderTop: `1px solid ${C.border}`, background: '#fff',
            display: 'flex', gap: 8, alignItems: 'flex-end',
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={fr ? "Posez votre question…" : "Ask your question…"}
              style={{
                flex: 1, padding: '10px 14px', borderRadius: 10, fontSize: 13,
                border: `1.5px solid ${C.border}`, outline: 'none', fontFamily: FF,
                background: C.surface, transition: 'border-color .15s',
              }}
              onFocus={e => e.target.style.borderColor = C.primaryLight}
              onBlur={e => e.target.style.borderColor = C.border}
            />
            <button onClick={() => send(input)}
              disabled={!input.trim()}
              style={{
                width: 38, height: 38, borderRadius: 10, border: 'none', cursor: 'pointer',
                background: input.trim() ? `linear-gradient(135deg,${C.primary},${C.primaryLight})` : C.border,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all .15s', flexShrink: 0,
              }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>

          {/* Footer */}
          <div style={{
            padding: '6px 14px', background: '#f1f5f9', textAlign: 'center',
            fontSize: 9, color: C.textMut,
          }}>
            LibAssist · {fr ? 'Données en temps réel' : 'Real-time data'} · {documents?.length || 0} docs · {contenants?.length || 0} {fr ? 'contenants' : 'containers'}
          </div>
        </div>
      )}

      {/* ── FAB Button ── */}
      <button
        onClick={() => setOpen(p => !p)}
        style={{
          ...bubbleBtn,
          animation: pulse ? 'chatPulse 2.5s ease-in-out infinite' : 'none',
          transform: open ? 'scale(0.9)' : 'scale(1)',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = open ? 'scale(0.9)' : 'scale(1)'; }}>
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <line x1="9" y1="10" x2="15" y2="10" /><line x1="12" y1="7" x2="12" y2="13" />
          </svg>
        )}
      </button>
    </>
  );
}
