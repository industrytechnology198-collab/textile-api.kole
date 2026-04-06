import { Injectable } from '@nestjs/common';
import { AddressRepository } from '../repositories/address.repository';
import { CreateAddressDto } from '../dto/create-address.dto';

@Injectable()
export class CreateAddressHandler {
  constructor(private readonly addressRepository: AddressRepository) {}

  async execute(userId: string, dto: CreateAddressDto) {
    const count = await this.addressRepository.countByUserId(userId);
    const isFirstAddress = count === 0;

    const shouldBeDefault = isFirstAddress || dto.isDefault === true;

    if (shouldBeDefault && !isFirstAddress) {
      await this.addressRepository.unsetDefaultForUser(userId);
    }

    return this.addressRepository.create({
      fullName: dto.fullName,
      phoneNumber: dto.phoneNumber,
      addressLine1: dto.addressLine1,
      addressLine2: dto.addressLine2,
      city: dto.city,
      state: dto.state,
      postalCode: dto.postalCode,
      country: dto.country,
      isDefault: shouldBeDefault,
      user: { connect: { id: userId } },
    });
  }
}
