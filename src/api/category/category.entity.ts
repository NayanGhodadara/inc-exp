import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { CategoryIconEntity } from "../option/category-icon.entity";
import { UserEntity } from "../user/user.entity";
import { TransactionEntity } from "../transaction/transaction.entity";

@Entity('income_category')
export class IncomeCategoryEntity {
    @PrimaryColumn({ type: 'varchar', length: 50 })
    cid!: string

    @Column({ type: 'varchar', length: 50, unique: true })
    title!: string

    @ManyToOne(() => CategoryIconEntity, (icon) => icon.incomeCategories, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'ciid' })
    icon!: CategoryIconEntity

    @ManyToOne(() => UserEntity, (icon) => icon.incomeCategories, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'uid' })
    user!: UserEntity

    @OneToMany(() => TransactionEntity, (transaction) => transaction.incomeCategory)
    transactions!: TransactionEntity[]
}

@Entity('expense_category')
export class ExpenseCategoryEntity {
    @PrimaryColumn({ type: 'varchar', length: 50 })
    cid!: string

    @Column({ type: 'varchar', length: 50, unique: true })
    title!: string

    @ManyToOne(() => CategoryIconEntity, (icon) => icon.expenseCategories, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'ciid' })
    icon!: CategoryIconEntity

    @ManyToOne(() => UserEntity, (icon) => icon.expenseCategories, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'uid' })
    user!: UserEntity

    @OneToMany(() => TransactionEntity, (transaction) => transaction.expenseCategory)
    transactions!: TransactionEntity[]
}