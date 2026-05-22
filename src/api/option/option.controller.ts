import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { OptionService } from "./option.service";

@ApiTags('Options')
@Controller('options')
export class CategoryIconController {

    constructor(
        private readonly optionService: OptionService
    ) { }

    @Get()
    @ApiOperation({ summary: 'get option list' })
    async getAllOptionList() {
        const categoryIcons = await this.optionService.getAllIcon()

        return {
            statusCode: 200,
            message: 'success',
            data: {
                categoryIcons: categoryIcons
            }
        }
    }
}