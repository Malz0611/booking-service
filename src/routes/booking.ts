import type { BunRequest } from "bun";
import { BookingController } from "../controllers/BookingController";
import {
authenticate,
type AuthRequest,
} from "../middleware/auth";

const controller = new BookingController();

export const bookingRoutes = {
"/bookings": {
// GET /bookings
GET: (req: BunRequest<"/bookings">) => {
  const auth = authenticate(req as AuthRequest);

  if (auth) {
    return auth;
  }

  return controller.list(req);
},

// POST /bookings
POST: (req: Request) => {
const auth = authenticate(req as AuthRequest);

if (auth) {
return auth;
}

return controller.create(req as AuthRequest);
},
},

// PUT /bookings/:id
"/bookings/:id": {
PUT: (req: Request) => {
const auth = authenticate(req as AuthRequest);

if (auth) {
return auth;
}

return controller.update(req as AuthRequest);
},
},

// PATCH /bookings/:id/cancel
"/bookings/:id/cancel": {
PATCH: (req: Request) => {
const auth = authenticate(req as AuthRequest);

if (auth) {
return auth;
}

return controller.cancel(req as AuthRequest);
},
},
};