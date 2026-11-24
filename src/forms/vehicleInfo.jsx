import { Car, CarFront } from "lucide-react";
import { useReservationStore } from "../store/useReservationStore";
import { Card, Field, SectionHeading } from "../components/ui";

const VehicleInfo = () => {
  const { products, vehicleType, vehicleMake, setVehicleType, setVehicleMake } = useReservationStore();

  return (
    <Card>
      <SectionHeading
        icon={CarFront}
        title="Vehicle Information"
        description="Choose the unit and make for this reservation"
      />
      <form action="#" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Vehicle Type" htmlFor="vehicle-type" icon={CarFront} required>
          <select
            id="vehicle-type"
            className="field-control pl-10"
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
        </Field>
        <Field label="Vehicle" htmlFor="vehicle-make" icon={Car} required>
          <select
            id="vehicle-make"
            className="field-control pl-10"
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
        </Field>
      </form>
    </Card>
  );
};

export default VehicleInfo;
