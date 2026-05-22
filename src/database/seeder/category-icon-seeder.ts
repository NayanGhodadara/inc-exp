import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { CategoryIconEntity } from '../../api/option/category-icon.entity';
import { generateUniqueId } from '../../utils/app.utils';

export default class IncExpCategoriesIconSeeder implements Seeder {
    track: boolean = false;
    async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
        const iconRepo = dataSource.getRepository(CategoryIconEntity)

        const iconList = [
            {
                ciid: generateUniqueId("CI"),
                icon: "https://i.postimg.cc/NfQmwYQj/give-money-(1).png",
            },
            {
                ciid: generateUniqueId("CI"),
                icon: "https://i.postimg.cc/fytFzXcs/business.png",
            },
            {
                ciid: generateUniqueId("CI"),
                icon: "https://i.postimg.cc/fynFbyBq/referral-bonus.png",
            },
            {
                ciid: generateUniqueId("CI"),
                icon: "https://i.postimg.cc/DZgj764z/gas-station.png",
            },
            {
                ciid: generateUniqueId("CI"),
                icon: "https://i.postimg.cc/xC05pmpY/airplane-flight.png",
            },
        ]

        for (const iconData of iconList) {
            const existIcon = await iconRepo.findOne({
                where: [
                    { ciid: iconData.ciid },
                    { icon: iconData.icon }
                ]
            });
            if (!existIcon) {
                await iconRepo.save(iconData);
                console.log(`Added icon:${iconData.ciid}`);
            } else {
                console.log(`icon already available`);
            }
        }
    }
}