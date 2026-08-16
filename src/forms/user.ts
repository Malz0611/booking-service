export interface UserEntity {
  id: number;
  uuid: string;

  email: string;
  password: string;

  created_at: Date;
  updated_at: Date;
}

export interface CreateUserForm {
  email: string;
  password: string;
}