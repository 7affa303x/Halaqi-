import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { BarbersService } from './barbers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('barbers')
export class BarbersController {
  constructor(private readonly barbersService: BarbersService) {}

  @Get()
  async findByBarbershop(@Query('barbershopId') barbershopId: string): Promise<unknown> {
    const items = await this.barbersService.findByBarbershop(barbershopId);
    return { success: true, data: items };
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<unknown> {
    const item = await this.barbersService.findById(id);
    return { success: true, data: item };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  async create(
    @Body() data: { userId: string; barbershopId: string; bio?: string; specialties: string[] },
  ): Promise<unknown> {
    const item = await this.barbersService.create(data);
    return { success: true, data: item };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<import('@halaqi/shared').Barber>,
  ): Promise<unknown> {
    const item = await this.barbersService.update(id, data);
    return { success: true, data: item };
  }
}
