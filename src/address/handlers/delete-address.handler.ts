import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { AddressRepository } from '../repositories/address.repository';

@Injectable()
export class DeleteAddressHandler {
  constructor(private readonly addressRepository: AddressRepository) {}

  async execute(id: string, userId: string, role: Role) {
    const address = await this.addressRepository.findById(id);

    if (!address) {
      throw new NotFoundException(`Address with ID "${id}" not found`);
    }

    if (address.userId !== userId && role !== Role.ADMIN) {
      throw new ForbiddenException('You do not have access to this address');
    }

    const ownerId = address.userId;
    const count = await this.addressRepository.countByUserId(ownerId);

    if (count === 1) {
      throw new BadRequestException(
        'You cannot delete your only address. Please add another address first',
      );
    }

    let nextDefaultId: string | null = null;
    if (address.isDefault) {
      const next = await this.addressRepository.findFirstRemainingByUserId(
        ownerId,
        id,
      );
      nextDefaultId = next?.id ?? null;
    }

    await this.addressRepository.delete(id);

    if (nextDefaultId) {
      await this.addressRepository.update(nextDefaultId, { isDefault: true });
    }

    return { message: 'Address deleted successfully' };
  }
}
