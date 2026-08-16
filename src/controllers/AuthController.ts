import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import HttpResponse from "../common/HttpResponse";
import { UserService } from "../services/UserServices";
import type { CreateUserForm } from "../forms/user";

export class AuthController {
  private userService = new UserService();

  async signup(req: Request): Promise<Response> {
    try {
      const body = (await req.json()) as CreateUserForm;

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(body.email)) {
        return HttpResponse.failure("Invalid email format.", 400);
      }

      // Minimum password length
      if (body.password.length < 8) {
        return HttpResponse.failure(
          "Password must be at least 8 characters long.",
          400
        );
      }

      const user = await this.userService.createUser(body);

      return HttpResponse.success(
        "User created successfully.",
        user,
        201
      );
    } catch (error) {
  if (error instanceof Error && error.message === "Email already exists.") {
    return HttpResponse.failure(
      error.message,
      409
    );
  }

  return HttpResponse.failure(
    error instanceof Error ? error.message : "Something went wrong",
    500
  );
}
  }


async signin(req: Request): Promise<Response> {
  try {
    const body = (await req.json()) as { email: string; password: string };
    const user = await this.userService.findByEmail(body.email);

    if (!user) {
      return HttpResponse.failure("Invalid email or password.", 401);
    }
    const validPassword = await bcrypt.compare(body.password, user.password);

    if (!validPassword) {
      return HttpResponse.failure("Invalid email or password.", 401);
    }
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );
    return HttpResponse.success("Signin successful.", { token }, 200);
  } catch (error) {
    return HttpResponse.failure("Internal server error.", 500);
  }  
  }
}