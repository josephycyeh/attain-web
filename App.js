import react, {useState, useEffect, createContext} from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/homeScreen/homeScreen'
import ScannerScreen from './screens/scannerScreen/scannerScreen'
import CartScreen from './screens/cartScreen/cartScreen.js'
import HomeTabs from './screens/homeTabs/homeTabs.js'
import LoginScreen from './screens/login/loginScreen.js'
import OrderSubmittedScreen from './screens/orderSubmittedScreen/orderSubmittedScreen.js'
import ItemDetailScreen from './screens/itemDetailScreen/itemDetailScreen'
import { AppRegistry } from 'react-native';
import { ApolloClient,} from 'apollo-client';
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from '@apollo/react-hooks';
import { HttpLink } from 'apollo-link-http';
import Constants from "expo-constants";
import * as SecureStore from 'expo-secure-store';
import { UserContext } from './context/userContext'
import axios from 'axios'
async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}

async function deleteKey(key) {
  await SecureStore.deleteItemAsync(key);
}

async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  return result
}



const { manifest } = Constants;

// const uri = `http://${manifest.debuggerHost.split(':').shift()}:4000`;
const link = new HttpLink({
  uri: "https://attain-server.herokuapp.com",
});

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(
    {addTypename: false}
  )
});












export default function App() {
  

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)


  useEffect(async () => {
    console.log("load")
    const access_token = await getValueFor('access_token')
    if (access_token) {
      const userProfile = await getUserProfile(access_token)
      if (userProfile) {
        setIsLoggedIn(true)
      }
      else {
        setIsLoggedIn(false)
      }
      
    } else {
      console.log("aaa")
      setIsLoggedIn(false)
    }

    setLoading(false)
  }, [])


  
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

  if (loading) {
    return null
  }

  const AppStack = createStackNavigator();

      return (
        <ApolloProvider client={client}>
          <UserContext.Provider value={{isLoggedIn, setIsLoggedIn}}>
       <NavigationContainer>
        <AppStack.Navigator>
          {
            isLoggedIn ?  <AppStack.Screen name="Attain" component={HomeTabs} options={{headerShown: false }} /> : <AppStack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}></AppStack.Screen>
          }
          
         
          <AppStack.Screen name="OrderSubmittedScreen" component={OrderSubmittedScreen} options={{headerShown: false, presentation: "modal" }}/>
        </AppStack.Navigator>
         </NavigationContainer>
         </UserContext.Provider>
         </ApolloProvider>
      );
    }
