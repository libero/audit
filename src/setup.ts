// Startup the audit service
import { InfraLogger as logger } from './logger';
import { Config as KnexConfig } from 'knex';
import { Express, Request, Response } from 'express';
import { EventBus } from '@libero/event-bus';
import { UserLoggedInHandler } from './handlers';
import { HealthCheck } from './endpoints';
import { UserLoggedInPayload, LiberoEventType } from '@libero/event-types';
import { AuditController } from './domain/audit';
import { KnexAuditRepository } from './repo/audit';
import { InfraLogger as Logger } from './logger';

import * as Knex from 'knex';

export const setupAuditEventBus = async (freshEventBus: EventBus, knexConfig: KnexConfig): Promise<EventBus> => {
    const auditController = new AuditController(new KnexAuditRepository(Knex(knexConfig)));
    const eventBus = await freshEventBus.init([LiberoEventType.userLoggedInIdentifier], 'audit');

    // setup subscribers
    eventBus.subscribe<UserLoggedInPayload>(
        LiberoEventType.userLoggedInIdentifier,
        UserLoggedInHandler(auditController),
    );

    Logger.info('Audit service started');

    return eventBus;
};

export const setupWebServer = (server: Express): Express => {
    server.use('/', (req: Request, _res: Response, next: () => void) => {
        logger.info(`${req.method} ${req.path}`, {});
        next();
    });

    server.get('/health', HealthCheck());

    return server;
};
