import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import { signOutUser } from "../database/firebaseFunctions";

const SearchScreen = ({ navigation }) => {
  const logOut = () => {
    signOutUser();
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => logOut()}>
          <Ionicons name="arrow-back-circle" size={40} color="black" />
        </TouchableOpacity>
      </View>
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
  header: {
    width: "100%",
    alignItems: "flex-start",
    paddingTop: 40,
    paddingLeft: 15,
    marginBottom: 20,
  },
});

export default SearchScreen;
