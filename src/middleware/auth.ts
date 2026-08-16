import jwt from "jsonwebtoken";
import HttpResponse from "../common/HttpResponse";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export function authenticate(req: AuthRequest): Response | null {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader) {
    return HttpResponse.failure("Authorization token missing.", 401);
  }

  if (!authHeader.startsWith("Bearer ")) {
    return HttpResponse.failure("Invalid authorization format.", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      id: number;
      email: string;
    };

    req.user = decoded;

    return null;
  } catch {
    return HttpResponse.failure("Invalid or expired token.", 401);
  }
}