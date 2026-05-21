import { AuthService } from './auth.service';
import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiBody, ApiOperation } from "@nestjs/swagger";
import { SocialLoginDto } from "./social.dto";
import { ProviderType } from '../../constants/app.constants';
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller()
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('social-login')
    @ApiOperation({ summary: 'socail login', description: `**provider type** :${Object.values(ProviderType).map(s => `\`${s}\``).join(', ')}` })
    @ApiBody({ type: SocialLoginDto })
    async socialLogin(
        @Body() socialLoginDto: SocialLoginDto,
        @I18n() i18n: I18nContext
    ) {
        const data = await this.authService.socialLogin(socialLoginDto, i18n)
        return {
            statusCode: 200,
            message: i18n.t('common.LOGIN_SUCCESS'),
            data: data
        }
    }
}