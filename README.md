# Car Reservation & Invoice

A small React app for building a car rental reservation, adding optional charges, applying promo codes, reviewing a live total, and printing a clean A4 invoice.

## Features

- Booking form for rental dates, vehicle, customer details, and add-ons
- Live charge summary with `SAVE10` and `WELCOME5` promo codes
- Invoice view at `?view=invoice` with **Print / Save as PDF** via the browser print dialog, which suggests `reservation-invoice-{ID}-{date}.pdf`
- Light and dark themes

## Development

```bash
npm install
npm run dev
```

Open the URL Vite prints. `npm run preview` serves the production build locally.

## Verification

```bash
npm run lint
npm run build
```

No test suite or typecheck script is configured.

## Notes

- Vehicle data comes from `mockCars` in `src/store/useReservationStore.ts`; there is no backend or API client.
- Rates and coupons are defined in `src/utils/reservationCharges.js`; the invoice view model is built in `src/utils/invoiceData.js`.
- Current behavior specs live in `openspec/specs/`.
