import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const authMock = {
    validate: jest.fn(),
    sign: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authMock }],
    }).compile();

    controller = module.get(AuthController);
  });

  it('POST /auth/login -> devuelve access_token', async () => {
    const user = { id: 'u1', email: 'admin@demo.com' };
    authMock.validate.mockResolvedValue(user);
    authMock.sign.mockReturnValue('TOKEN');
    const res = await controller.login({ email: 'admin@demo.com', password: 'admin123' });
    expect(authMock.validate).toHaveBeenCalledWith('admin@demo.com', 'admin123');
    expect(res).toEqual({ access_token: 'TOKEN' });
  });
});
