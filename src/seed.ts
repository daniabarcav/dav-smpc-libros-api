import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './users/entities/user.entity';
import { Book } from './books/entities/book.entity';
import { AuditLog } from './audit/entities/audit.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'library',
  entities: [User, Book, AuditLog],
  synchronize: false,
});

async function run() {
  await AppDataSource.initialize();
  const userRepo = AppDataSource.getRepository(User);

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
  } else {
    console.log('ℹUsuario admin ya existe.');
  }
  await AppDataSource.destroy();
}

run().catch((e) => { console.error(e); process.exit(1); });
