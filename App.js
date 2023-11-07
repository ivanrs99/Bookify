import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import global from "./global";
import { InitialStackNavigator } from "./navigation/StackNavigator";
import FlashMessage from "react-native-flash-message";
import * as NavigationBar from "expo-navigation-bar";

const App = () => {
  //NavigationBar.setPositionAsync("absolute");
  NavigationBar.setBackgroundColorAsync(global.PRIMARY_COLOR);

  return (
    <NavigationContainer>
      <StatusBar backgroundColor={global.PRIMARY_COLOR} />
      <InitialStackNavigator />
      <FlashMessage position="top" floating={true} style={{ marginTop: 35 }} />
    </NavigationContainer>
  );
};

export default App;
