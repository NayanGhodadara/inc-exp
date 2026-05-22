import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryIconEntity } from "./category-icon.entity";
import { CategoryIconController } from "./option.controller";
import { OptionService } from "./option.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([CategoryIconEntity])
    ],
    controllers: [CategoryIconController],
    providers: [OptionService],
    exports: [OptionService]
})
export class OptionModule {

}