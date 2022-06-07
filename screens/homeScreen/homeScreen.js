import react, {useEffect, useContext } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, FlatList, StatusBar, TextInput,TouchableOpacity, Image, Alert, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import algoliasearch from 'algoliasearch';
import { InstantSearch, connectStateResults } from 'react-instantsearch-native';
import SearchBox from '../../components/SearchBox';
import InfiniteHits from '../../components/InfiniteHits';
import { useGetItemsQuery, useGetOrdersQuery, useGetCartsQuery, useUpdateItemInCartMutation, useAddItemToCartMutation, useGetCategoriesQuery } from '../../generated/graphql'
import ItemDetailScreen from '../itemDetailScreen/itemDetailScreen'
import OrderDetailScreen from '../orderDetailScreen/orderDetailScreen'

import SelectItemsScreen from '../selectItemsScreen/selectItemsScreen'
import SearchResultsScreen from '../searchResultsScreen/searchResultsScreen'

import { Ionicons } from '@expo/vector-icons';


import axios from "axios"


import { UserContext } from '../../context/userContext'
import { getAuth, signOut } from "firebase/auth";

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);


const Results = connectStateResults(({ searchState, children }) =>
  searchState && searchState.query  ? (
    children
  ) : null
);  


const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    paddingTop: 0,
    backgroundColor:"red"
  },
  container: {
    backgroundColor:"white"
  },
  statusBar: {
    marginTop:-50,
    height: 50,
    backgroundColor:"#3C95FF"
  },
  orderSectionView: {
    marginLeft: 20,
    marginTop: 30,
    marginRight: 20
  },
  scrollView: {
    
  },
  titleText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10
  },
  orderText: {
    margin:5,
    fontSize: 18
  },
  orderView: {
    borderStyle:"solid",
    borderColor:"gray",
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 15,
    width: 250,
    display:"flex",
    flexDirection: "row",
    justifyContent:"space-between",
  },
  innerContainerView: {
    marginTop: 20,

  },
  topBarView: {
    
  },
  titleView: {
    backgroundColor:"#3C95FF",
    paddingTop:10,
    paddingLeft: 20,
    paddingRight:20
  },
  boldText: {
    fontSize: 25,
    fontWeight: "600"
  },
  boldSecondaryText: {
    fontSize: 20,
    fontWeight: "600"
  },
  bodyText: {
    fontSize: 15
  },
  bodyTextSmall: {
    fontSize: 12,
  },
  mutedBodyTextSmall: {
    fontSize: 14,
    color: "#313233"

  },
  mutedBodyTextExtraSmall: {
    fontSize: 11,
    color: "#313233"
  },
  itemView: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "black",
    width: 170,
    height: 230,
    marginVertical:10,
    padding: 5,
    borderStyle: "solid",
    borderRadius: 10,
    borderColor: "black",
    justifyContent:"center",
    flexDirection: "column",
    alignItems: "center",
  
   
  },
  itemImage: {
    width: "100%",
    aspectRatio: 1,
    marginBottom: 5
  
  
  },
  boldBodyTextSmall: {
    fontSize: 11,
    fontWeight: "600"
  },
  boldBodyText: {
    fontSize: 14,
    fontWeight: "600"
  },
  addToCartButton: {
    width: 25,
    height: 25,
    backgroundColor: "gray",
    justifyContent:"center",
    alignItems:"center"
 
  },
  searchBarContainer: {
    width: "100%",
    height: 80,
    backgroundColor: "#3C95FF", 
    flexDirection: "row",
    justifyContent: "center",
    alignItems:"center",
    padding: 20
  },
  searchBar: {
    width: "100%",
    height: 40,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: 10
    
  },
  searchBarInsideView: {

    flexDirection: "row",
    justifyContent: "center",
    alignItems:"center"
  },

  mutedBodyText: {
    fontSize: 15,
    color: "#313233",


  },

  categoryView: {
    borderStyle:"solid",
    borderColor:"gray",
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 15,
    width: 110,
    display:"flex",
    flexDirection: "row",
    justifyContent:"center",
  },
  categoryImage: {
    width: "65%",
    aspectRatio: 1,
    marginBottom: 5
  }
});

function HomeComponent({ navigation }) {
  const { isLoggedIn, setIsLoggedIn, user } = useContext(UserContext)

  const auth = getAuth();

  const {loading:getOrdersLoading, data:getOrdersData, error:getOrdersError} = useGetOrdersQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
        getOrdersInput: {
            userId: user.id
        },
    },
    pollInterval: 500
})

const {loading:getCartsLoading, data:getCartsData, error: getCartsError} = useGetCartsQuery({
  fetchPolicy: 'cache-and-network',
  variables: {
      getCartsInput: {
          userId: user.id
      },
  },
  pollInterval: 500
})

const { loading:getItemsLoading, error:getItemsError, data: getItemsData, fetchMore: fetchMoreItemsQuery} = useGetItemsQuery({ 
  fetchPolicy: 'cache-and-network',
  variables: { getItemsInput: {
    pagination: {
      offset: 0,
      limit: 20
    }
  } }})

  const { loading:getCategoriesLoading, error:getCategoriesError, data: getCategoriesData} = useGetCategoriesQuery({ 
    fetchPolicy: 'cache-and-network',
    variables: { getCategoriesInput: {
      pagination: {
        offset: 0,
        limit: 20
      }
    } }})

  

  const [updateItemInCart, {loading:updateItemInCartLoading, data:updateItemInCartData, error:updateItemInCartError}] = useUpdateItemInCartMutation()



  if (getCartsLoading && !getCartsData) return <Text>Loading</Text>
  if (getCartsError) return <Text>{getCartsError.message}</Text>

  if (getOrdersLoading && !getOrdersData) return <Text>Loading</Text>
  if (getOrdersError) return <Text>{getOrdersError.message}</Text>

  if (getItemsLoading && !getItemsData) return <Text>Loading</Text>
  if (getItemsError) return <Text>{getItemsError.message}</Text>

  if (getCategoriesLoading && !getCategoriesData) return <Text>Loading</Text>
  if (getCategoriesError) return <Text>{getCategoriesError.message}</Text>
  const itemClicked = (item) => {
    navigation.navigate("ItemDetail", {
      upcCode: item.upc1
    })
  }

  const orderPressed = (order) => {
    navigation.navigate("OrderDetail", {
      orderId: order.id
    })
  }



  const logoutButtonPressed = async () => {
    await signOut(auth)
  }





  const searchBarPressed = () => {
    navigation.navigate("SearchResults")
  }


  const fetchMoreItems = () => {
    fetchMoreItemsQuery({
      variables: {
        getItemsInput: {
          pagination: {
            offset: getItemsData.items.length + 1,
          }
        }
        
         
      }
    });
  }

  const cart = getCartsData.carts[0]
  const addItemToCart = (item) => {
    var quantityToBeUpdated = 1
    const checkItemId = cartItem => cartItem.item_id == item.id
    if (cart.cartItems.some(checkItemId)) {
        quantityToBeUpdated += cart.cartItems.find(cartItem => cartItem.item_id == item.id).quantity
    }
    updateItemInCart({
        variables: {
            updateItemInCartInput: {
                cartId: cart.id,
                itemId: item.id, 
                quantity: quantityToBeUpdated
            }
        }
    })
}

const categorySelected = (category) => {
  navigation.navigate("SelectItems", {
    category: category,
    title: category.name
  })
}

  return (
   <View style={styles.homeContainer}>
    <SafeAreaView style={styles.container}>
      <View style={styles.statusBar}>
      </View>
      <FlatList
        ListHeaderComponent={
          <>
           <View style={styles.topBarView}>
      <View style={styles.titleView}>
        <Text style={styles.boldSecondaryText}>Attain</Text>
        <Text style={styles.boldText}>{user.name}</Text>
        <TouchableOpacity style={{position:"absolute", top: 30, right: 30}} onPress={logoutButtonPressed}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.searchBarContainer}>
      <TouchableOpacity style={styles.searchBar} onPress={searchBarPressed}>
      <View style={styles.searchBarInsideView}>
      <Ionicons name="search" size={24} color="black"/>
      <Text style={[styles.mutedBodyText, {marginTop:3}]}>
        Search
      </Text>
      </View>
      </TouchableOpacity>
      </View>
      
      {/* <InstantSearch searchClient={searchClient} indexName="instant_search">
            <SearchBox />
            <Results>
             <InfiniteHits />
            </Results>     
          </InstantSearch> */}
    </View>
   
    <View style={styles.orderSectionView}>
    <Text style={[styles.titleText, {marginBottom: 15}]}>
            Categories
          </Text>

        
        
    <ScrollView style={styles.scrollView} horizontal={true}> 
      {getCategoriesData.categories.map((category) => {
        return (
          
          <TouchableOpacity style={styles.categoryView} key={category.name} onPress={() => categorySelected(category)}> 
          <View style={{
    flexDirection: "column", alignItems:"center", flex:1}}>
            <Image style={styles.categoryImage} source={{uri: category.image}}>

            </Image>
           <Text style={[styles.bodyText, {textAlign:"center"}]}>
              {category.name}
            </Text>  
          
            </View>
          </TouchableOpacity>
        )
      })}
    </ScrollView>
    </View>
    <View style={styles.orderSectionView}>
    <Text style={[styles.titleText, {marginBottom: 5}]}>
            Recent Orders
          </Text>

          <Text style={[styles.mutedBodyTextSmall, {marginBottom: 10}]}>
            {getOrdersData.orders.length > 1 ? "Click To See Detail" : "No orders yet"} 
          </Text>
        
    <ScrollView style={styles.scrollView} horizontal={true}> 
      {getOrdersData.orders.map((order) => {
        return (
          
          <TouchableOpacity style={styles.orderView} key={order.id} onPress={() => orderPressed(order)}> 
          <View>
           <Text style={[styles.bodyText, {textAlign: "left", marginBottom: 5}]}>
              {new Date(order.date_submitted).toDateString()}
            </Text>  
            <Text style={[styles.mutedBodyTextSmall, {textAlign: "left", marginBottom: 5}]}>
              Order#: {order.id}
            </Text> 

            <Text style={[styles.bodyText, {textAlign: "left", marginBottom: 0}]}>
              Status
            </Text>  
            
            </View>
            <View>
           <Text style={[styles.bodyText, {textAlign: "right", marginBottom:5}]}>
              ${order.subtotal}
            </Text>  
            <Text style={[styles.mutedBodyTextSmall, {textAlign: "right", marginBottom: 5}]}>
               {order.orderItems.length} Items
            </Text> 

            <Text style={[styles.bodyText, {textAlign: "right", marginBottom: 0}]}>
              {order.status}
            </Text>  
            
            </View>
          </TouchableOpacity>
        )
      })}
    </ScrollView>
    </View>
    <View style={styles.orderSectionView}>
      <Text style={styles.titleText}>Price Book</Text>
    </View>
          </>
        }
        
       columnWrapperStyle={{  flex: 1,justifyContent: "space-between", marginHorizontal: 20, padding:0}}
        numColumns={2}  
        data={getItemsData.items}
        renderItem={ ({item}) => 
          
         
            <TouchableOpacity style={styles.itemView} onPress={() => { itemClicked(item) }}>
               <Image style={styles.itemImage} source={{uri: item.image ? item.image : "https://via.placeholder.com/150"}}/>
              <View style={{width:"100%"}}>
             <Text numberOfLines={1} style={styles.boldBodyTextSmall}>{item.name}</Text>
             <Text style={styles.mutedBodyTextExtraSmall}>Unit Size: {item.unit_size}</Text>
             <View style={{flexDirection: "row", justifyContent: "space-between"}}>
             <Text style={[styles.boldBodyText, {marginTop: 5}]}>${item.price}</Text>
             <TouchableOpacity style={styles.addToCartButton} onPress={() => addItemToCart(item)}>
              <Ionicons style={{textAlign:"center"}} name="add" size={24} color="black" />
             </TouchableOpacity>
             </View>
             </View>
             </TouchableOpacity>
         
          }
        keyExtractor={item => item.id}
        onEndReached={() => {
          console.log(getItemsData.items.length)
        fetchMoreItemsQuery({
            variables: { 
              getItemsInput: {
                pagination: {
                  offset: getItemsData.items.length,
                  limit: 20
                }
              }
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
{/*       
          {getItemsData.items.map((item) => {
           return ( 
           <View style={styles.itemView}>
              <Text>{item.description}</Text>
              <Text>Case Cost: {item.case_cost}</Text>
              <Text>Unit Size: {item.unit_size}</Text>
            </View>
           )
          })} */}
  </SafeAreaView>
  </View>
  
  );
}

const HomeStack = createStackNavigator();
export default function HomeScreen() {
      return (
        <HomeStack.Navigator>
          <HomeStack.Screen name="Attain" component={HomeComponent} options={{headerShown: false}}/>
          <HomeStack.Screen name="ItemDetail" component={ItemDetailScreen} options={{title: "Item Details"}}/>
          <HomeStack.Screen name="OrderDetail" component={OrderDetailScreen} options={{title: "Order Details"}} />
          <HomeStack.Screen name="SelectItems" component={SelectItemsScreen} options={({ route }) => ({title: route.params.title})}/>
          <HomeStack.Screen name="SearchResults" component={SearchResultsScreen} options={{title: "Search Results"}}/>
        </HomeStack.Navigator>
      );
    }

