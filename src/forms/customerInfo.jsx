import { Mail, Phone, User, UserRound } from "lucide-react";
import { useReservationStore } from "../store/useReservationStore";
import { Card, Field, SectionHeading } from "../components/ui";

const CustomerInfo = () => {
  const {
    firstName,
    lastName,
    email,
    phone,
    setFirstName,
    setLastName,
    setEmail,
    setPhone,
  } = useReservationStore();

  return (
    <Card>
      <SectionHeading
        icon={UserRound}
        title="Customer Information"
        description="Who is picking up the vehicle?"
      />
      <form action="#" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="First Name" htmlFor="first-name" icon={User} required>
          <input
            type="text"
            name="first-name"
            id="first-name"
            className="field-control pl-10"
            placeholder="Type first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </Field>
        <Field label="Last Name" htmlFor="last-name" icon={User} required>
          <input
            type="text"
            name="last-name"
            id="last-name"
            className="field-control pl-10"
            placeholder="Type last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </Field>
        <Field label="Email" htmlFor="email" icon={Mail} required>
          <input
            type="email"
            name="email"
            id="email"
            className="field-control pl-10"
            placeholder="Type email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>
        <Field label="Phone" htmlFor="phone-input" icon={Phone} required>
          <input
            type="tel"
            name="phone"
            id="phone-input"
            className="field-control pl-10"
            placeholder="Type phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </Field>
      </form>
    </Card>
  );
};

export default CustomerInfo;
