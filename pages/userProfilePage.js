export class UserProfilePage {
  constructor({ page }) {
    this.page = page;
    this.userHeading = page.locator('.user-info').locator('h4');
    this.userImage = page.locator('.user-info').locator('img');
  }

  getUserHeading() {
    return this.userHeading;
  }

  getUserImage() {
    return this.userImage;
  }
}
