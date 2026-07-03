import { MainPage } from './mainPage';
import { CreateArticlePage } from './createArticlePage';
import { ArticlePage } from './articlePage';
import { UserProfilePage } from './userProfilePage';
import { AuthorizePage } from './authorizePage';
import { LoginPage } from './loginPage';
import { SignUpPage } from './signUpPage';
import { EditorArticlePage } from './editorArticlePage';

export class App {
  constructor({ page }) {
    this.mainPage = new MainPage({ page });
    this.authorizePage = new AuthorizePage({ page });
    this.articlePage = new ArticlePage({ page });
    this.createArticlePage = new CreateArticlePage({ page });
    this.editorArticlePage = new EditorArticlePage({ page });
    this.loginPage = new LoginPage({ page });
    this.signUpPage = new SignUpPage({ page });
    this.userProfilePage = new UserProfilePage({ page });

    this.pageTitle = page.getByText('title');
  }

  async getPageTitle() {
    return this.pageTitle;
  }
}
