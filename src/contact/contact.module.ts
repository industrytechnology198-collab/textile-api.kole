import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { SendContactMessageHandler } from './handlers/send-contact-message.handler';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ContactController],
  providers: [ContactService, SendContactMessageHandler],
})
export class ContactModule {}
