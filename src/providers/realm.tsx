import {ObjectId} from 'bson';
import React, {useContext} from 'react';
import Realm from 'realm';
import Item from '../models/item';

// note: kept to a simple local instance, as difficulties should be visible.

const TEST_ITEM_AMOUNT = 200;

const realm = new Realm({schema: [Item]});

// todo: move...
if (realm.objects(Item).length < 1) {
  realm.write(() => {
    for (let i = 1; i <= TEST_ITEM_AMOUNT; i++) {
      realm.create(Item, {
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

const useRealm = () => {
  const instance = useContext(RealmContext);
  if (instance == null) {
    throw new Error('useRealm() called outside of a RealmProvider?');
  }
  return instance;
};

export {RealmProvider, useRealm};
