import { Controller, Post, Delete, Body, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder: string,
  ): Promise<unknown> {
    const key = await this.uploadService.uploadFile(file, folder ?? 'general');
    return { success: true, data: { key } };
  }

  @Post('url')
  async getPresignedUrl(@Body('key') key: string): Promise<unknown> {
    const url = await this.uploadService.getPresignedUrl(key);
    return { success: true, data: { url } };
  }

  @Delete()
  async delete(@Body('key') key: string): Promise<unknown> {
    await this.uploadService.deleteFile(key);
    return { success: true };
  }
}
