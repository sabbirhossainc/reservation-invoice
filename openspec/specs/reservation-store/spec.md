# reservation-store Specification

## Purpose

Centralised Zustand-based state for the car-rental reservation flow, providing a single source of truth for products, charge flags, dates, and computed totals.

## Requirements

### Requirement: Store provides car list

The system SHALL provide a `products` array in the reservation store containing mock car data, so that `VehicleInfo` can render vehicle selection options.

#### Scenario: Products are available on mount

- **WHEN** the reservation store is initialised
- **THEN** `products` contains at least three car objects with `id`, `type`, and `make` properties.

### Requirement: Store holds collision flag

The system SHALL expose a `collision` boolean in the reservation store, defaulting to `false`, that `AdditionalCharges` can read and toggle.

#### Scenario: Collision flag starts false

- **WHEN** a new reservation session begins
- **THEN** `collision` is `false`; toggling the checkbox updates the store value.

### Requirement: Store holds liability flag

The system SHALL expose a `liability` boolean in the reservation store, defaulting to `false`, that `AdditionalCharges` can read and toggle.

#### Scenario: Liability flag starts false

- **WHEN** a new reservation session begins
- **THEN** `liability` is `false`; toggling the checkbox updates the store value.

### Requirement: Store holds rental flag

The system SHALL expose a `rental` boolean in the reservation store, defaulting to `false`, that `AdditionalCharges` can read and toggle.

#### Scenario: Rental flag starts false

- **WHEN** a new reservation session begins
- **THEN** `rental` is `false`; toggling the checkbox updates the store value.

### Requirement: Store computes weeks and days from dates

The system SHALL derive `weeks` and `days` from `datePickup` and `dateReturn` so that `ChargesSummary` can display the rental duration.

#### Scenario: Weeks and days are computed correctly

- **WHEN** `datePickup` is "2026-12-01" and `dateReturn` is "2026-12-10"
- **THEN** `weeks` is `1` and `days` is `2`.

### Requirement: Download invoice button generates a PDF

The system SHALL provide a "Download Invoice" button that, when clicked, generates an A4 portrait PDF with a two-column, sample-inspired layout and triggers a browser download.

#### Scenario: Download initiates and file is saved

- **WHEN** user clicks the "Download Invoice" button
- **THEN** an A4 portrait PDF is generated and the browser's download prompt appears, containing the reservation summary (customer info, vehicle, dates, charges, total) in a two-column layout modeled on `src/assets/Sample Invoice.pdf`.

#### Scenario: PDF uses the sample's visual structure

- **WHEN** the generated PDF is opened
- **THEN** it presents a header with a simple recreated car-and-crown mark and title, a left column of reservation, customer, and vehicle sections with bold uppercase headings, a right column with a light-grey charge summary table, and a footer/signature area, mirroring the sample's layout and typography without copying its static company details or legal text.

#### Scenario: Reservation values appear in the PDF

- **WHEN** the store contains a reservation ID, customer name/email/phone, vehicle type/make, pickup/return dates, duration, charge flags, and discount
- **THEN** the PDF displays those values in the corresponding sections of the two-column layout.

#### Scenario: Empty values are handled

- **WHEN** a reservation field is empty
- **THEN** the PDF renders a neutral placeholder (`-`) in that field without omitting the label or breaking the layout.

### Requirement: Downloaded total matches the on-screen summary

The system SHALL derive the invoice total from the same reservation values used by the on-screen Charges Summary so that both displays agree for the same reservation state.

#### Scenario: Charges and PDF agree after a change

- **WHEN** a charge flag or rental duration changes and the user downloads the invoice
- **THEN** the total printed in the PDF equals the total shown in the on-screen Charges Summary.
