import { useEffect, useRef, useState } from "react";
import { CarFront, Moon, Printer, Sun } from "lucide-react";
import { buildInvoiceData } from "../utils/invoiceData.js";
import ReservationInvoice from "../components/invoice/ReservationInvoice.jsx";
import { useTheme } from "../hooks/useTheme";
import { useReservationStore, mockCars } from "../store/useReservationStore";
import AdditionalCharges from "../forms/additionalCharges";
import CustomerInfo from "../forms/customerInfo";
import ReservationDetails from "../forms/reservationDetails";
import VehicleInfo from "../forms/vehicleInfo";
import ChargesSummary from "../tabular/summary";

const readView = () =>
  new URLSearchParams(window.location.search).get("view") === "invoice" ? "invoice" : "booking";

function Reservation() {
  const { isDark, toggleTheme } = useTheme();
  const [view, setView] = useState(readView);
  const originalTitleRef = useRef(document.title);
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

  useEffect(() => {
    const syncView = () => setView(readView());
    window.addEventListener("popstate", syncView);
    return () => window.removeEventListener("popstate", syncView);
  }, []);

  const snapshot = {
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
  };
  const invoiceData = buildInvoiceData(snapshot);

  useEffect(() => {
    if (view !== "invoice") return;

    document.title = invoiceData.filename;
    return () => {
      document.title = originalTitleRef.current;
    };
  }, [view, invoiceData.filename]);

  const changeView = (nextView) => {
    const url = new URL(window.location.href);
    if (nextView === "invoice") url.searchParams.set("view", "invoice");
    else url.searchParams.delete("view");
    window.history.pushState({}, "", url);
    setView(nextView);
  };

  return (
    <div className="min-h-screen">
      {view === "booking" && (
        <header className="app-header sticky top-0 z-20 border-b border-line bg-surface/90 backdrop-blur">
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
                className="btn-secondary size-8 p-0"
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                aria-pressed={isDark}
              >
                {isDark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
              </button>
              <button type="button" onClick={() => changeView("invoice")} className="btn-primary">
                <Printer size={16} aria-hidden="true" />
                Print Invoice
              </button>
            </div>
          </div>
        </header>
      )}

      {view === "invoice" ? (
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="invoice-toolbar mb-4 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => changeView("booking")}
              className="btn-secondary"
            >
              Back to booking
            </button>
            <button type="button" onClick={() => window.print()} className="btn-primary">
              <Printer size={16} aria-hidden="true" />
              Print / Save as PDF
            </button>
          </div>
          <div className="invoice-print-root">
            <ReservationInvoice data={invoiceData} />
          </div>
        </main>
      ) : (
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-8">
              <ReservationDetails />
              <VehicleInfo />
              <CustomerInfo />
              <AdditionalCharges />
            </div>
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-[105px]">
                <ChargesSummary />
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

export default Reservation;
