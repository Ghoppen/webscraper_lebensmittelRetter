import playwright, { Page } from 'playwright';
import cheerioModule from 'cheerio';
import FoodLocationData from './model/foodLocationData';
import configuration from './config/configuration';
import CookieParam from './model/cookieParam';
import { headerEquals } from './helpers/equalityHeaderCheck';

const config = configuration;

const TABLE_ROW_SELECTOR = 'table > tbody > tr';

async function login(loginPage: Page) {
  const USERNAME_SELECTOR = '#username-4';
  const PASSWORD_SELECTOR = '#user_password-4';
  const LOGIN_BUTTON_SELECTOR = '#um-submit-btn';

  await loginPage.type(USERNAME_SELECTOR, config.user);
  await loginPage.type(PASSWORD_SELECTOR, config.password);

  await loginPage.click(LOGIN_BUTTON_SELECTOR);

  await loginPage.waitForLoadState('networkidle');

  return loginPage;
}

async function removeImageLoading(page: Page) {
  await page.route('**/*', (route) => {
    if (route.request().resourceType() == 'image') {
      return route.abort();
    }
    return route.continue();
  });
}

async function setupPlaywright() {
  const bannerCookie: CookieParam = {
    name: 'real_cookie_banner-blog:2',
    value:
      '1679814474:d7c6e78c-27a9-40e4-b149-2fe1bfe0822e:ee3e51490e73d32bf3aeb84c1d945a19:{"4":[52,51],"5":[3552,462,59,58,57,55,53]}',
    url: config.start_website,
  };
  const browser = await playwright.firefox.launch({ headless: false });

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

async function goToLoginPage(page: Page) {
  await page.goto(config.login_site);
  return page;
}

async function goToDistributions(mainPage: Page) {
  await mainPage.waitForLoadState('networkidle');
  await mainPage.goto(config.data_page);

  return mainPage;
}

function mapAllFoodLocations(jqueryRoot: cheerio.Root): FoodLocationData[] {
  const foodLocations: FoodLocationData[] = [];

  jqueryRoot(TABLE_ROW_SELECTOR).each((index, element) => {
    const tableDataRow = jqueryRoot(element).find('td');

    //first index is ussually table headers that is why this if check is present
    if (index == 0) return true;

    foodLocations.push(mapToFoodLocation(tableDataRow, jqueryRoot));
  });
  return foodLocations;
}

function mapToFoodLocation(
  tableDataRow: cheerio.Cheerio,
  jqueryRoot: cheerio.Root
): FoodLocationData {
  const mappedRow: FoodLocationData = {
    dateTime: jqueryRoot(tableDataRow[0]).text(),
    empty: jqueryRoot(tableDataRow[1]).text(),
    location: jqueryRoot(tableDataRow[2]).text(),
    helper: jqueryRoot(tableDataRow[3]).text(),
    isBigAmount: jqueryRoot(tableDataRow[4]).text(),
    extraDistribution: jqueryRoot(tableDataRow[5]).text(),
  };

  return mappedRow;
}

function isHeadersValid(jquery: cheerio.Root): Boolean {
  var isHeadersEqual: Boolean = false;

  jquery(TABLE_ROW_SELECTOR).each((_, tableRows) => {
    const tableHeaderRow = jquery(tableRows).find('th');
    const newHeader = mapToFoodLocation(tableHeaderRow, jquery);

    isHeadersEqual = headerEquals(newHeader);
  });
  return isHeadersEqual;
}

async function extractTableRows(dataPage: Page) {
  const dataHTML = dataPage.content();

  dataHTML.then((content) => {
    const $ = cheerioModule.load(content);

    if (!isHeadersValid($)) {
      console.log('Headers are not equal');
    }

    const foodLocations: FoodLocationData[] = mapAllFoodLocations($);
    console.log(foodLocations);

    return foodLocations;
  });
}

setupPlaywright()
  .then((mainPage) => goToLoginPage(mainPage))
  .then((loginPage) => login(loginPage))
  .then((mainPage) => goToDistributions(mainPage))
  .then((dataPage) => extractTableRows(dataPage));
