import react, {useEffect, useState, useContext} from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, StatusBar, Button,TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { BarCodeScanner } from 'expo-barcode-scanner';
import CheckoutScreen from '../checkoutScreen/checkoutScreen.js'
import OrderSubmittedScreen from '../orderSubmittedScreen/orderSubmittedScreen.js'
import NumericInput from 'react-native-numeric-input'
import { useGetCartsQuery, useUpdateItemInCartMutation } from '../../generated/graphql'
import { Ionicons } from '@expo/vector-icons';


import { UserContext } from '../../context/userContext'
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        backgroundColor:"white",
    },
scrollView: {
  paddingHorizontal: 20,
  backgroundColor:"white"
  
},
    safeContainer: {
        marginHorizontal: 20,
        backgroundColor:"white",
        marginTop:20,
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
        width:120,
        height:120
    },
    itemContainer: {
        flexDirection:'row', 
        flexWrap:'wrap',
        marginTop:10,
        marginBottom:100
    },
    boldMainText: {
        fontSize:20,
        fontWeight:"600",

    },
    boldSecondaryText: {
        fontSize:11,
        fontWeight:"600",    
        marginBottom:10
    },
    itemDetailLine: {
        flexDirection:'row', 
        flexWrap:'wrap',
        justifyContent:"space-between"
    },
    itemTextContainer: {
        marginLeft:20,
        flex:2,
    },
    quantityContainer: {
        marginTop:30,
        marginBottom:20,
        flexDirection: "row",
        flexWrap:"wrap",
        justifyContent: "space-between"
    },
    pricingContainer: {
        marginTop:20,
        marginBottom:50,
    },
    buttonContainer: {
        marginTop:10,
        marginBottom:0,
       

    },
    mainButton: {
        color:'white',
        backgroundColor:"#3C95FF",
        height:45,
        borderRadius:20,
        alignItems:"center",
        justifyContent:"center"
    },
    mainButtonText: {
        fontSize:20,
        color:"white"
    },
    titleContainer: {
        marginBottom:10,
        marginTop: 20
    },
    titleText: {
        fontSize:45,
        fontWeight:"600"
    },
    summaryContainer: {
        flexDirection: "row",
        flexWrap:"wrap",
        justifyContent: "space-between",
        marginBottom:10,
        marginTop:20
        

    },
    boldMainTextColor:{
        fontSize:25,
        fontWeight:"600",
        color:"#3C95FF"
    },
    checkoutButton: {
        backgroundColor:"white",
        width:150,
        height: "80%",
        justifyContent:"center",
        alignItems:"center",
        borderRadius:15,

        

    },
    checkoutButtonText: {
        fontSize:17,
        fontWeight:"600",
        color:"#3C95FF",
        textAlign:"center"
        

    },
    secondaryTitleText: {
        fontSize:20,
        fontWeight:"600",
        color:"black",
        marginBottom:10
    },
    itemsContainer: {
        marginTop:20,
        marginBottom:10,

    },
    itemContainer: {
        borderStyle:"solid",
        borderWidth:1,
        flexDirection: "row",
        flexWrap:"wrap",
        justifyContent: "space-between",
        borderRadius:20,
        padding:10,
        marginTop:10,
        marginBottom:10,
    }
    
    
  });
  

function CartScreenComponent({ navigation }) {
    const { isLoggedIn, setIsLoggedIn, user } = useContext(UserContext)
    const {loading, data, error} = useGetCartsQuery({
        fetchPolicy:"network-only",
        variables: {
            getCartsInput: {
                userId: user.id
            },
        },
        pollInterval: 500
    })






    








    const [updateItemInCart, {loading:updateItemInCartLoading, data:updateItemInCartData, error:updateItemInCartError}] = useUpdateItemInCartMutation()

    if (loading && !data) return <Text>loading.....</Text>
    if (error) return <Text>Error.....</Text>

    const cart = data.carts[0]
    const goToCheckout = () => {
      navigation.navigate("CheckoutScreen", {
          cartId: cart.id
      })
    }

    const onEditQuantity = (cartId, itemId, quantity) => {
        updateItemInCart({
            variables: {
                updateItemInCartInput: {
                    cartId: cartId,
                    itemId: itemId, 
                    quantity: quantity
                }
            }
        })
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={{zIndex: 5, display: "flex", justifyContent:"space-between", paddingHorizontal: 35 , flexDirection: "row", position:'absolute', bottom: 0, width: "100%", height: 65, backgroundColor:'#3C95FF', borderTopLeftRadius: 10, borderTopRightRadius: 10}}>
               
                    <View style={{display:'flex', justifyContent:"center", flexDirection: "column"}}>
                        <Text style={styles.boldMainText}>Subtotal</Text>
                        <Text style={styles.boldMainText}>${cart.subtotal}</Text>
                    </View>
                    <View style={{display:'flex', justifyContent:"center", flexDirection: "column"}}>
                       {cart.cartItems.length > 0 && <TouchableOpacity style={styles.checkoutButton} onPress={goToCheckout} >
                          <Text style={styles.checkoutButtonText}>Continue</Text>
                       </TouchableOpacity>}
                    </View>
               
             </View>


             <ScrollView style={styles.scrollView}>
                <View style={styles.itemsContainer}>
                    <Text style={styles.secondaryTitleText}>Items</Text>
                    {cart.cartItems.length == 0 && 
                    <View style={{marginTop: "50%"}}>
                    <Text style={[styles.secondaryTitleText, {textAlign:"center"}]}>No Items In Cart</Text>
                    <Text style={[styles.thirdTitleText, {marginTop:"5%", textAlign:"center"}]}>Add Items To Cart To Checkout</Text> 
                    </View>}
                    {
                        cart.cartItems.map((cartItem) => { return (
                        <View key={cartItem.id} style={styles.itemContainer}>
                        <View>
                          
                            <Text style={styles.boldSecondaryText}>{cartItem.description}</Text> 
                            <Text style={styles.boldSecondaryText}>Sku#: {cartItem.sku}</Text>
                            <Text style={styles.boldSecondaryText}>Unit Size: {cartItem.unit_size}</Text>
                            <Text style={styles.boldSecondaryText}>Case Costs: {cartItem.case_cost}</Text>
                        </View>
                        <View style={{flexDirection:"column", justifyContent:"space-between", paddingVertical: 15}}>
                            <NumericInput initValue={cartItem.quantity} value={cartItem.quantity} totalHeight={30} totalWidth={80} rounded iconSize={100} leftButtonBackgroundColor={'#88BEFF'} rightButtonBackgroundColor={"#88BEFF"} onChange={value => onEditQuantity(cart.id, cartItem.item_id, value)} />
                            <TouchableOpacity style={{flexDirection: "row", justifyContent:"center", backgroundColor: "grey", borderRadius: 5, padding: 2}} onPress={() => onEditQuantity(cart.id, cartItem.item_id, 0)}><Text>Delete</Text></TouchableOpacity>
                        </View>
                    </View> )
                        })
                    }
                   
                </View>
                
            </ScrollView>
        </SafeAreaView>
    )
}   

const CartStack = createStackNavigator();
export default function CartScreen() {
      return (
        <CartStack.Navigator>
          <CartStack.Screen name="CartScreen" component={CartScreenComponent} options={{title: "Cart", headerShown: true}} />
          <CartStack.Screen name="CheckoutScreen" component={CheckoutScreen}  options={{title: "Checkout", headerShown: true}} />
        </CartStack.Navigator>
      );
    }
