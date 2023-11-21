import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import global from "../global";
import user_default from "../assets/img_user.png";

const ReviewItem = () => {
  const usuario = "pececito";
  const img_review =
    "https://firebasestorage.googleapis.com/v0/b/bookify-1dff3.appspot.com/o/rese%C3%B1as%2Fpez%40gmail.com2023-11-20T12%3A10%3A07.436Z?alt=media&token=908d3c6c-3a5e-423b-b449-74f7a206dd44";
  const img_user =
    "https://firebasestorage.googleapis.com/v0/b/bookify-1dff3.appspot.com/o/perfil%2Fpececito?alt=media&token=c13b5c3c-1f45-4735-a697-761b732e8b28";
  const descripcion = "Malillo";
  const titulo = "El gusano de seda";
  const autor = "Robert Galbraith";
  const puntuacion = 3;
  const likes = 0;

  return (
    <View>
      <View></View>
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
});

export default ReviewItem;
