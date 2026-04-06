import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class DeleteUserHandler {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string, currentUserId: string): Promise<void> {
    if (id === currentUserId) {
      throw new BadRequestException('Admin cannot delete themselves');
    }

    const existing = await this.userRepository.findOne(id);

    if (!existing) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    await this.userRepository.delete(id);
  }
}
