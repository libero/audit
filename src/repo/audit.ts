// Use knex to connect to a database and write stuff to the table
import { AuditRepository, DtoAuditLog } from '../domain/types';
import { InfraLogger as logger } from '../logger';
import * as Knex from 'knex';

export class KnexAuditRepository implements AuditRepository {
    public constructor(private readonly knex: Knex<{}, unknown[]>) {}

    public async putLog(item: DtoAuditLog): Promise<boolean> {
        await this.knex('audit').insert<DtoAuditLog>(item);
        logger.debug('auditWritten', item);
        return true;
    }

    public async exists(id: string): Promise<boolean> {
        const row = await this.knex('audit')
            .where('entity', id)
            .first();

        return Promise.resolve(row !== null);
    }
}
