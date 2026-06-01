import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('blocked_user')
export class TokenEntity {
    @PrimaryColumn({ type: 'varchar', length: 50 })
    bid!: string

    @Column({ type: 'varchar' })
    token!: string
}