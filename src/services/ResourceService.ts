import { BaseService } from "./BaseService";
import { ResourceSchema } from "../models/schemas";
import type { ResourceEntity, CreateResourceForm } from "../forms/resource";


export class ResourceService extends BaseService<ResourceEntity> {
  constructor() {
    super(ResourceSchema);
  }

  async createResource(data: CreateResourceForm): Promise<ResourceEntity> {
    return await this.create(data);
  }

  async blockResource(id: number): Promise<ResourceEntity | null> {
    return await this.updateById(id, { blocked: true });
  }

  async unblockResource(id: number): Promise<ResourceEntity | null> {
    return await this.updateById(id, { blocked: false });
  }

  async setAvailability(
    id: number,
    data: {
      open_time: string;
      close_time: string;
    }
  ) {
    return await this.updateById(id, data as Partial<ResourceEntity>);
  }
}