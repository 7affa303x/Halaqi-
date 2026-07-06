import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { User } from '@halaqi/shared';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: string;
  }): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role as unknown as import('@prisma/client').UserRole,
      },
    });
    const { password: _, ...result } = user;
    return result as Omit<User, 'password'>;
  }

  async findById(id: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    const { password: _, ...result } = user;
    return result as Omit<User, 'password'>;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } }) as Promise<User | null>;
  }

  async update(id: string, data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.update({
      where: { id },
      data,
    });
    const { password: _, ...result } = user;
    return result as Omit<User, 'password'>;
  }
}
