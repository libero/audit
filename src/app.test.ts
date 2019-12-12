import { Express } from 'express';
import { EventBus } from '@libero/event-bus';
import { LiberoEventType } from '@libero/event-types';
import App from './app';
import { InfraLogger } from './logger';
import { ConfigType } from './config';

jest.mock('knex');
jest.mock('express', () => (): Express => (({
    use: jest.fn(),
    get: jest.fn(),
    listen: jest.fn().mockImplementation(() => ({
        on: jest.fn(),
        close: jest.fn().mockImplementation(() => Promise.resolve()),
    })),
} as unknown) as Express));
jest.mock('@libero/event-bus', () => ({
    RabbitEventBus: jest.fn(),
}));
jest.mock('./logger', () => ({
    InfraLogger: {
        info: jest.fn(),
    },
}));
jest.mock('./domain/audit', () => ({
    AuditController: jest.fn(),
}));
jest.mock('./repo/audit', () => ({
    KnexAuditRepository: jest.fn(),
}));
jest.mock('./handlers', () => ({
    UserLoggedInHandler: jest.fn().mockImplementation(() => 'logged_in_handler')
}));

describe('App', (): void => {
    let mockEventBus;
    let app;

    describe('startup', () => {
        beforeEach(() => {
            (InfraLogger.info as jest.Mock).mockClear();
            mockEventBus = {
                init: jest.fn().mockReturnThis(),
                subscribe: jest.fn(),
            } as unknown as EventBus;
        });

        // for some reason uncommenting this gives timeout
        // afterEach(async () => { await app.shutdown(); });

        it('initiates event bus instance with correct eventDefinitions and serviceName ', async (): Promise<void> => {
            app = new App({} as ConfigType, mockEventBus);

            await app.startup();

            expect(mockEventBus.init).toBeCalledWith([LiberoEventType.userLoggedInIdentifier], 'audit');
        });

        it('subscribes to the userLoggedInIdentifier message type', async (): Promise<void> => {
            app = new App({} as ConfigType, mockEventBus);

            await app.startup();

            expect(mockEventBus.subscribe).toBeCalledTimes(1);
            expect(mockEventBus.subscribe).toHaveBeenCalledWith(LiberoEventType.userLoggedInIdentifier, 'logged_in_handler');
        });

        it('logs that the service has started', async (): Promise<void> => {
            app = new App({} as ConfigType, mockEventBus);

            await app.startup();

            expect(InfraLogger.info).toBeCalledWith('Audit service started');
        });
    });
});