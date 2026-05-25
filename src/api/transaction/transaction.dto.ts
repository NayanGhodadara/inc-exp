import { ApiProperty } from "@nestjs/swagger";
import { CategoryType, PaymentMethod } from "../../constants/app.constants";

export class TransactionDto {
    @ApiProperty({ type: 'number', example: 2500.75 })
    amount!: number

    @ApiProperty({ type: 'string', example: 'C12392sdf230dff323' })
    cid!: string

    @ApiProperty({ type: 'string', example: 'D12392sdf230dff323' })
    did!: string

    @ApiProperty({ type: 'string', enum: PaymentMethod })
    paymentMethod!: PaymentMethod

    @ApiProperty({ type: 'string', enum: CategoryType })
    transactionMethod!: CategoryType

    @ApiProperty({ type: 'string', example: 'Test' })
    note!: string
}