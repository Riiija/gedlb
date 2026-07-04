import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const ROOT = "D:\\git\\gedlb";
const OUT_DIR = join(ROOT, "docs", "softpaiement-manuel", "captures");
const USER_DATA_DIR = join(ROOT, ".codex-edge-softpaiement-doc-profile-remaining");
const PORT = 9338;
const BASE = "http://localhost:3000";

await mkdir(OUT_DIR, { recursive: true });
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function waitForPageTarget() {
  for (let i = 0; i < 100; i += 1) {
    try {
      const targets = await fetchJson(`http://127.0.0.1:${PORT}/json/list`);
      const page = targets.find((item) => item.type === "page" && item.webSocketDebuggerUrl);
      if (page) return page;
    } catch {}
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
      }, 25000);
    });
  }
  close() {
    try { this.ws.close(); } catch {}
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
  await cdp.send("Emulation.setDeviceMetricsOverride", { width: 1365, height: 768, deviceScaleFactor: 1, mobile: false });

  async function evalPage(expression, awaitPromise = true) {
    const result = await cdp.send("Runtime.evaluate", { expression, awaitPromise, returnByValue: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || "Runtime evaluation failed");
    return result.result?.value;
  }

  async function waitForText(texts, timeout = 16000) {
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

  async function clickContains(needles, scope = "all") {
    const list = Array.isArray(needles) ? needles : [needles];
    const ok = await evalPage(`
      (() => {
        const needles = ${JSON.stringify(list.map((x) => x.toLowerCase()))};
        const root = ${JSON.stringify(scope)} === "main" ? (document.querySelector("main") || document.body)
          : ${JSON.stringify(scope)} === "nav" ? (document.querySelector("nav") || document.body)
          : document.body;
        const candidates = [...root.querySelectorAll('button,[role="button"],a,label,tr,div[tabindex]')];
        const target = candidates.find((el) => {
          const text = (el.innerText || el.textContent || "").replace(/\\s+/g, " ").trim().toLowerCase();
          return needles.some((n) => text.includes(n));
        });
        if (!target) return false;
        target.scrollIntoView({ block: "center", inline: "center" });
        target.click();
        return true;
      })()
    `);
    if (!ok) throw new Error(`Clickable text not found: ${list.join(" | ")}`);
    await delay(950);
  }

  async function clickSelector(selector) {
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
        const cancel = buttons.find((b) => ['Annuler','Fermer'].includes((b.innerText || '').trim()));
        if (cancel) { cancel.click(); return true; }
        const close = buttons.find((b) => (b.innerText || '').trim() === '×');
        if (close) { close.click(); return true; }
        return false;
      })()
    `).catch(() => false);
    await delay(700);
  }

  async function hideAssistantPanel() {
    await evalPage(`
      (() => {
        for (const el of document.querySelectorAll('body *')) {
          const txt = el.innerText || "";
          const st = getComputedStyle(el);
          if (st.position === "fixed" && (txt.includes("E-paiement IA") || txt.includes("SoftDocs IA") || txt.includes("Assistant"))) {
            el.style.display = "none";
          }
        }
      })()
    `).catch(() => false);
  }

  async function shot(name) {
    await delay(450);
    await hideAssistantPanel();
    const result = await cdp.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false, fromSurface: true });
    const file = join(OUT_DIR, `${name}.png`);
    await writeFile(file, Buffer.from(result.data, "base64"));
    console.log(file);
  }

  async function seed() {
    await cdp.send("Page.navigate", { url: `${BASE}/login` });
    await waitForText(["Connexion", "Login"], 30000);
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
    await waitForText(["Soft E-paiement", "Tableau de bord"], 30000);
  }

  await seed();

  await clickContains("paiements", "nav");
  await clickContains("liste des paiements", "nav");
  await waitForText(["Liste des paiements", "Payer"]);
  await clickSelector('main table tbody tr:nth-child(2) input[type="checkbox"]');
  await shot("03c_paiements_selection_payer");
  await clickContains("payer", "main");
  await waitForText(["Choisir un operateur", "Vanilla Pay", "FAI Direct"]);
  await shot("03d_paiements_choisir_operateur");
  await clickContains(["mvola", "mvola"], "main");
  await clickContains("vanilla pay", "main");
  await clickContains("continuer", "main");
  await waitForText(["Confirmation du paiement", "Confirmer le paiement"]);
  await shot("03e_paiements_confirmation");
  await closeModal();

  const reports = [
    [["tat liquidations"], "09_etat_liquidations", ["État liquidations", "Etat liquidations"]],
    [["tat g", "generations"], "10_etat_generations", ["État générations", "Etat generations"]],
    [["tat paiements"], "11_etat_paiements", ["État paiements", "Etat paiements"]],
    [["tat fournisseurs"], "12_etat_fournisseurs", ["État fournisseurs", "Etat fournisseurs"]],
    [["tat projets"], "13_etat_projets_sites", ["État projets", "Etat projets"]],
  ];
  for (const [needles, name, visible] of reports) {
    await clickContains(["tats & rapports", "etats & rapports", "rapports"], "nav");
    await clickContains(needles, "nav");
    await waitForText(visible.concat(["État", "Etat"]), 12000);
    await shot(name);
  }

  await clickContains("utilisateurs", "nav");
  await waitForText(["Utilisateurs Soft E-paiement", "Nouvel utilisateur"]);
  await shot("14_utilisateurs_softpaiement");
  await clickContains("nouvel utilisateur", "main");
  await waitForText(["Nouvel utilisateur E-paiement", "Général", "General"]);
  await shot("14b_utilisateur_formulaire_general");
  await clickContains("soft e-paiement", "main");
  await waitForText(["Rôle E-paiement", "Droits Soft E-paiement", "Role E-paiement"]);
  await shot("14c_utilisateur_droits_softpaiement");
  await clickContains(["projets", "sites"], "main");
  await waitForText(["Accès aux projets et sites", "Acces aux projets"]);
  await shot("14d_utilisateur_projets_sites");
} finally {
  if (cdp) cdp.close();
  edge.kill();
}

process.exit(0);
