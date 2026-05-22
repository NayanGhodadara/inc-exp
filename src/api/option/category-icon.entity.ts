import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm"
import { ExpenseCategoryEntity, IncomeCategoryEntity } from "../category/category.entity"

@Entity('category_icon')
export class CategoryIconEntity {
    @PrimaryColumn({ type: 'varchar', length: 50 })
    ciid!: string

    @Column({ type: 'varchar', length: 50 })
    icon!: string

    @OneToMany(
        () => IncomeCategoryEntity,
        (category) => category.icon
    )
    incomeCategories!: IncomeCategoryEntity[]

    @OneToMany(
        () => ExpenseCategoryEntity,
        (category) => category.icon
    )
    expenseCategories!: ExpenseCategoryEntity[]
}