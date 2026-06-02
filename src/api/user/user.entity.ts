import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { ExpenseCategoryEntity, IncomeCategoryEntity } from '../category/category.entity';
import { TransactionEntity } from '../transaction/transaction.entity';
import { DashboardEntity } from "../home/dahsboard/dashboard.entity";

@Entity('user')
export class UserEntity {
    @PrimaryColumn({ type: 'varchar', nullable: false })
    uid!: string

    @Column({ type: 'varchar', unique: true, nullable: false, length: 100 })
    email!: string

    @Column({ type: 'varchar', length: 100, nullable: true })
    name!: string

    @Column({ type: 'varchar', nullable: true })
    providerType!: string

    @Column({ type: 'boolean', default: false })
    isProfileSetup!: string

    @Column({
        type: 'bigint', nullable: true,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => Number(value),
        },
    })
    createdAt!: number

    @ManyToOne(() => DashboardEntity, (dashboard) => dashboard.user)
    @JoinColumn({ name: 'did' })
    defaultDashboard!: DashboardEntity

    @OneToMany(() => DashboardEntity, (dashboard) => dashboard.user)
    dahsboards!: DashboardEntity[]


    @OneToMany(() => IncomeCategoryEntity, (income) => income.user)
    incomeCategories!: IncomeCategoryEntity[]

    @OneToMany(() => ExpenseCategoryEntity, (expense) => expense.user)
    expenseCategories!: ExpenseCategoryEntity[]

    @OneToMany(() => TransactionEntity, (transaction) => transaction.user)
    transaction!: TransactionEntity[]
}