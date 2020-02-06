import { v4 } from 'uuid';
import { Event } from '@libero/event-bus';
import { UserLoggedInHandler } from './index';
import { AuditController } from '../domain/audit';
import { UserLoggedInPayload, LiberoEventType } from '@libero/event-types';

jest.mock('../logger');

beforeEach(jest.resetAllMocks);

const recordAudit = jest.fn();
const controller = ({
    auditRepo: null,
    recordAudit,
} as unknown) as AuditController;

beforeEach(jest.resetAllMocks);

describe('UserLoggedInHandler', () => {
    it('records audit item', () => {
        const handler = UserLoggedInHandler(controller);
        const userId = v4();
        const timestamp = new Date();
        const event: Event<UserLoggedInPayload> = {
            id: 'event-started-id',
            created: new Date(),
            payload: {
                name: 'name',
                userId,
                email: 'email',
                timestamp,
                result: 'authorized',
            },
            context: {
                source: 'source',
            },
            eventType: LiberoEventType.userLoggedInIdentifier,
        };

        handler(event);

        expect(recordAudit.mock.calls).toHaveLength(1);
        expect(recordAudit.mock.calls[0]).toHaveLength(1);
        const auditItem = recordAudit.mock.calls[0][0];

        expect(recordAudit).toHaveBeenCalledTimes(1);

        expect(auditItem.userId).toBe(userId);
        expect(auditItem.action).toBe('LOGGED_IN');
        expect(auditItem.value).toBe('authorized');
        expect(auditItem.objectType).toBe('User');
        expect(auditItem.objectId).toBe(userId);
        expect(auditItem.created).toBe(timestamp);
        expect(auditItem.updated).toBe(timestamp);
    });
});
