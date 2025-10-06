import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { Response } from 'express';

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  const mockBooksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    restore: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a book', async () => {
      const dto = { title: 'Test', author: 'Author', publisher: 'Publisher', genre: 'Fiction' };
      mockBooksService.create.mockResolvedValue({ id: '1', ...dto });

      const result = await controller.create(dto);

      expect(result).toHaveProperty('id');
      expect(mockBooksService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return paginated books', async () => {
      mockBooksService.findAll.mockResolvedValue({
        items: [],
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      });

      const result = await controller.findAll({ page: '1', limit: '10' });

      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should handle query parameters', async () => {
      mockBooksService.findAll.mockResolvedValue({
        items: [],
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      });

      await controller.findAll({ q: 'test', genre: 'Fiction', page: '2', limit: '20' });

      expect(mockBooksService.findAll).toHaveBeenCalledWith({
        q: 'test',
        genre: 'Fiction',
        publisher: undefined,
        author: undefined,
        available: undefined,
        sort: undefined,
        page: 2,
        limit: 20,
      });
    });
  });

  describe('findOne', () => {
    it('should return a book by id', async () => {
      mockBooksService.findOne.mockResolvedValue({ id: '1', title: 'Test' });

      const result = await controller.findOne('1');

      expect(result.id).toBe('1');
      expect(mockBooksService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      const dto = { title: 'Updated' };
      mockBooksService.update.mockResolvedValue({ id: '1', ...dto });

      const result = await controller.update('1', dto);

      expect(result.title).toBe('Updated');
      expect(mockBooksService.update).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('remove', () => {
    it('should delete a book', async () => {
      mockBooksService.remove.mockResolvedValue({ id: '1', deleted: true });

      const result = await controller.remove('1');

      expect(result.deleted).toBe(true);
      expect(mockBooksService.remove).toHaveBeenCalledWith('1');
    });
  });

  describe('restore', () => {
    it('should restore a book', async () => {
      mockBooksService.restore.mockResolvedValue({ id: '1', title: 'Test' });

      const result = await controller.restore('1');

      expect(result.id).toBe('1');
      expect(mockBooksService.restore).toHaveBeenCalledWith('1');
    });
  });

  describe('exportCsv', () => {
    it('should export books as CSV', async () => {
      const mockRes = {
        setHeader: jest.fn(),
        send: jest.fn(),
      } as unknown as Response;

      mockBooksService.findAll.mockResolvedValue({
        items: [{
          id: '1',
          title: 'Test',
          author: 'Author',
          publisher: 'Publisher',
          genre: 'Fiction',
          available: true,
          year: 2024,
          price: 20,
          coverurl: 'url',
          deletedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }],
        total: 1,
      });

      await controller.exportCsv(mockRes, 'test');

      expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv');
      expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Disposition', 'attachment; filename="books.csv"');
      expect(mockRes.send).toHaveBeenCalled();
    });
  });
});