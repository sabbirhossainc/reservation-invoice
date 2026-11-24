# Design

## Context

The reservation page is a Vite/React 18 app using Tailwind CSS 3 and a Zustand store. `src/pages/reservation.jsx` renders three equal `col-span-4` columns inside a fixed `mx-36 my-12` wrapper; each form component repeats its own heading and bordered, single-column field stack. `src/tabular/summary.jsx` uses `overflow-auto` with `whitespace-no-wrap`, which causes the horizontal scrolling. The store keeps `discount` as arbitrary text: the summary ignores it and the PDF prints it in the Rate column with `-` as the amount. `src/utils/reservationCharges.js` is already the shared rate source for the summary and PDF, so it is the natural place for coupon math. `tailwind.config.js` currently extends only a `primary` indigo palette and `src/index.css` sets a single Inter-based font stack, so there are no semantic surface/text tokens for a second theme. There is no test runner or backend; verification is lint, typecheck, build, and manual browser/PDF checks. See `proposal.md` for motivation and the spec deltas for observable requirements.

## Goals / Non-Goals

**Goals:**

- Restructure the page into a restrained, reusable card-based UI with one responsive grid and a sticky billing rail.
- Support a cool pearl light theme and a readable dark navy theme through shared semantic color tokens, with a persisted header toggle.
- Make coupon selection a real state transition whose discount and tax effects appear identically on screen and in the PDF.
- Keep every summary column readable without horizontal scrolling, including on small phones.
- Preserve existing rates, mock vehicle data, date-duration logic, and the sample-inspired PDF layout.

**Non-Goals:**

- Adding a coupon backend, redemption tracking, authentication, or persisted reservations.
- Redesigning the PDF's two-column sample-inspired layout or changing the invoice filename.
- Changing daily/weekly addition rates, insurance prices, or the 11.5% tax rate.
- Adding a component library, test framework, or local font binaries.
- Building a theme editor, per-component theme overrides, or a themed PDF; the invoice keeps its existing light print layout.

## Decisions

| Decision | Rationale | Alternatives considered |
|----------|-----------|-------------------------|
| Restyle the existing form components with Tailwind utilities and a small shared card/heading/field pattern instead of adding a UI kit | Keeps the change local to the current file structure and avoids a new dependency; repeated heading and field markup becomes consistent without a large abstraction. | Adopt Material UI or shadcn (new dependency and broader churn); leave each file fully duplicated (drift risk). |
| Use `grid-cols-1 lg:grid-cols-12` with the form region at `lg:col-span-8` and the summary at `lg:col-span-4 lg:sticky lg:top-6 self-start` | Directly satisfies the requested 8/4 desktop split and gives a stable billing rail while long forms scroll; below `lg` both regions stack naturally. | Flexbox sidebar (less explicit column ratio); fixed sidebar widths (breaks responsiveness); putting the summary first on mobile (billing context is clearer after form details). |
| Load Plus Jakarta Sans and JetBrains Mono as web fonts via preconnected `<link>` tags in `index.html`, expose them through `tailwind.config.js` font families, and mark numeric cells `font-mono tabular-nums` | Keeps CSS simple and avoids bundling font files; typography becomes a theme-level decision rather than per-component overrides. | CSS `@import` (additional render-blocking request); self-hosted fonts (new assets and licensing handling); system fonts only (does not meet the typography requirement). |
| Add `lucide-react` and use named icons as decorative elements (`aria-hidden`) next to real text labels | Matches the requested icon set without hand-maintained SVG markup; labels remain accessible and screen-reader friendly. | Inline SVG paths (maintenance overhead); icon fonts (poorer tree-shaking and accessibility). |
| Define semantic color tokens as CSS custom properties in `src/index.css` and map them in `tailwind.config.js` with `darkMode: 'class'` | One token set (`canvas`, `surface`, `ink`, `muted`, `line`, `accent`, `action`) drives cards, text, inputs, buttons, and summary rows, so switching the root class restyles the whole page consistently. Channel values such as `247 241 229` enable Tailwind opacity modifiers. Light uses pearl `#F5F7FA`/white `#FFFFFF` with navy `#122033` and blue `#1D4ED8`; dark uses `#0E1621`/`#162231`. | Hard-coded `dark:` variants on every element (error-prone drift); a new component library (unnecessary dependency). |
| Initialize the theme with a small inline boot script in `index.html`, then manage toggles in `src/hooks/useTheme.js` with `localStorage` and `prefers-color-scheme` | The boot script applies the saved or system mode before first paint; the hook keeps React state in sync without putting presentation state in the reservation store. Storage failures fall back to the current session. | Store-only theme state (visible flash on reload); CSS `prefers-color-scheme` only (no user override). |
| Place a Sun/Moon toggle in the header with an accessible label and explicit current-mode state | Keeps the control next to the other global actions and makes the mode obvious on every viewport. | Settings page or modal (extra navigation); icon-only control without a label (weaker accessibility). |
| Generate the reservation ID once in store initialization as `#RE-` plus four random digits and remove the public setter | Makes the identifier read-only by construction and keeps the same value for form display and PDF output. | Derive from timestamp/counter (predictable or requires persistence); keep the setter (allows invalid user edits); generate per render (value would flicker). |
| Put the coupon catalog and resolution in `src/utils/reservationCharges.js`; store only the resolved coupon record (`code`, `label`, `kind`, `value`) in `appliedCoupon` | One source of truth for validity, discount math, and the PDF row; prevents the summary and invoice from drifting. `SAVE10` is a percentage of the pre-tax subtotal and `WELCOME5` is a $5 fixed amount capped at that subtotal; matching is case-insensitive and trimmed. | Validate in the component (logic duplication in PDF); keep free-text `discount` (no reliable math); uncapped fixed coupon (negative totals on small subtotals). |
| Calculate `subtotal → discount → discountedSubtotal → tax → total` in the shared helper and return `discount` alongside existing charge fields | Tax must follow the same base in the UI and PDF; exposing the discount amount lets both render a consistent negative row. Keep internal numbers unrounded and format money to two decimals at render time. | Discount after tax (different total semantics and harder to explain); round at each step (drift and surprising cent differences). |
| Rebuild the summary as a `table-fixed w-full` table with explicit column widths, compact padding, wrapping labels, right-aligned mono amounts, and no `overflow-auto`/`whitespace-no-wrap` | Guarantees all four columns stay inside the card on small screens while keeping semantic table markup for the data. | Horizontal scroll (explicitly rejected); CSS grid rows (loses table semantics); abbreviating labels (reduces clarity). |
| Keep the PDF's existing row structure but change the Discount row to show the coupon code and its formatted negative amount | Preserves the sample-inspired layout while honoring the new behavior and existing total-parity requirement. | Removing the row (loses audit detail); adding a new section (breaks the one-page layout). |

## Risks / Trade-offs

- **[Risk] Applying a coupon changes a total that previously ignored free-text discount** → Mitigation: keep rates unchanged, centralize math in the shared helper, and manually compare summary and PDF totals with and without coupons.
- **[Risk] Web fonts may be blocked in the review environment** → Mitigation: declare system fallbacks in the Tailwind font stacks so layout and tabular alignment remain acceptable.
- **[Risk] Saved theme is applied after first paint, causing a flash** → Mitigation: use the inline boot script before the React bundle loads and keep the stored value valid (`light`/`dark` only).
- **[Risk] Pearl or dark navy surfaces reduce text/button contrast** → Mitigation: target WCAG AA for body text and controls, use semantic tokens instead of ad hoc colors, and manually sweep both themes including helper text, badges, and summary amounts.
- **[Risk] `localStorage` is blocked or unavailable** → Mitigation: wrap access in a try/catch and fall back to system preference for the session without breaking the toggle.
- **[Risk] Sticky summary can be taller than a short viewport** → Mitigation: keep the table compact with responsive padding and let the page scroll normally; do not add an inner scrollbar to the table.
- **[Risk] Long vehicle or label text could push summary columns wider** → Mitigation: use fixed table layout with small-screen padding reductions and wrapping/truncation for labels; amounts stay in their own right-aligned column.
- **[Risk] Removing `discount`/`setDiscount` breaks every current consumer** → Mitigation: update the store, Reservation Details, page handoff, summary, and PDF together, then rely on lint/typecheck/build to catch stale references.
- **[Risk] Random four-digit IDs can collide across separate sessions** → Mitigation: acceptable for this client-only demo; no persistence or uniqueness guarantee is claimed.

## Migration Plan

No data migration is needed because state is in-memory. Implementation order: add the dependency/font setup and semantic theme tokens with the boot script/hook; add coupon catalog and calculation changes; replace store discount state with `appliedCoupon` and generated ID; update the page shell, header toggle, and form cards; rewrite the themed summary table and coupon entry; update the PDF discount row and data handoff; then run lint, typecheck, build, and manual responsive/theme/PDF verification. Rollback is a straightforward revert of the change; no server or stored reservation data is affected.
