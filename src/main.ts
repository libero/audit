// Startup the audit service
import { RabbitEventBus } from '@libero/event-bus';
import { InfraLogger as logger } from './logger';
import config from './config';
import App from './app';

const main = async (): Promise<void> => {
    logger.info('serviceInit');

    const app = new App(config, new RabbitEventBus({ url: `amqp://${config.event.url}` }));

    await app.startup();
};

main();
