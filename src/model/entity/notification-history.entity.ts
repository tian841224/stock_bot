import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { SubscriptionItem } from "../enum/subscription-item.enum";

@Entity()
export class NotificationHistory {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'simple-enum',
        enum: SubscriptionItem,
        default: SubscriptionItem.Default,
    })
    subscriptionItem: SubscriptionItem;

    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date;
}