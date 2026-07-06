export class CreateArticlePage {
  constructor({ page }) {
    this.page = page;
    this.titleInputName = 'Article Title';
    this.descriptionInputName = 'What\'s this article about?';
    this.contentInputName = 'Write your article (in markdown)';
    this.tagsInput = page.getByRole('textbox', { name: 'Enter tags' });
    this.publishButton = page.getByRole('button', { name: 'Publish Article' });
  }

  async createNewArticle({ title, description, content, tags }) {
    await this.fillTextbox(this.titleInputName, title);
    await this.fillTextbox(this.descriptionInputName, description);
    await this.fillTextbox(this.contentInputName, content);

    await this.tagsInput.click();

    for (const tag of tags) {
      await this.tagsInput.type(tag);
      await this.tagsInput.press('Space');
    }

    await this.publishButton.click();
  }

  async fillTextbox(name, value) {
    await this.page.getByRole('textbox', { name }).fill(value);
  }
}
