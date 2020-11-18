import React from 'react';
import {FlatList} from 'react-native';
import {Dispatch} from 'redux';
import {connect} from 'react-redux';
import {StackScreenProps} from '@react-navigation/stack';
import {ListItem} from '../components/list-item';
import RealmItem, {RealmItemPlain} from '../models/realm-item';
import {GlobalState} from '../store';
import * as actions from '../store/actions';
import {realm} from '../providers/realm';
import {NavigationStackParamList} from '../../App';
import {EntityChangeset} from '../types';
import {SafeContainer} from '../components/styled';
import {RealmListComponent, RealmListState} from '../components/realm-list';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;
type NavigationProps = StackScreenProps<NavigationStackParamList, 'List'>;
type Props = StateProps & DispatchProps & NavigationProps;

class ListScreen extends RealmListComponent<RealmItem, RealmItemPlain, Props> {
  state: RealmListState<RealmItemPlain> = {};
  realmCollection(): Realm.Collection<RealmItem> {
    return realm.objects(RealmItem).sorted('itemNo');
  }
  realmObjectMapper = (item: RealmItem): RealmItemPlain => ({
    ...item.toJSON(),
    _id: item._id.toHexString(), // if left as ObjectId, the app crashes... I did not have time to investigate.
  });

  constructor(props: Props) {
    super(props);
  }

  renderItem = ({item}: {item: RealmItemPlain}) => (
    <ListItem
      item={item}
      onPress={() => this.props.navigation.push('EditItem', {item})}
    />
  );
  keyExtractor = (item: RealmItemPlain) => `realm-item-${item._id}`;

  render() {
    if (!this.state.realmItems) {
      return null;
    }

    return (
      <SafeContainer>
        <FlatList
          data={this.state.realmItems}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
        />
      </SafeContainer>
    );
  }
}

const mapStateToProps = (state: GlobalState) => ({
  items: state.items.items,
});

const mapDispatchToProps = (dispatch: Dispatch, _: StateProps) => ({
  setItems: (items: RealmItemPlain[]) => dispatch(actions.setItems(items)),
  applyChangeset: (changeset: EntityChangeset<RealmItemPlain>) =>
    dispatch(actions.applyChangeset(changeset)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ListScreen);
