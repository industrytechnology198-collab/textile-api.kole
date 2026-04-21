import { Module } from '@nestjs/common';
import { SubscriberController } from './subscriber.controller';
import { SubscriberService } from './subscriber.service';
import { SubscriberRepository } from './repositories/subscriber.repository';
import { CreateSubscriberHandler } from './handlers/create-subscriber.handler';
import { FindAllSubscribersHandler } from './handlers/find-all-subscribers.handler';
import { UpdateSubscriberHandler } from './handlers/update-subscriber.handler';
import { RemoveSubscriberHandler } from './handlers/remove-subscriber.handler';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SubscriberController],
  providers: [
    SubscriberService,
    SubscriberRepository,
    CreateSubscriberHandler,
    FindAllSubscribersHandler,
    UpdateSubscriberHandler,
    RemoveSubscriberHandler,
  ],
})
export class SubscriberModule {}
