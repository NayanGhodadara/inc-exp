import { TransactionService } from './../transaction/transaction.service';
import { AuthService } from './../auth/auth.service';
import { BadRequestException, ConflictException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { I18nContext } from "nestjs-i18n";
import { generateUniqueId } from "../../utils/app.utils";
import { DashboardEntity } from "./dahsboard/dashboard.entity";
import { DashboardDto } from "./dahsboard/dashboard.dto";
import moment from 'moment';

@Injectable()
export class HomeService {
    constructor(
        @InjectRepository(DashboardEntity)
        private dashboardRepo: Repository<DashboardEntity>,
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService,
        @Inject(forwardRef(() => TransactionService))
        private readonly transactionService: TransactionService,
    ) { }

    async getHomeDetails(uid: string, did: string, i18n: I18nContext) {
        const dashboardDetail = await this.dashboardRepo.findOne({
            where: {
                did: did,
                user: { uid: uid }
            }
        })

        const startDate = moment().startOf('month').valueOf();
        const endDate = moment().endOf('month').valueOf();

        const {
            data,
            total,
            income,
            expense,
            balance,
            startUtc,
            endUtc
        } = await this.transactionService.getAllTransaction(uid, 0, 5, dashboardDetail?.did || '', startDate, endDate)

        return {
            dashboard: {
                ...dashboardDetail,
            },
            transaction: data,
            wallet: {
                fromDate: startUtc,
                toDate: endUtc,
                totalEarning: income,
                totalExpense: expense,
                balance: balance
            },
        }
    }

    async createDashboard(uid: string, dashboardDto: DashboardDto, i18n: I18nContext) {
        if (!dashboardDto.name) {
            throw new BadRequestException(i18n.t('common.NAME_REQUIRED'))
        }

        const existingDashboard = await this.dashboardRepo.findOne({
            where: {
                name: dashboardDto.name,
                user: { uid: uid }
            }
        })

        if (existingDashboard) {
            throw new ConflictException(i18n.t('common.DASHBOARD_NAME_ALREADY_EXISTS'))
        }

        const dahsboardDetails = this.dashboardRepo.create({
            did: generateUniqueId("D"),
            name: dashboardDto.name,
            user: { uid: uid }
        })

        const savedDashboard = await this.dashboardRepo.save(dahsboardDetails)
        const dashboard = await this.dashboardRepo.findOne({
            where: { did: savedDashboard.did },
            relations: { user: true }
        })
        return dashboard
    }

    async getUserDashboardByUid(uid: string) {
        const dashboardList = await this.dashboardRepo.find({
            where: {
                user: { uid: uid }
            }
        });
        if (!dashboardList) return null;
        return dashboardList;
    }

    async getDashboardDetail(did: string) {
        const dashboardDetail = await this.dashboardRepo.findOne({
            where: {
                did: did
            }
        });
        return dashboardDetail;
    }

    async getAllDashboards(uid: string, skip: number, take: number) {
        let query = this.dashboardRepo.createQueryBuilder('dashboard')
            .leftJoin('dashboard.user', 'user')
            .where('user.uid = :uid', { uid });

        const [data, total] = await query
            .skip(skip)
            .take(take)
            .getManyAndCount();

        return { data, total };
    }

    async setDefaultDashboard(uid: string, did: string, i18n: I18nContext) {
        await this.authService.setDefaultDashboard(uid, did, i18n)
        const dashboard = await this.dashboardRepo.findOne({
            where: { did: did },
            relations: { user: true }
        })
        const homeDetail = await this.getHomeDetails(uid, dashboard?.did || '', i18n)
        return homeDetail
    }
}