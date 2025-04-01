import { DataSource } from "typeorm";
import { DbConfigService } from './config/db/config.service';
import { ConfigService } from '@nestjs/config';
import 'dotenv/config'
import { UserSubscriber } from "./modules/users/subscribers/user.subscribers";
import { join } from "path";

const entity = join(__dirname, '/**/*.entity{.ts,.js}')
const migration = join(__dirname, './migrations/**/*{.ts,.js}')


const configService = new ConfigService()
const dbconfigService = new DbConfigService(configService)

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: dbconfigService.dbhost,
    port: dbconfigService.dbport,
    username: dbconfigService.dbuser,
    password: dbconfigService.dbpassword,
    database: dbconfigService.dbname,
    synchronize: false,
    entities: [entity],
    migrations: [migration],
    subscribers: [UserSubscriber]
})