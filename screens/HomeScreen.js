import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import global from "../global";
import badface from "../assets/badface.png";
import { auth } from "../database/firebase";
import {
  findSeguidos,
  getReseñasSeguidos,
  findUserByEmail,
} from "../database/firebaseFunctions";

const HomeScreen = ({ navigation }) => {
  const [item, setItems] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const user = auth.currentUser;
    const seguidos = await findSeguidos(user.email);
    const reseñas = await getReseñasSeguidos(seguidos);

    if (reseñas.length > 0) {
      createItemsList(reseñas);
    }
  };

  const createItemsList = async (reseñas) => {
    const items = [];
    for (const reseña of reseñas) {
      const userData = await findUserByEmail(reseña.usuario);
      const item = {
        usuario: userData,
        reseña: reseña,
        //imagen usuario
        //imagen reseña
      };
      items.push(item);
      console.log(item);
    }

    return items;
  };

  return (
    <View style={styles.container}>
      <Image
        source={badface}
        style={{
          width: 220,
          height: 100,
          resizeMode: "contain",
          marginBottom: 5,
        }}
      />
      <Text style={{ fontSize: 16, fontWeight: "bold", margin: 10 }}>
        Todavía no hay ninguna reseña para ver
      </Text>
      <View style={{ flexDirection: "row", alignItems: "baseline" }}>
        <Text style={{ fontSize: 15 }}>
          Pulsa{" "}
          <Text
            style={{ fontSize: 15, color: global.PRIMARY_COLOR }}
            onPress={() => navigation.navigate("ReviewCreator")}
          >
            aquí
          </Text>{" "}
          para añadir la primera!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
});

export default HomeScreen;
