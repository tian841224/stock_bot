import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Subscription } from "./subscription.entity";

@Entity()
@Index(['subscriptionId', 'stock'], { unique: true })
export class SubscriptionStock extends BaseEntity {

    @Column()
    subscriptionId: number;

    @Column()
    stock: string;

    @ManyToOne(() => Subscription, subscription => subscription.subscriptionStocks)
    @JoinColumn({ name: 'subscriptionId', referencedColumnName: 'id' })
    subscription: Subscription;
}