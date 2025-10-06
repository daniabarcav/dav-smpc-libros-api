import { 
  Controller, Get, Post, Patch, Delete, Param, Body, Query, Res, 
  UseGuards, DefaultValuePipe, ParseIntPipe, UseInterceptors, UploadedFile 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { toCSV } from '../common/utils/csv.util';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('books')
@UseGuards(JwtAuthGuard)
@Controller('books')
export class BooksController {
  constructor(private readonly books: BooksService) {}

  @Post()
  @UseInterceptors(FileInterceptor('cover', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        cb(null, `book-${uniqueSuffix}${ext}`);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
        return cb(new Error('Solo se permiten imágenes'), false);
      }
      cb(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024
    }
  }))
  create(
    @Body() dto: any,
    @UploadedFile() file: Express.Multer.File
  ) {
    console.log('📦 Body recibido:', dto);
    console.log('📦 File recibido:', file);
    
    // Convertir y limpiar los datos
    const bookData: CreateBookDto = {
      title: dto.title,
      author: dto.author,
      publisher: dto.publisher,
      genre: dto.genre,
      year: dto.year ? parseInt(dto.year, 10) : undefined,
      price: dto.price ? parseFloat(dto.price) : undefined,
      available: dto.available === 'true' || dto.available === true,
      coverUrl: file ? `/uploads/${file.filename}` : undefined
    };
    
    return this.books.create(bookData);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.books.findAll({
      q: query.q,
      genre: query.genre,
      publisher: query.publisher,
      author: query.author,
      available: query.available,
      sort: query.sort,
      page: query.page ? parseInt(query.page) : undefined,
      limit: query.limit ? parseInt(query.limit) : undefined,
    })
  }

  @Get(':id') 
  findOne(@Param('id') id: string) { 
    return this.books.findOne(id); 
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('cover', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        cb(null, `book-${uniqueSuffix}${ext}`);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
        return cb(new Error('Solo se permiten imágenes'), false);
      }
      cb(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024
    }
  }))
  update(
    @Param('id') id: string,
    @Body() dto: any,
    @UploadedFile() file: Express.Multer.File
  ) {
    const bookData: UpdateBookDto = {
      ...(dto.title && { title: dto.title }),
      ...(dto.author && { author: dto.author }),
      ...(dto.publisher && { publisher: dto.publisher }),
      ...(dto.genre && { genre: dto.genre }),
      ...(dto.year && { year: parseInt(dto.year, 10) }),
      ...(dto.price && { price: parseFloat(dto.price) }),
      ...(dto.available !== undefined && { 
        available: dto.available === 'true' || dto.available === true 
      }),
      ...(file && { coverUrl: `/uploads/${file.filename}` })
    };
    
    return this.books.update(id, bookData);
  }

  @Delete(':id') 
  remove(@Param('id') id: string) { 
    return this.books.remove(id); 
  }

  @Patch(':id/restore') 
  restore(@Param('id') id: string) { 
    return this.books.restore(id); 
  }

  @Get('export/csv')
  async exportCsv(@Res() res: Response, @Query('q') q?: string) {
    const { items } = await this.books.findAll({ q, page: 1, limit: 10000, includeDeleted: true });
    const csv = await toCSV(items.map(i => ({
      id: i.id, title: i.title, author: i.author, publisher: i.publisher, 
      genre: i.genre, available: i.available, year: i.year, price: i.price, coverurl: i.coverUrl, deletedAt: i.deletedAt ?? '',
      createdAt: i.createdAt.toISOString(), updatedAt: i.updatedAt.toISOString(),
    })));
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=\"books.csv\"');
    return res.send(csv);
  }
}