import react, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Button,
  TouchableOpacity,
  PixelRatio
} from "react-native";
import { Icon } from 'react-native-elements'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as Amplitude from 'expo-analytics-amplitude';
import { BarCodeScanner } from "expo-barcode-scanner";
import ItemDetailScreen from "../itemDetailScreen/itemDetailScreen";
library.add(fas);

const opacity = "rgba(0, 0, 0, .6)";

const fontScale = PixelRatio.getFontScale()

const fontScalerCalculator = (scaler) => {

  if (scaler >= 1.4) {
    return 1.25
  }

  if (scaler >= 1.2) {
    return 1.2
  }

  if (scaler >= 1.1) {
    return 1.1
  }

  return 1
}
const fontScaler = fontScalerCalculator(fontScale)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "white",
  },
  scrollView: {
    marginHorizontal: 20,
    backgroundColor: "white",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  orderText: {
    margin: "5px",
    fontSize: 18,
  },
  orderView: {
    borderStyle: "solid",
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    borderRadius: 20,
  },
  innerContainerView: {
    marginTop: 20,
  },
  layerTop: {
    flex: 1.5,
    backgroundColor: opacity,
  },
  layerCenter: {
    flex: 2,
    flexDirection: "row",
  },
  layerLeft: {
    flex: 3,
    backgroundColor: opacity,
  },
  focused: {
    flex: 8,
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#FFFFFF",
    overflow: "hidden",
    position: "relative",
  },
  layerRight: {
    flex: 3,
    backgroundColor: opacity,
  },
  layerBottom: {
    flex: 2.5,
    backgroundColor: opacity,
  },
  headerContainer: {
    zIndex: 5,
    justifyContent: "space-between",
    paddingHorizontal: 35,
    flexDirection: "row",
    top: 0,
    width: "100%",
    height: 65,
  },
  deleteButton: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
    width: 60,
  },
  closeText: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "600",
    justifyContent: "center"
  },
  helpIcon: {
    marginRight: 10,
  },
  barCodeTab: {
    zIndex: 5,
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "15%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "white",
  },
  mainInstructionText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },

});

function ScannerScreenComponent({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [flash, setFlash] = useState(false);
  const [modal, setModal] = useState(false);

  useEffect(async () => {
    
    await Amplitude.logEventAsync('SCANNING_SCREEN_VIEWED');
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setScanned(false);
    });

    return unsubscribe;
  }, [navigation]);
  const handleBarCodeScanned = async ({ type, data }) => {
    await Amplitude.logEventWithPropertiesAsync('SCANNED_ITEM', {upcCode: data});
    setScanned(true);
    navigation.navigate("ItemDetail", {
      upcCode: data,
    });
  };

  const goToHome = () => {
    navigation.navigate("Home")
  }

  const onClickFlash = () => {
    setFlash(!flash);
  }

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
        <View style={styles.headerContainer}>
            <View style={{flexDirection: "row", alignItems: "center"}}>
                <TouchableOpacity onPress={goToHome}>
                    <FontAwesomeIcon icon="fa-solid fa-arrow-left" />
                </TouchableOpacity>
            </View>
            <View style={{flexDirection: "row", alignItems: "center"}}>
                { flash ? (
                    <TouchableOpacity onPress={onClickFlash}>
                        <FontAwesomeIcon icon="fa-solid fa-bolt" />
                    </TouchableOpacity>
                ): (
                    <TouchableOpacity onPress={onClickFlash}>
                        <FontAwesomeIcon icon="fa-solid fa-bolt" />
                    </TouchableOpacity>
                )}
                
            </View>
      </View>
      <View style={styles.barCodeTab}>
          <Text style={styles.mainInstructionText}>Point at barcode to scan</Text>
          <Text style={{fontSize: 14}}>Hold the phone steady.</Text>
          <Text style={{fontSize: 14}}>Focus barcode in view window.</Text>
      </View>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      >
        <View style={styles.layerTop} />
        <View style={styles.layerCenter}>
          <View style={styles.layerLeft} />
          <View style={styles.focused}>
          </View>
          <View style={styles.layerRight} />
        </View>
        <View style={styles.layerBottom} />
      </BarCodeScanner>
    </View>
  );
}

const ScannerScreenStack = createStackNavigator();
export default function ScannerScreen() {
  return (
    <ScannerScreenStack.Navigator screenOptions={({ route }) => ({
      headerTitleStyle: {
        fontSize: 25 / fontScale
      },
    })} initialRouteName="Attain">
      <ScannerScreenStack.Screen
        name="Scanner"
        component={ScannerScreenComponent}
      />
      <ScannerScreenStack.Screen
        name="ItemDetail"
        component={ItemDetailScreen}
      />
    </ScannerScreenStack.Navigator>
  );
}
