import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ImgurResponseDto } from './interface/Imgur-response-dto';

@Injectable()
export class ImgurService {
    private readonly clientId = 'bd4a58883b0eda8';
    private readonly baseUrl = 'https://api.imgur.com/3';

    constructor(private readonly httpService: HttpService) {}
    
    async uploadImage(image: Buffer): Promise<ImgurResponseDto> {
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
      }
}
