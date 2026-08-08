import type { ResourceEntity } from "./resource";

export interface AvailabilitySearchQuery{
    type: string;
    from: Date;
    to : Date;
}

export type AvailabilityResult = Pick<ResourceEntity, "id" | "name" | "type" | "capacity">;