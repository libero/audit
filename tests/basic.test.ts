import * as express from 'express';
import { MockEventBus } from '@libero/event-bus';
import { setupAuditEventBus, setupWebServer } from '../src/setup';
import { ConfigType } from '../src/config';

describe('basic', (): void => {
    it('starts', async (): Promise<void> => {
        const config: ConfigType = {
            port: 3004,
            event: {
                url: 'localhost'
            },
            knex: {
                client: 'pg',
                connection: {
                    host: 'localhost',
                    database: 'postgres',
                    user: 'postgres',
                    password: 'postgres',
                    port: 5432,
                },
            }
        };

        await setupAuditEventBus(new MockEventBus(), config.knex);
        const app = setupWebServer(express());

        app.listen(config.port).close();
    });
});