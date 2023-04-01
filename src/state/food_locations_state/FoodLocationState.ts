import fs from 'fs/promises';
import path from 'path';
import { compareFoodLocations } from '../../helpers/equalityHeaderCheck';

class FoodLocationState {
  pathToFile: string;
  filename: string = 'location_state.json';
  fullPath: string;
  emptyList = [];

  constructor(filePath: string) {
    this.pathToFile = filePath;
    this.fullPath = path.join(this.pathToFile, this.filename);
  }

  evaluateState(
    foodLocations: FoodLocationData[]
  ): Promise<FoodLocationData[]> {
    return this.readFile().then((data) => {
      if (data.length == 0) {
        fs.writeFile(this.fullPath, JSON.stringify(foodLocations));
        return data;
      } else {
        const newFilteredData = foodLocations.filter((newFoodLocation) => {
          const sameValue = data.filter((oldFoodLocation) =>
            compareFoodLocations(newFoodLocation, oldFoodLocation)
          );
          if (sameValue.length == 0) {
            return true;
          } else {
            return false;
          }
        });
        if (newFilteredData.length > 0) {
          data.push(...newFilteredData);
          fs.writeFile(this.fullPath, JSON.stringify(data));
        }
        return newFilteredData;
      }
    });
  }

  async readFile(): Promise<FoodLocationData[]> {
    return fs
      .readFile(this.fullPath)
      .then((data) => {
        return JSON.parse(data.toString());
      })
      .catch((err) => {
        return this.emptyList;
      });
  }
}

export default FoodLocationState;
