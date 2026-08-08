import { BookingHistoryController } from "../controllers/BookingHistoryController";

const controller = new BookingHistoryController();

export const bookingHistoryRoutes = {
  "/bookings/history": {
    GET: (req: Request) => controller.history(req),
  },
};