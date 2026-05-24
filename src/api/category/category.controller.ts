import { da } from 'make-plural/cardinals';
import { AuthGuard } from './../../guard/auth.guard';
import { CategoryService } from './category.service';
import { Body, Controller, DefaultValuePipe, Get, ParseIntPipe, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery } from "@nestjs/swagger";
import { DeviceContext } from "../../middleware/user.middleware";
import { UserDto } from "../user/dto/user.dto";
import { I18n, I18nContext } from "nestjs-i18n";
import { CategoryType, DEFAULT_COUNT, DEFAULT_LIMIT } from "../../constants/app.constants";
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
        const data = await this.categoryService.createCategory(user.uid, body, i18n)
        return {
            statusCode: 201,
            message: i18n.t('common.CATEGORY_CREATED'),
            data: data
        }
    }

    @Get('category')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Get all auth user categories' })
    @ApiQuery({ name: 'count', required: false, type: 'number' })
    @ApiQuery({ name: 'limit', required: false, type: 'number' })
    @ApiQuery({ name: 'type', enum: CategoryType })
    async getAllCategory(
        @I18n() i18n: I18nContext,
        @DeviceContext() user: UserDto,
        @Query('count', new DefaultValuePipe(DEFAULT_COUNT), ParseIntPipe) count: number,
        @Query('limit', new DefaultValuePipe(DEFAULT_LIMIT), ParseIntPipe) limit: number,
        @Query('type') type: CategoryType
    ) {
        const { data, total } = await this.categoryService.getAllCategories(user.uid, count, limit, type)

        return {
            statusCode: 200,
            message: i18n.t('common.SUCCESS'),
            data: data,
            meta: {
                "totalItems": total,
                "itemPerPage": limit,
                "totalPage": Math.ceil(total / (limit)),
                "currentCount": (count) + Number(data.length),
            }
        }
    }
}