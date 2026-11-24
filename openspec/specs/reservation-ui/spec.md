# reservation-ui Specification

## Purpose

Defines the observable presentation and interaction behavior of the car rental reservation page, so the booking form is readable, responsive, and consistent across devices.

## Requirements

### Requirement: Reservation header identifies the app and offers invoice printing

The booking page header SHALL display a brand mark, the title "Car Reservation", a subtitle describing booking details, add-ons, and billing summary, a "Print Invoice" action with a print icon, and a light/dark theme toggle with an accessible label and a Sun/Moon icon. A separate "Download Invoice" action SHALL NOT be present because the printable invoice already offers Save as PDF.

#### Scenario: Header is visible on page load
- **WHEN** the reservation page is opened
- **THEN** the brand mark, "Car Reservation" title, subtitle, "Print Invoice" action with a print icon, and theme toggle are visible, and no "Download Invoice" action is shown

#### Scenario: Invoice action remains available
- **WHEN** the viewport width changes from desktop to mobile
- **THEN** the "Print Invoice" action stays visible in the header

### Requirement: The header is hidden in the invoice view

The application header SHALL be shown only for the booking view. The invoice view SHALL instead provide "Back to booking" and "Print / Save as PDF" controls, including when the invoice view is opened directly via `?view=invoice`.

#### Scenario: Header is hidden after printing
- **WHEN** the user activates "Print Invoice"
- **THEN** the invoice view opens without the brand header, theme toggle, or duplicate invoice actions

#### Scenario: Direct invoice link has no header
- **WHEN** the page loads with `?view=invoice`
- **THEN** only the invoice toolbar and invoice document are displayed, with no application header

#### Scenario: Return to booking restores the header
- **WHEN** the user activates "Back to booking"
- **THEN** the header is displayed again with the reservation state preserved

#### Scenario: Theme toggle remains available
- **WHEN** the viewport width changes from desktop to mobile
- **THEN** the theme toggle stays visible in the header and indicates the active mode

### Requirement: Printable invoice view opens from the header

The page SHALL provide a print action that displays the printable HTML invoice for the current reservation and a way to return to the booking form.

#### Scenario: Print action opens the current invoice
- **WHEN** the user activates the "Print Invoice" action
- **THEN** the printable HTML invoice view opens with the current reservation values, charges, coupon, and total

#### Scenario: Return to booking remains possible
- **WHEN** the user activates the return control in the invoice view
- **THEN** the reservation form is displayed again with the reservation state preserved

### Requirement: Theme preference is selectable and persistent

The page SHALL provide an icon-only light/dark toggle (Sun or Moon) in the header, sized and vertically aligned to match the "Print Invoice" button while keeping its accessible label. It applies the chosen mode immediately, initializes from a stored preference or the system color scheme (defaulting to light), and persists the selection across reloads before page content is visible.

#### Scenario: Stored preference is used on load
- **WHEN** the page loads after the user selected dark mode
- **THEN** dark mode is applied using the stored choice before content is visible

#### Scenario: System preference is used without a stored choice
- **WHEN** the page loads for the first time with a dark system preference and no stored choice
- **THEN** dark mode is used; with no detectable preference, light mode is used

#### Scenario: Toggle switches and persists
- **WHEN** the user activates the theme toggle
- **THEN** the mode changes immediately, the toggle reflects the new mode, and the new choice is retained after reload

### Requirement: Themed surfaces maintain readable contrast

The light theme SHALL use a cool pearl page canvas with white cards and navy ink text; the dark theme SHALL use a dark navy canvas and cards with light text. Text, inputs, buttons, badges, and summary rows SHALL use theme-appropriate colors with sufficient contrast.

#### Scenario: Light theme is warm and legible
- **WHEN** the page is viewed in light mode
- **THEN** the canvas is pearl, cards are white, and text, inputs, buttons, badges, and summary amounts are readable against their surfaces

#### Scenario: Dark theme inverts surfaces cleanly
- **WHEN** the user switches to dark mode
- **THEN** the canvas, cards, inputs, buttons, badges, and summary rows update to dark-theme colors with light, readable text

#### Scenario: Numeric and action text remain legible
- **WHEN** prices, dates, IDs, and button labels are viewed in either theme
- **THEN** they retain sufficient contrast against their themed surfaces

### Requirement: Reservation content uses a responsive two-region layout

On desktop widths the primary form content SHALL occupy eight columns of a twelve-column content grid and the Charges Summary SHALL occupy the remaining four columns in a sticky region; at narrower widths the regions SHALL stack without clipping or horizontal page scrolling.

#### Scenario: Desktop layout shows form and summary side by side
- **WHEN** the page is viewed at a desktop width
- **THEN** the form cards appear in the eight-column region and the Charges Summary appears in the sticky four-column region

#### Scenario: Narrow layout stacks content
- **WHEN** the page is viewed at a phone or tablet width
- **THEN** the form cards and Charges Summary appear in a single stacked column with no horizontal page scrollbar

#### Scenario: Card spacing is uniform
- **WHEN** the booking page is viewed at any supported width
- **THEN** the gap between the header and the first card, between consecutive cards, and between the two desktop columns is the same spacing value; the sticky Charges Summary keeps that same gap from the header while scrolling

### Requirement: Related form fields are grouped in pairs inside cards

The customer form SHALL present First Name with Last Name and Email with Phone side by side; the reservation form SHALL present Pickup Date with Return Date side by side; the vehicle form SHALL present Vehicle Type with Vehicle side by side.

#### Scenario: Customer fields are paired
- **WHEN** the Customer Information card is viewed
- **THEN** First Name and Last Name share a row, and Email and Phone share a row

#### Scenario: Reservation and vehicle fields are paired
- **WHEN** the Reservation Details and Vehicle Information cards are viewed
- **THEN** Pickup Date and Return Date share a row, and Vehicle Type and Vehicle share a row

### Requirement: Reservation ID is generated and read-only

The reservation page SHALL display an auto-generated reservation identifier in the `#RE-####` format as a read-only pill badge in the Reservation Details card heading, beside the section title and description and right-aligned with the card content edge; the user SHALL NOT be able to edit it.

#### Scenario: Identifier appears on load
- **WHEN** the reservation page is opened
- **THEN** a read-only pill badge displays an identifier matching `#RE-` followed by four digits at the right side of the Reservation Details heading

#### Scenario: Identifier is not editable
- **WHEN** the user interacts with the reservation identifier area
- **THEN** no text input for changing the identifier is presented

### Requirement: Reservation Details does not contain a discount input

The Reservation Details card SHALL contain date and duration controls only, with no free-text Discount field.

#### Scenario: Discount field is absent
- **WHEN** the Reservation Details card is rendered
- **THEN** no Discount input is shown

### Requirement: Charges Summary accepts a promo code

The Charges Summary SHALL provide a "Promo / Coupon Code" input and an Apply action that accepts `SAVE10` for 10% off the pre-tax subtotal and `WELCOME5` for $5 off the pre-tax subtotal, case-insensitively.

#### Scenario: Percentage coupon is applied
- **WHEN** the user enters `save10` and activates Apply
- **THEN** the applied discount is 10% of the pre-tax subtotal and the summary total reflects the discounted, taxed amount

#### Scenario: Fixed-amount coupon is applied
- **WHEN** the user enters `WELCOME5` and activates Apply
- **THEN** the applied discount is $5.00, limited to the pre-tax subtotal, and the summary total reflects the discounted, taxed amount

#### Scenario: Coupon is rejected
- **WHEN** the user activates Apply with an empty or unrecognized code
- **THEN** no discount is applied and inline feedback explains that the code is invalid

#### Scenario: Applied coupon is confirmed in green
- **WHEN** a valid coupon is applied
- **THEN** the inline "applied" message and its check icon use the theme's success green, and the discount row in the Charges Summary table is highlighted in the same green family

### Requirement: Charges Summary offers a demo reservation fill

The Charges Summary SHALL include a "Fill demo reservation" action below the totals table. When activated, it SHALL populate the customer name, email, phone, pickup and return dates, vehicle type, vehicle make, and all three additional-charge checkboxes with a complete sample booking. The demo SHALL represent a 12-day rental (1 week 5 days), activate every add-on, enter and apply `SAVE10`, show success feedback, and update the discount row and total.

#### Scenario: Demo action fills the booking form
- **WHEN** the user activates "Fill demo reservation"
- **THEN** every editable reservation field shows the demo values and the duration reads `1 Week 5 Day`

#### Scenario: Demo action applies the promo code
- **WHEN** the demo reservation is filled
- **THEN** the coupon input shows `SAVE10`, success feedback confirms `SAVE10`, and the summary shows the `SAVE10` discount row with a recalculated total of `$912.18`

### Requirement: Charges Summary displays the applied discount without overflow

When a coupon is applied, the Charges Summary SHALL show a discount row with a negative amount and an updated Total; all table columns SHALL fit within the card at every supported viewport width without a horizontal scrollbar.

#### Scenario: Discount row and total update
- **WHEN** a valid coupon has been applied
- **THEN** the summary shows a discount row with a negative amount and a Total recalculated from the discounted subtotal

#### Scenario: Summary fits narrow screens
- **WHEN** the summary is viewed at the smallest supported width
- **THEN** every label, unit, rate, and amount remains visible without horizontal scrolling

### Requirement: Reservation UI uses hierarchical typography, icons, and tabular numerals

The page SHALL use a clean sans-serif UI typeface, monospace-style tabular figures for prices, dates, and identifiers, and icons that distinguish section headers, fields, and actions.

#### Scenario: Financial and temporal values are easy to scan
- **WHEN** the reservation page is viewed
- **THEN** prices, dates, and the reservation identifier use tabular figures and section headers, relevant fields, and buttons display icons

### Requirement: Form controls use a compact height

All text inputs, selects, and buttons SHALL use a reduced vertical padding so the booking form is denser, while keeping labels, focus indicators, and theme contrast intact.

#### Scenario: Inputs and buttons are compact
- **WHEN** the booking form is viewed
- **THEN** inputs and buttons are shorter in height than the labels and cards around them and remain fully legible and clickable

### Requirement: Additional Charges options are arranged horizontally

The Additional Charges card SHALL present the Collision Damage Waiver, Liability Insurance, and Rental Tax options as three side-by-side, individually labeled tiles at desktop widths; at narrow widths the tiles MAY stack to avoid overflow.

#### Scenario: Options appear in one row on desktop
- **WHEN** the Additional Charges card is viewed at a desktop width
- **THEN** all three checkbox tiles appear in a single horizontal row with their labels and amounts visible

#### Scenario: Options remain usable on narrow screens
- **WHEN** the Additional Charges card is viewed at a phone width
- **THEN** the tiles stack without horizontal page scrolling and each checkbox still toggles its charge
