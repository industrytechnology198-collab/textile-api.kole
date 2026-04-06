import { Role } from '@prisma/client';

export interface GetUserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  isEmailVerified: boolean;
  role: Role;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
}
