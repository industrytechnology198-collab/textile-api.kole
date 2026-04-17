import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import type { Response } from 'express';
import type { JwtPayload } from 'src/auth/strategies/jwt.strategy';
import { UserService } from './user.service';
import { GetUsersQueryDto } from './dto/get-users.dto';
import { UpdateMeDto } from './dto/update-me.dto';
import { UpdateMePasswordDto } from './dto/update-me-password.dto';
import { UpdateMeEmailDto } from './dto/update-me-email.dto';
import { UpdateMeLanguageDto } from './dto/update-me-language.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { ApiGetUsers } from './decorators/get-users.decorator';
import { ApiGetUser } from './decorators/get-user.decorator';
import { ApiGetMe } from './decorators/get-me.decorator';
import { ApiUpdateUser } from './decorators/update-user.decorator';
import { ApiUpdateMe } from './decorators/update-me.decorator';
import { ApiUpdateMePassword } from './decorators/update-me-password.decorator';
import { ApiUpdateMeEmail } from './decorators/update-me-email.decorator';
import { ApiUpdateMeLanguage } from './decorators/update-me-language.decorator';
import { ApiDeleteUser } from './decorators/delete-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiGetMe()
  getMe(@CurrentUser() user: JwtPayload) {
    return this.userService.getMe(user.userId);
  }

  @Patch('me')
  @ApiUpdateMe()
  updateMe(@CurrentUser() user: JwtPayload, @Body() dto: UpdateMeDto) {
    return this.userService.updateMe(user.userId, dto);
  }

  @Patch('me/password')
  @Roles(Role.CUSTOMER)
  @ApiUpdateMePassword()
  updateMePassword(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateMePasswordDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.userService.updateMePassword(user.userId, dto, res);
  }

  @Patch('me/email')
  @Roles(Role.CUSTOMER)
  @ApiUpdateMeEmail()
  updateMeEmail(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateMeEmailDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.userService.updateMeEmail(user.userId, dto, res);
  }

 
  @Patch('me/language')
  @ApiUpdateMeLanguage()
  updateMeLanguage(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateMeLanguageDto,
  ) {
    return this.userService.updateMeLanguage(user.userId, dto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiGetUsers()
  findAll(@Query() query: GetUsersQueryDto) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiGetUser()
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiUpdateUser()
  updateUser(@Param('id') id: string, @Body() dto: AdminUpdateUserDto) {
    return this.userService.updateUser(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiDeleteUser()
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.userService.remove(id, user.userId);
  }
}
