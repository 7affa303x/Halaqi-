import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { BarbershopsService } from './barbershops.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('barbershops')
export class BarbershopsController {
  constructor(private readonly barbershopsService: BarbershopsService) {}

  @Get()
  async findAll(
    @Query('page') page = '1',
    @Query('perPage') perPage = '20',
    @Query('city') city?: string,
  ): Promise<unknown> {
    const result = await this.barbershopsService.findAll({
      page: parseInt(page, 10),
      perPage: parseInt(perPage, 10),
      city,
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

  @Get('search')
  async search(@Query('q') query: string): Promise<unknown> {
    const items = await this.barbershopsService.search(query);
    return { success: true, data: items };
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string): Promise<unknown> {
    const item = await this.barbershopsService.findBySlug(slug);
    return { success: true, data: item };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  async create(
    @CurrentUser('userId') ownerId: string,
    @Body() data: { name: string; slug: string; description?: string; address: string; city: string; phone: string; email?: string },
  ): Promise<unknown> {
    const item = await this.barbershopsService.create({ ...data, ownerId });
    return { success: true, data: item };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<import('@halaqi/shared').Barbershop>,
  ): Promise<unknown> {
    const item = await this.barbershopsService.update(id, data);
    return { success: true, data: item };
  }
}
