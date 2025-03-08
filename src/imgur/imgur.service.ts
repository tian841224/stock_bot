import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ImgurResponseDto } from './interface/Imgur-response-dto';

@Injectable()
export class ImgurService {
  private readonly logger = new Logger(ImgurService.name);

  @Inject('IMGUR_CLIENT_ID')
  private readonly clientId: string
  private readonly baseUrl = 'https://api.imgur.com/3';

  constructor(private readonly httpService: HttpService) { }

  async uploadImage(image: Buffer): Promise<ImgurResponseDto> {
    try {
      const url = `${this.baseUrl}/image`;
      const headers = {
        Authorization: `Client-ID ${this.clientId}`,
      };

      const formData = new FormData();
      formData.append('image', image.toString('base64'));

      const response = await firstValueFrom(
        this.httpService.post(url, formData, { headers }),
      );

      const result: ImgurResponseDto = response.data.data;
      return result;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
