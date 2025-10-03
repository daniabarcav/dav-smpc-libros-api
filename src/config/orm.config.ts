import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Book } from '../books/entities/book.entity';
import { User } from '../users/entities/user.entity';
import { AuditLog } from '../audit/entities/audit.entity';

export const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [Book, User, AuditLog],
  synchronize: true,
  logging: false,
};
