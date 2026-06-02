import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { HomeService } from "./home.service";
import { AuthGuard } from "../../guard/auth.guard";
import { UserDto } from "../user/dto/user.dto";
import { DeviceContext } from "../../middleware/user.middleware";
import { I18n, I18nContext } from "nestjs-i18n";
import { DashboardDto } from "./dahsboard/dashboard.dto";
import { DEFAULT_COUNT, DEFAULT_LIMIT } from "../../constants/app.constants";

@ApiTags('home')
@Controller('')
export class HomeController {
    constructor(
        private readonly homeService: HomeService
    ) { }


    @Get('home/:did')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Get dashboard user home details' })
    @ApiParam({ name: 'did', required: true, description: 'Dashboard id' })
    async getHomeDetails(
        @I18n() i18n: I18nContext,
        @DeviceContext() user: UserDto,
        @Param('did') did: string
    ) {
        const data = await this.homeService.getHomeDetails(user.uid, did, i18n)

        return {
            statusCode: 200,
            message: i18n.t('common.SUCCESS'),
            data: data
        }
    }

    @Post('dashboard')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'create new dashboard' })
    @ApiBody({ type: DashboardDto })
    async createDashBoard(
        @DeviceContext() user: UserDto,
        @I18n() i18n: I18nContext,
        @Body() dashboardDto: DashboardDto
    ) {
        const data = await this.homeService.createDashboard(user.uid, dashboardDto, i18n)
        return {
            statusCode: 200,
            message: i18n.t('common.SUCCESS'),
            data: data
        }
    }

    @Get('dashboard')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Get auth user all dashboards' })
    @ApiQuery({ name: 'count', required: false, type: 'number' })
    @ApiQuery({ name: 'limit', required: false, type: 'number' })
    async getAllDashboard(
        @I18n() i18n: I18nContext,
        @DeviceContext() user: UserDto,
        @Query('count', new DefaultValuePipe(DEFAULT_COUNT), ParseIntPipe) count: number,
        @Query('limit', new DefaultValuePipe(DEFAULT_LIMIT), ParseIntPipe) limit: number
    ) {
        const { data, total } = await this.homeService.getAllDashboards(user.uid, count, limit)

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

    @Post('dashboard/set-default/:did')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Set default dashboard' })
    @ApiParam({ name: 'did', required: true, description: 'Dashboard id' })
    async setDefaultDashboard(
        @I18n() i18n: I18nContext,
        @DeviceContext() user: UserDto,
        @Param('did') did: string,
    ) {
        const data = await this.homeService.setDefaultDashboard(user.uid, did, i18n)
        return {
            statusCode: 200,
            message: i18n.t('common.SUCCESS'),
            data: data
        }
    }
}