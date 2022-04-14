import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { connectInfiniteHits } from 'react-instantsearch-native';
import Highlight from './Highlight';

const styles = StyleSheet.create({
  separator: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  item: {
    padding: 10,
    flexDirection: 'column',
  },
  titleText: {
    fontWeight: 'bold',
  },
});

const InfiniteHits = ({ hits, hasMore, refineNext, goToItemDetail}) => {
  console.log(hits)
  return (
    <View>
    
        <FlatList
          data={hits}
          keyExtractor={item => item.objectID}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          onEndReached={() => hasMore && refineNext()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => goToItemDetail(item)}>
              
            <View style={styles.item} key={item.objectID} >
              <Text style={styles.titleText}>
                <Highlight attribute="description" hit={item} />
              </Text>
            </View>
            </TouchableOpacity>
          )}
        />
      
    </View>
  
  )
};

InfiniteHits.propTypes = {
  hits: PropTypes.arrayOf(PropTypes.object).isRequired,
  hasMore: PropTypes.bool.isRequired,
  refineNext: PropTypes.func.isRequired,
};

export default connectInfiniteHits(InfiniteHits);
