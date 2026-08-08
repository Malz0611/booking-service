import { AvailabilityController } from "../controllers/AvailabilityController";

const controller = new AvailabilityController();


export const AvailabilityRoutes = {
  "/availability": {
    GET: (req:Request ) => controller.search(req),
  },
};
