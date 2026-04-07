import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/colors";

export default function PlaceItem({ place, onSelect }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.item, pressed && styles.pressed]}
      onPress={onSelect}
    >
      <View style={styles.imageContainer}>
        {place?.imageUri ? (
          <Image source={{ uri: place.imageUri }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>📷</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {place.title}
        </Text>
        <View style={styles.addressContainer}>
          <Text style={styles.addressIcon}>📍</Text>
          <Text style={styles.address} numberOfLines={2}>
            {place.address || "No address available"}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsText}>Tap to view details</Text>
          <Text style={styles.arrow}>→</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    borderRadius: 16,
    marginVertical: 10,
    marginHorizontal: 16,
    backgroundColor: Colors.primary800,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    overflow: "hidden",
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  imageContainer: {
    width: 120,
    height: 140,
    backgroundColor: Colors.primary700,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary600,
  },
  imagePlaceholderText: {
    fontSize: 40,
    opacity: 0.6,
  },
  info: {
    flex: 1,
    padding: 14,
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    color: Colors.primary50,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  addressIcon: {
    fontSize: 14,
    marginRight: 6,
    marginTop: 2,
  },
  address: {
    flex: 1,
    fontSize: 13,
    color: Colors.primary200,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.primary600,
    marginVertical: 10,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailsText: {
    fontSize: 12,
    color: Colors.accent500,
    fontWeight: "500",
  },
  arrow: {
    fontSize: 16,
    color: Colors.accent500,
    fontWeight: "bold",
  },
});