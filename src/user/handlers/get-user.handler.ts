import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { GetUserResponse } from '../dto/get-user.dto';

@Injectable()
export class GetUserHandler {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<GetUserResponse> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return user;
  }
}
