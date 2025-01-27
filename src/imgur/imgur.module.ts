import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ImgurController } from './imgur.controller';
import { ImgurService } from './imgur.service';

@Module({
    imports: [HttpModule],
    controllers: [ImgurController],
    providers: [ImgurService],
    exports: [ImgurService],
})
export class ImgurModule { }