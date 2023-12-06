import { StyleSheet, View, Text } from "react-native";

const SearchScreen = ({ navigation }) => {
  return (
    // SEARCH BAR EN REACT NATIVE ELEMENTS
    <View style={styles.container}>
      <Text>SEARCH</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
});

export default SearchScreen;
