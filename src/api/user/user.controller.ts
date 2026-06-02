import { UserService } from './user.service';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../../guard/auth.guard';
import { DeviceContext } from '../../middleware/user.middleware';
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
}
