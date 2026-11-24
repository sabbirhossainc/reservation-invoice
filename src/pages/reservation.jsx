import { useEffect } from "react";
import { jsPDF } from "jspdf";
import {
  useReservationStore,
  mockCars,
} from "../store/useReservationStore";
import AdditionalCharges from "../forms/additionalCharges";
import CustomerInfo from "../forms/customerInfo";
import ReservationDetails from "../forms/reservationDetails";
import VehicleInfo from "../forms/vehicleInfo";
import ChargesSummary from "../tabular/summary";

function Reservation() {
  const {
    collision,
    liability,
    rental,
    datePickup,
    dateReturn,
    weeks,
    days,
    reservationId,
    discount,
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

  const collisionRate = collision ? 9 : 0;
  const liabilityRate = liability ? 15 : 0;
  const rentalRate = rental ? 11.5 : 0;
  const totalDaysRate = days * 99;
  const totalWeeksRate = weeks * 390;
  const subtotal = totalDaysRate + totalWeeksRate + collisionRate + liabilityRate;
  const taxAmount = subtotal * (rentalRate / 100);
  const total = subtotal + taxAmount;

  const downloadInvoice = () => {
    const doc = new jsPDF();
    let y = 16;

    doc.setFontSize(18);
    doc.text("Reservation Invoice", 14, y);
    y += 10;

    doc.setFontSize(11);
    doc.text(`Reservation ID: ${reservationId || "-"}`, 14, y);
    y += 7;
    doc.text(
      `Customer: ${[firstName, lastName].filter(Boolean).join(" ") || "-"}`,
      14,
      y
    );
    y += 7;
    doc.text(`Email: ${email || "-"}`, 14, y);
    y += 7;
    doc.text(`Phone: ${phone || "-"}`, 14, y);
    y += 7;
    doc.text(`Vehicle: ${[vehicleType, vehicleMake].filter(Boolean).join(" ") || "-"}`, 14, y);
    y += 7;
    doc.text(`Pickup: ${datePickup || "-"}`, 14, y);
    y += 7;
    doc.text(`Return: ${dateReturn || "-"}`, 14, y);
    y += 7;
    doc.text(`Duration: ${weeks} Week ${days} Day`, 14, y);
    y += 10;

    doc.setFontSize(12);
    doc.text("Charges", 14, y);
    y += 7;
    doc.setFontSize(11);
    doc.text(`Daily (${days} x $99.00): $${totalDaysRate.toFixed(2)}`, 14, y);
    y += 7;
    doc.text(`Weekly (${weeks} x $390.00): $${totalWeeksRate.toFixed(2)}`, 14, y);
    y += 7;
    doc.text(`Collision Damage Waiver: $${collisionRate.toFixed(2)}`, 14, y);
    y += 7;
    doc.text(`Liability Insurance: $${liabilityRate.toFixed(2)}`, 14, y);
    y += 7;
    doc.text(`Discount: ${discount || "-"}`, 14, y);
    y += 7;
    doc.text(`Rental Tax (${rentalRate}%): $${taxAmount.toFixed(2)}`, 14, y);
    y += 9;

    doc.setFontSize(13);
    doc.text(`Total: $${total.toFixed(2)}`, 14, y);

    doc.save("reservation-invoice.pdf");
  };

  return (
    <>
      <div className="max-w-full mx-36 my-12">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Reservation</h1>
          <button
            className="flex justify-center items-center px-5 py-3 bg-indigo-500 text-xs font-semibold text-gray-50 rounded-md"
            onClick={downloadInvoice}
          >
            Download Invoice
          </button>
        </div>
        <div className="grid grid-cols-12 gap-8 max-w-full">
          <div className="col-span-4">
            <ReservationDetails />
            <VehicleInfo />
          </div>
          <div className="col-span-4">
            <CustomerInfo />
            <AdditionalCharges />
          </div>
          <div className="col-span-4">
            <ChargesSummary />
          </div>
        </div>
      </div>
    </>
  );
}

export default Reservation;