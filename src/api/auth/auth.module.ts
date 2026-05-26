import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../user/user.entity";
import { UserModule } from "../user/user.module";
import { TokenModule } from "./token/token.module";
import { RedisModule } from "./redis/redis.module";

@Module({
    imports: [
        RedisModule,
        TypeOrmModule.forFeature([UserEntity]),
        UserModule,
        TokenModule
    ],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule { }