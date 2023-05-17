export class ArticleDto {
  data: [
    {
      summary: string;
      url: string;
      text: string;
    },
  ];
}

export class ArticleSummaryDto {
  urls: [string];
}

export class GetTextDto {
  url: string;
}
