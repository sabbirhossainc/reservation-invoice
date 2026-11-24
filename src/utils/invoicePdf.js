import { jsPDF } from "jspdf";
import {
  COLLISION_RATE,
  DAILY_RATE,
  LIABILITY_RATE,
  RENTAL_TAX_PERCENT,
  WEEKLY_RATE,
  calculateReservationCharges,
} from "./reservationCharges.js";

const PAGE_MARGIN = 40;
const COLUMN_GAP = 24;
const LEFT_COLUMN_WIDTH = 240;
const ROW_HEIGHT = 20;
const OUTPUT_FILENAME = "reservation-invoice.pdf";

const INK = [35, 35, 35];
const MUTED = [110, 110, 110];
const BLUE = [35, 79, 139];
const GOLD = [214, 170, 45];
const TABLE_GREY = [236, 236, 236];
const RULE_GREY = [190, 190, 190];

const asText = (value) => {
  if (value === undefined || value === null) return "-";
  const text = String(value).trim();
  return text === "" ? "-" : text;
};

const money = (value) => `$${Number(value).toFixed(2)}`;
const totalMoney = (value) => `$${value}`;

function applyFont(doc, style, size, color = INK) {
  doc.setFont("helvetica", style);
  doc.setFontSize(size);
  doc.setTextColor(...color);
}

function fitText(doc, value, maxWidth) {
  const text = asText(value);
  if (doc.getTextWidth(text) <= maxWidth) return text;
  let candidate = text;
  while (candidate.length > 1 && doc.getTextWidth(`${candidate}...`) > maxWidth) {
    candidate = candidate.slice(0, -1);
  }
  return `${candidate}...`;
}

function sectionHeading(doc, label, x, y) {
  applyFont(doc, "bold", 11);
  doc.text(label.toUpperCase(), x, y);
  return y + 16;
}

function labelValue(doc, label, value, x, y, maxWidth) {
  applyFont(doc, "normal", 10);
  const lines = doc.splitTextToSize(`${label}: ${asText(value)}`, maxWidth);
  const visibleLines = lines.slice(0, 2).map((line, index) =>
    index === 1 && lines.length > 2 ? fitText(doc, `${line}...`, maxWidth) : line
  );
  visibleLines.forEach((line, index) => {
    doc.text(line, x, y + index * 12);
  });
  return y + visibleLines.length * 12 + 6;
}

function rule(doc, x, y, width) {
  doc.setDrawColor(...RULE_GREY);
  doc.setLineWidth(0.6);
  doc.line(x, y, x + width, y);
  return y + 12;
}

function drawLogo(doc, x, y) {
  doc.setFillColor(...BLUE);
  doc.roundedRect(x, y + 16, 54, 16, 5, 5, "F");

  doc.setFillColor(25, 25, 25);
  doc.circle(x + 12, y + 33, 4, "F");
  doc.circle(x + 42, y + 33, 4, "F");

  doc.setDrawColor(...GOLD);
  doc.setLineWidth(2);
  doc.line(x + 7, y + 16, x + 13, y + 5);
  doc.line(x + 13, y + 5, x + 21, y + 13);
  doc.line(x + 21, y + 13, x + 30, y + 3);
  doc.line(x + 30, y + 3, x + 39, y + 13);
  doc.line(x + 39, y + 13, x + 47, y + 5);
  doc.line(x + 47, y + 5, x + 53, y + 16);
}

function drawHeader(doc, data, pageWidth) {
  drawLogo(doc, PAGE_MARGIN, 38);

  applyFont(doc, "bold", 10);
  doc.text("CAR RENTAL SERVICES", PAGE_MARGIN + 66, 50);
  applyFont(doc, "normal", 9, MUTED);
  doc.text("Reservation Desk", PAGE_MARGIN + 66, 63);
  doc.text("Contact: -", PAGE_MARGIN + 66, 75);

  applyFont(doc, "bold", 20);
  doc.text("RESERVATION", pageWidth - PAGE_MARGIN, 50, { align: "right" });
  applyFont(doc, "normal", 10, MUTED);
  doc.text(`Reservation ID: ${asText(data.reservationId)}`, pageWidth - PAGE_MARGIN, 68, {
    align: "right",
  });

  return rule(doc, PAGE_MARGIN, 96, pageWidth - PAGE_MARGIN * 2);
}

function drawLeftColumn(doc, data, x, y, width) {
  const hasDates = Boolean(data.datePickup && data.dateReturn);
  const duration = hasDates
    ? `${data.weeks || 0} Week ${data.days || 0} Day`
    : "-";
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ");

  y = sectionHeading(doc, "Reservation Details", x, y);
  y = labelValue(doc, "Reservation ID", data.reservationId, x, y, width);
  y = labelValue(doc, "Pickup", data.datePickup, x, y, width);
  y = labelValue(doc, "Return", data.dateReturn, x, y, width);
  y = labelValue(doc, "Duration", duration, x, y, width);

  y += 6;
  y = sectionHeading(doc, "Renter Info", x, y);
  y = labelValue(doc, "Name", fullName, x, y, width);
  y = labelValue(doc, "Email", data.email, x, y, width);
  y = labelValue(doc, "Phone", data.phone, x, y, width);

  y += 6;
  y = sectionHeading(doc, "Additional Authorized Driver(s)", x, y);
  y = labelValue(doc, "Driver", "-", x, y, width);

  y += 6;
  y = sectionHeading(doc, "Unit Details", x, y);
  y = labelValue(doc, "Unit", data.vehicleType, x, y, width);
  y = labelValue(doc, "Make & Model", data.vehicleMake, x, y, width);

  y += 6;
  y = sectionHeading(doc, "Bill To / Payment", x, y);
  y = labelValue(doc, "Payment Type", "-", x, y, width);

  y += 6;
  y = sectionHeading(doc, "Referral", x, y);
  y = labelValue(doc, "Referral", "-", x, y, width);

  return y;
}

function tableRow(doc, row, x, y, widths, isBold = false) {
  applyFont(doc, isBold ? "bold" : "normal", 9);
  doc.text(fitText(doc, row.label, widths[0]), x + 8, y);
  doc.text(fitText(doc, row.unit, widths[1]), x + 132, y);
  doc.text(fitText(doc, row.rate, widths[2]), x + 166, y);
  doc.text(fitText(doc, row.amount, widths[3]), x + 243, y, { align: "right" });
}

function signatureLine(doc, label, x, y, width) {
  applyFont(doc, "normal", 9, MUTED);
  doc.text(label, x, y);
  doc.setDrawColor(...RULE_GREY);
  doc.setLineWidth(0.6);
  doc.setLineDashPattern([3, 3], 0);
  doc.line(x, y + 14, x + width, y + 14);
  doc.setLineDashPattern([], 0);
}

function drawRightColumn(doc, data, charges, x, y, width, pageHeight) {
  const widths = [116, 28, 62, 40];
  y = sectionHeading(doc, "Charge Summary", x, y);

  const rows = [
    { label: "Daily", unit: data.days, rate: money(DAILY_RATE), amount: money(charges.daily) },
    { label: "Weekly", unit: data.weeks, rate: money(WEEKLY_RATE), amount: money(charges.weekly) },
    {
      label: "Collision Damage Waiver",
      unit: "",
      rate: money(COLLISION_RATE),
      amount: money(charges.waiver),
    },
    {
      label: "Liability Insurance",
      unit: "",
      rate: money(LIABILITY_RATE),
      amount: money(charges.liability),
    },
    {
      label: "Rental Tax",
      unit: "",
      rate: `${RENTAL_TAX_PERCENT}%`,
      amount: money(charges.taxAmount),
    },
    { label: "Discount", unit: "", rate: asText(data.discount), amount: "-" },
  ];

  const tableTop = y + 6;
  const headerHeight = ROW_HEIGHT;
  const tableHeight = headerHeight + rows.length * ROW_HEIGHT + ROW_HEIGHT + 10;

  doc.setFillColor(...TABLE_GREY);
  doc.rect(x, tableTop - 4, width, tableHeight, "F");

  applyFont(doc, "bold", 8);
  doc.text("CHARGE", x + 8, tableTop + 10);
  doc.text("UNIT", x + 132, tableTop + 10);
  doc.text("RATE", x + 166, tableTop + 10);
  doc.text("AMOUNT", x + 243, tableTop + 10, { align: "right" });

  rows.forEach((row, index) => {
    tableRow(doc, row, x, tableTop + headerHeight + 10 + index * ROW_HEIGHT, widths);
  });

  const totalY = tableTop + headerHeight + 10 + rows.length * ROW_HEIGHT + 4;
  tableRow(
    doc,
    { label: "TOTAL", unit: "", rate: "", amount: totalMoney(charges.total) },
    x,
    totalY,
    widths,
    true
  );

  const signatureY = Math.max(totalY + 50, pageHeight - 120);
  signatureLine(doc, "Renters Signature", x, signatureY, width);
  signatureLine(doc, "Additional Driver", x, signatureY + 46, width);

  return totalY;
}

export function createReservationInvoiceDoc(data = {}) {
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const leftX = PAGE_MARGIN;
  const rightX = leftX + LEFT_COLUMN_WIDTH + COLUMN_GAP;
  const rightWidth = pageWidth - PAGE_MARGIN - rightX;
  const startY = drawHeader(doc, data, pageWidth) + 8;

  drawLeftColumn(doc, data, leftX, startY, LEFT_COLUMN_WIDTH);
  drawRightColumn(
    doc,
    data,
    calculateReservationCharges(data),
    rightX,
    startY,
    rightWidth,
    pageHeight
  );

  return doc;
}

export function downloadReservationInvoice(data = {}) {
  createReservationInvoiceDoc(data).save(OUTPUT_FILENAME);
}
