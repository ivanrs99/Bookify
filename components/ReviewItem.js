import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { AirbnbRating } from "@rneui/themed";
import global from "../global";
import user_default from "../assets/img_user.png";
import Ionicons from "@expo/vector-icons/Ionicons";

const ReviewItem = () => {
  const usuario = "pececito";
  const img_review =
    "https://firebasestorage.googleapis.com/v0/b/bookify-1dff3.appspot.com/o/rese%C3%B1as%2Fpez%40gmail.com2023-11-20T12%3A10%3A07.436Z?alt=media&token=908d3c6c-3a5e-423b-b449-74f7a206dd44";
  const img_user =
    "https://firebasestorage.googleapis.com/v0/b/bookify-1dff3.appspot.com/o/perfil%2Fpececito?alt=media&token=c13b5c3c-1f45-4735-a697-761b732e8b28";
  const descripcion =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eu tristique odio. Suspendisse potenti. Integer sodales congue massa. Donec facilisis, nisl id semper sollicitudin, enim magna malesuada mauris, nec faucibus purus turpis in libero. Cras cursus consequat risus vel efficitur. Sed at elementum ligula. Interdum et malesuada fames ac ante ipsum primis in faucibus. Praesent sodales erat metus, in condimentum est pretium ac. Donec lacinia turpis et egestas volutpat. Donec laoreet ultricies felis vitae gravida. Fusce id nunc suscipit libero feugiat viverra quis a est. In fringilla ex lectus, non posuere lacus feugiat sed. Nulla facilisi. Maecenas et nisi ultricies.";
  const titulo = "El gusano de seda";
  const autor = "Robert Galbraith";
  const puntuacion = 3;
  const likes = 1;
  const liked = true;

  return (
    <View style={{ margin: 10 }}>
      <View style={styles.header}>
        {img_user ? (
          <Image source={{ uri: img_user }} style={styles.profileImg} />
        ) : (
          <Image source={user_default} style={styles.profileImg} />
        )}
        <Text style={{ fontSize: 17, fontWeight: "bold" }}>@{usuario}</Text>
      </View>
      <View>
        <View style={{ flexDirection: "row", marginBottom: 17 }}>
          {img_review && (
            <Image source={{ uri: img_review }} style={styles.reviewImg} />
          )}
          <View style={{ flexDirection: "column" }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 6 }}>
              {titulo}
            </Text>
            <Text style={{ fontSize: 18, marginBottom: 6 }}>{autor}</Text>
            <View style={{ flexDirection: "row" }}>
              <AirbnbRating
                count={5}
                defaultRating={puntuacion}
                showRating={false}
                size={20}
                isDisabled={true}
                selectedColor={global.PRIMARY_COLOR}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                marginTop: 6,
              }}
            >
              {liked ? (
                <Ionicons name="heart" size={25} color="black" />
              ) : (
                <Ionicons name="heart-outline" size={25} color="black" />
              )}
              <Text style={{ marginLeft: 5, fontSize: 18 }}>{likes}</Text>
            </View>
          </View>
        </View>
        <Text style={{ fontSize: 14, textAlign: "justify" }}>
          {descripcion}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImg: {
    height: 60,
    width: 60,
    borderRadius: 100,
    marginRight: 20,
  },
  reviewImg: {
    height: 140,
    width: 100,
    marginRight: 20,
  },
});

export default ReviewItem;
