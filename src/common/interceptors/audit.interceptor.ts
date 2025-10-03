import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ModuleRef } from '@nestjs/core';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private moduleRef: ModuleRef) {}
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const req: any = ctx.switchToHttp().getRequest();
    const method = String(req.method || '').toUpperCase();
    const action = ({ POST:'create', PATCH:'update', DELETE:'delete' } as any)[method] ?? 'read';

    return next.handle().pipe(
      tap(async (result) => {
        try {
          const audit = this.moduleRef.get(AuditService, { strict: false });
          await audit.log({
            action,
            entity: req.route?.path?.startsWith('/books') ? 'Book' : 'Unknown',
            entityId: (result?.id ?? req.params?.id) || undefined,
            after: (action === 'create' || action === 'update' || action === 'delete') ? result : undefined,
            userId: req.user?.sub,
            reqId: req.reqId,
          });
        } catch {}
      }),
    );
  }
}
