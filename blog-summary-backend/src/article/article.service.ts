import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/entities/article.entity';
import { User } from 'src/entities/user.entity';
import { generateString } from 'src/utilities';
import { Repository } from 'typeorm';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Configuration, OpenAIApi } from 'openai';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  // Removing ant html tags from text
  removeTags(str) {
    if (str === null || str === '') return false;
    else str = str.toString();

    return str.replace(/(<([^>]+)>)/gi, '');
  }

  //  Scrapping text from url
  async getTextFromWebsite(url) {
    try {
      const response = await axios.get(url);
      const html = response.data;

      const $ = cheerio.load(html);

      let text = $('article').text();
      text = this.removeTags(text);

      return text;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // Creating anonymous user
  async createAnonymousUser() {
    const newAnonymousUser = new User();
    const randomString = generateString(4);
    newAnonymousUser.email = `anonymous-${randomString}`;
    newAnonymousUser.firstName = `anonymous-${randomString}`;
    newAnonymousUser.lastName = `anonymous-${randomString}`;
    const response = await this.userRepository.save(newAnonymousUser);
    return response.id;
  }

  async processText(url: string) {
    const textResponse = await this.getTextFromWebsite(url);
    return textResponse;
  }

  // saving article
  async insertArticleSummary(
    userid: number,
    articleSummary: string,
    articleUrl: string,
  ) {
    const article = new Article();
    const randomString = generateString(4);
    article.articleCode = randomString.trim();
    article.articleSummary = articleSummary;
    article.articleUrl = articleUrl;
    article.userId = String(userid);
    const response = await this.articleRepository.save(article);
    return response;
  }

  // getting text summary from chat gpt after text processing
  async getTextSummary(articleText: string): Promise<any> {
    const configuration = new Configuration({
      apiKey: process.env.OPEN_AI_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${articleText}\n\nTl;dr`,
      temperature: 0.7,
      max_tokens: 53,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 1,
    });
    return response;
  }
}
