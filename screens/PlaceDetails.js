import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import OutlinedButton from "../components/ui/OutlinedButton";
import { Colors } from "../constants/colors";
import { fetchPlaceDetails } from "../util/database";
import { useNavigation } from "@react-navigation/native";

export default function PlaceDetails({ route }) {
  const [fetchedPlace, setFetchedPlace] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const selectedPlaceId = route.params.placeId;

  useEffect(() => {
    async function loadPlaceData() {
      try {
        setIsLoading(true);
        setError(null);
        const place = await fetchPlaceDetails(selectedPlaceId);
        setFetchedPlace(place);
        
        navigation.setOptions({
          title: place.title,
        });
      } catch (err) {
        setError("Failed to load place details. Please try again.");
        console.error("Error loading place details:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadPlaceData();
  }, [selectedPlaceId, navigation]);

  function showOnMapHandler() {
    navigation.navigate('Map', {
      initialLat: fetchedPlace.location.lat,
      initialLng: fetchedPlace.location.lng,
      readonly: true
    });
  }

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.accent500} />
        <Text style={styles.loadingText}>Loading place details...</Text>
      </View>
    );
  }

  if (error || !fetchedPlace) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{error || "Place not found"}</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: fetchedPlace.imageUri }} />
        <View style={styles.imageOverlay}>
          <Text style={styles.imageOverlayText}>📍 {fetchedPlace.title}</Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📝</Text>
            <Text style={styles.sectionTitle}>About this place</Text>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.titleLabel}>Name</Text>
            <Text style={styles.title}>{fetchedPlace.title}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📍</Text>
            <Text style={styles.sectionTitle}>Location</Text>
          </View>
          <View style={styles.addressContainer}>
            <Text style={styles.addressLabel}>Address</Text>
            <Text style={styles.address}>{fetchedPlace.address}</Text>
          </View>
          <View style={styles.mapButtonContainer}>
            <OutlinedButton icon="map" onPress={showOnMapHandler}>
              View on Map
            </OutlinedButton>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📅</Text>
            <Text style={styles.sectionTitle}>Added on</Text>
          </View>
          <Text style={styles.dateText}>
            {fetchedPlace.createdAt 
              ? new Date(fetchedPlace.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              : 'Recently'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary700,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary700,
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.primary200,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: Colors.primary100,
    textAlign: "center",
  },
  imageContainer: {
    position: "relative",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  image: {
    width: "100%",
    height: 350,
    resizeMode: "cover",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  imageOverlayText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  detailsContainer: {
    paddingHorizontal: 20,
  },
  section: {
    backgroundColor: Colors.primary800,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: Colors.accent500,
  },
  sectionIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary50,
  },
  titleContainer: {
    marginTop: 8,
  },
  titleLabel: {
    fontSize: 12,
    color: Colors.primary300,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.accent500,
  },
  addressContainer: {
    marginBottom: 20,
  },
  addressLabel: {
    fontSize: 12,
    color: Colors.primary400,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  address: {
    fontSize: 16,
    color: Colors.gray400,
    lineHeight: 24,
  },
  mapButtonContainer: {
    marginTop: 8,
  },
  dateText: {
    fontSize: 14,
    color: Colors.primary200,
    marginTop: 8,
  },
});