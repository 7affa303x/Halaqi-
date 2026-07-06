export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
  BARBER = 'BARBER',
  CLIENT = 'CLIENT',
}

export interface Barbershop {
  id: string;
  name: string;
  slug: string;
  description?: string;
  address: string;
  city: string;
  phone: string;
  email?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  isActive: boolean;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: string;
  barbershopId: string;
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Barber {
  id: string;
  userId: string;
  barbershopId: string;
  bio?: string;
  specialties: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  id: string;
  barbershopId: string;
  barberId: string;
  clientId: string;
  serviceIds: string[];
  scheduledAt: Date;
  endAt: Date;
  status: AppointmentStatus;
  notes?: string;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export interface Review {
  id: string;
  barbershopId: string;
  clientId: string;
  appointmentId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkingHours {
  id: string;
  barbershopId: string;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export interface TimeSlot {
  startTime: Date;
  endTime: Date;
  isAvailable: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: PaginationMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export interface RefreshTokenPayload {
  sub: string;
  tokenId: string;
  iat: number;
  exp: number;
}
