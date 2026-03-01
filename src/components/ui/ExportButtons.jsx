"use client";
import { IC } from "./Icons";
import { btn } from "../../lib/theme";

/* ─── CSV export ─── */
function toCSV(headers, rows) {
  const esc = v => `"${String(v ?? "").replace(/"/g,'""')}"`;
  return [headers.map(esc).join(","), ...rows.map(r => r.map(esc).join(","))].join("\n");
}

function downloadCSV(filename, headers, rows) {
  const blob = new Blob(["\uFEFF" + toCSV(headers, rows)], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement("a"), { href: url, download: filename });
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ─── Simple HTML→print PDF ─── */
function printToPDF(title, tableHTML) {
  const w = window.open("", "_blank");
  w.document.write(`<!DOCTYPE html><html><head>
    <meta charset="utf-8"><title>${title}</title>
    <style>
      body{font-family:'Segoe UI',sans-serif;font-size:12px;color:#212529;padding:24px}
      h2{color:#324372;font-size:18px;margin-bottom:16px}
      table{width:100%;border-collapse:collapse}
      th{background:#324372;color:#fff;padding:8px 10px;text-align:left;font-size:11px;text-transform:uppercase}
      td{padding:7px 10px;border-bottom:1px solid #e3e6ea;font-size:12px}
      tr:nth-child(even) td{background:#f8f9fc}
      .footer{margin-top:20px;font-size:10px;color:#6c757d;text-align:right}
    </style>
  </head><body>
    <img src="/softdocs-logo.png" height="36" style="margin-bottom:12px"/>
    <h2>${title}</h2>
    ${tableHTML}
    <div class="footer">SoftDocs · Exporté le ${new Date().toLocaleDateString("fr-MG")} à ${new Date().toLocaleTimeString("fr-MG",{hour:"2-digit",minute:"2-digit"})}</div>
  </body></html>`);
  w.document.close();
  setTimeout(() => { w.print(); w.close(); }, 400);
}

/* ─── Main component ─── */
export function ExportButtons({ filename = "export", headers = [], rows = [], tableRef, title = "Rapport" }) {

  function handleExcel() {
    downloadCSV(filename + ".csv", headers, rows);
  }

  function handlePDF() {
    if (tableRef?.current) {
      printToPDF(title, tableRef.current.outerHTML);
    } else {
      /* Build table from headers/rows */
      const th = headers.map(h => `<th>${h}</th>`).join("");
      const tr = rows.map(r => `<tr>${r.map(c => `<td>${c ?? ""}</td>`).join("")}</tr>`).join("");
      printToPDF(title, `<table><thead><tr>${th}</tr></thead><tbody>${tr}</tbody></table>`);
    }
  }

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <button onClick={handleExcel} title="Exporter Excel/CSV"
        style={{ ...btn("light", true), color: "#1d6f42", borderColor: "#1d6f42" }}>
        <span style={{ display: "flex" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/>
          </svg>
        </span>
        Excel
      </button>
      <button onClick={handlePDF} title="Exporter PDF"
        style={{ ...btn("light", true), color: "#c0392b", borderColor: "#c0392b" }}>
        <span style={{ display: "flex" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/>
          </svg>
        </span>
        PDF
      </button>
    </div>
  );
}
