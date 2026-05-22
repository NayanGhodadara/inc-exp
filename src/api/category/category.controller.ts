import { da } from './../../../node_modules/make-plural/cardinals.d';
import { CategoryService } from './category.service';
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation } from "@nestjs/swagger";
import { DeviceContext } from "../../middleware/user.middleware";
import { UserDto } from "../user/dto/user.dto";
import { I18n, I18nContext } from "nestjs-i18n";
import { AuthGuard } from "../../guard/auth.guard";
import { CategoryType } from "../../constants/app.constants";
import { CategoryDto } from "./category.dto";

@Controller()
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService
    ) { }

    @Post('category')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'create new income and expense' })
    @ApiBody({ type: CategoryDto })
    @ApiOperation({ summary: 'create income and expense categories', description: `Type: ${Object.values(CategoryType).join(',')}` })
    async createCategory(
        @DeviceContext() user: UserDto,
        @I18n() i18n: I18nContext,
        @Body() body: CategoryDto
    ) {
        const data = await this.categoryService.createCategory(body, i18n)
        return {
            statusCode: 201,
            message: i18n.t('common.CATEGORY_CREATED'),
            data: data
        }
    }
}