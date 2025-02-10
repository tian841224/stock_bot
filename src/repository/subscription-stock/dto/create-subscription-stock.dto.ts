import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateSubscriptionStockDto {

    @ApiProperty({ description: '訂閱ID' })
    @IsNotEmpty()
    subscriptionId: number;

    @ApiProperty({ description: '股票代號' })
    @IsString()
    @IsNotEmpty()
    stock: string;
}
