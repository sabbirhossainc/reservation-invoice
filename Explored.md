# Explored.md — invoice‑app codebase exploration

**Generated:** 2026‑11‑22  
**Project:** invoice-app (React + Vite, Tailwind‑CSS)  
**OpenSpec root:** `C:\Users\shr47\OneDrive\Desktop\invoice-app\openspec`

---

## 1. Project Overview
- Tech stack: React 18, Vite 5, Tailwind‑CSS 3, axios.
- OpenSpec: spec‑driven schema, currently **no active changes** / **no specs**.
- Git: 12 commits on `main`; last commit "Update info" modified `README.md`.
- No build/lint globals installed (`npm run lint` fails).

## 2. Component Map
| File | Role |
|------|------|
| `src/App.jsx` | Root wrapper → `<Reservation/>` |
| `src/main.jsx` | ReactDOM render entry |
| `src/pages/reservation.jsx` | Main container; holds all state, fetches API |
| `src/forms/customerInfo.jsx` | Static personal‑info form |
| `src/forms/reservationDetails.jsx` | Date picker, discount input |
| `src/forms/vehicleInfo.jsx` | Populates vehicle selects from API data |
| `src/forms/additionalCharges.jsx` | Checkboxes for optional charges |
| `src/tabular/summary.jsx` | Charge table + grand total |
| `src/index.css` | Tailwind directives + root font |
| `index.html` | Entry HTML |

## 3. Identified Issues / Bugs
1. **Infinite `useEffect` loop** – no dependency array; API call re‑triggers render → UI freeze. (`reservation.jsx:117‑120`)
2. **Dead API** – Heroku endpoint returns “No such app”; `VehicleInfo` always shows “No data!”.
3. **Hidden‑class `NaN` bug** – `"hidden" - "hidden"` yields `NaN`; Tailwind class `NaN` does nothing, so rows may not hide/show as intended. (`reservation.jsx:37‑65`)
4. **Print/Download button has no handler** – decorative only. (`reservation.jsx:128‑130`)
5. **Forms have `action="#"` but no submit button** – no way to submit data.
6. **`required="true"` string vs `required=""`** – inconsistent React boolean prop usage.
7. **Date diff uses local `Date` without timezone handling** – possible DST off‑by‑one errors.
8. **PDF “Sample Invoice.pdf” present but never referenced** – likely intended for print feature.
9. **ESLint not available** – `npm run lint` fails.
10. **Tailwind color classes defined** (primary palette) – fine as‑is.

## 4. Open Questions
- **Q1:** Replace dead API with mock data, or make UI functional without it?
- **Q2:** What should the “Print / Download” button actually do? (PDF generation, `window.print()`, download of summary?)
- **Q3:** Switch hidden‑charge rows to boolean‑based conditional classes instead of string manipulation?
- **Q4:** Is this a prototype needing only client‑side UI, or does it need form submission / backend persistence?
- **Q5:** Fix `useEffect` dependency array to stop the infinite loop?
- **Q6:** Install ESLint and standardise `required` prop usage?

## 5. Quick‑win Recommendations
1. Add `[]` (or `[products]`) as the `useEffect` dependency array.
2. Provide a mock cars list or remove the API call; update `VehicleInfo` accordingly.
3. Replace the `"-" string hack` with a boolean flag + Tailwind conditional class.
4. Give the Print/Download button an `onClick` (e.g., `window.print()`).
5. Run `npm install -D eslint` and run the linter.
6. Standardise `required` across all forms.

---

*End of exploration.*

## 6. State Management Plan (as of 2026‑11‑22)

### Why consider a store?
The reservation flow currently lives in a single `reservation.jsx` component with ~ 8 `useState` calls, a `useEffect` that has no dependency array (causing an infinite loop), and many props drilled down to sub‑components (`VehicleInfo`, `AdditionalCharges`, `ChargesSummary`, etc.).  Adding a lightweight state‑management solution can centralise the data, eliminate prop‑drilling, and make the “Print / Download” feature easier to implement.

### Options evaluated
| Approach | Code‑change size | Impact on current bugs | Future‑proofing |
|----------|------------------|------------------------|-----------------|
| **Keep local `useState` + fix bugs** | Small (fix effect deps, NaN hack, print handler) | Fixes the two most pressing bugs; no new dependency. | Limited – prop‑drilling may return as the app grows. |
| **React Context only** | Medium (create context, wrap root, replace some `useState` with `useContext`) | Eliminates prop‑drilling; still no central store for derived totals. | Better, but manual boilerplate as state grows. |
| **Zustand (recommended)** | Medium‑small (install ~2 KB, add store file, replace a few `useState` calls) | Can **eliminate** the infinite `useEffect` loop, give a single place for the print data, and make future persistence easy. | Very good – easy to add middleware, devtools, time‑travel, or persist to `localStorage`. |
| **Redux Toolkit** | Larger (install redux, configure store, provide wrapper) | Same benefits as Zustand but more boilerplate; probably overkill for 10 components. | Good for larger apps; may be unnecessary here. |

### Recommended path
1. **First, apply the three quick‑win bug fixes** (effect‑dep fix, replace the `"-" string hack`, add a print‑button handler).  
2. **If, after those fixes, the component tree still feels tangled or you need the print button to access the full summary without threading props**, add **Zustand** as described below.  
3. **Do not add a store before fixing the existing bugs** – the infinite effect and the NaN class bug are the primary blockers; a store won’t magically resolve them.

### Minimal Zustand implementation sketch
```bash
npm i zustand
```
```tsx
// src/store/useReservationStore.ts
import create from 'zustand';

type ReservationState = {
  products: any[];
  collision: boolean;
  liability: boolean;
  rental: boolean;
  datePickup: string;
  dateReturn: string;
  weeks: number;
  days: number;

  setProducts: (data: any[]) => void;
  setCollision: (val: boolean) => void;
  setLiability: (val: boolean) => void;
  setRental: (val: boolean) => void;
  setDatePickup: (val: string) => void;
  setDateReturn: (val: string) => void;
  computeWeeksDays: () => void;
  reset: () => void;
};

export const useReservationStore = create<ReservationState>((set, get) => ({
  products: [],
  collision: true,
  liability: false,
  rental: false,
  datePickup: '',
  dateReturn: '',
  weeks: 0,
  days: 0,

  setProducts: (data) => set({ products: data }),
  setCollision: (val) => set({ collision: val }, () => get().computeWeeksDays()),
  setLiability: (val) => set({ liability: val }),
  setRental: (val) => set({ rental: val }),
  setDatePickup: (val) => set({ datePickup: val }, () => get().computeWeeksDays()),
  setDateReturn: (val) => set({ dateReturn: val }, () => get().computeWeeksDays()),
  computeWeeksDays: () => {
    const { datePickup, dateReturn } = get();
    const d1 = new Date(datePickup);
    const d2 = new Date(dateReturn);
    const diffMs = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(diffDays / 7);
    const days = diffDays % 7;
    set({ weeks, days });
  },
  reset: () => set({
    products: [],
    collision: true,
    liability: false,
    rental: false,
    datePickup: '',
    dateReturn: '',
    weeks: 0,
    days: 0,
  }),
}));
```
Then wrap the `Reservation` component (or the whole app) with the store provider, and replace the local `useState` calls in `reservation.jsx` with `useReservationStore()` reads/writes.  Sub‑components (`VehicleInfo`, `AdditionalCharges`, `ChargesSummary`) can also read from the store directly, removing the need to receive many props from the parent.

### Next steps (if you choose to adopt Zustand)
- [ ] Apply the three quick‑win bug fixes first.
- [ ] Add `npm i zustand` to the project.
- [ ] Create `src/store/useReservationStore.ts` with the sketch above.
- [ ] Refactor `reservation.jsx` to use `useReservationStore` for `products`, date states, and charge flags.
- [ ] Update `VehicleInfo`, `AdditionalCharges`, `ChargesSummary` (and any other components) to read the relevant slices of state from the store instead of receiving props.
- [ ] Add a simple `onClick` to the Print/Download button that reads the store and either calls `window.print()` or generates a PDF.
- [ ] Run the linter (`npm install -D eslint && npx eslint .`) to verify no new errors.
- [ ] If the app outgrows Zustand, consider migrating to React Context or Redux Toolkit; the store shape will be relatively stable, making the transition easier.

---
*End of exploration.*