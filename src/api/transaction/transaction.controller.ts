import { da } from 'make-plural/cardinals';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from "@nestjs/common";
import { LoginDto } from '../auth/dto/login.dto';
import { AuthGuard } from '../../guard/auth.guard';
import { TransactionDto } from './transaction.dto';
import { CategoryType, DEFAULT_COUNT, DEFAULT_LIMIT, PaymentMethod } from '../../constants/app.constants';
import { I18n, I18nContext } from 'nestjs-i18n';
import { DeviceContext } from '../../middleware/user.middleware';
import { UserDto } from '../user/dto/user.dto';

@Controller()
export class TransactionController {

    constructor(
        private readonly transactionService: TransactionService
    ) { }


    @Post('transaction')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({
        summary: 'Add new income and expense transaction',
        description: `
    Payment Method: ${Object.values(PaymentMethod).join(' , ')}
    Transaction Method: ${Object.values(CategoryType).join(' , ')}
    `
    })
    @ApiBody({ type: TransactionDto })
    async createTransaction(
        @DeviceContext() user: UserDto,
        @I18n() i18n: I18nContext,
        @Body() body: TransactionDto
    ) {
        const data = await this.transactionService.createTransaction(user, i18n, body)
        return {
            statusCode: 201,
            message: i18n.t('common.SUCCESS'),
            data: data
        }
    }

    @Get('transaction')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Get all auth user categories' })
    @ApiQuery({ name: 'count', required: false, type: 'number' })
    @ApiQuery({ name: 'limit', required: false, type: 'number' })
    @ApiQuery({ name: 'fromDate', type: 'number', required: false })
    @ApiQuery({ name: 'toDate', type: 'number', required: false })
    @ApiQuery({ name: 'did', type: 'string', example: 'D123df3e0230023', required: true })
    async getAllCategory(
        @I18n() i18n: I18nContext,
        @DeviceContext() user: UserDto,
        @Query('count', new DefaultValuePipe(DEFAULT_COUNT), ParseIntPipe) count: number,
        @Query('limit', new DefaultValuePipe(DEFAULT_LIMIT), ParseIntPipe) limit: number,
        @Query('fromDate', new DefaultValuePipe(0), ParseIntPipe) fromDate: number,
        @Query('toDate', new DefaultValuePipe(0), ParseIntPipe) toDate: number,
        @Query('did') did: string
    ) {
        const { data, total, income, expense, balance, startUtc, endUtc } = await this.transactionService.getAllTransaction(user.uid, count, limit, did, fromDate, toDate)

        return {
            statusCode: 200,
            message: i18n.t('common.SUCCESS'),
            data: {
                transaction: data,
                wallet: {
                    fromDate: startUtc,
                    toDate: endUtc,
                    totalEarning: income,
                    totalExpense: expense,
                    balance: balance
                },
            },
            meta: {
                "totalItems": total,
                "itemPerPage": limit,
                "totalPage": Math.ceil(total / (limit)),
                "currentCount": (count) + Number(data.length),
            }
        }
    }

    @Delete('transaction/:tid')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({
        summary: 'Delete transaction'
    })
    @ApiParam({ name: 'tid', type: 'string', example: 'T123df3e0230023', required: true })
    async deleteTransaction(
        @DeviceContext() user: UserDto,
        @I18n() i18n: I18nContext,
        @Param('tid') tid: string
    ) {
        const data = await this.transactionService.deleteTransaction(user, tid, i18n)
        return {
            statusCode: 201,
            message: i18n.t('common.SUCCESS'),
            data: data
        }
    }
}