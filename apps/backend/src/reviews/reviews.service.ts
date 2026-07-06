import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Review } from '@halaqi/shared';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    barbershopId: string;
    clientId: string;
    appointmentId: string;
    rating: number;
    comment?: string;
  }): Promise<Review> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: data.appointmentId },
    });
    if (!appointment || appointment.clientId !== data.clientId) {
      throw new BadRequestException('Invalid appointment');
    }
    if (appointment.status !== 'COMPLETED') {
      throw new BadRequestException('Can only review completed appointments');
    }
    const existing = await this.prisma.review.findUnique({
      where: { appointmentId: data.appointmentId },
    });
    if (existing) {
      throw new BadRequestException('Review already exists for this appointment');
    }
    return this.prisma.review.create({
      data,
      include: { client: { select: { id: true, firstName: true, lastName: true } } },
    }) as Promise<Review>;
  }

  async findByBarbershop(barbershopId: string, options: { page: number; perPage: number }): Promise<{ items: Review[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { barbershopId },
        skip: (options.page - 1) * options.perPage,
        take: options.perPage,
        orderBy: { createdAt: 'desc' },
        include: { client: { select: { id: true, firstName: true, lastName: true } } },
      }),
      this.prisma.review.count({ where: { barbershopId } }),
    ]);
    return { items: items as Review[], total };
  }

  async getAverageRating(barbershopId: string): Promise<number> {
    const result = await this.prisma.review.aggregate({
      where: { barbershopId },
      _avg: { rating: true },
    });
    return result._avg.rating ?? 0;
  }
}
