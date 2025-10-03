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
exports.BooksController = void 0;
const common_1 = require("@nestjs/common");
const books_service_1 = require("./books.service");
const create_book_dto_1 = require("./dto/create-book.dto");
const update_book_dto_1 = require("./dto/update-book.dto");
const jwt_guard_1 = require("../auth/jwt.guard");
const csv_util_1 = require("../common/utils/csv.util");
const swagger_1 = require("@nestjs/swagger");
let BooksController = class BooksController {
    constructor(books) {
        this.books = books;
    }
    create(dto) { return this.books.create(dto); }
    findAll(query) {
        return this.books.findAll({
            q: query.q,
            genre: query.genre,
            publisher: query.publisher,
            author: query.author,
            available: query.available,
            sort: query.sort,
            page: query.page ? parseInt(query.page) : undefined,
            limit: query.limit ? parseInt(query.limit) : undefined,
        });
    }
    findOne(id) { return this.books.findOne(id); }
    update(id, dto) { return this.books.update(id, dto); }
    remove(id) { return this.books.remove(id); }
    restore(id) { return this.books.restore(id); }
    async exportCsv(res, q) {
        const { items } = await this.books.findAll({ q, page: 1, limit: 10000, includeDeleted: true });
        const csv = await (0, csv_util_1.toCSV)(items.map(i => ({
            id: i.id, title: i.title, author: i.author, publisher: i.publisher,
            genre: i.genre, available: i.available, year: i.year, price: i.price, coverurl: i.coverurl, deletedAt: i.deletedAt ?? '',
            createdAt: i.createdAt.toISOString(), updatedAt: i.updatedAt.toISOString(),
        })));
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=\"books.csv\"');
        return res.send(csv);
    }
};
exports.BooksController = BooksController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_book_dto_1.CreateBookDto]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_book_dto_1.UpdateBookDto]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/restore'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "restore", null);
__decorate([
    (0, common_1.Get)('export/csv'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "exportCsv", null);
exports.BooksController = BooksController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('books'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('books'),
    __metadata("design:paramtypes", [books_service_1.BooksService])
], BooksController);
//# sourceMappingURL=books.controller.js.map