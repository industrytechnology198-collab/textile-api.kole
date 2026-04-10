import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OrderModule } from 'src/order/order.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PaymentsRepository } from './repositories/payments.repository';
import { CreatePaymentIntentHandler } from './handlers/create-payment-intent.handler';
import { HandleStripeWebhookHandler } from './handlers/handle-stripe-webhook.handler';

@Module({
  imports: [ConfigModule, PrismaModule, OrderModule],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    PaymentsRepository,
    CreatePaymentIntentHandler,
    HandleStripeWebhookHandler,
  ],
})
export class PaymentsModule {}
