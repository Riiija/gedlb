import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const ROOT = "D:\\git\\gedlb";
const OUT_DIR = join(ROOT, "docs", "softsign-manuel", "captures");
const USER_DATA_DIR = join(ROOT, ".codex-edge-softsign-doc-profile");
const PORT = 9334;
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
  for (let i = 0; i < 80; i += 1) {
    try {
      const targets = await fetchJson(listUrl);
      const page = targets.find((item) => item.type === "page" && item.webSocketDebuggerUrl);
      if (page) return page;
    } catch {
      // Retry until Edge has opened the first tab.
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
    this.events = [];
  }

  async open() {
    await new Promise((resolve, reject) => {
      this.ws.addEventListener("open", resolve, { once: true });
      this.ws.addEventListener("error", reject, { once: true });
    });
    this.ws.addEventListener("message", (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(JSON.stringify(msg.error)));
        else resolve(msg.result || {});
      } else if (msg.method) {
        this.events.push(msg);
      }
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`CDP timeout: ${method}`));
        }
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
  await cdp.send("Page.navigate", { url: `${BASE}/login` });
  await delay(2500);

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

  async function waitForText(text, timeout = 20000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const found = await evalPage(`document.body && document.body.innerText.includes(${JSON.stringify(text)})`);
      if (found) return true;
      await delay(250);
    }
    throw new Error(`Text not found: ${text}`);
  }

  async function clickButtonText(text) {
    await waitForText(text, 20000);
    const ok = await evalPage(`
      (() => {
        const target = [...document.querySelectorAll('button,[role="button"],a')]
          .find((el) => (el.innerText || el.textContent || '').replace(/\\s+/g, ' ').trim().includes(${JSON.stringify(text)}));
        if (!target) return false;
        target.scrollIntoView({ block: 'center', inline: 'center' });
        target.click();
        return true;
      })()
    `);
    if (!ok) throw new Error(`Clickable text not found: ${text}`);
    await delay(900);
  }

  async function clickMainText(text) {
    await waitForText(text, 20000);
    const ok = await evalPage(`
      (() => {
        const root = document.querySelector('main') || document.body;
        const target = [...root.querySelectorAll('button,[role="button"],a,tr')]
          .find((el) => (el.innerText || el.textContent || '').replace(/\\s+/g, ' ').trim().includes(${JSON.stringify(text)}));
        if (!target) return false;
        target.scrollIntoView({ block: 'center', inline: 'center' });
        target.click();
        return true;
      })()
    `);
    if (!ok) throw new Error(`Main clickable text not found: ${text}`);
    await delay(900);
  }

  async function fillLogin() {
    await waitForText("Connexion", 20000);
    const submitted = await evalPage(`
      (async () => {
        const setValue = (el, value) => {
          const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
          setter.call(el, value);
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        };
        const email = document.querySelector('input[type="email"]');
        const password = document.querySelector('input[type="password"]');
        setValue(email, 'admin@softwell.mg');
        setValue(password, 'admin@2025');
        await new Promise((resolve) => setTimeout(resolve, 120));
        const form = document.querySelector('form');
        const btn = document.querySelector('form button[type="submit"]');
        if (btn && !btn.disabled) btn.click();
        else if (form?.requestSubmit) form.requestSubmit();
        else form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        return { email: email.value, password: password.value, disabled: btn?.disabled ?? null };
      })()
    `);
    try {
      await waitForText("SoftSign", 30000);
    } catch (error) {
      const body = await evalPage(`document.body ? document.body.innerText.slice(0, 2000) : ''`);
      throw new Error(`Login did not reach launcher. Submitted=${JSON.stringify(submitted)} Body=${body}`);
    }
  }

  async function shot(name) {
    await delay(350);
    const result = await cdp.send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: false,
      fromSurface: true,
    });
    const file = join(OUT_DIR, `${name}.png`);
    await writeFile(file, Buffer.from(result.data, "base64"));
    console.log(file);
  }

  await fillLogin();
  await clickButtonText("SoftSign");
  await waitForText("Documents initiés", 30000);

  const screens = [
    ["01_tableau_bord_softsign", null, "Documents initiés"],
    ["02_nouveau_depot", "Nouveau dépôt", "Dépôt"],
    ["03_mes_documents", "Mes documents", "Mes documents"],
    ["04_documents_externes", "Documents externes", "Documents externes"],
    ["05_documents_recus", "Documents reçus", "Documents reçus"],
    ["06_documents_en_cours", "Documents en cours", "Documents en cours"],
    ["07_documents_rejetes", "Documents rejetés", "Documents rejetés"],
    ["08_documents_archives", "Documents archivés", "Documents archivés"],
    ["09_recherche_avancee", "Recherche avancée", "Recherche avancée"],
    ["10_boite_reception", "Boite de reception", "Boite de reception"],
    ["11_signatures", "Signatures", "Signatures"],
    ["12_delegations", "Délégation", "Délégation"],
    ["13_parametres_generaux", "Paramètres généraux", "Paramètres généraux"],
    ["14_utilisateurs", "Utilisateurs", "Utilisateurs"],
    ["15_autorisation", "Autorisation", "Autorisation"],
    ["16_parametrage_otp", "Paramétrage OTP", "Paramétrage OTP"],
    ["17_workflow", "Workflow", "Workflow"],
    ["18_notifications", "Notifications", "Notifications"],
    ["19_relances", "Relances", "Relances"],
    ["20_modeles_emails", "Modèles emails", "Modèles emails"],
    ["21_personnalisation", "Personnalisation application", "Personnalisation application"],
    ["22_validation_fournisseurs", "Validation fournisseurs", "Validation fournisseurs"],
    ["23_rapport_validateur", "Situation par validateur", "Situation par validateur"],
    ["24_rapport_expediteur", "Situation par expéditeur", "Situation par expéditeur"],
  ];

  for (const [file, menu, expected] of screens) {
    if (menu) {
      await clickButtonText(menu);
      await waitForText(expected, 25000);
    }
    await shot(file);
    if (file === "11_signatures") {
      await clickMainText("Nouvelle configuration");
      await waitForText("Nouvelle configuration de signature", 25000);
      await shot("11b_signature_modal");
      await clickMainText("Annuler");
    }
    if (file === "13_parametres_generaux") {
      await clickMainText("Formats");
      await shot("13b_parametres_formats");
      await clickMainText("Types de documents");
      await shot("13c_parametres_types_documents");
    }
    if (file === "17_workflow") {
      const openedEditor = await evalPage(`
        (() => {
          const root = document.querySelector('main') || document.body;
          const btn = root.querySelector('button[title="Modifier"]');
          if (!btn) return false;
          btn.scrollIntoView({ block: 'center', inline: 'center' });
          btn.click();
          return true;
        })()
      `);
      if (openedEditor) {
        await waitForText("Modifier", 25000);
        await shot("17b_workflow_editeur");
      }
    }
  }

  await clickButtonText("Documents en cours");
  await waitForText("SS-DOC-2026-001", 25000);
  await clickMainText("SS-DOC-2026-001");
  await waitForText("Détails", 25000);
  await shot("25_detail_document_details");
  await clickMainText("Documents");
  await shot("26_detail_document_documents");
  await clickMainText("Workflow");
  await shot("27_detail_document_workflow");
  await clickMainText("Historique");
  await shot("28_detail_document_historique");
  await clickMainText("Actions");
  await shot("29_detail_document_actions");
} finally {
  if (cdp) cdp.close();
  edge.kill();
}
