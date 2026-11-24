import { CalendarDays, Clock } from "lucide-react";
import { useReservationStore } from "../store/useReservationStore";
import { Card, Field, SectionHeading } from "../components/ui";

const ReservationDetails = () => {
  const {
    weeks,
    days,
    reservationId,
    datePickup,
    dateReturn,
    setDatePickup,
    setDateReturn,
    computeWeeksDays,
  } = useReservationStore();

  const handlePickup = (e) => {
    setDatePickup(e.target.value);
    computeWeeksDays();
  };

  const handleReturn = (e) => {
    setDateReturn(e.target.value);
    computeWeeksDays();
  };

  return (
    <Card>
      <SectionHeading
        icon={CalendarDays}
        title="Reservation Details"
        description="Select the rental period for this booking"
        action={
          <span className="badge ml-auto shrink-0 self-center whitespace-nowrap">
            {reservationId}
          </span>
        }
      />
      <form action="#" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Pickup Date" htmlFor="pickup-date" icon={CalendarDays} required>
          <input
            type="date"
            name="pickup-date"
            id="pickup-date"
            className="field-control numeric pl-10"
            value={datePickup}
            onChange={handlePickup}
            required
          />
        </Field>
        <Field label="Return Date" htmlFor="return-date" icon={CalendarDays} required>
          <input
            type="date"
            name="return-date"
            id="return-date"
            className="field-control numeric pl-10"
            value={dateReturn}
            onChange={handleReturn}
            required
          />
        </Field>
        <div className="flex items-center justify-between gap-4 rounded-lg border border-line bg-surface-muted px-3 py-1.5 sm:col-span-2">
          <span className="field-label mb-0 flex items-center gap-2">
            <Clock size={16} aria-hidden="true" />
            Duration
          </span>
          <span className="numeric text-sm font-semibold text-ink">
            {weeks} Week {days} Day
          </span>
        </div>
      </form>
    </Card>
  );
};

export default ReservationDetails;
