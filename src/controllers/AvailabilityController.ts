import HttpResponse from "../common/HttpResponse";
import { AvailabilityService } from "../services/AvailabilityService";

export class AvailabilityController {
  private availabilityService = new AvailabilityService();

  async search(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const type = url.searchParams.get("type");
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");

  if (!type || !from || !to) {
      return HttpResponse.failure("type, from, and to query params are required", 400);
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return HttpResponse.failure("from and to must be valid dates", 400);
    }

    if (fromDate >= toDate) {
      return HttpResponse.failure("from must be before to", 400);
    }

    const results = await this.availabilityService.search({
      type,
      from: fromDate,
      to: toDate,
    });
    return HttpResponse.success("Availability search results", results);
  }
}