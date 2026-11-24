# Spec Delta

## MODIFIED Requirements

### Requirement: Reservation header identifies the app and offers invoice download

The page header SHALL display a brand mark, the title "Car Reservation", a subtitle describing booking details, add-ons, and billing summary, a "Download Invoice" action with a download icon, a "Print Invoice" action with a print icon, and a light/dark theme toggle with an accessible label and a Sun/Moon icon.

#### Scenario: Header is visible on page load
- **WHEN** the reservation page is opened
- **THEN** the brand mark, "Car Reservation" title, subtitle, "Download Invoice" action with a download icon, "Print Invoice" action with a print icon, and theme toggle are visible

#### Scenario: Invoice action remains available
- **WHEN** the viewport width changes from desktop to mobile
- **THEN** the "Download Invoice" and "Print Invoice" actions stay visible in the header

#### Scenario: Theme toggle remains available
- **WHEN** the viewport width changes from desktop to mobile
- **THEN** the theme toggle stays visible in the header and indicates the active mode

## ADDED Requirements

### Requirement: Printable invoice view opens from the header

The page SHALL provide a print action that displays the printable HTML invoice for the current reservation and a way to return to the booking form.

#### Scenario: Print action opens the current invoice
- **WHEN** the user activates the "Print Invoice" action
- **THEN** the printable HTML invoice view opens with the current reservation values, charges, coupon, and total

#### Scenario: Return to booking remains possible
- **WHEN** the user activates the return control in the invoice view
- **THEN** the reservation form is displayed again with the reservation state preserved
