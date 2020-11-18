import {ObjectId} from 'bson';
import Realm from 'realm';

export interface RealmItemPlain {
  _id: string;
  itemNo: number;
  text?: string;
}

export default class RealmItem extends Realm.Object {
  _id!: ObjectId;
  itemNo!: number;
  text?: string;

  static schema = {
    name: 'RealmItem',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      itemNo: 'int',
      text: 'string?',
    },
  };
}
