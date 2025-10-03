import { LoggingInterceptor } from './logging.interceptor';
import { of } from 'rxjs';

function ctxMock() {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ method: 'GET', originalUrl: '/books', reqId: 'RID' }),
    }),
  } as any;
}

describe('LoggingInterceptor', () => {
  it('pasa y no rompe el flujo', (done) => {
    const interceptor = new LoggingInterceptor();
    const next = { handle: () => of({ ok: true }) };
    const obs$ = interceptor.intercept(ctxMock(), next as any);
    obs$.subscribe((val) => {
      expect(val).toEqual({ ok: true });
      done();
    });
  });
});
