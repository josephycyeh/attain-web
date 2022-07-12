import react, { useEffect, useContext, useState } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  FlatList,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from "react-native";
import Text from "../../components/Text"
import {
  useUpdateItemInCartMutation,
  useGetItemsByFilterQuery,
  useGetTagsQuery,
} from "../../generated/graphql";
import ItemCard from '../../components/ItemCard'


import { UserContext } from "../../context/userContext";
import { getAuth, signOut } from "firebase/auth";
const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: "red",
  },
  container: {
    backgroundColor: "white",
    paddingTop: 10,
  },
  statusBar: {
    marginTop: -50,
    height: 50,
    backgroundColor: "#3C95FF",
  },
  orderSectionView: {
    marginLeft: 20,
    marginTop: 30,
    marginRight: 20,
  },
  scrollView: {},
  titleText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  orderText: {
    margin: 5,
    fontSize: 18,
  },
  orderView: {
    borderStyle: "solid",
    borderColor: "gray",
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 15,
    width: 250,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
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
    fontSize: 15,
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
    padding: 10,
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
    aspectRatio: 1,
    backgroundColor: "gray",
    justifyContent: "center",
    alignItems: "center",
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
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: 10,
  },
  searchBarInsideView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  mutedBodyText: {
    fontSize: 15,
    color: "#313233",
  },

  categoryView: {
    borderStyle: "solid",
    borderColor: "gray",
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 15,
    width: 110,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  categoryImage: {
    width: "70%",
    aspectRatio: 1,
    marginBottom: 5,
  },
});

export default function SelectItemsScreen({ navigation, route }) {
  const { isLoggedIn, setIsLoggedIn, user } = useContext(UserContext);
  const [selectedTag, setSelectedTag] = useState(null);

  const { category } = route.params;

  const {
    loading: getItemsLoading,
    error: getItemsError,
    data: getItemsData,
    fetchMore: fetchMoreItemsQuery,
  } = useGetItemsByFilterQuery({
    fetchPolicy: "cache-and-network",
    variables: {
      getItemsByFilterInput: {
        category: category.value,
        tag: selectedTag ? selectedTag.value : null,
        pagination: {
          offset: 0,
          limit: 20,
        },
      },
    },
  });

  const {
    loading: getTagsLoading,
    error: getTagsError,
    data: getTagsData,
  } = useGetTagsQuery({
    fetchPolicy: "cache-and-network",
    variables: {
      getTagsInput: {
        category: category.value,
        pagination: {
          offset: 0,
          limit: 5,
        },
      },
    },
  });


  if (getItemsLoading && !getItemsData) return <Text>Loading</Text>;
  if (getItemsError) return <Text>{getItemsError.message}</Text>;

  if (getTagsLoading && !getTagsData) return <Text>Loading</Text>;
  if (getTagsError) return <Text>{getTagsError.message}</Text>;



  const cart = cart

  const onSelectTag = (tag, index) => {
    if (selectedTag && index === selectedTag.index) {
      setSelectedTag(null);
    } else {
      setSelectedTag({
        value: tag.value,
        index: index,
      });
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <FlatList
          ListHeaderComponent={
            <View>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{ paddingLeft: 20, marginVertical: 10 }}
              >
                {getTagsData.tags.map((tag, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={{
                        backgroundColor:
                          selectedTag && selectedTag.index == index
                            ? "gray"
                            : "#EBEBEB",
                        marginRight: 10,
                        paddingHorizontal: 7,
                        paddingVertical: 5,
                        borderRadius: 25,
                      }}
                      onPress={() => onSelectTag(tag, index)}
                    >
                      <Text>{tag.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          }
          columnWrapperStyle={{
            flex: 1,
            justifyContent: "space-between",
            padding: 0,
            marginHorizontal: 20,
          }}
          numColumns={2}
          data={getItemsData.itemsByFilter}
          renderItem={({ item }) => (
          <ItemCard item={item}/>)}
          keyExtractor={(item) => item.id}
          onEndReached={() => {
            fetchMoreItemsQuery({
              variables: {
                getItemsByFilterInput: {
                  category: category.value,
                  tag: selectedTag ? selectedTag.value : null,
                  pagination: {
                    offset: getItemsData.itemsByFilter.length,
                    limit: 20,
                  },
                },
              },
              updateQuery: (previousResult, { fetchMoreResult }) => {
                // Don't do anything if there weren't any new items
                if (
                  !fetchMoreResult ||
                  fetchMoreResult.itemsByFilter.length === 0
                ) {
                  return previousResult;
                }
                return {
                  // Append the new feed results to the old one
                  itemsByFilter: previousResult.itemsByFilter.concat(
                    fetchMoreResult.itemsByFilter
                  ),
                };
              },
            });
          }}
          onEndReachedThreshold={0.3}
        />
      </View>
    </SafeAreaView>
  );
}
