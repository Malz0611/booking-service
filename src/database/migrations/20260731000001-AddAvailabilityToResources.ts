import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddAvailabilityToResources20260731000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "booking_service"."resources" ADD COLUMN "open_time" varchar`
    );
    await queryRunner.query(
      `ALTER TABLE "booking_service"."resources" ADD COLUMN "close_time" varchar`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "booking_service"."resources" DROP COLUMN "open_time"`
    );
    await queryRunner.query(
      `ALTER TABLE "booking_service"."resources" DROP COLUMN "close_time"`
    );
  }
}