import { AuditRepository, DtoAuditLog } from './types';

export class AuditController {
    public constructor(private readonly auditRepo: AuditRepository) {}

    public async recordAudit(item: DtoAuditLog): Promise<boolean> {
        return this.auditRepo.putLog(item);
    }
}
