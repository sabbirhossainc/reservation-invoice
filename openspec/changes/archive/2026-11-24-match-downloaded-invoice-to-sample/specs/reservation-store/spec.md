# Spec Delta

## MODIFIED Requirements

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

## ADDED Requirements

### Requirement: Downloaded total matches the on-screen summary

The system SHALL derive the invoice total from the same reservation values used by the on-screen Charges Summary so that both displays agree for the same reservation state.

#### Scenario: Charges and PDF agree after a change

- **WHEN** a charge flag or rental duration changes and the user downloads the invoice
- **THEN** the total printed in the PDF equals the total shown in the on-screen Charges Summary.
