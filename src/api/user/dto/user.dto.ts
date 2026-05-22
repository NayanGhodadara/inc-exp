import { ApiProperty } from "@nestjs/swagger"

export class UserDto {
    @ApiProperty({ type: 'string', example: 'U12324023' })
    uid!: string
    @ApiProperty({ type: 'string', example: 'test@example.com' })
    email!: string
    @ApiProperty({ type: 'string', example: 'test-user' })
    name!: string
    @ApiProperty({ type: 'string', example: 'google' })
    providerType!: string
    @ApiProperty({ type: 'string', example: 'false' })
    isProfileSetup!: string
    @ApiProperty({ type: 'string', example: '7923892830000' })
    createdAt!: number
}