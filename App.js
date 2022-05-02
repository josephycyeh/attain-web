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
import { ApolloClient, InMemoryCache} from '@apollo/client';

import { ApolloProvider } from '@apollo/react-hooks';
import { HttpLink } from 'apollo-link-http';
import Constants from "expo-constants";
import { UserContext } from './context/userContext'
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";

import { useGetItemsQuery, useGetOrdersQuery, useGetCartsQuery, useUpdateItemInCartMutation, useAddItemToCartMutation, useGetUsersQuery } from './generated/graphql'


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDazkUMxMUnWRpp19dAH31_TXJ3xrQL3RE",
  authDomain: "attain-23279.firebaseapp.com",
  projectId: "attain-23279",
  storageBucket: "attain-23279.appspot.com",
  messagingSenderId: "556882473265",
  appId: "1:556882473265:web:a92cd9a5294dc755f38010",
  measurementId: "G-H6QGK63XJL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);



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
  return (
    <ApolloProvider client={client}>
      <AppComponent></AppComponent>
    </ApolloProvider>
  )
}

function AppComponent() {
  








  const [isLoggedIn, setIsLoggedIn] = useState(null)

  const [user, setUser] = useState({})
  const [userId, setUserId] = useState(null)
  
  const {loading:getUsersLoading, data:getUsersData, error:getUsersError} = useGetUsersQuery({
    skip: (userId == null),
    variables: {
        getUsersInput: {
          ids: [userId]
        },
    },
    pollInterval: 500
})

  useEffect(async () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {

        const querySnapshot = await getDoc(doc(db, "users", user.uid));
       

        setUserId(querySnapshot.data()["userId"])

        setIsLoggedIn(true)


      } else {
        setIsLoggedIn(false)
        setUserId(null)
      }
    });
  }, [])


  useEffect(() => {
    if (!getUsersLoading && getUsersData) {
      setUser(getUsersData.users[0])
    }
  }, [getUsersLoading, getUsersData])




  



  if (isLoggedIn == null) {
    return <Text>Loading</Text>
  }

  if (getUsersLoading && !getUsersData) return <Text>Loading</Text>
  if (getUsersError) return <Text>Error: {getUsersError.message}</Text>

  

  const AppStack = createStackNavigator();
      return (
  
          <UserContext.Provider value={{isLoggedIn, setIsLoggedIn, user}}>
       <NavigationContainer>
        <AppStack.Navigator>
          {
            isLoggedIn ?  <AppStack.Screen name="Attain" component={HomeTabs} options={{headerShown: false }} /> : <AppStack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}></AppStack.Screen>
          }
          
         
          <AppStack.Screen name="OrderSubmittedScreen" component={OrderSubmittedScreen} options={{headerShown: false, presentation: "modal" }}/>
        </AppStack.Navigator>
         </NavigationContainer>
         </UserContext.Provider>  

      );
    }



