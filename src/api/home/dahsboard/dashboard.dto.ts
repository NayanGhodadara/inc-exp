import { ApiProperty } from "@nestjs/swagger";

export class DashboardDto {
    @ApiProperty({ type: 'string', example: 'test-user' })
    name!: string
}