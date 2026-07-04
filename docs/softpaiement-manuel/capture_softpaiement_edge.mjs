import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const ROOT = "D:\\git\\gedlb";
const OUT_DIR = join(ROOT, "docs", "softpaiement-manuel", "captures");
const USER_DATA_DIR = join(ROOT, ".codex-edge-softpaiement-doc-profile");
const PORT = 9337;
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
        const candidates = [...root.querySelectorAll('button,[role="button"],a,tr,label,div[tabindex]')]
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

  async function selectByText(selector, text) {
    const ok = await evalPage(`
      (() => {
        const sel = document.querySelector(${JSON.stringify(selector)});
        if (!sel) return false;
        const opt = [...sel.options].find((o) => (o.textContent || "").includes(${JSON.stringify(text)}));
        if (!opt) return false;
        sel.value = opt.value;
        sel.dispatchEvent(new Event("change", { bubbles: true }));
        return true;
      })()
    `);
    await delay(700);
    return ok;
  }

  async function closeModal() {
    await evalPage(`
      (() => {
        const buttons = [...document.querySelectorAll('button')];
        const byText = buttons.find((b) => ['Annuler','Fermer'].includes((b.innerText || '').trim()));
        if (byText) { byText.click(); return true; }
        const close = buttons.find((b) => (b.innerText || '').trim() === 'x' || (b.innerText || '').trim() === '×');
        if (close) { close.click(); return true; }
        return false;
      })()
    `).catch(() => false);
    await delay(800);
  }

  async function hideAssistantPanel() {
    await evalPage(`
      (() => {
        for (const el of document.querySelectorAll('body *')) {
          const txt = el.innerText || "";
          const st = getComputedStyle(el);
          if (st.position === "fixed" && (
            txt.includes("E-paiement IA") ||
            txt.includes("SoftDocs IA") ||
            txt.includes("Assistant Soft E-paiement") ||
            txt.includes("Comment puis-je vous aider")
          )) {
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

  async function seedSession() {
    await cdp.send("Page.navigate", { url: `${BASE}/login` });
    await waitForAnyText(["Connexion", "Login"], 30000);
    await evalPage(`
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
        localStorage.setItem("softdocs_currentApp", "epaiement");
        localStorage.setItem("softdocs_sidebarOpen", "true");
        return true;
      })()
    `);
    await cdp.send("Page.navigate", { url: `${BASE}/backoffice` });
    await waitForAnyText(["Soft E-paiement", "Tableau de bord", "Liquidations"], 30000);
  }

  await seedSession();
  await shot("01_tableau_bord_softpaiement");

  await clickText("Liquidations", "nav");
  await waitForAnyText(["Liquidations", "Interface TOMPRO", "Nouvelle liquidation"], 25000);
  await shot("02_liquidations_liste");
  await safe("liquidation formulaire", async () => {
    await clickText("Nouvelle liquidation", "main");
    await waitForAnyText(["Information de base", "Document lié", "Imputations"], 12000);
    await shot("02b_liquidation_formulaire");
    await clickText("Pièces", "main");
    await waitForAnyText(["Pièces Justificatives", "Ajouter des fichiers"], 12000);
    await shot("02c_liquidation_pieces_justificatives");
    await closeModal();
  });
  await safe("recuperer tompro", async () => {
    await clickText("Récupérer TOMPRO", "main").catch(() => clickText("Recuperer TOMPRO", "main"));
    await waitForAnyText(["Synchronisation TOMPRO", "Période", "Synchroniser"], 12000);
    await shot("02d_liquidation_recuperer_tompro");
    await closeModal();
  });
  await safe("importer fichier", async () => {
    await clickText("Importer fichier", "main");
    await waitForAnyText(["Importer fichier", "Cliquez ou glissez", ".xlsx"], 12000);
    await shot("02e_liquidation_import_excel");
    await closeModal();
  });
  await safe("recuperer softdocs", async () => {
    await clickText("Récup SoftDocs", "main").catch(() => clickText("Recup SoftDocs", "main"));
    await waitForAnyText(["Récupérer depuis SoftDocs", "Documents SoftDocs", "éligible"], 12000);
    await shot("02f_liquidation_recuperer_softdocs");
    await closeModal();
  });

  await clickText("Paiements", "nav");
  await clickText("Liste des paiements", "nav");
  await waitForAnyText(["Liste des paiements", "Recuperer liquidation", "Payer"], 25000);
  await shot("03_liste_paiements");
  await safe("recuperer liquidations paiements", async () => {
    await clickText("Recuperer liquidation", "main").catch(() => clickText("Récupérer liquidation", "main"));
    await waitForAnyText(["Recuperer liquidations", "liquidations cloturees", "Importer"], 12000);
    await shot("03b_paiements_recuperer_liquidations");
    await closeModal();
  });
  await safe("selection et paiement", async () => {
    await clickFirst('main table tbody input[type="checkbox"]');
    await waitForAnyText(["Payer"], 12000);
    await shot("03c_paiements_selection_payer");
    await clickText("Payer", "main");
    await waitForAnyText(["Choisir un operateur", "Vanilla Pay", "FAI Direct"], 12000);
    await shot("03d_paiements_choisir_operateur");
    await clickText("MVOLA", "main").catch(() => clickText("Mvola", "main"));
    await clickText("Vanilla Pay", "main");
    await clickText("Continuer", "main");
    await waitForAnyText(["Confirmation du paiement", "Confirmer le paiement"], 12000);
    await shot("03e_paiements_confirmation");
    await closeModal();
  });

  await clickText("Paiements", "nav");
  await clickText("Génération fichier banque", "nav").catch(() => clickText("Generation fichier banque", "nav"));
  await waitForAnyText(["Paiements XML", "Documents éligibles", "Schéma"], 25000);
  await shot("04_generation_fichier_banque");
  await safe("schema xml", async () => {
    await clickText("Schéma", "main").catch(() => clickText("Schema", "main"));
    await waitForAnyText(["Schéma XML", "Banque", "Nature de remise"], 12000);
    await shot("04b_generation_schema_xml");
    await closeModal();
  });
  await safe("generation xml confirmation", async () => {
    await clickFirst('main table tbody input[type="checkbox"]');
    await clickText("Générer XML", "main").catch(() => clickText("Generer XML", "main"));
    await waitForAnyText(["Confirmer la génération XML", "Générer & Télécharger"], 12000);
    await shot("04c_generation_confirmation_xml");
    await closeModal();
  });

  await clickText("Paramétrage", "nav").catch(() => clickText("Parametrage", "nav"));
  await clickText("Nature de remise", "nav");
  await waitForAnyText(["Configuration des natures", "Ajouter un projet"], 25000);
  await shot("05_nature_remise");
  await safe("nature remise modal", async () => {
    await clickFirst('main button[title="Modifier"], main button:nth-of-type(1)');
    await waitForAnyText(["Natures de remises disponibles", "Tout cocher", "Enregistrer"], 12000);
    await shot("05b_nature_remise_modal");
    await closeModal();
  });

  await clickText("Paramétrage", "nav").catch(() => clickText("Parametrage", "nav"));
  await clickText("Balise XML", "nav");
  await waitForAnyText(["Configuration Balises XML", "Ajouter balise", "Aperçu XML"], 25000);
  await shot("06_balise_xml");
  await safe("balise ajouter", async () => {
    await clickText("Ajouter balise", "main");
    await waitForAnyText(["Nouvelle balise XML", "Balise XML", "Exemple"], 12000);
    await shot("06b_balise_xml_ajouter");
    await closeModal();
  });

  await clickText("Paramétrage", "nav").catch(() => clickText("Parametrage", "nav"));
  await clickText("Mappage XML", "nav");
  await waitForAnyText(["Mappage Fichier XML", "Ajouter un mappage", "Compte débiteur"], 25000);
  await shot("07_mappage_xml_banques");
  await safe("mappage modal", async () => {
    await clickText("Ajouter un mappage", "main");
    await waitForAnyText(["Nouveau mappage banque", "Compte débiteur", "Devise"], 12000);
    await shot("07b_mappage_xml_modal");
    await closeModal();
  });

  const reports = [
    ["Tableau de bord KPI", "08_etat_kpi"],
    ["État des liquidations", "09_etat_liquidations"],
    ["État des générations", "10_etat_generations"],
    ["État des paiements", "11_etat_paiements"],
    ["État par fournisseur", "12_etat_fournisseurs"],
    ["État projets", "13_etat_projets_sites"],
  ];
  for (const [label, name] of reports) {
    await safe(`rapport ${label}`, async () => {
      await clickText("États", "nav").catch(() => clickText("Etats", "nav"));
      await clickText(label, "nav");
      await delay(1200);
      await shot(name);
    });
  }

  await clickText("Utilisateurs", "nav");
  await waitForAnyText(["Utilisateurs Soft E-paiement", "Nouvel utilisateur", "Gestion des accès"], 25000);
  await shot("14_utilisateurs_softpaiement");
  await safe("utilisateur modal", async () => {
    await clickText("Nouvel utilisateur", "main");
    await waitForAnyText(["Nouvel utilisateur E-paiement", "Général", "Soft E-paiement"], 12000);
    await shot("14b_utilisateur_formulaire_general");
    await clickText("Soft E-paiement", "main");
    await waitForAnyText(["Rôle E-paiement", "Droits Soft E-paiement"], 12000);
    await shot("14c_utilisateur_droits_softpaiement");
    await clickText("Projets", "main");
    await waitForAnyText(["Accès aux projets et sites"], 12000);
    await shot("14d_utilisateur_projets_sites");
    await closeModal();
  });
} finally {
  if (cdp) cdp.close();
  edge.kill();
}

process.exit(0);
