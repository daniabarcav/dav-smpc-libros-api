import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Index } from 'typeorm';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid') id!: string;

  @Index() @Column() title!: string;
  @Column() author!: string;
  @Column() publisher!: string;
  @Column({ type: 'int', default: 0 }) year!: number;
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 }) price!: number;
  @Column() genre!: string;
  @Column({ type: 'boolean', default: true }) available!: boolean;
  @Column({ type: 'text', nullable: true }) coverUrl?: string;  

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
  @DeleteDateColumn({ nullable: true }) deletedAt?: Date | null;
}