import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

import { MainPage, EditorArticlePage, ArticlePage, UserProfilePage, AuthorizePage, LoginPage, RootPage } from '../../pages';

const username = 'My test user';
const email = 'testUserCassiooo@example.com';
const password = 'testPassword';
const newUsername = 'Updated test user';
const newArticleText = 'Новый текст';

test.describe('Авторизованного пользователь может', () => {
  test.beforeEach(async ({ page }) => {
    const mainPage = new MainPage({ page });
    const loginPage = new LoginPage({ page });
    const authorizePage = new AuthorizePage({ page });

    await mainPage.gotoMainPage();
    await mainPage.gotoLogin();
    await loginPage.signIn({
      email,
      password
    });
  });

  test('изменить данные своего профиля', async ({ page }) => {
    const authorizePage = new AuthorizePage({ page });
    const userProfilePage = new UserProfilePage({ page });

    await authorizePage.clickProfileDropdown();
    await authorizePage.clickProfileLink();

    await authorizePage.clickEditProfileButton();

    await authorizePage.updateUsername(newUsername);
    await authorizePage.updatePassword(password);
    await authorizePage.saveProfileSettings();

    await expect(await authorizePage.getProfileName()).toBe(newUsername);

    await authorizePage.clickProfileDropdown();
    await authorizePage.clickProfileLink();
    await authorizePage.clickEditProfileButton();
    await authorizePage.updateUsername(username);
    await authorizePage.updatePassword(password);
    await authorizePage.saveProfileSettings();
  });

  test.only('создать статью', async ({ page }) => {
    const authorizePage = new AuthorizePage({ page });
    const articlePage = new ArticlePage({ page });
    const editorArticlePage = new EditorArticlePage({ page });

    const newArticlePath = await authorizePage.getNewArticlePath();

    await authorizePage.clickNewArticleLink();

    await expect(page).toHaveURL(authorizePage.getBaseUrl() + newArticlePath);

    const article = {
      title: faker.lorem.sentence(5),
      description: faker.lorem.sentence(10),
      content: faker.lorem.paragraphs(3),
      tags: Array.from({ length: 3 }, () => faker.word.noun())
    };

    await editorArticlePage.createNewArticle(article);

    await expect(articlePage.getArticleHeading()).toContainText(article.title);
    await expect(articlePage.getArticleContent()).toContainText(article.content);

    for (const tag of article.tags) {
      await expect(await articlePage.getTagList()).toContainText(tag);
    }
  });

  test('добавить и удалить статью из Избранного', async ({ page }) => {
    const rootPage = new RootPage({ page });
    const mainPage = new MainPage({ page });
    const authorizePage = new AuthorizePage({ page });
    const articlePage = new ArticlePage({ page });

    await rootPage.createNewArticle();

    await mainPage.gotoMainPage();

    await authorizePage.openGlobalFeed();

    const addToFavorites = async () => {
      await authorizePage.clickFirstAddToFavoritesButton();

      await expect(await authorizePage.getFirstAddToFavoritesButton()).toContainClass('active');
      expect(
        await authorizePage.getFirstAddToFavoritesButtonCount()
      ).toBe(1);
    };

    const deleteFromFavorites = async () => {
      await authorizePage.clickFirstAddToFavoritesButton();

      await expect(await authorizePage.getFirstAddToFavoritesButton()).not.toContainClass('active');
      expect(
        await authorizePage.getFirstAddToFavoritesButtonCount()
      ).toBe(0);
    };

    await addToFavorites();
    await deleteFromFavorites();
  });

  test('изменить статью', async ({ page }) => {
    const rootPage = new RootPage({ page });
    const authorizePage = new AuthorizePage({ page });
    const userProfilePage = new UserProfilePage({ page });
    const articlePage = new ArticlePage({ page });
    const editorArticlePage = new EditorArticlePage({ page });

    await rootPage.createNewArticle();

    await articlePage.startEditArticle();

    await editorArticlePage.changeArticleText(newArticleText);
    await editorArticlePage.saveArticle();

    await expect(await articlePage.getEditArticleButton()).toBeVisible();
    await expect(await articlePage.getPageText(newArticleText)).toBeVisible();
  });

  test('удалить статью', async ({ page }) => {
    const rootPage = new RootPage({ page });
    const authorizePage = new AuthorizePage({ page });
    const userProfilePage = new UserProfilePage({ page });
    const articlePage = new ArticlePage({ page });

    const { title } = await rootPage.createNewArticle();

    await articlePage.deleteArticle();

    await expect(await page.getByText('title')).not.toBeVisible();
  });
});
