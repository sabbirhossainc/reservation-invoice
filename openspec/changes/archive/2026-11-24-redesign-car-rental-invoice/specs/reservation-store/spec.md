# Spec Delta

## MODIFIED Requirements

### Requirement: Download invoice button generates a PDF

The system SHALL provide a "Download Invoice" button that, when clicked, generates an A4 portrait PDF using the modern invoice document layout and triggers a browser download.

#### Scenario: Download initiates and file is saved
- **WHEN** user clicks the "Download Invoice" button
- **THEN** an A4 portrait PDF is generated and the browser's download prompt appears, containing the reservation summary (customer info, vehicle, dates, itemized charges, coupon, total) in the document layout defined by `invoice-document`.

#### Scenario: PDF uses the sample's visual structure
- **WHEN** the generated PDF is opened
- **THEN** it presents a branded header, two-column metadata blocks, a full-width itemized charge table, a coupon badge, a highlighted total, signature areas, and a footer note, with all text in JetBrains Mono.

#### Scenario: Reservation values appear in the PDF
- **WHEN** the store contains a reservation ID, customer name/email/phone, vehicle type/make, pickup/return dates, duration, charge flags, and an applied coupon
- **THEN** the PDF displays those values in the corresponding sections of the document, including the coupon code and its calculated discount amount.

#### Scenario: Empty values are handled
- **WHEN** a reservation field is empty
- **THEN** the PDF renders a neutral placeholder (`-`) in that field without omitting the label or breaking the layout.

### Requirement: Downloaded total matches the on-screen summary

The system SHALL derive the invoice total from the same reservation values used by the on-screen Charges Summary so that the summary, the printable HTML invoice, and the downloaded PDF agree for the same reservation state.

#### Scenario: Charges and PDF agree after a change
- **WHEN** a charge flag, rental duration, or applied coupon changes and the user downloads the invoice
- **THEN** the total printed in the PDF equals the total shown in the on-screen Charges Summary.

#### Scenario: Charges and HTML invoice agree after a change
- **WHEN** a charge flag, rental duration, or applied coupon changes and the printable invoice view is opened
- **THEN** the total in the HTML invoice equals the total in the on-screen Charges Summary and in the downloaded PDF.
