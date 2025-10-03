import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { AuditModule } from './audit/audit.module';
import { Book } from './books/entities/book.entity';
import { User } from './users/entities/user.entity';
import { AuditLog } from './audit/entities/audit.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.get<string>('DB_HOST'),
        port: cfg.get<number>('DB_PORT'),
        username: cfg.get<string>('DB_USER'),
        password: cfg.get<string>('DB_PASS'),
        database: cfg.get<string>('DB_NAME'),
        entities: [Book, User, AuditLog],
        synchronize: true,
        logging: false,
      }),
    }),
    AuthModule,
    UsersModule,
    BooksModule,
    AuditModule,
  ],
})
export class AppModule {}
