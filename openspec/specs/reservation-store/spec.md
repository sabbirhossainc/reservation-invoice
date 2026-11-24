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

The system SHALL provide a “Download Invoice” button that, when clicked, generates a PDF document in the style of `src/assets/Sample Invoice.pdf` and triggers a browser download.

#### Scenario: Download initiates and file is saved

- **WHEN** user clicks the “Download Invoice” button
- **THEN** a PDF file is generated and the browser’s download prompt appears, containing the reservation summary (customer info, vehicle, dates, charges, total) styled to match the existing sample.
