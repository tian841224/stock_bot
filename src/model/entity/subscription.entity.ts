import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, Unique } from "typeorm";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";
import { SubscriptionItem } from "../enum/subscription-item.enum";
import { SubscriptionStock } from "./subscription-stock.entity";

@Unique(['userId', 'item'])
@Entity()
export class Subscription extends BaseEntity {
    @Column()
    userId: string;

    @Column({
        type: 'simple-enum',
        enum: SubscriptionItem,
        default: SubscriptionItem.Default,
    })
    item: SubscriptionItem;

    @ManyToOne(() => User, user => user.subscriptions)
    @JoinColumn({ name: 'userId', referencedColumnName: 'userid' })
    user: User;

    @OneToMany(() => SubscriptionStock, subscriptionStock => subscriptionStock.subscription)
    subscriptionStocks: SubscriptionStock[];
}