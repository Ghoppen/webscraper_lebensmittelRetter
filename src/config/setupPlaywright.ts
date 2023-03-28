import playwright, { Page } from 'playwright';

import { url_configuration } from './configuration';
import CookieParam from '../model/cookieParam';
import { bannerCookie } from '../constants/cookieBanner';

const config = url_configuration;

async function removeImageLoading(page: Page) {
  await page.route('**/*', (route) => {
    if (route.request().resourceType() == 'image') {
      return route.abort();
    }
    return route.continue();
  });
}

async function setupPlaywright(isheadless: boolean = false) {
  const browser = await playwright.firefox.launch({ headless: isheadless });

  const context = await browser.newContext();

  context.addCookies([bannerCookie]);

  const page = await context.newPage();

  await removeImageLoading(page);

  page.on('response', (res) => {
    if (res.url() == config.login_site) {
      res.headerValues('set-cookie').then((cookieHeaders) => {
        cookieHeaders
          .flatMap((el) => {
            return el.split(';');
          })
          .filter(
            (pair) =>
              pair.indexOf('PHPSESSID') != -1 ||
              pair.indexOf('wordpress_logged_in') != -1
          )
          .map((filteredPairs) => filteredPairs.split('='))
          .map((filteredPair) => {
            if (filteredPair != null) {
              const newCookie: CookieParam = {
                name: filteredPair.at(0)!!,
                value: filteredPair.at(1)!!,
                url: config.start_website,
              };
              context.addCookies([newCookie]);
            }
          });
      });
    }
  });
  await page.goto(config.start_website);

  return page;
}

async function start(isheadless: boolean = false): Promise<playwright.Page> {
  return setupPlaywright(isheadless);
}

export { start };
