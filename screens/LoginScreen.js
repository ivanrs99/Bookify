import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import global from "../global";
import logo from "../assets/logo.png";
import { Input, Button } from "@rneui/themed";
import { showMessage } from "react-native-flash-message";
import { signIn, findUser } from "../database/firebaseFunctions";

const LoginScreen = ({ navigation }) => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    if (!user || !password) {
      showMessage({
        message: "Error de inicio de sesión",
        description: "Debes indicar el usuario y la contraseña.",
        type: "danger",
      });
      return;
    }

    const userFound = await findUser(user);
    if (userFound == null) {
      showMessage({
        message: "Error de inicio de sesión",
        description: "Usuario no encontrado.",
        type: "danger",
      });
      return;
    }

    const email = userFound.email;
    signIn(email, password)
      .then(() => {
        clearData();
        navigation.navigate("Home");
      })
      .catch((error) => {
        showLogInError(error);
      });
  };

  const clearData = () => {
    setUser("");
    setPassword("");
  };

  const showLogInError = (error) => {
    if (error.code === "auth/invalid-login-credentials") {
      showMessage({
        message: "Error de inicio de sesión",
        description: "La contraseña es incorrecta.",
        type: "danger",
      });
    } else if (error.code === "auth/too-many-requests") {
      showMessage({
        message: "Error de inicio de sesión",
        description:
          "Has fallado la contraseña demasiadas veces. Inténtalo más tarde o restablece la contraseña.",
        type: "danger",
      });
    } else {
      showMessage({
        message: "Error de inicio de sesión",
        description: "Ocurrió un error al iniciar sesión.",
        type: "danger",
      });
    }
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logoImg} />
      <Text style={styles.text}>¡Bienvenido a Bookify!</Text>
      <View style={styles.formContainer}>
        <Input
          label="Usuario"
          labelStyle={{ color: "black", fontWeight: "normal" }}
          placeholder="Usuario"
          value={user}
          autoCapitalize="none"
          onChangeText={(value) => setUser(value)}
        />
        <Input
          label="Contraseña"
          labelStyle={{ color: "black", fontWeight: "normal", marginTop: 10 }}
          placeholder="Contraseña"
          secureTextEntry={true}
          value={password}
          autoCapitalize="none"
          onChangeText={(value) => setPassword(value)}
        />
        <Button
          title="INICIAR SESIÓN"
          buttonStyle={styles.button}
          titleStyle={{ fontWeight: "bold", fontSize: 20 }}
          containerStyle={{ width: "65%" }}
          onPress={login}
        />
        <View style={{ flexDirection: "row", marginTop: 30 }}>
          <Text style={{ fontSize: 15 }}>¿No tienes cuenta? </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Register", {
                editMode: false,
                img: null,
                name: "",
                surname: "",
                user: "",
              })
            }
          >
            <Text
              style={{
                color: global.PRIMARY_COLOR,
                textDecorationLine: "underline",
              }}
            >
              REGISTRATE
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: global.PRIMARY_COLOR,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
    width: "100%",
  },
  logoImg: {
    height: 100,
    width: 100,
    marginTop: 130,
    borderRadius: 50,
  },
  text: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  formContainer: {
    backgroundColor: "white",
    height: "50%",
    width: "100%",
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    alignItems: "center",
    padding: 30,
  },
  button: {
    backgroundColor: global.PRIMARY_COLOR,
    marginTop: 20,
    borderRadius: 20,
  },
});

export default LoginScreen;
