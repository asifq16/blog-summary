import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  articleSummary: string;

  @Column()
  articleCode: string;

  @Column()
  articleUrl: string;

  @Column({ default: true })
  isActive: boolean;
}