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

export type ConfigType = {
    port: number;
    knex: KnexConfig;
    event: EventConfig;
};

export const serviceConfig = (): ConfigType => {
    const configPath = process.env.CONFIG_PATH ? process.env.CONFIG_PATH : '/etc/reviewer/config.json';
    const config: Config = JSON.parse(readFileSync(configPath, 'utf8'));

    const eventConfig: EventConfig = {
        url: config.rabbitmq_url,
    };
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

    return {
        port: Number(config.port) || 3004,
        knex: knexConfig,
        event: eventConfig,
    };
};

export default serviceConfig;
