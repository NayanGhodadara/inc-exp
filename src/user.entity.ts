import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("user")
export class UserEntity {
    @PrimaryColumn({ type: 'varchar' })
    uid!: string

    @Column({ type: 'varchar' })
    name!: string
}