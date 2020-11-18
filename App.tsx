import 'react-native-gesture-handler';
import * as React from 'react';
import {Provider as StoreProvider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {RealmProvider} from './src/providers/realm';
import {configureStore} from './src/store';
import {RealmItemPlain} from './src/models/realm-item';

import ListScreen from './src/screens/item-list';
import CreateItemScreen from './src/screens/create-item';
import EditItemScreen from './src/screens/edit-item';
import {Button} from 'react-native';

export type NavigationStackParamList = {
  List: undefined;
  CreateItem: undefined;
  EditItem: {item: RealmItemPlain};
};

const store = configureStore();
const Stack = createStackNavigator<NavigationStackParamList>();

export default function App() {
  return (
    <RealmProvider>
      <StoreProvider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="List">
            <Stack.Screen
              name="List"
              component={ListScreen}
              options={({navigation}) => ({
                headerRight: () => (
                  <Button
                    onPress={() => navigation.push('CreateItem')}
                    title="Add"
                  />
                ),
              })}
            />
            <Stack.Screen name="CreateItem" component={CreateItemScreen} />
            <Stack.Screen
              name="EditItem"
              component={EditItemScreen}
              options={({route}) => ({title: route.params.item._id})}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </StoreProvider>
    </RealmProvider>
  );
}
