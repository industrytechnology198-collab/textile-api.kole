import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { AddressRepository } from '../repositories/address.repository';

@Injectable()
export class GetAddressHandler {
  constructor(private readonly addressRepository: AddressRepository) {}

  async execute(id: string, userId: string, role: Role) {
    const address = await this.addressRepository.findById(id);

    if (!address) {
      throw new NotFoundException(`Address with ID "${id}" not found`);
    }

    if (address.userId !== userId && role !== Role.ADMIN) {
      throw new ForbiddenException('You do not have access to this address');
    }

    return address;
  }
}
