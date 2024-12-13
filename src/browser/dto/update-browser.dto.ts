import { PartialType } from '@nestjs/mapped-types';
import { CreateBrowserDto } from './create-browser.dto';

export class UpdateBrowserDto extends PartialType(CreateBrowserDto) {}
