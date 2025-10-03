import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const req: any = ctx.switchToHttp().getRequest();
    const { method, originalUrl } = req;
    const started = Date.now();
    return next.handle().pipe(
      tap(() => {
        const ms = Date.now() - started;
        this.logger.log(`${req.reqId} ${method} ${originalUrl} ${ms}ms user=${req.user?.sub ?? '-'}`);
      }),
    );
  }
}
