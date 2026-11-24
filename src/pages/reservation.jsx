import { useEffect } from "react";
import { CarFront, Download, Moon, Sun } from "lucide-react";
import { downloadReservationInvoice } from "../utils/invoicePdf.js";
import { useTheme } from "../hooks/useTheme";
import { useReservationStore, mockCars } from "../store/useReservationStore";
import AdditionalCharges from "../forms/additionalCharges";
import CustomerInfo from "../forms/customerInfo";
import ReservationDetails from "../forms/reservationDetails";
import VehicleInfo from "../forms/vehicleInfo";
import ChargesSummary from "../tabular/summary";

function Reservation() {
  const { isDark, toggleTheme } = useTheme();
  const {
    collision,
    liability,
    rental,
    datePickup,
    dateReturn,
    weeks,
    days,
    reservationId,
    appliedCoupon,
    firstName,
    lastName,
    email,
    phone,
    vehicleType,
    vehicleMake,
    setProducts,
  } = useReservationStore();

  useEffect(() => {
    setProducts(mockCars);
  }, [setProducts]);

  const downloadInvoice = () => {
    downloadReservationInvoice({
      collision,
      liability,
      rental,
      datePickup,
      dateReturn,
      weeks,
      days,
      reservationId,
      appliedCoupon,
      firstName,
      lastName,
      email,
      phone,
      vehicleType,
      vehicleMake,
    });
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-line bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-action text-action-ink">
              <CarFront size={22} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h1 className="text-lg font-bold tracking-tight text-ink sm:text-xl">Car Reservation</h1>
              <p className="text-xs text-muted sm:text-sm">
                Manage vehicle booking details, add-ons, and billing summary
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="btn-secondary"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              aria-pressed={isDark}
            >
              {isDark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
              <span className="hidden sm:inline">{isDark ? "Light" : "Dark"} mode</span>
            </button>
            <button type="button" onClick={downloadInvoice} className="btn-primary">
              <Download size={16} aria-hidden="true" />
              Download Invoice
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <ReservationDetails />
            <VehicleInfo />
            <CustomerInfo />
            <AdditionalCharges />
          </div>
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <ChargesSummary />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Reservation;
