import { su } from './../../../node_modules/make-plural/cardinals.d';
import { UserService } from './user.service';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../../guard/auth.guard';
import { DeviceContext } from '../../middleware/user.middleware';
import { UserDto } from './user.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { DashboardDto } from './dahsboard/dashboard.dto';

@Controller()
export class UserController {

    constructor(
        private readonly userService: UserService
    ) { }

    @Get('user')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get other users details' })
    @UseGuards(AuthGuard)
    async getUser(
        @DeviceContext() user: UserDto,
        @I18n() i18n: I18nContext
    ) {
        const data = await this.userService.getUserByUid(user.uid)
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
        const data = await this.userService.createDashboard(user.uid, dashboardDto, i18n)
        return {
            statusCode: 200,
            message: i18n.t('common.SUCCESS'),
            data: data
        }
    }
}
