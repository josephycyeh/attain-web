import React from "react";
import { StyleSheet, View, TextInput,  PixelRatio } from "react-native";
import PropTypes from "prop-types";
import { connectSearchBox } from "react-instantsearch-native";

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
    padding: 16,
    backgroundColor: "#3C95FF",
  },
  input: {
    height: 48,
    padding: 12,
    fontSize: 18 / fontScale,
    backgroundColor: "#fff",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

const SearchBox = ({ currentRefinement, refine }) => (
  <View style={styles.container}>
    <TextInput
      autoFocus
      style={styles.input}
      onChangeText={(value) => refine(value)}
      value={currentRefinement}
      placeholder=""
    />
  </View>
);

SearchBox.propTypes = {
  currentRefinement: PropTypes.string.isRequired,
  refine: PropTypes.func.isRequired,
};

export default connectSearchBox(SearchBox);
