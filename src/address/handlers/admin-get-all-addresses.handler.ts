import { Injectable } from '@nestjs/common';
import { AddressRepository } from '../repositories/address.repository';
import { AdminGetAddressesQueryDto } from '../dto/admin-get-addresses-query.dto';

@Injectable()
export class AdminGetAllAddressesHandler {
  constructor(private readonly addressRepository: AddressRepository) {}

  async execute(query: AdminGetAddressesQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    return this.addressRepository.findAll(page, limit, query.userId);
  }
}
