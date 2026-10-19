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
  order_id?: string;
  checkout_session_id?: string;
  status?: "pending" | "paid" | "succeeded" | "failed" | "expired";
  payment_status: "pending" | "paid" | "succeeded" | "failed" | "expired";
  ticket_status?: "pending" | "issued" | "failed";
  ticket_count?: number;
  total_minor?: number;
  paid_at?: string | null;
  event?: {
    id: string;
    title: string;
    event_date?: string;
    start_time?: string;
    end_time?: string;
    venue_name?: string | null;
    venue_type?: string | null;
    hero_image?: string | null;
  } | null;
  items?: Array<{
    tier_id: string;
    tier_name?: string | null;
    quantity: number;
    unit_amount_minor: number;
    total_amount_minor: number;
  }>;
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
  createCheckoutSession: (payload: CreateCheckoutSessionPayload, idempotencyKey: string) =>
    api.post<CheckoutSessionResponse>("/payments/checkout-session", payload, {
      successMessage: false,
      errorMessage: false,
      headers: { "Idempotency-Key": idempotencyKey },
    }),

  getCheckoutSessionStatus: (sessionId: string) =>
    api.get<CheckoutSessionStatus>(
      `/payments/checkout-session/${encodeURIComponent(sessionId)}/status`,
      { successMessage: false, errorMessage: false }
    ),
};
