import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AddressRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.AddressCreateInput) {
    return this.prisma.address.create({ data });
  }

  async findById(id: string) {
    return this.prisma.address.findUnique({ where: { id } });
  }

  async findAllByUserId(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: { id: 'asc' },
    });
  }

  async countByUserId(userId: string) {
    return this.prisma.address.count({ where: { userId } });
  }

  async unsetDefaultForUser(userId: string) {
    return this.prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  async update(id: string, data: Prisma.AddressUpdateInput) {
    return this.prisma.address.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.address.delete({ where: { id } });
  }

  async findFirstRemainingByUserId(userId: string, excludeId: string) {
    return this.prisma.address.findFirst({
      where: { userId, id: { not: excludeId } },
      orderBy: { id: 'desc' },
    });
  }

  async findAll(page: number, limit: number, userId?: string) {
    const skip = (page - 1) * limit;
    const where: Prisma.AddressWhereInput = userId ? { userId } : {};

    const [addresses, total] = await Promise.all([
      this.prisma.address.findMany({
        skip,
        take: limit,
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { id: 'asc' },
      }),
      this.prisma.address.count({ where }),
    ]);

    return { addresses, total, page, limit };
  }
}
