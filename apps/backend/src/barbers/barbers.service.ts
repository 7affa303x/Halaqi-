import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Barber } from '@halaqi/shared';

@Injectable()
export class BarbersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    userId: string;
    barbershopId: string;
    bio?: string;
    specialties: string[];
  }): Promise<Barber> {
    return this.prisma.barber.create({ data }) as Promise<Barber>;
  }

  async findByBarbershop(barbershopId: string): Promise<Barber[]> {
    return this.prisma.barber.findMany({
      where: { barbershopId, isActive: true },
      include: { user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
    }) as Promise<Barber[]>;
  }

  async findById(id: string): Promise<Barber | null> {
    return this.prisma.barber.findUnique({
      where: { id },
      include: { user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
    }) as Promise<Barber | null>;
  }

  async update(id: string, data: Partial<Barber>): Promise<Barber> {
    return this.prisma.barber.update({ where: { id }, data }) as Promise<Barber>;
  }
}
