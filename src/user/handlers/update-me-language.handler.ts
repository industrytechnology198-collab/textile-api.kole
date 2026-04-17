import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UpdateMeLanguageDto } from '../dto/update-me-language.dto';

@Injectable()
export class UpdateMeLanguageHandler {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string, dto: UpdateMeLanguageDto) {
    const existing = await this.userRepository.findOne(userId);
    if (!existing) {
      throw new NotFoundException('User not found');
    }

    return this.userRepository.update(userId, {
      preferredLanguage: dto.preferredLanguage,
    });
  }
}
