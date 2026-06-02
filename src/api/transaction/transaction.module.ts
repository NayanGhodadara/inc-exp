import { forwardRef, Module } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { TransactionController } from "./transaction.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionEntity } from "./transaction.entity";
import { UserModule } from "../user/user.module";
import { CategoryModule } from "../category/category.module";
import { HomeModule } from "../home/home.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([TransactionEntity]),
        forwardRef(() => HomeModule),
        CategoryModule,
    ],
    providers: [TransactionService],
    controllers: [TransactionController],
    exports: [TransactionService]
})
export class TransactionModule { }