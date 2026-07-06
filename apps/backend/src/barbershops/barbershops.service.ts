import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Barbershop } from '@halaqi/shared';

@Injectable()
export class BarbershopsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    name: string;
    slug: string;
    description?: string;
    address: string;
    city: string;
    phone: string;
    email?: string;
    ownerId: string;
  }): Promise<Barbershop> {
    return this.prisma.barbershop.create({ data }) as Promise<Barbershop>;
  }

  async findAll(options: { page: number; perPage: number; city?: string }): Promise<{ items: Barbershop[]; total: number }> {
    const where = options.city ? { city: options.city, isActive: true } : { isActive: true };
    const [items, total] = await Promise.all([
      this.prisma.barbershop.findMany({
        where,
        skip: (options.page - 1) * options.perPage,
        take: options.perPage,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.barbershop.count({ where }),
    ]);
    return { items: items as Barbershop[], total };
  }

  async findBySlug(slug: string): Promise<Barbershop | null> {
    return this.prisma.barbershop.findUnique({
      where: { slug },
      include: { services: { where: { isActive: true } }, barbers: { where: { isActive: true } }, workingHours: true },
    }) as Promise<Barbershop | null>;
  }

  async findById(id: string): Promise<Barbershop | null> {
    return this.prisma.barbershop.findUnique({ where: { id } }) as Promise<Barbershop | null>;
  }

  async update(id: string, data: Partial<Barbershop>): Promise<Barbershop> {
    return this.prisma.barbershop.update({ where: { id }, data }) as Promise<Barbershop>;
  }

  async search(query: string): Promise<Barbershop[]> {
    return this.prisma.barbershop.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { city: { contains: query, mode: 'insensitive' } },
          { address: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 20,
    }) as Promise<Barbershop[]>;
  }
}
