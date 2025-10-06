import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, getDataSourceToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { BooksService } from './books.service';
import { Book } from './entities/book.entity';
import { NotFoundException } from '@nestjs/common';

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

describe('BooksService', () => {
  let service: BooksService;
  let repo: Repository<Book>;

  const mockBook = {
    id: '1',
    title: 'Test Book',
    author: 'Test Author',
    publisher: 'Test Publisher',
    genre: 'Fiction',
    available: true,
    year: 2024,
    price: 20,
    coverurl: 'http://test.com/cover.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    softDelete: jest.fn(),
    restore: jest.fn(),
  };

  const managerMock = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const dataSourceMock: Partial<DataSource> = {
    transaction: jest.fn(async (cb: any) => cb(managerMock)),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        { provide: getRepositoryToken(Book), useValue: mockRepository },
        { provide: getDataSourceToken(), useValue: dataSourceMock },
        { provide: DataSource, useValue: dataSourceMock },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    repo = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a book', async () => {
      const dto = { title: 'New Book', author: 'Author', publisher: 'Publisher', genre: 'Fiction' };

      managerMock.create.mockReturnValue({ ...dto });
      managerMock.save.mockResolvedValue({ id: '1', ...dto });

      const result = await service.create(dto);

      expect(dataSourceMock.transaction).toHaveBeenCalled();
      expect(managerMock.create).toHaveBeenCalledWith(Book, dto);
      expect(managerMock.save).toHaveBeenCalledWith(Book, { ...dto });
      expect(result).toEqual({ id: '1', ...dto });
    });
  });

  describe('findAll', () => {
    it('should return paginated books without filters', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockBook], 1]);

      const result = await service.findAll();

      expect(result.items).toEqual([mockBook]);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should search books by query', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockBook], 1]);

      const result = await service.findAll({ q: 'Test', page: 1, limit: 5 });

      expect(result.items).toEqual([mockBook]);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(5);
    });

    it('should filter by genre', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockBook], 1]);

      const result = await service.findAll({ genre: 'Fiction' });

      expect(result.items).toEqual([mockBook]);
    });

    it('should filter by publisher', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockBook], 1]);

      const result = await service.findAll({ publisher: 'Test Publisher' });

      expect(result.items).toEqual([mockBook]);
    });

    it('should filter by author', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockBook], 1]);

      const result = await service.findAll({ author: 'Test Author' });

      expect(result.items).toEqual([mockBook]);
    });

    it('should filter by available', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockBook], 1]);

      const result = await service.findAll({ available: 'true' });

      expect(result.items).toEqual([mockBook]);
    });

    it('should include deleted records', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockBook], 1]);

      const result = await service.findAll({ includeDeleted: true });

      expect(result.items).toEqual([mockBook]);
    });

    it('should sort by field', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockBook], 1]);

      const result = await service.findAll({ sort: 'title:ASC' });

      expect(result.items).toEqual([mockBook]);
    });

    it('should use default sort when no sort provided', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockBook], 1]);

      const result = await service.findAll({});

      expect(result.items).toEqual([mockBook]);
    });

    it('should search with multiple filters', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockBook], 1]);

      const result = await service.findAll({
        q: 'Test',
        genre: 'Fiction',
        publisher: 'Test Publisher',
        author: 'Test Author',
        available: 'true',
      });

      expect(result.items).toEqual([mockBook]);
    });
  });

  describe('findOne', () => {
    it('should return a book by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockBook);

      const result = await service.findOne('1');

      expect(result).toEqual(mockBook);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundException when book not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      const dto = { title: 'Updated Book' };
      managerMock.findOne.mockResolvedValue({ ...mockBook });
      managerMock.save.mockResolvedValue({ ...mockBook, ...dto });

      const result = await service.update('1', dto);

      expect(dataSourceMock.transaction).toHaveBeenCalled();
      expect(managerMock.findOne).toHaveBeenCalledWith(Book, { where: { id: '1' } });
      expect(result.title).toBe('Updated Book');
    });

    it('should throw NotFoundException when updating non-existent book', async () => {
      managerMock.findOne.mockResolvedValue(null);

      await expect(service.update('999', {} as any)).rejects.toThrow(NotFoundException);
      expect(dataSourceMock.transaction).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should soft delete a book', async () => {
      mockRepository.findOne.mockResolvedValue(mockBook);
      mockRepository.softDelete.mockResolvedValue({ affected: 1 } as any);

      const result = await service.remove('1');

      expect(result).toEqual({ id: '1', deleted: true });
      expect(mockRepository.softDelete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when deleting non-existent book', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('restore', () => {
    it('should restore a deleted book', async () => {
      mockRepository.restore.mockResolvedValue({ affected: 1 } as any);
      mockRepository.findOne.mockResolvedValue(mockBook);

      const result = await service.restore('1');

      expect(result).toEqual(mockBook);
      expect(mockRepository.restore).toHaveBeenCalledWith('1');
    });
  });
});
