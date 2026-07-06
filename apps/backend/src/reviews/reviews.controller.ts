import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async create(
    @CurrentUser('userId') clientId: string,
    @Body() data: { barbershopId: string; appointmentId: string; rating: number; comment?: string },
  ): Promise<unknown> {
    const item = await this.reviewsService.create({ ...data, clientId });
    return { success: true, data: item };
  }

  @Get('barbershop/:barbershopId')
  async findByBarbershop(
    @Param('barbershopId') barbershopId: string,
    @Query('page') page = '1',
    @Query('perPage') perPage = '20',
  ): Promise<unknown> {
    const result = await this.reviewsService.findByBarbershop(barbershopId, {
      page: parseInt(page, 10),
      perPage: parseInt(perPage, 10),
    });
    return {
      success: true,
      data: result.items,
      meta: {
        page: parseInt(page, 10),
        perPage: parseInt(perPage, 10),
        total: result.total,
        totalPages: Math.ceil(result.total / parseInt(perPage, 10)),
      },
    };
  }

  @Get('barbershop/:barbershopId/rating')
  async getAverageRating(@Param('barbershopId') barbershopId: string): Promise<unknown> {
    const rating = await this.reviewsService.getAverageRating(barbershopId);
    return { success: true, data: { averageRating: rating } };
  }
}
