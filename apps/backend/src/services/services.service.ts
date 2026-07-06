import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Service } from '@halaqi/shared';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    barbershopId: string;
    name: string;
    description?: string;
    durationMinutes: number;
    price: number;
  }): Promise<Service> {
    return this.prisma.service.create({ data: { ...data, price: data.price } }) as Promise<Service>;
  }

  async findByBarbershop(barbershopId: string): Promise<Service[]> {
    return this.prisma.service.findMany({
      where: { barbershopId, isActive: true },
      orderBy: { name: 'asc' },
    }) as Promise<Service[]>;
  }

  async update(id: string, data: Partial<Service>): Promise<Service> {
    return this.prisma.service.update({ where: { id }, data }) as Promise<Service>;
  }

  async delete(id: string): Promise<Service> {
    return this.prisma.service.update({ where: { id }, data: { isActive: false } }) as Promise<Service>;
  }
}
