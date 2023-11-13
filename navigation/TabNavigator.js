import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeStackNavigator, SearchStackNavigator } from "./StackNavigator";
import ProfileScreen from "../screens/ProfileScreen";
import Ionicons from "react-native-vector-icons/Ionicons";
import global from "../global";

const Tab = createBottomTabNavigator();

const tabScreenOptions = ({ route }) => ({
  tabBarIcon: ({ focused, color, size }) => {
    let iconName;
    if (route.name === "HomeStack") {
      iconName = focused ? "home" : "home-outline";
    } else if (route.name === "SearchStack") {
      iconName = focused ? "search" : "search-outline";
    } else if (route.name === "ProfileStack") {
      iconName = focused ? "person-circle" : "person-circle-outline";
    }
    return <Ionicons name={iconName} size={size} color={color} />;
  },
  tabBarShowLabel: false,
  tabBarActiveTintColor: global.PRIMARY_COLOR,
  tabBarInactiveTintColor: "gray",
  headerShown: false,
});

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen name="HomeStack" component={HomeStackNavigator} />
      <Tab.Screen name="SearchStack" component={SearchStackNavigator} />
      <Tab.Screen name="ProfileStack" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
