import { Injectable } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { CreateSubscriberHandler } from './handlers/create-subscriber.handler';
import { FindAllSubscribersHandler } from './handlers/find-all-subscribers.handler';
import { UpdateSubscriberHandler } from './handlers/update-subscriber.handler';
import { RemoveSubscriberHandler } from './handlers/remove-subscriber.handler';

@Injectable()
export class SubscriberService {
  constructor(
    private readonly createSubscriberHandler: CreateSubscriberHandler,
    private readonly findAllSubscribersHandler: FindAllSubscribersHandler,
    private readonly updateSubscriberHandler: UpdateSubscriberHandler,
    private readonly removeSubscriberHandler: RemoveSubscriberHandler,
  ) {}

  create(dto: CreateSubscriberDto) {
    return this.createSubscriberHandler.execute(dto);
  }

  findAll() {
    return this.findAllSubscribersHandler.execute();
  }

  update(id: string, dto: UpdateSubscriberDto) {
    return this.updateSubscriberHandler.execute(id, dto);
  }

  remove(id: string) {
    return this.removeSubscriberHandler.execute(id);
  }
}
