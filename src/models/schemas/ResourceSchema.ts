import { EntitySchema } from "typeorm";
import { baseColumnOptions } from "./BaseSchema";
import type { ResourceEntity } from "../../forms/resource";

export const ResourceSchema = new EntitySchema<ResourceEntity>({
  name: "Resource",
  tableName: "resources",
  columns: {
    ...baseColumnOptions,
    id: {
      type: "int",
      primary: true,
      generated: "increment",
    },
    name: {
      type: String,
    },
    type: {
      type: String,
    },
    capacity: {
      type: "int",
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    open_time: {
      type: String,
      nullable: true,
    },
    close_time: {
      type: String,
      nullable: true,
    },
  },
});