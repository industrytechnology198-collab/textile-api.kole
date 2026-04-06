import { Injectable } from '@nestjs/common';
import { AddressRepository } from '../repositories/address.repository';

@Injectable()
export class GetMyAddressesHandler {
  constructor(private readonly addressRepository: AddressRepository) {}

  async execute(userId: string) {
    return this.addressRepository.findAllByUserId(userId);
  }
}
