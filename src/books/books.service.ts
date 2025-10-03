import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(@InjectRepository(Book) private repo: Repository<Book>) {}

  async create(dto: CreateBookDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async findAll(q?: { 
    q?: string; 
    genre?: string; 
    publisher?: string; 
    author?: string; 
    available?: string; 
    sort?: string;
    page?: number; 
    limit?: number; 
    includeDeleted?: boolean 
  }) {
    const page = q?.page ?? 1
    const limit = q?.limit ?? 10
    
    const where: FindOptionsWhere<Book> = {}
    
    if (q?.q) {
      const searchWhere: FindOptionsWhere<Book>[] = [
        { title: ILike(`%${q.q}%`) },
        { author: ILike(`%${q.q}%`) }
      ]
      
      if (q?.genre) {
        searchWhere[0].genre = ILike(`%${q.genre}%`)
        searchWhere[1].genre = ILike(`%${q.genre}%`)
      }
      if (q?.publisher) {
        searchWhere[0].publisher = ILike(`%${q.publisher}%`)
        searchWhere[1].publisher = ILike(`%${q.publisher}%`)
      }
      if (q?.author && q.q !== q.author) {
        searchWhere[0].author = ILike(`%${q.author}%`)
        searchWhere[1].author = ILike(`%${q.author}%`)
      }
      if (q?.available) {
        const isAvailable = q.available === 'true'
        searchWhere[0].available = isAvailable as any
        searchWhere[1].available = isAvailable as any
      }
      
      const [items, total] = await this.repo.findAndCount({
        where: searchWhere,
        withDeleted: !!q?.includeDeleted,
        take: limit,
        skip: (page - 1) * limit,
        order: this.parseSort(q?.sort),
      })
      
      return { items, page, limit, total, totalPages: Math.ceil(total / limit) }
    }
    
    if (q?.genre) where.genre = ILike(`%${q.genre}%`)
    if (q?.publisher) where.publisher = ILike(`%${q.publisher}%`)
    if (q?.author) where.author = ILike(`%${q.author}%`)
    if (q?.available) {
      where.available = (q.available === 'true') as any
    }
    
    const [items, total] = await this.repo.findAndCount({
      where: Object.keys(where).length > 0 ? where : undefined,
      withDeleted: !!q?.includeDeleted,
      take: limit,
      skip: (page - 1) * limit,
      order: this.parseSort(q?.sort),
    })
    
    return { items, page, limit, total, totalPages: Math.ceil(total / limit) }
  }

  private parseSort(sort?: string): any {
    if (!sort) return { createdAt: 'DESC' }
    
    const [field, order] = sort.split(':')
    return { [field]: order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC' }
  }

  async findOne(id: string) {
    const book = await this.repo.findOne({ where: { id } });
    if (!book) throw new NotFoundException('Libro no encontrado');
    return book;
  }

  async update(id: string, dto: UpdateBookDto) {
    const book = await this.findOne(id);
    Object.assign(book, dto);
    return this.repo.save(book);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.repo.softDelete(id);
    return { id, deleted: true };
  }

  async restore(id: string) {
    await this.repo.restore(id);
    return this.findOne(id);
  }
}
