import { jsPDF } from "jspdf";
import { buildInvoiceData, invoiceFilename } from "./invoiceData.js";

const PAGE_MARGIN = 36;
const COLUMN_GAP = 16;
const ROW_HEIGHT = 15;
const OUTPUT_FILENAME_FALLBACK = "reservation-invoice-RE-0000.pdf";

const INK = [18, 32, 51];
const MUTED = [92, 105, 122];
const ACCENT = [29, 78, 216];
const ACCENT_SOFT = [219, 234, 254];
const LINE = [220, 227, 236];
const SURFACE_MUTED = [237, 241, 246];
const WHITE = [255, 255, 255];
const GOLD = [214, 170, 45];

const FONT_FILES = [
  { file: "JetBrainsMono-Regular.ttf", url: "/fonts/JetBrainsMono-Regular.ttf", style: "normal" },
  { file: "JetBrainsMono-Bold.ttf", url: "/fonts/JetBrainsMono-Bold.ttf", style: "bold" },
];

const FONT_FAMILY = "JetBrainsMono";
const FALLBACK_FAMILY = "courier";

const toBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }
  return btoa(binary);
};

async function registerInvoiceFont(doc) {
  try {
    for (const font of FONT_FILES) {
      const response = await fetch(font.url);
      if (!response.ok) throw new Error(`Font request failed: ${font.url}`);
      doc.addFileToVFS(font.file, toBase64(await response.arrayBuffer()));
      doc.addFont(font.file, FONT_FAMILY, font.style);
    }
    return FONT_FAMILY;
  } catch {
    return FALLBACK_FAMILY;
  }
}

function applyFont(doc, family, style, size, color = INK) {
  doc.setFont(family, style);
  doc.setFontSize(size);
  doc.setTextColor(...color);
}

function fitText(doc, value, maxWidth) {
  const text = value === undefined || value === null ? "-" : String(value);
  if (doc.getTextWidth(text) <= maxWidth) return text;
  let candidate = text;
  while (candidate.length > 1 && doc.getTextWidth(`${candidate}...`) > maxWidth) {
    candidate = candidate.slice(0, -1);
  }
  return `${candidate}...`;
}

function drawLogo(doc, x, y) {
  doc.setFillColor(...ACCENT);
  doc.roundedRect(x, y, 36, 36, 8, 8, "F");

  doc.setFillColor(...WHITE);
  doc.roundedRect(x + 6, y + 17, 24, 9, 3, 3, "F");
  doc.circle(x + 11, y + 27, 3, "F");
  doc.circle(x + 25, y + 27, 3, "F");

  doc.setDrawColor(...GOLD);
  doc.setLineWidth(1.4);
  doc.lines(
    [
      [5, -5],
      [5, 4],
      [5, -7],
      [5, 4],
      [5, -5],
    ],
    x + 8,
    y + 14,
    [1, 1],
    "S"
  );
}

function drawHeader(doc, model, pageWidth, family) {
  const right = pageWidth - PAGE_MARGIN;
  drawLogo(doc, PAGE_MARGIN, 38);

  applyFont(doc, family, "bold", 12);
  doc.text("CAR RENTAL SERVICES", PAGE_MARGIN + 48, 51);
  applyFont(doc, family, "normal", 9, MUTED);
  doc.text("— Reservation Desk", PAGE_MARGIN + 48, 64);
  doc.text(model.contact, PAGE_MARGIN + 48, 77);

  applyFont(doc, family, "normal", 8, MUTED);
  doc.text("INVOICE / RESERVATION", right, 47, { align: "right" });

  const badgeWidth = Math.max(doc.getTextWidth(model.reservationId) + 20, 90);
  doc.setFillColor(...INK);
  doc.roundedRect(right - badgeWidth, 55, badgeWidth, 24, 5, 5, "F");
  applyFont(doc, family, "bold", 12, WHITE);
  doc.text(model.reservationId, right - 10, 71, { align: "right" });

  applyFont(doc, family, "normal", 8, MUTED);
  doc.text(`Issued ${model.issueDate}`, right, 91, { align: "right" });

  const statusWidth = doc.getTextWidth(model.status) + 18;
  doc.setFillColor(...ACCENT_SOFT);
  doc.roundedRect(right - statusWidth, 98, statusWidth, 15, 7, 7, "F");
  applyFont(doc, family, "bold", 7, ACCENT);
  doc.text(model.status, right - 9, 108, { align: "right" });

  doc.setDrawColor(...INK);
  doc.setLineWidth(1.2);
  doc.line(PAGE_MARGIN, 124, right, 124);
  return 140;
}

function drawMetadataSection(doc, section, x, y, width, family) {
  const padding = 9;
  const headingHeight = 14;
  const height = padding * 2 + headingHeight + section.rows.length * ROW_HEIGHT;

  doc.setFillColor(...SURFACE_MUTED);
  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.6);
  doc.roundedRect(x, y, width, height, 6, 6, "FD");

  applyFont(doc, family, "bold", 7.5, MUTED);
  doc.text(section.title.toUpperCase(), x + padding, y + padding + 7, { maxWidth: width - padding * 2 });

  let rowY = y + padding + headingHeight + 6;
  section.rows.forEach(({ label, value }) => {
    applyFont(doc, family, "normal", 8, MUTED);
    doc.text(fitText(doc, label, width * 0.4), x + padding, rowY);
    applyFont(doc, family, "bold", 8, INK);
    doc.text(fitText(doc, value, width * 0.55), x + width - padding, rowY, { align: "right" });
    rowY += ROW_HEIGHT;
  });

  return y + height + 8;
}

function drawMetadata(doc, model, x, y, contentWidth, family) {
  const columnWidth = (contentWidth - COLUMN_GAP) / 2;
  const rightX = x + columnWidth + COLUMN_GAP;
  let leftY = y;
  let rightY = y;

  model.leftSections.forEach((section) => {
    leftY = drawMetadataSection(doc, section, x, leftY, columnWidth, family);
  });
  model.rightSections.forEach((section) => {
    rightY = drawMetadataSection(doc, section, rightX, rightY, columnWidth, family);
  });

  return Math.max(leftY, rightY);
}

function drawChargeTable(doc, model, x, y, contentWidth, family) {
  applyFont(doc, family, "bold", 8, MUTED);
  doc.text("CHARGE SUMMARY", x, y);

  const top = y + 8;
  const widths = [contentWidth * 0.5, contentWidth * 0.16, contentWidth * 0.16, contentWidth * 0.18];
  const positions = [x, x + widths[0], x + widths[0] + widths[1], x + widths[0] + widths[1] + widths[2]];
  const headers = ["CHARGE / DESCRIPTION", "RATE", "UNIT / QTY", "AMOUNT"];

  doc.setFillColor(...SURFACE_MUTED);
  doc.rect(x, top, contentWidth, 20, "F");
  applyFont(doc, family, "bold", 7.5, MUTED);
  headers.forEach((header, index) => {
    const align = index === 3 ? "right" : "left";
    const position = index === 3 ? x + contentWidth - 8 : positions[index] + 8;
    doc.text(header, position, top + 13, { align });
  });

  let rowY = top + 20;
  model.chargeRows.forEach((row) => {
    applyFont(doc, family, "normal", 8, INK);
    doc.text(fitText(doc, row.label, widths[0] - 16), positions[0] + 8, rowY + 10);
    applyFont(doc, family, "normal", 8, MUTED);
    doc.text(fitText(doc, row.rate, widths[1] - 12), positions[1] + 8, rowY + 10);
    doc.text(fitText(doc, row.unit, widths[2] - 12), positions[2] + 8, rowY + 10);
    applyFont(doc, family, "bold", 8, INK);
    doc.text(fitText(doc, row.amount, widths[3] - 12), x + contentWidth - 8, rowY + 10, { align: "right" });
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.5);
    doc.line(x, rowY + 16, x + contentWidth, rowY + 16);
    rowY += 18;
  });

  if (model.couponRow) {
    doc.setFillColor(...ACCENT_SOFT);
    doc.rect(x, rowY + 2, contentWidth, 20, "F");
    const badgeWidth = doc.getTextWidth(model.couponRow.label.toUpperCase()) + 14;
    doc.setFillColor(...ACCENT);
    doc.roundedRect(x + 8, rowY + 6, badgeWidth, 12, 3, 3, "F");
    applyFont(doc, family, "bold", 7, WHITE);
    doc.text(model.couponRow.label.toUpperCase(), x + 15, rowY + 14);
    applyFont(doc, family, "bold", 8, ACCENT);
    doc.text(model.couponRow.amount, x + contentWidth - 8, rowY + 15, { align: "right" });
    rowY += 24;
  }

  const totalHeight = 26;
  doc.setFillColor(...INK);
  doc.rect(x, rowY + 2, contentWidth, totalHeight, "F");
  applyFont(doc, family, "bold", 11, WHITE);
  doc.text("TOTAL", x + 8, rowY + 19);
  doc.text(model.total, x + contentWidth - 8, rowY + 19, { align: "right" });

  return rowY + totalHeight + 14;
}

function drawSignatures(doc, model, x, y, contentWidth, family) {
  const columnWidth = (contentWidth - COLUMN_GAP) / 2;
  model.signatures.forEach((signature, index) => {
    const signatureX = x + index * (columnWidth + COLUMN_GAP);
    applyFont(doc, family, "bold", 8, INK);
    doc.text(signature.label, signatureX, y);
    doc.setDrawColor(...MUTED);
    doc.setLineWidth(0.6);
    doc.setLineDashPattern([3, 3], 0);
    doc.line(signatureX, y + 18, signatureX + columnWidth, y + 18);
    doc.setLineDashPattern([], 0);
    applyFont(doc, family, "normal", 7, MUTED);
    doc.text(signature.timestampLabel, signatureX, y + 29);
  });
  return y + 40;
}

function drawFooter(doc, model, x, pageHeight, contentWidth, family) {
  const footerY = pageHeight - 54;
  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.6);
  doc.line(x, footerY, x + contentWidth, footerY);

  applyFont(doc, family, "normal", 7, MUTED);
  doc.text(doc.splitTextToSize(model.footer.terms, contentWidth), x, footerY + 10);
  applyFont(doc, family, "bold", 7, INK);
  doc.text(model.footer.thanks, x, footerY + 30);
}

export async function createReservationInvoiceDoc(data = {}) {
  const model = buildInvoiceData(data);
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const family = await registerInvoiceFont(doc);
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - PAGE_MARGIN * 2;

  const startY = drawHeader(doc, model, pageWidth, family);
  const metadataBottom = drawMetadata(doc, model, PAGE_MARGIN, startY, contentWidth, family);
  const tableBottom = drawChargeTable(doc, model, PAGE_MARGIN, metadataBottom + 10, contentWidth, family);
  drawSignatures(doc, model, PAGE_MARGIN, tableBottom + 20, contentWidth, family);
  drawFooter(doc, model, PAGE_MARGIN, pageHeight, contentWidth, family);

  return doc;
}

export async function downloadReservationInvoice(data = {}) {
  const model = buildInvoiceData(data);
  const doc = await createReservationInvoiceDoc(data);
  doc.save(invoiceFilename(model) || OUTPUT_FILENAME_FALLBACK);
}
