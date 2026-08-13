import type { MigrationInterface, QueryRunner } from "typeorm";
import pkg from "typeorm";
const { Table } = pkg;

export class CreateResources20260724000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS booking_service`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    const tableExists = await queryRunner.hasTable("booking_service.resources");
    if (tableExists) return;

    await queryRunner.createTable(
      new Table({
        name: "booking_service.resources",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "uuid", type: "uuid", default: "uuid_generate_v4()" },
          { name: "name", type: "varchar" },
          { name: "type", type: "varchar" },
          { name: "capacity", type: "int" },
          { name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP" },
          { name: "updated_at", type: "timestamp", default: "CURRENT_TIMESTAMP" },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("booking_service.resources");
  }
}
