import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { Article } from 'src/entities/article.entity';
import { User } from 'src/entities/user.entity';
import { generateString, TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User, Article])],
  providers: [ArticleService],
  controllers: [ArticleController],
})
export class ArticleModule {}
