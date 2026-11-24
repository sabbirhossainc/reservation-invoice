# Proposal

## Why

The reservation page is a dense three-column layout with fixed margins, inconsistent spacing, plain inputs, a manually editable reservation ID, and a "Discount" field that does not affect the total. The Charges Summary table also overflows horizontally at narrow widths, making the page hard to use on tablets and phones. Styling is locked to a single neutral palette, so a cool pearl canvas and a comfortable dark alternative are unavailable, and text, cards, and buttons are not defined with theme-aware contrast in mind.

## What Changes

- Add a top navigation header with a simple brand mark, "Car Reservation" title, supporting subtitle, and a "Download Invoice" button with a download icon.
- Introduce Plus Jakarta Sans (UI) and JetBrains Mono (numbers, dates, IDs) typography, plus Lucide React icons in section headings, fields, and actions.
- Add a light/dark theme toggle in the header with Sun/Moon icons and an accessible label; default to light, use a stored choice or system preference on first load, and persist subsequent selections.
- Apply a cool pearl light canvas (`#F5F7FA`) with white cards (`#FFFFFF`), navy text/actions (`#122033`), and blue accents (`#1D4ED8`), plus a dark navy alternative (`#0E1621` canvas, `#162231` cards, light text). Semantic theme tokens keep text, cards, inputs, buttons, and the summary readable together in both modes.
- Replace the three-column page with a responsive 12-column layout: eight columns of stacked form cards and four columns of sticky Charges Summary on desktop, stacking cleanly below desktop.
- Group related fields into two-column rows inside the cards: First/Last Name, Email/Phone, Pickup/Return Date, and Vehicle Type/Vehicle.
- Auto-generate a read-only `#RE-####` reservation ID badge instead of accepting manual entry.
- Remove the "Discount" input from Reservation Details.
- Add a "Promo / Coupon Code" input and Apply button in the Charges Summary; support the documented demo catalog `SAVE10` (10% off the pre-tax subtotal) and `WELCOME5` ($5 off the pre-tax subtotal), case-insensitively, with inline feedback for unknown or empty codes.
- Show the applied discount as a negative row and recalculate tax and total from the discounted subtotal in both the on-screen summary and the downloaded PDF.
- Rebuild the Charges Summary table so all columns fit at every screen size without horizontal scrolling.
- **BREAKING**: The store no longer exposes the free-text `discount`/`setDiscount` pair; consumers use the structured applied-coupon state and shared charge calculation instead.

## Capabilities

### New Capabilities

- `reservation-ui`: Presentation and interaction behavior of the reservation page, including header branding, typography/icons, responsive card layout, paired form fields, generated reservation ID, coupon entry, and overflow-free summary rendering.

### Modified Capabilities

- `reservation-store`: Replaces the free-text discount with an applied coupon record, keeps discount math in the shared charge calculation, and preserves PDF/on-screen total parity.

## Impact

- Code: `src/pages/reservation.jsx`, the four `src/forms/*` components, `src/tabular/summary.jsx`, `src/store/useReservationStore.ts`, `src/utils/reservationCharges.js`, `src/utils/invoicePdf.js`, `src/index.css`, `src/main.jsx`, a new `src/hooks/useTheme.js`, `index.html`, and Tailwind theme configuration.
- Dependencies: add `lucide-react`; load Plus Jakarta Sans and JetBrains Mono web fonts. Theme support uses CSS variables and the browser only; no additional runtime package is required. Existing React, Tailwind, Zustand, and jsPDF usage remains.
- Verification: no automated test runner exists; validate with `npm run lint`, `npx tsc --noEmit`, `npm run build`, manual checks of narrow/mobile and desktop layouts, a coupon-applied PDF download, and a light/dark sweep covering toggle behavior, reload persistence, and text/card/button contrast.
