import react, { useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  PixelRatio
} from "react-native";

import Text from "../../components/Text"
import { createStackNavigator } from "@react-navigation/stack";
import algoliasearch from "algoliasearch";
import {
  useGetItemsQuery,
  useGetOrdersQuery,
  useGetCategoriesQuery,
} from "../../generated/graphql";
import ItemDetailScreen from "../itemDetailScreen/itemDetailScreen";
import OrderDetailScreen from "../orderDetailScreen/orderDetailScreen";
import * as Amplitude from 'expo-analytics-amplitude';

import SelectItemsScreen from "../selectItemsScreen/selectItemsScreen";
import SearchResultsScreen from "../searchResultsScreen/searchResultsScreen";

import { Ionicons } from "@expo/vector-icons";


import { UserContext } from "../../context/userContext";
import { getAuth, signOut } from "firebase/auth";
import ItemCard from "../../components/ItemCard"

const screenWidth = Dimensions.get('window').width;
const fontScale = PixelRatio.getFontScale()

// const ampInstance = Amplitude.getInstance();
// ampInstance.init("3b0e62f88e06cf0de6e5009d92924990");
Amplitude.initializeAsync("3b0e62f88e06cf0de6e5009d92924990");


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
console.log(fontScale)
console.log(fontScaler)



const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: "red",
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
    marginRight: 15,
    width: (screenWidth) * 0.70 * fontScaler,
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

function HomeComponent({ navigation }) {
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


  const {
    loading: getItemsLoading,
    error: getItemsError,
    data: getItemsData,
    fetchMore: fetchMoreItemsQuery,
  } = useGetItemsQuery({
    fetchPolicy: "cache-and-network",
    variables: {
      getItemsInput: {
        pagination: {
          offset: 0,
          limit: 20,
        },
      },
    },
  });

  const {
    loading: getCategoriesLoading,
    error: getCategoriesError,
    data: getCategoriesData,
  } = useGetCategoriesQuery({
    fetchPolicy: "cache-and-network",
    variables: {
      getCategoriesInput: {
        pagination: {
          offset: 0,
          limit: 20,
        },
      },
    },
  });


  if (getOrdersLoading && !getOrdersData) return <Text>Loading</Text>;
  if (getOrdersError) return <Text>{getOrdersError.message}</Text>;

  if (getItemsLoading && !getItemsData) return <Text>Loading</Text>;
  if (getItemsError) return <Text>{getItemsError.message}</Text>;

  if (getCategoriesLoading && !getCategoriesData) return <Text>Loading</Text>;
  if (getCategoriesError) return <Text>{getCategoriesError.message}</Text>;


  const orderPressed = (order) => {
    navigation.navigate("OrderDetail", {
      orderId: order.id,
    });
    // ampInstance.logEvent('ORDER_CLICKED');
    Amplitude.logEventAsync('ORDER_CLICKED')
    // ampInstance.trackingSessionEvents(true);
  };

  const logoutButtonPressed = async () => {
    await signOut(auth);
  };

  const searchBarPressed = () => {
    navigation.navigate("SearchResults");
    // ampInstance.logEvent('SEARCH_CLICKED');
    Amplitude.logEventAsync('SEARCH_CLICKED')
  };



  const categorySelected = (category) => {
    navigation.navigate("SelectItems", {
      category: category,
      title: category.name,
    });
    // ampInstance.logEvent('CATEGORY_CLICKED')
    Amplitude.logEventAsync('CATEGORY_CLICKED')
  };

  const renderItem = ({ item }) => (
    <ItemCard item={item} screenName="home"/>
  )
  
  return (
    <View style={styles.homeContainer}>
      <SafeAreaView style={styles.container}>
        <View style={styles.statusBar}></View>
        <FlatList
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          initialNumToRender={10}
          ListHeaderComponent={
            <>
              <View style={styles.topBarView}>
                <View style={styles.titleView}>
                  <Text maxFontSizeMultiplier={1.4} style={styles.boldSecondaryText}>Attain</Text>
                  <Text maxFontSizeMultiplier={1.4} style={styles.boldText}>{user.name}</Text>
                  <TouchableOpacity
                    style={{ position: "absolute", top: 10, right: 20 }}
                    onPress={logoutButtonPressed}
                  >
                    <View style={{backgroundColor:"#D3D3D3", padding: 7, borderRadius: 10}}>
                      <Text maxFontSizeMultiplier={1.4}>Logout</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.searchBarContainer}>
                  <TouchableOpacity
                    style={styles.searchBar}
                    onPress={searchBarPressed}
                  >
                    <View style={styles.searchBarInsideView}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          flex: 1,
                          height: "100%",
                        }}
                      >
                        <Ionicons name="search" size={24} color="black" />
                        <Text maxFontSizeMultiplier={1.4} style={[styles.boldBodyText, { marginTop: 3 }]}>
                          Search
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={{
                          height: "100%",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Ionicons
                          name="ios-scan"
                          size={24}
                          color="black"
                        ></Ionicons>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.orderSectionView}>
                <View style={{marginHorizontal: 20}}>
                <Text maxFontSizeMultiplier={1.4} style={[styles.titleText]}>
                  Top Categories
                </Text>
                </View>
                <ScrollView style={styles.scrollView} horizontal={true}>
                  {getCategoriesData.categories.map((category) => {
                    return (
                      <TouchableOpacity
                        style={styles.categoryView}
                        key={category.name}
                        onPress={() => categorySelected(category)}
                      >
                        <View
                          style={{
                            flexDirection: "column",
                            alignItems: "center",
                            flex: 1,
                          }}
                        >
                          <Image
                            style={styles.categoryImage}
                            source={{ uri: category.image }}
                          ></Image>
                          <Text
                            maxFontSizeMultiplier={1.4}
                            style={[
                              styles.bodyText,
                              { textAlign: "center", flex: 1},
                            ]}
                          >
                            {category.name}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
              <View style={styles.orderSectionView}>
                <View style={{marginHorizontal: 20}}>
                <Text maxFontSizeMultiplier={1.4} style={[styles.titleText, { marginBottom: 5 }]}>
                  Recent Orders
                </Text>
                <Text maxFontSizeMultiplier={1.4} style={[styles.mutedBodyTextSmall]}>
                  {getOrdersData.orders.length > 1
                    ? "Click To See Detail"
                    : "No orders yet"}
                </Text>
                </View>
                <ScrollView
                  style={styles.scrollView}
                  horizontal={true}
                >
                  {getOrdersData.orders.map((order) => {
                    return (
                      <TouchableOpacity
                        style={styles.orderView}
                        key={order.id}
                        onPress={() => orderPressed(order)}
                      >
                        <View>
                          <Text
                           maxFontSizeMultiplier={1.4}
                            style={[
                              styles.bodyText,
                              { textAlign: "left", marginBottom: 5 },
                            ]}
                          >
                            {new Date(order.date_submitted).toDateString()}
                          </Text>
                          <Text
                           maxFontSizeMultiplier={1.4}
                            style={[
                              styles.mutedBodyTextSmall,
                              { textAlign: "left", marginBottom: 5 },
                            ]}
                          >
                            Order#: {order.id}
                          </Text>

                          <Text
                            maxFontSizeMultiplier={1.4}
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
                            maxFontSizeMultiplier={1.4}
                            style={[
                              styles.bodyText,
                              { textAlign: "right", marginBottom: 5 },
                            ]}
                          >
                            ${order.subtotal}
                          </Text>
                          <Text
                            maxFontSizeMultiplier={1.4}
                            style={[
                              styles.mutedBodyTextSmall,
                              { textAlign: "right", marginBottom: 5 },
                            ]}
                          >
                            {order.orderItems.length} Items
                          </Text>

                          <Text
                            maxFontSizeMultiplier={1.4}
                            style={[
                              styles.bodyText,
                              { textAlign: "right", marginBottom: 0 },
                            ]}
                          >
                            {order.status}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
              <View style={styles.orderSectionView}>
                <View style={{marginHorizontal: 20}}>

                <Text maxFontSizeMultiplier={1.4} style={styles.titleText}>Price Book</Text>
                </View>
              </View>
            </>
          }
          columnWrapperStyle={{
            flex: 1,
            justifyContent: "space-between",
            marginHorizontal: 20,
            padding: 0,
          }}
          numColumns={2}
          data={getItemsData.items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onEndReached={() => {
            console.log(getItemsData.items.length);
            fetchMoreItemsQuery({
              variables: {
                getItemsInput: {
                  pagination: {
                    offset: getItemsData.items.length,
                    limit: 20,
                  },
                },
              },
              updateQuery: (previousResult, { fetchMoreResult }) => {
                // Don't do anything if there weren't any new items
                if (!fetchMoreResult || fetchMoreResult.items.length === 0) {
                  return previousResult;
                }
                return {
                  // Append the new feed results to the old one
                  items: previousResult.items.concat(fetchMoreResult.items),
                };
              },
            });
          }}
          onEndReachedThreshold={0.3}
        />
      </SafeAreaView>
    </View>
  );
}

const HomeStack = createStackNavigator();
export default function HomeScreen() {
  return (
    <HomeStack.Navigator screenOptions={({ route }) => ({
      headerTitleStyle: {
        fontSize: 20 / fontScale
      },
    })}>
      <HomeStack.Screen
        name="Attain"
        component={HomeComponent}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="ItemDetail"
        component={ItemDetailScreen}
        options={{ title: "Item Details" }}
      />
      <HomeStack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{ title: "Order Details" }}
      />
      <HomeStack.Screen
        name="SelectItems"
        component={SelectItemsScreen}
        options={({ route }) => ({ title: route.params.title })}
      />
      <HomeStack.Screen
        name="SearchResults"
        component={SearchResultsScreen}
        options={{ title: "Search Results" }}
      />
    </HomeStack.Navigator>
  );
}
