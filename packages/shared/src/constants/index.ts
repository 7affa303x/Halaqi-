export const API_VERSION = 'v1';
export const API_BASE_PATH = `/api/${API_VERSION}`;

export const DEFAULT_PAGE = 1;
export const DEFAULT_PER_PAGE = 20;
export const MAX_PER_PAGE = 100;

export const JWT_ACCESS_TOKEN_EXPIRY = '15m';
export const JWT_REFRESH_TOKEN_EXPIRY = '7d';

export const REDIS_KEYS = {
  ACCESS_TOKEN_BLACKLIST: 'token:blacklist',
  REFRESH_TOKEN: 'token:refresh',
  RATE_LIMIT: 'rate_limit',
  CACHE: 'cache',
  QUEUE: 'queue',
} as const;

export const APPOINTMENT_STATUS_FLOW: Record<string, string[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['IN_PROGRESS', 'CANCELLED', 'NO_SHOW'],
  IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
  NO_SHOW: [],
};

export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export const BARBER_SPECIALTIES = [
  'Haircut',
  'Beard Trim',
  'Hair Coloring',
  'Hot Towel Shave',
  'Facial',
  'Hair Treatment',
  'Kids Haircut',
  'Fade',
  'Buzz Cut',
  'Textured Cut',
] as const;
