import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { GetUsersQueryDto } from '../dto/get-users.dto';

@Injectable()
export class GetUsersHandler {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: GetUsersQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    return this.userRepository.findAll(page, limit, query.search);
  }
}
