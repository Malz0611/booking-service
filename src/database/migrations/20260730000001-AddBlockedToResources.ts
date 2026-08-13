import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddBlockedToResources20260730000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "booking_service"."resources" ADD COLUMN "is_blocked" boolean NOT NULL DEFAULT false`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "booking_service"."resources" DROP COLUMN "is_blocked"`
    );
  }
}