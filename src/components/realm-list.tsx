import React from 'react';
import {CollectionChangeCallback} from 'realm';

export type RealmListState<MappedModel> = {
  realmItems?: Array<MappedModel>;
};

export abstract class RealmListComponent<
  RealmModel,
  MappedModel,
  Props = unknown,
  State = unknown,
  SnapShot = unknown
> extends React.PureComponent<
  Props,
  State & RealmListState<MappedModel>,
  SnapShot
> {
  // abstract declarations for the derived component to implement:
  abstract state: State & RealmListState<MappedModel>;
  abstract realmCollection(): Realm.Collection<RealmModel>;
  abstract realmObjectMapper(item: RealmModel): MappedModel;

  constructor(props: Props) {
    super(props);

    let collection: Realm.Collection<RealmModel> | undefined;

    // Extend componentWillUnmount if defined.
    // (This is "just" to avoid overriding componentWillUnmount on derived component)
    const cdm = this.constructor.prototype.componentDidMount;
    const cwu = this.constructor.prototype.componentWillUnmount;

    this.constructor.prototype.componentDidMount = (...args: Array<any>) => {
      cdm?.call(this, ...args);

      // Realm.Collection to map & subscribe for changes.
      collection = this.realmCollection();

      // Initial state
      this.setState({
        realmItems: collection.map((m) => this.realmObjectMapper(m)),
      });

      collection.addListener(this._realmEventHandler);
    };

    this.constructor.prototype.componentWillUnmount = (...args: Array<any>) => {
      cwu?.call(this, ...args);

      // Unsubscribe event handler
      collection?.removeListener(this._realmEventHandler);
    };
  }

  private _realmEventHandler: CollectionChangeCallback<RealmModel> = (
    collection,
    changes,
  ) => {
    try {
      const inserts = changes.insertions.map((i) => ({
        index: i,
        value: this.realmObjectMapper(collection[i]),
      }));
      const updates = changes.oldModifications.map((i) => ({
        index: i,
        value: this.realmObjectMapper(collection[i]),
      }));
      const deletions = [...changes.deletions];

      // check if noop (initial trigger)
      if (inserts.length || updates.length || deletions.length) {
        // todo: opt out sooner?
        const items = this.state.realmItems?.slice() ?? [];
        // remove deleted items
        for (let i = deletions.length - 1; i >= 0; i--) {
          const targetIndex = deletions[i];
          items.splice(targetIndex, 1);
        }

        // exchange updated items
        for (let i = updates.length - 1; i >= 0; i--) {
          const change = updates[i];
          items[change.index] = change.value;
        }

        // insert added items
        for (let i = inserts.length - 1; i >= 0; i--) {
          const change = inserts[i];
          items.splice(change.index, 0, change.value);
        }

        this.setState({realmItems: items});
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
}
