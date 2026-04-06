import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { AdminUpdateUserDto } from '../dto/admin-update-user.dto';

@Injectable()
export class UpdateUserHandler {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string, dto: AdminUpdateUserDto) {
    const existing = await this.userRepository.findOne(id);

    if (!existing) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return this.userRepository.update(id, {
      ...(dto.firstName !== undefined && { firstName: dto.firstName }),
      ...(dto.lastName !== undefined && { lastName: dto.lastName }),
      ...(dto.phoneNumber !== undefined && { phoneNumber: dto.phoneNumber }),
      ...(dto.role !== undefined && { role: dto.role }),
    });
  }
}
