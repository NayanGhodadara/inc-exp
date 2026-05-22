import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({ type: 'string', required: true })
    email!: string
}