import react, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Button,
  PixelRatio
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as Amplitude from 'expo-analytics-amplitude';
import { BarCodeScanner } from "expo-barcode-scanner";
import ItemDetailScreen from "../itemDetailScreen/itemDetailScreen";
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
    flex: 1,
    backgroundColor: opacity,
  },
  layerCenter: {
    flex: 1,
    flexDirection: "row",
  },
  layerLeft: {
    flex: 1,
    backgroundColor: opacity,
  },
  focused: {
    flex: 10,
  },
  layerRight: {
    flex: 1,
    backgroundColor: opacity,
  },
  layerBottom: {
    flex: 1,
    backgroundColor: opacity,
  },
});

function ScannerScreenComponent({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

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
      >
        <View style={styles.layerTop} />
        <View style={styles.layerCenter}>
          <View style={styles.layerLeft} />
          <View style={styles.focused} />
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
