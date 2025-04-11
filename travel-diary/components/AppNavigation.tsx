import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import TravelCamera from '../Screens/TravelCamera';
import Diary from '../Screens/Diary';

const Tab = createBottomTabNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ size }) => {
            let iconName = '';
            if (route.name === 'Camera') iconName = 'camera';
            else if (route.name === 'Travel Log') iconName = 'clipboard'; 
            return <Ionicons name={iconName} size={size} color="#6B4E71" />;
          },
          tabBarActiveTintColor: '#53687E',
          tabBarInactiveTintColor: '#6B4E71',
          tabBarShowLabel: true,
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 0, 
            position: 'absolute',
            bottom: 0, 
            left: 0, 
            right: 0,
            elevation: 10, 
          },
        })}
      >
        <Tab.Screen name="Camera" component={TravelCamera} />
        <Tab.Screen name="Travel Log" component={Diary} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
