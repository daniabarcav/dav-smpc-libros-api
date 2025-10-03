"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ormConfig = void 0;
const book_entity_1 = require("../books/entities/book.entity");
const user_entity_1 = require("../users/entities/user.entity");
const audit_entity_1 = require("../audit/entities/audit.entity");
exports.ormConfig = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +(process.env.DB_PORT || 5432),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [book_entity_1.Book, user_entity_1.User, audit_entity_1.AuditLog],
    synchronize: true,
    logging: false,
};
//# sourceMappingURL=orm.config.js.map