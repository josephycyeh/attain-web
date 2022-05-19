import react, {useEffect, useState, useContext} from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, StatusBar, Button,TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { BarCodeScanner } from 'expo-barcode-scanner';
import NumericInput from 'react-native-numeric-input'
import { useGetItemsQuery, useGetCartsQuery, useUpdateItemInCartMutation, useAddItemToCartMutation } from '../../generated/graphql'
import { UserContext } from '../../context/userContext'
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
    itemContainer: {
        flexDirection:'row', 
        flexWrap:'wrap',
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
    errorText: {
        textAlign: 'center',
        fontSize: 20,
        alignItems:'center',
        justifyContent:"center",
        marginTop:40,
        flexDirection:"row"
    }
  });
  
export default function ItemDetailScreen({ navigation, route }) {
    const { isLoggedIn, setIsLoggedIn, user } = useContext(UserContext)
    const { upcCode } = route.params
    const {loading:getCartsLoading, data:getCartsData, error: getCartsError} = useGetCartsQuery({
        fetchPolicy:"network-only",
        variables: {
            getCartsInput: {
                userId: user.id
            },
        },
        pollInterval: 500
    })

    const { loading, error, data } = useGetItemsQuery({ 
        fetchPolicy: 'network-only',
        variables: { getItemsInput: {
            upcs: [upcCode],
            pagination: {
                limit: 1,
                offset: 0
            
            }
        } }}) 

    const [updateItemInCart, {loading:updateItemInCartLoading, data:updateItemInCartData, error:updateItemInCartError}] = useUpdateItemInCartMutation()

    const onEditQuantity = (value) => {
        setQuantity(value)
    }
    const [quantity, setQuantity] = useState(1)
    if (loading && !data) return <Text style={styles.errorText}>Loading item...</Text>
    if (error) return <Text style={styles.errorText}>Something went wrong!</Text>
    if (getCartsLoading && !getCartsData) return <Text style={styles.errorText}>Loading item...</Text>
    if (getCartsError) return <Text style={styles.errorText}>Something went wrong!</Text>
    
    const cart = getCartsData.carts[0]
    if (data.items.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.safeContainer}>
                    <Text style={styles.errorText}>Sorry! We don't have that item yet.</Text>
                </View>
            </SafeAreaView>
        )
    }

    const item = data.items[0]
    const onBackToScanPressed = () => {
        navigation.goBack()
    }
    const onAddToCartPressed = () => {
        var quantityToBeUpdated = quantity
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
        navigation.goBack()
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.safeContainer}>
            <View style={styles.itemContainer}>
            <Image style={styles.itemImage} source={{uri:item.image}}/>
            <View style={styles.itemTextContainer}>
                <Text style={styles.boldMainText}>{item.description}</Text>
                <View style={styles.itemDetailLine}>
                <Text style={styles.boldSecondaryText}>UPC</Text>
                <Text style={styles.boldSecondaryText}>{item.upc1}</Text>
                </View>
                <View style={styles.itemDetailLine}>
                <Text style={styles.boldSecondaryText}>Unit Size</Text>
                <Text style={styles.boldSecondaryText}>{item.unit_size}</Text>
                </View>
                <View style={styles.itemDetailLine}>
                <Text style={styles.boldSecondaryText}>Category</Text>
                <Text style={styles.boldSecondaryText}>{`${item.nacs_category}`}</Text>
                </View>
               

                
            </View>
            </View>
            <View style={styles.quantityContainer}>
                <View style={{flexDirection:"column", justifyContent:"center", flexWrap:"wrap", verticalAlign:"middle"}}>
                <Text style={{...styles.boldMainText, marginBottom:0}}>
                    Quantity
                </Text>
                </View>
                <NumericInput value={quantity} totalHeight={40} totalWidth={110} rounded iconSize={100} leftButtonBackgroundColor={'#88BEFF'} rightButtonBackgroundColor={"#88BEFF"} onChange={(value) => onEditQuantity(value)} />
            </View>
            <View style={styles.pricingContainer}>
                 <View style={styles.itemDetailLine}>
                <Text style={styles.boldMainText}>Price</Text>
                <Text style={styles.boldMainText}>${item.case_cost}</Text>
                </View>
                <View style={styles.itemDetailLine}>
                <Text style={styles.boldMainText}>SRP</Text>
                <Text style={styles.boldMainText}>${item.srp}</Text>
                </View>
                <View style={styles.itemDetailLine}>
                <Text style={styles.boldMainText}>Profit Margin</Text>
                <Text style={styles.boldMainText}>{item.profit_margin}%</Text>
                </View>
            </View>
            <View style={styles.buttonContainer}>
            <TouchableOpacity
            style={styles.mainButton}
            onPress={onAddToCartPressed}
            >
                <Text style={styles.mainButtonText}>Add To Cart</Text>
                </TouchableOpacity>
               
            </View>
            
            
          
            </View>
        </SafeAreaView>
    )
}   