import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import global from "../global";
import imgUser from "../assets/img_user.png";
import { Input, Button } from "@rneui/themed";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { showMessage } from "react-native-flash-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  findUser,
  signUp,
  signIn,
  editUser,
} from "../database/firebaseFunctions";

const RegisterScreen = ({ navigation, route }) => {
  const [name, setName] = useState(route.params.name);
  const [surname, setSurname] = useState(route.params.surname);
  const [user, setUser] = useState(route.params.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(route.params.img);
  const { editMode } = route.params;

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
        setImage(result.assets[0].uri);
      }
    }
  };

  const register = async () => {
    if (!name || !surname || !user || !email || !password) {
      showMessage({
        message: "Error de registro",
        description: "Todos los campos son obligatorios, excepto la imagen.",
        type: "danger",
      });
      return;
    }

    const userFound = await findUser(user);
    if (userFound != null) {
      showMessage({
        message: "Error de registro",
        description: "Ya existe un usuario con ese nombre de usuario.",
        type: "danger",
      });
      return;
    }

    if (password.length < 8) {
      showMessage({
        message: "Error de registro",
        description: "La contraseña debe tener como mínimo 8 caracteres.",
        type: "danger",
      });
      return;
    }

    signUp(email, password, user, name, surname, image)
      .then(() => {
        signIn(email, password).then(() => {
          navigation.navigate("Home");
        });
      })
      .catch((error) => {
        showSignUpError(error);
      });
  };

  const showSignUpError = (error) => {
    if (error.code === "auth/email-already-in-use") {
      showMessage({
        message: "Error de registro",
        description: "Email ya en uso.",
        type: "danger",
      });
    } else if (error.code === "auth/invalid-email") {
      showMessage({
        message: "Error de registro",
        description: "El email no tiene un formato correcto.",
        type: "danger",
      });
    } else {
      showMessage({
        message: "Error de registro",
        description: error.message,
        type: "danger",
      });
    }
  };

  const save = async () => {
    if (!name || !surname) {
      showMessage({
        message: "Error",
        description: "Todos los campos son obligatorios, excepto la imagen.",
        type: "danger",
      });
      return;
    }

    await editUser(name, surname, user, image);
    navigation.goBack();
  };

  return (
    <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-circle" size={40} color="white" />
          </TouchableOpacity>
          <Text style={styles.text}>
            {editMode ? "Editar cuenta" : "Crear cuenta"}
          </Text>
        </View>
        <View style={styles.formContainer}>
          {image ? (
            <View>
              <TouchableOpacity onPress={pickImage}>
                <Image
                  source={{ uri: image }}
                  style={styles.profileImg}
                  onPress={pickImage}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setImage(null)}
                style={{
                  position: "absolute",
                  top: -3,
                  right: -3,
                  backgroundColor: "black",
                  zIndex: 1,
                  paddingHorizontal: 2,
                  borderRadius: 20,
                }}
              >
                <FontAwesome name="close" size={22} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={pickImage}>
              <Image source={imgUser} style={styles.profileImg} />
            </TouchableOpacity>
          )}
          <Input
            placeholder="Nombre"
            containerStyle={{ marginBottom: 10 }}
            value={name}
            onChangeText={(value) => setName(value)}
          />
          <Input
            placeholder="Apellidos"
            containerStyle={{ marginBottom: 10 }}
            value={surname}
            onChangeText={(value) => setSurname(value)}
          />
          {!editMode && (
            <>
              <Input
                placeholder="Usuario"
                containerStyle={{ marginBottom: 10 }}
                autoCapitalize="none"
                onChangeText={(value) => setUser(value)}
              />
              <Input
                placeholder="Email"
                containerStyle={{ marginBottom: 10 }}
                autoCapitalize="none"
                onChangeText={(value) => setEmail(value)}
              />
              <Input
                placeholder="Contraseña"
                containerStyle={{ marginBottom: 10 }}
                autoCapitalize="none"
                onChangeText={(value) => setPassword(value)}
                secureTextEntry={true}
              />
            </>
          )}
          <Button
            title={editMode ? "GUARDAR" : "REGISTRARSE"}
            buttonStyle={styles.button}
            titleStyle={{ fontWeight: "bold", fontSize: 20 }}
            containerStyle={{ width: "65%" }}
            onPress={editMode ? save : register}
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
