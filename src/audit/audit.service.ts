import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit.entity';
import { appLogger } from 'src/common/logger';


@Injectable()
export class AuditService {
  constructor(@InjectRepository(AuditLog) private readonly repo: Repository<AuditLog>) {}

  async log(entry: Partial<AuditLog>) {
    try {
      const audit = this.repo.create(entry);
      const saved = await this.repo.save(audit);
      appLogger.log({
        level: 'info',
        context: 'AuditService',
        message: `Audit event: ${audit.action || 'unknown'} on ${audit.entity || 'entity'}`,
        meta: {
          entity: audit.entity,
          action: audit.action,
          userId: audit.userId,
          entityId: audit.entityId,
          reqId: audit.reqId,
          createdAt: saved.createdAt,
        },
      });

      return saved;
    } catch (err: any) {
      appLogger.error({
        context: 'AuditService',
        message: 'Failed to save audit log',
        meta: { error: err.message, entry },
      });
    }
  }
}
