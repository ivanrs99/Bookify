import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ReviewCreatorScreen from "../screens/ReviewCreatorScreen";

const Stack = createStackNavigator();

const screenOptions = {
  headerShown: false,
  animationEnabled: true,
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
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

export { LoginStackNavigator };
