import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ImgurController } from './imgur.controller';
import { ImgurService } from './imgur.service';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [HttpModule],
    controllers: [ImgurController],
    providers: [{
        provide: 'IMGUR_CLIENT_ID',
        useFactory: (configService: ConfigService) => {
            return configService.get<string>('IMGUR_CLIENT_ID')
        },
        inject: [ConfigService]
    }, ImgurService],
    exports: [ImgurService],
})
export class ImgurModule { }