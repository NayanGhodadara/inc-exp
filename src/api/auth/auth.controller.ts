import { AuthService } from './auth.service';
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation } from "@nestjs/swagger";
import { SocialLoginDto } from "./dto/social.dto";
import { I18n, I18nContext } from 'nestjs-i18n';
import { LoginDto } from './dto/login.dto';
import { OtpDto } from './dto/otp.dto';
import { AuthGuard } from '../../guard/auth.guard';
import { DeviceContext, TokenContext } from '../../middleware/user.middleware';
import { UserDto } from '../user/dto/user.dto';

@Controller()
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('social-login')
    @ApiOperation({ deprecated: true, summary: 'socail login', description: `**provider type** :google, email` })
    @ApiBody({ type: SocialLoginDto })
    async socialLogin(
        @Body() socialLoginDto: SocialLoginDto,
        @I18n() i18n: I18nContext
    ) {

        return {
            statusCode: 404,
            message: "DEPRICATED API",
            data: null
        }
        // const data = await this.authService.socialLogin(socialLoginDto, i18n)
        // return {
        //     statusCode: 200,
        //     message: i18n.t('common.LOGIN_SUCCESS'),
        //     data: data
        // }
    }

    @Post('login')
    @ApiOperation({
        summary: 'user login', description: `### Login user with email`,
    })
    @ApiBody({ type: LoginDto })
    async login(
        @Body() loginDto: LoginDto,
        @I18n() i18n: I18nContext
    ) {
        const data = await this.authService.login(loginDto, i18n)
        return {
            statusCode: 200,
            message: i18n.t('common.OTP_SEND'),
            data: data
        }
    }

    @Post('verify-otp')
    @ApiOperation({
        summary: 'verify otp', description: `### Verify user with email otp`,
    })
    @ApiBody({ type: OtpDto })
    async verifyOtp(
        @Body() otpDto: OtpDto,
        @I18n() i18n: I18nContext
    ) {
        const data = await this.authService.verifyOtp(otpDto, i18n)
        return {
            statusCode: 200,
            message: i18n.t('common.OTP_VERIFIED'),
            data: data
        }
    }

    @Post('logout')
    @ApiOperation({
        summary: 'Logout user',
    })
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async logout(
        @TokenContext() token: string,
        @I18n() i18n: I18nContext
    ) {
        const data = await this.authService.logout(token, i18n)
        return {
            statusCode: 200,
            message: i18n.t('common.LOGOUT_SUCCESS'),
            data: data
        }
    }
}