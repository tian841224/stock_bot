import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateSubscriptionStockDto } from './create-subscription-stock.dto';

export class UpdateSubscriptionStockDto extends PartialType(
    OmitType(CreateSubscriptionStockDto, ['subscriptionId'] as const)) { }