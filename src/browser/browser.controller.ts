import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BrowserService } from './browser.service';
import { CreateBrowserDto } from './dto/create-browser.dto';
import { UpdateBrowserDto } from './dto/update-browser.dto';

@Controller('browser')
export class BrowserController {
  constructor(private readonly browserService: BrowserService) {}

  @Post()
  create(@Body() createBrowserDto: CreateBrowserDto) {
    return this.browserService.create(createBrowserDto);
  }

  @Get()
  findAll() {
    return this.browserService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.browserService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBrowserDto: UpdateBrowserDto) {
    return this.browserService.update(+id, updateBrowserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.browserService.remove(+id);
  }
}
