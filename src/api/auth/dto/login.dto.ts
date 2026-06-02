import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class LoginDto {
    @ApiProperty({ type: 'string', required: true })
    @IsEmail()
    email!: string
}