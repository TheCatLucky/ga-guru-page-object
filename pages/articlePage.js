export class ArticlePage {
  constructor({ page }) {
    this.page = page;
    this.articleHeading = page.locator('.article-page').locator('h1');
    this.articleContent = page.locator('.article-page').locator('.article-content');
    this.tagList = page.getByRole('list').and(page.locator('.tag-list'));
    this.firstArticle = page.locator('.preview-link').first();
    this.deleteArticleButton = page.getByRole('button', { name: /Delete Article/ }).first();
    this.editArticleButton = page.getByRole('button', { name: /Edit Article/ }).first();
  }

  getArticleHeading() {
    return this.articleHeading;
  }

  getArticleContent() {
    return this.articleContent;
  }

  getTagList() {
    return this.tagList;
  }

  async getFirstArticle() {
    return this.firstArticle;
  }

  async clickFirstArticle() {
    await this.firstArticle.click();
  }

  async getDeleteArticle() {
    return this.deleteArticleButton;
  }

  async deleteArticle() {
    this.page.once('dialog', async (dialog) => {
      await dialog.accept();
    });
    await this.deleteArticleButton.click();
  }

  async getEditArticleButton() {
    return this.editArticleButton;
  }

  async startEditArticle() {
    await this.editArticleButton.click();
  }

  async getPageText(text) {
    return this.page.getByText(text);
  }
}
