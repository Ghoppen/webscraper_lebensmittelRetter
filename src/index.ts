import { start } from './config/setupPlaywright';

import { login, goToLoginPage } from './navigation/login';
import { goToDistributions } from './navigation/distribution';
import TableDataExtractor from './tableDataExtract/TableDataExtractorts';

const TABLE_ROW_SELECTOR = 'table > tbody > tr';

const tableDataExtractor: TableDataExtractor = new TableDataExtractor(
  TABLE_ROW_SELECTOR
);

start()
  .then((mainPage) => goToLoginPage(mainPage))
  .then((loginPage) => login(loginPage))
  .then((mainPage) => goToDistributions(mainPage))
  .then((dataPage) => tableDataExtractor.extract(dataPage));
