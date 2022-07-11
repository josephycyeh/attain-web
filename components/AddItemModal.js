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
  Dimensions
} from "react-native";
import Text from "./Text"
import NumericInput from "react-native-numeric-input";
import {
  useGetItemsQuery,
  useUpdateItemInCartMutation,
} from "../generated/graphql";
import { UserContext } from "../context/userContext";
import { Ionicons } from '@expo/vector-icons';
const styles = StyleSheet.create({
  container: {
  },
  safeContainer: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 50,
    borderRadius: 20


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
    marginBottom: 30
  },
  boldMainText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
  },
  boldSecondaryText: {
    fontSize: 12,
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
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  mainButtonText: {
    fontSize: 18,
    color: "white",
  },
});

const AddItemModal = ({item, onClose}) => {
  const [showAddedToCartPopup, setShowAddedToCartPopup] = useState(false);
  const { isLoggedIn, setIsLoggedIn, user } = useContext(UserContext);

  const [
    updateItemInCart,
    {
      loading: updateItemInCartLoading,
      data: updateItemInCartData,
      error: updateItemInCartError,
    },
  ] = useUpdateItemInCartMutation();

  const onEditQuantity = (value) => {
    setQuantity(value);
  };
  const [quantity, setQuantity] = useState(1);

  const cart = user.cart;


  const getItemQuantityInCart = () => {
    const checkItemId = (cartItem) => cartItem.item_id == item.id;
    if (cart.cartItems.some(checkItemId)) {
        return cart.cartItems.find(
        (cartItem) => cartItem.item_id == item.id
      ).quantity;
  
    }
    return 0
  }


  const onAddToCartPressed = () => {
    var quantityToBeUpdated = quantity;
    quantityToBeUpdated += getItemQuantityInCart()
    updateItemInCart({
      variables: {
        updateItemInCartInput: {
          cartId: cart.id,
          itemId: item.id,
          quantity: quantityToBeUpdated,
        },
      },
    });
    onClose()
    // navigation.goBack()
  };

  const viewCartButtonPressed = () => {
    navigation.navigate("Cart");
  };

  return (
    <View style={styles.container}>
      {showAddedToCartPopup && (
        <View
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingHorizontal: 35,
            flexDirection: "row",
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: 60,
            backgroundColor: "#3C95FF",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
        >
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Text style={styles.boldSecondaryText}>Item Added</Text>
          </View>
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <TouchableOpacity onPress={viewCartButtonPressed}>
              <Text
                style={[
                  styles.boldSecondaryText,
                  { textDecorationLine: "underline" },
                ]}
              >
                View Cart
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View style={styles.safeContainer}>
        <View style={{width: "100%", marginBottom: 10, flexDirection:"row",justifyContent:"flex-end"}}>
        <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={35} color="black" />
        </TouchableOpacity>
        </View>
        <View style={styles.itemContainer}>
          <Image style={styles.itemImage} source={{ uri: item.image }} />
          <View style={styles.itemTextContainer}>
            <Text style={styles.boldMainText}>{item.name}</Text>
           
            <View style={styles.itemDetailLine}>
              <Text style={styles.boldSecondaryText}>Unit Size</Text>
              <Text style={styles.boldSecondaryText}>{item.unit_size}</Text>
            </View>
            <View style={styles.itemDetailLine}>
            <Text style={styles.boldSecondaryText}>Price</Text>
            <Text style={styles.boldSecondaryText}>${item.price}</Text>
          </View>
          </View>
        </View>
        <View style={styles.quantityContainer}>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              flexWrap: "wrap",
              verticalAlign: "middle",
            }}
          >
            <Text style={{ ...styles.boldMainText, marginBottom: 0 }}>
              Quantity
            </Text>
          </View>
          <NumericInput
            initValue={quantity}
            value={quantity}
            totalHeight={35}
            totalWidth={110}
            rounded
            iconSize={100}
            leftButtonBackgroundColor={"#88BEFF"}
            rightButtonBackgroundColor={"#88BEFF"}
            onChange={(value) => onEditQuantity(value)}
          />
        </View>
        {getItemQuantityInCart() > 0 && <View style={{alignItems:"center"}}><Text style={styles.boldSecondaryText}>{getItemQuantityInCart() + " Already In Cart"}</Text></View>}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.mainButton}
            onPress={onAddToCartPressed}
          >
            <Text style={styles.mainButtonText}>Add To Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default AddItemModal