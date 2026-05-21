import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './user.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(UserEntity)
    private repo: Repository<UserEntity>
  ) {

  }
  async createUser(userDto: UserDto) {
    await this.repo.save(userDto)
    return null;
  }
}
