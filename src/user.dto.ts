import { ApiProperty } from "@nestjs/swagger"

export class UserDto {
    @ApiProperty()
    uid!: string
    @ApiProperty()
    name!: string
}