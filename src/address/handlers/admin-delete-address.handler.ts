import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AddressRepository } from '../repositories/address.repository';

@Injectable()
export class AdminDeleteAddressHandler {
  constructor(private readonly addressRepository: AddressRepository) {}

  async execute(id: string) {
    const address = await this.addressRepository.findById(id);

    if (!address) {
      throw new NotFoundException(`Address with ID "${id}" not found`);
    }

    const ownerId = address.userId;
    const count = await this.addressRepository.countByUserId(ownerId);

    if (count === 1) {
      throw new BadRequestException("Cannot delete the user's only address");
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
