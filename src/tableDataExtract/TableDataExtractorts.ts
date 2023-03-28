import { Page } from 'playwright';
import cheerioModule from 'cheerio';
import FoodLocationData from '../model/foodLocationData';

import { headerEquals } from '../helpers/equalityHeaderCheck';

class TableDataExtractor {
  rowSelector: string;

  constructor(tableRowSelector: string) {
    this.rowSelector = tableRowSelector;
  }

  private mapAllFoodLocations(jqueryRoot: cheerio.Root): FoodLocationData[] {
    const foodLocations: FoodLocationData[] = [];

    jqueryRoot(this.rowSelector).each((index, element) => {
      const tableDataRow = jqueryRoot(element).find('td');

      //first index is ussually table headers that is why this if check is present
      if (index == 0) return true;

      foodLocations.push(this.mapToFoodLocation(tableDataRow, jqueryRoot));
    });
    return foodLocations;
  }

  private mapToFoodLocation(
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

  private isHeadersValid(jquery: cheerio.Root): Boolean {
    var isHeadersEqual: Boolean = false;

    jquery(this.rowSelector).each((_, tableRows) => {
      const tableHeaderRow = jquery(tableRows).find('th');
      const newHeader = this.mapToFoodLocation(tableHeaderRow, jquery);

      isHeadersEqual = headerEquals(newHeader);
    });
    return isHeadersEqual;
  }

  async extract(dataPage: Page): Promise<FoodLocationData[]> {
    const dataHTML = dataPage.content();

    return dataHTML.then((content) => {
      const $ = cheerioModule.load(content);

      if (!this.isHeadersValid($)) {
        console.log('Headers are not equal');
      }

      const foodLocations: FoodLocationData[] = this.mapAllFoodLocations($);
      console.log(foodLocations);

      return foodLocations;
    });
  }
}

export default TableDataExtractor;
