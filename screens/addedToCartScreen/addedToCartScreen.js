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
});

export default function AddedToCartScreen({ navigation }) {
  const onBackToScanPressed = () => {
    navigation.goBack();
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.safeContainer}>
        <View style={styles.itemContainer}>
          <Image
            style={styles.itemImage}
            source={{ uri: "https://picsum.photos/200" }}
          />
          <View style={styles.itemTextContainer}>
            <Text style={styles.boldMainText}>Cheetos Puff</Text>
            <View style={styles.itemDetailLine}>
              <Text style={styles.boldSecondaryText}>UPC</Text>
              <Text style={styles.boldSecondaryText}>2139878</Text>
            </View>
            <View style={styles.itemDetailLine}>
              <Text style={styles.boldSecondaryText}>Unit Size</Text>
              <Text style={styles.boldSecondaryText}>24</Text>
            </View>
            <View style={styles.itemDetailLine}>
              <Text style={styles.boldSecondaryText}>Category</Text>
              <Text style={styles.boldSecondaryText}>Food > Snacks</Text>
            </View>
          </View>
        </View>
        <View style={styles.quantityContainer}>
          <Text style={styles.boldMainText}>Quantity</Text>
          <Text style={styles.boldMainText}>2</Text>
        </View>
        <View style={styles.pricingContainer}>
          <View style={styles.itemDetailLine}>
            <Text style={styles.boldMainText}>Price</Text>
            <Text style={styles.boldMainText}>$15.27</Text>
          </View>
          <View style={styles.itemDetailLine}>
            <Text style={styles.boldMainText}>Est. Taxes</Text>
            <Text style={styles.boldMainText}>$2.32</Text>
          </View>
          <View style={styles.itemDetailLine}>
            <Text style={styles.boldMainText}>Total Amount</Text>
            <Text style={styles.boldMainText}>$17.59</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.mainButton}>
            <Text style={styles.mainButtonText}>Add To Cart</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.mainButton}
            onPress={onBackToScanPressed}
          >
            <Text style={styles.mainButtonText}>Back To Scan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
