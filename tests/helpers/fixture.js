import { test as base, expect } from '@playwright/test';
import { App } from './../../pages';

export const test = base.extend({
  app: async ({ page }, use) => {
    const app = new App({ page });

    await use(app);
  }
});
