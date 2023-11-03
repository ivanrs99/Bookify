import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import global from "./global";
import { LoginStackNavigator } from "./navigation/StackNavigator";
import FlashMessage from "react-native-flash-message";

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor={global.PRIMARY_COLOR} />
      <LoginStackNavigator />
      <FlashMessage position="top" floating={true} style={{ marginTop: 35 }} />
    </NavigationContainer>
  );
};

export default App;
