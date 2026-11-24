import { ShieldCheck } from "lucide-react";
import { useReservationStore } from "../store/useReservationStore";
import {
  COLLISION_RATE,
  LIABILITY_RATE,
  RENTAL_TAX_PERCENT,
} from "../utils/reservationCharges.js";
import { Card, SectionHeading } from "../components/ui";

const AdditionalCharges = () => {
  const { collision, liability, rental, setCollision, setLiability, setRental } = useReservationStore();

  const options = [
    {
      name: "collision",
      label: "Collision Damage Waiver",
      amount: `$${COLLISION_RATE.toFixed(2)}`,
      checked: collision,
      onChange: () => setCollision(!collision),
    },
    {
      name: "liability",
      label: "Liability Insurance",
      amount: `$${LIABILITY_RATE.toFixed(2)}`,
      checked: liability,
      onChange: () => setLiability(!liability),
    },
    {
      name: "rental",
      label: "Rental Tax",
      amount: `${RENTAL_TAX_PERCENT}%`,
      checked: rental,
      onChange: () => setRental(!rental),
    },
  ];

  return (
    <Card>
      <SectionHeading
        icon={ShieldCheck}
        title="Additional Charges"
        description="Optional coverage and tax applied to the rental"
      />
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <label
            key={option.name}
            htmlFor={`charge-${option.name}`}
            className="flex min-w-fit max-w-full cursor-pointer items-center gap-2 whitespace-nowrap rounded-lg border border-line bg-surface-muted px-2.5 py-1.5 transition hover:border-accent/50"
          >
            <input
              type="checkbox"
              id={`charge-${option.name}`}
              name={option.name}
              className="size-3.5 shrink-0 rounded border-line accent-accent"
              checked={option.checked}
              onChange={option.onChange}
            />
            <span className="min-w-0 flex-1 text-xs text-ink">{option.label}</span>
            <span className="numeric shrink-0 text-xs font-semibold text-ink">{option.amount}</span>
          </label>
        ))}
      </div>
    </Card>
  );
};

export default AdditionalCharges;
