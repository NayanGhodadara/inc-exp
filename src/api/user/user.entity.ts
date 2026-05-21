import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('user')
export class UserEntity {
    @PrimaryColumn({ type: 'varchar', nullable: false })
    uid!: string

    @Column({ type: 'varchar', unique: true, nullable: false, length: 100 })
    email!: string

    @Column({ type: 'varchar', default: 'User123', length: 100 })
    name!: string

    @Column({ type: 'varchar', nullable: true })
    providerType!: string

    @Column({ type: 'boolean', default: false })
    isProfileSetup!: string

    @Column({ type: 'bigint', nullable: true })
    createdAt!: number
}