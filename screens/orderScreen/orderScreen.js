import react, { useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  FlatList,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  Dimensions,
  PixelRatio
} from "react-native";
import Text from "../../components/Text"
import { createStackNavigator } from "@react-navigation/stack";
import algoliasearch from "algoliasearch";
import {
  useGetOrdersQuery,
} from "../../generated/graphql";
import ItemDetailScreen from "../itemDetailScreen/itemDetailScreen";
import OrderDetailScreen from "../orderDetailScreen/orderDetailScreen";

import SelectItemsScreen from "../selectItemsScreen/selectItemsScreen";
import SearchResultsScreen from "../searchResultsScreen/searchResultsScreen";


import { UserContext } from "../../context/userContext";
import { getAuth, signOut } from "firebase/auth";







const screenWidth = Dimensions.get('window').width;
const fontScale = PixelRatio.getFontScale()

const fontMultiplier = (scaler) => {
  if (scaler >= 1.6) {
    return 0.7
  }

  if (scaler >= 1.3) {
    return 0.90
  }

  if (scaler >= 1.1) {
    return 0.95
  }

  return 1
}
const fontScaler = (fontScale * fontMultiplier(fontScale))


const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: "white",
  },
  container: {
    backgroundColor: "white",
  },
  statusBar: {
    marginTop: -50,
    height: 50,
    backgroundColor: "#3C95FF",
  },
  orderSectionView: {
    marginTop: 30,
  },
  scrollView: {
    paddingLeft: 20, marginVertical: 10,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  orderText: {
    margin: 5,
    fontSize: 18,
  },
  orderView: {
    borderStyle: "solid",
    borderColor: "gray",
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  innerContainerView: {
    marginTop: 20,
  },
  topBarView: {},
  titleView: {
    backgroundColor: "#3C95FF",
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  boldText: {
    fontSize: 25,
    fontWeight: "600",
  },
  boldSecondaryText: {
    fontSize: 20,
    fontWeight: "600",
  },
  bodyText: {
    fontSize: 15
  },
  bodyTextSmall: {
    fontSize: 12,
  },
  mutedBodyTextSmall: {
    fontSize: 14,
    color: "#313233",
  },
  mutedBodyTextExtraSmall: {
    fontSize: 11,
    color: "#313233",
  },
  itemView: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "black",
    width: "48%",
    marginVertical: 10,
    padding: 10,
    borderStyle: "solid",
    borderRadius: 10,
    borderColor: "black",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  itemImage: {
    width: "100%",
    aspectRatio: 1,
    marginBottom: 7,
  },
  boldBodyTextSmall: {
    fontSize: 11,
    fontWeight: "600",
  },
  boldBodyText: {
    fontSize: 14,
    fontWeight: "600",
  },
  addToCartButton: {
    aspectRatio: 1,
    backgroundColor: "gray",
    justifyContent: "center",
    alignItems: "center",
  },
  searchBarContainer: {
    width: "100%",
    height: 80,
    backgroundColor: "#3C95FF",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  searchBar: {
    width: "100%",
    height: 40,
    backgroundColor: "white",
    padding: 0,
  },
  searchBarInsideView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 5,
  },

  mutedBodyText: {
    fontSize: 15,
    color: "#313233",
  },

  categoryView: {
    borderStyle: "solid",
    borderColor: "gray",
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 15,
    width: screenWidth * 0.25 * fontScaler,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  categoryImage: {
    width: "65%",
    aspectRatio: 1,
    marginBottom: 5,
 
  },
});

const getTotal = (items) => {
    let total = 0;
    for (let i = 0; i < items.length; i++) {
        total = total + items[i].price * items[i].quantity
    }
    return total;
};

function OrderComponent({ navigation }) {
  const { isLoggedIn, setIsLoggedIn, user } = useContext(UserContext);

  const auth = getAuth();

  const {
    loading: getOrdersLoading,
    data: getOrdersData,
    error: getOrdersError,
  } = useGetOrdersQuery({
    fetchPolicy: "cache-and-network",
    variables: {
      getOrdersInput: {
        userId: user.id,
      },
    },
    pollInterval: 3000,
  });



  if (getOrdersLoading && !getOrdersData) return <Text>Loading</Text>;
  if (getOrdersError) return <Text>{getOrdersError.message}</Text>;

  const orderPressed = (order) => {
    navigation.navigate("OrderDetail", {
      orderId: order.id,
    });
  };


  return (
    <View style={styles.homeContainer}>
      <SafeAreaView style={styles.container}>
        <FlatList 
        ListHeaderComponent={
            <View style={{marginHorizontal: 20}}>
                <Text style={styles.titleText}>Past Orders</Text>
            </View>
        }
        data={getOrdersData.orders}
        renderItem={({item}) => {
            return (
                <TouchableOpacity
                style={styles.orderView}
                key={item.id}
                onPress={() => orderPressed(item)}
              >
                <View>
                  <Text
                  
                    style={[
                      styles.bodyText,
                      { textAlign: "left", marginBottom: 5 },
                    ]}
                  >
                    {new Date(item.date_submitted).toDateString()}
                  </Text>
                  <Text
                    style={[
                      styles.mutedBodyTextSmall,
                      { textAlign: "left", marginBottom: 5 },
                    ]}
                  >
                    Order#: {item.id}
                  </Text>

                  <Text
                    style={[
                      styles.bodyText,
                      { textAlign: "left", marginBottom: 0 },
                    ]}
                  >
                    Status
                  </Text>
                </View>
                <View>
                  <Text
                    style={[
                      styles.bodyText,
                      { textAlign: "right", marginBottom: 5 },
                    ]}
                  >
                    ${getTotal(item.orderItems)}
                  </Text>
                  <Text
                    style={[
                      styles.mutedBodyTextSmall,
                      { textAlign: "right", marginBottom: 5 },
                    ]}
                  >
                    {item.orderItems.length} Items
                  </Text>

                  <Text
                    style={[
                      styles.bodyText,
                      { textAlign: "right", marginBottom: 0 },
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </TouchableOpacity>
                
            )
        }}>

        </FlatList>
      </SafeAreaView>
    </View>
  );
}

const OrderStack = createStackNavigator();
export default function OrderScreen() {
  return (
    <OrderStack.Navigator screenOptions={({ route }) => ({
      headerTitleStyle: {
        fontSize: 25 / fontScale
      },
    })}>
      <OrderStack.Screen
        name="OrdersScreen"
        component={OrderComponent}
        options={{ title: "Orders" }}
 
      />
      <OrderStack.Screen
        name="ItemDetail"
        component={ItemDetailScreen}
        options={{ title: "Item Details" }}
      />
      <OrderStack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{ title: "Order Details" }}
      />
      <OrderStack.Screen
        name="SelectItems"
        component={SelectItemsScreen}
        options={({ route }) => ({ title: route.params.title })}
      />
      <OrderStack.Screen
        name="SearchResults"
        component={SearchResultsScreen}
        options={{ title: "Search Results" }}
      />
    </OrderStack.Navigator>
  );
}
