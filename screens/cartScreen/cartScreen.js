import react, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Button,
  TouchableOpacity,
  Image,
  PixelRatio
} from "react-native";
import Checkbox from "expo-checkbox";
import { NavigationContainer } from "@react-navigation/native";
import Text from '../../components/Text'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { BarCodeScanner } from "expo-barcode-scanner";
import CheckoutScreen from "../checkoutScreen/checkoutScreen.js";
import OrderSubmittedScreen from "../orderSubmittedScreen/orderSubmittedScreen.js";
import NumericInput from "react-native-numeric-input";
import {
  useGetCartsQuery,
  useUpdateItemInCartMutation,
} from "../../generated/graphql";
import { Ionicons } from "@expo/vector-icons";

import { UserContext } from "../../context/userContext";

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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "white",
  },
  scrollView: {
    paddingHorizontal: 20,
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
//   itemContainer: {
//     flex: 1,
//     flexDirection: "column",
//     flexWrap: "wrap",
//     marginTop: 10,
//     marginBottom: 100,
//   },
  boldMainText: {
    fontSize: 20,
    fontWeight: "600",
  },
  boldSecondaryText: {
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 10,
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
  titleContainer: {
    marginBottom: 10,
    marginTop: 20,
  },
  titleText: {
    fontSize: 45,
    fontWeight: "600",
  },
  summaryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
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
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  checkoutButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#3C95FF",
    textAlign: "center",
  },
  secondaryTitleText: {
    fontSize: 20,
    fontWeight: "600",
    color: "black",
    marginBottom: 10,
  },
  itemsContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  itemContainer: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 10
  },
  itemName: {
    marginTop: 0,
    marginBottom: 10,
    fontSize: 15,
    fontWeight: "600",
  },
  itemContent: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  itemTotalCost: {
    marginLeft: "auto", 
    marginRight: "auto",
    marginTop: 10
  },
  withCheckBoxContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderStyle: "solid",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0
  },
  checkBox: {
    marginRight: 10,
    justifyContent: "center"
  },
  itemManagement: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
});

const getTotal = (items) => {
    let total = 0;
    for (let i = 0; i < items.length; i++) {
        total = total + items[i].price * items[i].quantity
    }
    return total;
};

function CartScreenComponent({ navigation }) {
  const { isLoggedIn, setIsLoggedIn, user } = useContext(UserContext);
  const { loading, data, error } = useGetCartsQuery({
    fetchPolicy: "cache-and-network",
    variables: {
      getCartsInput: {
        userId: user.id,
      },
    },
    pollInterval: 500,
  });

  const [
    updateItemInCart,
    {
      loading: updateItemInCartLoading,
      data: updateItemInCartData,
      error: updateItemInCartError,
    },
  ] = useUpdateItemInCartMutation();

  if (loading && !data) return <Text>loading.....</Text>;
  if (error) return <Text>Error.....</Text>;

  const cart = data.carts[0];
  const [checks, setChecks] = useState(new Array(cart.cartItems.length).fill(false));
  const goToCheckout = () => {
    navigation.navigate("CheckoutScreen", {
      cartId: cart.id,
    });
  };

  const onEditQuantity = (cartId, itemId, quantity) => {
    updateItemInCart({
      variables: {
        updateItemInCartInput: {
          cartId: cartId,
          itemId: itemId,
          quantity: quantity,
        },
      },
    });
  };
  const checkMarkItem = (index) => {
    let newArr = checks
    newArr[index] = !newArr[index]
    console.log(newArr)
    setChecks(newArr)
  }
  const deleteItems = () => {
    for (let i = 0; i < cart.cartItems.length; i++) {
        if (checks[i]) {
            updateItemInCart({
                variables: {
                  updateItemInCartInput: {
                    cartId: cart.id,
                    itemId: cart.cartItems.itemId,
                    quantity: 0,
                  },
                },
              });
        }
      }
    
  }
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
              onPress={goToCheckout}
            >
              <Text style={styles.checkoutButtonText}>Continue</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.itemsContainer}>
            <View style={styles.itemManagement}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Checkbox
                        value={true}  
                    />
                    <Text style={[{
                            marginLeft: 10,
                            fontSize: 15,
                            fontWeight: "600",
                            justifyContent: "center"}]}>
                        Select all items
                    </Text>
                </View>
                <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      width: 60,
                      borderStyle: "solid",
                      borderBottomWidth: 1,
                    }}
                    onPress={deleteItems}
                  >
                    <Text>Delete</Text>
                  </TouchableOpacity>
            </View>
          {cart.cartItems.length == 0 && (
            <View style={{ marginTop: "50%" }}>
              <Text
                style={[styles.secondaryTitleText, { textAlign: "center" }]}
              >
                No Items In Cart
              </Text>
              <Text
                style={[
                  styles.thirdTitleText,
                  { marginTop: "5%", textAlign: "center" },
                ]}
              >
                Add Items To Cart To Checkout
              </Text>
            </View>
          )}
          {cart.cartItems.map((cartItem, index) => {
            return (
              <View style={styles.withCheckBoxContainer}>
                <View style={styles.checkBox}>
                    <Checkbox
                        value={checks[index]}  
                        onChange={(index) => checkMarkItem(index)}
                    />
                </View>
              <View key={cartItem.id} style={styles.itemContainer}>
                <View style={styles.itemName}>
                    <Text>{cartItem.name}</Text>
                </View>
                <View style={styles.itemContent}>
                
                <Image style={styles.itemImage} 
                source={{
                    uri: cartItem.image
                    ? cartItem.image
                    : "https://via.placeholder.com/150",
                }} />
                <View style={styles.itemTextContainer}>
                    <Text style={[
                        styles.boldSecondaryText,
                        { textAlign: "left", marginBottom: 5 },
                        ]}>
                        Sku#: {cartItem.id}
                    </Text>
                    <Text style={[
                        styles.boldSecondaryText,
                        { textAlign: "left", marginBottom: 5 },
                        ]}>
                        Unit Size: {cartItem.unit_size}ct
                    </Text>
                    <Text style={[
                        styles.boldSecondaryText,
                        { textAlign: "left", marginBottom: 5 },
                        ]}>
                        Case Cost: {cartItem.price}
                    </Text>
                    <Text style={[
                        styles.boldSecondaryText,
                        { textAlign: "left", marginBottom: 5 },
                        ]}>
                        Unit Cost: {Math.round(100*cartItem.price/cartItem.unit_size)/100}
                    </Text>
                </View>
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    paddingVertical: 20,

                  }}
                >
                  <NumericInput
                    initValue={cartItem.quantity}
                    value={cartItem.quantity}
                    totalHeight={30}
                    totalWidth={80}
                    rounded
                    iconSize={100}
                    leftButtonBackgroundColor={"#88BEFF"}
                    rightButtonBackgroundColor={"#88BEFF"}
                    onChange={(value) =>
                      onEditQuantity(cart.id, cartItem.item_id, value)
                    }
                  />
                  <Text style={styles.itemTotalCost}>
                    ${cartItem.price * cartItem.quantity}
                  </Text>
                </View>
                </View>
                </View>
                </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const CartStack = createStackNavigator();
export default function CartScreen() {
  return (
    <CartStack.Navigator screenOptions={({ route }) => ({
      headerTitleStyle: {
        fontSize: 25 / fontScale
      },
    })}>
      <CartStack.Screen
        name="CartScreen"
        component={CartScreenComponent}
        options={{ title: "Cart", headerShown: true }}
      />
      <CartStack.Screen
        name="CheckoutScreen"
        component={CheckoutScreen}
        options={{ title: "Checkout", headerShown: true }}
      />
    </CartStack.Navigator>
  );
}
