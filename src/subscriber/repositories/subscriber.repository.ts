import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubscriberRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.subscriber.findUnique({ where: { email } });
  }

  findById(id: string) {
    return this.prisma.subscriber.findUnique({ where: { id } });
  }

  findAll() {
    return this.prisma.subscriber.findMany({ orderBy: { createdAt: 'desc' } });
  }

  createOne(email: string) {
    return this.prisma.subscriber.create({ data: { email } });
  }

  updateOne(id: string, data: { email?: string; isActive?: boolean }) {
    return this.prisma.subscriber.update({ where: { id }, data });
  }

  deleteOne(id: string): Promise<void> {
    return this.prisma.subscriber
      .delete({ where: { id } })
      .then(() => undefined);
  }
}
