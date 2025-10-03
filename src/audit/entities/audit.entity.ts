import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid') id!: string;

  @Index() @Column() action!: string;
  @Index() @Column() entity!: string;
  @Index() @Column({ nullable: true }) entityId?: string;

  @Column({ type: 'jsonb', nullable: true }) before?: any;
  @Column({ type: 'jsonb', nullable: true }) after?: any;

  @Index() @Column({ nullable: true }) userId?: string;
  @Column({ nullable: true }) reqId?: string;
  @CreateDateColumn() createdAt!: Date;
}
