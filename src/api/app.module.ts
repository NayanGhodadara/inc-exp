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
    AuthModule,
    TokenModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
