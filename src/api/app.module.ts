import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { databaseSourceOption } from '../database/database-source';
import { AuthModule } from './auth/auth.module';
import { HeaderResolver, I18nJsonLoader, I18nModule } from 'nestjs-i18n';
import { join } from 'path';
import { TokenModule } from './auth/token/token.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { OptionModule } from './option/option.module';
import { TransactionModule } from './transaction/transaction.module';
import { RedisModule } from './auth/redis/redis.module';
import { HomeModule } from './home/home.module';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      cache: true,
    }),
    TypeOrmModule.forRoot(databaseSourceOption),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loader: I18nJsonLoader,
      loaderOptions: {
        path: join(process.cwd(), 'src/i18n'),
        watch: true,
      },
      typesOutputPath: join(
        process.cwd(),
        'src/generated/i18n.generated.ts',
      ),
      resolvers: [
        {
          use: HeaderResolver,
          options: ['accept-language'],
        },
      ],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    RedisModule,
    TokenModule,
    HomeModule,
    UserModule,
    CategoryModule,
    OptionModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
