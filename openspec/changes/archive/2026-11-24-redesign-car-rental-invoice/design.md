# Design

## Context

The app is React 18 + Vite 5 + Tailwind 3 with a Zustand reservation store. `src/utils/reservationCharges.js` is already the single source of rates and totals; `src/utils/invoicePdf.js` draws an A4 PDF directly with jsPDF using Helvetica, a recreated car-and-crown mark, and a light-grey right-hand table. `src/pages/reservation.jsx` snapshots the store and calls `downloadReservationInvoice()` from the header. The UI loads JetBrains Mono and Plus Jakarta Sans from Google Fonts, but only `.numeric` and `.badge` use the mono stack; there is no HTML invoice document, no print stylesheet, and no router. See `proposal.md` for motivation and the spec deltas for required behavior.

## Goals / Non-Goals

**Goals:**

- One canonical invoice data shape consumed by both the printable HTML view and the PDF.
- Identical document sections and JetBrains Mono typography in both outputs, with A4 print rules for HTML.
- PDF generation stays client-side and downloads as `reservation-invoice-<RESERVATION-ID>.pdf` (e.g. `reservation-invoice-RE-2723.pdf`).

**Non-Goals:**

- Changing the booking form's sans-serif UI typography (the `reservation-ui` page spec still requires it).
- Adding state fields or form inputs for additional drivers, payment type, or referral; these remain `-` placeholders.
- Adding a router, test framework, backend, or new runtime npm dependency.
- Supporting US Letter or changing the `#RE-####` ID format or coupon rules.

## Decisions

### 1. Shared invoice view model

Add `src/utils/invoiceData.js` with a builder that accepts the store snapshot and returns a plain, already-formatted document model: reservation ID, derived issue date and status, left/right metadata groups, ordered charge rows, coupon row, total, signature labels, and footer copy. It calls `calculateReservationCharges()` for money values and a shared `asText()`/`money()` formatter for `-` placeholders and two-decimal amounts. Duration becomes `1 Week 5 Days` with singular/plural handling. Issue date is the local render date and status is `Confirmed`; neither is persisted.

*Why:* the current PDF formats values inline while the on-screen summary formats them separately, which is how drift happens. Rendering both outputs from one model makes the total-consistency requirement structural. *Alternative rejected:* letting the HTML component and the jsPDF module each read the store and format values independently.

### 2. Font strategy: self-host the exact TTF files and register them with jsPDF

Put JetBrains Mono Regular and Bold TTF files under `public/fonts/` (SIL OFL license notice included). The HTML document root uses a dedicated `.invoice-document` rule with the exact stack `'JetBrains Mono', 'Courier New', monospace` and `font-variant-numeric: tabular-nums`. The PDF loader fetches those same TTF files, converts them to base64, registers them via jsPDF `addFileToVFS`/`addFont`, and uses the family name for every `doc.text()` call; if registration fails it falls back to jsPDF's built-in `courier`.

*Why:* the Google Fonts CSS link cannot be consumed by jsPDF, and using the same binary for both renderers keeps metrics consistent. *Alternative rejected:* keeping the CDN font for HTML and leaving the PDF on Helvetica/Courier, which would violate the all-text font requirement. *Trade-off:* PDF download becomes async (`downloadReservationInvoice` returns a promise and the click handler awaits it), and two small font files ship with the app.

### 3. HTML invoice as a view, not a hidden print fragment

Add a `ReservationInvoice` component under `src/components/invoice/` built from small presentational pieces (header, metadata grid, charge table, signature/footer). `reservation.jsx` owns a `view` state backed by the `?view=invoice` query parameter: the new "Print Invoice" header action switches to the invoice view, a "Back to booking" control switches back, and `history.pushState` keeps browser back/forward working without a router package. Print rules in `src/index.css` declare `@page { size: A4 portrait; margin: 12mm; }`, hide app chrome, show only `.invoice-print-root`, and use `print-color-adjust: exact` for the badge and total bar.

*Why:* a real view is inspectable and testable at any viewport, and the print stylesheet can be verified in the browser print dialog. *Alternative rejected:* rendering a second hidden copy of the invoice inside the booking page and toggling visibility only at print time.

### 4. PDF layout geometry

Keep A4 portrait with ~36pt margins. Replace the sample-inspired left/right columns with: a full-width header band; a two-column metadata block of bordered cards; one full-width charge table with column proportions roughly 50/16/16/18 and right-aligned amounts; a coupon badge row immediately above a filled TOTAL bar; and a signature/footer area pinned near the bottom of the single page. Reuse the existing `fitText()` clipping helper and `drawLogo()` mark, but restyle colors to match the app's navy/pearl/accent tokens.

*Why:* the fixed number of rows (daily, weekly, waiver, liability, tax, optional coupon, total) fits one page, so deterministic coordinates are simpler and more reliable than flowable pagination. *Alternative rejected:* an auto-layout engine or a second page, which adds complexity without benefit here.

### 5. Fixture data stays out of production code

The request's sample values are a QA fixture used to populate the form during verification: `#RE-2723` is illustrative because the store generates its own ID; pickup `2026-11-12`, return `2026-11-24`, SUV/Toyota, name/email/phone, all add-ons on, and `SAVE10` produce `$912.18`. No demo mode or hardcoded sample object is added to the app.

## Risks / Trade-offs

- [Risk] jsPDF font registration fails or the TTF files are not served in the production build → Mitigation: verify `dist/fonts` after `npm run build`, catch registration errors, and fall back to `courier` so the download still completes.
- [Risk] Async PDF export confuses users if the click appears inert → Mitigation: the handler awaits the promise and the existing button remains disabled only for the duration of generation; no UI API change is needed.
- [Risk] Long renter/driver values overflow fixed PDF columns → Mitigation: keep `fitText()` with ellipsis, wrap HTML cells, and verify with a deliberately long name/email fixture.
- [Risk] Browser print output differs from the PDF (margins, badge colors) → Mitigation: explicit `@page` rules, `print-color-adjust: exact`, and a manual print-preview comparison against the fixture.
- [Risk] Two renderers drift in the future → Mitigation: both consume the shared view model; verification compares header, metadata, charge rows, coupon, and total side by side.

## Migration Plan

1. Add the self-hosted font files and the shared invoice view model; confirm the build copies the fonts.
2. Add the printable HTML invoice component, print styles, and the header view switch.
3. Refactor `src/utils/invoicePdf.js` to draw from the view model with the registered font, then update the download handler in `src/pages/reservation.jsx` to await it.
4. Verify `npm run build`, the print preview at desktop/phone widths, and a downloaded PDF with and without coupons.
5. Rollback by reverting the change; there is no persisted data or store-shape migration.
