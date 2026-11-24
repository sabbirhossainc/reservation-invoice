# Tasks

## 1. Shared charge calculation

- [x] 1.1 Create `src/utils/reservationCharges.js` with a pure helper that accepts weeks, days, collision, liability, and rental and returns the daily, weekly, waiver, liability, tax rate, tax amount, and total values using the existing rates ($99/day, $390/week, $9, $15, 11.5%), keeping discount display-only, and verify its output matches the current inline formulas for a representative populated reservation.
- [x] 1.2 Refactor `src/tabular/summary.jsx` to consume the shared helper and verify `npm run lint` passes and the on-screen totals for that same populated reservation are unchanged.

## 2. Invoice PDF module

- [x] 2.1 Create `src/utils/invoicePdf.js` that constructs a single A4 portrait jsPDF document with fixed margins, independent left/right column cursors, and reusable drawing helpers (section heading, label/value, grey table row, rule, signature line), and verify the module resolves during `npm run build`.
- [x] 2.2 Implement the header with a primitive blue/gold car-and-crown mark and a generic "Reservation" title, and verify the generated PDF shows the mark and title with no new image assets or imports.
- [x] 2.3 Implement the left column sections (reservation ID, pickup/return dates, duration, customer name/email/phone, additional driver, unit details, bill-to/payment, referral) with bold uppercase headings and `-` placeholders for empty values, and verify by downloading an empty reservation.
- [x] 2.4 Implement the right column light-grey charge summary table with unit/rate/amount rows, a bold total row, and a footer/signature area, and verify all right-column content fits on the same A4 page.
- [x] 2.5 Apply bounded wrapping or truncation to variable-length values and verify a long customer name and email do not overlap the adjacent column.

## 3. Wire-up and cleanup

- [x] 3.1 Replace the inline `downloadInvoice()` body in `src/pages/reservation.jsx` with a call to the new invoice module, keeping the "Download Invoice" button label and the `reservation-invoice.pdf` filename, and verify clicking the button still triggers the browser download.
- [x] 3.2 Delete the old inline text-drawing code and duplicate rate calculations from `reservation.jsx`, and verify `npm run lint` reports no unused imports or variables.

## 4. Integration verification

- [x] 4.1 Run `npm run build` and `npx tsc --noEmit` and verify both complete without errors.
- [x] 4.2 Download an invoice with a fully populated reservation and verify the A4 page, two-column sample-inspired layout, all store values, grey charge table, and a total that matches the on-screen Charges Summary.
- [x] 4.3 Download an invoice with an empty reservation and verify every label remains visible with a `-` placeholder and no section overlaps or runs off the page.
