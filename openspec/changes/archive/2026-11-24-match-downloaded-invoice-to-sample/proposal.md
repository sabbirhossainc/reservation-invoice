# Proposal

## Why

The Download Invoice button currently produces a flat, single-column text PDF that does not resemble `src/assets/Sample Invoice.pdf`, even though the existing `reservation-store` spec already requires the PDF to be styled after that sample. Users receive an unbranded, hard-to-scan document instead of a reservation sheet that mirrors the sample's familiar two-column layout.

## What Changes

- Replace the flat text-only jsPDF output with a structured two-column invoice layout modeled on the sample: header/logo and company block, left-hand reservation/customer/vehicle details, right-hand charge summary table, and footer/signature space.
- Render the PDF on A4 portrait with consistent margins, sans-serif typography, bold uppercase section headings, and a light-grey charge summary table.
- Recreate the car-and-crown mark with simple jsPDF shapes/text; do not add or extract image assets.
- Populate the PDF from the existing Zustand reservation store, including reservation ID, customer name/email/phone, vehicle, pickup/return dates, duration, charge rows, and total.
- Keep the sample's unrelated static company details, hourly charges, legal waiver paragraphs, and fixed RA number out of the generated PDF; follow the sample's layout and styling only.
- Reuse a single charge calculation for the on-screen summary and the PDF so displayed and downloaded totals stay in sync.
- Non-breaking: store fields, form components, and the Download Invoice trigger remain unchanged.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `reservation-store`: The "Download invoice button generates a PDF" requirement gains concrete, verifiable layout and content expectations (A4, two-column, sample-inspired design) in place of the vague "style of" wording.

## Impact

- Code: `src/pages/reservation.jsx` for the PDF builder; optionally a small shared charge helper also used by `src/tabular/summary.jsx`.
- Dependencies: uses the existing `jspdf` dependency; no new runtime packages.
- Assets: `src/assets/Sample Invoice.pdf` remains a design reference only; no image extraction or new asset files.
- Verification: no automated test runner exists; validate by generating a sample PDF in the browser and by running `npm run lint` and `npx tsc --noEmit`.
