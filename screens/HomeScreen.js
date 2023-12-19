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
  getTotalLikes,
  isLiked,
  deleteReview,
} from "../database/firebaseFunctions";
import ReviewHeader from "../components/ReviewHeader";
import ReviewBody from "../components/ReviewBody";
import { Divider, FAB } from "@rneui/themed";

const HomeScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [isLoaded, setLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    //const unsubscribe = navigation.addListener("focus", () => {
    getData().then(() => {
      setLoaded(true);
    });
    //});

    /*return () => {
      unsubscribe();
    };*/
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await getData();
    setRefreshKey((prevKey) => prevKey + 1);
    setRefreshing(false);
  };

  const getData = async () => {
    const user = auth.currentUser;
    const userList = await findSeguidos(user.email);
    userList.push(user.email);
    const reviews = await getReseñasFromUsers(userList);

    if (reviews.length > 0) {
      const result = await createItemsList(reviews);
      setItems(result);
    }
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const createItemsList = async (reviews) => {
    const currentUser = auth.currentUser;
    const promises = reviews.map(async (review) => {
      const userData = await findUserByEmail(review.usuario);
      const imgProfile = await getImg("perfil/", userData.usuario);
      const book = await findBookById(review.libro);
      const currentUserLiked = await isLiked(currentUser.email, review.id);
      const likes = await getTotalLikes(review.id);
      const item = {
        user: userData,
        review: review,
        img_user: imgProfile,
        book: book,
        totalLikes: likes,
        liked: currentUserLiked,
      };
      return item;
    });

    const items = await Promise.all(promises);

    return items;
  };

  const deleteReviewItem = (id) => {
    deleteReview(id);

    const updatedReviews = items.filter((item) => item.review.id !== id);
    setItems(updatedReviews);
  };

  return (
    <View style={styles.container}>
      {!isLoaded ? (
        <ActivityIndicator size={100} color={global.PRIMARY_COLOR} />
      ) : (
        <>
          {items.length > 0 ? (
            <View style={{ width: "100%", alignItems: "center" }}>
              <ScrollView
                key={refreshKey}
                style={{ width: "95%", marginTop: 35 }}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[global.PRIMARY_COLOR]}
                  />
                }
              >
                {items.map((item, i) => {
                  return (
                    <View key={i} style={{ margin: 10 }}>
                      <ReviewHeader user={item.user} img_user={item.img_user} />
                      <ReviewBody
                        review={item.review}
                        book={item.book}
                        totalLikes={item.totalLikes}
                        liked={item.liked}
                        onDelete={() => deleteReviewItem(item.review.id)}
                      />
                      <Divider width={1} style={{ marginTop: 15 }} />
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
