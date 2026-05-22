import { ApiProperty } from "@nestjs/swagger";

export class CategoryIconDto {
    @ApiProperty({ type: 'string' })
    icon!: string
}