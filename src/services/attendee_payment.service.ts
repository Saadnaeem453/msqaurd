import { api } from "../lib/api";

export interface CreateCheckoutSessionPayload {
  ticket_tier_id: string;
  quantity: number;
  purchaser: {
    full_name: string;
    email: string;
  };
}

export interface CheckoutSessionResponse {
  checkout_url: string;
}

export interface IssuedTicket {
  id: string;
  ticket_type: string;
  attendee_name?: string;
  qr_code_url?: string;
}

export interface CheckoutSessionStatus {
  payment_status: "pending" | "paid" | "failed" | "expired";
  ticket_status: "pending" | "issued" | "failed";
  order_number?: string;
  event_title?: string;
  ticket_type?: string;
  quantity?: number;
  currency?: string;
  subtotal?: number;
  booking_fee?: number;
  total?: number;
  tickets?: IssuedTicket[];
}

export const attendeePaymentApi = {
  createCheckoutSession: (payload: CreateCheckoutSessionPayload) =>
    api.post<CheckoutSessionResponse>("/payments/checkout-session", payload, {
      successMessage: false,
      errorMessage: false,
    }),

  getCheckoutSessionStatus: (sessionId: string) =>
    api.get<CheckoutSessionStatus>(
      `/payments/checkout-session/${encodeURIComponent(sessionId)}/status`,
      { successMessage: false, errorMessage: false }
    ),
};
