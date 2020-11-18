import {combineReducers} from 'redux';
import items from './item-reducer';

export const combinedReducers = combineReducers({
  items, // name of the sub-state
});
