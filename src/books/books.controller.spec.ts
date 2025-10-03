import { Test } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

describe('BooksController', () => {
  let controller: BooksController;
  const serviceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    restore: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [{ provide: BooksService, useValue: serviceMock }],
    }).compile();

    controller = module.get(BooksController);
    jest.clearAllMocks();
  });

  it('GET /books -> findAll', async () => {
    serviceMock.findAll.mockResolvedValue({ items: [], total: 0 });
    const res = await controller.findAll(undefined as any, 1 as any, 10 as any);
    expect(res).toEqual({ items: [], total: 0 });
  });

  it('POST /books -> create', async () => {
    serviceMock.create.mockResolvedValue({ id: '1' });
    const res = await controller.create({ title: 'TDD', author: 'Kent' } as any);
    expect(res).toEqual({ id: '1' });
  });
});
