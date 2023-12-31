import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import user_default from "../assets/img_user.png";

const ReviewHeader = (props) => {
  const { user, img_user, navigation } = props;

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Profile", { user: props.user })}
      >
        {img_user ? (
          <Image source={{ uri: img_user }} style={styles.profileImg} />
        ) : (
          <Image source={user_default} style={styles.profileImg} />
        )}
      </TouchableOpacity>
      <Text style={{ fontSize: 17, fontWeight: "bold" }}>@{user.usuario}</Text>
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

export default ReviewHeader;
