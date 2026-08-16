import type { BunRequest } from "bun";
import { ResourceController } from "../controllers/ResourceController";
import { authenticate, type AuthRequest } from "../middleware/auth";

const controller = new ResourceController();

export const resourceRoutes = {
  "/resources": {
    GET: (req: Request) => {
      const auth = authenticate(req as AuthRequest);

      if (auth) {
        return auth;
      }

      return controller.list();
    },

    POST: (req: Request) => {
      const auth = authenticate(req as AuthRequest);

      if (auth) {
        return auth;
      }

      return controller.create(req);
    },
  },

  "/resources/:id": {
    GET: (req: BunRequest<"/resources/:id">) => {
      const auth = authenticate(req as AuthRequest);

      if (auth) {
        return auth;
      }

      return controller.getById(req);
    },

    PUT: (req: BunRequest<"/resources/:id">) => {
      const auth = authenticate(req as AuthRequest);

      if (auth) {
        return auth;
      }

      return controller.update(req);
    },

    DELETE: (req: BunRequest<"/resources/:id">) => {
      const auth = authenticate(req as AuthRequest);

      if (auth) {
        return auth;
      }

      return controller.delete(req);
    },
  },

  "/resources/:id/block": {
    PATCH: (req: BunRequest<"/resources/:id/block">) => {
      const auth = authenticate(req as AuthRequest);

      if (auth) {
        return auth;
      }

      return controller.block(req);
    },
  },

  "/resources/:id/unblock": {
    PATCH: (req: BunRequest<"/resources/:id/unblock">) => {
      const auth = authenticate(req as AuthRequest);

      if (auth) {
        return auth;
      }

      return controller.unblock(req);
    },
  },

  "/resources/:id/availability": {
    POST: (req: BunRequest<"/resources/:id/availability">) => {
      const auth = authenticate(req as AuthRequest);

      if (auth) {
        return auth;
      }

      return controller.setAvailability(req);
    },
  },
};
