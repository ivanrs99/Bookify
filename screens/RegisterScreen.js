import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import global from "../global";
import imgUser from "../assets/img_user.png";
import { Input, Button } from "@rneui/themed";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { showMessage } from "react-native-flash-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { findUser, signUp } from "../database/firebaseFunctions";

const RegisterScreen = ({ navigation }) => {
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [imagen, setImagen] = useState(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Lo siento, necesitamos permisos de acceso a tu galería!");
    } else {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImagen(result.assets[0].uri);
      }
    }
  };

  const register = async () => {
    if (!nombre || !apellidos || !usuario || !email || !contraseña) {
      showMessage({
        message: "Error de registro",
        description: "Todos los campos son obligatorios, excepto la imagen.",
        type: "danger",
      });
      return;
    }

    const user = await findUser(usuario);
    if (user != null) {
      showMessage({
        message: "Error de registro",
        description: "Ya existe un usuario con ese nombre de usuario.",
        type: "danger",
      });
      return;
    }

    if (contraseña.length < 8) {
      showMessage({
        message: "Error de registro",
        description: "La contraseña debe tener como mínimo 8 caracteres.",
        type: "danger",
      });
      return;
    }

    signUp(email, contraseña, usuario, nombre, apellidos, imagen).then(() => {
      navigation.navigate("HomeStack");
    });
  };

  return (
    <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-circle" size={40} color="white" />
          </TouchableOpacity>
          <Text style={styles.text}>Crear cuenta</Text>
        </View>
        <View style={styles.formContainer}>
          {imagen ? (
            <TouchableOpacity onPress={pickImage}>
              <Image
                source={{ uri: imagen }}
                style={styles.profileImg}
                onPress={pickImage}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={pickImage}>
              <Image source={imgUser} style={styles.profileImg} />
            </TouchableOpacity>
          )}
          <Input
            placeholder="Nombre"
            containerStyle={{ marginBottom: 10 }}
            onChangeText={(value) => setNombre(value)}
          />
          <Input
            placeholder="Apellidos"
            containerStyle={{ marginBottom: 10 }}
            onChangeText={(value) => setApellidos(value)}
          />
          <Input
            placeholder="Usuario"
            containerStyle={{ marginBottom: 10 }}
            onChangeText={(value) => setUsuario(value)}
          />
          <Input
            placeholder="Email"
            containerStyle={{ marginBottom: 10 }}
            onChangeText={(value) => setEmail(value)}
          />
          <Input
            placeholder="Contraseña"
            containerStyle={{ marginBottom: 10 }}
            onChangeText={(value) => setContraseña(value)}
            secureTextEntry={true}
          />
          <Button
            title="REGISTRARSE"
            buttonStyle={styles.button}
            titleStyle={{ fontWeight: "bold", fontSize: 20 }}
            containerStyle={{ width: "65%" }}
            onPress={register}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: global.PRIMARY_COLOR,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  profileImg: {
    height: 125,
    width: 125,
    marginBottom: 20,
    borderRadius: 100,
  },
  header: {
    flexDirection: "row",
    width: "100%",
    height: "13%",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  text: {
    color: "white",
    fontSize: 26,
    fontWeight: "bold",
  },
  formContainer: {
    backgroundColor: "white",
    height: "100%",
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

export default RegisterScreen;
