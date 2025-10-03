import { of } from 'rxjs';
import { AuditInterceptor } from './audit.interceptor';
import { ModuleRef } from '@nestjs/core';

describe('AuditInterceptor', () => {
  it('loguea create en /books', (done) => {
    const auditLog = { log: jest.fn().mockResolvedValue(undefined) };
    const moduleRef = { get: jest.fn(() => auditLog) } as unknown as ModuleRef;
    const interceptor = new AuditInterceptor(moduleRef);

    const req: any = {
      method: 'POST',
      route: { path: '/books' },
      params: {},
      user: { sub: 'u1' },
      reqId: 'RID',
    };

    const ctx: any = { switchToHttp: () => ({ getRequest: () => req }) };
    const next = { handle: () => of({ id: 'b1' }) };

    interceptor.intercept(ctx, next as any).subscribe({
      next: () => {},
      complete: async () => {
        expect(moduleRef.get).toHaveBeenCalled();
        expect(auditLog.log).toHaveBeenCalledWith(expect.objectContaining({
          action: 'create',
          entity: 'Book',
          entityId: 'b1',
          userId: 'u1',
          reqId: 'RID',
        }));
        done();
      },
    });
  });
});
