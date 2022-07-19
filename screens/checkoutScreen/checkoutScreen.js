import react, { useEffect, useState, useContext } from "react";
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
import {
  useGetCartsQuery,
  useSubmitOrderMutation,
} from "../../generated/graphql";
import { UserContext } from "../../context/userContext";
import { format, add } from "date-fns";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "white",
  },
  safeContainer: {
    marginHorizontal: 20,
    backgroundColor: "white",
    marginTop: 0,
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
  boldMainText: {
    fontSize: 20,
    fontWeight: "600",
  },
  boldSecondaryText: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 0,
  },
  itemDetailLine: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 0,
  },
  itemDetailContainer: {
    flexDirection: "column",
    justifyContent: "center",

    height: 55,
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
  titleContainer: {
    marginBottom: 0,
  },
  titleText: {
    fontSize: 45,
    fontWeight: "600",
  },
  summaryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 0,
    marginTop: 20,
  },
  boldMainTextColor: {
    fontSize: 25,
    fontWeight: "600",
    color: "#3C95FF",
  },
  checkoutButton: {
    backgroundColor: "white",
    width: 150,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  checkoutButtonText: {
    fontSize: 17,
    color: "#3C95FF",
    fontWeight: "600",
    textAlign: "center",
  },
  secondaryTitleText: {
    fontSize: 20,
    fontWeight: "600",
    color: "black",
  },
  itemsContainer: {
    marginBottom: 10,
    marginTop: 20,
    // flexDirection: "column",
    // justifyContent:"space-between"
  },
  itemContainer: {
    borderStyle: "solid",
    borderWidth: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    borderRadius: 20,
    padding: 10,
  },
  orderSummaryDetail: {
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "black",
    padding: 10,
    marginTop: 20,
  },
});

const getTotal = (items) => {
    let total = 0;
    for (let i = 0; i < items.length; i++) {
        total = total + items[i].price * items[i].quantity
    }
    return Math.round(total*100)/100;
};

export default function CheckoutScreen({ navigation, route }) {
  const { isLoggedIn, setIsLoggedIn, user } = useContext(UserContext);

  const [
    submitOrder,
    {
      loading: submitOrderLoading,
      data: submitOrderData,
      error: submitOrderError,
    },
  ] = useSubmitOrderMutation();


  const cart = user.cart

  const submitOrderClicked = () => {
    try {
      submitOrder({
        variables: {
          submitOrderInput: {
            cartId: cart.id,
            userId: user.id,
          },
        },
      });
    } catch (err) {}

    navigation.navigate("OrderSubmittedScreen");
  };


  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          zIndex: 5,
          display: "flex",
          justifyContent: "space-between",
          paddingHorizontal: 35,
          flexDirection: "row",
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: 65,
          backgroundColor: "#3C95FF",
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
      >
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Text style={styles.boldMainText}>Subtotal</Text>
          <Text style={styles.boldMainText}>${getTotal(cart.cartItems)}</Text>
        </View>
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          {cart.cartItems.length > 0 && (
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={submitOrderClicked}
            >
              <Text style={styles.checkoutButtonText}>Checkout</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.safeContainer}>
        <View style={styles.itemsContainer}>
          <Text style={styles.secondaryTitleText}>Order Summary</Text>
          <View style={styles.orderSummaryDetail}>
            <View style={styles.itemDetailContainer}>
              <View style={styles.itemDetailLine}>
                <Text style={styles.boldSecondaryText}>Order Date</Text>
                <Text style={styles.boldSecondaryText}>
                  {format(new Date(), "MM/dd/yyyy")}
                </Text>
              </View>
            </View>
            <View style={styles.itemDetailContainer}>
              <View style={styles.itemDetailLine}>
                <Text style={styles.boldSecondaryText}>Est Delivery</Text>
                <Text style={styles.boldSecondaryText}>
                  {format(add(new Date(), { days: 3 }), "MM/dd/yyyy")}
                </Text>
              </View>
            </View>
            <View style={styles.itemDetailContainer}>
              <View style={styles.itemDetailLine}>
                <Text style={styles.boldSecondaryText}>Subtotal</Text>
                <Text style={styles.boldSecondaryText}>${cart.subtotal}</Text>
              </View>
            </View>
            <View style={styles.itemDetailContainer}>
              <View style={styles.itemDetailLine}>
                <Text style={styles.boldSecondaryText}>No. of items</Text>
                <Text style={styles.boldSecondaryText}>
                  {cart.cartItems.length}
                </Text>
              </View>
            </View>
            <View style={styles.itemDetailContainer}>
              <View style={styles.itemDetailLine}>
                <Text style={styles.boldSecondaryText}>Store</Text>
                <Text style={styles.boldSecondaryText}>Pete's Gas</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
