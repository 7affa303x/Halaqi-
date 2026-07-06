import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@CurrentUser('userId') userId: string): Promise<unknown> {
    return this.usersService.findById(userId);
  }

  @Patch('me')
  async updateMe(
    @CurrentUser('userId') userId: string,
    @Body() data: { firstName?: string; lastName?: string; phone?: string },
  ): Promise<unknown> {
    return this.usersService.update(userId, data);
  }
}
