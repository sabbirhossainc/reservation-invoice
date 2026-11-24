# Tasks

## 1. Fonts and shared invoice data

- [x] 1.1 Add self-hosted JetBrains Mono Regular and Bold TTF files plus the SIL OFL notice under `public/fonts/`, and verify `npm run build` copies them into `dist/fonts/`
- [x] 1.2 Create `src/utils/invoiceData.js` that builds the document model from a reservation snapshot using `calculateReservationCharges()`, shared `asText()`/`money()` formatting, duration text, derived issue date, and `Confirmed` status, and verify with a one-off Node import that the SAVE10 fixture yields daily `$495.00`, weekly `$390.00`, waiver `$9.00`, liability `$15.00`, tax `$94.08`, discount `-$90.90`, and total `$912.18`

## 2. Printable HTML invoice view

- [x] 2.1 Add the `.invoice-document` font rule (`'JetBrains Mono', 'Courier New', monospace` with `tabular-nums`) and `@media print` A4 rules in `src/index.css`, and verify in the browser that computed font-family is JetBrains Mono and the print preview is one A4 portrait page with no app chrome
- [x] 2.2 Build the `ReservationInvoice` component in `src/components/invoice/` with branded header, two-column metadata cards, full-width four-column charge table, coupon badge, highlighted total, signature lines, and footer note, and verify the fixture renders every specified label and value including `CHARGE / DESCRIPTION`, `RATE`, `UNIT / QTY`, `AMOUNT`, `Coupon Applied: SAVE10`, and `$912.18`
- [x] 2.3 Add the `?view=invoice` view switch and "Print Invoice" / "Back to booking" controls in `src/pages/reservation.jsx`, and verify both header invoice actions remain visible at desktop and phone widths and that the reservation state is preserved after returning

## 3. PDF redesign

- [x] 3.1 Register the self-hosted TTFs with jsPDF in `src/utils/invoicePdf.js` via `addFileToVFS`/`addFont` with a `courier` fallback, and verify every `doc.text()` call uses the registered family and that a PDF still downloads when font registration is forced to fail
- [x] 3.2 Replace the sample-inspired drawing code with the modern layout driven by the shared view model, and verify the downloaded A4 PDF contains the branded header, two-column metadata, itemized table, coupon badge above the total bar, two signature areas, and footer note on one page
- [x] 3.3 Make `downloadReservationInvoice()` async and await it in the header click handler, and verify the download is named `reservation-invoice-RE-2723.pdf` for that reservation and no unhandled promise rejection appears in the browser console

## 4. Cross-format verification

- [x] 4.1 Compare the HTML print preview and downloaded PDF for the SAVE10 fixture side by side, and verify identical metadata, charge rows, coupon amount, and total
- [x] 4.2 Open both outputs with empty reservation fields and with a deliberately long name/email, and verify `-` placeholders keep their labels, long values are clipped or wrapped, and neither layout breaks
- [x] 4.3 Toggle add-ons, change the rental duration, and apply SAVE10 and WELCOME5 in turn, then verify the HTML invoice total, PDF total, and on-screen Charges Summary total remain equal after every change
- [x] 4.4 Run `npm run build` and a final browser sweep at desktop, tablet, and phone widths in both themes, and verify no build errors, no horizontal page scrolling, and readable contrast for the header actions and invoice view
