import { Page } from 'playwright';
import { start } from '../config/setupPlaywright';
import { goToDistributions } from '../navigation/distribution';
import { goToLoginPage, login } from '../navigation/login';
import { state } from '../state/configuredState';
import TableDataExtractor from '../tableDataExtract/TableDataExtractorts';

const TABLE_ROW_SELECTOR = 'table > tbody > tr';

const tableDataExtractor: TableDataExtractor = new TableDataExtractor(
  TABLE_ROW_SELECTOR
);

async function gotToDistributionPage(): Promise<Page> {
  return start()
    .then((mainPage) => goToLoginPage(mainPage))
    .then((loginPage) => login(loginPage))
    .then((mainPage) => goToDistributions(mainPage));
}

async function extractTableData(
  distributionPage: Page
): Promise<FoodLocationData[]> {
  return tableDataExtractor.extractAndFilter(distributionPage);
}

async function evaluateFoodlocatios(foodLocations: FoodLocationData[]) {
  return state.evaluateState(foodLocations);
}

function startApp(): Promise<Page> {
  return gotToDistributionPage();
}

export { startApp, extractTableData, evaluateFoodlocatios };
