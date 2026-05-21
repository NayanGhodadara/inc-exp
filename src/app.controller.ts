import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { UserDto } from './user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('test')
  test() {

    console.log('TEST API');

    return 'WORKING';
  }

  @Post('user')
  async createUser(
    @Body() userDto: UserDto
  ) {
    console.log('STEP 1');

    const data = await this.appService.createUser(userDto);

    console.log('STEP 2');

    return {
      data
    };
  }
}
