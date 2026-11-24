# Proposal

## Why

The downloaded reservation invoice still uses the old sample-inspired Helvetica sheet, so it no longer looks like the modern Car Rental Reservation UI and its charge table is cramped and loosely aligned. Customers need one clean, precisely aligned document—printable as HTML and downloadable as PDF—that carries the same branding, JetBrains Mono typography, and reservation values as the booking they just made.

## What Changes

- Redesign the A4 PDF produced by `src/utils/invoicePdf.js` with a modern header (brand mark, "CAR RENTAL SERVICES — Reservation Desk", contact info, right-aligned `#RE-####` badge, issue date, and status), two-column metadata cards, a full-width itemized charge table (`CHARGE / DESCRIPTION`, `RATE`, `UNIT / QTY`, `AMOUNT`), a dedicated coupon badge row, a highlighted `TOTAL` bar, a signature block, and a terms/thank-you footer.
- Add a printable HTML invoice template (React component plus print stylesheet) that presents the same document structure and JetBrains Mono typography, with an action in the reservation header to open/print it.
- Enforce `'JetBrains Mono', 'Courier New', monospace` with `font-variant-numeric: tabular-nums` for every element of both documents, not just numeric cells.
- Introduce a shared invoice view model so the HTML template and PDF render the same reservation fields, charge rows, coupon, and total from the existing Zustand store and `calculateReservationCharges()` helper; keep the existing `-` placeholder for empty fields.
- Use the values in the request (e.g. `#RE-2723`, `Tofazzal Hossain`, `SAVE10`, `912.18`) as the illustrative fixture for template preview and verification; live documents continue to use the current reservation state. Unspecified optional fields (additional drivers, payment type, referral) remain `-` placeholders, and issue date/status are derived at render time rather than stored.
- Non-breaking: no changes to the store shape, rate constants, coupon rules, or the responsive booking form layout. The downloaded PDF keeps the `reservation-invoice-` prefix but now includes the reservation ID (e.g. `reservation-invoice-RE-2723.pdf`).

## Capabilities

### New Capabilities

- `invoice-document`: Observable content, typography, and A4 print layout of the reservation invoice document, shared by the printable HTML template and the downloaded PDF.

### Modified Capabilities

- `reservation-store`: The "Download invoice button generates a PDF" requirement replaces the sample-inspired two-column layout with the modern invoice document structure; the total-consistency requirement now covers both PDF and HTML outputs.
- `reservation-ui`: The header requirement gains a print/view invoice action next to the existing Download Invoice action while keeping the theme toggle and its responsive behavior.

## Impact

- Code: `src/utils/invoicePdf.js`, a new shared invoice data helper (e.g. `src/utils/invoiceData.js`), a new printable invoice component and print styles (e.g. `src/components/invoice/` and `src/index.css`), `src/pages/reservation.jsx`, and the header action in `src/components/ui.jsx`/`src/pages/reservation.jsx`.
- Dependencies: none required—`jspdf`, `lucide-react`, Tailwind, and the JetBrains Mono webfont are already present (`index.html` may need the additional font weight entries).
- Verification: `npm run build`, a manual browser check of the printable HTML view at desktop/phone widths, and a downloaded-PDF check with and without coupons confirming the itemized rows and total match the on-screen Charges Summary.
