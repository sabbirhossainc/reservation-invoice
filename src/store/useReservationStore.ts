import { create } from 'zustand';

type Car = {
  id: string;
  type: string;
  make: string;
};

export const mockCars: Car[] = [
  { id: '1', type: 'SUV', make: 'Toyota' },
  { id: '2', type: 'Sedan', make: 'Honda' },
  { id: '3', type: 'Convertible', make: 'Mazda' },
];

type ReservationState = {
  products: Car[];
  collision: boolean;
  liability: boolean;
  rental: boolean;
  datePickup: string;
  dateReturn: string;
  weeks: number;
  days: number;
  reservationId: string;
  discount: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  vehicleType: string;
  vehicleMake: string;

  setProducts: (data: Car[]) => void;
  setCollision: (val: boolean) => void;
  setLiability: (val: boolean) => void;
  setRental: (val: boolean) => void;
  setDatePickup: (val: string) => void;
  setDateReturn: (val: string) => void;
  setReservationId: (val: string) => void;
  setDiscount: (val: string) => void;
  setFirstName: (val: string) => void;
  setLastName: (val: string) => void;
  setEmail: (val: string) => void;
  setPhone: (val: string) => void;
  setVehicleType: (val: string) => void;
  setVehicleMake: (val: string) => void;
  computeWeeksDays: () => void;
  reset: () => void;
};

const initialState = {
  products: [] as Car[],
  collision: false,
  liability: false,
  rental: false,
  datePickup: '',
  dateReturn: '',
  weeks: 0,
  days: 0,
  reservationId: '',
  discount: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  vehicleType: '',
  vehicleMake: '',
};

export const useReservationStore = create<ReservationState>((set, get) => ({
  ...initialState,

  setProducts: (data) => set({ products: data }),
  setCollision: (val) => set({ collision: val }),
  setLiability: (val) => set({ liability: val }),
  setRental: (val) => set({ rental: val }),
  setDatePickup: (val) => set({ datePickup: val }),
  setDateReturn: (val) => set({ dateReturn: val }),
  setReservationId: (val) => set({ reservationId: val }),
  setDiscount: (val) => set({ discount: val }),
  setFirstName: (val) => set({ firstName: val }),
  setLastName: (val) => set({ lastName: val }),
  setEmail: (val) => set({ email: val }),
  setPhone: (val) => set({ phone: val }),
  setVehicleType: (val) => set({ vehicleType: val }),
  setVehicleMake: (val) => set({ vehicleMake: val }),

  computeWeeksDays: () => {
    const { datePickup, dateReturn } = get();
    if (!datePickup || !dateReturn) {
      set({ weeks: 0, days: 0 });
      return;
    }

    const d1 = new Date(datePickup);
    const d2 = new Date(dateReturn);

    if (Number.isNaN(d1.getTime()) || Number.isNaN(d2.getTime()) || d2.getTime() <= d1.getTime()) {
      set({ weeks: 0, days: 0 });
      return;
    }

    const diffMs = d2.getTime() - d1.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    set({
      weeks: Math.floor(diffDays / 7),
      days: diffDays % 7,
    });
  },

  reset: () => set({ ...initialState }),
}));