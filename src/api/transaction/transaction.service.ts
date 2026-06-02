import { da } from 'make-plural/cardinals';
import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TransactionEntity } from "./transaction.entity";
import { Repository } from "typeorm";
import { TransactionDto } from "./transaction.dto";
import { I18nContext } from "nestjs-i18n";
import { UserDto } from "../user/dto/user.dto";
import { CategoryType, PaymentMethod } from "../../constants/app.constants";
import { dateToTimestamp, generateUniqueId } from "../../utils/app.utils";
import { UserService } from "../user/user.service";
import { CategoryService } from "../category/category.service";
import moment from "moment";
import { HomeService } from '../home/home.service';
import { fr } from 'make-plural';
import { from } from 'rxjs';

@Injectable()
export class TransactionService {
    constructor(
        @InjectRepository(TransactionEntity)
        private transactionRepository: Repository<TransactionEntity>,
        @Inject(forwardRef(() => HomeService))
        private readonly homeService: HomeService,
        private readonly categoryService: CategoryService,
    ) { }

    async createTransaction(user: UserDto, i18n: I18nContext, transactionDto: TransactionDto) {
        await this.validateTransaction(user.uid, i18n, transactionDto)

        const transactionDetail = transactionDto.transactionMethod === CategoryType.INCOME
            ? this.transactionRepository.create({
                tid: generateUniqueId('T'),
                amount: transactionDto.amount,
                note: transactionDto.note,
                createdAt: dateToTimestamp(moment().toDate()) || 0,
                paymentMethod: transactionDto.paymentMethod,
                transactionMethod: transactionDto.transactionMethod,
                incomeCategory: { cid: transactionDto.cid },
                user: { uid: user.uid },
                dashboard: { did: transactionDto.did }
            } as any)
            : this.transactionRepository.create({
                tid: generateUniqueId('T'),
                amount: transactionDto.amount,
                note: transactionDto.note,
                createdAt: dateToTimestamp(moment().toDate()) || 0,
                paymentMethod: transactionDto.paymentMethod,
                transactionMethod: transactionDto.transactionMethod,
                expenseCategory: { cid: transactionDto.cid },
                user: { uid: user.uid },
                dashboard: { did: transactionDto.did }
            } as any)

        await this.transactionRepository.save(transactionDetail)

        const result = await this.transactionRepository
            .createQueryBuilder('transaction')
            .leftJoinAndSelect('transaction.user', 'user')
            .leftJoinAndSelect('transaction.dashboard', 'dashboard')
            .leftJoinAndSelect('transaction.incomeCategory', 'incomeCategory')
            .leftJoinAndSelect('incomeCategory.icon', 'incomeIcon')
            .leftJoinAndSelect('transaction.expenseCategory', 'expenseCategory')
            .leftJoinAndSelect('expenseCategory.icon', 'expenseIcon')
            .getOne()

        return result;
    }


    async getAllTransaction(uid: string, skip: number, take: number, did: string, fromDate: number, toDate: number) {
        const startDate = moment.utc(fromDate).valueOf();
        const endDate = moment.utc(toDate).valueOf();
        let query = this.transactionRepository.createQueryBuilder('transaction')
            .leftJoin('transaction.user', 'user')
            .leftJoin('transaction.dashboard', 'dashboard')
            .leftJoinAndSelect('transaction.incomeCategory', 'incomeCategory')
            .leftJoinAndSelect('incomeCategory.icon', 'incomeIcon')
            .leftJoinAndSelect('transaction.expenseCategory', 'expenseCategory')
            .leftJoinAndSelect('expenseCategory.icon', 'expenseIcon')
            .where('user.uid = :uid', { uid })
            .andWhere('dashboard.did = :did', { did });

        if (fromDate !== 0 && toDate !== 0) {
            query.andWhere('transaction.createdAt BETWEEN :startDate AND :endDate', {
                startDate, endDate
            })
        }

        const [data, total] = await query
            .skip(skip)
            .take(take)
            .getManyAndCount();


        const summary = await this.getSummaryOfTransaction(uid, did, fromDate, toDate);
        const income = summary.totalEarning
        const expense = summary.totalExpense
        const balance = summary.balance
        return { data, total, income, expense, balance };
    }

    async getSummaryOfTransaction(uid: string, did: string, fromDate: number = 0, toDate: number = 0) {
        const summary = this.transactionRepository
            .createQueryBuilder('transaction')
            .leftJoin('transaction.user', 'user')
            .leftJoin('transaction.dashboard', 'dashboard')
            .select(
                'SUM(CASE WHEN transaction.transactionMethod = :incomeType THEN transaction.amount ELSE 0 END)',
                'totalIncome',
            )
            .addSelect(
                'SUM(CASE WHEN transaction.transactionMethod = :expenseType THEN transaction.amount ELSE 0 END)',
                'totalExpense',
            )
            .setParameters({
                incomeType: CategoryType.INCOME,
                expenseType: CategoryType.EXPENSE,
            })
            .where('user.uid = :uid', { uid })
            .andWhere('dashboard.did = :did', { did })

        if (fromDate !== 0 && toDate !== 0) {
            const startDate = moment.utc(fromDate).valueOf();
            const endDate = moment.utc(toDate).valueOf();
            summary.andWhere('transaction.createdAt BETWEEN :startDate AND :endDate', {
                startDate, endDate
            })
        }

        const result = await summary.getRawOne();

        const totalEarning = Number(result.totalIncome || 0);
        const totalExpense = Number(result.totalExpense || 0);

        return {
            totalEarning,
            totalExpense,
            balance: totalEarning - totalExpense,
        };
    }

    async validateTransaction(uid: string, i18n: I18nContext, transactionDto: TransactionDto) {
        if (!transactionDto.amount) {
            throw new BadRequestException(i18n.t('common.AMOUNT_REQUIRED'))
        }

        if (!transactionDto.cid) {
            throw new BadRequestException(i18n.t('common.CID_REQUIRED'))
        }

        await this.validateCategoryByTransactionType(uid, transactionDto, i18n);

        if (!transactionDto.did) {
            throw new BadRequestException(i18n.t('common.DID_REQUIRED'))
        }

        if (!transactionDto.paymentMethod) {
            throw new BadRequestException(i18n.t('common.METHOD_REQUIRED'))
        }

        if (!Object.values(PaymentMethod).includes(transactionDto.paymentMethod)) {
            throw new BadRequestException(i18n.t('common.INVALID_PAYMENT_METHOD'))
        }

        if (!transactionDto.transactionMethod) {
            throw new BadRequestException('common.TRANSACTION_METHOD_REQUIRED')
        }

        if (!Object.values(CategoryType).includes(transactionDto.transactionMethod)) {
            throw new BadRequestException(i18n.t('common.INVALID_TRANSACTION_METHOD'))
        }

        const dashboardList = await this.homeService.getUserDashboardByUid(uid);

        const dashboardExist = dashboardList?.find((dashboard) => {
            return dashboard.did === transactionDto.did
        })

        if (dashboardExist == null) {
            throw new BadRequestException(i18n.t('common.DASHBOARD_NOT_FOUND'))
        }
    }

    private async validateCategoryByTransactionType(
        uid: string,
        transactionDto: TransactionDto,
        i18n: I18nContext
    ) {

        let categoryExist = false;

        switch (transactionDto.transactionMethod) {

            case CategoryType.INCOME:

                const incomeCategory =
                    await this.categoryService.getAllIncomeCategoryByUid(uid);

                categoryExist = incomeCategory.some(
                    category => category.cid === transactionDto.cid
                );

                break;

            case CategoryType.EXPENSE:

                const expenseCategory =
                    await this.categoryService.getAllExpenseCategoryByUid(uid);

                categoryExist = expenseCategory.some(
                    category => category.cid === transactionDto.cid
                );

                break;

            default:
                throw new BadRequestException(
                    i18n.t('common.INVALID_TRANSACTION_METHOD')
                );
        }

        if (!categoryExist) {
            throw new BadRequestException(
                i18n.t('common.INVALID_CATEGORY_ID')
            );
        }
    }
}