import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import user_default from "../assets/img_user.png";

const UserItem = (props) => {
  const user = props.user;
  const img = props.img;

  return (
    <View style={styles.header}>
      {img ? (
        <Image source={{ uri: img }} style={styles.profileImg} />
      ) : (
        <Image source={user_default} style={styles.profileImg} />
      )}
      <View>
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 3 }}>
          @{user.usuario}
        </Text>
        <Text style={{ fontSize: 13, fontWeight: "300" }}>
          {user.nombre} {user.apellidos}
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
  },
  profileImg: {
    height: 60,
    width: 60,
    borderRadius: 100,
    marginRight: 20,
  },
});

export default UserItem;
