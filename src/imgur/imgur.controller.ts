import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ImgurService } from './imgur.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';

@Controller('imgur')
export class ImgurController {
  constructor(private readonly imgurService: ImgurService) {}


  @ApiOperation({ summary: 'Upload an image to Imgur' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      description: '選擇一張圖片上傳',
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })

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