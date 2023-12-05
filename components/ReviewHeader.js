import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import user_default from "../assets/img_user.png";

const ReviewItem = (props) => {
  const usuario = props.user.usuario;
  const img_user = props.img_user;

  return (
    <View style={styles.header}>
      {img_user ? (
        <Image source={{ uri: img_user }} style={styles.profileImg} />
      ) : (
        <Image source={user_default} style={styles.profileImg} />
      )}
      <Text style={{ fontSize: 17, fontWeight: "bold" }}>@{usuario}</Text>
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
});

export default ReviewItem;
