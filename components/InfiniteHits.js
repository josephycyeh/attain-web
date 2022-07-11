import React from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Text from "./Text.js"
import PropTypes from "prop-types";
import { connectInfiniteHits } from "react-instantsearch-native";
import Highlight from "./Highlight";
import ItemCard from "./ItemCard"
const styles = StyleSheet.create({
  separator: {
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  item: {
    padding: 10,
    flexDirection: "column",
  },
  titleText: {
    fontWeight: "bold",
  },
});

const InfiniteHits = ({ hits, hasMore, refineNext, goToItemDetail }) => {
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={hits}
        numColumns={2}
        columnWrapperStyle={{
          flex: 1,
          justifyContent: "space-between",
          padding: 0,
          marginHorizontal: 20,
        }}
        keyExtractor={(item) => item.objectID}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        onEndReached={() => hasMore && refineNext()}
        renderItem={({ item }) => (
         <ItemCard item={item} highlighted/>
        )}
      />
    </View>
  );
};

InfiniteHits.propTypes = {
  hits: PropTypes.arrayOf(PropTypes.object).isRequired,
  hasMore: PropTypes.bool.isRequired,
  refineNext: PropTypes.func.isRequired,
};

export default connectInfiniteHits(InfiniteHits);
