import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Res, UseGuards, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
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

  @Post() create(@Body() dto: CreateBookDto) { return this.books.create(dto); }

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

  @Get(':id') findOne(@Param('id') id: string) { return this.books.findOne(id); }

  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateBookDto) { return this.books.update(id, dto); }

  @Delete(':id') remove(@Param('id') id: string) { return this.books.remove(id); }

  @Patch(':id/restore') restore(@Param('id') id: string) { return this.books.restore(id); }

  @Get('export/csv')
  async exportCsv(@Res() res: Response, @Query('q') q?: string) {
    const { items } = await this.books.findAll({ q, page: 1, limit: 10000, includeDeleted: true });
    const csv = await toCSV(items.map(i => ({
      id: i.id, title: i.title, author: i.author, publisher: i.publisher, 
      genre: i.genre, available: i.available, year: i.year, price: i.price, coverurl: i.coverurl, deletedAt: i.deletedAt ?? '',
      createdAt: i.createdAt.toISOString(), updatedAt: i.updatedAt.toISOString(),
    })));
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=\"books.csv\"');
    return res.send(csv);
  }
}
