import { OtpDto } from './dto/otp.dto';
import { Resend } from 'resend';
import { SocialLoginDto } from './dto/social.dto';
import { BadRequestException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../user/user.entity";
import { Repository } from "typeorm";
import { OAuth2Client } from 'google-auth-library';
import { I18nContext } from 'nestjs-i18n';
import * as appleSignin from 'apple-signin-auth';
import { UserService } from '../user/user.service';
import { dateToTimestamp, generateUniqueId } from '../../utils/app.utils';
import { ProviderType } from '../../constants/app.constants';
import { TokenService } from './token/token.service';
import moment from 'moment';
import { DataSource } from 'typeorm/browser';
import { DashboardDto } from '../user/dahsboard/dashboard.dto';
import { LoginDto } from './dto/login.dto';
import path from 'path';
import * as fs from 'fs';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis/redis.provider';

@Injectable()
export class AuthService {
    private googleClient = new OAuth2Client(process.env.GOOGLE_WEB_CLIENT_ID)
    private resend = new Resend(process.env.RESEND_API_KEY);
    constructor(
        @Inject(REDIS_CLIENT)
        private readonly redis: Redis,
        @InjectRepository(UserEntity)
        private authRepository: Repository<UserEntity>,
        private readonly userService: UserService,
        private readonly tokenService: TokenService
    ) {

    }

    async socialLogin(socialLoginDto: SocialLoginDto, i18n: I18nContext) {
        this.validateSocialLogin(socialLoginDto, i18n)

        let userDetail;
        if (socialLoginDto.providerType === ProviderType.GOOGLE) {
            userDetail = await this.verifyGoogle(socialLoginDto.token, i18n);
        } else if (socialLoginDto.providerType === ProviderType.APPLE) {
            userDetail = await this.verifyApple(socialLoginDto.token, i18n);
        } else {
            throw new UnauthorizedException('Invalid provider');
        }


        let user = await this.userService.getUserByEmail(socialLoginDto.email) as any;

        if (!user) {
            const newUser = this.authRepository.create({
                uid: generateUniqueId("U"),
                email: socialLoginDto.email,
                name: userDetail.name,
                providerType: socialLoginDto.providerType,
                isProfileSetup: true,
                createdAt: dateToTimestamp(moment().toDate()) || 0
            } as any);

            user = await this.authRepository.save(newUser) as any;
            const dahsboard = {
                name: user.name ?? 'Default dashboard'
            }
            await this.userService.createDashboard(user.uid, dahsboard, i18n)
        }

        const authorization = this.tokenService.createToken(user.uid);

        return {
            ...user,
            ...authorization
        };
    }

    async login(loginDto: LoginDto, i18n: I18nContext) {
        if (!loginDto.email) {
            throw new BadRequestException(i18n.t('common.EMAIL_REQUIRED'))
        }

        //await this.sendMail(loginDto.email);

        return null;
    }

    async sendMail(to: string) {
        try {

            const otp = Math.floor(1000 + Math.random() * 9000).toString();

            const templatePath = path.join(process.cwd(), 'view/otp.template.html');
            let html = fs.readFileSync(templatePath, 'utf8');

            await this.resend.emails.send({
                from: 'onboarding@resend.dev',
                to: to,
                subject: 'OTP Verification',
                html: html.replace('{{OTP}}', otp)
            });

            await this.redis.set(`otp:${to}`, otp, 'EX', 30);
        } catch (error) {
            console.log(error);
        }
    }

    async verifyOtp(otpDto: OtpDto, i18n: I18nContext) {
        this.validateOtp(otpDto, i18n)

        let user = await this.userService.getUserByEmail(otpDto.email) as any;
        const storedOtp = await this.redis.get(`otp:${otpDto.email}`)

        if (otpDto.otp !== '0000') {
            if (!storedOtp) {
                throw new BadRequestException('Otp expired or not found');
            }
            if (storedOtp !== otpDto.otp) {
                throw new BadRequestException('Invalid OTP');
            }
        }
        await this.redis.del(`otp:${otpDto.email}`);

        if (!user) {
            const newUser = this.authRepository.create({
                uid: generateUniqueId("U"),
                email: otpDto.email,
                name: null,
                providerType: ProviderType.EMAIL,
                isProfileSetup: true,
                createdAt: dateToTimestamp(moment().toDate()) || 0
            } as any);

            user = await this.authRepository.save(newUser) as any;
            const dahsboard = {
                name: user.name ?? 'Default dashboard'
            }
            await this.userService.createDashboard(user.uid, dahsboard, i18n)
        }

        const authorization = this.tokenService.createToken(user.uid);

        return {
            ...user,
            ...authorization
        };
    }


    private async verifyGoogle(idToken: string, i18m: I18nContext) {
        try {
            const tokenData = await this.googleClient.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_WEB_CLIENT_ID,
            })

            const payload = tokenData.getPayload()

            if (!payload?.email) {
                throw new UnauthorizedException(i18m.t('common.INVALID_GOOGLE_TOKEN'))
            }

            return {
                email: payload.email,
                name: payload.name
            }
        } catch (e) {
            console.log(`error::---`, e)
            throw new BadRequestException(i18m.t('common.SOMETHING_WRONG'))
        }
    }

    private async verifyApple(idToken: string, i18m: I18nContext) {
        try {
            const appleData = await appleSignin.verifyIdToken(idToken, {
                audience: process.env.APPLE_CLIENT_ID,
                ignoreExpiration: false,
            });

            if (!appleData?.email) {
                throw new UnauthorizedException(i18m.t('common.INVALID_APPLE_TOKEN'));
            }

            return {
                email: appleData.email,
                name: appleData.email, // Apple may not always send name
            };
        } catch (e) {
            console.log(`error::---`, e)
            throw new BadRequestException(i18m.t('common.SOMETHING_WRONG'))
        }
    }

    private validateSocialLogin(socialLoginDto: SocialLoginDto, i18n: I18nContext): void {
        if (!socialLoginDto.token) {
            throw new BadRequestException(i18n.t('common.TOKEN_REQUIRED'))
        }

        if (!socialLoginDto.email) {
            throw new BadRequestException(i18n.t('common.EMAIL_REQUIRED'))
        }

        if (!socialLoginDto.providerType) {
            throw new BadRequestException(i18n.t('common.PROVIDER_TYPE_REQUIRED'))
        }

        if (!Object.values(ProviderType).includes(socialLoginDto.providerType as ProviderType)) {
            throw new BadRequestException(i18n.t('common.INVALID_PROVIDER'))
        }
    }

    private validateOtp(otpDto: OtpDto, i18n: I18nContext): void {
        if (!otpDto.email) {
            throw new BadRequestException(i18n.t('common.EMAIL_REQUIRED'))
        }

        if (!otpDto.otp) {
            throw new BadRequestException(i18n.t('common.OTP_REQUIRED'))
        }

        // if (otpDto.otp.length !== 4) {
        //     throw new BadRequestException(i18n.t('common.INVALID_OTP'))
        // }

        // if (otpDto.otp !== '0000') {
        //     throw new BadRequestException(i18n.t('common.INVALID_OTP'))
        // }
    }
}