import * as Knex from 'knex';
import * as express from 'express';
import { Server } from 'http';
import { Request, Response, Express } from 'express';
import { EventBus } from '@libero/event-bus';
import { UserLoggedInPayload, LiberoEventType } from '@libero/event-types';
import { InfraLogger as Logger } from './logger';
import { ConfigType } from './config';
import { AuditRepository } from './domain/types';
import { KnexAuditRepository } from './repo/audit';
import { AuditController } from './domain/audit';
import { UserLoggedInHandler } from './handlers';
import { HealthCheck } from './endpoints';

class App {
    private auditRepository: AuditRepository;

    private expressApp: Express;

    private expressServer: Server;

    private knex: Knex<any, unknown[]>;

    public constructor(readonly config: ConfigType, readonly eventBus: EventBus) {}

    public async startup() {
        this.knex = Knex(this.config.knex);
        this.auditRepository = new KnexAuditRepository(this.knex);

        const auditController = new AuditController(this.auditRepository);
        await this.eventBus.init([LiberoEventType.userLoggedInIdentifier], 'audit');

        this.eventBus.subscribe<UserLoggedInPayload>(
            LiberoEventType.userLoggedInIdentifier,
            UserLoggedInHandler(auditController),
        );

        this.expressApp = express();

        this.expressApp.use('/', (req: Request, _res: Response, next: () => void) => {
            Logger.info(`${req.method} ${req.path}`, {});
            next();
        });

        this.expressApp.get('/health', HealthCheck());

        this.expressServer = this.expressApp.listen(this.config.port, () => {
            Logger.info(`Audit service listening on port ${this.config.port}`);
        });

        this.expressServer.on('close', async () => {
            await this.knex.destroy();
        });

        Logger.info('Audit service started');
    }

    public async shutdown(): Promise<void> {
        return new Promise(resolve => this.expressServer.close(() => resolve()));
    }

    public getKnex() {
        return this.knex;
    }
}

export default App;
