// Startup the audit service
import * as express from 'express';
import { RabbitEventBus } from '@libero/event-bus';
import { InfraLogger as logger } from './logger';
import { setupAuditEventBus, setupWebServer } from './setup';
import config from './config';

const main = async (): Promise<void> => {
    logger.info('serviceInit');
    await setupAuditEventBus(new RabbitEventBus({ url: `amqp://${config.event.url}` }), config.knex);

    const app = setupWebServer(express());

    app.listen(config.port, () => {
        logger.info(`Audit service listening on port ${config.port}`);
    });
};

main();
