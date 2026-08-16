import { AuthController } from "../controllers/AuthController";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const controller = new AuthController();

export const authRoutes = {
  "/auth/signup": {
    POST: (req: Request) => controller.signup(req),
  },
  "/auth/signin": {
    POST:  (req: Request) => controller.signin(req),
  }
};