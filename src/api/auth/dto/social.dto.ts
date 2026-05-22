import { ApiProperty } from "@nestjs/swagger"

export class SocialLoginDto {
    @ApiProperty({ type: 'string', example: 'Qdv20or3f234542345....' })
    token!: string
    @ApiProperty({ type: 'string', example: 'test@example.com' })
    email!: string
    @ApiProperty({ type: 'string', example: 'google' })
    providerType!: string
}