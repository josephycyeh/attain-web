import react, { useEffect, useState, useContext } from "react";
import {
    StyleSheet,
    View,
    SafeAreaView,
    ScrollView,
    FlatList,
    TouchableOpacity,
    Image,
    Alert,
    Platform,
    Dimensions,
    PixelRatio,
  } from "react-native";
  import Modal from "react-native-modal";
import Text from './Text.js'
import Highlight from "./Highlight";
import AddItemModal from "./AddItemModal";
import {
  useGetItemsQuery,
  useGetOrdersQuery,
  useGetCartsQuery,
  useUpdateItemInCartMutation,
  useAddItemToCartMutation,
  useGetCategoriesQuery,
} from "../generated/graphql";
import { UserContext } from "../context/userContext";




import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
    homeContainer: {
      flex: 1,
      paddingTop: 0,
      backgroundColor: "red",
    },
    container: {
      backgroundColor: "white",
    },
    statusBar: {
      marginTop: -50,
      height: 50,
      backgroundColor: "#3C95FF",
    },
    orderSectionView: {
      marginTop: 30,
    },
    scrollView: {
      paddingLeft: 20, marginVertical: 10,
    },
    titleText: {
      fontSize: 20,
      fontWeight: "600",
      marginBottom: 10,
    },
    innerContainerView: {
      marginTop: 20,
    },
    topBarView: {},
    titleView: {
      backgroundColor: "#3C95FF",
      paddingTop: 10,
      paddingLeft: 20,
      paddingRight: 20,
    },
    boldText: {
      fontSize: 25,
      fontWeight: "600",
    },
    boldSecondaryText: {
      fontSize: 20,
      fontWeight: "600",
    },
    bodyText: {
      fontSize: 15
    },
    bodyTextSmall: {
      fontSize: 12,
    },
    mutedBodyTextSmall: {
      fontSize: 14,
      color: "#313233",
    },
    mutedBodyTextExtraSmall: {
      fontSize: 11,
      color: "#313233",
    },
    itemView: {
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "black",
      width: "48%",
      marginVertical: 10,
      padding: 8,
      borderStyle: "solid",
      borderRadius: 10,
      borderColor: "black",
      justifyContent: "center",
      flexDirection: "column",
      alignItems: "center",
    },
    itemImage: {
      width: "100%",
      aspectRatio: 1,
      marginBottom: 7,
    },
    boldBodyTextSmall: {
      fontSize: 11,
      fontWeight: "600",
    },
    boldBodyText: {
      fontSize: 14,
      fontWeight: "600",
    },
    addToCartButton: {
      height: 30,
      width: 50,
      borderRadius: 8,
      borderStyle: "solid",
      borderColor: "black",
      borderWidth: 0.5,
      backgroundColor: "white",
      alignContent:"center",
      justifyContent:"center"
    },
    searchBarContainer: {
      width: "100%",
      height: 80,
      backgroundColor: "#3C95FF",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    searchBar: {
      width: "100%",
      height: 40,
      backgroundColor: "white",
      padding: 0,
    },
    searchBarInsideView: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      flex: 1,
      paddingHorizontal: 5,
    },
  
    mutedBodyText: {
      fontSize: 15,
      color: "#313233",
    },
  

    categoryImage: {
      width: "65%",
      aspectRatio: 1,
      marginBottom: 5,
   
    },
  })


const ItemCard = ({item, highlighted}) => {
  const { isLoggedIn, setIsLoggedIn, user } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);

  const cart = user.cart;
  const addItemToCart = (item) => {
    setModalVisible(true)
  };
const navigation = useNavigation();
const getItemQuantityInCart = () => {
  const checkItemId = (cartItem) => cartItem.item_id == item.id;
  if (cart.cartItems.some(checkItemId)) {
      return cart.cartItems.find(
      (cartItem) => cartItem.item_id == item.id
    ).quantity;

  }
  return 0
}


const itemClicked = (item) => {
    navigation.navigate("ItemDetail", {
      id: item.id,
    });
  };

  return (
  <TouchableOpacity
    style={styles.itemView}
    onPress={() => {
      itemClicked(item);
    }}
  >
  
      <Modal
        animationIn="slideInUp"
        isVisible={modalVisible}
        hasBackdrop
        onBackdropPress={() => setModalVisible(false)}
        style={{margin:0, justifyContent:"flex-end"}}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
       
        <AddItemModal item={item} onClose={() => setModalVisible(false)}/>
      </Modal>
    <Image
      style={styles.itemImage}
      source={{
        uri: item.image
          ? item.image
          : "https://via.placeholder.com/150",
      }}
    />
    <View style={{ width: "100%" }}>
      <Text maxFontSizeMultiplier={1.4} numberOfLines={2} style={styles.boldBodyTextSmall}>
        {highlighted ? <Highlight attribute="name" hit={item} /> : item.name }
        
      </Text>
      <Text maxFontSizeMultiplier={1.4} style={styles.mutedBodyTextExtraSmall}>
        Unit Size: {item.unit_size}
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text maxFontSizeMultiplier={1.4} style={[styles.boldBodyText, { marginTop: 5 }]}>
          ${item.price}
        </Text>
        <TouchableOpacity
          style={[styles.addToCartButton, {backgroundColor: getItemQuantityInCart() > 0 ? "black" : "white"}]}
          onPress={() => addItemToCart(item)}
        >
          { getItemQuantityInCart() > 0 ?

            <Text style={{fontSize: 16, textAlign:"center", color:"white"}}>{getItemQuantityInCart()}</Text> 

          :
          <Ionicons
            style={{ textAlign: "center" }}
            name="add"
            size={24}
            color="black"
          />
}
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
  )
}

export default ItemCard