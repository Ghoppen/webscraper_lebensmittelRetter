import { Page } from 'playwright';
import { url_configuration } from '../config/configuration';

async function goToDistributions(mainPage: Page) {
  await mainPage.waitForLoadState('networkidle');
  await mainPage.goto(url_configuration.data_page);
  await mainPage.waitForLoadState('domcontentloaded');

  return mainPage;
}

export { goToDistributions };
