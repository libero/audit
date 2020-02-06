import { v4 } from 'uuid';
import { Event } from '@libero/event-bus';
import { UserLoggedInPayload } from '@libero/event-types';
import { InfraLogger as logger } from '../logger';
import { AuditController } from '../domain/audit';
import { DtoAuditLog, AuditAction, UserId, ObjectId, AuditId } from '../domain/types';

export type EventHandler<T extends object> = (...args) => (ev: Event<T>) => Promise<boolean>;

export const UserLoggedInHandler = (auditDomain: AuditController) => async (
    event: Event<UserLoggedInPayload>,
): Promise<boolean> => {
    const auditItem: DtoAuditLog = {
        id: AuditId.fromUuid(v4()),
        userId: UserId.fromUuid(event.payload.userId),
        action: AuditAction.LOGGED_IN,
        value: event.payload.result,
        objectType: 'User',
        objectId: ObjectId.fromUuid(event.payload.userId),
        created: event.payload.timestamp,
        updated: event.payload.timestamp,
    };

    logger.info('userLoggedInReceived', event.payload);
    return await auditDomain.recordAudit(auditItem);
};
