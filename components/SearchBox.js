import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import PropTypes from 'prop-types';
import { connectSearchBox } from 'react-instantsearch-native';

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#3C95FF',
    
  },
  searchBar: {
    width: "100%",
    height: 40,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: 10,
    
    
  },
  input: {
    height: 48,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    fontSize: 14,
    color: "#6F6C6C",
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: -0.24
  }
  
});

const SearchBox = ({ currentRefinement, refine }) => (
  <View style={styles.container}>
    <TextInput
      placeholder="Start typing to search!"
      placeholderTextColor="#6F6C6C" 
      style={styles.input}
      onChangeText={value => refine(value)}
      value={currentRefinement}
      
    />
  </View>
);

SearchBox.propTypes = {
  currentRefinement: PropTypes.string.isRequired,
  refine: PropTypes.func.isRequired,
};

export default connectSearchBox(SearchBox);
