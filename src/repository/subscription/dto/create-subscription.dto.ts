import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionItem } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateSubscriptionDto {
  @ApiProperty({ description: '訂閱類型' })
  @IsEnum(SubscriptionItem)
  @IsNotEmpty()
  item: SubscriptionItem;

  @ApiProperty({ description: '帳號' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  // @ApiProperty({ description: '帳號狀態 0 = 正常, 1 = 封鎖'})
  // @Column({ default: 1 })
  // status: number;
}
