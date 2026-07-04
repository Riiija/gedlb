/**
 * exportHistorique.js
 * Export historique de validation → PDF paysage A4 (tableau par étape + QR) et Excel
 */
import { SOFTWELL_LOGO } from "./logoBase64";

function today() {
  return new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}
function nowFull() {
  return new Date().toLocaleString("fr-FR");
}

/* ══════════════════════════════════════════════════════════
   PDF EXPORT — tableau transposé : lignes = champs, colonnes = étapes
══════════════════════════════════════════════════════════ */
export async function exportHistoriquePDF({ doc, users }) {
  const { default: jsPDF }     = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");
  const QRCode                 = await import("qrcode");

  const pdf  = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W    = 297;
  const H    = 210;
  const NAVY = [30, 58, 138];
  const GREEN_BG = [198, 239, 206];
  const GREEN_FG = [39, 98, 33];

  /* ── Header band ── */
  pdf.setFillColor(...NAVY);
  pdf.rect(0, 0, W, 26, "F");
  pdf.addImage(SOFTWELL_LOGO, "PNG", 5, 2, 22, 22);
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14); pdf.setFont("helvetica", "bold");
  pdf.text("SoftDocs", 31, 12);
  pdf.setFontSize(7.5); pdf.setFont("helvetica", "normal");
  pdf.text("GED & Finances — Historique de validation du circuit", 31, 18);
  pdf.setFontSize(9); pdf.setFont("helvetica", "bold");
  pdf.text(doc.id || "—", W - 8, 11, { align: "right" });
  pdf.setFontSize(6.5); pdf.setFont("helvetica", "normal");
  pdf.text(`Exporté le ${nowFull()}`, W - 8, 17, { align: "right" });

  /* ── Gold separator ── */
  pdf.setDrawColor(180, 145, 40);
  pdf.setLineWidth(0.7);
  pdf.line(0, 26, W, 26);

  /* ── Doc info block (compact, 2 colonnes) ── */
  const infoY = 31;
  const infos = [
    ["Référence",   doc.id   || "—"],
    ["Type",        doc.type || "—"],
    ["Fournisseur", doc.fourn || doc.emetteur || "—"],
    ["Projet",      doc.proj || "—"],
    ["Montant",     doc.mt ? `${Number(doc.mt).toLocaleString("fr-FR")} Ar` : "—"],
    ["Statut",      doc.st   || "—"],
    ["Déposé le",   doc.date || "—"],
    ["Site",        doc.site || "—"],
  ];
  pdf.setFontSize(7.5);
  const colW = 68;
  infos.forEach(([label, val], i) => {
    const col = Math.floor(i / 4);
    const row = i % 4;
    const x = 8 + col * colW;
    const y = infoY + row * 5.5;
    pdf.setFont("helvetica", "bold"); pdf.setTextColor(...NAVY);
    pdf.text(label + " :", x, y);
    pdf.setFont("helvetica", "normal"); pdf.setTextColor(40, 40, 40);
    pdf.text(String(val).substring(0, 38), x + 24, y);
  });

  /* ── Separator ── */
  pdf.setDrawColor(200, 200, 200); pdf.setLineWidth(0.2);
  const sepY = infoY + 24;
  pdf.line(8, sepY, W - 8, sepY);

  /* ── Section title ── */
  const titleY = sepY + 5;
  pdf.setFillColor(...NAVY);
  pdf.roundedRect(8, titleY, 88, 5.5, 1, 1, "F");
  pdf.setFontSize(7.5); pdf.setFont("helvetica", "bold");
  pdf.setTextColor(255, 255, 255);
  pdf.text("DÉTAIL DES ÉTAPES DU CIRCUIT DE VALIDATION", 12, titleY + 3.8);

  const tableY = titleY + 8;
  const etapes = doc.etapes || [];

  /* Helper: résoudre userId → "ROLE : login" */
  const uLabel = id => {
    const u = users.find(x => x.id === id);
    if (!u) return id || "—";
    return `${u.role || u.systemRole || "TECH"} : ${u.login || u.nom}`;
  };

  /* Couleurs statut */
  const ST_BG = {
    "VALIDÉ":    [198, 239, 206],
    "REJETÉ":    [255, 199, 206],
    "EN RETARD": [255, 235, 156],
    "EN ATTENTE":[233, 236, 239],
  };
  const ST_FG = {
    "VALIDÉ":    [39, 98, 33],
    "REJETÉ":    [156, 0, 6],
    "EN RETARD": [156, 87, 0],
    "EN ATTENTE":[100, 100, 100],
  };

  /* ── Colonnes : 1 label + 1 par étape ── */
  const LABEL_COL_W = 42; // largeur colonne libellé (verte)
  const usableW = W - 16; // 8mm marge chaque côté
  const etapeW  = etapes.length > 0
    ? Math.min(60, Math.floor((usableW - LABEL_COL_W) / etapes.length))
    : 60;

  /* En-têtes */
  const head = [
    [
      { content: "Liste des étapes", styles: { fillColor: GREEN_BG, textColor: GREEN_FG, fontStyle: "bold", halign: "left" } },
      ...etapes.map((e, i) => ({
        content: `Etape ${i + 1} : ${e.label}`,
        styles: {
          fillColor: ST_BG[e.statut] || [255, 255, 255],
          textColor: ST_FG[e.statut] || [30, 30, 30],
          fontStyle: "bold",
          halign: "center",
        },
      })),
    ],
  ];

  /* Rows */
  const ROWS_DEF = [
    {
      label: "Liste des validateurs circuit",
      fn: e => (e.v || []).map(id => uLabel(id)).join("\n") || "—",
    },
    {
      label: "Liste des validateurs potentiels",
      fn: e => (e.vActifs || e.v || []).map(id => uLabel(id)).join("\n") || "—",
    },
    {
      label: "Validateur",
      fn: e => e.validBy ? uLabel(e.validBy) : "—",
    },
    {
      label: "Date de validation",
      fn: e => e.date || "—",
    },
    {
      label: "Commentaire de validation",
      fn: e => e.comment || "—",
    },
    {
      label: "Check-List",
      fn: e => {
        const cls = e.checklists || [];
        if (!cls.length) return "—";
        return cls.map(c => `${c.checked ? "✓" : "✗"} ${c.label}`).join("\n");
      },
    },
  ];

  const body = ROWS_DEF.map(row => [
    {
      content: row.label,
      styles: { fillColor: GREEN_BG, textColor: GREEN_FG, fontStyle: "bold" },
    },
    ...etapes.map(e => ({ content: row.fn(e), styles: { fillColor: [255, 255, 255], textColor: [30, 30, 30] } })),
  ]);

  autoTable(pdf, {
    startY: tableY,
    head,
    body,
    theme: "grid",
    styles: {
      fontSize: 6.5,
      cellPadding: 2,
      overflow: "linebreak",
      lineColor: [180, 210, 180],
      lineWidth: 0.2,
      valign: "top",
    },
    headStyles: { fontSize: 7, cellPadding: 2.5 },
    columnStyles: {
      0: { cellWidth: LABEL_COL_W, fontStyle: "bold", fillColor: GREEN_BG, textColor: GREEN_FG },
      ...etapes.reduce((acc, _, i) => ({ ...acc, [i + 1]: { cellWidth: etapeW } }), {}),
    },
    margin: { left: 8, right: 8 },
    tableWidth: usableW,
    didParseCell(data) {
      // Coloriser les cellules check-list selon ✓ / ✗
      if (data.section === "body" && data.row.index === 5 && data.column.index > 0) {
        const etapeIdx = data.column.index - 1;
        const cls = (etapes[etapeIdx]?.checklists || []);
        if (cls.length > 0) {
          const allOk = cls.every(c => c.checked);
          data.cell.styles.textColor = allOk ? [39, 98, 33] : [156, 0, 6];
        }
      }
    },
  });

  const finalY = pdf.lastAutoTable.finalY || tableY + 60;

  /* ── QR code ── */
  const qrText = `SoftDocs | Ref: ${doc.id} | Statut: ${doc.st} | ${today()}`;
  const qrDataUrl = await QRCode.toDataURL(qrText, {
    width: 80, margin: 1, color: { dark: "#1e3a5f", light: "#ffffff" },
  });
  const qrSize = 22;
  const qrX = W - 8 - qrSize;
  const qrY2 = Math.max(finalY + 3, H - 36);
  if (qrY2 + qrSize + 6 < H - 8) {
    pdf.addImage(qrDataUrl, "PNG", qrX, qrY2, qrSize, qrSize);
    pdf.setFontSize(5.5); pdf.setTextColor(120, 120, 120);
    pdf.text("Scanner pour vérification", qrX + qrSize / 2, qrY2 + qrSize + 2.5, { align: "center" });
  }

  /* ── Footer ── */
  pdf.setFillColor(...NAVY);
  pdf.rect(0, H - 7, W, 7, "F");
  pdf.setFontSize(6); pdf.setTextColor(200, 200, 200);
  pdf.text("SoftDocs — Système de Gestion Électronique de Documents | Softwell Madagascar", 8, H - 2.5);
  pdf.text(`Page 1 / 1  ·  ${nowFull()}`, W - 8, H - 2.5, { align: "right" });

  pdf.save(`historique_${doc.id || "doc"}_${today().replace(/\//g, "-")}.pdf`);
}

/* ══════════════════════════════════════════════════════════
   EXCEL EXPORT — même structure : lignes = champs, colonnes = étapes
══════════════════════════════════════════════════════════ */
export async function exportHistoriqueExcel({ doc, users }) {
  const XLSX = await import("xlsx");

  const etapes = doc.etapes || [];

  const uLabel = id => {
    const u = users.find(x => x.id === id);
    if (!u) return id || "—";
    return `${u.role || u.systemRole || "TECH"} : ${u.login || u.nom}`;
  };

  /* Info sheet */
  const infoData = [
    ["Référence",   doc.id   || ""],
    ["Type",        doc.type || ""],
    ["Fournisseur", doc.fourn || doc.emetteur || ""],
    ["Projet",      doc.proj || ""],
    ["Site",        doc.site || ""],
    ["Montant",     doc.mt ? `${Number(doc.mt).toLocaleString("fr-FR")} Ar` : ""],
    ["Statut",      doc.st   || ""],
    ["Déposé le",   doc.date || ""],
    ["Exporté le",  nowFull()],
  ];

  /* Historique transposé : 1 colonne par étape */
  const headers = [
    "Champ",
    ...etapes.map((e, i) => `Etape ${i + 1} : ${e.label}`),
  ];

  const ROWS_DEF = [
    { label: "Statut",                       fn: e => e.statut || "—" },
    { label: "Liste des validateurs circuit", fn: e => (e.v || []).map(id => uLabel(id)).join(", ") || "—" },
    { label: "Liste des validateurs potentiels", fn: e => (e.vActifs || e.v || []).map(id => uLabel(id)).join(", ") || "—" },
    { label: "Validateur",                   fn: e => e.validBy ? uLabel(e.validBy) : "—" },
    { label: "Date de validation",           fn: e => e.date || "—" },
    { label: "Commentaire de validation",    fn: e => e.comment || "—" },
    { label: "Check-List",                   fn: e => (e.checklists || []).map(c => `${c.checked ? "✓" : "✗"} ${c.label}`).join(" | ") || "—" },
  ];

  const histRows = ROWS_DEF.map(row => [
    row.label,
    ...etapes.map(e => row.fn(e)),
  ]);

  const wb = XLSX.utils.book_new();

  /* Sheet 1: Informations */
  const wsInfo = XLSX.utils.aoa_to_sheet(infoData);
  wsInfo["!cols"] = [{ wch: 18 }, { wch: 40 }];
  XLSX.utils.book_append_sheet(wb, wsInfo, "Informations");

  /* Sheet 2: Historique */
  const wsHist = XLSX.utils.aoa_to_sheet([headers, ...histRows]);
  wsHist["!cols"] = [
    { wch: 32 },
    ...etapes.map(() => ({ wch: 35 })),
  ];
  XLSX.utils.book_append_sheet(wb, wsHist, "Historique Circuit");

  XLSX.writeFile(wb, `historique_${doc.id || "doc"}_${today().replace(/\//g, "-")}.xlsx`);
}
