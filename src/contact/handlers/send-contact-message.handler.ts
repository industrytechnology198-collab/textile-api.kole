import { Injectable } from '@nestjs/common';
import { EmailService } from 'src/auth/services/email.service';
import { SendContactMessageDto } from '../dto/send-contact-message.dto';

@Injectable()
export class SendContactMessageHandler {
  constructor(private readonly emailService: EmailService) {}

  async execute(dto: SendContactMessageDto): Promise<{ message: string }> {
    await this.emailService.sendContactMessageToAdmin({
      name: dto.name,
      email: dto.email,
      subject: dto.subject,
      message: dto.message,
    });

    return { message: 'Your message has been sent successfully.' };
  }
}
