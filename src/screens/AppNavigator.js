import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from './HomeScreen';
import AddNoteScreen from './AddNoteScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Note App" component={HomeScreen}/>
      <Stack.Screen name="AddNote" component={AddNoteScreen}/>
      <Stack.Screen name="Edit Note" component={AddNoteScreen}/>
    </Stack.Navigator>
  );
};

export default AppNavigator;
