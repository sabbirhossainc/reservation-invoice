import { useReservationStore } from "../store/useReservationStore";

const VehicleInfo = () => {
  const { products, vehicleType, vehicleMake, setVehicleType, setVehicleMake } = useReservationStore();

  return (
    <div className="pt-8 mx-auto max-w-3xl">
      <h2 className="mb-6 pb-1 text-xl font-medium text-gray-900 border-b-2 border-primary-500">
        Vehicle Information
      </h2>
      <form action="#">
        <div className="flex flex-col gap-4 p-4 border border-gray-300 rounded-md">
          <div className="">
            <label className="block mb-2 text-sm font-light text-gray-900">
              Vehicle Type <span className="text-red-600">*</span>
            </label>
            <select
              id="vehicle-type"
              className="border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-primary-500 focus:border-primary-500 block w-full p-2"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            >
              <option value="">Select vehicle type</option>
              {products && products.length > 0 ? (
                products.map((product) => (
                  <option value={product.type} key={product.id}>
                    {product.type}
                  </option>
                ))
              ) : (
                <option value="no-data">No data!</option>
              )}
            </select>
          </div>
          <div className="">
            <label className="block mb-2 text-sm font-light text-gray-900">
              Vehicle <span className="text-red-600">*</span>
            </label>
            <select
              id="vehicle-make"
              className="border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-primary-500 focus:border-primary-500 block w-full p-2"
              value={vehicleMake}
              onChange={(e) => setVehicleMake(e.target.value)}
            >
              <option value="">Select vehicle</option>
              {products && products.length > 0 ? (
                products.map((product) => (
                  <option value={product.make} key={product.id}>
                    {product.make}
                  </option>
                ))
              ) : (
                <option value="no-data">No data!</option>
              )}
            </select>
          </div>
        </div>
      </form>
    </div>
  );
};

export default VehicleInfo;