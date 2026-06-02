import { forwardRef, Module } from "@nestjs/common";
import { HomeController } from "./home.controller";
import { HomeService } from "./home.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DashboardEntity } from "./dahsboard/dashboard.entity";
import { AuthModule } from "../auth/auth.module";
import { TransactionModule } from "../transaction/transaction.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([DashboardEntity]),
        forwardRef(() => AuthModule),
        forwardRef(() => TransactionModule),
    ],
    providers: [HomeService],
    controllers: [HomeController],
    exports: [HomeService]
})
export class HomeModule {

}