import {ObjectId} from 'bson';
import React, {useContext} from 'react';
import Realm from 'realm';
import RealmItem from '../models/realm-item';

// note: kept to a simple local instance, as difficulties should be visible.

const TEST_ITEM_AMOUNT = 200;

export const realm = new Realm({schema: [RealmItem]});

// todo: (re)move...
if (realm.objects(RealmItem).length < 1) {
  realm.write(() => {
    for (let i = 1; i <= TEST_ITEM_AMOUNT; i++) {
      realm.create(RealmItem, {
        _id: new ObjectId(),
        itemNo: i,
      });
    }
  });
}

const RealmContext: React.Context<Realm> = React.createContext(realm);

const RealmProvider: React.FC = ({children}) => {
  return (
    <RealmContext.Provider value={realm}>{children}</RealmContext.Provider>
  );
};

// Expose hook
const useRealm = () => {
  const instance = useContext(RealmContext);
  if (instance == null) {
    throw new Error('useRealm() called outside of a RealmProvider?');
  }
  return instance;
};

export {RealmProvider, useRealm};
