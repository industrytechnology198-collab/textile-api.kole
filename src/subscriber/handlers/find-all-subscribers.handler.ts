import { Injectable } from '@nestjs/common';
import { SubscriberRepository } from '../repositories/subscriber.repository';

@Injectable()
export class FindAllSubscribersHandler {
  constructor(private readonly subscriberRepository: SubscriberRepository) {}

  execute() {
    return this.subscriberRepository.findAll();
  }
}
