import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Subscription } from "./subscription.entity";

@Entity()
export class SubscriptionStock extends BaseEntity {

    @Column()
    subscriptionId: number;

    @Column({unique: true})
    stock: string;

    @ManyToOne(() => Subscription, subscription => subscription.subscriptionStocks)
    @JoinColumn({ name: 'subscriptionId', referencedColumnName: 'id' })
    subscription: Subscription;
}