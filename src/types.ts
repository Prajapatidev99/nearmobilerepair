export interface ComponentProps {
  className?: string;
}

export interface Booking {
  id: string;
  name: string;
  mobile: string;
  brand: string;
  model: string;
  issue: string;
  address: string;
  timeSlot: string;
  paymentMethod: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
  rating?: number;
  review?: string;
  reviewSubmitted?: boolean;
}
