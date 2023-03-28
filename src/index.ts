import { start } from './config/setupPlaywright';

import { login, goToLoginPage } from './navigation/login';
import { goToDistributions } from './navigation/distribution';
import TableDataExtractor from './tableDataExtract/TableDataExtractorts';
import FoodLocationState from './state/food_locations_state/FoodLocationState';
import path from 'path';

const TABLE_ROW_SELECTOR = 'table > tbody > tr';

const tableDataExtractor: TableDataExtractor = new TableDataExtractor(
  TABLE_ROW_SELECTOR
);

const state: FoodLocationState = new FoodLocationState(
  path.join('src', 'state')
);

start()
  .then((mainPage) => goToLoginPage(mainPage))
  .then((loginPage) => login(loginPage))
  .then((mainPage) => goToDistributions(mainPage))
  .then((dataPage) => tableDataExtractor.extractAndFilter(dataPage))
  .then((foodLocations) => state.evaluateState(foodLocations));
