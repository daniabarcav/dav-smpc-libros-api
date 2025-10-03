import { Test } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  const usersMock = { findByEmail: jest.fn() };
  const jwtMock = { sign: jest.fn() };

  beforeEach(async () => {
    jest.resetAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersMock },
        { provide: JwtService, useValue: jwtMock },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('validate: credenciales válidas', async () => {
    const user = { id: 'u1', email: 'admin@demo.com', password: '$2b$10$hash' };
    usersMock.findByEmail.mockResolvedValue(user);
    // simulamos que bcrypt.compare devuelve true
    jest.spyOn(require('bcrypt'), 'compare').mockResolvedValue(true as any);

    const res = await service.validate('admin@demo.com', 'admin123');
    expect(res).toEqual(user);
  });

  it('validate: credenciales inválidas', async () => {
    usersMock.findByEmail.mockResolvedValue(null);
    await expect(service.validate('x@x.com', 'bad')).rejects.toThrow('Credenciales inválidas');
  });

  it('sign: retorna token', () => {
    jwtMock.sign.mockReturnValue('TOKEN');
    const token = service.sign({ id: 'u1', email: 'a@b.c' } as any);
    expect(token).toBe('TOKEN');
  });
});
