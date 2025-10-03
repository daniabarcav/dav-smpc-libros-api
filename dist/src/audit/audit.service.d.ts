import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit.entity';
export declare class AuditService {
    private repo;
    constructor(repo: Repository<AuditLog>);
    log(entry: Partial<AuditLog>): Promise<void>;
}
