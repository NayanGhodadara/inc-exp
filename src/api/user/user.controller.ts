import { UserService } from './user.service';
import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../../guard/auth.guard';
import { DeviceContext, TokenContext } from '../../middleware/user.middleware';
import { UserDto } from './dto/user.dto';
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller()
export class UserController {

    constructor(
        private readonly userService: UserService
    ) { }

    @Get('user')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get users details' })
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

    @Delete('user')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete user' })
    @UseGuards(AuthGuard)
    async deleteUser(
        @DeviceContext() user: UserDto,
        @I18n() i18n: I18nContext,
        @TokenContext() token: string
    ) {
        const data = await this.userService.deleteUser(user.uid, token, i18n)

        return {
            statusCode: 204,
            message: i18n.t('common.SUCCESS'),
            data: data
        }
    }
}
