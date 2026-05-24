import { runSeeders } from "typeorm-extension";
import { dataSource } from "../database-source";
import IncExpCategoriesIconSeeder from "./category-icon-seeder";
import IncExpCategoriesSeeder from "./category-seeder";

export const runSeed = async () => {
    if (process.env.RUN_SEED !== 'true') {
        return;
    }
    console.log('🌱 Running seeds...');

    await dataSource.initialize()

    await runSeeders(dataSource, {
        seeds: [
            IncExpCategoriesIconSeeder,
            //IncExpCategoriesSeeder
        ]
    });
    console.log('✅ Seeding completed');
}

runSeed();