import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit.entity';
export declare class AuditService {
    private readonly repo;
    constructor(repo: Repository<AuditLog>);
    log(entry: Partial<AuditLog>): Promise<AuditLog | null>;
}
