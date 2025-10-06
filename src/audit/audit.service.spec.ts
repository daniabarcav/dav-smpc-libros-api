jest.mock('src/common/logger', () => ({
  appLogger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
    log: jest.fn(),
  },
}));

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
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        { provide: getRepositoryToken(AuditLog), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
    repo = module.get<Repository<AuditLog>>(getRepositoryToken(AuditLog));
  });

  it('debería crear y guardar un log correctamente', async () => {
    const entry: Partial<AuditLog> = { action: 'create', entity: 'Book' };
    const saved: AuditLog = { ...(entry as AuditLog), id: '1' } as AuditLog;

    mockRepo.create.mockReturnValue(entry);
    mockRepo.save.mockResolvedValue(saved);

    const result = await service.log(entry);

    expect(mockRepo.create).toHaveBeenCalledWith(entry);
    expect(mockRepo.save).toHaveBeenCalledWith(entry);

    const loggerCalls =
      (appLogger.info as jest.Mock).mock.calls.length +
      (appLogger.log as jest.Mock).mock.calls.length +
      (appLogger.warn as jest.Mock).mock.calls.length;

    expect(loggerCalls).toBeGreaterThan(0);
    expect(result).toEqual(saved);
  });

  it('debería registrar un error si la inserción falla', async () => {
    mockRepo.create.mockImplementation(() => {
      throw new Error('fail');
    });

    await service.log({ action: 'delete', entity: 'Book' });

    expect(appLogger.error).toHaveBeenCalled();
  });
});
