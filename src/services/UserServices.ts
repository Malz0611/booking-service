import bcrypt from "bcrypt";
import { BaseService } from "./BaseService";
import { UserSchema } from "../models/schemas";
import type { UserEntity, CreateUserForm } from "../forms/user";

export class UserService extends BaseService<UserEntity> {
  constructor() {
    super(UserSchema);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.findByField("email", email);
  }

  async createUser(data: CreateUserForm): Promise<UserEntity> {
    if (!/\S+@\S+\.\S+/.test(data.email)) {
  throw new Error("Invalid email address.");
}

if (data.password.length < 8) {
  throw new Error("Password must be at least 8 characters.");
}
    const existingUser = await this.findByEmail(data.email);

    if (existingUser) {
      throw new Error("Email already exists.");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return await this.create({
      email: data.email,
      password: hashedPassword,
    });
  }
}