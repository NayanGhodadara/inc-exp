import { forwardRef, Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../user/user.entity";
import { UserModule } from "../user/user.module";
import { TokenModule } from "./token/token.module";
import { RedisModule } from "./redis/redis.module";
import { HomeModule } from "../home/home.module";

@Module({
    imports: [
        RedisModule,
        TypeOrmModule.forFeature([UserEntity]),
        forwardRef(() => HomeModule),
        UserModule,
        TokenModule
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService]
})
export class AuthModule { }