import {
  launchCameraAsync,
  useCameraPermissions,
  PermissionStatus,
  MediaTypeOptions,
} from "expo-image-picker";
import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/colors";
import OutlinedButton from "../ui/OutlinedButton";

export default function ImagePicker({ onTakeImage }) {
  const [pickedImage, setPickedImage] = useState(null);
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
        "Permission denied",
        "Please enable camera access from settings.",
      );
      return false;
    }

    return true;
  }

  // ✅ Handle image capture safely
  async function takeImageHandler() {
    const hasPermission = await verifyPermission();
    if (!hasPermission) return;

    const image = await launchCameraAsync({
      mediaTypes: MediaTypeOptions.Images, // ✅ correct usage
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });

    // ✅ handle cancel case
    if (image.canceled) return;

    const imageUri = image.assets[0].uri;

    setPickedImage(imageUri);
    onTakeImage(imageUri);
  }

  return (
    <View>
      <View style={styles.imagePreview}>
        {pickedImage ? (
          <Image source={{ uri: pickedImage }} style={styles.image} />
        ) : (
          <Text>No image taken</Text>
        )}
      </View>

      <OutlinedButton icon="camera" onPress={takeImageHandler}>
        Take Image
      </OutlinedButton>
    </View>
  );
}

const styles = StyleSheet.create({
  imagePreview: {
    width: "100%",
    height: 200,
    marginVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary100,
    borderRadius: 4,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
    borderBottomLeftRadius: 4,
    borderTopLeftRadius: 4,
  },
});
