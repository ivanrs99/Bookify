import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableHighlight,
  ScrollView,
  Image,
  RefreshControl,
} from "react-native";
import Wave from "../components/Wave";
import global from "../global";
import { auth } from "../database/firebase";
import {
  getReseñasFromUser,
  findUserByEmail,
  getImg,
  findBookById,
  getTotalLikes,
  isLiked,
} from "../database/firebaseFunctions";
import Ionicons from "@expo/vector-icons/Ionicons";
import ReviewBody from "../components/ReviewBody";
import { Divider } from "@rneui/themed";

const ProfileScreen = () => {
  const [items, setItems] = useState([]);
  const [isLoaded, setLoaded] = useState(false);
  const [imgUser, setImgUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const user = auth.currentUser;

  useEffect(() => {
    getData().then(() => {
      setLoaded(true);
    });
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await getData();
    setRefreshKey((prevKey) => prevKey + 1);
    setRefreshing(false);
  };

  const getData = async () => {
    const reviews = await getReseñasFromUser(user.email);
    const userData = await findUserByEmail(user.email);
    const imgProfile = await getImg("perfil/", userData.usuario);
    setUserData(userData);
    setImgUser(imgProfile);

    if (reviews.length > 0) {
      const result = await createItemsList(reviews);
      setItems(result);
    }
  };

  const createItemsList = async (reviews) => {
    const promises = reviews.map(async (review) => {
      const book = await findBookById(review.libro);
      const currentUserLiked = await isLiked(user.email, review.id);
      const likes = await getTotalLikes(review.id);
      const item = {
        review: review,
        book: book,
        totalLikes: likes,
        liked: currentUserLiked,
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
        <View style={styles.profileContainer}>
          <View style={styles.menu_user}>
            <Text style={styles.user}>@{userData.usuario}</Text>
            <TouchableHighlight onPress={() => console.log("menu")}>
              <Ionicons name="menu-outline" color="white" size={30} />
            </TouchableHighlight>
          </View>
          <ScrollView
            key={refreshKey}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[global.PRIMARY_COLOR]}
              />
            }
          >
            <Wave />
            <View style={styles.imgContainer}>
              {imgUser ? (
                <Image source={{ uri: imgUser }} style={styles.profileImg} />
              ) : (
                <Image source={profilePic} style={styles.profileImg} />
              )}
            </View>
            <View style={styles.reviewsContainer}>
              {items.map((item, i) => {
                return (
                  <View key={i} style={{ marginBottom: 10 }}>
                    <ReviewBody
                      review={item.review}
                      book={item.book}
                      totalLikes={item.totalLikes}
                      liked={item.liked}
                    />
                    <Divider width={1} style={{ marginTop: 10 }} />
                  </View>
                );
              })}
              {items.length == 0 && (
                <View style={{ marginTop: 20, alignItems: "center" }}>
                  <Text>No tienes ninguna review publicada todavía.</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
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
  profileContainer: {
    flex: 1,
    position: "relative",
    width: "100%",
    marginTop: 30,
  },
  menu_user: {
    backgroundColor: global.PRIMARY_COLOR,
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
    height: 40,
    zIndex: 1,
  },
  user: {
    color: "white",
    flexGrow: 1,
    fontWeight: "bold",
    fontSize: 18,
  },
  imgContainer: {
    marginTop: 50,
    alignSelf: "center",
    position: "absolute",
  },
  profileImg: {
    borderRadius: 100,
    height: 110,
    width: 110,
  },
  reviewsContainer: {
    marginTop: 60,
    width: "100%",
    padding: 10,
  },
});

export default ProfileScreen;
