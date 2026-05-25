import { tr } from './../../../../node_modules/make-plural/cardinals.d';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { UserEntity } from "../user.entity";
import { TransactionEntity } from '../../transaction/transaction.entity';

@Entity('dashboard')
export class DashboardEntity {
    @PrimaryColumn({ type: 'varchar', length: 50 })
    did!: string

    @Column({ type: 'varchar', length: 50, unique: true })
    name!: string

    @ManyToOne(() => UserEntity, (user) => user.dahsboards, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'uid' })
    user!: UserEntity

    @OneToMany(() => TransactionEntity, (transaction) => transaction.dashboard)
    transaction!: TransactionEntity[]
}