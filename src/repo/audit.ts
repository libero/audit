/* eslint-disable @typescript-eslint/camelcase */
// Use knex to connect to a database and write stuff to the table
import { AuditRepository, DtoAuditLog } from '../domain/types';
import { InfraLogger as logger } from '../logger';
import * as Knex from 'knex';

export class KnexAuditRepository implements AuditRepository {
    public constructor(private readonly knex: Knex<{}, unknown[]>) {}

    public async putLog(item: DtoAuditLog): Promise<boolean> {
        const record = {
            id: item.id,
            created: item.created,
            user_id: item.userId,
            object_id: item.objectId,
            object_type: item.objectType,
            updated: item.updated,
            value: item.value,
            action: item.action,
        };
        await this.knex('audit_log').insert<DtoAuditLog>(record);
        logger.debug('auditWritten', item);
        return true;
    }

    public async exists(id: string): Promise<boolean> {
        const row = await this.knex('audit_log')
            .where('entity', id)
            .first();

        return Promise.resolve(row !== null);
    }
}
