import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { SubscriptionItem } from "src/model/enum/subscription-item.enum";
import { Column } from "typeorm";

export class CreateSubscriptionDto {
    @ApiProperty({ description: '訂閱類型' })
    @IsEnum(SubscriptionItem)
    @IsNotEmpty()
    item: SubscriptionItem;

    @ApiProperty({ description: '帳號' })
    @IsString()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({ description: '帳號狀態 0 = 正常, 1 = 封鎖'})
    @Column({ default: 1 })
    status: number;
}
