import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  async create(
    @CurrentUser('userId') clientId: string,
    @Body() data: { barbershopId: string; barberId: string; serviceIds: string[]; scheduledAt: string; notes?: string },
  ): Promise<unknown> {
    const item = await this.appointmentsService.create({
      ...data,
      clientId,
      scheduledAt: new Date(data.scheduledAt),
    });
    return { success: true, data: item };
  }

  @Get('my')
  async findMyAppointments(
    @CurrentUser('userId') clientId: string,
    @Query('page') page = '1',
    @Query('perPage') perPage = '20',
  ): Promise<unknown> {
    const result = await this.appointmentsService.findByClient(clientId, {
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

  @Get('barbershop/:barbershopId')
  async findByBarbershop(
    @Param('barbershopId') barbershopId: string,
    @Query('page') page = '1',
    @Query('perPage') perPage = '20',
  ): Promise<unknown> {
    const result = await this.appointmentsService.findByBarbershop(barbershopId, {
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

  @Get(':id')
  async findById(@Param('id') id: string): Promise<unknown> {
    const item = await this.appointmentsService.findById(id);
    return { success: true, data: item };
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: import('@halaqi/shared').AppointmentStatus,
    @CurrentUser('userId') userId: string,
  ): Promise<unknown> {
    const item = await this.appointmentsService.updateStatus(id, status, userId);
    return { success: true, data: item };
  }

  @Get('slots/available')
  async getAvailableSlots(
    @Query('barberId') barberId: string,
    @Query('date') date: string,
    @Query('serviceIds') serviceIds: string,
  ): Promise<unknown> {
    const slots = await this.appointmentsService.getAvailableSlots(
      barberId,
      new Date(date),
      serviceIds.split(','),
    );
    return { success: true, data: slots };
  }
}
