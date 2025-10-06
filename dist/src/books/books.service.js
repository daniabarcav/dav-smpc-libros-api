"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const book_entity_1 = require("./entities/book.entity");
let BooksService = class BooksService {
    constructor(repo, dataSource) {
        this.repo = repo;
        this.dataSource = dataSource;
    }
    async create(dto) {
        return this.dataSource.transaction(async (manager) => {
            const entity = manager.create(book_entity_1.Book, dto);
            const saved = await manager.save(book_entity_1.Book, entity);
            return saved;
        });
    }
    async findAll(q) {
        const page = q?.page ?? 1;
        const limit = q?.limit ?? 10;
        const where = {};
        if (q?.q) {
            const searchWhere = [
                { title: (0, typeorm_2.ILike)(`%${q.q}%`) },
                { author: (0, typeorm_2.ILike)(`%${q.q}%`) }
            ];
            if (q?.genre) {
                searchWhere[0].genre = (0, typeorm_2.ILike)(`%${q.genre}%`);
                searchWhere[1].genre = (0, typeorm_2.ILike)(`%${q.genre}%`);
            }
            if (q?.publisher) {
                searchWhere[0].publisher = (0, typeorm_2.ILike)(`%${q.publisher}%`);
                searchWhere[1].publisher = (0, typeorm_2.ILike)(`%${q.publisher}%`);
            }
            if (q?.author && q.q !== q.author) {
                searchWhere[0].author = (0, typeorm_2.ILike)(`%${q.author}%`);
                searchWhere[1].author = (0, typeorm_2.ILike)(`%${q.author}%`);
            }
            if (q?.available) {
                const isAvailable = q.available === 'true';
                searchWhere[0].available = isAvailable;
                searchWhere[1].available = isAvailable;
            }
            const [items, total] = await this.repo.findAndCount({
                where: searchWhere,
                withDeleted: !!q?.includeDeleted,
                take: limit,
                skip: (page - 1) * limit,
                order: this.parseSort(q?.sort),
            });
            return { items, page, limit, total, totalPages: Math.ceil(total / limit) };
        }
        if (q?.genre)
            where.genre = (0, typeorm_2.ILike)(`%${q.genre}%`);
        if (q?.publisher)
            where.publisher = (0, typeorm_2.ILike)(`%${q.publisher}%`);
        if (q?.author)
            where.author = (0, typeorm_2.ILike)(`%${q.author}%`);
        if (q?.available) {
            where.available = (q.available === 'true');
        }
        const [items, total] = await this.repo.findAndCount({
            where: Object.keys(where).length > 0 ? where : undefined,
            withDeleted: !!q?.includeDeleted,
            take: limit,
            skip: (page - 1) * limit,
            order: this.parseSort(q?.sort),
        });
        return { items, page, limit, total, totalPages: Math.ceil(total / limit) };
    }
    parseSort(sort) {
        if (!sort)
            return { createdAt: 'DESC' };
        const [field, order] = sort.split(':');
        return { [field]: order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC' };
    }
    async findOne(id) {
        const book = await this.repo.findOne({ where: { id } });
        if (!book)
            throw new common_1.NotFoundException('Libro no encontrado');
        return book;
    }
    async update(id, dto) {
        return this.dataSource.transaction(async (manager) => {
            const book = await manager.findOne(book_entity_1.Book, { where: { id } });
            if (!book)
                throw new common_1.NotFoundException('Libro no encontrado');
            Object.assign(book, dto);
            return manager.save(book_entity_1.Book, book);
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.repo.softDelete(id);
        return { id, deleted: true };
    }
    async restore(id) {
        await this.repo.restore(id);
        return this.findOne(id);
    }
};
exports.BooksService = BooksService;
exports.BooksService = BooksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(book_entity_1.Book)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], BooksService);
//# sourceMappingURL=books.service.js.map