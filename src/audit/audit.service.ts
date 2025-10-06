import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit.entity';
import { appLogger } from 'src/common/logger';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly repo: Repository<AuditLog>,
  ) {}

  async log(entry: Partial<AuditLog>) {
    try {
      const audit = this.repo.create(entry);
      const saved = await this.repo.save(audit);

      appLogger.log({
        level: 'info',
        context: 'AuditService',
        message: `Audit event: ${audit.action ?? 'unknown'} on ${audit.entity ?? 'entity'}`,
        meta: {
          entity: audit.entity ?? null,
          action: audit.action ?? null,
          userId: audit.userId ?? null,
          entityId: audit.entityId ?? null,
          reqId: audit.reqId ?? null,
          createdAt: saved?.createdAt ?? new Date(),
        },
      });

      return saved;
    } catch (err: any) {
      appLogger.log({
        level: 'error',
        context: 'AuditService',
        message: 'Failed to save audit log',
        meta: { error: err?.message ?? String(err), entry },
      });
      return null;
    }
  }
}
