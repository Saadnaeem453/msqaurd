import { api } from "../lib/api";

export type RevenuePeriod = "7d" | "30d" | "90d" | "1y";
export interface RevenueFilters { period?: RevenuePeriod; startDate?: string; endDate?: string; eventId?: string; tierId?: string; }
export interface SalesVelocityPoint { date: string; tiers: Record<string, number>; tickets_sold: number; }
export interface RevenueTransaction { order_id: string; purchaser: { full_name: string; email: string } | null; event: string | null; event_id: string; tier: string | null; tier_id: string; quantity: number; ticket_price_minor: number; transaction_total_minor: number; gross_order_minor: number; payment_status: string; payment_date: string; }
export interface RevenueOverview { kpis: { total_revenue: number; tickets_sold: number; average_ticket_price: number; net_profit: number; platform_fees: number; percentage_changes: Record<string, number> }; sales_velocity: SalesVelocityPoint[]; recent_transactions: RevenueTransaction[]; }
export interface TransactionsResponse { transactions: RevenueTransaction[]; pagination: { page: number; limit: number; total: number; total_pages: number }; }
const params = (filters: RevenueFilters = {}) => filters;
export const organizerTicketSalesApi = {
  overview: (filters?: RevenueFilters) => api.get<RevenueOverview>("/organizer/revenue/overview", { params: params(filters), successMessage: false, errorMessage: false }),
  transactions: (filters?: RevenueFilters & { page?: number; limit?: number; sort?: "newest" | "oldest" }) => api.get<TransactionsResponse>("/organizer/revenue/transactions", { params: params(filters), successMessage: false, errorMessage: false }),
  export: (filters?: RevenueFilters) => api.download("/organizer/revenue/export", { params: params(filters) }),
};
