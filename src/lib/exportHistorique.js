/**
 * exportHistorique.js
 * Export historique de validation → PDF (avec QR code + logo Softwell) et Excel
 */
import { SOFTWELL_LOGO } from "./logoBase64";

/* ── helpers ── */
function today() {
  return new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}
function nowFull() {
  return new Date().toLocaleString("fr-FR");
}

/* ══════════════════════════════════════════════════════════
   PDF EXPORT
══════════════════════════════════════════════════════════ */
export async function exportHistoriquePDF({ doc, users }) {
  /* Dynamic imports to keep bundle light */
  const { default: jsPDF }      = await import("jspdf");
  const { default: autoTable }  = await import("jspdf-autotable");
  const QRCode                  = await import("qrcode");

  const pdf  = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W    = 297; // A4 landscape width
  const H    = 210;
  const NAVY = [45, 74, 122];
  const GOLD = [180, 145, 40];

  /* ── Header band ── */
  pdf.setFillColor(...NAVY);
  pdf.rect(0, 0, W, 28, "F");

  /* Logo Softwell */
  pdf.addImage(SOFTWELL_LOGO, "PNG", 6, 3, 22, 22);

  /* App name */
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text("SoftDocs", 32, 13);
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  pdf.text("GED & Finances — Historique de validation", 32, 19);

  /* Doc ref right-aligned */
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text(doc.id || "—", W - 10, 11, { align: "right" });
  pdf.setFontSize(7);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Exporté le ${nowFull()}`, W - 10, 17, { align: "right" });

  /* ── Gold separator ── */
  pdf.setDrawColor(...GOLD);
  pdf.setLineWidth(0.8);
  pdf.line(0, 28, W, 28);

  /* ── Doc info block ── */
  const infoY = 34;
  pdf.setFontSize(8);
  pdf.setTextColor(80, 80, 80);
  const infos = [
    ["Référence",  doc.id || "—"],
    ["Type",       doc.type || "—"],
    ["Fournisseur",doc.fourn || doc.emetteur || "—"],
    ["Projet",     doc.proj || "—"],
    ["Site",       doc.site || "—"],
    ["Montant",    doc.mt ? `${Number(doc.mt).toLocaleString("fr-FR")} Ar` : "—"],
    ["Statut",     doc.st || "—"],
    ["Déposé le",  doc.date || "—"],
  ];
  const colW = 66;
  infos.forEach(([label, val], i) => {
    const col = Math.floor(i / 4);
    const row = i % 4;
    const x   = 10 + col * colW;
    const y   = infoY + row * 7;
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(...NAVY);
    pdf.text(label + " :", x, y);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(50, 50, 50);
    pdf.text(String(val), x + 26, y);
  });

  /* ── Separator ── */
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.3);
  pdf.line(10, infoY + 30, W - 10, infoY + 30);

  /* ── Section title ── */
  pdf.setFillColor(...NAVY);
  pdf.roundedRect(10, infoY + 33, 70, 6, 1, 1, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.setTextColor(255, 255, 255);
  pdf.text("HISTORIQUE DES ÉTAPES DE VALIDATION", 14, infoY + 37.5);

  /* ── Build table rows ── */
  const etapes = (doc.etapes || []).filter(e => e.statut !== "EN ATTENTE");
  const rows = etapes.map((e, i) => {
    const valideur = users.find(u => u.id === e.validBy);
    const participants = (e.vActifs || e.v || [])
      .map(uid => users.find(u => u.id === uid)?.nom || uid)
      .join(", ");
    const ST_LABEL = {
      "VALIDÉ": "✓ Validé",
      "REJETÉ": "✗ Rejeté",
      "EN RETARD": "⚠ En retard",
      "REÇU": "→ Reçu",
    };
    return [
      i + 1,
      e.label || "—",
      ST_LABEL[e.statut] || e.statut || "—",
      valideur?.nom || participants || "—",
      valideur?.role || "—",
      e.date || "—",
      e.comment || "—",
    ];
  });

  autoTable(pdf, {
    startY: infoY + 42,
    head: [["N°", "Étape", "Statut", "Traité par", "Rôle", "Date", "Commentaire"]],
    body: rows.length ? rows : [["—", "Aucune étape traitée", "", "", "", "", ""]],
    styles: { fontSize: 7.5, cellPadding: 2.5, textColor: [30, 30, 30] },
    headStyles: {
      fillColor: NAVY,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
    },
    alternateRowStyles: { fillColor: [242, 246, 255] },
    columnStyles: {
      0: { cellWidth: 8,  halign: "center" },
      1: { cellWidth: 50 },
      2: { cellWidth: 26, halign: "center" },
      3: { cellWidth: 50 },
      4: { cellWidth: 28 },
      5: { cellWidth: 26 },
      6: { cellWidth: "auto" },
    },
    didDrawCell(data) {
      if (data.section === "body" && data.column.index === 2) {
        const st = etapes[data.row.index]?.statut;
        const colors = {
          "VALIDÉ":   [212, 237, 218],
          "REJETÉ":   [248, 215, 218],
          "EN RETARD":[255, 243, 205],
        };
        const bg = colors[st];
        if (bg) {
          const { x, y, width, height } = data.cell;
          pdf.setFillColor(...bg);
          pdf.rect(x, y, width, height, "F");
          pdf.setTextColor(30, 30, 30);
          pdf.setFontSize(7.5);
          pdf.text(data.cell.raw, x + width / 2, y + height / 2 + 2, { align: "center" });
        }
      }
    },
  });

  /* ── QR code (URL du document) ── */
  const qrText = `SoftDocs | Ref: ${doc.id} | Statut: ${doc.st} | ${today()}`;
  const qrDataUrl = await QRCode.toDataURL(qrText, {
    width: 80, margin: 1, color: { dark: "#1e3a5f", light: "#ffffff" },
  });

  const qrY = H - 38;
  pdf.addImage(qrDataUrl, "PNG", W - 38, qrY, 28, 28);
  pdf.setFontSize(6);
  pdf.setTextColor(120, 120, 120);
  pdf.text("Scanner pour vérification", W - 24, qrY + 30, { align: "center" });

  /* ── Footer ── */
  pdf.setFillColor(...NAVY);
  pdf.rect(0, H - 8, W, 8, "F");
  pdf.setFontSize(6.5);
  pdf.setTextColor(200, 200, 200);
  pdf.text("SoftDocs — Système de Gestion Électronique de Documents | Softwell", 10, H - 3);
  pdf.text(`Page 1 / 1  ·  ${nowFull()}`, W - 10, H - 3, { align: "right" });

  pdf.save(`historique_${doc.id || "doc"}_${today().replace(/\//g, "-")}.pdf`);
}

/* ══════════════════════════════════════════════════════════
   EXCEL EXPORT
══════════════════════════════════════════════════════════ */
export async function exportHistoriqueExcel({ doc, users }) {
  const XLSX = await import("xlsx");

  const etapes = (doc.etapes || []).filter(e => e.statut !== "EN ATTENTE");

  /* Info sheet */
  const infoData = [
    ["Référence", doc.id || ""],
    ["Type", doc.type || ""],
    ["Fournisseur", doc.fourn || doc.emetteur || ""],
    ["Projet", doc.proj || ""],
    ["Site", doc.site || ""],
    ["Montant", doc.mt ? `${Number(doc.mt).toLocaleString("fr-FR")} Ar` : ""],
    ["Statut", doc.st || ""],
    ["Déposé le", doc.date || ""],
    ["Exporté le", nowFull()],
  ];

  /* History sheet */
  const histHeaders = ["N°", "Étape", "Statut", "Traité par", "Rôle", "Date", "Commentaire"];
  const histRows = etapes.map((e, i) => {
    const valideur = users.find(u => u.id === e.validBy);
    const participants = (e.vActifs || e.v || [])
      .map(uid => users.find(u => u.id === uid)?.nom || uid)
      .join(", ");
    return [
      i + 1,
      e.label || "",
      e.statut || "",
      valideur?.nom || participants || "",
      valideur?.role || "",
      e.date || "",
      e.comment || "",
    ];
  });

  const wb = XLSX.utils.book_new();

  /* Sheet 1: Info */
  const wsInfo = XLSX.utils.aoa_to_sheet(infoData);
  wsInfo["!cols"] = [{ wch: 18 }, { wch: 40 }];
  XLSX.utils.book_append_sheet(wb, wsInfo, "Informations");

  /* Sheet 2: Historique */
  const wsHist = XLSX.utils.aoa_to_sheet([histHeaders, ...histRows]);
  wsHist["!cols"] = [{ wch: 5 }, { wch: 30 }, { wch: 18 }, { wch: 30 }, { wch: 20 }, { wch: 16 }, { wch: 40 }];
  XLSX.utils.book_append_sheet(wb, wsHist, "Historique");

  XLSX.writeFile(wb, `historique_${doc.id || "doc"}_${today().replace(/\//g, "-")}.xlsx`);
}
