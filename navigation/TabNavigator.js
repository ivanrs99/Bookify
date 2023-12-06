import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  HomeStackNavigator,
  SearchStackNavigator,
  ProfileStackNavigator,
} from "./StackNavigator";
import Ionicons from "react-native-vector-icons/Ionicons";
import global from "../global";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const tabScreenOptions = ({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;
      if (route.name === "HomeTab") {
        iconName = focused ? "home" : "home-outline";
      } else if (route.name === "SearchTab") {
        iconName = focused ? "search" : "search-outline";
      } else if (route.name === "ProfileTab") {
        iconName = focused ? "person-circle" : "person-circle-outline";
      }
      return <Ionicons name={iconName} size={size} color={color} />;
    },
    tabBarShowLabel: false,
    tabBarActiveTintColor: global.PRIMARY_COLOR,
    tabBarInactiveTintColor: "gray",
    headerShown: false,
    tabBarStyle: {
      display:
        getFocusedRouteNameFromRoute(route) == "ReviewCreator"
          ? "none"
          : "flex",
    },
  });

  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} />
      <Tab.Screen name="SearchTab" component={SearchStackNavigator} />
      <Tab.Screen name="ProfileTab" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
