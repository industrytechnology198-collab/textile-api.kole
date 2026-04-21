import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { ContactService } from './contact.service';
import { SendContactMessageDto } from './dto/send-contact-message.dto';
import { ApiSendContactMessage } from './decorators/send-contact-message.decorator';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @Public()
  @ApiSendContactMessage()
  send(@Body() dto: SendContactMessageDto) {
    return this.contactService.send(dto);
  }
}
