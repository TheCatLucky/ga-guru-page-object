export class MainPage {
  constructor({ page }) {
    this.page = page;
    this.baseUrl = 'https://realworld.qa.guru/';
    this.signUpLink = page.getByRole('link', { name: 'Sign up' });
    this.loginLink = page.getByRole('link', { name: 'Login' });
    this.articlePreviewLinks = page.getByRole('link').and(page.locator('.preview-link'));
    this.articleAuthorsLinks = page.getByRole('link').and(page.locator('.author'));
  }

  getBaseUrl() {
    return this.baseUrl;
  }

  async gotoMainPage() {
    await this.page.goto(this.baseUrl);
  }

  async gotoLogin() {
    await this.loginLink.click();
  };

  async gotoSignUp() {
    await this.signUpLink.click();
  }

  async getFirstArticlePath() {
    return this.articlePreviewLinks.first().getAttribute('href');
  }

  async getFirstArticleName() {
    return this.articlePreviewLinks.first().locator('h1')
      .textContent();
  }

  async clickFirstArticlePreviewLink() {
    await this.articlePreviewLinks.first().click();
  }

  async getFirstArticleAuthorPath() {
    return this.articleAuthorsLinks.first().getAttribute('href');
  }

  async getFirstArticleAuthorName() {
    return this.articleAuthorsLinks.first().textContent();
  }

  async clickFirstArticleAuthorLink() {
    await this.articleAuthorsLinks.first().click();
  }
}
