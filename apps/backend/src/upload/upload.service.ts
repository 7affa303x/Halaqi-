import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client as MinioClient } from 'minio';

@Injectable()
export class UploadService {
  private readonly minio: MinioClient;
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService) {
    this.minio = new MinioClient({
      endPoint: this.configService.get<string>('MINIO_ENDPOINT') ?? 'localhost',
      port: parseInt(this.configService.get<string>('MINIO_PORT') ?? '9000', 10),
      useSSL: this.configService.get<string>('MINIO_USE_SSL') === 'true',
      accessKey: this.configService.get<string>('MINIO_ACCESS_KEY') ?? 'minioadmin',
      secretKey: this.configService.get<string>('MINIO_SECRET_KEY') ?? 'minioadmin',
    });
    this.bucket = this.configService.get<string>('MINIO_BUCKET') ?? 'halaqi-uploads';
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const key = `${folder}/${Date.now()}-${file.originalname}`;
    await this.minio.putObject(this.bucket, key, file.buffer, file.size, {
      'Content-Type': file.mimetype,
    });
    return key;
  }

  async getPresignedUrl(key: string, expirySeconds = 3600): Promise<string> {
    return this.minio.presignedGetObject(this.bucket, key, expirySeconds);
  }

  async deleteFile(key: string): Promise<void> {
    await this.minio.removeObject(this.bucket, key);
  }
}
