import { Repository, DataSource } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
export declare class BooksService {
    private repo;
    private readonly dataSource;
    constructor(repo: Repository<Book>, dataSource: DataSource);
    create(dto: CreateBookDto): Promise<Book>;
    findAll(q?: {
        q?: string;
        genre?: string;
        publisher?: string;
        author?: string;
        available?: string;
        sort?: string;
        page?: number;
        limit?: number;
        includeDeleted?: boolean;
    }): Promise<{
        items: Book[];
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }>;
    private parseSort;
    findOne(id: string): Promise<Book>;
    update(id: string, dto: UpdateBookDto): Promise<Book>;
    remove(id: string): Promise<{
        id: string;
        deleted: boolean;
    }>;
    restore(id: string): Promise<Book>;
}
