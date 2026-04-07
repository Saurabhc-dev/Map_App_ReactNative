import { useCallback, useLayoutEffect, useState } from "react";
import { Alert, StyleSheet, View, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import IconButton from "../components/ui/IconButton";
import { Colors } from "../constants/colors";

export default function Map({ navigation, route }) {
  const initialLocation = route.params && {
    lat: route.params.initialLat,
    lng: route.params.initialLng,
  };
  
  const isReadonly = route.params?.readonly || false;

  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [mapRegion, setMapRegion] = useState(null);

  const region = {
    latitude: initialLocation ? initialLocation.lat : 19.076,
    longitude: initialLocation ? initialLocation.lng : 72.8777,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  function selectLocationHandler(event) {
    if (initialLocation || isReadonly) {
      return;
    }
    const lat = event.nativeEvent.coordinate.latitude;
    const lng = event.nativeEvent.coordinate.longitude;
    setSelectedLocation({ lat: lat, lng: lng });
  }

  const savedPickedLocationHandler = useCallback(() => {
    if (!selectedLocation) {
      Alert.alert("No Location Selected", "Please tap on the map to select a location.");
      return;
    }
    navigation.navigate("AddPlace", {
      pickedLat: selectedLocation.lat,
      pickedLng: selectedLocation.lng,
    });
  }, [navigation, selectedLocation]);

  useLayoutEffect(() => {
    if (initialLocation || isReadonly) {
      navigation.setOptions({
        title: "Place Location",
      });
      return;
    }
    
    navigation.setOptions({
      headerRight: ({ tintColor }) => (
        <IconButton
          icon="save"
          size={24}
          color={tintColor}
          onPress={savedPickedLocationHandler}
        />
      ),
      title: "Pick Location",
    });
  }, [navigation, savedPickedLocationHandler, initialLocation, isReadonly]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        onPress={selectLocationHandler}
        onRegionChangeComplete={setMapRegion}
      >
        {selectedLocation && (
          <Marker
            title="Selected Location"
            description={isReadonly ? "Your saved place" : "Tap to change location"}
            coordinate={{
              latitude: selectedLocation.lat,
              longitude: selectedLocation.lng,
            }}
            pinColor={isReadonly ? Colors.primary50 : Colors.accent500}
          />
        )}
      </MapView>
      
      {!initialLocation && !isReadonly && (
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionIcon}>📍</Text>
          <Text style={styles.instructionText}>
            Tap anywhere on the map to select a location
          </Text>
          {selectedLocation && (
            <View style={styles.confirmationBadge}>
              <Text style={styles.confirmationText}>
                ✓ Location selected
              </Text>
            </View>
          )}
        </View>
      )}
      
      {isReadonly && selectedLocation && (
        <View style={styles.readonlyContainer}>
          <Text style={styles.readonlyIcon}>📍</Text>
          <Text style={styles.readonlyText}>
            This is where your place is located
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  map: {
    flex: 1,
  },
  instructionContainer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: Colors.primary800,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  instructionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: Colors.primary50,
    textAlign: "center",
    fontWeight: "500",
    marginBottom: 8,
  },
  confirmationBadge: {
    backgroundColor: Colors.success500,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  confirmationText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  readonlyContainer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: Colors.primary800,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  readonlyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  readonlyText: {
    fontSize: 14,
    color: Colors.primary50,
    textAlign: "center",
    fontWeight: "500",
  },
});