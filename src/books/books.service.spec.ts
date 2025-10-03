import { Test } from '@nestjs/testing';
import { BooksService } from './books.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';

const bookRepoMock = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findAndCount: jest.fn(),
  findOne: jest.fn(),
  softDelete: jest.fn(),
  restore: jest.fn()
});

describe('BooksService', () => {
  let service: BooksService;
  let repo: jest.Mocked<Repository<Book>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        BooksService,
        { provide: getRepositoryToken(Book), useFactory: bookRepoMock }
      ]
    }).compile();

    service = module.get(BooksService);
    repo = module.get(getRepositoryToken(Book));
  });

  it('create: debe crear y guardar libro', async () => {
    const dto = { title: 'Clean Code', author: 'Robert C. Martin', year: 2008, price: 10 };
    const entity = { id: '1', ...dto } as Book;
    repo.create.mockReturnValue(entity);
    repo.save.mockResolvedValue(entity);

    const res = await service.create(dto as any);
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalledWith(entity);
    expect(res).toEqual(entity);
  });

  it('findOne: debe lanzar si no existe', async () => {
    repo.findOne.mockResolvedValue(null as any);
    await expect(service.findOne('x')).rejects.toThrow('Libro no encontrado');
  });

  it('remove: soft delete', async () => {
    repo.findOne.mockResolvedValue({ id: '1' } as any);
    await service.remove('1');
    expect(repo.softDelete).toHaveBeenCalledWith('1');
  });

  it('restore: debe restaurar', async () => {
    repo.restore.mockResolvedValue({} as any);
    repo.findOne.mockResolvedValue({ id: '1' } as any);
    const book = await service.restore('1');
    expect(repo.restore).toHaveBeenCalledWith('1');
    expect(book.id).toBe('1');
  });
});
