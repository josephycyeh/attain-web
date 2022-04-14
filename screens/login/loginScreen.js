import react, {useEffect, useState, useContext} from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, StatusBar, Button,TouchableOpacity, Image, Alert, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { BarCodeScanner } from 'expo-barcode-scanner';
import NumericInput from 'react-native-numeric-input'
import { useGetItemsQuery, useGetCartsQuery, useUpdateItemInCartMutation, useAddItemToCartMutation } from '../../generated/graphql'
import algoliasearch from 'algoliasearch';
import { InstantSearch, connectStateResults } from 'react-instantsearch-native';
import SearchBox from '../../components/SearchBox';
import InfiniteHits from '../../components/InfiniteHits';

import Auth0 from 'react-native-auth0';
const auth0 = new Auth0({ domain: 'dev-wlkiowyr.us.auth0.com', clientId: 'V3IvmHMMWxOkpW2YtLtXoSvDgMB0tOaO' });
import * as AuthSession from 'expo-auth-session';

import jwtDecode from 'jwt-decode';
import axios from 'axios';
import { UserContext } from '../../context/userContext'
import * as SecureStore from 'expo-secure-store';
async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}


const auth0ClientId = "V3IvmHMMWxOkpW2YtLtXoSvDgMB0tOaO";
const authorizationEndpoint = "https://dev-wlkiowyr.us.auth0.com/authorize";


const useProxy = Platform.select({ web: false, default: true });
const redirectUri = AuthSession.makeRedirectUri({ useProxy });

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        backgroundColor:"white"
    },
    safeContainer: {
        marginHorizontal: 0,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flex: 1
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

    },
    boldSecondaryText: {
        fontSize:15,
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
    boldHeaderText: {
        fontSize: 50,
        fontWeight: "600"
    },
    signInButton: {
        position: "absolute",
        bottom: 0,
        marginBottom: 30,
        backgroundColor: "#3C95FF",
        width: "80%",
        height: 40,
        justifyContent: "center",
        alignItems:"center",
        flex: 1
    },
    logoImage: {
        width: 80,
        height: 70
    }
  });
  const searchClient = algoliasearch(
    '65VCJQ2Y52',
    'd6602e5f7c45ce8b0ef699efe84cca0d'
  );
  
  
  const Results = connectStateResults(({ searchState, children }) => {
      console.log(searchState.query)
    return (searchState && searchState.query  ? (
        children
      ) : null
    )
  }
    
  );  
  
export default function LoginScreen({ navigation, route }) {
    const { isLoggedIn, setIsLoggedIn } = useContext(UserContext)
    const [request, result, promptAsync] = AuthSession.useAuthRequest(
        {
          redirectUri,
          clientId: auth0ClientId,
          // id_token will return a JWT token
          responseType: 'token',
          // retrieve the user's profile
          scopes: ['openid', 'profile', 'email', 'user_metadata'],
          extraParams: {
            // ideally, this will be a random value
            nonce: 'nonce',
          },
        },
        { authorizationEndpoint }
      );
    const goToItemDetail = (item) => {
        navigation.navigate("ItemDetail", {
           upcCode: item.upc1 
        })
    }

    const signInButtonPressed = () => {
        promptAsync({ useProxy })
    }

    useEffect(async () => {
        if (result && result.type == "success") {
            save("access_token", result.params.access_token)
            setIsLoggedIn(true)
            const userProfile = await getUserProfile(result.params.access_token)
            console.log(userProfile)
            
            
        }
    }, [result])

    const getUserProfile = async (access_token) => {
        try {
            console.log(access_token)
            const userInfo = await axios.get('https://dev-wlkiowyr.us.auth0.com/userinfo', {headers: {"Authorization": `Bearer ${access_token}`, "Content-Type": "application/json"}})
            return userInfo.data
        }
        catch(err) {
             console.log(err)
             console.log(err.message)
        }
       
       
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.safeContainer}>
            <Image
        style={styles.logoImage}
        source={require('../../assets/logo.png')}
      />
                <Text style={styles.boldHeaderText}>Attain</Text>
                <Text style={[styles.boldMainText, {marginBottom: 75}]}>Your one-stop shop for inventory</Text>
                <TouchableOpacity style={styles.signInButton} onPress={signInButtonPressed}>
                <Text style={[styles.boldSecondaryText, {color:"white"}]}>Sign In</Text>

                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}   