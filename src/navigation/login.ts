import { Page } from 'playwright';
import { user_configuration, url_configuration } from '../config/configuration';

async function goToLoginPage(page: Page) {
  await page.goto(url_configuration.login_site);
  return page;
}

async function login(loginPage: Page) {
  const USERNAME_SELECTOR = '#username-4';
  const PASSWORD_SELECTOR = '#user_password-4';
  const LOGIN_BUTTON_SELECTOR = '#um-submit-btn';

  await loginPage.type(USERNAME_SELECTOR, user_configuration.name);
  await loginPage.type(PASSWORD_SELECTOR, user_configuration.password);

  await loginPage.click(LOGIN_BUTTON_SELECTOR);

  await loginPage.waitForLoadState('networkidle');

  return loginPage;
}

export { login, goToLoginPage };
