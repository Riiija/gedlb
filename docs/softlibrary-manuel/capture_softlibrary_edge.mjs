import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const ROOT = "D:\\git\\gedlb";
const OUT_DIR = join(ROOT, "docs", "softlibrary-manuel", "captures");
const USER_DATA_DIR = join(ROOT, ".codex-edge-softlibrary-doc-profile");
const PORT = 9335;
const BASE = "http://localhost:3000";

await mkdir(OUT_DIR, { recursive: true });

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function waitForPageTarget() {
  const listUrl = `http://127.0.0.1:${PORT}/json/list`;
  for (let i = 0; i < 100; i += 1) {
    try {
      const targets = await fetchJson(listUrl);
      const page = targets.find((item) => item.type === "page" && item.webSocketDebuggerUrl);
      if (page) return page;
    } catch {
      // Edge is still starting.
    }
    await delay(250);
  }
  throw new Error("Edge page target did not become available.");
}

class Cdp {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.nextId = 1;
    this.pending = new Map();
  }

  async open() {
    await new Promise((resolve, reject) => {
      this.ws.addEventListener("open", resolve, { once: true });
      this.ws.addEventListener("error", reject, { once: true });
    });
    this.ws.addEventListener("message", (event) => {
      const msg = JSON.parse(event.data);
      if (!msg.id || !this.pending.has(msg.id)) return;
      const { resolve, reject } = this.pending.get(msg.id);
      this.pending.delete(msg.id);
      if (msg.error) reject(new Error(JSON.stringify(msg.error)));
      else resolve(msg.result || {});
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      setTimeout(() => {
        if (!this.pending.has(id)) return;
        this.pending.delete(id);
        reject(new Error(`CDP timeout: ${method}`));
      }, 30000);
    });
  }

  close() {
    try {
      this.ws.close();
    } catch {}
  }
}

const edge = spawn(EDGE, [
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${USER_DATA_DIR}`,
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--window-size=1365,768",
  `${BASE}/login`,
], { stdio: "ignore", windowsHide: true });

let cdp;
try {
  const pageTarget = await waitForPageTarget();
  cdp = new Cdp(pageTarget.webSocketDebuggerUrl);
  await cdp.open();
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("DOM.enable");
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: 1365,
    height: 768,
    deviceScaleFactor: 1,
    mobile: false,
  });

  async function evalPage(expression, awaitPromise = true) {
    const result = await cdp.send("Runtime.evaluate", {
      expression,
      awaitPromise,
      returnByValue: true,
    });
    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.text || "Runtime evaluation failed");
    }
    return result.result?.value;
  }

  async function bodyText() {
    return evalPage(`document.body ? document.body.innerText : ""`);
  }

  async function waitForAnyText(texts, timeout = 25000) {
    const targets = Array.isArray(texts) ? texts : [texts];
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const found = await evalPage(`
        (() => {
          const txt = document.body ? document.body.innerText : "";
          return ${JSON.stringify(targets)}.some((t) => txt.includes(t));
        })()
      `);
      if (found) return true;
      await delay(250);
    }
    throw new Error(`Text not found: ${targets.join(" | ")}`);
  }

  async function clickText(text, scope = "all") {
    await waitForAnyText(text, 20000);
    const ok = await evalPage(`
      (() => {
        const text = ${JSON.stringify(text)};
        const isLeft = (el) => {
          const r = el.getBoundingClientRect();
          return r.left < 360 && r.width > 0 && r.height > 0;
        };
        const root = ${JSON.stringify(scope)} === "main" ? (document.querySelector("main") || document.body) : document.body;
        const candidates = [...root.querySelectorAll('button,[role="button"],a,tr,div[tabindex]')]
          .filter((el) => (el.innerText || el.textContent || "").replace(/\\s+/g, " ").trim().includes(text));
        const ordered = ${JSON.stringify(scope)} === "nav" ? candidates.filter(isLeft).concat(candidates) : candidates;
        const target = ordered[0];
        if (!target) return false;
        target.scrollIntoView({ block: "center", inline: "center" });
        target.click();
        return true;
      })()
    `);
    if (!ok) throw new Error(`Clickable text not found: ${text}`);
    await delay(1000);
  }

  async function clickFirst(selector) {
    const ok = await evalPage(`
      (() => {
        const target = document.querySelector(${JSON.stringify(selector)});
        if (!target) return false;
        target.scrollIntoView({ block: "center", inline: "center" });
        target.click();
        return true;
      })()
    `);
    await delay(900);
    return ok;
  }

  async function closeModal() {
    await evalPage(`
      (() => {
        const buttons = [...document.querySelectorAll('button')];
        const byText = buttons.find((b) => ['Annuler','Fermer'].includes((b.innerText || '').trim()));
        if (byText) { byText.click(); return true; }
        const close = buttons.find((b) => (b.title || '').toLowerCase().includes('fermer')) || buttons[buttons.length - 1];
        if (close) { close.click(); return true; }
        return false;
      })()
    `);
    await delay(800);
  }

  async function hideAssistantPanel() {
    await evalPage(`
      (() => {
        for (const el of document.querySelectorAll('body *')) {
          const txt = el.innerText || "";
          const st = getComputedStyle(el);
          if (st.position === "fixed" && txt.includes("LibAssist")) {
            el.style.display = "none";
          }
        }
        return true;
      })()
    `).catch(() => false);
  }

  async function shot(name) {
    await delay(450);
    await hideAssistantPanel();
    const result = await cdp.send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: false,
      fromSurface: true,
    });
    const file = join(OUT_DIR, `${name}.png`);
    await writeFile(file, Buffer.from(result.data, "base64"));
    console.log(file);
  }

  async function safe(label, fn) {
    try {
      await fn();
    } catch (error) {
      console.log(`SKIP ${label}: ${error.message}`);
    }
  }

  async function login() {
    await cdp.send("Page.navigate", { url: `${BASE}/login` });
    await waitForAnyText(["Connexion", "Login"], 30000);
    const submitted = await evalPage(`
      (() => {
        const user = {
          id: "U000",
          nom: "Administrateur Global",
          role: "Super Admin",
          systemRole: "superadmin",
          init: "AG",
          email: "admin@softwell.mg",
          password: "admin@2025",
          apps: ["softdocs", "epaiement", "softlibrary", "softsign"]
        };
        localStorage.setItem("softdocs_auth", JSON.stringify(user));
        localStorage.setItem("softdocs_currentApp", "home");
        return { sessionSeeded: true };
      })()
    `);
    await cdp.send("Page.navigate", { url: `${BASE}/backoffice` });
    try {
      await waitForAnyText(["SoftLibrary", "SoftSign", "SoftDocs"], 30000);
    } catch {
      const txt = (await bodyText()).slice(0, 1800);
      throw new Error(`Login did not reach launcher. Submitted=${JSON.stringify(submitted)} Body=${txt}`);
    }
  }

  await login();
  await clickText("SoftLibrary");
  await waitForAnyText(["Documents actifs", "Repartition", "Répartition", "Documents récents", "Documents recents"], 30000);
  await shot("01_tableau_bord_softlibrary");

  await clickText("Documents", "nav");
  await waitForAnyText(["Recherche par titre", "Nouveau document", "Scanner"], 25000);
  await shot("02_documents_liste");
  await safe("documents recherche avancee", async () => {
    await clickText("Recherche avancee", "main").catch(() => clickText("Recherche avancée", "main"));
    await waitForAnyText(["Plein texte", "Critères", "Criteres"], 12000);
    await shot("02b_documents_recherche_avancee");
  });
  await safe("documents nouveau", async () => {
    await clickText("Nouveau document", "main");
    await waitForAnyText(["Titre", "Date du document"], 12000);
    await shot("02c_document_formulaire");
    await closeModal();
  });
  await safe("documents scan", async () => {
    await clickText("Scanner", "main");
    await waitForAnyText(["Scanner un document", "Code-barres", "reference"], 12000);
    await shot("02d_documents_scan");
    await closeModal();
  });
  await safe("documents detail", async () => {
    await clickFirst('main table tbody button[title="Détail"], main table tbody button[title="Detail"]');
    await waitForAnyText(["Fiche documentaire", "Informations", "Versions"], 12000);
    await shot("02e_document_detail");
    await safe("document statut", async () => {
      await clickText("Statut", "main");
      await waitForAnyText(["Transitions", "Motif du changement"], 12000);
      await shot("02f_document_changement_statut");
      await closeModal();
    });
    await closeModal();
  });

  await clickText("Contenants", "nav");
  await waitForAnyText(["Nouveau contenant", "Rechercher ID"], 25000);
  await shot("03_contenants_liste");
  await safe("contenant formulaire", async () => {
    await clickText("Nouveau contenant", "main");
    await waitForAnyText(["Libelle", "Libellé", "Capacite", "Capacité"], 12000);
    await shot("03b_contenant_formulaire");
    await closeModal();
  });
  await safe("contenant detail", async () => {
    await clickFirst('main table tbody button[title="Voir"], main table tbody button[title="Détail"], main table tbody button[title="Detail"]');
    await waitForAnyText(["Détail contenant", "Detail contenant", "Associer"], 12000);
    await shot("03c_contenant_detail");
    await closeModal();
  });
  await safe("contenant arbre", async () => {
    await clickText("Arborescence", "main").catch(() => clickText("Arbre", "main"));
    await shot("03d_contenants_arborescence");
  });
  await safe("contenant capacite", async () => {
    await clickText("Capacite", "main").catch(() => clickText("Capacité", "main"));
    await shot("03e_contenants_capacite");
  });
  await safe("contenant mouvements", async () => {
    await clickText("Mouvements", "main");
    await shot("03f_contenants_mouvements");
  });

  await clickText("Emplacements", "nav");
  await waitForAnyText(["Affectation auto", "Ajouter", "Inventaire"], 25000);
  await shot("04_emplacements_arborescence");
  await safe("emplacements plan", async () => {
    await clickText("Plan", "main");
    await shot("04b_emplacements_plan");
  });
  await safe("emplacements capacite", async () => {
    await clickText("Capacite", "main").catch(() => clickText("Capacité", "main"));
    await shot("04c_emplacements_capacite");
  });
  await safe("emplacements affectation", async () => {
    await clickText("Affectation auto", "main");
    await waitForAnyText(["Stratégie", "Strategie", "Nombre de documents"], 12000);
    await shot("04d_emplacements_affectation_auto");
    await closeModal();
  });
  await safe("emplacements ajouter", async () => {
    await clickText("Ajouter", "main");
    await waitForAnyText(["Nom de l'emplacement", "Capacité", "Capacite"], 12000);
    await shot("04e_emplacement_formulaire");
    await closeModal();
  });

  await clickText("Mouvements", "nav");
  await waitForAnyText(["Mouvements", "Classement", "Déplacer", "Deplacer"], 25000);
  await shot("05_mouvements_deplacer");
  await safe("mouvements classement", async () => { await clickText("Classement", "main"); await shot("05b_mouvements_classement"); });
  await safe("mouvements affectation", async () => { await clickText("Affectation", "main"); await shot("05c_mouvements_affectation"); });
  await safe("mouvements historique", async () => { await clickText("Historique", "main"); await shot("05d_mouvements_historique"); });
  await safe("mouvements structure", async () => { await clickText("Structure", "main"); await shot("05e_mouvements_structure"); });

  await clickText("Consultations", "nav");
  await waitForAnyText(["Consultations", "Nouvelle demande"], 25000);
  await shot("06_consultations_liste");
  await safe("consultation formulaire", async () => {
    await clickText("Nouvelle demande", "main");
    await waitForAnyText(["Document demandé", "Document demande", "Motif"], 12000);
    await shot("06b_consultation_formulaire");
    await closeModal();
  });
  await safe("consultation scan", async () => {
    await clickText("Scan", "main");
    await waitForAnyText(["Scanner", "CONS-", "DOC-"], 12000);
    await shot("06c_consultation_scan");
    await closeModal();
  });

  await clickText("Courrier", "nav");
  await waitForAnyText(["Courrier", "Flux", "Enregistrer"], 25000);
  await shot("07_courrier_liste");
  await safe("courrier scan", async () => {
    await clickText("Scan", "main");
    await waitForAnyText(["Scan", "OCR", "Lancer"], 12000);
    await shot("07b_courrier_scan_ocr");
    await closeModal();
  });
  await safe("courrier nouveau", async () => {
    await clickText("Enregistrer", "main");
    await clickText("Courrier entrant", "main");
    await waitForAnyText(["Objet", "Expéditeur", "Expediteur"], 12000);
    await shot("07c_courrier_formulaire");
    await closeModal();
  });

  await clickText("Inventaire", "nav");
  await waitForAnyText(["Inventaire physique", "Nouvelle campagne"], 25000);
  await shot("08_inventaire_campagnes");
  await safe("inventaire anomalies", async () => { await clickText("Anomalies", "main"); await shot("08b_inventaire_anomalies"); });
  await safe("inventaire nouvelle campagne", async () => {
    await clickText("Nouvelle campagne", "main");
    await waitForAnyText(["Nom de la campagne", "Sites"], 12000);
    await shot("08c_inventaire_formulaire_campagne");
    await closeModal();
  });

  await clickText("Cycle", "nav");
  await waitForAnyText(["Cycle de Vie", "Conservation", "Gel"], 25000);
  await shot("09_cycle_vie_dashboard");
  await safe("cycle regles", async () => { await clickText("Règles", "main").catch(() => clickText("Regles", "main")); await shot("09b_cycle_regles_dua"); });
  await safe("cycle calendrier", async () => { await clickText("Calendrier", "main"); await shot("09c_cycle_calendrier"); });
  await safe("cycle eliminations", async () => { await clickText("liminations", "main"); await shot("09d_cycle_eliminations"); });
  await safe("cycle gels", async () => { await clickText("Gels", "main"); await shot("09e_cycle_gels_legaux"); });
  await safe("cycle proposition", async () => {
    await clickText("Proposition", "main");
    await waitForAnyText(["Titre", "Nb documents", "Motif"], 12000);
    await shot("09f_cycle_formulaire_elimination");
    await closeModal();
  });

  await clickText("Vision", "nav");
  await waitForAnyText(["Vision", "Total documents", "Occupation"], 25000);
  await shot("10_vision_synthetique");

  await clickText("Gestion documentaire", "nav");
  await waitForAnyText(["Gestion documentaire", "Qualité", "Qualite", "Couverture"], 25000);
  await shot("11_gestion_documentaire");

  await clickText("GED", "nav").catch(() => clickText("Intégration", "nav").catch(() => clickText("Integration", "nav")));
  await waitForAnyText(["Intégration GED", "SoftDocs", "Liaison"], 25000);
  await shot("12_integration_ged_dashboard");
  await safe("ged liaison", async () => { await clickText("Liaison", "main"); await shot("12b_integration_ged_liaison"); });
  await safe("ged numerisation", async () => { await clickText("Numérisation", "main").catch(() => clickText("Numerisation", "main")); await shot("12c_integration_ged_numerisation"); });
  await safe("ged incoherences", async () => { await clickText("Incoh", "main"); await shot("12d_integration_ged_incoherences"); });
  await safe("ged recherche", async () => { await clickText("Recherche", "main"); await shot("12e_integration_ged_recherche"); });
  await safe("ged versement", async () => { await clickText("Versement", "main"); await shot("12f_integration_ged_versement"); });

  await clickText("MFP", "nav");
  await waitForAnyText(["MFP", "Appareils", "Scans"], 25000);
  await shot("13_mfp_dashboard");
  await safe("mfp appareils", async () => { await clickText("Appareils", "main"); await shot("13b_mfp_appareils"); });
  await safe("mfp scans", async () => { await clickText("Boîte de scan", "main").catch(() => clickText("scan", "main")); await shot("13c_mfp_boite_scan"); });
  await safe("mfp journal", async () => { await clickText("Journal", "main"); await shot("13d_mfp_journal"); });
  await safe("mfp parametres", async () => { await clickText("Param", "main"); await shot("13e_mfp_parametres"); });

  await clickText("Administration", "nav");
  await waitForAnyText(["Administration", "Types documentaires"], 25000);
  await shot("14_administration_accueil");
  await safe("admin types", async () => { await clickText("Types documentaires", "main"); await waitForAnyText(["Nouveau type", "DUA"], 12000); await shot("14b_admin_types_documentaires"); await clickText("Administration", "main"); });
  await safe("admin workflows", async () => { await clickText("Param", "main"); await waitForAnyText(["Nouveau workflow", "workflow"], 12000); await shot("14c_admin_workflows"); await clickText("Administration", "main"); });
  await safe("admin conservation", async () => { await clickText("Conservation", "main"); await waitForAnyText(["DUA", "Sort final"], 12000); await shot("14d_admin_conservation_dua"); });
} finally {
  if (cdp) cdp.close();
  edge.kill();
}

process.exit(0);
