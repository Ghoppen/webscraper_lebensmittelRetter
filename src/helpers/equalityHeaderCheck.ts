import { tableHeaderMap } from '../constants/tableHeader';

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

function compareFoodLocations(
  firstFoodLocation: FoodLocationData,
  secondFoodLocation: FoodLocationData
): Boolean {
  if (
    firstFoodLocation.dateTime != secondFoodLocation.dateTime ||
    firstFoodLocation.empty != secondFoodLocation.empty ||
    firstFoodLocation.extraDistribution !=
      secondFoodLocation.extraDistribution ||
    firstFoodLocation.helper != secondFoodLocation.helper ||
    firstFoodLocation.isBigAmount != secondFoodLocation.isBigAmount ||
    firstFoodLocation.location != secondFoodLocation.location
  ) {
    return false;
  }
  return true;
}

export { headerEquals, compareFoodLocations };
