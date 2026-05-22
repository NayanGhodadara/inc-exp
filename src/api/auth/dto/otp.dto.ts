import { ApiProperty } from "@nestjs/swagger";

export class OtpDto {
    @ApiProperty({ type: 'string', required: true })
    email!: string

    @ApiProperty({ type: 'string', required: true })
    otp!: string
}