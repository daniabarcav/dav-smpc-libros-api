import { AllExceptionsFilter } from './http-exception.filter';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

function createHostMock() {
  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  const res = { status };
  const req = { originalUrl: '/path', reqId: 'RID' };
  const ctx = {
    switchToHttp: () => ({ getResponse: () => res, getRequest: () => req }),
  } as unknown as ArgumentsHost;
  return { ctx, res, status, json };
}

describe('AllExceptionsFilter', () => {
  it('HttpException', () => {
    const { ctx, status, json } = createHostMock();
    const filter = new AllExceptionsFilter();
    filter.catch(new HttpException('Bad', HttpStatus.BAD_REQUEST), ctx);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      path: '/path',
      reqId: 'RID',
      statusCode: 400,
      error: 'Bad',
    }));
  });

  it('Error genérico → 500', () => {
    const { ctx, status, json } = createHostMock();
    const filter = new AllExceptionsFilter();
    filter.catch(new Error('boom'), ctx);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      statusCode: 500,
    }));
  });
});
