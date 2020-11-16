import Realm from 'realm';

export default class Item extends Realm.Object {
  static schema = {
    name: 'Item',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      itemNo: 'int',
      text: 'string?',
    },
  };
}
