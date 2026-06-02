import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { TokenService } from '../auth/token/token.service';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    private readonly tokenService: TokenService
  ) {

  }

  async getUserByUid(uid: string) {
    const user = await this.userRepo.findOne({
      where: {
        uid: uid
      },
      relations: ['defaultDashboard'],
    });
    const userDetail = { ...user }
    if (!userDetail) return null;
    return userDetail;
  }
  async deleteUser(uid: string, token: string, i18n: I18nContext) {
    const user = await this.userRepo.findOne({
      where: {
        uid: uid
      }
    });
    if (!user) return null;
    await this.userRepo.delete({ uid: uid })
    await this.tokenService.blockToken(token, i18n);
    return null;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepo.findOne({
      where: {
        email: email
      },
      relations: ['defaultDashboard'],
    });
    if (!user) return null;
    return user;
  }
}
