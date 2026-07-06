import { z } from 'zod';

export const UserRoleSchema = z.enum(['ADMIN', 'OWNER', 'BARBER', 'CLIENT']);

export const AppointmentStatusSchema = z.enum([
  'PENDING',
  'CONFIRMED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
  'NO_SHOW',
]);

export const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  phone: z.string().optional(),
  role: UserRoleSchema.default('CLIENT'),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export const CreateBarbershopSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  description: z.string().max(2000).optional(),
  address: z.string().min(1).max(500),
  city: z.string().min(1).max(100),
  phone: z.string().min(1).max(50),
  email: z.string().email().optional(),
});

export const CreateServiceSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  durationMinutes: z.number().int().min(5).max(480),
  price: z.number().min(0).max(100000),
});

export const CreateAppointmentSchema = z.object({
  barberId: z.string().uuid(),
  serviceIds: z.array(z.string().uuid()).min(1),
  scheduledAt: z.string().datetime(),
  notes: z.string().max(2000).optional(),
});

export const UpdateAppointmentStatusSchema = z.object({
  status: AppointmentStatusSchema,
});

export const CreateReviewSchema = z.object({
  barbershopId: z.string().uuid(),
  appointmentId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(2000).optional(),
});

export const PaginationQuerySchema = z.object({
  page: z.string().optional().default('1').transform(Number).pipe(z.number().int().min(1)),
  perPage: z.string().optional().default('20').transform(Number).pipe(z.number().int().min(1).max(100)),
});

export const SearchQuerySchema = z.object({
  q: z.string().min(1).max(200),
  page: z.string().optional().default('1').transform(Number),
  perPage: z.string().optional().default('20').transform(Number),
});

export const WorkingHoursSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  openTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  closeTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  isClosed: z.boolean().default(false),
});

export const TimeSlotQuerySchema = z.object({
  barberId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  serviceIds: z.array(z.string().uuid()).min(1),
});
