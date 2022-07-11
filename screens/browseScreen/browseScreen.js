import react, { useEffect, useState, useContext } from "react";
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
import Text from '../../components/Text'
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import algoliasearch from "algoliasearch";
import { InstantSearch, connectStateResults } from "react-instantsearch-native";
import SearchBox from "../../components/SearchBox";
import InfiniteHits from "../../components/InfiniteHits";
import {
  useGetItemsQuery,
  useGetOrdersQuery,
  useGetCartsQuery,
  useUpdateItemInCartMutation,
  useAddItemToCartMutation,
  useGetCategoriesQuery,
} from "../../generated/graphql";
import SelectItemsScreen from "../selectItemsScreen/selectItemsScreen";


import { UserContext } from "../../context/userContext";
import { getAuth, signOut } from "firebase/auth";







const screenWidth = Dimensions.get('window').width;
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
console.log(fontScale)
console.log(fontScaler)
const searchClient = algoliasearch(
  "latency",
  "6be0576ff61c053d5f9a3225e2a90f76"
);

const Results = connectStateResults(({ searchState, children }) =>
  searchState && searchState.query ? children : null
);
const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: "red",
  },
  container: {
    backgroundColor:"white",
    height: "100%",
    paddingTop: 10,
  },
  statusBar: {
    marginTop: -50,
    height: 50,
    backgroundColor: "#3C95FF",
  },
  orderSectionView: {
    marginLeft: 20,
    marginTop: 30,
    marginRight: 20,
  },
  scrollView: {},
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
    width: 250,
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
    fontSize: 15,
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
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: 10,
  },
  searchBarInsideView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
    marginBottom: 20,
    borderRadius: 15,
    width: screenWidth * 0.42,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  categoryImage: {
    width: "50%",
    aspectRatio: 1,
    marginBottom: 5,
 
  },
});


function BrowseScreenComponent({ navigation, route }) {
  const { isLoggedIn, setIsLoggedIn, user } = useContext(UserContext);
  const [selectedTag, setSelectedTag] = useState(null);



  const auth = getAuth();





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


  const categorySelected = (category) => {
    navigation.navigate("SelectItems", {
      category: category,
      title: category.name,
    });
  };



  if (getCategoriesLoading && !getCategoriesData) return <Text>Loading</Text>;
  if (getCategoriesError) return <Text>{getCategoriesError.message}</Text>;

  console.log(getCategoriesData.categories)
  return (
    <SafeAreaView style={{backgroundColor:'white'}}>
      <View style={styles.container}>
        <FlatList
          columnWrapperStyle={{
            flex: 1,
            justifyContent: "space-between",
            padding: 0,
            marginHorizontal: 20,

          }}
          numColumns={2}
          data={getCategoriesData.categories}
          renderItem={({ item }) => (
            <TouchableOpacity
            style={styles.categoryView}
            key={item.name}
            onPress={() => categorySelected(item)}
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
                source={{ uri: item.image }}
              ></Image>
              <Text
                style={[
                  styles.bodyText,
                  { textAlign: "center", flex: 1},
                ]}
              >
                {item.name}
              </Text>
            </View>
          </TouchableOpacity>
          )}
          keyExtractor={(item) => item.name}
        />
      </View>
    </SafeAreaView>
  );
}


const BrowseStack = createStackNavigator();
export default function BrowseScreen() {
  return (
    <BrowseStack.Navigator screenOptions={({ route }) => ({
      headerTitleStyle: {
        fontSize: 25 / fontScale
      },
    })}>
      <BrowseStack.Screen
        name="BrowseScreen"
        options={{ title: "Browse" }}
        component={BrowseScreenComponent}
        
      />
        <BrowseStack.Screen
        name="SelectItems"
        component={SelectItemsScreen}
        options={({ route }) => ({ title: route.params.title })}
      />
     
    </BrowseStack.Navigator>
  );
}