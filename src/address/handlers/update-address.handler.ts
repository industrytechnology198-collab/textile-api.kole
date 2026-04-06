import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { AddressRepository } from '../repositories/address.repository';
import { UpdateAddressDto } from '../dto/update-address.dto';

@Injectable()
export class UpdateAddressHandler {
  constructor(private readonly addressRepository: AddressRepository) {}

  async execute(
    id: string,
    userId: string,
    role: Role,
    dto: UpdateAddressDto,
  ) {
    const address = await this.addressRepository.findById(id);

    if (!address) {
      throw new NotFoundException(`Address with ID "${id}" not found`);
    }

    const ownerId = address.userId;

    if (ownerId !== userId && role !== Role.ADMIN) {
      throw new ForbiddenException('You do not have access to this address');
    }

    if (dto.isDefault === true) {
      await this.addressRepository.unsetDefaultForUser(ownerId);
    }

    return this.addressRepository.update(id, {
      ...(dto.fullName !== undefined && { fullName: dto.fullName }),
      ...(dto.phoneNumber !== undefined && { phoneNumber: dto.phoneNumber }),
      ...(dto.addressLine1 !== undefined && {
        addressLine1: dto.addressLine1,
      }),
      ...(dto.addressLine2 !== undefined && {
        addressLine2: dto.addressLine2,
      }),
      ...(dto.city !== undefined && { city: dto.city }),
      ...(dto.state !== undefined && { state: dto.state }),
      ...(dto.postalCode !== undefined && { postalCode: dto.postalCode }),
      ...(dto.country !== undefined && { country: dto.country }),
      ...(dto.isDefault !== undefined && { isDefault: dto.isDefault }),
    });
  }
}
