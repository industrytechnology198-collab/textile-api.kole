import { Module } from '@nestjs/common';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { AddressRepository } from './repositories/address.repository';
import { CreateAddressHandler } from './handlers/create-address.handler';
import { GetMyAddressesHandler } from './handlers/get-my-addresses.handler';
import { GetAddressHandler } from './handlers/get-address.handler';
import { UpdateAddressHandler } from './handlers/update-address.handler';
import { DeleteAddressHandler } from './handlers/delete-address.handler';
import { AdminGetAllAddressesHandler } from './handlers/admin-get-all-addresses.handler';
import { AdminDeleteAddressHandler } from './handlers/admin-delete-address.handler';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AddressController],
  providers: [
    AddressService,
    AddressRepository,
    CreateAddressHandler,
    GetMyAddressesHandler,
    GetAddressHandler,
    UpdateAddressHandler,
    DeleteAddressHandler,
    AdminGetAllAddressesHandler,
    AdminDeleteAddressHandler,
  ],
})
export class AddressModule {}
