import {RealmItemPlain} from '../../models/realm-item';
import {EntityChangeset} from '../../types';
import {Action, types} from '../actions';

type RealmItemsState = {
  items: Array<RealmItemPlain>;
};

const initialState: RealmItemsState = {
  items: [],
};

export default (state = initialState, action: Action<any>): RealmItemsState => {
  switch (action.type) {
    case types.ITEMS_SET: {
      console.info(types.ITEMS_SET, action.payload.items.length);
      return {
        ...state,
        items: [...action.payload.items],
      };
    }

    case types.ITEMS_APPLY_CHANGESET: {
      console.info(types.ITEMS_APPLY_CHANGESET, action.payload.changeset);
      const items = [...state.items];
      const changeset: EntityChangeset = action.payload.changeset;

      // Note: this implementation assumes the indices are sorted.

      // remove deleted items
      for (let i = changeset.deletions.length - 1; i >= 0; i--) {
        const targetIndex = changeset.deletions[i];
        items.splice(targetIndex, 1);
      }

      // exchange updated items
      for (let i = changeset.updates.length - 1; i >= 0; i--) {
        const change = changeset.updates[i];
        items[change.index] = change.value;
      }

      // insert added items
      for (let i = changeset.inserts.length - 1; i >= 0; i--) {
        const change = changeset.inserts[i];
        items.splice(change.index, 0, change.value);
      }

      return {
        ...state,
        items,
      };
    }

    default:
      return state;
  }
};
