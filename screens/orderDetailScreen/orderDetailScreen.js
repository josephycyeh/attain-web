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
  FlatList,
} from "react-native";
import { format, add } from "date-fns";

import Text from "../../components/Text"
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { BarCodeScanner } from "expo-barcode-scanner";
import NumericInput from "react-native-numeric-input";
import {
  useGetItemsQuery,
  useGetCartsQuery,
  useUpdateItemInCartMutation,
  useAddItemToCartMutation,
  useGetOrdersQuery,
} from "../../generated/graphql";

import { UserContext } from "../../context/userContext";
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
    width: 55,
    height: 55,
  },
  itemContainer: {
    flexDirection: "row",
    flexWrap: "wrap",

    justifyContent: "space-between",
  },
  itemInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  boldMainText: {
    fontSize: 20,
    fontWeight: "600",
  },
  boldSecondaryText: {
    fontSize: 15,
    marginBottom: 10,
    fontWeight: "600",
  },
  itemTextContainer: {
    marginLeft: 8,
  },
  quantityContainer: {
    marginTop: 30,
    marginBottom: 30,
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
  orderSummaryView: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderStyle: "solid",
    borderBottomColor: "black",
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  boldMainText: {
    fontSize: 20,
    fontWeight: "600",
  },
  boldSecondaryText: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 5,
  },
  bodyText: {
    fontSize: 15,
  },
  mutedBodyTextSmall: {
    fontSize: 11,
    color: "#313233",
  },
  itemPriceContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  orderItemContainer: {
    borderStyle: "solid",
    borderBottomWidth: 0.5,
    paddingVertical: 20,
    borderBottomColor: "gray",
  },
});

const getTotal = (items) => {
    let total = 0;
    for (let i = 0; i < items.length; i++) {
        total = total + items[i].price * items[i].quantity
    }
    return total;
};

export default function OrderDetailScreen({ navigation, route }) {
  const { isLoggedIn, setIsLoggedIn, user } = useContext(UserContext);
  const { upcCode, orderId } = route.params;

  const {
    loading: getOrdersLoading,
    data: getOrdersData,
    error: getOrdersError,
  } = useGetOrdersQuery({
    fetchPolicy: "cache-and-network",
    variables: {
      getOrdersInput: {
        userId: user.id,
        ids: [orderId],
      },
    }
  });

  if (getOrdersLoading && !getOrdersData) return <Text>Loading</Text>;
  if (getOrdersError) return <Text>{getOrdersError.message}</Text>;

  const order = getOrdersData.orders[0];

  const orderItemPressed = (orderItem) => {
    navigation.navigate("ItemDetail", {
      id: orderItem.item_id,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.safeContainer}>
        <FlatList
          ListHeaderComponent={
            <View>
              <View style={styles.orderSummaryView}>
                <View>
                  <Text
                    style={[
                      styles.bodyText,
                      { textAlign: "left", marginBottom: 5 },
                    ]}
                  >
                    {new Date(order.date_submitted).toDateString()}
                  </Text>
                  <Text
                    style={[styles.mutedBodyTextSmall, { textAlign: "left", marginBottom: 5 }]}
                  >
                    Order#: {order.id}
                  </Text>
                <Text
                    style={[
                    styles.bodyText,
                    { textAlign: "left", marginBottom: 0 },
                    ]}
                >
                    Est. Delivery
                </Text>
                </View>
                <View>
                  <Text
                    style={[
                      styles.bodyText,
                      { textAlign: "right", marginBottom: 5 },
                    ]}
                  >
                    ${getTotal(order.orderItems)}
                  </Text>
                  <Text
                    style={[styles.mutedBodyTextSmall, { textAlign: "right", marginBottom: 5 }]}
                  >
                    {order.orderItems.length} Items
                  </Text>
                  <Text
                        style={[
                        styles.bodyText,
                        { textAlign: "left", marginBottom: 0 },
                        ]}
                    >
                    {format(add(new Date(order.date_submitted), { days: 1 }), "MM/dd/yyyy")}
                </Text>
                </View>
              </View>
            </View>
          }
          data={order.orderItems}
          numColumns={1}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity onPress={() => {orderItemPressed(item)}} key={item.id} style={styles.orderItemContainer}>
                <Text style={styles.boldSecondaryText}>
                  {item.quantity}x {item.name}
                </Text>
                <View style={styles.itemContainer}>
                  <View style={styles.itemInfoContainer}>
                    <Image
                      style={styles.itemImage}
                      source={{ uri: item.image }}
                    />

                    <View style={styles.itemTextContainer}>
                      <Text style={styles.mutedBodyTextSmall}>
                        UPC: {item.upc1}
                      </Text>

                      <Text style={styles.mutedBodyTextSmall}>
                        Unit Size: {item.unit_size}
                      </Text>

                      <Text style={styles.mutedBodyTextSmall}>
                        Category: {item.nacs_category}
                      </Text>

                      <Text style={styles.mutedBodyTextSmall}>
                        Case Cost: {item.price}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.itemPriceContainer}>
                    <Text style={{ textAlign: "right" }}>
                      ${parseFloat((item.price * item.quantity).toFixed(2))}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item.id}
        ></FlatList>
      </View>
    </SafeAreaView>
  );
}
