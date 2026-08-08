import type { AvailabilitySearchQuery, AvailabilityResult } from "../forms/availability";
import { ResourceService } from "./ResourceService";
import type { ResourceEntity } from "../forms/resource";
import { AppDataSource } from "../data-source";
import { BookingSchema } from "../models/schemas";

export class AvailabilityService {
  private resourceService = new ResourceService();

  async search(query: AvailabilitySearchQuery): Promise<AvailabilityResult[]> {
    const allResources = await this.resourceService.findAll();
    const candidateResources = allResources.filter(
      (r) => r.type === query.type && r.blocked === false
    );

    const available: AvailabilityResult[] = [];

    for (const resource of candidateResources) {
      const fitsWindow = this.isWithinAvailabilityWindow(resource, query);
      if (!fitsWindow) continue;

      const hasConflict = await this.hasOverlappingBooking(resource.id, query);
      if (hasConflict) continue;

      available.push({
        id: resource.id,
        name: resource.name,
        type: resource.type,
        capacity: resource.capacity,
      });
    }

    return available;
  }

// OPEN QUESTION for the team: null open_time/close_time = always available, or never bookable?
// Currently treated as "always available" — confirm with Feature 1's owner.
  private isWithinAvailabilityWindow(
    resource: ResourceEntity,
    query: AvailabilitySearchQuery
  ): boolean {
    if (resource.open_time === null || resource.close_time === null) {
      return true;
    }

    const openMin = this.toMinutes(resource.open_time);
    const closeMin = this.toMinutes(resource.close_time);
    // e.g. open_time 22:00, close_time 06:00 -> window wraps past midnight.
    const wrapsMidnight = closeMin <= openMin;

    // The resource has a single *daily* window, so a multi-day request has to be
    // checked one calendar day at a time — otherwise a request like
    // "Mon 14:00 -> Wed 16:00" would only ever compare the 14:00/16:00 clock times
    // and ignore the fact that the resource is closed overnight in between.
    const dayCursor = new Date(query.from);
    dayCursor.setHours(0, 0, 0, 0);

    const lastDayStart = new Date(query.to);
    lastDayStart.setHours(0, 0, 0, 0);

    while (dayCursor.getTime() <= lastDayStart.getTime()) {
      const dayStartMs = dayCursor.getTime();
      const nextDayMs = dayStartMs + 24 * 60 * 60 * 1000;

      // Portion of [query.from, query.to] that falls on this calendar day.
      const segStartMs = Math.max(query.from.getTime(), dayStartMs);
      const segEndMs = Math.min(query.to.getTime(), nextDayMs);

      if (segStartMs < segEndMs) {
        const segStartMin = (segStartMs - dayStartMs) / 60000;
        const segEndMin = (segEndMs - dayStartMs) / 60000;

        if (!this.segmentFitsWindow(segStartMin, segEndMin, openMin, closeMin, wrapsMidnight)) {
          return false;
        }
      }

      dayCursor.setDate(dayCursor.getDate() + 1);
    }

    return true;
  }

  // segStart/segEnd are minutes-since-midnight for a slice of the request that
  // falls within a single calendar day.
  private segmentFitsWindow(
    segStart: number,
    segEnd: number,
    openMin: number,
    closeMin: number,
    wrapsMidnight: boolean
  ): boolean {
    if (!wrapsMidnight) {
      // Simple same-day window, e.g. 09:00 - 17:00.
      return segStart >= openMin && segEnd <= closeMin;
    }

    // Overnight window, e.g. 22:00 - 06:00: valid clock ranges for the day are
    // [0, closeMin] (early morning before closing) and [openMin, 1440] (evening
    // after opening). A segment can't straddle the closed gap in between.
    if (segEnd <= closeMin) return true;
    if (segStart >= openMin) return true;
    return false;
  }

  private toMinutes(hhmm: string): number {
    const [hours, minutes] = hhmm.split(":").map(Number);
    return hours * 60 + minutes;
  }


private async hasOverlappingBooking(
  resourceId: number,
  query: AvailabilitySearchQuery
): Promise<boolean> {
  const bookingRepo = AppDataSource.getRepository(BookingSchema);

  const overlap = await bookingRepo
    .createQueryBuilder("booking")
    .where("booking.resource_id = :resourceId", { resourceId })
    .andWhere("booking.status = :status", { status: "confirmed" })
    .andWhere("booking.start_time < :to AND booking.end_time > :from", {
      from: query.from,
      to: query.to,
    })
    .getOne();

  return !!overlap;
}}