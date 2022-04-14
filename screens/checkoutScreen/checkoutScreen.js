import react, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, StatusBar, Button,TouchableOpacity, Image, } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useGetCartsQuery, useSubmitOrderMutation } from '../../generated/graphql'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
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
    boldMainText: {
        fontSize:20,
        fontWeight:"600",

    },
    boldSecondaryText: {
        fontSize:15,
        fontWeight:"600",    
        marginBottom:10,
    },
    itemDetailLine: {
        backgroundColor:"white",
        flexDirection:'row', 
        flexWrap:'wrap',
        justifyContent:"space-between",
        marginBottom:10
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
        marginBottom:10
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
        backgroundColor:"#3C95FF",
        width:150,
        height:50,
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        borderRadius:20
        

    },
    checkoutButtonText: {
        fontSize:15,
        fontWeight:"600",
        color:"white",
        textAlign:"center"
        

    },
    secondaryTitleText: {
        fontSize:20,
        fontWeight:"600",
        color:"black",
        marginBottom:10
    },
    itemsContainer: {
        marginTop:50,
        marginBottom:10,

    },
    itemContainer: {
        borderStyle:"solid",
        borderWidth:1,
        flexDirection: "row",
        flexWrap:"wrap",
        justifyContent: "space-between",
        borderRadius:20,
        padding:10
    },
    orderSummaryDetail: {
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 20,
        borderColor:"black",
        padding: 10
    }
    
    
  });
  
export default function CheckoutScreen({ navigation, route}) {
    const {loading:getCartsLoading, data:getCartsData, error:getCartsError} = useGetCartsQuery({
        fetchPolicy:"network-only",
        variables: {
            getCartsInput: {
                ids: ["1"]
            },
        },
        pollInterval: 500
    })
    const [submitOrder, {loading:submitOrderLoading, data:submitOrderData, error:submitOrderError}] = useSubmitOrderMutation()
    const {cartId } = route.params
    const onBackToScanPressed = () => {
        navigation.goBack()
    }
    const submitOrderClicked = () => {
        console.log(cartId)
        submitOrder({
            variables: {
                submitOrderInput: {
                    cartId: cartId
                }
            }
        })
        navigation.navigate("OrderSubmittedScreen")
    }

    if (getCartsLoading && !getCartsData) return <Text>Loading</Text>
    if (getCartsError) return <Text>Error</Text>

    const cart = getCartsData.carts[0]
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.safeContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>Checkout</Text>
                </View>
                <View style={styles.summaryContainer}>
            
                       <TouchableOpacity style={styles.checkoutButton} onPress={submitOrderClicked}>
                          <Text style={styles.checkoutButtonText}>Submit Order</Text>
                       </TouchableOpacity>
            
                   
                </View>
                <View style={styles.itemsContainer}>
                    <Text style={styles.secondaryTitleText}>Order Summary</Text>
                    <View style={styles.orderSummaryDetail}>
                    <View style={styles.itemDetailLine}>
                        <Text style={styles.boldSecondaryText}>Est Delivery</Text>
                        <Text style={styles.boldSecondaryText}>03/25/2022</Text>
                    </View>
                    <View style={styles.itemDetailLine}>
                        <Text style={styles.boldSecondaryText}>Subtotal</Text>
                        <Text style={styles.boldSecondaryText}>${cart.subtotal}</Text>
                    </View>
                    <View style={styles.itemDetailLine}>
                        <Text style={styles.boldSecondaryText}>Store</Text>
                        <Text style={styles.boldSecondaryText}>Pete's Gas</Text>
                    </View>
                </View>
                </View>
                
            </View>
        </SafeAreaView>
    )
}   