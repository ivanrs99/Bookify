import React, { useState } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { AirbnbRating } from "@rneui/themed";
import global from "../global";
import Ionicons from "@expo/vector-icons/Ionicons";
import { likeReview, removelikeReview } from "../database/firebaseFunctions";
import { auth } from "../database/firebase";

const ReviewBody = (props) => {
  const [liked, setLiked] = useState(props.liked);
  const [likes, setLikes] = useState(props.totalLikes);
  const { onDelete } = props;
  const img_review = props.review.url_img;
  const description = props.review.descripcion;
  const title = props.book.titulo;
  const author = props.book.autor;
  const score = props.review.puntuacion;
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
            {title}
          </Text>
          <Text style={{ fontSize: 18, marginBottom: 6 }}>{author}</Text>
          <View style={{ flexDirection: "row" }}>
            <AirbnbRating
              count={5}
              defaultRating={score}
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
            {currentUser.email == props.review.usuario && (
              <Ionicons
                name="trash-outline"
                size={24}
                color="black"
                onPress={onDelete}
                style={{ marginLeft: 10 }}
              />
            )}
          </View>
        </View>
      </View>
      {description && (
        <Text style={{ fontSize: 14, textAlign: "justify", marginTop: 17 }}>
          {description}
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
