import jwt from 'jsonwebtoken';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { TokenService } from '../api/auth/token/token.service';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly moduleRef: ModuleRef,
    ) { }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const tokenService = this.moduleRef.get(TokenService, {
            strict: false,
        });

        const request = context.switchToHttp().getRequest();
        const authorization = request.headers.authorization;

        if (!authorization) {
            throw new UnauthorizedException("Auth token required");
        }

        const [type, token] = authorization.split(' ');

        if (type !== 'Bearer' || !token) {
            throw new UnauthorizedException('Invalid token format');
        }

        const isTokenLogout = await tokenService.isBlocked(token);
        if (isTokenLogout) {
            throw new UnauthorizedException('Unauthorized');
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || "secret key");
            request.user = decoded;
            request.token = token;
            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}