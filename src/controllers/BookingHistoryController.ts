import HttpResponse from "../common/HttpResponse";
import { BookingHistoryService } from "../services/BookingHistoryService";

export class BookingHistoryController {
  private bookingHistoryService = new BookingHistoryService();

  async history(req: Request): Promise<Response> {
    const url = new URL(req.url);

    const pageParam = url.searchParams.get("page");
    const limitParam = url.searchParams.get("limit");
    const resourceIdParam = url.searchParams.get("resource_id");
    const statusParam = url.searchParams.get("status");

    const page = pageParam ? Number(pageParam) : 1;
    const limit = limitParam ? Number(limitParam) : 10;

    if (!Number.isInteger(page) || page < 1) {
      return HttpResponse.failure(
        "page must be a positive integer",
        400,
      );
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      return HttpResponse.failure(
        "limit must be a positive integer between 1 and 100",
        400,
      );
    }

    let resource_id: number | undefined;

    if (resourceIdParam !== null) {
      resource_id = Number(resourceIdParam);

      if (!Number.isInteger(resource_id)) {
        return HttpResponse.failure(
          "resource_id must be an integer",
          400,
        );
      }
    }

    if (
      statusParam !== null &&
      statusParam !== "confirmed" &&
      statusParam !== "cancelled"
    ) {
      return HttpResponse.failure(
        "status must be 'confirmed' or 'cancelled'",
        400,
      );
    }

    const result = await this.bookingHistoryService.getHistory({
      page,
      limit,
      resource_id,
      status: statusParam ?? undefined,
    });

    return HttpResponse.success(
      "Booking history fetched successfully",
      result,
    );
  }
}