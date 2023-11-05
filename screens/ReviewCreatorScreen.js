import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import global from "../global";
import Ionicons from "@expo/vector-icons/Ionicons";
import { signOutUser } from "../database/firebaseFunctions";
import { Input, Button, AirbnbRating } from "@rneui/themed";
import * as ImagePicker from "expo-image-picker";

const ReviewCreatorScreen = ({ navigation }) => {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [puntuacion, setPuntuacion] = useState(1);
  const [imagen, setImagen] = useState(null);

  const logOut = () => {
    signOutUser();
    navigation.goBack();
  };

  const uploadReview = () => {
    console.log("Review publicada");
    console.log(puntuacion);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Lo siento, necesitamos permisos de acceso a tu galería!");
    } else {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setImagen(result.assets[0].uri);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => logOut()}>
          <Ionicons name="arrow-back-circle" size={40} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.form}>
        <Input
          placeholder="Título"
          onChangeText={(value) => setTitulo(value)}
        />
        <Input placeholder="Autor" onChangeText={(value) => setAutor(value)} />
        <View
          style={{
            width: "100%",
            alignItems: "flex-start",
            marginLeft: 15,
            marginBottom: 20,
          }}
        >
          <AirbnbRating
            count={5}
            defaultRating={puntuacion}
            onFinishRating={setPuntuacion}
            showRating={false}
            size={35}
          />
        </View>
        <TextInput
          style={styles.textInput}
          value={descripcion}
          onChangeText={setDescripcion}
          placeholder="Escribe tu opinión... (opcional)"
          multiline={true}
        />
        {imagen && <Image source={{ uri: imagen }} style={styles.libroImg} />}
      </View>
      <View style={styles.groupButtons}>
        <Button buttonStyle={styles.button} onPress={pickImage}>
          <Ionicons name="image" size={28} color={global.PRIMARY_COLOR} />
        </Button>
        <Button
          title="PUBLICAR"
          buttonStyle={styles.button}
          titleStyle={{
            fontWeight: "bold",
            fontSize: 20,
            color: global.PRIMARY_COLOR,
          }}
          containerStyle={{ width: "50%" }}
          onPress={uploadReview}
        />
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
    height: "100%",
    width: "100%",
  },
  header: {
    width: "100%",
    alignItems: "flex-start",
    paddingTop: 40,
    paddingLeft: 15,
    marginBottom: 20,
  },
  form: {
    width: "85%",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 25,
  },
  groupButtons: {
    width: "85%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    backgroundColor: "white",
    marginTop: 20,
    borderRadius: 20,
    marginLeft: 10,
  },
  textInput: {
    borderWidth: 0.3,
    width: "95%",
    marginBottom: 20,
    padding: 5,
    height: 106,
  },
  libroImg: {
    height: 145,
    width: 100,
    marginBottom: 20,
  },
});

export default ReviewCreatorScreen;