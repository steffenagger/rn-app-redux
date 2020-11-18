import {RealmItemPlain} from '../models/realm-item';
import {EntityChangeset} from '../types';

export type Action<T = undefined> = {
  type: types;
  payload: T;
};

export enum types {
  ITEMS_SET = 'ITEMS_SET',
  ITEMS_APPLY_CHANGESET = 'ITEMS_APPLY_CHANGESET',
}

export const setItems = (
  items: RealmItemPlain[],
): Action<{items: RealmItemPlain[]}> => ({
  type: types.ITEMS_SET,
  payload: {items},
});

export const applyChangeset = (
  changeset: EntityChangeset<RealmItemPlain>,
): Action<{
  changeset: EntityChangeset<RealmItemPlain>;
}> => ({
  type: types.ITEMS_APPLY_CHANGESET,
  payload: {changeset},
});
