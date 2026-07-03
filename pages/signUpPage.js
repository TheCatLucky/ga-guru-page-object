import { faker } from '@faker-js/faker';

export class SignUpPage {
  constructor({ page }) {
    this.page = page;
    this.baseUrl = 'https://realworld.qa.guru/';
    this.profileDropdown = page.getByRole('listitem').and(page.locator('.dropdown'));
    this.usernameInputName = 'Your Name';
    this.emailInputName = 'Email';
    this.passwordInputName = 'Password';
    this.signUpLink = page.getByRole('link', { name: 'Sign up' });
    this.signUpButton = page.getByRole('button', { name: 'Sign up' });
  }

  async createUser() {
    const suffix = faker.string.alphanumeric(8);

    const user = {
      username: `test-user-${suffix}`,
      email: `test-user-${suffix}@example.com`,
      password: `test-password-${suffix}`
    };

    await this.page.goto(this.baseUrl);
    await this.signUpLink.click();
    await this.signUp(user);

    return user;
  }

  async signUp({ username, email, password }) {
    await this.#clickAndFill(this.usernameInputName, username);
    await this.#clickAndFill(this.emailInputName, email);
    await this.#clickAndFill(this.passwordInputName, password);

    await this.signUpButton.click();
  }

  async #clickAndFill(name, value) {
    await this.page.getByRole('textbox', { name }).click();
    await this.page.getByRole('textbox', { name }).fill(value);
  }
}
