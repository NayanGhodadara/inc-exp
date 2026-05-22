import { da } from './../../../node_modules/make-plural/cardinals.d';
import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { DashboardDto } from './dahsboard/dashboard.dto';
import { DashboardEntity } from './dahsboard/dashboard.entity';
import { generateUniqueId } from '../../utils/app.utils';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,

    @InjectRepository(DashboardEntity)
    private dashboardRepo: Repository<DashboardEntity>
  ) {

  }

  /**
   * Dashboard
   * **/
  async createDashboard(uid: string, dashboardDto: DashboardDto, i18n: I18nContext) {
    if (!dashboardDto.name) {
      throw new BadRequestException(i18n.t('common.NAME_REQUIRED'))
    }

    const existingDashboard = await this.dashboardRepo.findOne({
      where: { name: dashboardDto.name }
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


  async getUserByUid(uid: string) {
    const user = await this.userRepo.findOne({
      where: {
        uid: uid
      }
    });
    if (!user) return null;
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepo.findOne({
      where: {
        email: email
      }
    });
    if (!user) return null;
    return user;
  }
}
