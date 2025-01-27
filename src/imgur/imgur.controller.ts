import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ImgurService } from './imgur.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('imgur')
export class ImgurController {
  constructor(private readonly imgurService: ImgurService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    console.log('Uploaded file:', file);
    if (!file) {
      throw new Error('No file uploaded');
    }
    const result = await this.imgurService.uploadImage(file.buffer);
    return result;
  }
}