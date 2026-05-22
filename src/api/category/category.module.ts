import { Module } from "@nestjs/common";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ExpenseCategoryEntity, IncomeCategoryEntity } from "./category.entity";
import { OptionModule } from "../option/option.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([IncomeCategoryEntity, ExpenseCategoryEntity]),
        OptionModule
    ],
    controllers: [CategoryController],
    providers: [CategoryService]
})
export class CategoryModule {

}