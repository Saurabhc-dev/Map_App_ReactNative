import {
  launchCameraAsync,
  useCameraPermissions,
  PermissionStatus,
  MediaTypeOptions,
} from "expo-image-picker";
import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { Colors } from "../../constants/colors";
import OutlinedButton from "../ui/OutlinedButton";

export default function ImagePicker({ onTakeImage }) {
  const [pickedImage, setPickedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraPermissionInformation, requestPermission] =
    useCameraPermissions();

  // ✅ Check permission properly
  async function verifyPermission() {
    if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }

    if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Permission Required",
        "Camera access is needed to take photos. Please enable it in settings.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Settings", onPress: () => {} }
        ]
      );
      return false;
    }

    return true;
  }

  // ✅ Handle image capture safely
  async function takeImageHandler() {
    const hasPermission = await verifyPermission();
    if (!hasPermission) return;

    setIsLoading(true);
    try {
      const image = await launchCameraAsync({
        mediaTypes: MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.7,
      });

      // ✅ handle cancel case
      if (image.canceled) return;

      const imageUri = image.assets[0].uri;
      setPickedImage(imageUri);
      onTakeImage(imageUri);
    } catch (error) {
      Alert.alert("Error", "Failed to capture image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function getImagePreview() {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.accent500} />
          <Text style={styles.loadingText}>Capturing image...</Text>
        </View>
      );
    }

    if (pickedImage) {
      return (
        <View style={styles.imageContainer}>
          <Image source={{ uri: pickedImage }} style={styles.image} />
          <View style={styles.imageOverlay}>
            <Text style={styles.imageOverlayText}>✓ Photo captured</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.placeholderContainer}>
        <Text style={styles.placeholderIcon}>📸</Text>
        <Text style={styles.placeholderText}>No image taken yet</Text>
        <Text style={styles.placeholderSubtext}>
          Tap the button below to take a photo
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.imagePreview}>{getImagePreview()}</View>

      <View style={styles.buttonWrapper}>
        <OutlinedButton icon="camera" onPress={takeImageHandler} disabled={isLoading}>
          {isLoading ? "Capturing..." : "Take Photo"}
        </OutlinedButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  imagePreview: {
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
  placeholderContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  placeholderIcon: {
    fontSize: 56,
    marginBottom: 12,
    opacity: 0.8,
  },
  placeholderText: {
    fontSize: 16,
    color: Colors.gray200,
    fontWeight: "500",
    marginBottom: 4,
  },
  placeholderSubtext: {
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
  imageContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(46, 66, 101, 0.9)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  imageOverlayText: {
    color: Colors.accent500,
    fontSize: 12,
    fontWeight: "600",
  },
  buttonWrapper: {
    marginTop: 8,
  },
});