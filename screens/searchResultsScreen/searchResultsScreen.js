import react, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
} from "react-native";
import Text from "../../components/Text"
import algoliasearch from "algoliasearch";
import { InstantSearch, connectStateResults } from "react-instantsearch-native";
import SearchBox from "../../components/SearchBox";
import InfiniteHits from "../../components/InfiniteHits";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "white",
  },
  safeContainer: {
    marginHorizontal: 0,
    flex: 1,
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
    marginBottom: 15,
  },
  boldSecondaryText: {
    fontSize: 15,
    marginBottom: 10,
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
});
const searchClient = algoliasearch(
  "65VCJQ2Y52",
  "d6602e5f7c45ce8b0ef699efe84cca0d"
);

const Results = connectStateResults(({ searchState, children }) => {
  return searchState && searchState.query ? (
    children
  ) : (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <Text>Start typing to search!</Text>
    </View>
  );
});

export default function SearchResultsScreen({ navigation, route }) {
  const goToItemDetail = (item) => {
    navigation.navigate("ItemDetail", {
      id: item.id,
    });
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.safeContainer}>
        <InstantSearch searchClient={searchClient} indexName="items">
          <SearchBox />
          <Results>
            <InfiniteHits goToItemDetail={goToItemDetail} />
          </Results>
        </InstantSearch>
      </View>
    </SafeAreaView>
  );
}
