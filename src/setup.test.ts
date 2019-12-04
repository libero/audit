import { RabbitEventBus } from '@libero/event-bus';
import { InfraLogger } from './logger';
import { ConfigType } from 'config';
import { LiberoEventType } from '@libero/event-types';
import setup from './setup';

jest.mock('./logger', () => ({
    InfraLogger: {
        info: jest.fn(),
    },
}));
jest.mock('express', () => () => ({ use: jest.fn(), get: jest.fn() }));
jest.mock('@libero/event-bus', () => ({
    RabbitEventBus: jest.fn(),
}));
jest.mock('./domain/audit', () => ({
    AuditController: jest.fn(),
}));
jest.mock('./repo/audit', () => ({
    KnexAuditRepository: jest.fn(),
}));
jest.mock('knex');

describe('setup', (): void => {
    beforeEach(() => {
        (InfraLogger.info as jest.Mock).mockClear();
        (RabbitEventBus as jest.Mock).mockClear();
    });
    it('initiates a new EventBus instance with correct eventDefinitions and serviceName', async (): Promise<void> => {
        const mockEventBus = {
            init: jest.fn().mockReturnThis(),
            subscribe: jest.fn(),
        };
        (RabbitEventBus as jest.Mock).mockImplementationOnce(() => mockEventBus);
        await setup({ event: { url: '' } } as ConfigType);
        expect(RabbitEventBus).toBeCalled();
        expect(mockEventBus.init).toBeCalledWith([LiberoEventType.userLoggedInIdentifier], 'audit');
    });
    it('subscribes to the userLoggedInIdentifier message type', async (): Promise<void> => {
        const mockEventBus = {
            init: jest.fn().mockReturnThis(),
            subscribe: jest.fn(),
        };
        (RabbitEventBus as jest.Mock).mockImplementationOnce(() => mockEventBus);
        await setup({ event: { url: '' } } as ConfigType);
        expect(mockEventBus.subscribe).toBeCalledTimes(1);
        expect(mockEventBus.subscribe).toBeCalledWith(LiberoEventType.userLoggedInIdentifier, expect.any(Function));
    });

    it('logs that the service has started', async (): Promise<void> => {
        const mockEventBus = {
            init: jest.fn().mockReturnThis(),
            subscribe: jest.fn(),
        };
        (RabbitEventBus as jest.Mock).mockImplementationOnce(() => mockEventBus);
        await setup({ event: { url: '' } } as ConfigType);
        expect(InfraLogger.info).toBeCalledWith('Audit service started');
    });
});
