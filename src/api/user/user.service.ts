import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
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
