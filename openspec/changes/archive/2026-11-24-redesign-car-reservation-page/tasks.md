# Tasks

## 1. Setup: fonts, icons, and theme

- [x] 1.1 Install `lucide-react` and verify it appears in `package.json` dependencies and resolves in a dev build
- [x] 1.2 Add preconnected Google Fonts links for Plus Jakarta Sans and JetBrains Mono in `index.html` and verify both font families are requested on page load with system fallbacks if blocked
- [x] 1.3 Extend `tailwind.config.js` with `sans`/`mono` font stacks, `darkMode: 'class'`, and semantic color mappings, and update `src/index.css` with pearl/light and dark navy variable palettes plus base typography, verifying the rendered page uses the new fonts, tabular figures, and theme tokens
- [x] 1.4 Add `src/hooks/useTheme.js` and an inline boot script in `index.html` that resolves stored preference then system scheme, applies the root class before first paint, and persists toggles, verifying both modes reload without a flash and storage failures fall back gracefully

## 2. Coupon calculation and reservation state

- [x] 2.1 Add the case-insensitive demo coupon catalog and resolver to `src/utils/reservationCharges.js` for `SAVE10` (10%) and `WELCOME5` ($5), verifying unknown codes resolve to no coupon
- [x] 2.2 Change the shared charge calculation to return `subtotal`, `discount`, `discountedSubtotal`, `taxAmount`, and `total` after applying the coupon, verifying with a one-off Node import that `SAVE10` discounts 10% of pre-tax subtotal, `WELCOME5` never exceeds the subtotal, and tax uses the discounted base
- [x] 2.3 Replace `discount`/`setDiscount` in `src/store/useReservationStore.ts` with a resolved `appliedCoupon` record and `applyCoupon` action, verifying a new session has no coupon, reapplying replaces the old coupon, and `reset()` clears it
- [x] 2.4 Generate a `#RE-####` `reservationId` once during store initialization and remove the public ID setter, verifying the value is stable across renders and not editable from the UI

## 3. Page shell and form cards

- [x] 3.1 Add a shared card/section-heading/field pattern with Lucide icons and rebuild `src/pages/reservation.jsx` with the brand header, "Car Reservation" title, subtitle, download action, Sun/Moon theme toggle, responsive `1`/`12` column grid, and sticky summary region, verifying the header, toggle, and CTA remain visible at desktop and phone widths and the toggle changes the active theme
- [x] 3.2 Restyle `src/forms/customerInfo.jsx` with paired First/Last Name and Email/Phone fields plus user/mail/phone icons, verifying the pairs share rows on desktop and stack on phones while required-field behavior is unchanged
- [x] 3.3 Restyle `src/forms/reservationDetails.jsx` with paired Pickup/Return Date fields, calendar icons, read-only reservation ID badge, and duration display, verifying no free-text Discount input remains and ID is not editable
- [x] 3.4 Restyle `src/forms/vehicleInfo.jsx` with paired Vehicle Type/Vehicle selectors and car icons, verifying the existing mock options and selections still flow into the store
- [x] 3.5 Apply semantic theme tokens to all shared card, heading, field, badge, and button styles, verifying no hard-coded light-only surface or text classes remain in the themed UI via a source search

## 4. Charges Summary and coupon interaction

- [x] 4.1 Rebuild `src/tabular/summary.jsx` as a fixed-width, overflow-free table with theme-aware surface/text/border tokens, compact responsive padding, wrapping labels, right-aligned mono amounts, and a negative discount row that appears only when a coupon is active, verifying all columns fit at the smallest supported width without a scrollbar in either theme
- [x] 4.2 Add the "Promo / Coupon Code" input and Apply button inside the summary card, wired to `applyCoupon` with inline success/invalid feedback, verifying `save10` and `WELCOME5` apply case-insensitively and empty/unknown codes show an error without changing the total
- [x] 4.3 Verify the on-screen summary updates its discount row, tax, and Total immediately after a valid coupon is applied, after a charge flag toggles, and after dates change

## 5. Invoice alignment

- [x] 5.1 Update the `downloadInvoice` handoff in `src/pages/reservation.jsx` to pass `appliedCoupon` instead of the removed discount string, verifying no stale `discount`/`setDiscount` references remain via search
- [x] 5.2 Update the Discount row in `src/utils/invoicePdf.js` to display the applied coupon code and formatted negative discount amount, verifying the PDF still fits one A4 page with and without a coupon
- [x] 5.3 Verify a downloaded PDF's printed total matches the on-screen Total after applying `SAVE10`, applying `WELCOME5`, toggling an add-on, and changing the rental duration

## 6. Integration verification

- [x] 6.1 Run `npm run lint` and resolve all reported errors and warnings
- [x] 6.2 Run `npx tsc --noEmit` and resolve all type errors
- [x] 6.3 Run `npm run build` and confirm the production bundle is generated successfully
- [x] 6.4 Perform a final browser sweep at desktop, tablet, and phone widths in both light and dark themes, confirming the 8/4 sticky layout, paired fields, generated ID badge, coupon feedback, overflow-free summary, working Download Invoice CTA, toggle/reload persistence, and readable contrast for text, cards, and buttons
