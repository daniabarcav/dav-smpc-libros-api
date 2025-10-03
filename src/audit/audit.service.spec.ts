import { Test } from '@nestjs/testing';
import { AuditService } from './audit.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuditLog } from './entities/audit.entity';
import { Repository } from 'typeorm';

const repoMock = () => ({ save: jest.fn(), create: jest.fn((x) => x) });

describe('AuditService', () => {
  let service: AuditService;
  let repo: jest.Mocked<Repository<AuditLog>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuditService,
        { provide: getRepositoryToken(AuditLog), useFactory: repoMock },
      ],
    }).compile();
    service = module.get(AuditService);
    repo = module.get(getRepositoryToken(AuditLog));
  });

  it('log: guarda entrada de auditoría', async () => {
    repo.save.mockResolvedValue({ id: 'a1' } as any);
    await service.log({ action: 'create', entity: 'Book', entityId: '1' });
    expect(repo.create).toHaveBeenCalledWith({ action: 'create', entity: 'Book', entityId: '1' });
    expect(repo.save).toHaveBeenCalled();
  });
});
