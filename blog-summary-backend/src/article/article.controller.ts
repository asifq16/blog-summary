import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ArticleDto,
  ArticleSummaryDto,
  GetTextDto,
} from 'src/dtos/article.dto';
import { ArticleService } from './article.service';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  /**
   *  Used to save article and their summaries
   * @param createArticleDto
   * @returns
   */
  @Post('/')
  async insertArticle(@Body() createArticleDto: ArticleDto): Promise<object> {
    const saveResponse = [];
    // creates random user for now with random credentials
    const userCredentials = await this.articleService.createAnonymousUser();

    // loop through summary payload and save it in db
    for (const payload of createArticleDto.data) {
      const response = {};
      response['url'] = payload.url;
      const articleResponse = await this.articleService.insertArticleSummary(
        userCredentials,
        payload.summary,
        payload.url,
      );
      response['code'] = articleResponse.articleCode;
      saveResponse.push(response);
    }
    return {
      articleData: saveResponse,
    };
  }

  @Post('/article-summary')
  async getAiSummary(@Body() getSummary: ArticleSummaryDto): Promise<object> {
    const summaryResponses = [];

    // loop through multiple urls
    for (const url of getSummary.urls) {
      const response = {};
      response['url'] = url;

      // Get article text from url
      const processedTextResponse: string =
        await this.articleService.processText(url);
      response['article'] = processedTextResponse;

      // Get Summary of it from OpenAI api
      const articleSummaryResponse = await this.articleService.getTextSummary(
        processedTextResponse,
      );
      response['summary'] = articleSummaryResponse.data.choices[0].text;
      summaryResponses.push(response);
    }
    return {
      summaries: summaryResponses,
    };
  }
}
