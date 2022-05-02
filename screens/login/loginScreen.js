import react, {useEffect, useState, useContext} from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, StatusBar, Button,TouchableOpacity, Image, Alert, Platform, TextInput } from 'react-native';
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


import { UserContext } from '../../context/userContext'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";



const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        backgroundColor:"white"
    },
    safeContainer: {
        marginHorizontal: 0,
        flexDirection: "column",
        justifyContent:"center",
        flex: 1,

    },
    credentialsContainer: {

        height: "75%",
        flexDirection: "column",
        alignItems:"center"
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


        backgroundColor: "#3C95FF",
        width: "80%",
        height: 40,
        justifyContent: "center",
        alignItems:"center",
        borderRadius: 10
    },
    logoImage: {
        width: 80,
        height: 70
    },
    credentialsInput: {
        width: "80%",
        height: 45,
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 10,
        padding: 10
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
    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    })

    const onChangeText = (type, text) => {
        
        const temp = {...credentials}
        temp[type] = text
        setCredentials(temp)

    }
    const auth = getAuth();

    const signInButtonPressed = async () => {
        const email = credentials.username + "@joinattain.com"
        console.log(email)
        const password = credentials.password
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            
            const user = userCredential.user;
            setIsLoggedIn(true)
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(error.message)
        });
    }




    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.safeContainer}>
            <View style={styles.credentialsContainer}>

           
            <Image
        style={styles.logoImage}
        source={require('../../assets/logo.png')}
      />
                <Text style={styles.boldHeaderText}>Attain</Text>
                <Text style={[styles.boldMainText, {marginBottom: 50}]}>Your one-stop shop for inventory</Text>

              
                <TextInput style={[styles.credentialsInput, {marginBottom: 10}]} placeholder="username" onChangeText={(text) => onChangeText("username", text)} autoCapitalize='none' value={credentials.username} ></TextInput>
                <TextInput style={[styles.credentialsInput, {marginBottom: 10}]} placeholder="password" onChangeText={(text) => onChangeText("password", text)}  autoCapitalize='none' value={credentials.password} secureTextEntry={true} autoCorrect={false}></TextInput>
    
                <TouchableOpacity style={[styles.signInButton, {marginTop: 50}]} onPress={signInButtonPressed}>
                <Text style={[styles.boldSecondaryText, {color:"white"}]}>Sign In</Text>

                </TouchableOpacity>
            </View>
            </View>
        </SafeAreaView>
    )
}   