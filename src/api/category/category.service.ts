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

    async createCategory(uid: string, categoryDto: CategoryDto, i18n: I18nContext) {
        await this.validateCategory(categoryDto, i18n)

        if (categoryDto.categoryType === CategoryType.INCOME) {
            const data = this.incomeRepo.create({
                cid: generateUniqueId('C'),
                title: categoryDto.title,
                icon: { ciid: categoryDto.ciid },
                user: { uid: uid }
            })

            const category = await this.incomeRepo.save(data)
            const result = await this.incomeRepo.findOne({
                where: { cid: category.cid },
                relations: { icon: true }
            })

            return result
        } else {
            const data = this.expenseRepo.create({
                cid: generateUniqueId('C'),
                title: categoryDto.title,
                icon: { ciid: categoryDto.ciid },
                user: { uid: uid }
            })

            const category = await this.expenseRepo.save(data)
            const result = await this.expenseRepo.findOne({
                where: { cid: category.cid },
                relations: { icon: true }
            })

            return result
        }
    }

    async getAllCategories(uid: string, skip: number, take: number, type: string) {
        let query;

        switch (type) {

            case CategoryType.INCOME:
                query = this.incomeRepo.createQueryBuilder('category');
                break;

            case CategoryType.EXPENSE:
                query = this.expenseRepo.createQueryBuilder('category');
                break;

            default:
                throw new BadRequestException('Invalid category type');
        }

        const [data, total] = await query
            .leftJoin('category.user', 'user')
            .leftJoinAndSelect('category.icon', 'icon')
            .where('user.uid = :uid', { uid })
            .skip(skip)
            .take(take)
            .getManyAndCount();

        return { data, total };
    }

    async getAllIncomeCategoryByUid(uid: string) {

        const query = this.incomeRepo.createQueryBuilder('category');
        const data = await query
            .leftJoin('category.user', 'user')
            .leftJoinAndSelect('category.icon', 'icon')
            .where('user.uid = :uid', { uid })
            .getMany();

        return data;
    }

    async getAllExpenseCategoryByUid(uid: string) {
        const query = this.expenseRepo.createQueryBuilder('category');
        const data = await query
            .leftJoin('category.user', 'user')
            .leftJoinAndSelect('category.icon', 'icon')
            .where('user.uid = :uid', { uid })
            .getMany();

        return data;
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

        const categoryExist = await this.incomeRepo.findOne({
            where: {
                title: categoryDto.title
            }
        })
        console.log("categoryExist", categoryExist)
        if (categoryExist) {
            throw new BadRequestException(i18n.t('common.CATEGORY_EXIST'))
        }
    }
}