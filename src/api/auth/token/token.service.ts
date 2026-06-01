import { SignOptions } from './../../../../node_modules/@types/jsonwebtoken/index.d';
import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from '@nestjs/typeorm';
import jwt from "jsonwebtoken";
import { TokenEntity } from './token.entity';
import { Repository } from 'typeorm';
import { generateUniqueId } from '../../../utils/app.utils';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class TokenService {

    constructor(
        @InjectRepository(TokenEntity)
        private tokenRepository: Repository<TokenEntity>,
        private readonly jwtService: JwtService
    ) { }

    createToken(uid: string) {
        const jwtTokenKey = process.env.JWT_ACCESS_SECRET ?? "access secret key";
        const refreshTokenKey = process.env.JWT_REFRESH_SECRET ?? "refresh secret key";

        const options: SignOptions = {
            expiresIn: process.env.JWT_EXPIRE_TIME || "7d" as any,
        };

        const options2: SignOptions = {
            expiresIn: process.env.JWT_REFRESH_TIME || "30d" as any,
        };

        const token = jwt.sign({ uid, type: "access" }, jwtTokenKey, options);
        const refreshToken = jwt.sign({ uid, type: "refresh" }, refreshTokenKey, options2);


        const decodedToken: any = this.jwtService.decode(token);
        const expireAt = Number(decodedToken.exp) * 1000;

        return {
            authentication: {
                token: token, refreshToken: refreshToken, expireAt: expireAt
            }
        };
    }

    verifyToken(token: string) {
        try {
            const jwtTokenKey = process.env.JWT_ACCESS_SECRET ?? "access secret key";
            const decoded = jwt.verify(token, jwtTokenKey);
            return decoded;
        } catch (err) {
            return null;
        }
    }

    async blockToken(token: string, i18n: I18nContext) {
        if (!token) {
            throw new BadRequestException(i18n.t('common.TOKEN_REQUIRED'))
        }
        await this.tokenRepository.save({
            bid: generateUniqueId('B'),
            token: token
        })

        return null
    }

    async isBlocked(token: string) {
        const data = await this.tokenRepository.findOne(
            { where: { token: token } }
        )
        if (data) {
            return true
        } else {
            return false
        }
    }
}