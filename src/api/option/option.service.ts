import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { I18nContext } from 'nestjs-i18n';
import { CategoryIconDto } from './category-icon.dto';
import { CategoryIconEntity } from "./category-icon.entity";
import { generateUniqueId } from "../../utils/app.utils";

@Injectable()
export class OptionService {
    constructor(
        @InjectRepository(CategoryIconEntity)
        private repo: Repository<CategoryIconEntity>,
    ) { }

    async createCategoryIcon(categoryIconDto: CategoryIconDto, i18n: I18nContext) {
        if (!categoryIconDto.icon) {
            throw new BadRequestException('icon missing')
        }

        const data = this.repo.create({
            ciid: generateUniqueId("CI"),
            icon: categoryIconDto.icon
        })

        const result = await this.repo.save(data)
        return result
    }

    async getIconById(ciid: string) {
        const result = await this.repo.findOne({
            where: { ciid: ciid }
        })

        return result
    }

    async getAllIcon() {
        const result = await this.repo.find()
        return result
    }
}