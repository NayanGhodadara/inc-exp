import { tr } from './../../../node_modules/make-plural/cardinals.d';
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { DashboardEntity } from "./dahsboard/dashboard.entity";
import { ExpenseCategoryEntity, IncomeCategoryEntity } from '../category/category.entity';

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

    @Column({ type: 'bigint', nullable: true })
    createdAt!: number

    @OneToMany(() => DashboardEntity, (dashboard) => dashboard.user)
    dahsboards!: DashboardEntity[]


    @OneToMany(() => IncomeCategoryEntity, (income) => income.user)
    incomeCategories!: IncomeCategoryEntity[]

    @OneToMany(() => ExpenseCategoryEntity, (expense) => expense.user)
    expenseCategories!: ExpenseCategoryEntity[]
}