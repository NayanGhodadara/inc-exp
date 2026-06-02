import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class OtpDto {
    @ApiProperty({ type: 'string', example: 'test@gmail.com', required: true })
    @IsEmail()
    email!: string

    @ApiProperty({ type: 'string', example: '0000', required: true })
    otp!: string
}