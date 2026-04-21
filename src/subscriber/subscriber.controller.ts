import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { SubscriberService } from './subscriber.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { ApiCreateSubscriber } from './decorators/create-subscriber.decorator';
import { ApiFindAllSubscribers } from './decorators/find-all-subscribers.decorator';
import { ApiUpdateSubscriber } from './decorators/update-subscriber.decorator';
import { ApiRemoveSubscriber } from './decorators/remove-subscriber.decorator';

@ApiTags('Subscribers')
@Controller('subscribers')
export class SubscriberController {
  constructor(private readonly subscriberService: SubscriberService) {}

  @Post()
  @Public()
  @ApiCreateSubscriber()
  create(@Body() dto: CreateSubscriberDto) {
    return this.subscriberService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiFindAllSubscribers()
  findAll() {
    return this.subscriberService.findAll();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiUpdateSubscriber()
  update(@Param('id') id: string, @Body() dto: UpdateSubscriberDto) {
    return this.subscriberService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiRemoveSubscriber()
  remove(@Param('id') id: string) {
    return this.subscriberService.remove(id);
  }
}
