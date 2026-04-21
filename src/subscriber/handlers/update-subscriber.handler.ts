import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { SubscriberRepository } from '../repositories/subscriber.repository';
import { UpdateSubscriberDto } from '../dto/update-subscriber.dto';

@Injectable()
export class UpdateSubscriberHandler {
  constructor(private readonly subscriberRepository: SubscriberRepository) {}

  async execute(id: string, dto: UpdateSubscriberDto) {
    const subscriber = await this.subscriberRepository.findById(id);

    if (!subscriber) {
      throw new NotFoundException('Subscriber not found.');
    }

    if (dto.email && dto.email !== subscriber.email) {
      const emailTaken = await this.subscriberRepository.findByEmail(dto.email);
      if (emailTaken) {
        throw new ConflictException('This email is already in use.');
      }
    }

    return this.subscriberRepository.updateOne(id, {
      email: dto.email,
      isActive: dto.isActive,
    });
  }
}
