import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { Colors } from "../../constants/colors";
import ImagePicker from "./ImagePicker";
import LocationPicker from "./LocationPicker";
import Button from "../ui/Button";
import { Place } from "../../models/place";
import { Ionicons } from '@expo/vector-icons'; // Make sure to install expo/vector-icons

export default function PlaceForm({ onCreatePlace }) {
  const [enteredTitle, setEnteredTitle] = useState("");
  const [selectedImage, setSelectedImage] = useState();
  const [pickedLocation, setPickedLocation] = useState();
  const [isTitleFocused, setIsTitleFocused] = useState(false);

  function changeTitleHandler(enteredText) {
    setEnteredTitle(enteredText);
  }

  function savePlaceHandler() {
    if (!enteredTitle.trim() || !selectedImage || !pickedLocation) {
      // You can add validation feedback here
      return;
    }
    const placeData = new Place(enteredTitle, selectedImage, pickedLocation);
    onCreatePlace(placeData);
  }

  function takeImageHandler(imageUri) {
    setSelectedImage(imageUri);
  }

  const pickLocationHandler = useCallback((location) => {
    setPickedLocation(location);
  }, []);

  const isFormValid = enteredTitle.trim() && selectedImage && pickedLocation;

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView 
        style={styles.form}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Create New Place</Text>
          <Text style={styles.headerSubtitle}>Add details about your favorite place</Text>
        </View>

        <View style={styles.formContainer}>
          {/* Title Section */}
          <View style={styles.section}>
            <View style={styles.labelContainer}>
              <Ionicons name="location-outline" size={20} color={Colors.primary700} />
              <Text style={styles.label}>Place Title</Text>
            </View>
            <TextInput
              onChangeText={changeTitleHandler}
              value={enteredTitle}
              style={[
                styles.input,
                isTitleFocused && styles.inputFocused,
                enteredTitle.trim() && styles.inputValid
              ]}
              placeholder="Enter a memorable name..."
              placeholderTextColor={Colors.gray400}
              onFocus={() => setIsTitleFocused(true)}
              onBlur={() => setIsTitleFocused(false)}
            />
          </View>

          {/* Image Picker Section */}
          <View style={styles.section}>
            <View style={styles.labelContainer}>
              <Ionicons name="camera-outline" size={20} color={Colors.primary700} />
              <Text style={styles.label}>Photo</Text>
            </View>
            <ImagePicker onTakeImage={takeImageHandler} />
          </View>

          {/* Location Picker Section */}
          <View style={styles.section}>
            <View style={styles.labelContainer}>
              <Ionicons name="map-outline" size={20} color={Colors.primary700} />
              <Text style={styles.label}>Location</Text>
            </View>
            <LocationPicker onPickLocation={pickLocationHandler} />
          </View>

          {/* Save Button */}
          <View style={styles.buttonContainer}>
            <Button 
              onPress={savePlaceHandler}
              style={!isFormValid && styles.buttonDisabled}
            >
              <View style={styles.buttonContent}>
                <Ionicons name="save-outline" size={20} color="white" />
                <Text style={styles.buttonText}>Save Place</Text>
              </View>
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  form: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerSection: {
    backgroundColor: Colors.primary500,
    paddingTop: 48,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.gray200,
    opacity: 0.9,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 28,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontWeight: "600",
    fontSize: 16,
    color: Colors.primary700,
    marginLeft: 8,
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1.5,
    borderColor: Colors.gray300,
    color: Colors.gray800,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  inputFocused: {
    borderColor: Colors.primary500,
    borderWidth: 2,
    shadowColor: Colors.primary500,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputValid: {
    borderColor: Colors.success500,
  },
  buttonContainer: {
    marginTop: 32,
    marginBottom: 20,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});

