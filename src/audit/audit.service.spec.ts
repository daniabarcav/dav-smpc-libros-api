import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from './audit.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuditLog } from './entities/audit.entity';
import { Repository } from 'typeorm';
import { appLogger } from 'src/common/logger';

describe('AuditService', () => {
  let service: AuditService;
  let repo: Repository<AuditLog>;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        { provide: getRepositoryToken(AuditLog), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
    repo = module.get(getRepositoryToken(AuditLog));

    jest.spyOn(appLogger, 'info').mockImplementation(jest.fn());
    jest.spyOn(appLogger, 'error').mockImplementation(jest.fn());
  });

  it('debería crear y guardar un log correctamente', async () => {
    const entry = { action: 'create', entity: 'Book' } as Partial<AuditLog>;
    const saved = { ...entry, id: '1' };

    mockRepo.create.mockReturnValue(entry);
    mockRepo.save.mockResolvedValue(saved);

    const result = await service.log(entry);

    expect(mockRepo.create).toHaveBeenCalledWith(entry);
    expect(mockRepo.save).toHaveBeenCalledWith(entry);
    expect(appLogger.info).toHaveBeenCalled();
    expect(result).toEqual(saved);
  });

  it('debería registrar un error si la inserción falla', async () => {
    mockRepo.create.mockImplementation(() => { throw new Error('fail'); });
    await service.log({ action: 'delete', entity: 'Book' });
    expect(appLogger.error).toHaveBeenCalled();
  });
});
