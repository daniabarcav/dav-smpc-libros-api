import { of } from 'rxjs';
import { AuditInterceptor } from './audit.interceptor';
import { ModuleRef } from '@nestjs/core';

describe('AuditInterceptor', () => {
  let auditLog: any;
  let moduleRef: ModuleRef;
  let interceptor: AuditInterceptor;

  beforeEach(() => {
    auditLog = { log: jest.fn().mockResolvedValue(undefined) };
    moduleRef = { get: jest.fn(() => auditLog) } as unknown as ModuleRef;
    interceptor = new AuditInterceptor(moduleRef);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('loguea create en /books', (done) => {
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

  it('loguea update en /books/:id', (done) => {
    const req: any = {
      method: 'PATCH',
      route: { path: '/books/:id' },
      params: { id: 'b1' },
      user: { sub: 'u1' },
      reqId: 'RID2',
    };

    const ctx: any = { switchToHttp: () => ({ getRequest: () => req }) };
    const next = { handle: () => of({ id: 'b1', title: 'Updated' }) };

    interceptor.intercept(ctx, next as any).subscribe({
      next: () => {},
      complete: async () => {
        expect(auditLog.log).toHaveBeenCalledWith(expect.objectContaining({
          action: 'update',
          entity: 'Book',
          entityId: 'b1',
          userId: 'u1',
          reqId: 'RID2',
        }));
        done();
      },
    });
  });

  it('loguea delete en /books/:id', (done) => {
    const req: any = {
      method: 'DELETE',
      route: { path: '/books/:id' },
      params: { id: 'b1' },
      user: { sub: 'u1' },
      reqId: 'RID3',
    };

    const ctx: any = { switchToHttp: () => ({ getRequest: () => req }) };
    const next = { handle: () => of({ id: 'b1', deleted: true }) };

    interceptor.intercept(ctx, next as any).subscribe({
      next: () => {},
      complete: async () => {
        expect(auditLog.log).toHaveBeenCalledWith(expect.objectContaining({
          action: 'delete',
          entity: 'Book',
          entityId: 'b1',
          userId: 'u1',
          reqId: 'RID3',
        }));
        done();
      },
    });
  });

  it('no loguea GET requests', (done) => {
    const req: any = {
      method: 'GET',
      route: { path: '/books' },
      params: {},
      user: { sub: 'u1' },
      reqId: 'RID4',
    };

    const ctx: any = { switchToHttp: () => ({ getRequest: () => req }) };
    const next = { handle: () => of({ items: [] }) };

    interceptor.intercept(ctx, next as any).subscribe({
      next: () => {},
      complete: async () => {
        expect(auditLog.log).not.toHaveBeenCalled();
        done();
      },
    });
  });

  it('maneja request sin usuario', (done) => {
    const req: any = {
      method: 'POST',
      route: { path: '/books' },
      params: {},
      user: null,
      reqId: 'RID5',
    };

    const ctx: any = { switchToHttp: () => ({ getRequest: () => req }) };
    const next = { handle: () => of({ id: 'b1' }) };

    interceptor.intercept(ctx, next as any).subscribe({
      next: () => {},
      complete: async () => {
        expect(auditLog.log).toHaveBeenCalledWith(expect.objectContaining({
          action: 'create',
          entity: 'Book',
          entityId: 'b1',
          userId: null,
          reqId: 'RID5',
        }));
        done();
      },
    });
  });

  it('maneja request sin reqId', (done) => {
    const req: any = {
      method: 'POST',
      route: { path: '/books' },
      params: {},
      user: { sub: 'u1' },
      // Sin reqId
    };

    const ctx: any = { switchToHttp: () => ({ getRequest: () => req }) };
    const next = { handle: () => of({ id: 'b1' }) };

    interceptor.intercept(ctx, next as any).subscribe({
      next: () => {},
      complete: async () => {
        expect(auditLog.log).toHaveBeenCalledWith(expect.objectContaining({
          action: 'create',
          entity: 'Book',
          entityId: 'b1',
          userId: 'u1',
        }));
        done();
      },
    });
  });

  it('maneja respuesta sin id', (done) => {
    const req: any = {
      method: 'POST',
      route: { path: '/books' },
      params: {},
      user: { sub: 'u1' },
      reqId: 'RID6',
    };

    const ctx: any = { switchToHttp: () => ({ getRequest: () => req }) };
    const next = { handle: () => of({ success: true }) }; // Sin id

    interceptor.intercept(ctx, next as any).subscribe({
      next: () => {},
      complete: async () => {
        expect(auditLog.log).toHaveBeenCalledWith(expect.objectContaining({
          action: 'create',
          entity: 'Book',
          entityId: undefined,
          userId: 'u1',
          reqId: 'RID6',
        }));
        done();
      },
    });
  });

  it('maneja rutas con múltiples parámetros', (done) => {
    const req: any = {
      method: 'PATCH',
      route: { path: '/users/:userId/books/:id' },
      params: { id: 'b1', userId: 'u2' },
      user: { sub: 'u1' },
      reqId: 'RID7',
    };

    const ctx: any = { switchToHttp: () => ({ getRequest: () => req }) };
    const next = { handle: () => of({ id: 'b1' }) };

    interceptor.intercept(ctx, next as any).subscribe({
      next: () => {},
      complete: async () => {
        expect(auditLog.log).toHaveBeenCalledWith(expect.objectContaining({
          action: 'update',
          entity: 'Book',
          entityId: 'b1',
          userId: 'u1',
          reqId: 'RID7',
        }));
        done();
      },
    });
  });

  it('no loguea para rutas no relacionadas con entidades', (done) => {
    const req: any = {
      method: 'POST',
      route: { path: '/auth/login' },
      params: {},
      user: { sub: 'u1' },
      reqId: 'RID8',
    };

    const ctx: any = { switchToHttp: () => ({ getRequest: () => req }) };
    const next = { handle: () => of({ token: 'abc' }) };

    interceptor.intercept(ctx, next as any).subscribe({
      next: () => {},
      complete: async () => {
        done();
      },
    });
  });
});