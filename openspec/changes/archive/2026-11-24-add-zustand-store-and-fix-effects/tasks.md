# Tasks

## 1. Install Zustand and set up store file
- [x] 1.1 Run `npm i zustand` and verify it appears in `package.json` dependencies
- [x] 1.2 Create `src/store/useReservationStore.ts` with the store shape defined in the design (state: `products`, `collision`, `liability`, `rental`, `datePickup`, `dateReturn`, `weeks`, `days`; actions: `setProducts`, `setCollision`, `setLiability`, `setRental`, `setDatePickup`, `setDateReturn`, `computeWeeksDays`)
- [x] 1.3 Verify the store file parses without TypeScript errors (`npx tsc --noEmit`)

## 2. Refactor reservation.jsx to use the store
- [x] 2.1 Replace the local `useState` declarations for `products`, `collision`, `liability`, `rental`, dates, `weeks`, `days` with calls to `useReservationStore()`
- [x] 2.2 Add a `useEffect` with empty dependency array `[]` that calls `store.setProducts(mockCars)` once on mount (replaces the former infinite‑loop effect)
- [x] 2.3 Remove the old `callAxios` / `getDateRange` logic that is now handled by the store’s `computeWeeksDays` action
- [x] 2.4 Wire the `onChange` handlers from `AdditionalCharges` to store actions (`setCollision`, `setLiability`, `setRental`)
- [x] 2.5 Verify the component renders without a UI freeze after the change

## 3. Provide mock car data and update VehicleInfo
- [x] 3.1 Define a `mockCars` array (at least three objects with `id`, `type`, `make`) either inline in the store file or in a separate `mocks/cars.ts`
- [x] 3.2 Update `VehicleInfo` to read `products` from the store instead of receiving `props.data`
- [x] 3.3 Ensure the `<select>` options render the mock car data and “Select vehicle”/“No data!” fallbacks still work

## 4. Update sub‑components to read from the store
- [x] 4.1 `AdditionalCharges` – read `collision`, `liability`, `rental` from the store; call store actions on checkbox `onChange`
- [x] 4.2 `ChargesSummary` – read `weeks`, `days`, `collisionState`/`liabilityState`/`rentalState` (or the new store names) from the store; recompute totals when any flag changes
- [x] 4.3 `ReservationDetails` – if it receives any store‑derived props, update them to read from the store instead

## 5. Implement Download Invoice handler
- [x] 5.1 Install a lightweight PDF generation library (e.g., `jspdf` or use the existing SVG/Canvas approach that matches `Sample Invoice.pdf` style)
- [x] 5.2 Create a `downloadInvoice` function that reads the full reservation state from the store and renders a PDF template styled to match `src/assets/Sample Invoice.pdf`
- [x] 5.3 Add a “Download Invoice” button to `reservation.jsx` (or the parent) with an `onClick` that calls `downloadInvoice`
- [x] 5.3 Verify clicking the button triggers a browser download of a PDF file

## 6. Run lint, type‑check, and basic manual testing
- [x] 6.1 Run `npm run lint` (after installing ESLint if needed) and fix any new warnings introduced by the refactor
- [x] 6.2 Run `npx tsc --noEmit` to ensure no TypeScript errors
- [x] 6.3 Manually test the reservation flow: select a vehicle, toggle charges, adjust dates, click “Download Invoice” – confirm the UI stays responsive and the PDF download works

## 7. Archive and verify the change
- [x] 7.1 Run `openspec status --change "add-zustand-store-and-fix-effects"` to confirm all artifacts are `done`
- [x] 7.2 Optional: archive the change with `openspec archive --change "add-zustand-store-and-fix-effects"` if the project requires it
- [x] 7.3 Document any open questions or follow‑up items in the change’s `.openspec.yaml`

---
*End of tasks.*