import path from 'path';
import FoodLocationState from './food_locations_state/FoodLocationState';

const state: FoodLocationState = new FoodLocationState(
  path.join('src', 'state')
);

export { state };
