import type { MigrationInterface, QueryRunner } from "typeorm";
import pkg from "typeorm";

const { TableColumn, TableForeignKey } = pkg;

export class AddUserIdToBookings20260805000004
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "bookings",
      new TableColumn({
        name: "user_id",
        type: "int",
        isNullable: true,
      })
    );

    await queryRunner.createForeignKey(
      "bookings",
      new TableForeignKey({
        name: "FK_bookings_user_id",
        columnNames: ["user_id"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      })
    );

    await queryRunner.dropColumn("bookings", "booked_by");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "bookings",
      new TableColumn({
        name: "booked_by",
        type: "varchar",
        isNullable: true,
      })
    );

    await queryRunner.dropForeignKey(
      "bookings",
      "FK_bookings_user_id"
    );

    await queryRunner.dropColumn("bookings", "user_id");
  }
}