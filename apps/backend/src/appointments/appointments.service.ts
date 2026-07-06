import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { isValidStatusTransition, APPOINTMENT_STATUS_FLOW } from '@halaqi/shared';
import type { Appointment, AppointmentStatus } from '@halaqi/shared';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    barbershopId: string;
    barberId: string;
    clientId: string;
    serviceIds: string[];
    scheduledAt: Date;
    notes?: string;
  }): Promise<Appointment> {
    const services = await this.prisma.service.findMany({
      where: { id: { in: data.serviceIds } },
    });
    if (services.length !== data.serviceIds.length) {
      throw new BadRequestException('One or more services not found');
    }
    const totalDuration = services.reduce((sum, s) => sum + s.durationMinutes, 0);
    const totalPrice = services.reduce((sum, s) => sum + Number(s.price), 0);
    const endAt = new Date(data.scheduledAt);
    endAt.setMinutes(endAt.getMinutes() + totalDuration);
    const appointment = await this.prisma.appointment.create({
      data: {
        barbershopId: data.barbershopId,
        barberId: data.barberId,
        clientId: data.clientId,
        scheduledAt: data.scheduledAt,
        endAt,
        totalPrice,
        notes: data.notes,
        services: { connect: data.serviceIds.map((id) => ({ id })) },
      },
      include: { services: true, barber: { include: { user: true } } },
    });
    return appointment as unknown as Appointment;
  }

  async findByClient(clientId: string, options: { page: number; perPage: number }): Promise<{ items: Appointment[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.appointment.findMany({
        where: { clientId },
        skip: (options.page - 1) * options.perPage,
        take: options.perPage,
        orderBy: { scheduledAt: 'desc' },
        include: { services: true, barber: { include: { user: true } }, barbershop: true },
      }),
      this.prisma.appointment.count({ where: { clientId } }),
    ]);
    return { items: items as unknown as Appointment[], total };
  }

  async findByBarbershop(barbershopId: string, options: { page: number; perPage: number }): Promise<{ items: Appointment[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.appointment.findMany({
        where: { barbershopId },
        skip: (options.page - 1) * options.perPage,
        take: options.perPage,
        orderBy: { scheduledAt: 'desc' },
        include: { services: true, barber: { include: { user: true } }, client: { select: { id: true, firstName: true, lastName: true, phone: true } } },
      }),
      this.prisma.appointment.count({ where: { barbershopId } }),
    ]);
    return { items: items as unknown as Appointment[], total };
  }

  async findById(id: string): Promise<Appointment | null> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: { services: true, barber: { include: { user: true } }, client: { select: { id: true, firstName: true, lastName: true } }, barbershop: true },
    });
    return appointment as unknown as Appointment | null;
  }

  async updateStatus(id: string, status: AppointmentStatus, userId: string): Promise<Appointment> {
    const appointment = await this.prisma.appointment.findUnique({ where: { id } });
    if (!appointment) throw new NotFoundException('Appointment not found');
    if (!isValidStatusTransition(appointment.status, status, APPOINTMENT_STATUS_FLOW)) {
      throw new BadRequestException(`Cannot transition from ${appointment.status} to ${status}`);
    }
    const updated = await this.prisma.appointment.update({
      where: { id },
      data: { status },
      include: { services: true, barber: { include: { user: true } }, client: { select: { id: true, firstName: true, lastName: true } } },
    });
    return updated as unknown as Appointment;
  }

  async getAvailableSlots(barberId: string, date: Date, serviceIds: string[]): Promise<{ startTime: Date; endTime: Date; isAvailable: boolean }[]> {
    const services = await this.prisma.service.findMany({ where: { id: { in: serviceIds } } });
    const totalDuration = services.reduce((sum, s) => sum + s.durationMinutes, 0);
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    const existingAppointments = await this.prisma.appointment.findMany({
      where: {
        barberId,
        scheduledAt: { gte: startOfDay, lte: endOfDay },
        status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] },
      },
      orderBy: { scheduledAt: 'asc' },
    });
    const slots: { startTime: Date; endTime: Date; isAvailable: boolean }[] = [];
    const workStart = new Date(date);
    workStart.setHours(10, 0, 0, 0);
    const workEnd = new Date(date);
    workEnd.setHours(22, 0, 0, 0);
    let current = new Date(workStart);
    while (current.getTime() + totalDuration * 60000 <= workEnd.getTime()) {
      const slotEnd = new Date(current.getTime() + totalDuration * 60000);
      const isAvailable = !existingAppointments.some((appt) => {
        const apptStart = new Date(appt.scheduledAt);
        const apptEnd = new Date(appt.endAt);
        return (current < apptEnd && slotEnd > apptStart);
      });
      slots.push({ startTime: new Date(current), endTime: slotEnd, isAvailable });
      current.setMinutes(current.getMinutes() + 30);
    }
    return slots;
  }
}
