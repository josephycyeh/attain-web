import react, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, StatusBar, Button,TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { BarCodeScanner } from 'expo-barcode-scanner';
import NumericInput from 'react-native-numeric-input'
import { useGetItemsQuery, useGetCartsQuery, useUpdateItemInCartMutation, useAddItemToCartMutation, useGetOrdersQuery} from '../../generated/graphql'
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
        width:55,
        height:55
    },
    itemContainer: {

        flexDirection:"row",
        flexWrap:"wrap",

        justifyContent:"space-between"
    },
    itemInfoContainer: {
        flexDirection:'row', 

        flexWrap:"wrap",
    },
    boldMainText: {
        fontSize:20,
        fontWeight:"600",
        marginBottom:15,

    },
    boldSecondaryText: {
        fontSize:15,
        marginBottom:10,
        fontWeight:"600",    
    },
    itemTextContainer: {
        marginLeft:8,
    
    },
    quantityContainer: {
        marginTop:30,
        marginBottom:30,
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
    orderSummaryView: {
        display:"flex",
        flexDirection: "row",
        justifyContent:"space-between",
    },
    boldMainText: {
        fontSize:15,
        fontWeight:"600",
        marginBottom:15,
      },
      boldSecondaryText: {
        fontSize:15,
        fontWeight:"600", 
        marginBottom:5   
      },
      bodyText: {
        fontSize: 15
      },
      mutedBodyTextSmall: {
        fontSize: 11,
        color: "#313233"
    
      },
      itemPriceContainer: {
          flex:1,
          flexDirection:"column",
          justifyContent:"center",
      },
     orderItemContainer: {
        borderStyle: "solid",
        borderBottomWidth: 0.5,
        paddingVertical: 20,
        borderBottomColor: "gray"
        
     }
  });
  
export default function OrderDetailScreen({ navigation, route }) {
    const { upcCode, orderId } = route.params
    console.log(upcCode)
    const {loading:getCartsLoading, data:getCartsData, error: getCartsError} = useGetCartsQuery({
        fetchPolicy:"network-only",
        variables: {
            getCartsInput: {
                ids: ["1"]
            },
        },
        pollInterval: 500
    })
    console.log(orderId)
    const {loading:getOrdersLoading, data:getOrdersData, error:getOrdersError} = useGetOrdersQuery({
        fetchPolicy:"network-only",
        variables: {
            getOrdersInput: {
                userId: 1,
                ids: [orderId]
            },
        },
        pollInterval: 500
    })

    
    if (getOrdersLoading && !getOrdersData) return <Text>Loading</Text>
  if (getOrdersError) return <Text>{getOrdersError.message}</Text>

  const order = getOrdersData.orders[0]
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.safeContainer}>
            <View style={styles.orderSummaryView}>
            <View>
           <Text style={[styles.bodyText, {textAlign: "left", marginBottom: 5}]}>
              {new Date(order.date_submitted).toDateString()}
            </Text>  
            <Text style={[styles.mutedBodyTextSmall, {textAlign: "left"}]}>
              Order#: {order.id}
            </Text> 
            </View>
            <View>
           <Text style={[styles.bodyText, {textAlign: "right", marginBottom:5}]}>
              ${order.subtotal}
            </Text>  
            <Text style={[styles.mutedBodyTextSmall, {textAlign: "right"}]}>
               {order.orderItems.length} Items
            </Text> 
            </View>
            </View>
            <View
  style={{
    borderBottomColor: 'black',
    borderBottomWidth: 0.5,
    marginTop: 10
  }}
/>
            <View>
                {
                    order.orderItems.map((item) => {
                       return (
                 
            <View key={item.id} style={styles.orderItemContainer}>
            <Text style={styles.boldSecondaryText}>{item.description}</Text>
            <View style={styles.itemContainer}> 
            <View style={styles.itemInfoContainer}>   
            <Image style={styles.itemImage} source={{uri:item.image}}/>
            <View style={styles.itemTextContainer}>
                <Text style={styles.mutedBodyTextSmall}>UPC: {item.upc1}</Text>
    
                <Text style={styles.mutedBodyTextSmall}>Unit Size: {item.unit_size}</Text>
                
               
                <Text style={styles.mutedBodyTextSmall}>Category: {item.nacs_category}</Text>

              
              
                <Text style={styles.mutedBodyTextSmall}>Case Cost: {item.case_cost}</Text>
            </View>

            </View>

            <View style={styles.itemPriceContainer}>
                <Text style={{textAlign:"right"}}>${item.case_cost * item.quantity}</Text>
            </View>
            </View>
            </View>
            
            
           
    
                       )
                    })
                }
            </View>
            </View>
        </SafeAreaView>
    )
}   