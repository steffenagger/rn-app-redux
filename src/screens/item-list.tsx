import React, {useEffect} from 'react';
import {FlatList} from 'react-native';
import {Dispatch} from 'redux';
import {connect} from 'react-redux';
import {StackScreenProps} from '@react-navigation/stack';
import {ListItem} from '../components/list-item';
import RealmItem, {RealmItemPlain, toFlatStructure} from '../models/realm-item';
import {GlobalState} from '../store';
import * as actions from '../store/actions';
import {useRealm} from '../providers/realm';
import {NavigationStackParamList} from '../../App';
import {EntityChangeset} from '../types';
import {SafeContainer} from '../components/styled';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;
type NavigationProps = StackScreenProps<NavigationStackParamList, 'List'>;
type Props = StateProps & DispatchProps & NavigationProps;

const ListScreen: React.FC<Props> = ({
  items,
  setItems,
  applyChangeset,
  navigation,
}) => {
  const realm = useRealm();
  useEffect(() => {
    console.log('Running ListScreen -> useEffect');
    const itemsCollection = realm.objects(RealmItem).sorted('itemNo');
    const data = itemsCollection.map((x) => toFlatStructure(x));
    setItems(data);

    itemsCollection.addListener((collection, changes) => {
      try {
        const inserts = changes.insertions.map((i) => ({
          index: i,
          value: toFlatStructure(collection[i]),
        }));
        const updates = changes.oldModifications.map((i) => ({
          index: i,
          value: toFlatStructure(collection[i]),
        }));
        const deletions = [...changes.deletions];

        // check if noop (initial trigger)
        if (inserts.length || updates.length || deletions.length) {
          const changeset: EntityChangeset = {
            inserts,
            updates,
            deletions: changes.deletions,
          };

          applyChangeset(changeset);
        }
      } catch (err) {
        console.error(err);
      }
    });

    // todo: removeListener
  }, [realm, setItems, applyChangeset]);

  const renderItem = ({item}: {item: RealmItemPlain}) => (
    <ListItem item={item} onPress={() => navigation.push('EditItem', {item})} />
  );
  const keyExtractor = (item: RealmItemPlain) => `realm-item-${item._id}`;

  return (
    <SafeContainer>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </SafeContainer>
  );
};

const mapStateToProps = (state: GlobalState) => ({
  items: state.items.items,
});

const mapDispatchToProps = (dispatch: Dispatch, _: StateProps) => ({
  setItems: (items: RealmItemPlain[]) => dispatch(actions.setItems(items)),
  applyChangeset: (changeset: EntityChangeset<RealmItemPlain>) =>
    dispatch(actions.applyChangeset(changeset)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ListScreen);
