import React, { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import OutlinedButton from "../ui/OutlinedButton";
import { Colors } from "../../constants/colors";
import {
  getCurrentPositionAsync,
  useForegroundPermissions,
  PermissionStatus,
} from "expo-location";
import { getAddress, getMapPreview } from "../../util/location";
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from "@react-navigation/native";

export default function LocationPicker({ onPickLocation }) {
  const [pickedLocation, setPickedLocation] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [locationPermissionInfomation, requestPermission] =
    useForegroundPermissions();
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && route.params) {
      const mapPickedLocation = {
        lat: route.params.pickedLat,
        lng: route.params.pickedLng,
      };
      setPickedLocation(mapPickedLocation);
    }
  }, [route, isFocused]);

  useEffect(() => {
    async function handleLocation() {
      if (pickedLocation) {
        setIsLoading(true);
        try {
          const address = await getAddress(
            pickedLocation.lat,
            pickedLocation.lng,
          );
          onPickLocation({ ...pickedLocation, address: address });
        } catch (error) {
          Alert.alert("Error", "Failed to get address. Please try again.");
        } finally {
          setIsLoading(false);
        }
      }
    }
    handleLocation();
  }, [onPickLocation, pickedLocation]);

  async function verifyPermission() {
    if (locationPermissionInfomation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }

    if (locationPermissionInfomation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Permission Required",
        "Please enable location access in settings to use this feature.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Settings", onPress: () => {} }
        ]
      );
      return false;
    }

    return true;
  }

  async function getLocationHandler() {
    const hasPermission = await verifyPermission();
    if (!hasPermission) return;

    setIsLoading(true);
    try {
      const location = await getCurrentPositionAsync();
      setPickedLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    } catch (error) {
      Alert.alert("Error", "Could not fetch your location. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function pickOnMapHandler() {
    navigation.navigate("Map");
  }

  let locationPreview = (
    <View style={styles.previewPlaceholder}>
      <Text style={styles.previewPlaceholderIcon}>🗺️</Text>
      <Text style={styles.previewPlaceholderText}>No location picked yet</Text>
      <Text style={styles.previewPlaceholderSubtext}>
        Use the buttons below to select a location
      </Text>
    </View>
  );

  if (isLoading) {
    locationPreview = (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.accent500} />
        <Text style={styles.loadingText}>Getting location...</Text>
      </View>
    );
  }

  if (pickedLocation?.lat && pickedLocation?.lng && !isLoading) {
    locationPreview = (
      <Image
        key={`${pickedLocation.lat}-${pickedLocation.lng}`}
        style={styles.mapPreviewImage}
        source={{
          uri: getMapPreview(pickedLocation.lat, pickedLocation.lng),
        }}
        onError={() => {
          Alert.alert("Error", "Failed to load map preview.");
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapPreview}>{locationPreview}</View>

      <View style={styles.actions}>
        <OutlinedButton icon="location" onPress={getLocationHandler}>
          Get My Location
        </OutlinedButton>

        <OutlinedButton icon="map" onPress={pickOnMapHandler}>
          Choose on Map
        </OutlinedButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  mapPreview: {
    width: "100%",
    height: 220,
    marginVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary700,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },
  mapPreviewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  previewPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  previewPlaceholderIcon: {
    fontSize: 48,
    marginBottom: 12,
    opacity: 0.7,
  },
  previewPlaceholderText: {
    fontSize: 16,
    color: Colors.gray200,
    fontWeight: "500",
    marginBottom: 4,
  },
  previewPlaceholderSubtext: {
    fontSize: 12,
    color: Colors.gray200,
    textAlign: "center",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.primary200,
  },
});