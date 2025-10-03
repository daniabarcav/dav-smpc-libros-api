import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

const repoMock = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let repo: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useFactory: repoMock },
      ],
    }).compile();
    service = module.get(UsersService);
    repo = module.get(getRepositoryToken(User));
  });

  it('findByEmail', async () => {
    repo.findOne.mockResolvedValue({ id: '1', email: 'e@e.com' } as any);
    const u = await service.findByEmail('e@e.com');
    expect(repo.findOne).toHaveBeenCalledWith({ where: { email: 'e@e.com' } });
    expect(u?.email).toBe('e@e.com');
  });

  it('create', async () => {
    const dto = { email: 'e@e.com', password: 'hash' } as any;
    repo.create.mockReturnValue(dto);
    repo.save.mockResolvedValue({ id: '1', ...dto });
    const u = await service.create(dto);
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalled();
    expect(u.id).toBe('1');
  });
});
