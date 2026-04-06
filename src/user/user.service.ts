import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { GetUsersHandler } from './handlers/get-users.handler';
import { GetUserHandler } from './handlers/get-user.handler';
import { GetMeHandler } from './handlers/get-me.handler';
import { UpdateUserHandler } from './handlers/update-user.handler';
import { UpdateMeHandler } from './handlers/update-me.handler';
import { UpdateMePasswordHandler } from './handlers/update-me-password.handler';
import { UpdateMeEmailHandler } from './handlers/update-me-email.handler';
import { DeleteUserHandler } from './handlers/delete-user.handler';
import { GetUsersQueryDto } from './dto/get-users.dto';
import { UpdateMeDto } from './dto/update-me.dto';
import { UpdateMePasswordDto } from './dto/update-me-password.dto';
import { UpdateMeEmailDto } from './dto/update-me-email.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly getUsersHandler: GetUsersHandler,
    private readonly getUserHandler: GetUserHandler,
    private readonly getMeHandler: GetMeHandler,
    private readonly updateUserHandler: UpdateUserHandler,
    private readonly updateMeHandler: UpdateMeHandler,
    private readonly updateMePasswordHandler: UpdateMePasswordHandler,
    private readonly updateMeEmailHandler: UpdateMeEmailHandler,
    private readonly deleteUserHandler: DeleteUserHandler,
  ) {}

  findAll(query: GetUsersQueryDto) {
    return this.getUsersHandler.execute(query);
  }

  findOne(id: string) {
    return this.getUserHandler.execute(id);
  }

  getMe(userId: string) {
    return this.getMeHandler.execute(userId);
  }

  updateMe(userId: string, dto: UpdateMeDto) {
    return this.updateMeHandler.execute(userId, dto);
  }

  updateMePassword(userId: string, dto: UpdateMePasswordDto, res: Response) {
    return this.updateMePasswordHandler.execute(userId, dto, res);
  }

  updateMeEmail(userId: string, dto: UpdateMeEmailDto, res: Response) {
    return this.updateMeEmailHandler.execute(userId, dto, res);
  }

  updateUser(id: string, dto: AdminUpdateUserDto) {
    return this.updateUserHandler.execute(id, dto);
  }

  remove(id: string, currentUserId: string) {
    return this.deleteUserHandler.execute(id, currentUserId);
  }
}
