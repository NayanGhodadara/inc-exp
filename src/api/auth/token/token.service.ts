import { SignOptions } from './../../../../node_modules/@types/jsonwebtoken/index.d';
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import jwt from "jsonwebtoken";

@Injectable()
export class TokenService {

    constructor(
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
}