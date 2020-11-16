import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {RealmProvider} from './src/providers/realm';

import ListScreen from './src/screens/list';
import ItemScreen from './src/screens/item';

const Stack = createStackNavigator();

export default function App() {
  return (
    <RealmProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="List">
          <Stack.Screen name="List" component={ListScreen} />
          <Stack.Screen name="Item" component={ItemScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </RealmProvider>
  );
}
