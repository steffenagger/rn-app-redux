import {createStore} from 'redux';
import {combinedReducers} from './reducers';

export type GlobalState = ReturnType<typeof combinedReducers>;

export const configureStore = () => {
  const store = createStore(combinedReducers);

  return store;
};
