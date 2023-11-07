import React, { useEffect } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { auth } from "../database/firebase";
import { onAuthStateChanged } from "firebase/auth";
import global from "../global";

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.navigate("ReviewCreator");
      } else {
        navigation.navigate("LoginStack");
      }
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size={100} color={global.PRIMARY_COLOR} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
});

export default SplashScreen;
