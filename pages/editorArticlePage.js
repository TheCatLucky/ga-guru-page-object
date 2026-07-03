export class EditorArticlePage {
  constructor({ page }) {
    this.page = page;
    this.articleTextbox = page.getByRole('textbox', { name: 'Write your article (in' });
    this.updateArticleButton = page.getByRole('button', { name: 'Update Article' });
  }

  async changeArticleText(newText) {
    await this.articleTextbox.fill(newText);
    await this.updateArticleButton.click();
  }
}
