import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async findByBarbershop(@Query('barbershopId') barbershopId: string): Promise<unknown> {
    const items = await this.servicesService.findByBarbershop(barbershopId);
    return { success: true, data: items };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  async create(
    @Body() data: { barbershopId: string; name: string; description?: string; durationMinutes: number; price: number },
  ): Promise<unknown> {
    const item = await this.servicesService.create(data);
    return { success: true, data: item };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<import('@halaqi/shared').Service>,
  ): Promise<unknown> {
    const item = await this.servicesService.update(id, data);
    return { success: true, data: item };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  async delete(@Param('id') id: string): Promise<unknown> {
    await this.servicesService.delete(id);
    return { success: true };
  }
}
