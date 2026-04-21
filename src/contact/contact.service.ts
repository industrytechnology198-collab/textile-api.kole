import { Injectable } from '@nestjs/common';
import { SendContactMessageHandler } from './handlers/send-contact-message.handler';
import { SendContactMessageDto } from './dto/send-contact-message.dto';

@Injectable()
export class ContactService {
  constructor(
    private readonly sendContactMessageHandler: SendContactMessageHandler,
  ) {}

  send(dto: SendContactMessageDto) {
    return this.sendContactMessageHandler.execute(dto);
  }
}
