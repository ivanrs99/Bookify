import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
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
  findSeguidores,
  findSeguidos,
  signOutUser,
} from "../database/firebaseFunctions";
import Ionicons from "@expo/vector-icons/Ionicons";
import ReviewBody from "../components/ReviewBody";
import { Divider, BottomSheet, ListItem } from "@rneui/themed";

const ProfileScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [isLoaded, setLoaded] = useState(false);
  const [imgUser, setImgUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [seguidores, setSeguidores] = useState(0);
  const [seguidos, setSeguidos] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
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
    findSeguidores(user.email).then((seguidores) =>
      setSeguidores(seguidores.length)
    );
    findSeguidos(user.email).then((seguidos) => setSeguidos(seguidos.length));
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

  const edit = () => {
    setIsVisible(false);
  };

  const logOut = () => {
    setIsVisible(false);
    signOutUser();
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const menuItems = [
    { title: "Editar perfil", onPress: edit },
    { title: "Cerrar sesión", onPress: logOut },
    {
      title: "Cancelar",
      containerStyle: { backgroundColor: "gray" },
      titleStyle: { color: "white" },
      onPress: () => setIsVisible(false),
    },
  ];

  return (
    <View style={styles.container}>
      {!isLoaded ? (
        <ActivityIndicator size={100} color={global.PRIMARY_COLOR} />
      ) : (
        <View style={styles.profileContainer}>
          <BottomSheet modalProps={{}} isVisible={isVisible}>
            {menuItems.map((l, i) => (
              <ListItem
                key={i}
                containerStyle={l.containerStyle}
                onPress={l.onPress}
              >
                <ListItem.Content>
                  <ListItem.Title style={l.titleStyle}>
                    {l.title}
                  </ListItem.Title>
                </ListItem.Content>
              </ListItem>
            ))}
          </BottomSheet>
          <View style={styles.menu_user}>
            <Text style={styles.user}>@{userData.usuario}</Text>
            <Ionicons
              name="menu-outline"
              color="white"
              size={30}
              onPress={() => setIsVisible(true)}
            />
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
            <View
              style={{
                marginTop: 65,
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                {userData.nombre} {userData.apellidos}
              </Text>
              <Text style={{ fontSize: 15, fontWeight: "300" }}>
                {userData.email}
              </Text>
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statsGroup}>
                <Text style={styles.statsValue}>{items.length}</Text>
                <Text style={styles.statsName}>Reseñas</Text>
              </View>
              <View style={styles.statsGroup}>
                <Text style={styles.statsValue}>{seguidores}</Text>
                <Text style={styles.statsName}>Seguidores</Text>
              </View>
              <View style={styles.statsGroup}>
                <Text style={styles.statsValue}>{seguidos}</Text>
                <Text style={styles.statsName}>Siguiendo</Text>
              </View>
            </View>
            <Divider width={2} color="black" style={{ marginHorizontal: 10 }} />
            <View style={styles.reviewsContainer}>
              {items.map((item, i) => {
                return (
                  <View key={i} style={{ margin: 10 }}>
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
    width: "100%",
    padding: 10,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginHorizontal: 40,
    marginBottom: 20,
  },
  statsGroup: {
    flexDirection: "column",
    alignItems: "center",
  },
  statsValue: {
    fontWeight: "bold",
    fontSize: 20,
  },
  statsName: {
    fontWeight: "200",
    fontSize: 16,
    letterSpacing: 2,
  },
});

export default ProfileScreen;
