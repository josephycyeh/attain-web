import react, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Button,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  TextInput,
} from "react-native";

import Text from "../../components/Text"

import { UserContext } from "../../context/userContext";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "white",
  },
  safeContainer: {
    marginHorizontal: 0,
    flexDirection: "column",
    justifyContent: "center",
    flex: 1,
  },
  credentialsContainer: {
    height: "75%",
    flexDirection: "column",
    alignItems: "center",
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
    width: 120,
    height: 120,
  },
  itemContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  boldMainText: {
    fontSize: 20,
    fontWeight: "600",
  },
  boldSecondaryText: {
    fontSize: 15,
    fontWeight: "600",
  },
  itemDetailLine: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  itemTextContainer: {
    marginLeft: 20,
    flex: 2,
  },
  quantityContainer: {
    marginTop: 30,
    marginBottom: 30,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  pricingContainer: {
    marginTop: 20,
    marginBottom: 50,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 0,
  },
  mainButton: {
    color: "white",
    backgroundColor: "#3C95FF",
    height: 45,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  mainButtonText: {
    fontSize: 20,
    color: "white",
  },
  boldHeaderText: {
    fontSize: 50,
    fontWeight: "600",
  },
  signInButton: {
    backgroundColor: "#3C95FF",
    width: "80%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  logoImage: {
    width: 80,
    height: 70,
  },
  credentialsInput: {
    width: "80%",
    height: 45,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
});


export default function LoginScreen({ navigation, route }) {
  const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const onChangeText = (type, text) => {
    const temp = { ...credentials };
    temp[type] = text;
    setCredentials(temp);
  };
  const auth = getAuth();
  const [loginError, setLoginError] = useState(null);
  const signInButtonPressed = async () => {
    const email = credentials.username + "@joinattain.com";
    const password = credentials.password;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setIsLoggedIn(true);
      })
      .catch((error) => {
        const errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == "auth/too-many-requests") {
          errorMessage = "Too Many Requests, Wait A Minute To Try Again";
        }
        if (errorCode == "auth/wrong-password") {
          errorMessage = "Wrong Password";
        }

        if (errorCode == "auth/user-not-found") {
          errorMessage = "Wrong Username";
        }

        setLoginError(errorMessage);
        setTimeout(() => setLoginError(null), 3000);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.safeContainer}>
        {loginError && (
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              paddingHorizontal: 35,
              alignItems: "center",
              flexDirection: "row",
              position: "absolute",
              top: 10,
              width: "100%",
              height: 60,
              backgroundColor: "#3C95FF",
              borderRadius: 0,
              borderRadius: 0,
            }}
          >
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <Text style={styles.boldSecondaryText}>{loginError}</Text>
            </View>
          </View>
        )}
        <View style={styles.credentialsContainer}>
          <Image
            style={styles.logoImage}
            source={require("../../assets/logo.png")}
          />
          <Text style={styles.boldHeaderText}>Attain</Text>
          <Text style={[styles.boldMainText, { marginBottom: 50 }]}>
            Your one-stop shop for inventory
          </Text>

          <TextInput
            style={[styles.credentialsInput, { marginBottom: 10 }]}
            placeholderTextColor="gray"
            placeholder="username"
            onChangeText={(text) => onChangeText("username", text)}
            autoCapitalize="none"
            value={credentials.username}
            autoCorrect={false}
          ></TextInput>
          <TextInput
            style={[styles.credentialsInput, { marginBottom: 10 }]}
            placeholderTextColor="gray"
            placeholder="password"
            onChangeText={(text) => onChangeText("password", text)}
            autoCapitalize="none"
            value={credentials.password}
            autoCorrect={false}
          ></TextInput>

          <TouchableOpacity
            style={[styles.signInButton, { marginTop: 50 }]}
            onPress={signInButtonPressed}
          >
            <Text style={[styles.boldSecondaryText, { color: "white" }]}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
