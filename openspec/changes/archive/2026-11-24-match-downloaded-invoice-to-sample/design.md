# Design

## Context

`src/pages/reservation.jsx` currently builds the PDF inline in `downloadInvoice()`: a default jsPDF document with ~20 sequential `doc.text()` calls and no layout abstraction. `src/tabular/summary.jsx` independently recomputes the same charge values with the same hard-coded rates. `src/assets/Sample Invoice.pdf` is a single flattened image showing a two-column reservation sheet; it is only a design reference and is not imported by the app. The project has no test runner and uses jsPDF 4.2.1 already. Per the agreed scope, the PDF follows the sample's layout and styling only, uses A4 portrait, and recreates the logo with primitives.

## Goals / Non-Goals

**Goals:**

- Produce a one-page A4 PDF whose visual hierarchy (header, two columns, grey charge table, footer/signature area) matches the sample.
- Move PDF construction out of the React component into a small, focused module with reusable drawing helpers.
- Have one charge-calculation source consumed by both the on-screen summary and the PDF.
- Keep the existing store shape, form fields, and download trigger intact.
- Verify the result through a populated and an empty reservation download plus the existing lint/typecheck commands.

**Non-Goals:**

- Copying the sample's company name/address, RA number, hourly charges, waiver paragraphs, or legal notices.
- Extracting or adding image assets; the logo is drawn with jsPDF shapes and text.
- Changing the sample's non-standard page size, adding US Letter, or adding a print stylesheet.
- Adding a test framework, a server-side PDF service, or new npm dependencies.

## Decisions

| Decision | Rationale | Alternatives considered |
|----------|-----------|-------------------------|
| Keep client-side jsPDF and extract a dedicated invoice module (e.g. `src/utils/invoicePdf.js`) | The current inline handler mixes layout concerns into the page component; a module keeps coordinates and helper functions in one place and makes the download handler a single call. | Keep everything inline in `reservation.jsx` (current state, hard to maintain); render HTML to canvas (adds `html2canvas` and rasterises text). |
| Use A4 portrait (595 × 842 pt) with fixed margins and two independent column cursors | Chosen by the user; A4 is also jsPDF's default. Separate y-cursors prevent left/right content from colliding and make the one-page constraint explicit. | Match the sample's ~715 × 698 pt custom page (rejected by user); US Letter (rejected by user). |
| Add a shared charge helper (e.g. `src/utils/reservationCharges.js`) used by both `summary.jsx` and the PDF module | Removes the duplicated rate calculations that could make the on-screen and downloaded totals disagree. The existing formulas and rates ($99/day, $390/week, $9 waiver, $15 liability, 11.5% tax, discount shown but not deducted) are preserved exactly. | Keep two copies (current behaviour, drift risk); move calculations into the Zustand store (larger change than needed for this scope). |
| Recreate the car-and-crown mark with jsPDF primitives and a generic "Reservation" title | Satisfies the sample-inspired header without adding binary assets or reproducing the sample's branding. Blue/gold-ish fill and stroke colors echo the sample palette. | Extract the logo bitmap from the sample PDF into `src/assets/` (explicitly out of scope); text-only header (less visually faithful). |
| Draw sections with small helpers (`sectionHeading`, `labelValue`, `tableRow`, `horizontalRule`, `signatureLine`) | Keeps spacing, fonts, and colors consistent across the many sample-like sections and reduces coordinate mistakes. | Hand-place every text call with absolute coordinates (fragile and repetitive); use jsPDF autoTable (new plugin/dependency for a small fixed table). |
| Use `doc.splitTextToSize` or bounded truncation for long names, emails, and vehicle values | Prevents text from bleeding into the adjacent column or off the A4 page. | Allow unrestricted text (risk of overlap); silently drop values (fails the content requirement). |
| Verify manually with `npm run lint`, `npx tsc --noEmit`, and two downloaded PDFs | No automated test runner exists in the project, so build/type/lint plus direct PDF inspection is the practical verification path. | Introduce Vitest and a PDF parser (new dependencies, outside scope). |

## Risks / Trade-offs

- **[Risk] Primitive logo looks less polished than the sample artwork** → Mitigation: keep it small and simple, use the sample's blue/gold palette, and review the generated PDF visually.
- **[Risk] A4 is taller and narrower than the sample's near-square page** → Mitigation: adapt column widths and vertical rhythm to A4; keep all sections on one page with generous but reduced margins.
- **[Risk] Long customer or vehicle values overflow the left column** → Mitigation: wrap or truncate to a fixed width before drawing each value.
- **[Risk] Sharing the charge calculation changes the on-screen summary** → Mitigation: preserve current formulas and rates exactly, then compare the summary before and after the refactor.
- **[Risk] No automated PDF assertions** → Mitigation: include explicit manual verification steps for both a fully populated and an empty reservation in tasks.

## Migration Plan

No data or API migration is required. Implementation proceeds in this order: add the charge helper, point `summary.jsx` at it, add the invoice module, replace `downloadInvoice()` with a call to it, then remove the old inline drawing code. Rollback is a straightforward revert of the change; no persisted state or backend is affected.
