"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const books_module_1 = require("./books/books.module");
const audit_module_1 = require("./audit/audit.module");
const book_entity_1 = require("./books/entities/book.entity");
const user_entity_1 = require("./users/entities/user.entity");
const audit_entity_1 = require("./audit/entities/audit.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (cfg) => ({
                    type: 'postgres',
                    host: cfg.get('DB_HOST'),
                    port: cfg.get('DB_PORT'),
                    username: cfg.get('DB_USER'),
                    password: cfg.get('DB_PASS'),
                    database: cfg.get('DB_NAME'),
                    entities: [book_entity_1.Book, user_entity_1.User, audit_entity_1.AuditLog],
                    synchronize: true,
                    logging: false,
                }),
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            books_module_1.BooksModule,
            audit_module_1.AuditModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map