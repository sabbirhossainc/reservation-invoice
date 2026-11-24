import { useState } from "react";
import { AlertCircle, Check, CheckCircle2, ReceiptText, Tag } from "lucide-react";
import { useReservationStore } from "../store/useReservationStore";
import { calculateReservationCharges, resolveCoupon } from "../utils/reservationCharges.js";
import { Card, SectionHeading } from "../components/ui";

const money = (value) => `$${Number(value).toFixed(2)}`;

const Cell = ({ children, className = "" }) => (
  <td className={`px-1.5 py-2.5 align-top sm:px-2 sm:py-3 ${className}`}>{children}</td>
);

const ChargesSummary = () => {
  const { weeks, days, collision, liability, rental, appliedCoupon, applyCoupon } =
    useReservationStore();
  const [couponInput, setCouponInput] = useState("");
  const [feedback, setFeedback] = useState(null);

  const handleApplyCoupon = (event) => {
    event.preventDefault();
    const coupon = resolveCoupon(couponInput);

    if (!coupon) {
      applyCoupon(null);
      setFeedback({ type: "error", message: "Enter a valid coupon code." });
      return;
    }

    applyCoupon(coupon);
    setFeedback({ type: "success", message: `${coupon.code} applied.` });
  };

  const {
    daily,
    weekly,
    waiver,
    liability: liabilityCharge,
    discount,
    taxRate,
    taxAmount,
    total,
  } = calculateReservationCharges({ weeks, days, collision, liability, rental, appliedCoupon });

  return (
    <Card>
      <SectionHeading
        icon={ReceiptText}
        title="Charges Summary"
        description="Live totals as the booking changes"
      />
      <form
        onSubmit={handleApplyCoupon}
        className="mb-5 rounded-xl border border-line bg-surface-muted p-3"
      >
        <label htmlFor="coupon-code" className="field-label">
          Promo / Coupon Code
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <Tag
              size={16}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="text"
              id="coupon-code"
              className="field-control pl-10 uppercase"
              placeholder="e.g. SAVE10"
              value={couponInput}
              onChange={(event) => {
                setCouponInput(event.target.value);
                setFeedback(null);
              }}
            />
          </div>
          <button type="submit" className="btn-primary shrink-0">
            <Check size={16} aria-hidden="true" />
            Apply
          </button>
        </div>
        {feedback && (
          <p
            role={feedback.type === "error" ? "alert" : "status"}
            className={`mt-2 flex items-center gap-1.5 text-xs ${
              feedback.type === "error" ? "text-danger" : "text-accent"
            }`}
          >
            {feedback.type === "error" ? (
              <AlertCircle size={14} aria-hidden="true" />
            ) : (
              <CheckCircle2 size={14} aria-hidden="true" />
            )}
            {feedback.message}
          </p>
        )}
        <p className="mt-2 text-[11px] text-muted">Try SAVE10 or WELCOME5</p>
      </form>
      <table className="table-fixed w-full text-left text-xs sm:text-sm">
        <colgroup>
          <col className="w-[40%]" />
          <col className="w-[14%]" />
          <col className="w-[20%]" />
          <col className="w-[26%]" />
        </colgroup>
        <thead>
          <tr className="border-b border-line text-[10px] uppercase tracking-wide text-muted">
            <th scope="col" className="px-1.5 py-2 font-semibold sm:px-2">Charge</th>
            <th scope="col" className="px-1.5 py-2 font-semibold sm:px-2">Unit</th>
            <th scope="col" className="px-1.5 py-2 text-right font-semibold sm:px-2">Rate</th>
            <th scope="col" className="px-1.5 py-2 text-right font-semibold sm:px-2">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line/70 text-ink">
          <tr>
            <Cell>Daily</Cell>
            <Cell className="numeric text-muted">{days}</Cell>
            <Cell className="numeric text-right text-muted">$99.00</Cell>
            <Cell className="numeric text-right font-medium">{money(daily)}</Cell>
          </tr>
          <tr>
            <Cell>Weekly</Cell>
            <Cell className="numeric text-muted">{weeks}</Cell>
            <Cell className="numeric text-right text-muted">$390.00</Cell>
            <Cell className="numeric text-right font-medium">{money(weekly)}</Cell>
          </tr>
          {collision && (
            <tr>
              <Cell>Collision Damage Waiver</Cell>
              <Cell className="text-muted">—</Cell>
              <Cell className="numeric text-right text-muted">$9.00</Cell>
              <Cell className="numeric text-right font-medium">{money(waiver)}</Cell>
            </tr>
          )}
          {liability && (
            <tr>
              <Cell>Liability Insurance</Cell>
              <Cell className="text-muted">—</Cell>
              <Cell className="numeric text-right text-muted">$15.00</Cell>
              <Cell className="numeric text-right font-medium">{money(liabilityCharge)}</Cell>
            </tr>
          )}
          {rental && (
            <tr>
              <Cell>Rental Tax</Cell>
              <Cell className="text-muted">—</Cell>
              <Cell className="numeric text-right text-muted">{taxRate}%</Cell>
              <Cell className="numeric text-right font-medium">{money(taxAmount)}</Cell>
            </tr>
          )}
          {appliedCoupon && (
            <tr className="text-accent">
              <Cell>Discount ({appliedCoupon.code})</Cell>
              <Cell className="text-muted">—</Cell>
              <Cell className="numeric text-right">{appliedCoupon.label.split(" - ")[1]}</Cell>
              <Cell className="numeric text-right font-semibold">-{money(discount)}</Cell>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-line">
            <th scope="row" className="px-1.5 py-3 text-left text-sm font-semibold text-ink sm:px-2">
              Total
            </th>
            <td />
            <td />
            <td className="numeric px-1.5 py-3 text-right text-sm font-bold text-ink sm:px-2">
              {money(total)}
            </td>
          </tr>
        </tfoot>
      </table>
    </Card>
  );
};

export default ChargesSummary;
