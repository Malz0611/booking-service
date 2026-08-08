import { AppDataSource } from "../data-source";
import { BookingSchema } from "../models/schemas";
import type {
  BookingHistoryQuery,
  PaginatedBookingHistory,
} from "../forms/bookingHistory";

export class BookingHistoryService {
  async getHistory(
    query: BookingHistoryQuery,
  ): Promise<PaginatedBookingHistory> {
    const bookingRepo = AppDataSource.getRepository(BookingSchema);

    const qb = bookingRepo
      .createQueryBuilder("booking")
      .where("booking.end_time < :now", { now: new Date() });

    if (query.resource_id !== undefined) {
      qb.andWhere("booking.resource_id = :resourceId", {
        resourceId: query.resource_id,
      });
    }

    if (query.status) {
      qb.andWhere("booking.status = :status", {
        status: query.status,
      });
    }

    const total = await qb.getCount();

    const data = await qb
      .orderBy("booking.start_time", "DESC")
      .skip((query.page - 1) * query.limit)
      .take(query.limit)
      .getMany();

    return {
      data,
      page: query.page,
      limit: query.limit,
      total,
      total_pages: Math.max(1, Math.ceil(total / query.limit)),
    };
  }
}