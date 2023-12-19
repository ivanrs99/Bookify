import React, { useState } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import { SearchBar } from "@rneui/themed";
import UserItem from "../components/UserItem";
import {
  findUserByParamContaining,
  getImg,
} from "../database/firebaseFunctions";
import { Divider } from "@rneui/themed";

const SearchScreen = ({ navigation }) => {
  const [param, setParam] = useState("");
  const [result, setResult] = useState([]);

  const search = async () => {
    const users = await findUserByParamContaining(param);
    const promises = users.map(async (user) => {
      const img_user = await getImg("perfil/", user.usuario);
      const item = {
        user: user,
        img_user: img_user,
      };
      return item;
    });

    const items = await Promise.all(promises);
    setResult(items);
  };

  return (
    <View style={styles.container}>
      <SearchBar
        platform="android"
        onChangeText={setParam}
        placeholder="Buscar"
        value={param}
        onSubmitEditing={search}
      />
      {result.length > 0 && (
        <ScrollView style={{ width: "95%" }}>
          {result.map((item, i) => {
            return (
              <TouchableOpacity
                key={i}
                onPress={() =>
                  navigation.navigate("Profile", { user: item.user })
                }
                style={{ marginTop: 20 }}
              >
                <UserItem user={item.user} img={item.img_user} />
                <Divider width={1} style={{ marginTop: 10 }} />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
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
    marginTop: 30,
    padding: 10,
  },
});

export default SearchScreen;
