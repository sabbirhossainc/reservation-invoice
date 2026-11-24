# invoice-document Specification

## Purpose

Defines the observable content, typography, and A4 print presentation of the car rental reservation invoice document. The printable HTML view is the single invoice output; users save it as a PDF through the browser's print dialog.

## Requirements

### Requirement: All invoice text uses JetBrains Mono with tabular numerals

Every visible text element of the invoice document SHALL use the `'JetBrains Mono', 'Courier New', monospace` font stack with `font-variant-numeric: tabular-nums`, including headings, labels, customer details, dates, identifiers, charge rows, rates, totals, signatures, and footer notes.

#### Scenario: Typography applies across the HTML invoice
- **WHEN** the printable HTML invoice is displayed
- **THEN** every visible text element uses JetBrains Mono with a Courier New monospace fallback and tabular numerals

#### Scenario: Numerical columns stay aligned
- **WHEN** charge rates and amounts are displayed
- **THEN** digits occupy fixed-width positions and decimal points align across every row

### Requirement: Invoice header identifies the brand and reservation

The invoice header SHALL display the brand mark, the company title "CAR RENTAL SERVICES — Reservation Desk", contact information, and a right-aligned reservation badge prefixed with `#RE` together with an issue date and a status badge.

#### Scenario: Header content is visible
- **WHEN** the invoice is rendered with a generated reservation identifier
- **THEN** the brand mark, company title, contact information, `#RE-####` badge, issue date, and status badge are visible with the badge block aligned to the right

### Requirement: Booking metadata appears in two bordered columns

The document SHALL group booking metadata into two bordered or subtly shaded columns: the left column contains Reservation Details (reservation ID, pickup date, return date, duration) and Unit Details (vehicle type, make and model); the right column contains Renter Information (name, email, phone), Additional Authorized Driver(s), Payment Type, and Referral.

#### Scenario: Left column lists reservation and unit details
- **WHEN** the invoice metadata is viewed
- **THEN** the left column shows the reservation ID, pickup date, return date, duration, vehicle type, and make and model with their labels

#### Scenario: Right column lists renter and related details
- **WHEN** the invoice metadata is viewed
- **THEN** the right column shows the renter name, email, phone, Additional Authorized Driver(s), Payment Type, and Referral with their labels

#### Scenario: Missing values keep their labels
- **WHEN** a metadata value is empty
- **THEN** the document renders a `-` placeholder in that field without omitting the label or breaking the column layout

### Requirement: Itemized charges use an aligned four-column table

The document SHALL present one full-width charge table with the columns `CHARGE / DESCRIPTION`, `RATE`, `UNIT / QTY`, and a right-aligned `AMOUNT` column, covering daily and weekly rental, Collision Damage Waiver, Liability Insurance, and Rental Tax using the configured rates.

#### Scenario: Column headers are in document order
- **WHEN** the charge table is rendered
- **THEN** the four headers appear in the order CHARGE / DESCRIPTION, RATE, UNIT / QTY, AMOUNT, with AMOUNT right-aligned

#### Scenario: Populated reservation shows itemized amounts
- **WHEN** a reservation has 5 days, 1 week, all add-ons active, and SAVE10 applied
- **THEN** the table shows Daily $99.00 × 5 = $495.00, Weekly $390.00 × 1 = $390.00, Collision Damage Waiver $9.00, Liability Insurance $15.00, and Rental Tax 11.5% = $94.08

#### Scenario: Inactive charges still have a labeled row
- **WHEN** an add-on or tax flag is inactive
- **THEN** its labeled row remains present with a zero amount so the table structure is stable

### Requirement: Coupon badge and highlighted total close the charges

The document SHALL show an applied coupon as a dedicated green badge row labelled `Coupon Applied: <CODE>` with its negative discount amount directly above a highlighted `TOTAL` bar showing the final amount.

#### Scenario: Coupon appears above the total
- **WHEN** SAVE10 is applied to the populated reservation
- **THEN** a green row reads `Coupon Applied: SAVE10` with `-$90.90` immediately above a highlighted TOTAL bar showing `$912.18`

#### Scenario: No coupon leaves the total intact
- **WHEN** no coupon is applied
- **THEN** no coupon badge row is shown and the highlighted TOTAL bar remains present

#### Scenario: Discount and total follow recalculation
- **WHEN** a charge flag, duration, or coupon changes
- **THEN** the discount amount and TOTAL bar reflect the recalculated charges

### Requirement: Signature areas and footer note close the document

The document SHALL include a signature area for `Renter's Signature` and another for `Additional Authorized Driver Signature`, each with a signature line and timestamp label, followed by a footer note containing terms and a thank-you message.

#### Scenario: Both signature areas are available
- **WHEN** the bottom of the invoice is viewed
- **THEN** two distinct signature lines are shown with the Renter's Signature and Additional Authorized Driver Signature labels and timestamp labels

#### Scenario: Footer note is present
- **WHEN** the bottom of the invoice is viewed
- **THEN** a subtle footer note displays terms information and a thank-you message

### Requirement: Printable HTML invoice fits one A4 page

The HTML invoice SHALL be presentable as a single A4 portrait page without application chrome, clipped content, or horizontal scrolling, and its on-screen view SHALL remain readable at supported viewport widths.

#### Scenario: Print preview contains only the invoice
- **WHEN** the browser print dialog is opened from the invoice view
- **THEN** the preview shows one A4 portrait page containing only the invoice document with no clipped rows or horizontal overflow

#### Scenario: On-screen invoice remains readable
- **WHEN** the invoice view is opened at a phone-width viewport
- **THEN** all invoice sections remain readable without horizontal page scrolling

### Requirement: Printed invoice uses the live reservation data

The HTML invoice SHALL render reservation metadata, charge rows, coupon, and total from the shared view of the reservation state used by the on-screen summary.

#### Scenario: Printed invoice reflects current state
- **WHEN** a reservation value changes and the printable invoice view is opened
- **THEN** the invoice shows the updated metadata, charge rows, coupon amount, and total

#### Scenario: Saved PDF matches the on-screen invoice
- **WHEN** the user saves the invoice as a PDF from the browser print dialog
- **THEN** the saved document contains the same content as the printable HTML invoice
