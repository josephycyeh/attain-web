import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../homeScreen/homeScreen'
import ScannerScreen from '../scannerScreen/scannerScreen'
import CartScreen from '../cartScreen/cartScreen.js'
import { Ionicons } from '@expo/vector-icons'; 


const Tab = createBottomTabNavigator();

export default function App() {
  const HomeIcon = (focused) => {

    return focused ? <Ionicons name="ios-home-sharp" size={24} color="black" /> : <Ionicons name="ios-home-outline" size={24} color="black" />
  }
  const ScanIcon = (focused) => {
    return focused ? <Ionicons name="scan-sharp" size={24} color="black" /> : <Ionicons name="scan-outline" size={24} color="black" />
  }
 
  const CartIcon = (focused) => {
    return focused ? <Ionicons name="cart-sharp" size={24} color="black" /> : <Ionicons name="ios-cart-outline" size={24} color="black" />
  }
  
  return (
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false, tabBarIcon: ({focused}) => HomeIcon(focused)}}/>
        <Tab.Screen name="Scan" component={ScannerScreen} options={{ headerShown: false, tabBarIcon: ({focused}) => ScanIcon(focused)}} />
        <Tab.Screen name="Cart" component={CartScreen} options={{ headerShown: false, tabBarIcon: ({focused}) => CartIcon(focused)}}/>
      </Tab.Navigator>
  );
}