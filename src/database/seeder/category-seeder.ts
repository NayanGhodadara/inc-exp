import { da } from 'make-plural/cardinals';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { generateUniqueId } from '../../utils/app.utils';
import { ExpenseCategoryEntity, IncomeCategoryEntity } from '../../api/category/category.entity';
import { CategoryIconEntity } from '../../api/option/category-icon.entity';

export default class IncExpCategoriesSeeder implements Seeder {
    track: boolean = false;
    async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
        const iconRepo = dataSource.getRepository(CategoryIconEntity)
        const incomeRepo = dataSource.getRepository(IncomeCategoryEntity)
        const expenseRepo = dataSource.getRepository(ExpenseCategoryEntity)

        const incomeCategories = [
            {
                cid: generateUniqueId("C"),
                title: "Allowance",
                icon: { ciid: "CIf49dad221779453143" }
            },
            {
                cid: generateUniqueId("C"),
                title: "Bonus",
                icon: { ciid: "CI9bada4841779453143" }
            },
            {
                cid: generateUniqueId("C"),
                title: "Business",
                icon: { ciid: "CIb0b77a7d1779453143" }
            },
        ]

        const expenseCategories = [
            {
                cid: generateUniqueId("C"),
                title: "Air ticket",
                icon: { ciid: "CI2c963bfe1779453862" }
            },
            {
                cid: generateUniqueId("C"),
                title: "Petrol",
                icon: { ciid: "CI4e331ad21779453862" }
            }
        ]

        for (const income of incomeCategories) {
            const exist = await incomeRepo.findOne({
                where: [
                    { cid: income.cid },
                    { title: income.title }
                ]
            });
            if (!exist) {

                const isIconExist = await iconRepo.findOne(
                    {
                        where: { ciid: income.icon.ciid }
                    }
                )
                if (isIconExist !== null) {
                    await incomeRepo.save(income);
                    console.log(`Added category : ${income.title}`);
                } else {
                    console.log(`Icon not found : ${income.icon.ciid}`);
                }
            } else {
                console.log(`category ${income.title} already available`);
            }
        }

        for (const expense of expenseCategories) {
            const exist = await expenseRepo.findOne({
                where: [
                    { cid: expense.cid },
                    { title: expense.title }
                ]
            });
            if (!exist) {
                const isIconExist = await iconRepo.findOne(
                    {
                        where: { ciid: expense.icon.ciid }
                    }
                )

                if (isIconExist != null) {
                    await expenseRepo.save(expense);
                    console.log(`Added category : ${expense.title}`);
                } else {
                    console.log(`Icon not found : ${expense.icon.ciid}`);
                }
            } else {
                console.log(`category ${expense.title} already available`);
            }
        }
    }
}