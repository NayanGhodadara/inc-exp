import { ApiProperty } from "@nestjs/swagger";
import { CategoryType } from "../../constants/app.constants";

export class CategoryDto {
    @ApiProperty({ type: 'string', example: 'allowance' })
    title!: string

    @ApiProperty({ type: 'string', example: 'CI1dkm10102039' })
    ciid!: string

    @ApiProperty({ type: 'string', enum: CategoryType })
    categoryType!: CategoryType
}