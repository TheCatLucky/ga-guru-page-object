import { expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { test } from './helpers';
import { App } from '../pages';

const newUsername = 'Updated test user';
const newArticleText = 'New text';
let currentUser;

test.describe('Authorized user can', () => {
  test.beforeEach(async ({ app }) => {
    currentUser = await app.signUpPage.createUser();
  });

  test('update profile data', async ({ page, app }) => {
    await app.authorizePage.clickProfileDropdown();
    await app.authorizePage.clickProfileLink();

    await app.authorizePage.clickEditProfileButton();

    await app.authorizePage.updateUsername(newUsername);
    await app.authorizePage.updatePassword(currentUser.password);
    await app.authorizePage.saveProfileSettings();

    await expect(app.authorizePage.getProfileName()).toHaveText(newUsername);
  });

  test('create an article', async ({ page, app }) => {
    const newArticlePath = await app.authorizePage.getNewArticlePath();

    await app.authorizePage.clickNewArticleLink();

    await expect(page).toHaveURL(app.authorizePage.getBaseUrl() + newArticlePath);

    const article = {
      title: faker.lorem.sentence(5),
      description: faker.lorem.sentence(10),
      content: faker.lorem.paragraphs(3),
      tags: Array.from({ length: 3 }, () => faker.word.noun())
    };

    await app.createArticlePage.createNewArticle(article);

    await expect(app.articlePage.getArticleHeading()).toContainText(article.title);
    await expect(app.articlePage.getArticleContent()).toContainText(article.content);

    for (const tag of article.tags) {
      await expect(await app.articlePage.getTagList()).toContainText(tag);
    }
  });

  test.describe('Work with article:', () => {
    test.beforeEach(async ({ page, app }) => {
      await app.authorizePage.clickNewArticleLink();
      const article = {
        title: faker.lorem.sentence(5),
        description: faker.lorem.sentence(10),
        content: faker.lorem.paragraphs(3),
        tags: Array.from({ length: 3 }, () => faker.word.noun())
      };
      await app.createArticlePage.createNewArticle(article);
    });

    test('add and remove article from favorites', async ({ page, app }) => {
      await app.mainPage.gotoMainPage();

      await app.authorizePage.openGlobalFeed();

      const addToFavorites = async () => {
        await app.authorizePage.clickFirstAddToFavoritesButton();

        await expect(await app.authorizePage.getFirstAddToFavoritesButton()).toContainClass('active');
        expect(
          await app.authorizePage.getFirstAddToFavoritesButtonCount()
        ).toBe(1);
      };

      const deleteFromFavorites = async () => {
        await app.authorizePage.clickFirstAddToFavoritesButton();

        await expect(await app.authorizePage.getFirstAddToFavoritesButton()).not.toContainClass('active');
        expect(
          await app.authorizePage.getFirstAddToFavoritesButtonCount()
        ).toBe(0);
      };

      await addToFavorites();
      await deleteFromFavorites();
    });

    test('edit article', async ({ page, app }) => {
      await app.articlePage.startEditArticle();

      await app.editorArticlePage.changeArticleText(newArticleText);

      await expect(await app.articlePage.getEditArticleButton()).toBeVisible();
      await expect(await app.articlePage.getPageText(newArticleText)).toBeVisible();
    });

    test('delete article', async ({ page, app }) => {
      await app.articlePage.deleteArticle();

      await expect(await app.getPageTitle()).not.toBeVisible();
    });
  });
});
