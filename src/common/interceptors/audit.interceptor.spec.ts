import { of, lastValueFrom } from 'rxjs';
import { AuditInterceptor } from './audit.interceptor';
import { ModuleRef } from '@nestjs/core';
import type { CallHandler, ExecutionContext } from '@nestjs/common';


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

  function buildCtx(req: any): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => req,
        getResponse: () => ({}),
        getNext: () => ({}),
      }),
      getClass: () => ({} as any),
      getHandler: () => ({} as any),
      getArgs: () => [req],
      getType: () => 'http',
    } as unknown as ExecutionContext;
  }

  it('loguea create en /books', async () => {
    const req: any = {
      method: 'POST',
      route: { path: '/books' },
      params: {},
      user: { sub: 'u1' },
      reqId: 'RID',
    };

    const ctx = buildCtx(req);
    const next: CallHandler = { handle: () => of({ id: 'b1' }) };

    await lastValueFrom(interceptor.intercept(ctx, next));

    expect(moduleRef.get).toHaveBeenCalled();
    expect(auditLog.log).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'create',
        entity: 'Book',
        entityId: 'b1',
        userId: 'u1',
        reqId: 'RID',
      }),
    );
  });

  it('loguea update en /books/:id', async () => {
    const req: any = {
      method: 'PATCH',
      route: { path: '/books/:id' },
      params: { id: 'b1' },
      user: { sub: 'u1' },
      reqId: 'RID2',
    };

    const ctx = buildCtx(req);
    const next: CallHandler = { handle: () => of({ id: 'b1', title: 'Updated' }) };

    await lastValueFrom(interceptor.intercept(ctx, next));

    expect(auditLog.log).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'update',
        entity: 'Book',
        entityId: 'b1',
        userId: 'u1',
        reqId: 'RID2',
      }),
    );
  });

  it('loguea delete en /books/:id', async () => {
    const req: any = {
      method: 'DELETE',
      route: { path: '/books/:id' },
      params: { id: 'b1' },
      user: { sub: 'u1' },
      reqId: 'RID3',
    };

    const ctx = buildCtx(req);
    const next: CallHandler = { handle: () => of({ id: 'b1', deleted: true }) };

    await lastValueFrom(interceptor.intercept(ctx, next));

    expect(auditLog.log).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'delete',
        entity: 'Book',
        entityId: 'b1',
        userId: 'u1',
        reqId: 'RID3',
      }),
    );
  });

  it('loguea read en GET /books', async () => {
    const req: any = {
      method: 'GET',
      route: { path: '/books' },
      params: {},
      user: { sub: 'u1' },
      reqId: 'RID4',
    };

    const ctx: any = { switchToHttp: () => ({ getRequest: () => req }) };
    const next = { handle: () => of({ items: [] }) };

    await lastValueFrom(interceptor.intercept(ctx, next as any));

    expect(auditLog.log).toHaveBeenCalledTimes(1);
    expect(auditLog.log).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'read',
        entity: 'Book',
        entityId: undefined,
        userId: 'u1',
        reqId: 'RID4',
        after: undefined,
      }),
    );
  });


  it('maneja request sin usuario', async () => {
    const req: any = {
      method: 'POST',
      route: { path: '/books' },
      params: {},
      user: null,
      reqId: 'RID5',
    };

    const ctx = buildCtx(req);
    const next: CallHandler = { handle: () => of({ id: 'b1' }) };

    await lastValueFrom(interceptor.intercept(ctx, next));

    expect(auditLog.log).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'create',
        entity: 'Book',
        entityId: 'b1',
        userId: undefined,
        reqId: 'RID5',
      }),
    );
  });

  it('maneja request sin reqId', async () => {
    const req: any = {
      method: 'POST',
      route: { path: '/books' },
      params: {},
      user: { sub: 'u1' },
    };

    const ctx = buildCtx(req);
    const next: CallHandler = { handle: () => of({ id: 'b1' }) };

    await lastValueFrom(interceptor.intercept(ctx, next));

    expect(auditLog.log).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'create',
        entity: 'Book',
        entityId: 'b1',
        userId: 'u1',
      }),
    );
  });

  it('maneja respuesta sin id', async () => {
    const req: any = {
      method: 'POST',
      route: { path: '/books' },
      params: {},
      user: { sub: 'u1' },
      reqId: 'RID6',
    };

    const ctx = buildCtx(req);
    const next: CallHandler = { handle: () => of({ success: true }) }; 

    await lastValueFrom(interceptor.intercept(ctx, next));

    expect(auditLog.log).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'create',
        entity: 'Book',
        entityId: undefined,
        userId: 'u1',
        reqId: 'RID6',
      }),
    );
  });

  it('maneja rutas con múltiples parámetros', async () => {
    const req: any = {
      method: 'PATCH',
      route: { path: '/users/:userId/books/:id' },
      params: { id: 'b1', userId: 'u2' },
      user: { sub: 'u1' },
      reqId: 'RID7',
    };

    const ctx = buildCtx(req);
    const next: CallHandler = { handle: () => of({ id: 'b1' }) };

    await lastValueFrom(interceptor.intercept(ctx, next));

    expect(auditLog.log).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'update',
        entity: 'Unknown',    
        entityId: 'b1',
        userId: 'u1',
        reqId: 'RID7',
        after: { id: 'b1' },   
      }),
    );
  });

  it('loguea Unknown para rutas no relacionadas con entidades', async () => {
    const req: any = {
      method: 'POST',
      route: { path: '/auth/login' },
      params: {},
      user: { sub: 'u1' },
      reqId: 'RID8',
    };

    const ctx = buildCtx(req);
    const next: CallHandler = { handle: () => of({ token: 'abc' }) };

    await lastValueFrom(interceptor.intercept(ctx, next));

    expect(auditLog.log).toHaveBeenCalledTimes(1);
    expect(auditLog.log).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'create',
        entity: 'Unknown',
        entityId: undefined,
        userId: 'u1',
        reqId: 'RID8',
        after: { token: 'abc' },
      }),
    );
  });
});
