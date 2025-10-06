import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { ModuleRef } from '@nestjs/core';
import { AuditService } from '../../audit/audit.service';
import { appLogger } from '../../common/logger';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private moduleRef: ModuleRef) {}

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const req: any = ctx.switchToHttp().getRequest();
    const method = String(req.method || '').toUpperCase();
    const action = ({ POST: 'create', PATCH: 'update', DELETE: 'delete' } as any)[method] ?? 'read';
    const entity = req.route?.path?.startsWith('/books') ? 'Book' : 'Unknown';
    const reqId = req.reqId;

    return next.handle().pipe(
      tap(async (result) => {
        try {
          const audit = this.moduleRef.get(AuditService, { strict: false });

          const payload = {
            action,
            entity,
            entityId: (result?.id ?? req.params?.id) || undefined,
            after: ['create', 'update', 'delete'].includes(action) ? result : undefined,
            userId: req.user?.sub,
            reqId,
          };
          await audit.log(payload);

          appLogger.log(
            `${action.toUpperCase()} ${entity} by user ${
              req.user?.sub || 'anonymous'
            }`,
            {
              context: 'AuditInterceptor',
              meta: payload,
            },
          );
        } catch (err: any) {
          appLogger.warn('Audit logging failed', {
            context: 'AuditInterceptor',
            error: err?.message,
            reqId,
          });
        }
      }),
    );
  }
}
