import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import global from "../global";
import logo from "../assets/no-logo.png";
import { Input, Button } from "@rneui/themed";
import { showMessage } from "react-native-flash-message";
import { auth } from "../database/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { signIn, findUser } from "../database/firebaseFunctions";

const LoginScreen = ({ navigation }) => {
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
      }
    });
  }, []);

  const login = async () => {
    if (!usuario || !contraseña) {
      showMessage({
        message: "Error de inicio de sesión",
        description: "Debes indicar el usuario y la contraseña.",
        type: "danger",
      });
      return;
    }

    const user = await findUser(usuario);
    if (user == null) {
      showMessage({
        message: "Error de inicio de sesión",
        description: "Usuario no encontrado.",
        type: "danger",
      });
      return;
    }

    const email = user.email;
    signIn(email, contraseña);
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logoImg} />
      <Text style={styles.text}>Bienvenido!</Text>
      <View style={styles.formContainer}>
        <Input
          label="Usuario"
          labelStyle={{ color: "black", fontWeight: "normal" }}
          placeholder="Usuario"
          onChangeText={(value) => setUsuario(value)}
        />
        <Input
          label="Contraseña"
          labelStyle={{ color: "black", fontWeight: "normal", marginTop: 10 }}
          placeholder="Contraseña"
          secureTextEntry={true}
          onChangeText={(value) => setContraseña(value)}
        />
        <Button
          title="INICIAR SESIÓN"
          buttonStyle={styles.button}
          titleStyle={{ fontWeight: "bold", fontSize: 20 }}
          containerStyle={{ width: "65%" }}
          onPress={login}
        />
        <View style={{ flexDirection: "row", marginTop: 30 }}>
          <Text style={{ fontSize: 15 }}>No tienes cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
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
    marginTop: 120,
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
