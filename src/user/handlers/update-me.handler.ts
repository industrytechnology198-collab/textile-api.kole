import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UpdateMeDto } from '../dto/update-me.dto';

@Injectable()
export class UpdateMeHandler {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string, dto: UpdateMeDto) {
    const existing = await this.userRepository.findOne(userId);
    if (!existing) {
      throw new NotFoundException('User not found');
    }

    return this.userRepository.update(userId, {
      ...(dto.firstName !== undefined && { firstName: dto.firstName }),
      ...(dto.lastName !== undefined && { lastName: dto.lastName }),
      ...(dto.phoneNumber !== undefined && { phoneNumber: dto.phoneNumber }),
    });
  }
}
