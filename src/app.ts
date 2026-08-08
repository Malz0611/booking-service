import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { resourceRoutes } from "./routes/resource";
import { bookingRoutes } from "./routes/booking";
import { authRoutes } from "./routes/auth";
// Merge in bookingRoutes / availabilityRoutes here as those features land.
import { AvailabilityRoutes } from "./routes/availability";
import { bookingHistoryRoutes } from "./routes/bookingHistory";

const routes = {
  "/health": {
    GET: () => Response.json({ status: "ok" }, { status: 200 }),
  },
  ...resourceRoutes,
  ...bookingRoutes,
  ...authRoutes
  ...AvailabilityRoutes,
  ...bookingHistoryRoutes,
};

AppDataSource.initialize()
  .then(() => {
    const server = Bun.serve({
      port: Number(process.env.PORT ?? 3000),
      routes,
      fetch() {
        return Response.json({ success: false, message: "Not found" }, { status: 404 });
      },
    });

    console.log(`booking-service running at http://localhost:${server.port}`);
  })
  .catch((error) => {
    console.error("Failed to initialize database connection:", error);});