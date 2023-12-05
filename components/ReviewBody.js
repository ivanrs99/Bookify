import React, { useState } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { AirbnbRating } from "@rneui/themed";
import global from "../global";
import user_default from "../assets/img_user.png";
import Ionicons from "@expo/vector-icons/Ionicons";
import { likeReview, removelikeReview } from "../database/firebaseFunctions";
import { auth } from "../database/firebase";

const ReviewBody = (props) => {
  const [liked, setLiked] = useState(props.liked);
  const [likes, setLikes] = useState(props.totalLikes);

  const img_review = props.review.url_img;
  const descripcion = props.review.descripcion;
  const titulo = props.book.titulo;
  const autor = props.book.autor;
  const puntuacion = props.review.puntuacion;
  const currentUser = auth.currentUser;

  const like = () => {
    likeReview(currentUser.email, props.review.id);
    setLiked(true);
    setLikes(likes + 1);
  };

  const unlike = () => {
    removelikeReview(currentUser.email, props.review.id);
    setLiked(false);
    setLikes(likes - 1);
  };

  return (
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
              <Ionicons name="heart" size={25} color="black" onPress={unlike} />
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

export default ReviewBody;
