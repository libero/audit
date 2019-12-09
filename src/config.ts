import { Config as KnexConfig } from 'knex';
import { EventConfig } from '@libero/event-bus';
import { readFileSync } from 'fs';

interface Config {
    port: number;
    rabbitmq_url: string;
    database: {
        host: string;
        port: number;
        database: string;
        username: string;
        password: string;
    };
}

const configPath = process.env.CONFIG_PATH ? process.env.CONFIG_PATH : '/etc/reviewer/config.json';
const config: Config = JSON.parse(readFileSync(configPath, 'utf8'));

const knexConfig: KnexConfig = {
    client: 'pg',
    // In production we should use postgres pools.
    connection: {
        host: config.database.host,
        database: config.database.database,
        user: config.database.username,
        password: config.database.password,
        port: config.database.port,
    },
};

const eventConfig: EventConfig = {
    url: config.rabbitmq_url,
};

export type ConfigType = {
    port: number;
    knex: KnexConfig;
    event: EventConfig;
};

export const serviceConfig: ConfigType = {
    port: Number(config.port) || 3004,
    knex: knexConfig,
    event: eventConfig,
};

export default serviceConfig;
