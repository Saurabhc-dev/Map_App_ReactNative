import React from "react";
import { Pressable, StyleSheet, Text, ActivityIndicator, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";

export default function OutlinedButton({ 
  children, 
  icon, 
  onPress, 
  loading = false, 
  disabled = false 
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        pressed && !disabled && !loading && styles.pressed,
        (disabled || loading) && styles.disabled,
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator 
            size="small" 
            color={Colors.accent500} 
            style={styles.loader}
          />
        ) : (
          <Ionicons
            style={styles.icon}
            name={icon}
            size={18}
            color={disabled ? Colors.gray400 : Colors.accent500}
          />
        )}
        <Text style={[styles.text, (disabled || loading) && styles.disabledText]}>
          {loading ? "Loading..." : children}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    margin: 4,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.accent500,
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  pressed: {
    opacity: 0.8,
    backgroundColor: Colors.accent500 + "10",
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
    borderColor: Colors.gray400,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 8,
  },
  loader: {
    marginRight: 8,
  },
  text: {
    color: Colors.accent500,
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  disabledText: {
    color: Colors.gray400,
  },
});