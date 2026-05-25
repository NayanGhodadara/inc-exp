import { Module } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { TransactionController } from "./transaction.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionEntity } from "./transaction.entity";
import { UserModule } from "../user/user.module";
import { CategoryModule } from "../category/category.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([TransactionEntity]),
        UserModule,
        CategoryModule,
    ],
    providers: [TransactionService],
    controllers: [TransactionController]
})
export class TransactionModule { }