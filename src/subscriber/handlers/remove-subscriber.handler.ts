import { Injectable, NotFoundException } from '@nestjs/common';
import { SubscriberRepository } from '../repositories/subscriber.repository';

@Injectable()
export class RemoveSubscriberHandler {
  constructor(private readonly subscriberRepository: SubscriberRepository) {}

  async execute(id: string): Promise<{ message: string }> {
    const subscriber = await this.subscriberRepository.findById(id);

    if (!subscriber) {
      throw new NotFoundException('Subscriber not found.');
    }

    await this.subscriberRepository.deleteOne(id);

    return { message: 'Subscriber removed successfully.' };
  }
}
