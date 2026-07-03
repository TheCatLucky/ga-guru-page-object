import { MainPage } from "./mainPage";
import { test, expect } from '@playwright/test';

export class AuthorizePage extends MainPage {
  constructor({ page }) {
    super({ page });
    this.profileDropdown = page.getByRole('listitem').and(page.locator('.dropdown'));
    this.profileName = this.profileDropdown.locator('.dropdown-toggle');
    this.profileLink = this.profileDropdown.getByRole('link', { name: 'Profile' });
    this.globalFeedButton = page.getByRole('button', { name: 'Global Feed' });
    this.addToFavoritesButtons = page.locator('.article-preview').getByRole('button');
    this.addToFavoritesButtonCount = this.addToFavoritesButtons.locator('.counter');
    this.newArticleLink = page.getByRole('link', { name: 'New Article' });
    this.editProfileButton = page.getByRole('link', { name: /Edit Profile Settings/ });
    this.editNameInput = page.getByRole('textbox', { name: 'Your Name' });
    this.editPasswordInput = page.getByRole('textbox', { name: 'Password' });
    this.updateSettingButton = page.getByRole('button', { name: 'Update Settings' });
  }

  getProfileDropdown() {
    return this.profileDropdown;
  }

  async clickEditProfileButton() {
    await this.editProfileButton.click();
  }

  async updateUsername(newUsername) {
    await this.editNameInput.fill(newUsername);
  }

  async saveProfileSettings() {
    await this.updateSettingButton.click();
  }

  getProfileName() {
    return this.profileName;
  }

  async clickProfileDropdown() {
    await this.profileDropdown.click();
  }

  async updatePassword(newPassword) {
    await this.editPasswordInput.fill(newPassword);
  };

  async clickProfileLink() {
    await this.profileLink.click();
  }

  async openGlobalFeed() {
    await this.globalFeedButton.click();
  }

  async getFirstAddToFavoritesButton() {
    return this.addToFavoritesButtons.first();
  }

  async getFirstAddToFavoritesButtonCount() {
    const text = await this.addToFavoritesButtonCount.first().textContent();

    return Number(text.match(/\d+/)?.[0]) ?? -1;
  }

  async clickFirstAddToFavoritesButton() {
    await this.addToFavoritesButtons.first().click();
  }

  async getNewArticlePath() {
    return this.newArticleLink.getAttribute('href');
  };

  async clickNewArticleLink() {
    return test.step('тест', async () => {
      await this.newArticleLink.click();
    });
  }
}
