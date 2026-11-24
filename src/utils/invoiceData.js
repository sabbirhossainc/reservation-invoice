import {
  COLLISION_RATE,
  DAILY_RATE,
  LIABILITY_RATE,
  RENTAL_TAX_PERCENT,
  WEEKLY_RATE,
  calculateReservationCharges,
} from "./reservationCharges.js";

export const BRAND_TITLE = "CAR RENTAL SERVICES — Reservation Desk";
export const BRAND_CONTACT = "reservations@carrental.example | +1 (555) 010-0000";
export const INVOICE_STATUS = "Confirmed";

export const asText = (value) => {
  if (value === undefined || value === null) return "-";
  const text = String(value).trim();
  return text === "" ? "-" : text;
};

export const money = (value) => `$${Number(value || 0).toFixed(2)}`;

const pluralized = (value, unit) => `${value || 0} ${unit}${(value || 0) === 1 ? "" : "s"}`;

const formatDuration = (weeks, days) =>
  `${pluralized(weeks, "Week")} ${pluralized(days, "Day")}`;

const formatIssueDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const chargeRow = (label, rate, unit, amount) => ({ label, rate, unit, amount });

export function buildInvoiceData(reservation = {}, now = new Date()) {
  const charges = calculateReservationCharges(reservation);
  const fullName = [reservation.firstName, reservation.lastName].filter(Boolean).join(" ");
  const duration = formatDuration(reservation.weeks, reservation.days);
  const reservationId = asText(reservation.reservationId);
  const issueDate = formatIssueDate(now);
  const filenameId = reservationId.replace(/^#/, "").replace(/[^A-Za-z0-9_-]/g, "");
  const coupon = reservation.appliedCoupon;

  return {
    brandTitle: BRAND_TITLE,
    contact: BRAND_CONTACT,
    reservationId,
    filenameId,
    filename: `reservation-invoice-${filenameId || "reservation"}-${issueDate}.pdf`,
    issueDate,
    status: INVOICE_STATUS,
    duration,
    leftSections: [
      {
        title: "Reservation Details",
        rows: [
          { label: "Reservation ID", value: reservationId },
          { label: "Pickup Date", value: asText(reservation.datePickup) },
          { label: "Return Date", value: asText(reservation.dateReturn) },
          { label: "Duration", value: duration },
        ],
      },
      {
        title: "Unit Details",
        rows: [
          { label: "Vehicle Type", value: asText(reservation.vehicleType) },
          { label: "Make & Model", value: asText(reservation.vehicleMake) },
        ],
      },
    ],
    rightSections: [
      {
        title: "Renter Information",
        rows: [
          { label: "Name", value: asText(fullName) },
          { label: "Email", value: asText(reservation.email) },
          { label: "Phone", value: asText(reservation.phone) },
        ],
      },
      {
        title: "Additional Authorized Driver(s)",
        rows: [{ label: "Driver", value: "-" }],
      },
      {
        title: "Payment Type",
        rows: [{ label: "Payment", value: "-" }],
      },
      {
        title: "Referral",
        rows: [{ label: "Referral", value: "-" }],
      },
    ],
    chargeRows: [
      chargeRow("Daily", money(DAILY_RATE), String(reservation.days || 0), money(charges.daily)),
      chargeRow("Weekly", money(WEEKLY_RATE), String(reservation.weeks || 0), money(charges.weekly)),
      chargeRow("Collision Damage Waiver", money(COLLISION_RATE), "-", money(charges.waiver)),
      chargeRow("Liability Insurance", money(LIABILITY_RATE), "-", money(charges.liability)),
      chargeRow("Rental Tax", `${RENTAL_TAX_PERCENT}%`, "-", money(charges.taxAmount)),
    ],
    couponRow: coupon
      ? { label: `Coupon Applied: ${coupon.code}`, amount: `-${money(charges.discount)}` }
      : null,
    total: money(charges.total),
    signatures: [
      { label: "Renter's Signature", timestampLabel: "Date / Time" },
      { label: "Additional Authorized Driver Signature", timestampLabel: "Date / Time" },
    ],
    footer: {
      terms: "Rental terms: return the vehicle in the same condition and by the agreed return date; late returns may incur additional charges.",
      thanks: "Thank you for choosing CAR RENTAL SERVICES.",
    },
  };
}

