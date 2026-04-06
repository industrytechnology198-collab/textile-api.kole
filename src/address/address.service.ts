import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CreateAddressHandler } from './handlers/create-address.handler';
import { GetMyAddressesHandler } from './handlers/get-my-addresses.handler';
import { GetAddressHandler } from './handlers/get-address.handler';
import { UpdateAddressHandler } from './handlers/update-address.handler';
import { DeleteAddressHandler } from './handlers/delete-address.handler';
import { AdminGetAllAddressesHandler } from './handlers/admin-get-all-addresses.handler';
import { AdminDeleteAddressHandler } from './handlers/admin-delete-address.handler';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AdminGetAddressesQueryDto } from './dto/admin-get-addresses-query.dto';

@Injectable()
export class AddressService {
  constructor(
    private readonly createAddressHandler: CreateAddressHandler,
    private readonly getMyAddressesHandler: GetMyAddressesHandler,
    private readonly getAddressHandler: GetAddressHandler,
    private readonly updateAddressHandler: UpdateAddressHandler,
    private readonly deleteAddressHandler: DeleteAddressHandler,
    private readonly adminGetAllAddressesHandler: AdminGetAllAddressesHandler,
    private readonly adminDeleteAddressHandler: AdminDeleteAddressHandler,
  ) {}

  create(userId: string, dto: CreateAddressDto) {
    return this.createAddressHandler.execute(userId, dto);
  }

  findMyAddresses(userId: string) {
    return this.getMyAddressesHandler.execute(userId);
  }

  findOne(id: string, userId: string, role: Role) {
    return this.getAddressHandler.execute(id, userId, role);
  }

  update(id: string, userId: string, role: Role, dto: UpdateAddressDto) {
    return this.updateAddressHandler.execute(id, userId, role, dto);
  }

  remove(id: string, userId: string, role: Role) {
    return this.deleteAddressHandler.execute(id, userId, role);
  }

  adminFindAll(query: AdminGetAddressesQueryDto) {
    return this.adminGetAllAddressesHandler.execute(query);
  }

  adminRemove(id: string) {
    return this.adminDeleteAddressHandler.execute(id);
  }
}
