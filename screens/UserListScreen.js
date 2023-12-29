import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";
import UserItem from "../components/UserItem";
import { findUserByEmail, getImg } from "../database/firebaseFunctions";
import { Divider } from "@rneui/themed";
import Ionicons from "@expo/vector-icons/Ionicons";
import global from "../global";

const UserListScreen = ({ navigation, route }) => {
  const [title, setTitle] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    setTitle(route.params.title);
    getData(route.params.users);
  }, []);

  const getData = async (users) => {
    const promises = users.map(async (email) => {
      const userData = await findUserByEmail(email);
      const img_user = await getImg("perfil/", userData.usuario);
      const item = {
        user: userData,
        img_user: img_user,
      };
      return item;
    });

    setItems(await Promise.all(promises));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back-circle"
            size={40}
            color={global.PRIMARY_COLOR}
          />
        </TouchableOpacity>
        <Text style={styles.text}>{title}</Text>
      </View>
      <ScrollView style={{ width: "95%" }}>
        {items.map((item, i) => {
          return (
            <TouchableOpacity
              key={i}
              onPress={() =>
                navigation.navigate("Profile", { user: item.user })
              }
            >
              <UserItem user={item.user} img={item.img_user} />
              <Divider width={1} style={{ marginVertical: 15 }} />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100%",
    width: "100%",
    marginTop: 10,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    width: "100%",
    height: "13%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    color: global.PRIMARY_COLOR,
    fontSize: 26,
    fontWeight: "bold",
  },
});

export default UserListScreen;
