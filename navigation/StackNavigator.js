import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ReviewCreatorScreen from "../screens/ReviewCreatorScreen";
import SplashScreen from "../screens/SplashScreen";

const Stack = createStackNavigator();

const screenOptions = {
  headerShown: false,
  animationEnabled: true,
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};

const InitialStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={screenOptions}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="LoginStack" component={LoginStackNavigator} />
      <Stack.Screen name="ReviewCreator" component={ReviewCreatorScreen} />
    </Stack.Navigator>
  );
};

const LoginStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={screenOptions}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ReviewCreator" component={ReviewCreatorScreen} />
    </Stack.Navigator>
  );
};

export { InitialStackNavigator, LoginStackNavigator };
