import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtPayload } from 'src/auth/strategies/jwt.strategy';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AdminGetAddressesQueryDto } from './dto/admin-get-addresses-query.dto';
import { ApiCreateAddress } from './decorators/create-address.decorator';
import { ApiGetMyAddresses } from './decorators/get-my-addresses.decorator';
import { ApiGetAddress } from './decorators/get-address.decorator';
import { ApiUpdateAddress } from './decorators/update-address.decorator';
import { ApiDeleteAddress } from './decorators/delete-address.decorator';
import { ApiAdminGetAllAddresses } from './decorators/admin-get-all-addresses.decorator';
import { ApiAdminDeleteAddress } from './decorators/admin-delete-address.decorator';

@ApiTags('Addresses')
@Controller('addresses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @ApiCreateAddress()
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateAddressDto) {
    return this.addressService.create(user.userId, dto);
  }

  @Get()
  @ApiGetMyAddresses()
  findMyAddresses(@CurrentUser() user: JwtPayload) {
    return this.addressService.findMyAddresses(user.userId);
  }

  // Admin routes declared before :id routes to avoid routing conflicts
  @Get('admin/all')
  @Roles(Role.ADMIN)
  @ApiAdminGetAllAddresses()
  adminFindAll(@Query() query: AdminGetAddressesQueryDto) {
    return this.addressService.adminFindAll(query);
  }

  @Delete('admin/:id')
  @Roles(Role.ADMIN)
  @ApiAdminDeleteAddress()
  adminRemove(@Param('id') id: string) {
    return this.addressService.adminRemove(id);
  }

  @Get(':id')
  @ApiGetAddress()
  findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.addressService.findOne(id, user.userId, user.role);
  }

  @Patch(':id')
  @ApiUpdateAddress()
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.addressService.update(id, user.userId, user.role, dto);
  }

  @Delete(':id')
  @ApiDeleteAddress()
  remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.addressService.remove(id, user.userId, user.role);
  }
}
