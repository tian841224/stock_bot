import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateSubscriptionDto } from './create-subscription.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateSubscriptionDto extends PartialType(
  OmitType(CreateSubscriptionDto, ['userId'] as const),
) {
  @ApiProperty({ description: '狀態 0:關閉, 1:開啟' })
  @IsNumber()
  @IsOptional()
  status?: number;
}
