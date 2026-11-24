import { useReservationStore } from "../store/useReservationStore";
import { calculateReservationCharges } from "../utils/reservationCharges.js";

const ChargesSummary = () => {
  const {
    weeks,
    days,
    collision,
    liability,
    rental,
  } = useReservationStore();

  const {
    daily,
    weekly,
    waiver,
    liability: liabilityCharge,
    taxRate,
    total,
  } = calculateReservationCharges({ weeks, days, collision, liability, rental });

  return (
    <div className="pt-8 max-w-3xl">
      <h2 className="mb-6 pb-1 text-xl font-medium text-gray-900 border-b-2 border-primary-500">
        Charges Summary
      </h2>
      <div className="w-full mx-auto overflow-auto bg-primary-100 p-3 rounded-md ring-1 ring-primary-500">
        <table className="table-auto w-full text-left whitespace-no-wrap">
          <thead className="border-b-2 border-primary-500">
            <tr>
              <th className="px-2 py-4 title-font text-gray-900 text-base">
                Charge
              </th>
              <th className="px-2 py-4 title-font text-gray-900 text-base">
                Unit
              </th>
              <th className="px-2 py-4 title-font text-gray-900 text-base">
                Rate
              </th>
              <th className="px-2 py-4 title-font text-gray-900 text-base">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-2 py-4 ">Daily</td>
              <td className="px-2 py-4 ">{days}</td>
              <td className="px-2 py-4 ">$99.00</td>
              <td className="px-2 py-4 ">${daily}.00</td>
            </tr>
            <tr>
              <td className="px-2 py-4 ">Weekly</td>
              <td className="px-2 py-4 ">{weeks}</td>
              <td className="px-2 py-4 ">$390.00</td>
              <td className="px-2 py-4 ">${weekly}.00</td>
            </tr>
            <tr className={`${collision ? "" : "hidden"}`} >
              <td className="px-2 py-4">Collision Damage Waiver</td>
              <td></td>
              <td className="px-2 py-4">$9.00</td>
              <td className="px-2 py-4">${waiver}.00</td>
            </tr>
            <tr className={`${liability ? "" : "hidden"}`}>
              <td className="px-2 py-4">Liability Insurance</td>
              <td></td>
              <td className="px-2 py-4">$15.00</td>
              <td className="px-2 py-4">${liabilityCharge}.00</td>
            </tr>
            <tr className={`${rental ? "" : "hidden"}`}>
              <td className="px-2 py-4">Rental Tax</td>
              <td></td>
              <td></td>
              <td className="px-2 py-4">{taxRate}%</td>
            </tr>
          </tbody>
          <thead className="">
            <tr>
              <th className="px-2 py-4 title-font text-gray-900 text-base">
                Total
              </th>
              <th></th>
              <th></th>
              <th className="px-2 py-4 title-font text-gray-900 text-base">
                ${total}
              </th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
};

export default ChargesSummary;