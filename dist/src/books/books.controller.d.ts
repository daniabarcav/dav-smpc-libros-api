import { Response } from 'express';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
export declare class BooksController {
    private readonly books;
    constructor(books: BooksService);
    create(dto: CreateBookDto): Promise<import("./entities/book.entity").Book>;
    findAll(query: any): Promise<{
        items: import("./entities/book.entity").Book[];
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<import("./entities/book.entity").Book>;
    update(id: string, dto: UpdateBookDto): Promise<import("./entities/book.entity").Book>;
    remove(id: string): Promise<{
        id: string;
        deleted: boolean;
    }>;
    restore(id: string): Promise<import("./entities/book.entity").Book>;
    exportCsv(res: Response, q?: string): Promise<Response<any, Record<string, any>>>;
}
