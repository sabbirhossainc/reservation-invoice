# Proposal

## Why

The reservation flow in `reservation.jsx` suffers from three interrelated problems that degrade the user experience and hinder further development:

1. **Infinite `useEffect` loop** – the effect has no dependency array, causing it to run after every render, fetch the (currently dead) Heroku API, trigger a state update, and re‑render, freezing the UI.
2. **Dead external API** – the Heroku endpoint returns “No such app”, so `VehicleInfo` always displays “No data!” and the car‑selection UI is non‑functional.
3. **Missing “Download Invoice” feature** – the Print/Download button has no handler, and there is no way to persist or export the reservation summary, even though a `Sample Invoice.pdf` asset exists in the project.

These issues make the reservation form unusable for selecting vehicles and prevent the project from delivering its intended invoice‑generation capability. Adding a lightweight state‑management store (Zustand) will centralise the reservation data, allow the API fetch to be performed once, and provide a single source of truth for a future download feature.

## What Changes

- **Add a Zustand store** (`src/store/useReservationStore.ts`) that holds: `products` (car list), `collision`, `liability`, `rental` flags, `datePickup`/`dateReturn`, computed `weeks`/`days`, and the total charge total. The store will be the sole place where the API data lives, and event handlers will `set` values through its actions.
- **Fix the `useEffect` loop** by adding an empty dependency array `[]` and moving the fetch logic into the store’s init, so it runs only once on mount.
- **Replace the dead Heroku API with a mock data source** – an inline mock array (or a local `cars.json`) that `VehicleInfo` can consume, restoring the car‑selection UI.
- **Implement a “Download Invoice” button** that generates a PDF/SVG in the visual style of `src/assets/Sample Invoice.pdf` and triggers a browser download. The button will read the full reservation state from the store and render a static template.
- **Update sub‑components** (`VehicleInfo`, `AdditionalCharges`, `ChargesSummary`) to read the relevant slices of state from the store instead of receiving props from the parent, eliminating prop‑drilling.

## Capabilities

### New Capabilities

- `invoice-app/reservation-store`: Centralised Zustand‑based state for the car‑rental reservation flow, providing a single source of truth for products, charge flags, dates, and computed totals. This capability owns the requirements for API mocking, state persistence, and invoice‑generation rendering.

### Modified Capabilities

*(none – no existing spec‑level behaviour is being changed; the change is a refactor + feature addition)*

## Impact

- **Code**: `src/pages/reservation.jsx`, `src/forms/vehicleInfo.jsx`, `src/forms/additionalCharges.jsx`, `src/tabular/summary.jsx` will be rewritten to consume the store via `useReservationStore()`.
- **Dependencies**: `zustand` will be added as a dev dependency (`npm i zustand`).
- **API**: The dead Heroku call is replaced by a local mock; no external service change.
- **User experience**: The UI freeze disappears, vehicle options appear, and users can download an invoice that matches the project’s existing styling.
- **Future work**: The store shape makes it easy to add persistence (localStorage/back‑end), multi‑step wizards, or historic reservation retrieval.

---
*End of proposal.*