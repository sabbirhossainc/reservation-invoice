export const DAILY_RATE = 99;
export const WEEKLY_RATE = 390;
export const COLLISION_RATE = 9;
export const LIABILITY_RATE = 15;
export const RENTAL_TAX_PERCENT = 11.5;

export const COUPONS = {
  SAVE10: { code: 'SAVE10', label: 'SAVE10 - 10% off', kind: 'percent', value: 0.1 },
  WELCOME5: { code: 'WELCOME5', label: 'WELCOME5 - $5 off', kind: 'fixed', value: 5 },
};

export function resolveCoupon(input) {
  if (typeof input !== 'string') return null;
  const code = input.trim().toUpperCase();
  const coupon = COUPONS[code];
  return coupon ? { ...coupon, code } : null;
}

export function calculateReservationCharges({
  weeks = 0,
  days = 0,
  collision = false,
  liability = false,
  rental = false,
  appliedCoupon = null,
} = {}) {
  const daily = days * DAILY_RATE;
  const weekly = weeks * DAILY_RATE * 0 + weeks * WEEKLY_RATE;
  const waiver = collision ? COLLISION_RATE : 0;
  const liabilityCharge = liability ? LIABILITY_RATE : 0;
  const taxRate = rental ? RENTAL_TAX_PERCENT : 0;
  const subtotal = daily + weekly + waiver + liabilityCharge;

  let discount = 0;
  if (appliedCoupon?.kind === 'percent') {
    discount = subtotal * appliedCoupon.value;
  } else if (appliedCoupon?.kind === 'fixed') {
    discount = Math.min(appliedCoupon.value, subtotal);
  }

  const discountedSubtotal = Math.max(0, subtotal - discount);
  const taxAmount = discountedSubtotal * (taxRate / 100);
  const total = discountedSubtotal + taxAmount;

  return {
    daily,
    weekly,
    waiver,
    liability: liabilityCharge,
    subtotal,
    discount,
    discountedSubtotal,
    taxRate,
    taxAmount,
    total,
  };
}
