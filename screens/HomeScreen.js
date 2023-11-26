import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, ActivityIndicator } from "react-native";
import global from "../global";
import badface from "../assets/badface.png";
import { auth } from "../database/firebase";
import {
  findSeguidos,
  getReseñasFromUsers,
  findUserByEmail,
  getImg,
} from "../database/firebaseFunctions";
import ReviewItem from "../components/ReviewItem";

const HomeScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    getData().then(() => {
      setLoaded(true);
    });
  }, []);

  const getData = async () => {
    const user = auth.currentUser;
    const userList = await findSeguidos(user.email);
    userList.push(user.email);
    const reseñas = await getReseñasFromUsers(userList);

    if (reseñas.length > 0) {
      const result = await createItemsList(reseñas);
      setItems(result);
    }
  };

  const createItemsList = async (reseñas) => {
    const promises = reseñas.map(async (reseña) => {
      const userData = await findUserByEmail(reseña.usuario);
      const imgProfile = await getImg("perfil/", userData.usuario);
      const item = {
        usuario: userData,
        reseña: reseña,
        imagen_usuario: imgProfile,
      };
      return item;
    });

    const items = await Promise.all(promises);

    return items;
  };

  return (
    <View style={styles.container}>
      {!isLoaded ? (
        <ActivityIndicator size={100} color={global.PRIMARY_COLOR} />
      ) : (
        <>
          {items.length > 0 ? (
            <View style={styles.review}>
              <ReviewItem />
            </View>
          ) : (
            <>
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
            </>
          )}
        </>
      )}
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
  review: {
    width: "90%",
  },
});

export default HomeScreen;
