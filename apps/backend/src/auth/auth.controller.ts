import { Controller, Post, Body, HttpCode, HttpStatus, Res, UseGuards, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phone?: string;
      role?: string;
    },
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const result = await this.authService.register(data);
    this.setRefreshTokenCookie(res, result.refreshToken);
    const { refreshToken: _, ...response } = result;
    return response;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() data: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const user = await this.authService.validateUser(data.email, data.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const result = await this.authService.login(user);
    this.setRefreshTokenCookie(res, result.refreshToken);
    const { refreshToken: _, ...response } = result;
    return response;
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const result = await this.authService.refreshTokens(refreshToken);
    this.setRefreshTokenCookie(res, result.refreshToken);
    const { refreshToken: _, ...response } = result;
    return response;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @CurrentUser('sub') userId: string,
    @Body('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ success: boolean }> {
    try {
      const payload = JSON.parse(Buffer.from(refreshToken.split('.')[1], 'base64').toString());
      await this.authService.logout(userId, payload.tokenId);
    } catch {
      // Ignore invalid token on logout
    }
    res.clearCookie('refresh_token');
    return { success: true };
  }

  private setRefreshTokenCookie(res: Response, token: string): void {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
