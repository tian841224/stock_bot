import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { SubscriptionItem } from "src/model/enum/subscription-item.enum";

export class CreateNotificationHistoryDto {

    @ApiProperty({ description: '訂閱項目' })
    @IsEnum(SubscriptionItem)
    @IsNotEmpty()
    subscriptionItem: SubscriptionItem;

    @ApiProperty({ description: '通知時間' })
    createdAt: Date;
}
