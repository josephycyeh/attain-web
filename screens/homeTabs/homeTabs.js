import * as React from "react";
import { Text, View, PixelRatio } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../homeScreen/homeScreen";
import BrowseScreen from "../browseScreen/browseScreen";
import ScannerScreen from "../scannerScreen/scannerScreen";
import CartScreen from "../cartScreen/cartScreen.js";
import OrderScreen from "../orderScreen/orderScreen.js";

import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const fontScale = PixelRatio.getFontScale()

const fontScalerCalculator = (scaler) => {

  if (scaler >= 1.4) {
    return 1.25
  }

  if (scaler >= 1.2) {
    return 1.2
  }

  if (scaler >= 1.1) {
    return 1.1
  }

  return 1
}
const fontScaler = fontScalerCalculator(fontScale)

export default function App() {
  const HomeIcon = (focused) => {
    return focused ? (
      <Ionicons name="ios-home-sharp" size={24} color="black" />
    ) : (
      <Ionicons name="ios-home-outline" size={24} color="black" />
    );
  };
  const ScanIcon = (focused) => {
    return focused ? (
      <Ionicons name="scan-sharp" size={24} color="black" />
    ) : (
      <Ionicons name="scan-outline" size={24} color="black" />
    );
  };

  const CartIcon = (focused) => {
    return focused ? (
      <Ionicons name="cart-sharp" size={24} color="black" />
    ) : (
      <Ionicons name="ios-cart-outline" size={24} color="black" />
    );
  };

  const ExploreIcon = (focused) => {
    return focused ? (
      <Ionicons name="file-tray-stacked-sharp" size={24} color="black" />
    ) : (
      <Ionicons name="file-tray-stacked-outline" size={24} color="black" />
    );
  }

  const OrderIcon = (focused) => {
    return focused ? (
      <Ionicons name="ios-receipt-sharp" size={24} color="black" />
    ) : (
      <Ionicons name="ios-receipt-outline" size={24} color="black" />
    );
  }

  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarLabelStyle: {
        fontSize: 15 / fontScale,
      },
    })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => HomeIcon(focused),
        }}
      />

      <Tab.Screen
        name="Browse"
        component={BrowseScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => ExploreIcon(focused),
        }}
      />
      <Tab.Screen
        name="Scan"
        component={ScannerScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => ScanIcon(focused),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrderScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => OrderIcon(focused),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => CartIcon(focused),
        }}
      />
    </Tab.Navigator>
  );
}
