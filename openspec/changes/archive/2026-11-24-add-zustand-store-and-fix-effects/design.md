# Design

## Context

The reservation flow lives in `src/pages/reservation.jsx` and currently owns eight `useState` calls (`products`, `collision`, `liability`, `rental`, `datePickup`, `dateReturn`, `weeks`, `days`). These are threaded down as props to `VehicleInfo`, `AdditionalCharges`, `ChargesSummary`, and `ReservationDetails`. The component also contains a `useEffect` with no dependency array that fetches a dead Heroku endpoint, causing an infinite render loop. A `Sample Invoice.pdf` asset exists in `src/assets/` but is never rendered.

## Goals / Non-Goals

**Goals**
- Centralise all reservation‑wide state in a **Zustand** store so that every component reads from a single source of truth.
- Fix the infinite `useEffect` loop by performing the API fetch once (or with a mock) and stabilising the UI.
- Replace the dead Heroku API with a **mock car list** so the vehicle‑selection UI works again.
- Add a **Download Invoice** button that generates a PDF in the visual style of `src/assets/Sample Invoice.pdf` and triggers a browser download.
- Reduce prop‑drilling: sub‑components (`VehicleInfo`, `AdditionalCharges`, `ChargesSummary`) will read their needed state directly from the store.

**Non-Goals**
- Changing the visual design of the invoice beyond the existing `Sample Invoice.pdf` style.
- Adding a back‑end or persistent storage for reservations (future work).
- Refactoring the entire form validation strategy; only the minimal changes required to wire the store are in scope.

## Decisions

| Decision | Rationale | Alternatives considered |
|----------|-----------|------------------------|
| **Use Zustand instead of React Context** | Zustand requires less boilerplate (no Provider at root, no `useReducer`), is ~2 KB gzipped, and gives direct `set` access from anywhere in the component tree. Context would need a `Provider` wrapper and reducers for the same scope. | React Context + `useReducer` (more boilerplate), Redux Toolkit (overkill for 10 components), MobX (extra dependency, larger bundle). |
| **Inline mock data instead of a separate JSON file** | Keeps the change self‑contained; no new network request or build step. The mock can be updated later if a real API is re‑added. | Separate `cars.json` file fetched with `import` – adds a file to maintain; inline array is simpler for a prototype. |
| **Store actions that return `void` and update state synchronously** | Guarantees that UI updates happen immediately after an event handler (e.g., checkbox toggle), which is essential for the “hidden‑charge” row logic. | Asynchronous action creators (e.g., Thunk) – unnecessary for purely local state; add complexity without benefit. |
| **Derive `weeks`/`days` from `datePickup`/`dateReturn` inside the store** | Keeps the date‑computation logic in one place, avoiding the duplicated `new Date()` / `Math.round` calculations that exist in the current `reservation.jsx`. | Keep computation in `reservation.jsx` only – would duplicate code and make the store an incomplete source of truth. |
| **Download invoice renders a static PDF template using `jsPDF`/`svg` in the browser** | Matches the existing `Sample Invoice.pdf` aesthetic without needing a back‑end PDF generator. The client‑side approach is zero‑config and works offline. | Server‑side PDF generation (Node/Express) – adds a new dependency and deployment concern; out of scope for this change. |

## Risks / Trade-offs

- **[Risk] Zustand store state is lost on page reload** – the reservation data will be gone if the user refreshes.  
  **Mitigation** – future work can persist the store to `localStorage` or a backend; not required for the current change.

- **[Risk] Mock data may not match the shape the original API would have returned** – if a real API is re‑added later, the mock may need updating.  
  **Mitigation** – keep the mock’s TypeScript shape simple and document where it can be expanded.

- **[Risk] Adding `zustand` as a new dependency increases the bundle size** – although it is minimal, every extra package matters for performance‑critical apps.  
  **Mitigation** – Zustand’s gzipped size is ~2 KB, which is negligible for this project.

- **[Risk] The “Download Invoice” feature renders a PDF client‑side; very large reservation data could cause performance concerns** – not an issue with the current small state, but something to keep in mind if the form grows.  
  **Mitigation** – keep the rendered template simple; if needed, switch to a server‑generated PDF later.

## Open Questions

- Should the mock car data be defined as a `const` inside the store file, or in a separate `mocks/cars.ts` that the store imports? (Both are acceptable; choose whichever keeps the store file tidy.)

--- 

*End of design.*