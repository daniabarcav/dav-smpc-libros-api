"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("./users/entities/user.entity");
const book_entity_1 = require("./books/entities/book.entity");
const audit_entity_1 = require("./audit/entities/audit.entity");
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: +(process.env.DB_PORT || 5432),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    database: process.env.DB_NAME || 'library',
    entities: [user_entity_1.User, book_entity_1.Book, audit_entity_1.AuditLog],
    synchronize: false,
});
async function run() {
    await AppDataSource.initialize();
    const userRepo = AppDataSource.getRepository(user_entity_1.User);
    const email = 'admin@demo.com';
    const pass = 'admin123';
    const existing = await userRepo.findOne({ where: { email } });
    if (!existing) {
        const u = userRepo.create({
            email,
            password: await bcrypt.hash(pass, 10),
            isActive: true,
        });
        await userRepo.save(u);
        console.log(`Usuario admin creado: ${email} / ${pass}`);
    }
    else {
        console.log('ℹUsuario admin ya existe.');
    }
    await AppDataSource.destroy();
}
run().catch((e) => { console.error(e); process.exit(1); });
//# sourceMappingURL=seed.js.map