# Repository instructions

## Verify before finishing
- Run `npm run lint` then `npm run build`. There is no test script and no test files; `tsconfig.json` only covers `src/store/**/*.ts` and no npm script runs it, so do not claim typechecking happened.
- Playwright is a dev dependency; use it for quick responsive and print-preview checks when changing UI.

## Architecture that is easy to get wrong
- Single-page React 18 / Vite 5 app with no router. `src/pages/reservation.jsx` switches booking and invoice views with `?view=invoice` via `history.pushState` and `popstate`; a direct `?view=invoice` load must show no header.
- `src/store/useReservationStore.ts` is the single source of truth. `mockCars` lives there; there is no API client. Read the store instead of adding fetch calls.
- Rates and coupons live only in `src/utils/reservationCharges.js`; `src/utils/invoiceData.js` builds the shared view model for the HTML invoice. Keep totals derived from these rather than duplicating them in components.
- Export is browser print only: "Print / Save as PDF". Do not reintroduce a Download Invoice button or jsPDF; the README and archived specs still mention it and are stale.
- Print isolation depends on `.invoice-print-root` and the `@media print` rules in `src/index.css`; keep invoice content inside that wrapper.

## Styling and theming
- Theme colors are CSS variables in `src/index.css` consumed by `tailwind.config.js` via `rgb(var(--color-*) / <alpha-value>)`. A new theme color needs both the config entry and light/dark variable values.
- Shared control classes (`.field-control`, `.btn-primary`, `.btn-secondary`, `.badge`) live in `src/index.css`; change control sizing globally there, not in every form.
- Dark mode is applied by the inline script in `index.html` before React mounts using the `car-reservation-theme` localStorage key. `src/hooks/useTheme.js` persists toggles and syncs `meta[name="theme-color"]`. Do not move initialization into React.

## Docs and metadata
- `openspec/specs/*/spec.md` are the current behavior specs; update them when behavior changes. Everything under `openspec/changes/archive/` is history, not current requirements.
- `Explored.md` is an old pre-store exploration snapshot; do not treat its bug list as current.
- Canonical and Open Graph URLs in `index.html` use `https://invoiceappui.netlify.app/`; the README links the same site. Update both if the site moves.
