import { uuidType } from 'typesafe-uuid';

export class AuditId extends uuidType<'AuditId'>() {}
export class UserId extends uuidType<'UserId'>() {}
export class ObjectId extends uuidType<'ObjectId'>() {}

export enum AuditAction {
    CREATED = 'CREATED',
    UPDATED = 'UPDATED',
    DELETED = 'DELETED',
    LOGGED_IN = 'LOGGED_IN',
    MECA_RESULT = 'MECA_RESULT',
}

// The way to read this log entry is like this:
// This <userId> performed this <action> with these <value>(s) on this <objectId>

export interface DtoAuditLog {
    id: AuditId;
    created: Date;
    userId: UserId;
    objectId: ObjectId;
    objectType: string;
    updated: Date;
    value: string;
    action: AuditAction;
}

export interface AuditRepository {
    putLog(item: DtoAuditLog): Promise<boolean>;
}
