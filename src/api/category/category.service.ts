import { CategoryDto } from './category.dto';
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ExpenseCategoryEntity, IncomeCategoryEntity } from "./category.entity";
import { Repository } from "typeorm";
import { I18nContext } from 'nestjs-i18n';
import { CategoryType } from '../../constants/app.constants';
import { generateUniqueId } from '../../utils/app.utils';
import { OptionService } from '../option/option.service';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(IncomeCategoryEntity)
        private incomeRepo: Repository<IncomeCategoryEntity>,

        @InjectRepository(ExpenseCategoryEntity)
        private expenseRepo: Repository<ExpenseCategoryEntity>,

        private readonly optionService: OptionService
    ) { }

    async createCategory(categoryDto: CategoryDto, i18n: I18nContext) {
        await this.validateCategory(categoryDto, i18n)

        if (categoryDto.categoryType === CategoryType.INCOME) {
            const data = this.incomeRepo.create({
                cid: generateUniqueId('C'),
                title: categoryDto.title,
                icon: { ciid: categoryDto.ciid }
            })

            const category = await this.incomeRepo.save(data)
            const result = this.incomeRepo.findOne({
                where: { cid: category.cid },
                relations: { icon: true }
            })

            return result
        } else {
            const data = this.expenseRepo.create({
                cid: generateUniqueId('C'),
                title: categoryDto.title,
                icon: { ciid: categoryDto.ciid }
            })

            const category = await this.incomeRepo.save(data)
            const result = this.incomeRepo.findOne({
                where: { cid: category.cid },
                relations: { icon: true }
            })

            return result
        }
    }


    async validateCategory(categoryDto: CategoryDto, i18n: I18nContext) {
        if (!categoryDto.categoryType) {
            throw new BadRequestException(i18n.t('common.TYPE_REQUIRED'))
        }
        if (!categoryDto.ciid) {
            throw new BadRequestException(i18n.t('common.CIID_REQUIRED'))
        }

        const iconExist = await this.optionService.getIconById(categoryDto.ciid)
        if (!iconExist) {
            throw new BadRequestException(i18n.t('common.INVALID_CIID'))
        }

        if (!categoryDto.title) {
            throw new BadRequestException(i18n.t('common.TITLE_REQUIRED'))
        }
    }
}