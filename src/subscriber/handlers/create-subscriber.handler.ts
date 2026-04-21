import { ConflictException, Injectable } from '@nestjs/common';
import { SubscriberRepository } from '../repositories/subscriber.repository';
import { CreateSubscriberDto } from '../dto/create-subscriber.dto';

@Injectable()
export class CreateSubscriberHandler {
  constructor(private readonly subscriberRepository: SubscriberRepository) {}

  async execute(dto: CreateSubscriberDto) {
    const existing = await this.subscriberRepository.findByEmail(dto.email);

    if (existing) {
      throw new ConflictException('This email is already subscribed.');
    }

    return this.subscriberRepository.createOne(dto.email);
  }
}
