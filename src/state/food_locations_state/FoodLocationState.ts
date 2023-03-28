import fs from 'fs/promises';
import path from 'path';

class FoodLocationState {
  pathToFile: string;
  filename: string = 'location_state.json';
  fullPath: string;
  emptyList = [];

  constructor(filePath: string) {
    this.pathToFile = filePath;
    this.fullPath = path.join(this.pathToFile, this.filename);
  }

  evaluateState(foodLocations: FoodLocationData[]) {
    this.readFile().then((data) => {
      if (data.length == 0) {
        fs.writeFile(this.fullPath, JSON.stringify(foodLocations));
      } else {
        console.log('Food locations:');
        console.log(foodLocations);
        console.log('read data');
        console.log(data);
        fs.writeFile(this.fullPath, JSON.stringify(foodLocations));
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
