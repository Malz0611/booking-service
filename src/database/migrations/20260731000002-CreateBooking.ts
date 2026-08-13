import type { MigrationInterface, QueryRunner } from "typeorm";
import pkg from "typeorm";

const { Table } = pkg;

export class CreateBookings20260731000002 implements MigrationInterface {
public async up(queryRunner: QueryRunner): Promise<void> {
const tableExists = await queryRunner.hasTable("booking_service.bookings");
if (tableExists) return;

await queryRunner.createTable(
new Table({
name: "booking_service.bookings",
columns: [
{
name: "id",
type: "int",
isPrimary: true,
isGenerated: true,
generationStrategy: "increment",
},
{
name: "uuid",
type: "uuid",
default: "uuid_generate_v4()",
},
{
name: "resource_id",
type: "int",
},
{
name: "booked_by",
type: "varchar",
},
{
name: "start_time",
type: "timestamp",
},
{
name: "end_time",
type: "timestamp",
},
{
name: "status",
type: "varchar",
default: "'confirmed'",
},
{
name: "created_at",
type: "timestamp",
default: "CURRENT_TIMESTAMP",
},
{
name: "updated_at",
type: "timestamp",
default: "CURRENT_TIMESTAMP",
},
],

foreignKeys: [
{
columnNames: ["resource_id"],
referencedTableName: "booking_service.resources",
referencedColumnNames: ["id"],
onDelete: "CASCADE",
},
],
})
);
}

public async down(queryRunner: QueryRunner): Promise<void> {
await queryRunner.dropTable("booking_service.bookings");
}
}