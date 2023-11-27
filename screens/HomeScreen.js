import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import global from "../global";
import badface from "../assets/badface.png";
import { auth } from "../database/firebase";
import {
  findSeguidos,
  getReseñasFromUsers,
  findUserByEmail,
  getImg,
  findBookById,
} from "../database/firebaseFunctions";
import ReviewItem from "../components/ReviewItem";
import { Divider, FAB } from "@rneui/themed";

const HomeScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [isLoaded, setLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getData().then(() => {
        setLoaded(true);
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await getData();
    setRefreshing(false);
  };

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
      const book = await findBookById(reseña.libro);
      const item = {
        usuario: userData,
        reseña: reseña,
        imagen_usuario: imgProfile,
        libro: book,
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
            <View style={{ flex: 1, position: "relative" }}>
              <ScrollView
                style={{ width: "90%", marginTop: 35 }}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[global.PRIMARY_COLOR]}
                  />
                }
              >
                {items.map((review, i) => {
                  return (
                    <View key={i} style={{ marginBottom: 10 }}>
                      <ReviewItem
                        user={review.usuario}
                        review={review.reseña}
                        img_user={review.imagen_usuario}
                        book={review.libro}
                      />
                      <Divider width={1} style={{ marginTop: 10 }} />
                    </View>
                  );
                })}
              </ScrollView>
              <FAB
                visible={true}
                icon={{ name: "add", color: "white" }}
                color={global.PRIMARY_COLOR}
                onPress={() => navigation.navigate("ReviewCreator")}
                style={styles.fab}
              />
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
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
