import type { MigrationInterface, QueryRunner } from "typeorm";

export class RenameIsBlockedToBlocked20260801000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "booking_service"."resources" RENAME COLUMN "is_blocked" TO "blocked"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "booking_service"."resources" RENAME COLUMN "blocked" TO "is_blocked"`
    );
  }
}