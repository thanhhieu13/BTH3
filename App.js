import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AppNavigator from './src/screens/AppNavigator';
import SettingsScreen from './src/screens/SettingScreen';
import { SettingsProvider } from './src/screens/SettingsContext';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'; // Import biểu tượng từ thư viện

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SettingsProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            name="Home"
            component={AppNavigator}
            options={{
              headerShown: false,
              tabBarIcon: ({ color, size }) => (
                <FontAwesome5 name="home" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <FontAwesome5 name="cogs" color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SettingsProvider>
  );
}
