import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { compare, hash } from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import type { User, JwtPayload } from '@halaqi/shared';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const isMatch = await compare(password, user.password);
    if (!isMatch) return null;
    const { password: _, ...result } = user;
    return result as Omit<User, 'password'>;
  }

  async login(user: Omit<User, 'password'>): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: 0,
    };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.generateRefreshToken(user.id);
    return { accessToken, refreshToken };
  }

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: string;
  }): Promise<{ accessToken: string; refreshToken: string }> {
    const hashedPassword = await hash(data.password, 10);
    const user = await this.usersService.create({
      ...data,
      password: hashedPassword,
    });
    return this.login(user);
  }

  async refreshTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      const storedToken = await this.prisma.refreshToken.findUnique({
        where: { tokenId: payload.tokenId },
      });
      if (!storedToken || storedToken.expiresAt < new Date()) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const user = await this.usersService.findById(storedToken.userId);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      await this.prisma.refreshToken.delete({ where: { id: storedToken.id } });
      return this.login(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string, tokenId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { userId, tokenId },
    });
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    const tokenId = `${userId}-${Date.now()}-${Math.random().toString(36).substring(2)}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await this.prisma.refreshToken.create({
      data: { tokenId, userId, expiresAt },
    });
    return this.jwtService.sign(
      { sub: userId, tokenId },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRY') ?? '7d',
      },
    );
  }
}
