import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TokenService } from "./token.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TokenEntity } from "./token.entity";

@Module({
    imports: [
        JwtModule.register({}),
        TypeOrmModule.forFeature([TokenEntity])
    ],
    controllers: [],
    providers: [TokenService],
    exports: [TokenService]
})
export class TokenModule { }