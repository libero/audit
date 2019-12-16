export interface AuditLogItem {
    entity: string;
    action: string;
    object: string;
    result?: unknown;
    occurred: Date;
}

export interface AuditRepository {
    putLog(item: AuditLogItem): Promise<boolean>;
}
