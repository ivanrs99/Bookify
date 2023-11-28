import React, { useState } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { AirbnbRating } from "@rneui/themed";
import global from "../global";
import user_default from "../assets/img_user.png";
import Ionicons from "@expo/vector-icons/Ionicons";
import { likeReview, removelikeReview } from "../database/firebaseFunctions";

const ReviewItem = (props) => {
  const [liked, setLiked] = useState(props.liked);
  const [likes, setLikes] = useState(props.totalLikes);

  const usuario = props.user.usuario;
  const img_review = props.review.url_img;
  const img_user = props.img_user;
  const descripcion = props.review.descripcion;
  const titulo = props.book.titulo;
  const autor = props.book.autor;
  const puntuacion = props.review.puntuacion;

  const like = () => {
    likeReview(props.user.email, props.review.id);
    setLiked(true);
    setLikes(likes + 1);
  };

  const unlike = () => {
    removelikeReview(props.user.email, props.review.id);
    setLiked(false);
    setLikes(likes - 1);
  };

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
        <View style={{ flexDirection: "row" }}>
          {img_review && (
            <Image source={{ uri: img_review }} style={styles.reviewImg} />
          )}
          <View style={{ flexDirection: "column", width: "100%" }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginBottom: 6,
                width: "70%",
              }}
            >
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
                <Ionicons
                  name="heart"
                  size={25}
                  color="black"
                  onPress={unlike}
                />
              ) : (
                <Ionicons
                  name="heart-outline"
                  size={25}
                  color="black"
                  onPress={like}
                />
              )}
              <Text style={{ marginLeft: 5, fontSize: 18 }}>{likes}</Text>
            </View>
          </View>
        </View>
        {descripcion && (
          <Text style={{ fontSize: 14, textAlign: "justify", marginTop: 17 }}>
            {descripcion}
          </Text>
        )}
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
