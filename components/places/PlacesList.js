import { FlatList, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../constants/colors";
import PlaceItem from "./PlaceItem";

export default function PlacesList({ places }) {
  const navigation = useNavigation();

  function selectPlaceHandler(id) {
    navigation.navigate("PlaceDetails", {
      placeId: id,
    });
  }

  if (!places || places.length === 0) {
    return (
      <View style={styles.fallbackContainer}>
        <View style={styles.fallbackContent}>
          <Text style={styles.fallbackEmoji}>📍</Text>
          <Text style={styles.fallbackTitle}>No places added yet</Text>
          <Text style={styles.fallbackTextStyle}>
            Start by adding your first favorite place
          </Text>
        </View>
      </View>
    );
  }

  return (
    <FlatList
      data={places}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <PlaceItem
          place={item}
          onSelect={() => selectPlaceHandler(item.id)}
          style={index === places.length - 1 ? styles.lastItem : null}
        />
      )}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary200,
    padding: 24,
  },
  fallbackContent: {
    alignItems: "center",
    backgroundColor: Colors.primary500,
    padding: 32,
    borderRadius: 16,
    maxWidth: 300,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fallbackEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  fallbackTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary50,
    marginBottom: 8,
    textAlign: "center",
  },
  fallbackTextStyle: {
    fontSize: 14,
    color: Colors.gray200,
    textAlign: "center",
    lineHeight: 20,
  },
  lastItem: {
    marginBottom: 0,
  },
});