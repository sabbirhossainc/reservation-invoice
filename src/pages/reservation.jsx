import { useEffect } from "react";
import { downloadReservationInvoice } from "../utils/invoicePdf.js";
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
      discount,
      firstName,
      lastName,
      email,
      phone,
      vehicleType,
      vehicleMake,
    });
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