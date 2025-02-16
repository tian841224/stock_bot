import { Entity, Column, OneToMany } from 'typeorm';
import { UserType } from '../enum/user-type.enum';
import { BaseEntity } from './base.entity';
import { Subscription } from './subscription.entity';

@Entity()
export class User extends BaseEntity {
    @Column({
        type: 'simple-enum',
        enum: UserType,
        default: UserType.Default,
    })
    type: UserType;

    @Column({ unique: true })
    userid: string;

    @OneToMany(() => Subscription, subscription => subscription.user)
    subscriptions: Subscription[];
}
