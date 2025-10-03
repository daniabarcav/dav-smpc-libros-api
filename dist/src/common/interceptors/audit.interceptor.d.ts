import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ModuleRef } from '@nestjs/core';
export declare class AuditInterceptor implements NestInterceptor {
    private moduleRef;
    constructor(moduleRef: ModuleRef);
    intercept(ctx: ExecutionContext, next: CallHandler): Observable<any>;
}
