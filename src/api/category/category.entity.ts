import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { CategoryIconEntity } from "../option/category-icon.entity";

@Entity('income_category')
export class IncomeCategoryEntity {
    @PrimaryColumn({ type: 'varchar', length: 50 })
    cid!: string

    @Column({ type: 'varchar', length: 50 })
    title!: string

    @ManyToOne(() => CategoryIconEntity, (icon) => icon.incomeCategories, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'ciid' })
    icon!: CategoryIconEntity
}

@Entity('expense_category')
export class ExpenseCategoryEntity {
    @PrimaryColumn({ type: 'varchar', length: 50 })
    cid!: string

    @Column({ type: 'varchar', length: 50 })
    title!: string

    @ManyToOne(() => CategoryIconEntity, (icon) => icon.expenseCategories, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'ciid' })
    icon!: CategoryIconEntity
}