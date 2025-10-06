import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { Response } from 'express';

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

const mockBooksService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  restore: jest.fn(),
};

describe('BooksController (extra coverage)', () => {
  let controller: BooksController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [{ provide: BooksService, useValue: mockBooksService }],
    }).compile();

    controller = module.get<BooksController>(BooksController);
  });

  it('create() llama al servicio y retorna el resultado', async () => {
    const dto = { title: 'A', author: 'B', publisher: 'C', genre: 'Fiction' };
    mockBooksService.create.mockResolvedValue({ id: '1', ...dto });

    const result = await controller.create(dto);

    expect(mockBooksService.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ id: '1', ...dto });
  });

  it('findAll() convierte page/limit a número y pasa filtros básicos', async () => {
    mockBooksService.findAll.mockResolvedValue({
      items: [],
      page: 2,
      limit: 20,
      total: 0,
      totalPages: 0,
    });

    await controller.findAll({ q: 'test', genre: 'Fiction', page: '2', limit: '20' } as any);

    expect(mockBooksService.findAll).toHaveBeenCalledWith({
      q: 'test',
      genre: 'Fiction',
      publisher: undefined,
      author: undefined,
      available: undefined,
      sort: undefined,
      includeDeleted: undefined,
      page: 2,
      limit: 20,
    });
  });

    it('findAll() soporta available/includeDeleted/sort y defaults de paginación', async () => {
    mockBooksService.findAll.mockResolvedValue({
        items: [],
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    });

    await controller.findAll({
        available: 'true',
        includeDeleted: 'true',
        sort: 'title:ASC',
    } as any);

    expect(mockBooksService.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
        available: 'true',
        sort: 'title:ASC',
        page: undefined,
        limit: undefined,
        }),
    );
    });


  it('findOne() retorna por id', async () => {
    mockBooksService.findOne.mockResolvedValue({ id: 'X', title: 'T' });

    const result = await controller.findOne('X');

    expect(mockBooksService.findOne).toHaveBeenCalledWith('X');
    expect(result).toEqual({ id: 'X', title: 'T' });
  });

  it('update() actualiza y retorna', async () => {
    mockBooksService.update.mockResolvedValue({ id: '2', title: 'Z' });

    const result = await controller.update('2', { title: 'Z' });

    expect(mockBooksService.update).toHaveBeenCalledWith('2', { title: 'Z' });
    expect(result).toEqual({ id: '2', title: 'Z' });
  });

  it('remove() elimina y retorna marca deleted', async () => {
    mockBooksService.remove.mockResolvedValue({ id: '3', deleted: true });

    const result = await controller.remove('3');

    expect(mockBooksService.remove).toHaveBeenCalledWith('3');
    expect(result).toEqual({ id: '3', deleted: true });
  });

  it('restore() restaura y retorna', async () => {
    mockBooksService.restore.mockResolvedValue({ id: '4' });

    const result = await controller.restore('4');

    expect(mockBooksService.restore).toHaveBeenCalledWith('4');
    expect(result).toEqual({ id: '4' });
  });

    it('exportCsv() setea headers y envía CSV con resultados', async () => {
    const res = {
        setHeader: jest.fn(),
        send: jest.fn(),
    } as unknown as Response;

    mockBooksService.findAll.mockResolvedValue({
        items: [
        {
            id: '1',
            title: 'T',
            author: 'A',
            publisher: 'P',
            genre: 'G',
            available: true,
            year: 2024,
            price: 10,
            coverurl: 'u',
            deletedAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        ],
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
    });

    await controller.exportCsv(res, 'q');

    expect(mockBooksService.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ q: 'q', page: 1, limit: 10000, includeDeleted: true }),
    );
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv');
    expect(res.setHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        'attachment; filename="books.csv"',
    );
    expect(res.send).toHaveBeenCalled();
    expect(typeof (res.send as jest.Mock).mock.calls[0][0]).toBe('string');
    });


  it('exportCsv() con lista vacía igual envía CSV válido', async () => {
    const res = {
      setHeader: jest.fn(),
      send: jest.fn(),
    } as unknown as Response;

    mockBooksService.findAll.mockResolvedValue({
      items: [],
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    });

    await controller.exportCsv(res, '');

    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv');
    expect(res.send).toHaveBeenCalled();
  });
});
