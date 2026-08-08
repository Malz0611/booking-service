import type { BookingEntity } from "./booking";

export interface BookingHistoryQuery {
  page: number;
  limit: number;
  resource_id?: number;
  status?: "confirmed" | "cancelled";
}

export interface PaginatedBookingHistory {
  data: BookingEntity[];
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}