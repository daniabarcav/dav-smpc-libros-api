export declare class AuditLog {
    id: string;
    action: string;
    entity: string;
    entityId?: string;
    before?: any;
    after?: any;
    userId?: string;
    reqId?: string;
    createdAt: Date;
}
