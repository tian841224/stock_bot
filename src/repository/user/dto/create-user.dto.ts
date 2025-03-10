import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: '帳號類型 Telegram = 1,Line = 2',
    enum: UserType,
  })
  @IsEnum(UserType)
  @IsNotEmpty()
  type: UserType;

  @ApiProperty({ description: '帳號' })
  @IsString()
  @IsNotEmpty()
  userid: string;

  @ApiProperty({ description: '帳號狀態 0 = 正常, 1 = 封鎖' })
  status: number;
}
