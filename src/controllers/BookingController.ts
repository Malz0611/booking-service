import type { BunRequest } from "bun";
import HttpResponse from "../common/HttpResponse";
import { BookingService } from "../services/BookingService";
import type { CreateBookingForm } from "../forms/booking";
import type { AuthRequest } from "../middleware/auth";

export class BookingController {
private bookingService = new BookingService();

// GET /bookings
async list(req: BunRequest<"/bookings">): Promise<Response> {
try {
const url = new URL(req.url);

const resource_id = url.searchParams.get("resource_id");
const status = url.searchParams.get("status");
const from = url.searchParams.get("from");
const to = url.searchParams.get("to");

const bookings = await this.bookingService.getBookings({
resource_id: resource_id
? Number(resource_id)
: undefined,

status: status ?? undefined,

from: from
? new Date(from)
: undefined,

to: to
? new Date(to)
: undefined,
});

return HttpResponse.success(
"Bookings fetched successfully",
bookings
);
} catch (error) {
return HttpResponse.failure(
error instanceof Error
? error.message
: "Something went wrong",
500
);
}
}

// POST /bookings
async create(req: AuthRequest): Promise<Response> {
try {
const body = await req.json();

const booking = await this.bookingService.createBooking(
body as CreateBookingForm,
req.user!.id
);

return HttpResponse.success(
"Booking created successfully",
booking,
201
);
} catch (error) {
const message =
error instanceof Error
? error.message
: "Something went wrong";

// Booking conflict
if (
message ===
"Booking overlaps an existing confirmed booking."
) {
return HttpResponse.failure(message, 409);
}

// Resource is blocked
if (
message ===
"Resource is blocked and cannot be booked."
) {
return HttpResponse.failure(message, 409);
}

// Resource doesn't exist
if (message === "Resource not found.") {
return HttpResponse.failure(message, 404);
}

// Invalid dates
if (
message ===
"End time must be after start time."
) {
return HttpResponse.failure(message, 400);
}

return HttpResponse.failure(message, 500);
}
}

// PUT /bookings/:id
async update(req: AuthRequest): Promise<Response> {
try {
const url = new URL(req.url);

// /bookings/1
const parts = url.pathname.split("/");
const id = Number(parts[parts.length - 1]);

if (!id || Number.isNaN(id)) {
return HttpResponse.failure(
"Invalid booking ID",
400
);
}

const body = await req.json();

const booking =
await this.bookingService.updateBooking(
id,
body as Partial<CreateBookingForm>
);

if (!booking) {
return HttpResponse.notFound(
"Booking not found"
);
}

return HttpResponse.success(
"Booking updated successfully",
booking
);
} catch (error) {
const message =
error instanceof Error
? error.message
: "Something went wrong";

if (
message ===
"Cancelled bookings cannot be edited."
) {
return HttpResponse.failure(message, 400);
}

if (
message ===
"Booking overlaps an existing confirmed booking."
) {
return HttpResponse.failure(message, 409);
}

return HttpResponse.failure(message, 500);
}
}

// PATCH /bookings/:id/cancel
async cancel(req: AuthRequest): Promise<Response> {
try {
const url = new URL(req.url);

// /bookings/1/cancel
const parts = url.pathname.split("/");

// ["", "bookings", "1", "cancel"]
const id = Number(parts[parts.length - 2]);

if (!id || Number.isNaN(id)) {
return HttpResponse.failure(
"Invalid booking ID",
400
);
}

const booking =
await this.bookingService.cancelBooking(id);

if (!booking) {
return HttpResponse.notFound(
"Booking not found"
);
}

return HttpResponse.success(
"Booking cancelled successfully",
booking
);
} catch (error) {
const message =
error instanceof Error
? error.message
: "Something went wrong";

if (
message ===
"Booking is already cancelled."
) {
return HttpResponse.failure(message, 400);
}

if (message === "Booking not found.") {
return HttpResponse.notFound(message);
}

return HttpResponse.failure(message, 500);
}
}
}
