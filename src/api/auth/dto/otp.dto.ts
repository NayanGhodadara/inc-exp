import { ApiProperty } from "@nestjs/swagger";

export class OtpDto {
    @ApiProperty({ type: 'string', example: 'test@gmail.com', required: true })
    email!: string

    @ApiProperty({ type: 'string', example: '0000', required: true })
    otp!: string
}