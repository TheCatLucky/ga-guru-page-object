import { MainPage } from './mainPage';
import { ArticlePage } from './articlePage';
import { UserProfilePage } from './userProfilePage';
import { AuthorizePage } from './authorizePage';
import { LoginPage } from './loginPage';
import { EditorArticlePage } from './editorArticlePage';
import { faker } from '@faker-js/faker';

export class RootPage {
  constructor({ page }) {
    this.mainPage = new MainPage({ page });
    this.authorizePage = new AuthorizePage({ page });
    this.articlePage = new ArticlePage({ page });
    this.editorArticlePage = new EditorArticlePage({ page });
    this.articlePage = new ArticlePage({ page });
    this.loginPage = new LoginPage({ page });
    this.userProfilePage = new UserProfilePage({ page });
  }

  async createNewArticle () {
    await this.authorizePage.clickNewArticleLink();

    const article = {
      title: faker.lorem.sentence(5),
      description: faker.lorem.sentence(10),
      content: faker.lorem.paragraphs(3),
      tags: Array.from({ length: 3 }, () => faker.word.noun())
    };

    await this.editorArticlePage.createNewArticle(article);

    return article;
  };
}
