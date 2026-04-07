import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/colors";

export default function PlaceItem({ place, onSelect }) {
  // console.log("PLACE DATA:", place.imageUri);
  return (
    <Pressable
      style={({ pressed }) => [styles.item, pressed && styles.pressed]}
      onPress={onSelect}
    >
      {place?.imageUri && (
<Image source={{ uri: place.imageUri }} style={styles.image} />
      )}

      <View style={styles.info}>
        <Text style={styles.title}>{place.title}</Text>
        <Text style={styles.address}>{place.address}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 6,
    marginVertical: 12,
    backgroundColor: Colors.primary500,
    elevation: 4,
  },
  pressed: {
    opacity: 0.9,
  },
  image: {
    flex: 1,
    borderBottomLeftRadius: 4,
    borderTopLeftRadius: 4,
    height: 100,
  },
  info: {
    flex: 2,
    padding: 12,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    color: Colors.gray700,
  },
  address: {
     color: Colors.gray700,
    marginTop: 4,
  },
});
