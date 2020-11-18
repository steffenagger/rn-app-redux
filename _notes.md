# Notes

`FlatList` is *not* working with `Realm.Collection`.

Working directly with `Realm.Object`s is hard.
  - Can't be destructored (`{...object}`).
  - Is the opposite of Immutable.
  - Will throw on property accessors, if no longer valid.

Issue: Converting `Realm.Object` & `Realm.Collection` (incl.`Realm.Results` & `Realm.List`) to flat structures.
Currently I'm using `toJSON()` for this, but this will not suffice for circular structures.

Implement a `toFlatStructure()`? How to deal with Linked Objects?

`realm.objectForPrimaryKey(type, key)`... maybe introduce `realm.updateForPrimaryKey(type, key, updates)`?

Redux dies (kills app) when adding an item containing `ObjectId`.
Investigate why!

`RealmInsertionModel` blocks defining functions on models (this is actually my own fault... not in this project though - my apologies).

`Realm.Result.addListener`s callback payload consists of `newModifications` & `oldModifications` (among others.
These are a bit hard to understand, when the collection is live-updated. Are these meant for comparing to a snapshot? Or how do I obtain a collection where the indices are guaranteed for `deletion`/`oldModifications`?

## Suggestions

There are two very different ways of approaching this. Realm has Frozen Objects, but as I understand Frozen Objects, these are essentially a snapshot, without the possibility of subscribing to changes. It seems like a lot of work has to be changed/implemented for this to work well in React context.

### Frozen Objects

### Additional tooling / A Realm RN Toolbox

Extend `react-realm-context` with hooks (simple implementation).

## TODO
- [ ] Fix `RealmInsertionModel` to allow Models to have helper functions defined.

# Approach

Introduce redux, fetch from it, alter through it.
