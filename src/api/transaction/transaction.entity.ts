import { ExpenseCategoryEntity, IncomeCategoryEntity } from './../category/category.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { CategoryType, PaymentMethod } from "../../constants/app.constants";
import { UserEntity } from '../user/user.entity';
import { DashboardEntity } from '../user/dahsboard/dashboard.entity';

@Entity('transacton')
export class TransactionEntity {

    @PrimaryColumn({ type: 'varchar', length: 50 })
    tid!: string

    @Column({
        type: 'decimal', precision: 10,
        scale: 2,
        default: 0.0,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value),
        },
    })
    amount!: number

    @Column({ type: 'varchar', length: 100, default: null })
    note!: string

    @Column({ type: 'enum', enum: PaymentMethod, default: null })
    paymentMethod!: string

    @Column({ type: 'enum', enum: CategoryType, default: null })
    transactionMethod!: string

    @Column({
        type: 'bigint', nullable: true,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => Number(value),
        },
    })
    createdAt!: number

    @ManyToOne(() => IncomeCategoryEntity, (category) => category.transactions, {
        nullable: true,
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'income_cid' })
    incomeCategory!: IncomeCategoryEntity

    @ManyToOne(() => ExpenseCategoryEntity, (category) => category.transactions, {
        nullable: true,
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'expense_cid' })
    expenseCategory!: ExpenseCategoryEntity

    @ManyToOne(() => UserEntity, (user) => user.transaction, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'uid' })
    user!: UserEntity

    @ManyToOne(() => DashboardEntity, (dashboard) => dashboard.transaction, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'did' })
    dashboard!: DashboardEntity
}