import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionItem } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateNotificationHistoryDto {
  @ApiProperty({ description: '訂閱項目' })
  @IsEnum(SubscriptionItem)
  @IsNotEmpty()
  subscriptionItem: SubscriptionItem;
}
