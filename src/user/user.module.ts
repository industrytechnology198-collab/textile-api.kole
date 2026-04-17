import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './repositories/user.repository';
import { GetUsersHandler } from './handlers/get-users.handler';
import { GetUserHandler } from './handlers/get-user.handler';
import { GetMeHandler } from './handlers/get-me.handler';
import { UpdateUserHandler } from './handlers/update-user.handler';
import { UpdateMeHandler } from './handlers/update-me.handler';
import { UpdateMePasswordHandler } from './handlers/update-me-password.handler';
import { UpdateMeEmailHandler } from './handlers/update-me-email.handler';
import { UpdateMeLanguageHandler } from './handlers/update-me-language.handler';
import { DeleteUserHandler } from './handlers/delete-user.handler';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    GetUsersHandler,
    GetUserHandler,
    GetMeHandler,
    UpdateUserHandler,
    UpdateMeHandler,
    UpdateMePasswordHandler,
    UpdateMeEmailHandler,
    UpdateMeLanguageHandler,
    DeleteUserHandler,
  ],
  exports: [UserRepository],
})
export class UserModule {}
