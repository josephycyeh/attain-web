import react, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, StatusBar, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { BarCodeScanner } from 'expo-barcode-scanner';
import ItemDetailScreen from '../itemDetailScreen/itemDetailScreen'
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor:"white"
  },
  scrollView: {
    marginHorizontal: 20,
    backgroundColor:"white"
  },
  titleText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10
  },
  orderText: {
    margin:"5px",
    fontSize: 18
  },
  orderView: {
    borderStyle:"solid",
    borderColor:"gray",
    borderWidth: 1,
    padding: 10,
    borderRadius: 20
  },
  innerContainerView: {
    marginTop: 20
  }
});


function ScannerScreenComponent({ navigation }) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
  
    useEffect(() => {
      (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
        
      })();
    }, []);
    useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
        setScanned(false)
      });
  
      return unsubscribe;
    }, [navigation]);
    const handleBarCodeScanned = ({ type, data }) => {
      setScanned(true);
      navigation.navigate("ItemDetail", {
        upcCode: data,

      })
      
    };
  
    if (hasPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    }
  
    return (
      <View style={styles.container}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        
      </View>
    );
}

const ScannerScreenStack = createStackNavigator();
export default function ScannerScreen() {
      return (
        <ScannerScreenStack.Navigator initialRouteName="Attain">
          <ScannerScreenStack.Screen name="Scanner" component={ScannerScreenComponent} />
          <ScannerScreenStack.Screen name="ItemDetail" component={ItemDetailScreen} />
        </ScannerScreenStack.Navigator>
      );
    }
