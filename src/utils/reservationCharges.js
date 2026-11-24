export const DAILY_RATE = 99;
export const WEEKLY_RATE = 390;
export const COLLISION_RATE = 9;
export const LIABILITY_RATE = 15;
export const RENTAL_TAX_PERCENT = 11.5;

export function calculateReservationCharges({
  weeks = 0,
  days = 0,
  collision = false,
  liability = false,
  rental = false,
} = {}) {
  const daily = days * DAILY_RATE;
  const weekly = weeks * DAILY_RATE * 0 + weeks * WEEKLY_RATE;
  const waiver = collision ? COLLISION_RATE : 0;
  const liabilityCharge = liability ? LIABILITY_RATE : 0;
  const taxRate = rental ? RENTAL_TAX_PERCENT : 0;
  const subtotal = daily + weekly + waiver + liabilityCharge;
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  return {
    daily,
    weekly,
    waiver,
    liability: liabilityCharge,
    taxRate,
    taxAmount,
    total,
  };
}
