import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

import { MainPage, CreateArticlePage, EditorArticlePage, ArticlePage, UserProfilePage, AuthorizePage, LoginPage, App } from '../pages';

const username = 'My test user';
const email = 'testUserCassiooo@example.com';
const password = 'testPassword';
const newUsername = 'Updated test user';
const newArticleText = 'Новый текст';

test.describe('Авторизованный пользователь может', () => {
  test.beforeEach(async ({ page }) => {
    const app = new App({ page });

    await app.mainPage.gotoMainPage();
    await app.mainPage.gotoLogin();
    await app.loginPage.signIn({
      email,
      password
    });
  });

  test('изменить данные своего профиля', async ({ page }) => {
    const app = new App({ page });

    await app.authorizePage.clickProfileDropdown();
    await app.authorizePage.clickProfileLink();

    await app.authorizePage.clickEditProfileButton();

    await app.authorizePage.updateUsername(newUsername);
    await app.authorizePage.updatePassword(password);
    await app.authorizePage.saveProfileSettings();

    await expect(await app.authorizePage.getProfileName()).toBe(newUsername);

    await app.authorizePage.clickProfileDropdown();
    await app.authorizePage.clickProfileLink();
    await app.authorizePage.clickEditProfileButton();
    await app.authorizePage.updateUsername(username);
    await app.authorizePage.updatePassword(password);
    await app.authorizePage.saveProfileSettings();
  });

  test('создать статью', async ({ page }) => {
    const app = new App({ page });

    const createArticlePage = new CreateArticlePage({ page });
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

  test.describe('работать с статьей:', () => {
    test.beforeEach(async ({ page }) => {
      const app = new App({ page });

      await app.authorizePage.clickNewArticleLink();
      const article = {
        title: faker.lorem.sentence(5),
        description: faker.lorem.sentence(10),
        content: faker.lorem.paragraphs(3),
        tags: Array.from({ length: 3 }, () => faker.word.noun())
      };
      await app.createArticlePage.createNewArticle(article);
    });

    test('добавить и удалить статью из Избранного', async ({ page }) => {
      const app = new App({ page });

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

    test('изменить статью', async ({ page }) => {
      const app = new App({ page });

      await app.articlePage.startEditArticle();

      await app.editorArticlePage.changeArticleText(newArticleText);
      await app.editorArticlePage.saveArticle();

      await expect(await app.articlePage.getEditArticleButton()).toBeVisible();
      await expect(await app.articlePage.getPageText(newArticleText)).toBeVisible();
    });

    test('удалить статью', async ({ page }) => {
      const app = new App({ page });

      await app.articlePage.deleteArticle();

      await expect(await app.getPageTitle()).not.toBeVisible();
    });
  });
});
