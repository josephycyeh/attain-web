import react, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Button,
  TouchableOpacity,
  Image,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { BarCodeScanner } from "expo-barcode-scanner";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "white",
  },
  safeContainer: {
    marginHorizontal: 20,
    backgroundColor: "white",
    marginTop: 20,
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  logo: {
    width: 66,
    height: 58,
  },
  itemImage: {
    width: 120,
    height: 120,
  },
  itemContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  largeBoldMainText: {
    fontSize: 30,
    fontWeight: "600",
    marginBottom: 15,
  },
  boldMainText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
  },
  boldSecondaryText: {
    fontSize: 15,
    marginBottom: 10,
    fontWeight: "600",
  },
  itemDetailLine: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  itemTextContainer: {
    marginLeft: 20,
    flex: 2,
  },
  quantityContainer: {
    marginTop: 30,
    marginBottom: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  pricingContainer: {
    marginTop: 20,
    marginBottom: 50,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 0,
  },
  mainButton: {
    color: "white",
    backgroundColor: "#3C95FF",
    height: 45,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  mainButtonText: {
    fontSize: 20,
    color: "white",
  },
  centerView: {
    marginTop: 100,
    marginBottom: 50,
  },
});

export default function OrderSubmittedScreen({ navigation }) {
  const onBackToCartPressed = () => {
    navigation.goBack();
    navigation.popToTop();
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.safeContainer}>
        <View style={styles.centerView}>
          <Text style={styles.largeBoldMainText}>Order Submitted!</Text>
          <Text style={styles.boldMainText}>
            Keep track of your order status in the home page
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.mainButton}
            onPress={onBackToCartPressed}
          >
            <Text style={styles.mainButtonText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
