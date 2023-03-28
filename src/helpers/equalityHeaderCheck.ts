import { tableHeaderMap } from '../constants/tableHeader';
import FoodLocationData from '../model/foodLocationData';

function headerEquals(other: FoodLocationData): Boolean {
  if (
    tableHeaderMap.dateTime != other.dateTime ||
    tableHeaderMap.empty != other.empty ||
    tableHeaderMap.extraDistribution != other.extraDistribution ||
    tableHeaderMap.helper != other.helper ||
    tableHeaderMap.isBigAmount != other.isBigAmount ||
    tableHeaderMap.location != other.location
  ) {
    return false;
  }
  return true;
}

export { headerEquals };
